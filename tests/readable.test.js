import { it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { inventedLink, keepTrustedLinks, keepVerifiedSources, sourceFilter } from '../lib/core/links.js';
import { buildSocraticResponsePrompt, buildOnboardingPrompt, FORMAT, LINKS, SOURCES } from '../lib/core/prompts.js';
import { chatTurn } from '../api/chat.js';
import { lessonTurn } from '../api/lesson.js';
import { formatPracticeFeedback } from '../lib/core/deliberate-practice.js';
import { withoutInvented } from '../scripts/check-resource-links.js';

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
function demoLesson({ diagnostic = 'Why?', feedback = null, resources = [RESOURCE], reply = `Good. See [the notes](${RESOURCE}) and [my blog](https://invented.example/b).` } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-links-'));
  const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'curriculum.json');
  fs.writeFileSync(file, JSON.stringify({ topic: 'Demo', lessons: [{ lesson: 1, module: 'M', title: 'L1', concepts: ['c'], resources, status: 'pending' }] }));
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
      return { text: `<assessment>{"score":0.8}</assessment>\n${reply}` };
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

// #293: a lesson's resources are trusted as links, so one whose shape can't be real never becomes one.
const INVENTED = 'https://www.youtube.com/watch?v=pantheon-construction';

it.each([
  [INVENTED, 'invalid YouTube video id'], // a slug where the id belongs
  ['https://www.youtube.com/watch?v=videoid', 'invalid YouTube video id'],
  ['https://www.youtube.com/watch?v=YourVideoID', 'invalid YouTube video id'], // 11 characters, but no id ends in D
  ['https://www.youtube.com/watch?v=', 'invalid YouTube video id'],
  ['https://youtu.be/stonehenge-secrets', 'invalid YouTube video id'],
  ['https://www.youtube.com/embed/example-demo', 'invalid YouTube video id'],
  ['https://m.youtube.com/shorts/abc', 'invalid YouTube video id'],
  ['https://www.youtube.com/playlist?list=PLintro-to-chemistry', 'invalid YouTube playlist id'],
  ['https://www.youtube.com/playlist?list=mit-18-06-lectures', 'invalid YouTube playlist id'],
  ['https://www.youtube.com/playlist?list=', 'invalid YouTube playlist id'],
  ['https://www.youtube.com/watch?list=PLintro-to-chemistry', 'invalid YouTube playlist id'], // plays the list: no video of its own
  ['https://www.youtube.com/embed/videoseries?list=PLintro-to-chemistry', 'invalid YouTube playlist id'],
  ['https://www.youtube.com/embed?listType=playlist&list=PLintro-to-chemistry', 'invalid YouTube playlist id'],
  ['https://www.youtube.com/embed/videoseries', 'invalid YouTube playlist id'], // embeds a list, and names none
  ['https://www.youtube.com/playlist?list=UU', 'invalid YouTube playlist id'], // two capitals and nothing after
  ['https://www.youtube.com/playlist?list=UU1234567890', 'invalid YouTube playlist id'], // 12 characters: the shortest real kind has 13
  ['https://www.youtube.com/embed/videoseries/', 'invalid YouTube playlist id'],
  ['https://www.youtube-nocookie.com/embed/videoseries?list=PLintro-to-chemistry', 'invalid YouTube playlist id'],
  ['https://www.youtube-nocookie.com/embed/pantheon-construction', 'invalid YouTube video id'],
  ['https://example.com/video', 'placeholder'],
  ['https://www.example.org/article', 'placeholder'],
  ['https://www.ncbi.nlm.nih.gov/pmc/articles/PMC-example-motor-control', 'placeholder'],
])('rejects the invented link %s', (url, why) => {
  expect(inventedLink(url)).toBe(why);
});

it.each([
  'https://www.youtube.com/watch?v=JpdRchyVtvk',
  'https://www.youtube.com/watch?v=JpdRchyVtvk&t=30s&list=PLUl4u3cNGP629n_3fX7HmKKgin_rqGzbx',
  'https://youtu.be/JpdRchyVtvk?t=30',
  'https://www.youtube.com/embed/JpdRchyVtvk',
  'https://www.youtube.com/shorts/JpdRchyVtvk',
  'https://www.youtube.com/playlist?list=PLUl4u3cNGP629n_3fX7HmKKgin_rqGzbx',
  'https://www.youtube.com/playlist?list=PL41FDABC6AA085E78', // the older 16-digit kind
  'https://www.youtube.com/playlist?list=UUYO_jab_esuFRV4b17AJtAw', // a channel's uploads
  'https://www.youtube.com/playlist?list=RDJpdRchyVtvk', // a mix: RD and a video id, 13 characters
  'https://www.youtube.com/embed/videoseries?list=PLUl4u3cNGP629n_3fX7HmKKgin_rqGzbx',
  'https://www.youtube.com/embed?listType=playlist&list=PLUl4u3cNGP629n_3fX7HmKKgin_rqGzbx',
  'https://www.youtube.com/watch?list=PLUl4u3cNGP629n_3fX7HmKKgin_rqGzbx',
  'https://www.youtube.com/watch?v=JpdRchyVtvk&list=PLintro-to-chemistry', // the video still plays
  'https://www.youtube-nocookie.com/embed/JpdRchyVtvk',
  'https://www.youtube.com/@3blue1brown',
  'https://www.youtube.com/results?search_query=example-based+learning',
  'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3172578/',
  'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratics/v/example-3-solving-a-quadratic-equation-by-factoring',
  'https://github.com/dockersamples/example-voting-app',
  'https://en.wikipedia.org/wiki/Example-based_machine_translation',
  'https://p5js.org/examples/math-noise-wave.html',
  'https://www.permaculturenews.org/2014/05/16/design-examples/',
  'Futuyma Ch. 11', // a reference, not a link: not this check's to judge
])('passes the real-shaped %s', (url) => {
  expect(inventedLink(url)).toBeNull();
});

// The links a reply prompt offers the model as the lesson's own.
const offered = (system) => system.match(/<untrusted_data type="lesson-resources">\n([\s\S]*?)\n<\/untrusted_data>/)?.[1].split('\n') ?? [];

it('neither offers nor keeps a lesson resource whose shape cannot be real', async () => {
  const { kv, prompts, ctx } = demoLesson({
    resources: [RESOURCE, INVENTED],
    diagnostic: `Watch [this](${INVENTED}) first. Why?`,
    reply: `Good. See [the notes](${RESOURCE}) and [the video](${INVENTED}).`,
  });
  const start = await lessonTurn(ctx, { topicSlug: 'demo' });
  expect(start.body.reply).toContain('Watch this first.');
  expect(JSON.parse(kv.get('web_lesson:demo')).resources).toEqual([RESOURCE]);
  const next = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'because', lessonId: start.body.lessonId, step: start.body.step });
  expect(next.body.reply).toBe(`Good. See [the notes](${RESOURCE}) and the video.`);
  expect(offered(prompts.at(-1))).toEqual([RESOURCE]);
});

