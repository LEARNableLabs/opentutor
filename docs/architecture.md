# OpenTutor Architecture

How the pieces fit together. For the file-by-file layout see
[CLAUDE.md](../CLAUDE.md); for running it see the [README](../README.md).

## Multi-Agent Pipeline

Five agents with scoped contexts, communicating through files on disk:

```
Tutor (orchestrator — sees everything, decides what each agent gets)
  │
  ├── Researcher        → research.md
  │     (topic + level only)
  │
  ├── CurriculumBuilder → plan.md → curriculum.json + domain files + teacher.md
  │     (sees research.md + critique.md)
  │
  ├── Critic            → critique.md
  │     (sees plan.md + curriculum + domain files)
  │
  └── Teacher           → learning.md
        (sees curriculum, teacher.md, concept-map, resources, USER.md)
```

**Information scoping:** Each agent only sees what the Tutor passes it. The Researcher never sees student data. The Critic never sees research.md. The Teacher never sees critique.md. This prevents context pollution and keeps each agent focused.

## Pipeline Flow

```
/add quantum computing
  │
  ├─ Phase A (instant, ~10-30s)
  │    Wikipedia + research APIs → taster lesson + 5-lesson quick curriculum
  │    Student can start learning immediately
  │
  └─ Phase B (background)
       Researcher → research.md
       CurriculumBuilder → plan.md → curriculum + domain files
       Critic → critique.md
       ↺ loop until APPROVED or 3 iterations
       Student notified when full curriculum is ready
```

## Lesson Delivery (Socratic)

Every lesson is a multi-turn conversation with deliberate practice:

```
Tutor: "Before we start — what's Nash equilibrium
       and why does it matter?"                       ← RETRIEVAL (30s)
Student: [recalls prior concept]

Tutor: "Solid. Today's goal: understand revenue
       equivalence. Why would a sealed-bid auction
       give the same revenue as an English auction?"  ← DIAGNOSTIC
Student: [thinks and answers]

Tutor: "Good instinct. Now connect this to game
       theory — how does this relate to dominant
       strategies we covered last week?"              ← FOLLOW-UP + INTERLEAVE
Student: [connects concepts]

Tutor: "Apply this: you're designing an auction for
       5G spectrum. Which format and WHY?"            ← APPLICATION + SELF-EXPLANATION
Student: [applies + explains in own words]

Tutor: "Strong reasoning. How confident? 1-5"        ← SELF-ASSESSMENT
```

Adapts length: quick (~1 min) when accuracy is high, standard (~3-5 min), deep (~8-10 min) when struggling. The DeliberatePractitioner enforces BLOCK/BUMP/DROP/VARY/REVISIT directives between lessons.

## LLM Backends

Set `OPENTUTOR_LLM` (or `CLAUDE_BACKEND` for backward compat):

| Backend | Env value | Requires | Best for |
|---|---|---|---|
| Claude SDK | `claude-sdk` | `ANTHROPIC_API_KEY` | Fastest for pipelines |
| Claude CLI | `cli` | `claude` in PATH | No API key needed |
| OpenAI | `openai` | `OPENAI_API_KEY` | GPT models, Codex |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` | 200+ models behind one key |
| Ollama | `ollama` | Ollama running | Local/private, free |

With `OPENTUTOR_LLM` unset the backend is inferred from whichever API key is present
(`ANTHROPIC_API_KEY` → Claude SDK, `OPENROUTER_API_KEY` → OpenRouter, `OPENAI_API_KEY` → OpenAI),
falling back to the CLI. **The Telegram bot's own chat and lesson calls still read
`CLAUDE_BACKEND` (`sdk` | `cli`) rather than `OPENTUTOR_LLM`** — see issue #98.

The pipeline can use a different backend from interactive chat:

```bash
OPENTUTOR_LLM=cli                    # chat uses Claude CLI
OPENTUTOR_PIPELINE_LLM=claude-sdk    # pipeline uses SDK (faster)
```

---

---

## Domain files

Each topic in `skills/tutor/domains/<slug>/` contains:

| File | Writer | Purpose |
|---|---|---|
| File | Writer | Purpose | Ships? |
|---|---|---|---|
| `curriculum.json` | CurriculumBuilder | Lesson sequence with concepts, difficulty, type | ✅ |
| `concept-map.md` | CurriculumBuilder | Concept dependency graph | ✅ |
| `teaching-notes.md` | CurriculumBuilder | Misconceptions, level adjustments, pedagogy | ✅ |
| `resources.md` | CurriculumBuilder | Curated books, videos, tools | ✅ |
| `research.md` | Researcher | Academic sources from APIs | ✅ |
| `teacher.md` | CurriculumBuilder | Domain-specific teaching config (exercise style, tone) | ✅ |
| `plan.md` | CurriculumBuilder | Blueprint — scope, module rationale, pacing | build-time |
| `critique.md` | Critic | Structured review feedback | build-time |
| `learning.md` | Teacher | Session log — progress, performance, resume notes | runtime |
| `practice-feedback.md` | DeliberatePractitioner | Enforceable directives for the next lesson | runtime |

**293 pre-built topics** ship with full curricula (5–40 lessons, median 27). The six files marked ✅ are present for every one; the build-time and runtime files are produced when you generate a new topic or start learning. Background research refresh runs automatically when a student picks a topic (30-day staleness check).

Lesson completion is **not** stored in `curriculum.json` — it lives in `workspace/tutor/completions.json` and is overlaid at read time, so the shipped curricula stay pristine.

---

---

## Telegram commands

| Command | What it does |
|---|---|
| `/start` | Begin onboarding |
| `/next` | Get the next lesson |
| `/quiz` | Quick review quiz (native Telegram polls) |
| `/review` | Review recent material with spaced repetition |
| `/progress` | See your learning progress |
| `/topics` | List active topics |
| `/add <topic>` | Start learning a new topic |
| `/switch <topic>` | Switch your default topic |
| `/pause` | Pause daily lessons |
| `/resume` | Resume daily lessons |
| `/help` | Show available commands |

Or just chat naturally — "next lesson", "quiz me", "I'm stuck on X".

---
