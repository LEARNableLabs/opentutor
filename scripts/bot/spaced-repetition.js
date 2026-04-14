/**
 * Spaced repetition — SM-2 algorithm for optimal review scheduling.
 * Each concept gets a repetition record tracked in progress.json.
 *
 * Based on SuperMemo SM-2:
 *   - First review: 1 day after learning
 *   - Second review: 3 days later
 *   - Third+: previous_interval × ease_factor
 *   - Wrong answer: reset interval to 1 day, reduce ease
 */

import { readProgress, updateProgress } from './state.js';

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

/**
 * Register a concept for spaced repetition tracking.
 * Called after a lesson introduces a new concept.
 * @param {string} topicSlug
 * @param {string} concept
 */
export function registerConcept(topicSlug, concept) {
  const key = conceptKey(topicSlug, concept);

  updateProgress((p) => {
    p.spaced_repetition ??= {};
    if (p.spaced_repetition[key]) return; // already tracked

    p.spaced_repetition[key] = {
      topic: topicSlug,
      concept,
      ease: DEFAULT_EASE,
      interval: 1,
      next_review: addDays(new Date(), 1),
      reps: 0,
      streak: 0,
      first_seen: today(),
    };
  });
}

/**
 * Register all concepts from a lesson.
 * @param {string} topicSlug
 * @param {string[]} concepts
 */
export function registerLessonConcepts(topicSlug, concepts) {
  for (const concept of concepts) {
    registerConcept(topicSlug, concept);
  }
}

/**
 * Record a review result and update the schedule.
 * @param {string} topicSlug
 * @param {string} concept
 * @param {'easy'|'hard'|'wrong'} quality
 */
export function recordReview(topicSlug, concept, quality) {
  const key = conceptKey(topicSlug, concept);

  updateProgress((p) => {
    p.spaced_repetition ??= {};
    const record = p.spaced_repetition[key];
    if (!record) return;

    record.reps += 1;

    if (quality === 'wrong') {
      // Reset interval, reduce ease
      record.interval = 1;
      record.streak = 0;
      record.ease = Math.max(MIN_EASE, record.ease - 0.2);
    } else if (quality === 'hard') {
      // Small interval increase, ease unchanged
      record.interval = Math.max(1, Math.ceil(record.interval * 1.2));
      record.streak += 1;
    } else {
      // Easy — standard SM-2 progression
      if (record.streak === 0) {
        record.interval = 1;
      } else if (record.streak === 1) {
        record.interval = 3;
      } else {
        record.interval = Math.ceil(record.interval * record.ease);
      }
      record.streak += 1;
      record.ease = Math.min(3.0, record.ease + 0.1);
    }

    record.next_review = addDays(new Date(), record.interval);
  });
}

/**
 * Get concepts due for review today.
 * @param {string} [topicSlug] - Filter by topic, or all topics if omitted
 * @param {number} [limit=3] - Max concepts to return
 * @returns {Array<{topic: string, concept: string, interval: number, streak: number}>}
 */
export function getDueReviews(topicSlug, limit = 3) {
  const progress = readProgress();
  const sr = progress.spaced_repetition || {};
  const now = today();

  const due = Object.values(sr)
    .filter((r) => {
      if (topicSlug && r.topic !== topicSlug) return false;
      return r.next_review <= now;
    })
    .sort((a, b) => {
      // Prioritize: overdue items first, then by streak (weakest first)
      const aOverdue = daysBetween(a.next_review, now);
      const bOverdue = daysBetween(b.next_review, now);
      if (aOverdue !== bOverdue) return bOverdue - aOverdue;
      return a.streak - b.streak;
    })
    .slice(0, limit);

  return due;
}

/**
 * Get a summary of spaced repetition state for a topic.
 * @param {string} topicSlug
 * @returns {{total: number, due: number, mastered: number, struggling: number}}
 */
export function getRepetitionSummary(topicSlug) {
  const progress = readProgress();
  const sr = progress.spaced_repetition || {};
  const now = today();

  const concepts = Object.values(sr).filter((r) => r.topic === topicSlug);

  return {
    total: concepts.length,
    due: concepts.filter((r) => r.next_review <= now).length,
    mastered: concepts.filter((r) => r.interval >= 30).length,
    struggling: concepts.filter((r) => r.ease < 2.0).length,
  };
}

// ── Helpers ────────────────────────────────────────────────

function conceptKey(topicSlug, concept) {
  return `${topicSlug}::${concept.toLowerCase().replace(/\s+/g, '-')}`;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function daysBetween(dateStr, nowStr) {
  const d1 = new Date(dateStr);
  const d2 = new Date(nowStr);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}
