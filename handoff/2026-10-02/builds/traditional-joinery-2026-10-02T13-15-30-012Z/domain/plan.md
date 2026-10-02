# Traditional joinery: Japanese and Western wood joints. Curriculum plan (revision 3)

## Changes from revision 2 (one per Critic point)
1. **CNC lesson source (now L33).** The Ramage DOI comes out of the CNC lesson's array as its only item. The planned source is Larsson et al., 'Tsugite: Interactive Design and Fabrication of Wood Joints' (UIST 2020), DOI 10.1145/3379337.3415899. This planning pass could not verify that DOI because the planner has no network access, so the swap is **not complete**. The builder must resolve the DOI before adding it. If it fails, L33's array stays empty and its `notes` say: 'No verified source for Tsugite in this build.' Ramage may appear in L33 only as a second item, next to a verified Larsson, and only for the 'engineered timber context' concept.
2. **Dead URLs.** The Takenaka museum URL and the kazi-lab/tsugite GitHub URL move to a 'Search directions' section, which lists title, publisher and search terms with no link. L17 no longer depends on the museum. teacher.md Rabbit Holes must not link the Tsugite editor and should say 'search: Tsugite UIST 2020'. The 'Notes on link use' paragraph is replaced (see Resource Strategy).
3. **Resource coverage.** Every 3D lesson gets a required `notes` field holding a text fallback (spec below), whether or not a visual is found. Anchor URLs (Wood Handbook, UNESCO) go into arrays only after they pass the verification gate.
4. **Unverified or inconsistent sources.** Each one is handled by the verification gate. The earthquake lesson (now L31) states its qualitative label in `notes`. The stray 'Chiba Gakuen / Japan Woodworker' line is deleted. **Accuracy fix:** Ise Jingu is NOT a UNESCO World Heritage site. The correct UNESCO source is the 2020 Intangible Cultural Heritage inscription 'Traditional skills, techniques and knowledge for the conservation and transmission of wooden architecture in Japan'.
5. **Format table.** The lesson map below is the single source of truth. The table is derived from it, and the builder must recount from the final JSON and paste the result into plan.md.
6. **Splice difficulty step.** The two-splice lesson is split, so each splice gets its own lesson. The splice run climbs 3 → 3 → 4 → 5 with no jump larger than 1.
7. **Failure-mode retests.** `failure modes` now appears in every Western and Japanese joint lesson (9–11, 13, 14, 20–23, 26–29) and in reviews 12, 25, 30 and 35.
8. **Sketching.** Sketching is practised at L15, 18, 24 and 34, and in every 3D lesson's fallback step (c).
- Minor: the pull-saw hedge wording is fixed (see Exercise Strategy). teacher.md 'Resource Status' must be rewritten to match this plan word for word: the Larsson status is 'pending verification', not 'done'.

The lessons are renumbered relative to revision 2. Regenerate the JSON from the map below rather than patching it.

## Scope
In scope: wood as an anisotropic, moving material; the forces joints resist; core Western joints (mortise and tenon with draw-bore, through and half-blind dovetail, lap, bridle, basic dado, frame-and-panel); two tool and layout traditions; Japanese splices (tsugi: koshikake ari tsugi, koshikake kama tsugi, okkake daisen tsugi, kanawa tsugi) and connections (shiguchi: nagahozo with komisen, watari ago, sampo zashi); cultural and modern context (Ise rebuilding, the UNESCO ICH inscription, computational joint design).
Out of scope: hands-on workshop technique and safety, finishing, engineering calculations beyond qualitative load paths, stopped and housed dado variants, and half-lap variants.
Prerequisites: a high-school idea of force; willingness to build paper or foam models. No workshop is needed.

## Exit criteria
1. Explain how grain direction and moisture movement constrain joint design.
2. Identify each core joint above and sketch it as an exploded view.
3. State the load each core joint resists and its typical failure mode.
4. Give the assembly direction and order for each core joint.
5. Compare a Western and a Japanese solution to the same structural problem.
6. Separate documented claims from tradition or anecdote (pull saws, earthquake performance).

