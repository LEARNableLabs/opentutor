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

let root, state, adapter, ctx;

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
  adapter = {
    generate: vi.fn(async (system) => (system.includes('## Current Step:')
      ? { text: '<assessment>{"understanding":"full","score":0.9}</assessment>\nNice — and what follows from that?' }
      : { text: JSON.stringify(PLAN) })),
  };
  // Resolved only for a model call: that is where a trial student's allowance is checked.
  ctx = { state, getAdapter: vi.fn(async () => adapter), skills: new Map() };
});

// The step each answer was graded as, and whether its prompt was the closing one, from what the model saw.
const graded = () => adapter.generate.mock.calls
  .map(([system]) => system.match(/## Current Step: (\w+)/)?.[1])
  .filter(Boolean);
const closing = () => adapter.generate.mock.calls
  .filter(([system]) => system.includes('## Current Step:'))
  .map(([system]) => system.includes('This is the final step'));

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
    expect(graded()).toEqual(['retrieval', 'diagnostic', 'followUp', 'application']);
    expect(state.getNextLesson('demo').lesson).toBe(2);
  });

  // #148: the lesson opened on the diagnostic, but the first answer was graded as a
  // retrieval check, and the tutor then asked the diagnostic a second time.
  it('has no retrieval step when the plan has no retrieval question', async () => {
    adapter.generate.mockResolvedValueOnce({ text: JSON.stringify({ ...PLAN, retrieval: null }) });
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect(start.body).toMatchObject({ reply: '**Goal:** Explain alpha\n\nWhy does alpha matter?', step: 0, totalSteps: 3 });

    const turns = [];
    for (const answer of ['a1', 'a2', 'a3']) {
      const { body } = await lessonTurn(ctx, { topicSlug: 'demo', answer });
      turns.push([body.step, body.totalSteps, body.done]);
    }
    expect(graded()).toEqual(['diagnostic', 'followUp', 'application']);
    expect(turns).toEqual([[1, 3, false], [2, 3, false], [3, 3, true]]);
    expect(state.getNextLesson('demo').lesson).toBe(2);
  });

  it('still advances a lesson saved before lessons kept their own steps', async () => {
    const lesson = { day: 1, title: 'Lesson 1', module: 'Basics', concepts: ['alpha'] };
    state.writeKV('web_lesson:demo', JSON.stringify({ topicSlug: 'demo', lessonDay: 1, lesson, plan: PLAN, step: 1, history: [], assessments: [] }));
    const { body } = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'a2' });
    expect(body).toMatchObject({ step: 2, totalSteps: 4, done: false });
    expect(graded()).toEqual(['diagnostic']);
  });

  // #159: the web hides the answer box after the last reply, so it must not ask anything.
  it('closes on the last step only, without a question', async () => {
    await lessonTurn(ctx, { topicSlug: 'demo' });
    for (const answer of ['a1', 'a2', 'a3', 'a4']) await lessonTurn(ctx, { topicSlug: 'demo', answer });
    expect(closing()).toEqual([false, false, false, true]);
  });

  // #159: a reload re-planned the lesson with a new model call, and cost a trial
  // student a free lesson. It picks up where it was, and never asks for a model.
  it('picks up the lesson in progress on a reload, without resolving a model', async () => {
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    ctx.getAdapter.mockClear();
    expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body).toEqual({ ...start.body, resumed: true });

    const answered = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'a1' });
    ctx.getAdapter.mockClear();
    adapter.generate.mockClear();
    expect(await lessonTurn(ctx, { topicSlug: 'demo' })).toEqual({
      status: 200,
      body: { reply: 'Nice — and what follows from that?', step: 1, totalSteps: 4, done: false, lesson: answered.body.lesson, resumed: true },
    });
    expect(ctx.getAdapter).not.toHaveBeenCalled();
    expect(adapter.generate).not.toHaveBeenCalled();

    // …and the next answer is graded as the step the student is on.
    await lessonTurn(ctx, { topicSlug: 'demo', answer: 'a2' });
    expect(graded()).toEqual(['diagnostic']);
  });

  it('plans a new lesson when none is in progress', async () => {
    await lessonTurn(ctx, { topicSlug: 'demo' });
    for (const answer of ['a1', 'a2', 'a3', 'a4']) await lessonTurn(ctx, { topicSlug: 'demo', answer });
    adapter.generate.mockClear();
    const { body } = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect(body).toMatchObject({ step: 0, totalSteps: 4, done: false, lesson: { day: 2 } });
    expect(body.resumed).toBeUndefined();
    expect(adapter.generate).toHaveBeenCalledTimes(1); // the plan
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
