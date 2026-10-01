#!/usr/bin/env node
/**
 * Remove the lesson resources whose shape can't be real (#293) from the shipped curricula, and
 * report them per domain. Offline: a real-shaped link can still be dead. Only the removed URLs
 * change, so each file keeps its formatting; a file with nothing to remove is not written.
 *
 * Usage: node scripts/check-resource-links.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { inventedLink } from '../lib/core/links.js';

const DOMAINS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'tutor', 'domains');
// A lesson's resources: an array of JSON strings, on one line or several.
const RESOURCES = /"resources":\s*\[(?:\s*"(?:[^"\\]|\\.)*"\s*,?)*\s*\]/g;

/** The curriculum text without its invented lesson resources, and what was removed. Throws rather than change anything else. */
export function withoutInvented(text) {
  const removed = [];
  const out = text.replace(RESOURCES, (span) => {
    for (const url of JSON.parse(span.slice(span.indexOf('[')))) {
      const why = inventedLink(url);
      if (why) { removed.push({ url, why }); span = drop(span, JSON.stringify(url)); }
    }
    return span;
  });
  const expected = JSON.parse(text);
  for (const lesson of expected.lessons || []) {
    if (Array.isArray(lesson.resources)) lesson.resources = lesson.resources.filter((r) => !inventedLink(r));
  }
  if (JSON.stringify(JSON.parse(out)) !== JSON.stringify(expected)) throw new Error('removing resources would change more than lesson resources');
  return { text: out, removed };
}

// One element out of an array's text, with the comma on one side of it, so the rest keeps its layout.
function drop(span, quoted) {
  const at = span.indexOf(quoted), end = at + quoted.length;
  const after = span.slice(end).match(/^\s*,\s*/);
  if (after) return span.slice(0, at) + span.slice(end + after[0].length);
  const before = span.slice(0, at).match(/,\s*$/);
  if (before) return span.slice(0, at - before[0].length) + span.slice(end);
  return `${span.slice(0, span.indexOf('['))}[]`; // it was the only one
}

function main() {
  const reasons = {};
  let domains = 0;
  for (const slug of fs.readdirSync(DOMAINS_DIR).sort()) {
    const file = path.join(DOMAINS_DIR, slug, 'curriculum.json');
    if (!fs.existsSync(file)) continue;
    const { text, removed } = withoutInvented(fs.readFileSync(file, 'utf8'));
    if (!removed.length) continue;
    fs.writeFileSync(file, text);
    domains++;
    console.log(`${slug}: ${removed.length} removed`);
    for (const { url, why } of removed) {
      console.log(`  ${why}: ${url}`);
      reasons[why] = (reasons[why] || 0) + 1;
    }
  }
  const total = Object.values(reasons).reduce((a, b) => a + b, 0);
  console.log(`\n${total} removed from ${domains} domains`, reasons);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
