import { it, expect } from 'vitest';
import { CurriculumPipeline } from '../lib/core/pipeline.js';

// #226: the builder's JSON for a full course is longer than 4,096 tokens, the adapters' default
// for the strong tier, so every build was cut off mid-JSON and failed to parse.
const make = (calls) => new CurriculumPipeline({
  adapter: { generate: async (system, messages, options) => { calls.push(options); return { text: '{}', model: 'fake' }; } },
  state: {},
  skills: { get: () => '' },
});

it('gives every pipeline call room for a full course', async () => {
  const calls = [];
  await make(calls).generate('system', [{ role: 'user', content: 'build' }], { model: 'strong', outputMode: 'json' });
  expect(calls[0].maxTokens).toBeGreaterThanOrEqual(16384);
  expect(calls[0]).toMatchObject({ model: 'strong', outputMode: 'json' });
});

it('keeps a limit a caller asks for', async () => {
  const calls = [];
  await make(calls).generate('system', [], { maxTokens: 512 });
  expect(calls[0].maxTokens).toBe(512);
});

it('tells the critic which lessons are already the student\'s', async () => {
  const seen = [];
  const pipeline = new CurriculumPipeline({
    adapter: { generate: async (system, messages) => { seen.push(messages.at(-1).content); return { text: 'APPROVED', model: 'fake' }; } },
    state: { writeDomainFile: () => {} },
    skills: { get: () => '' },
  });
  await pipeline._critique({ topic: 'Knots', plan: '', parsed: { curriculum: { lessons: [] } }, fixedLessons: 5 });
  expect(seen[0]).toMatch(/first 5 lessons are already published/);
});
