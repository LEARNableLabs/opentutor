---
phase: 01-message-formatting-chunking
reviewed: 2026-04-09T17:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - openclaw/SOUL.md
  - skills/tutor/references/lesson-delivery.md
  - skills/tutor/SKILL.md
  - workspace/AGENTS.md
findings:
  critical: 0
  warning: 2
  info: 2
  total: 4
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-04-09T17:00:00Z
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Reviewed the four core skill/workspace Markdown files that define OpenTutor's teaching behavior: the meta-skill (`SKILL.md`), lesson delivery reference (`lesson-delivery.md`), OpenClaw personality override (`SOUL.md`), and workspace agent guide (`AGENTS.md`). These are prose instruction files consumed by AI agents at runtime -- correctness means internal consistency, unambiguous directives, and valid cross-references.

Two warnings found: a data path inconsistency between SKILL.md and AGENTS.md that could cause agents to look for curriculum data in the wrong directory, and a relative link in SOUL.md that breaks after deployment. Two informational items flagged for minor semantic inconsistencies.

No security issues. No hardcoded secrets, dangerous functions, or injection risks -- these files are pure instructional prose with no executable code.

## Warnings

### WR-01: Dual data path for curriculum/lesson sequences

**File:** `skills/tutor/SKILL.md:42` and `workspace/AGENTS.md:63`
**Issue:** SKILL.md tells the agent to load lesson sequences from `domains/<topic-slug>/curriculum.json` (line 42: "Load `domains/<topic-slug>/curriculum.json` for the lesson sequence"). AGENTS.md tells the agent to use `tutor/curricula/<topic>.json` (line 63: "`tutor/curricula/<topic>.json` -- per-topic lesson plans"). These are two different file paths for the same data. The curriculum-format reference (`references/curriculum-format.md`) also uses the `domains/` path, while AGENTS.md consistently uses `tutor/curricula/`. An agent reading both files during session boot (as instructed by AGENTS.md line 9-12) receives contradictory instructions about where lesson data lives, which could cause file-not-found failures or silent data misses.

**Fix:** Unify on one canonical path across all files. Since SKILL.md defines the domain generation structure as `domains/<topic-slug>/curriculum.json` and the domain-template generates files there, AGENTS.md should reference the same path. Update `workspace/AGENTS.md` lines 63 and 101:

```markdown
# Line 63: change from
- **`tutor/curricula/<topic>.json`** -- per-topic lesson plans

# Line 63: change to
- **`domains/<topic-slug>/curriculum.json`** -- per-topic lesson plans (inside domain directory)

# Line 101: change from
| `tutor/curricula/<topic>.json` | Per-topic lesson plans | When creating/adapting curricula |

# Line 101: change to
| `domains/<topic-slug>/curriculum.json` | Per-topic lesson plans | When generating/adapting domains |
```

Alternatively, if `tutor/curricula/` is the intended runtime path (distinct from the skill's domain directory), document the relationship explicitly so the agent knows both paths exist and when to use each.

### WR-02: Relative link in SOUL.md breaks after deployment

**File:** `openclaw/SOUL.md:24`
**Issue:** Line 24 contains a relative Markdown link: `[lesson-delivery.md](../skills/tutor/references/lesson-delivery.md)`. This resolves correctly within the repo (from `openclaw/` up to root, then into `skills/`). However, per `openclaw/README.md`, SOUL.md is deployed to `~/.openclaw/workspaces/tutor/SOUL.md`, where the relative path `../skills/tutor/references/lesson-delivery.md` does not resolve -- the `skills/` directory is not deployed alongside it. When the agent reads SOUL.md at runtime and attempts to follow this link to load the chunking/anchor rules, it will fail silently. The agent would then lack the detailed lesson delivery instructions that SOUL.md line 24 explicitly tells it to follow.

**Fix:** Since the agent reads `SKILL.md` during session boot (per AGENTS.md line 9), and SKILL.md already references `lesson-delivery.md` (SKILL.md line 63), the SOUL.md link is redundant for file loading. Change the link to a descriptive reference rather than a relative path the agent might try to follow:

```markdown
# Line 24: change from
...following the chunking and anchor rules in [lesson-delivery.md](../skills/tutor/references/lesson-delivery.md).

# Line 24: change to
...following the chunking and anchor rules in lesson-delivery.md (loaded via SKILL.md references).
```

Alternatively, if the skill files are also deployed to the workspace, ensure `skills/tutor/references/` is included in the deployment path.

## Info

### IN-01: Emoji anchor semantic inconsistency in "Just a Question" format

**File:** `skills/tutor/references/lesson-delivery.md:100-104`
**Issue:** The "Just a Question" format template (lines 100-104) uses `🧠 Question` as the anchor for a thought-provoking question: "🧠 Think about this: [thought-provoking question]?" However, the emoji anchor definition table (lines 68-73) defines `🧠` as "Core concept -- Concept explanation messages. Definitions, principles, key ideas." A question prompt is not a concept explanation. This creates a minor semantic tension: the anchor system promises consistent meaning ("the same emoji always means the same thing," line 79), but `🧠` means both "concept explanation" and "thought-provoking question" depending on the format.

**Fix:** This is a design choice, not a bug. Two options: (1) Accept the semantic stretch -- questions about concepts are close enough to "core concept" territory. (2) Use `✏️` for the question in this format, since questions are engagement prompts, which aligns with the `✏️` anchor definition ("Exercises, problems, engagement prompts"). If option 2, update lines 100-104:

```markdown
**Sequence:** 📖 Hook → ✏️ Question

- **Message 2 (✏️ Question):** "✏️ Think about this: [thought-provoking question]?"
```

### IN-02: Redundant formatting guidance across three files

**File:** `openclaw/SOUL.md:36-51`, `skills/tutor/references/lesson-delivery.md:179-192`, `workspace/AGENTS.md:107-115`
**Issue:** Formatting rules (bold for key terms, no tables, bullets over walls of text, code for formulas) are stated in three separate files with slight variations. `lesson-delivery.md` says "No headers -- use bold or emoji anchors" (line 189), while `openclaw/SOUL.md` specifies Telegram HTML tags (lines 36-51), and AGENTS.md adds platform-specific notes (lines 113-115). While not contradictory, the duplication means a formatting rule change requires edits in three places, increasing drift risk over time.

**Fix:** Consider consolidating formatting rules into `lesson-delivery.md` as the single source of truth, with SOUL.md and AGENTS.md referencing it rather than restating. This is a maintainability improvement, not a correctness issue.

---

_Reviewed: 2026-04-09T17:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
