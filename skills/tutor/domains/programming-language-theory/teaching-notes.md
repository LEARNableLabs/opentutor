# Programming Language Theory — Teaching Notes

## Approach

PLT sits at the intersection of mathematics and programming, requiring both formal rigor and practical intuition. For **intermediate** students, the key is to ground abstractions in concrete examples before introducing formalism. Start every concept with "here's a bug/limitation in a language you know" → "here's how PLT addresses it" → "here's the formal machinery." Use real programming languages (Haskell, OCaml, Rust, TypeScript) to motivate features, then peel back to the theoretical essence.

PLT is uniquely suited to a **build-to-learn** approach: implementing small interpreters, type checkers, and inference engines cements understanding better than reading proofs. Alternate between theory (typing rules, semantics) and implementation (write a type checker, trace a reduction). The curriculum follows a **foundations-first** progression: lambda calculus establishes the computational model, types layer on safety, semantics formalizes execution, inference automates checking, and advanced features show the frontier.

Expect to revisit concepts in increasing depth. Lambda calculus appears in lesson 1, but beta reduction's full implications emerge when studying semantics (lesson 13-17) and soundness proofs (lesson 10). This is intentional — PLT concepts are interconnected, and the "aha" moments come from seeing the same idea from multiple angles.

## Common Misconceptions

### 1. "Lambda calculus is just anonymous functions in Python/JavaScript"
**Why students believe this:** Modern languages use `lambda` syntax, making it seem like lambda calculus is just anonymous functions.

**Why it's wrong:** Lambda calculus is a minimal *model of computation* where *everything* is a function — no built-in numbers, booleans, or data structures. Anonymous functions in Python are a *feature* inspired by lambda calculus, not the calculus itself.

**How to correct:** Show Church encodings (lesson 4) where numbers and booleans are *defined* as functions. Emphasize that lambda calculus is Turing-complete with only three syntactic forms: variables, abstraction, application.

### 2. "Type checking happens at runtime"
**Why students believe this:** Many students come from Python, JavaScript, or Ruby where type errors surface during execution. They confuse type checking with runtime type tags.

**Why it's wrong:** Type checking (in PLT) is a *static* analysis that happens before execution. A program is either well-typed (and allowed to run) or ill-typed (rejected before running).

**How to correct:** Contrast static typing (Haskell, OCaml) where ill-typed programs are rejected by the compiler vs. dynamic typing (Python) where type errors happen at runtime. Emphasize that PLT focuses on static systems that provide guarantees before execution.

### 3. "Type soundness means no runtime errors"
**Why students believe this:** The phrase "well-typed programs don't go wrong" sounds absolute.

**Why it's wrong:** Type soundness only prevents *type errors* (applying non-functions, accessing undefined fields). It doesn't prevent division by zero, infinite loops, or out-of-memory errors.

**How to correct:** Clarify "going wrong" means getting *stuck* (unable to reduce but not a value). Show a well-typed program that crashes (division by zero in a language where `/` has type `Int → Int → Int`). Distinguish *type safety* from *total correctness*.

### 4. "Beta reduction and evaluation are the same thing"
**Why students believe this:** Both involve simplifying expressions, and the terms are often used interchangeably in informal settings.

**Why it's wrong:** Beta reduction is the *mathematical rewriting rule* `(λx.M) N → M[N/x]`. Evaluation is an *operational semantics* that specifies which reductions to perform in which order. Beta reduction is symmetric (can go either direction in theory), but evaluation has a direction and strategy.

**How to correct:** Show that `(λx.x) ((λy.y) z)` has multiple beta redexes, but call-by-value evaluation specifies to reduce the argument first. Evaluation *uses* beta reduction but adds control flow.

### 5. "Polymorphism is the same as generics"
**Why students believe this:** Java/C# generics look like ML/Haskell polymorphism, both use type variables.

**Why it's wrong:** Parametric polymorphism (PLT concept) guarantees *uniformity* — `id : ∀a. a → a` must work identically for all types. Java generics allow runtime type inspection and type bounds that break parametricity. Also, ad-hoc polymorphism (overloading) is a completely different mechanism.

