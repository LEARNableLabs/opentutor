/**
 * Socratic lesson delivery — multi-turn conversation, not content dump.
 *
 * Flow:
 *   1. Generate lesson plan (1 strong call): diagnostic, concept, follow-up, application
 *   2. Send diagnostic question → wait for free-text answer
 *   3. Claude reads answer → tailored response + follow-up → wait
 *   4. Claude reads answer → feedback + application challenge → wait
 *   5. Claude reads answer → specific feedback → lesson complete
 *
 * Each step is a short Claude call that reads the student's actual answer.
 */

import fs from 'fs';
import path from 'path';
import { generate } from './claude.js';
import { buildLessonPlanPrompt, buildSocraticResponsePrompt } from '../../lib/core/prompts.js';
import { buildStudentModel, formatStudentModel } from '../../lib/core/student-model.js';
import { evaluatePractice, formatPracticeFeedback, parseDirectives, applyDirectives } from '../../lib/core/deliberate-practice.js';
import { getNextLesson, markLessonComplete, readCurriculum, readDomainFile, writeDomainFile, readUser, appendMemory } from './state.js';
import { PATHS } from './config.js';
import { appendMessage } from './session.js';
import { registerLessonConcepts, getDueReviews, recordReview } from './spaced-repetition.js';
import { TutorState } from '../../lib/core/state.js';
import { log } from './logger.js';

const coreState = new TutorState(PATHS.root);

// ── Active lessons (in-flight Socratic conversations) ──────

const activeLessons = {};

const STEPS = ['retrieval', 'diagnostic', 'followUp', 'application'];

export function getActiveLesson(chatId) {
  return activeLessons[chatId] || null;
}

export function clearActiveLesson(chatId) {
  delete activeLessons[chatId];
}

// ── Main entry: generate plan and send diagnostic ──────────

