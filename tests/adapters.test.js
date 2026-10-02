import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';
import { spawn } from 'child_process';
import {
  createAdapter,
  createAdapterFromEnv,
  createPipelineAdapterFromEnv,
  ClaudeCLIAdapter,
  ClaudeSDKAdapter,
  OpenAIAdapter,
  OpenRouterAdapter,
  OllamaAdapter,
  BaseLLMAdapter,
} from '../lib/adapters/index.js';

// The CLI adapter's `claude` process, faked; only the timeout test below starts one.
vi.mock('child_process', async (importOriginal) => ({ ...(await importOriginal()), spawn: vi.fn() }));

describe('createAdapter', () => {
  it('creates ClaudeCLIAdapter for "cli"', () => {
    const adapter = createAdapter('cli');
    expect(adapter).toBeInstanceOf(ClaudeCLIAdapter);
    expect(adapter.name).toBe('claude-cli');
  });

  it('creates ClaudeCLIAdapter for "claude-cli"', () => {
    const adapter = createAdapter('claude-cli');
    expect(adapter).toBeInstanceOf(ClaudeCLIAdapter);
  });

  it('creates ClaudeSDKAdapter for "sdk"', () => {
    const adapter = createAdapter('sdk');
    expect(adapter).toBeInstanceOf(ClaudeSDKAdapter);
    expect(adapter.name).toBe('claude-sdk');
  });

  it('creates ClaudeSDKAdapter for "claude-sdk"', () => {
    const adapter = createAdapter('claude-sdk');
    expect(adapter).toBeInstanceOf(ClaudeSDKAdapter);
  });

  it('creates OpenAIAdapter for "openai"', () => {
    const adapter = createAdapter('openai');
    expect(adapter).toBeInstanceOf(OpenAIAdapter);
    expect(adapter.name).toBe('openai');
  });

  it('creates OpenRouterAdapter for "openrouter"', () => {
    const adapter = createAdapter('openrouter');
    expect(adapter).toBeInstanceOf(OpenRouterAdapter);
    expect(adapter.name).toBe('openrouter');
  });

  it('creates OllamaAdapter for "ollama"', () => {
    const adapter = createAdapter('ollama');
    expect(adapter).toBeInstanceOf(OllamaAdapter);
    expect(adapter.name).toBe('ollama');
  });

  it('throws for unknown backend', () => {
    expect(() => createAdapter('invalid')).toThrow('Unknown LLM backend');
    expect(() => createAdapter('invalid')).toThrow('invalid');
  });

  it('passes options to adapter', () => {
    const adapter = createAdapter('ollama', { baseURL: 'http://custom:1234' });
    expect(adapter.baseURL).toBe('http://custom:1234');
  });
});

describe('createAdapterFromEnv', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('defaults to CLI when no env vars set', () => {
    delete process.env.OPENTUTOR_LLM;
    delete process.env.CLAUDE_BACKEND;
    const adapter = createAdapterFromEnv();
    expect(adapter).toBeInstanceOf(ClaudeCLIAdapter);
  });

  it('reads OPENTUTOR_LLM', () => {
    process.env.OPENTUTOR_LLM = 'openai';
    const adapter = createAdapterFromEnv();
    expect(adapter).toBeInstanceOf(OpenAIAdapter);
  });

  it('OPENTUTOR_LLM takes precedence over CLAUDE_BACKEND', () => {
    process.env.OPENTUTOR_LLM = 'ollama';
    process.env.CLAUDE_BACKEND = 'sdk';
    const adapter = createAdapterFromEnv();
    expect(adapter).toBeInstanceOf(OllamaAdapter);
  });

  it('falls back to CLAUDE_BACKEND', () => {
    delete process.env.OPENTUTOR_LLM;
    process.env.CLAUDE_BACKEND = 'sdk';
    const adapter = createAdapterFromEnv();
    expect(adapter).toBeInstanceOf(ClaudeSDKAdapter);
  });
});

