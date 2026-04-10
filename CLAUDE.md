# OpenTutor — Repo Guide

OpenTutor is a universal agent skill that turns any compatible AI agent into a personalized daily tutor. The tutor skill is a **meta-skill** — it defines teaching methodology and generates domain-specific data (curricula, concept maps, resources) for each topic a student chooses.

## Structure

```
opentutor/
├── skills/tutor/
│   ├── SKILL.md                      # Meta-skill: pedagogy, routing, domain generation
│   ├── references/                   # HOW to teach (universal)
│   │   ├── onboarding.md             # Full onboarding flow
│   │   ├── teaching-method.md        # Deliberate practice, levels, difficulty
│   │   ├── lesson-delivery.md        # Delivery modes, formatting, variations
│   │   ├── source-verification.md    # Citation rules
│   │   └── curriculum-format.md      # JSON schemas for curricula and progress
│   ├── templates/
│   │   └── domain-template.md        # Template for generating new domain data
│   └── domains/                      # WHAT to teach (generated per topic)
│       └── <topic-slug>/
│           ├── curriculum.json       # Lesson sequence
│           ├── concept-map.md        # Concept dependencies
│           ├── resources.md          # Curated books, videos, tools
│           └── teaching-notes.md     # Domain-specific pedagogy
├── workspace/                        # Workspace templates (platform-agnostic)
│   ├── AGENTS.md                     # Agent behavior guide (session flow, memory, guardrails)
│   ├── IDENTITY.md                   # Tutor persona
│   ├── SOUL.md                       # Teaching style (base)
│   ├── USER.md                       # Student profile template
│   ├── memory/.gitkeep
│   └── tutor/
│       └── progress.json             # Runtime state (active topics, history)
├── openclaw/                         # OpenClaw-specific integration
│   ├── README.md                     # OpenClaw setup guide
│   ├── SOUL.md                       # SOUL override (buttons, polls, charts)
│   └── cron/jobs.template.json       # Scheduled lesson job template
├── nanoclaw/                         # NanoClaw-specific integration
│   └── README.md                     # NanoClaw setup guide
├── nemoclaw/                         # NemoClaw-specific integration
│   └── README.md                     # NemoClaw setup guide
├── scripts/setup.js                  # Unified setup CLI
├── package.json
└── README.md                         # Universal install guide
```

## Key files

- **`skills/tutor/SKILL.md`** — the meta-skill. Defines teaching methodology, tone, and domain generation/routing logic. All platforms read this.
- **`skills/tutor/references/`** — deep documentation on pedagogy, inherited by all domains.
- **`skills/tutor/templates/domain-template.md`** — template used to generate new domain data when a student picks a topic.
- **`skills/tutor/domains/<topic>/`** — generated data directories, one per topic. Contains curriculum, concept map, resources, and teaching notes.
- **`workspace/AGENTS.md`** — agent behavior reference: session boot, memory, guardrails, formatting. Copied to every platform's workspace on setup.
- **`workspace/SOUL.md`** — base teaching personality. Platform folders can override (e.g. `openclaw/SOUL.md` adds buttons and polls).

## How domain generation works

1. Student picks a topic during onboarding or via "add topic: X"
2. Tutor researches the topic (web search, syllabi, textbooks)
3. Tutor generates `domains/<topic-slug>/` with four files following `templates/domain-template.md`
4. Tutor registers the topic in `workspace/tutor/progress.json`
5. When delivering lessons, tutor loads the domain's data + its own pedagogy references

## Adding or editing skills

1. Create `skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`) and the skill body.
2. No code changes needed — compatible agents auto-discover `SKILL.md` files under `skills/`.

## Conventions

- Do not auto-commit or auto-push.
- Keep `SKILL.md` and `workspace/` files platform-agnostic. Platform-specific overrides go in the platform subfolder.
- Domain data is generated, not hand-authored. Edit `templates/domain-template.md` to change what gets generated.
- Pedagogy lives in `references/`, domain knowledge lives in `domains/`. Don't mix them.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**OpenTutor UX Improvements**

OpenTutor is a universal agent skill that turns AI agents into personalized daily tutors. This milestone focuses on improving the student-facing experience — making exercises interactive, reducing message density, and adding navigation commands. Telegram is the primary platform.

