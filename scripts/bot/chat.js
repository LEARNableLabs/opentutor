/**
 * General chat handler — for non-command, non-onboarding messages.
 */

import { generate } from './claude.js';
import { buildChatPrompt } from './context.js';
import { appendMessage, getRecentHistory } from './session.js';

export async function handleChat(text, chatId, channel, skills) {
  // Show typing while generating
  await channel.sendTyping(chatId);

  // Log user message
  appendMessage(chatId, 'user', text);

  // Build prompt and get history
  const { system, model } = buildChatPrompt(skills);
  const history = getRecentHistory(chatId);
  history.push({ role: 'user', content: text });

  const response = await generate(system, history, { model });

  // Log assistant response
  appendMessage(chatId, 'assistant', response.text);

  await channel.sendMessage(chatId, response.text);
}
