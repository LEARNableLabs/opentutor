/**
 * Curriculum generation — two-phase approach:
 *   Phase A: instant scaffold (3-5 lessons) so student can start immediately
 *   Phase B: research pipeline → Claude synthesizes full 20-30 lesson curriculum
 *
 * Writes curriculum.json, teaching-notes.md, concept-map.md to domains/<slug>/.
 * Registers the topic in progress.json.
 */

import fs from 'fs';
import path from 'path';
import { generate } from './claude.js';
import { buildScaffoldPrompt, buildResearchSynthesisPrompt } from './context.js';
import { PATHS } from './config.js';
import { updateProgress, writeCurriculum, appendMemory } from './state.js';
import { researchTopic, formatResearchContext } from './research.js';

/**
 * Phase A — generate a lightweight scaffold and register the topic.
 * Returns immediately so the student can start lesson 1.
 * @param {string} topic - Human-readable topic name
 * @param {Map} skills - Loaded skill files
 * @param {string} [level] - Student level override
 * @returns {string} topic slug
 */
export async function generateAndRegisterTopic(topic, skills, level) {
  const slug = slugify(topic);
  const domainDir = path.join(PATHS.domains, slug);

  // Already exists — just register
  if (fs.existsSync(path.join(domainDir, 'curriculum.json'))) {
    registerTopic(slug);
    return slug;
  }

  const studentLevel = level || detectLevel() || 'intermediate';

  // Phase A: instant scaffold
  const { system } = buildScaffoldPrompt(skills, topic, studentLevel);
  const response = await generate(system, [
    { role: 'user', content: `Generate a starter curriculum scaffold for: "${topic}"` },
  ], { model: 'strong' });

  const parsed = parseGeneratedDomain(response.text, topic, slug);

  // Write scaffold files
  fs.mkdirSync(domainDir, { recursive: true });
  writeCurriculum(slug, parsed.curriculum);
  if (parsed.teachingNotes) {
    fs.writeFileSync(path.join(domainDir, 'teaching-notes.md'), parsed.teachingNotes);
  }
  if (parsed.conceptMap) {
    fs.writeFileSync(path.join(domainDir, 'concept-map.md'), parsed.conceptMap);
  }

  registerTopic(slug);
  appendMemory(`Topic registered: ${topic} (${slug}) — scaffold with ${parsed.curriculum.lessons?.length || 0} starter lessons`);

  // Kick off Phase B in the background (non-blocking)
  enrichCurriculum(topic, slug, studentLevel, skills).catch((err) => {
    console.error(`  enrich: background research failed for ${slug}:`, err.message);
  });

  return slug;
}

/**
 * Phase B — research + synthesize full curriculum.
 * Runs in the background after Phase A returns.
 */
async function enrichCurriculum(topic, slug, studentLevel, skills) {
  console.log(`  enrich: starting research for "${topic}"`);
  const domainDir = path.join(PATHS.domains, slug);

  // Step 1: Run research pipeline (parallel API queries)
  const research = await researchTopic(topic, { level: studentLevel });
  const researchContext = formatResearchContext(research);

  if (!researchContext.trim()) {
    console.log('  enrich: no research results, keeping scaffold');
    return;
  }

  // Save raw research for reference
  fs.writeFileSync(path.join(domainDir, 'research.md'), [
    `# Research: ${topic}`,
    `Generated: ${new Date().toISOString().split('T')[0]}`,
    '',
    researchContext,
  ].join('\n'));

  // Step 2: Claude synthesizes research into full curriculum
  const { system } = buildResearchSynthesisPrompt(skills, topic, studentLevel, researchContext);
  const response = await generate(system, [
    { role: 'user', content: `Using the research results, generate a complete 20-30 lesson curriculum for: "${topic}"` },
  ], { model: 'strong', webSearch: true, webSearchMaxUses: 5 });

  const parsed = parseGeneratedDomain(response.text, topic, slug);

  // Preserve completion status from scaffold
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

  // Overwrite with enriched curriculum
  writeCurriculum(slug, parsed.curriculum);
  if (parsed.teachingNotes) {
    fs.writeFileSync(path.join(domainDir, 'teaching-notes.md'), parsed.teachingNotes);
  }
  if (parsed.conceptMap) {
    fs.writeFileSync(path.join(domainDir, 'concept-map.md'), parsed.conceptMap);
  }

  const lessonCount = parsed.curriculum.lessons?.length || 0;
  console.log(`  enrich: curriculum enriched — ${lessonCount} lessons for "${topic}"`);
  appendMemory(`Curriculum enriched: ${topic} — ${lessonCount} lessons from research (arxiv: ${research.arxiv.length}, openalex: ${research.openAlex.length})`);
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
