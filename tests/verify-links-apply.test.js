import { it, expect } from 'vitest';
import { removeDeadJsonLinks, removeDeadMarkdownLinks, checkUrlQueue } from '../scripts/verify-links.js';

const cache = { 'https://dead.example/a': { status: 'dead' }, 'https://dead.example/b': { status: 'dead' } };

it('removes consecutive leading, middle, trailing and whole-array dead links without changing other JSON', () => {
  const input = '{\n  "leading": ["https://dead.example/a", "https://dead.example/b", "keep"],\n  "middle": ["a", "https://dead.example/a", "https://dead.example/b", "b"],\n  "trailing": ["keep", "https://dead.example/a", "https://dead.example/b"],\n  "all": ["https://dead.example/a", "https://dead.example/b"],\n  "nested": [{"resources": ["https://dead.example/a"]}],\n  "scalar": "https://dead.example/a"\n}\n';
  const out = removeDeadJsonLinks(input, cache);
  expect(JSON.parse(out)).toEqual({ leading: ['keep'], middle: ['a', 'b'], trailing: ['keep'], all: [], nested: [{ resources: [] }], scalar: 'https://dead.example/a' });
  expect(out).toContain('"leading": ["keep"]');
  expect(out).toContain('"nested": [{"resources": []}]');
  expect(out).toMatch(/\n}\n$/);
});

it('preserves unknown URLs and exact formatting when nothing is dead', () => {
  const input = '{ "resources": ["https:\\/\\/unknown.example\\/a"], "n": 1e3 }';
  expect(removeDeadJsonLinks(input, cache)).toBe(input);
});

it('retains resource labels and child descriptions when removing dead Markdown links', () => {
  const input = '- **Marlin** — https://dead.example/a\n  - Authoritative documentation\n\n- [RepRap](https://dead.example/b)\n  - Kinematics explanations\n- https://dead.example/a\n| Reference | https://dead.example/b | Useful background |\n';
  expect(removeDeadMarkdownLinks(input, cache)).toBe('- **Marlin**\n  - Authoritative documentation\n\n- RepRap\n  - Kinematics explanations\n| Reference |  | Useful background |\n');
});

it('leaves prose and resource rows containing live or unknown links unchanged', () => {
  const input = 'See https://dead.example/a for context.\n- Compare https://dead.example/a with https://unknown.example/a\n';
  expect(removeDeadMarkdownLinks(input, cache)).toBe(input);
});

it('checks every queued link within both the global and per-host concurrency caps', async () => {
  const queue = Array.from({ length: 40 }, (_, n) => ({ url: `https://host${n % 4}.example/${n}`, host: `host${n % 4}.example` }));
  const busy = new Map(), peaks = new Map(), results = {};
  let active = 0, peak = 0;
  await checkUrlQueue(queue, results, { workers: 3, pauseMs: 0, checkFn: async (url) => {
    const host = new URL(url).hostname;
    active++; peak = Math.max(peak, active);
    busy.set(host, (busy.get(host) || 0) + 1); peaks.set(host, Math.max(peaks.get(host) || 0, busy.get(host)));
    await new Promise((resolve) => setTimeout(resolve, 1));
    active--; busy.set(host, busy.get(host) - 1);
    return { status: 'ok' };
  } });
  expect(Object.keys(results)).toHaveLength(40);
  expect(peak).toBe(3);
  expect(Math.max(...peaks.values())).toBeLessThanOrEqual(2);
});
