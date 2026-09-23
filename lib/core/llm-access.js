// Which key pays for a student's model calls (#132). Self-signup accounts
// (`acct-…`, a namespace only verified Supabase sessions reach) get a short
// trial on the deployment's key, then connect their own OpenRouter account.
// Everyone else — the owner, and students created in the admin screen — uses
// the deployment's key without limits, as before.
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';

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
    const [version, iv, tag, sealed] = String(value).split('.');
    if (version !== 'v1') return null;
    const decipher = createDecipheriv('aes-256-gcm', cipherKey(), Buffer.from(iv, 'base64url'))
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
