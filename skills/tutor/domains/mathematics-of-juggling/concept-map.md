# Mathematics of Juggling — Concept Map

## Core Concepts (in learning order)

1. **Siteswap notation** — numerical encoding of juggling patterns where each digit represents throw height in beats
2. **Throw heights** — temporal distance a ball travels, measured in beat units
3. **Temporal encoding** — how patterns unfold over discrete time steps
4. **Beat counting** — fundamental time unit for measuring pattern periodicity
5. **Basic patterns** — simple repeating sequences like 3 (cascade) and 4 (fountain)
6. **Average theorem** — number of balls in a pattern equals the arithmetic mean of its siteswap digits. Depends on: siteswap notation, beat counting
7. **Pattern classification** — categorizing patterns by ball count, period, and complexity. Depends on: average theorem
8. **Ladder diagrams** — graphical representation showing ball trajectories over time. Depends on: siteswap notation, throw heights
9. **Visualization techniques** — methods for understanding patterns spatially and temporally. Depends on: ladder diagrams
10. **Validity conditions** — mathematical criteria determining if a sequence is physically jugglable. Depends on: siteswap notation, beat counting
11. **Collision detection** — identifying when two balls would occupy the same time slot. Depends on: temporal encoding
12. **Permutation test** — algorithm using modular arithmetic to verify pattern validity by checking for unique landing slots. Depends on: validity conditions, modular arithmetic
13. **Proof techniques** — methods for demonstrating pattern validity or invalidity. Depends on: permutation test
14. **Enumeration** — counting all valid patterns of given length and ball count. Depends on: permutation test, validity conditions
15. **Combinatorial counting** — mathematical formulas for pattern enumeration (b^n for n digits, b balls). Depends on: enumeration
16. **Juggling states** — representation of future time slot occupancy at any moment. Depends on: temporal encoding, beat counting
17. **State transitions** — how throws move the system from one state to another. Depends on: juggling states, throw heights
18. **Directed graphs** — graph-theoretic representation of state spaces and transitions. Depends on: state transitions
19. **Cayley graphs** — interpretation of state diagrams as group-theoretic structures. Depends on: directed graphs, group theory
20. **Graph traversal** — navigating state diagrams to discover patterns. Depends on: directed graphs, state transitions
21. **Cycle finding** — identifying repeating patterns by detecting cycles in state graphs. Depends on: graph traversal
22. **Synchronous notation** — extension for patterns where both hands throw simultaneously. Depends on: siteswap notation
23. **Multiplex notation** — extension for multiple balls thrown from one hand at once. Depends on: siteswap notation
24. **Passing patterns** — multi-person juggling notation and analysis. Depends on: siteswap notation, synchronous notation
25. **Shannon's theorem** — relationship between dwell time, flight time, number of balls, and hands. Depends on: throw heights, physical constraints
26. **Physical limits** — real-world constraints on hand speed, accuracy, and ball count. Depends on: Shannon's theorem
27. **Robotics applications** — control theory and trajectory planning for juggling robots. Depends on: state transitions, physical limits
28. **Pattern discovery** — using mathematical tools to find new jugglable sequences. Depends on: enumeration, state transitions, validity conditions

## Dependencies

### Foundational Dependencies
- **Average theorem** requires understanding **siteswap notation** and **beat counting** because you must decode the digits and compute their mean to determine ball count
- **Permutation test** builds on **validity conditions** and **modular arithmetic** because it uses (i + a_i) mod n to detect collisions systematically
- **Ladder diagrams** depend on **siteswap notation** and **throw heights** because they plot temporal trajectories based on the numeric encoding

### State Theory Dependencies
- **State transitions** require **juggling states** and **throw heights** because each throw modifies the future occupancy pattern by a specific temporal offset
- **Cayley graphs** build on **directed graphs** because they add group-theoretic structure to the state transition framework
- **Pattern discovery via graph traversal** depends on **state transitions** and **cycle finding** because new patterns emerge from closed loops in the state space

### Advanced Extensions
- **Synchronous notation** extends **siteswap notation** by adding simultaneity constraints and crossing/parallel modifiers
- **Shannon's theorem** connects **throw heights** and **physical constraints** by relating temporal parameters (dwell, flight) to jugglable ball count
- **Robotics applications** depend on **state transitions** and **physical limits** because robots must plan feasible trajectories within mechanical constraints

### Pattern Discovery
- **Enumeration** depends on **permutation test** and **validity conditions** because you must filter all sequences through validity checks
- **Pattern discovery** integrates **enumeration**, **state transitions**, and **validity conditions** to systematically explore the space of jugglable patterns

## Bottlenecks

### Permutation Test
The permutation test is a critical bottleneck — students must master it before meaningful enumeration or state analysis. Without it, pattern validation is trial-and-error rather than systematic proof.

### State Representation
Understanding juggling states is essential for graph-theoretic analysis. Students often struggle with the abstraction of "future time slot occupancy" — this must be solid before Cayley graphs or advanced enumeration.

### Modular Arithmetic Fluency
Many concepts (permutation test, state transitions) require comfort with modular arithmetic. Gaps here will slow progress throughout the middle modules.

## Common Misconceptions

1. **"Higher numbers mean harder patterns"** — Students conflate digit value with difficulty. Pattern 97531 has the same ball count (5) as 55555 but very different dynamics. Difficulty depends on throw variance and transition complexity, not digit magnitude.

2. **"Any sequence of numbers is a valid siteswap"** — Before learning the permutation test, students think notation is unconstrained. They must learn that only sequences passing the permutation test avoid collisions.

3. **"States are static positions"** — Students often think states represent spatial ball positions rather than temporal occupancy. The abstraction shift from "where balls are" to "when slots are filled" is subtle but crucial.

4. **"Synchronous means symmetric"** — Students assume synchronous patterns require both hands to do identical throws. In reality, synchronous only means simultaneous timing; throws can differ in height and direction.

5. **"Shannon's theorem sets absolute limits"** — Students may think the theorem gives hard bounds on jugglability. It describes trade-offs (faster hands → more balls) but doesn't account for human factors like fatigue, accuracy degradation, or cognitive load.

## Prerequisite Topics

- **Basic combinatorics** — needed for enumeration, counting valid patterns, and understanding the b^n formula
- **Discrete mathematics** — needed for beat counting, temporal encoding, and sequence analysis
- **Graph theory fundamentals** — needed for state diagrams, Cayley graphs, and traversal algorithms
- **Modular arithmetic** — needed for the permutation test and state transition calculations
- **Elementary group theory** (helpful but not required) — needed for deep understanding of Cayley graph interpretation

## Cross-Topic Connections

- **Graph theory** — state diagrams, traversal, cycle detection
- **Group theory** — Cayley graphs, permutation groups, symmetric group actions
- **Combinatorics** — pattern enumeration, counting arguments
- **Mechanics and differential equations** — physical constraints, trajectory planning
- **Robotics and control theory** — feedback control, motion planning
- **Knot theory** — extensions for ring juggling patterns (not covered in this curriculum but a natural next step)
