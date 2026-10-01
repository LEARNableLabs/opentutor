import { vi, describe, it, expect, beforeEach, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Quiz polls and flashcard buttons reach spaced review (#294), driven through the router with a
// fake channel. State is real and isolated by OPENTUTOR_DATA_DIR; the LLM is replaced, the logger
// silenced and the pause between polls skipped.

const DATA_DIR = await vi.hoisted(async () => {
  const fs = await import('node:fs');
  const os = await import('node:os');
  const path = await import('node:path');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'opentutor-polls-'));
  process.env.OPENTUTOR_DATA_DIR = dir;
  return dir;
});

vi.mock('../../scripts/bot/claude.js', () => ({ generate: vi.fn() }));
vi.mock('../../scripts/bot/helpers.js', async (importOriginal) => ({ ...(await importOriginal()), sleep: async () => {} }));
vi.mock('../../scripts/bot/logger.js', () => {
  const log = { info() {}, warn() {}, error() {}, debug() {} };
  return { log, logger: log, runWithReqId: (fn) => fn() };
});

const { generate } = await import('../../scripts/bot/claude.js');
const { route } = await import('../../scripts/bot/router.js');
const { deliverFlashcards } = await import('../../scripts/bot/flashcard.js');
const { readProgress, updateProgress, markLessonComplete, rememberReviewCard, findReviewCard } = await import('../../scripts/bot/state.js');
const { registerConcept } = await import('../../scripts/bot/spaced-repetition.js');

const STUDENT = 42; // a private chat: its id is the student's own
const TOPIC = 'game-theory';
const CONCEPT = 'Nash equilibrium';
const TODAY = new Date().toISOString().split('T')[0];

const channel = {
  sendMessage: vi.fn(async () => ({ message_id: 1 })),
  sendTyping: vi.fn(),
  sendPoll: vi.fn(async () => ({ message_id: 2, poll: { id: `poll-${channel.sendPoll.mock.calls.length}` } })),
  answerCallback: vi.fn(),
  editMessageButtons: vi.fn(),
};

const send = (text, via = route) => via({ message: { text, chat: { id: STUDENT }, from: { id: STUDENT } } }, channel, new Map());
const answerPoll = (poll_id, option_ids, user = STUDENT, via = route) => via({ poll_answer: { poll_id, user: { id: user }, option_ids } }, channel, new Map());
const tap = (data) => route({ callback_query: { id: 'cb', data, from: { id: STUDENT }, message: { chat: { id: STUDENT }, message_id: 9 } } }, channel, new Map());
const record = (concept) => Object.values(readProgress().spaced_repetition || {}).find((r) => r.concept === concept);
const sentText = () => channel.sendMessage.mock.calls.map(([, text]) => text).join('\n');

function due(topic, concept, fields = {}) {
  registerConcept(topic, concept);
  updateProgress((p) => {
    Object.assign(Object.values(p.spaced_repetition).find((r) => r.concept === concept), { next_review: '2020-01-01', ...fields });
    p.active_topics = [TOPIC];
  });
}

function quizReply(...questions) {
  generate.mockResolvedValue({ text: JSON.stringify(questions.map(([concept, correct]) => ({
    question: `About ${concept}?`, concept, options: ['a', 'b', 'c', 'd'], correct, explanation: 'Because.',
  }))) });
}

beforeEach(() => {
  vi.clearAllMocks();
  for (const file of ['progress.json', 'completions.json']) fs.rmSync(path.join(DATA_DIR, 'workspace', 'tutor', file), { force: true });
  const topicDir = path.join(DATA_DIR, 'domains', TOPIC);
  fs.mkdirSync(topicDir, { recursive: true });
  fs.writeFileSync(path.join(topicDir, 'curriculum.json'), JSON.stringify({
    topic: 'Game Theory', slug: TOPIC,
    lessons: [
      { lesson: 1, title: 'Strategies', concepts: ['dominant strategy'], status: 'pending' },
      { lesson: 2, title: 'Equilibria', concepts: [CONCEPT, 'dominant strategy'], status: 'pending' },
    ],
  }));
});

afterAll(() => {
  delete process.env.OPENTUTOR_DATA_DIR;
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
});

