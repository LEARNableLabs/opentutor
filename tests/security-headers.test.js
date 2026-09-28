import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'node:child_process';
import net from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// #172: no page may be framed by another site (clickjacking on account actions),
// sniffed into another content type, or leak its full URL as a referrer. Both
// servers send the same headers: Vercel from vercel.json, the local one itself.

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPECTED = {
  'content-security-policy': "frame-ancestors 'none'",
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
};

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
  while (Date.now() - start < timeoutMs) {
    try { await fetch(url); return; } catch { await new Promise((r) => setTimeout(r, 50)); }
  }
  throw new Error(`server did not come up on ${url}`);
}

describe('vercel.json', () => {
  it('sends the headers on every path', () => {
    const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
    const all = (config.headers || []).find((h) => h.source === '/(.*)');
    const sent = Object.fromEntries((all?.headers || []).map(({ key, value }) => [key.toLowerCase(), value]));
    expect(sent).toMatchObject(EXPECTED);
  });
});

describe('local server', () => {
  let child, base, dataDir;

  beforeAll(async () => {
    const port = await getFreePort();
    base = `http://127.0.0.1:${port}`;
    dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-headers-'));
    // Explicit, minimal env: never the parent's, which may hold production credentials.
    child = spawn(process.execPath, ['scripts/web/server.js'], {
      cwd: ROOT,
      env: { PATH: process.env.PATH, HOME: process.env.HOME, OPENTUTOR_PORT: String(port), OPENTUTOR_HOST: '127.0.0.1', OPENTUTOR_DATA_DIR: dataDir },
      stdio: 'ignore',
    });
    await waitForServer(`${base}/api/catalog`);
  }, 15000);

  afterAll(() => {
    child?.kill();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it.each(['/', '/learn.html', '/api/catalog', '/no-such-page'])('sends the headers on %s', async (route) => {
    const res = await fetch(`${base}${route}`);
    for (const [name, value] of Object.entries(EXPECTED)) expect(res.headers.get(name), name).toBe(value);
  });
});
