/**
 * Telegram webhook endpoint for Vercel deployment.
 * Receives updates from Telegram, routes through Socratic lesson system.
 *
 * Setup:
 *   curl "https://api.telegram.org/bot$TOKEN/setWebhook?url=https://your-app.vercel.app/api/telegram&secret_token=$SECRET"
 */

import { getState, getAdapter, getSkills } from './_lib/init.js';
import { buildSocraticResponsePrompt, buildLessonPlanPrompt } from '../lib/core/prompts.js';
import { buildStudentModel, formatStudentModel } from '../lib/core/student-model.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

const STEPS = ['retrieval', 'diagnostic', 'followUp', 'application'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  if (WEBHOOK_SECRET) {
    const token = req.headers['x-telegram-bot-api-secret-token'];
    if (token !== WEBHOOK_SECRET) return res.status(403).end();
  }

  res.status(200).json({ ok: true });

  try {
    const update = req.body;
    const message = update?.message;
    if (!message?.text) return;

    const chatId = message.chat.id;
    const text = message.text.trim();

    const state = await getState();
    const adapter = getAdapter();
    const skills = getSkills();

    if (text === '/next' || text === '/start') {
      await startLesson(chatId, state, adapter, skills);
    } else if (text === '/help') {
      await send(chatId, '<b>Commands</b>\n/next — Next lesson\n/start — Begin\n/help — This message\n\nOr just type naturally.');
    } else {
      const kvKey = `tg_lesson:${chatId}`;
      const activeRaw = await state.readKV(kvKey);
      if (activeRaw) {
        await continueLesson(chatId, text, state, adapter);
      } else {
        const response = await adapter.generate(
          'You are a warm, sharp study buddy. Be concise. 1-3 sentences. Telegram HTML.\n\nReturn only polished text.',
          [{ role: 'user', content: text }],
          { model: 'cheap' },
        );
        await send(chatId, response.text);
      }
    }
  } catch (err) {
    console.error('[telegram webhook]', err);
  }
}

async function startLesson(chatId, state, adapter, skills) {
  const progress = await state.readProgress();
  const topicSlug = progress.active_topics?.[0];
  if (!topicSlug) {
    return send(chatId, 'No active topics. Send a topic name to start learning.');
  }

  const lesson = await state.getNextLesson(topicSlug);
  if (!lesson) {
    return send(chatId, 'All lessons complete! Send a new topic to keep learning.');
  }

  const lessonDay = lesson.day || lesson.lesson;
  const learningMd = (await state.readDomainFile(topicSlug, 'learning.md')) || '';
  const curriculum = await state.readCurriculum(topicSlug);
  const user = await state.readUser();
  const studentModel = buildStudentModel(learningMd, curriculum, user);

  const planPrompt = buildLessonPlanPrompt(state, skills, lesson, topicSlug, formatStudentModel(studentModel));
  const planResponse = await adapter.generate(
    planPrompt.system + '\n\nReturn exactly one valid JSON value.',
    [{ role: 'user', content: `Plan a Socratic lesson for Day ${lessonDay}: "${lesson.title}"` }],
    { model: 'strong' },
  );

  let plan;
  try {
    plan = JSON.parse(planResponse.text.match(/\{[\s\S]*\}/)[0]);
  } catch {
    plan = { diagnostic: `What do you know about ${(lesson.concepts || []).join(' and ')}?`, goal: lesson.title };
  }

  await state.writeKV(`tg_lesson:${chatId}`, JSON.stringify({
    topicSlug, lessonDay,
    lesson: { day: lessonDay, title: lesson.title, module: lesson.module, concepts: lesson.concepts },
    plan, step: 0, history: [],
  }));

  const first = plan.retrieval || plan.diagnostic;
  const goal = plan.goal ? `<b>Goal:</b> ${plan.goal}\n\n` : '';
  await send(chatId, goal + first);
}

async function continueLesson(chatId, answer, state, adapter) {
  const kvKey = `tg_lesson:${chatId}`;
  const raw = await state.readKV(kvKey);
  if (!raw) return;
  const active = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const stepName = STEPS[active.step];
  if (!stepName) { await state.deleteKV(kvKey); return; }

  active.history.push({ role: 'user', content: answer });
  const user = await state.readUser();
  const prompt = buildSocraticResponsePrompt(active.plan, answer, stepName, user);
  const response = await adapter.generate(
    prompt.system + '\n\nReturn only polished text. Telegram HTML.',
    active.history,
    { model: prompt.model },
  );

  const reply = response.text.replace(/<assessment>[\s\S]*?<\/assessment>\s*/g, '').trim();
  active.history.push({ role: 'assistant', content: reply });
  active.step++;

  if (active.step >= STEPS.length) {
    await state.markLessonComplete(active.topicSlug, active.lessonDay, 'delivered');
    await state.deleteKV(kvKey);
    await send(chatId, reply + '\n\nType /next for the next lesson.');
  } else {
    await state.writeKV(kvKey, JSON.stringify(active));
    await send(chatId, reply);
  }
}

async function send(chatId, text) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}
