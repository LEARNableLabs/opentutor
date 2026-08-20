# QA Report: mathematics of juggling
Generated: 2026-08-20

## Verdict: PASS_WITH_WARNINGS
Overall Score: 7.2/10

## Dimensions
- **curriculum-sequencing**: warn (6/10)
- **resource-verification**: warn (7/10)
- **concept-coverage**: warn (7/10)
- **pedagogy**: warn (7/10)
- **data-integrity**: pass (10/10)

## Critical Issues (verified)
None

## Warnings
- Day 5 introduces synchronous siteswap notation (concept 23) before its prerequisite juggling states (concept 10, Day 7). No follow-up lesson exists to formalize this concept later, unlike multiplex notation which gets formal treatment on Day 11.
- Day 5 introduces multiplex notation basics (concept 24) before prerequisites juggling states (Day 7) and (b+1)^p counting theorem (Day 9). The concept map requires state-model extensions and matrix methods for multiplex enumeration.
- Day 5 resource URL https://jugglingedge.com/software/jlab/anim.php returns HTTP 404. The correct working URL is https://jugglingedge.com/help/siteswapanimator.php (already listed correctly in resources.md).
- Day 7 introduces ground/excited state classification (concept 12) before its dependency on state transition graphs (concept 11, Day 8). Understanding why the ground state is 'ground' requires the graph structure taught the next day.
- The teaching notes identify the Module 3 to Module 4 transition (Days 18-19) as 'the hardest transition in the course' and explicitly recommend a full Markov chain review lesson, but the curriculum omits it. Day 19 jumps directly into random juggling models.
- Primitive sequences (concept 17) are assigned to Phase 3 (Permutations and Descents) in the concept map but taught in Module 2 (Day 10), creating a structural mismatch.
- Iris Siteswap Juggling Animator URL (iris.joshua-becker.com) is unreachable (ECONNREFUSED), likely permanently offline.
- PassingDB simulator URL returns HTTP 500 Internal Server Error.
- UCSD mathweb PDFs have SSL certificate verification failures, affecting resources for 8 lesson days (Days 2, 6, 10, 12, 17, 18, 24, 29).
- All 6 Semantic Scholar paper URLs return blank pages without JavaScript, affecting resources for 10 lesson days. No fallback direct-PDF or DOI links are provided.
- Exit Criterion 8 requires explaining the positroid-Grassmannian correspondence, but the teaching notes prescribe only survey-level treatment and only one day (Day 28) covers both concepts. The exit criterion overshoots the curriculum's actual depth.
- Universal juggling cycles (concept 21) is placed on Day 30 despite prerequisites being met by Day 10 -- a 20-day gap. It competes with open problems for attention on the final day. Teaching notes recommend surfacing it around Days 12-14.
- Rook polynomials on Ferrers boards (Day 23) is an orphan concept with no entry in the concept map and no dependency tracking. Teaching notes advise against including advanced technical material in Module 4.
- Mind-blowing moments are clumped at Days 1-9 and 21-28, leaving a 12-day engagement gap in the middle third (Days 10-20) despite rabbit holes being available in the teaching notes.
- Day 25 introduces braid groups with three dense concepts and no topology scaffolding, despite the concept map noting topology is 'not explicitly covered in prior coursework' and needs in-course introduction.
- Days 15 and 21 each have only one resource link. If the single Semantic Scholar URL fails (known JS-rendering issue), those lessons have no backup resource.

## Fix Plan
1. PRIORITY 1 -- Fix before first lesson delivery: (a) Replace broken Day 5 URL jugglingedge.com/software/jlab/anim.php with the verified working URL jugglingedge.com/help/siteswapanimator.php. (b) Restructure Day 5 to restrict synchronous and multiplex content to visual simulator exploration only, deferring formal notation. Label Day 5 multiplex content as 'preview only' and ensure Day 11 provides full formal treatment. For synchronous siteswap, either add a formal lesson after Day 7 or accept informal-only coverage. (c) Soften Exit Criterion 8 from 'Explain the correspondence between bounded affine permutations and positroid varieties' to 'State what bounded affine permutations are and describe at a high level why they index cells of the Grassmannian' to match the survey-level depth prescribed by the teaching notes.
2. PRIORITY 2 -- Fix before course starts: (a) Insert a Markov chain bridge lesson between Days 18 and 19, covering state spaces, transition matrices, and stationary distributions using a non-juggling example, then connecting to the existing state transition graph. Shift Days 19-24 to Days 20-25. (b) Move universal juggling cycles from Day 30 to Day 12 or early Module 3, where prerequisites are fresh and the de Bruijn sequence analogy connects naturally to state graph traversal. Reserve Day 30 for open problems only. (c) Reorder Days 7-8 so state transition graphs (concept 11) precede ground/excited state (concept 12), or consolidate both into a two-day sequence that introduces them together. (d) Either add rook polynomials to the concept map as concept 30a with documented dependencies, or replace the Day 23 concept with deeper treatment of Ayyer-Bouttier-Corteel-Nunzi product formulas already in concept 30.
3. PRIORITY 3 -- Fix when convenient: (a) Add direct PDF or DOI fallback links alongside every Semantic Scholar URL (6 papers, 10 lesson days affected). For Warrington, the arXiv link math/0302257 already exists and should be added. (b) Find mirror or Wayback Machine copies of the UCSD mathweb PDFs to work around SSL certificate failures (8 lesson days). (c) Remove the Iris animator entry from resources.md (confirmed offline) and flag PassingDB as unreliable, noting Juggling Lab as a passing-pattern alternative. (d) Surface teaching-notes rabbit holes in the Days 10-20 engagement gap: universal juggling cycles teaser around Day 12-14, 'every knot is a juggling pattern' motivational aside around Day 15. (e) Split Day 25 into two lessons -- one for intuitive braid group introduction, one for the Devadoss-Mugno construction -- or reduce to two concepts and defer the construction. (f) Add a second resource to Days 15 and 21 (Polster textbook DOI for Day 15, Warrington MoMath lecture for Day 21). (g) Resolve primitive sequences phase mismatch by either moving to Module 3 or updating the concept map. (h) Improve lesson titles for Days 14 and 27 to match the question-as-provocation pattern used elsewhere.

## Summary
The 30-day mathematics-of-juggling curriculum is structurally sound with a clean dependency DAG, consistent concept density (2.5-2.8 per day), well-placed review days, and fully valid data integrity. All academic references are verified as real published works with no fabricated sources. However, no dimension except data-integrity passes cleanly. The two originally critical findings (Day 5 prerequisite violations and a broken URL) were both downgraded to warnings after adversarial verification, leaving zero confirmed critical blockers -- but 16 warning-level findings across four dimensions require attention before the curriculum is ready for student use. The most impactful issues are: Day 5 introducing formal notation before its prerequisite concepts exist, a missing Markov chain bridge lesson that the teaching notes themselves recommend, and Exit Criterion 8 demanding depth the curriculum explicitly does not deliver. All issues are fixable without restructuring the curriculum's overall 5-module, 30-day architecture.
