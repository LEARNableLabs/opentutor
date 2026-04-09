---
phase: 01-message-formatting-chunking
plan: 01
subsystem: skill-references
tags:
  - message-formatting
  - emoji-anchors
  - lesson-delivery
  - chunking-rules
dependency_graph:
  requires: []
  provides:
    - universal-chunking-rules
    - emoji-anchor-system
    - per-format-message-sequences
  affects:
    - skills/tutor/SKILL.md
    - openclaw/SOUL.md
tech_stack:
  added: []
  patterns:
    - pedagogical-section-based-chunking
    - 4-emoji-structural-anchors
    - per-format-message-templates
key_files:
  created: []
  modified:
    - skills/tutor/references/lesson-delivery.md
decisions:
  - Chunking by pedagogical section (not word count) per D-01
  - 150-word soft cap with clarity override per D-02
  - Minimum 2 messages per lesson per D-03
  - 4 emoji anchors (📖🧠💡✏️) per D-04
  - Anchors defined in universal references per D-05
  - Per-format message sequences per D-06, D-07, D-08
metrics:
  duration_seconds: 126
  tasks_completed: 2
  files_modified: 1
  commits: 2
  completed_date: "2026-04-09T20:32:10Z"
---

# Phase 01 Plan 01: Message Chunking & Emoji Anchors Summary

**One-liner:** Added universal message chunking rules (150-word soft cap, pedagogical section splitting, 2+ messages per lesson) and 4-emoji structural anchor system (📖🧠💡✏️) with per-format message sequence templates to lesson-delivery.md.

## What Was Built

Updated `skills/tutor/references/lesson-delivery.md` to be the single source of truth for message formatting and chunking across all platforms. The file now contains three major additions:

1. **Message Chunking section** — Defines splitting rules (split by pedagogical section, 150-word soft cap, minimum 2 messages, target 3-4 messages), overflow handling (paragraph boundaries, code block exception), and engagement rule (final message must have prompt).

2. **Emoji Anchors section** — Defines 4 structural emoji (📖 Title/progress, 🧠 Core concept, 💡 Example, ✏️ Exercise) with usage rules (one per message, no decorative emoji, consistent meaning, every message gets an anchor).

3. **Format Variations expansion** — Replaced bullet-only format list with full message sequence templates for all 5 formats:
   - Mini-Lesson (4 messages): 📖 Hook → 🧠 Concept → 💡 Example → ✏️ Exercise
   - Just a Question (2 messages): 📖 Hook → 🧠 Question
   - Resource Drop (3 messages): 📖 Hook → 💡 Resource → ✏️ Follow-up
   - Teach-Back (3 messages): 📖 Hook → ✏️ Prompt → 🧠 Scaffolding
   - Real-World Challenge (3 messages): 📖 Hook → ✏️ Challenge → 💡 Hint

4. **Updated Formatting section** — Removed old "emoji sparingly" guidance that conflicted with structured anchor system. Added references to chunking rules and emoji anchor system.

## Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Chunking by pedagogical section (D-01) | Lessons split at natural conceptual boundaries (hook/concept/example/exercise), not arbitrary word counts | Agent delivers semantically coherent messages instead of mechanically split text |
| 150-word soft cap (D-02) | Mobile reading research shows ~150 words optimal for messaging apps, but clarity override prevents mid-thought splits | Readable messages without sacrificing pedagogical coherence |
| 4 emoji anchors (D-04) | Simplified from 6 in openclaw/SOUL.md — merged redundant anchors (📌→📖, 🔬→💡, removed ⚡ and 📚) | Cleaner visual language, easier for students to scan |
| Universal reference location (D-05) | Defined in lesson-delivery.md (universal skill reference), not openclaw/SOUL.md (platform-specific) | All platforms inherit same chunking and anchor rules, no platform divergence |
| Per-format sequences (D-06, D-07, D-08) | Each of 5 formats gets its own message template — mini-lesson is 4 messages, others are 2-3 | Agent adapts message count and anchor order to pedagogical intent of each format |

## Implementation Details

### Task 1: Message Chunking and Emoji Anchors

**Commit:** 270f41c

Added two new sections after "Lesson Structure" and before "Format Variations":

- **Message Chunking** with subsections:
  - Splitting Rules (4 bullet points: pedagogical sections, 150-word soft cap, minimum 2 messages, target 3-4)
  - Overflow Handling (3-step decision tree + code block exception)
  - Engagement Rule (final message must have prompt)

