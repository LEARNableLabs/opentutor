/**
 * SQLite-backed state store — same interface as TutorState (file-based).
 * Durable, transactional, supports concurrent reads.
 *
 * Domain files (curriculum.json, concept-map.md, etc.) are still read from
 * disk — they're large markdown/JSON assets that belong in the repo.
 * SQLite stores runtime state: progress, sessions, jobs, student data.
 */

import fs from 'fs';
import path from 'path';
import { openDatabaseFromEnv } from './db.js';

export class TutorStore {
  constructor(rootDir) {
    this.root = rootDir;
    this.paths = {
      domains: path.join(rootDir, 'skills', 'tutor', 'domains'),
    };

    const dataDir = process.env.OPENTUTOR_DATA_DIR || rootDir;
    this.dataDir = dataDir;

    // Domain files still use workspace for portability
    fs.mkdirSync(path.join(dataDir, 'workspace', 'tutor'), { recursive: true });

    this.db = openDatabaseFromEnv(rootDir);

    // Prepared statements
    this._stmts = {
      getKV: this.db.prepare('SELECT value FROM kv WHERE key = ?'),
      setKV: this.db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)'),
      getSession: this.db.prepare('SELECT role, content FROM sessions WHERE chat_id = ? ORDER BY id DESC LIMIT ?'),
      appendSession: this.db.prepare('INSERT INTO sessions (chat_id, role, content) VALUES (?, ?, ?)'),
      clearSession: this.db.prepare('DELETE FROM sessions WHERE chat_id = ?'),
      appendMemory: this.db.prepare('INSERT INTO memory (date, time, entry) VALUES (?, ?, ?)'),
      getMemory: this.db.prepare('SELECT date, time, entry FROM memory WHERE date >= ? ORDER BY id'),
      enqueueJob: this.db.prepare('INSERT INTO jobs (type, payload) VALUES (?, ?)'),
      getPendingJobs: this.db.prepare("SELECT * FROM jobs WHERE status IN ('pending', 'running') ORDER BY id"),
      startJob: this.db.prepare("UPDATE jobs SET status = 'running', started_at = datetime('now') WHERE id = ?"),
      completeJob: this.db.prepare("UPDATE jobs SET status = 'completed', completed_at = datetime('now') WHERE id = ?"),
      failJob: this.db.prepare("UPDATE jobs SET status = 'failed', completed_at = datetime('now'), error = ? WHERE id = ?"),
      addGroupMember: this.db.prepare('INSERT OR REPLACE INTO group_members (chat_id, user_id, name) VALUES (?, ?, ?)'),
      getGroupMembers: this.db.prepare('SELECT * FROM group_members WHERE chat_id = ?'),
      recordExercise: this.db.prepare('INSERT OR REPLACE INTO student_exercises (user_id, slug, day, result) VALUES (?, ?, ?, ?)'),
    };
  }

  // ── Progress ──────────────────────────────────────────────

  readProgress() {
    const row = this._stmts.getKV.get('progress');
    if (row) return JSON.parse(row.value);
    return { active_topics: [], schedule: {}, history: [], onboarding: null };
  }

  writeProgress(data) {
    this._stmts.setKV.run('progress', JSON.stringify(data));
  }

  updateProgress(fn) {
    const data = this.readProgress();
    fn(data);
    this.writeProgress(data);
    return data;
  }

  // ── User profile ──────────────────────────────────────────

  readUser() {
    const row = this._stmts.getKV.get('user_profile');
    if (row) return row.value;
    const filePath = path.join(this.dataDir, 'workspace', 'USER.md');
    try { return fs.readFileSync(filePath, 'utf-8'); }
    catch { return ''; }
  }

  writeUser(content) {
    this._stmts.setKV.run('user_profile', content);
  }

  // ── Curriculum (read from disk, runtime state in SQLite) ──

  readCurriculum(topicSlug) {
    const p = path.join(this.paths.domains, topicSlug, 'curriculum.json');
    try { return JSON.parse(fs.readFileSync(p, 'utf-8')); }
    catch { return null; }
  }

  writeCurriculum(topicSlug, data) {
    const dir = path.join(this.paths.domains, topicSlug);
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, 'curriculum.json');
    const tmp = p + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
    fs.renameSync(tmp, p);
  }

  getNextLesson(topicSlug) {
    const curriculum = this.readCurriculum(topicSlug);
    if (!curriculum) return null;
    return curriculum.lessons.find((l) => l.status === 'pending') || null;
  }

  markLessonComplete(topicSlug, day, engagement = 'delivered') {
    const curriculum = this.readCurriculum(topicSlug);
    if (!curriculum) return;
    const lesson = curriculum.lessons.find((l) => (l.day || l.lesson) === day);
    if (lesson) {
      lesson.status = 'completed';
      lesson.delivered = new Date().toISOString().split('T')[0];
      if (engagement) lesson.engagement = engagement;
    }
    this.writeCurriculum(topicSlug, curriculum);

    this.updateProgress((p) => {
      if (!p.history) p.history = [];
      p.history.push({
        date: new Date().toISOString().split('T')[0],
        topic: topicSlug,
        lesson: day,
        engagement: typeof engagement === 'string' ? engagement : 'delivered',
      });
    });
  }

  // ── Domain files (always disk) ────────────────────────────

  readDomainFile(topicSlug, filename) {
    const p = path.join(this.paths.domains, topicSlug, filename);
    try { return fs.readFileSync(p, 'utf-8'); }
    catch { return null; }
  }

  writeDomainFile(topicSlug, filename, content) {
    const dir = path.join(this.paths.domains, topicSlug);
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, filename);
    const tmp = p + '.tmp';
    fs.writeFileSync(tmp, content);
    fs.renameSync(tmp, p);
  }

  // ── Sessions (SQLite) ─────────────────────────────────────

  appendMessage(chatId, role, content) {
    this._stmts.appendSession.run(chatId, role, content);
  }

  getRecentHistory(chatId, limit = 20) {
    const rows = this._stmts.getSession.all(chatId, limit);
    return rows.reverse().map(({ role, content }) => ({ role, content }));
  }

  clearSession(chatId) {
    this._stmts.clearSession.run(chatId);
  }

  // ── Memory (SQLite) ───────────────────────────────────────

  appendMemory(entry) {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    this._stmts.appendMemory.run(date, time, entry);
  }

  readRecentMemory(days = 2) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDate = cutoff.toISOString().split('T')[0];
    const rows = this._stmts.getMemory.all(cutoffDate);
    if (!rows.length) return '';
    return rows.map((r) => `### ${r.time}\n${r.entry}`).join('\n\n');
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
    return { topic: curriculum.topic, total, completed, percent: Math.round((completed / total) * 100), current };
  }

  // ── Job queue ─────────────────────────────────────────────

  enqueueJob(type, payload) {
    const info = this._stmts.enqueueJob.run(type, JSON.stringify(payload));
    return info.lastInsertRowid;
  }

  getPendingJobs() {
    return this._stmts.getPendingJobs.all().map((r) => ({
      ...r,
      payload: JSON.parse(r.payload),
    }));
  }

  startJob(id) {
    this._stmts.startJob.run(id);
  }

  completeJob(id) {
    this._stmts.completeJob.run(id);
  }

  failJob(id, error) {
    this._stmts.failJob.run(typeof error === 'string' ? error : error?.message || 'unknown', id);
  }

  // ── Groups ────────────────────────────────────────────────

  addGroupMember(chatId, userId, name) {
    this._stmts.addGroupMember.run(chatId, userId, name);
  }

  getGroupMembers(chatId) {
    return this._stmts.getGroupMembers.all(chatId);
  }

  recordStudentExercise(userId, slug, day, result) {
    this._stmts.recordExercise.run(userId, slug, day, result);
  }

  // ── Cleanup ───────────────────────────────────────────────

  close() {
    this.db.close();
  }
}
