# Compiler Design — Teaching Notes

## Approach

Compiler design is best learned by **building**, not just reading. At the intermediate level, students should implement at least a simple compiler end-to-end. The pedagogy balances theory (grammars, automata, dataflow equations) with engineering practice (handling real languages, debugging generated code). The key is to demystify compilers early — they're not magic, just sophisticated pattern matchers and tree transformers. Build intuition with concrete examples before diving into formal algorithms. Use visualization heavily: draw automata, parse trees, CFGs, dataflow graphs.

## Common Misconceptions

1. **"Compilers are just translators between languages"**
   - **Why students think this**: The term "compile" suggests direct translation, like human language translation.
   - **The reality**: Compilers transform code through multiple intermediate representations, each serving different analysis and optimization purposes. It's more like sculpting — you refine the shape through many passes.
   - **How to correct**: Show the multi-stage pipeline. Emphasize that source → IR → machine code involves semantic analysis and optimization, not just syntax-to-syntax mapping.

2. **"Lexing and parsing are the same thing"**
   - **Why students think this**: Both deal with reading source code and breaking it into pieces.
   - **The reality**: Lexing handles regular structure (tokens), parsing handles recursive structure (syntax trees). Different computational models (finite automata vs pushdown automata).
   - **How to correct**: Show a grammar that can't be lexed (nested comments), and a token pattern that doesn't need parsing (keywords). Emphasize: lexing = words, parsing = sentences.

3. **"Optimization always makes code faster"**
   - **Why students think this**: "Optimization" sounds like pure improvement.
   - **The reality**: Optimizations trade off different metrics (speed vs size vs energy vs compile time). Some "optimizations" hurt performance on modern hardware (e.g., unrolling too much blows the instruction cache).
   - **How to correct**: Show examples where -O3 is slower than -O2. Discuss optimization levels and profiling-guided optimization.

4. **"You can parse any language with regular expressions"**
   - **Why students think this**: Modern regex libraries (PCRE, Python re) are very powerful and seem to handle complex patterns.
   - **The reality**: Regular expressions (the formal model) can't handle nested structures. Modern regex libraries add features beyond the formal model (backreferences, recursion), but you still can't parse a full programming language.
   - **How to correct**: Show the classic example of matching balanced parentheses. Prove it using the pumping lemma, then show how a CFG handles it trivially.

5. **"Type checking happens at runtime"**
   - **Why students think this**: They've seen runtime type errors in Python/JavaScript.
   - **The reality**: Static type checking happens at compile time. Runtime type checks in dynamic languages are a different mechanism.
   - **How to correct**: Compare compiled C++ (static checking, no runtime types) with Python (dynamic checking, runtime type objects). Emphasize: compilers check types *before* execution.

6. **"LL parsing is always better because it's simpler"**
   - **Why students think this**: Recursive descent is easy to hand-code and understand.
   - **The reality**: LL(k) is strictly less powerful than LR(k). Many practical grammars (like expression grammars with multiple precedence levels) are LR but not LL.
   - **How to correct**: Show a left-recursive grammar (like `E → E + T`) that LL can't handle. Explain why parser generators use LR.

7. **"SSA form is just renaming variables"**
   - **Why students think this**: The transformation looks like it's just adding subscripts to variable names.
   - **The reality**: SSA fundamentally changes the program's semantic structure. Phi functions represent control flow merging. This enables simple, powerful optimizations.
   - **How to correct**: Show how constant propagation becomes trivial in SSA (just follow def-use chains), but requires fixed-point iteration without SSA.

