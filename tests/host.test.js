import { it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { parseEnv } from 'util';
import { ensurePasswords } from '../scripts/web/host.js';

// #221: `npm run host` writes the group's passwords with Node, so no shell step can leave them
// empty, print them, or lose them to a missing newline.
let dir, file;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-host-'));
  file = path.join(dir, '.env');
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

const mode = () => fs.statSync(file).mode & 0o777;
const read = () => parseEnv(fs.readFileSync(file, 'utf8'));

it('creates a private .env with two long, different passwords', () => {
  const values = ensurePasswords(file);
  expect(mode()).toBe(0o600);
  expect(values.OPENTUTOR_PASSWORD).toMatch(/^[0-9a-f]{48}$/);
  expect(values.OPENTUTOR_ADMIN_PASSWORD).toMatch(/^[0-9a-f]{48}$/);
  expect(values.OPENTUTOR_PASSWORD).not.toBe(values.OPENTUTOR_ADMIN_PASSWORD);
  expect(read()).toMatchObject(values);
});

it('keeps what .env holds, even without a final newline, and makes it private', () => {
  fs.writeFileSync(file, 'OPENROUTER_API_KEY=sk-or-test', { mode: 0o644 });
  const values = ensurePasswords(file);
  expect(mode()).toBe(0o600);
  expect(read()).toEqual({ OPENROUTER_API_KEY: 'sk-or-test', ...values });
});

it('reuses the passwords on the next run, and leaves the file alone', () => {
  const first = ensurePasswords(file);
  const before = fs.readFileSync(file, 'utf8');
  expect(ensurePasswords(file)).toEqual(first);
  expect(fs.readFileSync(file, 'utf8')).toBe(before);
});

it('replaces an empty password instead of starting the server with it', () => {
  fs.writeFileSync(file, 'OPENTUTOR_PASSWORD=\nOPENTUTOR_ADMIN_PASSWORD=   \n');
  const values = ensurePasswords(file);
  expect(values.OPENTUTOR_PASSWORD).toMatch(/^[0-9a-f]{48}$/);
  expect(values.OPENTUTOR_ADMIN_PASSWORD).toMatch(/^[0-9a-f]{48}$/);
  expect(read()).toMatchObject(values);
  // Replaced, not shadowed: Node's parser does not reliably let a later duplicate win.
  expect(fs.readFileSync(file, 'utf8').match(/^OPENTUTOR_(ADMIN_)?PASSWORD=/gm)).toHaveLength(2);
});

it('refuses one password for both roles', () => {
  fs.writeFileSync(file, 'OPENTUTOR_PASSWORD=same-long-secret\nOPENTUTOR_ADMIN_PASSWORD=same-long-secret\n');
  expect(() => ensurePasswords(file)).toThrow(/must differ/);
});

// Review of #222: Node's parser takes the line after "KEY= " as that key's value.
it('reads its own two lines itself, where Node\'s parser would swallow the next line', () => {
  fs.writeFileSync(file, 'OPENTUTOR_PASSWORD= \nOPENTUTOR_ADMIN_PASSWORD=0123456789abcdef0123\n');
  const values = ensurePasswords(file);
  expect(values.OPENTUTOR_PASSWORD).toMatch(/^[0-9a-f]{48}$/);
  expect(values.OPENTUTOR_ADMIN_PASSWORD).toBe('0123456789abcdef0123');
});

it('refuses a password too short to protect anything, and never starts with "undefined"', () => {
  fs.writeFileSync(file, 'OPENTUTOR_PASSWORD= \nOPENTUTOR_ADMIN_PASSWORD=y\n');
  expect(() => ensurePasswords(file)).toThrow(/at least 16/);
});

it('leaves no temporary file behind', () => {
  fs.writeFileSync(file, 'OPENROUTER_API_KEY=sk-or-test\n');
  ensurePasswords(file);
  expect(fs.readdirSync(dir)).toEqual(['.env']);
});
