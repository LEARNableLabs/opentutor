# Formal Verification — Teaching Notes

## Approach

Formal verification sits at the intersection of mathematics, logic, and software engineering. At the intermediate level, we balance rigor with pragmatism — students should understand the mathematical foundations without drowning in formalism, and they should get hands-on experience with real tools (TLA+, Dafny, Coq) to build intuition. The curriculum follows a three-act structure: (1) automated verification via model checking (concrete, visual, instant feedback), (2) interactive theorem proving (deeper, more creative, proof-centric), (3) program verification (synthesis of both, applied to real code). Start with success stories (AWS, CompCert) to motivate why this is worth the steep learning curve.

## Common Misconceptions

1. **"Verification is the same as testing"** — Students conflate exhaustive testing with formal proof. Clarify that verification reasons about all possible executions using logic, not by enumerating cases. Example: proving a sorting algorithm works for arrays of any size, not testing on sample inputs.

2. **"Formal methods are too slow for real projects"** — While full verification is expensive, targeted verification of critical components (protocol logic, crypto primitives, concurrency) is tractable and widely used in industry. TLA+ specs at AWS take days to weeks, not years.

3. **"The model checker will find the bug"** — Model checkers only verify properties you specify. Students think the tool is magic; emphasize that writing good specs is harder than writing code. Garbage spec → garbage verification.

4. **"Proofs are like debugging — trial and error"** — While proof development involves iteration, good proofs have structure and intent. Teach students to think about proof strategy before diving into tactics. What are we inducting over? What's the key lemma?

5. **"Verified means bug-free"** — Verification proves code matches spec. If the spec has gaps (missing edge cases, wrong assumptions about environment), bugs slip through. The formalization gap is real.

6. **"Loop invariants are found mechanically"** — No tool can automatically generate the right invariant for complex loops. This requires understanding the algorithm's deep structure. It's creative work, not computation.

7. **"Abstraction loses information"** — Students fear abstraction in model checking will miss bugs. Clarify that sound abstraction preserves all real bugs (no false negatives), though it may report spurious ones (false positives). The art is choosing the right abstraction.

8. **"Theorem provers check your proof for you"** — True, but students underestimate the effort to write a checkable proof. Proof assistants are picky about details humans gloss over. Expect to spend time on mundane lemmas.

9. **"Temporal logic is just regular logic with extra operators"** — Temporal logic has modal semantics (path quantification, branching time). It's not reducible to first-order logic. Students struggle with "always eventually" vs "eventually always" — drill with examples.

10. **"If formal verification is so good, why doesn't everyone use it?"** — Cost-benefit tradeoff. Verification requires skilled engineers, time, and tool expertise. Justified for safety-critical systems (planes, medical devices, crypto), less so for throwaway prototypes. Teach when to apply it.

## Level Adjustments

### For Beginners (not this curriculum)
- Skip temporal logic formalism; use informal English specifications
- Focus on one tool (Dafny) with heavy automation
- Avoid deep proof theory (Curry-Howard, dependent types)
- More worked examples, less independent problem-solving

### For Intermediate (this curriculum)
- Introduce temporal logic (LTL) and model checking with hands-on TLA+ examples
- Cover Hoare logic and weakest preconditions with calculation exercises
- Survey multiple tools (TLA+, Coq, Dafny) to build tool-selection judgment
- Expect students to write simple proofs and specs independently
- Balance theory (semantics, proof rules) with practice (tool use, case studies)

### For Advanced (beyond this curriculum)
- Deep dive into proof theory (Curry-Howard, dependent types, universe hierarchies)
- Separation logic for concurrent programs with frame inference
- Abstract interpretation and lattice theory
- Advanced tactics and proof automation (Ltac, Sledgehammer, Liquid Types)
- Research-level case studies (verified compilers, OS kernels, distributed systems)

## Difficulty Progression

1. **Lessons 1-3 (Difficulty 1-2)** — Motivation and foundations. Gentle intro to specs and properties. Build intuition before formalism.

