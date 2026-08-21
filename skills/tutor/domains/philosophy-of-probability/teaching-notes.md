# Philosophy of Probability and Statistics — Teaching Notes

## Approach

Philosophy of probability sits at the intersection of mathematics, philosophy, and scientific practice. At the intermediate level, the goal is to move beyond "here's how to calculate" to "what does this calculation mean?" and "when is it appropriate?" The subject is naturally dialectical — Bayesian vs frequentist debates, objectivity vs subjectivity, inference vs decision-making. Embrace this by presenting competing perspectives fairly, then helping students develop their own informed position. Use concrete examples from science, medicine, and policy to ground abstract philosophical disputes. The best learning happens when students realize their intuitive statistical reasoning commits them to philosophical positions they didn't know they held.

## Common Misconceptions

1. **"Bayesian means subjective, frequentist means objective"** — Students often think Bayesian inference is "just opinion" while frequentist methods are purely objective. In reality: (a) frequentist methods involve subjective choices (model, test statistic, stopping rule), and (b) objective Bayesian methods exist (reference priors, maximum entropy). The real difference is what probability means, not whether it's subjective.

2. **"P-value = probability the null is true"** — The most persistent statistical misconception. Students confuse P(data|H₀) with P(H₀|data). Repeatedly emphasize: p-values assume the null is true, they don't measure how likely it is. Use concrete examples: if p=0.03, this does NOT mean there's a 97% chance the effect is real.

3. **"Correlation never, ever implies causation"** — Students overcorrect from "correlation equals causation" to "correlation can never inform causation." Truth: correlation plus causal assumptions (temporal ordering, no unmeasured confounding, etc.) can support causal inference. Randomized experiments work precisely because they generate correlation that does imply causation.

4. **"A statistically significant result means it's important"** — Students confuse statistical significance (p < 0.05) with practical/substantive significance. A tiny, meaningless effect can be highly significant with enough data. Emphasize effect sizes and confidence intervals, not just p-values.

5. **"Bayesian priors are arbitrary and unscientific"** — Students may think Bayesian inference is invalidated by requiring priors. Show: (a) prior choice can be justified (previous data, maximum entropy, invariance principles), (b) with enough data, likelihood dominates the prior, (c) frequentist methods also have "priors" hidden as modeling assumptions.

6. **"The replication crisis means most science is false"** — Students may become overly cynical. Reality: the crisis reveals problems with publication incentives and statistical practices, not that the scientific method is broken. Many findings do replicate, especially in fields with good practices (preregistration, larger samples, open data).

7. **"Statistical inference is mechanical/algorithmic"** — Students think you just plug numbers into formulas and get answers. Emphasize: every analysis involves judgment about models, assumptions, what to test, how to measure. Statistics is applied philosophy, not pure mathematics.

8. **"Randomization eliminates all confounding"** — Students think randomization is magic. Clarify: randomization ensures exchangeability in expectation (on average across hypothetical repetitions), but any particular randomization can be unbalanced. That's why we check baseline characteristics.

9. **"You must choose: be either Bayesian or frequentist"** — Students think these are incompatible worldviews. In practice, many statisticians use both approaches pragmatically depending on context. Gelman: "I'm a Bayesian in the streets and a frequentist in the sheets" (checking calibration, posterior predictive checks).

10. **"Philosophy of statistics is about historical debates between dead people"** — Students may think this is purely historical. Emphasize: these debates matter for current practice. The replication crisis, p-value controversies, causal inference methods — all have deep philosophical roots. Understanding the philosophy helps you practice better statistics.

## Level Adjustments

**For intermediate students (this curriculum):**
- Assume comfort with basic probability, hypothesis testing, confidence intervals
- Can handle formal arguments (Dutch books, likelihood principle) but don't require measure theory
- Focus on developing critical thinking about statistical practice — reading papers, evaluating claims
- Balance philosophical depth with practical application
- Use real examples from psychology, medicine, social science where statistical controversies have played out
- Introduce causal graphs formally but don't dive into full do-calculus

**If adjusting to beginner:**
- Start with more concrete examples, less formal argumentation
- Simplify discussions of interpretations — focus on Bayesian vs frequentist intuitions
- Skip likelihood principle, sufficiency, advanced topics
- More emphasis on recognizing fallacies (correlation/causation, p-value misinterpretation) than on philosophical foundations
- Use interactive visualizations heavily

**If adjusting to advanced:**
- Introduce formal probability theory (measure theory foundations)
- Cover complete class theorems, admissibility, more decision theory
- Deeper dive into objective Bayesian methods (reference priors, Jeffreys priors)
- Full causal inference framework (do-calculus, identification)
- Philosophical foundations: probability as logic (Cox's theorem, Jaynes), counterfactual theories
- Read primary sources (Fisher, Neyman, Pearson, de Finetti)

## Rabbit Holes (Fascinating Connections)

- **The Problem of Induction** — Hume's classic challenge connects directly to statistical inference. When to drop in: after Bayes' theorem, when discussing justification for updating beliefs from data. Ask: "How do we know the future will resemble the past?"

- **Quantum Probability** — Quantum mechanics uses non-commutative probability, violating classical assumptions. When to drop in: after covering probability interpretations, especially propensity. Show how physics pushed probability foundations.

- **Algorithmic Randomness** — Kolmogorov complexity gives a different foundation for probability via compressibility. When to drop in: when discussing what "random" means, or objective vs subjective probability.

- **Game Theory and Decision Making** — Von Neumann-Morgenstern utility theory connects probability to rational choice. When to drop in: after Dutch book arguments, or when discussing Bayesian decision theory.

- **Machine Learning and Statistical Learning Theory** — Modern ML often sidesteps traditional statistics but faces similar philosophical issues (overfitting = p-hacking, inductive bias = priors). When to drop in: when discussing model selection or practical significance.

- **Legal Reasoning and Proof** — How should courts interpret probabilistic evidence? (Prosecutor's fallacy = p-value fallacy). When to drop in: after p-value misconceptions, as a high-stakes real-world application.

- **Simpson's Paradox** — A correlation can reverse when you condition on a variable. Deep connection to causal graphs. When to drop in: during causality module, as a puzzle that causal thinking resolves.

- **The Reference Class Problem** — For frequentist probability, which reference class should we use? (Is this a mortality rate for "humans" or "70-year-old smokers"?). When to drop in: when discussing frequentist interpretation's challenges.

- **Dutch Book Arguments for Decision Theory** — Just as coherence arguments justify probability axioms, similar arguments justify expected utility. When to drop in: if students are interested in decision theory after Dutch books for probability.

- **Fiducial Inference** — Fisher's attempt to get Bayesian-like intervals without priors, which mostly failed. When to drop in: when contrasting Fisher vs Neyman-Pearson vs Bayesian approaches — shows even Fisher wanted something the frequentist framework couldn't give.

## Difficulty Progression

The curriculum builds in waves:

1. **Lessons 1-6** (interpretations) — Start accessible (2), peak at Dutch books (4), review (1)
2. **Lessons 7-13** (inference) — Start with Bayes' theorem (2), peak at likelihood principle and Fisher/Neyman debates (4), drop for review (2)
3. **Lessons 14-18** (causality) — Start accessible with correlation/causation (2), build to observational studies (4), review (1)
4. **Lessons 19-25** (practice) — Mix of difficulties, peaking at multiple testing (4), ending with reflective synthesis (3)

Reviews are strategically placed to consolidate understanding before moving to the next module. The hardest concepts (Dutch books, likelihood principle, observational causal inference, multiple testing) are lesson types that encourage active engagement (question, teach-back) rather than passive reading.
