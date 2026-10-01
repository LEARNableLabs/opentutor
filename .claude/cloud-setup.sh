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

for f in settings.json settings.local.json; do
  if [ -f "$dir/$f" ] && grep -qF '.claude/hooks/session-start.sh' "$dir/$f"; then
    exit 0 # already registered
  fi
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
