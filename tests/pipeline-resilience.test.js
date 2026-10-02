import { describe, it, expect, vi } from 'vitest';
import { CurriculumPipeline } from '../lib/core/pipeline.js';
import { extractUrls } from '../lib/core/link-check.js';
import { DOMAIN_FILES_FORMAT } from '../lib/core/prompts.js';

// A rebuild of behavioral-economics shipped the output format's own text as resources.md and
// teacher.md (a 0.5 s reply that echoed the schema), and sent a valid DOI to the Critic as dead.

const CURRICULUM = { curriculum: { lessons: [{ day: 1, title: 'One', resources: ['https://example.org/a'] }] }, conceptMap: 'map', teachingNotes: 'notes' };
const RESOURCES = '# Resources\n- Kahneman, Thinking, Fast and Slow\n- https://doi.org/10.1016/0167-2681(80)90001-1';
const TEACHER = '# Teacher\nDebate and worked examples suit this subject.';

function make({ domainReplies, verifyUrls }) {
  const written = {};
  const replies = [...domainReplies];
  const adapter = { generate: vi.fn(async (system) => {
    if (system.includes('"teacher": "markdown')) return { text: replies.shift() };
    if (system.includes('Critic') || system.includes('critic')) return { text: JSON.stringify({ status: 'APPROVED', critique: 'ok' }) };
    if (system.includes('"curriculum"')) return { text: JSON.stringify(CURRICULUM) };
    return { text: JSON.stringify({ plan: 'plan' }) };
  }) };
  const state = { writeDomainFile: (_s, f, c) => { written[f] = c; }, writeCurriculum() {}, readCurriculum: () => null };
  const skills = { get: () => '' };
  return { pipeline: new CurriculumPipeline({ adapter, state, skills }), written, adapter, verifyUrls };
}

