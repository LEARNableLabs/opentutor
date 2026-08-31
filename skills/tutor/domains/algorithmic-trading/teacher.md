# Algorithmic trading and market microstructure — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 11 lessons (33%)
- **Socratic questions** — 6 lessons (18%)
- **real-world application challenges** — 6 lessons (18%)
- **review and consolidation sessions** — 5 lessons (15%)
- **teach-back exercises (student explains)** — 3 lessons (9%)
- **curated resource exploration** — 2 lessons (6%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 45% accessible (1-2), 36% standard (3), 18% challenging (4-5).

Difficulty peaks:
- Day 16: "How do we build a real-time data pipeline?" (difficulty 4)
- Day 17: "Why do microseconds matter in trading?" (difficulty 4)
- Day 23: "How do market makers manage inventory risk?" (difficulty 4)
- Day 24: "How would you build a simple statistical arbitrage strategy?" (difficulty 4)
- Day 30: "How do you analyze transaction costs in practice?" (difficulty 4)

## Domain Hooks
- **Market microstructure theory**: Glosten-Milgrom model, Kyle model, Avellaneda-Stoikov model — full stochastic calculus derivations
  - *When to drop this in*: After lesson 5 (market making) if student asks "what's the optimal way to set quotes?"

- **Information theory in trading**: Mutual information between order flow and price moves; entropy of market regimes
  - *When to drop this in*: After lesson 8 (predicting from order flow) if student is mathematically sophisticated

- **Optimal execution theory**: Almgren-Chriss model, adaptive execution, reinforcement learning for execution
  - *When to drop this in*: After lesson 21 (VWAP/TWAP) if student asks "what's theoretically optimal?"

- **Flash Boys and latency arbitrage**: Deep dive into the controversy, race to zero latency, whether it's socially useful
  - *When to drop this in*: After lesson 9 (HFT speed) if student is interested in policy/ethics

- **Crypto market microstructure**: How decentralized exchanges differ (AMMs v

## Common Failure Modes
1. **"Algorithmic trading is about finding the perfect prediction model"** — Most profitable strategies exploit structural inefficiencies (liquidity provision, execution quality, risk premia) rather than pure price prediction. Students often focus too much on forecasting and too little on execution and transaction costs. Correct this by showing how a mediocre signal with great execution beats a great signal with poor execution.

2. **"If a backtest shows profit, the strategy works"** — Backtesting is systematically biased toward overfitting, look-ahead errors, and survivorship bias. Students often trust backtests too much. Combat this by showing multiple examples of strategies that backtest perfectly but fail live, and teach rigorous out-of-sample validation from day one.

3. **"Market making is arbitrage (riskless profit)"** — Market makers bear inventory risk and adverse selection risk. They earn a spread but can lose on directional moves. Students confuse liquidity provision with st

## Vocabulary
Key terms for this domain: order types, limit order book, matching engines, bid-ask spread, liquidity provision, adverse selection, liquidity, market depth, resilience, market impact, price discovery, Kyle's lambda, market making, inventory risk, quote management (and 76 more).