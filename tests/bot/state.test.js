import { vi, describe, it, expect, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('../../scripts/bot/config.js', () => ({
  PATHS: {
    progress: '/tmp/ot-vitest-state/tutor/progress.json',
    domains: '/tmp/ot-vitest-state/domains',
    user: '/tmp/ot-vitest-state/USER.md',
    memory: '/tmp/ot-vitest-state/memory',
    workspace: '/tmp/ot-vitest-state',
  },
}));

vi.mock('../../scripts/bot/logger.js', () => ({
  log: {
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

import {
  readProgress, writeProgress, updateProgress,
  readUser, writeUser,
  listTopics,
} from '../../scripts/bot/state.js';

const TEST_DIR = '/tmp/ot-vitest-state';

beforeEach(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
  fs.mkdirSync(path.join(TEST_DIR, 'tutor'), { recursive: true });
  fs.mkdirSync(path.join(TEST_DIR, 'domains'), { recursive: true });
  fs.mkdirSync(path.join(TEST_DIR, 'memory'), { recursive: true });
});

afterAll(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('readProgress', () => {
  it('returns default progress when no file exists', () => {
    const progress = readProgress();
    expect(progress).toBeDefined();
    expect(progress.active_topics).toEqual([]);
    expect(progress.history).toEqual([]);
    expect(progress.schedule).toBeDefined();
  });

  it('reads saved progress from file', () => {
    const data = { active_topics: ['math'], history: [], schedule: { paused: false } };
    fs.writeFileSync(
      path.join(TEST_DIR, 'tutor', 'progress.json'),
      JSON.stringify(data),
    );
    const progress = readProgress();
    expect(progress.active_topics).toEqual(['math']);
  });
});

describe('writeProgress / readProgress roundtrip', () => {
  it('writes and reads back progress data', () => {
    const data = {
      active_topics: ['physics', 'math'],
      history: [{ day: 1 }],
      schedule: { times: ['10:00'], timezone: 'UTC', paused: false },
      onboarding: null,
    };
    writeProgress(data);
    const result = readProgress();
    expect(result.active_topics).toEqual(['physics', 'math']);
    expect(result.history).toEqual([{ day: 1 }]);
  });
});

describe('updateProgress', () => {
  it('applies a mutation function and persists', () => {
    const result = updateProgress((p) => {
      p.active_topics.push('chemistry');
    });
    expect(result.active_topics).toContain('chemistry');
    const reread = readProgress();
    expect(reread.active_topics).toContain('chemistry');
  });
});

describe('readUser / writeUser', () => {
  it('returns empty string when no user file exists', () => {
    expect(readUser()).toBe('');
  });

  it('writes and reads user content', () => {
    writeUser('# Student\nName: Alice');
    expect(readUser()).toBe('# Student\nName: Alice');
  });
});

describe('listTopics', () => {
  it('returns empty array when no domains exist', () => {
    expect(listTopics()).toEqual([]);
  });

  it('lists topics that have curriculum.json', () => {
    const mathDir = path.join(TEST_DIR, 'domains', 'math');
    const artDir = path.join(TEST_DIR, 'domains', 'art');
    const emptyDir = path.join(TEST_DIR, 'domains', 'empty');
    fs.mkdirSync(mathDir, { recursive: true });
    fs.mkdirSync(artDir, { recursive: true });
    fs.mkdirSync(emptyDir, { recursive: true });
    fs.writeFileSync(path.join(mathDir, 'curriculum.json'), '{}');
    fs.writeFileSync(path.join(artDir, 'curriculum.json'), '{}');
    const topics = listTopics();
    expect(topics).toContain('math');
    expect(topics).toContain('art');
    expect(topics).not.toContain('empty');
  });
});
