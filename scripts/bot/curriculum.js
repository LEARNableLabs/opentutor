/**
 * Curriculum generation — quick-start + background enrichment:
 *   Phase A (~10-30s): Wikipedia + parallel research → taster lesson + roadmap + 5-lesson quick curriculum
 *   Phase B (background): full research → Claude synthesizes 20-30 lesson curriculum, preserving completed lessons
 *
 * See docs/curriculum-generation.md for the full workflow.
 */

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { generate } from './claude.js';
import { buildQuickStartPrompt } from './context.js';
import { PATHS } from './config.js';
import { updateProgress, writeCurriculum, writeDomainFile, readDomainFile, appendMemory } from './state.js';
import { researchTopic, formatResearchContext } from './research.js';
import { searchWikipediaSummary } from './research.js';
import { CurriculumPipeline } from '../../lib/core/pipeline.js';
import { createPipelineAdapterFromEnv } from '../../lib/adapters/index.js';
import { TutorState } from '../../lib/core/state.js';
import { log } from './logger.js';

const coreState = new TutorState(PATHS.root);

/**
 * Phase A — quick start: research + taster + preliminary curriculum (~10-30s).
 * Returns taster message and roadmap immediately. Writes a 5-lesson quick
 * curriculum so /next works right away. Kicks off full enrichment in background.
 */
export async function generateAndRegisterTopic(topic, skills, chatId, channel, level) {
  const slug = slugify(topic);
  const domainDir = path.join(PATHS.domains, slug);

  // Already exists — register and check for stale research
  const existingCurriculum = readExistingCurriculum(slug);
  if (existingCurriculum?.lessons?.length) {
    registerTopic(slug);

    refreshResearchIfStale(slug, topic).catch((err) => {
      log.error({ err, slug }, 'research refresh failed');
    });

    return { slug, intro: null };
  }

  const studentLevel = level || detectLevel() || 'intermediate';
  fs.mkdirSync(domainDir, { recursive: true });

  // Run Wikipedia + research APIs in parallel (~5s)
  const [wikiSummary, research] = await Promise.all([
    searchWikipediaSummary(topic).catch(() => null),
    researchTopic(topic, { level: studentLevel }).catch(() => ({
      arxiv: [], semanticScholar: [], wikipedia: null, openAlex: [],
    })),
  ]);

  const researchContext = formatResearchContext(research);

  // Save research for Phase B
  if (researchContext.trim()) {
    fs.writeFileSync(path.join(domainDir, 'research.md'), [
      `# Research: ${topic}`,
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      '',
      researchContext,
    ].join('\n'));
  }

  // Claude generates taster + roadmap + quick 5-lesson curriculum (~10-20s)
  const { system, model, outputMode } = buildQuickStartPrompt(skills, topic, studentLevel, wikiSummary, researchContext || null);
  const response = await generate(system, [
    { role: 'user', content: `Give me a quick start for "${topic}".` },
  ], { model, outputMode });

  let taster = '';
  let roadmap = '';
  let quickLessons = [];

  try {
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      taster = data.taster || '';
      roadmap = data.roadmap || '';
      quickLessons = data.quickCurriculum || [];
    }
  } catch {
    taster = 'I found the topic, but the first learning plan came back scrambled. Try /add again and I’ll rebuild it.';
  }

  if (!quickLessons.length) {
    throw new Error('Quick curriculum contained no lessons');
  }

  // Write quick curriculum so /next works immediately
  if (quickLessons.length > 0) {
    const quickCurriculum = {
      topic,
      slug,
      created: new Date().toISOString().split('T')[0],
      student_level: studentLevel,
      preliminary: true,
      lessons: quickLessons.map((l, i) => ({
        day: l.day || i + 1,
        module: l.module || 'Getting Started',
        title: l.title || `Lesson ${i + 1}`,
        concepts: l.concepts || [],
        resources: l.resources || [],
        status: l.status || 'pending',
      })),
    };
    writeCurriculum(slug, quickCurriculum);
    log.info({ topic, lessons: quickLessons.length }, 'quick curriculum written');
  }

  registerTopic(slug);
  appendMemory(`Topic registered: ${topic} (${slug}) — taster sent, quick curriculum (${quickLessons.length} lessons) available, full curriculum building in background`);

  // Build intro message: taster + roadmap
  const intro = [taster, roadmap].filter(Boolean).join('\n\n');

  // Kick off Phase B in the background (non-blocking)
  buildCurriculumPipeline(topic, slug, studentLevel, skills, chatId, channel).catch((err) => {
    log.error({ err, topic, slug }, 'pipeline: background build failed');
  });

  return { slug, intro };
}

