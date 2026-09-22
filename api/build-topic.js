import { topicQueue, enqueueTopicBuild } from './_lib/topic-queue.js';
import { getState, getPipelineAdapter, getSkills } from './_lib/init.js';
import { runTopicBuildStep } from '../lib/core/topic-builds.js';
import { buildMessage } from '../lib/core/topic-service.js';
import { findStudent } from '../lib/core/students.js';

// Private queue-triggered function: vercel.json removes its public HTTP URL.
export default topicQueue.handleNodeCallback(async ({ userId, slug, id, seq }) => {
  const root = await getState();
  if (userId != null && (await findStudent(root, userId))?.status !== 'active') return;
  const state = await getState(userId);
  const doc = await runTopicBuildStep({ state, getAdapter: getPipelineAdapter, skills: getSkills(), slug, id, seq });
  if (doc && !['ready', 'failed'].includes(doc.status)) await enqueueTopicBuild(buildMessage(state, doc));
}, { retry: () => ({ afterSeconds: 30 }) });
