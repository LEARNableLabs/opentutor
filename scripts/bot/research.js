/**
 * Research module — query academic and web APIs to gather real sources
 * for curriculum generation. All APIs are free, no keys needed.
 */

import { log } from './logger.js';

const ARXIV_API = 'https://export.arxiv.org/api/query';
const SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1';
const OPENALEX_API = 'https://api.openalex.org';
const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1';

/**
 * Run the full research pipeline for a topic.
 * Returns a structured object with results from all sources.
 * @param {string} topic - Human-readable topic name
 * @param {object} [options]
 * @param {string} [options.level] - Student level (beginner, intermediate, advanced)
 * @returns {Promise<{arxiv: object[], semanticScholar: object[], wikipedia: object|null, openAlex: object[]}>}
 */
export async function researchTopic(topic, _options = {}) {
  const [arxiv, semanticScholar, wikipedia, openAlex, syllabi, youtube, github, wikiLinks] = await Promise.allSettled([
    searchArxiv(topic),
    searchSemanticScholar(topic),
    searchWikipedia(topic),
    searchOpenAlex(topic),
    searchSyllabi(topic),
    searchYouTube(topic),
    searchGitHub(topic),
    searchWikipediaLinks(topic),
  ]);

  const results = {
    arxiv: arxiv.status === 'fulfilled' ? arxiv.value : [],
    semanticScholar: semanticScholar.status === 'fulfilled' ? semanticScholar.value : [],
    wikipedia: wikipedia.status === 'fulfilled' ? wikipedia.value : null,
    openAlex: openAlex.status === 'fulfilled' ? openAlex.value : [],
    syllabi: syllabi.status === 'fulfilled' ? syllabi.value : [],
    youtube: youtube.status === 'fulfilled' ? youtube.value : [],
    github: github.status === 'fulfilled' ? github.value : [],
    wikiLinks: wikiLinks.status === 'fulfilled' ? wikiLinks.value : [],
  };

  log.info({
    topic,
    arxiv: results.arxiv.length,
    semantic_scholar: results.semanticScholar.length,
    wikipedia: !!results.wikipedia,
    openalex: results.openAlex.length,
    syllabi: results.syllabi.length,
    youtube: results.youtube.length,
    github: results.github.length,
    wiki_links: results.wikiLinks.length,
  }, 'research complete');

  return results;
}

/**
 * Format research results into a text block for Claude's context.
 */
export function formatResearchContext(results) {
  const sections = [];

  // Wikipedia overview
  if (results.wikipedia) {
    sections.push([
      '## Wikipedia Overview',
      '',
      `**${results.wikipedia.title}**`,
      results.wikipedia.extract,
      '',
      results.wikipedia.url ? `Source: ${results.wikipedia.url}` : '',
    ].join('\n'));
  }

  // Key papers (arxiv)
  if (results.arxiv.length > 0) {
    const papers = results.arxiv.slice(0, 10).map((p) =>
      `- **${p.title}** (${p.year}) — ${p.authors.slice(0, 3).join(', ')}${p.authors.length > 3 ? ' et al.' : ''}\n  ${p.summary}\n  ${p.url}`
    );
    sections.push([
      '## Key Papers (arxiv)',
      '',
      ...papers,
    ].join('\n'));
  }

  // Semantic Scholar (highly cited)
  if (results.semanticScholar.length > 0) {
    const papers = results.semanticScholar.slice(0, 8).map((p) =>
      `- **${p.title}** (${p.year}) — ${p.citationCount} citations\n  ${p.authors.join(', ')}\n  ${p.tldr || ''}\n  ${p.url}`
    );
    sections.push([
      '## Highly Cited Papers (Semantic Scholar)',
      '',
      ...papers,
    ].join('\n'));
  }

  // OpenAlex topics and works
  const oaTopics = results.openAlex.filter((c) => c.type === 'topic');
  const oaWorks = results.openAlex.filter((c) => c.type === 'work');

  if (oaTopics.length > 0) {
    const topics = oaTopics.map((c) =>
      `- **${c.name}** — ${c.description || 'no description'} (${c.worksCount} works)${c.keywords?.length ? `\n  Keywords: ${c.keywords.join(', ')}` : ''}`
    );
    sections.push(['## Related Academic Topics (OpenAlex)', '', ...topics].join('\n'));
  }

  if (oaWorks.length > 0) {
    const works = oaWorks.map((c) =>
      `- **${c.name}** — ${c.description}${c.authors?.length ? `\n  ${c.authors.join(', ')}` : ''}${c.doi ? `\n  ${c.doi}` : ''}`
    );
    sections.push(['## Highly Cited Works (OpenAlex)', '', ...works].join('\n'));
  }

  // Course syllabi (MIT OCW, Coursera, edX)
  if (results.syllabi?.length > 0) {
    const items = results.syllabi.map((s) =>
      `- **${s.title}** — ${s.provider}\n  ${s.url}${s.topics?.length ? `\n  Topics: ${s.topics.join(', ')}` : ''}`
    );
    sections.push(['## Course Syllabi & Outlines', '', ...items].join('\n'));
  }

  // YouTube educational content
  if (results.youtube?.length > 0) {
    const items = results.youtube.map((v) =>
      `- **${v.title}** — ${v.channel}\n  ${v.url}`
    );
    sections.push(['## Video Resources (YouTube)', '', ...items].join('\n'));
  }

  // GitHub repos
  if (results.github?.length > 0) {
    const items = results.github.map((r) =>
      `- **${r.name}** — ${r.description || 'no description'} (${r.stars} stars)\n  ${r.url}`
    );
    sections.push(['## Code & Repositories (GitHub)', '', ...items].join('\n'));
  }

  // Wikipedia concept links (for concept map grounding)
  if (results.wikiLinks?.length > 0) {
    sections.push([
      '## Related Concepts (Wikipedia link structure)',
      '',
      results.wikiLinks.map((l) => `- ${l}`).join('\n'),
    ].join('\n'));
  }

  return sections.join('\n\n---\n\n');
}

