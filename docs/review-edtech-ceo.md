# EdTech CEO Review — OpenTutor

*Perspective: CEO of a $50M edtech company, 500K students shipped, seen dozens of AI tutor prototypes die. I care about retention, unit economics, competitive moats, and what actually moves the needle on learning outcomes at scale.*

---

## 1. Would I Invest?

**Not yet. But I'd keep watching.**

The Socratic teaching engine is the best I've seen in open-source. The multi-agent pipeline (Researcher → Builder → Critic → Teacher → DeliberatePractitioner) is architecturally elegant and research-grounded. The deliberate practice enforcement with directives (BLOCK/BUMP/DROP/VARY) is a novel idea nobody else has. The hidden per-step assessment is smart — you get accuracy data without interrupting the learning experience.

But this is a teaching engine, not a product. It has zero retention mechanics, zero social features, zero onramp for non-developers, and zero validated learning outcomes. The engineer review identified 3 P0 production bugs. The student review gave progress visibility 3/10 and shareability 2/10. The learning scientist found the accuracy measurement was using word overlap until recently.

I've seen a dozen prototypes with brilliant pedagogy and no product. They all died. The ones that survived were the ones with inferior pedagogy but superior retention — Duolingo is the canonical example. Their learning science is mediocre (gamified multiple choice), but their behavioral psychology is world-class (streaks, leagues, hearts, notifications).

**I'd invest if:** You showed me 30-day retention data from 100 real students, even with a janky product. The teaching quality can compensate for missing features if students actually use it. But you need that data.

---

## 2. The 292 Topics Claim

**Red flag. Cut it to 10.**

292 batch-generated, never-tested, never-student-validated topics is a liability, not an asset. Here's why:

- It creates an illusion of breadth that masks the question: "Is any single topic actually good?"
- The teacher.md files were machine-extracted from metadata, not written by domain experts or validated through teaching.
- Zero of the 292 have been through the full pipeline (Builder → Critic → QA). They were generated before the Critic existed.
- When a student picks "forensic entomology" and the curriculum is incoherent, that's a brand-damaging experience, not a feature.

**What I'd do:** Pick 10 topics that represent different domains (one STEM, one humanities, one practical skill, one creative, etc.). Walk through each one personally as a student. Fix what's broken. Ship those 10. Add topics based on student requests, not batch generation.

The 292 can stay in the repo for completeness, but the onboarding should feature only the curated 10 with a "request a topic" option.

---

## 3. Retention: Day 30, Day 90, Churn Wall

**You have no retention mechanics. This is the single biggest product gap.**

The teaching engine is built for learning. But learning doesn't drive retention — habits do. Here's the churn wall:

- **Day 1-3:** Novelty carries them. The Socratic conversation is new and interesting.
- **Day 4-7:** The novelty wears off. If there's no streak counter, no progress visualization, no social pressure, nothing external motivates showing up. The teaching quality alone doesn't create a habit.
- **Day 14:** This is where Duolingo loses 50% of users even WITH streaks, leagues, and hearts. Without any of that, I'd expect 80%+ churn by day 14.
- **Day 30:** Only the intrinsically motivated survive. Self-selected learners who would have used flashcards anyway.
- **Day 90:** At this point, they've either finished the curriculum or quit. There's no "infinite game" — no new content emerges, no community, no progression beyond the lesson sequence.

**The streaks were just added (computeStreak exists), but there's no visual display, no streak freeze, no celebration milestones, no notification on streak risk.** A streak counter that nobody sees isn't a retention mechanic — it's a database column.

**What I'd build immediately:**
1. Streak counter visible on every lesson start and in /progress
2. Push notification: "Your 7-day streak is at risk — one quick question to keep it"
3. Weekly email summary: "This week you learned X, Y, Z. You're 40% through."
4. End-of-curriculum celebration: "You completed 27 lessons in Auction Theory. Here's what you mastered."

---

## 4. Unit Economics

**Sustainable at current scale. Gets interesting at 10K.**

The engineer review nailed the cost breakdown:
- Standard lesson: ~$0.05 (5 LLM calls)
- Per student/month: ~$2.40 (3 lessons/day)
- At 100 students: ~$240/month
- At 1,000: ~$2,400/month
- At 10,000: ~$24,000/month

That's roughly $0.80/student/month in LLM costs. Duolingo's COGS is about $0.15/user/month. You're 5x more expensive per user, but you're also delivering fundamentally deeper teaching. If you can show that Socratic delivery produces 2x better learning outcomes than multiple choice, the 5x cost is justified.

**The risk is in the pipeline cost.** Generating a new curriculum is 6-12 LLM calls × $0.05-0.20 = $0.30-2.40 per topic. If every student requests a custom topic, that's a cost spike. The 292 pre-built topics amortize this, but custom generation should be rate-limited.

**At 10K users, optimize:**
- Cache lesson plans for students at the same lesson
- Use Haiku for everything except lesson plan generation
- Drop the retrieval quality LLM assessment to a deterministic check for high-volume students

---

## 5. Is the Socratic Cost Worth It?

**Yes, if you prove it.**

The research is strong: the 2025 Eedi/DeepMind RCT showed AI Socratic tutoring matching human tutors. The generation effect (asking before teaching) has robust evidence. The testing effect (retrieval practice) is one of the most replicated findings in cognitive science.

