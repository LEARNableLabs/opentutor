/**
 * Socratic lesson endpoint — stateful multi-turn conversation.
 *
 * POST { topicSlug }          → starts lesson, returns first question
 * POST { topicSlug, answer }  → continues lesson, returns next step
 *
 * Active lesson state stored in KV (SQLite or Supabase).
 */

import { getState, getAdapter, getSkills } from './_lib/init.js';
import { buildLessonPlanPrompt, buildSocraticResponsePrompt } from '../lib/core/prompts.js';
import { buildStudentModel, formatStudentModel } from '../lib/core/student-model.js';

const STEPS = ['retrieval', 'diagnostic', 'followUp', 'application'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const state = await getState();
    const adapter = getAdapter();
    const skills = getSkills();
    const { topicSlug, answer } = req.body;

    if (!topicSlug) return res.status(400).json({ error: 'topicSlug required' });

    const kvKey = `web_lesson:${topicSlug}`;

    // ── Continue active lesson ────────────────────────────────
    if (answer !== undefined && answer !== null) {
      const activeRaw = readKV(state, kvKey);
      if (!activeRaw) {
        return res.status(400).json({ error: 'No active lesson. Start one without an answer field.' });
      }

      const active = JSON.parse(activeRaw);
      const stepName = STEPS[active.step];
      if (!stepName) {
        deleteKV(state, kvKey);
        return res.status(200).json({ done: true, message: 'Lesson already complete.' });
      }

      active.history.push({ role: 'user', content: answer });

      const user = readUserSafe(state);
      const responsePrompt = buildSocraticResponsePrompt(active.plan, answer, stepName, user);
      const response = await adapter.generate(
        responsePrompt.system + '\n\nReturn only polished text.',
        active.history,
        { model: responsePrompt.model },
      );

      active.history.push({ role: 'assistant', content: response.text });
      active.step++;

      const done = active.step >= STEPS.length;

      if (done) {
        const day = active.lessonDay;
        markCompleteSafe(state, active.topicSlug, day);
        deleteKV(state, kvKey);
      } else {
        writeKV(state, kvKey, JSON.stringify(active));
      }

      return res.status(200).json({
        reply: response.text,
        step: active.step,
        totalSteps: STEPS.length,
        done,
        lesson: active.lesson,
      });
    }

    // ── Start new lesson ──────────────────────────────────────
    const lesson = getNextLessonSafe(state, topicSlug);
    if (!lesson) {
      return res.status(200).json({ done: true, message: 'All lessons completed!' });
    }

    const lessonDay = lesson.day || lesson.lesson;
    const learningMd = state.readDomainFile(topicSlug, 'learning.md') || '';
    const curriculum = readCurriculumSafe(state, topicSlug);
    const user = readUserSafe(state);
    const studentModel = buildStudentModel(learningMd, curriculum, user);
    const modelText = formatStudentModel(studentModel);

    const planPrompt = buildLessonPlanPrompt(state, skills, lesson, topicSlug, modelText);
    const planResponse = await adapter.generate(
      planPrompt.system + '\n\nReturn exactly one valid JSON value.',
      [{ role: 'user', content: `Plan a Socratic lesson for Day ${lessonDay}: "${lesson.title}"` }],
      { model: 'strong' },
    );

    let plan;
    try {
      plan = JSON.parse(planResponse.text.match(/\{[\s\S]*\}/)[0]);
    } catch {
      plan = {
        diagnostic: `What do you already know about ${(lesson.concepts || []).join(' and ')}?`,
        goal: lesson.title,
        followUp: 'Can you give an example?',
        application: 'How would you apply this?',
        commonMisconceptions: [],
      };
    }

    const active = {
      topicSlug,
      lessonDay,
      lesson: { day: lessonDay, title: lesson.title, module: lesson.module, concepts: lesson.concepts },
      plan,
      step: 0,
      history: [],
    };

    writeKV(state, kvKey, JSON.stringify(active));

    const firstMessage = plan.retrieval || plan.diagnostic;
    const goalPrefix = plan.goal ? `**Goal:** ${plan.goal}\n\n` : '';

    return res.status(200).json({
      reply: goalPrefix + firstMessage,
      step: 0,
      totalSteps: STEPS.length,
      done: false,
      lesson: active.lesson,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── Helpers (handle both sync TutorStore and async SupabaseStore) ──

function readKV(state, key) {
  if (state.db) {
    const row = state.db.prepare('SELECT value FROM kv WHERE key = ?').get(key);
    return row?.value || null;
  }
  return null;
}

function writeKV(state, key, value) {
  if (state.db) {
    state.db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)').run(key, value);
  }
}

function deleteKV(state, key) {
  if (state.db) {
    state.db.prepare('DELETE FROM kv WHERE key = ?').run(key);
  }
}

function readUserSafe(state) {
  try { return state.readUser(); } catch { return ''; }
}

function readCurriculumSafe(state, slug) {
  try { return state.readCurriculum(slug); } catch { return null; }
}

function getNextLessonSafe(state, slug) {
  try { return state.getNextLesson(slug); } catch { return null; }
}

function markCompleteSafe(state, slug, day) {
  try { state.markLessonComplete(slug, day, 'delivered'); } catch {}
}
