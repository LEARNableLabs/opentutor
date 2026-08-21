# Dendrochronology — Teaching Notes

## Approach

Dendrochronology is uniquely **visual and pattern-based** — teach it through images, real core photos, and hands-on measurement rather than abstract theory. The intermediate student needs to develop both the **visual intuition** (recognizing marker years, spotting false rings) and the **statistical rigor** (COFECHA validation, standardization tradeoffs) that distinguish competent dendrochronologists. Balance theory with practice: explain *why* crossdating works, then have students *do* it. Emphasize that dendro is fundamentally a **verification science** — every claim must be independently reproducible.

## Common Misconceptions

1. **"Measuring is the same as dating"** — Students confuse accurate measurement with correct crossdating. The measurement can be precise but dated to the wrong years. Emphasize that crossdating comes *before* measurement matters. Visual skeleton plotting must come first; COFECHA validates, it doesn't create the dating.

2. **"One ring = one year always"** — This is true only after crossdating proves it. Missing rings (especially in stress years) and false rings (from intra-annual drought) violate this. Show examples of both. Explain that the *assumption* of annual rings is what makes crossdating *necessary*, not what makes it *possible*.

3. **"Wider rings mean better years for the tree"** — In moisture-limited sites, yes. In temperature-limited sites (high elevation, high latitude), wide rings may indicate warm-but-dry stress. The sign of the climate response depends on the limiting factor. Always start with site ecology.

4. **"All trees at a site record the same signal"** — Individual tree genetics, microsite variation (shading, soil depth), and competition create noise. That's why we need multiple trees and robust averaging. The "common signal" is what we extract *statistically*, not what we observe in every tree.

5. **"Old trees are better for climate reconstruction"** — Old trees have *long* records, which is valuable, but their age trend is stronger and harder to remove without distorting the climate signal. Young, fast-growing trees often have clearer climate signals. The ideal chronology uses both: old trees for length, young trees for signal strength.

6. **"Standardization removes the age trend and nothing else"** — Every detrending method makes assumptions about what's "trend" vs "signal." Rigid curves (negative exponential) preserve low-frequency climate signals but may retain age trend artifacts. Flexible curves (splines) remove age trend cleanly but also remove long-term climate trends. There's always a tradeoff; students must understand *what* their chosen method assumes.

7. **"COFECHA correlation = proof of correct dating"** — High correlations can occur by chance (short segments), from systematic misdating (off by exactly 10 years across all samples), or from non-climate factors (stand-wide disturbance). Statistical validation is necessary but not sufficient; it must be combined with visual verification and ecological plausibility.

8. **"Dendro works anywhere there are trees"** — Tropical trees with continuous growth, desert trees with episodic growth, and heavily disturbed trees all violate the "one ring per year" assumption. Site selection is critical: need strong seasonality, climate-limited growth, minimal disturbance. Half of dendro is knowing where *not* to sample.

9. **"The pith (center) is required to date a tree"** — Crossdating can work on any segment, even outer bark fragments. The pith tells you tree age, which is nice, but not required for dating. In archaeological samples, you rarely have the pith. Students fixate on finding it when it's often unnecessary.

10. **"Ring width directly measures the climate variable"** — Rings record the *tree's growth response* to climate, mediated by physiology, competition, and lag effects. A drought index reconstruction requires modeling this complex relationship. Raw ring width ≠ raw precipitation. Transfer functions and response functions are essential.

## Level Adjustments

### For Intermediate Students (this curriculum):

- **Depth of statistics** — Teach correlation, t-tests, and regression conceptually with hands-on COFECHA/ARSTAN use. Don't require deriving the math; focus on interpreting outputs and understanding assumptions.
- **Anatomy detail** — Show cellular structure enough to identify ring boundaries and false rings. Don't require memorizing cell types or detailed wood anatomy.
- **Field skills** — Emphasize proper coring technique and site selection principles. Actual field practice is ideal but can be simulated with photos/videos if needed.
- **Software proficiency** — Students should be able to *use* COFECHA and ARSTAN (or dplR in R) to process real data, understand the outputs, and troubleshoot flagged samples. Don't require programming custom analyses.
- **Formalism** — Use equations sparingly; focus on what they *mean* (e.g., "detrending divides observed by expected to get an index") rather than derivations.
- **Breadth** — Cover all major applications (climate, archaeology, ecology, fire) at a survey level. Go deep on one application (climate reconstruction) as the exemplar.

### Compared to Beginner:

Beginners need the "what" and "why" of tree rings (basics of formation, concept of crossdating, climate signals exist). Intermediates need the "how" — hands-on crossdating practice, standardization workflows, critical evaluation of chronology quality.

### Compared to Advanced:

Advanced students should grapple with methodological debates (RCS vs spline, regional curve fitting, blue intensity vs density), design original studies, and critically evaluate published reconstructions. Intermediates use established methods and understand their assumptions, but don't yet innovate or critique the methods themselves.

## Rabbit Holes (Fascinating Connections)

