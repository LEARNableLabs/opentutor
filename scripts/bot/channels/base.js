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
  async sendMessage(chatId, text, options = {}) { throw new Error('not implemented'); }

  /** Send multiple messages sequentially with delays */
  async sendChunked(chatId, messages, delayMs = 2000) {
    for (let i = 0; i < messages.length; i++) {
      await this.sendMessage(chatId, messages[i].text, messages[i].options);
      if (i < messages.length - 1) await sleep(delayMs);
    }
  }

  /** Send a quiz or regular poll */
  async sendPoll(chatId, question, options, quizOptions = {}) { throw new Error('not implemented'); }

  /** Send a photo (for LaTeX, progress cards, etc.) */
  async sendPhoto(chatId, photoPath, caption = '') { throw new Error('not implemented'); }

  /** Acknowledge a callback (button tap) */
  async answerCallback(callbackId, text = '') { throw new Error('not implemented'); }

  /** Show "typing..." indicator */
  async sendTyping(chatId) { throw new Error('not implemented'); }

  /** Register slash commands for autocomplete */
  async registerCommands(commands) { throw new Error('not implemented'); }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
