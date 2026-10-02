// #292: a student's streak and how each of their topics is going, computed once for every
// surface: the local server and the Vercel route answer GET /api/progress with progressView(),
// and the bot's /progress counts its streak with streakDays().

import { buildStudentModel } from './student-model.js';
import { parseRetested } from './deliberate-practice.js';
import { topicProgress } from './progress.js';
import { isTopicSlug } from './generated-topics.js';

const DAY = 86_400_000;
const utcDay = (ms) => new Date(ms).toISOString().slice(0, 10);

/**
 * Days in a row with a lesson, up to today, or up to yesterday while today is still open.
 * In UTC, the clock history dates are written in. 0 when there is no streak: a broken one
 * is not a loss to show, it just starts again.
 */
export function streakDays(history, now = Date.now()) {
  const days = new Set((history || []).map((entry) => entry?.date));
  let streak = 0;
  for (let day = days.has(utcDay(now)) ? now : now - DAY; days.has(utcDay(day)); day -= DAY) streak++;
  return streak;
}

/** GET /api/progress, as the Vercel route and the local server both answer it. */
export async function progressView(state, now = Date.now()) {
  const progress = await state.readProgress();
  const history = progress?.history || [];
  // No store writes another, but one that isn't a topic slug would fail every read, not just its own.
  const active = (progress?.active_topics || []).filter(isTopicSlug);
  // On Supabase each topic's reads cost four round trips; readTopicStates() makes them a
  // query per table, however many topics (#143). Local stores read their own files, awaited
  // though they are synchronous: an unawaited read would hand the model a Promise.
  const topics = !active.length ? []
    : typeof state.readTopicStates === 'function' ? await state.readTopicStates(active)
      : await Promise.all(active.map(async (slug) => ({
        slug,
        curriculum: await state.readCurriculum(slug),
        learning: await state.readDomainFile(slug, 'learning.md'),
        feedback: await state.readDomainFile(slug, 'practice-feedback.md'),
      })));
  // The last seven days, today included: only those dates count, never a later or malformed one.
  const week = new Set(Array.from({ length: 7 }, (_, i) => utcDay(now - i * DAY)));

  return {
    ...progress,
    streak: streakDays(history, now),
    lessonsThisWeek: history.filter((entry) => week.has(entry?.date)).length,
    topics: topics.filter(({ curriculum }) => Array.isArray(curriculum?.lessons)).map(({ slug, curriculum, learning, feedback }) => {
      const { topic, completed, total, percent, current } = topicProgress(curriculum);
      const model = buildStudentModel(learning || '', curriculum, '', parseRetested(feedback)); // #227
      return {
        slug, topic, completed, total, percent,
        // Before a graded lesson the model's 50% is a starting guess, not the student's score.
        accuracy: model.exerciseCount ? Math.round(model.recentAccuracy * 100) : null,
        // Solid and shaky concepts: the web has no spaced-repetition record until #214.
        mastered: model.concepts.solid.length,
        reviewDue: model.concepts.shaky.length,
        nextLesson: current?.title || null,
      };
    }),
  };
}
