# Organic Chemistry — Reaction Mechanisms: Curriculum Plan (Revision 2)

## Revision Summary (Critic point → fix)
- **Dead Mayr–Patz Wikipedia URL** → removed. Lesson 10 now cites Mayr & Patz (Angew. Chem. Int. Ed. Engl. 1994), Mayr, Kempf & Ofial (Acc. Chem. Res. 2003) and one canonical Mayr database URL. Use `https://www.cup.lmu.de/oc/mayr/reaktionsdatenbank2/` in lessons 10 and 29 and in resources.md. The builder must check that it is live and fall back to `/reaktionsdatenbank/` only if it is not. Use the same URL in all three places.
- **Mayr accuracy risk** → Mayr N/s_N/E is limited to its validated scope: nucleophiles reacting with carbocations, Michael acceptors and other π-electrophiles. Nucleophile ranking for SN2 uses Swain–Scott n (methyl substrates). The exit criterion has been rewritten to match, and the student must be able to say where Mayr's equation does *not* apply.
- **Overloaded lessons and the '3–5 minute' claim** → the curriculum grows from 35 to 56 lessons and each lesson has one core concept. The time budget is now explicit: a 3–5 minute read plus a 10–20 minute exercise, under 25 minutes in total. An ordinary lesson's exercise is capped at one mechanism of 3 steps or fewer. Multi-step synthesis is kept for reviews and the capstone, and the capstone may run over two sessions.
  - Curtin–Hammett moves out of Module 1 and is taught with conformational equilibria (lesson 14).
  - Hammond gets its own lesson, separate from TS vs intermediate and the rate-determining step.
  - E2 geometry is split from Zaitsev/Hofmann/E1/E1cB.
  - Rearrangements, NGP and cation cascades are now separate lessons.
  - KIE is split from labeling and crossover. Hammett is split from trapping, and radical clocks move to the radical-cyclisation lesson (the 5-hexenyl clock fits naturally there).
  - The cumulative review is separate from the capstone.
- **Coverage gaps** → new lessons cover:
  - hydride and Grignard addition (22)
  - acetals plus the anomeric effect (23)
  - imines and enamines (24)
  - hydroboration (18), epoxidation and epoxide opening (19), oxymercuration and halohydrins (17)
  - ozonolysis via the 1,3-dipolar lesson (40)
  - pinacol/semipinacol (15)
  - radical addition, anti-Markovnikov HBr and NBS (35)
  - Bu3SnH, radical cyclisation and Baldwin's rules (36)
  - Lewis-acid-catalysed Diels–Alder (39); 1,3-dipolar vs [2+2] (40)
  - [1,n] sigmatropic H shifts (44)
  - organometallic electron counting (46) and elementary steps (47) before the Suzuki cycle (48)
  - a mid-level evidence-design practice lesson (53)
- **Pericyclic difficulty spike** → the module now opens with a polyene π-MO and FMO refresher (38), then Diels–Alder through FMO (39), then 1,3-dipolar/[2+2] (40). The general Woodward–Hoffmann lesson (41, difficulty 5) only comes after that ramp. The vitamin D example is now supported by the [1,n] shift lesson.
- **Review difficulty inconsistency** → every review is difficulty 2–3. Only the capstone (56) is difficulty 5.
- **Text-only exercise notation** → there is now a fixed arrow, intermediate and energy-diagram notation with deterministic checks (see Exercise Strategy).
- **Truncated key gates** → there are six explicit gates, each with a remediation branch (see Gates).
- **Resources** → there are no bare homepage or course-level links:
  - ChemTube3D and MIT OCW are only linked at specific animation or lecture pages, and dropped if no such page exists.
  - Every lesson cites a textbook chapter (Clayden 2e, Grossman, Anslyn & Dougherty, Fleming).
  - Evidence lessons cite primary literature.
  - The ML lesson is updated to Molecular Transformer (2019), the Clever Hans and bias analyses, and the 2026 ChemPro benchmark.
  - Wikipedia makes up no more than 30% of URLs.
