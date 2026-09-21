import { getState } from './_lib/init.js';
import { checkAuth, authFailure } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = checkAuth(req);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }

  try {
    const state = await getState();
    const topics = await state.listTopics();
    const data = [];
    for (const slug of topics) {
      const progress = await state.getTopicProgress(slug);
      if (progress?.topic) data.push({ slug, ...progress });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
