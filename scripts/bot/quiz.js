/**
 * Quiz generation — create and send review quizzes via Telegram polls.
 */

import { generate } from './claude.js';
import { buildQuizPrompt } from './context.js';
import { readCurriculum } from './state.js';

export async function generateQuiz(topicSlug, chatId, channel, skills) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) {
    await channel.sendMessage(chatId, "Can't find that curriculum. Try /topics to see what's available.");
    return;
  }

  // Get recently completed lessons for quiz material
  const completed = curriculum.lessons.filter((l) => l.status === 'completed');
  if (completed.length < 2) {
    await channel.sendMessage(chatId, "You need at least a couple lessons under your belt before a quiz. Keep going!");
    return;
  }

  const recent = completed.slice(-5); // last 5 completed lessons

  await channel.sendTyping(chatId);
  await channel.sendMessage(chatId, "🧠 <b>Pop quiz!</b> Don't panic — let's see what stuck.\n");

  const { system } = buildQuizPrompt(skills, topicSlug, recent);
  const response = await generate(system, [
    { role: 'user', content: `Generate a review quiz for: ${recent.map((l) => l.title).join(', ')}` },
  ], { model: 'strong' });

  // Parse JSON from response
  try {
    const jsonMatch = response.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found');
    const questions = JSON.parse(jsonMatch[0]);

    for (const q of questions) {
      await channel.sendPoll(chatId, q.question, q.options, {
        correctOptionId: q.correct,
        explanation: q.explanation,
      });
      await sleep(1500);
    }
  } catch (err) {
    // Fallback: send as text if JSON parsing fails
    await channel.sendMessage(chatId, response.text);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
