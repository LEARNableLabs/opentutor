# Compiler Design — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Compilers: Principles, Techniques, and Tools (2nd Edition)** by Aho, Lam, Sethi, and Ullman
  - The classic "Dragon Book" — comprehensive coverage of all compiler phases
  - 2nd edition (2006) includes modern topics: instruction-level parallelism, interprocedural analysis
  - Best for: deep theoretical understanding, reference material
  - [Official site](https://suif.stanford.edu/dragonbook/)
  - [Wikipedia overview](https://en.wikipedia.org/wiki/Compilers:_Principles,_Techniques,_and_Tools)

- **Engineering a Compiler** by Cooper and Torczon
  - Modern alternative to Dragon Book with more practical focus
  - Strong emphasis on optimization techniques and real-world trade-offs
  - Best for: intermediate students who want hands-on engineering perspective

### University Courses

- **Stanford CS143: Compilers** (Alex Aiken)
  - Complete course covering lexical analysis, parsing, semantic analysis, code generation, optimization
  - Programming assignments: build a compiler for COOL (Class-Object-Oriented-Language)
  - Self-paced online version available
  - [Course website](https://web.stanford.edu/class/cs143/)
  - [edX online course](https://www.edx.org/learn/computer-science/stanford-university-compilers)
  - [Lecture slides](https://web.stanford.edu/class/cs143/lectures/lecture01.pdf)
  - [Course materials on GitHub](https://github.com/PKUFlyingPig/CS143-compiler)

- **Stanford CS243: Advanced Compilers**
  - Advanced topics: interprocedural analysis, optimization for parallelism and locality
  - Best for: after completing CS143 or equivalent
  - [Lecture notes](https://suif.stanford.edu/~courses/cs243/)

## Hands-On Tools & Frameworks

### LLVM Ecosystem

- **LLVM Tutorial: "My First Language Frontend"**
  - Official tutorial for building a simple language with LLVM
  - Covers lexer, parser, AST, code generation (static and JIT)
  - Less than 1000 lines of code for complete compiler
  - Best for: learning by doing, understanding modern compiler architecture
  - [Official tutorial](https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/index.html)

- **How to Learn Compilers: LLVM Edition**
  - Comprehensive guide to learning compilers through LLVM
  - Curated resources, practical advice, project ideas
  - [Guide](https://lowlevelbits.org/how-to-learn-compilers-llvm-edition/)

- **llvm-tutor**
  - Collection of LLVM plugins (passes) for learning
  - Analyze and transform programs in LLVM IR
  - [Project page](https://compiler-research.org/tutorials/)

### Compiler Explorer (Godbolt)

- Interactive tool to see how different compilers optimize code
- Supports many languages (C, C++, Rust, Go, etc.) and compilers (GCC, Clang, MSVC)
- Essential for understanding code generation and optimization in practice
- Not directly searched but fundamental tool: https://godbolt.org/

### Parser/Lexer Generators

- **Flex** (lexer generator) and **Bison** (parser generator)
  - Industry-standard tools for C/C++
  - Learn by using: great for understanding automata and parsing tables

## Video Lectures

### Free Courses

- **Stanford Compilers** (Alex Aiken on edX)
  - Full video lecture series matching CS143 course
  - [edX course](https://www.edx.org/learn/computer-science/stanford-university-compilers)
  - [Stanford Online](https://online.stanford.edu/courses/soe-ycscs1-compilers)

- **LLVM Tutorials from Compiler Research**
  - Video tutorials on LLVM basics, JIT infrastructure, incremental compilation
  - [Tutorials](https://compiler-research.org/tutorials/)

- **IIT Delhi: Compiler Design and Optimizations** by Sorav Bansal
  - Strong theoretical foundation with practical examples
  - Highly recommended by the community

### Paid Courses

- **Programming Language with LLVM** (Udemy)
  - Full video course with source code
  - 20 lectures divided into four parts
  - [Udemy course](https://www.udemy.com/course/programming-language-with-llvm/)

- **Learn LLVM IR in Action** (Udemy)
  - Practical hands-on course for writing your own compiler
  - [Udemy course](https://www.udemy.com/course/learn-llvm-ir-in-action/)

- **Compiler Design with LLVM** (Johns Hopkins University)
  - Build a complete compiler for a C++ subset
  - [Hopkins EP course](https://ep.jhu.edu/courses/605615-compiler-design-with-llvm/)

## Interactive Learning

- **CMU LLVM Tutorial**
  - Tutorial materials from Carnegie Mellon
  - [PDF slides](https://www.cs.cmu.edu/afs/cs/academic/class/15745-s12/public/lectures/L3-LLVM-Part1.pdf)

- **xeus-cling**
  - Jupyter kernel for C++ using cling interpreter
  - Enables interactive compiler exploration
  - Great for experimenting with LLVM APIs

## Code & Repositories

- **PKUFlyingPig/CS143-compiler**
  - Learning materials for Stanford CS143
  - Includes solutions and notes
  - [GitHub repo](https://github.com/PKUFlyingPig/CS143-compiler)

- **LLVM: Implementing a Language**
  - GitBook with step-by-step guide
  - [GitBook](https://landersbenjamin.gitbooks.io/llvm-implementing-a-language/content/)

## People to Follow

### Researchers & Educators

- **Alex Aiken** — Stanford, created CS143 course, expert in program analysis
- **Keith Cooper** — Rice, co-author of "Engineering a Compiler"
- **Chris Lattner** — created LLVM and Swift, now working on Mojo
- **Sorav Bansal** — IIT Delhi, excellent lecturer on compilers and optimization

### Community

- **LLVM Developer Meetings** — annual conferences with tutorials and talks
- **Compiler research community** on Twitter/Mastodon
- **r/Compilers** on Reddit — active community for questions and discussions

## Unexpected Cross-Discipline Connections

### Program Synthesis & AI

- **Superoptimization** — using search and SMT solvers to find optimal instruction sequences
- **ML-guided optimization** — neural networks learning optimization heuristics
- Connection: compilers as program synthesis, generative models for code

### Type Theory & Logic

- **Curry-Howard correspondence** — types as propositions, programs as proofs
- **Dependent types** — types that depend on values (Coq, Agda, Idris)
- Connection: type checking as theorem proving, compiler correctness via proofs

### Security & Verification

- **Trusting Trust attack** — Ken Thompson's compiler backdoor
- **Formal verification of compilers** — CompCert, a verified C compiler
- Connection: compiler bugs as security vulnerabilities, correctness guarantees

### Programming Languages

- **Language design decisions driven by compilation** — stack-based vs register-based VMs, GC design, closure implementation
- **DSL compilation** — domain-specific languages compiled to general-purpose targets
- Connection: compilers enable language innovation

### Hardware Architecture

- **Co-design of compilers and processors** — VLIW, RISC-V, domain-specific accelerators
- **Just-in-time compilation in CPUs** — microcode, dynamic optimization
- Connection: compiler optimizations match hardware capabilities

### Software Engineering

- **Build systems as meta-compilers** — Make, Ninja, Bazel orchestrating compilation
- **Compiler as a platform** — language servers (LSP), IDE integration, linting
- Connection: compilers as development tools, not just batch processors

## Recommended Learning Path

### Phase 1: Foundations (Weeks 1-2)
- Read Dragon Book chapters 1-2 or watch first Stanford lectures
- Set up LLVM and work through "My First Language Frontend" tutorial
- Play with Compiler Explorer

### Phase 2: Front-End (Weeks 3-5)
- Lexical analysis: implement a lexer (hand-coded or Flex)
- Syntax analysis: implement a parser (recursive descent or Bison)
- Read Dragon Book chapters 3-4 or Stanford CS143 parsing lectures

### Phase 3: Middle-End (Weeks 6-8)
- Semantic analysis: implement type checking and symbol tables
- IR generation: generate LLVM IR or three-address code
- Read Dragon Book chapters 5-6

### Phase 4: Back-End (Weeks 9-11)
- Code generation: implement instruction selection
- Register allocation: implement graph coloring or linear scan
- Read Dragon Book chapters 8-9

### Phase 5: Optimization (Weeks 12-14)
- Dataflow analysis: implement reaching definitions or liveness
- Optimization passes: implement constant folding, dead code elimination
- Read Dragon Book chapters 9-10 or Stanford CS243 lectures

### Phase 6: Integration (Week 15)
- Build end-to-end compiler for a small language
- Compare your compiler output with GCC/Clang on Compiler Explorer
- Write test suite and documentation
