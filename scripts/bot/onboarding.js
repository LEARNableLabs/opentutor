/**
 * Onboarding flow — guided conversation for new students.
 * One question at a time, Claude drives the conversation.
 */

import { generate } from './claude.js';
import { buildOnboardingPrompt } from './context.js';
import { readProgress, updateProgress } from './state.js';
import { appendMessage, getRecentHistory } from './session.js';

export function isOnboarding() {
  const progress = readProgress();
  return progress.onboarding?.active === true;
}

export async function startOnboarding(chatId, channel, skills) {
  updateProgress((p) => {
    p.onboarding = { active: true, step: 'intro', startedAt: Date.now() };
  });

  // Send first message
  await channel.sendMessage(chatId,
    "Hey! 👋 I'm your tutor — a study buddy who's weirdly good at explaining things.\n\nWhat's your name?"
  );
}

export async function handleOnboarding(text, chatId, channel, skills) {
  await channel.sendTyping(chatId);

  // Log user message
  appendMessage(chatId, 'user', text);

  // Build prompt with full conversation history
  const { system } = buildOnboardingPrompt(skills);
  const history = getRecentHistory(chatId);
  history.push({ role: 'user', content: text });

  const response = await generate(system, history, { model: 'strong' });

  // Log assistant response
  appendMessage(chatId, 'assistant', response.text);

  // Check if onboarding is complete (Claude mentions curriculum is ready or active_topics set)
  const text_lower = response.text.toLowerCase();
  if (text_lower.includes('curriculum is ready') || text_lower.includes('lesson 1') || text_lower.includes('first lesson')) {
    updateProgress((p) => {
      p.onboarding = { active: false, completedAt: Date.now() };
    });
  }

  await channel.sendMessage(chatId, response.text);
}

export async function handleOnboardingCallback(data, chatId, channel, skills) {
  // Convert button tap to text and feed through onboarding
  let text = data;
  if (data.startsWith('topic_')) text = data.replace('topic_', '').replace(/_/g, ' ');
  if (data.startsWith('intensity_')) text = data.replace('intensity_', '');
  if (data.startsWith('ot_')) text = data.replace('ot_', '').replace(/_/g, ' ');

  return handleOnboarding(text, chatId, channel, skills);
}
