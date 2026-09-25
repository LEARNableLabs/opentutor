#!/usr/bin/env node
/**
 * OpenTutor Web — standalone web interface.
 * Serves a minimal UI for interacting with the tutor without Telegram.
 *
 * Usage: npm run web
 */

import http from 'http';
import { accountHandler } from '../../api/account.js';
import { openrouterHandler } from '../../api/_lib/openrouter.js';
import { demoHandler } from '../../api/_lib/demo.js';
import { adapterFor, turnText, KeyRequired } from '../../lib/core/llm-access.js';
import { publicCatalog } from '../../lib/core/catalog.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { issueStudentToken } from '../../lib/core/student-auth.js';
import { TutorStore } from '../../lib/core/store.js';
import { addTopic } from '../../lib/core/topic-service.js';
import { readTopicBuild, buildSummary, listTopicBuilds } from '../../lib/core/topic-builds.js';
import { startLocalBuildWorker } from '../../lib/core/local-build-worker.js';
import { buildStudentModel } from '../../lib/core/student-model.js';
import { lessonTurn } from '../../api/lesson.js';
import { onboardTurn } from '../../api/onboard.js';
import { authenticateRequest, authFailure } from '../../api/_lib/auth.js';
import { checkAdmin, adminFailure } from '../../api/_lib/admin-auth.js';
import { listStudents, findStudent, provisionStudent, decommissionStudent } from '../../lib/core/students.js';
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
const buildWorker = startLocalBuildWorker({ state, adapter: pipelineAdapter, skills });

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
  '.png': 'image/png',
  '.ico': 'image/x-icon',
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
    const content = fs.readFileSync(filePath); // raw bytes — decoding as UTF-8 corrupts images
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});
// #138: a whole request (headers and body) must arrive within a minute, not
// Node's default five, so an unfinished upload cannot hold its socket for long.
// This times receiving the request only; responses, streamed lessons included,
// are not affected.
server.requestTimeout = 60_000;

// ── Admin (#80) ─────────────────────────────────────────────
// The Vercel build serves these from api/admin/students.js. Both call the same
// functions in lib/core/students.js, the way the lesson route is shared.

async function handleAdmin(req, res, url) {
  const auth = checkAdmin(req);
  if (!auth.ok) {
    const { status, body } = adminFailure(auth);
    res.writeHead(status);
    return res.end(JSON.stringify(body));
  }

  if (url.pathname !== '/api/admin/students') {
    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Unknown admin endpoint' }));
  }

  const id = url.searchParams.get('id');

  try {
    if (req.method === 'GET' && !id) return json(res, { students: await listStudents(state) });

    if (req.method === 'GET') {
      const student = await findStudent(state, id);
      if (!student) return fail(res, 404, `Student ${id} not found`);
      return json(res, await studentStats(student));
    }

    if (req.method === 'POST') {
      const { userId, name } = JSON.parse(await readBody(req, res) || '{}');
      if (!userId) return fail(res, 400, 'userId is required');
      // Do the work before writing the status. Writing 201 first meant a
      // duplicate threw *after* the headers were out, and the catch below then
      // tried to send 409 — ERR_HTTP_HEADERS_SENT, uncaught, server gone.
      const student = await provisionStudent(state, userId, { name });
      const token = await issueStudentToken(state, student.id);
      res.writeHead(201);
      return res.end(JSON.stringify({ ...student, token }));
    }

    if (req.method === 'PATCH') {
      if (!id) return fail(res, 400, 'id is required');
      return json(res, { id, token: await issueStudentToken(state, id) });
    }

    if (req.method === 'DELETE') {
      if (!id) return fail(res, 400, 'id is required');
      return json(res, await decommissionStudent(state, id));
    }

    return fail(res, 405, 'Method not allowed');
  } catch (err) {
    // A typo in an id should not look like an outage.
    const message = err.message || 'Provisioning failed';
    if (/Invalid student id/.test(message)) return fail(res, 400, message);
    if (/already exists/i.test(message)) return fail(res, 409, message);
    if (/not found/i.test(message)) return fail(res, 404, message);
    console.error('[admin]', err);
    return fail(res, 500, message);
  }
}

function fail(res, status, error) {
  // An error path is the worst place to take the process down. If something
  // already replied, log and close rather than throwing ERR_HTTP_HEADERS_SENT
  // out of an async handler, where nothing catches it.
  if (res.headersSent) {
    console.error(`[admin] ${status} after response already sent: ${error}`);
    return res.end();
  }
  res.writeHead(status);
  return res.end(JSON.stringify({ error }));
}

