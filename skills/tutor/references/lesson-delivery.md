# Lesson Delivery

## Daily Delivery Modes

### Cron (the spark)

The cron job fires 3x/day and delivers a short prompt (~5 min read) to start a conversation:

1. Read `progress.json` to find the next lesson and any weak spots
2. Read the curriculum file to get lesson details
3. Deliver a bite-sized piece: a concept intro, an exercise, a question, or a resource
4. Invite the student to respond — "give it a try" / "what do you think?" / "reply when you're ready"

The cron is a conversation starter, not the whole lesson.

### Chat (the real lesson)

When the student replies, the real learning happens live:

- Give immediate feedback on their answers
- Go deeper if they're curious, simplify if they're stuck
- Use the deliberate practice principles — target weaknesses, stay in the stretch zone
- Update `progress.json` after the conversation with what happened (engagement, struggles, breakthroughs)
- The conversation can be as short or long as the student wants

### Audio

Some discussions may happen via voice. Same principles apply — keep it conversational, give feedback, adapt to their level.

## Lesson Structure

Each daily lesson should be:

1. **~3-5 minute read** — short enough to do with morning coffee
2. **One core concept** — don't cram multiple ideas
3. **Build on yesterday** — brief callback to previous lesson
4. **Concrete example** — show, don't just tell
5. **End with engagement** — question, exercise, or teaser for tomorrow

## Message Chunking

Every lesson is delivered as a sequence of short messages, not a single wall of text. Each message focuses on one pedagogical section.

### Splitting Rules

- **Split by pedagogical section** — each section (hook, concept, example, exercise) becomes its own message. Never split by arbitrary word count or fixed template.
- **Soft cap: ~150 words per message** — aim for 150 words, but finishing a thought clearly is more important than hitting a number. Exceeding to ~200 words is fine if splitting mid-thought would hurt clarity.
- **Minimum 2 messages per lesson** — every lesson must feel multi-message. Even simple formats ("just a question") get at least 2 messages.
- **Target 3-4 messages for standard lessons** — mini-lessons typically use 4 messages (hook, concept, example, exercise). Other formats use 2-3.

### Overflow Handling

When a section exceeds the soft cap:

1. Check if there's a natural paragraph boundary to split at
2. If yes — split into two messages with the same emoji anchor
3. If no — keep as one message (clarity over strict limits)
4. **Exception:** Code blocks are always kept whole, even if they exceed 150 words. Splitting code breaks syntax. Code blocks are visually distinct and don't create "wall of text" fatigue.

### Engagement Rule

Every lesson's final message must end with an engagement prompt — an exercise, a question, or a teaser for tomorrow. Never end with "That's it for today!" The conversation loop must stay open.

## Emoji Anchors

Four emoji are used as structural anchors at the start of each message. They signal content type, not decoration.

| Emoji | Role | When to Use |
|-------|------|-------------|
| 📖 | Title / progress | First message of every lesson. Format: "📖 Day N/total - Topic -- callback. Today: teaser?" |
| 🧠 | Core concept | Concept explanation messages. Definitions, principles, key ideas. |
| 💡 | Example | Examples, analogies, real-world illustrations. |
| ✏️ | Exercise | Exercises, problems, engagement prompts. |

### Rules

- **One anchor per message** — place the emoji at the very start of the message, before any text
- **No decorative emoji** — do not use party, sparkles, fire, or other emoji for personality. Personality comes from text, not emoji
- **Consistent meaning** — the same emoji always means the same thing. Students learn to scan by anchor
- **Every message gets an anchor** — no lesson message should lack its structural emoji

## Format Variations

Don't deliver the same style every time. Rotate through these formats. Each has its own message sequence template.

### Mini-Lesson (4 messages)

The most common format. Concept + example + exercise.

**Sequence:** 📖 Hook → 🧠 Concept → 💡 Example → ✏️ Exercise

