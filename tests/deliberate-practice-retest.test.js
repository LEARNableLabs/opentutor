import { it, expect } from 'vitest';
import { settledConcept, withRetest, namesConcept } from '../lib/core/deliberate-practice.js';

// #227: which concept a finished session settled, shared by the web and the bot.
const retrieval = (score) => [{ step: 'retrieval', score }, { step: 'diagnostic', score: 0.2 }];

it.each([
  ['a review that passed', { isReview: true, reviewConcept: 'alpha' }, { passedReview: true }, 'alpha'],
  ['a review that did not', { isReview: true, reviewConcept: 'alpha' }, { passedReview: false }, null],
  ['a web lesson whose opening retest was right', { retestConcept: 'alpha', assessments: retrieval(0.8) }, { passedReview: false }, 'alpha'],
  ['a bot lesson whose opening retest was right', { retrievalConcept: 'alpha', assessments: retrieval(0.7) }, { passedReview: true }, 'alpha'],
  ['a lesson whose opening retest was wrong', { retestConcept: 'alpha', assessments: retrieval(0.6) }, { passedReview: true }, null],
  ['a lesson with no retest', { assessments: retrieval(1) }, { passedReview: true }, null],
])('settles %s correctly', (_case, session, options, expected) => {
  expect(settledConcept(session, options)).toBe(expected);
});

it('ranks a lesson\'s opening retest before that lesson, and a review after every lesson', () => {
  const curriculum = { lessons: [{ status: 'completed' }, { status: 'completed' }, { status: 'pending' }] };
  expect(withRetest({}, 'alpha', curriculum, { openedThisLesson: true })).toEqual({ alpha: 1 });
  expect(withRetest({}, 'alpha', curriculum)).toEqual({ alpha: 2 });
});

it.each([
  ['set', 'How does asset allocation work?', false],
  ['SQL', 'What is NoSQL?', false],
  ['set', 'Before we start: what is a set?', true],
  ['C++', 'What is C++ good for?', true],
])('%s is named in "%s": %s', (concept, question, expected) => {
  expect(namesConcept(question, concept)).toBe(expected);
});
