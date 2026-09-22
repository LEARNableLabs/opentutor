import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkAdmin, adminFailure } from '../api/_lib/admin-auth.js';

// #80 — provisioning creates and destroys students, so it cannot sit behind the
// same password every student already has. OPENTUTOR_PASSWORD is handed to
// anyone who is allowed to learn; OPENTUTOR_ADMIN_PASSWORD is not.

const req = (secret) => ({ headers: secret ? { authorization: `Bearer ${secret}` } : {} });

beforeEach(() => {
  vi.stubEnv('OPENTUTOR_ADMIN_PASSWORD', 'admin-secret');
  vi.stubEnv('OPENTUTOR_PASSWORD', 'student-secret');
});
afterEach(() => vi.unstubAllEnvs());

describe('admin access', () => {
  it('admits the admin password', () => {
    expect(checkAdmin(req('admin-secret')).ok).toBe(true);
  });

  it('refuses the student password — the whole point of a second secret', () => {
    expect(checkAdmin(req('student-secret')).ok).toBe(false);
  });

  it('refuses a missing or wrong password', () => {
    expect(checkAdmin(req()).ok).toBe(false);
    expect(checkAdmin(req('guess')).ok).toBe(false);
  });

  it('accepts the x-opentutor-admin-password header too', () => {
    expect(checkAdmin({ headers: { 'x-opentutor-admin-password': 'admin-secret' } }).ok).toBe(true);
  });
});

describe('when no admin password is configured', () => {
  beforeEach(() => vi.stubEnv('OPENTUTOR_ADMIN_PASSWORD', ''));

  it('refuses everything — unset must never mean open', () => {
    // auth.js allows an unset student password locally, because localhost has no
    // public URL. Provisioning is different: it destroys other students' data,
    // so there is no environment where "nobody configured it" should mean "let
    // everyone in".
    expect(checkAdmin(req('anything')).ok).toBe(false);
    expect(checkAdmin(req()).ok).toBe(false);
  });

  it('says what to do rather than just failing', () => {
    const { status, body } = adminFailure(checkAdmin(req()));
    expect(status).toBe(503);
    expect(body.error).toMatch(/OPENTUTOR_ADMIN_PASSWORD/);
  });

  it('never falls back to the student password', () => {
    expect(checkAdmin(req('student-secret')).ok).toBe(false);
  });
});

describe('the failure response', () => {
  it('is 401 for a wrong password, not 503', () => {
    expect(adminFailure(checkAdmin(req('wrong'))).status).toBe(401);
  });

  it('does not echo back what was presented', () => {
    const { body } = adminFailure(checkAdmin(req('hunter2')));
    expect(JSON.stringify(body)).not.toContain('hunter2');
  });
});
