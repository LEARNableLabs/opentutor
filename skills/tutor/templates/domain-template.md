# Domain Template

Use this template when generating a new domain for a student. Each domain lives in `skills/tutor/domains/<topic-slug>/` and contains four files.

## Directory Structure

```
domains/<topic-slug>/
├── curriculum.json        # Lesson sequence (see references/curriculum-format.md)
├── concept-map.md         # How concepts connect and depend on each other
├── resources.md           # Curated books, videos, tools, people
└── teaching-notes.md      # Domain-specific pedagogical guidance
```

## How to Generate

When a student picks a new topic:

1. **Research** — use web search/fetch to find good syllabi, MIT OCW, textbooks, courses
2. **Assess the student** — use their level from `USER.md` and the topic-specific assessment from onboarding
3. **Generate all four files** using the templates below
4. **Register the topic** — add the topic slug to `active_topics` in `progress.json`

## File Templates

### curriculum.json

See `references/curriculum-format.md` for the full schema. Key points:
- Aim for 20-40 lessons per topic
- Each lesson = one core concept, ~3-5 minute read
- Map prerequisites — warn if background might be missing
- Include review days every 5-7 lessons

### concept-map.md

```markdown
# <Topic> — Concept Map

## Core Concepts (in learning order)

1. **<Concept A>** — <one-line description>
2. **<Concept B>** — <one-line description>. Depends on: A
3. **<Concept C>** — <one-line description>. Depends on: A, B
...

## Dependencies

- <Concept B> requires understanding <Concept A> because ...
- <Concept D> builds on <Concept B> and <Concept C> because ...

## Prerequisite Topics

- <External topic 1> — needed for <which concepts>
- <External topic 2> — needed for <which concepts>
```

### resources.md

```markdown
# <Topic> — Resources

## Primary Sources (for lesson content)

- **<Textbook/Course>** — <what it covers>, <why it's good for this student's level>
- **<MIT OCW / Stanford / etc.>** — <specific course>, <relevant modules>

## Supplementary (for engagement)

- **Videos** — <specific channels, series, or episodes>
- **Interactive tools** — <Desmos, GeoGebra, specific simulators>
- **Code** — <repos, notebooks, playgrounds>
- **People** — <researchers, practitioners to look up>
- **Unexpected connections** — <cross-discipline links for wild cards>
```

### teaching-notes.md

```markdown
# <Topic> — Teaching Notes

## Approach

<2-3 sentences on how to teach this topic at the student's level. What makes this topic unique pedagogically? Is it visual, algebraic, proof-heavy, experiment-driven?>

## Common Misconceptions

1. **<Misconception>** — <why students get this wrong>, <how to correct it>
2. **<Misconception>** — <why students get this wrong>, <how to correct it>
3. ...

## Level Adjustments

<Notes on how this topic's delivery differs at the student's specific level vs. other levels. What to emphasize, what to skip, what depth of formalism to use.>

## Rabbit Holes

- <Fascinating connection 1> — <when to drop this in>
- <Fascinating connection 2> — <when to drop this in>
```