async function studentStats(student) {
  const theirs = state.forStudent(student.id);
  try {
    const progress = await theirs.readProgress();
    const active = progress?.active_topics || [];
    const topics = [];
    for (const slug of active) {
      const p = await theirs.getTopicProgress(slug);
      if (p) topics.push({ slug, ...p });
    }
    return {
      ...student,
      active_topics: active,
      topics,
      lessons_completed: topics.reduce((n, t) => n + t.completed, 0),
      last_session: progress?.history?.at(-1)?.date ?? null,
    };
  } finally {
    theirs.close?.();
  }
}

// ── API handlers ────────────────────────────────────────────

async function handleAPI(req, res, url) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control','private, no-store');

  if(url.pathname==='/api/catalog' && req.method==='GET')return json(res,publicCatalog(ROOT));
  if (url.pathname === '/api/account') return mountHandler(req, res, accountHandler({ getStore: async () => state }));
  if (url.pathname === '/api/openrouter') return mountHandler(req, res, openrouterHandler({ getStore: async (id) => (id == null ? state : state.forStudent(id)) }));
  if (url.pathname === '/api/demo') return mountHandler(req, res, demoHandler({ getStore: async () => state, host: () => chatAdapter }));
  // Admin routes are checked first and against their own secret. Falling
  // through the student gate would mean an admin needed both passwords, and
  // would put student credentials on the path to provisioning.
  if (url.pathname.startsWith('/api/admin/')) return handleAdmin(req, res, url);

  const auth = await authenticateRequest(req, () => state);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    res.writeHead(status);
    return res.end(JSON.stringify(body));
  }

  try {
    const rootState = state;
    return await handleStudentAPI(req, res, url, auth.userId == null ? rootState : rootState.forStudent(auth.userId));
  } catch (err) {
    console.error('[api]', err.message);
    return fail(res, 500, 'The tutor is unavailable right now. Please try again.');
  }
}

async function handleStudentAPI(req, res, url, state) {
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
      if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(slug)) return fail(res, 400, 'Invalid topic slug');
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

      // Awaited even though TutorStore is synchronous: awaiting a plain value
      // is a no-op, and `promise || ''` is truthy, so an unawaited read would
      // hand buildStudentModel a Promise and silently model nothing.
      const topics = (await Promise.all(activeTopics.map(async (slug) => {
        const tp = await state.getTopicProgress(slug);
        if (!tp) return null;
        const learningMd = (await state.readDomainFile(slug, 'learning.md')) || '';
        const curriculum = await state.readCurriculum(slug);
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
      }))).filter(Boolean);

      return json(res, { ...progress, streak, topics });
    }

    // POST /api/lesson — one turn of the Socratic lesson (same implementation as the Vercel route).
    // Streams over SSE when the client asks for it; plain JSON otherwise.
    if (req.method === 'POST' && url.pathname === '/api/lesson') {
      const payload = JSON.parse(await readBody(req, res));
      if (payload.answer !== null && payload.answer !== undefined) {
        const text = turnText(payload.answer);
        if (text === null) return fail(res, 400, 'An answer must be text of at most 4,000 characters.');
        payload.answer = text;
      }
      const wantsStream = (req.headers.accept || '').includes('text/event-stream');
      const ctx = {
        state,
        adapter: await adapterFor({ state, use: payload.answer != null ? 'lesson-continue' : 'lesson-start', host: () => chatAdapter }),
        skills,
      };

      if (!wantsStream) {
        const { status, body } = await lessonTurn(ctx, payload);
        res.writeHead(status);
        return res.end(JSON.stringify(body, null, 2));
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

      try {
        const { status, body } = await lessonTurn(
          ctx,
          payload,
          { onToken: (t) => send('token', t) },
        );
        send(status === 200 ? 'done' : 'error', body);
      } catch (err) {
        if (!(err instanceof KeyRequired)) console.error('[lesson]', err.message);
        send('error', err instanceof KeyRequired ? err.body : { error: 'The tutor is unavailable right now. Please try again.' });
      }
      return res.end();
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
      const body = await readBody(req, res);
      const data = JSON.parse(body);
      const profile = buildUserProfile(data);
      await state.writeUser(profile);
      return json(res, { ok: true });
    }

    // POST /api/onboard — guided onboarding chat (same implementation as the Vercel route).
    if (req.method === 'POST' && url.pathname === '/api/onboard') {
      const payload = JSON.parse(await readBody(req, res));
      const ctx = { state, skills, getAdapter: () => adapterFor({ state, use: 'onboarding', host: () => chatAdapter }) };
      const { status, body } = await onboardTurn(ctx, payload);
      res.writeHead(status);
      return res.end(JSON.stringify(body, null, 2));
    }

    // POST /api/chat — free-form chat
    if (req.method === 'POST' && url.pathname === '/api/chat') {
      const body = await readBody(req, res);
      const { message } = JSON.parse(body);

      const user = await state.readUser();
      const system = [
        '## Study Buddy\n\nYou are a warm, sharp study buddy. Be concise. 1-3 sentences for simple questions.',
        user ? `## Student\n\n${user}` : '',
      ].filter(Boolean).join('\n\n---\n\n');

      const adapter = await adapterFor({ state, use: 'chat', host: () => chatAdapter });
      const response = await adapter.generate(
        system + '\n\nReturn only polished text.',
        [{ role: 'user', content: message }],
        { model: 'cheap' },
      );

      return json(res, { reply: response.text, model: response.model });
    }

    if (req.method === 'GET' && url.pathname === '/api/topic-build') {
      try {
        const slug = url.searchParams.get('slug');
        if (slug == null) return json(res, await listTopicBuilds(state));
        const doc = await readTopicBuild(state, slug);
        return doc ? json(res, buildSummary(doc)) : fail(res, 404, 'No build found');
      } catch (err) { return fail(res, /Invalid topic slug/.test(err.message) ? 400 : 500, 'Could not read build status'); }
    }

    // Both surfaces return usable starter lessons while durable enrichment runs.
    if (req.method === 'POST' && url.pathname === '/api/add-topic') {
      try {
        const payload = JSON.parse(await readBody(req, res));
        const result = await addTopic({ state, getAdapter: () => adapterFor({ state, use: 'custom-topic', host: () => pipelineAdapter }), skills, enqueue: buildWorker.enqueue }, payload);
        res.writeHead(result.lessonCount ? 200 : 202);
        return res.end(JSON.stringify(result));
      } catch (err) {
        if (err instanceof KeyRequired) return keyRequired(res, err);
        return fail(res, /topic name|Invalid topic slug|Invalid level/.test(err.message) ? 400 : 503, err.message);
      }
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Unknown API endpoint' }));
  } catch (err) {
    if (err instanceof KeyRequired) return keyRequired(res, err);
    console.error('[api] error:', err);
    // fail() is the headersSent-safe path (#138): a readBody() rejection
    // (413 already answered) must not retry res.writeHead() and crash.
    return fail(res, 500, 'The tutor is unavailable right now. Please try again.');
  }
}

