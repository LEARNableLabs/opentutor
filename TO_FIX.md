# Remaining work — 2026-10-02

Read `AGENTS.md` and `CLAUDE.md` first. No PRs below have merged. Preserve the
existing deleted `.claude/workflows/*.js` files and untracked `issues.md`.

- **Finish reviews and merge #329, #331, #337, #340.** Fixes are pushed;
  final Codex reviews were requested for #329/#331/#337. Check current comments,
  resolve verified findings, and ensure both Codex and CodeRabbit have reviewed
  and CI passes before merging. #329 passed 1,363 tests and live error-path
  checks; #331 passed 1,389 tests and lint. #337 corrects README/methodology
  provenance claims. #340 is the separate link-removal PR: 3,799 confirmed dead
  URLs removed from 471 files (the original audit counted 4,041). A valid
  OR-Tools Git clone URL was restored; reply to its review thread is posted but
  resolution and a final review of the updated head still need checking.
- **Rerun failed builds:** `risk-management`, `luthiery`, `seismology`.
  The attempted rerun hit Claude's session limit, reported to reset at 6:10pm
  America/New_York on October 2. Check availability before retrying.
- **Rerun resource searches:** `volcanology`, `traditional-joinery`,
  `bread-chemistry`, `competitive-rock-climbing`. These ran before the timeout
  fix. Also check incomplete resource coverage for `organic-chemistry`.
  Existing build artifacts are in `.build-logs/`.
- **Keep pilot install #339 in draft** until the pending resources and progress
  decision are settled. It stages five approved builds: volcanology, joinery,
  bread chemistry, marine biology, organic chemistry. **Do not install bonsai
  or competitive rock climbing:** neither received approval in three rounds.
- **Keep #333 unmerged.** Behavioral economics still has open findings about
  completion identity and review spacing (first review at lesson 10; later gaps
  exceed the intended 5–7 lessons).
- **Resolve #336: completions need curriculum revision identity.** They currently
  match lesson numbers, so any rebuilt shipped course can misassign progress.
  Proposed policy: retain old history, start full rebuilds on a fresh revision,
  and carry progress forward only through an explicit compatibility mapping;
  link/editorial edits retain the revision. This is not implemented. Include
  file/SQLite/Supabase state and lessons in flight. A read-only production check
  at 18:30 UTC October 2 found zero completions or active progress for the 11
  affected courses; that snapshot does not fix future collisions.
- **Link audit follow-up (#293):** 25 cached dead URLs remain in prose or mixed
  live/unknown resource rows in changed files; inspect manually. #340 does not
  close the entire audit issue.
- **Cleanup after merge:** remove `../opentutor-wt-sr` only after #329 merges;
  remove `../opentutor-wt-be` only after #333 merges. Temporary worktrees are
  `/private/tmp/opentutor-review-329`, `opentutor-docs-provenance`,
  `opentutor-pilot-install`, and `opentutor-link-apply` (all under `/private/tmp`).
  Check for uncommitted work before removal; keep the pilot worktree while
  #339 remains unfinished.

PRs/issues: https://github.com/LEARNableLabs/opentutor

## Resume on another machine

This draft snapshot preserves content for recovery, not installation. Never copy
unapproved bonsai/climbing builds into shipped domains. Checkout the PR branches
listed above to continue the actual code/content changes.

- Recovery files: `handoff/2026-10-02/` in this branch.
- Copy `handoff/2026-10-02/builds/` to `.build-logs/` if existing scripts need the
  original build paths. Raw model-call/event logs were omitted; domain artifacts,
  critiques, research and found-resource results were preserved where present.
- `reviewed-link-cache.json` preserves the reviewed audit results; link checks
  are point-in-time and should be refreshed when needed.
- `issues.md` is the original local findings inventory.
- `local-workflow-deletions.patch` records pre-existing local edits; do not apply
  it without reviewing the owner's intent.
- Credentials and runtime/student data are excluded. Configure the new machine
  separately. `review-smoke.mjs` preserves the #329 running-server reproducer;
  its old absolute worktree paths need updating.

Audit cache backup omits 1 URL entry that matched a credential-shaped
string; the original local cache is unchanged. Refresh the audit as needed.
