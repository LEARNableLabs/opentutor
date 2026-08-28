import { vi, describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('../../scripts/bot/config.js', () => ({
  PATHS: {
    workspace: '/tmp/opentutor-test-workspace',
    domains: '/tmp/opentutor-test-domains',
  },
}));

vi.mock('../../scripts/bot/claude.js', () => ({
  generate: vi.fn(),
}));

vi.mock('../../scripts/bot/context.js', () => ({
  buildLessonPrompt: vi.fn(() => ({ system: 'test', model: 'cheap' })),
}));

vi.mock('../../scripts/bot/state.js', () => ({
  getNextLesson: vi.fn(),
  markLessonComplete: vi.fn(),
  readCurriculum: vi.fn(),
  appendMemory: vi.fn(),
}));

vi.mock('../../scripts/bot/session.js', () => ({
  appendMessage: vi.fn(),
}));

vi.mock('../../scripts/bot/spaced-repetition.js', () => ({
  registerLessonConcepts: vi.fn(),
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
    expect(getCorrectAnswer('test-topic', 1)).toBeUndefined();
  });

  it('returns null when no lesson context stored', () => {
    expect(getLessonContext('test-topic', 1)).toBeUndefined();
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
