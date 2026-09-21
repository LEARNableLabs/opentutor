import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { TutorState } from '../lib/core/state.js';
import { TutorStore } from '../lib/core/store.js';

// #105 — USER.md and tutor/progress.json are written while the tutor runs, so
// they cannot also be tracked template files: a student's real name, timezone
// and learning preferences ended up in `git status`.
//
// The templates now live under workspace/templates/ and are copied into place on
// first use. Writing runtime state must never touch them.

const REPO = path.resolve('.');
let root;

const userFile = () => path.join(root, 'workspace', 'USER.md');
const progressFile = () => path.join(root, 'workspace', 'tutor', 'progress.json');

beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-seed-')); });
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

const stores = [
  ['TutorState', () => new TutorState(root)],
  ['TutorStore', () => new TutorStore(root)],
];

describe('the shipped templates', () => {
  it('exist and are tracked', () => {
    for (const f of ['workspace/templates/USER.md', 'workspace/templates/progress.json']) {
      expect(fs.existsSync(path.join(REPO, f)), `${f} should ship`).toBe(true);
    }
  });

  it('carry no personal data', () => {
    const user = fs.readFileSync(path.join(REPO, 'workspace/templates/USER.md'), 'utf-8');
    const filled = [...user.matchAll(/^-\s+\*\*[^*]+:\*\*[ \t]*(.+)$/gm)]
      .map((m) => m[1].trim())
      .filter((v) => v && !v.startsWith('_('));
    expect(filled).toEqual([]);
  });

  it('ships a progress template that parses and is empty', () => {
    const p = JSON.parse(fs.readFileSync(path.join(REPO, 'workspace/templates/progress.json'), 'utf-8'));
    expect(p.active_topics).toEqual([]);
    expect(p.history).toEqual([]);
  });
});

describe.each(stores)('%s on a fresh workspace', (_name, make) => {
  let store;
  beforeEach(() => { store = make(); });
  afterEach(() => store.close?.());

  it('seeds USER.md from the template', async () => {
    expect(await store.readUser()).toContain('Student Profile');
    expect(fs.existsSync(userFile())).toBe(true);
  });

  it('seeds progress.json from the template', async () => {
    expect(await store.readProgress()).toMatchObject({ active_topics: [], history: [] });
  });

  it('keeps what the student wrote, rather than re-seeding over it', async () => {
    await store.writeUser('# Student Profile\n- **Name:** Ada');
    expect(await store.readUser()).toContain('Ada');

    store.close?.();
    store = make();                       // restart
    expect(await store.readUser()).toContain('Ada');
  });

  it('never writes back into the shipped template', async () => {
    const before = fs.readFileSync(path.join(REPO, 'workspace/templates/USER.md'), 'utf-8');
    await store.writeUser('# Student Profile\n- **Name:** Ada\n- **Timezone:** Europe/Rome');
    await store.writeProgress({ active_topics: ['knot-theory'], schedule: {}, history: [{ date: '2026-09-21' }] });

    expect(fs.readFileSync(path.join(REPO, 'workspace/templates/USER.md'), 'utf-8')).toBe(before);
    // Where it lands differs by store (file vs SQLite); what matters is that
    // the store reads it back and the shipped template is untouched.
    expect(await store.readUser()).toContain('Ada');
    expect((await store.readProgress()).active_topics).toEqual(['knot-theory']);
  });
});

describe('the repository itself', () => {
  // Ask git rather than string-matching .gitignore: a rule can be present and
  // still not apply (wrong anchor, later negation), and that is the bug.
  const ignores = (f) =>
    spawnSync('git', ['check-ignore', '-q', f], { cwd: REPO }).status === 0;

  it.each([
    'workspace/USER.md',
    'workspace/tutor/progress.json',
    'workspace/memory/2026-09-21.md',
    'workspace/students/12345/progress.json',
    'workspace/groups/-100123/config.json',
  ])('ignores the runtime file %s', (f) => {
    expect(ignores(f)).toBe(true);
  });

  it('still tracks the templates and the directory placeholders', () => {
    for (const f of ['workspace/templates/USER.md', 'workspace/memory/.gitkeep']) {
      expect(ignores(f), `${f} must stay tracked`).toBe(false);
    }
  });
});
