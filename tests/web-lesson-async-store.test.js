import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { lessonTurn } from '../api/lesson.js';

// SupabaseStore's methods are async and it has no `.db`. The lesson route used to
// reach into `state.db` for its KV, so on Supabase the lesson state was never
// stored and every answer came back "400 No active lesson" (#94).
//
// This drives the route with a store shaped like Supabase's — async, no `.db` —
// without needing a real project.

const PLAN = {
  goal: 'Explain alpha',
  retrieval: 'What do you remember about alpha?',
  diagnostic: 'Why does alpha matter?',
  followUp: 'Give an example of alpha.',
  application: 'Apply alpha somewhere new.',
  commonMisconceptions: [],
};

function asyncStore(root) {
  const kv = new Map();
  const disk = (slug) => path.join(root, 'skills', 'tutor', 'domains', slug, 'curriculum.json');
  const read = (slug) => { try { return JSON.parse(fs.readFileSync(disk(slug), 'utf-8')); } catch { return null; } };
  const completed = new Set();
  return {
    // No `.db` — exactly like SupabaseStore.
    async readKV(k) { return kv.get(k) ?? null; },
    async writeKV(k, v) { kv.set(k, v); },
    async deleteKV(k) { kv.delete(k); },
    async readUser() { return ''; },
    async readProgress() { return { active_topics: [], history: [] }; },
    async updateProgress(fn) { const p = { history: [] }; fn(p); return p; },
    readCurriculum(slug) {
      const c = read(slug);
      if (c) for (const l of c.lessons) if (completed.has(l.lesson)) l.status = 'completed';
      return c;
    },
    getNextLesson(slug) { return this.readCurriculum(slug)?.lessons.find((l) => l.status === 'pending') || null; },
    async markLessonComplete(slug, day) { completed.add(day); },
    readDomainFile() { return null; },
    _kv: kv,
  };
}

let root, ctx;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-async-store-'));
  const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'curriculum.json'), JSON.stringify({
    topic: 'Demo',
    lessons: [
      { lesson: 1, module: 'Basics', title: 'Lesson 1', concepts: ['alpha'], status: 'pending' },
      { lesson: 2, module: 'Basics', title: 'Lesson 2', concepts: ['beta'], status: 'pending' },
    ],
  }));
  ctx = {
    state: asyncStore(root),
    adapter: {
      generate: vi.fn(async (system) => (system.includes('## Current Step:')
        ? { text: '<assessment>{"score":0.9}</assessment>\nGood — and why?' }
        : { text: JSON.stringify(PLAN) })),
    },
    skills: new Map(),
  };
});

describe('lesson route on an async, db-less store', () => {
  it('persists lesson state so answers are accepted', async () => {
    const start = await lessonTurn(ctx, { topicSlug: 'demo' });
    expect(start.status).toBe(200);
    expect(start.body.done).toBe(false);

    const next = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'wild yeast' });
    expect(next.status).toBe(200);
    expect(next.body.error).toBeUndefined();
    expect(next.body.step).toBe(1);
  });

  it('runs a whole lesson through to completion', async () => {
    await lessonTurn(ctx, { topicSlug: 'demo' });
    let last;
    for (const a of ['a1', 'a2', 'a3', 'a4']) last = await lessonTurn(ctx, { topicSlug: 'demo', answer: a });

    expect(last.body.done).toBe(true);
    expect(ctx.state.getNextLesson('demo').lesson).toBe(2);
  });

  it('clears the stored lesson when it finishes', async () => {
    await lessonTurn(ctx, { topicSlug: 'demo' });
    for (const a of ['a1', 'a2', 'a3', 'a4']) await lessonTurn(ctx, { topicSlug: 'demo', answer: a });
    expect([...ctx.state._kv.keys()]).toEqual([]);
  });

  it('still rejects an answer when no lesson is in progress', async () => {
    const res = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'hello' });
    expect(res.status).toBe(400);
  });
});
