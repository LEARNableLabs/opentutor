export const meta = {
  name: 'research',
  description: 'Parallel academic research for a topic — arxiv, Semantic Scholar, OpenAlex, Wikipedia, web syllabi',
  whenToUse: 'When adding a new topic or refreshing research for an existing domain. Usage: run with args {topic: "optimal transport"}',
  phases: [
    { title: 'Gather', detail: 'Fan out 5 research agents across academic APIs and web sources' },
    { title: 'Gate', detail: 'CEO-style quality gate reviews research coverage and gaps' },
    { title: 'Synthesize', detail: 'Merge, deduplicate, and write structured research document' },
  ],
}

const topic = args?.topic
if (!topic) throw new Error('Missing args.topic — pass {topic: "your topic"}')

const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const domainDir = `skills/tutor/domains/${slug}`

// ── Phase 1: Gather — parallel research fork ──────────────────

phase('Gather')
log(`Researching "${topic}" across 5 sources`)

const RESEARCHERS = [
  {
    id: 'arxiv',
    prompt: `You are a research agent. Search the web for arxiv papers on "${topic}".

Find the 10 most relevant papers. For each paper report:
- title
- authors (list)
- year
- abstract (first 300 chars)
- arxiv URL

Write your findings as a structured markdown document with one section per paper. Include only real papers with real URLs. If you cannot verify a paper exists, exclude it.`,
  },
  {
    id: 'semantic-scholar',
    prompt: `You are a research agent. Search the web for Semantic Scholar results on "${topic}".

Find the 10 most highly-cited papers. For each paper report:
- title
- authors
- year
- citation count
- one-sentence TLDR
- Semantic Scholar URL

Sort by citation count descending. Write as structured markdown. Only include papers you can verify exist.`,
  },
  {
    id: 'openalex',
    prompt: `You are a research agent. Search the web for OpenAlex results on "${topic}".

Find:
1. The 3 most related academic topics/concepts — with names, descriptions, work counts, keywords
2. The 5 most-cited works (>100 citations) — with titles, years, citation counts, authors, DOIs

Write as structured markdown with separate sections for Topics and Works.`,
  },
  {
    id: 'wikipedia',
    prompt: `You are a research agent. Look up "${topic}" on Wikipedia.

Find the main Wikipedia article and report:
- Article title
- A 500-character summary/extract
- The Wikipedia URL
- The short description

If the exact title doesn't match, find the closest article. Write as structured markdown.`,
  },
  {
    id: 'educational',
    prompt: `You are a research agent. Search the web for the best educational resources on "${topic}".

Find real, verifiable resources in these categories:
1. **University courses** — MIT OCW, Stanford, Coursera, edX (with URLs and level)
2. **Textbooks** — note if free PDF available
3. **Video series** — 3Blue1Brown, Khan Academy, lecture series (with URLs)
4. **Interactive tools** — Desmos, GeoGebra, simulators (with URLs)
5. **Key people** — researchers, educators, practitioners (name + why they matter)
6. **Blog posts/tutorials** — particularly good introductions (with URLs)

Only include resources you can confirm exist with real URLs. Write as structured markdown.`,
  },
]

const results = await parallel(
  RESEARCHERS.map(r => () =>
    agent(r.prompt, { label: `research:${r.id}`, phase: 'Gather' })
  )
)

const gathered = {}
for (let i = 0; i < RESEARCHERS.length; i++) {
  gathered[RESEARCHERS[i].id] = results[i]
}
const successCount = results.filter(Boolean).length
log(`Gathered from ${successCount}/${RESEARCHERS.length} sources`)

// ── Phase 2: Gate — quality review ────────────────────────────

phase('Gate')

const gatePrompt = `You are a research quality gate. Review the following research gathered for "${topic}".

## arxiv results
${gathered.arxiv || '(no results)'}

## Semantic Scholar results
${gathered['semantic-scholar'] || '(no results)'}

## OpenAlex results
${gathered.openalex || '(no results)'}

## Wikipedia
${gathered.wikipedia || '(no results)'}

## Educational Resources
${gathered.educational || '(no results)'}

---

Evaluate:
1. **Coverage** — Are all major aspects of "${topic}" represented? Any blind spots?
2. **Quality** — Are the papers relevant and highly-cited? Are educational resources real and accessible?
3. **Gaps** — What subtopics or resource types are missing?
4. **Deduplication needed** — Are there papers that appear in multiple sources?

Report your assessment as JSON:
{
  "verdict": "PROCEED" or "GAPS",
  "coverage_score": 1-10,
  "gaps": ["list of missing areas"],
  "dedup_needed": ["list of duplicate papers across sources"],
  "notes": "any other observations"
}`

const GATE_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['PROCEED', 'GAPS'] },
    coverage_score: { type: 'number' },
    gaps: { type: 'array', items: { type: 'string' } },
    dedup_needed: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['verdict', 'coverage_score', 'gaps'],
}

const gate = await agent(gatePrompt, { label: 'quality-gate', phase: 'Gate', schema: GATE_SCHEMA })
log(`Gate verdict: ${gate?.verdict || 'unknown'}, coverage: ${gate?.coverage_score || '?'}/10, gaps: ${gate?.gaps?.length || 0}`)

// ── Phase 3: Synthesize — merge into research document ────────

phase('Synthesize')

const synthesisPrompt = `You are a research synthesizer for an AI tutor called OpenTutor. Merge the following multi-source research on "${topic}" into a single structured markdown document.

## Raw Research Data

### arxiv
${gathered.arxiv || '(no results)'}

### Semantic Scholar
${gathered['semantic-scholar'] || '(no results)'}

### OpenAlex
${gathered.openalex || '(no results)'}

### Wikipedia
${gathered.wikipedia || '(no results)'}

### Educational Resources
${gathered.educational || '(no results)'}

## Quality Gate Assessment
Coverage score: ${gate?.coverage_score || '?'}/10
Gaps identified: ${gate?.gaps?.join(', ') || 'none'}
Duplicates to merge: ${gate?.dedup_needed?.join(', ') || 'none'}

---

Write a complete research document with these sections:

# Research: ${topic}
Generated: (today's date)

## Overview
A grounding paragraph about the field based on Wikipedia. What is this topic, why does it matter, what are its major branches?

## Key Papers
Deduplicated list of the 10-15 most important papers (merge across arxiv + Semantic Scholar + OpenAlex). For each:
- **Title** (Year) — Authors
  Citation count. One-line summary.
  URL

## Academic Landscape
Related fields, subfields, active research areas. What's hot right now?

## Educational Resources
### Courses
### Textbooks
### Videos
### Interactive Tools

## Key People
Researchers, educators, practitioners relevant to this topic.

## Resource Quality Notes
Which resources work best at which level (beginner, intermediate, advanced)?

## Research Gaps
${gate?.gaps?.length ? 'The quality gate identified these gaps: ' + gate.gaps.join(', ') : 'No major gaps identified.'}

Rules:
- Only include resources with real, verifiable URLs
- Merge duplicates — each paper appears once with the best metadata from all sources
- Be thorough but concise
- Write the full document in markdown`

const synthesis = await agent(synthesisPrompt, { label: 'synthesize', phase: 'Synthesize' })

// Write to file
const writePrompt = `Create the directory ${domainDir} if it doesn't exist, then write the following research document to ${domainDir}/research.md

${synthesis}`

await agent(writePrompt, { label: 'write', phase: 'Synthesize' })

log(`Research written to ${domainDir}/research.md`)
return { topic, slug, domainDir, coverage: gate?.coverage_score, gaps: gate?.gaps }