export async function deliverNextLesson(topicSlug, chatId, channel, skills) {
  const lesson = getNextLesson(topicSlug);
  if (!lesson) {
    const curriculum = readCurriculum(topicSlug);
    await channel.sendMessage(chatId, `🎉 <b>You've completed all ${curriculum?.lessons?.length || 0} lessons in ${curriculum?.topic || topicSlug}!</b>\n\nType /quiz for a final review, or /add to start something new.`);
    return;
  }

  await channel.sendTyping(chatId);

  const lessonDay = lesson.day || lesson.lesson;
  const learningMd = readDomainFile(topicSlug, 'learning.md') || '';
  const curriculum = readCurriculum(topicSlug);
  const userProfile = readUser();

  // Read and enforce deliberate practice directives
  const feedbackMd = readDomainFile(topicSlug, 'practice-feedback.md') || '';
  const directives = parseDirectives(feedbackMd);
  const constraints = applyDirectives(directives);

  // BLOCK — if a concept must be retested before advancing
  if (constraints.blocked) {
    log.info({ topic: topicSlug, blocked: constraints.blockedConcept }, 'blocked by deliberate practice');
    await channel.sendMessage(chatId, `Before we move on, let's make sure you've got <b>${constraints.blockedConcept}</b> down.\n\nExplain it to me in your own words — what is it and why does it matter?`);

    activeLessons[chatId] = {
      topicSlug,
      lessonDay,
      lesson,
      plan: {
        diagnostic: `Explain "${constraints.blockedConcept}" in your own words.`,
        concept: `This concept is foundational for what comes next.`,
        followUp: `Can you give a concrete example of ${constraints.blockedConcept}?`,
        application: `How would you use this concept in a real situation?`,
        commonMisconceptions: [],
        goal: `Demonstrate solid understanding of ${constraints.blockedConcept}`,
      },
      step: 0,
      history: [],
      studentModel: buildStudentModel(learningMd, curriculum, userProfile),
      startedAt: Date.now(),
      isReview: true,
      reviewConcept: constraints.blockedConcept,
    };
    return;
  }

  log.info({ topic: topicSlug, lesson_id: lessonDay, title: lesson.title, constraints }, 'generating lesson plan');

  // Pick a concept for retrieval check (from SM-2 scheduler + REVISIT directives)
  const dueReviews = getDueReviews(topicSlug, 3);
  const revisitConcepts = constraints.revisitConcepts || [];
  const retrievalConcept = revisitConcepts[0]
    || dueReviews[0]?.concept
    || null;

  // Pick an interleave concept (from a different module than the current lesson)
  const completedLessons = curriculum?.lessons?.filter((l) => l.status === 'completed') || [];
  const otherModuleLessons = completedLessons.filter((l) => l.module !== lesson.module);
  const interleaveSource = otherModuleLessons.length > 0
    ? otherModuleLessons[Math.floor(Math.random() * otherModuleLessons.length)]
    : null;
  const interleaveConcept = interleaveSource?.concepts?.[0] || null;

  // Build student model + directives context
  const studentModel = buildStudentModel(learningMd, curriculum, userProfile);
  const modelText = formatStudentModel(studentModel);

  // Build directive context for the lesson planner
  const directiveContext = [];
  if (constraints.difficultyOverride) directiveContext.push(`DIFFICULTY OVERRIDE: set to ${constraints.difficultyOverride}`);
  if (constraints.formatOverride) directiveContext.push(`FORMAT OVERRIDE: use ${constraints.formatOverride} format`);
  if (revisitConcepts.length) directiveContext.push(`REVISIT: weave in review of: ${revisitConcepts.join(', ')}`);
  if (constraints.requireGoal) directiveContext.push('GOAL REQUIRED: open with explicit testable goal, close with self-assessment');
  if (retrievalConcept) directiveContext.push(`RETRIEVAL: open with a retrieval check on "${retrievalConcept}" before the diagnostic`);
  if (interleaveConcept) directiveContext.push(`INTERLEAVE: connect the follow-up question to "${interleaveConcept}" from a different module`);
  directiveContext.push('SELF-EXPLANATION: in the application step, ask the student to explain the concept in their own words');
  const directiveText = directiveContext.length ? `\n\n## Deliberate Practice Directives\n${directiveContext.join('\n')}` : '';

  // Generate lesson plan (1 strong call)
  const planPrompt = buildLessonPlanPrompt(coreState, skills, lesson, topicSlug, modelText + directiveText);
  const planResponse = await generate(planPrompt.system, [
    { role: 'user', content: `Plan a Socratic lesson for Day ${lessonDay}: "${lesson.title}"` },
  ], { model: planPrompt.model, outputMode: planPrompt.outputMode });

  let lessonPlan;
  try {
    const jsonMatch = planResponse.text.match(/\{[\s\S]*\}/);
    lessonPlan = JSON.parse(jsonMatch[0]);
  } catch {
    log.error({ topic: topicSlug, lessonDay }, 'lesson plan parse failed, falling back');
    await channel.sendMessage(chatId, `Let's explore: <b>${lesson.title}</b>\n\nWhat do you already know about ${(lesson.concepts || []).join(' and ')}?`);
    lessonPlan = {
      diagnostic: `What do you already know about ${(lesson.concepts || []).join(' and ')}?`,
      concept: lesson.title,
      followUp: 'Can you think of a real-world example?',
      application: 'How would you explain this to someone else?',
      commonMisconceptions: [],
      goal: lesson.title,
    };
  }

  // Store active lesson state
  activeLessons[chatId] = {
    topicSlug,
    lessonDay,
    lesson,
    plan: lessonPlan,
    step: 0,
    history: [],
    studentModel,
    startedAt: Date.now(),
    retrievalConcept,
    interleaveConcept,
  };

  log.info({ topic: topicSlug, lessonDay, difficulty: lessonPlan.difficulty, retrieval: retrievalConcept, interleave: interleaveConcept }, 'lesson plan generated');

  // Send retrieval check or diagnostic
  if (retrievalConcept && lessonPlan.retrieval) {
    await channel.sendMessage(chatId, lessonPlan.retrieval);
    appendMessage(chatId, 'assistant', lessonPlan.retrieval);
  } else if (retrievalConcept) {
    const retrievalQ = `Before we start — quick check: what's <b>${retrievalConcept}</b> and why does it matter?`;
    await channel.sendMessage(chatId, retrievalQ);
    appendMessage(chatId, 'assistant', retrievalQ);
  } else {
    // Skip retrieval, go straight to diagnostic
    activeLessons[chatId].step = 1;
    const goalPrefix = lessonPlan.goal ? `<b>Goal:</b> ${lessonPlan.goal}\n\n` : '';
    await channel.sendMessage(chatId, goalPrefix + lessonPlan.diagnostic);
    appendMessage(chatId, 'assistant', lessonPlan.diagnostic);
  }
}

