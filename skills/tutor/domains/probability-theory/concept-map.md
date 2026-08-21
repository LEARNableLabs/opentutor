# Probability Theory and Stochastic Processes — Concept Map

## Core Concepts (in learning order)

1. **Probability spaces and σ-algebras** — measure-theoretic foundation for defining probability
2. **Conditional probability and independence** — updating beliefs and factorizing joint distributions
3. **Random variables** — measurable functions mapping outcomes to real numbers
4. **Expectation and variance** — central tendency and spread; linearity of expectation
5. **Joint and marginal distributions** — multivariate probability; dependence vs independence
6. **Poisson distribution** — modeling rare events and discrete arrivals. Depends on: 3, 4
7. **Exponential distribution** — continuous analog of geometric; memoryless property. Depends on: 3, 4
8. **Normal distribution and MGFs** — ubiquitous bell curve; moment generating functions. Depends on: 3, 4, 5
9. **Transformation of random variables** — change of variables, Jacobian. Depends on: 3, 5
10. **Covariance and correlation** — measuring linear dependence. Depends on: 4, 5
11. **Convergence modes** — in probability, almost surely, in distribution. Depends on: 3
12. **Law of Large Numbers** — sample averages converge to expectation. Depends on: 4, 11
13. **Central Limit Theorem** — sums of i.i.d. random variables approach normality. Depends on: 8, 11, 12
14. **Stochastic processes** — indexed families of random variables; time evolution
15. **Markov property** — memorylessness for processes; future independent of past given present. Depends on: 2, 14
16. **Transition matrices** — encoding state-to-state probabilities. Depends on: 15
17. **Random walks** — discrete-time Markov chains on integers. Depends on: 15, 16
18. **Recurrence and transience** — will we return? Depends on: 17
19. **Stationary distributions** — long-run equilibrium behavior. Depends on: 16, 18
20. **Martingales** — fair game processes; conditional expectation. Depends on: 4, 14, 15
21. **Poisson process** — continuous-time counting process. Depends on: 6, 7, 14
22. **Brownian motion** — continuous-time limit of random walks; Wiener process. Depends on: 8, 13, 17
23. **Birth-death processes** — continuous-time Markov chains modeling populations. Depends on: 15, 21
24. **Stochastic calculus** — integration with respect to Brownian motion; Itô integral. Depends on: 22
25. **Renewal processes** — regenerative behavior; renewal theorem. Depends on: 14, 21
26. **Branching processes** — Galton-Watson trees; extinction probability. Depends on: 15, 20

## Key Dependencies

- **CLT requires LLN understanding** — CLT builds on LLN by describing the *rate* of convergence and limiting distribution
- **Brownian motion needs CLT** — Brownian motion emerges as a scaling limit via CLT (Donsker's theorem)
- **Markov property is central** — most discrete and continuous-time processes studied are Markovian; non-Markovian processes require different tools
- **Martingales generalize** — martingales are not necessarily Markovian, but Markov chains can be embedded in martingales
- **Exponential/Poisson connection** — exponential distribution describes interarrival times of Poisson process
- **Measure theory foundation** — while not emphasized heavily at intermediate level, σ-algebras underpin all rigorous probability
- **Conditional expectation appears everywhere** — in martingales, Markov property, filtering, optimal stopping

## Bottlenecks

1. **Convergence concepts** — students often confuse convergence in probability vs almost surely vs in distribution. This blocks understanding LLN and CLT.
2. **Markov property intuition** — recognizing when memorylessness holds is crucial for modeling. Many students struggle to identify Markovian systems.
3. **Measure-theoretic formalism** — at intermediate level, students must develop intuition without full measure theory. Too much rigor overwhelms; too little leaves gaps.
4. **Brownian motion** — continuous paths but nowhere differentiable; quadratic variation; requires paradigm shift from deterministic calculus.
5. **Conditional expectation** — understanding E[X|Y] as a random variable (not a number) is essential for martingales but counterintuitive.

## Common Misconceptions

1. **Independence vs uncorrelated** — Students think zero correlation implies independence (only true for Gaussian). Dependence is broader.
2. **"Almost surely" means "always"** — Confusion about probability-1 events vs certain events; measure-zero sets can be nonempty.
3. **CLT applies to any sequence** — Forgetting i.i.d. and finite variance assumptions. CLT doesn't hold for heavy-tailed distributions without modification.
4. **Markov property is obvious** — Many processes seem memoryless but aren't (e.g., queues with service time depending on earlier arrivals).
5. **Brownian motion is differentiable** — Students expect to differentiate sample paths; must internalize non-differentiability almost surely.
6. **Stationary distribution = equilibrium reached** — Confusing existence of stationary distribution with convergence to it; need ergodicity.
7. **Poisson process has constant rate** — Students forget inhomogeneous Poisson processes exist; rate can be time-varying.

## Prerequisite Topics

- **Calculus** — needed for: continuous distributions, expectations (integrals), limits, sequences and series
- **Linear algebra** — needed for: transition matrices, eigenvalues (stationary distributions), matrix exponentiation (continuous-time chains)
- **Basic probability** — needed for: all topics; students must know sample spaces, conditional probability, basic distributions (binomial, geometric, uniform)
- **Real analysis (light)** — needed for: convergence concepts, measure-theoretic intuition, limits of sequences of random variables

## Learning Pathways

### Fastest path to applications (queueing, finance)
Probability foundations → Poisson process → Exponential distribution → Birth-death processes → Brownian motion basics

### Deepest theoretical understanding
Probability spaces → Convergence modes → LLN/CLT → Markov chains (discrete) → Martingales → Continuous-time processes → Stochastic calculus

### Simulation-first approach
Random variables → Distributions → Random walks → Markov chains → Poisson process → Brownian motion (via random walk limits)