// ── Helpers ─────────────────────────────────────────────────

function json(res, data) {
  res.writeHead(200);
  res.end(JSON.stringify(data, null, 2));
}

// The Vercel-style handlers expect req.body and res.status().json().
async function mountHandler(req, res, handler) {
  try { req.body = req.method === 'POST' ? JSON.parse(await readBody(req, res) || '{}') : {}; }
  catch { return fail(res, 400, 'Invalid request body'); }
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => { res.end(JSON.stringify(body)); return res; };
  return handler(req, res);
}

function keyRequired(res, err) {
  res.writeHead(402);
  return res.end(JSON.stringify(err.body));
}

// #138 — every route reads its body through here, so this is the one place
// that needs to bound it. A default local install has no password, and
// mountHandler (below) reads /api/account, /api/openrouter and /api/demo before
// any authentication, so an unlimited buffer here is an unauthenticated way to
// grow the process's memory until it dies.
const BODY_LIMIT = 1_048_576; // 1 MiB — far above any real request here

function readBody(req, res) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;

    req.on('data', (chunk) => {
      // Count bytes on the raw Buffer, not Content-Length (never sent, or lied
      // about) and not string length (wrong once multi-byte UTF-8 is split
      // across a chunk boundary).
      if (tooLarge) return; // already over: keep draining, just don't store
      if (size + chunk.length > BODY_LIMIT) { tooLarge = true; chunks.length = 0; return; } // drop what was kept; never buffer past the limit
      size += chunk.length;
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (!tooLarge) return resolve(Buffer.concat(chunks).toString('utf-8'));
      // Answer before closing, and only close once the peer has finished
      // uploading: an HTTP/1.1 client that is still mid-upload when the
      // socket closes gets a TCP reset instead of the response, which loses
      // it. Draining to `end` first (bytes are discarded, never buffered)
      // means there is nothing left unread when `Connection: close` tears
      // the socket down, so the 413 reliably reaches the client.
      // A peer that never ends its upload holds only a socket (nothing past
      // the limit is stored), and server.requestTimeout below closes it.
      if (res && !res.headersSent) {
        res.writeHead(413, { 'Content-Type': 'application/json', Connection: 'close' });
        res.end(JSON.stringify({ error: 'Request body too large.' }));
      }
      reject(new Error('Request body too large.'));
    });

    req.on('error', reject);
  });
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
