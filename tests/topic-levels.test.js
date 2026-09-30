import { it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { publicCatalog } from '../lib/core/catalog.js';
import { TutorStore } from '../lib/core/store.js';
import { TutorState } from '../lib/core/state.js';

// #251: a ready-made topic says how hard it is and what to know first.
const DOMAINS = 'skills/tutor/domains';
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const read = (slug) => JSON.parse(fs.readFileSync(path.join(DOMAINS, slug, 'curriculum.json'), 'utf8'));
const shipped = fs.readdirSync(DOMAINS).filter((d) => fs.existsSync(path.join(DOMAINS, d, 'curriculum.json')));

it('gives every ready-made topic a level and its prerequisites', () => {
  const missing = shipped.filter((slug) => {
    const c = read(slug);
    const prerequisites = Array.isArray(c.prerequisites) ? c.prerequisites : [];
    return !LEVELS.includes(c.level) || !prerequisites.length || prerequisites.some((p) => typeof p !== 'string' || !p.trim());
  });
  expect(missing).toEqual([]);
});

it('passes the level and prerequisites through the public catalog', () => {
  const entry = publicCatalog().find((t) => t.slug === 'acoustic-engineering');
  const c = read('acoustic-engineering');
  expect(entry.level).toBe(c.level);
  expect(entry.prerequisites).toEqual(c.prerequisites);
});

let root;
afterEach(() => root && fs.rmSync(root, { recursive: true, force: true }));
function domain(curriculum) {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-levels-'));
  const dir = path.join(root, DOMAINS, 'knots');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'curriculum.json'), JSON.stringify({ topic: 'Knots', lessons: [{ lesson: 1, title: 'Loops' }], ...curriculum }));
  return root;
}

it('answers null and [] for a topic that has neither, so every entry has the same shape', () => {
  const [entry] = publicCatalog(domain({}));
  expect(entry).toMatchObject({ level: null, prerequisites: [] });
});

it.each([
  ['TutorStore', (r) => new TutorStore(r)],
  ['TutorState', (r) => new TutorState(r)],
])('%s puts the level and prerequisites on the Topics tab entry', (_name, make) => {
  const store = make(domain({ level: 'beginner', prerequisites: ['curiosity'] }));
  try {
    expect(store.getTopicProgress('knots')).toMatchObject({ level: 'beginner', prerequisites: ['curiosity'] });
  } finally {
    store.close?.();
  }
});

it('backfills the level after student_level, changing no other line', async () => {
  const { withLevel } = await import('../scripts/backfill-topic-levels.js');
  const text = '{\n  "topic": "Knots",\n  "student_level": "intermediate",\n  "lessons": [{ "lesson": 1 }]\n}\n';
  const once = withLevel(text, 'beginner');
  expect(once).toBe('{\n  "topic": "Knots",\n  "student_level": "intermediate",\n  "level": "beginner",\n  "lessons": [{ "lesson": 1 }]\n}\n');
  expect(withLevel(once, 'advanced')).toBe(once.replace('"beginner"', '"advanced"')); // a rerun replaces, never duplicates
  const both = JSON.parse(withLevel(text, 'beginner', ['curiosity', 'string']));
  expect(both).toMatchObject({ level: 'beginner', prerequisites: ['curiosity', 'string'], lessons: [{ lesson: 1 }] });
});

it('replaces an empty prerequisites field instead of adding a second one', async () => {
  const { withLevel } = await import('../scripts/backfill-topic-levels.js');
  const empty = '{\n  "topic": "Knots",\n  "student_level": "intermediate",\n  "prerequisites": [],\n  "lessons": []\n}\n';
  const out = withLevel(empty, 'beginner', ['curiosity']);
  expect(out.match(/"prerequisites"/g)).toHaveLength(1);
  expect(JSON.parse(out).prerequisites).toEqual(['curiosity']);
  const blank = '{\n  "topic": "Knots",\n  "student_level": "intermediate",\n  "prerequisites": [\n    ""\n  ],\n  "lessons": []\n}\n';
  expect(JSON.parse(withLevel(blank, 'beginner', ['string'])).prerequisites).toEqual(['string']);
});

// Codex on #258: a new topic's first, quick build is what the Topics tab shows until the full one lands.
import { generateQuickStart } from '../lib/core/quick-start.js';
const quick = (extra) => {
  const adapter = { generate: async () => ({ text: JSON.stringify({ taster: 't', roadmap: 'r', quickCurriculum: Array.from({ length: 5 }, (_, i) => ({ title: `L${i + 1}` })), ...extra }) }) };
  return generateQuickStart({ adapter, skills: new Map(), topic: 'Knots', slug: 'knots', research: async () => ({}), wikipedia: async () => null });
};

