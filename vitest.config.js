import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    // scripts/bot/config.js exits at import without a token; tests must not depend on a local .env
    env: { TELEGRAM_BOT_TOKEN: 'test-token' },
  },
});
