import { randomUUID } from 'node:crypto';
import { generatedTopicKey, decodeTopic } from './generated-topics.js';
import { generateQuickStart } from './quick-start.js';
import { CurriculumPipeline } from './pipeline.js';
import { withoutRuntimeFields } from './progress.js';
import { KeyRequired } from './llm-access.js';

const LEASE_MS = 180000;
export const readTopicBuild = async (state, slug) => decodeTopic(await state.readKV(generatedTopicKey(slug)));
const nextVersion = (doc, updates) => ({ ...doc, ...updates, revision: doc.revision + 1, updatedAt: new Date().toISOString() });
export const buildSummary = (doc) => doc && ({ slug: doc.slug, status: doc.status, phase: doc.phase, lessonCount: doc.curriculum?.lessons?.length || 0, intro: doc.intro || '', approved: doc.approved ?? null, error: doc.error || null });

export async function activateTopic(state, slug) {
  await state.updateProgress((p) => {
    if (!p.active_topics) p.active_topics = [];
    if (!p.active_topics.includes(slug)) p.active_topics.push(slug);
  });
}

export function normalizeTopicRequest(payload) {
  const { topic, level = 'intermediate' } = payload || {};
  if (typeof topic !== 'string' || !topic.trim() || topic.length > 300) throw new Error('A topic name of 1–300 characters is required.');
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80).replace(/-$/, '');
  generatedTopicKey(slug);
  if (!['beginner', 'intermediate', 'advanced'].includes(level)) throw new Error('Invalid level');
  return { topic: topic.trim(), level, slug };
}

export async function prepareTopicBuild(state, payload, { beforeBuild } = {}) {
  const { topic, level, slug } = normalizeTopicRequest(payload);
  let doc = await readTopicBuild(state, slug);
  if (!doc) {
    const existing = await state.readCurriculum(slug);
    if (existing?.lessons?.length) {
      await activateTopic(state, slug);
      return { existing: { slug, status: 'existing', lessonCount: existing.lessons.length } };
    }
    // A refusal here (#132) must leave nothing behind: no record, no queue entry.
    await beforeBuild?.();
    const fresh = { id: randomUUID(), revision: 0, seq: 0, slug, topic: topic.trim(), level, status: 'queued', phase: 'quick', iteration: 1, attempts: 0, lease: null, curriculum: null, files: {}, draft: {}, updatedAt: new Date().toISOString() };
    if (await state.compareAndSetTopic(slug, null, fresh)) doc = fresh;
    else doc = await readTopicBuild(state, slug);
  }
  if (doc.status === 'failed') {
    await beforeBuild?.();
    const retry = nextVersion(doc, { status: 'queued', attempts: 0, error: null, lease: null, seq: doc.seq + 1 });
    if (await state.compareAndSetTopic(slug, doc, retry)) doc = retry;
    else doc = await readTopicBuild(state, slug);
  }
  if (doc.curriculum) await activateTopic(state, slug);
  return { doc };
}

export class BuildBusyError extends Error {}

