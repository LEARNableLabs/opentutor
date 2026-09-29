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
    // A ready-made course to confirm (#223): an account without its own key may only pick one.
    const course = path.join(root, 'skills', 'tutor', 'domains', 'game-theory');
    fs.mkdirSync(course, { recursive: true });
    fs.writeFileSync(path.join(course, 'curriculum.json'), JSON.stringify({ topic: 'Game Theory', lessons: [] }));
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
    expect(res.body).toMatchObject({ reply: 'Good choice.', confirmedTopic: 'game-theory' });
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
    expect(res.body).toMatchObject({ reply: 'Good choice.', confirmedTopic: 'game-theory' });
    expect(String(log.mock.calls)).toMatch(/EROFS/);
  });
});

// #223: onboarding offers the ready-made courses, and never sends a trial account to a custom build.
const { onboardTurn } = await import('../api/onboard.js');
describe('the ready-made courses', () => {
  const trial = () => ({ ...state, userId: 'acct-1', readKV: async () => null }); // no key of its own
  const turn = (s) => onboardTurn({ state: s, skills: new Map(), getAdapter: async () => adapter }, { message: 'I like strategy games' });

  it('are in the prompt, preferred over building a new one', async () => {
    await call();
    const system = adapter.generate.mock.calls[0][0];
    expect(system).toContain('"game-theory"');
    expect(system).toMatch(/ready-made course is better/i);
  });

  it('are the only choice for an account that cannot build a topic', async () => {
    adapter.generate.mockResolvedValue({ text: 'I will build it now.\n<TOPIC>never-built</TOPIC>' });
    const { body } = await turn(trial());
    expect(adapter.generate.mock.calls[0][0]).toMatch(/Custom topic generation is unavailable/);
    expect(body.confirmedTopic).toBeNull();
    expect(body.reply).toMatch(/ready-made/);
  });

  it('turn a readable name into its course', async () => {
    adapter.generate.mockResolvedValue({ text: 'Good pick.\n<TOPIC>Game Theory</TOPIC>' });
    expect((await turn(trial())).body.confirmedTopic).toBe('game-theory');
  });
});

it('reads the marker in any case, and never shows it', async () => {
  adapter.generate.mockResolvedValue({ text: 'Great.\n<Topic>game-theory</Topic>' });
  expect((await call()).body).toMatchObject({ confirmedTopic: 'game-theory', reply: 'Great.' });
});

it('says something when the reply was only the marker', async () => {
  adapter.generate.mockResolvedValue({ text: '<TOPIC>game-theory</TOPIC>' });
  expect((await call()).body.reply).toMatch(/game theory/i);
});

// Review of #229: a course's full title, and markers a model gets wrong.
describe('names and markers', () => {
  const owner = () => ({ ...state, listTopics: async () => ['3d-printer-firmware', 'game-theory'] });
  const trialOf = (s) => ({ ...s, userId: 'acct-1', readKV: async () => null });
  const turn = (s) => onboardTurn({ state: s, skills: new Map(), getAdapter: async () => adapter }, { message: 'firmware' });

  it('confirms a course named by its full title, subtitle and all', async () => {
    adapter.generate.mockResolvedValue({ text: 'Good.\n<TOPIC>3D Printer Firmware — Motion Planning and Kinematics</TOPIC>' });
    expect((await turn(trialOf(owner()))).body.confirmedTopic).toBe('3d-printer-firmware');
  });

  it('never leaves the reply empty, even for an empty marker', async () => {
    adapter.generate.mockResolvedValue({ text: '<TOPIC> </TOPIC>' });
    const { body } = await turn(owner());
    expect(body.confirmedTopic).toBeNull();
    expect(body.reply.trim()).not.toBe('');
  });

  it('never shows a stray marker, or confirms what a doubled one wraps', async () => {
    adapter.generate.mockResolvedValue({ text: '<TOPIC><TOPIC>knots</TOPIC>' });
    const { body } = await turn(owner());
    expect(body.reply).not.toMatch(/<\/?topic>/i);
    expect(body.confirmedTopic).toBe('knots');
  });
});

// Second review of #229: real course titles, not slug prefixes; tags with spaces; a clean refusal.
describe('course titles and tags', () => {
  const catalog = () => ({ ...state, listTopics: async () => ['astrophotography', 'logic', 'game-theory'] });
  const trialOf = (s) => ({ ...s, userId: 'acct-1', readKV: async () => null });
  const turn = (s) => onboardTurn({ state: s, skills: new Map(), getAdapter: async () => adapter }, { message: 'photos of stars' });
  const confirm = async (text) => { adapter.generate.mockResolvedValue({ text }); return (await turn(trialOf(catalog()))).body; };

  it.each([
    ['its full title', 'Night sky photography — astrophotography techniques', 'astrophotography'],
    ['the main part of its title', 'Night sky photography', 'astrophotography'],
    ['a title with a subtitle after a dash', 'Logic — from Aristotle to Gödel', 'logic'],
  ])('confirms a course named by %s', async (_how, name, slug) => {
    expect((await confirm(`Good.\n<TOPIC>${name}</TOPIC>`)).confirmedTopic).toBe(slug);
  });

  it.each(['Logic Gates and Digital Circuits', 'Game Theory Advanced'])('does not take "%s" for a course it only starts like', async (name) => {
    expect((await confirm(`Good.\n<TOPIC>${name}</TOPIC>`)).confirmedTopic).toBeNull();
  });

  it('reads a marker with spaces in its tags, and never shows it', async () => {
    const body = await confirm('Good.\n< TOPIC >game-theory</ TOPIC >');
    expect(body).toMatchObject({ confirmedTopic: 'game-theory', reply: 'Good.' });
  });

  it('refuses a topic it cannot build without keeping a promise to build it', async () => {
    const { reply } = await confirm('I will build it now.\n<TOPIC>never-built</TOPIC>');
    expect(reply).not.toMatch(/build it now/);
    expect(reply).toMatch(/ready-made/);
  });

  // Third review of #229.
  it('takes a student\'s own course by its slug before another course\'s title', async () => {
    adapter.generate.mockResolvedValue({ text: 'Good.\n<TOPIC>night-sky-photography</TOPIC>' });
    const own = { ...catalog(), listTopics: async () => ['astrophotography', 'night-sky-photography'] };
    expect((await turn(own)).body.confirmedTopic).toBe('night-sky-photography');
  });

  it.each([
    ['an empty marker', "I'll build it now.\n<TOPIC> </TOPIC>"],
    ['a marker that never closes', "I'll build it now.\n<TOPIC>game theory"],
  ])('keeps no promise around %s', async (_case, text) => {
    for (const s of [trialOf(catalog()), catalog()]) {
      adapter.generate.mockResolvedValue({ text });
      const { body } = await turn(s);
      expect(body.confirmedTopic).toBeNull();
      expect(body.reply).toMatch(/^What would you like to learn\?/);
    }
  });
});
