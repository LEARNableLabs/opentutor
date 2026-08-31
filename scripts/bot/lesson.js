/**
 * Lesson delivery — generate via Claude, parse by emoji anchors, send chunked.
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

export async function deliverNextLesson(topicSlug, chatId, channel, skills) {
  const start = Date.now();
  const lesson = getNextLesson(topicSlug);
  if (!lesson) {
    log.info({ topic: topicSlug }, 'all lessons completed');
    const curriculum = readCurriculum(topicSlug);
    await channel.sendMessage(chatId, `🎉 <b>You've completed all ${curriculum?.lessons?.length || 0} lessons in ${curriculum?.topic || topicSlug}!</b>\n\nType /quiz for a final review, or /add to start something new.`);
    return;
  }

  // Show typing while generating
  await channel.sendTyping(chatId);

  log.info({ topic: topicSlug, lesson_id: lesson.day, title: lesson.title }, 'delivering lesson');

  // Build prompt and generate (Teacher agent — scoped context)
  const { system, model, outputMode } = buildTeacherPrompt(skills, lesson, topicSlug);
  const lessonDay = lesson.day || lesson.lesson;
  const messages = [{ role: 'user', content: `Deliver lesson Day ${lessonDay}: "${lesson.title}"` }];

  const response = await generate(system, messages, { model, outputMode });

  // Parse response into chunks by emoji anchors
  const chunks = parseLessonChunks(response.text);

  // Send each chunk
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isLast = i === chunks.length - 1;
    const options = {};

    // Add exercise buttons to the last message (or any ✏️ message)
    if (chunk.anchor === '✏️' || (isLast && !chunks.some((c) => c.anchor === '✏️'))) {
      options.buttons = buildExerciseButtons(lesson.day, chunk.text, topicSlug);
    }

    await channel.sendMessage(chatId, stripAnswerKey(chunk.text), options);

    if (i < chunks.length - 1) {
      await sleep(2000);
    }
  }

  exerciseState.contexts[topicSlug + ':' + lesson.day] = {
    title: lesson.title,
    concepts: lesson.concepts,
    topicSlug,
  };
  saveExerciseState(exerciseState);

  // Log and update progress
  log.info({ topic: topicSlug, lesson_id: lessonDay, chunks: chunks.length, latency_ms: Date.now() - start }, 'lesson delivered');
  appendMessage(chatId, 'assistant', response.text);
  appendMemory(`Lesson delivered: Day ${lessonDay} — ${lesson.title} (${topicSlug})`);
  markLessonComplete(topicSlug, lessonDay, { delivered: true });

  // Register concepts for spaced repetition
  if (lesson.concepts?.length) {
    registerLessonConcepts(topicSlug, lesson.concepts);
  }

  // Write learning.md for session continuity
  writeLearningLog(topicSlug, lesson);
}

// ── Last exercise result (set by callbacks.js) ─────────────

const lastExerciseResults = {};

export function setLastExerciseResult(topicSlug, day, result) {
  lastExerciseResults[topicSlug + ':' + day] = result;
}

// ── Learning log — written after each lesson ───────────────

function writeLearningLog(topicSlug, lesson) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) return;

  const completed = curriculum.lessons.filter((l) => l.status === 'completed');
  const pending = curriculum.lessons.filter((l) => l.status === 'pending');
  const nextLesson = pending[0];
  const lessonDay = lesson.day || lesson.lesson;
  const exerciseKey = topicSlug + ':' + lessonDay;
  const exerciseResult = lastExerciseResults[exerciseKey] || 'pending';

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
      // Text before first anchor — include as intro
      if (!chunks.length) {
        current = { anchor: null, text: line + '\n' };
      }
    }
  }
  if (current) chunks.push(current);

  // Trim trailing whitespace from each chunk
  return chunks.map((c) => ({ ...c, text: c.text.trim() }));
}

// ── Build exercise buttons ──────────────────────────────────

function buildExerciseButtons(day, exerciseText, topicSlug) {
  const patterns = [
    /(?:correct|answer)\s*(?:is)?[:\s]*\(?([A-D])\)?/i,
    /\b([A-D])\b\s*(?:is\s+)?(?:the\s+)?(?:correct|right)\b/i,
    /✅\s*\(?([A-D])\)?/i,
    /^[^a-z]*correct[^a-z]*([A-D])\b/im,
  ];
  let matched = false;
  for (const pattern of patterns) {
    const m = exerciseText?.match(pattern);
    if (m) {
      exerciseState.answers[topicSlug + ':' + day] = m[1].toUpperCase();
      saveExerciseState(exerciseState);
      matched = true;
      break;
    }
  }
  if (!matched) {
    log.warn({ day }, 'could not parse correct answer from exercise text');
  }

  const options = ['A', 'B', 'C', 'D'];
  return [
    options.map((letter) => ({
      text: letter,
      callback_data: `ex:${topicSlug}:${day}:${letter}`,
    })),
    [
      { text: '💡 Hint', callback_data: `ex:${topicSlug}:${day}:hint` },
      { text: '⏭ Skip', callback_data: `ex:${topicSlug}:${day}:skip` },
    ],
  ];
}
