# Synthetic Biology — Concept Map

## Core Concepts (in learning order)

1. **Biological engineering principles** — applying abstraction, standardization, and modularity to living systems
2. **BioBricks & genetic parts** — standardized DNA components (promoters, RBS, CDS, terminators)
3. **Promoters** — DNA sequences controlling transcription initiation. Depends on: BioBricks
4. **Ribosome binding sites (RBS)** — RNA sequences controlling translation. Depends on: BioBricks
5. **Terminators** — sequences ending transcription. Depends on: BioBricks
6. **DNA assembly methods** — techniques for combining parts (Gibson, Golden Gate). Depends on: BioBricks
7. **Gene expression control** — inducible vs constitutive systems. Depends on: promoters, RBS
8. **Genetic logic gates** — AND/OR/NOT gates using transcriptional regulation. Depends on: gene expression control
9. **Bistability** — two stable states in a biological system. Depends on: genetic logic gates
10. **Toggle switch** — circuit with two stable states using mutual repression. Depends on: bistability
11. **Negative feedback** — regulatory motif that stabilizes or creates oscillations. Depends on: gene expression control
12. **Oscillators** — circuits producing periodic expression (repressilator). Depends on: negative feedback
13. **Context dependence** — how circuit behavior changes with cellular environment. Depends on: genetic logic gates
14. **Retroactivity** — how downstream components affect upstream performance. Depends on: context dependence
15. **ODE modeling** — mathematical description of genetic circuits using differential equations. Depends on: oscillators, toggle switch
16. **CRISPR-Cas9** — RNA-guided DNA endonuclease for genome editing. Depends on: biological engineering principles
17. **Guide RNA (gRNA)** — RNA directing Cas9 to target sequence. Depends on: CRISPR-Cas9
18. **PAM sequence** — protospacer adjacent motif required for Cas9 targeting. Depends on: CRISPR-Cas9
19. **Base editors** — CRISPR variants making single-base changes without DSBs. Depends on: CRISPR-Cas9
20. **Prime editing** — CRISPR system enabling targeted insertions/deletions/substitutions. Depends on: base editors
21. **Minimal genome** — smallest set of genes supporting cellular life. Depends on: biological engineering principles
22. **Orthogonality** — genetic systems operating independently without crosstalk. Depends on: gene expression control
23. **Directed evolution** — iterative mutation and selection to optimize proteins. Depends on: biological engineering principles
24. **Metabolic pathways** — series of enzyme-catalyzed reactions producing molecules. Depends on: gene expression control
25. **Heterologous expression** — expressing genes from one organism in another. Depends on: metabolic pathways
26. **Flux balance analysis (FBA)** — constraint-based modeling of metabolism. Depends on: metabolic pathways
27. **Enzyme optimization** — tuning expression levels and variants for pathway performance. Depends on: metabolic pathways, directed evolution
28. **Cofactor balance** — managing NAD(P)H, ATP for pathway efficiency. Depends on: metabolic pathways
29. **Biomanufacturing** — industrial-scale production using engineered organisms. Depends on: metabolic pathways, enzyme optimization
30. **Biosensors** — cells engineered to detect specific molecules. Depends on: gene expression control, genetic logic gates
31. **CAR-T cells** — T cells engineered with chimeric antigen receptors. Depends on: genetic logic gates, CRISPR-Cas9
32. **Bioremediation** — using organisms to clean up pollutants. Depends on: metabolic pathways, biosensors
33. **Biosafety** — preventing accidental release or harm from engineered organisms. Depends on: all applications
34. **Biosecurity** — preventing malicious use of synthetic biology. Depends on: biosafety

## Dependencies

### Foundation Layer
- **BioBricks** enable all higher-level design by providing standardized parts
- **DNA assembly methods** are essential for physically building any construct
- **Gene expression control** is the foundation for circuits, pathways, and applications

### Circuit Design Layer
- **Genetic logic gates** require understanding of transcriptional regulation and expression control
- **Toggle switches** and **oscillators** build on logic gates by adding feedback
- **Retroactivity** and **context dependence** explain why simple designs fail, requiring iterative refinement
- **ODE modeling** provides quantitative predictions, essential for rational design

### Genome Engineering Layer
- **CRISPR-Cas9** revolutionized genome engineering but builds on fundamental molecular biology
- **Base editors** and **prime editing** extend CRISPR's capabilities with refined mechanisms
- **Orthogonality** enables complex multi-gene systems without interference
- **Directed evolution** complements rational design when mechanisms are unclear

### Metabolic Engineering Layer
- **Metabolic pathways** require heterologous expression of multiple enzymes
- **FBA** provides computational framework for predicting flux distributions
- **Enzyme optimization** addresses bottlenecks identified through modeling
- **Cofactor balance** is often the limiting factor in pathway performance

### Applications Layer
- **Biosensors** combine circuit design principles with specific molecular detection
- **CAR-T cells** integrate genome engineering with circuit design for therapeutic applications
- **Biomanufacturing** applies metabolic engineering at industrial scale
- **Bioremediation** combines pathway engineering with environmental deployment

### Cross-Cutting Concepts
- **Design-Build-Test-Learn (DBTL)** cycle spans all modules
- **Standardization** enables modular composition across all levels
- **Modeling** (ODE, FBA) guides rational design in circuits and metabolism
- **Safety and ethics** constrain what should be built regardless of technical feasibility

## Critical Bottlenecks

These concepts are essential checkpoints where students often struggle:

1. **Gene expression control** (lesson 5) — must understand before circuits
2. **Toggle switch dynamics** (lesson 8) — first complex emergent behavior
3. **ODE modeling** (lesson 11) — requires mathematical maturity
4. **CRISPR mechanism** (lesson 13) — foundation for all genome engineering
5. **FBA** (lesson 20) — different modeling paradigm than ODEs
6. **Enzyme optimization** (lesson 21) — integrates multiple optimization strategies

## Prerequisite Topics

- **Molecular biology** — needed for understanding promoters, RBS, transcription/translation mechanisms
- **Genetics** — needed for gene regulation, mutations, selection
- **Biochemistry** — needed for metabolic pathways, enzyme kinetics, cofactors
- **Differential equations** — needed for ODE modeling of circuits
- **Programming** — needed for computational tools, modeling, sequence design
- **Microbiology** — helpful for understanding host organisms, growth, culture

## Learning Pathways

### Linear (Recommended)
Follow lessons 1-28 in order. This builds foundation → circuits → engineering → applications.

### Circuit-First (for students with strong molecular biology)
Lessons 1-3 (skip to basics) → 7-12 (circuits) → back to 4-6 → continue 13-28

### Applications-First (for motivated learners wanting context)
Lessons 1-2 → 24-26 (applications) → back to 3 → continue through, referencing applications as motivation

## Concept Clusters for Review

- **Cluster 1 (Foundations)**: BioBricks, promoters, RBS, terminators, assembly methods
- **Cluster 2 (Circuits)**: Logic gates, toggle switches, oscillators, feedback
- **Cluster 3 (CRISPR)**: Cas9, gRNA, PAM, base editors, prime editing
- **Cluster 4 (Metabolism)**: Pathways, FBA, enzyme optimization, cofactors
- **Cluster 5 (Integration)**: DBTL cycle, standardization, modeling, ethics
