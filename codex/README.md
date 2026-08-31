# OpenTutor — Codex Setup Guide

Run OpenTutor inside OpenAI Codex as an agent skill. Codex handles the sandboxed environment; OpenTutor provides the curriculum and teaching methodology.

## Prerequisites

- Codex CLI installed (`npm install -g @openai/codex`)
- An OpenAI API key

## Step 1 — Install the skill

```bash
# From the opentutor repo root
cp -r skills/tutor/ .codex/skills/tutor/
cp workspace/AGENTS.md workspace/IDENTITY.md workspace/USER.md workspace/SOUL.md .codex/
cp -r workspace/tutor/ .codex/tutor/
```

Or use the setup script:

```bash
npx opentutor setup --agent codex
```

## Step 2 — Configure the LLM backend

Codex uses OpenAI models by default. To use OpenTutor's pipeline with OpenAI:

```bash
# .env
OPENTUTOR_LLM=openai
OPENAI_API_KEY=sk-...
OPENAI_STRONG_MODEL=gpt-4o          # for curriculum building
OPENAI_CHEAP_MODEL=gpt-4o-mini      # for critic, domain files
```

Or use Claude through OpenRouter:

```bash
OPENTUTOR_LLM=openai
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=sk-or-...
OPENAI_STRONG_MODEL=anthropic/claude-sonnet-4-20250514
```

## Step 3 — Start learning

In Codex, ask the agent to load the tutor skill:

```
> Load the tutor skill and start a lesson on auction theory
```

Or directly:

```
> /add quantum computing
> /next
```

## How it works

- The skill files in `.codex/skills/tutor/` define the teaching methodology
- Codex reads `SKILL.md` and follows its instructions for lesson delivery, curriculum generation, and student interaction
- Domain data (curricula, research, learning.md) lives in `skills/tutor/domains/` — shared with all other platforms
- The pipeline uses the OpenAI adapter from `lib/adapters/openai.js`

## Notes

- Codex runs in a sandboxed environment — file writes go to the workspace directory
- The 292 pre-built curricula are available immediately without any pipeline run
- For new topics, the Builder/Critic pipeline will use the configured OpenAI model
- `learning.md` and `progress.json` are written to the workspace, preserving state across sessions
