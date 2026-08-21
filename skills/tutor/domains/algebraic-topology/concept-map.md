# Algebraic Topology — Concept Map

## Core Concepts (in learning order)

1. **Homotopy of paths** — continuous deformation between paths; fundamental equivalence relation
2. **Fundamental group** — algebraic structure capturing loops in a space. Depends on: homotopy of paths
3. **Covering space** — space that locally looks like multiple copies of a base space
4. **Lifting property** — ability to lift paths/homotopies to covering spaces. Depends on: covering space, fundamental group
5. **π₁(S¹) = ℤ** — the integers measure how many times a loop winds around the circle. Depends on: fundamental group, covering space
6. **Van Kampen's theorem** — method to compute fundamental groups by decomposition. Depends on: fundamental group
7. **Universal covering space** — the unique simply connected cover. Depends on: covering space, fundamental group
8. **Classification of covering spaces** — bijection between covers and subgroups of π₁. Depends on: covering space, fundamental group
9. **Homology intuition** — algebraic invariant measuring "holes" of different dimensions
10. **Simplicial complex** — combinatorial triangulation of a space
11. **Chain complex** — algebraic structure of groups with boundary operators. Depends on: simplicial complex
12. **∂∂ = 0** — fundamental property: boundary of a boundary is zero. Depends on: chain complex
13. **Homology groups** — quotient Ker(∂)/Im(∂) measuring holes. Depends on: chain complex, ∂∂ = 0
14. **Simplicial homology** — homology computed from triangulations. Depends on: simplicial complex, homology groups
15. **CW complex** — space built by attaching cells; more flexible than simplicial complexes
16. **Cellular homology** — homology computed from CW structure. Depends on: CW complex, homology groups
17. **Mayer-Vietoris sequence** — long exact sequence for computing homology by decomposition. Depends on: homology groups
18. **Euler characteristic** — alternating sum of Betti numbers; topological invariant. Depends on: homology groups
19. **Brouwer fixed point theorem** — every continuous map D^n → D^n has a fixed point. Depends on: homology groups, degree theory
20. **Classification of surfaces** — genus and orientability classify closed surfaces. Depends on: homology groups, Euler characteristic
21. **Cohomology** — dual theory with contravariant functoriality. Depends on: homology groups
22. **Cup product** — multiplicative structure on cohomology. Depends on: cohomology
23. **Cohomology ring** — ring structure from cup product. Depends on: cup product
24. **Poincaré duality** — isomorphism between homology and cohomology for manifolds. Depends on: homology groups, cohomology

## Dependencies

### Fundamental Group Chain
- **Fundamental group** requires **homotopy of paths** because we need to identify homotopic loops to form the group structure
- **Van Kampen's theorem** builds on **fundamental group** to enable computation via decomposition into simpler pieces
- **Covering spaces** and **fundamental group** are intimately connected: subgroups of π₁(X) correspond to covering spaces
- **Lifting property** depends on both **covering space** structure and **fundamental group** to characterize when lifts exist
- **π₁(S¹) = ℤ** is the key computational example, using both **fundamental group** and **covering space** (R → S¹)

### Homology Foundation
- **Chain complex** structure depends on **simplicial complex** (or CW complex) to define the algebraic objects
- **∂∂ = 0** is the fundamental algebraic property that makes **chain complex** have meaningful homology
- **Homology groups** are defined as Ker(∂)/Im(∂), so they require **chain complex** and **∂∂ = 0**
- **Simplicial homology** is the concrete realization using **simplicial complex** and **homology groups**
- **Cellular homology** generalizes to **CW complex** structure while maintaining **homology groups** framework

### Computational Tools
- **Mayer-Vietoris sequence** is a powerful computational tool for **homology groups**, breaking spaces into manageable pieces
- **Euler characteristic** is derived from **homology groups** (alternating sum of Betti numbers)
- **Brouwer fixed point theorem** uses degree theory, which depends on **homology groups** to define and compute degrees

### Cohomology Branch
- **Cohomology** is the dual construction to **homology groups**, using Hom functors
- **Cup product** is defined on **cohomology** and has no direct homology analog
- **Cohomology ring** emerges from **cup product** structure, giving richer algebraic information
- **Poincaré duality** relates **homology groups** and **cohomology** for oriented closed manifolds

## Bottlenecks

### Critical Conceptual Gates
1. **Understanding homotopy** — without grasping continuous deformation, fundamental group makes no sense
2. **∂∂ = 0** — this is the algebraic heart of homology; students must internalize why boundaries have no boundary
3. **Quotient structure Ker/Im** — homology is defined as a quotient; students need comfort with quotient groups
4. **Functoriality** — homology and fundamental group are functors; understanding naturality is crucial for proofs

### Computational Challenges
1. **Van Kampen's theorem** — requires facility with group presentations and amalgamated products
2. **Mayer-Vietoris sequence** — long exact sequences are powerful but initially overwhelming
3. **Cellular homology** — computing boundary maps requires understanding attaching maps and degrees
4. **Cup product** — most abstract concept, requires understanding of tensor products and functoriality

## Common Misconceptions

1. **"Homotopy is just topology"** — students confuse homotopy (up to continuous deformation) with homeomorphism (bijective continuous map with continuous inverse)
2. **"All holes are created equal"** — students don't distinguish between 0-dimensional holes (components), 1-dimensional (loops), 2-dimensional (voids), etc.
3. **"Fundamental group sees all holes"** — π₁ only detects 1-dimensional holes; higher homotopy groups or homology are needed for higher dimensions
4. **"Homology and homotopy are the same"** — they're related but distinct; homology is abelian and computable, homotopy groups are generally not
5. **"Cycles and boundaries are the same"** — cycles are closed (∂c = 0), boundaries are c = ∂d; boundaries are always cycles, but not conversely
6. **"Cohomology is just dual homology"** — while related by duality, cohomology has richer structure (cup product, ring structure) not present in homology
7. **"CW complexes are just simplicial complexes"** — CW complexes are more general and flexible; not everything admits a simplicial structure

## Prerequisite Topics

- **Point-set topology** — needed for: open sets, continuity, compactness, quotient topology (all concepts)
- **Group theory** — needed for: fundamental group, homology groups, free products, quotients, presentations
- **Linear algebra** — needed for: chain complexes, kernel/image, exact sequences, computing homology groups
- **Category theory (basic)** — helpful for: functoriality, naturality, commutative diagrams (not strictly required at intermediate level but illuminating)
- **Real analysis** — needed for: understanding continuous maps, metric spaces, convergence
