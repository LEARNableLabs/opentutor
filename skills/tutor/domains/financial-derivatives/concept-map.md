# Financial Derivatives — Concept Map

## Core Concepts (in learning order)

1. **Derivatives definition** — financial contracts whose value derives from an underlying asset
2. **Hedging vs speculation** — risk reduction vs profit-seeking uses of derivatives
3. **No-arbitrage principle** — markets eliminate risk-free profit opportunities
4. **Law of one price** — identical assets must have identical prices. Depends on: no-arbitrage principle
5. **Forward contracts** — customized agreements to buy/sell at a future date
6. **Forward price formula** — theoretical price based on cost of carry. Depends on: no-arbitrage principle, forward contracts
7. **Cost of carry** — storage, financing, and convenience costs
8. **Counterparty risk** — risk that the other party defaults on obligations
9. **Futures mechanics** — standardized exchange-traded contracts with daily settlement
10. **Clearinghouse** — central counterparty that eliminates bilateral credit risk. Depends on: counterparty risk
11. **Margin requirements** — collateral posted to cover potential losses. Depends on: clearinghouse
12. **Marking to market** — daily settlement of gains/losses. Depends on: futures mechanics, margin requirements
13. **Basis** — difference between spot and futures price
14. **Convergence** — basis goes to zero at maturity. Depends on: basis, no-arbitrage principle
15. **Cross-hedging** — hedging with an imperfectly correlated contract
16. **Hedge ratio** — optimal number of contracts to minimize risk. Depends on: cross-hedging
17. **Basis risk** — residual risk from imperfect correlation. Depends on: cross-hedging, hedge ratio
18. **Call options** — right to buy at a strike price
19. **Put options** — right to sell at a strike price
20. **Option payoffs** — terminal value as a function of underlying price. Depends on: call options, put options
21. **Option strategies** — combinations of calls and puts. Depends on: option payoffs
22. **Put-call parity** — relationship between call, put, stock, and bond prices. Depends on: call options, put options, no-arbitrage principle
23. **Synthetic positions** — replicating one instrument with others. Depends on: put-call parity
24. **Binomial model** — discrete-time option pricing via replication
25. **Risk-neutral probability** — pricing measure that makes all assets grow at the risk-free rate. Depends on: binomial model, no-arbitrage principle
26. **Replication strategy** — portfolio that matches option payoffs. Depends on: binomial model
27. **Early exercise** — American option feature. Depends on: binomial model
28. **Continuous time** — limit of infinitely fine binomial steps
29. **Black-Scholes formula** — closed-form option price in continuous time. Depends on: continuous time, risk-neutral probability
30. **Lognormal distribution** — stock price distribution under geometric Brownian motion. Depends on: Black-Scholes formula
31. **Geometric Brownian motion** — continuous-time stochastic process for stock prices. Depends on: Black-Scholes formula
32. **Delta** — option price sensitivity to underlying price change. Depends on: Black-Scholes formula
33. **Gamma** — rate of change of delta. Depends on: delta
34. **Delta hedging** — dynamically hedging option exposure. Depends on: delta
35. **Theta** — option price sensitivity to time passage. Depends on: Black-Scholes formula
36. **Vega** — option price sensitivity to volatility. Depends on: Black-Scholes formula
37. **Rho** — option price sensitivity to interest rates. Depends on: Black-Scholes formula
38. **Implied volatility** — market's expectation of future volatility. Depends on: Black-Scholes formula, vega
39. **Volatility smile** — implied volatility pattern across strikes. Depends on: implied volatility
40. **VIX** — volatility index based on S&P 500 options. Depends on: implied volatility
41. **Interest rate swaps** — exchange of fixed and floating cash flows
42. **Fixed-for-floating** — typical swap structure. Depends on: interest rate swaps
43. **Swap valuation** — pricing using present value of cash flows. Depends on: interest rate swaps, no-arbitrage principle
44. **Zero curves** — term structure of spot rates. Depends on: swap valuation
45. **LIBOR/SOFR** — reference rates for floating legs. Depends on: fixed-for-floating
46. **Exotic options** — non-standard payoff structures
47. **Barrier options** — activated/deactivated at price levels. Depends on: exotic options
48. **Credit default swaps** — insurance against credit events

