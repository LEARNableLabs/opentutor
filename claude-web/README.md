# OpenTutor — Claude Web (Projects)

One file. Drag it into a Claude Project and you have a tutor.

## Setup

1. Download **[`opentutor.skill`](opentutor.skill)** from this folder.
2. On [claude.ai](https://claude.ai), create a Project — name it after what you're learning.
3. Upload `opentutor.skill` to the project's **knowledge**.
4. Say: *"Let's start."*

That is the whole install. No custom instructions to paste — the skill carries its own
pedagogy, tone and lesson structure.

## Add your topic

OpenTutor ships 293 pre-built curricula. Pick one from
[`skills/tutor/domains/`](../skills/tutor/domains/) and upload its files to the same
project:

| File | Needed? |
|---|---|
| `curriculum.json` | **Yes** — the lesson sequence |
| `teaching-notes.md` | Recommended — how to teach *this* subject |
| `concept-map.md` | Recommended — what depends on what |
| `resources.md`, `research.md` | Optional — real books, papers and courses to cite |

Not in the 293? Ask the tutor to build one. It follows the same schema and researches the
topic before writing it.

## Continuity between sessions

Claude Web starts every conversation fresh, so OpenTutor keeps its memory in a file.

At the end of each session the tutor hands you an updated **`learning.md`** — who you
are, what you've covered, what you keep getting wrong, and what to do about it next time.
**Replace the old `learning.md` in the project knowledge with it.** The next session reads
it and opens on a retrieval question instead of asking you where you left off.

Skip that step and the next session repeats a lesson. It is the one piece of housekeeping
this build cannot do for you.

## What this build cannot do

| | Claude Web | Telegram bot / self-hosted web |
|---|---|---|
| Scheduled daily lessons | ✗ — you open the project | ✓ cron |
| Writes its own state | ✗ — you save `learning.md` back | ✓ SQLite / Postgres |
| Builder/Critic review of new curricula | ✗ single-pass | ✓ up to 3 iterations |
| Socratic delivery, deliberate practice, spaced review | ✓ | ✓ |

For the full version, see the [Telegram bot](../README.md#telegram-bot) or
[self-hosted web UI](../README.md#web-ui).

## Rebuilding the bundle

`opentutor.skill` is committed so it can be downloaded without cloning, which means it
can go stale. It is built from [`SKILL.md`](SKILL.md) in this folder plus the shared
references under `skills/tutor/`:

```bash
npm run build:claude-web-skill
```

`tests/claude-web-skill.test.js` unzips the committed bundle and diffs it against those
sources, so a stale bundle fails CI rather than reaching a student. Rebuild after editing
any of them.
