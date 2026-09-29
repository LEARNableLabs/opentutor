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
import { fileURLToPath } from 'node:url';

const KEYS = ['OPENTUTOR_PASSWORD', 'OPENTUTOR_ADMIN_PASSWORD'];
const MIN_LENGTH = 16;
const LINE = /^\s*(?:export\s+)?(OPENTUTOR_PASSWORD|OPENTUTOR_ADMIN_PASSWORD)\s*=(.*)$/;

// A value every .env parser reads the same way, the environment keeps whole, and a browser can send
// in a header: printable ASCII (fetch refuses a header outside Latin-1; a NUL would cut it short)
// with no quote, comment or escape.
const PLAIN = /^[\x21-\x7e]+$/;
const SPECIAL = /['"`#\\]/;

// Our two keys, read line by line. Node's own .env parser can't be trusted with them: it takes the
// line after "KEY= " as that key's value, and doesn't always let the later of two duplicates win.
// Quoting and comments are refused rather than guessed at: a guess once made a comment the password.
function passwordsIn(text, file) {
  const values = {};
  for (const line of text.split('\n')) {
    const match = line.match(LINE);
    if (!match) continue;
    const raw = match[2].trim();
    if (raw === '' || raw === '""' || raw === "''") values[match[1]] = '';
    else if (PLAIN.test(raw) && !SPECIAL.test(raw)) values[match[1]] = raw;
    else throw new Error(`${match[1]} in ${file} uses quotes, spaces, a comment, a control character or a character outside ASCII, which npm run host won't accept. Write it as ${match[1]}=value, or delete the line to have one generated.`);
  }
  return values;
}

// First runs that start together (a process manager starting several) must not each write a pair
// of their own, or one could serve passwords that are no longer in .env. Whoever doesn't hold this
// lock waits, then finds the passwords written. Holding it takes a millisecond, so a lock still
// there after a few seconds was left by a crash. Removing it here could race another run doing
// the same, so this stops and says how instead.
function whileLocked(file, work) {
  const lock = `${file}.lock`;
  for (const since = Date.now(); ;) {
    try { fs.closeSync(fs.openSync(lock, 'wx', 0o600)); break; } catch (err) {
      if (err.code !== 'EEXIST') throw err;
      if (Date.now() - since > 5000) throw new Error(`${lock} is left over from a run that stopped. If no other npm run host is starting, delete it and run again.`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20); // wait 20 ms
    }
  }
  try { return work(); } finally { fs.rmSync(lock, { force: true }); }
}

/** Make sure `file` holds a password for each role, readable only by its owner. Returns them. */
export function ensurePasswords(file) {
  fs.closeSync(fs.openSync(file, 'a', 0o600)); // created private, before any secret is in it
  fs.chmodSync(file, 0o600); // and made private if it already existed
  whileLocked(file, () => {
    const text = fs.readFileSync(file, 'utf8');
    const missing = KEYS.filter((key) => !passwordsIn(text, file)[key]);
    if (!missing.length) return;
    // An empty password's lines are removed, not shadowed; the new file replaces the old one
    // whole, so a crash mid-write can't leave .env without the settings it already held.
    const kept = text.split('\n').filter((line) => !missing.includes(line.match(LINE)?.[1])).join('\n').replace(/\n*$/, '');
    const lines = missing.map((key) => `${key}=${crypto.randomBytes(24).toString('hex')}`);
    const temp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temp, `${kept ? `${kept}\n` : ''}${lines.join('\n')}\n`, { mode: 0o600 });
    fs.renameSync(temp, file);
  });
  const values = passwordsIn(fs.readFileSync(file, 'utf8'), file);
  for (const key of KEYS) {
    if ((values[key] || '').length < MIN_LENGTH) {
      throw new Error(`${key} in ${file} must be at least ${MIN_LENGTH} characters. Delete its line and run again to have one generated.`);
    }
  }
  if (values.OPENTUTOR_PASSWORD === values.OPENTUTOR_ADMIN_PASSWORD) {
    throw new Error('OPENTUTOR_PASSWORD and OPENTUTOR_ADMIN_PASSWORD must differ: the admin one can remove every student.');
  }
  return Object.fromEntries(KEYS.map((key) => [key, values[key]]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env');
  let passwords;
  try {
    passwords = ensurePasswords(file);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  process.loadEnvFile(file); // the provider key and the rest; the shell's own exports still win
  Object.assign(process.env, passwords); // except these: a stale or empty export must not replace them
  if (process.platform === 'win32') console.warn(`Windows ignores chmod: make sure only you can read ${file}.`);
  console.log(`The learner and admin passwords are in ${file}.`);
  console.log(process.env.OPENTUTOR_HOST
    ? `Listening on ${process.env.OPENTUTOR_HOST}: plain HTTP unless something in front adds HTTPS.`
    : 'Listening on this computer only. Others reach it through a web server in front, such as Caddy or nginx, which also adds HTTPS. OPENTUTOR_HOST=0.0.0.0 serves plain HTTP to your network instead.');
  await import('./server.js');
}
