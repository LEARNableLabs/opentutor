# Complexity Science — Concept Map

## Core Concepts (in learning order)

1. **Complexity** — distinction between simple, complicated, and complex systems
2. **Emergence** — properties arising at collective level that cannot be predicted from individual components
3. **Self-organization** — spontaneous pattern formation without central control
4. **Criticality** — systems poised at phase transitions; power-law behavior
5. **Agent-based models** — computational approach to simulating complex systems
6. **Networks (graph theory)** — mathematical representation of relationships and interactions. Depends on: basic math
7. **Degree distribution** — characterizing connectivity patterns in networks. Depends on: Networks
8. **Small-world networks** — high clustering + short path lengths. Depends on: Networks, Degree distribution
9. **Scale-free networks** — power-law degree distributions; hub structure. Depends on: Networks, Degree distribution
10. **Preferential attachment** — mechanism generating scale-free structure. Depends on: Scale-free networks
11. **Network dynamics** — processes unfolding on network structure. Depends on: Networks
12. **Epidemic spreading** — SIR models and threshold phenomena. Depends on: Network dynamics, Scale-free networks
13. **Network robustness** — resilience to node/edge failure. Depends on: Network dynamics, Scale-free networks
14. **Community structure** — detecting modules and hierarchies. Depends on: Networks
15. **Natural selection** — variation, inheritance, differential fitness
16. **Fitness landscapes** — mapping genotype/phenotype to fitness. Depends on: Natural selection
17. **Path dependence** — historical contingency in evolution. Depends on: Fitness landscapes
18. **Genetic algorithms** — computational evolution for optimization. Depends on: Natural selection, Fitness landscapes
19. **Co-evolution** — reciprocal evolutionary influence between species. Depends on: Natural selection
20. **Game theory in evolution** — strategic interaction and cooperation. Depends on: Natural selection, Co-evolution
21. **Scaling laws** — power-law relationships in cities, organisms, organizations. Depends on: Emergence, Networks
22. **Agent-based economics** — modeling markets with heterogeneous adaptive agents. Depends on: Agent-based models, Game theory
23. **Criticality in the brain** — neural networks operating near phase transitions. Depends on: Criticality, Networks
24. **Resilience and tipping points** — regime shifts in ecosystems and social systems. Depends on: Criticality, Network dynamics

## Dependencies

- **Emergence requires self-organization** — emergent patterns arise through self-organizing dynamics
- **Networks enable emergence** — structure of interactions determines collective behavior
- **Scale-free networks explain robustness paradoxes** — vulnerable to targeted attacks but resilient to random failures
- **Fitness landscapes explain evolutionary dynamics** — topology of landscape determines adaptation pathways
- **Criticality connects multiple domains** — phase transitions appear in physical, biological, and social systems
- **Game theory bridges evolution and networks** — spatial structure changes evolutionary outcomes
- **Agent-based models unify the field** — computational approach applicable to all complex adaptive systems

## Bottlenecks

- **Understanding emergence** — conceptually difficult; students often confuse aggregation with emergence
- **Power laws and scale-free networks** — mathematical formalism requires comfort with logarithms and distributions
- **Fitness landscapes** — visualizing high-dimensional spaces is challenging
- **Network metrics** — calculating clustering, betweenness, centrality requires practice
- **Distinguishing correlation from mechanism** — scaling laws describe patterns but don't always explain causes

## Common Misconceptions

1. **Complexity = complicated** — complex systems have irreducible interdependence; complicated systems are just detailed
2. **Emergence is mystical** — emergence is scientifically explicable, not supernatural
3. **All networks are scale-free** — many real networks are not scale-free (e.g., power grids, highways)
4. **Evolution optimizes** — evolution finds local optima, not global ones; path-dependent
5. **More connections = better** — overly connected networks can be less robust, less modular
6. **Agent-based models predict** — ABMs explore possibilities and mechanisms, not precise predictions
7. **Criticality is rare** — many systems self-organize toward critical states

## Prerequisite Topics

- **Calculus** — needed for understanding dynamical systems, derivatives in landscapes
- **Linear algebra** — essential for network analysis (adjacency matrices, eigenvectors)
- **Probability and statistics** — distributions, stochastic processes, power laws
- **Programming** — building and analyzing agent-based models requires code
- **Basic graph theory** — nodes, edges, paths, cycles (can be learned just-in-time)
