/**
 * Inline button callback handler.
 * Parses callback_data, sends feedback, updates progress.
 */

import { appendMemory } from './state.js';
import { getCorrectAnswer, getLessonContext } from './lesson.js';
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
    const { handleOnboardingCallback } = await import('./onboarding.js');
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
            `Give a brief, helpful hint for this exercise. Topic: ${ctx.title}, Concepts: ${(ctx.concepts || []).join(', ')}. Do not give away the answer.`,
            [{ role: 'user', content: 'I need a hint for this exercise.' }],
            { model: 'cheap' }
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
        log.warn({ day, letter }, 'no correct answer stored — accepting any answer');
        await channel.sendMessage(chatId, "✅ <b>Correct!</b> Nice one. That's exactly right.");
        appendMemory(`Exercise accepted (no answer key): ${data}`);
      } else if (letter === correct) {
        await channel.sendMessage(chatId, "✅ <b>Correct!</b> Nice one. That's exactly right.");
        appendMemory(`Exercise correct: ${data}`);
      } else {
        await channel.sendMessage(chatId, "❌ Not quite — think about it from a different angle. What did we say about this concept earlier?");
        appendMemory(`Exercise incorrect: ${data}`);
      }
      return;
    }
  }
}
