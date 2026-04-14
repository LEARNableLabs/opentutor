/**
 * Curriculum generation — two-phase approach:
 *   Phase A: mini-wiki intro + suggested resource (instant)
 *   Phase B: research pipeline → Claude synthesizes full 20-30 lesson curriculum
 *
 * See docs/curriculum-generation.md for the full workflow.
 */

import fs from 'fs';
import path from 'path';
import { generate } from './claude.js';
import { buildIntroPrompt, buildResearchSynthesisPrompt } from './context.js';
import { PATHS } from './config.js';
import { updateProgress, writeCurriculum, appendMemory } from './state.js';
import { researchTopic, formatResearchContext } from './research.js';
import { searchWikipediaSummary } from './research.js';

/**
 * Phase A — send mini-wiki intro + kick off background research.
 * Returns the slug and intro text. Does NOT create curriculum.json yet.
 * @param {string} topic - Human-readable topic name
 * @param {Map} skills - Loaded skill files
 * @param {number} chatId - Telegram chat ID for Phase B notification
 * @param {object} channel - Telegram channel for sending notification
 * @param {string} [level] - Student level override
 * @returns {{ slug: string, intro: string }}
 */
export async function generateAndRegisterTopic(topic, skills, chatId, channel, level) {
  const slug = slugify(topic);
  const domainDir = path.join(PATHS.domains, slug);

  // Already exists — just register
  if (fs.existsSync(path.join(domainDir, 'curriculum.json'))) {
    registerTopic(slug);
    return { slug, intro: null };
  }

  const studentLevel = level || detectLevel() || 'intermediate';

  // Quick Wikipedia lookup for grounding
  const wikiSummary = await searchWikipediaSummary(topic).catch(() => null);

  // Phase A: Claude generates mini-wiki intro + resource suggestion
  const { system } = buildIntroPrompt(skills, topic, studentLevel, wikiSummary);
  const response = await generate(system, [
    { role: 'user', content: `Introduce me to "${topic}" and suggest something to watch/read right now.` },
  ], { model: 'strong' });

  // Create domain dir but no curriculum.json yet — Phase B will create it
  fs.mkdirSync(domainDir, { recursive: true });
  registerTopic(slug);
  appendMemory(`Topic registered: ${topic} (${slug}) — intro sent, curriculum building in background`);

  // Kick off Phase B in the background (non-blocking)
  enrichCurriculum(topic, slug, studentLevel, skills, chatId, channel).catch((err) => {
    console.error(`  enrich: background research failed for ${slug}:`, err.message);
  });

  return { slug, intro: response.text };
}

/**
 * Phase B — research + synthesize full curriculum.
 * Runs in the background after Phase A returns.
 * Notifies the student when the curriculum is ready.
 */
async function enrichCurriculum(topic, slug, studentLevel, skills, chatId, channel) {
  console.log(`  enrich: starting research for "${topic}"`);
  const domainDir = path.join(PATHS.domains, slug);

  // Step 1: Run research pipeline (parallel API queries)
  const research = await researchTopic(topic, { level: studentLevel });
  const researchContext = formatResearchContext(research);

  if (!researchContext.trim()) {
    console.log('  enrich: no research results, generating from knowledge only');
  }

  // Save raw research for reference
  if (researchContext.trim()) {
    fs.writeFileSync(path.join(domainDir, 'research.md'), [
      `# Research: ${topic}`,
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      '',
      researchContext,
    ].join('\n'));
  }

  // Step 2: Claude synthesizes research into full curriculum
  const { system } = buildResearchSynthesisPrompt(skills, topic, studentLevel, researchContext || 'No external research available — generate from your knowledge.');
  const response = await generate(system, [
    { role: 'user', content: `Using the research results, generate a complete 20-30 lesson curriculum for: "${topic}"` },
  ], { model: 'strong', webSearch: true, webSearchMaxUses: 5 });

  const parsed = parseGeneratedDomain(response.text, topic, slug);

  // Preserve completion status if curriculum already existed
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

  // Write full curriculum
  writeCurriculum(slug, parsed.curriculum);
  if (parsed.teachingNotes) {
    fs.writeFileSync(path.join(domainDir, 'teaching-notes.md'), parsed.teachingNotes);
  }
  if (parsed.conceptMap) {
    fs.writeFileSync(path.join(domainDir, 'concept-map.md'), parsed.conceptMap);
  }

  const lessonCount = parsed.curriculum.lessons?.length || 0;
  const moduleCount = new Set(parsed.curriculum.lessons?.map((l) => l.module)).size;
  console.log(`  enrich: curriculum ready — ${lessonCount} lessons for "${topic}"`);
  appendMemory(`Curriculum ready: ${topic} — ${lessonCount} lessons, ${moduleCount} modules (arxiv: ${research.arxiv.length}, openalex: ${research.openAlex.length})`);

  // Notify student
  if (chatId && channel) {
    try {
      await channel.sendMessage(chatId, [
        `📚 <b>Your curriculum is ready!</b>`,
        '',
        `<b>${topic}</b> — ${lessonCount} lessons across ${moduleCount} modules.`,
        research.arxiv.length > 0 ? `Based on ${research.arxiv.length} papers and academic sources.` : '',
        '',
        `Type /next for your first lesson.`,
      ].filter(Boolean).join('\n'));
    } catch (err) {
      console.error('  enrich: notification failed:', err.message);
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

function parseGeneratedDomain(text, topic, slug) {
  // Try to parse as JSON object with curriculum, teachingNotes, conceptMap keys
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

      return {
        curriculum,
        teachingNotes: data.teachingNotes || data.teaching_notes || null,
        conceptMap: data.conceptMap || data.concept_map || null,
      };
    }
  } catch {
    // JSON parse failed
  }

  // Fallback: bare JSON array of lessons
  try {
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      const lessons = JSON.parse(arrayMatch[0]);
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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
