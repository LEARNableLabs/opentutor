# Operations Research — Concept Map

## Core Concepts (in learning order)

1. **Optimization problems** — finding the best solution among many possibilities, formalized as decision variables + objective + constraints
2. **Linear programs (LP)** — optimization with linear objective and constraints; the foundation of OR
3. **Feasible region** — the set of all solutions that satisfy constraints; geometry matters. Depends on: optimization problems
4. **Simplex method** — corner-hopping algorithm for solving LPs efficiently. Depends on: feasible region, extreme points
5. **Duality theory** — every LP has a "twin" problem with deep economic meaning. Depends on: linear programs
6. **Shadow prices** — marginal value of relaxing a constraint; dual variables. Depends on: duality theory
7. **Sensitivity analysis** — how much can parameters change before the solution changes? Depends on: shadow prices, simplex method
8. **Integer programming (IP)** — optimization with discrete variables; much harder than LP. Depends on: linear programs
9. **Branch and bound** — systematic tree search for IP, using LP relaxations. Depends on: integer programming, simplex method
10. **Cutting planes** — adding clever constraints to tighten relaxations. Depends on: integer programming, feasible region
11. **Network flows** — special-structure LPs on graphs; extremely efficient algorithms. Depends on: linear programs
12. **Shortest path** — finding minimum-cost paths in graphs. Depends on: network flows
13. **Vehicle routing** — real-world generalization of TSP; hard but practical. Depends on: integer programming, shortest path
14. **Nonlinear programming (NLP)** — optimization with curved objectives or constraints. Depends on: linear programs
15. **Convexity** — property that makes nonlinear optimization tractable. Depends on: nonlinear programming, feasible region
16. **Gradient methods** — iterative algorithms using derivatives to find optima. Depends on: nonlinear programming, convexity
17. **Optimization modeling** — translating messy real problems into clean math. Depends on: all problem types
18. **Solver APIs** — practical tools (OR-Tools, JuMP, CVXPY) for implementing and solving models. Depends on: optimization modeling

## Dependencies

### Foundation Chain
- **Feasible region** requires understanding **optimization problems** because you need to know what a constraint is before understanding the set of points satisfying all constraints
- **Simplex method** builds on **feasible region** and **extreme points** because it navigates the corner points of the feasible polytope
- **Duality theory** requires solid understanding of **linear programs** because the dual is constructed from the primal's structure

### Theory → Practice Bridge
- **Shadow prices** requires **duality theory** because shadow prices ARE the dual variables, interpreted economically
- **Sensitivity analysis** builds on **shadow prices** and **simplex method** because it uses dual information from the final simplex tableau
- **Solver APIs** requires understanding all **problem types** because you need to know what kind of problem you're solving to choose the right solver

### LP → IP Progression
- **Integer programming** extends **linear programs** by adding integrality constraints, fundamentally changing complexity
- **Branch and bound** requires both **integer programming** (the problem type) and **simplex method** (to solve relaxations at each node)
- **Cutting planes** builds on **integer programming** and **feasible region** because cuts shrink the feasible region by adding valid inequalities

### Special Structures
- **Network flows** are special cases of **linear programs** where the constraint matrix has a network structure, enabling combinatorial algorithms
- **Shortest path** is a special case of **network flows** (min-cost flow with unit supplies/demands)
- **Vehicle routing** combines **integer programming** (for discrete decisions) and **shortest path** (for route construction)

### Nonlinear Extension
- **Nonlinear programming** generalizes **linear programs** by allowing nonlinear functions
- **Convexity** is critical for **nonlinear programming** because convex problems are tractable (local optima are global)
- **Gradient methods** solve **nonlinear programs** by using derivative information, with convergence guaranteed for convex problems

### Cross-Cutting Concepts
- **Optimization modeling** ties together all problem types—you need to recognize problem structure to formulate correctly
- **Algorithm selection** depends on recognizing whether a problem has special structure (network, convex, etc.) that enables specialized methods

## Bottlenecks

### Critical Foundations
1. **Linear algebra fluency** — LPs are systems of linear inequalities; you can't understand simplex without matrices and vectors
2. **Geometric intuition** — understanding the feasible region geometry (polyhedra, extreme points) is essential for LP theory
3. **Graph theory basics** — network optimization requires comfort with nodes, edges, paths, and flows

### Conceptual Leaps
1. **LP → IP complexity jump** — students often underestimate how much harder integer constraints make problems; NP-hardness is not intuitive
2. **Duality's abstract nature** — the dual problem feels artificial at first; shadow prices as "marginal value of constraint relaxation" takes time to internalize
3. **Convexity's power** — why convexity makes nonlinear problems tractable is subtle and requires calculus intuition

## Misconceptions

### Common Errors
1. **"Integer programming is just LP with rounding"** — No! Rounding optimal LP solutions rarely gives optimal IP solutions. The discrete structure fundamentally changes the problem.

2. **"More constraints always make problems harder"** — Not true for LPs (more constraints might shrink the feasible region but don't change complexity class). For IPs, it depends on structure.

3. **"The simplex method tries all corners"** — No, it intelligently walks from corner to improving corner; trying all corners would be exponential.

4. **"Shadow prices tell you the value of having more of a resource"** — Close, but only valid locally (for small changes) and only when the basis doesn't change.

5. **"Global optimization is impossible for nonconvex problems"** — Not true; it's just computationally hard. Methods like branch-and-bound extend to nonconvex NLPs, and heuristics often work well in practice.

6. **"Dual variables are just Lagrange multipliers with a different name"** — Essentially true for continuous optimization, but the LP duality theory is richer and more geometric.

7. **"Network flow problems are harder than general LPs"** — Opposite! Network structure makes them easier; specialized algorithms (e.g., network simplex) are much faster than general LP solvers.

8. **"You always need commercial solvers (CPLEX/Gurobi) for real problems"** — Not always. Open-source solvers (GLPK, HiGHS, CBC) work well for many problems; OR-Tools is excellent for routing/scheduling.

## Prerequisite Topics

### Mathematics
- **Linear algebra** — needed for LP formulation, simplex, duality (matrix operations, rank, basis)
- **Multivariable calculus** — needed for nonlinear optimization (gradients, Hessians, Taylor approximations)
- **Basic graph theory** — needed for network flows (nodes, edges, paths, cycles, trees)
- **Discrete math** — helpful for integer programming (combinatorics, complexity theory basics)

### Programming
- **Python or Julia** — needed for implementing models and using solver APIs
- **Data structures** — helpful for implementing algorithms (priority queues for shortest path, tree structures for branch-and-bound)

### Domain Knowledge (not required but helpful)
- **Probability/statistics** — useful for understanding stochastic optimization and robust optimization
- **Economics** — helps with interpreting duality, shadow prices, and resource allocation problems
- **Algorithms** — greedy algorithms, dynamic programming, and complexity theory provide context for OR algorithms
