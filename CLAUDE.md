# OpenTutor — Repo Guide

OpenTutor is a universal agent skill that turns any compatible AI agent into a personalized daily tutor. It uses a multi-agent pipeline (Tutor, Researcher, CurriculumBuilder, Critic, Teacher) with scoped contexts — each agent only sees files relevant to its role. 293 pre-built topic domains ship ready to use.

Requires **Node >= 22** (`better-sqlite3` and `@supabase/supabase-js` both require it; CI runs 22).

## Structure

```
opentutor/
├── lib/                              # Platform-agnostic core
│   ├── core/
│   │   ├── state.js                  # TutorState — file-based state
│   │   ├── store.js                  # TutorStore — SQLite-backed state (local dev)
│   │   ├── supabase-store.js         # SupabaseStore — Postgres-backed state (see issue #94)
│   │   ├── progress.js               # Lesson completion: overlay on read, never written to content
│   │   ├── db.js                     # SQLite schema and migrations
│   │   ├── pipeline.js               # CurriculumPipeline — Builder/Critic loop (max 3 iterations)
│   │   ├── research.js               # 8-source research; the pipeline falls back to it when a caller passes none
│   │   ├── prompts.js                # Agent prompt builders (no platform assumptions)
│   │   ├── student-model.js          # Accuracy trends, difficulty adjustment, engagement signals
│   │   ├── deliberate-practice.js    # DeliberatePractitioner — evaluates teaching, writes directives
│   │   ├── concept-graph.js          # Parses concept-map.md into a prerequisite graph
│   │   └── index.js
│   ├── adapters/
│   │   ├── base.js                   # BaseLLMAdapter interface
│   │   ├── claude-sdk.js             # Anthropic API
│   │   ├── claude-cli.js             # Claude Code CLI (claude -p)
│   │   ├── openai.js                 # OpenAI-compatible HTTP (native fetch, no SDK dependency)
│   │   ├── openrouter.js             # OpenRouter (200+ models) — extends OpenAIAdapter
│   │   ├── ollama.js                 # Local models
│   │   └── index.js                  # createAdapter(), createAdapterFromEnv(), createPipelineAdapterFromEnv()
│   └── channels/email.js             # Resend email channel (not wired into any code path yet)
├── api/                              # Vercel serverless routes
│   ├── _lib/init.js                  # Shared store / adapter / skill-file resolution
│   ├── lesson.js                     # lessonTurn() — the Socratic turn, shared with the web server
│   ├── telegram.js                   # Telegram webhook
│   └── chat.js, onboard.js, topics.js, progress.js, user.js, add-topic.js
├── public/                           # Vanilla JS frontend (served by scripts/web/server.js)
│   ├── index.html, app.js, style.css, favicon.png
├── scripts/
│   ├── setup.js                      # Interactive setup CLI (no flags — prompts for everything)
│   ├── generate-teacher-md.js        # Backfills teacher.md across domains
│   ├── register-webhook.js           # Registers the Telegram webhook
│   ├── bot/                          # Telegram bot adapter
│   │   ├── index.js                  # Entry point (npm run bot)
│   │   ├── claude.js                 # LLM wrapper — reads CLAUDE_BACKEND, not OPENTUTOR_LLM (issue #98)
│   │   ├── router.js                 # Message routing + group member tracking
│   │   ├── commands.js               # Slash commands + session resume from learning.md
│   │   ├── lesson.js                 # Socratic multi-turn delivery, adaptive length, practice enforcement
│   │   ├── curriculum.js             # Phase A quick-start + Phase B pipeline delegation to lib/core
│   │   ├── research.js               # 8-source research
│   │   ├── context.js                # Telegram-specific prompt builders
│   │   ├── callbacks.js              # Button handler (exercises via DM in groups)
│   │   ├── state.js                  # Bot state + group/student state
│   │   ├── scheduler.js              # node-cron daily pushes (needs TELEGRAM_CHAT_ID)
│   │   ├── spaced-repetition.js      # SM-2 scheduling
│   │   ├── session.js, message.js, chat.js, quiz.js, flashcard.js,
│   │   ├── onboarding.js, config.js, helpers.js, logger.js, typing.js
│   │   └── channels/{base,telegram}.js
│   └── web/server.js                 # HTTP server + REST API (npm run web); serves public/
├── skills/tutor/
│   ├── SKILL.md                      # Meta-skill: pedagogy, routing
│   ├── references/                   # HOW to teach (universal)
│   │   ├── teaching-method.md        # Deliberate practice, levels, difficulty
│   │   ├── lesson-delivery.md        # Delivery modes, formatting
│   │   ├── curriculum-format.md      # JSON schemas
│   │   ├── source-verification.md    # Citation rules
│   │   └── onboarding.md             # Onboarding flow
│   ├── templates/domain-template.md  # Domain generation template
│   └── domains/                      # 293 pre-built topic domains (5–40 lessons, median 27)
│       └── <topic-slug>/             # Shipped: the five files below
│           ├── curriculum.json       # Lesson sequence (content only — no completion state)
│           ├── concept-map.md        # Concept dependencies
│           ├── teaching-notes.md     # Domain-specific pedagogy
│           ├── resources.md          # Curated books, videos, tools
│           ├── research.md           # Academic sources from APIs
│           └── teacher.md            # Domain-specific teaching config
│                                     # plan.md / critique.md are written at build time,
│                                     # learning.md / practice-feedback.md at runtime.
│                                     # None of the four ship with the 293 domains.
├── skills/tutor-onboarding/SKILL.md  # First-run onboarding skill
├── workspace/                        # Workspace templates + runtime state
│   ├── AGENTS.md, IDENTITY.md, SOUL.md, USER.md
│   ├── tutor/progress.json           # Active topics, schedule, history
│   ├── tutor/completions.json        # Lesson completion (gitignored, created at runtime)
│   ├── memory/YYYY-MM-DD.md          # Daily session logs
│   └── groups/, students/, sessions/ # Created at runtime; not in the repo
├── tests/                            # vitest — 25 files, 208 tests
├── docs/                             # Deployment, curriculum generation, reviews
├── supabase/migrations/              # Postgres schema
├── assets/, eval/, factory.md
├── claude-code/, codex/, claude-web/, hermes/, openclaw/, nanoclaw/, nemoclaw/   # Platform guides
├── vercel.json, eslint.config.js, vitest.config.js
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
| **DeliberatePractitioner** | learning.md, curriculum, practice-feedback.md | practice-feedback.md (BLOCK/BUMP/DROP/VARY/REVISIT/GOAL directives) |

Pipeline: Researcher → CurriculumBuilder (plan → build) → Critic → loop until APPROVED or 3 iterations. Builder and domain files agent run in parallel. Critic uses cheap model.

## Lesson delivery

Socratic multi-turn conversation with adaptive length. Three modes selected from the student model (`selectMode` in `scripts/bot/lesson.js`):

| Mode | Duration | Steps | Trigger |
|---|---|---|---|
| **Quick** | ~1 min | retrieval → application | Accuracy >85% **and** trend improving **and** engagement not low |
| **Standard** | ~3-5 min | retrieval → diagnostic → follow-up → application | Everything else, including disengaged students |
| **Deep** | ~8-10 min | retrieval → diagnostic → scaffolding → follow-up → teach-back → application | Accuracy <30%, declining trend, "go deeper", or a BLOCK directive |

The retrieval step is dropped when no concept is due for review, so a first lesson opens on the diagnostic.

Mid-lesson branching: steps expand (student says "go deeper") or contract (student nails the diagnostic) dynamically. Student can type "skip" or "move on" at any time (autonomy).

DeliberatePractitioner runs after each lesson (deterministic, no LLM call) and writes enforceable directives to `practice-feedback.md`. The Teacher reads these before the next lesson and follows them.

`selectMode` also accepts a `pushType` for differentiated scheduled pushes, but no caller passes one today — `scheduler.js` delivers a normal lesson at every slot.

## Lesson state

`skills/tutor/domains/` is **read-only content**. Which lessons a student has finished is runtime state, kept in `workspace/tutor/completions.json` (gitignored) and overlaid onto the curriculum at read time by `lib/core/progress.js`.

So `lesson.status` and `lesson.engagement` still exist on the object every reader sees, but they are derived — never stored in the tracked file. Anything writing a curriculum back to disk goes through `withoutRuntimeFields()`. Curricula that still carry completion in content are migrated on first read.

## LLM backends

Set `OPENTUTOR_LLM`: `claude-sdk`, `cli`, `openai`, `openrouter`, `ollama`. With none set, the factory resolves from whichever API key is present (`ANTHROPIC_API_KEY` → claude-sdk, `OPENROUTER_API_KEY` → openrouter, `OPENAI_API_KEY` → openai), falling back to `cli`.
The pipeline can use a separate backend: `OPENTUTOR_PIPELINE_LLM=claude-sdk`.

The web server, the Vercel routes and the curriculum pipeline all honour this. **The Telegram bot's own chat and lesson calls do not** — `scripts/bot/claude.js` reads `CLAUDE_BACKEND` (`sdk` | `cli`) instead. See issue #98.

## Running

```bash
npm run bot          # Telegram bot
npm run bot:test     # Bot with isolated test data (.test-data/)
npm run web          # Web UI at http://localhost:3000
npm run web:test     # Web with isolated test data
npm test             # vitest — 208 tests
npm run lint         # eslint over lib/, scripts/, api/
```

## Research pipeline

8 sources queried in parallel: arxiv, Semantic Scholar, OpenAlex, Wikipedia summary, MIT OCW / Coursera / edX syllabi, YouTube (Invidious), GitHub repos, Wikipedia internal links (concept graph). URL verification runs before Critic review.

## Group learning

Bot supports Telegram groups. Per-student progress in `workspace/students/`, group config in `workspace/groups/` (both created at runtime). Exercise feedback sent via DM (private), anonymized stats posted to group. Members auto-tracked from messages.

## Test mode

Set `OPENTUTOR_DATA_DIR=.test-data` to redirect runtime state to an isolated directory. Note that the bot also resolves its **domains** from `<dir>/domains` when this is set (`scripts/bot/config.js`), so `npm run bot:test` starts with no topics unless you seed that directory.

## Conventions

- Keep `SKILL.md` and `workspace/` files platform-agnostic. Platform-specific overrides go in the platform subfolder.
- Domain data is generated, not hand-authored. Edit `templates/domain-template.md` to change what gets generated.
- Pedagogy lives in `references/`, domain knowledge lives in `domains/`. Don't mix them.
- `lib/core/` is the single source of truth for pipeline, state, and prompts. Bot and web both import from it.
- Never write runtime state into `skills/tutor/domains/` — it is tracked content. Use `lib/core/progress.js`.
- All adapters implement the `BaseLLMAdapter.generate()` interface.
- The local web server and the Vercel route share one lesson implementation (`lessonTurn` in `api/lesson.js`). Don't fork it.