- **Spaced repetition** → every non-review lesson ends with one carry-over question taken from at least two modules back.
- **Real-world alignment** → aspirin is in lesson 25, the biological Claisen (thiolase / fatty-acid synthase) in 28, ibrutinib's acrylamide warhead in 29, vitamin D in 44 and chorismate mutase in 45.
- **Accuracy nits** →
  - The endo rule is taught as contested: secondary orbital interactions vs sterics, electrostatics and distortion/interaction.
  - HSAB is labelled a heuristic. The cuprate mechanism note mentions Cu(III) intermediates.
  - Vitamin D is described as a photochemical 6π conrotatory ring opening followed by a thermal antarafacial [1,7]-H shift.
  - The 2-norbornyl nonclassical ion moves to NGP (16) and the lanosterol cascade to review 20, so they no longer overload one lesson.
- **Lesson 28 resource-drop was underpowered** → the [3,3] lesson (45) is now a mini-lesson with a stereochemical-prediction exercise.
- **Bias** → the curriculum adds Fukui (FMO), Suzuki, Negishi, Huisgen, Bertozzi (strain-promoted azide–alkyne click, lesson 40), Abigail Doyle (Ni catalysis and ML yield prediction, lessons 48 and 54), Frances Arnold (enzymatic carbene transfer, a rabbit hole) and List/MacMillan (enamine organocatalysis, lesson 24). It also covers green chemistry: earth-abundant Ni/Fe catalysis (48) and tin toxicity with silane or photoredox alternatives (36). Sulfur mustard (16) is taught with historical and ethical context and the link to nitrogen-mustard chemotherapy.

## Scope
**In scope:**
- Polar mechanisms: substitution, elimination, alkene addition, carbonyl, aromatic.
- Radical chain, addition and cyclisation.
- Thermal and photochemical pericyclic reactions (selection rules only).
- Elementary organometallic steps and Pd cross-coupling.
- Mechanistic evidence: KIE, crossover, labeling, trapping, radical clocks, Hammett.
- Critical reading of ML reaction prediction.

**Out of scope** (mentioned only as rabbit holes):
- Beckmann and Baeyer–Villiger.
- Wittig: only the oxaphosphetane, shown as a [2+2]-like ring in lesson 40.
- Carbenes.
- Heterocycle-specific chemistry.
- Asymmetric catalysis.
- Photochemistry beyond selection rules.
- C–H activation.
- Polymerisation.
- Enzymology beyond named examples.

## Prerequisites
- Two semesters of undergraduate organic chemistry (functional groups, nomenclature, basic reactions).
- Stereochemistry and cyclohexane conformational analysis.
- General chemistry kinetics and thermodynamics (ΔG, ΔG‡, rate laws).
- Aromaticity and Hückel's 4n+2 rule.
- Basic MO theory. Polyene π MOs are refreshed in lesson 38.
- Oxidation states. d-electron and 18-electron counting is taught in lesson 46, but prior exposure helps.
- Basic NMR/IR, used for evidence lessons.

## Exit Criteria
By the end, the student can:
1. Write complete, charge-balanced arrow mechanisms (5 steps or fewer) in the course text notation for polar, radical, pericyclic and Pd-catalysed reactions.
2. Predict SN1/SN2/E1/E2/E1cB outcomes from substrate, nucleophile or base, solvent and conformation, including Curtin–Hammett cases.
3. Rank SN2 nucleophiles with Swain–Scott n. Estimate relative rates of nucleophiles with carbocations and Michael acceptors using Mayr N/s_N/E, and state where the Mayr equation is not validated (e.g., SN2 at sp3 carbon).
4. Distinguish concerted from stepwise alkene additions and predict regiochemistry and stereochemistry.
5. Draw acid- and base-catalysed carbonyl mechanisms (hydride/Grignard, acetal, imine/enamine, acyl substitution, enolate, aldol/Claisen, conjugate addition) with correct proton bookkeeping.
6. Use FMO and Woodward–Hoffmann rules to classify cycloadditions, electrocyclic reactions and sigmatropic shifts under thermal and photochemical conditions.
7. Count electrons and oxidation states at metal centres and trace a Suzuki cycle through its elementary steps, including competing transmetalation pathways.
8. Design and interpret mechanistic experiments (KIE, crossover and labeling, trapping, radical clocks, Hammett ρ).
9. Critique ML reaction-prediction claims for dataset bias and Clever Hans effects.

