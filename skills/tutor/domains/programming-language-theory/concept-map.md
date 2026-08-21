# Programming Language Theory — Concept Map

## Core Concepts (in learning order)

1. **Lambda calculus** — minimal universal model of computation via function abstraction and application
2. **Variable binding** — how variables get their meaning through scoping rules. Depends on: lambda calculus
3. **Substitution** — replacing variables with expressions while avoiding capture. Depends on: variable binding
4. **Beta reduction** — the core computation rule of lambda calculus. Depends on: substitution
5. **Reduction strategies** — different orderings of reductions (normal order, applicative order). Depends on: beta reduction
6. **Church encodings** — representing data (booleans, numbers, pairs) purely as functions. Depends on: beta reduction
7. **Fixed points and recursion** — enabling recursion without explicit recursion (Y combinator). Depends on: beta reduction, Church encodings
8. **Stuck terms** — programs that can't reduce but aren't values (runtime errors). Depends on: beta reduction
9. **Type systems** — static constraints that prevent stuck terms. Depends on: stuck terms
10. **Typing rules** — inference rules that assign types to expressions. Depends on: type systems
11. **Simply typed lambda calculus (STLC)** — lambda calculus extended with simple types. Depends on: lambda calculus, typing rules
12. **Type derivations** — proofs that an expression has a type. Depends on: typing rules
13. **Type soundness** — proof that well-typed programs don't get stuck. Depends on: type derivations, stuck terms
14. **Progress and preservation** — the two lemmas that prove type soundness. Depends on: type soundness
15. **Product types** — tuples and records. Depends on: STLC
16. **Sum types** — tagged unions and variants. Depends on: STLC
17. **Algebraic data types (ADTs)** — combining products and sums. Depends on: product types, sum types
18. **Operational semantics** — formal specification of program execution. Depends on: beta reduction
19. **Small-step semantics** — execution as a sequence of atomic steps. Depends on: operational semantics
20. **Big-step semantics** — execution relating inputs directly to final results. Depends on: operational semantics
21. **Evaluation strategies** — call-by-value vs call-by-name. Depends on: operational semantics
22. **Determinism** — uniqueness of reduction sequences. Depends on: operational semantics
23. **Type inference** — automatic reconstruction of types. Depends on: type systems
24. **Unification** — finding substitutions that make types equal. Depends on: type inference
25. **Hindley-Milner algorithm** — complete type inference for let-polymorphism. Depends on: unification
26. **Parametric polymorphism** — functions generic over types. Depends on: type systems
27. **Let-polymorphism** — polymorphism restricted to let-bound variables. Depends on: parametric polymorphism, Hindley-Milner
28. **Subtyping** — a type hierarchy where one type can substitute for another. Depends on: type systems
29. **Variance** — how type constructors preserve or reverse subtyping. Depends on: subtyping
30. **Effect systems** — tracking computational effects in types. Depends on: type systems
31. **Algebraic effects** — modular effect handlers. Depends on: effect systems
32. **Dependent types** — types that depend on runtime values. Depends on: type systems
33. **Curry-Howard correspondence** — isomorphism between types and propositions. Depends on: type systems
34. **Propositions as types** — proofs as programs, types as specifications. Depends on: Curry-Howard correspondence
35. **Proof assistants** — tools for constructing machine-checked proofs. Depends on: propositions as types

## Dependencies

### Foundation Layer (concepts 1-7)
The untyped lambda calculus foundation. These concepts build linearly:
- **Substitution** requires understanding variable binding to avoid capture
- **Beta reduction** applies substitution to perform computation
- **Reduction strategies** choose which reduction to do next
- **Church encodings** show that lambda calculus is universal
- **Fixed points** enable recursion within a recursion-free system

### Type System Layer (concepts 8-17)
Types as constraints on computation:
- **Stuck terms** motivate the need for type systems
- **Typing rules** formalize type assignment
- **Type derivations** are proofs built from typing rules
- **Type soundness** guarantees well-typed programs don't get stuck
- **Progress and preservation** are the proof technique for soundness
- **Product/sum types** extend STLC with structured data
- **ADTs** combine products and sums into the pattern used by ML, Haskell, Rust