8. **"Register allocation is solved by graph coloring"**
   - **Why students think this**: The interference graph → coloring reduction is elegant and taught prominently.
   - **The reality**: Graph coloring is NP-complete. Real register allocators use heuristics (Chaitin's algorithm with spilling) or linear scan. Modern allocators integrate with instruction scheduling.
   - **How to correct**: Show the complexity. Discuss practical algorithms (linear scan for JITs, iterated register coalescing for AOT compilers).

9. **"Dataflow analysis computes exact values"**
   - **Why students think this**: The lattice-theoretic framework looks mathematically precise.
   - **The reality**: Dataflow analysis computes *conservative approximations*. Undecidability (Rice's theorem) means you can't compute exact answers for interesting properties.
   - **How to correct**: Show an example where analysis must be conservative (aliasing, array indices). Emphasize soundness over completeness.

10. **"Compilers understand what your code does"**
    - **Why students think this**: Compilers seem intelligent when they optimize code or report semantic errors.
    - **The reality**: Compilers are mechanical symbol manipulators. They pattern-match and apply rewrite rules. "Understanding" is an illusion.
    - **How to correct**: Show a nonsensical but syntactically valid program that compiles fine. Emphasize the limits of static analysis.

## Level Adjustments

### For Intermediate Students

**Assume**: Students know data structures (trees, graphs, hash tables), basic algorithms (DFS, BFS), discrete math (induction, graphs), and have written non-trivial programs.

**Emphasize**:
- End-to-end implementation of a small compiler
- Hands-on work with tools (Flex/Bison or hand-coded parsers, LLVM)
- Understanding the "why" of design choices (why LR? why SSA? why dataflow?)
- Reading real compiler IR (LLVM IR, three-address code)
- Standard algorithms (recursive descent, LR parsing, graph coloring, dataflow equations)

**De-emphasize** (save for advanced level):
- Deep theoretical foundations (pumping lemmas, undecidability proofs)
- Advanced optimizations (polyhedral optimization, whole-program analysis)
- Very low-level details (instruction encoding, ABI details)
- Exotic parsing techniques (Earley, GLL, PEG)

**Depth of formalism**: Use formal definitions where they clarify (CFGs, dataflow lattices), but don't require proofs. Intuition + algorithm + implementation is the goal.

### Comparison to Other Levels

- **Beginner**: Would need more hand-holding on prerequisites (automata, grammars), simpler language to compile (no types, no optimization), more scaffolding code.
- **Advanced**: Would include advanced optimizations (SSA construction algorithms, polyhedral optimization, interprocedural analysis), deeper theory (decidability, complexity), and modern research topics (superoptimization, JIT compilation, ML-guided optimization).

## Rabbit Holes

These are fascinating tangents to drop in when appropriate:

1. **"Compilers that compile themselves"** (bootstrapping)
   - When to use: After discussing code generation. Blow their minds with the concept of a C compiler written in C.
   - Connection: Trusting Trust attack, reflective systems, language evolution.

2. **"The halting problem and compiler optimization"**
   - When to use: When introducing dataflow analysis or optimization. Explain why perfect optimization is impossible.
   - Connection: Rice's theorem, undecidability, conservative approximation.

3. **"How does Compiler Explorer work?"** (Godbolt)
   - When to use: When discussing code generation or optimization. Show how different compilers optimize the same code differently.
   - Connection: Compiler flags, backend differences, optimization heuristics.

4. **"JIT compilation in JavaScript engines"**
   - When to use: After covering traditional AOT compilation. Contrast with modern JIT strategies (V8, SpiderMonkey).
   - Connection: Dynamic languages, speculative optimization, deoptimization, tiered compilation.

5. **"Superoptimization and stochastic search"**
   - When to use: After covering traditional optimization. Show how machine learning and search can find optimal code sequences.
   - Connection: Program synthesis, SMT solvers, AI in compilers.

6. **"WebAssembly as a compilation target"**
   - When to use: When discussing IR or code generation. Show how Wasm is designed as a portable compilation target.
   - Connection: Virtual ISAs, sandboxing, language interop.

7. **"The Rust borrow checker as a static analysis"**
   - When to use: When discussing semantic analysis or advanced type systems. Show how ownership/borrowing is a compile-time analysis.
   - Connection: Linear types, region-based memory management, effect systems.

8. **"Underhanded C and compiler hardening"**
   - When to use: When discussing semantic analysis or security. Show how compilers can introduce or eliminate security vulnerabilities.
   - Connection: Undefined behavior, Trusting Trust, compiler correctness.

## Difficulty Progression Notes

- **Lessons 1-5**: Foundation and lexical analysis (difficulty 1-3). Gentle intro, build confidence with familiar concepts (regex, automata).
- **Lessons 6-9**: Parsing theory (difficulty 2-4). First peak difficulty with LR parsing — this is conceptually hard. Provide extra support.
- **Lesson 10**: Review (difficulty 2). Consolidate parsing knowledge before moving to semantics.
- **Lessons 11-14**: Semantic analysis (difficulty 2-3). Easier than parsing, students often find this intuitive.
- **Lessons 15-18**: Intermediate representations (difficulty 2-4). Second peak with SSA form — abstract but crucial.
- **Lesson 19**: Review (difficulty 2). Consolidate IR knowledge before code generation.
- **Lessons 20-23**: Code generation (difficulty 3-4). Third peak with register allocation — graph algorithms are hard.
- **Lessons 24-27**: Optimization (difficulty 2-4). Fourth peak with dataflow analysis — mathematical and abstract.
- **Lesson 28**: Final review (difficulty 2). Synthesize everything, build confidence for final project.

**Pattern**: Alternate hard conceptual lessons with hands-on practice and reviews. Don't stack multiple difficulty-4 lessons consecutively.

## Assessment Strategies

### Formative (during learning)
- **Code reading**: Give students LLVM IR or three-address code and ask them to explain what it does.
- **Debugging**: Provide broken lexers/parsers and ask students to fix them.
- **Trace execution**: Walk through parsing/optimization algorithms step-by-step.
- **Design questions**: "How would you extend the language to support X?" (e.g., closures, exceptions).

### Summative (final assessment)
- **Build a compiler**: Implement a complete compiler for a simple language (arithmetic + variables + conditionals + loops).
- **Implement an optimization**: Add a new optimization pass to an existing compiler framework (e.g., LLVM pass).
- **Analyze real compilers**: Compare how GCC, Clang, and Rust compile the same source code differently.

### Red flags (student is struggling)
- Can't draw a parse tree for a simple grammar
- Confuses tokens with AST nodes
- Can't explain what an optimization does or when it's safe
- Doesn't understand the difference between IR and machine code

### Green flags (student is excelling)
- Asks about advanced topics (JIT, type inference, whole-program optimization)
- Implements optimizations not covered in lessons
- Debugs generated code by reading assembly
- Connects compiler concepts to language design choices
