# Lesson Delivery

## Core Model: Socratic Conversation with Deliberate Practice

Every lesson is a **multi-turn conversation**, not a content dump. The student thinks and answers at every step. The tutor adapts based on what the student says.

### Lesson Flow

```
1. RETRIEVAL CHECK (30s) — prior concept from SM-2 scheduler
   "Before we start — what's [concept] and why does it matter?"
   → Student answers → brief feedback → SM-2 record updated

2. GOAL + DIAGNOSTIC — new concept
   "Today's goal: [testable statement]. Here's a question: [open-ended]"
   → Student answers → tutor assesses what they know

3. FOLLOW-UP with INTERLEAVING
   Socratic question connecting new concept to a prior concept from a different module
   → Student answers → tutor deepens understanding

4. APPLICATION + SELF-EXPLANATION
   "Apply this to [real scenario]. Then explain in your own words WHY it works."
   → Student answers → specific feedback

5. SELF-ASSESSMENT
   "How confident do you feel about [goal]? 1-5"
   → Feeds back into student model
```

### Key Principles

- **Student types more than the tutor.** Every tutor message ends with a question (except the final feedback).
- **Tutor messages are SHORT** — 2-4 sentences, never a wall of text. This is Telegram, not a textbook.
- **Free-text answers** — open-ended questions, not multiple choice. Production tests beat recognition tests.
- **Adapt to the answer** — don't ignore what the student said. Reference it specifically.
- **Refutative feedback** — when the student's answer matches a known misconception, name it: "A lot of people think X because Y. But the key insight is Z."

## Adaptive Lesson Length

Not every interaction is a full lesson. The mode adapts based on student state, time of day, and mid-lesson performance.

| Mode | Trigger | Steps | Duration |
|---|---|---|---|
| **Quick** | High accuracy, scheduled midday push, student says "just a quick one" | Retrieval + 1 question | ~1 min |
| **Standard** | Normal /next, morning scheduled push | All 5 steps | ~3-5 min |
| **Deep** | Student struggling, asks "go deeper", low confidence self-report | Extra scaffolding, more examples, teach-back | ~8-10 min |

### Mid-Lesson Branching

The mode can shift during the lesson:
- Student nails diagnostic → skip follow-up, go straight to application (shorten)
- Student is confused → add scaffolding step before follow-up (lengthen)
- Student says "wait, explain that differently" → branch into deeper explanation
- Student says "I get it, move on" → skip to application (respect autonomy)

## Deliberate Practice Enforcement

The DeliberatePractitioner agent evaluates teaching after each lesson and writes enforceable directives to `practice-feedback.md`:

| Directive | When Issued | What Happens |
|---|---|---|
| **BLOCK** | Shaky concept untested for 5+ lessons | Lesson replaced with concept review — student can't advance |
| **BUMP** | Accuracy > 80%, student coasting | Difficulty increased for next lesson |
| **DROP** | Accuracy < 30%, frustration zone | Difficulty decreased, more scaffolding |
| **VARY** | Same format 4+ times in a row | Force different lesson format (teach-back, real-world, etc.) |
| **REVISIT** | Shaky concept untested for 3+ lessons | Concept woven into next lesson's retrieval or follow-up |
| **GOAL** | Every lesson (standard) | Explicit goal at start, self-assessment at end |

Directives are parsed and enforced in code, not just hinted to the LLM.

## Spaced Repetition Integration

Spaced repetition is woven INTO the lesson flow, not a separate flashcard system:

- **Retrieval check**: SM-2 scheduler picks the most overdue concept for the retrieval step
- **REVISIT directives** take priority over SM-2 scheduling
- **After retrieval**: student's answer quality (easy/hard/wrong) feeds back to SM-2 to update the review interval
- **Interleaving**: follow-up questions connect to concepts from different modules, providing natural spaced retrieval

The separate `/review` command still exists for focused review sessions, but primary spaced repetition happens inside every lesson automatically.

## Scheduled Delivery (Differentiated Pushes)

Three daily pushes, each with a different purpose:

| Time | Type | Duration | Purpose |
|---|---|---|---|
| **Morning (9am)** | Standard lesson | 3-5 min | Fresh brain, best for new concepts |
| **Midday (1pm)** | Retrieval check | 30 sec | Quick recall of a prior concept (spaced repetition) |
| **Evening (7pm)** | Curiosity preview | 30 sec | One hook for tomorrow's topic ("Tomorrow we'll explore why...") |

## Student Autonomy

After each lesson, offer a choice (satisfies self-determination theory):
- "Want to go deeper on this, or move to the next topic?"
- "Pick your next exercise: explain it back to me, or try a real-world challenge?"

The student should feel in control of their learning, not on a conveyor belt.

## Format Variations

Rotate delivery formats to maintain engagement and create desirable difficulty:

- **Socratic dialogue** (default) — question → answer → teach → question → apply
- **Teach-back** — student explains a concept in their own words
- **Real-world challenge** — practical scenario requiring application
- **Resource exploration** — curated video/article + reflection question
- **Prediction** — student predicts what happens next, then sees the answer
- **Connection** — "How does X relate to Y?" (cross-module linking)

The DeliberatePractitioner's VARY directive forces format changes when delivery becomes monotonous.

## Feedback Rules

- **On correct answers**: elaborate, don't just confirm. "Yes — and here's the deeper insight: [elaboration]."
- **On incorrect answers**: use refutative feedback. "The reason you probably thought X is because Y. But actually Z."
- **On "I don't know"**: no shame. "No worries — here's the quick version: [1 sentence]."
- **On partial answers**: acknowledge what's right first, then build. "You've got the first half — [what's right]. The part that's tricky is [what's missing]."
- **Keep feedback engaging for struggling students**: shorter, more concrete, with an immediate "try this" follow-up. Long elaborations get ignored by the students who need them most.

## Review Days

Every 5-7 lessons, insert a review:

- Quick recap of key concepts from the past week
- 3-5 questions mixing recent and older material (interleaved)
- Identify weak spots → feed into DeliberatePractitioner
- Keep it light — "pop quiz, don't panic"

## Progress Visualization

When the student asks for progress (`/progress`), show:

- Topic name and day count: "Linear Algebra — Day 6/20"
- Progress bar: `▓▓▓▓▓▓░░░░░░░░░░░░░░ 30%`
- Accuracy trend: last 5 exercises
- Weak spots: concepts flagged for revisit
- Confidence calibration: self-assessed vs actual accuracy

## Formatting

Lessons are delivered via messaging channels. Keep formatting readable:

- **Scannable** — bullets and short paragraphs, no walls of text
- **Bold** for key terms and definitions
- _Italic_ for emphasis
- `code` for math, formulas, inline code
- **No tables** — use bullet lists (tables render poorly on mobile)
- **No headers** — use **bold** as section markers
- Each message focused on one exchange — ask, wait, respond, ask
