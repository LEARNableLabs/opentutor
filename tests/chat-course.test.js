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
