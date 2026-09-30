import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { lessonTurn } from '../api/lesson.js';
import { buildLessonPlanPrompt } from '../lib/core/prompts.js';

// #255: suggested answers for the questions that check, never for the one where the student
// has to produce the answer. The lesson route sends them with the question they belong to.
const PLAN = {
  goal: 'Explain alpha',
  retrieval: null,
  diagnostic: 'Why does alpha matter?',
  followUp: 'Give an example of alpha.',
  application: 'Apply alpha somewhere new: the reason alpha works is ___',
  commonMisconceptions: [],
  diagnosticOptions: ['Because it is fast', 'Because it is cheap', 'Because it compounds', "I'm not sure — explain it to me"],
  followUpOptions: ['A savings account', 'A coin toss', "I'm not sure"],
  applicationOptions: ['Should never be shown', 'Also never'],
};

function store(root) {
  const kv = new Map();
  const file = path.join(root, 'skills', 'tutor', 'domains', 'demo', 'curriculum.json');
  return {
    async readKV(k) { return kv.get(k) ?? null; },
    async writeKV(k, v) { kv.set(k, v); },
    async insertKV(k, v) { if (!kv.has(k)) kv.set(k, v); },
    async deleteKV(k) { kv.delete(k); },
    async readUser() { return ''; },
    async readProgress() { return { active_topics: [], history: [] }; },
    async updateProgress(fn) { const p = { history: [] }; fn(p); return p; },
    readCurriculum() { return JSON.parse(fs.readFileSync(file, 'utf8')); },
    getNextLesson() { return this.readCurriculum().lessons[0]; },
    async markLessonComplete() {},
    readDomainFile() { return null; },
  };
}

let ctx, plan;
beforeEach(() => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-options-'));
  const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'curriculum.json'), JSON.stringify({
    topic: 'Demo', lessons: [{ lesson: 1, module: 'Basics', title: 'Lesson 1', concepts: ['alpha'], status: 'pending' }],
  }));
  plan = structuredClone(PLAN);
  const adapter = {
    generate: vi.fn(async (system) => (system.includes('## Current Step:')
      ? { text: '<assessment>{"score":0.9}</assessment>\nGood — and why?' }
      : { text: JSON.stringify(plan) })),
  };
  ctx = { state: store(root), getAdapter: async () => adapter, skills: new Map(), getAdapterCalls: () => adapter.generate.mock.calls.map(([system]) => system) };
});

const answer = (res, text) => lessonTurn(ctx, { topicSlug: 'demo', answer: text, lessonId: res.body.lessonId, step: res.body.step });

describe('suggested answers', () => {
  it('come with the question they belong to, and never with the application step', async () => {
    const same = (shown, planned) => {
      expect([...shown].sort()).toEqual([...planned].sort()); // shuffled once, when planned
      expect(shown.at(-1)).toBe(planned.at(-1)); // the escape option stays last
    };
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    same(start.body.options, PLAN.diagnosticOptions);
    const second = await answer(start, 'Because it compounds');
    same(second.body.options, PLAN.followUpOptions);
    const third = await answer(second, 'A savings account');
    expect(third.body.done).toBe(false);
    expect(third.body.options).toBeUndefined(); // application: the student produces the answer
  });

  it('come back with the question when a lesson in progress is resumed', async () => {
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    const resumed = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect(resumed.body.resumed).toBe(true);
    expect(resumed.body.options).toEqual(start.body.options); // the same order as first shown
    expect(resumed.body.lessonId).toBe(start.body.lessonId);
  });

  it.each([
    ['not a list', 'Because'],
    ['too few', ['Only one']],
    ['blank entries only', ['  ', '']],
    ['too long', ['x'.repeat(121), 'y'.repeat(121)]],
    ['not text', [1, 2, 3]],
  ])('are left out when the planner wrote them badly (%s)', async (_case, bad) => {
    plan.diagnosticOptions = bad;
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect(start.body.options).toBeUndefined();
  });

  it('drop blank and repeated entries but keep the rest', async () => {
    plan.diagnosticOptions = ['  Because it compounds ', '', 'Because it compounds', "I'm not sure"];
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect([...start.body.options].sort()).toEqual(['Because it compounds', "I'm not sure"].sort());
  });
});

it('has the tutor ask the next question as planned when it comes with suggested answers', async () => {
  const start = await lessonTurn(ctx, { topicSlug: 'demo' });
  const second = await answer(start, 'Because it compounds'); // next: the follow-up, which has answers
  await answer(second, 'A savings account'); // next: the application, which has none
  const prompts = ctx.getAdapterCalls().filter((system) => system.includes('## Current Step:'));
  expect(prompts[0]).toMatch(/Ask the next question as the lesson plan words it/);
  expect(prompts[1]).not.toMatch(/Ask the next question as the lesson plan words it/);
});

describe('the lesson plan', () => {
  const system = buildLessonPlanPrompt(new Map(), { lesson: 1, title: 't', concepts: ['c'] }).system;
  it('asks for answers to the checking questions, built from the misconceptions', () => {
    for (const key of ['retrievalOptions', 'diagnosticOptions', 'followUpOptions']) expect(system).toContain(`"${key}"`);
    expect(system).toMatch(/drawn from the commonMisconceptions/);
  });
  it('keeps the application step free-form', () => {
    expect(system).not.toContain('"applicationOptions"');
    expect(system).toMatch(/application step stays free-form/i);
  });
});