2. **Lessons 4-9 (Difficulty 2-4)** — Model checking arc. Ramp up from state spaces (2) to temporal logic (3) to hands-on TLA+ (3) to state explosion challenges (4). Peak difficulty when students grapple with abstraction.

3. **Lesson 6 (Difficulty 1)** — First review. Consolidate specs and state space concepts before moving to theorem proving.

4. **Lessons 10-14 (Difficulty 2-4)** — Theorem proving arc. Start with motivation (2), spike to Curry-Howard and proof terms (4), hands-on Coq (4), then real-world CompCert (3). Students hit the proof assistant learning curve hard here.

5. **Lesson 12 (Difficulty 2)** — Second review. Compare model checking vs theorem proving tradeoffs.

6. **Lessons 15-20 (Difficulty 3-4)** — Program verification arc. Hoare logic (3), weakest preconditions (4), Dafny (4), separation logic (4). Sustained high difficulty as students learn to calculate verification conditions and find loop invariants.

7. **Lesson 18 (Difficulty 2)** — Third review. Synthesize spec techniques, proof strategies, tool selection.

8. **Lessons 21-24 (Difficulty 1-3)** — Applications and synthesis. Reflect on when to use verification (2), see advanced case studies (3), look ahead to research (2), final comprehensive review (1).

## Rabbit Holes

- **The Halting Problem and undecidability** — When discussing model checking automation, drop in a note about why full program verification is undecidable. Connects to computability theory. (After lesson 9)

- **The Curry-Howard correspondence is everywhere** — Types are propositions, programs are proofs. This unifies functional programming, type systems, and logic. Mention connections to Rust's type system, Haskell, dependent types. (During lesson 11)

- **Quantum computing verification** — How do you verify a quantum algorithm? New logics, new challenges. Point to recent research. (After lesson 23)

- **Game semantics for verification** — Model checking as a two-player game (system vs environment). Elegant theory, useful for reactive systems. (During lesson 9)

- **Proof-carrying code** — Imagine executables that ship with a proof of safety. Downloaded code can be trusted instantly. Used in some embedded systems. (After lesson 14)

- **The Social Process of Formalization** — Who decides what the spec means? Requirements are ambiguous. Verification can surface this ambiguity. (After lesson 2)

- **AI and formal verification** — Can neural networks generate loop invariants? Can LLMs write formal proofs? Frontier research area with tools like GPT-f, Copilot for Coq. (After lesson 17)

- **Blockchain and verified smart contracts** — Ethereum bugs cost millions. Formal verification (K framework, Certora) is now standard for serious smart contracts. (After lesson 20)

- **Aviation software certification (DO-178C)** — How is formal verification used in safety-critical avionics? Airbus, Boeing. Regulatory angle. (After lesson 22)

- **The seL4 verification effort** — Took 20 person-years to verify 8,700 lines of C. Cost-benefit: is it worth it? What did we learn? (During lesson 22)

## Key Takeaways

By the end of this curriculum, students should:

1. **Write formal specs** — translate informal requirements into temporal logic or Hoare triples
2. **Choose the right tool** — know when to use model checking (finite state, concurrent) vs theorem proving (infinite, inductive) vs automated verifiers (programs with specs)
3. **Debug failed verifications** — read counterexamples from model checkers, diagnose proof failures in proof assistants
4. **Understand limitations** — verification is expensive, specs can be wrong, abstraction has tradeoffs
5. **Appreciate the math** — see the beauty in Curry-Howard, the power of induction, the elegance of separation logic

## Red Flags to Watch For

- **Students skip writing specs and jump to tools** — Verification is 80% specification, 20% tool use. If they rush to TLA+ without thinking through properties, they'll get garbage output.
- **Students give up when proofs don't go through** — Proof assistant errors are cryptic. Encourage them to simplify, state lemmas, ask for help. Normalize iteration.
- **Students think verification replaces testing** — No! Testing finds bugs fast. Verification proves absence of (specified) bugs. They're complementary.
- **Students don't appreciate the formalization gap** — Real-world specs are ambiguous. Formalization forces precision, which surfaces hidden assumptions. This is a feature, not a bug.
