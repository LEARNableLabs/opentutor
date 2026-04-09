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
- **Builds a curriculum** — 20–40 bite-sized daily lessons, tailored to your level
- **Delivers daily lessons** — short, focused, one concept at a time (~3–5 min read)
- **Adapts** — harder if you're breezing through, slower if you're stuck
- **Tracks progress** — remembers where you left off across sessions
- **Uses deliberate practice** — targets your weak spots, not what you already know

The teaching philosophy is the "1% rule": slow, steady growth compounds fast. A student who learns 1% per day for 100 days owns the topic.

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
└── tutor/
    ├── progress.json         # Active topics, schedule, history
    └── curricula/
        └── <topic>.json      # Per-topic lesson plans
```

Seed the workspace files from `skills/tutor/workspace/` on first run, or let the agent create them automatically.

### Curriculum format

Each topic is a JSON file in `tutor/curricula/`:

```json
{
  "topic": "Differential Geometry",
  "created": "2026-03-01",
  "prerequisites": ["multivariable calculus", "linear algebra"],
  "lessons": [
    {
      "day": 1,
      "title": "What is a curve?",
      "concepts": ["parametric curves", "smoothness"],
      "status": "completed",
      "delivered": "2026-03-02"
    },
    {
      "day": 2,
      "title": "Tangent vectors",
      "concepts": ["velocity vector", "unit tangent"],
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
├── skills/tutor/
│   └── SKILL.md                      # Tutor instructions (loaded on activation)
├── workspace/                        # Workspace templates (platform-agnostic)
│   ├── AGENTS.md                     # Session boot instructions
│   ├── IDENTITY.md                   # Tutor persona
│   ├── SOUL.md                       # Teaching style (base)
│   ├── USER.md                       # Student profile template
│   ├── memory/.gitkeep
│   └── tutor/
│       ├── curricula/.gitkeep
│       └── progress.json             # Initial progress state
└── openclaw/
    ├── SOUL.md                       # OpenClaw override (buttons, polls, charts)
    └── cron/jobs.template.json       # Scheduled lesson delivery template
```

## Validating the skill

Use the [skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref) validator:

```bash
npx skills-ref validate ./skills/tutor
```

## License

MIT
