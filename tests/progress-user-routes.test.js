import { beforeEach, afterEach, it, expect, vi } from 'vitest';

// #144 — a failed store call answered with the database's own words.
let state;
vi.mock('../api/_lib/init.js', () => ({ getState: async () => state }));
const progress = (await import('../api/progress.js')).default;
const user = (await import('../api/user.js')).default;

beforeEach(() => vi.stubEnv('OPENTUTOR_PASSWORD', 'test-password'));
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

async function call(handler, method, body) {
  const res = {
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
  await handler({ method, headers: { authorization: 'Bearer test-password' }, body }, res);
  return res;
}

it.each([
  ['GET /api/progress', progress, 'GET'],
  ['GET /api/user', user, 'GET'],
  ['POST /api/user', user, 'POST'],
])('%s keeps upstream error text out of the response', async (_name, handler, method) => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const broken = async () => { throw new Error('relation "kv" does not exist'); };
  state = { readUser: broken, readProgress: broken, writeUser: broken };

  const res = await call(handler, method, { name: 'Ada' });
  expect(res.statusCode).toBe(500);
  expect(JSON.stringify(res.body)).not.toMatch(/relation|kv/);
  expect(log).toHaveBeenCalledWith(expect.any(String), 'relation "kv" does not exist');
});

it('still answers the profile and progress from a working store', async () => {
  state = { readUser: async () => '- **Name:** Ada', readProgress: async () => ({ active_topics: ['knots'] }), writeUser: vi.fn() };

  expect((await call(progress, 'GET')).body).toEqual({ active_topics: ['knots'] });
  expect((await call(user, 'GET')).body).toEqual({ profile: '- **Name:** Ada', hasProfile: true, onboarded: true });
  expect(await call(user, 'POST', { name: 'Ada' })).toMatchObject({ statusCode: 200, body: { ok: true } });
  expect(state.writeUser).toHaveBeenCalledWith(expect.stringContaining('**Name:** Ada'));
});
