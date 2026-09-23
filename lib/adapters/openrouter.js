/**
 * OpenRouter adapter — access 200+ models through a single API.
 * Supports Claude, GPT, Llama, Mistral, Gemini, DeepSeek, and more.
 *
 * NOTE: OpenRouter model ids carry no date suffix — `anthropic/claude-haiku-4.5`,
 * not the Anthropic API's `anthropic/claude-haiku-4-5-20251001`. Using the latter
 * fails every call with HTTP 400 "not a valid model ID".
 *
 * OpenRouter speaks the OpenAI chat-completions protocol, so this is the
 * OpenAI adapter with OpenRouter's endpoint, key, models and attribution headers.
 */

import { OpenAIAdapter } from './openai.js';

export class OpenRouterAdapter extends OpenAIAdapter {
  constructor(options = {}) {
    const appName = options.appName || 'OpenTutor';
    super({
      ...options,
      name: 'openrouter',
      apiKey: options.apiKey || process.env.OPENROUTER_API_KEY,
      baseURL: options.baseURL || process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      cheapModel: options.cheapModel || process.env.OPENROUTER_CHEAP_MODEL || 'anthropic/claude-haiku-4.5',
      strongModel: options.strongModel || process.env.OPENROUTER_STRONG_MODEL || 'anthropic/claude-sonnet-5',
      headers: { 'HTTP-Referer': 'https://github.com/LEARNableLabs/opentutor', 'X-Title': appName, ...options.headers },
      // Reasoning models bill and bill *time* for tokens the student never sees:
      // measured at ~1040 hidden tokens against 900 visible, roughly doubling
      // latency. The tutor wants prose and JSON, not deliberation, so it is off
      // unless asked for. OPENROUTER_REASONING=1 re-enables it.
      extraBody: options.extraBody
        || (process.env.OPENROUTER_REASONING === '1' ? {} : { reasoning: { enabled: false } }),
    });
    this.appName = appName;
  }
}
