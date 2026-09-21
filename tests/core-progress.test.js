import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorState } from '../lib/core/state.js';
import { TutorStore } from '../lib/core/store.js';

// skills/tutor/domains/ is git-tracked content. Completing a lesson is per-student
// runtime state and must never be written back into it.

let root, curriculumFile;

const CONTENT = {
  topic: 'Test Topic',
  slug: 'demo',
  lessons: [
    { lesson: 1, module: 'Basics', title: 'Lesson 1', concepts: ['alpha'], status: 'pending' },
    { lesson: 2, module: 'Basics', title: 'Lesson 2', concepts: ['beta'], status: 'pending' },
  ],
};

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-progress-'));
  const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
  fs.mkdirSync(dir, { recursive: true });
  curriculumFile = path.join(dir, 'curriculum.json');
  fs.writeFileSync(curriculumFile, JSON.stringify(CONTENT, null, 2) + '\n');
});

afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

const onDisk = () => JSON.parse(fs.readFileSync(curriculumFile, 'utf-8'));

// Each store owns its own completion storage, so run the same contract against both.
const stores = [
  ['TutorState', () => new TutorState(root)],
  ['TutorStore', () => new TutorStore(root)],
];

describe.each(stores)('%s — completing a lesson', (_name, make) => {
  let store;
  beforeEach(() => { store = make(); });
  afterEach(() => store.close?.());

  it('leaves the curriculum content file untouched', async () => {
    const before = fs.readFileSync(curriculumFile, 'utf-8');
    await store.markLessonComplete('demo', 1, 'correct');
    expect(fs.readFileSync(curriculumFile, 'utf-8')).toBe(before);
    expect(onDisk().lessons[0]).not.toHaveProperty('delivered');
    expect(onDisk().lessons[0].status).toBe('pending');
  });

  it('is still visible on the next read', async () => {
    await store.markLessonComplete('demo', 1, 'correct');
    const lessons = (await store.readCurriculum('demo')).lessons;
    expect(lessons[0]).toMatchObject({ status: 'completed', engagement: 'correct' });
    expect(lessons[0].delivered).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(lessons[1].status).toBe('pending');
  });

  it('advances getNextLesson and getTopicProgress', async () => {
    expect((await store.getNextLesson('demo')).lesson).toBe(1);
    await store.markLessonComplete('demo', 1, 'correct');
    expect((await store.getNextLesson('demo')).lesson).toBe(2);
    expect(await store.getTopicProgress('demo')).toMatchObject({ completed: 1, total: 2, percent: 50 });
  });

  it('survives a fresh store instance', async () => {
    await store.markLessonComplete('demo', 1, 'correct');
    store.close?.();
    store = make();
    expect((await store.getNextLesson('demo')).lesson).toBe(2);
  });

  it('does not leak between topics', async () => {
    await store.markLessonComplete('demo', 1, 'correct');
    expect(await store.readCurriculum('other')).toBeNull();
  });
});

describe('writeCurriculum', () => {
  it('stores content without runtime completion fields', async () => {
    const store = new TutorState(root);
    await store.markLessonComplete('demo', 1, 'correct');

    // A pipeline rebuild writes the curriculum it just read back — runtime state must not stick
    await store.writeCurriculum('demo', await store.readCurriculum('demo'));

    expect(onDisk().lessons[0].status).toBe('pending');
    expect(onDisk().lessons[0]).not.toHaveProperty('delivered');
    expect(onDisk().lessons[0]).not.toHaveProperty('engagement');
    // ...but the completion itself is not lost
    expect((await store.readCurriculum('demo')).lessons[0].status).toBe('completed');
  });
});
