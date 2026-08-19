#!/usr/bin/env node
/**
 * OpenTutor Gateway — self-contained Telegram bot
 * Usage: npm run bot
 */

import { TELEGRAM } from './config.js';
import { TelegramChannel } from './channels/telegram.js';
import { route } from './router.js';
import { readProgress } from './state.js';
import { startScheduler, stopScheduler } from './scheduler.js';
import { loadSkillFiles } from './context.js';
import { logger } from './logger.js';

logger.info('OpenTutor Gateway starting');

// ── Load skill files ────────────────────────────────────────

const skills = loadSkillFiles();
logger.info({ count: skills.size }, 'skills loaded');

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
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
