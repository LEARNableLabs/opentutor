#!/usr/bin/env node
/**
 * OpenTutor Gateway — self-contained Telegram bot
 * Usage: npm run bot
 */

import { TELEGRAM, PATHS } from './config.js';
import { TelegramChannel } from './channels/telegram.js';
import { route } from './router.js';
import { readProgress, listTopics, readCurriculum } from './state.js';
import { startScheduler, stopScheduler } from './scheduler.js';
import { loadSkillFiles } from './context.js';
import { pruneOldSessions } from './session.js';
import { TutorStore } from '../../lib/core/store.js';
import { logger } from './logger.js';

logger.info('OpenTutor Gateway starting');

// ── Load skill files ────────────────────────────────────────

const skills = loadSkillFiles();
logger.info({ count: skills.size }, 'skills loaded');

// ── Initialize SQLite store ─────────────────────────────────

let store;
try {
  store = new TutorStore(PATHS.root);
  logger.info('sqlite store initialized');
} catch (err) {
  logger.warn({ err }, 'sqlite store unavailable, running without durable job queue');
}

// ── Prune old session files ────────────────────────────────

pruneOldSessions();

// ── Resume pending pipeline jobs ────────────────────────────

if (store) {
  const pendingJobs = store.getPendingJobs();
  if (pendingJobs.length) {
    logger.info({ count: pendingJobs.length }, 'resuming pending pipeline jobs');
    for (const job of pendingJobs) {
      if (job.type === 'pipeline') {
        store.startJob(job.id);
        import('./curriculum.js').then(({ enrichExistingTopic }) => {
          enrichExistingTopic(job.payload.slug, skills)
            .then(() => {
              store.completeJob(job.id);
              logger.info({ job_id: job.id, slug: job.payload.slug }, 'pipeline job completed');
            })
            .catch((err) => {
              store.failJob(job.id, err);
              logger.error({ err, job_id: job.id }, 'pipeline job failed');
            });
        });
      }
    }
  }

  // Scan for preliminary curricula without a pending job
  const allTopics = listTopics();
  for (const slug of allTopics) {
    const c = readCurriculum(slug);
    if (c?.preliminary) {
      const hasJob = pendingJobs.some((j) => j.payload?.slug === slug);
      if (!hasJob) {
        logger.info({ slug }, 'found preliminary curriculum without job, enqueueing');
        store.enqueueJob('pipeline', { topic: c.topic || slug, slug, level: c.student_level || 'intermediate' });
      }
    }
  }
}

// ── Set up Telegram channel ─────────────────────────────────

const telegram = new TelegramChannel({
  token: TELEGRAM.token,
  chatId: TELEGRAM.chatId,
  mode: TELEGRAM.mode,
  onUpdate: (update) => route(update, telegram, skills),
});

// Register slash commands
await telegram.registerCommands([
  { command: 'next', description: 'Get the next lesson now' },
  { command: 'quiz', description: 'Quick review quiz on recent material' },
  { command: 'review', description: 'Spaced repetition review of past concepts' },
  { command: 'progress', description: 'See your learning progress' },
  { command: 'pause', description: 'Pause daily lessons' },
  { command: 'resume', description: 'Resume daily lessons' },
  { command: 'topics', description: 'List your active topics' },
  { command: 'add', description: 'Add a new topic to learn' },
  { command: 'switch', description: 'Switch your default topic' },
  { command: 'help', description: 'Show available commands' },
]);
logger.info('commands registered');

// ── Start scheduler ─────────────────────────────────────────

const progress = readProgress();
if (progress.schedule && !progress.schedule.paused) {
  startScheduler(progress.schedule, telegram, skills);
}

// ── Start polling ───────────────────────────────────────────

await telegram.start();
logger.info('status: running');

// ── Graceful shutdown ───────────────────────────────────────

function shutdown(signal) {
  logger.info({ signal }, 'shutting down');
  telegram.stop();
  stopScheduler();
  if (store) store.close();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export { store };
