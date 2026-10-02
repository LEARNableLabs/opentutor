/**
 * Find real things to watch and read for each lesson, so the lessons are interesting (#334).
 *
 * The model asked for resources writes them from memory, and 70% of the YouTube links it wrote for the
 * shipped courses do not exist. Here it searches the web instead (Claude Code's WebSearch), and code
 * then checks every URL it brings back; a link that is not real never reaches a lesson.
 */

import { check } from './link-check.js';
import { parseFirstJson } from './json.js';

const TOOLS = 'WebSearch,WebFetch';
const MAX_PER_LESSON = 5;
// A search over six lessons took 2 to 4 minutes; the adapter's default 120 s cut four of five batches off.
const SEARCH_TIMEOUT_MS = 600_000;

function prompt(topic, level, lessons) {
  return `You are finding resources for a ${level} course on "${topic}". Use web search. For EACH lesson below, find 2 to 4 resources the student will actually enjoy:
- at least one YouTube video where one exists: a clear, engaging explainer, ideally under 15 minutes, from a channel known for it. A YouTube Short only when it teaches the lesson's point on its own.
- an article, a documentary or interview, an interactive, or a paper where it fits. Prefer open access and primary sources. A paper only if a beginner can get something from it.
- never a course landing page, a paywalled page, or a link you did not see in a search result. Do not write a URL from memory.
For each, say in one sentence why it is interesting: the hook, not a summary.

Lessons:
${lessons.map((l) => `${l.lesson}. ${l.title} (concepts: ${(l.concepts || []).join(', ')})`).join('\n')}

Return only JSON: {"lessons":[{"lesson":1,"resources":[{"url":"https://…","type":"video|short|article|paper|interactive","title":"…","why":"…"}]}]}`;
}

/**
 * Search for resources lesson by lesson, `batch` lessons a call, and keep only the URLs that check out.
 * Returns [{ lesson, resources: [{ url, type, title, why }] }]. A batch that fails to parse yields nothing
 * for its lessons and is reported, never guessed.
 */
export async function findResources({ adapter, topic, level, lessons, batch = 6, isReal = async (url) => (await check(url)).status !== 'dead', onNote = () => {} }) {
  const found = [];
  for (let i = 0; i < lessons.length; i += batch) {
    const group = lessons.slice(i, i + batch);
    let data = null;
    try {
      const res = await adapter.generate(prompt(topic, level, group), [{ role: 'user', content: `Find the resources for lessons ${group[0].lesson} to ${group.at(-1).lesson}.` }], { model: 'strong', tools: TOOLS, outputMode: 'json', timeout: SEARCH_TIMEOUT_MS });
      data = parseFirstJson(res.text);
    } catch (err) {
      onNote('resource-search-failed', { lessons: group.map((l) => l.lesson), error: err.message });
    }
    for (const entry of data?.lessons || []) {
      const resources = [];
      for (const r of entry.resources || []) {
        if (typeof r?.url !== 'string' || !/^https:\/\//.test(r.url) || resources.some((x) => x.url === r.url)) continue;
        if (await isReal(r.url)) resources.push({ url: r.url, type: r.type, title: r.title, why: r.why });
        else onNote('resource-dropped', { lesson: entry.lesson, url: r.url });
      }
      found.push({ lesson: entry.lesson, resources });
    }
  }
  return found;
}

/** The curriculum with each lesson's `resources` set to the found URLs, then any URL it already had. */
export function withResources(curriculum, found) {
  const byLesson = new Map(found.map((f) => [f.lesson, f.resources.map((r) => r.url)]));
  return {
    ...curriculum,
    lessons: curriculum.lessons.map((l) => ({
      ...l,
      resources: [...new Set([...(byLesson.get(l.lesson) || []), ...(l.resources || [])])].slice(0, MAX_PER_LESSON),
    })),
  };
}

const ICON = { video: '▶', short: '▶', article: '📄', paper: '📑', interactive: '🕹' };

/** A markdown section for resources.md: what to watch and read, lesson by lesson, and why. */
export function resourcesSection(found, lessons) {
  const title = new Map(lessons.map((l) => [l.lesson, l.title]));
  const lines = found.filter((f) => f.resources.length).flatMap((f) => [
    `### Lesson ${f.lesson}: ${title.get(f.lesson) ?? ''}`,
    ...f.resources.map((r) => `- ${ICON[r.type] || '•'} [${r.title}](${r.url}) — ${r.why}`),
    '',
  ]);
  return lines.length ? `\n## Lesson by lesson\n\nFound by web search; every link was checked.\n\n${lines.join('\n')}` : '';
}
