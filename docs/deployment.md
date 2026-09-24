# OpenTutor Deployment Guide

Vercel hosts the web UI and its API. Telegram runs separately on an always-on host; Claw and Hermes integrations run in their own agent environments using the portable skill.

## Step 1 — Create a Supabase project

Create a project at [Supabase](https://supabase.com). In its SQL Editor, run every file in `supabase/migrations/` in numeric order. The current migrations are:

1. `001_initial_schema.sql` — base tables.
2. `002_scope_rls_to_service_role.sql` — restrict policies to the service role.
3. `003_partition_kv_by_student.sql` — partition runtime KV and memory by student.
4. `004_runtime_state_off_disk.sql` — persist completion, domain files and generated curricula in Postgres.

Check that table policies grant access to `service_role`, not `public`. Copy the project URL and server-side secret key from Settings → API. Both `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_SECRET_KEY` are accepted. Never expose either key in browser code.

## Step 2 — Deploy the web app to Vercel

Import your GitHub fork into [Vercel](https://vercel.com), then configure:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` | Server-side database credential |
| `OPENTUTOR_PASSWORD` | Shared web password; required on Vercel. Without it, a server with accounts enabled refuses anonymous requests |
| `OPENTUTOR_ADMIN_PASSWORD` | Separate password for `/admin.html`, if provisioning students |
| `ANTHROPIC_API_KEY`, `OPENROUTER_API_KEY`, or `OPENAI_API_KEY` | At least one LLM credential |

Click Deploy. Open the deployment URL, enter the web password, and select a topic. `/admin.html` uses the separate admin password. Provisioned students sign in using their individual access tokens; see Student sign-in below.

Do not configure a Telegram token or webhook secret in this Vercel project. The Telegram webhook endpoint and registration script have been removed (#120).

### LLM selection

Set `OPENTUTOR_LLM` to `claude-sdk`, `openrouter`, `openai`, `ollama`, or `cli` to override detection. Without it, keys are checked in this order: Anthropic, OpenRouter, OpenAI. Use a remote API backend on Vercel; `cli` and a local Ollama server require a suitable local environment.

`OPENTUTOR_PIPELINE_LLM` can select a separate generation backend. Custom topics use a durable two-phase build: five starter lessons first, then a queued planner, builder and critic. Existing curricula activate immediately without a generation call.

### Durable custom-topic builds

The deployment uses [Vercel Queues](https://vercel.com/docs/queues/quickstart) with the pinned `@vercel/queue` SDK. `vercel.json` registers the private `api/build-topic.js` consumer on `opentutor-curriculum`, with a 300-second function limit. Producer and consumer both use `iad1`; change both the deployment region and `api/_lib/topic-queue.js` together if relocating. Queue authentication uses Vercel's deployment identity, so there is no extra queue secret to configure. Queues is currently a beta Vercel service; verify availability for your team.

`POST /api/add-topic` awaits queue acceptance before preparing starter lessons. It returns `200` with usable lessons, or `202` with a saved build to poll at `GET /api/topic-build?slug=...`. `GET /api/topic-build` lists the authenticated student's builds so the browser can recover after reload. A queue or storage scheduling error returns `503` and leaves the topic out of active progress until lessons exist.

Generated web curricula, domain assets and stage checkpoints are saved together under student-scoped `generated_topic:<slug>` KV rows. No new migration beyond 001–004 is needed. Conditional updates fence duplicate deliveries and expired workers; retries resume the last saved stage. Each stage gets three attempts before the UI offers Retry. Five starter lesson identities stay stable when the full curriculum arrives, preserving completed and in-flight lessons. After three critique rounds, a curriculum can finish with outstanding review feedback, which the UI displays.

## Step 3 — Verify the deployment

- Open Topics and activate an existing curriculum.
- Complete a lesson, refresh, and verify progress persists.
- Add a new custom topic, start a starter lesson, then reload. Verify the full curriculum eventually appears and completed lessons remain completed. Inspect the private build function and queue logs if it stalls.
- An unauthenticated API request should return `401`; a deployment missing its web password returns `503`.
- A topic with no curriculum returns a missing-curriculum message, not a completion message.
- The retired Telegram endpoint must not process updates.

The 293 shipped curricula are read-only content included in the deployment. Runtime state belongs in Supabase. Pushes to `main` trigger Vercel deployments; run newly added database migrations before deploying code that needs them.

## Telegram on a separate host

Use an always-on machine with Node 22 or newer:

```bash
npm ci
# Configure TELEGRAM_BOT_TOKEN and an LLM backend on this machine.
TELEGRAM_MODE=polling npm run bot
```

Set `TELEGRAM_CHAT_ID` for scheduled daily lessons. Keep this process running using your host's process manager. See `.env.example` for bot options.

If this bot was previously registered with the retired webhook, unset `TELEGRAM_MODE` or set it to `polling` in the bot host environment, remove `TELEGRAM_WEBHOOK_URL`, and remove the registration before polling:

```bash
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook"
```

This preserves pending updates; it does not request `drop_pending_updates`. Remove obsolete Telegram variables from the Vercel project's environment settings after migrating.

## Claw and Hermes

Follow the platform guides in `openclaw/`, `nanoclaw/`, `nemoclaw/`, or `hermes/`. These are portable skill integrations hosted by the corresponding agent environment. No Claw or Hermes runtime is deployed by `vercel.json`.

## Troubleshooting

**Cannot sign in:** Verify `OPENTUTOR_PASSWORD` is set in the intended Vercel environment, then redeploy. Admin access requires its own password.

**Progress does not save:** Check Supabase credentials and confirm every migration ran. Inspect function logs for database errors.

**No topics:** Check that `skills/tutor/domains/` is included in the deployed project.

**Custom topic stalled:** Check the queue trigger, matching regions, Supabase access, and pipeline LLM configuration. A failed build offers Retry; starter lessons remain available. Queue messages are retained for seven days, so re-add a topic to resume it after a longer outage.

**Telegram polling conflicts:** Stop any second bot process, set `TELEGRAM_MODE=polling`, and remove the old webhook registration before starting the standalone bot.

## Local web development

```bash
npm ci
npm run web          # http://localhost:3000
npm run web:test     # isolated runtime state
```

`OPENTUTOR_PORT` and `OPENTUTOR_HOST` select the local listener. `OPENTUTOR_DATA_DIR` redirects local runtime state. Local use can omit the shared password; hosted use cannot.

The standalone web server scans saved SQLite build rows and resumes after restart; it does not require Vercel Queues locally. An interrupted stage waits for its three-minute lease to expire before recovery. Keep the process running for builds to progress.

Set `OPENTUTOR_LLM=cli` (default) to use Claude Code CLI with no API key.

## Student sign-in

Set a separate `OPENTUTOR_ADMIN_PASSWORD` and open `/admin.html`. Adding a student shows a one-time access token. Give that token to the student, who enters it through **Switch student** in the web UI or sends it as `Authorization: Bearer <token>`. Never put the token in a URL.

The admin’s **Reset access token** action replaces a forgotten token and immediately revokes the previous one. Existing students provisioned before this feature can use that action to obtain their first token. Removing a student revokes their token and clears their stored state.

Tokens are stored as SHA-256 digests; raw tokens are returned only when created or reset. They do not grant access to admin routes. The existing shared `OPENTUTOR_PASSWORD` selects the unnamed single-user instance. Requests choose their store from the verified credential, never from a caller-supplied student id.

## Public browsing and email accounts

The homepage (`/`) explains the learning flow and lists the shipped topic library through public `GET /api/catalog`. It never queries student progress or generated/private topics. `/learn.html` is the signed-in tutor workspace; `/login.html` offers email signup, login and existing-token access. Password reset returns 404 until #133.

Email accounts use Supabase Auth through server-side `/api/account`. The server reuses `SUPABASE_URL` and the server-side Supabase key; neither the key nor session tokens are returned to browser JavaScript. Each request verifies the access token with Supabase before selecting an `acct-<auth UUID>` store. Signup does not create local student state until the email is confirmed. New account registry rows are inserted independently, so simultaneous signups cannot overwrite each other. Removing an account from the admin screen leaves a disabled registry record so old sessions and future sign-ins cannot restore access.

Before enabling public signup in production, configure the existing Supabase project:

1. In Authentication → Sign In / Providers, keep the Email provider enabled and turn **Confirm email off**. Accounts are email and password with no email step until #133; the app hides "Forgot password?" until then. To reset a student's password meanwhile, use Supabase's admin API (`auth.admin.updateUserById(id, { password })`).
2. In Authentication → URL Configuration, set Site URL to `https://opentutor-mauve.vercel.app`. Add both `https://opentutor-mauve.vercel.app/login.html` and `https://opentutor-mauve.vercel.app/login.html?mode=reset` to allowed Redirect URLs. Add the equivalent URLs for each production alias you advertise, and your exact preview URL for testing. Local testing uses the corresponding `http://localhost:3000` URLs. List exact URLs only — never a wildcard such as `https://**`: this allowlist is what stops a forged reset request from sending a user's reset link to another site.
3. Configure your email sender under Authentication → Email/SMTP. Supabase's default sender is restricted and is unsuitable for general public signup. Keep Supabase rate limits enabled.
4. The email flows (confirmation, password reset, a real sender and a real-mailbox test) are tracked in #133.

Access and refresh tokens use HttpOnly cookies, Secure on Vercel, with SameSite=Lax. Cookie-authenticated writes enforce same-origin requests. Password reset additionally requires a short-lived, signed recovery grant bound to the verified email-link flow, user and access token. Session responses and private API responses are not cacheable. Legacy token/shared-password access remains available through the explicit existing-access form; the default flow no longer stores credentials in localStorage or opens browser password prompts.

`OPENTUTOR_PUBLIC_URL` optionally pins the origin used for redirects and origin checks. Set it per environment; a production URL must not be applied to unrelated preview hosts. Outside Vercel, set it on any server with accounts enabled: without it, confirmation and reset links are built from the request's `Host` header, which the client controls. With no Supabase configuration, public browsing still works and local installations retain the existing local workspace/token options.

### Free trial and students' own OpenRouter keys

Students who sign themselves up get 3 lessons on the deployment's model key, on the ready-made topics only. After that, and from the start for custom topics and Study Buddy, they connect their own OpenRouter account from the learn page, and every model call they make runs on their key. Onboarding is free for 12 messages. The owner and students created in the admin screen always use the deployment's key, without limits (#132).

The connection uses OpenRouter's OAuth PKCE flow and needs no setup on OpenRouter's side. Keys are stored encrypted (AES-256-GCM) under a key derived from `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY`, so rotating that secret, or switching a deployment from `SUPABASE_SERVICE_ROLE_KEY` to `SUPABASE_SECRET_KEY`, disconnects every student until they reconnect. `OPENROUTER_BASE_URL` points both the connection and the OpenRouter adapter at a stand-in for testing; leave it unset in production.

### Protecting deployment secrets

Mark `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`), `OPENROUTER_API_KEY` (or another provider key), `OPENTUTOR_PASSWORD`, and `OPENTUTOR_ADMIN_PASSWORD` as Sensitive in Production and Preview. Sensitive values can be replaced but cannot be revealed or downloaded; keep originals in your password manager. Vercel now calls these values Secrets and supports them in Development too. Use separate local development credentials; saved Secrets cannot be downloaded for local use. See [Vercel’s current Secret documentation](https://vercel.com/docs/environment-variables/sensitive-environment-variables). Model names and the Supabase URL are configuration values, not secrets.