/**
 * Phase B — delegates to lib/core CurriculumPipeline.
 * Runs in the background after Phase A returns.
 * Handles Telegram-specific concerns (notifications) around the core pipeline.
 */
async function buildCurriculumPipeline(topic, slug, studentLevel, skills, chatId, channel) {
  log.info({ topic, slug }, 'pipeline: starting');

  // Ensure research exists
  let researchContext = readDomainFile(slug, 'research.md') || '';
  if (!researchContext.trim()) {
    const research = await researchTopic(topic, { level: studentLevel });
    researchContext = formatResearchContext(research);
    if (researchContext.trim()) {
      writeDomainFile(slug, 'research.md', [
        `# Research: ${topic}`,
        `Generated: ${new Date().toISOString().split('T')[0]}`,
        '',
        researchContext,
      ].join('\n'));
    }
  }

  // Preserve existing completion status before pipeline overwrites
  const existing = readExistingCurriculum(slug);

  // Delegate to core pipeline
  const adapter = createPipelineAdapterFromEnv();
  const pipeline = new CurriculumPipeline({
    adapter,
    state: coreState,
    skills,
    onProgress: (p) => log.info({ ...p }, 'pipeline: progress'),
  });

  const result = await pipeline.run(topic, slug, studentLevel, researchContext);

  // Preserve completion status from quick curriculum
  if (existing?.lessons) {
    const curriculum = coreState.readCurriculum(slug);
    if (curriculum?.lessons) {
      for (const lesson of curriculum.lessons) {
        const dayKey = lesson.day || lesson.lesson;
        const match = existing.lessons.find((l) => (l.day || l.lesson) === dayKey);
        if (match?.status === 'completed') {
          lesson.status = 'completed';
          lesson.delivered = match.delivered;
          lesson.engagement = match.engagement;
        }
      }
      coreState.writeCurriculum(slug, curriculum);
    }
  }

  const lessonCount = result.curriculum.lessons?.length || 0;
  const moduleCount = new Set(result.curriculum.lessons?.map((l) => l.module)).size;
  log.info({ topic, lesson_count: lessonCount, module_count: moduleCount, iterations: result.iterations, approved: result.approved }, 'pipeline: complete');
  appendMemory(`Full curriculum ready: ${topic} — ${lessonCount} lessons, ${moduleCount} modules (${result.iterations} iterations, ${result.approved ? 'approved' : 'max iterations'})`);

  // Telegram-specific: notify student
  if (chatId && channel) {
    try {
      await channel.sendMessage(chatId, [
        `📚 <b>Your full curriculum is ready!</b>`,
        '',
        `<b>${topic}</b> — ${lessonCount} lessons across ${moduleCount} modules.`,
        existing?.preliminary ? 'Upgraded from your starter lessons — your progress is preserved.' : '',
        '',
        `Type /next to continue learning.`,
      ].filter(Boolean).join('\n'));
    } catch (err) {
      log.error({ err, topic }, 'pipeline: notification failed');
    }
  }
}

/**
 * Background research refresh for existing topics.
 * Compares saved research.md date against a freshness threshold.
 * If stale, re-runs research APIs and flags curriculum for review.
 */
