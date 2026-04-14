/**
 * Skill file loader and system prompt builder.
 * Loads all skill/reference files at startup, builds task-specific prompts.
 */

import fs from 'fs';
import path from 'path';
import { PATHS } from './config.js';
import { readUser, readProgress, readRecentMemory, readDomainFile } from './state.js';

// ── Load skill files at startup ─────────────────────────────

export function loadSkillFiles() {
  const files = new Map();
  const load = (key, filePath) => {
    try {
      files.set(key, fs.readFileSync(filePath, 'utf-8'));
    } catch {
      // optional file, skip
    }
  };

  load('skill', PATHS.skill);
  load('lesson-delivery', path.join(PATHS.references, 'lesson-delivery.md'));
  load('teaching-method', path.join(PATHS.references, 'teaching-method.md'));
  load('onboarding', path.join(PATHS.references, 'onboarding.md'));
  load('curriculum-format', path.join(PATHS.references, 'curriculum-format.md'));
  load('source-verification', path.join(PATHS.references, 'source-verification.md'));
  load('domain-template', path.join(PATHS.templates, 'domain-template.md'));
  load('identity', PATHS.identity);
  load('soul', PATHS.soul);
  load('tg-soul', PATHS.tgSoul);

  return files;
}

// ── User context (fresh each call) ──────────────────────────

function buildUserContext() {
  const user = readUser();
  const progress = readProgress();
  const memory = readRecentMemory(2);

  let ctx = '';
  if (user) ctx += `## Student Profile\n\n${user}\n\n`;
  if (progress.active_topics?.length) {
    ctx += `## Active Topics: ${progress.active_topics.join(', ')}\n\n`;
  }
  if (memory) ctx += `## Recent Memory\n\n${memory}\n\n`;
  return ctx;
}

// ── Task-specific prompt builders ───────────────────────────

export function buildLessonPrompt(skills, lesson, topicSlug) {
  const teachingNotes = readDomainFile(topicSlug, 'teaching-notes.md') || '';
  const conceptMap = readDomainFile(topicSlug, 'concept-map.md') || '';

  const system = [
    skills.get('skill'),
    skills.get('lesson-delivery'),
    skills.get('teaching-method'),
    skills.get('tg-soul'),
    skills.get('source-verification'),
    teachingNotes ? `## Teaching Notes for ${topicSlug}\n\n${teachingNotes}` : '',
    conceptMap ? `## Concept Map\n\n${conceptMap}` : '',
    buildUserContext(),
    `## Current Lesson\n\nDeliver lesson Day ${lesson.day}: "${lesson.title}"\nModule: ${lesson.module}\nConcepts: ${lesson.concepts.join(', ')}\nResources to reference: ${lesson.resources.join(', ')}\n\nFollow the message chunking rules: split by emoji anchors (📖🧠💡✏️), one anchor per message, ~150 words per message. The LAST message must be an exercise with inline button options (provide 4 choices labeled A-D). After the options, add a line: "correct: X" where X is the correct letter (A, B, C, or D). End with engagement, never "that's it for today."`,
  ].filter(Boolean).join('\n\n---\n\n');

  return { system, model: 'strong' };
}

export function buildOnboardingPrompt(skills) {
  const system = [
    skills.get('skill'),
    skills.get('onboarding'),
    skills.get('tg-soul'),
    buildUserContext(),
    `## Onboarding Instructions\n\nYou are onboarding a new student. Ask ONE question at a time and wait for their response. Be warm, casual, and curious — study buddy vibe. Follow the onboarding flow but keep it conversational.\n\nWhen the student is uncertain about topics, suggest 5-6 fun/interesting options with tappable buttons. When they choose, ask for clarification if the topic could mean multiple things. Before building the curriculum, give a short mini-wiki intro (2-3 sentences about the field, mention key people/events with Wikipedia links, then link to a great introductory article or video with URL preview).\n\nFormat all messages with Telegram HTML tags.`,
  ].filter(Boolean).join('\n\n---\n\n');

  return { system, model: 'strong' };
}

