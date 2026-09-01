import { getState, getPipelineAdapter, getSkills } from './_lib/init.js';
import { CurriculumPipeline } from '../lib/core/pipeline.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const state = await getState();
    const { topic, level } = req.body;
    const slug = slugify(topic);

    const existing = await state.readCurriculum(slug);
    if (existing?.lessons?.length) {
      await state.updateProgress((p) => {
        if (!p.active_topics) p.active_topics = [];
        if (!p.active_topics.includes(slug)) p.active_topics.push(slug);
      });
      return res.status(200).json({ slug, status: 'existing', lessonCount: existing.lessons.length });
    }

    // Register topic immediately
    await state.updateProgress((p) => {
      if (!p.active_topics) p.active_topics = [];
      if (!p.active_topics.includes(slug)) p.active_topics.push(slug);
    });

    // Start pipeline in background (non-blocking in serverless — will timeout)
    const pipelineAdapter = getPipelineAdapter();
    const skills = getSkills();
    const pipeline = new CurriculumPipeline({
      adapter: pipelineAdapter,
      state,
      skills,
      onProgress: (p) => console.log(`[pipeline] ${p.phase} — ${p.topic} (${p.iteration})`),
    });

    pipeline.run(topic, slug, level || 'intermediate', '').catch((err) => {
      console.error('[pipeline] failed:', err.message);
    });

    res.status(200).json({ slug, status: 'building' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}
