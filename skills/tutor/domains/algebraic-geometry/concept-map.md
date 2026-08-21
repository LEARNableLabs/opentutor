# Algebraic Geometry — Concept Map

## Core Concepts (in learning order)

1. **Affine space** — coordinate space over an algebraically closed field
2. **Algebraic sets** — zero loci of polynomial systems in affine space
3. **Zariski topology** — topology where closed sets are algebraic sets
4. **Hilbert's Nullstellensatz** — bijection between radical ideals and algebraic sets. Depends on: algebraic sets
5. **Coordinate ring** — quotient of polynomial ring by ideal of a variety. Depends on: Nullstellensatz
6. **Regular functions** — polynomial functions on varieties. Depends on: coordinate ring
7. **Morphisms of varieties** — maps induced by regular functions. Depends on: regular functions
8. **Rational functions** — quotients of regular functions. Depends on: regular functions
9. **Dimension (Krull)** — length of longest chain of irreducible subvarieties. Depends on: algebraic sets
10. **Projective space** — quotient of affine space by scalar multiplication
11. **Homogeneous coordinates** — coordinates in projective space. Depends on: projective space
12. **Projective varieties** — zero sets of homogeneous polynomials. Depends on: projective space
13. **Graded rings** — rings with degree decomposition. Depends on: projective varieties
14. **Affine patches** — affine charts covering a projective variety. Depends on: projective varieties
15. **Plane curves** — one-dimensional varieties in affine or projective plane
16. **Degree of a curve** — number of intersection points with a generic line. Depends on: plane curves
17. **Singular points** — points where tangent space has higher dimension. Depends on: plane curves
18. **Divisors** — formal linear combinations of points on a curve. Depends on: plane curves
19. **Linear equivalence** — equivalence relation on divisors via principal divisors. Depends on: divisors
20. **Genus** — topological invariant measuring "holes" in a curve. Depends on: divisors
21. **Riemann-Roch theorem** — relates dimensions of divisor spaces to genus. Depends on: genus, linear equivalence
22. **Canonical divisor** — divisor of a differential form. Depends on: divisors
23. **Elliptic curves** — smooth projective curves of genus 1 with a marked point. Depends on: genus
24. **Presheaves** — contravariant functors from open sets to sets/rings/modules
25. **Sheaves** — presheaves satisfying gluing axioms. Depends on: presheaves
26. **Stalks** — direct limits of sections over neighborhoods. Depends on: sheaves
27. **Sheafification** — left adjoint to forgetful functor from sheaves to presheaves. Depends on: sheaves, stalks
28. **Ringed spaces** — topological space with a sheaf of rings. Depends on: sheaves
29. **Locally ringed spaces** — ringed spaces where stalks are local rings. Depends on: ringed spaces, stalks
30. **Spec of a ring** — set of prime ideals with Zariski topology. Depends on: Zariski topology
31. **Structure sheaf** — sheaf of regular functions on Spec. Depends on: Spec, locally ringed spaces
32. **Affine schemes** — Spec(R) with its structure sheaf. Depends on: Spec, structure sheaf
33. **Schemes** — locally ringed spaces locally isomorphic to affine schemes. Depends on: affine schemes
34. **Morphisms of schemes** — morphisms of locally ringed spaces. Depends on: schemes
35. **Reduced schemes** — schemes without nilpotents. Depends on: schemes
36. **Irreducible schemes** — schemes with irreducible underlying space. Depends on: schemes
37. **Nilpotents in schemes** — elements squaring to zero, enabling "infinitesimal" geometry. Depends on: schemes
38. **Separated morphisms** — scheme-theoretic version of Hausdorff property. Depends on: morphisms of schemes
39. **Proper morphisms** — scheme-theoretic version of compact maps. Depends on: separated morphisms
40. **Fiber products** — universal pullbacks in category of schemes. Depends on: morphisms of schemes

## Dependencies

### Critical Chains

- **Nullstellensatz → Coordinate rings → Regular functions → Morphisms** — The foundation of classical algebraic geometry. Without Nullstellensatz, we can't establish the dictionary between algebra and geometry.

