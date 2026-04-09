# Technology Stack — Telegram Bot UX for OpenTutor

**Project:** OpenTutor — UX Improvements Milestone
**Research Date:** 2026-04-09
**Target Platform:** Telegram via OpenClaw gateway
**Bot API Version:** 9.6 (April 3, 2026)

## Executive Summary

OpenTutor already delivers lessons via Telegram through the OpenClaw gateway. This milestone improves the student-facing UX by leveraging Telegram Bot API's interactive features — inline keyboards, polls/quizzes, slash commands, and message formatting. The stack is **instruction-only** (no code this milestone) — updates go into SKILL.md and SOUL.md to guide the AI tutor on how to use these features. OpenClaw already provides the infrastructure; we're documenting the capability surface and best practices.

**Confidence:** HIGH — Official Telegram Bot API documentation verified, OpenClaw's Telegram integration confirmed, feature set is stable and well-documented.

---

## Recommended Stack

### Core Platform: Telegram Bot API 9.6

| Component | Version | Purpose | Why |
|-----------|---------|---------|-----|
| **Telegram Bot API** | 9.6 (2026-04-03) | Primary UX surface | Most feature-rich platform for educational bots — native quiz mode, inline keyboards, polls, bot commands, rich formatting |
| **OpenClaw Gateway** | 2026.2.6+ | Bot hosting + AI integration | Already configured — handles Telegram auth, sessions, workspace files, cron jobs. No additional deployment needed |
| **Claude Opus 4.6** | Current | Teaching agent | Already configured in OpenClaw agent settings |

**Why Telegram over alternatives:** Native poll/quiz support, inline keyboards for tap interactions, bot command menu, message reactions, supports both scheduled (cron) and interactive (chat) delivery. WhatsApp and Slack have limited interactive features in comparison.

**Why OpenClaw over raw Bot API:** OpenClaw abstracts session management, workspace file routing (SKILL.md, SOUL.md, USER.md, progress.json), and provides inline keyboard/poll features via instruction. No server code needed for this milestone.

---

## Interactive Features — Telegram Bot API

All features below are **instruction-based** — the tutor agent uses them by formatting messages with markup understood by OpenClaw's Telegram channel. No code changes required.

### 1. Inline Keyboards (PRIMARY)

**What:** Buttons appear below messages. Clicking sends `callback_data` back to the agent as a formatted message.

**OpenClaw Support:** CONFIRMED — `channels.telegram.actions.buttons: "all"` (default in setup guide). Modes: `off`, `dm`, `group`, `all`, `allowlist`.

**Capability:**
- Up to 100 buttons per message (hard limit)
- `callback_data` max 64 bytes per button
- Buttons arranged in rows (up to 8 buttons per row recommended for mobile)

**Best for:**
- Exercise navigation ("Next" / "Skip" / "I'm stuck")
- Quick feedback ("✅ Got it" / "❓ Confused" / "🔁 Explain differently")
- Multiple choice exercises (A/B/C/D buttons)
- Lesson pacing ("Continue" / "Pause here")

**Performance target:** Respond to callback queries within 300ms (OpenClaw handles this automatically if agent replies quickly). Acknowledge every button click immediately to avoid 15-second loading spinner.

**Confidence:** HIGH — Official Telegram Bot API, OpenClaw docs verified.

**Format example (instruction for agent):**
```
Use inline keyboard buttons after exercises:
- Button text should be short (1-4 words)
- callback_data should be semantic ("exercise_1_option_a", "next_lesson", "quiz_retry")
- Arrange buttons in rows: max 3 buttons per row for mobile UX
- Always acknowledge button clicks before proceeding
```

