#!/usr/bin/env node
/**
 * Register a Telegram webhook URL.
 * Usage: TELEGRAM_BOT_TOKEN=... node scripts/register-webhook.js https://your-app.vercel.app/api/telegram
 */

const token = process.env.TELEGRAM_BOT_TOKEN;
const url = process.argv[2];
const secret = process.env.TELEGRAM_WEBHOOK_SECRET || '';

if (!token || !url) {
  console.error('Usage: TELEGRAM_BOT_TOKEN=... node scripts/register-webhook.js <webhook-url>');
  console.error('Optional: TELEGRAM_WEBHOOK_SECRET=... for signature verification');
  process.exit(1);
}

const params = new URLSearchParams({ url });
if (secret) params.set('secret_token', secret);

fetch(`https://api.telegram.org/bot${token}/setWebhook?${params}`)
  .then((r) => r.json())
  .then((d) => console.log(d.ok ? `Webhook registered: ${url}` : `Error: ${d.description}`))
  .catch((e) => console.error('Failed:', e.message));
