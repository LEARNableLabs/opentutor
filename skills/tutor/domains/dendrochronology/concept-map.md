# Dendrochronology — Concept Map

## Core Concepts (in learning order)

1. **Seasonal cambium activity** — trees grow in annual cycles creating visible rings
2. **Earlywood and latewood** — distinct spring and summer wood cells create ring boundaries
3. **Annual growth cycles** — one ring per year in temperate climates (the foundation of dating)
4. **Limiting factors** — environmental constraints (water, temperature, light, nutrients) control ring width
5. **Temperature vs precipitation sensitivity** — species and sites respond to different climate variables
6. **Competition and disturbance** — non-climate factors that affect growth (requires recognition for signal extraction)
7. **False rings** — intra-annual density variations that mimic true boundaries. Depends on: 2, 3
8. **Missing rings** — years with zero growth (requires careful anatomical examination). Depends on: 3, 4
9. **Cellular anatomy** — microscopic structure used to verify boundaries. Depends on: 2
10. **Species selection** — choosing trees with strong, interpretable climate signals. Depends on: 5
11. **Site selection principles** — finding locations where climate is the primary growth control. Depends on: 4, 10
12. **Increment borer technique** — extracting cores without harming trees. Depends on: 10
13. **Core mounting and preparation** — processing samples for measurement. Depends on: 12
14. **Skeleton plotting** — visual crossdating method using marker years. Depends on: 3, 7, 8
15. **Marker years** — distinctive ring patterns used for pattern matching (foundation of crossdating). Depends on: 4
16. **Visual crossdating** — matching patterns between cores. Depends on: 14, 15
17. **Statistical cross-dating** — quantitative validation using correlation. Depends on: 16
18. **COFECHA** — software for validating crossdating statistically. Depends on: 17
19. **Master chronology** — reference pattern for a site/region. Depends on: 16, 17
20. **Inter-observer variability** — measurement uncertainty between analysts. Depends on: 16
21. **Biological growth trend** — age-related decline in ring width. Depends on: 1, 4
22. **Standardization** — removing non-climate trends to extract signal. Depends on: 21
23. **Detrending methods** — mathematical curves to remove growth trends. Depends on: 22
24. **Curve fitting** — choosing appropriate detrending (negative exponential, spline, RCS). Depends on: 23
25. **High vs low frequency preservation** — tradeoff in what timescales are retained. Depends on: 24
26. **Biweight robust mean** — method for averaging multiple series. Depends on: 22
27. **Autoregression removal** — removing year-to-year autocorrelation. Depends on: 26
28. **Chronology types** — standard vs residual vs ARSTAN. Depends on: 26, 27
29. **EPS and Rbar** — statistics measuring chronology strength. Depends on: 19, 28
30. **Response functions** — statistical relationships between rings and climate. Depends on: 22, 28
31. **Correlation with climate** — identifying which climate variables are recorded. Depends on: 30
32. **Seasonal windows** — determining which months affect growth. Depends on: 31
33. **Pointer years** — extreme years visible across many trees/sites. Depends on: 15
34. **Volcanic forcing** — climate impacts of eruptions visible in rings. Depends on: 33
35. **Superposed epoch analysis** — detecting responses to events. Depends on: 33
36. **Signal asymmetry** — drought vs pluvial signal strength differences. Depends on: 4, 5
37. **Sample depth** — number of trees in chronology over time. Depends on: 19
38. **Replication** — adequacy of sample size for signal extraction. Depends on: 37
39. **Chronology strength** — confidence in the average signal. Depends on: 29, 38
40. **Reconstruction methods** — converting tree rings to climate estimates. Depends on: 30, 31
41. **Calibration period** — modern interval for building reconstruction model. Depends on: 40
42. **Verification** — testing reconstruction on independent data. Depends on: 41
43. **Transfer functions** — regression models linking rings to climate. Depends on: 40, 41
44. **Archaeological dating** — using tree rings to date structures. Depends on: 3, 16, 19
45. **Wiggle matching** — fitting ring patterns to master chronologies. Depends on: 19, 44
46. **Fire scars** — anatomical features recording past fires. Depends on: 9
47. **Fire return intervals** — frequency of fires from scar dates. Depends on: 46
48. **Disturbance ecology** — using rings to study outbreaks, climate stress. Depends on: 6, 22
49. **Stable isotope dendrochronology** — δ13C and δ18O in cellulose. Depends on: 22
50. **Blue intensity** — reflectance-based density proxy. Depends on: 2, 22
51. **Quantitative wood anatomy** — cellular measurements as climate proxies. Depends on: 9, 22

