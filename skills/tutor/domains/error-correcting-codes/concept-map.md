# Error-Correcting Codes — Concept Map

## Core Concepts (in learning order)

1. **Redundancy** — adding extra bits to detect/correct errors
2. **Binary Symmetric Channel** — probabilistic error model for communication
3. **Channel Capacity (Shannon)** — theoretical limit on reliable communication rate
4. **Hamming Distance** — number of bit positions where two codewords differ
5. **Minimum Distance** — smallest distance between any two codewords in a code
6. **Error Detection vs. Correction** — d_min determines capability: detect d-1, correct ⌊(d-1)/2⌋ errors
7. **Parity Check** — simplest error detection using XOR
8. **Hamming Bound** — upper limit on code size given length and distance. Depends on: Hamming distance
9. **Singleton Bound** — another fundamental limit on code parameters. Depends on: minimum distance
10. **Perfect Codes** — codes that achieve Hamming bound with equality. Depends on: Hamming bound
11. **Hamming(7,4) Code** — first practical error-correcting code. Depends on: parity check, minimum distance
12. **Syndrome** — error pattern identifier computed from received word. Depends on: linear algebra, parity check
13. **Linear Code** — codewords form a vector space over finite field. Depends on: vector spaces, XOR operations
14. **Generator Matrix** — encodes data by matrix multiplication. Depends on: linear code, matrix operations
15. **Parity-Check Matrix** — defines code via orthogonality constraint. Depends on: linear code, dual space
16. **Syndrome Decoding** — error correction via syndrome lookup. Depends on: syndrome, parity-check matrix
17. **Golay Codes** — rare perfect codes with exceptional properties. Depends on: perfect codes, linear codes
18. **Polynomial Representation** — treating bit strings as polynomials over GF(2). Depends on: finite fields, modular arithmetic
19. **Cyclic Codes** — linear codes closed under cyclic shift. Depends on: polynomial representation, linear codes
20. **Generator Polynomial** — polynomial that generates all codewords. Depends on: cyclic codes, polynomial division
21. **CRC (Cyclic Redundancy Check)** — polynomial-based error detection. Depends on: generator polynomial, polynomial division
22. **BCH Codes** — generalization of Hamming codes using finite field algebra. Depends on: cyclic codes, minimal polynomials
23. **Finite Field Arithmetic (GF(q))** — arithmetic in fields with prime-power elements. Depends on: modular arithmetic, polynomials
24. **Reed-Solomon Codes** — powerful cyclic codes optimal for burst errors. Depends on: finite field arithmetic, cyclic codes
25. **Convolutional Codes** — codes with memory, using shift registers. Depends on: state machines, sliding window
26. **Trellis Representation** — state diagram for convolutional codes. Depends on: convolutional codes, state transitions
27. **Viterbi Algorithm** — optimal maximum likelihood decoding on trellis. Depends on: trellis, dynamic programming
28. **Turbo Codes** — iterative decoding of concatenated convolutional codes. Depends on: convolutional codes, probabilistic decoding
29. **LDPC Codes** — sparse parity-check matrix codes. Depends on: parity-check matrix, graph theory
30. **Belief Propagation** — iterative message-passing decoder for LDPC. Depends on: LDPC codes, Bayesian inference, graphical models

## Dependencies

### Critical Dependency Chains

**Foundation → Hamming → Linear → Cyclic → Modern**
- Hamming distance and bounds are prerequisite for understanding ALL codes
- Linear code structure (matrices) enables efficient encoding/decoding
- Cyclic codes build on linear codes by adding polynomial structure
- LDPC codes return to parity-check matrices but use sparsity and iteration

**Algebra Progression**
- Binary XOR → modular arithmetic → finite fields GF(2) → general finite fields GF(q)
- This progression gates access to: Hamming → BCH → Reed-Solomon

**Decoding Progression**
- Syndrome decoding (algebraic) → Viterbi (dynamic programming) → Belief propagation (probabilistic/iterative)

### Key Bottlenecks

1. **Minimum Distance** — blocks understanding of error correction capability until mastered
2. **Linear Algebra over GF(2)** — students weak on this struggle with all modern codes
3. **Polynomial Division** — gates understanding of cyclic codes and CRC
4. **Finite Field Arithmetic** — essential for Reed-Solomon, often the hardest conceptual jump
5. **Trellis Representation** — understanding state-based decoding is key to Viterbi

## Prerequisite Topics

- **Linear Algebra** — needed for: generator matrix, parity-check matrix, syndrome decoding, LDPC
- **Modular Arithmetic** — needed for: finite fields, polynomial arithmetic, BCH codes
- **Basic Probability** — needed for: channel models, Shannon capacity, belief propagation
- **Graph Theory** (light) — helpful for: LDPC representation, Tanner graphs
- **Dynamic Programming** — needed for: Viterbi algorithm

## Common Misconception Anchors

- **Confusion between detecting and correcting** — often think detection capability equals correction capability
- **Syndrome = error** — syndrome locates errors but isn't the error pattern itself
- **All codes are cyclic** — many students think linearity implies cyclic property
- **Reed-Solomon is just binary** — miss that it operates over GF(256) or larger fields
- **LDPC is new** — don't realize it predates turbo codes by decades but was computationally impractical

## Conceptual Milestones

Students typically experience "aha moments" at:
1. **Hamming distance → correction capability** — the geometric intuition clicks
2. **Syndrome decoding** — elegance of error localization without checking all possibilities
3. **Polynomial representation** — seeing bit strings as algebra unlocks cyclic codes
4. **Reed-Solomon on scratched CDs** — abstract algebra has practical impact
5. **Shannon limit vs. reality** — LDPC codes nearly achieve the theoretical bound
