# Cellular Automata — Concept Map

## Core Concepts (in learning order)

1. **Cellular Automata** — discrete computational models on regular grids with local update rules
2. **State Transitions** — how cells change based on their current state and neighbors
3. **Neighborhoods** — which cells influence each other (Moore, von Neumann)
4. **Local Rules** — simple deterministic rules applied uniformly across the grid
5. **Elementary CA** — 1D cellular automata with binary states (Wolfram's 256 rules)
6. **Wolfram Classification** — categorizing CA by behavior (fixed, periodic, chaotic, complex). Depends on: Elementary CA
7. **Implementation** — representing grids, applying rules, visualizing evolution. Depends on: State Transitions, Local Rules
8. **Game of Life Rules** — B3/S23 (birth with 3, survive with 2 or 3 neighbors)
9. **Still Lifes** — stable patterns that don't change. Depends on: Game of Life Rules
10. **Oscillators** — patterns that return to initial state after n generations. Depends on: Game of Life Rules, Still Lifes
11. **Spaceships** — patterns that translate across the grid. Depends on: Game of Life Rules, Oscillators
12. **Emergence** — complex behavior arising from simple rules. Depends on: Oscillators, Spaceships
13. **Pattern Classification** — categorizing Life patterns by behavior and properties. Depends on: Still Lifes, Oscillators, Spaceships
14. **Guns** — patterns that emit other patterns periodically. Depends on: Spaceships, Oscillators
15. **Pattern Interactions** — collisions, eaters, reflectors. Depends on: Spaceships, Guns
16. **Methuselahs** — small patterns with long lifespans before stabilizing. Depends on: Emergence, Pattern Classification
17. **Puffers and Rakes** — moving patterns that leave debris. Depends on: Spaceships, Guns
18. **Pattern Discovery** — community-driven exploration and cataloging. Depends on: Pattern Classification
19. **Turing Completeness** — Life can simulate any computation. Depends on: Guns, Pattern Interactions
20. **Logic Gates** — AND, OR, NOT implemented with glider streams. Depends on: Spaceships, Pattern Interactions, Turing Completeness
21. **Computers in Life** — building full computational systems. Depends on: Logic Gates, Turing Completeness
22. **Computational Universality** — implications for complexity and computation. Depends on: Turing Completeness, Computers in Life
23. **Life-like Rules** — variations on Life's rules (B/S notation). Depends on: Game of Life Rules
24. **Real-world Applications** — modeling phenomena with CA. Depends on: Emergence, Wolfram Classification

## Dependencies

### Foundational Chain
- **State Transitions** are the basis for all CA behavior
- **Neighborhoods** determine which cells affect transitions
- **Local Rules** define how neighbors influence state changes
- **Elementary CA** provide the simplest examples of these principles

### Game of Life Progression
- **Game of Life Rules** must be understood before analyzing patterns
- **Still Lifes** are the simplest patterns and baseline for understanding stability
- **Oscillators** build on still lifes by adding periodicity
- **Spaceships** combine oscillation with translation
- **Guns** require understanding spaceships (they emit them)

### Complexity Emergence
- **Emergence** becomes visible once you've seen still lifes, oscillators, and spaceships
- **Pattern Interactions** requires understanding individual pattern types first
- **Methuselahs** require understanding both emergence and pattern classification
- **Puffers/Rakes** build on both spaceships and guns

### Computational Theory
- **Turing Completeness** relies on guns and pattern interactions to implement computation
- **Logic Gates** require precise timing and collision control from pattern interactions
- **Computers in Life** synthesize logic gates into complete systems
- **Computational Universality** is the theoretical implication of all the above

### Critical Bottlenecks

1. **Understanding Neighborhoods** — if you don't grasp how neighbors influence state, nothing else makes sense
2. **Grasping Emergence** — the leap from "simple rules" to "complex behavior" is conceptually difficult
3. **Pattern Interactions** — understanding how patterns collide and interact is essential for computation
4. **Turing Completeness** — requires synthesizing all prior knowledge about patterns and interactions

## Prerequisite Topics

- **Basic Programming** — needed for: Implementation, Pattern Exploration
- **Discrete Mathematics** — needed for: State Transitions, Wolfram Classification, Turing Completeness
- **Boolean Logic** — needed for: Local Rules, Logic Gates, Computational Theory

## Common Misconceptions

1. **"Life is random"** — Actually deterministic; chaos comes from sensitivity to initial conditions
2. **"Complex patterns need complex rules"** — Emergence shows simple rules create complexity
3. **"You can predict all patterns"** — Many patterns are computationally irreducible
4. **"Turing completeness means Life is a computer"** — It's universal but not practical for computation
5. **"All CA are 2D grids"** — 1D, 3D, hexagonal, and other topologies exist
6. **"Neighbors are always 8 cells"** — Different neighborhood definitions exist (Moore vs von Neumann)
7. **"Game of Life is the only interesting CA"** — Thousands of Life-like rules exist, many with unique properties
