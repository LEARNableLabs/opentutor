# Compiler Design — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 11 lessons (35%)
- **Socratic questions** — 7 lessons (23%)
- **review and consolidation sessions** — 6 lessons (19%)
- **real-world application challenges** — 5 lessons (16%)
- **teach-back exercises (student explains)** — 2 lessons (6%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 42% accessible (1-2), 35% standard (3), 23% challenging (4-5).

Difficulty peaks:
- Day 9: "How does bottom-up parsing reverse-engineer the parse tree?" (difficulty 4)
- Day 10: "What makes LR parsing more powerful than LL?" (difficulty 4)
- Day 20: "How does SSA form make optimization easier?" (difficulty 4)
- Day 23: "Why is register allocation NP-complete but still fast?" (difficulty 4)
- Day 25: "How do you turn an LLVM backend into machine code?" (difficulty 4)

## Domain Hooks
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
   

## Common Failure Modes
1. **"Compilers are just translators between languages"**
   - **Why students think this**: The term "compile" suggests direct translation, like human language translation.
   - **The reality**: Compilers transform code through multiple intermediate representations, each serving different analysis and optimization purposes. It's more like sculpting — you refine the shape through many passes.
   - **How to correct**: Show the multi-stage pipeline. Emphasize that source → IR → machine code involves semantic analysis and optimization, not just syntax-to-syntax mapping.

2. **"Lexing and parsing are the same thing"**
   - **Why students think this**: Both deal with reading source code and breaking it into pieces.
   - **The reality**: Lexing handles regular structure (tokens), parsing handles recursive structure (syntax trees). Different computational models (finite automata vs pushdown automata).
   - **How to correct**: Show a grammar that can't be lexed (nested comments), and a token pa

## Vocabulary
Key terms for this domain: compilation vs interpretation, ahead-of-time vs JIT, compiler pipeline overview, lexical analysis, parsing, semantic analysis, code generation, optimization, tokens, lexemes, pattern matching, regular expressions, finite automata, DFA vs NFA, limitations of regular languages (and 92 more).