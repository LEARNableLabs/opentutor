#!/usr/bin/env node
/**
 * Backfill `level` on the shipped curricula (#251), and `prerequisites` where a curriculum
 * has none. One cheap model call per topic. Only those lines change, so each file keeps
 * its formatting, and a file that already has a valid level is skipped.
 *
 * Usage: node --env-file=<env> scripts/backfill-topic-levels.js [--force] [--slug topic-slug] [--only level]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createAdapterFromEnv } from '../lib/adapters/index.js';
import { parseFirstJson } from '../lib/core/json.js';

const DOMAINS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'tutor', 'domains');
export const LEVELS = ['beginner', 'intermediate', 'advanced'];

const RUBRIC = `Levels, for an adult studying on their own:
- beginner: anyone can start. The prerequisites are general knowledge a curious adult already has or picks up in the first lessons: reading and writing well, everyday arithmetic, general-culture familiarity (such as "basic geography", "basic literary terminology", "interest in the night sky"), or practical patience and simple tools. General knowledge like this is still beginner even when the list calls it "basic". But if any prerequisite is a skill or body of knowledge specific to the subject itself (prior forging technique, using planes and chisels, knowing a cube-solving method, hand-sewing technique, philatelic terminology, algebra, atmospheric science), the course is not beginner.
- intermediate: needs subject-specific background from secondary school or an introductory course, which many adults would have to refresh first: algebra, probability, trigonometry, introductory physics, chemistry or biology, basic programming, basic music theory, or an introductory course in a related field.
- advanced: needs university-level background in a related field before the first lesson, such as calculus, linear algebra, discrete mathematics with proofs, quantum or statistical mechanics, or a prior university course in the discipline. Choose it only when at least one prerequisite is at that level. Prerequisites that are introductory ("basic", "introductory", "general", "fundamentals" of a school subject) make a course intermediate, however specialised the subject sounds.
Judge by the prerequisites and what the lessons actually require, not by how serious the subject sounds.`;

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
  const needsPrereqs = !(Array.isArray(c.prerequisites) && c.prerequisites.some((p) => typeof p === 'string' && p.trim()));
  const system = [
    'You rate how hard a self-study course is.',
    RUBRIC,
    needsPrereqs
      ? 'Answer with JSON only: {"level": "beginner" | "intermediate" | "advanced", "prerequisites": ["3 to 5 short items a learner should know before starting"]}'
      : 'Answer with JSON only: {"level": "beginner" | "intermediate" | "advanced"}',
  ].join('\n\n');
  const lessons = (c.lessons || []).slice(0, 40).map((l) => `- ${l.title}`).join('\n');
  const user = `Course: ${c.topic}\nPrerequisites: ${needsPrereqs ? '(none listed)' : c.prerequisites.join('; ')}\nLessons:\n${lessons}`;
  const { text } = await adapter.generate(system, [{ role: 'user', content: user }], { model: 'cheap', maxTokens: 300, timeout: 60_000 });
  const out = parseFirstJson(text);
  if (!LEVELS.includes(out?.level)) throw new Error(`no valid level in: ${String(text).slice(0, 120)}`);
  if (!needsPrereqs) return { level: out.level };
  const prerequisites = Array.isArray(out.prerequisites) ? out.prerequisites.filter((p) => typeof p === 'string' && p.trim()).map((p) => p.trim()) : [];
  if (!prerequisites.length) throw new Error('no prerequisites returned');
  return { level: out.level, prerequisites };
}

async function main() {
  const force = process.argv.includes('--force');
  const slugFilter = process.argv.find((a, i) => process.argv[i - 1] === '--slug');
  const only = process.argv.find((a, i) => process.argv[i - 1] === '--only'); // re-rate just one level's topics
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
        const { level, prerequisites } = await classify(adapter, JSON.parse(text));
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
  console.log(`Done: ${done} rated, ${failed.length} failed${failed.length ? ` (${failed.join(', ')})` : ''}`);
  console.log('Levels now:', counts);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
