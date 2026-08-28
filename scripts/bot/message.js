/**
 * Structured message delivery for conversational replies.
 * A leading icon marks each independently delivered section.
 */

const ANCHORS = ['🧭', '🎯', '🧠', '💡', '❓', '✏️', '📌'];
const TELEGRAM_SAFE_LIMIT = 3_900;
const NUMBERED_OPTION = /^\s*(?:[1-9](?:\ufe0f?\u20e3)?[.)]?|[A-D][.)])\s+/i;
const NUMBERED_CHOICE = /^\s*([1-9])(?:\ufe0f?\u20e3|[.)])\s+(.+)/;

export function buildNumberChoiceButtons(text) {
  const choices = [];
  let groups = 0;
  let previous = 0;

  for (const line of String(text).split('\n')) {
    const match = line.match(NUMBERED_CHOICE);
    if (!match) continue;
    const number = Number(match[1]);
    if (!choices.length || number <= previous) groups += 1;
    choices.push(number);
    previous = number;
  }

  if (groups !== 1 || choices.length < 2 || new Set(choices).size !== choices.length) return [];

  const buttons = choices.map((number) => ({
    text: String(number),
    callback_data: `ot_${number}`,
  }));
  const rows = [];
  for (let index = 0; index < buttons.length; index += 4) {
    rows.push(buttons.slice(index, index + 4));
  }
  return rows;
}

export function normalizeTelegramText(text) {
  const html = String(text)
    .replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>')
    .replace(/__([^_\n]+)__/g, '<b>$1</b>');
  const lines = html.split('\n');
  const spaced = [];

  for (const line of lines) {
    if (NUMBERED_OPTION.test(line) && spaced.length && spaced.at(-1).trim()) {
      spaced.push('');
    }
    spaced.push(line);
  }

  return spaced.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function stripTelegramHtml(text) {
  return String(text)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"');
}

function splitForTelegram(text) {
  const parts = [];
  let remaining = text.trim();
  while (remaining.length > TELEGRAM_SAFE_LIMIT) {
    const window = remaining.slice(0, TELEGRAM_SAFE_LIMIT + 1);
    const boundary = Math.max(window.lastIndexOf('\n'), window.lastIndexOf(' '));
    const index = boundary > 0 ? boundary : TELEGRAM_SAFE_LIMIT;
    parts.push(remaining.slice(0, index).trim());
    remaining = remaining.slice(index).trim();
  }
  if (remaining) parts.push(remaining);
  return parts;
}

export function splitStructuredMessage(text) {
  const chunks = [];
  let current = null;

  for (const line of text.split('\n')) {
    const anchor = ANCHORS.find((icon) => line.trimStart().startsWith(icon));
    if (anchor) {
      if (current?.text.trim()) chunks.push({ ...current, text: current.text.trim() });
      current = { anchor, text: `${line}\n` };
    } else if (current) {
      current.text += `${line}\n`;
    } else {
      current = { anchor: null, text: `${line}\n` };
    }
  }

  if (current?.text.trim()) chunks.push({ ...current, text: current.text.trim() });
  return chunks.length ? chunks : [{ anchor: null, text: text.trim() }];
}

export async function sendStructuredMessage(channel, chatId, text, options = {}) {
  const chunks = splitStructuredMessage(normalizeTelegramText(text));
  const messages = chunks.flatMap((chunk) => splitForTelegram(chunk.text));
  let sentCount = 0;
  for (let index = 0; index < messages.length; index += 1) {
    const messageOptions = { ...options };
    if (index !== messages.length - 1) delete messageOptions.buttons;
    await channel.sendMessage(chatId, messages[index], messageOptions);
    sentCount += 1;
  }
  return sentCount;
}
