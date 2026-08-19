/**
 * Base channel interface — all channels implement these methods.
 * Telegram is first; Slack, WhatsApp, etc. follow the same shape.
 */

export class BaseChannel {
  constructor(name) {
    this.name = name;
  }

  /** Start listening for incoming messages */
  async start() { throw new Error('not implemented'); }

  /** Stop listening */
  async stop() { throw new Error('not implemented'); }

  /** Send a text message (HTML formatted) */
  async sendMessage(_chatId, _text, _options = {}) { throw new Error('not implemented'); }

  /** Send multiple messages sequentially with delays */
  async sendChunked(chatId, messages, delayMs = 2000) {
    for (let i = 0; i < messages.length; i++) {
      await this.sendMessage(chatId, messages[i].text, messages[i].options);
      if (i < messages.length - 1) await sleep(delayMs);
    }
  }

  /** Send a quiz or regular poll */
  async sendPoll(_chatId, _question, _options, _quizOptions = {}) { throw new Error('not implemented'); }

  /** Send a photo (for LaTeX, progress cards, etc.) */
  async sendPhoto(_chatId, _photoPath, _caption = '') { throw new Error('not implemented'); }

  /** Acknowledge a callback (button tap) */
  async answerCallback(_callbackId, _text = '') { throw new Error('not implemented'); }

  /** Show "typing..." indicator */
  async sendTyping(_chatId) { throw new Error('not implemented'); }

  /** Register slash commands for autocomplete */
  async registerCommands(_commands) { throw new Error('not implemented'); }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