**How to correct:** Distinguish parametric polymorphism (uniform behavior, type variables), ad-hoc polymorphism (overloading, type classes), and subtype polymorphism (OOP inheritance). Use "generics" only as an informal analogy, not a synonym.

### 6. "Type inference means the language is untyped"
**Why students believe this:** If you don't write types, it feels like Python/JavaScript where types aren't checked.

**Why it's wrong:** Type inference *reconstructs* the unique type that makes a program well-typed. It's still static checking, just automated. ML and Haskell are *strongly statically typed*, even though annotations are optional.

**How to correct:** Show that OCaml/Haskell reject ill-typed programs at compile time, just like Java, but without requiring annotations. Emphasize that inference finds the type the programmer *would have written*.

### 7. "Dependent types let you prove anything about your program"
**Why students believe this:** Dependent types enable rich specifications, and proof assistants use dependent types, so it seems like a silver bullet.

**Why it's wrong:** Dependent type systems are still limited by decidability and Rice's theorem. You can't prove arbitrary properties (e.g., "this program halts"). You can only prove properties expressible in the type system's logic.

**How to correct:** Emphasize that dependent types *strengthen* expressiveness, letting you encode invariants like "this list has length n" or "this function preserves sorted order." But you can't encode "this function terminates on all inputs" without extra termination checking.

### 8. "The Y combinator is recursion"
**Why students believe this:** Y enables recursive definitions, so it seems synonymous.

**Why it's wrong:** Y is a *fixed point combinator* that encodes recursion *without* having recursion as a primitive. It's a workaround in a system that has no built-in recursion. Real languages add recursion directly (via `letrec` or similar).

**How to correct:** Show that lambda calculus has no recursion primitive — you can't reference a function's name in its own body. Y is a *clever hack* using higher-order functions to simulate recursion. Real languages don't use Y; they add recursion as a language feature.

### 9. "Subtyping and polymorphism are the same"
**Why students believe this:** Both involve "working with multiple types," and in OOP, inheritance provides both.

**Why it's wrong:** Subtyping is a *relation* between types (`Dog <: Animal` means a dog can be used where an animal is expected). Polymorphism is *type abstraction* (a function works for *any* type `a`). Subtyping is about *substitutability*; polymorphism is about *generality*.

**How to correct:** Contrast `List<Dog> <: List<Animal>` (subtyping, if covariant) with `length : ∀a. List a → Int` (polymorphism). Subtyping creates a hierarchy; polymorphism abstracts over types.

### 10. "Operational semantics is just implementing an interpreter"
**Why students believe this:** Operational semantics rules look like interpreter code, and both "run" programs.

**Why it's wrong:** Operational semantics is a *mathematical specification* of meaning, independent of implementation. An interpreter is an *implementation* that may or may not follow the semantics correctly.

**How to correct:** Show that semantics defines the *ideal* behavior, which you then prove properties about (determinism, soundness). An interpreter is an artifact you can test against the spec. Semantics is the *standard*, interpreter is the *realization*.

## Level Adjustments

### For Beginners (if student over-reported their level)
- Spend extra time on lambda calculus substitution with visual aids (boxes for scopes)
- Skip formal soundness proofs; replace with intuitive arguments and examples
- Reduce formalism in typing rules; use more natural language
- Skip big-step semantics; focus only on small-step
- Use Haskell/OCaml as concrete examples more heavily
- Skip dependent types and advanced effect systems entirely
- Replace teach-back lessons with more mini-lessons

### For Advanced (if student under-reported or advances quickly)
- Add formalism: introduce inference rules earlier, expect formal proof sketches
- Add advanced topics: linear types, session types, gradual typing, bidirectional typing
- Expect implementation of not just type checkers but full interpreters
- Introduce advanced proof techniques: logical relations, step-indexing, parametricity
- Dive deeper into Curry-Howard: correspondence with classical vs. intuitionistic logic
- Connect to PL research: POPL papers, recent type system innovations
- Add optional "deep dive" lessons on specific topics (e.g., System F, F-omega)

