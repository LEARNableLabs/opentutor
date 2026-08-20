export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function retry(fn, { maxAttempts = 3, baseDelay = 1000, label = 'operation' } = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      const { log } = await import('./logger.js');
      log.warn({ err: err.message, attempt, maxAttempts, delay_ms: delay, label }, 'retrying');
      await sleep(delay);
    }
  }
}
