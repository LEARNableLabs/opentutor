import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorState } from '../../lib/core/state.js';
import { TutorStore } from '../../lib/core/store.js';

// #117 — 378 unit tests passed while the deployed tutor could not remember a
// single lesson. Every one of them built a store against a writable temp dir,
// so none exercised the constraint that actually breaks production: on Vercel
// everything outside /tmp is read-only, and `markLessonComplete` writes to
// workspace/tutor/completions.json.
//
// The failure mode is the dangerous kind. The write throws EROFS, api/lesson.js
// swallows it in `safely()` without logging, and the student is told `done:
// true`. They are taught well and remembered not at all.
//
// These tests pin the contract: persistence may fail loudly, never silently.
// A store that reports success must be able to read the state back.

let root;

beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-ro-')); });
afterEach(() => {
  // Restore write permission first, or the cleanup itself fails.
  try { fs.chmodSync(path.join(root, 'workspace'), 0o755); } catch { /* never created */ }
  fs.rmSync(root, { recursive: true, force: true });
});

const backends = [
  ['TutorState', (opts) => new TutorState(root, opts)],
  ['TutorStore', (opts) => new TutorStore(root, opts)],
];

const CURRICULUM = {
  topic: 'Game theory',
  lessons: [{ lesson: 1, title: 'What makes a game' }, { lesson: 2, title: 'Nash equilibrium' }],
};

/** Make the workspace unwritable, the way a serverless deployment's disk is. */
const freeze = () => fs.chmodSync(path.join(root, 'workspace'), 0o555);

describe.each(backends)('%s on a read-only filesystem', (_name, make) => {
  let store;

  beforeEach(async () => {
    store = make();
    await store.writeCurriculum('game-theory', CURRICULUM);
    // Touch the state paths while we still can, so the failure under test is
    // the write itself rather than a missing parent directory.
    await store.readProgress();
    await store.readUser();
  });
  afterEach(() => store.close?.());

  it('does not report a completed lesson it could not save', async () => {
    freeze();

    let threw = false;
    try {
      await store.markLessonComplete('game-theory', 1, 'engaged');
    } catch {
      threw = true;
    }

    if (threw) return;   // failing loudly is an acceptable outcome

    // It claimed success, so the state must actually be there. Reading through
    // a fresh store is the point: an in-process cache would hide the loss.
    const fresh = make();
    try {
      const curriculum = await fresh.readCurriculum('game-theory');
      const completed = curriculum.lessons.filter((l) => l.status === 'completed');
      expect(completed, 'reported success, so lesson 1 must read back as completed').toHaveLength(1);
    } finally {
      fresh.close?.();
    }
  });

  it('does not report a written learning log it could not save', async () => {
    freeze();

    let threw = false;
    try {
      await store.writeDomainFile('game-theory', 'learning.md', '# Session\nStudent grasped payoffs.');
    } catch {
      threw = true;
    }
    if (threw) return;

    const fresh = make();
    try {
      expect(await fresh.readDomainFile('game-theory', 'learning.md')).toContain('payoffs');
    } finally {
      fresh.close?.();
    }
  });

  it('can still teach — reads keep working when writes cannot', async () => {
    freeze();

    // The distinction that makes #117 worth fixing rather than refusing to
    // serve: delivering a lesson only needs reads, which are fine.
    const curriculum = await store.readCurriculum('game-theory');
    expect(curriculum.lessons).toHaveLength(2);
    expect(await store.getNextLesson('game-theory')).toMatchObject({ lesson: 1 });
  });
});