describe('createPipelineAdapterFromEnv', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('reads OPENTUTOR_PIPELINE_LLM first', () => {
    process.env.OPENTUTOR_PIPELINE_LLM = 'openrouter';
    process.env.OPENTUTOR_LLM = 'cli';
    const adapter = createPipelineAdapterFromEnv();
    expect(adapter).toBeInstanceOf(OpenRouterAdapter);
  });

  it('falls back to OPENTUTOR_LLM', () => {
    delete process.env.OPENTUTOR_PIPELINE_LLM;
    delete process.env.CLAUDE_PIPELINE_BACKEND;
    process.env.OPENTUTOR_LLM = 'openai';
    const adapter = createPipelineAdapterFromEnv();
    expect(adapter).toBeInstanceOf(OpenAIAdapter);
  });

  // #207: with only a key set, courses were built through the Claude CLI while lessons used the key.
  it('infers the backend from the key, as lessons do, when none is named', () => {
    for (const name of ['OPENTUTOR_PIPELINE_LLM', 'CLAUDE_PIPELINE_BACKEND', 'OPENTUTOR_LLM', 'CLAUDE_BACKEND', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY']) delete process.env[name];
    process.env.OPENROUTER_API_KEY = 'sk-or-test';
    expect(createPipelineAdapterFromEnv()).toBeInstanceOf(OpenRouterAdapter);
  });
});

describe('BaseLLMAdapter', () => {
  it('throws on generate()', async () => {
    const base = new BaseLLMAdapter();
    await expect(base.generate('sys', [])).rejects.toThrow('not implemented');
  });
});

describe('Adapter defaults', () => {
  it('ClaudeSDKAdapter has correct default models', () => {
    const adapter = createAdapter('claude-sdk');
    expect(adapter.cheapModel).toContain('haiku');
    expect(adapter.strongModel).toContain('sonnet');
  });

  it('OpenRouterAdapter defaults to ids OpenRouter actually accepts', () => {
    const adapter = createAdapter('openrouter');
    // OpenRouter ids carry no date suffix; the Anthropic API form 400s here.
    for (const model of [adapter.cheapModel, adapter.strongModel]) {
      expect(model).toMatch(/^[a-z0-9-]+\/[a-z0-9.-]+$/); // provider/model
      expect(model).not.toMatch(/-\d{8}$/);
    }
  });

  it('OllamaAdapter has default baseURL', () => {
    const adapter = createAdapter('ollama');
    expect(adapter.baseURL).toBe('http://localhost:11434');
  });
});

describe('OpenAI-compatible generate()', () => {
  afterEach(() => vi.unstubAllGlobals());

  const apiReply = (body, status = 200) => vi.fn(async () => new Response(JSON.stringify(body), { status }));

  it('OpenRouterAdapter posts the conversation to OpenRouter and maps the reply', async () => {
    const fetchMock = apiReply({ choices: [{ message: { content: 'Hello' } }], usage: { prompt_tokens: 12, completion_tokens: 3 } });
    vi.stubGlobal('fetch', fetchMock);
    const adapter = new OpenRouterAdapter({ apiKey: 'secret', cheapModel: 'deepseek/deepseek-v4.1-flash' });

    const result = await adapter.generate('SYSTEM', [{ role: 'user', content: 'hi' }], { model: 'cheap' });

    expect(result).toEqual({ text: 'Hello', model: 'deepseek/deepseek-v4.1-flash', usage: { input_tokens: 12, output_tokens: 3 } });
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(request.headers.Authorization).toBe('Bearer secret');
    expect(JSON.parse(request.body)).toMatchObject({
      model: 'deepseek/deepseek-v4.1-flash',
      messages: [{ role: 'system', content: 'SYSTEM' }, { role: 'user', content: 'hi' }],
    });
  });

  // #239: the model OpenTutor runs on. A deployment missing the two env vars must not
  // quietly fall back to a far more expensive one.
  it('OpenRouterAdapter defaults both roles to DeepSeek V4.1 Flash', () => {
    vi.stubEnv('OPENROUTER_CHEAP_MODEL', '');
    vi.stubEnv('OPENROUTER_STRONG_MODEL', '');
    const adapter = new OpenRouterAdapter({ apiKey: 'secret' });
    vi.unstubAllEnvs();
    expect(adapter.cheapModel).toBe('deepseek/deepseek-v4.1-flash');
    expect(adapter.strongModel).toBe('deepseek/deepseek-v4.1-flash');
  });

  it('OpenAIAdapter picks the strong model when asked', async () => {
    const fetchMock = apiReply({ choices: [{ message: { content: 'ok' } }] });
    vi.stubGlobal('fetch', fetchMock);

    const result = await new OpenAIAdapter({ apiKey: 'k', strongModel: 'big', cheapModel: 'small' }).generate('s', [], { model: 'strong' });

    expect(result).toEqual({ text: 'ok', model: 'big', usage: null });
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.openai.com/v1/chat/completions');
  });

  it('OpenRouterAdapter never falls back to the OpenAI key', () => {
    vi.stubEnv('OPENAI_API_KEY', 'openai-secret');
    vi.stubEnv('OPENROUTER_API_KEY', '');
    try {
      expect(new OpenRouterAdapter().apiKey).toBeFalsy();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('surfaces an API error instead of returning empty text', async () => {
    vi.stubGlobal('fetch', apiReply({ error: { message: 'No auth credentials found' } }, 401));
    await expect(new OpenRouterAdapter({ apiKey: 'bad' }).generate('s', [], {})).rejects.toThrow('openrouter: HTTP 401');
  });

  it('keeps the HTTP status on adapter errors so a bad key can be told from an outage', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Insufficient credits', { status: 402 })));
    const err = await new OpenRouterAdapter({ apiKey: 'k' }).generate('s', [{ role: 'user', content: 'hi' }]).catch((e) => e);
    vi.unstubAllGlobals();
    expect(err.status).toBe(402);
    expect(err.message).toBe('openrouter: HTTP 402 Insufficient credits');
  });

  it('redacts anything shaped like an API key from adapter error text', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('bad key sk-or-v1-abcdef1234567890', { status: 401 })));
    const err = await new OpenRouterAdapter({ apiKey: 'k' }).generate('s', [{ role: 'user', content: 'hi' }]).catch((e) => e);
    vi.unstubAllGlobals();
    expect(err.status).toBe(401);
    expect(err.message).not.toContain('abcdef1234567890');
    expect(err.message).toContain('sk-…');
  });

  it('lets OPENROUTER_BASE_URL point OpenRouter calls at a stand-in', () => {
    vi.stubEnv('OPENROUTER_BASE_URL', 'http://localhost:3198/api/v1');
    expect(new OpenRouterAdapter({ apiKey: 'k' }).baseURL).toBe('http://localhost:3198/api/v1');
    vi.unstubAllEnvs();
  });
});

