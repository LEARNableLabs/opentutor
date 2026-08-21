# Algorithmic Trading and Market Microstructure — Resources

## Primary Sources (for lesson content)

### Textbooks

- **"Market Microstructure Theory" by Maureen O'Hara** (Wiley, 1995) — foundational text on information-based models, adverse selection, inventory models. Dense but canonical. Good for intermediate students willing to work through theory.
  - https://www.wiley.com/en-us/Market+Microstructure+Theory-p-9780631207610

- **"Empirical Market Microstructure" by Joel Hasbrouck** (Oxford, 2007) — econometric approaches to measuring spreads, information shares, price discovery. More empirical than O'Hara. Excellent for students with stats background.
  - https://global.oup.com/academic/product/empirical-market-microstructure-9780195301649

- **"Trading and Exchanges: Market Microstructure for Practitioners" by Larry Harris** (Oxford, 2002) — practitioner-focused, accessible, comprehensive. Best introductory text for this level.
  - https://global.oup.com/academic/product/trading-and-exchanges-9780195144703

- **"Algorithmic and High-Frequency Trading" by Cartea, Jaimungal, and Peñas** (Cambridge, 2015) — modern treatment with stochastic optimal control for execution and market making. Advanced but well-written.
  - https://www.cambridge.org/core/books/algorithmic-and-highfrequency-trading/5A9C48A0A6417D07B72DE8ECB2C2CC59

- **"Algorithmic Trading and DMA" by Barry Johnson** (4Myeloma Press, 2010) — practitioner's guide to direct market access and execution algorithms. Very practical.
  - https://www.algorithmictradinganddma.com/

### Academic Papers (Open Access)

- **Kyle (1985)** "Continuous Auctions and Insider Trading" — foundational model of informed trading and market impact
  - https://www.jstor.org/stable/1913210

- **Glosten & Milgrom (1985)** "Bid, Ask and Transaction Prices in a Specialist Market" — adverse selection model
  - https://www.sciencedirect.com/science/article/pii/0304405X85900443

- **Avellaneda & Stoikov (2008)** "High-frequency trading in a limit order book" — optimal market making with inventory risk
  - https://arxiv.org/abs/1105.3115

- **Cont, Stoikov, Talreja (2010)** "A Stochastic Model for Order Book Dynamics" — mathematical model of limit order book
  - https://arxiv.org/abs/1003.4739

- **Almgren & Chriss (2000)** "Optimal execution of portfolio transactions" — optimal execution with market impact
  - https://www.math.nyu.edu/faculty/chriss/optliq_f.pdf

### University Courses

- **MIT 15.433 Investments** (Spring 2003) — includes market microstructure modules
  - https://ocw.mit.edu/courses/15-433-investments-spring-2003/

- **Cornell ORIE 5256 Market Microstructure** — dedicated microstructure course
  - https://people.orie.cornell.edu/

- **Princeton ORF 405 Financial Mathematics** — includes algorithmic trading component
  - https://orfe.princeton.edu/

- **UC Berkeley IEOR 242 Applications in Market Microstructure** 
  - https://ieor.berkeley.edu/

## Supplementary Resources

### Video Lectures

- **MIT OpenCourseWare: Topics in Mathematics with Applications in Finance**
  - Lecture 17: Modeling Limit Order Books
  - https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/

- **Coursera: Machine Learning for Trading (Georgia Tech)**
  - Comprehensive course covering backtesting, portfolio optimization, ML applications
  - https://www.coursera.org/specializations/machine-learning-trading

- **QuantInsti YouTube Channel**
  - Tutorials on algorithmic trading strategies, backtesting, risk management
  - https://www.youtube.com/c/QuantInsti

- **QuantPy YouTube Channel**
  - Python implementations of trading strategies and microstructure analysis
  - https://www.youtube.com/c/QuantPy

- **Flash Crash Explained (Documentary)**
  - 2010 Flash Crash investigation and market structure issues
  - https://www.youtube.com/watch?v=E1xqSZy9_4I

