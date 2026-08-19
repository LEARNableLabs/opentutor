import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';

let config;

beforeAll(async () => {
  process.env.TELEGRAM_BOT_TOKEN = 'test-token-for-config';
  config = await import('../../scripts/bot/config.js');
});

describe('config', () => {
  it('exports ROOT as an absolute path', () => {
    expect(config.ROOT).toBeDefined();
    expect(typeof config.ROOT).toBe('string');
    expect(path.isAbsolute(config.ROOT)).toBe(true);
  });

  it('exports PATHS with required keys', () => {
    const keys = ['root', 'skills', 'skill', 'references', 'domains',
      'templates', 'workspace', 'sessions', 'memory', 'progress',
      'user', 'identity', 'soul'];
    for (const key of keys) {
      expect(config.PATHS).toHaveProperty(key);
      expect(typeof config.PATHS[key]).toBe('string');
    }
  });

  it('exports TELEGRAM config with token from env', () => {
    expect(config.TELEGRAM).toBeDefined();
    expect(config.TELEGRAM.token).toBe('test-token-for-config');
    expect(config.TELEGRAM.mode).toBe('polling');
  });

  it('exports CLAUDE config with model defaults', () => {
    expect(config.CLAUDE).toBeDefined();
    expect(typeof config.CLAUDE.cheapModel).toBe('string');
    expect(typeof config.CLAUDE.strongModel).toBe('string');
  });

  it('exports SCHEDULE config with default times and timezone', () => {
    expect(config.SCHEDULE).toBeDefined();
    expect(Array.isArray(config.SCHEDULE.times)).toBe(true);
    expect(config.SCHEDULE.times.length).toBeGreaterThan(0);
    expect(typeof config.SCHEDULE.timezone).toBe('string');
  });
});
