import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { TutorStore } from '../lib/core/store.js';
import { issueStudentToken } from '../lib/core/student-auth.js';
import {
  accountId,
  ensureAccount,
  verifyAccountRequest,
  createAccountClient,
  cookies,
} from '../lib/core/accounts.js';
import { listStudents, decommissionStudent, provisionStudent } from '../lib/core/students.js';
import { authenticateRequest } from '../api/_lib/auth.js';
import { accountHandler } from '../api/account.js';
import { publicCatalog } from '../lib/core/catalog.js';
let root, store, client, user;
const response = () => ({
  headers: {},
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
  setHeader(k, v) {
    this.headers[k] = v;
  },
  getHeader(k) {
    return this.headers[k];
  },
});
const req = (body, headers = {}) => ({
  method: 'POST',
  body,
  headers: { host: 'localhost:3000', origin: 'http://localhost:3000', ...headers },
});
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-accounts-'));
  store = new TutorStore(root);
  vi.stubEnv('SUPABASE_URL', 'http://supabase.test');
  vi.stubEnv('SUPABASE_SECRET_KEY', 'server-secret');
  vi.stubEnv('OPENTUTOR_PASSWORD', 'shared');
  vi.stubEnv('VERCEL', '');
  user = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'alice@example.test',
    email_confirmed_at: '2026-01-01',
    user_metadata: { name: 'Alice' },
  };
  const session = { access_token: 'valid', refresh_token: 'refresh', expires_in: 3600 };
  client = {
    auth: {
      getUser: vi.fn(async (token) =>
        token === 'valid'
          ? { data: { user }, error: null }
          : { data: { user: null }, error: { message: 'bad' } },
      ),
      signInWithPassword: vi.fn(async () => ({ data: { session, user } })),
      signUp: vi.fn(async () => ({ data: { user, session: null } })),
      refreshSession: vi.fn(async () => ({ data: { session, user } })),
      exchangeCodeForSession: vi.fn(async () => ({ data: { session, user } })),
    },
  };
});
afterEach(() => {
  store.close();
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
const call = async (request) => {
  const res = response();
  await accountHandler({ getStore: async () => store, clientFactory: () => client })(request, res);
  return res;
};
it('returns only public session data while setting HttpOnly cookies', async () => {
  const res = await call(req({ action: 'login', email: user.email, password: 'long-password' }));
  expect(res.statusCode).toBe(200);
  expect(res.body.user.id).toBe(accountId(user));
  expect(JSON.stringify(res.body)).not.toMatch(/valid|refresh|server-secret/);
  expect(res.headers['Set-Cookie'].join(';')).toContain('HttpOnly; SameSite=Lax');
  expect((await listStudents(store)).map((s) => s.id)).toEqual([accountId(user)]);
});
it('waits for email confirmation before creating any student data', async () => {
  const res = await call(req({ action: 'signup', email: user.email, password: 'long-password' }));
  expect(res.body.message).toContain('Check your email');
  expect(await listStudents(store)).toEqual([]);
});
it('rejects cross-origin login, refresh, logout, reset and callback before invoking the provider', async () => {
  for (const action of ['login', 'refresh', 'logout', 'reset', 'callback'])
    expect((await call(req({ action }, { origin: 'https://evil.test' }))).statusCode).toBe(403);
  expect(client.auth.getUser).not.toHaveBeenCalled();
});
it('keeps concurrent accounts, isolates state and rejects reserved legacy IDs', async () => {
  const bob = { ...user, id: '22222222-2222-4222-8222-222222222222' };
  await Promise.all([
    ensureAccount(store, user),
    ensureAccount(store, bob),
    ensureAccount(store, user),
  ]);
  expect(await listStudents(store)).toHaveLength(2);
  store.forStudent(accountId(user)).writeUser('Alice private');
  expect(store.forStudent(accountId(bob)).readUser()).not.toContain('Alice private');
  await expect(provisionStudent(store, accountId(user))).rejects.toThrow('reserved');
});
it('keeps deletion tombstones and blocks both old sessions and fresh login', async () => {
  await ensureAccount(store, user);
  await decommissionStudent(store, accountId(user));
  expect(await listStudents(store)).toEqual([]);
  expect(
    await verifyAccountRequest(req({}, { cookie: 'ot_access=valid' }), store, client),
  ).toBeNull();
  await expect(ensureAccount(store, user)).rejects.toThrow('disabled');
  expect(
    (await call(req({ action: 'login', email: user.email, password: 'long-password' }))).statusCode,
  ).toBe(403);
});
it('rejects an invalid account cookie even when the shared password header is correct', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ msg: 'bad token' }, { status: 401 })),
  );
  const auth = await authenticateRequest(
    req({}, { cookie: 'ot_access=bad', authorization: 'Bearer shared' }),
    async () => store,
  );
  expect(auth.ok).toBe(false);
});
it('enforces origin on cookie-auth mutations while preserving explicit bearer clients', async () => {
  expect(
    (
      await authenticateRequest(
        req({}, { cookie: 'ot_legacy=shared', origin: 'https://evil.test' }),
        async () => store,
      )
    ).forbidden,
  ).toBe(true);
  expect(
    (
      await authenticateRequest(
        req({}, { authorization: 'Bearer shared', origin: undefined }),
        async () => store,
      )
    ).ok,
  ).toBe(true);
});
it('stores PKCE verifier in a secure cookie and sends a challenge to Supabase', async () => {
  vi.stubEnv('VERCEL', '1');
  let payload;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url, options) => {
      payload = JSON.parse(options.body);
      return Response.json(user);
    }),
  );
  const request = req({}, { host: 'app.test', origin: 'https://app.test' }),
    res = response();
  await createAccountClient(request, res).auth.signUp({
    email: user.email,
    password: 'long-password',
    options: { emailRedirectTo: 'https://app.test/login.html' },
  });
  expect(payload.code_challenge).toBeTruthy();
  expect(payload.code_challenge_method).toBe('s256');
  // auth-js writes three `-code-verifier` keys (slot, flow index, legacy) into this one
  // cookie; the browser keeps the last, so that one must be the verifier behind the challenge.
  const header = res.headers['Set-Cookie'].filter((s) => s.startsWith('ot_verifier=')).at(-1);
  expect(header).toContain('HttpOnly');
  expect(header).toContain('Secure');
  const verifier = JSON.parse(cookies({ headers: { cookie: header.split(';')[0] } }).ot_verifier);
  expect(createHash('sha256').update(verifier).digest('base64url')).toBe(payload.code_challenge);
});
it('refuses anonymous callers once accounts are configured, even with no shared password', async () => {
  vi.stubEnv('OPENTUTOR_PASSWORD', '');
  const anonymous = { method: 'GET', headers: { host: 'localhost:3000' } };
  expect((await authenticateRequest(anonymous, async () => store)).ok).toBe(false);
  // The original passwordless single-user install, with no accounts, stays open.
  vi.stubEnv('SUPABASE_URL', '');
  expect((await authenticateRequest(anonymous, async () => store)).ok).toBe(true);
});
it('answers a password reset for a rate-limited registered email exactly as for an unknown one', async () => {
  // Supabase only rate-limits addresses it would email, so a distinct 429 names registered accounts.
  client.auth.resetPasswordForEmail = vi.fn(async (email) =>
    email === user.email ? { error: { status: 429, message: 'over_email_send_rate_limit' } } : { error: null },
  );
  const known = await call(req({ action: 'forgot', email: user.email }));
  const unknown = await call(req({ action: 'forgot', email: 'nobody@example.test' }));
  expect(unknown.statusCode).toBe(200);
  expect(known.statusCode).toBe(200);
  expect(known.body).toEqual(unknown.body);
});
it('never mints a legacy bearer token for an account, which only Supabase sessions may reach', async () => {
  await ensureAccount(store, user);
  await expect(issueStudentToken(store, accountId(user))).rejects.toThrow('reserved');
});
it('public catalog reads only shipped curricula without runtime progress', () => {
  const dir = path.join(root, 'skills/tutor/domains/math');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'curriculum.json'),
    JSON.stringify({ topic: 'Math', lessons: [{ title: 'Numbers', status: 'completed' }] }),
  );
  store.writeKV(
    'generated_topic:private',
    JSON.stringify({ curriculum: { topic: 'Private', lessons: [{}] } }),
  );
  expect(publicCatalog(root)).toEqual([
    { slug: 'math', topic: 'Math', total: 1, level: 'All levels', preview: ['Numbers'] },
  ]);
});
it('requires a verified recovery grant rather than an ordinary login for password reset', async () => {
  await ensureAccount(store, user);
  expect(
    (
      await call(
        req(
          { action: 'reset', password: 'another-password' },
          { cookie: 'ot_access=valid; ot_refresh=refresh' },
        ),
      )
    ).statusCode,
  ).toBe(401);
});
it('rejects account bootstrap when a legacy ID would collide', async () => {
  store.writeKV('students', JSON.stringify([{ id: accountId(user), name: 'Older student' }]));
  await expect(ensureAccount(store, user)).rejects.toThrow('conflicts');
});
it('binds recovery grants to their user, token and expiry and rejects tampering', async () => {
  const { grantRecovery, canReset, signFlow, readFlow } = await import('../lib/core/accounts.js');
  const res = response();
  grantRecovery(req({}), res, user, { access_token: 'valid' });
  const cookie = res.headers['Set-Cookie'][0].split(';')[0] + '; ot_access=valid';
  expect(canReset(req({}, { cookie }), { id: accountId(user) })).toBe(true);
  expect(
    canReset(req({}, { cookie: cookie.replace('ot_access=valid', 'ot_access=other') }), {
      id: accountId(user),
    }),
  ).toBe(false);
  expect(canReset(req({}, { cookie }), { id: 'someone-else' })).toBe(false);
  expect(readFlow(signFlow({ intent: 'recovery' }, -1))).toBeNull();
  expect(readFlow(signFlow({ intent: 'signup' }) + 'tampered')).toBeNull();
});
