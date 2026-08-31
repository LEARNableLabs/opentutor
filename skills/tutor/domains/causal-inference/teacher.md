# Causal inference in machine learning — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 10 lessons (38%)
- **Socratic questions** — 5 lessons (19%)
- **review and consolidation sessions** — 4 lessons (15%)
- **real-world application challenges** — 3 lessons (12%)
- **teach-back exercises (student explains)** — 2 lessons (8%)
- **curated resource exploration** — 2 lessons (8%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 42% accessible (1-2), 38% standard (3), 19% challenging (4-5).

Difficulty peaks:
- Day 8: "When does information flow through a graph?" (difficulty 4)
- Day 13: "What if there's no way to block all backdoor paths?" (difficulty 4)
- Day 17: "Can we protect against model misspecification?" (difficulty 4)
- Day 22: "How can ML estimate personalized treatment effects?" (difficulty 4)
- Day 23: "What are causal forests and when should you use them?" (difficulty 4)

## Domain Hooks
- **Causal inference and fairness** — when to adjust for sensitive attributes vs when it creates bias. Drop in after lesson 12 (adjustment sets). Connects to algorithmic fairness debates.

- **Simpson's paradox in real datasets** — Berkeley admissions, kidney stone treatments, COVID-19 mortality rates. Drop in lesson 1 or 3. Shows causality isn't just theoretical.

- **Causal inference in reinforcement learning** — offline RL is just causal inference with sequential treatments. Drop in after lesson 16 (IPW). Connects to RL curriculum if student studies that.

- **Judea Pearl vs Donald Rubin debate** — two frameworks (graphical models vs potential outcomes) with philosophical differences. Drop in after lesson 5 (DAGs). Adds historical context.

- **Causal inference for LLMs** — Can we estimate causal effects of prompts? Interventions in latent space? Drop in lesson 25 (applications). Very current research area.

- **The paradox of A/B testing** — when randomized experiments give mislead

## Common Failure Modes
1. **"Controlling for more variables is always better"** — Students often think adding covariates can't hurt. Reality: conditioning on colliders or mediators can introduce bias. Teaching fix: Show concrete examples where adjustment makes things worse (Berkson's paradox, M-bias).

2. **"Correlation ≠ causation means we can never learn causation from data"** — Students swing too far and become causal nihilists. Reality: Under explicit assumptions (encoded in DAGs), we *can* identify causal effects from observational data. Teaching fix: Emphasize the role of assumptions and how to encode/test them.

3. **"Propensity scores remove confounding"** — Students think propensity matching is magic that eliminates all bias. Reality: It only removes *observed* confounding under ignorability. Teaching fix: Stress that unobserved confounders remain a problem; no purely statistical method can solve hidden confounding.

4. **"Randomization guarantees no confounding"** — True on average, but students fo

## Vocabulary
Key terms for this domain: correlation vs causation, prediction vs intervention, Simpson's paradox, potential outcomes, counterfactuals, treatment and control, SUTVA, consistency, ignorability, positivity, confounding, selection bias, measurement error, DAGs, nodes and edges (and 67 more).