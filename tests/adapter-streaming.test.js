import { describe, it, expect, vi, afterEach } from 'vitest';
import { OpenAIAdapter, OpenRouterAdapter } from '../lib/adapters/index.js';

// Streaming is opt-in: pass `onToken` and the adapter streams, calling it per
// chunk. The return value is unchanged, so every existing caller is unaffected.

const sseBody = (chunks, { usage } = {}) => {
  const lines = chunks.map((c) => `data: ${JSON.stringify({ choices: [{ delta: { content: c } }] })}\n\n`);
  if (usage) lines.push(`data: ${JSON.stringify({ choices: [{ delta: {} }], usage })}\n\n`);
  lines.push('data: [DONE]\n\n');
  return new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      for (const l of lines) controller.enqueue(enc.encode(l));
      controller.close();
    },
  });
};

const stubFetch = (impl) => { const f = vi.fn(impl); vi.stubGlobal('fetch', f); return f; };
afterEach(() => vi.unstubAllGlobals());

describe('streaming', () => {
  it('calls onToken per chunk and still returns the whole text', async () => {
    stubFetch(async () => new Response(sseBody(['Hel', 'lo ', 'world'])));
    const seen = [];

    const result = await new OpenAIAdapter({ apiKey: 'k' })
      .generate('sys', [{ role: 'user', content: 'hi' }], { onToken: (t) => seen.push(t) });

    expect(seen).toEqual(['Hel', 'lo ', 'world']);
    expect(result.text).toBe('Hello world');
  });

  it('asks the API to stream only when onToken is given', async () => {
    const f = stubFetch(async () => new Response(sseBody(['x'])));
    await new OpenAIAdapter({ apiKey: 'k' }).generate('s', [], { onToken: () => {} });
    expect(JSON.parse(f.mock.calls[0][1].body).stream).toBe(true);

    vi.unstubAllGlobals();
    const g = stubFetch(async () => new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] })));
    await new OpenAIAdapter({ apiKey: 'k' }).generate('s', [], {});
    expect(JSON.parse(g.mock.calls[0][1].body).stream).toBeUndefined();
  });

  it('reports usage from the final chunk when the provider sends it', async () => {
    stubFetch(async () => new Response(sseBody(['a'], { usage: { prompt_tokens: 7, completion_tokens: 2 } })));
    const r = await new OpenAIAdapter({ apiKey: 'k' }).generate('s', [], { onToken: () => {} });
    expect(r.usage).toEqual({ input_tokens: 7, output_tokens: 2 });
  });

  it('survives a chunk split across network reads', async () => {
    // A single SSE frame arriving in two pieces must not be dropped or duplicated.
    const body = new ReadableStream({
      start(c) {
        const enc = new TextEncoder();
        c.enqueue(enc.encode('data: {"choices":[{"delta":{"content":"spl'));
        c.enqueue(enc.encode('it"}}]}\n\ndata: [DONE]\n\n'));
        c.close();
      },
    });
    stubFetch(async () => new Response(body));
    const seen = [];
    const r = await new OpenAIAdapter({ apiKey: 'k' }).generate('s', [], { onToken: (t) => seen.push(t) });
    expect(seen).toEqual(['split']);
    expect(r.text).toBe('split');
  });

  it('surfaces an HTTP error rather than a silent empty stream', async () => {
    stubFetch(async () => new Response('{"error":{"message":"nope"}}', { status: 429 }));
    await expect(
      new OpenRouterAdapter({ apiKey: 'k' }).generate('s', [], { onToken: () => {} }),
    ).rejects.toThrow(/HTTP 429/);
  });

  it('OpenRouter inherits streaming', async () => {
    stubFetch(async () => new Response(sseBody(['via ', 'openrouter'])));
    const seen = [];
    const r = await new OpenRouterAdapter({ apiKey: 'k' }).generate('s', [], { onToken: (t) => seen.push(t) });
    expect(r.text).toBe('via openrouter');
    expect(seen.length).toBe(2);
  });
});
