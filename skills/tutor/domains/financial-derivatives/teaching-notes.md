# Financial Derivatives — Teaching Notes

## Approach

Derivatives pricing rests on a single powerful idea: **no-arbitrage**. Every formula in this curriculum is a consequence of eliminating free money. The pedagogical strategy is to make this principle visceral through concrete examples (gold forwards, option strategies, swap arbitrage) before introducing mathematics. At the intermediate level, we develop both intuition (why must this be true?) and technique (how do we compute it?), balancing conceptual understanding with practical application. The topic is naturally visual — use payoff diagrams early and often, build binomial trees step-by-step, and make the Greeks tangible through interactive exploration.

## Common Misconceptions

1. **"Derivatives are just gambling"**
   - Why: Media focus on speculation and financial crises
   - Correction: Emphasize hedging use cases first (farmers, airlines, corporations). Show how derivatives transfer risk to those who want it, creating economic value. Speculation is necessary for liquid markets but not the primary purpose.

2. **"Forward price predicts future spot price"**
   - Why: Confusing the pricing formula (F = S × e^(r-q)T) with a forecast
   - Correction: Forward price is about no-arbitrage, not expectations. It's the delivery price that makes the contract have zero value today. Show examples where forward and expected spot diverge due to risk premium.

3. **"Futures and forwards are the same thing"**
   - Why: Both involve agreement to buy/sell at future date
   - Correction: Highlight institutional differences (exchange vs OTC, standardization, margin, marking to market). Show how daily settlement creates reinvestment risk that causes futures-forward price divergence under stochastic interest rates.

4. **"Options are worth intrinsic value"**
   - Why: Intrinsic value is easy to compute (max(S-K, 0))
   - Correction: Use time value examples — deep OTM options with positive value, ATM options worth much more than zero. Make optionality tangible: "You pay for the right to wait and see."

5. **"Put-call parity is just a formula to memorize"**
   - Why: Presented as C - P = S - K×e^(-rT) without motivation
   - Correction: Derive it from arbitrage. Build both portfolios (call + bond vs put + stock), show they have identical payoffs, conclude they must have identical prices or arbitrage exists. Make students find the arbitrage when parity is violated.

6. **"Risk-neutral probability is the 'real' probability"**
   - Why: We use it for pricing, so it seems like the truth
   - Correction: Emphasize it's a computational trick. Real-world probability affects expected returns; risk-neutral probability is chosen to make discounting at the risk-free rate work. Show how different investors with different risk aversion agree on prices despite disagreeing on probabilities.

7. **"Black-Scholes gives the correct price"**
   - Why: It's presented as "the" formula
   - Correction: It's the model price under strong assumptions (constant volatility, no jumps, continuous trading). Show volatility smile/smirk as evidence markets disagree. Emphasize implied volatility as market's view, not model's assumption.

8. **"Delta measures how much the option price changes"**
   - Why: Definition says ∂C/∂S
   - Correction: Delta is linear approximation, only accurate for small changes. Introduce gamma as the error term. Show examples where large moves make delta-only predictions poor.

9. **"Higher Greeks are better"**
   - Why: More sensitivity sounds like more opportunity
   - Correction: Greeks measure risk, not reward. High gamma means expensive rebalancing. High vega means volatility risk. Theta decay hurts long option holders. Context matters.

10. **"Swaps are exotic and complex"**
    - Why: The name sounds fancy
    - Correction: Plain vanilla swaps are just portfolios of cash flows. Show how a swap = long one bond + short another bond. Valuation is straightforward PV once you have the zero curve.

11. **"You need stochastic calculus to understand derivatives"**
    - Why: Black-Scholes derivation uses Ito's lemma
    - Correction: At intermediate level, focus on binomial model and intuition. Black-Scholes is the continuous limit. Can understand and apply the formula without the derivation. Save stochastic calculus for advanced track.

## Level Adjustments

### For Intermediate Level (this curriculum)
- **Emphasis**: Build intuition first, formulas second. Use no-arbitrage as the organizing principle.
- **Math depth**: Algebra and basic calculus (partial derivatives for Greeks). Binomial model in discrete time. Present Black-Scholes as a result, not a derivation.
- **Applications**: Mix theory with real-world hedging scenarios. Show both why formulas are true and how to use them.
- **Rigor**: Enough to understand assumptions and limitations. Point out when assumptions fail (volatility smile, jump risk).

### Comparison to Other Levels

**Beginner** (if this were redesigned for beginners):
- Skip formal derivations entirely
- Focus on payoff diagrams and mechanical use of formulas
- Minimal calculus (maybe delta only, no gamma)
- More emphasis on market mechanics and less on pricing theory
- Replace binomial model with "options are valuable because uncertainty is valuable"

