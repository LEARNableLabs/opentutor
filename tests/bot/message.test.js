import { describe, expect, it, vi } from 'vitest';
import { buildNumberChoiceButtons, normalizeTelegramText, sendStructuredMessage, splitStructuredMessage, stripTelegramHtml } from '../../scripts/bot/message.js';

describe('splitStructuredMessage', () => {
  it('splits sections at structural icons', () => {
    const chunks = splitStructuredMessage('🧭 First point\nMore context\n🎯 - A\n- B\n❓ Which fits?');

    expect(chunks.map((chunk) => chunk.anchor)).toEqual(['🧭', '🎯', '❓']);
    expect(chunks[1].text).toContain('- A');
  });

  it('keeps an unstructured short message together', () => {
    expect(splitStructuredMessage('A short reply.')).toEqual([
      { anchor: null, text: 'A short reply.' },
    ]);
  });

  it('delivers each structured section as its own message', async () => {
    const channel = { sendMessage: vi.fn() };

    const count = await sendStructuredMessage(channel, 42, '🧠 Idea\n💡 Example');

    expect(count).toBe(2);
    expect(channel.sendMessage).toHaveBeenNthCalledWith(1, 42, '🧠 Idea', {});
    expect(channel.sendMessage).toHaveBeenNthCalledWith(2, 42, '💡 Example', {});
  });

  it('splits a long section below Telegram\'s message limit', async () => {
    const channel = { sendMessage: vi.fn() };
    const text = `🧠 ${'word '.repeat(1_000)}`;

    const count = await sendStructuredMessage(channel, 42, text);

    expect(count).toBeGreaterThan(1);
    expect(channel.sendMessage.mock.calls.every(([, part]) => part.length <= 3_900)).toBe(true);
  });

  it('converts Markdown bold and spaces numbered choices', () => {
    const normalized = normalizeTelegramText('**Choose one**\n1️⃣ First\n2️⃣ Second\n3. Third');

    expect(normalized).toBe('<b>Choose one</b>\n\n1️⃣ First\n\n2️⃣ Second\n\n3. Third');
  });

  it('can fall back from Telegram HTML to readable plain text', () => {
    expect(stripTelegramHtml('<b>Choose</b> 3 &lt; 5 &amp; continue')).toBe('Choose 3 < 5 & continue');
  });

  it('builds tappable number buttons for one unambiguous list', () => {
    expect(buildNumberChoiceButtons('Choose one:\n1. First\n2. Second\n3. Third')).toEqual([
      [
        { text: '1', callback_data: 'ot_1' },
        { text: '2', callback_data: 'ot_2' },
        { text: '3', callback_data: 'ot_3' },
      ],
    ]);
  });

  it('does not add ambiguous buttons when numbering restarts', () => {
    expect(buildNumberChoiceButtons('Goal:\n1. Work\n2. School\nLevel:\n1. New\n2. Advanced'))
      .toEqual([]);
  });

  it('attaches number buttons only to the final structured message', async () => {
    const channel = { sendMessage: vi.fn() };
    const buttons = [[{ text: '1', callback_data: 'ot_1' }]];

    await sendStructuredMessage(channel, 42, '🧭 Context\n❓ Choose', { buttons });

    expect(channel.sendMessage).toHaveBeenNthCalledWith(1, 42, '🧭 Context', {});
    expect(channel.sendMessage).toHaveBeenNthCalledWith(2, 42, '❓ Choose', { buttons });
  });
});
