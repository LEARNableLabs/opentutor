# Roadmap: OpenTutor UX Improvements

**Project:** OpenTutor — Telegram Bot UX Improvements
**Milestone:** v1 Student Experience
**Granularity:** Standard (4 phases)
**Created:** 2026-04-09

## Core Value

The student should feel like they're using a polished learning app, not reading a wall of text from a chatbot. Interaction, not just consumption.

## Phases

- [x] **Phase 1: Message Formatting & Chunking** - Readable messages optimized for mobile Telegram
- [x] **Phase 2: Interactive Exercises** - Buttons and polls replace typing for exercises
- [x] **Phase 3: Navigation & Commands** - Slash commands for discovery and control
- [x] **Phase 4: Progress & Feedback** - Personal progress visualization and summaries

## Phase Details

### Phase 1: Message Formatting & Chunking
**Goal**: Students read lessons comfortably on mobile without scrolling fatigue
**Depends on**: Nothing (foundation phase)
**Requirements**: FMT-01, FMT-02, FMT-03
**Success Criteria** (what must be TRUE):
  1. Student receives lessons as 3-4 short messages (max 150 words each), not wall of text
  2. Student can scan a message in 5-10 seconds and extract key concept
  3. Student sees emoji anchors for structure (concept, example, exercise) not decoration
  4. Student reads bold key terms, code-formatted math, bullet-formatted lists
**Plans:** 2 plans
Plans:
- [x] 01-01-PLAN.md — Universal chunking rules and emoji anchor system in lesson-delivery.md
- [x] 01-02-PLAN.md — Platform alignment: openclaw/SOUL.md HTML formatting, SKILL.md and AGENTS.md cross-references
**UI hint**: yes

### Phase 2: Interactive Exercises
**Goal**: Students engage with exercises via taps, not typing paragraphs on mobile
**Depends on**: Phase 1 (readable messages prerequisite for interactive elements)
**Requirements**: EXR-01, EXR-02
**Success Criteria** (what must be TRUE):
  1. Student can answer multiple choice exercises with inline button taps (A/B/C/D)
  2. Student receives immediate feedback after button tap (correct/incorrect + explanation)
  3. Student can take knowledge check quizzes via native Telegram quiz polls with auto-scoring
  4. Student sees escape routes ("Skip this", "Show answer") for stuck moments
**Plans**: TBD
**UI hint**: yes

### Phase 3: Navigation & Commands
**Goal**: Students discover and control lesson flow with slash commands
**Depends on**: Phase 2 (commands complement interactive elements, not replace)
**Requirements**: NAV-01
**Success Criteria** (what must be TRUE):
  1. Student can type `/next` to pull next lesson on-demand
  2. Student can type `/quiz` to trigger review quiz, `/progress` to view status
  3. Student sees command autocomplete menu when typing `/` in Telegram
  4. Student can use `/pause` to stop daily lessons, `/help` to see available commands
**Plans**: TBD
**UI hint**: yes

### Phase 4: Progress & Feedback
**Goal**: Students see where they are, what they've completed, what's next
**Depends on**: Phases 1-3 (progress data accumulated from formatted lessons, interactive exercises, command usage)
**Requirements**: PRG-01
**Success Criteria** (what must be TRUE):
  1. Student can view personal progress summary (% complete, current topic, recent performance)
  2. Student sees non-competitive progress (personal stats, not leaderboard)
  3. Student receives weekly synthesis summary connecting concepts learned
  4. Student understands learning trajectory (topics covered, topics upcoming)
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Message Formatting & Chunking | 2/2 | Complete | 2026-04-10 |
| 2. Interactive Exercises | 1/1 | Complete | 2026-04-10 |
| 3. Navigation & Commands | 1/1 | Complete | 2026-04-10 |
| 4. Progress & Feedback | 1/1 | Complete | 2026-04-10 |

## Dependency Graph

```
Phase 1 (Message Formatting)
    ↓
Phase 2 (Interactive Exercises) — requires readable content
    ↓
Phase 3 (Navigation & Commands) — complements interactive flow
    ↓
Phase 4 (Progress & Feedback) — aggregates data from all prior phases
```

## Coverage Validation

**Total v1 requirements:** 7
**Mapped to phases:** 7
**Unmapped:** 0 ✓

| Requirement | Phase | Category |
|-------------|-------|----------|
| FMT-01 | Phase 1 | Formatting |
| FMT-02 | Phase 1 | Formatting |
| FMT-03 | Phase 1 | Formatting |
| EXR-01 | Phase 2 | Exercises |
| EXR-02 | Phase 2 | Exercises |
| NAV-01 | Phase 3 | Navigation |
| PRG-01 | Phase 4 | Progress |

## Research Flags

**Phase 2 (Interactive Exercises):**
- HIGH PRIORITY: Verify how OpenClaw delivers poll results (votes, correct/incorrect) to agent session
- Test callback_data format for inline keyboard buttons (agent parsing)

**Phase 4 (Progress & Feedback):**
- MEDIUM PRIORITY: If visual charts needed (not text), research chart generation options
- Adaptive difficulty algorithm validation (how to adjust based on quiz scores)

**Phases 1 & 3:**
- No additional research needed (well-documented patterns)

## Implementation Notes

**Deliverables per phase:**
- Skill file updates (SKILL.md, openclaw/SOUL.md, AGENTS.md)
- Configuration changes (openclaw.json flags)
- GitHub issues for code work (tracked but not implemented this milestone)

**Testing approach:**
- Test all changes in Telegram on mobile device (iPhone/Android)
- Verify message chunking at paragraph boundaries (not mid-sentence)
- Validate button interactions and poll result delivery

---
*Last updated: 2026-04-10 — all phases complete*