it('stops trusting an invented resource saved with a lesson already in flight', async () => {
  const { kv, prompts, ctx } = demoLesson({ reply: `Good. See [the video](${INVENTED}).` });
  const start = await lessonTurn(ctx, { topicSlug: 'demo' });
  // As saved before #293: the invented link among the lesson's resources, and in the reply on screen.
  const key = 'web_lesson:demo';
  kv.set(key, JSON.stringify({ ...JSON.parse(kv.get(key)), resources: [RESOURCE, INVENTED], reply: `Watch [the video](${INVENTED}).` }));
  expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body).toMatchObject({ resumed: true, reply: 'Watch the video.' });
  const next = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'because', lessonId: start.body.lessonId, step: start.body.step });
  expect(next.body.reply).toBe('Good. See the video.');
  expect(offered(prompts.at(-1))).toEqual([RESOURCE]);
});

it('keeps a saved sources line that cites only the resources a lesson still has', async () => {
  const { kv, ctx } = demoLesson();
  await lessonTurn(ctx, { topicSlug: 'demo' });
  const key = 'web_lesson:demo';
  const reply = `Facts.\n> 📚 Sources: [Notes](${RESOURCE})`;
  kv.set(key, JSON.stringify({ ...JSON.parse(kv.get(key)), resources: [RESOURCE, INVENTED], sourcesVerified: true, reply }));
  expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body.reply).toBe(reply);
});

