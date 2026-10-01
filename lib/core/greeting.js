// #279: one personal line under "Welcome back, <name>.", made at most once a day per student.
import { randomUUID } from 'node:crypto';
import { buildGreetingPrompt } from './prompts.js';
import { KeyRequired } from './llm-access.js';
import { nameOf, whereYouAre } from './welcome.js';

const PREFIX = 'greeting:'; // greeting:<day>: a claim token while it is being written, then { line }

/**
 * Today's line for this student, or null. The first request of the day claims the day's row, so
 * two tabs (or a script) make one model call between them; a failed call is not retried that day.
 */
export async function dailyGreeting({ state, account, getAdapter, today = new Date().toISOString().slice(0, 10) }) {
  const key = PREFIX + today;
  const saved = await state.readKV(key);
  if (saved != null) return lineOf(saved); // today's line, or another request is writing it
  const token = randomUUID();
  await state.insertKV(key, token);
  if ((await state.readKV(key)) !== token) return null;
  try { await state.deleteKVBefore(PREFIX, today); } catch (err) { console.error('[greeting] sweep failed:', err.message); }

  let line = null;
  try {
    const profile = await state.readUser();
    const courses = (await whereYouAre(state, await state.readProgress())).map((c) => c.topic);
    const { system, messages } = buildGreetingPrompt({ name: nameOf(profile, account), profile, courses });
    const adapter = await getAdapter();
    line = tidy((await adapter.generate(system, messages, { model: 'cheap' })).text);
  } catch (err) {
    if (!(err instanceof KeyRequired)) console.error('[greeting]', err.message);
  }
  await state.writeKV(key, JSON.stringify({ line }));
  return line;
}

function lineOf(saved) {
  try { return (typeof saved === 'string' ? JSON.parse(saved) : saved)?.line ?? null; } catch { return null; } // a claim token
}

// The page shows it as plain text: one line, no wrapping quotes, never an essay.
export function tidy(text) {
  const line = String(text || '').trim().split('\n')[0].trim().replace(/^["“'](.*)["”']$/, '$1').trim();
  return line && line.length <= 300 ? line : null;
}
