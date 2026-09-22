import { getState } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { readTopicBuild, buildSummary, listTopicBuilds } from '../lib/core/topic-builds.js';

export default async function handler(req, res) {
  res.setHeader?.('Cache-Control','private, no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const auth = await authenticateRequest(req, getState);
  if (!auth.ok) { const { status, body } = authFailure(auth); return res.status(status).json(body); }
  try {
    const slug = req.query?.slug ?? new URL(req.url || '/api/topic-build', 'http://localhost').searchParams.get('slug');
    const state = await getState(auth.userId);
    if (slug == null) return res.status(200).json(await listTopicBuilds(state));
    const doc = await readTopicBuild(state, slug);
    return doc ? res.status(200).json(buildSummary(doc)) : res.status(404).json({ error: 'No build found' });
  } catch (err) {
    return res.status(/Invalid topic slug/.test(err.message) ? 400 : 500).json({ error: 'Could not read build status' });
  }
}
