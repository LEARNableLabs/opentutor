/**
 * Telegram webhook endpoint for Vercel deployment.
 * Receives updates from Telegram, verifies the secret token,
 * and processes the update.
 */

const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  if (WEBHOOK_SECRET) {
    const token = req.headers['x-telegram-bot-api-secret-token'];
    if (token !== WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Invalid secret token' });
    }
  }

  const update = req.body;

  res.status(200).json({ ok: true });

  // TODO: route through lesson/command/chat handlers
  // Requires refactoring router.js to work without a persistent channel instance
  console.log('[telegram webhook]', JSON.stringify(update).slice(0, 200));
}
