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
│   │   ├── students.js               # Provisioning registry (#80) — kept in kv, the one store all backends share
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
├── api/                              # Vercel serverless routes
│   ├── _lib/init.js                  # Shared store / adapter / skill-file resolution
│   ├── _lib/admin-auth.js            # OPENTUTOR_ADMIN_PASSWORD — a second secret, never the student's
│   ├── admin/students.js             # Provision / list / inspect / decommission students (#80)
│   ├── lesson.js                     # lessonTurn() — the Socratic turn, shared with the web server
│   └── chat.js, onboard.js, topics.js, progress.js, user.js, add-topic.js
├── public/                           # Vanilla JS frontend (served by scripts/web/server.js)
│   ├── index.html, app.js, style.css, favicon.png
│   ├── admin.html, admin.js, admin.css   # Students view (#80), behind the admin password
├── scripts/
│   ├── setup.js                      # Interactive setup CLI (no flags — prompts for everything)
│   ├── generate-teacher-md.js        # Backfills teacher.md across domains
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
├── tests/                            # vitest unit and integration tests
│   └── integration/                  # Constraints unit tests cannot reach: a read-only
│                                     # filesystem, a Postgres double, the platform guides
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

## Orchestrator modes

`CurriculumPipeline` runs one of two ways (#122):

- **`deterministic`** (default) — research → plan → build → critique, up to 3 iterations.
  Predictable and bounded. This is what CI exercises and what runs unless asked otherwise.
- **`agentic`** — `new CurriculumPipeline({ …, mode: 'agentic' })`. An orchestrator call
  chooses the next action from a closed set (`research`, `plan`, `build`, `build_module`,
  `critique`, `finish`) from the artifacts that exist and the last critique. A local
  critique can trigger another build; `build_module` currently rebuilds the full curriculum too.

The bounds are enforced in code, never asked for in the prompt: a step cap, no repeating an
action while nothing it reads has changed, always return a curriculum, and a fall back to
the deterministic loop after two unparseable decisions.

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

`skills/tutor/domains/` is **read-only content**. Which lessons a student has finished is
runtime state, overlaid onto the curriculum at read time by `lib/core/progress.js`.

**Where each piece of state lives depends on the backend**, and getting this wrong is what
#117 was — three writes went to a filesystem that is read-only on Vercel, the errors were
swallowed, and the hosted tutor forgot every lesson it taught:

| State | TutorState / TutorStore | SupabaseStore |
|---|---|---|
| Profile, progress, lesson-in-flight | `workspace/`, SQLite `kv` | Postgres `kv` |
| Lesson completion | `workspace/tutor/completions.json` | `lessons_completed` |
| `learning.md`, `practice-feedback.md` | `workspace/tutor/domains/<slug>/` | `domain_files` |
| Generated web curricula, assets, build checkpoints | SQLite `kv`, scoped `generated_topic:<slug>` | Postgres `kv`, same scoped key |
| Legacy/bot generated curricula | `skills/tutor/domains/<slug>/` | `curricula` |
| The 293 shipped curricula | on disk | on disk — read-only is no obstacle |
| Session memory | files / SQLite `memory` | Postgres `memory` |

Runtime profiles, progress, completions, learning logs and memory are partitioned by student (#80). Shipped content is shared; web-generated curricula are student-scoped in both SQLite and Supabase; legacy file-generated curricula remain shared. A store is scoped at construction —
`new TutorStore(root, { userId })` — rather than threading an id through all 31 methods;
omitting it is the original single-user install, unchanged.

So `lesson.status` and `lesson.engagement` still exist on the object every reader sees, but they are derived — never stored in the tracked file. Anything writing a curriculum back to disk goes through `withoutRuntimeFields()`. Curricula that still carry completion in content are migrated on first read.

## LLM backends

Set `OPENTUTOR_LLM`: `claude-sdk`, `cli`, `openai`, `openrouter`, `ollama`. With none set, the factory resolves from whichever API key is present (`ANTHROPIC_API_KEY` → claude-sdk, `OPENROUTER_API_KEY` → openrouter, `OPENAI_API_KEY` → openai), falling back to `cli`.
The pipeline can use a separate backend: `OPENTUTOR_PIPELINE_LLM=claude-sdk`.

The web server, the Vercel routes and the curriculum pipeline all honour this. **The Telegram bot's own chat and lesson calls do not** — `scripts/bot/claude.js` reads `CLAUDE_BACKEND` (`sdk` | `cli`) instead. See issue #98.

## Deployment boundaries

Vercel hosts the web UI and web API only. Run Telegram separately with `npm run bot` on an always-on host. Claw and Hermes integrations run in their own agent environments using the portable skill; this repo does not deploy those runtimes to Vercel.

## Student authentication

Admin provisioning returns a one-time student bearer token; PATCH `/api/admin/students?id=...` rotates it. Token digests live in unnamed-store KV and are checked on each request. `authenticateRequest` resolves identity and `getState(userId)` returns a scoped store. SQLite views share one connection, and Supabase views share one client; closing a view never closes the root connection. The shared password still selects the unnamed instance.

## Running

```bash
npm run bot          # Telegram bot
npm run bot:test     # Bot with isolated test data (.test-data/)
npm run web          # Web UI at http://localhost:3000
npm run web:test     # Web with isolated test data
npm test             # vitest unit and integration tests
npm run lint         # eslint over lib/, scripts/, api/
```

## Research pipeline

8 sources queried in parallel: arxiv, Semantic Scholar, OpenAlex, Wikipedia summary, MIT OCW / Coursera / edX syllabi, YouTube (Invidious), GitHub repos, Wikipedia internal links (concept graph). URL verification runs before Critic review.

## Group learning

Bot supports Telegram groups. Per-student progress in `workspace/students/`, group config in `workspace/groups/` (both created at runtime). Exercise feedback sent via DM (private), anonymized stats posted to group. Members auto-tracked from messages.

## Test mode

Set `OPENTUTOR_DATA_DIR=.test-data` to redirect runtime state to an isolated directory. Note that the bot also resolves its **domains** from `<dir>/domains` when this is set (`scripts/bot/config.js`), so `npm run bot:test` starts with no topics unless you seed that directory.

## Durable web generation (#121)

`topic-service.js` persists a build and awaits queue acceptance before shared `quick-start.js` creates five starter lessons. `topic-builds.js` performs one quick/plan/build/critique stage per delivery, staging model writes in memory and atomically publishing content with an id/revision compare-and-set. The 180-second lease outlasts each bounded stage; stale workers cannot overwrite a recovered or recreated job. Generated content is read before shipped content, with student completions overlaid on stable starter lesson ids.

Vercel uses the private `api/build-topic.js` queue consumer in `iad1`. The standalone server scans the same build records through `local-build-worker.js`. `GET /api/topic-build` lists scoped builds for browser recovery; adding a failed topic again resumes the saved stage. Three stage failures require an explicit retry. Three critique rounds can publish with `approved: false`, surfaced in the UI. The Telegram bot reuses quick-start generation but retains its own existing Phase B lifecycle.

## Conventions

- Keep `SKILL.md` and `workspace/` files platform-agnostic. Platform-specific overrides go in the platform subfolder.
- Domain data is generated, not hand-authored. Edit `templates/domain-template.md` to change what gets generated.
- Pedagogy lives in `references/`, domain knowledge lives in `domains/`. Don't mix them.
- `lib/core/` is the single source of truth for pipeline, state, and prompts. Bot and web both import from it.
- Never write runtime state into `skills/tutor/domains/` — it is tracked content. Use `lib/core/progress.js`.
- All adapters implement the `BaseLLMAdapter.generate()` interface.
- The local web server and the Vercel route share one lesson implementation (`lessonTurn` in `api/lesson.js`). Don't fork it.

## Working in this repo

**Every non-trivial change gets an issue and a PR.** Not just bugs — features,
refactors, doc overhauls, anything someone might later need to understand the
reasoning for. The issue says what is wrong and why it matters; the PR says what
was done about it. A commit straight to `main` leaves neither.

- Write the issue first when the problem is discovered first. If the fix comes
  out of doing something else, open the issue anyway and reference it.
- `Closes #N` on its own line, one per issue. A comma-separated list
  (`Closes #1, #2`) only closes the first.
- Don't branch a new PR off an unmerged branch unless the stacking is
  deliberate — the second PR's diff will contain the first one's commits.

**Review important changes with a second model before merging.**

```bash
claude -p --model fable "$(cat review-prompt.md)" > review.md
```

Ask it to be adversarial and to name file:line plus the input that triggers each
finding. It is worth it: the review of the per-student tenancy change (#80)
found four real defects, including a migration that silently lost a student's
profile, and a trust boundary that validated an id without canonicalising it.

Prioritise reviews for anything touching a trust boundary, a migration, money,
or state that more than one person can reach.

**Verify against something running, not only the suite.** The same #80 change
passed 378 tests with a bug that took the whole web server down on any duplicate
request — the route tests' fake `res` recorded a status instead of enforcing
that headers are written once. Start the server, curl the endpoints, include the
error paths.
