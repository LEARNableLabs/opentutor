---
phase: 01-message-formatting-chunking
plan: 02
subsystem: skill-alignment
tags:
  - cross-references
  - platform-formatting
  - telegram-html
  - anchor-alignment
dependency_graph:
  requires:
    - universal-chunking-rules
    - emoji-anchor-system
  provides:
    - aligned-platform-formatting
    - telegram-html-guidance
  affects:
    - openclaw/SOUL.md
    - skills/tutor/SKILL.md
    - workspace/AGENTS.md
tech_stack:
  added: []
  patterns:
    - cross-file-reference-alignment
    - platform-specific-formatting-guidance
key_files:
  created: []
  modified:
    - openclaw/SOUL.md
    - skills/tutor/SKILL.md
    - workspace/AGENTS.md
decisions:
  - Replace 6-anchor system with 4-anchor system in openclaw/SOUL.md
  - Add Telegram HTML formatting section to openclaw/SOUL.md
  - Remove all conflicting emoji guidance from SKILL.md and AGENTS.md
  - Reference lesson-delivery.md as canonical source for chunking and anchors
metrics:
  duration_seconds: 150
  tasks_completed: 2
  files_modified: 3
  commits: 2
  completed_date: "2026-04-09T20:37:45Z"
---

# Phase 01 Plan 02: Platform File Alignment Summary

**One-liner:** Aligned openclaw/SOUL.md, SKILL.md, and AGENTS.md with the universal 4-anchor system (📖🧠💡✏️), added Telegram HTML formatting guidance, and removed all conflicting emoji guidance across all three files.

## What Was Built

Updated three skill files to align with the universal chunking and anchor system established in Plan 01-01:

1. **openclaw/SOUL.md** — Replaced 6-anchor system (📌📚🧠⚡🔬✏️) with 4-anchor system (📖🧠💡✏️), added reference to lesson-delivery.md, and created new "Telegram HTML Formatting" section with supported tags, character limits, and HTML-over-MarkdownV2 guidance.

2. **skills/tutor/SKILL.md** — Updated Tone & Style section and Formatting section to reference the 4-anchor system and lesson-delivery.md, removing old "emoji sparingly" guidance in both locations.

3. **workspace/AGENTS.md** — Updated Platform Formatting section to reference message chunking rules (150-word soft cap), emoji anchor system (📖🧠💡✏️), and Telegram HTML formatting guidance from openclaw/SOUL.md.

## Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Replace 6-anchor with 4-anchor in openclaw/SOUL.md | openclaw/SOUL.md had old system (📌📚🧠⚡🔬✏️); Plan 01-01 created new 4-anchor system (📖🧠💡✏️) | Aligns platform-specific file with universal reference, eliminates contradiction |
| Add Telegram HTML Formatting section | Telegram supports specific HTML subset; agents need to know supported tags, character limits, and escaping rules | Provides clear HTML formatting contract for Telegram lesson delivery |
| Reference lesson-delivery.md from all three files | lesson-delivery.md is the canonical source for chunking and anchors (established in Plan 01-01) | Creates single source of truth, prevents future divergence across files |
| Remove "emoji sparingly" guidance | Old guidance conflicted with structured anchor system | Eliminates confusion — agents now see only one emoji guidance pattern |

## Implementation Details

### Task 1: Update openclaw/SOUL.md

**Commit:** d55f744

**Change 1: Replace emoji anchor list in Lesson Delivery section**

Replaced the 6-item bullet list (📌 Title, 📚 References, 🧠 Core concept, ⚡ Key distinction, 🔬 Example, ✏️ Exercise) with:

```
- **Structured messages.** Each lesson is delivered as a sequence of short messages following the chunking and anchor rules in [lesson-delivery.md](../skills/tutor/references/lesson-delivery.md). Use the 4 emoji anchors consistently:
  - 📖 Title + day progress (e.g., "📖 Day 5/34 · Eigenvalues")
  - 🧠 Core concept
  - 💡 Example or analogy
  - ✏️ Exercise or engagement prompt
```

This removes:
- 📌 (replaced by 📖 for title)
- 📚 (removed — references go inline without dedicated emoji)
- ⚡ (merged into 🧠 core concept)
- 🔬 (replaced by 💡 for examples)

Kept all other bullet points unchanged: inline buttons, progress tracking, run code inline, interactive quizzes, questions with options.