async function refreshResearchIfStale(slug, topic) {
  const existing = readDomainFile(slug, 'research.md');
  if (!existing) return;

  const dateMatch = existing.match(/Generated:\s*(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    const generatedDate = new Date(dateMatch[1]);
    const daysSince = (Date.now() - generatedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 30) {
      log.debug({ slug, daysSince: Math.round(daysSince) }, 'research still fresh, skipping refresh');
      return;
    }
  }

  log.info({ slug, topic }, 'research stale, refreshing');
  const research = await researchTopic(topic);
  const newContext = formatResearchContext(research);

  if (!newContext.trim()) {
    log.info({ slug }, 'refresh returned no results, keeping existing');
    return;
  }

  // Simple staleness check: compare lengths as a proxy for new material
  const oldLen = existing.length;
  const newLen = newContext.length;
  const delta = Math.abs(newLen - oldLen) / Math.max(oldLen, 1);

  if (delta < 0.1) {
    log.info({ slug, delta: delta.toFixed(2) }, 'research refresh: no meaningful change');
    return;
  }

  writeDomainFile(slug, 'research.md', [
    `# Research: ${topic}`,
    `Generated: ${new Date().toISOString().split('T')[0]}`,
    `Refreshed from: ${dateMatch?.[1] || 'unknown'}`,
    '',
    newContext,
  ].join('\n'));

  log.info({ slug, delta: delta.toFixed(2) }, 'research refreshed, curriculum may need review');
  appendMemory(`Research refreshed for ${topic} — ${Math.round(delta * 100)}% content change`);
}

/**
 * Manually trigger pipeline for an existing topic.
 */
export async function enrichExistingTopic(slug, skills) {
  const curriculum = readExistingCurriculum(slug);
  if (!curriculum) throw new Error(`No curriculum found for ${slug}`);
  const level = detectLevel() || 'intermediate';
  await buildCurriculumPipeline(curriculum.topic || slug, slug, level, skills, null, null);
}

// ── Helpers ────────────────────────────────────────────────

function registerTopic(slug) {
  updateProgress((p) => {
    if (!p.active_topics) p.active_topics = [];
    if (!p.active_topics.includes(slug)) {
      p.active_topics.push(slug);
    }
  });
}

function detectLevel() {
  try {
    const user = fs.readFileSync(PATHS.user, 'utf-8');
    const match = user.match(/level[:\s]*(\w[\w\s-]*)/i);
    return match ? match[1].trim().toLowerCase() : null;
  } catch {
    return null;
  }
}

function readExistingCurriculum(slug) {
  const p = path.join(PATHS.domains, slug, 'curriculum.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

export function parseGeneratedDomain(text, topic, slug) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);

      const curriculum = data.curriculum || data;
      if (!curriculum.topic) curriculum.topic = topic;
      if (!curriculum.slug) curriculum.slug = slug;
      if (!curriculum.created) curriculum.created = new Date().toISOString().split('T')[0];

      if (curriculum.lessons) {
        for (const lesson of curriculum.lessons) {
          if (!lesson.status) lesson.status = 'pending';
        }
      }

      if (!Array.isArray(curriculum.lessons) || curriculum.lessons.length === 0) {
        throw new Error('Generated curriculum contained no lessons');
      }

      return {
        curriculum,
        teachingNotes: data.teachingNotes || data.teaching_notes || null,
        conceptMap: data.conceptMap || data.concept_map || null,
      };
    }
  } catch {
    // JSON parse failed
  }

  try {
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      const lessons = JSON.parse(arrayMatch[0]);
      if (!Array.isArray(lessons) || lessons.length === 0) {
        throw new Error('Generated curriculum contained no lessons');
      }
      return {
        curriculum: {
          topic,
          slug,
          created: new Date().toISOString().split('T')[0],
          lessons: lessons.map((l) => ({ ...l, status: l.status || 'pending' })),
        },
        teachingNotes: null,
        conceptMap: null,
      };
    }
  } catch {
    // Array parse also failed
  }

  throw new Error('Could not parse curriculum from Claude response');
}

export function slugify(text) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
    .replace(/-$/g, '');
  if (slug) return slug;
  const hash = createHash('sha256').update(String(text)).digest('hex').slice(0, 12);
  return `topic-${hash}`;
}
