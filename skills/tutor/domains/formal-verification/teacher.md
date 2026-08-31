# Formal Verification — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 10 lessons (42%)
- **review and consolidation sessions** — 4 lessons (17%)
- **real-world application challenges** — 4 lessons (17%)
- **teach-back exercises (student explains)** — 3 lessons (13%)
- **Socratic questions** — 2 lessons (8%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 46% accessible (1-2), 29% standard (3), 25% challenging (4-5).

Difficulty peaks:
- Day 9: "What happens when the state space is infinite?" (difficulty 4)
- Day 11: "How do proof assistants know a proof is correct?" (difficulty 4)
- Day 13: "Can you verify a sorting algorithm is correct?" (difficulty 4)
- Day 16: "How do we calculate the weakest precondition?" (difficulty 4)
- Day 17: "Can you annotate this loop so Dafny verifies it?" (difficulty 4)

## Domain Hooks
- **The Halting Problem and undecidability** — When discussing model checking automation, drop in a note about why full program verification is undecidable. Connects to computability theory. (After lesson 9)

- **The Curry-Howard correspondence is everywhere** — Types are propositions, programs are proofs. This unifies functional programming, type systems, and logic. Mention connections to Rust's type system, Haskell, dependent types. (During lesson 11)

- **Quantum computing verification** — How do you verify a quantum algorithm? New logics, new challenges. Point to recent research. (After lesson 23)

- **Game semantics for verification** — Model checking as a two-player game (system vs environment). Elegant theory, useful for reactive systems. (During lesson 9)

- **Proof-carrying code** — Imagine executables that ship with a proof of safety. Downloaded code can be trusted instantly. Used in some embedded systems. (After lesson 14)

- **The Social Process of Formalization** — Who dec

## Common Failure Modes
1. **"Verification is the same as testing"** — Students conflate exhaustive testing with formal proof. Clarify that verification reasons about all possible executions using logic, not by enumerating cases. Example: proving a sorting algorithm works for arrays of any size, not testing on sample inputs.

2. **"Formal methods are too slow for real projects"** — While full verification is expensive, targeted verification of critical components (protocol logic, crypto primitives, concurrency) is tractable and widely used in industry. TLA+ specs at AWS take days to weeks, not years.

3. **"The model checker will find the bug"** — Model checkers only verify properties you specify. Students think the tool is magic; emphasize that writing good specs is harder than writing code. Garbage spec → garbage verification.

4. **"Proofs are like debugging — trial and error"** — While proof development involves iteration, good proofs have structure and intent. Teach students to think about proof strategy

## Vocabulary
Key terms for this domain: testing vs verification, state explosion, correctness guarantees, specifications, invariants, pre/postconditions, safety properties, liveness properties, temporal properties, state space, reachability, exhaustive search, linear temporal logic, LTL operators, path quantification (and 56 more).