# Architecture Patterns: Telegram Bot UX Improvements

**Domain:** AI tutor delivered via Telegram
**Researched:** 2026-04-09

## Executive Summary

OpenTutor UX improvements flow through three distinct architectural layers: **skill instructions** (SKILL.md, SOUL.md), **gateway configuration** (openclaw.json), and **gateway code** (Telegram channel implementation). The majority of UX improvements can be achieved through skill instruction changes alone, with minimal configuration updates and no code changes required.

The architecture creates a **clear separation of concerns**:
- **Skill layer** controls content, tone, formatting, and message structure
- **Gateway configuration** enables/disables capabilities (buttons, polls) and sets limits (chunk size, media)
- **Gateway code** handles protocol translation (Markdown → Telegram HTML, action JSON → Bot API calls)

This separation means most Telegram UX improvements are **instruction-driven, not code-driven**.

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Student (Telegram Client)                                        │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 │ Text / Button Clicks / Poll Votes
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Telegram Bot API                                                 │
│ • Inline keyboards (buttons with callback_data)                 │
│ • Polls (quiz or regular, multiple choice)                      │
│ • HTML formatting (bold, italic, code, links)                   │
│ • Media (images, videos, voice notes)                           │
│ • Message limits (4096 chars, auto-chunking)                    │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Long-poll updates / sendMessage calls
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ OpenClaw Gateway (Telegram Channel)                             │
│                                                                  │
│ 1. Inbound Processing:                                          │
│    • Callback clicks → plain text "callback_data: <value>"      │
│    • Poll answers → structured update                           │
│    • Text messages → normalized format                          │
│                                                                  │
│ 2. Outbound Processing:                                         │
│    • Markdown → Telegram-safe HTML (escape, retry as plain)    │
│    • Auto-chunking at 4000 chars (prefer newline boundaries)    │
│    • Action JSON → Bot API calls                                │
│                                                                  │
│ 3. Configuration:                                                │
│    • channels.telegram.capabilities.inlineButtons               │
│    • channels.telegram.chunkMode: "newline"                     │
│    • channels.telegram.mediaMaxMb: 100                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Normalized message → LLM call → Response
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Agent Session (tutor agent)                                     │
│                                                                  │
│ 1. Skill Loading:                                               │
│    • SKILL.md (teaching methodology)                            │
│    • SOUL.md (personality, formatting, interaction patterns)    │
│    • AGENTS.md (boot sequence, memory, guardrails)              │
│                                                                  │
│ 2. Context Loading:                                             │
│    • USER.md (student profile)                                  │
│    • tutor/progress.json (current state)                        │
│    • memory/ files (session history)                            │
│                                                                  │
│ 3. Response Generation:                                         │
│    • Follow SKILL.md pedagogy                                   │
│    • Apply SOUL.md formatting rules                             │
│    • Generate action JSON if interactive elements needed        │
└─────────────────────────────────────────────────────────────────┘
```

## Component Boundaries

| Component | Responsibility | Can Control | Cannot Control |
|-----------|---------------|-------------|----------------|
| **SKILL.md** | Teaching methodology, lesson structure, pedagogy | What to teach, when to quiz, how to assess, source citations | Button colors, Telegram API limits, message delivery |
| **SOUL.md** | Tone, formatting, interaction patterns | Message chunking strategy, emoji use, when to use buttons/polls, HTML structure | Telegram HTML parser behavior, chunk size limits |
| **AGENTS.md** | Boot sequence, memory management, safety | Session initialization, file reads, identity guardrails | Skill content, formatting rules |
| **openclaw.json** | Gateway capabilities, limits, routing | Enable/disable buttons, chunk size, media limits, agent binding | How agent generates responses, Telegram API behavior |
| **Gateway code** | Protocol translation, error handling | Markdown→HTML conversion, action JSON→Bot API, retry logic | Message content, when to send buttons |

## Data Flow

### Outbound (Agent → Student)

```
1. Agent generates response following SKILL.md + SOUL.md instructions
2. Agent optionally includes action JSON for interactive elements:
   {
     action: "send",
     message: "Choose an option:",
     buttons: [[{text: "A", callback_data: "option_a"}]]
   }
