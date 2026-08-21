# Medicinal Chemistry and Drug Design — Teaching Notes

## Approach

Medicinal chemistry sits at the intersection of chemistry, biology, and computation. At the intermediate level, the goal is to develop **chemical intuition** for how molecular structure affects biological activity, while building practical skills with modern computational tools. This topic is best taught through a case-based approach — every major concept should be illustrated with real drugs (aspirin, imatinib, Paxlovid) to ground abstract principles in tangible examples. Balance three modes: (1) conceptual understanding of binding and properties, (2) hands-on computational exercises with docking and ADME tools, and (3) critical analysis of published drug discovery stories.

## Common Misconceptions

1. **"Bigger molecules bind better"** — Students often assume that adding more functional groups always increases binding affinity. Reality: binding affinity depends on complementarity, not size. Larger molecules have entropic penalties and may lose selectivity. Correct this by showing fragment-based discovery examples where tiny molecules bind with measurable affinity.

2. **"Lipinski's Rule of Five is a strict requirement"** — Many students treat this as a pass/fail test. Reality: it's a statistical guideline for oral bioavailability; many approved drugs (antibiotics, natural products, PROTACs) violate it. Emphasize the "why" behind each rule (molecular weight affects permeability and solubility; H-bond donors/acceptors affect water solubility vs membrane crossing).

3. **"High binding affinity = good drug"** — Students conflate tight binding with therapeutic efficacy. Reality: a drug must also have acceptable ADME properties, selectivity, and safety. Use examples like highly potent toxins that bind beautifully but aren't drugs. Teach the concept of "developability."

4. **"Computational docking gives exact binding energies"** — Students expect docking scores to be quantitative predictions. Reality: scoring functions are approximations best used for ranking poses and compounds, not predicting absolute affinities. Teach critical interpretation: docking is hypothesis-generating, not truth-delivering.

5. **"Selectivity is always the goal"** — Students assume all drugs should hit exactly one target. Reality: polypharmacology can be beneficial (many antipsychotics, kinase inhibitors), and some diseases benefit from multi-target drugs. Teach when selectivity matters (avoiding toxicity, reducing side effects) versus when dirty drugs are acceptable.

6. **"Prodrugs are just a trick to fix bad drugs"** — Students may see prodrugs as a last resort. Reality: prodrugs are rational design strategies for improving bioavailability, targeting specific tissues, or reducing side effects. Emphasize successful examples (enalapril, oseltamivir) where prodrugs enabled otherwise impossible therapies.

7. **"Metabolism is always bad"** — Students often view metabolic breakdown as something to avoid. Reality: metabolism is a natural detoxification process; the goal is to balance sufficient stability for therapeutic effect with eventual clearance. Some drugs are designed to be metabolized rapidly (anesthetics); others need long half-lives (once-daily dosing).

8. **"Every drug needs a crystal structure of the target"** — Students assume structure-based design always requires protein structures. Reality: many drugs are discovered through ligand-based approaches (QSAR, pharmacophore models, phenotypic screening). Teach the value of both structure-based and ligand-based methods.

9. **"Covalent drugs are dangerous and outdated"** — Students may fear covalent inhibition due to toxicity concerns. Reality: modern targeted covalent inhibitors (ibrutinib, afatinib, nirmatrelvir) are designed for selectivity and have excellent safety profiles. Teach the renaissance of rational covalent drug design.

10. **"Computational methods replace experiments"** — Students may over-rely on in silico predictions. Reality: computational tools are powerful filters and hypothesis generators, but experimental validation is essential. Teach an iterative cycle: compute → test → refine models.

## Level Adjustments

**For intermediate students** (this curriculum):
- Assume fluency in organic chemistry nomenclature and mechanisms
- Assume basic enzyme kinetics (Km, Vmax, inhibition types)
- Build toward computational literacy without requiring programming (use web tools like SwissADME, then introduce docking GUIs)
- Emphasize critical reading of medicinal chemistry literature (interpreting SAR tables, IC50 values, ADME data)
- Include computational exercises but focus on interpretation over technical setup
- Use real drug case studies to motivate every concept

