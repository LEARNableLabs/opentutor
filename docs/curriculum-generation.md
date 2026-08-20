# Curriculum Generation — Full Workflow

How OpenTutor builds a personalized curriculum when a student picks a topic.

## Overview

Curriculum generation uses a **tutor-controlled pipeline**. A tutor agent judges every step and decides where more work is needed — advancing, requesting targeted research, redoing a step with feedback, or escalating to a human. Research is demand-driven: a broad survey maps the field, then targeted deep-dives happen wherever the tutor identifies gaps.

Phase A gives the student something useful immediately. The tutor pipeline runs in the background.

```
Student picks topic
  │
  ├── Phase A (instant, ~10s)
  │   ├── Wikipedia lookup → topic overview
  │   ├── Claude generates mini-wiki intro
  │   ├── Suggest intro video/article to watch now
  │   └── "Building your curriculum..."
  │
  └── Tutor Pipeline (background)
      │
      ├── Survey Research
      │   ├── 5 parallel agents (arxiv, Semantic Scholar, OpenAlex, Wikipedia, educational)
      │   ├── Quality gate (coverage score, gap detection)
      │   ├── Synthesize into research.md
      │   └── Tutor judges → may request targeted deep-dives
      │
      ├── Audience Assessment
      │   └── Tutor profiles: audience type, goal, background, tone, depth
      │
      ├── Build Curriculum
      │   ├── 4 parallel design agents (structure, concept map, teaching notes, resources)
      │   ├── Pedagogical quality gate
      │   ├── Assemble domain files
      │   └── Tutor judges → may RESEARCH or REDO
      │
      ├── QA (adversarial)
      │   ├── 5 dimension checkers (sequencing, resources, coverage, pedagogy, schema)
      │   ├── Adversarial verification of critical findings
      │   ├── Verdict synthesis
      │   └── Tutor judges → may trigger patch rebuild + re-QA
      │
      ├── Schedule
      │   ├── Difficulty analysis → pacing design → gate → apply
      │   └── Tutor judges → may adjust
      │
      └── Register
          └── Add topic to progress.json
```

## The Tutor Agent

The tutor is a **loop controller** that evaluates the output of every step. At each judgment point, it can:

| Decision | What happens |
|----------|-------------|
| **ADVANCE** | Quality sufficient, move to next step |
| **RESEARCH** | "I need more depth on X" — triggers targeted search for a specific subtopic |
| **REDO** | Redo this step with specific, actionable feedback |
| **ESCALATE** | Cannot proceed without human judgment (writes escalation.md, halts pipeline) |

The tutor carries **accumulated context** across all judgments via a memory array. Each judgment's `context_update` gets appended, so later decisions are informed by everything that came before — what gaps existed at survey, what targeted research added, where the build was weak.

### Tutor Decision Principles

1. Perfect is the enemy of good. A curriculum that ships is better than one endlessly refined.
2. Focus on pedagogical impact. Would this issue actually harm the student's learning? If not, ADVANCE.
3. On the final allowed iteration, ADVANCE unless there are critical pedagogical errors.
4. RESEARCH is for genuine knowledge gaps, not stylistic preferences.
5. REDO feedback must name specific items: "Lessons 12-15 need X" not "some lessons need improvement."

### Iteration Caps

| Cap | Value | Prevents |
|-----|-------|----------|
| Targeted research (global) | 3 rounds | Unbounded research loops |
| Build redos | 2 | Endless rebuilds |
| Schedule redos | 1 | Over-tuning schedule |
| QA-rebuild cycles | 2 | Infinite QA loops |

## Phase A — Welcome & Intro

**Goal:** Give the student something genuinely useful *right now* while the tutor pipeline runs.

**Triggered by:** `/add <topic>` or topic selection during onboarding.

**What happens:**

1. **Quick Wikipedia lookup** — fetch the topic summary via Wikipedia REST API.
2. **Claude generates a mini-wiki intro** — 2-3 sentences about the field: what it is, why it matters, who the key people are.
3. **Suggest an intro resource** — one high-quality entry point the student can start in under 30 seconds.
4. **"Building your curriculum..."** — tell the student research is happening.

**What is NOT in Phase A:**
- No lesson delivery. No hallucinated lesson titles.
- No fake resource URLs.

## Research — Survey & Targeted Modes

Research supports two modes, controlled by the tutor:

### Survey Mode (default, runs once at start)

Five parallel agents search different academic sources:

| Source | What it provides | Best for |
|---|---|---|
| **arxiv** | Papers, preprints, survey articles | Research-level topics, cutting-edge material |
| **Semantic Scholar** | Highly cited papers, citation counts, TLDRs | Finding seminal/canonical works |
| **OpenAlex** | Academic topics, landmark works, related fields | Broad academic landscape, interdisciplinary links |
| **Wikipedia** | Concept overview, prerequisite structure | Grounding, accessible summaries |
| **Educational** | Courses, textbooks, videos, tools, key people | Teaching resources |

A quality gate evaluates coverage (1-10 score) and identifies gaps. A synthesizer merges and deduplicates results into `research.md`.