**Sources:**
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [OpenClaw Telegram Integration](https://docs.openclaw.ai/channels/telegram)
- [Inline Keyboard UX Guide](https://wyu-telegram.com/blogs/444/)

---

### 2. Native Polls & Quiz Mode (PRIMARY)

**What:** Telegram's `sendPoll` API creates interactive polls/quizzes with automatic answer tracking.

**OpenClaw Support:** CONFIRMED — `channels.telegram.actions.poll: enabled` (default). Flags: `--poll-anonymous`, `--poll-public`, `--poll-duration-seconds`.

**Capability (Bot API 9.6):**
- **Quiz mode** — `type: "quiz"`, `correct_option_ids` (multiple correct answers supported as of 9.6), `explanation` text (0-200 chars) shown after incorrect answer
- **Poll mode** — `type: "regular"`, optional features: `allows_multiple_answers`, `allows_revoting`, `shuffle_options`, `allow_adding_options`, `hide_results_until_closes`
- **Poll descriptions** — `description` field with text formatting (`description_parse_mode`, `description_entities`)
- **Max closure time** — 2,628,000 seconds (~30 days)
- **Persistent option IDs** — track which users voted for which options

**Best for:**
- Concept checks after lessons (quiz mode with explanation)
- Multi-part exercises (polls with multiple correct answers)
- Student preference polls ("Which topic next?")
- Anonymous feedback ("How hard was this lesson?" 1-5 scale)

**Why use over inline keyboards:** Native quiz mode automatically highlights correct/incorrect answers, shows explanations, tracks user votes. Reduces agent complexity for standard multiple-choice exercises.

**Confidence:** HIGH — Official Telegram Bot API verified, OpenClaw poll support confirmed.

**Format example (instruction for agent):**
```
For concept checks, use quiz mode:
- Question text: clear, specific
- 3-4 options (too many overwhelms on mobile)
- correct_option_ids: mark correct answer(s)
- explanation: 1-2 sentences explaining why (0-200 chars)
- is_anonymous: false (you need to track student progress)
```

**Sources:**
- [Telegram Bot API — sendPoll](https://core.telegram.org/bots/api)
- [Poll API Documentation](https://core.telegram.org/api/poll)
- [Bot API Changelog](https://core.telegram.org/bots/api-changelog)

---

### 3. Bot Commands (PRIMARY)

**What:** Slash commands (`/start`, `/next`, `/quiz`) appear in Telegram's command menu when user types `/`.

**OpenClaw Support:** Commands are delivered as regular messages with `/` prefix. Agent interprets them via skill instructions. No separate command handler needed.

**Capability:**
- Commands registered via `setMyCommands` API — shows autocomplete menu in Telegram
- **Command scopes:** Default (all chats), AllPrivateChats, AllGroupChats, Chat-specific, User-specific (BotCommandScope)
- **Language codes** — localized command lists per user's language
- **Command format:** `/keyword` (max 32 chars, lowercase letters/numbers/underscores recommended)
- **Descriptions:** Short help text shown in autocomplete menu

**Required global commands:**
- `/start` — begins interaction (standard for all Telegram bots)

**Best practices:**
- Be specific — `/nextlesson` not `/next` (ambiguous)
- Show command menu on first interaction (onboarding)
- Keep count low (5-8 commands) — cognitive load on mobile
- Use natural language as fallback ("next lesson" works even if `/next` not registered)

**Confidence:** HIGH — Official Telegram Bot API, standard across all bots.

**Recommended commands for OpenTutor:**
```
/start      — Start or resume tutoring
/next       — Deliver next lesson
/quiz       — Ad-hoc review quiz
/progress   — Show learning progress
/topics     — List active topics
/pause      — Pause daily lessons
/help       — Show available commands
```

**Format example (instruction for agent):**
```
Recognize these slash commands and route to appropriate skill action:
- /next → deliver next lesson from progress.json
- /quiz → generate ad-hoc quiz from recent material
- /progress → summarize current state from progress.json
- Also accept natural language equivalents ("next lesson", "quiz me")
```

**Sources:**
- [Telegram Bot Commands](https://core.telegram.org/api/bots/commands)
- [Bot Features — Commands](https://core.telegram.org/bots/features)
- [setMyCommands](https://gramio.dev/telegram/methods/setmycommands)

---

### 4. Message Formatting (PRIMARY)

**What:** Rich text formatting for lesson content — bold, italic, code, links, emoji.

**OpenClaw Support:** Agent formats messages using MarkdownV2 or HTML. OpenClaw's Telegram channel parses and sends with `parse_mode`.

**Capability:**
- **MarkdownV2** (recommended) — `*bold*`, `_italic_`, `__underline__`, `~strikethrough~`, `||spoiler||`, `[link](url)`, `` `code` ``, ` ```lang\nblock\n``` `
- **HTML mode** — `<b>`, `<i>`, `<u>`, `<s>`, `<spoiler>`, `<a href="">`, `<code>`, `<pre>`
- **Custom emoji** — `<tg-emoji emoji-id="...">emoji</tg-emoji>`
- **Entity nesting** — bold/italic/underline can nest, but `pre`/`code` cannot contain other entities
- **Blockquotes** — expandable/collapsible quote blocks

**Message length limits:**
- **4096 chars** per message (hard limit)
- **1024 chars** for media captions (bot API restriction)
- Telegram auto-splits at sentence boundaries if exceeded

**Best practices for educational content:**
- **Chunk messages** — 3-5 minute read = ~600-800 words = ~4000 chars. Split lessons into multiple messages (concept → example → exercise).
- **Bold for key terms** — helps scanning on mobile
- **Code blocks for formulas** — ` ```math\nE = mc^2\n``` `
- **Emoji sparingly** — 1-2 per message as visual anchors (📌 title, 🧠 concept, ⚡ detail, 🔬 example, ✏️ exercise)
- **Links inline** — `[source](url)` not bare URLs (cleaner on mobile)
- **No markdown tables** — Telegram doesn't render them well. Use bullet lists instead.

**Anti-pattern:** Sending 2000+ word lessons as a single message. Splits message at arbitrary points, bad mobile UX.

**Confidence:** HIGH — Official Telegram Bot API, MarkdownV2 is current standard.

**Format example (instruction for agent):**
```markdown
📌 **Lesson 5: Gradient Descent**  
📊 Day 5/34 — 15% complete

🧠 **Core concept**  
Gradient descent finds the steepest downhill direction.

⚡ **Key distinction**  
Batch vs stochastic — full dataset vs single sample.

🔬 **Example**  
```python
for epoch in range(100):
    grad = compute_gradient(loss)
    params -= learning_rate * grad
```

✏️ **Exercise**  
What happens if learning_rate is too large?
[A] Faster convergence  
[B] Oscillation or divergence  
[C] No effect

📚 [Stanford CS229 Notes](https://example.com)
```

**Sources:**
- [Telegram Styled Text Entities](https://core.telegram.org/api/entities)
- [Message Formatting Guide](https://gramio.dev/formatting)
- [Telegram Limits](https://limits.tginfo.me/en)

---

### 5. Message Reactions (SECONDARY)

**What:** Quick emoji reactions to messages (❤️, 👍, 👎, etc.). User taps emoji below message.

**Capability:**
- Reactions tracked via `MessageReactionUpdated` updates
- Agent can detect reactions and respond accordingly

**Best for:**
- Quick sentiment tracking ("How did you feel about this lesson?")
- Non-intrusive feedback ("👍 if you got it, ❓ if confused")

**Why secondary:** Requires tracking reaction updates. Inline keyboards more explicit for navigation. Reactions good for passive feedback collection.

**Confidence:** MEDIUM — Feature exists in Bot API, unclear if OpenClaw exposes reaction updates to agent. Needs verification in implementation phase.

**Sources:**
- [Telegram Bot API — MessageReactionUpdated](https://core.telegram.org/bots/api)

---

### 6. Deep Linking (SECONDARY)

**What:** Special `t.me/botname?start=PAYLOAD` links that pass parameters when user clicks `/start`.

**Capability:**
- Encode lesson ID, topic, or referral code in start parameter
- Useful for sharing specific lessons or resuming from web/email

**Best for:**
- "Resume lesson" links sent via email/cron
- Share specific exercises ("Try this problem: t.me/tutor_bot?start=exercise_42")

**Why secondary:** Current OpenTutor uses cron + workspace files for delivery. Deep linking useful for external integrations (email reminders, web dashboard) — not core to Telegram-only UX.

**Confidence:** HIGH — Standard Telegram Bot API feature.

**Sources:**
- [Telegram Bot Features — Deep Linking](https://core.telegram.org/bots/features)

---

## What NOT to Use

### Telegram Mini Apps (Web Apps)

**What:** Embedded web views inside Telegram (HTML/JS/CSS).

**Why avoid:**
- Requires separate web app deployment (outside OpenClaw)
- Breaks "instruction-only" constraint for this milestone
- Adds complexity — inline keyboards + polls cover 95% of interactive UX needs
- Mobile web views slower than native Telegram UI

**When to reconsider:** If OpenTutor adds interactive visualizations (charts, graphs, code playgrounds) that can't be represented as images. Not needed for text-based lessons and multiple-choice exercises.

**Confidence:** HIGH — Mini Apps require code deployment.

---

### Reply Keyboards (Custom Keyboards)

**What:** Replace user's keyboard with custom button grid. Buttons send text messages when tapped.

**Why avoid:**
- **Persistent** — clutters UI, doesn't auto-hide after interaction
- **Less flexible** — can't attach to specific messages (always visible at bottom)
- **Worse UX** — inline keyboards are context-aware, reply keyboards are global

**When inline keyboards are better:** Always, for this use case. Reply keyboards made sense before inline keyboards existed (pre-2015).

**Confidence:** HIGH — Inline keyboards are the modern standard.

**Sources:**
- [Telegram Bot Features — Keyboards](https://core.telegram.org/bots/features)

---

### Group Chat Features

**What:** Bot working in group chats (multiple students, admin commands, chat member selection).

**Why out of scope:**
- OpenTutor is 1:1 personalized tutoring (per USER.md, progress.json)
- Group features (admin scopes, chat member selection) add complexity
- Current cron jobs + workspace assume single student per agent instance

**When to reconsider:** If OpenTutor adds "study groups" or "peer review" features. Not this milestone.

**Confidence:** HIGH — PROJECT.md explicitly scopes to 1:1 tutoring.

---

## OpenClaw Capability Matrix

What OpenClaw already provides vs what needs documentation/instructions.

| Feature | OpenClaw Status | Action Required |
|---------|----------------|-----------------|
| **Inline Keyboards** | ✅ Supported — `channels.telegram.actions.buttons` config | Document button format in SOUL.md — when to use, button text patterns, callback_data naming |
| **Polls/Quizzes** | ✅ Supported — `channels.telegram.actions.poll` config | Document poll format in SOUL.md — quiz mode vs poll mode, when to use, explanation patterns |
| **Bot Commands** | ✅ Supported — commands delivered as messages with `/` prefix | Document command routing in SKILL.md — map `/next`, `/quiz`, `/progress` to skill actions |
| **Message Formatting** | ✅ Supported — agent formats with MarkdownV2/HTML | Document formatting patterns in SOUL.md — emoji usage, bold for key terms, chunking strategy |
| **Message Chunking** | ⚠️ Manual — agent must split messages >4096 chars | Add chunking guidance to SOUL.md — max ~800 words per message, split at concept boundaries |
| **Reactions** | ❓ Unknown — unclear if reaction updates exposed to agent | Research in implementation phase — not critical for v1 UX |
| **Command Registration** | ❌ Not automated — `setMyCommands` must be called manually | Create GitHub issue — document how to register commands (via OpenClaw CLI or Telegram BotFather) |
| **Deep Linking** | ✅ Supported — `start` parameter delivered in message | Low priority — useful for external integrations, not core UX |

**Confidence:** HIGH for green checks (OpenClaw docs verified), MEDIUM for unknowns.

**Sources:**
- [OpenClaw Telegram Channel Docs](https://docs.openclaw.ai/channels/telegram)
- [OpenClaw Telegram Setup Guide](https://telegram-group.com/en/blog/openclaw-claude-telegram-complete-integration-guide-2026/)

---

## Installation & Configuration

**No new dependencies.** OpenTutor already configured with OpenClaw + Telegram. This milestone updates instruction files only.

### Current Setup (per openclaw/README.md)

```bash
# OpenClaw gateway already installed and running
# Telegram bot already created via @BotFather
# Bot token configured in ~/.openclaw/openclaw.json
# Tutor agent bound to Telegram channel
# Cron jobs configured for daily lesson delivery
```

### Configuration Changes (this milestone)

None. All changes are instruction files:

```
~/.openclaw/skills/tutor/SKILL.md              # Update with command routing
~/.openclaw/workspaces/tutor/SOUL.md           # Update with UX patterns (buttons, polls, formatting, chunking)
```

### Optional: Command Registration

To show commands in Telegram's autocomplete menu, call `setMyCommands` via Telegram Bot API:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setMyCommands" \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "Start or resume tutoring"},
      {"command": "next", "description": "Deliver next lesson"},
      {"command": "quiz", "description": "Ad-hoc review quiz"},
      {"command": "progress", "description": "Show learning progress"},
      {"command": "topics", "description": "List active topics"},
      {"command": "pause", "description": "Pause daily lessons"},
      {"command": "help", "description": "Show available commands"}
    ]
  }'
```

**OR** use OpenClaw CLI (if available — check OpenClaw docs for current command).

**Confidence:** MEDIUM — setMyCommands is standard Bot API, unclear if OpenClaw exposes it via CLI. Fallback: manual curl.

---

## Best Practices — Educational Bot UX (2026)

Synthesized from research on Telegram bots for education.

### 1. Message Chunking Strategy

**Problem:** 4096 char limit + mobile screens = need smart chunking.

**Solution:**
- **One concept per message** — don't mix "core concept" and "example" in same message
- **~600-800 words max** per message (~3-5 min read)
- **Split at logical boundaries** — concept → example → exercise (3 messages)
- **Use emoji anchors** — 📌, 🧠, ⚡, 🔬, ✏️ signal message type
- **Send sequentially** — message 1 (concept), wait for "Got it" button, then message 2 (example)

**Anti-pattern:** 2000-word lesson in one message. Telegram auto-splits mid-sentence, confusing on mobile.

**Confidence:** HIGH — Telegram limits verified, chunking best practice from multiple sources.

**Sources:**
- [Telegram Limits](https://limits.tginfo.me/en)
- [Telegram Chatbots for Education](https://www.such.chat/blog/telegram-chatbots-for-education)

---

### 2. Button UX Patterns

**Problem:** Too many buttons = cognitive overload. Unclear button text = confusion.

**Solution:**
- **3 buttons max per row** on mobile (8 max but not recommended)
- **Short button text** — 1-4 words ("✅ Got it", "Next", "A", not "I understand this concept fully")
- **Semantic callback_data** — `exercise_1_option_a`, `next_lesson_topology`, `skip_to_quiz` (agent can parse intent)
- **Visual hierarchy** — primary action top-left, secondary bottom-right
- **Always acknowledge clicks** — respond within 300ms to avoid loading spinner

**Anti-pattern:** 10 buttons in a single row, or button text "Click here if you want to proceed to the next lesson".

**Confidence:** HIGH — UX research + Telegram performance benchmarks.

**Sources:**
- [Telegram Inline Keyboard UX Guide](https://wyu-telegram.com/blogs/444/)
- [Enhancing Multiselection Inline Keyboards](https://medium.com/@moraneus/enhancing-user-engagement-with-multiselection-inline-keyboards-in-telegram-bots-7cea9a371b8d)

---

### 3. Quiz Mode vs Inline Keyboards

**When to use quiz mode (sendPoll):**
- Standard multiple choice with 1-2 correct answers
- Need automatic answer highlighting (green for correct, red for incorrect)
- Want to show explanation text after answer
- Anonymous feedback polls

**When to use inline keyboards:**
- Custom navigation (Next/Skip/Pause)
- Multi-step exercises requiring state (select topic → select difficulty → start)
- Need callback data for routing (not just answer tracking)

**Hybrid approach:** Quiz for concept checks, inline keyboards for navigation.

**Confidence:** HIGH — Clear capability boundaries.

**Sources:**
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [How to create a quizbot in Telegram](https://www.quora.com/How-do-I-create-a-quizbot-in-Telegram)

---

### 4. Command Design

**Problem:** Users don't discover commands if not visible in menu.

**Solution:**
- **Register with setMyCommands** — shows autocomplete menu when user types `/`
- **Keep list short** — 5-8 commands max (cognitive load)
- **Natural language fallback** — "next lesson" works even if `/next` not registered
- **Show command menu on onboarding** — first message includes "Try `/next` to start your first lesson"

**Anti-pattern:** 20 commands, no registration (menu empty), no help text.

**Confidence:** HIGH — Standard Telegram bot UX pattern.

**Sources:**
- [Telegram Bot Commands](https://core.telegram.org/api/bots/commands)
- [Command Best Practices](https://core.telegram.org/bots/features)

---

### 5. Formatting for Readability

**Problem:** Plain text walls unreadable on mobile.

**Solution:**
- **Bold key terms** — `**gradient descent**` on first use
- **Emoji anchors** — 📌 title, 🧠 concept, ⚡ detail, 🔬 example, ✏️ exercise (visual scanning)
- **Code blocks** — ` ```python\n...\n``` ` for formulas and code
- **Short paragraphs** — 2-3 sentences max per paragraph
- **Inline links** — `[Stanford CS229](url)` not bare `https://...`
- **No tables** — bullet lists instead (Telegram table rendering poor)

**Anti-pattern:** 10-line paragraphs, no bold, bare URLs, markdown tables.

**Confidence:** HIGH — Telegram formatting capabilities + mobile UX research.

**Sources:**
- [Telegram Styled Text](https://core.telegram.org/api/entities)
- [Message Formatting Guide](https://gramio.dev/formatting)

---

### 6. Privacy & Personalization

**Problem:** Educational bots need student data (progress, weak spots) but must protect privacy.

**Solution:**
- **Local storage** — OpenClaw workspace files (USER.md, progress.json) stay on gateway, not cloud
- **Anonymous IDs** — Telegram user IDs are numeric (not names) — safe to log
- **No data sharing** — progress.json is per-student, not aggregated
- **is_anonymous: false** for quizzes — you need to track student progress

**Confidence:** MEDIUM — OpenClaw privacy model verified, but not exhaustively researched for this milestone.

**Sources:**
- [Telegram Chatbots for Education — Privacy](https://www.such.chat/blog/telegram-chatbots-for-education)

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Platform** | Telegram Bot API 9.6 | WhatsApp Cloud API | No quiz mode, no inline keyboards, limited formatting |
| **Platform** | Telegram Bot API 9.6 | Slack Bot API | No native quiz mode, inline buttons less flexible, less mobile-optimized |
| **Bot Framework** | OpenClaw Gateway | grammY (TypeScript) | Requires code deployment — out of scope for this milestone (instruction-only) |
| **Bot Framework** | OpenClaw Gateway | Telegraf (Node.js) | Requires code deployment — out of scope for this milestone |
| **Bot Framework** | OpenClaw Gateway | python-telegram-bot | Requires code deployment — out of scope for this milestone |
| **Keyboards** | Inline Keyboards | Reply Keyboards | Persistent clutter, less flexible, worse UX |
| **Quizzes** | Native Quiz Mode | Custom with Inline Keyboards | More work, less polished UX, no auto-highlighting |
| **Formatting** | MarkdownV2 | HTML | MarkdownV2 cleaner for agents to generate, both supported equally |
| **Deployment** | OpenClaw (instruction) | Custom server (code) | Out of scope — milestone is instruction files only |

**Why OpenClaw over custom code:** This milestone updates SKILL.md and SOUL.md to guide the AI on how to use existing Telegram features. Code implementation is a separate milestone. OpenClaw already handles all infrastructure.

**Why Telegram over Slack/WhatsApp:** Native quiz mode, inline keyboards, bot command menu, richer formatting, better mobile UX for education.

**Confidence:** HIGH — Platform comparison based on official API docs.

---

## Open Questions & Gaps

### 1. Message Reaction Support in OpenClaw

**Question:** Does OpenClaw expose `MessageReactionUpdated` events to the agent?

**Impact:** If yes, can track passive feedback ("👍 this lesson"). If no, rely on inline keyboards for all feedback.

**Resolution:** Test in implementation phase OR check OpenClaw source/docs for reaction event handling.

**Priority:** LOW — inline keyboards cover feedback needs.

---

### 2. Command Registration via OpenClaw CLI

**Question:** Can `setMyCommands` be called via OpenClaw CLI, or manual curl only?

**Impact:** If CLI exists, document it. If not, provide curl examples.

**Resolution:** Check OpenClaw CLI docs/source OR use curl as fallback.

**Priority:** MEDIUM — commands still work without registration (natural language fallback), but registration improves UX.

---

### 3. Poll Result Tracking

**Question:** How does OpenClaw deliver poll results (votes, correct/incorrect) to the agent?

**Impact:** Agent needs to update progress.json based on quiz performance.

**Resolution:** Test in implementation phase — send a quiz, check session logs for poll result events.

**Priority:** HIGH — critical for adaptive difficulty and spaced repetition.

---

### 4. Callback Query Formatting

**Question:** What format does OpenClaw use when delivering callback_data from inline keyboard buttons?

**Impact:** Agent must parse callback_data to route actions (e.g., "exercise_1_option_a" → check answer A for exercise 1).

**Resolution:** Check OpenClaw docs OR test by sending a button, checking session logs.

**Priority:** HIGH — critical for inline keyboard UX.

---

### 5. Multi-Message Transaction Support

**Question:** Can agent send 3 messages sequentially (concept → example → exercise) and wait for button click between them, or does session end after each agent message?

**Impact:** If session ends, need to design for "one interaction per turn". If session persists, can do multi-step flows.

**Resolution:** Check OpenClaw session model — does session stay open after agent sends message, or only open during request/response?

**Priority:** MEDIUM — affects chunking strategy (send all 3 messages at once vs wait for acknowledgment).

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| **Telegram Bot API Features** | HIGH | Official documentation (Bot API 9.6, April 2026), multiple sources verified |
| **OpenClaw Telegram Support** | HIGH | Official OpenClaw docs verified, inline keyboards + polls confirmed |
| **Bot UX Best Practices** | MEDIUM | Web search findings + official Telegram guides, but not exhaustively verified with primary research |
| **Command Registration** | MEDIUM | Standard Bot API feature, unclear if OpenClaw CLI exposes it |
| **Message Reaction Support** | LOW | Feature exists in Bot API, unknown if OpenClaw exposes to agent |
| **Performance Targets** | MEDIUM | Web search findings (300ms response, 64-byte callback_data), not verified in production |

**Overall Confidence:** HIGH for feature capabilities (what's possible), MEDIUM for implementation details (how OpenClaw exposes them).

---

## Sources

### Official Telegram Documentation
- [Telegram Bot API (v9.6)](https://core.telegram.org/bots/api)
- [Telegram Bot Features](https://core.telegram.org/bots/features)
- [Bot Commands](https://core.telegram.org/api/bots/commands)
- [Buttons](https://core.telegram.org/api/bots/buttons)
- [Polls](https://core.telegram.org/api/poll)
- [Styled Text Entities](https://core.telegram.org/api/entities)
- [Bot API Changelog](https://core.telegram.org/bots/api-changelog)
- [Telegram Limits](https://limits.tginfo.me/en)

### OpenClaw Documentation
- [OpenClaw Telegram Channel Docs](https://docs.openclaw.ai/channels/telegram)
- [OpenClaw Telegram Integration Guide (2026)](https://telegram-group.com/en/blog/openclaw-claude-telegram-complete-integration-guide-2026/)
- [OpenClaw Telegram Setup](https://www.aifreeapi.com/en/posts/openclaw-telegram-setup)

### Educational Bot Patterns
- [Telegram Chatbots for Education (2026)](https://www.such.chat/blog/telegram-chatbots-for-education)
- [Telegram Bot Use Cases in Teaching](https://medium.com/string/telegram-bot-use-cases-in-teaching-and-learning-c4dcedd1e5fa)
- [Developer's Guide to Building Telegram Bots (2025)](https://stellaray777.medium.com/a-developers-guide-to-building-telegram-bots-in-2025-dbc34cd22337)

### Technical Implementation
- [GramIO Formatting Guide](https://gramio.dev/formatting)
- [Telegram Inline Keyboard UX Guide](https://wyu-telegram.com/blogs/444/)
- [Enhancing Multiselection Inline Keyboards](https://medium.com/@moraneus/enhancing-user-engagement-with-multiselection-inline-keyboards-in-telegram-bots-7cea9a371b8d)
- [setMyCommands Documentation](https://gramio.dev/telegram/methods/setmycommands)

---

## Next Steps (for Roadmap)

Based on this research, roadmap phases should address:

1. **Phase 1: Message Formatting & Chunking**
   - Update SOUL.md with formatting patterns (bold, emoji anchors, code blocks)
   - Add chunking guidance (max 800 words per message, split at concept boundaries)
   - Why first: Foundation for all other UX improvements — readable messages before interactive elements

2. **Phase 2: Inline Keyboard Navigation**
   - Document button patterns in SOUL.md (when to use, button text, callback_data naming)
   - Add command routing to SKILL.md (map button callbacks to skill actions)
   - Why second: Most versatile interactive feature — works for navigation + quick feedback

3. **Phase 3: Slash Commands**
   - Document command routing in SKILL.md (/next, /quiz, /progress)
   - Create issue: Register commands via setMyCommands
   - Why third: Discoverability improvement — makes bot more professional

4. **Phase 4: Quiz Mode Integration**
   - Document quiz patterns in SOUL.md (when to use quiz vs inline keyboard, explanation format)
   - Test poll result delivery in OpenClaw
   - Why fourth: Builds on message formatting + inline keyboards, requires understanding of poll API

5. **Phase 5: Progress Visualization**
   - Document progress tracking patterns (weekly summaries, charts)
   - Explore if charts can be generated + sent as images
   - Why fifth: Requires all previous phases working (commands to trigger, formatting to display, polls/quizzes for data)

**Defer to future milestones:**
- Deep linking (useful for external integrations, not core Telegram UX)
- Message reactions (if OpenClaw supports it, nice-to-have for passive feedback)
- Group chat features (out of scope — 1:1 tutoring only)
- Web Apps / Mini Apps (requires code deployment)

**Research flags:**
- Phase 4 may need deeper research on poll result event handling in OpenClaw
- Phase 5 may need research on chart generation libraries (if not using static images)
