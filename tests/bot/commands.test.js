import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../scripts/bot/state.js', () => ({
  readProgress: vi.fn(),
  updateProgress: vi.fn(),
  getTopicProgress: vi.fn(),
  listTopics: vi.fn(),
  readDomainFile: vi.fn(() => null),
  readCurriculum: vi.fn(() => ({ topic: 'Math', lessons: [] })),
}));

vi.mock('../../scripts/bot/lesson.js', () => ({
  deliverNextLesson: vi.fn(),
  computeStreak: vi.fn(() => 3),
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
import { readProgress, updateProgress, getTopicProgress, listTopics } from '../../scripts/bot/state.js';
import { deliverNextLesson } from '../../scripts/bot/lesson.js';
import { startScheduler } from '../../scripts/bot/scheduler.js';
import { getRepetitionSummary } from '../../scripts/bot/spaced-repetition.js';

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

  // #163
  it('/progress shows the streak and each active topic', async () => {
    readProgress.mockReturnValue({ active_topics: ['math'], history: [] });
    getTopicProgress.mockReturnValue({ topic: 'Math', percent: 50, completed: 1, total: 2, current: { title: 'Sets' } });
    getRepetitionSummary.mockReturnValue({ total: 0, due: 0, mastered: 0 });
    await handleCommand('/progress', 123, channel, new Map());
    const text = channel.sendMessage.mock.calls.at(-1)[1];
    expect(text).toContain('Streak: 3 days');
    expect(text).toContain('Math');
  });

  it('/resume restarts the scheduler with the skills it was given', async () => {
    const skills = new Map([['teaching-method', 'x']]);
    updateProgress.mockImplementation((fn) => { const p = { schedule: { paused: true } }; fn(p); return p; });
    await handleCommand('/resume', 123, channel, skills);
    expect(startScheduler).toHaveBeenCalledWith({ paused: false }, channel, skills);
    expect(channel.sendMessage).toHaveBeenCalledWith(123, expect.stringContaining('Lessons resumed'));
  });

  it('/topics lists the active topics only, as /help says', async () => {
    readProgress.mockReturnValue({ active_topics: ['math'] });
    listTopics.mockReturnValue(Array.from({ length: 293 }, (_, i) => `shipped-${i}`));
    getTopicProgress.mockImplementation((slug) => ({ topic: slug === 'math' ? 'Math' : slug, percent: 0, completed: 0, total: 3 }));
    await handleCommand('/topics', 123, channel, new Map());
    const text = channel.sendMessage.mock.calls.at(-1)[1];
    expect(text).toContain('Math');
    expect(text).not.toContain('shipped-');
    expect(text.length).toBeLessThan(4096);
  });

  it('/topics splits a long list under Telegram\'s 4,096-character limit', async () => {
    const slugs = Array.from({ length: 100 }, (_, i) => `a-rather-long-topic-name-${i}`);
    readProgress.mockReturnValue({ active_topics: slugs });
    getTopicProgress.mockImplementation((slug) => ({ topic: slug, percent: 0, completed: 0, total: 30 }));
    await handleCommand('/topics', 123, channel, new Map());
    const sent = channel.sendMessage.mock.calls.map((call) => call[1]);
    expect(sent.length).toBeGreaterThan(1);
    for (const text of sent) expect(text.length).toBeLessThan(4096);
    expect(sent.join('\n')).toContain('a-rather-long-topic-name-99');
  });
});
