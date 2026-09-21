import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorStore } from '../lib/core/store.js';
import { lessonTurn } from '../api/lesson.js';

// #106 — the web/serverless path delivered lessons but skipped everything that
// makes the tutor adaptive: no learning.md, no practice directives, no
// engagement. buildStudentModel therefore ran against an empty log forever.

const PLAN = {
  goal: 'Explain alpha',
  diagnostic: 'Why does alpha matter?',
  followUp: 'Give an example of alpha.',
  application: 'Apply alpha somewhere new.',
  commonMisconceptions: [],
};

let root, state, ctx;

const domainDir = () => path.join(root, 'skills', 'tutor', 'domains', 'demo');

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-pedagogy-'));
  fs.mkdirSync(domainDir(), { recursive: true });
  fs.writeFileSync(path.join(domainDir(), 'curriculum.json'), JSON.stringify({
    topic: 'Demo',
    lessons: [
      { lesson: 1, module: 'Basics', title: 'Lesson 1', concepts: ['alpha'], difficulty: 2, type: 'mini-lesson', status: 'pending' },
      { lesson: 2, module: 'Basics', title: 'Lesson 2', concepts: ['beta'], difficulty: 2, type: 'mini-lesson', status: 'pending' },
    ],
  }));
  state = new TutorStore(root);
  ctx = {
    state,
    adapter: {
      generate: vi.fn(async (system) => (system.includes('## Current Step:')
        ? { text: '<assessment>{"understanding":"full","score":0.9}</assessment>\nGood — why?' }
        : { text: JSON.stringify(PLAN) })),
    },
    skills: new Map(),
  };
});

afterEach(() => { state.close(); fs.rmSync(root, { recursive: true, force: true }); });

async function runLesson(answers = ['a1', 'a2', 'a3', 'a4']) {
  await lessonTurn(ctx, { topicSlug: 'demo' });
  let last;
  for (const a of answers) last = await lessonTurn(ctx, { topicSlug: 'demo', answer: a });
  return last;
}

describe('after a web lesson', () => {
  it('writes a learning log the next lesson can read', async () => {
    await runLesson();
    const log = await state.readDomainFile('demo', 'learning.md');
    expect(log).toBeTruthy();
    expect(log).toContain('## Accuracy Trend');
    expect(log).toMatch(/\*\*Engagement:\*\*\s*\w+/);
    expect(log).toContain('Step scores:');
  });

  it('runs the DeliberatePractitioner and writes directives', async () => {
    await runLesson();
    const feedback = await state.readDomainFile('demo', 'practice-feedback.md');
    expect(feedback).toBeTruthy();
    expect(feedback).toContain('## Directives');
  });

  it('records the grade rather than a bare "delivered"', async () => {
    await runLesson();
    const lesson1 = (await state.readCurriculum('demo')).lessons[0];
    expect(lesson1.status).toBe('completed');
    expect(lesson1.engagement).toBe('correct');   // avg step score 0.9
  });

  it('keeps runtime state out of the tracked curriculum directory', async () => {
    await runLesson();
    const shipped = fs.readdirSync(domainDir());
    expect(shipped).toEqual(['curriculum.json']);
  });
});
