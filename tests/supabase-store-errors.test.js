import { it, expect, vi } from 'vitest';
import os from 'node:os';
import { createClient } from '@supabase/supabase-js';
import { SupabaseStore } from '../lib/core/supabase-store.js';

// #157 — readUser() and readProgress() took a database error for "no row yet",
// and writeUser() and writeProgress() never looked at theirs. The real client
// against a PostgREST double, because the difference is on the wire: `.single()`
// gets a 406 when there is no row, `.maybeSingle()` does not.

/** The kv endpoint. Every request whose method is in `failing` gets a database error back. */
function postgrest({ failing = [] } = {}) {
  const rows = [];
  const methods = [];
  const fetch = async (url, init) => {
    methods.push(init.method);
    if (failing.includes(init.method)) {
      return Response.json({ code: '42P01', message: 'relation "kv" does not exist', details: null, hint: null }, { status: 404 });
    }
    if (init.method === 'POST') {
      const row = JSON.parse(init.body);
      const i = rows.findIndex((r) => r.user_id === row.user_id && r.key === row.key);
      if (i < 0) rows.push(row); else rows[i] = row;
      return new Response(null, { status: 201 });
    }
    const q = new URL(url).searchParams;
    const found = rows.filter((r) => q.get('user_id') === `eq.${r.user_id}` && q.get('key') === `eq.${r.key}`)
      .map(({ value }) => ({ value }));
    // `.single()` asks for exactly one object, and PostgREST refuses when there is none.
    const single = new Headers(init.headers).get('Accept')?.includes('vnd.pgrst.object');
    if (single && found.length !== 1) {
      return Response.json({ code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned', details: 'The result contains 0 rows', hint: null }, { status: 406 });
    }
    return Response.json(single ? found[0] : found);
  };
  const client = createClient('https://test.supabase.co', 'test-key', { auth: { persistSession: false }, global: { fetch } });
  return { rows, methods, store: new SupabaseStore(os.tmpdir(), { client, userId: 'alice' }) };
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