## Dependencies

- **Crossdating depends on ring identification** — you cannot date samples without first correctly identifying annual boundaries (including false and missing rings)
- **Standardization requires understanding growth trends** — biological age effects must be recognized before they can be removed
- **Climate reconstruction requires chronology strength** — adequate replication and signal strength are prerequisites for reliable inference
- **Advanced methods build on ring width foundation** — isotopes, blue intensity, and anatomy all require proper crossdating first
- **Statistical validation requires visual skills** — COFECHA catches mistakes, but analysts must first attempt correct crossdating
- **Applications inherit core method limitations** — whether for climate, archaeology, or ecology, fundamental crossdating and standardization principles apply

## Bottleneck Concepts

These concepts are critical checkpoints — students must master them before proceeding:

1. **Crossdating (concepts 14-19)** — the foundation of all dendrochronology. Cannot proceed to climate work without this skill.
2. **Standardization (concepts 22-24)** — essential for extracting climate signals. All quantitative work depends on this.
3. **Statistical validation (concepts 17-18, 29)** — distinguishes rigorous science from pattern-hunting. Required for publishable work.

## Mind-Blowing Moments

- **The Aegean volcanic eruption dates** — dendro constraining the Thera eruption to 1627 BCE, upending archaeological chronology
- **Viking L'Anse aux Meadows dated to exactly 1021 CE** — single-year precision for a millennium-old site
- **Medieval warm period and Little Ice Age** — seeing climate history emerge from tree patterns
- **Bristlecone pine chronologies** — 9000+ year continuous records, the longest climate record on Earth
- **Hidden fire regimes** — revealing that "pristine" forests actually burned every 5-15 years

## Common Misconceptions

1. **"One ring always equals one year"** — missing rings and false rings violate this; crossdating is essential
2. **"Wide rings mean good years"** — depends on limiting factor; in warm forests, wide rings may mean drought stress (temperature-limited)
3. **"Older trees have better climate signals"** — age trend can obscure signal; standardization is required
4. **"You need the pith to date a sample"** — crossdating works on any segment; pith is helpful but not essential
5. **"Dendro only works in temperate regions"** — tropical dendro is harder but feasible with careful species selection
6. **"Statistical correlation proves correct dating"** — high correlations can occur by chance or from systematic misdating; visual verification is critical
7. **"All trees at a site record the same climate"** — microsite variation, species differences, and individual tree factors create heterogeneity

## Prerequisite Topics

- **Basic statistics** — correlation, regression, hypothesis testing (needed for concepts 17-18, 30-31, 40-43)
- **Ecology fundamentals** — limiting factors, competition, disturbance (needed for concepts 4-6, 10-11, 48)
- **Scientific method** — hypothesis formation, verification, uncertainty (needed throughout)
- **Data analysis comfort** — working with time series, spreadsheets, or R (needed for concepts 18, 28, 30, 40-43)

## Cross-Disciplinary Connections

- **Climatology** — paleoclimate reconstruction, climate model validation
- **Archaeology** — absolute dating of structures, cultural chronologies
- **Ecology** — disturbance history, forest dynamics, carbon cycling
- **Hydrology** — streamflow reconstruction, drought history
- **Art history** — dating wooden artifacts, authentication
- **Forensics** — dating wood evidence, timber tracking
