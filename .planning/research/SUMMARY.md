# Project Research Summary

**Project:** OpenTutor — Telegram Bot UX Improvements
**Domain:** AI-powered educational chatbot via Telegram
**Researched:** 2026-04-09
**Confidence:** HIGH

## Executive Summary

OpenTutor delivers personalized daily lessons via Telegram through the OpenClaw gateway. This milestone improves student-facing UX by leveraging Telegram Bot API's interactive features without writing code—all changes go into instruction files (SKILL.md, SOUL.md) that guide the AI tutor. The research reveals a clear path: OpenTutor can dramatically improve engagement by fixing the core mobile UX problem (walls of text kill learning on phones) and layering in Telegram's native interactive elements (inline keyboards, polls, commands).

The recommended approach is **instruction-driven UX improvements**. OpenClaw already provides infrastructure for buttons, polls, and rich formatting. The tutor agent just needs guidance on when and how to use them. This means Phase 1 improvements ship with zero code changes, only skill file updates. The architecture creates a clean separation: SKILL.md controls pedagogy (universal), SOUL.md controls formatting and interaction patterns (platform-specific), and openclaw.json enables capabilities. Most UX wins come from better instructions, not better code.

The biggest risk is **the depth-vs-brevity tension**. Educational chatbots need depth to teach effectively, but mobile messaging demands brevity to stay readable. Students have 6.8-second attention spans on mobile. A 3-minute lesson becomes overwhelming as a 1000-word block, but chunking into 3-4 short messages with buttons between them transforms the experience. The pitfall research is unambiguous: wall-of-text disease, notification fatigue, and one-way broadcast syndrome kill engagement faster than bad content. Fix message density first, layer in interactivity second, add polish third.

## Key Findings

### Recommended Stack

OpenTutor requires no new dependencies. The stack is instruction-only updates to existing infrastructure. Telegram Bot API 9.6 (April 2026) provides the richest platform for educational bots: native quiz mode, inline keyboards with callback buttons, slash commands with autocomplete, and full HTML formatting. OpenClaw Gateway (2026.2.6+) already handles all Telegram integration—session management, workspace file routing, poll/button support via instruction. Claude Opus 4.6 generates responses following skill file guidance.

**Core technologies:**
- **Telegram Bot API 9.6** — Primary UX surface. Native quiz mode, inline keyboards, polls, bot commands, rich formatting. Best platform for interactive education (WhatsApp and Slack lack quiz mode and have limited button flexibility).
- **OpenClaw Gateway** — Bot hosting + AI integration. Already configured and running. Abstracts Telegram protocol, exposes inline buttons and polls via action JSON in agent responses. Handles Markdown→HTML conversion, message chunking, callback routing.
- **Instruction files (SKILL.md, SOUL.md)** — Control all UX behavior. SKILL.md defines pedagogy (universal), SOUL.md defines formatting and interaction patterns (Telegram-specific override in openclaw/SOUL.md). No code deployment needed.

**Configuration changes only:**
- Enable inline buttons: `channels.telegram.capabilities.inlineButtons: "all"`
- Smart chunking: `channels.telegram.chunkMode: "newline"` (split at paragraph boundaries, not mid-sentence)
- Optional: Register slash commands via Telegram's `setMyCommands` API (shows command menu)

### Expected Features

The feature landscape separates table stakes (users expect these) from differentiators (competitive advantage) and anti-features (explicitly avoid).

**Must have (table stakes):**
- **Inline keyboards for exercises** — Clicking buttons for multiple choice is faster and clearer than typing. Standard for interactive learning bots.
- **Message chunking (2-5 min reads)** — Attention spans average 7.97 seconds (6.8 seconds for mobile users 18-34). Microlearning research shows 2-10 minute optimal duration. Break lessons into bite-sized chunks.
- **Immediate feedback** — Deliberate practice principle. Students expect instant response when they answer/attempt exercises.
- **Progress visibility** — Students need to see where they are, what's next, what they've completed. Table stakes for any learning app.
- **Slash command navigation** — Telegram users expect `/command` format. Typing `/next` is faster than menu hunting. Commands: `/start`, `/next`, `/quiz`, `/progress`, `/pause`, `/help`.
- **Mobile-optimized formatting** — 90%+ Telegram use is mobile. Must be scannable on 6" screens: bullets over paragraphs, bold key terms, code blocks for math/formulas, no tables.
- **Spaced repetition reminders** — Expected in serious learning bots. Revisiting weak spots is core to retention.
- **Clear exit/pause path** — Users hate being trapped. Must be able to pause daily lessons or skip without friction.
- **Single concept per lesson** — Cognitive load management. One core concept per session.

