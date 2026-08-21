# Econometrics — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Jeffrey Wooldridge, "Introductory Econometrics: A Modern Approach"** (7th edition, 2020) — the gold standard for intermediate econometrics. Clear exposition, great examples, excellent end-of-chapter problems. Balances theory and application. Datasets available at https://www.cengage.com/cgi-wadsworth/course_products_wp.pl?fid=M20b&product_isbn_issn=9781337558860
  
- **James Stock & Mark Watson, "Introduction to Econometrics"** (4th edition, 2019) — alternative to Wooldridge, slightly more intuitive, less mathematical. Strong on empirical examples and policy applications. Used at Harvard, Berkeley.

- **Bruce Hansen, "Econometrics"** (2022) — free PDF at https://www.ssc.wisc.edu/~bhansen/econometrics/ — more advanced, graduate-level rigor, but excellent reference for mathematical details. Use selectively for deeper dives.

- **Joshua Angrist & Jörn-Steffen Pischke, "Mastering 'Metrics"** (2014) — applied focus on causal inference, less on OLS mechanics. Excellent companion for lessons 22-26 (IV, panel methods, diff-in-diff). Accessible and entertaining.

### Online Courses

- **MIT OCW 14.32: Econometrics** — https://ocw.mit.edu/courses/14-32-econometrics-spring-2007/ — full lecture notes, problem sets, exams. Rigorous but clear. Taught by Victor Chernozhukov (world expert).

- **Econometrics with R** — https://www.econometrics-with-r.org/ — free interactive textbook following Stock & Watson. Includes R code for every example. Excellent for self-study.

- **Causal Inference: The Mixtape** — https://mixtape.scunning.com/ — free book by Scott Cunningham. Modern, code-heavy (Stata/R/Python), focuses on identification strategies. Great for lessons 22-26.

- **Library of Statistical Techniques (LOST)** — https://lost-stats.github.io/ — crowdsourced "how do I do X in Y software?" reference. Covers R, Stata, Python implementations of common econometric methods.

## Supplementary (for engagement)

### Videos

- **Ben Lambert's Econometrics Course** — https://www.youtube.com/playlist?list=PLwJRxp3blEvZyQBTTOMFRP_TDaSdly3gU — 100+ short videos covering everything from OLS to time series. Clear British accent, chalk-and-talk style, excellent for review.

- **MIT 14.32 Lecture Videos** — available on MIT OpenCourseWare. More advanced than Ben Lambert, but high production quality.

- **Marginal Revolution University** — https://mru.org/ — Tyler Cowen and Alex Tabarrok's video courses. Not pure econometrics, but excellent context for *why* we care about causal inference (Development Economics, Econometrics courses available).

- **StatQuest with Josh Starmer** — https://www.youtube.com/c/joshstarmer — not econometrics-specific, but fantastic explanations of regression, hypothesis testing, and p-values. Use for lessons 2-8.

### Interactive Tools

- **Ordinary Least Squares Visualization** — https://setosa.io/ev/ordinary-least-squares-regression/ — interactive scatter plot where you drag points and see the regression line update in real time. Perfect for lesson 5.

- **Seeing Theory** — https://seeing-theory.brown.edu/ — beautiful interactive probability and statistics textbook. Use "Regression Analysis" chapter for lesson 5-8.

- **Spurious Correlations** — https://www.tylervigen.com/spurious-correlations — fun site showing absurd correlations (Nicolas Cage films vs. pool drownings). Use for lesson 4 to hammer home correlation ≠ causation.

- **Statistics Kingdom** — https://www.statskingdom.com/linear-regression-calculator.html — quick online regression calculator. Useful for students without software access to try quick examples.

### Code & Repos

- **Wooldridge Data in R** — `install.packages("wooldridge")` — all textbook datasets as R data frames.

- **Econometrics in R (GitHub)** — https://github.com/justinmshea/wooldridge — replication code for Wooldridge examples.

- **Introduction to Econometrics with R (GitHub)** — https://github.com/mca91/EconometricsWithR — source code for the online book.

- **Causal Inference Mixtape Code** — https://github.com/scunning1975/mixtape — Stata, R, and Python code for all Mixtape examples.

- **PyEconometrics** — https://github.com/zhouyanasd/or-pandas — Python implementations of standard econometric methods using pandas and statsmodels.

### People to Follow

- **Joshua Angrist** — Nobel laureate (2021), pioneer of credibility revolution, co-author of "Mastering 'Metrics". Watch his Nobel lecture on YouTube.

- **Susan Athey** — Stanford economist, leader in machine learning for econometrics. Introduced causal forests, generalized random forests.

- **Scott Cunningham** — author of Mixtape, active on Twitter (@causalinf), teaches applied causal inference workshops.

- **Nick Huntington-Klein** — wrote "The Effect: An Introduction to Research Design and Causality", maintains LOST Stats, very accessible pedagogy.

- **Guido Imbens** — Nobel laureate (2021) with Angrist, expert on treatment effects and program evaluation.

## Software & Tools

### R Packages

