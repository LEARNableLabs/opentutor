# Econometrics — Teaching Notes

## Approach

Econometrics sits at the intersection of statistics (theory), economics (domain knowledge), and computation (data work). At the intermediate level, emphasize **intuition over formalism**: students should understand *why* methods work and *when* they fail, not just memorize formulas. Build from concrete examples (wage regressions, policy evaluation) toward abstractions (endogeneity, identification). Encourage hands-on practice with real datasets early — econometrics only "clicks" when students wrestle with messy data, check residual plots, and debug their own regressions. Use visual diagnostics (scatter plots, residual plots) liberally; many students are visual learners and equations alone won't stick.

The field has evolved from "cookbook" regression toward causal inference and computational methods. Modern pedagogy balances traditional OLS mechanics (still foundational) with DAGs, potential outcomes, and reproducible workflows. At intermediate level, introduce causal thinking early but defer formal DAG/PO frameworks to advanced courses.

## Common Misconceptions

1. **"Regression proves causation"** — students conflate statistical significance with causal effects. Emphasize repeatedly: regression measures *association*, causation requires *identification* (randomization, IV, natural experiments). Use examples where correlation is obviously spurious (ice cream sales and drowning).

2. **"Controlling for X means holding X constant"** — students think "controlling for education" means comparing people with identical education. Reality: it's about partial correlation, residualizing. Teach this using Venn diagrams or FWL theorem visually.

3. **"More variables = better model"** — students throw in every available variable to "increase R-squared." They don't realize: (a) multicollinearity reduces precision, (b) bad controls (mediators, colliders) introduce bias, (c) overfitting harms prediction. Teach adjusted R-squared, AIC/BIC, and the danger of data mining.

4. **"Heteroskedasticity biases my coefficients"** — students panic when they see heteroskedasticity and think their estimates are wrong. Clarify: OLS coefficients are still unbiased/consistent, only standard errors are affected. Solution: robust SEs, not re-estimation.

5. **"Bigger coefficient = more important"** — students compare standardized vs. unstandardized coefficients incorrectly, or ignore units. Teach: coefficient size depends on units of measurement. Standardize if comparing magnitudes, or use elasticities.

6. **"p < 0.05 means the result is true/important"** — students worship p-values. Emphasize: statistical significance ≠ economic/practical significance. A tiny effect can be "significant" with huge N. Discuss effect sizes, confidence intervals, and the replication crisis.

7. **"Adding a control always reduces omitted variable bias"** — students don't understand that controlling for mediators or colliders *creates* bias. Introduce DAGs at a basic level (even without full formalism) to show when controls help vs. harm.

8. **"IV is always better than OLS"** — students learn IV solves endogeneity and think they should always use it. Clarify: IV requires strong instruments (relevance + exogeneity), trades bias for variance, and is only needed when endogeneity is present. OLS is more efficient when valid.

9. **"Outliers should always be removed"** — students see a weird data point and delete it. Teach: investigate first (coding error? genuine extreme value?), report robustness checks, use robust methods (robust regression, winsorizing) rather than arbitrary deletion.

10. **"Logarithms make things 'more normal'"** — students apply logs without understanding why. Teach: logs are for multiplicative relationships, elasticities, or stabilizing variance — not a magic normality fix. Discuss when logs make sense (income, prices) vs. when they don't (binary, zero-inflated variables).

## Level Adjustments

### Compared to Introductory

- **More emphasis on violations**: intro assumes classical assumptions hold; intermediate explores what happens when they don't (heteroskedasticity, autocorrelation, endogeneity)
- **Causal inference**: intro focuses on correlation; intermediate introduces IV, panel methods, and difference-in-differences
- **Matrix notation**: intro uses scalar formulas; intermediate may introduce matrix formulation (but keep it minimal unless students have strong linear algebra)
- **Real data**: intro uses clean toy datasets; intermediate should involve messy data (missing values, outliers, recoding)

### Compared to Graduate

- **Less formalism**: skip detailed proofs of consistency/asymptotic normality; focus on intuition and application
- **Fewer distributions**: intro t/F-tests are fine; don't overload with chi-squared, Wishart, etc.
- **Narrower scope**: skip GMM, nonparametrics, semiparametrics, structural models; stick to OLS, IV, panel, basic MLE
- **More scaffolding**: grad students can read papers independently; intermediate students need guided replication exercises and step-by-step interpretation

### Specific to Intermediate

- Assume solid statistics background (hypothesis testing, confidence intervals, sampling distributions) but review briefly
- Introduce concepts verbally/visually before showing formulas
- Use real economic examples throughout (labor, education, development, health)
- Require hands-on software practice (R/Python/Stata) with emphasis on reproducibility (scripts, not point-and-click)
- Build toward reading/critiquing empirical papers, but don't expect students to replicate cutting-edge methods