### For This Level (Intermediate)
- Balance formal rigor with intuition — show typing rules, but explain them
- Expect students to read and write typing derivations, but not full soundness proofs
- Implement simple type checkers (STLC, basic inference), not full languages
- Use real languages to motivate, but always peel back to the core PLT concepts
- Introduce advanced topics (dependent types, effects) at a survey level, not deeply
- Emphasize the *why* behind each concept, not just the *what*

## Rabbit Holes (Fascinating Connections)

### The Blub Paradox and PLT
**When to drop:** After lesson 11 (ADTs) or lesson 23 (polymorphism)

Paul Graham's "Blub paradox" — programmers can't see the power of features their language lacks. Connect to PLT: understanding type systems lets you *see* what's possible. A Java programmer might not realize how much boilerplate ADTs eliminate. A Python programmer might not see how static types catch bugs. PLT is the antidote to the Blub paradox.

### Lambda Calculus and Computability Theory
**When to drop:** After lesson 3 (beta reduction) or lesson 6 (Y combinator)

Lambda calculus and Turing machines are *equivalent* models of computation (Church-Turing thesis). Every Turing-computable function is lambda-definable, and vice versa. But lambda calculus is *compositional* (functions all the way down) while Turing machines are *operational* (state transitions). This duality runs through all of CS.

### Parametricity and "Theorems for Free"
**When to drop:** After lesson 23 (parametric polymorphism)

Wadler's "Theorems for Free" — the type of a polymorphic function severely constrains its behavior. A function `f : ∀a. a → a` *must* be the identity (or non-terminating). Why? It can't inspect `a`, so it has no choice. This is *parametricity* — polymorphic functions are uniform across types. It's a superpower for reasoning.

### Curry-Howard and Intuitionistic Logic
**When to drop:** After lesson 28 (Curry-Howard)

The Curry-Howard correspondence maps simply typed lambda calculus to *intuitionistic* logic, not classical logic. Why? Classical logic has the law of excluded middle (`P ∨ ¬P`), which has no computational content — you can't compute a proof of `P` or `¬P` without knowing which is true. Intuitionistic logic is "constructive," matching computation. This is why proof assistants use intuitionistic foundations.

### Type Systems and Security
**When to drop:** After lesson 25 (effect systems)

Type systems aren't just for preventing crashes — they enforce *security policies*. Information flow types track data confidentiality (no leaking secrets), region types enforce memory safety, and effect systems prevent privilege escalation. PLT is the foundation of secure programming languages.

### Linear Types and Resource Management
**When to drop:** After lesson 26 (dependent types)

Linear types ensure a value is used *exactly once*. This prevents use-after-free bugs, enables safe concurrency (no aliasing), and even models quantum computation (no cloning). Rust's borrow checker is a linear type system in disguise. Linear logic (the logic corresponding to linear types) revolutionized our understanding of resources in computation.

### The Lambda Cube and the Expressive Power Hierarchy
**When to drop:** After lesson 26 (dependent types)

The lambda cube organizes type systems by three axes: terms depending on terms (basic), terms on types (polymorphism), types on terms (dependent types), and types on types (type operators). It's a beautiful taxonomy showing how adding each dimension increases expressiveness. System F-omega (Haskell's core) sits at one corner, full dependent types at another.

### Proofs vs. Programs: The Brouwer–Heyting–Kolmogorov Interpretation
**When to drop:** After lesson 28 (Curry-Howard)

BHK interpretation: a proof of `A ∧ B` is a pair of proofs, a proof of `A ∨ B` is a tagged union, a proof of `A → B` is a function transforming proofs of `A` to proofs of `B`. This *predates* Curry-Howard and comes from intuitionistic mathematics. The idea that proofs are constructions was always there; Curry-Howard made it *formal*.

## Difficulty Progression

