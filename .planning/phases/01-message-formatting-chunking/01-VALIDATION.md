---
phase: 1
slug: message-formatting-chunking
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual review (no code changes — skill file updates only) |
| **Config file** | none |
| **Quick run command** | `cat skills/tutor/references/lesson-delivery.md` |
| **Full suite command** | `cat skills/tutor/references/lesson-delivery.md openclaw/SOUL.md` |
| **Estimated runtime** | ~5 seconds (file reads) |

---

## Sampling Rate

- **After every task commit:** Read modified file, verify formatting rules present
- **After every plan wave:** Read all modified files, cross-check against CONTEXT.md decisions
- **Before `/gsd-verify-work`:** Full manual review of all skill files for consistency
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | FMT-01 | — | N/A | manual | `grep -c "150" skills/tutor/references/lesson-delivery.md` | ⬜ | ⬜ pending |
| TBD | TBD | TBD | FMT-02 | — | N/A | manual | `grep -c "<b>" skills/tutor/references/lesson-delivery.md` | ⬜ | ⬜ pending |
| TBD | TBD | TBD | FMT-03 | — | N/A | manual | `grep -c "📖\|🧠\|💡\|✏️" skills/tutor/references/lesson-delivery.md` | ⬜ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — no test framework needed for skill file updates.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Lessons chunked to 3-4 messages, max 150 words each | FMT-01 | Skill file prose — agent interprets at runtime | Read lesson-delivery.md, verify chunking rules section exists with word limits |
| HTML formatting tags documented for Telegram | FMT-02 | No code to test — formatting guidance in prose | Read lesson-delivery.md, verify HTML tag guidance (bold, italic, code, pre) |
| Emoji anchors (📖🧠💡✏️) defined as structural markers | FMT-03 | Emoji system defined in prose instructions | Read lesson-delivery.md, verify 4-anchor system documented |
| openclaw/SOUL.md aligned with new anchors | FMT-03 | Cross-file consistency check | Compare openclaw/SOUL.md emoji anchors against lesson-delivery.md |
| Mobile Telegram readability | FMT-01, FMT-02 | Requires real device testing | Deploy to Telegram, read lesson on iPhone/Android, verify no scrolling fatigue |

---

## Validation Sign-Off

- [ ] All tasks have manual verify steps
- [ ] Sampling continuity: every file change reviewed
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
