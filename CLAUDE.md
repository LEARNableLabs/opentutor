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

Domain generation uses a **tutor-controlled pipeline** (`.claude/workflows/new-topic.js`). A tutor agent judges every step and decides: ADVANCE, RESEARCH (targeted deep-dive), REDO (with feedback), or ESCALATE (ask human).

1. **Survey research** — broad multi-source search (arxiv, Semantic Scholar, OpenAlex, Wikipedia, educational). Tutor may request up to 3 targeted research rounds on specific subtopics.
2. **Audience assessment** — tutor profiles the target learner (audience type, goal, background, tone, depth)
3. **Build curriculum** — 4 parallel design agents generate domain files. Tutor judges; may trigger targeted research or a rebuild.
4. **QA** — 5 adversarial dimension checkers + verification. Tutor judges; may trigger patch rebuild + re-QA.
5. **Schedule** — difficulty analysis + pacing design. Tutor judges.
6. **Register** — adds topic to `workspace/tutor/progress.json`

Research is **demand-driven**: the tutor can request targeted research at any step, not just during the research phase. Patch mode rebuilds only the parts that need fixing (~5 agents vs 10 for full rebuild).

See `docs/curriculum-generation.md` for the full workflow documentation.

## Adding or editing skills

1. Create `skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`) and the skill body.
2. No code changes needed — compatible agents auto-discover `SKILL.md` files under `skills/`.

## Conventions

- Keep `SKILL.md` and `workspace/` files platform-agnostic. Platform-specific overrides go in the platform subfolder.
- Domain data is generated, not hand-authored. Edit `templates/domain-template.md` to change what gets generated.
- Pedagogy lives in `references/`, domain knowledge lives in `domains/`. Don't mix them.
