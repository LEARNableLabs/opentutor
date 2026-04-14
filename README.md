<p align="center">
  <img src="assets/opentutor_logo.png" alt="OpenTutor" width="200">
</p>

# OpenTutor

A portable [Agent Skill](https://agentskills.io) that turns any compatible AI agent into a personalized, daily tutor for any topic — programming, math, science, languages, history, and more.

One skill. Works everywhere.

## Install

### Full install (skill + workspace)

```bash
npx opentutor setup
```

Detects Claude Code, OpenClaw, and NanoClaw. Copies the skill, workspace templates, and boot instructions into the right place for each platform. You'll be prompted to choose which platforms to set up.

### Skill-only install (Agent Skills standard)

```bash
npx skills add LEARNableLabs/opentutor
```

Installs the skill file only. Use `npx opentutor setup` afterward to set up the workspace (progress tracking, USER.md, memory).

```bash
# Install for specific agents only
npx skills add LEARNableLabs/opentutor -a claude-code
npx skills add LEARNableLabs/opentutor -a claude-code -a cursor -a opencode

# Preview what will be installed without installing
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

## Compatibility

OpenTutor follows the [Agent Skills](https://agentskills.io) open standard and works with any compatible agent:

**Claude Code · Cursor · Gemini CLI · OpenCode · OpenHands · GitHub Copilot · Codex · Roo Code · Amp · OpenClaw · NanoClaw · NemoClaw · [and more](https://agentskills.io/clients)**

## What it does

OpenTutor activates when you want to learn something. It:

- **Onboards you** — asks what you want to learn, your background, and your level
- **Researches the topic** — searches arxiv, Semantic Scholar, OpenAlex, and Wikipedia for real papers, syllabi, and textbooks
- **Builds a curriculum** — 20–30 lessons grounded in actual academic sources, not generic outlines
- **Delivers daily lessons** — short, focused, one concept at a time (~3–5 min read) via Telegram
- **Interactive exercises** — inline buttons (A/B/C/D), quiz polls, hints, and skip options
- **Adapts** — harder if you're breezing through, slower if you're stuck
- **Tracks progress** — remembers where you left off across sessions
- **Uses deliberate practice** — targets your weak spots, not what you already know

The teaching philosophy is the "1% rule": slow, steady growth compounds fast. A student who learns 1% per day for 100 days owns the topic.

## Telegram Bot

OpenTutor includes a self-contained Telegram bot. No external gateway needed — just a bot token and an API key.

```bash
# Set up .env
TELEGRAM_BOT_TOKEN=your_token_from_botfather
TELEGRAM_CHAT_ID=your_chat_id          # optional, restricts to one chat
ANTHROPIC_API_KEY=your_key             # for SDK backend
CLAUDE_BACKEND=sdk                      # or 'cli' for Claude Code CLI

# Run
npm run bot
```

The bot supports two backends:
- **CLI** (default): uses `claude -p` — no API key needed, requires Claude Code installed
- **SDK**: uses the Anthropic API directly — faster, supports web search during curriculum generation

### Slash commands

| Command | What it does |
|---|---|
| `/start` | Begin onboarding |
| `/next` | Get the next lesson |
| `/quiz` | Quick review quiz (native Telegram polls) |
| `/progress` | See your learning progress |
| `/topics` | List active topics |
| `/add <topic>` | Start learning a new topic |
| `/pause` / `/resume` | Pause or resume daily lessons |
| `/help` | Show available commands |

### Natural language commands

| Say | What happens |
|---|---|
| `next lesson` | Deliver the next lesson now |
| `quiz me` | Ad-hoc review of recent material |
| `skip` | Mark current lesson done, move on |
| `I'm stuck on X` | Deep dive into a concept |
| `show my progress` | Summary of where you are |
| `add topic: X` | Start a new curriculum |
| `pause` / `resume` | Pause or resume daily delivery |

## How it works

### Progressive disclosure

The agent loads only the skill description at startup (~50 tokens). When you trigger the tutor, it loads the full `SKILL.md` instructions. Reference files (workspace, curricula) are read on demand.

### Workspace

The tutor stores state in a workspace directory — by default wherever your agent's workspace is configured. The layout:

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

Seed the workspace files from `workspace/` on first run, or let the agent create them automatically.

### Curriculum generation

When you pick a topic, the tutor uses a **two-phase** approach:

1. **Phase A (instant)** — sends a mini-wiki intro grounded in Wikipedia + a suggested video/article to engage with immediately
2. **Phase B (background, 30-90s)** — researches the topic across arxiv, Semantic Scholar, OpenAlex, and Wikipedia in parallel, then synthesizes a full 20-30 lesson curriculum with verified resources

See [docs/curriculum-generation.md](docs/curriculum-generation.md) for the full workflow.

Each topic is stored in `skills/tutor/domains/<topic-slug>/`:

```
domains/optimal-transport/
├── curriculum.json      # 20-30 lessons with verified resources
├── concept-map.md       # Concept dependency graph
├── teaching-notes.md    # Domain-specific pedagogy
└── research.md          # Raw research results (arxiv, papers, etc.)
```

### Curriculum format

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

### Progress file

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

## Daily Lessons (Cron)

OpenTutor is designed for 3 scheduled pushes per day — a short spark to start a conversation, not a full lesson. The real learning happens in the reply.

| Time (ET) | Trigger |
|---|---|
| 9:00 AM | Morning lesson |
| 1:00 PM | Midday review |
| 7:00 PM | Evening practice |

A cron template is at `openclaw/cron/jobs.template.json`. Import it into your agent's scheduler, set the `CHANNEL_NAME`, and adjust the timezone to yours.

## Repo structure

```
opentutor/
├── assets/
│   └── opentutor_logo.png            # Project logo
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

## Validating the skill

Use the [skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref) validator:

```bash
npx skills-ref validate ./skills/tutor
```

## License

MIT