## Module Structure (56 lessons, 8 modules)
The sequence moves from principles, to polar sp3 chemistry, to π systems (alkene, then carbonyl, then arene), then radicals, pericyclic reactions, metals and finally evidence. Each module reuses tools from earlier ones: energy diagrams, FMO, pKa and the Hammond postulate.

| # | Title (question form) | Core concepts | D | Type |
|---|---|---|---|---|
| 1 | Where do the electrons actually go? | arrow grammar, course notation, resonance ≠ equilibrium | 2 | mini-lesson |
| 2 | Why do some bonds attack and others wait? | HOMO/LUMO, π*/σ* acceptors | 3 | mini-lesson |
| 3 | Which proton moves first? | pKa as compass, leveling | 2 | question |
| 4 | Is that bump a transition state or an intermediate? | energy diagrams, rate-determining step | 3 | mini-lesson |
| 5 | What does a transition state look like? | Hammond postulate | 3 | question |
| 6 | Fast product or stable product? | kinetic vs thermodynamic control (butadiene + HBr) | 3 | real-world |
| 7 | Review: principles | — | 2 | review |
| 8 | Why must SN2 attack from behind? | backside attack, σ*, Walden inversion | 3 | mini-lesson |
| 9 | When does carbon let go first? | SN1, ion pairs, hyperconjugation | 3 | mini-lesson |
| 10 | Strong base or good nucleophile? | nucleophilicity vs basicity, solvent, Swain–Scott n, Mayr N/E (scoped) | 4 | question |
| 11 | Why must the H and leaving group be antiperiplanar? | E2 geometry, cyclohexane axial requirement | 4 | mini-lesson |
| 12 | Which alkene wins, and by which path? | Zaitsev/Hofmann, E1, E1cB | 3 | question |
| 13 | Review: SN/E competition (GATE B) | — | 3 | review |
| 14 | Can the minor conformer make the major product? | Curtin–Hammett (menthyl vs neomenthyl chloride) | 4 | mini-lesson |
| 15 | Why do carbocations rearrange? | hydride/alkyl shifts, Wagner–Meerwein, pinacol/semipinacol | 4 | real-world |
| 16 | When does a neighbour do the work? | NGP, bridged ions, sulfur mustard (ethics), 2-norbornyl | 4 | teach-back |
| 17 | Open cation or bridged ion? | HX Markovnikov, bromonium anti addition, halohydrin, oxymercuration | 3 | mini-lesson |
| 18 | How does boron go the 'wrong' way? | hydroboration, concerted 4-centre TS, syn addition | 4 | question |
| 19 | Why does a peracid deliver oxygen in one step? | butterfly TS, epoxide opening under acid vs base | 4 | mini-lesson |
| 20 | Review: concerted vs stepwise (lanosterol cascade rabbit hole) | — | 3 | review |
| 21 | From which angle does a nucleophile hit C=O? | Bürgi–Dunitz, hydrates/hemiacetals, reversibility | 3 | mini-lesson |
| 22 | Why is hydride/Grignard addition a one-way street? | NaBH4, LiAlH4, RMgX, Schlenk equilibrium, SET debate | 3 | question |
| 23 | How many proton transfers make an acetal? (GATE C) | acid-catalysed bookkeeping, oxocarbenium, anomeric effect | 4 | mini-lesson |
| 24 | Why do imines form fastest at pH ≈ 4–5? | imine/enamine, pH–rate profile, organocatalysis | 4 | question |
| 25 | Does the tetrahedral intermediate really exist? | acyl substitution, leaving-group ranking, ¹⁸O labeling, aspirin | 3 | real-world |
| 26 | Review: carbonyl additions | — | 3 | review |
| 27 | Which enolate forms, and why does LDA care? | kinetic vs thermodynamic enolates (callback to 6) | 4 | mini-lesson |
| 28 | How do cells build fatty acids with a Claisen? | aldol, Claisen, thiolase/FAS decarboxylative Claisen | 4 | real-world |
| 29 | 1,2 or 1,4? | Michael addition, HSAB (heuristic), cuprates (Cu(III)), Mayr E, covalent drugs | 4 | question |
| 30 | Review: enolates and conjugate addition | — | 3 | review |
| 31 | How does a benzene ring survive attack? | EAS, arenium ion | 3 | mini-lesson |
| 32 | Why are halogens deactivating yet o/p-directing? | directing effects | 3 | teach-back |
| 33 | Why is fluoride the best leaving group here? | SNAr, Meisenheimer complex, Sanger's reagent, benzyne contrast | 4 | question |
| 34 | Why is Br• picky and Cl• not? | radical chain, BDE, Hammond selectivity | 3 | mini-lesson |
| 35 | How do peroxides flip HBr's regiochemistry? | radical addition, NBS allylic bromination | 4 | question |
| 36 | Why do 5-exo radicals close so fast? | Bu3SnH, cyclisation, Baldwin's rules, 5-hexenyl clock | 4 | mini-lesson |
| 37 | Review: aromatic and radical | — | 3 | review |
| 38 | What do butadiene's π orbitals look like? (GATE D) | polyene π MOs, FMO (Fukui) | 3 | mini-lesson |
| 39 | Why does Diels–Alder prefer endo, and is the reason settled? | FMO, endo controversy, Lewis-acid catalysis | 4 | real-world |
| 40 | Why do dipoles click but two alkenes refuse? | 1,3-dipolar (Huisgen), ozonolysis/Criegee, thermal [2+2] forbidden, ketenes, SPAAC | 4 | real-world |
| 41 | One rule for every pericyclic reaction? | Woodward–Hoffmann, suprafacial/antarafacial, 4n/4n+2, Möbius–Hückel | 5 | mini-lesson |
| 42 | Heat twists one way, light the other | electrocyclic conrotatory vs disrotatory | 4 | question |
| 43 | Review: cycloaddition and electrocyclic | — | 3 | review |
| 44 | How does sunlight make vitamin D? | [1,5] vs [1,7]-H shifts, antarafacial, 7-dehydrocholesterol | 4 | real-world |
| 45 | How does a chair TS transfer chirality? | Cope/Claisen [3,3], chorismate mutase | 4 | mini-lesson |
| 46 | How many electrons does that palladium own? (GATE E) | oxidation state, dⁿ, 18-electron rule, L/X ligands | 3 | mini-lesson |
| 47 | What can a metal do to a bond? | oxidative addition, reductive elimination, migratory insertion, β-H elimination | 4 | question |
| 48 | What does the base actually do in Suzuki coupling? | transmetalation (oxo-Pd vs boronate), evidence, Ni/Fe alternatives | 5 | real-world |
| 49 | Review: sigmatropic and organometallic | — | 3 | review |
| 50 | Why does C–D break slower? | primary/secondary KIE, zero-point energy | 4 | mini-lesson |
| 51 | Did the fragments swap partners? | crossover, isotopic labeling, trapping | 4 | question |
| 52 | What does a ρ value tell you about the TS? | Hammett σ/ρ, nonlinear plots | 4 | mini-lesson |
| 53 | How would you prove it? (GATE F) | designing an evidence plan | 3 | teach-back |
| 54 | Do reaction-prediction models learn chemistry? | Molecular Transformer, dataset bias, Clever Hans | 3 | resource-drop |
| 55 | Cumulative review | — | 3 | review |
| 56 | Capstone: an unseen mechanism | synthesis of all modules | 5 | question |