3. Gateway processes response:
   a. Convert Markdown to Telegram-safe HTML (escape, validate)
   b. Chunk at 4000 chars (prefer newline boundaries if chunkMode: "newline")
   c. Parse action JSON, build InlineKeyboardMarkup if buttons present
   d. Retry as plain text if HTML parse fails
4. Gateway sends to Telegram Bot API (sendMessage, sendPoll, etc.)
5. Student sees formatted message with buttons/polls in Telegram client
```

### Inbound (Student → Agent)

```
1. Student taps button / sends text / answers poll
2. Telegram Bot API sends update to gateway
3. Gateway normalizes:
   • Button click → plain text "callback_data: option_a"
   • Poll vote → structured update (gateway extracts choice)
   • Text → unchanged
4. Gateway routes to agent session
5. Agent sees normalized input, responds accordingly
```

## Skill-Layer Control (No Code Changes)

### ✅ What Can Be Changed in SKILL.md / SOUL.md

| UX Improvement | Implementation | File | Example |
|----------------|----------------|------|---------|
| **Message chunking** | Instruct agent to send multiple short messages instead of one long one | SOUL.md | "Send multiple short messages instead of one big one. Think chat, not essay. Each message should be a few lines max." |
| **Emoji use** | Guide frequency and placement of emoji | SOUL.md | "Use emoji sparingly (1-2 per message) as visual anchors" |
| **HTML formatting** | Control use of bold, italic, code blocks, links | SOUL.md | "📌 Title + progress bar, 🧠 Core concept, ⚡ Key distinction" |
| **Lesson structure** | Define sections, headers, flow | SKILL.md | "Lesson Flow: 1. ~3-5 minute read, 2. Build on yesterday, 3. Concrete example, 4. End with engagement" |
| **Button generation** | When to send buttons and what options to include | SOUL.md | "After key concepts or exercises, add quick-response buttons like '✅ Got it' / '❓ Confused'" |
| **Quiz format** | Multiple choice vs open-ended, how to present options | SOUL.md | "Interactive quizzes: Use poll-style buttons for quiz questions instead of just text" |
| **Exercise interaction** | How to prompt student responses, what feedback to give | SKILL.md | "End with engagement: question, exercise, or teaser" |
| **Progress indicators** | When and how to show progress | SOUL.md | "Show visual progress indicator (e.g. '📊 Day 5/34 — 15% complete') periodically" |
| **Tone & voice** | Formality, humor, directness | SOUL.md | "Be playful. Crack jokes, be witty, use text faces like :) and ;) — keep things light and fun" |
| **Reference formatting** | How to cite sources, when to include links | SKILL.md, AGENTS.md | "📚 References (inline hyperlinks, not buttons)" |

### How to Implement: Action JSON in Skill Instructions

The gateway recognizes **action JSON** in agent responses. SOUL.md should instruct the agent how to generate this:

**Example instruction in SOUL.md:**

```markdown
## Interactive Elements

When you want to add buttons after a message:

{
  action: "send",
  message: "Your message text here (supports <b>HTML</b> formatting)",
  buttons: [
    [
      { text: "Option A", callback_data: "choice_a" },
      { text: "Option B", callback_data: "choice_b" }
    ],
    [{ text: "Skip", callback_data: "skip" }]
  ]
}

Each nested array is a row of buttons. Max 8 buttons per row, 100 total.
When student clicks, you'll receive "callback_data: choice_a" as plain text.

For polls:

{
  action: "poll",
  question: "What is 2+2?",
  options: ["3", "4", "5"],
  correct_option_index: 1,
  explanation: "2+2=4 is basic arithmetic"
}
```

**Confidence:** HIGH — This pattern is documented in [OpenClaw Telegram docs](https://github.com/openclaw/openclaw/blob/main/docs/channels/telegram.md) and confirmed by search results showing the action JSON format.

## Configuration-Layer Control (openclaw.json)

### ⚙️ What Requires Configuration Changes (No Code)

| Capability | Config Key | Options | Impact |
|-----------|------------|---------|--------|
| **Enable/disable buttons** | `channels.telegram.capabilities.inlineButtons` | `"off"`, `"dm"`, `"group"`, `"all"`, `"allowlist"` | Controls where buttons appear |
| **Chunk size** | `channels.telegram.chunkSize` | Number (default: 4000) | Maximum characters before splitting |
| **Chunk mode** | `channels.telegram.chunkMode` | `"newline"`, `"hard"` | Prefer paragraph boundaries vs exact length |
| **Media size limit** | `channels.telegram.mediaMaxMb` | Number (default: 100) | Max size for inbound/outbound media |
| **Link previews** | `channels.telegram.linkPreview` | Boolean (default: true) | Show/hide URL previews |

**Example openclaw.json:**

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_TOKEN",
      "capabilities": {
        "inlineButtons": "all"
      },
      "chunkMode": "newline",
      "chunkSize": 3000,
      "linkPreview": false
    }
  }
}
```

