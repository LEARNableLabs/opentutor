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
import { parseDirectives, reviewLesson } from '../lib/core/deliberate-practice.js';
import { parseAssessment, assessmentFilter } from '../lib/core/assessment.js';

const STEPS = ['retrieval', 'diagnostic', 'followUp', 'application'];
// Review lessons in a row for one blocked concept before the next lesson goes ahead (#149).
const MAX_REVIEWS = 2;

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

  // One record per topic: the lesson in flight, if any, and the reviews an open BLOCK has had
  // on the current lesson (#149). One record, so starting a review is a single write.
  const kvKey = `web_lesson:${topicSlug}`;
  const raw = await state.readKV(kvKey);
  const record = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const active = record?.plan ? record : null; // a record without a plan only counts reviews
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

    // A grading block in an answer could have it grade itself (#224). Only a block holding JSON is
    // one: other markup, an XML lesson's own <assessment> element included, is the student's answer.
    const said = answer.replace(/<\s*assessment\b[^>]*>\s*\{[\s\S]*?\}\s*<\s*\/\s*assessment\s*>/gi, '').trim();
    if (!said) return { status: 400, body: { error: 'An answer must be text of 1 to 4,000 characters.' } };
    active.history.push({ role: 'user', content: said });

    const user = await safely(() => state.readUser(), '');
    const course = active.course || String(active.topicSlug || '').replace(/-/g, ' '); // saved before #225: the slug
    const responsePrompt = buildSocraticResponsePrompt(active.plan, said, stepName, user, { final: active.step === steps.length - 1, markdown: true, course });
    const adapter = await getAdapter();
    const response = await adapter.generate(
      responsePrompt.system + '\n\nReturn only polished text.',
      active.history,
      { model: responsePrompt.model, ...stream },
    );

    const { assessment, visible } = parseAssessment(response.text);
    // A reply that was nothing but a broken grade still says something, never an empty bubble.
    const reply = visible || "Thanks, noted. Let's keep going.";
    if (assessment) (active.assessments ||= []).push({ step: stepName, ...assessment });
    // The tutor's turns keep their grade in the history it is sent: turns shown to it without one
    // taught it to stop grading, about 1 step in 6 (#224). The student only ever sees `reply`.
    active.history.push({ role: 'assistant', content: response.text });
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
      // A finished review leaves its count behind for the next start; a lesson leaves nothing.
      if (active.isReview) await state.writeKV(kvKey, JSON.stringify({ reviews: active.reviews }));
      else await state.deleteKV(kvKey);
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
  // free lesson. A new one is planned only when there is nothing to show.
  const shown = active && lastShown(active);
  if (shown != null) {
    return { status: 200, body: { reply: shown, step: active.step, totalSteps: steps.length, done: false, lesson: active.lesson, resumed: true } };
  }

  // ── Start new lesson ──────────────────────────────────────
  // Not wrapped in safely(): a failed read here is not "no lesson", and answering
  // "no curriculum yet" or "all lessons completed" for it would be false (#170).
  // The error reaches the route, which answers its generic 500.
  let lesson = await state.getNextLesson(topicSlug);
  let allDone = false;
  if (!lesson) {
    // getNextLesson returns null for two very different situations, and saying
    // "all lessons completed" for both congratulated students on topics whose
    // curriculum was never built (#118). Ask the curriculum which one it is.
    const curriculum = await state.readCurriculum(topicSlug);
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
    // Every lesson is done, but an open BLOCK still gets its reviews first, placed at the last lesson.
    lesson = curriculum.lessons.at(-1);
    allDone = true;
  }

  const lessonDay = lesson.day || lesson.lesson;
  const curriculum = await safely(() => state.readCurriculum(topicSlug));
  // The tutor is told the course, so a profile about another subject can't take the lesson over (#225).
  const course = curriculum?.topic || topicSlug.replace(/-/g, ' ');
  // Not safely(): an unreadable feedback file is not "no BLOCK", and reading it as one
  // would let the student past the BLOCK. The error reaches the route's generic 500.
  const directives = parseDirectives(await state.readDomainFile(topicSlug, 'practice-feedback.md'));

  // #149: an open BLOCK holds the student back, as the bot does: a review lesson on the
  // blocked concept instead of the next lesson. It plans nothing (no model call), it is not
  // a completion, and completeLesson releases the BLOCK when its retest passes (passedReview).
  // The bot releases it after any review; here a student who keeps missing the concept gets
  // MAX_REVIEWS in a row, then the next lesson, which still opens on the retest. The count
  // belongs to the lesson it holds back, so finishing that lesson starts a new one, and it is
  // saved with its review in one write: a failed write leaves neither, and two overlapping
  // starts write the same review and count (a review is deterministic and plans nothing).
  const block = directives.find((d) => d.type === 'BLOCK');
  let note;
  if (block) {
    const held = record?.reviews;
    const reviews = held?.concept === block.target && held.day === lessonDay ? held.count : 0;
    if (reviews < MAX_REVIEWS) {
      const { plan, steps } = reviewLesson(block.target);
      const review = {
        topicSlug,
        lessonDay,
        lesson: { day: lessonDay, title: `Review: ${block.target}`, module: lesson.module, concepts: [block.target], review: true },
        plan,
        steps,
        step: 0,
        reply: withGoal(plan, `Explain **${block.target}** in your own words: what is it, and why does it matter?`),
        history: [],
        assessments: [],
        isReview: true,
        reviewConcept: block.target,
        course,
        reviews: { concept: block.target, day: lessonDay, count: reviews + 1 },
      };
      await state.writeKV(kvKey, JSON.stringify(review));
      return {
        status: 200,
        body: { reply: review.reply, step: 0, totalSteps: steps.length, done: false, lesson: review.lesson, note: `Let's revisit ${block.target} before moving on.` },
      };
    }
    note = `Let's move on for now. We'll keep coming back to ${block.target}.`;
  }
  if (allDone) return { status: 200, body: { done: true, message: 'All lessons completed!' } };

  const learningMd = (await safely(() => state.readDomainFile(topicSlug, 'learning.md'), '')) || '';
  const user = await safely(() => state.readUser(), '');
  const studentModel = buildStudentModel(learningMd, curriculum, user);
  const modelText = formatStudentModel(studentModel);

  // Awaited here, never read by the planner from the store: on SupabaseStore an
  // unawaited read is a Promise, and the planner got "[object Promise]" (#146).
  const [teacherConfig, teachingNotes, conceptMap] = await Promise.all(
    ['teacher.md', 'teaching-notes.md', 'concept-map.md']
      .map((file) => safely(() => state.readDomainFile(topicSlug, file), null, `read ${file}`)),
  );

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

  const started = {
    topicSlug,
    lessonDay,
    lesson: { day: lessonDay, title: lesson.title, module: lesson.module, concepts: lesson.concepts },
    plan,
    steps: lessonSteps,
    step: 0,
    reply: withGoal(plan, plan[lessonSteps[0]]),
    history: [],
    assessments: [],
    course,
  };

  await state.writeKV(kvKey, JSON.stringify(started));

  return { status: 200, body: { reply: started.reply, step: 0, totalSteps: lessonSteps.length, done: false, lesson: started.lesson, ...(note ? { note } : {}) } };
}

// ── Helpers ────────────────────────────────────────────────
//
// Store methods are sync on TutorState/TutorStore and async on SupabaseStore,
// so everything here is awaited — awaiting a plain value is a no-op.

const FAILED = Symbol('failed');

const withGoal = (plan, question) => (plan.goal ? `**Goal:** ${plan.goal}\n\n` : '') + question;

// What the student last saw of a lesson in progress, or null. One saved before #159 has
// no `reply`: its last tutor message, or at step 0 the opening question the old code sent.
function lastShown({ reply, history, step, plan }) {
  if (reply != null) return reply;
  const last = history?.findLast((m) => m.role === 'assistant');
  if (last) return parseAssessment(last.content).visible; // the history keeps the tutor's grades (#224)
  const opening = step === 0 && (plan?.retrieval || plan?.diagnostic);
  return opening ? withGoal(plan, opening) : null;
}

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
