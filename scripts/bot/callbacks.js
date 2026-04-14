/**
 * Inline button callback handler.
 * Parses callback_data, sends feedback, updates progress.
 */

import { generate } from './claude.js';
import { buildChatPrompt } from './context.js';
import { appendMemory } from './state.js';

export async function handleCallback(callbackQuery, channel, skills) {
  const cbId = callbackQuery.id;
  const data = callbackQuery.data;
  const chatId = callbackQuery.message?.chat?.id;
  const messageId = callbackQuery.message?.message_id;

  if (!chatId || !data) {
    await channel.answerCallback(cbId);
    return;
  }

  // Acknowledge immediately (removes loading spinner)
  await channel.answerCallback(cbId);

  // Parse callback data
  // Format: "L{day}_{option}_{correct?}" or "hint_{id}" or "skip_{id}" or topic/intensity selectors
  if (data.startsWith('topic_') || data.startsWith('intensity_') || data.startsWith('ot_')) {
    // Onboarding selections — handled by onboarding.js via router
    // Store selection and trigger onboarding handler
    const { handleOnboardingCallback } = await import('./onboarding.js');
    return handleOnboardingCallback(data, chatId, channel, skills);
  }

  if (data.includes('hint')) {
    await channel.sendMessage(chatId, '💡 <b>Hint:</b> Think about what we covered earlier in this lesson. What concept connects to the question?', {});
    return;
  }

  if (data.includes('skip')) {
    await channel.sendMessage(chatId, "⏭ No worries — skipped. We'll come back to this one later.");
    appendMemory(`Exercise skipped: ${data}`);
    return;
  }

  if (data.includes('correct')) {
    // Remove buttons from original message
    try {
      await channel.editMessageButtons(chatId, messageId, []);
    } catch { /* may fail if message is old */ }

    await channel.sendMessage(chatId, "✅ <b>Correct!</b> Nice one. That's exactly right.");
    appendMemory(`Exercise correct: ${data}`);
    return;
  }

  // Wrong answer
  if (data.startsWith('L') || data.startsWith('ans_')) {
    try {
      await channel.editMessageButtons(chatId, messageId, []);
    } catch { /* may fail */ }

    await channel.sendMessage(chatId, "❌ Not quite — think about it from a different angle. What did we say about this concept earlier?");
    appendMemory(`Exercise incorrect: ${data}`);
    return;
  }
}
