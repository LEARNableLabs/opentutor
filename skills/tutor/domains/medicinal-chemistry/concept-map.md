# Medicinal Chemistry and Drug Design — Concept Map

## Core Concepts (in learning order)

1. **Drug-target interactions** — molecules bind to biological targets through complementary shapes and interactions
2. **Pharmacophore** — the 3D arrangement of features necessary for biological activity
3. **Structure-activity relationship (SAR)** — how molecular structure changes affect biological activity. Depends on: pharmacophore
4. **Drug discovery pipeline** — stages from target identification to clinical approval
5. **Binding affinity** — strength of drug-target interaction, measured as Kd or Ki. Depends on: drug-target interactions
6. **Enzyme inhibition** — competitive, non-competitive, and allosteric mechanisms. Depends on: binding affinity
7. **Receptor pharmacology** — agonists, antagonists, and GPCRs as drug targets. Depends on: binding affinity
8. **Selectivity** — targeting the intended protein while avoiding off-targets. Depends on: binding affinity, SAR
9. **Lipinski's Rule of Five** — physicochemical guidelines for oral bioavailability
10. **ADME** — Absorption, Distribution, Metabolism, and Excretion. Depends on: Lipinski's Rule
11. **Lipophilicity (LogP)** — measure of how fat-soluble a drug is. Depends on: ADME
12. **Metabolism** — chemical modification of drugs, especially by CYP450 enzymes. Depends on: ADME
13. **Hit-to-lead optimization** — improving a screening hit into a developable lead. Depends on: SAR, ADME, selectivity
14. **Bioisosteric replacement** — swapping functional groups while maintaining activity. Depends on: SAR
15. **Prodrugs** — inactive molecules that are metabolically activated. Depends on: metabolism
16. **CYP450 enzymes** — major drug-metabolizing enzymes, source of drug-drug interactions. Depends on: metabolism
17. **Molecular docking** — computational prediction of binding modes. Depends on: binding affinity, pharmacophore
18. **Scoring functions** — computational methods to rank binding poses. Depends on: molecular docking
19. **Virtual screening** — computational filtering of large compound libraries. Depends on: molecular docking
20. **QSAR** — quantitative structure-activity relationships using statistical models. Depends on: SAR
21. **Fragment-based drug discovery (FBDD)** — building drugs from small fragments. Depends on: binding affinity, SAR
22. **Targeted covalent inhibition** — irreversible binding through reactive warheads. Depends on: selectivity, enzyme inhibition

## Dependencies

### Foundational Chain
- **SAR** requires understanding **pharmacophores** because you need to know which molecular features are responsible for activity before you can systematically vary structure
- **Selectivity** builds on **binding affinity** and **SAR** because you need to understand both what drives binding and how structural changes affect it to design selective drugs
- **Hit-to-lead optimization** integrates **SAR**, **ADME**, and **selectivity** because you're simultaneously optimizing potency, drug-like properties, and target specificity

### ADME and Physicochemical Properties
- **ADME** depends on **Lipinski's Rule** as a starting framework, but goes deeper into specific mechanisms
- **Lipophilicity** is central to **ADME** because it governs membrane permeability, distribution, and metabolic stability
- **Metabolism** is a critical component of **ADME** and directly informs **prodrug** design
- **CYP450 enzymes** are the mechanistic basis for most **metabolism**, creating predictable liabilities and drug-drug interactions

### Computational Methods
- **Molecular docking** requires understanding **binding affinity** and **pharmacophores** to set up meaningful calculations
- **Virtual screening** is large-scale application of **molecular docking** with additional filtering
- **QSAR** is a statistical approach to **SAR** that enables prediction for untested compounds
- **Scoring functions** determine the quality of **molecular docking** results

### Advanced Strategies
- **Bioisosteric replacement** is a sophisticated **SAR** strategy used during **hit-to-lead optimization**
- **Fragment-based drug discovery** requires deep understanding of **binding affinity** and how small molecular fragments contribute to it
- **Targeted covalent inhibition** combines **selectivity** and **enzyme inhibition** with reactive chemistry

## Prerequisite Topics

- **Organic chemistry** — needed for understanding functional groups, reaction mechanisms (prodrugs, metabolism), stereochemistry, and molecular properties
- **Biochemistry fundamentals** — needed for enzyme kinetics, receptor function, protein structure, and biological pathways
- **Basic pharmacology** — needed for dose-response relationships, therapeutic index, and PK/PD concepts

## Critical Bottlenecks

Students often struggle at these transitions:

1. **From 2D structures to 3D binding** — moving from drawn molecules to spatial recognition and protein-ligand complexes
2. **Balancing multiple properties** — optimizing potency while maintaining ADME properties and selectivity (the "optimization trilemma")
3. **Interpreting computational results** — understanding what docking scores mean and their limitations
4. **Metabolic prediction** — anticipating where CYP450 enzymes will attack a molecule

## Common Misunderstandings

- Thinking **Lipinski's Rule** is a strict cutoff rather than a guideline (many approved drugs violate it)
- Confusing **binding affinity** with **functional activity** (a tight binder may not be a good drug)
- Assuming **computational docking** gives quantitatively accurate binding energies (it's better for ranking)
- Believing **selectivity** is always desirable (polypharmacology can be beneficial for some diseases)
- Thinking **prodrugs** are always better than active drugs (they add complexity and risk)
