import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../scripts/bot/claude.js', () => ({ generate: vi.fn() }));
vi.mock('../../scripts/bot/context.js', () => ({ buildOnboardingPrompt: vi.fn() }));
vi.mock('../../scripts/bot/state.js', () => ({
  readProgress: vi.fn(),
  updateProgress: vi.fn(),
}));
vi.mock('../../scripts/bot/session.js', () => ({
  appendMessage: vi.fn(),
  clearSession: vi.fn(),
  getRecentHistory: vi.fn(),
}));
vi.mock('../../scripts/bot/curriculum.js', () => ({ generateAndRegisterTopic: vi.fn() }));
vi.mock('../../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), error: vi.fn() },
}));

import { extractConfirmedTopic, startOnboarding } from '../../scripts/bot/onboarding.js';
import { updateProgress } from '../../scripts/bot/state.js';
import { appendMessage, clearSession } from '../../scripts/bot/session.js';

describe('startOnboarding', () => {
  let channel;

  beforeEach(() => {
    vi.clearAllMocks();
    channel = { sendMessage: vi.fn() };
  });

  it('sends a concise, name-first welcome message', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    await startOnboarding(123, channel, new Map());

    const message = channel.sendMessage.mock.calls[0][1];
    expect(channel.sendMessage).toHaveBeenCalledWith(123, message);
    expect(message.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(35);
    expect(message).toMatch(/\?/);
    expect(message).toContain('weirdly good at explaining things');
    expect(message).toContain('What’s your name?');
    expect(message).toContain('noble art of internet rabbit holes');
    expect(message).toContain('🐇');
    expect(updateProgress).toHaveBeenCalledOnce();
    expect(clearSession).toHaveBeenCalledWith(123);
    expect(appendMessage).toHaveBeenCalledWith(123, 'assistant', message);
  });

  it('starts onboarding at the name step', async () => {
    let progress;
    updateProgress.mockImplementation((update) => {
      progress = {};
      update(progress);
    });

    await startOnboarding(123, channel, new Map());

    expect(progress.onboarding.step).toBe('name');
  });

  it('varies the playful context question', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    await startOnboarding(123, channel, new Map());
    const firstWelcome = channel.sendMessage.mock.calls[0][1];

    vi.clearAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    await startOnboarding(123, channel, new Map());
    const lastWelcome = channel.sendMessage.mock.calls[0][1];

    expect(lastWelcome).not.toBe(firstWelcome);
    expect(lastWelcome).toContain('1 a.m. question');
  });
});

describe('extractConfirmedTopic', () => {
  it('accepts only the explicit HTML topic marker', () => {
    expect(extractConfirmedTopic('<b>Topic:</b> Why Nations Fail')).toBe('Why Nations Fail');
  });

  it('does not infer a topic from ordinary tutor prose', () => {
    expect(extractConfirmedTopic('A couple quick things so I can pitch this right:')).toBeNull();
    expect(extractConfirmedTopic('I am building a curriculum for you.')).toBeNull();
  });
});
