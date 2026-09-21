import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

  it('OpenRouterAdapter has correct default models', () => {
    const adapter = createAdapter('openrouter');
    expect(adapter.cheapModel).toContain('anthropic/');
    expect(adapter.strongModel).toContain('anthropic/');
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
});
