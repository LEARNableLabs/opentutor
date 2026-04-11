# Concept Map — Optimal Transport

## Dependency Graph

```
Monge Problem (1781)
    │
    ▼
Kantorovich Relaxation ──────► Kantorovich Duality
    │                              │
    ▼                              ▼
1-D OT (closed-form)          c-transforms
    │                              │
    ▼                              ▼
Wasserstein Distances ◄───── Brenier's Theorem
    │                              │
    ▼                              ▼
Wasserstein Space          Monge-Ampère Equation
(metric structure)               │
    │                              ▼
    ▼                        Regularity Theory
Displacement Interpolation
    │
    ▼
Displacement Convexity         Entropic Regularization
    │                              │
    ▼                              ▼
Otto Calculus                Sinkhorn Algorithm
    │                              │
    ▼                              ▼
Gradient Flows (JKO)        Computational OT
    │                        (barycenters, sliced W)
    ▼                              │
PDE Connections                    ▼
(Fokker-Planck, heat eq)     ML Applications
                             (WGANs, flow matching,
                              domain adaptation, NLP)
```

## Bottleneck Concepts

These are "gates" — if you don't get these, everything after is shaky:

1. **Kantorovich duality** — unlocks understanding of c-transforms, Brenier, and all computational methods
2. **Brenier's theorem** — the bridge between abstract OT and concrete geometry
3. **Entropic regularization** — without this, computational OT doesn't scale
4. **JKO scheme** — the key insight connecting OT to PDEs and dynamics

## Mind-Blowing Concepts (high engagement)

- **Day 9: Displacement interpolation** — "you can smoothly morph one distribution into another"
- **Day 12: Sinkhorn** — "one paper made OT go from theoretical curiosity to ML workhorse"
- **Day 18: Otto calculus** — "probability space has a Riemannian structure?!"
- **Day 19: PDEs as gradient flows** — "the heat equation is just entropy rolling downhill"
- **Day 26: Flow matching** — "modern generative AI is secretly optimal transport"

## Common Misconceptions

| Concept | Misconception | Reality |
|---------|--------------|---------|
| Wasserstein vs KL | "They measure the same thing" | Wasserstein is a metric, KL is not. Wasserstein metrizes weak convergence. KL can be infinite for non-overlapping distributions. |
| Monge vs Kantorovich | "Kantorovich is just a generalization" | Kantorovich is a fundamentally different formulation (plans vs maps). The relaxation is what makes OT computationally tractable. |
| Sinkhorn | "It solves OT exactly" | It solves entropy-regularized OT. The solution is biased. Sinkhorn divergence corrects this. |
| Brenier's theorem | "Optimal maps always exist" | Only for quadratic cost + absolutely continuous source. Otherwise you need plans. |
| Wasserstein GANs | "WGANs compute the Wasserstein distance" | They approximate the dual (Lipschitz-constrained). The actual distance is never computed. |
