/**
 * Inline button callback handler.
 * Handles: lesson Continue, numbered exercise answers, hints, skips,
 * flashcards, and onboarding selections.
 */

import { appendMemory, isGroupChat, recordStudentExercise } from './state.js';
import { getCorrectAnswer, getLessonContext, setLastExerciseResult, completeLessonAfterExercise } from './lesson.js';
import { generate } from './claude.js';
import { log } from './logger.js';

export async function handleCallback(callbackQuery, channel, skills) {
  const cbId = callbackQuery.id;
  const data = callbackQuery.data;
  const chatId = callbackQuery.message?.chat?.id;
  const messageId = callbackQuery.message?.message_id;

  if (!chatId || !data) {
    await channel.answerCallback(cbId);
    return;
  }

  log.info({ callback: data, user_id: chatId }, 'callback received');
  await channel.answerCallback(cbId);

  // Flashcard callbacks
  if (data.startsWith('fc::')) {
    const { handleFlashcardCallback } = await import('./flashcard.js');
    return handleFlashcardCallback(data, chatId, channel, messageId);
  }

  // Onboarding selections
  if (data.startsWith('topic_') || data.startsWith('intensity_') || data.startsWith('ot_')) {
    const { handleOnboardingCallback, isOnboarding } = await import('./onboarding.js');
    if (!isOnboarding()) {
      await channel.sendMessage(chatId, 'That choice belongs to an older question.');
      return;
    }
    try {
      await channel.editMessageButtons(chatId, messageId, []);
    } catch { /* old message */ }
    return handleOnboardingCallback(data, chatId, channel, skills);
  }

  // Hint
  if (data.endsWith(':hint')) {
    try {
      const match = data.match(/^ex:([^:]+):(\d+):hint$/);
      if (match) {
        const [, topicSlug, day] = match;
        const ctx = getLessonContext(topicSlug, Number(day));
        if (ctx) {
          await channel.sendTyping(chatId);
          const result = await generate(
            'Give a brief, student-facing hint using the exercise context in the user message. Do not give away the answer. Ask at most one guiding question.',
            [{ role: 'user', content: JSON.stringify({ request: 'I need a hint.', exercise: ctx }) }],
            { model: 'cheap', outputMode: 'student' }
          );
          await channel.sendMessage(chatId, `💡 <b>Hint:</b> ${result.text}`);
          return;
        }
      }
    } catch (err) {
      log.warn({ err, callback: data }, 'hint generation failed');
    }
    await channel.sendMessage(chatId, '💡 <b>Hint:</b> Think about what we covered earlier in this lesson. What concept connects to the question?');
    return;
  }

  // Skip
  if (data.endsWith(':skip')) {
    try {
      await channel.editMessageButtons(chatId, messageId, []);
    } catch { /* old message */ }
    await channel.sendMessage(chatId, "⏭ No worries — skipped. We'll come back to this one later.");
    appendMemory(`Exercise skipped: ${data}`);
    completeLessonAfterExercise(chatId);
    return;
  }

  // Exercise answer: ex:{topicSlug}:{day}:{letter}
  if (data.startsWith('ex:')) {
    const match = data.match(/^ex:([^:]+):(\d+):([A-D])$/);
    if (match) {
      const [, topicSlug, day, letter] = match;
      const correct = getCorrectAnswer(topicSlug, Number(day));
      const userId = callbackQuery.from?.id;
      const inGroup = isGroupChat(chatId, userId);
      const feedbackTarget = inGroup && userId ? userId : chatId;

      try {
        await channel.editMessageButtons(chatId, messageId, []);
      } catch { /* old message */ }

      if (!correct) {
        log.warn({ day, letter }, 'no correct answer stored');
        await channel.sendMessage(feedbackTarget, `You picked <b>${letter}</b> — I couldn't score this one automatically. Let's keep going!`);
        appendMemory(`Exercise unscored: ${data}`);
      } else if (letter === correct) {
        setLastExerciseResult(topicSlug, Number(day), 'correct');
        await channel.sendMessage(feedbackTarget, "✅ <b>Correct!</b> Nice one.");
        appendMemory(`Exercise correct: ${data}`);
        if (inGroup) {
          await channel.sendMessage(chatId, "Someone just nailed it! 🎉").catch(() => {});
        }
      } else {
        setLastExerciseResult(topicSlug, Number(day), 'incorrect');
        await channel.sendMessage(feedbackTarget, `❌ Not quite — the answer was <b>${correct}</b>. Think about why.`);
        appendMemory(`Exercise incorrect: ${data}`);
      }

      if (userId) {
        recordStudentExercise(userId, topicSlug, Number(day), letter === correct ? 'correct' : 'incorrect');
      }

      completeLessonAfterExercise(chatId);
      return;
    }
  }
}
