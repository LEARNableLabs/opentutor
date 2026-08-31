#!/usr/bin/env node
/**
 * Batch-generate teacher.md for domains that lack one.
 * Extracts domain-intrinsic teaching config from existing files:
 *   - curriculum.json → exercise types, difficulty curve
 *   - teaching-notes.md → failure modes, engagement hooks
 *   - resources.md → resource type distribution
 *
 * No LLM calls — deterministic extraction.
 * Usage: node scripts/generate-teacher-md.js [--force] [--slug topic-slug]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAINS_DIR = path.resolve(__dirname, '..', 'skills', 'tutor', 'domains');

const force = process.argv.includes('--force');
const slugFilter = process.argv.find((a, i) => process.argv[i - 1] === '--slug');

const domains = fs.readdirSync(DOMAINS_DIR).filter((d) => {
  if (slugFilter && d !== slugFilter) return false;
  const dir = path.join(DOMAINS_DIR, d);
  if (!fs.statSync(dir).isDirectory()) return false;
  if (!fs.existsSync(path.join(dir, 'curriculum.json'))) return false;
  if (!force && fs.existsSync(path.join(dir, 'teacher.md'))) return false;
  return true;
});

console.log(`Generating teacher.md for ${domains.length} domains...`);

let generated = 0;
let skipped = 0;

for (const slug of domains) {
  try {
    const dir = path.join(DOMAINS_DIR, slug);
    const teacher = generateTeacherMd(dir, slug);
    fs.writeFileSync(path.join(dir, 'teacher.md'), teacher);
    generated++;
  } catch (err) {
    console.error(`  SKIP ${slug}: ${err.message}`);
    skipped++;
  }
}

console.log(`Done: ${generated} generated, ${skipped} skipped`);

function generateTeacherMd(dir, slug) {
  const curriculum = JSON.parse(fs.readFileSync(path.join(dir, 'curriculum.json'), 'utf-8'));
  const teachingNotes = readOpt(path.join(dir, 'teaching-notes.md'));
  const resources = readOpt(path.join(dir, 'resources.md'));

  const topic = curriculum.topic || slug.replace(/-/g, ' ');

  // Exercise types from lesson type distribution
  const typeCounts = {};
  const diffCounts = {};
  for (const l of curriculum.lessons || []) {
    typeCounts[l.type] = (typeCounts[l.type] || 0) + 1;
    diffCounts[l.difficulty] = (diffCounts[l.difficulty] || 0) + 1;
  }
  const exerciseTypes = describeExerciseTypes(typeCounts);

  // Resource types from resources.md headers
  const resourceTypes = describeResourceTypes(resources);

  // Difficulty curve from lesson progression
  const difficultyCurve = describeDifficultyCurve(curriculum.lessons || [], diffCounts);

  // Engagement hooks from teaching notes
  const hooks = extractSection(teachingNotes, 'Rabbit Holes', 'Fascinating');

  // Failure modes from teaching notes
  const failures = extractSection(teachingNotes, 'Common Misconceptions', 'Misconception');

  // Vocabulary from concepts
  const concepts = [...new Set((curriculum.lessons || []).flatMap((l) => l.concepts || []))];

  return [
    `# ${topic} — Domain Teaching Config`,
    '',
    '## Exercise Types',
    exerciseTypes,
    '',
    '## Resource Types',
    resourceTypes,
    '',
    '## Difficulty Curve',
    difficultyCurve,
    '',
    '## Domain Hooks',
    hooks || `This field covers ${topic.toLowerCase()}, with applications across theory and practice.`,
    '',
    '## Common Failure Modes',
    failures || 'Students often struggle with the foundational concepts before building to more advanced material. Reinforce basics before progressing.',
    '',
    '## Vocabulary',
    concepts.length > 0
      ? `Key terms for this domain: ${concepts.slice(0, 15).join(', ')}${concepts.length > 15 ? ` (and ${concepts.length - 15} more)` : ''}.`
      : 'Use standard domain terminology, defining specialized terms on first use.',
  ].join('\n');
}

function describeExerciseTypes(typeCounts) {
  const total = Object.values(typeCounts).reduce((a, b) => a + b, 0);
  if (!total) return 'Standard mix of lesson types.';

  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0];
  const descriptions = {
    'mini-lesson': 'concept-focused mini-lessons',
    question: 'Socratic questions',
    'resource-drop': 'curated resource exploration',
    'teach-back': 'teach-back exercises (student explains)',
    'real-world': 'real-world application challenges',
    review: 'review and consolidation sessions',
  };

  const lines = sorted.map(([type, count]) => {
    const pct = Math.round((count / total) * 100);
    return `- **${descriptions[type] || type}** — ${count} lessons (${pct}%)`;
  });

  return `This domain uses a mix of delivery formats:\n${lines.join('\n')}\n\nPrimary format: ${descriptions[primary[0]] || primary[0]}.`;
}

function describeResourceTypes(resources) {
  if (!resources) return 'Use a balanced mix of textbooks, videos, and interactive tools.';

  const types = [];
  if (/textbook|book/i.test(resources)) types.push('textbooks');
  if (/video|youtube|lecture/i.test(resources)) types.push('video lectures');
  if (/interactive|tool|simulator|desmos/i.test(resources)) types.push('interactive tools');
  if (/paper|arxiv|journal/i.test(resources)) types.push('academic papers');
  if (/github|repo|code/i.test(resources)) types.push('code repositories');
  if (/course|coursera|edx|ocw/i.test(resources)) types.push('online courses');

  if (!types.length) return 'Use a balanced mix of textbooks, videos, and interactive tools.';
  return `This domain has strong coverage in: ${types.join(', ')}. Prioritize these when recommending resources.`;
}

function describeDifficultyCurve(lessons, diffCounts) {
  if (!lessons.length) return 'Standard progressive difficulty.';

  const total = lessons.length;
  const easy = (diffCounts[1] || 0) + (diffCounts[2] || 0);
  const mid = diffCounts[3] || 0;
  const hard = (diffCounts[4] || 0) + (diffCounts[5] || 0);

  const easyPct = Math.round((easy / total) * 100);
  const hardPct = Math.round((hard / total) * 100);

  let shape;
  if (easyPct > 50) shape = 'Gentle ramp — heavily front-loaded with accessible material before increasing complexity.';
  else if (hardPct > 40) shape = 'Steep curve — significant challenge in the second half. Consolidation points are critical.';
  else shape = 'Balanced progression — steady difficulty increase with regular consolidation.';

  const peaks = lessons
    .filter((l) => l.difficulty >= 4)
    .map((l) => `Day ${l.lesson || l.day}: "${l.title}" (difficulty ${l.difficulty})`);

  let result = `${shape}\n\nDistribution: ${easyPct}% accessible (1-2), ${Math.round((mid / total) * 100)}% standard (3), ${hardPct}% challenging (4-5).`;
  if (peaks.length > 0) {
    result += `\n\nDifficulty peaks:\n${peaks.slice(0, 5).map((p) => `- ${p}`).join('\n')}`;
  }
  return result;
}

function extractSection(text, ...keywords) {
  if (!text) return null;
  for (const kw of keywords) {
    const pattern = new RegExp(`##\\s*.*${kw}.*\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = text.match(pattern);
    if (match) return match[1].trim().slice(0, 1000);
  }
  return null;
}

function readOpt(filePath) {
  try { return fs.readFileSync(filePath, 'utf-8'); }
  catch { return null; }
}
