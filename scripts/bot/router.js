/**
 * Message router — inspects incoming updates and dispatches to the right handler.
 * Order: onboarding → commands → callbacks → poll answers → general chat
 */

import { handleCommand, isCommand } from './commands.js';
import { handleCallback } from './callbacks.js';
import { handleOnboarding, isOnboarding } from './onboarding.js';
import { handleChat } from './chat.js';
import { getActiveLesson, handleLessonAnswer } from './lesson.js';
import { isGroupChat, addGroupMember } from './state.js';
import { runWithReqId, log } from './logger.js';

export async function route(update, channel, skills) {
  return runWithReqId(async () => {
    try {
      return await dispatch(update, channel, skills);
    } catch (err) {
      // A handler blew up mid-conversation. Tell the student something rather than
      // going silent, but never surface the error itself.
      const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;
      log.error({ err, chat_id: chatId }, 'handler failed');
      if (chatId) {
        try {
          await channel.sendMessage(chatId, "Something went wrong on my end — nothing you did. Send that again, or type /next to pick up where we left off.");
        } catch (sendErr) {
          log.error({ err: sendErr, chat_id: chatId }, 'could not deliver the failure notice');
        }
      }
    }
  });
}

async function dispatch(update, channel, skills) {
  const input = update.message?.text || update.callback_query?.data || 'unknown';
  const user_id = update.message?.from?.id || update.callback_query?.from?.id;
  log.info({ user_id, input: String(input).slice(0, 60) }, 'route');

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
  const userId = message.from?.id;
  const text = message.text.trim();

  // Track group members
  if (isGroupChat(chatId, userId)) {
    const name = [message.from?.first_name, message.from?.last_name].filter(Boolean).join(' ');
    addGroupMember(chatId, userId, name);
  }

  // Commands take priority
  if (isCommand(text)) {
    return handleCommand(text, chatId, channel, skills);
  }

  // Active Socratic lesson — route free-text answers to lesson handler
  if (getActiveLesson(chatId)) {
    return handleLessonAnswer(text, chatId, channel);
  }

  // Onboarding flow (if active)
  if (isOnboarding()) {
    return handleOnboarding(text, chatId, channel, skills);
  }

  // General chat
  return handleChat(text, chatId, channel, skills);
}
