# Organic Chemistry — Reaction Mechanisms — Domain Teaching Config

## Exercise Types

- **Arrow-pushing in fixed text notation.** Use the curriculum's standard notation for arrows, intermediates and energy diagrams. Every answer is checked deterministically: arrows go from electron source to sink, charges balance, and valence and octets are respected.
- **Predict the product and justify it.** Ask for the regiochemistry and stereochemistry and the reason. Examples are Markovnikov versus anti-Markovnikov, syn versus anti addition, and endo versus exo.
- **Rank and compare.** Rank nucleophiles, leaving groups, carbocation stabilities or acidities, and justify the order.
- **Draw or describe an energy diagram.** The student marks the rate-determining step, the intermediates and the transition states, and says where Hammond's postulate applies.
- **Design an experiment.** Ask what a KIE, crossover, labeling, trapping or Hammett experiment would distinguish. Mid-level practice is in lesson 53.
- **Spot the flawed mechanism.** Give a mechanism with a planted error, such as an impossible intermediate, a wrong arrow direction or an unreasonable step.
- **Critique a model prediction.** Give a machine-learning reaction prediction and ask whether it is plausible and where it would fail (lesson 54).
- **Carry-over question.** Every non-review lesson ends with one question from at least two modules back.
- **Budget.** An ordinary lesson's exercise is one mechanism of 3 steps or fewer. Multi-step synthesis belongs only to reviews and the capstone, and the capstone may span two sessions.

## Exercise Format Preference

**Mixed.** Use multiple choice for fast recognition (leaving-group ranking, which class of mechanism, which reagent), and free-text mechanism writing for application. Mechanism and evidence-design questions should always be free text with reasoning shown.

## Resource Types

- Textbook chapters for core content (Clayden, Grossman, Anslyn & Dougherty, Fleming).
- Primary literature for evidence, nucleophilicity and cross-coupling lessons.
- Specific mechanism animations only where a verified page exists.
- Data tables, such as pKa and Mayr parameters, as lookup tools. Teach the student to use them, not to memorise them.
- Nobel summaries and biographies for context and the human story.
- Wikipedia only as light orientation, never as sole backing for a technical claim.

## Difficulty Curve

- Module 1 builds the shared vocabulary of arrows, energy diagrams and nucleophile/electrophile. Difficulty is low and mistakes are cheap.
- Substitution, elimination and addition rise steadily. The main gates are SN1/SN2/E1/E2 competition, E2 stereochemistry and carbocation rearrangements.
- Carbonyl chemistry (addition, acetals, imines and enamines, Claisen) needs fluent acid/base and tetrahedral-intermediate reasoning.
- The pericyclic module is the steepest spike. Do not skip the ramp: polyene π-MOs and FMO (38), then Diels–Alder through FMO (39), then 1,3-dipolar and [2+2] (40). Only after that comes the general Woodward–Hoffmann lesson (41, difficulty 5).
- Organometallics need electron counting (46) and elementary steps (47) before the Suzuki cycle (48).
- Reviews are difficulty 2–3 and are for consolidation. Only the capstone (56) is difficulty 5.
- Six explicit gates each have a remediation branch. If a gate is failed, do not advance. Teach the missing prerequisite through a short remedial lesson and retest.

## Domain Hooks

- Mechanisms are a small set of reusable moves, so students find they can predict reactions they have never seen.
- Drug design: covalent inhibitors such as ibrutinib's acrylamide warhead, and the nitrogen-mustard story behind early chemotherapy.
- Biology uses the same chemistry. Thiolase, fatty-acid synthase and chorismate mutase run textbook mechanisms.
- Orbital symmetry decides whether a reaction goes at all, and light can reverse the outcome. Vitamin D synthesis is the example.
- Evidence puzzles: how do we know a mechanism is right when we cannot see it? KIE, crossover and trapping experiments are detective work.
- Cross-coupling won a Nobel Prize, and Ni and Fe catalysis point to cheaper, greener chemistry.
- AI can predict reactions but fails in telling ways, so critical reading is a practical skill.
- Rabbit holes: the 2-norbornyl nonclassical ion debate, the endo-rule controversy, enzymatic carbene transfer (Arnold), and Wittig's oxaphosphetane as a [2+2]-like ring.

## Common Failure Modes

- **Arrow direction and meaning.** Arrows go from electron source to electron sink, and not from atom to atom. Students draw them backwards or show atom movement.
- **Mixing up thermodynamics and kinetics.** The most stable product is not always the one formed fastest. Watch for this in Zaitsev versus Hofmann and endo versus exo.
- **Writing impossible intermediates.** Examples are pentavalent carbon, a strong base in acid, or a primary carbocation. Check pH consistency.
- **Treating Mayr's equation as universal.** Stress the validated scope and have the student say where it does not apply (for example SN2 at sp3, where Swain–Scott n is used).
- **Treating HSAB as a law.** It is a heuristic with exceptions.
- **Teaching the endo rule as settled.** It is contested: secondary orbital interactions versus sterics, electrostatics and distortion/interaction. Present it that way.
- **Memorising instead of reasoning.** If the student only recalls a reagent table, ask them to predict a new case and justify it.
- **Stereochemistry shortcuts.** Confusing syn/anti with E/Z, or assuming inversion without checking the mechanism, are common errors in E2 geometry and addition lessons.
- **Skipping the orbital picture.** In pericyclic chemistry, students apply suprafacial/antarafacial and conrotatory/disrotatory rules as a lookup and cannot explain them. Return to the HOMO/LUMO phase picture.
- **Over-trusting ML predictions.** Students accept model output without asking about training-data bias.
- **Wrong cuprate detail.** Cuprate mechanisms may involve Cu(III) intermediates. Mention this and do not present a single settled picture.

## Vocabulary

- **Use freely at this level:** nucleophile, electrophile, leaving group, intermediate, transition state, rate-determining step, regioselectivity, stereospecific, concerted, carbocation, radical, HOMO/LUMO, suprafacial/antarafacial, oxidative addition, reductive elimination, transmetalation.
- **Define carefully on first use:** Hammond's postulate, Curtin–Hammett, anomeric effect, neighbouring-group participation, nonclassical ion, Baldwin's rules, KIE (primary and secondary), Hammett ρ and σ, Mayr N/s_N/E, Swain–Scott n, electron counting (18-electron rule), conrotatory/disrotatory, 1,3-dipole.
- **Avoid or flag:** "electron pushing" shorthand that hides which electrons move, "stable" without saying thermodynamic or kinetic, and "proves the mechanism" (evidence supports or rules out a mechanism and does not prove it).
