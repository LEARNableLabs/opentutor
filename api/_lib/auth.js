/**
 * Shared-password auth for the API routes.
 *
 * OpenTutor is single-user and self-hosted: one password, no accounts. The point
 * is not to model identity, it's to stop a public URL from letting strangers
 * spend your LLM credits — `POST /api/add-topic` alone runs a whole pipeline.
 *
 * Set OPENTUTOR_PASSWORD and send it as `Authorization: Bearer <password>`
 * (or `x-opentutor-password`).
 *
 * Unset, it allows everything — which is what you want on localhost and never
 * what you want on a deployment, so a hosted environment with no password
 * configured is refused outright rather than served wide open.
 */

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

/** Is this request allowed? Returns { ok, reason }. */
export function checkAuth(req) {
  const password = process.env.OPENTUTOR_PASSWORD;

  if (!password) {
    // Vercel sets VERCEL=1 on every deployment.
    if (process.env.VERCEL) {
      return { ok: false, misconfigured: true, reason: 'OPENTUTOR_PASSWORD is not set on this deployment. Set it in the project\'s environment variables and redeploy.' };
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
    : { status: 401, body: { error: result.reason || 'Unauthorized.' } };
}

/** Resolve a credential before choosing the student's store. Never trust a body/header userId. */
export async function authenticateRequest(req, getRootStore) {
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
