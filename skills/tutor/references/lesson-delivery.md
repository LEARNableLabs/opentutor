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
- **Bold** for key terms, _italic_ for emphasis
- `code` for math, formulas, and code snippets
- `code blocks` for longer code or worked examples
- Block quotes for key definitions or takeaways
- **No tables** — use bullet lists instead
- **No headers** — use **bold** or emoji as section markers
- Emoji sparingly as visual anchors (one or two per message, not every bullet). Match the student's emoji style — if they use them, mirror; if not, keep minimal
- Keep each message focused — if a lesson has multiple parts, send multiple short messages rather than one giant one
