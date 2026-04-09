# Requirements: OpenTutor UX Improvements

**Defined:** 2026-04-09
**Core Value:** The student should feel like they're using a polished learning app, not reading a wall of text from a chatbot.

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Formatting

- [ ] **FMT-01**: Lessons are chunked into 3-4 short messages (max 150 words each)
- [ ] **FMT-02**: Messages use HTML formatting (bold, italic, code blocks) optimized for mobile Telegram
- [ ] **FMT-03**: Emoji used as structured visual anchors, not decoration

### Exercises

- [ ] **EXR-01**: Multiple choice and quick-response exercises use inline keyboard buttons
- [ ] **EXR-02**: Knowledge checks use native Telegram quiz polls with auto-scoring and explanations

### Navigation

- [ ] **NAV-01**: Bot responds to slash commands: /next, /quiz, /progress, /topics, /help

### Progress

- [ ] **PRG-01**: Student can view personal progress summary (text-based, non-competitive)

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Exercises

- **EXR-03**: Exercises include escape routes (skip, show answer, hint buttons)
- **EXR-04**: Multi-step exercises with state tracking across messages

### Navigation

- **NAV-02**: Commands registered via setMyCommands (visible in bot menu)
- **NAV-03**: Deep linking for sharing specific lessons

### Engagement

- **ENG-01**: Weekly summary with concept connections
- **ENG-02**: Adaptive pacing based on engagement signals
- **ENG-03**: Mood-aware tone adjustment

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full bot implementation (code/deploy) | Issues only for this milestone — code is a separate milestone |
| Other platforms (CLI, web) | Telegram-first; skill files stay platform-agnostic |
| Real-time features (live quizzes, multiplayer) | Too complex for v1 UX pass |
| Web/mobile app | Telegram is the interface |
| Leaderboards/streaks/badges | Anti-feature — creates anxiety, encourages completion over mastery |
| Group chat features | Out of scope for 1:1 tutoring |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FMT-01 | — | Pending |
| FMT-02 | — | Pending |
| FMT-03 | — | Pending |
| EXR-01 | — | Pending |
| EXR-02 | — | Pending |
| NAV-01 | — | Pending |
| PRG-01 | — | Pending |

**Coverage:**
- v1 requirements: 7 total
- Mapped to phases: 0
- Unmapped: 7 ⚠️

---
*Requirements defined: 2026-04-09*
*Last updated: 2026-04-09 after initial definition*
