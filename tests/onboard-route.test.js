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

it('uses the onboarding guide and confirms a topic for generation', async () => {
  const res = await call();
  expect(res.statusCode).toBe(200);
  expect(res.body).toMatchObject({ confirmedTopic: 'game-theory', reply: 'Let us start.' });
  expect(adapter.generate.mock.calls[0][0]).toContain(reference);
});
it('forwards a new topic to the durable generation flow', async () => {
  adapter.generate.mockResolvedValue({ text: 'I will build it now.\n<TOPIC>never-built</TOPIC>' });
  const res = await call();
  expect(res.body).toMatchObject({confirmedTopic:'never-built',reply:'I will build it now.'});
});
it('keeps conversation open until the model confirms a topic', async () => {
  adapter.generate.mockResolvedValue({text:'What would you like to learn?'});
  expect((await call()).body.confirmedTopic).toBeNull();
});
