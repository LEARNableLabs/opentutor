import { getState, getAdapter } from './_lib/init.js';
import { readsJson } from './_lib/body.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { adapterFor, turnText, KeyRequired } from '../lib/core/llm-access.js';
import { VOICE } from '../lib/core/prompts.js';
import { publicCatalog } from '../lib/core/catalog.js';
import { courseFor } from './onboard.js';

// #273: a reply can offer one course. The marker never reaches the student; the subject is matched to a
// ready-made course when there is one (the matching onboarding uses), and is a new topic otherwise.
const COURSE = /<\s*COURSE\s*>([^<>]{1,80})<\s*\/\s*COURSE\s*>/i;
let catalog; // shipped courses don't change while the process runs
const norm = (text) => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
function offeredCourse(text) {
  const named = text.match(COURSE)?.[1].replace(/\s+/g, ' ').trim();
  if (!named) return null;
  catalog ||= publicCatalog();
  // The exact match onboarding uses first. Then, since this is only an offer the student still taps, the
  // ready-made course whose title starts the subject ("Game theory from scratch" is Game Theory): the
  // longest such title, whole words only, so "Gamebook writing" is never Game Theory.
  const wanted = norm(named);
  const slug = courseFor(named, catalog.map((c) => c.slug)) || catalog
    .map((c) => ({ slug: c.slug, title: norm(c.topic.split(/\s+[—–-]\s+/)[0]) }))
    .filter(({ title }) => title && wanted.startsWith(`${title}-`))
    .sort((a, b) => b.title.length - a.title.length)[0]?.slug || null;
  return { topic: slug ? catalog.find((c) => c.slug === slug).topic : named, slug };
}

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
    '## Courses\n\nWhen the student asks to learn a subject or be taught it (\"teach me…\", \"I want to learn…\", \"how do I get good at…\"), answer briefly, then offer a course: end your reply with <COURSE>the subject alone</COURSE> on its own line, e.g. <COURSE>game theory</COURSE>, with no words like \"basics\" or \"from scratch\". At most one, and never for a quick question. The page turns it into a button; never mention the marker.',
    user ? `## Student\n\n${user}` : '',
  ].filter(Boolean).join('\n\n---\n\n');

  const response = await adapter.generate(
    system + '\n\nReturn only polished text.',
    [{ role: 'user', content: text }],
    { model: 'cheap' },
  );
  const course = offeredCourse(response.text);
  const reply = response.text.replace(COURSE, '').replace(/<\s*\/?\s*COURSE\s*>/gi, '').trim();
  return { status: 200, body: { reply, model: response.model, ...(course && { course }) } };
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
