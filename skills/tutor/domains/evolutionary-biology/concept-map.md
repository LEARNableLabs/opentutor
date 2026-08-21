# Concept Map — Evolutionary Biology and Phylogenetics

## Dependency Graph

```
Basic Genetics & Statistics (prerequisites)
    ↓
Natural Selection & Fitness
    ↓
    ├─→ Mechanisms of Evolution (mutation, drift, gene flow)
    │       ↓
    │   Hardy-Weinberg Equilibrium
    │       ↓
    │   Quantitative Genetics & Fitness Measurement
    │       ↓
    │   Evolutionary Constraints & Trade-offs
    │       ↓
    ├─→ Speciation Processes
    │       ↓
    │   Reproductive Isolation
    │       ↓
    │   Allopatric/Sympatric/Parapatric Speciation
    │
    └─→ Molecular Evolution
            ↓
        Neutral Theory
            ↓
        Sequence Divergence & Homology
            ↓
        ┌───────────────────────────────┐
        ↓                               ↓
    Phylogenetic Tree Reading      Character Evolution
        ↓                               ↓
    Nodes, Branches, Clades        Homology vs Homoplasy
        ↓                               ↓
        └───────────┬───────────────────┘
                    ↓
            Phylogenetic Inference Methods
                    ↓
        ┌───────────┼───────────────────┐
        ↓           ↓                   ↓
    Parsimony   Distance Methods   Statistical Methods
        ↓           ↓                   ↓
    Character   Neighbor-Joining    Maximum Likelihood
    States      UPGMA               Bayesian Inference
        ↓           ↓                   ↓
        └───────────┼───────────────────┘
                    ↓
            Bootstrap & Confidence
                    ↓
        Substitution Models (JC69, GTR, etc.)
                    ↓
            Molecular Clocks
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
    Strict Clocks          Relaxed Clocks
        ↓                       ↓
        └───────────┬───────────┘
                    ↓
            Calibration & Dating
                    ↓
                Applications
                    ↓
        ┌───────────┼───────────────┐
        ↓           ↓               ↓
    Epidemiology  Conservation  Systematics
```

## Core Conceptual Clusters

### Cluster 1: Evolutionary Mechanisms (Lessons 1-6)
**Foundation concepts that explain HOW evolution works**
- Natural selection and fitness
- Genetic drift, gene flow, mutation
- Hardy-Weinberg equilibrium (null model)
- Quantitative genetics
- Evolutionary constraints

**Why this order:** Start with natural selection (most intuitive), then show it's not the only mechanism. Hardy-Weinberg gives a mathematical baseline. Constraints explain why adaptation isn't perfect.

### Cluster 2: Speciation & Molecular Evolution (Lessons 7-12)
**What happens over longer timescales**
- Speciation processes and reproductive isolation
- Neutral theory and molecular evolution
- How genomes record history

**Why this order:** Bridges from population-level processes to species-level patterns. Molecular evolution sets up the data source for phylogenetics.

### Cluster 3: Tree Reading & Character Evolution (Lessons 13-16)
**Foundation for phylogenetics: interpreting trees**
- Tree structure (nodes, branches, clades)
- Reading relationships
- Homology vs homoplasy
- Common tree-reading errors

**Why this order:** Must be able to READ trees before you can BUILD them. Start visual/intuitive before diving into construction algorithms.

### Cluster 4: Tree Construction Methods (Lessons 17-21)
**Character-based and distance-based approaches**
- Parsimony
- Distance methods (NJ, UPGMA)
- Bootstrap support

**Why this order:** Classical methods first (parsimony, distance) before statistical methods. Build intuition with simpler algorithms.

### Cluster 5: Statistical Phylogenetics (Lessons 22-25)
**Modern likelihood-based and Bayesian approaches**
- Maximum likelihood
- Substitution models
- Bayesian inference and MCMC
- Real application: viral outbreak tracking

**Why this order:** Most mathematically intensive cluster. Requires all prior foundation. End with real-world viral tracking to show power of methods.

### Cluster 6: Molecular Clocks & Calibration (Lessons 26-28)
**Adding time to trees**
- Molecular clock hypothesis
- Rate variation and relaxed clocks
- Calibration with fossils
- Time-calibrated trees

**Why this order:** Requires understanding of substitution models and inference methods. Natural extension after learning to build trees.

### Cluster 7: Applications & Synthesis (Lessons 29-32)
**Real-world uses**
- Conservation genetics
- Viral epidemiology
- Critical evaluation of published work
- Synthesis and connections

**Why this order:** Capstone. Shows how all pieces connect in real research.

## Key Prerequisites Chains

### To understand Bayesian phylogenetics (Lesson 24):
1. Phylogenetic tree reading (13)
2. Maximum likelihood (22)
3. Substitution models (23)
4. Statistical inference concepts

### To understand molecular clocks (Lessons 26-28):
1. Molecular evolution and sequence divergence (11)
2. Phylogenetic inference methods (17-24)
3. Substitution models (23)

### To track viral outbreaks (Lessons 25, 30):
1. Tree reading (13-16)
2. Statistical inference (22-24)
3. Molecular clocks (26-27)

## Concepts with Multiple Dependencies

**Homoplasy** (Lesson 15)
- Requires: character evolution, tree reading, adaptation concepts
- Connects to: parsimony methods (why they can fail)

**Bootstrap/statistical support** (Lesson 20)
- Requires: understanding of phylogenetic inference, statistical reasoning
- Connects to: all construction methods (17-19, 22-24)

**Substitution models** (Lesson 23)
- Requires: molecular evolution (11), maximum likelihood (22)
- Feeds into: all statistical methods (24), molecular clocks (26-27)

## Spaced Review Strategy

**Review 1 (Lesson 6):** Mechanisms of evolution, fitness, Hardy-Weinberg
**Review 2 (Lesson 12):** Speciation, neutral theory, molecular evolution
**Review 3 (Lesson 21):** Phylogenetic tree reading, parsimony, distance methods
**Review 4 (Lesson 32):** Full synthesis connecting evolution theory to phylogenetic applications

## Common Misconceptions to Address

1. **"Evolution = natural selection"** → Show other mechanisms (lessons 2, 10)
2. **"Tree distance = similarity"** → Emphasize common ancestry, not overall similarity (lessons 13-14)
3. **"Ladders not bushes"** → No species is "more evolved" (lesson 13)
4. **"Molecular clock is always constant"** → Explain rate variation (lesson 27)
5. **"Phylogenetic trees prove relationships"** → Emphasize hypotheses and uncertainty (lessons 20, 24)
