import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../scripts/bot/state.js', () => ({
  readProgress: vi.fn(),
  updateProgress: vi.fn(),
  getTopicProgress: vi.fn(),
  listTopics: vi.fn(),
  readDomainFile: vi.fn(() => null),
}));

vi.mock('../../scripts/bot/lesson.js', () => ({
  deliverNextLesson: vi.fn(),
}));

vi.mock('../../scripts/bot/quiz.js', () => ({
  generateQuiz: vi.fn(),
}));

vi.mock('../../scripts/bot/scheduler.js', () => ({
  startScheduler: vi.fn(),
  stopScheduler: vi.fn(),
}));

vi.mock('../../scripts/bot/curriculum.js', () => ({
  generateAndRegisterTopic: vi.fn(),
}));

vi.mock('../../scripts/bot/spaced-repetition.js', () => ({
  getDueReviews: vi.fn(),
  getRepetitionSummary: vi.fn(),
}));

vi.mock('../../scripts/bot/onboarding.js', () => ({
  startOnboarding: vi.fn(),
}));

vi.mock('../../scripts/bot/logger.js', () => ({
  log: {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

import { isCommand, handleCommand } from '../../scripts/bot/commands.js';
import { readProgress } from '../../scripts/bot/state.js';
import { deliverNextLesson } from '../../scripts/bot/lesson.js';

describe('isCommand', () => {
  it('returns true for slash commands', () => {
    expect(isCommand('/help')).toBe(true);
    expect(isCommand('/next')).toBe(true);
    expect(isCommand('/add linear algebra')).toBe(true);
  });

  it('returns false for regular text', () => {
    expect(isCommand('hello')).toBe(false);
    expect(isCommand('what is calculus')).toBe(false);
  });
});

describe('handleCommand', () => {
  let channel;

  beforeEach(() => {
    vi.clearAllMocks();
    channel = { sendMessage: vi.fn(), sendTyping: vi.fn() };
  });

  it('sends help text for /help', async () => {
    await handleCommand('/help', 123, channel, new Map());
    expect(channel.sendMessage).toHaveBeenCalledWith(
      123,
      expect.stringContaining('Commands'),
    );
  });

  it('help text lists available commands', async () => {
    await handleCommand('/help', 123, channel, new Map());
    const text = channel.sendMessage.mock.calls[0][1];
    expect(text).toContain('/next');
    expect(text).toContain('/quiz');
    expect(text).toContain('/progress');
    expect(text).toContain('/add');
  });

  it('responds to unknown commands with guidance', async () => {
    await handleCommand('/nonexistent', 123, channel, new Map());
    expect(channel.sendMessage).toHaveBeenCalledWith(
      123,
      expect.stringContaining("don't know"),
    );
  });

  it('handles /next with no active topics', async () => {
    readProgress.mockReturnValue({ active_topics: [] });
    await handleCommand('/next', 123, channel, new Map());
    expect(channel.sendMessage).toHaveBeenCalledWith(
      123,
      expect.stringContaining("don't have any active topics"),
    );
  });

  it('handles /next with active topics', async () => {
    readProgress.mockReturnValue({ active_topics: ['math'] });
    await handleCommand('/next', 123, channel, new Map());
    expect(deliverNextLesson).toHaveBeenCalledWith('math', 123, channel, expect.anything());
  });
});
