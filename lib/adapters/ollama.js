/**
 * Ollama adapter — calls local models via Ollama API.
 * No API key needed; requires Ollama running locally.
 */

import { BaseLLMAdapter } from './base.js';

export class OllamaAdapter extends BaseLLMAdapter {
  constructor(options = {}) {
    super({ name: 'ollama', ...options });
    this.baseURL = options.baseURL || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.cheapModel = options.cheapModel || process.env.OLLAMA_CHEAP_MODEL || 'llama3.2';
    this.strongModel = options.strongModel || process.env.OLLAMA_STRONG_MODEL || 'llama3.1:70b';
  }

  async generate(system, messages, options = {}) {
    const tier = options.model || 'cheap';
    const model = tier === 'strong' ? this.strongModel : this.cheapModel;

    const ollamaMessages = [
      { role: 'system', content: system },
      ...messages,
    ];

    const response = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: ollamaMessages,
        stream: false,
        options: {
          num_predict: options.maxTokens || (tier === 'strong' ? 4096 : 1024),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    return {
      text: data.message?.content || '',
      model,
      usage: data.eval_count ? {
        input_tokens: data.prompt_eval_count || 0,
        output_tokens: data.eval_count || 0,
      } : null,
    };
  }
}
