import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorStore } from '../lib/core/store.js';
import { formatPracticeFeedback } from '../lib/core/deliberate-practice.js';
import { lessonTurn } from '../api/lesson.js';

// #146 — the web lesson planner was handed the store and read it synchronously.
// SupabaseStore's reads are async, so on production every section it read was
// "[object Promise]". It also never read the directives each lesson writes to
// practice-feedback.md. Every test runs on the sync TutorStore (the local
// server) and on the same store with every method async (SupabaseStore's shape).

const PLAN = { goal: 'Explain alpha', diagnostic: 'Why alpha?', followUp: 'Example?', application: 'Apply it.', commonMisconceptions: [] };

const asAsync = (store) => new Proxy(store, {
  get: (target, key) => (typeof target[key] === 'function' ? async (...args) => target[key](...args) : target[key]),
});

const DIRECTIVES = {
  BLOCK: { type: 'BLOCK', target: 'dominant-strategy', reason: 'BLOCK advancement until retested', priority: 'critical' },
  REVISIT: { type: 'REVISIT', target: 'nash-equilibrium', reason: 'flagged as shaky 3 lessons ago', priority: 'high' },
  GOAL: { type: 'GOAL', target: 'required', reason: 'Every lesson must open with an explicit goal', priority: 'standard' },
};

// What completeLesson writes, from the practitioner's own formatter. Every real evaluation carries a GOAL.
const feedback = (...types) => formatPracticeFeedback({
  timestamp: '2026-09-24T00:00:00.000Z',
  observations: [],
  directives: types.map((t) => DIRECTIVES[t]),
  model: { recentAccuracy: 0.5, trend: 'steady', difficulty: { level: 3, label: 'standard' }, engagement: 'steady', concepts: { shaky: [] } },
}, 'Demo');

const retest = (concept) => `Before we start — what is ${concept} and why does it matter?`;

let root, store;

beforeEach(() => {
  vi.stubEnv('OPENTUTOR_DATA_DIR', '');
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-planner-'));
  const dir = path.join(root, 'skills', 'tutor', 'domains', 'demo');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'curriculum.json'), JSON.stringify({
    topic: 'Demo', lessons: [{ lesson: 1, module: 'Basics', title: 'Lesson 1', concepts: ['alpha'], status: 'pending' }],
  }));
  fs.writeFileSync(path.join(dir, 'teacher.md'), 'TEACHER-CONFIG: use payoff matrices');
  fs.writeFileSync(path.join(dir, 'teaching-notes.md'), 'TEACHING-NOTES: open with a story');
  fs.writeFileSync(path.join(dir, 'concept-map.md'), 'CONCEPT-MAP: alpha before beta');
  store = new TutorStore(root);
  store.writeUser('STUDENT-PROFILE: prefers worked examples');
});

afterEach(() => {
  store.close();
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
});

describe.each([
  ['the sync TutorStore', (s) => s],
  ['an async store shaped like SupabaseStore', asAsync],
])('web lesson planner on %s', (_name, wrap) => {
  // Starts a lesson with the model answering `text`; returns the plan prompt it saw and the first message.
  async function start(text = JSON.stringify(PLAN)) {
    const adapter = { generate: vi.fn(async () => ({ text })) };
    const { status, body } = await lessonTurn({ state: wrap(store), adapter, skills: new Map() }, { topicSlug: 'demo' });
    expect(status).toBe(200);
    return { system: adapter.generate.mock.calls[0][0], reply: body.reply };
  }
  const directivesSection = (system) => system.match(/<untrusted_data type="practice-directives">([\s\S]*?)<\/untrusted_data>/)?.[1];

  it('gets the domain files and the profile as text, never a Promise', async () => {
    const { system } = await start();
    expect(system).not.toContain('[object Promise]');
    for (const text of ['TEACHER-CONFIG', 'TEACHING-NOTES', 'CONCEPT-MAP', 'STUDENT-PROFILE']) expect(system).toContain(text);
  });

  it('gets the REVISIT and BLOCK concepts from practice-feedback.md', async () => {
    store.writeDomainFile('demo', 'practice-feedback.md', feedback('BLOCK', 'REVISIT', 'GOAL'));
    const section = directivesSection((await start()).system);
    expect(section).toContain('nash-equilibrium');
    expect(section).toContain('dominant-strategy');
    expect(section).not.toContain('GOAL');
  });

  it('leaves the directives out when there is no feedback yet', async () => {
    expect(directivesSection((await start()).system)).toBeUndefined();
  });

  // The planner is asked to open on the retest, but nothing makes it: its plan
  // can leave `retrieval` out, and the fallback plan for unparseable JSON has none.
  it.each([
    ['a plan without one', JSON.stringify(PLAN)],
    ['no plan it can parse', 'Sorry, I cannot help with that.'],
  ])('asks the REVISIT retest when the model gives %s', async (_case, text) => {
    store.writeDomainFile('demo', 'practice-feedback.md', feedback('BLOCK', 'REVISIT', 'GOAL'));
    expect((await start(text)).reply).toContain(retest('nash-equilibrium'));
  });

  it('asks the BLOCK retest when there is no REVISIT', async () => {
    store.writeDomainFile('demo', 'practice-feedback.md', feedback('BLOCK', 'GOAL'));
    expect((await start()).reply).toContain(retest('dominant-strategy'));
  });

  it.each([
    ['no feedback yet', null],
    ['feedback with no REVISIT or BLOCK', feedback('GOAL')],
  ])('still opens on the diagnostic with %s', async (_case, md) => {
    if (md) store.writeDomainFile('demo', 'practice-feedback.md', md);
    expect((await start()).reply).toBe('**Goal:** Explain alpha\n\nWhy alpha?');
  });
});
