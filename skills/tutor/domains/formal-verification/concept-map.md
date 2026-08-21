# Formal Verification — Concept Map

## Core Concepts (in learning order)

1. **Specifications** — formal description of what a system should do
2. **Invariants** — properties that must always hold during execution. Depends on: Specifications
3. **Safety properties** — "bad things never happen" (no crashes, no data loss). Depends on: Specifications
4. **Liveness properties** — "good things eventually happen" (termination, progress). Depends on: Specifications
5. **State space** — all possible configurations a system can reach. Depends on: Invariants
6. **Reachability** — which states can be reached from initial states. Depends on: State space
7. **Temporal logic** — language for expressing properties about time and execution order. Depends on: Safety properties, Liveness properties
8. **Linear Temporal Logic (LTL)** — temporal logic over single execution paths. Depends on: Temporal logic
9. **Model checking** — exhaustive state space exploration to verify temporal properties. Depends on: State space, Reachability, LTL
10. **Counterexamples** — execution traces that violate specifications. Depends on: Model checking
11. **Abstraction** — simplifying systems to make verification tractable. Depends on: State space, Model checking
12. **Proof assistants** — interactive tools for constructing formal proofs. Depends on: Specifications
13. **Curry-Howard correspondence** — proofs are programs, propositions are types. Depends on: Proof assistants
14. **Tactics** — proof strategies and automation in proof assistants. Depends on: Proof assistants
15. **Induction** — proving properties for all elements of a recursive structure. Depends on: Tactics
16. **Hoare logic** — axiomatic system for reasoning about imperative programs. Depends on: Specifications, Invariants
17. **Hoare triples** — {P} C {Q} — if P holds before C, then Q holds after. Depends on: Hoare logic
18. **Weakest precondition** — most general condition guaranteeing postcondition holds. Depends on: Hoare triples
19. **Loop invariants** — properties that hold before/after each loop iteration. Depends on: Invariants, Weakest precondition
20. **Verification conditions** — logical formulas that must be true for correctness. Depends on: Weakest precondition
21. **Separation logic** — extension of Hoare logic for reasoning about heap-allocated structures. Depends on: Hoare logic
22. **Frame rule** — local reasoning principle in separation logic. Depends on: Separation logic
23. **Automated verifiers** — tools that generate and discharge verification conditions. Depends on: Verification conditions, SMT solvers
24. **SMT solvers** — decision procedures for logical formulas with theories. Depends on: Verification conditions

## Dependencies

- **Temporal logic requires understanding both safety and liveness** because different temporal operators express different classes of properties (G for "always"/safety, F for "eventually"/liveness)
- **Model checking depends on reachability analysis** because the core algorithm explores which states are reachable and checks properties on those states
- **Weakest precondition builds on Hoare triples** because it's calculated by working backward through the program from the postcondition
- **Loop invariants are the hardest part of Hoare logic** because they require insight into what stays true across iterations; finding them is not mechanical
- **Separation logic extends Hoare logic with heap reasoning** because classic Hoare logic can't precisely handle aliasing and pointer manipulation
- **Automated verifiers need SMT solvers** because they generate complex logical formulas that must be checked for satisfiability

## Critical Bottlenecks

1. **Formalization gap** — translating informal requirements into formal specifications is an art, not a science. Students must practice writing specs for realistic systems.

2. **Loop invariants** — discovering the right invariant is the creative leap in verification. No algorithm can generate them automatically; requires deep understanding of the algorithm.

3. **State explosion** — naively exploring all states is exponential. Abstraction, symmetry reduction, and compositional reasoning are essential mitigation strategies.

4. **Tool proficiency** — learning the syntax and tactics of proof assistants (Coq, Isabelle) or model checkers (TLA+, SPIN) has a steep curve. Hands-on practice is required.

## Common Misconceptions

1. **"Verification means testing all inputs"** — No. Verification proves correctness for ALL possible inputs using logical reasoning, not enumeration.

2. **"Formal verification is only for hardware"** — While widely used in hardware (Intel, AMD), verification applies to software (CompCert, seL4), protocols (TLA+), and distributed systems.

3. **"Verified code can't have bugs"** — Verification proves the code matches the spec. If the spec is wrong or incomplete, bugs can still exist. Garbage in, garbage out.

4. **"Model checkers find all bugs"** — Model checkers only check properties you specify. Unspecified properties won't be verified. Also, abstraction can introduce false positives/negatives.

5. **"Proof assistants automate everything"** — Most theorem provers require significant human guidance. Tactics provide automation, but creative proof strategies still need human insight.

6. **"Temporal logic is just regular logic with time"** — Temporal logic has different semantics (path quantification, modal operators) and can't be reduced to first-order logic.

## Prerequisite Topics

- **Propositional and predicate logic** — needed for understanding specifications, logical formulas, and proof rules
- **Discrete mathematics** — induction, recursion, graph theory (for state spaces)
- **Programming fundamentals** — understanding program semantics, loops, functions
- **Basic algorithm analysis** — loop invariants, correctness arguments

## Advanced Connections (beyond this curriculum)

- **Abstract interpretation** — deriving program properties via lattice theory
- **Concolic testing** — combining concrete execution and symbolic reasoning
- **Proof-carrying code** — executable code bundled with correctness proofs
- **Certified programming** — extracting verified programs from proof assistant specifications