Reviews fall at 7, 13, 20, 26, 30, 37, 43, 49 and 55, so the gaps are 4–7 lessons.

## Pedagogical Decisions
- **Principle first, catalogue never.** Every reaction is derived from HOMO/LUMO, pKa, sterics and stereoelectronics, never memorised.
- **Arrow-pushing in almost every lesson,** written in the course notation. Each lesson has one core concept, so the student does one mechanism and does it carefully.
- **Error-spotting exercises** recur. Each targets a teaching-notes misconception: resonance vs equilibrium, basicity vs nucleophilicity, carbocations being 'just unstable', TS vs intermediate, stable vs fast product, pericyclic reactions drawn stepwise, F⁻ in SNAr, primary KIE.
- **Contested science is taught as contested:**
  - endo selectivity
  - SET vs polar Grignard addition
  - HSAB as a heuristic
  - nonclassical ions, presented historically
  - transmetalation pathways
- **Spaced retrieval:** each non-review lesson ends with one carry-over item from at least two modules back. Kinetic vs thermodynamic control (6) returns in enolates (27). Hammond (5) returns in radical selectivity (34). Bridged ions (16) return in bromonium (17). FMO (2) returns in lesson 38.

## Exercise Strategy
**Canonical text notation.** It is defined in lesson 1 and enforced by teacher.md.
- Number the heavy atoms in the given structure (C1, O2, …).
- Two-electron arrow: `source → sink`.
  - The source is `lp(O2)`, `π(C1=C3)` or `σ(C4–Br5)`.
  - The sink is an atom (`C1`) or a forming bond (`C1–O2`).
