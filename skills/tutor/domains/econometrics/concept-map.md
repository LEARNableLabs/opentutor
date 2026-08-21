# Econometrics — Concept Map

## Core Concepts (in learning order)

1. **Causal inference** — distinguishing correlation from causation in observational data
2. **Unbiasedness** — estimator's expected value equals true parameter
3. **Consistency** — estimator converges to true value as sample size grows
4. **Efficiency** — estimator has minimum variance among unbiased estimators
5. **Hypothesis testing** — using p-values and test statistics to evaluate claims
6. **Ordinary least squares (OLS)** — minimizing sum of squared residuals
7. **Fitted values** — predicted Y from regression equation
8. **Regression coefficients** — interpretation as marginal effects (ceteris paribus)
9. **Standard errors** — uncertainty around coefficient estimates. Depends on: 6
10. **t-statistics** — ratio of coefficient to standard error. Depends on: 8, 9
11. **Confidence intervals** — range containing true parameter with stated probability. Depends on: 9
12. **Gauss-Markov theorem** — conditions under which OLS is BLUE. Depends on: 3, 4, 6
13. **Multiple regression** — controlling for many variables simultaneously. Depends on: 6
14. **Partial effects** — isolating effect of one variable holding others constant. Depends on: 13
15. **Omitted variable bias** — bias from leaving out correlated variables. Depends on: 13, 14
16. **Endogeneity** — correlation between regressor and error term. Depends on: 15
17. **Interaction effects** — how one variable's effect depends on another. Depends on: 13
18. **Log transformations** — using logs to model elasticities and growth rates. Depends on: 8
19. **Elasticities** — percentage change interpretation. Depends on: 18
20. **Model selection** — choosing which variables to include using criteria. Depends on: 13
21. **Adjusted R-squared** — goodness of fit penalizing extra variables. Depends on: 20
22. **Heteroskedasticity** — non-constant error variance. Depends on: 12
23. **Robust standard errors** — heteroskedasticity-consistent inference. Depends on: 9, 22
24. **Residual plots** — visual diagnostics for model fit. Depends on: 7
25. **Autocorrelation** — correlation in errors over time. Depends on: 12
26. **Newey-West standard errors** — autocorrelation-robust inference. Depends on: 23, 25
27. **Reverse causality** — Y causes X instead of X causes Y. Depends on: 1, 16
28. **Instrumental variables (IV)** — using exogenous variation to identify causal effects. Depends on: 16, 27
29. **Two-stage least squares (2SLS)** — implementation of IV estimation. Depends on: 28
30. **Panel data** — repeated observations on same units over time. Depends on: 13
31. **Fixed effects** — controlling for time-invariant unobserved heterogeneity. Depends on: 30
32. **Difference-in-differences** — causal inference from policy changes. Depends on: 31
33. **Logit/probit models** — regression for binary dependent variables. Depends on: 8

## Dependencies

### Critical Chains

**Inference pathway**: OLS (6) → standard errors (9) → t-statistics (10) → hypothesis testing (5)
- Can't test hypotheses without understanding sampling variation

**Bias pathway**: multiple regression (13) → partial effects (14) → omitted variable bias (15) → endogeneity (16)
- Each step reveals deeper sources of bias

**Robustness pathway**: Gauss-Markov (12) → heteroskedasticity (22) → robust SE (23)
- Must know what OLS assumes before diagnosing violations

**Causality pathway**: endogeneity (16) → instrumental variables (28) → two-stage least squares (29)
- IV is the solution to endogeneity problems

**Panel pathway**: multiple regression (13) → panel data (30) → fixed effects (31) → difference-in-differences (32)
- Panel methods build on cross-sectional regression

### Key Bottlenecks

**Multiple regression (13)** — unlocks most advanced topics. Students must master interpretation of coefficients in multivariate settings before tackling:
- Omitted variable bias
- Interaction effects
- Panel methods
- Model selection

**Endogeneity (16)** — central concept that motivates instrumental variables, panel methods, and most identification strategies. Understanding endogeneity requires:
- Grasping difference between correlation and causation
- Knowing sources: omitted variables, reverse causality, measurement error

**Standard errors (9)** — foundation for all inference. Students need solid intuition before encountering heteroskedasticity-robust or clustered variants.

## Common Misconception Nodes

**Regression coefficients (8)** — students often think:
- "Controlling for X" means X is held constant (it's not — it's about partial correlation)
- Larger coefficient = more important variable (ignores units and scale)
- Significant coefficient proves causation (no — could be endogeneity)

**Omitted variable bias (15)** — students often think:
- Any omitted variable causes bias (only if correlated with included regressors AND outcome)
- Including more variables always reduces bias (can increase if you control for mediators or colliders)

**Heteroskedasticity (22)** — students often think:
- Heteroskedasticity biases coefficient estimates (it doesn't — only affects standard errors)
- Robust SEs "fix" heteroskedasticity (no — they just give correct inference despite it)

**Instrumental variables (28)** — students often think:
- Any correlated variable can be an instrument (must be exogenous)
- IV is always better than OLS (no — IV is less efficient, only needed when endogeneity present)

## Prerequisite Topics

- **Introductory statistics** — needed for hypothesis testing (5), sampling distributions, basic inference
- **Probability theory** — needed for understanding unbiasedness (2), consistency (3), distributions
- **Linear algebra** — needed for matrix formulation of OLS (6), understanding multivariate regression (13)
- **Calculus** — needed for understanding minimization problems (6), marginal effects (8, 14)

## Advanced Extensions (beyond intermediate)

- **Time series econometrics** — ARIMA, VAR, cointegration, unit roots
- **Machine learning methods** — lasso, ridge, cross-validation, prediction vs. inference
- **Causal inference** — DAGs, potential outcomes framework, regression discontinuity
- **Generalized method of moments (GMM)** — overidentified IV models
- **Limited dependent variables** — Tobit, Heckman selection, count models
- **Nonparametrics** — kernel regression, local polynomial methods
