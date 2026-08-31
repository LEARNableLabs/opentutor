/**
 * Claude CLI adapter — spawns `claude -p` subprocesses.
 * No API key needed; uses local Claude Code installation.
 * Higher latency per call due to subprocess overhead.
 */

import { spawn } from 'child_process';
import { BaseLLMAdapter } from './base.js';

export class ClaudeCLIAdapter extends BaseLLMAdapter {
  constructor(options = {}) {
    super({ name: 'claude-cli', ...options });
    this.timeoutMs = options.timeoutMs || 120_000;
  }

  async generate(system, messages, options = {}) {
    const prompt = buildCliConversation(messages);

    return new Promise((resolve, reject) => {
      let settled = false;
      let timeout;
      const settle = (handler, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        handler(value);
      };

      const args = ['-p', '--no-session-persistence', '--system-prompt', system, prompt, '--tools', ''];
      if (options.model === 'cheap') args.push('--effort', 'low');

      const child = spawn('claude', args, {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });

      child.on('close', (code) => {
        if (code !== 0) {
          settle(reject, new Error(`Claude CLI exited with code ${code}: ${stderr.slice(0, 200)}`));
          return;
        }
        const text = stdout.trim();
        if (!text) {
          settle(reject, new Error('Claude CLI returned empty response'));
          return;
        }
        settle(resolve, { text, model: 'claude-code-cli', usage: null });
      });

      child.on('error', (err) => {
        settle(reject, new Error(`Claude CLI failed: ${err.message}`));
      });

      timeout = setTimeout(() => {
        child.kill();
        settle(reject, new Error(`Claude CLI timed out after ${this.timeoutMs}ms`));
      }, this.timeoutMs);
    });
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function buildCliConversation(messages) {
  const turns = messages
    .filter((m) => ['user', 'assistant'].includes(m.role))
    .map(({ role, content }) => ({ role, content: String(content) }));
  return `<conversation_json>\n${escapeXml(JSON.stringify(turns))}\n</conversation_json>`;
}