- Fishhook (one-electron) arrow: `half: σ(C–Br) → Br`.
- After each step, give the intermediate as SMILES with explicit charges.
- Every step ends with a check line: `net charge in = out; valence OK; each arrow starts at electrons`.

**Energy diagrams** are written as an ordered list, e.g. `R(0) → TS1(+22) → I(+9) → TS2(+14) → P(−6)`, with kcal/mol or qualitative ranks. ASCII sketches are allowed. A photo upload is accepted where the channel supports it, but the list is the form that gets graded.

**Deterministic checks the Teacher must run:**
- charge conservation
- no hypervalent carbon
- every arrow source holds electrons
- SMILES parses, if given
- stereodescriptors are consistent

**Formats:**
- Free-text Socratic for mechanisms.
- Multiple choice or ranking is allowed for pKa ordering, leaving-group or nucleophile ranking, mechanism-class diagnosis (reviews), and selection-rule tables.
- Teach-backs at 16, 32 and 53.
- Evidence-design prompts at 51–53 and 56.

## Gates and Remediation
| Gate | Lesson | Pass | Remediation |
|---|---|---|---|
| A | 4–5 | Can place TS vs intermediate and apply Hammond | Insert a remediation mini-lesson that draws the SN1 energy diagram, then repeat 5 |
| B | 13 | At least 70% correct on SN/E sorting | Re-run 10–12 with fresh substrates before 14 |
| C | 23 | Correct proton bookkeeping (PADPED) | Insert a PADPED drill lesson before 24 |
| D | 38 | Can sketch the butadiene and hexatriene HOMO/LUMO | Insert a Hückel MO drawing lesson before 39 |
| E | 46 | Correct oxidation state and dⁿ count for 3 complexes | Insert a counting drill before 47 |
| F | 53 | Proposes 2 or more discriminating experiments | Insert an evidence-design repeat before 56 |

A failed gate makes the DeliberatePractitioner emit **BLOCK** on that concept. Inserted remediation lessons use suffix numbering (e.g. 23R) so the main numbering stays stable.

## Resource Strategy
Each lesson gets 1–3 resources. Every URL must be checked live by the builder.

**Link rules:**
- No bare homepages (ChemTube3D, MIT OCW).
- Link specific animation pages: ChemTube3D SN2, E2, Diels–Alder, Claisen rearrangement and EAS.
- Link MIT OCW only at the level of a specific lecture or problem-set page, and drop it if none exists.
- Wikipedia makes up no more than 30% of URLs.
- Cite papers by DOI.

