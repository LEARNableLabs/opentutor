import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../scripts/bot/commands.js', () => ({
  handleCommand: vi.fn(),
  isCommand: vi.fn(),
}));

vi.mock('../../scripts/bot/callbacks.js', () => ({
  handleCallback: vi.fn(),
}));

vi.mock('../../scripts/bot/onboarding.js', () => ({
  handleOnboarding: vi.fn(),
  isOnboarding: vi.fn(),
}));

vi.mock('../../scripts/bot/chat.js', () => ({
  handleChat: vi.fn(),
}));

vi.mock('../../scripts/bot/state.js', () => ({
  appendMemory: vi.fn(),
}));

vi.mock('../../scripts/bot/logger.js', () => ({
  runWithReqId: vi.fn((fn) => fn()),
  log: {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

import { route } from '../../scripts/bot/router.js';
import { isCommand, handleCommand } from '../../scripts/bot/commands.js';
import { handleCallback } from '../../scripts/bot/callbacks.js';
import { handleChat } from '../../scripts/bot/chat.js';
import { isOnboarding, handleOnboarding } from '../../scripts/bot/onboarding.js';

describe('route', () => {
  const channel = {};
  const skills = new Map();

  beforeEach(() => {
    vi.clearAllMocks();
    isCommand.mockReturnValue(false);
    isOnboarding.mockReturnValue(false);
  });

  it('routes callback queries to handleCallback', async () => {
    const update = { callback_query: { data: 'test', from: { id: 1 } } };
    await route(update, channel, skills);
    expect(handleCallback).toHaveBeenCalledWith(update.callback_query, channel, skills);
  });

  it('routes slash commands to handleCommand', async () => {
    isCommand.mockReturnValue(true);
    const update = { message: { text: '/help', chat: { id: 123 }, from: { id: 1 } } };
    await route(update, channel, skills);
    expect(handleCommand).toHaveBeenCalledWith('/help', 123, channel, skills);
  });

  it('routes text to handleOnboarding when onboarding is active', async () => {
    isOnboarding.mockReturnValue(true);
    const update = { message: { text: 'hello', chat: { id: 5 }, from: { id: 1 } } };
    await route(update, channel, skills);
    expect(handleOnboarding).toHaveBeenCalledWith('hello', 5, channel, skills);
  });

  it('routes plain text to handleChat', async () => {
    const update = { message: { text: 'teach me math', chat: { id: 7 }, from: { id: 1 } } };
    await route(update, channel, skills);
    expect(handleChat).toHaveBeenCalledWith('teach me math', 7, channel, skills);
  });

  it('ignores messages without text', async () => {
    const update = { message: { photo: {} } };
    await route(update, channel, skills);
    expect(handleCommand).not.toHaveBeenCalled();
    expect(handleChat).not.toHaveBeenCalled();
  });

  it('prefers callback_query over message', async () => {
    const update = {
      callback_query: { data: 'btn', from: { id: 1 } },
      message: { text: '/help', chat: { id: 1 }, from: { id: 1 } },
    };
    await route(update, channel, skills);
    expect(handleCallback).toHaveBeenCalled();
    expect(handleCommand).not.toHaveBeenCalled();
  });
});
