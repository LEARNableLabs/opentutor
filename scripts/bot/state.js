/**
 * State management — read/write progress.json, USER.md, curriculum, memory.
 * All state is file-based. No database.
 */

import fs from 'fs';
import path from 'path';
import { PATHS } from './config.js';

// ── Progress ────────────────────────────────────────────────

const DEFAULT_PROGRESS = {
  active_topics: [],
  schedule: { times: ['09:00', '13:00', '19:00'], timezone: 'America/New_York', paused: false },
  history: [],
  onboarding: null,
};

export function readProgress() {
  try {
    return JSON.parse(fs.readFileSync(PATHS.progress, 'utf-8'));
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function writeProgress(data) {
  fs.mkdirSync(path.dirname(PATHS.progress), { recursive: true });
  const tmp = PATHS.progress + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, PATHS.progress);
}

export function updateProgress(fn) {
  const data = readProgress();
  fn(data);
  writeProgress(data);
  return data;
}

// ── User profile ────────────────────────────────────────────

export function readUser() {
  try {
    return fs.readFileSync(PATHS.user, 'utf-8');
  } catch {
    return '';
  }
}

export function writeUser(content) {
  fs.writeFileSync(PATHS.user, content);
}

// ── Curriculum ──────────────────────────────────────────────

export function readCurriculum(topicSlug) {
  const p = path.join(PATHS.domains, topicSlug, 'curriculum.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

export function writeCurriculum(topicSlug, data) {
  const dir = path.join(PATHS.domains, topicSlug);
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, 'curriculum.json');
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, p);
}

export function getNextLesson(topicSlug) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) return null;
  return curriculum.lessons.find((l) => l.status === 'pending') || null;
}

export function markLessonComplete(topicSlug, day, engagement = {}) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) return;
  const lesson = curriculum.lessons.find((l) => l.day === day);
  if (lesson) {
    lesson.status = 'completed';
    lesson.delivered = new Date().toISOString().split('T')[0];
    if (engagement) lesson.engagement = engagement;
  }
  writeCurriculum(topicSlug, curriculum);
}

// ── Domain resources ────────────────────────────────────────

export function readDomainFile(topicSlug, filename) {
  const p = path.join(PATHS.domains, topicSlug, filename);
  try {
    return fs.readFileSync(p, 'utf-8');
  } catch {
    return null;
  }
}

// ── Memory ──────────────────────────────────────────────────

export function appendMemory(entry) {
  const date = new Date().toISOString().split('T')[0];
  const file = path.join(PATHS.memory, `${date}.md`);
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  const line = `\n### ${timestamp}\n${entry}\n`;

  if (fs.existsSync(file)) {
    fs.appendFileSync(file, line);
  } else {
    fs.writeFileSync(file, `# ${date}\n${line}`);
  }
}

export function readRecentMemory(days = 2) {
  const entries = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split('T')[0];
    const file = path.join(PATHS.memory, `${date}.md`);
    try {
      entries.push(fs.readFileSync(file, 'utf-8'));
    } catch {
      // no memory for this day
    }
  }
  return entries.join('\n\n---\n\n');
}

// ── Topics ──────────────────────────────────────────────────

export function listTopics() {
  try {
    return fs.readdirSync(PATHS.domains).filter((d) => {
      return fs.existsSync(path.join(PATHS.domains, d, 'curriculum.json'));
    });
  } catch {
    return [];
  }
}

export function getTopicProgress(topicSlug) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) return null;
  const total = curriculum.lessons.length;
  const completed = curriculum.lessons.filter((l) => l.status === 'completed').length;
  const current = curriculum.lessons.find((l) => l.status === 'pending');
  return { topic: curriculum.topic, total, completed, percent: Math.round((completed / total) * 100), current };
}
