import { it, expect } from 'vitest';
import fs from 'node:fs';

it('deploys no Telegram webhook while retaining the standalone bot', () => {
  expect(fs.existsSync('api/telegram.js')).toBe(false);
  expect(fs.existsSync('scripts/register-webhook.js')).toBe(false);
  expect(fs.existsSync('scripts/bot/index.js')).toBe(true);
  expect(JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts.bot).toBe('node scripts/bot/index.js');
});
