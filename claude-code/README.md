# OpenTutor — Claude Code Setup Guide

Use OpenTutor as a skill in Claude Code (CLI or IDE extensions). Claude Code reads the skill files and becomes your tutor directly in the terminal or editor.

## Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code` or via IDE extension)

## Step 1 — Install the skill

```bash
# Automated setup
npx opentutor setup --agent claude-code

# Or manual: copy skill to project or global skills directory
cp -r skills/tutor/ .claude/skills/tutor/
```

For global access across all projects:

```bash
cp -r skills/tutor/ ~/.claude/skills/tutor/
```

## Step 2 — Set up workspace

```bash
# Copy workspace templates
cp workspace/AGENTS.md workspace/IDENTITY.md workspace/USER.md workspace/SOUL.md .claude/
mkdir -p .claude/tutor
cp workspace/tutor/progress.json .claude/tutor/progress.json
```

Edit `.claude/USER.md` with your name and level.

## Step 3 — Start learning

In Claude Code, invoke the tutor skill:

```
> /tutor next lesson on auction theory
> /tutor add quantum computing
> /tutor quiz me on what we covered
```

Or just ask naturally — Claude Code will discover the skill:

```
> I want to learn about algebraic topology. Start me off.
> Give me the next lesson.
> I'm stuck on homology groups, help me understand.
```

## How it works

- Claude Code reads `SKILL.md` from `.claude/skills/tutor/` and follows its teaching methodology
- The 292 pre-built curricula in `skills/tutor/domains/` are available immediately
- For new topics, Claude Code runs the curriculum generation pipeline (using `.claude/workflows/new-topic.js` if available, or the inline pipeline from `lib/core/`)
- Progress is stored in `workspace/tutor/progress.json` and `learning.md` per domain
- State is shared with the Telegram bot and web interface if they point to the same repo

## Curriculum Generation

Claude Code can run the full multi-agent pipeline as a workflow:

```
> /new-topic quantum computing
```

This launches the tutor-controlled pipeline:
1. Research (broad survey + targeted deep-dives)
2. CurriculumBuilder (plan.md → curriculum.json + domain files)
3. Critic (adversarial review, up to 3 iterations)
4. Schedule (difficulty analysis + pacing)

The pipeline runs as parallel agents — faster than the bot's sequential pipeline.

## Notes

- Claude Code has full file access — `learning.md`, `progress.json`, and memory files are read and written directly
- The skill uses Claude Code's own model selection (no separate API key needed)
- Works in both CLI (`claude`) and IDE extensions (VS Code, JetBrains)
- The tutor skill workflows (`.claude/workflows/`) provide richer curriculum generation than the bot's pipeline, with QA and scheduling phases
