# Self-Deploy Guide

Deploy the web version on Vercel with Supabase storage. Telegram, Claw and Hermes run separately in their own environments.

1. Fork [LEARNableLabs/opentutor](https://github.com/LEARNableLabs/opentutor).
2. Create a [Supabase](https://supabase.com) project. Run **every migration in numeric order** from [`supabase/migrations/`](../supabase/migrations/), then copy the project URL and server-side secret key.
3. Get an API key from Anthropic, OpenRouter, or OpenAI.
4. Import your fork into [Vercel](https://vercel.com). Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SECRET_KEY`), `OPENTUTOR_PASSWORD`, and your LLM API key. Set a separate `OPENTUTOR_ADMIN_PASSWORD` if using student administration.
5. Deploy. Open your Vercel URL, sign in, and choose an available topic. Complete a lesson and refresh to verify that progress persists.

No Telegram bot token or webhook registration is needed for the web deployment. To run Telegram, use `npm run bot` on an always-on host. Existing webhook users must remove their old registration and set `TELEGRAM_MODE=polling` (or unset it) before starting the bot.

See [deployment.md](deployment.md) for full setup, migration instructions, local development, and the Telegram transition command. Claw and Hermes users should follow their platform folders instead of deploying an agent runtime on Vercel.
