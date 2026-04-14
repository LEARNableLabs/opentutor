/**
 * Onboarding flow — guided conversation for new students.
 * One question at a time, Claude drives the conversation.
 */

import { generate } from './claude.js';
import { buildOnboardingPrompt } from './context.js';
import { readProgress, updateProgress } from './state.js';
import { appendMessage, getRecentHistory } from './session.js';
import { generateAndRegisterTopic } from './curriculum.js';

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

  // Check if Claude's response indicates a topic was chosen
  const topicMatch = response.text.match(/(?:building|generating|creating|preparing).*?curriculum.*?(?:for|on|about)\s+["""]?([^""".\n]+)/i)
    || response.text.match(/(?:let'?s?\s+(?:start|learn|dive|explore))\s+([^.!\n]+)/i);

  // Also detect if Claude explicitly names the topic in a structured way
  const explicitTopic = response.text.match(/\*\*Topic:\*\*\s*(.+)/i)
    || response.text.match(/📚\s*(.+?)(?:\s*—|\n)/);

  const detectedTopic = explicitTopic?.[1]?.trim() || topicMatch?.[1]?.trim();

  if (detectedTopic && detectedTopic.length > 2 && detectedTopic.length < 100) {
    await channel.sendMessage(chatId, response.text);
    await channel.sendTyping(chatId);

    try {
      const { intro } = await generateAndRegisterTopic(detectedTopic, skills, chatId, channel);
      updateProgress((p) => {
        p.onboarding = { active: false, completedAt: Date.now() };
      });

      // Send mini-wiki intro
      if (intro) {
        await channel.sendMessage(chatId, intro);
        await channel.sendMessage(chatId, '🔬 Researching and building your full curriculum — I\'ll let you know when it\'s ready.');
      }
    } catch (err) {
      console.error('  onboarding curriculum error:', err.message);
      await channel.sendMessage(chatId, "Had trouble setting up the topic. Tell me the topic again and I'll retry.");
    }
    return;
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
