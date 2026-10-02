#!/usr/bin/env node
/**
 * Check the links in the shipped domains and remove the dead ones (#293).
 *
 *   node scripts/verify-links.js check            # network; resumable; writes the cache
 *   node scripts/verify-links.js apply            # no network; removes what the cache says is dead
 *   node scripts/verify-links.js check apply      # both
 *
 * A link is "dead" only on evidence it does not exist: a YouTube id oEmbed does not know, a DOI
 * Crossref or arXiv does not know, a 404/410 or an unresolvable host. A 403, 429, timeout or
 * anything else is "unknown" and kept: sites that block bots must not cost a course its reading.
 * There is no replacement step: a resource is a bare URL with no title to search by.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { plan, check } from '../lib/core/link-check.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'tutor', 'domains');
const CACHE = process.env.LINK_CACHE || path.join(os.tmpdir(), 'opentutor-link-cache.json');
const URL_RE = /https?:\/\/[^\s)"'<>\\\]]+/g;

function* domainFiles() {
  for (const slug of fs.readdirSync(ROOT)) {
    for (const name of ['curriculum.json', 'resources.md', 'research.md']) {
      const file = path.join(ROOT, slug, name);
      if (fs.existsSync(file)) yield file;
    }
  }
}

const loadCache = () => (fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {});

async function runCheck() {
  const cache = loadCache();
  const urls = new Set();
  for (const file of domainFiles()) for (const m of fs.readFileSync(file, 'utf8').matchAll(URL_RE)) urls.add(m[0].replace(/[.,;:]+$/, ''));
  const todo = [...urls].filter((u) => !cache[u]);
  console.log(`${urls.size} unique URLs, ${todo.length} to check`);
  // A few at a time per host, and a pause between them: an audit must not look like an attack.
  const byHost = Map.groupBy(todo, (u) => plan(u).host || 'bad');
  let done = 0;
  await Promise.all([...byHost.values()].map(async (list) => {
    const lanes = Math.min(list[0] && plan(list[0]).host === 'youtube.com' ? 4 : 2, list.length);
    await Promise.all(Array.from({ length: lanes }, async () => {
      for (let u; (u = list.pop());) {
        cache[u] = await check(u);
        if (++done % 200 === 0) { fs.writeFileSync(CACHE, JSON.stringify(cache)); console.log(`${done}/${todo.length}`); }
        await new Promise((r) => setTimeout(r, 250));
      }
    }));
  }));
  fs.writeFileSync(CACHE, JSON.stringify(cache));
  const tally = Object.values(cache).reduce((t, r) => ({ ...t, [r.status]: (t[r.status] || 0) + 1 }), {});
  console.log('result', tally);
}

const isDead = (cache, url) => cache[url.replace(/[.,;:]+$/, '')]?.status === 'dead';

function runApply() {
  const cache = loadCache();
  const removed = {};
  for (const file of domainFiles()) {
    const slug = path.basename(path.dirname(file));
    const text = fs.readFileSync(file, 'utf8');
    let out;
    if (file.endsWith('.json')) {
      // Dead URLs leave every string array in the curriculum (a lesson's resources), nothing else.
      const strip = (v) => Array.isArray(v) ? v.filter((x) => !(typeof x === 'string' && /^https?:\/\//.test(x) && isDead(cache, x))).map(strip)
        : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, strip(x)])) : v;
      out = JSON.stringify(strip(JSON.parse(text)), null, text.includes('\n  ') ? 2 : undefined) + (text.endsWith('\n') ? '\n' : '');
    } else {
      // A markdown line that carries a dead URL goes whole; a dead link inside prose is left for a person.
      out = text.split('\n').filter((line) => !(/^\s*[-*|\d]/.test(line) && (line.match(URL_RE) || []).some((u) => isDead(cache, u)))).join('\n');
    }
    if (out !== text) { fs.writeFileSync(file, out); removed[slug] = (removed[slug] || 0) + 1; }
  }
  console.log(`${Object.keys(removed).length} domains changed`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const modes = process.argv.slice(2);
  if (!modes.some((m) => ['check', 'apply'].includes(m))) { console.error('usage: verify-links.js check|apply'); process.exit(1); }
  if (modes.includes('check')) await runCheck();
  if (modes.includes('apply')) runApply();
}