// ── arxiv ──────────────────────────────────────────────────

async function searchArxiv(topic) {
  const query = encodeURIComponent(topic);
  const url = `${ARXIV_API}?search_query=all:${query}&start=0&max_results=10&sortBy=relevance`;

  const res = await fetchWithTimeout(url, 15000);
  const xml = await res.text();

  return parseArxivXml(xml);
}

function parseArxivXml(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const title = extractTag(entry, 'title')?.replace(/\s+/g, ' ').trim();
    const summary = extractTag(entry, 'summary')?.replace(/\s+/g, ' ').trim().slice(0, 300);
    const published = extractTag(entry, 'published');
    const year = published ? published.slice(0, 4) : 'unknown';

    // Extract authors
    const authors = [];
    const authorRegex = /<author>\s*<name>(.*?)<\/name>/g;
    let authorMatch;
    while ((authorMatch = authorRegex.exec(entry)) !== null) {
      authors.push(authorMatch[1]);
    }

    // Extract URL
    const urlMatch = entry.match(/<id>(.*?)<\/id>/);
    const url = urlMatch ? urlMatch[1] : '';

    if (title) {
      entries.push({ title, summary, year, authors, url });
    }
  }

  return entries;
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 's'));
  return match ? match[1] : null;
}

// ── Semantic Scholar ───────────────────────────────────────

async function searchSemanticScholar(topic) {
  const query = encodeURIComponent(topic);
  const url = `${SEMANTIC_SCHOLAR_API}/paper/search?query=${query}&limit=10&fields=title,year,authors,citationCount,tldr,url`;

  const res = await fetchWithTimeout(url, 15000, {
    headers: { 'User-Agent': 'OpenTutor/1.0 (educational curriculum builder)' },
  });

  if (res.status === 429) {
    log.warn({ topic }, 'Semantic Scholar rate limited, skipping');
    return [];
  }

  const data = await res.json();
  if (!data.data) return [];

  return data.data.map((paper) => ({
    title: paper.title,
    year: paper.year,
    authors: (paper.authors || []).map((a) => a.name),
    citationCount: paper.citationCount || 0,
    tldr: paper.tldr?.text || '',
    url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
  })).sort((a, b) => b.citationCount - a.citationCount);
}

// ── OpenAlex ───────────────────────────────────────────────

