# OpenTutor — Agent Guide

The repo guide lives in [CLAUDE.md](CLAUDE.md): structure, the multi-agent
pipeline, lesson delivery, state layout, LLM backends and conventions. Read it
before changing anything. This file carries the rules that are easiest to skip.

## Code Review Rules

Treat these as blocking. Each one shipped, or nearly shipped, here:

- **Headers are written once.** After a route starts a response (an SSE stream), later failures are events, never a second status. A duplicate request once took the whole server down this way (#80).
- **No fallback to more privilege.** An invalid account cookie never falls back to root or legacy access. A student's model call never falls back to the deployment's key (#130, #134).
- **Limits hold under concurrency.** Check-then-write on a cap is a race: concurrent requests all pass the check. Claim each unit atomically (insert-if-absent, then read back) before spending (#134 measured 10 lessons against a cap of 3).
- **No oracles.** Sign-in, sign-up and password reset answer the same whether or not an email is registered, in status code as well as body (#130).
- **Secrets stay on the server.** No key, token or password in a response body, cookie, URL or log line. Upstream error text is not echoed to the browser.
- **Runtime state stays out of `skills/tutor/domains/`.** That directory is shipped content (see CLAUDE.md).
- **At most 12 Vercel functions.** The Hobby plan refuses more per deployment. A new `api/` route folds into an existing function; `tests/web-deployment.test.js` guards this.

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

**CodeRabbit reviews every pull request automatically.** It is configured in
`.coderabbit.yaml` and applies the `## Code Review Rules` section above as
review criteria. Address its findings before merging. Codex joins later as an
adversarial critic (#139).

It is worth it: the review of the per-student tenancy change (#80)
found four real defects, including a migration that silently lost a student's
profile, and a trust boundary that validated an id without canonicalising it.

For anything touching a trust boundary, a migration, money, or state more
than one person can reach, also reproduce each finding against a running
server before acting on it.

**Verify against something running, not only the suite.** The same #80 change
passed 378 tests with a bug that took the whole web server down on any duplicate
request — the route tests' fake `res` recorded a status instead of enforcing
that headers are written once. Start the server, curl the endpoints, include the
error paths.
