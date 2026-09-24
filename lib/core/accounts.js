import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const PREFIX = 'account_student:';
export const accountKey = (id) => PREFIX + id;
export function accountId(user) {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(user?.id || ''))
    throw new Error('Invalid account identity');
  return `acct-${user.id.toLowerCase()}`;
}
export const decodeAccount = (raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw);
export async function ensureAccount(store, user) {
  const id = accountId(user);
  const legacy = decodeAccount(await store.readKV('students')) || [];
  if (Array.isArray(legacy) && legacy.some((s) => s.id === id))
    throw new Error('Account identity conflicts with a legacy student.');
  const record = {
    id,
    name: String(user.user_metadata?.name || user.email || 'Student').slice(0, 120),
    status: 'active',
    provisioned_at: new Date().toISOString(),
  };
  await store.insertKV(accountKey(id), JSON.stringify(record));
  const saved = decodeAccount(await store.readKV(accountKey(id)));
  if (saved?.status !== 'active') throw new Error('Account access has been disabled.');
  return saved;
}
export async function listAccounts(store) {
  if (!store.listKV) return [];
  return (await store.listKV(PREFIX))
    .map(({ value }) => decodeAccount(value))
    .filter((s) => s?.status === 'active');
}

const ACCESS = 'ot_access',
  REFRESH = 'ot_refresh',
  VERIFIER = 'ot_verifier';
export function cookies(req) {
  const out = {};
  for (const part of (req.headers?.cookie || '').split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    try {
      out[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1));
    } catch {
      /* ignore malformed cookies */
    }
  }
  return out;
}
export function originFor(req) {
  if (process.env.OPENTUTOR_PUBLIC_URL) return new URL(process.env.OPENTUTOR_PUBLIC_URL).origin;
  const host = req.headers?.host;
  if (!host || !/^[a-z0-9.:[\]-]+(?::\d+)?$/i.test(host)) throw new Error('Invalid request host');
  return `${process.env.VERCEL || req.socket?.encrypted ? 'https' : 'http'}://${host}`;
}
export function sameOrigin(req) {
  try {
    return typeof req.headers?.origin === 'string' && req.headers.origin === originFor(req);
  } catch {
    return false;
  }
}
export function setCookie(req, res, name, value, maxAge) {
  const secure =
    process.env.VERCEL ||
    req.socket?.encrypted ||
    process.env.OPENTUTOR_PUBLIC_URL?.startsWith('https:');
  const valueString = `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
  const existing = res.getHeader?.('Set-Cookie') || [];
  res.setHeader('Set-Cookie', [...(Array.isArray(existing) ? existing : [existing]), valueString]);
}
export function setSession(req, res, session) {
  setCookie(req, res, ACCESS, session.access_token, session.expires_in || 3600);
  setCookie(req, res, REFRESH, session.refresh_token, 60 * 60 * 24 * 30);
}
export function clearSession(req, res) {
  for (const name of [ACCESS, REFRESH, VERIFIER, 'ot_flow', 'ot_recovery'])
    setCookie(req, res, name, '', 0);
}
export const accessToken = (req) => cookies(req)[ACCESS];
export const refreshToken = (req) => cookies(req)[REFRESH];
export function accountsConfigured() {
  return !!(
    process.env.SUPABASE_URL &&
    (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}
// Never share this client: auth methods mutate client session state. The data
// store uses its own service client and never inherits a student's JWT.
export function createAccountClient(req, res) {
  if (!accountsConfigured()) throw new Error('Accounts are not configured on this installation.');
  const values = new Map();
  const storage = {
    getItem(key) {
      return key.endsWith('-code-verifier')
        ? cookies(req)[VERIFIER] || null
        : values.get(key) || null;
    },
    setItem(key, value) {
      if (key.endsWith('-code-verifier')) {
        setCookie(req, res, VERIFIER, value, 3600);
        setCookie(
          req,
          res,
          'ot_flow',
          signFlow(
            {
              intent: req.body?.action === 'forgot' ? 'recovery' : 'signup',
              verifier: hash(value),
            },
            3600,
          ),
          3600,
        );
      } else values.set(key, value);
    },
    removeItem(key) {
      if (key.endsWith('-code-verifier')) setCookie(req, res, VERIFIER, '', 0);
      else values.delete(key);
    },
  };
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storage,
      },
    },
  );
}
export async function verifyAccountRequest(req, store, client) {
  const token = accessToken(req);
  if (!token) return null;
  const { data, error } = await client.auth.getUser(token);
  if (error && !(error.status >= 400 && error.status < 500))
    throw new Error(`Supabase unavailable: ${error.message}`);
  if (error || !data.user?.email_confirmed_at) return null;
  const id = accountId(data.user),
    student = decodeAccount(await store.readKV(accountKey(id)));
  return student?.status === 'active' ? { id, email: data.user.email, name: student.name } : null;
}

const hash = (value) =>
  createHash('sha256')
    .update(value || '')
    .digest('hex');
const signature = (value) =>
  createHmac('sha256', process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
    .update('opentutor-account-flow:' + value)
    .digest('base64url');
export function signFlow(data, seconds = 600) {
  const body = Buffer.from(
    JSON.stringify({ ...data, expires: Date.now() + seconds * 1000 }),
  ).toString('base64url');
  return `${body}.${signature(body)}`;
}
export function readFlow(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  const [body, sig] = value.split('.');
  if (!body || !sig) return null;
  const expected = signature(body);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
    return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString());
    return data.expires > Date.now() ? data : null;
  } catch {
    return null;
  }
}
export function recoveryCallback(req) {
  const jar = cookies(req),
    flow = readFlow(jar.ot_flow);
  return flow?.intent === 'recovery' && flow.verifier === hash(jar.ot_verifier);
}
export function grantRecovery(req, res, user, session) {
  setCookie(
    req,
    res,
    'ot_recovery',
    signFlow({ id: accountId(user), access: hash(session.access_token) }),
    600,
  );
}
export function canReset(req, user) {
  const grant = readFlow(cookies(req).ot_recovery);
  return grant?.id === user?.id && grant.access === hash(accessToken(req));
}
