/**
 * State management — read/write progress.json, USER.md, curriculum, memory.
 * All state is file-based. No database.
 */

import fs from 'fs';
import path from 'path';
import { PATHS } from './config.js';
import { log } from './logger.js';

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
  log.debug({ active_topics: data.active_topics }, 'progress written');
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
  log.info({ topic: topicSlug, lesson_count: data.lessons?.length }, 'curriculum written');
}

export function getNextLesson(topicSlug) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) return null;
  return curriculum.lessons.find((l) => l.status === 'pending') || null;
}

export function markLessonComplete(topicSlug, day, engagement = {}) {
  log.info({ topic: topicSlug, lesson_id: day }, 'lesson marked complete');
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

export function writeDomainFile(topicSlug, filename, content) {
  const dir = path.join(PATHS.domains, topicSlug);
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, filename);
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, p);
  log.debug({ topic: topicSlug, file: filename }, 'domain file written');
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

// ── Group state ────────────────────────────────────────────

const GROUPS_DIR = path.join(PATHS.workspace, 'groups');
const STUDENTS_DIR = path.join(PATHS.workspace, 'students');

export function isGroupChat(chatId, userId) {
  return chatId !== userId && chatId < 0;
}

export function readGroupConfig(chatId) {
  const p = path.join(GROUPS_DIR, `${chatId}`, 'config.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

export function writeGroupConfig(chatId, config) {
  const dir = path.join(GROUPS_DIR, `${chatId}`);
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, 'config.json');
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(config, null, 2) + '\n');
  fs.renameSync(tmp, p);
}

export function initGroup(chatId, topic) {
  const existing = readGroupConfig(chatId);
  if (existing) return existing;

  const config = {
    chatId,
    topic,
    createdAt: new Date().toISOString(),
    members: [],
    schedule: { paused: false },
  };
  writeGroupConfig(chatId, config);
  return config;
}

export function addGroupMember(chatId, userId, name) {
  const config = readGroupConfig(chatId) || initGroup(chatId, null);
  if (!config.members.find((m) => m.userId === userId)) {
    config.members.push({
      userId,
      name: name || `User ${userId}`,
      joinedAt: new Date().toISOString(),
      dmEnabled: false,
    });
    writeGroupConfig(chatId, config);
  }
  return config;
}

export function markMemberDmEnabled(chatId, userId) {
  const config = readGroupConfig(chatId);
  if (!config) return;
  const member = config.members.find((m) => m.userId === userId);
  if (member) {
    member.dmEnabled = true;
    writeGroupConfig(chatId, config);
  }
}

// ── Per-student state (for group context) ──────────────────

export function readStudentProgress(userId) {
  const p = path.join(STUDENTS_DIR, `${userId}`, 'progress.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return { userId, active_topics: [], history: [], exercises: {} };
  }
}

export function writeStudentProgress(userId, data) {
  const dir = path.join(STUDENTS_DIR, `${userId}`);
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, 'progress.json');
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, p);
}

export function recordStudentExercise(userId, topicSlug, day, result) {
  const progress = readStudentProgress(userId);
  if (!progress.exercises) progress.exercises = {};
  progress.exercises[`${topicSlug}:${day}`] = {
    result,
    date: new Date().toISOString(),
  };
  writeStudentProgress(userId, progress);
}

export function getGroupStats(chatId) {
  const config = readGroupConfig(chatId);
  if (!config || !config.members.length) return null;

  const stats = {
    memberCount: config.members.length,
    exerciseResults: { correct: 0, incorrect: 0, total: 0 },
  };

  for (const member of config.members) {
    const progress = readStudentProgress(member.userId);
    for (const [, ex] of Object.entries(progress.exercises || {})) {
      stats.exerciseResults.total++;
      if (ex.result === 'correct') stats.exerciseResults.correct++;
      else if (ex.result === 'incorrect') stats.exerciseResults.incorrect++;
    }
  }

  return stats;
}
