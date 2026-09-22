import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { lessonTurn } from '../../api/lesson.js';

// #117 — the store does the right thing: a write to a read-only disk throws.
// The loss happens one layer up, where api/lesson.js wraps the whole
// post-lesson path in `safely()` and discards the error without logging.
//
// So the student is told `done: true`, the lesson is graded and forgotten, and
// nothing anywhere records that it happened. Verified against the live
// deployment: a full four-step lesson left `completed: 0 of 29`.
//
// These tests use a store that fails exactly the way a serverless filesystem
// fails, and pin the contract: a turn that could not save must not claim it did.

const CURRICULUM = {
  topic: 'Game theory',
  lessons: [{ lesson: 1, title: 'What makes a game', concepts: ['players'], status: 'pending' }],
};

const PLAN = JSON.stringify({
  goal: 'Identify a game',
  diagnostic: 'What makes a situation a game?',
  followUp: 'How does that relate to dominant strategies?',
  application: 'Map two firms setting prices onto players and payoffs.',
});

/** A store that reads fine and refuses to write — a Vercel filesystem. */
function readOnlyStore() {
  const kv = new Map();
  return {
    writes: [],
    async readKV(k) { return kv.get(k) ?? null; },
    async writeKV(k, v) { kv.set(k, v); },          // kv is Postgres, still fine
    async deleteKV(k) { kv.delete(k); },
    async readUser() { return '# Student'; },
    async readProgress() { return { active_topics: ['game-theory'], history: [] }; },
    async updateProgress(fn) { const p = { active_topics: [], history: [] }; fn(p); return p; },
    async readCurriculum() { return structuredClone(CURRICULUM); },
    async getNextLesson() { return CURRICULUM.lessons[0]; },
    async readDomainFile() { return null; },
    // Everything below lands on disk in SupabaseStore.
    async markLessonComplete() { throw Object.assign(new Error("EROFS: read-only file system, mkdir '/var/task/workspace/tutor'"), { code: 'EROFS' }); },
    async writeDomainFile() { throw Object.assign(new Error('EROFS: read-only file system'), { code: 'EROFS' }); },
  };
}

const adapter = {
  generate: async (system) => ({
    text: system.includes('## Current Step:')
      ? '<assessment>{"score":0.9,"understanding":"full"}</assessment>\nGood — next?'
      : PLAN,
  }),
};

const ctx = (state) => ({ state, adapter, skills: new Map() });

let warned;
beforeEach(() => { warned = vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(() => warned.mockRestore());

describe('a lesson that cannot be saved', () => {
  it('does not tell the student it is done', async () => {
    const state = readOnlyStore();

    let turn = await lessonTurn(ctx(state), { topicSlug: 'game-theory' });
    const steps = turn.body.totalSteps;
    for (let i = 0; i < steps; i++) {
      turn = await lessonTurn(ctx(state), { topicSlug: 'game-theory', answer: 'an answer' });
    }

    // Either the turn surfaces the failure, or it does not claim completion.
    const claimedDone = turn.body?.done === true && !turn.body?.error && !turn.body?.warning;
    expect(claimedDone, 'reported a completed lesson it could not persist').toBe(false);
  });

  it('leaves a trace in the logs rather than discarding the error', async () => {
    const state = readOnlyStore();

    let turn = await lessonTurn(ctx(state), { topicSlug: 'game-theory' });
    for (let i = 0; i < turn.body.totalSteps; i++) {
      turn = await lessonTurn(ctx(state), { topicSlug: 'game-theory', answer: 'an answer' });
    }

    const logged = warned.mock.calls.flat().map(String).join(' ');
    expect(logged, 'an EROFS on the persistence path must be logged').toMatch(/EROFS|read-only|persist|complete/i);
  });
});

describe('a lesson that saves normally', () => {
  it('still reports done, so the guard has not broken the happy path', async () => {
    const state = readOnlyStore();
    state.markLessonComplete = async () => {};
    state.writeDomainFile = async () => {};

    let turn = await lessonTurn(ctx(state), { topicSlug: 'game-theory' });
    for (let i = 0; i < turn.body.totalSteps; i++) {
      turn = await lessonTurn(ctx(state), { topicSlug: 'game-theory', answer: 'an answer' });
    }

    expect(turn.body.done).toBe(true);
    expect(turn.body.error).toBeUndefined();
  });
});

describe('a topic with no curriculum', () => {
  // #118 — getNextLesson returns null both when every lesson is done and when
  // the curriculum was never built, and the caller could not tell them apart.
  // On the live deployment a topic whose background pipeline died mid-build sat
  // in active_topics, and asking for a lesson congratulated the student on
  // finishing 0 lessons.
  const missing = () => ({
    ...readOnlyStore(),
    async readCurriculum() { return null; },
    async getNextLesson() { return null; },
  });

  it('does not congratulate the student on work they never did', async () => {
    const { body } = await lessonTurn(ctx(missing()), { topicSlug: 'never-built' });

    expect(body.message || '').not.toMatch(/completed/i);
  });

  it('says the curriculum is missing, and names the topic', async () => {
    const { body } = await lessonTurn(ctx(missing()), { topicSlug: 'never-built' });

    expect(JSON.stringify(body)).toMatch(/never-built/);
    expect(body.done).not.toBe(true);
  });

  it('still congratulates when the lessons really are all done', async () => {
    const finished = {
      ...readOnlyStore(),
      async readCurriculum() { return { topic: 'Game theory', lessons: [{ lesson: 1, status: 'completed' }] }; },
      async getNextLesson() { return null; },
    };

    const { body } = await lessonTurn(ctx(finished), { topicSlug: 'game-theory' });

    expect(body.done).toBe(true);
    expect(body.message).toMatch(/completed/i);
  });
});
