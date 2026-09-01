# OpenTutor — Senior Backend Engineer Review

Production readiness assessment. Focus on reliability, cost, observability, and what breaks under real load.

---

## 1. Hot Path Analysis: Lesson Delivery

A standard Socratic lesson makes **5 LLM calls**:

| Call | Model | Est. tokens (in+out) | Purpose |
|---|---|---|---|
| Lesson plan generation | strong (Sonnet) | ~4000 in + ~800 out | Generate diagnostic, follow-up, application |
| Retrieval quality assessment | cheap (Haiku) | ~200 in + ~10 out | Score free-text recall for SM-2 |
| Socratic response 1 (diagnostic) | cheap (Haiku) | ~1500 in + ~200 out | Respond to diagnostic answer |
| Socratic response 2 (follow-up) | cheap (Haiku) | ~2000 in + ~200 out | Respond to follow-up answer |
| Socratic response 3 (application) | cheap (Haiku) | ~2500 in + ~200 out | Final feedback |

**Total: ~11,100 tokens per standard lesson.** Deep mode adds 2 more cheap calls (~14,000 tokens). Quick mode is 3 calls (~5,000 tokens).

**Latency budget:** Each Claude call takes 2-8 seconds (SDK) or 15-60 seconds (CLI). Standard lesson: ~15-30s total wall time (SDK), not counting student think time. That's acceptable for a conversational flow — the student is typing between calls. BUT: the initial lesson plan generation blocks for 5-10s before the first message. That's visible dead time after `/next`. Consider streaming or sending a "thinking..." message.

**When Claude is down:** Zero resilience. `generate()` has retry with 3 attempts and 2s base delay (`helpers.js`), but there's no circuit breaker, no fallback, and no timeout alarm. If Anthropic is down for 5 minutes, the bot silently hangs on every lesson request. The `claude.js` CLI backend has a 120s timeout, but the SDK backend has no explicit timeout — it relies on the HTTP client's default, which could be much longer.

**Recommendation:**
- Add an explicit timeout to the SDK adapter (30s for cheap, 60s for strong)
- Add a "thinking..." message before the first LLM call
- Add a circuit breaker: if 3 consecutive calls fail, stop trying for 60s and tell the student

---

## 2. State Management

Three storage backends exist: file-based (`TutorState`), SQLite (`TutorStore`), and Supabase (`SupabaseStore`). The bot uses SQLite, the web server uses SQLite, the Vercel API uses Supabase or SQLite.

**The problem:** The interfaces aren't actually compatible. `TutorStore` methods are synchronous (better-sqlite3 is sync). `SupabaseStore` methods are all async. Code written for one won't work with the other without `await` everywhere. The `api/lesson.js` calls `state.getNextLesson()` and `state.markLessonComplete()` — if `state` is a `SupabaseStore`, those return Promises that are never awaited.

Specifically, `api/lesson.js:13` does `const lesson = state.getNextLesson(topicSlug)` — this returns a Promise when using Supabase, not a lesson object. The entire Vercel deployment is broken for Supabase.

**Recommendation:**
- Make all store methods async across both implementations. `better-sqlite3` is sync but wrapping in `async` is cheap and removes the interface mismatch.
- Or: make `TutorStore` the only store, use a Postgres driver that's also sync (not Supabase client).
- For shipping: pick one. SQLite for local, Supabase for Vercel. Don't pretend they're interchangeable — they're not.

---

## 3. Active Lesson State