export function buildQuizPrompt(skills, topicSlug, recentLessons) {
  const system = [
    skills.get('skill'),
    skills.get('lesson-delivery'),
    skills.get('tg-soul'),
    buildUserContext(),
    `## Quiz Generation\n\nGenerate 3-5 review questions about: ${recentLessons.map((l) => l.title).join(', ')}.\n\nEach question should be a Telegram quiz poll format:\n- question text\n- 4 options (one correct)\n- explanation for the correct answer\n\nOutput as JSON array: [{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "..."}]`,
  ].filter(Boolean).join('\n\n---\n\n');

  return { system, model: 'strong' };
}

export function buildChatPrompt(skills) {
  const system = [
    skills.get('skill'),
    skills.get('tg-soul'),
    buildUserContext(),
    '## Chat Mode\n\nRespond naturally as a study buddy. Keep it short and casual. Use Telegram HTML formatting. If the student asks about a topic you\'re teaching, connect to relevant lessons.',
  ].filter(Boolean).join('\n\n---\n\n');

  return { system, model: 'cheap' };
}

export function buildIntroPrompt(skills, topic, studentLevel, wikiSummary) {
  const wikiContext = wikiSummary
    ? `## Wikipedia Summary\n\n**${wikiSummary.title}**: ${wikiSummary.extract}\n${wikiSummary.url ? `Source: ${wikiSummary.url}` : ''}`
    : '';

  const system = [
    skills.get('skill'),
    skills.get('tg-soul'),
    buildUserContext(),
    wikiContext,
    `## Topic Introduction (Phase A)

The student just picked: "${topic}"
Student level: ${studentLevel}

Write a mini-wiki intro for Telegram (HTML formatting). Include:

1. **What it is** — 2-3 sentences explaining the field/topic. Ground this in the Wikipedia summary above if available.
2. **Why it matters** — one sentence on why this is worth learning.
3. **Key people** — mention 2-4 important figures (with brief context).
4. **Start here** — suggest ONE specific, real resource the student can engage with right now while the curriculum is being built. This should be:
   - A well-known video (3Blue1Brown, Veritasium, Khan Academy, MIT OCW lecture)
   - OR a canonical introductory article/blog post
   - OR a free textbook intro chapter
   Pick something appropriate for their level. Only suggest resources you are confident exist — real URLs only.

Keep the whole message under 200 words. Use Telegram HTML tags (<b>, <i>, <a href>). Be warm and enthusiastic — study buddy tone.

Do NOT generate any curriculum, lesson list, or JSON. Just the intro message.`,
  ].filter(Boolean).join('\n\n---\n\n');

  return { system, model: 'strong' };
}

// Kept for backward compat — no longer used in main flow
export function buildScaffoldPrompt(skills, topic, studentLevel) {
  return buildIntroPrompt(skills, topic, studentLevel, null);
}

export function buildResearchSynthesisPrompt(skills, topic, studentLevel, researchContext) {
  const system = [
    skills.get('skill'),
    skills.get('domain-template'),
    skills.get('curriculum-format'),
    skills.get('teaching-method'),
    buildUserContext(),
    `## Research Results

The following was gathered from academic APIs (arxiv, Semantic Scholar, OpenAlex, Wikipedia):

${researchContext}`,
    `## Curriculum Generation (Phase B — Research-Driven)

Using the research above, generate a complete curriculum for: "${topic}"
Student level: ${studentLevel}

Requirements:
- 20-30 lessons organized into modules
- Each lesson: day, module, title (as a question/provocation), concepts (array), resources (array of REAL URLs from the research above or well-known sources you can verify), status: "pending"
- Include review days every 5-7 lessons
- Lesson titles should be questions or provocations, not topic labels
- Map prerequisites and flag if student might be missing background
- Sequence based on real pedagogical ordering from the syllabi and textbooks found in research

Also generate:
- teachingNotes: detailed markdown with approach, common misconceptions, level adjustments, rabbit holes
- conceptMap: full dependency graph of concepts in learning order with prerequisite links

Output as JSON with keys: curriculum, teachingNotes, conceptMap
Only include resource URLs that appear in the research results above or that you are confident are real (e.g., Wikipedia pages, MIT OCW courses, 3Blue1Brown videos).`,
  ].filter(Boolean).join('\n\n---\n\n');

  return { system, model: 'strong' };
}

// Keep backward compat alias
export function buildCurriculumPrompt(skills, topic, studentLevel) {
  return buildScaffoldPrompt(skills, topic, studentLevel);
}
