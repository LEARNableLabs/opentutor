import { buildOnboardingPrompt } from '../lib/core/prompts.js';
import { getState, getAdapter, getSkills } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await authenticateRequest(req, getState);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }

  try {
    const state = await getState(auth.userId);
    const adapter = getAdapter();
    const { message, history } = req.body;

    const user = await state.readUser();
    const { system, model } = buildOnboardingPrompt(getSkills(), user);

    const messages = [...(history || []), { role: 'user', content: message }];
    const response = await adapter.generate(system, messages, { model });

    const topicMatch = response.text.match(/<TOPIC>(.+?)<\/TOPIC>/);
    const cleanText = response.text.replace(/<TOPIC>.+?<\/TOPIC>/g, '').trim();
    const proposedTopic = topicMatch?.[1].trim();
    const confirmedTopic = proposedTopic || null;

    res.status(200).json({
      reply: cleanText,
      confirmedTopic,
      model: response.model,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
