import { vi, describe, it, expect, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

// Lesson lifecycle, end to end. State, prompts, student model and the
// DeliberatePractitioner are REAL and run against a temp dir; only true
// externals are replaced: the LLM, SQLite, the session log and the SR scheduler.

const { PATHS } = await vi.hoisted(async () => {
  const fs = await import('node:fs');
  const os = await import('node:os');
  const path = await import('node:path');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'opentutor-lifecycle-'));
  const workspace = path.join(root, 'workspace');
  const PATHS = {
    root,
    workspace,
    domains: path.join(root, 'domains'),
    progress: path.join(workspace, 'tutor', 'progress.json'),
    user: path.join(workspace, 'USER.md'),
    memory: path.join(workspace, 'memory'),
    sessions: path.join(workspace, 'sessions'),
  };
  for (const dir of [PATHS.domains, PATHS.memory, PATHS.sessions, path.dirname(PATHS.progress)]) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return { PATHS };
});

vi.mock('../../scripts/bot/config.js', () => ({ PATHS }));
vi.mock('../../scripts/bot/claude.js', () => ({ generate: vi.fn() }));
vi.mock('../../scripts/bot/session.js', () => ({ appendMessage: vi.fn() }));
vi.mock('../../scripts/bot/spaced-repetition.js', () => ({
  registerLessonConcepts: vi.fn(),
  getDueReviews: vi.fn(() => []),
  recordReview: vi.fn(),
}));
vi.mock('../../lib/core/db.js', () => ({ openDatabaseFromEnv: vi.fn(() => null) }));
vi.mock('../../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const { generate } = await import('../../scripts/bot/claude.js');
const { getDueReviews } = await import('../../scripts/bot/spaced-repetition.js');
const { deliverNextLesson, handleLessonAnswer, getActiveLesson } = await import('../../scripts/bot/lesson.js');
const { evaluatePractice, formatPracticeFeedback } = await import('../../lib/core/deliberate-practice.js');

const TOPIC = 'test-topic';
const topicDir = path.join(PATHS.domains, TOPIC);
const channel = { sendMessage: vi.fn(), sendTyping: vi.fn() };

const PLAN = {
  goal: 'Explain why alpha matters',
  retrieval: 'Quick check: what is alpha?',
  diagnostic: 'Why would a system built on alpha behave differently under load?',
  concept: 'Alpha is the thing that makes beta possible.',
  followUp: 'Give one concrete example of alpha.',
  application: 'Apply alpha to a situation you have not seen before.',
  commonMisconceptions: [],
};
const REPLY = '<assessment>{"understanding":"full","score":0.8,"correct":[],"missing":[]}</assessment>\nGood. Next question?';

function lesson(n, concepts, extra = {}) {
  return { lesson: n, module: 'Basics', title: `Lesson ${n}`, concepts, difficulty: 2, type: 'mini-lesson', status: 'pending', ...extra };
}

function writeCurriculum(lessons) {
  fs.mkdirSync(topicDir, { recursive: true });
  fs.writeFileSync(path.join(topicDir, 'curriculum.json'), JSON.stringify({ topic: 'Test Topic', slug: TOPIC, lessons }));
}

const readLearningLog = () => fs.readFileSync(path.join(topicDir, 'learning.md'), 'utf-8');

async function answer(chatId, ...texts) {
  for (const text of texts) await handleLessonAnswer(text, chatId, channel);
}

beforeEach(() => {
  vi.clearAllMocks();
  fs.rmSync(topicDir, { recursive: true, force: true });
  fs.rmSync(PATHS.progress, { force: true });
  fs.rmSync(path.join(PATHS.workspace, 'tutor', 'completions.json'), { force: true });
  getDueReviews.mockReturnValue([]);
  generate.mockImplementation(async (system) => {
    if (system.includes('assessing whether a student correctly recalled')) return { text: 'easy' };
    if (system.includes('## Current Step:')) return { text: REPLY };
    return { text: JSON.stringify(PLAN) };
  });
});

afterAll(() => fs.rmSync(PATHS.root, { recursive: true, force: true }));

describe('lesson step sequencing', () => {
  it('treats the first answer of a first lesson as the diagnostic answer', async () => {
    writeCurriculum([lesson(1, ['alpha']), lesson(2, ['beta'])]);

    await deliverNextLesson(TOPIC, 101, channel, new Map());
    const pending = getActiveLesson(101);
    expect(pending.steps[pending.step]).toBe('diagnostic');

    await answer(101, 'first answer', 'second answer', 'third answer');
    expect(getActiveLesson(101)).toBeNull();
    expect(readLearningLog()).toContain('**Step scores:** diagnostic=0.8, followUp=0.8, application=0.8');
  });

  it('treats the answer after a retrieval check as the diagnostic answer', async () => {
    writeCurriculum([lesson(1, ['alpha'], { status: 'completed', engagement: 'correct' }), lesson(2, ['beta'])]);
    getDueReviews.mockReturnValue([{ concept: 'alpha' }]);

    await deliverNextLesson(TOPIC, 102, channel, new Map());
    await answer(102, 'alpha is the base'); // retrieval answer — the bot now asks the diagnostic
    const pending = getActiveLesson(102);
    expect(pending.steps[pending.step]).toBe('diagnostic');

    await answer(102, 'second answer', 'third answer', 'fourth answer');
    expect(getActiveLesson(102)).toBeNull();
    expect(readLearningLog()).toContain('**Step scores:** retrieval=0.8, diagnostic=0.8, followUp=0.8, application=0.8');
  });
});

describe('exercise format', () => {
  it('switches a disengaged student to multiple choice', async () => {
    writeCurriculum([lesson(1, ['alpha'], { status: 'completed', engagement: 'correct' }), lesson(2, ['beta'])]);
    fs.writeFileSync(path.join(topicDir, 'learning.md'), '## Accuracy Trend\n- **Engagement:** minimal\n');

    await deliverNextLesson(TOPIC, 105, channel, new Map());
    expect(getActiveLesson(105).exerciseFormat).toBe('mc');
  });
});

describe('BLOCK review', () => {
  // Lesson 1 went badly and five lessons have passed since: the real practitioner issues a BLOCK on "alpha".
  function writeBlockedTopic() {
    const lessons = [
      lesson(1, ['alpha'], { status: 'completed', engagement: 'incorrect' }),
      ...[2, 3, 4, 5, 6].map((n) => lesson(n, [`concept-${n}`], { status: 'completed', engagement: 'correct' })),
      lesson(7, ['eta']),
    ];
    writeCurriculum(lessons);
    const evaluation = evaluatePractice('', { topic: 'Test Topic', lessons }, '');
    fs.writeFileSync(path.join(topicDir, 'practice-feedback.md'), formatPracticeFeedback(evaluation, 'Test Topic'));
  }

  it('lets the student answer the review through to completion', async () => {
    writeBlockedTopic();

    await deliverNextLesson(TOPIC, 103, channel, new Map());
    expect(channel.sendMessage).toHaveBeenCalledWith(103, expect.stringContaining("make sure you've got <b>alpha</b> down"));

    await expect(handleLessonAnswer('alpha is the base idea', 103, channel)).resolves.toBe(true);
    await answer(103, 'an example of alpha', 'I would use alpha here');
    expect(getActiveLesson(103)).toBeNull();
  });

  it('is released once the review is done, so the next lesson is delivered', async () => {
    writeBlockedTopic();
    await deliverNextLesson(TOPIC, 104, channel, new Map());
    await answer(104, 'alpha is the base idea', 'an example of alpha', 'I would use alpha here');

    await deliverNextLesson(TOPIC, 104, channel, new Map());
    expect(getActiveLesson(104)).toMatchObject({ lessonDay: 7, plan: { diagnostic: PLAN.diagnostic } });
    expect(getActiveLesson(104).isReview).toBeFalsy();
  });
});
