import { it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { TutorStore } from '../lib/core/store.js';
import { ensureAccount, accountId } from '../lib/core/accounts.js';
import { readKey, saveKey } from '../lib/core/llm-access.js';
import { openrouterHandler } from '../api/_lib/openrouter.js';
import accountRoute from '../api/account.js';

const alice = { id: '11111111-1111-4111-8111-111111111111', email: 'alice@example.test', email_confirmed_at: '2026-01-01', user_metadata: { name: 'Alice' } };
const bob = { id: '22222222-2222-4222-8222-222222222222', email: 'bob@example.test', email_confirmed_at: '2026-01-01', user_metadata: { name: 'Bob' } };
let root, store, openrouter;
const getStore = async (id) => (id == null ? store : store.forStudent(id));
const aliceStore = () => store.forStudent(accountId(alice));

beforeEach(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-openrouter-'));
  vi.stubEnv('OPENTUTOR_DATA_DIR', '');
  vi.stubEnv('SUPABASE_URL', 'http://supabase.test');
  vi.stubEnv('SUPABASE_SECRET_KEY', 'server-secret');
  vi.stubEnv('OPENTUTOR_PASSWORD', 'shared');
  vi.stubEnv('VERCEL', '');
  store = new TutorStore(root);
  await ensureAccount(store, alice);
  await ensureAccount(store, bob);
  // Supabase Auth: the access token names the user.
  vi.stubGlobal('fetch', vi.fn(async (_url, init) => {
    const token = new Headers(init?.headers).get('authorization')?.replace('Bearer ', '');
    const user = { alice, bob }[token];
    return user ? Response.json(user) : Response.json({ msg: 'bad jwt' }, { status: 401 });
  }));
  // OpenRouter, injected.
  openrouter = vi.fn(async (url, init = {}) => {
    if (url.endsWith('/auth/keys')) {
      const body = JSON.parse(init.body);
      if (body.code === 'weird-code') return Response.json({ key: 'sk-or-bad\nkey' });
      return body.code === 'good-code' && body.code_challenge_method === 'S256' ? Response.json({ key: 'sk-or-student' }) : new Response('bad code', { status: 400 });
    }
    if (url.endsWith('/key'))
      return init.headers?.Authorization === 'Bearer sk-or-student'
        ? Response.json({ data: { label: 'OpenTutor', limit_remaining: 5, is_free_tier: false } })
        : new Response('no', { status: 401 });
    return new Response('unexpected', { status: 500 });
  });
});
afterEach(() => {
  store.close();
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const request = (method, body, cookie = 'ot_access=alice') => ({ method, body, headers: { host: 'localhost:3000', origin: 'http://localhost:3000', cookie } });
const response = () => ({ headers: {}, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; }, setHeader(k, v) { this.headers[k] = v; }, getHeader(k) { return this.headers[k]; } });
const call = async (req) => { const res = response(); await openrouterHandler({ getStore, fetchImpl: openrouter })(req, res); return res; };
const flowCookie = (res) => res.headers['Set-Cookie'].find((c) => c.startsWith('ot_openrouter=')).split(';')[0];

it('sends the student to OpenRouter with a challenge that matches the verifier used to claim the key', async () => {
  const started = await call(request('POST', { action: 'start' }));
  const url = new URL(started.body.url);
  expect(url.origin + url.pathname).toBe('https://openrouter.ai/auth');
  expect(url.searchParams.get('callback_url')).toBe('http://localhost:3000/learn.html');
  expect(started.headers['Set-Cookie'].find((c) => c.startsWith('ot_openrouter='))).toContain('HttpOnly');

  const connected = await call(request('POST', { action: 'connect', code: 'good-code' }, `ot_access=alice; ${flowCookie(started)}`));
  expect(connected.statusCode).toBe(200);
  expect(connected.body).toEqual({ connected: true, freeTier: false, limitRemaining: 5 });
  const exchange = JSON.parse(openrouter.mock.calls.find(([u]) => u.endsWith('/auth/keys'))[1].body);
  expect(createHash('sha256').update(exchange.code_verifier).digest('base64url')).toBe(url.searchParams.get('code_challenge'));
  expect(await readKey(aliceStore())).toBe('sk-or-student');
  expect(JSON.stringify(connected.body) + JSON.stringify(connected.headers)).not.toContain('sk-or-student');
});

it('refuses a connection with no flow, another account\'s flow, or a code OpenRouter rejects', async () => {
  const bobs = await call(request('POST', { action: 'start' }, 'ot_access=bob'));
  expect((await call(request('POST', { action: 'connect', code: 'good-code' }))).statusCode).toBe(400);
  expect((await call(request('POST', { action: 'connect', code: 'good-code' }, `ot_access=alice; ${flowCookie(bobs)}`))).statusCode).toBe(400);
  const alices = await call(request('POST', { action: 'start' }));
  expect((await call(request('POST', { action: 'connect', code: 'bad-code' }, `ot_access=alice; ${flowCookie(alices)}`))).statusCode).toBe(502);
  expect(await readKey(aliceStore())).toBeNull();
});

it('reports the trial and the connection, and forgets the key on disconnect', async () => {
  expect((await call(request('GET'))).body).toEqual({ connected: false, trialLessons: 3, trialLessonsLeft: 3, limitRemaining: null });
  await saveKey(aliceStore(), 'sk-or-student');
  expect((await call(request('GET'))).body).toMatchObject({ connected: true, limitRemaining: 5 });
  expect((await call(request('POST', { action: 'disconnect' }))).body).toEqual({ connected: false });
  expect(await readKey(aliceStore())).toBeNull();
});

it('is only for self-signup accounts', async () => {
  const res = await call({ method: 'GET', headers: { host: 'localhost:3000', authorization: 'Bearer shared' } });
  expect(res.statusCode).toBe(403);
});

it('refuses a key that is not a plain token, and stores nothing', async () => {
  const started = await call(request('POST', { action: 'start' }));
  const res = await call(request('POST', { action: 'connect', code: 'weird-code' }, `ot_access=alice; ${flowCookie(started)}`));
  expect(res.statusCode).toBe(502);
  expect(await readKey(aliceStore())).toBeNull();
  expect(openrouter.mock.calls.some(([u]) => u.endsWith('/key'))).toBe(false);
});

it('gives every OpenRouter call a deadline', async () => {
  const started = await call(request('POST', { action: 'start' }));
  await call(request('POST', { action: 'connect', code: 'good-code' }, `ot_access=alice; ${flowCookie(started)}`));
  expect(openrouter.mock.calls.length).toBeGreaterThan(0);
  expect(openrouter.mock.calls.every(([, init]) => init?.signal instanceof AbortSignal)).toBe(true);
});

it('still reports the connection when OpenRouter cannot be reached', async () => {
  await saveKey(aliceStore(), 'sk-or-student');
  openrouter.mockImplementation(async () => { throw new Error('network down'); });
  const res = await call(request('GET'));
  expect(res.statusCode).toBe(200);
  expect(res.body).toMatchObject({ connected: true, limitRemaining: null });
});

it('says connected for a stored key that no longer opens, matching the reconnect prompt', async () => {
  await saveKey(aliceStore(), 'sk-or-student');
  vi.stubEnv('SUPABASE_SECRET_KEY', 'rotated-secret');
  expect((await call(request('GET'))).body).toMatchObject({ connected: true, limitRemaining: null });
});

// The Hobby plan's 12-function limit means /api/openrouter is served by the
// account function (vercel.json rewrites it with ?via=openrouter).
it('dispatches /api/account and /api/openrouter from one function', async () => {
  const owner = { method: 'GET', headers: { host: 'localhost:3000', authorization: 'Bearer shared' } };
  const denied = response();
  await accountRoute({ ...owner, query: { via: 'openrouter' } }, denied);
  expect(denied.statusCode).toBe(403); // the owner has no account to connect

  const plain = response();
  await accountRoute(owner, plain);
  expect(plain.statusCode).toBe(200);
  expect(plain.body).toEqual({ user: null, available: true, local: false });
});
