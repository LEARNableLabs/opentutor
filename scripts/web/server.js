#!/usr/bin/env node
/**
 * OpenTutor Web — standalone web interface.
 * Serves a minimal UI for interacting with the tutor without Telegram.
 *
 * Usage: npm run web
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TutorStore } from '../../lib/core/store.js';
import { CurriculumPipeline } from '../../lib/core/pipeline.js';
import { buildTeacherPrompt } from '../../lib/core/prompts.js';
import { buildStudentModel } from '../../lib/core/student-model.js';
import { createAdapterFromEnv, createPipelineAdapterFromEnv } from '../../lib/adapters/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// ── Config ──────────────────────────────────────────────────

const PORT = process.env.OPENTUTOR_PORT || 3000;
const HOST = process.env.OPENTUTOR_HOST || 'localhost';

// ── State & adapters ────────────────────────────────────────

const state = new TutorStore(ROOT);
const chatAdapter = createAdapterFromEnv();
const pipelineAdapter = createPipelineAdapterFromEnv();

// Load skill files
const skills = loadSkillFiles();

function loadSkillFiles() {
  const files = new Map();
  const load = (key, filePath) => {
    try { files.set(key, fs.readFileSync(filePath, 'utf-8')); }
    catch { /* optional */ }
  };

  const skillsDir = path.join(ROOT, 'skills', 'tutor');
  const refs = path.join(skillsDir, 'references');
  load('domain-template', path.join(skillsDir, 'templates', 'domain-template.md'));
  load('curriculum-format', path.join(refs, 'curriculum-format.md'));
  load('teaching-method', path.join(refs, 'teaching-method.md'));
  load('lesson-delivery', path.join(refs, 'lesson-delivery.md'));
  load('source-verification', path.join(refs, 'source-verification.md'));
  return files;
}

