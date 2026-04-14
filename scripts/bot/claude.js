/**
 * Claude wrapper — uses Claude Code CLI by default, Anthropic SDK as alternative.
 * Set CLAUDE_BACKEND=sdk in .env to use the SDK (requires ANTHROPIC_API_KEY).
 */

import { spawn } from 'child_process';
const BACKEND = process.env.CLAUDE_BACKEND || 'cli';

/**
 * Generate a response from Claude.
 * @param {string} system - System prompt
 * @param {Array} messages - Conversation messages [{role, content}]
 * @param {object} options
 * @param {'cheap'|'strong'} options.model - Model tier hint (used by SDK backend)
 */
export async function generate(system, messages, options = {}) {
  if (BACKEND === 'sdk') return generateSDK(system, messages, options);
  return generateCLI(system, messages, options);
}

/** Alias for consistency — CLI doesn't support streaming but same interface */
export const generateStream = generate;

// ── Claude Code CLI backend ─────────────────────────────────

async function generateCLI(system, messages, options = {}) {
  const userMessages = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join('\n\n');

  const prompt = `${system}\n\n---\n\nStudent message:\n${userMessages}`;

  return new Promise((resolve, reject) => {
    const child = spawn('claude', ['-p', '--no-input'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error('  claude-cli error:', stderr.slice(0, 200));
        reject(new Error(`Claude CLI exited with code ${code}`));
        return;
      }
      resolve({ text: stdout.trim(), model: 'claude-code-cli', usage: null });
    });

    child.on('error', (err) => {
      reject(new Error(`Claude CLI failed: ${err.message}`));
    });

    // Pipe prompt via stdin
    child.stdin.write(prompt);
    child.stdin.end();

    // Timeout after 2 minutes
    setTimeout(() => {
      child.kill();
      reject(new Error('Claude CLI timed out after 120s'));
    }, 120_000);
  });
}

// ── Anthropic SDK backend (requires ANTHROPIC_API_KEY) ──────

async function generateSDK(system, messages, options = {}) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const { CLAUDE } = await import('./config.js');

  const client = new Anthropic({ apiKey: CLAUDE.apiKey });
  const tier = options.model || 'cheap';
  const model = tier === 'strong' ? CLAUDE.strongModel : CLAUDE.cheapModel;
  const maxTokens = options.maxTokens || (tier === 'strong' ? 4096 : 1024);

  const params = {
    model,
    max_tokens: maxTokens,
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages,
  };

  // Enable web search for research-heavy tasks
  if (options.webSearch) {
    params.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: options.webSearchMaxUses || 5 }];
  }

  const response = await client.messages.create(params);

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return { text, model, usage: response.usage };
}
