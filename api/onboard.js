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
    const availableTopics = await state.listTopics();
    const { system, model } = buildOnboardingPrompt(getSkills(), user, { availableTopics });

    const messages = [...(history || []), { role: 'user', content: message }];
    const response = await adapter.generate(system, messages, { model });

    const topicMatch = response.text.match(/<TOPIC>(.+?)<\/TOPIC>/);
    const cleanText = response.text.replace(/<TOPIC>.+?<\/TOPIC>/g, '').trim();
    const proposedTopic = topicMatch?.[1].trim();
    const confirmedTopic = availableTopics.includes(proposedTopic) ? proposedTopic : null;

    res.status(200).json({
      reply: proposedTopic && !confirmedTopic
        ? 'That topic is not available on this hosted instance. Use Browse available topics to choose a curriculum, or tell me about another subject you are interested in.'
        : cleanText,
      confirmedTopic,
      model: response.model,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
