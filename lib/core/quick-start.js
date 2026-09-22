import { researchTopic, formatResearchContext, searchWikipediaSummary } from './research.js';
import { untrustedData } from './prompts.js';

export function buildQuickStartPrompt(_skills, topic, studentLevel, wikiSummary, researchContext, { format = 'markdown' } = {}) {
  const presentation = format === 'telegram'
    ? 'Use Telegram HTML in taster and roadmap: <b>, <i>, <a href>. End by inviting the student to type /next.'
    : 'Use plain text or simple Markdown in taster and roadmap. Invite the student to start their first lesson.';
  return {
    model: 'strong', outputMode: 'json',
    system: [
      'You are a warm, sharp tutor. Create a quick introduction and five useful starter lessons.',
      untrustedData('quick-start-request', JSON.stringify({ topic, studentLevel }), 2000),
      untrustedData('wikipedia-summary', JSON.stringify(wikiSummary), 6000),
      untrustedData('research-results', researchContext, 10000),
      `Return only JSON with taster, roadmap, and quickCurriculum. ${presentation}`,
      'taster: under 250 words explaining the field, one surprising idea, a micro-exercise, and one real resource from the research. Do not invent URLs.',
      'roadmap: four to six short module descriptions.',
      'quickCurriculum: exactly five foundational lessons as objects with title, module, concepts (array of strings), resources (array). These lessons will remain unchanged when the full curriculum arrives.',
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
  const data = JSON.parse(response.text.match(/\{[\s\S]*\}/)?.[0] || '{}');
  if (!Array.isArray(data.quickCurriculum) || data.quickCurriculum.length !== 5 || data.quickCurriculum.some((l) => typeof l?.title !== 'string' || !l.title.trim())) {
    throw new Error('Quick curriculum must contain five titled lessons');
  }
  return {
    intro: [data.taster, data.roadmap].filter((v) => typeof v === 'string').join('\n\n'), researchContext,
    curriculum: {
      topic, slug, created: new Date().toISOString().slice(0, 10), student_level: level, preliminary: true,
      lessons: data.quickCurriculum.map((l, i) => ({
        day: i + 1, lesson: i + 1, title: l.title, module: l.module || 'Getting Started',
        concepts: Array.isArray(l.concepts) ? l.concepts.filter((c) => typeof c === 'string') : [],
        resources: Array.isArray(l.resources) ? l.resources : [], status: 'pending',
      })),
    },
  };
}
