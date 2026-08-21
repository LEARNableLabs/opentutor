# Quantum Computing — Research Summary

## Major Subtopics

1. **Quantum Mechanics Foundations** — quantum states, superposition, measurement, complex amplitudes
2. **Quantum Gates & Circuits** — single-qubit gates (Pauli, Hadamard, phase), multi-qubit gates (CNOT, Toffoli), circuit model
3. **Quantum Algorithms** — Deutsch-Jozsa, Bernstein-Vazirani, Simon's algorithm, Grover's search, Shor's factoring
4. **Entanglement & Nonlocality** — Bell states, EPR paradox, quantum teleportation, no-cloning theorem
5. **Quantum Error Correction** — noise models, stabilizer codes, surface codes
6. **Physical Implementations** — superconducting qubits, trapped ions, photonic systems
7. **Quantum Information Theory** — quantum Shannon theory, capacity, compression

## Key Educational Resources Found

### University Courses

- **MIT 18.435J Quantum Computation** — comprehensive lecture notes covering algorithms, complexity, error correction
  - URL: https://ocw.mit.edu/courses/18-435j-quantum-computation-fall-2003/
  
- **Stanford CS269Q: Elements of Quantum Computer Programming** — hands-on course with Python, Qiskit integration, real quantum hardware access
  - URL: https://cs269q.stanford.edu/

- **MIT 6.845 Quantum Complexity Theory** — advanced topics in BQP, QMA, quantum interactive proofs
  - URL: https://ocw.mit.edu/courses/6-845-quantum-complexity-theory-fall-2010/

### Textbooks

- **Nielsen & Chuang: "Quantum Computation and Quantum Information" (Cambridge University Press)** — the canonical textbook, balances physics and computer science perspectives. Comprehensive coverage from foundations to advanced topics.
  
- **John Preskill's Lecture Notes** — physics-focused approach, excellent for quantum error correction and fault tolerance. Available freely online.

- **Kitaev, Shen, Vyalyi: "Classical and Quantum Computation"** — more mathematical, focuses on complexity theory aspects.

- **David Mermin's Lecture Notes** — elementary introduction with CS focus, good for accessibility.

### Interactive Tools & Simulators

- **Qiskit (IBM)** — open-source Python SDK, access to IBM quantum hardware, extensive tutorials
  - URL: https://quantumai.google/cirq
  
- **Cirq (Google)** — Google's quantum programming framework, integrates with Google's quantum processors
  
- **Quantum Circuit Simulator** — JavaScript-based web tool, exports to multiple languages (OpenQASM, Qiskit, Cirq, Q#)
  - URL: https://github.com/quantastica/quantum-circuit

- **Programming Quantum Computers** — interactive O'Reilly book with live circuit playground
  - URL: https://oreilly-qc.github.io/

- **Quantum Computing Playground** — browser-based simulator with visual interface

### Video Lectures & Online Courses

- MIT OpenCourseWare video lectures (18.435J)
- Stanford CS269Q recorded lectures available online
- Qiskit YouTube channel — tutorials and algorithm implementations
- IBM Quantum Learning platform — structured learning paths

### Key Researchers & Practitioners

- Peter Shor (MIT) — Shor's algorithm, quantum error correction
- John Preskill (Caltech) — quantum information theory, NISQ era concept
- Scott Aaronson (UT Austin) — quantum complexity theory, quantum supremacy
- Isaac Chuang (MIT) — experimental quantum computing, NMR systems
- Michelle Simmons (UNSW) — silicon quantum computing
- Umesh Vazirani (Berkeley) — quantum algorithms, complexity

### Cross-Discipline Connections

- Quantum chemistry and materials science (VQE algorithm)
- Cryptography (quantum key distribution, post-quantum crypto)
- Optimization (QAOA, quantum annealing)
- Machine learning (quantum neural networks, amplitude encoding)
- Linear algebra (every quantum operation is a matrix!)
- Probability & statistics (measurement outcomes, Born rule)

## Assessment for Intermediate Level

At intermediate level, students should:
- Have solid linear algebra (eigenvalues, unitary matrices, tensor products)
- Understand basic probability
- Know some programming (Python preferred)
- Have curiosity about physics (no quantum mechanics background assumed)

The curriculum should:
- Start with quantum states and measurement (build intuition)
- Emphasize circuit model and hands-on programming
- Cover major algorithms with full derivations
- Touch on error correction conceptually
- Balance theory with practical implementation in Qiskit/Cirq
- Avoid heavy physics formalism (Hamiltonians, time evolution) unless necessary
- Focus on "what can quantum computers do?" rather than "how do you build one?"
