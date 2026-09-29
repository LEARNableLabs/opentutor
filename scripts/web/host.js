#!/usr/bin/env node
/**
 * `npm run host`: serve OpenTutor to a small group (#221).
 *
 * The first run writes two long, different passwords to `.env`, which it keeps readable only by
 * you; later runs reuse them. Node writes them, so no shell step can leave one empty, print it, or
 * lose it to a missing newline. The server then starts with those passwords, whatever the shell
 * exports, and this prints where they are, never what they are.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';

const KEYS = ['OPENTUTOR_PASSWORD', 'OPENTUTOR_ADMIN_PASSWORD'];

/** Make sure `file` holds a password for each role, readable only by its owner. Returns them. */
export function ensurePasswords(file) {
  fs.closeSync(fs.openSync(file, 'a', 0o600)); // created private, before any secret is in it
  fs.chmodSync(file, 0o600); // and made private if it already existed
  const text = fs.readFileSync(file, 'utf8');
  const missing = KEYS.filter((key) => !parseEnv(text)[key]?.trim());
  if (missing.length) {
    // One line per key: an empty password is removed, not shadowed, because Node's own .env
    // parser does not consistently let the later of two duplicate lines win.
    const stale = new RegExp(`^\\s*(export\\s+)?(${missing.join('|')})\\s*=`);
    const kept = text.split('\n').filter((line) => !stale.test(line)).join('\n').replace(/\n*$/, '');
    const lines = missing.map((key) => `${key}=${crypto.randomBytes(24).toString('hex')}`);
    fs.writeFileSync(file, `${kept ? `${kept}\n` : ''}${lines.join('\n')}\n`);
  }
  const values = parseEnv(fs.readFileSync(file, 'utf8'));
  if (values.OPENTUTOR_PASSWORD === values.OPENTUTOR_ADMIN_PASSWORD) {
    throw new Error('OPENTUTOR_PASSWORD and OPENTUTOR_ADMIN_PASSWORD must differ: the admin one can remove every student.');
  }
  return Object.fromEntries(KEYS.map((key) => [key, values[key]]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env');
  const passwords = ensurePasswords(file);
  process.loadEnvFile(file); // the provider key and the rest; the shell's own exports still win
  Object.assign(process.env, passwords); // except these: a stale or empty export must not replace them
  console.log(`The learner and admin passwords are in ${file}.`);
  console.log('Add students at /admin.html. Serve it over HTTPS, through a web server such as Caddy or nginx.');
  await import('./server.js');
}
