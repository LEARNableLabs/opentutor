import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorStore } from '../lib/core/store.js';
import { lessonTurn } from '../api/lesson.js';

// The web lesson protocol that public/app.js speaks: start with { topicSlug },
// continue with { topicSlug, answer }, read { reply, step, totalSteps, done, lesson }.
// Real SQLite store on a temp root; only the LLM is a stub.

const PLAN = {
  goal: 'Explain alpha',
  retrieval: 'What do you remember about alpha?',
  diagnostic: 'Why does alpha matter?',
  followUp: 'Give an example of alpha.',
  application: 'Apply alpha somewhere new.',
  commonMisconceptions: [],
};

let root, state, ctx;

beforeEach(() => {
  vi.stubEnv('OPENTUTOR_DATA_DIR', '');
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'opentutor-web-'));
  const topicDir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
  fs.mkdirSync(topicDir, { recursive: true });
  fs.writeFileSync(path.join(topicDir, 'curriculum.json'), JSON.stringify({
    topic: 'Demo',
    lessons: [
      { lesson: 1, module: 'Basics', title: 'Lesson 1', concepts: ['alpha'], status: 'pending' },
      { lesson: 2, module: 'Basics', title: 'Lesson 2', concepts: ['beta'], status: 'pending' },
    ],
  }));
  state = new TutorStore(root);
  const adapter = {
    generate: vi.fn(async (system) => (system.includes('## Current Step:')
      ? { text: '<assessment>{"understanding":"full","score":0.9}</assessment>\nNice — and what follows from that?' }
      : { text: JSON.stringify(PLAN) })),
  };
  ctx = { state, adapter, skills: new Map() };
});

afterEach(() => {
  state.close();
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
});

describe('web lesson turn', () => {
  it('opens the lesson with a question and the metadata the UI renders', async () => {
    expect(await lessonTurn(ctx, { topicSlug: 'demo' })).toEqual({
      status: 200,
      body: {
        reply: '**Goal:** Explain alpha\n\nWhat do you remember about alpha?',
        step: 0,
        totalSteps: 4,
        done: false,
        lesson: { day: 1, title: 'Lesson 1', module: 'Basics', concepts: ['alpha'] },
      },
    });
  });

  it('advances one step per answer and completes the lesson on the last one', async () => {
    await lessonTurn(ctx, { topicSlug: 'demo' });

    const turns = [];
    for (const answer of ['a1', 'a2', 'a3', 'a4']) {
      const { body } = await lessonTurn(ctx, { topicSlug: 'demo', answer });
      turns.push([body.step, body.done]);
    }

    expect(turns).toEqual([[1, false], [2, false], [3, false], [4, true]]);
    expect(state.getNextLesson('demo').lesson).toBe(2);
  });

  it('never shows the hidden assessment to the student', async () => {
    await lessonTurn(ctx, { topicSlug: 'demo' });
    const { body } = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'a1' });
    expect(body.reply).toBe('Nice — and what follows from that?');
  });

  it('rejects an answer when no lesson is in progress', async () => {
    expect(await lessonTurn(ctx, { topicSlug: 'demo', answer: 'hello' })).toEqual({
      status: 400,
      body: { error: 'No active lesson. Start one without an answer field.' },
    });
  });
});
