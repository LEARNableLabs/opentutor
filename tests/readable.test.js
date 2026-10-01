import { it, expect, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { keepTrustedLinks } from '../lib/core/links.js';
import { buildSocraticResponsePrompt, buildOnboardingPrompt, FORMAT, LINKS } from '../lib/core/prompts.js';
import { chatTurn } from '../api/chat.js';
import { lessonTurn } from '../api/lesson.js';

// #271: replies that help the reader read, and only links a student can trust.
const RESOURCE = 'https://ocw.mit.edu/courses/14-126-game-theory-spring-2024/pages/lecture-notes/';

it('keeps a lesson resource, a Wikipedia article and a YouTube search, and unlinks anything else', () => {
  const text = [
    `[MIT notes](${RESOURCE})`,
    '[Nash equilibrium](https://en.wikipedia.org/wiki/Nash_equilibrium)',
    '[Videos](https://www.youtube.com/results?search_query=nash+equilibrium)',
    '[A great blog](https://made-up-blog.example/nash)',
    '[Lookalike](https://en.wikipedia.org.evil.example/wiki/Nash)',
    '[At-sign trick](https://en.wikipedia.org@evil.example/wiki/Nash)',
    '[A real video, not a search](https://www.youtube.com/watch?v=abc123)',
    '[Clip](https://www.youtube.com/watch?v=x&amp;t=30)',
  ].join('\n');
  expect(keepTrustedLinks(text, [RESOURCE, 'https://www.youtube.com/watch?v=x&t=30']).split('\n')).toEqual([
    `[MIT notes](${RESOURCE})`,
    '[Nash equilibrium](https://en.wikipedia.org/wiki/Nash_equilibrium)',
    '[Videos](https://www.youtube.com/results?search_query=nash+equilibrium)',
    'A great blog',
    'Lookalike',
    'At-sign trick',
    'A real video, not a search',
    '[Clip](https://www.youtube.com/watch?v=x&t=30)', // a resource copied XML-escaped from the prompt
  ]);
});

const PLAN = { goal: 'g', retrieval: null, diagnostic: 'd?', followUp: 'f?', application: 'a?', commonMisconceptions: [] };
const web = (opts = {}) => buildSocraticResponsePrompt(PLAN, 'x', 'diagnostic', '', { markdown: true, ...opts }).system;

it('asks every web reply for the reader-friendly format, and never the Telegram one', () => {
  expect(web()).toContain(FORMAT);
  expect(web()).toContain(LINKS);
  expect(buildSocraticResponsePrompt(PLAN, 'x', 'diagnostic', '').system).not.toContain(FORMAT);
  expect(buildOnboardingPrompt(new Map()).system).toContain(FORMAT);
  expect(FORMAT).toMatch(/never how much/); // the step's length and question rules come first
});

it('gives a web lesson reply its lesson\'s resources, as data', () => {
  expect(web({ resources: [RESOURCE] })).toContain(`<untrusted_data type="lesson-resources">\n${RESOURCE}`);
  expect(web()).not.toContain('<untrusted_data type="lesson-resources">');
});

it('unlinks an invented link in a chat reply, and asks the chat for the format', async () => {
  let system = '';
  const adapter = { generate: async (s) => ((system = s), { text: 'See [this](https://invented.example/x) or [Wikipedia](https://en.wikipedia.org/wiki/Vaccine).', model: 'm' }) };
  const res = await chatTurn({ state: { readUser: async () => '' }, getAdapter: async () => adapter }, { message: 'How do vaccines work?' });
  expect(res.body.reply).toBe('See this or [Wikipedia](https://en.wikipedia.org/wiki/Vaccine).');
  expect(system).toContain(FORMAT);
  expect(system).toContain(LINKS);
});

it('lets a lesson link its own resources and nothing invented', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-links-'));
  const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'curriculum.json');
  fs.writeFileSync(file, JSON.stringify({ topic: 'Demo', lessons: [{ lesson: 1, module: 'M', title: 'L1', concepts: ['c'], resources: [RESOURCE], status: 'pending' }] }));
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
  const prompts = [];
  const adapter = {
    generate: vi.fn(async (system) => {
      prompts.push(system);
      if (!system.includes('## Current Step:')) return { text: JSON.stringify({ ...PLAN, diagnostic: 'Read [this post](https://invented.example/p) first. Why?' }) };
      return { text: `<assessment>{"score":0.8}</assessment>\nGood. See [the notes](${RESOURCE}) and [my blog](https://invented.example/b).` };
    }),
  };
  const ctx = { state, getAdapter: async () => adapter, skills: new Map() };
  const start = await lessonTurn(ctx, { topicSlug: 'demo' });
  expect(start.body.reply).toContain('Read this post first.'); // the planner's invented link is unlinked too
  const next = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'because', lessonId: start.body.lessonId, step: start.body.step });
  expect(next.body.reply).toBe(`Good. See [the notes](${RESOURCE}) and my blog.`);
  expect(prompts.at(-1)).toContain(RESOURCE); // the reply prompt was given the lesson's resources
});
