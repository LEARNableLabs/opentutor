import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorState } from '../lib/core/state.js';
import { TutorStore } from '../lib/core/store.js';

// #80 — every surface shared one student's state. `kv` was keyed on `key`
// alone and `lessons_completed` on `(slug, day)`, so two students on one
// instance shared a profile, shared progress, and one finishing a lesson
// marked it finished for the other.
//
// A store is now scoped to a student at construction rather than threading a
// userId through all 31 methods. Curricula stay shared: they are content, like
// the 293 shipped on disk, not personal state.

let root;
beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-tenant-')); });
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

const backends = [
  ['TutorState', (opts) => new TutorState(root, opts)],
  ['TutorStore', (opts) => new TutorStore(root, opts)],
];

describe.each(backends)('%s scoped to a student', (_name, make) => {
  let alice, bob;
  beforeEach(() => {
    alice = make({ userId: 'alice' });
    bob = make({ userId: 'bob' });
  });
  afterEach(() => { alice.close?.(); bob.close?.(); });

  it('keeps profiles apart', async () => {
    await alice.writeUser('# Student Profile\n- **Name:** Alice');
    await bob.writeUser('# Student Profile\n- **Name:** Bob');

    expect(await alice.readUser()).toContain('Alice');
    expect(await alice.readUser()).not.toContain('Bob');
    expect(await bob.readUser()).toContain('Bob');
  });

  it('keeps progress apart', async () => {
    await alice.writeProgress({ active_topics: ['knot-theory'], schedule: {}, history: [] });
    await bob.writeProgress({ active_topics: ['combinatorics'], schedule: {}, history: [] });

    expect((await alice.readProgress()).active_topics).toEqual(['knot-theory']);
    expect((await bob.readProgress()).active_topics).toEqual(['combinatorics']);
  });

  it('does not mark a lesson done for everyone when one student finishes it', async () => {
    // Seed a real curriculum first — with none on disk the completion overlay
    // has nothing to apply to and the assertion passes for the wrong reason.
    const curriculum = { topic: 'Knot theory', lessons: [{ lesson: 1, title: 'Reidemeister moves' }, { lesson: 2, title: 'Invariants' }] };
    await alice.writeCurriculum('knot-theory', curriculum);

    expect((await alice.readCurriculum('knot-theory')).lessons).toHaveLength(2);

    await alice.markLessonComplete('knot-theory', 1, 'engaged');

    const mine = (await alice.readCurriculum('knot-theory')).lessons.filter((l) => l.status === 'completed');
    expect(mine, 'alice finished lesson 1').toHaveLength(1);

    const theirs = ((await bob.readCurriculum('knot-theory'))?.lessons || []).filter((l) => l.status === 'completed');
    expect(theirs, 'bob has not done this lesson').toEqual([]);
  });

  it('keeps session memory apart', async () => {
    // TutorState writes memory as files under the workspace, so scoping the
    // workspace covered it. TutorStore writes to a SQLite `memory` table that
    // had no key at all — every student appended to one shared log.
    await alice.appendMemory('alice struggled with the unknot');
    await bob.appendMemory('bob breezed through invariants');

    expect(await alice.readRecentMemory(2)).toContain('alice struggled');
    expect(await alice.readRecentMemory(2)).not.toContain('bob breezed');
    expect(await bob.readRecentMemory(2)).not.toContain('alice struggled');
  });

  it('starts a new student from the blank template, not the last one’s profile', async () => {
    await alice.writeUser('# Student Profile\n- **Name:** Alice\n- **Timezone:** Europe/Rome');

    const carol = make({ userId: 'carol' });
    try {
      const profile = await carol.readUser();
      expect(profile).toContain('Student Profile');
      expect(profile).not.toContain('Alice');
      expect(profile).not.toContain('Europe/Rome');
    } finally { carol.close?.(); }
  });
});

describe.each(backends)('%s with no student named', (_name, make) => {
  let store;
  beforeEach(() => { store = make(); });
  afterEach(() => store.close?.());

  // Every existing caller — the bot, the local web server, the CLI — constructs
  // a store with no userId and must keep behaving exactly as before.
  it('still reads and writes, as the single-user install always did', async () => {
    await store.writeUser('# Student Profile\n- **Name:** Ada');
    await store.writeProgress({ active_topics: ['topology'], schedule: {}, history: [] });

    expect(await store.readUser()).toContain('Ada');
    expect((await store.readProgress()).active_topics).toEqual(['topology']);
  });

  it('is a student like any other, so a scoped store cannot read it', async () => {
    await store.writeUser('# Student Profile\n- **Name:** Ada');

    const scoped = make({ userId: 'alice' });
    try {
      expect(await scoped.readUser()).not.toContain('Ada');
    } finally { scoped.close?.(); }
  });
});

describe('a student id is a trust boundary', () => {
  // It becomes a directory name and a primary-key value, and a provisioning
  // API takes it from a request body.
  it.each([
    ['../escape', 'path traversal'],
    ['..', 'parent directory'],
    ['a/b', 'separator'],
    ['a\\b', 'windows separator'],
    ['', 'empty'],
    ['-leading-dash', 'could read as a flag'],
    ['x'.repeat(65), 'too long'],
    ['space name', 'whitespace'],
  ])('rejects %s (%s)', (bad) => {
    expect(() => new TutorState(root, { userId: bad })).toThrow(/Invalid student id/);
  });

  it('accepts the ids a provisioning API would actually mint', () => {
    for (const ok of ['alice', 'user_42', 'a', 'Student-1', '1234567890']) {
      expect(() => { new TutorState(root, { userId: ok }).readUser(); }).not.toThrow();
    }
  });

  it('never writes outside the workspace', () => {
    const alice = new TutorState(root, { userId: 'alice' });
    alice.writeUser('# Student Profile\n- **Name:** Alice');
    expect(fs.existsSync(path.join(root, 'workspace', 'students', 'alice', 'USER.md'))).toBe(true);
  });
});

describe('a database created before student partitioning', () => {
  // CREATE TABLE IF NOT EXISTS does nothing to a table that already exists, so
  // without a migration an existing install would keep its single-tenant kv
  // forever and every student would collide on one row per key.
  it('keeps its data, now owned by the unnamed install', async () => {
    const before = new TutorStore(root);
    await before.writeUser('# Student Profile\n- **Name:** Ada');
    await before.writeProgress({ active_topics: ['topology'], schedule: {}, history: [] });
    before.close?.();

    // Rebuild the v1 table underneath, exactly as an old install would have it.
    const { default: Database } = await import('better-sqlite3');
    const db = new Database(path.join(root, 'workspace', 'tutor', 'opentutor.db'));
    db.exec(`
      CREATE TABLE kv_old (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      INSERT INTO kv_old (key, value) SELECT key, value FROM kv;
      DROP TABLE kv;
      ALTER TABLE kv_old RENAME TO kv;
    `);
    expect(db.prepare('PRAGMA table_info(kv)').all().map((c) => c.name)).not.toContain('user_id');
    db.close();

    const after = new TutorStore(root);
    try {
      expect(await after.readUser(), 'the profile survived the migration').toContain('Ada');
      expect((await after.readProgress()).active_topics).toEqual(['topology']);
    } finally { after.close?.(); }
  });
});
