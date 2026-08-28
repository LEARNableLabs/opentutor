import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../scripts/bot/claude.js', () => ({ generate: vi.fn() }));
vi.mock('../../scripts/bot/context.js', () => ({
  buildChatPrompt: vi.fn(() => ({ system: 'chat', model: 'cheap', outputMode: 'student' })),
}));
vi.mock('../../scripts/bot/session.js', () => ({
  appendMessage: vi.fn(),
  getRecentHistory: vi.fn(),
}));
vi.mock('../../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), error: vi.fn() },
}));

import { handleChat } from '../../scripts/bot/chat.js';
import { generate } from '../../scripts/bot/claude.js';
import { getRecentHistory } from '../../scripts/bot/session.js';

describe('handleChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes role-preserving history without duplicating the newest user turn', async () => {
    const history = [
      { role: 'assistant', content: 'What would you like to learn?' },
      { role: 'user', content: 'Topology' },
    ];
    getRecentHistory.mockReturnValue(history);
    generate.mockResolvedValue({ text: '🧠 Let’s begin.' });
    const channel = { sendTyping: vi.fn().mockResolvedValue(), sendMessage: vi.fn().mockResolvedValue() };

    await handleChat('Topology', 42, channel, new Map());

    expect(generate).toHaveBeenCalledWith('chat', history, {
      model: 'cheap', outputMode: 'student',
    });
    expect(history.filter((turn) => turn.content === 'Topology')).toHaveLength(1);
  });
});