// Review of #230: the CLI adapter took its timeout only from the constructor, so a pipeline call's
// longer one never reached it.
describe('ClaudeCLIAdapter timeout', () => {
  it('honours a timeout given with the call', async () => {
    vi.useFakeTimers();
    const child = Object.assign(new EventEmitter(), { stdout: new EventEmitter(), stderr: new EventEmitter(), kill: vi.fn() });
    spawn.mockReturnValue(child);
    try {
      const reply = new ClaudeCLIAdapter().generate('system', [{ role: 'user', content: 'hi' }], { timeout: 200_000 });
      const settled = expect(reply).rejects.toThrow('timed out after 200000ms');
      await vi.advanceTimersByTimeAsync(120_000);
      expect(child.kill).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(80_000);
      await settled;
    } finally {
      vi.useRealTimers();
    }
  });
});

// #330: a curriculum build on Claude Code names the model for each tier.
describe('ClaudeCLIAdapter model', () => {
  const run = async (adapter, options) => {
    const child = Object.assign(new EventEmitter(), { stdout: new EventEmitter(), stderr: new EventEmitter(), kill: vi.fn() });
    spawn.mockReturnValue(child);
    const reply = adapter.generate('system', [{ role: 'user', content: 'hi' }], options);
    child.stdout.emit('data', 'ok');
    child.emit('close', 0);
    await reply;
    return spawn.mock.calls.at(-1)[1];
  };

  it('passes --model for the tier asked for, and nothing when none is set', async () => {
    const adapter = new ClaudeCLIAdapter({ strongModel: 'opus', cheapModel: 'haiku' });
    const strong = await run(adapter, { model: 'strong' });
    expect(strong.slice(strong.indexOf('--model'))).toEqual(['--model', 'opus']);
    expect((await run(adapter, { model: 'cheap' })).join(' ')).toContain('--model haiku');
    expect((await run(new ClaudeCLIAdapter(), { model: 'strong' })).includes('--model')).toBe(false);
  });
});
