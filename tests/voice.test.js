import { it, expect } from 'vitest';
import fs from 'node:fs';
import { buildSocraticResponsePrompt, buildLessonPlanPrompt, buildOnboardingPrompt, VOICE } from '../lib/core/prompts.js';
import { chatTurn } from '../api/chat.js';

// #256: one voice for everything a student reads, so the wit and the engagement rules
// can't drift apart between the web, Telegram and the chat.
const PLAN = { goal: 'g', diagnostic: 'd', followUp: 'f', application: 'a', commonMisconceptions: [] };

it('names the voice once, with the wit, its limits and the engagement rules', () => {
  expect(VOICE).toMatch(/^## Voice/);
  expect(VOICE).toMatch(/Charlie Munger/);
  expect(VOICE).toMatch(/Never more than one per reply/);
  expect(VOICE).toMatch(/frustrated/);
  expect(VOICE).toMatch(/never a definition/i);
});

it.each([
  ['a lesson reply', () => buildSocraticResponsePrompt(PLAN, 'x', 'diagnostic', '', { markdown: true }).system],
  ['a Telegram lesson reply', () => buildSocraticResponsePrompt(PLAN, 'x', 'diagnostic', '').system],
  ['the lesson plan that writes the questions', () => buildLessonPlanPrompt(new Map(), { lesson: 1, title: 't', concepts: ['c'] }).system],
  ['onboarding', () => buildOnboardingPrompt(new Map()).system],
])('%s speaks in the voice', (_what, build) => {
  expect(build()).toContain(VOICE);
});

it('the chat speaks in the voice', async () => {
  let system = '';
  const adapter = { generate: async (s) => ((system = s), { text: 'ok', model: 'm' }) };
  await chatTurn({ state: { readUser: async () => '' }, getAdapter: async () => adapter }, { message: 'hi' });
  expect(system).toContain(VOICE);
});

it('the Telegram persona uses the shared voice, not its own', () => {
  const source = fs.readFileSync('scripts/bot/context.js', 'utf8');
  expect(source).toMatch(/import \{[^}]*\bVOICE\b[^}]*\} from '..\/..\/lib\/core\/prompts\.js'/);
  expect(source).not.toMatch(/use smart, light humor only when it helps/);
});