describe('domain files', () => {
  const echo = JSON.stringify(DOMAIN_FILES_FORMAT);
  const good = JSON.stringify({ resources: RESOURCES, teacher: TEACHER });

  it('asks again when the reply only repeats the output format, and keeps the real answer', async () => {
    const { pipeline, written, adapter } = make({ domainReplies: [echo, good] });
    await pipeline._build({ topic: 'T', slug: 't', studentLevel: 'beginner', researchContext: '', plan: 'p' });
    expect(written['resources.md']).toBe(RESOURCES);
    expect(written['teacher.md']).toBe(TEACHER);
    expect(adapter.generate.mock.calls.filter(([s]) => s.includes('"teacher": "markdown'))).toHaveLength(2);
  });

  it('tells the model what was wrong on the retry', async () => {
    const { pipeline, adapter } = make({ domainReplies: [echo, good] });
    await pipeline._build({ topic: 'T', slug: 't', studentLevel: 'beginner', researchContext: '', plan: 'p' });
    const asks = adapter.generate.mock.calls.filter(([s]) => s.includes('"teacher": "markdown')).map(([, m]) => m[0].content);
    expect(asks[1]).toMatch(/left resources and teacher empty or repeated the format's description/);
  });

  it('fails the build, writing no placeholder, when the retry echoes too', async () => {
    const { pipeline, written } = make({ domainReplies: [echo, echo] });
    await expect(pipeline._build({ topic: 'T', slug: 't', studentLevel: 'beginner', researchContext: '', plan: 'p' }))
      .rejects.toThrow('no valid resources or teacher config after a retry');
    expect(written['resources.md']).toBeUndefined();
    expect(written['teacher.md']).toBeUndefined();
  });

  it('fails the same way when the retry itself errors', async () => {
    const { pipeline, adapter } = make({ domainReplies: [echo] });
    const real = adapter.generate.getMockImplementation();
    let domainCalls = 0;
    adapter.generate.mockImplementation(async (system, ...rest) => {
      if (system.includes('"teacher": "markdown') && ++domainCalls === 2) throw new Error('timed out');
      return real(system, ...rest);
    });
    await expect(pipeline._build({ topic: 'T', slug: 't', studentLevel: 'beginner', researchContext: '', plan: 'p' }))
      .rejects.toThrow('after a retry');
  });

  it('keeps a real answer that repeats text from the research it was given', async () => {
    const copied = JSON.stringify({ resources: 'https://doi.org/10.5281/zenodo.1234', teacher: TEACHER });
    const { pipeline, written } = make({ domainReplies: [copied] });
    await pipeline._build({ topic: 'T', slug: 't', studentLevel: 'beginner', researchContext: 'https://doi.org/10.5281/zenodo.1234', plan: 'p' });
    expect(written['resources.md']).toBe('https://doi.org/10.5281/zenodo.1234');
  });
});

describe('URL extraction', () => {
  it('keeps the ")" inside a DOI and drops the one that closes a markdown link', () => {
    expect(extractUrls('see [paper](https://doi.org/10.1016/0167-2681(80)90001-1). Also https://example.org/a, and (https://example.org/b)'))
      .toEqual(['https://doi.org/10.1016/0167-2681(80)90001-1', 'https://example.org/a', 'https://example.org/b']);
  });
});

describe('URL extraction details', () => {
  it('preserves a literal resource URL with an unmatched closing parenthesis', () => {
    expect(extractUrls({ resources: ['https://example.org/archive/part)'] })).toEqual(['https://example.org/archive/part)']);
    expect(extractUrls('[archive](https://example.org/archive/part))')).toEqual(['https://example.org/archive/part)']);
    expect(extractUrls('Read https://example.org/paper。')).toEqual(['https://example.org/paper']);
  });
  it('drops sentence punctuation, decodes JSON slashes, and walks every string of a value', () => {
    expect(extractUrls('Read https://example.org/paper! Or "https://example.org/b?".')).toEqual(['https://example.org/paper', 'https://example.org/b']);
    expect(extractUrls('{"url":"https:\\/\\/example.org\\/x"}')).toEqual(['https://example.org/x']);
    expect(extractUrls({ lessons: [{ resources: ['https://a.example/1'], note: 'see (https://b.example/2)' }] })).toEqual(['https://a.example/1', 'https://b.example/2']);
  });
});

describe('URL verification across rounds', () => {
  it('passes verified dead URLs to the Critic in agentic mode', async () => {
    const { pipeline, adapter } = make({ domainReplies: [] });
    const verifyUrls = vi.fn(async (urls) => urls.map((url) => ({ url, ok: false })));
    const parsed = { resources: 'https://example.org/dead', curriculum: { lessons: [] } };
    const ctx = { topic: 'T', slug: 't', studentLevel: 'beginner', parsed };
    await pipeline._act('critique', ctx, { verifyUrls });
    expect(verifyUrls).toHaveBeenCalledWith(['https://example.org/dead']);
    expect(adapter.generate.mock.calls.at(-1)[0]).toContain('https://example.org/dead');
    expect(ctx.status).toBe('APPROVED');
  });
  it('checks each URL once per run and reports a dead one every round', async () => {
    const verifyUrls = vi.fn(async (urls) => urls.map((url) => ({ url, ok: !url.includes('dead') })));
    const { pipeline } = make({ domainReplies: [] });
    const parsed = { resources: 'https://example.org/dead and https://example.org/fine', curriculum: { lessons: [{ resources: ['https://example.org/lesson-dead'] }] } };
    expect(await pipeline._deadUrls(parsed, verifyUrls)).toEqual(['https://example.org/dead', 'https://example.org/lesson-dead']);
    expect(await pipeline._deadUrls(parsed, verifyUrls)).toEqual(['https://example.org/dead', 'https://example.org/lesson-dead']);
    expect(verifyUrls).toHaveBeenCalledTimes(1);
  });

  it('forgets the verdicts when the pipeline runs another topic', async () => {
    const verifyUrls = vi.fn(async (urls) => urls.map((url) => ({ url, ok: true })));
    const { pipeline } = make({ domainReplies: [] });
    const parsed = { resources: 'https://example.org/paper', curriculum: { lessons: [] } };
    await pipeline._deadUrls(parsed, verifyUrls);
    pipeline._urlVerdicts = undefined; // what run() does first
    await pipeline.run('T', 't', 'beginner', 'research', { verifyUrls }).catch(() => {});
    expect(pipeline._urlVerdicts).toBeInstanceOf(Map);
  });
});
