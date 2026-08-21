# Auction Theory and Mechanism Design — Teaching Notes

## Approach

Auction theory sits at the intersection of economics, game theory, and computer science, requiring both mathematical rigor and economic intuition. At the intermediate level, balance formal proofs with concrete examples and real-world applications. Start with familiar auction settings (eBay, art auctions) to build intuition, then develop the theoretical machinery systematically. Use the revelation principle as a pivot point: before it, we study specific auctions; after it, we design mechanisms from scratch. Emphasize the computational perspective throughout — this isn't just theory, it's algorithmic mechanism design.

## Common Misconceptions

1. **"Incentive compatibility means the mechanism is optimal or fair"**
   - Why: Students conflate strategic simplicity with normative goals
   - Correction: IC only addresses strategic behavior. A mechanism can be IC but inefficient, unfair, or revenue-poor. IC is a constraint, not an objective.

2. **"The Vickrey auction is the 'best' auction"**
   - Why: Heavy emphasis on DSIC property and theoretical elegance
   - Correction: Vickrey has many advantages but also weaknesses (vulnerability to collusion, requires trust in auctioneer, rare in practice). Different objectives favor different designs.

3. **"Revenue equivalence means all auctions are the same"**
   - Why: Misunderstanding the theorem's scope and assumptions
   - Correction: Revenue equivalence only holds under specific conditions (SIPV, risk neutrality, symmetric equilibrium). Relax any assumption and revenues diverge.

4. **"DSIC is always achievable"**
   - Why: Vickrey and VCG examples suggest it's universal
   - Correction: In multi-parameter settings, DSIC is highly restrictive. Many important problems (budget-constrained bidders, non-quasilinear preferences) make DSIC impossible or impractical.

5. **"The revelation principle lets us ignore indirect mechanisms"**
   - Why: Theorem seems to make all indirect mechanisms redundant
   - Correction: RP is a theoretical tool for analysis, not a prescription for implementation. Direct mechanisms may be complex, unintuitive, or strategically fragile in practice.

6. **"Virtual valuations are just a mathematical trick"**
   - Why: The transformation seems arbitrary
   - Correction: Virtual valuations capture a deep economic insight: the trade-off between allocative efficiency and extracting information rent. They reveal *why* optimal auctions exclude some bidders.

7. **"VCG mechanisms solve all multi-item allocation problems"**
   - Why: VCG's theoretical elegance and DSIC property
   - Correction: VCG requires solving computationally intractable optimization problems for many settings (combinatorial auctions), can have zero revenue, and is vulnerable to collusion.

8. **"Myerson's Lemma only applies to auctions"**
   - Why: Introduced in auction context
   - Correction: It characterizes *all* single-parameter DSIC mechanisms — auctions, cost-sharing, routing, scheduling, etc.

9. **"Higher reserve prices always help the seller"**
   - Why: Intuition that restricting supply increases prices
   - Correction: Too-high reserves exclude profitable trades. Optimal reserve balances increased price against reduced sale probability.

10. **"Mechanism design eliminates all gaming"**
    - Why: Focus on strategic properties like DSIC
    - Correction: Mechanism design addresses preference revelation but not collusion, shill bidding, timing games, or information acquisition. Strategic issues remain.

11. **"Bayesian IC is just a weaker version of DSIC with no advantages"**
    - Why: DSIC is presented as the gold standard
    - Correction: BIC allows for richer mechanisms and better revenue in many settings. It's a different tool, not a compromise.

12. **"The efficient outcome is always revenue-maximizing"**
    - Why: Confusion between welfare and revenue objectives
    - Correction: Efficiency (welfare maximization) and revenue maximization are often in direct conflict. Optimal auctions deliberately distort allocations.

## Level Adjustments

