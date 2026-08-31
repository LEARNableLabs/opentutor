/**
 * Configuration loader — .env + optional opentutor.config.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../..');

// Minimal .env parser (no dependency)
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv(path.join(ROOT, '.env'));

// Required keys — ANTHROPIC_API_KEY only needed for SDK backend
const backend = process.env.CLAUDE_BACKEND || 'cli';
const required = ['TELEGRAM_BOT_TOKEN'];
if (backend === 'sdk') required.push('ANTHROPIC_API_KEY');
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  const { logger } = await import('./logger.js');
  logger.fatal({ missing }, 'Missing required env vars');
  process.exit(1);
}

// Data directory — override with OPENTUTOR_DATA_DIR for test isolation
const DATA_DIR = process.env.OPENTUTOR_DATA_DIR || null;
const WORKSPACE = DATA_DIR ? path.join(DATA_DIR, 'workspace') : path.join(ROOT, 'workspace');
const DOMAINS = DATA_DIR ? path.join(DATA_DIR, 'domains') : path.join(ROOT, 'skills', 'tutor', 'domains');

// Paths
export const PATHS = {
  root: ROOT,
  skills: path.join(ROOT, 'skills', 'tutor'),
  skill: path.join(ROOT, 'skills', 'tutor', 'SKILL.md'),
  onboardingSkill: path.join(ROOT, 'skills', 'tutor-onboarding', 'SKILL.md'),
  references: path.join(ROOT, 'skills', 'tutor', 'references'),
  domains: DOMAINS,
  templates: path.join(ROOT, 'skills', 'tutor', 'templates'),
  workspace: WORKSPACE,
  openclaw: path.join(ROOT, 'openclaw'),
  sessions: path.join(WORKSPACE, 'sessions'),
  memory: path.join(WORKSPACE, 'memory'),
  materials: path.join(WORKSPACE, 'materials'),
  progress: path.join(WORKSPACE, 'tutor', 'progress.json'),
  user: path.join(WORKSPACE, 'USER.md'),
  identity: path.join(WORKSPACE, 'IDENTITY.md'),
  soul: path.join(WORKSPACE, 'SOUL.md'),
  tgSoul: path.join(ROOT, 'openclaw', 'SOUL.md'),
};

// Ensure directories exist
for (const dir of [PATHS.sessions, PATHS.memory, PATHS.materials, path.dirname(PATHS.progress)]) {
  fs.mkdirSync(dir, { recursive: true });
}

// Telegram config
export const TELEGRAM = {
  token: process.env.TELEGRAM_BOT_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID ? Number(process.env.TELEGRAM_CHAT_ID) : null,
  mode: process.env.TELEGRAM_MODE || 'polling', // 'polling' or 'webhook'
  webhookUrl: process.env.TELEGRAM_WEBHOOK_URL || null,
};

// Claude config
export const CLAUDE = {
  apiKey: process.env.ANTHROPIC_API_KEY,
  cheapModel: process.env.CLAUDE_CHEAP_MODEL || 'claude-haiku-4-5-20251001',
  strongModel: process.env.CLAUDE_STRONG_MODEL || 'claude-sonnet-4-20250514',
};

// Schedule defaults
export const SCHEDULE = {
  times: process.env.SCHEDULE_TIMES?.split(',') || ['09:00', '13:00', '19:00'],
  timezone: process.env.SCHEDULE_TZ || 'America/New_York',
};
