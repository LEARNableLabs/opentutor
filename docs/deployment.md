# OpenTutor Deployment Guide

> **Run all four migrations, in order.** 003 and 004 are not optional: without
> them the deployed code queries columns that do not exist. See
> [Step 1](#step-1--create-a-supabase-project).

Step-by-step guide for deploying OpenTutor on Vercel + Supabase. No CLI tools required — everything can be done through web dashboards.

## Prerequisites

- A GitHub account (repo must be pushed)
- One LLM API key (any of: Anthropic, OpenRouter, OpenAI)
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

## Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Pick a name (e.g., `opentutor`), set a database password, choose a region
4. Wait for the project to provision (~30 seconds)

### Run the migration

5. Go to **SQL Editor** in the left sidebar
6. Click **New Query**
7. Paste the contents of `supabase/migrations/001_initial_schema.sql` from the repo
8. Click **Run**
9. Verify: go to **Table Editor** — you should see 10 tables: `kv`, `curricula`, `lessons_completed`, `sessions`, `memory`, `jobs`, `students`, `student_exercises`, `groups`, `group_members`
10. Run the remaining migrations in order, each with **Run**:
    - `002_scope_rls_to_service_role.sql` — scopes RLS to `service_role`; 001 left the policies applying to every role including the public `anon` key (#96)
    - `003_partition_kv_by_student.sql` — gives `kv` and `memory` a `user_id`, so two students stop sharing one profile (#80)
    - `004_runtime_state_off_disk.sql` — moves completion, `learning.md` and generated curricula into Postgres, because the deployment's filesystem is read-only (#117)
11. Check **Policies**: every table should list `service_role`, not `public`.

### Copy credentials

10. Go to **Settings → API**
11. Copy:
    - **Project URL** → this is `SUPABASE_URL`
    - **service_role key** (under "Project API keys") → this is `SUPABASE_SERVICE_ROLE_KEY`

## Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import the `LEARNableLabs/opentutor` repository from GitHub
4. In **Environment Variables**, add:

| Variable | Value | Required |
|---|---|---|
| `OPENTUTOR_PASSWORD` | A strong shared password for the web API | Yes |
| `OPENTUTOR_ADMIN_PASSWORD` | A separate password for student administration | For admin UI |
| `SUPABASE_URL` | From Step 1 | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | From Step 1 | Yes |
| `TELEGRAM_BOT_TOKEN` | From BotFather | Yes |
| `TELEGRAM_WEBHOOK_SECRET` | Any random string (e.g., `openssl rand -hex 32`) | Yes |
| `ANTHROPIC_API_KEY` | Your Anthropic key | One of these three |
| `OPENROUTER_API_KEY` | Your OpenRouter key | One of these three |
| `OPENAI_API_KEY` | Your OpenAI key | One of these three |

5. Click **Deploy**
6. Wait for the build to complete
7. Copy your deployment URL (e.g., `https://opentutor-abc.vercel.app`)

### LLM backend auto-detection

You only need ONE API key. The system auto-detects:
- `ANTHROPIC_API_KEY` set → uses Claude SDK (Sonnet for strong, Haiku for cheap)
- `OPENROUTER_API_KEY` set → uses OpenRouter (200+ models, default: Claude)
- `OPENAI_API_KEY` set → uses OpenAI (GPT-4o for strong, GPT-4o-mini for cheap)

To override: set `OPENTUTOR_LLM=openrouter` (or `claude-sdk`, `openai`).

## Step 3 — Register Telegram webhook

Run this command (replace the values):

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<YOUR_VERCEL_URL>/api/telegram&secret_token=<YOUR_WEBHOOK_SECRET>"
```

You should see: `{"ok":true,"result":true,"description":"Webhook was set"}`

Or use the helper script locally:
```bash
TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... \
  node scripts/register-webhook.js https://your-app.vercel.app/api/telegram
```

## Step 4 — Test

### Web UI
Open `https://your-vercel-url.vercel.app` in a browser. You should see the OpenTutor interface with onboarding.

### Telegram
Send `/start` to your bot on Telegram. It should begin the onboarding flow.

### Verify the pipeline
Send `/add auction theory` — the bot should respond with a taster lesson and start building the full curriculum in the background.

## Architecture (what's running)

```
Vercel
├── public/           → Static web UI (HTML/CSS/JS)
├── api/lesson.js     → Socratic multi-turn lessons (lesson state needs SQLite; see the warning below)
├── api/telegram.js   → Telegram webhook (receives bot updates)
├── api/chat.js       → Free-form chat
├── api/topics.js     → Topic listing
├── api/progress.js   → Student progress with computed stats
├── api/onboard.js    → Onboarding conversation
├── api/add-topic.js  → Activate an existing curriculum (custom generation unavailable)
└── api/user.js       → Student profile

Supabase
├── kv                → Progress, active lessons, student profile
├── sessions          → Conversation history
├── memory            → Daily session logs
├── jobs              → Pipeline job queue (durable)
├── students          → Per-student state
└── student_exercises → Exercise results

Domain files (in repo)
├── skills/tutor/domains/  → 293 pre-built curricula (read from Vercel filesystem)
├── skills/tutor/references/ → Teaching methodology
└── workspace/USER.md      → Student profile template
```

## Updating

Push to main → Vercel auto-deploys. No manual steps.

Database migrations: if a new migration is added to `supabase/migrations/`, paste and run it in the Supabase SQL Editor.

## Environment variable reference

| Variable | Purpose | Default |
|---|---|---|
| `OPENTUTOR_PASSWORD` | Shared web API password (required on Vercel) | — |
| `OPENTUTOR_ADMIN_PASSWORD` | Separate admin API password | — |
| `SUPABASE_URL` | Supabase project URL | — |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key | — |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | — |
| `TELEGRAM_WEBHOOK_SECRET` | Webhook signature verification | — |
| `ANTHROPIC_API_KEY` | Claude API key | — |
| `OPENROUTER_API_KEY` | OpenRouter API key | — |
| `OPENAI_API_KEY` | OpenAI API key | — |
| `OPENTUTOR_LLM` | Override LLM backend | Auto-detect from keys |
| `OPENTUTOR_PIPELINE_LLM` | Separate backend for curriculum pipeline | Same as OPENTUTOR_LLM |
| `OPENTUTOR_PORT` | Web server port (local dev only) | 3000 |
| `OPENTUTOR_DATA_DIR` | Redirect data to isolated dir (testing) | — |

## Troubleshooting

**Bot doesn't respond:**
- Check webhook is registered: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Check Vercel function logs for errors
- Verify `TELEGRAM_WEBHOOK_SECRET` matches between Vercel env and webhook registration

**"No API key" error:**
- At least one of `ANTHROPIC_API_KEY`, `OPENROUTER_API_KEY`, or `OPENAI_API_KEY` must be set
- Check Vercel env vars are set (not just local .env)

**Supabase connection fails:**
- Verify `SUPABASE_URL` includes the protocol: `https://xxx.supabase.co`
- Use the `service_role` key, not the `anon` key
- Check the migration ran (tables should exist in Table Editor)

**Lessons not generating:**
- Hosted `/api/add-topic` can activate existing curricula only. A custom topic without a curriculum returns `501` without adding it to active topics; choose a topic from the Topics list or generate a curriculum in a local installation. Serverless generation needs a durable worker before it can be supported (#118).
- Check Vercel function logs for LLM timeouts
- The pipeline needs a strong model — if using a weak model via OpenRouter, set `OPENTUTOR_PIPELINE_LLM=claude-sdk` with an Anthropic key

**Web UI shows empty state:**
- The 293 pre-built domains are read from the Vercel filesystem (included in the deploy)
- If `/api/topics` returns empty, check the deploy included the `skills/` directory

## Local development

No deployment needed for local dev:

```bash
npm install
npm run bot          # Telegram bot (SQLite, claude -p)
npm run web          # Web UI at localhost:3000
npm run bot:test     # Isolated test data
```

Set `OPENTUTOR_LLM=cli` (default) to use Claude Code CLI with no API key.

## Student sign-in

Set a separate `OPENTUTOR_ADMIN_PASSWORD` and open `/admin.html`. Adding a student shows a one-time access token. Give that token to the student, who enters it through **Switch student** in the web UI or sends it as `Authorization: Bearer <token>`. Never put the token in a URL.

The admin’s **Reset access token** action replaces a forgotten token and immediately revokes the previous one. Existing students provisioned before this feature can use that action to obtain their first token. Removing a student revokes their token and clears their stored state.

Tokens are stored as SHA-256 digests; raw tokens are returned only when created or reset. They do not grant access to admin routes. The existing shared `OPENTUTOR_PASSWORD` selects the unnamed single-user instance. Requests choose their store from the verified credential, never from a caller-supplied student id.
