# Compiler Design — Concept Map

## Core Concepts (in learning order)

1. **Compilation pipeline** — the phases a compiler goes through from source to machine code
2. **Lexical analysis** — breaking source text into tokens using regular expressions and finite automata
3. **Tokens and lexemes** — the atomic units of syntax. Depends on: compilation pipeline
4. **Regular expressions and finite automata** — pattern matching for tokenization. Depends on: tokens and lexemes
5. **Context-free grammars** — formal specification of programming language syntax
6. **Derivations and parse trees** — how grammars generate valid programs. Depends on: context-free grammars
7. **Top-down parsing** — building parse trees from the root down (LL parsing). Depends on: derivations and parse trees
8. **Bottom-up parsing** — building parse trees from leaves up (LR parsing). Depends on: derivations and parse trees
9. **Semantic analysis** — checking meaning beyond syntax (types, scopes, etc.)
10. **Symbol tables** — tracking declarations and their properties. Depends on: semantic analysis
11. **Type systems** — rules for assigning and checking types. Depends on: symbol tables
12. **Scope and environments** — name resolution in nested contexts. Depends on: symbol tables
13. **Intermediate representations** — abstract forms between source and machine code
14. **Abstract syntax trees** — tree structure capturing program semantics. Depends on: intermediate representations
15. **Three-address code** — linear IR with simple operations. Depends on: intermediate representations
16. **Control flow graphs** — graph representation of program execution paths. Depends on: three-address code
17. **Static single assignment (SSA)** — IR where each variable is assigned exactly once. Depends on: control flow graphs
18. **Basic blocks** — maximal sequences of straight-line code. Depends on: control flow graphs
19. **Instruction selection** — mapping IR to target machine instructions. Depends on: intermediate representations
20. **Register allocation** — assigning variables to machine registers. Depends on: instruction selection
21. **Dataflow analysis** — computing facts about program values. Depends on: control flow graphs
22. **Optimization passes** — transformations that improve code quality. Depends on: dataflow analysis
23. **Local optimizations** — improvements within basic blocks. Depends on: optimization passes
24. **Loop optimizations** — specialized transformations for loops. Depends on: optimization passes

## Dependencies

### Lexical → Syntax
- **Parsing requires tokenization** — the parser consumes tokens produced by the lexer. You can't build a parse tree without first identifying the words.

### Syntax → Semantic
- **Semantic analysis operates on parse trees or ASTs** — type checking and scope resolution need the syntactic structure to know what to analyze.
- **Symbol tables are built during parsing** — as declarations are recognized syntactically, they're recorded semantically.

### Semantic → IR
- **Type information guides IR generation** — knowing types determines how to represent operations (int add vs float add).
- **Scopes map to activation records** — the semantic structure of nested scopes becomes the runtime structure of stack frames.

### IR → Code Generation
- **Instruction selection works on IR** — you select machine instructions by pattern-matching on IR constructs.
- **Register allocation needs liveness information** — dataflow analysis on the IR tells you when variables are live, which drives register assignment.

### IR → Optimization
- **Most optimizations work on IR, not source or machine code** — IR is the sweet spot: abstract enough to be portable, concrete enough to reason about performance.
- **SSA form simplifies optimization** — the single-assignment property makes many analyses and transformations easier to implement correctly.

### Critical Dependencies
- **CFGs are fundamental** — control flow graphs are used by nearly all advanced phases: register allocation, dataflow analysis, optimization, scheduling.
- **Dataflow analysis enables optimization** — you can't safely optimize without knowing what values flow where.
- **Type systems enable early error detection** — catching type errors at compile time prevents runtime failures.

## Bottleneck Concepts

These concepts are prerequisites for many later topics:

1. **Context-free grammars** — unlocks all of parsing theory
2. **Control flow graphs** — unlocks optimization, analysis, code generation
3. **SSA form** — the modern foundation for optimization
4. **Dataflow analysis** — the mathematical foundation for reasoning about program behavior

## Mind-Blowing Moments

1. **Parsing is just graph traversal** — once you see LR parsing as traversing the viable prefix DFA, it clicks
2. **Register allocation is graph coloring** — the "aha!" when you realize live ranges form an interference graph
3. **SSA makes optimizations trivial** — constant propagation becomes almost embarrassingly simple in SSA
4. **Compilers don't understand code** — they're just mechanical pattern matchers and tree transformers
5. **Most optimizations are undecidable in general** — but work well enough in practice with heuristics

## Common Misconceptions

1. **"Compilers translate code"** — they don't translate; they transform through multiple representations
2. **"Optimized code is always faster"** — not if you optimize for size, or if you blow the instruction cache
3. **"Regular expressions can parse any language"** — no, they're strictly less powerful than CFGs
4. **"LL parsing is easier than LR"** — easier to hand-code, but less powerful; LR handles more grammars
5. **"You need to understand assembly to write compilers"** — helps, but modern compilers work at the IR level
6. **"Compilers just pattern-match and substitute"** — oversimplified; semantic analysis and optimization require deep reasoning
7. **"Static analysis can prove program correctness"** — no, Rice's theorem says most properties are undecidable

## Prerequisite Topics

- **Automata theory** — needed for lexical analysis (DFA, NFA, regular expressions)
- **Formal languages** — needed for syntax analysis (CFGs, derivations, parse trees)
- **Graph theory** — needed for CFGs, register allocation, dataflow analysis
- **Data structures** — needed for symbol tables, ASTs, parse tables
- **Algorithms** — needed for graph algorithms (traversal, coloring), dynamic programming (parsing)
- **Computer architecture** — needed for understanding code generation, register sets, instruction sets
- **Operating systems** — needed for understanding runtime systems, linking, loading

## Cross-Domain Connections

- **Programming languages** — compilers implement language semantics
- **Algorithms** — parsing algorithms, graph algorithms, optimization algorithms
- **Formal methods** — type theory, program analysis, verification
- **Architecture** — instruction sets, pipelines, memory hierarchies
- **Software engineering** — modularity, testing, debugging of compilers themselves
