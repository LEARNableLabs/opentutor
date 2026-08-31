import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorState } from '../lib/core/state.js';

let tmpDir;
let state;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-core-state-'));
  state = new TutorState(tmpDir);
});

afterAll(() => {
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('TutorState constructor', () => {
  it('creates workspace directories', () => {
    expect(fs.existsSync(state.paths.workspace)).toBe(true);
    expect(fs.existsSync(state.paths.memory)).toBe(true);
    expect(fs.existsSync(state.paths.sessions)).toBe(true);
    expect(fs.existsSync(path.dirname(state.paths.progress))).toBe(true);
  });

  it('sets paths relative to root', () => {
    expect(state.paths.domains).toContain('skills/tutor/domains');
    expect(state.paths.progress).toContain('workspace/tutor/progress.json');
  });
});

describe('Progress', () => {
  it('readProgress returns default when no file exists', () => {
    const p = state.readProgress();
    expect(p.active_topics).toEqual([]);
    expect(p.schedule).toEqual({});
  });

  it('writeProgress / readProgress round-trip', () => {
    const data = { active_topics: ['math'], schedule: { paused: false }, history: [], onboarding: null };
    state.writeProgress(data);
    const read = state.readProgress();
    expect(read.active_topics).toEqual(['math']);
  });

  it('updateProgress applies mutation', () => {
    state.writeProgress({ active_topics: [], schedule: {}, history: [], onboarding: null });
    const result = state.updateProgress((p) => { p.active_topics.push('physics'); });
    expect(result.active_topics).toEqual(['physics']);
    expect(state.readProgress().active_topics).toEqual(['physics']);
  });
});

describe('Curriculum', () => {
  const curriculum = {
    topic: 'Test Topic',
    slug: 'test-topic',
    lessons: [
      { lesson: 1, title: 'Lesson 1', status: 'pending', day: 1 },
      { lesson: 2, title: 'Lesson 2', status: 'pending', day: 2 },
      { lesson: 3, title: 'Lesson 3', status: 'pending', day: 3 },
    ],
  };

  it('readCurriculum returns null when no file exists', () => {
    expect(state.readCurriculum('nonexistent')).toBeNull();
  });

  it('writeCurriculum / readCurriculum round-trip', () => {
    state.writeCurriculum('test-topic', curriculum);
    const read = state.readCurriculum('test-topic');
    expect(read.topic).toBe('Test Topic');
    expect(read.lessons).toHaveLength(3);
  });

  it('getNextLesson returns first pending lesson', () => {
    state.writeCurriculum('test-topic', curriculum);
    const next = state.getNextLesson('test-topic');
    expect(next.lesson).toBe(1);
    expect(next.title).toBe('Lesson 1');
  });

  it('getNextLesson returns null when no pending lessons', () => {
    const completed = {
      ...curriculum,
      lessons: curriculum.lessons.map((l) => ({ ...l, status: 'completed' })),
    };
    state.writeCurriculum('done-topic', completed);
    expect(state.getNextLesson('done-topic')).toBeNull();
  });

  it('markLessonComplete sets status and delivered date', () => {
    state.writeCurriculum('test-topic', curriculum);
    state.markLessonComplete('test-topic', 1, { score: 100 });
    const read = state.readCurriculum('test-topic');
    const lesson1 = read.lessons.find((l) => (l.day || l.lesson) === 1);
    expect(lesson1.status).toBe('completed');
    expect(lesson1.delivered).toBeTruthy();
  });
});

describe('Domain files', () => {
  it('readDomainFile returns null for missing file', () => {
    expect(state.readDomainFile('nope', 'missing.md')).toBeNull();
  });

  it('writeDomainFile / readDomainFile round-trip', () => {
    state.writeDomainFile('test-topic', 'teacher.md', '# Teacher Config\nExercise style: proofs');
    const content = state.readDomainFile('test-topic', 'teacher.md');
    expect(content).toContain('Exercise style: proofs');
  });
});

describe('Topics', () => {
  it('listTopics finds domains with curriculum.json', () => {
    state.writeCurriculum('alpha', { topic: 'Alpha', slug: 'alpha', lessons: [{ lesson: 1, status: 'pending' }] });
    state.writeCurriculum('beta', { topic: 'Beta', slug: 'beta', lessons: [{ lesson: 1, status: 'pending' }] });
    state.writeDomainFile('gamma', 'notes.md', 'no curriculum here');

    const topics = state.listTopics();
    expect(topics).toContain('alpha');
    expect(topics).toContain('beta');
    expect(topics).not.toContain('gamma');
  });

  it('getTopicProgress calculates correct percentages', () => {
    state.writeCurriculum('test-topic', {
      topic: 'Test',
      slug: 'test-topic',
      lessons: [
        { lesson: 1, status: 'completed' },
        { lesson: 2, status: 'completed' },
        { lesson: 3, status: 'pending' },
        { lesson: 4, status: 'pending' },
      ],
    });
    const p = state.getTopicProgress('test-topic');
    expect(p.total).toBe(4);
    expect(p.completed).toBe(2);
    expect(p.percent).toBe(50);
    expect(p.current.lesson).toBe(3);
  });

  it('getTopicProgress returns null for missing topic', () => {
    expect(state.getTopicProgress('nonexistent')).toBeNull();
  });
});

describe('User profile', () => {
  it('readUser returns empty string when no file', () => {
    expect(state.readUser()).toBe('');
  });

  it('writeUser / readUser round-trip', () => {
    state.writeUser('# Student\nName: Alice');
    expect(state.readUser()).toContain('Name: Alice');
  });
});

describe('Memory', () => {
  it('appendMemory creates dated file', () => {
    state.appendMemory('Learned about X');
    const date = new Date().toISOString().split('T')[0];
    const file = path.join(state.paths.memory, `${date}.md`);
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.readFileSync(file, 'utf-8')).toContain('Learned about X');
  });

  it('readRecentMemory returns entries', () => {
    state.appendMemory('Entry 1');
    const mem = state.readRecentMemory(1);
    expect(mem).toContain('Entry 1');
  });
});
