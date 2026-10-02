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
import { plan, check, extractUrls } from '../lib/core/link-check.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'tutor', 'domains');
const CACHE = process.env.LINK_CACHE || path.join(os.tmpdir(), 'opentutor-link-cache.json');

function* domainFiles() {
  for (const slug of fs.readdirSync(ROOT)) {
    for (const name of ['curriculum.json', 'resources.md', 'research.md']) {
      const file = path.join(ROOT, slug, name);
      if (fs.existsSync(file)) yield file;
    }
  }
}

const loadCache = () => (fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {});

/** Two lanes per host, sharing a global request cap, without repeatedly scanning busy hosts. */
export async function checkUrlQueue(queue, cache, { checkFn = check, workers = 24, pauseMs = 250, onChecked = () => {} } = {}) {
  const hosts = new Map();
  for (const item of queue) {
    if (!hosts.has(item.host)) hosts.set(item.host, []);
    hosts.get(item.host).push(item.url);
  }
  let active = 0;
  const waiting = [];
  const acquire = async () => {
    if (active < workers) { active++; return; }
    await new Promise((resolve) => waiting.push(resolve));
  };
  const release = () => {
    const next = waiting.shift();
    if (next) next();
    else active--;
  };
  await Promise.all([...hosts.values()].flatMap((urls) => {
    let index = 0;
    return Array.from({ length: 2 }, async () => {
      while (index < urls.length) {
        const url = urls[index++];
        await acquire();
        try { cache[url] = await checkFn(url); onChecked(); }
        finally { release(); }
        if (pauseMs) await new Promise((resolve) => setTimeout(resolve, pauseMs));
      }
    });
  }));
}

async function runCheck() {
  const cache = loadCache();
  const urls = new Set();
  for (const file of domainFiles()) { const text = fs.readFileSync(file, 'utf8'); for (const u of extractUrls(file.endsWith('.json') ? JSON.parse(text) : text)) urls.add(u); }
  // What was decided stays decided; "unknown" (a timeout, a blocked request) is asked again.
  const queue = [...urls].filter((u) => !cache[u] || cache[u].status === 'unknown').map((url) => ({ url, host: plan(url).host }));
  console.log(`${urls.size} unique URLs, ${queue.length} to check`);
  // At most WORKERS requests at once and 2 per host, with a pause between a host's requests: an
  // audit that opens a connection to every host at once only measures its own timeouts.
  let done = 0;
  await checkUrlQueue(queue, cache, {
    onChecked: () => {
      if (++done % 200 === 0) { fs.writeFileSync(CACHE, JSON.stringify(cache)); console.log(`${done}`); }
    },
  });
  fs.writeFileSync(CACHE, JSON.stringify(cache));
  const tally = Object.values(cache).reduce((t, r) => ({ ...t, [r.status]: (t[r.status] || 0) + 1 }), {});
  console.log('result', tally);
}

const isDead = (cache, url) => cache[url]?.status === 'dead';

/** Remove dead URL array entries while preserving the curriculum's existing JSON formatting. */
export function removeDeadJsonLinks(text, cache) {
  JSON.parse(text); // only process valid JSON
  const tokens = [...text.matchAll(/"(?:\\.|[^"\\])*"|[{}\[\],:]|[^{}\[\],:\s]+/g)];
  const edits = [];
  let index = 0;
  const read = () => {
    const token = tokens[index++];
    const start = token.index;
    if (token[0] === '{') {
      while (tokens[index][0] !== '}') {
        index += 2; // property name and colon
        read();
        if (tokens[index][0] === ',') index++;
      }
      const end = tokens[index++].index + 1;
      return { start, end };
    }
    if (token[0] === '[') {
      const children = [];
      while (tokens[index][0] !== ']') {
        children.push(read());
        if (tokens[index][0] === ',') index++;
      }
      const end = tokens[index++].index + 1;
      const dead = children.map((n) => typeof n.value === 'string' && /^https?:\/\//.test(n.value) && isDead(cache, n.value));
      for (let i = 0; i < children.length; i++) {
        if (!dead[i]) continue;
        const first = i;
        while (dead[i + 1]) i++;
        // Use the following comma for a leading/middle run, the preceding comma for a trailing
        // run, and empty the brackets when every element is removed. Consecutive removals are one edit.
        if (first === 0 && i === children.length - 1) edits.push([start + 1, end - 1]);
        else if (i < children.length - 1) edits.push([children[first].start, children[i + 1].start]);
        else edits.push([children[first - 1].end, children[i].end]);
      }
      return { start, end };
    }
    return { start, end: start + token[0].length, value: token[0].startsWith('"') ? JSON.parse(token[0]) : undefined };
  };
  read();
  for (const [start, end] of edits.sort((a, b) => b[0] - a[0])) text = text.slice(0, start) + text.slice(end);
  return text;
}

function runApply() {
  const cache = loadCache();
  const removed = {};
  for (const file of domainFiles()) {
    const slug = path.basename(path.dirname(file));
    const text = fs.readFileSync(file, 'utf8');
    let out;
    if (file.endsWith('.json')) {
      // Dead URLs leave every string array in the curriculum (a lesson's resources), nothing else.
      out = removeDeadJsonLinks(text, cache);
    } else {
      // Remove a resource row only when all its links are dead. Prose and rows with a surviving
      // link stay for a person, so an unknown/live resource cannot be collateral damage.
      out = text.split('\n').filter((line) => {
        const urls = extractUrls(line);
        return !(/^\s*[-*|\d]/.test(line) && urls.length && urls.every((u) => isDead(cache, u)));
      }).join('\n');
      if (out !== text) out = out.replace(/\n+$/, '\n');
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
