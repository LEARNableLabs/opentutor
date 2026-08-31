import { vi, describe, it, expect } from 'vitest';

// Mock config and logger before importing research
vi.mock('../scripts/bot/config.js', () => ({
  PATHS: { root: '/tmp', domains: '/tmp/domains' },
  ROOT: '/tmp',
}));

vi.mock('../scripts/bot/logger.js', () => ({
  log: { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const { formatResearchContext } = await import('../scripts/bot/research.js');

// Helper to build a minimal results object
function makeResults(overrides = {}) {
  return {
    arxiv: [],
    semanticScholar: [],
    wikipedia: null,
    openAlex: [],
    syllabi: [],
    youtube: [],
    github: [],
    wikiLinks: [],
    ...overrides,
  };
}

describe('formatResearchContext', () => {
  it('returns empty string for empty results', () => {
    const result = formatResearchContext(makeResults());
    expect(result).toBe('');
  });

  it('formats Wikipedia overview', () => {
    const result = formatResearchContext(makeResults({
      wikipedia: {
        title: 'Quantum Mechanics',
        extract: 'Quantum mechanics is a fundamental theory...',
        url: 'https://en.wikipedia.org/wiki/Quantum_mechanics',
      },
    }));
    expect(result).toContain('## Wikipedia Overview');
    expect(result).toContain('**Quantum Mechanics**');
    expect(result).toContain('fundamental theory');
    expect(result).toContain('Source:');
  });

  it('formats arxiv papers', () => {
    const result = formatResearchContext(makeResults({
      arxiv: [
        {
          title: 'Attention Is All You Need',
          year: '2017',
          authors: ['Vaswani', 'Shazeer', 'Parmar', 'Uszkoreit'],
          summary: 'We propose a new architecture...',
          url: 'https://arxiv.org/abs/1706.03762',
        },
      ],
    }));
    expect(result).toContain('## Key Papers (arxiv)');
    expect(result).toContain('Attention Is All You Need');
    expect(result).toContain('2017');
    expect(result).toContain('et al.');
    expect(result).toContain('arxiv.org');
  });

  it('formats Semantic Scholar papers', () => {
    const result = formatResearchContext(makeResults({
      semanticScholar: [
        {
          title: 'Deep Learning',
          year: 2016,
          authors: ['LeCun', 'Bengio', 'Hinton'],
          citationCount: 50000,
          tldr: 'A review of deep learning methods.',
          url: 'https://semanticscholar.org/paper/123',
        },
      ],
    }));
    expect(result).toContain('## Highly Cited Papers');
    expect(result).toContain('Deep Learning');
    expect(result).toContain('50000 citations');
    expect(result).toContain('LeCun');
  });

  it('formats OpenAlex topics', () => {
    const result = formatResearchContext(makeResults({
      openAlex: [
        {
          type: 'topic',
          name: 'Machine Learning',
          description: 'Study of algorithms that improve...',
          worksCount: 100000,
          keywords: ['neural networks', 'deep learning'],
        },
      ],
    }));
    expect(result).toContain('## Related Academic Topics');
    expect(result).toContain('Machine Learning');
    expect(result).toContain('100000 works');
    expect(result).toContain('Keywords: neural networks');
  });

  it('formats OpenAlex works', () => {
    const result = formatResearchContext(makeResults({
      openAlex: [
        {
          type: 'work',
          name: 'ImageNet Classification',
          description: '2012 — 85000 citations',
          worksCount: 85000,
          authors: ['Krizhevsky', 'Sutskever', 'Hinton'],
          doi: 'https://doi.org/10.1234',
        },
      ],
    }));
    expect(result).toContain('## Highly Cited Works');
    expect(result).toContain('ImageNet Classification');
    expect(result).toContain('doi.org');
  });

  it('formats syllabi results', () => {
    const result = formatResearchContext(makeResults({
      syllabi: [
        {
          title: '18.01 Single Variable Calculus',
          provider: 'MIT OCW',
          url: 'https://ocw.mit.edu/courses/18-01',
          topics: ['limits', 'derivatives', 'integrals'],
        },
      ],
    }));
    expect(result).toContain('## Course Syllabi & Outlines');
    expect(result).toContain('18.01 Single Variable Calculus');
    expect(result).toContain('MIT OCW');
    expect(result).toContain('Topics: limits');
  });

  it('formats YouTube results', () => {
    const result = formatResearchContext(makeResults({
      youtube: [
        {
          title: 'Linear Algebra - Full Course',
          channel: '3Blue1Brown',
          url: 'https://www.youtube.com/watch?v=abc123',
        },
      ],
    }));
    expect(result).toContain('## Video Resources (YouTube)');
    expect(result).toContain('Linear Algebra');
    expect(result).toContain('3Blue1Brown');
  });

  it('formats GitHub results', () => {
    const result = formatResearchContext(makeResults({
      github: [
        {
          name: 'fastai/fastbook',
          description: 'Deep Learning for Coders book',
          url: 'https://github.com/fastai/fastbook',
          stars: 20000,
        },
      ],
    }));
    expect(result).toContain('## Code & Repositories');
    expect(result).toContain('fastai/fastbook');
    expect(result).toContain('20000 stars');
  });

  it('formats Wikipedia link structure', () => {
    const result = formatResearchContext(makeResults({
      wikiLinks: ['Calculus', 'Linear algebra', 'Differential equations'],
    }));
    expect(result).toContain('## Related Concepts (Wikipedia link structure)');
    expect(result).toContain('- Calculus');
    expect(result).toContain('- Linear algebra');
  });

  it('combines multiple sections with separators', () => {
    const result = formatResearchContext(makeResults({
      wikipedia: { title: 'Test', extract: 'content', url: '' },
      arxiv: [{ title: 'Paper', year: '2024', authors: ['A'], summary: 'sum', url: 'http://x' }],
      syllabi: [{ title: 'Course', provider: 'MIT', url: 'http://y', topics: [] }],
    }));
    expect(result).toContain('---');
    expect(result.split('---').length).toBeGreaterThanOrEqual(3);
  });

  it('handles missing optional fields gracefully', () => {
    const result = formatResearchContext(makeResults({
      syllabi: [{ title: 'Course', provider: 'edX', url: 'http://x' }],
    }));
    expect(result).toContain('Course');
    expect(result).not.toContain('Topics:');
  });
});
