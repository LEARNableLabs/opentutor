# Decision Theory — Concept Map

## Core Concepts (in learning order)

1. **Rationality** — what it means for a choice to be rational; normative vs. descriptive theories
2. **Preferences** — ordered relations between options; what you want
3. **Transitivity** — if A > B and B > C, then A > C; prevents circular preferences
4. **Completeness** — ability to compare any two options
5. **Revealed preference** — inferring preferences from observed choices
6. **Utility functions** — numerical representations of preferences; cardinal vs. ordinal. Depends on: Preferences
7. **Expected utility** — averaging utility weighted by probabilities. Depends on: Utility functions
8. **VNM axioms** — continuity, independence, completeness, transitivity; conditions for EU representation. Depends on: Expected utility
9. **Certainty equivalent** — guaranteed amount you'd accept instead of a gamble. Depends on: Expected utility
10. **Risk premium** — difference between expected value and certainty equivalent. Depends on: Certainty equivalent
11. **Risk aversion** — preferring sure things to gambles with same expected value; concave utility. Depends on: Risk premium
12. **Arrow-Pratt coefficient** — measures degree of risk aversion via utility curvature. Depends on: Risk aversion
13. **Allais paradox** — systematic violations of independence axiom; limits of EU theory. Depends on: VNM axioms
14. **St. Petersburg paradox** — game with infinite expected value but bounded willingness to pay. Depends on: Expected utility
15. **Prospect theory** — descriptive theory with reference points and probability weighting. Depends on: Allais paradox
16. **Loss aversion** — losses hurt more than equivalent gains feel good. Depends on: Prospect theory
17. **Reference points** — status quo from which gains and losses are measured. Depends on: Prospect theory
18. **Probability weighting** — people overweight small probabilities, underweight large ones. Depends on: Prospect theory
19. **Decision trees** — graphical tools for structuring sequential decisions. Depends on: Expected utility
20. **Risk vs. uncertainty** — known probabilities (risk) vs. unknown (uncertainty); Knightian distinction. Depends on: Expected utility
21. **Ellsberg paradox** — people avoid ambiguous gambles even when irrational. Depends on: Risk vs. uncertainty
22. **Ambiguity aversion** — preferring known to unknown probabilities. Depends on: Ellsberg paradox
23. **Maximin** — choose action with best worst-case outcome; extreme pessimism. Depends on: Risk vs. uncertainty
24. **Minimax regret** — minimize maximum regret across states. Depends on: Risk vs. uncertainty
25. **Subjective probability** — personal degrees of belief; not objective frequencies. Depends on: Risk vs. uncertainty
26. **Savage SEU** — subjective expected utility; combines subjective probabilities with utilities. Depends on: Subjective probability
27. **Bayesian decision theory** — updating beliefs with evidence, then maximizing expected utility. Depends on: Savage SEU
28. **Value of information** — how much you'd pay to reduce uncertainty before deciding. Depends on: Bayesian decision theory
29. **Sequential decisions** — multi-stage problems where you learn and adapt. Depends on: Decision trees, Bayesian decision theory

## Dependencies

### Core Foundation
- **Utility functions** require understanding **preferences** because utility is just a numerical way to represent preference orderings.
- **Expected utility** requires **utility functions** because you're taking an expectation over utility values, not just outcomes.
- **VNM axioms** are the conditions that justify using **expected utility** as your decision rule; violating them means EU maximization doesn't apply.

### Risk Attitudes
- **Certainty equivalent** requires **expected utility** because it's the sure amount with the same utility as the gamble's expected utility.
- **Risk premium** requires **certainty equivalent** because it's the gap between the gamble's expected value and what you'd actually accept.
- **Risk aversion** requires **risk premium** because it's defined as preferring certainty to fair gambles (positive risk premium).
- **Arrow-Pratt coefficient** requires **risk aversion** because it quantifies the degree of risk aversion via the utility function's curvature.

### Violations and Extensions
- **Allais paradox** requires understanding **VNM axioms** (specifically independence) because it shows systematic violations of those axioms.
- **Prospect theory** builds on **Allais paradox** and other empirical violations to create a descriptive alternative to expected utility.
- **Loss aversion** and **reference points** are core features of **prospect theory** that explain why EU fails descriptively.

