/**
 * Quiz generation — create and send review quizzes via Telegram polls.
 */

import { generate } from './claude.js';
import { buildQuizPrompt } from './context.js';
import { readCurriculum } from './state.js';
import { sleep } from './helpers.js';
import { log } from './logger.js';

export async function generateQuiz(topicSlug, chatId, channel, skills, specificConcepts) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) {
    await channel.sendMessage(chatId, "Can't find that curriculum. Try /topics to see what's available.");
    return;
  }

  // Get recently completed lessons for quiz material
  const completed = curriculum.lessons.filter((l) => l.status === 'completed');
  if (completed.length < 2 && !specificConcepts) {
    await channel.sendMessage(chatId, "You need at least a couple lessons under your belt before a quiz. Keep going!");
    return;
  }

  log.info({ topic: topicSlug, completed_count: completed.length }, 'generating quiz');
  const recent = completed.slice(-5); // last 5 completed lessons
  const quizTarget = specificConcepts || recent.map((l) => l.title).join(', ');

  await channel.sendTyping(chatId);
  if (!specificConcepts) {
    await channel.sendMessage(chatId, "🧠 <b>Pop quiz!</b> Don't panic — let's see what stuck.\n");
  }

  const { system, model, outputMode } = buildQuizPrompt(skills, topicSlug, recent);
  const response = await generate(system, [
    { role: 'user', content: `Generate a review quiz for: ${quizTarget}` },
  ], { model, outputMode });

  // Parse JSON from response
  try {
    const jsonMatch = response.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found');
    const questions = JSON.parse(jsonMatch[0]);

    log.info({ topic: topicSlug, question_count: questions.length }, 'quiz generated');
    for (const q of questions) {
      await channel.sendPoll(chatId, q.question, q.options, {
        correctOptionId: q.correct,
        explanation: q.explanation,
      });
      await sleep(1500);
    }
  } catch (err) {
    log.warn({ err, topic: topicSlug }, 'quiz JSON parse failed');
    await channel.sendMessage(chatId, 'I couldn\'t build that quiz cleanly. Please try /quiz again.');
  }
}
