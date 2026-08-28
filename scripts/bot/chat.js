/**
 * General chat handler — for non-command, non-onboarding messages.
 */

import { generate } from './claude.js';
import { buildChatPrompt } from './context.js';
import { appendMessage, getRecentHistory } from './session.js';
import { sendStructuredMessage } from './message.js';
import { keepTyping } from './typing.js';
import { log } from './logger.js';

export async function handleChat(text, chatId, channel, skills) {
  log.info({ user_id: chatId }, 'chat message');
  // Show typing while generating
  await channel.sendTyping(chatId);
  const stopTyping = keepTyping(channel, chatId);

  // Log user message
  appendMessage(chatId, 'user', text);

  // Build prompt and get history
  const { system, model, outputMode } = buildChatPrompt(skills);
  const history = getRecentHistory(chatId);

  try {
    const response = await generate(system, history, { model, outputMode });

    // Log assistant response
    appendMessage(chatId, 'assistant', response.text);

    await sendStructuredMessage(channel, chatId, response.text);
  } catch (err) {
    log.error({ err, user_id: chatId }, 'chat generation failed');
    await channel.sendMessage(chatId, 'Something went wrong — try again in a moment.');
  } finally {
    stopTyping();
  }
}
