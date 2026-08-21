# Optimal Transport — Teaching Notes

## Approach

Optimal transport sits at the intersection of analysis, geometry, probability, and computation — teach it as a **toolkit with both theoretical elegance and practical power**. For intermediate students, prioritize **intuition before rigor**: start with discrete examples and visualizations, build geometric understanding through Wasserstein distances, then layer in measure-theoretic foundations. The curriculum follows a "concrete → abstract → computational" arc: discrete transport (accessible, computational) → continuous formulation (measure theory) → geometric structure (Wasserstein space) → modern algorithms (Sinkhorn, ML applications). Balance proofs with examples; every theorem should come with a 1D or discrete illustration.

## Common Misconceptions

1. **"Optimal transport maps always exist"** — Students forget that Monge's problem can fail when mass needs to split. Correction: Show discrete example where a single source must split to multiple targets. Emphasize that Kantorovich's genius was allowing probabilistic splitting via couplings.

2. **"A transport plan is just a transport map"** — Students conflate the two. Correction: Transport map = deterministic function T (measure over graph), transport plan = coupling γ (joint measure). Every map induces a plan γ = (id × T)#μ, but not every plan comes from a map. Use the example: uniform on {0,1} to δ_{0.5} has no map (splits mass) but an obvious plan.

3. **"Wasserstein distance depends on which transport you use"** — Students think different transports give different distances. Correction: W_p is uniquely defined as the *infimum* over all transports. Once you solve the optimization, the distance is determined.

4. **"Duality is just a trick for existence proofs"** — Students miss that dual potentials have economic meaning (prices) and computational value (Sinkhorn uses them). Correction: Frame duality as revealing hidden structure, not just a technical tool. Connect to linear programming duality, economics (equilibrium prices).

5. **"c-cyclical monotonicity is the same as cyclical monotonicity"** — Students forget the cost function c matters. Correction: For quadratic cost c(x,y) = |x-y|²/2, c-cyclical monotonicity reduces to standard monotonicity in 1D and convexity of the potential. Different costs give different geometry.

6. **"Entropic regularization changes the problem"** — Students think Sinkhorn solves a different problem than OT. Correction: It's an approximation with explicit trade-off: smaller ε → closer to true OT, but slower convergence. The limit as ε→0 recovers exact OT.

7. **"Geodesics in Wasserstein space are unique"** — Students assume displacement interpolation always yields a unique path. Correction: Uniqueness holds when one measure is absolutely continuous (Brenier), but can fail otherwise (e.g., discrete to discrete).

8. **"The JKO scheme is just implicit Euler"** — Students miss the geometry. Correction: JKO is implicit Euler in Wasserstein space, not Euclidean space. The distance is W_2, not L². This changes everything about the gradient flow.

9. **"Optimal transport only works for probability measures"** — Students think normalization is essential. Correction: Kantorovich formulation works for any measures with equal total mass. Unbalanced OT drops even that constraint.

10. **"Sinkhorn is an approximation algorithm"** — Students think it's heuristic. Correction: Sinkhorn solves the entropy-regularized problem *exactly* (in the limit of iterations). It's not approximate; it solves a different (regularized) problem exactly.

## Level Adjustments

**For intermediate students** (this curriculum):
- Assume measure theory basics (σ-algebras, Radon-Nikodym) but review push-forward and absolute continuity
- State Brenier's theorem, sketch proof idea, work through 1D Gaussian example
- Present Otto calculus as "formal Riemannian geometry" — emphasize intuition, don't require manifold theory rigor
- Focus on W_2 metric (most common in applications), mention W_1 and W_∞ briefly
- Implement Sinkhorn algorithm; skip analysis of convergence rates
- Cover gradient flow perspective on Fokker-Planck; skip full gradient flow theory

**Compared to undergraduate level**:
- Add measure-theoretic formulation (undergrads would stay discrete or assume densities)
- Include duality theory (undergrads might skip or just state the dual)
- Cover geometric structure (Wasserstein space as Riemannian) — undergrads stop at metric
- Include computational complexity and entropic regularization — undergrads focus on small examples

**Compared to advanced graduate level**:
- Skip regularity theory for optimal maps (Caffarelli, Figalli)
- Skip martingale OT, multi-marginal OT, unbalanced OT (mention as extensions)
- Don't prove full Brenier theorem (require only sketch + 1D case)
- Don't dive into Γ-convergence for JKO or full gradient flow analysis
- Mention but don't develop: OT on Riemannian manifolds, stability theory

## Rabbit Holes (When to Drop Fascinating Tangents)