- **Emoji Anchors** with table and rules:
  - Table defining 4 emoji (📖🧠💡✏️) with roles and usage
  - 4 rules (one anchor per message, no decorative emoji, consistent meaning, every message gets anchor)

Updated existing Formatting section to remove old "emoji sparingly" guidance and reference new systems.

### Task 2: Per-Format Message Sequence Templates

**Commit:** eb89859

Replaced the 5-line bullet list in "Format Variations" with full templates:

- Each format now has a subsection (### Mini-Lesson, ### Just a Question, etc.)
- Each subsection includes:
  - Description of pedagogical purpose
  - **Sequence:** emoji flow (e.g., 📖 Hook → 🧠 Concept → 💡 Example → ✏️ Exercise)
  - Per-message breakdown with copy patterns (e.g., "📖 Day N/total · Topic — Yesterday we [callback]. Today: [teaser]?")

Added "### Rules for All Formats" section establishing universal constraints:
- Final message must have engagement prompt
- Minimum 2 messages
- Each message gets one emoji anchor
- Adapt templates, don't rigidly follow

## Deviations from Plan

**None** — plan executed exactly as written. No bugs encountered, no critical functionality missing, no blocking issues.

## Verification Results

All acceptance criteria met:

- ✅ lesson-delivery.md contains "## Message Chunking"
- ✅ lesson-delivery.md contains "## Emoji Anchors"
- ✅ lesson-delivery.md contains "Soft cap: ~150 words per message"
- ✅ lesson-delivery.md contains "Minimum 2 messages per lesson"
- ✅ lesson-delivery.md contains "Target 3-4 messages for standard lessons"
- ✅ lesson-delivery.md contains "Code blocks are always kept whole"
- ✅ lesson-delivery.md contains "engagement prompt" (2 occurrences)
- ✅ All 4 emoji anchors present: 📖 (11 occurrences), 🧠 (7), 💡 (7), ✏️ (9)
- ✅ lesson-delivery.md contains "No decorative emoji"
- ✅ lesson-delivery.md contains "One anchor per message"
- ✅ Old "Emoji sparingly as visual anchors" guidance removed
- ✅ Old emoji (📌 🔬 ⚡) removed
- ✅ All 5 format templates present with sequences
- ✅ "Rules for All Formats" section present
- ✅ "Final message must have an engagement prompt" present
- ✅ "Day N/total" pattern present in templates (6 occurrences)

## Known Stubs

None. This plan updated skill file prose instructions only — no code with stub data.

## Self-Check: PASSED

**Files created:** None (expected — plan was file modification only)

**Files modified:**
- ✅ FOUND: skills/tutor/references/lesson-delivery.md

**Commits:**
- ✅ FOUND: 270f41c (Task 1 — message chunking and emoji anchors)
- ✅ FOUND: eb89859 (Task 2 — per-format message sequence templates)

## Impact Assessment

**Downstream work unlocked:**
- Plan 01-02 can now update openclaw/SOUL.md to align with new 4-anchor system (references universal rules defined here)
- Plan 01-02 can add Telegram HTML formatting guidance (builds on chunking rules defined here)
- Phase 2 (interactive exercises) can reference emoji anchor system for exercise delivery
- Phase 3 (slash commands) can reference message sequence templates for command responses

**Files that will need updates:**
- `skills/tutor/SKILL.md` — Currently says "Emoji sparingly (1-2 per message)" (line 63 per plan context). Plan 01-02 or a future plan should update to reference new anchor system.
- `openclaw/SOUL.md` — Currently has 6-emoji anchor system (📌🧠🔬✏️⚡📚). Plan 01-02 will update to match new 4-anchor set (📖🧠💡✏️).

**Integration risks:** None. Changes are additive (new sections) and replacements of conflicting guidance. No breaking changes to existing skill functionality.

## Next Steps

1. Execute Plan 01-02 (remaining plan in this phase) — update openclaw/SOUL.md to align with new anchor system and add Telegram HTML formatting
2. After both plans complete, verifier can validate that lesson-delivery.md and openclaw/SOUL.md are consistent
3. Manual testing can validate message chunking and emoji anchors work as intended on Telegram (per 01-UI-SPEC.md validation checklist)

---

**Duration:** 126 seconds (2 minutes 6 seconds)
**Tasks:** 2/2 completed
**Commits:** 2 (270f41c, eb89859)
**Files Modified:** 1 (skills/tutor/references/lesson-delivery.md)
