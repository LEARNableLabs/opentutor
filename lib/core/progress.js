/**
 * Per-student lesson completion.
 *
 * `skills/tutor/domains/<slug>/curriculum.json` is git-tracked *content* — the
 * lesson sequence everyone shares. Which lessons a particular student has
 * finished is *runtime state*, and lives here instead, so delivering a lesson
 * never dirties the repo (and two students can share an instance).
 *
 * Readers still see `lesson.status` / `lesson.engagement` on the curriculum
 * object: those fields are overlaid at read time by `applyCompletions`.
 *
 * Shape on disk: { "<slug>": { "<day>": { date, engagement } } }
 */

import fs from 'fs';
import path from 'path';

const RUNTIME_FIELDS = ['delivered', 'engagement'];

const today = () => new Date().toISOString().split('T')[0];
const asLabel = (engagement) => (typeof engagement === 'string' && engagement ? engagement : 'delivered');

/** Where a workspace keeps its completion state. */
export function completionsFile(workspaceDir) {
  return path.join(workspaceDir, 'tutor', 'completions.json');
}

export function readCompletions(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function writeCompletions(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

export function recordCompletion(file, slug, day, engagement) {
  const all = readCompletions(file);
  const topic = all[slug] || (all[slug] = {});
  topic[String(day)] = { date: today(), engagement: asLabel(engagement) };
  writeCompletions(file, all);
}

/** Overlay completion state onto a freshly-read curriculum. Mutates and returns it. */
export function applyCompletions(curriculum, completions = {}) {
  for (const lesson of curriculum?.lessons || []) {
    const record = completions[String(lesson.day || lesson.lesson)];
    if (!record) continue;
    lesson.status = 'completed';
    lesson.delivered = record.date;
    if (record.engagement) lesson.engagement = record.engagement;
  }
  return curriculum;
}

/**
 * Older curricula carry completion baked into the content file. Lift it out so a
 * student's existing progress survives the move, then the content can be cleaned.
 * Returns null when there is nothing to migrate.
 */
export function migrateCompletionsFromContent(file, slug, curriculum) {
  const existing = readCompletions(file);
  if (existing[slug]) return null;

  const lifted = {};
  for (const lesson of curriculum?.lessons || []) {
    if (lesson.status !== 'completed') continue;
    lifted[String(lesson.day || lesson.lesson)] = {
      date: lesson.delivered || today(),
      engagement: asLabel(lesson.engagement),
    };
  }
  if (!Object.keys(lifted).length) return null;

  existing[slug] = lifted;
  writeCompletions(file, existing);
  return lifted;
}

/**
 * Persist the completion state currently overlaid on a curriculum — used when a
 * lesson's grade changes after the fact (e.g. a concept is re-graded after review).
 */
export function saveCompletions(file, slug, curriculum) {
  const all = readCompletions(file);
  const topic = all[slug] || (all[slug] = {});
  for (const lesson of curriculum?.lessons || []) {
    if (lesson.status !== 'completed') continue;
    const key = String(lesson.day || lesson.lesson);
    topic[key] = {
      date: lesson.delivered || topic[key]?.date || today(),
      engagement: asLabel(lesson.engagement),
    };
  }
  writeCompletions(file, all);
}

/** A copy of the curriculum with runtime state removed, for writing back to content. */
export function withoutRuntimeFields(curriculum) {
  const copy = structuredClone(curriculum);
  for (const lesson of copy?.lessons || []) {
    lesson.status = 'pending';
    for (const field of RUNTIME_FIELDS) delete lesson[field];
  }
  return copy;
}

/** Read content from disk, migrate any baked-in completion, and overlay. */
export function readCurriculumWithProgress(domainsDir, workspaceDir, slug) {
  let curriculum;
  try {
    curriculum = JSON.parse(fs.readFileSync(path.join(domainsDir, slug, 'curriculum.json'), 'utf-8'));
  } catch {
    return null;
  }
  const file = completionsFile(workspaceDir);
  migrateCompletionsFromContent(file, slug, curriculum);
  return applyCompletions(curriculum, readCompletions(file)[slug]);
}
