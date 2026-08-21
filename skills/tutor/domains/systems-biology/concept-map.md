# Systems Biology and Biological Networks — Concept Map

## Core Concepts (in learning order)

1. **Networks as graphs** — biological systems represented as nodes (genes, proteins, metabolites) and edges (interactions)
2. **Network topology** — structural properties: degree, clustering, path length. Depends on: 1
3. **Small-world networks** — high clustering, short paths; efficient information transfer. Depends on: 2
4. **Scale-free networks** — power-law degree distribution, hub nodes. Depends on: 2
5. **Network motifs** — recurring patterns (feed-forward loops, feedback loops) with specific functions. Depends on: 1, 2
6. **Gene regulatory networks (GRNs)** — transcription factors controlling gene expression. Depends on: 1, 5
7. **Metabolic networks** — enzymes catalyzing reactions, fluxes through pathways. Depends on: 1
8. **Protein-protein interaction networks** — physical interactions and functional complexes. Depends on: 1
9. **Signaling networks** — cascades transmitting extracellular signals to cellular responses. Depends on: 1
10. **Network visualization** — tools (Cytoscape) for exploring network structure. Depends on: 1-9
11. **Ordinary differential equations (ODEs)** — modeling production, degradation, dynamics. Depends on: 6
12. **Negative feedback** — self-regulation, stability, homeostasis. Depends on: 5, 11
13. **Boolean networks** — discrete ON/OFF logic, attractors. Depends on: 6
14. **Flux balance analysis (FBA)** — constraint-based modeling of metabolism. Depends on: 7
15. **Bistability** — two stable states from positive feedback. Depends on: 11, 12
16. **Homeostasis** — maintaining steady state despite perturbations. Depends on: 12
17. **Robustness** — system performance despite noise and variation. Depends on: 12, 16
18. **Oscillations** — rhythmic behavior (circadian clocks) from delays and feedback. Depends on: 11, 12
19. **Network inference** — reconstructing networks from experimental data. Depends on: 10, 11
20. **Centrality measures** — identifying important nodes (hubs, bottlenecks). Depends on: 2, 4
21. **Network medicine** — disease modules and drug target identification. Depends on: 8, 20
22. **Synthetic biology** — designing and building new biological circuits. Depends on: 5, 11, 15
23. **Multi-scale integration** — connecting molecular, cellular, and tissue-level networks. Depends on: 1-22

## Dependencies

### Foundational Layer (Concepts 1-5)
- **Network topology** (2) requires understanding **networks as graphs** (1) because you need the graph representation before measuring its properties
- **Small-world** (3) and **scale-free** (4) both build on **network topology** (2) because they describe specific topological patterns
- **Network motifs** (5) require **networks as graphs** (1) and **topology** (2) because motifs are small subgraphs with specific topological patterns

### Network Types Layer (Concepts 6-9)
- **GRNs** (6) build on **graphs** (1) and **motifs** (5) because regulatory logic is often understood through motifs like feed-forward loops
- All network types (6-9) depend on the graph foundation (1) but represent different biological scales and interaction types

### Modeling Layer (Concepts 11-15)
- **ODEs** (11) apply to **GRNs** (6) to model gene expression dynamics over time
- **Negative feedback** (12) requires **motifs** (5) and **ODEs** (11) because feedback is a motif whose dynamics are captured by ODEs
- **Boolean networks** (13) provide an alternative to **ODEs** for **GRNs** (6)
- **FBA** (14) applies specifically to **metabolic networks** (7) using stoichiometry and constraints
- **Bistability** (15) emerges from **ODEs** (11) with **positive feedback**, contrasting with **negative feedback** (12)

### Dynamics Layer (Concepts 16-18)
- **Homeostasis** (16) is achieved through **negative feedback** (12)
- **Robustness** (17) builds on **feedback** (12) and **homeostasis** (16), adding noise considerations
- **Oscillations** (18) require **ODEs** (11), **feedback** (12), and typically time delays

### Analysis Layer (Concepts 19-20)
- **Network inference** (19) uses **visualization** (10) and **ODEs** (11) to reverse-engineer networks from data
- **Centrality** (20) extends **topology** (2) and **scale-free** (4) concepts to quantify node importance

### Applications Layer (Concepts 21-23)
- **Network medicine** (21) applies **PPI networks** (8) and **centrality** (20) to find disease-relevant nodes
- **Synthetic biology** (22) applies **motifs** (5), **ODEs** (11), and **bistability** (15) to design circuits
- **Multi-scale integration** (23) is the grand synthesis of all prior concepts

## Prerequisite Topics

- **Basic biology** — needed for understanding genes, proteins, transcription, translation, signaling (all network types)
- **Calculus** — needed for ODEs (concept 11), stability analysis (12, 16), dynamics (18)
- **Linear algebra** — needed for matrix representations of networks, FBA (14), eigenvector centrality (20)
- **Elementary statistics** — needed for network inference (19), distinguishing correlation from causation
- **Basic programming** — needed for network visualization (10), simulation (11-15), analysis (19-20)

## Bottleneck Concepts

These concepts are critical checkpoints — if not mastered, later concepts become much harder:

1. **Networks as graphs** (1) — absolutely foundational; everything builds on this
2. **Network motifs** (5) — key to understanding design principles; feeds into GRNs, modeling, synthetic biology
3. **ODEs** (11) — gateway to all dynamical analysis; required for feedback, bistability, oscillations
4. **Negative feedback** (12) — central to homeostasis, robustness, control; appears everywhere in biology

## Common Learning Pathways

### Path 1: Structure → Dynamics
1 → 2 → 5 → 6 → 11 → 12 → 16
(graphs → topology → motifs → GRNs → ODEs → feedback → homeostasis)

### Path 2: Networks → Medicine
1 → 2 → 4 → 8 → 20 → 21
(graphs → topology → scale-free → PPI → centrality → network medicine)

### Path 3: Modeling → Design
1 → 5 → 11 → 12 → 15 → 22
(graphs → motifs → ODEs → feedback → bistability → synthetic biology)

## Concept Clusters

### Cluster A: Network Structure (foundational)
Concepts: 1, 2, 3, 4, 5, 10
Why grouped: All about the "what" of networks — their structure, patterns, visualization

### Cluster B: Network Types (application domains)
Concepts: 6, 7, 8, 9
Why grouped: Different biological scales where network thinking applies

### Cluster C: Mathematical Modeling (dynamics)
Concepts: 11, 12, 13, 14, 15
Why grouped: Tools for predicting behavior over time

### Cluster D: Systems Properties (emergent behavior)
Concepts: 16, 17, 18
Why grouped: High-level properties that emerge from network architecture

### Cluster E: Analysis and Applications (tools and impact)
Concepts: 19, 20, 21, 22, 23
Why grouped: Using network knowledge to solve real problems
