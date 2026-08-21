# Optimal Transport — Concept Map

## Core Concepts (in learning order)

1. **Monge Problem** — original mass transportation problem (1781): find cheapest way to move one distribution to another
2. **Cost Function** — defines the "price" of moving mass from point x to point y
3. **Discrete Optimal Transport** — transport between finite point masses
4. **Transportation Polytope** — feasible set of couplings with fixed marginals
5. **Linear Programming Formulation** — discrete OT as a linear program. Depends on: Discrete Optimal Transport, Transportation Polytope
6. **Assignment Problem** — special case with equal masses at each point. Depends on: Discrete Optimal Transport
7. **Existence Failure in Monge** — why the original problem may have no solution (mass splitting forbidden). Depends on: Monge Problem
8. **Transport Plans (Couplings)** — joint probability measures with prescribed marginals. Depends on: Monge Problem
9. **Kantorovich Formulation** — convex relaxation allowing probabilistic transport. Depends on: Transport Plans, Existence Failure
10. **Push-forward Measure** — how transport maps induce couplings. Depends on: Transport Plans
11. **Absolute Continuity** — condition needed for existence of transport maps. Depends on: Push-forward Measure
12. **Brenier's Theorem** — characterization of optimal maps for quadratic cost. Depends on: Absolute Continuity, Push-forward Measure
13. **c-Cyclical Monotonicity** — geometric characterization of optimal transport maps. Depends on: Brenier's Theorem
14. **Kantorovich Duality** — dual formulation as maximization over potential pairs. Depends on: Kantorovich Formulation
15. **Legendre-Fenchel Transform** — conjugate duality used in the dual problem. Depends on: Kantorovich Duality
16. **Kantorovich Potentials** — dual variables (price functions). Depends on: Kantorovich Duality
17. **c-Transform** — transformation relating dual potentials. Depends on: Kantorovich Potentials
18. **Existence via Duality** — proving existence through dual problem compactness. Depends on: Kantorovich Duality
19. **Wasserstein Distance (W_p)** — metric on probability measures induced by OT. Depends on: Kantorovich Formulation
20. **Earth Mover's Distance** — W_2 metric with physical/computational interpretation. Depends on: Wasserstein Distance
21. **Metric Space (P_p(X), W_p)** — probability measures with Wasserstein metric. Depends on: Wasserstein Distance
22. **Displacement Interpolation** — geodesic paths in Wasserstein space. Depends on: Metric Space, Brenier's Theorem
23. **McCann Interpolation** — explicit construction of geodesics. Depends on: Displacement Interpolation
24. **Tangent Space of P_2** — velocity fields along curves in Wasserstein space. Depends on: Displacement Interpolation
25. **Otto Calculus** — formal Riemannian geometry on probability space. Depends on: Tangent Space of P_2
26. **Gradient Flows in Wasserstein Space** — PDEs as steepest descent. Depends on: Otto Calculus
27. **Fokker-Planck Equation** — gradient flow of relative entropy. Depends on: Gradient Flows
28. **JKO Scheme** — time-discretization of gradient flows. Depends on: Gradient Flows, Wasserstein Distance
29. **Computational Complexity** — why OT is hard to compute in high dimensions. Depends on: Kantorovich Formulation
30. **Entropic Regularization** — adding entropy to smooth and accelerate computation. Depends on: Kantorovich Formulation
31. **Sinkhorn Divergence** — entropy-regularized optimal transport. Depends on: Entropic Regularization
32. **Sinkhorn Algorithm** — iterative matrix scaling for computing regularized OT. Depends on: Sinkhorn Divergence
33. **OT in Machine Learning** — applications to GANs, domain adaptation, etc. Depends on: Wasserstein Distance, Sinkhorn Algorithm
34. **Wasserstein Barycenters** — averaging distributions in Wasserstein space. Depends on: Wasserstein Distance

## Dependencies

### Critical Paths

**Monge → Kantorovich Path**
- Monge Problem → Existence Failure → Kantorovich Formulation → Kantorovich Duality
- This path shows the historical evolution and why relaxation was necessary

