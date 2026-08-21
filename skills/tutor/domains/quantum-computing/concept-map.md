# Quantum Computing — Concept Map

## Core Concepts (in learning order)

1. **Qubit** — quantum bit that can exist in superposition of |0⟩ and |1⟩
2. **Superposition** — ability of quantum states to exist in linear combinations
3. **Complex amplitudes** — complex numbers that encode probability and phase
4. **Measurement** — observation that collapses superposition to classical outcome
5. **Born rule** — probability of measurement outcome is amplitude squared. Depends on: complex amplitudes
6. **Bloch sphere** — geometric representation of single-qubit states. Depends on: qubit, superposition
7. **Tensor product** — mathematical operation for combining quantum systems. Depends on: qubit
8. **Multi-qubit states** — states of multiple qubits, dimension grows exponentially. Depends on: tensor product
9. **Unitary matrices** — reversible transformations of quantum states
10. **Quantum gates** — unitary operations that transform qubits. Depends on: unitary matrices
11. **Pauli gates (X, Y, Z)** — basic single-qubit rotations and flips. Depends on: quantum gates
12. **Hadamard gate** — creates equal superposition from basis states. Depends on: quantum gates, superposition
13. **Quantum circuit** — sequence of gates applied to qubits. Depends on: quantum gates
14. **No-cloning theorem** — fundamental limitation preventing qubit copying. Depends on: quantum gates, linearity
15. **CNOT gate** — two-qubit controlled-NOT, enables entanglement. Depends on: quantum gates, multi-qubit states
16. **Controlled gates** — gates that act conditionally on control qubits. Depends on: CNOT gate
17. **Quantum parallelism** — ability to evaluate function on all inputs simultaneously. Depends on: superposition, quantum circuit
18. **Interference** — constructive/destructive amplitude combination. Depends on: superposition, complex amplitudes
19. **Oracle** — black-box quantum function used in algorithms. Depends on: quantum circuit
20. **Deutsch-Jozsa algorithm** — determines if function is constant or balanced in one query. Depends on: quantum parallelism, interference, oracle
21. **Amplitude amplification** — technique to boost probability of desired outcomes. Depends on: interference
22. **Grover's algorithm** — quadratic speedup for unstructured search. Depends on: amplitude amplification, oracle
23. **Quantum Fourier Transform** — quantum version of discrete Fourier transform. Depends on: quantum circuit, interference
24. **Period finding** — finds period of periodic function. Depends on: quantum Fourier transform
25. **Shor's algorithm** — exponential speedup for integer factorization. Depends on: period finding, QFT
26. **Entanglement** — quantum correlation stronger than classical. Depends on: multi-qubit states, CNOT gate
27. **Bell states** — maximally entangled two-qubit states. Depends on: entanglement
28. **Non-separability** — property of entangled states that can't be written as tensor products. Depends on: entanglement, tensor product
29. **Quantum teleportation** — protocol to transfer quantum state using entanglement. Depends on: Bell states, measurement
30. **Decoherence** — loss of quantum properties due to environment interaction
31. **Quantum errors** — bit flips, phase flips, and combinations. Depends on: Pauli gates, decoherence
32. **Stabilizer codes** — class of quantum error-correcting codes. Depends on: quantum errors, Pauli gates
33. **Syndrome measurement** — error detection without measuring logical qubit. Depends on: stabilizer codes, measurement
34. **Logical qubit** — encoded qubit protected by error correction. Depends on: stabilizer codes
35. **BQP complexity class** — problems solvable efficiently by quantum computers. Depends on: quantum algorithms
36. **NISQ era** — current noisy intermediate-scale quantum computing phase. Depends on: quantum errors, quantum algorithms

## Dependencies

### Foundation Layer
- **Complex amplitudes** enable the **Born rule** because probabilities are computed from amplitude magnitudes
- **Tensor products** enable **multi-qubit states** because quantum composition is multiplicative, not additive
- **Superposition** is the foundation for **quantum parallelism** because all computational paths exist simultaneously

### Gate Layer
- **Unitary matrices** constrain **quantum gates** because quantum evolution must be reversible (preserve probability)
- **Hadamard gate** creates **superposition** systematically, transforming |0⟩ → (|0⟩+|1⟩)/√2
- **CNOT gate** creates **entanglement** by correlating qubits in a way that can't be undone by single-qubit operations
- **No-cloning theorem** follows from linearity of quantum operations because copying would require non-linear maps

### Algorithm Layer
- **Deutsch-Jozsa** demonstrates **quantum parallelism** and **interference** by evaluating all inputs in superposition then interfering to extract global property
- **Grover's algorithm** uses **amplitude amplification** repeatedly to rotate state vector toward solution
- **Shor's algorithm** relies on **quantum Fourier transform** for efficient **period finding**, which reduces factoring to finding the period of a modular exponential function
- All algorithms require **measurement** as the final step to extract classical information from quantum state

