# Algorithmic Trading and Market Microstructure — Concept Map

## Core Concepts (in learning order)

1. **Order types** — market, limit, stop orders and how they interact with the order book
2. **Limit order book** — central data structure where buy and sell orders queue
3. **Matching engines** — how exchanges process and execute orders
4. **Bid-ask spread** — difference between best buy and sell prices; cost of immediacy
5. **Liquidity provision** — supplying orders that others can trade against
6. **Adverse selection** — risk that counterparty has better information. Depends on: liquidity provision
7. **Liquidity** — ease of trading without moving price significantly
8. **Market depth** — volume available at different price levels. Depends on: limit order book, liquidity
9. **Resilience** — how quickly market recovers after large trades. Depends on: liquidity
10. **Market impact** — how trades move prices. Depends on: liquidity, market depth
11. **Price discovery** — process by which markets incorporate information into prices. Depends on: market impact
12. **Kyle's lambda** — measure of market impact per unit volume. Depends on: market impact
13. **Market making** — strategy of providing liquidity on both sides. Depends on: bid-ask spread, liquidity provision
14. **Inventory risk** — risk of holding positions as market maker. Depends on: market making
15. **Quote management** — adjusting bid/ask quotes based on inventory. Depends on: market making, inventory risk
16. **Order book levels** — depth beyond best bid/offer (L2, L3 data). Depends on: limit order book
17. **Book imbalance** — asymmetry between buy and sell pressure. Depends on: order book levels
18. **Queue position** — where your order sits in the book. Depends on: limit order book
19. **Order flow imbalance** — directional bias in incoming orders. Depends on: book imbalance
20. **Predictive features** — signals extracted from market data. Depends on: order flow imbalance
21. **Microstructure signals** — short-term price movement predictors. Depends on: predictive features
22. **Latency** — delay in receiving data and executing orders
23. **Co-location** — placing servers near exchange to reduce latency. Depends on: latency
24. **Speed advantages** — profit from being faster than competitors. Depends on: latency, co-location
25. **Flash crashes** — rapid market collapse and recovery. Depends on: market impact, liquidity
26. **Circuit breakers** — trading halts to prevent crashes. Depends on: flash crashes
27. **Systemic risk** — risk of market-wide failures. Depends on: flash crashes
28. **Iceberg orders** — partially hidden orders. Depends on: order types
29. **Dark pools** — non-displayed liquidity venues. Depends on: iceberg orders
30. **Order exposure** — trade-off between execution and information leakage. Depends on: dark pools
31. **Level 1/2/3 data** — different market data granularities. Depends on: order book levels
32. **Market data feeds** — real-time streams of market information. Depends on: Level 1/2/3 data
33. **Consolidated feeds** — aggregated data from multiple venues. Depends on: market data feeds
34. **Tick data** — individual trade and quote records. Depends on: market data feeds
35. **Data cleaning** — removing errors and anomalies from market data. Depends on: tick data
36. **Timestamp alignment** — synchronizing data from different sources. Depends on: tick data
37. **FIX protocol** — standard messaging format for trading. Depends on: order types
38. **Exchange connectivity** — technical connection to trading venues. Depends on: FIX protocol
39. **Message types** — different FIX message categories (orders, executions, etc.). Depends on: FIX protocol
40. **Streaming data** — continuous real-time data processing. Depends on: market data feeds
41. **Message queues** — buffers for high-volume data. Depends on: streaming data
42. **Data architecture** — system design for trading infrastructure. Depends on: streaming data, message queues
43. **Latency optimization** — techniques to minimize processing delays. Depends on: latency
44. **System design** — overall architecture of trading systems. Depends on: data architecture
45. **Performance tuning** — optimizing code and infrastructure. Depends on: latency optimization
46. **Alpha signals** — predictive features that generate returns. Depends on: predictive features
47. **Signal quality** — statistical properties of alpha signals. Depends on: alpha signals
48. **Predictive power** — how well signals forecast returns. Depends on: signal quality
49. **Pairs trading** — trading two correlated instruments. Depends on: alpha signals
50. **Cointegration** — statistical relationship for pairs trading. Depends on: pairs trading
51. **Mean reversion** — tendency for prices to return to average. Depends on: pairs trading
52. **Momentum** — persistence of price trends. Depends on: alpha signals
53. **Trend following** — strategies that ride momentum. Depends on: momentum
54. **Risk premia** — return for bearing systematic risk. Depends on: momentum
55. **VWAP** — volume-weighted average price benchmark. Depends on: market data feeds
56. **TWAP** — time-weighted average price benchmark. Depends on: VWAP
57. **Execution algorithms** — automated order placement strategies. Depends on: VWAP, TWAP
58. **Inventory management** — controlling position sizes. Depends on: inventory risk
59. **Avellaneda-Stoikov model** — market making with inventory risk. Depends on: inventory management, market making
60. **Optimal quoting** — setting prices to maximize profit. Depends on: Avellaneda-Stoikov model
61. **Statistical arbitrage** — portfolio of many small bets. Depends on: alpha signals
62. **Factor models** — decomposing returns into components. Depends on: statistical arbitrage
63. **Portfolio construction** — combining signals into positions. Depends on: factor models
64. **VaR** — value at risk metric. Depends on: portfolio construction
65. **Expected shortfall** — tail risk measure. Depends on: VaR
66. **Risk metrics** — quantitative risk measurements. Depends on: VaR, expected shortfall
67. **Backtesting bias** — systematic errors in historical testing. Depends on: statistical arbitrage
68. **Overfitting** — finding spurious patterns in data. Depends on: backtesting bias
69. **Look-ahead bias** — using future information in backtest. Depends on: backtesting bias
70. **Survivorship bias** — ignoring failed instruments. Depends on: backtesting bias
71. **Position sizing** — determining trade quantities. Depends on: risk metrics
72. **Kelly criterion** — optimal position size formula. Depends on: position sizing
73. **Risk of ruin** — probability of catastrophic loss. Depends on: position sizing
74. **TCA** — transaction cost analysis. Depends on: execution algorithms
75. **Implementation shortfall** — cost of delayed execution. Depends on: TCA
76. **Execution quality** — measuring how well orders execute. Depends on: TCA
77. **Slippage** — difference between expected and actual price. Depends on: market impact
78. **Commission modeling** — accounting for trading fees. Depends on: TCA
79. **Market impact estimation** — predicting price movement from orders. Depends on: market impact, slippage
80. **ML in trading** — machine learning applications. Depends on: alpha signals, factor models
81. **Feature engineering** — creating predictive variables. Depends on: ML in trading
82. **Model validation** — testing ML models properly. Depends on: backtesting bias, ML in trading
83. **Regulation** — legal constraints on trading. Depends on: market making, execution algorithms
84. **Market manipulation** — illegal trading practices. Depends on: regulation
85. **Best execution** — legal requirement to optimize trades. Depends on: execution quality, regulation

