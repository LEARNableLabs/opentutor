import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let state, progress;
const getState = vi.fn(async () => state);
const getPipelineAdapter = vi.fn(() => { throw new Error('Must not start a hosted build'); });
vi.mock('../api/_lib/init.js', () => ({
  getState: (...args) => getState(...args),
  getPipelineAdapter: (...args) => getPipelineAdapter(...args),
}));

const handler = (await import('../api/add-topic.js')).default;

async function call(body, overrides = {}) {
  const res = {
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
  await handler({ method: 'POST', headers: { authorization: 'Bearer test-password' }, body, ...overrides }, res);
  return res;
}

beforeEach(() => {
  vi.stubEnv('VERCEL', '1');
  vi.stubEnv('OPENTUTOR_PASSWORD', 'test-password');
  vi.clearAllMocks();
  progress = { active_topics: ['game-theory'], history: [{ lesson: 1 }] };
  state = {
    readCurriculum: vi.fn(async () => null),
    updateProgress: vi.fn(async (fn) => fn(progress)),
  };
});
afterEach(() => vi.unstubAllEnvs());

describe('hosted topic activation (#118)', () => {
  it.each([null, { lessons: [] }])('refuses a missing or empty curriculum without registering it: %j', async (curriculum) => {
    state.readCurriculum.mockResolvedValue(curriculum);
    const before = structuredClone(progress);
    const res = await call({ topic: 'Never Built', level: 'beginner' });
    expect(res.statusCode).toBe(501);
    expect(res.body).toMatchObject({ slug: 'never-built', status: 'unavailable' });
    expect(res.body.error).toMatch(/Choose an available topic/);
    expect(progress).toEqual(before);
    expect(state.updateProgress).not.toHaveBeenCalled();
    expect(getPipelineAdapter).not.toHaveBeenCalled();
  });

  it('activates a stored curriculum and does not duplicate it on retry', async () => {
    state.readCurriculum.mockResolvedValue({ lessons: [{ lesson: 1 }, { lesson: 2 }] });
    const body = { topic: 'Knot Theory', level: 'intermediate' };
    const res = await call(body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ slug: 'knot-theory', status: 'existing', lessonCount: 2 });
    await call(body);
    expect(state.readCurriculum).toHaveBeenCalledWith('knot-theory');
    expect(progress.active_topics).toEqual(['game-theory', 'knot-theory']);
    expect(progress.history).toEqual([{ lesson: 1 }]);
    expect(getPipelineAdapter).not.toHaveBeenCalled();
  });

  it.each([undefined, null, {}, { topic: 42 }, { topic: '' }, { topic: '   ' }, { topic: '!!!' }])('rejects invalid input before accessing storage: %j', async (body) => {
    expect((await call(body)).statusCode).toBe(400);
    expect(getState).not.toHaveBeenCalled();
  });

  it('returns a storage failure without registering a topic', async () => {
    state.readCurriculum.mockRejectedValue(new Error('Storage unavailable'));
    expect((await call({ topic: 'Knot Theory' })).statusCode).toBe(500);
    expect(state.updateProgress).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated requests before accessing storage', async () => {
    expect((await call({ topic: 'Knot Theory' }, { headers: {} })).statusCode).toBe(401);
    expect(getState).not.toHaveBeenCalled();
  });

  it('still rejects unsupported methods', async () => {
    expect((await call({}, { method: 'GET' })).statusCode).toBe(405);
    expect(getState).not.toHaveBeenCalled();
  });
});
