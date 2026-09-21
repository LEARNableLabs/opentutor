# OpenTutor — Codex Setup Guide

Run OpenTutor inside OpenAI Codex as an agent skill. Codex provides the sandboxed
environment and the filesystem; OpenTutor provides the curriculum and the teaching
methodology.

## Prerequisites

- Codex CLI installed (`npm install -g @openai/codex`)
- An OpenAI API key (or an OpenRouter key — see Step 2)

## Step 1 — Install the skill

```bash
# From the opentutor repo root
cp -r skills/tutor/ .codex/skills/tutor/
cp workspace/AGENTS.md workspace/IDENTITY.md workspace/SOUL.md .codex/
cp workspace/templates/USER.md .codex/USER.md
mkdir -p .codex/tutor && cp workspace/templates/progress.json .codex/tutor/progress.json
```

`USER.md` and `progress.json` are copied out of `workspace/templates/` because the
running tutor overwrites them with your real profile and progress. Copying them from the
template is what keeps your own name and learning history out of `git status`.

Or use the setup script, which does the same thing:

```bash
node scripts/setup.js
```

## Step 2 — Configure the LLM backend

Codex uses OpenAI models by default:

```bash
# .env
OPENTUTOR_LLM=openai
OPENAI_API_KEY=sk-...
OPENAI_STRONG_MODEL=gpt-4o          # curriculum building
OPENAI_CHEAP_MODEL=gpt-4o-mini      # critic, domain files
```

Or reach other models through OpenRouter:

```bash
OPENTUTOR_LLM=openrouter
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_STRONG_MODEL=anthropic/claude-sonnet-5
OPENROUTER_CHEAP_MODEL=anthropic/claude-haiku-4.5
```

> OpenRouter model ids carry no date suffix. `anthropic/claude-sonnet-5`, not
> `anthropic/claude-sonnet-5-20251101` — the dated form fails every call with
> HTTP 400 *"not a valid model ID"*.

## Step 3 — Start learning

```
> Load the tutor skill and start a lesson on auction theory
```

Or use the commands directly:

```
> /add quantum computing
> /next
```

## Session continuity

Codex has no persistent process — every session starts cold. Continuity comes from two
files on disk, and the skill is responsible for reading them at the start of a session
and writing them at the end.

| File | Written to | Holds |
|---|---|---|
| `learning.md` | `workspace/tutor/domains/<slug>/` | What was taught, what the student got right and wrong, where the session stopped |
| `practice-feedback.md` | `workspace/tutor/domains/<slug>/` | Enforceable directives for the next session — BLOCK, BUMP, DROP, VARY, REVISIT, GOAL |

Both live under `workspace/`, **not** under `skills/tutor/domains/`. The 293 shipped
curricula are read-only reference data; anything a student generates is runtime state and
is gitignored. `lib/core/progress.js` routes these two filenames automatically — call
`domainFilePath()` rather than joining paths by hand and you will land in the right place.

### At session start

1. Read `practice-feedback.md` **first**. Its directives override the curriculum's next
   lesson — a `BLOCK` means do not advance, whatever the sequence says.
2. Read `learning.md` for where the last session stopped and what was shaky.
3. Open with a retrieval question on a concept that is due, not with "where did we leave
   off?" — the files exist so the student never has to answer that.

### At session end

1. Append the session to `learning.md`: concepts covered, questions asked, what the
   student answered, and your honest read of their understanding.
2. Rewrite `practice-feedback.md` with at most three directives for next time.

A directive the next session ignores is worse than none, because the file then claims a
weak spot is being handled when it isn't.

## How it works

- `.codex/skills/tutor/SKILL.md` defines the teaching methodology; Codex follows it for
  lesson delivery, curriculum generation and student interaction.
- The 293 pre-built curricula are available immediately, with no pipeline run.
- For a new topic, the Builder/Critic pipeline runs through the configured model and
  researches the topic first — `CurriculumPipeline` fetches sources itself and writes
  `research.md`, which later lessons cite.
- Codex reads `AGENTS.md`, so the boot instructions go there rather than in `CLAUDE.md`.
