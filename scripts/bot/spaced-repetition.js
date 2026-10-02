/**
 * Spaced repetition for the bot: the shared SM-2 (lib/core/spaced-repetition.js, #327)
 * kept in progress.json, which readProgress/updateProgress read and write.
 */

import { readProgress, updateProgress } from './state.js';
import { registerConcepts, recordReviewResult, dueConcepts, summarize } from '../../lib/core/spaced-repetition.js';

const records = (p) => (p.spaced_repetition ??= {});

/** Register a concept for spaced repetition tracking after a lesson introduces it. */
export function registerConcept(topicSlug, concept) {
  updateProgress((p) => { registerConcepts(records(p), topicSlug, [concept]); });
}

/** Register all concepts from a lesson. */
export function registerLessonConcepts(topicSlug, concepts) {
  updateProgress((p) => { registerConcepts(records(p), topicSlug, concepts); });
}

/** Record a review result and consume the quiz poll or flashcard in the same write (#294). */
export function recordReview(topicSlug, concept, quality, cardId) {
  updateProgress((p) => {
    if (cardId) p.review_cards = (p.review_cards || []).filter((c) => c.id !== cardId);
    recordReviewResult(records(p), topicSlug, concept, quality);
  });
}

/** Concepts due for review today, optionally for one topic. */
export function getDueReviews(topicSlug, limit = 3) {
  return dueConcepts(readProgress().spaced_repetition, { topicSlug, limit });
}

export function getRepetitionSummary(topicSlug) {
  return summarize(readProgress().spaced_repetition, topicSlug);
}
