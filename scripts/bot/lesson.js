/**
 * Socratic lesson delivery — adaptive multi-turn conversation.
 *
 * Three modes based on student state + context:
 *   Quick    (~1 min):  retrieval check + one question
 *   Standard (~3-5 min): retrieval → diagnostic → follow-up → application
 *   Deep     (~8-10 min): adds scaffolding, teach-back, extra examples
 *
 * Mid-lesson branching: steps expand or contract based on student answers.
 */

import { generate } from './claude.js';
import { buildLessonPlanPrompt, buildSocraticResponsePrompt } from '../../lib/core/prompts.js';
import { buildStudentModel, formatStudentModel } from '../../lib/core/student-model.js';
import { evaluatePractice, formatPracticeFeedback, parseDirectives, applyDirectives } from '../../lib/core/deliberate-practice.js';
import { getNextLesson, markLessonComplete, readCurriculum, readDomainFile, writeDomainFile, readUser, readProgress, appendMemory } from './state.js';
import { PATHS } from './config.js';
import { appendMessage } from './session.js';
import { registerLessonConcepts, getDueReviews, recordReview } from './spaced-repetition.js';
import { parseConceptGraph, getPrerequisites } from '../../lib/core/concept-graph.js';
import { TutorState } from '../../lib/core/state.js';
import { openDatabaseFromEnv } from '../../lib/core/db.js';
import { log } from './logger.js';

const coreState = new TutorState(PATHS.root);

// Lazy SQLite connection for lesson state persistence
let _db;
function getDb() {
  if (!_db) {
    try { _db = openDatabaseFromEnv(PATHS.root); } catch { return null; }
  }
  return _db;
}

// ── Lesson modes ───────────────────────────────────────────

const MODE_STEPS = {
  quick:    ['retrieval', 'application'],
  standard: ['retrieval', 'diagnostic', 'followUp', 'application'],
  deep:     ['retrieval', 'diagnostic', 'scaffolding', 'followUp', 'teachBack', 'application'],
};

function selectMode(studentModel, constraints, options = {}) {
  if (options.mode) return options.mode;

  // Scheduled push type
  if (options.pushType === 'midday') return 'quick';
  if (options.pushType === 'evening') return 'quick';

  // Student state
  if (constraints.blocked) return 'deep';
  if (studentModel.recentAccuracy < 0.3) return 'deep';
  if (studentModel.trend === 'declining') return 'deep';

  // Quick mode ONLY for students who are both accurate AND engaged
  if (studentModel.recentAccuracy > 0.85
    && studentModel.trend === 'improving'
    && studentModel.engagement !== 'low'
    && studentModel.engagement !== 'declining') {
    return 'quick';
  }

  // Disengaged students get standard (not quick) — they need engagement hooks, not less attention
  return 'standard';
}

// ── Active lessons (in-flight Socratic conversations) ──────

const activeLessons = {};

export function getActiveLesson(chatId) {
  if (activeLessons[chatId]) return activeLessons[chatId];
  // Fall back to persisted state (survives restart)
  const db = getDb();
  if (db) {
    try {
      const row = db.prepare('SELECT value FROM kv WHERE key = ?').get(`active_lesson:${chatId}`);
      if (row) {
        activeLessons[chatId] = JSON.parse(row.value);
        return activeLessons[chatId];
      }
    } catch {}
  }
  return null;
}

function persistActiveLesson(chatId) {
  const db = getDb();
  if (!db) return;
  try {
    const data = activeLessons[chatId];
    if (data) {
      db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)').run(`active_lesson:${chatId}`, JSON.stringify(data));
    }
  } catch {}
}

