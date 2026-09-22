/**
 * SQLite-backed state store — same interface as TutorState (file-based).
 * Durable, transactional, supports concurrent reads.
 *
 * Domain files (curriculum.json, concept-map.md, etc.) are still read from
 * disk — they're large markdown/JSON assets that belong in the repo.
 * SQLite stores runtime state: progress, sessions, jobs, student data.
 */

import fs from 'fs';
import { GENERATED_PREFIX, generatedTopicKey, decodeTopic } from './generated-topics.js';
import path from 'path';
import { openDatabaseFromEnv } from './db.js';
import { completionsFile, readCompletions, applyCompletions, recordCompletion, readCurriculumWithProgress, withoutRuntimeFields, domainFilePath, seedFromTemplate, workspaceDir, assertUserId } from './progress.js';

export class TutorStore {
  /**
   * @param {string} rootDir
   * @param {object} [options]
   * @param {string} [options.userId] - Scope every read and write to one student
   *   (#80). State lives in two places, so both are scoped: the `kv` rows carry
   *   the id, and the workspace directory (completions, domain files) hangs off
   *   a per-student path. Omitted, the layout is the original single-user one.
   */
  constructor(rootDir, { userId = null, db = null } = {}) {
    this.root = rootDir;
    // Canonicalise once, here. Every store then derives its key and its paths
    // from the same string — the review found blank, falsy, numeric and
    // differently-cased ids each landing somewhere different otherwise.
    this.userId = userId == null ? null : assertUserId(userId);
    this.paths = {
      domains: path.join(rootDir, 'skills', 'tutor', 'domains'),
    };

    const dataDir = process.env.OPENTUTOR_DATA_DIR || rootDir;
    this.dataDir = dataDir;

    // '' rather than null: it is a PRIMARY KEY column, and NULL never equals
    // NULL. `??`, not `||` — the id '0' is real and must not collapse to ''.
    this._uid = this.userId ?? '';

    // Domain files still use workspace for portability
    fs.mkdirSync(path.join(this._workspace(), 'tutor'), { recursive: true });

    this.db = db || openDatabaseFromEnv(rootDir);
    this._ownsDB = !db;

    // Prepared statements
    this._stmts = {
      getKV: this.db.prepare('SELECT value FROM kv WHERE user_id = ? AND key = ?'),
      setKV: this.db.prepare('INSERT OR REPLACE INTO kv (user_id, key, value) VALUES (?, ?, ?)'),
      delKV: this.db.prepare('DELETE FROM kv WHERE user_id = ? AND key = ?'),
      getSession: this.db.prepare('SELECT role, content FROM sessions WHERE chat_id = ? ORDER BY id DESC LIMIT ?'),
      appendSession: this.db.prepare('INSERT INTO sessions (chat_id, role, content) VALUES (?, ?, ?)'),
      clearSession: this.db.prepare('DELETE FROM sessions WHERE chat_id = ?'),
      appendMemory: this.db.prepare('INSERT INTO memory (user_id, date, time, entry) VALUES (?, ?, ?, ?)'),
      getMemory: this.db.prepare('SELECT date, time, entry FROM memory WHERE user_id = ? AND date >= ? ORDER BY id'),
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

  // ── Key/value (lesson state for the web + webhook routes) ─

  insertKV(key, value) { this.db.prepare('INSERT OR IGNORE INTO kv (user_id,key,value) VALUES (?,?,?)').run(this._uid,key,value); }
  listKV(prefix) { return this.db.prepare('SELECT key,value FROM kv WHERE user_id=? AND key LIKE ?').all(this._uid,prefix+'%'); }

  readKV(key) {
    return this._stmts.getKV.get(this._uid, key)?.value ?? null;
  }

  writeKV(key, value) {
    this._stmts.setKV.run(this._uid, key, value);
  }

  deleteKV(key) {
    this._stmts.delKV.run(this._uid, key);
  }

  compareAndSetTopic(slug, expected, next) {
    const key = generatedTopicKey(slug);
    if (!expected) {
      return this.db.prepare('INSERT OR IGNORE INTO kv (user_id, key, value) VALUES (?, ?, ?)')
        .run(this._uid, key, JSON.stringify(next)).changes === 1;
    }
    return this.db.prepare("UPDATE kv SET value = ? WHERE user_id = ? AND key = ? AND json_extract(value, '$.id') = ? AND json_extract(value, '$.revision') = ?")
      .run(JSON.stringify(next), this._uid, key, expected.id, expected.revision).changes === 1;
  }

  listGeneratedTopics() {
    return this.db.prepare('SELECT key FROM kv WHERE user_id = ? AND key LIKE ?').all(this._uid, GENERATED_PREFIX + '%')
      .map(({ key }) => key.slice(GENERATED_PREFIX.length));
  }

  // ── Progress ──────────────────────────────────────────────

  readProgress() {
    const row = this._stmts.getKV.get(this._uid, 'progress');
    if (row) return JSON.parse(row.value);
    const seeded = seedFromTemplate(this._workspace(), path.join('tutor', 'progress.json'), 'progress.json');
    try { return JSON.parse(fs.readFileSync(seeded, 'utf-8')); }
    catch { return { active_topics: [], schedule: {}, history: [], onboarding: null }; }
  }

  writeProgress(data) {
    this._stmts.setKV.run(this._uid, 'progress', JSON.stringify(data));
  }

  updateProgress(fn) {
    const data = this.readProgress();
    fn(data);
    this.writeProgress(data);
    return data;
  }

  // ── User profile ──────────────────────────────────────────

  readUser() {
    const row = this._stmts.getKV.get(this._uid, 'user_profile');
    if (row) return row.value;
    const seeded = seedFromTemplate(this._workspace(), 'USER.md', 'USER.md');
    try { return fs.readFileSync(seeded, 'utf-8'); }
    catch { return ''; }
  }

  writeUser(content) {
    this._stmts.setKV.run(this._uid, 'user_profile', content);
  }

  // ── Curriculum (read from disk, runtime state in SQLite) ──

  readCurriculum(topicSlug) {
    const generated = decodeTopic(this.readKV(generatedTopicKey(topicSlug)));
    if (generated?.curriculum) {
      return applyCompletions(structuredClone(generated.curriculum), readCompletions(completionsFile(this._workspace()))[topicSlug]);
    }
    return readCurriculumWithProgress(this.paths.domains, this._workspace(), topicSlug);
  }

  writeCurriculum(topicSlug, data) {
    const dir = path.join(this.paths.domains, topicSlug);
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, 'curriculum.json');
    const tmp = p + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(withoutRuntimeFields(data), null, 2) + '\n');
    fs.renameSync(tmp, p);
  }

