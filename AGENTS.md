# OpenTutor — Agent Guide

The repo guide lives in [CLAUDE.md](CLAUDE.md): structure, the multi-agent
pipeline, lesson delivery, state layout, LLM backends and conventions. Read it
before changing anything. This file carries the rules that are easiest to skip.

## Working in this repo

**Every non-trivial change gets an issue and a PR.** Not just bugs — features,
refactors, doc overhauls, anything someone might later need to understand the
reasoning for. The issue says what is wrong and why it matters; the PR says what
was done about it. A commit straight to `main` leaves neither.

- Write the issue first when the problem is discovered first. If the fix comes
  out of doing something else, open the issue anyway and reference it.
- `Closes #N` on its own line, one per issue. A comma-separated list
  (`Closes #1, #2`) only closes the first.
- Don't branch a new PR off an unmerged branch unless the stacking is
  deliberate — the second PR's diff will contain the first one's commits.

**Review important changes with a second model before merging.**

```bash
claude -p --model fable "$(cat review-prompt.md)" > review.md
```

Ask it to be adversarial and to name file:line plus the input that triggers each
finding. It is worth it: the review of the per-student tenancy change (#80)
found four real defects, including a migration that silently lost a student's
profile, and a trust boundary that validated an id without canonicalising it.

Prioritise reviews for anything touching a trust boundary, a migration, money,
or state that more than one person can reach.

**Verify against something running, not only the suite.** The same #80 change
passed 378 tests with a bug that took the whole web server down on any duplicate
request — the route tests' fake `res` recorded a status instead of enforcing
that headers are written once. Start the server, curl the endpoints, include the
error paths.
