import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockProgress = {
  active_topics: [],
  schedule: {},
  spaced_repetition: {},
};

vi.mock('../../scripts/bot/config.js', () => ({
  PATHS: { progress: '/tmp/opentutor-test-progress.json' },
}));

vi.mock('../../scripts/bot/state.js', () => ({
  readProgress: vi.fn(() => JSON.parse(JSON.stringify(mockProgress))),
  updateProgress: vi.fn((fn) => {
    fn(mockProgress);
    return mockProgress;
  }),
}));

vi.mock('../../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import {
  registerConcept,
  registerLessonConcepts,
  recordReview,
  getDueReviews,
  getRepetitionSummary,
} from '../../scripts/bot/spaced-repetition.js';

describe('spaced repetition', () => {
  beforeEach(() => {
    mockProgress.spaced_repetition = {};
  });

  it('registers a new concept', () => {
    registerConcept('math', 'derivatives');
    const key = 'math::derivatives';
    expect(mockProgress.spaced_repetition[key]).toBeDefined();
    expect(mockProgress.spaced_repetition[key].concept).toBe('derivatives');
    expect(mockProgress.spaced_repetition[key].ease).toBe(2.5);
  });

  it('does not overwrite an existing concept', () => {
    registerConcept('math', 'integrals');
    const key = 'math::integrals';
    mockProgress.spaced_repetition[key].ease = 1.5;
    registerConcept('math', 'integrals');
    expect(mockProgress.spaced_repetition[key].ease).toBe(1.5);
  });

  it('registers multiple concepts from a lesson', () => {
    registerLessonConcepts('physics', ['force', 'mass', 'acceleration']);
    expect(Object.keys(mockProgress.spaced_repetition)).toHaveLength(3);
  });

  it('records a wrong review — resets interval and reduces ease', () => {
    registerConcept('math', 'limits');
    const key = 'math::limits';
    mockProgress.spaced_repetition[key].streak = 3;
    mockProgress.spaced_repetition[key].interval = 10;
    mockProgress.spaced_repetition[key].ease = 2.5;

    recordReview('math', 'limits', 'wrong');

    expect(mockProgress.spaced_repetition[key].interval).toBe(1);
    expect(mockProgress.spaced_repetition[key].streak).toBe(0);
    expect(mockProgress.spaced_repetition[key].ease).toBe(2.3);
  });

  it('records an easy review — increases interval and ease', () => {
    registerConcept('math', 'series');
    const key = 'math::series';
    mockProgress.spaced_repetition[key].streak = 2;
    mockProgress.spaced_repetition[key].interval = 3;
    mockProgress.spaced_repetition[key].ease = 2.5;

    recordReview('math', 'series', 'easy');

    expect(mockProgress.spaced_repetition[key].interval).toBe(8); // ceil(3 * 2.5)
    expect(mockProgress.spaced_repetition[key].streak).toBe(3);
    expect(mockProgress.spaced_repetition[key].ease).toBe(2.6);
  });

  it('gets summary for a topic', () => {
    registerConcept('cs', 'recursion');
    registerConcept('cs', 'sorting');
    const key1 = 'cs::recursion';
    mockProgress.spaced_repetition[key1].next_review = '2020-01-01'; // overdue
    mockProgress.spaced_repetition[key1].ease = 1.2; // struggling

    const summary = getRepetitionSummary('cs');
    expect(summary.total).toBe(2);
    expect(summary.struggling).toBe(1);
  });
});