async function withDeadline(work, timeout) {
  let timer;
  try {
    return await Promise.race([work(), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Build step timed out')), timeout); })]);
  } finally { clearTimeout(timer); }
}

// Keep every starter lesson's identity, including an in-flight lesson, stable.
export function preserveStarterLessons(starter, full) {
  const titles = new Set(starter.lessons.map((l) => l.title.toLowerCase().trim()));
  return withoutRuntimeFields({ ...full, lessons: [...starter.lessons, ...full.lessons.filter((l) => !titles.has(l.title.toLowerCase().trim()))]
    .map((lesson, i) => ({ ...lesson, day: i + 1, lesson: i + 1 })) });
}

/** One bounded, checkpointed step. All model writes are staged in memory, then
 * content and checkpoint are published together by a fenced compare-and-set. */
export async function runTopicBuildStep({ state, adapter, getAdapter, skills, slug, id, seq, quickStart = generateQuickStart, now = Date.now }) {
  let doc = await readTopicBuild(state, slug);
  if (!doc || doc.id !== id) return null;
  if (doc.seq !== seq || ['ready', 'failed'].includes(doc.status)) return doc;
  if (doc.lease?.until > now()) throw new BuildBusyError('Build step already running');
  if (doc.attempts >= 3) {
    const failed = nextVersion(doc, { status: 'failed', lease: null, error: 'The curriculum build could not finish. Retry to continue from the last saved step.' });
    await state.compareAndSetTopic(slug, doc, failed);
    return readTopicBuild(state, slug);
  }
  const claimed = nextVersion(doc, { status: 'building', attempts: doc.attempts + 1, lease: { token: randomUUID(), until: now() + LEASE_MS } });
  if (!await state.compareAndSetTopic(slug, doc, claimed)) throw new BuildBusyError('Build step already claimed');
  doc = claimed;
  try {
    adapter ||= await getAdapter?.();
    const result = await withDeadline(async () => {
      const next = structuredClone(doc);
      const stagedFiles = { ...doc.files, ...doc.draft.files };
      // Existing pipeline steps can write freely into a private staging area.
      const staged = { writeCurriculum() {}, writeDomainFile(_slug, filename, content) { stagedFiles[filename] = content; } };
      const pipeline = new CurriculumPipeline({ adapter, skills, state: staged });
      const ctx = { topic: doc.topic, slug, studentLevel: doc.level, researchContext: doc.researchContext || '', plan: doc.draft.plan, critique: doc.draft.critique, parsed: doc.draft.parsed };
      if (doc.phase === 'quick') {
        const quick = await quickStart({ adapter, skills, topic: doc.topic, slug, level: doc.level });
        next.curriculum = quick.curriculum; next.intro = quick.intro;
        next.researchContext = quick.researchContext;
        next.files = { 'research.md': quick.researchContext };
        next.phase = 'plan';
      } else if (doc.phase === 'plan') {
        next.draft.plan = await pipeline._plan(ctx);
        next.draft.plan += `\n\nKeep these starter lessons unchanged as the curriculum prefix:\n${JSON.stringify(doc.curriculum.lessons)}`;
        next.phase = 'build';
      } else if (doc.phase === 'build') {
        next.draft.parsed = await pipeline._build(ctx);
        next.draft.parsed.curriculum = preserveStarterLessons(doc.curriculum, next.draft.parsed.curriculum);
        next.phase = 'critique';
      } else if (doc.phase === 'critique') {
        const verdict = await pipeline._critique(ctx);
        if (verdict.status === 'APPROVED' || doc.iteration >= 3) {
          next.curriculum = { ...doc.draft.parsed.curriculum, preliminary: false };
          next.files = stagedFiles; next.approved = verdict.status === 'APPROVED';
          next.status = 'ready'; next.phase = 'ready'; next.draft = {};
        } else {
          next.draft.critique = verdict.critique; next.iteration++; next.phase = 'plan';
        }
      } else throw new Error('Unknown build phase');
      if (next.status !== 'ready') { next.status = 'queued'; next.draft.files = stagedFiles; }
      next.lease = null; next.error = null; next.attempts = 0; next.seq++;
      return nextVersion(doc, next);
    }, doc.phase === 'quick' ? 45000 : 150000);
    if (!await state.compareAndSetTopic(slug, doc, result)) return readTopicBuild(state, slug);
    return result;
  } catch (err) {
    console.error(`[topic-build] ${slug} ${doc.phase}: ${err.message}`);
    // No key, or the student's key was refused: retrying cannot fix that (#132).
    const refused = err instanceof KeyRequired;
    const failed = nextVersion(doc, { lease: null, status: refused || doc.attempts >= 3 ? 'failed' : 'queued', error: refused ? err.message : 'The curriculum build hit a problem and will retry.' });
    await state.compareAndSetTopic(slug, doc, failed);
    if (refused) return readTopicBuild(state, slug);
    throw err;
  }
}

export async function listTopicBuilds(state) {
  const docs = await Promise.all((await state.listGeneratedTopics()).map((slug) => readTopicBuild(state, slug)));
  return docs.filter(Boolean).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(buildSummary);
}
