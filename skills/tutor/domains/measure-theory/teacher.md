# Measure theory and integration — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 14 lessons (54%)
- **Socratic questions** — 5 lessons (19%)
- **review and consolidation sessions** — 3 lessons (12%)
- **real-world application challenges** — 3 lessons (12%)
- **teach-back exercises (student explains)** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 42% accessible (1-2), 35% standard (3), 23% challenging (4-5).

Difficulty peaks:
- Day 10: "Can we pass limits through integrals?" (difficulty 4)
- Day 11: "What's the most useful convergence theorem in all of analysis?" (difficulty 4)
- Day 15: "When can we swap the order of integration?" (difficulty 4)
- Day 20: "When can we represent one measure as a density of another?" (difficulty 4)
- Day 23: "Are Lp spaces complete metric spaces?" (difficulty 4)

## Domain Hooks
- **Banach-Tarski paradox** — Drop this in during non-measurable sets discussion. Provokes "measure theory is necessary to avoid absurdity" insight.
- **Axiom of choice and measurability** — Vitali sets require AC. Mention Solovay's model where all sets are Lebesgue measurable (but AC fails).
- **Hausdorff dimension** — When discussing Lebesgue measure, mention that "dimension" can be fractional (fractals). Connects to geometric measure theory.
- **Brownian motion** — When discussing probability applications, mention that Brownian paths are continuous but nowhere differentiable (measure 1). Stunning application of Lebesgue integration.
- **Fourier analysis** — Briefly connect Lp spaces to Fourier series (L2 is Hilbert space, orthonormal basis of exponentials). Motivates why completeness matters.
- **Quantum mechanics** — Mention that L2 is the space of quantum states, and "observables" are self-adjoint operators. Radon-Nikodym connects to density operators.
- **Ergodic theory** — When 

## Common Failure Modes
1. **"Sigma-algebras are just collections of all subsets"** — Students often don't appreciate the restriction to countable operations. Emphasize: we can't measure all subsets (non-measurable sets exist), and allowing uncountable unions breaks additivity.

2. **"Measurable = continuous"** — False. Measurability is much weaker than continuity. Continuous functions are measurable (inverse images of open sets are open, hence Borel), but measurable functions can be wildly discontinuous (indicator of rationals). Use examples early.

3. **"The Lebesgue integral is just a fancy Riemann integral"** — It's fundamentally different in construction (horizontal vs vertical slicing) and scope (handles many more functions). Show the Dirichlet function: Lebesgue integral = 0, Riemann integral doesn't exist.

4. **"MCT, Fatou, and DCT are interchangeable"** — They have different hypotheses and conclusions. MCT needs monotonicity, DCT needs a dominating function. Students mix them up in proofs. Drill the

## Vocabulary
Key terms for this domain: Riemann integral limitations, Dirichlet function, motivation for Lebesgue, sigma-algebras, Borel sets, measurable spaces, measures, countable additivity, null sets, outer measure, Carathéodory's theorem, measurability criterion, Lebesgue measure on R, translation invariance, Borel sigma-algebra (and 63 more).