import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorStore } from '../lib/core/store.js';
import { evaluatePractice, formatPracticeFeedback, parseDirectives } from '../lib/core/deliberate-practice.js';
import { lessonTurn } from '../api/lesson.js';

// #149 — the bot holds a student back while a BLOCK is open; the web only steered the next
// lesson's plan and moved on. Six lessons are done here, and the first one's concept, alpha,
// was graded incorrect five lessons ago: the real DeliberatePractitioner blocks on it.
// Every test runs on the sync TutorStore and on the same store with every method async.

const PLAN = { goal: 'Explain the next idea', diagnostic: 'What do you know?', followUp: 'Example?', application: 'Apply it.', commonMisconceptions: [] };
const asAsync = (store) => new Proxy(store, {
  get: (target, key) => (typeof target[key] === 'function' ? async (...args) => target[key](...args) : target[key]),
});
const REVISIT = "Let's revisit alpha before moving on.";

describe.each([
  ['the sync TutorStore', (s) => s],
  ['an async store shaped like SupabaseStore', asAsync],
])('an open BLOCK on %s', (_name, wrap) => {
  let root, store, adapter, score, ctx;

  beforeEach(() => {
    vi.stubEnv('OPENTUTOR_DATA_DIR', '');
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-block-'));
    const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'curriculum.json'), JSON.stringify({
      topic: 'Demo',
      lessons: Array.from({ length: 8 }, (_, i) => ({ lesson: i + 1, module: 'Basics', title: `L${i + 1}`, concepts: [i ? `c${i + 1}` : 'alpha'], status: 'pending' })),
    }));
    store = new TutorStore(root);
    for (let day = 1; day <= 6; day++) store.markLessonComplete('demo', day, day === 1 ? 'incorrect' : 'correct');
    store.writeDomainFile('demo', 'practice-feedback.md', formatPracticeFeedback(evaluatePractice('', store.readCurriculum('demo'), ''), 'Demo'));
    score = 0.9; // one score for every step, a list consumed step by step, or null for no assessment
    adapter = { generate: vi.fn(async (system) => {
      if (!system.includes('## Current Step:')) return { text: JSON.stringify(PLAN) };
      const s = Array.isArray(score) ? score.shift() : score;
      return { text: s == null ? 'Noted.' : `<assessment>{"score":${s}}</assessment>\nNoted.` };
    }) };
    ctx = { state: wrap(store), getAdapter: vi.fn(async () => adapter), skills: new Map() };
  });

  afterEach(() => {
    store.close();
    fs.rmSync(root, { recursive: true, force: true });
    vi.unstubAllEnvs();
  });

  const start = () => lessonTurn(ctx, { topicSlug: 'demo' });
  async function finish(answer = (i) => `answer ${i}`) {
    for (let i = 0; i < 6; i++) {
      const turn = await lessonTurn(ctx, { topicSlug: 'demo', answer: answer(i) });
      if (turn.body.done) return turn;
    }
    throw new Error('the lesson never finished');
  }
  const blocks = () => parseDirectives(store.readDomainFile('demo', 'practice-feedback.md')).filter((d) => d.type === 'BLOCK').map((d) => d.target);

  it('starts a review of the blocked concept instead of the next lesson, with no model call', async () => {
    expect(blocks()).toEqual(['alpha']);
    expect((await start()).body).toEqual({
      reply: '**Goal:** Demonstrate solid understanding of alpha\n\nExplain **alpha** in your own words: what is it, and why does it matter?',
      step: 0,
      totalSteps: 3,
      done: false,
      lesson: { day: 7, title: 'Review: alpha', module: 'Basics', concepts: ['alpha'], review: true },
      note: REVISIT,
    });
    expect(ctx.getAdapter).not.toHaveBeenCalled();
    expect((await start()).body).toMatchObject({ resumed: true, lesson: { review: true } });
  });

  it('does not count the review as a completed lesson', async () => {
    score = 0.1;
    await start();
    expect((await finish()).body.done).toBe(true);
    expect(store.getNextLesson('demo').lesson).toBe(7);
    expect(store.readProgress().history).toHaveLength(6);
  });

  it('clears the BLOCK when the retest shows understanding, and the next start moves on', async () => {
    const before = store.readCurriculum('demo').lessons[0];
    await start();
    await finish();
    expect(blocks()).toEqual([]);
    const after = store.readCurriculum('demo').lessons[0];
    expect([after.engagement, after.delivered]).toEqual(['reviewed', before.delivered]); // re-graded, same date
    expect(store.readProgress().history).toHaveLength(6);
    const next = (await start()).body;
    expect(next.lesson).toEqual({ day: 7, title: 'L7', module: 'Basics', concepts: ['c7'] });
    expect(next.note).toBeUndefined();
  });

  // The bot releases the BLOCK after any review. Here it clears only on a passed retest,
  // so a student who keeps missing it gets at most two reviews in a row.
  it('reviews a failed retest once more, then goes ahead with a note, and holds back again after that lesson', async () => {
    score = 0.1;
    const starts = [];
    for (let i = 0; i < 4; i++) {
      const { body } = await start();
      starts.push([body.lesson.review ? 'review' : `day ${body.lesson.day}`, body.note]);
      await finish();
    }
    expect(starts).toEqual([
      ['review', REVISIT],
      ['review', REVISIT],
      ['day 7', "Let's move on for now. We'll keep coming back to alpha."],
      ['review', REVISIT],
    ]);
    expect(blocks()).toEqual(['alpha']);
    expect(store.getNextLesson('demo').lesson).toBe(8);
  });

  // Review of #202: engagement is no evidence of understanding, and a failed explanation is
  // not outweighed by a right example. Long, confident answers would grade 'engaged'.
  it.each([
    ['no assessment could be read', null],
    ['every score is out of range', 2],
    ['one answer failed, even if the average reaches correct', [0.1, 1, 1]],
  ])('keeps the BLOCK when %s', async (_case, scores) => {
    score = scores;
    await start();
    await finish((i) => `I am quite sure it works like this, number ${i}`);
    expect(blocks()).toEqual(['alpha']);
  });

  it('reviews an open BLOCK after the last lesson too, before saying all lessons are done', async () => {
    for (const day of [7, 8]) store.markLessonComplete('demo', day, 'correct');
    store.writeDomainFile('demo', 'practice-feedback.md', formatPracticeFeedback(evaluatePractice('', store.readCurriculum('demo'), ''), 'Demo'));
    expect(blocks()).toEqual(['alpha']);
    score = 0.1;
    const starts = [];
    for (let i = 0; i < 3; i++) {
      const { body } = await start();
      starts.push(body.done ? body.message : `${body.lesson.title}, day ${body.lesson.day}`);
      if (!body.done) await finish();
    }
    expect(starts).toEqual(['Review: alpha, day 8', 'Review: alpha, day 8', 'All lessons completed!']);
  });

  it('keeps the count of reviews when the lesson after them fails to start', async () => {
    score = 0.1;
    for (let i = 0; i < 2; i++) { await start(); await finish(); }
    adapter.generate.mockImplementationOnce(async () => { throw new Error('provider down'); });
    await expect(start()).rejects.toThrow('provider down');
    expect((await start()).body.lesson).toMatchObject({ day: 7, title: 'L7' }); // not a third review
  });

  it('fails the start rather than skip the BLOCK when the feedback cannot be read', async () => {
    const feedback = path.join(root, 'workspace', 'tutor', 'domains', 'demo', 'practice-feedback.md');
    fs.rmSync(feedback);
    fs.mkdirSync(feedback); // unreadable, not missing
    await expect(start()).rejects.toThrow(/EISDIR/);
    expect(store.readKV('web_lesson:demo')).toBeFalsy();
  });

  it('does not count reviews left from an earlier lesson', async () => {
    store.writeKV('web_review:demo', JSON.stringify({ concept: 'alpha', day: 6, count: 2 }));
    expect((await start()).body.lesson).toMatchObject({ title: 'Review: alpha', review: true });
  });
});