### Monge-Ampère Equation
**When:** After Brenier's theorem (Lesson 10)
**What:** The optimal map T(x) = x + ∇φ(x) for quadratic cost satisfies the Monge-Ampère PDE det(D²φ) = ρ/σ(T). This connects OT to nonlinear PDEs.
**Why fascinating:** Links geometry, analysis, PDEs. Regularity of solutions (Caffarelli, Figalli) won Fields Medal work.

### Wasserstein GANs
**When:** ML applications (Lesson 26)
**What:** GANs trained using Wasserstein distance instead of KL divergence. Helps with mode collapse, training stability.
**Why fascinating:** Brought OT from pure math to mainstream deep learning (2017). Still active research area.

### Otto's Heat Flow
**When:** Gradient flows (Lesson 21)
**What:** Heat equation is gradient flow of entropy in W_2 space. Explains why Gaussian is fixed point, why solutions converge to equilibrium.
**Why fascinating:** Reformulating classical PDEs as geometry in infinite dimensions. Beautiful and powerful.

### Gromov-Wasserstein Distance
**When:** After Wasserstein distance (Lesson 17-18)
**What:** OT between metric measure spaces with *different* underlying spaces. Align spaces while transporting.
**Why fascinating:** Used in shape matching, graph comparison, transfer learning across domains.

### Schrödinger Bridge Problem
**When:** After entropic regularization (Lesson 24)
**What:** Dynamic formulation: find most likely path of particles transforming one distribution to another, subject to entropy constraint.
**Why fascinating:** Connects stochastic control, large deviations, quantum mechanics. Sinkhorn algorithm solves it.

### Optimal Transport for Data Science
**When:** Applications (Lesson 27)
**What:** Distribution comparison, clustering, dimensionality reduction, color transfer, data augmentation.
**Why fascinating:** Practical toolkit for data scientists. Python POT library makes it accessible.

### Brenier vs McCann
**When:** Displacement interpolation (Lesson 19)
**What:** Brenier's theorem: existence + characterization. McCann: interpolation along geodesics preserves important properties (convexity, etc.).
**Why fascinating:** McCann's displacement convexity connects to Ricci curvature bounds, optimal transport inequalities.

## Difficulty Progression

The curriculum follows this difficulty profile:

**Lessons 1-5 (Module 1):** Gentle start (difficulty 1-2). Discrete OT, linear programming, real-world examples. Build intuition, computational confidence.

**Lessons 6-11 (Module 2):** Ramp up (difficulty 3-4). Continuous formulation, measure theory appears. Brenier's theorem is first peak. Review at lesson 11 consolidates.

**Lessons 12-16 (Module 3):** Sustained challenge (difficulty 3-4). Duality theory is abstract but rewarding. Review at lesson 16 before geometry module.

**Lessons 17-22 (Module 4):** Mixed (difficulty 2-5). W_2 metric accessible (difficulty 2-3), but Otto calculus and gradient flows hit peak difficulty (5). Review at lesson 22 crucial.

**Lessons 23-28 (Module 5):** Resolution phase (difficulty 3-4). Computational focus brings difficulty back to manageable. Sinkhorn is challenging but concrete. Final review (lesson 28) ties everything together.

### Pacing Recommendations

- Spend extra time on Lesson 8 (map vs plan) — foundational distinction
- Lesson 12 (duality) may need two sessions — it's dense
- Lessons 20-21 (Otto calculus, gradient flows) are the hardest — expect struggle, offer lots of examples
- Lesson 25 (Sinkhorn implementation) is a great "reward" after theoretical heavy lifting
- Build in flex time after each review lesson for catch-up or deeper dives

## Cross-Disciplinary Connections

- **Economics:** Matching markets, equilibrium prices, Kantorovich potentials as market prices
- **Computer Graphics:** Color transfer, texture synthesis, shape interpolation
- **Machine Learning:** GANs, domain adaptation, generative modeling, fairness
- **PDEs:** Gradient flows, Fokker-Planck, porous medium equation
- **Differential Geometry:** Riemannian geometry, geodesics, curvature
- **Probability:** Coupling methods, convergence of measures, central limit theorem
- **Operations Research:** Assignment problems, transportation networks, logistics

## Assessment Ideas

- **Computational:** Implement discrete OT solver, Sinkhorn algorithm, visualize transports
- **Theoretical:** Prove Brenier's theorem for 1D case, verify duality for discrete problem
- **Applied:** Use OT library to compare real datasets, implement Wasserstein GAN variant
- **Conceptual:** Explain map vs plan to a peer, connect gradient flows to heat equation

## Resources for Extension

Point students toward:
- **POT (Python Optimal Transport)** library for hands-on projects
- **Gabriel Peyré's course notes** for computational focus
- **Villani's "Optimal Transport: Old and New"** for the full monograph (warning: 1000 pages!)
- **Filippo Santambrogio's book** for applied mathematicians
- **Computational OT papers** for state-of-the-art algorithms
