import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import fs from 'node:fs';

let state, adapter;
const reference = fs.readFileSync(new URL('../skills/tutor/references/onboarding.md', import.meta.url), 'utf8');
vi.mock('../api/_lib/init.js', () => ({
  getState: async () => state,
  getAdapter: () => adapter,
  getSkills: () => new Map([['onboarding', reference]]),
}));
const handler = (await import('../api/onboard.js')).default;

beforeEach(() => {
  vi.stubEnv('OPENTUTOR_PASSWORD', 'test-password');
  vi.stubEnv('VERCEL', '1');
  state = { readUser: async () => '', listTopics: vi.fn(async () => ['game-theory', 'breadmaking']) };
  adapter = { generate: vi.fn(async () => ({ text: 'Let us start.\n<TOPIC>game-theory</TOPIC>' })) };
});
afterEach(() => vi.unstubAllEnvs());

async function call() {
  const res = {
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  await handler({ method: 'POST', headers: { authorization: 'Bearer test-password' }, body: { message: 'Teach me game theory' } }, res);
  return res;
}

it('gives hosted onboarding the available catalog and confirms an exact available slug', async () => {
  const res = await call();
  expect(res.statusCode).toBe(200);
  expect(res.body).toMatchObject({ confirmedTopic: 'game-theory', reply: 'Let us start.' });
  const prompt = adapter.generate.mock.calls[0][0];
  expect(prompt).toContain('Custom topic generation is unavailable. Never promise to research or build a new curriculum.');
  expect(prompt).toContain('Available topic slugs: ["game-theory","breadmaking"]');
});

it('does not forward an unsupported model suggestion to topic activation', async () => {
  adapter.generate.mockResolvedValue({ text: 'I will build it now.\n<TOPIC>never-built</TOPIC>' });
  const res = await call();
  expect(res.body.confirmedTopic).toBeNull();
  expect(res.body.reply).toContain('Browse available topics');
  expect(res.body.reply).not.toContain('I will build it');
});

it('does not confirm a topic when the catalog is empty', async () => {
  state.listTopics.mockResolvedValue([]);
  const res = await call();
  expect(res.body.confirmedTopic).toBeNull();
  expect(adapter.generate.mock.calls[0][0]).toContain('Available topic slugs: []');
});
