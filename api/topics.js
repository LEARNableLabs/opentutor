import { getState } from './_lib/init.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const state = await getState();
    const topics = state.listTopics();
    const data = topics.map((slug) => ({
      slug,
      ...state.getTopicProgress(slug),
    })).filter((t) => t.topic);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