**Change 2: Add Telegram HTML Formatting section**

Added new section after Lesson Delivery and before Scheduling & Timing:

```markdown
## Telegram HTML Formatting

Telegram supports a specific HTML subset for message formatting. Use these tags in lesson messages:

- `<b>key term</b>` — bold for definitions, important concepts, and emphasis
- `<i>variable</i>` — italic for emphasis, variables, foreign terms
- `<code>Av = λv</code>` — inline code for math symbols, formulas, short code
- `<pre>code block</pre>` — code blocks for multi-line code, worked examples
- `<pre><code class="language-python">...</code></pre>` — syntax-highlighted code blocks
- `<a href="url">link text</a>` — inline hyperlinks for resources
- `<span class="tg-spoiler">hidden answer</span>` — spoiler text (student taps to reveal)

**Not supported:** `<h1>`, `<p>`, `<div>`, custom CSS, custom colors. Telegram strips unsupported tags silently.

**Character limit:** 4,096 characters per message (hard limit). The 150-word soft cap from lesson-delivery.md keeps messages well under this (~750-900 characters at 150 words).

**Prefer HTML over MarkdownV2** for Telegram — HTML is more explicit and requires less escaping. MarkdownV2 needs escaping for common characters (`_`, `*`, `[`, `]`, `(`, `)`, `~`, `` ` ``, `>`, `#`, `+`, `-`, `=`, `|`, `{`, `}`, `.`, `!`).
```

No other sections modified — preserved all existing content (How You Teach, Tone, Scheduling & Timing, Memory & Adaptation, Resources, Interactivity).

### Task 2: Update SKILL.md and AGENTS.md

**Commit:** 77ee402

**SKILL.md changes (2 locations):**

1. **Tone & Style section** (line 66): Replaced "Emoji — use sparingly as visual anchors (🧠 concept, ✏️ exercise, 📚 references), not decoration..." with:
   ```
   - **Emoji** — use the 4 emoji anchors (📖🧠💡✏️) as structural message markers — see [lesson-delivery.md](references/lesson-delivery.md) for the full system
   ```

2. **Formatting section** (line 303): Replaced "Emoji sparingly as visual anchors (one or two per message, not every bullet). Match the student's emoji style..." and "Keep each message focused..." with:
   ```
   - Use the 4 structural emoji anchors (📖🧠💡✏️) at message starts — see [lesson-delivery.md](references/lesson-delivery.md) for the full anchor system and chunking rules
   - Keep each message focused — deliver lessons as 3-4 short messages (~150 words each), not one giant one
   ```

**AGENTS.md changes:**

Replaced entire Platform Formatting section (lines 107-115) with:

```markdown
## Platform Formatting

