#!/bin/bash
# Run from the cloud environment's Setup script (environment menu → Edit → Setup script):
#
#   bash /home/user/opentutor/.claude/cloud-setup.sh || true
#
# It registers .claude/hooks/session-start.sh so each cloud session installs dependencies
# when Claude Code starts. settings.json is not tracked (#302): a tracked one would
# overwrite contributors' private settings on pull.
#
# It never modifies an existing file. Rewriting someone's JSON loses things (number
# spellings, duplicate keys, file modes), so it only ever creates a file that isn't there:
# settings.json in a fresh clone, else settings.local.json; Claude Code reads hooks from both.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dir="$root/.claude"
source="$dir/settings.cloud.json"
[ -f "$source" ] || exit 0

# Already registered: a SessionStart group in either file is exactly one of the groups in
# settings.cloud.json (same matcher, same hooks; key order aside). A group with a matcher,
# such as "resume" only, doesn't count. Read only; a file that doesn't parse counts as not.
registered() {
  node -e '
    const fs = require("fs");
    const read = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };
    const canon = (v) => Array.isArray(v) ? `[${v.map(canon)}]`
      : v && typeof v === "object" ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`)}}`
      : JSON.stringify(v);
    const groups = (s) => (Array.isArray(s?.hooks?.SessionStart) ? s.hooks.SessionStart : []).map(canon);
    const wanted = groups(read(process.argv[1]));
    const have = new Set(groups(read(process.argv[2])));
    process.exit(wanted.length && wanted.every((g) => have.has(g)) ? 0 : 1);
  ' "$source" "$1"
}
for f in settings.json settings.local.json; do
  [ -f "$dir/$f" ] && registered "$dir/$f" && exit 0
done

for f in settings.json settings.local.json; do
  [ -e "$dir/$f" ] && continue
  tmp="$(mktemp "$dir/.$f.XXXXXX")"
  trap 'rm -f "$tmp"' EXIT
  cat "$source" > "$tmp"
  chmod 644 "$tmp"
  # -n: never replace a file that appeared meanwhile.
  mv -n "$tmp" "$dir/$f" || true
  [ -e "$tmp" ] && continue
  exit 0
done

echo "$dir: settings.json and settings.local.json both exist; left unchanged." >&2
echo "Add the SessionStart hook from settings.cloud.json to one of them by hand." >&2
exit 1
