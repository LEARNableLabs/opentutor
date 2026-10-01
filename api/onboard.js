import { buildOnboardingPrompt } from '../lib/core/prompts.js';
import { publicCatalog } from '../lib/core/catalog.js';
import { getState, getAdapter, getSkills } from './_lib/init.js';
import { readsJson } from './_lib/body.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { adapterFor, canCreateTopics, isAccount, trimHistory, turnText, KeyRequired } from '../lib/core/llm-access.js';

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
  if (text === null) return { status: 400, body: { error: 'A message of 1 to 4,000 characters is required.' } };
  const adapter = await getAdapter();

  const user = await state.readUser();
  // #223: the ready-made courses come first, and only a student who can have a topic built may
  // leave the list. Onboarding once confirmed any phrase, so a trial account's first step after
  // it was "connect OpenRouter".
  const availableTopics = await state.listTopics();
  const customTopics = await canCreateTopics(state);
  const { system, model } = buildOnboardingPrompt(skills, user, { availableTopics, customTopics });
  const messages = [...(isAccount(state) ? trimHistory(history) : history || []), { role: 'user', content: text }];
  const response = await adapter.generate(system, messages, { model });

  // A marker's value holds no '<' or '>', so a doubled or broken marker can't smuggle one through;
  // spaces inside the tags are the model's slip, not a reason to show them.
  const named = response.text.match(/<\s*TOPIC\s*>([^<>]*)<\s*\/\s*TOPIC\s*>/i)?.[1].trim() || null;
  const confirmedTopic = named && (courseFor(named, availableTopics) || (customTopics ? named : null));
  let reply = response.text.replace(/<\s*TOPIC\s*>[^<>]*<\s*\/\s*TOPIC\s*>/gi, '').replace(/<\s*\/?\s*TOPIC\s*>/gi, '').trim();
  const ask = 'What would you like to learn? Tell me in a few words, or browse the ready-made topics.';
  // A marker that confirmed nothing (refused, empty or broken) leaves words that may promise a
  // course that isn't coming, so they are replaced, not added to.
  if (!confirmedTopic && /<\s*\/?\s*TOPIC\s*>/i.test(response.text)) {
    reply = named ? "That one isn't a ready-made course yet. Pick one of the ready-made topics, or connect your OpenRouter account to have your own built." : ask;
  } else if (!reply) reply = confirmedTopic ? `Good choice: ${confirmedTopic.replace(/-/g, ' ')}. Your first lesson is ready.` : ask;
  // The model gets the trimmed history; the profile gets what the student said from the
  // start, so a name given in the first answer survives a long conversation.
  if (confirmedTopic) await keepOwnWords(state, [...(Array.isArray(history) ? history : []), { role: 'user', content: text }]);
  return { status: 200, body: { reply, confirmedTopic, model: response.model } };
}

const norm = (text) => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
let titles; // shipped course titles by slug; they don't change while the process runs

// A course named by its slug, its title ("Night sky photography — astrophotography techniques"),
// or the part of its title before a dash ("Night sky photography") is that course. Nothing that
// only starts like one is: "Game Theory Advanced" is not "Game Theory". A slug is looked for first,
// so a student's own "night-sky-photography" is never taken for another course's title.
export function courseFor(name, topics) {
  titles ||= new Map(publicCatalog().map((course) => [course.slug, course.topic]));
  const wanted = norm(name);
  return topics.find((slug) => slug === name || slug === wanted) || topics.find((slug) => {
    const title = titles.get(slug);
    return Boolean(title) && (norm(title) === wanted || norm(title.split(/\s+[—–-]\s+/)[0]) === wanted);
  }) || null;
}

// #155: onboarding used to drop everything the student said. A student without a
// profile keeps their own answers as one, stored as written and never interpreted.
async function keepOwnWords(state, messages) {
  try {
    // Read again, not the copy from before the model call: another tab may have saved one since.
    if (hasContent(await state.readUser())) return; // never overwrite a profile with content
    const said = messages
      .filter((m) => m?.role === 'user' && typeof m.content === 'string')
      .slice(0, 20) // earliest first; the 3,000-character cap below keeps the first few anyway
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
