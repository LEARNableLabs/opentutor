/**
 * Supabase Postgres store — production backend.
 *
 * Same interface as TutorStore (SQLite) but all methods are async.
 * Callers must await every call. Domain files (curriculum.json,
 * concept-map.md, etc.) are still read from disk.
 *
 * Env vars:
 *   SUPABASE_URL            — project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (full access, bypasses RLS)
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { readCurriculumContent, applyCompletions, withoutRuntimeFields, workspaceDir, assertUserId } from './progress.js';

// The two files the tutor writes while teaching. Everything else in a domain
// ships with the package and is read from disk.
const RUNTIME_DOMAIN_FILES = new Set(['learning.md', 'practice-feedback.md']);

export class SupabaseStore {
  /**
   * @param {object} [options]
   * @param {string} [options.userId] - Scope every read and write to one student
   *   (#80). Postgres rows carry the id; the workspace directory holding
   *   completions and domain files hangs off a per-student path.
   */
  constructor(rootDir, options = {}) {
    this.root = rootDir;
    // Validated here, not lazily on the first disk path: this backend never
    // touches the filesystem for kv, so an invalid id used to reach Postgres.
    this.userId = options.userId == null ? null : assertUserId(options.userId);
    // '' rather than null: it is part of the primary key, and NULL never
    // equals NULL. `??`, not `||` — the id '0' must not collapse to ''.
    this._uid = this.userId ?? '';
    this.paths = {
      domains: path.join(rootDir, 'skills', 'tutor', 'domains'),
    };

    // Supabase replaced the service_role JWT with `sb_secret_…` keys; both work
    // with createClient and both bypass RLS, so accept either name.
    const url = options.supabaseUrl || process.env.SUPABASE_URL;
    const key = options.supabaseKey
      || process.env.SUPABASE_SERVICE_ROLE_KEY
      || process.env.SUPABASE_SECRET_KEY;
    if (!options.client && (!url || !key)) {
      throw new Error('SupabaseStore requires SUPABASE_URL and one of SUPABASE_SERVICE_ROLE_KEY / SUPABASE_SECRET_KEY');
    }

    this.supabase = options.client || createClient(url, key);
  }

  /** A store scoped to one student, for admin routes acting on their behalf (#80). */
  forStudent(userId) {
    return new this.constructor(this.root, { userId, client: this.supabase });
  }

  async deleteAllStudentState() {
    if (this.userId == null) throw new Error('Refusing to delete unnamed instance');
    for (const table of ['kv', 'memory', 'lessons_completed', 'curricula', 'domain_files']) {
      const { error } = await this.supabase.from(table).delete().eq('user_id', this._uid);
      if (error) throw error;
    }
  }

  _workspace() {
    return workspaceDir(this.root, this.userId);
  }

  // ── Key/value (lesson state for the web + webhook routes) ─

  async readKV(key) {
    const { data, error } = await this.supabase.from('kv').select('value').eq('user_id', this._uid).eq('key', key).maybeSingle();
    if (error) throw error;
    return data?.value ?? null;
  }

  async writeKV(key, value) {
    const { error } = await this.supabase.from('kv').upsert({ user_id: this._uid, key, value });
    if (error) throw error;
  }

  async deleteKV(key) {
    const { error } = await this.supabase.from('kv').delete().eq('user_id', this._uid).eq('key', key);
    if (error) throw error;
  }

  // ── Progress ──────────────────────────────────────────────

  async readProgress() {
    const { data } = await this.supabase
      .from('kv').select('value').eq('user_id', this._uid).eq('key', 'progress').single();
    if (data) return data.value;
    return { active_topics: [], schedule: {}, history: [], onboarding: null };
  }

  async writeProgress(progressData) {
    await this.supabase.from('kv').upsert({
      user_id: this._uid,
      key: 'progress',
      value: progressData,
    });
  }

  async updateProgress(fn) {
    const data = await this.readProgress();
    fn(data);
    await this.writeProgress(data);
    return data;
  }

  // ── User profile ──────────────────────────────────────────

  async readUser() {
    const { data } = await this.supabase
      .from('kv').select('value').eq('user_id', this._uid).eq('key', 'user_profile').single();
    if (data) return data.value;
    return '';
  }

  async writeUser(content) {
    await this.supabase.from('kv').upsert({
      user_id: this._uid,
      key: 'user_profile',
      value: content,
    });
  }

  // ── Curriculum and runtime state (#117) ──────────────────
  //
  // Everything the tutor *writes* lives in Postgres. The filesystem is
  // read-only on Vercel outside /tmp, and the three writes that used to land
  // there — completion, learning.md, generated curricula — threw EROFS,
  // were swallowed by the lesson route, and lost a student's whole session.
  //
  // Reads of shipped content stay on disk. Read-only is no obstacle for the
  // 293 curricula and their concept maps, and they are far too large to want
  // in a database.

  /** Which lessons this student has finished, as the completion overlay wants them. */
  async _completions(topicSlug) {
    const { data } = await this.supabase
      .from('lessons_completed')
      .select('day, date, engagement')
      .eq('user_id', this._uid)
      .eq('slug', topicSlug);

    const out = {};
    for (const row of data || []) out[String(row.day)] = { date: row.date, engagement: row.engagement };
    return out;
  }

  async readCurriculum(topicSlug) {
    // Shipped first: the 293 are content and never change. A curriculum
    // generated at runtime has no file, so it comes from the table instead.
    let curriculum = readCurriculumContent(this.paths.domains, topicSlug);

    if (!curriculum) {
      const { data } = await this.supabase
        .from('curricula').select('data')
        .eq('user_id', this._uid).eq('slug', topicSlug)
        .maybeSingle();
      curriculum = data?.data ?? null;
    }
    if (!curriculum) return null;

    return applyCompletions(structuredClone(curriculum), await this._completions(topicSlug));
  }

  async writeCurriculum(topicSlug, data) {
    // Never back to skills/tutor/domains/ — that is tracked content on a
    // read-only disk, and #97 established that runtime state does not go there.
    await this.supabase.from('curricula').upsert({
      user_id: this._uid,
      slug: topicSlug,
      topic: data?.topic ?? topicSlug,
      data: withoutRuntimeFields(data),
      preliminary: data?.preliminary ?? false,
      updated_at: new Date().toISOString(),
    });
  }

  async getNextLesson(topicSlug) {
    const curriculum = await this.readCurriculum(topicSlug);
    if (!curriculum) return null;
    return curriculum.lessons.find((l) => l.status === 'pending') || null;
  }

  async markLessonComplete(topicSlug, day, engagement = 'delivered') {
    await this.supabase.from('lessons_completed').upsert({
      user_id: this._uid,
      slug: topicSlug,
      day,
      date: new Date().toISOString().split('T')[0],
      engagement: typeof engagement === 'string' ? engagement : 'delivered',
    });

    await this.updateProgress((p) => {
      if (!p.history) p.history = [];
      p.history.push({
        date: new Date().toISOString().split('T')[0],
        topic: topicSlug,
        lesson: day,
        engagement: typeof engagement === 'string' ? engagement : 'delivered',
      });
    });
  }

  // ── Domain files ─────────────────────────────────────────
  // learning.md and practice-feedback.md describe one student and are written
  // while teaching, so they go to Postgres. The rest ship with the package.

  async readDomainFile(topicSlug, filename) {
    if (RUNTIME_DOMAIN_FILES.has(filename)) {
      const { data } = await this.supabase
        .from('domain_files').select('content')
        .eq('user_id', this._uid).eq('slug', topicSlug).eq('filename', filename)
        .maybeSingle();
      return data?.content ?? null;
    }

    try { return fs.readFileSync(path.join(this.paths.domains, topicSlug, filename), 'utf-8'); }
    catch { return null; }
  }

  async writeDomainFile(topicSlug, filename, content) {
    if (!RUNTIME_DOMAIN_FILES.has(filename)) {
      // Build-time artifacts from the pipeline. On a writable disk they belong
      // beside the curriculum; on a read-only one there is nowhere to put them
      // and nothing reads them at runtime, so losing them costs nothing.
      try {
        const dir = path.join(this.paths.domains, topicSlug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, filename), content);
      } catch { /* read-only deployment */ }
      return;
    }

    await this.supabase.from('domain_files').upsert({
      user_id: this._uid,
      slug: topicSlug,
      filename,
      content,
      updated_at: new Date().toISOString(),
    });
  }

  // ── Sessions ──────────────────────────────────────────────

  async appendMessage(chatId, role, content) {
    await this.supabase.from('sessions').insert({
      chat_id: String(chatId), role, content,
    });
  }

  async getRecentHistory(chatId, limit = 20) {
    const { data } = await this.supabase
      .from('sessions')
      .select('role, content')
      .eq('chat_id', String(chatId))
      .order('id', { ascending: false })
      .limit(limit);
    return (data || []).reverse();
  }

  async clearSession(chatId) {
    await this.supabase.from('sessions').delete().eq('chat_id', String(chatId));
  }

  // ── Memory ────────────────────────────────────────────────

  async appendMemory(entry) {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    await this.supabase.from('memory').insert({ user_id: this._uid, date, time, entry });
  }

  async readRecentMemory(days = 2) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDate = cutoff.toISOString().split('T')[0];
    const { data } = await this.supabase
      .from('memory')
      .select('date, time, entry')
      .eq('user_id', this._uid)
      .gte('date', cutoffDate)
      .order('id');
    if (!data?.length) return '';
    return data.map((r) => `### ${r.time}\n${r.entry}`).join('\n\n');
  }

  // ── Topics ────────────────────────────────────────────────

  listTopics() {
    try {
      return fs.readdirSync(this.paths.domains).filter((d) =>
        fs.existsSync(path.join(this.paths.domains, d, 'curriculum.json'))
      );
    } catch { return []; }
  }

  async getTopicProgress(topicSlug) {
    const curriculum = await this.readCurriculum(topicSlug);
    if (!curriculum) return null;
    const total = curriculum.lessons.length;
    const completed = curriculum.lessons.filter((l) => l.status === 'completed').length;
    const current = curriculum.lessons.find((l) => l.status === 'pending');
    return {
      topic: curriculum.topic, total, completed,
      percent: Math.round((completed / total) * 100), current,
    };
  }

  // ── Job queue ─────────────────────────────────────────────

  async enqueueJob(type, payload) {
    const { data } = await this.supabase
      .from('jobs')
      .insert({ type, payload, status: 'pending' })
      .select('id')
      .single();
    return data?.id;
  }

  async getPendingJobs() {
    const { data } = await this.supabase
      .from('jobs')
      .select('*')
      .in('status', ['pending', 'running'])
      .order('id');
    return (data || []).map((r) => ({
      ...r,
      payload: typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload,
    }));
  }

  async startJob(id) {
    await this.supabase.from('jobs')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .eq('id', id);
  }

  async completeJob(id) {
    await this.supabase.from('jobs')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', id);
  }

  async failJob(id, error) {
    const msg = typeof error === 'string' ? error : error?.message || 'unknown';
    await this.supabase.from('jobs')
      .update({ status: 'failed', completed_at: new Date().toISOString(), error: msg })
      .eq('id', id);
  }

  // ── Groups ────────────────────────────────────────────────

  async addGroupMember(chatId, userId, name) {
    await this.supabase.from('group_members').upsert({
      chat_id: String(chatId),
      user_id: String(userId),
      name,
    });
  }

  async getGroupMembers(chatId) {
    const { data } = await this.supabase
      .from('group_members')
      .select('*')
      .eq('chat_id', String(chatId));
    return data || [];
  }

  async recordStudentExercise(userId, slug, day, result) {
    await this.supabase.from('student_exercises').upsert({
      user_id: String(userId), slug, day, result,
    });
  }

  // ── Cleanup ───────────────────────────────────────────────

  close() {
    // Supabase client doesn't require explicit close
  }
}