But OpenTutor isn't a research system with controlled conditions. It's a prompt-engineered system where the LLM might generate a garbage question. The learning scientist review was blunt: "When the plan is weak — a recall-level diagnostic, a generic follow-up, a contrived application scenario — the Socratic structure becomes theater."

**The question isn't whether Socratic is better in theory. It's whether this implementation of Socratic is better in practice.** And you can't answer that without measuring outcomes.

**What I'd measure:**
1. Pre/post concept test (5 questions before starting a topic, same 5 after completing it)
2. 7-day delayed retention test (do they remember what they learned a week later?)
3. Compare Socratic vs. single-shot delivery (A/B test on the same curriculum)

If Socratic shows >20% improvement on delayed retention, the 4x cost is a no-brainer. If it's <10%, simplify to 2 LLM calls and invest the savings in retention mechanics.

---

## 6. Competitive Moat

**There is no moat today. But there could be.**

What stops Khan Academy from adding Socratic delivery tomorrow? Nothing technical. Claude/GPT are available to everyone. The prompt engineering is clever but replicable. The curriculum generation pipeline is nice but not defensible.

**Potential moats (in order of defensibility):**

1. **Student data + adaptive model.** If you accumulate enough learning data to build a genuinely predictive student model — knowing which question to ask, in which format, at which difficulty, for which student, at which time — that's a data moat. But you need thousands of students generating millions of interactions. At 0 students, you have 0 moat.

2. **Open-source community.** If OpenTutor becomes the Linux of AI tutoring — the standard that people build on, contribute to, and integrate with — the network effect creates a moat. The 7 platform integrations start making sense in this light. But "open-source moat" requires critical mass of contributors and users. Today it's a solo project.

3. **Curriculum quality.** If the 292 topics were hand-curated, expert-reviewed, and battle-tested with real students, that'd be a content moat. But they're batch-generated and untested. Math Academy's hand-built knowledge graph took years — that's a real moat.

4. **Portability.** "Learn on any platform, any LLM, any topic" is a positioning moat. No competitor offers this. But it's a developer positioning, not a student positioning. Students don't care about portability — they care about "does it work."

---

## 7. Biggest Product Mistake

**Building 7 platform integrations before validating the teaching works with 1 real student on 1 platform.**

This is a classic engineering-led project: the architecture is beautiful, the abstractions are clean, the test coverage is strong, and nobody has learned anything from it yet. You have 5 simulated students but 0 real ones. You have 3 product reviews (learning scientist, student, engineer) but 0 actual student conversations.

The 7 platform integrations (Telegram, Web, Claude Code, Codex, Claude Web, OpenClaw, NanoClaw, NemoClaw, Hermes) are premature optimization. Ship Telegram only. Make it work for 10 real students. Learn what breaks. Then expand.

Every hour spent on the NemoClaw integration README is an hour not spent watching a real student struggle with the Socratic flow and learning what to fix.

---

## 8. First 30 Days with 100 Beta Students

**Week 1: Ship and observe.**
- Deploy Telegram bot with 10 curated topics
- Invite 100 students (find them on Reddit, Discord, university Telegram groups)
- DO NOT touch the code. Watch the logs. Read every conversation. Note every dropout.

**Week 2: Fix what you see.**
- Add streak display (it exists in code, surface it)
- Add "thinking..." message before first LLM call (latency kills)
- Fix the #1 most common failure mode from the logs

**Week 3: Measure.**
- Pre/post concept test for the 3 most popular topics
- Analyze: who dropped off? At which lesson? After which type of question?
- Interview 5 students who quit and 5 who stayed

**Week 4: Iterate.**
- Ship the top 3 improvements from the data
- Add weekly email summary
- Start planning the retention mechanics based on real churn data

---

## 9. What to Measure

In order of importance:

1. **Day-7 retention rate.** What % of students who complete lesson 1 also complete a lesson on day 7? This is your North Star. Target: 30%.

2. **Lesson completion rate.** What % of started lessons are completed (not abandoned mid-conversation)? If students are dropping out after the diagnostic, the questions are bad. Target: >85%.

3. **Delayed concept retention.** Quiz students 7 days after a lesson. Do they remember? This validates the entire Socratic approach. Compare against a control (single-shot content dump).

4. **Question quality score.** Track the hidden assessment scores. What % of diagnostic questions get a score above "partial" on the student's first answer? Low scores mean the questions aren't challenging enough (or the student isn't trying).

5. **Time to first lesson.** How long from "clicks the link" to "answers the first diagnostic question"? Every second of setup is a student lost. Target: <2 minutes for Telegram, <5 minutes for web.

6. **Cost per completed lesson.** Not cost per API call — cost per lesson a student actually finishes. If half of lessons are abandoned, your effective cost doubles.

---

## 10. One Sentence

**This is a research project with product ambitions — the teaching engine is genuinely excellent, but until a real student completes a real curriculum and you can show they learned something, it's an hypothesis, not a product.**

---

## What Would Change My Mind

Show me a cohort of 30 students who completed a 20+ lesson curriculum on OpenTutor with:
- Day-7 retention above 25%
- Pre/post concept test improvement above 30%
- At least 3 students who said "I'd pay for this"

That data turns this from an impressive prototype into a fundable company. Without it, it's an incredibly well-engineered GitHub project that nobody uses.

The good news: everything you need to get that data is already built. The teaching engine works. The deployment infrastructure exists. The Telegram bot is ready. You just need to stop building and start teaching.
