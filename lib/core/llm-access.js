// Which key pays for a student's model calls (#132). Self-signup accounts
// (`acct-…`, a namespace only verified Supabase sessions reach) get a short
// trial on the deployment's key, then connect their own OpenRouter account.
// Everyone else — the owner, and students created in the admin screen — uses
// the deployment's key without limits, as before.
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes, randomUUID } from 'node:crypto';
import { OpenRouterAdapter } from '../adapters/openrouter.js';

const KEY = 'openrouter_key';

function cipherKey() {
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('Storing an OpenRouter key needs the Supabase secret key.');
  return Buffer.from(hkdfSync('sha256', secret, Buffer.alloc(0), 'opentutor/openrouter-key/v1', 32));
}

/** AES-256-GCM, bound to its student: a copy in another student's record will not open. */
export function sealKey(userId, apiKey) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', cipherKey(), iv).setAAD(Buffer.from(userId));
  const sealed = Buffer.concat([cipher.update(apiKey, 'utf8'), cipher.final()]);
  return ['v1', ...[iv, cipher.getAuthTag(), sealed].map((part) => part.toString('base64url'))].join('.');
}

export function openKey(userId, value) {
  try {
    const parts = String(value).split('.');
    if (parts.length !== 4) return null; // exactly 4 parts: version, iv, tag, sealed
    const [version, iv, tag, sealed] = parts;
    if (version !== 'v1') return null;
    const decipher = createDecipheriv('aes-256-gcm', cipherKey(), Buffer.from(iv, 'base64url'), { authTagLength: 16 })
      .setAAD(Buffer.from(userId))
      .setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(sealed, 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    return null; // tampered, moved, or the secret rotated: the student reconnects
  }
}

export async function saveKey(state, apiKey) {
  await state.writeKV(KEY, sealKey(state.userId, apiKey));
}

export async function readKey(state) {
  const value = await state.readKV(KEY);
  return value ? openKey(state.userId, value) : null;
}

export async function deleteKey(state) {
  await state.deleteKV(KEY);
}

/** A sealed key is stored, whether or not it still opens (one that won't open answers `reconnect`). */
export async function hasStoredKey(state) {
  return !!(await state.readKV(KEY));
}

export const TRIAL_LESSONS = 3;
export const ONBOARDING_MESSAGES = 12;
// Answers inside trial lessons: a web lesson has 4 answered steps (STEPS in api/lesson.js).
const TRIAL_TURNS = TRIAL_LESSONS * 4;
// One row per trial unit: `openrouter-trial:lesson:1`… (a hyphen: `_` is a LIKE wildcard in listKV).
const TRIAL = 'openrouter-trial:';
const USES = new Set(['lesson-start', 'lesson-continue', 'onboarding', 'chat', 'custom-topic']);

const MESSAGES = {
  trial_used: `You've used your ${TRIAL_LESSONS} free lessons. Connect your OpenRouter account to keep learning.`,
  custom_topic: 'Creating your own topics needs your OpenRouter account. You can still learn any of the ready-made topics.',
  chat: 'Study Buddy needs your OpenRouter account.',
  onboarding_limit: 'Connect your OpenRouter account to keep chatting, or pick one of the ready-made topics.',
  reconnect: 'OpenRouter rejected your key. Please connect your account again.',
  no_credits: 'Your OpenRouter account is out of credits. Add credits at openrouter.ai, then try again.',
};

/** A student must connect (or fix) their own OpenRouter account. Routes answer 402 with `.body`. */
export class KeyRequired extends Error {
  constructor(reason) {
    super(MESSAGES[reason]);
    this.reason = reason;
  }
  get body() {
    return { error: this.message, connect: true, reason: this.reason };
  }
}

export const isAccount = (state) => typeof state?.userId === 'string' && state.userId.startsWith('acct-');

// A student's key is theirs to fix: OpenRouter's refusals become a prompt,
// never a silent retry on the deployment's key.
class StudentOpenRouterAdapter extends OpenRouterAdapter {
  async generate(...args) {
    try {
      return await super.generate(...args);
    } catch (err) {
      if (err.status === 401) throw new KeyRequired('reconnect');
      if (err.status === 402) throw new KeyRequired('no_credits');
      throw err;
    }
  }
}

// Each unit of a cap is its own row, `<prefix>1`…`<prefix><limit>`, and only one request
// can create a given row (insert-if-absent, then read back who won), so the caps hold
// across concurrent requests and serverless instances without a lock. Returns the key
// claimed, or null when all are taken. The trial and the landing-page demo (#153) use it.
export async function claimSlot(state, prefix, limit) {
  const taken = new Set((await state.listKV(prefix)).map((row) => row.key));
  const token = randomUUID();
  for (let slot = 1; slot <= limit; slot++) {
    const key = prefix + slot;
    if (taken.has(key)) continue;
    await state.insertKV(key, token);
    if ((await state.readKV(key)) === token) return key;
  }
  return null;
}

async function slotsUsed(state, kind) {
  return (await state.listKV(`${TRIAL}${kind}:`)).length;
}

// The deployment's adapter, spending one trial slot on its first call of the request.
// A call the provider refused outright gives the slot back; one that may have been billed keeps it.
function metered(host, state, kind, limit, reason) {
  let slot = null;
  const adapter = Object.create(host);
  adapter.generate = async (...args) => {
    if (!slot) {
      slot = await claimSlot(state, `${TRIAL}${kind}:`, limit);
      if (!slot) throw new KeyRequired(reason);
    }
    try {
      return await host.generate(...args);
    } catch (err) {
      // Give the slot back only when the provider refused outright (an HTTP error status).
      // A timeout or a broken stream may already have been billed, so it keeps the slot.
      if (err.status) {
        await state.deleteKV(slot);
        slot = null;
      }
      throw err;
    }
  };
  return adapter;
}

/**
 * The adapter a student-triggered call runs on. `host` returns the deployment's
 * adapter and is only called when that is the answer. Throws KeyRequired.
 */
export async function adapterFor({ state, use, host }) {
  if (!USES.has(use)) throw new Error(`Unknown model use: ${use}`);
  if (!isAccount(state)) return host();
  const sealed = await state.readKV(KEY);
  if (sealed) {
    const apiKey = openKey(state.userId, sealed);
    // A stored key that no longer opens (tampered, or the secret changed) must not
    // quietly reopen the free trial: the student reconnects.
    if (!apiKey) throw new KeyRequired('reconnect');
    return new StudentOpenRouterAdapter({ apiKey });
  }
  // A lesson in progress finishes on the trial's budget of answers. Metering each
  // answer stops concurrent answers to one step from each calling the model free.
  if (use === 'lesson-continue') {
    if ((await slotsUsed(state, 'turn')) >= TRIAL_TURNS) throw new KeyRequired('trial_used');
    return metered(host(), state, 'turn', TRIAL_TURNS, 'trial_used');
  }
  // The pre-checks answer before any header is written; `metered` enforces the cap.
  if (use === 'lesson-start') {
    if ((await slotsUsed(state, 'lesson')) >= TRIAL_LESSONS) throw new KeyRequired('trial_used');
    return metered(host(), state, 'lesson', TRIAL_LESSONS, 'trial_used');
  }
  if (use === 'onboarding') {
    if ((await slotsUsed(state, 'onboarding')) >= ONBOARDING_MESSAGES) throw new KeyRequired('onboarding_limit');
    return metered(host(), state, 'onboarding', ONBOARDING_MESSAGES, 'onboarding_limit');
  }
  if (use === 'chat') throw new KeyRequired('chat');
  throw new KeyRequired('custom_topic');
}

export async function trialLessonsLeft(state) {
  return Math.max(0, TRIAL_LESSONS - (await slotsUsed(state, 'lesson')));
}

/** One conversational turn from the browser: text of 1 to 4,000 characters, not all blank, else null.
 *  Refused rather than cut, so an answer is never graded on half of what the student wrote,
 *  and a blank one is never a billed model call (#159). */
export const turnText = (text) => (typeof text === 'string' && text.trim() && text.length <= 4000 ? text : null);

/** Onboarding history comes from the browser: keep real turns only, recent and short. */
export function trimHistory(history) {
  return (Array.isArray(history) ? history : [])
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
    .slice(-ONBOARDING_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
}
