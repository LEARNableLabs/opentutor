# QA Report: category theory
Generated: 2026-08-20

## Verdict: PASS_WITH_WARNINGS
Overall Score: 7.4/10

## Dimensions
- **curriculum-sequencing**: pass (8.5/10)
- **resource-verification**: warn (6.5/10)
- **concept-coverage**: warn (6/10)
- **pedagogical-quality**: warn (7/10)
- **data-integrity**: pass (10/10)

## Critical Issues (verified)
- Broken URL in resources.md line 348: 'https://homotopytype theory.org/book/' contains a literal space between 'homotopytype' and 'theory', causing the link to fail for any user. Fix: change to 'https://homotopytypetheory.org/book/'.

## Warnings
- Exit criteria 6 and 7 promise competence in string diagrams, monoidal categories, and enriched categories ('Read string-diagrammatic proofs', 'translate between enriched-categorical language'), but the curriculum provides only Day 29 previews. The teaching notes explicitly say 'do not develop monoidal category theory' and 'do not develop enriched category theory further.' The exit criteria promise outcomes the curriculum cannot deliver.
- Day 29 packs 9 distinct concepts into a single lesson -- more than double the course average of 4.07. Even with explicit survey framing ('5-8 minutes per direction'), the curriculum.json lists these as formal concepts indistinguishable from mastery-oriented entries, creating a data-representation inconsistency that could mislead a tutor agent.
- Extreme resource monotony: Riehl's PDF appears as the first resource in 28 of 30 lessons with no chapter-specific pointers. The rich, organized resources.md is disconnected from the generic, repetitive resource lists in curriculum.json.
- Three concept-map entries have no corresponding lessons: monadicity/Beck (#30), CCCs/exponentials (#31), and monads as algebraic theories (#27). The first two are arguably advanced, but #27 is required by exit criterion 5.
- Module 2 (Days 7-12, functors and natural transformations) contains zero engagement peaks across 6 days, the longest gap in the curriculum, coinciding with the first difficulty spike at natural transformations (Day 9).
- Module 5 clumps 4 mind-blowing moments into 5 consecutive days (Days 25-29), diluting the impact of each insight.
- Eight lessons sit at exactly 5 concepts each (Days 2, 7, 8, 9, 13, 26, 28, 30), indicating a systematic pattern of density at or above the recommended ceiling.
- SSL certificate mismatch for Kelly enriched category theory reprint at www.tac.mta.ca (cert is for tac.mta.ca without www prefix).
- Dead link: Catsters viewing guide at byorgey.wordpress.com/catsters-guide-2/ returns HTTP 403 Forbidden.
- Video resources appear in only 6 of 30 lesson entries despite resources.md documenting relevant videos for every module.
- Interactive and code resources (Haskell Playground, Catlab.jl, quiver) documented in resources.md are almost entirely absent from curriculum.json lesson entries.
- The 7-day gap between hom-functors/representable functors (Day 17) and the Yoneda lemma (Day 25) creates a hidden retention risk at the curriculum's most demanding point.
- Day 13 loads three interdependent concept-map nodes including the pivotal universal property concept, which the teaching notes identify as 'the single most important idea in the course' and 'the hardest conceptual transition.'
- The co-Yoneda lemma is listed in exit criterion 2 ('derive the co-Yoneda lemma') but receives only incidental mention as one concept among five on Day 26.
- Day 28 title is a dry double-barreled technical label combining two independent constructions, reducing engagement at a critical late-curriculum lesson.

## Fix Plan
1. IMMEDIATE (5 min): Fix broken HoTT URL in resources.md line 348 -- remove the space to make 'https://homotopytypetheory.org/book/'. Fix Kelly URL to 'https://tac.mta.ca/tac/reprints/articles/10/tr10abs.html'. Remove or update dead Catsters viewing guide link.
2. HIGH PRIORITY (30 min): Reword exit criteria 6 and 7 to match actual curriculum depth. Change from competence language ('Read string-diagrammatic proofs', 'translate between enriched-categorical language') to awareness language ('articulate what monoidal and enriched categories are, name concrete examples, and identify where they appear in further study').
3. HIGH PRIORITY (45 min): Split Day 29 into two lessons. Day 29a: monoidal categories, string diagrams, enriched categories (3 concepts with Lawvere metric space OT connection as payoff). Day 29b: topos preview, higher categories, Kan extensions (3 concepts). Adjust Day 30 or compress Module 1 to accommodate.
4. MEDIUM PRIORITY (60 min): Diversify curriculum.json resource lists. Replace generic Riehl PDF link with chapter-specific references. Add Milewski playlist to Days 9-12 and 25-26. Add Catsters to Days 21-24. Add Haskell Playground to Days 7-8 and 27-28. Add quiver to Days 13-19. Link specific Math3ma posts instead of generic category page.
5. MEDIUM PRIORITY (20 min): Add 'monads as algebraic theories' explicitly to Day 27 or 28 concepts. The content is partially present in teaching notes (Day 28 T-algebras example) but needs to be a formal lesson concept to support exit criterion 5.
6. MEDIUM PRIORITY (15 min): Add one mind-blowing moment to Module 2. Best candidate: Day 10 -- 'Eilenberg and Mac Lane invented category theory specifically to formalize natural transformations, not categories.' This fills the 6-day engagement gap.
7. LOW PRIORITY (30 min): Trim concept counts on densest days. Move horizontal composition from Day 9 to Day 10. Move co-Yoneda from Day 26 to standalone treatment. Move coproducts on Day 13 to duality exercise rather than new concept.
8. LOW PRIORITY (15 min): Improve titles for Days 10, 18, 6, and 12 to match the provocative standard set by the rest of the curriculum.
9. DEFERRED: Consider adding CCCs/exponentials (concept 31) as a lesson after adjunctions are established, since the product-exponential adjunction is a natural example. Consider adding ends/coends as a preview alongside Kan extensions.

## Summary
The category-theory curriculum is structurally sound and pedagogically strong at its core. Data integrity is perfect, sequencing forms a valid DAG with no circular dependencies, all referenced resources are real (no hallucinated citations), and the dependency arc through adjunctions (Modules 1-4) is well-designed. One confirmed critical issue remains after adversarial verification: a broken URL with a literal space character. Three originally-critical findings (exit criteria mismatch, Day 29 density x2) were downgraded to warnings by the adversarial check due to mitigating factors (survey framing, limited scope of affected criteria, straightforward fixes). The most consequential structural problem is the gap between exit criteria promises and actual curriculum coverage for monoidal, enriched, and string-diagrammatic material. Twelve additional warnings address resource diversity, concept density patterns, engagement pacing, and missing concept-map entries. None of these block the curriculum from being used, but addressing the top 4-5 items would materially improve the student experience.
