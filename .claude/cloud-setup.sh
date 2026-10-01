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
const settings = read(target);
const wanted = read(source).hooks || {};
settings.hooks ||= {};
for (const [event, groups] of Object.entries(wanted)) {
  const have = (settings.hooks[event] ||= []);
  const commands = new Set(have.flatMap((g) => (g.hooks || []).map((h) => h.command)));
  for (const group of groups) {
    if (!(group.hooks || []).every((h) => commands.has(h.command))) have.push(group);
  }
}
fs.writeFileSync(target, JSON.stringify(settings, null, 2) + '\n');
JS
