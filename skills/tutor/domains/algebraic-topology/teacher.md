# Algebraic topology — homotopy and homology — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 12 lessons (46%)
- **Socratic questions** — 4 lessons (15%)
- **review and consolidation sessions** — 4 lessons (15%)
- **teach-back exercises (student explains)** — 3 lessons (12%)
- **real-world application challenges** — 2 lessons (8%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 38% accessible (1-2), 42% standard (3), 19% challenging (4-5).

Difficulty peaks:
- Day 4: "How do you glue fundamental groups together?" (difficulty 4)
- Day 9: "How are covering spaces classified?" (difficulty 4)
- Day 20: "Can you cut a space into simpler pieces to compute homology?" (difficulty 4)
- Day 25: "How does the cup product make cohomology a ring?" (difficulty 4)
- Day 26: "Why do manifolds have a beautiful duality between homology and cohomology?" (difficulty 4)

## Domain Hooks
- **Knot theory** — fundamental group of knot complement is a powerful invariant. Drop this after covering π₁ to show applications beyond surfaces. Mention unknot vs. trefoil distinction via π₁.

- **Topological data analysis (TDA)** — persistent homology detects features in data clouds. Great for applied students. Reference Ghrist's work (https://www2.math.upenn.edu/~ghrist/preprints/HAD.pdf) when discussing homology computation. Show how birth-death diagrams extract signal from noise.

- **Fixed point theorems** — beyond Brouwer, mention Lefschetz fixed point theorem (uses Lefschetz number from homology). Connect to dynamical systems: periodic orbits, stability. Drop this after cellular homology.

- **Borsuk-Ulam theorem** — "at any moment, there exist two antipodal points on Earth with identical temperature and pressure." Uses cohomology + covering space theory. Beautiful application of algebraic topology to prove combinatorial result (Ham sandwich theorem).

- **Sphere eversion** —

## Common Failure Modes
1. **"Homotopy equivalent means homeomorphic"**
   Students conflate homotopy equivalence with homeomorphism. A coffee cup and donut are homotopy equivalent but not homeomorphic. Emphasize: homotopy equivalence is weaker (allows continuous deformation with extra slack), homeomorphism is stronger (preserves all topological properties). Use the contractible space example: any contractible space is homotopy equivalent to a point, but R^n is not homeomorphic to a point.

2. **"The fundamental group detects all topological features"**
   Students think π₁ is the complete invariant. Counterexample: all simply connected spaces have trivial π₁, but S² and S³ are not homotopy equivalent. Clarify: π₁ detects 1-dimensional holes (loops), higher homotopy groups detect higher-dimensional phenomena, and homology gives a computable abelian approximation.

3. **"Cycles and boundaries are the same thing"**
   Students confuse closed chains (∂c = 0) with boundaries (c = ∂d). Every boundary is a cycle (∂

## Vocabulary
Key terms for this domain: homotopy of paths, path equivalence, fundamental intuition, fundamental group definition, basepoint, loop composition, covering space, lifting property, π₁(S¹) = ℤ, Van Kampen's theorem, amalgamated free product, pushout, Van Kampen applications, fundamental group of surfaces, presentations (and 61 more).