/**
 * Lesson delivery — send teaching chunks naturally, pause only at exercises.
 *
 * Flow:
 *   1. Generate full lesson in one Claude call
 *   2. Parse into emoji-anchored chunks
 *   3. Send content chunks with short delays (tutor "typing")
 *   4. On exercise chunk, show numbered answer buttons (1-4) and wait
 *   5. On answer, show feedback, mark complete, write learning.md
 */

import fs from 'fs';
import path from 'path';
import { generate } from './claude.js';
import { buildTeacherPrompt } from './context.js';
import { getNextLesson, markLessonComplete, readCurriculum, writeDomainFile, appendMemory } from './state.js';
import { PATHS } from './config.js';
import { appendMessage } from './session.js';
import { registerLessonConcepts } from './spaced-repetition.js';
import { sleep } from './helpers.js';
import { log } from './logger.js';

// ── Exercise state ─────────────────────────────────────────

const EXERCISE_STATE_PATH = path.join(PATHS.workspace, 'tutor', 'exercise-state.json');

function loadExerciseState() {
  try {
    return JSON.parse(fs.readFileSync(EXERCISE_STATE_PATH, 'utf-8'));
  } catch {
    return { answers: {}, contexts: {} };
  }
}

function saveExerciseState(state) {
  const dir = path.dirname(EXERCISE_STATE_PATH);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = EXERCISE_STATE_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, EXERCISE_STATE_PATH);
}

const exerciseState = loadExerciseState();

export function getCorrectAnswer(topicSlug, day) {
  return exerciseState.answers[topicSlug + ':' + day];
}

export function getLessonContext(topicSlug, day) {
  return exerciseState.contexts[topicSlug + ':' + day];
}

export function stripAnswerKey(text) {
  return text
    .replace(/^\s*(?:correct|answer)\s*(?:is)?\s*[:\s]\s*\(?[A-D]\)?\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── Last exercise result (set by callbacks.js) ─────────────

const lastExerciseResults = {};

export function setLastExerciseResult(topicSlug, day, result) {
  lastExerciseResults[topicSlug + ':' + day] = result;
}

// ── Pending lessons (waiting for exercise answer) ──────────

const pendingLessons = {};

export function getPendingLesson(chatId) {
  return pendingLessons[chatId] || null;
}

function clearPendingLesson(chatId) {
  delete pendingLessons[chatId];
}

// ── Main entry: generate and deliver lesson ────────────────

export async function deliverNextLesson(topicSlug, chatId, channel, skills) {
  const start = Date.now();
  const lesson = getNextLesson(topicSlug);
  if (!lesson) {
    log.info({ topic: topicSlug }, 'all lessons completed');
    const curriculum = readCurriculum(topicSlug);
    await channel.sendMessage(chatId, `🎉 <b>You've completed all ${curriculum?.lessons?.length || 0} lessons in ${curriculum?.topic || topicSlug}!</b>\n\nType /quiz for a final review, or /add to start something new.`);
    return;
  }

  await channel.sendTyping(chatId);

  const lessonDay = lesson.day || lesson.lesson;
  log.info({ topic: topicSlug, lesson_id: lessonDay, title: lesson.title }, 'generating lesson');

  const { system, model, outputMode } = buildTeacherPrompt(skills, lesson, topicSlug);
  const response = await generate(system, [
    { role: 'user', content: `Deliver lesson Day ${lessonDay}: "${lesson.title}"` },
  ], { model, outputMode });

  const chunks = parseLessonChunks(response.text);

  // Store exercise context + correct answer
  exerciseState.contexts[topicSlug + ':' + lessonDay] = {
    title: lesson.title,
    concepts: lesson.concepts,
    topicSlug,
  };
  parseAndStoreAnswer(response.text, topicSlug, lessonDay);
  saveExerciseState(exerciseState);

  appendMessage(chatId, 'assistant', response.text);

  // Send content chunks with natural delays, pause at exercise
  let hasExercise = false;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isExercise = chunk.anchor === '✏️';

    if (isExercise) {
      hasExercise = true;
      const buttons = buildNumberedExerciseButtons(topicSlug, lessonDay, chunk.text);
      await channel.sendMessage(chatId, stripAnswerKey(chunk.text), { buttons });

      // Store pending lesson — completes when student answers
      pendingLessons[chatId] = {
        topicSlug,
        lessonDay,
        lesson: { day: lessonDay, title: lesson.title, module: lesson.module, concepts: lesson.concepts },
      };
    } else {
      await channel.sendMessage(chatId, stripAnswerKey(chunk.text));
      if (i < chunks.length - 1) await sleep(2000);
    }
  }

  log.info({ topic: topicSlug, lesson_id: lessonDay, chunks: chunks.length, hasExercise, latency_ms: Date.now() - start }, 'lesson delivered');

  // If no exercise chunk, complete immediately
  if (!hasExercise) {
    finishLesson(topicSlug, lessonDay, lesson);
  }
}

// ── Complete lesson (called after exercise or if no exercise) ──

function finishLesson(topicSlug, lessonDay, lesson) {
  appendMemory(`Lesson delivered: Day ${lessonDay} — ${lesson.title} (${topicSlug})`);
  markLessonComplete(topicSlug, lessonDay, { delivered: true });

  if (lesson.concepts?.length) {
    registerLessonConcepts(topicSlug, lesson.concepts);
  }

  writeLearningLog(topicSlug, lesson);
}

/**
 * Called by callbacks.js after exercise answer or skip.
 */
export function completeLessonAfterExercise(chatId) {
  const pending = pendingLessons[chatId];
  if (pending) {
    finishLesson(pending.topicSlug, pending.lessonDay, pending.lesson);
    clearPendingLesson(chatId);
  }
}

// ── Learning log ───────────────────────────────────────────

function writeLearningLog(topicSlug, lesson) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) return;

  const completed = curriculum.lessons.filter((l) => l.status === 'completed');
  const pending = curriculum.lessons.filter((l) => l.status === 'pending');
  const nextLesson = pending[0];
  const lessonDay = lesson.day || lesson.lesson;
  const exerciseResult = lastExerciseResults[topicSlug + ':' + lessonDay] || 'pending';

  const lines = [
    `# Learning Log: ${curriculum.topic || topicSlug}`,
    '',
    `## Position`,
    `- **Last lesson:** Day ${lessonDay} — ${lesson.title}`,
    `- **Next lesson:** ${nextLesson ? `Day ${nextLesson.day || nextLesson.lesson} — ${nextLesson.title}` : 'Curriculum complete'}`,
    `- **Progress:** ${completed.length}/${curriculum.lessons.length} lessons (${Math.round((completed.length / curriculum.lessons.length) * 100)}%)`,
    '',
    `## Performance`,
    `- **Last exercise:** ${exerciseResult}`,
    '',
    `## Session`,
    `- **Date:** ${new Date().toISOString().split('T')[0]}`,
    `- **Time:** ${new Date().toLocaleTimeString('en-US', { hour12: false })}`,
    '',
    `## Notes for Next Session`,
    `Last covered: ${lesson.title}. Concepts: ${(lesson.concepts || []).join(', ')}.`,
  ];

  writeDomainFile(topicSlug, 'learning.md', lines.join('\n'));
  log.debug({ topic: topicSlug, lessonDay }, 'learning.md written');
}

