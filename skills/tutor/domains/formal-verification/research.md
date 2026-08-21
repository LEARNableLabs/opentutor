# Formal Verification — Research Summary

## Major Subtopics

### 1. Model Checking
Systematic state-space exploration to verify finite-state systems against temporal logic specifications. Industry standard for hardware verification (Intel, AMD). Tools: SPIN, NuSMV, TLA+.

### 2. Theorem Proving
Interactive proof assistants for mathematical verification of programs and algorithms. Used in critical systems (CompCert C compiler, seL4 microkernel). Tools: Coq, Isabelle/HOL, Lean.

### 3. Program Verification
Automated and semi-automated techniques for proving program correctness: Hoare logic, separation logic, abstract interpretation. Tools: Dafny, Why3, Frama-C.

### 4. Temporal Logic
Specification languages for concurrent and reactive systems: LTL (Linear Temporal Logic), CTL (Computation Tree Logic). Foundation for model checking.

### 5. SAT/SMT Solvers
Boolean satisfiability and Satisfiability Modulo Theories — engines powering modern verification tools. Z3, CVC5, MiniSat.

## Key Sources

### Academic Courses
- **MIT 6.826 Principles of Computer Systems** — Adam Chlipala's course using Coq for systems verification
- **CMU 15-414/814 Bug Catching** — model checking and symbolic execution (Klaus von Gleissenthall)
- **UC Berkeley CS294-260** — program synthesis and verification (Rastislav Bodik, Armando Solar-Lezama)

### Textbooks
- **Software Foundations** (Pierce et al.) — interactive Coq tutorial, freely available
- **Principles of Model Checking** (Baier & Katoen) — comprehensive reference
- **Concrete Semantics with Isabelle/HOL** (Nipkow & Klein) — theorem proving for PL semantics
- **The Calculus of Computation** (Bradley & Manna) — decision procedures and verification

### Industry Applications
- **Amazon Web Services** — TLA+ for protocol verification (DynamoDB, S3)
- **Microsoft** — Dafny for cloud infrastructure
- **Facebook/Meta** — Infer for static analysis at scale
- **Airbus** — SCADE for safety-critical avionics

## Available Resources

### Interactive Tools
- **TLA+ Toolbox** — visual model checker with error traces
- **CoqIDE / VSCode Coq** — interactive theorem proving
- **Dafny online** — browser-based verifier with instant feedback
- **SPIN** — model checker for concurrent systems

### Video Series
- Leslie Lamport's TLA+ video course (Microsoft Research)
- Software Foundations lecture series
- Hillel Wayne's practical TLA+ tutorials

### Code Repositories
- Verified software examples: CompCert, seL4, Vellvm
- TLA+ specifications: AWS, Raft consensus, blockchain protocols
- Coq standard library and mathematical components

## Gaps & Challenges

- **Tool learning curve** — proof assistants have steep onboarding; need hands-on practice
- **Formalization gap** — translating real requirements to formal specs is an art
- **Scalability** — formal verification doesn't scale to all codebases; knowing when to apply it matters
- **Industry adoption** — still niche outside hardware and safety-critical domains
