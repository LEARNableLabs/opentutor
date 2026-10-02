import { describe, it, expect, vi } from 'vitest';
import { CurriculumPipeline, extractUrls } from '../lib/core/pipeline.js';

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
  const echo = JSON.stringify({ resources: 'markdown — curated books, papers, videos, tools. Only real URLs.', teacher: 'markdown — DOMAIN-ONLY teaching config. What\'s intrinsic to the subject, NOT the student.' });
  const good = JSON.stringify({ resources: RESOURCES, teacher: TEACHER });

  it('asks again when the reply only repeats the output format, and keeps the real answer', async () => {
    const { pipeline, written, adapter } = make({ domainReplies: [echo, good] });
    await pipeline._build({ topic: 'T', slug: 't', studentLevel: 'beginner', researchContext: '', plan: 'p' });
    expect(written['resources.md']).toBe(RESOURCES);
    expect(written['teacher.md']).toBe(TEACHER);
    expect(adapter.generate.mock.calls.filter(([s]) => s.includes('"teacher": "markdown'))).toHaveLength(2);
  });

  it('writes no placeholder when the retry echoes too', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { pipeline, written } = make({ domainReplies: [echo, echo] });
    await pipeline._build({ topic: 'T', slug: 't', studentLevel: 'beginner', researchContext: '', plan: 'p' });
    expect(written['resources.md']).toBeUndefined();
    expect(written['teacher.md']).toBeUndefined();
    expect(error).toHaveBeenCalledWith(expect.stringContaining('no valid resources or teacher config'));
    error.mockRestore();
  });
});

describe('URL extraction', () => {
  it('keeps the ")" inside a DOI and drops the one that closes a markdown link', () => {
    expect(extractUrls('see [paper](https://doi.org/10.1016/0167-2681(80)90001-1). Also https://example.org/a, and (https://example.org/b)'))
      .toEqual(['https://doi.org/10.1016/0167-2681(80)90001-1', 'https://example.org/a', 'https://example.org/b']);
  });
});

describe('URL verification across rounds', () => {
  it('checks each URL once per run and reports a dead one every round', async () => {
    const verifyUrls = vi.fn(async (urls) => urls.map((url) => ({ url, ok: !url.includes('dead') })));
    const { pipeline } = make({ domainReplies: [] });
    const parsed = { resources: 'https://example.org/dead and https://example.org/fine', curriculum: { lessons: [{ resources: ['https://example.org/lesson-dead'] }] } };
    expect(await pipeline._deadUrls(parsed, verifyUrls)).toEqual(['https://example.org/dead', 'https://example.org/lesson-dead']);
    expect(await pipeline._deadUrls(parsed, verifyUrls)).toEqual(['https://example.org/dead', 'https://example.org/lesson-dead']);
    expect(verifyUrls).toHaveBeenCalledTimes(1);
  });
});
