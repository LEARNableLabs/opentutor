# Computational Complexity — Concept Map

## Core Concepts (in learning order)

1. **Turing machines** — Formal model of computation; establishes what "algorithm" means
2. **Time complexity** — Measuring runtime as a function of input size
3. **Space complexity** — Measuring memory usage as a function of input size
4. **Polynomial vs exponential growth** — Why polynomial time defines "efficient"
5. **Decision problems** — Yes/no questions as the canonical problem format
6. **Complexity classes** — Sets of problems with similar resource bounds
7. **Class P** — Problems solvable in polynomial time. Depends on: 1, 2, 4, 5
8. **Verification vs computation** — Checking a solution can be easier than finding one
9. **Certificates** — Witnesses that prove a yes-instance. Depends on: 8
10. **Class NP** — Problems with polynomial-time verifiable solutions. Depends on: 7, 9
11. **P vs NP problem** — The million-dollar question. Depends on: 7, 10
12. **Polynomial-time reductions** — Transforming one problem to another efficiently. Depends on: 7
13. **NP-completeness** — Hardest problems in NP. Depends on: 10, 12
14. **Cook-Levin theorem** — SAT is NP-complete. Depends on: 13
15. **Reduction techniques** — Building gadgets to encode one problem as another. Depends on: 12, 14
16. **NP-complete problems** — SAT, 3SAT, CLIQUE, Vertex Cover, Hamiltonian Path, etc. Depends on: 15
17. **Class coNP** — Complements of NP problems. Depends on: 10
18. **Class PSPACE** — Problems solvable in polynomial space. Depends on: 3, 7
19. **Alternating quantifiers** — ∀∃ patterns in problem definitions. Depends on: 18
20. **PSPACE-completeness** — TQBF and game evaluation. Depends on: 18, 19
21. **Polynomial hierarchy** — Σp, Πp levels organizing complexity. Depends on: 10, 17
22. **Time hierarchy theorem** — Provable separations with more time. Depends on: 2
23. **Space hierarchy theorem** — Provable separations with more space. Depends on: 3
24. **Approximation algorithms** — Getting close to optimal efficiently. Depends on: 7, 13
25. **Randomized complexity** — BPP, RP, ZPP classes. Depends on: 7
26. **Parameterized complexity** — Fixed-parameter tractability. Depends on: 13
27. **Quantum complexity** — BQP and quantum speedups. Depends on: 7, 10

## Dependencies

### Foundational Chain
- **Time and space complexity** are prerequisites for defining any complexity class
- **Polynomial time** establishes the efficiency threshold that motivates P
- **Decision problems** standardize the format for complexity theory

### P and NP
- **Class P** requires understanding of Turing machines, time complexity, and polynomial time
- **Class NP** builds on P by introducing the verification paradigm
- **P vs NP** only makes sense after understanding both classes independently
- **Certificates** formalize the intuition behind NP's verification model

### NP-Completeness
- **Reductions** are the central proof technique and require understanding P
- **NP-completeness** combines reductions with NP to identify hardest problems
- **Cook-Levin theorem** establishes the first NP-complete problem (bootstraps the theory)
- **Reduction chains** (3SAT → CLIQUE → Vertex Cover → ...) build a zoo of NP-complete problems

### Hierarchy Beyond NP
- **coNP** mirrors NP structure, requires understanding NP first
- **PSPACE** generalizes from time (P) to space resources
- **Polynomial hierarchy** interleaves NP and coNP structures
- **Alternating quantifiers** formalize the game-theoretic nature of PSPACE

### Alternative Models
- **Approximation** makes sense only after seeing NP-hardness as an obstacle
- **Randomized complexity** modifies deterministic models (P, NP)
- **Parameterized complexity** refines hardness by isolating problem structure
- **Quantum complexity** introduces a fundamentally different computational model

## Bottlenecks

### Critical Concepts (can't skip)
1. **Polynomial-time reductions** — Without this, NP-completeness theory is inaccessible
2. **NP definition** — Must distinguish verification from computation; common confusion point
3. **Cook-Levin theorem** — Bootstraps all NP-completeness proofs
4. **Reduction direction** — Students often get "reduces to" backwards

### Common Misconception Points
- Confusing "NP" with "exponential time" (it's about verification, not time)
- Thinking NP-complete means "hardest problems ever" (they're hardest in NP, but PSPACE is harder)
- Believing P ≠ NP is proven (it's conjectured but open)
- Misunderstanding reduction direction (A reduces to B means B is at least as hard as A)
- Confusing polynomial-time reductions with other reduction types (e.g., Turing reductions)

## Prerequisite Topics

- **Discrete mathematics** — needed for formal logic, sets, functions, relations
- **Data structures and algorithms** — needed to understand what "efficient" means, graph algorithms for examples
- **Mathematical proofs** — needed for reduction proofs, contradiction, induction
- **Basic graph theory** — needed for graph problems (CLIQUE, Vertex Cover, Hamiltonian Path)
- **Propositional logic** — needed for SAT, 3SAT, CNF formulas
- **Asymptotic notation** — needed for big-O, polynomial vs exponential growth

## Learning Sequence Rationale

The curriculum follows this arc:

1. **Foundations (lessons 1-5)** — Establish formal models and measurement before introducing classes
2. **P and NP (lessons 6-11)** — Build intuition for both classes separately before comparing
3. **NP-Completeness (lessons 12-18)** — Master reductions through many examples
4. **Review (lesson 19)** — Consolidate before climbing the hierarchy
5. **Beyond NP (lessons 20-24)** — Explore the broader landscape (coNP, PSPACE, hierarchy)
6. **Alternative Approaches (lessons 25-28)** — Survey practical techniques and other models
7. **Final Review (lesson 29)** — See the big picture of the complexity landscape

This sequence prioritizes:
- **Concrete before abstract** — Examples before formal definitions
- **Mastery of core** — NP-completeness gets 7 lessons because reductions require practice
- **Gradual difficulty** — Peak difficulty at Cook-Levin (lesson 13) and PSPACE (lessons 21-23)
- **Practical grounding** — Regular "why does this matter?" reality checks
