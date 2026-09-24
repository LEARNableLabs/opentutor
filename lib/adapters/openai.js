/**
 * OpenAI adapter — calls the OpenAI chat-completions API (GPT models).
 * Supports Codex and any OpenAI-compatible endpoint; OpenRouter builds on it.
 *
 * Talks to the endpoint with native fetch, so no SDK dependency is needed.
 *
 * Streaming is opt-in: pass `onToken` and the response is streamed, with the
 * callback fired per chunk. The return value is identical either way, so a
 * caller that doesn't care about streaming never has to know about it.
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
    this.extraBody = options.extraBody || {};
  }

  async generate(system, messages, options = {}) {
    const tier = options.model || 'cheap';
    const model = tier === 'strong' ? this.strongModel : this.cheapModel;
    const streaming = typeof options.onToken === 'function';

    const body = {
      model,
      max_tokens: options.maxTokens || (tier === 'strong' ? 4096 : 1024),
      messages: [{ role: 'system', content: system }, ...messages],
      ...this.extraBody,
    };
    if (streaming) {
      body.stream = true;
      // Most OpenAI-compatible providers only send usage on a stream if asked.
      body.stream_options = { include_usage: true };
    }

    // ponytail: single attempt, no retries — add backoff here if rate limits start to bite
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json', ...this.headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(options.timeout || (tier === 'strong' ? 120_000 : 60_000)),
    });

    if (!response.ok) {
      const err = new Error(`${this.name}: HTTP ${response.status} ${(await response.text()).slice(0, 300).replace(/sk-[\w-]{8,}/g, 'sk-…')}`);
      err.status = response.status; // lets callers tell a rejected key (401/402) from an outage
      throw err;
    }

    return streaming
      ? this._readStream(response, model, options.onToken)
      : this._readWhole(response, model);
  }

  async _readWhole(response, model) {
    const data = await response.json();
    return {
      text: data.choices?.[0]?.message?.content || '',
      model,
      usage: toUsage(data.usage),
    };
  }

  async _readStream(response, model, onToken) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let text = '';
    let usage = null;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE frames are separated by a blank line; a frame can arrive split
      // across reads, so only consume up to the last complete separator.
      let cut;
      while ((cut = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, cut);
        buffer = buffer.slice(cut + 2);

        for (const line of frame.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;

          let parsed;
          try { parsed = JSON.parse(payload); } catch { continue; }

          const chunk = parsed.choices?.[0]?.delta?.content;
          if (chunk) { text += chunk; onToken(chunk); }
          if (parsed.usage) usage = toUsage(parsed.usage);
        }
      }
    }

    return { text, model, usage };
  }
}

function toUsage(usage) {
  return usage ? { input_tokens: usage.prompt_tokens, output_tokens: usage.completion_tokens } : null;
}
