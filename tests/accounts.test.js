import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { TutorStore } from '../lib/core/store.js';
import { issueStudentToken, authenticateStudent } from '../lib/core/student-auth.js';
import { workspaceDir, completionsFile } from '../lib/core/progress.js';
import {
  accountId,
  accountKey,
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
          : { data: { user: null }, error: { message: 'bad', status: 401 } },
      ),
      signInWithPassword: vi.fn(async () => ({ data: { session, user } })),
      signUp: vi.fn(async () => ({ data: { user, session: null } })),
      refreshSession: vi.fn(async () => ({ data: { session, user } })),
      exchangeCodeForSession: vi.fn(async () => ({ data: { session, user } })),
      admin: { deleteUser: vi.fn(async () => ({ data: { user: null }, error: null })) },
    },
  };
});
afterEach(() => {
  store.close();
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
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
it('answers 503 without clearing cookies when refresh fails from an outage, not a rejected token', async () => {
  client.auth.refreshSession = vi.fn(async () => ({
    data: {},
    error: { message: 'fetch failed', status: 0 },
  }));
  const res = await call(req({ action: 'refresh' }, { cookie: 'ot_refresh=refresh' }));
  expect(res.statusCode).toBe(503);
  expect(res.headers['Set-Cookie']).toBeUndefined();
});
it('keeps a rotated session when checking it hits an outage, instead of losing it to a 401', async () => {
  client.auth.refreshSession = vi.fn(async () => ({
    data: { session: { access_token: 'valid', refresh_token: 'rotated', expires_in: 3600 }, user },
  }));
  client.auth.getUser = vi.fn(async () => ({ data: { user: null }, error: { message: 'fetch failed', status: 0 } }));
  const res = await call(req({ action: 'refresh' }, { cookie: 'ot_refresh=refresh' }));
  expect(res.statusCode).toBe(503);
  expect(res.headers['Set-Cookie'].join(';')).toContain('ot_refresh=rotated');
});
it('tells a signed-in browser sign-in is unavailable during an outage, not that it is signed out', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ msg: 'db unavailable' }, { status: 503 })),
  );
  const res = await call({ method: 'GET', headers: { host: 'localhost:3000', cookie: 'ot_access=valid' } });
  expect(res.statusCode).toBe(503);
  expect(res.body.user).toBeUndefined();
});
it('treats a Supabase outage on session verification as misconfigured, never as root access', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json({ msg: 'db unavailable' }, { status: 503 })),
  );
  const auth = await authenticateRequest(req({}, { cookie: 'ot_access=valid' }), async () => store);
  expect(auth.ok).toBe(false);
  expect(auth.misconfigured).toBe(true);
  expect(auth.userId).not.toBe(null);
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
it('refuses password reset by email until email is set up, the same way for every address (#133)', async () => {
  client.auth.resetPasswordForEmail = vi.fn();
  const known = await call(req({ action: 'forgot', email: user.email }));
  const unknown = await call(req({ action: 'forgot', email: 'nobody@example.test' }));
  expect(known.statusCode).toBe(404);
  expect(unknown.statusCode).toBe(404);
  expect(known.body).toEqual({ error: 'Password reset by email is not available yet.' });
  expect(known.body).toEqual(unknown.body);
  expect(client.auth.resetPasswordForEmail).not.toHaveBeenCalled();
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
    { slug: 'math', topic: 'Math', total: 1, level: null, prerequisites: [], preview: ['Numbers'] },
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

// ── #160: a self-signup account deletes itself ────────────────────────────────
const DELETE_ME = { action: 'delete', confirm: 'DELETE' };
const SESSION = 'ot_access=valid; ot_refresh=refresh';
const cleared = (res, name) =>
  (res.headers['Set-Cookie'] || []).some((c) => c.startsWith(`${name}=;`) && c.includes('Max-Age=0'));
// Alice (the caller), Bob (another account) and the owner (the unnamed store), each
// with a profile, progress, a completed lesson and a sealed OpenRouter key.
async function seed() {
  const alice = (await ensureAccount(store, user)).id;
  const bob = (
    await ensureAccount(store, { ...user, id: '22222222-2222-4222-8222-222222222222', user_metadata: { name: 'Bob' } })
  ).id;
  for (const [state, who] of [[store.forStudent(alice), 'Alice'], [store.forStudent(bob), 'Bob'], [store, 'Owner']]) {
    state.writeUser(`${who} private`);
    state.markLessonComplete('math', 1);
    state.writeKV('openrouter_key', `${who} sealed`);
  }
  return { alice, bob };
}
const kept = (id) => {
  const state = id ? store.forStudent(id) : store;
  return {
    profile: state.readUser(),
    key: state.readKV('openrouter_key'),
    history: state.readProgress().history?.length,
    completions: fs.existsSync(completionsFile(workspaceDir(store.dataDir, id))),
  };
};
// Checks the directory before building a scoped store: building one recreates it.
const wiped = (id) =>
  !fs.existsSync(workspaceDir(store.dataDir, id)) && store.forStudent(id).listKV('').length === 0;

it('deletes a self-signup account, its data and then its Auth user, and nobody else\'s (#160)', async () => {
  const { alice, bob } = await seed();
  const before = { bob: kept(bob), owner: kept(null) };
  const atDelete = [];
  client.auth.admin.deleteUser = vi.fn(async () => {
    atDelete.push({
      status: JSON.parse(store.readKV(accountKey(alice))).status,
      workspace: fs.existsSync(workspaceDir(store.dataDir, alice)),
    });
    return { data: { user: null }, error: null };
  });
  const res = await call(req(DELETE_ME, { cookie: SESSION }));
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ ok: true });
  // The Auth id is the one Supabase verified, and it goes last: disabled and wiped first.
  expect(client.auth.admin.deleteUser).toHaveBeenCalledWith(user.id);
  expect(atDelete).toEqual([{ status: 'disabled', workspace: false }]);
  expect(wiped(alice)).toBe(true);
  // The tombstone keeps the account out without keeping who it was.
  expect(JSON.parse(store.readKV(accountKey(alice)))).toEqual({ id: alice, status: 'disabled' });
  for (const name of ['ot_access', 'ot_refresh', 'ot_legacy']) expect(cleared(res, name), name).toBe(true);
  expect({ bob: kept(bob), owner: kept(null) }).toEqual(before);
  expect(before.bob.profile).toBe('Bob private');
  expect((await listStudents(store)).map((s) => s.id)).toEqual([bob]);
});