async function searchOpenAlex(topic) {
  const query = encodeURIComponent(topic);

  // Search topics (replaced deprecated concepts endpoint)
  const topicsUrl = `${OPENALEX_API}/topics?search=${query}&per_page=5`;
  // Search highly cited works with quoted query for relevance
  const worksUrl = `${OPENALEX_API}/works?search=${query}&per_page=8&sort=cited_by_count:desc&select=title,publication_year,cited_by_count,authorships,doi`;

  const [topicsRes, worksRes] = await Promise.allSettled([
    fetchWithTimeout(topicsUrl, 15000).then((r) => r.json()),
    fetchWithTimeout(worksUrl, 15000).then((r) => r.json()),
  ]);

  const results = [];

  // Add topics
  if (topicsRes.status === 'fulfilled' && topicsRes.value.results) {
    for (const t of topicsRes.value.results.slice(0, 3)) {
      results.push({
        type: 'topic',
        name: t.display_name,
        description: t.description || '',
        worksCount: t.works_count || 0,
        keywords: (t.keywords || []).slice(0, 5).map((k) => k.display_name || k),
      });
    }
  }

  // Add top-cited works (filter to those with >100 citations for relevance)
  if (worksRes.status === 'fulfilled' && worksRes.value.results) {
    for (const w of worksRes.value.results.filter((w) => w.cited_by_count > 100).slice(0, 5)) {
      results.push({
        type: 'work',
        name: w.title,
        description: `${w.publication_year} — ${w.cited_by_count} citations`,
        worksCount: w.cited_by_count,
        authors: (w.authorships || []).slice(0, 3).map((a) => a.author?.display_name).filter(Boolean),
        doi: w.doi,
      });
    }
  }

  return results;
}

// ── Wikipedia ──────────────────────────────────────────────

/** Public alias for Phase A quick lookup */
export { searchWikipedia as searchWikipediaSummary };

async function searchWikipedia(topic) {
  const query = encodeURIComponent(topic);
  const url = `${WIKIPEDIA_API}/page/summary/${query}`;

  const res = await fetchWithTimeout(url, 10000);
  if (!res.ok) {
    // Try search fallback
    return searchWikipediaFallback(topic);
  }

  const data = await res.json();
  return {
    title: data.title,
    extract: data.extract?.slice(0, 500) || '',
    url: data.content_urls?.desktop?.page || '',
    description: data.description || '',
  };
}

async function searchWikipediaFallback(topic) {
  const query = encodeURIComponent(topic);
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&srlimit=1`;

  const res = await fetchWithTimeout(url, 10000);
  const data = await res.json();

  const result = data.query?.search?.[0];
  if (!result) return null;

  // Fetch the summary for the found page
  const title = encodeURIComponent(result.title);
  const summaryRes = await fetchWithTimeout(`${WIKIPEDIA_API}/page/summary/${title}`, 10000);
  if (!summaryRes.ok) return null;

  const summary = await summaryRes.json();
  return {
    title: summary.title,
    extract: summary.extract?.slice(0, 500) || '',
    url: summary.content_urls?.desktop?.page || '',
    description: summary.description || '',
  };
}

// ── MIT OCW / Coursera / edX syllabi ─────────────────────

async function searchSyllabi(topic) {
  const results = [];

  // MIT OCW — free, no auth
  try {
    const query = encodeURIComponent(topic);
    const res = await fetchWithTimeout(
      `https://ocw.mit.edu/search/?q=${query}&type=course`,
      10000,
    );
    if (res.ok) {
      const html = await res.text();
      const coursePattern = /href="(\/courses\/[^"]+)"[^>]*>\s*([^<]+)/g;
      let m;
      const seen = new Set();
      while ((m = coursePattern.exec(html)) !== null && results.length < 5) {
        const path = m[1].replace(/\/+$/, '');
        if (seen.has(path)) continue;
        seen.add(path);
        results.push({
          title: m[2].trim(),
          provider: 'MIT OCW',
          url: `https://ocw.mit.edu${path}`,
          topics: [],
        });
      }
    }
  } catch {
    log.debug({ topic }, 'MIT OCW search failed');
  }

  // OpenCourseWare Consortium search via Google (fallback)
  if (results.length === 0) {
    try {
      const query = encodeURIComponent(`${topic} site:ocw.mit.edu OR site:coursera.org OR site:edx.org syllabus`);
      const res = await fetchWithTimeout(
        `https://html.duckduckgo.com/html/?q=${query}`,
        10000,
        { headers: { 'User-Agent': 'OpenTutor/1.0 (educational curriculum builder)' } },
      );
      if (res.ok) {
        const html = await res.text();
        const linkPattern = /href="(https?:\/\/(?:ocw\.mit\.edu|www\.coursera\.org|www\.edx\.org)\/[^"]+)"[^>]*>([^<]+)/g;
        let m;
        while ((m = linkPattern.exec(html)) !== null && results.length < 5) {
          results.push({
            title: m[2].replace(/\s+/g, ' ').trim().slice(0, 100),
            provider: m[1].includes('mit.edu') ? 'MIT OCW' : m[1].includes('coursera') ? 'Coursera' : 'edX',
            url: m[1],
            topics: [],
          });
        }
      }
    } catch {
      log.debug({ topic }, 'syllabus fallback search failed');
    }
  }

  return results;
}