### Entanglement Layer
- **Bell states** are canonical examples of **entanglement** created by Hadamard + CNOT
- **Quantum teleportation** uses **entanglement** (pre-shared EPR pair) + classical communication to transfer quantum state
- **Non-separability** is the mathematical signature of entanglement — states that can't be factored

### Error Correction Layer
- **Quantum errors** arise from **decoherence** — environment entanglement destroying coherence
- **Stabilizer codes** protect against **quantum errors** by encoding logical qubits redundantly
- **Syndrome measurement** detects errors without collapsing the logical state (measures error, not data)
- **Logical qubits** enable fault-tolerant computation by maintaining coherence despite physical qubit errors

## Bottleneck Concepts

These concepts are essential gateways — understanding them unlocks multiple downstream topics:

1. **Superposition** — gates the entire field. Without this, quantum computing is just classical reversible circuits.
2. **Measurement** — the bridge between quantum and classical. Understanding collapse is crucial for algorithm design.
3. **Tensor product** — required for all multi-qubit reasoning. Can't understand entanglement without it.
4. **CNOT gate** — the simplest universal two-qubit gate. Unlocks entanglement, universal computation, and algorithm design.
5. **Interference** — the mechanism behind all quantum speedups. Algorithms work by interfering amplitudes constructively.
6. **Entanglement** — enables protocols (teleportation, cryptography) and is central to quantum advantage arguments.

## Mind-Blowing Moments

1. **Measurement collapse** — the act of looking fundamentally changes the system (Lesson 3)
2. **Exponential state space** — n qubits require 2^n complex numbers to describe, not 2n (Lesson 5)
3. **No-cloning theorem** — nature forbids copying quantum information, unlike classical bits (Lesson 12)
4. **Grover's optimality** — quadratic speedup is provably the best possible for unstructured search (Lesson 18)
5. **Shor's threat to cryptography** — factoring goes from exponential to polynomial time (Lesson 20)
6. **Quantum teleportation** — you can send quantum states using only classical communication + pre-shared entanglement (Lesson 22)
7. **Error correction paradox** — you can fix errors without measuring the qubit (Lesson 24)

## Common Misconceptions

1. **"Qubits are just bits that are 0 and 1 at the same time"** — No! Qubits have complex amplitudes and phase matters. Not just probabilistic classical bits.

2. **"Measurement gives random outcomes"** — The randomness is fundamental and governed by Born rule probabilities, not classical ignorance.

3. **"Quantum computers try all solutions in parallel"** — Misleading! They evaluate in parallel but you can't just "read out" all answers. You must use interference to amplify the right answer.

4. **"More qubits = faster"** — Not automatically! Algorithm design and interference structure matter more than raw qubit count.

5. **"Entanglement allows faster-than-light communication"** — No! You need classical communication to complete protocols like teleportation. No information can travel faster than light.

6. **"Quantum computers will break all encryption"** — Only certain schemes (RSA, ECC). Quantum-resistant algorithms exist.

7. **"Superposition collapses when we 'look' at it"** — It's measurement interaction that causes collapse, not human consciousness.

8. **"Quantum gates are like classical logic gates"** — Quantum gates are unitary (reversible), operate on continuous amplitudes, and enable superposition — fundamentally different.

## Prerequisite Topics

- **Linear algebra** — needed for: quantum states (vectors), quantum gates (unitary matrices), tensor products, eigenvalues (measurement)
- **Complex numbers** — needed for: complex amplitudes, phase, interference, Bloch sphere representation
- **Basic probability** — needed for: Born rule, measurement outcomes, algorithm analysis
- **Programming (Python)** — needed for: Qiskit/Cirq implementations, circuit simulation, hands-on experimentation
- **Mathematical maturity** — needed for: abstract thinking, proof-based reasoning, complex formalism

## Unexpected Connections

- **Linear algebra becomes physics** — eigenvectors are measurement outcomes, eigenvalues are observable values
- **Fourier analysis** — quantum Fourier transform is exponentially faster than classical FFT and enables Shor's algorithm
- **Group theory** — Pauli group, Clifford group structure underlies stabilizer codes
- **Information theory** — quantum Shannon theory, quantum channel capacity, quantum compression
- **Cryptography** — quantum key distribution (BB84), post-quantum cryptography race
- **Optimization** — QAOA (Quantum Approximate Optimization Algorithm) for combinatorial problems
- **Chemistry** — variational quantum eigensolver (VQE) for molecular simulation
- **Machine learning** — quantum neural networks, amplitude encoding, quantum kernels
