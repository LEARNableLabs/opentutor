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

## Where things are

| | |
|---|---|
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

## Hosting it for others

```bash
npm run web    # then open /admin.html
```

Add students, see what each has done, remove them. Each gets isolated state —
own profile, own progress, own session memory. Set `OPENTUTOR_ADMIN_PASSWORD`
(separate from the student password) to enable it.

## License

MIT — see [LICENSE](LICENSE).
