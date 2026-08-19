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

**:books: Research-Grounded Curricula** — Generates 20-30 lesson curricula sourced from arxiv, Semantic Scholar, OpenAlex, and Wikipedia

**:repeat: Spaced Repetition** — Built-in flashcard system with SM-2 scheduling to reinforce concepts at optimal intervals

**:chart_with_upwards_trend: Adaptive Difficulty** — Adjusts lesson difficulty based on quiz performance and engagement patterns

**:electric_plug: Multi-Platform** — Works with Claude Code, Cursor, Gemini CLI, OpenCode, OpenClaw, NanoClaw, and any Agent Skills-compatible client

**:zap: Two-Phase Generation** — Instant mini-wiki intro (Phase A) while full curriculum researches in background (Phase B, 30-90s)

**:pencil2: Interactive Exercises** — Inline buttons (A/B/C/D), quiz polls, hints, skip options, and open-ended practice

**:alarm_clock: Daily Scheduled Lessons** — Three daily pushes (morning, midday, evening) via cron-based scheduler

**:brain: Session Memory** — Remembers progress, weak spots, and conversation history across sessions

---

## Quickstart

**1. Install**

```bash
npx opentutor setup
```

**2. Configure `.env`**

```bash
TELEGRAM_BOT_TOKEN=your_token_from_botfather
TELEGRAM_CHAT_ID=your_chat_id          # optional, restricts to one chat
ANTHROPIC_API_KEY=your_key             # for SDK backend
CLAUDE_BACKEND=sdk                      # or 'cli' for Claude Code CLI
```

**3. Run**

```bash
npm run bot
```

---

## Telegram Bot

OpenTutor includes a self-contained Telegram bot. No external gateway needed — just a bot token and an API key.

### Backend Options

- **CLI** (default): uses `claude -p` — no API key needed, requires Claude Code installed
- **SDK**: uses the Anthropic API directly — faster, supports web search during curriculum generation

### Slash Commands

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

### Natural Language Commands

| Say | What happens |
|---|---|
| `next lesson` | Deliver the next lesson now |
| `quiz me` | Ad-hoc review of recent material |
| `skip` | Mark current lesson done, move on |
| `I'm stuck on X` | Deep dive into a concept |
| `show my progress` | Summary of where you are |
| `add topic: X` | Start a new curriculum |
| `pause` / `resume` | Pause or resume daily delivery |

---

## How It Works

### Curriculum Generation (Two-Phase)

1. **Phase A (instant)** — sends a mini-wiki intro grounded in Wikipedia + a suggested video/article to engage with immediately
2. **Phase B (background, 30-90s)** — researches the topic across arxiv, Semantic Scholar, OpenAlex, and Wikipedia in parallel, then synthesizes a full 20-30 lesson curriculum with verified resources

### Architecture

```
User -> Telegram -> Router -> [Commands, Lessons, Quiz, Chat, Onboarding] -> Claude -> Research APIs
```

### Workspace Layout

```
workspace/
├── USER.md                   # Your profile: name, level, interests
├── IDENTITY.md               # Tutor persona
├── SOUL.md                   # Teaching style
├── AGENTS.md                 # Session boot instructions
├── MEMORY.md                 # Curated long-term memories
├── memory/
│   └── YYYY-MM-DD.md         # Daily session logs
├── sessions/
│   └── <chatId>.jsonl        # Conversation history per chat
└── tutor/
    └── progress.json         # Active topics, schedule, history
```

### Curriculum Format