## Module structure
The order runs material, then mechanics, then joints: you cannot judge a joint without first understanding grain, movement and load. Western joints come before Japanese ones because they are simpler and give a reference vocabulary. Tools sit between the two traditions because the Japanese joints assume Japanese layout methods. Splices come before connections because splices are lower-dimensional (two members on one axis). Context and modern practice come last, once the student can judge claims.

## Lesson map (canonical)
| # | Module | Title (gist) | Type | Diff | 3D/notes |
|---|---|---|---|---|---|
| 1 | Wood as a Material | Why wood splits along the grain | mini-lesson | 2 | |
| 2 | Wood as a Material | Why a glued-down tabletop cracks (movement) | mini-lesson | 2 | |
| 3 | Wood as a Material | What 'seasoned' really means (moisture content) | real-world | 2 | |
| 4 | Wood as a Material | Why end grain will not hold glue | mini-lesson | 3 | |
| 5 | Forces and Failure | What is a joint resisting? (tension, compression, shear, racking) | mini-lesson | 2 | |
| 6 | Forces and Failure | Review: grain, movement, forces | review | 1 | |
| 7 | Forces and Failure | Why beams fail at the bottom (bending and shear) | mini-lesson | 3 | |
| 8 | Forces and Failure | Glue, peg, wedge or nail? | mini-lesson | 3 | |
| 9 | Forces and Failure | Where does this joint break first? | question | 3 | yes |
| 10 | Western Core Joints | Why the mortise and tenon is everywhere | mini-lesson | 3 | yes |
| 11 | Western Core Joints | Why dovetails lock in one direction only | mini-lesson | 3 | yes |
| 12 | Western Core Joints | Review: forces, M&T, dovetail, failure modes | review | 2 | |
| 13 | Western Core Joints | Lap, bridle or dado: which for this load? | question | 3 | yes |
| 14 | Western Core Joints | Why old doors have floating panels | real-world | 3 | |
| 15 | Western Core Joints | Teach-back and sketch: M&T vs dovetail | teach-back | 3 | sketch |
| 16 | Tools and Layout | Why do Japanese saws cut on the pull? | question | 2 | |
| 17 | Tools and Layout | Kanna vs bench plane; chisels | real-world | 2 | |
| 18 | Tools and Layout | Marking gauge vs sumitsubo and sashigane | mini-lesson | 3 | sketch |
| 19 | Tools and Layout | Review: Western joints and tools | review | 2 | |
| 20 | Japanese Splices | Koshikake ari tsugi: what a splice is for | mini-lesson | 3 | yes |
| 21 | Japanese Splices | Which way does a kama tsugi come apart? | question | 3 | yes |
| 22 | Japanese Splices | Okkake daisen tsugi under bending | mini-lesson | 4 | yes |
| 23 | Japanese Splices | Kanawa tsugi: why the wedge? | mini-lesson | 5 | yes |
| 24 | Japanese Splices | Teach-back and sketch: kanawa tsugi | teach-back | 3 | sketch |
| 25 | Japanese Splices | Review: splices, failure modes | review | 2 | |
| 26 | Japanese Connections | Nagahozo with komisen: beam into post | mini-lesson | 3 | yes |
| 27 | Japanese Connections | Watari ago: beams that cross | mini-lesson | 4 | yes |
| 28 | Japanese Connections | Sampo zashi: three beams, one post | mini-lesson | 5 | yes |
| 29 | Japanese Connections | Same load, two traditions | real-world | 4 | |
| 30 | Japanese Connections | Review: connections, comparisons, failure modes | review | 2 | |
| 31 | Joinery Now | Do traditional joints survive earthquakes better? | question | 3 | qualitative label |
| 32 | Joinery Now | Why Ise is rebuilt every 20 years | real-world | 2 | |
| 33 | Joinery Now | Computers designing joints (Tsugite) | mini-lesson | 3 | source status |
| 34 | Joinery Now | Capstone: design and sketch a joint for a given load | teach-back | 4 | sketch |
| 35 | Joinery Now | Final review | review | 3 | |

