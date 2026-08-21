# Paper Folding Mathematics — Concept Map

## Core Concepts (in learning order)

1. **Crease patterns** — graph representation of fold lines on paper before folding
2. **Mountain-valley folds** — two types of creases; assignment determines 3D structure
3. **Flat-foldability** — whether a crease pattern can be folded completely flat without tearing or stretching
4. **Reflections and symmetry** — single folds as geometric transformations
5. **Perpendicular bisectors** — fundamental construction from single folds
6. **Crease graphs** — planar graphs where vertices are crease intersections, edges are crease segments. Depends on: crease patterns
7. **Vertex degree** — number of creases meeting at a point; must be even for flat-foldability. Depends on: crease graphs
8. **Map folding problem** — combinatorial question of folding rectangular grids. Depends on: crease patterns, mountain-valley folds
9. **Single-vertex patterns** — crease patterns where all creases meet at one point. Depends on: crease graphs
10. **Sector angles** — angles between consecutive creases at a vertex. Depends on: single-vertex patterns
11. **Maekawa's theorem** — M - V = ±2 for flat-foldable single vertices. Depends on: mountain-valley folds, single-vertex patterns
12. **Kawasaki's theorem** — alternating sector angles sum to π. Depends on: sector angles, single-vertex patterns
13. **Mountain-valley assignments** — valid 2-colorings of creases satisfying Maekawa and Kawasaki. Depends on: Maekawa's theorem, Kawasaki's theorem
14. **Local vs global conditions** — single-vertex theorems necessary but not sufficient for multi-vertex patterns. Depends on: Maekawa's theorem, Kawasaki's theorem
15. **Layer ordering** — partial order determining which paper regions lie above/below others. Depends on: mountain-valley folds, flat-foldability
16. **Transitivity constraints** — if A is above B and B is above C, then A must be above C. Depends on: layer ordering
17. **Obstruction arguments** — proof technique showing cycles in layer ordering prevent flat folding. Depends on: transitivity constraints
18. **One-layer simple folds** — restricted model where no point is covered more than twice. Depends on: layer ordering
19. **NP-completeness of flat-foldability** — general decision problem is computationally hard. Depends on: local vs global conditions, computational complexity theory
20. **Circle packing** — geometric optimization technique used in origami design. Depends on: geometric optimization
21. **Huzita-Hatori axioms** — seven basic fold operations that can construct algebraic numbers. Depends on: reflections and symmetry, geometric constructions
22. **Universality theorems** — any polygon can be folded from a square; constructive proofs. Depends on: origami design algorithms
23. **Rigid origami** — folding where paper panels remain flat (no bending), only hinges at creases. Depends on: flat-foldability, kinematic constraints
24. **Deployable structures** — engineering application of rigid origami for space/architecture. Depends on: rigid origami

## Dependencies

### Foundational Chain
- **Crease patterns** → **crease graphs** → **single-vertex patterns** → **Maekawa & Kawasaki theorems** → **mountain-valley assignments**
  - This is the core theoretical spine. Students must build each step before advancing.

### Parallel Tracks
- **Geometric constructions track**: reflections → perpendicular bisectors → Huzita-Hatori axioms
- **Complexity track**: local conditions → global conditions → layer ordering → NP-completeness
- **Design track**: circle packing → TreeMaker → universality theorems

### Critical Bottlenecks

1. **Maekawa's theorem** — first non-obvious result; requires topological thinking about Euler characteristic
   - Students who don't grasp the parity argument struggle with all subsequent local-to-global reasoning
   
2. **Layer ordering** — transitioning from "does it fold?" to "how does it fold?"
   - Requires understanding partial orders, which may be unfamiliar to students without discrete math background
   
3. **Local vs global gap** — understanding that vertex conditions are necessary but not sufficient
   - Students often assume Maekawa + Kawasaki at every vertex guarantees global flat-foldability (wrong!)
   - Need concrete counterexamples to break this misconception

4. **NP-completeness reduction** — peak difficulty; requires both origami intuition and complexity theory
   - Students with weak CS theory background may need supplementary material on reductions

## Prerequisite Topics

- **Linear algebra** — needed for: reflections, transformations, rigid origami kinematics
- **Graph theory** — needed for: crease graphs, planar embeddings, layer ordering (partial orders)
- **Discrete mathematics** — needed for: combinatorial counting, parity arguments, proof techniques
- **Computational complexity** (basic)** — needed for: NP-completeness, algorithm design
- **Topology** (very basic) — needed for: Euler characteristic argument in Maekawa's theorem

## Misconception Prevention Map

| Concept | Common Misconception | Correction Point |
|---------|---------------------|------------------|
| Even degree requirement | "Odd-degree vertices might work in special cases" | Show impossibility via local flatness argument (Lesson 5) |
| Maekawa's theorem | "More mountains than valleys makes it 'taller'" | Explain topological/parity basis, not geometric height (Lesson 6) |
| Kawasaki's theorem | "Angles just need to sum to 2π total" | Emphasize **alternating** sums, show counterexample (Lesson 8) |
| Local sufficiency | "If all vertices are valid, the whole pattern folds" | Provide explicit counterexample with layer ordering conflict (Lesson 11) |
| Layer ordering | "Just pick any consistent ordering" | Show that some patterns have no consistent ordering (Lesson 12) |
| Computational hardness | "Checking flat-foldability is easy because Maekawa/Kawasaki are easy" | Distinguish vertex checking (polytime) from global (NP-complete) (Lesson 16) |

## Learning Trajectory

```
CONCRETE         → ABSTRACT
-------------------------
Physical folding → Crease patterns → Graph theory → Theorems → Computational complexity

SPECIFIC         → GENERAL
-------------------------
Single vertex    → Multiple vertices → Arbitrary patterns → Universal results

LOCAL            → GLOBAL
-------------------------
Maekawa/Kawasaki → Interactions → Layer ordering → NP-completeness
```

Students naturally want to jump from local theorems to global conclusions. The curriculum must repeatedly surface the gap between local and global conditions, using increasingly sophisticated tools (layer ordering, complexity theory) to characterize the gap.
