import { it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { keepTrustedLinks, keepVerifiedSources } from '../lib/core/links.js';
import { buildSocraticResponsePrompt, buildOnboardingPrompt, FORMAT, LINKS, SOURCES } from '../lib/core/prompts.js';
import { chatTurn } from '../api/chat.js';
import { lessonTurn } from '../api/lesson.js';
import { formatPracticeFeedback } from '../lib/core/deliberate-practice.js';

// #271: replies that help the reader read, and only links a student can trust.
const RESOURCE = 'https://ocw.mit.edu/courses/14-126-game-theory-spring-2024/pages/lecture-notes/';
afterEach(() => vi.unstubAllGlobals());

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
    '[Mercury](https://en.wikipedia.org/wiki/Mercury_(planet))',
    '[Plain http](http://en.wikipedia.org/wiki/Nash_equilibrium)',
    '[Edit page](https://en.wikipedia.org/wiki/Nash_equilibrium?action=edit)',
    '[Script](javascript:alert(1))',
    '[Slides](https://ocw.mit.edu/slides_(week_1).pdf)',
    '[[click](https://x.example)](https://evil.example/phish)',
    '[[[a](https://x.example)](https://y.example)](https://evil.example/2)',
  ].join('\n');
  expect(keepTrustedLinks(text, [RESOURCE, 'https://www.youtube.com/watch?v=x&t=30', 'https://ocw.mit.edu/slides_(week_1).pdf']).split('\n')).toEqual([
    `[MIT notes](${RESOURCE})`,
    '[Nash equilibrium](https://en.wikipedia.org/wiki/Nash_equilibrium)',
    '[Videos](https://www.youtube.com/results?search_query=nash+equilibrium)',
    'A great blog',
    'Lookalike',
    'At-sign trick',
    'A real video, not a search',
    '[Clip](https://www.youtube.com/watch?v=x&t=30)', // a resource copied XML-escaped from the prompt
    '[Mercury](https://en.wikipedia.org/wiki/Mercury_(planet))', // the whole title, closing parenthesis included
    'Plain http',
    'Edit page',
    'Script',
    '[Slides](https://ocw.mit.edu/slides_(week_1).pdf)',
    'click', // unlinking the inner link must not leave the outer one live
    'a',
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

// A one-lesson topic on disk, its state in memory, and a model that answers a plan or a reply.
function demoLesson({ diagnostic = 'Why?', feedback = null } = {}) {
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
    async markLessonComplete() {}, readDomainFile: (slug, name) => (name === 'practice-feedback.md' ? feedback : null),
  };
  const prompts = [];
  const adapter = {
    generate: vi.fn(async (system) => {
      prompts.push(system);
      if (!system.includes('## Current Step:')) return { text: JSON.stringify({ ...PLAN, diagnostic }) };
      return { text: `<assessment>{"score":0.8}</assessment>\nGood. See [the notes](${RESOURCE}) and [my blog](https://invented.example/b).` };
    }),
  };
  return { kv, prompts, ctx: { state, getAdapter: async () => adapter, skills: new Map() } };
}

it('lets a lesson link its own resources and nothing invented', async () => {
  const { kv, prompts, ctx } = demoLesson({ diagnostic: 'Read [this post](https://invented.example/p) first. Why?' });
  const start = await lessonTurn(ctx, { topicSlug: 'demo' });
  expect(start.body.reply).toContain('Read this post first.'); // the planner's invented link is unlinked too
  const next = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'because', lessonId: start.body.lessonId, step: start.body.step });
  expect(next.body.reply).toBe(`Good. See [the notes](${RESOURCE}) and my blog.`);
  expect(prompts.at(-1)).toContain(RESOURCE); // the reply prompt was given the lesson's resources

  // A reload shows the saved reply, which may predate the filter (a lesson in flight at deploy).
  for (const [k, v] of kv) {
    const lesson = typeof v === 'string' ? JSON.parse(v) : v;
    if (lesson?.id === start.body.lessonId) kv.set(k, typeof v === 'string' ? JSON.stringify({ ...lesson, reply: 'Old [phish](https://evil.example/p).' }) : { ...lesson, reply: 'Old [phish](https://evil.example/p).' });
  }
  const resumed = await lessonTurn(ctx, { topicSlug: 'demo' });
  expect(resumed.body).toMatchObject({ resumed: true, reply: 'Old phish.' });
});