it('gives a new topic its level and prerequisites from the quick build', async () => {
  const { curriculum } = await quick({ level: 'beginner', prerequisites: ['curiosity', ' ', 7, 'string'] });
  expect(curriculum).toMatchObject({ level: 'beginner', prerequisites: ['curiosity', 'string'] });
});

it('leaves out a level or prerequisites the model got wrong', async () => {
  const { curriculum } = await quick({ level: 'expert', prerequisites: 'algebra' });
  expect(curriculum).not.toHaveProperty('level');
  expect(curriculum).not.toHaveProperty('prerequisites');
});

// Codex on #258: publishing the full build must not lose the quick build's valid level and prerequisites.
it('keeps the quick build\'s level and prerequisites when the full build has no valid ones', async () => {
  const { preserveStarterLessons } = await import('../lib/core/topic-builds.js');
  const starter = { level: 'beginner', prerequisites: ['curiosity'], lessons: [{ title: 'Loops' }] };
  const kept = preserveStarterLessons(starter, { topic: 'Knots', level: 'expert', prerequisites: 'algebra', lessons: [{ title: 'Braids' }] });
  expect(kept).toMatchObject({ topic: 'Knots', level: 'beginner', prerequisites: ['curiosity'] });
  expect(kept.lessons.map((l) => l.title)).toEqual(['Loops', 'Braids']);
  const replaced = preserveStarterLessons(starter, { topic: 'Knots', level: 'advanced', prerequisites: ['topology'], lessons: [] });
  expect(replaced).toMatchObject({ level: 'advanced', prerequisites: ['topology'] });
  const neither = preserveStarterLessons({ lessons: [] }, { topic: 'Knots', level: 7, prerequisites: [''], lessons: [] });
  expect(neither).not.toHaveProperty('level');
  expect(neither).not.toHaveProperty('prerequisites');
});

// Codex on #258: Telegram publishes through CurriculumPipeline.run(), never preserveStarterLessons.
it.each(['deterministic', 'agentic'])('a %s pipeline run keeps the quick build\'s valid level and prerequisites', async (mode) => {
  const { CurriculumPipeline } = await import('../lib/core/pipeline.js');
  const reply = JSON.stringify({
    plan: 'PLAN', action: 'build', status: 'APPROVED', critique: '',
    curriculum: { topic: 'Knots', level: 'expert', prerequisites: '', lessons: [{ title: 'Loops' }] },
  });
  const written = [];
  const state = {
    readCurriculum: () => ({ level: 'beginner', prerequisites: ['curiosity'], lessons: [{ title: 'Loops' }] }),
    writeCurriculum: (_slug, c) => written.push(structuredClone(c)),
    writeDomainFile() {},
  };
  const adapter = { generate: async () => ({ text: reply, model: 'fake' }) };
  await new CurriculumPipeline({ adapter, state, skills: { get: () => '' }, mode }).run('Knots', 'knots', 'intermediate', 'sources').catch(() => {});
  expect(written.length).toBeGreaterThan(0);
  for (const c of written) expect(c).toMatchObject({ level: 'beginner', prerequisites: ['curiosity'] });
});

// The level is derived in code from each prerequisite's judged kind, so the rubric is a rule, not a mood.
it('derives the level from the hardest prerequisite', async () => {
  const { levelFrom } = await import('../scripts/backfill-topic-levels.js');
  expect(levelFrom(['general', 'general'])).toBe('beginner');
  expect(levelFrom(['general', 'school'])).toBe('intermediate');
  expect(levelFrom(['school', 'university', 'general'])).toBe('advanced');
  expect(levelFrom([])).toBeNull();
  expect(levelFrom(['general', 'expert'])).toBeNull(); // an unknown kind is a failed answer, never a guess
});