**Textbook map** (builder to confirm chapter numbers against the edition):
- Clayden 2e chapters:
  - Ch 5, 7 → lesson 1
  - Ch 8 → 3
  - Ch 12 → 4–6
  - Ch 15 → 8–10
  - Ch 17 → 11–12
  - Ch 16 → 14
  - Ch 36 → 15–16
  - Ch 19 → 17–19
  - Ch 6, 9, 11 → 21–24
  - Ch 10 → 25
  - Ch 20, 25, 26 → 27–28
  - Ch 22 → 29, 33
  - Ch 21 → 31–32
  - Ch 37 → 34–36
  - Ch 34–35 → 38–45
  - Ch 40 → 46–48
  - Ch 39 → 50–53
- Grossman, *The Art of Writing Reasonable Organic Reaction Mechanisms*:
  - Ch 1 → lesson 1
  - Ch 2–3 → polar modules
  - Ch 4 → pericyclic
  - Ch 5 → radicals
  - Ch 6 → metals
- Anslyn & Dougherty: energy surfaces chapter for 4–5 and 14; experiments chapter for 50–53; pericyclic chapter for 41.
- Fleming, *Molecular Orbitals and Organic Chemical Reactions*, for 2 and 38–42.

**Primary literature:**
- Lesson 3: Evans pKa table.
- Lesson 10: Swain & Scott (JACS 1953), Mayr & Patz (ACIE 1994), Mayr–Kempf–Ofial (Acc. Chem. Res. 2003).
- Lesson 14: Seeman (Chem. Rev. 1983).
- Lesson 36: Baldwin (J. Chem. Soc. Chem. Commun. 1976).
- Lesson 39: García, Mayoral & Salvatella (Acc. Chem. Res. 2000) on secondary orbital interactions.
- Lesson 48: Carrow & Hartwig (JACS 2011) on transmetalation, the open-access Organic Chemistry Portal Suzuki page, and Miyaura & Suzuki (Chem. Rev. 1995) as historical context only.
- Lesson 50: Simmons & Hartwig (ACIE 2012).
- Lesson 52: Hansch, Leo & Taft (Chem. Rev. 1991).
- Lesson 54: Schwaller et al. Molecular Transformer (ACS Cent. Sci. 2019); Kovács, McCorkindale & Lee on bias and interpretability (Nat. Commun. 2021); Ahneman et al. (Science 2018) with the Chuang & Keiser comment as a Clever Hans case study; ChemPro benchmark (arXiv 2602.03108, 2026); Wei, Duvenaud & Aspuru-Guzik (2016) as history only.

**research.md:** most of the API hits are off-topic (pentacene junctions, Venus atmosphere, Senegal archaeology, LAMMPS) and must not be cited. The only usable items are Miyaura–Suzuki, the 2016 neural-network prediction papers (as history), ChemPro, and the OpenAlex 'Chemical Reaction Mechanisms' cluster (nucleophilicity scales).

## Domain teacher.md Requirements
- The notation convention and the check line above, enforced on every mechanism answer.
- The energy-list convention.
- The gate table and remediation logic.
- The carry-over question rule.
- Mayr scope caution.
- Treatment of contested topics (endo, SET, HSAB, transmetalation).
- Sulfur mustard framed historically and medically, with no synthesis detail.
- MC allowed only for ranking and classification.
- Vocabulary is fully technical at this level. Define with care: Curtin–Hammett, suprafacial/antarafacial, Möbius–Hückel, s_N, ρ.

## Pacing
- 56 lessons at 5 per week is about 11–12 weeks. Each lesson is a 3–5 minute read plus a 10–20 minute exercise. The capstone may take 2 sessions.
- Difficulty curve:
  - Starts at 2–3 (Module 1).
  - Rises to 4 in Modules 2–4, with a level-3 entry lesson at each module start.
  - Eases to 3 at the start of Module 5 (31, 34) and Module 6 (38).
  - First 5 at lesson 41, after the FMO ramp.
  - 5 again at 48 (Suzuki) and 56 (capstone).
  - Evidence design (53) and ML (54) are level-3 relief before the capstone.
- Adapt using the method rules: 3 correct in a row lets the student combine or deepen; 2 struggles in a row means splitting a lesson or inserting a remediation lesson.