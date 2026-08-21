# Causal Inference in Machine Learning — Concept Map

## Core Concepts (in learning order)

1. **Correlation vs Causation** — why predictive accuracy doesn't guarantee good interventions
2. **Prediction vs Intervention** — the fundamental distinction between P(Y|X) and P(Y|do(X))
3. **Simpson's Paradox** — when aggregated and disaggregated data give opposite conclusions
4. **Potential Outcomes** — the counterfactual framework: what would have happened under different treatments
5. **Treatment and Control** — formalizing interventions and comparisons
6. **Counterfactuals** — reasoning about unobserved outcomes
7. **SUTVA** — Stable Unit Treatment Value Assumption (no interference, deterministic potential outcomes)
8. **Consistency** — the observed outcome under treatment equals the potential outcome
9. **Ignorability (Unconfoundedness)** — treatment assignment is independent of potential outcomes given covariates
10. **Positivity (Overlap)** — every unit has some probability of receiving each treatment
11. **Confounding** — common causes of treatment and outcome that bias naive estimates
12. **Selection Bias** — systematic differences between treated and control groups
13. **DAGs (Directed Acyclic Graphs)** — graphical representation of causal relationships. Depends on: basic graph concepts
14. **Causal Pathways** — directed paths through a DAG representing causal influence
15. **Confounders** — variables that affect both treatment and outcome, creating bias. Depends on: DAGs
16. **Mediators** — variables on the causal path from treatment to outcome. Depends on: DAGs
17. **Colliders** — variables affected by two other variables. Depends on: DAGs
18. **d-separation** — graph criterion for conditional independence. Depends on: DAGs, confounders, mediators, colliders
19. **Blocking Paths** — how conditioning on variables blocks or opens information flow. Depends on: d-separation
20. **Collider Bias (Berkson's Paradox)** — how conditioning on colliders creates spurious correlations. Depends on: colliders, d-separation
21. **Identifiability** — whether a causal effect can be estimated from observational data. Depends on: potential outcomes, DAGs
22. **Causal Estimands** — the target quantity we want to estimate (ATE, ATT, etc.). Depends on: potential outcomes
23. **Backdoor Criterion** — sufficient conditions for identifying causal effects via covariate adjustment. Depends on: DAGs, d-separation
24. **Adjustment Sets** — which variables to condition on to identify effects. Depends on: backdoor criterion
25. **Frontdoor Criterion** — alternative identification strategy using mediators. Depends on: mediators, identifiability
26. **Instrumental Variables (IV)** — variables that affect treatment but not outcome (except through treatment). Depends on: identifiability
27. **Regression Adjustment** — estimating effects by conditioning on confounders. Depends on: adjustment sets
28. **Stratification** — estimating effects within covariate strata. Depends on: adjustment sets
29. **Propensity Score** — probability of treatment given covariates. Depends on: ignorability
30. **Inverse Probability Weighting (IPW)** — weighting by inverse propensity to create pseudo-population. Depends on: propensity score
31. **Matching** — pairing similar treated and control units. Depends on: propensity score
32. **Doubly Robust Estimation** — combines outcome model and propensity model for robustness. Depends on: regression adjustment, IPW
33. **AIPW (Augmented IPW)** — specific doubly robust estimator. Depends on: doubly robust estimation
34. **Regression Discontinuity** — exploiting sharp cutoffs in treatment assignment. Depends on: natural experiments
35. **Difference-in-Differences** — comparing treatment vs control groups before/after intervention. Depends on: parallel trends assumption
36. **Treatment Effect Heterogeneity** — variation in effects across subgroups. Depends on: causal estimands
37. **CATE (Conditional Average Treatment Effect)** — average effect within subgroups. Depends on: treatment effect heterogeneity
38. **Meta-learners** — ML algorithms for estimating heterogeneous effects. Depends on: CATE
39. **S-learner** — single model for all units. Depends on: meta-learners
40. **T-learner** — separate models for treated and control. Depends on: meta-learners
41. **X-learner** — improved two-model approach for imbalanced data. Depends on: T-learner
42. **Causal Trees** — decision trees optimized for treatment effect estimation. Depends on: CATE
43. **Causal Forests** — ensemble of causal trees. Depends on: causal trees
44. **Honest Splitting** — using separate samples for tree construction and estimation. Depends on: causal trees
45. **Uplift Modeling** — predicting individual treatment effects for targeting. Depends on: CATE, meta-learners
46. **Policy Learning** — learning optimal treatment assignment rules. Depends on: CATE
47. **Refutation Tests** — sensitivity analysis to test causal assumptions. Depends on: identifiability
48. **CUPED** — variance reduction technique for experiments. Depends on: experimental design

## Key Dependencies

- **DAGs are foundational** — most modern causal inference builds on graphical models. Understanding confounders, mediators, and colliders requires visual/graphical reasoning.

- **Identification before estimation** — you must establish *what* you're estimating (via backdoor, frontdoor, IV, etc.) before choosing *how* to estimate it.

- **Propensity scores enable many estimators** — IPW, matching, and doubly robust methods all rely on propensity score modeling.

- **Doubly robust methods protect against misspecification** — but require understanding both outcome regression and propensity models.

- **Heterogeneity builds on homogeneous effects** — understanding average treatment effects (ATE) is prerequisite to conditional effects (CATE).

- **Meta-learners are a bridge** — they connect traditional supervised ML to causal inference, making heterogeneity accessible to ML practitioners.

## Critical Bottlenecks

1. **Understanding confounding** — this is the central problem in observational causal inference. Without it, DAGs and adjustment sets don't make sense.

2. **d-separation** — the most technically challenging concept in graphical models. Students often struggle with colliders and when conditioning helps vs hurts.

3. **Identifiability vs estimation** — students often conflate "can we identify the effect?" with "can we estimate it well?" These are separate questions.

4. **Propensity score intuition** — why weighting by inverse probability creates balance is non-obvious and crucial for understanding modern methods.

5. **The difference between S/T/X-learners** — these look similar but have different bias-variance tradeoffs that matter in practice.

## Prerequisite Topics

- **Probability and statistics** — needed for: conditional probability, expectation, variance, independence
- **Linear regression** — needed for: regression adjustment, outcome modeling
- **Supervised learning basics** — needed for: meta-learners, causal forests, propensity modeling
- **Decision trees and random forests** — needed for: causal trees and forests
- **Basic graph theory** — needed for: understanding DAG structure (optional but helpful)

## Common Learning Paths

**Path 1: From ML to causality**
- Start with "why prediction ≠ intervention"
- Build DAG intuition early
- Emphasize how causal methods improve decision-making
- Use familiar ML tools (sklearn, forests) as building blocks

**Path 2: From statistics to ML**
- Start with potential outcomes and RCTs
- Build toward observational methods
- Introduce ML as a tool for flexible estimation
- Emphasize when ML helps and when it doesn't

For intermediate ML students (our target), Path 1 is usually more effective.
