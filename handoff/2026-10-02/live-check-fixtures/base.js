/**
 * Base LLM adapter — defines the interface all adapters must implement.
 * Each adapter wraps a specific LLM backend (Claude SDK, OpenAI, Ollama, etc.)
 * and exposes a single generate() method.
 */

export class BaseLLMAdapter {
  constructor(options = {}) {
    this.name = options.name || 'base';
  }

  /**
   * Generate a response from the LLM.
   * @param {string} system - System prompt
   * @param {Array<{role: string, content: string}>} messages - Conversation messages
   * @param {object} options
   * @param {'cheap'|'strong'} options.model - Model tier hint
   * @param {'student'|'json'} options.outputMode - Output format contract
   * @param {number} [options.maxTokens] - Max output tokens
   * @param {boolean} [options.webSearch] - Enable web search (if supported)
   * @returns {Promise<{text: string, model: string, usage: object|null}>}
   */
  async generate(_system, _messages, _options = {}) {
    throw new Error(`${this.name}: generate() not implemented`);
  }
}