it('drops a saved sources line that was verified against an invented resource', async () => {
  const { kv, ctx } = demoLesson();
  await lessonTurn(ctx, { topicSlug: 'demo' });
  const key = 'web_lesson:demo';
  kv.set(key, JSON.stringify({ ...JSON.parse(kv.get(key)), resources: [RESOURCE, INVENTED], sourcesVerified: true, reply: `Facts.\n> 📚 Sources: [The video](${INVENTED})` }));
  expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body.reply).toBe('Facts.'); // not "Sources: The video", a source with no link
});

it('cleans a shipped curriculum file of invented resources and nothing else, keeping its layout', () => {
  const file = (lessons) => `{\n  "lessons": [\n${lessons.map((l) => `    {\n      "concepts": ["a", "b"],\n      "resources": ${l}\n    }`).join(',\n')}\n  ]\n}\n`;
  const text = file([
    `[\n        "${RESOURCE}",\n        "${INVENTED}",\n        "https://example.com/x"\n      ]`,
    `["https://youtu.be/abc", "${RESOURCE}", "Futuyma Ch. 11"]`,
    `[\n        "${INVENTED}"\n      ]`,
  ]);
  const { text: out, removed } = withoutInvented(text);
  expect(out).toBe(file([`[\n        "${RESOURCE}"\n      ]`, `["${RESOURCE}", "Futuyma Ch. 11"]`, '[]']));
  expect(removed.map((r) => r.url)).toEqual([INVENTED, 'https://example.com/x', 'https://youtu.be/abc', INVENTED]);
  expect(withoutInvented(out)).toEqual({ text: out, removed: [] });
});

// Shipped domains are written by agents following the skill, not only by the builder: check what ships.
it('ships no lesson resource whose shape cannot be real', () => {
  const domains = 'skills/tutor/domains';
  const invented = fs.readdirSync(domains).filter((slug) => fs.existsSync(path.join(domains, slug, 'curriculum.json')))
    .flatMap((slug) => JSON.parse(fs.readFileSync(path.join(domains, slug, 'curriculum.json'), 'utf8')).lessons
      .flatMap((lesson) => lesson.resources || []).filter((url) => inventedLink(url)).map((url) => `${slug}: ${url}`));
  expect(invented).toEqual([]);
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

it('recognizes only a terminal marked footer and preserves ordinary Sources quotes', async () => {
  const check = vi.fn();
  vi.stubGlobal('fetch', check);
  const quoted = 'Explain this quotation:\n> Sources: primary inputs';
  expect(await keepVerifiedSources(quoted)).toBe(quoted);
  expect(await keepVerifiedSources('Facts.\n> 📚 Sources: [Vaccine](https://en.wikipedia.org/wiki/Vaccine)\n\nWhat do you think?')).toBe('Facts.\n\nWhat do you think?');
  expect(check).not.toHaveBeenCalled();
});

it.each([' ', '   ', '\t'])('verifies indented source metadata with %j indentation', async (indent) => {
  const check = vi.fn(async () => new Response(null, { status: 404 }));
  vi.stubGlobal('fetch', check);
  const text = `Facts.\n${indent}> 📚 Sources: [Zorblax](https://en.wikipedia.org/wiki/Zorblax_effect)`;
  expect(await keepVerifiedSources(text)).toBe('Facts.');
  expect(check).toHaveBeenCalledTimes(1);
  for (let split = 0; split <= text.length; split++) {
    const tokens = [];
    const filter = sourceFilter((t) => tokens.push(t));
    filter(text.slice(0, split));
    filter(text.slice(split));
    expect(tokens.join('')).toBe('Facts.\n');
  }
});

it.each(['> An ordinary final quote.', 'Intro\n > Sources: primary inputs', '\t> 📚 A book quote.'])('streams a final ordinary quote without a newline: %s', (text) => {
  for (let split = 0; split <= text.length; split++) {
    const tokens = [];
    const filter = sourceFilter((t) => tokens.push(t));
    filter(text.slice(0, split));
    filter(text.slice(split));
    expect(tokens.join('')).toBe(text);
  }
});

it('resumes streaming prose after a nonterminal source line', () => {
  const text = 'Facts.\n > 📚 Sources: [Zorblax](https://en.wikipedia.org/wiki/Zorblax_effect)\n\nWhat do you think?';
  for (let split = 0; split <= text.length; split++) {
    const tokens = [];
    const filter = sourceFilter((t) => tokens.push(t));
    filter(text.slice(0, split));
    filter(text.slice(split));
    expect(tokens.join('')).toBe('Facts.\n\nWhat do you think?');
  }
});

it.each(['Intro\n> 📚 Sources', 'Intro\n> ', 'Intro\n   '])('flushes an unfinished ordinary prefix: %s', (text) => {
  const tokens = [];
  const filter = sourceFilter((t) => tokens.push(t));
  for (const ch of text) filter(ch);
  filter.flush();
  filter.flush();
  expect(tokens.join('')).toBe(text);
});

it.each([false, true])('flushes an ordinary prefix when generation completes or fails (failure: %s)', async (fail) => {
  const { ctx } = demoLesson();
  const start = await lessonTurn(ctx, { topicSlug: 'demo' });
  const adapter = await ctx.getAdapter();
  const text = '<assessment>{"score":0.8}</assessment>\nIntro\n> 📚 Sources';
  adapter.generate.mockImplementation(async (_system, _history, options) => {
    for (const ch of text) options.onToken(ch);
    if (fail) throw new Error('broken stream');
    return { text };
  });
  const tokens = [];
  const next = lessonTurn(ctx, { topicSlug: 'demo', answer: 'because' }, { onToken: (t) => tokens.push(t) });
  if (fail) await expect(next).rejects.toThrow('broken stream');
  else await next;
  expect(tokens.join('')).toBe('Intro\n> 📚 Sources');
});

it('resumes an already-verified footer without fetching, and drops legacy footers without rewriting the lesson', async () => {
  const check = vi.fn(async () => new Response(null, { status: 200 }));
  vi.stubGlobal('fetch', check);
  const { kv, ctx } = demoLesson();
  const start = await lessonTurn(ctx, { topicSlug: 'demo' });
  const adapter = await ctx.getAdapter();
  adapter.generate.mockResolvedValue({ text: '<assessment>{"score":0.8}</assessment>\nFacts.\n> 📚 Sources: [Vaccine](https://en.wikipedia.org/wiki/Vaccine)' });
  const next = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'because', lessonId: start.body.lessonId, step: start.body.step });
  expect(check).toHaveBeenCalledTimes(1);
  const resumed = await lessonTurn(ctx, { topicSlug: 'demo' });
  expect(resumed.body.reply).toBe(next.body.reply);
  expect(check).toHaveBeenCalledTimes(1);
  const key = 'web_lesson:demo';
  const legacy = JSON.stringify({ ...JSON.parse(kv.get(key)), sourcesVerified: undefined });
  kv.set(key, legacy);
  expect((await lessonTurn(ctx, { topicSlug: 'demo' })).body.reply).toBe('Facts.');
  expect(check).toHaveBeenCalledTimes(1);
  expect(kv.get(key)).toBe(legacy);
});

