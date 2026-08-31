# Cellular automata and Conway's Game of Life — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 8 lessons (32%)
- **Socratic questions** — 6 lessons (24%)
- **real-world application challenges** — 5 lessons (20%)
- **review and consolidation sessions** — 3 lessons (12%)
- **teach-back exercises (student explains)** — 2 lessons (8%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 48% accessible (1-2), 28% standard (3), 24% challenging (4-5).

Difficulty peaks:
- Day 14: "Can patterns create other patterns?" (difficulty 4)
- Day 16: "What is the methuselah problem?" (difficulty 4)
- Day 17: "Can you build a pattern that travels while creating?" (difficulty 4)
- Day 20: "Can Life compute anything?" (difficulty 4)
- Day 21: "How do you build logic gates in Life?" (difficulty 5)

## Domain Hooks
- **Hashlife algorithm** — a clever algorithm that exploits pattern repetition to simulate Life exponentially faster. Drop this in around lesson 18 when students appreciate the computational challenge of large patterns.

- **Garden of Eden patterns** — patterns with no predecessor. Philosophically fascinating (states that can never be reached through evolution, only set as initial conditions). Mention around lesson 16-17.

- **Conway's proof of undecidability** — there's no algorithm to determine if an arbitrary pattern will eventually die out. Links to halting problem. Introduce with Turing completeness (lesson 20-21).

- **Self-replicating patterns** — patterns that create copies of themselves. Von Neumann's original motivation for CA. Mention around lesson 22 with computational universality.

- **Rule 110** — a 1D elementary CA that's also Turing-complete, despite being far simpler than Life. Great comparison point for universality discussion (lesson 20-23).

- **Langton's Ant** — a

## Common Failure Modes
1. **"Cellular automata are just random simulations"** — Students often see chaotic patterns and assume randomness. Emphasize determinism: same initial state always produces same evolution. Chaos comes from sensitivity to initial conditions, not randomness in rules.

2. **"The grid must be infinite"** — Many implementations use finite grids with boundary conditions (wraparound, fixed, etc.). Discuss how boundary conditions affect behavior and why mathematical analysis often assumes infinite grids.

3. **"Complex patterns require complex rules"** — This is the opposite of emergence. Students expect intricate behavior to come from intricate rules. Show Rule 30, Game of Life — simple rules, complex behavior. This is the central insight.

4. **"You can always predict what will happen"** — Computational irreducibility means some patterns must be simulated to know their fate — no shortcut. Students used to closed-form solutions need to accept this limitation.

5. **"Turing completeness makes

## Vocabulary
Key terms for this domain: cellular automata, discrete models, state transitions, neighborhoods, Moore neighborhood, von Neumann neighborhood, local rules, elementary CA, Wolfram rules, rule numbering, Wolfram classification, classes I-IV, complexity emergence, implementation, grid representation (and 80 more).