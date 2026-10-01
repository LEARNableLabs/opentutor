#!/bin/bash
# Claude Code on the web: install dependencies so `npm test` and `npm run lint` work
# from the first command of a session. Local installs are left alone.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
# Always a clean install, never a judgement that a cached node_modules is complete: no
# check (a lockfile hash, `npm ls`) proves every file is present, and a partial tree
# breaks the session. npm ci installs exactly what package-lock.json pins and never
# rewrites it; --prefer-offline uses npm's cache (~3-4 s here). --include=dev: tests and
# lint need devDependencies even if NODE_ENV=production is set.
npm ci --include=dev --prefer-offline --no-audit --no-fund
