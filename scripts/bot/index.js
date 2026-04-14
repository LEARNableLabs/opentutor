#!/usr/bin/env node
/**
 * OpenTutor Gateway — self-contained Telegram bot
 * Usage: npm run bot
 */

import { TELEGRAM, PATHS } from './config.js';
import { TelegramChannel } from './channels/telegram.js';
import { route } from './router.js';
import { readProgress } from './state.js';
import { startScheduler, stopScheduler } from './scheduler.js';
import { loadSkillFiles } from './context.js';

console.log('\n  OpenTutor Gateway\n');

// ── Load skill files ────────────────────────────────────────

const skills = loadSkillFiles();
console.log(`  skills: ${skills.size} files loaded`);

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
console.log('  commands: registered');

// ── Start scheduler ─────────────────────────────────────────

const progress = readProgress();
if (progress.schedule && !progress.schedule.paused) {
  startScheduler(progress.schedule, telegram, skills);
}

// ── Start polling ───────────────────────────────────────────

await telegram.start();
console.log('  status: running\n');

// ── Graceful shutdown ───────────────────────────────────────

function shutdown(signal) {
  console.log(`\n  ${signal} received, shutting down...`);
  telegram.stop();
  stopScheduler();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
