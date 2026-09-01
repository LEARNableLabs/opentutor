import { vi, describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('../../scripts/bot/config.js', () => ({
  PATHS: {
    root: '/tmp/opentutor-test',
    workspace: '/tmp/opentutor-test-workspace',
    domains: '/tmp/opentutor-test-domains',
  },
}));

vi.mock('../../scripts/bot/claude.js', () => ({
  generate: vi.fn(),
}));

vi.mock('../../scripts/bot/context.js', () => ({
  buildLessonPrompt: vi.fn(() => ({ system: 'test', model: 'cheap' })),
  buildTeacherPrompt: vi.fn(() => ({ system: 'test', model: 'cheap' })),
}));

vi.mock('../../scripts/bot/state.js', () => ({
  getNextLesson: vi.fn(),
  markLessonComplete: vi.fn(),
  readCurriculum: vi.fn(),
  readDomainFile: vi.fn(() => null),
  writeDomainFile: vi.fn(),
  readUser: vi.fn(() => ''),
  readProgress: vi.fn(() => ({ active_topics: [], history: [] })),
  appendMemory: vi.fn(),
}));

vi.mock('../../scripts/bot/session.js', () => ({
  appendMessage: vi.fn(),
}));

vi.mock('../../scripts/bot/spaced-repetition.js', () => ({
  registerLessonConcepts: vi.fn(),
  getDueReviews: vi.fn(() => []),
  recordReview: vi.fn(),
}));

vi.mock('../../lib/core/state.js', () => {
  class MockTutorState {
    constructor() {}
    readDomainFile() { return null; }
    readUser() { return ''; }
  }
  return { TutorState: MockTutorState };
});

vi.mock('../../lib/core/db.js', () => ({
  openDatabaseFromEnv: vi.fn(() => null),
}));

vi.mock('../../lib/core/prompts.js', () => ({
  buildLessonPlanPrompt: vi.fn(() => ({ system: 'test', model: 'strong', outputMode: 'json' })),
  buildSocraticResponsePrompt: vi.fn(() => ({ system: 'test', model: 'cheap', outputMode: 'student' })),
}));

vi.mock('../../lib/core/student-model.js', () => ({
  buildStudentModel: vi.fn(() => ({ recentAccuracy: 0.5, overallAccuracy: 0.5, trend: 'steady', difficulty: { level: 3, label: 'standard', adjustment: 'none' }, engagement: 'steady', concepts: { solid: [], shaky: [] }, exerciseCount: 0, recommendations: [] })),
  formatStudentModel: vi.fn(() => ''),
}));

vi.mock('../../lib/core/deliberate-practice.js', () => ({
  evaluatePractice: vi.fn(() => ({ directives: [], observations: [], model: {}, timestamp: '' })),
  formatPracticeFeedback: vi.fn(() => ''),
  parseDirectives: vi.fn(() => []),
  applyDirectives: vi.fn(() => ({ blocked: false, blockedConcept: null, difficultyOverride: null, formatOverride: null, revisitConcepts: [], requireGoal: false })),
}));

vi.mock('../../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('fs');

// Must mock fs before importing the module
fs.readFileSync.mockImplementation(() => { throw new Error('ENOENT'); });
fs.mkdirSync.mockImplementation(() => {});
fs.writeFileSync.mockImplementation(() => {});
fs.renameSync.mockImplementation(() => {});
fs.existsSync.mockReturnValue(false);

const { getCorrectAnswer, getLessonContext, deliverNextLesson, stripAnswerKey } = await import(
  '../../scripts/bot/lesson.js'
);

describe('answer parsing', () => {
  it('returns null when no answer stored', () => {
    expect(getCorrectAnswer('test-topic', 1)).toBeNull();
  });

  it('returns context object when no lesson context stored', () => {
    const ctx = getLessonContext('test-topic', 1);
    expect(ctx).toHaveProperty('topicSlug', 'test-topic');
  });

  it('removes the private answer key from student-facing exercise text', () => {
    expect(stripAnswerKey('✏️ Pick one\nA. One\nB. Two\ncorrect: B'))
      .toBe('✏️ Pick one\nA. One\nB. Two');
  });
});

describe('deliverNextLesson', () => {
  const channel = {
    sendMessage: vi.fn(),
    sendTyping: vi.fn(),
  };
  const skills = new Map();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends completion message when all lessons are done', async () => {
    const { getNextLesson, readCurriculum } = await import('../../scripts/bot/state.js');
    getNextLesson.mockReturnValue(null);
    readCurriculum.mockReturnValue({ topic: 'Math', lessons: [1, 2, 3] });

    await deliverNextLesson('math', 123, channel, skills);

    expect(channel.sendMessage).toHaveBeenCalledWith(
      123,
      expect.stringContaining('completed all 3 lessons'),
    );
  });
});
