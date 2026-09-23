// Which key pays for a student's model calls (#132). Self-signup accounts
// (`acct-…`, a namespace only verified Supabase sessions reach) get a short
// trial on the deployment's key, then connect their own OpenRouter account.
// Everyone else — the owner, and students created in the admin screen — uses
// the deployment's key without limits, as before.
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';
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

export const TRIAL_LESSONS = 3;
export const ONBOARDING_MESSAGES = 12;
const TRIAL = 'openrouter_trial';

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

async function readTrial(state) {
  const raw = await state.readKV(TRIAL);
  return { lessons: 0, onboarding: 0, ...(typeof raw === 'string' ? JSON.parse(raw) : raw) };
}

// ponytail: read-modify-write, so two requests at the same instant can each pass the
// check and yield one extra free lesson or message. Cheaper to accept than to lock.
async function bump(state, field) {
  const trial = await readTrial(state);
  trial[field] += 1;
  await state.writeKV(TRIAL, JSON.stringify(trial));
}

/**
 * The adapter a student-triggered call runs on. `host` returns the deployment's
 * adapter and is only called when that is the answer. Throws KeyRequired.
 */
export async function adapterFor({ state, use, host }) {
  if (!isAccount(state)) return host();
  const apiKey = await readKey(state);
  if (apiKey) return new StudentOpenRouterAdapter({ apiKey });
  // A lesson in progress always finishes. That includes one started on the
  // student's own key before they disconnected: at most one per topic, accepted.
  if (use === 'lesson-continue') return host();
  if (use === 'lesson-start') {
    if ((await readTrial(state)).lessons < TRIAL_LESSONS) return host();
    throw new KeyRequired('trial_used');
  }
  if (use === 'onboarding') {
    if ((await readTrial(state)).onboarding >= ONBOARDING_MESSAGES) throw new KeyRequired('onboarding_limit');
    await bump(state, 'onboarding');
    return host();
  }
  if (use === 'chat') throw new KeyRequired('chat');
  if (use === 'custom-topic') throw new KeyRequired('custom_topic');
  throw new Error(`Unknown model use: ${use}`);
}

/** Called once a new lesson exists, so a failed start never costs a free lesson. */
export async function countTrialLesson(state) {
  if (isAccount(state) && !(await readKey(state))) await bump(state, 'lessons');
}

export async function trialLessonsLeft(state) {
  return Math.max(0, TRIAL_LESSONS - (await readTrial(state)).lessons);
}

/** Onboarding history comes from the browser: keep real turns only, recent and short. */
export function trimHistory(history) {
  return (Array.isArray(history) ? history : [])
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
    .slice(-ONBOARDING_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
}
