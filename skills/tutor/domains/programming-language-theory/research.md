# Programming Language Theory — Research Summary

## Major Subtopics

### 1. Lambda Calculus
The foundation of functional programming and type theory. Covers untyped lambda calculus, reduction strategies, Church encodings, and the transition to typed systems.

**Key concepts:** substitution, beta reduction, normal forms, combinators, variable binding

### 2. Type Systems
The core of PLT — how types provide safety guarantees and enable reasoning about programs. Covers simple types, polymorphism, subtyping, and advanced type features.

**Key concepts:** type safety, soundness, principal types, type inference algorithms, parametric polymorphism

### 3. Operational Semantics
How programs execute, formalized. Small-step and big-step semantics, evaluation strategies, and relating different semantic approaches.

**Key concepts:** reduction relations, evaluation contexts, stuck terms, determinism

### 4. Type Inference & Checking
Algorithms for automated type reconstruction. Hindley-Milner, unification, constraint generation, bidirectional typing.

**Key concepts:** unification, substitution, principal types, constraint solving

### 5. Advanced Type Features
Dependent types, linear types, effect systems, session types, and how types enable program verification.

**Key concepts:** propositions as types, linear resources, algebraic effects, type-driven development

### 6. Program Verification
Using types and formal methods to prove program correctness. Curry-Howard correspondence, proof assistants, and verification-oriented type systems.

**Key concepts:** propositions as types, proof terms, certified programming

## Key Sources

### Primary Textbooks
- **Types and Programming Languages (TAPL)** by Benjamin C. Pierce — the canonical PLT textbook, comprehensive coverage of type systems
- **Programming Language Foundations** by Robert Harper (CMU) — focuses on operational semantics and typed lambda calculi
- **Practical Foundations for Programming Languages** by Robert Harper — rigorous treatment with emphasis on binding and scope
- **Essentials of Programming Languages** by Friedman, Wand, Byrd — interpreter-based approach

### Online Courses & Materials
- **Software Foundations** (https://softwarefoundations.cis.upenn.edu/) — Coq-based interactive textbook series covering logical foundations, PLT, and verification
- **Oregon Programming Languages Summer School (OPLSS)** — annual summer school with lecture videos on advanced PLT topics
- **CMU 15-312** (Principles of Programming Languages) — Robert Harper's course with extensive notes
- **UPenn CIS 500** (Software Foundations) — accompanies Software Foundations book

### Interactive Tools & Implementations
- **Programming Languages Zoo** (https://plzoo.andrej.com/) — collection of miniature PLs demonstrating different concepts
- **Lambda Calculus Visualizer** — several online tools for stepping through reductions
- **Type Systems Playground** — interactive type checkers and inference engines

### Research Communities
- **POPL** (Principles of Programming Languages) — premier conference
- **ICFP** (International Conference on Functional Programming)
- **PLDI** (Programming Language Design and Implementation)

## Available Resources by Format

### Video Lectures
- OPLSS lecture series (YouTube)
- MIT 6.820 (Fundamentals of Program Analysis)
- Various university course recordings on lambda calculus and type systems

### Interactive/Hands-On
- Software Foundations (Coq-based exercises)
- Online lambda calculus interpreters
- Type inference playgrounds
- Proof assistant tutorials (Coq, Agda, Lean)

### Tools for Exploration
- Coq, Agda, Lean (proof assistants)
- Haskell, OCaml (typed functional languages for experimentation)
- PLT Redex (semantic modeling tool)

## Pedagogical Notes

For **intermediate** students, the curriculum should:
- Assume familiarity with functional programming (map, fold, higher-order functions)
- Build formal foundations gradually (lambda calculus before type systems)
- Balance theory with implementation (reading typing rules AND implementing type checkers)
- Use concrete examples from real languages (Haskell, ML, Rust) to motivate abstractions
- Introduce proof techniques but focus on intuition over full formalization
- Save most advanced topics (dependent types, effect systems) for later lessons

The progression typically follows: computation models → types as constraints → inference as automation → types as proofs.
