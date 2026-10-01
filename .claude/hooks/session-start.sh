#!/bin/bash
# Claude Code on the web: install dependencies so `npm test` and `npm run lint` work
# from the first command of a session. Local installs are left alone.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
# npm ci installs exactly what package-lock.json pins and never rewrites it (npm install
# does, under a different npm version). The container is cached after this hook, so the
# install is skipped when the tree is known good: a marker holding the lockfile's hash,
# written only after npm ci succeeds, and every top-level dependency still present.
marker=node_modules/.session-start-lock
want=$(sha256sum package-lock.json | cut -d' ' -f1)
if [ "$(cat "$marker" 2>/dev/null)" = "$want" ] && npm ls --depth=0 >/dev/null 2>&1; then
  exit 0
fi
npm ci --no-audit --no-fund
echo "$want" > "$marker"
