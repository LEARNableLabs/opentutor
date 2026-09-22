import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// api/telegram.js had no tests at all, so nothing but the linter would have caught
// a regression here. These cover the webhook's contract: who is allowed in, that
// lesson state survives on a Supabase-shaped (async, db-less) store, and that the
// hidden grading block never reaches the student.

const sent = [];
let store;

function asyncStore() {
  const kv = new Map();
  const lessons = [
    { lesson: 1, module: 'Basics', title: 'Lesson 1', concepts: ['alpha'], status: 'pending' },
    { lesson: 2, module: 'Basics', title: 'Lesson 2', concepts: ['beta'], status: 'pending' },
  ];
  return {
    kv,
    completed: [],
    async readKV(k) { return kv.get(k) ?? null; },
    async writeKV(k, v) { kv.set(k, v); },
    async deleteKV(k) { kv.delete(k); },
    async readUser() { return ''; },
    async readProgress() { return { active_topics: ['demo'] }; },
    async readCurriculum() { return { topic: 'Demo', lessons }; },
    async getNextLesson() { return lessons.find((l) => l.status === 'pending') || null; },
    async readDomainFile() { return null; },
    async markLessonComplete(slug, day) { this.completed.push(day); },
  };
}

vi.mock('../api/_lib/init.js', () => ({
  getState: async () => store,
  getAdapter: () => ({
    generate: async (system) => (system.includes('## Current Step:')
      ? { text: '<assessment>{"score":0.9,"understanding":"full"}</assessment>\nGood — now why?' }
      : { text: JSON.stringify({ goal: 'Explain alpha', diagnostic: 'Why alpha?', followUp: 'Example?', application: 'Apply it.' }) }),
  }),
  getSkills: () => new Map(),
}));

const handler = (await import('../api/telegram.js')).default;

const res = () => {
  const r = { statusCode: null, body: null };
  r.status = (c) => { r.statusCode = c; return r; };
  r.json = (b) => { r.body = b; return r; };
  r.end = () => r;
  return r;
};
const post = (text, headers = {}) => ({ method: 'POST', headers, body: { message: { text, chat: { id: 42 } } } });

beforeEach(() => {
  sent.length = 0;
  store = asyncStore();
  vi.stubGlobal('fetch', vi.fn(async (url, init) => {
    sent.push(JSON.parse(init.body));
    return new Response('{}', { status: 200 });
  }));
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token');
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

const settle = () => new Promise((r) => setTimeout(r, 0));

describe('webhook access', () => {
  it('rejects anything but POST', async () => {
    const r = res();
    await handler({ method: 'GET', headers: {} }, r);
    expect(r.statusCode).toBe(405);
  });

  it('acknowledges Telegram immediately so it does not retry', async () => {
    vi.stubEnv('TELEGRAM_WEBHOOK_SECRET', 's3cret');
    const r = res();
    await handler(post('/help', { 'x-telegram-bot-api-secret-token': 's3cret' }), r);
    expect(r.statusCode).toBe(200);
    expect(r.body).toEqual({ ok: true });
  });

  it('rejects a request carrying the wrong secret', async () => {
    vi.stubEnv('TELEGRAM_WEBHOOK_SECRET', 's3cret');
    const r = res();
    await handler(post('/next', { 'x-telegram-bot-api-secret-token': 'wrong' }), r);
    expect(r.statusCode).toBe(403);
  });

  // The guard used to be `if (WEBHOOK_SECRET) { ...check... }`, so forgetting to
  // configure the secret did not weaken the webhook — it removed it. Anyone who
  // found the URL could POST a fake update, spend LLM credits and write into the
  // student's state. auth.js already refuses a deployment with no password; this
  // route has to hold the same line.
  it('refuses on a deployment when no secret is configured', async () => {
    vi.stubEnv('VERCEL', '1');
    const r = res();
    await handler(post('/next'), r);

    expect(r.statusCode).toBe(403);
    await settle();
    expect(sent, 'must not reach the model or the student').toEqual([]);
  });

  it('still runs locally with no secret, where there is no public URL', async () => {
    const r = res();
    await handler(post('/help'), r);
    expect(r.statusCode).toBe(200);
  });
});

describe('lesson flow on an async, db-less store', () => {
  it('stores lesson state that a later answer can read back', async () => {
    await handler(post('/next'), res());
    await settle();

    expect([...store.kv.keys()]).toEqual(['tg_lesson:42']);
    expect(sent.at(-1).text).toContain('Why alpha?');
  });

  it('advances the lesson and never shows the hidden assessment', async () => {
    await handler(post('/next'), res());
    await settle();
    await handler(post('wild yeast'), res());
    await settle();

    const reply = sent.at(-1).text;
    expect(reply).toContain('Good — now why?');
    expect(reply).not.toMatch(/<assessment>|understanding|0\.9/);
  });

  it('completes the lesson and clears the stored state', async () => {
    await handler(post('/next'), res());
    await settle();
    for (const a of ['a1', 'a2', 'a3', 'a4']) { await handler(post(a), res()); await settle(); }

    expect(store.completed).toEqual([1]);
    expect([...store.kv.keys()]).toEqual([]);
  });
});
