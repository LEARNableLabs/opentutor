<p align="center">
  <img src="assets/opentutor_logo.svg" alt="OpenTutor" width="200">
</p>

<h1 align="center">OpenTutor</h1>

<p align="center">
  <em>A portable Agent Skill that turns any AI agent into a personalized daily tutor</em>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="Node >= 18">
  <img src="https://img.shields.io/badge/npm-opentutor-red.svg" alt="npm: opentutor">
</p>

---

## Features

**:books: Research-Grounded Curricula** — Generates 20-30 lesson curricula sourced from arxiv, Semantic Scholar, OpenAlex, and Wikipedia. 292 pre-built topics across 30+ domains.

**:robot: Multi-Agent Pipeline** — Five scoped agents (Tutor, Researcher, CurriculumBuilder, Critic, Teacher) communicate through file artifacts. The Tutor orchestrates everything; each agent only sees what it needs.

**:repeat: Builder/Critic Loop** — CurriculumBuilder writes a plan, builds the curriculum, then a Critic agent reviews it. Loop runs up to 3 iterations until the Critic approves.

**:chart_with_upwards_trend: Adaptive Difficulty** — Adjusts lesson difficulty based on quiz performance and engagement patterns. `learning.md` tracks progress across sessions.

**:electric_plug: Multi-Platform** — Telegram bot, standalone web UI, Claude Code, Codex, OpenClaw, NemoClaw, and any Agent Skills-compatible client. All share the same curriculum state.

**:zap: Multi-LLM** — Adapters for Claude SDK, Claude CLI, OpenAI, and Ollama (local models). Switch backends with one env var.

**:pencil2: Interactive Exercises** — Numbered buttons (1-4), quiz polls, hints, skip options. Content flows naturally; the student only interacts at questions.

**:alarm_clock: Daily Scheduled Lessons** — Configurable daily pushes via cron-based scheduler.

**:brain: Session Memory** — `learning.md` per topic tracks progress, weak spots, and performance. The Tutor reads it on session boot to resume where you left off.

---

## Quickstart

### Telegram Bot

```bash
# 1. Install
npm install

# 2. Configure .env
TELEGRAM_BOT_TOKEN=your_token_from_botfather
TELEGRAM_CHAT_ID=your_chat_id          # optional, restricts to one chat
ANTHROPIC_API_KEY=your_key             # for SDK backend
CLAUDE_BACKEND=sdk                      # or 'cli' for Claude Code CLI

# 3. Run
npm run bot
```

### Web Interface

```bash
# No Telegram needed — runs a local web UI
OPENTUTOR_LLM=claude-sdk ANTHROPIC_API_KEY=your_key npm run web

# Opens at http://localhost:3000
```

### Claude Code Skill

```bash
npx opentutor setup
# or
npx skills add LEARNableLabs/opentutor
```

---

## Architecture

### Multi-Agent Pipeline

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

### Pipeline Flow

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

### Lesson Delivery (Telegram)

Content flows naturally — the student only interacts at questions:

```
Bot: 📖 [concept intro]          ← immediate
Bot: 🧠 [key insight]            ← 2s delay
Bot: 💡 [example]                ← 2s delay
Bot: ✏️ [question]               ← waits for answer
     [1] [2] [3] [4]
     [💡 Hint] [⏭ Skip]

Student: taps 3
Bot: ✅ Correct!
```

### LLM Backends

Set `OPENTUTOR_LLM` (or `CLAUDE_BACKEND` for backward compat):

| Backend | Env value | Requires | Best for |
|---|---|---|---|
| Claude SDK | `claude-sdk` | `ANTHROPIC_API_KEY` | Fastest for pipelines |
| Claude CLI | `cli` (default) | `claude` in PATH | No API key needed |
| OpenAI | `openai` | `OPENAI_API_KEY` | GPT models, Codex |
| Ollama | `ollama` | Ollama running | Local/private, free |

The pipeline can use a different backend from interactive chat:

```bash
OPENTUTOR_LLM=cli                    # chat uses Claude CLI
OPENTUTOR_PIPELINE_LLM=claude-sdk    # pipeline uses SDK (faster)
```

---

## Domain Files

Each topic in `skills/tutor/domains/<slug>/` contains:

