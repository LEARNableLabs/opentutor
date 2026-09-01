/**
 * Claude SDK adapter — calls Anthropic API directly.
 * Fastest option for multi-call pipelines (no subprocess overhead).
 */

import { BaseLLMAdapter } from './base.js';

export class ClaudeSDKAdapter extends BaseLLMAdapter {
  constructor(options = {}) {
    super({ name: 'claude-sdk', ...options });
    this.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
    this.cheapModel = options.cheapModel || process.env.CLAUDE_CHEAP_MODEL || 'claude-haiku-4-5-20251001';
    this.strongModel = options.strongModel || process.env.CLAUDE_STRONG_MODEL || 'claude-sonnet-4-20250514';
    this._client = null;
  }

  async _getClient() {
    if (!this._client) {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      this._client = new Anthropic({ apiKey: this.apiKey });
    }
    return this._client;
  }

  async generate(system, messages, options = {}) {
    const client = await this._getClient();
    const tier = options.model || 'cheap';
    const model = tier === 'strong' ? this.strongModel : this.cheapModel;
    const maxTokens = options.maxTokens || (tier === 'strong' ? 4096 : 1024);

    const params = {
      model,
      max_tokens: maxTokens,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages,
    };

    if (options.webSearch) {
      params.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: options.webSearchMaxUses || 5 }];
    }

    const timeout = options.timeout || 60000;
    const response = await client.messages.create(params, { timeout });

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('');

    return { text, model, usage: response.usage };
  }
}
