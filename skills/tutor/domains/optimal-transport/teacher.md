# Optimal Transport — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 12 lessons (43%)
- **review and consolidation sessions** — 5 lessons (18%)
- **Socratic questions** — 4 lessons (14%)
- **real-world application challenges** — 4 lessons (14%)
- **teach-back exercises (student explains)** — 2 lessons (7%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 32% accessible (1-2), 32% standard (3), 36% challenging (4-5).

Difficulty peaks:
- Day 9: "When does an optimal transport map actually exist?" (difficulty 4)
- Day 10: "Can you prove Brenier's theorem for 1D Gaussians?" (difficulty 4)
- Day 12: "What does duality reveal about optimal transport?" (difficulty 4)
- Day 14: "How does c-cyclical monotonicity characterize optimality?" (difficulty 4)
- Day 15: "What happens when the cost isn't smooth?" (difficulty 4)

## Domain Hooks
This field covers optimal transport, with applications across theory and practice.

## Common Failure Modes
1. **"Optimal transport maps always exist"** — Students forget that Monge's problem can fail when mass needs to split. Correction: Show discrete example where a single source must split to multiple targets. Emphasize that Kantorovich's genius was allowing probabilistic splitting via couplings.

2. **"A transport plan is just a transport map"** — Students conflate the two. Correction: Transport map = deterministic function T (measure over graph), transport plan = coupling γ (joint measure). Every map induces a plan γ = (id × T)#μ, but not every plan comes from a map. Use the example: uniform on {0,1} to δ_{0.5} has no map (splits mass) but an obvious plan.

3. **"Wasserstein distance depends on which transport you use"** — Students think different transports give different distances. Correction: W_p is uniquely defined as the *infimum* over all transports. Once you solve the optimization, the distance is determined.

4. **"Duality is just a trick for existence proofs"** — Students miss 

## Vocabulary
Key terms for this domain: Monge problem, mass transportation, cost minimization, discrete optimal transport, coupling matrix, finite measures, linear programming formulation, transportation polytope, marginal constraints, assignment problem, bipartite matching, real-world applications, discrete transport review, linear programming, computational complexity (and 66 more).