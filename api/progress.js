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
    res.status(200).json(await state.readProgress());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