**Existence Theory Path**
- Kantorovich Formulation → Kantorovich Duality → Existence via Duality
- Absolute Continuity → Brenier's Theorem → c-Cyclical Monotonicity
- Two complementary approaches to proving existence

**Geometric Path**
- Wasserstein Distance → Metric Space → Displacement Interpolation → Otto Calculus → Gradient Flows
- Shows how OT induces rich geometric structure

**Computational Path**
- Computational Complexity → Entropic Regularization → Sinkhorn Algorithm → OT in Machine Learning
- From theory to practical algorithms

### Key Bottlenecks

1. **Kantorovich Formulation** — unlocks existence theory, duality, Wasserstein metrics
2. **Brenier's Theorem** — connects maps to plans, enables displacement interpolation
3. **Kantorovich Duality** — provides computational methods and existence proofs
4. **Wasserstein Distance** — foundation for all geometric applications
5. **Sinkhorn Algorithm** — makes large-scale OT tractable

### Concept Clusters

**Foundational (Lessons 1-5)**
- Monge Problem, Cost Function, Discrete OT, Transportation Polytope, Linear Programming

**Continuous Theory (Lessons 6-11)**
- Existence Failure, Transport Plans, Kantorovich Formulation, Push-forward, Brenier's Theorem

**Duality (Lessons 12-16)**
- Kantorovich Duality, Potentials, c-Transform, c-Cyclical Monotonicity

**Geometry (Lessons 17-22)**
- Wasserstein Distance, Earth Mover's Distance, Displacement Interpolation, Otto Calculus, Gradient Flows

**Computation (Lessons 23-28)**
- Computational Complexity, Entropic Regularization, Sinkhorn Algorithm, ML Applications

## Prerequisite Topics

- **Measure Theory** — needed for: Transport Plans, Kantorovich Formulation, Push-forward Measure, Absolute Continuity
  - σ-algebras, measures, Radon-Nikodym theorem
- **Functional Analysis** — needed for: Kantorovich Duality, Legendre-Fenchel Transform, Weak-* topology
  - Dual spaces, weak topologies, lower semicontinuity
- **Convex Analysis** — needed for: c-Transform, Subdifferentials, c-Cyclical Monotonicity
  - Convex functions, subdifferentials, Legendre transform
- **Linear Algebra** — needed for: Discrete OT, Linear Programming, Sinkhorn Algorithm
  - Matrix operations, eigenvalues, projections
- **Multivariable Calculus** — needed for: Cost Functions, Gradient Flows, Push-forward
  - Gradients, Jacobians, change of variables
- **Probability Theory** — needed for: Couplings, Wasserstein Distance, Applications
  - Probability measures, expectations, convergence

## Learning Bottlenecks

### Where Students Typically Struggle

1. **Map vs Plan Distinction (Lesson 8)** — understanding why plans are more general than maps
2. **Brenier's Theorem (Lesson 9)** — grasping cyclical monotonicity condition
3. **Kantorovich Duality (Lesson 12)** — connecting primal and dual formulations
4. **Otto Calculus (Lesson 20)** — formal Riemannian geometry without manifold regularity
5. **Sinkhorn Algorithm (Lesson 25)** — why matrix scaling converges to OT solution

### Resolution Strategies

- **Map vs Plan**: Use discrete examples first, then show continuous analogue
- **Brenier's Theorem**: Start with 1D case (monotone rearrangement), visualize
- **Duality**: Draw parallels to linear programming duality, economics
- **Otto Calculus**: Emphasize it's formal, focus on intuition before rigor
- **Sinkhorn**: Implement in code, visualize convergence

## Advanced Extensions (Beyond Intermediate Level)

- Unbalanced optimal transport
- Multi-marginal optimal transport
- Martingale optimal transport
- Optimal transport on Riemannian manifolds
- Regularity theory for optimal maps
- Stability of optimal transport
- Computational OT on graphs and networks
