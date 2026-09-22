# OpenTutor — Hermes Agent Setup Guide

OpenTutor as a skill for [Hermes Agent](https://github.com/nousresearch/hermes-agent). Hermes handles skill execution, memory, and self-improvement; OpenTutor provides the teaching methodology and curricula.

## Why Hermes

Hermes Agent shares OpenTutor's file conventions (`SOUL.md`, `USER.md`, `MEMORY.md`, `skills/`), has built-in gateways (Telegram, Discord, Slack, WhatsApp, Signal), and a native cron scheduler — so OpenTutor works with minimal setup.

## Prerequisites

- Hermes Agent installed and running
- A channel gateway configured (Telegram, Discord, etc.)

## Step 1 — Install the skill

```bash
# From the opentutor repo root
cp -r skills/tutor/ ~/.hermes/skills/tutor/

# Or symlink for live updates
ln -s $(pwd)/skills/tutor ~/.hermes/skills/tutor
```

Hermes auto-discovers skills from `~/.hermes/skills/` — no registration needed.

## Step 2 — Set up workspace files

```bash
# Copy workspace templates
cp workspace/IDENTITY.md ~/.hermes/IDENTITY.md
cp workspace/templates/USER.md ~/.hermes/USER.md
cp hermes/SOUL.md ~/.hermes/SOUL.md

# Create state directories
mkdir -p ~/.hermes/tutor/curricula ~/.hermes/memory
cp workspace/templates/progress.json ~/.hermes/tutor/progress.json
```

Edit `~/.hermes/USER.md` with your name, timezone, and level.

## Step 3 — Configure lesson delivery

Hermes has native cron support. Schedule daily lessons:

```bash
hermes schedule add \
  --name "daily-lesson" \
  --cron "0 9,13,19 * * *" \
  --prompt "Read tutor/progress.json. If active_topics is non-empty, deliver the next pending lesson from the matching curriculum. Follow the teaching methodology in your tutor skill. Keep responses concise — one concept, one exercise."
```

Or ask the agent directly:

```
Schedule daily tutor lessons at 9am, 1pm, and 7pm
```

## Step 4 — Start learning

Talk to the agent through any configured gateway:

```
I want to learn auction theory
```

```
Next lesson
```

```
Quiz me on what we covered
```

## Workspace mapping

| OpenTutor | Hermes | Notes |
|---|---|---|
| `workspace/SOUL.md` | `~/.hermes/SOUL.md` | Use `hermes/SOUL.md` override |
| `workspace/USER.md` | `~/.hermes/USER.md` | Student profile |
| `workspace/IDENTITY.md` | `~/.hermes/IDENTITY.md` | Tutor persona |
| `workspace/memory/` | `~/.hermes/memory/` | Daily session logs |
| `workspace/templates/progress.json` | `~/.hermes/tutor/progress.json` | Learning state (seeded from the template) |
| `skills/tutor/domains/` | `~/.hermes/skills/tutor/domains/` | 293 pre-built curricula |

## NemoClaw + Hermes deployment

The target production stack:

```
Hermes Agent (skill execution, memory, self-improvement)
  └── NemoClaw (agent runtime + channel gateway)
       └── OpenTutor skill (teaching + curricula)
```

For this setup:
1. Install OpenTutor skill in Hermes (this guide)
2. Configure NemoClaw as the runtime ([nemoclaw/README.md](../nemoclaw/README.md))
3. Hermes handles teaching; NemoClaw handles channels and container isolation

## Gateway vs. standalone bot

You have two options for Telegram delivery:

| Approach | When to use |
|---|---|
| **Hermes gateway** | You're already running Hermes with Telegram configured. Simpler — no extra process. |
| **Standalone bot** (`npm run bot`) | You want the full interactive flow (numbered buttons, chunked delivery, exercise callbacks). Hermes gateway doesn't support inline buttons. |

Both share the same curriculum state on disk — a lesson completed through one is reflected in the other.

## Self-improvement loop vs. deliberate practice

OpenTutor and Hermes both generate feedback, at different scopes. Keeping them apart is
what stops one student's bad week from permanently rewriting how everyone is taught.

```
per lesson    DeliberatePractitioner ──▶ practice-feedback.md ──▶ next lesson for THIS student
              (deterministic, no LLM call)

across many   Hermes self-improvement ──▶ SKILL.md, teaching-method.md ──▶ every student, forever
sessions      (proposes; a human approves)
```

| | Deliberate practice | Hermes self-improvement |
|---|---|---|
| Writes | `workspace/tutor/domains/<topic>/practice-feedback.md` | `SKILL.md`, `references/teaching-method.md` |
| Scope | One student, one topic, next lesson | Every student, every topic, permanently |
| Evidence | The session that just ended | Trends across many students and topics |
| Reverses | Automatically, next lesson | Only if a human reverts the change |

**Hermes reads the directives, it does not replace them.** `practice-feedback.md` is
plain markdown in the workspace, so Hermes's skill system can read it directly — see
[SOUL.md](SOUL.md) for the directive table the tutor follows before each lesson.

A `BLOCK` on recursion means re-teach recursion for that student. It is not evidence that
the pedagogy is wrong. A refinement proposal is warranted only when a pattern holds
*across* students and topics — for instance, `learning.md` files in many domains showing
the application step failing after a clean diagnostic.

Review every proposal before it lands. Proposals should target *how* to teach, never the
curricula themselves, which are research-grounded and cite real sources.

## Notes

- The 293 pre-built curricula are available immediately
- `teacher.md`, `plan.md` and `critique.md` are generated by the pipeline when adding a topic; `learning.md` and `practice-feedback.md` are runtime state and land in `workspace/tutor/domains/<topic>/`, not beside the shipped curricula
- Hermes's memory system (`MEMORY.md`) complements OpenTutor's `learning.md` — both track student context but at different granularities
