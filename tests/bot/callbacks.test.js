import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../scripts/bot/state.js', () => ({
  appendMemory: vi.fn(),
}));

vi.mock('../../scripts/bot/lesson.js', () => ({
  getCorrectAnswer: vi.fn(),
  getLessonContext: vi.fn(),
}));

vi.mock('../../scripts/bot/claude.js', () => ({
  generate: vi.fn(() => Promise.resolve({ text: 'hint text' })),
}));

vi.mock('../../scripts/bot/onboarding.js', () => ({
  handleOnboardingCallback: vi.fn(),
  isOnboarding: vi.fn(),
}));

vi.mock('../../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { handleCallback } from '../../scripts/bot/callbacks.js';
import { getCorrectAnswer } from '../../scripts/bot/lesson.js';
import { handleOnboardingCallback, isOnboarding } from '../../scripts/bot/onboarding.js';

describe('handleCallback', () => {
  const channel = {
    answerCallback: vi.fn(),
    sendMessage: vi.fn(),
    editMessageButtons: vi.fn(),
    sendTyping: vi.fn(),
  };
  const skills = new Map();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('acknowledges callback immediately', async () => {
    const query = { id: 'cb1', data: 'ex:math:1:A', message: { chat: { id: 1 }, message_id: 10 } };
    getCorrectAnswer.mockReturnValue('A');
    await handleCallback(query, channel, skills);
    expect(channel.answerCallback).toHaveBeenCalledWith('cb1');
  });

  it('sends correct feedback for right answer', async () => {
    const query = { id: 'cb2', data: 'ex:math:1:B', message: { chat: { id: 1 }, message_id: 10 } };
    getCorrectAnswer.mockReturnValue('B');
    await handleCallback(query, channel, skills);
    expect(channel.sendMessage).toHaveBeenCalledWith(1, expect.stringContaining('Correct'));
  });

  it('sends incorrect feedback for wrong answer', async () => {
    const query = { id: 'cb3', data: 'ex:math:1:C', message: { chat: { id: 1 }, message_id: 10 } };
    getCorrectAnswer.mockReturnValue('A');
    await handleCallback(query, channel, skills);
    expect(channel.sendMessage).toHaveBeenCalledWith(1, expect.stringContaining('Not quite'));
  });

  it('sends honest feedback when no answer is stored', async () => {
    const query = { id: 'cb4', data: 'ex:math:1:A', message: { chat: { id: 1 }, message_id: 10 } };
    getCorrectAnswer.mockReturnValue(undefined);
    await handleCallback(query, channel, skills);
    expect(channel.sendMessage).toHaveBeenCalledWith(
      1,
      expect.stringContaining('couldn\'t score'),
    );
  });

  it('handles skip callback', async () => {
    const query = { id: 'cb5', data: 'ex:math:1:skip', message: { chat: { id: 1 }, message_id: 10 } };
    await handleCallback(query, channel, skills);
    expect(channel.sendMessage).toHaveBeenCalledWith(1, expect.stringContaining('skipped'));
  });

  it('handles hint callback', async () => {
    const query = { id: 'cb6', data: 'ex:math:1:hint', message: { chat: { id: 1 }, message_id: 10 } };
    await handleCallback(query, channel, skills);
    expect(channel.sendMessage).toHaveBeenCalledWith(
      1,
      expect.stringContaining('Hint'),
      expect.anything(),
    );
  });

  it('does nothing for empty callback data', async () => {
    const query = { id: 'cb7', data: null, message: { chat: { id: 1 } } };
    await handleCallback(query, channel, skills);
    expect(channel.answerCallback).toHaveBeenCalledWith('cb7');
    expect(channel.sendMessage).not.toHaveBeenCalled();
  });

  it('turns a tapped number into an onboarding response', async () => {
    isOnboarding.mockReturnValue(true);
    const query = { id: 'cb8', data: 'ot_2', message: { chat: { id: 1 }, message_id: 10 } };

    await handleCallback(query, channel, skills);

    expect(channel.editMessageButtons).toHaveBeenCalledWith(1, 10, []);
    expect(handleOnboardingCallback).toHaveBeenCalledWith('ot_2', 1, channel, skills);
  });

  it('rejects number buttons from an expired onboarding question', async () => {
    isOnboarding.mockReturnValue(false);
    const query = { id: 'cb9', data: 'ot_2', message: { chat: { id: 1 }, message_id: 10 } };

    await handleCallback(query, channel, skills);

    expect(handleOnboardingCallback).not.toHaveBeenCalled();
    expect(channel.sendMessage).toHaveBeenCalledWith(1, expect.stringContaining('older question'));
  });
});