1. **The Stradivarius mystery** — Legendary violin tone linked to Maunder Minimum (Little Ice Age) wood density. Dendro dated the wood and showed growth during an exceptionally cold period. Drops into Lesson 23 (dating violins).

2. **Bristlecone pines as climate archives** — The oldest living trees (5000+ years) and longest continuous tree-ring chronologies (9000+ years). These trees live in such harsh environments they're nearly immortal. Mention during Lesson 10 (species/site selection) or Lesson 18 (how far back can we go).

3. **The 1628 BC volcanic eruption** — Dendro found a global frost ring event, constraining the Minoan Thera eruption date and challenging archaeological chronologies built on pottery styles. Shows dendro as an *independent* dating method that can overturn other evidence. Drop into Lesson 16 (pointer years and volcanic forcing).

4. **Hidden fire history of the American West** — Dendro revealed that "pristine wilderness" actually burned every 5-15 years before fire suppression. This revolutionized forest management. Discuss in Lesson 22 (fire scars and fire regimes).

5. **Medieval megadroughts** — Decades-long droughts in the western US during the Medieval period, far worse than modern droughts, revealed through tree-ring reconstructions. Drop into Lesson 19 (PDSI reconstruction) as motivation for why paleoclimate matters for water planning.

6. **Tree rings and the Antonine Plague** — Using dendro climate data to understand pandemic spread in the Roman Empire. Cross-disciplinary history/climate/epidemiology. Mention in Lesson 21 (archaeological applications) or Lesson 16 (extreme events).

7. **The "divergence problem"** — Recent ring widths in some high-latitude sites fail to track warming temperatures as expected. A major scientific mystery involving tree physiology, climate change, and reconstruction methods. Advanced topic, but mention in Lesson 17 (asymmetric signals) or Lesson 25 (isotopes as a solution).

8. **Shipping timber across empires** — Using dendro to trace the origin of wood in Viking ships or Roman buildings, revealing ancient trade networks. Connects to Lesson 23 (artifact dating).

## Difficulty Progression Notes

- **Lessons 1-4** (Difficulty 1-3): Gentle introduction to ring formation and species/site selection. Accessible but building foundational concepts.
- **Lessons 5-6** (Difficulty 2-3): Introduce crossdating — the core skill. Difficulty rises because this is cognitively demanding (pattern matching).
- **Lesson 7**: Review break. Consolidate sampling and measurement workflow.
- **Lessons 8-10** (Difficulty 3-4): Peak difficulty in crossdating module — COFECHA statistics and teach-back application. Students are doing real crossdating.
- **Lessons 11-13** (Difficulty 3-4): Standardization is conceptually challenging (tradeoffs, frequency domain thinking).
- **Lesson 14**: Review break. Consolidate chronology building.
- **Lessons 15-18** (Difficulty 3-4): Climate signal extraction — response functions and reconstruction principles. Moderate sustained difficulty.
- **Lesson 19** (Difficulty 5): Peak challenge — full reconstruction exercise. This is the integration of everything so far.
- **Lesson 20**: Review break before applications module.
- **Lessons 21-24** (Difficulty 2-3): Applications are conceptually easier — applying known methods to new contexts. Engaging and accessible.
- **Lessons 25-27** (Difficulty 4-5): Advanced methods ramp up again — isotopes and wood anatomy are cutting-edge and conceptually demanding.
- **Lesson 28** (Difficulty 4): Final integration — design a study. Challenging but with scaffolding from prior lessons.

## Assessment Strategies

### Formative (during lessons):

- **Visual quizzes** — Show ring images, ask students to identify boundaries, false rings, marker years
- **COFECHA interpretation** — Give flagged outputs, ask students to diagnose the problem
- **Skeleton plot practice** — Have students create plots from ring width series and match them
- **Concept checks** — "Explain why we standardize" or "What does EPS measure?" in their own words

### Summative (end of modules):

- **Module 2 (Crossdating)**: Provide 3 undated cores and a master chronology. Students must cross-date and validate with COFECHA. Report the calendar dates and flagged issues.
- **Module 3 (Chronologies)**: Given raw measurements, build a chronology using ARSTAN or dplR. Explain detrending choices and interpret chronology statistics.
- **Module 4 (Climate)**: Reconstruct a climate variable for a region using provided chronology and climate data. Explain calibration/verification, interpret results, discuss uncertainties.
- **Final (Lesson 28)**: Design a dendro study to answer a real question (student's choice of climate, archaeology, or ecology). Specify site, species, sampling strategy, methods, expected challenges. This tests integration of all concepts.

### Skills to Verify:

1. Can the student accurately identify ring boundaries in photos?
2. Can they cross-date a new sample against a master chronology?
3. Can they run COFECHA and interpret flagged segments?
4. Can they explain the tradeoffs in detrending method choice?
5. Can they interpret chronology statistics (EPS, Rbar, mean sensitivity)?
6. Can they design a sampling strategy for a specific question?
7. Can they critically evaluate the quality and limitations of a tree-ring dataset?