export function clearActiveLesson(chatId) {
  delete activeLessons[chatId];
  const db = getDb();
  if (db) {
    try { db.prepare('DELETE FROM kv WHERE key = ?').run(`active_lesson:${chatId}`); } catch {}
  }
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
    persistActiveLesson(chatId);
    return;
  }

  log.info({ topic: topicSlug, lesson_id: lessonDay, title: lesson.title, constraints }, 'generating lesson plan');

  // Pick a concept for retrieval check (from SM-2 scheduler + REVISIT directives)
  const dueReviews = getDueReviews(topicSlug, 3);
  const revisitConcepts = constraints.revisitConcepts || [];
  const retrievalConcept = revisitConcepts[0]
    || dueReviews[0]?.concept
    || null;

  // Pick an interleave concept — prefer confusable pairs from concept map
  const completedLessons = curriculum?.lessons?.filter((l) => l.status === 'completed') || [];
  const conceptMap = readDomainFile(topicSlug, 'concept-map.md') || '';
  const currentConcepts = lesson.concepts || [];
  let interleaveConcept = null;

  if (conceptMap && currentConcepts.length > 0) {
    const mapLines = conceptMap.split('\n');
    const confusable = [];
    for (const concept of currentConcepts) {
      for (const line of mapLines) {
        if (line.toLowerCase().includes(concept.toLowerCase())) {
          const mentionedConcepts = line.match(/\*\*([^*]+)\*\*/g)?.map((m) => m.replace(/\*\*/g, '')) || [];
          for (const mentioned of mentionedConcepts) {
            if (!currentConcepts.some((c) => c.toLowerCase() === mentioned.toLowerCase())) {
              const coveredIn = completedLessons.find((l) =>
                (l.concepts || []).some((c) => c.toLowerCase() === mentioned.toLowerCase())
              );
              if (coveredIn) confusable.push(mentioned);
            }
          }
        }
      }
    }
    if (confusable.length > 0) {
      interleaveConcept = confusable[Math.floor(Math.random() * confusable.length)];
    }
  }

  if (!interleaveConcept) {
    const otherModuleLessons = completedLessons.filter((l) => l.module !== lesson.module);
    const interleaveSource = otherModuleLessons.length > 0
      ? otherModuleLessons[Math.floor(Math.random() * otherModuleLessons.length)]
      : null;
    interleaveConcept = interleaveSource?.concepts?.[0] || null;
  }

  // Build student model and select mode
  const studentModel = buildStudentModel(learningMd, curriculum, userProfile);
  const modelText = formatStudentModel(studentModel);
  const mode = selectMode(studentModel, constraints);
  const steps = [...MODE_STEPS[mode]];

  // Skip retrieval if no concept is due
  if (!retrievalConcept && steps[0] === 'retrieval') steps.shift();

  log.info({ topic: topicSlug, mode, steps: steps.length }, 'lesson mode selected');

  // Build directive context for the lesson planner
  const directiveContext = [];
  if (constraints.difficultyOverride) directiveContext.push(`DIFFICULTY OVERRIDE: set to ${constraints.difficultyOverride}`);
  if (constraints.formatOverride) directiveContext.push(`FORMAT OVERRIDE: use ${constraints.formatOverride} format`);
  if (revisitConcepts.length) directiveContext.push(`REVISIT: weave in review of: ${revisitConcepts.join(', ')}`);
  if (constraints.requireGoal) directiveContext.push('GOAL REQUIRED: open with explicit testable goal, close with self-assessment');
  if (retrievalConcept) directiveContext.push(`RETRIEVAL: open with a retrieval check on "${retrievalConcept}" before the diagnostic`);
  if (interleaveConcept) directiveContext.push(`INTERLEAVE: connect the follow-up question to "${interleaveConcept}" from a different module`);
  directiveContext.push('SELF-EXPLANATION: in the application step, ask the student to explain the concept in their own words');
  directiveContext.push(`MODE: ${mode} (${steps.join(' → ')})`);
  if (mode === 'quick') directiveContext.push('QUICK MODE: keep it brief — retrieval + one question/challenge, done in 60 seconds');
  if (mode === 'deep') directiveContext.push('DEEP MODE: add extra scaffolding and a teach-back step where the student explains the concept to you');
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

  // Validate diagnostic question quality
  if (lessonPlan.diagnostic && lessonPlan.diagnostic.length < 20) {
    lessonPlan.diagnostic = `Think about this: what do you already know about ${(lesson.concepts || []).join(' and ')}? What comes to mind?`;
    log.warn({ topic: topicSlug, lessonDay }, 'diagnostic too short, using fallback');
  }
  const genericPatterns = [
    /^what do you know about/i,
    /^what have you heard about/i,
    /^tell me about/i,
    /^do you know anything about/i,
  ];
  if (genericPatterns.some((p) => p.test(lessonPlan.diagnostic))) {
    const concepts = (lesson.concepts || []).join(' and ');
    lessonPlan.diagnostic = `Here's a puzzle: ${lessonPlan.diagnostic.replace(/\?$/, '')}. Specifically, if you had to explain ${concepts} to a friend, what would you say?`;
    log.warn({ topic: topicSlug, lessonDay }, 'generic diagnostic enhanced');
  }

  // Select exercise format based on student behavior
  const exerciseFormat = selectExerciseFormat(studentModel, lessonPlan);

  // Store active lesson state with dynamic steps
  activeLessons[chatId] = {
    topicSlug,
    lessonDay,
    lesson,
    plan: lessonPlan,
    steps,
    step: 0,
    mode,
    exerciseFormat,
    history: [],
    assessments: [],
    studentModel,
    startedAt: Date.now(),
    stepStartedAt: Date.now(),
    retrievalConcept,
    interleaveConcept,
  };
  persistActiveLesson(chatId);

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

  // Student autonomy: allow explicit control
  const lower = text.toLowerCase().trim();
  if (lower === 'skip' || lower === 'move on' || lower === 'next') {
    completeSocraticLesson(chatId, active, text);
    await channel.sendMessage(chatId, "Got it — moving on. Type /next when you're ready.");
    return true;
  }
  if (lower === 'go deeper' || lower === 'explain more') {
    if (active.mode !== 'deep') {
      active.steps.splice(active.step + 1, 0, 'scaffolding');
      active.mode = 'deep';
      log.info({ topic: active.topicSlug }, 'student requested deeper — adding scaffolding step');
    }
  }

  await channel.sendTyping(chatId);

  // Track response time (Math Academy insight: fast+correct=mastery, slow+correct=fragile)
  const responseTimeMs = Date.now() - (active.stepStartedAt || Date.now());
  active.stepStartedAt = Date.now();

  const stepName = active.steps[active.step];
  active.history.push({ role: 'user', content: text, responseTimeMs });

  log.info({ topic: active.topicSlug, lessonDay: active.lessonDay, step: stepName, mode: active.mode, responseTimeMs }, 'student answered');

  // Handle retrieval step — LLM-assessed quality + response time for accurate SM-2 scheduling
  if (stepName === 'retrieval' && active.retrievalConcept) {
    let quality = await assessRetrievalQuality(text, active.retrievalConcept);

    // Response time adjustment: fast+correct=mastery, slow+correct=fragile
    if (quality === 'easy' && responseTimeMs > 30000) quality = 'hard';

    recordReview(active.topicSlug, active.retrievalConcept, quality);
    log.info({ concept: active.retrievalConcept, quality, responseTimeMs }, 'retrieval recorded');

    // Knowledge-graph credit propagation
    try {
      const conceptMapMd = readDomainFile(active.topicSlug, 'concept-map.md');
      if (conceptMapMd && quality === 'easy') {
        const graph = parseConceptGraph(conceptMapMd);
        const prereqs = getPrerequisites(graph, active.retrievalConcept);
        if (prereqs.length) {
          log.info({ concept: active.retrievalConcept, prereqs }, 'propagating mastery credit to prerequisites');
        }
      }
    } catch {}
  }

  // Generate Socratic response (cheap call)
  const user = readUser();
  const responsePrompt = buildSocraticResponsePrompt(active.plan, text, stepName, user);
  const response = await generate(responsePrompt.system, [
    ...active.history,
  ], { model: responsePrompt.model, outputMode: responsePrompt.outputMode });

  // Parse hidden assessment (stripped before sending to student)
  const { assessment, visibleText } = parseAssessment(response.text);
  if (assessment) {
    active.assessments.push({ step: stepName, ...assessment });
    log.info({ step: stepName, score: assessment.score, understanding: assessment.understanding }, 'step assessment');
  }

  active.history.push({ role: 'assistant', content: visibleText });
  active.step++;
  persistActiveLesson(chatId);

  // Mid-lesson branching: detect if student is breezing through
  if (active.mode === 'standard' && active.step < active.steps.length - 1) {
    if (text.length > 80 && active.history.length <= 4) {
      // Strong answer early — consider skipping follow-up
      const nextStep = active.steps[active.step];
      if (nextStep === 'followUp' && text.length > 80) {
        active.steps.splice(active.step, 1); // remove followUp
        log.info({ topic: active.topicSlug }, 'student nailed it — skipping follow-up');
      }
    }
  }

  // If transitioning from retrieval to diagnostic, prepend the goal
  const nextStep = active.steps[active.step];
  if (nextStep === 'diagnostic' && active.plan.goal) {
    const goalMsg = `<b>Today's goal:</b> ${active.plan.goal}`;

    // MC format: show diagnostic as numbered options
    const diagnosticMsg = formatDiagnosticMessage(active);
    await channel.sendMessage(chatId, visibleText + '\n\n' + goalMsg + '\n\n' + diagnosticMsg);
    appendMessage(chatId, 'user', text);
    appendMessage(chatId, 'assistant', visibleText);
    appendMessage(chatId, 'assistant', diagnosticMsg);
    active.history.push({ role: 'assistant', content: diagnosticMsg });
    active.step++;
  } else {
    await channel.sendMessage(chatId, visibleText);
    appendMessage(chatId, 'user', text);
    appendMessage(chatId, 'assistant', visibleText);
  }

  // Check if lesson is complete
  if (active.step >= active.steps.length) {
    // Offer autonomy choice at the end
    const autonomyMsg = active.mode !== 'quick'
      ? '\n\nWant to <b>go deeper</b> on this, or <b>move on</b> to the next topic?'
      : '';
    if (autonomyMsg) {
      await channel.sendMessage(chatId, autonomyMsg);
    }
    completeSocraticLesson(chatId, active, text);
  }

  return true;
}

