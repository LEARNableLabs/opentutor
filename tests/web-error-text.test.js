import { it, expect, vi, beforeAll, afterAll } from 'vitest';
import { spawn } from 'node:child_process';
import net from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

// #144 — the local server answered a failed add-topic or admin call with the
// store's own error text. This boots the real server and drops its kv table
// underneath it, so every read and write fails the way a broken database does.

const ROOT = fileURLToPath(new URL('..', import.meta.url));
let child, base, dataDir, log = '';

const freePort = () => new Promise((resolve) => {
  const srv = net.createServer().listen(0, '127.0.0.1', () => {
    const { port } = srv.address();
    srv.close(() => resolve(port));
  });
});

beforeAll(async () => {
  const port = await freePort();
  base = `http://127.0.0.1:${port}`;
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-error-text-'));
  // Explicit env only: a checkout's .env holds production credentials.
  child = spawn(process.execPath, ['scripts/web/server.js'], {
    cwd: ROOT,
    env: {
      PATH: process.env.PATH, HOME: process.env.HOME,
      OPENTUTOR_PORT: String(port), OPENTUTOR_HOST: '127.0.0.1', OPENTUTOR_DATA_DIR: dataDir,
      OPENTUTOR_PASSWORD: 'student-secret', OPENTUTOR_ADMIN_PASSWORD: 'admin-secret',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stderr.on('data', (d) => { log += d; });
  // The last line of startup, printed after the server's own read of kv.
  let out = '';
  await new Promise((resolve, reject) => {
    child.stdout.on('data', (d) => { out += d; if (out.includes('Topics loaded')) resolve(); });
    child.on('exit', (code) => reject(new Error(`server exited with ${code}\n${log}`)));
  });
  const db = new Database(path.join(dataDir, 'workspace', 'tutor', 'opentutor.db'));
  db.exec('DROP TABLE kv');
  db.close();
}, 15000);

afterAll(() => {
  child?.kill();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

it.each([
  ['GET', '/api/progress'],
  ['GET', '/api/user'],
  ['POST', '/api/user', { name: 'Ada' }],
  ['POST', '/api/add-topic', { topic: 'Knot theory' }],
  ['GET', '/api/admin/students', undefined, 'admin-secret'],
])('%s %s keeps the database error out of the response', async (method, url, body, secret = 'student-secret') => {
  const res = await fetch(base + url, {
    method,
    headers: { authorization: `Bearer ${secret}`, 'content-type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  expect(res.status).toBeGreaterThanOrEqual(500);
  expect(await res.text()).not.toMatch(/kv|no such table/);
  expect((await fetch(`${base}/api/catalog`)).status, 'the server is still up').toBe(200);
});

it('logs the error it kept from the browser', async () => {
  // stderr is a separate pipe from the response, so it can arrive a moment later.
  await vi.waitFor(() => expect(log).toContain('[add-topic] no such table: kv'));
});
