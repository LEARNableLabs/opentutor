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

// What completeLesson writes: the practitioner's own formatter, with the GOAL every evaluation carries.
const FEEDBACK = formatPracticeFeedback({
  timestamp: '2026-09-24T00:00:00.000Z',
  observations: [],
  directives: [
    { type: 'BLOCK', target: 'dominant-strategy', reason: 'BLOCK advancement until retested', priority: 'critical' },
    { type: 'REVISIT', target: 'nash-equilibrium', reason: 'flagged as shaky 3 lessons ago', priority: 'high' },
    { type: 'GOAL', target: 'required', reason: 'Every lesson must open with an explicit goal', priority: 'standard' },
  ],
  model: { recentAccuracy: 0.5, trend: 'steady', difficulty: { level: 3, label: 'standard' }, engagement: 'steady', concepts: { shaky: [] } },
}, 'Demo');

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
  async function planPrompt() {
    const adapter = { generate: vi.fn(async () => ({ text: JSON.stringify(PLAN) })) };
    const { status } = await lessonTurn({ state: wrap(store), adapter, skills: new Map() }, { topicSlug: 'demo' });
    expect(status).toBe(200);
    return adapter.generate.mock.calls[0][0];
  }
  const directivesSection = (system) => system.match(/<untrusted_data type="practice-directives">([\s\S]*?)<\/untrusted_data>/)?.[1];

  it('gets the domain files and the profile as text, never a Promise', async () => {
    const system = await planPrompt();
    expect(system).not.toContain('[object Promise]');
    for (const text of ['TEACHER-CONFIG', 'TEACHING-NOTES', 'CONCEPT-MAP', 'STUDENT-PROFILE']) expect(system).toContain(text);
  });

  it('gets the REVISIT and BLOCK concepts from practice-feedback.md', async () => {
    store.writeDomainFile('demo', 'practice-feedback.md', FEEDBACK);
    const section = directivesSection(await planPrompt());
    expect(section).toContain('nash-equilibrium');
    expect(section).toContain('dominant-strategy');
    expect(section).not.toContain('GOAL');
  });

  it('leaves the directives out when there is no feedback yet', async () => {
    expect(directivesSection(await planPrompt())).toBeUndefined();
  });
});
