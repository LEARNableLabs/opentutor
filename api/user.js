import { getState } from './_lib/init.js';

export default async function handler(req, res) {
  try {
    const state = await getState();

    if (req.method === 'GET') {
      const user = state.readUser();
      const progress = state.readProgress();
      const hasProfile = user.includes('**Name:**') && !user.match(/\*\*Name:\*\*\s*$/m);
      return res.status(200).json({ profile: user, hasProfile, onboarded: progress.active_topics?.length > 0 });
    }

    if (req.method === 'POST') {
      const data = req.body;
      const profile = buildUserProfile(data);
      state.writeUser(profile);
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