`activeLessons` at `lesson.js:61` is a plain JavaScript object. This is the most critical state in the system — it tracks where a student is mid-conversation (which step, what they've said, what the lesson plan is).

**What breaks:**
- Bot process restarts (deploy, crash, OOM): all active lessons lost. Student's next message routes to general chat.
- Vercel serverless: every invocation is a new process. `activeLessons` is always empty. **The entire Socratic flow is impossible on Vercel** without external state. The `api/lesson.js` endpoint uses the old single-shot `buildTeacherPrompt`, not the Socratic flow, so it sidesteps this — but that means the web/Vercel experience is fundamentally worse.
- Multiple bot instances (scaling): active lessons aren't shared between processes.

**Recommendation:**
- Persist `activeLessons` to SQLite/Supabase. On each step, write the state. On each message, read it back.
- For Vercel: store active lesson state in a Supabase table with a TTL (auto-expire after 30 minutes).
- This is not optional — it's a showstopper for any production deployment.

---

## 4. Cost Estimate

Using Anthropic API pricing (Sonnet: $3/$15 per MTok in/out, Haiku: $0.25/$1.25 per MTok in/out):

| Mode | Calls | Input tokens | Output tokens | Cost |
|---|---|---|---|---|
| Quick | 3 | ~4,000 | ~400 | ~$0.013 |
| Standard | 5 | ~10,300 | ~1,400 | ~$0.054 |
| Deep | 7 | ~14,000 | ~2,000 | ~$0.076 |

**Per student per day** (3 scheduled pushes: morning standard, midday quick, evening quick): ~$0.08/day = ~$2.40/month.

**At 100 students:** ~$240/month. Sustainable.
**At 1,000 students:** ~$2,400/month. Tight but doable with Haiku-heavy routing.
**At 10,000 students:** ~$24,000/month. Need to optimize — cache lesson plans for shared curricula, use Haiku for more steps.

**Hidden costs:**
- Curriculum pipeline: 6-12 LLM calls per topic generation × $0.05-0.20 per call = $0.30-2.40 per new topic. One-time, amortized over all students using that topic.
- Research refresh: 1 LLM call per stale topic check. With 292 topics checked monthly: minimal.
- The `assessRetrievalQuality` LLM call adds ~$0.0003 per lesson. Negligible.

**Recommendation:** Costs are reasonable. Main optimization: cache lesson plans for students on the same topic at the same lesson. Two students on Day 5 of auction-theory don't need separate plan generations — the plan only varies by student model, and the variation is in the directives text, not the structure.

---

## 5. Error Handling

**Mid-lesson LLM failure:** If a Socratic response call fails at step 2 of 4, the `handleLessonAnswer` function throws. The router catches it via the `try/catch` in `route()` and logs the error. The student gets... nothing. No error message, no recovery. The active lesson state is still in memory with `step: 2`, so the next message will retry the same step — but with the student's original answer lost (it was pushed to history before the generate call, so actually it's preserved). The retry might work, but there's no user-facing indication of what happened.

**Lesson plan parse failure:** Handled with a fallback at `lesson.js:172-183`. The fallback plan is generic but functional. Good enough. But there's no metric tracking how often this happens — could be 0% or 20% and you'd never know.

**Recommendation:**
- Wrap `handleLessonAnswer` in a try/catch that sends "Sorry, let me try that again" and retries once.
- Add a parse failure counter to the lesson log.
- Add a global error handler for the bot that sends a user-facing message on unhandled errors.

---

## 6. Vercel Deployment: Stateful Conversation on Stateless Platform

**This is architecturally broken.** The Vercel API routes (`api/lesson.js`) use `buildTeacherPrompt` — the old single-shot content dump, not the Socratic flow. There is no `api/lesson/answer.js` endpoint for the multi-turn conversation. Even if there were, `activeLessons` is in-memory and each Vercel invocation is a fresh process.

To make Socratic delivery work on Vercel:
1. Store active lesson state in Supabase (with the lesson plan, step index, conversation history)
2. Add `POST /api/lesson/start` — generates plan, stores state, returns first message
3. Add `POST /api/lesson/answer` — reads state from Supabase, generates response, updates state
4. Add auto-expiry (TTL) so abandoned lessons don't accumulate

This is a significant amount of work, but it's the only way to get the same teaching quality on web as on Telegram.

**Recommendation:** Build this before launching the web UI. A one-shot lesson dump is worse than no web UI — it sets wrong expectations.

---

## 7. Testing Gaps

179 tests, but the critical path is untested:

| Component | Tested? | Risk |
|---|---|---|
| State CRUD (TutorState, TutorStore) | Yes | Low |
| Prompt builders (structure, context injection) | Yes | Low |
| Adapter factory (resolution) | Yes | Low |
| Research formatting | Yes | Low |
| **Lesson delivery flow** | **No** | **Critical** |
| **Socratic response generation** | **No** | **Critical** |
| **Student model computation** | **No** | **High** |
| **DeliberatePractitioner evaluation** | **Partially** (inline test in commit) | **Medium** |
| **Mode selection logic** | **No** | **High** |
| **Active lesson state transitions** | **No** | **Critical** |
| **Telegram message formatting** | **No** | **Medium** |
| **SupabaseStore async behavior** | **No** | **High** |

The most important test to write: a mock-based integration test of `deliverNextLesson` → `handleLessonAnswer` × 3 → `completeSocraticLesson` that verifies the full lesson lifecycle with a fake LLM adapter returning canned responses.

---

## 8. Observability

Structured logging with pino is good. What's missing:

- **No metrics:** No request counts, latency percentiles, error rates, LLM call durations aggregated. Pino logs are individual events — you can grep them but can't dashboard them without a log aggregator.
- **No alerts:** If the bot stops responding, nobody knows. No health check endpoint, no heartbeat.
- **No LLM cost tracking:** Token usage is returned by the SDK adapter but never aggregated or logged in a queryable way.
- **No lesson analytics:** Which lessons have the highest failure rate? Which topics get abandoned? Where do students drop off? This data exists in learning.md and progress.json but there's no way to query across students.

**Recommendation for launch:**
- Add a `GET /api/health` endpoint that checks DB connectivity and returns uptime
- Log LLM token usage per call as a structured field (already partially there via `usage` in adapter responses)
- Add a daily summary cron that aggregates lesson counts, error rates, and cost

---

## 9. Security

**Telegram webhook:** There's no `api/telegram.js` yet (issue #61), but when it's built, it MUST verify the webhook secret. Telegram sends a hash in the `X-Telegram-Bot-Api-Secret-Token` header — without checking it, anyone can POST fake updates to the endpoint.

**Other issues:**
- `scripts/web/server.js` has no authentication. Anyone on the network can deliver lessons, read student data, and add topics. For local dev this is fine; for Vercel deployment it's not.
- The `.env.example` documents `SUPABASE_SERVICE_ROLE_KEY` — this key bypasses RLS. If it leaks (client-side JS, logs, error messages), all data is exposed. The Vercel API routes should use the anon key with RLS policies, not the service role key.
- No rate limiting on any endpoint. A bad actor could trigger hundreds of LLM calls via `/api/lesson` or `/api/chat`.
- The `api/_lib/init.js` creates a global singleton adapter and store. In serverless, this is fine (one per cold start), but the store keeps a SQLite connection open — which won't work on Vercel (no persistent filesystem).

**Recommendation:**
- Add webhook secret verification (required for Telegram production)
- Add basic auth or API key for the web endpoints
- Switch Vercel from service role key to anon key + RLS
- Add per-IP rate limiting (Vercel has built-in rate limiting via edge config)

---

## 10. What I'd Fix Before Production

In priority order:

1. **Persist active lesson state** — either in SQLite (bot) or Supabase (Vercel). Without this, the Socratic flow breaks on any restart.
2. **Fix SupabaseStore sync/async mismatch** — the API routes call sync methods on an async store. This will crash on first request.
3. **Add LLM call timeout** — 30s for cheap, 60s for strong. Without it, hung requests block the bot indefinitely.
4. **Add webhook authentication** — required before Telegram deployment.
5. **Add health check endpoint** — `GET /api/health` that verifies DB + returns status.
6. **Add "thinking..." message** — send typing indicator + short message before the first LLM call. 5-10 seconds of silence after `/next` feels broken.
7. **Build Vercel Socratic endpoint** — `POST /api/lesson/start` + `POST /api/lesson/answer` with Supabase state.
8. **Add integration test for lesson lifecycle** — mock adapter, verify full Socratic flow from start to completion.
9. **Add basic rate limiting** — prevent abuse of LLM-calling endpoints.
10. **Add cost tracking** — log token usage per call, aggregate daily.