### Uncertainty (not just risk)
- **Risk vs. uncertainty** requires **expected utility** as background because EU theory assumes known probabilities (risk).
- **Ellsberg paradox** requires the **risk vs. uncertainty** distinction because it demonstrates that people treat unknown probabilities differently.
- **Ambiguity aversion** is the psychological phenomenon revealed by the **Ellsberg paradox**.
- **Maximin** and **minimax regret** are decision rules for handling **uncertainty** when you can't or won't assign probabilities.
- **Subjective probability** is Savage's solution to **uncertainty** — treat beliefs as probabilities even when objective frequencies don't exist.
- **Savage SEU** requires **subjective probability** because it extends expected utility to cases where probabilities are personal beliefs.
- **Bayesian decision theory** requires **Savage SEU** as its foundation and adds the machinery for updating beliefs.

### Advanced Applications
- **Value of information** requires **Bayesian decision theory** because you calculate it by comparing expected utility with and without the information.
- **Sequential decisions** require both **decision trees** (for structure) and **Bayesian decision theory** (for learning and updating).

## Bottlenecks

### Expected Utility (Lesson 6)
This is the central concept. Everything after it either applies EU, extends EU, or critiques EU. Students who don't grasp the EU formula and why it's different from expected value will struggle with the entire second half.

**Prerequisites**: solid understanding of probability (weighted averages), preferences, utility functions.

### VNM Axioms (Lessons 9-10)
Understanding why the axioms matter (and what happens when they're violated) is crucial for appreciating both the power and limits of EU theory. This is where formalism meets intuition — students often memorize the axioms without seeing why they're necessary.

**Prerequisites**: comfort with axiomatic reasoning, expected utility.

### Risk vs. Uncertainty Distinction (Lesson 17)
This conceptual shift — from "we know the probabilities" to "we don't" — is subtle but fundamental. Students often conflate the two. Everything in Module 4 depends on getting this right.

**Prerequisites**: expected utility, enough experience with risky problems to appreciate what changes when probabilities become unknown.

### Bayesian Decision Theory (Lesson 21)
Combines probability updating (Bayes' rule) with decision making (EU maximization). Students need to be comfortable with both independently before merging them.

**Prerequisites**: Bayes' rule (from prerequisite probability theory), expected utility, subjective probability.

## Common Misconceptions

### "Higher expected value = better choice"
False once you introduce utility. A gamble with higher expected monetary value might have lower expected utility if you're risk-averse. Address in Lessons 6-7.

### "Rational = emotionless"
Rationality is about consistency (axioms), not about suppressing preferences. You can rationally prefer art to money. Address in Lesson 1.

### "Prospect theory replaces expected utility"
Prospect theory is descriptive (how people do decide), EU is normative (how rational agents should decide). They answer different questions. Address in Lesson 13.

### "Bayesian updating is optional"
If you have subjective probabilities and get evidence, Bayesian updating is the unique coherent way to revise beliefs (avoiding Dutch books). Address in Lesson 21.

### "Ambiguity aversion is irrational"
It violates expected utility axioms, but whether that makes it "irrational" depends on whether you accept those axioms as normative. This is a live debate. Address in Lessons 18-19.

### "You can always assign probabilities to uncertainty"
Savage says yes (via subjective probability), but critics argue some uncertainties are genuinely not probabilistic (e.g., Knightian uncertainty, radical ignorance). Address in Lesson 17.

## Learning Trajectory

### Early (Lessons 1-5): Foundations
Build intuition for preferences and rationality axioms. Keep it concrete — voting, consumer choice, simple comparisons.

### Middle (Lessons 6-16): Expected Utility and Risk
Introduce the formal machinery (EU, VNM axioms), then immediately show where it breaks (paradoxes, behavioral anomalies). This keeps students engaged and critical.

### Late (Lessons 17-22): Uncertainty
Shift from known to unknown probabilities. More abstract and philosophical — what does probability even mean when it's subjective?

### Synthesis (Lessons 23-25): Applications
Tie it all together with value of information, sequential problems, and reflection on normative vs. descriptive approaches.

## Spiral Approach

Several concepts get revisited at increasing depth:
- **Rationality**: Lesson 1 (intro) → Lesson 9 (violations) → Lesson 25 (normative vs. descriptive)
- **Probability**: assumed prerequisite → Lesson 17 (risk vs. uncertainty) → Lesson 20 (subjective) → Lesson 21 (Bayesian updating)
- **Decision trees**: Lesson 15 (basics) → Lesson 24 (with learning and sequential structure)
