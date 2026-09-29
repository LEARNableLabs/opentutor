// Legacy credentials and verified account sessions share the same scoped-store boundary.
import { accessToken, refreshToken, cookies, sameOrigin, createAccountClient, verifyAccountRequest, accountsConfigured } from '../../lib/core/accounts.js';
import { timingSafeEqual } from 'crypto';
import { authenticateStudent } from '../../lib/core/student-auth.js';

/** Constant-time compare that doesn't leak length through early return. */
function sameSecret(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function presentedSecret(req) {
  const raw = req?.headers?.authorization;
  const header = typeof raw === 'string' ? raw : '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;
  return bearer || req?.headers?.['x-opentutor-password'] || null;
}

const FORWARDING_HEADERS = ['x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'forwarded', 'x-real-ip'];

/** A host name in canonical form ('localhost', '127.0.0.1', '[::1]'), or '' if it isn't one. */
function hostnameOf(value) {
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `http://${value}`);
    return url.hostname.replace(/\.$/, ''); // 'localhost.' names the same host
  } catch {
    return '';
  }
}

// URL() lowercases, expands IPv4 shorthand, and compresses IPv6 ('[0:…:1]' is '[::1]'; the
// mapped '[::ffff:127.0.0.1]' is '[::ffff:7f00:1]').
const isLoopbackName = (name) => name === 'localhost' || name === '[::1]'
  || /^127(\.\d{1,3}){3}$/.test(name) || /^\[::ffff:7f[0-9a-f]{2}:[0-9a-f]{1,4}\]$/.test(name);

/**
 * Did this request come straight from this computer (#221)? Only then may a server without a
 * password answer it: a loopback address and Host, no proxy header, and no browser page from
 * another site. The page check catches a proxy that hides itself (nginx's defaults send Host:
 * localhost and no X-Forwarded-*), because the browser still names the public page it is on.
 * This is a guard against a mistaken setup, not a lock: a client that fakes every header through
 * such a proxy isn't a browser this can see. The password is the lock, and `npm run host` sets it.
 * A request with no socket is an in-process call, not a network request, so it counts as local.
 */
function fromThisComputer(req) {
  const headers = req?.headers || {};
  if (FORWARDING_HEADERS.some((name) => headers[name])) return false;
  for (const name of ['origin', 'referer']) {
    const value = headers[name];
    if (value && !isLoopbackName(hostnameOf(value))) return false; // 'null' (a sandboxed page) too
  }
  if (headers.host && !isLoopbackName(hostnameOf(headers.host))) return false;
  const address = req?.socket?.remoteAddress;
  return address === undefined || address === '::1' || /^(::ffff:)?127\./.test(address);
}

/** Is this request allowed? Returns { ok, reason }. */
export function checkAuth(req) {
  const password = process.env.OPENTUTOR_PASSWORD;

  if (!password) {
    // Vercel sets VERCEL=1 on every deployment.
    if (process.env.VERCEL) {
      return { ok: false, misconfigured: true, reason: 'OPENTUTOR_PASSWORD is not set on this deployment. Set it in the project\'s environment variables and redeploy.' };
    }
    // With accounts on, the install is public: only a verified session or credential gets in.
    if (accountsConfigured()) return { ok: false, reason: 'Please sign in.' };
    // Without a password the server is one person's, on their own computer (#221).
    if (!fromThisComputer(req)) {
      return { ok: false, forbidden: true, reason: 'This OpenTutor has no password, so it only answers the computer it runs on. Set OPENTUTOR_PASSWORD (or start it with `npm run host`) to use it from anywhere else.' };
    }
    return { ok: true };
  }

  const presented = presentedSecret(req);
  if (!presented) return { ok: false, reason: 'Password required.' };
  if (!sameSecret(presented, password)) return { ok: false, reason: 'Incorrect password.' };
  return { ok: true };
}

/** The response to send when checkAuth fails. */
export function authFailure(result) {
  return result.misconfigured
    ? { status: 503, body: { error: result.reason } }
    : { status: result.forbidden ? 403 : 401, body: { error: result.reason || 'Unauthorized.' } };
}

/** Resolve a credential before choosing the student's store. Never trust a body/header userId. */
export async function authenticateRequest(req, getRootStore) {
  const accountCookie=accessToken(req)||refreshToken(req), legacyCookie=cookies(req).ot_legacy;
  if((accountCookie||legacyCookie) && !['GET','HEAD'].includes(req.method||'GET') && !sameOrigin(req))return {ok:false,forbidden:true,reason:'Request origin is not allowed.'};
  // Account cookies take precedence over stale legacy headers; invalid account
  // sessions never fall back to unnamed/root access.
  if(accountCookie) {
    try {
      const account=await verifyAccountRequest(req,await getRootStore(),createAccountClient(req,{setHeader(){},getHeader(){}}));
      return account?{ok:true,userId:account.id,account}:{ok:false,reason:'Please sign in again.'};
    } catch {return {ok:false,misconfigured:true,reason:'Sign-in is temporarily unavailable.'};}
  }
  if(legacyCookie)req={...req,headers:{...req.headers,authorization:`Bearer ${legacyCookie}`}};
  const token = presentedSecret(req);
  if (typeof token === 'string' && process.env.OPENTUTOR_PASSWORD && sameSecret(token, process.env.OPENTUTOR_PASSWORD)) {
    return { ok: true, userId: null };
  }
  if (typeof token === 'string' && token.startsWith('otst_')) {
    try {
      const student = await authenticateStudent(await getRootStore(), token);
      return student ? { ok: true, userId: student.id } : { ok: false, reason: 'Invalid or revoked student token.' };
    } catch (err) {
      console.error('[auth] Student credential lookup failed:', err.message);
      return { ok: false, misconfigured: true, reason: 'Sign-in is temporarily unavailable.' };
    }
  }
  // A supplied invalid credential must not silently fall back to anonymous local use.
  if (token && !process.env.OPENTUTOR_PASSWORD) return { ok: false, reason: 'Invalid credential.' };
  const result = checkAuth(req);
  return result.ok ? { ...result, userId: null } : result;
}
