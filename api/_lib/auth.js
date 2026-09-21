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

/** Constant-time compare that doesn't leak length through early return. */
function sameSecret(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function presentedSecret(req) {
  const header = req?.headers?.authorization || '';
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
