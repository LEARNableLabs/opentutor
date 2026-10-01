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
  // A request started before midnight may still own yesterday's token. Never
  // sweep a claim: another old-day request could otherwise claim it again.
  try {
    for (const row of await state.listKV(PREFIX)) {
      if (row.key >= key) continue;
      let saved;
      try { saved = typeof row.value === 'string' ? JSON.parse(row.value) : row.value; } catch { continue; }
      if (saved && Object.hasOwn(saved, 'line')) await state.deleteKV(row.key);
    }
  } catch { console.error('[greeting] sweep failed'); }

  let line = null;
  try {
    const profile = await state.readUser();
    const courses = (await whereYouAre(state, await state.readProgress())).map((c) => c.topic);
    const { system, messages } = buildGreetingPrompt({ name: nameOf(profile, account), profile, courses });
    const adapter = await getAdapter();
    line = tidy((await adapter.generate(system, messages, { model: 'cheap', maxTokens: 120 })).text);
  } catch (err) {
    if (err instanceof KeyRequired) {
      await state.deleteKV(key); // no model call was made; connecting a key can try again
      throw err;
    }
    console.error('[greeting] unavailable'); // provider error text may contain a key
  }
  await state.writeKV(key, JSON.stringify({ line }));
  return line;
}

function lineOf(saved) {
  try { return tidy((typeof saved === 'string' ? JSON.parse(saved) : saved)?.line); } catch { return null; } // a claim token
}

// The page shows it as plain text: one line, no wrapping quotes, never an essay.
export function tidy(text) {
  if (typeof text !== 'string') return null;
  const line = text.trim().split('\n')[0].trim().replace(/^["“'](.*)["”']$/, '$1').trim();
  return line && line.length <= 300 && line.split(/\s+/).length <= 30 ? line : null;
}