**Should have (competitive differentiators):**
- **Socratic questioning flow** — Guide with progressive questions instead of revealing answers. Proven to improve critical thinking 5x faster.
- **Adaptive difficulty** — Adjust next lesson based on performance. Stay in zone of proximal development automatically.
- **Rich resource drops** — Mix videos, code playgrounds, articles. "Watch this 10-min video, we'll discuss after."
- **Teach-it-back exercises** — "Explain X in your own words" (Feynman technique). Bot validates understanding depth vs surface parroting.
- **Mood-aware tone** — Detect frustration/excitement, adjust encouragement. Student stuck 3x → simpler analogy + encouragement.
- **Multi-select inline keyboards** — For "select all that apply" questions. More nuanced than single MCQ.
- **Weekly synthesis summaries** — Friday/Sunday recap connecting the week's dots.

**Defer (v2+ / anti-features):**
- **Leaderboards** — Turns learning into competition, demotivates slower learners. Use personal progress instead.
- **Streak pressure** — "Don't break your 30-day streak!" causes anxiety. Celebrate consistency without punishment.
- **Achievement badges** — Rewards completion over mastery. Students rush to collect badges instead of learning.
- **Live code execution** — Requires external sandbox service. High complexity, out of scope for v1 UX pass.
- **Voice note support** — Needs transcription + analysis. Medium complexity, defer until validated need.

### Architecture Approach

The architecture creates a clean separation of concerns across three layers: skill instructions (SKILL.md, SOUL.md), gateway configuration (openclaw.json), and gateway code (Telegram channel implementation). Most UX improvements are instruction-driven, not code-driven.

**Layer 1: Skill Instructions (Controls all UX)**
- SKILL.md defines pedagogy, lesson structure, teaching methodology (platform-agnostic)
- SOUL.md defines tone, formatting, interaction patterns (Telegram-specific via openclaw/SOUL.md override)
- AGENTS.md defines boot sequence, memory management, guardrails
- Changes here = zero code deployment, immediate impact

**Layer 2: Gateway Configuration (Enables capabilities)**
- openclaw.json controls which features are available (enable buttons, set chunk size, media limits)
- Configuration changes require gateway restart but no code changes

**Layer 3: Gateway Code (Handles protocol translation)**
- Markdown → Telegram HTML, action JSON → Bot API calls, callback routing
- Only touch this layer for new Telegram features not yet exposed in OpenClaw

**Data flow (Outbound: Agent → Student):**
1. Agent generates response following SKILL.md + SOUL.md instructions
2. Agent optionally includes action JSON for interactive elements (buttons, polls)
3. Gateway converts Markdown to Telegram-safe HTML, chunks at 4000 chars (prefer newline boundaries)
4. Gateway sends to Telegram Bot API (sendMessage, sendPoll, etc.)

**Data flow (Inbound: Student → Agent):**
1. Student taps button / sends text / answers poll
2. Telegram Bot API sends update to gateway
3. Gateway normalizes (button click → plain text "callback_data: option_a")
4. Gateway routes to agent session, agent responds

**Major components:**
1. **SKILL.md (pedagogy layer)** — Teaching methodology, lesson structure, exercise design. Platform-agnostic. Controls what to teach and when.
2. **SOUL.md (interaction layer)** — Formatting rules, emoji use, button generation patterns, message chunking strategy. Telegram-specific override in openclaw/SOUL.md.
3. **OpenClaw Gateway (protocol layer)** — Handles Telegram Bot API integration. Exposes inline keyboards and polls via action JSON. Routes callbacks to agent.
4. **Workspace files (state layer)** — USER.md (student profile), progress.json (current state), memory/ (session history). Persists between interactions.

