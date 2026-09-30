import { it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { lessonTurn } from '../api/lesson.js';

// #263: the companion reacts to a right answer and to a second miss in a row. The route says which
// moment it is, never the grade behind it.
const PLAN = { goal: 'g', retrieval: null, diagnostic: 'd?', followUp: 'f?', application: 'a?', commonMisconceptions: [] };
let ctx, scores;

beforeEach(() => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-mood-'));
  const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'curriculum.json');
  fs.writeFileSync(file, JSON.stringify({ topic: 'Demo', lessons: [{ lesson: 1, module: 'M', title: 'L1', concepts: ['c'], status: 'pending' }, { lesson: 2, module: 'M', title: 'L2', concepts: ['d'], status: 'pending' }] }));
  const kv = new Map();
  const state = {
    async readKV(k) { return kv.get(k) ?? null; }, async writeKV(k, v) { kv.set(k, v); },
    async insertKV(k, v) { if (!kv.has(k)) kv.set(k, v); }, async deleteKV(k) { kv.delete(k); },
    async readUser() { return ''; }, async readProgress() { return { active_topics: [], history: [] }; },
    async updateProgress(fn) { const p = { history: [] }; fn(p); return p; },
    readCurriculum() { return JSON.parse(fs.readFileSync(file, 'utf8')); },
    getNextLesson() { return this.readCurriculum().lessons[0]; },
    async markLessonComplete() {}, readDomainFile() { return null; },
  };
  scores = [];
  const adapter = {
    generate: vi.fn(async (system) => {
      if (!system.includes('## Current Step:')) return { text: JSON.stringify(PLAN) };
      const score = scores.shift();
      return { text: `${score == null ? '' : `<assessment>{"score":${score}}</assessment>\n`}Reply.` };
    }),
  };
  ctx = { state, getAdapter: async () => adapter, skills: new Map() };
});

async function play(...grades) {
  scores = [...grades];
  let res = await lessonTurn(ctx, { topicSlug: 'demo' });
  const moods = [];
  for (let i = 0; i < grades.length; i++) {
    res = await lessonTurn(ctx, { topicSlug: 'demo', answer: `answer ${i}`, lessonId: res.body.lessonId, step: res.body.step });
    moods.push(res.body.mood);
    expect(JSON.stringify(res.body)).not.toMatch(/score|0\.\d/); // the grade stays hidden
  }
  return moods;
}

it('says "right" for a clearly right answer', async () => {
  expect(await play(0.9)).toEqual(['right']);
});

it('says "stuck" at the second miss in a row, not the first', async () => {
  expect(await play(0.2, 0.3)).toEqual([undefined, 'stuck']);
});

it('says nothing for a partly right answer, and a partly right answer breaks a run of misses', async () => {
  expect(await play(0.2, 0.6, 0.3)).toEqual([undefined, undefined, undefined]);
});

it('says nothing when a reply carried no grade, and keeps the run of misses', async () => {
  expect(await play(0.1, null, 0.2)).toEqual([undefined, undefined, 'stuck']);
});