// ── Handle student's answer during a Socratic lesson ───────

export async function handleLessonAnswer(text, chatId, channel) {
  const active = activeLessons[chatId];
  if (!active) return false;

  await channel.sendTyping(chatId);

  const stepName = STEPS[active.step];
  active.history.push({ role: 'user', content: text });

  log.info({ topic: active.topicSlug, lessonDay: active.lessonDay, step: stepName }, 'student answered');

  // Handle retrieval step — update SM-2 before generating response
  if (stepName === 'retrieval' && active.retrievalConcept) {
    const quality = assessRetrievalQuality(text, active.retrievalConcept);
    recordReview(active.topicSlug, active.retrievalConcept, quality);
    log.info({ concept: active.retrievalConcept, quality }, 'retrieval recorded');
  }

  // Generate Socratic response (cheap call)
  const user = readUser();
  const responsePrompt = buildSocraticResponsePrompt(active.plan, text, stepName, user);
  const response = await generate(responsePrompt.system, [
    ...active.history,
  ], { model: responsePrompt.model, outputMode: responsePrompt.outputMode });

  active.history.push({ role: 'assistant', content: response.text });
  active.step++;

  // If transitioning from retrieval to diagnostic, prepend the goal
  if (STEPS[active.step] === 'diagnostic' && active.plan.goal) {
    const goalMsg = `<b>Today's goal:</b> ${active.plan.goal}`;
    await channel.sendMessage(chatId, response.text + '\n\n' + goalMsg + '\n\n' + active.plan.diagnostic);
    appendMessage(chatId, 'user', text);
    appendMessage(chatId, 'assistant', response.text);
    appendMessage(chatId, 'assistant', active.plan.diagnostic);
    active.history.push({ role: 'assistant', content: active.plan.diagnostic });
    active.step++; // skip diagnostic step since we just sent it
  } else {
    await channel.sendMessage(chatId, response.text);
    appendMessage(chatId, 'user', text);
    appendMessage(chatId, 'assistant', response.text);
  }

  // Check if lesson is complete
  if (active.step >= STEPS.length) {
    completeSocraticLesson(chatId, active, text);
  }

  return true;
}

function assessRetrievalQuality(answer, concept) {
  const words = answer.toLowerCase().split(/\s+/);
  const conceptWords = concept.toLowerCase().split(/\s+/);
  const overlap = conceptWords.filter((w) => words.some((aw) => aw.includes(w) || w.includes(aw)));

  if (answer.length < 10) return 'wrong';
  if (overlap.length >= conceptWords.length * 0.5 && answer.length > 30) return 'easy';
  if (overlap.length > 0) return 'hard';
  return 'wrong';
}

// ── Complete a Socratic lesson ─────────────────────────────

function completeSocraticLesson(chatId, active, lastAnswer) {
  const { topicSlug, lessonDay, lesson, plan, studentModel, startedAt } = active;

  const engagement = assessEngagement(active.history);

  // Skip marking complete if this was a review (BLOCK directive)
  if (!active.isReview) {
    appendMemory(`Socratic lesson completed: Day ${lessonDay} — ${lesson.title} (${topicSlug}). ${active.history.length} exchanges, engagement: ${engagement}`);
    markLessonComplete(topicSlug, lessonDay, engagement);

    if (lesson.concepts?.length) {
      registerLessonConcepts(topicSlug, lesson.concepts);
    }
  } else {
    appendMemory(`Review completed: ${active.reviewConcept} (${topicSlug}). Engagement: ${engagement}`);
  }

  writeLearningLog(topicSlug, lesson, active);

  // Run DeliberatePractitioner — evaluate and write directives
  try {
    const learningMd = readDomainFile(topicSlug, 'learning.md') || '';
    const curriculum = readCurriculum(topicSlug);
    const userProfile = readUser();
    const evaluation = evaluatePractice(learningMd, curriculum, userProfile);
    const feedback = formatPracticeFeedback(evaluation, curriculum?.topic || topicSlug);
    writeDomainFile(topicSlug, 'practice-feedback.md', feedback);

    const criticalDirectives = evaluation.directives.filter((d) => d.priority === 'critical' || d.priority === 'high');
    if (criticalDirectives.length) {
      log.info({ topic: topicSlug, directives: criticalDirectives.map((d) => `${d.type}:${d.target}`) }, 'deliberate practice directives issued');
    }
  } catch (err) {
    log.warn({ err, topic: topicSlug }, 'deliberate practice evaluation failed');
  }

  clearActiveLesson(chatId);

  log.info({
    topic: topicSlug,
    lessonDay,
    isReview: !!active.isReview,
    exchanges: active.history.length,
    engagement,
    duration_ms: Date.now() - startedAt,
  }, 'socratic lesson complete');
}

