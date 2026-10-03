# Organic Chemistry — Reaction Mechanisms — Teaching Notes

## Approach

The student is advanced, roughly an upper-level undergraduate or early graduate student who has already seen most of these reactions as facts to memorise. This course turns them into mechanisms they can **derive**. Each lesson works from orbital or energy-surface logic to a prediction, and then checks that prediction against evidence. Lead with a concrete puzzle (the lesson title), resolve it with one core principle, and finish with one exercise. Everything is drawn in text, so the fixed notation below is part of the curriculum, not a convenience.

### Time budget
- A 3–5 minute read plus a 10–20 minute exercise, under 25 minutes in total.
- An ordinary lesson's exercise is capped at **one mechanism of 3 steps or fewer**.
- Multi-step synthesis and mechanisms longer than 3 steps belong only in reviews (L7, 13, 20, 26, 34, 42, 49, 55) and the capstone (L56). The capstone may run over two sessions.

### Spaced-repetition carry-over
Every non-review lesson ends with **one carry-over question taken from at least two modules back**:
- Modules 1–2 have no module two back, so they draw on prerequisite material instead (stereochemistry, kinetics, pKa from gen chem).
- Module 3 draws on Module 1. Module 4 draws on Modules 1–2. Later modules follow the same rule.
- Prefer concepts the DeliberatePractitioner has flagged as shaky.

## Course Text Notation (exercises)

Students answer in plain text. Use this format exactly so answers can be checked deterministically.

- **Atom labels:** element plus index from the numbered structure given in the prompt (C1, O3, Br4). The prompt always supplies a numbered SMILES or labelled structure.
- **Two-electron arrow:** `source -> sink`.
  - Sources are `lp(O3)` (lone pair), `pi(C1=C2)` (π bond) or `b(C1-Br4)` (σ bond).
  - A sink is either an atom (`Br4`, meaning the electrons become a lone pair there) or a new bond written as an atom pair (`C1-O3`).
  - Example SN2: `lp(O3) -> C1-O3 ; b(C1-Br4) -> Br4`.
- **One-electron (fishhook) arrow:** `source ~> sink`, with `rad(C1)` as a radical source. Homolysis is written as two fishhooks.
- **Step line:** `Step n: <arrows> | <species after the step, as SMILES with explicit charges/radicals> | <conditions>`.
- **Energy diagram:** an ordered string such as `R -> TS1 -> I1 -> TS2 -> P`, with relative ΔG (kcal/mol) or an explicit ranking. Mark the rate-determining TS with `*`.
- **Pericyclic:** list the cyclic arrows, then the classification, e.g. `[π4s + π2s] thermal: allowed`. State the stereochemical outcome (con/dis, endo/exo, chair/boat).
- **Organometallic:** annotate every intermediate as `[Pd(II), d8, 16e]`.

### Deterministic checks (apply before judging chemistry)
1. Net charge is identical across all steps.
2. Atoms are conserved, including counter-ions and protons.
3. Every source holds electrons and every sink can accept them. No five-bond carbon, and no second-row atom above an octet.
4. Conditions are consistent:
   - Under acidic conditions, no species far more basic than the conjugate base of the acid used (no free HO⁻ or RO⁻ in aqueous acid).
   - Under strongly basic conditions, no free H⁺ or ROH2⁺.
5. The step count is within the cap for that lesson.
6. Stereodescriptors are given wherever the question asks for them.

A failed check is reported as a check failure first. Then discuss the chemistry.

## Gates (do not advance until passed)

