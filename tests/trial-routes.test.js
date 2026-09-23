import { it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TutorStore } from '../lib/core/store.js';
import { saveKey } from '../lib/core/llm-access.js';

// Route wiring for #132 on the Vercel routes: a self-signup account, with the
// session check stubbed (it has its own tests) and a real store on a temp root.
const ACCT = 'acct-11111111-1111-4111-8111-111111111111';
let root, store, host, enqueue;
vi.mock('../api/_lib/auth.js', () => ({
  authenticateRequest: async () => ({ ok: true, userId: ACCT, account: { id: ACCT } }),
  authFailure: () => ({ status: 401, body: { error: 'Unauthorized.' } }),
}));
vi.mock('../api/_lib/init.js', () => ({
  getState: async (id) => (id == null ? store : store.forStudent(id)),
  getAdapter: () => host,
  getPipelineAdapter: () => host,
  getSkills: () => new Map(),
}));
vi.mock('../api/_lib/topic-queue.js', () => ({ enqueueTopicBuild: (...a) => enqueue(...a) }));
const lesson = (await import('../api/lesson.js')).default;
const addTopicRoute = (await import('../api/add-topic.js')).default;

const PLAN = { goal: 'Alpha', retrieval: 'Recall alpha?', diagnostic: 'Why alpha?', followUp: 'Example?', application: 'Apply it.', commonMisconceptions: [] };

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-trial-'));
  const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'curriculum.json'), JSON.stringify({
    topic: 'Demo', lessons: [{ lesson: 1, module: 'Basics', title: 'Lesson 1', concepts: ['alpha'], status: 'pending' }],
  }));
  vi.stubEnv('OPENTUTOR_DATA_DIR', '');
  vi.stubEnv('SUPABASE_SECRET_KEY', 'server-secret');
  store = new TutorStore(root);
  host = { generate: vi.fn(async (system) => ({ text: system.includes('## Current Step:') ? 'Good. What follows?' : JSON.stringify(PLAN) })) };
  enqueue = vi.fn(async () => {});
});
afterEach(() => {
  store.close();
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

async function call(handler, body) {
  const res = { status(code) { this.statusCode = code; return this; }, json(b) { this.body = b; return this; }, setHeader() {} };
  await handler({ method: 'POST', headers: {}, body }, res);
  return res;
}

// A response that, like Node's, refuses a second set of headers, and records SSE events.
function sseResponse() {
  const once = (res) => { if (res.headersSent) throw new Error('ERR_HTTP_HEADERS_SENT'); res.headersSent = true; };
  return {
    headersSent: false, events: [], ended: 0,
    setHeader() { if (this.headersSent) throw new Error('ERR_HTTP_HEADERS_SENT'); },
    status(code) { this.statusCode = code; return this; },
    json(body) { once(this); this.body = body; this.ended++; return this; },
    writeHead(code) { once(this); this.statusCode = code; return this; },
    write(chunk) { const m = /^event: (\w+)\ndata: (.*)\n\n$/s.exec(chunk); if (m) this.events.push({ event: m[1], data: JSON.parse(m[2]) }); return true; },
    end() { this.ended++; },
  };
}

it('gives a self-signup account 3 lessons on the deployment key, then asks for its own', async () => {
  for (let i = 0; i < 3; i++) expect((await call(lesson, { topicSlug: 'demo' })).statusCode).toBe(200);
  const fourth = await call(lesson, { topicSlug: 'demo' });
  expect(fourth.statusCode).toBe(402);
  expect(fourth.body).toMatchObject({ connect: true, reason: 'trial_used' });
  expect((await call(lesson, { topicSlug: 'demo', answer: 'alpha comes first' })).statusCode).toBe(200);
  expect(host.generate).toHaveBeenCalledTimes(4); // the refused start made no model call
});

it('runs a connected account on its own key, never on the deployment key', async () => {
  await saveKey(store.forStudent(ACCT), 'sk-or-student');
  const seen = [];
  vi.stubGlobal('fetch', vi.fn(async (_url, init) => {
    seen.push(init.headers.Authorization);
    return Response.json({ choices: [{ message: { content: JSON.stringify(PLAN) } }] });
  }));
  expect((await call(lesson, { topicSlug: 'demo' })).statusCode).toBe(200);
  expect(seen).toEqual(['Bearer sk-or-student']);
  expect(host.generate).not.toHaveBeenCalled();
});

it('streams a refusal as one error event, with headers written once, when the student key runs dry mid-lesson', async () => {
  await saveKey(store.forStudent(ACCT), 'sk-or-student');
  vi.stubGlobal('fetch', vi.fn(async () => new Response('Insufficient credits', { status: 402 })));
  const res = sseResponse();
  await lesson({ method: 'POST', headers: { accept: 'text/event-stream' }, body: { topicSlug: 'demo' } }, res);
  expect(res.statusCode).toBe(200);
  expect(res.events).toEqual([{ event: 'error', data: expect.objectContaining({ connect: true, reason: 'no_credits' }) }]);
  expect(res.ended).toBe(1);
});

it('refuses a custom topic without recording or enqueueing a build, and activates a shipped one', async () => {
  const custom = await call(addTopicRoute, { topic: 'Knot Theory' });
  expect(custom.statusCode).toBe(402);
  expect(custom.body).toMatchObject({ connect: true, reason: 'custom_topic' });
  expect(enqueue).not.toHaveBeenCalled();
  expect(store.forStudent(ACCT).readKV('generated_topic:knot-theory')).toBeNull();
  expect((await call(addTopicRoute, { topic: 'Demo' })).body).toEqual({ slug: 'demo', status: 'existing', lessonCount: 1 });
});
