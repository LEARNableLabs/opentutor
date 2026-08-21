# Research Summary — Paper Folding Mathematics

## Overview

The mathematics of paper folding (origami) is a rich interdisciplinary field combining discrete geometry, graph theory, computational complexity, and mechanical engineering. At its core lies the question of flat-foldability: given a crease pattern, can it be folded flat without tearing or stretching the paper?

## Major Subtopics

### 1. Flat-Foldability Theory
- **Single-vertex conditions**: Maekawa's theorem (M-V = ±2), Kawasaki's theorem (alternating angle sums to π)
- **Multi-vertex crease patterns**: global constraints beyond local vertex conditions
- **Layer ordering**: determining which parts of the paper lie above/below others
- **One-layer simple folds**: restricted class where no point is covered more than twice

### 2. Computational Origami
- **Complexity results**: NP-hard for general flat-foldability, decidability questions
- **Algorithms**: efficient checks for single vertices, approximation algorithms
- **Map folding problem**: folding rectangular grids (classic NP-complete problem)
- **Origami design**: inverse problem of finding crease patterns for target shapes

### 3. Rigid Origami
- **Continuous folding motions**: when paper panels stay flat (no bending)
- **Kinematic models**: degrees of freedom, rigidity theory
- **Engineering applications**: deployable structures, metamaterials

### 4. Mathematical Generalizations
- **Origami axioms**: Huzita-Hatori axioms as geometric constructions (solving cubics)
- **Universal theorems**: any polygon can be folded from a square
- **Connections to other fields**: protein folding, computational topology

## Key Academic Sources

### Foundational Papers
- Maekawa, J. (1989) — conditions on mountain-valley assignments at single vertices
- Kawasaki, T. (1989) — angle sum theorem for flat-foldable vertices
- Demaine & O'Rourke (2007) — *Geometric Folding Algorithms* textbook
- Hull, T. (1994-2011) — combinatorics of flat folds, origami axioms

### Research Groups
- **MIT Computational Geometry** (Erik Demaine) — complexity, universality results
- **Robert Lang** — computational origami design (TreeMaker software)
- **Thomas Hull** (Western New England) — pedagogical approaches, combinatorics
- **Tomohiro Tachi** (U Tokyo) — rigid origami simulation tools (Freeform Origami)

### Course Materials
- MIT 6.849 *Geometric Folding Algorithms* (Demaine) — graduate-level computational geometry
- *Project Origami* (Thomas Hull) — activities book bridging K-12 and undergraduate
- Various computational geometry courses covering map folding as NP-completeness example

## Available Educational Resources

### Textbooks & Books
- *Geometric Folding Algorithms* (Demaine & O'Rourke, 2007) — comprehensive reference
- *Origami Design Secrets* (Robert Lang, 2003) — practical design with mathematical foundations
- *Project Origami* (Thomas Hull, 2012) — activities-based approach

### Video Lectures
- Numberphile episodes on origami mathematics
- Erik Demaine's guest lectures (various universities)
- Robert Lang TED talks on mathematical origami design
- 3Blue1Brown tangential coverage in geometry series

### Interactive Tools
- **Freeform Origami** (Tachi) — rigid origami simulator
- **TreeMaker** (Lang) — origami base design from stick figure input
- **Origami Simulator** (Amanda Ghassaei) — web-based crease pattern folding
- Various GeoGebra demonstrations of Kawasaki/Maekawa theorems

### Papers & Surveys
- arXiv computational geometry papers (cs.CG tag + "origami")
- Erik Demaine's publication list (extensive origami section)
- Thomas Hull's pedagogical papers in mathematics education journals

## Target Audience Considerations

For **intermediate** level:
- Assume comfort with linear algebra (vectors, matrices, linear transformations)
- Basic graph theory helpful but can be introduced
- Discrete mathematics background (combinatorics, proof techniques)
- Can handle proofs but keep them constructive/visual where possible
- Should connect to applications to maintain engagement

## Curriculum Design Notes

- Start concrete (fold physical paper) before formal definitions
- Build single-vertex theory completely before multi-vertex
- Interleave computational complexity results with constructive algorithms
- Include hands-on challenges (design simple origami patterns)
- Peak difficulty: NP-completeness proofs, layer ordering algorithms
- End with applications to show real-world relevance

## Resource Gaps

Due to web search budget limits, actual URLs should be verified. Known reliable sources:
- Erik Demaine's MIT faculty page and course sites
- Robert Lang's langorigami.com
- Thomas Hull's faculty page at Western New England University
- arXiv.org (cs.CG category)
- YouTube channels (Numberphile, 3Blue1Brown, Mathologer)
