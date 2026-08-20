import { describe, it, expect, vi } from 'vitest';

vi.mock('../../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { sleep, retry } from '../../scripts/bot/helpers.js';

describe('sleep', () => {
  it('resolves after the given delay', async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });
});

describe('retry', () => {
  it('returns the result on first success', async () => {
    const fn = vi.fn(() => 42);
    const result = await retry(fn, { maxAttempts: 3, baseDelay: 10 });
    expect(result).toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds', async () => {
    let calls = 0;
    const fn = () => {
      calls++;
      if (calls < 3) throw new Error('fail');
      return 'ok';
    };
    const result = await retry(fn, { maxAttempts: 3, baseDelay: 10 });
    expect(result).toBe('ok');
    expect(calls).toBe(3);
  });

  it('throws after maxAttempts failures', async () => {
    const fn = () => { throw new Error('always fails'); };
    await expect(retry(fn, { maxAttempts: 2, baseDelay: 10 })).rejects.toThrow('always fails');
  });

  it('uses exponential backoff', async () => {
    const start = Date.now();
    let calls = 0;
    const fn = () => {
      calls++;
      if (calls < 3) throw new Error('fail');
      return 'ok';
    };
    await retry(fn, { maxAttempts: 3, baseDelay: 20 });
    const elapsed = Date.now() - start;
    // baseDelay=20: first retry ~20ms, second retry ~40ms = ~60ms total
    expect(elapsed).toBeGreaterThanOrEqual(40);
  });
});
