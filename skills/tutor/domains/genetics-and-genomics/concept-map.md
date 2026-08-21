# Genetics and Genomics — Concept Map

## Core Concepts (in learning order)

1. **Mendelian inheritance** — patterns of trait transmission across generations (dominant/recessive alleles)
2. **Non-Mendelian patterns** — deviations from simple dominance (incomplete, codominance, epistasis). Depends on: Mendelian inheritance
3. **Chromosomal theory** — genes are physical entities located on chromosomes. Depends on: Mendelian inheritance
4. **Linkage and recombination** — genes on same chromosome tend to be inherited together. Depends on: chromosomal theory
5. **Sex-linked inheritance** — traits encoded on sex chromosomes show different patterns. Depends on: chromosomal theory
6. **Genetic mapping** — using recombination frequency to determine gene positions. Depends on: linkage and recombination
7. **DNA structure** — double helix with complementary base pairing encodes genetic information
8. **DNA replication** — semiconservative copying mechanism. Depends on: DNA structure
9. **Central dogma** — information flow from DNA → RNA → protein. Depends on: DNA structure
10. **Transcription** — DNA to RNA conversion. Depends on: central dogma
11. **Translation** — RNA to protein conversion. Depends on: central dogma, transcription
12. **Gene regulation** — controlling when and where genes are expressed. Depends on: transcription
13. **Mutations** — changes in DNA sequence and their consequences. Depends on: DNA structure, central dogma
14. **DNA repair** — mechanisms to fix DNA damage. Depends on: DNA structure, mutations
15. **Epigenetics** — heritable changes in gene expression without DNA sequence changes. Depends on: gene regulation
16. **Genome organization** — structure beyond individual genes (introns, exons, regulatory elements). Depends on: gene regulation
17. **Sequencing technologies** — methods to read DNA sequences at scale. Depends on: DNA structure
18. **Genome annotation** — identifying genes and functional elements in sequenced genomes. Depends on: sequencing technologies, genome organization
19. **Genome browsers** — tools to visualize and explore genomic data. Depends on: genome annotation
20. **Comparative genomics** — learning from genome comparisons across species. Depends on: genome annotation
21. **Functional genomics** — determining what genes do at scale (transcriptomics, proteomics). Depends on: gene regulation, sequencing technologies
22. **Variant analysis** — identifying and interpreting genetic differences. Depends on: sequencing technologies, mutations
23. **Hardy-Weinberg equilibrium** — baseline for population allele frequencies. Depends on: Mendelian inheritance
24. **Genetic drift** — random changes in allele frequencies. Depends on: Hardy-Weinberg equilibrium
25. **Molecular phylogenetics** — tracing evolutionary relationships using DNA. Depends on: mutations, comparative genomics
26. **Quantitative genetics** — genetics of complex, polygenic traits. Depends on: Mendelian inheritance, population genetics
27. **CRISPR gene editing** — precise genome modification technology. Depends on: DNA structure, molecular mechanisms
28. **Pharmacogenomics** — how genetics affects drug response. Depends on: gene regulation, variant analysis
29. **Cancer genomics** — genetic basis of cancer and targeted treatments. Depends on: mutations, gene regulation, sequencing
30. **Genetic engineering ethics** — societal implications of genomic technologies. Depends on: CRISPR, pharmacogenomics, germline editing

## Dependencies

### Foundational Layer (Classical Genetics)
- **Non-Mendelian patterns** require understanding basic Mendelian inheritance because they're defined as deviations from simple dominance
- **Chromosomal theory** provides the physical basis for Mendel's abstract "factors"
- **Linkage** only makes sense once you understand genes are on chromosomes
- **Genetic mapping** quantifies linkage by measuring recombination frequency

### Molecular Layer
- **Replication, transcription, translation** all depend on understanding DNA structure and base pairing
- **Gene regulation** builds on transcription — you control gene expression by controlling transcription initiation
- **Epigenetics** is regulation without sequence change, so it requires understanding both regulation and how DNA is packaged
- **Mutations** and **repair** both require knowing DNA structure and replication mechanisms

### Genomic Layer
- **Genome organization** extends single-gene models to whole-genome scale
- **Sequencing** is the technology enabling all modern genomics
- **Annotation** interprets raw sequence data using knowledge of gene structure
- **Comparative genomics** and **functional genomics** both build on annotation
- **Variant analysis** combines sequencing with knowledge of mutations and their effects

### Population and Evolutionary Layer
- **Hardy-Weinberg** formalizes Mendelian inheritance at population scale
- **Drift, selection, gene flow** are forces that violate HW equilibrium
- **Phylogenetics** uses molecular data (sequences) to infer evolutionary history
- **Quantitative genetics** extends Mendelian models to traits influenced by many genes

### Applied Layer
- **CRISPR** exploits bacterial immune systems + understanding of DNA repair mechanisms
- **Pharmacogenomics** applies variant analysis to predict drug response
- **Cancer genomics** combines somatic mutation analysis with understanding of gene regulation
- **Ethics** requires understanding the capabilities and limitations of all these technologies

## Bottleneck Concepts

These are concepts where students often get stuck, which then blocks downstream understanding:

1. **Linkage and recombination** — many students struggle with the spatial reasoning of genes on chromosomes and why recombination frequency maps to distance
2. **Gene regulation** — moving from "one gene → one protein" to the complex reality of regulated expression
3. **Genome annotation** — understanding that a sequenced genome is just raw data until you identify what's a gene, what's regulatory, etc.
4. **Hardy-Weinberg equilibrium** — the math intimidates students, but it's essential for all population genetics

## Common Misconceptions

### Inheritance
- Thinking dominance means "more common" (it's about phenotype when heterozygous, not frequency)
- Confusing linkage with dominance or epistasis
- Believing genes are always inherited as discrete units (ignores recombination)

### Molecular
- DNA = genes (ignores non-coding DNA, regulatory elements, etc.)
- One gene → one protein (ignores alternative splicing, regulation, RNA genes)
- Mutations are always bad (ignores neutral and beneficial mutations)
- Epigenetics defies Mendelian genetics (it's an additional layer, not a replacement)

### Genomics
- Thinking sequencing automatically tells you what genes do
- Confusing correlation (GWAS hits) with causation
- Believing comparative genomics just aligns sequences (misses the functional inference aspect)

### Population
- Confusing genetic drift with natural selection
- Thinking evolution requires mutation every generation (misses role of standing variation)
- Believing heritability = genetic determinism

### Applied
- CRISPR can fix anything (misses delivery challenges, off-target effects, complex traits)
- Personalized medicine means perfect prediction (genomics is probabilistic)
- All cancers are the same genetically (misses heterogeneity)

## Prerequisite Topics

- **Cell biology** — needed for understanding where/how DNA replication, transcription, translation happen
- **Basic chemistry** — needed for DNA structure, base pairing, chemical bonds
- **Basic statistics** — needed for population genetics, GWAS, quantitative genetics
- **High school biology** — basic genetics (Punnett squares, DNA structure) provides foundation
