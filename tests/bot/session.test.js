import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = path.join(os.tmpdir(), 'opentutor-test-sessions');

vi.mock('../../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../scripts/bot/config.js', async () => {
  const p = await import('path');
  const o = await import('os');
  return {
    PATHS: { sessions: p.default.join(o.default.tmpdir(), 'opentutor-test-sessions') },
  };
});

import { appendMessage, getRecentHistory, clearSession, getSessionPath } from '../../scripts/bot/session.js';

describe('session', () => {
  beforeEach(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns empty history for nonexistent session', () => {
    const history = getRecentHistory('nonexistent');
    expect(history).toEqual([]);
  });

  it('appends and retrieves messages', () => {
    appendMessage('test-chan', 'user', 'hello');
    appendMessage('test-chan', 'assistant', 'hi there');

    const history = getRecentHistory('test-chan');
    expect(history).toHaveLength(2);
    expect(history[0]).toEqual({ role: 'user', content: 'hello' });
    expect(history[1]).toEqual({ role: 'assistant', content: 'hi there' });
  });

  it('respects the limit parameter', () => {
    for (let i = 0; i < 5; i++) {
      appendMessage('limit-test', 'user', `msg ${i}`);
    }
    const history = getRecentHistory('limit-test', 3);
    expect(history).toHaveLength(3);
    expect(history[0].content).toBe('msg 2');
  });

  it('clears a session', () => {
    appendMessage('clear-test', 'user', 'hello');
    clearSession('clear-test');
    const history = getRecentHistory('clear-test');
    expect(history).toEqual([]);
  });

  it('generates correct session path', () => {
    const p = getSessionPath('12345');
    expect(p).toBe(path.join(tmpDir, '12345.jsonl'));
  });
});
