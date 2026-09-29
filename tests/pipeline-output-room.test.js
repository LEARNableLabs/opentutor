import { it, expect } from 'vitest';
import { CurriculumPipeline } from '../lib/core/pipeline.js';

// #226: the builder's JSON for a full course is longer than 4,096 tokens, the adapters' default
// for the strong tier, so every build was cut off mid-JSON and failed to parse.
const make = (calls) => new CurriculumPipeline({
  adapter: { generate: async (system, messages, options) => { calls.push(options); return { text: '{}', model: 'fake' }; } },
  state: {},
  skills: { get: () => '' },
});

it('gives every pipeline call room for a full course, and the time to write it', async () => {
  const calls = [];
  await make(calls).generate('system', [{ role: 'user', content: 'build' }], { model: 'strong', outputMode: 'json' });
  expect(calls[0].maxTokens).toBeGreaterThanOrEqual(16384);
  expect(calls[0]).toMatchObject({ model: 'strong', outputMode: 'json', timeout: 240_000 });
});

// Review of #230: a cheap model whose output tops out below 16,384 would refuse the call.
it('keeps the cheap model to a limit every current cheap model accepts', async () => {
  const calls = [];
  await make(calls).generate('system', [], { model: 'cheap' });
  await make(calls).generate('system', []); // the adapters' default tier is cheap
  expect(calls.map((c) => c.maxTokens)).toEqual([8192, 8192]);
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
  // Fixed is not exempt: an error in them is still named, and put right in a later lesson.
  expect(seen[0]).toMatch(/Still name any error in them, but ask for a later lesson to correct it/);
});

// Review of #230: the critic's copy of the course was cut at 20,000 characters, so a long course's
// last lessons were approved unseen. 60 lessons of 1,000 characters is about what 16,384 tokens hold.
it('shows the critic every lesson of a long course', async () => {
  const seen = [];
  const pipeline = new CurriculumPipeline({
    adapter: { generate: async (system) => { seen.push(system); return { text: 'APPROVED', model: 'fake' }; } },
    state: { writeDomainFile: () => {} },
    skills: { get: () => '' },
  });
  const lessons = Array.from({ length: 60 }, (_, i) => ({ day: i + 1, title: `Lesson ${i + 1}`, objectives: ['x'.repeat(950)] }));
  await pipeline._critique({ topic: 'Knots', plan: '', parsed: { curriculum: { lessons } } });
  expect(seen[0]).toContain('Lesson 60');
  expect(seen[0]).not.toContain('[reference data truncated]');
});
