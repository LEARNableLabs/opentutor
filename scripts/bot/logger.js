import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import pino from 'pino';

const als = new AsyncLocalStorage();

const transport = process.env.NODE_ENV === 'development'
  ? { target: 'pino-pretty', options: { colorize: true } }
  : undefined;

export const logger = pino({
  name: 'opentutor-bot',
  transport,
  redact: {
    paths: [
      'token', 'password', 'api_key', 'apiKey',
      '*.token', '*.password', '*.api_key', '*.apiKey',
      'telegram_id', '*.telegram_id',
    ],
    censor: '[REDACTED]',
  },
});

export function runWithReqId(fn) {
  const correlationId = randomUUID().slice(0, 8);
  return als.run({ req_id: correlationId }, fn);
}

export const log = new Proxy(logger, {
  get(_, prop) {
    const store = als.getStore();
    const l = store?.req_id ? logger.child({ req_id: store.req_id }) : logger;
    const val = l[prop];
    return typeof val === 'function' ? val.bind(l) : val;
  },
});
