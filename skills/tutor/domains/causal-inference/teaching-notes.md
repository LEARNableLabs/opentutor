# Causal Inference in Machine Learning — Teaching Notes

## Approach

Causal inference sits at the intersection of statistics, ML, and philosophy, making it both fascinating and potentially overwhelming. For intermediate ML students, the key is to build from familiar ground (prediction, regression, decision trees) toward causal reasoning. Start with motivation — concrete examples where great predictive models lead to terrible decisions — then introduce graphical models as visual thinking tools before diving into math. This topic rewards hands-on coding: tools like DoWhy and EconML make abstract concepts concrete and catch common mistakes. Expect students to struggle most with d-separation and colliders; use lots of diagrams and interactive examples.

## Common Misconceptions

1. **"Controlling for more variables is always better"** — Students often think adding covariates can't hurt. Reality: conditioning on colliders or mediators can introduce bias. Teaching fix: Show concrete examples where adjustment makes things worse (Berkson's paradox, M-bias).

2. **"Correlation ≠ causation means we can never learn causation from data"** — Students swing too far and become causal nihilists. Reality: Under explicit assumptions (encoded in DAGs), we *can* identify causal effects from observational data. Teaching fix: Emphasize the role of assumptions and how to encode/test them.

3. **"Propensity scores remove confounding"** — Students think propensity matching is magic that eliminates all bias. Reality: It only removes *observed* confounding under ignorability. Teaching fix: Stress that unobserved confounders remain a problem; no purely statistical method can solve hidden confounding.

4. **"Randomization guarantees no confounding"** — True on average, but students forget about selection bias, interference, and post-treatment variables. Teaching fix: Discuss real A/B test failures and SUTVA violations.

5. **"Machine learning automatically finds causal relationships"** — Deep learning hype leads students to believe black-box models discover causality. Reality: ML is a tool for *estimation*, not identification. Teaching fix: Show examples where deep nets predict well but intervene poorly.

6. **"DAGs represent the true causal structure"** — Students treat DAGs as discovered truth rather than assumed models. Reality: DAGs encode assumptions that should be justified by domain knowledge, not learned from data alone. Teaching fix: Emphasize that causal discovery algorithms make strong assumptions; domain expertise is essential.

7. **"Instrumental variables are always better than adjustment"** — IV seems clever and assumption-lean to students. Reality: IV estimates local effects (LATE), requires strong exclusion restrictions, and often has high variance. Teaching fix: Compare bias-variance tradeoffs across identification strategies.

8. **"Doubly robust means twice as good"** — Students think doubly robust estimators eliminate bias entirely. Reality: They're robust to misspecification of *one* model, not both. Teaching fix: Show examples where both models are wrong and DR fails.

9. **"CATE estimation is just supervised learning on subgroups"** — Students try to predict Y|X,T directly for heterogeneity. Reality: Treatment effect is a difference in potential outcomes, requiring special estimators. Teaching fix: Explain why naive approaches fail (confounding differs by subgroup).

10. **"More data always helps with causal inference"** — Students assume big data solves confounding. Reality: No amount of data can overcome unobserved confounding. Teaching fix: Show examples where huge observational datasets give wrong answers.

11. **"If the backdoor criterion fails, we can't identify the effect"** — Students think backdoor is the only game in town. Reality: Frontdoor, IV, and other strategies exist. Teaching fix: Present multiple identification strategies as a toolkit.

12. **"Causal forests find heterogeneity automatically"** — Students expect causal forests to discover effect modification without domain knowledge. Reality: You still need sufficient overlap and to avoid spurious splits. Teaching fix: Discuss honest splitting and interpretation challenges.

## Level Adjustments

**Beginner level:**
- Skip do-calculus and formal proofs of identifiability
- Focus on simple DAGs (3-4 nodes) and backdoor criterion only
- Use propensity matching as primary estimation method
- Avoid meta-learners; stick to stratification
- More worked examples, less theory

