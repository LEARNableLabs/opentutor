import { describe, it, expect } from 'vitest';
import { CurriculumPipeline } from '../lib/core/pipeline.js';

// #122 — the pipeline is a fixed loop: research, plan, build, critique, up to
// three times, regardless of what the Critic said. If one module is weak it
// rebuilds all 27 lessons; if the topic is narrow it still pays for three
// passes; if research comes back thin it builds on it anyway, because "go find
// more sources" is not a step the loop can take.
//
// Agentic mode lets an orchestrator call choose the next action instead. The
// bounds are the entire design — an orchestrator that can loop is one that can
// loop forever on someone's API key — so most of what is tested here is the
// refusal to keep going.

const CURRICULUM = { topic: 'Knot theory', lessons: [{ lesson: 1, title: 'Reidemeister moves' }] };

const payload = (over = {}) => JSON.stringify({
  plan: 'PLAN', curriculum: CURRICULUM, resources: 'R', teacher: 'T',
  status: 'APPROVED', critique: 'CRITIQUE', ...over,
});

const fakeState = () => {
  const files = {};
  return {
    files,
    writeCurriculum: (slug, c) => { files[`${slug}/curriculum.json`] = c; },
    writeDomainFile: (slug, n, b) => { files[`${slug}/${n}`] = b; },
  };
};

/**
 * An adapter that answers orchestrator turns from a script and every other turn
 * with a normal payload. `calls` records what it was asked to do.
 */
function scripted(decisions, { approve = true } = {}) {
  const calls = [];
  let i = 0;
  return {
    calls,
    generate: async (system) => {
      const orchestrating = system.includes('ORCHESTRATOR');
      // The first line is the role header — a 24-char slice cut
      // "## Adversarial Curriculum Critic" before the word that identifies it.
      calls.push(orchestrating ? 'decide' : system.split('\n')[0]);
      if (!orchestrating) return { text: payload(approve ? {} : { status: 'REVISE' }), model: 'fake' };
      const next = decisions[Math.min(i++, decisions.length - 1)];
      return { text: typeof next === 'string' ? next : JSON.stringify(next), model: 'fake' };
    },
  };
}

const build = (adapter, mode) => {
  const state = fakeState();
  return {
    state,
    pipeline: new CurriculumPipeline({
      adapter, state, skills: { get: () => '' }, mode,
      research: async () => 'SOURCES',
    }),
  };
};

const run = (p) => p.run('Knot theory', 'knot-theory', 'beginner');

describe('mode selection', () => {
  it('is deterministic when nothing is asked for', async () => {
    const { pipeline } = build(scripted([]), undefined);
    expect(pipeline.mode).toBe('deterministic');
  });

  it('runs the old loop unchanged in deterministic mode', async () => {
    const adapter = scripted([]);
    const { pipeline } = build(adapter, 'deterministic');

    const result = await run(pipeline);

    expect(result.curriculum.lessons).toHaveLength(1);
    expect(adapter.calls, 'no orchestrator call in deterministic mode').not.toContain('decide');
  });
});

describe('agentic mode', () => {
  it('follows the orchestrator rather than the fixed sequence', async () => {
    const adapter = scripted([
      { action: 'plan', why: 'no plan yet' },
      { action: 'build', why: 'plan is sound' },
      { action: 'finish', why: 'good enough' },
    ]);
    const { pipeline } = build(adapter, 'agentic');

    const result = await run(pipeline);

    expect(result.curriculum.lessons).toHaveLength(1);
    expect(result.mode).toBe('agentic');
    expect(adapter.calls.filter((c) => c === 'decide').length).toBeGreaterThan(0);
  });

  it('can finish in one pass when the orchestrator says so', async () => {
    const adapter = scripted([
      { action: 'plan' }, { action: 'build' }, { action: 'finish' },
    ]);
    const { pipeline } = build(adapter, 'agentic');

    const result = await run(pipeline);

    // The point of the mode: a narrow topic does not pay for three critiques.
    expect(result.steps).toBeLessThan(6);
  });
});

describe('the bounds, which are the whole design', () => {
  it('stops at the step cap even if the orchestrator never says finish', async () => {
    const adapter = scripted([{ action: 'critique', why: 'again' }]);   // forever
    const { pipeline } = build(adapter, 'agentic');

    const result = await run(pipeline);

    expect(result.steps).toBeLessThanOrEqual(8);
    expect(result.stoppedBy).toBe('step-cap');
  });

  it('still returns a curriculum when the budget runs out', async () => {
    // Spending money and returning nothing is worse than returning a mediocre
    // curriculum, so the last good artifact ships.
    const adapter = scripted([{ action: 'plan' }, { action: 'build' }, { action: 'critique' }]);
    const { pipeline } = build(adapter, 'agentic');

    const result = await run(pipeline);

    expect(result.curriculum?.lessons ?? []).toHaveLength(1);
  });

  it('refuses to repeat an action when nothing new has happened', async () => {
    // Build first so the repeat is of an action that actually costs a model
    // call — asking to critique with nothing built is free, so a weaker script
    // would pass with the guard removed. (It did; mutation testing caught it.)
    const adapter = scripted([
      { action: 'plan' }, { action: 'build' },
      { action: 'critique' }, { action: 'critique' }, { action: 'critique' },
      { action: 'critique' }, { action: 'critique' }, { action: 'critique' },
    ]);
    const { pipeline } = build(adapter, 'agentic');

    await run(pipeline);

    const critiques = adapter.calls.filter((c) => /Critic/.test(c)).length;
    expect(critiques, 'the same critique, unchanged, must not be paid for twice').toBeLessThanOrEqual(1);
  });

  it('falls back to deterministic when the orchestrator returns nonsense twice', async () => {
    const adapter = scripted(['not json at all', 'still not json', 'nope']);
    const { pipeline } = build(adapter, 'agentic');

    const result = await run(pipeline);

    expect(result.curriculum.lessons).toHaveLength(1);
    expect(result.stoppedBy).toBe('fell-back');
  });

  it('ignores an action outside the closed set', async () => {
    const adapter = scripted([
      { action: 'rm -rf /', why: 'why not' },
      { action: 'plan' }, { action: 'build' }, { action: 'finish' },
    ]);
    const { pipeline } = build(adapter, 'agentic');

    const result = await run(pipeline);

    expect(result.curriculum.lessons).toHaveLength(1);
  });
});

describe('both modes', () => {
  it('produce a valid curriculum from the same adapter', async () => {
    const det = build(scripted([]), 'deterministic');
    const agt = build(scripted([{ action: 'plan' }, { action: 'build' }, { action: 'finish' }]), 'agentic');

    const [a, b] = [await run(det.pipeline), await run(agt.pipeline)];

    for (const r of [a, b]) {
      expect(r.curriculum.topic).toBeTruthy();
      expect(r.curriculum.lessons.length).toBeGreaterThan(0);
      expect(r.curriculum.preliminary).toBe(false);
    }
  });

  it('both write the curriculum to disk', async () => {
    const det = build(scripted([]), 'deterministic');
    const agt = build(scripted([{ action: 'plan' }, { action: 'build' }, { action: 'finish' }]), 'agentic');

    await run(det.pipeline);
    await run(agt.pipeline);

    expect(det.state.files['knot-theory/curriculum.json']).toBeTruthy();
    expect(agt.state.files['knot-theory/curriculum.json']).toBeTruthy();
  });
});
