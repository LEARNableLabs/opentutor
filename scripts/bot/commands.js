/**
 * Slash command handlers.
 */

import { readProgress, updateProgress, getTopicProgress, listTopics } from './state.js';
import { deliverNextLesson } from './lesson.js';
import { generateQuiz } from './quiz.js';
import { startScheduler, stopScheduler } from './scheduler.js';

export function isCommand(text) {
  return text.startsWith('/');
}

const handlers = {
  '/next': cmdNext,
  '/quiz': cmdQuiz,
  '/progress': cmdProgress,
  '/pause': cmdPause,
  '/resume': cmdResume,
  '/topics': cmdTopics,
  '/add': cmdAdd,
  '/help': cmdHelp,
  '/start': cmdStart,
};

export async function handleCommand(text, chatId, channel, skills) {
  const [cmd, ...args] = text.split(' ');
  const handler = handlers[cmd.toLowerCase()];
  if (handler) {
    return handler(chatId, channel, skills, args.join(' '));
  }
  // Unknown command — treat as chat
  await channel.sendMessage(chatId, "I don't know that command. Type /help to see what I can do.");
}

async function cmdNext(chatId, channel, skills) {
  const progress = readProgress();
  if (!progress.active_topics?.length) {
    await channel.sendMessage(chatId, "You don't have any active topics yet. Type /add to start learning something!");
    return;
  }
  // Deliver next lesson for first active topic
  await deliverNextLesson(progress.active_topics[0], chatId, channel, skills);
}

async function cmdQuiz(chatId, channel, skills) {
  const progress = readProgress();
  if (!progress.active_topics?.length) {
    await channel.sendMessage(chatId, "Nothing to quiz on yet — start a topic first with /add");
    return;
  }
  await generateQuiz(progress.active_topics[0], chatId, channel, skills);
}

async function cmdProgress(chatId, channel) {
  const topics = listTopics();
  if (!topics.length) {
    await channel.sendMessage(chatId, "No topics yet. Type /add to start learning!");
    return;
  }

  let text = '📊 <b>Your Progress</b>\n';
  for (const slug of topics) {
    const p = getTopicProgress(slug);
    if (!p) continue;
    const bar = progressBar(p.percent);
    text += `\n<b>${p.topic}</b> — Day ${p.completed + 1}/${p.total}\n${bar} ${p.percent}%\n`;
    if (p.current) text += `Next: <i>${p.current.title}</i>\n`;
  }

  await channel.sendMessage(chatId, text);
}

async function cmdPause(chatId, channel, skills) {
  updateProgress((p) => {
    p.schedule = p.schedule || {};
    p.schedule.paused = true;
  });
  stopScheduler();
  await channel.sendMessage(chatId, '⏸ Lessons paused. Type /resume when you\'re ready.');
}

async function cmdResume(chatId, channel, skills) {
  const progress = updateProgress((p) => {
    p.schedule = p.schedule || {};
    p.schedule.paused = false;
  });
  startScheduler(progress.schedule, channel, skills);
  await channel.sendMessage(chatId, '▶️ Lessons resumed! See you at the next scheduled time.');
}

async function cmdTopics(chatId, channel) {
  const topics = listTopics();
  if (!topics.length) {
    await channel.sendMessage(chatId, "No topics yet. Type /add to start learning!");
    return;
  }

  let text = '📚 <b>Your Topics</b>\n';
  for (const slug of topics) {
    const p = getTopicProgress(slug);
    if (!p) continue;
    text += `\n• <b>${p.topic}</b> — ${p.percent}% (${p.completed}/${p.total} lessons)`;
  }
  await channel.sendMessage(chatId, text);
}

async function cmdAdd(chatId, channel, skills, topic) {
  if (topic) {
    await channel.sendMessage(chatId, `Let me build a curriculum for <b>${topic}</b>. Give me a minute...`);
    // TODO: trigger curriculum generation flow
  } else {
    await channel.sendMessage(chatId, 'What do you want to learn? Tell me a topic or say "not sure" and I\'ll suggest some ideas.');
  }
}

async function cmdHelp(chatId, channel) {
  await channel.sendMessage(chatId, [
    '📖 <b>Commands</b>\n',
    '/next — Get the next lesson now',
    '/quiz — Quick review quiz',
    '/progress — See your progress',
    '/topics — List your active topics',
    '/add — Start a new topic',
    '/pause — Pause daily lessons',
    '/resume — Resume daily lessons',
    '/help — This message',
    '\nOr just chat with me naturally — I understand "next lesson", "quiz me", "I\'m stuck on X", etc.',
  ].join('\n'));
}

async function cmdStart(chatId, channel, skills) {
  // Check if onboarding needed
  const progress = readProgress();
  if (!progress.active_topics?.length) {
    // Import dynamically to avoid circular dependency
    const { startOnboarding } = await import('./onboarding.js');
    return startOnboarding(chatId, channel, skills);
  }
  await channel.sendMessage(chatId, 'Welcome back! Type /next for your next lesson or /help to see commands.');
}

// ── Helpers ─────────────────────────────────────────────────

function progressBar(percent, width = 20) {
  const filled = Math.round((percent / 100) * width);
  return '▓'.repeat(filled) + '░'.repeat(width - filled);
}
