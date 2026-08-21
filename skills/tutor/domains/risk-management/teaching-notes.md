# Risk Management and Actuarial Science — Teaching Notes

## Approach

Actuarial science sits at the intersection of probability, statistics, economics, and finance — it's applied mathematics with real stakes. At the intermediate level, emphasize the **why** behind every formula: actuaries don't just compute, they manage risk. Balance rigor with intuition: students should understand both the mathematical derivation and the business context. Use real insurance scenarios throughout (pricing auto insurance, valuing pension liabilities, setting reserves for catastrophe bonds). Encourage computational practice with R or Python — students should be comfortable fitting distributions, running Monte Carlo simulations, and implementing Panjer recursion, not just proving theorems.

## Common Misconceptions

1. **"The expected value is what we should charge"** — students often forget that premiums must exceed expected losses to cover variance, expenses, and profit. Emphasize the safety loading and why undiversifiable risk requires capital charges.

2. **"Independence is always a safe assumption"** — in aggregate loss models, frequency and severity must be independent, but students sometimes assume all risks are independent. Discuss catastrophic events (hurricanes, pandemics) that create dependence, and introduce copulas as the solution.

3. **"Ruin probability is the probability of a single large claim"** — ruin is about the surplus process over infinite time, not a one-time event. Students confuse ruin probability with the probability of a deficit in a single period.

4. **"Higher deductibles always decrease variance for the insurer"** — deductibles reduce mean claim size but the relationship with variance depends on the distribution. Work through examples where deductibles increase the coefficient of variation.

5. **"Credibility is just a weighted average"** — it's an optimal estimator under squared error loss with specific variance structure assumptions. Students miss that Z in Bühlmann credibility has a precise formula based on within-group and between-group variance, not arbitrary weights.

6. **"Mortality rates are deterministic"** — students coming from pure probability may not grasp that mortality improvement is uncertain. Emphasize stochastic mortality models and parameter risk.

7. **"Life insurance and annuities are opposites"** — while cash flows are reversed, both are contingent on survival status. Students often treat them as independent products rather than seeing annuities as hedges for longevity risk.

8. **"Reserves are savings accounts"** — reserves are accounting liabilities, not cash set aside. Explain the difference between statutory reserves (conservative, regulatory) and economic reserves (best estimate).

9. **"We can fit any distribution if we try enough"** — students may overfit with complex models. Emphasize parsimony, domain knowledge (e.g., Pareto for liability claims, Weibull for time-to-event), and out-of-sample validation.

10. **"VaR captures all the risk"** — VaR ignores tail behavior beyond the quantile. Always pair with Tail-VaR (TVaR) which is coherent and considers tail losses. Discuss the 2008 financial crisis as a case where VaR failed catastrophically.

## Level Adjustments

### For Intermediate (Current Level)

- **Formalism**: Derive key results (e.g., adjustment coefficient, Bühlmann credibility formula) but don't require measure theory. Use Riemann integrals and discrete probability.
- **Computational emphasis**: Students should implement Panjer recursion, fit distributions via MLE, simulate aggregate losses. Balance theory (50%) with coding (50%).
- **Exam alignment**: Content maps to SOA Exams P, FM, FAM, ALTAM. Include practice problems at this level.
- **Applications**: Mix stylized examples (easy numbers) with realistic case studies (messy data, model selection trade-offs).
- **Prerequisites**: Assume calculus-based probability (MGFs, transformations), basic statistics (MLE, confidence intervals), but review as needed.

### If Advancing to Advanced

- **Add**: Measure-theoretic probability, martingale theory for surplus process, copula theory for dependence, stochastic mortality models (Lee-Carter, CBD), credible loss reserving (chain ladder, Bornhuetter-Ferguson), modern topics (machine learning for claims triage, climate risk modeling).
- **Depth**: Prove Lundberg inequality rigorously, derive Bühlmann-Straub credibility, study non-proportional reinsurance (XL, stop-loss).
- **Research flavor**: Read recent papers from ASTIN Bulletin, Scandinavian Actuarial Journal, North American Actuarial Journal.

### If Simplifying to Beginner

- **Focus**: Intuition over derivation. E.g., explain *why* Poisson models claim counts (rare events, independence) without deriving the PMF from first principles.
- **Computation**: More guided worksheets, less open-ended coding. Provide R/Python templates.
- **Reduce scope**: Drop ruin theory entirely, simplify credibility to limited fluctuation only (skip Bühlmann), treat reserves as a black box.
- **Examples**: More "plug and chug" with standard tables; fewer derivations from scratch.

## Rabbit Holes (for engagement)

