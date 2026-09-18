/**
 * OpenAI adapter — calls the OpenAI chat-completions API (GPT models).
 * Supports Codex and any OpenAI-compatible endpoint; OpenRouter builds on it.
 *
 * Talks to the endpoint with native fetch, so no SDK dependency is needed.
 */

import { BaseLLMAdapter } from './base.js';

export class OpenAIAdapter extends BaseLLMAdapter {
  constructor(options = {}) {
    super({ name: 'openai', ...options });
    // A subclass that passes `apiKey` (even empty) must never inherit the OpenAI key
    this.apiKey = 'apiKey' in options ? options.apiKey : process.env.OPENAI_API_KEY;
    this.baseURL = options.baseURL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.cheapModel = options.cheapModel || process.env.OPENAI_CHEAP_MODEL || 'gpt-4o-mini';
    this.strongModel = options.strongModel || process.env.OPENAI_STRONG_MODEL || 'gpt-4o';
    this.headers = options.headers || {};
  }

  async generate(system, messages, options = {}) {
    const tier = options.model || 'cheap';
    const model = tier === 'strong' ? this.strongModel : this.cheapModel;

    // ponytail: single attempt, no retries — add backoff here if rate limits start to bite
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json', ...this.headers },
      body: JSON.stringify({
        model,
        max_tokens: options.maxTokens || (tier === 'strong' ? 4096 : 1024),
        messages: [{ role: 'system', content: system }, ...messages],
      }),
      signal: AbortSignal.timeout(options.timeout || 60000),
    });

    if (!response.ok) {
      throw new Error(`${this.name}: HTTP ${response.status} ${(await response.text()).slice(0, 300)}`);
    }

    const data = await response.json();
    return {
      text: data.choices?.[0]?.message?.content || '',
      model,
      usage: data.usage ? {
        input_tokens: data.usage.prompt_tokens,
        output_tokens: data.usage.completion_tokens,
      } : null,
    };
  }
}
