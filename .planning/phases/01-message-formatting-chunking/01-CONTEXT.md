# Phase 1: Message Formatting & Chunking - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Make lessons readable on mobile Telegram by chunking long prose into multiple short messages with emoji anchors and HTML formatting. Deliverables are skill file updates (no code). Must not break other platform integrations.

</domain>

<decisions>
## Implementation Decisions

### Chunking Strategy
- **D-01:** Split lessons by pedagogical section — each section (concept, example, exercise) becomes its own message. Not by word count or fixed template.
- **D-02:** Soft cap at 150 words per message — agent aims for ~150 words but can exceed slightly if splitting mid-thought would hurt clarity.
- **D-03:** Minimum 2 messages per lesson — ensures every lesson feels multi-message, never a wall of text. Even simple formats like "just a question" get at least 2 messages.

### Emoji Anchor System
- **D-04:** 4 emoji anchors, simplified from the 6 in openclaw/SOUL.md:
  - 📖 Title/progress (replaces 📌)
  - 🧠 Core concept (kept)
  - 💡 Example (replaces 🔬)
  - ✏️ Exercise (kept)
- **D-05:** Anchors defined in universal references (lesson-delivery.md), not Telegram-specific. All platforms inherit the same visual language.

### Message Sequence
- **D-06:** Per-format chunking patterns — each of the 5 format variations (mini-lesson, question, resource drop, teach-back, challenge) gets its own message sequence template. Not one universal sequence.
- **D-07:** Mini-lesson sequence (most common format): 📖 Hook → 🧠 Concept → 💡 Example → ✏️ Exercise (4 messages). Hook includes title + progress + callback to previous lesson.
- **D-08:** Every lesson's final message ends with an engagement prompt — exercise, question, or teaser for tomorrow. Keeps the conversation loop open.

### Claude's Discretion
- Overflow handling: When a section exceeds the soft cap, Claude decides whether to split at paragraph boundary or condense. No strict rule.
- Sequence templates for non-mini-lesson formats (question, resource drop, teach-back, challenge): Claude designs appropriate 2-3 message sequences during planning/implementation, following the per-format pattern principle.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Formatting & Delivery
- `skills/tutor/references/lesson-delivery.md` — Current formatting rules and 5 format variations. Primary file to update with chunking rules and emoji anchors.
- `openclaw/SOUL.md` — Current OpenClaw-specific formatting with 6 emoji anchors (to be updated to match new 4-anchor set). Contains inline button and poll patterns.
- `workspace/SOUL.md` — Base teaching personality. Currently has no formatting specifics.

### Pedagogy
- `skills/tutor/references/teaching-method.md` — Deliberate practice, level adaptation. Context for how chunking interacts with difficulty adjustment.
- `skills/tutor/references/curriculum-format.md` — JSON schemas for curriculum and progress. Relevant for how lesson metadata maps to message structure.

### Project
- `.planning/REQUIREMENTS.md` — FMT-01 (chunking), FMT-02 (HTML formatting), FMT-03 (emoji anchors) are the requirements for this phase.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `openclaw/SOUL.md` — Already has structured card format with emoji anchors, inline buttons, and poll patterns. Needs updating to match new 4-anchor set but the overall structure is reusable.
- `skills/tutor/references/lesson-delivery.md` — Has 5 format variations and a Formatting section. Good scaffold to extend with chunking rules.

### Established Patterns
- Workspace inheritance: `workspace/SOUL.md` is base, `openclaw/SOUL.md` is override. Universal rules go in references, platform-specific in platform folders.
- No tables in messages (per lesson-delivery.md). Bullet lists preferred.
- Markdown used for formatting (`**bold**`, `_italic_`, `` `code` ``). HTML formatting (FMT-02) will need to specify Telegram HTML subset alongside existing Markdown guidance.

### Integration Points
- `skills/tutor/SKILL.md` — May need to reference new chunking rules. Currently doesn't mention message formatting.
- `workspace/AGENTS.md` — Agent boot instructions. May need awareness of chunking behavior for session flow.
- `openclaw/SOUL.md` — Must be updated to align with new anchor set and reference universal chunking rules.

</code_context>

<specifics>
## Specific Ideas

- Mini-lesson preview the user approved:
  ```
  Msg 1: 📖 Day 5/34 · Eigenvalues — Yesterday we saw how matrices transform space. Today: what stays fixed?
  Msg 2: 🧠 An eigenvalue λ tells you how much an eigenvector gets stretched...
  Msg 3: 💡 Think of a door hinge. When you push the door, every point moves except the hinge. The hinge is an eigenvector with λ=1.
  Msg 4: ✏️ Matrix A = [[2,1],[0,3]] — What are its eigenvalues? Reply with your answer.
  ```
- Contradictions to resolve: `lesson-delivery.md` says "emoji sparingly — one or two per message" but the new system uses one anchor per message consistently. The update should replace the "sparingly" guidance with the structured anchor system.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-message-formatting-chunking*
*Context gathered: 2026-04-09*
