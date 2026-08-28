/**
 * Telegram channel — Bot API via native fetch().
 * Supports long polling (default) and webhook mode.
 */

import { BaseChannel } from './base.js';
import { log } from '../logger.js';
import { sleep, retry } from '../helpers.js';
import { normalizeTelegramText, stripTelegramHtml } from '../message.js';

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
    log.info({ mode: this.mode }, 'telegram channel started');
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
            log.error({ err, update_id: update.update_id }, 'telegram: handler error');
          }
        }
      } catch (err) {
        log.error({ err }, 'telegram: poll error');
        await sleep(5000);
      }
    }
  }

  // ── Send methods ──────────────────────────────────────────

  async sendMessage(chatId, text, options = {}) {
    const normalizedText = normalizeTelegramText(text);
    const body = {
      chat_id: chatId,
      text: normalizedText,
      parse_mode: 'HTML',
      ...options,
    };
    if (options.buttons) {
      body.reply_markup = { inline_keyboard: options.buttons };
      delete body.buttons;
    }
    if (options.disablePreview === false) {
      // keep preview (default for plain URLs)
    } else if (normalizedText.includes('<a href=')) {
      body.disable_web_page_preview = true;
    }
    try {
      return await this._call('sendMessage', body);
    } catch (err) {
      if (!String(err.message).includes("can't parse entities")) throw err;
      log.warn({ err }, 'telegram: invalid HTML, retrying as plain text');
      const fallback = { ...body, text: stripTelegramHtml(normalizedText) };
      delete fallback.parse_mode;
      return this._call('sendMessage', fallback);
    }
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
    return retry(async () => {
      const res = await fetch(`${this.api}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) return data.result;
      if (data.error_code === 429) {
        const retryAfter = data.parameters?.retry_after || 5;
        await sleep(retryAfter * 1000);
        throw new Error(`Telegram rate limited (retry_after: ${retryAfter}s)`);
      }
      throw new Error(`Telegram ${method}: ${data.description}`);
    }, { maxAttempts: 3, baseDelay: 1000, label: `telegram:${method}` });
  }
}
