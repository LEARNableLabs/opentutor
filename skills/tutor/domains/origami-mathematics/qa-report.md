# QA Report: origami mathematics
Generated: 2026-08-20

## Verdict: PASS_WITH_WARNINGS
Overall Score: 7.2/10

## Dimensions
- **data-integrity**: pass (10/10)
- **curriculum-sequencing**: warn (6/10)
- **resource-verification**: warn (7/10)
- **concept-coverage**: warn (7/10)
- **pedagogical-quality**: warn (7/10)

## Critical Issues (verified)
- Cambridge University Press URL for 'How to Fold It' (https://www.cambridge.org/core/books/how-to-fold-it/9780521145473) returns HTTP 404. Appears in curriculum.json Days 3 and 4 (lines 57, 69) and resources.md line 15. The ISBN is correct but Cambridge Core URLs require a hash identifier, not an ISBN, in the path. Adversarial check confirmed the 404 but severity was reduced to warning since the book is real and the fix is a URL format correction.
- Day 3 teaches Origami Number Fields (Concept 14) before its stated prerequisite Doubling the Cube (Concept 13) is covered on Day 4. The concept map explicitly lists C13 as a dependency of C14 at line 26. Adversarial check confirmed the violation but downgraded severity to warning because (1) teaching notes treat Days 3-4 as a single unit, (2) the hierarchy is stated not fully developed at intermediate level, and (3) Day 3 includes cubic-equation content that informally previews cube-doubling.

## Warnings
- Day 2 teaches Angle Trisection (C12) before Compass-vs-Origami Constructibility (C11) is established on Day 3; concept map lists C11 as a dependency of C12
- Concept #2 (Matrix Representation of Folds) has no dedicated lesson but is a stated dependency for four downstream concepts (#16, #18, #22, #27) and is required for exit criterion 4
- Concept #21 (Rigid Origami Simulation) has no dedicated lesson; only appears as a tool mention on Day 16, four days before rigid origami theory begins on Day 20, yet is a dependency for Days 22-23
- Day 19 is labeled a review day but introduces the fold-and-cut theorem (a mind-blowing concept) alongside 3 other concepts, undermining its consolidation function
- Days 26-27 stack two difficulty-9 spikes back-to-back (NP-hardness, Turing completeness) with no buffer day between them
- Mind-blowing moments cluster at course edges, leaving an 11-day engagement gap from Days 8 through 19 with no designed peak
- Five orphan concepts in lessons (thick-panel origami, random flat-foldable origami, map folding problem, higher-dimensional folding, modular origami mathematics) have no concept map entries
- Demaine-O'Rourke monograph URL points to the general papers page instead of the book-specific GFALOP subpage
- origametry.net has SSL certificate failure making the author site link inaccessible
- Quanta Magazine article description mischaracterizes the article content (describes it as covering Hull and Demaine when it primarily covers Michael Assis's statistical mechanics work)
- Semantic Scholar hash-based URLs could not be independently verified (8 URLs across curriculum and resources)
- Exit criterion 4 requires students to 'derive' kinematic properties but the matrix formalism needed for rigorous derivation is never taught
- Days 3, 4, and 10 have resource sets consisting entirely of academic text with no interactive or video resources
- Days 12 and 28 lack clear exercise paths due to abstract content (categorical duality, Markov chains on MV assignments)
- Day 16 introduces Rigid Origami Simulator tool before rigid origami theory is established in the curriculum

## Fix Plan
1. PRIORITY 1 -- Fix before first delivery: (a) Replace the broken Cambridge URL for 'How to Fold It' with the correct hash-based Cambridge Core URL in curriculum.json Days 3, 4 and resources.md (3 locations). (b) Reorder Module 1 Days 2-4: teach compass-vs-origami constructibility and doubling the cube before angle trisection and the number field hierarchy, so the concept map dependency order is respected.
2. PRIORITY 2 -- Fix before course midpoint: (a) Add Matrix Representation of Folds content (reflection matrices, composition as multiplication) to Day 1 or Day 5, closing the gap for four downstream concepts and exit criterion 4. (b) Add Rigid Origami Simulation as explicit content in the Day 20-21 area, before Days 22-23 which depend on it. (c) Move the fold-and-cut theorem out of Day 19 into its own lesson or into Day 18, restoring Day 19 as a pure review day. (d) Replace the Demaine-O'Rourke URL with https://erikdemaine.org/papers/GFALOP/.
3. PRIORITY 3 -- Fix before second offering: (a) Insert a buffer day between Days 26 and 27 (e.g., a hands-on combinatorial exploration session). (b) Add a designed mind-blowing moment around Day 14-15 (tree method or tessellations) to break the 11-day engagement gap. (c) Add concrete exercises for Days 12 (fold both MV assignments, verify mirror-image states) and 28 (random MV sampling on small patterns). (d) Add concept map entries for the five orphan topics. (e) Fix origametry.net link (replace with Hull's institutional page). (f) Correct the Quanta Magazine article description. (g) Verify Semantic Scholar URLs manually in a browser and consider supplementing with DOI links. (h) Move Rigid Origami Simulator reference from Day 16 to Module 4. (i) Soften exit criterion 4 wording if matrix formalism is not added.

## Summary
The origami-mathematics curriculum (30 lessons, 5 modules, 31 concept map entries) is structurally sound and usable. Data integrity is perfect -- the JSON is well-formed with no missing fields, gaps, or placeholders. Sequencing, coverage, resources, and pedagogy each carry substantive warnings but no confirmed critical defects after adversarial verification. The two originally-critical findings (prerequisite ordering in Days 2-4, and a broken Cambridge URL) were both downgraded to warnings by the adversarial check: the prerequisite violation is contained within a single module and mitigated by the teaching notes grouping Days 3-4 as a unit, and the broken URL is a trivially fixable link-format issue for a book that demonstrably exists. The curriculum can be delivered as-is with instructor awareness of these issues, but addressing the 31 warnings across four dimensions would meaningfully improve the learning experience.
