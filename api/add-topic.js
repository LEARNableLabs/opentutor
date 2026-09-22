import { getState, getPipelineAdapter, getSkills } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { normalizeTopicRequest } from '../lib/core/topic-builds.js';
import { addTopic } from '../lib/core/topic-service.js';
import { enqueueTopicBuild } from './_lib/topic-queue.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = await authenticateRequest(req, getState);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }
  try {
    normalizeTopicRequest(req.body);
    const result = await addTopic({ state: await getState(auth.userId), getAdapter: getPipelineAdapter, skills: getSkills(), enqueue: enqueueTopicBuild }, req.body || {});
    return res.status(result.lessonCount ? 200 : 202).json(result);
  } catch (err) {
    const invalid = /topic name|Invalid topic slug|Invalid level/.test(err.message);
    console.error('[add-topic]', err.message);
    return res.status(invalid ? 400 : 503).json({ error: invalid ? err.message : 'Could not schedule the curriculum. Please try adding the topic again.' });
  }
}
