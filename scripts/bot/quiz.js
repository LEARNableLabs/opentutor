/**
 * Quiz generation — create and send review quizzes via Telegram polls.
 */

import { generate } from './claude.js';
import { buildQuizPrompt } from './context.js';
import { readCurriculum, rememberReviewCard } from './state.js';
import { sleep } from './helpers.js';
import { log } from './logger.js';

/** @param {Array<{topic: string, concept: string}>} [dueReviews] - quiz these instead of recent lessons */
export async function generateQuiz(topicSlug, chatId, channel, skills, dueReviews) {
  const curriculum = readCurriculum(topicSlug);
  if (!curriculum) {
    await channel.sendMessage(chatId, "Can't find that curriculum. Try /topics to see what's available.");
    return;
  }

  // Get recently completed lessons for quiz material
  const completed = curriculum.lessons.filter((l) => l.status === 'completed');
  if (completed.length < 2 && !dueReviews) {
    await channel.sendMessage(chatId, "You need at least a couple lessons under your belt before a quiz. Keep going!");
    return;
  }

  log.info({ topic: topicSlug, completed_count: completed.length }, 'generating quiz');
  const recent = completed.slice(-5); // last 5 completed lessons
  const quizTarget = dueReviews ? dueReviews.map((r) => r.concept).join(', ') : recent.map((l) => l.title).join(', ');
  // The concepts a question may test, each with its own topic: a review can span topics.
  const concepts = dueReviews || [...new Set(recent.flatMap((l) => l.concepts || []))].map((concept) => ({ topic: topicSlug, concept }));

  await channel.sendTyping(chatId);
  if (!dueReviews) {
    await channel.sendMessage(chatId, "🧠 <b>Pop quiz!</b> Don't panic — let's see what stuck.\n");
  }

  const { system, model, outputMode } = buildQuizPrompt(skills, topicSlug, recent, concepts.map(({ topic, concept }) => ({ topic, concept })));
  const response = await generate(system, [
    { role: 'user', content: `Generate a review quiz for: ${quizTarget}` },
  ], { model, outputMode });

  // Parse JSON from response
  try {
    const jsonMatch = response.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found');
    const questions = JSON.parse(jsonMatch[0]);

    log.info({ topic: topicSlug, question_count: questions.length }, 'quiz generated');
    const graded = new Set();
    for (const q of questions) {
      const sent = await channel.sendPoll(chatId, q.question, q.options, {
        correctOptionId: q.correct,
        explanation: q.explanation,
      });
      // The answer reaches spaced review through the topic and concept the question names (#294): two
      // topics can share a concept name. Once per quiz, on a question with a right answer: three
      // questions on one concept are one review, not three steps out in its schedule.
      const tested = concepts.find((c) => c.topic === String(q.topic ?? '').trim()
        && c.concept.toLowerCase() === String(q.concept ?? '').trim().toLowerCase());
      if (sent?.poll?.id && tested && Number.isInteger(q.correct) && !graded.has(tested)) {
        graded.add(tested);
        rememberReviewCard(sent.poll.id, { chatId, topic: tested.topic, concept: tested.concept, correctIndex: q.correct });
      }
      await sleep(1500);
    }
  } catch (err) {
    log.warn({ err, topic: topicSlug }, 'quiz JSON parse failed');
    await channel.sendMessage(chatId, 'I couldn\'t build that quiz cleanly. Please try /quiz again.');
  }
}
