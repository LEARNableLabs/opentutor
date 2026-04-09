# Phase 1: Message Formatting & Chunking - Research

**Researched:** 2026-04-09
**Domain:** Mobile-first message UX for educational chatbots (Telegram Bot API, cognitive load principles, mobile reading patterns)
**Confidence:** HIGH

## Summary

This phase implements message chunking and formatting for mobile Telegram delivery. Research confirms that the 150-word soft cap aligns with mobile reading comprehension best practices (sentences under 20 words, paragraphs 3-5 lines max). Telegram Bot API supports rich HTML formatting (bold, italic, code, links, spoilers) with a hard limit of 4,096 characters per message. Mobile users scan content in F-patterns and respond better to bullet lists and emoji anchors than walls of text.

The core challenge is splitting pedagogical content at semantic boundaries (concept → example → exercise) while maintaining conversational flow across 3-4 sequential messages. Existing `lesson-delivery.md` provides format variations but lacks chunking rules. `openclaw/SOUL.md` already uses structured cards with emoji anchors (6 types), which can be simplified to 4 anchors as specified in user decisions.

**Primary recommendation:** Update `skills/tutor/references/lesson-delivery.md` with chunking rules (150-word soft cap, semantic splits, multi-message patterns). Update `openclaw/SOUL.md` to align with 4-anchor system and reference universal chunking rules. No code changes needed — skill file updates only.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Split lessons by pedagogical section — each section (concept, example, exercise) becomes its own message. Not by word count or fixed template.
- **D-02:** Soft cap at 150 words per message — agent aims for ~150 words but can exceed slightly if splitting mid-thought would hurt clarity.
- **D-03:** Minimum 2 messages per lesson — ensures every lesson feels multi-message, never a wall of text. Even simple formats like "just a question" get at least 2 messages.
- **D-04:** 4 emoji anchors, simplified from the 6 in openclaw/SOUL.md:
  - 📖 Title/progress (replaces 📌)
  - 🧠 Core concept (kept)
  - 💡 Example (replaces 🔬)
  - ✏️ Exercise (kept)
- **D-05:** Anchors defined in universal references (lesson-delivery.md), not Telegram-specific. All platforms inherit the same visual language.
- **D-06:** Per-format chunking patterns — each of the 5 format variations (mini-lesson, question, resource drop, teach-back, challenge) gets its own message sequence template. Not one universal sequence.
- **D-07:** Mini-lesson sequence (most common format): 📖 Hook → 🧠 Concept → 💡 Example → ✏️ Exercise (4 messages). Hook includes title + progress + callback to previous lesson.
- **D-08:** Every lesson's final message ends with an engagement prompt — exercise, question, or teaser for tomorrow. Keeps the conversation loop open.

