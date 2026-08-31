/**
 * Adapter factory — resolves the right LLM adapter from config or env.
 *
 * Supported backends:
 *   claude-sdk  — Anthropic API (requires ANTHROPIC_API_KEY)
 *   claude-cli  — Claude Code CLI (requires `claude` in PATH)
 *   openai      — OpenAI API (requires OPENAI_API_KEY)
 *   ollama      — Local models via Ollama (requires Ollama running)
 */

import { ClaudeSDKAdapter } from './claude-sdk.js';
import { ClaudeCLIAdapter } from './claude-cli.js';
import { OpenAIAdapter } from './openai.js';
import { OllamaAdapter } from './ollama.js';

const ADAPTERS = {
  'claude-sdk': ClaudeSDKAdapter,
  sdk: ClaudeSDKAdapter,
  'claude-cli': ClaudeCLIAdapter,
  cli: ClaudeCLIAdapter,
  openai: OpenAIAdapter,
  ollama: OllamaAdapter,
};

export function createAdapter(backend, options = {}) {
  const AdapterClass = ADAPTERS[backend];
  if (!AdapterClass) {
    throw new Error(`Unknown LLM backend: "${backend}". Available: ${Object.keys(ADAPTERS).join(', ')}`);
  }
  return new AdapterClass(options);
}

export function createAdapterFromEnv() {
  const backend = process.env.OPENTUTOR_LLM || process.env.CLAUDE_BACKEND || 'cli';
  return createAdapter(backend);
}

export function createPipelineAdapterFromEnv() {
  const backend = process.env.OPENTUTOR_PIPELINE_LLM
    || process.env.CLAUDE_PIPELINE_BACKEND
    || process.env.OPENTUTOR_LLM
    || process.env.CLAUDE_BACKEND
    || 'cli';
  return createAdapter(backend);
}

export { BaseLLMAdapter } from './base.js';
export { ClaudeSDKAdapter } from './claude-sdk.js';
export { ClaudeCLIAdapter } from './claude-cli.js';
export { OpenAIAdapter } from './openai.js';
export { OllamaAdapter } from './ollama.js';
