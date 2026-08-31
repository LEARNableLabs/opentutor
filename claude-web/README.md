# OpenTutor — Claude Web (Projects) Setup Guide

Use OpenTutor as a Claude Project on claude.ai. Upload the skill and reference files as project knowledge — Claude becomes your tutor in the web interface.

## Prerequisites

- A Claude Pro, Team, or Enterprise account (Projects require paid plans)

## Step 1 — Create a project

1. Go to [claude.ai](https://claude.ai)
2. Click **Projects** in the sidebar → **New Project**
3. Name it "OpenTutor" (or any name)

## Step 2 — Upload skill files as project knowledge

Upload these files to the project's knowledge base:

**Required:**
- `skills/tutor/SKILL.md` — teaching methodology and routing
- `skills/tutor/references/teaching-method.md` — deliberate practice principles
- `skills/tutor/references/lesson-delivery.md` — delivery format rules
- `skills/tutor/references/curriculum-format.md` — curriculum JSON schema
- `workspace/IDENTITY.md` — tutor persona
- `workspace/SOUL.md` — teaching style

**For a specific topic** (pick one to start):
- `skills/tutor/domains/<topic>/curriculum.json`
- `skills/tutor/domains/<topic>/teaching-notes.md`
- `skills/tutor/domains/<topic>/concept-map.md`
- `skills/tutor/domains/<topic>/resources.md`

## Step 3 — Set the project instructions

Paste this into the project's custom instructions:

```
You are OpenTutor — a warm, sharp study buddy. Follow the teaching methodology in SKILL.md. Deliver lessons from the uploaded curriculum. Use the teaching-notes and concept-map to inform your approach.

Session flow:
1. Check where the student left off (ask if first session)
2. Deliver one concept at a time — brief explanation, then a question
3. Wait for the student to answer before continuing
4. Give feedback, then move to the next concept
5. End each session with a summary of what was covered

Rules:
- One question at a time
- Keep explanations to 2-3 paragraphs max
- Reference real sources from the resources file
- Match exercise style to the domain (see teaching-notes)
- Track which lessons are completed across conversations
```

## Step 4 — Start learning

Open the project and chat:

```
Let's start! What's my first lesson?
```

## How it works

- Claude reads the uploaded files as context for every conversation in the project
- No code runs — Claude follows the methodology from SKILL.md and delivers lessons conversationally
- The 292 pre-built curricula each have all the files needed; upload the set for the topic you want
- For multiple topics, upload multiple curriculum.json files (Claude can distinguish by topic field)

## Limitations

- No automated pipeline — the Builder/Critic loop doesn't run in Claude Web (it requires code execution)
- No persistent `learning.md` — Claude doesn't write files. Session continuity comes from conversation history within the project.
- No spaced repetition scheduling — no cron or state persistence
- Best for: single-topic deep dives using pre-built curricula

## Tips

- Upload the `research.md` file too for richer source citations
- Upload `teacher.md` if it exists for the topic — it tells Claude how to teach that specific domain
- For a new topic not in the 292 pre-built set, ask Claude to generate a curriculum following `curriculum-format.md`, then continue from there
