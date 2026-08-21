# Genetics and Genomics — Teaching Notes

## Approach

Genetics and genomics is both historically rich and rapidly evolving, which creates a pedagogical tension: classical genetics provides intuition, but modern genomics is where the action is. For intermediate students, the key is to **bridge these worlds** rather than treating them as separate subjects. Start with Mendelian patterns but immediately connect them to molecular mechanisms. Use real data (genome browsers, databases) throughout rather than just abstract diagrams. Emphasize that genetics is both a conceptual framework (how inheritance works) and a set of powerful technologies (sequencing, editing, analysis).

This topic is naturally experiment-driven — every major concept came from a clever experiment. Use this: show students the evidence, not just the conclusions. It's also increasingly computational: students need to become comfortable with databases, browsers, and data interpretation, not just biological concepts.

## Common Misconceptions

1. **Dominance means common** — Students often think dominant alleles are more frequent in populations, confusing dominance (a molecular/phenotypic relationship) with allele frequency (a population-level statistic). Correct this early by showing examples where recessive alleles are more common.

2. **DNA = genes** — Many students equate the genome with just the protein-coding genes, ignoring regulatory regions, non-coding RNAs, and "junk" DNA. Use genome browsers to show that genes are a small fraction of the genome and that the rest matters too.

3. **One gene → one protein is universal** — Alternative splicing, RNA genes, and polyproteins break this rule. Introduce complexity gradually but don't let students settle into oversimplified models.

4. **Epigenetics replaces genetics** — Some students think epigenetics is "beyond genes" or contradicts Mendelian inheritance. Emphasize it's an *additional layer* of regulation, not a replacement. DNA sequence still matters fundamentally.

5. **Mutations are always bad** — Pop culture and disease-focused education create this bias. Show neutral mutations (most) and beneficial mutations (rare but crucial for evolution and adaptation).

6. **Sequencing tells you gene function** — Students often think that once you sequence a genome, you automatically know what every gene does. Clarify that sequencing gives you the parts list; figuring out what they do (functional genomics) is a separate, harder problem.

7. **GWAS = causation** — Genome-wide association studies find correlations, not mechanisms. Students need to understand the difference between "this SNP is associated with height" and "this SNP causes height changes."

8. **All cancer is genetic** — True in the sense that cancer involves mutations, but students may confuse somatic mutations (acquired) with germline mutations (inherited). Most cancers are not hereditary.

9. **Genetic drift is natural selection** — Both change allele frequencies, but drift is random while selection is directional. Use concrete examples (bottleneck vs. fitness advantage) to distinguish them.

10. **Heritability = destiny** — High heritability doesn't mean unchangeable. Environment still matters, and heritability is population-specific, not individual.

11. **Linkage = causation** — Just because two genes are linked (physically close) doesn't mean they interact functionally.

12. **Recombination breaks genes** — Students sometimes think recombination happens within genes. Clarify it happens between genes (usually) and that it's a source of variation, not damage.

## Level Adjustments

### For Intermediate Learners Specifically

- **Assume Punnett square fluency** — don't reteach basic Mendelian genetics, but do go deeper into mechanisms
- **Introduce formalism gradually** — Hardy-Weinberg math, recombination frequency calculations, etc. should be explained conceptually first, then quantitatively
- **Use real tools** — genome browsers, NCBI databases, BLAST. Don't just read about genomics; do it.
- **Balance breadth and depth** — survey the field but go deep enough on key concepts (CRISPR mechanism, NGS, population genetics math) that students feel competent
- **Connect to current events** — CRISPR babies, COVID variants, personalized medicine. These make abstract concepts concrete and relevant.
- **Skip proof-heavy material** — save rigorous derivations of coalescent theory or molecular evolution models for advanced courses. Focus on intuition and application.
- **Emphasize computational literacy** — students at this level should be comfortable navigating databases, not just reading about them

### Compared to Other Levels