it('streams prose and ordinary complete quotes while withholding a source footer split at any token boundary', () => {
  const prose = 'A fact.\n> An ordinary quote.\nWhat next?\n';
  const text = prose + '> 📚 Sources: [Zorblax](https://en.wikipedia.org/wiki/Zorblax_effect)\n';
  for (let split = 0; split <= text.length; split++) {
    const chunks = [];
    const filter = sourceFilter((chunk) => chunks.push(chunk));
    filter(text.slice(0, split));
    filter(text.slice(split));
    expect(chunks.join('')).toBe(prose);
  }
  const chunks = [];
  const filter = sourceFilter((chunk) => chunks.push(chunk));
  for (const ch of text.trimEnd()) filter(ch);
  expect(chunks.join('')).toBe(prose);
});

it('delivers verified sources only in the final lesson response, never in streamed tokens', async () => {
  const { ctx } = demoLesson();
  const start = await lessonTurn(ctx, { topicSlug: 'demo' });
  const adapter = await ctx.getAdapter();
  const text = `<assessment>{"score":0.8}</assessment>\nA fact. What next?\n> 📚 Sources: [Notes](${RESOURCE})`;
  adapter.generate.mockImplementation(async (_system, _messages, options) => {
    for (const ch of text) options.onToken(ch);
    return { text };
  });
  const tokens = [];
  const next = await lessonTurn(ctx, { topicSlug: 'demo', answer: 'because', lessonId: start.body.lessonId, step: start.body.step }, { onToken: (t) => tokens.push(t) });
  expect(tokens.join('')).toBe('A fact. What next?\n');
  expect(next.body.reply).toContain(`> 📚 Sources: [Notes](${RESOURCE})`);
});
