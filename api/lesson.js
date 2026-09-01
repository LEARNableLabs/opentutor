import { getState, getAdapter, getSkills } from './_lib/init.js';
import { buildTeacherPrompt } from '../lib/core/prompts.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const state = await getState();
    const adapter = getAdapter();
    const skills = getSkills();
    const { topicSlug } = req.body;

    const lesson = await state.getNextLesson(topicSlug);
    if (!lesson) {
      return res.status(200).json({ done: true, message: 'All lessons completed!' });
    }

    const prompt = buildTeacherPrompt(state, skills, lesson, topicSlug);
    const lessonDay = lesson.day || lesson.lesson;
    const response = await adapter.generate(
      prompt.system + '\n\nReturn only polished text. No commentary.',
      [{ role: 'user', content: `Deliver lesson Day ${lessonDay}: "${lesson.title}"` }],
      { model: prompt.model },
    );

    await state.markLessonComplete(topicSlug, lessonDay, 'delivered');

    res.status(200).json({
      lesson: { day: lessonDay, title: lesson.title, module: lesson.module },
      content: response.text,
      model: response.model,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
