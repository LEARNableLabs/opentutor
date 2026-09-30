import { researchTopic, formatResearchContext, searchWikipediaSummary } from './research.js';
import { untrustedData, VOICE } from './prompts.js';
import { parseFirstJson } from './json.js';

// #251: a topic is advanced exactly when a prerequisite names a subject normally first taught at
// university. The list decides, reviewable in one place, not a model: models drifted with how
// hard a subject sounds, both ways. "Helpful" or "or equivalent" never counts.
const UNIVERSITY = /\b(calculus|linear algebra|differential equations|real analysis|complex analysis|measure theory|topology|abstract algebra|group theory|category theory|functional analysis|harmonic analysis|commutative algebra|ring theory|galois theory|differential geometry|algebraic (topology|geometry)|proofs?|discrete math(ematics)?|organic chemistry|biochemistry|molecular biology|quantum|statistical mechanics|electromagnet(ism|ics)|data structures|algorithms|operating systems|compilers?|signal processing|econometrics|machine learning|supervised learning)\b/i;
// And a topic naming a school subject is at least intermediate: beginner means general knowledge only.
const SCHOOL = /\b(algebra|geometry|trigonometry|probability|statistics|chemistry|biology|physics|programming|coding|music theory|economics)\b/i;
const OPTIONAL = /helpful|optional|not required|or equivalent|recommended|preferred|nice to have/i;
// Words that only qualify: a parenthesis of nothing else makes its subject optional.
const QUALIFIERS = /\b(helpful|optional|not|required|recommended|strongly|highly|useful|preferred|ideally|nice|to|have|a|plus|but|and|or|equivalent|if|possible|bonus|encouraged|is|very)\b|[(),.;\s]/gi;
const INTRODUCTORY = /^(basic|general|introductory|intro to|elementary|foundational|some)\b/i;

/** Whether one prerequisite names a subject from `list`, as a requirement.
 * - "(optional but helpful)", optional words alone, makes the subject itself optional.
 * - A parenthesis with other words only qualifies a detail: "linear algebra (tensor basics helpful)".
 * - After an introductory phrase a parenthesis lists examples: "basic programming (loops, data structures)".
 *   Otherwise it may name the course: "derivatives and optimization (calculus I)". */
function names(list, prerequisite) {
  let text = String(prerequisite);
  const parts = text.match(/\([^)]*\)/g) || [];
  if (parts.some((part) => OPTIONAL.test(part) && !part.replace(QUALIFIERS, ''))) return false;
  text = text.replace(/\([^)]*\)/g, (part) => (OPTIONAL.test(part) ? '' : part));
  if (INTRODUCTORY.test(text.trim())) text = text.replace(/\([^)]*\)/g, '');
  return list.test(text) && !OPTIONAL.test(text);
}
export const isUniversity = (prerequisite) => names(UNIVERSITY, prerequisite);
export const isSchool = (prerequisite) => names(SCHOOL, prerequisite);
const isIntroductory = (prerequisite) => INTRODUCTORY.test(String(prerequisite).trim()) || /\b(basics|fundamentals|introductory)\b/i.test(prerequisite);

/** A curriculum's `level` and `prerequisites` (#251), only when valid; absent otherwise. */
export function topicMeta(source) {
  const meta = {};
  const prerequisites = Array.isArray(source?.prerequisites)
    ? source.prerequisites.filter((p) => typeof p === 'string' && p.trim()).map((p) => p.trim().slice(0, 160)).slice(0, 12)
    : [];
  let level = ['beginner', 'intermediate', 'advanced'].includes(source?.level) ? source.level : null;
  // The rule outranks a model's word: a listed university subject makes it advanced, and nothing else can.
  if (level && prerequisites.length) {
    // The lists set floors. A list can't be complete, so "advanced" falls only when every
    // prerequisite is introductory, never merely because its subject isn't listed.
    if (prerequisites.some(isUniversity)) level = 'advanced';
    else if (level === 'advanced' && prerequisites.every(isIntroductory)) level = 'intermediate';
    else if (level === 'beginner' && prerequisites.some(isSchool)) level = 'intermediate';
  }
  if (level) meta.level = level;
  if (prerequisites.length) meta.prerequisites = prerequisites;
  return meta;
}

