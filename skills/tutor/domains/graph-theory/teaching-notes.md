# Graph Theory — Teaching Notes

## Approach

Graph theory is fundamentally visual and computational — every concept should be accompanied by concrete examples students can draw and manipulate. At the intermediate level, balance intuition (drawing graphs, running algorithms by hand) with formal proofs (induction on trees, contradiction for Eulerian paths). Emphasize problem-solving and applications over memorizing theorems. Use real networks (social graphs, transportation, web links) to motivate abstract concepts. Computational exploration (using graph visualization tools) helps students develop intuition before tackling formal arguments.

## Common Misconceptions

1. **"Eulerian and Hamiltonian are basically the same thing"**
   - Why students get this wrong: Both involve traversing a graph completely, names sound similar
   - How to correct: Show the stark contrast — Eulerian has a simple parity criterion (odd degree vertices), while Hamiltonian is NP-complete with no known efficient test. Use the same small graph for both problems to highlight the difference.

2. **"Planar graphs are just graphs you can draw nicely"**
   - Why students get this wrong: Intuition suggests any graph can be untangled with clever drawing
   - How to correct: Draw K5 or K3,3 on paper and challenge students to eliminate crossings. After failing, introduce Kuratowski's theorem — some graphs are intrinsically non-planar. Show that planarity is a structural property, not a drawing skill.

3. **"The chromatic number equals the maximum degree"**
   - Why students get this wrong: Greedy algorithm uses Δ+1 colors, so students think that's always optimal
   - How to correct: Show counterexamples — bipartite graphs can have high degree but χ=2, cycles C_2k+1 have χ=3 regardless of degree. Teach Brooks' theorem as an *upper bound*, not an equality.

4. **"Trees must branch"**
   - Why students get this wrong: Visual bias toward branching diagrams
   - How to correct: Show that paths are trees, single edges are trees. Define trees formally (connected + acyclic) and derive the branching property from that, not the other way around.

