/**
 * Socratic lesson endpoint — stateful multi-turn conversation.
 *
 * POST { topicSlug }          → starts lesson, returns first question
 * POST { topicSlug, answer }  → continues lesson, returns next step
 *
 * Active lesson state stored in KV (SQLite or Supabase).
 */

import { getState, getAdapter, getSkills } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { buildLessonPlanPrompt, buildSocraticResponsePrompt } from '../lib/core/prompts.js';
import { buildStudentModel, formatStudentModel } from '../lib/core/student-model.js';
import { completeLesson } from '../lib/core/lesson-completion.js';
import { parseAssessment, assessmentFilter } from '../lib/core/assessment.js';

const STEPS = ['retrieval', 'diagnostic', 'followUp', 'application'];

export default async function handler(req, res) {
  res.setHeader?.('Cache-Control','private, no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const auth = await authenticateRequest(req, getState);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }

  try {
    const ctx = { state: await getState(auth.userId), adapter: getAdapter(), skills: getSkills() };

    if (!String(req.headers?.accept || '').includes('text/event-stream')) {
      const { status, body } = await lessonTurn(ctx, req.body || {});
      return res.status(status).json(body);
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    const { status, body } = await lessonTurn(ctx, req.body || {}, { onToken: (t) => send('token', t) });
    send(status === 200 ? 'done' : 'error', body);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * One turn of the web lesson. Shared by this route and the local server
 * (scripts/web/server.js) so the two cannot drift apart again.
 */
export async function lessonTurn({ state, adapter, skills }, { topicSlug, answer }, { onToken } = {}) {
  // The grading block streams first, so it is filtered before the student sees anything.
  const stream = onToken ? { onToken: assessmentFilter(onToken) } : {};
  if (typeof topicSlug !== 'string' || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(topicSlug)) {
    return { status: 400, body: { error: 'A valid topicSlug is required' } };
  }

  const kvKey = `web_lesson:${topicSlug}`;

  // ── Continue active lesson ────────────────────────────────
  if (answer !== undefined && answer !== null) {
    const activeRaw = await state.readKV(kvKey);
    if (!activeRaw) {
      return { status: 400, body: { error: 'No active lesson. Start one without an answer field.' } };
    }

    const active = typeof activeRaw === 'string' ? JSON.parse(activeRaw) : activeRaw;
    const stepName = STEPS[active.step];
    if (!stepName) {
      await state.deleteKV(kvKey);
      return { status: 200, body: { done: true, message: 'Lesson already complete.' } };
    }

    active.history.push({ role: 'user', content: answer });

    const user = await safely(() => state.readUser(), '');
    const responsePrompt = buildSocraticResponsePrompt(active.plan, answer, stepName, user);
    const response = await adapter.generate(
      responsePrompt.system + '\n\nReturn only polished text.',
      active.history,
      { model: responsePrompt.model, ...stream },
    );

    const { assessment, visible: reply } = parseAssessment(response.text);
    if (assessment) (active.assessments ||= []).push({ step: stepName, ...assessment });
    active.history.push({ role: 'assistant', content: reply });
    active.step++;

    const done = active.step >= STEPS.length;
    let saved;

    if (done) {
      const day = active.lessonDay;
      // Grade the session, write the learning log, run the practitioner — the
      // adaptive half the web path used to skip entirely (#106).
      saved = await safely(() => completeLesson({
        state,
        topicSlug: active.topicSlug,
        lesson: { ...active.lesson, lesson: day },
        session: active,
      }), FAILED, 'completeLesson');
      await state.deleteKV(kvKey);
    } else {
      await state.writeKV(kvKey, JSON.stringify(active));
    }

    return {
      status: 200,
      body: {
        reply,
        step: active.step,
        totalSteps: STEPS.length,
        done,
        lesson: active.lesson,
        // Telling a student "done" for work that was not recorded is worse than
        // telling them it did not save. They can at least decide what to do.
        ...(saved === FAILED ? { warning: 'This lesson could not be saved — your progress may not be recorded.' } : {}),
      },
    };
  }

  // ── Start new lesson ──────────────────────────────────────
  const lesson = await safely(() => state.getNextLesson(topicSlug), null, 'getNextLesson');
  if (!lesson) {
    // getNextLesson returns null for two very different situations, and saying
    // "all lessons completed" for both congratulated students on topics whose
    // curriculum was never built (#118). Ask the curriculum which one it is.
    const curriculum = await safely(() => state.readCurriculum(topicSlug), null, 'readCurriculum');
    if (!curriculum?.lessons?.length) {
      return {
        status: 404,
        body: {
          error: `No curriculum for "${topicSlug}" yet.`,
          topicSlug,
          status: 'missing',
          hint: 'It may still be building, or the build may have failed. Try adding the topic again.',
        },
      };
    }
    return { status: 200, body: { done: true, message: 'All lessons completed!' } };
  }

  const lessonDay = lesson.day || lesson.lesson;
  const learningMd = (await safely(() => state.readDomainFile(topicSlug, 'learning.md'), '')) || '';
  const curriculum = await safely(() => state.readCurriculum(topicSlug));
  const user = await safely(() => state.readUser(), '');
  const studentModel = buildStudentModel(learningMd, curriculum, user);
  const modelText = formatStudentModel(studentModel);

  const planPrompt = buildLessonPlanPrompt(state, skills, lesson, topicSlug, modelText);
  const planResponse = await adapter.generate(
    planPrompt.system + '\n\nReturn exactly one valid JSON value.',
    [{ role: 'user', content: `Plan a Socratic lesson for Day ${lessonDay}: "${lesson.title}"` }],
    { model: 'strong' },
  );

  let plan;
  try {
    plan = JSON.parse(planResponse.text.match(/\{[\s\S]*\}/)[0]);
  } catch {
    plan = {
      diagnostic: `What do you already know about ${(lesson.concepts || []).join(' and ')}?`,
      goal: lesson.title,
      followUp: 'Can you give an example?',
      application: 'How would you apply this?',
      commonMisconceptions: [],
    };
  }

  const active = {
    topicSlug,
    lessonDay,
    lesson: { day: lessonDay, title: lesson.title, module: lesson.module, concepts: lesson.concepts },
    plan,
    step: 0,
    history: [],
    assessments: [],
  };

  await state.writeKV(kvKey, JSON.stringify(active));

  const firstMessage = plan.retrieval || plan.diagnostic;
  const goalPrefix = plan.goal ? `**Goal:** ${plan.goal}\n\n` : '';

  return { status: 200, body: { reply: goalPrefix + firstMessage, step: 0, totalSteps: STEPS.length, done: false, lesson: active.lesson } };
}

// ── Helpers ────────────────────────────────────────────────
//
// Store methods are sync on TutorState/TutorStore and async on SupabaseStore,
// so everything here is awaited — awaiting a plain value is a no-op.

const FAILED = Symbol('failed');

async function safely(fn, fallback = null, label = 'step') {
  try {
    return await fn();
  } catch (err) {
    // Swallowing is deliberate: a grading failure must not cost the student the
    // lesson they just did. Swallowing *invisibly* is what made #117 possible —
    // every completion on the serverless build was discarded by this line, with
    // no signal anywhere, because the disk is read-only and nobody logged it.
    console.error(`[lesson] ${label} failed: ${err.message}`);
    return fallback;
  }
}
