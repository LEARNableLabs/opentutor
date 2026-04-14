/**
 * Curriculum generation — ask Claude to build a full domain for a topic.
 * Writes curriculum.json, teaching-notes.md, concept-map.md to domains/<slug>/.
 * Registers the topic in progress.json.
 */

import fs from 'fs';
import path from 'path';
import { generate } from './claude.js';
import { buildCurriculumPrompt } from './context.js';
import { PATHS } from './config.js';
import { readProgress, updateProgress, writeCurriculum } from './state.js';

/**
 * Generate a full domain for a topic and register it in progress.
 * @param {string} topic - Human-readable topic name
 * @param {Map} skills - Loaded skill files
 * @param {string} [level] - Student level override (otherwise read from USER.md)
 * @returns {string} topic slug
 */
export async function generateAndRegisterTopic(topic, skills, level) {
  const slug = slugify(topic);

  // Check if domain already exists
  const domainDir = path.join(PATHS.domains, slug);
  if (fs.existsSync(path.join(domainDir, 'curriculum.json'))) {
    // Already generated — just ensure it's in active_topics
    registerTopic(slug);
    return slug;
  }

  // Determine student level
  const studentLevel = level || detectLevel() || 'intermediate';

  // Generate curriculum via Claude
  const { system } = buildCurriculumPrompt(skills, topic, studentLevel);
  const response = await generate(system, [
    { role: 'user', content: `Generate a complete curriculum for: "${topic}"` },
  ], { model: 'strong' });

  // Parse the JSON response
  const parsed = parseGeneratedDomain(response.text, topic, slug);

  // Write domain files
  fs.mkdirSync(domainDir, { recursive: true });

  writeCurriculum(slug, parsed.curriculum);

  if (parsed.teachingNotes) {
    fs.writeFileSync(path.join(domainDir, 'teaching-notes.md'), parsed.teachingNotes);
  }
  if (parsed.conceptMap) {
    fs.writeFileSync(path.join(domainDir, 'concept-map.md'), parsed.conceptMap);
  }

  // Register in progress.json
  registerTopic(slug);

  return slug;
}

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

function parseGeneratedDomain(text, topic, slug) {
  // Try to parse as JSON object with curriculum, teachingNotes, conceptMap keys
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);

      // Handle both nested and flat structures
      const curriculum = data.curriculum || data;
      if (!curriculum.topic) curriculum.topic = topic;
      if (!curriculum.slug) curriculum.slug = slug;
      if (!curriculum.created) curriculum.created = new Date().toISOString().split('T')[0];

      // Ensure all lessons have status: "pending"
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
    // JSON parse failed — try to extract pieces
  }

  // Fallback: try to find a JSON array of lessons
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
