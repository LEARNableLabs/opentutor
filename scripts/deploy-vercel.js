#!/usr/bin/env node
/**
 * Deploy to Vercel through the REST API.
 *
 * Exists so deploying needs nothing installed globally — Node and a token are
 * enough. If the Vercel GitHub integration is ever installed on the team, that
 * supersedes this: pushes deploy themselves and PRs get their own preview URLs.
 *
 *   VERCEL_TOKEN=... node scripts/deploy-vercel.js [--prod]
 *
 * The file list comes from `git ls-files`, so .gitignore is honoured and
 * node_modules never goes up — Vercel installs from package.json at build time.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN = process.env.VERCEL_TOKEN;
const TEAM = process.env.VERCEL_TEAM_ID || 'team_Hgr7v4vb8NpBlDqD9sn9yzOj';
const PROJECT = process.env.VERCEL_PROJECT || 'opentutor';
const PROD = process.argv.includes('--prod');

// Nothing here runs in the deployment: tests, docs, images, CI config, and the
// Claude Web bundle (a zip a student downloads from GitHub, not a served asset).
const SKIP = /^(tests|docs|assets|\.github|supabase)\/|\.skill$|^\.env/;

if (!TOKEN) {
  console.error('VERCEL_TOKEN is not set.');
  process.exit(1);
}

const api = (url, opts = {}) =>
  fetch(url, { ...opts, headers: { Authorization: `Bearer ${TOKEN}`, ...opts.headers } });

const files = execFileSync('git', ['ls-files'], { cwd: REPO, encoding: 'utf-8' })
  .split('\n')
  // ls-files still lists a tracked file that has been deleted in the working
  // tree, and you cannot upload what isn't there.
  .filter((f) => f && !SKIP.test(f) && fs.existsSync(path.join(REPO, f)))
  .map((f) => {
    const body = fs.readFileSync(path.join(REPO, f));
    return { file: f, body, sha: crypto.createHash('sha1').update(body).digest('hex'), size: body.length };
  });

const total = (files.reduce((n, f) => n + f.size, 0) / 1024 / 1024).toFixed(1);
console.log(`${files.length} files (${total} MB) — asking Vercel which it already has…`);

/**
 * Upload the given files, in parallel but capped.
 *
 * Uploading every file on every deploy burned this account's free-tier quota
 * (5000 uploads per 24h) in three deploys. Vercel stores blobs by digest and
 * keeps them across deployments, so the right flow is to create the deployment
 * first and upload only what it reports missing.
 */
async function upload(pending) {
  let done = 0;
  const queue = [...pending];
  await Promise.all(Array.from({ length: 16 }, async () => {
    for (let f = queue.pop(); f; f = queue.pop()) {
      const r = await api('https://api.vercel.com/v2/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream', 'x-vercel-digest': f.sha },
        body: f.body,
      });
      if (!r.ok) throw new Error(`upload ${f.file}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
      if (++done % 250 === 0) console.log(`  ${done}/${pending.length}`);
    }
  }));
  return done;
}

const deploy = () => api(`https://api.vercel.com/v13/deployments?teamId=${TEAM}&skipAutoDetectionConfirmation=1`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: PROJECT,
    project: PROJECT,
    target: PROD ? 'production' : undefined,
    files: files.map(({ file, sha, size }) => ({ file, sha, size })),
    projectSettings: { framework: null },
  }),
});

let r = await deploy();
let d = await r.json();

// Vercel answers a deployment whose blobs it does not have with the list of
// digests it is missing. Upload exactly those, then ask again.
const missingShas = new Set(d?.error?.missing || []);
if (missingShas.size) {
  const pending = files.filter((f) => missingShas.has(f.sha));
  console.log(`uploading ${pending.length} of ${files.length} — the rest Vercel already had`);
  await upload(pending);
  r = await deploy();
  d = await r.json();
} else {
  console.log('nothing to upload; every file was already stored');
}

if (!r.ok || d.error) {
  console.error('deployment failed:', d.error?.message || JSON.stringify(d).slice(0, 400));
  process.exit(1);
}

console.log(`\n  https://${d.url}\n  inspect: https://vercel.com/${d.creator?.username ?? ''}/${PROJECT}/${d.id}`);
