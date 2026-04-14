/**
 * Telegram channel — Bot API via native fetch().
 * Supports long polling (default) and webhook mode.
 */

import { BaseChannel } from './base.js';

export class TelegramChannel extends BaseChannel {
  constructor({ token, chatId, mode = 'polling', onUpdate }) {
    super('telegram');
    this.token = token;
    this.chatId = chatId;
    this.mode = mode;
    this.onUpdate = onUpdate;
    this.api = `https://api.telegram.org/bot${token}`;
    this.offset = 0;
    this.running = false;
  }

  // ── Lifecycle ─────────────────────────────────────────────

  async start() {
    this.running = true;
    console.log(`  telegram: ${this.mode} mode`);
    if (this.mode === 'polling') this._poll();
  }

  async stop() {
    this.running = false;
  }

  // ── Polling ───────────────────────────────────────────────

  async _poll() {
    while (this.running) {
      try {
        const updates = await this._call('getUpdates', {
          offset: this.offset,
          timeout: 30,
          allowed_updates: ['message', 'callback_query', 'poll_answer'],
        });

        for (const update of updates) {
          this.offset = update.update_id + 1;

          // Restrict to configured chat if set
          const chatId = update.message?.chat?.id
            || update.callback_query?.message?.chat?.id;
          if (this.chatId && chatId && chatId !== this.chatId) continue;

          try {
            await this.onUpdate(update);
          } catch (err) {
            console.error('  telegram: handler error:', err.message);
          }
        }
      } catch (err) {
        console.error('  telegram: poll error:', err.message);
        await sleep(5000);
      }
    }
  }

  // ── Send methods ──────────────────────────────────────────

  async sendMessage(chatId, text, options = {}) {
    const body = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...options,
    };
    if (options.buttons) {
      body.reply_markup = { inline_keyboard: options.buttons };
      delete body.buttons;
    }
    if (options.disablePreview === false) {
      // keep preview (default for plain URLs)
    } else if (text.includes('<a href=')) {
      body.disable_web_page_preview = true;
    }
    return this._call('sendMessage', body);
  }

  async sendPoll(chatId, question, pollOptions, quiz = {}) {
    const body = {
      chat_id: chatId,
      question,
      options: pollOptions,
      is_anonymous: false,
    };
    if (quiz.correctOptionId !== undefined) {
      body.type = 'quiz';
      body.correct_option_id = quiz.correctOptionId;
      if (quiz.explanation) body.explanation = quiz.explanation;
    }
    return this._call('sendPoll', body);
  }

  async sendPhoto(chatId, photoSource, caption = '') {
    // photoSource can be a file path or URL
    // For file uploads, use multipart form data
    const form = new FormData();
    form.append('chat_id', chatId);
    if (caption) {
      form.append('caption', caption);
      form.append('parse_mode', 'HTML');
    }

    if (typeof photoSource === 'string' && photoSource.startsWith('http')) {
      form.append('photo', photoSource);
    } else {
      const { createReadStream } = await import('fs');
      const blob = await import('fs/promises').then((f) => f.readFile(photoSource));
      form.append('photo', new Blob([blob]), 'photo.png');
    }

    const res = await fetch(`${this.api}/sendPhoto`, { method: 'POST', body: form });
    const data = await res.json();
    if (!data.ok) throw new Error(`sendPhoto: ${JSON.stringify(data)}`);
    return data.result;
  }

  async answerCallback(callbackId, text = '') {
    return this._call('answerCallbackQuery', {
      callback_query_id: callbackId,
      text,
    });
  }

  async sendTyping(chatId) {
    return this._call('sendChatAction', { chat_id: chatId, action: 'typing' });
  }

  async registerCommands(commands) {
    return this._call('setMyCommands', { commands });
  }

  async editMessageButtons(chatId, messageId, buttons = []) {
    return this._call('editMessageReplyMarkup', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: buttons },
    });
  }

  // ── Internal ──────────────────────────────────────────────

  async _call(method, body = {}) {
    const res = await fetch(`${this.api}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(`Telegram ${method}: ${data.description}`);
    return data.result;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
