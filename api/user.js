import { getState } from './_lib/init.js';
import { readsJson } from './_lib/body.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { userView } from '../lib/core/welcome.js';

export default readsJson(handler);

async function handler(req, res) {
  res.setHeader?.('Cache-Control','private, no-store');

  const auth = await authenticateRequest(req, getState);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }
  try {
    const state = await getState(auth.userId);

    if (req.method === 'GET') {
      return res.status(200).json(await userView(state, auth.account));
    }

    if (req.method === 'POST') {
      const data = req.body;
      const profile = buildUserProfile(data);
      await state.writeUser(profile);
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    // Database error text stays in the log, not the browser (#144).
    console.error('[user]', err.message);
    res.status(500).json({ error: req.method === 'POST' ? 'Could not save your profile.' : 'Could not load your profile.' });
  }
}

function buildUserProfile(data) {
  return [
    '# Student Profile',
    '',
    '## Identity',
    `- **Name:** ${data.name || ''}`,
    `- **What to call them:** ${data.nickname || data.name || ''}`,
    `- **Timezone:** ${data.timezone || ''}`,
    `- **Educational level:** ${data.level || ''}`,
    '',
    '## Learning Style',
    `- **Prefers:** ${data.learningApproach || ''}`,
    `- **Modality:** ${data.modality || ''}`,
    `- **Pace:** ${data.pace || 'steady'}`,
    `- **Depth:** ${data.depth || ''}`,
    '',
    '## Preferences',
    `- **Tone:** ${data.tone || 'casual'}`,
    `- **Session length:** ${data.sessionLength || 'medium'}`,
    '',
    '## Context',
    data.context || '',
  ].join('\n');
}