- **The Lindy effect and Pareto distributions** — connect heavy-tailed claim distributions to power laws in nature, economics, and technology (Taleb's work). Drop this in when discussing Pareto models for liability claims.

- **Insurance and gambling** — actuarial science began with life annuities sold by de Witt and Halley. Discuss the historical link to Pascal, Fermat, and the birth of probability theory. Great for lesson 1 or 7.

- **The St. Petersburg paradox** — use this to motivate utility theory and why premiums aren't just expected values. Fits well with lesson 1 or 2.

- **Climate change and tail risk** — emerging risks (lesson 30) are not just technical extensions — they challenge the entire actuarial paradigm based on stationarity and historical data. Reference Nassim Taleb's "Black Swan" and the failure of models in 2008.

- **Demographic modeling and population aging** — connect life tables (lesson 7) to current policy debates: Social Security solvency, Medicare costs, pension crises. Students love real-world stakes.

- **Reinsurance as diversification** — explain how reinsurance creates a global risk market, similar to financial derivatives. Connect to lessons on aggregate loss and ruin theory.

- **Actuaries in the wild** — beyond insurance, actuaries work in climate modeling, pandemic response, sports analytics (injury rates), loyalty programs (customer churn), and even dating apps (match probability). Show the breadth.

- **The birthday problem as a frequency model** — use this classic puzzle to illustrate Poisson approximation and why rare event modeling matters. Fits lesson 16 or 17.

## Difficulty Progression Notes

### Early Lessons (1-6): Foundation Building
- Difficulty 2-3, mostly mini-lessons and questions
- Review foundational probability in actuarial context (survival functions, hazard rates)
- Students should feel comfortable — this is ground they've seen before, now with insurance flavor

### Life Contingencies (7-13): First Major Topic
- Difficulty ramps to 3-4 for APV and reserves (lessons 8-10)
- Lesson 10 (reserves/Thiele's equation) is the first peak difficulty (4)
- Review at lesson 13 consolidates before shifting to loss models

### Loss and Frequency Models (14-20): Technical Core
- Multiple difficulty 4 lessons (15, 17, 18, 19) — this is the heart of the curriculum
- Computational intensity increases: students should be coding Panjer recursion by lesson 19
- Review at lesson 20 is critical before moving to abstract risk theory

### Risk Theory (21-23): Peak Difficulty
- Two difficulty 5 lessons (22, 23) — adjustment coefficient and heavy-tailed theory
- These are the hardest concepts in the curriculum; expect students to struggle
- Use extra examples, simulations to build intuition

### Credibility and Pricing (24-27): Application and Synthesis
- Difficulty settles to 3-4, applying earlier theory to pricing problems
- Credibility is conceptually challenging (shift to Bayesian thinking) but computationally easier than Panjer recursion
- Review at lesson 27 before final module

### ERM (28-30): Integration and Horizon Expansion
- Difficulty 3-4, more conceptual than computational
- Lesson 30 (emerging risks) is forward-looking, open-ended — encourages exploration

## Suggested Pacing

- **Intensive track** (daily): ~6 weeks for 30 lessons with reviews
- **Standard track** (3x/week): ~10 weeks
- **Relaxed track** (2x/week): ~15 weeks

Build in extra review days if student struggles with:
- Lesson 10 (reserves) — add a computational practice day
- Lessons 18-19 (Panjer recursion) — add a coding workshop
- Lessons 22-23 (adjustment coefficient) — add a worked examples session

## Tools and Technologies

Recommend students use:
- **R packages**: `actuar` (actuarial functions), `ChainLadder` (loss reserving), `lifecontingencies` (life insurance)
- **Python libraries**: `scipy.stats` (distributions), `numpy` (computation), `matplotlib`/`seaborn` (visualization)
- **Datasets**: CAS loss data, SOA mortality tables, Wisconsin insurance datasets
- **Visualization**: Plot loss distributions, simulate surplus processes, visualize credibility weights

Assign mini-projects:
- Fit a Pareto distribution to homeowners insurance claims
- Implement Panjer recursion from scratch
- Build a Shiny app or Jupyter notebook for credibility-weighted premiums
- Simulate ruin probability via Monte Carlo and compare to Lundberg bound

## Assessment Strategies

- **Formative**: After each module, assign 3-5 SOA/CAS exam-style problems
- **Conceptual checks**: Teach-back lessons (5, 15, 19) should be oral or written explanations
- **Computational projects**: Code assignments for lessons 18-19 (Panjer), 24-26 (credibility)
- **Capstone**: Final project analyzing real insurance data — fit models, compute reserves or credibility premiums, write up findings

## Connection to Professional Exams

This curriculum covers material from:
- **SOA Exam P** (Probability): lessons 1-6, 12, 16-17
- **SOA Exam FM** (Financial Mathematics): background for lesson 8-10 (interest theory assumed)
- **SOA Exam FAM** (Fundamentals of Actuarial Mathematics): lessons 7-11 (life), 14-19 (loss models)
- **SOA Exam ALTAM** (Advanced Long-Term Actuarial Mathematics): lessons 10-11 (reserves)
- **SOA Exam ASTAM** (Advanced Short-Term Actuarial Mathematics): lessons 14-23 (loss/risk theory), 24-26 (credibility)
- **CAS Exam MAS-I** (Modern Actuarial Statistics I): lessons 24-26 (credibility), plus regression/GLMs (not covered here)

Students aiming for exams should supplement with official study manuals (Coaching Actuaries, ASM, TIA) and past exam problems.
