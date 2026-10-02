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
    // Which Claude Code model answers each tier (`--model`: an alias such as "opus" or a full id).
    // Unset, Claude Code uses its own default for both. Curriculum builds want a strong one (#330).
    this.models = {
      strong: options.strongModel || process.env.OPENTUTOR_CLI_STRONG_MODEL,
      cheap: options.cheapModel || process.env.OPENTUTOR_CLI_CHEAP_MODEL,
    };
  }

  async generate(system, messages, options = {}) {
    const prompt = buildCliConversation(messages);
    const timeoutMs = options.timeout || this.timeoutMs; // per call, as the other adapters take it

    return new Promise((resolve, reject) => {
      let settled = false;
      let timeout;
      const settle = (handler, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        handler(value);
      };

      // No tools unless the call asks for some (`options.tools`, "WebSearch,WebFetch"): a resource search
      // needs the web, a lesson or a critique must not touch anything.
      const args = ['-p', '--no-session-persistence', '--system-prompt', system, prompt, '--tools', options.tools || ''];
      if (options.tools) args.push('--allowedTools', options.tools);
      if (options.model === 'cheap') args.push('--effort', 'low');
      const model = this.models[options.model === 'strong' ? 'strong' : 'cheap'];
      if (model) args.push('--model', model);

      const child = spawn('claude', args, {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';

      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', () => {}); // drain, but never put model/tool diagnostics into errors

      child.on('close', (code) => {
        if (code !== 0) {
          // Recognize the known limit without logging arbitrary partial output,
          // which can contain private prompt material or credentials.
          const limit = /^(?:You've hit your (?:session|usage) limit|Usage limit reached)\b/im.test(stdout);
          settle(reject, new Error(limit ? 'Claude CLI usage limit reached' : `Claude CLI exited with code ${code}`));
          return;
        }
        const text = stdout.trim();
        if (!text) {
          settle(reject, new Error('Claude CLI returned empty response'));
          return;
        }
        settle(resolve, { text, model: 'claude-code-cli', usage: null });
      });

      child.on('error', () => {
        settle(reject, new Error('Claude CLI could not be started'));
      });

      timeout = setTimeout(() => {
        child.kill();
        settle(reject, new Error(`Claude CLI timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function buildCliConversation(messages) {
  const turns = messages
    .filter((m) => ['user', 'assistant'].includes(m.role))
    .map(({ role, content }) => ({ role, content: String(content) }));
  return `<conversation_json>\n${escapeXml(JSON.stringify(turns))}\n</conversation_json>`;
}
