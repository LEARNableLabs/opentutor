# Curriculum Generation — Full Workflow

How OpenTutor builds a personalized curriculum when a student picks a topic.

## Overview

Curriculum generation is a **two-phase process**. Phase A gives the student something useful immediately (an intro to the field + a resource to engage with). Phase B runs research in the background and produces the full syllabus. The student never waits for research — they're reading or watching an intro while it happens.

```
Student picks topic
  │
  ├── Phase A (instant, ~10s)
  │   ├── Wikipedia lookup → topic overview
  │   ├── Claude generates mini-wiki intro
  │   ├── Suggest intro video/article to watch now
  │   └── "Building your curriculum..."
  │
  ├── Phase B (background, 30-90s)
  │   ├── Research pipeline (parallel)
  │   │   ├── arxiv → papers, surveys, preprints
  │   │   ├── Semantic Scholar → highly cited papers, citation graph
  │   │   ├── OpenAlex → academic topics, landmark works
  │   │   └── Wikipedia → concept overview, prerequisite structure
  │   ├── Claude + web search → syllabi, courses, textbooks, videos
  │   ├── Synthesize into full 20-30 lesson curriculum
  │   └── Save domain files (curriculum.json, research.md, etc.)
  │
  └── Notification
      └── "📚 Your curriculum is ready! 24 lessons across 6 modules. /next for lesson 1"
```

## Phase A — Welcome & Intro

**Goal:** Give the student something genuinely useful *right now* while research runs.

**Triggered by:** `/add <topic>` or topic selection during onboarding.

**What happens:**

1. **Quick Wikipedia lookup** — fetch the topic summary via Wikipedia REST API. This gives a 1-2 sentence description of the field.

2. **Claude generates a mini-wiki intro** — 2-3 sentences about the field: what it is, why it matters, who the key people are. Grounded in the Wikipedia data, not hallucinated.

3. **Suggest an intro resource** — one high-quality entry point for the student to engage with immediately:
   - A well-known introductory video (e.g., 3Blue1Brown, Veritasium, Khan Academy)
   - A landmark blog post or article
   - A Wikipedia deep-read link
   - The intro chapter of a canonical textbook (if freely available)

   The resource should be something the student can start watching/reading in under 30 seconds. Claude picks based on the topic and student level.

4. **"Building your curriculum..."** — tell the student research is happening, they'll be notified when it's ready.

**What is NOT in Phase A:**
- No lesson delivery. No scaffold lessons. No hallucinated lesson titles.
- No fake resource URLs. If Claude can't confidently name a real resource, it says "I'll find the best resources during research."

**Example output (Telegram):**

```
📖 Optimal Transport

The math of moving things efficiently — from Monge's 18th-century 
earth-moving problem to modern machine learning. It connects 
probability, geometry, and optimization in surprisingly deep ways.

Key people: Gaspard Monge, Leonid Kantorovich (Nobel '75), 
Cédric Villani (Fields '10), Marco Cuturi (Sinkhorn).

🎬 Start here while I build your curriculum:
"Optimal Transport — aass primer" by Gabriel Peyré
https://optimaltransport.github.io/

Building your full curriculum now — I'll let you know when it's ready.
```

## Phase B — Research & Synthesis

**Goal:** Build a complete, research-grounded curriculum with verified resources.

**Runs:** In the background, non-blocking. Student can interact with the bot while this runs.

### Step 1: Research Pipeline

Four academic APIs are queried **in parallel**:

| Source | What it provides | Best for |
|---|---|---|
| **arxiv** | Papers, preprints, survey articles | Research-level topics, cutting-edge material |
| **Semantic Scholar** | Highly cited papers, citation counts, TLDRs | Finding seminal/canonical works |
| **OpenAlex** | Academic topics, landmark works, related fields | Broad academic landscape, interdisciplinary links |
| **Wikipedia** | Concept overview, prerequisite structure | Grounding, prerequisite detection, accessible summaries |

All APIs are free, no keys needed. Rate limiting is handled gracefully (Semantic Scholar returns 429s under load — the pipeline continues without it).

**Timeouts:** Each API call has a 15-second timeout. If one fails, the others still contribute.

### Step 2: Claude + Web Search

After the API results are gathered, Claude receives them as context and is given access to the **Anthropic built-in web search tool** (`web_search_20250305`, up to 5 searches).

Claude uses web search to fill gaps the APIs missed:
- University course syllabi and outlines
- Specific textbook chapter structures
- Video playlists and tutorial series
- Interactive tools (Desmos, GeoGebra, Observable notebooks)

### Step 3: Curriculum Synthesis

Claude synthesizes all research into a complete domain:

**`curriculum.json`** — 20-30 lessons organized into modules:
```json
{
  "topic": "Optimal Transport",
  "slug": "optimal-transport",
  "created": "2026-04-14",
  "student_level": "advanced",
  "prerequisites": ["measure theory basics", "linear algebra", "probability"],
  "exit_criteria": [
    "Explain Monge vs Kantorovich formulation",
    "Implement Sinkhorn algorithm from scratch",
    "Read a modern OT paper and understand its contribution"
  ],
  "lessons": [
    {
      "day": 1,
      "module": "Foundations",
      "title": "Why does moving dirt cost money?",
      "concepts": ["Monge problem", "cost function", "transport map"],
      "resources": ["https://optimaltransport.github.io/", "Peyré & Cuturi Ch 1"],
      "status": "pending"
    }
  ]
}
```

**Lesson design principles:**
- Titles are questions or provocations, not topic labels
- Each lesson = one core concept, ~3-5 minute read
- Review days every 5-7 lessons (spaced repetition)
- Resources are real URLs verified during research
- Prerequisites flagged if student might be missing background

**`teaching-notes.md`** — domain-specific pedagogy:
- How to teach this topic at the student's level
- Common misconceptions and how to correct them
- Level adjustments (what to emphasize/skip)
- Rabbit holes (fascinating tangents to drop in at the right moment)

**`concept-map.md`** — dependency graph:
- Core concepts in learning order
- Dependencies between concepts
- Bottleneck concepts (if you don't get this, nothing after makes sense)
- Prerequisite topics from outside the domain

**`research.md`** — raw research results preserved for reference:
- All papers found (arxiv, Semantic Scholar)
- Wikipedia summaries
- OpenAlex topics and related fields
- Serves as an audit trail for where curriculum resources came from

### Step 4: Notification

When Phase B completes, the bot sends a message to the student:

```
📚 Your curriculum is ready!

Optimal Transport — 30 lessons across 7 modules
Based on: Peyré & Cuturi (Computational OT), Villani (Topics in OT), 
MIT 18.S096, and 10 research papers.

Type /next for your first lesson.
```

## Storage

All generated files live in `skills/tutor/domains/<topic-slug>/`:

```
domains/optimal-transport/
├── curriculum.json      # Lesson sequence (20-30 lessons)
├── concept-map.md       # Concept dependency graph
├── teaching-notes.md    # Domain-specific pedagogy
├── resources.md         # Curated resource list (if generated separately)
└── research.md          # Raw API results from research pipeline
```

## Enrichment of Existing Curricula

Topics that were created before the research pipeline can be enriched retroactively:

```javascript
import { enrichExistingTopic } from './curriculum.js';
await enrichExistingTopic('optimal-transport', skills);
```

This runs Phase B on an existing domain. Lesson completion status is preserved — if the student completed lessons 1-5, those stay marked as completed in the enriched curriculum.

## Failure Modes

| Failure | Handling |
|---|---|
| All research APIs fail | Phase B logs error, scaffold stays as-is. Student can still learn from Claude's knowledge. |
| Claude can't parse research into curriculum | Error logged, scaffold preserved. Admin can retry with `/enrich`. |
| Semantic Scholar rate limited (429) | Skipped gracefully, other 3 APIs continue. |
| Web search unavailable (CLI backend) | Phase B runs without web search, uses only API research results. |
| Phase B completes after student already did lesson 1 | Completion status preserved during enrichment. No progress lost. |

## Configuration

Environment variables in `.env`:

| Variable | Default | Purpose |
|---|---|---|
| `CLAUDE_BACKEND` | `cli` | `cli` or `sdk`. Web search only available with `sdk`. |
| `CLAUDE_STRONG_MODEL` | `claude-sonnet-4-20250514` | Model used for curriculum generation |
| `ANTHROPIC_API_KEY` | — | Required for `sdk` backend |

## Code References

| File | Purpose |
|---|---|
| `scripts/bot/curriculum.js` | Two-phase generation orchestration |
| `scripts/bot/research.js` | Research pipeline (arxiv, Semantic Scholar, OpenAlex, Wikipedia) |
| `scripts/bot/context.js` | Prompt builders: `buildScaffoldPrompt`, `buildResearchSynthesisPrompt` |
| `scripts/bot/claude.js` | Claude wrapper with `webSearch` option |
| `scripts/bot/commands.js` | `/add` command triggers generation |
| `scripts/bot/onboarding.js` | Onboarding flow triggers generation |
| `skills/tutor/templates/domain-template.md` | Template for domain file structure |
| `skills/tutor/references/curriculum-format.md` | JSON schema for curriculum files |