- **Base R**: `lm()` for OLS, `summary()`, `plot()`, `confint()`
- **lmtest**: diagnostic tests (Breusch-Pagan, Durbin-Watson, etc.)
- **sandwich**: heteroskedasticity- and autocorrelation-robust standard errors
- **car**: companion to applied regression, includes VIF, added-variable plots
- **AER**: applied econometrics in R, includes datasets and IV functions
- **plm**: panel data models (fixed effects, random effects)
- **ivreg**: instrumental variables regression (replaces old AER::ivreg)
- **stargazer**: beautiful regression tables for LaTeX and HTML

### Python Libraries

- **statsmodels**: `OLS`, `WLS`, diagnostic tests, robust standard errors — https://www.statsmodels.org/
- **linearmodels**: IV, panel data, system regression — https://bashtage.github.io/linearmodels/
- **pandas**: data manipulation (essential for cleaning)
- **matplotlib / seaborn**: plotting residuals, scatter plots
- **scipy**: statistical distributions and tests

### Stata

- **Core commands**: `regress`, `ivreg2`, `xtreg`, `logit`, `probit`
- **User-written**: `outreg2` (tables), `estout` (tables), `rdrobust` (regression discontinuity)
- **Stata documentation**: https://www.stata.com/manuals/ — exceptionally good, with examples
- **Stata cheat sheets**: https://geocenter.github.io/StataTraining/

### Gretl

- **Gretl** — http://gretl.sourceforge.net/ — free, open-source alternative to Stata. Good GUI for beginners. Not as powerful as R/Python but much easier for students scared of code.

## Datasets

### Textbook Datasets

- **Wooldridge datasets** — wage1, wage2, crime1, crime2, mroz, etc. Available in R package `wooldridge`, also at textbook website.
- **Stock & Watson datasets** — CPS earnings, California test scores, growth data. Available at https://www.princeton.edu/~mwatson/Stock-Watson_4E/Stock-Watson-Resources-4e.html

### Public Data Sources

- **FRED (Federal Reserve Economic Data)** — https://fred.stlouisfed.org/ — macroeconomic time series (GDP, unemployment, inflation). Free API access.
- **IPUMS (Integrated Public Use Microdata Series)** — https://ipums.org/ — U.S. Census, CPS, international census data. Free but requires registration.
- **World Bank Open Data** — https://data.worldbank.org/ — cross-country development indicators.
- **OECD Data** — https://data.oecd.org/ — international economic and social statistics.
- **Gapminder** — https://www.gapminder.org/data/ — global development data, great visualizations.
- **Bureau of Labor Statistics (BLS)** — https://www.bls.gov/data/ — U.S. labor market data (wages, employment, CPI).
- **NBER** — https://www.nber.org/research/data — variety of economic datasets used in published papers.

## Communities & Forums

- **Cross Validated (StackExchange)** — https://stats.stackexchange.com/ — Q&A for statistical methods. Tag your question `[econometrics]` or `[regression]`.
- **r/econometrics (Reddit)** — https://www.reddit.com/r/econometrics/ — active community, helpful for students.
- **Statalist (Stata forum)** — https://www.statalist.org/ — if using Stata, very responsive community.
- **RStudio Community** — https://community.rstudio.com/ — for R users.
- **Stack Overflow** — https://stackoverflow.com/ — for programming questions (Python, R).

## Blogs & Podcasts

- **Marginal Revolution** — https://marginalrevolution.com/ — economics blog by Cowen & Tabarrok, often discusses econometric studies.
- **Andrew Gelman's Blog** — https://statmodeling.stat.columbia.edu/ — statistics and causal inference, critical perspective on published research.
- **Mostly Harmless Econometrics Blog** — dormant but archives are gold.
- **EconTalk** — https://www.econtalk.org/ — podcast by Russ Roberts, interviews economists about their research (often discusses empirical methods).
- **Probable Causation** — https://www.probablecausation.com/ — podcast on law, economics, and causal inference.

## Unexpected Connections

- **Epidemiology** — uses same methods (regression, IV, diff-in-diff) for public health. Mendelian randomization is IV using genetic variants.
- **Political Science** — regression discontinuity from close elections, survey data analysis, causal inference in observational studies.
- **Sociology** — multilevel modeling, selection bias, survey methods overlap heavily with econometrics.
- **Machine Learning** — causal forests, double machine learning, debiased lasso — new frontier combining ML and causal inference. See Susan Athey, Victor Chernozhukov.
- **History** — "cliometrics" applies econometrics to historical data. See work on slavery, industrial revolution, institutions.
- **Sports Analytics** — regression for player evaluation, causal inference for coaching decisions (e.g., going for it on 4th down).

## Classic Papers (to inspire)

- **David Card & Alan Krueger (1994), "Minimum Wages and Employment"** — difference-in-differences, challenged conventional wisdom. Accessible and controversial.
- **Angrist & Krueger (1991), "Does Compulsory School Attendance Affect Schooling and Earnings?"** — clever IV using quarter of birth.
- **Levitt (1997), "Using Electoral Cycles in Police Hiring to Estimate the Effect of Police on Crime"** — creative identification strategy.
- **Miguel, Satyanath, Sergenti (2004), "Economic Shocks and Civil Conflict"** — IV using rainfall in Africa to study conflict. Shows power of natural experiments.