// Whether a prerequisite is university-level is a listed rule, not the model's call.
it('counts a prerequisite as university-level only when it names a listed university subject', async () => {
  const { kindOf } = await import('../scripts/backfill-topic-levels.js');
  expect(kindOf('real analysis (sequences, continuity)', 'school')).toBe('university');
  expect(kindOf('basic linear algebra (eigenvalues)', 'general')).toBe('university');
  expect(kindOf('proof techniques (induction, contradiction)', 'school')).toBe('university');
  expect(kindOf('basic neuroscience (neurons, brain regions)', 'university')).toBe('school');
  expect(kindOf('art history fundamentals', 'university')).toBe('school');
  expect(kindOf('basic chemistry (organic chemistry helpful)', 'school')).toBe('school'); // optional never counts
  expect(kindOf('reading comprehension', 'general')).toBe('general');
  expect(kindOf('basic programming (loops, functions, data structures)', 'school')).toBe('school'); // examples don't decide
});

// One rule everywhere (#251 review): advanced exactly when a prerequisite names a listed university subject.
it('rates every shipped topic advanced exactly when a prerequisite is university-level', async () => {
  const { isUniversity } = await import('../lib/core/quick-start.js');
  const wrong = shipped.filter((slug) => {
    const c = read(slug);
    return (c.level === 'advanced') !== c.prerequisites.some(isUniversity);
  });
  expect(wrong).toEqual([]);
});

it('keeps a parenthesis that names the course, and drops examples after an introductory phrase', async () => {
  const { isUniversity } = await import('../lib/core/quick-start.js');
  expect(isUniversity('derivatives and optimization (calculus I)')).toBe(true);
  expect(isUniversity('basic programming (loops, functions, data structures)')).toBe(false);
  expect(isUniversity('basic chemistry (organic chemistry helpful)')).toBe(false);
});

it('holds generated levels to the same rule', async () => {
  const { topicMeta } = await import('../lib/core/quick-start.js');
  expect(topicMeta({ level: 'intermediate', prerequisites: ['calculus'] }).level).toBe('advanced');
  expect(topicMeta({ level: 'advanced', prerequisites: ['basic algebra'] }).level).toBe('intermediate');
  expect(topicMeta({ level: 'beginner', prerequisites: ['curiosity'] }).level).toBe('beginner');
});

it('lets "helpful" exclude only what it qualifies', async () => {
  const { isUniversity } = await import('../lib/core/quick-start.js');
  expect(isUniversity('linear algebra (tensor basics helpful)')).toBe(true);
  expect(isUniversity('organic chemistry helpful but not required')).toBe(false);
});

it('takes level and prerequisites from one source, never a mix', async () => {
  const { withTopicMeta } = await import('../lib/core/quick-start.js');
  const quick = { level: 'beginner', prerequisites: ['curiosity'] };
  expect(withTopicMeta({ level: 'nope', prerequisites: ['calculus'] }, quick)).toMatchObject(quick);
  expect(withTopicMeta({ level: 'advanced', prerequisites: 'calculus' }, quick)).toMatchObject(quick);
  expect(withTopicMeta({ level: 'advanced', prerequisites: ['calculus'] }, quick)).toMatchObject({ level: 'advanced', prerequisites: ['calculus'] });
  expect(withTopicMeta({ prerequisites: ['calculus'] }, {})).toEqual({ prerequisites: ['calculus'] }); // nothing complete: whatever is valid
});

it('reads "(optional but helpful)" as making the subject itself optional', async () => {
  const { isUniversity } = await import('../lib/core/quick-start.js');
  expect(isUniversity('differential equations (optional but helpful)')).toBe(false);
  expect(isUniversity('linear algebra (tensor basics helpful)')).toBe(true);
});

it('holds a generated beginner topic that names a school subject to intermediate', async () => {
  const { topicMeta } = await import('../lib/core/quick-start.js');
  expect(topicMeta({ level: 'beginner', prerequisites: ['basic algebra'] }).level).toBe('intermediate');
  expect(topicMeta({ level: 'beginner', prerequisites: ['reading comprehension', 'curiosity'] }).level).toBe('beginner');
});

it('rates no shipped topic beginner that names a school subject', async () => {
  const { isSchool } = await import('../lib/core/quick-start.js');
  const wrong = shipped.filter((slug) => {
    const c = read(slug);
    return c.level === 'beginner' && c.prerequisites.some(isSchool);
  });
  expect(wrong).toEqual([]);
});

it('declares level and prerequisites in the quick-start response shape', async () => {
  const { buildQuickStartPrompt } = await import('../lib/core/quick-start.js');
  const { system } = buildQuickStartPrompt(new Map(), 'Knots', 'intermediate', null, '');
  expect(system).toMatch(/Return only JSON with taster, roadmap, quickCurriculum, level and prerequisites/);
});
