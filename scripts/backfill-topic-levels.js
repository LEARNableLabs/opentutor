#!/usr/bin/env node
/**
 * Backfill `level` on the shipped curricula (#251), and `prerequisites` where a curriculum
 * has none. One cheap model call per topic. Only those lines change, so each file keeps
 * its formatting, and a file that already has a valid level is skipped.
 *
 * Usage: node --env-file=<env> scripts/backfill-topic-levels.js [--force] [--slug topic-slug] [--only level] [--audit file.json]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createAdapterFromEnv } from '../lib/adapters/index.js';
import { parseFirstJson } from '../lib/core/json.js';

const DOMAINS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'tutor', 'domains');
export const LEVELS = ['beginner', 'intermediate', 'advanced'];

const KINDS = `Judge each prerequisite on its own, as one of three kinds:
- general: knowledge a curious adult already has, or picks up in the first lessons: reading and writing well, everyday arithmetic, general-culture familiarity ("basic geography", "basic literary terminology", "interest in the night sky"), patience, simple household tools.
- school: subject-specific background from secondary school or an introductory course, which many adults would have to refresh first ("basic algebra", "introductory biology", "cognitive psychology fundamentals", "basic programming", "general chemistry"), or a practical skill specific to the subject that a newcomer would not have ("basic forging techniques", "using planes and chisels", "a cube-solving method", "hand-sewing").
- university: university-level background in a related field ("calculus", "linear algebra", "proof techniques", "organic chemistry", "quantum mechanics", "constitutional law", "a prior university course in the discipline").
A prerequisite described as "basic", "introductory" or "fundamentals" of a school subject is school, never university.`;

/** The course level from its prerequisites' kinds: the hardest one decides (#251). */
export function levelFrom(kinds) {
  if (!kinds.length || kinds.some((k) => !['general', 'school', 'university'].includes(k))) return null;
  return kinds.includes('university') ? 'advanced' : kinds.includes('school') ? 'intermediate' : 'beginner';
}

/** The curriculum text with `level` (and `prerequisites`, if given) set right after `student_level`. */
export function withLevel(text, level, prerequisites) {
  const anchor = text.match(/^( +)"student_level": "[^"]*",\n/m);
  if (!anchor) throw new Error('no "student_level" line to anchor on');
  const ind = anchor[1];
  // Only a top-level "level" (the anchor's indent) is ours to replace; a lesson may have its own.
  text = text.replace(new RegExp(`^${ind}"level": "[^"]*",\\n`, 'm'), '');
  // New prerequisites replace an empty or blank field, on one line or several; never a second key.
  if (prerequisites) text = text.replace(new RegExp(`^${ind}"prerequisites": (?:\\[\\n[\\s\\S]*?\\n${ind}\\]|[^\\n]*?),?\\n`, 'm'), '');
  let insert = `${ind}"level": ${JSON.stringify(level)},\n`;
  if (prerequisites)
    insert += `${ind}"prerequisites": [\n${prerequisites.map((p) => ind + ind + JSON.stringify(p)).join(',\n')}\n${ind}],\n`;
  const at = anchor.index + anchor[0].length;
  return text.slice(0, at) + insert + text.slice(at);
}

async function classify(adapter, c) {
  const listed = Array.isArray(c.prerequisites) ? c.prerequisites.filter((p) => typeof p === 'string' && p.trim()) : [];
  const system = [
    'You judge what a self-study course needs a learner to know first.',
    KINDS,
    listed.length
      ? 'Answer with JSON only: {"kinds": ["general" | "school" | "university", one per prerequisite, in the order given]}'
      : 'The course lists no prerequisites. Write 3 to 5 short ones a learner should know before starting, and judge each. Answer with JSON only: {"prerequisites": ["..."], "kinds": ["general" | "school" | "university", one per prerequisite]}',
  ].join('\n\n');
  const lessons = (c.lessons || []).slice(0, 40).map((l) => `- ${l.title}`).join('\n');
  const user = `Course: ${c.topic}\nPrerequisites:\n${listed.length ? listed.map((p, i) => `${i + 1}. ${p}`).join('\n') : '(none listed)'}\nLessons:\n${lessons}`;
  const { text } = await adapter.generate(system, [{ role: 'user', content: user }], { model: 'cheap', maxTokens: 400, timeout: 60_000 });
  const out = parseFirstJson(text);
  const prerequisites = listed.length
    ? listed
    : Array.isArray(out?.prerequisites) ? out.prerequisites.filter((p) => typeof p === 'string' && p.trim()).map((p) => p.trim()) : [];
  const kinds = Array.isArray(out?.kinds) ? out.kinds : [];
  if (!prerequisites.length || kinds.length !== prerequisites.length) throw new Error(`kinds do not match the prerequisites: ${String(text).slice(0, 120)}`);
  const level = levelFrom(kinds);
  if (!level) throw new Error(`no valid kinds in: ${String(text).slice(0, 120)}`);
  return listed.length ? { level, kinds } : { level, kinds, prerequisites };
}

async function main() {
  const force = process.argv.includes('--force');
  const slugFilter = process.argv.find((a, i) => process.argv[i - 1] === '--slug');
  const only = process.argv.find((a, i) => process.argv[i - 1] === '--only'); // re-rate just one level's topics
  const auditFile = process.argv.find((a, i) => process.argv[i - 1] === '--audit'); // each topic's prerequisite kinds
  const audit = {};
  const adapter = createAdapterFromEnv();
  const todo = fs.readdirSync(DOMAINS_DIR).filter((slug) => {
    if (slugFilter && slug !== slugFilter) return false;
    const file = path.join(DOMAINS_DIR, slug, 'curriculum.json');
    if (!fs.existsSync(file)) return false;
    const { level } = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (only && level !== only) return false;
    return force || only || !LEVELS.includes(level); // --only re-rates that level's topics
  });
  console.log(`Rating ${todo.length} topics...`);
  let done = 0;
  const failed = [];
  const worker = async () => {
    for (let slug; (slug = todo.shift()); ) {
      const file = path.join(DOMAINS_DIR, slug, 'curriculum.json');
      try {
        const text = fs.readFileSync(file, 'utf8');
        const { level, prerequisites, kinds } = await classify(adapter, JSON.parse(text));
        audit[slug] = { level, kinds };
        const next = withLevel(text, level, prerequisites);
        JSON.parse(next); // never write a file that no longer parses
        fs.writeFileSync(file, next);
        done++;
      } catch (err) {
        failed.push(slug);
        console.error(`  SKIP ${slug}: ${err.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  const counts = {};
  for (const slug of fs.readdirSync(DOMAINS_DIR)) {
    const file = path.join(DOMAINS_DIR, slug, 'curriculum.json');
    if (fs.existsSync(file)) {
      const level = JSON.parse(fs.readFileSync(file, 'utf8')).level ?? 'none';
      counts[level] = (counts[level] || 0) + 1;
    }
  }
  if (auditFile) fs.writeFileSync(auditFile, JSON.stringify(audit, null, 2) + '\n');
  console.log(`Done: ${done} rated, ${failed.length} failed${failed.length ? ` (${failed.join(', ')})` : ''}`);
  console.log('Levels now:', counts);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
