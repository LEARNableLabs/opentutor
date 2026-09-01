# OpenTutor — Honest Product & Research Review

---

## 1. Product Vision

**Who is this for?** Unclear. The README says "portable Agent Skill that turns any AI agent into a personalized daily tutor," which is a developer pitch, not a student pitch. The actual value prop — "learn anything through daily Socratic conversations" — is buried under architecture diagrams. A student landing on this repo would have no idea what to do. A developer would be impressed but overwhelmed by 7 platform integrations.

**"Universal agent skill" dilutes focus.** Supporting Claude Code, Codex, OpenClaw, NemoClaw, NanoClaw, Hermes, and Claude Web sounds impressive but means no platform gets a polished experience. The Telegram bot has Socratic delivery, retrieval practice, adaptive length, deliberate practice enforcement. Claude Web gets "upload some files and hope for the best." That's not parity — it's feature theater. Ship one platform well before claiming seven.

**292 pre-built topics: vanity metric.** They were batch-generated in one run, never tested with a single student, and 291 of them lack any learning.md or practice-feedback.md. The teacher.md files were deterministically extracted (not LLM-generated) and contain lines like "This domain uses a mix of delivery formats: concept-focused mini-lessons — 9 lessons (33%)" — that's metadata, not teaching guidance. A domain expert would not recognize these as teaching configs. Quantity over quality hurts credibility. Better to have 10 domains that are genuinely excellent — tested, iterated, with real student data — than 292 untested ones.

---

## 2. Teaching Methodology — Research Alignment

**The Socratic implementation is promising but fragile.** The 2025 LearnLM RCT (cited in teaching-research.md) validates AI Socratic tutoring, but that study used a purpose-built model fine-tuned for tutoring. OpenTutor uses general-purpose Claude/GPT via prompt engineering. The quality of Socratic questioning depends entirely on prompt quality + model capability. When the model generates a weak diagnostic question — "What do you know about Nash equilibrium?" instead of "If two gas stations are across the street from each other, why don't they just both lower prices to zero?" — the entire Socratic benefit disappears. There's no question quality evaluation. The system trusts the LLM completely.

**Deliberate practice: 60% genuine, 40% cargo-culted.** What's real:
- BLOCK/REVISIT directives targeting weaknesses — this is genuine, enforced in code
- BUMP/DROP difficulty adjustment — simple but functional
- Goals per lesson — present in the lesson plan

What's cargo-culted:
- `assessRetrievalQuality()` at `lesson.js:301-309` uses naive word overlap to score free-text answers. A student who writes "Nash equilibrium is important for game theory applications" scores "easy" because "Nash" and "equilibrium" overlap with the concept name — regardless of whether the explanation is correct. A student who writes "it's when nobody wants to change their strategy because they're already doing the best they can given what everyone else is doing" might score "wrong" if none of those words overlap with "Nash equilibrium." This function is determining SM-2 scheduling intervals. Bad assessments corrupt the entire spaced repetition system.
- `assessEngagement()` at `lesson.js:364-374` equates message length with engagement. A student who writes "yes" (engaged but concise) scores "minimal." A student who writes 150 characters of confused rambling scores "high." This feeds into the student model, which feeds into mode selection. A terse but brilliant student gets pushed to "quick" mode (less teaching) while a verbose confused student gets "standard" (no extra help).
- The `selectMode()` function at `lesson.js:35-49` sends students with "low engagement" (i.e., short messages) to "quick" mode. That's backwards. Disengaged students need MORE attention, not less. Quick mode should be for students who are demonstrably ahead, not for students who seem checked out.

**SM-2 is fine but not the point.** Yes, SM-2 is from 1987. FSRS and other modern algorithms exist. But the scheduling algorithm matters far less than what gets scheduled and how it's assessed. The assessment problem (word overlap) is 100x more impactful than the scheduling algorithm choice.

