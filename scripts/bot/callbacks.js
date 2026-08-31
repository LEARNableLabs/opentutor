/**
 * Inline button callback handler.
 * Parses callback_data, sends feedback, updates progress.
 */

import { appendMemory } from './state.js';
import { getCorrectAnswer, getLessonContext, setLastExerciseResult } from './lesson.js';
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

  // Acknowledge immediately (removes loading spinner)
  await channel.answerCallback(cbId);

  // Parse callback data
  // Format: "L{day}_{option}_{correct?}" or "hint_{id}" or "skip_{id}" or topic/intensity selectors
  // Flashcard callbacks
  if (data.startsWith('fc::')) {
    const { handleFlashcardCallback } = await import('./flashcard.js');
    return handleFlashcardCallback(data, chatId, channel, messageId);
  }

  if (data.startsWith('topic_') || data.startsWith('intensity_') || data.startsWith('ot_')) {
    // Onboarding selections — handled by onboarding.js via router
    // Store selection and trigger onboarding handler
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
      log.warn({ err, callback: data }, 'context-aware hint generation failed, using fallback');
    }
    await channel.sendMessage(chatId, '💡 <b>Hint:</b> Think about what we covered earlier in this lesson. What concept connects to the question?', {});
    return;
  }

  if (data.endsWith(':skip')) {
    await channel.sendMessage(chatId, "⏭ No worries — skipped. We'll come back to this one later.");
    appendMemory(`Exercise skipped: ${data}`);
    return;
  }

  // Lesson exercise answer: ex:{topicSlug}:{day}:{letter}
  if (data.startsWith('ex:')) {
    const match = data.match(/^ex:([^:]+):(\d+):([A-D])$/);
    if (match) {
      const [, topicSlug, day, letter] = match;
      const correct = getCorrectAnswer(topicSlug, Number(day));
      try {
        await channel.editMessageButtons(chatId, messageId, []);
      } catch { /* may fail if message is old */ }

      if (!correct) {
        log.warn({ day, letter }, 'no correct answer stored');
        await channel.sendMessage(chatId, `You picked <b>${letter}</b> — I couldn't score this one automatically. Let's keep going!`);
        appendMemory(`Exercise unscored (no answer key): ${data}`);
      } else if (letter === correct) {
        setLastExerciseResult(topicSlug, Number(day), 'correct');
        await channel.sendMessage(chatId, "✅ <b>Correct!</b> Nice one. That's exactly right.");
        appendMemory(`Exercise correct: ${data}`);
      } else {
        setLastExerciseResult(topicSlug, Number(day), 'incorrect');
        await channel.sendMessage(chatId, "❌ Not quite — think about it from a different angle. What did we say about this concept earlier?");
        appendMemory(`Exercise incorrect: ${data}`);
      }
      return;
    }
  }
}
