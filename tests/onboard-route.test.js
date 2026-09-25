import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TutorStore } from '../lib/core/store.js';

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
  // SupabaseStore's shape: async, and '' for a student with no profile row.
  state = { readUser: async () => '', writeUser: vi.fn(async () => {}), listTopics: vi.fn(async () => ['game-theory', 'breadmaking']) };
  adapter = { generate: vi.fn(async () => ({ text: 'Let us start.\n<TOPIC>game-theory</TOPIC>' })) };
});
afterEach(() => vi.unstubAllEnvs());

async function call(body = { message: 'Teach me game theory' }) {
  const res = {
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  await handler({ method: 'POST', headers: { authorization: 'Bearer test-password' }, body }, res);
  return res;
}

it('uses the onboarding guide and confirms a topic for generation', async () => {
  const res = await call();
  expect(res.statusCode).toBe(200);
  expect(res.body).toMatchObject({ confirmedTopic: 'game-theory', reply: 'Let us start.' });
  expect(adapter.generate.mock.calls[0][0]).toContain(reference);
  expect(state.writeUser).toHaveBeenCalledWith(expect.stringContaining('- Teach me game theory'));
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
// #157 — a failed read looked like "no profile yet", so the save below could overwrite a real one.
it('saves nothing when the profile cannot be read, and says so in the log', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  state.readUser = vi.fn().mockResolvedValueOnce('').mockRejectedValue(new Error('relation "kv" does not exist'));
  const res = await call();
  expect(res.body).toMatchObject({ confirmedTopic: 'game-theory' });
  expect(state.writeUser).not.toHaveBeenCalled();
  expect(log).toHaveBeenCalledWith('[onboard] profile not saved:', 'relation "kv" does not exist');
  log.mockRestore();
});

// #155 — onboarding dropped everything the student said, so the overlay came
// back on every visit and the tutor never learned who they were.
const asAsync = (store) => new Proxy(store, {
  get: (target, key) => (typeof target[key] === 'function' ? async (...args) => target[key](...args) : target[key]),
});

describe.each([
  ['the sync TutorStore', (s) => s],
  ['an async store shaped like SupabaseStore', asAsync],
])('the profile onboarding leaves behind, on %s', (_name, wrap) => {
  let root, store;
  const history = [
    { role: 'user', content: "Hi! I'm Ada, a nurse who wants to think more strategically." },
    { role: 'assistant', content: 'Nice to meet you, Ada. Game theory or negotiation?' },
  ];
  const confirm = { text: 'Good choice.\n<TOPIC>Game theory</TOPIC>' };

  beforeEach(() => {
    vi.stubEnv('OPENTUTOR_DATA_DIR', '');
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-onboard-'));
    store = new TutorStore(root);
    state = wrap(store);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    store.close();
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('keeps what the student said once a topic is confirmed', async () => {
    adapter.generate.mockResolvedValue(confirm);
    const res = await call({ message: 'Game theory, please.', history });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ reply: 'Good choice.', confirmedTopic: 'Game theory' });
    const profile = await state.readUser();
    expect(profile).toContain('## In their own words (from onboarding)');
    expect(profile).toContain("- Hi! I'm Ada, a nurse who wants to think more strategically.\n- Game theory, please.");
    expect(profile).not.toContain('Nice to meet you'); // the tutor's turns are not the student's words
  });

  it('keeps an account\'s first answers even though the model only sees the recent turns', async () => {
    state = wrap(store.forStudent('acct-11111111-1111-4111-8111-111111111111'));
    adapter.generate.mockResolvedValue(confirm);
    const long = [
      { role: 'user', content: 'My name is Ada.' },
      ...Array.from({ length: 19 }, (_, i) => ({ role: i % 2 ? 'user' : 'assistant', content: `turn ${i}` })),
    ];
    await call({ message: 'Game theory, please.', history: long });
    // The model still gets the trimmed history…
    expect(adapter.generate.mock.calls.at(-1)[1]).not.toContainEqual({ role: 'user', content: 'My name is Ada.' });
    // …but the profile keeps what the student said first.
    expect(await state.readUser()).toContain('- My name is Ada.\n');
  });

  it('writes nothing while the conversation is still open', async () => {
    adapter.generate.mockResolvedValue({ text: 'What would you like to learn?' });
    const before = await state.readUser();
    await call({ message: 'Game theory, please.', history });
    expect(await state.readUser()).toBe(before);
  });

  it('never overwrites a profile that already has content', async () => {
    const theirs = '# Student Profile\n\n## Identity\n- **Name:** Grace\n';
    await state.writeUser(theirs);
    adapter.generate.mockResolvedValue(confirm);
    await call({ message: 'Game theory, please.', history });
    expect(await state.readUser()).toBe(theirs);
  });

  it('caps each message at 500 characters and the profile at 3,000', async () => {
    adapter.generate.mockResolvedValue(confirm);
    const long = Array.from({ length: 8 }, (_, i) => ({ role: 'user', content: String(i).repeat(1000) }));
    await call({ message: 'z'.repeat(4000), history: long });
    const profile = await state.readUser();
    expect(profile).toContain(`- ${'0'.repeat(500)}\n- ${'1'.repeat(500)}\n`);
    expect(profile).not.toContain('0'.repeat(501));
    expect(profile.length).toBeLessThanOrEqual(3000);
  });

  it('still answers when the profile cannot be saved, and says so in the log', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    store.writeUser = () => { throw new Error('EROFS: read-only file system'); };
    adapter.generate.mockResolvedValue(confirm);
    const res = await call({ message: 'Game theory, please.', history });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ reply: 'Good choice.', confirmedTopic: 'Game theory' });
    expect(String(log.mock.calls)).toMatch(/EROFS/);
  });
});
