# Risk Management and Actuarial Science — Concept Map

## Core Concepts (in learning order)

1. **Heavy-tailed distributions** — distributions with extreme values that decay slower than exponential (Pareto, lognormal)
2. **Maximum likelihood estimation** — finding parameter values that maximize the probability of observing the data
3. **Transformation of random variables** — how distributions change under functional transformations
4. **Survival function** — probability of surviving beyond time t; complement of CDF. Depends on: transformation
5. **Hazard rate / force of mortality** — instantaneous failure rate at time t. Depends on: survival function
6. **Exponential distribution and memoryless property** — constant hazard rate; past doesn't affect future. Depends on: hazard rate
7. **Life tables** — tabular representation of mortality rates by age. Depends on: survival function, mortality rates
8. **Actuarial present value (APV)** — expected present value of future cash flows contingent on survival. Depends on: life tables, probability theory
9. **Life insurance premiums** — net single premium for death benefits. Depends on: APV
10. **Life annuities** — payments made contingent on survival. Depends on: APV, life tables
11. **Reserves and policy values** — funds held to meet future obligations. Depends on: APV, premiums, annuities
12. **Select mortality** — mortality that varies by time since policy issue. Depends on: life tables
13. **Loss distributions** — probability models for claim severity (gamma, Weibull, Pareto, lognormal). Depends on: heavy-tailed distributions
14. **Policy modifications** — deductibles, limits, coinsurance that alter loss distributions. Depends on: loss distributions
15. **Excess distributions** — conditional distribution of losses above a threshold. Depends on: loss distributions, policy modifications
16. **Limited expected value** — expected value truncated at a policy limit. Depends on: policy modifications
17. **Frequency models** — distributions for claim counts (Poisson, negative binomial). Depends on: discrete probability
18. **Overdispersion** — variance exceeds mean in count data. Depends on: frequency models
19. **Truncation and censoring** — observational limitations on data. Depends on: loss distributions
20. **Aggregate loss models** — total losses = sum of random number of random losses. Depends on: frequency models, loss distributions
21. **Compound distributions** — distribution of random sum. Depends on: aggregate loss models
22. **Panjer recursion** — efficient algorithm for aggregate loss distribution. Depends on: compound distributions, frequency models
23. **Surplus process** — insurer's capital over time with premiums and claims. Depends on: aggregate loss models
24. **Ruin probability** — probability that surplus becomes negative. Depends on: surplus process
25. **Adjustment coefficient** — exponential decay rate for ruin probability. Depends on: ruin probability
26. **Lundberg inequality** — exponential upper bound on ruin probability. Depends on: adjustment coefficient
27. **Subexponential distributions** — tails so heavy that sum ≈ max. Depends on: heavy-tailed distributions
28. **Credibility theory** — weighted average of individual and group experience. Depends on: statistical estimation
29. **Limited fluctuation credibility** — full credibility based on sample size. Depends on: credibility theory
30. **Bühlmann credibility** — Bayesian optimal credibility weight. Depends on: credibility theory, empirical Bayes
31. **Experience rating** — premium adjustment based on claim history. Depends on: credibility theory
32. **Bonus-malus systems** — no-claims discount structures. Depends on: experience rating
33. **Enterprise Risk Management (ERM)** — holistic approach to identifying and managing all organizational risks
34. **Economic capital** — capital needed to survive extreme losses at a confidence level. Depends on: aggregate loss models, VaR
35. **Value-at-Risk (VaR)** — quantile of loss distribution. Depends on: loss distributions
36. **Tail-VaR / Conditional Tail Expectation** — expected loss given VaR is exceeded. Depends on: VaR, excess distributions
37. **Emerging risks** — climate change, pandemics, cyber risk with limited historical data. Depends on: model uncertainty, ERM

## Dependencies

### Survival Models Foundation
- **Hazard rate** requires understanding **survival function** because the hazard is the derivative of -log(S(t))
- **Exponential distribution** is uniquely characterized by constant hazard rate
- **Life tables** build on survival functions, discretizing them by age

