import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'node:child_process';
import net from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Issue #138 — readBody() in scripts/web/server.js appended every chunk of a
// request body with no limit. mountHandler reads the body of /api/account and
// /api/openrouter before any authentication, and a default local install has
// no OPENTUTOR_PASSWORD, so anything that could reach the port could grow the
// process's memory until it died.
//
// This boots the real server as a child process rather than calling handlers
// directly: the bug — and the fix — live in the HTTP layer itself (readBody
// and how the socket is closed), which a mocked req/res would not exercise.

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIMIT = 1_048_576; // must match the limit in scripts/web/server.js
const PASSWORD = 'test-body-limit-password';

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function waitForServer(url, timeoutMs = 8000) {
  const start = Date.now();
  let lastErr;
  while (Date.now() - start < timeoutMs) {
    try {
      await fetch(url);
      return;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 50));
    }
  }
  throw new Error(`server did not come up on ${url}: ${lastErr?.message}`);
}

// A JSON body of exactly `totalBytes` bytes. The wrapper is fixed ASCII, so
// string length and byte length agree — no need to fuss over UTF-8 width.
function bodyOfSize(totalBytes) {
  const wrapper = '{"context":""}';
  const pad = Math.max(0, totalBytes - wrapper.length);
  return JSON.stringify({ context: 'x'.repeat(pad) });
}

let child, base, dataDir;

beforeAll(async () => {
  const port = await getFreePort();
  base = `http://127.0.0.1:${port}`;
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-body-limit-'));

  // Explicit, minimal env — never the parent's env wholesale. This is a local
  // checkout's .env holds production Supabase/API credentials; the point of
  // this list is that none of them are here.
  child = spawn(process.execPath, ['scripts/web/server.js'], {
    cwd: ROOT,
    env: {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      OPENTUTOR_PORT: String(port),
      OPENTUTOR_HOST: '127.0.0.1',
      OPENTUTOR_DATA_DIR: dataDir,
      OPENTUTOR_PASSWORD: PASSWORD,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let out = '';
  child.stdout.on('data', (d) => { out += d; });
  child.stderr.on('data', (d) => { out += d; });
  child.on('exit', (code, signal) => {
    if (code !== null && code !== 0) console.error(`[web-body-limit] server exited ${code}/${signal}\n${out}`);
  });

  await waitForServer(`${base}/api/catalog`);
}, 15000);

afterAll(() => {
  child?.kill();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

describe('local server request body limit (#138)', () => {
  it('answers 413 for a body over 1 MiB on a pre-auth route, and keeps serving afterward', async () => {
    const res = await fetch(`${base}/api/account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyOfSize(LIMIT + 10_000),
    });
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: 'Request body too large.' });

    // The process must still be alive and serving other requests.
    const after = await fetch(`${base}/api/catalog`);
    expect(after.status).toBe(200);
  });

  it('does not refuse a body just under the limit for its size', async () => {
    const res = await fetch(`${base}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PASSWORD}` },
      body: bodyOfSize(LIMIT - 10_000),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('enforces the same limit on an authenticated student route, without crashing the server', async () => {
    const res = await fetch(`${base}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PASSWORD}` },
      body: bodyOfSize(LIMIT + 10_000),
    });
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: 'Request body too large.' });

    const after = await fetch(`${base}/api/catalog`);
    expect(after.status).toBe(200);
  });
});
