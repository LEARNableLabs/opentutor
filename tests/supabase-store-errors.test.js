import { it, expect, vi } from 'vitest';
import os from 'node:os';
import { createClient } from '@supabase/supabase-js';
import { SupabaseStore } from '../lib/core/supabase-store.js';

// #157 — readUser() and readProgress() took a database error for "no row yet",
// and writeUser() and writeProgress() never looked at theirs. #170 — the same
// for lesson completion, learning logs and saved curricula. The real client
// against a PostgREST double, because the difference is on the wire: `.single()`
// gets a 406 when there is no row, `.maybeSingle()` does not.

// Each table's primary key: an upsert replaces the row with the same key.
const KEYS = { kv: ['user_id', 'key'], lessons_completed: ['user_id', 'slug', 'day'], domain_files: ['user_id', 'slug', 'filename'], curricula: ['user_id', 'slug'] };

/**
 * The store's tables. A request whose method, or "method table", is in `failing`
 * gets a database error back.
 */
function postgrest({ failing = [] } = {}) {
  const tables = Object.fromEntries(Object.keys(KEYS).map((t) => [t, []]));
  const methods = [];
  const fetch = async (url, init) => {
    const { pathname, searchParams } = new URL(url);
    const table = pathname.split('/').pop();
    methods.push(init.method);
    if (failing.includes(init.method) || failing.includes(`${init.method} ${table}`)) {
      return Response.json({ code: '42P01', message: `relation "${table}" does not exist`, details: null, hint: null }, { status: 404 });
    }
    const rows = tables[table];
    if (init.method === 'POST') {
      const row = JSON.parse(init.body);
      const i = rows.findIndex((r) => KEYS[table].every((k) => String(r[k]) === String(row[k])));
      if (i < 0) rows.push(row); else rows[i] = row;
      return new Response(null, { status: 201 });
    }
    // Every filter the store sends here is an equality, `column=eq.value`.
    const found = rows.filter((r) => [...searchParams].every(([k, v]) => !v.startsWith('eq.') || String(r[k]) === v.slice(3)));
    // `.single()` asks for exactly one object, and PostgREST refuses when there is none.
    const single = new Headers(init.headers).get('Accept')?.includes('vnd.pgrst.object');
    if (single && found.length !== 1) {
      return Response.json({ code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned', details: 'The result contains 0 rows', hint: null }, { status: 406 });
    }
    return Response.json(single ? found[0] : found);
  };
  const client = createClient('https://test.supabase.co', 'test-key', { auth: { persistSession: false }, global: { fetch } });
  return { tables, rows: tables.kv, methods, store: new SupabaseStore(os.tmpdir(), { client, userId: 'alice' }) };
}

it('reads the defaults for a student with no profile or progress yet', async () => {
  const { store } = postgrest();
  expect(await store.readUser()).toBe('');
  expect(await store.readProgress()).toEqual({ active_topics: [], schedule: {}, history: [], onboarding: null });
});

it('reads back the profile and progress it wrote', async () => {
  const { store } = postgrest();
  await store.writeUser('# Student Profile\n- **Name:** Ada');
  await store.updateProgress((p) => p.active_topics.push('knots'));
  expect(await store.readUser()).toContain('Ada');
  expect((await store.readProgress()).active_topics).toEqual(['knots']);
});

it.each(['readUser', 'readProgress', 'writeUser', 'writeProgress'])('%s throws when the database fails', async (method) => {
  const { store } = postgrest({ failing: ['GET', 'POST'] });
  await expect(store[method]({})).rejects.toMatchObject({ message: 'relation "kv" does not exist' });
});

it('never writes progress over a read that failed', async () => {
  const { store, rows, methods } = postgrest({ failing: ['GET'] });
  rows.push({ user_id: 'alice', key: 'progress', value: { active_topics: ['knots'], history: [] } });
  const change = vi.fn((p) => p.history.push('lesson'));

  await expect(store.updateProgress(change)).rejects.toMatchObject({ code: '42P01' });
  expect(change).not.toHaveBeenCalled();
  expect(methods).toEqual(['GET']);
  expect(rows[0].value).toEqual({ active_topics: ['knots'], history: [] });
});

// ── #170: lesson state ─────────────────────────────────────

const CURRICULUM = { topic: 'Knots', lessons: [{ lesson: 1, title: 'Loops' }, { lesson: 2, title: 'Braids' }] };

it('reads nothing where nothing is saved, and reads back the lesson state it wrote', async () => {
  const { store } = postgrest();
  expect(await store.readCurriculum('knots')).toBeNull();
  expect(await store.readDomainFile('knots', 'learning.md')).toBeNull();

  await store.writeCurriculum('knots', CURRICULUM);
  await store.writeDomainFile('knots', 'learning.md', '# Learning Log: Knots');
  await store.markLessonComplete('knots', 1, 'engaged');
  expect((await store.getNextLesson('knots')).title).toBe('Braids');
  expect(await store.readDomainFile('knots', 'learning.md')).toBe('# Learning Log: Knots');
});

it.each([
  ['markLessonComplete', 'POST lessons_completed', (s) => s.markLessonComplete('knots', 1)],
  ['getNextLesson, reading the completions', 'GET lessons_completed', (s) => s.getNextLesson('knots')],
  ['readCurriculum, reading a saved curriculum', 'GET curricula', (s) => s.readCurriculum('knots')],
  ['writeCurriculum', 'POST curricula', (s) => s.writeCurriculum('knots', CURRICULUM)],
  ['readDomainFile learning.md', 'GET domain_files', (s) => s.readDomainFile('knots', 'learning.md')],
  ['readDomainFile practice-feedback.md', 'GET domain_files', (s) => s.readDomainFile('knots', 'practice-feedback.md')],
  ['writeDomainFile learning.md', 'POST domain_files', (s) => s.writeDomainFile('knots', 'learning.md', '# Log')],
  ['writeDomainFile practice-feedback.md', 'POST domain_files', (s) => s.writeDomainFile('knots', 'practice-feedback.md', 'BLOCK: loops')],
])('%s throws when the database fails', async (_name, failure, call) => {
  const { store, tables } = postgrest({ failing: [failure] });
  tables.curricula.push({ user_id: 'alice', slug: 'knots', topic: 'Knots', data: CURRICULUM });
  await expect(call(store)).rejects.toMatchObject({ code: '42P01' });
});

it('records no lesson in the history when the completion was not saved', async () => {
  const { store, tables } = postgrest({ failing: ['POST lessons_completed'] });
  await expect(store.markLessonComplete('knots', 1)).rejects.toMatchObject({ message: 'relation "lessons_completed" does not exist' });
  expect(tables.kv).toEqual([]);
});