it('unlinks an invented link in a review lesson\'s concept', async () => {
  const feedback = formatPracticeFeedback({
    timestamp: '2026-10-01T00:00:00.000Z', observations: [],
    directives: [{ type: 'BLOCK', target: '[payoffs](https://evil.example/p)', reason: 'BLOCK advancement until retested', priority: 'critical' }],
    model: { recentAccuracy: 0.5, trend: 'steady', difficulty: { level: 3, label: 'standard' }, engagement: 'steady', concepts: { shaky: [] } },
  }, 'Demo');
  const { ctx } = demoLesson({ feedback });
  const review = await lessonTurn(ctx, { topicSlug: 'demo' });
  expect(review.body.lesson).toMatchObject({ review: true });
  expect(review.body.reply).toContain('Explain **payoffs** in your own words');
  expect(review.body.reply).not.toContain('evil.example');
});

// #281: a reply that presents facts ends with a short quoted line naming real sources.
it('asks web lesson replies and the chat for a sources line, and never Telegram or onboarding', async () => {
  expect(web()).toContain(SOURCES);
  expect(buildSocraticResponsePrompt(PLAN, 'x', 'diagnostic', '').system).not.toContain(SOURCES);
  expect(buildOnboardingPrompt(new Map()).system).not.toContain(SOURCES);
  let system = '';
  const adapter = { generate: async (s) => ((system = s), { text: 'ok', model: 'm' }) };
  await chatTurn({ state: { readUser: async () => '' }, getAdapter: async () => adapter }, { message: 'How do vaccines work?' });
  expect(system).toContain(SOURCES);
  expect(SOURCES).toMatch(/^> 📚 Sources: \[/m); // a quote, as the page renders it
  expect(SOURCES).toMatch(/Never invent a source/);
  expect(SOURCES).toMatch(/very last line/);
});

it('drops an invented source and verifies a Wikipedia citation before including it', async () => {
  const check = vi.fn(async () => new Response(null, { status: 200 }));
  vi.stubGlobal('fetch', check);
  const text = 'Vaccines train the immune system.\n\n> 📚 Sources: [A study](https://invented.example/s); [Vaccine](https://en.wikipedia.org/wiki/Vaccine)';
  const adapter = { generate: async () => ({ text, model: 'm' }) };
  const res = await chatTurn({ state: { readUser: async () => '' }, getAdapter: async () => adapter }, { message: 'How do vaccines work?' });
  expect(res.body.reply).toBe('Vaccines train the immune system.\n\n> 📚 Sources: [Vaccine](https://en.wikipedia.org/wiki/Vaccine)');
  expect(check).toHaveBeenCalledExactlyOnceWith('https://en.wikipedia.org/wiki/Vaccine', expect.objectContaining({ method: 'HEAD', redirect: 'error' }));
});

it('omits nonexistent or unreachable Wikipedia sources without failing the reply', async () => {
  for (const check of [async () => new Response(null, { status: 404 }), async () => { throw new Error('timeout'); }]) {
    vi.stubGlobal('fetch', check);
    const text = 'Facts.\n> 📚 Sources: [Zorblax effect](https://en.wikipedia.org/wiki/Zorblax_effect)';
    const adapter = { generate: async () => ({ text, model: 'm' }) };
    const res = await chatTurn({ state: { readUser: async () => '' }, getAdapter: async () => adapter }, { message: 'Explain Zorblax' });
    expect(res.body.reply).toBe('Facts.');
  }
});

it('uses supplied lesson resources without fetching and never follows a lookalike or a video source', async () => {
  const check = vi.fn();
  vi.stubGlobal('fetch', check);
  const text = `Facts.\n> 📚 Sources: [Notes](${RESOURCE}); [Lookalike](https://en.wikipedia.org.evil.example/wiki/Facts)`;
  expect(await keepVerifiedSources(text, [RESOURCE])).toBe(`Facts.\n> 📚 Sources: [Notes](${RESOURCE})`);
  expect(await keepVerifiedSources('Facts.\n> 📚 Sources: [Video](https://www.youtube.com/results?search_query=facts)')).toBe('Facts.');
  expect(check).not.toHaveBeenCalled();
});

it('bounds verification to two citations in one footer', async () => {
  const check = vi.fn(async () => new Response(null, { status: 200 }));
  vi.stubGlobal('fetch', check);
  const link = (n) => `[${n}](https://en.wikipedia.org/wiki/${n})`;
  const reply = await keepVerifiedSources(`Facts.\n> 📚 Sources: ${link('Old')}\n> 📚 Sources: ${link('A')}; ${link('B')}; ${link('C')}`);
  expect(check).toHaveBeenCalledTimes(2);
  expect(reply).toBe(`Facts.\n> 📚 Sources: ${link('A')}; ${link('B')}`);
});