**Adaptive length is a good idea, weakly executed.** The research supports differentiated session lengths, but the mode selection logic is crude. Using `recentAccuracy > 0.85` as the quick-mode threshold means a student who's been lucky on 5 easy questions gets rushed through harder material. There's no distinction between "high accuracy on easy content" and "high accuracy on hard content."

---

## 3. What Will Actually Break

**The lesson plan will fail to parse.** `lesson.js:162-176` tries to parse the LLM response as JSON. When it fails, the fallback is a generic "What do you already know about X?" — losing all the deliberate practice calibration. How often does this happen? Unknown. There's no monitoring, no fallback rate tracking. For a system that generates a lesson plan on every single lesson, even a 5% parse failure rate means 1 in 20 lessons degrades silently.

**Active lessons are in-memory.** `activeLessons` at `lesson.js:54` is a plain JavaScript object. If the bot process restarts mid-lesson — which happens any time you deploy, crash, or run out of memory — every active lesson is lost. The student's next message goes to general chat instead of the lesson handler. The SQLite job queue was added for pipeline persistence, but lesson delivery state was forgotten.

**292 domains have wildly varying quality.** Compare:
- `auction-theory`: 27 lessons, detailed concept map, 10 misconceptions in teaching-notes, rich resources
- `behavioral-economics`: 5 preliminary lessons, no resources, concept-map hand-written as a stopgap
- All 292 teacher.md files were machine-extracted from metadata, not reviewed

Nobody has verified whether the concept maps contain circular dependencies, whether the difficulty progressions make sense, or whether the teaching notes are accurate. The Critic agent reviewed none of these — they were batch-generated before the Critic existed.

**No error recovery in conversations.** If the student says something completely unrelated mid-lesson ("what's the weather?"), the Socratic response prompt will try to interpret it as an answer to the current step. There's no escape hatch except "skip." The router checks `getActiveLesson(chatId)` before general chat — any free-text during a lesson is treated as a lesson answer, period.

**buildTeacherPrompt still exists.** `prompts.js:153-210` still has the old `buildTeacherPrompt` that generates a 4-step content dump with A-D multiple choice. The web UI and Vercel API still use this (via `api/lesson.js`). So the web interface delivers the OLD teaching methodology while the bot delivers the new one. This isn't just a parity issue — it's contradictory. The README claims Socratic delivery but the web does content dumps.

---

## 4. Platform Fragmentation Risk

**This is the biggest product risk.** Seven platform integrations, each with a README, each with different capability levels, and only one (Telegram bot) actually implements the full teaching methodology. The others are setup guides pointing at skill files that the platform may or may not execute correctly.

**For the first 100 users, only two platforms matter: the web UI and the Telegram bot.** Everything else is premature. OpenClaw, NemoClaw, NanoClaw, Hermes, and Codex integrations should be frozen and documented as "experimental" until the core product works end-to-end with real students.

**The abstraction is wrong.** `lib/core/` was built to be "platform-agnostic," but the Socratic lesson flow is inherently conversational and stateful. The web API serves single-shot lesson responses. You can't retrofit a multi-turn conversation onto a request/response API without WebSocket or SSE — which the web server doesn't have. The "same interface" promise breaks on the most important feature.

---

## 5. Missing Critical Features

**A learning scientist would say:**
- No formative assessment framework. The system tracks accuracy (right/wrong) but doesn't assess understanding depth. A student can get every retrieval check "right" by pattern matching without understanding.
- No concept prerequisite enforcement. The curriculum is sequential, but if a student skips lessons or a prerequisite was taught poorly, the system doesn't verify mastery before advancing to dependent concepts.
- No peer learning. Even simple features like "another student described this as..." would add social proof and alternative perspectives.

**A product person would say:**
- No analytics dashboard. You can't see how students are doing across topics, where they drop off, which lessons have the highest failure rate.
- No notifications that work. The cron scheduler sends lessons at fixed times, but there's no "you haven't practiced in 3 days" nudge. Re-engagement is the hardest problem in edtech, and it's unaddressed.
- No onboarding completion tracking. If a student starts onboarding and drops off, they're stuck — next visit shows the same onboarding, or worse, skips to an empty Learn view.