// ── Parse lesson text into chunks by emoji anchors ──────────

const ANCHORS = ['📖', '🧠', '💡', '✏️', '🔗'];

function parseLessonChunks(text) {
  const chunks = [];
  const lines = text.split('\n');
  let current = null;

  for (const line of lines) {
    const anchor = ANCHORS.find((a) => line.trimStart().startsWith(a));
    if (anchor) {
      if (current) chunks.push(current);
      current = { anchor, text: line + '\n' };
    } else if (current) {
      current.text += line + '\n';
    } else {
      if (!chunks.length) {
        current = { anchor: null, text: line + '\n' };
      }
    }
  }
  if (current) chunks.push(current);

  return chunks.map((c) => ({ ...c, text: c.text.trim() }));
}

// ── Exercise buttons (numbered 1-4) ────────────────────────

function parseAndStoreAnswer(fullText, topicSlug, day) {
  const patterns = [
    /(?:correct|answer)\s*(?:is)?[:\s]*\(?([A-D])\)?/i,
    /\b([A-D])\b\s*(?:is\s+)?(?:the\s+)?(?:correct|right)\b/i,
    /✅\s*\(?([A-D])\)?/i,
    /^[^a-z]*correct[^a-z]*([A-D])\b/im,
  ];
  for (const pattern of patterns) {
    const m = fullText?.match(pattern);
    if (m) {
      exerciseState.answers[topicSlug + ':' + day] = m[1].toUpperCase();
      return;
    }
  }
  log.warn({ day }, 'could not parse correct answer from exercise text');
}

function buildNumberedExerciseButtons(topicSlug, day, exerciseText) {
  const labels = parseExerciseOptionLabels(exerciseText);

  const row1 = labels.map((label, i) => ({
    text: `${i + 1}`,
    callback_data: `ex:${topicSlug}:${day}:${String.fromCharCode(65 + i)}`,
  }));

  const row2 = [
    { text: '💡 Hint', callback_data: `ex:${topicSlug}:${day}:hint` },
    { text: '⏭ Skip', callback_data: `ex:${topicSlug}:${day}:skip` },
  ];

  return [row1, row2];
}

function parseExerciseOptionLabels(text) {
  const labels = [];
  const pattern = /\b([A-D])[.):\s]+(.+?)(?:\n|$)/g;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    labels.push(m[2].trim().slice(0, 40));
  }
  return labels.length >= 2 ? labels : ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
}
