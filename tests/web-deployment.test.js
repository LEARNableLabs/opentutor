import { it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

it('deploys no Telegram webhook while retaining the standalone bot', () => {
  expect(fs.existsSync('api/telegram.js')).toBe(false);
  expect(fs.existsSync('scripts/register-webhook.js')).toBe(false);
  expect(fs.existsSync('scripts/bot/index.js')).toBe(true);
  expect(JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts.bot).toBe('node scripts/bot/index.js');
});

// Every api/**/*.js file with no underscore-prefixed path segment becomes one
// Vercel Serverless Function. The Hobby plan allows at most 12 per deployment.
function countFunctionFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((count, entry) => {
    if (entry.name.startsWith('_')) return count;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return count + countFunctionFiles(full);
    return entry.name.endsWith('.js') ? count + 1 : count;
  }, 0);
}

it('stays within the Hobby plan\'s 12-function limit', () => {
  expect(countFunctionFiles('api')).toBeLessThanOrEqual(12);
});
