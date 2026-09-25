import { getState } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader?.('Cache-Control','private, no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await authenticateRequest(req, getState);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }

  try {
    const state = await getState(auth.userId);
    res.status(200).json(await state.readProgress());
  } catch (err) {
    // Database error text stays in the log, not the browser (#144).
    console.error('[progress]', err.message);
    res.status(500).json({ error: 'Could not load your progress.' });
  }
}
