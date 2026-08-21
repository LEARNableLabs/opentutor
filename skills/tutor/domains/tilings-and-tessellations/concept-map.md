# Tilings and Tessellations — Concept Map

## Core Concepts (in learning order)

1. **Periodic tiling** — a tiling that repeats via translations; has a fundamental domain
2. **Translation symmetry** — invariance under shifts by lattice vectors
3. **Fundamental domain** — minimal region that generates the entire tiling by translations
4. **Regular tiling** — tiling using congruent regular polygons. Depends on: periodic tiling
5. **Vertex configuration** — arrangement of polygons meeting at a vertex
6. **Wallpaper group** — classification of 2D symmetry patterns (17 types). Depends on: periodic tiling, symmetry transformations
7. **Crystallographic restriction** — limits on rotation orders in periodic structures (2, 3, 4, 6 only)
8. **Aperiodic tiling** — tiling with no translational symmetry; never repeats
9. **Non-periodicity vs aperiodicity** — non-periodic = doesn't repeat; aperiodic = forced to never repeat by tile rules
10. **Local vs global properties** — what you can see in a finite patch vs. infinite tiling behavior
11. **Substitution tiling** — tiling built by recursive replacement rules. Depends on: aperiodic tiling
12. **Inflation rule** — rule that replaces each tile with a cluster of tiles, scaled up
13. **Self-similarity** — pattern looks similar at different scales. Depends on: substitution tiling
14. **Finite local complexity** — only finitely many distinct patches of each size
15. **Repetitivity** — every finite patch appears infinitely often with bounded gaps
16. **Penrose tiling** — famous aperiodic tiling with 5-fold symmetry. Depends on: aperiodic tiling, substitution tiling
17. **Kite-and-dart tiles** — Penrose's original prototile set (2 shapes)
18. **Rhombus Penrose tiles** — alternative prototile set (thin and thick rhombs). Depends on: Penrose tiling
19. **Matching rules** — edge markings or vertex constraints that force aperiodicity
20. **Deflation** — inverse of inflation; breaking tiles into smaller pieces. Depends on: inflation rule
21. **Five-fold rotational symmetry** — rotation by 72° leaves pattern invariant (impossible for periodic tilings). Depends on: crystallographic restriction
22. **Golden ratio** — φ = (1+√5)/2, appears in Penrose tile proportions and frequencies. Depends on: Penrose tiling
23. **Hierarchical structure** — nested levels of organization. Depends on: substitution tiling
24. **Wang tiles** — unit squares with colored edges; must match colors when adjacent
25. **Edge-matching** — constraint that adjacent tiles must have compatible edges
26. **Domino problem** — can a given Wang tile set tile the plane?
27. **Undecidability** — no algorithm can solve the domino problem for all tile sets. Depends on: domino problem
28. **Robinson tiles** — first aperiodic Wang tile set. Depends on: Wang tiles, aperiodic tiling
29. **Quasicrystal** — physical material with aperiodic atomic order and forbidden symmetries. Depends on: aperiodic tiling, five-fold symmetry
30. **Substitution matrix** — linear algebra encoding of inflation rules. Depends on: substitution tiling, linear algebra
31. **Perron-Frobenius eigenvalue** — dominant eigenvalue of substitution matrix; gives scaling factor

## Dependencies

### Critical paths

- **Aperiodic tilings require understanding periodic tilings first** — you need to know what periodicity is to understand its absence
- **Substitution systems build on aperiodicity** — they're a construction method for aperiodic tilings
- **Penrose tilings depend on both substitution and matching rules** — these two mechanisms work together to force aperiodicity
- **Wang tiles connect to computability theory** — the undecidability result requires understanding the domino problem as a decision problem
- **Quasicrystals connect everything** — they're the physical realization that ties together substitution, aperiodicity, and forbidden symmetries

### Concept bottlenecks

**Crystallographic restriction theorem** — this is the key result that explains why 5-fold symmetry seemed impossible before aperiodic tilings. Students must understand this to appreciate Penrose's breakthrough.

**Local vs. global properties** — this distinction is fundamental throughout. Many students struggle to see why local rules (matching) can force global properties (aperiodicity).

**Substitution vs. matching rules** — two different mechanisms for building/forcing aperiodic tilings. Students often confuse them initially.

**Undecidability** — requires some computability theory background. May need a brief primer on decidable vs. undecidable problems.

### Conceptual connections

- **Golden ratio appears everywhere in Penrose tilings** — tile area ratios, edge length ratios, frequency ratios all involve φ
- **Self-similarity across scales** — substitution tilings are fractals in disguise; same structure at different scales
- **Forbidden symmetries** — crystallographic restriction for periodic tilings vs. quasiperiodic tilings with 5-fold or higher symmetries
- **Hierarchy and inflation** — mathematical structure mirrors physical quasicrystal formation

## Prerequisite Topics

- **Euclidean geometry** — needed for: vertex configurations, angle constraints, polygon properties
- **Set theory and proofs** — needed for: understanding aperiodicity definitions, proving non-periodicity
- **Group theory basics** — needed for: wallpaper groups, symmetry operations (helpful but not essential)
- **Linear algebra** — needed for: substitution matrices, eigenvalues, inflation factors
- **Computability theory** — needed for: understanding undecidability of domino problem (can be taught in context)

## Common Misconceptions

1. **Non-periodic = aperiodic** — many students think any non-repeating tiling is aperiodic, but aperiodic means *forced* to not repeat
2. **Penrose tiles only tile aperiodically** — the tiles CAN tile periodically if you ignore matching rules; it's the rules that force aperiodicity
3. **Wang tiles must be colored** — the "colors" are just labels; any matching system works
4. **5-fold symmetry violates mathematical laws** — it violates crystallographic restriction, which only applies to *periodic* tilings
5. **All aperiodic tilings are substitution tilings** — substitution is one method, not the only method
6. **Quasicrystals are periodic at a higher dimension** — while there's a higher-dimensional periodic structure (cut-and-project), the 2D/3D tiling itself is genuinely aperiodic
