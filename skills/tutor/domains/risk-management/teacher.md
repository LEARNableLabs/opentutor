# Risk Management and Actuarial Science — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 12 lessons (39%)
- **Socratic questions** — 6 lessons (19%)
- **real-world application challenges** — 6 lessons (19%)
- **review and consolidation sessions** — 4 lessons (13%)
- **teach-back exercises (student explains)** — 2 lessons (6%)
- **curated resource exploration** — 1 lessons (3%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 29% accessible (1-2), 32% standard (3), 39% challenging (4-5).

Difficulty peaks:
- Day 10: "Where does the money come from to pay future claims?" (difficulty 4)
- Day 15: "Can you derive the distribution of losses above a threshold?" (difficulty 4)
- Day 17: "What if we only observe claims that were actually reported?" (difficulty 4)
- Day 18: "How do we build the total loss distribution from parts?" (difficulty 4)
- Day 19: "Can you calculate aggregate losses when frequency is negative binomial?" (difficulty 4)

## Domain Hooks
- **The Lindy effect and Pareto distributions** — connect heavy-tailed claim distributions to power laws in nature, economics, and technology (Taleb's work). Drop this in when discussing Pareto models for liability claims.

- **Insurance and gambling** — actuarial science began with life annuities sold by de Witt and Halley. Discuss the historical link to Pascal, Fermat, and the birth of probability theory. Great for lesson 1 or 7.

- **The St. Petersburg paradox** — use this to motivate utility theory and why premiums aren't just expected values. Fits well with lesson 1 or 2.

- **Climate change and tail risk** — emerging risks (lesson 30) are not just technical extensions — they challenge the entire actuarial paradigm based on stationarity and historical data. Reference Nassim Taleb's "Black Swan" and the failure of models in 2008.

- **Demographic modeling and population aging** — connect life tables (lesson 7) to current policy debates: Social Security solvency, Medicare costs, pen

## Common Failure Modes
1. **"The expected value is what we should charge"** — students often forget that premiums must exceed expected losses to cover variance, expenses, and profit. Emphasize the safety loading and why undiversifiable risk requires capital charges.

2. **"Independence is always a safe assumption"** — in aggregate loss models, frequency and severity must be independent, but students sometimes assume all risks are independent. Discuss catastrophic events (hurricanes, pandemics) that create dependence, and introduce copulas as the solution.

3. **"Ruin probability is the probability of a single large claim"** — ruin is about the surplus process over infinite time, not a one-time event. Students confuse ruin probability with the probability of a deficit in a single period.

4. **"Higher deductibles always decrease variance for the insurer"** — deductibles reduce mean claim size but the relationship with variance depends on the distribution. Work through examples where deductibles increase the c

## Vocabulary
Key terms for this domain: heavy-tailed distributions, extreme events, Pareto models, MLE, likelihood function, parameter estimation, Fisher information, transformation method, Jacobian, change of variables, survival function, hazard rate, force of mortality, exponential distribution, memoryless property (and 92 more).