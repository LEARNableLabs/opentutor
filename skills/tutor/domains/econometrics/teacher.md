# Econometrics — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 9 lessons (35%)
- **Socratic questions** — 4 lessons (15%)
- **real-world application challenges** — 4 lessons (15%)
- **review and consolidation sessions** — 4 lessons (15%)
- **teach-back exercises (student explains)** — 3 lessons (12%)
- **curated resource exploration** — 2 lessons (8%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 38% accessible (1-2), 38% standard (3), 23% challenging (4-5).

Difficulty peaks:
- Day 11: "What is omitted variable bias really doing to our estimates?" (difficulty 4)
- Day 13: "How do we interpret interactions and polynomial terms?" (difficulty 4)
- Day 15: "Can regression detect discrimination in wages or hiring?" (difficulty 4)
- Day 17: "What does heteroskedasticity actually break?" (difficulty 4)
- Day 23: "How do instrumental variables rescue causal inference?" (difficulty 4)

## Domain Hooks
This field covers econometrics, with applications across theory and practice.

## Common Failure Modes
1. **"Regression proves causation"** — students conflate statistical significance with causal effects. Emphasize repeatedly: regression measures *association*, causation requires *identification* (randomization, IV, natural experiments). Use examples where correlation is obviously spurious (ice cream sales and drowning).

2. **"Controlling for X means holding X constant"** — students think "controlling for education" means comparing people with identical education. Reality: it's about partial correlation, residualizing. Teach this using Venn diagrams or FWL theorem visually.

3. **"More variables = better model"** — students throw in every available variable to "increase R-squared." They don't realize: (a) multicollinearity reduces precision, (b) bad controls (mediators, colliders) introduce bias, (c) overfitting harms prediction. Teach adjusted R-squared, AIC/BIC, and the danger of data mining.

4. **"Heteroskedasticity biases my coefficients"** — students panic when they see heterosk

## Vocabulary
Key terms for this domain: observational data, causal inference, econometric goals, unbiasedness, consistency, efficiency, hypothesis testing, p-values, statistical significance, correlation vs causation, confounding, randomization, ordinary least squares, minimization, fitted values (and 62 more).