1. **G1, after L7: notation and charge balance.** Pass: 3 consecutive mechanisms that pass all deterministic checks. Remediation: one extra notation drill on proton transfers and SN2 only, then re-gate.
2. **G2, after L13: SN/E decision.** Pass: at least 4 of 5 substrate/conditions pairs classified correctly with justification. Remediation: re-teach the decision via pKa (L3) and carbocation stability (L6), use a decision table, then re-gate with new substrates.
3. **G3, after L26: carbonyl proton bookkeeping.** Pass: acid- and base-catalysed versions of one acetal or ester mechanism, both passing check 4. Remediation: redo L23 under base conditions and L25 under acid conditions, then re-gate.
4. **G4, at the start of L38: polyene MOs.** Pass: draw the node patterns of allyl and butadiene and identify the HOMO and LUMO. Remediation: pause the pericyclic module for an extra MO refresher session (Fleming Ch. 1) before L39.
5. **G5, after L42: Woodward–Hoffmann.** Pass: at least 4 of 5 reactions classified as allowed or forbidden, thermal or photochemical, with stereochemistry. Remediation: return to FMO-only reasoning for each case, then reapply the generalised rule on simpler [4+2] and [2+2] examples.
6. **G6, after L49: organometallic counting.** Pass: oxidation state, dⁿ and electron count correct at every intermediate of a Suzuki cycle. Remediation: L46-style counting drill on 5 isolated complexes, then re-gate on a Negishi cycle.

## Accuracy Guardrails