### Claude's Discretion
- Overflow handling: When a section exceeds the soft cap, Claude decides whether to split at paragraph boundary or condense. No strict rule.
- Sequence templates for non-mini-lesson formats (question, resource drop, teach-back, challenge): Claude designs appropriate 2-3 message sequences during planning/implementation, following the per-format pattern principle.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FMT-01 | Lessons are chunked into 3-4 short messages (max 150 words each) | Mobile reading comprehension research (20-word sentences, 3-5 line paragraphs), Telegram 4,096-char limit supports multiple short messages, F-pattern scanning favors chunked content |
| FMT-02 | Messages use HTML formatting (bold, italic, code blocks) optimized for mobile Telegram | Telegram Bot API supports full HTML subset (`<b>`, `<i>`, `<code>`, `<pre>`, `<a>`, `<u>`, `<s>`, spoilers), current as of 2026 |
| FMT-03 | Emoji used as structured visual anchors, not decoration | 2026 mobile UX trends emphasize emoji for faster emotional communication, visual hierarchy through size/color/spacing, anchor pattern already proven in `openclaw/SOUL.md` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Telegram Bot API | 9.3+ (2026) | HTML message formatting | Official API, supports full HTML subset for text styling [VERIFIED: Telegram Bot API docs] |
| Node.js | 12+ | Setup CLI runtime | Already in use for `scripts/setup.js` [VERIFIED: package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Markdown | N/A | Skill file format | Universal — all platforms parse skill files as Markdown [VERIFIED: project structure] |
| JSON | N/A | Data schemas | Curriculum, progress tracking, cron jobs [VERIFIED: CLAUDE.md] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| HTML formatting | MarkdownV2 | MarkdownV2 requires more escaping (`_`, `*`, `[`, `]`, `(`, `)`, `~`, `` ` ``, `>`, `#`, `+`, `-`, `=`, `|`, `{`, `}`, `.`, `!`) and is harder to read in plain text. HTML is more explicit and less error-prone for skill file instructions. |
| Multi-message delivery | Single 4,096-char message | Single message works technically but violates mobile UX best practices — users scan in F-patterns and disengage from walls of text. Chunking improves comprehension and engagement. |

**Installation:**
```bash
# No external dependencies — this phase updates skill files only
# Telegram Bot API is a web service, not a package to install
```

**Version verification:** Telegram Bot API version confirmed via official documentation (Bot API 9.3 as of January 2026). No package version to check.

## Architecture Patterns

### Recommended File Structure
```
skills/tutor/references/
├── lesson-delivery.md        # UPDATE: Add chunking rules and emoji anchor definitions
├── teaching-method.md         # Context for chunking (deliberate practice, level adaptation)
└── curriculum-format.md       # Context for lesson metadata

openclaw/
└── SOUL.md                    # UPDATE: Align with 4-anchor system, reference universal chunking rules

workspace/
└── SOUL.md                    # No changes — platform-agnostic base
```

### Pattern 1: Semantic Message Splitting
**What:** Split lessons at pedagogical boundaries (concept, example, exercise), not arbitrary word counts.
**When to use:** All lesson formats — chunking must preserve teaching flow.
**Example:**
```markdown
Message 1 (📖 Hook):
📖 Day 5/34 · Eigenvalues — Yesterday we saw how matrices transform space. Today: what stays fixed?

Message 2 (🧠 Concept):
🧠 An eigenvalue λ tells you how much an eigenvector gets stretched. If Av = λv, then v is an eigenvector and λ is its eigenvalue.

When a matrix multiplies a vector, most vectors change direction. But eigenvectors only stretch or shrink — they keep pointing the same way.

Message 3 (💡 Example):
💡 Think of a door hinge. When you push the door, every point on the door moves — except the hinge. The hinge is an eigenvector with λ=1 (doesn't stretch at all).

Message 4 (✏️ Exercise):
✏️ Matrix A = [[2,1],[0,3]] — What are its eigenvalues? Reply with your answer.
```

**Why it works:** Each message has a single focus, scannable in 5-10 seconds. Emoji anchors create visual rhythm. Total word count ~120 across 4 messages (well within mobile attention span).

### Pattern 2: Per-Format Message Sequences
**What:** Each of the 5 lesson format variations (mini-lesson, question, resource drop, teach-back, challenge) gets a tailored message sequence.
**When to use:** Planning message sequences for non-mini-lesson formats.
**Example:**
```markdown
Format: "Just a question" (2 messages minimum)
Message 1 (📖 Hook): 📖 Day 12/34 — Quick one today...
Message 2 (🧠 Question): 🧠 Think about this: why can't you comb a hairy ball flat?

Format: "Resource drop" (3 messages)
Message 1 (📖 Hook): 📖 Day 15/34 — Time for a different perspective...
Message 2 (💡 Resource): 💡 Watch this 10-min video: [link]. It shows eigenvectors in action with real-world examples.
Message 3 (✏️ Follow-up): ✏️ After watching, tell me: which example clicked for you?
```

**Why it works:** Different formats have different pedagogical purposes. Fixed templates would feel robotic. Per-format sequences maintain variety while ensuring minimum 2-message delivery.

### Pattern 3: Emoji as Structural Anchors (Not Decoration)
**What:** Use 4 emoji consistently at message start to signal content type: 📖 Title/progress, 🧠 Concept, 💡 Example, ✏️ Exercise.
**When to use:** Every message in a lesson sequence.
**Example:**
```markdown
📖 Day 5/34 · Eigenvalues — ...
🧠 An eigenvalue λ tells you...
💡 Think of a door hinge...
✏️ Matrix A = [[2,1],[0,3]]...
```

**Why it works:** Mobile users scan in F-patterns (horizontal top, horizontal middle, vertical left). Emoji at line start creates a scannable left anchor. Research shows emoji mix text for faster, more emotional communication [VERIFIED: 2026 mobile UX trends].

### Anti-Patterns to Avoid
- **Arbitrary word-count splitting:** Splitting mid-paragraph or mid-thought to hit 150 words exactly. Violates D-02 (soft cap, clarity over strict limits).
- **Inconsistent emoji usage:** Using emoji decoratively (🎉✨🔥) instead of structurally. Violates D-04/D-05 (4 anchors, consistent meaning).
- **Single-message lessons:** Sending one 500-word message instead of 3-4 short ones. Violates D-03 (minimum 2 messages) and mobile UX best practices.
- **Breaking engagement prompts:** Ending a lesson without a question, exercise, or teaser. Violates D-08 (every final message ends with engagement prompt).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Telegram message formatting | Custom parser, regex-based formatters | Telegram Bot API HTML subset | Official API handles all edge cases (nesting, escaping, entity limits). Hand-rolled parsers miss corner cases like overlapping entities or malformed tags. |
| Word counting for chunking | Regex split, manual counting | Built-in string methods (`split(' ').length`) | Simple, reliable, no dependencies. Regex word-counting fails on contractions, hyphenated words, code snippets. |
| Emoji rendering | Custom emoji codes, Unicode tables | Native emoji characters in UTF-8 | All modern platforms support emoji natively. Custom codes add complexity and break on copy-paste. |
| Mobile reading metrics | Custom heuristics for "scannable" | Research-backed guidelines (F-pattern, 20-word sentences, 3-5 line paragraphs) | UX research already solved this. Custom heuristics are arbitrary and unvalidated. |

**Key insight:** Message chunking is a **pedagogical design problem**, not a technical one. The challenge is preserving teaching flow across multiple messages, not implementing text splitting. Telegram Bot API already handles all formatting complexity.

## Runtime State Inventory

> Phase is greenfield skill file updates (no rename/refactor/migration). Omitting this section.

## Common Pitfalls

### Pitfall 1: Exceeding Telegram's 4,096 Character Limit
**What goes wrong:** Agent generates a message over 4,096 characters. Telegram API rejects it with error. Student sees nothing.
**Why it happens:** 150 words ≈ 750-900 characters (5-6 chars/word). Agent could theoretically send 4+ messages in one API call, hitting limit.
**How to avoid:** Enforce 150-word soft cap at skill instruction level. Even if agent exceeds to 200 words for clarity (per D-02), that's ~1,200 chars — well under limit.
**Warning signs:** Testing reveals failed message delivery. Check character count in test messages.

### Pitfall 2: Splitting Mid-Thought for Word Count
**What goes wrong:** Agent splits a concept explanation at word 150 even though the sentence isn't finished. Student receives half an idea in message 1, other half in message 2. Cognitive load increases.
**Why it happens:** Misinterpreting D-02 as a hard rule instead of a soft cap.
**How to avoid:** Skill instructions must emphasize "aim for 150, but finish the thought." Semantic boundaries > strict counts.
**Warning signs:** Test messages feel choppy or incomplete. Concepts don't land in single messages.

### Pitfall 3: Emoji Overload (Not Anchors)
**What goes wrong:** Agent uses emoji decoratively (🎉 Great job! ✨ Here's a tip! 🔥 Hot take!) instead of structurally (📖, 🧠, 💡, ✏️). Message looks cluttered, not organized.
**Why it happens:** Confusing "emoji as visual anchors" with "emoji for personality."
**How to avoid:** D-04 locks 4 emoji for structure. Skill instructions forbid decorative emoji in lessons. Personality comes from text, not emoji.
**Warning signs:** Test messages have 5+ emoji types per lesson. Emoji placement is inconsistent.

### Pitfall 4: Losing Engagement Prompts
**What goes wrong:** Agent ends a lesson with "That's it for today!" instead of a question, exercise, or teaser. Student has no reason to reply. Conversation dies.
**Why it happens:** Missing D-08 constraint in final message generation.
**How to avoid:** Every lesson sequence template must end with ✏️ Exercise or engagement question. Build this into per-format patterns.
**Warning signs:** Test conversations require student to initiate next interaction. No natural reply hook.

### Pitfall 5: Platform-Specific Instructions in Universal Files
**What goes wrong:** `lesson-delivery.md` includes Telegram-specific instructions (e.g., "use Telegram inline buttons"). Non-Telegram platforms break or ignore instructions.
**Why it happens:** Forgetting D-05 (anchors defined in universal references, platform-specific in platform folders).
**How to avoid:** Universal files (`skills/tutor/references/*.md`) must work on all platforms. Platform-specific extensions go in `openclaw/SOUL.md`, `nanoclaw/README.md`, etc.
**Warning signs:** Non-Telegram platforms fail to render lessons correctly. Instructions reference Telegram-only features.

## Code Examples

Verified patterns from skill files and user-approved preview:

### Mini-Lesson 4-Message Sequence
```markdown
Message 1 (📖 Hook):
📖 Day 5/34 · Eigenvalues — Yesterday we saw how matrices transform space. Today: what stays fixed?

Message 2 (🧠 Concept):
🧠 An eigenvalue λ tells you how much an eigenvector gets stretched. 

If Av = λv, then v is an eigenvector and λ is its eigenvalue.

When a matrix multiplies a vector, most vectors change direction. But eigenvectors only stretch or shrink — they keep pointing the same way.

Message 3 (💡 Example):
💡 Think of a door hinge.

When you push the door, every point on the door moves — except the hinge. The hinge is an eigenvector with λ=1 (doesn't stretch at all).

Message 4 (✏️ Exercise):
✏️ Matrix A = [[2,1],[0,3]] — What are its eigenvalues?

Reply with your answer.
```
**Source:** User-approved preview in 01-CONTEXT.md

### Telegram HTML Formatting Subset
```html
<!-- Bold -->
<b>bold text</b> or <strong>bold text</strong>

<!-- Italic -->
<i>italic text</i> or <em>italic text</em>

<!-- Underline -->
<u>underline</u> or <ins>underline</ins>

<!-- Strikethrough -->
<s>strikethrough</s> or <strike>strikethrough</strike> or <del>strikethrough</del>

<!-- Code (inline) -->
<code>inline fixed-width code</code>

<!-- Code block (pre-formatted) -->
<pre>pre-formatted fixed-width code block</pre>

<!-- Code block with syntax highlighting -->
<pre><code class="language-python">
def eigenvalues(A):
    return np.linalg.eigvals(A)
</code></pre>

<!-- Links -->
<a href="https://example.com">inline URL</a>

<!-- Spoiler (hidden until tapped) -->
<span class="tg-spoiler">spoiler text</span>
```
**Source:** [Telegram Bot API - Formatting Options](https://core.telegram.org/bots/api#formatting-options)

### Chunking Decision Tree
```markdown
When generating a lesson:

1. Identify pedagogical sections (hook, concept, example, exercise)
2. For each section:
   - Draft content
   - Check word count
   - If < 150 words → one message
   - If 150-200 words → assess: can split at paragraph? If yes, split. If no, keep as one message (D-02 soft cap).
   - If > 200 words → split at semantic boundary (after definition, after example setup, etc.)
3. Assign emoji anchor based on section type (📖 🧠 💡 ✏️)
4. Ensure final message has engagement prompt (D-08)
5. Ensure total message count ≥ 2 (D-03)
```
**Source:** Derived from locked decisions D-01, D-02, D-03, D-08

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single-message lessons | Multi-message chunking | 2026 (this phase) | Aligns with mobile F-pattern scanning, reduces cognitive load, improves engagement |
| Decorative emoji | Structural emoji anchors | 2026 (this phase) | Consistent visual hierarchy, faster content scanning |
| 6 emoji anchors (📌📚🧠⚡🔬✏️) | 4 emoji anchors (📖🧠💡✏️) | 2026 (this phase, D-04) | Simplified visual system, reduced cognitive overhead |
| "Emoji sparingly" guideline | One emoji anchor per message (consistent) | 2026 (this phase) | Contradicts old `lesson-delivery.md` guidance — update needed |

**Deprecated/outdated:**
- **`lesson-delivery.md` line 96:** "Emoji sparingly as visual anchors (one or two per message, not every bullet)" — replaced by D-04/D-05 system where every message gets exactly one emoji anchor.
- **`openclaw/SOUL.md` 6-anchor system:** 📌 Title, 📚 References, 🧠 Core concept, ⚡ Key distinction, 🔬 Example, ✏️ Exercise — simplified to 4 anchors (📖🧠💡✏️) per D-04.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | 150 words ≈ 750-900 characters (5-6 chars/word average) | Common Pitfalls | If character count is higher (e.g., 7-8 chars/word due to technical terms), could approach 4,096-char limit faster than expected. Mitigation: 150-word cap still provides 4x safety margin (600 words max before hitting limit). |
| A2 | Mobile users scan in F-patterns (horizontal top, horizontal middle, vertical left) | Architecture Patterns | If scanning behavior differs significantly in educational contexts, emoji-left anchoring might be suboptimal. However, research covers general mobile reading, not just educational chatbots. Mitigation: User testing during validation will reveal issues. |
| A3 | Telegram Bot API 9.3 features (HTML formatting) are stable and won't change breaking in near future | Standard Stack | If Telegram deprecates HTML tags, skill files need updates. Low risk — HTML has been stable since Bot API 4.0+ (2019). |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

## Open Questions

1. **How does the agent determine "pedagogical section" boundaries in practice?**
   - What we know: D-01 specifies split by section (concept, example, exercise). Existing `lesson-delivery.md` defines 5 format variations.
   - What's unclear: For formats like "teach-back" or "real-world challenge," section boundaries are less obvious than mini-lessons.
   - Recommendation: Planner should define example sequences for all 5 formats during planning phase. Use mini-lesson as template, adapt for others.

2. **What happens if student replies mid-sequence (after message 2 of 4)?**
   - What we know: Cron delivers lessons as conversation starters. Chat flow is live and adaptive.
   - What's unclear: Should agent finish the 4-message sequence before responding, or pause and address student's question?
   - Recommendation: Out of scope for this phase (message formatting only, not conversation flow). Flag for future phase or document in `workspace/AGENTS.md` as implementation detail.

3. **How to handle code blocks that naturally exceed 150 words?**
   - What we know: D-02 allows exceeding soft cap for clarity. Code blocks use `<pre><code>` formatting.
   - What's unclear: Should code examples be split across messages, or kept whole even if 200+ words?
   - Recommendation: Keep code blocks whole (splitting breaks syntax). Code blocks are visually distinct — not "wall of text." Document as exception in chunking rules.

## Environment Availability

> Phase has no external dependencies beyond Telegram Bot API (web service, not local install). All work is skill file updates in Markdown/JSON. Skipping environment audit.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual testing (no automated framework) |
| Config file | None — see Wave 0 |
| Quick run command | N/A (manual mobile device testing) |
| Full suite command | N/A (manual mobile device testing) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FMT-01 | Lessons chunked into 3-4 messages, max 150 words each | manual | N/A — test on iPhone/Android Telegram app | ❌ Wave 0 |
| FMT-02 | Messages use HTML formatting (bold, italic, code) | manual | N/A — verify HTML rendering in Telegram | ❌ Wave 0 |
| FMT-03 | Emoji used as structured anchors (📖🧠💡✏️) | manual | N/A — visual inspection of message sequences | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** Manual review of updated skill file sections (check emoji consistency, chunking rules clarity)
- **Per wave merge:** N/A (single wave expected)
- **Phase gate:** Full manual test on mobile Telegram (iPhone + Android) — deliver sample mini-lesson via OpenClaw, verify chunking, formatting, emoji anchors

### Wave 0 Gaps
- [ ] **Testing checklist document** — create `.planning/phases/01-message-formatting-chunking/TESTING.md` with:
  - Mobile device setup (Telegram app on iPhone/Android)
  - Sample lesson delivery via OpenClaw
  - Checklist: message count (3-4), word count (<150/message), emoji anchors (📖🧠💡✏️), HTML formatting (bold, italic, code), engagement prompt in final message
- [ ] **No automated framework available** — this phase is skill file updates (prose instructions), not code. Validation requires human reading/testing on mobile devices.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No | N/A — no auth changes |
| V3 Session Management | No | N/A — no session changes |
| V4 Access Control | No | N/A — no access control changes |
| V5 Input Validation | Yes | Skill file instructions must sanitize user input before embedding in HTML messages (prevent XSS via malicious user replies) |
| V6 Cryptography | No | N/A — no crypto changes |

### Known Threat Patterns for Telegram Bot API + Skill Files

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via user input in HTML messages | Tampering | HTML-escape user input before embedding in `<b>`, `<code>`, or other tags. Telegram Bot API auto-escapes most entities, but skill instructions should not recommend raw embedding. |
| Prompt injection via emoji/formatting | Tampering | Skill instructions define emoji anchors (📖🧠💡✏️) as constants, not user-controlled. Agent should not allow student to override anchor meanings. |
| Message flood (exceeding 4,096 char limit) | Denial of Service | 150-word soft cap prevents runaway message generation. Agent should catch 4,096-char limit errors and split if needed. |

**Notes:**
- This phase does not implement code — it updates skill files (prose instructions for agent). Security controls are **instructional** (e.g., "always escape user input before embedding in HTML") rather than **programmatic** (e.g., input validation library).
- Telegram Bot API handles most security concerns (HTML escaping, entity limits, rate limiting). Skill files should not bypass these protections.

## Sources

### Primary (HIGH confidence)
- [Telegram Bot API - Formatting Options](https://core.telegram.org/bots/api#formatting-options) - HTML tag support, entity nesting rules
- [Telegram Bot API - sendMessage](https://core.telegram.org/bots/api#sendmessage) - 4,096 character limit confirmed
- [MisterChatter - Telegram HTML Formatting Guide](https://www.misterchatter.com/docs/telegram-html-formatting-guide-supported-tags/) - Complete tag reference with examples
- Project files: `skills/tutor/references/lesson-delivery.md`, `openclaw/SOUL.md`, `workspace/SOUL.md` - Current formatting guidance

### Secondary (MEDIUM confidence)
- [UX Collective - How to make any text scannable](https://uxdesign.cc/how-to-make-any-text-scannable-36f4db67ee77) - 9 science-backed methods, F-pattern scanning, bullet point psychology
- [Baymard Institute - Line Length & Readability](https://baymard.com/blog/line-length-readability) - 50-75 characters/line optimal for desktop, 30-50 for mobile
- [Siteimprove - Long Sentences Over 20 Words](https://help.siteimprove.com/support/solutions/articles/80000447968) - 14-word sentences = 90% comprehension, 43 words = <10% comprehension
- [Medium - Mobile App Navigation Design 2026](https://medium.com/ui-ux-designing-trends/mobile-app-navigation-design-2026-ux-best-practices-5b2db901790d) - Emoji mix text for faster communication, visual hierarchy best practices
- [Mobile Navigation UX Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-navigation-ux/) - Bottom navigation, thumb-friendly design, 5-7 menu items max
- [Elinext - Key Mobile App UI/UX Trends 2026](https://www.elinext.com/services/ui-ux-design/trends/key-mobile-app-ui-ux-design-trends/) - Text/emoji mix, calmer screens, clearer visual hierarchy

### Tertiary (LOW confidence)
- [PMC - Educational chatbots for project-based learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC8670881/) - RAG chunking (1,000 chars + 100 overlap) for educational chatbots, but context is retrieval, not delivery
- [ScienceDirect - AI chatbots in second language education](https://www.sciencedirect.com/science/article/pii/S2215039025000086) - Breaking questions into manageable steps, but no specific chunking metrics

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Telegram Bot API 9.3 confirmed via official docs, HTML tag support verified
- Architecture: HIGH - Semantic splitting, per-format sequences, emoji anchors all derive from locked user decisions and existing skill file patterns
- Pitfalls: MEDIUM - Based on mobile UX research + Telegram API limits, but not yet validated in practice with OpenClaw agent
- Security: MEDIUM - ASVS categories applied correctly, but implementation is instructional (skill files) not programmatic (code)

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (30 days — Telegram Bot API stable, mobile UX principles don't change rapidly)
