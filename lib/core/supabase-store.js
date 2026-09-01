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

export class SupabaseStore {
  constructor(rootDir, options = {}) {
    this.root = rootDir;
    this.paths = {
      domains: path.join(rootDir, 'skills', 'tutor', 'domains'),
    };

    const url = options.supabaseUrl || process.env.SUPABASE_URL;
    const key = options.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('SupabaseStore requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }

    this.supabase = createClient(url, key);
  }

  // ── Progress ──────────────────────────────────────────────

  async readProgress() {
    const { data } = await this.supabase
      .from('kv').select('value').eq('key', 'progress').single();
    if (data) return data.value;
    return { active_topics: [], schedule: {}, history: [], onboarding: null };
  }

  async writeProgress(progressData) {
    await this.supabase.from('kv').upsert({
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
      .from('kv').select('value').eq('key', 'user_profile').single();
    if (data) return data.value;
    return '';
  }

  async writeUser(content) {
    await this.supabase.from('kv').upsert({
      key: 'user_profile',
      value: content,
    });
  }

  // ── Curriculum (disk for content, Supabase for metadata) ──

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

  async markLessonComplete(topicSlug, day, engagement = 'delivered') {
    const curriculum = this.readCurriculum(topicSlug);
    if (!curriculum) return;
    const lesson = curriculum.lessons.find((l) => (l.day || l.lesson) === day);
    if (lesson) {
      lesson.status = 'completed';
      lesson.delivered = new Date().toISOString().split('T')[0];
      if (engagement) lesson.engagement = engagement;
    }
    this.writeCurriculum(topicSlug, curriculum);

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
    await this.supabase.from('memory').insert({ date, time, entry });
  }

  async readRecentMemory(days = 2) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDate = cutoff.toISOString().split('T')[0];
    const { data } = await this.supabase
      .from('memory')
      .select('date, time, entry')
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

  getTopicProgress(topicSlug) {
    const curriculum = this.readCurriculum(topicSlug);
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