- **High-Frequency Trading Explained (60 Minutes)**
  - Popular accessible explanation of HFT and latency advantages
  - https://www.youtube.com/watch?v=OTjyO2ztAOQ

### Interactive Tools and Platforms

- **QuantConnect** — open-source algorithmic trading platform, supports equities/forex/crypto/futures, Python and C#, cloud backtesting, real-time data
  - https://www.quantconnect.com/
  - Excellent for learning and prototyping at intermediate level

- **Alpaca** — commission-free API for stock trading, paper trading, real-time data streaming
  - https://alpaca.markets/
  - Good for students to practice with live market data

- **Interactive Brokers API** — professional-grade trading API, supports most asset classes
  - https://www.interactivebrokers.com/en/trading/ib-api.php
  - Industry standard, steeper learning curve

- **Quantopian Lectures (archived)** — comprehensive educational resources, now maintained by QuantRocket
  - https://github.com/quantopian/research_public
  - Still excellent learning materials even though platform shut down

- **LOBSTER** — limit order book data for academic research, reconstructed Level 3 data
  - https://lobsterdata.com/
  - Great for studying order book microstructure

- **TradingView** — charting and market data visualization
  - https://www.tradingview.com/
  - Good for quick market data exploration

- **Polygon.io** — market data API with generous free tier
  - https://polygon.io/
  - Real-time and historical data for learning

### Code Libraries and Repositories

- **Zipline** — Pythonic algorithmic trading library (from Quantopian)
  - https://github.com/quantopian/zipline
  - Event-driven backtesting framework

- **Backtrader** — Python backtesting library with extensive docs
  - https://github.com/mementum/backtrader
  - More lightweight than Zipline

- **VectorBT** — fast backtesting library using vectorized operations
  - https://github.com/polakowo/vectorbt
  - Best performance for simple strategies

- **Hudson and Thames Portfolios** — collection of open-source quant libraries
  - ArbitrageLab (pairs trading, cointegration)
  - MlFinLab (financial ML techniques)
  - PortfolioLab (portfolio optimization)
  - https://github.com/hudson-and-thames

- **TA-Lib** — Technical analysis library (use cautiously, see teaching notes on technical indicators)
  - https://github.com/mrjbq7/ta-lib
  - Industry standard but many indicators are data-mined

- **Machine Learning for Trading** by Stefan Jansen — code repo for book
  - https://github.com/stefan-jansen/machine-learning-for-trading
  - Comprehensive examples of ML applied to trading

- **Quantlib** — quantitative finance library (C++ with Python bindings)
  - https://www.quantlib.org/
  - Industry standard for derivatives pricing, also useful for analytics

### R Packages (if student prefers R)

- **quantmod** — quantitative financial modeling framework
  - https://cran.r-project.org/web/packages/quantmod/

- **TTR** — technical trading rules
  - https://cran.r-project.org/web/packages/TTR/

- **PerformanceAnalytics** — econometric tools for performance and risk analysis
  - https://cran.r-project.org/web/packages/PerformanceAnalytics/

## People to Follow

### Academics and Researchers

- **Maureen O'Hara** (Cornell) — market microstructure theory pioneer
- **Joel Hasbrouck** (NYU Stern) — empirical microstructure, market quality metrics
- **Albert S. Kyle** (University of Maryland) — informed trading models
- **Marcos López de Prado** (Cornell) — financial ML, backtest overfitting
- **Alvaro Cartea** (Oxford) — algorithmic trading, optimal execution
- **Robert Almgren** (NYU Courant) — optimal execution theory
- **Jonathan Brogaard** (University of Washington) — HFT empirics
- **Thierry Foucault** (HEC Paris) — market design, limit order markets

### Practitioners and Bloggers

- **Ernie Chan** — algorithmic trading practitioner, author of "Quantitative Trading"
  - Blog: http://epchan.blogspot.com/

- **Quantocracy** — curated quant trading blog aggregator
  - https://quantocracy.com/

