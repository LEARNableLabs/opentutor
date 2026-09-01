# Self-Deploy Guide

Fork the repo and run your own OpenTutor instance. 7 steps, ~15 minutes.

## 1. Fork the repo

Fork [LEARNableLabs/opentutor](https://github.com/LEARNableLabs/opentutor) on GitHub.

## 2. Create a Telegram bot

1. Open Telegram, message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`, pick a name and username (must end in `bot`)
3. Copy the token: `123456789:ABCdef_ghiJKLmnoPQRstu`

## 3. Get an LLM API key

Pick one — the system auto-detects which you have:

| Provider | Where | What you get |
|---|---|---|
| [Anthropic](https://console.anthropic.com) | console.anthropic.com | Claude Sonnet + Haiku |
| [OpenRouter](https://openrouter.ai) | openrouter.ai | 200+ models (Claude, GPT, Llama, Mistral) — one key |
| [OpenAI](https://platform.openai.com) | platform.openai.com | GPT-4o + GPT-4o-mini |

## 4. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), sign in, click **New Project**
2. Pick a name, set a database password, choose a region
3. Once provisioned, go to **SQL Editor** → **New Query**
4. Paste the contents of [`supabase/migrations/001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql) → click **Run**
5. Go to **Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## 5. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Import your fork from GitHub
3. Add environment variables:

| Variable | Value |
|---|---|
| `SUPABASE_URL` | From step 4 |
| `SUPABASE_SERVICE_ROLE_KEY` | From step 4 |
| `TELEGRAM_BOT_TOKEN` | From step 2 |
| `TELEGRAM_WEBHOOK_SECRET` | Any random string (`openssl rand -hex 32`) |
| `ANTHROPIC_API_KEY` / `OPENROUTER_API_KEY` / `OPENAI_API_KEY` | From step 3 |

4. Click **Deploy**

## 6. Register the Telegram webhook

Replace `<TOKEN>`, `<URL>`, and `<SECRET>` with your values:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<URL>/api/telegram&secret_token=<SECRET>"
```

You should see `{"ok":true}`.

## 7. Start learning

- **Web**: open your Vercel URL in a browser
- **Telegram**: send `/start` to your bot

---

For detailed configuration, troubleshooting, and local development, see [deployment.md](deployment.md).
