# Knot Theory — Concept Map

## Core Concepts (in learning order)

1. **Knot (mathematical)** — embedding of circle in 3-space, studied up to ambient isotopy
2. **Ambient isotopy** — continuous deformation of knot without self-intersection
3. **Knot diagram** — projection of knot onto plane with over/under crossing information
4. **Regular projection** — projection where only two strands cross at each crossing point
5. **Reidemeister moves** — three local moves that relate equivalent knot diagrams. Depends on: knot diagram
6. **Knot equivalence** — two knots are equivalent if related by Reidemeister moves. Depends on: Reidemeister moves
7. **Knot invariant** — property that remains constant under ambient isotopy. Depends on: knot equivalence
8. **Connected sum** — operation gluing two knots together. Depends on: knot definition
9. **Prime knot** — knot that cannot be written as nontrivial connected sum. Depends on: connected sum
10. **Tricolorability** — ability to color arcs with three colors following crossing rules. Depends on: knot diagram, knot invariant
11. **Unknotting number** — minimum crossing changes to unknot. Depends on: knot invariant
12. **Braid** — collection of strands monotonically descending. Depends on: knot diagram
13. **Braid group** — algebraic structure of braids under concatenation. Depends on: braid
14. **Alexander theorem** — every knot can be represented as a closed braid. Depends on: braid
15. **Skein relation** — recursive formula relating knot polynomials via crossing changes. Depends on: knot invariant
16. **Jones polynomial** — polynomial invariant computed via Kauffman bracket. Depends on: skein relation
17. **Kauffman bracket** — combinatorial formula for computing Jones polynomial. Depends on: skein relation
18. **Alexander polynomial** — classical polynomial invariant from Seifert matrix. Depends on: skein relation
19. **HOMFLY polynomial** — two-variable polynomial generalizing Jones and Alexander. Depends on: Jones polynomial, Alexander polynomial
20. **Knot complement** — 3-space minus the knot. Depends on: knot definition
21. **Knot group** — fundamental group of knot complement. Depends on: knot complement
22. **Seifert surface** — orientable surface bounded by the knot. Depends on: knot definition
23. **Genus** — minimal genus over all Seifert surfaces for a knot. Depends on: Seifert surface
24. **Seifert matrix** — matrix encoding linking of Seifert surface with its pushoff. Depends on: Seifert surface
25. **Dehn surgery** — operation constructing 3-manifolds by cutting out solid torus and regluing. Depends on: knot complement
26. **Hyperbolic knot** — knot whose complement admits complete hyperbolic metric. Depends on: knot complement
27. **Khovanov homology** — categorified version of Jones polynomial. Depends on: Jones polynomial
28. **Quantum invariants** — invariants arising from quantum groups and TQFTs. Depends on: Jones polynomial

## Dependencies

### Foundation Layer
- **Knot diagrams** are the primary working object — all computation starts here
- **Reidemeister moves** are the fundamental equivalence relation — proving two diagrams represent the same knot requires showing a sequence of these moves
- **Knot invariants** only make sense once we understand equivalence — they're properties constant under Reidemeister moves

### Combinatorial Invariants Layer
- **Tricolorability** requires only the diagram and basic counting — first invariant students can compute
- **Unknotting number** builds on understanding crossing changes and invariant definition
- **Braid representation** transforms the problem — requires understanding diagrams and isotopy

### Polynomial Invariants Layer
- **Jones polynomial** revolutionized the field — easier to compute than Alexander, more powerful than combinatorial invariants
- **Alexander polynomial** historically first but harder to motivate without Seifert surfaces
- **HOMFLY polynomial** unifies both but requires understanding both first
- All polynomial invariants use **skein relations** — recursive formulas that reduce computation

### Algebraic Topology Layer
- **Knot complement** shifts perspective from knot to surrounding space
- **Knot group** provides complete invariant (Gordon-Luecke theorem) but hard to compute
- **Seifert surface** bridges diagram and algebraic topology — constructible from diagram, enables matrix computations
- **Seifert matrix** connects to Alexander polynomial — two different approaches to same invariant

### Advanced Layer
- **Dehn surgery** shows how knots generate 3-manifolds — every closed orientable 3-manifold obtained this way
- **Hyperbolic geometry** provides geometric invariant — most knots are hyperbolic
- **Khovanov homology** categorifies Jones polynomial — polynomial is Euler characteristic
- **Quantum invariants** connect to physics and representation theory

## Key Bottlenecks

### Reidemeister Moves
Students must internalize these before proceeding. Without fluency, they can't:
- Prove knot equivalence
- Understand why invariants work
- Verify polynomial computations

### Skein Relations
Critical for polynomial invariants. Students who don't grasp the recursive structure will:
- Struggle to compute polynomials
- Miss connections between different invariants
- Not understand categorification later

### Fundamental Group
The jump to algebraic topology is steep. Students need:
- Comfort with fundamental group from topology course
- Ability to visualize 3D complements
- Facility with group presentations

## Prerequisite Topics

- **Group theory** — needed for knot group, braid group, tricolorability
- **Point-set topology** — needed for ambient isotopy, knot complement
- **Linear algebra** — needed for Seifert matrices, polynomial computation
- **Algebraic topology (basic)** — helpful for fundamental group, though can be introduced during course

## Common Conceptual Jumps

1. **Diagram ↔ Knot** — students confuse the representation with the object
2. **Invariant ↔ Complete invariant** — most invariants can't distinguish all knots
3. **Local ↔ Global** — Reidemeister moves are local, equivalence is global
4. **Combinatorial ↔ Algebraic** — shift from counting to algebra in polynomial invariants
5. **Knot ↔ Complement** — shift from studying knot to studying surrounding space
