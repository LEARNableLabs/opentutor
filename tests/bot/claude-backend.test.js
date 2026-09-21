import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// The bot must honour the project-wide OPENTUTOR_LLM rather than only its own
// CLAUDE_BACKEND, and must keep wrapping every prompt in the safety boundary.
//
// The real adapter factory does the resolving — only the network leaf is stubbed —
// so this exercises the actual selection logic, not a re-implementation of it.

const used = [];
const calls = [];

vi.mock('../../lib/adapters/index.js', async (importOriginal) => {
  const real = await importOriginal();
  const wrap = (factory) => (...args) => {
    const adapter = factory(...args);
    used.push(adapter.name);
    adapter.generate = async (system, messages, options) => {
      calls.push({ name: adapter.name, system, messages, options });
      return { text: 'ok', model: adapter.name, usage: null };
    };
    return adapter;
  };
  return {
    ...real,
    createAdapterFromEnv: wrap(real.createAdapterFromEnv),
    createPipelineAdapterFromEnv: wrap(real.createPipelineAdapterFromEnv),
  };
});

vi.mock('../../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const { generate } = await import('../../scripts/bot/claude.js');

const LLM_VARS = ['OPENTUTOR_LLM', 'CLAUDE_BACKEND', 'OPENTUTOR_PIPELINE_LLM', 'CLAUDE_PIPELINE_BACKEND',
  'ANTHROPIC_API_KEY', 'OPENROUTER_API_KEY', 'OPENAI_API_KEY'];

beforeEach(() => {
  used.length = 0;
  calls.length = 0;
  for (const v of LLM_VARS) vi.stubEnv(v, '');
});
afterEach(() => vi.unstubAllEnvs());

const ask = (options = {}) => generate('SYSTEM', [{ role: 'user', content: 'hi' }], { outputMode: 'student', ...options });

describe('backend selection', () => {
  it('honours OPENTUTOR_LLM', async () => {
    vi.stubEnv('OPENTUTOR_LLM', 'openrouter');
    await ask();
    expect(used).toEqual(['openrouter']);
  });

  it("still honours the bot's historical CLAUDE_BACKEND=sdk", async () => {
    vi.stubEnv('CLAUDE_BACKEND', 'sdk');
    await ask();
    expect(used).toEqual(['claude-sdk']);
  });

  it('prefers OPENTUTOR_LLM over CLAUDE_BACKEND', async () => {
    vi.stubEnv('OPENTUTOR_LLM', 'ollama');
    vi.stubEnv('CLAUDE_BACKEND', 'sdk');
    await ask();
    expect(used).toEqual(['ollama']);
  });

  it('infers the backend from whichever API key is present', async () => {
    vi.stubEnv('OPENROUTER_API_KEY', 'sk-or-test');
    await ask();
    expect(used).toEqual(['openrouter']);
  });

  it('falls back to the CLI when nothing is configured', async () => {
    await ask();
    expect(used).toEqual(['claude-cli']);
  });

  it('lets the pipeline use its own backend', async () => {
    vi.stubEnv('OPENTUTOR_LLM', 'cli');
    vi.stubEnv('OPENTUTOR_PIPELINE_LLM', 'claude-sdk');
    await ask({ pipeline: true });
    expect(used).toEqual(['claude-sdk']);
  });
});

describe('prompt safety', () => {
  beforeEach(() => vi.stubEnv('OPENTUTOR_LLM', 'openrouter'));

  it('wraps the caller prompt in the safety boundary and output contract', async () => {
    await ask();
    const { system } = calls[0];
    expect(system).toContain('SYSTEM');
    expect(system).toContain('Non-negotiable safety boundary');
    expect(system).toContain('sent directly to the student');
  });

  it('applies the JSON contract when asked', async () => {
    await ask({ outputMode: 'json' });
    expect(calls[0].system).toContain('exactly one valid JSON value');
    expect(calls[0].system).not.toContain('sent directly to the student');
  });

  it('passes the model tier through to the adapter', async () => {
    await ask({ model: 'strong' });
    expect(calls[0].options).toMatchObject({ model: 'strong' });
  });
});
