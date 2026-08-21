# Operations Research — Teaching Notes

## Approach

Operations research at the intermediate level should bridge theory and practice—students need to understand *why* algorithms work (geometry, algebraic structure) but spend most of their time *using* modern tools to solve real problems. Start with visual, geometric intuition (2D/3D LP feasible regions), then build to higher dimensions and abstraction. Emphasize the modeling-solving-interpreting cycle: formulation is often harder than solving, and interpreting solutions (sensitivity analysis, what-if scenarios) matters more than algorithm details. This is a hands-on, code-heavy topic—every lesson should involve running a solver or implementing a concept.

## Common Misconceptions

1. **"Optimization is just calculus with constraints"** — Students with calculus backgrounds expect to set derivatives to zero. Emphasize that OR handles discrete variables, combinatorial constraints, and non-smooth objectives where calculus fails. LP geometry (polyhedral feasible regions) is fundamentally different from smooth Lagrangian optimization.

2. **"The optimal solution is always unique"** — Many real problems have multiple optima (degenerate solutions, alternative optimal solutions). Teach students to recognize and interpret this: "any of these solutions is equally good" vs. "the problem is ill-posed."

3. **"Branch-and-bound explores the entire tree"** — Students think it's brute force. Stress the "bound" part: most branches are pruned, making it dramatically faster than enumeration. Use small examples where they can see pruning in action.

4. **"Integer programming is just rounding the LP solution"** — This is the most persistent misconception. Show counterexamples where rounding is infeasible or arbitrarily bad. Explain that IP is a fundamentally different beast (NP-hard vs. polynomial-time).

5. **"You need to learn all the algorithms to use OR effectively"** — No! Modern solvers (Gurobi, CPLEX, OR-Tools) handle algorithm selection internally. The practitioner's job is formulation and interpretation, not implementing simplex from scratch.

6. **"Duality is just a theoretical curiosity"** — Duality is incredibly practical: shadow prices guide business decisions ("should we buy more warehouse space?"), and dual solutions verify optimality. Make duality tangible with economic examples.

7. **"Convex optimization is a narrow subfield"** — Convex problems are everywhere: ML (logistic regression, SVM), finance (portfolio optimization), control theory, signal processing. Convexity is the dividing line between tractable and intractable.

8. **"Network problems are niche"** — Actually, they're ubiquitous: shortest path (GPS routing), max flow (network capacity), min-cost flow (logistics), assignment (matching). Graph structure makes these problems both practically important and algorithmically elegant.

9. **"Commercial solvers are always better than open-source"** — Not true. Open-source has caught up significantly (HiGHS, SCIP, OR-Tools). Commercial solvers (CPLEX, Gurobi) are faster for huge problems but overkill for many applications. OR-Tools is production-grade and free.

10. **"If the solver says 'optimal,' the solution must be right"** — Garbage in, garbage out. The solver optimizes the model you gave it, not the real-world problem. Teach students to validate solutions: "Does this make sense? Did I model the right thing?"

## Level Adjustments

### What makes this "intermediate"
- **Prerequisites assumed**: linear algebra (matrix operations, rank, basis), basic calculus (gradients), programming fundamentals. We won't re-teach these, but we'll review them in context.
- **Proofs**: Minimal. Sketch the intuition (e.g., "simplex improves the objective at each step by moving to a better corner") but skip formal proofs (e.g., convergence theorems). Cite proofs for curious students.
- **Formalism**: Use mathematical notation for clarity, but avoid measure theory, advanced topology, or complexity-theoretic proofs. Focus on "what works" over "why in full rigor."
- **Algorithms**: Teach the intuition and high-level steps (e.g., simplex pivot, branch-and-bound tree), not the implementation minutiae. Students should implement simple versions (2D simplex, basic branch-and-bound on small problems) to build intuition, then use production solvers for real work.
- **Applications**: Heavy emphasis. Every module should include real-world examples (supply chain, scheduling, routing, ML). Intermediate students are often motivated by seeing OR solve actual problems.

### Compared to beginner level
- Beginners need more scaffolding on linear algebra and problem setup. Intermediate students can jump into formulation patterns and solver APIs faster.
- Beginners use GUI tools or simplified libraries. Intermediate students write code and use professional APIs (JuMP, CVXPY, OR-Tools).
- Beginners see toy problems. Intermediate students tackle realistic problem sizes and messy constraints.

### Compared to advanced level
- Advanced students prove convergence theorems, analyze worst-case complexity, implement algorithms from papers, and study cutting-edge research (approximation algorithms, online optimization, stochastic optimization).
- Advanced students go deep on theory (polyhedral combinatorics, ellipsoid method, interior-point methods). Intermediate students understand the ideas but don't derive them.
- Advanced students design new formulations and custom algorithms. Intermediate students use existing techniques and tools effectively.

## Rabbit Holes

### When to drop these in