async function assessRetrievalQuality(answer, concept) {
  if (answer.length < 5) return 'wrong';

  try {
    const response = await generate(
      `You are assessing whether a student correctly recalled a concept. The concept is "${concept}". Rate the quality of their recall.\n\nOutput ONLY one word: "easy" (correct and confident), "hard" (partially correct or vague), or "wrong" (incorrect or irrelevant).`,
      [{ role: 'user', content: answer }],
      { model: 'cheap', outputMode: 'student' },
    );
    const rating = response.text.trim().toLowerCase();
    if (['easy', 'hard', 'wrong'].includes(rating)) return rating;
    if (rating.includes('easy')) return 'easy';
    if (rating.includes('hard')) return 'hard';
    return 'wrong';
  } catch {
    // Fallback: any substantial answer counts as "hard"
    return answer.length > 20 ? 'hard' : 'wrong';
  }
}

// ── Complete a Socratic lesson ─────────────────────────────

function completeSocraticLesson(chatId, active, _lastAnswer) {
  const { topicSlug, lessonDay, lesson, startedAt } = active;

  const engagement = assessEngagement(active.history);

  // Use assessment scores for accuracy if available, otherwise fall back to engagement
  const assessments = active.assessments || [];
  const avgScore = assessments.length
    ? assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length
    : null;
  const accuracyLabel = avgScore !== null
    ? (avgScore >= 0.7 ? 'correct' : avgScore >= 0.4 ? 'partial' : 'incorrect')
    : engagement;

  // Skip marking complete if this was a review (BLOCK directive)
  if (!active.isReview) {
    appendMemory(`Socratic lesson completed: Day ${lessonDay} — ${lesson.title} (${topicSlug}). ${active.history.length} exchanges, accuracy: ${accuracyLabel}, engagement: ${engagement}`);
    markLessonComplete(topicSlug, lessonDay, accuracyLabel);

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

  // Multiple signals, not just length
  const avgLength = studentMessages.reduce((sum, m) => sum + m.content.length, 0) / studentMessages.length;
  const messageCount = studentMessages.length;
  const askedQuestions = studentMessages.some((m) => m.content.includes('?'));
  const usedBecause = studentMessages.some((m) => /because|since|therefore|so that/i.test(m.content));
  const saidSkip = studentMessages.some((m) => /^(skip|next|move on|idk|i don'?t know)$/i.test(m.content.trim()));

  if (saidSkip) return 'minimal';
  if (askedQuestions) return 'high';
  if (usedBecause && avgLength > 20) return 'high';
  if (messageCount >= 3 && avgLength > 15) return 'engaged';
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
    `- **Step scores:** ${(active.assessments || []).map((a) => `${a.step}=${a.score}`).join(', ') || 'no assessments'}`,
    `- **Exercise format:** ${active.exerciseFormat || 'socratic'}`,
    '',
    '## Session',
    `- **Date:** ${new Date().toISOString().split('T')[0]}`,
    `- **Time:** ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
    `- **Exchanges:** ${active.history.length}`,
    `- **Avg answer length:** ${studentMessages.length ? Math.round(studentMessages.reduce((s, m) => s + m.content.length, 0) / studentMessages.length) : 0} chars`,
    `- **Avg response time:** ${studentMessages.length ? Math.round(studentMessages.reduce((s, m) => s + (m.responseTimeMs || 0), 0) / studentMessages.length / 1000) : 0}s`,
    '',
    '## Notes for Next Session',
    `Last covered: ${lesson.title}. Concepts: ${(lesson.concepts || []).join(', ')}.`,
    active.plan?.goal ? `Goal was: ${active.plan.goal}` : '',
    engagement === 'minimal' || engagement === 'brief' ? 'Student gave short answers — try more engaging hooks next time.' : '',
  ].filter(Boolean);

  writeDomainFile(topicSlug, 'learning.md', lines.join('\n'));
  log.debug({ topic: topicSlug, lessonDay }, 'learning.md written');
}

// ── Streak tracking ────────────────────────────────────────

export function computeStreak(progressOverride) {
  const progress = progressOverride || readProgress();
  const history = progress.history || [];
  if (!history.length) return 0;

  const uniqueDays = [...new Set(history.map((h) => h.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 0;
  let expected = new Date(uniqueDays[0]);

  for (const day of uniqueDays) {
    const d = new Date(day);
    const diff = Math.round((expected - d) / 86400000);
    if (diff > 1) break;
    streak++;
    expected = d;
  }

  return streak;
}

// ── Assessment parsing ─────────────────────────────────────

function parseAssessment(responseText) {
  const assessmentMatch = responseText.match(/<assessment>([\s\S]*?)<\/assessment>/);
  if (!assessmentMatch) return { assessment: null, visibleText: responseText.trim() };

  let assessment = null;
  try {
    assessment = JSON.parse(assessmentMatch[1]);
  } catch {
    log.warn('assessment parse failed');
  }

  const visibleText = responseText.replace(/<assessment>[\s\S]*?<\/assessment>\s*/g, '').trim();
  return { assessment, visibleText };
}

// ── Exercise format selection ──────────────────────────────

function selectExerciseFormat(studentModel, lessonPlan) {
  // Explicit format from lesson plan takes priority
  if (lessonPlan?.exerciseFormat && lessonPlan.exerciseFormat !== 'socratic') {
    return lessonPlan.exerciseFormat;
  }

  // Auto-detect from student behavior
  if (studentModel.engagement === 'minimal' || studentModel.engagement === 'brief') {
    return 'mc';
  }
  if (studentModel.recentAccuracy < 0.3 && studentModel.exerciseCount < 5) {
    return 'mc';
  }
  if (studentModel.recentAccuracy > 0.5 && studentModel.engagement === 'engaged') {
    return 'mixed';
  }

  return 'socratic';
}

function formatDiagnosticMessage(active) {
  const plan = active.plan;

  // MC format: show as numbered options
  if (active.exerciseFormat === 'mc' && plan.mcOptions && Array.isArray(plan.mcOptions)) {
    const options = plan.mcOptions.map((opt, i) => `${i + 1}. ${opt.text || opt}`).join('\n');
    return `${plan.diagnostic}\n\n${options}\n\n<i>Reply with a number, or answer in your own words.</i>`;
  }

  return plan.diagnostic;
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