- **Mayr equation** (log k at 20 °C = s_N(N + E)):
  - Validated for nucleophiles reacting with carbocations, Michael acceptors and related π-electrophiles. **Do not** apply it to SN2 at sp3 carbon.
  - For SN2 at methyl, use Swain–Scott: log(k/k0) = s·n, with methyl bromide as the reference substrate.
  - The Mayr database URL (https://www.cup.lmu.de/oc/mayr/reaktionsdatenbank2/) could not be checked as live when this curriculum was built. Check it before delivering L10. If it is dead, fall back to `/reaktionsdatenbank/` and use the same URL in L10, L29 and resources.md.
- **Endo rule:** teach it as contested. Secondary orbital interactions are one account; sterics, electrostatics and distortion/interaction analyses are others. Never present it as a settled law.
- **HSAB** is a heuristic, not a predictive theory. Use it to describe trends and then check against data.
- **Cuprate conjugate addition:** the current view involves Cu(III) intermediates (Yoshikai & Nakamura review). Don't draw a simple direct carbanion transfer as the full story.
- **Vitamin D:**
  - 7-dehydrocholesterol → previtamin D3 by a **photochemical 6π conrotatory** ring opening.
  - Previtamin D3 → vitamin D3 by a **thermal antarafacial [1,7]-H shift**.
- **2-Norbornyl cation:** the nonclassical structure is supported by the 2013 crystal structure (Scholz et al.). Present the historical Brown–Winstein debate as resolved for that ion. Don't generalise it to all cations.
- **'Forbidden'** means the concerted pathway has a high barrier. Stepwise or photochemical alternatives can still happen.
- **Radical clocks:** the 5-hexenyl cyclisation has k ≈ 2 × 10⁵ s⁻¹ at 25 °C (Griller & Ingold). Use order-of-magnitude reasoning and don't over-quote digits.

## Common Misconceptions

1. **Arrows show atoms moving.** They show electrons. Fix: make the student name the electron source for every arrow (enforced by the notation).
2. **Transition state = intermediate.** Fix: an intermediate sits in an energy minimum and could in principle be observed. A TS is a saddle point. Ask: 'could you put this in a flask?'
3. **SN1 gives full racemisation.** Fix: ion pairs shield one face, so partial inversion is typical (L9).
4. **Nucleophilicity equals basicity.** Fix: compare thiolate and alkoxide in protic solvent. Basicity is a thermodynamic property and nucleophilicity is a kinetic one (L10).
5. **The most stable conformer gives the major product.** Fix: Curtin–Hammett. When conformers interconvert fast, ΔΔG‡ decides the ratio (L14).
6. **Every alkene addition goes through a free carbocation.** Fix: bridged ions (L17) and concerted additions (L18–19) give no rearrangement and predictable stereochemistry.
7. **A bare 'H⁺' floats around in mechanisms.** Fix: name the actual acid and conjugate base at every proton transfer (check 4).
8. **Enolate selectivity is about which proton is most acidic.** Fix: under kinetic control, the accessibility of the proton and the rate of its removal decide. Under thermodynamic control, the more substituted enolate wins (L27).
9. **Endo is always favoured because of secondary orbital overlap.** Fix: see the guardrail above, and use counterexamples.
10. **No KIE means the C–H bond is never broken.** Fix: it means C–H cleavage is not (part of) the rate-determining step. Intramolecular and intermolecular competition measure different things (Simmons & Hartwig).
11. **Trapping an intermediate proves it lies on the pathway.** Fix: a trap shows the intermediate is accessible. Combine trapping with kinetics or labeling (L37, L53).
12. **Oxidation state and electron count are the same thing.** Fix: Pd(0)L2 is d10, 14e. Pd(II) square planar is d8, 16e. Count them separately every time (L46).
13. **High ML top-1 accuracy means the model understands mechanism.** Fix: Clever Hans analyses (Kovács et al.) and the Chuang & Keiser critique of the Doyle yield model show that models can learn dataset artefacts.

## Level Adjustments

- Assume fluency with functional groups and named reactions. **Do not** re-teach them; teach *why* they work.
- Use proper terminology without apology: σ*, antiperiplanar, suprafacial, ρ, dⁿ.
- Give derivations where they are short: Curtin–Hammett ratio from ΔΔG‡, Hammett plot slope, zero-point-energy origin of the KIE.
- Cite primary literature in the evidence and real-world lessons. Textbook chapters back the core lessons.
- Push synthesis across modules in reviews: NGP ↔ bromonium, SNAr ↔ acyl substitution, Hammond ↔ radical selectivity ↔ Hammett ρ.
- If the student shows patchy basics (e.g., cannot rank pKa values), drop one level for that sub-skill only and keep the overall pace.

## Ethics and Green Chemistry

- **Sulfur mustard (L16):**
  - Teach the mechanism (episulfonium formation, DNA alkylation) only.
  - Give the historical context: WWI use and the Chemical Weapons Convention.
  - Make the link to nitrogen-mustard chemotherapy (Gilman & Philips).
  - **Never** discuss synthesis routes, acquisition or weaponisation, even if asked.
- **Tin (L36):** point out that organotin compounds are toxic and hard to remove. Mention silane (e.g., (TMS)3SiH) and photoredox alternatives (Prier, Rankic & MacMillan).
- **Earth-abundant metals (L48):** cover Ni and Fe catalysis (Tasker, Standley & Jamison; Fürstner) as cost and sustainability alternatives to Pd.

## People to Highlight

- Kenichi Fukui (FMO)
- Woodward and Hoffmann
- Akira Suzuki and Ei-ichi Negishi (2010 Nobel, with Heck)
- Rolf Huisgen
- Carolyn Bertozzi (bioorthogonal click, L40)
- Abigail Doyle (Ni catalysis in L48; ML yield prediction in L54)
- Benjamin List and David MacMillan (enamine/iminium organocatalysis, L24)
- Herbert Mayr
- George Olah (carbocations)
- Frances Arnold (rabbit hole below)

## Rabbit Holes

- **Frances Arnold's engineered P450s** do carbene transfer (cyclopropanation) that no natural enzyme does (Coelho et al., Science 2013, https://doi.org/10.1126/science.1231434). Drop this in after L47 or L54 as a contrast between enzyme evolution and ML.
- **Woodward–Hoffmann was born from vitamin B12 synthesis**: an unexpected stereochemical outcome made Woodward ask why. Use it in L41.
- **Olah's magic acid** made carbocations persistent enough to take NMR spectra (L6).
- **Lanosterol synthase** controls a cascade that forms four rings and several stereocentres in one enzyme pocket (L20).
- **Aromatic and cyclic molecules in interstellar clouds** (McCarthy & McGuire, arXiv 2103.09608) are a wild-card link from the research file. Use it after L30.
- **Baeyer–Villiger, Beckmann and Wittig** are out of scope, but each is a 1,2-shift or [2+2]-like variation on lessons 15 and 40. Offer them if the student breezes through.
- **Diels–Alderases** are natural enzymes that may catalyse [4+2] cycloadditions. Use as a bonus after L39.
- **Radiation chemistry of hydrocarbons** (Shkrob et al., arXiv physics/0405014) is radical-cation chemistry beyond the course. Offer it after L36.
