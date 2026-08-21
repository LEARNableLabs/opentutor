# Compiler Design — Research Summary

## Major Subtopics

1. **Lexical Analysis** — tokenization, regular expressions, finite automata, scanner generators
2. **Syntax Analysis (Parsing)** — context-free grammars, top-down vs. bottom-up parsing, LR parsing, parser generators
3. **Semantic Analysis** — type checking, symbol tables, scope resolution, semantic actions
4. **Intermediate Representations** — abstract syntax trees, three-address code, SSA form, control flow graphs
5. **Code Generation** — instruction selection, register allocation, instruction scheduling
6. **Optimization** — dataflow analysis, constant propagation, dead code elimination, loop optimizations, interprocedural analysis
7. **Runtime Systems** — memory management, linking, loading, debugging support

## Key Educational Resources

### University Courses

- **Stanford CS143: Compilers** — comprehensive course covering full compiler pipeline from lexical analysis through optimization. Includes hands-on projects building a compiler for COOL (Class-Object-Oriented-Language). Lecture slides and assignments available online.
  - https://web.stanford.edu/class/cs143/
  - https://www.edx.org/learn/computer-science/stanford-university-compilers (online self-paced version)

- **Stanford CS243: Advanced Compilers** — covers advanced topics like instruction-level parallelism, interprocedural analysis, and optimization techniques
  - https://suif.stanford.edu/~courses/cs243/

### Textbooks

- **"Compilers: Principles, Techniques, and Tools" (The Dragon Book)** by Aho, Lam, Sethi, and Ullman (2nd Edition, 2006)
  - The classic reference, comprehensive coverage
  - Known as "purple dragon" for 2nd edition
  - New chapters on instruction-level parallelism, optimizing for parallelism and locality, interprocedural analysis
  - https://suif.stanford.edu/dragonbook/

- **"Engineering a Compiler"** by Cooper and Torczon
  - More modern alternative, praised for practical approach
  - Strong emphasis on optimization techniques

### LLVM Resources

- **Official LLVM Tutorial** — "My First Language Frontend with LLVM" walks through building a simple language compiler with <1000 lines of code, covering lexer, parser, AST, and code generation (both static and JIT)
  - https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/index.html

- **LLVM Deep Dive** — comprehensive guide on learning compilers through LLVM
  - https://lowlevelbits.org/how-to-learn-compilers-llvm-edition/

- **Johns Hopkins Course** — Compiler Design with LLVM, building complete compiler for C++ subset
  - https://ep.jhu.edu/courses/605615-compiler-design-with-llvm/

### Video Lectures

- **Stanford Compilers** (online course by Alex Aiken) — available on edX and Stanford Online
- **LLVM Developer Meeting Tutorials** — "Introduction to LLVM" by Eric Christopher and Johannes Doerfert
- **Udemy courses** — "Programming Language with LLVM", "Learn LLVM IR in Action"
- **IIT Delhi** — "Compiler Design and Optimizations" by Sorav Bansal

### Interactive Tools & Playgrounds

- **Compiler Explorer (Godbolt)** — see how different compilers optimize code (not directly searched but fundamental tool)
- **llvm-tutor** — LLVM plugins for analyzing and transforming programs in LLVM IR
- **xeus-cling** — Jupyter kernel for C++ using cling interpreter, enables interactive exploration

### Notable Resources

- GitHub repos with course materials: PKUFlyingPig/CS143-compiler
- "Implementing a Language with LLVM" GitBook resources
- CMU LLVM tutorial materials

## Research Gaps

- Need to supplement with practical modern compiler construction (Rust/Go compiler architecture)
- WebAssembly as compilation target is a modern topic worth exploring
- JIT compilation techniques (beyond basic LLVM JIT intro)