// ── Assess engagement from conversation ────────────────────

function assessEngagement(history) {
  const studentMessages = history.filter((m) => m.role === 'user');
  if (!studentMessages.length) return 'minimal';

  const avgLength = studentMessages.reduce((sum, m) => sum + m.content.length, 0) / studentMessages.length;

  if (avgLength > 100) return 'high';
  if (avgLength > 30) return 'engaged';
  if (avgLength > 10) return 'brief';
  return 'minimal';
}

// ── Learning log (enriched with student model) ─────────────

function writeLearningLog(topicSlug, lesson, active) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) return;

  const completed = curriculum.lessons.filter((l) => l.status === 'completed');
  const pending = curriculum.lessons.filter((l) => l.status === 'pending');
  const nextLesson = pending[0];
  const lessonDay = lesson.day || lesson.lesson;
  const engagement = assessEngagement(active.history);

  const studentMessages = active.history.filter((m) => m.role === 'user');
  const exerciseHistory = completed.slice(-5).map((l) => {
    const e = l.engagement;
    return e === 'high' || e === 'engaged' || e === 'correct' ? '✓' : '✗';
  }).join(' ');

  const lines = [
    `# Learning Log: ${curriculum.topic || topicSlug}`,
    '',
    '## Position',
    `- **Last lesson:** Day ${lessonDay} — ${lesson.title}`,
    `- **Next lesson:** ${nextLesson ? `Day ${nextLesson.day || nextLesson.lesson} — ${nextLesson.title}` : 'Curriculum complete'}`,
    `- **Progress:** ${completed.length}/${curriculum.lessons.length} lessons (${Math.round((completed.length / curriculum.lessons.length) * 100)}%)`,
    '',
    '## Accuracy Trend',
    `- **Last 5:** ${exerciseHistory || 'no data yet'}`,
    `- **Engagement:** ${engagement}`,
    '',
    '## Session',
    `- **Date:** ${new Date().toISOString().split('T')[0]}`,
    `- **Time:** ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
    `- **Exchanges:** ${active.history.length}`,
    `- **Avg answer length:** ${studentMessages.length ? Math.round(studentMessages.reduce((s, m) => s + m.content.length, 0) / studentMessages.length) : 0} chars`,
    '',
    '## Notes for Next Session',
    `Last covered: ${lesson.title}. Concepts: ${(lesson.concepts || []).join(', ')}.`,
    active.plan?.goal ? `Goal was: ${active.plan.goal}` : '',
    engagement === 'minimal' || engagement === 'brief' ? 'Student gave short answers — try more engaging hooks next time.' : '',
  ].filter(Boolean);

  writeDomainFile(topicSlug, 'learning.md', lines.join('\n'));
  log.debug({ topic: topicSlug, lessonDay }, 'learning.md written');
}

// ── Legacy exports (for callbacks.js compatibility) ────────

export function getCorrectAnswer() { return null; }
export function getLessonContext(topicSlug, day) {
  return { title: `Lesson ${day}`, concepts: [], topicSlug };
}
export function setLastExerciseResult() {}
export function completeLessonAfterExercise() {}
export function stripAnswerKey(text) {
  return text.replace(/^\s*(?:correct|answer)\s*(?:is)?\s*[:\s]\s*\(?[A-D]\)?\s*$/gim, '').trim();
}
