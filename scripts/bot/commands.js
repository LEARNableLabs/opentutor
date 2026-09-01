/**
 * Slash command handlers.
 */

import { readProgress, updateProgress, getTopicProgress, listTopics, readDomainFile, readCurriculum } from './state.js';
import { deliverNextLesson, computeStreak } from './lesson.js';
import { generateQuiz } from './quiz.js';
import { startScheduler, stopScheduler } from './scheduler.js';
import { generateAndRegisterTopic } from './curriculum.js';
import { getDueReviews, getRepetitionSummary } from './spaced-repetition.js';
import { buildStudentModel } from '../../lib/core/student-model.js';
import { log } from './logger.js';

export function isCommand(text) {
  return text.startsWith('/');
}

const handlers = {
  '/next': cmdNext,
  '/quiz': cmdQuiz,
  '/review': cmdReview,
  '/progress': cmdProgress,
  '/pause': cmdPause,
  '/resume': cmdResume,
  '/topics': cmdTopics,
  '/add': cmdAdd,
  '/switch': cmdSwitch,
  '/help': cmdHelp,
  '/start': cmdStart,
};

export async function handleCommand(text, chatId, channel, skills) {
  const [cmd, ...args] = text.split(' ');
  const command = cmd.toLowerCase();
  log.info({ command, user_id: chatId }, 'command received');
  const handler = handlers[command];
  if (handler) {
    return handler(chatId, channel, skills, args.join(' '));
  }
  // Unknown command — treat as chat
  await channel.sendMessage(chatId, "I don't know that command. Type /help to see what I can do.");
}

async function cmdNext(chatId, channel, skills, args) {
  const progress = readProgress();
  if (!progress.active_topics?.length) {
    await channel.sendMessage(chatId, "You don't have any active topics yet. Type /add to start learning something!");
    return;
  }
  const topic = resolveTopic(args, progress.active_topics);
  if (!topic) {
    await channel.sendMessage(chatId, 'Topic not found — try /topics to see your list');
    return;
  }

  // Session resume: check learning.md for continuity
  const resumeNote = buildResumeNote(topic);
  if (resumeNote) {
    await channel.sendMessage(chatId, resumeNote);
  }

  await deliverNextLesson(topic, chatId, channel, skills);
}

async function cmdQuiz(chatId, channel, skills, args) {
  const progress = readProgress();
  if (!progress.active_topics?.length) {
    await channel.sendMessage(chatId, "Nothing to quiz on yet — start a topic first with /add");
    return;
  }
  const topic = resolveTopic(args, progress.active_topics);
  if (!topic) {
    await channel.sendMessage(chatId, 'Topic not found — try /topics to see your list');
    return;
  }
  await generateQuiz(topic, chatId, channel, skills);
}

async function cmdReview(chatId, channel, skills, args) {
  const progress = readProgress();
  const topic = args ? resolveTopic(args, progress.active_topics || []) : null;
  if (args && !topic) {
    await channel.sendMessage(chatId, 'Topic not found — try /topics to see your list');
    return;
  }
  const due = getDueReviews(topic, 3);
  if (!due.length) {
    await channel.sendMessage(chatId, "Nothing due for review right now. Keep learning!");
    return;
  }

  await channel.sendTyping(chatId);
  await channel.sendMessage(chatId, `🔄 <b>Spaced review</b> — ${due.length} concept${due.length > 1 ? 's' : ''} due\n`);

  // Generate a quick quiz on the due concepts
  const concepts = due.map((r) => r.concept).join(', ');
  await generateQuiz(due[0].topic, chatId, channel, skills, concepts);
}

async function cmdProgress(chatId, channel) {
  const progress = readProgress();
  const activeTopics = progress.active_topics || [];
  if (!activeTopics.length) {
    await channel.sendMessage(chatId, "No topics yet. Type /add to start learning!");
    return;
  }

  const streak = computeStreak(progress);
  let text = `📊 <b>Your Progress</b>\n\n🔥 <b>Streak: ${streak} day${streak !== 1 ? 's' : ''}</b>\n`;

  for (const slug of activeTopics) {
    const p = getTopicProgress(slug);
    if (!p) continue;

    const bar = progressBar(p.percent);
    const learningMd = readDomainFile(slug, 'learning.md') || '';
    const curriculum = readCurriculum(slug);
    const model = buildStudentModel(learningMd, curriculum, '');
    const sr = getRepetitionSummary(slug);
    const accuracy = Math.round(model.recentAccuracy * 100);

    text += `\n<b>${p.topic}</b> — Day ${p.completed}/${p.total}\n`;
    text += `${bar} ${p.percent}%\n`;
    text += `📈 Accuracy: ${accuracy}% (last 5)\n`;

    if (sr.total > 0) {
      text += `🧠 ${sr.mastered} mastered`;
      if (sr.due > 0) text += ` · ⚠️ ${sr.due} review due`;
      text += '\n';
    }

    if (p.current) {
      const nextTitle = p.current.title?.slice(0, 50) || 'next lesson';
      text += `Next: <i>${nextTitle}</i>\n`;
    }
  }

  await channel.sendMessage(chatId, text);
}

