# Causal Inference in Machine Learning — Research Summary

## Major Subtopics

1. **Foundations of Causality** — correlation vs causation, causal assumptions, potential outcomes framework (Rubin), structural causal models (Pearl)

2. **Graphical Models** — DAGs (directed acyclic graphs), d-separation, backdoor criterion, frontdoor criterion, instrumental variables, colliders and confounders

3. **Identification** — when can we identify causal effects from observational data? Conditions for identifiability, do-calculus, covariate adjustment

4. **Estimation Methods** — propensity score matching, inverse probability weighting, doubly robust estimation, regression discontinuity, difference-in-differences, synthetic controls

5. **Treatment Effect Heterogeneity** — conditional average treatment effects (CATE), uplift modeling, meta-learners (S-learner, T-learner, X-learner), causal trees and forests

6. **Deep Learning for Causality** — causal representation learning, counterfactual prediction, treatment effect estimation with neural networks

7. **Applications** — A/B testing, personalized medicine, policy evaluation, recommendation systems, fairness

## Key Sources

### Textbooks & Courses
- **Brady Neal's "Introduction to Causal Inference"** — modern ML-focused textbook with free online course and video lectures
- **Pearl, Glymour, Jewell: "Causal Inference in Statistics: A Primer"** — foundational graphical models approach
- **Hernán & Robins: "Causal Inference: What If"** — epidemiology perspective, potential outcomes framework
- **Imbens & Rubin: "Causal Inference for Statistics, Social, and Biomedical Sciences"** — rigorous treatment of potential outcomes

### Online Courses & Tutorials
- Brady Neal's video lecture series (YouTube)
- KDD 2021 Tutorial on Causal Inference
- Microsoft Research EconML tutorials
- MIT OpenCourseWare: various econometrics and causal inference courses

### Software Libraries
- **DoWhy** (Microsoft/PyWhy) — unified framework for causal inference, follows 4-step workflow
- **EconML** (Microsoft/PyWhy) — heterogeneous treatment effects, CATE estimation
- **CausalML** (Uber) — uplift modeling, meta-learners
- **CausalNex** (QuantumBlack) — Bayesian networks and structure learning
- **Causal-learn** — causal discovery algorithms

### Key Papers
- "A Survey on Causal Inference" (Yao et al., 2020) — comprehensive overview
- "Causal Inference Using Invariant Prediction" (Peters et al., 2016)
- "Double/Debiased Machine Learning" (Chernozhukov et al., 2018)
- "Meta-learners for Estimating Heterogeneous Treatment Effects" (Künzel et al., 2019)

## Available Resources

**Interactive Tools:**
- DoWhy example notebooks (Jupyter)
- Causality tutorial notebooks on GitHub
- DAGitty web tool for drawing and analyzing causal graphs

**Video Content:**
- Brady Neal's full lecture series
- PyData talks on causal inference
- Microsoft Research seminars

**Code Examples:**
- DoWhy documentation and tutorials
- EconML case studies
- Real-world datasets (LaLonde job training, twins dataset, etc.)

## Teaching Strategy

For intermediate level:
- Assume familiarity with ML basics (supervised learning, cross-validation, basic probability)
- Start with motivation (why correlation ≠ causation matters in practice)
- Build graphical intuition before heavy math
- Use code early and often (DoWhy provides great scaffolding)
- Connect to familiar ML concepts (prediction vs intervention)
- Focus on identification before estimation
- Emphasize when methods work vs when they fail