```json
{
  "topic": "Optimal Transport",
  "slug": "optimal-transport",
  "created": "2026-04-14",
  "student_level": "advanced",
  "prerequisites": ["measure theory basics", "linear algebra", "probability"],
  "exit_criteria": ["Explain Monge vs Kantorovich", "Implement Sinkhorn"],
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

### Progress File

`tutor/progress.json` tracks what's active and what's happened:

```json
{
  "active_topics": ["differential-geometry"],
  "schedule": {
    "times": ["09:00", "13:00", "19:00"],
    "timezone": "America/New_York",
    "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  },
  "history": []
}
```

---

## Install

### Full install (skill + workspace)

```bash
npx opentutor setup
```

Detects Claude Code, OpenClaw, and NanoClaw. Copies the skill, workspace templates, and boot instructions into the right place for each platform.

### Skill-only install (Agent Skills standard)

```bash
npx skills add LEARNableLabs/opentutor
```

Installs the skill file only. Use `npx opentutor setup` afterward to set up the workspace.

```bash
# Install for specific agents only
npx skills add LEARNableLabs/opentutor -a claude-code
npx skills add LEARNableLabs/opentutor -a claude-code -a cursor -a opencode

# Preview what will be installed
npx skills add LEARNableLabs/opentutor --list
```

### Manual install

Copy or symlink `skills/tutor/` into any agent's skills directory:

| Agent | Project-level | Global |
|---|---|---|
| Claude Code | `.claude/skills/tutor/` | `~/.claude/skills/tutor/` |
| Cursor | `.cursor/skills/tutor/` | `~/.cursor/skills/tutor/` |
| Gemini CLI | `.gemini/skills/tutor/` | `~/.gemini/skills/tutor/` |
| OpenCode | `.opencode/skills/tutor/` | `~/.opencode/skills/tutor/` |
| Any agent | `.agents/skills/tutor/` | `~/.agents/skills/tutor/` |

---

## Repo Structure

```
opentutor/
├── assets/
│   ├── opentutor_logo.png            # Project logo (PNG)
│   └── opentutor_logo.svg            # Project logo (SVG)
├── scripts/
│   ├── setup.js                      # Interactive setup CLI
│   └── bot/                          # Self-contained Telegram bot
│       ├── index.js                  # Entry point (npm run bot)
│       ├── claude.js                 # Claude wrapper (CLI + SDK backends)
│       ├── router.js                 # Message routing
│       ├── commands.js               # Slash command handlers
│       ├── lesson.js                 # Lesson delivery with emoji-anchor chunking
│       ├── quiz.js                   # Quiz generation via Telegram polls
│       ├── curriculum.js             # Two-phase curriculum generation
│       ├── research.js               # Academic research pipeline (arxiv, etc.)
│       ├── context.js                # System prompt builders
│       ├── onboarding.js             # New student onboarding flow
│       ├── callbacks.js              # Inline button handler
│       ├── scheduler.js              # Cron-based lesson scheduler
│       ├── session.js                # Conversation history (JSONL)
│       ├── state.js                  # File-based state management
│       ├── config.js                 # Configuration loader
│       ├── helpers.js                # Shared utility functions
│       ├── flashcard.js              # Flashcard system
│       ├── spaced-repetition.js      # SM-2 spaced repetition scheduler
│       ├── logger.js                 # Structured logging
│       └── channels/
│           ├── base.js               # Channel interface
│           └── telegram.js           # Telegram Bot API implementation
├── skills/tutor/
│   ├── SKILL.md                      # Meta-skill: pedagogy + domain generation
│   ├── references/                   # Teaching methodology docs
│   ├── templates/                    # Domain generation template
│   └── domains/                      # Generated per-topic data
│       └── <topic-slug>/
│           ├── curriculum.json
│           ├── concept-map.md
│           ├── teaching-notes.md
│           └── research.md
├── workspace/                        # Workspace templates (platform-agnostic)
│   ├── AGENTS.md                     # Session boot instructions
│   ├── IDENTITY.md                   # Tutor persona
│   ├── SOUL.md                       # Teaching style (base)
│   └── USER.md                       # Student profile template
├── openclaw/                         # OpenClaw-specific integration
│   ├── SOUL.md                       # Telegram override (buttons, polls, HTML)
│   └── cron/jobs.template.json       # Scheduled lesson template
├── docs/
│   └── curriculum-generation.md      # Full curriculum workflow docs
└── package.json
```

---

## License

MIT
