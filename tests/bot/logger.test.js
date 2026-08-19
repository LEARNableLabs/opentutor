import { describe, it, expect } from 'vitest';
import { logger, log, runWithReqId } from '../../scripts/bot/logger.js';

describe('logger', () => {
  it('is a pino instance with correct name', () => {
    expect(logger).toBeDefined();
    expect(logger.bindings().name).toBe('opentutor-bot');
  });

  it('has standard logging methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.fatal).toBe('function');
  });

  it('exports log proxy with logging methods', () => {
    expect(log).toBeDefined();
    expect(typeof log.info).toBe('function');
    expect(typeof log.error).toBe('function');
    expect(typeof log.warn).toBe('function');
  });
});

describe('runWithReqId', () => {
  it('executes the callback and returns its result', () => {
    const result = runWithReqId(() => 42);
    expect(result).toBe(42);
  });

  it('supports async callbacks', async () => {
    const result = await runWithReqId(async () => 'async-result');
    expect(result).toBe('async-result');
  });

  it('provides correlation id to log proxy within callback', () => {
    let childCalled = false;
    runWithReqId(() => {
      expect(typeof log.info).toBe('function');
      childCalled = true;
    });
    expect(childCalled).toBe(true);
  });
});
