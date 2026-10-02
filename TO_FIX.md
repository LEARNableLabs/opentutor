# Remaining work — 2026-10-02

Read `AGENTS.md` and `CLAUDE.md` first. No PRs below have merged. Preserve the
existing deleted `.claude/workflows/*.js` files and untracked `issues.md`.

- **#337 merged** October 2: README/methodology provenance corrections.
- **#329 fixes pushed at `e855932`:** review-schedule save failures now return
  503, retain the last step, and allow retry; competing requests cannot clear an
  owned review. Full suite: 1,365 passed; lint and live JSON-server reproduction
  passed. Check the latest Codex/CodeRabbit review threads and CI before merge.
- **#331 fixes pushed at `c16f23c`:** staging stays on the destination filesystem;
  cleanup failures warn without misreporting publication; portable test paths;
  CLI errors omit private model output; known-dead builder resources are removed;
  metadata cannot inject unchecked links; link cleanup retains resource labels.
  Full suite: 1,396 passed; lint and live JSON/SSE privacy checks passed. Fresh
  reviews requested (CodeRabbit was resumed); check new findings before merge.
  The optional-file suggestion was answered: shipped installs intentionally
  require all six nonempty files, unlike the hosted course path.
- **#340 fixes pushed at `b8bc576`:** restored the valid OR-Tools clone URL and
  preserved Markdown resource labels and descriptions. Separate content-only
  diff removes 3,807 distinct confirmed-dead URLs across 471 files/243 courses.
  Live/unknown URLs and non-link curriculum content are preserved; 25 cached
  dead URLs in prose/mixed rows still need manual review. Fresh Codex review
  requested; CodeRabbit skips shipped domains under the configured path filter.
  Check latest reviews and CI before merge.
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