**Core Value:** The student should feel like they're using a polished learning app, not reading a wall of text from a chatbot. Interaction, not just consumption.

### Constraints

- **Platform**: Telegram is the primary target — all UX improvements must work within Telegram's capabilities (inline keyboards, polls, bot commands)
- **No code this milestone**: Deliverables are skill file updates + GitHub issues. Code implementation is a separate milestone.
- **Backward compatible**: Changes to skill files must not break other platform integrations
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- JavaScript (Node.js) - Setup CLI (`scripts/setup.js`), skill manifests
- Markdown - Skill definitions, workspace templates, reference documentation
- JSON - Data formats (curriculum, progress tracking, cron jobs, configuration)
- YAML - Frontmatter in skill definitions (SKILL.md)
## Runtime
- Node.js (version not specified, defaults to project Node version)
- npm (implied by `package.json`, no lockfile committed)
- No `package-lock.json` in repo — developers manage local installs
## Frameworks
- Agent Skills Standard - Platform-agnostic skill framework used by Claude Code, OpenClaw, NanoClaw, NemoClaw, Cursor, Gemini CLI
- No external framework dependencies — skill is pure Markdown + JSON metadata
- TypeScript (`devDependencies`) — for optional type checking, not used in current codebase
## Key Dependencies
- `fs` (file system operations)
- `path` (path manipulation)
- `readline/promises` (interactive CLI prompts)
- `os` (home directory detection)
## Configuration
- `.env` files — not tracked, optional per-platform (OpenClaw, NanoClaw, NemoClaw all support `.env`)
- Agent config stored in platform-specific files:
- No build step required — skill is text files
- Optional validation: `npx skills-ref validate ./skills/tutor` (Agent Skills standard validator)
## Platform Requirements
- Node.js >= 12 (for ES modules in `setup.js`)
- No build tools required
- **Claude Code:** Claude Code client installed
- **OpenClaw:** OpenClaw gateway service + Telegram/Slack/WhatsApp infrastructure
- **NanoClaw:** NanoClaw container with Claude Code SDK
- **NemoClaw:** NemoClaw runtime configured
- **Cursor:** Cursor IDE with agent skills support
- **Gemini CLI:** Gemini CLI with skills support
## Installation Methods
## API Keys & Authentication
- **Anthropic:** API key (used by all platforms, configured per-agent)
- **OpenClaw/NemoClaw Telegram:** Bot token from @BotFather (optional, for Telegram delivery)
- **Slack/WhatsApp:** Platform credentials (configured at gateway level, not in skill)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- **Meta-skill:** Core teaching methodology is defined once (`skills/tutor/SKILL.md`), generates domain-specific data per student topic
- **Stateless agent code:** Skill file is pure pedagogical instructions — agent interprets and executes
- **Workspace-centric state:** All student data (progress, curricula, memory) lives in workspace files, not in skill code
- **Platform-agnostic:** Same skill works across Claude Code, OpenClaw, NanoClaw, NemoClaw, Cursor, Gemini CLI
- **Prose-driven inheritance:** Skills reference each other via Markdown wikilinks and file paths, not code imports
## Layers
- Purpose: Define teaching methodology and data models
- Location: `skills/tutor/SKILL.md`
- Contains:
- Depends on: Reference files in `skills/tutor/references/` and templates in `skills/tutor/templates/`
- Used by: Agent at runtime when teaching
- Purpose: Pedagogical deep-dives and decision trees
- Location: `skills/tutor/references/`
- Contains:
- Depends on: Nothing
- Used by: Agent when implementing skill logic
- Purpose: Generation templates for new student domains
- Location: `skills/tutor/templates/domain-template.md`
- Contains: How to create `domains/<topic>/` with curriculum.json, concept-map.md, resources.md, teaching-notes.md
- Depends on: Reference files (curriculum-format.md, teaching-method.md)
- Used by: Agent during domain generation
- Purpose: Student profile and teaching configuration (platform-agnostic templates)
- Location: `workspace/`
- Contains:
- Depends on: Nothing
- Used by: Agent on startup and during sessions
- Purpose: Platform-specific configuration and extensions
- Location: `<platform>/`
- Contains:
- Depends on: Base workspace files
- Used by: Platform setup script to provide platform-specific variants
- Purpose: Install skill + workspace to platform directories
- Location: `scripts/setup.js`
- Contains:
- Depends on: skill files, workspace templates, platform README files
- Used by: User running `npx opentutor setup`
## Data Flow
- **Runtime state:** progress.json (which lesson, engagement history, weak spots)
- **Lesson plans:** curricula/<topic>.json (20-40 lessons per topic, updated as tutor adapts)
- **Student profile:** USER.md (name, timezone, level, learning style discoveries)
- **Memory:** memory/YYYY-MM-DD.md (daily raw notes) + MEMORY.md (curated insights, updated weekly)
- **Tutor personality:** IDENTITY.md, SOUL.md (rarely change, set at setup)
## Key Abstractions
- Purpose: Container for topic-specific data (curriculum, concept map, resources, pedagogy)
- Examples: `skills/tutor/domains/differential-geometry/`, `skills/tutor/domains/python-basics/`
- Pattern: Directory with curriculum.json, concept-map.md, resources.md, teaching-notes.md
- Agent populates domains dynamically; no pre-built domain library in repo
- Purpose: Lesson sequence for a topic
- Examples: `tutor/curricula/linear-algebra.json`
- Pattern: JSON file with lessons array (day, title, concepts, status)
- Schema: `skills/tutor/references/curriculum-format.md`
- Purpose: Student tracking state
- Examples: `tutor/progress.json`
- Pattern: JSON with active_topics, schedule, history
- Updated after every interaction
- Purpose: Reusable pedagogical patterns referenced from SKILL.md
- Examples: Deliberate practice (Ericsson), level-adaptive delivery, spaced repetition
- Pattern: Prose instructions in `references/teaching-method.md` that agent implements contextually
## Entry Points
- Location: `scripts/setup.js`
- Triggers: `npx opentutor setup`
- Responsibilities: Platform detection, interactive prompts, file copy orchestration, agent registration
- Location: `skills/tutor/SKILL.md`
- Triggers: Agent activation (user says "learn something" or cron job fires)
- Responsibilities:
- Location: `workspace/AGENTS.md`
- Triggers: Agent starts session
- Responsibilities: Silent file reads (USER.md, progress.json, memory), no narration
## Teaching Flow (Agent-Side)
```
```
## Error Handling
- **Missing workspace files:** Agent prompts to create; doesn't crash
- **Empty curricula:** Agent suggests picking new topic or reviewing existing
- **Invalid JSON:** Agent logs error, prompts user to fix
- **Web search failures:** Agent skips fact verification, uses best judgment (non-blocking)
- **Cron job timeout:** Short-circuits on empty active_topics, returns early message
## Cross-Cutting Concerns
- Daily session logs: `memory/YYYY-MM-DD.md`
- Curated long-term: `MEMORY.md` (distilled every few days)
- Platform logs: Handled by agent runtime (OpenClaw `openclaw logs`, NanoClaw session history, etc.)
- Lesson engagement: "answered correctly", "struggled", "asked good questions"
- Adaptive difficulty tracking: 3-in-a-row bumps complexity, 2 struggles in-a-row slows down
- Weak spot detection: Re-visit concepts that had low engagement
- Tutor identity: IDENTITY.md (name, role, emoji)
- Teaching tone: SOUL.md (Socratic, concrete examples, casual)
- Platform tone variant: openclaw/SOUL.md overrides with rich UI patterns (buttons, polls, charts)
- No session state lost: All decisions written to files before agent ends
- Cross-channel sharing: Same workspace means same progress across Slack/Telegram/WhatsApp for one agent
- Cold start: No mental notes — agent reads files, derives state on boot
- Agent must verify facts before teaching (per references/source-verification.md)
- Every lesson ends with 📚 References block
- Web search available as tool for verification
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.

**Fast-track rule:** For simple, obvious tasks (quick edits, config changes, small fixes), just do them directly — skip planning, discussion, and subagent overhead. Use `/gsd-quick` or just edit. Reserve the full GSD ceremony for multi-step work that actually needs coordination.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