it('keeps a deleted account out: its old session and a fresh login both fail (#160)', async () => {
  await seed();
  expect((await call(req(DELETE_ME, { cookie: SESSION }))).statusCode).toBe(200);
  // The fake still accepts the old token, as Supabase would if the Auth user were
  // left behind. The disabled registry row is what keeps the account out.
  expect(await verifyAccountRequest(req({}, { cookie: SESSION }), store, client)).toBeNull();
  expect((await call(req(DELETE_ME, { cookie: SESSION }))).statusCode).toBe(401);
  expect(
    (await call(req({ action: 'login', email: user.email, password: 'long-password' }))).statusCode,
  ).toBe(403);
  expect(client.auth.admin.deleteUser).toHaveBeenCalledTimes(1);
});

it('refuses deletion without the typed confirmation, a session, the same origin or an account, and changes nothing (#160)', async () => {
  const { alice, bob } = await seed();
  await provisionStudent(store, 'carol');
  const token = await issueStudentToken(store, 'carol');
  const before = kept(alice);
  for (const [status, body, headers] of [
    [400, { action: 'delete' }, { cookie: SESSION }],
    [400, { action: 'delete', confirm: 'delete' }, { cookie: SESSION }],
    [401, DELETE_ME, {}],
    [401, DELETE_ME, { cookie: 'ot_access=expired; ot_refresh=refresh' }],
    [401, DELETE_ME, { cookie: 'ot_refresh=refresh' }],
    [403, DELETE_ME, { cookie: SESSION, origin: 'https://evil.test' }],
    [403, DELETE_ME, { authorization: 'Bearer shared' }],
    [403, DELETE_ME, { 'x-opentutor-password': 'shared' }],
    [403, DELETE_ME, { cookie: 'ot_legacy=shared' }],
    [403, DELETE_ME, { authorization: `Bearer ${token}` }],
    [403, DELETE_ME, { cookie: `ot_legacy=${token}` }],
  ]) {
    const res = await call(req(body, headers));
    expect([res.statusCode, res.headers['Set-Cookie']], JSON.stringify({ body, headers })).toEqual([
      status,
      undefined,
    ]);
  }
  expect(client.auth.admin.deleteUser).not.toHaveBeenCalled();
  expect(kept(alice)).toEqual(before);
  expect((await listStudents(store)).map((s) => s.id).sort()).toEqual([alice, bob, 'carol'].sort());
  expect((await authenticateStudent(store, token))?.id).toBe('carol');
});

