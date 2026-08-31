# Graph Theory — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 8 lessons (30%)
- **Socratic questions** — 6 lessons (22%)
- **real-world application challenges** — 5 lessons (19%)
- **review and consolidation sessions** — 4 lessons (15%)
- **curated resource exploration** — 2 lessons (7%)
- **teach-back exercises (student explains)** — 2 lessons (7%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 44% accessible (1-2), 37% standard (3), 19% challenging (4-5).

Difficulty peaks:
- Day 19: "Why does V - E + F always equal 2?" (difficulty 4)
- Day 20: "Which graphs can never be drawn flat?" (difficulty 4)
- Day 23: "How much traffic can this network handle?" (difficulty 4)
- Day 24: "Why is max flow always equal to min cut?" (difficulty 4)
- Day 27: "What makes random graphs so surprisingly structured?" (difficulty 4)

## Domain Hooks
1. **Spectral Graph Theory** — eigenvalues of the adjacency matrix reveal deep structural properties (expansion, connectivity, random walk mixing). Drop this in during the planarity module when discussing different graph invariants. Show that the second-smallest eigenvalue of the Laplacian measures connectivity.

2. **Graph Minors and Robertson-Seymour** — Kuratowski's theorem is the tip of an iceberg. Any graph property closed under minors has a forbidden-minor characterization. This generalizes planarity to a massive theorem about well-quasi-ordering. Mention during lesson 20.

3. **Ramsey Theory** — every sufficiently large graph contains either a large clique or a large independent set ("complete disorder is impossible"). Introduce during coloring module as the opposite question: instead of avoiding structure, we guarantee it exists.

4. **Network Science and Real-World Graphs** — power-law degree distributions, small-world phenomenon, preferential attachment. Drop during random gr

## Common Failure Modes
1. **"Eulerian and Hamiltonian are basically the same thing"**
   - Why students get this wrong: Both involve traversing a graph completely, names sound similar
   - How to correct: Show the stark contrast — Eulerian has a simple parity criterion (odd degree vertices), while Hamiltonian is NP-complete with no known efficient test. Use the same small graph for both problems to highlight the difference.

2. **"Planar graphs are just graphs you can draw nicely"**
   - Why students get this wrong: Intuition suggests any graph can be untangled with clever drawing
   - How to correct: Draw K5 or K3,3 on paper and challenge students to eliminate crossings. After failing, introduce Kuratowski's theorem — some graphs are intrinsically non-planar. Show that planarity is a structural property, not a drawing skill.

3. **"The chromatic number equals the maximum degree"**
   - Why students get this wrong: Greedy algorithm uses Δ+1 colors, so students think that's always optimal
   - How to correct:

## Vocabulary
Key terms for this domain: vertices, edges, graph representations, degree, handshaking lemma, degree sequence, even-odd parity, spanning trees, acyclic graphs, minimum spanning tree, adjacency matrix, adjacency list, space-time tradeoffs, connectivity, vertex cuts (and 74 more).