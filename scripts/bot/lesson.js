/**
 * Lesson delivery — generate via Claude, parse by emoji anchors, send chunked.
 */

import { generateStream } from './claude.js';
import { buildLessonPrompt } from './context.js';
import { getNextLesson, markLessonComplete, readCurriculum, appendMemory } from './state.js';
import { appendMessage } from './session.js';

export async function deliverNextLesson(topicSlug, chatId, channel, skills) {
  const lesson = getNextLesson(topicSlug);
  if (!lesson) {
    const curriculum = readCurriculum(topicSlug);
    await channel.sendMessage(chatId, `🎉 <b>You've completed all ${curriculum?.lessons?.length || 0} lessons in ${curriculum?.topic || topicSlug}!</b>\n\nType /quiz for a final review, or /add to start something new.`);
    return;
  }

  // Show typing while generating
  await channel.sendTyping(chatId);

  // Build prompt and generate
  const { system, model } = buildLessonPrompt(skills, lesson, topicSlug);
  const messages = [{ role: 'user', content: `Deliver lesson Day ${lesson.day}: "${lesson.title}"` }];

  const response = await generateStream(system, messages, { model });

  // Parse response into chunks by emoji anchors
  const chunks = parseLessonChunks(response.text);

  // Send each chunk
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isLast = i === chunks.length - 1;
    const options = {};

    // Add exercise buttons to the last message (or any ✏️ message)
    if (chunk.anchor === '✏️' || (isLast && !chunks.some((c) => c.anchor === '✏️'))) {
      options.buttons = buildExerciseButtons(lesson.day);
    }

    await channel.sendMessage(chatId, chunk.text, options);

    if (i < chunks.length - 1) {
      await sleep(2000);
    }
  }

  // Log and update progress
  appendMessage(chatId, 'assistant', response.text);
  appendMemory(`Lesson delivered: Day ${lesson.day} — ${lesson.title} (${topicSlug})`);
  markLessonComplete(topicSlug, lesson.day, { delivered: true });
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

function buildExerciseButtons(day) {
  return [
    [
      { text: 'A', callback_data: `L${day}_A` },
      { text: 'B', callback_data: `L${day}_B` },
      { text: 'C', callback_data: `L${day}_C` },
      { text: 'D', callback_data: `L${day}_D_correct` },
    ],
    [
      { text: '💡 Hint', callback_data: `L${day}_hint` },
      { text: '⏭ Skip', callback_data: `L${day}_skip` },
    ],
  ];
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
