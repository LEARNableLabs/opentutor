import { it, expect } from 'vitest';
import { retestOutcome, withRetest, namesConcept } from '../lib/core/deliberate-practice.js';

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
])('reads %s', (_case, session, options, expected) => {
  expect(retestOutcome(session, options)).toEqual(expected);
});

// Review of #238: newer evidence wins both ways.
it('withdraws an earlier pass when a later retest fails', () => {
  expect(withRetest({ alpha: 3, beta: 2 }, { concept: 'alpha', passed: false }, { lessons: [] })).toEqual({ beta: 2 });
});

it('ranks a lesson\'s opening retest before that lesson, and a review after every lesson', () => {
  const curriculum = { lessons: [{ status: 'completed' }, { status: 'completed' }, { status: 'pending' }] };
  expect(withRetest({}, { concept: 'alpha', passed: true }, curriculum, { openedThisLesson: true })).toEqual({ alpha: 1 });
  expect(withRetest({}, { concept: 'alpha', passed: true }, curriculum)).toEqual({ alpha: 2 });
});

it.each([
  ['set', 'How does asset allocation work?', false],
  ['SQL', 'What is NoSQL?', false],
  ['set', 'Before we start: what is a set?', true],
  ['C++', 'What is C++ good for?', true],
])('%s is named in "%s": %s', (concept, question, expected) => {
  expect(namesConcept(question, concept)).toBe(expected);
});
