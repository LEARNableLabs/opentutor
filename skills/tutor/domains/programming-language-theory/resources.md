# Programming Language Theory — Resources

## Primary Sources (for lesson content)

### Canonical Textbooks

- **Types and Programming Languages (TAPL)** by Benjamin C. Pierce (2002) — *The* standard PLT textbook. Comprehensive coverage of lambda calculus, type systems, subtyping, polymorphism, and type inference. Perfect for intermediate learners. Some chapters available at https://www.cis.upenn.edu/~bcpierce/tapl/
  
- **Programming Language Foundations** (PLF) from Software Foundations — Interactive Coq-based textbook covering operational semantics, Hoare logic, and type systems. Free and excellent for hands-on learning: https://softwarefoundations.cis.upenn.edu/plf-current/

- **Practical Foundations for Programming Languages (PFPL)** by Robert Harper — More advanced than TAPL, with rigorous treatment of binding, scope, and semantics. CMU's PLT course textbook: https://www.cs.cmu.edu/~rwh/pfpl/

- **Essentials of Programming Languages (EOPL)** by Friedman, Wand, Byrd — Interpreter-based approach to PLT. Build interpreters for increasingly complex languages. Less formal than TAPL, more hands-on.

### Online Courses

- **Software Foundations** (Volume 1: Logical Foundations, Volume 2: PLF) — Self-paced Coq-based course with exercises: https://softwarefoundations.cis.upenn.edu/

- **CMU 15-312 (Principles of Programming Languages)** — Robert Harper's legendary course. Lecture notes available: https://www.cs.cmu.edu/~rwh/courses/ppl/

- **Cornell CS 6110 (Advanced Programming Languages)** — Covers operational semantics, type systems, and program analysis: https://www.cs.cornell.edu/courses/cs6110/

- **UPenn CIS 500 (Software Foundations)** — Follows the Software Foundations book, taught by Pierce et al.

- **Oregon Programming Languages Summer School (OPLSS)** — Annual summer school with lecture videos on advanced PLT. Archive of past years available: https://www.cs.uoregon.edu/research/summerschool/

## Supplementary (for engagement)

### Videos & Lecture Series

- **OPLSS Lecture Videos** — Lectures from top PL researchers on dependent types, program verification, effect systems, etc. Available on YouTube.

- **Simon Peyton Jones: "Escape from the ivory tower: the Haskell journey"** — Connecting PLT research to practical language design: https://www.youtube.com/watch?v=re96UgMk6GQ

- **Philip Wadler: "Propositions as Types"** — Accessible introduction to Curry-Howard correspondence: https://www.youtube.com/watch?v=IOiZatlZtGU

- **Lambda Calculus — Computerphile** — Accessible intro to lambda calculus fundamentals: https://www.youtube.com/watch?v=eis11j_iGMs

- **Type Systems — Computerphile series** — Multiple videos on type checking, inference, and safety.

- **Dan Grossman: Programming Languages Course (University of Washington)** — Full course on Coursera covering ML, Racket, and Ruby with PL concepts.

### Interactive Tools

- **Lambda Calculus Visualizer** — Step through reductions visually: http://www.lambdacalculator.com/

- **Stanford Lambda Calculus Interpreter** — Play with encodings and reductions: https://crypto.stanford.edu/~blynn/lambda/

- **Programming Languages Zoo** by Andrej Bauer — Miniature implementations of various PL concepts (type inference, effects, subtyping): https://plzoo.andrej.com/

- **PLT Redex** — Racket-based tool for semantic modeling and testing: https://redex.racket-lang.org/

- **Online Type Checker Playground** — Experiment with typing derivations (various implementations available)

- **Coq** — Proof assistant for certified programming: https://coq.inria.fr/

- **Agda** — Dependently typed programming language/proof assistant: https://agda.readthedocs.io/

- **Lean** — Modern proof assistant with strong community: https://leanprover.github.io/

### Code & Implementations

- **Write You a Haskell** by Stephen Diehl — Implement a Haskell-like language from scratch, including type inference: http://dev.stephendiehl.com/fun/

- **Type Systems Implementation Collection** by Tomprimozic — Minimal implementations of various type systems in OCaml: https://github.com/tomprimozic/type-systems

- **MiniKanren** — Relational programming language, useful for understanding unification: http://minikanren.org/

- **Software Foundations Code** — All exercises and proofs in Coq: https://softwarefoundations.cis.upenn.edu/

