/**
 * Flashcard-style micro-reviews — 10-second concept pings.
 * Generates quick recall questions driven by spaced repetition schedule.
 * Formats: multiple choice (buttons), true/false, fill-in-the-blank.
 */

import { randomBytes } from 'node:crypto';
import { generate } from './claude.js';
import { buildFlashcardPrompt } from './context.js';
import { parseFirstJson } from '../../lib/core/json.js';
import { getDueReviews, recordReview } from './spaced-repetition.js';
import { appendMemory, rememberReviewCard, findReviewCard } from './state.js';
import { log } from './logger.js';

/**
 * Deliver flashcard reviews for due concepts.
 * @param {number} chatId
 * @param {object} channel
 * @param {Map} skills
 * @param {number} [limit=1] - Number of cards to send
 */
export async function deliverFlashcards(chatId, channel, skills, limit = 1) {
  const due = getDueReviews(null, limit);
  log.info({ due_count: due.length, limit }, 'flashcard delivery');
  if (!due.length) {
    await channel.sendMessage(chatId, "Nothing due for review right now. Keep learning! 🎯");
    return;
  }

  for (const review of due) {
    await channel.sendTyping(chatId);

    const { system, model, outputMode } = buildFlashcardPrompt(skills, review);
    const response = await generate(system, [
      { role: 'user', content: `Generate a flashcard for: "${review.concept}" (rep ${review.reps + 1}, streak ${review.streak})` },
    ], { model, outputMode });

    const card = parseFlashcard(response.text);
    const reviewed = { topic: review.topic, concept: review.concept };

    if (card.type === 'poll') {
      const sent = await channel.sendPoll(chatId, card.question, card.options, {
        correctOptionId: card.correctIndex,
        explanation: card.explanation,
      });
      if (sent?.poll?.id) rememberReviewCard(sent.poll.id, { chatId, ...reviewed, correctIndex: card.correctIndex });
    } else {
      // Button-based card
      rememberReviewCard(card.id, reviewed);
      await channel.sendMessage(chatId, card.question, {
        buttons: card.buttons,
      });
    }

    appendMemory(`Flashcard sent: ${review.concept} (${review.topic}) — rep ${review.reps + 1}`);
  }
}

/**
 * Handle flashcard button callback.
 * @param {string} data - callback_data (e.g., "fc::1a2b3c4d::correct")
 * @param {number} chatId
 * @param {object} channel
 * @param {number} messageId
 */
export async function handleFlashcardCallback(data, chatId, channel, messageId) {
  const [, id, verdict] = data.match(/^fc::([a-f0-9]{8})::(correct|wrong)$/) || [];
  const card = id ? findReviewCard(id) : null;
  log.info({ topic: card?.topic, concept: card?.concept, is_correct: verdict === 'correct' }, 'flashcard callback');

  // Remove buttons
  try {
    await channel.editMessageButtons(chatId, messageId, []);
  } catch { /* old message */ }

  // A button from before ids (#294), one already answered, or one older than the cards state keeps
  // has nothing to grade.
  if (!card) {
    await channel.sendMessage(chatId, 'That card has expired. Type /review for what is due now.');
    return;
  }
  if (verdict === 'correct') {
    recordReview(card.topic, card.concept, 'easy', card.id);
    await channel.sendMessage(chatId, "✅ Got it! Moving on.");
  } else {
    recordReview(card.topic, card.concept, 'wrong', card.id);
    await channel.sendMessage(chatId, "❌ Not quite — we'll revisit this one soon.");
  }
}

// ── Parse flashcard from Claude's response ─────────────────

function parseFlashcard(text) {
  // Try to detect poll format (JSON with question/options/correct)
  try {
    const data = parseFirstJson(text);
    if (data) {
      if (data.question && data.options) {
        // A right answer that is not one of the options (missing, null, out of range) makes a plain
        // poll (#294): neither a quiz Telegram refuses nor one graded on a made-up option 0.
        const correct = data.correct ?? data.correct_index;
        return {
          type: 'poll',
          question: `🔁 ${data.question}`,
          options: data.options,
          correctIndex: Number.isInteger(correct) && data.options[correct] !== undefined ? correct : undefined,
          explanation: data.explanation || '',
        };
      }
    }
  } catch {
    // Not JSON — use as button card
  }

  // Fallback: button-based multiple choice. The buttons carry a short id that state maps to the
  // whole concept (#294): a slug of it was cut to 30 characters, and with a long topic slug the
  // callback data still overran Telegram's 64 bytes.
  const id = randomBytes(4).toString('hex');

  // Extract question (first line or up to ?)
  const questionMatch = text.match(/(?:🔁\s*)?(.+?\?)/s);
  const question = questionMatch ? `🔁 ${questionMatch[1].trim()}` : `🔁 ${text.slice(0, 200).trim()}`;

  return {
    type: 'buttons',
    id,
    question,
    buttons: [
      [
        { text: '✅ Got it', callback_data: `fc::${id}::correct` },
        { text: '❌ Forgot', callback_data: `fc::${id}::wrong` },
      ],
    ],
  };
}
