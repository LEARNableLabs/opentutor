/**
 * Admin auth for the provisioning routes (#80).
 *
 * Deliberately a second secret. OPENTUTOR_PASSWORD is handed to everyone who is
 * allowed to *learn* on this instance; these routes create students, read across
 * all of them, and delete their data. Reusing the student password would mean
 * every student could decommission every other one.
 *
 * Set OPENTUTOR_ADMIN_PASSWORD and send it as `Authorization: Bearer <password>`
 * (or `x-opentutor-admin-password`).
 *
 * Unlike api/_lib/auth.js, an unset password is never permissive — not even
 * locally. That rule exists because a missing student password on localhost is
 * harmless; a missing admin password would make "delete every student" the
 * default for anything that can reach the port.
 */

import { timingSafeEqual } from 'crypto';

function sameSecret(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function presented(req) {
  const header = req?.headers?.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;
  return bearer || req?.headers?.['x-opentutor-admin-password'] || null;
}

/** Is this request allowed to administer students? Returns { ok, reason }. */
export function checkAdmin(req) {
  const password = process.env.OPENTUTOR_ADMIN_PASSWORD;

  if (!password) {
    return {
      ok: false,
      misconfigured: true,
      reason: 'OPENTUTOR_ADMIN_PASSWORD is not set. Provisioning stays closed until it is.',
    };
  }

  const offered = presented(req);
  if (!offered) return { ok: false, reason: 'Admin password required.' };
  if (!sameSecret(offered, password)) return { ok: false, reason: 'Invalid admin password.' };

  return { ok: true };
}

/** Turn a failed checkAdmin into a response. Never echoes what was presented. */
export function adminFailure(result) {
  return result.misconfigured
    ? { status: 503, body: { error: result.reason } }
    : { status: 401, body: { error: result.reason } };
}
