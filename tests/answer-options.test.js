import { it, expect } from 'vitest';
import { suggestedAnswers, settleOptions } from '../lib/core/answer-options.js';
import { buildSocraticResponsePrompt, buildLessonPlanPrompt } from '../lib/core/prompts.js';
const buildLessonPlanPromptFor = () => buildLessonPlanPrompt(new Map(), { lesson: 1, title: 't', concepts: ['c'] });

// #255: one set of rules for suggested answers, on the web and in Telegram.
const plan = () => ({
  diagnostic: 'Why?',
  diagnosticOptions: ['Right answer', 'Misconception one', 'Misconception two', "I'm not sure — explain it to me"],
  followUpOptions: ['A', ' ', 'A', 'B', "I'm not sure"],
  applicationOptions: ['Never', 'Shown'],
  mcOptions: [{ label: 'A', text: 'kept for the bot' }],
});

it('shuffles each question\'s answers once, keeping the escape option last', () => {
  const settled = settleOptions(plan(), () => 0); // always pick the first remaining: a full rotation
  expect(settled.diagnosticOptions).toHaveLength(4);
  expect(settled.diagnosticOptions.at(-1)).toBe("I'm not sure — explain it to me");
  expect(settled.diagnosticOptions[0]).not.toBe('Right answer');
  expect([...settled.diagnosticOptions].sort()).toEqual([...plan().diagnosticOptions].sort());
});

it('cleans the answers and gives the application step none', () => {
  const settled = settleOptions(plan(), () => 0.99);
  expect(settled.followUpOptions).toEqual(['A', 'B', "I'm not sure"]);
  expect(settled.applicationOptions).toBeNull();
  expect(settled.mcOptions).toEqual([{ label: 'A', text: 'kept for the bot' }]); // the bot's own format
  expect(suggestedAnswers(settled, 'application')).toBeNull();
  expect(suggestedAnswers(settled, 'followUp')).toEqual(['A', 'B', "I'm not sure"]);
});

it('keeps the tutor from reading the suggested answers out in its reply', () => {
  const { system } = buildSocraticResponsePrompt(plan(), 'x', 'diagnostic', '', { markdown: true });
  expect(system).not.toContain('Misconception one');
  expect(system).not.toContain('diagnosticOptions');
  expect(system).toContain('Why?');
});

it('has the tutor ask a question with suggested answers as planned, and only then', () => {
  const RULE = /Ask the next question as the lesson plan words it/;
  expect(buildSocraticResponsePrompt(plan(), 'x', 'diagnostic', '', { markdown: true, askAsPlanned: true }).system).toMatch(RULE);
  expect(buildSocraticResponsePrompt(plan(), 'x', 'diagnostic', '', { markdown: true }).system).not.toMatch(RULE);
});

it('shows retrieval options in the plan schema as a list, like the others', () => {
  const { system } = buildLessonPlanPromptFor();
  expect(system).toMatch(/"retrievalOptions": \["answer 1", "answer 2", "answer 3", "I don't remember"\]/);
});