**A student would say:**
- "Where's my progress?" The /progress command shows a text bar. Where's the visual dashboard showing concept mastery, streaks, what I've learned over time?
- "Can I go back?" No way to revisit a completed lesson. No lesson history. If I want to re-read what we covered on Day 3, I can't.
- "Why can't I see the answer?" After a Socratic exchange, the full explanation isn't saved anywhere the student can review. Conversation history is in JSONL files the student can't access.

---

## 6. Competitive Landscape

**Khan Academy / Khanmigo:** Battle-tested with millions of students. Their AI tutor is backed by structured content, video explanations, and a decade of learning analytics. OpenTutor has better Socratic methodology on paper, but zero validation data.

**Duolingo:** Proves daily micro-lessons work for retention. Their streak/gamification system keeps 10M+ daily users. OpenTutor has better pedagogy (free-text vs multiple choice, adaptive difficulty vs fixed paths) but no engagement mechanics.

**Brilliant:** Strong on interactive problem-solving. Their visual/interactive format is something text-only Telegram can't match.

**The defensible advantage is also the biggest risk:** OpenTutor's multi-agent pipeline (Research → Build → Critique → Teach) can generate a quality curriculum for ANY topic in minutes. No competitor does this. But "quality" is unvalidated — the pipeline produces plausible-looking output that might contain conceptual errors, bad sequencing, or hallucinated resources. The URL verification step helps, but it only checks whether links resolve, not whether the content is pedagogically appropriate.

The real advantage: **open-source portability.** No competitor runs on your local machine, in your Telegram, with your preferred LLM, on any topic. If OpenTutor gets the teaching quality right, the portability becomes a genuine moat.

---

## 7. Honest Overall Assessment

**What's genuinely good:**
- The Socratic delivery design is the best AI tutoring flow I've seen in an open-source project. The diagnostic-first approach, misconception mapping, and adaptive steps are research-grounded and thoughtfully implemented.
- The DeliberatePractitioner is a novel idea — a critic for the teaching process, not just the curriculum. No competitor does this.
- The separation of domain knowledge (teacher.md) from student profile (USER.md) is the right abstraction. It allows the same curriculum to teach different students differently.
- The research pipeline (8 sources, syllabus comparison, URL verification) produces genuinely useful curriculum context.

**What's overengineered:**
- 7 platform integrations before a single platform works end-to-end with real students.
- 292 batch-generated domains that create an illusion of breadth without depth.
- 5 LLM adapters (plus OpenRouter which already proxies to all of them). Ship with Claude SDK and add others when someone asks.
- SQLite + Supabase + file-based state — three storage backends for a product with zero users. Pick one.
- The group learning feature. It's premature. Get 1-on-1 tutoring right first.

**The single biggest risk:**
The system has never taught a single real student. All the deliberate practice enforcement, adaptive difficulty, student modeling — it's theory. The assessRetrievalQuality function uses word overlap. The engagement model equates verbosity with interest. The mode selection sends disengaged students to quick mode (less help, not more). These aren't edge cases — they're the core learning loop, and they contain fundamental logic errors that will only surface under real use.

**If you had to ship to 100 students tomorrow:**
1. Fix `selectMode()` — disengaged students need deep mode, not quick mode
2. Fix `assessRetrievalQuality()` — use the LLM to assess answers, not word overlap. One extra cheap call per retrieval is worth it
3. Fix `assessEngagement()` — add response time, question relevance, not just message length
4. Add lesson state persistence — active lessons lost on restart is a showstopper
5. Delete 282 of the 292 domains. Keep 10 that you've personally walked through as a student. Quality beats quantity for launch.
6. Focus on Telegram + Web only. Freeze all other integrations.
7. Add a real analytics page — even just "lessons completed, accuracy trend, concepts mastered" per student
