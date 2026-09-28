import { it, expect, beforeAll, afterAll, vi } from 'vitest';
import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TutorStore } from '../lib/core/store.js';
import { ensureAccount, accountId } from '../lib/core/accounts.js';
import { saveKey } from '../lib/core/llm-access.js';
import { formatPracticeFeedback } from '../lib/core/deliberate-practice.js';

// #148 and #159 on the local server, which has its own /api/lesson route. The real
// scripts/web/server.js runs as a child process; its model is a fake OpenRouter here
// that records every call. Explicit env only: a checkout's .env holds production keys.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PASSWORD = 'test-lesson-server-password';
const SECRET = 'test-lesson-server-secret';
const PLAN = { goal: 'Spot a game', retrieval: null, diagnostic: 'What makes a situation a game?', followUp: 'Example?', application: 'Apply it.', commonMisconceptions: [] };
// #180: self-signup accounts, signed in through the same fake answering Supabase Auth.
const USERS = Object.fromEntries(['a', 'b', 'own'].map((name, i) => [`tok-${name}`, {
  id: `${String(i + 1).repeat(8)}-1111-4111-8111-111111111111`, email: `${name}@example.test`, email_confirmed_at: '2026-01-01T00:00:00Z',
}]));
const BLOCKED = ['acoustic-engineering', 'additive-manufacturing'];
const blockFeedback = (concept) => formatPracticeFeedback({
  timestamp: '2026-09-28T00:00:00.000Z',
  observations: [],
  directives: [{ type: 'BLOCK', target: concept, reason: 'BLOCK advancement until retested', priority: 'critical' }],
  model: { recentAccuracy: 0.5, trend: 'steady', difficulty: { level: 3, label: 'standard' }, engagement: 'steady', concepts: { shaky: [concept] } },
}, 'Demo');
const prompts = [];
const keys = []; // the Authorization each model call was made with
let fake, child, base, dataDir;

beforeAll(async () => {
  fake = http.createServer((req, res) => {
    if (req.url === '/auth/v1/user') {
      const user = USERS[String(req.headers.authorization).replace('Bearer ', '')];
      res.writeHead(user ? 200 : 401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(user || { code: 401, msg: 'invalid JWT' }));
    }
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      const system = JSON.parse(body).messages[0].content;
      prompts.push(system);
      keys.push(req.headers.authorization);
      const content = system.includes('## Current Step:') ? '<assessment>{"score":0.8}</assessment>\nGood. So why does it matter?' : JSON.stringify(PLAN);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ choices: [{ message: { content } }] }));
    });
  });
  await new Promise((resolve) => fake.listen(0, '127.0.0.1', resolve));
  const port = await new Promise((resolve) => {
    const probe = net.createServer().listen(0, '127.0.0.1', () => { const { port } = probe.address(); probe.close(() => resolve(port)); });
  });
  base = `http://127.0.0.1:${port}`;
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-lesson-server-'));
  // The accounts exist before the server opens the same database: two on the trial, one with its own key.
  vi.stubEnv('OPENTUTOR_DATA_DIR', dataDir);
  vi.stubEnv('SUPABASE_SECRET_KEY', SECRET);
  const seed = new TutorStore(ROOT);
  for (const user of Object.values(USERS)) await ensureAccount(seed, user);
  await saveKey(seed.forStudent(accountId(USERS['tok-own'])), 'sk-or-own-student');
  // #149: the owner has an open BLOCK on two topics, one started as JSON, one over SSE.
  for (const slug of BLOCKED) seed.writeDomainFile(slug, 'practice-feedback.md', blockFeedback('payoff matrix'));
  seed.close();
  vi.unstubAllEnvs();
  child = spawn(process.execPath, ['scripts/web/server.js'], {
    cwd: ROOT,
    env: {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      OPENTUTOR_PORT: String(port),
      OPENTUTOR_HOST: '127.0.0.1',
      OPENTUTOR_DATA_DIR: dataDir,
      OPENTUTOR_PASSWORD: PASSWORD,
      OPENTUTOR_LLM: 'openrouter',
      OPENROUTER_API_KEY: 'fake',
      OPENROUTER_BASE_URL: `http://127.0.0.1:${fake.address().port}`,
      SUPABASE_URL: `http://127.0.0.1:${fake.address().port}`,
      SUPABASE_SECRET_KEY: SECRET,
      OPENTUTOR_TRIAL_CALLS_PER_DAY: '2',
    },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  await new Promise((resolve, reject) => {
    child.stdout.on('data', (d) => { if (String(d).includes('running at')) resolve(); });
    child.on('exit', (code) => reject(new Error(`server exited ${code}`)));
  });
}, 15000);