Concept tags the builder must include: `failure modes` on 9–11, 13, 14, 20–23, 26–30 and 35; `bending and shear` on 7, 22, 26 and 29; `wood movement` on 2, 6, 12 and 14; `assembly direction` on every 3D lesson.

## Format counts (derived from the map)
| Type | Count | Lessons |
|---|---|---|
| mini-lesson | 16 | 1, 2, 4, 5, 7, 8, 10, 11, 18, 20, 22, 23, 26, 27, 28, 33 |
| question | 5 | 9, 13, 16, 21, 31 |
| real-world | 5 | 3, 14, 17, 29, 32 |
| teach-back | 3 | 15, 24, 34 |
| review | 6 | 6, 12, 19, 25, 30, 35 |
| resource-drop | 0 | none, because no resource has been verified yet |
Total: 35. Builder check: the counts recomputed from the JSON must match this table exactly, or this table must be updated.

## Pedagogical decisions
The approach is intuition first and mechanism second: each joint is introduced as an answer to a problem ('this beam is too short', 'this panel will move'). Explanations are qualitative, using load paths and no equations. Spatial reasoning is the main load, so every 3D lesson pairs its explanation with a physical paper or foam model. Japanese terms are introduced with a literal gloss and an English functional name, then used freely. Claims about history and performance are hedged unless a verified source supports them.

## Resource strategy
- **Verification gate.** A URL may enter a lesson's `resources` array, or the 'Cleared' section of resources.md, only after the builder confirms that it resolves and that its content matches the claim. Record the check date. Anything that fails or is not checked goes to 'Search directions' with no URL.
- **Pre-verified:** Ramage et al. 2016 (10.1016/j.rser.2016.09.107), confirmed through OpenAlex in research.md. Context only. Englhardt et al. 2019 (flood risk) is excluded as off-topic.
- **Candidates pending the gate:** USDA FPL Wood Handbook, FPL-GTR-282 (L1–4, L7); Larsson et al. UIST 2020 (L33); the UNESCO ICH 2020 wooden architecture inscription (L32); the Ise Jingu official site (L32; check the year of the next scheduled rebuild before stating it).
- **Search directions only:** the Takenaka Carpentry Tools Museum, and the Tsugite code and editor.
- Replacement text for the resources.md note: 'Only links in Cleared passed the verification check on <date>. Everything in Search directions is unverified; do not present it to students as a link.'
- **Fallback spec (`notes` field, required on 9–11, 13, 20–23 and 26–28):** (a) numbered cut and assembly steps, including assembly direction; (b) a paper or foam model exercise with rough proportions; (c) an exploded-view sketch prompt; (d) a prompt asking where the joint fails first. `notes` is an additive optional string field that the Teacher reads as delivery content.
- **L31 `notes`** must include: 'Label: qualitative; no peer-reviewed source in this build. Present as practitioner and tradition claims.'

## Exercise strategy
The main formats are predict-the-failure, assembly-order puzzles, which-joint-for-this-load choices, sketching from memory and teach-back. Free text is used for reasoning; multiple choice only for vocabulary in reviews. Pull-saw wording is fixed across L16 and teacher.md: 'commonly explained as allowing a thinner blade because it is in tension; treat as a widely repeated explanation, not a settled causal history'.

## Pacing
There are 35 lessons of about 4 minutes each. Reviews fall at 6, 12, 19, 25, 30 and 35, never more than 7 apart. Difficulty rises from 1–3 (L1–19) to 3–5 (L20–28), then settles at 2–4. The peaks are L23 and L28 (difficulty 5); each follows a difficulty-4 lesson and is followed by consolidation (a teach-back or a comparison, then a review).