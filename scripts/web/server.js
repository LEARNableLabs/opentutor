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
import { TutorState } from '../../lib/core/state.js';
import { CurriculumPipeline } from '../../lib/core/pipeline.js';
import { buildTeacherPrompt } from '../../lib/core/prompts.js';
import { createAdapterFromEnv, createPipelineAdapterFromEnv } from '../../lib/adapters/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// ── Config ──────────────────────────────────────────────────

const PORT = process.env.OPENTUTOR_PORT || 3000;
const HOST = process.env.OPENTUTOR_HOST || 'localhost';

// ── State & adapters ────────────────────────────────────────

const state = new TutorState(ROOT);
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

  // Static files
  let filePath = path.join(__dirname, 'public', url.pathname === '/' ? 'index.html' : url.pathname);
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
      const topics = state.listTopics();
      const data = topics.map((slug) => ({
        slug,
        ...state.getTopicProgress(slug),
      })).filter((t) => t.topic);
      return json(res, data);
    }

    // GET /api/topics/:slug — single topic detail
    if (req.method === 'GET' && url.pathname.match(/^\/api\/topics\/[^/]+$/)) {
      const slug = url.pathname.split('/').pop();
      const curriculum = state.readCurriculum(slug);
      const learning = state.readDomainFile(slug, 'learning.md');
      const progress = state.getTopicProgress(slug);
      return json(res, { curriculum, learning, progress });
    }

    // GET /api/progress — active topics and schedule
    if (req.method === 'GET' && url.pathname === '/api/progress') {
      return json(res, state.readProgress());
    }

    // POST /api/lesson — deliver next lesson
    if (req.method === 'POST' && url.pathname === '/api/lesson') {
      const body = await readBody(req);
      const { topicSlug } = JSON.parse(body);

      const lesson = state.getNextLesson(topicSlug);
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

      state.markLessonComplete(topicSlug, lessonDay, { delivered: true });

      return json(res, {
        lesson: { day: lessonDay, title: lesson.title, module: lesson.module },
        content: response.text,
        model: response.model,
      });
    }

    // POST /api/chat — free-form chat
    if (req.method === 'POST' && url.pathname === '/api/chat') {
      const body = await readBody(req);
      const { message, topicSlug } = JSON.parse(body);

      const user = state.readUser();
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

      const existing = state.readCurriculum(slug);
      if (existing?.lessons?.length) {
        state.updateProgress((p) => {
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

      state.updateProgress((p) => {
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

// ── Start ───────────────────────────────────────────────────

server.listen(PORT, HOST, () => {
  console.log(`OpenTutor Web running at http://${HOST}:${PORT}`);
  console.log(`LLM backend: ${chatAdapter.name}`);
  console.log(`Pipeline backend: ${pipelineAdapter.name}`);
  console.log(`Topics loaded: ${state.listTopics().length}`);
});