- **QuantStart** (Michael Halls-Moore) — educational articles on quant trading
  - https://www.quantstart.com/

- **Mechanical Sympathy (Martin Thompson)** — low-latency systems and performance
  - https://mechanical-sympathy.blogspot.com/

- **QuantInsti** — algorithmic trading education platform
  - https://blog.quantinsti.com/

### Twitter/X Accounts (Active Quant Community)

- @QuantPy — Python quant tutorials
- @MarcosLopezDePrado — ML for finance
- @QuantStart — quant trading education
- @alpacahq — commission-free trading API

## Datasets and Data Sources

### Free/Academic Access

- **Yahoo Finance API** — basic historical price data (via yfinance Python package)
  - https://finance.yahoo.com/

- **Alpha Vantage** — free API for stock data, technical indicators
  - https://www.alphavantage.co/

- **Quandl** (now Nasdaq Data Link) — financial and economic data
  - https://data.nasdaq.com/

- **LOBSTER** — limit order book data for academic research (fee-based but academic discounts)
  - https://lobsterdata.com/

- **Kaggle Datasets** — various financial datasets for practice
  - https://www.kaggle.com/datasets?search=stock+market

### Professional Data Providers (for reference)

- **Bloomberg Terminal** — industry standard, very expensive
- **Refinitiv (formerly Reuters)** — professional data feeds
- **IEX Cloud** — market data API with transparency focus
  - https://iexcloud.io/

## Regulatory and Industry Resources

- **SEC Market Structure Concept Release** (2010) — comprehensive overview of US market structure
  - https://www.sec.gov/rules/concept/2010/34-61358.pdf

- **MiFID II** (EU Markets in Financial Instruments Directive) — European regulation
  - https://www.esma.europa.eu/policy-rules/mifid-ii-and-mifir

- **Regulation NMS** (US National Market System) — US equity market regulation
  - https://www.sec.gov/rules/final/34-51808.pdf

- **BIS Committee on Payment and Settlement Systems** — market infrastructure standards
  - https://www.bis.org/

- **FIX Protocol** — financial information exchange standard
  - https://www.fixtrading.org/standards/

## Unexpected Connections (Wild Cards)

- **Algorithmic Game Theory** — mechanism design applies to market design (auctions, order matching)
  - Connections to: auction theory, Nash equilibria, mechanism design

- **Network Science** — order flow networks, systemic risk propagation
  - See: "Systemic Risk in Financial Networks" literature

- **Information Theory** — mutual information between order flow and prices
  - See: Shannon entropy applied to market regimes

- **Control Theory** — optimal execution and market making as control problems
  - Connections to: stochastic control, dynamic programming, reinforcement learning

- **Statistical Physics** — order book dynamics modeled with physics analogies
  - See: "Econophysics" literature (controversial but interesting)

- **Queueing Theory** — order queue dynamics, priority rules
  - Applications to: order book modeling, exchange design

- **Adversarial Machine Learning** — strategies adapt and compete, models must be robust
  - Connections to: game theory, robust optimization, online learning

## Historical Context

- **"Flash Boys" by Michael Lewis** (2014) — popularized HFT controversy, debate over fairness
  - https://www.amazon.com/Flash-Boys-Wall-Street-Revolt/dp/0393351599

- **2010 Flash Crash** — May 6, 2010 market crash and recovery, systemic risk case study
  - SEC/CFTC report: https://www.sec.gov/news/studies/2010/marketevents-report.pdf

- **Knight Capital Trading Loss** (2012) — $440M loss in 45 minutes from software bug
  - Case study in operational risk

- **Long-Term Capital Management (LTCM)** (1998) — failure of quant fund, lessons on leverage and tail risk
  - Book: "When Genius Failed" by Roger Lowenstein

These resources provide a comprehensive foundation for intermediate-level study. Students should start with QuantConnect tutorials and the Quantopian lectures archive, then progress to academic papers and textbooks as concepts solidify. Real data exploration via Alpaca or Polygon.io should happen early to build intuition.
