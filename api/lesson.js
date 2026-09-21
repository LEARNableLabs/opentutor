/**
 * Socratic lesson endpoint — stateful multi-turn conversation.
 *
 * POST { topicSlug }          → starts lesson, returns first question
 * POST { topicSlug, answer }  → continues lesson, returns next step
 *
 * Active lesson state stored in KV (SQLite or Supabase).
 */

import { getState, getAdapter, getSkills } from './_lib/init.js';
import { checkAuth, authFailure } from './_lib/auth.js';
import { buildLessonPlanPrompt, buildSocraticResponsePrompt } from '../lib/core/prompts.js';
import { buildStudentModel, formatStudentModel } from '../lib/core/student-model.js';
import { completeLesson } from '../lib/core/lesson-completion.js';

const STEPS = ['retrieval', 'diagnostic', 'followUp', 'application'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const auth = checkAuth(req);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }

  try {
    const { status, body } = await lessonTurn(
      { state: await getState(), adapter: getAdapter(), skills: getSkills() },
      req.body || {},
    );
    res.status(status).json(body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * One turn of the web lesson. Shared by this route and the local server
 * (scripts/web/server.js) so the two cannot drift apart again.
 */
export async function lessonTurn({ state, adapter, skills }, { topicSlug, answer }) {
  if (!topicSlug) return { status: 400, body: { error: 'topicSlug required' } };

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
      { model: responsePrompt.model },
    );

    const scored = response.text.match(/<assessment>([\s\S]*?)<\/assessment>/);
    if (scored) {
      try { (active.assessments ||= []).push({ step: stepName, ...JSON.parse(scored[1]) }); } catch { /* unparseable */ }
    }
    const reply = response.text.replace(/<assessment>[\s\S]*?<\/assessment>\s*/g, '').trim();
    active.history.push({ role: 'assistant', content: reply });
    active.step++;

    const done = active.step >= STEPS.length;

    if (done) {
      const day = active.lessonDay;
      // Grade the session, write the learning log, run the practitioner — the
      // adaptive half the web path used to skip entirely (#106).
      await safely(() => completeLesson({
        state,
        topicSlug: active.topicSlug,
        lesson: { ...active.lesson, lesson: day },
        session: active,
      }));
      await state.deleteKV(kvKey);
    } else {
      await state.writeKV(kvKey, JSON.stringify(active));
    }

    return { status: 200, body: { reply, step: active.step, totalSteps: STEPS.length, done, lesson: active.lesson } };
  }

  // ── Start new lesson ──────────────────────────────────────
  const lesson = await safely(() => state.getNextLesson(topicSlug));
  if (!lesson) {
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

async function safely(fn, fallback = null) {
  try { return await fn(); } catch { return fallback; }
}
