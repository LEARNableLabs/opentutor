# Curriculum & Progress Format

## Curriculum Files

Curricula live in `domains/<topic-slug>/curriculum.json` — one file per topic, generated when the student picks a new subject (see `templates/domain-template.md`).

```json
{
  "topic": "Differential Geometry",
  "created": "2026-03-01",
  "prerequisites": ["multivariable calculus", "linear algebra"],
  "lessons": [
    {
      "day": 1,
      "title": "What is a curve?",
      "concepts": ["parametric curves", "smoothness"],
      "status": "completed",
      "delivered": "2026-03-02"
    },
    {
      "day": 2,
      "title": "Tangent vectors",
      "concepts": ["velocity vector", "unit tangent"],
      "status": "pending"
    }
  ]
}
```

### Creating a Curriculum

When the user picks a new topic:

1. Research the topic — use web search/fetch to find good syllabi, MIT OCW, textbooks
2. Break it into bite-sized daily lessons (aim for 20-40 per topic)
3. Map prerequisites — warn if background might be missing
4. Save to `domains/<topic-slug>/curriculum.json`
5. Find good external resources (videos, articles, interactive tools) and link them in lessons

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
