/**
 * Socratic lesson endpoint — stateful multi-turn conversation.
 *
 * POST { topicSlug }          → starts lesson, returns first question; with one in
 *                                progress, returns where it stands (`resumed: true`)
 * POST { topicSlug, answer }  → continues lesson, returns next step
 *
 * Active lesson state stored in KV (SQLite or Supabase).
 */

import { getState, getAdapter, getSkills } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { adapterFor, turnText, KeyRequired } from '../lib/core/llm-access.js';
import { buildLessonPlanPrompt, buildSocraticResponsePrompt } from '../lib/core/prompts.js';
import { buildStudentModel, formatStudentModel } from '../lib/core/student-model.js';
import { completeLesson } from '../lib/core/lesson-completion.js';
import { parseDirectives } from '../lib/core/deliberate-practice.js';
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
    const state = await getState(auth.userId);
    const body = req.body || {};
    if (body.answer !== null && body.answer !== undefined) {
      const text = turnText(body.answer);
      if (text === null) return res.status(400).json({ error: 'An answer must be text of 1 to 4,000 characters.' });
      body.answer = text;
    }
    // Resolved only when the turn needs the model, so resuming a lesson never meets the
    // trial check (#159). A refusal is a 402 here, and an error event once streaming.
    const use = body.answer != null ? 'lesson-continue' : 'lesson-start';
    const ctx = { state, skills: getSkills(), getAdapter: () => adapterFor({ state, use, host: getAdapter }) };

    if (!String(req.headers?.accept || '').includes('text/event-stream')) {
      const { status, body: out } = await lessonTurn(ctx, body);
      return res.status(status).json(out);
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    // Headers are out: every failure from here on is an event, never a second status.
    try {
      const { status, body: out } = await lessonTurn(ctx, body, { onToken: (t) => send('token', t) });
      send(status === 200 ? 'done' : 'error', out);
    } catch (err) {
      if (!(err instanceof KeyRequired)) console.error('[lesson]', err.message);
      send('error', err instanceof KeyRequired ? err.body : { error: 'The tutor is unavailable right now. Please try again.' });
    }
    res.end();
  } catch (err) {
    if (err instanceof KeyRequired) return res.status(402).json(err.body);
    console.error('[lesson]', err.message);
    res.status(500).json({ error: 'The tutor is unavailable right now. Please try again.' });
  }
}

/**
 * One turn of the web lesson. Shared by this route and the local server
 * (scripts/web/server.js) so the two cannot drift apart again.
 * `getAdapter` is called only for a model call, the way onboardTurn does it.
 */
export async function lessonTurn({ state, getAdapter, skills }, { topicSlug, answer }, { onToken } = {}) {
  // The grading block streams first, so it is filtered before the student sees anything.
  const stream = onToken ? { onToken: assessmentFilter(onToken) } : {};
  if (typeof topicSlug !== 'string' || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(topicSlug)) {
    return { status: 400, body: { error: 'A valid topicSlug is required' } };
  }

  const kvKey = `web_lesson:${topicSlug}`;
  const activeRaw = await state.readKV(kvKey);
  const active = typeof activeRaw === 'string' ? JSON.parse(activeRaw) : activeRaw;
  // A lesson saved before #148 has no step list of its own.
  const steps = active?.steps || STEPS;

  // ── Continue active lesson ────────────────────────────────
  if (answer !== undefined && answer !== null) {
    if (!active) {
      return { status: 400, body: { error: 'No active lesson. Start one without an answer field.' } };
    }

    const stepName = steps[active.step];
    if (!stepName) {
      await state.deleteKV(kvKey);
      return { status: 200, body: { done: true, message: 'Lesson already complete.' } };
    }

    active.history.push({ role: 'user', content: answer });

    const user = await safely(() => state.readUser(), '');
    const responsePrompt = buildSocraticResponsePrompt(active.plan, answer, stepName, user, { final: active.step === steps.length - 1 });
    const adapter = await getAdapter();
    const response = await adapter.generate(
      responsePrompt.system + '\n\nReturn only polished text.',
      active.history,
      { model: responsePrompt.model, ...stream },
    );

    const { assessment, visible: reply } = parseAssessment(response.text);
    if (assessment) (active.assessments ||= []).push({ step: stepName, ...assessment });
    active.history.push({ role: 'assistant', content: reply });
    active.reply = reply;
    active.step++;

    const done = active.step >= steps.length;
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
        totalSteps: steps.length,
        done,
        lesson: active.lesson,
        // Telling a student "done" for work that was not recorded is worse than
        // telling them it did not save. They can at least decide what to do.
        ...(saved === FAILED ? { warning: 'This lesson could not be saved — your progress may not be recorded.' } : {}),
      },
    };
  }

  // ── Resume the lesson in progress (#159) ──────────────────
  // A reload used to plan a new lesson over it: a model call, and a trial student's
  // free lesson. A lesson saved before #159 has no reply to show, so it is planned anew.
  if (active?.reply != null) {
    return { status: 200, body: { reply: active.reply, step: active.step, totalSteps: steps.length, done: false, lesson: active.lesson, resumed: true } };
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

  // Awaited here, never read by the planner from the store: on SupabaseStore an
  // unawaited read is a Promise, and the planner got "[object Promise]" (#146).
  const [teacherConfig, teachingNotes, conceptMap, feedback] = await Promise.all(
    ['teacher.md', 'teaching-notes.md', 'concept-map.md', 'practice-feedback.md']
      .map((file) => safely(() => state.readDomainFile(topicSlug, file), null, `read ${file}`)),
  );
  const directives = parseDirectives(feedback);
  const planPrompt = buildLessonPlanPrompt(skills, lesson, {
    teacherConfig, teachingNotes, conceptMap, user, studentModel: modelText, directives,
  });
  const adapter = await getAdapter();
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

  // The planner is asked to open on this retest, but its plan can leave it out,
  // and the fallback above has none. Same order as the planner's instruction.
  const retest = directives.find((d) => d.type === 'REVISIT') || directives.find((d) => d.type === 'BLOCK');
  const hasRetrieval = typeof plan.retrieval === 'string' && plan.retrieval.trim();
  if (retest && !hasRetrieval) plan.retrieval = `Before we start — what is ${retest.target} and why does it matter?`;
  // #148: no retrieval question, no retrieval step. The lesson opens on the diagnostic,
  // and the first answer is graded as the diagnostic, not as a retrieval check.
  const lessonSteps = hasRetrieval || retest ? STEPS : STEPS.filter((s) => s !== 'retrieval');
  const goalPrefix = plan.goal ? `**Goal:** ${plan.goal}\n\n` : '';

  const started = {
    topicSlug,
    lessonDay,
    lesson: { day: lessonDay, title: lesson.title, module: lesson.module, concepts: lesson.concepts },
    plan,
    steps: lessonSteps,
    step: 0,
    reply: goalPrefix + plan[lessonSteps[0]],
    history: [],
    assessments: [],
  };

  await state.writeKV(kvKey, JSON.stringify(started));

  return { status: 200, body: { reply: started.reply, step: 0, totalSteps: lessonSteps.length, done: false, lesson: started.lesson } };
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
