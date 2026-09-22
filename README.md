<p align="center">
  <img src="assets/logo/opentutor-hero-512.png" alt="OpenTutor" width="200">
</p>

<h1 align="center">OpenTutor</h1>

<p align="center">
  <em>A portable Agent Skill that turns any AI agent into a personalized daily tutor</em>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg" alt="Node >= 22">
</p>

---

OpenTutor teaches you one topic a day, Socratically — it asks before it explains,
targets what you keep getting wrong, and brings concepts back days later in a new
context. It ships with **293 curricula** built from real sources, and can research
and build one for any topic you name.

It runs locally by default. Your learning history stays on your machine.

## Quickstart

```bash
git clone https://github.com/LEARNableLabs/opentutor
cd opentutor && npm install

echo "OPENROUTER_API_KEY=sk-or-..." > .env    # or ANTHROPIC_API_KEY / OPENAI_API_KEY
npm run web
```

Open http://localhost:3000 and say *"Let's start."*

That's the whole install. Any one LLM key works — the backend is inferred from
whichever you set.

**Prefer Telegram?** Add `TELEGRAM_BOT_TOKEN` and run `npm run bot`.
**Prefer your existing agent?** `npx skills add LEARNableLabs/opentutor`.

## What makes it different

**It reads before it writes.** Every curriculum is built from eight sources —
arxiv, Semantic Scholar, OpenAlex, Wikipedia, university syllabi, YouTube, GitHub
and Wikipedia's concept graph — and cites them. Curricula are drafted, then
reviewed by a separate Critic agent, and rewritten until it approves.

**It teaches rather than tells.** Each lesson opens on a question about last
week's material, then works through a diagnostic, an interleaved follow-up, and
an application you have to explain in your own words.

**It notices when you are stuck.** After every lesson a deliberate-practice pass
writes directives the next lesson has to follow — don't advance past this
concept, drop the difficulty, stop using that question format, bring this back in
a different context.

**It runs anywhere.** Telegram, a local web UI, Claude Code, Codex, Claude Web,
Hermes, OpenClaw. Five LLM backends behind one env var. Same curriculum state
underneath.

## How it teaches

Three ideas, all with a research base, all unusually ignored by software that
claims to teach.

**Socratic — ask before telling.** Every lesson is four steps and waits for your
answer: a retrieval question on *previous* material, an open diagnostic *before*
any explanation, a follow-up that connects to a different module, then a real
scenario where you explain *why*. An explanation you get before you've tried to
produce the answer lands on nothing.

**Deliberate practice — target the weakness.** After each lesson the tutor writes
directives the next one has to follow: `BLOCK` (don't advance past this),
`BUMP`/`DROP` (move the difficulty), `REVISIT` (bring it back in a new context),
`VARY` (stop using that question shape — they're pattern-matching), `GOAL`. This
runs deterministically from the session record, not by asking a model to be strict
with you.

**Spaced review — return after you start to forget.** Concepts come back about 1
session later, then 3, then 7, deliberately in a different shape each time, so
you're recalling the idea rather than the wording. Telegram adds per-concept SM-2
scheduling; the other surfaces use the directive-driven form, which is weaker.

Sessions run 1–10 minutes depending on how you're doing, and you can say "skip" at
any point. Autonomy outranks the plan.

→ **[docs/methodology.md](docs/methodology.md)** — the full account, what the
research actually says, and where this falls short.

## Where things are

| | |
|---|---|
| How it teaches | [docs/methodology.md](docs/methodology.md) — Socratic delivery, deliberate practice, spaced review |
| How it works | [docs/architecture.md](docs/architecture.md) — the agent pipeline, lesson flow, domain files |
| Every topic that ships | [docs/topic-catalog.md](docs/topic-catalog.md) |
| Hosting it | [docs/self-deploy.md](docs/self-deploy.md) · [docs/deployment.md](docs/deployment.md) |
| Working on the code | [CLAUDE.md](CLAUDE.md) · [AGENTS.md](AGENTS.md) |

**Platform guides:** [Telegram](docs/deployment.md) · [Web](docs/self-deploy.md) ·
[Claude Code](claude-code/README.md) · [Codex](codex/README.md) ·
[Claude Web](claude-web/README.md) · [Hermes](hermes/README.md) ·
[OpenClaw](openclaw/README.md) · [NemoClaw](nemoclaw/README.md) ·
[NanoClaw](nanoclaw/README.md)

## LLM backends

Set `OPENTUTOR_LLM`, or leave it unset and the backend is inferred from whichever
key is present.

| Backend | `OPENTUTOR_LLM` | Requires |
|---|---|---|
| Claude SDK | `claude-sdk` | `ANTHROPIC_API_KEY` |
| Claude CLI | `cli` | `claude` in PATH — no API key |
| OpenAI | `openai` | `OPENAI_API_KEY` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` — 200+ models |
| Ollama | `ollama` | Ollama running — local, free |

The curriculum pipeline can use a different one: `OPENTUTOR_PIPELINE_LLM=claude-sdk`.

## Building a topic it doesn't have

On a local installation, ask for anything. It researches the topic across eight sources, drafts a
curriculum, has a separate Critic agent review it, and revises it for up to
three rounds. It can return a curriculum that still needs review.

Hosted deployments currently activate existing curricula only; custom generation needs a durable worker (#121).

That loop runs one of two ways:

- **deterministic** (default) — the same fixed sequence every time. Predictable
  and bounded.
- **agentic** — an orchestrator decides what to do next from what the Critic
  actually said, choosing when to build, critique, or finish. Both `build` and
  `build_module` currently rebuild the full curriculum.

```js
new CurriculumPipeline({ adapter, state, skills, mode: 'agentic' })
```

## Hosting it for others

```bash
npm run web    # then open /admin.html
```

Add students, see what each has done, remove them. Each gets isolated
state — own profile, progress, completions, session memory and learning log.
Set `OPENTUTOR_ADMIN_PASSWORD`, which is deliberately not the password students
use: these routes read across everyone and delete their data.

Student sign-in and request routing are still pending (#116); the current web UI uses the shared instance. Provisioning prepares isolated stores but does not yet let students sign in to them.

Deployed to Vercel + Supabase the storage works the same way — run all four migrations in
`supabase/migrations/`, or the tutor will teach a lesson and forget it.

## License

MIT — see [LICENSE](LICENSE).
