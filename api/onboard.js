import { buildOnboardingPrompt } from '../lib/core/prompts.js';
import { getState, getAdapter, getSkills } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { adapterFor, isAccount, trimHistory, turnText, KeyRequired } from '../lib/core/llm-access.js';

export default async function handler(req, res) {
  res.setHeader?.('Cache-Control','private, no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await authenticateRequest(req, getState);
  if (!auth.ok) {
    const { status, body } = authFailure(auth);
    return res.status(status).json(body);
  }

  try {
    const { message, history } = req.body;
    const text = turnText(message);
    if (text === null) return res.status(400).json({ error: 'A message is required.' });

    const state = await getState(auth.userId);
    const adapter = await adapterFor({ state, use: 'onboarding', host: getAdapter });

    const user = await state.readUser();
    const { system, model } = buildOnboardingPrompt(getSkills(), user);

    const messages = [...(isAccount(state) ? trimHistory(history) : history || []), { role: 'user', content: text }];
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
    if (err instanceof KeyRequired) return res.status(402).json(err.body);
    console.error('[onboard]', err.message);
    res.status(500).json({ error: 'The tutor is unavailable right now. Please try again.' });
  }
}