| File | Writer | Purpose |
|---|---|---|
| `research.md` | Researcher | Academic sources from APIs |
| `plan.md` | CurriculumBuilder | Blueprint — scope, module rationale, pacing |
| `curriculum.json` | CurriculumBuilder | Lesson sequence with concepts, difficulty, type |
| `concept-map.md` | CurriculumBuilder | Concept dependency graph |
| `teaching-notes.md` | CurriculumBuilder | Misconceptions, level adjustments, pedagogy |
| `resources.md` | CurriculumBuilder | Curated books, videos, tools |
| `teacher.md` | CurriculumBuilder | Domain-specific teaching config (exercise style, tone) |
| `critique.md` | Critic | Structured review feedback |
| `learning.md` | Teacher | Session log — progress, performance, resume notes |

**292 pre-built topics** ship with full curricula (15-35 lessons each). Background research refresh runs automatically when a student picks one (30-day staleness check).

---

## Telegram Commands

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

## Repo Structure

```
opentutor/
├── lib/                              # Platform-agnostic core
│   ├── core/
│   │   ├── state.js                  # TutorState — file-based state management
│   │   ├── pipeline.js               # CurriculumPipeline — Builder/Critic loop
│   │   ├── prompts.js                # Agent prompt builders (no platform assumptions)
│   │   └── index.js                  # Core exports
│   └── adapters/
│       ├── base.js                   # BaseLLMAdapter — interface contract
│       ├── claude-sdk.js             # Anthropic API adapter
│       ├── claude-cli.js             # Claude Code CLI adapter
│       ├── openai.js                 # OpenAI/Codex adapter
│       ├── ollama.js                 # Local models adapter
│       └── index.js                  # Factory + exports
├── scripts/
│   ├── setup.js                      # Interactive setup CLI
│   ├── bot/                          # Telegram bot
│   │   ├── index.js                  # Entry point (npm run bot)
│   │   ├── claude.js                 # Claude wrapper (delegates to adapters)
│   │   ├── router.js                 # Message routing
│   │   ├── commands.js               # Slash commands + session resume
│   │   ├── lesson.js                 # Interactive lesson delivery
│   │   ├── curriculum.js             # Quick-start + pipeline delegation
│   │   ├── research.js               # Academic APIs (arxiv, Semantic Scholar, etc.)
│   │   ├── context.js                # Telegram-specific prompt builders
│   │   ├── callbacks.js              # Button handler (exercises, hints, skips)
│   │   ├── state.js                  # Bot state management
│   │   └── channels/telegram.js      # Telegram Bot API
│   └── web/                          # Standalone web interface
│       ├── server.js                 # HTTP server + REST API
│       └── public/                   # Vanilla JS frontend
│           ├── index.html
│           ├── style.css
│           └── app.js
├── skills/tutor/
│   ├── SKILL.md                      # Meta-skill: pedagogy + routing
│   ├── references/                   # Teaching methodology docs
│   ├── templates/domain-template.md  # Domain generation template
│   └── domains/                      # 292 pre-built topic domains
│       └── <topic-slug>/
│           ├── curriculum.json
│           ├── concept-map.md
│           ├── teaching-notes.md
│           ├── resources.md
│           ├── research.md
│           ├── plan.md               # CurriculumBuilder blueprint
│           ├── teacher.md            # Domain teaching config
│           ├── critique.md           # Critic feedback
│           └── learning.md           # Runtime session log
├── workspace/                        # Workspace templates
├── openclaw/                         # OpenClaw integration
├── nanoclaw/                         # NanoClaw integration
├── nemoclaw/                         # NemoClaw integration
└── package.json
```

---

## Platform Setup

### Telegram Bot
See [Quickstart](#quickstart) above.

### Web Interface
```bash
npm run web          # http://localhost:3000
npm run web:dev      # with --watch for development
```

### Claude Code
See [claude-code/README.md](claude-code/README.md) — install as a skill, use in CLI or IDE.

### Codex (OpenAI)
See [codex/README.md](codex/README.md) — runs with GPT models or Claude via OpenRouter.

### Claude Web (Projects)
See [claude-web/README.md](claude-web/README.md) — upload skill files as project knowledge.

### Hermes Agent
See [hermes/README.md](hermes/README.md) — skill execution with self-improvement, multi-gateway.

### OpenClaw
See [openclaw/README.md](openclaw/README.md) — gateway-based setup for Telegram/Slack.

### NemoClaw / NanoClaw
See [nemoclaw/README.md](nemoclaw/README.md) and [nanoclaw/README.md](nanoclaw/README.md).

---

## License

MIT
