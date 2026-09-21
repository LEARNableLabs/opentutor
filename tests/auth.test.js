import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkAuth, authFailure } from '../api/_lib/auth.js';

// Single-user, self-hosted: one shared password, no accounts. The rule that
// matters is that a deployment can never be left open by forgetting to set it.

const req = (headers = {}) => ({ headers });
const bearer = (token) => req({ authorization: `Bearer ${token}` });

beforeEach(() => {
  vi.stubEnv('OPENTUTOR_PASSWORD', '');
  vi.stubEnv('VERCEL', '');
});
afterEach(() => vi.unstubAllEnvs());

describe('when a password is configured', () => {
  beforeEach(() => vi.stubEnv('OPENTUTOR_PASSWORD', 'hunter2'));

  it('accepts the right password', () => {
    expect(checkAuth(bearer('hunter2')).ok).toBe(true);
  });

  it('rejects the wrong one', () => {
    expect(checkAuth(bearer('hunter3')).ok).toBe(false);
  });

  it('rejects a missing header', () => {
    expect(checkAuth(req()).ok).toBe(false);
  });

  it('accepts the x-opentutor-password header too', () => {
    expect(checkAuth(req({ 'x-opentutor-password': 'hunter2' })).ok).toBe(true);
  });

  it('is not fooled by a prefix of the password', () => {
    expect(checkAuth(bearer('hunter')).ok).toBe(false);
  });
});

describe('when no password is configured', () => {
  it('allows local use, so nothing breaks for a developer', () => {
    expect(checkAuth(req()).ok).toBe(true);
  });

  it('refuses to serve a deployment that was left open', () => {
    vi.stubEnv('VERCEL', '1');
    const result = checkAuth(req());
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/OPENTUTOR_PASSWORD/);
  });
});

describe('the failure response', () => {
  it('says what to do without leaking the password', () => {
    vi.stubEnv('OPENTUTOR_PASSWORD', 'hunter2');
    const { status, body } = authFailure(checkAuth(bearer('nope')));
    expect(status).toBe(401);
    expect(JSON.stringify(body)).not.toContain('hunter2');
    expect(body.error).toBeTruthy();
  });

  it('uses 503 for a misconfigured deployment, not 401', () => {
    vi.stubEnv('VERCEL', '1');
    expect(authFailure(checkAuth(req())).status).toBe(503);
  });
});
