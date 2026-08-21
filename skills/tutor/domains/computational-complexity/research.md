# Computational Complexity — Research Summary

## Major Subtopics

1. **Foundations**
   - Turing machines and computational models
   - Time and space complexity
   - Asymptotic notation and complexity classes
   - Decision problems and languages

2. **P and NP**
   - Class P (polynomial time)
   - Class NP (nondeterministic polynomial time)
   - Verifiers and certificates
   - The P vs NP question

3. **NP-Completeness**
   - Cook-Levin theorem (SAT is NP-complete)
   - Reduction techniques
   - Classic NP-complete problems (3SAT, Clique, Vertex Cover, Hamiltonian Path, etc.)
   - Practical implications

4. **Beyond NP**
   - Complexity hierarchy: coNP, PSPACE, EXP, NEXP
   - PSPACE-completeness (TQBF, game evaluation)
   - Exponential time classes
   - The polynomial hierarchy

5. **Alternative Approaches**
   - Approximation algorithms
   - Randomized complexity (BPP, RP, ZPP)
   - Fixed-parameter tractability
   - Quantum complexity (BQP)

6. **Lower Bounds and Barriers**
   - Circuit complexity
   - Time hierarchy theorem
   - Oracle results and barriers (relativization, natural proofs, algebrization)
   - Current state of separations

## Key Sources

### Textbooks
- **Sipser, "Introduction to the Theory of Computation" (3rd ed.)** — Accessible introduction, excellent for intermediate learners
- **Arora & Barak, "Computational Complexity: A Modern Approach"** — Comprehensive graduate text, freely available online
- **Papadimitriou, "Computational Complexity"** — Classic reference

### University Courses
- **MIT 18.404** (Automata, Computability, and Complexity) — Michael Sipser
- **Stanford CS254** (Computational Complexity) — Various instructors
- **Princeton COS 487** (Theory of Computation)
- **UC Berkeley CS 172** (Computability and Complexity)

### Online Resources
- **Complexity Zoo** (https://complexityzoo.net/Complexity_Zoo) — Comprehensive reference for complexity classes
- **Scott Aaronson's blog** (https://scottaaronson.blog) — Accessible explanations of deep concepts
- **Luca Trevisan's blog** (https://lucatrevisan.github.io) — In Theory blog with excellent complexity theory posts
- **Arora-Barak textbook** (https://theory.cs.princeton.edu/complexity/) — Free PDF

### Video Resources
- **MIT OCW 18.404** (https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)
- **Easy Theory YouTube channel** — Animated explanations of complexity concepts
- **Numberphile P vs NP videos** — Accessible introductions
- **Stanford CS154** lectures available online

### Interactive Tools
- **Complexity Explorer** — Santa Fe Institute's interactive course platform
- **NP-Complete visual proofs** — Various visualization tools for reductions
- **Turing machine simulators** — Multiple web-based implementations

## Available Resources by Category

### Core Foundations
- Sipser chapters 1-7 (automata through time complexity)
- MIT OCW 18.404 lectures 1-12
- Formal language simulators (JFLAP, Automaton Simulator)

### P vs NP
- Arora-Barak chapters 1-2
- Clay Mathematics Institute P vs NP description
- Scott Aaronson's "Who Can Name the Bigger Number?" essay
- Various popular science articles and videos

### NP-Completeness
- Sipser chapter 7
- Garey & Johnson's classic list of NP-complete problems
- Reduction visualization tools
- Practice problem sets from MIT, Stanford, CMU

### Advanced Topics
- Arora-Barak chapters on PSPACE, randomization, circuits
- Surveys on approximation algorithms
- Papers on quantum complexity (Aaronson)
- Current research on barriers (Fortnow-Homer survey on relativization)

## Teaching Approach

For intermediate students, the focus should be on:
1. Building solid intuition through examples before formalism
2. Emphasizing reductions as the key proof technique
3. Connecting theory to practical problems (cryptography, optimization, AI)
4. Introducing modern topics (approximation, randomization) after classical material
5. Using visualization and interactive tools to make abstract concepts concrete
