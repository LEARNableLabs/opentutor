import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorStore } from '../lib/core/store.js';
import { lessonTurn } from '../api/lesson.js';
import { completeLesson } from '../lib/core/lesson-completion.js';
import { registerConcepts, recordReviewResult, dueConcepts, summarize } from '../lib/core/spaced-repetition.js';

// #327: one SM-2 for the web, the bot and agents.

const day = (n) => new Date(Date.UTC(2026, 0, 1 + n));

describe('SM-2 core', () => {
  it('schedules 1 day, then 3, then interval x ease; a miss resets', () => {
    const r = registerConcepts({}, 't', ['Alpha'], day(0));
    const rec = r['t::alpha'];
    expect(rec.next_review).toBe('2026-01-02');
    recordReviewResult(r, 't', 'Alpha', 'easy', day(1));
    expect([rec.interval, rec.next_review]).toEqual([1, '2026-01-03']);
    recordReviewResult(r, 't', 'Alpha', 'easy', day(2));
    expect(rec.interval).toBe(3);
    recordReviewResult(r, 't', 'Alpha', 'easy', day(5));
    expect(rec.interval).toBe(Math.ceil(3 * 2.7));
    recordReviewResult(r, 't', 'Alpha', 'wrong', day(9));
    expect([rec.interval, rec.streak]).toEqual([1, 0]);
  });

  it('keeps the schedule of a concept registered twice, and ignores an untracked one', () => {
    const r = registerConcepts({}, 't', ['a'], day(0));
    r['t::a'].ease = 1.5;
    registerConcepts(r, 't', ['a'], day(3));
    expect(r['t::a'].ease).toBe(1.5);
    expect(recordReviewResult(r, 't', 'nope', 'easy')).toBe(r);
  });

  it('lists the most overdue first, per topic, minus the excluded', () => {
    const r = {};
    registerConcepts(r, 't', ['old'], day(0));
    registerConcepts(r, 't', ['newer'], day(2));
    registerConcepts(r, 't', ['skip'], day(0));
    registerConcepts(r, 'other', ['x'], day(0));
    expect(dueConcepts(r, { topicSlug: 't', now: day(5), exclude: ['skip'] }).map((c) => c.concept)).toEqual(['old', 'newer']);
    expect(dueConcepts(r, { topicSlug: 't', now: day(0) })).toEqual([]);
    expect(summarize(r, 't', day(5))).toMatchObject({ total: 3, due: 3 });
  });
});

