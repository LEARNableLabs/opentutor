import { getState, getAdapter } from './_lib/init.js';
import { readsJson } from './_lib/body.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { adapterFor, turnText, KeyRequired } from '../lib/core/llm-access.js';
import { VOICE } from '../lib/core/prompts.js';

/**
 * One chat turn, shared by this route and the local server (scripts/web/server.js), as
 * lessonTurn and onboardTurn are. The message is checked before `getAdapter` chooses a key,
 * so an empty or oversized message is a 400, never a billed model call (#228).
 */
export async function chatTurn({ state, getAdapter }, { message } = {}) {
  const text = turnText(message);
  if (text === null) return { status: 400, body: { error: 'A message of 1 to 4,000 characters is required.' } };
  const adapter = await getAdapter();

  const user = await state.readUser();
  const system = [
    '## OpenTutor\n\nYou are OpenTutor, a warm, sharp tutor. Be concise. 1-3 sentences for simple questions.',
    VOICE,
    user ? `## Student\n\n${user}` : '',
  ].filter(Boolean).join('\n\n---\n\n');

  const response = await adapter.generate(
    system + '\n\nReturn only polished text.',
    [{ role: 'user', content: text }],
    { model: 'cheap' },
  );
  return { status: 200, body: { reply: response.text, model: response.model } };
}

export default readsJson(handler);

async function handler(req, res) {
  res.setHeader?.('Cache-Control','private, no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await authenticateRequest(req, getState);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }

  try {
    const state = await getState(auth.userId);
    const { status, body } = await chatTurn({ state, getAdapter: () => adapterFor({ state, use: 'chat', host: getAdapter }) }, req.body || {});
    res.status(status).json(body);
  } catch (err) {
    if (err instanceof KeyRequired) return res.status(402).json(err.body);
    console.error('[chat]', err.message);
    res.status(500).json({ error: 'The tutor is unavailable right now. Please try again.' });
  }
}
