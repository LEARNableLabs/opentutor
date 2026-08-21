# Origami Mathematics — Concept Map

## Core Concepts (in learning order)

1. **Origami axioms** — The seven fundamental folding operations (Huzita-Hatori axioms) that formalize what can be constructed by folding paper
2. **Geometric constructions** — Points, lines, angles, and shapes that can be created through folding operations
3. **Axiom O1** — Fold connecting two points (creates perpendicular bisector)
4. **Axiom O2** — Fold bringing one point to another (any line through midpoint)
5. **Reflection symmetry** — How folds create mirror images across crease lines. Depends on: O1, O2
6. **Axiom O3** — Fold bringing one line to another (angle bisector)
7. **Angle bisection** — Dividing angles into equal parts. Depends on: O3
8. **Axiom O4** — Fold through a point perpendicular to a line
9. **Perpendicularity** — Creating and recognizing perpendicular lines. Depends on: O1, O4
10. **Axiom O5** — Fold bringing point P to line L1 and passing through point Q
11. **Axiom O6** — Fold bringing point P1 to line L1 and point P2 to line L2. Depends on: O5
12. **Angle trisection** — Dividing angles into three equal parts (impossible with compass/straightedge). Depends on: O6
13. **Cubic equations** — Equations solvable via origami but not classical tools. Depends on: O6, angle trisection
14. **Cube doubling (Delian problem)** — Constructing the cube root of 2. Depends on: O6, cubic equations
15. **Algebraic degree** — Why origami can solve degree-3 problems while compass/straightedge cannot. Depends on: cubic equations
16. **Axiom O7** — Fold bringing point P to line L1 perpendicular to line L2 (Hatori's axiom)
17. **Quintic equations** — Higher-degree equations accessible through O7. Depends on: O6, O7, algebraic degree
18. **Flat-foldability** — Whether a crease pattern can be folded completely flat without self-intersection
19. **Crease assignment** — Labeling creases as mountain or valley folds. Depends on: flat-foldability
20. **Vertex analysis** — Studying properties of vertices where multiple creases meet. Depends on: crease assignment
21. **Maekawa's theorem** — At any flat-foldable vertex, |M - V| = 2. Depends on: vertex analysis
22. **Kawasaki's theorem** — Alternating angles around a flat-foldable vertex sum to 180°. Depends on: vertex analysis
23. **Parity constraints** — Combinatorial restrictions on valid crease patterns. Depends on: Maekawa's theorem
24. **Local vs global conditions** — Difference between vertex-level and pattern-level flat-foldability. Depends on: Maekawa, Kawasaki
25. **Layer ordering** — Determining which layers go above/below in folded state. Depends on: global conditions
26. **NP-hardness** — Computational complexity of deciding global flat-foldability. Depends on: layer ordering
27. **Circle packing** — Method for designing origami bases by packing circles in a square. Depends on: geometric constructions
28. **Base design** — Creating the foundational structure from which a model is shaped. Depends on: circle packing
29. **Tree method** — Algorithm mapping desired flap structure to crease pattern. Depends on: circle packing, base design
30. **Flap allocation** — Assigning paper regions to model features. Depends on: tree method
31. **Optimization** — Finding efficient crease patterns for given constraints. Depends on: tree method
32. **Universal molecules** — Reusable crease pattern components. Depends on: optimization
33. **Deployable structures** — Engineered systems that expand/collapse via folding
34. **Miura fold** — Specific tessellation pattern used in aerospace. Depends on: flat-foldability, tessellations
35. **Modular origami** — Models built from multiple identical units
36. **Polyhedral geometry** — Study of 3D shapes with flat faces. Depends on: modular origami
37. **Sonobe units** — Classic modular component for polyhedra. Depends on: polyhedral geometry

## Dependencies

### Foundation Layer (Lessons 1-6)
- **Reflection symmetry** requires understanding **O1** and **O2** because reflections are the geometric operation performed by these folds
- **Angle bisection** requires **O3** because O3 is the axiom that produces angle bisectors
- **Perpendicularity** builds on **O1** and **O4** because both axioms create perpendicular relationships

### Construction Layer (Lessons 7-12)
- **Angle trisection** requires **O6** because O6 enables solving cubic equations, which trisection reduces to
- **Cube doubling** builds on **O6** and **cubic equations** because it requires constructing ∛2
- **Algebraic degree** explains why **O6** enables **cubic equations** while classical tools are limited to degree-2
- **Quintic equations** require both **O6** and **O7** because they build on the power of these advanced axioms

### Flat-Foldability Layer (Lessons 13-18)
- **Crease assignment** depends on **flat-foldability** because you must know what you're trying to achieve
- **Maekawa's theorem** and **Kawasaki's theorem** both require **vertex analysis** because they're vertex-level conditions
- **Parity constraints** emerge from **Maekawa's theorem** as a consequence of the M-V=±2 rule
- **Layer ordering** requires understanding **local vs global conditions** because local validity doesn't guarantee global foldability
- **NP-hardness** builds on **layer ordering** because layer conflicts are the computational bottleneck

### Design Layer (Lessons 19-22)
- **Base design** requires **circle packing** because circles define flap territories
- **Tree method** builds on both **circle packing** and **base design** because it's an algorithmic approach to the same problem
- **Optimization** builds on **tree method** because it seeks to improve upon basic tree-based designs
- **Miura fold** requires understanding **flat-foldability** because it's a specific flat-foldable tessellation pattern

### Application Layer (Lessons 23-24)
- **Polyhedral geometry** builds on **modular origami** because polyhedra are the primary forms constructed modularly
- **Sonobe units** require **polyhedral geometry** because they're specifically designed for polyhedral assembly

## Critical Bottlenecks

### Axiom O6 (Lesson 8-10)
This is the key conceptual leap. Students must understand:
- Why O6 is qualitatively different from O1-O5
- How it relates to solving cubic equations
- The connection between geometric construction and algebraic solvability

Without mastering O6, the distinction between origami and classical geometry is lost.

### Maekawa & Kawasaki Theorems (Lessons 14-15)
These are the gateway to analyzing crease patterns. Students who struggle here will not be able to:
- Design original models
- Debug why a pattern won't fold
- Understand computational complexity results

The theorems are individually accessible but require practice to apply fluently.

### Tree Method (Lesson 20-21)
This is the steepest algorithmic climb. Students need:
- Spatial reasoning to map 2D patterns to 3D forms
- Algorithmic thinking to follow the circle-packing procedure
- Optimization intuition to understand efficiency trade-offs

This is where geometric origami becomes computational origami.

## Prerequisite Topics (External)

### High school geometry
Needed for: All axioms, constructions, angle relationships
Essential concepts: angles, triangles, circles, perpendicularity, bisectors, similarity

### Basic algebra
Needed for: Cubic equations, algebraic degree, optimization
Essential concepts: solving equations, systems of equations, degree of polynomials

### Trigonometry
Needed for: Angle relationships, Kawasaki's theorem, computational verification
Essential concepts: sine, cosine, angle sum identities

### Proof techniques (helpful but not required)
Needed for: Understanding why theorems are true, not just how to apply them
Essential concepts: direct proof, proof by contradiction, necessary vs sufficient conditions

### Computational thinking (helpful for design module)
Needed for: Tree method, optimization, understanding algorithmic approaches
Essential concepts: algorithms, optimization, computational complexity
