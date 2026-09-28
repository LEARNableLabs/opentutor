/**
 * What happens after a lesson ends.
 *
 * This is the adaptive half of the tutor: grade the session, write the learning
 * log, and run the DeliberatePractitioner so the next lesson can be calibrated.
 * It lived only in the Telegram bot, which meant web and serverless students got
 * a good conversation and a tutor that never learned anything about them (#106).
 *
 * Platform-agnostic: everything goes through the store interface, so the bot,
 * the local web server and the Vercel routes all call the same code.
 */

import { evaluatePractice, formatPracticeFeedback } from './deliberate-practice.js';

/**
 * Read engagement out of the conversation. Multi-signal rather than length
 * alone: a short "why?" is more engaged than a long shrug.
 */
export function assessEngagement(history = []) {
  const studentMessages = history.filter((m) => m.role === 'user');
  if (!studentMessages.length) return 'minimal';

  const avgLength = studentMessages.reduce((sum, m) => sum + String(m.content).length, 0) / studentMessages.length;
  const askedQuestions = studentMessages.some((m) => String(m.content).includes('?'));
  const usedReasoning = studentMessages.some((m) => /because|since|therefore|so that/i.test(m.content));
  const optedOut = studentMessages.some((m) => /^(skip|next|move on|idk|i don'?t know)$/i.test(String(m.content).trim()));

  if (optedOut) return 'minimal';
  if (askedQuestions) return 'high';
  if (usedReasoning && avgLength > 20) return 'high';
  if (studentMessages.length >= 3 && avgLength > 15) return 'engaged';
  if (avgLength > 30) return 'engaged';
  if (avgLength > 10) return 'brief';
  return 'minimal';
}

/** Turn the hidden per-step scores into the grade stored against the lesson. */
export function gradeFromAssessments(assessments = [], fallback) {
  if (!assessments.length) return fallback;
  const avg = assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length;
  return avg >= 0.7 ? 'correct' : avg >= 0.4 ? 'partial' : 'incorrect';
}

export function buildLearningLog({ curriculum, topicSlug, lesson, session, engagement }) {
  const lessons = curriculum?.lessons || [];
  const completed = lessons.filter((l) => l.status === 'completed');
  const pending = lessons.filter((l) => l.status === 'pending');
  const next = pending[0];
  const lessonDay = lesson.day || lesson.lesson;
  const history = session.history || [];
  const studentMessages = history.filter((m) => m.role === 'user');

  const recent = completed.slice(-5)
    .map((l) => (['high', 'engaged', 'correct'].includes(l.engagement) ? '✓' : '✗'))
    .join(' ');

  const avg = (pick) => (studentMessages.length
    ? Math.round(studentMessages.reduce((sum, m) => sum + pick(m), 0) / studentMessages.length)
    : 0);

  return [
    `# Learning Log: ${curriculum?.topic || topicSlug}`,
    '',
    '## Position',
    `- **Last lesson:** Day ${lessonDay} — ${lesson.title}`,
    `- **Next lesson:** ${next ? `Day ${next.day || next.lesson} — ${next.title}` : 'Curriculum complete'}`,
    `- **Progress:** ${completed.length}/${lessons.length} lessons (${lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0}%)`,
    '',
    '## Accuracy Trend',
    `- **Last 5:** ${recent || 'no data yet'}`,
    `- **Engagement:** ${engagement}`,
    `- **Step scores:** ${(session.assessments || []).map((a) => `${a.step}=${a.score}`).join(', ') || 'no assessments'}`,
    `- **Exercise format:** ${session.exerciseFormat || 'socratic'}`,
    '',
    '## Session',
    `- **Date:** ${new Date().toISOString().split('T')[0]}`,
    `- **Time:** ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
    `- **Exchanges:** ${history.length}`,
    `- **Avg answer length:** ${avg((m) => String(m.content).length)} chars`,
    `- **Avg response time:** ${Math.round(avg((m) => m.responseTimeMs || 0) / 1000)}s`,
    '',
    '## Notes for Next Session',
    `Last covered: ${lesson.title}. Concepts: ${(lesson.concepts || []).join(', ')}.`,
    session.plan?.goal ? `Goal was: ${session.plan.goal}` : '',
    ['minimal', 'brief'].includes(engagement) ? 'Student gave short answers — try more engaging hooks next time.' : '',
  ].filter(Boolean).join('\n');
}

/**
 * Grade the session, mark the lesson complete, write the learning log, and run
 * the DeliberatePractitioner. Returns what happened so a caller can log it.
 *
 * `session` is the in-flight lesson: { history, assessments, plan, exerciseFormat, isReview }.
 */
export async function completeLesson({ state, topicSlug, lesson, session }) {
  const engagement = assessEngagement(session.history);
  const grade = gradeFromAssessments(session.assessments, engagement);
  const lessonDay = lesson.day || lesson.lesson;

  if (!session.isReview) {
    await state.markLessonComplete(topicSlug, lessonDay, grade);
  }

  const curriculum = await state.readCurriculum(topicSlug);
  await state.writeDomainFile(topicSlug, 'learning.md',
    buildLearningLog({ curriculum, topicSlug, lesson, session, engagement }));

  let directives = [];
  try {
    const learningMd = (await state.readDomainFile(topicSlug, 'learning.md')) || '';
    const userProfile = (await state.readUser()) || '';
    const evaluation = evaluatePractice(learningMd, curriculum, userProfile);
    await state.writeDomainFile(topicSlug, 'practice-feedback.md',
      formatPracticeFeedback(evaluation, curriculum?.topic || topicSlug));
    directives = evaluation.directives;
  } catch (err) {
    // A failed evaluation must not cost the student their completed lesson. It is
    // logged, never swallowed (#117): readUser() throws on a database error (#157).
    console.error('[lesson] practice evaluation failed:', err.message);
  }

  return { engagement, grade, directives };
}
