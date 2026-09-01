# Math Academy Analysis — Principles & Comparison with OpenTutor

## Math Academy's Core Principles

Math Academy (mathacademy.com) is a mastery-based math learning platform built on a knowledge graph with thousands of interconnected topics. Their system was built by Justin Skycak and is described in detail on their [pedagogy page](https://www.mathacademy.com/pedagogy), [how their AI works](https://www.mathacademy.com/how-our-ai-works), and in [The Math Academy Way (PDF)](https://www.justinmath.com/files/the-math-academy-way.pdf).

---

### 1. Knowledge Graph with Prerequisite + Encompassing Relationships

Math Academy uses two overlapping graphs:
- **Prerequisite graph**: determines what a student must master before advancing (knowledge frontier)
- **Encompassing graph**: tracks how advanced topics implicitly exercise simpler subskills

This dual-graph structure means that when a student practices integration by parts, the system knows they're also implicitly practicing algebra, differentiation, and function composition — and updates the spaced repetition schedules of those subtopics accordingly.

**OpenTutor status: Partially implemented.**
We have `concept-map.md` per domain with dependency relationships, and the curriculum has prerequisite fields. But we lack a formal encompassing graph — we don't track which concepts are implicitly practiced when a higher-level concept is exercised. Our spaced repetition treats each concept independently.

### 2. Mastery Learning — No Advancement Without Mastery

Students cannot advance to the next topic until they demonstrate mastery of prerequisites. Mastery means both correctness AND automaticity (speed). The system doesn't move on until the student can execute the skill fluently, not just correctly.

**OpenTutor status: Partially implemented.**
Our BLOCK directive prevents advancement when shaky concepts accumulate. But we don't measure automaticity — only correctness. A student who gets the right answer after 5 minutes of thinking is treated the same as one who answers in 10 seconds. We also don't enforce mastery at the concept level — lessons advance linearly through the curriculum regardless of per-concept mastery.

### 3. Fractional Implicit Repetition (FIRe)

Math Academy's breakthrough: when you practice an advanced topic, spaced repetition credit "trickles down" through the encompassing graph to all subtopics being implicitly exercised. This eliminates redundant reviews — if you just did integration by parts, you don't also need a separate review of basic integration.

The system also handles fractional encompassings — sometimes a subskill is only partially exercised by a higher-level topic. And for struggling students, implicit repetition credit is discarded in favor of explicit reviews.

**OpenTutor status: Missing entirely.**
Our SM-2 system treats every concept as an independent flashcard. There's no concept of implicit practice. If a student demonstrates mastery of a complex concept that encompasses simpler ones, we still schedule separate reviews for the simpler concepts. This is inefficient and creates unnecessary review burden.

### 4. Adaptive Diagnostic Assessment

Students take a 30-45 minute adaptive diagnostic that places them precisely on the knowledge graph — their "knowledge frontier." It identifies both what they know and any gaps in prerequisite knowledge, even from lower levels. The diagnostic measures both correctness and automaticity.

**OpenTutor status: Partially implemented.**
Our onboarding asks about level and interests, and the lesson plan's diagnostic question gauges prior knowledge. But we don't have a comprehensive placement test. A PhD student and a beginner picking the same "intermediate" topic get the same curriculum — the system doesn't know what they already know until they start answering questions.

### 5. Interleaving to Avoid Associative Interference

Math Academy intentionally teaches dissimilar topics in sequence to avoid proactive and retroactive interference. When topics are too similar and taught close together, students confuse them. Math Academy spaces similar topics apart and interleaves reviews from diverse topics.

At two levels:
- **Macro-interleaving**: topic sequencing avoids teaching similar concepts back-to-back
- **Micro-interleaving**: review assignments mix problems from diverse previously-learned topics

**OpenTutor status: Partially implemented (recently improved).**
We now use concept-map-aware interleaving that picks confusable concept pairs instead of random cross-module concepts. But we don't have macro-interleaving — our curriculum is still presented linearly within modules. We don't sequence topics to avoid associative interference. Two similar concepts in the same module are taught back-to-back.

### 6. Automaticity & Cognitive Load Management

Automaticity (executing skills without conscious effort) is a core goal. Math Academy requires students to practice until skills become automatic because this frees working memory for higher-level reasoning. They measure response time, not just correctness.

**OpenTutor status: Missing.**
We don't measure response time. We don't track automaticity. A student who laboriously gets the right answer is treated identically to one who responds instantly. This means our student model can't distinguish "fragile understanding" from "solid mastery."

### 7. Spaced Repetition That Accounts for Knowledge Structure

Standard SM-2 treats items independently. Math Academy's HSRS (Hierarchical Spaced Repetition System) accounts for the knowledge graph structure — implicit practice through encompassing topics, and scheduling that minimizes total review load while maintaining mastery across the graph.

**OpenTutor status: Basic SM-2 only.**
We use standard SM-2 (1987) with no awareness of knowledge structure. Every concept is scheduled independently. No implicit repetition credit. The learning scientist review already flagged this — "SM-2 is from 1987."

### 8. Task Selection Algorithm

Math Academy's task selection is graph-aware: given the student's knowledge profile, it selects the task that maximizes learning efficiency. This might mean learning a higher-level topic that implicitly reviews three due subtopics, rather than reviewing those subtopics individually.

**OpenTutor status: Missing.**
Our "task selection" is simply the next pending lesson in the curriculum. The only deviation is BLOCK/REVISIT directives that force review. We don't optimize for learning efficiency — we don't ask "what single task would advance the most concepts at once?"

---

## Comparison Summary

| Principle | Math Academy | OpenTutor | Gap |
|---|---|---|---|
| Knowledge graph (prerequisites) | Thousands of topics, formal graph | concept-map.md, informal | **Medium** |
| Knowledge graph (encompassing) | Formal encompassing relationships | None | **Critical** |
| Mastery before advancement | Enforced per-concept | BLOCK directive, per-lesson | **High** |
| Automaticity measurement | Response time + correctness | Correctness only | **High** |
| Fractional Implicit Repetition | Full HSRS implementation | None (independent SM-2) | **Critical** |
| Adaptive diagnostic | 30-45 min placement test | Onboarding questions only | **High** |
| Interleaving (macro) | Topic sequencing avoids interference | Linear curriculum within modules | **Medium** |
| Interleaving (micro) | Mixed review from diverse topics | Confusable-pair interleaving (recent) | **Partial** |
| Cognitive load management | Explicit automaticity tracking | Not tracked | **High** |
| Graph-aware task selection | Optimizes for max learning efficiency | Next pending lesson | **Critical** |
| Student knowledge profile | Per-topic mastery on graph | Accuracy trend + engagement | **High** |
| Spaced repetition | Hierarchical (HSRS/FIRe) | Standard SM-2 | **High** |

---

## What OpenTutor Does Better

1. **Socratic delivery**: Math Academy delivers instruction + practice problems. OpenTutor has multi-turn Socratic conversations where the student thinks at every step. Math Academy is more efficient; OpenTutor may produce deeper understanding.

2. **Deliberate practice enforcement**: The DeliberatePractitioner agent that critiques the teaching process is novel. Math Academy optimizes the learning path; OpenTutor also evaluates teaching quality.

3. **Multi-domain flexibility**: Math Academy is math-only. OpenTutor works across 292 topics from any domain. The trade-off is precision — Math Academy's graph is hand-built by domain experts; OpenTutor's concept maps are LLM-generated.

4. **Self-explanation and metacognitive probes**: OpenTutor asks students to explain concepts in their own words and probes metacognition. Math Academy focuses on problem-solving accuracy and speed.

5. **Open-source portability**: OpenTutor runs anywhere — Telegram, web, Claude Code, local models. Math Academy is a proprietary web platform.

---

## Key Differences in Philosophy

- **Math Academy**: learning is skill acquisition. Measure mastery through correctness + speed. Optimize the practice schedule. Trust the knowledge graph to sequence optimally. The system is the expert.
- **OpenTutor**: learning is understanding. Measure comprehension through conversation. Adapt the teaching style. Trust the LLM to generate good questions. The student is an active participant, not a skill-executing machine.

These aren't contradictory — they're complementary. Math Academy's structural rigor (knowledge graph, encompassing relationships, automaticity) can be combined with OpenTutor's conversational depth (Socratic questioning, self-explanation, metacognition).

---

## Prioritized Adoption List

### Priority 1: Must adopt (fundamental to learning efficiency)

1. **Response time tracking** — Add timestamps to student answers. Measure time-to-respond as a proxy for automaticity. A correct answer in 5 seconds signals mastery; a correct answer in 60 seconds signals fragile understanding. Feed into the student model.

2. **Knowledge-structure-aware spaced repetition** — When a student successfully practices a complex concept, give partial credit to the simpler concepts it encompasses. This requires enriching concept-map.md with explicit "encompasses" relationships (not just prerequisites).

3. **Concept-level mastery tracking** — Move from lesson-level tracking to concept-level. Each concept has its own mastery state (not yet seen / learning / fragile / solid / automatic). Lesson advancement requires prerequisite concepts to be at least "solid."

### Priority 2: Should adopt (significant impact)

4. **Adaptive diagnostic on topic start** — When a student adds a topic, instead of jumping to lesson 1, ask 5-10 diagnostic questions to place them on the concept map. Skip concepts they already know. This prevents boring advanced students with basics.

5. **Graph-aware task selection** — Instead of always delivering the next linear lesson, consider: "is there a lesson that would advance AND review simultaneously?" This requires scoring lessons by the number of due concepts they encompass.

6. **Macro-interleaving** — When teaching within a module, don't present highly similar concepts back-to-back. Interleave with a concept from a different module between similar ones.

### Priority 3: Worth considering

7. **Interference detection** — If a student starts confusing two similar concepts, flag them as an "interference pair" and space them further apart in the schedule.

8. **Implicit repetition credit** — When the student succeeds on a complex topic, reduce the review urgency of its subtopics. Full FIRe is complex to implement, but a simplified version (binary "was this subtopic exercised?") captures most of the value.

---

## Sources

- [Math Academy Pedagogy](https://www.mathacademy.com/pedagogy)
- [How Math Academy's AI Works](https://www.mathacademy.com/how-our-ai-works)
- [The Math Academy Way (PDF)](https://www.justinmath.com/files/the-math-academy-way.pdf)
- [Individualized Spaced Repetition in Hierarchical Knowledge Structures — Justin Skycak](https://www.justinmath.com/individualized-spaced-repetition-in-hierarchical-knowledge-structures/)
- [Cognitive Science of Learning: Developing Automaticity — Justin Skycak](https://www.justinmath.com/cognitive-science-of-learning-developing-automaticity/)
- [Cognitive Science of Learning: Minimizing Cognitive Load — Justin Skycak](https://www.justinmath.com/cognitive-science-of-learning-minimizing-cognitive-load/)
- [Cognitive Science of Learning: Interleaving — Justin Skycak](https://www.justinmath.com/cognitive-science-of-learning-interleaving/)
- [Math Academy Review: The Shoe-Tying Method — OpenEd](https://opened.co/blog/math-academy-review-shoe-tying-method)
- [Math Academy Part 5: Product Features — Frank Hecker](https://frankhecker.com/2025/02/12/math-academy-part-5/)
- [Hacker News discussion with Justin Skycak](https://news.ycombinator.com/item?id=39050945)
