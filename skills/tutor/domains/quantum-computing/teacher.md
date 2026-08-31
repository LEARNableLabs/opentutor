# Quantum Computing — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 12 lessons (40%)
- **Socratic questions** — 6 lessons (20%)
- **real-world application challenges** — 5 lessons (17%)
- **review and consolidation sessions** — 4 lessons (13%)
- **teach-back exercises (student explains)** — 2 lessons (7%)
- **curated resource exploration** — 1 lessons (3%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 33% accessible (1-2), 43% standard (3), 23% challenging (4-5).

Difficulty peaks:
- Day 12: "Why can't we just copy a qubit?" (difficulty 4)
- Day 18: "How does Grover's algorithm search unsorted databases?" (difficulty 4)
- Day 19: "Why does Grover's give exactly quadratic speedup, not more?" (difficulty 4)
- Day 21: "How did Shor's algorithm break RSA encryption?" (difficulty 5)
- Day 23: "Can you really teleport quantum information?" (difficulty 4)

## Domain Hooks
These are fascinating tangents that can deepen understanding or inspire exploration. Drop them in when students show curiosity or breeze through material.

1. **The Many-Worlds Interpretation** — one way to think about superposition is that all branches exist in parallel universes. Measurement doesn't collapse the wave function, it entangles you with the system, creating different "yous" in different branches. Avoid philosophical debates, but acknowledge this interpretation exists.
   - **When to drop this in:** Lesson 3 (measurement), Lesson 6 (teach-back on superposition)

2. **Quantum Supremacy / Quantum Advantage** — Google's 2019 claim that their Sycamore processor solved a problem in 200 seconds that would take classical supercomputers 10,000 years. Controversial whether the task was meaningful. Now we say "quantum advantage" for practical problems.
   - **When to drop this in:** Lesson 27 (NISQ era), Lesson 28 (where will advantage appear)

3. **The BB84 Quantum Cryptography Pro

## Common Failure Modes
1. **"Superposition means the qubit is both 0 and 1 simultaneously"**
   - **Why students get this wrong:** Popular science uses the phrase "both at once" which suggests classical mixture.
   - **How to correct:** Emphasize that superposition is a *vector* with complex amplitudes. It's not two states at once, it's a single state in a 2D complex space. Phase matters! Show that |+⟩ and |−⟩ are different despite both being "half 0, half 1" probabilistically.

2. **"Quantum computers just try every solution in parallel and pick the right one"**
   - **Why students get this wrong:** Misleading analogy about quantum parallelism.
   - **How to correct:** Explain that while the computation *evaluates* on all inputs, **measurement gives only one outcome**. The art of quantum algorithms is using interference to make the right answer likely. If you measure mid-algorithm, you destroy the superposition and get random garbage.

3. **"More qubits automatically means exponentially more power"**
   - *

## Vocabulary
Key terms for this domain: qubits, superposition, amplitude, complex amplitudes, probability, Born rule, measurement, collapse, computational basis, Bloch sphere, geometric representation, pure states, tensor products, multi-qubit states, basis states (and 72 more).