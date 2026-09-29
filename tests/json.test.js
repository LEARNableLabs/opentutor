import { it, expect } from 'vitest';
import { parseFirstJson } from '../lib/core/json.js';
import { CurriculumPipeline } from '../lib/core/pipeline.js';

// #233: a greedy /\{[\s\S]*\}/ ran on to the last brace of anything after the JSON.
it.each([
  ['text after it', '{"a":1}\n\nHope this helps! {x}', { a: 1 }],
  ['a second object after it', '{"a":1}\n{"b":2}', { a: 1 }],
  ['prose braces before it', 'Use {braces} with care: {"a":1}', { a: 1 }],
  ['a prose brace that never closes before it', 'Use { to mark a block.\n{"a":1}', { a: 1 }],
  ['much space before its first key', `{${' '.repeat(80)}"a":1}`, { a: 1 }],
  ['braces and quotes inside its strings', '{"a":"} { \\" }"}', { a: '} { " }' }],
  ['a fence around it', '```json\n{"a":{"b":[1,2]}}\n```', { a: { b: [1, 2] } }],
])('reads the first object with %s', (_case, text, expected) => {
  expect(parseFirstJson(text)).toEqual(expected);
});

it.each([
  ['no JSON', 'Just prose.'],
  ['an object cut short', '{"curriculum":{"lessons":[{"day":1}'],
  ['a broken object, never the valid one inside it', '{"curriculum":{"lessons":[{"day":1}]},}'],
])('returns null for %s', (_case, text) => {
  expect(parseFirstJson(text)).toBeNull();
});

// Seen live: a complete 33-lesson course followed by more text failed the build step.
const pipeline = new CurriculumPipeline({ adapter: {}, state: {}, skills: { get: () => '' } });

it('reads a course the builder followed with more text', () => {
  const course = JSON.stringify({ curriculum: { lessons: [{ day: 1, title: 'Gutenberg' }] } });
  expect(pipeline._parsePipelineOutput(`${course}\n\nLet me know if you want changes {or more}.`, 'Printing', 'printing').curriculum.lessons).toHaveLength(1);
});

it('keeps an approval the critic followed with more text', () => {
  const verdict = JSON.stringify({ critique: 'Sound.', status: 'APPROVED', severity: 'minor' });
  expect(pipeline._parseCriticOutput(`${verdict}\n{"note": "done"}`).status).toBe('APPROVED');
});

