import { it, expect, vi } from 'vitest';
import fs from 'node:fs';
import { buildSocraticResponsePrompt, buildLessonPlanPrompt, buildOnboardingPrompt, buildDemoPrompt, VOICE } from '../lib/core/prompts.js';
import { chatTurn } from '../api/chat.js';
import { buildQuickStartPrompt } from '../lib/core/quick-start.js';

// #256: one voice for everything a student reads, so the wit and the engagement rules
// can't drift apart between the web, Telegram and the chat.
const PLAN = { goal: 'g', diagnostic: 'd', followUp: 'f', application: 'a', commonMisconceptions: [] };

it('names the voice once, with the wit, its limits and the engagement rules', () => {
  expect(VOICE).toMatch(/^## Voice/);
  expect(VOICE).toMatch(/Charlie Munger/);
  expect(VOICE).toMatch(/Never more than one per reply/);
  expect(VOICE).toMatch(/frustrated/);
  expect(VOICE).toMatch(/never a definition/i);
  // The step's rules win: wit never adds or replaces a question, never stretches a reply.
  expect(VOICE).toMatch(/length limit and its question rule come first/);
  expect(VOICE).not.toMatch(/\?"\)/); // no question-shaped example to copy
});

it.each(['skills/tutor/SKILL.md', 'claude-web/SKILL.md', 'workspace/SOUL.md', 'hermes/SOUL.md', 'openclaw/SOUL.md'])(
  'the portable skill %s carries the wit and both of its limits',
  (file) => {
    const text = fs.readFileSync(file, 'utf8');
    expect(text).toMatch(/Charlie Munger/);
    expect(text).toMatch(/frustrated/);
    expect(text).toMatch(/missed twice/);
    expect(text).not.toMatch(/memorable quote or aphorism/);
    expect(text).not.toMatch(/End each lesson\/session with a short aphorism of your own related to the topic \(a quote only when you are certain who said it\)\. It counts/); // must yield to the humor limits
  },
);

it.each([
  ['a lesson reply', () => buildSocraticResponsePrompt(PLAN, 'x', 'diagnostic', '', { markdown: true }).system],
  ['a Telegram lesson reply', () => buildSocraticResponsePrompt(PLAN, 'x', 'diagnostic', '').system],
  ['the lesson plan that writes the questions', () => buildLessonPlanPrompt(new Map(), { lesson: 1, title: 't', concepts: ['c'] }).system],
  ['onboarding', () => buildOnboardingPrompt(new Map()).system],
  ['the landing-page demo', () => buildDemoPrompt().system],
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

it('the course taster, the Telegram quiz and flashcards speak in the voice', async () => {
  expect(buildQuickStartPrompt(null, 'Topic', 'beginner', {}, '').system).toContain(VOICE);
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token'); // the bot's config checks it on import
  const bot = await import('../scripts/bot/context.js');
  vi.unstubAllEnvs();
  expect(bot.buildQuizPrompt(null, 'demo', []).system).toContain(VOICE);
  expect(bot.buildFlashcardPrompt(null, { streak: 1, reps: 0 }).system).toContain(VOICE);
});
