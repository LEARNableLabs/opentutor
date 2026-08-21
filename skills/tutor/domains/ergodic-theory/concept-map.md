# Ergodic Theory — Concept Map

## Core Concepts (in learning order)

1. **Measure-preserving transformations** — maps T: X → X that preserve a probability measure μ (μ(T⁻¹A) = μ(A))
2. **Invariant measures** — measures that remain unchanged under the dynamics
3. **Circle rotations** — T(x) = x + α (mod 1); prototype ergodic system when α is irrational. Depends on: 1, 2
4. **Arnold cat map** — hyperbolic toral automorphism; chaotic yet measure-preserving. Depends on: 1, 2
5. **Shift spaces** — symbolic dynamics; Bernoulli shifts as models of independence. Depends on: 1, 2
6. **Poincaré Recurrence Theorem** — almost every point returns arbitrarily close to itself infinitely often. Depends on: 1, 2
7. **Return times** — expected time for a trajectory to revisit a set (Kac's formula). Depends on: 6
8. **Ergodicity** — system is indecomposable; no nontrivial invariant sets. Depends on: 2, 6
9. **Ergodic decomposition** — any invariant measure decomposes uniquely into ergodic components. Depends on: 8
10. **Equidistribution** — orbits of ergodic systems become uniformly distributed. Depends on: 8
11. **Birkhoff Ergodic Theorem** — time averages converge to space averages almost everywhere. Depends on: 8
12. **Pointwise convergence** — for ergodic systems, Birkhoff limit equals the integral. Depends on: 11
13. **Applications to number theory** — Gauss map, continued fractions, digit frequencies. Depends on: 11, 12
14. **Weak mixing** — system has no nontrivial eigenfunctions in L². Depends on: 8
15. **Strong mixing** — correlations decay to zero; μ(T⁻ⁿA ∩ B) → μ(A)μ(B). Depends on: 14
16. **Koopman operator** — unitary operator U_T f = f ∘ T on L²(X, μ). Depends on: 8
17. **Spectral theory** — eigenvalues and spectrum characterize mixing properties. Depends on: 16
18. **Continuous spectrum** — spectral condition for mixing. Depends on: 17
19. **Measure-theoretic entropy** — Kolmogorov-Sinai entropy; measures complexity/randomness. Depends on: 8
20. **Topological entropy** — entropy for continuous maps on compact spaces. Depends on: 19
21. **Variational principle** — topological entropy is the supremum of measure entropies. Depends on: 19, 20
22. **Equilibrium states** — measures that maximize entropy for a given potential. Depends on: 21

## Dependencies

### Linear Dependencies
- **Ergodicity requires invariant measures** — you can't have an indecomposable system without first understanding what's being preserved
- **Birkhoff's theorem requires ergodicity** — the equality of time and space averages is a consequence of indecomposability
- **Mixing requires ergodicity** — mixing is a stronger property than ergodicity; every mixing system is ergodic but not vice versa
- **Spectral theory requires the Koopman operator** — we study dynamics via the induced linear operator on function spaces
- **Entropy requires ergodicity** — entropy is most meaningful for ergodic systems where it measures a global property

### Conceptual Dependencies
- **Poincaré Recurrence depends on measure preservation** — without invariance, trajectories can escape and never return
- **Return times depend on recurrence** — Kac's formula quantifies *how long* recurrence takes
- **Equidistribution depends on ergodicity** — indecomposability ensures orbits spread throughout the space
- **Applications to number theory depend on Birkhoff's theorem** — computing digit frequencies requires time-average convergence
- **Spectral characterization of mixing depends on spectral theory** — we identify mixing via properties of the spectrum
- **Variational principle depends on both entropy types** — it bridges topological and measure-theoretic notions

### Bottlenecks
- **Ergodicity** (concept 8) — this is the central concept that everything builds on. Students must deeply understand what it means for a system to be indecomposable.
- **Birkhoff's Ergodic Theorem** (concept 11) — the cornerstone result; applications depend on it, and it's the bridge to probability theory and number theory.
- **Koopman operator** (concept 16) — switching from geometric to spectral perspective is a major conceptual shift.
- **Measure-theoretic entropy** (concept 19) — requires synthesizing partition refinements, conditional entropy, and limits.

## Common Misconceptions
- **"Ergodic = mixing"** — No! Mixing is strictly stronger. Irrational circle rotations are ergodic but not mixing.
- **"Recurrence means periodic"** — Recurrence is *almost everywhere* and doesn't require exact returns, just arbitrarily close returns.
- **"Birkhoff only applies to i.i.d. processes"** — Birkhoff generalizes the Law of Large Numbers to dependent (but ergodic) processes.
- **"Invariant measure is unique"** — Not always! Non-ergodic systems have multiple invariant measures. Ergodicity ensures uniqueness.
- **"Entropy measures disorder"** — More precisely, it measures the rate of information production or the complexity of the orbit structure.

## Prerequisite Topics
- **Measure theory** — needed for: invariant measures, Lebesgue measure, sigma-algebras, integration, almost-everywhere convergence
- **Lebesgue integration** — needed for: defining expectations, L² spaces, Birkhoff's theorem statement
- **Point-set topology** — needed for: compactness, continuity, topological entropy
- **Metric spaces** — needed for: defining distance, recurrence, topological notions
- **Basic functional analysis** (helpful but not essential) — needed for: L² spaces, unitary operators, spectral theory