**Key architectural insight:** OpenTutor's UX improvements don't require touching the protocol layer. All Phase 1-3 improvements are instruction updates and configuration flags. Code changes only needed for Phase 4+ (advanced features like multi-select keyboards, live quiz scoring).

### Critical Pitfalls

The pitfall research identifies 15 failure modes, 6 critical (cause dropout), 5 moderate (hurt engagement), 4 minor (friction). The top 5 are all mobile UX issues stemming from the depth-vs-brevity tension.

1. **Wall of Text Disease** — Long prose blocks (200+ words) in a single message become unreadable on mobile. Students scroll, lose context, skim instead of read, stop opening lessons. Attention span is 6.8 seconds for mobile users 18-34. Prevention: Max 150 words per message, chunk lessons into 3-4 messages (concept → example → exercise → teaser), use short paragraphs (2-3 sentences), bold key terms.

2. **Notification Fatigue / Nagging Tutor Syndrome** — Daily scheduled lessons feel like nagging if not matched to student readiness. Notifications pile up, students mute the bot, engagement dies. iOS/Android users have aggressive Focus modes and zero tolerance for unwanted notifications. Prevention: Granular notification controls (time, frequency, pause), adaptive pacing (pause after 2 unopened lessons), quiet hours (10pm-8am default), allow on-demand lesson pulling with `/next`.