**If adjusting to beginner level**:
- Spend more time on organic chemistry review (functional groups, polarity, H-bonding)
- Introduce enzyme kinetics from scratch
- Skip or simplify computational methods (focus on web tools only, no docking)
- Use more visual/tangible examples (molecular models, 3D visualization)
- Reduce depth on metabolism and CYP450 enzymes

**If adjusting to advanced level**:
- Assume programming literacy (Python, RDKit for cheminformatics)
- Deep dive into thermodynamics of binding (enthalpy-entropy compensation)
- Cover advanced topics: fragment growing strategies, kinetic selectivity, residence time, beyond Rule of Five space
- Include molecular dynamics simulations, not just docking
- Assign literature critiques and original SAR analysis projects
- Discuss current research frontiers (PROTACs, molecular glues, AI-driven design)

## Rabbit Holes

- **Drug discovery war stories** — Derek Lowe's "In the Pipeline" blog is full of fascinating tales of failure and success. Drop these in during case studies to show the human side of drug discovery.

- **The "magic methyl" effect** — subtle addition of methyl groups can dramatically affect potency, selectivity, and ADME. Great examples: escitalopram vs citalopram, dexmethylphenidate vs methylphenidate. Introduce when discussing SAR and chirality.

- **Natural product inspiration** — many drugs are inspired by nature (morphine, taxol, penicillin). Use this to discuss how evolution has already explored chemical space and how we learn from it.

- **The Rule of Five's siblings** — Lipinski's Rule has spawned many others (Rule of Three for fragments, Veber's rules for oral bioavailability, Pfizer's 3/75 rule). Introduce these when students are comfortable with the original.

- **The rise and fall of docking** — historical perspective on how computational methods have cycled through hype and skepticism. Helps students think critically about tools.

- **Why most drugs are small molecules, but biologics are rising** — when discussing drug modalities, explore the trade-offs between small molecules (oral, cheap, broad tissue distribution) and biologics (exquisite selectivity, challenging delivery). Reference the "undruggable genome."

- **The concept of "molecular obesity"** — trend toward larger, more complex drugs over time (called "molecular obesity"). Discuss whether this is progress or a problem, especially for CNS drugs.

- **Chirality and drug design** — stereocenters and their impact on activity and safety (thalidomide tragedy, esomeprazole vs omeprazole). Great for discussing 3D thinking.

## Difficulty Progression

- **Lessons 1-5**: Gentle introduction, establish vocabulary and pipeline overview (difficulty 1-2)
- **Lessons 6-11**: First complexity peak — binding theory and selectivity (difficulty 3-4)
- **Lessons 12-17**: Moderate difficulty — physicochemical properties are concrete but require integration (difficulty 2-3)
- **Lessons 18-23**: Second complexity peak — optimization requires balancing multiple objectives (difficulty 3-4)
- **Lessons 24-28**: Computational methods — challenging because of technical setup, but conceptually accessible (difficulty 3-4)
- **Lessons 29-32**: Synthesis and integration — modern approaches build on everything learned (difficulty 3-4, ending with review at 2)

## Engagement Strategies

- **Use real drugs** — every lesson should reference at least one approved or clinical-stage drug
- **Visualize structures** — encourage students to use PyMOL or ChimeraX to explore protein-ligand complexes
- **Hands-on tools** — SwissADME, PubChem, ChEMBL, AutoDock Vina, RDKit notebooks
- **Case study deep-dives** — imatinib (Gleevec), nirmatrelvir (Paxlovid), oseltamivir (Tamiflu), sofosbuvir (Sovaldi)
- **Literature reading** — assign snippets from Journal of Medicinal Chemistry or Nature Reviews Drug Discovery
- **Connect to current events** — COVID antivirals, cancer immunotherapy, antibody-drug conjugates