**Intermediate vs. Beginner:**
- Use formal proofs for key results (revelation principle, Myerson's Lemma), not just statements
- Expect comfort with probability, expected values, optimization
- Introduce computational complexity considerations
- Cover both DSIC and BIC (beginners might only see DSIC)

**Intermediate vs. Advanced:**
- Skip or simplify multi-parameter impossibility results (Roberts' theorem, AGV impossibility)
- Don't cover approximation mechanisms or robust mechanism design in depth
- Treat computational complexity at a conceptual level, not algorithmic detail
- Limit to standard models (no budget constraints, no interdependent values, no dynamics)

**Formalism balance:**
- State theorems precisely with assumptions
- Prove 2-3 key results in full (revelation principle, Myerson's Lemma for a simple case, revenue equivalence sketch)
- For others, provide proof sketches or intuition
- Emphasize "what does this theorem really say?" over technical details

## Rabbit Holes

These are fascinating tangents to mention briefly but not dive into at intermediate level:

1. **Roberts' theorem** (Lesson 10) — Only VCG-like mechanisms are DSIC in multi-parameter settings. Mind-blowing impossibility result, but proof is very technical.

2. **Algorithmic mechanism design without money** (Lesson 25) — Matching markets, school choice, kidney exchange. Rich applied area but requires different tools.

3. **Approximate mechanism design** (Lesson 21) — When exact optimization is hard, design approximately optimal mechanisms. Active research area.

4. **Dynamic mechanism design** (Lesson 26) — Multi-period settings where preferences evolve. Technically demanding.

5. **Interdependent values** (Lesson 4) — When your value depends on others' private information (common value auctions). Different equilibrium concepts needed.

6. **Budget constraints** (Lesson 16) — Bidders with limited budgets break standard mechanism design. Rich but complex.

7. **Collusion and shill bidding** (Lesson 24) — Strategic manipulation beyond individual misreporting. Game-theoretic and empirical challenges.

8. **Prior-free mechanism design** (Lesson 16) — Designing without knowing bidders' value distributions. Connects to worst-case analysis.

## Difficulty Progression Notes

**Arc 1: Classical Auctions (Lessons 1-7)**
- Start easy with familiar examples (difficulty 1-2)
- Peak at revenue equivalence (difficulty 3) — first real theorem
- Review at lesson 7 before shifting to mechanism design

**Arc 2: Mechanism Design Foundations (Lessons 8-13)**
- Build to Myerson's Lemma (difficulty 5 at lesson 11) — hardest single concept
- Revelation principle (difficulty 4) is second peak
- Review at lesson 13 to consolidate before moving to applications

**Arc 3: Revenue Maximization (Lessons 14-19)**
- Virtual valuations (difficulty 5 at lesson 16) — second hardest peak
- BIC vs DSIC (difficulty 4) adds conceptual complexity
- Review at lesson 19 before advanced mechanisms

**Arc 4: Advanced Mechanisms (Lessons 20-23)**
- VCG (difficulty 4) and combinatorial auctions (difficulty 4) are sustained challenge
- Sponsored search (difficulty 3) provides concrete application to ease tension

**Arc 5: Applications (Lessons 24-27)**
- Lower difficulty (2-3) to emphasize real-world trade-offs over new theory
- Final review at lesson 27

**Overall pattern:** Two major difficulty peaks (Myerson's Lemma at 11, virtual valuations at 16), with reviews strategically placed after each peak to consolidate before advancing.

## Assessment Strategies

**Formative (during lessons):**
- Ask students to verify IC for simple mechanisms
- Design small mechanisms for concrete scenarios
- Identify which assumptions are needed for theorems to hold
- Compute equilibria in simple auctions
- Calculate optimal reserve prices for given distributions

**Summative (end of curriculum):**
- Design a mechanism for a realistic market design problem (e.g., school choice, ad auction)
- Analyze a real-world auction failure and propose improvements
- Prove a mechanism is DSIC or provide a counterexample
- Compute optimal auction for a specific valuation distribution
- Compare VCG and GSP for a sponsored search setting

**Red flags (student is struggling):**
- Confusing DSIC with other game-theoretic concepts (Nash equilibrium, dominant strategy)
- Unable to set up expected value calculations
- Difficulty distinguishing allocation rules from payment rules
- Treating theorems as facts without understanding assumptions
- Can't connect abstract theory to concrete auction examples

**Green flags (student is thriving):**
- Identifying when theorems do/don't apply based on assumptions
- Designing mechanisms creatively for new problems
- Asking about relaxing assumptions or extending results
- Connecting mechanism design to computer science, economics, and policy
- Critiquing real-world auction designs using course concepts