- **OR and machine learning** (lessons 22-23) — Many ML problems are optimization in disguise. SVM is a QP, logistic regression is convex optimization, neural network training is nonconvex stochastic optimization. Great bridge to modern AI.

- **The traveling salesman problem (TSP)** (lesson 18) — Icon of NP-hardness, but also a solved problem for practical purposes (Concorde solver can handle 10,000-city instances). Discuss the gap between worst-case theory and average-case practice.

- **Game theory and optimization** (after lesson 7) — Nash equilibria as fixed points of best-response optimization; zero-sum games as linear programs. Shows OR's reach into economics and decision science.

- **Robust optimization** (after lesson 8) — What if your problem parameters are uncertain? Robust optimization hedges against worst-case scenarios. Practical in finance, logistics, and energy systems.

- **Column generation and Dantzig-Wolfe decomposition** (after lesson 13) — For students interested in advanced IP techniques. Used in airline crew scheduling and cutting-stock problems. Beautiful theory, powerful practice.

- **Metaheuristics** (after lesson 18) — When exact methods fail, heuristics (simulated annealing, genetic algorithms, tabu search) often work well. Practical but less mathematically satisfying—good for engineering-minded students.

- **Stochastic programming** (after lesson 20) — Optimization under uncertainty with probabilistic constraints. Two-stage models, scenario trees. Rich area with applications in finance and operations.

- **Semidefinite programming (SDP)** (after lesson 21) — Generalization of LP where variables are matrices constrained to be positive semidefinite. Surprising applications in combinatorial optimization, control, and quantum computing.

- **Operations research in tech companies** (any time) — Google uses OR for ad allocation, routing, and data center optimization. Uber/Lyft for ride matching. Amazon for warehouse layout and delivery routing. Netflix for CDN optimization. Make it tangible.

- **Historical context** (lesson 1) — OR born in WWII (convoy routing, bombing strategies), matured in postwar industry (Dantzig invents simplex in 1947). The Cold War funded much of the foundational work. Linear programming was classified!

## Difficulty Progression

### Arc across the curriculum
1. **Lessons 1-5 (Linear Programming Foundations)**: Start gentle (difficulty 2-3). Build geometric intuition with 2D examples, introduce formulation, explain simplex conceptually. Peak at lesson 5 (simplex mechanics, difficulty 4).

2. **Lessons 6-10 (Advanced LP & Duality)**: Mix of theory (duality, difficulty 4) and practice (solver APIs, difficulty 3). Review day at lesson 10 (difficulty 1) consolidates LP mastery.

3. **Lessons 11-15 (Integer Programming)**: Ramp up difficulty. Complexity jump from LP to IP (lesson 11, difficulty 3), then real-world formulations (lesson 12, difficulty 4), branch-and-bound (lesson 13, difficulty 4), cutting planes (lesson 15, difficulty 4). Teach-back at lesson 14 (difficulty 2) provides a breather.

4. **Lessons 16-20 (Network & Specialized Problems)**: Easier than IP. Network structure simplifies problems (lessons 16-17, difficulty 2-3). Vehicle routing is hard (lesson 18, difficulty 4) but builds on earlier ideas. Review day at lesson 19 (difficulty 1). Resource drop at lesson 20 (difficulty 3) for algorithm selection.

5. **Lessons 21-24 (Nonlinear Optimization & Applications)**: New territory but builds on LP intuition. Convexity (lesson 21, difficulty 3), gradient methods (lesson 22, difficulty 4), ML applications (lesson 23, difficulty 4). End with a practical synthesis (lesson 24, difficulty 2).

### Pacing notes
- **Review days** (lessons 10, 19) are critical for consolidation. Use them to revisit tough concepts, solve practice problems, and connect ideas across modules.
- **Teach-back lessons** (lessons 9, 14, 24) force students to articulate understanding. "Explain branch-and-bound to someone who only knows binary search" is harder than it sounds.
- **Real-world lessons** (lessons 2, 8, 12, 18, 23) keep motivation high. Show students that OR solves actual problems, not just toy examples.
- **Difficulty peaks** (lessons 5, 7, 13, 15, 22) should be spaced out with easier lessons. Don't stack multiple difficulty-4 lessons back-to-back.

## Teaching Style

- **Code-first when possible**: Show formulations in JuMP/CVXPY/OR-Tools, not just mathematical notation. Students learn faster by running code.
- **Visualize aggressively**: Use 2D/3D plots for feasible regions, GeoGebra for geometry, Graphviz for network flows, tree diagrams for branch-and-bound.
- **Connect to intuition**: "Why does the optimum live at a corner?" deserves a geometric answer, not just "it's a theorem."
- **Fail gracefully**: Show infeasible models, unbounded problems, and bad formulations. Debugging is part of the skill.
- **Real URLs, real data**: Link to actual OR-Library instances, MIPLib problems, real-world datasets. Toy examples teach concepts; real problems teach judgment.
