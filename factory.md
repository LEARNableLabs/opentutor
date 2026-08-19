# Factory Configuration — opentutor

## Goal

Evolve OpenTutor — a portable AI tutor skill system — by improving its bot implementation, skill framework, and workspace tooling. Focus on reliability, observability, and teaching capability surface.

## Project Type

bot

## Language

JavaScript + Markdown

## Entry Point

```bash
npm run bot
```

## Target Branch

main

## Scope

### Mutable Paths

- `scripts/bot/**` — bot process, commands, routing, scheduling
- `scripts/setup.js` — setup CLI
- `skills/tutor/**` — meta-skill, references, templates, domains
- `workspace/**` — agent behavior, identity, progress tracking
- `openclaw/**` — OpenClaw platform integration
- `nanoclaw/**` — NanoClaw platform integration
- `nemoclaw/**` — NemoClaw platform integration
- `eval/**` — eval harness and scoring

### Immutable Paths

- `.obsidian/` — Obsidian app configuration
- `CLAUDE.md` — project instructions
- `factory.md` — this file
- `.factory/config.json` — factory runtime config
- `package.json` — only factory agents may update dependencies
- `LICENSE` — license file

## Guards

- No secrets or API keys in committed files
- Do not delete or overwrite existing tests
- Do not modify files outside declared mutable paths
- Do not merge PRs — leave open for human review
- Do not lower eval thresholds
- JSON files in `skills/tutor/domains/` and `workspace/tutor/` must remain valid JSON
- Markdown files in `skills/tutor/references/` must preserve existing section structure

## Eval

### Command

```bash
node eval/score.js
```

### Threshold

0.6

### Dimensions

| Dimension | Weight | Description |
|-----------|--------|-------------|
| syntax_check | 0.30 | Validate JS files parse with `node --check` on all `.js` files under `scripts/` |
| observability | 0.30 | Scan `.js` files for logging patterns (console.log/warn/error, pino, winston) and tracing |
| architecture | 0.40 | Check structural integrity: required skill/workspace files exist, JSON files parse, setup script present |

## Eval Spec

```json
[
  "Start the bot process and verify it initializes without errors",
  "Verify the bot responds to a basic health-check or /start command"
]
```

## Smoke Test

```bash
node --check scripts/bot/index.js && node --check scripts/setup.js
```

## Dependencies

- `@anthropic-ai/sdk` — Anthropic Claude SDK for AI interactions
- `node-cron` — scheduled lesson delivery
- `typescript` (dev) — type checking

## Architecture Notes

OpenTutor is a **meta-skill** system: it defines teaching methodology and generates domain-specific data (curricula, concept maps, resources) per topic. The bot process (`scripts/bot/`) orchestrates lesson delivery, quizzes, spaced repetition, and onboarding. The skill definition (`skills/tutor/SKILL.md`) is platform-agnostic; platform-specific overrides live in `openclaw/`, `nanoclaw/`, `nemoclaw/`.
