# Operations Research — Optimization in Practice — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 10 lessons (40%)
- **real-world application challenges** — 5 lessons (20%)
- **Socratic questions** — 3 lessons (12%)
- **teach-back exercises (student explains)** — 3 lessons (12%)
- **review and consolidation sessions** — 3 lessons (12%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 32% accessible (1-2), 36% standard (3), 32% challenging (4-5).

Difficulty peaks:
- Day 5: "How does the simplex method walk from corner to corner?" (difficulty 4)
- Day 7: "Why does every optimization problem have a secret twin?" (difficulty 4)
- Day 12: "How do you schedule 100 nurses across 50 shifts fairly?" (difficulty 4)
- Day 13: "What's the smartest way to search a billion possibilities?" (difficulty 4)
- Day 15: "How do cutting planes slice away bad solutions?" (difficulty 4)

## Domain Hooks
This field covers operations research — optimization in practice, with applications across theory and practice.

## Common Failure Modes
1. **"Optimization is just calculus with constraints"** — Students with calculus backgrounds expect to set derivatives to zero. Emphasize that OR handles discrete variables, combinatorial constraints, and non-smooth objectives where calculus fails. LP geometry (polyhedral feasible regions) is fundamentally different from smooth Lagrangian optimization.

2. **"The optimal solution is always unique"** — Many real problems have multiple optima (degenerate solutions, alternative optimal solutions). Teach students to recognize and interpret this: "any of these solutions is equally good" vs. "the problem is ill-posed."

3. **"Branch-and-bound explores the entire tree"** — Students think it's brute force. Stress the "bound" part: most branches are pruned, making it dramatically faster than enumeration. Use small examples where they can see pruning in action.

4. **"Integer programming is just rounding the LP solution"** — This is the most persistent misconception. Show counterexamples where r

## Vocabulary
Key terms for this domain: optimization problems, decision variables, constraints, objective functions, problem formulation, linear programs, standard form, feasible region, polyhedra, geometric interpretation, extreme points, basic feasible solutions, optimality conditions, simplex algorithm, pivot operations (and 60 more).