# Game Theory — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 12 lessons (41%)
- **real-world application challenges** — 6 lessons (21%)
- **review and consolidation sessions** — 5 lessons (17%)
- **Socratic questions** — 3 lessons (10%)
- **teach-back exercises (student explains)** — 2 lessons (7%)
- **curated resource exploration** — 1 lessons (3%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 31% accessible (1-2), 31% standard (3), 38% challenging (4-5).

Difficulty peaks:
- Day 9: "How do we find equilibria systematically?" (difficulty 4)
- Day 10: "Can randomizing be rational?" (difficulty 4)
- Day 11: "Why does rock-paper-scissors have no pure equilibrium?" (difficulty 4)
- Day 14: "Why should you reason backwards in time?" (difficulty 4)
- Day 16: "What makes a threat credible?" (difficulty 4)

## Domain Hooks
1. **Evolutionary game theory and cultural evolution**
   - Drop in: After lesson 25 (evolution plays games)
   - Connection: Evolutionary stable strategies explain animal behavior (hawk-dove games), but also cultural norms, language conventions, and traffic patterns. Equilibrium without conscious optimization.
   - Depth: Show how replicator dynamics naturally select for Nash equilibria. Connect to biology (Maynard Smith) and sociology (norm emergence).

2. **Algorithmic game theory and computational complexity**
   - Drop in: After lesson 9 (computing Nash equilibria)
   - Connection: Finding Nash equilibria is PPAD-complete (roughly as hard as factoring). Even 2-player games can be computationally hard. The theory is elegant, but computation is tough.
   - Depth: Mention Nash's proof is non-constructive (fixed point theorem). Introduce Gambit or other computational tools. Touch on mechanism design for computationally tractable outcomes.

3. **Behavioral game theory and experimental 

## Common Failure Modes
1. **"Nash equilibrium is a good outcome"**
   - **Why it happens**: The name "equilibrium" sounds positive, and students confuse individual rationality with collective optimality
   - **How to correct**: Start with the prisoner's dilemma. Emphasize that Nash predicts behavior, it doesn't judge it. The Pareto-superior outcome (both cooperate) is not a Nash equilibrium. Nash is about stability, not optimality.

2. **"Players should always choose their dominant strategy"**
   - **Why it happens**: Dominant strategies are taught first as the "easy case"
   - **How to correct**: Clarify that dominant strategies are rare. Most games have no dominant strategies for any player. Dominant strategy equilibrium is a very special case of Nash equilibrium.

3. **"Mixed strategies are mistakes or confusion"**
   - **Why it happens**: Randomization seems irrational — why not just pick the best option?
   - **How to correct**: Show matching pennies (no pure Nash exists). Emphasize that mixing keeps op

## Vocabulary
Key terms for this domain: strategic interaction, players, strategies, payoffs, normal form, payoff matrix, strategic form, prisoner's dilemma, collective action problem, defection, game formulation, identifying players and strategies, payoff construction, dominant strategy, strict dominance (and 66 more).