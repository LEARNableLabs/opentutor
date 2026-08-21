# Mathematics of Voting and Fair Division — Concept Map

## Core Concepts (in learning order)

1. **Preference aggregation** — combining individual preferences into a collective decision
2. **Voting rules** — systematic procedures for determining winners from ballots
3. **Plurality voting** — simplest system: most votes wins
4. **Ranked ballots** — voters order candidates by preference
5. **Preference profiles** — collection of all voters' rankings
6. **Majority rule** — candidate preferred by >50% of voters
7. **Borda count** — positional voting system assigning points by rank
8. **Positional voting** — general class of systems using rank-based scores
9. **Instant runoff voting (IRV)** — sequential elimination of last-place candidates. Depends on: ranked ballots
10. **Ranked choice voting** — general term for IRV and similar methods. Depends on: ranked ballots
11. **Approval voting** — voters approve any number of candidates
12. **Condorcet paradox** — majority preference can cycle. Depends on: majority rule, transitivity
13. **Majority cycles** — A beats B, B beats C, C beats A in pairwise comparisons. Depends on: pairwise comparisons
14. **Transitivity** — if A>B and B>C, then A>C (can fail in voting)
15. **Independence of irrelevant alternatives (IIA)** — outcome shouldn't change when non-winning candidate is removed. Depends on: voting rules
16. **Spoiler effect** — third candidate changes the winner. Depends on: IIA violation
17. **Arrow's impossibility theorem** — no voting system satisfies all fairness criteria simultaneously. Depends on: IIA, transitivity, Pareto efficiency
18. **Fairness criteria** — desirable properties of voting systems (IIA, unanimity, non-dictatorship). Depends on: preference aggregation
19. **Gibbard-Satterthwaite theorem** — all reasonable voting systems are manipulable. Depends on: strategic voting, Arrow's theorem
20. **Strategy-proofness** — voting honestly is always optimal. Depends on: strategic voting
21. **Strategic voting** — voting dishonestly to get a better outcome. Depends on: voting rules
22. **Discrete fair division** — allocating indivisible items among people
23. **Indivisible goods** — items that cannot be split (house, car, heirloom)
24. **Allocation problems** — how to assign items to people. Depends on: discrete fair division
25. **Envy-freeness** — no one prefers someone else's allocation to their own. Depends on: valuation functions
26. **Valuation functions** — how much each person values each item
27. **Approximate envy-freeness** — near-envy-free when exact is impossible. Depends on: envy-freeness, indivisible goods
28. **Continuous division** — splitting divisible resources (land, time, cake)
29. **Cake cutting** — model problem for continuous fair division
30. **Heterogeneous goods** — different parts valued differently by different people. Depends on: valuation functions
31. **Cut-and-choose** — two-player protocol: one cuts, other chooses. Depends on: cake cutting
32. **Proportionality** — everyone gets at least 1/n of the value (for n people). Depends on: valuation functions
33. **Selfridge-Conway protocol** — three-player envy-free cake cutting. Depends on: envy-freeness, cake cutting
34. **Pareto efficiency** — no reallocation makes someone better off without hurting anyone. Depends on: allocation problems
35. **Fairness vs efficiency trade-offs** — envy-free allocations may not be Pareto-efficient. Depends on: Pareto efficiency, envy-freeness
36. **Voting power indices** — measure of how much influence a voter has. Depends on: voting rules
37. **Shapley-Shubik index** — voting power based on pivotal positions. Depends on: game theory, coalitions
38. **Banzhaf power index** — voting power based on swing votes. Depends on: game theory, coalitions
39. **Preference misreporting** — lying about valuations to get better outcomes. Depends on: strategic behavior
40. **Mechanism design** — designing rules to incentivize truthful behavior. Depends on: strategic voting, preference misreporting

## Dependencies

### Voting Theory Chain
- **Ranked ballots** enable more sophisticated voting rules (Borda, IRV) than plurality
- **Condorcet paradox** shows majority rule can violate transitivity when applied pairwise
- **IIA violations** (spoiler effects) occur in most voting systems, motivating Arrow's theorem
- **Arrow's theorem** proves no system can simultaneously satisfy all fairness criteria
- **Gibbard-Satterthwaite theorem** extends Arrow's result to show all systems are manipulable
- **Strategic voting** emerges whenever truthful voting isn't strategy-proof

### Fair Division Chain
- **Envy-freeness** requires knowing everyone's valuation functions
- **Discrete vs continuous** division have different existence results for envy-freeness
- **Proportionality** is weaker than envy-freeness (easier to achieve)
- **Cut-and-choose** guarantees proportionality but only works for two players
- **Selfridge-Conway** extends envy-freeness to three players (but gets complex)
- **Pareto efficiency** often conflicts with envy-freeness, requiring trade-offs

### Strategic Behavior Bridge
- **Strategic voting** and **preference misreporting** are parallel concepts in voting and division
- **Mechanism design** applies to both domains, seeking strategy-proof rules
- **Voting power indices** formalize how much strategic leverage each voter has

### Real-World Applications
- **Electoral systems** implement voting rules with various fairness criteria
- **Allocation problems** arise in estate division, resource sharing, scheduling
- **Computational social choice** develops algorithms for large-scale voting and division

## Prerequisite Topics

- **Discrete mathematics** — needed for: combinatorics in preference profiles, proof techniques for impossibility theorems
- **Basic combinatorics** — needed for: counting preference orderings, analyzing voting outcomes
- **Proof techniques** — needed for: Arrow's theorem, Gibbard-Satterthwaite, existence results
- **Basic probability** — needed for: voting power indices, expected outcomes
- **Set theory** — needed for: allocation problems, Pareto efficiency

## Bottleneck Concepts

1. **Arrow's impossibility theorem** — requires understanding all prior fairness criteria and their interactions. This is the conceptual peak of the voting theory section.

2. **Envy-freeness vs Pareto efficiency** — understanding that these two intuitive fairness notions can conflict requires grasping both concepts deeply.

3. **Strategic manipulation** — requires understanding both the formal rules of a system AND the incentives to deviate from truthful behavior.

## Common Misconceptions

- **"Majority rule is always fair"** — the Condorcet paradox shows it can cycle
- **"There must be a perfect voting system"** — Arrow proves this is impossible
- **"Envy-free always exists"** — false for indivisible goods
- **"Cut-and-choose is envy-free"** — it's only proportional, not envy-free
- **"Strategic voting is rare"** — Gibbard-Satterthwaite shows it's inevitable
- **"Fair means equal shares"** — fairness accounts for different preferences, not just equal quantities

## Learning Pathways

### Path 1: Voting First
Start with voting systems → paradoxes → impossibilities → then pivot to fair division as a complementary problem. This follows the lesson sequence.

### Path 2: Division First
Start with fair division (concrete, algorithmic) → then voting (more abstract, impossibility-focused). Better for students who prefer constructive results before negative ones.

### Path 3: Applications Driven
Alternate between voting and division based on real-world examples, building theory as needed. Good for motivated learners who want immediate relevance.

The curriculum follows **Path 1** as it provides better scaffolding for the impossibility theorems.
