import { it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// #148 and #159 on the local server, which has its own /api/lesson route. The real
// scripts/web/server.js runs as a child process; its model is a fake OpenRouter here
// that records every call. Explicit env only: a checkout's .env holds production keys.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PASSWORD = 'test-lesson-server-password';
const PLAN = { goal: 'Spot a game', retrieval: null, diagnostic: 'What makes a situation a game?', followUp: 'Example?', application: 'Apply it.', commonMisconceptions: [] };
const prompts = [];
let fake, child, base, dataDir;

beforeAll(async () => {
  fake = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      const system = JSON.parse(body).messages[0].content;
      prompts.push(system);
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
