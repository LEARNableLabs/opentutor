/**
 * Message router — inspects incoming updates and dispatches to the right handler.
 * Order: onboarding → commands → callbacks → poll answers → general chat
 */

import { handleCommand, isCommand } from './commands.js';
import { handleCallback } from './callbacks.js';
import { handleOnboarding, isOnboarding } from './onboarding.js';
import { handleChat } from './chat.js';

export async function route(update, channel, skills) {
  console.log('  route:', JSON.stringify(update.message?.text || update.callback_query?.data || 'unknown').slice(0, 60));

  // Callback query (button tap)
  if (update.callback_query) {
    return handleCallback(update.callback_query, channel, skills);
  }

  // Poll answer
  if (update.poll_answer) {
    const { appendMemory } = await import('./state.js');
    const answer = update.poll_answer;
    const optionIds = answer.option_ids || [];
    appendMemory(`Quiz poll answered: options [${optionIds.join(', ')}] by user ${answer.user?.id || 'unknown'}`);
    return;
  }

  // Text message
  const message = update.message;
  if (!message?.text) return;

  const chatId = message.chat.id;
  const text = message.text.trim();

  // Commands take priority
  if (isCommand(text)) {
    return handleCommand(text, chatId, channel, skills);
  }

  // Onboarding flow (if active)
  if (isOnboarding()) {
    return handleOnboarding(text, chatId, channel, skills);
  }

  // General chat
  return handleChat(text, chatId, channel, skills);
}