### Semantics Layer (concepts 18-22)
Formalizing execution:
- **Operational semantics** generalizes beta reduction to full languages
- **Small-step** and **big-step** are two formalization styles
- **Evaluation strategies** determine what reduces when
- **Determinism** is a key property for predictable execution

### Inference Layer (concepts 23-27)
Automation of type assignment:
- **Type inference** removes annotation burden
- **Unification** solves type equations
- **Hindley-Milner** is the complete algorithm for ML-style languages
- **Let-polymorphism** enables polymorphism with principal types
- **Parametric polymorphism** is the feature being inferred

### Advanced Features Layer (concepts 28-35)
Beyond STLC:
- **Subtyping** adds flexibility to type systems
- **Variance** handles type constructors in subtyping
- **Effect systems** track side effects in types
- **Dependent types** blur the line between types and terms
- **Curry-Howard** reveals the deep connection to logic
- **Proof assistants** make types a verification tool

## Critical Path (concepts you can't skip)

1. Lambda calculus → substitution → beta reduction
2. Stuck terms → type systems → typing rules
3. Type soundness (progress + preservation)
4. Operational semantics (at least one style)
5. Type inference → unification
6. Parametric polymorphism
7. Curry-Howard correspondence

Everything else can be sampled or skipped depending on interests.

## Common Bottlenecks

### Substitution
Students often struggle with capture-avoiding substitution. The issue: substituting `[y/x](\y.x)` naively gives `\y.y`, changing meaning. Solution: alpha-convert bound variables before substituting.

**Fix:** Use concrete examples with name collision before introducing alpha conversion. Draw boxes around scopes.

### Type Soundness Proofs
Progress and preservation feel abstract until you see them fail on an unsafe language.

**Fix:** Show an untyped language where well-typedness doesn't hold. Then show how STLC prevents the bad case.

### Unification
The unification algorithm has a lot of cases and the occurs check is subtle.

**Fix:** Start with extremely simple examples (unifying `X → Int` with `Bool → Y`). Build complexity slowly.

### Curry-Howard Correspondence
The isomorphism between types and propositions is mind-bending at first.

**Fix:** Use the function type analogy: `A → B` is both "function from A to B" and "A implies B". Build from there.

## Prerequisite Topics from Other Domains

- **Functional programming** — needed for: lambda calculus syntax, higher-order functions, pattern matching
- **Discrete mathematics** — needed for: induction, structural induction, proof techniques
- **Propositional logic** — needed for: Curry-Howard correspondence, type systems as logic
- **Recursion theory** — helpful for: understanding fixed points, Church encodings
- **Formal languages** — helpful for: understanding syntax, grammars, binding

## Concept Clusters (related ideas)

### Cluster 1: Computation Models
- Lambda calculus
- Beta reduction
- Reduction strategies
- Church encodings
- Recursion via fixed points

These are all about "what is computation?"

### Cluster 2: Type Safety
- Type systems
- Type soundness
- Progress
- Preservation
- Stuck terms

These are all about "how do types prevent errors?"

### Cluster 3: Formal Semantics
- Operational semantics
- Small-step semantics
- Big-step semantics
- Evaluation strategies
- Determinism

These are all about "how do we precisely specify execution?"

### Cluster 4: Type Inference
- Unification
- Hindley-Milner
- Constraint generation
- Principal types
- Let-polymorphism

These are all about "how do we automate type assignment?"

### Cluster 5: Advanced Types
- Parametric polymorphism
- Subtyping
- Effect systems
- Dependent types

These are all about "what can types express beyond simple safety?"

### Cluster 6: Types as Proofs
- Curry-Howard correspondence
- Propositions as types
- Proof assistants
- Certified programming

These are all about "how do types enable verification?"

## Learning Pathways

### Path 1: Theory-First (for math-oriented students)
Lambda calculus → operational semantics → type theory → soundness proofs → Curry-Howard

### Path 2: Practice-First (for engineers)
Type systems in familiar languages → type inference → implement a type checker → formal foundations → soundness

### Path 3: PL Design Focus
Type features in real languages → subtyping and polymorphism → effect systems → advanced type features → design tradeoffs

The curriculum follows Path 1 with practical checkpoints, which works well for intermediate students with some functional programming background.
