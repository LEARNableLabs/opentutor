import { prepareTopicBuild, runTopicBuildStep, readTopicBuild, buildSummary, BuildBusyError, activateTopic } from './topic-builds.js';

export const buildMessage = (state, doc) => ({ userId: state.userId ?? null, slug: doc.slug, id: doc.id, seq: doc.seq });

// Await durable acceptance before spending time on Phase A. If the request is
// interrupted, the already-enqueued job resumes it without the browser staying open.
export async function addTopic({ state, adapter, getAdapter, skills, enqueue, quickStart }, payload) {
  const { existing, doc } = await prepareTopicBuild(state, payload);
  if (existing) return existing;
  if (doc.status === 'ready') return buildSummary(doc);
  adapter ||= getAdapter?.();
  await enqueue(buildMessage(state, doc));
  if (!doc.curriculum && doc.phase === 'quick') {
    try {
      await runTopicBuildStep({ state, adapter, skills, slug: doc.slug, id: doc.id, seq: doc.seq, quickStart });
    } catch (err) {
      if (!(err instanceof BuildBusyError)) console.error('[quick-start]', err.message);
      // The durable consumer owns retries, including a request-time timeout.
    }
  }
  const current = await readTopicBuild(state, doc.slug);
  if (current?.curriculum) await activateTopic(state, doc.slug);
  if (current && !['ready', 'failed'].includes(current.status)) await enqueue(buildMessage(state, current));
  return buildSummary(current);
}
