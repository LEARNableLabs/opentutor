# Epigenetics — Concept Map

## Core Concepts (in learning order)

1. **Epigenetic definition** — heritable changes in gene expression that don't alter DNA sequence
2. **Environmental influence** — how external factors shape epigenetic patterns
3. **DNA methylation** — addition of methyl groups to cytosine bases, primarily at CpG sites. Depends on: epigenetic definition
4. **CpG islands** — regions rich in CG dinucleotides, often at gene promoters, typically unmethylated
5. **Methyltransferases (DNMTs)** — enzymes that add methyl groups to DNA. Depends on: DNA methylation
6. **Active demethylation** — removal of methylation marks via TET enzymes. Depends on: DNA methylation
7. **Nucleosomes** — DNA wrapped around histone octamers, the basic unit of chromatin
8. **Histones** — protein core of nucleosomes, subject to post-translational modifications
9. **Histone modifications** — chemical marks (acetylation, methylation, etc.) on histone tails. Depends on: nucleosomes, histones
10. **Writers-readers-erasers** — enzymes that add, recognize, or remove histone marks. Depends on: histone modifications
11. **Chromatin states** — distinct combinations of histone marks defining active/repressed regions. Depends on: histone modifications
12. **Chromatin remodeling complexes** — ATP-dependent machines that reposition nucleosomes. Depends on: nucleosomes
13. **Chromatin accessibility** — degree to which DNA is exposed for transcription factor binding. Depends on: chromatin remodeling complexes
14. **Non-coding RNAs (ncRNAs)** — functional RNAs that don't encode proteins but regulate gene expression
15. **MicroRNAs** — small RNAs that silence genes post-transcriptionally. Depends on: ncRNAs
16. **Long non-coding RNAs (lncRNAs)** — long RNAs with diverse regulatory functions. Depends on: ncRNAs
17. **X-inactivation** — silencing of one X chromosome in female mammals via Xist lncRNA. Depends on: lncRNAs, chromatin states
18. **Genomic imprinting** — parent-of-origin specific gene expression. Depends on: DNA methylation
19. **Imprinting control regions** — differentially methylated regions that regulate imprinted genes. Depends on: genomic imprinting
20. **Epigenetic reprogramming** — erasure and re-establishment of epigenetic marks during development. Depends on: DNA methylation, histone modifications
21. **Cell fate commitment** — progressive restriction of cell potency through epigenetic changes. Depends on: chromatin states, epigenetic reprogramming
22. **Pluripotency** — capacity of stem cells to differentiate into any cell type. Depends on: cell fate commitment
23. **Bivalent chromatin** — simultaneous presence of activating and repressing marks at developmental genes in stem cells. Depends on: histone modifications, pluripotency
24. **Polycomb repression** — protein complexes that maintain gene silencing through histone methylation. Depends on: histone modifications
25. **Environmental epigenetics** — how diet, stress, toxins alter epigenetic patterns. Depends on: DNA methylation, histone modifications, environmental influence
26. **Transgenerational inheritance** — transmission of epigenetic information across generations. Depends on: environmental epigenetics, epigenetic reprogramming
27. **Cancer epigenetics** — aberrant epigenetic changes in tumor cells. Depends on: DNA methylation, histone modifications
28. **CpG island hypermethylation** — abnormal methylation silencing tumor suppressors. Depends on: CpG islands, cancer epigenetics
29. **Epigenetic therapy** — drugs targeting epigenetic enzymes to treat disease. Depends on: DNA methylation, histone modifications
30. **DNMT inhibitors** — drugs that block DNA methylation. Depends on: methyltransferases, epigenetic therapy
31. **HDAC inhibitors** — drugs that block histone deacetylases, promoting open chromatin. Depends on: histone modifications, epigenetic therapy
32. **CRISPR epigenome editing** — targeted modification of epigenetic marks using dCas9 fusions. Depends on: chromatin remodeling, histone modifications
33. **Bisulfite sequencing** — method to map DNA methylation genome-wide. Depends on: DNA methylation
34. **ChIP-seq** — chromatin immunoprecipitation followed by sequencing to map histone marks or protein binding. Depends on: histone modifications, chromatin accessibility
35. **ATAC-seq** — assay for transposase-accessible chromatin, mapping open regions. Depends on: chromatin accessibility

## Dependencies

