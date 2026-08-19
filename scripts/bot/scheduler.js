/**
 * Lesson scheduler — node-cron with timezone support.
 */

import cron from 'node-cron';
import { readProgress } from './state.js';
import { deliverNextLesson } from './lesson.js';
import { deliverFlashcards } from './flashcard.js';
import { getDueReviews } from './spaced-repetition.js';
import { SCHEDULE } from './config.js';
import { logger } from './logger.js';

let jobs = [];

export function startScheduler(schedule, channel, skills) {
  stopScheduler();

  const times = schedule?.times || SCHEDULE.times;
  const tz = schedule?.timezone || SCHEDULE.timezone;

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const isLastSlot = i === times.length - 1;
    const [hour, minute] = time.split(':');
    const expr = `${minute} ${hour} * * *`;

    const job = cron.schedule(expr, async () => {
      const progress = readProgress();

      // Skip if paused
      if (progress.schedule?.paused) return;

      // Skip if no active topics
      if (!progress.active_topics?.length) return;

      const chatId = Number(process.env.TELEGRAM_CHAT_ID);
      if (!chatId) return;

      try {
        // Last slot of the day → spaced repetition review (if anything is due)
        if (isLastSlot) {
          const due = getDueReviews(null, 3);
          if (due.length > 0) {
            logger.info({ time, due_count: due.length }, 'scheduler: flashcard review');
            await deliverFlashcards(chatId, channel, skills, Math.min(due.length, 3));
            return;
          }
        }

        // Regular slot → deliver next lesson
        const topic = progress.active_topics[0];
        logger.info({ time, topic }, 'scheduler: delivering lesson');
        await deliverNextLesson(topic, chatId, channel, skills);
      } catch (err) {
        logger.error({ err, time }, 'scheduler: delivery error');
      }
    }, { timezone: tz });

    jobs.push(job);
  }

  logger.info({ job_count: jobs.length, times, timezone: tz }, 'scheduler started');
}

export function stopScheduler() {
  for (const job of jobs) job.stop();
  jobs = [];
}
