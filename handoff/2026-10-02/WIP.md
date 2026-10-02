# Paused work — October 2

The user asked to stop. These are recovery patches, not reviewed/merged changes.
Do not resume implementation until requested. No further PRs were merged.

- `wip-329.patch` applies to PR #329 at `e855932603e3063efebc8f7b075669a89490c734`.
  Adds replayable graded review claims, idempotent completion receipts, scoped
  compare-and-set KV writes, Supabase progress retries, and SQLite transactions.
  Addresses the two new findings tracked in issue #343. Full suite: 1,366 passed;
  lint passed. A real web-server check verified failed saves/replay/late writes.
  Forced concurrent HTTP-client contract tests verified two topic updates survive.
  No live PostgreSQL test was run. The separate live PostgREST smoke prototype
  currently stops at construction because its store options need correction.
- `wip-331.patch` applies to PR #331 at `c16f23c471e9e624635c01788cc426e4a63449f7`.
  Rejects control-character URLs, checks/stores canonical destinations, timestamps
  audit verdicts, refreshes stale/unversioned cache entries and blocks applying
  stale dead-link verdicts. Full suite: 1,398 passed; lint passed.
- Both patches were checked against their current local changes with
  `git apply --reverse --check`. They are not pushed onto the actual PR branches;
  apply each patch on its listed base, verify/review, then commit/push when resumed.
- The latest review threads for those two PRs remain open; these patches have not
  been reviewed by Codex/CodeRabbit. Add `Closes #343` on its own line to #329 when
  the persistence work is finalized.
- PR #340 head `b8bc576ae4fe4fdc3f41b416e21a0cd692ee1e5d` has no open findings
  in the latest observed review. Check current CI/review gates before merging.
  CodeRabbit excludes domain content by the existing repository configuration.
- #337 merged; #333/#339 remain held. Pilot content is inventoried in `PILOTS.md`.

The smoke scripts have old absolute laptop/worktree paths. Update those paths on
a new machine. `live-check-fixtures/` preserves the old comparison modules and
fake CLI used by the privacy/recovery checks; restore its files into the fixtures
location expected by the scripts and link node_modules to the checkout dependency
directory. All fixture keys/student records are synthetic. Production credentials
and runtime student data are excluded.
