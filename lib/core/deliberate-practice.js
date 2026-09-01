/**
 * DeliberatePractitioner agent — evaluates whether teaching follows
 * deliberate practice principles. Runs after each lesson, writes
 * enforceable directives to practice-feedback.md.
 *
 * Directives:
 *   BLOCK  — do not advance until a concept is retested
 *   BUMP   — increase difficulty for next lesson
 *   DROP   — decrease difficulty, add scaffolding
 *   VARY   — change lesson format (teach-back, real-world, etc.)
 *   REVISIT — re-test a specific shaky concept
 *   GOAL   — explicit goal the student must demonstrate
 */

import { buildStudentModel } from './student-model.js';

const DIRECTIVE_TYPES = ['BLOCK', 'BUMP', 'DROP', 'VARY', 'REVISIT', 'GOAL'];

/**
 * Run the DeliberatePractitioner after a lesson.
 * Deterministic evaluation — no LLM call needed.
 */
export function evaluatePractice(learningMd, curriculum, userProfile) {
  const model = buildStudentModel(learningMd, curriculum, userProfile);
  const directives = [];
  const observations = [];

  // 1. TARGET WEAKNESSES — are shaky concepts being addressed?
  // Filter: only concepts that are STILL shaky (not ones that have since been answered correctly)
  const stillShaky = model.concepts.shaky.filter((c) => !model.concepts.solid.includes(c));

  if (stillShaky.length > 0) {
    const lessonsSinceShaky = countLessonsSinceConceptsWereShaky(curriculum, stillShaky);

    // Sort by staleness — most neglected first
    const sorted = [...stillShaky].sort((a, b) => (lessonsSinceShaky[b] || 0) - (lessonsSinceShaky[a] || 0));

    // Cap: max 3 REVISITs, max 1 BLOCK per evaluation
    let revisitCount = 0;
    let blockIssued = false;

    for (const concept of sorted) {
      const since = lessonsSinceShaky[concept] || 0;

      if (since >= 5 && !blockIssued) {
        directives.push({
          type: 'BLOCK',
          target: concept,
          reason: `BLOCK advancement until "${concept}" is retested — ${since} lessons without addressing it`,
          priority: 'critical',
        });
        blockIssued = true;
      } else if (since >= 3 && revisitCount < 3) {
        directives.push({
          type: 'REVISIT',
          target: concept,
          reason: `Concept "${concept}" was flagged as shaky ${since} lessons ago`,
          priority: 'high',
        });
        revisitCount++;
      }
    }

    if (stillShaky.length > 2) {
      observations.push(`${stillShaky.length} shaky concepts accumulating without review`);
    }
  }

  // 2. STRETCH ZONE — is difficulty appropriate?
  if (model.recentAccuracy > 0.8 && model.difficulty.level < 4) {
    directives.push({
      type: 'BUMP',
      target: `difficulty to ${Math.min(5, model.difficulty.level + 1)}`,
      reason: `Student accuracy at ${Math.round(model.recentAccuracy * 100)}% — coasting below stretch zone`,
      priority: 'high',
    });
    observations.push('Student is coasting — accuracy too high for current difficulty');
  }

  if (model.recentAccuracy < 0.3) {
    directives.push({
      type: 'DROP',
      target: `difficulty to ${Math.max(1, model.difficulty.level - 1)}`,
      reason: `Accuracy at ${Math.round(model.recentAccuracy * 100)}% — frustration zone, need scaffolding`,
      priority: 'high',
    });
    observations.push('Student in frustration zone — too hard');
  }

  // 3. REPETITION WITH VARIATION — is the format varying?
  const recentFormats = getRecentLessonFormats(curriculum, 5);
  const uniqueFormats = new Set(recentFormats);
  if (recentFormats.length >= 4 && uniqueFormats.size <= 1) {
    const otherFormats = ['teach-back', 'real-world', 'question', 'resource-drop']
      .filter((f) => !uniqueFormats.has(f));
    directives.push({
      type: 'VARY',
      target: otherFormats[0] || 'teach-back',
      reason: `Last ${recentFormats.length} lessons all used "${recentFormats[0]}" format — no variation`,
      priority: 'medium',
    });
    observations.push('Lesson format has been monotonous');
  }

  // 4. ENGAGEMENT — is the student checked out?
  if (model.engagement === 'low' || model.engagement === 'declining') {
    if (!directives.some((d) => d.type === 'VARY')) {
      directives.push({
        type: 'VARY',
        target: 'real-world',
        reason: 'Engagement is declining — try a real-world application to re-engage',
        priority: 'high',
      });
    }
    observations.push('Engagement declining — need format change or curiosity hook');
  }

  // 5. GOALS — ensure next lesson has an explicit, testable goal
  directives.push({
    type: 'GOAL',
    target: 'required',
    reason: 'Every lesson must open with an explicit goal and close with self-assessment',
    priority: 'standard',
  });

  return {
    model,
    directives,
    observations,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format practice feedback as markdown for the domain directory.
 */
export function formatPracticeFeedback(evaluation, topicName) {
  const lines = [
    `# Practice Feedback: ${topicName}`,
    `Updated: ${evaluation.timestamp}`,
    '',
  ];

  if (evaluation.observations.length) {
    lines.push('## Observations');
    for (const obs of evaluation.observations) {
      lines.push(`- ${obs}`);
    }
    lines.push('');
  }

  lines.push('## Directives');
  if (!evaluation.directives.length) {
    lines.push('No issues — deliberate practice principles are being followed.');
  } else {
    const byPriority = { critical: [], high: [], medium: [], standard: [] };
    for (const d of evaluation.directives) {
      (byPriority[d.priority] || byPriority.standard).push(d);
    }
    for (const [priority, dirs] of Object.entries(byPriority)) {
      if (!dirs.length) continue;
      for (const d of dirs) {
        lines.push(`- **${d.type}** [${priority}]: ${d.target} — ${d.reason}`);
      }
    }
  }

  lines.push('', '## Student Snapshot');
  lines.push(`- Accuracy: ${Math.round(evaluation.model.recentAccuracy * 100)}% (last 5)`);
  lines.push(`- Trend: ${evaluation.model.trend}`);
  lines.push(`- Difficulty: ${evaluation.model.difficulty.level} (${evaluation.model.difficulty.label})`);
  lines.push(`- Engagement: ${evaluation.model.engagement}`);

  if (evaluation.model.concepts.shaky.length) {
    lines.push(`- Shaky: ${evaluation.model.concepts.shaky.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Parse directives from practice-feedback.md.
 * Returns structured directives that lesson delivery can enforce.
 */
export function parseDirectives(feedbackMd) {
  if (!feedbackMd) return [];

  const directives = [];
  const pattern = /\*\*(BLOCK|BUMP|DROP|VARY|REVISIT|GOAL)\*\*\s*\[(\w+)\]:\s*(.+?)(?:\s*—\s*(.+))?$/gm;
  let m;
  while ((m = pattern.exec(feedbackMd)) !== null) {
    directives.push({
      type: m[1],
      priority: m[2],
      target: m[3].trim(),
      reason: m[4]?.trim() || '',
    });
  }

  return directives;
}

/**
 * Apply directives to modify lesson delivery behavior.
 * Returns an object with enforced constraints.
 */
export function applyDirectives(directives) {
  const constraints = {
    blocked: false,
    blockedConcept: null,
    difficultyOverride: null,
    formatOverride: null,
    revisitConcepts: [],
    requireGoal: false,
  };

  for (const d of directives) {
    switch (d.type) {
      case 'BLOCK':
        constraints.blocked = true;
        constraints.blockedConcept = d.target;
        break;
      case 'BUMP': {
        const level = parseInt(d.target.match(/\d/)?.[0]);
        if (level) constraints.difficultyOverride = level;
        break;
      }
      case 'DROP': {
        const level = parseInt(d.target.match(/\d/)?.[0]);
        if (level) constraints.difficultyOverride = level;
        break;
      }
      case 'VARY':
        constraints.formatOverride = d.target;
        break;
      case 'REVISIT':
        constraints.revisitConcepts.push(d.target);
        break;
      case 'GOAL':
        constraints.requireGoal = true;
        break;
    }
  }

  return constraints;
}

// ── Helpers ─────────────────────────────────────────────────

function countLessonsSinceConceptsWereShaky(curriculum, shakyConcepts) {
  if (!curriculum?.lessons) return {};

  const completed = curriculum.lessons.filter((l) => l.status === 'completed');
  const counts = {};

  for (const concept of shakyConcepts) {
    let found = false;
    for (let i = completed.length - 1; i >= 0; i--) {
      if ((completed[i].concepts || []).includes(concept)) {
        counts[concept] = completed.length - 1 - i;
        found = true;
        break;
      }
    }
    if (!found) counts[concept] = completed.length;
  }

  return counts;
}

function getRecentLessonFormats(curriculum, count) {
  if (!curriculum?.lessons) return [];
  return curriculum.lessons
    .filter((l) => l.status === 'completed')
    .slice(-count)
    .map((l) => l.type || 'mini-lesson');
}