### Phase 1: Lambda Calculus Foundations (Lessons 1-6)
**Difficulty trajectory:** 2 → 3 → 3 → 4 → 2 → 4

Start accessible (lesson 1: motivation), build to moderate challenge (lessons 2-3: substitution and reduction), peak at Church encodings (lesson 4: difficulty 4), ease off with a resource drop (lesson 5), then peak again at Y combinator (lesson 6: difficulty 4).

**Why this shape:** Lambda calculus is mind-bending for students used to imperative programming. The initial concepts are concrete, but Church encodings and fixed points require a mental shift. Interleaving a practical resource drop (lesson 5) gives breathing room.

### Phase 2: Type Systems Foundations (Lessons 7-12)
**Difficulty trajectory:** 2 → 3 → 3 → 4 → 2 → 1 (review)

Start with motivation (lesson 7: why types?), build formalism (lessons 8-9: typing rules, STLC), peak at soundness (lesson 10: difficulty 4), ease off with real-world ADTs (lesson 11), then review (lesson 12).

**Why this shape:** Type soundness is the first major theorem, and it's conceptually dense. Following it with a practical lesson on ADTs provides relief before the review.

### Phase 3: Operational Semantics (Lessons 13-17)
**Difficulty trajectory:** 2 → 3 → 3 → 4 → 2

Build from basics (lesson 13: what is operational semantics?) through formalism (lessons 14-15: small-step vs big-step, evaluation order), peak at proofs about semantics (lesson 16: determinism, difficulty 4), then ease off with a tool exploration (lesson 17).

**Why this shape:** Semantic proofs (determinism, confluence) require structural induction, which is challenging. The PLT Redex resource drop provides a hands-on cooldown.

### Phase 4: Type Inference (Lessons 18-22)
**Difficulty trajectory:** 2 → 1 (review) → 4 → 4 → 5

Motivate inference (lesson 18), review fundamentals (lesson 19), then ramp steeply through unification (lesson 20: difficulty 4), Hindley-Milner (lesson 21: difficulty 4), and peak at implementing an inference engine (lesson 22: difficulty 5).

**Why this shape:** Inference is algorithmically dense. The review at lesson 19 is strategically placed before the hardest stretch. Lesson 22 is the curriculum's peak difficulty — implementing inference requires integrating everything learned so far.

### Phase 5: Advanced Types (Lessons 23-27)
**Difficulty trajectory:** 3 → 3 → 4 → 5 → 2 (review)

Survey polymorphism (lesson 23), subtyping (lesson 24), effects (lesson 25: difficulty 4), dependent types (lesson 26: difficulty 5 due to conceptual leap), then review (lesson 27).

**Why this shape:** These are independent advanced topics, each challenging. Dependent types are the conceptual peak. The review consolidates disparate ideas.

### Phase 6: Verification and Applications (Lessons 28-30)
**Difficulty trajectory:** 4 → 3 → 3

Curry-Howard (lesson 28: difficulty 4, foundational theorem), proof assistants (lesson 29: difficulty 3, practical exploration), final synthesis (lesson 30: difficulty 3, student-driven).

**Why this shape:** Curry-Howard is profound but builds on prior work. The final lessons are consolidation and connection to real-world practice, easing out of the course.

### Overall Arc
The curriculum has two major peaks: **lesson 22 (implement inference)** and **lesson 26 (dependent types)**. Both represent synthesis points where earlier concepts must integrate. Review lessons (12, 19, 27) are strategically placed before or after steep climbs. The difficulty starts at 2, builds to regular 3-4 lessons, peaks at 5 twice, and ends at 3, leaving students confident and capable of further exploration.

Difficulty ratings:
- **1 (Review)**: Consolidation, no new concepts
- **2 (Accessible)**: New concept, intuitive presentation
- **3 (Standard)**: New concept, moderate formalism
- **4 (Challenging)**: Dense formalism or algorithmic complexity
- **5 (Peak)**: Synthesis requiring integration of prior work

The intermediate level means most lessons are 3-4, with strategic peaks and valleys.