- **Beginners** would need more time on basics (DNA structure, Punnett squares, mitosis/meiosis) and less on genomics applications
- **Advanced learners** would dive into primary literature, rigorous math (coalescent models, selection theory), experimental design, and cutting-edge techniques (single-cell genomics, long-read sequencing, structural variant detection)

## Difficulty Progression

- **Lessons 1-6 (Classical genetics)** — Start at 2-3 difficulty. Students have seen this before, but we're going deeper. Review at lesson 6.
- **Lessons 7-13 (Molecular mechanisms)** — Ramp to 3-4. Central dogma is familiar but regulation and epigenetics are new and conceptually demanding. Review at 13.
- **Lessons 14-20 (Genomics)** — Stay at 3-4 but shift from conceptual to computational. Genome browsers and variant analysis require new skills. Review at 20.
- **Lessons 21-24 (Population/evolution)** — Peak difficulty (3-4). The math intimidates students and requires abstract thinking.
- **Lessons 25-29 (Applied)** — Back down to 2-3 for applications, which feel more concrete. Capstone at the end consolidates learning.

## Rabbit Holes

These are fascinating tangents to deploy strategically when students show curiosity or need enrichment:

- **The discovery of DNA structure** — Watson, Crick, Franklin, and the race to the double helix. Introduce when covering DNA structure (lesson 7). Great for showing how science actually works (competition, collaboration, controversy).

- **CRISPR discovery story** — from bacterial immunity to genome editing Nobel Prize. Drop this in during lesson 25. Shows how basic research leads to transformative applications.

- **Mitochondrial DNA and human migration** — maternal inheritance, molecular clocks, tracing human origins. Connect to molecular phylogenetics (lesson 23).

- **The ENCODE project** — debate over "junk DNA" and what fraction of the genome is functional. Relevant when discussing genome organization (lesson 14).

- **Golden Rice and GMO controversies** — genetic engineering meets politics and ethics. Good tie-in for lesson 28 on ethics.

- **Henrietta Lacks and HeLa cells** — ethics of genetic research, informed consent, immortal cell lines. Connect to cancer genomics (lesson 27) or general ethics discussions.

- **Genetic determinism debates** — IQ, behavior genetics, twin studies. Use cautiously when covering quantitative genetics (lesson 24) to show why heritability ≠ unchangeable.

- **CRISPR babies scandal** — He Jiankui's germline editing experiment. Perfect for lesson 28 on ethics.

- **Neanderthal genome project** — sequencing ancient DNA, what it tells us about human evolution. Tie to comparative genomics (lesson 17) or phylogenetics (lesson 23).

- **BRCA mutations and Angelina Jolie** — personalized medicine, risk vs. determinism, genetic testing decisions. Good for pharmacogenomics or variant analysis lessons.

## Engagement Strategies

- **Use Punnett squares sparingly** — intermediate students have done enough of these. Move to pedigrees and real data.
- **Emphasize hands-on tools** — every genomics lesson should involve clicking around in a genome browser or database
- **Current events hook** — start each module with a recent genetics/genomics headline
- **Historical experiments** — Mendel's peas, Morgan's flies, Avery-MacLeod-McCarty, Meselson-Stahl. Show the clever reasoning.
- **Ethical dilemmas** — genetics raises profound questions. Use them to make the material stick.
- **Cross-connections** — link genetics to medicine, agriculture, forensics, evolution, anthropology

## Pacing Notes

- **Classical genetics (lessons 1-6)** — move quickly; this is mostly review with deeper mechanisms
- **Molecular mechanisms (lessons 7-13)** — slow down for regulation and epigenetics; these are new and hard
- **Genomics (lessons 14-20)** — balance reading with doing. Students should spend time in browsers, not just reading about them.
- **Population genetics (lessons 21-24)** — the math is a barrier. Work through examples slowly. Consider extra review if students struggle.
- **Applied (lessons 25-29)** — these are high-interest and relatively accessible. Can move faster and let students explore.