function computeStreak(progress) {
  const history = progress.history || [];
  if (!history.length) return 0;

  const uniqueDays = [...new Set(history.map((h) => h.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Streak must include today or yesterday
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 0;
  let expected = new Date(uniqueDays[0]);

  for (const day of uniqueDays) {
    const d = new Date(day);
    const diff = Math.round((expected - d) / 86400000);
    if (diff > 1) break;
    streak++;
    expected = d;
  }

  return streak;
}

async function cmdPause(chatId, channel, _skills) {
  updateProgress((p) => {
    p.schedule = p.schedule || {};
    p.schedule.paused = true;
  });
  stopScheduler();
  await channel.sendMessage(chatId, '⏸ Lessons paused. Type /resume when you\'re ready.');
}

async function cmdResume(chatId, channel, _skills) {
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
  if (!topic) {
    await channel.sendMessage(chatId, 'What do you want to learn? Tell me a topic or say "not sure" and I\'ll suggest some ideas.');
    return;
  }

  await channel.sendTyping(chatId);

  try {
    const { intro } = await generateAndRegisterTopic(topic, skills, chatId, channel);

    // Send the mini-wiki intro
    if (intro) {
      await channel.sendMessage(chatId, intro);
      await channel.sendMessage(chatId, '🔬 Researching and building your full curriculum now — I\'ll let you know when it\'s ready.');
    }
  } catch (err) {
    log.error({ err, topic, command: '/add' }, 'curriculum generation error');
    await channel.sendMessage(chatId, "Something went wrong. Try again or pick a different topic.");
  }
}

async function cmdSwitch(chatId, channel, _skills, args) {
  const progress = readProgress();
  if (!progress.active_topics?.length) {
    await channel.sendMessage(chatId, "No topics to switch between. Type /add to start learning!");
    return;
  }
  const topic = resolveTopic(args, progress.active_topics);
  if (!topic) {
    await channel.sendMessage(chatId, 'Topic not found — try /topics to see your list');
    return;
  }
  updateProgress((p) => {
    const idx = p.active_topics.indexOf(topic);
    if (idx > 0) {
      p.active_topics.splice(idx, 1);
      p.active_topics.unshift(topic);
    }
  });
  await channel.sendMessage(chatId, `Switched to ${topic} as your default topic.`);
}

async function cmdHelp(chatId, channel) {
  await channel.sendMessage(chatId, [
    '📖 <b>Commands</b>\n',
    '/next — Get the next lesson now',
    '/quiz — Quick review quiz',
    '/review — Spaced repetition review',
    '/progress — See your progress',
    '/topics — List your active topics',
    '/add — Start a new topic',
    '/switch — Switch your default topic',
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

// ── Session resume ─────────────────────────────────────────

function buildResumeNote(topicSlug) {
  const learningMd = readDomainFile(topicSlug, 'learning.md');
  if (!learningMd) return null;

  const dateMatch = learningMd.match(/\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})/);
  if (!dateMatch) return null;

  const lastDate = dateMatch[1];
  const today = new Date().toISOString().split('T')[0];
  if (lastDate === today) return null;

  const lastLessonMatch = learningMd.match(/\*\*Last lesson:\*\*\s*Day \d+ — (.+)/);
  const nextLessonMatch = learningMd.match(/\*\*Next lesson:\*\*\s*Day \d+ — (.+)/);
  const lastTitle = lastLessonMatch?.[1] || 'your last lesson';
  const nextTitle = nextLessonMatch?.[1];

  let note = `Welcome back! Last time we covered <b>${lastTitle}</b>.`;
  if (nextTitle) note += ` Today we'll tackle <b>${nextTitle}</b>.`;
  return note;
}

// ── Helpers ─────────────────────────────────────────────────

function resolveTopic(args, activeTopics) {
  if (!args) return activeTopics[0];
  const lower = args.toLowerCase();
  const exact = activeTopics.find(t => t === lower);
  if (exact) return exact;
  const partial = activeTopics.find(t => t.startsWith(lower));
  if (partial) return partial;
  return null;
}

function progressBar(percent, width = 20) {
  const filled = Math.round((percent / 100) * width);
  return '▓'.repeat(filled) + '░'.repeat(width - filled);
}