**Advanced** (next steps after this curriculum):
- Full stochastic calculus treatment (Brownian motion, Ito's lemma, martingales)
- Derive Black-Scholes from PDE or risk-neutral expectation
- Extend to exotic options (barriers, Asians, lookbacks)
- Volatility modeling (GARCH, stochastic vol, local vol)
- Interest rate models (Vasicek, CIR, HJM)
- Credit risk modeling (structural vs reduced-form)
- Numerical methods (trees, Monte Carlo, finite difference)

## Rabbit Holes

### When to Drop These In

**1. The 2008 Financial Crisis and CDOs**
- **When**: After Lesson 4 (counterparty risk) or Lesson 25 (credit derivatives)
- **Why**: Shows how derivatives complexity + leverage + correlated risk = systemic crisis. Makes risk management tangible. Motivates central clearing mandates.

**2. The VIX and Volatility Trading**
- **When**: After Lesson 22 (implied volatility)
- **Why**: VIX futures and options are derivatives on derivatives. Shows how markets price volatility itself. Great example of meta-level thinking.

**3. Long-Term Capital Management Collapse**
- **When**: After Lesson 20 (delta hedging) or Lesson 22 (implied vol)
- **Why**: Shows limits of models. LTCM had Nobel Prize winners, sophisticated models, and still blew up due to liquidity crisis and correlated unwinding. Humility about models.

**4. Options in Venture Capital and Employee Compensation**
- **When**: After Lesson 15 (binomial model) or Lesson 18 (Black-Scholes)
- **Why**: Startup equity is essentially a call option on the company. Makes options tangible for non-finance students. Shows how option value explains risk-seeking behavior.

**5. Real Options in Corporate Finance**
- **When**: After Lesson 15 (binomial model)
- **Why**: Valuing flexibility (option to expand, delay, abandon projects). Connects to strategic decision-making beyond finance.

**6. Weather Derivatives and Prediction Markets**
- **When**: After Lesson 8 (cross-hedging)
- **Why**: Derivatives don't require traditional financial underlyings. Farmers hedge degree-days, election outcomes are traded. Shows generality of derivative concepts.

**7. Quanto Options and Currency Risk**
- **When**: After Lesson 22 (Black-Scholes extensions)
- **Why**: International derivatives add another dimension. Shows how multiple sources of risk interact.

**8. The Volatility Smile and Jump Risk**
- **When**: After Lesson 22 (implied vol)
- **Why**: Evidence markets know Black-Scholes is wrong. Points toward stochastic volatility and jump-diffusion models.

**9. Flash Crash and High-Frequency Trading**
- **When**: After Lesson 20 (delta hedging)
- **Why**: Shows how automated delta hedging at scale can destabilize markets. Modern market structure meets derivatives.

**10. Negative Oil Prices (April 2020)**
- **When**: After Lesson 6 (futures mechanics) or Lesson 11 (hedging)
- **Why**: WTI futures went negative due to storage constraints and settlement mechanics. Shows why institutional details matter. Breaks intuition that prices can't be negative.

## Difficulty Progression

### Early Stage (Lessons 1-5): Building Foundations
- **Difficulty**: 2-3
- **Focus**: Intuition for no-arbitrage, forward pricing with concrete examples
- **Pacing**: Gentle, narrative-driven
- **Checkpoint**: Teach-back on no-arbitrage pricing (Lesson 5)

### Middle Stage Part 1 (Lessons 6-11): Futures
- **Difficulty**: 2-4 (peak at Lesson 8 on cross-hedging and Lesson 11 on hedge design)
- **Focus**: Institutional mechanics meet pricing theory
- **Pacing**: Accelerate through mechanics, slow down for basis risk
- **Checkpoint**: Review at Lesson 10, real-world application at Lesson 11

### Middle Stage Part 2 (Lessons 12-17): Options Foundations
- **Difficulty**: 2-4 (peak at Lessons 14-15 on put-call parity and binomial model)
- **Focus**: Build payoff intuition, then pricing models
- **Pacing**: Slow down for binomial model (conceptual leap)
- **Checkpoint**: Review at Lesson 17 after binomial model

### Advanced Stage (Lessons 18-22): Black-Scholes and Greeks
- **Difficulty**: 3-5 (peak at Lesson 18 on Black-Scholes itself)
- **Focus**: Continuous-time pricing and risk management
- **Pacing**: Lesson 18 is the hardest — take time. Greeks flow naturally after.
- **Checkpoint**: Implied volatility (Lesson 22) synthesizes everything

### Final Stage (Lessons 23-26): Swaps and Integration
- **Difficulty**: 3-4 (peak at Lesson 24 on swap valuation)
- **Focus**: Application to interest rates, synthesis across topics
- **Pacing**: Faster — students have built maturity
- **Checkpoint**: Final review at Lesson 26

### Expected Struggles
- **Lesson 8**: Basis risk and cross-hedging (multiple sources of risk)
- **Lesson 11**: Hedge design (requires synthesis)
- **Lesson 15**: Risk-neutral probability (conceptual leap)
- **Lesson 18**: Black-Scholes (math and abstraction)
- **Lesson 20**: Delta hedging (dynamic replication is subtle)
- **Lesson 24**: Swap valuation (zero curve construction)

### Recovery Strategies
- After difficult lessons, include questions/teach-backs to check understanding before proceeding
- Use reviews (Lessons 10, 17, 26) to revisit tough concepts
- Offer alternative explanations: discrete vs continuous, algebraic vs geometric, theoretical vs empirical
- Provide interactive tools for exploration (binomial trees, Greeks calculators)
