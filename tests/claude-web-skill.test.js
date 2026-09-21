import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

// #60 — Claude Web has no filesystem, so OpenTutor shipped as a ten-file manual
// upload checklist plus a paste-this instruction block. It is now one .skill
// bundle the student drags into a project.
//
// A committed archive rots: someone improves references/teaching-method.md and
// the bundle keeps shipping last month's pedagogy, silently. These tests unzip
// the committed artifact and diff it against the sources it was built from, so
// a stale bundle fails CI rather than reaching a student.

const REPO = path.resolve('.');
const BUNDLE = path.join(REPO, 'claude-web', 'opentutor.skill');

const read = (entry) => {
  const r = spawnSync('unzip', ['-p', BUNDLE, entry], { encoding: 'buffer', maxBuffer: 10 << 20 });
  if (r.status !== 0) throw new Error(`missing from bundle: ${entry}`);
  return r.stdout.toString('utf-8');
};

const listed = () =>
  spawnSync('unzip', ['-Z1', BUNDLE], { encoding: 'utf-8' }).stdout.trim().split('\n');

// Every file that must be inside, mapped to the source of truth on disk.
const CONTENTS = {
  'opentutor/SKILL.md': 'claude-web/SKILL.md',
  'opentutor/references/teaching-method.md': 'skills/tutor/references/teaching-method.md',
  'opentutor/references/lesson-delivery.md': 'skills/tutor/references/lesson-delivery.md',
  'opentutor/references/curriculum-format.md': 'skills/tutor/references/curriculum-format.md',
  'opentutor/references/source-verification.md': 'skills/tutor/references/source-verification.md',
  'opentutor/references/onboarding.md': 'skills/tutor/references/onboarding.md',
  'opentutor/templates/domain-template.md': 'skills/tutor/templates/domain-template.md',
};

describe('the Claude Web skill bundle', () => {
  it('is committed, so a student can download it without cloning', () => {
    expect(fs.existsSync(BUNDLE)).toBe(true);
  });

  it('holds exactly the files the skill loader expects, and nothing else', () => {
    expect(listed().sort()).toEqual(Object.keys(CONTENTS).sort());
  });

  it.each(Object.entries(CONTENTS))('ships %s current with its source', (entry, source) => {
    expect(read(entry)).toBe(fs.readFileSync(path.join(REPO, source), 'utf-8'));
  });
});

describe('the bundled SKILL.md', () => {
  const skill = () => read('opentutor/SKILL.md');

  it('declares frontmatter a skill loader can parse', () => {
    const m = skill().match(/^---\n([\s\S]*?)\n---\n/);
    expect(m, 'SKILL.md must open with YAML frontmatter').not.toBeNull();
    expect(m[1]).toMatch(/^name: opentutor$/m);
    expect(m[1]).toMatch(/^description: /m);
  });

  it('points only at references it actually ships', () => {
    const shipped = new Set(Object.keys(CONTENTS).map((f) => f.replace('opentutor/', '')));
    const referenced = [...skill().matchAll(/`((?:references|templates)\/[\w-]+\.md)`/g)].map((m) => m[1]);

    expect(referenced.length, 'SKILL.md should route to its references').toBeGreaterThan(3);
    expect([...new Set(referenced)].filter((f) => !shipped.has(f))).toEqual([]);
  });

  it('tells the student to save learning.md back, which is the whole continuity story', () => {
    expect(skill()).toMatch(/learning\.md/);
    expect(skill()).toMatch(/project knowledge/i);
  });
});
