# Classical Mechanics — Concept Map

## Core Concepts (in learning order)

1. **Generalized coordinates** — coordinates that describe configuration of a system, not necessarily Cartesian
2. **Configuration space** — space of all possible system configurations
3. **Constraints** — restrictions on system motion (holonomic vs. non-holonomic)
4. **Virtual displacement** — infinitesimal change consistent with constraints. Depends on: generalized coordinates, constraints
5. **Functional** — mapping from function space to real numbers
6. **Calculus of variations** — finding functions that extremize functionals
7. **Euler-Lagrange equation** — necessary condition for extremizing a functional. Depends on: calculus of variations
8. **Principle of least action** — physical systems follow paths that extremize the action. Depends on: Euler-Lagrange equation, functionals
9. **Action functional** — time integral of Lagrangian. Depends on: principle of least action
10. **Lagrangian function (L = T - V)** — difference of kinetic and potential energy. Depends on: generalized coordinates
11. **Lagrange's equations** — equations of motion derived from Lagrangian. Depends on: Lagrangian function, Euler-Lagrange equation
12. **Generalized momentum** — partial derivative of Lagrangian w.r.t. generalized velocity. Depends on: Lagrangian function
13. **Cyclic coordinates** — coordinates that don't appear in Lagrangian. Depends on: Lagrangian function
14. **Symmetry** — invariance of system under transformation. Depends on: Lagrangian function
15. **Noether's theorem** — symmetries correspond to conservation laws. Depends on: symmetry, conserved quantities
16. **Legendre transformation** — transformation from velocity to momentum variables. Depends on: generalized momentum
17. **Hamiltonian function (H = T + V)** — total energy expressed in phase space coordinates. Depends on: Legendre transformation, Lagrangian
18. **Phase space** — space of positions and momenta. Depends on: generalized coordinates, generalized momentum
19. **Hamilton's equations** — first-order equations of motion in phase space. Depends on: Hamiltonian function
20. **Poisson brackets** — algebraic structure encoding time evolution. Depends on: phase space, Hamilton's equations
21. **Canonical transformations** — transformations preserving Hamiltonian structure. Depends on: phase space, Poisson brackets
22. **Generating functions** — functions that determine canonical transformations. Depends on: canonical transformations
23. **Symplectic structure** — geometric structure of phase space. Depends on: canonical transformations, Poisson brackets

## Dependencies

### Critical Dependency Chains

- **Lagrangian formulation chain**: Generalized coordinates → Constraints → Variational calculus → Euler-Lagrange equation → Principle of least action → Lagrangian → Lagrange's equations
- **Hamiltonian formulation chain**: Generalized momentum → Legendre transformation → Hamiltonian → Phase space → Hamilton's equations → Poisson brackets
- **Symmetry chain**: Lagrangian → Cyclic coordinates → Symmetry → Noether's theorem → Conservation laws

### Key Dependencies Explained

- **Euler-Lagrange equation** requires understanding calculus of variations because it's the fundamental result: a function extremizes a functional iff it satisfies the Euler-Lagrange differential equation
- **Lagrange's equations** build on Euler-Lagrange equation by applying it to the action functional S = ∫L dt
- **Hamiltonian** requires Legendre transformation because we're changing independent variables from (q, q̇) to (q, p)
- **Canonical transformations** require Poisson brackets because they're transformations that preserve the Poisson bracket structure
- **Noether's theorem** requires understanding both symmetries and the Lagrangian because it connects continuous symmetries of the action to conserved quantities

## Bottlenecks

### Conceptual Bottlenecks (where students often get stuck)

1. **The meaning of "action"** — Students struggle with why we minimize ∫L dt rather than something more intuitive. This is the first major bottleneck.
2. **Legendre transformation** — The transition from Lagrangian to Hamiltonian involves a non-trivial mathematical transformation that students find abstract.
3. **Phase space thinking** — Shifting from thinking about trajectories in configuration space to trajectories in phase space requires a mental gear shift.
4. **Why we have three formulations** — Students wonder "aren't these just the same thing?" without appreciating when each is useful.
5. **Poisson brackets** — The abstract algebraic structure seems unmotivated until students see how elegantly it encodes mechanics.

### Mathematical Bottlenecks

1. **Calculus of variations** — Students need to be comfortable with functionals and functional derivatives
2. **Partial derivatives with many variables** — Lagrangian/Hamiltonian formulations involve ∂L/∂q, ∂L/∂q̇, etc.
3. **Linear algebra** — Normal modes and small oscillations require eigenvalue analysis
4. **Differential geometry** (for advanced topics) — Symplectic geometry and modern geometric mechanics

## Prerequisite Topics

### Essential Prerequisites

- **Multivariable calculus** — needed for partial derivatives, chain rule, multiple integrals
- **Linear algebra** — needed for small oscillations, normal modes, coordinate transformations
- **Ordinary differential equations** — needed for solving equations of motion
- **Newtonian mechanics** — needed as foundation and comparison point

### Helpful But Not Essential

- **Complex analysis** — useful for certain generating functions
- **Differential geometry** — helpful for geometric understanding of phase space
- **Group theory** — illuminates symmetries and Noether's theorem

## Common Misconceptions

1. **"The Lagrangian is just energy"** — No! L = T - V, not T + V. The difference is crucial.
2. **"Lagrangian mechanics only works for conservative forces"** — False. Generalized potentials handle velocity-dependent forces.
3. **"The principle of least action means action is minimized"** — Actually, action is extremized (could be minimum, maximum, or saddle point).
4. **"Hamilton's equations are just Newton's laws rewritten"** — They're geometrically deeper; they reveal symplectic structure.
5. **"Generalized coordinates are just a coordinate change"** — They're more: they can reduce degrees of freedom by incorporating constraints.
6. **"The Hamiltonian is always the total energy"** — Only when the Lagrangian doesn't explicitly depend on time and coordinates are natural.
7. **"Phase space is just position and momentum plotted"** — It's a geometric space with symplectic structure, not just a plot.

## Learning Sequence Notes

### Why This Order?

1. **Start with motivation** — Show problems that are hard in Newtonian mechanics but easy in Lagrangian
2. **Build mathematical tools first** — Calculus of variations before Lagrangian mechanics
3. **Lagrangian before Hamiltonian** — Lagrangian is more intuitive (energy difference); Hamiltonian requires Legendre transformation
4. **Symmetries after basic formulations** — Noether's theorem is powerful payoff after establishing Lagrangian
5. **Advanced topics last** — Canonical transformations and geometric mechanics after fluency with basics

### Alternative Sequences

- **Geometric approach**: Some courses introduce symplectic geometry early; requires stronger math background
- **Historical approach**: Follow Hamilton, Lagrange, and Noether chronologically; good for motivation but less efficient
- **Quantum-first**: Start with quantum mechanics and show classical limit; unconventional but illuminating
