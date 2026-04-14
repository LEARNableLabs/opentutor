/**
 * Lesson scheduler — node-cron with timezone support.
 */

import cron from 'node-cron';
import { readProgress } from './state.js';
import { deliverNextLesson } from './lesson.js';
import { SCHEDULE } from './config.js';

let jobs = [];

export function startScheduler(schedule, channel, skills) {
  stopScheduler();

  const times = schedule?.times || SCHEDULE.times;
  const tz = schedule?.timezone || SCHEDULE.timezone;

  for (const time of times) {
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

      console.log(`  scheduler: delivering lesson at ${time}`);

      try {
        // Pick topic that needs attention (for now, first active topic)
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