- **Scannable** — bullets and short paragraphs, no walls of text
- **Bold** for key terms, `code` for formulas/code
- No markdown tables on platforms that don't render them — use bullet lists instead
- **Message chunking** — deliver lessons as 3-4 short messages (~150 words each), not one giant message. See `skills/tutor/references/lesson-delivery.md` for chunking rules and per-format sequences.
- **Emoji anchors** — use the 4 structural anchors (📖🧠💡✏️) at the start of each message. No decorative emoji. See lesson-delivery.md for the full anchor system.
- **Slack** — full markdown works
- **Telegram** — use HTML formatting (`<b>`, `<i>`, `<code>`, `<pre>`). See `openclaw/SOUL.md` for the Telegram HTML reference.
- **WhatsApp** — plain text preferred, avoid markdown tables
```

This replaced:
- Old "Emoji sparingly — one or two per message max. Mirror the student's style"
- Old "Telegram — bold and bullets, keep it simple"

With:
- Message chunking guidance (150 words, 3-4 messages, reference to lesson-delivery.md)
- Emoji anchors section (4-anchor system, reference to lesson-delivery.md)
- Telegram HTML formatting (reference to openclaw/SOUL.md)

## Deviations from Plan

**None** — plan executed exactly as written. No bugs encountered, no critical functionality missing, no blocking issues.

## Verification Results

All acceptance criteria met:

**Task 1 (openclaw/SOUL.md):**
- ✅ Contains 📖 emoji (1 occurrence)
- ✅ Contains 🧠 emoji (1 occurrence)
- ✅ Contains 💡 emoji (1 occurrence)
- ✅ Contains ✏️ emoji (1 occurrence)
- ✅ Contains "## Telegram HTML Formatting" section
- ✅ Contains "lesson-delivery.md" reference (2 occurrences)
- ✅ Contains "`<b>`" (HTML bold tag in formatting guidance)
- ✅ Contains "4,096 characters per message"
- ✅ Contains "tg-spoiler"
- ✅ Does NOT contain 📌 emoji (0 occurrences)
- ✅ Does NOT contain 🔬 emoji (0 occurrences)
- ✅ Does NOT contain ⚡ emoji (0 occurrences)
- ✅ Does NOT contain 📚 emoji (0 occurrences)
- ✅ Still contains "Inline buttons" (Phase 2 content preserved)
- ✅ Still contains "Interactive quizzes" (Phase 2 content preserved)

**Task 2 (SKILL.md and AGENTS.md):**
- ✅ SKILL.md contains "📖🧠💡✏️" (2 occurrences)
- ✅ SKILL.md contains "structural message markers"
- ✅ SKILL.md contains "lesson-delivery.md" in emoji anchor lines (2 occurrences)
- ✅ SKILL.md does NOT contain "Emoji sparingly" (0 occurrences)
- ✅ AGENTS.md contains "📖🧠💡✏️" (1 occurrence)
- ✅ AGENTS.md contains "Message chunking"
- ✅ AGENTS.md contains "150 words"
- ✅ AGENTS.md contains "Emoji anchors"
- ✅ AGENTS.md contains "lesson-delivery.md" reference (2 occurrences)
- ✅ AGENTS.md contains "HTML formatting" in Telegram line
- ✅ AGENTS.md contains "openclaw/SOUL.md" reference in Telegram line
- ✅ AGENTS.md does NOT contain "Emoji sparingly" (0 occurrences)
- ✅ AGENTS.md does NOT contain old "bold and bullets, keep it simple" for Telegram

**Overall plan verification:**
- ✅ All three files reference lesson-delivery.md as canonical source
- ✅ No conflicting emoji guidance remains
- ✅ Non-formatting content preserved in all files
- ✅ Telegram HTML formatting fully documented

## Known Stubs

None. This plan updated skill file prose instructions only — no code with stub data.

## Self-Check: PASSED

**Files created:** None (expected — plan was file modification only)

**Files modified:**
- ✅ FOUND: openclaw/SOUL.md
- ✅ FOUND: skills/tutor/SKILL.md
- ✅ FOUND: workspace/AGENTS.md

**Commits:**
- ✅ FOUND: d55f744 (Task 1 — openclaw/SOUL.md alignment and Telegram HTML formatting)
- ✅ FOUND: 77ee402 (Task 2 — SKILL.md and AGENTS.md cross-reference updates)

## Impact Assessment

**Downstream work unlocked:**
- Phase 2 (interactive exercises) can now reference the aligned emoji anchor system for exercise delivery patterns
- Phase 3 (slash commands) can reference the aligned message chunking rules for command response formatting
- Agents reading any of these three files will see consistent emoji and chunking guidance

**Requirements fulfilled:**
- FMT-02: Telegram HTML formatting guidance added to openclaw/SOUL.md
- FMT-03: Platform-specific formatting aligned with universal chunking rules (openclaw/SOUL.md uses 4-anchor system from lesson-delivery.md)

**Files that reference the new systems:**
- openclaw/SOUL.md → references lesson-delivery.md for chunking and anchors
- skills/tutor/SKILL.md → references lesson-delivery.md for anchor system (2 locations: Tone & Style, Formatting)
- workspace/AGENTS.md → references lesson-delivery.md for chunking and anchors, references openclaw/SOUL.md for Telegram HTML

**Integration risks:** None. Changes are alignment updates and platform-specific additions. No breaking changes to existing skill functionality.

## Next Steps

1. Phase 1 complete (both Plan 01-01 and Plan 01-02 done)
2. Verifier can validate consistency across all updated files
3. Manual testing can validate that Telegram HTML formatting renders correctly (per 01-UI-SPEC.md validation checklist)
4. Phase 2 can begin work on interactive exercises using the aligned emoji anchor system

---

**Duration:** 150 seconds (2 minutes 30 seconds)
**Tasks:** 2/2 completed
**Commits:** 2 (d55f744, 77ee402)
**Files Modified:** 3 (openclaw/SOUL.md, skills/tutor/SKILL.md, workspace/AGENTS.md)
