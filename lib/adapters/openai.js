/**
 * OpenAI adapter — calls OpenAI API (GPT models).
 * Supports Codex and any OpenAI-compatible endpoint.
 */

import { BaseLLMAdapter } from './base.js';

export class OpenAIAdapter extends BaseLLMAdapter {
  constructor(options = {}) {
    super({ name: 'openai', ...options });
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    this.baseURL = options.baseURL || process.env.OPENAI_BASE_URL || undefined;
    this.cheapModel = options.cheapModel || process.env.OPENAI_CHEAP_MODEL || 'gpt-4o-mini';
    this.strongModel = options.strongModel || process.env.OPENAI_STRONG_MODEL || 'gpt-4o';
    this._client = null;
  }

  async _getClient() {
    if (!this._client) {
      const { default: OpenAI } = await import('openai');
      this._client = new OpenAI({ apiKey: this.apiKey, baseURL: this.baseURL });
    }
    return this._client;
  }

  async generate(system, messages, options = {}) {
    const client = await this._getClient();
    const tier = options.model || 'cheap';
    const model = tier === 'strong' ? this.strongModel : this.cheapModel;
    const maxTokens = options.maxTokens || (tier === 'strong' ? 4096 : 1024);

    const timeout = options.timeout || 60000;
    const response = await client.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system },
        ...messages,
      ],
    }, { timeout });

    const text = response.choices[0]?.message?.content || '';
    return {
      text,
      model,
      usage: response.usage ? {
        input_tokens: response.usage.prompt_tokens,
        output_tokens: response.usage.completion_tokens,
      } : null,
    };
  }
}
