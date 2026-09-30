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
