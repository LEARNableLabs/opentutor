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