**Confidence:** HIGH — Config schema confirmed in [OpenClaw Telegram docs](https://docs.openclaw.ai/channels/telegram) and [complete guide](https://pub.towardsai.net/openclaw-complete-guide-setup-tutorial-2026-14dd1ae6d1c2).

## Code-Layer Control (Requires Development)

### 🔧 What Requires Code Changes

These capabilities exist in Telegram Bot API but are **not yet implemented** in OpenClaw or would require **custom handlers**:

| Feature | Why Code Needed | Complexity |
|---------|-----------------|------------|
| **Custom button colors/styles** | Bot API 9.4 added `style` and `icon_custom_emoji_id` fields — gateway must pass these through | LOW — add field mapping |
| **Multi-select inline keyboards** | Gateway must handle multiselection state and callback updates | MEDIUM — state tracking |
| **Live quiz scoring** | Real-time feedback requires callback handler that updates original message | MEDIUM — message editing logic |
| **Progress bar visualization** | Could use Unicode block chars in text (no code), or custom image generation (code) | LOW (text) / HIGH (image) |
| **Spaced repetition scheduler** | Cron job templates exist, but smart scheduling needs algorithm | HIGH — new subsystem |
| **Thread/topic routing** | Gateway supports forum topics, but auto-routing per-curriculum needs logic | MEDIUM — routing rules |

**Confidence:** MEDIUM — These are extrapolated from Telegram Bot API capabilities. The gateway's current implementation scope was verified from docs, but未tested features may have partial support.

## UX Improvement Implementation Matrix

| Improvement | Skill Files | Config | Code | Build Order Priority |
|-------------|-------------|--------|------|---------------------|
| **Shorter messages (chunking)** | ✅ | — | — | **1** (instructions only) |
| **Emoji anchors** | ✅ | — | — | **1** |
| **Lesson structure (sections)** | ✅ | — | — | **1** |
| **HTML formatting (bold, code)** | ✅ | — | — | **1** |
| **Button-based navigation** | ✅ | ✅ | — | **2** (enable capability) |
| **Multiple-choice quizzes (buttons)** | ✅ | ✅ | — | **2** |
| **Poll-based quizzes** | ✅ | — | — | **2** (action JSON) |
| **Progress indicators (text)** | ✅ | — | — | **1** |
| **Inline hyperlinks** | ✅ | — | — | **1** |
| **Slash commands (/next, /quiz)** | ✅ | — | — | **1** (gateway routes /commands to agent) |
| **Custom button colors** | — | — | ✅ | **4** (low value-to-effort) |
| **Multi-select keyboards** | — | — | ✅ | **4** |
| **Live quiz scoring** | ✅ | — | ✅ | **3** (callback handler) |
| **Adaptive chunking** | ✅ | ✅ | — | **2** (chunkMode: newline) |

## Patterns to Follow

### Pattern 1: Instruction-Driven Formatting

**What:** Use natural language instructions in SOUL.md to guide the agent's output format
**When:** Changing message structure, tone, emoji use, sectioning
**Why:** The LLM can follow complex formatting rules without code changes

**Example:**

```markdown
## Lesson Delivery (in SOUL.md)

- **Structured cards.** Each lesson should be organized in mini-sections with emoji anchors:
  - 📌 Title + progress bar
  - 🧠 Core concept (2-3 sentences, <b>bold</b> key terms)
  - 🔬 Example (concrete illustration)
  - ✏️ Exercise — open-ended or multichoice

- **Short messages.** Send multiple short messages instead of one big one.
  Each message should be a few lines max. Use <code>code blocks</code> for formulas.

- **Inline buttons.** After exercises, add quick-response buttons:
  {
    action: "send",
    message: "...",
    buttons: [[{text: "✅ Got it", callback_data: "got_it"}]]
  }
```

**Outcome:** Agent generates properly formatted, chunked messages with buttons — no code changes.

### Pattern 2: Callback-Driven Interaction

**What:** Use callback_data to route student interactions back to the agent
**When:** Building navigation (next lesson, quiz, skip), exercise feedback, preferences
**Why:** Simpler than custom command parsing, works with existing gateway

**Example flow:**

```
1. Agent sends lesson with buttons:
   {
     action: "send",
     message: "Great! Ready for the next concept?",
     buttons: [[
       {text: "✅ Continue", callback_data: "next_lesson"},
       {text: "🔁 Review", callback_data: "review"}
     ]]
   }

2. Student taps "✅ Continue"

3. Gateway normalizes to plain text: "callback_data: next_lesson"

4. Agent sees "callback_data: next_lesson" and responds accordingly:
   - Read progress.json
   - Load next lesson from curriculum
   - Send lesson content
```

**Outcome:** Interactive navigation without custom /command parsing.

### Pattern 3: Progressive Enhancement

**What:** Start with text-only fallbacks, layer in interactive elements
**When:** Building new UX features where Telegram capabilities may not be enabled
**Why:** Ensures baseline experience works everywhere, buttons/polls are enhancements

**Example:**

```markdown
## Exercise Delivery (in SOUL.md)

Deliver exercises in this format:

1. Present the question as text
2. If multiple-choice, list options in text (A, B, C, D)
3. Add inline buttons for each option (if buttons enabled)
4. If buttons disabled, student can reply with letter

Example:

**Question:** What is 2+2?

A) 3  
B) 4  
C) 5

[If buttons enabled, add:]
{
  action: "send",
  buttons: [[
    {text: "A", callback_data: "answer_A"},
    {text: "B", callback_data: "answer_B"},
    {text: "C", callback_data: "answer_C"}
  ]]
}

[Accept both button clicks and text replies "A", "B", "C"]
```

**Outcome:** Works with or without buttons enabled. Graceful degradation.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Hard-Coding Telegram-Specific Syntax in SKILL.md

**What goes wrong:** SKILL.md becomes platform-specific, breaks NanoClaw/NemoClaw compatibility
**Why it happens:** Mixing pedagogy (universal) with formatting (platform-specific)
**Instead:** Keep SKILL.md platform-agnostic, put Telegram formatting in SOUL.md override (openclaw/SOUL.md)

**Bad:**
```markdown
# In SKILL.md (universal)
End each lesson with:
{
  action: "send",
  buttons: [[{text: "Next", callback_data: "next"}]]
}
```

**Good:**
```markdown
# In SKILL.md (universal)
End each lesson with a clear prompt for student engagement (question, exercise, or teaser).

# In openclaw/SOUL.md (platform override)
End each lesson with inline buttons for navigation:
{
  action: "send",
  buttons: [[{text: "Next", callback_data: "next"}]]
}
```

### Anti-Pattern 2: Expecting Immediate Interactivity Without Enabling Capabilities

**What goes wrong:** Agent generates button JSON, but gateway strips it because `inlineButtons: "off"`
**Why it happens:** SOUL.md instructs buttons, but openclaw.json not configured
**Instead:** Document required config in setup guide, check capability before generating buttons

### Anti-Pattern 3: Monolithic Lessons (Walls of Text)

**What goes wrong:** Single 2000-character lesson gets auto-chunked mid-sentence, loses structure
**Why it happens:** Not leveraging gateway's newline-aware chunking
**Instead:** Instruct agent to send 3-4 short messages sequentially, use `chunkMode: "newline"`

**Bad:**
```markdown
📌 Lesson 5: Functions

A function is a reusable block of code that performs a specific task. Functions can take inputs called parameters and return outputs. In Python, you define a function using the def keyword followed by the function name and parentheses. Inside the parentheses, you can specify parameters. The function body is indented. Here's an example: [500 more words...]
```

**Good (chunked naturally):**
```markdown
Message 1:
📌 Lesson 5: Functions

A function is a reusable block of code. Think of it like a recipe — same steps, different ingredients each time.

Message 2:
In Python, you define functions with <code>def</code>:

<code>
def greet(name):
    return f"Hello, {name}!"
</code>

Message 3:
Try it: write a function that adds two numbers.

{
  action: "send",
  buttons: [[{text: "✅ Done", callback_data: "done"}, {text: "❓ Help", callback_data: "help"}]]
}
```

## Scalability Considerations

| Concern | At 1 student | At 100 students | At 10K students |
|---------|--------------|-----------------|-----------------|
| **Message throughput** | No issue — interactive sessions | Gateway handles async, no blocking | Rate limits (30 msgs/sec per bot) — need burst queue |
| **Curriculum storage** | Local files in workspace/ | Local files OK | Migrate to DB (SQLite → Postgres) |
| **Session state** | In-memory + .jsonl logs | In-memory OK, log rotation needed | Redis/distributed cache |
| **Button callback routing** | Direct to agent session | Direct OK | Need session affinity / sticky routing |
| **Cron job scheduling** | Single jobs.json file | Single file OK | Distribute jobs across instances |
| **Media caching** | No caching needed | Cache frequent images (diagrams) | CDN for static media |

**For this milestone (UX improvements):** 1-100 students is the target. Current architecture scales fine. No code changes needed for scalability.

## Build Order Implications

Based on the implementation matrix, suggested build order:

### Phase 1: Instruction-Only Improvements (No Config/Code)
**What:** Update SKILL.md + SOUL.md with formatting, chunking, emoji, structure
**Why:** Highest value-to-effort, immediate impact, no deployment risk
**Deliverables:**
- Updated SOUL.md with chunking, emoji, HTML formatting rules
- Updated SKILL.md with lesson structure, exercise patterns
- Testing guide (verify output in Telegram)

### Phase 2: Configuration + Button Enablement
**What:** Update openclaw.json, add button generation instructions to SOUL.md
**Why:** Unlocks interactive elements (buttons, polls) with instruction changes only
**Deliverables:**
- Config update (enable inlineButtons, set chunkMode: newline)
- SOUL.md instructions for action JSON (buttons, polls)
- Callback handling patterns (how agent responds to button clicks)
- Testing guide (verify buttons render, clicks route correctly)

### Phase 3: Advanced Interactions (Instruction + Light Code)
**What:** Live quiz scoring, multi-part exercises, adaptive difficulty
**Why:** Richer UX, but requires callback handlers or state tracking
**Deliverables:**
- Message editing logic (update quiz with score)
- State tracking (multi-step exercises)
- Advanced SOUL.md patterns

### Phase 4: Gateway Enhancements (Code-Heavy)
**What:** Custom button styles, multi-select keyboards, new Telegram features
**Why:** Nice-to-have, but low ROI compared to instruction improvements
**Deliverables:**
- Gateway patches (button style passthrough, multi-select handlers)
- Testing in Telegram client

## Sources

**Telegram Bot API:**
- [Telegram Bot API](https://core.telegram.org/bots/api) — Official API reference
- [Telegram Bot API Buttons](https://core.telegram.org/api/bots/buttons) — Inline keyboard spec
- [Telegram Bot API Changelog](https://core.telegram.org/bots/api-changelog) — Recent updates (button colors, custom emoji)

**OpenClaw Architecture:**
- [OpenClaw Gateway Architecture](https://docs.openclaw.ai/concepts/architecture) — Official docs
- [OpenClaw Telegram Channel Docs](https://github.com/openclaw/openclaw/blob/main/docs/channels/telegram.md) — Formatting, chunking, buttons
- [OpenClaw Complete Guide 2026](https://pub.towardsai.net/openclaw-complete-guide-setup-tutorial-2026-14dd1ae6d1c2) — Setup tutorial
- [OpenClaw Skills System](https://deepwiki.com/openclaw/openclaw/5.2-skills-system) — Skill discovery and injection

**Formatting Best Practices:**
- [telegramify-markdown](https://github.com/sudoskys/telegramify-markdown) — Markdown to MessageEntity conversion
- [Telegram Markdown Formatting](https://gramio.dev/formatting) — Text styling and entities
- [OpenClaw Telegram Setup](https://open-claw.online/docs/channel-telegram) — Integration guide

**Skill Development:**
- [How to Build Custom OpenClaw Skills](https://lumadock.com/tutorials/build-custom-openclaw-skills) — Tutorial
- [OpenClaw Skills Guide](https://docs.openclaw.ai/tools/skills) — Official skill reference
