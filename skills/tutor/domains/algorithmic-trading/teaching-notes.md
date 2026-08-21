# Algorithmic Trading and Market Microstructure — Teaching Notes

## Approach

This topic requires balancing theory (why markets work this way) with practice (how to build systems). The intermediate level assumes basic programming and statistics but not finance expertise, so we'll ground everything in concrete mechanisms before abstractions. Start with market mechanics (how orders become trades), then layer on information dynamics (why prices move), then strategy implementation (how to trade systematically), and finally risk/execution reality (why most strategies fail). Emphasize hands-on work with real data early — students should see order book data, tick data, and simple backtests within the first week. The material is inherently interdisciplinary (finance, statistics, computer science, operations research), so draw connections to adjacent fields students may know better.

## Common Misconceptions

1. **"Algorithmic trading is about finding the perfect prediction model"** — Most profitable strategies exploit structural inefficiencies (liquidity provision, execution quality, risk premia) rather than pure price prediction. Students often focus too much on forecasting and too little on execution and transaction costs. Correct this by showing how a mediocre signal with great execution beats a great signal with poor execution.

2. **"If a backtest shows profit, the strategy works"** — Backtesting is systematically biased toward overfitting, look-ahead errors, and survivorship bias. Students often trust backtests too much. Combat this by showing multiple examples of strategies that backtest perfectly but fail live, and teach rigorous out-of-sample validation from day one.

3. **"Market making is arbitrage (riskless profit)"** — Market makers bear inventory risk and adverse selection risk. They earn a spread but can lose on directional moves. Students confuse liquidity provision with statistical arbitrage. Clarify by walking through a market maker losing money on inventory when the market trends.

4. **"High-frequency trading is just about being faster"** — Speed is necessary but not sufficient. HFT requires information advantages (better signals, better execution), infrastructure (co-location, optimized code), and risk management. Students romanticize speed without understanding the full system. Show that latency matters only when you have alpha.

5. **"Transaction costs are just commission fees"** — Market impact and slippage typically dominate commission, especially for larger orders or less liquid instruments. Students often ignore or drastically underestimate these costs in backtests. Demonstrate with real order book data how a large order moves the market.

6. **"More features/data always improves ML models"** — In trading, more features usually leads to overfitting because the signal-to-noise ratio is extremely low. Students trained on other ML domains expect data to solve everything. Emphasize economic intuition, feature selection, and regularization over brute-force data collection.

7. **"Technical indicators (RSI, MACD, etc.) are predictive"** — Most popular indicators are data-mined artifacts with no economic foundation. They may have worked historically but are widely known and arbitraged away. Students often start here because it's accessible. Redirect to microstructure-based signals with economic mechanisms.

8. **"Dark pools are mysterious and probably manipulative"** — Dark pools are simply alternative trading venues with different trade-offs (less information leakage but less liquidity/price discovery). Students often view them suspiciously. Explain the legitimate use case (executing large orders without tipping off the market).

9. **"Alpha is a static property of a strategy"** — Alpha decays as more traders exploit it. Markets adapt, regime changes occur, regulations shift. Students expect strategies to work indefinitely. Stress the need for continuous research, adaptation, and understanding *why* a strategy works (not just *that* it works).

10. **"Pairs trading is always mean-reverting"** — Cointegration can break down (Lehman Brothers, oil/gas pairs post-shale revolution). Students often trust statistical relationships without checking economic fundamentals. Teach to monitor for regime breaks and have stop-loss rules.

## Level Adjustments

