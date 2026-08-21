# Philosophy of Probability and Statistics — Concept Map

## Core Concepts (in learning order)

1. **Probability interpretations** — different ways to understand what probability means
2. **Frequentist interpretation** — probability as long-run relative frequency in repeated trials
3. **Bayesian interpretation** — probability as degree of belief or credence
4. **Objective vs subjective probability** — whether probability is mind-independent or epistemic. Depends on: probability interpretations
5. **Single-case probability** — assigning probabilities to unique events. Depends on: probability interpretations
6. **Coherence** — logical consistency requirements for probability assignments. Depends on: Bayesian interpretation
7. **Dutch book arguments** — justification for probability axioms via betting. Depends on: coherence, Bayesian interpretation
8. **Bayes' theorem** — updating beliefs from evidence. Depends on: Bayesian interpretation
9. **Prior and posterior distributions** — beliefs before and after seeing data. Depends on: Bayes' theorem
10. **Prior selection** — choosing initial probability distributions. Depends on: prior and posterior distributions
11. **Likelihood** — probability of data given parameters. Depends on: Bayes' theorem
12. **Significance testing (Fisher)** — Fisher's approach to testing hypotheses. Depends on: frequentist interpretation
13. **Hypothesis testing (Neyman-Pearson)** — formalized decision framework with error rates. Depends on: frequentist interpretation
14. **Likelihood principle** — all evidence is in the likelihood function. Depends on: likelihood
15. **Sufficiency** — minimal summaries that preserve all information. Depends on: likelihood principle
16. **Model assumptions** — conditions under which statistical methods are valid. Depends on: statistical inference basics
17. **Robustness** — insensitivity to violations of assumptions. Depends on: model assumptions
18. **Correlation vs causation** — statistical association vs causal relationship
19. **Confounding** — spurious association due to common cause. Depends on: correlation vs causation
20. **Causal graphs (DAGs)** — graphical models representing causal structure. Depends on: correlation vs causation
21. **Randomization** — random assignment to eliminate confounding. Depends on: confounding, causal graphs
22. **Observational studies** — learning from non-experimental data. Depends on: randomization, confounding
23. **P-values** — probability of data as extreme under null hypothesis. Depends on: significance testing
24. **P-hacking** — manipulating analysis to achieve significance. Depends on: p-values
25. **Multiple testing** — inflated error rates from many tests. Depends on: p-values, hypothesis testing
26. **False discovery rate** — expected proportion of false positives. Depends on: multiple testing
27. **Effect size** — magnitude of a phenomenon. Depends on: statistical vs practical significance
28. **Replication crisis** — failure to reproduce published findings. Depends on: p-hacking, publication bias
29. **Methodological reform** — proposals to improve statistical practice. Depends on: replication crisis, p-values

## Dependencies

### Interpretations cluster
- **Objective vs subjective probability** requires understanding that there are multiple interpretations — frequentist is typically objective, Bayesian can be subjective
- **Single-case probability** is problematic for frequentist interpretation (can't repeat an election infinitely) but natural for Bayesian
- **Coherence** and **Dutch book arguments** provide rational foundations for Bayesian probability by showing incoherent beliefs lead to sure losses

### Inference cluster
- **Bayes' theorem** mechanically combines prior, likelihood, and data to get posterior
- **Prior selection** is philosophically contentious — where do priors come from if they're supposed to be subjective?
- **Likelihood principle** says only the likelihood matters, which Bayesians accept but frequentists violate (via stopping rules, etc.)
- **Sufficiency** is a concept both paradigms care about — a sufficient statistic captures all relevant information

### Causality cluster
- **Causal graphs** formalize the structure that generates correlations through confounding
- **Randomization** breaks confounding by making treatment independent of potential confounders
- **Observational studies** require careful reasoning about causal structure since we can't randomize

### Practice cluster
- **P-hacking** exploits researcher degrees of freedom to find significant results
- **Multiple testing** mechanically inflates false positive rate when doing many tests
- **Replication crisis** is partly explained by publication bias + p-hacking + low power
- Understanding **effect size** helps distinguish statistical significance (sample size dependent) from practical importance

## Bottlenecks

- **Understanding probability interpretations** is essential before diving into inference — students must grasp that "probability" is philosophically contested
- **Bayes' theorem** is the mathematical bottleneck for Bayesian inference — must be comfortable with it before discussing priors, posteriors, etc.
- **Causal graphs** are the key conceptual tool for reasoning about causation — without them, discussions of confounding remain fuzzy
- **P-values** are widely misunderstood — correcting the misconception that p-values = probability hypothesis is true is crucial before discussing problems with NHST

## Common Misconceptions

- **"Bayesian is subjective, frequentist is objective"** — oversimplification; there are objective Bayesian approaches and subjective frequentist choices
- **"P-value is the probability the null hypothesis is true"** — no, it's P(data | null), not P(null | data)
- **"Correlation never implies causation"** — correlation plus assumptions (e.g., temporal ordering, no confounders) can support causal claims
- **"Randomization guarantees no confounding"** — it guarantees exchangeability in expectation, but any particular randomization can be unbalanced
- **"Bayesians never use p-values"** — pragmatic Bayesians use many tools; philosophical purity is rare in practice
- **"Priors are arbitrary"** — while subjective priors exist, there are principled methods (reference priors, maximum entropy) for prior construction

## Prerequisite Topics

- **Basic probability theory** — needed for understanding all interpretations, Bayes' theorem, likelihood
- **Introductory statistics** — hypothesis testing, confidence intervals, distributions (needed to critique these methods philosophically)
- **Logical reasoning** — needed for Dutch book arguments, coherence conditions, understanding philosophical arguments
- **Scientific method basics** — helpful for understanding role of statistics in science, replication, causality
