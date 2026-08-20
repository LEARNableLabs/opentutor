/**
 * Session management — conversation history per channel.
 * Append-only JSONL, survives restarts.
 */

import fs from 'fs';
import path from 'path';
import { PATHS } from './config.js';
import { log } from './logger.js';

const MAX_HISTORY = 20; // messages to include in Claude context

export function getSessionPath(channelId) {
  return path.join(PATHS.sessions, `${channelId}.jsonl`);
}

export function appendMessage(channelId, role, content) {
  const file = getSessionPath(channelId);
  const entry = JSON.stringify({ role, content, ts: Date.now() });
  fs.appendFileSync(file, entry + '\n');
}

export function getRecentHistory(channelId, limit = MAX_HISTORY) {
  const file = getSessionPath(channelId);
  try {
    const lines = fs.readFileSync(file, 'utf-8').trim().split('\n').filter(Boolean);
    const recent = lines.slice(-limit);
    return recent.map((line) => {
      const { role, content } = JSON.parse(line);
      return { role, content };
    });
  } catch {
    return [];
  }
}

export function clearSession(channelId) {
  log.info({ channel_id: channelId }, 'session cleared');
  const file = getSessionPath(channelId);
  try {
    fs.unlinkSync(file);
  } catch {
    // already gone
  }
}

export function pruneOldSessions(maxAgeDays = 7) {
  const dir = PATHS.sessions;
  try {
    const files = fs.readdirSync(dir);
    const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
    for (const file of files) {
      if (!file.endsWith('.jsonl')) continue;
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs < cutoff) {
        fs.unlinkSync(filePath);
        log.info({ file }, 'pruned old session');
      }
    }
  } catch { /* sessions dir may not exist yet */ }
}