describe('spaced repetition in the web lesson', () => {
  let root, store, ctx, score;
  const PLAN = { goal: 'g', retrieval: 'Warm up?', diagnostic: 'What do you know?', followUp: 'Example?', application: 'Apply it.', commonMisconceptions: [] };

  beforeEach(() => {
    vi.stubEnv('OPENTUTOR_DATA_DIR', '');
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-sr-'));
    const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'curriculum.json'), JSON.stringify({
      topic: 'Demo',
      lessons: [1, 2, 3].map((n) => ({ lesson: n, module: 'M', title: `L${n}`, concepts: [`c${n}`], status: 'pending' })),
    }));
    store = new TutorStore(root);
    score = 0.9;
    const adapter = { generate: vi.fn(async (system) => (system.includes('## Current Step:')
      ? { text: `<assessment>{"score":${score}}</assessment>\nNoted.` }
      : { text: JSON.stringify(PLAN) })) };
    ctx = { state: store, getAdapter: vi.fn(async () => adapter), skills: new Map() };
  });
  afterEach(() => { store.close(); fs.rmSync(root, { recursive: true, force: true }); vi.unstubAllEnvs(); });

  async function finish() {
    for (let i = 0; i < 6; i++) if ((await lessonTurn(ctx, { topicSlug: 'demo', answer: `a${i}` })).body.done) return;
    throw new Error('never finished');
  }

  it('registers a finished lesson\'s concepts', async () => {
    await lessonTurn(ctx, { topicSlug: 'demo' });
    await finish();
    expect(Object.keys(store.readProgress().spaced_repetition)).toEqual(['demo::c1']);
  });

  it('opens the next lesson on a due concept, and a miss reschedules it', async () => {
    await lessonTurn(ctx, { topicSlug: 'demo' });
    await finish();
    store.updateProgress((p) => { p.spaced_repetition['demo::c1'].next_review = '2000-01-01'; });
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect(start.body.reply).toContain('what is c1');
    score = 0.1;
    await finish();
    const rec = store.readProgress().spaced_repetition['demo::c1'];
    expect([rec.reps, rec.interval, rec.streak]).toEqual([1, 1, 0]);
    expect(rec.next_review > '2000-01-01').toBe(true);
  });

  it('does not retest anything before a concept is due', async () => {
    await lessonTurn(ctx, { topicSlug: 'demo' });
    await finish();
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect(start.body.reply).not.toContain('what is c1');
  });

  it('records the result of a review of a concept the schedule had not met', async () => {
    // A BLOCK on a concept from before spaced repetition: no record yet, and a miss must still count.
    await completeLesson({
      state: store,
      topicSlug: 'demo',
      lesson: { day: 1, lesson: 1, title: 'Review: zeta', concepts: ['zeta'] },
      session: { isReview: true, reviewConcept: 'zeta', steps: ['diagnostic'], assessments: [{ step: 'diagnostic', score: 0.1 }], history: [] },
    });
    const rec = store.readProgress().spaced_repetition['demo::zeta'];
    expect([rec.reps, rec.streak, rec.interval]).toEqual([1, 0, 1]);
  });

  it('brings a due concept back after the last lesson, once, and moves its date on', async () => {
    for (let n = 0; n < 3; n++) { await lessonTurn(ctx, { topicSlug: 'demo' }); await finish(); }
    expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body).toMatchObject({ done: true, message: 'All lessons completed!' });
    store.updateProgress((p) => { p.spaced_repetition['demo::c3'].next_review = '2000-01-01'; });
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect(start.body).toMatchObject({ done: false, lesson: { review: true, concepts: ['c3'] } });
    await finish();
    expect(store.readProgress().spaced_repetition['demo::c3'].next_review > '2000-01-01').toBe(true);
    expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body.message).toBe('All lessons completed!');
  });

  it('propagates a failed progress read on a completed course instead of claiming it is done', async () => {
    for (let n = 1; n <= 3; n++) store.markLessonComplete('demo', n, 'correct');
    vi.spyOn(store, 'readProgress').mockRejectedValue(new Error('database unavailable'));
    await expect(lessonTurn(ctx, { topicSlug: 'demo' })).rejects.toThrow('database unavailable');
  });

  it('retains a review after a schedule-save failure and lets its last answer be retried', async () => {
    for (let n = 1; n <= 3; n++) store.markLessonComplete('demo', n, 'correct');
    store.updateProgress((p) => { p.spaced_repetition = registerConcepts({}, 'demo', ['c1'], day(0)); });
    const { lessonId, totalSteps } = (await lessonTurn(ctx, { topicSlug: 'demo' })).body;
    for (let step = 0; step < totalSteps - 1; step++) await lessonTurn(ctx, { topicSlug: 'demo', answer: 'Answer', lessonId, step });
    const last = { topicSlug: 'demo', answer: 'Final answer', lessonId, step: totalSteps - 1 };
    const failing = vi.spyOn(store, 'updateProgress').mockRejectedValueOnce(new Error('schedule unavailable'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect((await lessonTurn(ctx, last)).status).toBe(503);
      expect(JSON.parse(store.readKV('web_lesson:demo'))).toMatchObject({ id: lessonId, step: last.step });
      expect(store.readKV(`lesson_done:${lessonId}`)).toBeNull();
      expect(store.readProgress().spaced_repetition['demo::c1'].next_review).toBe('2026-01-02');
      expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body).toMatchObject({ lessonId, step: last.step, resumed: true });
      expect((await lessonTurn(ctx, last)).body.done).toBe(true);
      expect(store.readProgress().spaced_repetition['demo::c1'].reps).toBe(1);
      expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body.message).toBe('All lessons completed!');
    } finally { failing.mockRestore(); log.mockRestore(); }
  });

  it('does not clear a review while a competing request owns its completion claim', async () => {
    for (let n = 1; n <= 3; n++) store.markLessonComplete('demo', n, 'correct');
    store.updateProgress((p) => { p.spaced_repetition = registerConcepts({}, 'demo', ['c1'], day(0)); });
    const { lessonId } = (await lessonTurn(ctx, { topicSlug: 'demo' })).body;
    const before = store.readKV('web_lesson:demo');
    store.writeKV(`lesson_done:${lessonId}`, 'another-request');
    expect((await lessonTurn(ctx, { topicSlug: 'demo', answer: 'Answer', lessonId, step: 0 })).status).toBe(409);
    expect(store.readKV('web_lesson:demo')).toBe(before);
  });

  it('keeps an exhausted BLOCK counter through a scheduled review on a completed course', async () => {
    for (let n = 1; n <= 3; n++) store.markLessonComplete('demo', n, 'correct');
    const reviews = { concept: 'blocked', day: 3, count: 2 };
    store.writeKV('web_lesson:demo', JSON.stringify({ reviews }));
    const feedback = '## Directives\n\n- **BLOCK** [critical]: blocked — BLOCK advancement until retested\n';
    store.writeDomainFile('demo', 'practice-feedback.md', feedback);
    store.updateProgress((p) => { p.spaced_repetition = registerConcepts({}, 'demo', ['c1'], day(0)); });
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect(start.body.lesson.concepts).toEqual(['c1']);
    expect(JSON.parse(store.readKV('web_lesson:demo')).reviews).toEqual(reviews);
    await finish();
    expect(JSON.parse(store.readKV('web_lesson:demo')).reviews).toEqual(reviews);
    store.writeDomainFile('demo', 'practice-feedback.md', feedback);
    expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body.done).toBe(true);
  });
});
