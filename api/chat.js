import { getState, getAdapter } from './_lib/init.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const state = await getState();
    const adapter = getAdapter();
    const { message } = req.body;

    const user = state.readUser();
    const system = [
      '## Study Buddy\n\nYou are a warm, sharp study buddy. Be concise. 1-3 sentences for simple questions.',
      user ? `## Student\n\n${user}` : '',
    ].filter(Boolean).join('\n\n---\n\n');

    const response = await adapter.generate(
      system + '\n\nReturn only polished text.',
      [{ role: 'user', content: message }],
      { model: 'cheap' },
    );

    res.status(200).json({ reply: response.text, model: response.model });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
