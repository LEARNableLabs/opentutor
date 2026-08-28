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
import { buildQuickStartPrompt, buildResearchSynthesisPrompt } from './context.js';
import { PATHS } from './config.js';
import { updateProgress, writeCurriculum, appendMemory } from './state.js';
import { researchTopic, formatResearchContext } from './research.js';
import { searchWikipediaSummary } from './research.js';
import { log } from './logger.js';

/**
 * Phase A — quick start: research + taster + preliminary curriculum (~10-30s).
 * Returns taster message and roadmap immediately. Writes a 5-lesson quick
 * curriculum so /next works right away. Kicks off full enrichment in background.
 */
export async function generateAndRegisterTopic(topic, skills, chatId, channel, level) {
  const slug = slugify(topic);
  const domainDir = path.join(PATHS.domains, slug);

  // Already exists — just register
  const existingCurriculum = readExistingCurriculum(slug);
  if (existingCurriculum?.lessons?.length) {
    registerTopic(slug);
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
  enrichCurriculum(topic, slug, studentLevel, skills, chatId, channel).catch((err) => {
    log.error({ err, topic, slug }, 'enrich: background enrichment failed');
  });

  return { slug, intro };
}

/**
 * Phase B — full research + synthesize 20-30 lesson curriculum.
 * Runs in the background after Phase A returns.
 * Preserves completion status from the quick curriculum.
 * Notifies the student when the full curriculum replaces the preliminary one.
 */
async function enrichCurriculum(topic, slug, studentLevel, skills, chatId, channel) {
  log.info({ topic, slug }, 'enrich: starting full curriculum generation');
  const domainDir = path.join(PATHS.domains, slug);

  // Research is already saved from Phase A, but re-read it
  let researchContext = '';
  try {
    researchContext = fs.readFileSync(path.join(domainDir, 'research.md'), 'utf-8');
  } catch {
    // Re-run research if file missing
    const research = await researchTopic(topic, { level: studentLevel });
    researchContext = formatResearchContext(research);
    if (researchContext.trim()) {
      fs.writeFileSync(path.join(domainDir, 'research.md'), [
        `# Research: ${topic}`,
        `Generated: ${new Date().toISOString().split('T')[0]}`,
        '',
        researchContext,
      ].join('\n'));
    }
  }

  // Claude synthesizes research into full curriculum
  const { system, model, outputMode } = buildResearchSynthesisPrompt(skills, topic, studentLevel, researchContext || 'No external research available.');
  const response = await generate(system, [
    { role: 'user', content: `Using the research results, generate a complete 20-30 lesson curriculum for: "${topic}"` },
  ], { model, outputMode, webSearch: true, webSearchMaxUses: 5 });

  const parsed = parseGeneratedDomain(response.text, topic, slug);

  // Preserve completion status from preliminary curriculum
  const existing = readExistingCurriculum(slug);
  if (existing?.lessons) {
    for (const lesson of parsed.curriculum.lessons) {
      const match = existing.lessons.find((l) => l.day === lesson.day);
      if (match?.status === 'completed') {
        lesson.status = 'completed';
        lesson.delivered = match.delivered;
        lesson.engagement = match.engagement;
      }
    }
  }

  // Remove the preliminary flag
  parsed.curriculum.preliminary = false;

  // Write full curriculum (overwrites quick curriculum)
  writeCurriculum(slug, parsed.curriculum);
  if (parsed.teachingNotes) {
    fs.writeFileSync(path.join(domainDir, 'teaching-notes.md'), parsed.teachingNotes);
  }
  if (parsed.conceptMap) {
    fs.writeFileSync(path.join(domainDir, 'concept-map.md'), parsed.conceptMap);
  }

  const lessonCount = parsed.curriculum.lessons?.length || 0;
  const moduleCount = new Set(parsed.curriculum.lessons?.map((l) => l.module)).size;
  log.info({ topic, lesson_count: lessonCount, module_count: moduleCount }, 'enrich: full curriculum ready');
  appendMemory(`Full curriculum ready: ${topic} — ${lessonCount} lessons, ${moduleCount} modules (replaced preliminary)`);

  // Notify student that full curriculum is ready
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
      log.error({ err, topic }, 'enrich: notification failed');
    }
  }
}

/**
 * Manually trigger enrichment for an existing topic.
 */
export async function enrichExistingTopic(slug, skills) {
  const curriculum = readExistingCurriculum(slug);
  if (!curriculum) throw new Error(`No curriculum found for ${slug}`);
  const level = detectLevel() || 'intermediate';
  await enrichCurriculum(curriculum.topic || slug, slug, level, skills);
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
