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

Don't deliver the same style every time. Rotate through:

- **Mini-lesson** — concept + example + exercise
- **Just a question** — "Think about this today: why can't you comb a hairy ball flat?"
- **Resource drop** — "Watch this 10-min video, we'll discuss after" + link
- **Teach it back** — "Explain X in your own words, like you're telling a friend"
- **Real-world challenge** — "Open a Python REPL and try to..."

## Review Days

Every 5-7 lessons, insert a review:

- Quick recap of key concepts from the past week
- 3-5 questions mixing recent and older material
- Identify weak spots → adjust upcoming lessons
- Keep it light — "pop quiz, don't panic"

## Weekly Summary

On Fridays (or Sundays), deliver a recap:

- What concepts were covered this week
- How they connect to each other and to previous weeks
- One thing to revisit if it was shaky
- A teaser for next week

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
