/**
 * OpenRouter adapter — access 200+ models through a single API.
 * Supports Claude, GPT, Llama, Mistral, Gemini, and more.
 *
 * Uses the OpenAI-compatible endpoint, so this is thin wrapper
 * over the OpenAI adapter with OpenRouter defaults.
 */

import { BaseLLMAdapter } from './base.js';

export class OpenRouterAdapter extends BaseLLMAdapter {
  constructor(options = {}) {
    super({ name: 'openrouter', ...options });
    this.apiKey = options.apiKey || process.env.OPENROUTER_API_KEY;
    this.baseURL = options.baseURL || 'https://openrouter.ai/api/v1';
    this.cheapModel = options.cheapModel || process.env.OPENROUTER_CHEAP_MODEL || 'anthropic/claude-haiku-4-5-20251001';
    this.strongModel = options.strongModel || process.env.OPENROUTER_STRONG_MODEL || 'anthropic/claude-sonnet-4-20250514';
    this.appName = options.appName || 'OpenTutor';
    this._client = null;
  }

  async _getClient() {
    if (!this._client) {
      const { default: OpenAI } = await import('openai');
      this._client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseURL,
        defaultHeaders: {
          'HTTP-Referer': 'https://github.com/LEARNableLabs/opentutor',
          'X-Title': this.appName,
        },
      });
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
