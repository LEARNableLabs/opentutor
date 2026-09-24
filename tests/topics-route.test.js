import { beforeEach, afterEach, it, expect, vi } from 'vitest';

// #137 — on Supabase, walking the topics costs two round trips per topic.
let state;
vi.mock('../api/_lib/init.js', () => ({ getState: async () => state }));
const handler = (await import('../api/topics.js')).default;

beforeEach(() => vi.stubEnv('OPENTUTOR_PASSWORD', 'test-password'));
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

async function get() {
  const res = {
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  await handler({ method: 'GET', headers: { authorization: 'Bearer test-password' } }, res);
  return res;
}

it('asks a store that can for every topic at once', async () => {
  const topics = [{ slug: 'knots', topic: 'Knots', total: 3, completed: 1, percent: 33 }];
  state = { listTopicProgress: vi.fn(async () => topics), listTopics: vi.fn(), getTopicProgress: vi.fn() };

  expect(await get()).toMatchObject({ statusCode: 200, body: topics });
  expect(state.listTopics).not.toHaveBeenCalled();
  expect(state.getTopicProgress).not.toHaveBeenCalled();
});

it('keeps upstream error text out of the response', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  state = { listTopicProgress: async () => { throw new Error('relation "lessons_completed" does not exist'); } };

  const res = await get();
  expect(res.statusCode).toBe(500);
  expect(JSON.stringify(res.body)).not.toContain('lessons_completed');
});

it('walks the topics one at a time on a store that cannot', async () => {
  state = {
    listTopics: async () => ['knots', 'untitled', 'gone'],
    getTopicProgress: async (slug) => ({ knots: { topic: 'Knots', total: 3, completed: 1 }, untitled: { total: 1 } })[slug] ?? null,
  };

  expect(await get()).toMatchObject({ statusCode: 200, body: [{ slug: 'knots', topic: 'Knots', total: 3, completed: 1 }] });
});