// ── HTTP server ─────────────────────────────────────────────

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  // API routes
  if (url.pathname.startsWith('/api/')) {
    return handleAPI(req, res, url);
  }

  // Static files (served from root public/)
  let filePath = path.join(ROOT, 'public', url.pathname === '/' ? 'index.html' : url.pathname);
  const ext = path.extname(filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// ── API handlers ────────────────────────────────────────────

async function handleAPI(req, res, url) {
  res.setHeader('Content-Type', 'application/json');

  try {
    // GET /api/topics — list all topics with progress
    if (req.method === 'GET' && url.pathname === '/api/topics') {
      const topics = await state.listTopics();
      const data = [];
      for (const slug of topics) {
        const progress = await state.getTopicProgress(slug);
        if (progress?.topic) data.push({ slug, ...progress });
      }
      return json(res, data);
    }

    // GET /api/topics/:slug — single topic detail
    if (req.method === 'GET' && url.pathname.match(/^\/api\/topics\/[^/]+$/)) {
      const slug = url.pathname.split('/').pop();
      const curriculum = await state.readCurriculum(slug);
      const learning = await state.readDomainFile(slug, 'learning.md');
      const progress = await state.getTopicProgress(slug);
      return json(res, { curriculum, learning, progress });
    }

    // GET /api/progress — active topics with computed stats
    if (req.method === 'GET' && url.pathname === '/api/progress') {
      const progress = await state.readProgress();
      const activeTopics = progress.active_topics || [];

      const history = progress.history || [];
      const uniqueDays = [...new Set(history.map((h) => h.date))].sort().reverse();
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let streak = 0;
      if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
        let expected = new Date(uniqueDays[0]);
        for (const day of uniqueDays) {
          const d = new Date(day);
          if (Math.round((expected - d) / 86400000) > 1) break;
          streak++;
          expected = d;
        }
      }

      const topics = activeTopics.map((slug) => {
        const tp = state.getTopicProgress(slug);
        if (!tp) return null;
        const learningMd = state.readDomainFile(slug, 'learning.md') || '';
        const curriculum = state.readCurriculum(slug);
        const model = buildStudentModel(learningMd, curriculum, '');
        return {
          slug,
          topic: tp.topic,
          completed: tp.completed,
          total: tp.total,
          percent: tp.percent,
          accuracy: Math.round(model.recentAccuracy * 100),
          mastered: model.concepts.solid.length,
          reviewDue: model.concepts.shaky.length,
          nextLesson: tp.current?.title || null,
        };
      }).filter(Boolean);

      return json(res, { ...progress, streak, topics });
    }

    // POST /api/lesson — deliver next lesson
    if (req.method === 'POST' && url.pathname === '/api/lesson') {
      const body = await readBody(req);
      const { topicSlug } = JSON.parse(body);

      const lesson = await state.getNextLesson(topicSlug);
      if (!lesson) {
        return json(res, { done: true, message: 'All lessons completed!' });
      }

      const prompt = buildTeacherPrompt(state, skills, lesson, topicSlug);
      const lessonDay = lesson.day || lesson.lesson;
      const response = await chatAdapter.generate(
        prompt.system + '\n\nReturn only polished text. No commentary.',
        [{ role: 'user', content: `Deliver lesson Day ${lessonDay}: "${lesson.title}"` }],
        { model: prompt.model },
      );

      await state.markLessonComplete(topicSlug, lessonDay, 'delivered');

      return json(res, {
        lesson: { day: lessonDay, title: lesson.title, module: lesson.module },
        content: response.text,
        model: response.model,
      });
    }

    // GET /api/user — get student profile
    if (req.method === 'GET' && url.pathname === '/api/user') {
      const user = await state.readUser();
      const progress = await state.readProgress();
      const hasProfile = user.includes('**Name:**') && !user.match(/\*\*Name:\*\*\s*$/m);
      return json(res, { profile: user, hasProfile, onboarded: progress.active_topics?.length > 0 });
    }

    // POST /api/user — save student profile
    if (req.method === 'POST' && url.pathname === '/api/user') {
      const body = await readBody(req);
      const data = JSON.parse(body);
      const profile = buildUserProfile(data);
      await state.writeUser(profile);
      return json(res, { ok: true });
    }

    // POST /api/onboard — guided onboarding chat
    if (req.method === 'POST' && url.pathname === '/api/onboard') {
      const body = await readBody(req);
      const { message, history } = JSON.parse(body);

      const user = await state.readUser();
      const system = [
        '## Study Buddy Onboarding',
        'You are a warm, sharp study buddy meeting a new student. Keep it natural — not a form.',
        'Ask one question at a time. Discover: their name, what they want to learn, their level, and how they prefer to learn (examples-first vs theory-first, visual vs verbal).',
        'When you have enough info, suggest 2-3 specific topics and ask them to pick one.',
        'When they pick a topic, respond with exactly this marker on its own line: <TOPIC>chosen topic</TOPIC>',
        user ? `## Student profile so far\n\n${user}` : '',
        '\n\nReturn only polished text. Keep each message to 2-3 short paragraphs max.',
      ].filter(Boolean).join('\n\n');

      const messages = [...(history || []), { role: 'user', content: message }];
      const response = await chatAdapter.generate(system, messages, { model: 'cheap' });

      const topicMatch = response.text.match(/<TOPIC>(.+?)<\/TOPIC>/);
      const cleanText = response.text.replace(/<TOPIC>.+?<\/TOPIC>/g, '').trim();

      return json(res, {
        reply: cleanText,
        confirmedTopic: topicMatch ? topicMatch[1].trim() : null,
        model: response.model,
      });
    }

    // POST /api/chat — free-form chat
    if (req.method === 'POST' && url.pathname === '/api/chat') {
      const body = await readBody(req);
      const { message, topicSlug } = JSON.parse(body);

      const user = await state.readUser();
      const system = [
        '## Study Buddy\n\nYou are a warm, sharp study buddy. Be concise. 1-3 sentences for simple questions.',
        user ? `## Student\n\n${user}` : '',
      ].filter(Boolean).join('\n\n---\n\n');

      const response = await chatAdapter.generate(
        system + '\n\nReturn only polished text.',
        [{ role: 'user', content: message }],
        { model: 'cheap' },
      );

      return json(res, { reply: response.text, model: response.model });
    }

    // POST /api/add-topic — add a new topic
    if (req.method === 'POST' && url.pathname === '/api/add-topic') {
      const body = await readBody(req);
      const { topic, level } = JSON.parse(body);
      const slug = slugify(topic);

      const existing = await state.readCurriculum(slug);
      if (existing?.lessons?.length) {
        await state.updateProgress((p) => {
          if (!p.active_topics) p.active_topics = [];
          if (!p.active_topics.includes(slug)) p.active_topics.push(slug);
        });
        return json(res, { slug, status: 'existing', lessonCount: existing.lessons.length });
      }

      // Start pipeline in background
      const pipeline = new CurriculumPipeline({
        adapter: pipelineAdapter,
        state,
        skills,
        onProgress: (p) => console.log(`[pipeline] ${p.phase} — ${p.topic} (${p.iteration})`),
      });

      pipeline.run(topic, slug, level || 'intermediate', '').catch((err) => {
        console.error('[pipeline] failed:', err.message);
      });

      await state.updateProgress((p) => {
        if (!p.active_topics) p.active_topics = [];
        if (!p.active_topics.includes(slug)) p.active_topics.push(slug);
      });

      return json(res, { slug, status: 'building' });
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Unknown API endpoint' }));
  } catch (err) {
    console.error('[api] error:', err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
}

// ── Helpers ─────────────────────────────────────────────────

function json(res, data) {
  res.writeHead(200);
  res.end(JSON.stringify(data, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function buildUserProfile(data) {
  return [
    '# Student Profile',
    '',
    '## Identity',
    `- **Name:** ${data.name || ''}`,
    `- **What to call them:** ${data.nickname || data.name || ''}`,
    `- **Timezone:** ${data.timezone || ''}`,
    `- **Educational level:** ${data.level || ''}`,
    '',
    '## Learning Style',
    `- **Prefers:** ${data.learningApproach || ''}`,
    `- **Modality:** ${data.modality || ''}`,
    `- **Pace:** ${data.pace || 'steady'}`,
    `- **Depth:** ${data.depth || ''}`,
    '',
    '## Preferences',
    `- **Tone:** ${data.tone || 'casual'}`,
    `- **Session length:** ${data.sessionLength || 'medium'}`,
    '',
    '## Context',
    data.context || '',
  ].join('\n');
}

// ── Start ───────────────────────────────────────────────────

server.listen(PORT, HOST, () => {
  console.log(`OpenTutor Web running at http://${HOST}:${PORT}`);
  console.log(`LLM backend: ${chatAdapter.name}`);
  console.log(`Pipeline backend: ${pipelineAdapter.name}`);
  console.log(`Store: sqlite`);
  console.log(`Topics loaded: ${state.listTopics().length}`);
});

// ── Graceful shutdown ───────────────────────────────────────

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  state.close();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