- **Message 1 (📖 Hook):** Title, day progress, callback to yesterday's lesson, teaser for today's topic. Format: "📖 Day N/total · Topic — Yesterday we [callback]. Today: [teaser]?"
- **Message 2 (🧠 Concept):** Core definition or principle. 1-3 short paragraphs. Bold key terms. Keep under 150 words.
- **Message 3 (💡 Example):** Concrete analogy or real-world illustration. Make abstract ideas tangible.
- **Message 4 (✏️ Exercise):** Problem, question, or prompt. Must invite a reply. Format: "✏️ [problem] — [instruction]. Reply with your answer."

### Just a Question (2 messages)

A thought-provoking question to chew on. Low-pressure, high-curiosity.

**Sequence:** 📖 Hook → 🧠 Question

- **Message 1 (📖 Hook):** "📖 Day N/total — Quick one today..."
- **Message 2 (🧠 Question):** "🧠 Think about this: [thought-provoking question]?" The question should be open-ended and connect to upcoming material.

### Resource Drop (3 messages)

Share a video, article, book, or tool. Give context for why it matters.

**Sequence:** 📖 Hook → 💡 Resource → ✏️ Follow-up

- **Message 1 (📖 Hook):** "📖 Day N/total — Time for a different perspective..."
- **Message 2 (💡 Resource):** "💡 [resource description]: [link]. [Why it's valuable — 1-2 sentences]."
- **Message 3 (✏️ Follow-up):** "✏️ After [engaging with resource], tell me: [reflection question]?"

### Teach-Back (3 messages)

Student explains a concept in their own words. Tests deep understanding.

**Sequence:** 📖 Hook → ✏️ Prompt → 🧠 Scaffolding

- **Message 1 (📖 Hook):** "📖 Day N/total — Let's see if you can explain this..."
- **Message 2 (✏️ Prompt):** "✏️ Explain [concept] in your own words. Pretend you're teaching it to someone who's never heard of it."
- **Message 3 (🧠 Scaffolding):** "🧠 Hint: Start with [anchor point]. Then connect it to [related concept from previous lesson]."

### Real-World Challenge (3 messages)

Hands-on problem. Coding exercise, calculation, or practical application.

**Sequence:** 📖 Hook → ✏️ Challenge → 💡 Hint

- **Message 1 (📖 Hook):** "📖 Day N/total — Ready for a tricky one?"
- **Message 2 (✏️ Challenge):** "✏️ [hard problem statement]. Take your time."
- **Message 3 (💡 Hint):** "💡 Stuck? Think about [hint]. Or reply 'skip' and I'll show you the solution."

### Rules for All Formats

- **Final message must have an engagement prompt** — exercise, question, or teaser for tomorrow. No dead-end messages.
- **Minimum 2 messages** — even the shortest format (question) uses 2 messages.
- **Each message gets one emoji anchor** — placed at the start, signaling content type.
- **Adapt, don't rigidly follow** — these are templates, not scripts. If the content naturally calls for an extra message or a different anchor order, that's fine. The spirit is structured variety, not mechanical repetition.

## Interactive Exercises

When the platform supports it (e.g. Telegram), exercises should be interactive — taps, not typing.

### Multiple Choice (Inline Buttons)

For exercises with a clear correct answer, present options as tappable buttons instead of asking the student to type.

**Structure:**
- 2x2 grid of answer choices (A/B/C/D)
- Bottom row: escape routes ("Show hint", "Skip")
- Correct answer encoded in callback data for immediate feedback

**When to use:** Concept checks, quick recall, "which of these is correct?" questions.

**When NOT to use:** Open-ended questions, teach-back exercises, creative prompts. These need typed responses — buttons would reduce thinking.

### Quiz Polls

For review days and knowledge checks, use native quiz polls (auto-scored by the platform).

**Structure:**
- Question text (clear, specific)
- 4 options (one correct)
- Explanation shown after answering (why the answer is correct)
- Non-anonymous (so progress can be tracked)

**When to use:** Review days, weekly summaries, spaced repetition checks.

### Self-Assessment Polls

For gauging confidence, use regular polls (no right/wrong answer).

