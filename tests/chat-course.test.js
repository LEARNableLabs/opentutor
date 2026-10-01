import { it, expect, vi } from 'vitest';
import { chatTurn } from '../api/chat.js';

// #273: a chat reply can offer a course; the route reads the offer, matches it to a ready-made
// course when there is one, and never shows the marker.
async function turn(text, message = 'I want to really learn game theory') {
  let system = '';
  const adapter = { generate: vi.fn(async (s) => ((system = s), { text, model: 'm' })) };
  const res = await chatTurn({ state: { readUser: async () => '' }, getAdapter: async () => adapter }, { message });
  return { ...res, system };
}

it('offers a ready-made course when the subject is one', async () => {
  const { body } = await turn('Game theory is the study of strategic choices.\n\n<COURSE>game theory</COURSE>');
  expect(body.course).toEqual({ topic: 'Game Theory', slug: 'game-theory' });
  expect(body.reply).toBe('Game theory is the study of strategic choices.');
});

it('offers a new course when no ready-made one matches', async () => {
  const { body } = await turn('Sourdough is a living culture.<COURSE> Sourdough baking at home </COURSE>');
  expect(body.course).toEqual({ topic: 'Sourdough baking at home', slug: null });
  expect(body.reply).toBe('Sourdough is a living culture.');
});

it('offers nothing without the marker, and strips a broken one', async () => {
  expect((await turn('A Nash equilibrium is a stable outcome.')).body.course).toBeUndefined();
  const broken = await turn('Answer. <COURSE>never closed');
  expect(broken.body.course).toBeUndefined();
  expect(broken.body.reply).not.toMatch(/COURSE/);
});

it('tells the model when to offer a course, and only one', async () => {
  const { system } = await turn('ok');
  expect(system).toMatch(/<COURSE>/);
  expect(system).toMatch(/never for a quick question/i);
});

it('prefers the ready-made course when the model dresses the subject up', async () => {
  for (const named of ['Game theory from scratch', 'Game theory, from the ground up', 'game theory basics']) {
    const { body } = await turn(`Sure.\n<COURSE>${named}</COURSE>`);
    expect(body.course, named).toEqual({ topic: 'Game Theory', slug: 'game-theory' });
  }
});

it('never mistakes a different subject for a ready-made one that merely shares a word', async () => {
  const { body } = await turn('Sure.\n<COURSE>Gamebook writing</COURSE>');
  expect(body.course.slug).toBeNull();
});

it('asks for the subject alone, and names the requests that deserve a course', async () => {
  const { system } = await turn('ok');
  expect(system).toMatch(/teach me/);
  expect(system).toMatch(/subject alone/);
});

// #275 review: only one marker, at the very end, is an offer; every marker is hidden.
it.each([
  ['an echoed marker mid-reply', 'You said: <COURSE>game theory</COURSE> — which is a fine phrase. Anything else?'],
  ['a nested marker', 'Sure. <COURSE>outer <COURSE>game theory</COURSE></COURSE>'],
  ['two markers', 'Sure.\n<COURSE>game theory</COURSE>\n<COURSE>sourdough</COURSE>'],
])('offers nothing for %s, and shows no marker', async (_case, text) => {
  const { body } = await turn(text);
  expect(body.course).toBeUndefined();
  expect(body.reply).not.toMatch(/COURSE|game theory<|sourdough$/);
  expect(body.reply).not.toMatch(/<|>/);
});

it.each([
  ['game theory basics', 'game-theory'],
  ['Intro to game theory', 'game-theory'],
  ['game theory for beginners', 'game-theory'],
  ['architecture decision records', null],
  ['Game theory and sourdough baking', null],
])('matches "%s" to a ready-made course only through a known qualifier', async (named, slug) => {
  const { body } = await turn(`Sure.\n<COURSE>${named}</COURSE>`);
  expect(body.course.slug).toBe(slug);
});

// With #271: the offer and the link filter both apply to one reply.
it('offers the course and drops an untrusted link from the same reply', async () => {
  const { body, system } = await turn('See [this](https://evil.example/x) or [Game theory](https://en.wikipedia.org/wiki/Game_theory).\n<COURSE>game theory</COURSE>');
  expect(body.course).toEqual({ topic: 'Game Theory', slug: 'game-theory' });
  expect(body.reply).toBe('See this or [Game theory](https://en.wikipedia.org/wiki/Game_theory).');
  expect(system).toMatch(/## Courses/);
});
