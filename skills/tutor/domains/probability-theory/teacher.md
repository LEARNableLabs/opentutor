# Probability theory and stochastic processes — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 13 lessons (42%)
- **Socratic questions** — 5 lessons (16%)
- **real-world application challenges** — 5 lessons (16%)
- **review and consolidation sessions** — 4 lessons (13%)
- **teach-back exercises (student explains)** — 3 lessons (10%)
- **curated resource exploration** — 1 lessons (3%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 26% accessible (1-2), 35% standard (3), 39% challenging (4-5).

Difficulty peaks:
- Day 10: "When do we transform random variables to solve probability problems?" (difficulty 4)
- Day 12: "What are the different ways random variables can converge?" (difficulty 4)
- Day 15: "How does the Central Limit Theorem explain the bell curve?" (difficulty 4)
- Day 20: "When does a random walk return to its starting point?" (difficulty 4)
- Day 21: "What is the long-run behavior of a Markov chain?" (difficulty 4)

## Domain Hooks
- **Skorokhod's representation theorem** — when covering convergence in distribution, mention that we can often construct random variables on a common space to convert convergence in distribution to almost sure convergence. Mind-blowing but tangential.

- **Donsker's invariance principle** — random walks converge to Brownian motion under appropriate scaling. This is the functional CLT. Connects discrete and continuous-time beautifully. Drop this in when discussing Brownian motion as a limit.

- **Kolmogorov's extension theorem** — how do we actually construct stochastic processes? Mention when discussing process definitions; students find it fascinating that consistent finite-dimensional distributions uniquely determine a process.

- **Ergodic theory connections** — stationary processes, ergodic theorem, mixing. For students interested in dynamical systems or statistical mechanics. Mention when covering stationary distributions.

- **Lévy processes** — generalization of Brownian motion

## Common Failure Modes
1. **"Independent means uncorrelated"** — Students confuse these concepts. Independence implies zero correlation (for finite variance), but zero correlation doesn't imply independence except for Gaussians. Provide counterexamples: X uniform on [-1, 1], Y = X². Then Cov(X,Y) = 0 but they're completely dependent.

2. **"Almost surely" means "for sure"** — Probability-1 events can exclude sets of outcomes (measure-zero sets). Students struggle with "almost surely" vs "surely." Example: picking a random real from [0,1], we get an irrational *almost surely*, but rationals are possible.

3. **"Brownian motion is smooth somewhere"** — Students expect continuous functions to be differentiable *somewhere*. Brownian paths are continuous *everywhere* but differentiable *nowhere* (with probability 1). This violates intuition from calculus. Use visualizations showing increasingly jagged paths at finer scales.

4. **"CLT works for any average"** — Forgetting the i.i.d. and finite variance assumption

## Vocabulary
Key terms for this domain: probability spaces, σ-algebras, measure theory intuition, conditional probability, independence, Bayes' theorem, random variables, measurability, distribution functions, expectation, linearity of expectation, variance, joint distributions, marginal distributions, Poisson distribution (and 70 more).