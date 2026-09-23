import { getState, getPipelineAdapter, getSkills } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { normalizeTopicRequest } from '../lib/core/topic-builds.js';
import { addTopic } from '../lib/core/topic-service.js';
import { enqueueTopicBuild } from './_lib/topic-queue.js';
import { adapterFor, KeyRequired } from '../lib/core/llm-access.js';

export default async function handler(req, res) {
  res.setHeader?.('Cache-Control','private, no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = await authenticateRequest(req, getState);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }
  try {
    normalizeTopicRequest(req.body);
    const state = await getState(auth.userId);
    const result = await addTopic({ state, getAdapter: () => adapterFor({ state, use: 'custom-topic', host: getPipelineAdapter }), skills: getSkills(), enqueue: enqueueTopicBuild }, req.body || {});
    return res.status(result.lessonCount ? 200 : 202).json(result);
  } catch (err) {
    if (err instanceof KeyRequired) return res.status(402).json(err.body);
    const invalid = /topic name|Invalid topic slug|Invalid level/.test(err.message);
    console.error('[add-topic]', err.message);
    return res.status(invalid ? 400 : 503).json({ error: invalid ? err.message : 'Could not schedule the curriculum. Please try adding the topic again.' });
  }
}
