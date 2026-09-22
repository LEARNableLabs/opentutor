/**
 * Platform-agnostic state management.
 * All state is file-based — no database, no platform dependencies.
 * Paths are resolved from a configurable root directory.
 */

import fs from 'fs';
import path from 'path';
import { completionsFile, recordCompletion, readCurriculumWithProgress, withoutRuntimeFields, domainFilePath, seedFromTemplate, workspaceDir, assertUserId } from './progress.js';

export class TutorState {
  /**
   * @param {string} rootDir
   * @param {object} [options]
   * @param {string} [options.userId] - Scope every read and write to one student
   *   (#80). Omitted, this is the original single-user install and the layout is
   *   unchanged. Every path below hangs off `workspace`, so scoping that one
   *   value partitions progress, profile, memory, sessions, kv and completions.
   */
  constructor(rootDir, { userId = null } = {}) {
    this.root = rootDir;
    // Canonicalise once, here. Every store then derives its key and its paths
    // from the same string — the review found blank, falsy, numeric and
    // differently-cased ids each landing somewhere different otherwise.
    this.userId = userId == null ? null : assertUserId(userId);
    const workspace = workspaceDir(rootDir, this.userId);
    this.paths = {
      domains: path.join(rootDir, 'skills', 'tutor', 'domains'),
      workspace,
      progress: path.join(workspace, 'tutor', 'progress.json'),
      user: path.join(workspace, 'USER.md'),
      memory: path.join(workspace, 'memory'),
      sessions: path.join(workspace, 'sessions'),
    };

    for (const dir of [this.paths.workspace, this.paths.memory, this.paths.sessions,
      path.dirname(this.paths.progress)]) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // ── Key/value (lesson state for the web + webhook routes) ─

  _kvFile() {
    return path.join(this.paths.workspace, 'tutor', 'kv.json');
  }

  _kvAll() {
    try { return JSON.parse(fs.readFileSync(this._kvFile(), 'utf-8')); } catch { return {}; }
  }

  insertKV(key, value) { if(this.readKV(key)==null)this.writeKV(key,value); }
  listKV(prefix) { return Object.entries(this._kvAll()).filter(([key])=>key.startsWith(prefix)).map(([key,value])=>({key,value})); }

  readKV(key) {
    return this._kvAll()[key] ?? null;
  }

  writeKV(key, value) {
    const all = this._kvAll();
    all[key] = value;
    this._atomicWrite(this._kvFile(), JSON.stringify(all, null, 2) + '\n');
  }

  deleteKV(key) {
    const all = this._kvAll();
    delete all[key];
    this._atomicWrite(this._kvFile(), JSON.stringify(all, null, 2) + '\n');
  }

  // ── Progress ──────────────────────────────────────────────

  readProgress() {
    seedFromTemplate(this.paths.workspace, path.join('tutor', 'progress.json'), 'progress.json');
    try {
      return JSON.parse(fs.readFileSync(this.paths.progress, 'utf-8'));
    } catch {
      return { active_topics: [], schedule: {}, history: [], onboarding: null };
    }
  }

  writeProgress(data) {
    this._atomicWrite(this.paths.progress, JSON.stringify(data, null, 2) + '\n');
  }

  updateProgress(fn) {
    const data = this.readProgress();
    fn(data);
    this.writeProgress(data);
    return data;
  }

  // ── User profile ──────────────────────────────────────────

  readUser() {
    seedFromTemplate(this.paths.workspace, 'USER.md', 'USER.md');
    try { return fs.readFileSync(this.paths.user, 'utf-8'); }
    catch { return ''; }
  }

  writeUser(content) {
    fs.writeFileSync(this.paths.user, content);
  }

  // ── Curriculum ────────────────────────────────────────────

  readCurriculum(topicSlug) {
    return readCurriculumWithProgress(this.paths.domains, this.paths.workspace, topicSlug);
  }

  writeCurriculum(topicSlug, data) {
    const dir = path.join(this.paths.domains, topicSlug);
    fs.mkdirSync(dir, { recursive: true });
    this._atomicWrite(path.join(dir, 'curriculum.json'), JSON.stringify(withoutRuntimeFields(data), null, 2) + '\n');
  }

  getNextLesson(topicSlug) {
    const curriculum = this.readCurriculum(topicSlug);
    if (!curriculum) return null;
    return curriculum.lessons.find((l) => l.status === 'pending') || null;
  }

  markLessonComplete(topicSlug, day, engagement = {}) {
    recordCompletion(completionsFile(this.paths.workspace), topicSlug, day, engagement);
  }

  // ── Domain files ──────────────────────────────────────────

  readDomainFile(topicSlug, filename) {
    try { return fs.readFileSync(domainFilePath(this.paths.domains, this.paths.workspace, topicSlug, filename), 'utf-8'); }
    catch { return null; }
  }

  writeDomainFile(topicSlug, filename, content) {
    this._atomicWrite(domainFilePath(this.paths.domains, this.paths.workspace, topicSlug, filename), content);
  }

  // ── Memory ────────────────────────────────────────────────

  appendMemory(entry) {
    const date = new Date().toISOString().split('T')[0];
    const file = path.join(this.paths.memory, `${date}.md`);
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const line = `\n### ${timestamp}\n${entry}\n`;

    if (fs.existsSync(file)) {
      fs.appendFileSync(file, line);
    } else {
      fs.writeFileSync(file, `# ${date}\n${line}`);
    }
  }

  readRecentMemory(days = 2) {
    const entries = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = d.toISOString().split('T')[0];
      const file = path.join(this.paths.memory, `${date}.md`);
      try { entries.push(fs.readFileSync(file, 'utf-8')); }
      catch { /* no memory for this day */ }
    }
    return entries.join('\n\n---\n\n');
  }

  // ── Topics ────────────────────────────────────────────────

  listTopics() {
    try {
      return fs.readdirSync(this.paths.domains).filter((d) =>
        fs.existsSync(path.join(this.paths.domains, d, 'curriculum.json'))
      );
    } catch { return []; }
  }

  getTopicProgress(topicSlug) {
    const curriculum = this.readCurriculum(topicSlug);
    if (!curriculum) return null;
    const total = curriculum.lessons.length;
    const completed = curriculum.lessons.filter((l) => l.status === 'completed').length;
    const current = curriculum.lessons.find((l) => l.status === 'pending');
    return {
      topic: curriculum.topic,
      total,
      completed,
      percent: Math.round((completed / total) * 100),
      current,
    };
  }

  // ── Helpers ───────────────────────────────────────────────

  /** A store scoped to one student, for admin routes acting on their behalf (#80). */
  forStudent(userId) {
    return new this.constructor(this.root, { userId });
  }

  _atomicWrite(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const tmp = filePath + '.tmp';
    fs.writeFileSync(tmp, content);
    fs.renameSync(tmp, filePath);
  }
}
