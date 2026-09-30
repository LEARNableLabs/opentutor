import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorStore } from '../lib/core/store.js';
import { evaluatePractice, formatPracticeFeedback, parseDirectives, parseRetested } from '../lib/core/deliberate-practice.js';
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
    // #227: the retest settles its concept alone; the lesson's own grade and date stay as they were.
    expect(store.readCurriculum('demo').lessons[0]).toEqual(before);
    expect(parseRetested(store.readDomainFile('demo', 'practice-feedback.md'))).toEqual({ alpha: { at: 6, passed: true } });
    expect(store.readProgress().history).toHaveLength(6);
    const next = (await start()).body;
    expect(next.lesson).toEqual({ day: 7, title: 'L7', module: 'Basics', concepts: ['c7'] });
    expect(next.note).toBeUndefined();
  });

  // #227: a lesson that opens on the blocked concept's retest settles it when the answer is right.
  it('settles the concept when a lesson opens on its retest and the student gets it right', async () => {
    score = 0.1;
    for (let i = 0; i < 2; i++) { await start(); await finish(); } // two reviews, both missed
    score = 0.9;
    const { body } = await start();
    expect(body.lesson).toMatchObject({ day: 7, title: 'L7' }); // goes ahead, opening on the retest
    await finish();
    expect(blocks()).toEqual([]);
    expect(Object.keys(parseRetested(store.readDomainFile('demo', 'practice-feedback.md')))).toEqual(['alpha']);
    expect((await start()).body.lesson).toMatchObject({ day: 8 });
  });

  // Review of #238: the retest question must name the concept as a whole, or the lesson asks its own.
  it.each([
    ['replaces a planner question that only contains the concept', 'What is alphabetical order?', /what is alpha and why/],
    ['keeps a planner question that names the concept', 'Quick check: what is alpha, again?', /Quick check: what is alpha, again\?/],
  ])('%s', async (_case, retrieval, expected) => {
    score = 0.1;
    for (let i = 0; i < 2; i++) { await start(); await finish(); }
    adapter.generate.mockImplementationOnce(async () => ({ text: JSON.stringify({ ...PLAN, retrieval }) }));
    expect((await start()).body.reply).toMatch(expected);
  });

  it('shows the planner a concept the student passed as no longer shaky', async () => {
    await start();
    await finish(); // the review of alpha passes
    await start(); // day 7 is planned
    const planPrompt = adapter.generate.mock.calls.map(([system]) => system).findLast((system) => !system.includes('## Current Step:'));
    expect(planPrompt).not.toMatch(/Shaky \(needs reinforcement\):[^\n]*alpha/);
  });

  // Review of #238: a retest that opened a lesson ranks before that lesson. When the concept is one
  // of the lesson's own and the rest of the lesson goes badly, the lesson's grade is the newer word.
  it('lets the rest of a lesson outrank the retest that opened it', async () => {
    const file = path.join(root, 'skills', 'tutor', 'domains', 'demo', 'curriculum.json');
    const curriculum = JSON.parse(fs.readFileSync(file, 'utf8'));
    curriculum.lessons[6].concepts = ['alpha'];
    fs.writeFileSync(file, JSON.stringify(curriculum));
    score = 0.1;
    for (let i = 0; i < 2; i++) { await start(); await finish(); } // two reviews, both missed
    score = [0.9, 0.1, 0.1, 0.1]; // the retest right, the rest of lesson 7 wrong
    expect((await start()).body.lesson.day).toBe(7);
    await finish();
    expect(store.readDomainFile('demo', 'practice-feedback.md')).toMatch(/- Shaky: [^\n]*alpha/);
  });

  // #227: two reviews in a row at most, whichever concepts they review.
  it('goes ahead after two reviews in a row, even when they review different concepts', async () => {
    const file = path.join(root, 'skills', 'tutor', 'domains', 'demo', 'curriculum.json');
    const curriculum = JSON.parse(fs.readFileSync(file, 'utf8'));
    curriculum.lessons[0].concepts = ['alpha', 'beta'];
    fs.writeFileSync(file, JSON.stringify(curriculum));
    store.writeDomainFile('demo', 'practice-feedback.md', formatPracticeFeedback(evaluatePractice('', store.readCurriculum('demo'), ''), 'Demo'));
    score = 0.9;
    expect((await start()).body.lesson.title).toBe('Review: alpha');
    await finish(); // alpha passes; beta is blocked next
    score = 0.1;
    expect((await start()).body.lesson.title).toBe('Review: beta');
    await finish();
    expect((await start()).body.lesson).toMatchObject({ day: 7, title: 'L7' });
  });

  // #227: passing a retest settles its own concept, never the rest of the lesson that flagged it.
  it('keeps the BLOCK on a lesson\'s other concept after one of them passes its retest', async () => {
    const file = path.join(root, 'skills', 'tutor', 'domains', 'demo', 'curriculum.json');
    const curriculum = JSON.parse(fs.readFileSync(file, 'utf8'));
    curriculum.lessons[0].concepts = ['alpha', 'beta'];
    fs.writeFileSync(file, JSON.stringify(curriculum));
    store.writeDomainFile('demo', 'practice-feedback.md', formatPracticeFeedback(evaluatePractice('', store.readCurriculum('demo'), ''), 'Demo'));
    expect(blocks()).toEqual(['alpha']);
    await start();
    await finish();
    expect(blocks()).toEqual(['beta']);
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

  it.each(['web_lesson:demo'])('gives exactly two reviews when the write of %s that starts one fails', async (key) => {
    score = 0.1;
    let failing = key;
    const state = ctx.state;
    ctx.state = new Proxy(state, { get: (target, name) => (name === 'writeKV'
      ? (k, value) => { if (k === failing) { failing = null; throw new Error('write failed'); } return target.writeKV(k, value); }
      : target[name]) });
    const seen = [];
    for (let i = 0; i < 6 && seen.at(-1) !== 'day 7'; i++) {
      const turn = await start().catch(() => null);
      if (!turn) { seen.push('failed'); continue; }
      seen.push(turn.body.lesson.review ? 'review' : `day ${turn.body.lesson.day}`);
      await finish();
    }
    expect(seen.at(-1)).toBe('day 7');
    expect(seen.filter((s) => s === 'review').length).toBe(2); // a failed start neither adds nor costs one
  });

  it('shares one review between two overlapping starts', async () => {
    score = 0.1;
    await start();
    await finish();
    const [a, b] = await Promise.all([start(), start()]);
    expect(b.body.reply).toBe(a.body.reply);
    expect(JSON.parse(store.readKV('web_lesson:demo')).reviews.count).toBe(2);
    await finish();
    expect((await start()).body.lesson).toMatchObject({ day: 7, title: 'L7' });
  });

  it('refuses an answer when only a count is saved, and keeps the count', async () => {
    score = 0.1;
    await start();
    await finish();
    expect(JSON.parse(store.readKV('web_lesson:demo'))).toEqual({ reviews: { concept: 'alpha', day: 7, count: 1 } });
    expect((await lessonTurn(ctx, { topicSlug: 'demo', answer: 'stray' })).status).toBe(400);
    expect(JSON.parse(store.readKV('web_lesson:demo')).reviews.count).toBe(1);
    expect((await start()).body.lesson).toMatchObject({ review: true });
  });

  it('does not count reviews left from an earlier lesson', async () => {
    store.writeKV('web_lesson:demo', JSON.stringify({ reviews: { concept: 'alpha', day: 6, count: 2 } }));
    expect((await start()).body.lesson).toMatchObject({ title: 'Review: alpha', review: true });
  });
});
