# Network Science — Concept Map

## Core Concepts (in learning order)

1. **Network representation** — graphs as models of relationships: nodes (entities) and edges (connections)
2. **Adjacency matrix** — matrix representation of network connections
3. **Edge list** — list-based representation of network connections
4. **Directed vs undirected** — networks where relationships are symmetric or asymmetric
5. **Degree** — number of connections a node has. Depends on: network representation
6. **Degree distribution** — statistical pattern of connectivity across all nodes. Depends on: degree
7. **Centrality** — measures of node importance in a network. Depends on: network representation
8. **Degree centrality** — importance based on number of connections. Depends on: degree, centrality
9. **Betweenness centrality** — importance based on position in paths between other nodes. Depends on: centrality, shortest paths
10. **Shortest paths** — minimum-length paths between nodes. Depends on: network representation
11. **Average path length** — typical distance between nodes in a network. Depends on: shortest paths
12. **Small-world phenomenon** — surprisingly short paths in large networks. Depends on: average path length
13. **Clustering coefficient** — tendency for neighbors to be connected to each other. Depends on: network representation
14. **Random graphs** — networks formed by random edge placement (Erdős-Rényi model). Depends on: network representation
15. **Small-world model** — networks with high clustering and short paths (Watts-Strogatz). Depends on: clustering coefficient, average path length
16. **Power-law distribution** — distribution where a few nodes have many connections and most have few. Depends on: degree distribution
17. **Scale-free networks** — networks with power-law degree distributions. Depends on: power-law distribution
18. **Preferential attachment** — growth mechanism where new nodes connect to well-connected nodes. Depends on: degree
19. **Barabási-Albert model** — generates scale-free networks through preferential attachment. Depends on: preferential attachment, scale-free networks
20. **Epidemic models** — mathematical models of disease spread (SIS, SIR). Depends on: network representation
21. **Basic reproduction number (R0)** — expected number of new infections from one infected individual. Depends on: epidemic models
22. **Epidemic threshold** — critical condition for outbreak to occur. Depends on: R0, degree distribution
23. **Targeted interventions** — strategies that focus on specific nodes (e.g., hubs). Depends on: centrality, epidemic models
24. **Community structure** — groups of nodes more densely connected internally than externally. Depends on: clustering coefficient
25. **Modularity** — measure of community strength in a network. Depends on: community structure
26. **Information cascades** — chain reactions of adoption or spread through a network. Depends on: network representation
27. **Influence maximization** — identifying nodes to maximize spread. Depends on: centrality, information cascades
28. **Homophily** — tendency for similar nodes to connect. Depends on: network representation

## Dependencies

- **Degree distribution** requires understanding **degree** because you need to count connections for each node before analyzing the overall pattern
- **Centrality measures** build on **network representation** because you need to understand the graph structure to define importance
- **Small-world phenomenon** requires **average path length** because it describes networks where this metric is surprisingly small
- **Scale-free networks** depend on **power-law distribution** and **degree distribution** because they're defined by this specific statistical pattern of connectivity
- **Epidemic threshold** combines **R0** and **degree distribution** because outbreak conditions depend on both transmission rate and network structure
- **Targeted interventions** require **centrality** and **epidemic models** because you need to identify important nodes and model disease dynamics
- **Community detection** builds on **clustering coefficient** because communities exhibit high local clustering
- **Influence maximization** requires understanding **centrality** and **information cascades** because you identify influential nodes based on their position and cascade potential

## Bottleneck Concepts

**Degree and degree distribution** — foundational for almost everything else. Students must be comfortable with this before advancing.

**Network representation (adjacency matrix/list)** — computational understanding is essential for implementing analysis and simulations.

**Centrality** — central concept that bridges structure and dynamics. Multiple types with different interpretations.

**R0 (basic reproduction number)** — key threshold concept connecting network structure to epidemic dynamics. Abstract but critical.

## Common Misconceptions

**"Centrality is the same as degree"** — Degree centrality is one measure, but betweenness, closeness, and eigenvector centrality capture different aspects of importance. Context matters.

**"Random networks represent real networks"** — Most real networks are NOT random. They exhibit small-world or scale-free properties that random models don't capture.

**"Hubs make networks fragile"** — Scale-free networks are robust to random failures but vulnerable to targeted attacks. The structure creates both strength and weakness.

**"Epidemics always spread if R0 > 1"** — On networks, there's a structural epidemic threshold that depends on degree distribution. R0 > 1 is necessary but not always sufficient.

**"Communities are the same as clusters"** — Clustering coefficient measures local triadic closure. Community structure is about mesoscale groups. Related but distinct.

**"Removing the most connected node stops epidemics best"** — Sometimes betweenness centrality (bridge nodes) matters more than degree centrality. Network topology matters.

## Prerequisite Topics

- **Basic probability** — needed for random graphs, degree distributions, epidemic models
- **Linear algebra (matrices and vectors)** — needed for adjacency matrices, eigenvector centrality, matrix operations
- **Python programming** — needed for implementing network analysis with NetworkX
- **Basic statistics** — needed for understanding distributions, averages, variance