**Intermediate level (this curriculum):**
- Include backdoor and frontdoor, mention IV but don't derive estimators
- Cover d-separation with multiple examples and practice
- Introduce doubly robust estimation conceptually
- Cover S/T/X-learners and causal forests
- Balance theory with implementation (DoWhy, EconML)
- Emphasize when methods work vs when they fail

**Advanced level:**
- Full do-calculus and identification proofs
- Mediation analysis, time-varying treatments, spillover effects
- Bounds under partial identification
- Causal discovery algorithms and structure learning
- Sensitivity analysis and negative controls
- Modern methods: double ML, debiased ML, causal representation learning
- Derive estimators from first principles

## Rabbit Holes (Fascinating Connections)

- **Causal inference and fairness** — when to adjust for sensitive attributes vs when it creates bias. Drop in after lesson 12 (adjustment sets). Connects to algorithmic fairness debates.

- **Simpson's paradox in real datasets** — Berkeley admissions, kidney stone treatments, COVID-19 mortality rates. Drop in lesson 1 or 3. Shows causality isn't just theoretical.

- **Causal inference in reinforcement learning** — offline RL is just causal inference with sequential treatments. Drop in after lesson 16 (IPW). Connects to RL curriculum if student studies that.

- **Judea Pearl vs Donald Rubin debate** — two frameworks (graphical models vs potential outcomes) with philosophical differences. Drop in after lesson 5 (DAGs). Adds historical context.

- **Causal inference for LLMs** — Can we estimate causal effects of prompts? Interventions in latent space? Drop in lesson 25 (applications). Very current research area.

- **The paradox of A/B testing** — when randomized experiments give misleading results (interference, long-term effects, external validity). Drop in lesson 25. Challenges experimental gold standard.

- **Lord's paradox** — classic causal inference puzzle about weight change. Drop in after lesson 11 (identification). Great Socratic exercise.

- **Causal discovery with time series** — Granger causality vs Pearl causality, VAR models. Drop in after lesson 13 (alternative identification). Connects to econometrics.

- **Counterfactual fairness** — defining fairness via counterfactuals (would the decision change if race/gender changed?). Drop in after lesson 2 (counterfactuals). Deeply philosophical.

- **Causal inference in genomics** — Mendelian randomization as natural IV. Drop in after lesson 13 (IV). Shows causality across domains.

## Difficulty Progression

**Early lessons (1-4):** Difficulty 1-3. Build intuition with examples, introduce potential outcomes framework. Keep math light.

**Graphical models (5-10):** Difficulty 2-4, peak at d-separation. This is conceptually demanding but visual. Review at lesson 7.

**Identification (11-14):** Difficulty 2-4, peak at frontdoor/IV. More abstract than previous section. Review at lesson 14.

**Estimation (15-20):** Difficulty 2-4, peak at doubly robust. Lots of implementation to keep engagement high. Review at lesson 20.

**Heterogeneity & ML (21-24):** Difficulty 2-4, peaks at causal forests. Connects back to familiar ML territory but with new lens.

**Applications (25-26):** Difficulty 2-3. Integration and critique. Final review at lesson 26.

**Overall arc:** Gentle start → steep climb through graphical models → plateau during estimation (coding helps) → second peak at heterogeneity → gentle landing with applications.

## Teaching Tips

- **Use code early and often** — DoWhy's 4-step workflow (model, identify, estimate, refute) provides excellent scaffolding. Students grasp concepts faster when they can run code.

- **Draw lots of DAGs** — This topic is visual. Every lesson with a graph should include multiple examples students can draw themselves.

- **Real data matters** — Use classic datasets (LaLonde job training, twins, Titanic) so students can compare methods on the same problem.

- **Emphasize assumptions** — Every causal claim rests on untestable assumptions. Make these explicit and discuss how to justify/test them where possible.

- **Connect to ML intuitions** — Propensity scores are like balancing datasets, doubly robust is like ensembling, causal forests are random forests with a twist. Build bridges.

- **Celebrate failure modes** — When methods fail, explain *why*. Understanding failure builds deeper intuition than success.

- **Socratic questioning** — For teach-back and question lessons, pose causal puzzles and let students work through the logic before revealing answers.