**Structure:**
- "How confident do you feel about [concept]?"
- 3 options: confident (move on) / mostly clear (one more example) / still fuzzy (revisit)

**When to use:** After introducing a new concept, after review sessions.

### Escape Routes

Every interactive exercise must include at least one escape route:
- **"Show hint"** — reveal a clue without giving the full answer
- **"Skip"** — mark as skipped, move on (tracked in progress for later revisit)
- **"Show answer"** — give up and see the solution with explanation

Escape routes prevent frustration. A stuck student who can't move forward will disengage.

### Feedback After Interaction

After the student taps an answer:
- **Correct:** Brief confirmation + why it's right. "Exactly! [1-sentence reinforcement]"
- **Incorrect:** Kind correction + explanation. "Not quite — [explanation]. The key is [concept]."
- **Hint requested:** Give a nudge, not the answer. "Think about [related concept from earlier]."
- **Skipped:** No judgment. "No worries — we'll come back to this. [Move to next message]."

## Review Days

Every 5-7 lessons, insert a review:

- Quick recap of key concepts from the past week
- 3-5 questions mixing recent and older material
- Identify weak spots → adjust upcoming lessons
- Keep it light — "pop quiz, don't panic"

## Weekly Summary

On Fridays (or Sundays), deliver a recap:

- What concepts were covered this week
- How they connect to each other and to previous weeks — draw the thread between concepts
- One thing to revisit if it was shaky
- A teaser for next week

Use a `<blockquote>` for the connecting narrative — it should read like a story, not a list.

## Progress Visualization

When the student asks for progress (or `/progress`), show:

### Text Progress (always available)

- Topic name and day count: "Linear Algebra — Day 6/20"
- Progress bar: `▓▓▓▓▓▓░░░░░░░░░░░░░░ 30%`
- Lesson list with status markers: ✅ done, 🔄 current, ⬜ upcoming
- Stats: streak, quiz accuracy, lessons completed
- Weak spots: concepts flagged for revisit with scheduled day

### Visual Progress Card (when platform supports images)

When the platform can send images, generate a visual progress card showing:
- Progress bar with percentage
- Dot timeline of lessons (green = done, blue = current, grey = upcoming)
- Stat boxes: streak, quiz accuracy, lessons done
- Weak spot callout

Keep it personal and non-competitive — no leaderboards, no comparisons. The only benchmark is the student's own trajectory.

## Resources & Research

Be creative with resources — anything that keeps the student engaged is fair game:

- **Videos** — lectures, 3Blue1Brown, YouTube explainers, documentaries
- **Books** — textbooks, pop-science, even fiction that touches the topic
- **Articles & blogs** — longform essays, blog posts, Twitter threads
- **Code** — GitHub repos, interactive notebooks, playgrounds, tutorials
- **Music** — songs about math, algorithmic compositions, music theory connections
- **Movies & TV** — "watch this scene from Interstellar, it's actually about geodesics"
- **Art & visual** — museum exhibits, generative art, data visualizations
- **Podcasts** — relevant episodes, interviews with researchers
- **Interactive tools** — Desmos, GeoGebra, online simulators, sandboxes
- **People** — "look up this researcher, their work is fascinating"

The best resource is the one the student actually engages with. A perfect textbook they won't open is worse than a mediocre YouTube video they'll watch twice. Match the medium to the student's energy and interests.

## Formatting

Lessons are delivered via messaging channels (Slack, Telegram, WhatsApp, etc.). Keep formatting readable across platforms:

- **Scannable** — bullets and short paragraphs, no walls of text
- **Bold** for key terms and definitions
- _Italic_ for emphasis and variables
- `code` for math, formulas, inline code, and symbols
- `code blocks` for longer code or worked examples
- Block quotes for key definitions or takeaways
- **No tables** — use bullet lists instead (tables render poorly on mobile messaging apps)
- **No headers** — use **bold** or emoji anchors as section markers
- Keep each message focused on one section — use the chunking rules above
- Follow the emoji anchor system — one structural emoji per message (see Emoji Anchors section above)
