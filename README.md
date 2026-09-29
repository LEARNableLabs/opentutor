<p align="center">
  <img src="assets/logo/opentutor-hero-512.png" alt="OpenTutor" width="180">
</p>

<h1 align="center">OpenTutor</h1>

<p align="center">
  <strong>Compounding deliberate curiosity.</strong><br>
  A personal tutor for whatever you're curious about: on the web, on Telegram, or inside your AI agent.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg" alt="Node >= 22">
</p>

---

OpenTutor teaches one short lesson at a time. It asks before it explains, works on
what you keep getting wrong, and brings ideas back days later in a new form.

It ships with 293 courses, from game theory to bread chemistry, and can build a new
one for any topic you name.

## Try it

**[opentutor-mauve.vercel.app](https://opentutor-mauve.vercel.app)**: browse every
course and answer an example question, no account needed.

Create an account for 3 free lessons. After that, connect your own
[OpenRouter](https://openrouter.ai) account to keep going; you pay OpenRouter
directly for what you use. You can delete your account and data at any time
([privacy](https://opentutor-mauve.vercel.app/privacy.html)).

## Run it on your computer

You need Node 22 or later and a key for one AI provider.

```bash
git clone https://github.com/LEARNableLabs/opentutor
cd opentutor && npm install

export OPENTUTOR_LLM=openrouter OPENROUTER_API_KEY=sk-or-...
npm run web
```

Open http://localhost:3000/learn.html. Your progress is saved on your computer, in
`workspace/`. Lesson text goes to the AI provider you chose.

- **Set the variables in your shell.** `npm run web` does not read `.env`. To use a
  file, run `node --env-file=.env scripts/web/server.js` instead.
- **Set `OPENTUTOR_LLM`, not only the key.** Lessons can infer the provider from the
  key, but the course builder can't. Without `OPENTUTOR_LLM` it falls back to the
  Claude Code CLI.
- **Other providers:** use `claude-sdk` with `ANTHROPIC_API_KEY`, `openai` with
  `OPENAI_API_KEY`, `ollama` for local models, or `cli` for Claude Code with no key.

**On Telegram:** put `TELEGRAM_BOT_TOKEN` in `.env` (the bot does read it) and run
`npm run bot`. See [Telegram on a separate host](docs/deployment.md#telegram-on-a-separate-host).
The bot's own lessons choose their model with `CLAUDE_BACKEND` (`sdk` or `cli`).

**In your AI agent:** run `npx skills add LEARNableLabs/opentutor`, then follow the
guide for [Claude Code](claude-code/README.md), [Codex](codex/README.md),
[Claude Web](claude-web/README.md), [Hermes](hermes/README.md),
[OpenClaw](openclaw/README.md), [NemoClaw](nemoclaw/README.md) or
[NanoClaw](nanoclaw/README.md).

## How it teaches

- **It asks before it explains.** A lesson is a short conversation: a question about
  what you already think, a follow-up, then a real situation where you explain why.
- **It comes back to what you missed.** After each lesson, a rules-based check (no
  AI) notes the concepts you're still unsure of. One that goes three lessons without
  review opens a later lesson as a retest, in a new context; after five, the next
  lesson is built around it.
- **On Telegram it adapts further.** The same check also raises or lowers the
  difficulty and changes the kind of question, and each idea gets its own review
  schedule that stretches as you remember it.

Lessons take a few minutes. On Telegram you can say "skip" at any point.
[docs/methodology.md](docs/methodology.md) explains the method, the research behind
it, and where it falls short.

## Where the courses come from

The 293 shipped courses live in [`skills/tutor/domains/`](skills/tutor/domains/),
5 to 40 lessons each; the website lists them all.

For a new topic, OpenTutor searches public sources (arXiv, Semantic Scholar,
OpenAlex, Wikipedia, course syllabi, YouTube and GitHub) and gives you five starter
lessons straight away. It then plans the full course and has a second AI pass
review it, revising for up to three rounds. On the hosted site, new topics need
your own OpenRouter account.

## Host it for others

- **A website anyone can sign up to** (Vercel and Supabase): follow
  [docs/self-deploy.md](docs/self-deploy.md), and run the four migrations in
  `supabase/migrations/` before deploying. Sign-up opens automatically once Supabase
  is configured. The free trial runs on your key, capped at 300 model calls a day
  (`OPENTUTOR_TRIAL_CALLS_PER_DAY`); see
  [free trial and students' own keys](docs/deployment.md#free-trial-and-students-own-openrouter-keys).
- **A small group on one server:** run
  `OPENTUTOR_HOST=0.0.0.0 OPENTUTOR_PASSWORD=… OPENTUTOR_ADMIN_PASSWORD=… npm run web`,
  then add students at `/admin.html`. Each student gets a one-time access token to
  enter at `/login.html` ("Have an existing access token?"), and their own separate
  progress. Without `OPENTUTOR_PASSWORD`, anyone who can reach the port uses your
  workspace.

## Documentation

| Read this | For |
|---|---|
| [docs/methodology.md](docs/methodology.md) | How it teaches, and the research behind it |
| [docs/architecture.md](docs/architecture.md) | How it works: the agents, the lesson flow, the course files |
| [docs/self-deploy.md](docs/self-deploy.md), [docs/deployment.md](docs/deployment.md) | Hosting on Vercel and Supabase, Telegram, local development |
| [CLAUDE.md](CLAUDE.md), [AGENTS.md](AGENTS.md) | Working on the code: every change gets an issue and a PR, reviewed by CodeRabbit and Codex |

## License

MIT. See [LICENSE](LICENSE).
