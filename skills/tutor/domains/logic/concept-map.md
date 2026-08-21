# Concept Map — Logic from Aristotle to Gödel

## Core Dependency Graph

```
Truth and Validity
    ↓
Syllogistic Logic (Aristotle)
    ↓
Categorical Propositions → Valid Inference Forms
    ↓
Boolean Algebra (Boole) → Algebraic Logic → Truth Tables
    ↓
Predicate Logic (Frege) → Quantifiers → Scope
    ↓
Formal Proof Systems → Natural Deduction → Inference Rules
    ↓
Axiomatization (Hilbert) → Formalism → Consistency
    ↓
Completeness (Gödel 1930) → Semantic vs Syntactic Truth
    ↓
Self-Reference → Gödel Numbering → Diagonal Argument
    ↓
First Incompleteness Theorem → True but Unprovable Statements
    ↓
Second Incompleteness Theorem → Consistency Cannot Be Proven
    ↓
Decidability → Church-Turing Thesis → Halting Problem
    ↓
Model Theory ← → Proof Theory ← → Computability Theory
```

## Module Dependencies

### Module 1: Ancient Foundations
**Prerequisites**: None  
**Concepts**: Syllogism, categorical proposition, validity, term logic, paradox, self-reference  
**Unlocks**: Boolean algebra (needs understanding of logical inference)

### Module 2: The Algebraic Turn
**Prerequisites**: Module 1 (understanding of logical operations)  
**Concepts**: Boolean algebra, logical operators, truth tables, algebraic logic, laws of thought  
**Unlocks**: Predicate logic (needs symbolic representation)

### Module 3: Frege's Revolution
**Prerequisites**: Module 2 (symbolic logic foundation)  
**Concepts**: Quantifiers (∀, ∃), predicate logic, formalization, proof systems, natural deduction, inference rules  
**Unlocks**: Formal systems (needs proof construction skills)

### Module 4: Hilbert's Dream
**Prerequisites**: Module 3 (formal proof ability)  
**Concepts**: Formalism, axiomatization, completeness, consistency, decidability, Hilbert's program  
**Unlocks**: Gödel's theorems (needs understanding of what completeness means)

### Module 5: Gödel's Bombshell
**Prerequisites**: Module 4 (understanding of formal systems)  
**Concepts**: Completeness theorem, Gödel numbering, self-reference, diagonal argument, first incompleteness theorem, second incompleteness theorem  
**Unlocks**: Modern logic (needs understanding of limits)

### Module 6: Beyond Gödel
**Prerequisites**: Module 5 (incompleteness theorems)  
**Concepts**: Decidability, Church-Turing thesis, Tarski's undefinability, computability, model theory, proof theory  
**Unlocks**: Advanced topics in logic, computer science, philosophy

## Critical Concepts (must master)

1. **Validity vs Truth** — foundation of all logic
2. **Quantifiers** — revolutionary expressive power
3. **Formal Proof** — what it means to derive a conclusion
4. **Completeness** — when all truths are provable
5. **Self-Reference** — how Gödel constructed his sentence
6. **Incompleteness** — the limits of formal systems
7. **Decidability** — what can be algorithmically determined

## Common Misconceptions

- **"Gödel proved math is broken"** → No, he proved that no single formal system can capture all mathematical truth
- **"Incompleteness means we can't know anything"** → No, it's about what formal systems can prove, not what we can know
- **"Aristotle's logic is obsolete"** → No, it's a special case of modern logic and still useful for many arguments
- **"Boolean algebra is just for computers"** → No, it's a fundamental mathematical structure underlying all digital logic
- **"Completeness and incompleteness are opposites"** → They apply to different things: first-order logic is complete, but arithmetic is incomplete

## Concept Progression Notes

- **Early lessons (1-6)**: Build intuition about what logic is and how it evolved. Historical narrative helps motivation.
- **Middle lessons (7-14)**: Technical skills — translating to formal language, constructing proofs, understanding formal systems.
- **Late lessons (15-24)**: Deep theoretical results — Gödel's theorems, decidability, philosophical implications.

## Interactive Elements

- **Proof construction**: Use Natural Deduction Proof Editor, LogicProof, The Logic Machine
- **Translation exercises**: Convert natural language to first-order logic
- **System design**: Create small formal systems and explore their properties
- **Diagonal arguments**: Construct self-referential sentences
- **Historical debates**: Explore the Hilbert-Brouwer controversy, formalism vs intuitionism
