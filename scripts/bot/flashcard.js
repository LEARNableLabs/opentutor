/**
 * Flashcard-style micro-reviews — 10-second concept pings.
 * Generates quick recall questions driven by spaced repetition schedule.
 * Formats: multiple choice (buttons), true/false, fill-in-the-blank.
 */

import { generate } from './claude.js';
import { buildFlashcardPrompt } from './context.js';
import { getDueReviews, recordReview } from './spaced-repetition.js';
import { appendMemory } from './state.js';

/**
 * Deliver flashcard reviews for due concepts.
 * @param {number} chatId
 * @param {object} channel
 * @param {Map} skills
 * @param {number} [limit=1] - Number of cards to send
 */
export async function deliverFlashcards(chatId, channel, skills, limit = 1) {
  const due = getDueReviews(null, limit);
  if (!due.length) {
    await channel.sendMessage(chatId, "Nothing due for review right now. Keep learning! 🎯");
    return;
  }

  for (const review of due) {
    await channel.sendTyping(chatId);

    const { system } = buildFlashcardPrompt(skills, review);
    const response = await generate(system, [
      { role: 'user', content: `Generate a flashcard for: "${review.concept}" (rep ${review.reps + 1}, streak ${review.streak})` },
    ], { model: 'cheap' });

    const card = parseFlashcard(response.text, review);

    if (card.type === 'poll') {
      await channel.sendPoll(chatId, card.question, card.options, {
        correctOptionId: card.correctIndex,
        explanation: card.explanation,
      });
    } else {
      // Button-based card
      await channel.sendMessage(chatId, card.question, {
        buttons: card.buttons,
      });
    }

    appendMemory(`Flashcard sent: ${review.concept} (${review.topic}) — rep ${review.reps + 1}`);
  }
}

/**
 * Handle flashcard button callback.
 * @param {string} data - callback_data (e.g., "fc_concept-name_A_correct")
 * @param {number} chatId
 * @param {object} channel
 * @param {number} messageId
 */
export async function handleFlashcardCallback(data, chatId, channel, messageId) {
  // Parse: fc_{topic}_{concept}_{answer}_{correct?}
  const parts = data.split('_');
  const topic = parts[1];
  const concept = parts[2]?.replace(/-/g, ' ');
  const isCorrect = data.includes('_correct');

  // Remove buttons
  try {
    await channel.editMessageButtons(chatId, messageId, []);
  } catch { /* old message */ }

  if (isCorrect) {
    recordReview(topic, concept, 'easy');
    await channel.sendMessage(chatId, "✅ Got it! Moving on.");
  } else {
    recordReview(topic, concept, 'wrong');
    await channel.sendMessage(chatId, "❌ Not quite — we'll revisit this one soon.");
  }
}

// ── Parse flashcard from Claude's response ─────────────────

function parseFlashcard(text, review) {
  // Try to detect poll format (JSON with question/options/correct)
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      if (data.question && data.options) {
        return {
          type: 'poll',
          question: `🔁 ${data.question}`,
          options: data.options,
          correctIndex: data.correct ?? data.correct_index ?? 0,
          explanation: data.explanation || '',
        };
      }
    }
  } catch {
    // Not JSON — use as button card
  }

  // Fallback: button-based multiple choice
  const conceptSlug = review.concept.toLowerCase().replace(/\s+/g, '-').slice(0, 30);
  const topicSlug = review.topic;

  // Extract question (first line or up to ?)
  const questionMatch = text.match(/(?:🔁\s*)?(.+?\?)/s);
  const question = questionMatch ? `🔁 ${questionMatch[1].trim()}` : `🔁 ${text.slice(0, 200).trim()}`;

  return {
    type: 'buttons',
    question,
    buttons: [
      [
        { text: '✅ Got it', callback_data: `fc_${topicSlug}_${conceptSlug}_correct` },
        { text: '❌ Forgot', callback_data: `fc_${topicSlug}_${conceptSlug}_wrong` },
      ],
    ],
  };
}