- **Projective space → Homogeneous coordinates → Projective varieties** — Projective geometry requires understanding points as equivalence classes, fundamentally different from affine intuition.

- **Plane curves → Divisors → Linear equivalence → Riemann-Roch** — The core of curve theory. Students must internalize divisors as formal sums before approaching Riemann-Roch.

- **Presheaves → Sheaves → Ringed spaces → Locally ringed spaces** — Abstract machinery prerequisite for schemes. The gluing axiom is the key conceptual jump.

- **Spec → Structure sheaf → Affine schemes → Schemes** — The scheme-theoretic perspective. Understanding Spec as a functor (points as prime ideals) is the conceptual bottleneck.

### Conceptual Bottlenecks

1. **Zariski topology** — Students familiar with metric topology must adjust to a topology where generic points are dense. Many "obvious" topological properties fail (non-Hausdorff, few open sets).

2. **Hilbert's Nullstellensatz** — First deep theorem. Students must understand that it requires algebraically closed fields and grasp the radical ideal condition.

3. **Projective space** — The first truly non-affine construction. Students must think in homogeneous coordinates and understand that projective space is not a variety over a ring.

4. **Sheaves** — The gluing axiom is subtle. Students often confuse presheaves (which don't require gluing) with sheaves. The local-to-global principle is key.

5. **Spec as a functor** — Prime ideals as points is deeply non-intuitive. Generic points (prime ideals properly contained in maximal ideals) have no classical analogue. This is where scheme theory either clicks or remains opaque.

6. **Nilpotents** — Schemes allow nilpotents, which have no classical geometric meaning. Understanding "fat points" and infinitesimal neighborhoods requires algebraic thinking.

### Parallel Tracks

- **Classical geometry (Modules 1-3)** and **Scheme theory (Modules 4-6)** develop in parallel after Module 3. Curves provide concrete examples; sheaves and schemes provide the language to generalize.

- **Algebraic perspective** (ideals, rings, modules) and **Geometric perspective** (points, functions, shapes) must be held in mind simultaneously. Morphisms are both ring homomorphisms and geometric maps.

## Prerequisite Topics

- **Commutative algebra** — needed for Nullstellensatz, localization (affine schemes), Noetherian rings (finiteness), dimension theory
- **Abstract algebra** — needed for field theory (algebraically closed fields), Galois theory (very lightly), group structure on elliptic curves
- **Topology** — needed for Zariski topology, compactness (proper morphisms), connectedness (irreducibility)
- **Linear algebra** — needed for projective space, tangent spaces, linear systems of divisors
- **Category theory (helpful)** — needed for functoriality of Spec, fiber products, universal properties, but can be learned on the fly

## Common Conceptual Errors

1. **Assuming Zariski topology is Hausdorff** — It's almost never Hausdorff (except for discrete spaces).
2. **Confusing regular and rational functions** — Regular functions are globally defined; rational functions have poles.
3. **Forgetting algebraic closure in Nullstellensatz** — The theorem fails over non-algebraically closed fields.
4. **Treating divisors as sets of points** — Divisors are formal sums with multiplicities, not just subsets.
5. **Thinking schemes are always reduced** — Nilpotents are a feature, not a bug.
6. **Confusing maximal ideals and prime ideals in Spec** — Maximal ideals are "closed points," but prime ideals (especially non-maximal ones) are also points.
7. **Assuming morphisms are determined by point-maps** — Scheme morphisms include data of sheaf homomorphisms, not just underlying continuous maps.

## Synthesis Points

- **Lesson 16** — After curves, students should see divisors and Riemann-Roch as the prototype for later cohomological techniques.
- **Lesson 23** — After sheaves, students should see how sheaves package local data (like regular functions on open sets) into a single object.
- **Lesson 25** — Translating classical varieties into schemes should feel like gaining expressive power, not just abstraction for its own sake.
- **Lesson 30** — The final lesson connects arithmetic (Spec Z), geometry (classical varieties), and topology (structure sheaves) into one framework.
