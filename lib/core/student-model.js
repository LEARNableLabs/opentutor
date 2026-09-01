/**
 * Student model — computes adaptive difficulty, accuracy trends,
 * and engagement signals from learning history.
 *
 * Reads learning.md + curriculum progress. Produces a structured
 * assessment the Teacher uses to calibrate each lesson.
 */

export function buildStudentModel(learningMd, curriculum, userProfile) {
  const exercises = parseExerciseHistory(learningMd);
  const recentAccuracy = computeAccuracy(exercises, 5);
  const overallAccuracy = computeAccuracy(exercises, exercises.length);
  const trend = computeTrend(exercises, 5);
  const difficulty = computeDifficulty(recentAccuracy, trend, curriculum);
  const engagement = parseEngagement(learningMd);
  const concepts = classifyConcepts(exercises, curriculum);

  return {
    recentAccuracy,
    overallAccuracy,
    trend,
    difficulty,
    engagement,
    concepts,
    exerciseCount: exercises.length,
    recommendations: generateRecommendations(recentAccuracy, trend, engagement, concepts),
  };
}

export function formatStudentModel(model) {
  const lines = [
    '## Student Model (computed)',
    '',
    '## Accuracy',
    `- **Recent (last 5):** ${Math.round(model.recentAccuracy * 100)}%`,
    `- **Overall:** ${Math.round(model.overallAccuracy * 100)}% across ${model.exerciseCount} exercises`,
    `- **Trend:** ${model.trend}`,
    '',
    '## Difficulty',
    `- **Current level:** ${model.difficulty.level} (${model.difficulty.label})`,
    `- **Adjustment:** ${model.difficulty.adjustment}`,
    '',
    '## Engagement',
    `- **Level:** ${model.engagement}`,
    '',
    '## Concepts',
  ];

  if (model.concepts.solid.length) {
    lines.push(`- **Solid:** ${model.concepts.solid.join(', ')}`);
  }
  if (model.concepts.shaky.length) {
    lines.push(`- **Shaky (needs reinforcement):** ${model.concepts.shaky.join(', ')}`);
  }

  if (model.recommendations.length) {
    lines.push('', '## Recommendations');
    for (const r of model.recommendations) {
      lines.push(`- ${r}`);
    }
  }

  return lines.join('\n');
}

// ── Parsing ─────────────────────────────────────────────────

function parseExerciseHistory(learningMd) {
  if (!learningMd) return [];

  const exercises = [];
  const resultPattern = /\*\*Last exercise:\*\*\s*(correct|incorrect|pending)/gi;
  let m;
  while ((m = resultPattern.exec(learningMd)) !== null) {
    exercises.push({ result: m[1].toLowerCase() });
  }

  // Also parse from history section if present
  const historyPattern = /([✓✗])\s/g;
  while ((m = historyPattern.exec(learningMd)) !== null) {
    exercises.push({ result: m[1] === '✓' ? 'correct' : 'incorrect' });
  }

  return exercises;
}

function parseEngagement(learningMd) {
  if (!learningMd) return 'unknown';

  if (/engagement.*low/i.test(learningMd)) return 'low';
  if (/engagement.*high/i.test(learningMd)) return 'high';
  if (/trending shorter/i.test(learningMd)) return 'declining';
  return 'steady';
}

// ── Computation ─────────────────────────────────────────────

function computeAccuracy(exercises, windowSize) {
  if (!exercises.length) return 0.5;

  const window = exercises.slice(-windowSize);
  const scored = window.filter((e) => e.result !== 'pending');
  if (!scored.length) return 0.5;

  const correct = scored.filter((e) => e.result === 'correct').length;
  return correct / scored.length;
}

function computeTrend(exercises, windowSize) {
  if (exercises.length < 4) return 'insufficient data';

  const half = Math.floor(windowSize / 2);
  const recent = exercises.slice(-half);
  const earlier = exercises.slice(-(half * 2), -half);

  if (!recent.length || !earlier.length) return 'insufficient data';

  const recentAcc = computeAccuracy(recent, recent.length);
  const earlierAcc = computeAccuracy(earlier, earlier.length);
  const delta = recentAcc - earlierAcc;

  if (delta > 0.15) return 'improving';
  if (delta < -0.15) return 'declining';
  return 'plateaued';
}

function computeDifficulty(recentAccuracy, trend, curriculum) {
  // Find current difficulty from next pending lesson
  const nextLesson = curriculum?.lessons?.find((l) => l.status === 'pending');
  const baseDifficulty = nextLesson?.difficulty || 3;

  let level = baseDifficulty;
  let adjustment = 'none';

  if (recentAccuracy > 0.8 && trend !== 'declining') {
    level = Math.min(5, baseDifficulty + 1);
    adjustment = 'bump up — student is breezing through';
  } else if (recentAccuracy < 0.4) {
    level = Math.max(1, baseDifficulty - 1);
    adjustment = 'drop back — student needs more scaffolding';
  } else if (trend === 'plateaued' && recentAccuracy > 0.5) {
    level = Math.min(5, baseDifficulty + 1);
    adjustment = 'nudge up — plateaued, ready for a challenge';
  } else if (trend === 'declining') {
    level = Math.max(1, baseDifficulty - 1);
    adjustment = 'ease off — accuracy declining';
  }

  const labels = { 1: 'review', 2: 'accessible', 3: 'standard', 4: 'challenging', 5: 'peak' };
  return { level, label: labels[level] || 'standard', adjustment };
}

function classifyConcepts(exercises, curriculum) {
  const solid = [];
  const shaky = [];

  if (!curriculum?.lessons) return { solid, shaky };

  const completed = curriculum.lessons.filter((l) => l.status === 'completed');
  for (const lesson of completed.slice(-10)) {
    const concepts = lesson.concepts || [];
    const engagement = lesson.engagement;
    if (engagement === 'correct' || engagement === 'delivered') {
      solid.push(...concepts);
    } else if (engagement === 'incorrect') {
      shaky.push(...concepts);
    }
  }

  return {
    solid: [...new Set(solid)].slice(0, 10),
    shaky: [...new Set(shaky)].slice(0, 10),
  };
}

function generateRecommendations(accuracy, trend, engagement, concepts) {
  const recs = [];

  if (accuracy > 0.8) recs.push('Skip diagnostic — go straight to a challenge');
  if (accuracy < 0.4) recs.push('Use more analogies and concrete examples before abstract concepts');
  if (trend === 'declining') recs.push('Shorter sessions, more encouragement, check if topic is still interesting');
  if (trend === 'plateaued') recs.push('Vary the exercise format — try teach-back or real-world application');
  if (engagement === 'low' || engagement === 'declining') recs.push('Lead with a curiosity hook, end with a cliffhanger for next time');
  if (concepts.shaky.length > 2) recs.push(`Reinforce before proceeding: ${concepts.shaky.slice(0, 3).join(', ')}`);
  if (!recs.length) recs.push('Standard delivery — student is on track');

  return recs;
}