## Dependencies

### Foundational Layer
- **Order types**, **limit order book**, and **matching engines** form the basis — understanding how markets mechanically process orders is essential for everything else
- **Bid-ask spread** and **liquidity** emerge from these mechanics

### Information and Risk Layer
- **Adverse selection** requires understanding **liquidity provision** — why market makers demand compensation
- **Market impact** builds on **liquidity** and **market depth** — illiquid markets move more
- **Price discovery** explains why **market impact** occurs — trades reveal information

### Trading Layer
- **Market making** requires understanding **bid-ask spread**, **liquidity provision**, and **inventory risk**
- **Quote management** optimizes **market making** under **inventory risk**
- **Execution algorithms** (VWAP, TWAP, IS) require understanding **market impact** and **transaction costs**

### Data Layer
- **Order book levels** extends basic **limit order book** understanding
- **Microstructure signals** build on **order flow imbalance** and **predictive features**
- **Market data feeds** and **streaming data** enable real-time strategy implementation

### Strategy Layer
- **Pairs trading** requires **cointegration** and **mean reversion** concepts
- **Statistical arbitrage** generalizes pairs trading using **factor models**
- **Momentum** strategies contrast with **mean reversion** approaches
- All strategies depend on quality **alpha signals**

### Risk Layer
- **Backtesting bias** (overfitting, look-ahead, survivorship) must be understood before testing any strategy
- **Risk metrics** (VaR, expected shortfall) require **portfolio construction**
- **Position sizing** (Kelly criterion) balances return and **risk of ruin**
- **TCA** measures real-world costs vs theoretical backtest

### Advanced Layer
- **ML in trading** builds on **feature engineering** and requires rigorous **model validation**
- **Regulation** constrains all trading activities and defines **best execution** requirements

## Critical Bottlenecks

1. **Limit order book** — must understand this thoroughly before anything else makes sense
2. **Market impact** — separates theoretical strategies from practical implementation
3. **Backtesting bias** — the graveyard of algorithmic trading; many fail here
4. **Liquidity** — affects everything from execution to risk management

## Common Misconceptions

- **"High-frequency trading just means trading fast"** — speed is necessary but not sufficient; it's about information advantages and execution quality
- **"More data always means better strategies"** — overfitting becomes worse with more features; quality > quantity
- **"Backtesting shows it works"** — most backtests are broken; out-of-sample validation is critical
- **"Market making is arbitrage"** — it's risk-bearing, not riskless profit
- **"Dark pools hide all trading"** — they're just alternative venues with different cost/information trade-offs
- **"Technical indicators predict prices"** — most are data-mined artifacts; focus on economic mechanisms
- **"Transaction costs are just commission"** — market impact and slippage often dominate
- **"Alpha is stable"** — it decays as more traders exploit it; adaptation required

## Prerequisite Topics

- **Basic probability and statistics** — needed for: alpha signals, risk metrics, backtesting
- **Programming (Python or similar)** — needed for: data cleaning, strategy implementation, backtesting
- **Financial markets fundamentals** — needed for: understanding market structure, instruments, regulations
- **Time series concepts** — needed for: tick data, mean reversion, momentum, cointegration
