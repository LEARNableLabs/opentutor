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
    const state = await getState(auth.userId);
    const ctx = { state, skills: getSkills(), getAdapter: () => adapterFor({ state, use: 'onboarding', host: getAdapter }) };
    const { status, body } = await onboardTurn(ctx, req.body || {});
    res.status(status).json(body);
  } catch (err) {
    if (err instanceof KeyRequired) return res.status(402).json(err.body);
    console.error('[onboard]', err.message);
    res.status(500).json({ error: 'The tutor is unavailable right now. Please try again.' });
  }
}

/**
 * One turn of web onboarding. Shared by this route and the local server
 * (scripts/web/server.js), the way lessonTurn is. `getAdapter` is called after
 * the message is checked, so a bad message is a 400 before any key is chosen.
 */
export async function onboardTurn({ state, skills, getAdapter }, { message, history }) {
  const text = turnText(message);
  if (text === null) return { status: 400, body: { error: 'A message of at most 4,000 characters is required.' } };
  const adapter = await getAdapter();

  const user = await state.readUser();
  const { system, model } = buildOnboardingPrompt(skills, user);
  const messages = [...(isAccount(state) ? trimHistory(history) : history || []), { role: 'user', content: text }];
  const response = await adapter.generate(system, messages, { model });

  const confirmedTopic = response.text.match(/<TOPIC>(.+?)<\/TOPIC>/)?.[1].trim() || null;
  if (confirmedTopic) await keepOwnWords(state, messages);
  return {
    status: 200,
    body: { reply: response.text.replace(/<TOPIC>.+?<\/TOPIC>/g, '').trim(), confirmedTopic, model: response.model },
  };
}

// #155: onboarding used to drop everything the student said. A student without a
// profile keeps their own answers as one, stored as written and never interpreted.
async function keepOwnWords(state, messages) {
  try {
    // Read again, not the copy from before the model call: another tab may have saved one since.
    if (hasContent(await state.readUser())) return; // never overwrite a profile with content
    const said = messages
      .filter((m) => m?.role === 'user' && typeof m.content === 'string')
      .map((m) => `- ${m.content.replace(/\s+/g, ' ').trim().slice(0, 500)}`);
    const profile = ['# Student Profile', '', '## In their own words (from onboarding)', ...said].join('\n');
    // A cut can split an emoji; Postgres JSONB refuses the lone half.
    await state.writeUser(profile.slice(0, 3000).toWellFormed());
  } catch (err) {
    console.error('[onboard] profile not saved:', err.message);
  }
}

// The USER.md template is headings, `**Field:**` labels and `_(hints)_`: none of it is content.
const hasContent = (profile) => /[^\s-]/.test(String(profile ?? '')
  .replace(/^#.*$/gm, '')
  .replace(/\*\*[^*\n]*:\*\*/g, '')
  .replace(/_\([^\n]*?\)_/g, ''));
