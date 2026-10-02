import { it, expect } from 'vitest';
import { removeDeadJsonLinks } from '../scripts/verify-links.js';

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
