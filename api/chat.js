import { getState, getAdapter } from './_lib/init.js';
import { readsJson } from './_lib/body.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { adapterFor, turnText, KeyRequired } from '../lib/core/llm-access.js';
import { VOICE, FORMAT, LINKS, SOURCES } from '../lib/core/prompts.js';
import { keepTrustedLinks, keepVerifiedSources, withoutSources } from '../lib/core/links.js';
import { publicCatalog } from '../lib/core/catalog.js';
import { courseFor } from './onboard.js';

// #273, #275: a reply can offer one course. Only a single marker at the very end of the reply is an offer: an
// echo of the student's text, a nested marker or two of them are none. No marker ever reaches the student.
const OFFER = /<\s*COURSE\s*>([^<>]{1,80})<\s*\/\s*COURSE\s*>\s*$/i;
const OPENING = /<\s*COURSE\s*>/gi;
function withoutMarkers(text) {
  let out = text;
  for (let prev; prev !== out; ) { prev = out; out = out.replace(/<\s*COURSE\s*>[^<>]*<\s*\/\s*COURSE\s*>/gi, ''); }
  return out.replace(/<\s*\/?\s*COURSE\s*>/gi, '').trim();
}

// The subject names a ready-made course exactly (the match onboarding uses), or through a known qualifier
// alone: "game theory basics", "intro to game theory". Any other extra word makes it a new subject, so
// "architecture decision records" is never Architecture.
let catalog; // shipped courses don't change while the process runs
const norm = (text) => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const BEFORE = ['an-introduction-to', 'introduction-to', 'intro-to', 'the-basics-of', 'basics-of', 'fundamentals-of'];
const AFTER = ['basics', 'fundamentals', 'essentials', 'for-beginners', 'from-scratch', 'from-the-ground-up', '101', 'crash-course', 'made-simple'];
function core(named) {
  let subject = norm(named);
  const before = BEFORE.find((q) => subject.startsWith(`${q}-`));
  if (before) subject = subject.slice(before.length + 1);
  const after = AFTER.find((q) => subject.endsWith(`-${q}`));
  if (after) subject = subject.slice(0, -(after.length + 1));
  return subject;
}
function offeredCourse(text) {
  if ((text.match(OPENING) || []).length !== 1) return null;
  if (!withoutMarkers(text)) return null; // a marker-only echo is not a conversational offer
  const named = text.match(OFFER)?.[1].replace(/\s+/g, ' ').trim();
  if (!named) return null;
  catalog ||= publicCatalog();
  const slugs = catalog.map((c) => c.slug);
  const slug = courseFor(named, slugs) || courseFor(core(named), slugs);
  return { topic: slug ? catalog.find((c) => c.slug === slug).topic : named, slug };
}

export async function chatTurn({ state, getAdapter }, { message } = {}) {
  const text = turnText(message);
  if (text === null) return { status: 400, body: { error: 'A message of 1 to 4,000 characters is required.' } };
  const adapter = await getAdapter();

  const user = await state.readUser();
  const system = [
    '## OpenTutor\n\nYou are OpenTutor, a warm, sharp tutor. Be concise. 1-3 sentences for simple questions.',
    VOICE,
    '## Courses\n\nWhen the student asks to learn a subject or be taught it (\"teach me…\", \"I want to learn…\", \"how do I get good at…\"), answer briefly, then offer a course: end your reply with <COURSE>the subject alone</COURSE> on its own line, e.g. <COURSE>game theory</COURSE>, with no words like \"basics\" or \"from scratch\". At most one, and never for a quick question. The page turns it into a button; never mention the marker.',
    FORMAT,
    LINKS,
    SOURCES,
    user ? `## Student\n\n${user}` : '',
  ].filter(Boolean).join('\n\n---\n\n');

  const response = await adapter.generate(
    system + '\n\nReturn only polished text.',
    [{ role: 'user', content: text }],
    { model: 'cheap' },
  );
  const course = (text.match(OPENING) || []).length ? null : offeredCourse(withoutSources(response.text));
  const reply = keepTrustedLinks(await keepVerifiedSources(withoutMarkers(response.text))) || 'What would you like to learn?';
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
