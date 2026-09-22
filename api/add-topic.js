import { getState } from './_lib/init.js';
import { checkAuth, authFailure } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = checkAuth(req);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }

  try {
    const { topic } = req.body || {};
    if (typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'A topic name is required.' });
    }
    const slug = slugify(topic);
    if (!slug) {
      return res.status(400).json({ error: 'Topic names must contain at least one letter (a-z) or number.' });
    }
    const state = await getState();

    const existing = await state.readCurriculum(slug);
    if (existing?.lessons?.length) {
      await state.updateProgress((p) => {
        if (!p.active_topics) p.active_topics = [];
        if (!p.active_topics.includes(slug)) p.active_topics.push(slug);
      });
      return res.status(200).json({ slug, status: 'existing', lessonCount: existing.lessons.length });
    }

    // A serverless invocation cannot own a background build after responding.
    // Until a durable worker exists, only activate curricula we can serve (#118).
    return res.status(501).json({
      slug,
      status: 'unavailable',
      error: 'Custom topic generation is not available on this hosted instance. Choose an available topic from the Topics list, or use a local OpenTutor installation to generate a new curriculum.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}