it.each([
  ['throws', async () => { throw new Error('fetch failed'); }],
  ['returns an error', async () => ({ data: { user: null }, error: { message: 'Database error deleting user', status: 500 } })],
])('still wipes the data and signs out when deleting the Auth user %s (#160)', async (_how, deleteUser) => {
  const { alice } = await seed();
  client.auth.admin.deleteUser = vi.fn(deleteUser);
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const res = await call(req(DELETE_ME, { cookie: SESSION }));
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ ok: true, authDeleted: false });
  expect(wiped(alice)).toBe(true);
  expect(JSON.parse(store.readKV(accountKey(alice))).status).toBe('disabled');
  for (const name of ['ot_access', 'ot_refresh']) expect(cleared(res, name), name).toBe(true);
  // The operator is told which Auth user is left to remove.
  const logged = log.mock.calls.map((args) => args.join(' ')).join('\n');
  expect(logged).toContain('[account] auth user not deleted:');
  expect(logged).toContain(user.id);
});

it('answers a generic 500 and keeps the Auth user when wiping the data fails (#160)', async () => {
  const { alice } = await seed();
  vi.spyOn(TutorStore.prototype, 'deleteAllStudentState').mockImplementation(() => {
    throw new Error('SQLITE_IOERR: disk I/O error at /srv/opentutor/data.db');
  });
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const res = await call(req(DELETE_ME, { cookie: SESSION }));
  expect(res.statusCode).toBe(500);
  expect(res.body).toEqual({ error: 'Your account could not be deleted. Please try again.' });
  expect(client.auth.admin.deleteUser).not.toHaveBeenCalled();
  expect(res.headers['Set-Cookie']).toBeUndefined();
  expect(log.mock.calls.flat().join(' ')).toContain('SQLITE_IOERR');
  // What docs/deployment.md tells the operator to do: decommission again, which finishes it.
  vi.restoreAllMocks();
  await decommissionStudent(store, alice);
  expect(wiped(alice)).toBe(true);
});

// #244: a refused signup or login used to leave no trace, and a rate limit read like a typo.
it.each(['signup', 'login'])('logs why Supabase refused a %s, without the email', async (action) => {
  const refusal = { data: { user: null, session: null }, error: { status: 422, code: 'weak_password', message: `Password for ${user.email} is weak` } };
  client.auth.signUp.mockResolvedValueOnce(refusal);
  client.auth.signInWithPassword.mockResolvedValueOnce(refusal);
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const res = await call(req({ action, email: user.email, password: 'long-password' }));
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toMatch(action === 'signup' ? /Could not create the account/ : /Could not sign in/);
  const logged = log.mock.calls.map((args) => args.join(' ')).join('\n');
  expect(logged).toContain(`[account] ${action} refused: 422 weak_password`);
  expect(logged).not.toContain(user.email);
});

it.each(['signup', 'login'])('tells a rate-limited %s to wait, instead of blaming the details', async (action) => {
  const limited = { data: { user: null, session: null }, error: { status: 429, code: 'over_request_rate_limit', message: 'Request rate limit reached' } };
  client.auth.signUp.mockResolvedValueOnce(limited);
  client.auth.signInWithPassword.mockResolvedValueOnce(limited);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const res = await call(req({ action, email: user.email, password: 'long-password' }));
  expect(res.statusCode).toBe(429);
  expect(res.body.error).toBe('Too many sign-in attempts right now. Please wait a few minutes and try again.');
});