/** `curriculum` with its level and prerequisites validated: its own valid ones, else `fallback`'s, never invalid ones. */
export function withTopicMeta(curriculum, fallback) {
  const out = { ...curriculum };
  delete out.level;
  delete out.prerequisites;
  // A level only means something beside its own prerequisites, so both come from one source.
  const own = topicMeta(curriculum), other = topicMeta(fallback);
  const complete = (meta) => Boolean(meta.level && meta.prerequisites);
  const meta = complete(own) ? own : complete(other) ? other : Object.keys(own).length ? own : other;
  return { ...out, ...meta };
}

export function buildQuickStartPrompt(_skills, topic, studentLevel, wikiSummary, researchContext, { format = 'markdown' } = {}) {
  const presentation = format === 'telegram'
    ? 'Use Telegram HTML in taster and roadmap: <b>, <i>, <a href>. End by inviting the student to type /next.'
    : 'Use plain text or simple Markdown in taster and roadmap. Invite the student to start their first lesson.';
  return {
    model: 'strong', outputMode: 'json',
    system: [
      'You are OpenTutor, a warm, sharp tutor. Create a quick introduction and five useful starter lessons. The student reads the taster and roadmap as written, so write them in the voice below.',
      VOICE,
      untrustedData('quick-start-request', JSON.stringify({ topic, studentLevel }), 2000),
      untrustedData('wikipedia-summary', JSON.stringify(wikiSummary), 6000),
      untrustedData('research-results', researchContext, 10000),
      `Return only JSON with taster, roadmap, quickCurriculum, level and prerequisites. ${presentation}`,
      'taster: under 250 words explaining the field, one surprising idea, a micro-exercise, and one real resource from the research. Do not invent URLs.',
      'roadmap: four to six short module descriptions.',
      'quickCurriculum: exactly five foundational lessons as objects with title, module, concepts (array of strings), resources (array). These lessons will remain unchanged when the full curriculum arrives.',
      'level: how hard the topic is, "beginner" (general knowledge any curious adult has), "intermediate" (background from school or an introductory course) or "advanced" (university-level background in a related field). prerequisites: two to five short strings, what a learner should know before starting.',
    ].join('\n\n'),
  };
}

export async function generateQuickStart({ adapter, skills, topic, slug, level = 'intermediate', format, research = researchTopic, wikipedia = searchWikipediaSummary, researchTimeout = 8000 }) {
  // Research has its own budget, leaving 30 seconds for the model and time
  // to persist the result within the 60-second hosted request.
  const bounded = async (work, fallback) => {
    let timer;
    try { return await Promise.race([Promise.resolve().then(work).catch(() => fallback), new Promise((resolve) => { timer = setTimeout(() => resolve(fallback), researchTimeout); })]); }
    finally { clearTimeout(timer); }
  };
  const [wiki, sources] = await Promise.all([
    bounded(() => wikipedia(topic), null), bounded(() => research(topic, { level }), {}),
  ]);
  const researchContext = formatResearchContext({ arxiv: [], semanticScholar: [], openAlex: [], ...sources });
  const prompt = buildQuickStartPrompt(skills, topic, level, wiki, researchContext, { format });
  const response = await adapter.generate(prompt.system, [{ role: 'user', content: `Give me a quick start for "${topic}".` }], { model: prompt.model, outputMode: prompt.outputMode, timeout: 30000 });
  const data = parseFirstJson(response.text) || {};
  if (!Array.isArray(data.quickCurriculum) || data.quickCurriculum.length !== 5 || data.quickCurriculum.some((l) => typeof l?.title !== 'string' || !l.title.trim())) {
    throw new Error('Quick curriculum must contain five titled lessons');
  }
  return {
    intro: [data.taster, data.roadmap].filter((v) => typeof v === 'string').join('\n\n'), researchContext,
    curriculum: {
      topic, slug, created: new Date().toISOString().slice(0, 10), student_level: level, preliminary: true,
      ...topicMeta(data), // #251: shown on the Topics tab until the full build lands
      lessons: data.quickCurriculum.map((l, i) => ({
        day: i + 1, lesson: i + 1, title: l.title, module: l.module || 'Getting Started',
        concepts: Array.isArray(l.concepts) ? l.concepts.filter((c) => typeof c === 'string') : [],
        resources: Array.isArray(l.resources) ? l.resources : [], status: 'pending',
      })),
    },
  };
}
