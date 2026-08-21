# Combinatorics and Counting — Concept Map

## Core Concepts (in learning order)

1. **Multiplication principle** — count sequences of independent choices by multiplying options at each step
2. **Addition principle** — count disjoint cases by adding their sizes
3. **Bijections** — prove two sets have the same size by constructing a one-to-one correspondence
4. **Complement counting** — count what you don't want, then subtract from the total
5. **Problem isomorphism** — recognize when two problems are structurally identical. Depends on: 1, 2, 3
6. **Permutations** — ordered arrangements of distinct objects. Depends on: 1
7. **Permutations with repetition** — arrangements when some objects are identical. Depends on: 6
8. **Combinations** — unordered selections (binomial coefficients). Depends on: 6
9. **Pascal's triangle** — recursive structure of binomial coefficients. Depends on: 8
10. **Stars and bars** — technique for distributing indistinguishable objects into bins. Depends on: 8
11. **Pigeonhole principle** — if n+1 objects go into n holes, some hole has at least 2 objects
12. **Inclusion-exclusion** — count overlapping sets by alternating sums. Depends on: 2, 4
13. **Derangements** — permutations with no fixed points. Depends on: 6, 12
14. **Combinatorial proofs** — prove identities by counting the same set two ways. Depends on: 3, 8
15. **Generating functions** — encode sequences as power series coefficients. Depends on: 9
16. **Product of generating functions** — combine constraints by multiplying. Depends on: 15
17. **Recurrence relations** — define sequences recursively
18. **Solving recurrences** — find closed forms using generating functions. Depends on: 15, 16, 17
19. **Exponential generating functions** — for labeled objects (factorials in denominators). Depends on: 15
20. **Catalan numbers** — count recursive structures (parenthesizations, trees). Depends on: 17, 18
21. **Stirling numbers** — count set partitions and cycle decompositions. Depends on: 7, 14
22. **Graph enumeration** — count paths, trees, colorings. Depends on: 8, 14

## Dependencies

- **Combinations require permutations** because we derive C(n,k) by dividing n!/(n-k)! by k! (the overcounting from order)
- **Stars and bars builds on combinations** because we're choosing positions for dividers among objects
- **Inclusion-exclusion extends complement counting** by handling multiple overlapping sets instead of just one complement
- **Derangements apply inclusion-exclusion** to count permutations avoiding all fixed points
- **Combinatorial proofs rely on bijections** to show two counting methods yield the same answer
- **Generating functions unify recursion and closed forms** by encoding recurrences as algebraic equations
- **Product of generating functions depends on convolution** which requires understanding how coefficients combine
- **Catalan numbers need recurrence solving** because their most natural definition is recursive
- **Graph enumeration uses multiple techniques** including bijections, recursion, and generating functions

## Bottlenecks

- **Stars and bars** (lesson 11) is the first major difficulty spike — students struggle to visualize the bijection between distributions and binary strings
- **Inclusion-exclusion** (lesson 14) requires careful case analysis and alternating signs, which is error-prone
- **Generating functions** (lessons 19-23) introduce a completely different perspective; students who think only combinatorially may resist the algebraic approach
- **Exponential generating functions** (lesson 23) are conceptually subtle — why divide by factorials? The labeled vs unlabeled distinction is abstract

## Prerequisite Topics

- **Basic algebra** — needed for manipulating polynomials in generating functions (lessons 19-23)
- **Proof by induction** — needed for proving binomial identities and recurrence base cases (lessons 9, 10, 21)
- **Set theory** — needed for understanding bijections, disjoint unions, complements (lessons 3, 4, 12, 14)
- **Graph theory basics** — needed for lesson 27 (vertices, edges, trees, paths)

## Common Conceptual Bottlenecks

- **Multiplication vs addition principle** — students struggle to decide which applies; resolution: multiplication for "and" (sequence), addition for "or" (cases)
- **Permutation vs combination** — students forget to ask "does order matter?"; resolution: always explicitly identify whether the problem cares about order
- **Overcounting vs undercounting** — students apply formulas without checking if they're counting something extra or missing cases
- **Recursion vs closed form** — students may solve recurrences numerically without seeing the generating function machinery connects the two
