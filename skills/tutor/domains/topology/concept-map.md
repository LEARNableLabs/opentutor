# Topology — Concept Map

## Core Concepts (in learning order)

1. **Homeomorphism** — continuous deformation without cutting or gluing; the central idea of topology
2. **Topological space** — a set with a collection of open sets satisfying axioms
3. **Open sets** — the fundamental building blocks that define a topology
4. **Basis** — a collection of open sets from which all other open sets can be built
5. **Neighborhoods** — sets containing a point and an open set around it
6. **Closure and limit points** — concepts of "nearness" without requiring distance
7. **Continuous function** — a function where preimages of open sets are open. Depends on: topological space, open sets
8. **Topological equivalence** — two spaces are homeomorphic if there exists a bijection with continuous inverse. Depends on: homeomorphism, continuous function
9. **Topological invariants** — properties preserved under homeomorphism (connectedness, compactness, genus)
10. **Connectedness** — a space that cannot be split into disjoint open sets. Depends on: topological space, open sets
11. **Path-connectedness** — any two points can be joined by a continuous path. Depends on: continuous function, connectedness
12. **Compactness** — every open cover has a finite subcover. Depends on: open sets, topological space
13. **Genus** — the number of "holes" in a surface; a topological invariant. Depends on: topological invariants, homeomorphism
14. **Orientability** — whether a surface has a consistent "inside" and "outside". Depends on: topological space
15. **Möbius strip** — a non-orientable surface with one side and one edge. Depends on: orientability
16. **Euler characteristic** — V - E + F for a triangulated surface; a topological invariant. Depends on: topological invariants
17. **Classification of surfaces** — every closed surface is homeomorphic to a sphere, torus, or connected sum. Depends on: genus, orientability, homeomorphism
18. **Homotopy** — continuous deformation of one function into another. Depends on: continuous function
19. **Loop** — a path that starts and ends at the same point. Depends on: continuous function
20. **Fundamental group** — the group of homotopy classes of loops based at a point. Depends on: homotopy, loop, path composition
21. **Path composition** — concatenating two paths to form a new path. Depends on: continuous function
22. **Simply connected** — a space with trivial fundamental group (every loop can shrink to a point). Depends on: fundamental group
23. **Knot** — an embedding of a circle in 3-dimensional space. Depends on: continuous function, topological space
24. **Knot diagram** — a 2D projection of a knot with crossing information. Depends on: knot
25. **Reidemeister moves** — three local moves that relate equivalent knot diagrams. Depends on: knot diagram
26. **Ambient isotopy** — continuous deformation of knots in 3D space. Depends on: homeomorphism, homotopy
27. **Knot invariants** — properties that are the same for equivalent knots (tricolorability, polynomials). Depends on: topological invariants, knot
28. **Alexander polynomial** — a polynomial knot invariant computed from a knot diagram. Depends on: knot invariants
29. **Jones polynomial** — a more powerful polynomial invariant discovered in the 1980s. Depends on: knot invariants
30. **Linking number** — an invariant measuring how two knots wind around each other. Depends on: knot invariants

## Dependencies

### Foundation Layer
- **Open sets** are the primitive concept defining topology — everything else builds from here
- **Topological space** is just a set + a collection of open sets satisfying axioms
- **Basis** provides a way to construct topologies from simpler building blocks

### Continuity and Equivalence
- **Continuous functions** require the notion of open sets (preimages must be open)
- **Homeomorphisms** are continuous bijections with continuous inverses — they define topological equivalence
- **Topological invariants** are properties preserved by homeomorphisms; they're how we prove things are NOT homeomorphic

### Connectedness and Compactness
- **Connectedness** depends only on the open set structure
- **Path-connectedness** is stronger and requires continuous functions
- **Compactness** is subtle and powerful; it generalizes "closed and bounded" from metric spaces

### Surfaces
- **Genus** counts holes; it's a topological invariant
- **Orientability** is independent of genus (Möbius strip has genus 0 but is non-orientable)
- **Euler characteristic** χ relates to genus: χ = 2 - 2g for orientable surfaces
- **Classification theorem** says genus + orientability completely determines a closed surface (up to homeomorphism)

### Algebraic Topology
- **Homotopy** generalizes the idea of "same shape" to functions
- **Fundamental group** assigns an algebraic object (a group) to each space
- **Path composition** gives the group operation for the fundamental group
- **Simply connected** spaces have π₁ = {e} (the trivial group)

### Knot Theory
- **Knots** are topological objects embedded in R³
- **Knot diagrams** are how we visualize and work with knots
- **Reidemeister moves** characterize when two diagrams represent the same knot
- **Knot invariants** help distinguish non-equivalent knots
- **Polynomial invariants** (Alexander, Jones) are computable from diagrams and very powerful

## Bottlenecks

### Bottleneck 1: Abstract Definition of Topology
Students struggle with the axiomatic definition of open sets because it seems arbitrary. The coffee cup = donut example MUST come first to motivate the whole subject.

### Bottleneck 2: Homeomorphism vs. Diffeomorphism
Intermediate students may confuse topological equivalence with smoother notions. Emphasize: topology cares about continuous deformation, NOT smooth structure.

### Bottleneck 3: Compactness
This is the single hardest concept in point-set topology. The open cover definition is non-intuitive. Use concrete examples (closed intervals, circles, tori) before the general definition.

### Bottleneck 4: Fundamental Group Computation
Computing π₁ requires understanding both group theory and homotopy. The circle (π₁(S¹) = ℤ) is the crucial example that unlocks everything else.

### Bottleneck 5: Knot Invariants
Students expect invariants to distinguish ALL knots, but they don't. Emphasize that invariants can prove knots are different, but not always that they're the same.

## Common Misconceptions

1. **"Topology is just rubber sheet geometry"** — This misses the algebraic and combinatorial aspects
2. **"Homeomorphic = looks similar"** — No! A line segment and a circle are not homeomorphic despite both being 1D curves
3. **"The torus has two holes"** — Genus counts handles/tunnels, not "holes you can see"
4. **"Compactness means finite"** — No! The closed interval [0,1] is compact but infinite
5. **"All knots can be untangled"** — The unknot is special; most knots are genuinely knotted
6. **"The fundamental group measures 'number of holes'"** — It's subtler; π₁(sphere) = {e} but π₁(torus) = ℤ × ℤ

## Prerequisite Topics

- **Set theory** — needed for definition of topological spaces, functions, open/closed sets
- **Group theory** — needed for fundamental group, algebraic topology
- **Linear algebra** — needed for understanding vector spaces over knot polynomials, homology
- **Multivariable calculus** — helpful for intuition about surfaces, manifolds, continuous functions
- **Proof techniques** — especially proof by contradiction, used constantly in topology

## Learning Arcs

### Arc 1: Intuition to Formalism (Lessons 1-6)
Start with coffee cup = donut → formalize as homeomorphism → define topological spaces → define continuous functions → verify coffee cup = donut formally

### Arc 2: Building Invariants (Lessons 7-16)
Connectedness and compactness → genus and orientability → Euler characteristic → classification of surfaces

### Arc 3: Algebra Meets Geometry (Lessons 17-21)
Homotopy → fundamental group → computing π₁ for basic spaces → functoriality

### Arc 4: Knots and Applications (Lessons 22-27)
Knot diagrams → Reidemeister moves → basic invariants → polynomial invariants → real-world applications
