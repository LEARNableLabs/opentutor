import { it, expect } from 'vitest';
import { retestOutcome, withRetest, namesConcept, parseRetested, formatPracticeFeedback } from '../lib/core/deliberate-practice.js';
import { buildStudentModel } from '../lib/core/student-model.js';

// #227: which concept a finished session settled, shared by the web and the bot.
const retrieval = (score) => [{ step: 'retrieval', score }, { step: 'diagnostic', score: 0.2 }];

it.each([
  ['a review that passed', { isReview: true, reviewConcept: 'alpha' }, { passedReview: true }, { concept: 'alpha', passed: true }],
  ['a review that did not', { isReview: true, reviewConcept: 'alpha' }, { passedReview: false }, { concept: 'alpha', passed: false }],
  ['a web lesson whose opening retest was right', { retestConcept: 'alpha', assessments: retrieval(0.8) }, { passedReview: false }, { concept: 'alpha', passed: true }],
  ['a bot lesson whose opening retest was right', { retrievalConcept: 'alpha', assessments: retrieval(0.7) }, { passedReview: true }, { concept: 'alpha', passed: true }],
  ['a lesson whose opening retest was wrong', { retestConcept: 'alpha', assessments: retrieval(0.6) }, { passedReview: true }, { concept: 'alpha', passed: false }],
  ['a lesson whose retest went ungraded', { retestConcept: 'alpha', assessments: [] }, { passedReview: true }, null],
  ['a lesson with no retest', { assessments: retrieval(1) }, { passedReview: true }, null],
  ['a lesson whose retest score is out of range, high', { retrievalConcept: 'alpha', assessments: retrieval(2) }, { passedReview: true }, null],
  ['a lesson whose retest score is out of range, low', { retrievalConcept: 'alpha', assessments: retrieval(-1) }, { passedReview: true }, null],
])('reads %s', (_case, session, options, expected) => {
  expect(retestOutcome(session, options)).toEqual(expected);
});

// Review of #238: newer evidence wins both ways, over a saved pass or an older lesson's grade.
it('records a missed retest over an earlier pass', () => {
  expect(withRetest({ alpha: { at: 3, passed: true } }, { concept: 'alpha', passed: false }, { lessons: [{ status: 'completed' }] }))
    .toEqual({ alpha: { at: 1, passed: false } });
});

it('makes a concept shaky when a retest after its good lesson is missed', () => {
  const curriculum = { lessons: [
    { status: 'completed', engagement: 'correct', concepts: ['alpha'] },
    { status: 'completed', engagement: 'correct', concepts: ['beta'] },
  ] };
  expect(buildStudentModel('', curriculum, '', {}).concepts.solid).toContain('alpha');
  const missed = withRetest({}, { concept: 'alpha', passed: false }, curriculum);
  expect(buildStudentModel('', curriculum, '', missed).concepts.shaky).toContain('alpha');
});

it('keeps passes and misses in the feedback file', () => {
  const retested = { alpha: { at: 4, passed: true }, beta: { at: 5, passed: false } };
  const md = formatPracticeFeedback({ timestamp: 't', observations: [], directives: [], retested, model: { recentAccuracy: 0.5, trend: 'steady', difficulty: { level: 3, label: 'standard' }, engagement: 'steady', concepts: { shaky: [] } } }, 'Demo');
  expect(parseRetested(md)).toEqual(retested);
});

it('ranks a lesson\'s opening retest before that lesson, and a review after every lesson', () => {
  const curriculum = { lessons: [{ status: 'completed' }, { status: 'completed' }, { status: 'pending' }] };
  expect(withRetest({}, { concept: 'alpha', passed: true }, curriculum, { openedThisLesson: true })).toEqual({ alpha: { at: 1, passed: true } });
  expect(withRetest({}, { concept: 'alpha', passed: true }, curriculum)).toEqual({ alpha: { at: 2, passed: true } });
});

it.each([
  ['set', 'How does asset allocation work?', false],
  ['SQL', 'What is NoSQL?', false],
  ['set', 'Before we start: what is a set?', true],
  ['C++', 'What is C++ good for?', true],
])('%s is named in "%s": %s', (concept, question, expected) => {
  expect(namesConcept(question, concept)).toBe(expected);
});
