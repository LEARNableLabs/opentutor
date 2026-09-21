#!/usr/bin/env node
/**
 * Build claude-web/opentutor.skill — the single file a student drags into a
 * Claude Project (#60).
 *
 * The bundle is committed so it can be downloaded from GitHub without cloning,
 * which means it can go stale. tests/claude-web-skill.test.js unzips it and
 * diffs it against these sources, so CI fails instead of a student getting last
 * month's pedagogy. Run `npm run build:claude-web-skill` after touching any of
 * the files below.
 *
 * Entries are timestamped to a fixed date and zipped with -X: identical inputs
 * give a byte-identical archive, so rebuilding does not churn a binary diff.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(REPO, 'claude-web', 'opentutor.skill');
const EPOCH = '202601010000.00';   // any fixed date; only reproducibility matters

const CONTENTS = {
  'opentutor/SKILL.md': 'claude-web/SKILL.md',
  'opentutor/references/teaching-method.md': 'skills/tutor/references/teaching-method.md',
  'opentutor/references/lesson-delivery.md': 'skills/tutor/references/lesson-delivery.md',
  'opentutor/references/curriculum-format.md': 'skills/tutor/references/curriculum-format.md',
  'opentutor/references/source-verification.md': 'skills/tutor/references/source-verification.md',
  'opentutor/references/onboarding.md': 'skills/tutor/references/onboarding.md',
  'opentutor/templates/domain-template.md': 'skills/tutor/templates/domain-template.md',
};

const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'opentutor-skill-'));
try {
  const entries = Object.keys(CONTENTS).sort();   // sorted: stable archive order
  for (const entry of entries) {
    const target = path.join(stage, entry);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(REPO, CONTENTS[entry]), target);
    execFileSync('touch', ['-t', EPOCH, target]);
  }

  fs.rmSync(OUT, { force: true });
  execFileSync('zip', ['-X', '-q', OUT, ...entries], { cwd: stage });

  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`built ${path.relative(REPO, OUT)} — ${entries.length} files, ${kb} KB`);
} finally {
  fs.rmSync(stage, { recursive: true, force: true });
}