### Life Contingencies Chain
- **Actuarial present value** builds on **life tables** and requires integrating survival probabilities with discount factors
- **Life insurance** and **life annuities** are both applications of APV with different cash flow patterns
- **Reserves** require understanding both premiums and annuities to compute prospective and retrospective values
- **Select mortality** extends life tables to account for selection effects at policy issue

### Loss Modeling Progression
- **Policy modifications** transform **loss distributions** by changing support and probability mass
- **Excess distributions** are conditional distributions that build on both loss distributions and policy limits
- **Limited expected value** integrates the modified loss distribution up to a limit
- **Aggregate loss models** combine **frequency** and **severity** into compound distributions
- **Panjer recursion** exploits the (a,b,0) structure of frequency distributions to efficiently compute aggregate distributions

### Risk Theory Build-up
- **Surplus process** tracks **aggregate losses** against premium income over time
- **Ruin probability** is the probability the surplus process ever goes negative
- **Adjustment coefficient** is found by solving the Lundberg equation and depends on moment generating functions
- **Lundberg inequality** provides an exponential bound on ruin using the adjustment coefficient
- **Subexponential distributions** break classical ruin theory because MGFs may not exist

### Credibility Framework
- **Limited fluctuation credibility** uses classical confidence intervals to determine full credibility standards
- **Bühlmann credibility** optimizes credibility weight to minimize squared error, yielding Z = n/(n+k)
- Both approaches blend **individual experience** with **group data**
- **Experience rating** applies credibility in pricing, especially for large commercial accounts
- **Bonus-malus** is a discrete credibility system for personal lines

### Enterprise Risk Integration
- **ERM frameworks** integrate all risk types (insurance, financial, operational, strategic)
- **Economic capital** uses **VaR** or **Tail-VaR** to quantify capital needed
- **Tail-VaR** builds on **VaR** and **excess distributions** — it's the conditional expectation beyond VaR
- **Emerging risks** challenge traditional models because they lack sufficient data and exhibit tail dependence

## Prerequisite Topics

- **Multivariable calculus** — needed for transformations, Jacobians, multiple integrals (aggregate loss convolutions)
- **Linear algebra** — needed for credibility matrices, multivariate distributions, copulas
- **Probability theory** — moment generating functions, conditional expectation, convolution, law of total probability
- **Statistics** — hypothesis testing, confidence intervals, maximum likelihood, Bayesian inference

## Key Bottleneck Concepts

These concepts are gates to understanding later material:

1. **Survival function and hazard rate** — foundational for all life contingencies and duration models
2. **Actuarial present value** — core building block for all life insurance and annuity calculations
3. **Compound distributions** — essential for aggregate loss modeling and risk theory
4. **Adjustment coefficient** — key to understanding ruin probability bounds
5. **Bühlmann credibility** — conceptual leap from frequentist to Bayesian perspective in pricing

## Common Conceptual Traps

- **Confusing truncation vs censoring** — truncation: data points missing entirely; censoring: data points observed but values unknown
- **Mixing frequency and severity** — frequency models claim counts; severity models claim amounts
- **Forgetting policy modifications change the distribution** — deductible doesn't just shift; it changes shape
- **Thinking credibility is averaging** — it's optimal weighting to minimize prediction error
- **Assuming independence in aggregate models** — frequency and severity must be independent; violating this changes everything

## Learning Path Visualization

```
Probability/Stats Foundation
         ↓
    ┌────┴────┐
    ↓         ↓
Survival   Loss Distributions
Models         ↓
    ↓      Policy Modifications
Life Tables    ↓
    ↓      Frequency Models
   APV         ↓
    ↓      Aggregate Loss ←─── Credibility
Premiums       ↓                   ↓
Annuities  Ruin Theory      Experience Rating
    ↓          ↓                   ↓
Reserves   Adjustment Coeff       ↓
    └──────┬───────┴──────────────┘
           ↓
    Enterprise Risk Management
           ↓
      Emerging Risks
```

The curriculum interleaves life and P&C content to show parallel applications of fundamental probability concepts.