### Targeted Mode (on-demand, triggered by tutor)

When the tutor identifies a gap ("I need more on Sinkhorn regularization"), targeted mode runs a lean 3-agent pipeline:

1. **Academic deep-dive** — papers specifically on the subtopic
2. **Practical resources** — courses, tutorials, code, tools for the subtopic
3. **Synthesizer** — appends a `## Targeted Research: {subtopic}` section to the existing `research.md`

No quality gate in targeted mode — the tutor judges whether the gap was filled.

## Audience Assessment

Before building the curriculum, the tutor defines the target audience profile:

- **audience_type** — Who is this for? (e.g., "software engineers exploring ML theory")
- **goal** — Learning goal (e.g., "practical application", "exam prep", "intellectual enrichment")
- **background** — Prerequisites the curriculum can assume
- **tone** — Teaching tone (e.g., "rigorous but accessible", "hands-on")
- **depth** — How deep to go (e.g., "intuition + key proofs", "full formal treatment")
- **time_commitment** — Time per lesson

This profile flows into the curriculum build as a north star for all design agents.

## Curriculum Build — Full & Patch Modes

### Full Mode (first build)

Four parallel design agents, each with the research and audience context:

1. **Structure** — module organization, lesson sequence, exit criteria
2. **Concept map** — dependency graph, bottlenecks, misconceptions
3. **Teaching notes** — pedagogical guidance, difficulty progression, exercises
4. **Resources** — curated books, videos, tools, code, people

A pedagogical quality gate checks sequencing, coverage, difficulty curve, engagement, and resources. Four parallel writers assemble the domain files.

~10 agents total.

### Patch Mode (targeted fixes)

When the tutor or QA identifies specific issues, patch mode does a targeted rebuild:

- 2 parallel patch agents (one for curriculum + concept map, one for resources + teaching notes)
- Each reads the existing files and applies only the cited fixes
- Same quality gate checks for regressions

~5-6 agents instead of 10. Unchanged parts stay unchanged, reducing regression risk.

## QA — Adversarial Quality Checks

Five specialist agents check different dimensions in parallel:

| Dimension | Checks |
|-----------|--------|
| **Sequencing** | Prerequisite ordering, circular dependencies, review day placement |
| **Resources** | URL validity, resource existence, level appropriateness |
| **Coverage** | Concept completeness, orphan concepts, depth balance |
| **Pedagogy** | Lesson titles, concept density, difficulty spikes, engagement |
| **Schema** | Required fields, day sequence, status values, JSON validity |

Critical findings get adversarially verified — each verifier is prompted to *refute* the finding. Survivors are confirmed; refuted findings are dropped.

A verdict synthesizer produces a pass/fail report with a prioritized fix plan.

## Storage

All generated files live in `skills/tutor/domains/<topic-slug>/`:

```
domains/optimal-transport/
├── curriculum.json      # Lesson sequence (20-30 lessons)
├── concept-map.md       # Concept dependency graph
├── teaching-notes.md    # Domain-specific pedagogy
├── resources.md         # Curated resource list
├── research.md          # Synthesized research + targeted research appendices
├── qa-report.md         # QA findings and verdict
└── escalation.md        # (only if tutor escalated to human)
```

## ESCALATE & Resume

When the tutor escalates, the pipeline:
1. Writes `escalation.md` with the question, reasoning, and accumulated context
2. Throws an error — the pipeline halts

To resume, re-run with `humanGuidance` in args:
```
args: {topic: "category theory", level: "intermediate", humanGuidance: "your answer here"}
```

Existing domain files on disk let the pipeline skip completed steps.

## Agent Count Estimates

| Scenario | Agents | Description |
|----------|--------|-------------|
| Best case | ~35 | Every step passes first try |
| Typical | ~60 | 1 targeted research + 1 QA-triggered patch rebuild |
| Worst case | ~102 | All caps hit |

## Failure Modes

| Failure | Handling |
|---|---|
| All research APIs fail | Survey logs error, tutor may ESCALATE or ADVANCE with limited data |
| QA finds critical issues | Tutor triggers patch rebuild + re-QA (up to 2 cycles) |
| Tutor can't resolve quality issue | ESCALATE — writes question to escalation.md, halts for human |
| Research cap exhausted | Tutor forced to ADVANCE with available research |
| Iteration cap hit | Tutor must ADVANCE unless critical pedagogical errors exist |

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
| `.claude/workflows/new-topic.js` | Tutor-controlled pipeline orchestrator |
| `.claude/workflows/research.js` | Survey + targeted research modes |
| `.claude/workflows/curriculum-build.js` | Full + patch curriculum build |
| `.claude/workflows/curriculum-qa.js` | Adversarial 5-dimension QA |
| `.claude/workflows/schedule.js` | Difficulty analysis and schedule design |
| `scripts/bot/curriculum.js` | Phase A (instant intro) + Phase B trigger |
| `scripts/bot/research.js` | Bot-level research pipeline (API calls) |
| `skills/tutor/templates/domain-template.md` | Template for domain file structure |
| `skills/tutor/references/curriculum-format.md` | JSON schema for curriculum files |
