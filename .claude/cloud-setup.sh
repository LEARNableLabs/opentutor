#!/bin/bash
# Run from the cloud environment's Setup script (environment menu → Edit → Setup script):
#
#   bash /home/user/opentutor/.claude/cloud-setup.sh || true
#
# It registers .claude/hooks/session-start.sh in this clone's .claude/settings.json, so
# each cloud session installs dependencies when Claude Code starts. settings.json is not
# tracked (#302): a tracked one would overwrite contributors' private settings on pull.
# An existing settings.json is merged into, never replaced, and running it twice adds
# nothing. Outside a clone of this repo it does nothing.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[ -f "$root/.claude/settings.cloud.json" ] || exit 0

node - "$root/.claude/settings.json" "$root/.claude/settings.cloud.json" << 'JS'
const fs = require('fs');
const [target, source] = process.argv.slice(2);
const read = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { if (e.code === 'ENOENT') return {}; throw e; } };
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
// The shape Claude Code expects: { hooks?: { <event>: [ { hooks: [ { command, ... } ] } ] } }.
// Anything else is refused before a byte is written, so a file we don't understand is left as it is.
function check(settings, file) {
  const fail = (what) => { console.error(`${file}: ${what}; left unchanged`); process.exit(1); };
  if (!isObject(settings)) fail('not a JSON object');
  if (settings.hooks === undefined) return;
  if (!isObject(settings.hooks)) fail('"hooks" is not an object');
  for (const [event, groups] of Object.entries(settings.hooks)) {
    if (!Array.isArray(groups)) fail(`hooks.${event} is not a list`);
    for (const group of groups) {
      if (!isObject(group) || !Array.isArray(group.hooks)) fail(`a hooks.${event} entry has no "hooks" list`);
      if (!group.hooks.every(isObject)) fail(`a hooks.${event} entry holds something that is not a hook`);
    }
  }
}
const settings = read(target);
const wanted = read(source);
check(settings, target);
check(wanted, source);
settings.hooks ??= {};
for (const [event, groups] of Object.entries(wanted.hooks || {})) {
  const have = (settings.hooks[event] ??= []);
  const commands = new Set(have.flatMap((g) => g.hooks.map((h) => h.command)));
  for (const group of groups) {
    if (!group.hooks.every((h) => commands.has(h.command))) have.push(group);
  }
}
// Write then rename: an interrupted or short write never leaves a half-written settings.json.
const tmp = `${target}.tmp-${process.pid}`;
try {
  fs.writeFileSync(tmp, JSON.stringify(settings, null, 2) + '\n');
  fs.renameSync(tmp, target);
} catch (e) {
  fs.rmSync(tmp, { force: true });
  throw e;
}
JS