- **Lambda Calculus in Your Language** — Implementations in various languages for comparison

### Papers (Accessible & Foundational)

- **"The Next 700 Programming Languages"** by Peter Landin (1966) — Visionary paper on language design, highly readable.

- **"Theorems for Free!"** by Philip Wadler (1989) — How parametricity constrains polymorphic functions. Accessible and mind-blowing: https://people.mpi-sws.org/~dreyer/tor/papers/wadler.pdf

- **"Propositions as Types"** by Philip Wadler (2015) — Historical and accessible account of Curry-Howard: https://homepages.inf.ed.ac.uk/wadler/papers/propositions-as-types/propositions-as-types.pdf

- **"A Tutorial Implementation of a Dependently Typed Lambda Calculus"** by Andres Löh, Conor McBride, Wouter Swierstra — Implement dependent types in Haskell: https://www.andres-loeh.de/LambdaPi/

- **"Principal Type-Schemes for Functional Programs"** by Damas and Milner (1982) — The Hindley-Milner type inference algorithm.

## People (Researchers & Practitioners to Follow)

### Foundational Figures
- **Alonzo Church** — Invented lambda calculus (1930s)
- **Haskell Curry** — Curry-Howard correspondence, combinatory logic
- **Robin Milner** — ML, type inference, pi-calculus
- **John Reynolds** — Polymorphism, separation logic, parametricity

### Contemporary Researchers (Active in PLT)
- **Benjamin C. Pierce** (UPenn) — TAPL author, Software Foundations, dependent types
- **Robert Harper** (CMU) — PFPL author, modularity, type theory
- **Philip Wadler** (Edinburgh) — Haskell, monads, linear logic, theorems for free
- **Simon Peyton Jones** (Microsoft Research, Epic Games) — Haskell designer, practical PL design
- **Stephanie Weirich** (UPenn) — Dependent types in Haskell, GADTs
- **Matthias Felleisen** (Northeastern) — Racket, semantics, programming language design
- **Shriram Krishnamurthi** (Brown) — Pyret, programming languages education
- **Xavier Leroy** (Inria) — CompCert (verified C compiler), OCaml
- **Conor McBride** (Strathclyde) — Dependent types, Epigram, ornaments
- **Jeremy Siek** (Indiana) — Gradual typing, performance of typed languages
- **Nada Amin** (Harvard) — Type soundness, gradual typing, meta-programming
- **Ranjit Jhala** (UCSD) — Liquid types, refinement types

### Practitioners & Advocates
- **Dan Grossman** (University of Washington) — Excellent PL educator
- **Stephen Diehl** — "Write You a Haskell" and other practical PLT resources
- **Andrej Bauer** — PL Zoo creator, excellent blog on type theory and computability
- **Niko Matsakis** (Rust team) — Designing PL features informed by PLT

## Tools for Exploration

### Languages for Experimentation
- **Haskell** — Polymorphism, type classes, laziness: https://www.haskell.org/
- **OCaml** — ML-style type inference, modules: https://ocaml.org/
- **Rust** — Affine types (borrow checker), zero-cost abstractions: https://www.rust-lang.org/
- **Agda** — Dependent types, proof assistant: https://agda.readthedocs.io/
- **Idris** — Dependent types with a focus on practical programming: https://www.idris-lang.org/
- **Racket** — Language-oriented programming, macros: https://racket-lang.org/
- **Standard ML** — Clean ML implementation: https://www.smlnj.org/
- **Eff** — Algebraic effects and handlers: https://www.eff-lang.org/

### Development Tools
- **Coq, Agda, Lean** — Proof assistants for certified programming
- **PLT Redex** — Semantic modeling and testing
- **Rosette** — Solver-aided programming language for verification
- **K Framework** — Rewrite-based semantic framework

### Playgrounds & Online REPLs
- **Try Haskell** — Learn Haskell in browser: https://tryhaskell.org/
- **OCaml Playground** — Try OCaml online: https://ocaml.org/play
- **Idris Online REPL** — Experiment with dependent types
- **Lambda Calculus Interpreters** — Various browser-based implementations

## Unexpected Connections (Rabbit Holes)

### PLT and Quantum Computing
Linear types (values used exactly once) model quantum states, which can't be cloned due to the no-cloning theorem. Quipper and other quantum languages use linear types to enforce quantum mechanics constraints.

