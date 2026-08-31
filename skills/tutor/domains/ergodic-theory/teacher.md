# Ergodic Theory — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 8 lessons (30%)
- **real-world application challenges** — 5 lessons (19%)
- **Socratic questions** — 5 lessons (19%)
- **review and consolidation sessions** — 4 lessons (15%)
- **teach-back exercises (student explains)** — 3 lessons (11%)
- **curated resource exploration** — 2 lessons (7%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 30% accessible (1-2), 37% standard (3), 33% challenging (4-5).

Difficulty peaks:
- Day 9: "What does it mean for a system to be 'indecomposable'?" (difficulty 4)
- Day 11: "How can you prove a system is ergodic?" (difficulty 4)
- Day 13: "Why do time averages equal space averages?" (difficulty 4)
- Day 15: "Can we compute the frequency of digits in continued fractions?" (difficulty 4)
- Day 19: "Why is the Bernoulli shift mixing but circle rotations are not?" (difficulty 4)

## Domain Hooks
- **Ergodicity economics** — Ole Peters' work on the ergodicity problem in finance and decision theory. Drop in after Birkhoff's theorem; connects to real-world decision-making under uncertainty. Resource: https://ergodicityeconomics.com/

- **Furstenberg's diophantine approximation proof** — uses ergodic theory to prove number-theoretic results (e.g., Szemeredi's theorem on arithmetic progressions). Drop in after establishing ergodic theorems; shows power of transferring between dynamics and combinatorics.

- **Smooth ergodic theory & hyperbolic systems** — Pesin theory, stable/unstable manifolds, Lyapunov exponents. Drop in after mixing; connects to chaos theory and differentiable dynamics.

- **Joinings and factors** — Furstenberg's structure theory for ergodic systems. Drop in after ergodic decomposition; provides a categorical perspective on systems.

- **Ornstein isomorphism theorem** — Bernoulli shifts with the same entropy are isomorphic. Drop in after entropy; a stunning class

## Common Failure Modes
1. **"Ergodic systems are random or chaotic"** — Ergodicity is about *statistical* properties, not chaos. Irrational circle rotations are ergodic but completely deterministic and non-chaotic. Fix: show that ergodicity means indecomposability, not unpredictability.

2. **"Mixing is the same as ergodicity"** — Many students conflate the two. Every mixing system is ergodic, but not vice versa. Fix: use circle rotations (ergodic, not mixing) and Bernoulli shifts (mixing) as contrasting examples. Emphasize that mixing requires correlation decay.

3. **"Recurrence means periodic orbits"** — Poincaré recurrence is *almost everywhere* and says trajectories return *arbitrarily close*, not to the exact same point (unless the system is periodic). Fix: illustrate with irrational rotation — orbits are dense, not periodic.

4. **"Birkhoff's theorem only works for independent processes"** — The Law of Large Numbers assumes i.i.d., but Birkhoff works for *any* ergodic system, even highly dependent one

## Vocabulary
Key terms for this domain: measure-preserving transformations, invariant measures, probability spaces, circle rotations, irrational rotations, Lebesgue measure, Arnold cat map, hyperbolic systems, symbolic dynamics, shift spaces, Bernoulli measures, independence, invariant measure construction, uniqueness, examples (and 57 more).