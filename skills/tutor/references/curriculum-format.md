# Curriculum & Progress Format

## Curriculum Files

Curricula live in `domains/<topic-slug>/curriculum.json` — one file per topic, generated when the student picks a new subject (see `templates/domain-template.md`).

```json
{
  "topic": "Differential Geometry",
  "slug": "differential-geometry",
  "created": "2026-03-01",
  "student_level": "intermediate",
  "prerequisites": ["multivariable calculus", "linear algebra"],
  "exit_criteria": ["parametrize curves and compute Frenet frames", "..."],
  "lessons": [
    {
      "lesson": 1,
      "module": "Curves in Space",
      "title": "What is a curve?",
      "concepts": ["parametric curves", "smoothness"],
      "difficulty": 2,
      "type": "mini-lesson",
      "resources": ["https://..."],
      "status": "completed",
      "delivered": "2026-03-02"
    },
    {
      "lesson": 2,
      "module": "Curves in Space",
      "title": "Why does curvature measure how hard a road turns?",
      "concepts": ["curvature", "osculating circle"],
      "difficulty": 3,
      "type": "real-world",
      "resources": ["https://..."],
      "status": "pending"
    }
  ]
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `lesson` | int | Sequential lesson number (1-indexed, unique across the curriculum) |
| `module` | string | Module name this lesson belongs to |
| `title` | string | Engaging question or provocation — never a topic label |
| `concepts` | string[] | 2-4 key concepts introduced or practiced |
| `difficulty` | int (1-5) | Cognitive load: 1=review/light, 2=accessible, 3=standard, 4=challenging, 5=peak difficulty |
| `type` | string | Delivery format: `mini-lesson`, `question`, `resource-drop`, `teach-back`, `real-world`, `review` |
| `resources` | string[] | URLs to external resources |
| `status` | string | `pending`, `completed`, or `skipped` |
| `delivered` | string? | ISO date when delivered (set at runtime) |

### Sizing Guidelines

Let the material dictate the curriculum size — don't force every topic into the same shape.

- **Lesson count** — as many as needed, typically 15-35. A narrow topic (origami mathematics) might need 22; a broad one (category theory) might need 35. Don't pad to fill a target or cut to meet one.
- **Modules** — group by coherent subtopic. 3-7 is typical but not a rule.
- **Prerequisites** — list what's genuinely needed. Could be 3, could be 10.
- **Exit criteria** — list what the student can actually do after finishing. Match the ambition to the material, not to a count.

### Creating a Curriculum

When the user picks a new topic:

1. Research the topic — use web search/fetch to find good syllabi, MIT OCW, textbooks
2. Break it into bite-sized daily lessons — let the material dictate the count
3. Assign difficulty (1-5) and delivery type per lesson
4. Map prerequisites — warn if background might be missing
5. Save to `domains/<topic-slug>/curriculum.json`
6. Find good external resources (videos, articles, interactive tools) and link them in lessons

### Adapting

- If the student breezes through → combine lessons or go deeper
- If they struggle → split into smaller pieces, add review days
- Every 5-7 lessons → schedule a **review day** (spaced repetition)
- Update the curriculum file as you adapt

## Progress Tracking

Progress lives in `tutor/progress.json`:

```json
{
  "active_topics": ["differential-geometry"],
  "schedule": {
    "time": "08:00",
    "timezone": "America/New_York",
    "days": ["mon", "tue", "wed", "thu", "fri"]
  },
  "history": [
    {
      "date": "2026-03-02",
      "topic": "differential-geometry",
      "lesson": 1,
      "engagement": "answered correctly",
      "notes": "already knew parametric curves"
    }
  ]
}
```

Track:

- Which lesson they're on per topic
- How they responded (struggled, breezed through, asked good questions)
- What to review next
