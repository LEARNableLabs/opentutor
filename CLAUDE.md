# OpenTutor — Repo Guide

OpenTutor is a universal agent skill that turns any compatible AI agent into a personalized daily tutor. It uses a multi-agent pipeline (Tutor, Researcher, CurriculumBuilder, Critic, Teacher) with scoped contexts — each agent only sees files relevant to its role. 292 pre-built topic domains ship ready to use.

## Structure

```
opentutor/
├── lib/                              # Platform-agnostic core
│   ├── core/
│   │   ├── state.js                  # TutorState class — file-based state management
│   │   ├── pipeline.js               # CurriculumPipeline — Builder/Critic loop (max 3 iterations)
│   │   ├── prompts.js                # Agent prompt builders (no platform assumptions)
│   │   └── index.js
│   └── adapters/
│       ├── base.js                   # BaseLLMAdapter interface
│       ├── claude-sdk.js             # Anthropic API
│       ├── claude-cli.js             # Claude Code CLI (claude -p)
│       ├── openai.js                 # OpenAI / Codex
│       ├── openrouter.js             # OpenRouter (200+ models)
│       ├── ollama.js                 # Local models
│       └── index.js                  # Factory: createAdapter(), createAdapterFromEnv()
├── scripts/
│   ├── setup.js                      # Interactive setup CLI
│   ├── bot/                          # Telegram bot adapter
│   │   ├── index.js                  # Entry point (npm run bot)
│   │   ├── claude.js                 # LLM wrapper (delegates to adapters)
│   │   ├── router.js                 # Message routing + group member tracking
│   │   ├── commands.js               # Slash commands + session resume from learning.md
│   │   ├── lesson.js                 # Interactive delivery: content with delays, pause at exercise
│   │   ├── curriculum.js             # Phase A quick-start + Phase B pipeline delegation to lib/core
│   │   ├── research.js               # 8-source research (arxiv, Semantic Scholar, OpenAlex, Wikipedia, MIT OCW, YouTube, GitHub, Wikipedia links)
│   │   ├── context.js                # Telegram-specific prompt builders
│   │   ├── callbacks.js              # Button handler (exercises via DM in groups)
│   │   ├── state.js                  # Bot state + group/student state
│   │   └── channels/telegram.js      # Telegram Bot API
│   └── web/                          # Standalone web interface
│       ├── server.js                 # HTTP server + REST API (npm run web)
│       └── public/                   # Vanilla JS frontend
├── skills/tutor/
│   ├── SKILL.md                      # Meta-skill: pedagogy, routing
│   ├── references/                   # HOW to teach (universal)
│   │   ├── teaching-method.md        # Deliberate practice, levels, difficulty
│   │   ├── lesson-delivery.md        # Delivery modes, formatting
│   │   ├── curriculum-format.md      # JSON schemas
│   │   ├── source-verification.md    # Citation rules
│   │   └── onboarding.md             # Onboarding flow
│   ├── templates/domain-template.md  # Domain generation template
│   └── domains/                      # 292 pre-built topic domains
│       └── <topic-slug>/
│           ├── curriculum.json       # Lesson sequence
│           ├── concept-map.md        # Concept dependencies
│           ├── teaching-notes.md     # Domain-specific pedagogy
│           ├── resources.md          # Curated books, videos, tools
│           ├── research.md           # Academic sources from APIs
│           ├── plan.md               # CurriculumBuilder blueprint
│           ├── teacher.md            # Domain-specific teaching config
│           ├── critique.md           # Critic feedback (build-time)
│           └── learning.md           # Teacher session log (runtime)
├── workspace/                        # Workspace templates
│   ├── AGENTS.md, IDENTITY.md, SOUL.md, USER.md
│   ├── tutor/progress.json           # Active topics, schedule, history
│   ├── groups/<chatId>/config.json   # Group learning config
│   ├── students/<userId>/progress.json  # Per-student state
│   ├── memory/YYYY-MM-DD.md          # Daily session logs
│   └── sessions/<chatId>.jsonl       # Conversation history
├── claude-code/README.md             # Claude Code setup guide
├── codex/README.md                   # Codex (OpenAI) setup guide
├── claude-web/README.md              # Claude Web Projects guide
├── hermes/README.md                  # Hermes Agent setup guide
├── openclaw/README.md                # OpenClaw gateway guide
├── nanoclaw/README.md                # NanoClaw guide
├── nemoclaw/README.md                # NemoClaw guide
└── package.json
```

## Multi-agent pipeline

Five agents with scoped contexts communicating via files on disk:

| Agent | Sees | Writes |
|---|---|---|
| **Tutor** (orchestrator) | Everything | Delegates to other agents |
| **Researcher** | Topic + level only | research.md |
| **CurriculumBuilder** | research.md, critique.md | plan.md, curriculum.json, domain files, teacher.md |
| **Critic** | plan.md, curriculum, domain files | critique.md |
| **Teacher** | curriculum, teacher.md, concept-map, resources, research, learning.md, USER.md | learning.md |

Pipeline: Researcher → CurriculumBuilder (plan → build) → Critic → loop until APPROVED or 3 iterations. Builder and domain files agent run in parallel. Critic uses cheap model.

## LLM backends

Set `OPENTUTOR_LLM` env var: `claude-sdk`, `cli` (default), `openai`, `openrouter`, `ollama`.
Pipeline can use a separate backend: `OPENTUTOR_PIPELINE_LLM=claude-sdk`.

## Running

```bash
npm run bot          # Telegram bot
npm run bot:test     # Bot with isolated test data (.test-data/)
npm run web          # Web UI at http://localhost:3000
npm run web:test     # Web with isolated test data
```

## Research pipeline

8 sources queried in parallel: arxiv, Semantic Scholar, OpenAlex, Wikipedia summary, MIT OCW / Coursera / edX syllabi, YouTube (Invidious), GitHub repos, Wikipedia internal links (concept graph). URL verification runs before Critic review.

## Group learning

Bot supports Telegram groups. Per-student progress in `workspace/students/`, group config in `workspace/groups/`. Exercise feedback sent via DM (private), anonymized stats posted to group. Members auto-tracked from messages.

## Test mode

Set `OPENTUTOR_DATA_DIR=.test-data` to redirect all runtime state to an isolated directory. Production skill files still read from the repo.

## Conventions

- Keep `SKILL.md` and `workspace/` files platform-agnostic. Platform-specific overrides go in the platform subfolder.
- Domain data is generated, not hand-authored. Edit `templates/domain-template.md` to change what gets generated.
- Pedagogy lives in `references/`, domain knowledge lives in `domains/`. Don't mix them.
- `lib/core/` is the single source of truth for pipeline, state, and prompts. Bot and web both import from it.
- All adapters implement the `BaseLLMAdapter.generate()` interface.
