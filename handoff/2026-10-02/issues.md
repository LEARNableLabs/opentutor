# Issues to open

Drafted from the v0.1 readiness audit (8 read-only auditors, two skeptics per claimed blocker, one completeness critic) plus items from this session. Nothing here is opened on GitHub yet: edit, then open the ones you want (one issue each, `Closes #N` in its PR).

## The core learner journey on the web

**Verdict: ready-with-caveats.** The core web journey (landing, signup, onboarding, course choice, lesson start, answering, completion, next lesson, Topics, trial limit, connect-your-own-key) is coherent and defensively built on origin/main a2ccd3f, and the public surface is healthy. I found no blocker in this dimension. The caveats are mostly honesty and unhappy-path polish. (1) The 3-free-lessons-then-own-OpenRouter-key cliff is never disclosed before signup, and the closing line promises "your own topics", which trial accounts cannot create. (2) The shared free-trial budget is about 300 model calls a day, roughly 15 complete trials a day, so a launch spike would show everyone "used up for today". (3) Chat forgets the previous turn. (4) A dropped connection mid-answer clears the student's text and shows raw browser errors (#194). (5) The end of a course contradicts itself and is a dead end (#213). (6) The landing page overclaims spaced repetition for the web. (7) Password reset does not exist, so a forgotten password locks the student out until the operator intervenes (#133). (8) The phone journey has never been checked on a device (#193). None of these loses data or breaks the core path, and each is fixable with copy or small code changes or stateable as a known limit. I did not exercise any model-backed endpoint, since production probes were GET/HEAD only. Latency of the first lesson and live signup behaviour are therefore unmeasured.

Sound:
- Public surface is healthy. Probed with GET/HEAD: /, /login.html, /learn.html, /privacy.html and /404.html all return 200 text/html. Unknown paths return a real 404 with the branded page. /api/catalog returns 200 with all 293 topics (126 KB, cached 5 minutes, ~0.1s). /api/account unauthenticated returns {user:null, available:true}. Protected routes return 401 or 405 correctly. Security headers are set on every response (CSP frame-ancestors 'none', X-Frame-Options DENY, nosniff, Referrer-Policy). vercel.json defines them.
- Landing page is honest and complete: it states the AI-mistakes disclosure, browsing needs no account, there is a working catalog search, a live capped demo that degrades to a signup prompt, per-topic signup deep links (?topic=), and a signed-in visitor is switched to 'Continue learning' (welcome.js:87-104). Privacy page is specific: what is kept, what goes to AI models, the unfinished-lesson retention, hashed-IP demo counts, deletion steps and the pending-queue caveat.
- Lesson protocol is robust. Each answer names its lessonId and step, and a stale tab or double send gets 409 without a model call (api/lesson.js:114). A lesson completes once via an insert-if-absent claim (lesson.js:186-188). A reload resumes without a model call or a trial slot (lesson.js:226-233). Hidden grading blocks are stripped from the reply and from student input. Only trusted links stay links (lesson.js:162). Failures after streaming starts arrive as SSE error events, never a second status (lesson.js:68-75). A completion-save failure is reported honestly rather than celebrated (lesson.js:218, app.js:499).
- Trial and key handling is careful. Insert-if-absent claimSlot gives caps that hold across serverless instances. There is a per-account cap plus a per-day cap, and slots are refunded only when the provider refused outright (llm-access.js:111-186). Student keys are AES-256-GCM sealed and bound to the student (llm-access.js:17-23), never sent back. OAuth PKCE uses a signed 10-minute flow cookie (openrouter.js:37-45), and a pasted key is validated with OpenRouter before it is kept. Every route turns KeyRequired into a 402 with the same body, and the client turns any 402 into the connect banner (app.js:19-23). Trial state survives disconnect.
- Sessions and account handling are well thought out. HttpOnly cookies with a 30-day refresh. A single-flight refresh after a 401, then a retry of the request (app.js:6-18). A 5xx is treated as an outage, not a sign-out (app.js:15, :1253-1259). POSTs need a same-origin Origin header. Account delete is data first, then the auth user, with the operator able to finish a failed step. Login and signup errors do not reveal whether an email is registered. Password and key fields are cleared after use.
- Frontend handles races and returning students well. latestChoice and lessonStart numbering means a late reply never takes the screen from a newer choice (app.js:354-373). Returning students get a welcome with where each course stands and a Continue button for a lesson in flight (welcome.js, lib/core/welcome.js), and the picker lands on the latest topic. A corrupt lesson record costs only its line on the welcome screen (welcome.js:15). Model output is escaped before markdown formatting (app.js:131-150).
- Test volume and CI are strong: 1257 tests across 91 files, CI green on main at a2ccd3f, with the web journey covered through lesson, trial-route, connect, welcome, login, topic-recovery and server tests, and a vm-based harness that runs the real public/app.js.

### JRN-1 (should-fix, hours): The free-trial cliff is not disclosed before signup, and 'explore your own topics' is false for trial accounts

**Why it matters.** A first-time visitor expects a free tutor. After three lessons they must create an OpenRouter account and add credits, a big step for a non-technical student. Learning this at the 4th lesson feels like a bait-and-switch, and the 'own topics' line is a plainly false claim for trial accounts.

**Evidence.** public/index.html:53 and :97 say 'Create a free account', and :167 says 'Sign in to take lessons, save progress, and explore your own topics.' public/login.html mentions no limit. The first mention of any limit is after login: the '3 of 3 free lessons left' status (public/app.js:1214) or a 402. Own topics need the student's own key: lib/core/llm-access.js:236 (canCreateTopics) and :229 (custom_topic). Chat needs it too (llm-access.js:228). The Topics tab copy (public/learn.html, 'Add a topic') also implies custom topics are open to everyone.

**Fix.** Say it up front in the hero, signup card and privacy page: '3 free lessons, then connect your own OpenRouter key (about cents per lesson)'. Change the closing line to drop 'explore your own topics', or say 'with your own key'. Add one sentence of context on the connect banner about what OpenRouter is and what a lesson costs. Mention in the Topics 'Add a topic' copy that custom topics need a connected key.

### JRN-2 (should-fix, hours): The shared free-trial budget supports only about 15 complete trials a day, so a launch spike shows everyone 'used up for today'

**Why it matters.** The cap protects the $10-a-month key well (claimSlot makes it race-safe), but it is the whole first-visitor experience on any day with real traffic. The first tutor message a newcomer sees would be a refusal, and one scripted signup burst can exhaust it for everyone. That is cost safety by design, so it should be stated rather than discovered.

**Evidence.** llm-access.js:71 sets TRIAL_CALLS_PER_DAY = 300 across all accounts. Every trial call, including onboarding (up to 12), lesson plans, answers (up to 12) and the daily greeting, takes one slot (llm-access.js:166, :223). A full trial is about 15 to 25 calls, so 300 / 20 is about 15 students a day. After that every new or trial student gets the 'daily_limit' 402 on their first lesson or onboarding message ('Free lessons are used up for today... come back tomorrow'). The landing demo has its own cap of 300 a day (api/_lib/demo.js:12).

**Fix.** State the daily free capacity honestly where signup happens, with a path to 'connect your own key now'. Show the daily_limit state on the landing demo and signup page. Reserve some of the 300 calls for returning trial students (a per-day cap on new trial starts), or raise the cap with the budget once real usage is known. Log the daily-limit hit count so launch-day demand is visible.

### JRN-3 (should-fix, hours): No password reset and unverified emails: a forgotten password is a permanent lockout until the operator steps in

**Why it matters.** The student loses their progress, free trial and saved OpenRouter key access. The privacy page names no operator route for this, and there is no email on file that can be trusted. The login page does disclose it honestly, so this is a stated limit that needs an operator procedure.

**Evidence.** api/account.js:206-208 returns 404 'Password reset by email is not available yet.' The forgot link is hidden (public/login.js:60). public/login.html:71 shows the static note 'Password reset by email isn't available yet'. Issue #133 (open) says: 'a student who forgets their password needs the operator (the Supabase dashboard), and nothing proves who owns an address.' Sign-in with an unconfirmed email is allowed only because confirmation is off (api/account.js:95).

**Fix.** Ship as a stated limit. Add the same sentence to the privacy page and the README. Write a short operator runbook ('reset a password in the Supabase dashboard') and name a contact. Land #133 soon after v0.1. Also add 'forgot' to the 'allowed' modes in login.js, or drop the unreachable forgot/reset UI branches.

### JRN-4 (should-fix, hours): Chat forgets the previous turn

**Why it matters.** 'Tell me more' or 'why?' follows get a context-free answer. Chat is one of the three main tabs and looks like a conversation. It is also gated behind the student's own key (llm-access.js:228), so the students who pay are the ones who hit this.

**Evidence.** api/chat.js:62-66 sends only `[{ role: 'user', content: text }]`. public/app.js:826-830 posts only `{ message }`, though the UI shows a threaded conversation. Open issue #252 ('No memory: POST /api/chat sends only the latest message'). The system prompt carries no learning context beyond the profile (api/chat.js:52-60).

**Fix.** The client already holds the thread. Send the last ~10 turns, trimmed with trimHistory/turnText as onboarding does, and have the server cap them. That is a few lines. Or label the tab 'Ask a question' until #252 lands and state the limit.

### JRN-5 (should-fix, a day): A dropped connection mid-answer clears the student's text and shows raw browser errors (#194)

**Why it matters.** On phones, switching apps while a reply streams is routine and kills the request. The student must retype their reasoning, may hit a confusing 409 and need a reload. The server side is sound: no double advance, the completion claim is permanent (lesson.js:186-188), and a reload resumes (lesson.js:226-233). It is the client recovery that is missing.

**Evidence.** public/app.js:464-469 appends the answer bubble and clears the input before the request. On failure, :510 shows 'Error: ' + err.message, which is a raw 'Failed to fetch' or 'Load failed', or app.js:90 'Connection ended before the reply finished'. No test mentions that string (grep of tests/). If the server accepted the turn before the drop, a retry with the old step gets 409 'This lesson has moved on... Reload the page' (api/lesson.js:29, :114). Open issue #194 describes the same.

**Fix.** Keep the text in the box until the turn succeeds, or restore it in the catch. Map network errors to a plain 'Connection lost. Your answer is still here, tap Send to try again.' On a 409 or a network error, call the resume path (a POST without `answer`) to show where the lesson actually is. Add a test that truncates the SSE stream.

### JRN-6 (should-fix, hours): End of a course contradicts itself and is a dead end (#213)

**Why it matters.** The first student to finish a course, the one who got the most value, meets a contradictory screen and no next step. It is the natural moment for retention.

**Evidence.** api/lesson.js:311 returns { done: true, message: 'All lessons completed!' }. public/app.js:554-562 (showCompletion) shows that message, then calls showCelebration (:564-570), which adds 'Lesson complete. Choose Next lesson when you are ready for the next one.' The 'Next lesson' button just returns the same message. The welcome card's button for a finished course is 'Open' (app.js:1009). Nothing suggests a next topic. Issue #213 is open. The only test (web-connect.test.js:1848) covers the chat-offer wording, not the Learn tab.

**Fix.** In showCompletion, skip showCelebration and show 'You've finished {course}. Pick your next topic in Topics' with a button to Topics. Optionally suggest 2 or 3 related catalog topics. Change the finished-course welcome button from 'Open' to 'Find your next topic'.

### JRN-7 (should-fix, hours): The landing page overclaims spaced repetition for the hosted web app

**Why it matters.** A headline feature of the hosted product is not there. The second sentence ('concepts that tripped you up come back for a retest') is accurate, but the headline promises more. For a first public release this is the claim a skeptical reader will test.

**Evidence.** public/index.html:119-123: 'Spaced Repetition. Data-driven recall scheduling — never forget what matters.' lib/core/progress-stats.js says 'the web has no spaced-repetition record until #214'. Issues #213 and #214 are open ('Nothing measures whether students remember what they were taught'). SM-2 exists only in the Telegram bot (scripts/bot/spaced-repetition.js).

**Fix.** Reword to what the web does: 'Concepts you struggle with come back in later lessons for a retest. Full spaced review is on Telegram.' Soften 'never forget'. Keep the Bloom 'most effective ever measured' line (index.html section heading) attributed or softened.

### JRN-8 (should-fix, a day): The phone journey is unverified on a device, and the lesson layout is a nested scroller with a single-line input

**Why it matters.** Most first visits to a shared link are on phones. Keyboard overlap, nested scrolling and reachability of the Send button are exactly what unit tests cannot see.

**Evidence.** Issue #193 (open) says the authenticated journey was not validated on a phone. public/style.css:432 sets #lesson-conversation to max-height 58vh with its own scroll, and style.css:442-443 applies 100dvh only to the chat. 'vh' ignores the on-screen keyboard on iOS Safari. The answer field is `<input type="text">` (learn.html:86). Tests use a DOM double with 'no layout in a double' (web-connect.test.js:25), so no CSS is exercised. Positives: header wraps (style.css:99-104), 16px gutters, and a phone media block at :840.

**Fix.** Before announcing, run a 30-minute pass on one iPhone and one Android phone: sign in, pick a topic, answer 3 turns with the keyboard open, background and return, finish a lesson. Fix what shows (likely dvh units and scroll-into-view on focus). Record the result on #193 and state it as a known limit if not done.

### JRN-9 (nice, hours): The model timeout exceeds the function limit, and there are no retries

**Why it matters.** A slow or flaky provider turn costs a trial student one of their 3 lessons and shows a technical message. Likely rare with a Flash model, but it is the exact failure a launch-day provider blip produces.

**Evidence.** lib/adapters/openai.js:48 gives the 'strong' tier a 120s timeout (the lesson plan uses it, api/lesson.js:332), while vercel.json sets maxDuration 60 for api/**. openai.js:43 notes 'single attempt, no retries'. A call killed by the platform has no err.status, so the trial slot is kept (llm-access.js:176-181) and the client sees app.js:90's 'Connection ended before the reply finished'. I could not measure plan latency (no POST to model endpoints).

**Fix.** Set the strong-tier timeout under maxDuration (about 50s). Retry once on 429/5xx or a timeout before failing. Show 'The tutor is slow right now. Try again' with the stream-ended case, and refund the slot when the plan call failed before any reply was shown.

### JRN-10 (nice, hours): A malformed saved lesson record bricks that topic for the student

**Why it matters.** Unlikely, since the app writes these itself, but a partial write or a hand edit leaves a student unable to start or resume that course with no way to clear it. The welcome screen already shows the code authors thought of this case.

**Evidence.** api/lesson.js:101 does `JSON.parse(raw)` with no guard (also :130). lib/core/welcome.js:15-17 guards the same record with parsed(). On a parse error the SSE path sends 'The tutor is unavailable right now' (lesson.js:73-74), every time, with no self-repair.

**Fix.** Wrap the parse in try/catch and treat a bad record as 'no active lesson' (log it). Keep `reviews` handling as is.

### JRN-11 (nice, hours): Review lessons spend the trial turn budget without spending a lesson slot

**Why it matters.** A struggling student on a trial could be told 'You've used your 3 free lessons' while on lesson 2 or 3.

**Evidence.** A BLOCK review starts with no model call (api/lesson.js:284-308, 3 steps from deliberate-practice.js reviewLesson), so it takes no 'lesson' slot, but each answer takes a 'turn' slot (llm-access.js:205-208). The turn budget is TRIAL_LESSONS * 4 = 12 (llm-access.js:61). Three lessons of 4 steps plus one review would need 15 turns. By code reading only, not reproduced.

**Fix.** Count turns per lesson (a fixed number of answers per lesson slot), or add headroom for up to 2 reviews (MAX_REVIEWS, lesson.js:28) to TRIAL_TURNS. Add a trial-route test with a BLOCK.

### JRN-12 (nice, hours): Several failures show nothing or a raw message

**Why it matters.** Minor, but the Topics tab is the main way to choose a course and a transient 500 looks like an empty library.

**Evidence.** loadTopics (public/app.js:593-599) throws on a failed /api/topics inside a click handler (app.js:165), which leaves a blank Topics list with no message. The onboarding failure path pushes the student's turn into history before the reply arrives (app.js:1051, :1075-1077), so a retry sends two user turns in a row. Chat and lesson errors print 'Error: ' + the raw message (app.js:510, :840, :1077).

**Fix.** Catch in loadTopics and show 'Could not load topics. Try again.' with a retry button. Drop the history push on failure. Use one friendly error helper for 'Failed to fetch' and 'Load failed'.

### JRN-13 (nice, hours): Clean URLs and robots/sitemap are missing

**Why it matters.** Someone typing or sharing /privacy or /login by hand lands on a 404, and a launch post often uses clean paths.

**Evidence.** Verified with curl: https://opentutor-gg.vercel.app/login, /learn and /privacy return 404, while /login.html, /learn.html and /privacy.html return 200. /robots.txt and /sitemap.xml return 404. vercel.json has no cleanUrls setting. /404.html itself returns 200 (harmless).

**Fix.** Add "cleanUrls": true to vercel.json (and keep the .html links working). Add a small robots.txt.

### JRN-14 (nice, a day): The answer box and rendering suit prose, less so code and math; tutor replies are not announced to screen readers

**Why it matters.** Among 293 topics many are technical. Polish rather than a defect, and a stated limit is fine for v0.1.

**Evidence.** learn.html:86 is a single-line <input type="text">, so multi-line or code answers cannot be entered, although the keydown handler (app.js:248-253) supports Shift+Enter. md() (app.js:131-149) turns a student's `2*3*4` into italics, and math rendering is #288. There is no aria-live on #lesson-conversation or #chat-messages (only the companion has role=status). md() itself escapes first and only trusted https links are kept, which is sound.

**Fix.** Switch the lesson and chat inputs to an auto-growing <textarea> with Enter to send. Render student bubbles as plain text. Add role="log" aria-live="polite" to the conversation containers.

### JRN-15 (nice, days): Tests are broad but use a DOM double: no real-browser journey, and some unhappy paths are untested

**Why it matters.** The riskiest unhappy paths for v0.1 (mobile, dropped connections) are the ones the tests cannot see. Green CI says the logic is right, not that a student can use it on a phone.

**Evidence.** 1257 tests (1252 pass in my archive copy; the 5 failures and 1 failed file come from the missing .git, e.g. 'fatal: not a git repository' from git ls-files). The frontend tests run public/app.js in a vm with hand-written elements (tests/web-connect.test.js:7-55). The journey tests cover lesson protocol, staleness, resume, trial caps, connect flow, onboarding, welcome, races and delete. Not covered: no real-browser or end-to-end run (open issue #296), no CSS or phone layout, no truncated or dropped SSE stream ('Connection ended' appears in no test), no Learn-tab end-of-course screen, and no check of the streamed lesson POST being replayed after a 401 refresh.

**Fix.** For v0.1, add a one-page manual smoke checklist run against the preview deployment (sign up, trial lesson, connection drop, 4th lesson cliff, connect key, finish a course, phone). Add the stream-truncation and end-of-course tests alongside the JRN-5 and JRN-6 fixes. Do the real-browser journey from #296 after release.

## Security and trust boundaries

**Verdict: ready-with-caveats.** I found no exploit path that reads or writes another student's data, leaks a student's OpenRouter key, or runs up the deployment's model bill past its caps. The tenancy, session, CSRF, RLS, key-sealing and output-escaping work is careful and tested, and git history (298 commits, all refs) contains no real secrets. The caveats are about abuse and availability at public-launch scale. Signup has no email proof, so the free-trial budget (300 calls a day, roughly 10 full trial users) can be drained by one script or by launch-day traffic. Supabase Auth's per-IP rate limit is probably shared by all students. The shared and admin passwords have no brute-force limit, and per-account storage has no cap. Public-repo hygiene (secret scanning, SECURITY.md) is missing. All of these are fixable in hours to a day. The signup and trial limits are already stated in docs/deployment.md and should be repeated in the release notes. I did not POST to production, so the signup oracle (SEC-3), the shared auth rate limit (SEC-1) and the password strength (SEC-4) are inferred from code, docs and GET probes rather than observed.

Sound:
- Per-student isolation is enforced at the store boundary. SupabaseStore is scoped at construction and every query carries .eq('user_id', this._uid) (lib/core/supabase-store.js:73-135). The userId comes only from a verified credential (api/_lib/auth.js authenticateRequest), never from the body or a header. assertUserId canonicalises ids, acct- is reserved for Supabase accounts (students.js, student-auth.js:13), and tests/tenancy.test.js plus tests/api-student-routing.test.js cover it. Account deletion wipes kv, memory, lessons_completed, curricula and domain_files (deleteAllStudentState) and leaves a disabled tombstone with no name or email.
- Sessions are well built. Supabase JWTs are verified server-side on every request with auth.getUser. Cookies are HttpOnly, SameSite=Lax and Secure on Vercel. Every cookie-authenticated non-GET request requires an exact same-origin Origin (auth.js:75, account.js:29). An invalid account cookie never falls back to root access (auth.js:76-82). The PKCE flow and recovery grants are HMAC-signed and bound to the user and token. Error text, status codes and logs avoid echoing emails (account.js:257-258).
- Admin routes are closed by default: an unset OPENTUTOR_ADMIN_PASSWORD gives a 503 even locally. The password is a separate secret from the student one, compared in constant time, and carried in a header only (no cookie, so no CSRF). Live probe: /api/admin/students returns 401 'Admin password required.' without it. api/build-topic.js is not publicly routable (probe returns 404).
- The OpenRouter key handling is sound. Keys are sealed with AES-256-GCM, with a key derived by HKDF from the Supabase secret and the student id as AAD, so a copy in another student's record will not open (llm-access.js:11-38). A pasted or OAuth-exchanged key is validated against OpenRouter first (openrouter.js:60-72). Keys are never returned: GET gives only connected and credit info. A student's call never falls back to the deployment key (StudentOpenRouterAdapter). Upstream error text is truncated and sk- values are masked (adapters/openai.js:51), and routes return generic errors.
- Cost controls are atomic. claimSlot inserts if absent and reads back who won, so caps hold under concurrency. A trial student must pre-claim a lesson, turn or onboarding slot and then a shared daily slot before any model call. The demo claims per-IP (HMAC, salted by day) and per-day slots first, caps input at 300 characters and output at 150 tokens. Custom topics, chat and builds need the student's own key (adapterFor, canCreateTopics). Stored profile text is capped when it reaches prompts and wrapped as untrusted data.
- Output handling and outbound fetches are tight. md() escapes everything before adding tags, and anchors exist only for links the server already restricted to the lesson's resources, Wikipedia or a YouTube search (links.js, with a fixed-point unlink loop for nested links). The only server-side fetch of model-influenced URLs on the web path is a Wikipedia HEAD with a fixed origin and redirect:'error'. The Claude CLI adapter runs with '--tools ""' and an argument array (no shell).
- Supabase posture is right. RLS is enabled on every table, with policies TO service_role only (migrations 001, 002 repair earlier policies that applied to every role, 004 for domain_files). The public/ bundle has no Supabase URL or anon key, and the browser never talks to Supabase. Account GET responses and all private API responses are Cache-Control private, no-store.
- Production posture checks out. A preview deployment URL I found redirects to Vercel SSO (302 to vercel.com/sso-api), so Deployment Protection is on. Production returns HSTS, X-Frame-Options, nosniff, Referrer-Policy and frame-ancestors on API, static and 404 responses. /package.json, /.env, /lib/..., /api/_lib/... and /.git/config all return 404. The API sends no CORS headers.
- Secrets hygiene: scanning all 298 commits across all refs for sk-or-v1-, sk-ant-, JWTs, sb_secret_, sbp_, ghp_, AKIA, Slack and Telegram token patterns found only obvious test fakes (sk-or-student, sk-or-test and similar). .env is gitignored, .env.example is blank, and CI uses no secrets and no pull_request_target. A local server run showed static-file path traversal attempts all return 404.
- The self-host path is thoughtfully guarded: a server with no password answers only loopback requests with no proxy headers and no foreign Origin or Referer (auth.js:44-64, #221). npm run host generates long separate passwords in a private .env. The local server has a 1 MB body limit and a 60 s request timeout (#138). docs/deployment.md and the privacy page are candid about limits: no email confirmation, shared trial budget, no password reset, an unfinished lesson has no expiry, and how data is deleted.
- The remaining test suite is healthy on a fresh extract: 1252 of 1257 tests pass. The only 5 failures are git-dependent checks in tests/workspace-seeding.test.js (plus one integration file) that need a .git directory, which the archive extract lacks, so they are not security-relevant.

### SEC-1 (should-fix, hours): Supabase Auth rate limits are probably shared by every student, so one script or a launch spike can lock everyone out of sign-in

**Why it matters.** On the day v0.1 is announced, legitimate signups and logins can hit the shared bucket and the 'core journey' (create account, sign in) fails for everyone. A single attacker can keep every student locked out at trivial cost.

**Evidence.** api/account.js:241-269 calls client.auth.signUp / signInWithPassword, and lib/core/accounts.js:123-135 builds the Supabase client with only URL and secret key. It forwards no client IP, so Supabase sees Vercel's egress IPs. Supabase limits sign-in and sign-up per IP, and the app maps a 429 to 'Too many sign-in attempts right now' (account.js:259-262). Issue #244 suspected exactly this ('all students may share one per-IP bucket') and was closed after only improving the log and message; the rate-limit key was never confirmed. Anyone can trigger it with POST /api/account {action:'login', ...} plus a same-origin Origin header, which curl can set. Not probed on production (POST is out of bounds), so this is inferred from code and #244.

**Fix.** Before launch, test from two networks how many signups or logins production allows per 5 minutes, and raise the limits in the Supabase dashboard (Auth > Rate Limits). Add a cheap per-IP limiter in front of Supabase, reusing claimSlot as api/_lib/demo.js does, so one client cannot spend the shared bucket. Add a Vercel Firewall rate-limit rule on /api/account.

### SEC-2 (should-fix, a day): The free-trial and demo budgets are tiny and trivially drained, so most launch-day visitors will see 'free lessons are used up today'

**Why it matters.** Cost abuse is bounded, but availability is not. The first visitors, or one attacker, exhaust the daily trial, and the 3-free-lessons promise breaks for everyone else the same day. The demo on the landing page can be turned off the same way.

**Evidence.** lib/core/llm-access.js:71 sets TRIAL_CALLS_PER_DAY = 300 across all accounts. A full trial is 3 lessons x ~5 calls, plus 12 onboarding messages and greetings, about 28 calls, so 300 calls serve roughly 10 trial students a day (docs/deployment.md says '~60 five-call lessons'). Signup needs no email confirmation (docs/deployment.md, 'Confirm email off'), so a script can create accounts and burn the day's budget in minutes. The demo allows 3 per IP and 300 per day (api/_lib/demo.js:11-12) and keys on the first X-Forwarded-For entry (demo.js:22-26), so an IPv6 /64 or proxy rotation bypasses the per-IP cap and only the global 300 binds. The money side is sound: the caps are claimed atomically (claimSlot, llm-access.js:115-125) and stay inside the $10 a month key limit.

**Fix.** Pick the budget the project can afford (3,000 calls a day is about $2.70) and set an OpenRouter spend alert. Add friction to signup: Turnstile or hCaptcha, an invite code, or email confirmation via #133. Reserve a share of the daily budget for signed-in trial users separately from the demo. Make the landing and learn pages say when the daily budget is spent, and mention the limit in the release notes.

### SEC-3 (should-fix, days): Accounts are created without proving the email: a registration oracle, email squatting, and no recovery

**Why it matters.** The privacy page says it stores 'your email address', but nothing proves it is the user's, the operator cannot contact users or recover accounts, and the 'no oracles' security rule is silently false in the production configuration.

**Evidence.** docs/deployment.md ('turn Confirm email off... no email step until #133') and #133. With auto-confirm on, Supabase signUp returns a session for a new address but a user_already_exists error for a registered one. account.js:256-278 turns the error into a 400 and the success into a 200 plus a session, so the response differs by whether the email is registered. That breaks the repo's own AGENTS.md rule 'No oracles... answer the same ... in status code as well as body'. The probe also creates the account as a side effect. Anyone can register victim@example.com with their own password, and the real owner is then refused ('Could not create the account') with no password reset (account.js:207-208 returns 404; login.html:66-72 says reset is unavailable). A student who forgets their password loses the account permanently. Not probed on production (POST); the claim follows from the documented setting and the code.

**Fix.** Ship #133 (SMTP, Confirm email on, reset) before or soon after v0.1. If v0.1 ships without it, say so plainly in the release notes (no email verification, no password recovery) and note the admin-API reset path.

### SEC-4 (should-fix, hours): The shared instance password and the admin password can be guessed without limit, and the shared password carries unlimited model spend

**Why it matters.** A weak operator password means unlimited spend on the deployment's key (the $10 a month key cap bounds it) or deletion of every student's data. An unthrottled public guessing endpoint is easy to find and easy to hammer.

**Evidence.** Production GET /api/topics returns {"error":"Password required."} and GET /api/admin/students returns {"error":"Admin password required."}, so both OPENTUTOR_PASSWORD and OPENTUTOR_ADMIN_PASSWORD are set. Both are compared with timingSafeEqual (api/_lib/auth.js:6-12, api/_lib/admin-auth.js:20-25) but with no attempt counter. The credential can be tried through the Authorization header on any route, through POST /api/account {action:'legacy'} (account.js:73-88), and on /api/admin/students. The shared password resolves to userId null, the unnamed root workspace, which is not an acct- account, so adapterFor returns the deployment key with no trial limit (llm-access.js:194). The admin password can issue a token for any student (admin/students.js:51-54) and delete data. #131 item 1 deferred this. The raw credential is also kept in the ot_legacy cookie for 7 days (account.js:86; HttpOnly, SameSite=Lax). I cannot check the password strength.

**Fix.** Confirm both are 32+ random characters (openssl rand -base64 32). Add a Vercel Firewall rate-limit rule on /api/account and /api/admin/*, or an attempt counter in the store. Consider unsetting OPENTUTOR_PASSWORD on production now that accounts exist, since authenticateRequest still honours it (auth.js:97-98).

### SEC-5 (should-fix, hours): Per-account storage is unbounded, so free throwaway accounts can fill the Supabase database

**Why it matters.** At about 4.5 MB per account, roughly 110 scripted accounts fill the Supabase free tier's 500 MB, which puts the whole database into read-only mode and takes the site down. Queued topic builds also use Vercel function minutes for anyone with a free-tier OpenRouter key.

**Evidence.** api/user.js:31-35 and 47-70 write the POST body as the profile with no per-field length or type checks (only the 4.5 MB platform body limit applies). Run locally, POST /api/user with a 900 KB context field returned 200 and was stored. The prompts cap what the model sees (lib/core/prompts.js:273/329/482/565 use 2,000-4,000 characters), but the stored row is not capped. api/add-topic.js and lib/core/topic-service.js have no limit on how many custom topics one account may queue, and each stores a curriculum plus files. Accounts are free and unverified (SEC-3).

**Fix.** Validate and cap profile fields in api/user.js (strings only, around 200 characters, context around 2,000). Cap custom topics per account (for example 10) and in-flight builds (for example 1). Alert on database size.

### SEC-6 (should-fix, hours): The Telegram bot answers any chat unless TELEGRAM_CHAT_ID is set, and the docs present that variable as scheduling only

**Why it matters.** v0.1 publicises the bot. A self-hoster who follows the quick start exposes a model-backed endpoint to the internet and pays for strangers' use. Group learning is a supported feature, so a plain default-deny is not obvious.

**Evidence.** scripts/bot/channels/telegram.js:50-52 filters only 'if (this.chatId && ...)'. With the variable unset, every update from anyone who finds the bot username reaches the router and the operator's LLM key, with no per-chat rate limit. docs/deployment.md:71 says 'Set TELEGRAM_CHAT_ID for scheduled daily lessons', and .env.example describes it as 'Restricts the bot to one chat', so the access-control role is easy to miss.

**Fix.** Add a TELEGRAM_ALLOWED_CHATS allowlist (or default-deny with an explicit open-group setting) and a simple per-chat daily cap. State the access rule in docs/deployment.md and the README.

### SEC-7 (should-fix, hours): The public repository has no vulnerability-reporting channel and its security features are off

**Why it matters.** A public v0.1 will attract reports. Without a private channel they land as public issues or never arrive. Secret scanning and push protection are free on public repos and guard against the one mistake that is expensive here, because .env holds production Supabase credentials.

**Evidence.** gh api repos/LEARNableLabs/opentutor shows visibility public with secret_scanning, push_protection and dependabot_security_updates all 'disabled'. gh api .../private-vulnerability-reporting returns {"enabled":false}. git ls-tree origin/main shows no SECURITY.md. CI (.github/workflows/ci.yml) uses plain pull_request with no secrets, which is good.

**Fix.** Enable secret scanning, push protection, Dependabot alerts and private vulnerability reporting. Add a SECURITY.md with a contact and the supported-version statement.

### SEC-8 (nice, hours): No script-src CSP, and the admin password sits in localStorage on the same origin as the student app

**Why it matters.** A single future markdown or rendering slip becomes script execution with access to the admin password. A CSP is the safety net for a renderer that handles model output.

**Evidence.** vercel.json:38-60 and tests/security-headers.test.js send only frame-ancestors 'none', X-Frame-Options, nosniff and Referrer-Policy. Vercel adds HSTS. public/admin.js:8-12 keeps the admin password in localStorage, the same origin as public/app.js. I reviewed the XSS surface and found it sound. md() (public/app.js:131-152) escapes everything first and turns only server-filtered links into anchors, and the other innerHTML uses escape their inputs. There is no known XSS today.

**Fix.** Add 'Content-Security-Policy: default-src self; script-src self; frame-ancestors none' (the pages use style attributes, so leave style-src open). Keep the admin password in sessionStorage, or in an HttpOnly cookie. Add Permissions-Policy.

### SEC-9 (nice, hours): npm audit reports one high advisory in a transitive build dependency

**Why it matters.** It is a noisy audit result for a public repo. It is not exploitable here.

**Evidence.** npm audit --omit=dev in an extract of origin/main: brace-expansion 4.0.0-5.0.11 (GHSA-q2hr-2g5m-vwhr, GHSA-qhr7-859c-m2p7, GHSA-6j4f-fj2g-mc7p, denial of service by pattern expansion), reached through @vercel/queue 0.6.0 > minimatch 10.2.6 > brace-expansion 5.0.9. It is the only finding. The pattern input is author-controlled, so I found no request that reaches it.

**Fix.** Run npm audit fix, or add an overrides entry for brace-expansion, and re-run CI. Enable Dependabot (see SEC-7).

### SEC-10 (nice, hours): Research fetches depend on third-party Invidious hosts and, in the Telegram bot path, follow model-supplied URLs with redirects

**Why it matters.** A lapsed or taken-over third-party domain could feed attacker-chosen text into a student's own custom-topic build. A bot operator's machine could be made to issue HEAD requests to internal addresses. Both are low impact.

**Evidence.** lib/core/research.js:402-404 hardcodes vid.puffyan.us, invidious.snopyta.org and inv.nadeko.net. Video IDs and titles from them feed prompts, and curriculum resources are treated as trusted links by keepTrustedLinks (lib/core/links.js:69-81, api/lesson.js:365). verifyUrls (research.js:511-526) does HEAD requests with default redirect following to URLs the model wrote, and is wired only in scripts/bot/curriculum.js:142. The web path (topic-builds.js) does not use it. All other outbound fetches use fixed origins, and the Wikipedia source check uses redirect:'error' (links.js:60). I found no SSRF reachable by a web student.

**Fix.** Drop the dead Invidious hosts, or validate videoId against /^[\w-]{11}$/. In verifyUrls, set redirect:'manual' and reject private or loopback hosts.

## Persistence and data integrity

**Verdict: ready-with-caveats.** I found no blocker in persistence. The #117 failure class (runtime state written to a read-only disk and the error swallowed) is closed on the production path. Every Supabase read and write on the web path throws on error, and the lesson route logs and surfaces a warning instead of faking success. A lesson is claimed with an atomic insert-if-absent and recorded with a primary-key upsert, so it cannot be double-counted. Account deletion wipes all five per-student tables, including the stored OpenRouter key and in-flight lesson, and the privacy page matches what the code stores. The caveats are all should-fix or smaller. Progress and streak are updated by an unguarded read-modify-write, which I reproduced as a lost update. The production store (SupabaseStore) is outside the two-store parity suites and is only tested against a hand-written fake whose delete does nothing. Migrations are applied by hand with nothing recording or checking the applied version. There is no backup, export or restore path, and the privacy page gives no way to request a copy of your data. Account-deletion recovery after a partial failure is awkward. Offline, 1252 of 1257 tests pass in a scratch extract; the 5 failures are git-dependent tests that cannot run because the extract has no .git.

Sound:
- Fail-loud database layer: SupabaseStore.readKV/writeKV/deleteKV, _completions, readCurriculum, readDomainFile, writeDomainFile and markLessonComplete all `throw error` (lib/core/supabase-store.js:91-122, 183-195, 237-246, 263-299), with a dedicated test file tests/supabase-store-errors.test.js. A failed read is not treated as 'no progress' (#157, #170). I ran 14 persistence files (tenancy, integration/*, supabase errors, accounts, students, topic builds, trial routes, async store) offline: 192 tests pass.
- The #117 root cause is closed: every runtime write (kv, completion, learning.md, practice-feedback.md, curricula) goes to Postgres, and the only disk write left in SupabaseStore is a build-time artefact that is explicitly safe to lose (supabase-store.js:279-289). The read-only-filesystem suite runs both file stores against a frozen workspace.
- No double-counting of a lesson: completion is claimed with insert-if-absent plus read-back (api/lesson.js:187-188; kv upsert with ignoreDuplicates at supabase-store.js:92) and recorded with a primary-key upsert on (user_id, slug, day) (migration 004:40). Stale-tab answers get a 409 via lessonId and step (lesson.js:55-57). Topic builds use compare-and-set with revision, lease and id fencing (supabase-store.js:124-133; topic-builds.js:84-85, 124).
- Lesson route degrades honestly: completeLesson failures are logged and surfaced as a warning to the student (api/lesson.js:192-197, 218); a failed read on lesson start propagates to a generic 500 instead of 'all lessons completed' (lesson.js:236-241); routes keep database error text out of responses (api/progress.js:19-22, api/topics.js:25-29); account auth maps a Supabase outage to 503 rather than signing the user out (api/_lib/auth.js:96-101, api/account.js:99-104, 119-128).
- Per-student partitioning is consistent: every table is keyed (user_id, ...) with user_id validated and canonicalised once in the constructor (supabase-store.js:51-54, progress.js:51-67); RLS is restricted TO service_role (002) and migrations 002-004 are idempotent and correctly ordered, with a fresh-project 001-004 path that works. SQLite migration recovers from an interrupted kv rebuild inside a transaction (lib/core/db.js:136-187). Pagination handles PostgREST's silent 1000-row cap (supabase-store.js:23-38).
- Account deletion is thorough on the production path: decommissionStudent revokes the token, tombstones the account without name or email, then deleteAllStudentState removes kv (profile, progress, in-flight lesson, encrypted OpenRouter key, trial claims, learning and build docs), memory, lessons_completed, curricula and domain_files; the Auth user is deleted last, and queue consumers skip non-active students and are fenced by compare-and-set (api/build-topic.js:9-11). The deletion order and operator recovery are documented (docs/deployment.md:125).
- The privacy page (public/privacy.html, updated 28 Sep 2026) matches the code: account data in Supabase, profile and lesson notes, in-flight conversations kept until finished or deleted with no auto-expiry, key stored encrypted (AES-256-GCM, lib/core/llm-access.js:25-55), hashed-IP demo counters, the AI-provider flow, and even the up-to-7-day queue message remnant. No secrets or personal data were found in origin/main history: the historical workspace/USER.md and progress.json are empty templates, and no .env or .db file was ever committed.
- Local stores write atomically (temp file plus rename) for completions, curricula and domain files (progress.js:129-134; store.js:149-156, 206-212); the registry's read-modify-write limit is documented in a ponytail comment (students.js:11-14).

### DATA-1 (should-fix, a day): Progress (active_topics, history, streak) is an unguarded read-modify-write: concurrent writers lose updates

**Why it matters.** A student who adds two topics quickly, or finishes a lesson while a build step activates a topic, can silently lose a topic from their active list or a history entry (streak). Nothing errors and nothing is logged, which is the shape of the #117 class. Re-adding the topic repairs it only if the student notices.

**Evidence.** lib/core/supabase-store.js:154-159 updateProgress does readProgress, fn, writeProgress with network I/O between. Callers: lib/core/topic-builds.js:14-19 activateTopic (called from prepareTopicBuild at :51 and lib/core/topic-service.js on every add-topic) and supabase-store.js:248-256 markLessonComplete (history push). Reproduced on origin/main code with a delayed fake Postgres client: two concurrent activateTopic('a'), activateTopic('b') leave progress.active_topics = ["b"] (probe script in scratchpad data/probe/race.mjs). The streak shown on the web is computed from progress.history (lib/core/progress-stats.js:18-28), so a lost history entry shortens the streak. Same pattern on TutorStore (store.js:118-123) but that is single-process and synchronous.

**Fix.** Stop treating one JSON row as the source of truth for concurrent writers. Options: (a) derive history from lessons_completed, which already holds slug, day, date and engagement under a primary key, and drop the history push; (b) make activateTopic an insert-if-absent into its own kv row (e.g. active_topic:<slug>) via insertKV; or (c) compare-and-set progress with a revision field and retry, as compareAndSetTopic already does for builds.

### DATA-2 (should-fix, days): The production store is not in any store-parity suite and is only tested against a hand-written fake whose delete is a no-op

**Why it matters.** The store that holds every hosted student's data, and the account-deletion path that is a privacy promise, are checked only by reading code. A regression such as a missing table in the deletion list would ship green. The two stores also differ in places: SQLite readKV always returns strings and Supabase returns parsed jsonb; TutorStore.readProgress seeds from a template while SupabaseStore returns an empty default.

**Evidence.** tests/tenancy.test.js:21-24, tests/students.test.js:20-22 and tests/integration/readonly-filesystem.test.js:31-34 define backends = [TutorState, TutorStore] only. SupabaseStore is exercised only via a bespoke fake in tests/integration/supabase-store-persistence.test.js:17-80, where delete: () => builder (line 80) never removes rows and like() ignores % and _. No test calls SupabaseStore.deleteAllStudentState (grep of tests/ finds it only mocked on TutorStore, tests/accounts.test.js:412). Real PostgREST semantics (value->>revision filters in compareAndSetTopic at supabase-store.js:124-133, ON CONFLICT upserts, 1000-row caps) are never run in CI (.github/workflows/ci.yml has no Postgres job).

**Fix.** Add SupabaseStore to the shared describe.each backends lists using a fake that actually honours delete/eq/like/upsert, and add a deleteAllStudentState test asserting all five tables are empty for the student and untouched for another. Better, add a CI job running the same contract suite against a local Postgres/PostgREST (supabase start or a docker image) so jsonb filters and conflict handling are real.

### DATA-3 (should-fix, hours): Migrations are hand-pasted SQL with no applied-version tracking, and the version marker is never read

**Why it matters.** The safe path to production is a human remembering to paste SQL before merging. If code that needs a new migration deploys first, routes fail loudly (store methods throw), so this is not silent data loss, but the first post-v0.1 schema change will be risky and nothing tells the operator which migrations a given Supabase project has.

**Evidence.** docs/deployment.md:7-14 says to run supabase/migrations/* in numeric order in the SQL Editor; docs/deployment.md:59 says to migrate before deploying code that needs it, while merge to main auto-deploys. schema_version is written (migrations 001:128, 003:58, 004:100) but nothing in lib/, api/ or scripts/ reads it (git grep schema_version origin/main). lib/core/db.js:10 SCHEMA_VERSION = 3 while Postgres is at 4. 001 cannot be re-run after 003: 001:128-129 uses ON CONFLICT (key) but the primary key is now (user_id, key), and 001's CREATE POLICY lines (116-125) are not idempotent. 002, 003 and 004 are idempotent and correctly ordered: 003 and 004 check information_schema and use IF NOT EXISTS, and a fresh project runs 001-004 cleanly. There is no supabase/config.toml or migration table.

**Fix.** Before v0.1: add a runbook to docs/deployment.md with the verification queries (policies, schema_version) and the order for upgrades. Soon after: make SupabaseStore (or a health route) compare kv schema_version to an expected constant and answer 503 'database needs migration N' instead of failing per-query; or adopt supabase db push with its migration table. Align or remove SCHEMA_VERSION in db.js, and make 001's tail idempotent.

### DATA-4 (should-fix, a day): No backup, export or restore story, and the privacy page offers deletion but no way to get a copy

**Why it matters.** All hosted student state lives in one Postgres database. Without backups, one bad migration or accidental delete is permanent. Without an export or a contact route, a student in a GDPR-type jurisdiction cannot get a copy of their data, which is legal exposure the privacy page implicitly invites.

**Evidence.** git grep for backup/export/restore across docs/, README.md and public/ finds nothing relevant; there is no export endpoint (api/ has account.js, admin/students.js, progress.js with no export action). public/privacy.html 'Deleting your data' covers deletion only and 'Questions' points to a public GitHub issue with the instruction not to include personal information, so there is no private contact for access requests. Assumption: the Supabase project is on a plan with no managed backups (cannot be verified read-only); free-tier projects also pause after inactivity.

**Fix.** Before opening signup: confirm and document the Supabase backup tier (enable daily backups or take a pg_dump runbook), and add a private contact address to the privacy page. Soon after: a signed-in GET /api/account?export returning the student's kv, lessons_completed and domain_files as JSON. Say plainly in the v0.1 notes what is and is not backed up.

### DATA-5 (should-fix, hours): A failed account deletion strands the user: the account is already disabled, the UI says 'try again', and retrying cannot work

**Why it matters.** Rare (needs a database error at that moment), but when it happens the person asked for deletion, got a wrong instruction, is locked out, and some of their rows may remain until someone reads Vercel logs.

**Evidence.** api/account.js:179-190 calls decommissionStudent; lib/core/students.js:97 writes the 'disabled' tombstone before lib/core/supabase-store.js:77-83 runs five sequential deletes (kv, memory, lessons_completed, curricula, domain_files), which are not transactional. If one fails the route answers 500 'Your account could not be deleted. Please try again.' and does not clear cookies. A retry then hits verifyAccountRequest (lib/core/accounts.js:147), which returns null for a disabled account, so the user gets 401 'sign in again'; signing in fails in ensureAccount (accounts.js:25: 'Account access has been disabled'). Recovery is operator-only via DELETE /api/admin/students (docs/deployment.md:125). The only operator signal is console.error '[account] delete failed'. Covered by tests/accounts.test.js:410-426 for TutorStore only.

**Fix.** Change the 500 text to say the account is disabled and the team will finish removal; log the failure with a marker the operator is alerted on (log drain or email); optionally make the five deletes one Postgres function call so it is all-or-nothing.

### DATA-6 (nice, a day): Lesson completion is claimed before it is recorded, and the record is two non-atomic writes

**Why it matters.** Double counting is prevented (see strengths), and a lost completion simply re-offers the same lesson, so this is recoverable and the window is milliseconds. But the student can be told 'complete' for an unrecorded lesson, or warned falsely.

**Evidence.** api/lesson.js:187-188 claims lesson_done:<id> permanently, then :192 runs completeLesson inside safely(). lib/core/supabase-store.js:237-256 markLessonComplete upserts lessons_completed, then separately read-modify-writes progress.history. A function timeout or crash between the claim and the upsert leaves the claim set; the next answer hits api/lesson.js:128-135, clears the in-flight record and says 'Lesson already complete' without recording it. If the history write fails after the upsert, the lesson is recorded but the student sees the 'could not be saved' warning (lesson.js:218) and learning.md/practice-feedback.md are not written (completeLesson aborts at lesson-completion.js:108).

**Fix.** Record completion and history in one transaction (Postgres RPC), or drop the redundant history array (see DATA-1) so there is one write. Optionally write learning.md before deleting the in-flight record.

### DATA-7 (nice, hours): Several SupabaseStore methods ignore the {error} result, the #117 failure shape

**Why it matters.** Dead today, but anyone wiring the bot or a future feature to SupabaseStore inherits silent write loss. Low user impact for v0.1 because the web path throws correctly.

**Evidence.** lib/core/supabase-store.js:304-308 appendMessage, :310-318 getRecentHistory/clearSession, :326-344 appendMemory/readRecentMemory, :446-484 jobs, :488-508 group members and exercises all await a query without checking error, so a failed write returns normally. Nothing on the web or Vercel path calls them: git grep finds callers only in scripts/bot, which uses file state plus TutorStore (scripts/bot/index.js), never SupabaseStore. The bot also has empty catches around active-lesson persistence (scripts/bot/lesson.js:87, :100, :107) and job completion (scripts/bot/curriculum.js:168, :173). lib/core/db.js also defines SQLite tables (curricula, lessons_completed, students) that nothing uses.

**Fix.** Delete the unused Supabase methods and dead SQLite tables, or add the same `if (error) throw error` as the other methods. Log instead of swallowing in the bot's persistActiveLesson.

### DATA-8 (nice, hours): Web progress and Telegram progress are separate stores, and the docs do not say so

**Why it matters.** A user of both surfaces will expect one progress. This is an honest v0.1 limit that only needs saying.

**Evidence.** The web uses SupabaseStore (api/_lib/init.js:13-30); the bot uses file state plus a local SQLite job queue (scripts/bot/state.js header 'All state is file-based', scripts/bot/index.js:25-31). docs/deployment.md:3 says Telegram 'runs separately' but nothing says a student's web progress does not appear in the bot or the reverse. When bot and web run from one checkout, both read-modify-write workspace/tutor/completions.json (lib/core/progress.js:136-141) without cross-process locking.

**Fix.** Add one sentence to the README and deployment guide: web progress (Supabase) and Telegram/local progress (workspace files) are independent in v0.1.

### DATA-9 (nice, hours): No readiness signal for the database; GET /api/account reports 'available' from env vars only

**Why it matters.** The first sign of a paused or unreachable database will be a student complaint rather than an alert.

**Evidence.** api/account.js:36-42 answers {available: accountsConfigured()}, which only checks that SUPABASE_URL and a key are set. Probed production: GET /api/account returns 200 {"user":null,"available":true,"local":false} in 0.1 s without touching Postgres. There is no /api/health. During a Supabase outage or free-tier pause the signed-in routes do fail safely (503 'Sign-in is temporarily unavailable' or 500 'Could not load your progress'), but nothing external can detect it.

**Fix.** Add a cheap authenticated-free health check (a one-row kv read) folded into an existing function (the 12-function cap applies, see AGENTS.md) and point an uptime monitor at it.

## Quality and honesty of the 293 shipped topics

**Verdict: ready-with-caveats.** The 293 curricula are structurally clean and mostly well sequenced. 292 of 293 pass the schema, and the count and median-27 claims are true. Two things fall short. (1) Scholarly references are unreliable. Wrong arXiv IDs and unresolvable DOIs sit in lesson `resources`, and the tutor treats those as trusted "Sources". (2) Nothing carries safety or legal framing for the hazardous and professional topics. One distillation note actively downplays methanol. I found no blocker. Before tagging v0.1, strip the unverifiable scholarly links (hours of work) and soften the distillation note. Then state honestly that the courses are AI-generated, unreviewed and not a substitute for professional or in-person training. #301 is still open and #309 is not merged. Neither covers the findings below.

Sound:
- Count claim holds: 293 topic folders, 8,034 lessons, median 27 lessons, maximum 40 (microeconomics). The range '5 to 40' is true only because of the one stub (CNT-4); without it the minimum is 21.
- Schema validation I scripted over all 293 curriculum.json files: 292 pass every required-field, numbering, difficulty, type and status check, with unique sequential lesson numbers. No topic folder is missing curriculum.json. The only missing documented file is the-essay/teaching-notes.md (CNT-7).
- #251 is delivered: all 293 have `level` and all but one have 2-6 prerequisites. Every `level` value is valid and /api/catalog on production returns all 293 with level and prerequisites.
- Sequence quality is good in the 29 topics I read by module and title (3d-printer-firmware, algorithmic-music, astrophysics, chess-strategy, classical-mechanics, cybersecurity-law, distillation, econometrics, birdwatching, braille, caving, espresso-machine-engineering, foraging, game-theory, knot-theory, lie-groups-and-lie-algebras, measure-theory, memory-techniques, animation, bonsai, cardiology, compiler-design, ethics, history-of-technology, orchestration, quantum-computing, sourdough-science, world-mythology, viking-navigation). Prerequisite order is sensible (Lagrangian before Hamiltonian, scanner before parser, Euler-Lagrange before action), every topic has a capstone, and review lessons recur roughly every 5-6 lessons. Minor flaws: astrophysics #18 repeats #16-17; econometrics puts discrimination regression (#15) before diagnostics.
- Book citations are largely real: 32 of 35 sampled titles and authors were found in OpenLibrary, and the 3 misses are small (CNT-3). Well-known arXiv papers (Attention, BERT, word2vec, AlphaZero, power-laws) are correctly linked, and the DOIs of the form 10.1126/science.* and 10.1038/* mostly resolve.
- The tutor limits what it will link and cite: lib/core/links.js unlinks any URL not in the lesson's resources, Wikipedia or a YouTube search (#271), and prompts.js:96-101 forbids invented sources. The weak point is only that resources are trusted unchecked (CNT-1).
- Some sensitive topics are handled well: mushroom-identification and foraging carry explicit 'never assume' and look-alike lessons (foraging #13-#19), lockpicking covers legality and ethics, freediving, caving and circus-arts have safety modules, and the lessons ask about 'what actually kills people on rope' (caving #5).
- The docs are candid: README.md does not claim expert review, docs/topic-catalog.md says it is a wish list, and the internal product reviews are retained as snapshots. A v0.1 can ship with the limits stated in plain words.

### CNT-1 (should-fix, hours): Wrong arXiv IDs in lesson resources, shown to students as trusted Sources

**Why it matters.** The tutor can present a galaxy-luminosity paper as the source for a knot-theory fact, under a label the model wrote itself. This is a false claim in the core 'sources' feature that v0.1 advertises (#281). The surface is small (about 21 topics) but concentrated in the hardest courses.

**Evidence.** I resolved all 91 unique arXiv IDs in skills/tutor/domains through the arXiv API. All exist, but many are the wrong paper. Of 84 arXiv links attached to lessons in curriculum.json (21 topics), about 32 point at an unrelated paper by my title comparison. Examples: knot-theory#6 (trefoil) goes to 'Low-energy enhancement of magnetic dipole radiation'; knot-theory#11 (Jones polynomial) goes to a hard-sphere freezing paper; knot-theory#22 goes to 'Kinodynamic RRT*'; knot-theory is roughly 10 of 13 wrong. Others: astrophysics#4 goes to 'Tate classes, equivariant geometry and purity'; error-correcting-codes#15 and #21 go to compressed sensing and loop quantization; tilings-and-tessellations#10/#16/#20/#26 go to SPT phases, AGN feedback and variant calling; optics#25 goes to 'Weakly-Supervised Neural Text Classification'; viking-navigation#15 goes to division quaternion algebras; algorithmic-trading#27 goes to magnetic field concentration. In hand-written resources.md, about 10 of 38 arXiv IDs are wrong, for example algorithmic-trading (Cont/Stoikov/Talreja 1003.4739 goes to a hyperbolic 3-manifolds paper), formal-verification 1904.07126 (a fracture closure stress paper, not 'Quantum Program Verification'), knot-theory 1310.7624 and 1603.05316, mathematics-of-voting 1402.0075 and 1801.01548, medieval-siege-engineering 1311.3039 (habitable planets, not the trebuchet paper), optics 1504.00408, and knot-theory/resources.md:149 (Kauffman, arXiv 1309.1698). Famous ML papers (Attention Is All You Need, BERT, word2vec) are correct. In lib/core/links.js:51-56 any URL in the lesson's resources is added to `trusted` with no check. lib/core/prompts.js:89-101 tells the tutor to cite lesson resources under '📚 Sources'.

**Fix.** Script one pass over every arXiv link in curriculum.json and resources.md. Fetch the title from the arXiv API and keep a link only if it fuzzy-matches the cited title or the lesson concepts. Otherwise delete it. Make the pipeline's verifyUrls step compare titles, not only HTTP status. This is the 'check by script, remove the unverifiable' step already planned in #301.

### CNT-2 (should-fix, hours): About a third of DOIs in shipped content do not resolve, and some resolve to unrelated papers

**Why it matters.** It shows the invented-citation problem in #301 reaches DOIs, not only YouTube ids. Students and reviewers who click a DOI hit a dead page or an unrelated paper.

**Evidence.** The 50 unique doi.org links in skills/tutor/domains were checked against Crossref. 34 resolve and 15 return 404; one more was truncated by my regex and is not counted. The 404s: sign-language-linguistics/curriculum.json has 11 of about 17 (10.1093/acprof:oso/9780199727698.003.0002, 10.1162/ling_a_00116, 10.1093/oxfordhb/9780199935345.013.31, .013.56, .013.63, 10.1017/CBO9781139108607 and others); lichenology has 3 (10.1007/s13199-010-0104-4, 10.1007/s00442-003-1404-y, 10.1111/j.1469-8137.1973.tb04821.x); phycology has 1 (10.1038/s41598-018-36495-8). Resolving DOIs that are the wrong paper: supramolecular-chemistry 10.1002/anie.199609361 is cited as Philp & Stoddart 'Self-Assembly in Natural and Unnatural Systems' but is 'The Mechanism of the Claisen Rearrangement'; phycology 10.1038/nature16989 is 'Electrostatic catalysis of a Diels-Alder reaction'; phycology 10.1111/nph.14974 is about ericoid mycorrhiza; sign-language-linguistics 10.1017/langcog.2016.23 is a journal cover and front matter page. These are citations that look real and are not.

**Fix.** Same script as CNT-1. Resolve each DOI through Crossref, compare the title to the claim, and drop what fails. Add this check to the builder before a curriculum ships.

### CNT-4 (should-fix, hours): behavioral-economics is a legacy 5-lesson stub in a different schema, listed as a full course in production

**Why it matters.** It is a flagship-sounding topic sold as a full course that has five lessons and no sources. It makes the headline range misleading and is one of 293 'ready' courses that is not ready.

**Evidence.** skills/tutor/domains/behavioral-economics/curriculum.json has `"preliminary": true`, lessons keyed `day` instead of `lesson`, no `difficulty` or `type` on any lesson, no `exit_criteria`, empty `resources` in every lesson, and 4 to 5 concepts per lesson. The whole folder is 15 KB. Its research.md lists off-topic arXiv hits under 'Key Papers' (Qatar robotics labour replacement, stop-and-go epidemic control, an interacting agent model of economic crisis). GET https://opentutor-gg.vercel.app/api/catalog returns it as {total:5, level:'intermediate'}, one of the 293 listed courses. It is also the only reason the 'Phase B upgrade' path in scripts/bot/index.js:62-69 and the README claim '5 to 40 lessons each' (README.md:90, docs/architecture.md:158, CLAUDE.md:77) hold: the next-smallest course has 21 lessons. All other 292 curricula pass the schema. lib/core/progress.js:146 tolerates `day`, so it likely does not crash, but I did not run a lesson on it.

**Fix.** Build it with the current pipeline, or remove it from the catalog and say '292'. If it is kept, regenerate it to the schema and change the README wording to '21 to 40 lessons'.

### CNT-5 (should-fix, a day): No safety, legal or 'not professional advice' framing for hazardous and professional topics

**Why it matters.** A student relying on an AI-generated mushroom, medical or electrical lesson is the most plausible real-harm path for a public tutor. A published v0.1 with no framing is also a legal exposure the project could cheaply reduce.

**Evidence.** The shipped catalog includes mushroom-identification, foraging, caving, freediving, distillation, nuclear-reactor-design, power-systems, neon-sign-fabrication (6-15 kV), knife-making, blacksmithing, cardiology, oncology, pharmacology, medicinal-chemistry, nutrition-science, water-treatment, algorithmic-trading and financial-derivatives. A search of lib/core/prompts.js, api/lesson.js, skills/tutor/SKILL.md, skills/tutor/references/*.md and README.md found no safety or disclaimer instruction. Only about 64 of 293 teacher.md or teaching-notes.md files mention safety words at all. The wording is ad hoc and mostly in notes the model may ignore. Of the 20 sensitive topics I scanned, the explicit disclaimer-type phrases ('not medical advice', 'consult', 'qualified instructor') appear in 1 (freediving). cardiology, water-treatment and amateur-radio have 0 safety hits in teacher.md or teaching-notes.md. The only AI-error notice is public/index.html:138 on the landing page, not in the lesson view (grep of public/ found no other). Good examples exist: mushroom-identification/teaching-notes.md:5 and lessons 13-17 cover 'never assume' and toxic look-alikes, and lockpicking addresses legality and ethics. But in mushroom-identification the deadly-Amanita lesson (#7) comes before the 'safe foraging decision tree' (#16), and nothing tells the student not to rely on an AI tutor for an eating decision. The default model is DeepSeek V4.1 Flash.

**Fix.** Add a short topic-risk tag to the catalog (for example `risk: safety|medical|legal|financial`) and have the Socratic prompt open the first lesson, and answer any irreversible-action question, with a fixed line: AI-generated, not a substitute for a qualified person or in-person training. Show the 'AI can make mistakes' notice in the lesson view, not only on the landing page. Put one sentence about this in the README.

### CNT-6 (should-fix, hours): distillation notes tell the tutor methanol fear is 'overblown' and say nothing about legality

**Why it matters.** The tutor is instructed to talk a student out of a fear that is partly justified, for an activity that can blind or kill and can be illegal at the student's address.

**Evidence.** skills/tutor/domains/distillation/teaching-notes.md:9 and teacher.md:31 list the belief 'Methanol is created during distillation and is deadly' as a misconception to correct: 'The danger is overblown for home distillers using fruit/grain'. teaching-notes.md:55 says 'If student expresses fear about methanol (common!), dive into pectin methylesterase... Reassuring and educational.' The only mitigation is 'awareness to discard heads'. A search of the folder for illegal, permit, licence or legal found no hits. The lessons include 'Can you design a distillation run for your ideal spirit profile?' (#25). Home distillation of spirits needs a permit or is prohibited in the US, UK and many other countries.

**Fix.** Rewrite those notes. Keep the chemistry but say that methanol risk is real and concentrates in the foreshots and heads, tell the student to discard them and never to rely on taste, and state that home distillation of spirits is unlawful in many places. Treat the topic as 'legal-risk' under CNT-5.

### CNT-7 (should-fix, hours): Docs overstate the shipped file set: the-essay lacks teaching-notes.md, and the docs count files inconsistently

**Why it matters.** It is small, but 'present for every one' is false for one topic, and the Teacher gets less guidance on it.

**Evidence.** All 292 other domains have concept-map.md, curriculum.json, research.md, resources.md, teacher.md and teaching-notes.md; skills/tutor/domains/the-essay/ has no teaching-notes.md. docs/architecture.md:158 says 'The six files marked ✅ are present for every one'. CLAUDE.md:79 says 'Shipped: the five files below' and then lists six. lib/core/prompts.js:236 reads teaching-notes.md for every lesson; for the-essay it falls back to an empty string.

**Fix.** Generate the-essay's notes with the existing backfill approach, or fix both sentences. Add a 5-line test that every domain has the six files, so CI fails if one disappears.

### CNT-3 (nice, hours): Book citations are mostly real, but a few are mis-attributed or conflated; the hit rate should be reported as it is

**Why it matters.** Hand-written book lists are the sound part of the resources and can be described as 'mostly accurate' (about 91% by this sample), not 'verified'.

**Evidence.** I checked 28 books sampled one per domain from resources.md, plus 7 from research.md, against OpenLibrary. 32 of 35 were found with matching title and author (e.g. Pierce TAPL 2002, Jackson Social and Economic Networks 2008, Hull Origametry 2020, Huron Sweet Anticipation 2006, Doidge 2007, Zhao 2023, Petrov Database Internals 2019). Not confirmed: papermaking/resources.md:25 'The Complete Guide to Papermaking' by Maureen Richardson (Wellfleet, 2001) has no match. OpenLibrary's Richardson titles are 'Handmade Paper' and 'Grow Your Own Paper', and the closest real title is Arnold Grummer's 'Complete Guide to Easy Papermaking', so this looks conflated. information-theory/resources.md:181 lists a 'Scientific American article by Shannon (1949)', but I found no such article by Shannon; it appears to be Weaver's 1949 piece. Parmigiani & Inoue (Wiley 2009) is absent from OpenLibrary but exists. Edition years drift by a few years (Hodge & Klima listed as 2018, first edition 2005). The Turing 'Chemical Basis of Morphogenesis' entry is a paper, not a book, and it is real.

**Fix.** Fix the two items. Add an OpenLibrary title and author check to the same script as CNT-1.

### CNT-8 (nice, hours): Teacher configs and quality docs are metadata, and shipped docs publish an unflattering self-review

**Why it matters.** The repo is honest about quality, which is good. But someone who reads docs/ finds 'never tested with a single student' beside a '293 courses' headline, and the README should say the same.

**Evidence.** skills/tutor/domains/game-theory/teacher.md is mostly derived statistics ('concept-focused mini-lessons: 12 lessons (41%)', 'Difficulty peaks: Day 9...', vocabulary '(and 66 more)'). The generated notes drift from the curriculum: they say 'After lesson 25 (evolution plays games)' but the lesson is #27. docs/product-review.md and docs/review-edtech-ceo.md call the 293 topics 'a vanity metric' and recommend deleting 282; they are marked as a snapshot dated 2026-09-01 and not updated. README.md:26 and :89 do not claim expert review or testing, which is correct.

**Fix.** Add one README sentence: the courses are AI-generated, not reviewed by subject experts, and not tested with students at scale; mistakes are expected. Keep the review docs, since a v0.1 can ship with this stated.

### CNT-9 (nice, a day): Almost every course assumes a background; only 10 of 293 are beginner

**Why it matters.** A curious beginner picking 'tea' or 'olive oil' meets university chemistry on lesson 1. The level field from #251 makes this visible, but the framing is aimed at people with background.

**Evidence.** Level counts across all 293: beginner 10 (art-history, birdwatching, bookbinding, braille, color-theory, history-of-cryptography, memory-techniques, psychogeography, science-of-learning, stargazing), intermediate 181, advanced 102. student_level is 'intermediate' for all 293. Hobby topics carry academic prerequisites: tea requires 'basic chemistry (organic molecules, oxidation-reduction)' and 'basic botany'; olive-oil is rated 'advanced' (prerequisite: basic organic chemistry); pirate-history is 'intermediate' and presumes colonial history. README.md:26 sells 'from game theory to bread chemistry'. prerequisites are free text: only 20 of 1,049 entries match another topic slug, so none dangles but none can be linked.

**Fix.** Say in the README that most courses assume prior study. Optionally relabel five or six hobby topics, or generate beginner variants for the most popular topics after v0.1.

### CNT-10 (nice, days): Overlapping topics dilute the 293 count

**Why it matters.** Duplicates inflate the headline number and make the catalog harder to browse. They do not hurt the learner.

**Evidence.** Pairs with overlapping scope: caving and speleology (26 lessons each, title-word overlap 0.13), soil-ecology and soil-science (0.40), paper-folding-mathematics and origami-mathematics (0.32). Families of acoustics (acoustic-engineering, acoustics-and-psychoacoustics, acoustics-and-the-physics-of-music, physics-of-musical-instruments) and mycology / mushroom-identification / mushroom-cultivation. history-of-technology drifts into philosophy of technology (lesson 2: 'Why do we call it philosophy of technology...', module 'Philosophical Foundations', Ellul).

**Fix.** Leave as is for v0.1, or merge or hide the near-duplicates after launch. If kept, say '293 courses' with a note that some overlap.

### CNT-11 (nice, hours): Lesson-format drift from curriculum-format.md across a minority of lessons

**Why it matters.** Cosmetic, but cheap to fix with the same script and it keeps the shipped files consistent with the documented schema.

**Evidence.** Script run over origin/main (excluding behavioral-economics): 486 of 8,029 lesson titles are not questions although the format says 'never a topic label' (acoustic-engineering#6/#12/#19/#25, aerospace-engineering#7/#14/#21/#27); 524 titles start 'Review:' and 31 'What have we learned about'; 213 lessons list 5 concepts although 2-4 are specified; 110 curricula reopen a module (the 'Review' modules, for example acoustics-and-psychoacoustics) so modules are not contiguous; duplicate titles: neuroscience #17/#19 and signal-processing #9/#10; 40 lessons have empty `resources` (e.g. ancient-roman-engineering #6/#12/#20/#27, archaeoastronomy #14/#21). Fine on all 292 others: required fields, unique sequential lesson numbers, difficulty 1-5, valid types, status 'pending', no `delivered` dates, slug equals folder name, level in {beginner, intermediate, advanced}. Review lessons are 14% of all lessons (1,130 of 8,034).

**Fix.** Fix the 2 duplicate titles and rename 'Review: ...' titles as questions. Add a schema test over all domains to CI so the numbers cannot drift.

### CNT-12 (nice, hours): Link provenance: a few resource links point at probably unauthorised copies

**Why it matters.** Linking to infringing copies is a small legal exposure and a poor look for an educational project.

**Evidence.** game-theory/resources.md:12 links an Osborne 'Course in Game Theory' solution manual PDF on gelogica.weebly.com. 5 scribd.com links appear across the domains, and 75 links go to uploaded PDFs under /uploads/ or /wp-content/uploads/ on third-party sites. The textbook link at game-theory/resources.md:8 is a Rutgers personal page; the authors do publish the book free, so I treat it as acceptable. The 2,244 YouTube links and the invented placeholders are in scope of #293 and #309 and not repeated here.

**Fix.** Remove scribd and solution-manual links and prefer publisher, author or library pages. Add a rule to the builder prompt.

## Deployment, cost and operations

**Verdict: ready-with-caveats.** The deployment itself is sound. Production answered 200 on every probe (57-130 ms, 12 requests). The 12-function cap is held by a passing test. Error text is generic and no student content or key is logged. Caps are claimed before each model call, and the cost model checks out against OpenRouter's live pricing. What is missing is operational safety, not code. There is no branch protection, and Vercel deploys main to Production in parallel with CI rather than after it. Nothing documents rollback or backups, and nothing alerts the owner. The shared free-trial budget (300 calls a day, about 60 lessons) is far too small for a public launch, and the README promises "3 free lessons" without saying so. The Hobby-plan and Supabase-tier questions can only be answered by the owner. None of this is a hard blocker if the README is made honest and the owner answers the two plan questions before the tag. Most fixes take hours.

Sound:
- Production uptime and latency: 12 unauthenticated GET and HEAD requests over about 20 seconds all returned the expected status. / and /learn.html returned 200 in 57-70 ms, /api/catalog returned 200 in 72-130 ms with Cache-Control public max-age=300, and /api/topics returned 401 as designed. /api/admin/students returned 401, and /api/build-topic returned 404 (the queue consumer is not publicly routable).
- Function count is exactly 12, and tests/web-deployment.test.js guards it (it passed in my extraction). /api/openrouter and /api/demo are folded into existing functions through ordered rewrites in vercel.json, so the Hobby limit is respected by design.
- Timeouts for the queue consumer are coherent: pipeline calls 240 s, build step 270 s, lease 300 s, maxDuration 300 (lib/core/pipeline.js:17, topic-builds.js:9,123). Stale workers are fenced by compare-and-set.
- Error hygiene (#144) holds under review. Only RequestError text and fixed strings reach clients, and every other route answers a generic message. No student answers, lesson content or API keys are logged, only err.message with a route tag. account.js logs only status and code to avoid emails (#244). greeting.js drops provider text, and OpenAIAdapter redacts sk- tokens from error bodies. Student OpenRouter keys are sealed AES-256-GCM, bound to the student id (llm-access.js).
- Cost caps are enforced before the model call, atomically, via insert-if-absent rows (claimSlot), in the demo (3 per IP and 300 a day), the trial (3 lessons, 12 answers, 12 onboarding messages, 300 calls a day), and onboarding. The demo stores only a day-salted truncated HMAC of the IP. A student's key refusal gives a reconnect or no-credits prompt and never silently falls back to the deployment's key.
- The cost model checks out: OpenRouter's public pricing for deepseek/deepseek-v4.1-flash ($0.03 per million in, $0.50 per million out) gives about $0.001 per typical call, matching the documented $0.0009. Worst case for the whole trial population is about $0.27 a day, or $8.1 a month.
- Security headers (frame-ancestors none, nosniff, HSTS preload, referrer policy) are present on production responses and set in vercel.json.
- CI runs on every PR and every push to main, uses Node 22 consistently with engines, and was green on the latest main commit. Lint is clean in my extraction.
- No secrets found: a regex scan across all 298 origin/main commits for common key shapes found none, and .env is ignored. Migrations 001-004 use IF NOT EXISTS or guarded DO blocks. docs/deployment.md documents free-trial, demo, cap and secret-handling behaviour thoroughly and honestly, and public/privacy.html exists. The 5 vitest failures in my extraction (workspace-seeding, agent-platforms) come from the archive having no .git directory, not from the code. CI shows both checks green on the same commit.

### OPS-1 (should-fix, hours): Free-trial capacity is about 60 lessons a day across everyone, but the README promises 3 free lessons unconditionally

**Why it matters.** A public post or Show HN would bring more than 20 signups in a day. After that, most visitors hit the dead end 'come back tomorrow' at their first lesson, and the README's promise is false for them. The cap protects money but not availability. An abuser can cost nothing and still deny the free trial to everyone else.

**Evidence.** lib/core/llm-access.js:71 sets TRIAL_CALLS_PER_DAY = 300 and the comment above it says about 60 trial lessons a day. Every trial call from any account takes one of the day's shared slots (llm-access.js:135-170). When the day is spent, students get 402 'Free lessons are used up for today'. README.md:34 says 'Create an account for 3 free lessons' with no mention of the shared daily cap; the cap appears only in the self-hosting section (README.md:103) and docs/deployment.md:142. Signup needs no email confirmation (docs/deployment.md:136 and 142). A script can create accounts and drain the day's budget in minutes. The demo has its own 300 a day cap (api/_lib/demo.js:14). No CAPTCHA or Vercel Firewall rule appears in the repo, and a dashboard rule cannot be checked from here.

**Fix.** Say in the README and on the signup page that free lessons are limited and shared daily. Before launch, raise the OpenRouter key limit and OPENTUTOR_TRIAL_CALLS_PER_DAY together, or accept the limit and state it. Consider a per-IP signup throttle, a Vercel Firewall rate-limit rule on /api/account and /api/demo, or Supabase captcha.

### OPS-2 (should-fix, hours): main has no effective protection, and Vercel deploys it to Production without waiting for CI

**Why it matters.** A direct push, or a merge with failing CI, ships to the live site and to student data immediately. For a public project that will soon take outside PRs, 'PR plus review' exists only as habit.

**Evidence.** gh api repos/LEARNableLabs/opentutor/branches/main/protection returns 404 'Branch not protected'. A ruleset named 'gcg-rule' exists, but its conditions.ref_name.include is [] and it only has deletion and non_fast_forward rules. gh api repos/LEARNableLabs/opentutor/rules/branches/main returns [], so nothing applies to main. Deployments API: a Production deployment of a2ccd3f at 2026-10-01T21:44:15Z by vercel[bot], while the CI push run on main completed success at 21:43:26. The two run in parallel, and the Vercel check is the only status on the commit besides the CI checks. 26 of 30 recent first-parent commits on main are single-parent, i.e. direct or squash commits. Only 2 collaborators exist (one admin).

**Fix.** Make the ruleset target ~DEFAULT_BRANCH. Require a PR and the 'test' and 'lint' checks, and block force-push. In Vercel, enable 'Require successful checks' or deploy only after CI, if the plan allows. Otherwise state that main is deploy-on-merge.

### OPS-3 (should-fix, hours): No rollback or migration runbook, and migrations race with auto-deploy

**Why it matters.** If a bad deploy needs undoing, the owner has to know Vercel Instant Rollback exists. To my knowledge Hobby can only roll back to the previous production deployment, and a rollback stops auto-promotion until the owner promotes again. If a migration was involved, only a manual fix works. A merge that needs migration 005 reaches Production seconds after merge, before anyone has run the SQL.

**Evidence.** docs/deployment.md:59: 'Pushes to main trigger Vercel deployments; run newly added database migrations before deploying code that needs them.' Migrations are manual SQL-editor files with no tracking table and no down scripts (supabase/migrations/001-004). Only 003 and 004 change primary keys, and they are guarded with IF NOT EXISTS and DO blocks. The repo has no rollback section (grep for rollback, promote and revert in docs/, README and AGENTS.md finds nothing). Vercel's Git integration deploys every merge to Production (deployments API, vercel[bot]).

**Fix.** Add a short RUNBOOK section covering: Vercel rollback steps and the re-promote step, 'migrate first, additive only, then merge', and how to take a Supabase dump before a migration. Keep migrations backwards compatible for one release so a code rollback is safe.

### OPS-4 (should-fix, hours): The owner cannot see or be told about errors: logs are bare console.error, with no alerting and no health endpoint

**Why it matters.** An outage at night, a failing OpenRouter key, or a stuck queue is invisible until a student complains, and by then the logs have expired. The owner would not know which route failed.

**Evidence.** Every route logs only console.error('[route]', err.message) (api/lesson.js:73,79; api/chat.js:90; api/_lib/demo.js:67; api/_lib/openrouter.js:80). Nothing is structured, there is no request id, and no error reporter or log drain appears in package.json or the code. Vercel Hobby runtime logs are kept for only about 1 hour (published plan limit, not verified here). No /api/health exists: the function cap is 12 of 12, and HEAD /api/catalog returns 405 because only GET is handled (api/catalog.js:6). /robots.txt returns 404. docs/review-engineer.md:148 already noted 'No metrics'.

**Fix.** Point a free external monitor at GET / and GET /api/catalog. Add Sentry or similar, or a Vercel log drain on a paid plan. Add OpenRouter and Supabase usage alerts. Optionally fold a ?via=health branch into catalog.js, as demo does.

### OPS-5 (should-fix, hours): When the deployment's OpenRouter credit runs out, everything model-backed fails with generic errors and nobody is told. The budget headroom is under $1.

**Why it matters.** Around the end of the month the tutor, the demo and the owner's own use could all stop together, with students seeing a vague error and no signal to the owner. This is the main cost-abuse safeguard, and it fails silently.

**Evidence.** docs/deployment.md:142 and llm-access.js:66-71: 300 calls a day at about $0.0009 is $8.1 a month inside a $10 monthly key limit. I confirmed the unit cost with OpenRouter's public /models pricing: deepseek-v4.1-flash is $0.03 per million input tokens and $0.50 per million output, which is about $0.001 for a 10k-in 1.4k-out call. The demo's 300 a day (api/_lib/demo.js) is not in that $8 figure, and the owner's and admin-created students' calls are uncapped (llm-access.js:98 and 'Everyone else ... without limits'). On a 402 from the deployment's key, OpenAIAdapter throws err.status=402 (lib/adapters/openai.js:51-54). Only StudentOpenRouterAdapter translates 402 into a prompt. For host calls the routes answer 500 or 503 'The tutor is unavailable right now' (api/lesson.js:79, api/demo.js:67). A trial call's daily slot is not refunded (llm-access.js:165), so retries keep consuming the daily budget while failing. The $10 limit itself lives in the OpenRouter dashboard and cannot be verified from the repo.

**Fix.** Set an OpenRouter low-balance email or auto top-up alert, and a cost alert at 50% and 80% of the limit. Map a host-key 402 to a clear 'tutor is paused' message and a log line. Include the demo in the budget math, or lower DEMO_PER_DAY. Consider a per-admin-student daily cap.

### OPS-6 (should-fix, hours): Vercel Hobby is non-commercial and personal, and the project belongs to an organisation. Only the owner can answer this.

**Why it matters.** Vercel's Fair Use terms exclude commercial use from Hobby. A free, open-source, bring-your-own-key tutor is probably fine. But if LEARNable Labs operates it as a business, or staff are paid to maintain it, Vercel may suspend the deployment. A public launch raises that visibility. Pro would also lift the 12-function cap and the 1-hour log retention.

**Evidence.** Hobby is verified from AGENTS.md:17 ('The Hobby plan refuses more' than 12 functions) and the owner's recorded note that the Hobby plan is in use. The repo is LEARNableLabs/opentutor, and the GitHub org 'LEARNable Labs' is on the free plan (gh api orgs/LEARNableLabs). The Vercel team id is hard-coded in scripts/deploy-vercel.js:23. No mention of Hobby terms or commercial use appears anywhere in docs/ or README. /terms.html returns 404, while /privacy.html returns 200. I cannot see the Vercel account type, who owns the team, or whether the project earns revenue or is run by paid staff.

**Fix.** The owner decides, in writing: either confirm the project is personal and non-commercial, move to a Pro team under the organisation, or move to a different host. Add a short Terms page, since the privacy page already exists.

### OPS-7 (should-fix, hours): Backups, project-pause and plan limits of the production Supabase project are unknown and undocumented

**Why it matters.** To my knowledge, free Supabase projects are paused after inactivity and have no managed backups. Losing or pausing that one project would mean losing every student's progress, and one rotation of its secret key already disconnects every student's stored key (docs/deployment.md:142).

**Evidence.** All student state, sealed OpenRouter keys and account records live in one Supabase project (api/_lib/init.js; docs/deployment.md 'Step 1'). No document mentions backups, point-in-time recovery or inactivity pausing (grep for backup, pitr, pause, free tier across docs/, README and AGENTS.md finds nothing). The Supabase plan and settings are visible only in its dashboard.

**Fix.** Owner: confirm the plan. Enable backups, or schedule a weekly pg_dump to a separate store. Record the plan and recovery steps in the runbook. Note that rotating the secret key invalidates stored OpenRouter keys.

### OPS-8 (should-fix, hours): Secret scanning, push protection and Dependabot are all disabled on a public repository, and there is no SECURITY.md

**Why it matters.** The project's secrets (OpenRouter and Supabase keys) are exactly what a public repo leaks. Free protections are off, and outside contributors will have no private way to report a vulnerability.

**Evidence.** gh api repos/LEARNableLabs/opentutor: security_and_analysis shows secret_scanning, secret_scanning_push_protection and dependabot_security_updates all 'disabled'. The tree has no SECURITY.md, CONTRIBUTING, CHANGELOG or dependabot config (git ls-tree origin/main). npm audit --omit=dev reports 1 high: brace-expansion 4.0.0-5.0.11 ReDoS (GHSA-q2hr-2g5m-vwhr and two siblings) via @vercel/queue to minimatch. It is practically low risk because the input is not user-supplied. A regex scan of all 298 commits for OpenRouter, Supabase secret, Anthropic, GitHub and Telegram token shapes found nothing, so no leak exists now.

**Fix.** Enable secret scanning and push protection plus Dependabot alerts in repo settings. Add a SECURITY.md with a contact. Run npm audit fix, or note it as accepted.

### OPS-9 (nice, hours): Adapter timeouts are longer than the function's 60-second limit on interactive routes

**Why it matters.** On a slow-provider day, a student gets 'Request failed (504)' (public/app.js:58) and may lose one of their 3 trial lessons. DeepSeek Flash is usually fast, so this is rare.

**Evidence.** vercel.json sets maxDuration 60 for api/**/*.js. lib/adapters/openai.js:48 gives the strong tier a 120 s timeout by default and the cheap tier 60 s. The lesson plan call is { model: 'strong' } with no timeout (api/lesson.js:329-333), and the response turn uses the same default. A slow provider is therefore cut off by Vercel (a platform 504, or a stream with no 'done' or 'error' event) rather than by the app's friendly error. The trial slot is deliberately kept on a timeout (llm-access.js:174-180).

**Fix.** Pass timeout: 50_000 for interactive calls so the app answers its own error before Vercel kills it. Optionally refund the trial slot when the app's own timeout fires before any token streams.

### OPS-10 (nice, hours): .env.example does not cover every environment variable the code reads

**Why it matters.** Self-hosters who copy .env.example will miss the trial cap and the public-URL setting.

**Evidence.** git grep of env reads against .env.example: OPENTUTOR_PUBLIC_URL, OPENTUTOR_TRIAL_CALLS_PER_DAY, OPENROUTER_BASE_URL, OPENROUTER_REASONING, TELEGRAM_MODE, TELEGRAM_WEBHOOK_URL (and VERCEL, VERCEL_TOKEN, VERCEL_TEAM_ID and VERCEL_PROJECT, used only by scripts/deploy-vercel.js) are read but not listed. OPENTUTOR_PUBLIC_URL matters because docs/deployment.md says a self-hosted server with accounts must set it, or confirmation and reset links use the client-controlled Host header. docs/deployment.md covers most of these, and .env.example is accurate for what it does list.

**Fix.** Add commented entries for the missing variables, with one line each.

### OPS-11 (nice, hours): No release hygiene: no tags, a version number that disagrees with 'v0.1', and a stale deploy script that can ship a local working copy to production

**Why it matters.** A v0.1 tag on top of package.json 1.0.0 is confusing, and a stale script can overwrite production with uncommitted local state.

**Evidence.** gh api repos/LEARNableLabs/opentutor/releases returns [] and tags returns none. package.json:3 says version 1.0.0, not 0.1. There is no CHANGELOG. scripts/deploy-vercel.js header says the GitHub integration is not installed and deploys files from `git ls-files` in the local working copy with --prod, but the Vercel GitHub integration is active (deployments API, vercel[bot]). The owner's working copy is dirty and stale (deleted .claude/workflows files).

**Fix.** Set package.json to 0.1.0 (or tag v1.0.0), add a short CHANGELOG or release notes, and delete deploy-vercel.js or make it refuse a dirty tree.

### OPS-12 (nice, a day): Function bundle size (#217) is unmeasured, and function-count headroom is zero

**Why it matters.** Bundle size affects Functions Storage, cold starts and Hobby limits, not correctness. At 12 of 12, any new route must be folded into an existing function, as demo and openrouter already are.

**Evidence.** Issue #217 is open: each of the 12 functions likely ships better-sqlite3 (via api/_lib/init.js, which dynamically imports lib/core/store.js, which imports lib/core/db.js) and the course files. skills/tutor/domains is 17 MB. vercel.json has includeFiles only for api/catalog.js, and lessons on shipped courses work in production, so tracing evidently includes them. Sizes are visible only in the Vercel dashboard. api/ holds exactly 12 route files (account, add-topic, build-topic, catalog, chat, lesson, onboard, progress, topic-build, topics, user, admin/students), and tests/web-deployment.test.js passes.

**Fix.** Measure in the dashboard, then add excludeFiles for node_modules/better-sqlite3/** and limit course files to the functions that read them, per #217. Verify on a preview. Say 'at the function cap' in the contributor docs.

### OPS-13 (nice, hours): Custom-topic builds depend on a beta Vercel service, and the self-deploy guide does not say so

**Why it matters.** Beta features can change or break. A forker following only self-deploy.md could hit a deployment that fails with no explanation.

**Evidence.** vercel.json declares an experimentalTriggers entry with type 'queue/v2beta', and package.json pins @vercel/queue 0.6.0. docs/deployment.md says 'Queues is currently a beta Vercel service; verify availability for your team'. docs/self-deploy.md and the README host-it-for-others section omit both Queues and the iad1 region pin. A fork on a team without Queues access would have custom topics, an owner-only feature, fail to deploy or to build.

**Fix.** Add one line to self-deploy.md naming Queues and the region pin. Note that a queue outage only affects custom topics.

### OPS-14 (nice, hours): CI is sound but minimal: default token permissions, actions pinned by tag, and no audit or deploy gating

**Why it matters.** Hardening only. The least-privilege token matters more once outside PRs arrive.

**Evidence.** .github/workflows/ci.yml: runs on push to main and every pull_request, Node 22 (matching engines >=22 and the repo guide). Jobs are test (vitest and simulations) and lint (eslint, node -c syntax checks). No permissions: block, no concurrency group, no npm audit step, actions pinned to @v4 tags rather than SHAs. Both checks passed on the current main commit (check-runs).

**Fix.** Add 'permissions: contents: read' and a concurrency group with cancel-in-progress. Optionally add a scheduled npm audit.

## Open-source release hygiene and docs accuracy

**Verdict: ready-with-caveats.** The repo is in good shape for a stranger: MIT licence matches package.json and the GitHub licence detection, no secrets in HEAD or history, CI green on main, and the README quickstart works on a clean extract. I ran npm ci, started the web server, and ran npm run host; all behaved as documented, and the 1283 tests pass in a real clone. No blocker, but the repo is not yet shaped like a release. Version is 1.0.0 with no tag, release or changelog. There is no SECURITY, CONTRIBUTING, CODE_OF_CONDUCT or issue template, and GitHub private vulnerability reporting is off. The self-deploy guide skips steps the signup flow needs. Several docs contradict the code. The privacy page has no contact, age or terms statement. These are all hours-level fixes. Fix OSS-1 to OSS-4 before announcing v0.1; the rest can follow.

Sound:
- LICENSE is MIT and matches package.json ("license":"MIT"), the README badge and GitHub's licence detection. The EB Garamond font ships with its OFL.txt, and the README credits the video music under CC BY 4.0.
- The README quickstart works on a clean extract: `npm ci` took about 4 s, `npm run web` started on Node 22 with 'Topics loaded: 293' and 'Store: sqlite', and /, /learn.html, /api/topics, /api/catalog and /privacy.html all returned 200 with the security headers set. OPENTUTOR_PORT works. The README's claim that `npm run web` does not read .env is true.
- `npm run host` behaves as documented: it writes a learner and an admin password to .env at mode 0600 without printing them, and an unauthenticated /api/user then returns 401 while the catalog stays public.
- Numbers and claims I checked against code and data: 293 domains, 5–40 lessons per course (median 27, 8,034 lessons in total), 3 free lessons (TRIAL_LESSONS=3), 300 trial calls a day (llm-access.js:71) with the OPENTUTOR_TRIAL_CALLS_PER_DAY override, four migrations 001–004, retest after 3 lessons and review after 5 (deliberate-practice.js:46-54), the 11 Telegram commands in architecture.md against commands.js, and the 12-function Vercel cap (11 api/*.js plus admin/students.js).
- Verification: `npx vitest run` in a real clone gives 91 files and 1283 tests passing in about 8 s; eslint is clean; CI on main is green for the last 3 runs (tests, simulations, lint, syntax checks); .github/workflows/ci.yml uses Node 22 and `npm ci`.
- Hygiene: .gitignore covers .env, SQLite files, workspace runtime state and .test-data. tests/package-contents.test.js guards both what the npm package must contain and that no runtime state leaks. There are no secrets in HEAD or in history, and no .env was ever committed. Repo size is moderate (17.7 MB) and nothing huge or binary is tracked except the one stale logo (OSS-9) and the intentionally committed, test-diffed claude-web/opentutor.skill (20 KB).
- The docs are mostly honest about limits: methodology.md has an 'Honest limitations' section (SM-2 Telegram-only, no retention data), the review docs are labelled snapshots, and the privacy page matches the implemented behaviour (account deletion, key storage, demo hashing). Relative links across README, docs and platform guides all resolve apart from two anchors. `npx skills add LEARNableLabs/opentutor` works and finds the skills. The repo is public, issues are enabled, and the homepage and description are set.
- Each audience has a path. A student has the hosted site with a no-account demo, 3 free lessons, then their own OpenRouter key. A local self-hoster has the README quickstart. A group host has `npm run host`. A hosted self-deployer has docs/self-deploy.md plus the long deployment.md (see OSS-3 for gaps). An agent user has per-platform guides, from the claude-web single-file skill to Claude Code, Codex and others.

### OSS-1 (should-fix, hours): Version is 1.0.0 but the release is v0.1; no tag, release, changelog or release notes

**Why it matters.** A release tagged v0.1 whose package says 1.0.0 contradicts itself, and it promises stability the project does not claim. There is nothing for a visitor to read about what v0.1 contains or what its known limits are.

**Evidence.** origin/main:package.json:3 "version": "1.0.0"; package-lock.json:3 and :9 also 1.0.0. `git grep` finds no other version reference (openclaw/cron/jobs.template.json:2 "version": 1 is an unrelated schema number). `git tag` is empty, `gh release list` is empty, no CHANGELOG.md. npm pack names the artifact opentutor-1.0.0.tgz.

**Fix.** Set 0.1.0 in package.json and package-lock.json (3 lines), tag v0.1.0 on the merge commit, and publish a GitHub release. Add a short CHANGELOG.md or release notes listing what ships: hosted web, bot, skill, 293 topics. Include the known limits: SM-2 spacing is Telegram only, content citations are unverified (#301), the platform guides are untested against live runtimes.

### OSS-2 (should-fix, hours): No SECURITY.md, CONTRIBUTING, CODE_OF_CONDUCT or issue/PR templates; private vulnerability reporting is off

**Why it matters.** The hosted service holds accounts and encrypted OpenRouter keys, and a researcher who finds a hole has no private channel. The README sends contributors to CLAUDE.md and AGENTS.md, which are agent-facing maintainer rules (`@codex review`, `claude -p --model fable`, `git add -f` under .claude/), not instructions a stranger can follow.

**Evidence.** `git ls-tree origin/main` has only LICENSE, README.md, AGENTS.md, CLAUDE.md; .github/ contains only workflows/ci.yml. `gh api repos/LEARNableLabs/opentutor/community/profile` gives health_percentage 37 with code_of_conduct, contributing, issue_template and pull_request_template all null. `gh api .../private-vulnerability-reporting` returns {enabled:false}. The privacy page's only contact is a public GitHub issue and asks people not to put personal information in one.

**Fix.** Enable private vulnerability reporting (a repo setting) and add a 10-line SECURITY.md pointing to it. Add a short CONTRIBUTING.md covering npm ci, npm test, npm run lint, issue-then-PR, and a link to the AGENTS.md review rules. Add a Contributor Covenant file and one bug and one feature issue template.

### OSS-3 (should-fix, hours): README's self-host path (docs/self-deploy.md) omits steps that public signup and custom topics need

**Why it matters.** A self-hoster who follows the README leaves Supabase's default 'Confirm email' on. Signups then dead-end, because no working email path exists. Custom-topic builds depend on a beta Vercel product the guide never names.

**Evidence.** README says 'Sign-up opens automatically once Supabase is configured' and links docs/self-deploy.md. That 13-line page never mentions Vercel Queues (`vercel.json` uses "queue/v2beta" triggers; docs/deployment.md calls Queues beta and says to verify team availability), turning Supabase 'Confirm email' off, Site URL and redirect allowlist, or OPENTUTOR_PUBLIC_URL. These are in docs/deployment.md only, under 'Public browsing and email accounts'. api/account.js:95-96 refuses sign-in with 'Confirm your email before signing in.' when the email is unconfirmed. docs/deployment.md says email flows and password reset are not built (#133).

**Fix.** Add a numbered 'before you open signup' checklist to self-deploy.md: Confirm email off, Site URL and redirect URLs, OPENTUTOR_PUBLIC_URL, Queues availability, the 12-function Hobby cap. Or have the README link to the deployment.md anchors directly.

### OSS-4 (should-fix, hours): Hosted-service legal basics: no contact address, terms, age statement or data-controller statement

**Why it matters.** The site collects emails and passwords from the public and sends learners' text to third-party AI services. Students are plausibly minors. A missing contact and age line is the usual first complaint. A student's data request or deletion failure needs a human to reach.

**Evidence.** The live https://opentutor-gg.vercel.app/privacy.html (HTTP 200, last updated 28 Sept 2026) covers data kept, AI processing, cookies and deletion well. It has no email or contact other than a public GitHub issue, no terms of service page (public/ has only privacy.html), and no minimum age or children's data statement. The landing page targets people 'studying for exams'. /LICENSE on the site is 404, which is fine.

**Fix.** Add a monitored contact email to privacy.html, a one-paragraph terms page (as-is, AI can be wrong, no warranty), and a minimum-age line. Confirm that Vercel Hobby's non-commercial terms cover an organisation-run public service, or note the plan to move; I did not verify this.

### OSS-5 (should-fix, hours): Several docs contradict the code they describe

**Why it matters.** A reader following the .env.example note or the pipeline doc will misconfigure or misunderstand the product. The 'no streaks' claim is a stated product principle the UI now breaks, in the doc that explains the teaching method.

**Evidence.** (a) .env.example:10-11 and docs/architecture.md:126 say the Telegram bot does not read OPENTUTOR_LLM (see #98). scripts/bot/claude.js:5-6,49 uses createAdapterFromEnv(), and CLAUDE.md:184 says it honours it. (b) docs/methodology.md 'What it deliberately doesn't do' says 'No streaks or points'. The web header shows a streak (public/app.js:309 `🔥 N days`, from #292), and the bot's /progress counts a streak. (c) The landing page card says 'Spaced Repetition: Data-driven recall scheduling, never forget what matters', while methodology.md says SM-2 is Telegram-only and the web path is 'weaker'. (d) docs/curriculum-generation.md describes a tutor loop with ADVANCE/RESEARCH/REDO/ESCALATE, escalation.md and 5 QA checkers. A grep finds those only in .claude/workflows/new-topic.js, not lib/core/pipeline.js, which is research, plan, build, critique, 3 rounds. (e) CLAUDE.md:78 says 'five files' and lists six. docs/architecture.md:158 says all six ship for every topic, but skills/tutor/domains/the-essay has no teaching-notes.md.

**Fix.** Delete the stale NOTE in .env.example and the architecture.md line. Reword the methodology 'no streaks' bullet to match what ships, or drop the streak. Label curriculum-generation.md 'Claude Code workflow only' or rewrite it from pipeline.js. Soften the landing card. Fix the five/six count and add the-essay's missing teaching-notes.md.

### OSS-6 (should-fix, hours): README and methodology present the 293 courses as research-grounded and cited; the content is unverified, and the repo says so only in an open issue

**Why it matters.** Telling readers the sources are real and cited, when no error rate has been measured, is a false-claim risk for a tutor product. The honest v0.1 limit is 'courses are AI-generated; citations are not all verified'.

**Evidence.** docs/methodology.md: 'Not from the model's memory… the sources are cited in the lessons'. Open issue #301 says shipped content is model-generated and unaudited: 10,169 URLs in resources.md, citations in research.md that may not exist, and facts taught to students. A spot check of skills/tutor/domains/sourdough-science/research.md finds '"The Sourdough Microflome" (Minervini et al., 2014)' (typo in the title) and 'Bread Science (Corriher, 1997)'. As I recall, Bread Science is by Emily Buehler, so the attribution looks wrong. I did not verify this against a catalogue. #309, which covers invented YouTube and placeholder links, is excluded here.

**Fix.** Add one sentence to the README ('Where the courses come from') and methodology.md stating that shipped courses are AI-generated and that citations and books have not been verified (#301). Soften 'cited' wording. Run the sample audit from #301 when time allows.

### OSS-7 (should-fix, hours): Agent-user path: `npx skills add` installs three overlapping skills, and the guides are untested against live platforms

**Why it matters.** An agent-first user can end up with a duplicate or conflicting tutor skill, or a `/new-topic` command that does nothing outside a checkout. Seven platform guides imply support that has not been validated.

**Evidence.** `npx skills add LEARNableLabs/opentutor --list` (run from a scratch dir) reports 'Found 3 skills': opentutor (claude-web/SKILL.md), tutor and tutor-onboarding. The first two have overlapping trigger descriptions, and the README does not say which to pick. claude-code/README.md says to `cp -r skills/tutor`, but the skill refers to lib/core/pipeline.js. It advertises `/new-topic`, which exists only as .claude/workflows/new-topic.js inside the repo (tracked despite .gitignore listing .claude/). The Hermes/OpenClaw/NemoClaw/NanoClaw guides reference third-party CLIs (`hermes schedule add`, ~/.nemoclaw/nemoclaw.json) that I could not check. tests/integration/agent-platforms.test.js checks only the files.

**Fix.** Say in the README which skill `npx skills add` should use (or install with `--skill tutor`), and note that `/new-topic` needs the repo checkout. Label the Claw and Hermes guides 'experimental, untested against current releases' for v0.1.

### OSS-8 (nice, hours): npm publishing is half-configured: package.json implies a package, but opentutor is not on npm and the README never says to install it

**Why it matters.** The setup.js comment names a command that does not work. Someone may publish with the 1.0.0 version, or squat the name.

**Evidence.** package.json has `bin`, a `files` whitelist and tests/package-contents.test.js. scripts/setup.js:3 says 'Usage: npx opentutor setup'. `npm view opentutor` returns E404. `npm pack --dry-run` gives 1903 files, a 13.8 MB tarball and 25.4 MB unpacked. The README only uses git clone and npx skills.

**Fix.** Decision for v0.1: do not publish to npm. Add "private": true, or consciously publish 0.1.0. Fix the setup.js usage line to `node scripts/setup.js`. Keep the package-contents test.

### OSS-9 (nice, hours): Tracked 7.4 MB logo PNG is unused; it also ships in any npm package

**Why it matters.** It wastes clone and package size on the superseded raster logo.

**Evidence.** `git ls-tree -r -l`: assets/opentutor_logo.png is 7,486,417 bytes, about 28% of the 26.5 MB tracked tree. `git grep opentutor_logo` finds no reference; the README uses assets/logo/opentutor-hero-512.png, and tests/brand-logo.test.js references only assets/logo/*. assets/ is in package.json `files`. Repo size is 17.7 MB on GitHub. The other large files are legitimate (domains 17 MB, the 20 KB claude-web/opentutor.skill, which tests/claude-web-skill.test.js diffs against source).

**Fix.** git rm assets/opentutor_logo.png (and the .svg if unused). Do not rewrite history.

### OSS-10 (nice, hours): npm audit reports one high-severity advisory in a production dependency chain

**Why it matters.** A public repo shows a security badge or Dependabot alert on day one. Reachability looks low, because the patterns are not user input; I did not trace it.

**Evidence.** `npm audit` in a clean `npm ci`: brace-expansion 5.0.9, high, three DoS advisories (GHSA-q2hr-2g5m-vwhr, GHSA-qhr7-859c-m2p7, GHSA-6j4f-fj2g-mc7p). Chain: @vercel/queue@0.6.0 → minimatch@10.2.6 → brace-expansion. 'fix available via npm audit fix'.

**Fix.** Run `npm audit fix` (or add an `overrides` entry) and re-run the tests.

### OSS-11 (nice, hours): Test suite fails on a source archive without .git (GitHub 'Download ZIP', git archive)

**Why it matters.** A contributor who downloads a ZIP sees red tests and may assume the repo is broken.

**Evidence.** In a `git archive origin/main` extract, `npx vitest run` gives 5 failures in tests/workspace-seeding.test.js ('ignores the runtime file…') and a suite error in tests/integration/agent-platforms.test.js ('Command failed: git ls-files'). 1283/1283 pass in a real clone.

**Fix.** Skip those tests when `git rev-parse` fails, and note 'clone with git' in CONTRIBUTING.

### OSS-12 (nice, hours): Internal planning artefacts sit beside user docs

**Why it matters.** They are honest and labelled, but mixed in with user docs they make the project look unfinished.

**Evidence.** docs/ has product-review.md, review-edtech-ceo.md ('Would I invest? Not yet'), review-engineer.md ('179 tests, but the critical path is untested'), review-learning-scientist.md, review-professor.md, review-student.md, review-ux-designer.md and mathacademy-analysis.md. They are labelled 2026-09-01 snapshots. Also topic-catalog.md ('planning wish-list, not an inventory') and factory.md in the root (a tooling config). README links only methodology, architecture and the deploy docs.

**Fix.** Move the persona reviews and the competitor analysis to docs/archive/ with a one-line index, or delete them. Move factory.md out of the root.

### OSS-13 (nice, hours): Small README and doc gaps and broken links

**Why it matters.** Minor friction for a first-time self-hoster.

**Evidence.** claude-web/README.md links ../README.md#telegram-bot and ../README.md#web-ui, which are broken anchors (the README has no such headings; a link check over README, docs and platform guides found only these two). docs/architecture.md has a duplicated table header in 'Domain files'. The README never mentions OPENTUTOR_PORT, and `npm run web` with no provider env silently defaults to the `cli` backend. scripts/bot prints the missing-token error as raw pino JSON. The README video URL returns 403 to curl (`HEAD`), so I could not verify it. The music credit is present.

**Fix.** Fix the two anchors and the duplicate header, and add a one-line port note and a 'no key = Claude Code CLI' note to the README.

### OSS-14 (nice, hours): Copyright holder and author identity decisions

**Why it matters.** A permanent public history exposes the address and leaves the legal holder vague.

**Evidence.** LICENSE says 'Copyright (c) 2026 OpenTutor Contributors'; the site and package use LEARNable Labs. All 293 commits on main carry one personal Gmail author address (5 are the noreply bot).

**Fix.** Decide whether the holder is LEARNable Labs or the contributors. For future commits use the GitHub noreply address. Do not rewrite history unless the owner wants to.

## Telegram bot, portable skill and platform guides

**Verdict: ready-with-caveats.** The bot and the Claude Web bundle are solid enough to ship if the v0.1 notes say what they are. The agent and skill story is not at the level the README implies. Of the four advertised modalities, only the web app (outside this dimension) is a v0.1 headline.

WHAT TO CLAIM IN THE v0.1 NOTES
- Web (hosted): the headline feature.
- Telegram: "experimental, self-hosted, single learner". Say it runs on your own machine with your own model key and one profile, with no link to hosted accounts. Do not offer it to groups, and do not advertise it as multi-user. It needs an allowlist before the notes recommend running a public bot (BOT-1).
- Claude Web skill (claude-web/opentutor.skill): "experimental, manual continuity". The student saves learning.md back by hand. The install step must be verified on claude.ai first (WEB-1).
- Claude Code and Codex skill: "a teaching-method skill with 293 course files". Say you bring your own continuity. Do not claim enforced deliberate practice or shared state with the bot or web (SKILL-1, SKILL-2, GUIDE-1).
- OpenClaw, NemoClaw, NanoClaw and Hermes: list them as "community guides, unverified in this release" or leave them out of the announcement. They run on third-party runtimes that I could not exercise, and #58 (parity) is still open (AGENT-1).

What I ran: the bot starts and fails clearly with no token; 160 bot, skill-bundle and setup tests pass on origin/main; eslint is clean; the committed .skill zip is byte-identical to its sources.

Sound:
- npm run bot with no TELEGRAM_BOT_TOKEN exits 1 with a clear log line naming the missing variable (scripts/bot/config.js:28-35). With a bad token the error text is clear, though it ends in a stack trace.
- The bot test suite is real: 19 files in tests/bot. 22 test files (160 tests: bot, claude-web skill, package contents, setup boot) pass on a clean origin/main checkout, and eslint over scripts/bot and lib is clean.
- claude-web/opentutor.skill is in sync: I unzipped it and diffed all 7 entries against claude-web/SKILL.md, skills/tutor/references/*.md and templates/domain-template.md, and all are byte-identical. scripts/build-claude-web-skill.js builds reproducibly and tests/claude-web-skill.test.js fails CI if the bundle goes stale.
- The Claude CLI adapter used by the bot's default backend runs `claude -p` with `--tools ''` and an XML-escaped conversation (lib/adapters/claude-cli.js), so a Telegram message cannot drive tools on the operator's machine. The bot also wraps every call in a safety boundary and untrusted-data tags (scripts/bot/claude.js, lib/core/prompts.js).
- Poll and flashcard answers now reach spaced review (#294/#307): router.js grades only quiz polls answered by the student they were sent to, and review cards are persisted across restarts. Lesson buttons carry a per-lesson id so a stale button cannot answer a new question (#259).
- Telegram output is robust to bad HTML: invalid-HTML falls back to plain text, long messages are split under 3,900 chars, 429s are retried, and handler errors give the student a message instead of silence (router.js, channels/telegram.js, message.js).
- The bot reuses lib/core for planning, assessment parsing, deliberate practice and completion state, and writes lesson completion to the overlay file rather than into domains/ (state.js uses lib/core/progress.js).
- Platform guides are mostly consistent with files that exist: every relative link in the eight READMEs and SKILL/SOUL files resolves except two anchors in claude-web/README (GUIDE-2). setup.js writes each agent its own boot file (CLAUDE.md for Claude Code, AGENTS.md for Codex), and the Codex README and hermes/SOUL.md describe a sensible read-at-start, write-at-end continuity loop.
- claude-web/SKILL.md is honest about what that build cannot do (no scheduler, no file writing, single-pass curricula), and the root README no longer advertises group learning or claims Telegram parity with the web.

### BOT-1 (should-fix, hours): Telegram bot has no access control by default and shares one global profile across every Telegram user

**Why it matters.** A self-hoster who follows the README and shares the bot with a friend gets an open bot that spends their money and mixes everyone's progress into one profile. This is cost abuse plus cross-student data mixing, in a feature the README advertises. It also contradicts the per-student tenancy rule the web enforces (#80).

**Evidence.** scripts/bot/channels/telegram.js:52 only filters chats when TELEGRAM_CHAT_ID is set (`if (this.chatId && chatId && chatId !== this.chatId) continue`). .env.example:19-21 and docs/deployment.md:71 present that variable as optional (needed for schedules). With it unset, any Telegram user who finds the bot username gets: general chat (scripts/bot/chat.js, one model call per message), `/add <topic>` (commands.js cmdAdd -> generateAndRegisterTopic -> background research and curriculum pipeline), and the operator's model key. All state is one set of files: workspace/tutor/progress.json, workspace/USER.md, per-domain learning.md (scripts/bot/state.js:21-75). `isOnboarding()` and `readProgress().active_topics` are global, so a second user's /start answers 'Welcome back!' with the first user's topics (commands.js cmdStart), and a stranger's messages overwrite the owner's learning log. Setting TELEGRAM_CHAT_ID to a private id also blocks groups (negative ids), so group use requires the open configuration. Group 'learning' is dead code: recordStudentExercise is only called from the unreachable ex: callback (callbacks.js:140), and getGroupStats and markMemberDmEnabled are never called.

**Fix.** Fail closed. Refuse to start unless TELEGRAM_CHAT_ID (or a TELEGRAM_ALLOWED_USER_IDS list) is set, or an explicit OPENTUTOR_BOT_OPEN=1 is given, and apply the check to private and group chats alike. Add a one-line README warning, and say 'one learner per bot' in the notes. Per-student state is #295.

### BOT-2 (should-fix, hours): Every Telegram lesson ends with a dangling question and a dead 'go deeper' offer (#294 part 2 still open)

**Why it matters.** This is the core Telegram journey. Each lesson finishes with a question that nothing answers, and the confidence and self-explanation answers are lost. It looks buggy on first use.

**Evidence.** scripts/bot/lesson.js, end of handleLessonAnswer: after the application step the bot calls buildSocraticResponsePrompt without `final: true` (it is never passed, so the closing instruction at lib/core/prompts.js:421-424 'Do NOT ask anything' is never used). It then sends 'Want to **go deeper** on this, or **move on**...?' and calls completeSocraticLesson, which runs clearActiveLesson. The student's reply goes to general chat via router.js (no active lesson). Issue #294 lists this as open and says it depends on #295. #295's table also notes 'Closing turn: never set'.

**Fix.** Minimal fix without waiting for #295: pass `final: true` on the last step and drop the 'go deeper' message. Or keep the lesson open for one more turn as #294 proposes. State the limit in the notes if not fixed.

### BOT-3 (should-fix, hours): The bot has no link or sources filter, so invented URLs can reach Telegram

**Why it matters.** The web fixed invented links in #271 and #281, and PR #309 fixes the shipped curricula. The Telegram path still lets the model emit unverified links and citations, which is the same class of embarrassment. Sources, the links filter and streaming exist only on web.

**Evidence.** lib/core/links.js (keepTrustedLinks, keepVerifiedSources, sourceFilter) is imported only by api/lesson.js:11 and api/chat.js. `git grep links.js -- scripts/bot` returns nothing. Bot replies go straight to channel.sendMessage with parse_mode HTML (channels/telegram.js:69-95) after normalizeTelegramText (message.js), which does only bold conversion. Lesson plans and quiz prompts built in the bot are free to include URLs.

**Fix.** Run keepTrustedLinks over bot output with the lesson's own resources as the allowlist (a small wrapper in scripts/bot/message.js), or state 'Telegram does not verify links' in the notes. The real fix is #295.

### SKILL-1 (should-fix, hours): The skill tells agents to deflect questions about being an AI; the web says 'AI tutor'

**Why it matters.** A published skill that instructs an agent to dodge a sincere 'are you an AI?' is a trust and legal-disclosure problem (AI-interaction disclosure rules), and the project contradicts itself between web and skill. In Codex it also says 'never mention Claude' on an OpenAI model.

**Evidence.** skills/tutor/SKILL.md:62: 'Never mention Claude, Anthropic, AI models... If asked: "I'm your tutor - I help you learn things step by step."' workspace/AGENTS.md (Identity section): 'When asked "what are you?"... not "an AI running on Claude."' claude-web/SKILL.md (Tone): same line. openclaw/README.md troubleshooting treats 'introduces itself as a generic AI' as a bug. public/index.html:63 and :138 say 'your AI tutor' and 'OpenTutor uses AI. It can make mistakes'.

**Fix.** Keep the persona, but change the rule in SKILL.md, workspace/AGENTS.md and claude-web/SKILL.md to: 'If sincerely asked, say you are an AI tutor; do not name the vendor or internals unless asked.' Rebuild the .skill (npm run build:claude-web-skill; the test fails until you do).

### SKILL-2 (should-fix, a day): The skill never tells filesystem agents to read or write learning.md, practice-feedback.md or completions.json, so the deliberate-practice loop is missing outside Codex, Hermes and Claude Web (#57, #58)

**Why it matters.** README says 'In an AI agent, the agent itself follows the method in the skill's instructions'. For Claude Code, OpenClaw, NemoClaw and NanoClaw that method has no memory loop, so lesson 2 does not know about lesson 1's weak spots. The advertised 'comes back to what you missed' only holds on web and Telegram. The README's 'How it teaches' already narrows this, but the platform guides do not.

**Evidence.** `grep learning.md\|practice-feedback` over skills/tutor/SKILL.md and references/ finds only SKILL.md:37-39 (a file listing) and lesson-delivery.md:61, which says 'DeliberatePractitioner agent... writes directives' and 'Directives are parsed and enforced in code, not just hinted to the LLM'. That is false for a portable skill, which has no code. workspace/AGENTS.md session boot and setup.js TUTOR_BOOT_MD read only SKILL.md, USER.md, tutor/progress.json and memory/. Only codex/README.md ('Session continuity'), hermes/SOUL.md and claude-web/SKILL.md describe the read-at-start and write-at-end loop. The learning.md/practice-feedback.md formats exist only in skills/tutor/templates/domain-template.md:165-210. Issues #57 and #58 are open, and #56 (web parity) is stale. The pipeline step in claude-code/README ('runs lib/core/pipeline.js') has no entry-point script in scripts/.

**Fix.** Move the Codex 'Session continuity' section (and the three-directive rule from claude-web/SKILL.md) into skills/tutor/SKILL.md and references/lesson-delivery.md. Add learning.md and practice-feedback.md to workspace/AGENTS.md boot and to TUTOR_BOOT_MD in setup.js. Delete 'enforced in code' for the skill. Close or retitle #56-58. For v0.1, say 'the skill teaches the method; it does not enforce it'.

### SKILL-3 (should-fix, hours): curriculum-format.md tells agents to write completion into the shipped curricula, against the read-only rule

**Why it matters.** An agent following the reference mutates tracked course content, or invents its own completions format that the bot and web cannot read. Two documents give opposite instructions.

**Evidence.** skills/tutor/references/curriculum-format.md:25-36 and :53-54 define per-lesson `status: completed` and `delivered` in curriculum.json, and the Adapting section says 'Update the curriculum file as you adapt'. SKILL.md:107 and CLAUDE.md say completion lives in workspace/tutor/completions.json and domains/ is read-only. The agent guides (openclaw cron template, workspace/AGENTS.md) mention completions.json, but no reference gives its schema. All 293 shipped curriculum.json files still carry `"status": "pending"` fields.

**Fix.** Rewrite the field table so status and delivered are 'derived, do not write', and document the completions.json shape in curriculum-format.md (copy it from lib/core/progress.js). Rebuild the .skill bundle afterwards.

### GUIDE-1 (should-fix, hours): Install paths contradict each other, and the claim of shared state across bot, web and agents is untrue as documented

**Why it matters.** A first-time agent user cannot tell which of three setups to run, and the manual one does not boot the tutor. The shared-state claim is false.

**Evidence.** README.md says `npx skills add LEARNableLabs/opentutor`, then 'follow the guide', but every guide (claude-code, codex, hermes, openclaw, nanoclaw, nemoclaw) starts with `cp -r skills/tutor/ ...` from a clone, so the `npx skills add` route gives no workspace/ templates (progress.json, USER.md). I did not run `npx skills add`, so what it installs is unverified. claude-code/README Step 2 puts USER.md and progress.json in `.claude/` and says 'Edit .claude/USER.md', while scripts/setup.js writes `.tutor/` (project scope) or `~/.claude/tutor` (global) and the boot text says only 'Read USER.md'. That README also copies AGENTS.md to `.claude/`, but Claude Code boots from CLAUDE.md (setup.js:131-134 comment: 'Writing Codex's instructions into CLAUDE.md... never booted it'). claude-code/README says 'State is shared with the Telegram bot and web interface if they point to the same repo' and hermes/README says 'Both share the same curriculum state on disk'. The bot writes repo workspace/tutor/ (scripts/bot/config.js:45-60), agents write `.claude/tutor` or `~/.hermes/tutor`, and hosted web state is Supabase.

**Fix.** Make `node scripts/setup.js` the documented route in the README and the guides, and fix claude-code Step 2 to match it (or delete the manual steps). Remove the 'state is shared' sentences. Do not recommend `npx skills add` until you have tested what it installs.

### GUIDE-2 (should-fix, hours): Documented shell steps fail or misbehave when run as written

**Why it matters.** Copy-paste setup is the first thing a v0.1 user does, and the failures are silent or confusing.

**Evidence.** Reproduced in scratch. nanoclaw/README Step 2 runs `cp workspace/templates/progress.json ../nanoclaw/groups/$GROUP/tutor/progress.json` before `mkdir -p .../tutor/curricula`, giving 'cp: .../tutor/progress.json: No such file or directory' (exit 1). nanoclaw 'Updating the skill' re-runs `cp -r skills/tutor ../nanoclaw/container/skills/tutor`, which nests `tutor/tutor` once the destination exists (verified; hermes and claude-code use the same pattern). claude-web/README links `../README.md#telegram-bot` and `../README.md#web-ui`, anchors that no longer exist (I checked all relative links and anchors in the guides; these two are the only broken ones).

**Fix.** Reorder the mkdir before the cp in nanoclaw. Use `cp -r skills/tutor/. dest/` (as openclaw already does) everywhere. Point the claude-web links at the existing README sections.

### WEB-1 (should-fix, hours): Claude Web guide tells students to upload a .skill zip to Project knowledge, which I could not confirm works

**Why it matters.** If the first step does not work, the whole Claude Web path fails, and tests/claude-web-skill.test.js (which checks the zip's contents, not claude.ai) will not catch it.

**Evidence.** claude-web/README.md Setup step 3: 'Upload opentutor.skill to the project's knowledge'. claude-web/SKILL.md compatibility: 'Claude Web (Projects)'. As far as I know, claude.ai takes skill zips through its Skills settings, not as a project-knowledge document, and a knowledge file is not unzipped. I have no claude.ai access, so this is unverified. The guide also asks the student to upload 3-6 files by hand from skills/tutor/domains/<slug>/ on GitHub, which has no folder download.

**Fix.** Before the release, test the install on a real claude.ai account and fix the README with the working path (Skills upload, or paste SKILL.md into project instructions). Then say 'verified on <date>'. Until then label it experimental.

### AGENT-1 (should-fix, a day): OpenClaw, NemoClaw, NanoClaw and Hermes guides are untestable here and carry hard-coded, costly defaults

**Why it matters.** 'AI agents (OpenClaw and similar)' is one of four advertised modalities, but nothing here shows it works end to end, and the defaults cost real money. If it breaks, it breaks on someone else's runtime.

**Evidence.** They need third-party runtimes (`openclaw gateway`, `hermes schedule add`, NanoClaw `schedule_task`) that this repo does not vendor, and the only automated coverage is file-copy in tests/setup-agent-boot.test.js. openclaw/README.md Step 3, openclaw/cron/jobs.template.json and scripts/setup.js:177 pin `anthropic/claude-opus-4-6`, a top-tier model, at three runs a day. openclaw/README recommends `groupPolicy: "open"` plus `/setprivacy Disable`, so the tutor answers every group message. nanoclaw and nemoclaw copy the same cron prompt. hermes/README claims 'Hermes gateway doesn't support inline buttons' and a 'NemoClaw + Hermes' production stack, both with no evidence in the repo. Issue #58 (parity for these) is open and states 'OpenClaw needs the most work'.

**Fix.** For v0.1, do not headline these. List them as community or experimental guides, change the model default to a cheaper tier with a note, and switch groupPolicy to allowlist. If you can, run the OpenClaw guide once end to end and record the date.

### DOC-1 (nice, hours): CLAUDE.md and .env.example are stale about the bot's LLM backend and group learning

**Why it matters.** New contributors, and agents following CLAUDE.md, will act on wrong claims. README, to its credit, no longer advertises groups.

**Evidence.** .env.example:10-11 and CLAUDE.md ('LLM backends') say the bot reads only CLAUDE_BACKEND, not OPENTUTOR_LLM (#98). scripts/bot/claude.js:1-9 and lib/adapters/index.js:37-38 show it honours OPENTUTOR_LLM, with CLAUDE_BACKEND as a fallback. CLAUDE.md 'Group learning' describes DM exercise feedback and anonymised group stats, which are dead code (see BOT-1; #294 item 4). CLAUDE.md also lists lesson.js at '749 lines' (it is 722). scripts/bot/config.js:80-82 still defines an unused CLAUDE model config (`claude-sonnet-4-20250514`).

**Fix.** Update the three docs, delete the Group learning section or mark it unsupported, and close #98 if it is done.

### BOT-4 (nice, hours): Start-up and scheduler rough edges

**Why it matters.** Operators see a stack trace on the most common first-run mistake, and a student who ignores a push gets the same lesson repeated.

**Evidence.** Run in scratch. With no token the bot logs one JSON line ('Missing required env vars', missing: [TELEGRAM_BOT_TOKEN]) and exits 1, which is clear but terse and gives no BotFather hint. With a bad token it retries setMyCommands twice, then crashes with an unhandled Node stack trace (channels/telegram.js:174 via index.js:86); the message does say 'Unauthorized: invalid token specified'. config.js:29 defaults the backend to the `claude` CLI with no start-up check that the binary exists. The scheduler (scheduler.js) delivers a lesson at each slot (3 a day by default, America/New_York) and silently does nothing when TELEGRAM_CHAT_ID is unset. A new push replaces an unanswered in-flight lesson (lesson.js deliverNextLesson overwrites activeLessons[chatId]), so an ignored morning lesson is re-planned at 13:00 and 19:00 rather than moving on.

**Fix.** Catch the registerCommands failure and print a plain message; check `claude --version` when the backend is cli; log a warning when the scheduler has no chat id; skip a push while a lesson is open.

### SKILL-4 (nice, a day): The skill is Telegram-flavoured rather than platform-agnostic, and its source rules contradict each other

**Why it matters.** Agents in a terminal or Claude Web receive instructions for a chat channel they are not on, plus an unimplemented section. Mild, but it dilutes the portable skill.

**Evidence.** CLAUDE.md requires SKILL.md and workspace/ to be platform-agnostic. skills/tutor/SKILL.md:104 and :120 reference Telegram (slash commands, 'via Telegram'); references/lesson-delivery.md says 'This is Telegram, not a textbook', pins Telegram's 4,096 limit and a fixed emoji-anchor set, and includes a 'Not implemented yet' pushes table. source-verification.md says references at the bottom are 'non-negotiable' and ends with 'Cite casually', while the web policy is a verified Sources footer only for facts (lesson-delivery.md: 'On the web, a Sources footer...'). The same files are bundled into the Claude Web zip, which has no scheduler or Telegram.

**Fix.** Move the Telegram formatting and the unimplemented pushes section under openclaw/ or the bot's own docs, make the citation rule match the web, and rebuild the .skill file.

### REL-1 (nice, hours): Version and compatibility metadata do not match the release

**Why it matters.** A v0.1 tag on a 1.0.0 package, and compatibility claims nobody tested, undercut the 'honest limits' tone.

**Evidence.** package.json version is 1.0.0 while the release is v0.1; skills/tutor/SKILL.md metadata version is 1.1. package.json description and SKILL.md `compatibility` name Cursor, Gemini CLI and OpenCode, with no guide or test for any of them. The Claude Code guide installs the skill as a 17 MB copy (skills/tutor is 17 MB because of the 293 domains) into each project.

**Fix.** Set package.json to 0.1.0 (and SKILL.md to match), and trim the compatibility list to what the guides cover.

## Whether the tests and CI can be trusted

**Verdict: ready-with-caveats.** The suite is large, fast and stable. In a clean extract of origin/main, npm ci then npm test twice gave 91 files and 1283 tests passing both times (8.1s and 6.7s wall), with no flaky test, no skipped or todo tests, and lint clean. Trust boundaries are covered more thoroughly than I expected. The weak points are the two things a release decision leans on. First, no real browser and no deployed-path (Vercel api/*.js plus Supabase) check exists anywhere, so a green CI proves logic against doubles, not that the shipped app works. Second, the "Run simulations" CI step is green by construction: it asserts nothing, always exits 0, and leaks state. I also found that main is unprotected, so CI is advisory, and that ESLint is close to a no-op. A green main is good evidence the code is not regressing, but it is not sufficient evidence to tag v0.1. It needs one manual pass through the learner journey on production, and the single best automated addition is a Playwright journey (TST-1). None of this blocks v0.1 if the limits are stated honestly.

Sound:
- Clean and reproducible: `npm ci --prefer-offline` then `npm test` twice in a fresh extract of origin/main gave 91 files and 1283 of 1283 tests passing both times (8.1s and 6.7s wall), with identical results and no flaky test. `npm run lint` is clean. A pre-existing clean `git status` after the suite shows the tests do not dirty the checkout.
- Zero skipped, todo or .only tests (grep for .skip, .todo, xit, xdescribe and skipIf finds none), and CI runs `npx vitest run` over all of tests/**, including tests/integration.
- Real-process tests exist where they matter most: tests/web-lesson-server.test.js spawns the actual scripts/web/server.js with an explicit, secret-free env (a checkout's .env is deliberately not inherited), a fake OpenRouter and a fake Supabase Auth. It covers answer grading, resume without a model call, BLOCK directives over JSON and SSE, trial limits and BYOK key use. web-body-limit, security-headers, web-error-text, web-deployment and openrouter-route also use real HTTP.
- Trust-boundary coverage is broad: auth.test, admin-auth.test, admin-students-route.test, student-signin.test, tenancy.test, students.test, accounts.test, trial-routes.test (free-lesson budget and refusals), llm-access.test (BYOK), security-headers.test, web-body-limit.test and json-body.test. Per-student partitioning (#80) and the read-only-filesystem class of bug (#117) have dedicated regression tests (tests/integration/readonly-filesystem.test.js and supabase-store-persistence.test.js), and the Postgres double enforces the 1000-row cap that caused #137.
- Lessons learned were encoded: the fake res objects in trial-routes.test.js:59-62 and demo-route.test.js:36-37 throw ERR_HTTP_HEADERS_SENT on a duplicate write, which is the exact gap that let a whole-server crash pass 378 tests earlier.
- Every api route except the queue consumer has at least one dedicated test file, and package-contents.test.js, agent-platforms.test.js, claude-web-skill.test.js and setup-agent-boot.test.js guard the open-source side (published files, platform guides, the skill bundle).
- The simulation did not modify tracked content on the normal path: `git status` stayed clean after running it, thanks to the completion-overlay design. State leakage is confined to git-ignored workspace files.
- CI is fast (about 35s per job) and consistently green on recent main runs (all of the last 10 listed succeeded), so feedback is cheap to demand once it is made mandatory.

### TST-1 (should-fix, days): No real-browser or end-to-end learner journey check exists in CI; the front end is only tested against hand-written DOM doubles

**Why it matters.** The doubles can never catch layout or overflow (the chat-bubble sizing in #305 needed a stubbed matches()), CSS or CSP breakage, real event ordering, focus, scrolling or mobile viewport behaviour, SSE streaming through a real fetch, cookie or localStorage behaviour, or a script that fails to parse in a browser. They also pass whenever the stub is more forgiving than a browser. Several recent bugs (course-selection races, saved-lesson resume, SSE source metadata) were found by review or a manual browser pass, not by the suite.

**Evidence.** No playwright, puppeteer, jsdom or happy-dom in package.json devDependencies (eslint, pino-pretty, vitest only). public/app.js (1278 lines), login.js, welcome.js and style.css (1050 lines) plus welcome.css (754 lines) are exercised only by tests/web-connect.test.js (101 tests), web-login.test.js and web-welcome-demo.test.js. These load the real script with vm.createContext and a hand-rolled element() stub: classList is a Set, querySelectorAll() returns [], matches: () => false ('no layout in a double'), and timers are collected into an array. web-connect.test.js also defines dispatch twice in the same object literal. Issue #296 (open) says a combined real-server/browser check 'now verifies welcome, lesson start, answering, reload/Continue' but that check is not in the repo or in .github/workflows/ci.yml.

**Fix.** Add one Playwright job that starts scripts/web/server.js and drives welcome, onboarding, course pick, lesson start/answer, reload/Continue, and the exhausted-trial connect banner. Reuse the fake-OpenRouter and fake-Supabase-Auth harness already in tests/web-lesson-server.test.js. Run it at a phone viewport and a desktop one, and keep traces on failure. Until it exists, say in the release notes that the UI is verified manually.

### TST-2 (should-fix, days): The production path (Vercel api/*.js handlers on Supabase Postgres) is never run end to end; the Postgres side is an in-memory double and the migrations are never applied

**Why it matters.** Production is the Vercel+Supabase path, not the local server. Real-database differences (RLS policies, constraint or index mistakes, row-limit paging, a migration that fails on a populated table) and Vercel-specific behaviour (queue triggers, the 12-function cap, bundle contents, rewrites in vercel.json) are invisible to the suite. The #117 and #137 incidents were this class of bug.

**Evidence.** The only real-server test (tests/web-lesson-server.test.js) spawns scripts/web/server.js against SQLite with a fake OpenRouter and fake Supabase Auth. Vercel handlers (api/lesson.js, chat.js and others) are called in-process with fake req/res in tests/trial-routes.test.js, demo-route.test.js, onboard-route.test.js and others. SupabaseStore is tested against fakePostgrest(), arrays that emulate PostgREST (tests/integration/supabase-store-persistence.test.js:21-40). supabase/migrations/001..004 (including 002_scope_rls_to_service_role.sql and 003_partition_kv_by_student.sql) are never applied to a database in CI. api/build-topic.js, the queue-triggered topic-build consumer, has no test that imports it. tests/web-topic-recovery.test.js and web-connect.test.js only fake /api/topic-build responses inside the front-end double.

**Fix.** In CI, apply supabase/migrations/*.sql to a throwaway Postgres (a service container, or `supabase start`) and run tests/integration/supabase-store-persistence.test.js against it with the real client. Separately, run `vercel build` or `vercel dev` in a preview job. Short term, document that deployed-path behaviour is verified only by manual smoke.

### TST-3 (should-fix, a day): Confirmed (#296): the CI simulation asserts nothing, always exits 0, copies production logic, and leaks state

**Why it matters.** The CI step 'Run simulations' can only fail on an uncaught exception, so it is false assurance. On a developer machine it clobbers workspace/USER.md and leaves stale learning logs that later influence modes and directives. A hard-killed or crashed run would leave a real USER.md replaced.

**Evidence.** tests/simulations/run.js: no assert/expect/process.exit anywhere (grep returns nothing). It builds `new TutorState(ROOT)` on the repo root (line 46) and overwrites workspace/USER.md (49-51). `tmpDir` is created at line 42 but never used. Accuracy is `Math.random() < student.behavior.accuracy` (line 90), unseeded. selectMode and assessEngagement are copy-pasted ('Copied from lesson.js') at lines ~168-197, so they can drift from scripts/bot/lesson.js. Cleanup runs only on the normal path (lines 150-165) and unlinks learning.md and practice-feedback.md under skills/tutor/domains/<slug>/, but TutorState.writeDomainFile writes to workspace/tutor/domains/<slug>/, so the cleanup misses them. Ran `node tests/simulations/run.js --lessons=5` in a fresh extract: exit=0, 5 students simulated. `git status --short` stayed clean, because completion is an overlay and curricula are rewritten byte-identical. But `git status --ignored` then showed new workspace/USER.md (0 bytes) and workspace/tutor/domains/{differential-geometry,category-theory,auction-theory,game-theory,quantum-computing}/{learning.md,practice-feedback.md}. I did not manage to land a SIGKILL mid-run, but by reading, USER.md is overwritten before the loop and restored only at the end.

**Fix.** Either delete the CI step and keep the file as a manual tool, or rewrite it. A rewrite would use a mkdtemp TutorStore, import selectMode and assessEngagement from production, seed the RNG, assert the expected mode and directive transitions per persona, clean up in finally, and fail if `git status` of the checkout changes.

### TST-4 (should-fix, hours): main has no branch protection and no required checks, so a green CI is advisory and merges deploy to production

**Why it matters.** Nothing mechanically stops a red or skipped CI, or an unreviewed push, from reaching production. CI results are only as trustworthy as the habit of waiting for them, and the project's own rule of 'resolved review findings before merging' is not enforced.

**Evidence.** `gh api repos/LEARNableLabs/opentutor/branches/main/protection` returns 404 'Branch not protected'. The only ruleset, 'gcg-rule' (id 14940138), has rules deletion and non_fast_forward only, with `conditions.ref_name.include: []`, so it appears to target no branches. It has no required_status_checks, no pull_request rule and no bypass list. Memory/CLAUDE.md note that merging to main deploys to opentutor-gg.vercel.app. Recent main CI runs are all success (about 35s: test 34s, lint 21s).

**Fix.** Add a ruleset or branch protection on main that requires the `test` and `lint` checks and a pull request. Optionally add a deployment-protection or smoke gate.

### TST-5 (should-fix, hours): ESLint is nearly a no-op: only no-unused-vars, no no-undef, and public/ and tests/ are not linted

**Why it matters.** A typo'd identifier, an unreachable branch or a missing await passes the lint job. The lint job suggests more safety than it gives, and CLAUDE.md presents `npm run lint` as a quality gate.

**Evidence.** eslint.config.js (whole file): one config block with files ['lib/**','scripts/**','api/**'] and a single rule, 'no-unused-vars'. It does not extend @eslint/js recommended. Verified in the extract: a new lib/zz.js containing `export function f(){ return undefinedThing.x; }` gave `eslint` exit=0. package.json lint is `eslint lib scripts api`. The CI 'Syntax check' steps (node -c) cover lib/core, lib/adapters, scripts/bot and api only, so public/*.js (about 1800 lines of front end) is neither linted nor syntax-checked outside the vm-loading tests.

**Fix.** Extend js.configs.recommended (adding Node globals), include public/ with browser globals, and fix what surfaces. Failing that, drop the claim that lint is a gate.

### TST-6 (should-fix, hours): No post-deploy smoke check and no rollback documentation tied to CI

**Why it matters.** A merge deploys straight to the hosted tutor. A bad deploy (a missing env var, function-bundle problem or broken rewrite) is found by a student, not by CI. For a first public release this is the cheapest regression net to add.

**Evidence.** .github/workflows/ci.yml has two jobs (test, lint) and nothing after deployment. No workflow probes https://opentutor-gg.vercel.app (health, sign-in boundary, a static asset). Issue #296 lists 'preview/deployment smoke checks ... documented rollback path' as proposed, unimplemented work.

**Fix.** A small workflow on deployment_status or after merge that curls /, /api/catalog (unauthenticated), asserts the 401 or 402 boundaries on /api/lesson, and checks the security headers. Document `vercel rollback` in docs/.

### TST-7 (nice, a day): Coverage gaps: a few modules and one route have no direct test

**Why it matters.** The default path is OpenRouter, which is tested (tests/adapters.test.js, openrouter-route.test.js), so the untested adapters are the portable and open-source side. The queue consumer is the one production route with no test of its own. Without a coverage report, gaps are found by grep rather than by number.

**Evidence.** By grep of tests/ for each file path or module name, no test references: api/build-topic.js (queue consumer), lib/core/lesson-completion.js, lib/core/errors.js, lib/core/concept-graph.js, lib/core/local-build-worker.js, lib/adapters/{openai,ollama,claude-sdk,base}.js. Some may be covered indirectly. All other api routes (account, catalog, chat, lesson, onboard, progress, topics, user, add-topic, topic-build via the front-end double, admin/students) have at least one dedicated test file. No coverage tool is configured (no c8 or @vitest/coverage in package.json).

**Fix.** Add a thin test for build-topic.js's handler (inactive-student early return, re-enqueue until ready or failed). Turn on @vitest/coverage-v8 and publish the number. State in the README which adapters are CI-tested.

### TST-8 (nice, hours): Test hygiene: fixed shared /tmp paths and noisy stderr

**Why it matters.** Fixed paths are a latent flake source if two files ever touch them, and on a shared CI runner or a re-run. Known noise hides real stderr, and the EISDIR line looks like a swallowed error in a test that passes.

**Evidence.** tests/bot/lesson.test.js:7-9 (/tmp/opentutor-test*), tests/bot/state.test.js:7-11 (/tmp/ot-vitest-state), tests/bot/spaced-repetition.test.js:10 and research-parse.test.js:5 use fixed /tmp paths while vitest runs files in parallel. Mostly mocked config, and stable across both of my runs. Each run prints `[progress] EISDIR: illegal operation on a directory, read` and a node-cron 'Sourcemap ... points to missing source files' warning.

**Fix.** Switch fixed paths to fs.mkdtempSync, and find which test emits the EISDIR and either assert it or silence it deliberately.

### TST-9 (nice, hours): CI workflow lacks timeouts, permissions, concurrency, scheduled jobs, dependency audit and a cross-platform check

**Why it matters.** A hung job runs for 6 hours, the default token can write more than it needs, and stacked PRs queue redundant runs. Most of this is hygiene, not release-blocking.

**Evidence.** .github/workflows/ci.yml: no timeout-minutes, no `permissions:` block (default token scope), no `concurrency:` group, a single ubuntu-latest and Node 22 matrix entry, no schedule: trigger, and no `npm audit`. In the extract `npm audit --omit=dev` reports 1 high-severity advisory (brace-expansion, GHSA-6j4f-fj2g-mc7p, a ReDoS or stack-exhaustion DoS; I did not establish whether it is reachable at runtime). tests/simulations/live-student.mjs (real-model personas) is not scheduled anywhere. Test and lint each run `npm ci` separately.

**Fix.** Add `permissions: contents: read`, `timeout-minutes: 10` and a cancel-in-progress concurrency group. Run `npm audit --omit=dev --audit-level=high` as a non-blocking job, and add a weekly workflow for live-student.mjs with a budget cap.

### TST-10 (nice, hours): Repo docs quote stale test counts

**Why it matters.** Release notes or README claims built from this number will be wrong. A small credibility point.

**Evidence.** CLAUDE.md says 'tests/ — 47 files, 447 tests' and 'npm test — 447 tests'. The extract runs 91 files and 1283 tests, both runs.

**Fix.** Drop the exact counts from CLAUDE.md or generate them.

## What the audit did not cover

- **Real end-to-end run of the model-backed journey on production** (worth a follow-up audit): Every auditor was limited to GET/HEAD, so nobody completed signup, a trial lesson, key connect (paste or OAuth), the 402 path, or account deletion on the deployed stack. First-lesson latency, DeepSeek output quality and the 60 s function limit versus longer adapter timeouts are inferred from code. The tests run against doubles (Postgres, DOM). The tests auditor already says one manual pass is needed. Do it by hand before tagging.
- **Legal and privacy obligations for a hosted service** (worth a follow-up audit): Findings OSS-4 and the privacy page cover only that no contact, terms or age statement exists (I confirmed there is no SECURITY, CONTRIBUTING, CHANGELOG, CODE_OF_CONDUCT or terms file on origin/main). Nobody assessed GDPR or UK GDPR (controller identity, lawful basis, data-subject requests, transfer to OpenRouter and the model vendors, Supabase region). COPPA and minors were not assessed either, and a tutor is attractive to children. Nobody checked OpenRouter or DeepSeek terms for passing student text through, or OpenRouter's terms for the OAuth app and key storage. A student's own key is stored encrypted on the operator's side.
- **Licensing of shipped content and assets** (worth a follow-up audit): MIT covers the code. Nobody audited the 293 domains' research.md, resources.md and link lists for copied text from Wikipedia (CC BY-SA) or course syllabi. CNT-12 touches probably unauthorised copies only in passing. Nobody checked font, logo, music or third-party skill licences beyond EB Garamond and the CC BY music. The repo also bundles three overlapping skills and a vendored .skill zip. Copyright holder and org versus personal name are open (OSS-14).
- **Name, brand and trademark** (worth a follow-up audit): No dimension checked whether 'OpenTutor' collides with existing products or marks (several education and open-source projects use the name), nor the npm and GitHub namespace. The org is LEARNableLabs, the Vercel host is opentutor-gg.vercel.app, and the contact email is a personal Gmail. The public identity of the project and its operator is undecided.
- **Educational effectiveness and pedagogy claims** (worth a follow-up audit): README and methodology present deliberate practice, SM-2 and a Socratic loop as research-grounded. No auditor ran multi-lesson sessions on a live model to see whether the tutor teaches correctly, grades fairly, resists jailbreak or prompt injection through student text, or gives wrong answers in specialised courses. Content was audited as static JSON, and the lesson quality at DeepSeek V4.1 Flash is unmeasured. The repo's eval/ directory was not examined. Methodology.md already admits there is no retention data.
- **Abuse and safety of the model output at runtime** (worth a follow-up audit): CNT-5 and CNT-6 cover static framing for hazardous topics. Nobody tested what the hosted tutor does with self-harm disclosures, medical, legal or financial questions, a minor, harassment, or attempts to turn the demo or chat into a free general chatbot. The demo's 300-character input and 150-token output caps limit cost but not content. There is no moderation, report or takedown path and no abuse contact.
- **Support, incident and abuse operations** (worth a follow-up audit): OPS-4 and SEC-7 cover alerting and a security contact. Nobody covered who answers user mail, how password resets or deletions get handled by hand (JRN-3, DATA-5), the response time promised, or what happens when the single maintainer is away. No status page or kill-switch runbook exists (the OPENTUTOR_TRIAL_CALLS_PER_DAY=0 switch is a knob but is not described as an incident lever).
- **Accessibility, internationalisation and browser or device matrix**: Only the tutor-reply live region and mobile layout are mentioned (JRN-8, JRN-14), from code. Nobody ran axe or Lighthouse, a keyboard-only pass, a contrast check, Safari or Firefox, a screen reader, or a non-English learner. Lessons are English-only by assumption, and the prompts' multilingual behaviour is untested. Performance was only measured for the catalog and static pages.
- **Supply chain and dependency licences**: npm audit was run (one high advisory in a transitive build dependency) but nobody audited dependency licences, the lockfile's provenance, Node >=22 as an install barrier for self-hosters, or the npx skills add path as an attack surface. The GitHub Actions use tag-pinned actions (OPS-14). Nobody reviewed the committed .claude/ and .agents/ directories or the GSD hooks and agent workflows for leaking into a public clone.
- **Data-protection mechanics beyond deletion** (worth a follow-up audit): Backups (OPS-7, DATA-4) are flagged, but nobody checked retention in Vercel logs, OpenRouter's prompt logging or data-collection settings for the deployment key, or whether 'DeepSeek via OpenRouter' routes to a provider that trains on or logs prompts. The privacy page says what goes to AI models. Whether the account-level OpenRouter privacy setting matches that wording was not verified.
- **Telegram bot and agent platforms in real use** (worth a follow-up audit): The modalities auditor ran only unit tests and a no-token start. Nobody ran the bot against a live Telegram token or any of the seven platform guides on its real runtime. Whether npx skills add produces a working tutor in Claude Code or Codex was not tested end to end, so claims like 'works with any compatible agent' are unverified. The claude-web .skill upload is explicitly unconfirmed (WEB-1).
- **Self-host and fork experience from a cold start**: OSS-3 notes missing steps in self-deploy.md, but nobody followed docs/self-deploy.md and docs/deployment.md against a fresh Vercel and Supabase project, including migrations 001-004 applied from scratch and the Vercel Queues beta (OPS-13). The Windows path and Node 22 constraints were not tried.
- **Scale beyond the trial budget** (worth a follow-up audit): Capacity numbers were derived from code, not load. The estimate is not measured against concurrent users: Supabase connection limits, Vercel Hobby concurrency, the per-IP Supabase Auth limit (SEC-1, inferred only) and cold starts. Nobody tested the launch-day scenario or the behaviour when the shared 300-call budget is hit mid-lesson.

### Only the owner can answer

- Is the hosted site meant to be open to the public at v0.1, or should the release be repo-only with the hosted app as an invite or demo? That decides whether the free-trial limits (SEC-2, OPS-1), the lack of password reset (JRN-3) and the lack of email verification (SEC-3) are blockers or known limits.
- Who is the legal operator of the hosted service: you personally or LEARNableLabs? Which contact address goes on the privacy page and SECURITY.md? Is the Gmail address on the account acceptable as the public contact?
- Does Vercel Hobby's non-commercial or personal-use term allow an organisation-owned project (OPS-6)? If any monetisation, sponsorship or paid tier is planned, you need Pro first. Which Supabase tier is production on (free tier projects pause when idle and have no backups)?
- Do you accept responsibility for students who are minors? Decide whether to state a minimum age (13 or 16), whether to block under-age signups, and whether you need a GDPR representative or data-processing terms with Supabase, Vercel and OpenRouter.
- Is 'OpenTutor' the final name? Has a trademark or name-clash search been done, and does it need to be in place before tagging?
- What budget are you prepared to carry for the free trial? The 300 calls a day (about $8 a month) cap is a deliberate limit (llm-access.js:69-71). Raise it, add a waitlist, or say plainly in the README that capacity is limited and the 3 free lessons are best effort.
- Should the 293 courses be presented as AI-generated and unreviewed? Are you willing to strip unverifiable DOIs and arXiv links, or label them, before the tag? Which hazardous topics (distillation, lockpicking, medical, legal) should carry disclaimers or be pulled from v0.1?
- Which modalities are in the v0.1 announcement? My suggestion from the audit: web is the headline, Telegram is experimental and self-hosted, and the agent platform guides are listed as community and unverified. Do you accept that, and are you willing to make main protected so a release tag means CI passed?
- Version scheme: package.json says 1.0.0 and the release is v0.1. Do you want package.json set to 0.1.0, a CHANGELOG, a GitHub release, and the tag cut from a commit where CI has passed? No tags exist on the repo today.
- Are you prepared to run production for a launch week: who watches errors and the OpenRouter balance, what is the rollback (promote the previous Vercel deployment), and who can answer locked-out users by hand?

### Contradictions between auditors

- Free-trial capacity is stated three different ways: journey says about 15 complete trials a day, security says roughly 10 full trial users, and ops says about 60 lessons a day. The same code gives all three: TRIAL_CALLS_PER_DAY = 300 (llm-access.js:71), TRIAL_LESSONS = 3, TRIAL_TURNS = 12 (llm-access.js:58-61). The result depends on how many calls a lesson, an onboarding message and a chat use. Only the 300 figure is verified. Publish one measured number, or say 'limited daily capacity' without a count.
- Test counts disagree across auditors: journey and security cite 1257 tests, while oss, tests and others cite 1283, all on a2ccd3f. Security and ops report 5 failures in an archive without .git, while oss and tests report all pass in a real clone. Probably the first group ran an older tree or counted differently, and the failures are an artefact of git archive. This is consistent with OSS-11, but the headline number in the release notes should come from one clean run.
- Docs accuracy: modalities says the root README no longer advertises group learning or Telegram parity, while the same dimension (DOC-1) and the oss auditor (OSS-5) say CLAUDE.md, AGENTS.md and .env.example still describe group learning and the bot's backend wrongly. CLAUDE.md on origin/main still has a 'Group learning' section, so the claim holds only for the README. Count test and domain-file claims separately.
- Strength versus finding: tests and journey both praise CI as green and the suite as trustworthy (and ops calls CI 'sound'), while TST-3 says the simulation step asserts nothing and TST-4/OPS-2 say main has no protection. I confirmed main is unprotected (gh api returns 404 'Branch not protected') and no tags exist. CI green is therefore advisory evidence only, as the tests auditor says; do not count it as a release gate.
- Content versus docs: content says '5 to 40 lessons' is true only because of one 5-lesson stub (behavioral-economics, a legacy schema, CNT-4), while the minimum otherwise is 21. The README claim and the production catalog list that stub as a full course. Docs, count and the 'median 27' claim are right, but the range is misleading.
- The landing page claims spaced repetition for the web app (JRN-7; I confirmed the string 'Spaced Repetition' on the production page), while methodology.md says SM-2 is Telegram-only. Two auditors reached this from opposite ends (journey and oss/modalities); it is one false claim to fix in one place.
- Security and ops both say secret scanning, push protection and Dependabot are off on a public repo, yet both list secrets hygiene as a strength based on a one-time regex scan of history. Both are true. The clean scan holds today but nothing prevents the next leak. The deployment's key is also referenced as living in .env, which nobody opened by rule.
- Journey calls the closing line 'your own topics' a false promise for trial accounts, while the oss, ops and security notes treat custom topics as BYOK-only by design (canCreateTopics). That is consistent with the code, so the defect is the copy only; I confirmed 'your own topics.' appears on the production landing page.
- A smaller point: the SEC-6 and BOT-1 findings (Telegram answers any chat and shares one global profile) sit beside the OSS and content digests describing a per-student 'group learning' feature. If group learning is documented anywhere as supported, it conflicts with a bot that has no access control by default. Either remove the claim or add the allowlist.

## From this session

### [ISSUE] in the chat: turn a student's message into a prefilled GitHub issue
A message starting with `[ISSUE]` is caught by a plain prefix check in `api/chat.js` (no model call, no new Vercel function). The tutor shows a preview and a button that opens GitHub's own "new issue" page prefilled (title, body, label `student-report`), so the student posts it under their own account: no server token, no spam surface, explicit consent. The body adds topic slug, lesson number, step, app commit and the tutor's last reply; never the profile or other answers; length-capped for the URL. Later option: a maintainer-only direct-create endpoint. Same path for Telegram. Feeds the content audit (#301).

### Case-insensitive URL schemes in lesson links
`api/lesson.js` keeps resources matching `/^https?:\/\//` (case-sensitive), as do the citation matcher in `lib/core/links.js` and the URL extractor in `pipeline.js`; `HTTPS://…` is a valid URL that never reaches a lesson. None of the 14,190 shipped resources is affected. Make all of them agree. (Raised by Codex on #309, declined there.)

### Untracked and locally deleted files in the main checkout
`.claude/workflows/*.js` show as deleted and `claude-web/research-scientist-interview-loop.skill` as untracked in the main checkout since before this session. Decide: commit, ignore or remove.

### Narrow-phone overflow of the welcome card (#278)
Reported by the #308 agent, not verified: at 320 px the card is 345 px in a 288 px column. Verify, then fix.

### Scrollbar covers the chat bubbles' right edge
`#chat-messages` has 2 px padding, so the scrollbar overlaps the bubbles' border. One-line fix.

### Streaks in the learner's timezone (#310), and the bot's "Streak: 0 days" for a broken streak

### Flashcard delivery stops at the first poll Telegram refuses (the pattern #307 fixed for quizzes)

---

# Code review findings

Whole-repo review of origin/main by subsystem (8 reviewers). Every bug, dead-code and non-low simplify claim was re-checked by an independent skeptic who tried to refute it; findings marked **confirmed** survived, **not verified** were not checked (low-priority simplify and all improve items, or beyond the first 8 per area). Refuted claims are listed at the end. Dead-code claims list what was searched; re-run the grep before deleting.

## Curriculum pipeline and research

Curriculum pipeline and research (read in full on origin/main, 5 pipeline tests pass, plus live probes of the research sources). The durable web build (topic-builds.js with the pipeline's _plan/_build/_critique steps) is well fenced: compare-and-set, leases, and checkpoints held up. The weak points are around it. (1) Research is unreliable in production: the hosted quick start throws away all research whenever one source is slow, and the hosted build never retries it. Of the 8 sources, YouTube (Invidious) and syllabi return nothing, and Semantic Scholar was 429 in the probes. (2) The hosted and local web builds skip URL verification and the syllabus and concept checks that only the Telegram bot passes. (3) Agentic mode (#122) is enabled by no production caller, and it has real defects: it ignores verifyUrls, and build_module is just build and never sees the critique. (4) The deterministic run() loop still carries a second, inline copy of the plan/build/critique steps (about 55 lines). (5) A cluster of dead or no-op code: concept-graph.js (only feeds a log line, and its parser corrupts dependencies containing "and"), the lib/core/index.js barrel that nothing imports, test-only prompt builders, and two finished one-shot scripts. (6) Topic slugs mangle non-ASCII names, and C, C++ and C# all collapse to "c". Nothing here is already tracked in the open issues or issues.md, except where noted: SEC-10 and #293/CNT-1 partly overlap findings 2 and 4.

### PIPE-1 (bug, high, hours, confirmed): Hosted quick start discards ALL research when any one source is slow, and the build never researches again

**Where.** lib/core/quick-start.js:87-98; lib/core/research.js:28-38 and 399-435; lib/core/topic-builds.js:95-100

**Evidence.** generateQuickStart wraps the whole researchTopic() call in one 8000 ms race (quick-start.js:90-96) and falls back to {} if it loses. researchTopic is Promise.allSettled over 8 sources, so it takes as long as the slowest one. searchYouTube tries 3 Invidious hosts one after another with an 8 s abort each (research.js:409-431). I probed them: vid.puffyan.us hangs or answers 502, invidious.snopyta.org gives ECONNRESET, inv.nadeko.net gives 403 'Endpoint disabled'. A live researchTopic('Knot theory') took 8678 ms. A live generateQuickStart with a stub adapter took 8003 ms and returned researchContext of 0 chars (the prompt had no research-results block). The next run was fast and returned 6456 chars, so it is flaky. When it loses, topic-builds.js:98-100 stores researchContext '' and files['research.md']=''. Every later hosted phase passes `researchContext: doc.researchContext || ''` (topic-builds.js:95) to _plan/_build/_critique, and only pipeline.run() ever calls this.research (pipeline.js:84-88), which the hosted path never uses. The plan, curriculum, resources.md and the Teacher's research.md are then built from nothing, which is the setup for invented sources (#293/#301).

**Proposal.** Two changes cover most of it. (1) In topic-builds.js, when the 'plan' phase starts with an empty doc.researchContext, run researchTopic once there. That step has a 270 s budget, and the result goes into next.researchContext and files['research.md']. This closes the gap even if quick start times out. (2) In researchTopic, add a per-source cap, a small wrapper around each promise that resolves to its empty value at the cap, and keep arXiv and OpenAlex at 15 s. Turn the quick-start 8 s bound into a deadline that takes whatever sources have finished, which needs researchTopic to accept an AbortSignal or a deadline. Fix (1) is the lower-risk first step because it needs no change to the source timeouts. Tests: research-handoff.test.js with one hanging source, and topic-builds.test.js with an empty researchContext at the plan phase.

**Risk.** Short per-source caps may cut slow but good sources (arXiv often takes more than 5 s). Keep arXiv and OpenAlex at 10-15 s and run the quick-start bound as a deadline. Needs a new test in research-handoff.test.js with one hanging source, and one in topic-builds.test.js for an empty researchContext at the plan phase.

> Skeptic: PIPE-1 holds. Everything checks out on origin/main apart from the live flakiness numbers, which I did not re-measure. researchTopic (research.js:28-38) is a Promise.allSettled over 8 sources, so its latency is that of the slowest source. generateQuickStart (quick-start.js:87-98) races that whole call against one 8000 ms timer and falls back to `{}`. formatResearchContext({}) returns '' (it joins an empty sections array), so the hosted build stores researchContext '' and research.md ''. In topic-builds.js:95 every later phase gets `doc.researchContext || ''`. _plan and _build (pipeline.js:211, 230) only use ctx.researchContext and never fetch. The only fetch is in pipeline.run() at pipeline.js:84-88, which is skipped on the hosted path. So the plan, curriculum and domain files are built from no research, and no phase retries it. The slow-source trigger exists: searchYouTube (research.js:409-431) tries 3 hosts one after another with an 8 s abort each, up to 24 s on its own. Other sources are capped at 10-15 s, and arXiv and OpenAlex use 15 s. The 8 s race therefore discards everything whenever any single source takes longer than 8 s.

### PIPE-2 (bug, high, hours, confirmed): Web builds never run URL verification, syllabus or concept checks; the loop also loses dead-URL info after pass 1 and ignores lesson-level links

**Where.** lib/core/topic-builds.js:111; lib/core/pipeline.js:150-160 and 258-269; scripts/bot/curriculum.js:139-143

**Evidence.** Only the Telegram bot passes {syllabi, wikiConcepts, verifyUrls} to the pipeline (curriculum.js:139-143). The hosted and local web builds call `pipeline._critique(ctx)` with no options (topic-builds.js:111), so options.verifyUrls is never consulted: no dead-url list is built, and Critic dimensions 4 (dead URLs), 9 and 10 never appear in the prompt. Inside the deterministic loop, verification runs only at iteration 1 (pipeline.js:152) and `let deadUrls = options.deadUrls || []` is re-declared on every pass (pipeline.js:151), so passes 2 and 3 see no dead URLs and a revised resources.md goes unchecked. The URL regex runs only over resources.md (`lastParsed.resources`, pipeline.js:154), never over lessons[].resources, which are the links the tutor trusts (#271). The regex also captures trailing punctuation, and HEAD-only checking (research.js:516) gives false 'dead' results on hosts that reject HEAD. This is the pipeline-wiring side of #293/CNT-1: those cover the invented links already shipped, while the production build path has no verification step at all.

**Proposal.** Do it as its own bounded build step, not a burst inside _critique. 1) Collect URLs from resources.md and every lesson.resources entry, strip trailing punctuation, de-duplicate, and cap concurrency (about 8) and total count. 2) Check YouTube links with the oEmbed endpoint, as #293 designs, because HEAD on watch URLs cannot detect invented ids. Check other hosts with HEAD, and retry once with GET plus a Range header on 403/405. Set redirect:'manual' per SEC-10. 3) Store deadUrls on doc.draft in topic-builds and in ctx in the pipeline, declare `let deadUrls` outside the loop, and pass it to buildCriticPrompt in all three modes. 4) Give the step its own time budget inside the 270 s deadline and treat a timeout as "unknown", not "dead". 5) Fold this into #293 item 5 rather than filing a separate issue. Tests: a verifyUrls stub in topic-builds.test.js and pipeline-research.test.js, plus a case where iteration 2 still sees the iteration 1 dead URLs.

**Risk.** Adds one fetch burst (5 s timeout) to a serverless step, so it needs its own budget inside the 270 s deadline. Redirect-following in verifyUrls is already flagged in SEC-10. Tests: pipeline-research.test.js and topic-builds.test.js need a verifyUrls stub case.

> Skeptic: Holds, but "high" is generous: it is a wiring gap in generated curricula, not a crash or data loss. Every cited mechanism is real on origin/main. (1) Only scripts/bot/curriculum.js:139-143 passes verifyUrls, syllabi and wikiConcepts. topic-builds.js:111 calls pipeline._critique(ctx) with no options, so deadUrls, syllabi and wikiConcepts are null. The Critic prompt then has no dead-urls block and no dimensions 9 or 10 (prompts.js:205-218). The web build never verifies a URL. (2) pipeline.js:151 has `let deadUrls = options.deadUrls || []` inside the loop, and verification is gated on `iteration === 1` (line 152). Passes 2 and 3 therefore run with an empty list, and a revised resources.md is never re-checked. (3) The regex at pipeline.js:155 runs only over lastParsed.resources. It never touches curriculum.lessons[].resources, which are the links the tutor trusts (#293). (4) The regex `[^\s)>"]+` keeps trailing '.' and ','. verifyUrls (research.js:511-526) does HEAD only, with default redirect following, so hosts that reject HEAD show up as dead. (5) Agentic mode calls _critique(ctx, options) at pipeline.js:403 and never calls options.verifyUrls. Only options.deadUrls is read, and no caller sets it, so verification is dead in agentic mode for the bot too. Not already tracked: #293 item 5 assumes the builder's verification already exists and only proposes adding a shape check to it. The SEC-10 draft in issues.md mentions in passing that the web path does not use verifyUrls, but it does not file the gap as a bug. #296, #289 and #286 are unrelated. One omission in the finding: HEAD on a YouTube watch URL generally returns 200 even for a nonexistent video id (from my knowledge of YouTube; I did not test it). The proposal would therefore not catch the invented YouTube ids that motivate #293.

### PIPE-5 (bug, medium, hours, confirmed): Topic slugs: non-ASCII topics cannot be created, accents drop letters, and C, C++ and C# collapse to the same course

**Where.** lib/core/topic-builds.js:21-28; lib/core/generated-topics.js:6-10; api/topic-build.js:17

**Evidence.** I ran normalizeTopicRequest. '日本語' and 'Математика' throw RequestError 'Invalid topic slug' (the slug is ''), a message that says nothing about what to do. 'Café culture' gives 'caf-culture'. 'C++', 'C#' and 'C' all give 'c'. In prepareTopicBuild (topic-builds.js:33-38), a student who asks for 'C++' after any 'C' build, or after a shipped 'c' domain, gets `existing` back and the build is skipped, so they silently receive the wrong course. The same applies to 'R' versus 'R++' and similar names.

**Proposal.** Slugs that already work must not change, because the slug is the storage key. Leave the current slug function as the first choice, and add fallbacks only where it fails or collides. (1) If the slug is '' after stripping, use 't-' + sha1(topic.trim().toLowerCase()).slice(0,8). That matches the slug regex and does not touch any slug that works today. '!!!' still has no alphanumeric content, so keep rejecting it with a clearer message ('Use letters or digits in the topic name'). (2) For a collision: if the stored doc.topic (or the existing curriculum's topic) differs case-insensitively from the requested topic, derive the slug from the topic with '+' mapped to 'plus' and '#' mapped to 'sharp' (c-plus-plus, c-sharp) and suffix a short hash if that also collides. Do not remap the plain case, so 'C' stays 'c'. Do NOT switch to NFKD in normalizeTopicRequest alone: it would change 'caf-culture' to 'cafe-culture' and orphan existing builds. If wanted, do it together with a lookup of the old slug. (3) Put one shared topicSlug() in lib/core and have chat.js, onboard.js and scripts/bot/curriculum.js use it, so every entry point agrees. Tests: update the '!!!' cases only if the message changes, and add cases for '日本語', 'C++' after 'C', and 'Café'.

**Risk.** The slug is the storage key, so existing slugs must not change for names that already work. The tests at add-topic-route.test.js:48 and topic-builds.test.js:100 expect 'Invalid topic slug' for '!!!', so that case needs a decision (reject only when nothing alphanumeric survives).

> Skeptic: Holds as a medium bug. I reproduced the slugs with the exact regex from topic-builds.js:24. '日本語' and 'Математика' give '', so generatedTopicKey throws 'Invalid topic slug' (a RequestError, 400, with no hint on what to do). 'Café culture' gives 'caf-culture'. 'C', 'C++' and 'C#' all give 'c', and 'R' and 'R++' both give 'r'. The input is free text: public/app.js:657 and the #new-topic field send it straight to /api/add-topic, and api/add-topic.js:21 calls normalizeTopicRequest with no other slugging. Two imprecisions in the evidence, neither of which defeats the finding. (1) No shipped 'c' or 'r' domain exists on origin/main (ls-tree has no skills/tutor/domains/c or r), so the shipped-domain collision example is hypothetical. (2) The 'existing' branch is not the usual collision path. A student who already built 'C' has a generated_topic doc for slug 'c', so a later 'C++' request takes the doc path: prepareTopicBuild reads the doc, and addTopic returns buildSummary of the C course when its status is 'ready' (a build still in flight is simply resumed). Either way the student gets the C course, never a C++ one, and the stored doc.topic ('C') is never compared with the request. Related inconsistency the proposal should absorb: api/chat.js:24 and api/onboard.js:98 use a different slugger that applies NFKD first, so 'Café' gives 'cafe' there but 'caf' in normalizeTopicRequest. The same topic can get different slugs depending on the entry point. Not tracked: no open issue or issues.md entry mentions slugs, Unicode or C++.

### PIPE-3 (dead-code, medium, hours, ~370 lines, confirmed): Agentic orchestrator mode is enabled by no production caller, and its two headline behaviours do not work

**Where.** lib/core/pipeline.js:286-418 (+27-44, 94-96); lib/core/prompts.js:606-657; tests/pipeline-agentic.test.js; CLAUDE.md:128, docs/architecture.md:52-64

**Evidence.** Searched lib/, api/, scripts/, public/, package.json, vercel.json, docs: `mode: 'agentic'` appears only in tests (pipeline-agentic, pipeline-parse:97, topic-levels:111) and docs. The two real constructors (scripts/bot/curriculum.js:132, topic-builds.js:94) never pass mode, and the docs say 'Deterministic remains the default until agentic has run on real topics'. I also ran it with a stub adapter. (a) The agentic path never calls options.verifyUrls: in the same scenario deterministic called it once and agentic called it 0 times (_critique reads only options.deadUrls, pipeline.js:267). (b) `build_module` is an alias of `build` (pipeline.js:394): both call _build(ctx), which rebuilds all lessons, and buildCurriculumBuilderPrompt has no critique parameter (prompts.js:138). In the probe the builder prompt after a REVISE critique did not contain the critique text. So 'a local complaint can get a local fix' (CLAUDE.md:130) is not true: the orchestrator pays for a full rebuild from the same plan. Only _plan reads the critique.

**Proposal.** Delete only the agentic-specific code: the `mode` constructor option and the `if (this.mode === 'agentic')` branch at pipeline.js:94-96, then `_runAgentic`, `_decide`, `_act`, `_runDeterministicTail`, MAX_AGENTIC_STEPS and ACTIONS, `buildOrchestratorPrompt` with its index.js export, tests/pipeline-agentic.test.js, and the CLAUDE.md and architecture.md paragraphs. KEEP `_plan`, `_build` and `_critique` (pipeline.js:~208-285). lib/core/topic-builds.js:103-111 calls them, and tests/pipeline-output-room.test.js:41,57 call `_critique`. Fix the comment above them ("Extracted so agentic mode composes..."), which would go stale. Reduce the two it.each tests to the deterministic case, or drop the loop and the `mode` parameter. Run the full suite plus a lint pass for now-unused imports.

**Risk.** Deletion drops #122's stated experiment. Check that the three tests that loop over ['deterministic','agentic'] still make sense with one mode.

> Skeptic: PIPE-3 holds. Agentic mode is dead in production: the two real constructors never pass `mode`, and the only `mode: 'agentic'` uses are tests and docs. Both claimed defects are real in the code. Deleting it is safe if done narrowly (see saferProposal).

1. No production caller. The `new CurriculumPipeline` sites are scripts/bot/curriculum.js:132 (adapter, state, skills, onProgress only) and lib/core/topic-builds.js:94 (adapter, skills, state only). Nothing reads an env var for the mode; a grep for PIPELINE_MODE finds nothing. `_runAgentic` is called only from pipeline.js:94, and `buildOrchestratorPrompt` is used only by `_decide`, plus its export at lib/core/index.js:29. Issue #122 is closed. Docs (CLAUDE.md:128, docs/architecture.md:52-64) say deterministic stays the default until agentic has run on real topics.

2. verifyUrls is never called in agentic mode. The deterministic loop calls `options.verifyUrls` at pipeline.js:152-159. `_critique` (pipeline.js:~249) reads only `options.deadUrls`, and `_act` never calls verifyUrls. The bot passes `verifyUrls` at scripts/bot/curriculum.js:142, so an agentic bot build would silently lose dead-URL checking.

3. `build_module` is only an alias of `build`. `_act` runs `action === 'build' || action === 'build_module'` through the same `_build(ctx)`, which rebuilds the whole curriculum and the domain files. `buildCurriculumBuilderPrompt(skills, topic, slug, studentLevel, researchContext, planText)` at prompts.js:138 has no critique parameter. Only `_plan` receives `ctx.critique`. So the orchestrator prompt tells the model "build_module: one module is weak", but nothing reaches the builder, and the "local fix" claim at CLAUDE.md:130 is false.

Side findings:
- tests/pipeline-parse.test.js:97 and tests/topic-levels.test.js:111 each loop over ['deterministic','agentic']. Collapsing them to one mode loses no distinct coverage. They exercise `_parsePipelineOutput`/`withTopicMeta`, which both modes share. topic-levels.test.js:111 asserts through `.catch(() => {})` and only that `written.length > 0`, so it would also pass if agentic failed early.
- Size matches the estimate. The agentic block runs from about pipeline.js:270 to 418 (~130 lines), plus ~52 in prompts.js (606-657), the test file, and the doc paragraphs.

### PIPE-4 (dead-code, medium, hours, ~130 lines, confirmed): Syllabi scraper can never match and three of the other research sources return nothing; the level parameter is ignored

**Where.** lib/core/research.js:336-395 (searchSyllabi), 399-435 (searchYouTube), 28; scripts/bot/curriculum.js:117-123

**Evidence.** Live probes. https://ocw.mit.edu/search/?q=Knot%20theory&type=course returns 200 with 9.8 KB of HTML that contains no '/courses/' link (client-rendered), so the regex at research.js:348 gets 0 matches. The 'Google fallback' (the comment says Google, the code uses DuckDuckGo html, research.js:370-372) returns 40 results, all wrapped as href='//duckduckgo.com/l/?uddg=https%3A...'. The regex at :378 needs a direct https://(ocw|www.coursera|www.edx) href, so 0 matches. So searchSyllabi always returns []: the bot's syllabiContext is always null and Critic dimension 9 never fires. searchYouTube: all 3 hardcoded Invidious hosts failed (502 or timeout, ECONNRESET, 403 'Endpoint disabled'), so it always returns [] after up to 8 s. This is the cause of PIPE-1's latency. SEC-10 in issues.md covers only the trust angle of these hosts. Semantic Scholar answered 429 with and without a User-Agent (no API key). `researchTopic(topic, _options)` ignores `level`, yet 4 callers thread it (pipeline.js:28, quick-start.js:96, bot/curriculum.js:101,115).

**Proposal.** Do it in two steps, and re-probe from a Vercel region first.

1. Remove searchYouTube now. It is the cleanest dead path, and removing it recovers up to ~8 s of latency per call (three sequential 8 s timeouts at worst), which is the PIPE-1 latency. Delete the `youtube` key from researchTopic and its formatResearchContext section. Edit the research-handoff.test.js expectations (:105-106 exact-equality keys and the :89 `youtube` assertion), research-parse.test.js:~140-151, and the CLAUDE.md, README, docs/methodology.md and privacy.html mentions.

2. For syllabi, either remove it or replace it with something that works (for example a real OCW or edX API, or Wikipedia/OpenAlex-derived outlines). If you remove it, remove the whole chain together:
   - the `syllabi` key in researchTopic
   - the formatResearchContext section at :126-131
   - the bot's `syllabiContext` and the `syllabi` option at bot/curriculum.js:119-121 and :140
   - `options.syllabi` at pipeline.js:69, :172 and :266
   - the prompts.js:201-203 and :222 branches
   - the tests that exercise them (prompts.test.js:151-180, research-parse.test.js:124-135 and :185-193, the research-handoff.test.js syllabi-fallback test at :89-98)

3. Independently, drop the `{level}` threading and the `_options` parameter. They are safe to remove as a separate trivial change.

Keep wikiConcepts; it is a different source and works.

**Risk.** The Critic loses a dimension that is already inert. Tests in research-parse.test.js that assert the 'Course Syllabi' and 'Video Resources' sections of formatResearchContext would need trimming. Re-probe from a Vercel region before deleting, since OCW or an Invidious host may behave differently there.

> Skeptic: Holds for the core claim: searchSyllabi and searchYouTube cannot return results in practice, and `level` is ignored (`_options` unused, research.js:28). Two caveats. (1) The DuckDuckGo half is only partly reproduced. My probe got an anti-bot "anomaly" challenge page (202), so I could not see real results. The reviewer's uddg-wrapping claim is plausible and matches how DDG's html endpoint works, but I did not see it myself. The regex at research.js:378 only accepts a direct https://(ocw|www.coursera|www.edx) href, so it cannot match uddg-wrapped links. (2) These probes ran from a local machine, not a Vercel region. Delete both functions only after a re-probe from Vercel, or replace them with working sources. The deletion touches more than the finding lists: privacy.html, CLAUDE.md, README and docs/methodology.md all name these sources, and tests/research-handoff.test.js asserts on the syllabi fallback and the youtube key (details in the saferProposal). Net savings are roughly 100 lines in research.js plus about 10 in bot/curriculum.js and prompts.js.

### PIPE-8 (dead-code, medium, minutes, ~190 lines, confirmed): concept-graph.js only feeds a log line, its parser mangles dependency names, and lib/core/index.js (the only other reference) is imported by nobody

**Where.** lib/core/concept-graph.js:1-138; scripts/bot/lesson.js:376-386; lib/core/index.js:1-40

**Evidence.** Searched lib/, api/, scripts/, public/, tests/, docs, package.json, vercel.json. The only runtime use is scripts/bot/lesson.js:380-382, which parses the graph and logs 'propagating mastery credit to prerequisites' without writing anything (the 'Knowledge-graph credit propagation' comment is false). getDependents, computeConceptMastery and checkPrerequisites are referenced only by the lib/core/index.js re-export, and tests/ has no test of the module. lib/core/index.js itself is imported by no file in lib/, api/, scripts/ or tests/, and package.json has no main or exports, so the documented `import … from 'opentutor/lib/core'` does not even resolve in ESM. The parser is also wrong: `.split(/,|and/)` (concept-graph.js:26) splits on the substring 'and'. Input '**Hypothesis testing** depends on: Standard deviation, Understanding probability' gives ['st','ard deviation','underst','ing probability']. Shipped concept maps also contain prose like 'outcomes depend on multiple decision-makers', which the regex at :23 reads as a dependency.

**Proposal.** Delete concept-graph.js, the try block and its import at scripts/bot/lesson.js:24, and lib/core/index.js. Remove CLAUDE.md:26. Leave docs/review-professor.md alone, since it is a dated review. Check whether `readDomainFile` is still used elsewhere in lesson.js before removing its import.

**Risk.** Edit CLAUDE.md:26 and the 'credit propagation' mentions in docs. docs/review-professor.md:93 mentions the module. Tests: none cover it, so nothing to port. The bot's lesson tests mock it, so check that they still pass.

> Skeptic: Holds. The only runtime use of concept-graph.js is the try block in scripts/bot/lesson.js, which calls parseConceptGraph and getPrerequisites and writes one log line. It writes no state and gives no credit, so the 'Knowledge-graph credit propagation' comment is false. lib/core/index.js is imported by nothing, and no repo file or doc refers to the 'opentutor/lib/core' path it advertises. The parser bug reproduces. One correction to the finding: the bot lesson tests do not mock concept-graph.js, so the claim 'the bot's lesson tests mock it' is wrong. That makes deletion safer, because nothing in tests depends on it. After deleting, run tests/bot/lesson.test.js and tests/bot/lesson-lifecycle.test.js, and run lint to catch the now-unused readDomainFile import if it has no other use in lesson.js.

### PIPE-9 (dead-code, medium, hours, ~250 lines, confirmed): Test-only prompt builders: lib/core buildTeacherPrompt and six in bot/context.js, plus bot copies of clip/escapeXml/untrustedData

**Where.** lib/core/prompts.js:234-293; scripts/bot/context.js:26-44, 89-112, 189-193, 195-226, 228-283, 284-313

**Evidence.** Searched lib/, api/, scripts/, public/. lib/core buildTeacherPrompt (prompts.js:234) is referenced only by tests/prompts.test.js (about 7 tests), lib/core/index.js and old review docs; api/lesson.js and the bot both moved to buildLessonPlanPrompt/buildSocraticResponsePrompt. In scripts/bot/context.js, buildLessonPrompt, buildTeacherPrompt, buildIntroPrompt, buildQuickStartPrompt (the wrapper), buildResearchSynthesisPrompt (an older Phase B prompt that duplicates pipeline.js's builder) and buildTutorResumePrompt have no importer apart from tests/bot/context.test.js (buildLessonPrompt) and mocks. The only live imports from context.js are loadSkillFiles, buildChatPrompt, buildFlashcardPrompt, buildOnboardingPrompt and buildQuizPrompt. context.js also keeps its own copies of clip, escapeXml and untrustedData (:26-44), byte-identical to prompts.js, which already exports them (prompts.js:507). Both TELEGRAM_TUTOR_PERSONA and TEXT_ONLY_LIMITS then serve only the dead builders and a few live ones: check before removing.

**Proposal.** Do it in two PRs. First delete the core `buildTeacherPrompt` (prompts.js:234-293), its re-export in lib/core/index.js:25 and its test block in tests/prompts.test.js. Second, in context.js, delete the six dead builders and the `buildIntroPrompt` alias, plus the now-unused `buildCoreQuickStartPrompt` and `readDomainFile` imports. Replace the local `clip`, `escapeXml` and `untrustedData` with `import { VOICE, untrustedData } from '../../lib/core/prompts.js'`. Keep `TELEGRAM_TUTOR_PERSONA`, `TEXT_ONLY_LIMITS` and `buildUserContext`. Rewrite the tests/bot/context.test.js lesson-prompt test against `buildChatPrompt`. Remove the stale `buildLessonPrompt` and `buildTeacherPrompt` entries from the context.js mock in tests/bot/lesson.test.js. Run `npm test` and `npm run lint` after each PR.

**Risk.** Re-check scripts/bot/context.js usage of TELEGRAM_TUTOR_PERSONA, TEXT_ONLY_LIMITS and buildUserContext after the removal. tests/voice.test.js reads context.js source text and may need adjusting. The bot part belongs to the bot reviewer: confirm there.

> Skeptic: Holds. I searched origin/main (everything except docs/) for every name and found no production caller of any of the seven builders. I ran no tests, so removal is verified by grep only.

Core: lib/core/prompts.js:234 `buildTeacherPrompt(state, skills, lesson, topicSlug)` is referenced only by:
- tests/prompts.test.js (a 7-test describe block at :186-236)
- the re-export in lib/core/index.js:25
- docs/product-review.md and docs/review-engineer.md, which describe an older design

Nothing in api/, scripts/ or public/ imports it. Nothing imports lib/core/index.js either (no `core/index` match anywhere outside docs). Dynamic and string-built access would still be caught by the name grep, and none exists.

Bot: scripts/bot/context.js has five dead builders, each with no importer: `buildLessonPrompt` (:89), `buildQuickStartPrompt` (:189), `buildIntroPrompt` (:193), `buildResearchSynthesisPrompt` (:195), `buildTeacherPrompt` (:228) and `buildTutorResumePrompt` (:284).
- The only importers of context.js are scripts/bot/chat.js (`buildChatPrompt`), flashcard.js (`buildFlashcardPrompt`), index.js (`loadSkillFiles`), onboarding.js (`buildOnboardingPrompt`) and quiz.js (`buildQuizPrompt`).
- The test files that name these builders only mock them. tests/bot/lesson.test.js:18-19 mocks `buildLessonPrompt` and `buildTeacherPrompt` for a module scripts/bot/lesson.js does not import, so the mock is also dead.
- tests/bot/context.test.js is the one real consumer: it imports `buildLessonPrompt` (:26) and uses it in one test.
- The live Telegram quick-start path calls `buildQuickStartPrompt` from lib/core/quick-start.js (tests/voice.test.js and tests/topic-levels.test.js use that one). The bot wrapper at :189 is a dead pass-through.

Duplicated helpers: `clip`, `escapeXml` and `untrustedData` in context.js:26-44 are byte-identical to prompts.js:9-25, and prompts.js:507 already does `export { untrustedData, clip, escapeXml }`. Only `untrustedData` is used by the live builders. `clip` and `escapeXml` are only used inside `untrustedData` in this file.

Risks to handle:
- `TELEGRAM_TUTOR_PERSONA` and `TEXT_ONLY_LIMITS` stay. The live `buildOnboardingPrompt` (:119-120) and `buildChatPrompt` (:143-144) use them, so delete only their dead-builder uses.
- `buildUserContext` stays. The live onboarding and chat builders call it.
- After the deletions, the `readDomainFile` import (context.js:11) and the `buildCoreQuickStartPrompt` import (:7) become unused and will fail lint.
- tests/voice.test.js:52-55 reads the context.js source for the `VOICE` import. This still passes because `VOICE` stays imported for the persona. Importing `untrustedData` from prompts.js adds a name to the same import line, which the regex `\{[^}]*\bVOICE\b[^}]*\}` tolerates.
- tests/opentutor-name.test.js requires "You are OpenTutor" in lib/core/prompts.js. It will still pass: prompts.js:524 and :594 also contain it, and context.js:15 keeps its own copy.
- The test at tests/bot/context.test.js:59-68 ("keeps impossible agent capabilities out of lesson prompts") uses the deleted `buildLessonPrompt`. Rewrite it against `buildChatPrompt` (same `TEXT_ONLY_LIMITS` assertion) or drop it.
- Delete the 7-test `buildTeacherPrompt` describe block at tests/prompts.test.js:186-236 and the matching import at :8.
- If `mockState` (tests/prompts.test.js:29) is used only by that block, remove it too.

Line estimate: about 60 lines in core (prompts.js:234-293). In the bot, about 147 lines of builders plus 19 of helpers, so about 165 total. Tests lose about 55 lines (the 7 core tests plus the context test).

### PIPE-13 (dead-code, low, minutes, ~185 lines, not verified): scripts/generate-teacher-md.js is a finished one-shot with no caller; its default run is a no-op

**Where.** scripts/generate-teacher-md.js:1-185; CLAUDE.md:49

**Evidence.** All 293 shipped teacher.md files carry this script's output ('This domain uses a mix of delivery formats' appears in 293 of 293), so the default filter at lines 23-30 (skip when teacher.md exists) selects 0 domains. New topics get teacher.md from the LLM domain-files prompt (prompts.js:165-185), not from here. Searched lib/, api/, scripts/, tests/, docs, package.json and vercel.json: no import, no npm script, no test. It runs its work at import time (no main guard), and --force would regenerate all 293 shipped files in place. CNT-8 in issues.md judges its output as metadata rather than real teaching config, which is a content point, not this one.

**Proposal.** Delete it (185 lines) and the CLAUDE.md line. git history keeps it for anyone who must regenerate.

**Risk.** None at runtime. If someone wants the script's template as a fallback for topics where the model returns no teacher, that is a feature to design instead.

### PIPE-14 (dead-code, low, minutes, ~190 lines, not verified): scripts/backfill-topic-levels.js has done its job (293/293 levelled) and keeps a second copy of the level rule

**Where.** scripts/backfill-topic-levels.js:1-127; lib/core/quick-start.js:34-52; tests/topic-levels.test.js:59-141,232

**Evidence.** I scanned all 293 shipped curriculum.json: 293 have a valid level, 293 have prerequisites, and one has preliminary:true. The only callers of the script's exports (withLevel, levelFrom, kindOf) are 5 tests in topic-levels.test.js; nothing in lib/, api/, scripts/ or package.json runs it. levelFrom (script lines 33-36) is a second statement of the level rule that topicMeta (quick-start.js:42-48) already applies, and the two can drift. The script calls a real model for each of the 293 files, so a stray --force rewrites every file.

**Proposal.** Delete the script and its 5 tests (about 130 + 60 lines), or, if re-rating must stay possible, move it out of scripts/ and into a docs note. Keep isUniversity/isSchool/topicMeta in quick-start.js, which are live.

**Risk.** Loses the --only re-rate path for a future calibration pass (the audit file option). CLAUDE.md:50 and issue #251's description mention it.

### PIPE-6 (simplify, medium, hours, ~55 lines, confirmed): The deterministic run() loop is a second inline copy of the _plan/_build/_critique steps

**Where.** lib/core/pipeline.js:98-194 versus 211-284

**Evidence.** The comment at pipeline.js:206-209 says the steps were 'Extracted so agentic mode composes exactly the same work the deterministic loop does, rather than a second implementation that can drift', but the deterministic loop was never switched over. Lines 102-148 duplicate _plan and _build line for line (same prompts, same file writes), and 165-182 duplicate _critique. The only differences are the 'iteration i/MAX' text in the critic's user message, onProgress calls, and the verify step. The two copies have already drifted: only the loop's critique has the iteration text, and only _critique handles `fixedLessons`.

**Proposal.** Build a ctx per iteration, `{topic, slug, studentLevel, researchContext, critique: critiqueText}`, then set `ctx.plan = await this._plan(ctx)` and `ctx.parsed = lastParsed = await this._build(ctx)`. After the verify step, call `this._critique(ctx, {...options, deadUrls})`. Keep the onProgress calls and the verify step between the calls. To keep the 'iteration i/3' text, add an optional `ctx.iteration` that _critique appends to the user message when set. Alternatively, drop the text and say so in the PR, since the critic prompt does not depend on it and the hosted path already omits it.

**Risk.** Covered by pipeline-parse, pipeline-research, pipeline-output-room, topic-levels and the deterministic cases of pipeline-agentic (82 tests ran green). A prompt test that asserts the 'iteration 1/3' text, if one exists, would change. Do this before or together with PIPE-3, not after.

> Skeptic: Holds. I diffed run() lines 98-194 against _plan/_build/_critique at 211-284 on origin/main. The plan and build bodies match line for line: same prompts, same parse and fallback, same writes to plan.md, curriculum, concept-map, teaching-notes, resources and teacher.md. The critique body matches too: same buildCriticPrompt arguments, same critique.md write, same `deadUrls` handling. The only real differences are:
(a) The loop's critic user message appends ` (iteration i/3)`, and _critique's does not.
(b) _critique adds the `fixedLessons` suffix, but only topic-builds.js:95 ever sets `ctx.fixedLessons`.
(c) The loop emits onProgress and runs the verify step between calls.

Two corrections to the finding:
- "Drifted" is overstated. The `fixedLessons` gap is not drift, because run() never has published starter lessons. Only the iteration text is real drift.
- The hosted path (topic-builds.js:103-111) already calls pipeline._plan, _build and _critique. The loop is the only remaining inline copy. It serves the bot (scripts/bot/curriculum.js) and `_runDeterministicTail`, so the refactor unifies the bot and fallback paths with the hosted one.

The saving is about 45-55 lines. The proposal is behaviour-preserving apart from the iteration text, as long as the per-iteration `deadUrls` quirk is kept. That means `deadUrls = options.deadUrls || []` is reset every iteration, and verifyUrls runs only on iteration 1.

Tracking: no open issue titles match this (I grepped for pipeline, duplicate, _plan, deterministic and loop), and issues.md has no entry for it.

### PIPE-12 (simplify, low, minutes, ~17 lines, not verified): Skill-file loader is copied in api/_lib/init.js and scripts/web/server.js, and swallows a missing required file

**Where.** api/_lib/init.js:40-56; scripts/web/server.js:53-69; scripts/bot/context.js:46-72

**Evidence.** getSkills() in init.js and loadSkillFiles() in server.js load the same six files with the same try/catch, which breaks the stated rule that the local server and the Vercel routes share one implementation. The bot has a third, longer variant. Every one of them ignores read errors (`catch {}`). If skills/tutor/templates/domain-template.md or a reference is missing from a Vercel bundle, `skills.get()` returns undefined, `filter(Boolean)` drops it, and the hosted build runs with no domain-template, curriculum-format or source-verification and no error anywhere. prompts.js:106-185 depends on all of them.

**Proposal.** One `loadSkills(root)` in lib/core that both web entry points import, and that throws for the files buildPlanPrompt, buildCurriculumBuilderPrompt and buildDomainFilesPrompt require (keep onboarding optional). About 17 lines saved and a missing file becomes a boot-time failure.

**Risk.** A throw at module load on Vercel means a bad bundle takes every route down instead of degrading, so throw lazily in getSkills() or from the build route only. Tests: vercel route tests build their own skills Map, so a loader test is needed.

### PIPE-7 (improve, medium, minutes, ~15 lines, not verified): Model JSON fields are used as strings without checking; an object becomes '[object Object]' in plan.md and the next prompt

**Where.** lib/core/pipeline.js:111-112, 221, 445-448, 457; lib/core/topic-builds.js:104

**Evidence.** With a stub adapter returning {"plan":{"scope":"x"}} and {"critique":{"issues":["x"]},"status":"REVISE"}, run() wrote plan.md and critique.md as JS objects (typeof 'object'). In SupabaseStore or TutorState that is a TypeError or the string '[object Object]'. The next pass reads critiqueText through untrustedData's String(), so the Critic's feedback becomes the text '[object Object]'. In topic-builds.js:104, `next.draft.plan += ...` turns an object plan into '[object Object]\n\nKeep these starter lessons...'. The same applies to conceptMap, teachingNotes, resources and teacher (pipeline.js:445-448). The prompts ask for 'markdown string', but JSON mode makes a structured answer plausible. Related dead code: every `try { parseFirstJson(...) } catch {}` (pipeline.js:110-115, 135-139, 219-224, 243-247, 453-462) guards a function that never throws (it catches its own JSON.parse), which is about 15 lines of defensive code for an impossible state.

**Proposal.** Add one `const text = (v) => typeof v === 'string' ? v : null` and use it for plan, critique, conceptMap, teachingNotes, resources and teacher (fall back to the raw response text for plan and critique). Delete the no-op try/catch blocks.

**Risk.** Low. Add tests: critic returns critique as an array or object, and the builder returns teachingNotes as an object.

### PIPE-10 (improve, medium, minutes, not verified): A failed revision pass throws away the good curriculum from the earlier pass

**Where.** lib/core/pipeline.js:98-204, 420-440; scripts/bot/curriculum.js:139-200

**Evidence.** In run(), iteration 2's _parsePipelineOutput throws on 'no JSON' or 'no lessons' (a 16k-token answer cut off mid-object is the realistic trigger, #226). That throw leaves run() before `return`, so iteration 1's lastParsed is never returned. I reproduced it: with iteration 1 valid and REVISE, and iteration 2's builder answering truncated JSON, run() threw 'CurriculumBuilder returned no JSON' while the iteration-1 curriculum had already been written to state, with preliminary still true and no final write. The bot's curriculum.js treats the throw as a failed job (store.failJob, curriculum.js:195-199) although a valid curriculum is on disk.

**Proposal.** Wrap the builder step in iterations greater than 1: on a parse failure, `break` with the last good lastParsed (approved false), log it, and let the existing preliminary=false write run. A failure at iteration 1 still throws.

**Risk.** Low. New test in pipeline-parse.test.js: second builder answer unparseable, expect the first curriculum back with approved false. The hosted path is unaffected, because each phase is retried separately.

### PIPE-11 (improve, low, a day, not verified): Build status polling and the topics listing read whole build documents; the local worker re-lists every student every 2 s

**Where.** api/topic-build.js:13-15; lib/core/topic-builds.js:12, 142-145; public/app.js:765 and 1244; lib/core/local-build-worker.js:9-24

**Evidence.** The 3-second poll in public/app.js:765 and the page-load restoreTopicBuild (app.js:1244) call readTopicBuild, which loads the whole kv row (curriculum, intro, researchContext, files and draft.parsed with a second copy of the curriculum, notes and resources), and then buildSummary keeps 8 fields. A shipped course's files total a median of 49 KB (p90 58 KB), and researchContext is stored twice (doc.researchContext and files['research.md']). With no slug, listTopicBuilds does one full read per generated topic (N reads) and decodeTopic's JSON.parse in one corrupt row fails the whole listing. In the local server, tick() calls listStudents plus listGeneratedTopics plus readTopicBuild for every student and topic every 2 s, forever, even when nothing is building. Its comment 'Jobs live in SQLite' is wrong (there is no job table, just kv scans), and `enqueue: async () => {}` is a no-op kept only to satisfy the interface.

**Proposal.** Store a small summary key (status, phase, lessonCount, approved, error, intro) next to the doc and read that for polls and listings. Do not store researchContext twice. Make listTopicBuilds tolerate a corrupt row. Skip the local tick's work with a cheap check, or run it on a 2 s timer only while a build is known to be active, and fix the comment.

**Risk.** Changes the document shape: a migration for existing in-flight docs (read both). Medium effort across the SupabaseStore and TutorStore parity tests. Low user-visible payoff today (about 100 KB per poll), so do it when custom topics grow.

### PIPE-15 (improve, low, minutes, not verified): Wikipedia requests carry no User-Agent and the fallback parses an HTML error page as JSON

**Where.** lib/core/research.js:291-332 and 478-503 (also 529-538)

**Evidence.** None of the four Wikipedia calls sets a User-Agent (only Semantic Scholar, DuckDuckGo and GitHub do), although Wikimedia's API policy asks for one. In my first live researchTopic('Knot theory'), wikipedia came back null and wikiLinks had 0 entries, and a direct probe without a User-Agent got a 429 HTML page from Wikimedia, while the same URL with a User-Agent returned 200 at once (a later no-UA call also worked, so this is flaky, not constant). searchWikipedia treats `!res.ok` as 'try the search fallback', and searchWikipediaFallback then calls `res.json()` on the same kind of HTML body, which throws, so the Overview section is lost and allSettled hides it. searchWikipediaLinks never sends `redirects=1`, so a topic like 'ML' returns the redirect page's few links.

**Proposal.** Put one `User-Agent: OpenTutor/1.0 (...)` header in fetchWithTimeout's default options (it also serves GitHub and Semantic Scholar), add `redirects=1`, and check `res.ok` before `res.json()` in the fallback.

**Risk.** Very low. Add a research-parse test with a fake fetch returning a 429 HTML body.

### PIPE-16 (improve, low, hours, not verified): The starter-lessons instruction is appended to the end of the plan, which the builder prompt then clips at 8,000 characters

**Where.** lib/core/topic-builds.js:103-104 and 64-70; lib/core/prompts.js:145 and 169

**Evidence.** The 'plan' phase appends 'Keep these starter lessons unchanged as the curriculum prefix:' plus the 5 starter lessons' JSON to the end of the plan (topic-builds.js:104). buildCurriculumBuilderPrompt clips the plan to 8,000 chars (prompts.js:145) and the domain-files prompt to 6,000 (:169), and clip() cuts the tail. A plan that is already near the limit (the planner is asked for scope, module rationale, pedagogy, resources, exercises, pacing, so several thousand characters is normal) loses exactly the part that carries the prefix instruction. Then preserveStarterLessons (topic-builds.js:64-70) only dedupes by exact lowercase title, so a builder that re-words a starter lesson yields near-duplicate lessons in the published course. I did not measure real plan sizes, so this one is plausible rather than proven.

**Proposal.** Pass the starter lessons as their own untrustedData block ahead of the clipped plan, rather than appending them to the plan text, and have preserveStarterLessons also drop a builder lesson whose concepts equal a starter lesson's.

**Risk.** Prompt change: needs a build against a real topic to check that the first five lessons stay stable. A unit test can assert that the starter block survives a 20,000-character plan.

## State, stores and access

The core of this subsystem is sound. Student ids are canonicalised once, kv keys are scoped per student, and SupabaseStore throws on read errors where it counts (#157, #170). The compare-and-set fence for topic builds and the trial-slot claims are carefully done. The weakness is surface area that nothing uses and copies that drift. Of roughly 40 methods per store, about 20 have no production caller: sessions, memory, groups and exercises on both stores, jobs on SupabaseStore, and the writeCurriculum methods. TutorState, TutorStore, SupabaseStore and the bot's own scripts/bot/state.js each carry their own copy of getTopicProgress, getNextLesson and the history push, even though lib/core/progress.js already has topicProgress(). Those copies have already drifted: TutorState.markLessonComplete skips history, readUser seeds a template on SQLite but returns '' on Postgres, and the Supabase secret is resolved in two different orders. There is one real bug in a shipped npm script: `npm run bot:test` splits the bot's state across two directories and writes generated curricula into the tracked tree. I found nothing that corrupts production data beyond the items already tracked (DATA-1, DATA-6, DATA-7). I ran the five most relevant test files on an origin/main extract (100 tests, all pass). The dead-code claims were checked by grepping lib/, api/, scripts/, public/, tests/, package.json, vercel.json and docs.

### STATE-1 (bug, medium, hours, confirmed): npm run bot:test splits the bot's state across two directories and writes the generated curriculum into the tracked tree

**Where.** scripts/bot/lesson.js:29,238-241; scripts/bot/curriculum.js:24,61,134; scripts/bot/config.js:41-43; lib/core/state.js:28-31; package.json:42

**Evidence.** With OPENTUTOR_DATA_DIR set, config.js puts PATHS.domains at <dir>/domains and PATHS.workspace at <dir>/workspace. But `coreState = new TutorState(PATHS.root)` (lesson.js:29, curriculum.js:24) always uses <root>/skills/tutor/domains and <root>/workspace. In curriculum.js, Phase A (`writeCurriculum`, line 61) goes through bot/state.js into <dir>/domains. Phase B (`pipeline.run` with `state: coreState`, line 134) calls TutorState.writeCurriculum (pipeline.js:144/201/250/353) and writeDomainFile, which write into the repo's git-tracked skills/tutor/domains/<slug>/. The bot then reads via bot/state.js `readCurriculum` from <dir>/domains, so it still sees only the starter lessons. lesson.js:238-241 reads teacher.md, teaching-notes.md, concept-map.md and USER.md from the real <root> (the developer's own profile) while everything else is isolated. CLAUDE.md:219 documents the domain redirect but not this split.

**Proposal.** Smallest fix: give TutorState an optional { domainsDir, workspaceDir } override and build both bot instances as `new TutorState(PATHS.root, { domainsDir: PATHS.domains, workspaceDir: PATHS.workspace })`. Do not wait for the larger rewrite (STATE-5), because #295 may remove coreState in lesson.js anyway. Keep the default path derivation unchanged so the web server, the Vercel routes and the existing tests are unaffected. Add a test that sets OPENTUTOR_DATA_DIR to a temp dir, constructs the bot's coreState and checks that a pipeline writeCurriculum lands under <dir>/domains. Also update tests/bot/lesson.test.js, which mocks TutorState.

**Risk.** Only test mode is affected. Production, with no DATA_DIR, has identical paths. tests/bot/lesson.test.js mocks TutorState, so it needs a small update.

> Skeptic: Confirmed by code trace; I did not run it. With OPENTUTOR_DATA_DIR set, config.js:41-43 sends PATHS.domains to <dir>/domains and PATHS.workspace to <dir>/workspace. But `new TutorState(PATHS.root)` (lesson.js:29, curriculum.js:24) hard-codes <root>/skills/tutor/domains (state.js:28) and workspaceDir(root, null). It does not read PATHS.

Phase A goes through bot/state.js, which uses PATHS.domains, so the starter curriculum lands in <dir>/domains. Phase B passes `state: coreState` to the pipeline (curriculum.js:134). The pipeline calls state.writeCurriculum (pipeline.js:144, 201, 250, 353). It also calls writeDomainFile for concept-map, teaching-notes, resources, teacher and research. domainFilePath (progress.js:83-87) routes only the runtime files (RUNTIME_DOMAIN_FILES, e.g. learning.md and practice-feedback.md) to the workspace. So the generated files go to <root>/skills/tutor/domains/<slug>/, which is git-tracked content.

bot/state.js readCurriculum then reads <dir>/domains, so the bot never sees the full curriculum, only the starter lessons.

lesson.js:238-241 reads teacher.md, teaching-notes.md, concept-map.md and USER.md through coreState. That means the real <root>/workspace/USER.md profile, while the rest of the bot is isolated. For a brand-new slug, teacher.md and the other generated files are missing from the isolated dir, so they come back null.

package.json:42 `bot:test` sets OPENTUTOR_DATA_DIR=.test-data, so this is the documented way to hit it. .gitignore ignores .test-data/ but not skills/tutor/domains/<new-slug>/, so a test run leaves untracked files in the tracked tree. No open issue or issues.md entry covers it (#295, about shared lessonTurn, is related but not the same). tests/bot does not exercise a real TutorState with DATA_DIR set.

Scope is limited to test mode. Production has no DATA_DIR, so the paths coincide.

### STATE-9 (bug, low, minutes, confirmed): A topic whose slug is an Object property name ('constructor', 'toString') never records completion on the file backends

**Where.** lib/core/progress.js:136-141,120-127,217-227

**Evidence.** `recordCompletion` does `const topic = all[slug] || (all[slug] = {})`. For slug 'constructor', `all['constructor']` is the global Object function, so completion is written onto Object[1] instead of into the file. I ran recordCompletion(file,'constructor',1,'correct') and got file contents `{}` and Object[1] = {date, engagement}. The lesson looks complete until the process restarts, then reappears as pending. readCurriculumWithProgress reads `readCompletions(file)[slug]` the same way. 'constructor' is a valid slug under isTopicSlug, and a custom topic with that name is creatable on the local server. SupabaseStore._curricula (supabase-store.js:382) already uses a Map for this exact reason.

**Proposal.** Fix at the shared point: in readCompletions, return Object.assign(Object.create(null), data) (or build a Map). Then recordCompletion, readCurriculumWithProgress, store.js:144 and migrateCompletionsFromContent all work without per-call hasOwn checks. Alternative: use Object.hasOwn(all, slug) in recordCompletion, migrateCompletionsFromContent and the two readers (progress.js:226, store.js:144). Add a test with slug 'constructor' that checks the file contents and that Object[1] stays undefined. Drop 'toString' from the finding text.

**Risk.** None. Pure bug fix, and it only affects local file or SQLite backends.

> Skeptic: Holds, but narrower than stated. The only reachable slug is 'constructor': slugs must match /^[a-z0-9][a-z0-9-]{0,79}$/, so 'toString' (capital S) and '__proto__' (underscores) can never occur. The reachable path is a user creating a custom topic named "Constructor" on a file or SQLite backend. TutorState, TutorStore and the bot state all call recordCompletion, and readCurriculumWithProgress and store.js:144 read the file back the same way. Severity is low: very rare input, and the process-local effect is odd but harmless (the lesson appears complete until restart, and Object[1] is polluted). Supabase is not affected because it uses a Map and a table.

### STATE-2 (dead-code, medium, hours, ~125 lines, confirmed): SupabaseStore has about 125 lines of methods nothing calls: sessions, memory, jobs, groups, exercises, writeCurriculum, and the non-runtime branch of writeDomainFile

**Where.** lib/core/supabase-store.js:217-229, 280-290, 302-344, 444-508

**Evidence.** Searched lib/, api/, scripts/, public/ for `.appendMessage(`, `.getRecentHistory(`, `.clearSession(`, `.appendMemory(`, `.readRecentMemory(`, `.enqueueJob(`, `.getPendingJobs(`, `.startJob(`, `.completeJob(`, `.failJob(`, `.addGroupMember(`, `.getGroupMembers(` and `.recordStudentExercise(`. The only hits are the bot calling jobs on a TutorStore (scripts/bot/index.js:41-70, curriculum.js:88-173), and the bot's own file-based functions of the same names in scripts/bot/state.js and session.js. The bot never constructs a SupabaseStore (index.js:14,28 uses TutorStore) and no api/ route touches those tables. `writeCurriculum` and the non-runtime `writeDomainFile` have callers only in lib/core/pipeline.js, which is constructed with TutorState (bot) or with the in-memory `staged` object (topic-builds.js:93-94). Generated curricula now live in kv `generated_topic:` rows, not in the curricula table. Only tests call these methods: tests/integration/readonly-filesystem.test.js, supabase-store-persistence.test.js and supabase-store-errors.test.js.

**Proposal.** Delete the 13 methods and writeCurriculum, and make writeDomainFile always upsert to domain_files. Optionally have it throw for any filename outside RUNTIME_DOMAIN_FILES, so a stray call fails loudly instead of writing a build file into the table.

Do not trim deleteAllStudentState (supabase-store.js:79) until the tables are empty or dropped. It must keep deleting from `memory` and `curricula`, because rows from before the move to kv may still exist and decommissioning a student would otherwise leave their data behind.

Keep the legacy `curricula` read until a production `select count(*) from curricula` shows it is empty. The kv migration is only needed if the count is above zero. If it is zero, drop the read paths and the tables in a migration instead.

The persistence tests that seed legacy rows through writeCurriculum (lines 266-396) must seed the table directly in the double, not be deleted, so the legacy read stays covered. Tests for the jobs, sessions and memory methods can be deleted.

Because the TutorStore methods are the same shape, add a one-line comment on the class that jobs, groups and sessions come back only if the bot moves to SupabaseStore (#94).

**Risk.** Tests that pin the dead methods must go or be rewritten. If the bot is ever moved to SupabaseStore (issue #94), jobs, groups and sessions come back, so re-add them then. The legacy curricula read must stay until the table is confirmed empty in prod.

> Skeptic: The claim holds: none of the 13 methods, nor writeCurriculum, nor the non-runtime writeDomainFile branch, is called on a SupabaseStore outside tests. The only place the application constructs a SupabaseStore is api/_lib/init.js:18. The routes that use it call only runtime-file writes (lesson-completion.js:111,124 writes learning.md and practice-feedback.md, which take the domain_files path) and the KV and topic-progress methods. The proposal needs a safer version, though. Part of it would leave student data behind, and the final step (a one-off migration of curricula rows into kv) is more than the dead-code removal needs. Size: ~13 methods, about 125 to 130 lines, plus the matching test cases.

### STATE-3 (dead-code, low, hours, ~110 lines, confirmed): TutorStore, TutorState and the SQLite schema carry sessions, memory, groups and exercise code and tables that no caller uses

**Where.** lib/core/store.js:53-57, 63-65, 214-244, 295-307; lib/core/state.js:138-164; lib/core/db.js:23-65, 78-97

**Evidence.** Same caller search as STATE-2. The only non-test callers of these store methods are bot-level functions with the same names in scripts/bot/state.js and session.js, which use JSONL and markdown files and never touch the store. So the SQLite `memory`, `sessions`, `group_members` and `student_exercises` tables are never written on any path. `curricula`, `lessons_completed`, `students` and `groups` in db.js SCHEMA are never read or written by TutorStore at all: there is no SQL against them anywhere in lib/, api/ or scripts/. tests/tenancy.test.js:68-77 and tests/core-state.test.js are the only users. CLAUDE.md's state table still lists 'Session memory' as per-student SQLite/Postgres state, but no web path writes it. `PRAGMA foreign_keys = ON` (db.js:119) has no foreign keys to enforce.

**Proposal.** Do it together with STATE-2.
1. Delete the dead SQLite and TutorState methods and their prepared statements, but keep the job-queue methods.
2. Drop the unused table definitions from SCHEMA (sessions, memory, group_members, student_exercises, curricula, lessons_completed, students, groups). Do not DROP anything in existing local databases.
3. In the same change, remove the memory DELETE from TutorStore.deleteAllStudentState (store.js:173) and the memory ALTER in migrate() (db.js:161-166).
4. Remove the PRAGMA foreign_keys line. Trim the tenancy and core-state tests, and the "Session memory" row in CLAUDE.md:172.
5. Do not touch SupabaseStore or migration 001 in this PR. If its Postgres methods and tables go, do that in a separate PR with a new migration.

**Risk.** Old local databases keep their dead tables, which is harmless. Do the removal together with STATE-2 so the two stores stay symmetrical.

> Skeptic: Confirmed on origin/main. Nothing outside tests ever calls the TutorStore or TutorState memory, session, group or exercise methods, and nothing runs SQL against curricula, lessons_completed, students or groups. The proposal needs three clean-up items it does not list (below).

### STATE-8 (dead-code, low, minutes, ~31 lines, confirmed): lib/core/index.js is imported by nothing, and its usage comment is not a working import specifier

**Where.** lib/core/index.js:1-31

**Evidence.** Searched lib/, api/, scripts/, public/, tests/, docs/, the platform guides folders, README, AGENTS.md, CLAUDE.md and package.json for `core/index`, `lib/core'`, `lib/core"` and dynamic imports. The only hit is index.js's own comment. package.json has no `main` or `exports`, and the package is not published (OSS-8), so `import ... from 'opentutor/lib/core'` is not a path that can resolve (ESM does not resolve directory imports). It re-exports about 30 symbols, which also hides that several (parseDirectives, applyDirectives, getDependents, getPrerequisites, checkPrerequisites) may have no other consumer.

**Proposal.** Delete lib/core/index.js and the index.js line in the CLAUDE.md structure tree. Since package.json 'files' ships lib/, a future npm publish would expose lib/core/index.js as a deep import. If a public API is wanted then, add an exports map deliberately instead of keeping this file as an accidental one. Drop the claim that parseDirectives and getPrerequisites may be unused, and run the dead-export check only on getDependents, checkPrerequisites and computeConceptMastery.

**Risk.** None found. Nothing imports it. If a self-hoster imports the deep path 'opentutor/lib/core/index.js' it would break, which is unlikely and undocumented.

> Skeptic: Core claim holds: lib/core/index.js (31 lines) has no importer, and the only reference to it anywhere is its own usage comment. The 'opentutor/lib/core' specifier in that comment cannot resolve, because package.json has no main or exports and ESM does not resolve directory imports. The aside that parseDirectives, getPrerequisites and similar exports may have no other consumer is wrong for two of the five. parseDirectives is used in api/lesson.js and scripts/bot/lesson.js, and getPrerequisites in scripts/bot/lesson.js. That aside is hedged ('may') and not part of the proposal. The follow-up dead-export check over concept-graph.js and deliberate-practice.js should be kept as a separate step, since getDependents and checkPrerequisites were not shown to have an outside caller. Deleting the file saves 31 lines. The CLAUDE.md structure line is a bare '└── index.js' under lib/core at line 27, with no comment, so that edit is trivial.

### STATE-4 (simplify, medium, hours, ~45 lines, confirmed): getTopicProgress, getNextLesson and the history push are copy-pasted 3-4 times, although topicProgress() already exists in progress.js

**Where.** lib/core/state.js:117-121,123-125,176-191; lib/core/store.js:158-162,181-193,256-267; lib/core/supabase-store.js:231-235,237-257,362-365; scripts/bot/state.js:92-114,176-188; lib/core/progress.js:156-166

**Evidence.** progress.js:156 `topicProgress(curriculum)` computes total, completed, percent, current, level and prerequisites. SupabaseStore and progress-stats already use it. store.js:256-267 and state.js:176-191 re-implement it line for line, and bot/state.js:176 does too, without level or prerequisites. The 8-line `p.history.push({date,topic,lesson,engagement})` block appears in store.js:184-192, supabase-store.js:248-256 and bot/state.js:102-113. TutorState.markLessonComplete (state.js:123) has already drifted: it records completion but no history, so progressView's streak is empty on that backend. RUNTIME_DOMAIN_FILES is defined twice (progress.js:31 and supabase-store.js:21). `readCurriculumContent` (progress.js:208) is re-inlined inside readCurriculumWithProgress (lines 217-223).

**Proposal.** Do it in two steps. (1) Add and export topicProgress use plus a new recordHistory(progress, topic, day, engagement) in progress.js, and export RUNTIME_DOMAIN_FILES. Replace the three getTopicProgress copies and the three history pushes, and have readCurriculumWithProgress call readCurriculumContent. (2) Leave getNextLesson in each store, because the stores differ in sync versus async: TutorState, TutorStore and the bot are sync, and SupabaseStore is async, so the proposed `(await this.readCurriculum(slug))?.lessons.find(...)` only fits SupabaseStore. Optionally export a tiny pure `nextPending(curriculum)` from progress.js and use it everywhere. Add the history assertion to the core-progress.test.js matrix. Adding history to TutorState.markLessonComplete is a deliberate behaviour change and should be called out in the PR.

**Risk.** Low. Covered by tests/core-state.test.js, core-progress.test.js, tenancy.test.js and the supabase-store tests. Add one parameterised assertion that markLessonComplete appends history on all three stores, which also fixes the TutorState gap.

> Skeptic: Confirmed on origin/main. topicProgress(curriculum) exists at progress.js:156-166 and SupabaseStore.getTopicProgress already calls it (supabase-store.js:362-365). The same computation is hand-copied in state.js:176-183 (no level or prerequisites), store.js:256-267 (with level and prerequisites) and scripts/bot/state.js:176-183 (no level or prerequisites). The history push is copied in store.js:184-192, supabase-store.js:248-256 and scripts/bot/state.js:102-111. getNextLesson is copied at state.js:117-121, store.js:158-162, supabase-store.js:231-235 and bot/state.js:92-96. RUNTIME_DOMAIN_FILES is defined twice (progress.js:31, supabase-store.js:21) and nothing else uses it. readCurriculumWithProgress (progress.js:217-223) re-inlines the body of readCurriculumContent (progress.js:208-214).

The drift is real but latent. TutorState.markLessonComplete (state.js:123-125) calls recordCompletion only and never pushes history. TutorState is used only by tests and by scripts/bot/curriculum.js:20, which is the pipeline path. Production runs on TutorStore or SupabaseStore, which do record history, so the empty streak is not hit today. It is a trap for anyone who uses TutorState, not a live bug.

The other copies behave the same, so extracting is behaviour-preserving. Switching the bot and TutorState to topicProgress only adds level and prerequisites to what they return. I found no caller that compares against the old shape: commands.test.js mocks getTopicProgress, and core-state.test.js:132-148 checks percentages and null.

Estimated saving is about 40-50 lines (about 10 per getTopicProgress copy x3, about 8 per history push x3, about 4 per getNextLesson x4, plus the duplicate set and the inlined JSON read) against a roughly 12-line recordHistory helper.

Not tracked as a duplicate: no open issue and nothing in issues.md covers it. The nearest entry is DATA-1, which is about the history read-modify-write race, not this duplication.

Tests: core-progress.test.js:36 runs a TutorState/TutorStore/SupabaseStore matrix and core-progress.test.js:61-65 asserts getNextLesson and getTopicProgress. topic-levels.test.js:52 covers level and prerequisites on TutorStore. Nothing asserts that history is appended on markLessonComplete (grep for 'history' in core-progress and core-state finds only readProgress fixtures), so the proposed parameterised history assertion is new.

### STATE-5 (simplify, medium, a day, ~90 lines, confirmed): scripts/bot/state.js is a fourth file-based copy of TutorState

**Where.** scripts/bot/state.js:21-188 vs lib/core/state.js:73-191

**Evidence.** readProgress, writeProgress, updateProgress, readUser, writeUser, readCurriculum, writeCurriculum, getNextLesson, markLessonComplete, readDomainFile, writeDomainFile, appendMemory, readRecentMemory, listTopics and getTopicProgress each have a line-for-line twin in TutorState. The bot even instantiates both: `coreState = new TutorState(PATHS.root)` for the pipeline, and its own functions for everything else. That duplication is what created STATE-1. The only bot-specific part is the group, student and review-card code (state.js:50-60, 190-300). The copies differ in small ways that look unintended: the bot's readDomainFile swallows every error where TutorState rethrows non-ENOENT, and the bot's getTopicProgress omits level and prerequisites.

**Proposal.** Do it in two steps, after STATE-1 is fixed.

1. Add `{ domainsDir, workspaceDir }` overrides to the TutorState constructor, defaulting to today's root-derived values.
2. Make TutorState.markLessonComplete append the history entry, as TutorStore already does (store.js:185). Add a test for it, since none exists today.

Then reduce bot/state.js to one module-level `const state = new TutorState(PATHS.root, { domainsDir: PATHS.domains, workspaceDir: PATHS.workspace })`. Re-export the same function names as thin wrappers, so the vi.mock('./state.js') mocks keep working. Keep the group, student and review-card code there. Decide the readDomainFile semantics deliberately: rethrowing non-ENOENT errors is stricter, so check the bot callers. Port tests/bot/state.test.js to hit the shared class, and keep poll-grading.test.js as the integration check.

**Risk.** Many bot tests mock './state.js' (callbacks, commands, context, lesson, onboarding, router and others). Keeping the same export names makes the mocks keep working. tests/bot/state.test.js has to be rewritten against the shared class.

> Skeptic: The duplication is real, but the finding overstates it and the proposal as written would break behaviour. Shared file I/O, which is the 14 functions minus markLessonComplete, is duplicated almost line for line. Two of the listed "twins" are not twins. (1) markLessonComplete: the bot version (state.js:98-112) also appends a {date, topic, lesson, engagement} entry to progress.history. TutorState.markLessonComplete (lib/core/state.js:123-125) only calls recordCompletion. commands.js:109 builds the /progress streak from progress.history, so a naive swap loses streaks. TutorStore does append history (store.js:185), so TutorState is the odd one out. (2) Paths: the bot resolves PATHS.domains and PATHS.workspace from OPENTUTOR_DATA_DIR (config.js:39-42, domains from <dir>/domains, workspace from <dir>/workspace). TutorState derives both from rootDir only (state.js:28-29) and has no override. bot/lesson.js:29 and bot/curriculum.js:24 already do `new TutorState(PATHS.root)`, which ignores the data dir. That is the STATE-1 bug, and a real divergence rather than a cosmetic one. There is also a smaller difference: the bot's readProgress falls back to a default schedule with times and timezone (state.js:14-19), where TutorState falls back to schedule: {} (state.js:78). seedFromTemplate makes this rare, since it only matters on a corrupt file. The bot's debug and info log lines on writes would also be lost. The proposal itself is sound once STATE-1 supplies path overrides, and the test risk it names is accurate. Line savings are about 100 lines of bot/state.js (lines 12-183, minus the review-card block at 45-59), less the history logic that must be kept.

### STATE-6 (simplify, low, hours, ~45 lines, not verified): The 'list topics with progress' loop and the per-student stats function are duplicated between the local server and the Vercel routes

**Where.** scripts/web/server.js:194-212, 250-257; api/admin/students.js:73-93; api/topics.js:16-26; lib/core/welcome.js:46-48

**Evidence.** CLAUDE.md says the local server and the Vercel route must share one implementation. `studentStats` (server.js:194) and `statsFor` (admin/students.js:73) are identical bodies, 20 lines each. The `for (slug of listTopics()) getTopicProgress(...)` loop appears in api/topics.js:18-23 and server.js:251-256. It exists because only SupabaseStore has listTopicProgress(). welcome.js:46-48 carries a third variant of the same fallback.

**Proposal.** Add `listTopicProgress()` to TutorStore and TutorState, or give it a shared free function in progress.js taking a store, and delete the three fallbacks and the `typeof state.listTopicProgress === 'function'` checks. Move statsFor into lib/core/students.js (next to listStudents) and import it in both places. Add `readTopicStates` the same way and drop the branch in progress-stats.js:34-41.

**Risk.** Low. tests/topics-route.test.js, welcome.test.js, admin-students-route.test.js and progress-stats.test.js cover it. The local server's admin stats route has no direct test, so add one.

### STATE-15 (simplify, low, a day, ~60 lines, not verified): Three hand-written PostgREST doubles in the tests, each reimplementing filters, upsert and paging

**Where.** tests/supabase-store-errors.test.js:19-52; tests/generated-topics-supabase.test.js:14-33; tests/integration/supabase-store-persistence.test.js:25-85

**Evidence.** Each file builds its own fake of the same client: HTTP-level doubles in the first two (different filter subsets, with `throw new Error('Unexpected filter')` in the second), a builder-level one in the third whose `delete: () => builder` is a no-op (so deleteAllStudentState is never exercised). DATA-2 tracks the lack of a real Postgres run, but not the three-way duplication. Any new store query (the next `.in()` or `.or()`) has to be taught to all three.

**Proposal.** Extract one `tests/helpers/postgrest.js`, HTTP level so it exercises the real serializer, supporting eq, like, lt, gte, `value->>x`, order, range, upsert with ignoreDuplicates, delete, and a MAX_ROWS cap and request counter. Use it in all three files. This also makes it cheap to add a deleteAllStudentState test.

**Risk.** Test-only. About 60 lines saved, plus the missing delete coverage gained.

### STATE-16 (simplify, low, minutes, ~12 lines, not verified): Three copies of 'string or object, decode JSON' and a few defensive guards for impossible states

**Where.** lib/core/generated-topics.js:11-13; lib/core/accounts.js:11; lib/core/students.js:24-33; lib/core/accounts.js:29; lib/core/students.js:101

**Evidence.** decodeTopic, decodeAccount and students.js `read()` each implement `typeof raw === 'string' ? JSON.parse(raw) : raw` (the last also swallows parse errors, the others throw). `listAccounts` guards `if (!store.listKV) return []`, but all three stores implement listKV (state.js:53, store.js:72, supabase-store.js:95), so the guard is dead. The `theirs.deleteAllStudentState` check in decommissionStudent is only live for TutorState, which has no such method (see STATE-4).

**Proposal.** One `decodeKV(raw)` in lib/core/json.js, used by the three. Give TutorState a deleteAllStudentState (rmSync of its workspace, which decommission already does) and drop the guard. Drop the listKV guard.

**Risk.** The parse-error behaviour must stay what each caller needs: the registry read swallows, the others throw. Keep a `{ fallback }` option.

### STATE-7 (improve, medium, hours, not verified): The Supabase secret is resolved in two different orders, and it also keys every stored student API key and the account-flow HMAC

**Where.** lib/core/supabase-store.js:61-64; api/_lib/init.js:15; lib/core/accounts.js:83-88,125,157; lib/core/llm-access.js:12; api/_lib/demo.js:28

**Evidence.** SupabaseStore and init.js prefer SUPABASE_SERVICE_ROLE_KEY over SUPABASE_SECRET_KEY. accounts.js (lines 86, 125, 157), llm-access.js:12 and demo.js:28 prefer SUPABASE_SECRET_KEY. If both are set to different values (the normal state while moving from the legacy JWT to an sb_secret key, before the legacy key is disabled), the data client and the auth client use different keys. Disabling the legacy key then breaks only the data layer: every store call 401s while sign-in still works. Separately, `cipherKey()` (llm-access.js:11-15) derives the AES key for each student's saved OpenRouter key from that same secret. The comment at line 36 accepts that rotating it makes students reconnect, but the planned key migration would silently invalidate every stored student key at once. The cookie-signing HMAC (accounts.js:157) also dies on rotation.

**Proposal.** Add one `supabaseSecret()` helper in lib/core (next to accountsConfigured), used by all five places with one documented order. Add an optional OPENTUTOR_SECRET that, when set, is used for sealing and signing instead of the Supabase key. Then rotating the Supabase key stops costing every student their saved OpenRouter key. Document it in docs/deployment.md.

**Risk.** Changing the precedence changes which key is used for deployments that set both. Keep SERVICE_ROLE first or SECRET first consistently, whichever matches what production has set today, and add a test that sets both.

### STATE-10 (improve, low, minutes, not verified): A corrupt or unreadable completions.json is read as 'nothing completed' and then overwritten by the next completion

**Where.** lib/core/progress.js:120-127,136-141,173-190

**Evidence.** readCompletions catches every error, a parse error or EACCES included, and returns {}. recordCompletion then writes `{<one slug>: ...}` over the whole file. SupabaseStore deliberately throws here ('Not nothing finished', supabase-store.js:189, #170), and TutorStore.readDomainFile rethrows non-ENOENT (store.js:203). So the file backends have the exact failure class #117, #157 and #170 fixed for Postgres: one bad byte resets every topic's progress, and lesson 1 is delivered again. migrateCompletionsFromContent has the same read.

**Proposal.** Return {} only for ENOENT and let anything else throw, the way readDomainFile already does. Optionally rename a file that fails to parse to completions.json.corrupt before starting fresh.

**Risk.** A previously silent failure becomes a 500 on that student's lesson route until the file is fixed. That is the behaviour #170 chose for Postgres.

### STATE-11 (improve, low, hours, not verified): readUser differs by backend: SQLite and file stores seed the blank USER.md template, Supabase returns an empty string

**Where.** lib/core/store.js:127-133; lib/core/state.js:95-99; lib/core/supabase-store.js:163-165; workspace/templates/USER.md

**Evidence.** On the local server, the bot and tests, a student with no profile gets the roughly 25-line template with every field a placeholder (`**Name:**` and `_(middle school / ...)_`). That text goes into prompts through buildSocraticResponsePrompt, greeting and onboarding. On production (Supabase) the same student gets ''. `userView` has to cope with both through a fragile regex (welcome.js:78-79: `hasProfile = includes('**Name:**') && !/\*\*Name:\*\*\s*$/m`). `readProgress` has the same drift: Supabase and TutorState return {active_topics, schedule:{}, history, onboarding:null}, while the bot default carries a schedule. Local runs, tests and self-hosters therefore exercise different prompts from production.

**Proposal.** Pick one. Preferably return '' on all backends when no profile was written, and keep the template only for the bot and agent skills that edit the file. Then hasProfile reduces to `profile.trim() !== ''`. Change tests/workspace-seeding.test.js and tenancy.test.js:81-90 accordingly.

**Risk.** Prompt builders may rely on the template headings being present. Check prompts.js and the onboarding prompt before changing.

### STATE-12 (improve, low, minutes, not verified): TutorStore.readDomainFile and writeDomainFile skip slug validation for learning.md and practice-feedback.md

**Where.** lib/core/store.js:197-212; lib/core/progress.js:83-87

**Evidence.** The only slug check in the store is `generatedTopicKey(slug)`, which throws for an invalid slug. In readDomainFile it runs only when `filename` is NOT one of the two runtime files (store.js:198). For those two files `domainFilePath` does `path.join(workspace,'tutor','domains',slug,filename)` with the raw slug, and writeDomainFile does mkdir -p plus write on it. A slug like '../../../x' would read or write <workspace>/../x/learning.md. Today every caller validates first (api/lesson.js:93, progressView's isTopicSlug filter, server.js:230), so this is a missing defence at the trust boundary rather than a live hole. TutorState has no check at all (readCurriculum(slug) joins the raw slug).

**Proposal.** Call `generatedTopicKey(slug)` (or a one-line `assertTopicSlug`) at the top of domainFilePath, readCurriculumWithProgress and the store's domain-file methods, so the invariant lives where the path is built, not in each route.

**Risk.** None. Legitimate slugs already satisfy it. Tests that use odd slugs would fail loudly, which is the point.

### STATE-13 (improve, low, hours, not verified): The local build worker rebuilds a TutorStore for every student every 2 seconds

**Where.** lib/core/local-build-worker.js:9-22; lib/core/store.js:25-67,164-167

**Evidence.** Each tick calls listStudents (the registry plus listKV of all accounts), then `state.forStudent(id)` for each. That runs the TutorStore constructor: a mkdirSync of the student's workspace, 12 db.prepare calls, and a listGeneratedTopics query plus a readKV per generated topic, for every student, forever, to find the rare topic that is not ready or failed.

**Proposal.** One query: `SELECT user_id, key, value FROM kv WHERE key LIKE 'generated_topic:%' AND json_extract(value,'$.status') IN ('queued','building')`, then call forStudent only for the rows returned. Or a `listActiveBuilds()` method on TutorStore. Also stop mkdirSync from creating a workspace directory just for being scoped.

**Risk.** Low. The worker has no direct test (tests: 0 hits for startLocalBuildWorker), so add one that seeds a queued doc and asserts a step runs.

### STATE-14 (improve, low, minutes, not verified): CLAUDE.md's state table misdescribes where generated curricula and session memory live

**Where.** CLAUDE.md (Lesson state table, rows 'Generated curricula' and 'Session memory'); lib/core/topic-builds.js:41-43; lib/core/generated-topics.js:5

**Evidence.** The table says generated curricula live in `skills/tutor/domains/<slug>/` (TutorStore) or the `curricula` table (SupabaseStore), and session memory in SQLite `memory` or Postgres `memory`. In fact all generated topics, the web server's included, are one versioned kv row `generated_topic:<slug>` (curriculum, files and build state), written by compareAndSetTopic. The `curricula` table is only a legacy read, and nothing writes to the `memory` table (see STATE-2 and STATE-3). The text steers a reader to the wrong store, which is the sort of mistake behind #117.

**Proposal.** Update both rows. Mention that kv `generated_topic:` and the `students` and `account_student:` keys are the registry. Remove the two rows' stale entries together with STATE-2 and STATE-3.

**Risk.** None.

## API routes and the local server

The Vercel routes are in good shape: thin, auth-gated, and sharing lessonTurn, onboardTurn and chatTurn with the local server. I ran the nine route and server test files in a scratch copy of origin/main and they pass (128 tests). The weak spot is scripts/web/server.js, which still carries its own copy of the admin routes, the student-route glue and the profile builder, and has already drifted from api/. Verified against a running server: one unauthenticated request kills the local server, and sign-in over HTTPS behind a reverse proxy is refused with 403 unless OPENTUTOR_PUBLIC_URL is set. Both need no model or secrets to reproduce. Smaller items: a dead branch in account.js, an unreachable accounts check in auth.js, an unbounded profile write, and five copies of the test-server harness. Nothing here is already in the open issues or issues.md. Related but different: OPS-10 and OSS-3 mention OPENTUTOR_PUBLIC_URL only as a docs gap, and SEC-8 covers the admin password in localStorage.

### RT-1 (bug, high, minutes, confirmed): One malformed request line crashes the whole local server (unhandled rejection)

**Where.** scripts/web/server.js:96

**Evidence.** The request handler is async and runs `new URL(req.url, `http://${HOST}:${PORT}`)` outside any try. I started the server from an origin/main extract and sent `printf 'GET http:// HTTP/1.1\r\nHost: localhost\r\n\r\n' | nc localhost 3917`. The process died with `TypeError: Invalid URL ... server.js:96:15 code: ERR_INVALID_URL input: 'http://'`, and the next curl got nothing. No password and no login is needed. An absolute-form request target with an empty host is enough, and it works with a password set. Nothing in tests/ sends a malformed target (web-body-limit, web-error-text and security-headers test other things). CLAUDE.md's own rule from #80 is that a green suite missed a request that took the whole server down.

**Proposal.** Wrap only the parse at server.js:96: `let url; try { url = new URL(req.url, base) } catch { res.writeHead(400); return res.end() }`. Optionally add `server.on('clientError', (e, sock) => sock.end('HTTP/1.1 400 Bad Request\r\n\r\n'))` too. Add a raw-socket test that sends the bad request line and then checks that /api/catalog still answers.

**Risk.** None. It is a new 400 on a request that currently kills the server.

> Skeptic: Confirmed. scripts/web/server.js:96 on origin/main calls `new URL(req.url, ...)` inside an async handler with no try/catch. No `clientError`, `unhandledRejection` or `uncaughtException` handler exists anywhere in scripts/, lib/ or api/. A request target of `http://` makes Node's http parser accept the line and the URL constructor throw, so the process exits with code 1. Severity is high but it only affects the local server (`npm run web`), which binds to localhost by default (`OPENTUTOR_HOST`). Anyone who can reach the port, including a browser tab or page that can send a crafted request, can take down the server, and it takes down every user of that instance. The Vercel routes are unaffected, because each invocation is isolated. The finding's proposal is sound and low risk. The `new URL` call is the only unguarded parse at that point, since handleAPI and the static branch run after it.

### RT-2 (bug, high, hours, confirmed): `npm run host` behind Caddy/nginx: web sign-in is refused with 403, and the cookie holding the shared password is not Secure

**Where.** lib/core/accounts.js:52-69 (originFor, sameOrigin, setCookie); api/account.js:29; docs/deployment.md:105,136

**Evidence.** docs/deployment.md:105 and host.js:101 tell the operator to put the server behind a web server that adds HTTPS. The server then sees `Host: tutor.example.com` over plain HTTP and no socket.encrypted. originFor() therefore computes `http://tutor.example.com`, while the browser sends `Origin: https://tutor.example.com`. Run against a local server with OPENTUTOR_PASSWORD set: `POST /api/account {"action":"legacy","credential":<password>}` with `Host: tutor.example.com`, `Origin: https://tutor.example.com` and `X-Forwarded-Proto: https` returns 403 `Please submit this form from OpenTutor.` The same request with `Origin: http://tutor.example.com` returns 200 and `Set-Cookie: ot_legacy=<raw shared password>; HttpOnly; Max-Age=604800` with no `Secure`. login.html's legacy mode (public/login.js:3,83) is the only way the web UI authenticates in password mode, so the documented group-hosting path cannot sign in from the browser. The only fix is OPENTUTOR_PUBLIC_URL, and docs/deployment.md:136 says to set it only 'on any server with accounts enabled', so a host-only operator is never told. It is also missing from .env.example (OPS-10 and OSS-3 note that only as a docs gap).

**Proposal.** Do both parts, in this order. (1) Docs and `host.js`: when `host.js` starts without `OPENTUTOR_PUBLIC_URL`, print one line telling the operator to set it to the public https URL. Change `docs/deployment.md:136` from "on any server with accounts enabled" to "behind any proxy and for `npm run host`", and add a commented entry to `.env.example`. Also tell nginx users to use `proxy_set_header Host $host`. (2) Code: do not make `sameOrigin` a host-only comparison unconditionally. Parse `Origin` and compare its `host` to the request `Host`, and accept the scheme only when it is https and either `X-Forwarded-Proto: https` is present or `OPENTUTOR_PUBLIC_URL` is https. In `setCookie`, set `Secure` under the same condition. A bare host-only compare is the usual CSRF guard, but `X-Forwarded-Proto` is client-controllable when no proxy strips it. That only affects the scheme part, which adds nothing against cross-site POSTs. Keep `originFor()` unchanged for building links, since the Host header must not be trusted there. Add tests in `tests/accounts.test.js` and `tests/student-signin.test.js` for an https Origin behind an http Host, with and without the forwarded header, and for `Secure` being set.

**Risk.** Loosening the scheme check must not weaken the CSRF guard. A host-only comparison is the standard form of it. tests/accounts.test.js and student-signin.test.js cover sameOrigin; add a case for an https Origin behind an http Host.

> Skeptic: Holds. I reproduced it on an extract of origin/main. In `lib/core/accounts.js`, `originFor()` returns `http://<Host>` whenever `OPENTUTOR_PUBLIC_URL` is unset and the socket is not encrypted. `VERCEL` is also unset locally. `sameOrigin()` requires an exact string match with the browser's `Origin`. Behind a TLS-terminating proxy the browser sends `https://tutor.example.com`, so `POST /api/account` returns 403 `Please submit this form from OpenTutor.` before any credential is checked (`api/account.js:29`). `setCookie()` only adds `Secure` for `VERCEL`, `socket.encrypted` or an https `OPENTUTOR_PUBLIC_URL`. When the request does pass, `ot_legacy` is the raw shared password with no `Secure` flag. `scripts/web/server.js:223` mounts the same `accountHandler`, so `npm run host` has no separate path. The browser has no other way in. `public/app.js` has no Authorization-header or localStorage credential path, and `login.js` legacy mode posts to `/api/account`. One caveat: nginx's default `proxy_set_header Host $proxy_host` makes the Host `localhost:3000`, and that also mismatches the https Origin. So the cause is not only the scheme. The finding's Caddy case (Host preserved) is exact, but a host-only compare would not fix a default nginx config. Docs: `docs/deployment.md:105` says to put the server behind a web server that adds HTTPS, and `:136` says to set `OPENTUTOR_PUBLIC_URL` "on any server with accounts enabled". `scripts/web/host.js` sets no `OPENTUTOR_PUBLIC_URL` and prints no hint about it, and `.env.example` has no `OPENTUTOR_PUBLIC_URL` entry. No open issue or `issues.md` item I grepped covers this. My grep terms were origin, proxy, secure, https, cookie and PUBLIC_URL, so a tracked item worded differently could still exist. The `OPS-10` and `OSS-3` the finding cites cover only the docs gap.

### RT-3 (bug, medium, minutes, confirmed): On Vercel, an accounts-only deployment answers every signed-out API call with 503 'OPENTUTOR_PASSWORD is not set', never 401 'Please sign in'

**Where.** api/_lib/auth.js:64-70

**Evidence.** checkAuth returns the VERCEL misconfiguration branch (line 65-67) before the `accountsConfigured()` branch (line 69), so line 69 is unreachable on Vercel. I ran `VERCEL=1 SUPABASE_URL=http://x SUPABASE_SECRET_KEY=y node -e "authenticateRequest({method:'GET',headers:{}}, async()=>({}))"` and got `{ok:false, misconfigured:true, reason:"OPENTUTOR_PASSWORD is not set on this deployment..."}`. authFailure maps that to 503. The comment at line 68 says 'With accounts on, the install is public: only a verified session or credential gets in.' That holds locally but not on Vercel, where it matters. A self-hoster who follows the signup path in docs/self-deploy.md without a shared password gets a misleading outage-style error on /api/topics, /api/user and the rest. tests/auth.test.js:46 only covers VERCEL without accounts.

**Proposal.** Move the accountsConfigured() check above the VERCEL check, as proposed. Add a test with VERCEL=1, SUPABASE_URL and SUPABASE_SECRET_KEY set, and no OPENTUTOR_PASSWORD, expecting 401 'Please sign in.'. Keep the existing 503 test for VERCEL without accounts. Also fix the docs/deployment.md:24 wording so it states one rule: the password is required on Vercel unless accounts are configured. Report it as a low-severity ordering fix plus docs consistency, not a self-deploy outage.

**Risk.** None for existing tests. The 503 stays for VERCEL with neither accounts nor a password.

> Skeptic: The mechanism is real and I reproduced it, but the severity and the stated trigger are overstated. api/_lib/auth.js:65-67 returns the VERCEL 503 before the accountsConfigured() branch at line 69, so on Vercel that branch is dead code. A signed-out request with accounts configured and no OPENTUTOR_PASSWORD gets 503 'OPENTUTOR_PASSWORD is not set...' instead of 401 'Please sign in.'. Signed-in account cookies are unaffected, because authenticateRequest returns before checkAuth. The browser consequence is that public/app.js:12-17 only redirects to /login.html on a 401, so a 503 shows an error instead. Two things weaken the finding. First, docs/self-deploy.md:8 tells the self-hoster to set OPENTUTOR_PASSWORD, so the scenario of following that guide without a password does not match the docs. Second, docs/deployment.md:24 says the password is 'required on Vercel', so a 503 for a missing password is arguably intended. That same line also says 'Without it, a server with accounts enabled refuses anonymous requests', which contradicts it. Line 69 and its comment on line 68 were added in commit 3e6ae7b (accounts) behind the older VERCEL block from commit 94c4ff3, which looks like an ordering oversight. The existing test at tests/accounts.test.js:~218 stubs VERCEL='' and never exercises this combination. Swapping the two blocks adds no access, because the accounts branch still returns ok:false. It treats a misconfiguration as a sign-in prompt, which is only a bug if you accept the accounts-only-on-Vercel reading of the docs. I would rate it low to medium.

### RT-14 (bug, low, minutes, confirmed): A CRLF .env makes `npm run host` ignore the passwords already in it and append new ones

**Where.** scripts/web/host.js:17,30,68

**Evidence.** LINE ends in `(.*)$` and the text is split on '\n' only, so a trailing '\r' stops `.` from matching and the line does not match. I ran ensurePasswords on a file with `OPENTUTOR_PASSWORD=aaaa...\r\nOPENTUTOR_ADMIN_PASSWORD=bbbb...\r\n`. It returned freshly generated values, and `cat -vet` shows the old CRLF lines still there with the new LF lines appended below. The operator's chosen passwords are silently replaced (the server then starts with the new ones, and learners given the old one are locked out), and the file now has duplicate keys. host.js already warns about Windows (line 97), where CRLF .env files are common.

**Proposal.** Split on /\r?\n/ at both sites (line 30 and line 68). The fix is safe because passwordsIn already trims the value, so a stripped `\r` cannot leak into a password. One side effect: the rewritten file will have LF endings on the kept lines. If preserving CRLF matters, detect `\r\n` in the text and join with it. Add a CRLF case to tests/host.test.js that asserts the existing passwords are returned and the file is not appended to.

**Risk.** None.

> Skeptic: Confirmed. In JS, `.` does not match `\r`, and LINE is anchored with `$` and no `m` flag. On a CRLF .env the text is split on '\n' only, so each line keeps its trailing `\r` and LINE never matches. passwordsIn then returns {}, both keys count as missing, and ensurePasswords appends two fresh random passwords. The operator's own passwords stay in the file as dead CRLF lines, and the server starts with the new values, so anyone given the old password is locked out. The kept filter at line 68 has the same split, so it keeps the old lines. Neither the open GitHub issues nor issues.md cover this, and tests/host.test.js has no CRLF case. The severity "low" fits: a Windows or CRLF-edited .env is plausible, the warning at line 97 already acknowledges Windows, and the failure is silent.

### RT-4 (dead-code, medium, minutes, ~16 lines, confirmed): The 'forgot' send-reset-email branch is unreachable

**Where.** api/account.js:204-227

**Evidence.** Lines 207-208 return 404 for `action === 'forgot'`, so the second `if (action === 'forgot')` at lines 212-227 can never run. The `resetPasswordForEmail` call and its 429 handling are dead. Searched api/, lib/, scripts/, public/ and tests/ for 'resetPasswordForEmail' and found only this block. 'forgot' also stays in the allowed list at line 204 only to reach the 404, and createAccountClient (accounts.js:109) still branches on it. It is a placeholder for #133, which is open and says nothing is sent yet.

**Proposal.** Do not delete the block. Either leave it, since #133 is its owner, or make the park explicit and cheap to lift. For example, replace the unconditional 404 with a single flag such as `if (action === 'forgot' && !process.env.OPENTUTOR_EMAIL_ENABLED)`, so #133 flips a flag instead of re-adding code from git history. If it is deleted anyway, remove it together with the 'recovery' intent at lib/core/accounts.js:109, and keep the 404 test.

**Risk.** Low. Check the tests/accounts.test.js and web-login tests that assert the 404 text.

> Skeptic: The facts hold. On origin/main, api/account.js:207-208 returns 404 for action === 'forgot'. That return is unconditional, so the second `if (action === 'forgot')` at 212-227 can never run. The resetPasswordForEmail call and its 429-as-success handling are dead, and nothing else in api/, lib/, scripts/, public/, tests/, docs/, package.json or vercel.json calls resetPasswordForEmail. The only other mention is tests/accounts.test.js:229-236, which stubs it and asserts it is not called. 'forgot' stays in the allow-list at line 204 only to reach the 404. lib/core/accounts.js:109 also branches on 'forgot' to set the 'recovery' flow intent, which is likewise unreachable today.

Two caveats weaken the value:
1. #133 (open) says the forgot and reset actions "are already built in #130 ... only needs switching on and verifying". The block is deliberately parked, including its 429 enumeration handling (item 5 of #133). The 404 guard is the switch.
2. The block is only about 16 lines. The surrounding recovery machinery is also unreachable in practice but is kept deliberately: the 'reset' action, recoveryCallback, grantRecovery, and the 'recovery' intent in accounts.js:109. Deleting only 212-227 leaves a half-removed feature.

This is a real dead branch, but a low-value removal. If reported, it should be described as a parked feature, not as forgotten code.

### RT-9 (dead-code, low, minutes, ~15 lines, confirmed): GET /api/topics/:slug exists only in the local server and nothing calls it

**Where.** scripts/web/server.js:260-269

**Evidence.** No Vercel route serves it: api/ has topics.js only, and vercel.json has no rewrite for it. Searched public/*.js and *.html (the frontend calls /api/topics, /api/progress, /api/topic-build and /api/user only), scripts/bot, lib, docs, README and CLAUDE.md for 'api/topics/': the only hit besides the route is tests/web-lesson-server.test.js:210, which asserts a 404 for it. On Vercel it would 404 and the app would break on a hosted install, so no client can rely on it. It also returns learning.md contents, which no UI shows.

**Proposal.** None needed. Delete server.js:260-269 and the test at web-lesson-server.test.js:209-212 together. Optionally keep the test as a plain unknown-route 404 check only if you want coverage of the server's fallback 404.

**Risk.** Low. An external script using the local API would lose it; there is none in the repo.

> Skeptic: Holds. GET /api/topics/:slug (scripts/web/server.js:260-269, about 10 lines) has no caller. The only other reference is a test of the route itself (tests/web-lesson-server.test.js:209-212, which asserts a 404 for an unknown slug). The frontend only calls the list endpoint, and Vercel has no handler for it. Deleting it also removes the only place the local server reads learning.md for a UI (the other readDomainFile calls are in api/lesson.js), and no UI shows that. The route's #228 guard (404 instead of a 200 of nulls) goes with it; that guard is the only thing the test covers, so removing both leaves no coverage gap. About 14 lines go in total.

### RT-5 (simplify, high, hours, ~85 lines, confirmed): The local server carries a second copy of the whole admin route

**Where.** scripts/web/server.js:122-214 vs api/admin/students.js:20-96

**Evidence.** handleAdmin, fail() and studentStats are line-for-line copies of the route's handler and statsFor: the same GET list, GET one, POST (with token), PATCH, DELETE, the same RequestError mapping, and the same `theirs.close?.()`. That close is a no-op, because TutorStore.forStudent shares the db (store.js:165-167, `_ownsDB` false). The copies have already drifted: the local one sets Cache-Control no-store and 404s other admin paths, while the Vercel route sets neither, so POST/PATCH responses carrying a student token have no no-store header there. account, openrouter and demo already follow the right pattern: an exported factory such as `accountHandler({getStore})` mounted by server.js's mountHandler. Searched api/, lib/, scripts/, public/, tests/ and docs; no other consumer of studentStats or handleAdmin.

**Proposal.** Same change with four guards:
1. Add the header as `res.setHeader?.('Cache-Control', 'private, no-store')`, with the optional call, because tests/admin-students-route.test.js uses a fake res that lacks setHeader.
2. Keep the exact-path check in server.js (`if (url.pathname !== '/api/admin/students') 404`) before mounting. Otherwise every /api/admin/* path would run the handler locally; on Vercel the platform 404s unknown files.
3. Export `adminHandler({getStore = getState} = {})` and keep `export default readsJson(adminHandler())`, so tests/json-body.test.js and the vercel.json function layout (no new function file, so the 12-function cap is untouched) are unchanged.
4. Add one test to tests/admin-students-route.test.js that PATCH and POST responses carry Cache-Control no-store, and one local-server case, in web-error-text.test.js or a new case beside it, for GET/PATCH/DELETE with `?id=`. mountHandler gives req.body {} for non-POST, and the route reads the id from `new URL(req.url, 'http://x')`.

**Risk.** Medium-low. tests/admin-students-route.test.js (route) and web-error-text.test.js:68-94 (local server, admin POST/GET and error text) cover both sides. mountHandler turns an unparseable POST body into a 400 'Invalid request body' rather than the current RequestError text, so check web-body-limit and json-body tests.

> Skeptic: RT-5 holds. server.js handleAdmin, fail's admin use and studentStats duplicate the route's handler and statsFor. Both do checkAdmin, GET list, GET one, POST, PATCH, DELETE and the same RequestError mapping. Both call the same lib/core students and student-auth functions. The `theirs.close?.()` is a no-op on every backend: TutorStore.close() only closes a db it owns, and forStudent passes `db: this.db`, so `_ownsDB` is false (store.js:46, 165-167, 311-312). TutorState has no close, and SupabaseStore.close is empty. The drift is real, with one nuance: the local Cache-Control: private, no-store comes from handleAPI (server.js ~215-216), which runs before admin routing, not from handleAdmin. api/admin/students.js sets no Cache-Control, while every other student-facing route, account, openrouter and demo set `private, no-store`. So the POST and PATCH responses carrying a student token get no no-store header on Vercel. The factory pattern is already used by account, openrouter and demo (server.js:223-225). No other consumer of handleAdmin, studentStats or statsFor exists in lib, api, scripts, public, tests or docs. The proposal is mostly behaviour-preserving, but four details must be handled; none refutes it. Roughly 90 lines come out of server.js (handleAdmin, studentStats and the admin comment block), and the unused imports go with them. In server.js, `issueStudentToken`, `listStudents`, `findStudent`, `provisionStudent`, `decommissionStudent`, `checkAdmin` and `adminFailure` are only used inside handleAdmin and studentStats. `RequestError` and `fail` stay in use elsewhere.

### RT-6 (simplify, medium, a day, ~110 lines, confirmed): The local student API re-implements the glue of eight routes, and has drifted from them

**Where.** scripts/web/server.js:247-401 vs api/lesson.js, user.js, topic-build.js, progress.js, topics.js, onboard.js, chat.js, add-topic.js

**Evidence.** The turn logic is shared (lessonTurn, onboardTurn, chatTurn), but the glue around it is copied: the SSE writer (server.js:301-321 vs lesson.js:61-76), the user GET, greeting and POST handlers, the topic-build GET with its regex error mapping, progress, topics, and add-topic's error mapping. Drift I confirmed by reading and running the local server. (1) A failed profile save answers 'The tutor is unavailable right now.' locally (outer catch, 500) but 'Could not save your profile.' on Vercel (user.js:43). (2) A wrong method on a student route answers 404 'Unknown API endpoint' locally and 405 on Vercel, and unauthenticated callers get 401 first locally but 405 first on Vercel. (3) /api/topics/:slug exists only locally (see RT-9). (4) topics.js uses listTopicProgress and the local copy does the per-topic loop. (5) The oversized-body path logs `[admin] 500 after response already sent` for any route (fail() hard-codes '[admin]'). tests/api-student-routing.test.js already mounts all eight default exports with a mocked init, which shows they can be driven without Vercel. The structural tests in onboarding-intro.test.js:77-90 regex over server.js source to prove the two are 'the same', a sign the sharing is by convention.

**Proposal.** Do it in two or three small PRs instead of rewriting all eight routes at once.

1. Move buildUserProfile into lib/core (for example welcome.js) and import it from both api/user.js and server.js. Move the SSE writer into a shared helper such as api/_lib/sse.js, used by lesson.js and the local server. This removes the byte-identical copies with no behaviour change.
2. Convert the simple routes (user, progress, topics, topic-build, chat, onboard) to the factory style used by accountHandler and demoHandler. Keep the default exports as `factory({ getStore: getState, getAdapter, getSkills })` so the mocked-init route tests still work. Mount them in server.js with a path-to-handler map and `getStore: async (id) => id == null ? state : state.forStudent(id)`, and let the 405/404 split fall out of the handlers.
3. Do lesson and add-topic last. They are the ones with SSE and an `enqueue` option (buildWorker.enqueue locally, enqueueTopicBuild on Vercel).

In the same changes:
- Make fail() log '[api]' instead of '[admin]', or take a label.
- Add one parity test that runs each route through a spawned local server and through the default export, comparing status and body for a wrong method, a bad body and a failed save.
- Delete the regex-over-source tests in onboarding-intro.test.js:77-90 once that parity test exists.

**Risk.** Medium. init.js getState picks Supabase when env is set while server.js hard-wires TutorStore, so the factory must take the store from the caller. Existing coverage: web-lesson-server, web-error-text, web-body-limit, progress-stats and the route tests. Add one parity test that calls each route in both modes and compares status and body for 405, a bad body, and a save failure. The onboarding-intro source-regex tests can then go.

> Skeptic: RT-6 holds as a simplify finding, with two corrections to its evidence. The local server (scripts/web/server.js:247-401) really does re-implement the glue of the Vercel routes, and the drift is real.

Confirmed on origin/main by reading the code and running the server from a scratch extract:
- A failed profile save answers 500 'The tutor is unavailable right now. Please try again.' locally (POST /api/user has no inner try, so the outer catch at server.js:~258 answers). Vercel's api/user.js:43 answers 'Could not save your profile.'
- A wrong method on a student route answers 404 'Unknown API endpoint' locally (GET /api/lesson, DELETE /api/user). Vercel's lesson, topics, progress, topic-build, chat, onboard and add-topic routes answer 405.
- An oversized body logs `[api] error: Request body too large.` and then the hard-coded `[admin] 500 after response already sent` from fail(), for a route that is not admin (server.js:~372). The student still gets the right 413.
- buildUserProfile is a byte-identical copy in server.js:~475 and api/user.js:~46. The finding missed this; it is a straightforward duplicate.
- The SSE writer and its catch are duplicated (server.js:301-321 vs lesson.js:61-76), as are the topic-build error mapping, the progress handler and the add-topic error mapping.
- tests/onboarding-intro.test.js:77-90 does regex over the server.js source to prove sharing. tests/api-student-routing.test.js already drives the default exports with a mocked init.

Corrections to the evidence:
- Drift (4) is not real. TutorStore has no listTopicProgress; only supabase-store.js:406 does. The local loop is therefore identical to the fallback loop in api/topics.js, and the local server never uses Supabase (it hard-wires TutorStore).
- 'Unauthenticated callers get 401 first locally but 405 first on Vercel' is true only for lesson, topics, progress, topic-build, chat, onboard and add-topic. api/user.js authenticates before it checks the method, so it matches the local order.
- /api/topics/:slug is used only by tests/web-lesson-server.test.js:210. Nothing in public/ calls it, so the refactor would not need to preserve it (that is RT-9).

The size estimate is about 100 net lines. Roughly 155 local lines go; each route gains a small factory wrapper.

Risk to watch: the local server's store is always TutorStore, so the factory must take getStore from the caller rather than from init.js. Pass `(id) => id == null ? state : state.forStudent(id)`, as the openrouter mount already does. The default export of every route must stay a factory call using init's getState, because many route tests mock `../api/_lib/init.js` and import the default export.

### RT-7 (simplify, low, minutes, ~22 lines, not verified): buildUserProfile is copy-pasted between the route and the local server

**Where.** scripts/web/server.js:479-502 and api/user.js:47-70

**Evidence.** The two 22-line functions are identical character for character. The profile format is parsed elsewhere (welcome.js userView matches `**Name:**`, lib/core/welcome.js nameOf), so the two copies must change together. Searched lib/, scripts/bot/ and tests/ for other builders: none. tests/progress-user-routes.test.js covers the route and web-lesson-server.test.js the local server.

**Proposal.** Move it next to userView in lib/core/welcome.js as `profileMarkdown(data)` and import it in both. Fold in RT-8's bounds at the same time.

**Risk.** Low.

### RT-10 (simplify, low, minutes, ~14 lines, not verified): The skill-file loader exists twice, and both swallow every read error

**Where.** scripts/web/server.js:53-69 and api/_lib/init.js:42-57

**Evidence.** Both read the same six files (domain-template, curriculum-format, teaching-method, lesson-delivery, source-verification, onboarding) from skills/tutor. server.js even comments `as the Vercel route does (#223)`. Each has an empty catch (`catch {}` / `/* optional */`), so a bundle that lacks a file gives prompts with an empty reference and nothing in the log. tests/onboarding-intro.test.js:89-93 greps init.js for `load('onboarding'` to guard exactly this. Searched for other loaders: scripts/bot has its own file reads, not this set.

**Proposal.** Make `getSkills(root = process.cwd())` the only loader (server.js passes ROOT), loop over a list of names, and log one `console.warn` per missing file. The source-grep test then becomes a one-line behavioural check.

**Risk.** Low. The server passes ROOT explicitly, so `npm run web` from another cwd still works.

### RT-11 (simplify, low, hours, ~50 lines, not verified): Eight routes repeat the same no-store, method check and auth gate

**Where.** api/lesson.js:34-41, chat.js:75-82, onboard.js:11-18, add-topic.js:13-19, user.js:11-17, progress.js:6-13, topics.js:5-12, topic-build.js:6-9

**Evidence.** Each handler starts with `res.setHeader?.('Cache-Control','private, no-store')`, a method check, then `authenticateRequest` plus `authFailure` and the same three-line response. The `?.` on setHeader exists only because test fakes (api-student-routing.test.js:15) have no setHeader. Three routes also share an `req.query?.x ?? new URL(req.url,...).searchParams.get('x')` fallback (user.js:23, topic-build.js:11, admin/students.js:20), which Vercel's req.query makes unnecessary outside tests.

**Proposal.** Add `studentRoute(method, fn)` in api/_lib/body.js (or auth.js) that sets the header, checks the method, authenticates and calls `fn(req, res, {auth, state})`. Let `readsJson` compose with it. This also gives RT-6 one place to mount from.

**Risk.** Low-medium. The route tests (trial-routes, add-topic-route, progress-user-routes, api-student-routing, json-body) assert status and order (405 before auth). Keep that order and give the fake `res` a setHeader.

### RT-12 (simplify, low, minutes, ~12 lines, not verified): sameSecret and the bearer-header reader are duplicated in the two auth modules

**Where.** api/_lib/auth.js:6-19 and api/_lib/admin-auth.js:20-31

**Evidence.** sameSecret is identical in both. The header readers differ only in the fallback header name (x-opentutor-password vs x-opentutor-admin-password). Searched api/, lib/, scripts/ and tests/ for other timingSafeEqual uses: lib/core/student-auth.js and accounts.js use their own for different values.

**Proposal.** Export `sameSecret` and `bearerOr(req, headerName)` from one place (auth.js) and import them in admin-auth.js.

**Risk.** Low. admin-auth.test.js and auth.test.js cover both.

### RT-13 (simplify, low, hours, ~50 lines, not verified): Five test files each re-implement 'find a free port and spawn the web server'

**Where.** tests/security-headers.test.js:21-62, web-body-limit.test.js:23-87, web-error-text.test.js:23-45, web-lesson-server.test.js:54-90, progress-stats.test.js:165-180

**Evidence.** Every file defines its own free-port probe (getFreePort/freePort/inline net.createServer), and two define the same waitForServer. All spawn `node scripts/web/server.js` with the same minimal env (PATH, HOME, OPENTUTOR_PORT, OPENTUTOR_HOST=127.0.0.1, OPENTUTOR_DATA_DIR) and the same kill and rmSync teardown. There is no tests/helpers directory. Adding the RT-1 test would be a sixth copy.

**Proposal.** Add tests/helpers/web-server.js exporting `startWebServer({env})` returning `{base, stop, log}`, and use it in the five files and in the new RT-1 test.

**Risk.** Low. Test-only. Keep each file's own env overrides.

### RT-16 (simplify, low, minutes, ~8 lines, not verified): vercel.json carries a no-op rewrite and a redundant per-function maxDuration, and server.js hard-codes the headers a second time

**Where.** vercel.json:13-16,30-33; scripts/web/server.js:87-92

**Evidence.** The `/api/:path*` to `/api/:path*` rewrite maps a path to itself. Real api files are served from the filesystem before rewrites run, and the only paths that need one are /api/openrouter and /api/demo, which have their own entries. The `api/catalog.js` entry repeats maxDuration 60, which `api/**/*.js` already sets, so only its includeFiles is needed. web-deployment.test.js:29-33 asserts the self-rewrite exists as an ordering guard for /api/demo, so it was added on purpose and I could not confirm a Vercel behaviour that depends on it. SECURITY_HEADERS in server.js duplicates vercel.json's header block, kept in sync only by security-headers.test.js.

**Proposal.** Verify with one preview deploy that /api/demo and /api/openrouter still resolve without the self-rewrite, then drop it and its test, and drop the catalog maxDuration. Optionally build SECURITY_HEADERS from vercel.json at start-up.

**Risk.** Medium. It can only be proven on a real Vercel preview. Skip it if that is not worth a deploy.

### RT-8 (improve, medium, hours, not verified): POST /api/user stores any shape and any size, and chat.js sends the whole thing to the model on every turn

**Where.** api/user.js:31-35,47-70; scripts/web/server.js:343-346,479; api/chat.js:59

**Evidence.** buildUserProfile interpolates untyped fields. Run against the local server: `POST /api/user {"name":{"a":1}}` is saved, and GET /api/user returns `- **Name:** [object Object]` with hasProfile true. There is no length cap on any field. A Vercel body can be about 4.5 MB, and a newline in a field can add its own `## Context` heading. Onboarding caps its own profile at 3,000 chars (onboard.js:126), and most prompt builders wrap the profile with untrustedData(..., 2000-4000) (prompts.js:273,329,482,565), but chat.js:59 appends `## Student\n\n${user}` raw. So one authenticated POST makes every /api/chat call (including trial accounts on the operator's key) send a multi-MB system prompt. SEC-5 covers total storage per account, not this per-field gap or the chat prompt.

**Proposal.** In the shared builder, accept only strings (`String(v ?? '')` for scalars, reject objects with 400), collapse newlines in single-line fields, and cap each field (about 200 chars) and context (about 2,000, in line with onboarding's 3,000 total). In chatTurn, wrap the profile with the same untrustedData cap as the other builders.

**Risk.** Low. The profile form sends short text. Add tests: object field gives 400, long context is cut, chat prompt contains at most N chars of profile.

### RT-15 (improve, low, minutes, not verified): GET /api/topic-build returns 500 without logging, and routes on error-message text

**Where.** api/topic-build.js:16-18; scripts/web/server.js:372

**Evidence.** The catch has no console.error, so a database failure while reading a student's builds is a bare 500 'Could not read build status' with nothing in the log, the #117 shape that safely() in lesson.js was written to avoid. Every other route logs. It chooses 400 by `/Invalid topic slug/.test(err.message)` although generatedTopicKey already throws a RequestError (lib/core/generated-topics.js:8), and then discards the message. The local copy does the same. In account.js:282,284 a catch maps any error whose text contains 'disabled' to a 403 'Account access has been disabled', so a provider or network error that mentions 'disabled' would be shown as a disabled account, where accounts.js:25 throws a plain Error for the real case.

**Proposal.** In topic-build.js log non-RequestError failures and use `err instanceof RequestError` (status and message). Throw RequestError('Account access has been disabled.', 403) in ensureAccount and match on that in account.js.

**Risk.** Low. Add a test that a failing store gives a logged 500.

## The lesson engine and tutoring logic

The lesson engine is in good shape. Resume, the stale-answer check, the claimed completion, the BLOCK review cap, link filtering and the grade-hiding stream filter each have tests that pin the behaviour. I found 6 real defects and ran a scratch probe against an origin/main extract for each. The worst is that the Sources footer drops every Wikipedia citation when Wikimedia throttles Node's default User-Agent. The others are: two same-step answers are both accepted; a partial grade counts as 0% accuracy; a planner reply missing `diagnostic` shows "undefined" to the student; unvalidated onboarding history for non-account students; and an unused profile read that can skip practice feedback. The rest is duplication: two dead copies of `buildTeacherPrompt`, a copied JSON scanner, a second implementation of the SSE route and of lesson-resume logic, repeated curriculum reads on every lesson start, and fixtures repeated across 9 test files. None of these overlap the open issues or issues.md. Evidence for the bugs comes from probe tests in a scratch extract; no repo file was touched.

### LESSON-2 (bug, medium, hours, confirmed): A 'partial' lesson grade counts as a miss: five partial lessons read as 0% accuracy and trigger a DROP directive

**Where.** lib/core/lesson-completion.js:38-41,61-63; lib/core/student-model.js:81-84,105-114,182-186; lib/core/deliberate-practice.js:80-88

**Evidence.** gradeFromAssessments returns 'partial' for an average score of 0.4 to 0.7. buildLearningLog marks a lesson with a tick only if its engagement is high, engaged or correct; everything else, 'partial' included, gets a cross. buildStudentModel re-reads those marks with /([✓✗])\s/ as correct/incorrect. A probe with five lessons graded partial (scores 0.6, 0.6, 0.65) produced `Last 5: ✗ ✗ ✗ ✗ ✗`, recentAccuracy 0, difficulty 'drop back — student needs more scaffolding', directives `DROP:difficulty to 1` and `VARY:teach-back`, and an empty solid/shaky concepts list (classifyConcepts ignores 'partial' too). The web planner receives that student-model text. Because learning.md is rewritten at each completion, only the last 5 marks survive: 'Overall: X% across N exercises' (student-model.js:37-38) always has N of 5 or fewer, and overall equals recent.

**Proposal.** Do the smallest fix at the shared point. Keep the markdown round trip, but give partial its own glyph, for example '~', in buildLearningLog and parse it in parseExerciseHistory as a 0.5 score or as excluded from the scored window (computeAccuracy would need a weight rather than a boolean). Leave classifyConcepts alone, since ignoring 'partial' there is arguably deliberate. Apply the same glyph change to the bot's buildLearningLog copy in scripts/bot/lesson.js, or let both share the lib/core one. Rewriting accuracy to read curriculum engagement directly is a bigger change that alters N and the overall figure: it would make overall use all completed lessons instead of the last five. Do that as a separate step with new tests, and add a student-model test for a run of partial lessons.

**Risk.** Changes which directives fire. Re-check the thresholds in tests/student-model.test.js and tests/deliberate-practice-retest.test.js. The bot's own buildLearningLog copy (scripts/bot/lesson.js:570) writes the same marks, so it needs the same change or the fix to wait for #295.

> Skeptic: Confirmed on origin/main. gradeFromAssessments returns 'partial' for an average of 0.4 to 0.7 (lesson-completion.js:41). buildLearningLog ticks only high, engaged or correct, so partial gets a cross (:61-63). parseExerciseHistory (student-model.js:81-84) reads each cross as 'incorrect'. classifyConcepts (:182-186) puts 'partial' in neither solid nor shaky. evaluatePractice (deliberate-practice.js:80-88) issues DROP when recentAccuracy is below 0.3. My reproduction matches the finding. One correction: VARY:teach-back is not a result of accuracy, since it comes from the format-monotony rule and fires only because those lessons have no format variation. DROP is the real consequence. Real callers: api/lesson.js:323, scripts/bot/lesson.js:154 and :211, lib/core/progress-stats.js:51, scripts/bot/commands.js:119. No open issue or issues.md entry covers it. Severity medium: the effect is a spurious drop in difficulty plus a misleading accuracy figure.

### LESSON-3 (bug, medium, minutes, confirmed): A planner reply with valid JSON but no `diagnostic` string opens the lesson with the word 'undefined'

**Where.** api/lesson.js:343-355,370,382

**Evidence.** parseFirstJson (json.js:11-22) returns any parsed object, so the fallback plan applies only when no JSON object parses. Lines 343-355 never check the plan's shape. A probe with a planner reply of `{goal:'G', question:'Why alpha?'}` returned reply '**Goal:** G\n\nundefined', and `{plan:{...}}` returned reply 'undefined'. The lesson was saved with that reply, so a reload resumes the same text. A non-string `goal` would print '[object Object]'. The step 2+ prompts then say 'ask the follow-up from the lesson plan' when the plan has none.

**Proposal.** Validate in one place, right after parseFirstJson: if typeof plan?.diagnostic is not a non-empty string, throw so the existing fallback plan applies. Then, for goal, followUp and application, keep the value only if it is a non-empty string, otherwise take it from the fallback. Build the fallback as a const so both paths use it. A missing diagnostic when a retest exists (retrieval is step 0) still breaks step 1, so requiring diagnostic always is correct. Add a case to tests/web-lesson-planner.test.js using the existing start() helper with `{goal:'G',question:'Q'}`, `{}` and a non-string goal, asserting the reply contains no 'undefined' or '[object'.

**Risk.** Very low. It only changes inputs that are broken today.

> Skeptic: Confirmed. api/lesson.js:343-355 only falls back when parseFirstJson returns null. parseFirstJson (lib/core/json.js:11-22) returns any parsed object, including `{}`, and the plan's shape is never checked. withGoal (line ~417) and plan[lessonSteps[0]] (line 382) then stringify whatever is there. The result is saved via writeKV, so a reload resumes the same text. I found no other mitigation in the code and no existing open issue or issues.md entry covers it. Real-world likelihood is low-to-medium: it needs a model that returns valid JSON with different keys, such as a wrapper object or `{}`. The effect is a broken first message in a lesson the student cannot restart cleanly. The other claims also hold: a non-string goal prints '[object Object]', and the later-step prompts reference a follow-up the plan lacks.

### LESSON-4 (bug, medium, hours, confirmed): Two same-step answers sent together are both graded and both returned; only the last step is protected

**Where.** api/lesson.js:100,122,157-165,210 (compare the claim at 194-196)

**Evidence.** The #228 check (`at !== active.step`) reads the record at line 100, then awaits a model call of several seconds, then writes at line 210. Nothing is claimed between the check and the write. Probe: a slow fake model and two `lessonTurn` calls with identical `{lessonId, step:0, answer}` both returned 200 at step 1, with different replies ('reply-1' and 'reply-2'). The stored record kept only reply-2 and one exchange. A student who saw reply-1 (a double submit, or a retry after a dropped connection) sees different text on reload. A trial account's turn slot is spent twice, because `metered` claims one per request. The audit text in issues.md says 'no double advance'; that holds only for the final step, which has its own claim.

**Proposal.** Do not use a permanent per-step claim with a `finally` release. A Vercel timeout or process kill skips `finally`, and then every retry of that step returns 409 forever. The student is stuck, and a reload cannot clear it. Use a claim that expires, or one that can be taken over. Before the model call, `insertKV` a `lesson_turn:<id>:<step>` key holding `<token>:<timestamp>`, and read it back. If the key already exists and is younger than the model timeout (about 60s), return 409 STALE. If it is older, overwrite it with a new token. Delete the key in `finally` and after the successful write, and also on the line 127-144 paths. Alternatively, accept the race and only add a compare-before-write. Re-read `web_lesson:<slug>` just before line 210. If its step or history length has moved, return 409 with the stored reply and discard this one. That does not save the second model call or the second trial slot, but it keeps the stored record and what the student saw consistent. Add a concurrent same-step test next to tests/web-lesson.test.js:278, plus a test with a stale (abandoned) claim that a retry can still take over.

**Risk.** A claim left behind by a crashed request would block that step. Release it in a `finally`, or make it expire.

> Skeptic: LESSON-4 holds as a real race. It is low to medium severity. The proposed fix is risky as written. Two same-step answers sent together both pass the `at !== active.step` check at api/lesson.js:122. Both have read the same record at line 100, and nothing is claimed before the awaited model call at lines 157-165. Both then push history, increment the step, and write at line 210, so the last writer wins. The claim at 194-196 covers only the final step (`done`), as the finding says. Nothing elsewhere serialises these requests. `readsJson` and `handler` in api/lesson.js add no per-student lock, and `metered` in lib/core/llm-access.js only claims a trial slot per request. The existing test at tests/web-lesson.test.js:278 covers only the last step, which is the gap. The issues.md audit line "no double advance" is true only for the last step. The triggers are real: a double submit, or a retry after a dropped mobile connection while the first request is still running. I did not re-run the probe. The code trace is unambiguous.

### LESSON-5 (bug, medium, minutes, confirmed): Onboarding history is validated for accounts only; for other students a non-array body gives a 500 and arbitrary roles reach the model

**Where.** api/onboard.js:60 (trimHistory defined at lib/core/llm-access.js:250-255)

**Evidence.** `isAccount(state) ? trimHistory(history) : history || []`. A probe with a non-account state and `history: {}` threw 'is not iterable', which the route turns into a generic 500. `history: 'abc'` sent the three characters as messages. `[{role:'system',content:'IGNORE'}, 5, null]` went to adapter.generate unchanged. The same function already guards history with Array.isArray at lines 47, 51 and 78. The unvalidated path is the owner, admin-provisioned students and the shared-password path (SEC-4 notes unlimited spend there).

**Proposal.** Replace line 60 with `const messages = [...trimHistory(history), { role: 'user', content: text }];` and drop `isAccount` from the import in api/onboard.js. Add a route test for non-account history `{}`, `'abc'` and `[{role:'system',content:'x'},5,null]`.

**Risk.** Almost none. Non-account clients currently get unbounded history.

> Skeptic: Confirmed. api/onboard.js:60 is `[...(isAccount(state) ? trimHistory(history) : history || []), {role:'user',content:text}]`. For a non-account state (owner, admin-provisioned, shared-password) the raw client `history` is spread into the messages. `history: {}` is truthy, so `[...{}]` throws TypeError "not iterable". The handler's catch turns that into the generic 500 (api/onboard.js:26-28) instead of a clean path. `history: 'abc'` spreads into the strings 'a','b','c', which become messages with no role. An array like `[{role:'system',...},5,null]` goes to adapter.generate unchanged, so the client can inject system-role turns and send unbounded history. The same function already guards with Array.isArray at lines 47, 51 and 78, so this one branch is the odd one out. trimHistory (lib/core/llm-access.js:250-255) handles every case: non-array gives [], only user/assistant roles with string content survive, the last 12 are kept, and each content is cut to 4000. No mitigation sits upstream: readsJson only parses the body, authenticateRequest doesn't look at history, and scripts/web/server.js:353 calls the same onboardTurn with the payload. The real client (public/app.js:942-1066) only sends user/assistant turns with string content, so valid clients are unaffected apart from the 12-turn cap. Onboarding is a few turns, and the account path already trims this way. Tests: tests/onboard-route.test.js uses small two-turn histories on non-account stores (lines 72-148, 314-352) and would still pass. The trimming test at line 105 covers accounts only. A new test is needed for a non-account state with history `{}`, `'abc'` and a mixed-role array, expecting a 200 and only user/assistant messages reaching adapter.generate. Dropping `isAccount` from the onboard.js import is safe, because llm-access.js itself still uses it at lines 194 and 237. It is an adversarial-input robustness issue, not a hot path, so medium is fair. It matters more with SEC-4 (unlimited spend on the shared-password path).

### LESSON-6 (bug, medium, hours, confirmed): completeLesson reads the student profile only to hand it to a parameter nothing uses, and a failed read skips the practice evaluation

**Where.** lib/core/lesson-completion.js:114-123; lib/core/student-model.js:9-11; lib/core/deliberate-practice.js:23-24; callers api/lesson.js:323, lib/core/progress-stats.js:51, scripts/bot/lesson.js:154,211,514, scripts/bot/commands.js:119

**Evidence.** buildStudentModel names its third parameter `_userProfile` and never reads it. evaluatePractice passes its own `userProfile` through. completeLesson still does `await state.readUser()` inside the try (line 117), and the comment at line 128 says readUser can throw on a database error (#157). A probe with readUser throwing left only learning.md written: no practice-feedback.md, so no BLOCK, no GOAL, no retest outcome. The call order was `write learning.md, read learning.md, readUser`. completeLesson also re-reads the learning.md it wrote one line earlier (line 116), which is another store round trip on Supabase.

**Proposal.** Do the behaviour fix first: in completeLesson, delete the `readUser` line, use a local `const log = buildLearningLog(...)` instead of re-reading learning.md, and pass '' as the profile argument. That removes the failure mode and the extra round trips without touching any signatures. Then drop the parameter in a separate change. Remove it from buildStudentModel and evaluatePractice, and update all sites listed in the evidence, including tests/simulations/run.js and the three test files, in one pass. After the edit, grep for any call whose third argument is a string literal or profile variable. Run `npm test` plus tests/simulations. Add a test that stubs `state.readUser` to throw and asserts practice-feedback.md is still written.

**Risk.** Low. Only evaluatePractice's signature changes; tests/deliberate-practice-retest.test.js, tests/student-model.test.js and tests/bot/lesson.test.js call it and need the argument removed.

> Skeptic: Holds. buildStudentModel's third parameter `_userProfile` is never read (student-model.js:9-11). evaluatePractice only forwards `userProfile` (deliberate-practice.js:23-24). completeLesson (lesson-completion.js:117) still awaits `state.readUser()` inside the try that wraps the whole practice evaluation. If that read throws, the catch at 127-131 logs it and practice-feedback.md is never written, so no BLOCK, GOAL or retest outcome is recorded. The learning.md re-read at line 116 is also redundant, since the log was built and written one statement earlier. The failure can occur: on Supabase, readUser is `readKV('user_profile')`, a separate store round trip that can fail on its own. The proposal's "update the 8 call sites" undercounts. Callers pass the third positional argument at 14 or more sites, and the proposal omits several. If any caller is missed, the old third argument ('' or a profile string) silently becomes `retested`. For '' this is harmless because `''[c]?.at` is undefined. For a profile string it would be wrong.

### LESSON-7 (dead-code, medium, minutes, ~190 lines, confirmed): Two unused copies of buildTeacherPrompt (lib/core and the bot), one with the #146 sync-read bug

**Where.** lib/core/prompts.js:234-293; lib/core/index.js:25; scripts/bot/context.js:227-288; tests/prompts.test.js:186-236 and the mockState near :29; tests/bot/lesson.test.js:19

**Evidence.** git grep for buildTeacherPrompt in lib/, api/, scripts/, public/ and package.json finds only the two definitions and the re-export in lib/core/index.js. Tests: tests/prompts.test.js calls it, and tests/bot/lesson.test.js:19 mocks it. docs/product-review.md and docs/review-engineer.md describe it as the old 4-step content dump. Nothing builds the name dynamically. No test in tests/ imports lib/core/index.js. The lib copy takes `state` and calls readDomainFile and readUser without await, which is the '[object Promise]' bug on SupabaseStore (#146) if anything ever called it. The bot's lesson.js builds its prompts from buildLessonPlanPrompt and buildSocraticResponsePrompt instead.

**Proposal.** Delete both functions, the `lib/core/index.js` re-export, the `describe('buildTeacherPrompt')` block, the mockState and the unused `buildTeacherPrompt` import in `tests/prompts.test.js`, and the mock line in `tests/bot/lesson.test.js`. Leave the imports in context.js alone. Optionally add a one-line note to `docs/product-review.md` and `docs/review-engineer.md` saying the function was removed. Run `npm test` and `npm run lint`.

**Risk.** None found at runtime. The README 'import from opentutor/lib/core' example in lib/core/index.js's header never named buildTeacherPrompt.

> Skeptic: Holds. Both buildTeacherPrompt copies are dead on origin/main, and deleting them breaks nothing I could find. I only read code and grepped. I did not run the test suite.

- **No callers.** `git grep buildTeacherPrompt origin/main` over the whole tree finds only the two definitions, the re-export at `lib/core/index.js:25`, `tests/prompts.test.js` (import, mockState, `describe` at 186-236), the mock line `tests/bot/lesson.test.js:19`, and two docs (`docs/product-review.md:54`, `docs/review-engineer.md:57,107`).
- **The docs are stale.** They say `api/lesson.js` uses it, but `api/lesson.js:17` imports `buildLessonPlanPrompt` and `buildSocraticResponsePrompt`, and so does `scripts/bot/lesson.js:15`.
- **No dynamic use.** Nothing builds the name from a string, and nothing imports `prompts.js` as a namespace (`import * as`). Every importer of `prompts.js` or `bot/context.js` names other symbols.
- **Barrel is unused.** `lib/core/index.js` is imported by nothing in lib, api, scripts, public, tests, `package.json` or `vercel.json`. `package.json` has no `main` or `exports`. The only other mention is the header comment, which names `TutorState` and `CurriculumPipeline`.
- **The #146 bug is real but unreachable.** The lib copy at `prompts.js:235-242` calls `state.readDomainFile` and `state.readUser` without await. On SupabaseStore those return promises, so the prompt would contain `[object Promise]`.
- **Context.js imports stay.** In `scripts/bot/context.js`, `readUser` is also used at line 74 and `readDomainFile` at lines 90-91. `TELEGRAM_TUTOR_PERSONA`, `TEXT_ONLY_LIMITS` and `untrustedData` are used by the other builders. No import cleanup is needed there.
- **Tests that read source files are safe.** `tests/opentutor-name.test.js` requires "You are OpenTutor" in `prompts.js`, which still appears at lines 524 and 594, and in `context.js:15`. `tests/voice.test.js` only checks the VOICE import and the quiz and flashcard builders.
- **Mock line.** The `buildTeacherPrompt` entry in the `lesson.test.js` mock can go. The `buildLessonPrompt` mock beside it looks stale too, but that is a separate cleanup.
- **Size.** Roughly 190 lines can go: about 60 in lib, 62 in the bot, about 50 of tests plus the 17-line mockState, and one mock line.

### LESSON-9 (simplify, medium, minutes, ~6 lines, confirmed): Starting a lesson reads the same curriculum 2 to 3 times (4 to 6 Supabase queries) because getNextLesson is called before readCurriculum

**Where.** api/lesson.js:247,253,271; lib/core/supabase-store.js:197-215,231-235; state.js:117 and store.js:158

**Evidence.** All three stores implement getNextLesson as `readCurriculum(slug)?.lessons.find(l => l.status === 'pending') || null`. On SupabaseStore each readCurriculum is a kv read for a generated topic, a disk read or a curricula query, and a `_completions` query. lessonTurn calls getNextLesson at line 247, calls readCurriculum again at 253 when there is no pending lesson, and calls it again at 271 under `safely()`. If the first read failed, the route already returned 500, so the `safely` wrapper at 271 protects nothing.

**Proposal.** Apply the proposal and also edit tests/integration/lesson-persistence.test.js: drop the ['getNextLesson', {}] it.each row, or replace it with a row where readCurriculum throws, which the existing second row already covers. Add a test asserting readCurriculum is called exactly once on a normal start. Keep the `!curriculum?.lessons?.length` 404 check as is. Do not remove getNextLesson from the stores yet, since tests/core-progress.test.js, tests/core-state.test.js and tests/supabase-store-errors.test.js still use it.

**Risk.** Low. A fake state in tests that stubs only getNextLesson (tests/lesson-mood.test.js) must also provide readCurriculum, which it already does.

> Skeptic: Holds. getNextLesson in all three stores (state.js:117, store.js:158, supabase-store.js:231-235) is just readCurriculum plus find(status === 'pending'). lessonTurn reads the curriculum once at api/lesson.js:247 through getNextLesson and again at :271 under safely(), on every start. A third read at :253 happens only when nothing is pending, which means a missing curriculum or all lessons done. So 2 reads normally and 3 in those cases. The query count is overstated. A shipped curriculum costs about 1 Supabase query per read (the _completions query), so that is 2 to 3 queries. A generated or curricula-table topic costs about 2 per read, which gives the cited 4 to 6.

The :271 safely() wrapper protects nothing. A failed first read already throws to the route's 500 (#170), and with a single read there is no second read left to fail.

Two behaviour changes, both benign. (1) A curriculum with `lessons` undefined currently throws a TypeError inside getNextLesson and returns a 500. With the proposal's `?.` it returns the 404 "No curriculum" instead. (2) A transient failure of the second read, which currently degrades to curriculum=null (course name taken from the slug, an empty student model), would now surface as a 500. That is consistent with #170.

Test impact: tests/integration/lesson-persistence.test.js:173 has an it.each case ['getNextLesson', {}] that makes getNextLesson throw and expects a 500. After the change lessonTurn no longer calls getNextLesson, so that case would get 200 instead of 500 and fail. It has to be deleted, or merged into the readCurriculum case. Every other fake state that stubs getNextLesson (lesson-mood, lesson-options, readable, web-lesson-async-store, lesson-persistence's readOnlyStore, missing and finished) also supplies a consistent readCurriculum with status 'pending', so they keep passing. Savings are about 3 lines and 1 to 2 reads per lesson start.

### LESSON-10 (simplify, medium, hours, ~30 lines, not verified): The SSE transport, answer validation and model-use selection are written twice: api/lesson.js and scripts/web/server.js

**Where.** api/lesson.js:44-81; scripts/web/server.js:283-321; contrast api/chat.js:47-48 and api/onboard.js:38-39

**Evidence.** Both files do the same things: `turnText(answer)` then a 400, `use = answer != null ? 'lesson-continue' : 'lesson-start'`, build `ctx`, then write the same 4 SSE headers and a `send(event, data)` helper, then try lessonTurn, `send(status === 200 ? 'done' : 'error', ...)`, and the same KeyRequired catch. chatTurn and onboardTurn already validate the text inside the turn function, but lessonTurn does not, so each caller has to. CLAUDE.md says the local server and the Vercel route share one lesson implementation and not to fork it.

**Proposal.** Validate `answer` with turnText inside lessonTurn, ahead of getAdapter, as the other two turns do. Export a `streamLessonTurn(res, ctx, body)` from api/lesson.js that owns the headers, the `send` helper and the try/catch, and have server.js call it. server.js would then do `await (wantsStream ? streamLessonTurn(...) : json(...))`. tests/web-lesson-server.test.js spawns the real server and covers the SSE path; add a 400 case for a non-string answer at both entry points.

**Risk.** Low. Keep the 400 for an over-long answer happening before `getAdapter()` is called, since a trial student must not be metered for it (#159).

### LESSON-8 (simplify, low, minutes, ~14 lines, not verified): assessment.js carries a byte-identical copy of json.js's JSON object scanner

**Where.** lib/core/assessment.js:31-44 (jsonEnd) vs lib/core/json.js:25-38 (jsonObjectEnd)

**Evidence.** The two bodies match line for line: depth counter, inString flag and the `\\` skip. jsonEnd is called at assessment.js:75 and :151. jsonObjectEnd is called only at json.js:17 and has no caller in lib/, api/, scripts/ or tests/. grep for 'inString' finds only these two files.

**Proposal.** `import { jsonObjectEnd } from './json.js'` in assessment.js, replace the two calls and delete jsonEnd. Coverage is tests/assessment.test.js and tests/json.test.js, and no new test is needed.

**Risk.** None. It is the same function.

### LESSON-11 (simplify, low, hours, ~18 lines, not verified): The resumable-lesson rules and the step list live in three places, kept in sync by comments

**Where.** api/lesson.js:25,101,112,137-138,419-426; lib/core/welcome.js:17-37 and :22; lib/core/llm-access.js:60-61

**Evidence.** welcome.js inFlightOf re-implements api/lesson.js's `steps || STEPS` default and its lastShown precedence ('Match lessonTurn's compatibility path', 'Match lastShown's precedence'). The STEPS array is written out in lesson.js:25 and welcome.js:22, and llm-access.js:61 hard-codes `TRIAL_LESSONS * 4` with a comment pointing at STEPS. The record parse `typeof raw === 'string' ? JSON.parse(raw) : raw` appears at lesson.js:101 and :137-138 and again in welcome.js parsed() (which is tolerant of bad JSON; lesson.js is not, see JRN-10). The two `isReview ? writeKV({reviews}) : deleteKV` blocks at 140-141 and 207-208 are the same.

**Proposal.** Add lib/core/lesson-record.js exporting STEPS, `parseRecord(raw)` (tolerant, returns null), `lastShown(record)` and `clearLesson(state, key, active)`. Use them from lessonTurn and from inFlightOf, and build TRIAL_TURNS from STEPS.length. Covered by tests/welcome.test.js, the web-lesson*.test.js files and tests/trial-routes.test.js. Add one test that a record welcome.js accepts is one lessonTurn can resume. Using the tolerant parse in lessonTurn also resolves the JRN-10 crash on a malformed record.

**Risk.** Low. The two readers are meant to agree; this makes them agree by construction.

### LESSON-12 (simplify, low, a day, ~170 lines, not verified): Nine lesson test files each rebuild the same temp root, curriculum, plan, fake adapter and kv-store double

**Where.** tests/web-lesson.test.js:11-48; web-lesson-pedagogy.test.js:15-48; web-lesson-planner.test.js:49-67; web-lesson-block.test.js; web-lesson-server.test.js; lesson-mood.test.js:11-37; lesson-options.test.js:10-45; trial-routes.test.js; web-lesson-async-store.test.js

**Evidence.** Each file declares its own `const PLAN`, calls mkdtemp, writes a 1 or 2 lesson curriculum.json and builds a `vi.fn` adapter that branches on '## Current Step:'. tests/helpers does not exist. Four files (lesson-mood.test.js:21, lesson-options.test.js:28, readable.test.js:88, web-lesson-async-store.test.js:32) hand-write the same kv store double with `insertKV: if (!kv.has(k)) kv.set(k, v)`.

**Proposal.** Add tests/helpers/lesson-fixture.js exporting `makeRoot(lessons)`, `fakeAdapter({plan, grade})` and `memoryKv()` or an async-store wrapper. Convert the files one at a time; each keeps its own scenario data. Each file's own tests are the check, so nothing new is needed.

**Risk.** Shared fixtures can hide per-test differences. Keep the plan an argument, not a constant.

### LESSON-14 (simplify, low, minutes, ~8 lines, not verified): api/chat.js imports a helper from the onboarding route and keeps its own copy of norm() and the catalog cache

**Where.** api/chat.js:8,23-24,40; api/onboard.js:98-112

**Evidence.** The `norm` one-liner is identical at chat.js:24 and onboard.js:98. chat.js:23 (`catalog`) and onboard.js:99 (`titles`) each cache publicCatalog() separately. chat.js imports `courseFor` from './onboard.js', so one route file depends on another. courseFor is also used by the bot's onboarding? No: grep shows only api/chat.js and api/onboard.js and their tests (chat-course.test.js, onboard-route.test.js) use it.

**Proposal.** Move `norm`, the title cache and `courseFor` into lib/core/catalog.js next to publicCatalog, import it from both routes, and drop the second cache. Covered by tests/chat-course.test.js and tests/onboard-route.test.js; no new test needed.

**Risk.** None. A pure move.

### LESSON-15 (simplify, low, hours, ~10 lines, not verified): lessonTurn is 307 lines in one function; three separable parts and one repeated expression make it long

**Where.** api/lesson.js:89-396

**Evidence.** The function does the continue path (115-229), the review start (279-316) and the plan and start (321-395) in one body. The review record literal (294-310) and the started record literal (374-391) are built inline. `keepTrustedLinks(await keepVerifiedSources(x, res), res)` appears at lines 170 and 382, and again in chat.js:68 with no resources. The two clear-lesson blocks (140-141 and 207-208) are the same.

**Proposal.** Extract `continueLesson(ctx, args, active)`, `startReview(state, block, ...)` and `planLesson(ctx, lesson, ...)`, with lessonTurn only dispatching. Add `trustedReply(text, resources)` to links.js. No behaviour change: tests/web-lesson*.test.js, lesson-mood, lesson-options and trial-routes cover each path. Do this together with LESSON-11 and LESSON-9, since they touch the same lines.

**Risk.** Merge conflicts with other open lesson work (#284, #289, #291 all edit lessonTurn). Do it right after one of them lands, not alongside.

### LESSON-13 (improve, low, hours, ~8 lines, not verified): The web lesson planner is asked for Telegram-only fields and wording that the web never reads

**Where.** lib/core/prompts.js:354-355,362,366-369,373 (buildLessonPlanPrompt); consumers scripts/bot/lesson.js:284,615-616,666,698

**Evidence.** The plan schema asks for `exerciseFormat` and `mcOptions` (4 option objects with correctIndex when 'mc'), explains the three formats, says 'Keep everything SHORT — this is Telegram' and 'Keep each under 50 characters (Telegram button limit)'. In origin/main only scripts/bot/lesson.js reads exerciseFormat and mcOptions; api/lesson.js and lib/core never do. A planner that picks 'mc' because the student says 'idk' writes a diagnostic meant to carry options, but the web shows only plain text. Every web plan call pays for the extra output tokens. `askAsPlanned` and the suggested-answer logic (answer-options.js) are the web's real multiple-choice path.

**Proposal.** Give buildLessonPlanPrompt a `{ platform }` option, or move the exerciseFormat/mcOptions block into a bot-only suffix, and word the length rule for the surface that is asking. Add a prompts.test.js case that the web prompt has no 'mcOptions'.

**Risk.** Low. The bot must keep passing the option that keeps its block.

## The browser front end

The front end (public/: app.js 1278 lines, login.js, welcome.js, admin.js, six HTML pages, three stylesheets) is in good shape. Escaping is consistent: md() escapes first and only https links survive, topicCard() and the admin card escape every interpolated string. The race handling (latestChoice, lessonStart, progressAsked, keyStatusSeq) is thorough and tested. No class or id selector in style.css, welcome.css or admin.css is dead: I checked every one against the HTML and JS of the pages that load that sheet. No custom property or @keyframes is unused except a trivially unused --radius-sm token. The weaknesses are small. (1) Storage access is guarded in welcome.js and admin.js but not in login.js or app.js, so a script that dies before it wires the login form lets that form submit natively as a GET with the password in the URL. (2) A few handler and error-path bugs. (3) One dead streaming branch left over from before lesson starts stopped streaming. (4) Heavy copy-paste: three near-identical message renderers, twelve hand-written POST-JSON blocks, and four DOM doubles in the tests. Items already tracked in issues.md or the open issues are not repeated: JRN-3 covers the unreachable forgot/reset UI, JRN-4 chat memory, JRN-5 lost text on a dropped connection, JRN-6 the course-end dead end, JRN-8 phone layout, JRN-12 loadTopics and onboarding history, JRN-14 aria-live and the single-line input. I did not run the vitest suite; claims rest on reading origin/main (a57f21d) and cross-reading api/lesson.js and the tests.

### FE-1 (bug, medium, hours, confirmed): Unguarded localStorage can kill login.js, and the login form then GETs the password into the URL

**Where.** public/login.js:5-7,96,111; public/app.js:28,106-122,1272; public/login.html:30

**Evidence.** login.js:5 runs `localStorage.getItem(...)` at top level with no try/catch. welcome.js:113-119 and admin.js:10-12,166-169 already wrap every storage call, and tests/web-welcome-demo.test.js:46 even tests a throwing localStorage. A localStorage getter throws SecurityError with cookies blocked and in some in-app browsers; I could only simulate it in node, not reproduce it in a browser. When that happens login.js dies before line 78, so no submit listener is attached. `<form id="account-form">` (login.html:30) has no method or action, so pressing Log in submits natively as GET /login.html?email=...&password=..., putting the password in the address bar, browser history and Vercel request logs. The same happens if login.js simply fails to load, because it is `defer`. In app.js, line 106 is the same unguarded read (the sessionStorage read at :210 is guarded). Line 106 throws at top level, after only the sign-out and delete handlers are wired (:26-45), so the tabs, lessons and init never start and the student sees a dead page. Line 1272 sits inside initializeLearning, so a throw there lands in the catch at :1276 and shows 'Could not load your workspace', skipping checkOnboarding() and loadKeyStatus(). No test covers storage-off for login.js or app.js.

**Proposal.** Two independent fixes. (1) Add `method="post"` to the login form; this is the high-value one because it also covers script load failure. (2) Wrap storage access in try/catch in login.js and app.js (a small safe get/set/remove helper, or inline try/catch like admin.js). Keep the helper's surface to what each file uses (get/set/remove) so the web-connect.test.js double, which has no setItem, still loads. Add one vm test each for login.js and app.js with a localStorage that throws on every call, asserting login.js still attaches its submit handler and app.js still runs init.

**Risk.** Low. Only the storage reads change. Check that web-login.test.js and web-connect.test.js, whose localStorage doubles lack setItem or removeItem, still load.

> Skeptic: Holds as a low-to-medium, low-probability robustness bug. The code does what the finding says. login.js:5 and :7 read and write localStorage at top level with no try/catch, and the submit listener is only attached at :78. login.html:30 is a bare `<form id="account-form">` with no method or action, and the script is `defer` (login.html:78). If login.js throws or fails to load, pressing Log in does a native GET to /login.html?email=...&password=..., which puts the password in the URL, history and request logs. app.js:106 is an unguarded top-level read that throws before the tabs and init start. app.js:1272 is inside initializeLearning, so a throw there is caught at :1276 and shows 'Could not load your workspace', skipping checkOnboarding() and loadKeyStatus(). Guarded precedents exist (admin.js:10-12, app.js:210 and :241 for sessionStorage). It is not in the open issues or the issues.md draft list. I could not reproduce a throwing localStorage in a real browser. The common trigger (storage throws, e.g. cookies blocked) usually also breaks the cookie session, so login would fail anyway. Even then, credentials in the URL are a real harm, and a failed or blocked login.js load gives the same GET without any storage fault. Severity is medium-low.

### FE-2 (bug, medium, minutes, ~6 lines, confirmed): Enter that confirms an IME composition sends the half-typed message

**Where.** public/app.js:248-253,805-810,950-955

**Evidence.** All three keydown handlers (lesson answer, chat, onboarding) test only `e.key === 'Enter' && !e.shiftKey`, then preventDefault() and send. They never check `e.isComposing`. A student typing Japanese, Chinese or Korean (or using an accent or predictive keyboard on a phone) presses Enter to commit the composition, and the unfinished text is sent as their answer to the tutor. That also spends a trial turn, because every answer takes a slot (llm-access.js). Nothing in tests/ dispatches a composing Enter.

**Proposal.** Use one shared helper, e.g. `const submitsOnEnter = (e) => e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229;`, and call it from all three handlers. The `keyCode !== 229` part covers Safari and iOS, where isComposing is false on the confirming Enter. Add tests that dispatch `{ key: 'Enter', isComposing: true }` and `{ key: 'Enter', keyCode: 229 }` and expect no request.

**Risk.** None for ASCII input. Existing tests dispatch plain Enter events, whose isComposing is undefined, so they still pass.

> Skeptic: Holds. All three keydown handlers (public/app.js:248-253, 805-810, 950-955) only test `e.key === 'Enter' && !e.shiftKey`, preventDefault and send. There is no isComposing, keyCode or compositionstart handling anywhere in public/, api/, lib/ or scripts/. The inputs are plain `<input type="text">` (public/learn.html:86, 138, 163), so nothing else mitigates it. Chrome and Firefox deliver the composition-confirming Enter as keydown with `isComposing: true`, so the half-typed text is sent. The only existing Enter test (tests/web-connect.test.js:1141) dispatches a plain Enter, so the proposal does not break it. Caveat: Safari and iOS fire compositionend before that keydown, so `isComposing` is already false and only `keyCode === 229` identifies it. The proposed condition alone would leave the bug in Safari and on iPhone, which is the mobile case the finding mentions. I did not run it in a browser. This is reasoning from the code plus known browser behaviour.

### FE-3 (bug, low, minutes, confirmed): ?topic=slug stays in the learn URL, so every reload re-selects that topic over the student's latest

**Where.** public/app.js:1266-1271; public/login.js:8-10,97,113,130

**Evidence.** login.js builds `next = '/learn.html?topic=<slug>'` and redirects there for sign-up and for an already-signed-in visitor. The landing-page Start links (welcome.js:18,56) go straight there too. initializeLearning (app.js:1266-1270) reads `topic` and calls selectTopic(topic), which POSTs add-topic, switches to Learn and forces `#active-topic` to that slug. Nothing ever removes the parameter: the only history.replaceState in app.js is the OpenRouter `code` strip at :1226. A student who finishes lessons in topic B and reloads or bookmarks the page is put back on topic A (and add-topic is re-POSTed). That defeats the #203 'land on the latest lesson's topic' rule in readActiveTopics (app.js:287-294).

**Proposal.** Strip only after the selection has finished and only when it was acted on. After the `await selectTopic(topic)` at app.js:1270, call `const p = new URLSearchParams(location.search); p.delete('topic'); history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));`. This is the same shape as finishConnect and keeps any other params. Do not strip before the account refresh at :1260, because that path forwards location.search to login.html. Also strip when the slug is invalid or not in the catalog, so a stale bad link does not persist. selectTopic swallows errors into #topic-error, so a failed selection also loses the link, which is acceptable for a one-shot link.

**Risk.** Low. A reload before the first selectTopic completes would lose the link; strip it after selectTopic resolves.

> Skeptic: Confirmed. In initializeLearning (public/app.js:1266-1270), if ?topic=<slug> is a shipped catalog slug, selectTopic(slug) runs. That POSTs /api/add-topic via requestTopic, which returns 'existing' for a known topic, then runs loadActiveTopics and forces #active-topic to the slug (app.js:667-680). That runs after restoreTopicBuild() has called loadActiveTopics, which applied the #203 latest-lesson rule (app.js:287-294). So the URL parameter overrides the latest-lesson rule on every page load. Nothing strips it. The only replaceState calls in public/ are finishConnect's `code` strip (app.js:1226), login.js:12 (code on the login page) and welcome.js:9 (a different param on the welcome page). Entry points that put the param in the learn URL: login.js builds `next` with ?topic= and sends signup, callback and already-signed-in visitors there with location.assign/replace. The catalog Start link is learnLink() in welcome.js (signed-in visitors). The reported welcome.js line numbers were not checked; the cited behaviour is confirmed in the code. A student who starts in topic A, does lessons in topic B, then reloads or bookmarks the page lands back on A. Impact is low. The student can switch topic with the picker, no data is lost, and add-topic is idempotent for an existing topic. One caveat: the login redirect at app.js:1260 forwards window.location.search so the topic survives sign-in, so any strip must come after that point.

### FE-4 (bug, low, minutes, confirmed): A failed answer from an old lesson writes its 'Error:' bubble into whichever lesson is now on screen

**Where.** public/app.js:473-477,507-510

**Evidence.** sendLessonAnswer defines current() so that a reply or failure for a lesson the student has left changes nothing (#228, #265). Success is guarded (`if (!current()) return;` at :485), but the catch guards only the companion: `if (current()) companion(null); appendLessonMsg('tutor', `Error: ${err.message}`);` runs unconditionally. #btn-next and the picker stay enabled while an answer is in flight (only the answer input and Send are disabled at :468-469). Trigger: send an answer, pick another topic or press Next lesson before the reply arrives, then let the first request fail with a 409 stale, a stream cut, or a 5xx. The new lesson's conversation gets 'Error: This lesson has moved on...' for a lesson the student is no longer in.

**Proposal.** Move the append into the guard, as proposed: `if (current()) { companion(null); appendLessonMsg('tutor', `Error: ${err.message}`); }`. Leave `typing.remove()` outside the guard. Moving `input.focus()` into the guard is optional. Do not move the `input.disabled = false` / `btn-lesson-answer.disabled = false` re-enable into the guard. Doing so would risk leaving the controls disabled if showLessonInput does not reset them for the new lesson. Add a test that supersedes the lesson mid-request and then fails the old request.

**Risk.** None. It follows the guard pattern already used on the success path.

> Skeptic: Holds as a low-severity bug. The catch block in sendLessonAnswer guards only `companion(null)` with `current()`. `appendLessonMsg('tutor', 'Error: ...')` runs unconditionally, and it appends to the shared `#lesson-conversation`. Nothing mitigates it. `#btn-next` is disabled only inside startLesson (:387), not while an answer is in flight (only the input and Send are disabled, :468-469). selectTopic and the picker also never touch an in-flight answer. The trigger is reachable: send an answer, press Next lesson (or pick another topic) before the reply arrives, then let the old request fail. After the new lesson opens, `lessonAt.lessonId` changes (:430/:440), so `current()` is false for the old request. The failure then lands as an 'Error:' bubble in the new lesson's conversation. A 409 stale is a likely failure here, since the old lesson was superseded server-side. One nuance: while the new lesson is still loading, `lessonAt` is unchanged, so `current()` stays true. In that window the error goes into the hidden lesson area and is wiped when the new lesson clears it, so the visible bug needs the failure to arrive after the new lesson opens. I did not run it in a browser or test harness. The verdict comes from tracing the code on origin/main. No existing test covers a superseded failure (the only 'Error: ' matches in tests are in web-topic-recovery and web-welcome-demo).

### FE-11 (bug, low, minutes, confirmed): Admin page and the learning app keep the theme under different localStorage keys

**Where.** public/admin.js:158,167; public/app.js:106-122

**Evidence.** app.js stores the theme as `localStorage.theme` ('light' or 'dark'). admin.js stores it as `opentutor-theme`. Both pages load style.css and share the dark-theme variables, but a student or operator who chose dark in the app opens /admin.html in light and has to toggle again, and the reverse too. app.js also has no fallback for `prefers-color-scheme`, so the default is always light. grep for `opentutor-theme` finds only admin.js.

**Proposal.** Change admin.js to use 'theme' for both reads and writes. Because admin.js's `apply` sets `data-theme` to any stored string, only apply the stored value when it is 'dark' or 'light'. Also note that app.js removes the attribute for light, while admin.js sets data-theme="light". Check style.css to confirm that `[data-theme="light"]` and an absent attribute render the same. If they differ, make admin.js remove the attribute for light.

**Risk.** None.

> Skeptic: Confirmed, low severity. The app and the admin page are served from the same origin and use different localStorage keys, so a theme chosen on one is ignored on the other. Nothing mitigates it: the pages have no inline theme script, no matchMedia fallback, and `opentutor-theme` appears only in admin.js. No test touches the theme keys, so changing them breaks nothing. The only cost is a user who has both pages open having to toggle twice. The fix is a one-word change, but flipping the key to `theme` makes admin.js read the app's stored value, so admin.js should validate it, as noted in saferProposal.

### FE-5 (dead-code, medium, minutes, ~20 lines, confirmed): Token-streaming branch of startLesson, and finishLessonStart, can never run

**Where.** public/app.js:393-403,408-409,428-436 (and the `bubble.querySelector('div') || bubble` fallbacks at :96,:489)

**Evidence.** startLesson passes an onToken callback to streamLesson and keeps a `bubble`, and `finishLessonStart(data, bubble)` is the only caller path that uses it. On origin/main the server never emits a `token` event for a lesson start or a resume. In api/lesson.js, `stream = { onToken: assessmentFilter(sources) }` (:92) is spread only into the answer-turn `adapter.generate` (:156-160). The start path plans with `adapter.generate(..., { model: 'strong' })` (:372-376) and builds the opening reply from the plan (`started.reply`, :402-410), and the resume path returns the saved reply. The local server shares lessonTurn (scripts/web/server.js:313). tests/web-lesson-server.test.js:119-122 and tests/trial-routes.test.js:100-105 assert that a streamed start or resume is exactly one `done` event. No test in tests/ feeds `event: token` into a lesson start (grep 'event: token' across tests/ finds nothing). The only caller of finishLessonStart is that branch. The code is left over from when starts streamed (commit a27ecfb). The `|| bubble` and `?.` fallbacks in appendToBubble and :489 only serve the test DOM double, because appendLessonMsg('tutor', '') always creates the inner div. I searched app.js, tests/, api/, lib/, scripts/ and docs/.

**Proposal.** In startLesson, drop the `bubble` variable, the `else if (bubble)` branch and finishLessonStart, and pass a no-op to `streamLesson({topicSlug: slug}, () => {})`. Optionally give `onToken` a default no-op in streamLesson. Leave `appendToBubble`, the answer-path `bubble.querySelector?.('div') || bubble` and the `|| bubble` fallback at :96 untouched. Run tests/web-connect.test.js, tests/web-topic-recovery.test.js and tests/web-lesson-server.test.js.

**Risk.** Low. If a future server streams start replies, the branch would need restoring. Note that finishLessonStart also skips the links:true re-render that the answer path performs (:487-492), so it would be wrong anyway. Run tests/web-connect.test.js and tests/web-topic-recovery.test.js.

> Skeptic: Core claim holds: the token-streaming branch of startLesson and finishLessonStart are unreachable, because no server path emits a `token` event for a lesson start or a resume. Part of the proposal is wrong, though. The `|| bubble` and `?.` fallbacks at app.js:96 and :489 sit in appendToBubble and the answer path, which are live. Leave them in. Delete only the start-path pieces.

Why the branch is dead:
- The only `send('token', ...)` calls are api/lesson.js:70 and scripts/web/server.js:313. Both pass `onToken` into lessonTurn.
- Inside lessonTurn, `onToken` becomes `stream` (api/lesson.js:91-92). `stream` is spread into exactly one `adapter.generate` call, the answer turn at :160-163. `sources.flush()` at :165 is also answer-path only.
- The start path's only `adapter.generate` is the planner call at :337, which gets `{model:'strong'}` and no stream. Its opening reply is built from the plan at :382 and returned at :388-390. The resume path returns the saved reply (:239).
- `streamLesson` hands `onToken` only `token` events, so with no `token` event on a start the start-path callback never fires and `bubble` stays null. That makes the `else if (bubble)` branch and `finishLessonStart` unreachable.
- Tests agree: tests/web-lesson-server.test.js:119-122 and :178-180, and tests/trial-routes.test.js:100-102 and :176-178, expect one `done` event and nothing else for a streamed start or resume. No test feeds a `token` event into a start.

The only references to `finishLessonStart` are its definition (app.js:428) and the call at :409. `appendToBubble` is also called from the answer path at :483, so it stays.

Why the fallbacks stay: `appendToBubble` and the answer path (:480-492) are live, and `appendLessonMsg('tutor','')` does create the inner div. The tests never feed an `event: token` frame, so those lines are never exercised there. Removing them saves nothing and only risks the live answer path. Treat them as a separate cleanup if wanted.

Lines saved: about 20 to 25 (the onToken callback and `bubble` in startLesson, the `else if (bubble)` branch, and finishLessonStart).

### FE-7 (simplify, medium, hours, ~35 lines, confirmed): Three copies of the message renderer and two copies of the options renderer

**Where.** public/app.js:540-552 (appendLessonMsg), :879-891 (appendChat), :1116-1128 (appendOnboardMsg); :519-533 (showOptions), :1086-1101 (showOnboardOptions)

**Evidence.** appendLessonMsg, appendChat and appendOnboardMsg are the same 13 lines. They differ only in the container selector, the role word ('tutor' or 'assistant') and whether md() gets `{links:true}` (onboarding passes none, though its replies carry none either). Each builds `<span class="tutor-avatar">✦</span><div>md(text)</div>` for the tutor and md(text) for the student, then calls fitBubbles and scrolls. showOptions and showOnboardOptions both build a list of secondary buttons from an options array, wire a click that copies the text into an input and calls a send function, and toggle `hidden`. I searched app.js for other callers; there are none outside these functions.

**Proposal.** Merge, but make links an explicit argument and keep the role word explicit:
- Write `appendMsg(box, prefix, text, classes, { role, links })` (or one wrapper per surface). `role` is 'tutor' or 'assistant', matching what the three functions test today. `links` is true for the lesson and chat wrappers and false for onboarding.
- Keep the student/user branch as `md(text)` with no links.
- Write `showChoices(box, options, input, send)` and pass the onboarding scrollTop adjustment from showOnboardOptions as a separate line in that caller.
- Keep `.includes('typing')` for the typing bubble.
- Existing tests cover the markup: tests/web-connect.test.js and tests/web-topic-recovery.test.js read children innerHTML.
- Add one test that onboarding replies with a [x](https://...) link stay as plain text (no anchor) after the refactor.

**Risk.** Low. The class strings in CSS stay unchanged. tests/web-connect.test.js and web-topic-recovery.test.js read `children[].innerHTML`, so the output markup must stay identical. Passing links:true in onboarding is a no-op for text without links.

> Skeptic: The duplication is real and the callers are all inside app.js. The proposal as written is unsafe, though. It says to pass links:true always, and its premise that "the server only sends trusted ones" is false for onboarding. The merge needs a safer shape; the proposal says links stay on for lesson and chat.

Facts I checked:
- appendLessonMsg (540-552), appendChat (879-891) and appendOnboardMsg (1116-1128) are the same 13 lines. They differ only in container, the role word and the links option. Callers are all within app.js.
- showOptions (519-533) and showOnboardOptions (1086-1101) are the same except for the input id, the send function, the box and an extra scrollTop line in the onboarding one.
- md() makes links opt-in (public/app.js:128-136). A link becomes an anchor only with {links:true}. Otherwise it collapses to its label.
- Only api/chat.js and api/lesson.js run keepTrustedLinks. api/onboard.js and scripts/web/server.js do not touch it.
- tests/web-connect.test.js:1387 pins "off by default: user text, streaming, onboarding". The comment at app.js:128 says only finished lesson and chat replies carry links, "after the server kept only trusted ones" (#271, #293).

So onboarding passing no links option is deliberate, not an oversight. Always passing links:true would turn unfiltered model URLs in onboarding into clickable anchors. That undoes #271/#293 for one surface. If it were also applied to the student/user branch, text the user typed would become anchors too.

The merge is still worth doing. It would save about 20-25 lines, since the 3x13 renderers become about 15 and the 2x15 option renderers become about 17.

### FE-10 (simplify, low, hours, ~55 lines, not verified): The learn.html DOM double is copy-pasted into two test files, with a duplicated key in one

**Where.** tests/web-connect.test.js:7-55 (dispatch defined twice, lines 20-21); tests/web-topic-recovery.test.js:7-70; also tests/web-login.test.js:11-26, tests/web-welcome-demo.test.js:12-48

**Evidence.** web-connect.test.js and web-topic-recovery.test.js each define the same element() factory, the same `nodes` map built by regex from learn.html ids, the same `nav` buttons, the same `$` lookup, and the same vm.createContext wiring. Only the fetch routing differs. In web-connect.test.js the line `dispatch(name, event = { preventDefault() {} }) { return listeners.get(name)?.(event); }` appears twice in a row (lines 20 and 21); the second silently overrides the first. login and welcome-demo each have their own smaller double. This is the hand-written DOM double issues.md JRN-15 and TST-1 point at, repeated four times. I searched tests/ for vm.createContext (4 hits) and for imports of a shared helper (none).

**Proposal.** Move element(), the id and nav extraction and the context builder into tests/helpers/dom.js, taking the page file, fetch route and search string, and import it from both learn.html suites. Delete the duplicate dispatch line. Leave the login and welcome doubles alone unless they can reuse the same factory.

**Risk.** Low. Pure test refactor; run tests/web-*.test.js. It makes any later real-browser harness (#296, TST-1) a single swap point.

### FE-13 (simplify, low, hours, ~25 lines, not verified): The palette and @font-face are defined twice, under two token naming schemes

**Where.** public/style.css:1-47; public/welcome.css:1-23

**Evidence.** style.css's header comment says it is 'in the public pages' design (welcome.css)'. Both files declare the same @font-face for EB Garamond, and the same colours under different names: --bg/--paper #f5f1e8, --surface/--card #fbf9f4, --text/--ink #2a2a2a, --text-dim/--muted #5f5a52, --accent/--green #00693e, --accent-dim/--green-dark #004f2e, --border/--line #e2dccf, --field #8a8174, --serif, --sans. Changing the brand colour (the brand work in MEMORY.md changed the logo and the green once already) means editing both, and any drift shows as a mismatched learn page next to the landing page. admin.html loads style.css, while index, login, 404 and privacy load welcome.css. Only style.css has a dark theme.

**Proposal.** Move the @font-face and the shared tokens into one tokens.css that both sheets @import or both pages link, using one set of names. welcome.css's `--green` and `--paper` usages would be renamed or aliased (`--green: var(--accent)`).

**Risk.** Low to medium. It touches about 150 var(--name) uses in welcome.css, and there is no visual regression test, so the change needs a screenshot check of each page in both themes. A less invasive step is a single shared @font-face file.

### FE-6 (improve, medium, hours, ~25 lines, not verified): Five call sites parse the body as JSON before checking the status, so a platform timeout page shows the student a SyntaxError; twelve POST-JSON blocks are hand-rolled

**Where.** public/app.js:662,831,1060,768; public/login.js:74; plus the POST blocks at app.js:8,27,33,659,826,1055,1141,1159,1177,1228,1258

**Evidence.** requestTopic (:662), sendChat (:831), sendOnboard (:1060), the build poll (:768) and login.js action() (:74) call `await res.json()` first and look at res.ok afterwards. When Vercel kills a function at maxDuration (vercel.json sets 60s for api/**, while the adapter timeouts are longer, see OPS-9 and JRN-9 in issues.md), the response is a plain-text or HTML error page. res.json() then throws SyntaxError, and the catch blocks print `Error: Unexpected token 'A', "An error o"... is not valid JSON` into the chat, onboarding or login status line. issues.md JRN-12 mentions raw 'Failed to fetch' messages but not this parse failure. streamLesson (:58) and the openrouter calls (:1142,1160,1229) already use `.json().catch(() => ({}))`, so the code is inconsistent. Separately, `fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(...)})` appears 12 times in app.js alone, with two more in login.js and welcome.js.

**Proposal.** Add one helper next to the fetch wrapper: `const post = (url, body) => fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) })`. Add `async function readJson(res)` that returns `res.json().catch(() => ({}))` and a friendly fallback of `Request failed (status)`. Route requestTopic, sendChat, sendOnboard, the poll, the openrouter calls and login.js through them. The error text becomes the same everywhere, which also gives JRN-12's 'one friendly error helper' a home.

**Risk.** Low. Tests assert exact error strings in a few places (web-connect, web-topic-recovery), so run those.

### FE-8 (improve, low, hours, not verified): Page load makes six round trips in series; the last three do not depend on each other

**Where.** public/app.js:1251-1275

**Evidence.** initializeLearning awaits, in order: /api/account, then maybe a refresh POST, then finishConnect (an openrouter POST only when ?code is present), then restoreTopicBuild (/api/progress, then /api/topic-build), then maybe /api/catalog for ?topic=, then checkOnboarding (/api/user, not awaited but started late), then loadKeyStatus (/api/openrouter). checkOnboarding and loadKeyStatus read nothing that restoreTopicBuild produces. The welcome screen, which is the first thing a returning student sees, waits behind progress and topic-build. On Vercel each is a separate function that can cold-start.

**Proposal.** Start `checkOnboarding()` and `loadKeyStatus()` right after the session check, and await only `finishConnect()` before restoreTopicBuild, so the welcome and the key status load in parallel with progress. (showWelcome already tolerates running before the picker fills, since it only reads lessonActive and the empty-state element.) Keep `localStorage.removeItem('opentutor-pending-topic')` after the ?topic= handling.

**Risk.** Low to medium. showWelcome and selectTopic both touch #empty-title and the picker, so the existing welcome and onboarding tests need a pass. The order of 'student with topics skips onboarding' (#155) is decided server-side in /api/user, so it is unaffected.

### FE-9 (improve, low, hours, not verified): One failed build poll ends progress tracking for good; same-slug re-watch can run two poll chains

**Where.** public/app.js:756-799,714-717

**Evidence.** poll() catches any thrown error, including a plain network blip from fetch(), sets the status text and shows 'Retry curriculum build', then returns without rescheduling (:790-795). The build keeps running on the server, but the student never sees it finish, and Retry (:718-731) re-POSTs add-topic instead of resuming the poll. Separately, watchTopicBuild(slug) does clearTimeout(buildTimer) but cannot cancel a poll() whose fetch is already in flight. selectTopic's watchTopicBuild followed within one request by the picker's 'change' handler (:714-717) for the same slug lets both chains pass `watchedBuild === slug` and each reschedule setTimeout, overwriting buildTimer, so the slug is polled twice every 3s until the build ends. No test drops a poll.

**Proposal.** Treat a thrown poll (network or 5xx) as 'try again in 3s' for a few attempts before showing Retry. Make watchTopicBuild bump a `watchId` counter that poll() captures, and bail when it differs from the current one, instead of comparing slugs.

**Risk.** Low. Test with tests/web-topic-recovery.test.js, whose fake setTimeout collects timers.

### FE-14 (improve, low, hours, ~6 lines, not verified): Admin student list makes one HTTP call per student

**Where.** public/admin.js:87-93; api/admin/students.js:36,74-96

**Evidence.** refresh() fetches the list, then `Promise.all(students.map(s => api('/api/admin/students?id=...')))`, one serverless invocation, each opening a store scoped to the student, per student. The code comment admits it ('Fine for the tens of students this is built for'). It also hides failures: `r.ok ? r.json() : s` renders a student whose detail call failed as 'No topics yet.' and 0 lessons, so a 5xx or rate-limit looks like an idle student. api/admin/students.js already has statsFor() and could return it for every student in the list response.

**Proposal.** Add `?detail=1` (or just always include `statsFor` in the list) server-side, drop the client fan-out, and show 'could not load' on a failed row. Keep the single-student GET for the token flows.

**Risk.** Low. The list stays behind checkAdmin. Check tests/ for the admin route (provisioning) before changing the list shape.

## The Telegram bot

Telegram bot (scripts/bot/*, origin/main a57f21d). All 19 bot test files (140 tests) pass in a scratch extract and eslint is clean, but several real defects sit outside #294 and #295, and some were confirmed with throwaway repro tests in the scratch dir (nothing in the repo was touched). The worst is a split-brain state root: lesson.js and curriculum.js build `new TutorState(PATHS.root)`, which ignores OPENTUTOR_DATA_DIR. Under `npm run bot:test` the background curriculum build therefore writes into the tracked skills/tutor/domains, and the lesson planner reads the wrong USER.md and teacher files. Next: `/add` on a shipped topic sends no reply and silently rewrites a tracked research.md; every bot start schedules an unrequested LLM rebuild of the shipped stub behavioral-economics; a failed LLM call mid-turn double-grades spaced review; and the plain-text fallback for bad HTML deletes real text such as "a < b and b > c". The bot also still drops the onboarding answers that the web has kept since #155, and has its own onboarding prompt with no course catalog. About 270 lines are dead beyond what #294 lists, including lib/core/concept-graph.js, which the bot only uses to compute a log line. The structural blocker for #295 is that scripts/bot/state.js is a second copy of the 15 TutorState methods, and the lesson state is held through a third SQLite connection with raw SQL. Items already in issues.md (BOT-1 to BOT-4, DOC-1, DATA-7, SEC-6, the group-learning dead code, flashcard poll aborts) and #294/#295 were skipped.

### TG-1 (bug, high, hours, confirmed): OPENTUTOR_DATA_DIR is ignored by the bot's TutorState, so test mode writes into the tracked domains folder

**Where.** scripts/bot/lesson.js:29,238-241; scripts/bot/curriculum.js:24,132-139; scripts/bot/config.js:40-42; package.json bot:test

**Evidence.** config.js points PATHS.domains and PATHS.workspace at OPENTUTOR_DATA_DIR/{domains,workspace} and the bot's own state.js uses them. lesson.js:29 and curriculum.js:24 build `new TutorState(PATHS.root)`, whose paths are hard-wired to root/skills/tutor/domains and root/workspace (lib/core/state.js:24-30). Confirmed in scratch with OPENTUTOR_DATA_DIR=<tmp>: bot domains=<tmp>/domains but core domains=<root>/skills/tutor/domains; bot USER.md=<tmp>/workspace/USER.md but core USER.md=<root>/workspace/USER.md. Consequences under `npm run bot:test` (OPENTUTOR_DATA_DIR=.test-data): (a) Phase B (CurriculumPipeline with state: coreState) writes curriculum.json, plan.md, teacher.md etc. into the real skills/tutor/domains/<slug>, which the repo rules forbid, while Phase A wrote the preliminary curriculum to .test-data/domains, so the bot never sees the upgraded curriculum; (b) the lesson planner reads teacher.md, teaching-notes.md, concept-map.md and USER.md from the repo, not from the data dir; (c) the constructor mkdirs root/workspace dirs as a side effect. No test covers it.

**Proposal.** Add an optional { domains, workspace } override to the TutorState constructor, applied after workspaceDir() and before the mkdirs. Build the bot's core state once from PATHS.domains and PATHS.workspace, for example in scripts/bot/state.js, and import it in lesson.js and curriculum.js in place of both `new TutorState(PATHS.root)` calls. Add a test that sets OPENTUTOR_DATA_DIR, constructs the bot state, and asserts its paths equal PATHS.domains and PATHS.workspace. Keep the default behaviour unchanged when no override is given, so the web server and the Vercel routes are unaffected. No migration is needed beyond a note: only test-mode users with a data dir have curricula split across the two trees.

**Risk.** Anyone running the bot with OPENTUTOR_DATA_DIR set today has curricula split across two trees; a one-time copy may be needed. Add a test that PATHS.domains/workspace equal the TutorState paths under OPENTUTOR_DATA_DIR.

> Skeptic: Holds as stated. Under OPENTUTOR_DATA_DIR (bot:test sets it to .test-data), the bot's own state.js (via PATHS) writes domains and workspace under the data dir. Both lesson.js and curriculum.js build a core TutorState from the repo root, and TutorState hard-codes root/skills/tutor/domains and root/workspace. That splits the state across two trees. The pipeline in Phase B then writes curriculum.json, plan.md, teacher.md and the other domain files into the tracked skills/tutor/domains. Nothing mitigates it: the pipeline only writes through the state it is handed. Phase A and the bot's readExistingCurriculum read PATHS.domains, so the bot never sees the Phase B output. Also, a per-user runtime file written by the pipeline (plan.md is not one; learning.md and practice-feedback.md are) would go to the repo workspace, and the constructor mkdirs repo workspace dirs. Two small caveats. The practical impact is limited to test mode and to anyone who sets OPENTUTOR_DATA_DIR for the bot; the normal install has no override and is unaffected. And tests/bot/poll-grading.test.js sets OPENTUTOR_DATA_DIR but likely does not exercise Phase B or the lesson planner.

### TG-2 (bug, high, hours, ~49 lines, confirmed): /add on an existing or shipped topic sends nothing and rewrites the shipped research.md

**Where.** scripts/bot/curriculum.js:43-53,184-227; scripts/bot/commands.js:187-194

**Evidence.** generateAndRegisterTopic returns { slug, intro: null } when the curriculum exists (curriculum.js:52). cmdAdd only sends messages inside `if (intro)` (commands.js:191), so `/add game theory` (slug game-theory is one of the 293 shipped courses) replies with nothing at all, and the topic is appended to the end of active_topics, so it is not the default for /next. Repro in scratch (real curriculum.js and commands.js, mocked LLM/research): sendMessage calls = 0. The same path calls refreshResearchIfStale, which skips only when research.md has a `Generated: YYYY-MM-DD` line; 292 of 293 shipped research.md files lack it (grep -L), so every /add of a shipped topic runs the full 8-source researchTopic and, if the text differs by 10% or more, overwrites the tracked skills/tutor/domains/<slug>/research.md (repro: the file became '# Research: game theory / Generated: ... / Refreshed from: unknown', with the student's lowercase input as the title). The refreshed file only produces a log line saying the curriculum 'may need review'; nothing acts on it.

**Proposal.** Fix the two parts separately. (a) In cmdAdd, when intro is null, reply with the existing course and the student's progress, and move the slug to the front with the /switch splice. Better to put that logic in registerTopic with an optional front flag, so onboarding.js can use it too. (b) In refreshResearchIfStale, return early when the slug is a shipped domain, or only refresh topics the student built. Do not delete the function outright: it is the only refresh path for student-built topics, and deleting it is a behaviour change that needs its own decision. The bug is the write into tracked skills/tutor/domains, not the refresh as such.

**Risk.** Low. Tests: add one for /add of an existing slug (expects a reply, topic becomes default) and one that a shipped research.md is untouched. tests/bot/commands.test.js has the harness.

> Skeptic: Holds. I re-read origin/main and traced it without running a repro. (1) generateAndRegisterTopic (scripts/bot/curriculum.js:43-53) returns { slug, intro: null } for any slug that already has a curriculum. That covers all 293 shipped domains, because PATHS.domains is skills/tutor/domains unless OPENTUTOR_DATA_DIR is set (config.js:42). cmdAdd (commands.js:187-194) only calls channel.sendMessage inside `if (intro)`, so /add on an existing topic replies with nothing. registerTopic (curriculum.js:241-248) does push(), so the topic goes to the end of active_topics, while /switch uses splice+unshift (commands.js:213-216). (2) refreshResearchIfStale (curriculum.js:184-227) skips only when research.md has a `Generated: YYYY-MM-DD` line less than 30 days old. `git grep -L 'Generated:'` over the 293 shipped research.md files gives 292, so all but behavioral-economics fall through to researchTopic. If the new text differs by 10% or more, writeDomainFile writes research.md. 'research.md' is not in RUNTIME_DOMAIN_FILES (lib/core/progress.js:31, only learning.md and practice-feedback.md), so domainFilePath resolves to skills/tutor/domains/<slug>/research.md, which is tracked content. The title is `# Research: ${topic}` with the student's raw input. Its only output is a log line plus an appendMemory entry; nothing acts on it. Caveats on the evidence: whether the 10% delta is reached depends on live API results, and the overwrite then stays suppressed for 30 days because the new file carries a Generated date. Also, the second caller, onboarding.js:94-100, ignores a null intro the same way, but there the AI's reply was already sent, so it is less visibly silent. A fix in cmdAdd alone leaves the research overwrite in place, so the shipped-research.md write needs its own guard.

### TG-3 (bug, medium, hours, confirmed): Bot start-up queues a full LLM rebuild of the shipped stub behavioral-economics, and job resume fans out

**Where.** scripts/bot/index.js:38-74; scripts/bot/curriculum.js:80-93,236-237

**Evidence.** The start-up scan walks all 293 shipped curricula and enqueues a pipeline job for any with `preliminary: true` and no pending job. behavioral-economics ships with preliminary:true (one file, grep confirmed). Simulated with the real TutorStore: boot 1 enqueues 'behavioral-economics', and boot 2 resumes it, which runs research and the 3-round pipeline (dozens of LLM calls) and overwrites a tracked content folder, for a topic nobody asked for. Two further defects: (1) the scan enqueues but never starts the job, so a legitimately interrupted starter course is only upgraded on the next restart; (2) the resume loop calls store.startJob(job.id) and then enrichExistingTopic, whose buildCurriculumPipeline enqueues and starts a second job for the same slug (curriculum.js:88-89). A crash during a rebuild therefore leaves two 'running' rows, the next boot resumes both in parallel on the same slug, each spawning another, so the count doubles per crash.

**Proposal.** Skip the scan for slugs that are not in progress.active_topics, since that stops the stub rebuild. Fix the fan-out with a minimal change: add an optional existing `jobId` parameter to buildCurriculumPipeline, so the resume path reuses the row it already started instead of enqueuing a second one. Then either start the jobs the scan enqueues or stop enqueuing from the scan. Add one fake-store test: boot with one running job leaves exactly one running row, and a shipped preliminary topic that is not in active_topics is not queued.

**Risk.** Low. Needs a test with a fake store: boot with one running job produces exactly one running job; a shipped preliminary topic that is not in active_topics is not queued.

> Skeptic: Holds. The start-up scan (scripts/bot/index.js:62-74) walks every folder in PATHS.domains, which is skills/tutor/domains by default (config.js:42). It enqueues a pipeline job for any curriculum with `preliminary: true` and no pending job. It only calls enqueueJob and never starts the job. behavioral-economics ships `"preliminary": true` (curriculum.json:13), and it is the only shipped curriculum with that flag, so every fresh install queues a job for it. Boot 2 then resumes it through enrichExistingTopic, which runs research and the full pipeline for a topic no student asked for, and rewrites a tracked content folder. A legitimately interrupted starter course is only retried on the next restart, because the scan never starts what it enqueues.

The resume fan-out is also real. The resume loop (index.js:41-44) calls store.startJob(job.id) and then enrichExistingTopic. That calls buildCurriculumPipeline, which does a fresh enqueueJob and startJob (curriculum.js:86-89), so one resumed job becomes two 'running' rows. A normal run completes both rows. After a crash, both stay 'running' (getPendingJobs includes 'running', store.js:59). The next boot resumes both in parallel on the same slug and each adds a new row, so the count doubles per crash. This needs repeated crashes, so "doubles per crash" is accurate but narrow.

Not tracked elsewhere. issues.md CNT-4 only cites the scan as a reason the stub matters, and no open issue title matches.

I did not run a reproduction; this rests on tracing the code.

### TG-4 (bug, medium, hours, confirmed): A failed turn leaves the lesson half-advanced: the retry double-grades spaced review and duplicates history

**Where.** scripts/bot/lesson.js:361-374,402-416,425-434

**Evidence.** handleLessonAnswer mutates state before the fallible calls: it pushes the student's message to active.history (362) and calls recordReview (373) before generate() (402), then does step++ and persistActiveLesson (415-416) before channel.sendMessage (425-434). Repro in scratch (lifecycle harness, generate throws once): after the router's 'send that again' notice the student resends; recordReview was called 2 times for one retrieval answer (SM-2 reps +2 and a longer interval) and history is [user, user, assistant, assistant]. If instead sendMessage throws (Telegram error after its 3 retries, or an over-long message), the step is already advanced and persisted, the student never saw the next question, and their resend answers the wrong step.

**Proposal.** Do not just reorder. generate() reads active.history, so pass [...active.history, {role:'user', content:text, responseTimeMs}] to it instead of pushing first. Make the pre-generate branching side-effect-free as well: the follow-up skip and go-deeper splice should work on local values, not mutate active.steps. After generate() succeeds, build the new history, step, assessments and stepStartedAt as a draft. Commit the draft (history push, step++, assessments, persistActiveLesson, recordReview) only after channel.sendMessage resolves. If the send throws, nothing has changed, so the resend retries cleanly and the review is graded once. This also covers the diagnostic branch, where active.history.push of diagnosticMsg currently runs after the send. Add tests in tests/bot/lesson-lifecycle.test.js for generate throwing once and for sendMessage throwing once. Each should assert that history length, step and the recordReview call count are unchanged after the failed turn and correct after the retry. The cleaner long-term fix is to do this inside the shared lessonTurn (#295).

**Risk.** Low. Extend tests/bot/lesson-lifecycle.test.js with a throwing generate (history length and recordReview call count unchanged after a failed turn).

> Skeptic: Confirmed by tracing origin/main. In handleLessonAnswer (scripts/bot/lesson.js), the order is: history.push(user) at 362, then for the retrieval step recordReview at 373 (after the assessRetrievalQuality LLM call), then generate() at 402, then history.push(assistant), step++ and persistActiveLesson at 414-416, and only then channel.sendMessage at 425-434. If generate() throws (it already retried 3 times in claude.js), the exception goes up to router.js:20-27, which sends the "Send that again" notice. step has not advanced, so the student's resend re-enters the same step. That resend pushes a second user message, so history is [user, user, ...]. It also calls recordReview a second time. recordReview (spaced-repetition.js:61-96) is not idempotent: it does reps += 1 and moves interval, streak and ease, and with no cardId there is no dedupe. The same applies to any other mutation done before generate(), such as stepStartedAt and the go-deeper splice. If sendMessage throws instead, step++ and the persisted lesson are already committed, the student never saw the next question, and their resend answers the wrong step. Telegram's channel only falls back to plain text on a "can't parse entities" error; any other failure is rethrown. Nothing else mitigates this. Open issues #294 and #295 do not mention it, and #295 only covers moving the bot onto lessonTurn. I did not execute the harness, since the trace is unambiguous. The retrieval-only double grading is real but narrow. The history duplication and the send-failure step skip apply to every step.

### TG-5 (bug, medium, minutes, confirmed): The plain-text fallback for invalid HTML deletes real text between < and >

**Where.** scripts/bot/message.js:55-63; scripts/bot/channels/telegram.js:86-94

**Evidence.** Lesson prompts tell the model to use Telegram HTML but never to escape '<' or '&' (prompts.js:495 'use <b>, <i>'), and normalizeTelegramText does not escape either. Any reply with a literal '<' (inequalities, generics, shell redirects) makes Telegram answer "can't parse entities"; sendMessage then retries as plain text through stripTelegramHtml, whose `.replace(/<[^>]+>/g,'')` removes everything from the first '<' to the next '>'. Run: stripTelegramHtml(normalizeTelegramText('Remember: if a < b and b > c, then <b>a</b> < c. Use List<String> too.')) returns 'Remember: if a  c, then a  too.' Math, code and CS lessons are the likely victims, and the student receives the mangled text with no error.

**Proposal.** Escape before the first send, so the fallback is rarely reached. In normalizeTelegramText, replace '&' that does not start an entity with '&amp;', and '<' not followed by /?(b|strong|i|em|u|ins|s|strike|del|a|code|pre|tg-spoiler|blockquote) with '&lt;'. Make the stripper remove only those same allowed tags before decoding entities. Add tests for the finding's input and for 'List<String>', 'a < b' and 'x && y'. Check that code and pre content still renders.

**Risk.** Low. tests/bot/message.test.js covers stripTelegramHtml; add the cases above.

> Skeptic: Holds. The bot sends model text to Telegram in HTML mode with no escaping. When Telegram rejects a stray '<', telegram.js:89-93 retries through stripTelegramHtml, and its `/<[^>]+>/g` regex deletes everything between the first '<' and the next '>'. The student gets the mangled text with no error. Caveat on the trigger: I only reproduced the stripping, not Telegram's rejection of the first send. That part rests on Telegram's known behaviour of answering "can't parse entities" for a stray '<' or an unsupported tag such as <String>.

### TG-7 (bug, medium, hours, confirmed): Telegram onboarding throws away the student's answers; USER.md is never written by the bot

**Where.** scripts/bot/onboarding.js:54-115; scripts/bot/state.js:72-74; api/onboard.js:114-130

**Evidence.** The bot's writeUser (state.js:72) has no caller anywhere (git grep: only api/user.js, api/onboard.js and scripts/web/server.js call a writeUser). handleOnboarding keeps the conversation only in the 7-day session JSONL, which clearSession and pruneOldSessions delete, and extracts only the topic. USER.md stays the empty template, so the lesson planner (lesson.js:241), the chat prompt (context.js buildUserContext) and detectLevel (curriculum.js:250-258, which finds no 'level:' text in the template and always falls back to 'intermediate') never see the student's name, level, pace or goal. The web fixed exactly this in #155 (keepOwnWords in api/onboard.js).

**Proposal.** Two caveats on the proposal. (1) keepOwnWords uses async state.* and hasContent is defined in api/onboard.js. The bot's state.js is synchronous, so extract only the pure parts (hasContent plus a function that builds the profile text from messages) into lib/core and keep the read/write calls in the bot. (2) Writing free-form text will not fix detectLevel: it still looks for a 'level:' label, and with the free-text profile a stray "level" in a student's answer could match. Either ask for and store a labelled level, or switch detectLevel to something that does not regex the profile. The bot's onboarding history includes assistant turns, and keepOwnWords already filters to role === 'user'. The call belongs after the topic is confirmed (before or after generateAndRegisterTopic). Tests: extend tests/bot/onboarding.test.js to cover a USER.md written after a confirmed topic, and a second onboarding leaving a real profile unchanged.

**Risk.** Low. Test: after onboarding with a confirmed topic, USER.md contains the student's answers and a second onboarding never overwrites a real profile (hasContent guard).

> Skeptic: Holds. On origin/main the Telegram bot never writes USER.md. Bot writeUser (scripts/bot/state.js:72) has no caller; the only other writeUser calls are api/onboard.js:126, api/user.js:34 and scripts/web/server.js:345, all web. handleOnboarding (onboarding.js:54-115) only appends to the session JSONL and extracts the topic from the "<b>Topic:</b>" marker. startOnboarding calls clearSession, and pruneOldSessions at bot start deletes sessions older than 7 days. The history is also capped at 20 messages (MAX_HISTORY). Nothing in the bot prompts or claude.js lets the model write files: the adapters are called with text only. So USER.md stays at the workspace/templates/USER.md template unless the operator ran scripts/setup.js, which pre-fills only name and timezone. The consumers (context.js:74/235, lesson.js:134/241/390/508, buildUserContext) then see an empty profile. detectLevel (curriculum.js:250-258) uses /level[:\s]*(\w[\w\s-]*)/i. The template's only "level" is "**Educational level:** _(middle...", where "level:" is followed by "**", which is not \w, so there is no match and the level is always 'intermediate'. The web equivalent (keepOwnWords, #155/#158) exists at api/onboard.js:114-130 and the bot lacks it. No open issue or issues.md entry covers it: BOT-1 is about a shared global profile, #211 is about a cross-topic learner model, and #295 is about lessonTurn.

### TG-9 (bug, medium, hours, confirmed): After the retrieval answer the question is asked twice: the model's reply and then the appended plan diagnostic

**Where.** scripts/bot/lesson.js:418-429; lib/core/prompts.js:428-432

**Evidence.** The retrieval-step instructions end 'Then ask the diagnostic question for today's new concept' (prompts.js:432), so the model's visibleText already contains a diagnostic question. handleLessonAnswer then builds fullMsg = visibleText + '\n\nToday's goal: ...' + formatDiagnosticMessage(active) (lesson.js:421-424), appending the planned diagnostic as well. Scratch repro with the lifecycle harness shows the message is reply + goal + plan diagnostic. No test covers it, and the comment says the goal is 'prepended' while the code appends it. Not verified against a live model (hence plausible, not certain): it depends on the model following the prompt, which is the intended behaviour.

**Proposal.** Keep the code append, since it carries the goal, the MC option list, and the buttons. Change the prompt only for the bot. Add a flag such as `{ deferQuestion: true }` to `buildSocraticResponsePrompt`, passed only from scripts/bot/lesson.js when `step === 'retrieval'` and the next step is `diagnostic`. With the flag set, the retrieval instructions end with 'Do NOT ask the diagnostic question; the next message asks it.' The web leaves the flag off, so its behaviour is unchanged. Two things to watch: the web currently relies on the model asking the question, and prompts.test.js pins prompt hashes (about line 312), so those hashes need updating. Add a unit test for the new retrieval-prompt branch, and a bot lifecycle assertion that the sent message contains the diagnostic text once. Check once on a running bot with a real model.

**Risk.** Prompt-sensitive; verify on a running bot (repo rule). Same prompt is shared with the web lessonTurn path, so confirm the web does not append a second copy.

> Skeptic: Holds on the code path, and I'm confident it happens in practice; no live model was run. After a retrieval answer on the bot, the cheap model is told to end with the diagnostic question, and the bot then appends the plan's diagnostic and the goal anyway. The question appears twice (the model's wording, then the plan's), with "Today's goal" after the first one. Two details in the finding are slightly off or understated. The lesson.js:420 comment says "prepend" but the code appends. And when the diagnostic has suggested answers, `askAsPlanned` is true, so the model is told to ask it exactly as the plan words it, which makes the duplicate near-verbatim. The proposal's first option (pass nextStep/askAsPlanned) would not fix this, because the model would still ask a question. The web path is not affected: it sends only the model's reply, so the second copy is bot-only.

### TG-10 (bug, low, hours, not verified): 'go deeper' typed mid-lesson is graded as the student's answer to the current step

**Where.** scripts/bot/lesson.js:347-353,361-374,408-412

**Evidence.** Only 'skip', 'move on' and 'next' return early. 'go deeper' / 'explain more' splice a scaffolding step in and then fall through: the text is pushed to history and, at the retrieval step, assessRetrievalQuality runs on it and recordReview is called; an assessment is pushed for it too. Scratch repro (retrieval step, text 'go deeper', LLM says 'wrong'): recordReview('test-topic','alpha','wrong') was called, which resets that concept's interval, and a 0.8 step score was recorded for a non-answer, skewing the lesson's accuracy and the next practice directives.

**Proposal.** Treat both phrases as controls: add the step, then ask the scaffolding question immediately (one generate call with the control text excluded from history and grading). In #295 this becomes the shared Go deeper action.

**Risk.** Low. Test in lesson-lifecycle.test.js: recordReview not called and no assessment pushed for a control phrase.

### TG-13 (dead-code, medium, minutes, ~151 lines, confirmed): concept-graph.js is only used to compute a log line

**Where.** scripts/bot/lesson.js:24,376-386; lib/core/concept-graph.js (138 lines); lib/core/index.js:33

**Evidence.** The 'knowledge-graph credit propagation' block parses concept-map.md and calls getPrerequisites, then only log.info(...): no recordReview or any state change for the prerequisites. Searched lib/, api/, scripts/, public/, tests/, package.json, vercel.json, docs/ (git grep concept-graph|parseConceptGraph|getPrerequisites|getDependents|computeConceptMastery|checkPrerequisites on origin/main): the only other references are the barrel re-export (lib/core/index.js:33, and nothing imports that barrel; package.json has no main/exports), CLAUDE.md's file list, and a prose review in docs/review-professor.md. No test exercises concept-graph.js. dynamic imports and string-built names: none found.

**Proposal.** Delete the block and the import in lesson.js, delete lib/core/concept-graph.js, remove the barrel line and the CLAUDE.md entry. If prerequisite credit is wanted later, it belongs in the shared lesson engine from #295, not here.

**Risk.** None at runtime. The only behaviour lost is one debug log line.

> Skeptic: Confirmed. The only runtime consumer of lib/core/concept-graph.js is the block at scripts/bot/lesson.js:376-386. It parses concept-map.md, calls getPrerequisites, and then only calls log.info('propagating mastery credit to prerequisites'). Nothing is recorded or changed for the prerequisites. The try/catch{} also swallows any error. Deleting the block, the import at line 24 and lib/core/concept-graph.js (138 lines) loses one debug log line, plus a readDomainFile call that only happens on 'easy' retrievals. Removing the CLAUDE.md line and lib/core/index.js:33 completes the cleanup. docs/review-professor.md is a historical prose review; leave it unchanged. Optional: the lesson.js:376-386 block is about 11 lines and the module 138, roughly 150 lines in total.

### TG-14 (dead-code, low, minutes, ~110 lines, not verified): More dead code beyond #294: parseGeneratedDomain, stripAnswerKey, sendChunked, the one-implementation BaseChannel

**Where.** scripts/bot/curriculum.js:269-322; scripts/bot/lesson.js:720-722; scripts/bot/channels/base.js:1-44

**Evidence.** parseGeneratedDomain (54 lines): git grep over lib, api, scripts, public, tests, docs finds callers only in tests/bot/curriculum-parse.test.js; the live pipeline has its own parser (lib/core/pipeline.js, tests/pipeline-parse.test.js) and its second branch still uses the greedy /\[[\s\S]*\]/ that #233 removed elsewhere. stripAnswerKey is referenced only by tests/bot/lesson.test.js (leftover of the A-D exercise format #294 already removes). BaseChannel.sendChunked has no caller (git grep sendChunked: its own definition only); BaseChannel itself is 44 lines of throw-stubs with one subclass (TelegramChannel), nothing else extends it, and there is no second channel. clearActiveLesson and newLessonId are exported but only used inside lesson.js. Not listed in #294 (which names the ex: callbacks, the four lesson stubs, five prompt builders, sendPhoto, pushType, topic_/intensity_).

**Proposal.** Delete parseGeneratedDomain and its test cases (keep the slugify tests), stripAnswerKey and its test, sendChunked, and base.js (TelegramChannel stops extending it; keep the doc comment). Drop the unneeded exports.

**Risk.** None. Tests touched: tests/bot/curriculum-parse.test.js, tests/bot/lesson.test.js.

### TG-16 (simplify, medium, a day, ~120 lines, not verified): scripts/bot/state.js is a second copy of TutorState and is what #295 has to unpick first

**Where.** scripts/bot/state.js:12-183 vs lib/core/state.js:73-194

**Evidence.** The bot exports readProgress, writeProgress, updateProgress, readUser, writeUser, readCurriculum, writeCurriculum, getNextLesson, markLessonComplete, readDomainFile, writeDomainFile, appendMemory, readRecentMemory, listTopics and getTopicProgress: the same 15 methods as TutorState, with the same file layout and the same lib/core/progress.js helpers. The copies have already drifted: the bot's readDomainFile swallows every error where the core one throws unless ENOENT, markLessonComplete also appends to progress.history, getTopicProgress omits level/prerequisites, and the DATA_DIR layout differs (TG-1 is the visible symptom). lesson.js and curriculum.js then use both (coreState and the bot's functions) for the same files. In-flight lesson state goes through a third path: lesson.js:31-38,76-109 opens its own SQLite connection and runs raw SQL on kv, bypassing TutorStore (the other two connections are index.js:28 and curriculum.js:26-32), with empty catches.

**Proposal.** Instantiate one TutorState (with a layout override for OPENTUTOR_DATA_DIR) and make state.js export bound functions of it, keeping only the bot-only parts (review cards, the history push). Hold the in-flight lesson via the store's readKV/writeKV/deleteKV. This is step 3 of #295 done early, and it makes TG-1 vanish.

**Risk.** Medium: touches every bot module's imports. tests/bot/state.test.js, lesson-lifecycle, commands and poll-grading cover it; add a test that state.js and TutorState agree on paths.

### TG-6 (improve, medium, hours, not verified): Telegram _call retries permanent 4xx errors, so every invalid-HTML message costs 3 failed requests and 3 seconds

**Where.** scripts/bot/channels/telegram.js:160-176; scripts/bot/helpers.js:5-17

**Evidence.** _call wraps every method in retry() with 3 attempts (1s, 2s backoff) and treats any thrown error as retryable. Repro with a mocked fetch: sendMessage('x <y z') produced HTML, HTML, HTML, plain (4 requests) in 3003 ms, because the 400 "can't parse entities" is retried before sendMessage's own fallback ever runs; a 400 'message is too long' made 3 requests over 3004 ms and then threw. The 429 path sleeps retry_after and then throws, so retry() sleeps again on top. Because polling is serial (telegram.js:55 awaits each update), every such stall blocks all other updates. Lesson messages also bypass splitForTelegram (only chat and onboarding use sendStructuredMessage), so an over-long lesson reply fails this way.

**Proposal.** Retry only network errors, 429 and 5xx (not 400/403), and make 429 retry-after the only wait. Route sendMessage itself through the splitter so no caller can exceed 4,096 characters.

**Risk.** Low. Tests with the mocked fetch above (one request for a 400 and one fallback request).

### TG-8 (improve, medium, hours, not verified): The background full-curriculum build fails silently for the student, and repeats the research Phase A just did

**Where.** scripts/bot/curriculum.js:66-70,95-116,150-177; scripts/bot/commands.js:193; scripts/bot/onboarding.js:102

**Evidence.** cmdAdd and onboarding tell the student 'I'll let you know when it's ready'. buildCurriculumPipeline notifies only on success (curriculum.js:150-164); on failure the .catch in generateAndRegisterTopic (68-70) only logs, so the student waits forever on 5 starter lessons. The pipeline also runs research twice per /add: generateQuickStart already ran the 8-source research (Phase A) and wrote research.md; Phase B then sees a non-empty research.md, so `research` stays null and line 115 runs researchTopic again just to obtain syllabi and wikiLinks. The first run's raw result is discarded inside generateQuickStart (quick-start.js:105-106 returns only the formatted text). The branchy 99-116 block also hides that the freshly fetched research is never used as the Critic/Builder context.

**Proposal.** On failure send a one-line 'the full build failed, your starter lessons still work' message. Return the raw research object from generateQuickStart and pass it to Phase B, so research.md is read or written once and syllabi/wikiLinks come from the same result.

**Risk.** Low to medium: Phase B's research input changes shape; tests/bot/curriculum-parse.test.js and tests/research-handoff.test.js cover the neighbourhood. Add a failure-notification test.

### TG-12 (improve, medium, a day, not verified): Bot onboarding and /add ignore the 293 ready-made courses and build duplicates

**Where.** scripts/bot/context.js:114-127; scripts/bot/onboarding.js:87-94; scripts/bot/curriculum.js:40-53; api/onboard.js:86-100,120-132

**Evidence.** The web onboarding prompt (lib/core/prompts.js:516-575) receives the catalog slugs and resolves the model's choice through courseFor(). The bot keeps its own copy of the onboarding prompt (context.js:114-127) with no catalog, takes whatever string follows <b>Topic:</b>, and slugify()s it. 'Game theory' matches the shipped slug only by luck; 'Intro to game theory' or 'Python programming' creates a new custom topic and spends the quick-start and 3-round pipeline on a 5-lesson stub next to a reviewed 27-lesson shipped course. The web's own comment says 'A ready-made course is better than a new one'.

**Proposal.** Pass the catalog (listTopics) into the bot's onboarding prompt and resolve the confirmed name with courseFor (move courseFor from api/onboard.js into lib/core/catalog.js so the bot does not import from api/). Do the same in cmdAdd before generating.

**Risk.** Medium: onboarding output contract differs (<b>Topic:</b> vs <TOPIC>); keep the bot marker. Tests: extractConfirmedTopic and onboarding tests in tests/bot/onboarding.test.js plus tests/onboard-route.test.js for courseFor.

### TG-11 (improve, low, minutes, not verified): An abandoned in-flight lesson never expires, so later chat is graded as lesson answers

**Where.** scripts/bot/router.js:79-82; scripts/bot/lesson.js:74-109

**Evidence.** router.js:80 sends every non-command text to handleLessonAnswer while getActiveLesson(chatId) is truthy, and activeLessons has no TTL (startedAt is stored but never read). A student who opens a lesson with /next, leaves, and asks an unrelated question the next day gets it graded as a lesson answer; if scheduled pushes are off or paused, only another /next clears it. Matters more once BOT-4's 'skip a push while a lesson is open' is implemented, which would otherwise block pushes forever.

**Proposal.** Treat a lesson older than a few hours as abandoned: clear it (or park it) and route the text normally; one check in getActiveLesson using startedAt/stepStartedAt.

**Risk.** Low. Test with a fake clock.

### TG-15 (improve, low, minutes, ~8 lines, not verified): TELEGRAM_MODE=webhook starts a bot that never receives anything

**Where.** scripts/bot/config.js:73-76; scripts/bot/channels/telegram.js:12-29; docs/deployment.md:73

**Evidence.** The webhook route is retired (docs/deployment.md:73, docs/self-deploy.md:11, tests/web-deployment.test.js:7 asserts register-webhook.js is gone), but TelegramChannel still takes mode and start() only polls when mode === 'polling'. With a leftover TELEGRAM_MODE=webhook in the environment (the docs tell people to unset it) the bot logs 'status: running', registers its commands, and silently answers nothing, with no listener at all. TELEGRAM.webhookUrl is read and used nowhere (git grep webhookUrl: its definition only).

**Proposal.** Remove mode and webhookUrl from config and the channel, always poll, and log a warning if TELEGRAM_MODE is set to anything but polling.

**Risk.** None. tests/bot/config.test.js may assert the TELEGRAM shape; update it.

### TG-17 (improve, low, minutes, not verified): Quiz parsing still uses the greedy array regex that #233 removed for objects

**Where.** scripts/bot/quiz.js:44-48

**Evidence.** `response.text.match(/\[[\s\S]*\]/)` runs from the first '[' to the last ']' of the whole reply, so any trailing prose containing a bracket ('[1]', '[if you want more]') makes JSON.parse fail and the student gets 'I couldn't build that quiz cleanly'. lib/core/json.js documents exactly this failure for objects (#233) and parseFirstJson is already used in lesson.js and flashcard.js.

**Proposal.** Ask the quiz prompt for { "questions": [...] } and read it with parseFirstJson (context.js:135 holds the shape).

**Risk.** Low. tests/bot/poll-grading.test.js feeds the quiz JSON; update its fixtures.

## Adapters, scripts, build and repo tooling

The adapters, scripts and tooling are mostly healthy: on a clean extract of origin/main (a57f21d) all 91 test files and 1353 tests pass and eslint is clean. All six dependencies are imported somewhere and no import is undeclared. The weak spots are the least-tested parts. setup.js has tests only for the Claude Code and Codex path, and it has one real data-loss bug (it overwrites a user's OpenClaw/NemoClaw config it could not parse) and a bin guard that makes `npx`/`npm link` a silent no-op. The Ollama adapter has no timeout and does not raise the context window, so long tutor prompts are probably truncated. The Claude CLI adapter inherits the operator's whole Claude Code environment. Beyond that there is about 2,700 lines of tooling nothing runs: the .claude/workflows pipeline (2,035 lines, a second copy of lib/core/pipeline.js that contradicts the completion-state rule), eval/score.py plus factory.md, and one-shot scripts. The adapters repeat the tier/model/max-tokens/timeout logic instead of sharing it through BaseLLMAdapter. Audit items already tracked in issues.md (OSS-5, OSS-7, OSS-8, OSS-12, OPS-10, OPS-11, GUIDE-1, GUIDE-2, AGENT-1, TST-9) are not repeated. Where a finding touches one, it says so.

### PLAT-1 (bug, high, minutes, confirmed): setup.js overwrites an OpenClaw/NemoClaw config it could not parse, after printing "skipping config merge"

**Where.** scripts/setup.js:175-200 (setupOpenClawLike)

**Evidence.** The catch at 178-181 only warns (`Could not parse ${platformId}.json — skipping config merge`) and falls through. `config` stays `{}`. Lines 183-200 then add the tutor agent and call `fs.writeFileSync(configFile, JSON.stringify(config...))`, which replaces the user's file. Reproduced in the scratch extract with HOME pointed at a temp dir: ~/.openclaw/openclaw.json held a `//` comment, a trailing comma, a gateway port and a channels.telegram.token. After choosing OpenClaw, the file held only the `agents` and `tools` blocks. The gateway and Telegram token settings were gone, and the setup output printed both the warning and "agent registered". Any non-ENOENT read error (EACCES, EISDIR) takes the same path. Only `setupAgentSkills` is covered by tests/setup-agent-boot.test.js. `setupOpenClawLike`, `setupNanoClaw` and `main` have no test.

**Proposal.** Implement the proposal, with two additions. On any read or parse failure, warn, print the JSON snippet to add by hand, and return before any write. Treat a parsed value that is not a plain object (null, an array) the same way. Skip the new export of setupOpenClawLike for the test: either export it, or drive main through a fake HOME. As a backstop, copy the existing file to <file>.bak before every write, so an edge case no longer loses a hand-edited config.

**Risk.** Low. The only behaviour change is that a broken config is no longer destroyed. A user whose config really is JSON5 has to add the agent entry by hand.

> Skeptic: Confirmed. In setupOpenClawLike (scripts/setup.js:175-181) the catch only warns for any non-ENOENT error. config stays {}, and the code at 183-200 then registers the tutor agent and writes the file. That replaces the user's whole config with only the agents and tools blocks. The output reads "Could not parse openclaw.json — skipping config merge", then "agent registered", which contradicts itself. The trigger is realistic: openclaw/README.md labels its config snippets json5 and shows comments in ~/.openclaw/openclaw.json, so users are likely to have comments or trailing commas in it. The proposal is sound, with two small refinements below. Not covered by any open issue title or by issues.md; the only related hit is the AGENT-1 platform-guide notes, which are about docs. No test touches setupOpenClawLike (tests/integration/agent-platforms.test.js:113 only mentions it in a comment).

### PLAT-3 (bug, medium, hours, confirmed): Ollama adapter has no timeout and no num_ctx, so long tutor prompts are probably cut and a hung model blocks for 5 minutes

**Where.** lib/adapters/ollama.js:25-36

**Evidence.** The `fetch` has no `signal`, and `options.timeout` is never read. The pipeline passes `timeout: 240_000` (lib/core/pipeline.js:17,57) and the other adapters honour it. Only `num_predict` is sent, so Ollama uses its default context (4096 tokens on common versions). The lesson planner alone sends SKILL.md plus teaching-notes.md, concept-map.md and teacher.md. For chess-strategy in the extract that is about 9+14+10+2 KB, roughly 8k tokens. Ollama truncates the oldest tokens, which are the system prompt's opening instructions, and it only logs a warning. `generate()` has no test for Ollama (or for ClaudeSDK). docs/architecture.md and the README advertise `ollama` as a supported backend.

**Proposal.** 1. Add `signal: AbortSignal.timeout(options.timeout || 300_000)` to ollama.js, with no 60 s or 120 s default. Local models are slow and cold-load a model on first call. A 60 s default like openai.js would break legitimate 70b CPU runs. Unset, the call still gets the 300 s cap it already has, but now as a clear abort error instead of undici's headers-timeout error.
2. Do not force `num_ctx: 16384`, since that raises RAM use and changes behaviour for everyone. Send `num_ctx` only when `OLLAMA_NUM_CTX` is set, and document it in .env.example. Add a one-line README or docs note that Ollama's default context may be too small for tutor prompts.
3. Add a stubbed-fetch test that checks the request body (`num_predict`, and `num_ctx` only when the env var is set) and that the abort fires. A few lines would do for both the Ollama and ClaudeSDK `generate()` gaps.
4. Check the context and truncation behaviour on a live Ollama before describing it in the issue as silent corruption of the system prompt.

**Risk.** Low. A larger num_ctx raises RAM use on small machines, so keep it overridable. I did not run Ollama. The 4096 default and the truncation behaviour are from memory of its docs and should be checked on a live install.

> Skeptic: The timeout half holds and is verified. The num_ctx half is unverified, and the truncation claim looks overstated. The proposal needs adjusting before it is filed.

Confirmed:
- lib/adapters/ollama.js:25-36 calls fetch with no `signal`, and `options.timeout` is never read. claude-sdk.js:42-43 and openai.js:48 honour it, and claude-cli.js:18 reads `options.timeout` too.
- Callers do pass a timeout: pipeline.js:20,53 sets 240_000, and quick-start.js:100 and backfill-topic-levels.js:65 pass their own. Ollama ignores all of them.
- The adapter sends `stream:false`, so response headers only arrive after generation finishes. A hung or overloaded Ollama is therefore bounded only by Node's undici default `headersTimeout` of about 300 s. That matches the "5 minutes" claim, and I did not run it.
- A slow legitimate generation, such as a 70b model on CPU, also fails at that same 5-minute limit. This is a related failure the finding does not mention.
- tests/adapters.test.js only constructs OllamaAdapter. No test calls `generate()`. The same file has the stub-fetch pattern the proposed test could follow.
- No open issue or issues.md entry covers Ollama timeouts or num_ctx. JRN-9 and OPS-9 are about the Vercel 60 s limit on openai.js. TST-style item at issues.md:886 only notes that ollama.js has no test.

Not confirmed:
- Only `num_predict` is sent, so Ollama uses its own default context. That default is 4096 on common versions and VRAM-dependent on newer ones, so it is not a fixed 4096. I recall it from Ollama's docs, and the reviewer also gave it from memory. I did not check it on a live install.
- "Ollama truncates the oldest tokens, which are the system prompt's opening instructions" is stated as fact but is uncertain. From memory of Ollama's chat prompt builder, system messages are kept and the oldest other messages are dropped. Any later truncation is done by the runner.
- The prompt size of roughly 8k tokens is the reviewer's estimate. I did not remeasure it.

So the finding is real, but its severity rests mostly on the timeout, not on silent prompt truncation.

### PLAT-4 (bug, medium, minutes, confirmed): The `opentutor` bin never runs: the main-module guard compares the symlink path with the real path

**Where.** scripts/setup.js:313 (package.json:15-17)

**Evidence.** The guard is `import.meta.url === pathToFileURL(process.argv[1]).href`. npm exposes bins as symlinks, so `process.argv[1]` is the link path while `import.meta.url` is the realpath, and the guard is false. Reproduced: `ln -s scripts/setup.js binlink/opentutor; echo | node binlink/opentutor` prints nothing and exits 0. Run directly it prints the menu. The same pattern is in scripts/check-resource-links.js:67 and scripts/backfill-topic-levels.js:127, but those are not bins. OSS-8 only says the usage line names an unpublished command. The silent no-op is a separate defect, and it also hits `npm link` and a local `npm i -g .`.

**Proposal.** Replace the guard with a realpath comparison: `fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)`. `fs` is already imported in setup.js. This fixes the bin while it is declared and also survives a future publish. Alternatively, drop `bin` and the `npx opentutor setup` usage line together, as OSS-8 suggests. Dropping `bin` is only enough while the package stays unpublished.

**Risk.** None. The setup tests import setupAgentSkills, so they do not touch the guard.

> Skeptic: The bug is real, but it is low impact. The guard at scripts/setup.js:313 is `process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href`. Node resolves symlinks for the module URL but leaves argv[1] as the link path, so the guard is false and nothing runs. package.json:15-17 declares `bin.opentutor -> ./scripts/setup.js`, and npm installs bins as symlinks on Unix, so `npm link` or a local `npm i -g .` is hit. The tests import setupAgentSkills and never touch the guard. It is not tracked: OSS-8 in issues.md covers only the unpublished-command usage line. Severity is closer to low than medium, because the package is unpublished (`npm view opentutor` returns E404 per OSS-8) and the README documents `node scripts/setup.js`. Dropping `bin` is a valid fix, but only if the guard bug is also noted. The scripts/check-resource-links.js:67 and scripts/backfill-topic-levels.js:127 copies of the pattern I did not check, since they are not bins.

### PLAT-5 (bug, low, minutes, confirmed): Project-scope setup run in the checkout edits the tracked CLAUDE.md and AGENTS.md and leaves untracked .codex/ and .tutor/

**Where.** scripts/setup.js:135, 144-154 (and .gitignore)

**Evidence.** Project scope uses `process.cwd()` for the boot file. claude-code/README.md and codex/README.md say to run `node scripts/setup.js` from the repo root. Reproduced in a git-initialised extract with a fake HOME (choices: platforms 1,2, scope p): `git status` showed ` M AGENTS.md`, ` M CLAUDE.md` (12 lines appended to each), `?? .codex/` and `?? .tutor/`. `.claude/` is ignored, but `.codex/` and `.tutor/` are not in .gitignore. The `## Tutor` marker check in appendIfMissing (line 49, substring match) would also wrongly skip a user's own `## Tutorials` heading.

**Proposal.** Do not hard-refuse. Print a warning, or ask for confirmation, when project scope is chosen with cwd equal to REPO_ROOT, since someone may deliberately want a tutor in the checkout. Add `.codex/` and `.tutor/` to .gitignore (the zero-risk part). Match the marker with `/^## Tutor\s*$/m` rather than `/^## Tutor$/m`, so CRLF-ended files are still detected and the section is not appended twice.

**Risk.** Low. tests/setup-agent-boot.test.js chdirs to a temp dir, so it keeps working.

> Skeptic: Holds as a low-severity bug. Project scope is opt-in (default is global, setup.js:284-287), but the READMEs tell users to run `node scripts/setup.js` from the repo root. If the user types "p" there, setupAgentSkills (setup.js:135, 146, 149-151) writes to process.cwd(). That appends the boot block to the tracked CLAUDE.md and AGENTS.md and creates .codex/ and .tutor/, which .gitignore does not cover (it has .claude/ only). Neither CLAUDE.md nor AGENTS.md on origin/main contains "## Tutor", so the append really happens. The `includes('## Tutor')` check at setup.js:49 is a substring match, so a user's own "## Tutorials" heading would wrongly skip the install. Nothing tracks this: no open issue titles match, and issues.md does not mention it. I did not run the reproduction myself; I confirmed the code path by reading it.

### PLAT-8 (dead-code, medium, minutes, ~2035 lines, confirmed): .claude/workflows is a 2,035-line second copy of the curriculum pipeline that contradicts the completion-state rule

**Where.** .claude/workflows/{new-topic,curriculum-build,curriculum-qa,research,schedule,dashboard}.js (458+319+577+327+210+144 lines)

**Evidence.** Nothing in lib/, api/, scripts/, tests/, package.json, vercel.json or CI imports them. Only the workflows call each other (new-topic.js:224-421), and the only user-facing mention is `/new-topic` in claude-code/README.md:67. eslint covers only lib, scripts and api, and no test touches them. They were last touched in the old 300-topic catalog commit (5adf7e0). They disagree with the code. curriculum-build.js:269,426,434 force `"status": "pending"` on every lesson. curriculum-qa.js:132 requires status to be pending or completed. dashboard.js:86 counts `status === "completed"` in curriculum.json, but completion now lives in completions.json and curricula must stay content-only (CLAUDE.md, #117). The dashboard therefore always reports 0 completed. They write into skills/tutor/domains/ and bypass lib/core's links filter and source verification. CLAUDE.md says lib/core is the single source of truth. The owner's working copy already shows these five files deleted (`D .claude/workflows/*`). Related: OSS-7 only covers `/new-topic` being unusable outside a checkout.

**Proposal.** Delete .claude/workflows with `git rm`. Remove the "Curriculum Generation" `/new-topic` block from claude-code/README.md (around lines 62-75). Rewrite or trim docs/curriculum-generation.md from lib/core/pipeline.js, since the whole tutor-loop and ESCALATE narrative describes the deleted workflow, not just one section. State in the PR that the Claude Code `/new-topic` workflow feature is being dropped and that the library CurriculumPipeline is the single implementation.

**Risk.** Low. It removes a documented but unmaintained Claude Code feature, so say so in the PR. Nothing the tests cover depends on it.

> Skeptic: Holds. All six files exist on origin/main and nothing outside them uses them. Line counts match exactly (577, 458, 319, 327, 210, 144 = 2,035). I found no references in lib, api, scripts, tests, package.json, vercel.json, .github or AGENTS.md. The only references are claude-code/README.md:67 (`/new-topic quantum computing`, with a "Curriculum Generation" section around it) and the intra-workflow calls in new-topic.js. Searches for `new-topic`, `curriculum-build`, `curriculum-qa` and `qa-report` outside the directory hit only that README plus unrelated `#new-topic` DOM ids in public/ and tests/web-connect.test.js. The status-field claims check out. curriculum-build.js forces `"status": "pending"` at lines 269 and 426. curriculum-qa.js requires status to be pending or completed. dashboard.js tells the agent to count lessons where `status === "completed"` in curriculum.json, which cannot work now that completion lives in completions.json (CLAUDE.md: curricula are content-only, #117). The workflows also write into skills/tutor/domains/. Two minor corrections. First, the working copy shows six deleted workflow files, not five (schedule.js is included). Second, the docs cleanup is larger than "the matching section": docs/curriculum-generation.md describes the workflow's own tutor loop throughout (ADVANCE/RESEARCH/REDO/ESCALATE at line 60, qa-report.md and escalation.md at 191-192, "ESCALATE & Resume" at 195-222), none of which lib/core/pipeline.js implements. Also, `.claude/` is gitignored but these files are tracked, so removal needs `git rm`. These are a real Claude Code Workflow-tool feature, so the PR should say a documented but unmaintained feature is being removed.

### PLAT-10 (dead-code, low, minutes, ~5 lines, confirmed): webSearch and webSearchMaxUses are unreachable, and base.js documents an `outputMode` option no adapter reads

**Where.** lib/adapters/claude-sdk.js:38-40; lib/adapters/base.js:18,20

**Evidence.** `git grep -n 'webSearch\|web_search\|WebSearch' origin/main` over lib, api, scripts, public, tests, docs, *.md, package.json and vercel.json returns only base.js:20 and claude-sdk.js:38-39. No caller passes the option, and no string-built option name or dynamic import turns it up. `outputMode` is passed by the pipeline, the bot and the prompts (they hand it to scripts/bot/claude.js and the pipeline, which read it), but none of the five adapters reads it, so base.js:18 misdescribes the contract.

**Proposal.** Delete claude-sdk.js:38-40 and base.js:20. Reword base.js:18 so outputMode is documented as read by the pipeline and the bot wrapper and ignored by adapters. List timeout and onToken (openai/openrouter only). Delete the "Web search only available with sdk" sentence at docs/curriculum-generation.md:232.

**Risk.** None. If web search is wanted later, the date-stamped tool id would have to be updated anyway.

> Skeptic: Holds. Nothing passes webSearch or webSearchMaxUses, and none of the adapters under lib/adapters read outputMode. The claude-sdk.js:38-40 block is dead, and deleting it changes no behaviour.

Two details to get right when making the change:
- Delete base.js:20 together with the block.
- Do not remove outputMode from the callers. pipeline.js:47 reads it to pick the safety boundary, and scripts/bot/claude.js:32-50 reads it too. Tests assert that it is passed through (tests/pipeline-output-room.test.js:15, tests/bot/claude-backend.test.js, tests/bot/chat.test.js). Only the base.js JSDoc line is wrong, because it claims adapters honour the option.

The proposed JSDoc list (model, maxTokens, timeout, onToken) is accurate. onToken is read only by openai.js (and so openrouter) and is not read by claude-sdk, ollama or claude-cli, so it could carry a note such as "(openai/openrouter only)". There is one related stale doc line at docs/curriculum-generation.md:232: "Web search only available with `sdk`". That is about the bot's CLAUDE_BACKEND and is already false, since scripts/bot/claude.js has no web search path. It should be removed in the same change.

### PLAT-12 (dead-code, low, minutes, ~345 lines, not verified): eval/score.py and factory.md are config for an external harness. Nothing runs them, and the eval fails on a clean clone

**Where.** eval/score.py (218 lines), factory.md (127 lines), CLAUDE.md:101

**Evidence.** No reference in package.json, CI, vitest.config.js, any script or any test. The only mentions are factory.md:69 (its own command), factory.md:42 and the CLAUDE.md:101 tree line. Run in a clean extract it reports architecture=0.75 and passed:false: `workspace/USER.md` and `workspace/tutor/progress.json` are required files, but both are gitignored runtime copies seeded from workspace/templates/ (.gitignore:21-22). The syntax_check dimension only scans scripts/ and the observability dimension rewards log-call density. factory.md also lists a `resend` dependency that is not in package.json. OSS-12 only suggests moving factory.md out of the root.

**Proposal.** Delete both files and the CLAUDE.md tree entry. If the harness still exists outside this repo, keep them in that repo.

**Risk.** Low. Check with the owner that no external factory job reads them.

### PLAT-13 (dead-code, low, minutes, ~185 lines, not verified): generate-teacher-md.js has nothing to do: all 293 domains already have teacher.md, and --force would overwrite them

**Where.** scripts/generate-teacher-md.js (185 lines); CLAUDE.md:49

**Evidence.** `git ls-tree` shows teacher.md in all 293 domains, so without --force the script processes 0 domains. The shipped files are this script's own output (chess-strategy/teacher.md matches its templates). New topics get teacher.md from the pipeline builder (lib/core/pipeline.js:148,254). No test, package.json script or doc calls it except the CLAUDE.md tree line, and it runs at import time, so it cannot be imported or tested. `--force` rewrites tracked content in skills/tutor/domains/. The siblings scripts/check-resource-links.js (67 lines, #293) and scripts/backfill-topic-levels.js (127 lines, #251) are also finished migrations, but each has a test (readable.test.js:263, topic-levels.test.js), so they are only candidates.

**Proposal.** Delete generate-teacher-md.js and its CLAUDE.md line. Optionally archive the other two migrations once the data is final.

**Risk.** Low. If the 293 teacher.md files are ever regenerated, git history has the script.

### PLAT-7 (simplify, medium, hours, ~70 lines, confirmed): Twelve route test files each hand-roll a fake `res`, and only two enforce write-once headers

**Where.** tests/accounts.test.js:22, admin-students-route.test.js:20, openrouter-route.test.js:56, add-topic-route.test.js:15, topics-route.test.js:12, onboard-route.test.js:26, progress-user-routes.test.js:13, trial-routes.test.js:52 and :58, demo-route.test.js:34 (plus json-body, api-student-routing, progress-stats)

**Evidence.** A grep for `status(code) {` style fakes finds 12 test files that define their own response double. Only demo-route.test.js and trial-routes.test.js's `sseResponse` throw ERR_HTTP_HEADERS_SENT. There is no shared tests/helpers directory. CLAUDE.md names "a fake res that records a status instead of enforcing headers are written once" as the exact gap that hid a whole-server crash in #80. The other ten doubles would pass a handler that writes twice.

**Proposal.** Add tests/helpers/res.js with response() carrying status, json, setHeader, getHeader, writeHead, write and end, all write-once. Migrate the property-based doubles first (accounts, admin-students-route, add-topic-route, api-student-routing, onboard-route, progress-user-routes, topics-route, openrouter-route, progress-stats, trial-routes, demo-route). Fold sseResponse's event recording into the helper. Leave json-body.test.js and integration/lesson-persistence.test.js for a follow-up, since they assert through closure variables. Run the full suite once per batch.

**Risk.** Medium. Some handlers or tests may currently write twice, and the stricter double will expose that. That is the point, but budget time for fixing real double-writes. Run the whole suite after each file is migrated.

> Skeptic: Holds, with two corrections. The claim is accurate: on origin/main, only demo-route.test.js:37-39 and trial-routes.test.js:62-65 (sseResponse) throw ERR_HTTP_HEADERS_SENT. The other hand-rolled doubles do not: accounts:22, admin-students-route:20, openrouter-route:56, add-topic-route:15, topics-route:12, onboard-route:26, progress-user-routes:13, api-student-routing:17, progress-stats:196, trial-routes:52. tests/helpers/ does not exist. The risk the reviewer flagged turned out to be nil. I wrote a shared double with write-once headers in a scratch extract and moved 10 files onto it. The full suite stayed green with no handler double-writing, so the migration adds no fixes. Corrections: (1) the "12 files" count is loose. json-body.test.js:19,39 and integration/lesson-persistence.test.js:177 use closure variables (`status = code; sent = body`) rather than properties, so they need a small rewrite; trial-routes' sseResponse can also fold in once the helper records SSE events. (2) The saving is modest, about 35 net lines (52 deleted, 19 added, plus a 13-line helper). The real gain is guarding against the #80 duplicate-write crash across every route test, not line count.

### PLAT-9 (simplify, medium, hours, ~15 lines, confirmed): Adapters copy the tier, model, max-tokens and timeout logic instead of getting it from BaseLLMAdapter

**Where.** lib/adapters/openai.js:20-21,27-28,33,48; claude-sdk.js:12-13,27-29,42; ollama.js:12-13,17-18,33; claude-cli.js:13,18

**Evidence.** Three adapters repeat `const tier = options.model || 'cheap'; const model = tier === 'strong' ? this.strongModel : this.cheapModel;`. Three repeat `options.maxTokens || (tier === 'strong' ? 4096 : 1024)`. Two repeat `options.timeout || (tier === 'strong' ? 120_000 : 60_000)`, and the CLI has a third copy as 120_000. All four constructors set cheapModel and strongModel from options, env and a default. base.js holds only `name` and a throwing `generate`. PLAT-3 (Ollama ignoring `timeout`) is exactly the drift this copying invites. Callers that rely on the defaults are the pipeline, the bot and api/lesson.js.

**Proposal.** Apply it to OpenAI, SDK and Ollama only, and leave ClaudeCLIAdapter alone (it keeps its flat timeoutMs). Add a small `resolveCall(options, { cheapModel, strongModel })` helper, or a base method `_call(options)`, returning `{ tier, model, maxTokens, timeout }` with the existing 1024/4096 and 60_000/120_000 defaults. Keep each adapter's env var names in its own constructor, and keep the field names `cheapModel`/`strongModel`. Do not move model defaults into the base constructor, because the SDK default also lives in scripts/bot/config.js. Make Ollama's timeout fix (an AbortSignal.timeout in its fetch) a separate, explicit change under PLAT-3. Before refactoring, add a test per adapter that stubs fetch or the SDK client and asserts model, max_tokens and timeout for both tiers. SDK and Ollama have no generate() test today.

**Risk.** Low. Behaviour is identical, but keep each adapter's env var names (OPENAI_CHEAP_MODEL, CLAUDE_CHEAP_MODEL, OLLAMA_CHEAP_MODEL) in its own constructor.

> Skeptic: The duplication is real, but the finding overstates it in two places and the proposal as written would change CLI behaviour. Confirmed: OpenAI, SDK and Ollama each repeat the tier-to-model line (openai.js:27-28, claude-sdk.js:27-28, ollama.js:17-18). OpenAI, SDK and Ollama repeat the max-tokens default (openai.js:33, claude-sdk.js:29, ollama.js:33). OpenAI and SDK repeat the timeout default (openai.js:48, claude-sdk.js:42). OpenAI, SDK and Ollama also each set cheapModel/strongModel from options, env and a default; OpenRouter inherits this from OpenAI, with its own env names, so there are three constructors, not "all four". Ollama really ignores options.timeout (PLAT-3), which is the drift the finding describes. Corrections: (1) ClaudeCLIAdapter has no models and no tiers. It uses a flat 120_000 via the public constructor option `timeoutMs` (claude-cli.js:13,18), and its tier use is only `--effort low` for cheap. Routing it through `_call` would turn the cheap-tier timeout from 120s to 60s, so "behaviour identical" is false for the CLI. (2) If Ollama starts honouring `timeout` through `_call`, that is a deliberate bug fix (PLAT-3), not identical behaviour. Real callers pass timeout: pipeline.js:53, quick-start.js:100, api/_lib/demo.js:62. Saving is small, about 10-15 net lines, since a base helper plus constructor plumbing eats part of the savings. Worth doing mainly because it prevents the next drift, not for size. Nothing else uses these internals: grep for cheapModel/strongModel/_call over lib, api, scripts, tests and public finds only the adapters, openrouter.js, scripts/bot/config.js (its own copy of the Claude defaults), scripts/web/server.js:509 (reads the fields) and tests/adapters.test.js:146-202 (reads the fields). Field names must therefore stay `cheapModel`/`strongModel`.

### PLAT-11 (simplify, low, minutes, ~17 lines, not verified): The three CI `node -c` syntax-check steps duplicate what ESLint already fails on

**Where.** .github/workflows/ci.yml:45-61

**Evidence.** `npm run lint` runs `eslint lib scripts api` in the same job. Those directories contain every file the three loops check (lib/core, lib/adapters, scripts/bot, api and api/_lib), and the loops skip scripts/*.js and scripts/web. Verified in the extract: a syntax error appended to lib/adapters/ollama.js makes eslint exit 1 and `node -c` exit 1. The tests also import almost all of these files.

**Proposal.** Delete the three steps. It is a pure subset of the lint step. (Separate from TST-9, which asks for timeouts, permissions and concurrency.)

**Risk.** None.

### PLAT-2 (improve, medium, hours, not verified): The Claude CLI adapter runs inside the repo and inherits the operator's whole Claude Code environment

**Where.** lib/adapters/claude-cli.js:30-35

**Evidence.** `spawn('claude', ['-p','--no-session-persistence','--system-prompt',system,prompt,'--tools',''], {stdio})` sets no `cwd` and passes the full environment. The child therefore starts in the process's cwd, normally the repo root, where CLAUDE.md and AGENTS.md (maintainer workflow rules) sit. Per the installed `claude --help` (2.1.287), CLAUDE.md auto-discovery, settings hooks, plugins, auto-memory and MCP servers are the default, and only `--bare` skips them. `--tools ''` only removes built-in tools. Every Telegram or web call under the default `cli` backend (the fallback in createAdapterFromEnv) pays a full Claude Code startup. The operator's CLAUDE.md files and hooks can enter the tutor prompt. Any MCP server in the operator's settings is loaded, and anything that settings allow-list pre-approves is reachable from a student message. tests/bot/claude.test.js asserts the tools-off property but not this.

**Proposal.** Spawn with `cwd: os.tmpdir()` so the repo's CLAUDE.md is never discovered, and add `--strict-mcp-config` (no `--mcp-config` means no MCP servers) and `--disable-slash-commands`. `--bare` would be simpler but forces ANTHROPIC_API_KEY auth, which defeats the adapter's no-key purpose. Add a test that inspects the spawn arguments and options.

**Risk.** Low to medium. Check the flags on the minimum supported `claude` version. A user-level ~/.claude/CLAUDE.md is still read without `--bare`.

### PLAT-6 (improve, medium, hours, not verified): Streaming reader treats a mid-stream provider error, a truncation and an empty reply as success

**Where.** lib/adapters/openai.js:57-69, 71-106

**Evidence.** `_readStream` only reads `choices[0].delta.content` and `usage`. OpenRouter, the production backend, reports a failure after tokens have started as an SSE data frame `{"error":{...},"choices":[{"finish_reason":"error"}]}`. The reader skips it and returns the partial text as a normal result. `finish_reason: 'length'` (the cheap tier's 1024-token cap) is also dropped. `_readWhole` returns `''` for an empty `choices` array. ClaudeCLIAdapter throws on empty output (claude-cli.js:49-52), so adapters disagree. tests/adapter-streaming.test.js covers HTTP errors before the stream, not errors inside it. api/lesson.js grades and stores whatever text arrives.

**Proposal.** In `_readStream`, throw an error carrying `status` when a frame has a top-level `error`. In both readers, throw on empty text. Add tests for both cases. Optionally expose `finish_reason` so callers can see a truncated turn.

**Risk.** Low to medium. A turn that was silently accepted now fails, so check how api/lesson.js maps the thrown error (it already has a generic error event). The exact OpenRouter error-frame shape is recalled from its docs. Capture a real one first.

### PLAT-14 (improve, low, minutes, not verified): .env.example enables an unusable backend by default, and the bot's startup check ignores OPENTUTOR_LLM

**Where.** .env.example:4-5; scripts/bot/config.js:27-31; scripts/bot/claude.js:49

**Evidence.** .env.example has `OPENTUTOR_LLM=claude-sdk` and `ANTHROPIC_API_KEY=` active, not commented. A user who copies it to .env and adds only OPENROUTER_API_KEY (or runs `npm run host`, which calls loadEnvFile) still gets claude-sdk, because OPENTUTOR_LLM wins over key inference (lib/adapters/index.js:37-43). Every model call then fails with an SDK authentication error. config.js decides which keys are required from `CLAUDE_BACKEND || 'cli'` only. It never looks at OPENTUTOR_LLM, even though #98 made the bot use createAdapterFromEnv. The fail-fast check for a missing ANTHROPIC_API_KEY therefore never fires for the documented variable. OPS-10 and DOC-1 cover missing variables and the stale NOTE, not this default.

**Proposal.** Comment out the two uncommented lines in .env.example (OPENTUTOR_LLM and ANTHROPIC_API_KEY) so key inference works. In config.js derive the required key from the resolved backend, or drop the check and let the adapter constructor throw when its key is missing.

**Risk.** Low.

### PLAT-15 (improve, low, minutes, not verified): OpenRouterAdapter falls back to the deployment's key when a caller's key is empty, contradicting the guard in its parent class

**Where.** lib/adapters/openrouter.js:21 vs lib/adapters/openai.js:17-18

**Evidence.** OpenAIAdapter says a subclass that passes `apiKey` (even empty) must never inherit the OpenAI key, and implements that with `'apiKey' in options`. OpenRouterAdapter passes `options.apiKey || process.env.OPENROUTER_API_KEY`, so `new OpenRouterAdapter({ apiKey: '' })` or `{ apiKey: undefined }` silently uses the deployment's paid key. The student path (lib/core/llm-access.js:201, StudentOpenRouterAdapter) is protected today only by the `if (!apiKey) throw KeyRequired('reconnect')` at :198. That is the money boundary the code comments are most careful about.

**Proposal.** Use `'apiKey' in options ? options.apiKey : process.env.OPENROUTER_API_KEY`. Add a one-line test that an adapter built with an empty key sends no deployment key.

**Risk.** None, because no current caller passes an empty key.

### PLAT-16 (improve, low, hours, not verified): OpenAI adapter sends `max_tokens`, which OpenAI's newer model families reject

**Where.** lib/adapters/openai.js:33; .env.example:46-51; codex/README.md:38-42

**Evidence.** The request body always carries `max_tokens`. OpenAI's reasoning and GPT-5-class chat models answer HTTP 400 for it and require `max_completion_tokens`. This is from memory of OpenAI's API docs, not run here. The docs invite overriding OPENAI_STRONG_MODEL and OPENAI_BASE_URL, and the defaults (gpt-4o, gpt-4o-mini) work only for older models. OpenRouter and most compatible gateways still accept `max_tokens`. The adapter throws the provider's 400, so the failure is visible but the cause is not.

**Proposal.** When `this.baseURL` is api.openai.com, send `max_completion_tokens`. Alternatively, add an adapter option or env var to pick the field name. Add a body-shape test next to the existing OpenAI tests. Verify against a current OpenAI model first.

**Risk.** Low. Keep `max_tokens` for every other base URL.

### PLAT-17 (improve, low, minutes, not verified): CLAUDE.md and docs still point at scripts/bot/research.js, which no longer exists, and omit three scripts

**Where.** CLAUDE.md:20 and :59; docs/curriculum-generation.md:243

**Evidence.** `ls scripts/bot` has no research.js (research now lives in lib/core/research.js and scripts/bot/curriculum.js imports it). CLAUDE.md:59 still lists `│   │   ├── research.js  # 8-source research` under the bot, and docs/curriculum-generation.md:243 lists `scripts/bot/research.js` as the bot-level research pipeline. The CLAUDE.md scripts tree also omits scripts/deploy-vercel.js, scripts/build-claude-web-skill.js (which has its own npm script) and scripts/web/host.js (which has `npm run host`). OSS-5 and DOC-1 cover other stale claims in these files. This is a different set.

**Proposal.** Delete the research.js line from the bot tree, point docs/curriculum-generation.md:243 at lib/core/research.js, and add the three missing scripts to the tree with one-line comments. An existing-paths check like the one in tests/integration/agent-platforms.test.js, run over CLAUDE.md's tree, would stop this recurring.

**Risk.** None.

## The test suite

The suite is healthy: on origin/main, in an extract with git init, 91 files and 1353 tests pass in about 6.8 s wall, and also pass under TZ=UTC, America/Los_Angeles and Pacific/Kiritimati. Most tests are behavioural: real stores, real HTTP and real route code, with fakes only at the edge. The real weaknesses are different. (1) Some auth assertions check the wrong property. In a mutation sample of 258 mutants over 10 security- and state-critical files, 213 were killed. accounts.js was the worst, with 15 of 30 surviving; auth.js (CSRF) and student-auth.js had gaps too. (2) The suite is not hermetic. Ambient env vars break 1 to 45 tests and can make tests write into a developer's real OPENTUTOR_DATA_DIR; a 5-line vitest.config.js change, which I verified, fixes this. (3) Five files leak temp dirs on every run; this machine has about 8.9k leftover ot-* dirs. (4) Wall time is dominated by one 5 s real wait in host.test.js. (5) There is a lot of copy-pasted harness: 5 real-server launchers, 14 fake `res` objects, 5 hand-rolled async stores, 4 DOM doubles and 3 PostgREST doubles. Only 2 of the 14 fake `res` objects enforce the headers-once rule that CLAUDE.md asks for. Lower-value items: dead mocks, tests coupled to shipped course content, and mock-only or regex-over-prose tests. Already tracked and not repeated: TST-1..10, #296 (simulations, no browser tests, fixed /tmp paths, no coverage tool), DATA-2, OSS-11. Each proposal below also lists what a regression would still need to break.

### TEST-1 (bug, high, minutes, confirmed): The cross-origin test asserts `.forbidden`, not `.ok`, so a CSRF regression that lets the request through still passes

**Where.** tests/accounts.test.js:175-182; api/_lib/auth.js:93; tests/student-signin.test.js:42; lib/core/student-auth.js:27

**Evidence.** Mutation run: each mutant was applied alone and the full suite run with `vitest run --bail 1`. Changing `return {ok:false,forbidden:true,reason:'Request origin is not allowed.'}` to `ok:true` at auth.js:93 left all 1353 tests green. The test 'enforces origin on cookie-auth mutations...' only asserts `.forbidden` is true, and the mutant still returns `forbidden:true`. Every route gates on `auth.ok` (for example api/_lib/openrouter.js:23). So nothing proves a cross-site POST carrying an account cookie is refused. The same mutation run found a second case: deleting `if (!match) return null` at student-auth.js:27 also passes. `auth('otst_../../bob.bad')` then throws a TypeError, which authenticateRequest turns into `misconfigured` (a 503 'sign-in unavailable'). The test only asserts `.ok === false`, so a bad token is reported as an outage and the suite stays green.

**Proposal.** None needed. As proposed: in accounts.test.js assert `expect(result).toMatchObject({ok:false, forbidden:true})` and `authFailure(result).status === 403`; in student-signin.test.js assert `authFailure(await auth('otst_../../bob.bad')).status === 401` or `misconfigured` is undefined.

**Risk.** None to production. Two assertions get stricter.

> Skeptic: Confirmed. Both mutants survive the full suite. The cited code and assertions are as described. The weak assertions are accounts.test.js:175-190 (`.forbidden` only, with `ok` unchecked on the evil-origin call) and student-signin.test.js:42 (`.ok === false` only). The proposal is safe: it only tightens two assertions and changes no production code. Two small notes. The accounts.test.js assertion should be on the whole result: `toMatchObject({ok:false, forbidden:true})`, then `authFailure(result).status === 403`. In the 5 existing route-level origin tests (accounts.test.js:100, 372; openrouter-route.test.js:175), none caught mutant 1 in practice. Mutant 1 should not become a stand-alone 'cross-origin returns 403' test in openrouter-route, because that file's route-level check also passes under the mutant.

### TEST-3 (bug, medium, minutes, confirmed): The suite is not hermetic: ambient env vars break up to 45 tests, and OPENTUTOR_DATA_DIR makes tests write into the developer's data dir

**Where.** vitest.config.js:1-7; tests/adapters.test.js:78-83 (compare tests/bot/claude-backend.test.js:36-43)

**Evidence.** vitest.config.js sets only TELEGRAM_BOT_TOKEN. Ran the unmodified suite with one variable exported at a time: OPENTUTOR_DATA_DIR (the documented test-mode var in CLAUDE.md) fails 45 tests in 11 files (accounts, add-topic-route, api-student-routing, core-progress, readonly-filesystem, student-signin, students, tenancy, topic-builds, topic-levels, workspace-seeding). The run also created students/alice, students/0, students/42 and acct-* directories inside the exported data dir, so tests pollute it. OPENTUTOR_PUBLIC_URL fails 29 (accounts, openrouter-route). OPENTUTOR_TRIAL_CALLS_PER_DAY=0 fails 15 (llm-access, onboard-route, trial-routes). CLAUDE_BACKEND=sdk fails 5 files at import. Any of ANTHROPIC_API_KEY, OPENROUTER_API_KEY or OPENAI_API_KEY fails adapters.test.js:78 'defaults to CLI', which deletes only 2 of the 6 vars that createAdapterFromEnv reads. A shell with a provider key exported makes `npm test` fail with no hint why.

**Proposal.** Keep the proposal. To avoid a stale list, derive the blank set from a `git grep` of `process.env.X` rather than hand-maintaining it. Optionally add a comment in vitest.config.js telling authors to add any new env var they read to the list. Also switch adapters.test.js:78-83 to vi.stubEnv, as tests/bot/claude-backend.test.js does, so that file does not depend on the config.

**Risk.** A test that relied on an inherited var would now see ''. The scratch run shows none does.

> Skeptic: Confirmed. vitest.config.js on origin/main sets only TELEGRAM_BOT_TOKEN, so ambient env vars leak into the suite. My counts differ slightly from the finding because main has moved to 1327 tests, and my archive extract has a baseline of 5 unrelated failures from having no .git directory. Net of that baseline, OPENTUTOR_DATA_DIR breaks 42 tests, OPENTUTOR_PUBLIC_URL 29, OPENTUTOR_TRIAL_CALLS_PER_DAY 15, and each of the three provider keys breaks 1 (adapters.test.js 'defaults to CLI'). The data dir was polluted with a `workspace` directory in my run; the finding also reported students/* and acct-* directories, which I did not separately see. Blanking the vars in vitest.config.js fixes every case, and the data dir stays empty. The fix is low risk: the code treats '' as unset.

### TEST-4 (bug, medium, hours, ~90 lines, confirmed): Five test files never delete their temp directories, and 41 files hand-write the same mkdtemp/rm pair

**Where.** tests/core-state.test.js:10-17; tests/web-lesson-async-store.test.js:52; tests/lesson-mood.test.js:13; tests/lesson-options.test.js:42; tests/readable.test.js:80

**Evidence.** core-state.test.js creates a dir in beforeEach but its afterAll removes only the last one. The other four files have no cleanup at all (readable.test.js:80 leaks one per demoLesson() call). Diffing os.tmpdir() before and after one full `vitest run` showed 49 new dirs: ot-core-state 19, ot-options 11, ot-links 10, ot-mood 5, ot-async-store 4. This machine's tmpdir holds 8,905 `ot-*` dirs from past runs. 41 of 91 files repeat `mkdtempSync` in beforeEach and `rmSync(... {recursive,force})` in afterEach. A scan for mkdtemp without a matching rm found exactly these 4 files plus core-state (partial).

**Proposal.** Fix only the 5 leakers. Add a small tests/helpers/tmp.js using onTestFinished and use it in those files. For core-state, change afterAll to afterEach. For the other 37 files, convert them only when they are touched, and keep their own afterEach where it also closes a store, unstubs env or thaws a chmod. That keeps readonly-filesystem and supabase-store-persistence unchanged. Before relying on the helper in a beforeEach, confirm it works there: run one converted file and count the ot-* dirs left behind.

**Risk.** Low. Tests that chmod a dir read-only (readonly-filesystem, supabase-store-persistence) need their thaw step to run first; keep their own afterEach.

> Skeptic: The leak is real, but it is test hygiene, not a user-facing bug. Rate it improve/low rather than bug/medium. The cited code says what the finding claims. tests/core-state.test.js:10-17 creates a new dir in every beforeEach but afterAll removes only the last one. The other four files create dirs with no cleanup at all: web-lesson-async-store.test.js:52, lesson-mood.test.js:13, lesson-options.test.js:42 and readable.test.js:80. readable.test.js:80 sits inside demoLesson(), so it leaks one dir per call. Nothing in vitest.config.js sets up a global teardown. The proposed helper is feasible: vitest is 4.1.11, which has onTestFinished. Two details are loose. The "41 files repeat the pair" figure counts every file that calls mkdtempSync; 37 of the 41 also call rmSync, and the other 4 are the leakers. I did not re-run the before/after tmpdir diff, so the per-run figure of 49 new dirs is unconfirmed.

### TEST-12 (dead-code, low, minutes, ~35 lines, confirmed): Dead vi.mock calls, unused imports and variables, a duplicate object key, and mock paths nothing touches

**Where.** tests/research-parse.test.js:3-11; tests/bot/spaced-repetition.test.js:9-11,21-23,29; tests/bot/lesson.test.js:3,17-20; tests/adapters.test.js:1; tests/readable.test.js:386; tests/workspace-seeding.test.js:20; tests/web-connect.test.js:21,1545; tests/simulations/run.js:18

**Evidence.** Method: an eslint run over tests/ with no-unused-vars and no-dupe-keys (the repo's eslint.config.js covers lib, scripts and api only), plus a script that walks each test's static import closure and lists vi.mock targets that no non-mocked module in it imports (the one false positive, api-student-routing's dynamic `import(`../api/${name}.js`)`, was checked by hand). Results: research-parse.test.js mocks scripts/bot/config.js and logger.js, but lib/core/research.js imports only pino. spaced-repetition.test.js mocks config.js and logger.js, but spaced-repetition.js imports only ./state.js, and its `getDueReviews` import is never called. bot/lesson.test.js mocks scripts/bot/context.js, which lesson.js does not import, and imports `path` unused. adapters.test.js imports beforeEach unused. readable.test.js:386 `const start` is never read. workspace-seeding.test.js:20 `progressFile` is never used. web-connect.test.js:21 repeats `dispatch` in one literal (no-dupe-keys error) and :1545 `for (const _ ...)` is unused. simulations/run.js:18 imports formatStudentModel unused. The fixed '/tmp/...' strings in research-parse, spaced-repetition and bot/lesson.test.js are mock values that are never opened (lesson.test.js mocks all of fs), so only bot/session.test.js and bot/state.test.js really write fixed /tmp paths.

**Proposal.** Delete the dead mocks and imports as proposed. Remove the duplicate `dispatch` at web-connect.test.js:21 and the unused locals, plus the three extra hits (students.js:43 `lessonPlan`, web-connect.test.js:1005 and 1205 `init`). Rewrite the `for (const _ ...)` loop at :1545, or add `varsIgnorePattern: '^_'`. Then add a `tests/**` block to eslint.config.js and change the lint script in package.json to `eslint lib scripts api tests`. Otherwise the new rule is never run, or it fails CI on the leftover hits.

**Risk.** None.

> Skeptic: Holds. Every cited item is real on origin/main. I ran eslint with no-unused-vars and no-dupe-keys over tests/ on a scratch extract. It reported the unused imports and variables at all the cited locations and the duplicate `dispatch` key (web-connect.test.js:20-21). The dead mocks check out by reading the sources. lib/core/research.js imports only pino, and scripts/bot/spaced-repetition.js imports only ./state.js, which the test mocks. scripts/bot/lesson.js does not import context.js, and nothing else in lib/ or scripts/ references bot/context. In the scratch copy I removed the config and logger mocks from research-parse and spaced-repetition, the context.js mock and the `path` import from bot/lesson, and the unused `getDueReviews` import. All 24 tests in those three files still passed. The proposal's lint step needs two more things. First, `npm run lint` is `eslint lib scripts api`, so a `tests/**` entry in eslint.config.js does nothing until package.json's lint script includes tests. Second, the same eslint run flagged more than the finding lists: `lessonPlan` (tests/simulations/students.js:43), unused `init` args (web-connect.test.js:1005 and 1205), and `for (const _ ...)` at :1545, which is a var, not an arg, so `argsIgnorePattern: '^_'` does not cover it (it would need `varsIgnorePattern: '^_'`). Those must be fixed or ignored first, or lint goes red. The line estimate (about 35) is about right. I did not check the fixed-/tmp narrowing for session.test.js and state.test.js.

### TEST-6 (simplify, medium, hours, ~120 lines, confirmed): Five files each boot the real web server with their own copy of the port-probe, ready-wait and spawn code

**Where.** tests/web-body-limit.test.js:23-87; tests/security-headers.test.js:21-62; tests/web-error-text.test.js:23-47; tests/web-lesson-server.test.js:54-92; tests/progress-stats.test.js:167-185

**Evidence.** getFreePort() is copied in web-body-limit:23 and security-headers:21, written as `freePort` in web-error-text:23, and inlined as `probe = net.createServer()...` in web-lesson-server:56 and progress-stats:167. waitForServer is copied in two files (web-body-limit:34, security-headers:32); the other three wait for the 'running at' or 'Topics loaded' stdout line instead, so there are 3 variants of the ready check. Each repeats the `spawn(process.execPath, ['scripts/web/server.js'], { cwd: ROOT, env: { PATH, HOME, OPENTUTOR_PORT, OPENTUTOR_HOST, OPENTUTOR_DATA_DIR ... } })` call and the comment about never inheriting the parent env. web-body-limit.test.js:19 also hard-codes `LIMIT = 1_048_576` with the note 'must match scripts/web/server.js', which is BODY_LIMIT at server.js:439.

**Proposal.** Add tests/helpers/server.js exporting freePort() and startServer({ env, dataDir, ready = 'running at', stdio }). It would:
- take dataDir from the caller, or mkdtemp one when omitted;
- keep the explicit PATH/HOME-only base env and add the caller's env on top;
- resolve on the given ready substring, with 'Topics loaded' passed explicitly by web-error-text;
- return { base, port, child, log, stop }, with stop doing kill plus rmSync.

Convert the five files. Leave the mkdtemp helper out of this change. For the body limit, keep LIMIT in web-body-limit but drop the 'must match' comment and add one assertion that a body of LIMIT - 10_000 is accepted and LIMIT + 10_000 gets 413. The test already does this. Do not export BODY_LIMIT from server.js.

**Risk.** Low. Keep the explicit env list in the helper, since it keeps a developer's .env out of the child.

> Skeptic: The duplication is real, but the proposal needs three adjustments: a pluggable ready line, a caller-supplied dataDir, and no export from server.js. The 5 spawn sites are the only ones in tests/ (grep spawn( finds exactly these). I estimate about 60-80 net lines could go. The existing tests cover it, since the 5 files are themselves the tests, and no new test is needed.

### TEST-7 (simplify, medium, hours, ~70 lines, confirmed): Five hand-rolled in-memory 'Supabase-shaped' stores, plus three copies of the same asAsync Proxy, where the real TutorStore already works

**Where.** tests/web-lesson-async-store.test.js:23-47; tests/lesson-mood.test.js:19-29; tests/lesson-options.test.js:22-37; tests/readable.test.js:86-94; tests/integration/lesson-persistence.test.js:31-53; asAsync in tests/web-lesson-planner.test.js:17, web-lesson-block.test.js:15, onboard-route.test.js:63

**Evidence.** The same 11 methods (readKV/writeKV/insertKV/deleteKV/readUser/readProgress/updateProgress/readCurriculum/getNextLesson/markLessonComplete/readDomainFile) are re-implemented in five files. The fakes drift from the real store: `updateProgress(fn){ const p={history:[]}; fn(p); return p; }` drops every write, and lesson-mood's `getNextLesson` returns lessons[0] forever and never advances. Three other files already wrap the real TutorStore in `new Proxy(store, {get: (t,k) => typeof t[k]==='function' ? async (...a)=>t[k](...a) : t[k]})` to get async behaviour with real semantics. I prototyped this on lesson-mood.test.js: replacing its 10-line fake with that Proxy over `new TutorStore(root)` kept all 5 tests passing.

**Proposal.** Narrow TEST-7 to the following.

1. Add tests/helpers/stores.js exporting asAsync, and delete the three local copies (planner, block, onboard-route).
2. Replace the fakes in lesson-mood.test.js and lesson-options.test.js with asAsync(new TutorStore(root)).
3. Optionally convert readable.test.js, but only if a small kv.get/kv.set/iterate wrapper is acceptable.
4. Leave tests/integration/lesson-persistence.test.js hand-written. It deliberately simulates a Supabase-like store with partial failures.
5. Leave web-lesson-async-store.test.js hand-written, or make the helper hide db so the #94 guard survives (get returns undefined for 'db').

Estimated saving is about 50-60 lines.

**Risk.** Low. The lesson-persistence 'read-only' behaviour must stay injected, not real.

> Skeptic: The core of TEST-7 holds: the three identical asAsync Proxy copies should be deduped into a shared helper, and the hand-rolled fakes in lesson-mood and lesson-options can be replaced by asAsync(new TutorStore(root)). Two of the five proposed targets should not be converted. tests/integration/lesson-persistence.test.js is built on synthetic failure injection that a real store cannot reproduce. tests/web-lesson-async-store.test.js is a regression guard for #94 that the Proxy would defeat. The drift claim is accurate. updateProgress(fn) drops writes in all four fakes that have it, and lesson-mood and lesson-options return lessons[0] forever from getNextLesson. Realistic saving is about 50-60 lines, not a full five-file rewrite.

### TEST-8 (simplify, medium, hours, ~65 lines, confirmed): 14 files define their own fake `res`; only 2 enforce the write-headers-once rule that CLAUDE.md says caused a server crash

**Where.** tests/add-topic-route.test.js:15; api-student-routing.test.js:17; accounts.test.js:20-37; admin-students-route.test.js:22; json-body.test.js:19,39; onboard-route.test.js:26; openrouter-route.test.js:56; progress-stats.test.js:196; progress-user-routes.test.js:13; topics-route.test.js:12; integration/lesson-persistence.test.js:177; (enforcing ones: demo-route.test.js:34, trial-routes.test.js:59-62)

**Evidence.** CLAUDE.md: the #80 change passed 378 tests while a duplicate request took the server down because 'the route tests' fake res recorded a status instead of enforcing that headers are written once'. Today 12 of the 14 route fakes still only record `statusCode` and `body`. Only demo-route.test.js `response()` and trial-routes.test.js `sseResponse()` throw ERR_HTTP_HEADERS_SENT. All 14 repeat the same `status(code){this.statusCode=code;return this}` and `json(b){this.body=b;return this}`.

**Proposal.** Add one tests/helpers/res.js `fakeRes()`. It should have `setHeader`, `getHeader`, `status`, `json`, `end` and a `headersSent` flag, and it should throw on any header write or `json()` after the first send. Migrate the 11 non-enforcing fakes plus trial-routes.test.js:52 to it. Leave demo-route's `response()` and trial-routes' `sseResponse()` alone, since they model SSE streaming (`writeHead`/`write`) and are already enforcing. Keep a `statusCode` and `body` shape compatible with the existing `toMatchObject({statusCode, body})` assertions. json-body.test.js captures the status and body into local variables, so it needs a small change. Add one unit test for the helper that checks a second `json()` throws. Do the migration file by file, since the suite stays green throughout.

**Risk.** Low. A route test that currently double-sends will newly fail, which is a real bug to fix, not a test problem.

> Skeptic: The finding holds as stated, as a simplification plus a guard against a known failure class. Two limits on its value: it will not turn up a live bug today, and the net saving is small, about 30-45 lines. The duplication is real: 11 test files define their own fake `res` that only records `statusCode` and `body`. trial-routes.test.js:52 has a further non-enforcing `res` (no `headersSent` flag) alongside its enforcing `sseResponse()`. Only demo-route.test.js:34-39 and trial-routes.test.js:59-63 throw ERR_HTTP_HEADERS_SENT. There is no tests/helpers/ directory and no shared fake res anywhere on origin/main. The #80 failure was a handler writing headers twice on a duplicate request. The server guards against that at scripts/web/server.js:186 and :467 through `res.headersSent`, which the recording fakes cannot model. I found nothing tracking this: no open issue title, and nothing in issues.md. The proposal also asks to "run the suite once with it to see whether any route double-writes". I did that experiment (below) and no route does. If it is filed, the issue should be framed as protection against regression, not as a bug hunt.

### TEST-9 (simplify, medium, hours, ~90 lines, confirmed): Four vm-based DOM doubles repeat the same loader, and web-connect.test.js repeats its own helpers inside one file

**Where.** tests/web-connect.test.js:7-57,283,873-874,962-963; tests/web-topic-recovery.test.js:7-74; tests/web-welcome-demo.test.js:6-51; tests/web-login.test.js:6-29

**Evidence.** All four read an HTML file and a JS file, build `new Map([...html.matchAll(/id="..."/g)].map(... element()))`, make a `vm.createContext` with `document.querySelector`, `location`, `history`, `Response` and `fetch`, and define `settle`. web-connect and web-topic-recovery copy the same ~25-line element factory (classList over a Set, listeners Map, `click`, `focus`, `appendChild`, `replaceChildren`, `matches: () => false`). `settle` is defined three times as 6 setImmediate ticks and once (web-topic-recovery:74) as 1 tick. Inside web-connect.test.js: `dispatch` is defined twice in one object literal (lines 20-21, an eslint no-dupe-keys error); `LESSON_START` (:873) and `LESSON` (:962) are the same object; `lessonWith` (:874), `startedLesson` (:963) and `lastStep` (:283) are three versions of 'pick topic demo, click Next, settle'; and the chat-course-offer route table plus `offer.children[0].click()` is repeated about 10 times.

**Proposal.** Do it in two steps.

Step 1, inside web-connect.test.js only (zero cross-file risk):
- Delete the duplicate `dispatch` line.
- Delete `LESSON` and use `LESSON_START`.
- Fold `lessonWith` and `startedLesson` into one `startLesson(first, next)` helper.
- Add one `chatOfferRoutes(course, extra)` helper for the `/api/chat` offer route.

Step 2, share only the learn.html element factory and the 6-tick `settle` through tests/helpers/ for web-connect and web-topic-recovery.
- The factory must keep `focus()` setting both `this.focused = true` and the shared closure, or take a hook, so that topic-recovery:91 and web-connect's `focused()` both pass.
- Keep each file's own `vm.createContext`. The globals differ too much to merge into a generic `loadPage`; the topic-recovery `window` object and its `setTimeout` return value are two examples.
- Moving topic-recovery's `settle` from 1 tick to 6 should be safe, but run that file's tests, because it asserts `timers` has length 0 at :84.
- Leave login and welcome-demo alone beyond importing `settle`.

**Risk.** Low. Do not merge the welcome-demo element (it exposes `href`, `hidden`, `tagName`), only its loader.

> Skeptic: Holds as a medium simplify, but it is smaller than stated. The in-file duplicates in web-connect.test.js are the clear win. The cross-file loader merge is a modest gain with some real differences to keep.

Confirmed:
- web-connect.test.js:20-21 defines `dispatch` twice, identically. eslint does NOT flag it: eslint.config.js lints only lib/, scripts/ and api/, and enables only no-unused-vars. Drop the "eslint no-dupe-keys error" wording.
- `LESSON_START` (:873) and `LESSON` (:962) are byte-identical objects.
- `lessonWith` (:874) and `startedLesson` (:963) are the same start-a-lesson routine. They differ only in answer handling: `replies.shift()` versus a fixed `next`. `lastStep` (:283) is a third variant with a different start payload.
- The element factory is copied in web-connect.test.js:12-25 and web-topic-recovery.test.js:11-26. It is the same except for the points below.
- `settle` is defined in 4 files: 3 as 6 ticks (web-connect:57, web-login:29, web-welcome-demo:51) and 1 as one tick (web-topic-recovery:74).

Overstated or different:
- The offer route table with `/api/chat` returning a `course` offer appears about 8 times (lines 1158-1850). Variants differ: `model: 'm'` is sometimes absent, and `offers.shift()` is used where others use a fixed object. Only 3 places do `offer.children[0].click()` (1196, 1221, 1536); line 1546 is already a helper. "About 10 times" is loose.
- The four loaders do not share much beyond reading html and script and building the id map. The `vm.createContext` globals differ in each file.
  - web-login has no Headers, no ResizeObserver and no timers.
  - web-welcome-demo has its own element type, plus storage that may throw.
  - web-topic-recovery sets `window: { fetch, location }` rather than `context.window = context`. It also has a `setTimeout` that returns `timers.push(...)`, which is a number, not 0.
  - The `focus` semantics differ. web-connect uses a closure `focused()`. topic-recovery sets `element.focused` and asserts on it at :91.

Estimated saving: about 25 lines for the shared element factory, 10-15 for the loader, and about 25-40 inside web-connect (the duplicate key, `LESSON`, the lesson-start helpers and the offer routes). Total roughly 60-90 lines.

### TEST-10 (simplify, low, a day, ~65 lines, not verified): Three separate PostgREST doubles with different fidelity; one of them has a no-op delete

**Where.** tests/integration/supabase-store-persistence.test.js:27-83 (builder-level fake, `delete: () => builder` at :71); tests/supabase-store-errors.test.js:19-46 (HTTP-level); tests/generated-topics-supabase.test.js:15-30 (HTTP-level, inline)

**Evidence.** Three implementations of 'enough PostgREST to serve SupabaseStore'. The first fakes the query builder, so it never exercises the real client's serialisation, and its delete does nothing. The other two put a fake `fetch` under the real `createClient`, so they do. Each implements upsert, eq/like filters and single-row behaviour separately; only the first enforces the 1000-row cap (#137) and the required `order()` before `range()`, and only the second returns the 406 for `.single()`. A SupabaseStore change must be proven against three fakes that disagree.

**Proposal.** One HTTP-level double in tests/helpers/postgrest.js that takes `{ failing, maxRows }` and implements eq/like/lt/gte, upsert with `on_conflict`, PATCH, DELETE, `.single()` 406, the row cap and the order-before-range rule. Port the three files to it. This is a consolidation of existing coverage, not DATA-2's call to test against a real Postgres.

**Risk.** Medium. The cap and paging tests are the #137 regression guard; port them first and check each still fails when the paging code is broken.

### TEST-11 (simplify, low, hours, ~100 lines, not verified): The 'demo' course fixture, the lesson PLAN, the BLOCK-feedback builder and the store-backend list are copied across many files

**Where.** tests/web-lesson.test.js:12,28-35; web-lesson-async-store.test.js:14; web-lesson-planner.test.js:15; web-lesson-block.test.js:14; web-lesson-pedagogy.test.js:12; lesson-mood.test.js:9; lesson-options.test.js:10; readable.test.js:53; trial-routes.test.js:29; voice.test.js:9; web-lesson-server.test.js:20; (formatPracticeFeedback BLOCK builders in web-lesson-planner, web-lesson-server, readable, trial-routes, deliberate-practice-retest); (backends arrays in core-progress:35, students:19, tenancy:21, workspace-seeding:25, readonly-filesystem:30)

**Evidence.** A PLAN object is declared in 13 files (differing only by retrieval/diagnostic text). The block that writes `skills/tutor/domains/demo/curriculum.json` into a tmp root is in 14 files. A `formatPracticeFeedback({ timestamp, observations: [], directives: [BLOCK...], model: { recentAccuracy: 0.5, trend: 'steady', difficulty: {level:3,label:'standard'}, engagement: 'steady', concepts: {shaky: []} } })` call appears in 5 files. The `[['TutorState', ...], ['TutorStore', ...]]` backend list is in 5. The account user `{ id: '11111111-1111-4111-8111-111111111111', email_confirmed_at ... }` is in 5 (accounts, openrouter-route, llm-access, trial-routes, onboard-route).

**Proposal.** `tests/helpers/fixtures.js` exporting `demoRoot({ lessons, files })` (using TEST-4's tmpRoot), `PLAN`, `blockFeedback(concept)`, `BACKENDS`, `user(n)`. Convert only files where three or more repeat the same text, as listed. Leave per-test variants (the retrieval/no-retrieval PLAN) as overrides.

**Risk.** Low.

### TEST-14 (simplify, low, hours, ~170 lines, not verified): Tests that check the mocks, or only that something exists, in the bot suite

**Where.** tests/bot/lesson.test.js:5-176; tests/bot/logger.test.js:4-24; tests/bot/config.test.js:11-46; tests/bot/spaced-repetition.test.js:33-98

**Evidence.** bot/lesson.test.js mocks 12 modules plus all of `fs`, then asserts mock return values: 'sends completion message' and the BLOCK test (which sets `applyDirectives.mockReturnValueOnce`) are decided by the mocks. `getLessonContext('test-topic',1)` is only checked to echo its own input. bot/lesson-lifecycle.test.js already runs the same lesson flow against the real state, prompts, student-model and practitioner (it covers BLOCK review end to end); only the #146 plan-prompt-args test and the `stripAnswerKey` unit are unique. logger.test.js: 3 of 6 tests assert `typeof logger.info === 'function'` or `toBeDefined`, and 'provides correlation id' asserts only `typeof log.info` inside the callback, never the id. config.test.js asserts export shape and `typeof ... 'string'` only. spaced-repetition.test.js covers 'wrong' and 'easy' but not the 'hard' branch or getDueReviews' sort and limit directly (poll-grading.test.js covers the easy and wrong paths through the router).

**Proposal.** Move the #146 test and the stripAnswerKey unit into lesson-lifecycle.test.js and delete lesson.test.js (about 150 lines). Delete the typeof-only logger tests (about 20 lines). Add a 'hard' case and one getDueReviews ordering/limit test to spaced-repetition.test.js. Consider replacing the bot/lesson.js tests with ones that go through the shared lessonTurn when #295 lands.

**Risk.** Low. Check the coverage of the deleted BLOCK-last-lesson case (#235) in lesson-lifecycle first; add it there if it is missing.

### TEST-17 (simplify, low, minutes, ~45 lines, not verified): The same bot logger mock is pasted into 13 test files

**Where.** tests/bot/chat.test.js:11; state.test.js:16; helpers.test.js:3; lesson.test.js:78; onboarding.test.js:15; claude-backend.test.js:30; spaced-repetition.test.js:21; session.test.js:8; poll-grading.test.js:20; lesson-lifecycle.test.js:39; callbacks.test.js:27; commands.test.js:38; router.test.js:27 (also progress-stats.test.js:22)

**Evidence.** `vi.mock('../../scripts/bot/logger.js', () => ({ log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }))` appears in 13 files, with small differences (chat and onboarding mock only info and error; router adds `runWithReqId`). A module under test that later calls a method one file left out (`log.warn`) throws in that file only.

**Proposal.** Add `test.setupFiles: ['tests/setup.js']` containing the single logger mock (with `log`, `logger` and `runWithReqId`), and delete the 13 blocks. tests/bot/logger.test.js imports the real module and needs `vi.unmock`; keep it that way.

**Risk.** Low. A test that spies on `log.error` can still import the mocked `log`.

### TEST-2 (improve, high, hours, not verified): Trust-boundary branches in accounts.js, openrouter.js and progress.js are not exercised by any test

**Where.** lib/core/accounts.js:52,54,61,68,143,169,183; api/_lib/openrouter.js:20,48; lib/core/progress.js:175; api/_lib/demo.js:64

**Evidence.** Same mutation method as TEST-1. In accounts.js 15 of 30 sampled mutants survived, in openrouter.js 5 of 27, in progress.js 7 of 25 (auth.js 18/20 and admin-auth.js 12/13 were killed, for contrast). Survivors with real behaviour change (message-only equivalents were excluded): accounts.js:143 `error || !data.user?.email_confirmed_at` changed to `&&`, so a session for an unconfirmed email is accepted by verifyAccountRequest. accounts.js:61 `return false` changed to true, so sameOrigin passes when the Host is invalid or missing; the Host regex at :54 is untested too. accounts.js:183 recoveryCallback's `flow?.intent === 'recovery'` flipped: a non-recovery flow cookie is never tested against the recovery grant. accounts.js:169 `!body||!sig` on the signed flow cookie. accounts.js:52 and :68, the documented OPENTUTOR_PUBLIC_URL pin (docs/deployment.md:136): the only test mention is a `stubEnv('')` in demo-route.test.js:16. openrouter.js:20 (405) and :48 (OAuth `code` not a string, empty, or longer than 2048). progress.js:175 `if (existing[slug]) return null`: removing it lets the legacy-completion migration overwrite existing runtime completions, and CLAUDE.md names migrations as review priority. demo.js:64 `if (!reply) throw`: an empty model reply on the public demo route is returned as 200.

**Proposal.** Add about 10 table-driven cases of 1-3 lines each: unconfirmed user via verifyAccountRequest; `originFor`/`sameOrigin` with a missing Host, a Host like `evil.com/x`, and OPENTUTOR_PUBLIC_URL set; recoveryCallback with a signed `signup` flow; readFlow with tampered, short and expired values; openrouter route with PUT and with a non-string, empty or 3000-char code; migrateCompletionsFromContent with existing completions; demo with an empty reply.

**Risk.** None. New tests only. A few mutants may be equivalent; check each against the code before adding a case.

### TEST-5 (improve, medium, hours, not verified): One real 5-second wait is 5.0 s of the 6.8 s suite wall time; another file copies 293 domains five times

**Where.** tests/host.test.js:123-127; scripts/web/host.js:49-52; tests/setup-agent-boot.test.js:14-57; scripts/setup.js:138,161,227

**Evidence.** Per-test timings from `vitest run --reporter=json`: host.test.js 6.66 s as a file, with 'stops and says what to do about a lock a crash left behind' taking 5028 ms because withLock really polls for 5 s (`Date.now() - since > 5000`, `Atomics.wait` 20 ms). The 12-process concurrency test next to it adds 1.6 s. setup-agent-boot.test.js takes 2.4 s for 5 tests: each setupAgentSkills call runs `fs.cpSync` of skills/tutor, which includes the 293 domains (0.4-0.6 s per call). Everything else finishes under 1.5 s, so these two files set the wall time.

**Proposal.** Give ensurePasswords an optional `{ lockWaitMs = 5000 }` and pass 50 in the lock test (the error text and behaviour stay the same). For setup-agent-boot, either stub SKILL_DIR to a 2-file fixture or call setupAgentSkills once and assert all five facts on the result. Expect wall time to drop to about 2.5 s.

**Risk.** Low. The lock test must still prove a stale lock is reported and the .env is unchanged.

### TEST-13 (improve, medium, hours, not verified): Logic tests assert exact titles, counts and names from shipped course content, so the planned content audit will break them

**Where.** tests/welcome.test.js:39-40; tests/progress-stats.test.js:100; tests/chat-course.test.js:15,49,90,101; tests/topic-levels.test.js:21-26; tests/web-lesson-server.test.js:25,108

**Evidence.** welcome.test.js builds `new TutorStore(ROOT)` over the real repo and expects `{ slug: 'game-theory', topic: 'Game Theory', completed: 2, total: 29, next: { day: 3, title: "Why don't both prisoners stay silent?" } ...}` and `amateur-radio` with `total: 27` and its full topic title. progress-stats.test.js:100 expects `total: 29`. chat-course.test.js matches against the real catalog for 'game theory'. topic-levels.test.js uses 'acoustic-engineering'. I confirmed against the repo that game-theory has 29 lessons and lesson 3's title is exactly that string. Open issues #301 (audit 293 topics for invented content) and #293 (invented links) will edit these files, so they will fail unrelated code tests when a lesson is added, retitled or removed.

**Proposal.** Have these tests write a small fixture course into the tmp root (as 14 other files already do) and assert on that. Keep a separate shipped-content test, such as topic-levels' 'every topic has a level', for properties of content, not for titles and counts.

**Risk.** Low. Keep one smoke test that a shipped course loads.

### TEST-15 (improve, low, minutes, not verified): The read-only-filesystem tests pass vacuously when the freeze does nothing or the store throws

**Where.** tests/integration/readonly-filesystem.test.js:41,56-97

**Evidence.** `freeze()` is a `chmod 0o555` on workspace/. It does nothing for root (a container CI user, or `sudo npm test`) or on Windows, and nothing checks that the freeze worked. Both persistence tests also contain `if (threw) return;` with no `expect.assertions`, so a store whose markLessonComplete always throws passes too. The tests then do not guard the #117 class of bug they are named for on those setups, and nothing says so.

**Proposal.** In `freeze()`, probe it: `expect(() => fs.writeFileSync(path.join(root,'workspace','probe'), '')).toThrow()`, and skip the file with a message when the probe does not throw. Add `expect.hasAssertions()` and make the 'threw' branch assert `error.code` or the message, so only a deliberate loud failure passes.

**Risk.** None.

### TEST-16 (improve, low, minutes, ~45 lines, not verified): Tests that grep source or regex prose can pass whatever the code does, or pin a temporary owner decision

**Where.** tests/onboarding-intro.test.js:26-40; tests/brand-logo.test.js:28-31; tests/opentutor-name.test.js:31-40; tests/web-connect.test.js:841-852

**Evidence.** onboarding-intro.test.js 'covers the four things a new student cannot infer' matches onboarding.md against `/day|daily|minutes/`, `/question|ask/`, `/track|remember|weak|struggl/` and `/293|build|research/`, and 'keeps it to one message' against `/once|brief|short|don't repeat|two|couple/i`. Ordinary prose passes each of those, so no reasonable rewording can fail them. brand-logo.test.js:29 asserts `README.md` contains `assets/logo/opentutor-hero-512.png` because the owner chose that 'for now' (#266); it fails the day the owner changes the README, a decision the test cannot judge. opentutor-name.test.js asserts that three prompt files contain the literal 'You are OpenTutor' and two files contain `I'm OpenTutor`; the text can be in dead code and the test passes. web-connect.test.js:841-852 regex-matches style.css source (`height: 100dvh`, `white-space: normal`); a later overriding rule leaves it green (TST-1 covers real layout checks).

**Proposal.** Delete the two onboarding-intro regex tests and the README-logo test (about 25 lines). Keep the 'never says study buddy' file scan, which has a clear failure mode. Drop the CSS regex tests in favour of the browser job proposed in TST-1, or move them to a cheap static `tests/static.test.js` marked as such.

**Risk.** Low. These are copy and policy locks; keep any one the owner wants as a deliberate guard.

## Refuted by the skeptics (not worth an issue)

- LESSON-1 (The lesson engine and tutoring logic): Wikipedia source checks send no User-Agent and get 429, so every Wikipedia citation is silently dropped — refuted: The code matches the finding, but the bug could not be reproduced. links.js:60 sends no headers, so Node's default User-Agent ("node") goes out, and `response.ok` gates the citation. That part is accurate. But the claim that Wikipedia returns 429 for it, so every citation is dropped, does not hold from here. On origin/main with Node v22.17.0, a HEAD and a GET to en.wikipedia.org/wiki/Nash_equilibrium both returned 200 with and without a User-Agent. A further 20 HEAD requests with `redirect:'error'` across 5 articles, with no User-Agent, all returned 200. httpbin confirmed the default UA is "node". The reviewer's 429 was probably transient throttling on their own IP. The Vercel egress throttling they raise is untested, so there is no evidence the failure is systematic. This is at most a speculative robustness improvement, not a high-severity bug. The caching and 429/5xx remarks are fair as hardening, and the missing 429 test is real: the fetch stubs in readable.test.js only return ok. No open issue or issues.md draft covers this. issues.md only notes the Wikipedia check as safe (redirect:'error', fixed origin).
- FE-12 (The browser front end): Leftover storage key and defensive code for states that cannot happen — refuted: Part (a), the main claim, is refuted. The key was set by real code until recently, so the three removeItem calls are a deliberate cleanup, not leftovers. Parts (b), (c) and (d) are real but trivial, and a few lines is all they save.

(a) `git log -S"opentutor-password" -- public` shows the key was introduced in 94c4ff3 (2026-09-21, "shared-password gate on every API route"). In 3e6ae7b^:public/app.js:9 it was `const PASSWORD_KEY = 'opentutor-password'`, and the shared password was stored in localStorage. 3e6ae7b (#130, 2026-09-24) removed the setter and added the removeItem calls. So browsers that used the app during those three days may still hold a plaintext shared password in localStorage. The calls at app.js:28, login.js:96 and login.js:111 delete it on sign-out and sign-in. Removing them leaves that credential in those browsers for good. "A stale key is inert" is wrong for a plaintext credential. The migration is only about a week old, and production has run since 09-29. The docs/deployment.md:134 sentence describes the current flow only. The other grep hits (api/_lib/auth.js:18, api/account.js:174, the tests) are for the `x-opentutor-password` header, which is unrelated.

(b) True. `$('#lesson-input')` is static at learn.html:86, and app.js:459 and :537 use it unguarded. The test doubles (web-connect, web-topic-recovery) build their nodes from the real learn.html, so the element always exists there too. The `if (lessonInput)` wrapper can go.

(c) True. `#lesson-conversation` is static at learn.html:60, and the same file uses it unguarded at app.js:399, :443, :548, :550 and :558. The `|| $('#lesson-area')` fallback can go.

(d) True. index.html:96 hard-codes topic=game-theory. tests/web-welcome-demo.test.js:144 expects '/learn.html?topic=game-theory', which is exactly what `learnLink('game-theory')` returns. The change is safe. It does hard-code the slug in a second place, welcome.js, so the topic would then live in both index.html and welcome.js.

(e) Not checked beyond FE-5.


---

# Opened on GitHub

- PIPE-1 → https://github.com/LEARNableLabs/opentutor/issues/311
- PIPE-2 → https://github.com/LEARNableLabs/opentutor/issues/312
- RT-1 → https://github.com/LEARNableLabs/opentutor/issues/313
- RT-2 → https://github.com/LEARNableLabs/opentutor/issues/314
- TG-1 → https://github.com/LEARNableLabs/opentutor/issues/315
- TG-2 → https://github.com/LEARNableLabs/opentutor/issues/316
- PLAT-1 → https://github.com/LEARNableLabs/opentutor/issues/317
- TEST-1 → https://github.com/LEARNableLabs/opentutor/issues/318
- pipeline (grouped, 14) → https://github.com/LEARNableLabs/opentutor/issues/319
- state (grouped, 16) → https://github.com/LEARNableLabs/opentutor/issues/320
- routes (grouped, 14) → https://github.com/LEARNableLabs/opentutor/issues/321
- lesson (grouped, 14) → https://github.com/LEARNableLabs/opentutor/issues/322
- frontend (grouped, 13) → https://github.com/LEARNableLabs/opentutor/issues/323
- bot (grouped, 15) → https://github.com/LEARNableLabs/opentutor/issues/324
- platform (grouped, 16) → https://github.com/LEARNableLabs/opentutor/issues/325
- tests (grouped, 16) → https://github.com/LEARNableLabs/opentutor/issues/326
