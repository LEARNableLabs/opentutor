import { it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { pathToFileURL } from 'url';
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

// Review of #222: a comment or quotes around a password must never become the password.
it.each([
  ['a comment after empty quotes', 'OPENTUTOR_PASSWORD="" # generate a learner password\nOPENTUTOR_ADMIN_PASSWORD="" # and an admin one\n'],
  ['a quoted password with a comment', 'OPENTUTOR_PASSWORD="abcdefghijklmnop" # note\nOPENTUTOR_ADMIN_PASSWORD=0123456789abcdef0123\n'],
  ['a password with a space', 'OPENTUTOR_PASSWORD=correct horse battery staple\nOPENTUTOR_ADMIN_PASSWORD=0123456789abcdef0123\n'],
])('refuses %s, and says how to write it', (_case, text) => {
  fs.writeFileSync(file, text);
  expect(() => ensurePasswords(file)).toThrow(/quotes, spaces, a comment/);
});

it('generates a password for empty quotes', () => {
  fs.writeFileSync(file, "OPENTUTOR_PASSWORD=\"\"\nOPENTUTOR_ADMIN_PASSWORD=''\n");
  const values = ensurePasswords(file);
  expect(values.OPENTUTOR_PASSWORD).toMatch(/^[0-9a-f]{48}$/);
  expect(values.OPENTUTOR_ADMIN_PASSWORD).toMatch(/^[0-9a-f]{48}$/);
});

// Review of #222: the environment cuts a value at a NUL, so "a\0…" would really be the password "a".
it('refuses a password with a control character', () => {
  fs.writeFileSync(file, `OPENTUTOR_PASSWORD=a${'\0'}xxxxxxxxxxxxxxxxx\nOPENTUTOR_ADMIN_PASSWORD=0123456789abcdef0123\n`);
  expect(() => ensurePasswords(file)).toThrow(/control character/);
});

// Review of #222: a browser can't put "Ā" (U+0100) in a header, so the admin page could never sign in.
it('refuses a password a browser cannot send', () => {
  fs.writeFileSync(file, `OPENTUTOR_PASSWORD=0123456789abcdef0123\nOPENTUTOR_ADMIN_PASSWORD=${'Ā'.repeat(16)}\n`);
  expect(() => ensurePasswords(file)).toThrow(/outside ASCII/);
});

// Review of #222: first runs that start together (a process manager starting several) each wrote
// their own pair, and the one left serving could hold passwords that were no longer in .env.
it('gives runs that start together the one pair that ends up in .env', async () => {
  const host = pathToFileURL(path.resolve('scripts/web/host.js')).href;
  const start = Date.now() + 1500; // every run waits for the same moment, so they really do overlap
  const code = `import { ensurePasswords } from ${JSON.stringify(host)}; while (Date.now() < ${start}); console.log(JSON.stringify(ensurePasswords(${JSON.stringify(file)})));`;
  const run = () => new Promise((resolve, reject) => {
    execFile(process.execPath, ['--input-type=module', '-e', code], (err, stdout) => (err ? reject(err) : resolve(JSON.parse(stdout))));
  });
  const pairs = await Promise.all(Array.from({ length: 12 }, run));
  const { OPENTUTOR_PASSWORD, OPENTUTOR_ADMIN_PASSWORD } = read();
  for (const pair of pairs) expect(pair).toEqual({ OPENTUTOR_PASSWORD, OPENTUTOR_ADMIN_PASSWORD });
}, 20000);

// Review of #222: taking over a crashed run's lock could race another run doing the same.
it('stops and says what to do about a lock a crash left behind, and changes nothing', () => {
  fs.writeFileSync(`${file}.lock`, '');
  expect(() => ensurePasswords(file)).toThrow(/left over from a run that stopped.*delete it and run again/);
  expect(fs.readFileSync(file, 'utf8')).toBe('');
}, 10000);
