# Surreal Numbers — Concept Map

## Core Concepts (in learning order)

1. **Recursive definition** — surreal numbers are built from left and right sets
2. **Left and right sets** — the fundamental building blocks {L|R}
3. **Well-formedness** — the condition that no left element is ≥ any right element
4. **Base cases** — starting point: 0 = {|}, 1 = {0|}, -1 = {|0}
5. **Generation/birthday** — the day a number is born in the construction. Depends on: left and right sets
6. **Integers** — representation of all integers as surreal numbers. Depends on: base cases, recursive definition
7. **Dyadic rationals** — fractions with power-of-2 denominators. Depends on: integers, recursive definition
8. **Canonical forms** — the simplest representation of a surreal number. Depends on: well-formedness, generation
9. **Ordering relation** — how to compare surreal numbers. Depends on: left and right sets, well-formedness
10. **Trichotomy** — every pair of surreals satisfies exactly one of <, =, >. Depends on: ordering relation
11. **Addition** — recursive definition of x + y. Depends on: ordering relation, recursive definition
12. **Negation** — flipping left and right sets. Depends on: left and right sets, addition
13. **Subtraction** — addition of negation. Depends on: addition, negation
14. **Commutativity** — addition is order-independent. Depends on: addition
15. **Associativity** — grouping doesn't matter. Depends on: addition
16. **Multiplication** — recursive definition of x × y. Depends on: addition, ordering relation
17. **Multiplicative inverses** — reciprocals of surreal numbers. Depends on: multiplication
18. **Division** — multiplication by reciprocals. Depends on: multiplication, multiplicative inverses
19. **Field properties** — surreals form an ordered field. Depends on: addition, multiplication, inverses
20. **Combinatorial games** — connection between games and surreal numbers
21. **Game positions** — representation of game states. Depends on: combinatorial games
22. **Game values** — surreal number value of a game position. Depends on: game positions, recursive definition
23. **Hackenbush** — specific game illustrating surreal values. Depends on: game values
24. **Infinitesimal games** — games with values smaller than any positive real. Depends on: game values
25. **Star (*)** — the simplest infinitesimal game. Depends on: infinitesimal games
26. **Omega (ω)** — the first infinite ordinal as a surreal. Depends on: recursive definition, ordering
27. **Transfinite numbers** — infinite surreal numbers. Depends on: omega
28. **Infinitesimals** — numbers smaller than any positive real, larger than zero. Depends on: ordering relation
29. **Epsilon (ε)** — specific infinitesimal 1/ω. Depends on: omega, division
30. **Transfinite arithmetic** — addition and multiplication with infinite numbers. Depends on: transfinite numbers, addition, multiplication
31. **Embeddings** — how other number systems sit inside the surreals. Depends on: field properties
32. **Universality** — surreals contain all ordered fields. Depends on: embeddings, field properties

## Dependencies

### Foundational Layer
- **Well-formedness** requires understanding **left and right sets** because it's a condition on those sets
- **Base cases** provide the starting point for the **recursive definition**
- **Generation** depends on the **recursive definition** because birthday is determined by when prerequisites are born

### Construction Layer
- **Integers** require **base cases** and **recursive definition** to build systematically
- **Dyadic rationals** build on **integers** by filling in fractions between them
- **Canonical forms** require understanding **generation** to identify the simplest representation

### Ordering Layer
- **Ordering relation** uses **left and right sets** directly in its definition
- **Trichotomy** is proved using the **ordering relation** and well-formedness

### Arithmetic Layer
- **Addition** depends on **ordering relation** because its recursive definition refers to sums with elements from left/right sets
- **Negation** is defined purely on **left and right sets** (swap them)
- **Multiplication** requires both **addition** and **ordering** in its recursive definition
- **Division** requires **multiplicative inverses**, which require **multiplication**
- **Field properties** synthesize **addition**, **multiplication**, and **inverses**

### Game Theory Layer
- **Game positions** are defined using the same **recursive definition** as surreal numbers
- **Game values** assign surreal numbers to **game positions**
- **Hackenbush** illustrates **game values** concretely
- **Infinitesimal games** require understanding **infinitesimals** from the extension layer

### Extension Layer
- **Omega** uses the **recursive definition** with infinite left sets
- **Transfinite numbers** generalize **omega** to larger infinities
- **Infinitesimals** are constructed using **omega** and **division** (e.g., ε = 1/ω)
- **Transfinite arithmetic** extends **addition** and **multiplication** to infinite numbers
- **Universality** follows from the **field properties** and **embeddings**

## Critical Bottlenecks

These concepts are essential gates that many later concepts depend on:

1. **Recursive definition** — everything else flows from this
2. **Ordering relation** — needed for arithmetic and comparison
3. **Addition** — foundation for all other operations
4. **Multiplication** — enables division and full field structure
5. **Game values** — bridge between games and numbers
6. **Omega** — gateway to infinities and infinitesimals

## Prerequisite Topics

- **Set theory basics** — needed for: left and right sets, recursive definitions
- **Proof by induction** — needed for: verifying properties of the construction, proving arithmetic laws
- **Real number properties** — needed for: understanding what surreals extend, field axioms
- **Basic abstract algebra** — needed for: field properties, group structure, embeddings
- **Ordinal numbers** (helpful but not essential) — needed for: understanding omega and transfinite construction

## Common Misconception Clusters

1. **Construction confusion** — students often confuse the sets {L|R} with the number itself
2. **Ordering pitfalls** — the ordering relation is recursive and can be subtle with complex numbers
3. **Arithmetic complexity** — multiplication is surprisingly intricate compared to addition
4. **Game/number conflation** — games and surreal numbers are closely related but not identical
5. **Infinity assumptions** — transfinite surreals don't behave like cardinal or ordinal arithmetic in all ways