  getNextLesson(topicSlug) {
    const curriculum = this.readCurriculum(topicSlug);
    if (!curriculum) return null;
    return curriculum.lessons.find((l) => l.status === 'pending') || null;
  }

  /** A store scoped to one student, for admin routes acting on their behalf (#80). */
  forStudent(userId) {
    return new this.constructor(this.root, { userId, db: this.db });
  }

  deleteAllStudentState() {
    if (this.userId == null) throw new Error('Refusing to delete unnamed instance');
    this.db.transaction(() => {
      this.db.prepare('DELETE FROM kv WHERE user_id = ?').run(this._uid);
      this.db.prepare('DELETE FROM memory WHERE user_id = ?').run(this._uid);
    })();
  }

  _workspace() {
    return workspaceDir(this.dataDir, this.userId);
  }

  markLessonComplete(topicSlug, day, engagement = 'delivered') {
    recordCompletion(completionsFile(this._workspace()), topicSlug, day, engagement);

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
    if (!['learning.md', 'practice-feedback.md'].includes(filename)) {
      const generated = decodeTopic(this.readKV(generatedTopicKey(topicSlug)));
      if (generated?.files?.[filename]) return generated.files[filename];
    }
    try { return fs.readFileSync(domainFilePath(this.paths.domains, this._workspace(), topicSlug, filename), 'utf-8'); }
    catch { return null; }
  }

  writeDomainFile(topicSlug, filename, content) {
    const p = domainFilePath(this.paths.domains, this._workspace(), topicSlug, filename);
    fs.mkdirSync(path.dirname(p), { recursive: true });
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
    this._stmts.appendMemory.run(this._uid, date, time, entry);
  }

  readRecentMemory(days = 2) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDate = cutoff.toISOString().split('T')[0];
    const rows = this._stmts.getMemory.all(this._uid, cutoffDate);
    if (!rows.length) return '';
    return rows.map((r) => `### ${r.time}\n${r.entry}`).join('\n\n');
  }

  // ── Topics ────────────────────────────────────────────────

  listTopics() {
    let shipped = [];
    try {
      shipped = fs.readdirSync(this.paths.domains).filter((d) => fs.existsSync(path.join(this.paths.domains, d, 'curriculum.json')));
    } catch { /* no shipped domains */ }
    return [...new Set([...shipped, ...this.listGeneratedTopics().filter((slug) => this.readCurriculum(slug)?.lessons?.length)])];
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
    if (this._ownsDB) this.db.close();
  }
}
