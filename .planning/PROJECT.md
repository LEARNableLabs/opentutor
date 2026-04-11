# OpenTutor UX Improvements

## What This Is

OpenTutor is a universal agent skill that turns AI agents into personalized daily tutors. This milestone focuses on improving the student-facing experience — making exercises interactive, reducing message density, and adding navigation commands. Telegram is the primary platform.

## Core Value

The student should feel like they're using a polished learning app, not reading a wall of text from a chatbot. Interaction, not just consumption.

## Requirements

### Validated

- ✓ Core teaching skill with deliberate practice methodology — existing
- ✓ Meta-skill architecture with domain generation — existing
- ✓ Multi-platform support (OpenClaw, NanoClaw, NemoClaw) — existing
- ✓ Curriculum and progress tracking — existing
- ✓ Cron-based lesson delivery — existing

### Active

- [ ] Interactive exercise elements (buttons, polls, inline keyboards) for Telegram
- [ ] Shorter, chunked messages — no walls of text on mobile
- [ ] Slash command navigation (/next, /quiz, /progress, /topics)
- [ ] Better exercise/problem-solving interface with structured input
- [ ] Message formatting optimized for Telegram readability

### Out of Scope

- Full bot implementation (code/deployment) — issues only for this milestone
- Other platforms beyond Telegram — skill files stay platform-agnostic, Telegram-specific goes in openclaw/
- Real-time features (live quizzes, multiplayer) — too complex for v1 UX pass
- Web or mobile app — Telegram is the interface

## Context

- The tutor skill was recently refactored into a meta-skill architecture (SKILL.md + references/ + templates/ + domains/)
- OpenClaw integration already exists with a SOUL.md override that adds buttons and polls
- The current SOUL.md in openclaw/ already mentions interactive elements but the skill instructions don't guide how to use them for exercises specifically
- Messages are currently delivered as long prose blocks — need chunking guidance in skill files
- Slash commands exist in SKILL.md as "natural language intents" but aren't formalized for Telegram bot commands

## Constraints

- **Platform**: Telegram is the primary target — all UX improvements must work within Telegram's capabilities (inline keyboards, polls, bot commands)
- **No code this milestone**: Deliverables are skill file updates + GitHub issues. Code implementation is a separate milestone.
- **Backward compatible**: Changes to skill files must not break other platform integrations

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Telegram-first UX | Richest interactive surface (buttons, polls, inline keyboards) | — Pending |
| Slash commands over menu buttons | Student preference — typed commands as primary navigation | — Pending |
| Skill files + issues (not code) | Scope control — update instructions now, track code work as issues | — Pending |
| Meta-skill architecture | Already refactored — domain generation is the foundation | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-09 after initialization*