## Dependencies

### Foundational Chain
The **no-arbitrage principle** is the bedrock — it enables forward pricing, put-call parity, risk-neutral valuation, and swap valuation. Every pricing formula traces back to no-arbitrage.

### Futures Build
**Futures mechanics** builds on forward contracts but adds the **clearinghouse** and **marking to market** features that eliminate counterparty risk. Understanding **basis** and **convergence** requires both the pricing theory (no-arbitrage) and the institutional mechanics (daily settlement).

### Options Theory Chain
**Option payoffs** → **put-call parity** → **binomial model** → **risk-neutral probability** → **Black-Scholes formula**

Each step generalizes the previous:
- Payoffs describe terminal value
- Put-call parity shows static arbitrage relationships
- Binomial model introduces dynamic replication
- Risk-neutral probability enables pricing without knowing true probabilities
- Black-Scholes takes the continuous limit

### Greeks Dependencies
All Greeks depend on the **Black-Scholes formula**. **Gamma** and **delta hedging** depend on **delta**. **Implied volatility** requires understanding both Black-Scholes and **vega**.

### Swaps
**Swap valuation** requires understanding present value (prerequisite), **zero curves** for discounting, and the **no-arbitrage principle** for why swaps can be priced as portfolios of bonds.

## Bottlenecks

1. **No-arbitrage principle** (Lesson 2) — if this doesn't click, pricing formulas will seem arbitrary rather than inevitable
2. **Risk-neutral probability** (Lesson 15) — conceptual leap that unlocks all derivative pricing
3. **Delta and hedging** (Lesson 20) — bridge between pricing theory and risk management practice
4. **Implied volatility** (Lesson 22) — requires synthesizing Black-Scholes, market prices, and Greeks

## Common Misconceptions

1. **"Forward price is the expected future spot price"** — Actually, forward price = spot × (1 + r - q), which differs from expected spot unless risk premium is zero
2. **"Futures and forwards are the same"** — Marking to market creates convexity bias; prices differ when rates are stochastic
3. **"Option value is just intrinsic value"** — Time value (optionality) is usually the larger component for at-the-money options
4. **"Delta is constant"** — Delta changes with stock price (gamma) and time (charm)
5. **"Black-Scholes gives the 'true' price"** — It gives the model price under specific assumptions; implied vol shows where markets disagree
6. **"Higher gamma is always good"** — High gamma means large hedge rebalancing costs
7. **"Swaps have no upfront value"** — At inception yes, but value fluctuates with rates afterward

## Prerequisite Topics

- **Probability and statistics** — needed for risk-neutral probability, lognormal distribution, expected values
- **Calculus** — needed for partial derivatives (Greeks), limits (binomial → Black-Scholes), Taylor expansions (delta-gamma approximation)
- **Present value and discounting** — needed for forward pricing, swap valuation, all derivative pricing
- **Basic finance** — needed for risk/return concepts, efficient markets, portfolio theory
- **Financial markets** — needed for understanding market mechanics, participants, trading

## Learning Pathways

### Critical Path (must master in order)
1. No-arbitrage → forward pricing → futures
2. Option payoffs → put-call parity → binomial model → risk-neutral probability → Black-Scholes
3. Black-Scholes → Greeks → implied volatility

### Parallel Paths (can learn independently)
- **Futures hedging** (Lessons 8-11) can be learned alongside early options material
- **Swaps** (Lessons 23-24) can be learned once no-arbitrage and PV are solid, doesn't require options knowledge
- **Exotic options** (Lesson 25) extend Black-Scholes but aren't prerequisite for anything

### Fast Track
For students strong in math: can accelerate through binomial model (Lesson 15) to Black-Scholes (Lesson 18), spending less time on discrete steps.

### Slow Track
For students weaker in math: spend extra time on binomial model and risk-neutral probability before attempting Black-Scholes; may skip derivations and focus on applications.