### For Intermediate Level (current)
- **Prerequisites assumed**: Basic Python/programming, introductory statistics (mean, variance, regression), general finance concepts (stocks, bonds, what an exchange is)
- **Mathematical depth**: Use formulas where they clarify (Kyle's lambda, Kelly criterion) but don't require measure-theoretic foundations. Favor intuition and simulation over proofs.
- **Coding expectation**: Can write basic Python scripts, use pandas/numpy, but may not know advanced software engineering (no microservices, no C++ optimization yet)
- **Focus areas**: Understanding mechanisms, implementing simple strategies, recognizing pitfalls. Build intuition for what works and why, not just recipe-following.
- **Avoid**: Stochastic calculus derivations, ultra-low-latency system design (FPGAs, kernel bypass), complex ML architectures (deep RL for trading). Keep these as "rabbit holes" for interested students but not core.

### If Adapting to Beginner
- Start with simpler instruments (stocks, not options/futures)
- Remove lessons on FIX protocol, latency optimization, advanced ML
- Spend more time on basic data analysis and visualization
- Use more visual explanations (order book animations, price charts)
- Provide more code scaffolding and step-by-step tutorials
- Reduce lesson count to ~20 (focus on core mechanics and one or two simple strategies)

### If Adapting to Advanced
- Add measure theory for market microstructure models (Glosten-Milgrom, Kyle)
- Include optimal control and stochastic calculus for execution/market making
- Cover FPGA programming and ultra-low-latency systems
- Deep RL and advanced ML techniques
- Multi-asset portfolio optimization under constraints
- Regulatory compliance and reporting in detail
- Increase lesson count to ~40-45 with deeper dives

## Rabbit Holes (for curious students)

- **Market microstructure theory**: Glosten-Milgrom model, Kyle model, Avellaneda-Stoikov model — full stochastic calculus derivations
  - *When to drop this in*: After lesson 5 (market making) if student asks "what's the optimal way to set quotes?"

- **Information theory in trading**: Mutual information between order flow and price moves; entropy of market regimes
  - *When to drop this in*: After lesson 8 (predicting from order flow) if student is mathematically sophisticated

- **Optimal execution theory**: Almgren-Chriss model, adaptive execution, reinforcement learning for execution
  - *When to drop this in*: After lesson 21 (VWAP/TWAP) if student asks "what's theoretically optimal?"

- **Flash Boys and latency arbitrage**: Deep dive into the controversy, race to zero latency, whether it's socially useful
  - *When to drop this in*: After lesson 9 (HFT speed) if student is interested in policy/ethics

- **Crypto market microstructure**: How decentralized exchanges differ (AMMs vs order books), MEV, front-running
  - *When to drop this in*: After lesson 1 (order matching) as a contrasting example of market design

- **Options market making**: Volatility surface, Greeks, hedging, pin risk
  - *When to drop this in*: After lesson 5 (market making) if student has options background

- **Auction theory**: How different auction formats (continuous double auction, call auction, dark pools) affect price discovery
  - *When to drop this in*: After lesson 2 (bid-ask spread) if student is interested in mechanism design

- **Reinforcement learning for trading**: Deep Q-learning, policy gradient methods, challenges with non-stationarity
  - *When to drop this in*: After lesson 30 (ML in trading) if student has RL background

- **News analytics and NLP**: Sentiment analysis, event detection, causal impact of news on prices
  - *When to drop this in*: After lesson 18 (trading signals) as an alternative signal source

## Difficulty Progression

### Arc Overview
Start gentle (lessons 1-3): basic market mechanics, observable phenomena. Build to first complexity peak (lessons 4-5): market impact and market making introduce risk and strategy. Ease off with review (lesson 6). Second wave (lessons 7-11): order book dynamics and HFT introduce data complexity and speed. Infrastructure lessons (12-17) have a sharp difficulty peak at lesson 15-16 (real-time data pipelines, latency optimization) — these are technically demanding. Review at 17. Third wave (lessons 18-24): strategies range from accessible (VWAP) to challenging (Avellaneda-Stoikov). Final wave (lessons 25-29): risk and execution are conceptually dense (backtesting bias, TCA). Close with advanced topics (30-31) and final review (32).

### Difficulty Peaks
- **Lesson 4** (difficulty 3): Market impact — first encounter with complex interaction between trading and prices
- **Lesson 8** (difficulty 3): Predictive features from order flow — statistical signal extraction
- **Lessons 10-11** (difficulty 3): Flash crashes and hidden orders — complex market dynamics
- **Lessons 15-16** (difficulty 4): Real-time data pipelines and latency optimization — system design challenges
- **Lesson 22** (difficulty 4): Avellaneda-Stoikov market making — stochastic optimal control
- **Lesson 23** (difficulty 4): Statistical arbitrage implementation — combining multiple concepts
- **Lesson 29** (difficulty 4): Transaction cost analysis implementation — realistic modeling
- **Lesson 30** (difficulty 4): Machine learning in trading — advanced modeling + validation challenges

### Valleys (Reviews and Breathers)
- **Lessons 6, 17, 24, 32** (difficulty 1): Review days to consolidate
- **Lessons 9, 14, 31** (difficulty 2): Resource-drops and real-world stories — lower cognitive load, build context

### Pacing Guidance
- **Week 1** (lessons 1-5): Foundations, build excitement with market making question
- **Week 2** (lessons 6-11): Consolidate basics, introduce order book complexity
- **Week 3** (lessons 12-17): Technical infrastructure — this is the toughest week, end with review
- **Week 4** (lessons 18-24): Strategies — most engaging module, lots of variety
- **Week 5** (lessons 25-29): Reality check (risk, costs, biases) — conceptually demanding but rewarding
- **Week 6** (lessons 30-32): Advanced topics and final review — tie everything together

## Engagement Strategies

- **Use real data early**: Show actual order book snapshots, tick data, flash crash recordings. Abstractions are hard to grasp without concrete examples.
- **Emphasize failure modes**: Many students are attracted to trading by success stories. Showing common failures (overfitting, ignoring costs, regime changes) is more educational.
- **Connect to current events**: Flash crashes, GameStop/AMC saga, crypto exchanges, FTX collapse — all have microstructure lessons.
- **Encourage hands-on coding**: Every strategy lesson should have a "try this in QuantConnect/Quantopian/backtrader" suggestion.
- **Ask Socratic questions**: "Why would anyone post a limit order instead of a market order?" "What happens to market makers during a crash?" Push students to reason from incentives.
- **Bridge to adjacent fields**: Connect to econometrics (time series), ML (signal processing), systems (low-latency design), game theory (strategic trading)