afterAll(() => {
  child?.kill();
  fake?.close();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

const post = (route, body, headers = {}) => fetch(`${base}${route}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PASSWORD}`, ...headers },
  body: JSON.stringify(body),
});

it('opens on the diagnostic, grades the first answer as one, and resumes on a reload without a model call', async () => {
  const start = await (await post('/api/lesson', { topicSlug: 'game-theory' })).json();
  expect(start).toMatchObject({ reply: '**Goal:** Spot a game\n\nWhat makes a situation a game?', step: 0, totalSteps: 3, done: false });
  const answered = await (await post('/api/lesson', { topicSlug: 'game-theory', answer: 'players who choose' })).json();
  expect(prompts.at(-1)).toContain('## Current Step: diagnostic');

  const before = prompts.length;
  const resumed = await post('/api/lesson', { topicSlug: 'game-theory' });
  expect(resumed.status).toBe(200);
  expect(await resumed.json()).toEqual({ ...answered, resumed: true });
  const streamed = await post('/api/lesson', { topicSlug: 'game-theory' }, { Accept: 'text/event-stream' });
  const [, data] = /^event: done\ndata: (.*)\n\n$/.exec(await streamed.text()); // one event, nothing else
  expect(JSON.parse(data)).toEqual({ ...answered, resumed: true });
  expect(prompts).toHaveLength(before);
});

it('refuses a blank answer and an empty onboarding message with a 400, without a model call', async () => {
  const before = prompts.length;
  for (const [route, body] of [['/api/lesson', { topicSlug: 'game-theory', answer: '  ' }], ['/api/onboard', { message: '' }]]) {
    const res = await post(route, body);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/1 to 4,000 characters/);
  }
  expect(prompts).toHaveLength(before);
  expect((await fetch(`${base}/api/catalog`)).status).toBe(200);
});

// #180: every trial account shares the day's budget of calls on the deployment's key (2 here).
it('refuses a trial call past the day\'s budget with the 402 connect prompt, as JSON and SSE, and an own-key student carries on', async () => {
  const asAccount = (token, route, body, headers = {}) => fetch(`${base}${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: `ot_access=${token}`, Origin: base, ...headers },
    body: JSON.stringify(body),
  });
  const refusal = {
    error: 'Free lessons are used up for today. Connect your OpenRouter account to keep going, or come back tomorrow.',
    connect: true,
    reason: 'daily_limit',
  };
  const before = keys.length;
  expect((await asAccount('tok-a', '/api/onboard', { message: 'hi' })).status).toBe(200);
  expect((await asAccount('tok-b', '/api/lesson', { topicSlug: 'game-theory' })).status).toBe(200);

  const json = await asAccount('tok-a', '/api/lesson', { topicSlug: 'game-theory' });
  expect(json.status).toBe(402);
  expect(await json.json()).toEqual(refusal);
  const sse = await asAccount('tok-b', '/api/lesson', { topicSlug: 'game-theory', answer: 'players' }, { Accept: 'text/event-stream' });
  expect(sse.status).toBe(200);
  expect(await sse.text()).toBe(`event: error\ndata: ${JSON.stringify(refusal)}\n\n`);

  expect((await asAccount('tok-own', '/api/lesson', { topicSlug: 'game-theory' })).status).toBe(200);
  expect(keys.slice(before)).toEqual(['Bearer fake', 'Bearer fake', 'Bearer sk-or-own-student']);
});

// #149: an open BLOCK starts a review of the blocked concept, not the next lesson.
it('starts a review lesson for an open BLOCK, as JSON and over SSE, without a model call', async () => {
  const before = prompts.length;
  const review = { review: true, title: 'Review: payoff matrix', concepts: ['payoff matrix'] };
  const json = await post('/api/lesson', { topicSlug: BLOCKED[0] });
  expect(json.status).toBe(200);
  expect(await json.json()).toMatchObject({ step: 0, totalSteps: 3, done: false, lesson: review, note: "Let's revisit payoff matrix before moving on." });
  const streamed = await post('/api/lesson', { topicSlug: BLOCKED[1] }, { Accept: 'text/event-stream' });
  const [, data] = /^event: done\ndata: (.*)\n\n$/.exec(await streamed.text()); // one event, nothing else
  expect(JSON.parse(data)).toMatchObject({ lesson: review, note: "Let's revisit payoff matrix before moving on." });
  expect(prompts).toHaveLength(before);
});
