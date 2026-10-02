/**
 * Spaced repetition — SM-2 review scheduling, shared by the web, the bot and agents (#327).
 *
 * Pure functions over a record map (`progress.spaced_repetition`), so any store can keep it:
 * the caller reads the map, calls one of these inside updateProgress, and writes it back.
 *
 *   - First review: 1 day after learning
 *   - Second review: 3 days later
 *   - Third+: previous interval × ease
 *   - Wrong answer: interval back to 1 day, ease down
 */

const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
const DEFAULT_EASE = 2.5;
const DAY_MS = 24 * 60 * 60 * 1000;

const dateOf = (now) => new Date(now).toISOString().split('T')[0];
const addDays = (now, days) => dateOf(new Date(now).getTime() + days * DAY_MS);
const daysBetween = (from, to) => Math.floor((new Date(to) - new Date(from)) / DAY_MS);

export const conceptKey = (topicSlug, concept) => `${topicSlug}::${String(concept).toLowerCase().replace(/\s+/g, '-')}`;

/** Start tracking concepts a lesson introduced. One already tracked keeps its schedule. */
export function registerConcepts(records, topicSlug, concepts = [], now = new Date()) {
  for (const concept of concepts) {
    const key = conceptKey(topicSlug, concept);
    records[key] ??= {
      topic: topicSlug, concept, ease: DEFAULT_EASE, interval: 1, next_review: addDays(now, 1),
      reps: 0, streak: 0, first_seen: dateOf(now),
    };
  }
  return records;
}

/** Apply one review result: 'easy', 'hard' or 'wrong'. An untracked concept is left alone. */
export function recordReviewResult(records, topicSlug, concept, quality, now = new Date()) {
  const record = records[conceptKey(topicSlug, concept)];
  if (!record) return records;
  record.reps += 1;
  if (quality === 'wrong') {
    record.interval = 1;
    record.streak = 0;
    record.ease = Math.max(MIN_EASE, record.ease - 0.2);
  } else if (quality === 'hard') {
    record.interval = Math.max(1, Math.ceil(record.interval * 1.2));
    record.streak += 1;
  } else {
    record.interval = record.streak === 0 ? 1 : record.streak === 1 ? 3 : Math.ceil(record.interval * record.ease);
    record.streak += 1;
    record.ease = Math.min(MAX_EASE, record.ease + 0.1);
  }
  record.next_review = addDays(now, record.interval);
  return records;
}

/** Concepts due today or overdue, most overdue first, then weakest. */
export function dueConcepts(records = {}, { topicSlug, limit = 3, exclude = [], now = new Date() } = {}) {
  const today = dateOf(now);
  const skip = new Set(exclude.map((c) => conceptKey(topicSlug ?? '', c)));
  return Object.entries(records)
    .filter(([key, r]) => (!topicSlug || r.topic === topicSlug) && r.next_review <= today && !skip.has(key))
    .map(([, r]) => r)
    .sort((a, b) => daysBetween(b.next_review, today) - daysBetween(a.next_review, today) || a.streak - b.streak)
    .slice(0, limit);
}

export function summarize(records = {}, topicSlug, now = new Date()) {
  const today = dateOf(now);
  const concepts = Object.values(records).filter((r) => r.topic === topicSlug);
  return {
    total: concepts.length,
    due: concepts.filter((r) => r.next_review <= today).length,
    mastered: concepts.filter((r) => r.interval >= 30).length,
    struggling: concepts.filter((r) => r.ease < 2.0).length,
  };
}
