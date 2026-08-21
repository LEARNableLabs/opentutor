# Auction Theory and Mechanism Design — Concept Map

## Core Concepts (in learning order)

1. **Auction formats** — English, Dutch, first-price sealed-bid, second-price sealed-bid (Vickrey)
2. **Dominant strategy** — a strategy that is optimal regardless of what others do
3. **Vickrey auction** — second-price sealed-bid auction where truth-telling is dominant. Depends on: dominant strategy
4. **Revenue equivalence** — different auction formats yield the same expected revenue under certain conditions. Depends on: auction formats, symmetric equilibrium
5. **Bid shading** — strategic under-bidding in first-price auctions. Depends on: Bayesian Nash equilibrium
6. **Mechanism design** — designing game rules to achieve desired outcomes
7. **Incentive compatibility (IC)** — property where truth-telling is in each agent's interest. Depends on: dominant strategy, mechanism design
8. **Dominant strategy incentive compatible (DSIC)** — strongest form of IC where truth-telling is dominant. Depends on: incentive compatibility
9. **Revelation principle** — any mechanism can be replaced by a truthful direct mechanism with same outcomes. Depends on: DSIC, mechanism design
10. **Myerson's Lemma** — complete characterization of DSIC mechanisms via monotonicity. Depends on: DSIC, revelation principle
11. **Monotone allocation rule** — higher bids never decrease probability of winning. Depends on: Myerson's Lemma
12. **Revenue maximization** — seller's objective to maximize expected revenue. Depends on: mechanism design
13. **Reserve price** — minimum acceptable bid. Depends on: revenue maximization, individual rationality
14. **Individual rationality (IR)** — agents voluntarily participate (non-negative utility). Depends on: mechanism design
15. **Virtual valuation** — transformed valuation accounting for information rent. Depends on: Bayesian optimization, revenue maximization
16. **Myerson's optimal auction** — revenue-maximizing auction using virtual valuations. Depends on: virtual valuation, DSIC
17. **Bayesian incentive compatible (BIC)** — truth-telling in expectation over other agents' types. Depends on: incentive compatibility
18. **Prior distribution** — probability distribution over agent valuations. Depends on: Bayesian game theory
19. **VCG mechanism** — Vickrey-Clarke-Groves mechanism for multi-item settings. Depends on: DSIC, social welfare
20. **Social welfare** — sum of all agents' utilities. Depends on: mechanism design
21. **Combinatorial auction** — auction where bidders bid on bundles of items. Depends on: VCG, computational complexity
22. **Package bidding** — bidding on combinations of items. Depends on: combinatorial auction
23. **Winner determination problem** — computational problem of finding welfare-maximizing allocation. Depends on: combinatorial auction
24. **Sponsored search auction** — position auction for search ads. Depends on: VCG, multi-item auctions
25. **Generalized second price (GSP)** — payment rule used in ad auctions. Depends on: sponsored search auction
26. **Implementation challenges** — practical issues in real-world mechanism deployment. Depends on: mechanism design
27. **Matching markets** — allocation without monetary transfers. Depends on: mechanism design, strategyproofness
28. **Strategyproofness** — another term for dominant strategy incentive compatibility. Depends on: DSIC

## Dependencies

- **Vickrey auction** requires understanding **dominant strategy** because its key property is that truthful bidding is a dominant strategy for all bidders
- **Revenue equivalence** builds on **auction formats** and **symmetric equilibrium** because it shows that under symmetric independent private values, all standard auction formats yield the same expected revenue
- **Revelation principle** depends on **DSIC** and **mechanism design** because it establishes that any equilibrium of any mechanism can be replicated by a direct truthful mechanism
- **Myerson's Lemma** builds on **DSIC** and **revelation principle** because it provides a complete characterization of when a mechanism is DSIC through the monotonicity property
- **Virtual valuation** requires **Bayesian optimization** and **revenue maximization** because it transforms the seller's optimization problem into a simpler form
- **Myerson's optimal auction** depends on **virtual valuation** and **DSIC** because it maximizes revenue by allocating to the agent with highest non-negative virtual valuation
- **VCG mechanism** extends **Vickrey auction** to multi-item settings and requires understanding **social welfare** because it maximizes total welfare while maintaining DSIC
- **Combinatorial auction** builds on **VCG** but introduces **computational complexity** because winner determination becomes NP-hard
- **Sponsored search auction** applies **VCG** and **multi-item auctions** to the real-world problem of ad placement
- **Matching markets** use mechanism design principles without monetary transfers, requiring different approaches to achieve strategyproofness

## Bottleneck Concepts

These concepts are critical gates — students must solidify understanding before proceeding:

1. **Dominant strategy** (Lesson 2) — foundational for all IC concepts
2. **Revelation principle** (Lesson 10) — unlocks mechanism design methodology
3. **Myerson's Lemma** (Lesson 11) — characterization theorem for single-parameter settings
4. **Virtual valuation** (Lesson 16) — key transformation for revenue optimization
5. **VCG mechanism** (Lesson 20) — canonical multi-parameter mechanism

## Mind-Blowing Moments

- **Revenue equivalence** (Lesson 3): Radically different auction rules generate identical revenue
- **Revelation principle** (Lesson 10): We can WLOG assume everyone tells the truth when designing mechanisms
- **Myerson's Lemma** (Lesson 11): A simple monotonicity condition completely characterizes all DSIC mechanisms
- **Virtual valuations** (Lesson 16): The optimal auction may exclude agents with positive valuations
- **VCG impossibility** (Lesson 22): You can't have both efficiency and revenue maximization in general

## Common Misconceptions

1. **"Second-price auctions are always better than first-price"** — They're strategically simpler but revenue-equivalent under standard assumptions
2. **"The Vickrey auction is widely used in practice"** — Actually rare in practice despite beautiful theoretical properties
3. **"DSIC means the mechanism is fair"** — IC only addresses strategic behavior, not fairness or equity
4. **"The revelation principle means we can ignore indirect mechanisms"** — It's a theoretical tool; direct mechanisms may be impractical
5. **"Higher reserve prices always increase revenue"** — Only true in expectation; may reduce revenue if set too high
6. **"VCG mechanisms are practical for complex settings"** — Computationally intractable for many realistic problems
7. **"Mechanism design eliminates all strategic behavior"** — Only specific types; agents can still collude, manipulate timing, etc.
8. **"Bayesian IC is weaker than DSIC in all ways"** — It allows for richer mechanisms; sometimes the only feasible notion of IC

## Prerequisite Topics

- **Probability theory** — needed for revenue equivalence, Bayesian mechanisms, expected values
- **Game theory basics** — Nash equilibrium, dominant strategies, Bayesian games
- **Optimization** — needed for revenue maximization, welfare maximization
- **Mathematical proof techniques** — needed for revelation principle, Myerson's Lemma, impossibility results
- **Computational complexity (basic)** — helpful for understanding combinatorial auction challenges

## Connections to Other Fields

- **Computer science** — algorithmic mechanism design, computational complexity, online algorithms
- **Economics** — market design, contract theory, industrial organization
- **Operations research** — optimization, resource allocation
- **Public policy** — spectrum allocation, school choice, organ exchange
- **Finance** — security design, derivatives pricing
- **Political science** — voting theory, social choice
