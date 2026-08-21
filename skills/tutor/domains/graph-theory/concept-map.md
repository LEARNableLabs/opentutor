# Graph Theory — Concept Map

## Core Concepts (in learning order)

1. **Graphs and Vertices** — discrete structures representing relationships
2. **Edges and Adjacency** — connections between vertices, directed vs undirected
3. **Degree** — number of connections per vertex
4. **Graph Representations** — adjacency matrix, adjacency list, edge list. Depends on: Edges
5. **Handshaking Lemma** — sum of degrees is twice the number of edges. Depends on: Degree
6. **Paths and Walks** — sequences of vertices connected by edges. Depends on: Edges
7. **Trees** — connected acyclic graphs, fundamental building blocks. Depends on: Paths
8. **Spanning Trees** — minimal connected subgraphs. Depends on: Trees
9. **Connectivity** — vertex/edge cuts, k-connectivity. Depends on: Paths
10. **Eulerian Paths** — paths traversing every edge exactly once. Depends on: Degree, Paths
11. **Eulerian Circuits** — closed Eulerian paths. Depends on: Eulerian Paths
12. **Hamiltonian Paths** — paths visiting every vertex exactly once. Depends on: Paths
13. **Hamiltonian Cycles** — closed Hamiltonian paths. Depends on: Hamiltonian Paths
14. **Bipartite Graphs** — graphs with two independent vertex sets. Depends on: Graphs
15. **Matchings** — sets of non-adjacent edges. Depends on: Bipartite Graphs, Edges
16. **Hall's Theorem** — conditions for perfect matchings. Depends on: Matchings
17. **Shortest Paths** — BFS, Dijkstra's algorithm. Depends on: Paths
18. **Graph Coloring** — assigning colors to vertices with constraints. Depends on: Adjacency
19. **Chromatic Number** — minimum colors needed. Depends on: Graph Coloring
20. **Brooks' Theorem** — upper bound on chromatic number. Depends on: Chromatic Number, Degree
21. **Planar Graphs** — graphs drawable without edge crossings. Depends on: Graphs
22. **Faces** — regions in planar graph drawings. Depends on: Planar Graphs
23. **Euler's Formula** — V - E + F = 2 for connected planar graphs. Depends on: Faces, Planar Graphs
24. **Kuratowski's Theorem** — characterization via forbidden minors (K5, K3,3). Depends on: Planar Graphs
25. **Dual Graphs** — face-vertex correspondence in planar graphs. Depends on: Faces, Euler's Formula
26. **Network Flow** — flow conservation and capacity constraints. Depends on: Paths, Graphs
27. **Maximum Flow** — largest flow through a network. Depends on: Network Flow
28. **Minimum Cut** — smallest capacity cut separating source and sink. Depends on: Connectivity, Network Flow
29. **Max-Flow Min-Cut Theorem** — equivalence of max flow and min cut. Depends on: Maximum Flow, Minimum Cut
30. **Random Graphs** — probabilistic graph models, phase transitions. Depends on: Graphs, Connectivity

## Dependencies

### Foundational Chain
- **Degree** requires understanding **Edges and Adjacency** because degree counts edge endpoints
- **Handshaking Lemma** builds on **Degree** because it's a global constraint on degree sums
- **Paths** require **Edges** because paths are sequences of edges
- **Trees** require **Paths** and the concept of acyclic structures

### Eulerian vs Hamiltonian
- **Eulerian paths** depend on **Degree** (even/odd degree determines existence)
- **Hamiltonian paths** only depend on **Paths** conceptually, but solution difficulty is vastly different
- This is a key conceptual bottleneck: students expect Hamiltonian to be similar to Eulerian, but Eulerian has a simple degree-based criterion while Hamiltonian is NP-complete

### Coloring Dependencies
- **Graph Coloring** requires solid understanding of **Adjacency** (adjacent vertices can't share colors)
- **Brooks' Theorem** connects **Chromatic Number** and **Degree** in a non-obvious way
- **Four Color Theorem** (mentioned but not proved) shows planarity affects chromatic number

### Planarity Cluster
- **Euler's Formula** is the central result, connecting vertices, edges, and faces
- **Kuratowski's Theorem** provides a forbidden-minor characterization
- **Dual Graphs** leverage the face structure from Euler's Formula
- This module is highly interconnected and should be taught as a cohesive unit

### Network Flow
- **Max-Flow Min-Cut Theorem** unifies two perspectives on network capacity
- Depends on both **Paths** (augmenting paths) and **Connectivity** (cuts)
- Ford-Fulkerson algorithm bridges theory and computation

## Bottleneck Concepts

These concepts unlock many downstream topics:

1. **Paths** — foundation for connectivity, Euler, Hamilton, flow, shortest paths
2. **Degree** — critical for handshaking lemma, Eulerian paths, Brooks' theorem
3. **Bipartite Graphs** — special structure enabling matching theorems and efficient algorithms
4. **Euler's Formula** — central to all planarity results
5. **Network Flow** — unifies many optimization problems (matching, connectivity, cuts)

## Mind-Blowing Moments

- **Handshaking Lemma**: Such a simple statement (sum of degrees is even) with profound implications
- **Eulerian Path Criterion**: The elegant odd-degree characterization feels like magic
- **Four Color Theorem**: Only proven via computer in 1976, controversial until alternate proofs emerged
- **Max-Flow Min-Cut**: Two completely different perspectives on capacity turn out to be equal
- **Kuratowski's Theorem**: All non-planar graphs contain K5 or K3,3 as a minor — beautiful forbidden structure
- **Random Graphs Phase Transition**: Adding edges randomly creates giant connected component suddenly, not gradually

## Common Misconceptions

1. **Confusing paths and walks** — students often don't distinguish between allowing repeated vertices
2. **Eulerian = Hamiltonian** — students assume similar-sounding problems have similar difficulty
3. **Planarity is about drawing skill** — students think "I just need to redraw it cleverly" rather than understanding intrinsic graph properties
4. **Chromatic number = max degree** — students forget Brooks' theorem is an upper bound, not equality
5. **Trees must look "tree-like"** — students expect branching structures, miss that K2 and stars are trees
6. **Dual graphs are unique** — students don't realize different planar drawings give different duals
7. **Flow can't exceed capacity** — students sometimes add flows incorrectly or violate conservation
8. **Matching requires all vertices** — students confuse matching with perfect matching

## Prerequisite Topics

- **Set Theory** — needed for vertex sets, edge sets, subset reasoning
- **Relations** — adjacency as a relation, equivalence relations for connectivity
- **Proof by Induction** — essential for tree properties, many graph theorems
- **Proof by Contradiction** — used in Eulerian path theorem, planarity proofs
- **Basic Combinatorics** — counting arguments, pigeonhole principle for graph proofs
- **Algorithm Basics** — needed for BFS, DFS, Dijkstra, flow algorithms