5. **"If two graphs have the same degree sequence, they're the same graph"**
   - Why students get this wrong: Degree sequence captures local information, seems comprehensive
   - How to correct: Show two non-isomorphic graphs with the same degree sequence (e.g., K1,3 and a path of length 3 both have degree sequence [3,1,1,1] — wait, that's wrong. Better: a 4-cycle and K1,3 both have degree sequence [2,2,2,2] for cycle vs [3,1,1,1] for star — those differ. Use two different 6-vertex graphs with sequence [3,3,2,2,2,2]). This pushes students toward graph isomorphism thinking.

6. **"Flow through a network is like water pressure"**
   - Why students get this wrong: Physical analogy with pipes and pressure
   - How to correct: Clarify that flow obeys conservation (in = out) and capacity constraints (not exceeding edge limits), but doesn't "push" like pressure. Flow is a combinatorial optimization problem, not a physics simulation.

7. **"Hall's theorem is just saying 'there are enough partners'"**
   - Why students get this wrong: Informal statement sounds obvious
   - How to correct: Give a counterexample where global count looks good but local neighborhood constraints fail. Show a bipartite graph with |X|=|Y| but some subset S ⊂ X has |N(S)| < |S|. Hall's theorem gives the *precise* condition, not just a counting heuristic.

8. **"Dual graphs are unique for a planar graph"**
   - Why students get this wrong: Textbooks often show "the" dual without emphasizing drawing dependence
   - How to correct: Take K4 and show two different planar drawings (tetrahedron vs. one vertex inside a triangle) and construct different duals. Emphasize the dual depends on the *embedding*, not just the abstract graph.

9. **"You can always use BFS for shortest paths"**
   - Why students get this wrong: BFS is introduced early and works for unweighted graphs
   - How to correct: Show a weighted graph where BFS fails (early paths have higher weight). Explain BFS is shortest *hop* distance, Dijkstra is shortest *weighted* distance.

10. **"If a graph has no Eulerian circuit, it has no Eulerian path"**
    - Why students get this wrong: Circuit seems stronger, so "no circuit" sounds like total failure
    - How to correct: Show a graph with exactly 2 odd-degree vertices — has an Eulerian path but no circuit. Teach the two conditions separately: 0 odd vertices (circuit), exactly 2 odd vertices (path).

## Level Adjustments

### Intermediate vs. Beginner
- **More formalism**: Introduce formal proof techniques (induction for tree properties, contradiction for impossibility results)
- **Algorithmic thinking**: Go beyond definitions to algorithms (BFS/DFS, Dijkstra, greedy coloring, Ford-Fulkerson)
- **Complexity awareness**: Discuss P vs. NP informally when introducing Hamiltonian paths and coloring
- **Deeper theorems**: Prove Brooks' theorem, Kuratowski's theorem (sketch), max-flow min-cut theorem

### Intermediate vs. Advanced
- **Skip some proofs**: Don't prove Four Color Theorem (too complex), just state and use it
- **Less extremal graph theory**: Touch on Ramsey theory and random graphs only briefly
- **Less algebraic methods**: Mention spectral graph theory as a rabbit hole, don't derive eigenvalue results
- **Focus on applications**: Emphasize practical algorithms and modeling over pure combinatorics

## Rabbit Holes (Fascinating Connections)

1. **Spectral Graph Theory** — eigenvalues of the adjacency matrix reveal deep structural properties (expansion, connectivity, random walk mixing). Drop this in during the planarity module when discussing different graph invariants. Show that the second-smallest eigenvalue of the Laplacian measures connectivity.

2. **Graph Minors and Robertson-Seymour** — Kuratowski's theorem is the tip of an iceberg. Any graph property closed under minors has a forbidden-minor characterization. This generalizes planarity to a massive theorem about well-quasi-ordering. Mention during lesson 20.

3. **Ramsey Theory** — every sufficiently large graph contains either a large clique or a large independent set ("complete disorder is impossible"). Introduce during coloring module as the opposite question: instead of avoiding structure, we guarantee it exists.

4. **Network Science and Real-World Graphs** — power-law degree distributions, small-world phenomenon, preferential attachment. Drop during random graphs lesson (27) to connect abstract models to Facebook, protein networks, the web.

5. **Topological Graph Theory** — graphs on surfaces beyond the plane (torus, genus-g surfaces). The chromatic number of graphs on a torus can be up to 7 (Heawood conjecture). Mention during planarity module.

6. **The Tutte Polynomial** — a graph invariant that generalizes chromatic polynomial, flow polynomial, counts spanning trees, and more. Single polynomial, dozens of applications. Mention when discussing graph polynomials or counting problems.

## Difficulty Progression Notes

The curriculum follows this arc:

- **Lessons 1-6 (Foundations)**: Difficulty 1-3, building vocabulary and basic properties. Gentle entry.
- **Lessons 7-12 (Paths)**: Difficulty 2-3, introducing first computational problems. Eulerian paths are algorithmic but manageable; Hamiltonian paths introduce hardness.
- **Lessons 13-17 (Coloring)**: Difficulty 2-3, applications-focused. Coloring is intuitive but proofs (Brooks) require care.
- **Lessons 18-22 (Planarity)**: Difficulty 3-4, peak complexity. Euler's formula and Kuratowski's theorem are the hardest conceptual challenges.
- **Lessons 23-26 (Flow)**: Difficulty 3-4, algorithmic peak. Max-flow min-cut theorem is subtle; implementations are complex.
- **Lesson 27 (Advanced Topics)**: Difficulty 4, probabilistic methods. Random graphs introduce a different lens on graph structure.

Reviews (lessons 6, 12, 17, 22) provide cognitive breaks and consolidation. Difficulty drops to 1-2 for review lessons.

## Assessment Strategies

### Formative Assessment (During Lessons)
- **Draw this graph**: Given properties (degree sequence, planarity, connectivity), can the student sketch an example?
- **Run the algorithm**: Walk through BFS, Dijkstra, or Ford-Fulkerson on a small graph by hand
- **True/false with explanation**: "Every tree with n vertices has n-1 edges" (true, prove it)
- **Find the error**: Show a flawed proof or algorithm execution and ask students to identify the mistake

### Summative Assessment (End of Module)
- **Proof construction**: Prove that every tree on n vertices has at least 2 leaves (induction)
- **Algorithm design**: Design an algorithm to detect if a graph is bipartite (BFS + 2-coloring)
- **Modeling**: Model a real-world problem (exam scheduling, route optimization) as a graph problem and solve it
- **Counterexamples**: Disprove a false conjecture by constructing a counterexample graph

### Teach-Back Prompts
- Explain to a friend why the Königsberg bridge problem has no solution
- Describe how graph coloring solves exam scheduling
- Teach someone the difference between Eulerian and Hamiltonian paths
- Explain the max-flow min-cut theorem using a concrete network example

### Self-Check Questions
- Can I identify whether a graph is planar by inspection?
- Can I determine if a graph has an Eulerian path without trial-and-error?
- Can I construct the dual of a planar graph?
- Can I trace through Ford-Fulkerson to find max flow?