## Rabbit Holes

### When to Deploy

- **Omitted variable bias formula** (lesson 11) — show bias = β₂ × δ where δ is slope from auxiliary regression. Helps students see *direction* of bias, not just "bias exists."

- **Frisch-Waugh-Lovell theorem** (lesson 10 or 14) — regression coefficients are invariant to partialing out. Demystifies "controlling for" and connects to residual plots.

- **Selection bias and Heckman** (after lesson 26) — if students ask about non-random samples or survey non-response. Links to potential outcomes framework.

- **Regression discontinuity** (after lesson 24) — visually compelling identification strategy; great for students interested in policy evaluation.

- **Simpson's paradox** (lesson 15 or 22) — powerful example where aggregate correlation reverses within groups. Shows danger of ignoring confounders.

- **p-hacking and specification searching** (lesson 21) — timely given replication crisis. Discuss pre-registration, multiple testing corrections, but don't make students cynical.

- **Measurement error** (after lesson 16 or 23) — attenuation bias from noisy regressors. Connects to IV (IV can fix measurement error if instrument is classical).

- **Spatial econometrics** (after lesson 25) — if students work with geographic data. Spatial autocorrelation violates independence assumption.

### Connections to Other Fields

- **Machine learning** — contrast prediction (ML goal) vs. causal inference (econometrics goal). Discuss overfitting, cross-validation, regularization (lasso/ridge). Good students will ask "why not use ML?"

- **Experimental economics** — randomized controlled trials as gold standard for causation. Discuss external validity, ethics, cost.

- **Data science** — overlap in tools (R, Python, pandas) but different goals. Econometricians care about standard errors and identification; data scientists care about prediction accuracy.

- **Computational economics** — numerical methods, simulation, bootstrap. Introduce bootstrap for inference if students struggle with asymptotic theory.

## Difficulty Progression

**Lessons 1-4 (Foundations)**: Ease in with conceptual material (difficulty 1-3). Build intuition for causation, estimation, testing. Mostly verbal, minimal math.

**Lessons 5-9 (Simple Regression)**: Core mechanics of OLS (difficulty 2-3). Heavier on algebra but still single-variable. Include review at lesson 6.

**Lessons 10-15 (Multiple Regression)**: Peak difficulty (difficulty 3-4). Multivariate thinking is cognitively demanding. Omitted variable bias and interactions are the hardest concepts in the course for most students. Review at lesson 12 before pushing to interactions/logs.

**Lessons 16-21 (Diagnostics)**: Mixed difficulty (difficulty 1-4). Some lessons are conceptually lighter (residual plots), others harder (heteroskedasticity mechanics). Review at lesson 18 midway through.

**Lessons 22-26 (Advanced Methods)**: Return to peak difficulty (difficulty 3-4) with IV and panel methods, but students now have more context. Review at lesson 24 before final push. End with logit/probit (difficulty 3) rather than ramping up, so students finish feeling confident.

**Overall arc**: Start gentle, ramp up through multiple regression (peak at lessons 11-15), ease slightly with diagnostics, return to challenging material (IV/panel), finish strong but not overwhelming.

## Software Pedagogy

- **Start early**: lesson 5 should involve running a simple regression in R/Python/Stata. Don't wait until lesson 15 to introduce software.
- **Emphasize reproducibility**: teach scripts, not point-and-click. Use RMarkdown, Jupyter notebooks, or Stata do-files.
- **Datasets**: use Wooldridge's datasets (wage1, crime1, etc.) — well-documented, manageable size, pedagogically designed.
- **Libraries**: in R, teach `lm()`, `lmtest`, `sandwich`, `AER`, `plm`. In Python, `statsmodels` and `linearmodels`. In Stata, core commands (`regress`, `ivreg2`, `xtreg`).
- **Debugging skills**: teach students to read error messages, check dimensions, inspect data (`summary()`, `head()`, `str()`). Econometrics students often have weak programming backgrounds.

## Assessment Ideas

- **Replication exercises**: "Reproduce Table 3 from this paper using the provided data."
- **Interpretation questions**: "The coefficient on education is 0.08. What does this mean? What assumptions are needed for a causal interpretation?"
- **Diagnostic practice**: "Here are residual plots from a regression. What assumptions are violated? How would you fix it?"
- **Policy evaluation**: "A city raises minimum wage. Design a regression to estimate the effect on employment. What's your identification strategy?"
- **Critique empirical work**: "Read this op-ed citing a regression. What are the threats to causal inference?"