3. **One-Way Broadcast Syndrome** — Lessons feel like newsletter, not conversation. Student receives content, maybe replies "ok," tutor sends next lesson. No real interaction. Passive reading has <30% retention vs 70%+ for active recall. Prevention: Mandatory interaction gates (don't deliver Lesson N+1 until student attempts Lesson N exercise), inline keyboards for exercises, immediate feedback in same session, pull + push hybrid.

4. **Mobile Typing Barrier for Deep Exercises** — Deliberate practice requires thoughtful answers, but typing on mobile feels like punishment. Students skip open-ended exercises, give minimal answers, or quit. Prevention: Inline keyboards for multiple choice, polls for quizzes, short structured responses ("3 bullet points" not "write a paragraph"), voice input option, hybrid approach (buttons for initial attempt, open-ended only if wrong).

5. **No Escape Routes When Stuck** — Student gets confused, chat loops with no exit. No way to say "just show me the answer" or "skip this, I'll come back." Silent dropout. Prevention: Always offer escape hatches in inline keyboards ("Show me the answer", "Skip this", "I need a different explanation"), fallback after 2-3 failed attempts, meta-help commands (`/stuck`, `/help`, `/reset`), re-engagement after silence (15+ min).

**Additional critical pitfalls:**
- **Context Loss in Chat Scrollback** — Chat interfaces terrible for retrieval. Student can't review concept from 3 days ago. Prevention: `/review <topic>` command, weekly summary messages, pin key concepts, searchable message format (start with "📘 Lesson 5: Topic").
- **Gamification Backfire** — Streaks/badges can focus on rewards instead of learning. Broken streak causes guilt → dropout. Prevention: Streak flexibility (pause/freeze days), progress over streaks, private by default, rewards tied to learning outcomes.

## Implications for Roadmap

Based on research, the recommended phase structure addresses UX in order of impact and dependency. Start with foundational readability (message density), layer in interactivity (buttons/commands), add intelligence (adaptive pacing), polish with advanced features.

### Phase 1: Message Formatting & Chunking
**Rationale:** Foundation for all other UX improvements. Readable messages are prerequisite for interactive elements. Wall of Text Disease is the #1 critical pitfall—students abandon after 2-3 lessons if messages are overwhelming. This phase has highest value-to-effort ratio (instruction changes only, zero code).

**Delivers:**
- Messages chunked to 150 words max (~1 mobile screen)
- Lessons split into 3-4 sequential messages (concept → example → exercise → teaser)
- Mobile-optimized formatting (bold key terms, short paragraphs, code blocks for formulas, emoji anchors)
- Scannable structure (bullets over prose, no markdown tables)

**Addresses features:**
- Message chunking (2-5 min reads) — table stakes
- Mobile-optimized formatting — table stakes
- Single concept per lesson — table stakes

**Avoids pitfalls:**
- Wall of Text Disease (#1) — hard word limits prevent overwhelming prose
- Formatting Overload (#10) — clear guidelines in SOUL.md (bold for key terms only, 1-2 emoji per message)

**Implementation:** Update openclaw/SOUL.md with formatting patterns, chunking rules, emoji anchors. Set openclaw.json `chunkMode: "newline"` for smart splitting. Test output in Telegram on mobile device.

**Research flag:** No additional research needed. Well-documented patterns from mobile UX and microlearning research.

---

### Phase 2: Inline Keyboard Navigation
**Rationale:** Most versatile interactive feature. Works for navigation, quick feedback, and multiple choice exercises. Transforms passive reading into active engagement. Directly addresses One-Way Broadcast Syndrome (#3) and Mobile Typing Barrier (#4).

**Delivers:**
- Inline buttons after exercises ("✅ Got it" / "❓ Confused" / "🔁 Explain differently")
- Multiple choice exercises with A/B/C/D buttons (one tap, no typos)
- Navigation buttons ("Next" / "Skip" / "Pause here")
- Escape hatches ("Show answer" / "I'm stuck")

**Addresses features:**
- Inline keyboards for exercises — table stakes
- Immediate feedback — table stakes (button click triggers instant response)
- Clear exit/pause path — table stakes

**Avoids pitfalls:**
- One-Way Broadcast Syndrome (#3) — buttons require interaction before proceeding
- Mobile Typing Barrier (#4) — tap instead of type for MCQ
- No Escape Routes (#6) — always offer "Skip" / "Show answer" buttons
- Ignoring Telegram Interactive Features (#11) — uses native inline keyboards

**Implementation:** Update openclaw.json to enable `inlineButtons: "all"`. Update openclaw/SOUL.md with button generation instructions (action JSON format, when to use, button text patterns, callback_data naming). Update SKILL.md with callback handling (how agent responds to "callback_data: option_a").

**Research flag:** No additional research needed. Telegram Bot API inline keyboards well-documented. May need testing to find optimal callback_data format for agent parsing.

---

### Phase 3: Slash Commands
**Rationale:** Improves discoverability and professional feel. Telegram users expect `/command` format. Makes bot easier to navigate without memorizing natural language intents. Quick win after inline keyboards (both are navigation improvements).

**Delivers:**
- Registered slash commands: `/start`, `/next`, `/quiz`, `/progress`, `/topics`, `/pause`, `/help`
- Autocomplete menu when student types `/`
- Natural language fallback ("next lesson" still works, but nudge toward `/next`)
- Help text and onboarding walkthrough

**Addresses features:**
- Slash command navigation — table stakes
- Progress visibility — table stakes (`/progress` shows current state)

**Avoids pitfalls:**
- Unclear Command Structure (#9) — commands visible in autocomplete menu
- Context Loss (#5) — `/review` or `/topics` helps navigate past content

**Implementation:** Update SKILL.md with command routing (map `/next`, `/quiz`, `/progress` to skill actions). Register commands via Telegram's `setMyCommands` API (manual curl or OpenClaw CLI if available). Update onboarding to teach key commands.

**Research flag:** Low priority research needed—check if OpenClaw CLI exposes `setMyCommands`, otherwise document curl workaround. Standard Bot API feature, well-documented.

---

### Phase 4: Quiz Mode Integration
**Rationale:** Builds on message formatting and inline keyboards. Telegram's native quiz mode provides automatic answer highlighting (green for correct, red for incorrect) and explanation text. Better UX than custom inline keyboard quizzes for standard multiple choice. Enables spaced repetition (quiz on weak spots).

**Delivers:**
- Native Telegram polls for concept checks (quiz mode with correct answer highlighting)
- Explanation text shown after incorrect answer (0-200 chars)
- Multi-select polls for "select all that apply" exercises
- Anonymous feedback polls ("How hard was this lesson?" 1-5 scale)

**Addresses features:**
- Spaced repetition reminders — table stakes (quiz weak spots every 5-7 lessons)
- Immediate feedback — table stakes (quiz mode auto-highlights correct/incorrect)
- Multi-select inline keyboards — differentiator (advanced version)

**Avoids pitfalls:**
- One-Way Broadcast Syndrome (#3) — quizzes require active participation
- Over-Reliance / Cognitive Offloading (#8) — quizzes test understanding, force recall

**Implementation:** Update openclaw/SOUL.md with quiz patterns (when to use quiz vs inline keyboard, explanation format, anonymous vs tracked). Add quiz scheduling logic to SKILL.md (every 5-7 lessons, focus on weak spots from progress.json). Test poll result delivery in OpenClaw (how does agent receive votes?).

**Research flag:** HIGH PRIORITY—need to verify how OpenClaw delivers poll results to agent. Critical for adaptive difficulty and spaced repetition. Test in implementation phase: send quiz, check session logs for poll result events.

---

### Phase 5: Adaptive Pacing & Progress Visualization
**Rationale:** Requires all previous phases working (commands to trigger, formatting to display, quizzes for performance data). Addresses Notification Fatigue (#2) and Subscription Churn (#15). Differentiator feature—most bots don't adapt to student state.

**Delivers:**
- Adaptive pacing (pause auto-delivery if 2+ unopened lessons, send gentle check-in)
- Granular notification controls (time, frequency, quiet hours)
- Progress indicators ("📊 Day 5/34 — 15% complete")
- Weekly synthesis summaries (connect the week's dots)
- Concept dependency visualization (text-based graph showing how topics relate)

**Addresses features:**
- Progress visibility — table stakes (text-based for MVP)
- Weekly synthesis summaries — differentiator
- Adaptive difficulty — differentiator (adjust based on quiz performance)

**Avoids pitfalls:**
- Notification Fatigue (#2) — adaptive pacing prevents nagging
- Subscription Churn (#15) — proactive check-ins recover at-risk students
- Gamification Backfire (#7) — progress over streaks, pause/freeze mechanics

**Implementation:** Add adaptive pacing logic to SKILL.md (detect unopened lessons, pause + check-in). Add progress tracking patterns to SOUL.md (progress bars, weekly summaries). Explore chart generation (text-based graphs or static images).

**Research flag:** MEDIUM PRIORITY—if visual charts needed (not text), research image generation libraries or static chart services. Phase 5 may need deeper research on adaptive difficulty algorithms (how to adjust curriculum based on performance data).

---

### Phase Ordering Rationale

- **Phase 1 first** because readable messages are foundation. No point adding buttons if students don't read the content. Highest impact, lowest effort.
- **Phase 2 second** because inline keyboards transform passive reading into active learning. Enables all subsequent phases (quizzes need buttons, commands complement buttons, progress uses buttons).
- **Phase 3 third** because slash commands are discoverability layer on top of working interactions. Professional polish, not foundational UX.
- **Phase 4 fourth** because quiz mode builds on message formatting and buttons. Requires understanding poll API and callback handling. Enables adaptive difficulty.
- **Phase 5 fifth** because adaptive pacing needs data from quizzes and interactions. Can't be intelligent without performance metrics from previous phases.

**Dependency chain:**
```
Message chunking → Inline keyboards (interactive exercises need readable content)
Inline keyboards → Quiz mode (quizzes use buttons or polls)
Quiz mode → Adaptive pacing (pacing needs performance data from quizzes)
Slash commands → Progress visualization (commands trigger progress display)
```

**Pitfall avoidance order:**
- Phase 1 prevents Wall of Text (#1) and Formatting Overload (#10)
- Phase 2 prevents One-Way Broadcast (#3), Mobile Typing Barrier (#4), No Escape Routes (#6)
- Phase 3 prevents Unclear Commands (#9) and Context Loss (#5)
- Phase 4 enables spaced repetition, prevents Over-Reliance (#8)
- Phase 5 prevents Notification Fatigue (#2) and Subscription Churn (#15)

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 4 (Quiz Mode):** HIGH PRIORITY—how does OpenClaw deliver poll results (votes, correct/incorrect) to the agent? Agent needs to update progress.json based on quiz performance. Test poll result event handling before designing adaptive difficulty logic.

- **Phase 5 (Adaptive Pacing):** MEDIUM PRIORITY—if visual progress charts needed (not text), research chart generation options. Adaptive difficulty algorithm needs validation (how to adjust curriculum complexity based on exercise scores?). May need A/B testing to tune pacing sensitivity (2 unopened lessons vs 3?).

Phases with standard patterns (skip research-phase):

- **Phase 1:** Well-documented mobile UX and microlearning patterns. Chunking and formatting are established best practices.
- **Phase 2:** Telegram inline keyboards well-documented in official Bot API. OpenClaw support confirmed. Action JSON format verified.
- **Phase 3:** Slash commands are standard Telegram feature. Command registration via `setMyCommands` is official API. Only unknown: OpenClaw CLI support (minor).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official Telegram Bot API 9.6 docs verified. OpenClaw Telegram integration confirmed (docs + guides). No new dependencies needed. |
| Features | HIGH | Multiple sources verified table stakes (inline keyboards, chunking, commands). Educational research confirms differentiators (Socratic method, adaptive difficulty). Anti-features identified from gamification studies. |
| Architecture | HIGH | OpenClaw architecture documented. Skill layer / gateway layer separation verified. Action JSON format confirmed in OpenClaw Telegram docs. Instruction-driven UX approach sound. |
| Pitfalls | MEDIUM | Web search findings + educational research papers verify critical pitfalls (#1-6). Moderate/minor pitfalls based on chatbot UX studies (2025-2026). Some pitfall metrics (exact message length, notification timing) not verified in production—extrapolated from mobile UX research. |

**Overall confidence:** HIGH

### Gaps to Address

Areas where research was inconclusive or needs validation during implementation:

- **Poll result delivery in OpenClaw:** How are poll results (votes, correct/incorrect answers) delivered to the agent? Critical for adaptive difficulty and spaced repetition. Resolution: Test in Phase 4 implementation—send a quiz, check session logs for poll result events, verify agent can parse and update progress.json.

- **Callback query format:** What exact format does OpenClaw use when delivering callback_data from inline keyboard buttons? Agent must parse this to route actions (e.g., "exercise_1_option_a" → check answer A for exercise 1). Resolution: Check OpenClaw docs or test by sending button, examining session logs.

- **Command registration via OpenClaw CLI:** Can `setMyCommands` be called via OpenClaw CLI, or manual curl only? Impacts Phase 3 setup instructions. Resolution: Check OpenClaw CLI docs/source. Fallback: provide curl examples in setup guide.

- **Message reaction support:** Does OpenClaw expose `MessageReactionUpdated` events to the agent? If yes, can track passive feedback ("👍 this lesson"). If no, rely on inline keyboards for all feedback. Resolution: Test in implementation or check OpenClaw source. Not critical—inline keyboards cover feedback needs.

- **Optimal message length for Telegram education:** Found general microlearning guidance (2-10 min videos) and mobile attention spans (6.8 sec), but not "150 words = 1 mobile screen" verified specifically for Telegram. Extrapolated from mobile UX research. Resolution: User test in Phase 1—try 1 message vs 3 messages vs 5 messages for same lesson, measure engagement.

- **Multi-message transaction support:** Can agent send 3 messages sequentially (concept → example → exercise) and wait for button click between them, or does session end after each agent message? Impacts chunking strategy (send all at once vs wait for acknowledgment). Resolution: Check OpenClaw session model—test whether session stays open after agent sends message.

## Sources

### Primary (HIGH confidence)

**Official Telegram Documentation:**
- [Telegram Bot API (v9.6)](https://core.telegram.org/bots/api) — Official API reference, inline keyboards, polls, quiz mode, formatting
- [Telegram Bot Features](https://core.telegram.org/bots/features) — Bot commands, deep linking, keyboards
- [Bot API Changelog](https://core.telegram.org/bots/api-changelog) — Recent updates (button colors, custom emoji, quiz mode enhancements)
- [Telegram Limits](https://limits.tginfo.me/en) — Message length (4096 chars), callback_data (64 bytes), poll options

**OpenClaw Documentation:**
- [OpenClaw Telegram Channel Docs](https://docs.openclaw.ai/channels/telegram) — Formatting, chunking, buttons, polls
- [OpenClaw Gateway Architecture](https://docs.openclaw.ai/concepts/architecture) — Skill layer, gateway layer separation
- [OpenClaw Skills System](https://deepwiki.com/openclaw/openclaw/5.2-skills-system) — Skill discovery and injection

**Educational Research:**
- [Microlearning Trends 2026](https://www.5mins.ai/resources/blog/microlearning-trends-2026) — 2-10 minute optimal duration
- [User Attention Span Statistics 2026](https://www.amraandelma.com/user-attention-span-statistics/) — 7.97 sec average, 6.8 sec mobile 18-34
- [Integrating Custom Chatbot: Passive to Interactive E-Learning (JISE 2025)](https://jise.org/Volume36/n4/JISE2025v36n4pp384-399.html) — Active vs passive learning retention

### Secondary (MEDIUM confidence)

**Telegram UX Best Practices:**
- [Telegram Chatbots for Education 2026](https://www.such.chat/blog/telegram-chatbots-for-education) — Educational bot patterns
- [Telegram Inline Keyboard UX Guide](https://wyu-telegram.com/blogs/444/) — Button layout, response times (300ms target)
- [Multiselection Inline Keyboards](https://medium.com/@moraneus/enhancing-user-engagement-with-multiselection-inline-keyboards-in-telegram-bots-7cea9a371b8d) — Advanced button patterns

**Chatbot Pitfalls:**
- [AI Chatbots in Education: Challenges (MDPI 2025)](https://www.mdpi.com/2078-2489/16/3/235) — Pedagogical design importance
- [California Colleges AI Chatbot Failures (CalMatters Mar 2026)](https://calmatters.org/education/higher-education/college-beat/2026/03/college-ai-chatbot/) — Technology-first vs pedagogy-first
- [Cognitive Load in Mobile Messaging (ScienceDirect Apr 2025)](https://www.sciencedirect.com/science/article/abs/pii/S0747563225001062) — Message accumulation creates extraneous load

**Gamification & Engagement:**
- [Streaks Gamification Case Study (Trophy 2025)](https://trophy.so/blog/streaks-gamification-case-study) — 2.3x engagement after 7-day streak, broken streaks demotivate
- [App Push Notification Best Practices 2026](https://appbot.co/blog/app-push-notifications-2026-best-practices/) — Aggressive Focus modes, one-tap silencing
- [Telegram Subscriber Tracking 2026](https://clickgram.io/blog/telegram-subscriber-tracking-engagement-2026/) — Engagement matters over subscriber count

### Tertiary (LOW confidence, needs validation)

- **Telegram notification priority:** One source (Respond.io) claims bot messages have "lowest priority" and are frequently batched, but Telegram's official docs don't specify priority system. Treat as likely but not authoritative.
- **Exact A/B test data for inline keyboards vs text input in education:** Found general engagement benefits, but no controlled experiments in educational contexts. Directionally correct, effect size unknown.
- **Voice input adoption in educational chatbots:** Telegram supports voice messages, but no data on adoption rates or effectiveness for education. Prevention strategy theoretically sound but unproven in practice.

---

**Research completed:** 2026-04-09  
**Ready for roadmap:** Yes

All four research files (STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md) have been synthesized. The recommended phase structure is instruction-driven UX improvements with clear dependencies. Phase 1-3 require no code changes, only skill file updates. Phase 4-5 may need gateway integration for quiz results and adaptive pacing. Research flags identify where deeper investigation is needed during implementation (poll result handling, callback query format).