// ── YouTube educational search ───────────────────────────

async function searchYouTube(topic) {
  // Uses Invidious (public YouTube frontend) API — no key needed
  const instances = [
    'https://vid.puffyan.us',
    'https://invidious.snopyta.org',
    'https://inv.nadeko.net',
  ];

  const query = encodeURIComponent(`${topic} lecture course tutorial`);

  for (const instance of instances) {
    try {
      const res = await fetchWithTimeout(
        `${instance}/api/v1/search?q=${query}&type=video&sort=relevance&region=US`,
        8000,
      );
      if (!res.ok) continue;

      const data = await res.json();
      return data
        .filter((v) => v.type === 'video' && v.lengthSeconds > 300)
        .slice(0, 8)
        .map((v) => ({
          title: v.title,
          channel: v.author,
          url: `https://www.youtube.com/watch?v=${v.videoId}`,
          duration: Math.round(v.lengthSeconds / 60),
          views: v.viewCount || 0,
        }));
    } catch {
      continue;
    }
  }

  log.debug({ topic }, 'all YouTube/Invidious instances failed');
  return [];
}

// ── GitHub search ────────────────────────────────────────

async function searchGitHub(topic) {
  const query = encodeURIComponent(`${topic} tutorial OR course OR learning`);
  const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&per_page=8`;

  try {
    const res = await fetchWithTimeout(url, 10000, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'OpenTutor/1.0',
      },
    });

    if (res.status === 403) {
      log.debug({ topic }, 'GitHub rate limited');
      return [];
    }

    if (!res.ok) return [];

    const data = await res.json();
    return (data.items || [])
      .filter((r) => r.stargazers_count > 10)
      .slice(0, 6)
      .map((r) => ({
        name: r.full_name,
        description: (r.description || '').slice(0, 150),
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
        topics: r.topics?.slice(0, 5) || [],
      }));
  } catch {
    log.debug({ topic }, 'GitHub search failed');
    return [];
  }
}

// ── Wikipedia link structure (concept dependencies) ──────

async function searchWikipediaLinks(topic) {
  const query = encodeURIComponent(topic);

  try {
    // Get the page's internal links — these represent related concepts
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=links&pllimit=50&plnamespace=0&format=json`;
    const res = await fetchWithTimeout(url, 10000);
    if (!res.ok) return [];

    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return [];

    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') return [];

    const links = pages[pageId].links || [];
    return links
      .map((l) => l.title)
      .filter((t) => !t.includes(':') && t.length > 2 && t.length < 60)
      .slice(0, 30);
  } catch {
    log.debug({ topic }, 'Wikipedia link extraction failed');
    return [];
  }
}

// ── URL verification ─────────────────────────────────────

/**
 * Verify a batch of URLs. Returns an array of { url, status, ok }.
 * Uses HEAD requests with short timeouts.
 */
export async function verifyUrls(urls) {
  const unique = [...new Set(urls)].filter((u) => u.startsWith('http'));
  const results = await Promise.allSettled(
    unique.map(async (url) => {
      try {
        const res = await fetchWithTimeout(url, 5000, { method: 'HEAD' });
        return { url, status: res.status, ok: res.ok };
      } catch {
        return { url, status: 0, ok: false };
      }
    }),
  );

  return results.map((r) => r.status === 'fulfilled' ? r.value : { url: '', status: 0, ok: false });
}

// ── Helpers ────────────────────────────────────────────────

async function fetchWithTimeout(url, timeoutMs = 10000, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, ...options });
    return res;
  } finally {
    clearTimeout(timer);
  }
}
