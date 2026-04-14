/**
 * Research module — query academic and web APIs to gather real sources
 * for curriculum generation. All APIs are free, no keys needed.
 */

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
export async function researchTopic(topic, options = {}) {
  const level = options.level || 'intermediate';

  // Run all searches in parallel
  const [arxiv, semanticScholar, wikipedia, openAlex] = await Promise.allSettled([
    searchArxiv(topic),
    searchSemanticScholar(topic),
    searchWikipedia(topic),
    searchOpenAlex(topic),
  ]);

  const results = {
    arxiv: arxiv.status === 'fulfilled' ? arxiv.value : [],
    semanticScholar: semanticScholar.status === 'fulfilled' ? semanticScholar.value : [],
    wikipedia: wikipedia.status === 'fulfilled' ? wikipedia.value : null,
    openAlex: openAlex.status === 'fulfilled' ? openAlex.value : [],
  };

  console.log(`  research: arxiv=${results.arxiv.length} semantic=${results.semanticScholar.length} wikipedia=${results.wikipedia ? 'yes' : 'no'} openalex=${results.openAlex.length}`);

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
    console.log('  research: Semantic Scholar rate limited, skipping');
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
