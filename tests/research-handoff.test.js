import { afterEach, describe, expect, it, vi } from 'vitest';
import { researchTopic } from '../lib/core/research.js';
import { generateQuickStart } from '../lib/core/quick-start.js';

// Keep the real research/formatting/quick-start path; only external services are stubbed.
function sourceResponse(input) {
  const url = new URL(input);
  switch (url.hostname) {
    case 'export.arxiv.org':
      return new Response('<feed><entry><title>Arxiv knot invariants</title><summary>A source about knots</summary><published>2024-01-01</published><author><name>Ada</name></author><id>https://arxiv.org/abs/1234</id></entry></feed>');
    case 'api.semanticscholar.org':
      return Response.json({ data: [{ title: 'Scholar knot survey', authors: [], year: 2024 }] });
    case 'api.openalex.org':
      return Response.json({ results: url.pathname === '/topics'
        ? [{ display_name: 'OpenAlex topology', works_count: 42 }]
        : [{ title: 'OpenAlex knot paper', publication_year: 2024, cited_by_count: 200 }] });
    case 'en.wikipedia.org':
      return Response.json(url.pathname === '/w/api.php'
        ? { query: { pages: { 1: { links: [{ title: 'Reidemeister moves' }] } } } }
        : { title: 'Knot theory', extract: 'Wikipedia knot summary' });
    case 'ocw.mit.edu':
      return new Response('<a href="/courses/topology/">MIT topology course</a>');
    case 'html.duckduckgo.com':
      return new Response('<a href="https://www.edx.org/topology">Fallback topology course</a>');
    case 'vid.puffyan.us':
    case 'invidious.snopyta.org':
    case 'inv.nadeko.net':
      return Response.json([{ type: 'video', title: 'Knot video lecture', author: 'Tutor', lengthSeconds: 600, videoId: 'knots' }]);
    case 'api.github.com':
      return Response.json({ items: [{ full_name: 'knots/tutorial', stargazers_count: 50, html_url: 'https://github.com/knots/tutorial' }] });
    default:
      throw new Error(`Unexpected research URL: ${url}`);
  }
}

afterEach(() => vi.unstubAllGlobals());

describe('real research handoff to quick-start generation (#184)', () => {
  it('passes all eight source results to the model and returns them for persistence', async () => {
    vi.stubGlobal('fetch', vi.fn(sourceResponse));
    const adapter = { generate: vi.fn(async () => ({ text: JSON.stringify({
      taster: 'Welcome', roadmap: 'Explore knots',
      quickCurriculum: Array.from({ length: 5 }, (_, i) => ({ title: `Lesson ${i + 1}` })),
    }) })) };

    const result = await generateQuickStart({
      adapter, skills: new Map(), topic: 'Knot theory', slug: 'knot-theory',
    });

    expect(adapter.generate).toHaveBeenCalledOnce();
    const prompt = adapter.generate.mock.calls[0][0];
    for (const source of [
      'Arxiv knot invariants', 'Scholar knot survey', 'OpenAlex topology',
      'Wikipedia knot summary', 'MIT topology course', 'Knot video lecture',
      'knots/tutorial', 'Reidemeister moves',
    ]) {
      expect(prompt).toContain(source);
      expect(result.researchContext).toContain(source);
    }
    expect(result.curriculum.lessons).toHaveLength(5);
  });

  it('keeps successful sources and reaches the syllabus fallback when other sources fail or rate-limit', async () => {
    vi.stubGlobal('fetch', vi.fn((input) => {
      const { hostname } = new URL(input);
      if (hostname === 'ocw.mit.edu' || ['vid.puffyan.us', 'invidious.snopyta.org', 'inv.nadeko.net'].includes(hostname))
        throw new Error('Source unavailable');
      if (hostname === 'api.semanticscholar.org') return new Response('', { status: 429 });
      if (hostname === 'api.github.com') return new Response('', { status: 403 });
      return sourceResponse(input);
    }));

    const result = await researchTopic('Knot theory');

    expect(result.arxiv[0].title).toBe('Arxiv knot invariants');
    expect(result.syllabi[0].title).toBe('Fallback topology course');
    expect(result.semanticScholar).toEqual([]);
    expect(result.github).toEqual([]);
    expect(result.youtube).toEqual([]);
  });

  it('returns empty research without throwing when every source is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Offline'); }));

    await expect(researchTopic('Knot theory')).resolves.toEqual({
      arxiv: [], semanticScholar: [], wikipedia: null, openAlex: [],
      syllabi: [], youtube: [], github: [], wikiLinks: [],
    });
  });
});
