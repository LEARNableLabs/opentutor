/**
 * Lesson scheduler — node-cron with timezone support.
 */

import cron from 'node-cron';
import { readProgress } from './state.js';
import { deliverNextLesson } from './lesson.js';
import { generateQuiz } from './quiz.js';
import { getDueReviews } from './spaced-repetition.js';
import { SCHEDULE } from './config.js';

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
            console.log(`  scheduler: review at ${time} (${due.length} concepts due)`);
            const concepts = due.map((r) => r.concept).join(', ');
            await channel.sendMessage(chatId, `🔄 <b>Evening review</b> — ${due.length} concept${due.length > 1 ? 's' : ''} to revisit\n`);
            await generateQuiz(due[0].topic, chatId, channel, skills, concepts);
            return;
          }
        }

        // Regular slot → deliver next lesson
        console.log(`  scheduler: delivering lesson at ${time}`);
        const topic = progress.active_topics[0];
        await deliverNextLesson(topic, chatId, channel, skills);
      } catch (err) {
        console.error('  scheduler: delivery error:', err.message);
      }
    }, { timezone: tz });

    jobs.push(job);
  }

  console.log(`  scheduler: ${jobs.length} jobs (${times.join(', ')} ${tz})`);
}

export function stopScheduler() {
  for (const job of jobs) job.stop();
  jobs = [];
}
