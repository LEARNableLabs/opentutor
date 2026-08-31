/**
 * Platform-agnostic state management.
 * All state is file-based — no database, no platform dependencies.
 * Paths are resolved from a configurable root directory.
 */

import fs from 'fs';
import path from 'path';

export class TutorState {
  constructor(rootDir) {
    this.root = rootDir;
    this.paths = {
      domains: path.join(rootDir, 'skills', 'tutor', 'domains'),
      workspace: path.join(rootDir, 'workspace'),
      progress: path.join(rootDir, 'workspace', 'tutor', 'progress.json'),
      user: path.join(rootDir, 'workspace', 'USER.md'),
      memory: path.join(rootDir, 'workspace', 'memory'),
      sessions: path.join(rootDir, 'workspace', 'sessions'),
    };

    for (const dir of [this.paths.workspace, this.paths.memory, this.paths.sessions,
      path.dirname(this.paths.progress)]) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // ── Progress ──────────────────────────────────────────────

  readProgress() {
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
    try { return fs.readFileSync(this.paths.user, 'utf-8'); }
    catch { return ''; }
  }

  writeUser(content) {
    fs.writeFileSync(this.paths.user, content);
  }

  // ── Curriculum ────────────────────────────────────────────

  readCurriculum(topicSlug) {
    const p = path.join(this.paths.domains, topicSlug, 'curriculum.json');
    try { return JSON.parse(fs.readFileSync(p, 'utf-8')); }
    catch { return null; }
  }

  writeCurriculum(topicSlug, data) {
    const dir = path.join(this.paths.domains, topicSlug);
    fs.mkdirSync(dir, { recursive: true });
    this._atomicWrite(path.join(dir, 'curriculum.json'), JSON.stringify(data, null, 2) + '\n');
  }

  getNextLesson(topicSlug) {
    const curriculum = this.readCurriculum(topicSlug);
    if (!curriculum) return null;
    return curriculum.lessons.find((l) => l.status === 'pending') || null;
  }

  markLessonComplete(topicSlug, day, engagement = {}) {
    const curriculum = this.readCurriculum(topicSlug);
    if (!curriculum) return;
    const lesson = curriculum.lessons.find((l) => (l.day || l.lesson) === day);
    if (lesson) {
      lesson.status = 'completed';
      lesson.delivered = new Date().toISOString().split('T')[0];
      if (engagement) lesson.engagement = engagement;
    }
    this.writeCurriculum(topicSlug, curriculum);
  }

  // ── Domain files ──────────────────────────────────────────

  readDomainFile(topicSlug, filename) {
    const p = path.join(this.paths.domains, topicSlug, filename);
    try { return fs.readFileSync(p, 'utf-8'); }
    catch { return null; }
  }

  writeDomainFile(topicSlug, filename, content) {
    const dir = path.join(this.paths.domains, topicSlug);
    fs.mkdirSync(dir, { recursive: true });
    this._atomicWrite(path.join(dir, filename), content);
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

  _atomicWrite(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const tmp = filePath + '.tmp';
    fs.writeFileSync(tmp, content);
    fs.renameSync(tmp, filePath);
  }
}