### Foundation Layer
- **DNA methylation** is the first major mechanism students encounter, building on basic molecular biology
- **Histone modifications** build on chromatin structure knowledge, requiring understanding of nucleosomes
- **Chromatin states** emerge from combining DNA methylation and histone modifications — a critical integration point

### Regulatory Layer
- **Chromatin remodeling** depends on understanding chromatin structure first
- **Non-coding RNAs** add a third regulatory dimension beyond DNA methylation and histone marks
- **X-inactivation** is a powerful example requiring integration of lncRNAs, chromatin states, and methylation

### Developmental Layer
- **Epigenetic reprogramming** requires solid understanding of methylation and histone modifications because both are erased/reset
- **Cell fate commitment** builds on chromatin states and reprogramming
- **Bivalent chromatin** and **polycomb repression** are advanced concepts requiring deep understanding of histone modifications

### Application Layer
- **Environmental epigenetics** applies foundational mechanisms to real-world contexts
- **Cancer epigenetics** demonstrates how dysregulation of basic mechanisms leads to disease
- **Epigenetic therapy** requires understanding both normal mechanisms and disease contexts

### Methods Layer
- **Bisulfite sequencing** directly measures DNA methylation, so students need that foundation
- **ChIP-seq** measures histone modifications and protein binding, requiring understanding of both
- **ATAC-seq** measures chromatin accessibility, requiring understanding of chromatin remodeling

## Critical Dependencies

### Bottleneck Concepts
These concepts unlock large downstream areas:

1. **Chromatin states** — integrates DNA methylation and histone modifications, essential for understanding development, disease, and methods
2. **Epigenetic reprogramming** — unlocks development, stem cell biology, and transgenerational inheritance
3. **Writers-readers-erasers** — framework for understanding how epigenetic information is written, maintained, and interpreted

### Sequential Requirements
- **Histone modifications** must come after **nucleosomes** and **histones**
- **Chromatin accessibility** requires understanding **chromatin remodeling complexes**
- **Imprinting disorders** require understanding **genomic imprinting** first
- **Epigenetic therapy** requires understanding both normal mechanisms and disease contexts

## Prerequisite Topics (external)

- **Molecular biology basics** — needed for DNA structure, gene expression (all concepts)
- **Gene expression fundamentals** — needed for understanding transcriptional regulation (chromatin states, histone modifications)
- **Basic genetics** — needed for understanding inheritance patterns (genomic imprinting, transgenerational inheritance)
- **Cell biology** — needed for understanding cell differentiation (cell fate commitment, pluripotency)

## Common Misconceptions (concept-level)

1. **DNA methylation = gene silencing (always)** — Not true; context matters (gene body vs promoter methylation have different effects)
2. **Epigenetics is Lamarckian evolution** — Confuses mechanism with evolutionary theory; epigenetic inheritance is real but limited
3. **Histone code is deterministic** — It's probabilistic; combinations of marks influence but don't dictate outcomes
4. **All epigenetic marks are heritable** — Many are dynamic and cell-type specific, not passed through generations
5. **Chromatin remodeling = histone modification** — These are distinct mechanisms working together
6. **Transgenerational effects prove inheritance** — Could be confounded by shared environment or genetic variation

## Concept Clusters

### Cluster 1: DNA Modification
DNA methylation, CpG islands, DNMTs, active demethylation, TET enzymes

### Cluster 2: Chromatin Structure
Nucleosomes, histones, histone modifications, writers-readers-erasers, chromatin states

### Cluster 3: Chromatin Dynamics
Chromatin remodeling, nucleosome positioning, chromatin accessibility

### Cluster 4: RNA Regulation
Non-coding RNAs, microRNAs, lncRNAs, X-inactivation

### Cluster 5: Genomic Phenomena
Genomic imprinting, imprinting control regions, parent-of-origin effects

### Cluster 6: Development
Epigenetic reprogramming, cell fate, pluripotency, bivalent chromatin, polycomb

### Cluster 7: Environment
Environmental epigenetics, transgenerational inheritance, developmental origins

### Cluster 8: Disease
Cancer epigenetics, Rett syndrome, imprinting disorders

### Cluster 9: Intervention
Epigenetic therapy, DNMT inhibitors, HDAC inhibitors, CRISPR editing

### Cluster 10: Methods
Bisulfite sequencing, ChIP-seq, ATAC-seq, epigenome profiling
