import { getState, getAdapter } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
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
    const state = await getState(auth.userId);
    const adapter = await adapterFor({ state, use: 'chat', host: getAdapter });
    const { message } = req.body;

    const user = await state.readUser();
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
    if (err instanceof KeyRequired) return res.status(402).json(err.body);
    res.status(500).json({ error: err.message });
  }
}
