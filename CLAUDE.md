# OpenTutor — Repo Guide

OpenTutor is a universal agent skill that turns any compatible AI agent into a personalized daily tutor. The skill is platform-agnostic; platform-specific integrations live in subfolders.

## Structure

```
opentutor/
├── skills/tutor/
│   ├── SKILL.md                      # Core teaching instructions (universal)
│   ├── cron/jobs.template.json       # Scheduled lesson job template
│   └── workspace/
│       ├── AGENTS.md                 # Agent behavior guide (session flow, memory, guardrails)
│       ├── IDENTITY.md               # Tutor persona
│       ├── SOUL.md                   # Teaching style
│       ├── USER.md                   # Student profile template
│       ├── memory/.gitkeep
│       └── tutor/
│           ├── curricula/.gitkeep
│           └── progress.json
├── openclaw/                         # OpenClaw-specific integration
│   ├── README.md                     # OpenClaw setup guide
│   └── opentutor.json                # Agent + channel config template
├── nanoclaw/                         # NanoClaw-specific integration
│   └── README.md                     # NanoClaw setup guide
├── nemoclaw/                         # NemoClaw-specific integration
│   └── README.md                     # NemoClaw setup guide
├── package.json
└── README.md                         # Universal install guide
```

## Key files

- **`skills/tutor/SKILL.md`** — the core skill. Edit this to change teaching methodology, persona, or behavior. All platforms read this.
- **`skills/tutor/workspace/AGENTS.md`** — agent behavior reference: session boot, memory, guardrails, formatting. Travels with the skill to every platform.
- **`openclaw/README.md`** — OpenClaw-specific setup (gateway config, Telegram pairing, cron jobs).
- **`nanoclaw/README.md`** — NanoClaw-specific setup (container/skills copy, workspace templates, task scheduler).

## Adding or editing skills

1. Create `skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`) and the skill body.
2. No code changes needed — compatible agents auto-discover `SKILL.md` files under `skills/`.

## Conventions

- Do not auto-commit or auto-push.
- Keep `SKILL.md` and `workspace/AGENTS.md` platform-agnostic. Platform-specific setup goes in its own subfolder.
