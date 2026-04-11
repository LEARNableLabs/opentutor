# Phase 1: Message Formatting & Chunking - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-09
**Phase:** 01-message-formatting-chunking
**Areas discussed:** Chunking boundaries, Emoji anchor system, Message sequence shape

---

## Chunking Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| By pedagogical section | Each section becomes its own message. Natural breaks, varies 2-5 messages. | ✓ |
| By word count threshold | Hard split every ~150 words regardless of content. | |
| Fixed template | Every lesson exactly 3-4 messages with prescribed roles. | |

**User's choice:** By pedagogical section
**Notes:** Aligns with how openclaw/SOUL.md already structures "cards"

---

| Option | Description | Selected |
|--------|-------------|----------|
| Soft cap at 150 words | Aims for ~150 words, can exceed slightly if splitting hurts clarity. | ✓ |
| Hard cap at 150 words | Never exceed — force split if section runs long. | |
| No word cap | Trust sections to be naturally short. | |

**User's choice:** Soft cap at 150 words
**Notes:** Matches FMT-01 requirement

---

| Option | Description | Selected |
|--------|-------------|----------|
| Split at paragraph boundary | Break at nearest paragraph if section runs long. | |
| Condense the content | Rewrite to be shorter rather than splitting. | |
| You decide | Claude's discretion on overflow handling. | ✓ |

**User's choice:** You decide (Claude's discretion)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| At least 2 messages | Every lesson feels multi-message, never a wall of text. | ✓ |
| No minimum | Some formats could be a single message. | |
| At least 3 messages | Enforces FMT-01 "3-4 messages" as minimum. | |

**User's choice:** At least 2 messages
**Notes:** None

---

## Emoji Anchor System

| Option | Description | Selected |
|--------|-------------|----------|
| Keep all 6 from openclaw/SOUL.md | 📌📚🧠⚡🔬✏️ — current set. | |
| Simplify to 3-4 core anchors | Focus on essential ones. | ✓ |
| Expand with more anchors | Add review, teaser, resource anchors. | |

**User's choice:** Simplify to 3-4 core anchors

---

| Option | Description | Selected |
|--------|-------------|----------|
| 🧠 Core concept | Central to every lesson. | ✓ |
| 🔬 Example | Grounds abstract concepts. | |
| ✏️ Exercise | Signals "your turn." | ✓ |
| 📌 Title + progress | Orientation anchor. | |

**User's choice:** Initially selected 🧠 and ✏️ only. Then asked for different emoji for title and examples.
**Notes:** User wanted 4 anchors total but with different emoji for title (📖 instead of 📌) and example (💡 instead of 🔬).

---

| Option | Description | Selected |
|--------|-------------|----------|
| 🎯 Target | "Today's goal" | |
| 📖 Open book | "Lesson start" | ✓ |
| 📍 Pin | Close to original 📌 | |

**User's choice:** 📖 for title/progress

---

| Option | Description | Selected |
|--------|-------------|----------|
| 💡 Lightbulb | "Here's how it clicks" | ✓ |
| 🔍 Magnifying glass | "Let's look closer" | |
| ✨ Sparkles | Lighter, playful | |

**User's choice:** 💡 for examples

---

| Option | Description | Selected |
|--------|-------------|----------|
| Universal references | Put anchors in lesson-delivery.md for all platforms. | ✓ |
| Telegram-specific only | Keep in openclaw/SOUL.md. | |

**User's choice:** Universal references (lesson-delivery.md)
**Notes:** All platforms inherit the same visual language.

---

## Message Sequence Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Per-format patterns | Each format variation gets its own message sequence template. | ✓ |
| One universal sequence | All lessons follow same structure. | |
| You decide | Claude adapts per format, no templates. | |

**User's choice:** Per-format patterns
**Notes:** A "just a question" shouldn't be padded to 4 messages.

---

| Option | Description | Selected |
|--------|-------------|----------|
| 📖 Hook → 🧠 Concept → 💡 Example → ✏️ Exercise | 4 messages. Clean progression. | ✓ |
| 📖 Hook+Concept → 💡 Example → ✏️ Exercise | 3 messages. Denser first message. | |
| 📖 Title → 🧠 Concept+Example → ✏️ Exercise+Teaser | 3 messages. Grouped content. | |

**User's choice:** 📖 Hook → 🧠 Concept → 💡 Example → ✏️ Exercise (4 messages)
**Notes:** User reviewed preview mockup and confirmed the 4-message flow.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Always end with engagement | Every lesson's final message invites response. | ✓ |
| Exercise format only | Only mini-lessons and challenges end with prompts. | |
| You decide | Claude adapts closing to lesson type. | |

**User's choice:** Always end with engagement
**Notes:** Keeps conversation loop open.

## Claude's Discretion

- Overflow handling when a section exceeds the soft cap
- Designing sequence templates for non-mini-lesson formats (question, resource drop, teach-back, challenge)

## Deferred Ideas

None — discussion stayed within phase scope.
