#!/bin/bash
# Claude Code on the web: install dependencies so `npm test` and `npm run lint` work
# from the first command of a session. Local installs are left alone.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
# npm ci installs exactly what package-lock.json pins and never rewrites it (npm install
# does, under a different npm version). The container is cached after this hook, so skip
# the reinstall while node_modules is newer than the lockfile.
if [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  npm ci --no-audit --no-fund
fi
