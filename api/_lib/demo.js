// The landing page's example lesson (#153): a visitor who is not signed in answers
// the card's question and gets one real reply, on the deployment's key. The route is
// public, so each reply claims its caps before the model is called, one row per unit
// (claimSlot), in the unnamed root store beside the account registry.
import { createHmac, randomBytes } from 'node:crypto';
import { getState, getAdapter } from './init.js';
import { sameOrigin } from '../../lib/core/accounts.js';
import { claimSlot } from '../../lib/core/llm-access.js';
import { buildDemoPrompt } from '../../lib/core/prompts.js';

export const DEMO_PER_IP = 3;
export const DEMO_PER_DAY = 300;
export const DEMO_MAX_CHARS = 300;
const REPLY_MAX_CHARS = 500;
const BUSY = 'The demo is busy right now. Create a free account to try a full lesson.';
// Without a server secret, the key lasts as long as the process: enough for one local server.
const PROCESS_KEY = randomBytes(32);

// The address is stored only as a truncated HMAC, keyed with a server secret and salted
// with the day, so a row can neither be reversed nor linked to the same visitor tomorrow.
function visitor(req, day) {
  const ip =
    String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim() ||
    String(req.headers?.['x-real-ip'] || '').trim() ||
    req.socket?.remoteAddress ||
    '';
  const secret =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPENTUTOR_PASSWORD || PROCESS_KEY;
  return createHmac('sha256', secret).update(`opentutor-demo-ip:${day}:${ip}`).digest('hex').slice(0, 16);
}

// A day's first reply clears earlier days' rows. ISO dates sort in order, so every earlier
// day's keys sort before today's: two bounded deletes, however many rows or days there
// are, and no listing that a capped response could cut short. A sweep that fails is
// caught up by the next one.
async function sweep(store, day) {
  await store.deleteKVBefore('demo:day:', day);
  await store.deleteKVBefore('demo:ip:', day);
}

export function demoHandler({ getStore = getState, host = getAdapter, perIp = DEMO_PER_IP, perDay = DEMO_PER_DAY } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-store');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!sameOrigin(req)) return res.status(403).json({ error: 'Please try the demo on OpenTutor.' });
    try {
      const answer = typeof req.body?.answer === 'string' ? req.body.answer.trim() : '';
      if (!answer || answer.length > DEMO_MAX_CHARS)
        return res.status(400).json({ error: `Write an answer of up to ${DEMO_MAX_CHARS} characters.` });
      const store = await getStore();
      const day = new Date().toISOString().slice(0, 10); // UTC
      const today = `demo:day:${day}:`;
      const busy = () => res.status(429).json({ error: BUSY, signup: true });
      // A full day turns visitors away before they claim anything; the claims enforce both caps.
      if ((await store.listKV(today)).length >= perDay) return busy();
      if (!(await claimSlot(store, `demo:ip:${day}:${visitor(req, day)}:`, perIp))) return busy();
      const slot = await claimSlot(store, today, perDay);
      if (!slot) return busy();
      if (slot === `${today}1`) await sweep(store, day).catch((err) => console.error('[demo] sweep:', err.message));
      // Slots are not refunded: a failed call may still have been billed.
      const { system, model } = buildDemoPrompt();
      const { text } = await host().generate(system, [{ role: 'user', content: answer }], { model, maxTokens: 150, timeout: 30_000 });
      const reply = String(text || '').trim().slice(0, REPLY_MAX_CHARS);
      if (!reply) throw new Error('empty reply');
      return res.status(200).json({ reply });
    } catch (err) {
      console.error('[demo]', err.message);
      return res.status(503).json({ error: 'The tutor is unavailable right now. Please try again later.' });
    }
  };
}