describe('quiz poll answers reach spaced review', () => {
  it('a correct answer reschedules the concept', async () => {
    due(TOPIC, CONCEPT);
    quizReply([CONCEPT, 2]);
    await send('/review');
    expect(channel.sendPoll).toHaveBeenCalledTimes(1);

    await answerPoll('poll-1', [2]);

    expect(record(CONCEPT)).toMatchObject({ reps: 1, streak: 1 });
    expect(record(CONCEPT).next_review > TODAY).toBe(true); // no longer due
  });

  it('a wrong answer resets its interval', async () => {
    due(TOPIC, CONCEPT, { interval: 10, streak: 3 });
    quizReply([CONCEPT, 2]);
    await send('/review');

    await answerPoll('poll-1', [0]);

    expect(record(CONCEPT)).toMatchObject({ reps: 1, interval: 1, streak: 0 });
  });

  it('a /quiz question grades the lesson concept it names', async () => {
    registerConcept(TOPIC, CONCEPT);
    updateProgress((p) => { p.active_topics = [TOPIC]; });
    markLessonComplete(TOPIC, 1);
    markLessonComplete(TOPIC, 2);
    quizReply(['nash EQUILIBRIUM', 1]); // named with different case

    await send('/quiz');
    expect(generate.mock.calls[0][0]).toContain(CONCEPT); // the prompt lists the concepts to name
    await answerPoll('poll-1', [1]);

    expect(record(CONCEPT)).toMatchObject({ reps: 1, streak: 1 });
  });

  it('grades a concept once per quiz, and never a concept the quiz did not list', async () => {
    due(TOPIC, CONCEPT);
    quizReply([CONCEPT, 0], [CONCEPT, 1], ['something it made up', 0]);
    await send('/review');
    expect(channel.sendPoll).toHaveBeenCalledTimes(3);

    for (const [poll, option] of [['poll-1', 0], ['poll-2', 1], ['poll-3', 0]]) await answerPoll(poll, [option]);

    expect(record(CONCEPT)).toMatchObject({ reps: 1, streak: 1 });
  });

  it.each([
    ['an unknown poll', 'poll-404', [2], STUDENT, 2],
    ['a retracted vote', 'poll-1', [], STUDENT, 2],
    ['someone other than the student it was sent to (a group, a forwarded poll)', 'poll-1', [2], 99, 2],
    ['a question with no right answer (it goes out as a plain poll, whose vote can change)', 'poll-1', [2], STUDENT, undefined],
  ])('ignores %s', async (_case, pollId, options, user, correct) => {
    due(TOPIC, CONCEPT);
    quizReply([CONCEPT, correct]);
    await send('/review');
    const before = record(CONCEPT);

    await answerPoll(pollId, options, user);

    expect(record(CONCEPT)).toEqual(before);
    expect(channel.sendMessage).not.toHaveBeenCalledWith(STUDENT, expect.stringContaining('Something went wrong'));
  });

  it('remembers a poll across a restart between sending and answering', async () => {
    due(TOPIC, CONCEPT);
    quizReply([CONCEPT, 2]);
    await send('/review');

    vi.resetModules(); // a fresh bot: nothing survives but what is on disk
    const restarted = await import('../../scripts/bot/router.js');
    await answerPoll('poll-1', [2], STUDENT, restarted.route);

    expect(record(CONCEPT)).toMatchObject({ reps: 1, streak: 1 });
  });

  it('keeps only the newest 300 cards', () => {
    for (let i = 0; i <= 300; i++) rememberReviewCard(`card-${i}`, { chatId: STUDENT, topic: TOPIC, concept: `c${i}`, correctIndex: 0 });

    expect(findReviewCard('card-0')).toBeNull();
    expect(findReviewCard('card-1')).toMatchObject({ concept: 'c1' });
    expect(findReviewCard('card-300')).toMatchObject({ concept: 'c300' });
  });
});

describe('flashcard buttons', () => {
  const LONG_TOPIC = 'history-and-philosophy-of-science-from-antiquity-to-the-present';
  const LONG_CONCEPT = 'the demarcation problem between sciences and pseudo-sciences';

  it('carry a 60-character concept whole, in at most 64 bytes of callback data', async () => {
    expect(LONG_CONCEPT).toHaveLength(60);
    due(LONG_TOPIC, LONG_CONCEPT);
    generate.mockResolvedValue({ text: 'What separates a science from a pseudoscience?' }); // no JSON: a button card

    await deliverFlashcards(STUDENT, channel, new Map(), 1);
    const [[gotIt, forgot]] = channel.sendMessage.mock.calls[0][2].buttons;
    for (const button of [gotIt, forgot]) expect(Buffer.byteLength(button.callback_data)).toBeLessThanOrEqual(64);

    await tap(gotIt.callback_data);

    expect(record(LONG_CONCEPT)).toMatchObject({ reps: 1, streak: 1 });
  });

  it('a button from before short ids fails soft', async () => {
    due(TOPIC, CONCEPT);
    const before = record(CONCEPT);

    await tap('fc::game-theory::nash-equilibrium::correct');

    expect(record(CONCEPT)).toEqual(before);
    expect(channel.editMessageButtons).toHaveBeenCalledWith(STUDENT, 9, []);
    expect(sentText()).toMatch(/expired/);
    expect(sentText()).not.toMatch(/Something went wrong/);
  });
});
