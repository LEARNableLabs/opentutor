import { describe, it, expect } from 'vitest';
import { CurriculumPipeline } from '../lib/core/pipeline.js';

// #99 — the web and serverless surfaces both called pipeline.run(…, '').
// Two things went wrong and only one of them was obvious:
//   1. the Builder and Critic saw no sources, so the curriculum was invented
//   2. nothing wrote research.md, and prompts.js:158 has the *Teacher* read that
//      file — so every later lesson was ungrounded too, long after generation
// Only the bot passed research in, so only Telegram got a grounded tutor.
// The pipeline now researches for itself when a caller hands it nothing.

const RESPONSE = JSON.stringify({
  plan: 'PLAN',
  curriculum: { topic: 'Knot theory', lessons: [{ title: 'Reidemeister moves' }] },
  resources: 'RESOURCES',
  teacher: 'TEACHER',
  status: 'APPROVED',
  critique: 'CRITIQUE',
});

const fakeState = () => {
  const files = {};
  return {
    files,
    writeCurriculum: (slug, c) => { files[`${slug}/curriculum.json`] = c; },
    writeDomainFile: (slug, name, body) => { files[`${slug}/${name}`] = body; },
  };
};

const fakeAdapter = (seen) => ({
  generate: async (system) => { seen.push(system); return { text: RESPONSE, model: 'fake' }; },
});

const build = (research) => {
  const seen = [];
  const state = fakeState();
  return {
    seen,
    state,
    pipeline: new CurriculumPipeline({ adapter: fakeAdapter(seen), state, skills: { get: () => '' }, research }),
  };
};

describe('a pipeline given no research', () => {
  it('researches the topic itself', async () => {
    const calls = [];
    const { pipeline } = build(async (topic, level) => {
      calls.push({ topic, level });
      return '## arxiv\n- A survey of knot invariants';
    });

    await pipeline.run('Knot theory', 'knot-theory', 'beginner');

    expect(calls).toEqual([{ topic: 'Knot theory', level: 'beginner' }]);
  });

  it('puts what it found in front of the Builder and the Critic', async () => {
    const { pipeline, seen } = build(async () => 'SOURCES-FOUND');

    await pipeline.run('Knot theory', 'knot-theory', 'beginner');

    expect(seen.filter((s) => s.includes('SOURCES-FOUND')).length).toBeGreaterThan(1);
  });

  it('writes research.md, which is where the Teacher reads sources from later', async () => {
    const { pipeline, state } = build(async () => 'SOURCES-FOUND');

    await pipeline.run('Knot theory', 'knot-theory', 'beginner');

    expect(state.files['knot-theory/research.md']).toContain('SOURCES-FOUND');
  });

  it('still builds a curriculum when research fails', async () => {
    const { pipeline } = build(async () => { throw new Error('arxiv is down'); });

    const result = await pipeline.run('Knot theory', 'knot-theory', 'beginner');

    expect(result.curriculum.lessons).toHaveLength(1);
  });
});

describe('a pipeline given research', () => {
  it('uses the caller’s and does not research again', async () => {
    let called = false;
    const { pipeline, seen } = build(async () => { called = true; return 'FETCHED'; });

    await pipeline.run('Knot theory', 'knot-theory', 'beginner', 'CALLER-SUPPLIED');

    expect(called).toBe(false);
    expect(seen.some((s) => s.includes('CALLER-SUPPLIED'))).toBe(true);
  });

  it('does not overwrite the research.md the caller already wrote', async () => {
    const { pipeline, state } = build(async () => 'FETCHED');
    state.files['knot-theory/research.md'] = 'CALLER-WROTE-THIS';

    await pipeline.run('Knot theory', 'knot-theory', 'beginner', 'CALLER-SUPPLIED');

    expect(state.files['knot-theory/research.md']).toBe('CALLER-WROTE-THIS');
  });
});
