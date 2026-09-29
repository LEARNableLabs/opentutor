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

// #221: without a password, only a direct connection from this computer gets in.
describe('without a password, from anywhere but this computer', () => {
  const from = (remoteAddress, headers = {}) => ({ headers: { host: 'localhost:3000', ...headers }, socket: { remoteAddress } });

  it.each([
    ['IPv4 loopback', from('127.0.0.1')],
    ['IPv6 loopback', from('::1', { host: '[::1]:3000' })],
    ['IPv4-mapped loopback', from('::ffff:127.0.0.1', { host: '127.0.0.1:3000' })],
  ])('lets in a direct connection over %s', (_name, r) => {
    expect(checkAuth(r).ok).toBe(true);
  });

  it.each([
    ['another computer', from('192.168.1.20', { host: '192.168.1.5:3000' })],
    ['another computer that says localhost', from('192.168.1.20')],
    ['a proxy on this computer (X-Forwarded-For)', from('127.0.0.1', { 'x-forwarded-for': '203.0.113.7' })],
    ['a proxy that sets Forwarded', from('127.0.0.1', { forwarded: 'for=203.0.113.7' })],
    ['a proxy that sets X-Real-IP', from('127.0.0.1', { 'x-real-ip': '203.0.113.7' })],
    ['a public host name', from('127.0.0.1', { host: 'tutor.example.org' })],
  ])('refuses %s with a 403 that says what to set', (_name, r) => {
    const result = checkAuth(r);
    expect(result.ok).toBe(false);
    const { status, body } = authFailure(result);
    expect(status).toBe(403);
    expect(body.error).toMatch(/OPENTUTOR_PASSWORD/);
  });

  it('checks the password as usual once one is set', () => {
    vi.stubEnv('OPENTUTOR_PASSWORD', 'hunter2');
    const proxied = { headers: { authorization: 'Bearer hunter2', host: 'tutor.example.org', 'x-forwarded-for': '203.0.113.7' }, socket: { remoteAddress: '127.0.0.1' } };
    expect(checkAuth(proxied).ok).toBe(true);
  });
});

// Review of #222: other spellings of this computer, and a browser page served from elsewhere.
describe('without a password, how this computer is recognised', () => {
  const from = (remoteAddress, headers = {}) => ({ headers: { host: 'localhost:3000', ...headers }, socket: { remoteAddress } });

  it.each([
    ['a long-form IPv6 loopback Host', from('::1', { host: '[0:0:0:0:0:0:0:1]:3000' })],
    ['a fully qualified localhost', from('127.0.0.1', { host: 'localhost.:3000' })],
    ['a page on this computer', from('127.0.0.1', { origin: 'http://localhost:3000', referer: 'http://localhost:3000/learn.html' })],
  ])('lets in %s', (_name, r) => {
    expect(checkAuth(r).ok).toBe(true);
  });

  // A proxy on this computer can forward with Host: localhost and no X-Forwarded-*, as nginx does
  // by default, but the browser still names the public page it is on.
  it.each([
    ['a page served from a public site (Referer)', from('127.0.0.1', { referer: 'https://tutor.example.org/learn.html' })],
    ['a page served from a public site (Origin)', from('127.0.0.1', { origin: 'https://tutor.example.org' })],
  ])('refuses %s', (_name, r) => {
    expect(authFailure(checkAuth(r)).status).toBe(403);
  });
});

it('refuses an opaque Origin ("null"), as a sandboxed page sends (review of #222)', () => {
  vi.stubEnv('OPENTUTOR_PASSWORD', '');
  const r = { headers: { host: 'localhost:3000', origin: 'null' }, socket: { remoteAddress: '127.0.0.1' } };
  expect(authFailure(checkAuth(r)).status).toBe(403);
});
