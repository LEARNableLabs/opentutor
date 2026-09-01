import { getState, getAdapter } from './_lib/init.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const state = await getState();
    const adapter = getAdapter();
    const { message, history } = req.body;

    const user = await state.readUser();
    const system = [
      '## Study Buddy Onboarding',
      'You are a warm, sharp study buddy meeting a new student. Keep it natural — not a form.',
      'Ask one question at a time. Discover: their name, what they want to learn, their level, and how they prefer to learn (examples-first vs theory-first, visual vs verbal).',
      'When you have enough info, suggest 2-3 specific topics and ask them to pick one.',
      'When they pick a topic, respond with exactly this marker on its own line: <TOPIC>chosen topic</TOPIC>',
      user ? `## Student profile so far\n\n${user}` : '',
      '\n\nReturn only polished text. Keep each message to 2-3 short paragraphs max.',
    ].filter(Boolean).join('\n\n');

    const messages = [...(history || []), { role: 'user', content: message }];
    const response = await adapter.generate(system, messages, { model: 'cheap' });

    const topicMatch = response.text.match(/<TOPIC>(.+?)<\/TOPIC>/);
    const cleanText = response.text.replace(/<TOPIC>.+?<\/TOPIC>/g, '').trim();

    res.status(200).json({
      reply: cleanText,
      confirmedTopic: topicMatch ? topicMatch[1].trim() : null,
      model: response.model,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
