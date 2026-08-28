/** Keep Telegram's typing indicator active while a response is generated. */

export function keepTyping(channel, chatId) {
  const refresh = setInterval(() => {
    channel.sendTyping(chatId).catch(() => {});
  }, 4_000);
  return () => clearInterval(refresh);
}
