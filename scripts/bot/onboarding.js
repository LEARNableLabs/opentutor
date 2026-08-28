/**
 * Onboarding flow — guided conversation for new students.
 * State-driven conversation: compact discovery after the name, then one question at a time.
 */

import { generate } from './claude.js';
import { buildOnboardingPrompt } from './context.js';
import { readProgress, updateProgress } from './state.js';
import { appendMessage, clearSession, getRecentHistory } from './session.js';
import { generateAndRegisterTopic } from './curriculum.js';
import { buildNumberChoiceButtons, sendStructuredMessage } from './message.js';
import { keepTyping } from './typing.js';
import { log } from './logger.js';

const WELCOME_CONTEXT_QUESTIONS = [
  'Are you here for school, work, or the noble art of internet rabbit holes? 🐇',
  'Is this for school, work, or a question that has been living rent-free in your brain? 🧠',
  'Are we chasing a deadline, a career move, or a very shiny curiosity? ✨',
  'Is this school, work, or a 1 a.m. question that decided it deserved a syllabus? 🌙',
];

export function extractConfirmedTopic(text) {
  const match = text.match(/<b>Topic:<\/b>\s*([^\n<]+)/i);
  const topic = match?.[1]?.trim();
  return topic && topic.length > 2 && topic.length < 100 ? topic : null;
}

export function isOnboarding() {
  const progress = readProgress();
  return progress.onboarding?.active === true;
}

function sendOnboardingResponse(channel, chatId, text) {
  const buttons = buildNumberChoiceButtons(text);
  return sendStructuredMessage(channel, chatId, text, buttons.length ? { buttons } : {});
}

export async function startOnboarding(chatId, channel, _skills) {
  log.info({ user_id: chatId }, 'onboarding started');
  clearSession(chatId);
  updateProgress((p) => {
    p.onboarding = { active: true, step: 'name', startedAt: Date.now() };
  });

  // Send first message
  const contextQuestion = WELCOME_CONTEXT_QUESTIONS[
    Math.floor(Math.random() * WELCOME_CONTEXT_QUESTIONS.length)
  ];
  const welcome = `Hey! 👋 I’m your tutor — a study buddy who’s weirdly good at explaining things.\n\nWhat’s your name? ${contextQuestion}`;
  await channel.sendMessage(chatId, welcome);
  appendMessage(chatId, 'assistant', welcome);
}

export async function handleOnboarding(text, chatId, channel, skills) {
  await channel.sendTyping(chatId);
  const stopTyping = keepTyping(channel, chatId);

  // Log user message
  appendMessage(chatId, 'user', text);

  // Build prompt with full conversation history
  const { system, model, outputMode } = buildOnboardingPrompt(skills);
  const history = getRecentHistory(chatId);

  let response;
  try {
    response = await generate(system, history, { model, outputMode });
  } catch (err) {
    log.error({ err, user_id: chatId }, 'onboarding generation failed');
    await channel.sendMessage(chatId, 'Hit a snag — tell me again what you would like to learn.');
    stopTyping();
    return;
  }

  try {
    // Log assistant response
    appendMessage(chatId, 'assistant', response.text);

    updateProgress((p) => {
      if (p.onboarding?.active && p.onboarding.step === 'name') {
        p.onboarding.step = 'needs-discovery';
      }
    });

    // Only an explicit HTML marker can finalize onboarding. Never infer a topic
    // from ordinary prose; phrases such as "build a curriculum" are ambiguous.
    const detectedTopic = extractConfirmedTopic(response.text);

    if (detectedTopic) {
      await sendStructuredMessage(channel, chatId, response.text);
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
        log.error({ err, topic: detectedTopic }, 'onboarding curriculum error');
        await channel.sendMessage(chatId, "Had trouble setting up the topic. Tell me the topic again and I'll retry.");
      }
      return;
    }

    await sendOnboardingResponse(channel, chatId, response.text);
  } finally {
    stopTyping();
  }
}

export async function handleOnboardingCallback(data, chatId, channel, skills) {
  // Convert button tap to text and feed through onboarding
  let text = data;
  if (data.startsWith('topic_')) text = data.replace('topic_', '').replace(/_/g, ' ');
  if (data.startsWith('intensity_')) text = data.replace('intensity_', '');
  if (data.startsWith('ot_')) text = data.replace('ot_', '').replace(/_/g, ' ');

  return handleOnboarding(text, chatId, channel, skills);
}
