import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// #117 — SupabaseStore moved kv to Postgres and left three writes on disk.
// On Vercel everything outside /tmp is read-only, so all three threw, the
// lesson route swallowed it, and the student was told they were done.
//
// The store is exercised here against an in-memory Postgres double and a
// **read-only** workspace, which is the combination production actually has.
// A test with a writable temp dir cannot fail the way production does — that
// is why 378 of them passed while the deployment forgot everything.

const TABLES = ['kv', 'lessons_completed', 'domain_files', 'curricula', 'memory', 'sessions'];

/** Enough of PostgREST's builder to serve this store, backed by arrays. */
function fakePostgrest() {
  const db = Object.fromEntries(TABLES.map((t) => [t, []]));

  const query = (table) => {
    const filters = [];
    const match = (row) => filters.every(([op, col, val]) =>
      op === 'eq' ? String(row[col]) === String(val) : String(row[col]) >= String(val));

    const builder = {
      _rows: () => db[table].filter(match),
      eq(col, val) { filters.push(['eq', col, val]); return builder; },
      gte(col, val) { filters.push(['gte', col, val]); return builder; },
      order() { return builder; },
      limit() { return builder; },
      select() { return builder; },
      maybeSingle: async () => ({ data: builder._rows()[0] ?? null, error: null }),
      single: async () => ({ data: builder._rows()[0] ?? null, error: null }),
      then: (resolve) => resolve({ data: builder._rows(), error: null }),
      insert: async (row) => { db[table].push({ ...row }); return { error: null }; },
      upsert: async (row) => {
        const keys = Object.keys(row).filter((k) => ['user_id', 'key', 'slug', 'day', 'filename'].includes(k));
        const i = db[table].findIndex((r) => keys.every((k) => String(r[k]) === String(row[k])));
        if (i >= 0) db[table][i] = { ...db[table][i], ...row }; else db[table].push({ ...row });
        return { error: null };
      },
      delete: () => builder,
    };
    return builder;
  };

  return { db, from: (t) => query(t) };
}

let root, client, SupabaseStore;

beforeEach(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-sb-'));
  fs.mkdirSync(path.join(root, 'skills', 'tutor', 'domains', 'game-theory'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'skills', 'tutor', 'domains', 'game-theory', 'curriculum.json'),
    JSON.stringify({ topic: 'Game theory', lessons: [{ lesson: 1, title: 'A' }, { lesson: 2, title: 'B' }] }),
  );

  client = fakePostgrest();
  vi.doMock('@supabase/supabase-js', () => ({ createClient: () => client }));
  vi.resetModules();
  ({ SupabaseStore } = await import('../../lib/core/supabase-store.js'));

  vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('SUPABASE_SECRET_KEY', 'sb_secret_test');
});

afterEach(() => {
  try {
    const thaw = (dir) => {
      fs.chmodSync(dir, 0o755);
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) thaw(path.join(dir, e.name));
      }
    };
    thaw(root);
  } catch { /* fine */ }
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.doUnmock('@supabase/supabase-js');
});

/**
 * The production shape: nothing under the deployment root is writable.
 *
 * Recursive on purpose — chmod on the root alone leaves its subdirectories
 * writable, so writeCurriculum could still create skills/tutor/domains/<new>/
 * and the test passed while production failed.
 */
const freeze = () => {
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name));
    }
    fs.chmodSync(dir, 0o555);
  };
  walk(root);
};

const store = (opts) => new SupabaseStore(root, opts);

describe('on a read-only filesystem, as on Vercel', () => {
  it('records a completed lesson', async () => {
    const s = store();
    freeze();

    await s.markLessonComplete('game-theory', 1, 'engaged');

    const curriculum = await s.readCurriculum('game-theory');
    const done = curriculum.lessons.filter((l) => l.status === 'completed');
    expect(done, 'the lesson the student just finished').toHaveLength(1);
    expect(done[0].lesson).toBe(1);
  });

  it('keeps the completion across a restart', async () => {
    const s = store();
    freeze();
    await s.markLessonComplete('game-theory', 1, 'engaged');

    // A new instance is what the next serverless invocation gets.
    const next = store();
    const curriculum = await next.readCurriculum('game-theory');
    expect(curriculum.lessons.filter((l) => l.status === 'completed')).toHaveLength(1);
  });

  it('writes and reads back the learning log', async () => {
    const s = store();
    freeze();

    await s.writeDomainFile('game-theory', 'learning.md', '# Session\nStudent grasped payoffs.');

    expect(await store().readDomainFile('game-theory', 'learning.md')).toContain('payoffs');
  });

  it('writes and reads back practice directives', async () => {
    const s = store();
    freeze();

    await s.writeDomainFile('game-theory', 'practice-feedback.md', 'BLOCK: Nash equilibrium');

    expect(await store().readDomainFile('game-theory', 'practice-feedback.md')).toContain('BLOCK');
  });

  it('persists a generated curriculum', async () => {
    const s = store();
    freeze();

    await s.writeCurriculum('knot-theory', { topic: 'Knot theory', lessons: [{ lesson: 1, title: 'Reidemeister' }] });

    const read = await store().readCurriculum('knot-theory');
    expect(read?.lessons, 'a topic generated at runtime must survive').toHaveLength(1);
  });

  it('still reads the 293 shipped curricula from disk', async () => {
    freeze();
    // Read-only is no obstacle for content that ships with the deployment.
    expect((await store().readCurriculum('game-theory')).lessons).toHaveLength(2);
  });
});

describe('per-student isolation still holds (#80)', () => {
  it('one student completing a lesson does not complete it for another', async () => {
    const alice = store({ userId: 'alice' });
    freeze();
    await alice.markLessonComplete('game-theory', 1, 'engaged');

    const bob = store({ userId: 'bob' });
    const seen = await bob.readCurriculum('game-theory');
    expect(seen.lessons.filter((l) => l.status === 'completed')).toEqual([]);
  });

  it('keeps learning logs apart', async () => {
    freeze();
    await store({ userId: 'alice' }).writeDomainFile('game-theory', 'learning.md', 'alice struggled with payoffs');
    await store({ userId: 'bob' }).writeDomainFile('game-theory', 'learning.md', 'bob breezed through');

    expect(await store({ userId: 'alice' }).readDomainFile('game-theory', 'learning.md')).toContain('alice');
    expect(await store({ userId: 'alice' }).readDomainFile('game-theory', 'learning.md')).not.toContain('bob');
  });
});

describe('what stays on disk', () => {
  it('reads shipped domain files from the package, not the database', async () => {
    fs.writeFileSync(path.join(root, 'skills', 'tutor', 'domains', 'game-theory', 'resources.md'), '# Books');
    freeze();

    expect(await store().readDomainFile('game-theory', 'resources.md')).toContain('Books');
  });
});