### PLT and Category Theory
Category theory provides the mathematical foundation for many PLT concepts: monads (from category theory) model effects, functors model type constructors, and natural transformations model polymorphic functions. Haskell's core abstractions come directly from category theory.

### PLT and Biology
The pi-calculus (a process calculus related to lambda calculus) is used to model biochemical pathways and protein interactions. Type systems for processes ensure biological safety properties.

### PLT and Game Semantics
Game semantics interprets types as games and programs as strategies. It provides a fully abstract model for programming languages and reveals deep connections between computation and logic.

### PLT and Computational Complexity
Linear logic (the logic behind linear types) reveals connections between proof structure and computational complexity. Bounded linear logic corresponds to polynomial time computation.

### PLT and Natural Language
Montague grammar applies type theory to natural language semantics. Lambda calculus models the compositional meaning of sentences. This is the foundation of computational semantics.

### PLT and Cognitive Science
The Sapir-Whorf hypothesis (language shapes thought) has a PLT analog: the Blub paradox. The languages you know shape the solutions you can imagine. Learning PLT expands your "computational vocabulary."

### PLT and Music
Lambda calculus can encode musical structures. The Euterpea library in Haskell uses type classes and algebraic data types to model music composition. Paul Hudak (Yale) pioneered this connection.

## Learning Paths by Interest

### For Mathematicians
Focus on: lambda calculus, type theory, Curry-Howard, dependent types. Read PFPL and work through Software Foundations. Explore proof assistants (Coq, Agda, Lean).

### For Engineers
Focus on: type systems in real languages, type inference implementation, operational semantics. Read TAPL, implement type checkers, study Rust's borrow checker and Haskell's type system.

### For Language Designers
Focus on: type features (polymorphism, subtyping, effects), operational semantics, real-world case studies. Read PFPL, study language design trade-offs, explore Racket for language-oriented programming.

### For Verification Enthusiasts
Focus on: Curry-Howard, proof assistants, certified programming, effect systems. Work through Software Foundations, explore CompCert (verified C compiler), study liquid types and refinement types.

## Conferences & Communities

### Premier Conferences
- **POPL** (Principles of Programming Languages) — Top-tier theory
- **PLDI** (Programming Language Design and Implementation) — Bridges theory and practice
- **ICFP** (International Conference on Functional Programming) — Functional PL research
- **OOPSLA** (Object-Oriented Programming, Systems, Languages, and Applications) — Broader PL topics
- **ESOP** (European Symposium on Programming) — European PL theory

### Online Communities
- **r/ProgrammingLanguages** (Reddit) — Discussions on PL design and theory
- **Lambda the Ultimate** (blog) — PL research news and discussion
- **Haskell/OCaml/Rust communities** — Active discussions of type system features
- **PLT Café** (Matthias Felleisen's blog) — Insights on PL education and research

### Workshops & Summer Schools
- **OPLSS** (Oregon Programming Languages Summer School) — Annual summer school
- **PLMW** (Programming Languages Mentoring Workshop) — Mentoring for newcomers to PL research
- **DeepSpec Summer School** — Verified software
- **Marktoberdorf Summer School** — Logic and language theory

## Further Reading (After Completing This Curriculum)

### Advanced Topics
- **Advanced Topics in Types and Programming Languages** edited by Benjamin Pierce — Compilation of advanced topics (GADTs, substructural types, etc.)
- **Certified Programming with Dependent Types** by Adam Chlipala — Deep dive into Coq and dependent types: http://adam.chlipala.net/cpdt/
- **Type Theory and Formal Proof** by Nederpelt and Geuvers — Rigorous foundations of type theory

### Specific Advanced Topics
- **Gradual Typing** — Blending static and dynamic typing
- **Effect Systems** — Algebraic effects, effect handlers, row polymorphism
- **Refinement Types** — Liquid types, dependent-like verification without full dependent types
- **Session Types** — Enforcing communication protocols
- **Linear/Affine Types** — Resource management, Rust's borrow checker
- **Bidirectional Type Checking** — Modern approach to type inference with local annotations

### Historical Context
- **"On Computable Numbers"** by Alan Turing — The Turing machine, for contrast with lambda calculus
- **"A Formulation of the Simple Theory of Types"** by Alonzo Church — Origins of type theory
- **"The Mechanical Evaluation of Expressions"** by Peter Landin — SECD machine, operational semantics foundations
