import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { generatedTopicKey } from '../../lib/core/generated-topics.js';

// #117 — SupabaseStore moved kv to Postgres and left three writes on disk.
// On Vercel everything outside /tmp is read-only, so all three threw, the
// lesson route swallowed it, and the student was told they were done.
//
// The store is exercised here against an in-memory Postgres double and a
// **read-only** workspace, which is the combination production actually has.
// A test with a writable temp dir cannot fail the way production does — that
// is why 378 of them passed while the deployment forgot everything.

const TABLES = ['kv', 'lessons_completed', 'domain_files', 'curricula', 'memory', 'sessions'];
const MAX_ROWS = 1000; // Supabase's default

/**
 * Enough of PostgREST's builder to serve this store, backed by arrays.
 *
 * Like PostgREST, no response carries more than MAX_ROWS: a read that does
 * not page loses the rest without an error (#137). `requests` counts round trips.
 */
function fakePostgrest() {
  const db = Object.fromEntries(TABLES.map((t) => [t, []]));

  const query = (table) => {
    const filters = [];
    const sorts = [];
    let span = [0, Infinity];
    const match = (row) => filters.every(([op, col, val]) =>
      op === 'eq' ? String(row[col]) === String(val)
        : op === 'like' ? String(row[col]).startsWith(val.replace(/%$/, ''))
          : String(row[col]) >= String(val));
    const compare = (a, b) => {
      for (const [col, dir] of sorts) if (a[col] !== b[col]) return (a[col] < b[col] ? -1 : 1) * dir;
      return 0;
    };

    const builder = {
      _rows: () => db[table].filter(match).sort(compare).slice(span[0], Math.min(span[1], span[0] + MAX_ROWS)),
      eq(col, val) { filters.push(['eq', col, val]); return builder; },
      gte(col, val) { filters.push(['gte', col, val]); return builder; },
      like(col, val) { filters.push(['like', col, val]); return builder; },
      order(col, { ascending = true } = {}) { sorts.push([col, ascending ? 1 : -1]); return builder; },
      range(from, to) {
        // Without an ORDER BY, Postgres may hand back the same row on two pages and skip another.
        if (!sorts.length) throw new Error(`range() on ${table} without order()`);
        span = [from, to + 1];
        return builder;
      },
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

  const fake = { db, requests: 0, from: (t) => { fake.requests += 1; return query(t); } };
  return fake;
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

// #137 — GET /api/topics called getTopicProgress() once per topic, two round
// trips each: 586 in series for the 293 shipped topics, 58 s on production.
describe('listTopicProgress reads every topic in a fixed number of queries', () => {
  const domains = () => path.join(root, 'skills', 'tutor', 'domains');
  const ship = (slug, curriculum) => {
    fs.mkdirSync(path.join(domains(), slug), { recursive: true });
    fs.writeFileSync(path.join(domains(), slug, 'curriculum.json'), JSON.stringify(curriculum));
  };
  const lessons = (n) => Array.from({ length: n }, (_, i) => ({ lesson: i + 1, title: `L${i + 1}`, status: 'pending' }));
  const generated = (s, slug, curriculum) => s.writeKV(generatedTopicKey(slug), { id: slug, revision: 1, curriculum });

  /** What the route built before: listTopics(), then getTopicProgress() one topic at a time. */
  const perTopic = async (s) => {
    const out = [];
    for (const slug of await s.listTopics()) {
      const progress = await s.getTopicProgress(slug);
      if (progress?.topic) out.push({ slug, ...progress });
    }
    return out;
  };

  it('returns what listTopics() and getTopicProgress() return, in the same order', async () => {
    ship('algebra', { topic: 'Algebra', lessons: lessons(3) });
    ship('bread', { topic: 'Bread', lessons: lessons(4) });
    ship('untitled', { lessons: lessons(2) });
    fs.mkdirSync(path.join(domains(), 'no-curriculum'));

    const alice = store({ userId: 'alice' });
    await generated(alice, 'bread', { topic: 'Sourdough', lessons: lessons(2) });
    await generated(alice, 'knots', { topic: 'Knots', lessons: lessons(3) });
    await generated(alice, 'still-building', null);
    await alice.writeCurriculum('old-topic', { topic: 'Old topic', lessons: lessons(2) });
    await alice.markLessonComplete('game-theory', 1, 'engaged');
    await alice.markLessonComplete('bread', 2);
    await alice.markLessonComplete('knots', 1);
    await alice.markLessonComplete('knots', 3, 'struggled');
    await alice.markLessonComplete('old-topic', 2);

    const bob = store({ userId: 'bob' });
    await bob.markLessonComplete('algebra', 1);
    await generated(bob, 'bobs-topic', { topic: 'Bob', lessons: lessons(1) });
    await bob.writeCurriculum('bobs-legacy', { topic: 'Bob legacy', lessons: lessons(1) });
    freeze();

    const expected = await perTopic(alice);
    // The fixture reaches every case: shipped, a shipped slug shadowed by a
    // generated curriculum, a new generated topic, a legacy row, completions.
    expect(expected.map((t) => t.slug).slice(-2)).toEqual(['knots', 'old-topic']);
    expect(expected.map((t) => t.slug).sort()).toEqual(['algebra', 'bread', 'game-theory', 'knots', 'old-topic']);
    expect(expected.find((t) => t.slug === 'bread')).toMatchObject({ topic: 'Sourdough', total: 2, completed: 1 });
    expect(expected.find((t) => t.slug === 'knots')).toMatchObject({ completed: 2, current: { lesson: 2 } });
    expect(expected.find((t) => t.slug === 'old-topic')).toMatchObject({ completed: 1, current: { lesson: 1 } });

    expect(await alice.listTopicProgress()).toStrictEqual(expected);
  });

  it('makes the same three queries for one topic or sixty-one', async () => {
    const alice = store({ userId: 'alice' });
    const requests = async () => {
      client.requests = 0;
      await alice.listTopicProgress();
      return client.requests;
    };
    expect(await requests()).toBe(3);

    for (let i = 0; i < 20; i++) {
      ship(`shipped-${i}`, { topic: `Shipped ${i}`, lessons: lessons(3) });
      await generated(alice, `generated-${i}`, { topic: `Generated ${i}`, lessons: lessons(3) });
      await alice.writeCurriculum(`legacy-${i}`, { topic: `Legacy ${i}`, lessons: lessons(3) });
      await alice.markLessonComplete(`shipped-${i}`, 1);
      await alice.markLessonComplete(`generated-${i}`, 2);
      await alice.markLessonComplete(`legacy-${i}`, 3);
    }
    expect(await alice.listTopicProgress()).toHaveLength(61);
    expect(await requests()).toBe(3);
  });

  it('keeps every completion past the 1000 rows PostgREST returns per response', async () => {
    // 2,100 rows: three pages, with two topics split across page boundaries.
    for (const slug of ['cap-a', 'cap-b', 'cap-c']) {
      ship(slug, { topic: slug, lessons: lessons(700) });
      for (let day = 1; day <= 700; day++) {
        client.db.lessons_completed.push({ user_id: 'alice', slug, day, date: '2026-09-24', engagement: 'delivered' });
      }
    }

    const topics = await store({ userId: 'alice' }).listTopicProgress();
    const completed = Object.fromEntries(topics.map((t) => [t.slug, t.completed]));
    expect(completed).toMatchObject({ 'cap-a': 700, 'cap-b': 700, 'cap-c': 700 });
  });
});
