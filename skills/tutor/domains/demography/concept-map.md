# Demography — Concept Map

## Core Concepts (in learning order)

1. **Population size and census** — how we count people; foundation for all demographic measurement
2. **Crude rates** — basic measures (births/deaths per 1000). Simple but limited.
3. **Growth rate** — how fast populations change. Depends on: crude rates, balancing equation
4. **Age structure** — distribution of population by age; critical for understanding all demographic processes
5. **Population pyramid** — visual representation of age-sex structure. Depends on: age structure
6. **Dependency ratio** — ratio of non-working to working age. Depends on: age structure, population pyramid
7. **Age-specific rates** — rates calculated for specific age groups; more precise than crude rates. Depends on: crude rates, age structure
8. **Life expectancy** — average years lived. Depends on: age-specific mortality rates
9. **Life table** — complete mortality schedule by age. Depends on: age-specific rates, survival probability
10. **Survival probability** — chance of living to a given age. Depends on: life table, mortality rates
11. **Infant mortality** — deaths before age 1 per 1000 live births; sensitive indicator. Depends on: age-specific rates
12. **Cohort vs period** — following a birth cohort vs observing a period; fundamental distinction. Depends on: age structure
13. **Total fertility rate (TFR)** — average children per woman. Depends on: age-specific fertility rates
14. **Replacement level** — fertility level needed to maintain population (~2.1). Depends on: TFR, infant mortality
15. **Gross reproduction rate** — female births per woman. Depends on: TFR, sex ratio at birth
16. **Net reproduction rate** — female births accounting for survival. Depends on: GRR, life table
17. **Proximate determinants of fertility** — mechanisms through which socioeconomic factors affect fertility. Depends on: TFR
18. **Migration measurement** — net migration, in/out flows. Depends on: balancing equation
19. **Selectivity of migration** — migrants differ from non-migrants, especially by age. Depends on: age structure, migration
20. **Population momentum** — continued growth after fertility falls. Depends on: age structure, TFR
21. **Population aging** — increasing median age and old-age share. Depends on: age structure, dependency ratio, life expectancy
22. **Support ratio** — workers per elderly person. Depends on: dependency ratio, age structure
23. **Demographic transition theory** — model of mortality and fertility decline. Depends on: mortality, fertility, growth rate
24. **Epidemiological transition** — shift in causes of death. Depends on: life expectancy, mortality patterns
25. **Cohort-component projection** — project by age cohorts forward. Depends on: age structure, fertility, mortality, migration assumptions

## Dependencies

### Measurement Foundation
- **Age-specific rates** require understanding **crude rates** because they refine the concept by removing age-structure confounding
- **Life table** requires **age-specific mortality rates** as input to construct the survivorship schedule
- **Survival probability** flows directly from the **life table** lx column

### Fertility Chain
- **TFR** aggregates **age-specific fertility rates** into a single summary measure
- **Replacement level** depends on **TFR** (quantum) and **infant mortality** (since some children don't survive to reproduce)
- **Net reproduction rate** combines **gross reproduction rate** (births) with **life table** (survival), showing whether a cohort replaces itself
- **Proximate determinants** explain variation in **TFR** through marriage, contraception, and other intermediate variables

### Structure and Momentum
- **Population pyramid** visualizes **age structure**, making patterns visible at a glance
- **Dependency ratio** is calculated from **age structure**, showing economic burden
- **Population momentum** occurs because young **age structures** (many future parents) drive growth even if **TFR** falls to replacement
- **Population aging** reflects interaction of declining **fertility** (fewer young), rising **life expectancy** (more old), changing **age structure**

### Transition Theories
- **Demographic transition** synthesizes changes in **mortality**, **fertility**, and **growth rates** into a developmental framework
- **Epidemiological transition** explains the **life expectancy** gains in the demographic transition through changing disease patterns
- **Cohort-component projection** projects future **age structure** by applying assumptions about **fertility**, **mortality**, and **migration** to each age cohort

### Migration Complexity
- **Migration measurement** completes the **balancing equation** (growth = births - deaths + net migration)
- **Selectivity** means migration disproportionately affects certain ages, altering **age structure** and downstream measures like **dependency ratio**

## Bottleneck Concepts

These concepts are particularly critical — struggling here blocks progress on many later topics:

1. **Age structure** — nearly everything in demography is age-specific. Without comfort reading and thinking about age distributions, students will struggle.
2. **Cohort vs period** — this distinction appears everywhere (life expectancy, TFR, life tables). Confusion here cascades.
3. **Life table** — the lx, dx, qx, Lx, Tx columns intimidate students, but they're central to mortality analysis and used in NRR calculations.
4. **Population momentum** — counterintuitive (fertility at replacement yet growth continues); requires solid grasp of age structure.

## Common Misconceptions

1. **"Life expectancy = how long people live"** — Students confuse period life expectancy (synthetic cohort) with actual lifespan. Need to emphasize period vs cohort distinction.
2. **"TFR = births this year"** — TFR is a hypothetical measure based on age-specific rates, not actual births. It's a synthetic cohort measure.
3. **"Low TFR means immediate population decline"** — Ignores population momentum; young age structures mean growth continues even after fertility falls.
4. **"Crude rates are useless"** — They're limited but not useless; good for quick comparisons when age structures are similar.
5. **"Migration is small compared to births/deaths"** — True globally, false for many individual countries (e.g., UAE, Singapore, Canada).
6. **"Aging is bad"** — Framing aging only as dependency ignores improved health of elderly and the achievement of longer lives.

## Prerequisites from Other Topics

- **Basic statistics** — needed for understanding rates, means, standardization, probability
- **Algebra** — exponential growth, logarithms (for doubling time), solving equations
- **Percentages and ratios** — nearly every demographic measure is a rate or ratio
- **Graph reading** — essential for population pyramids, survival curves, fertility trends
- **Historical awareness** — demographic transition makes more sense with context on industrialization, public health, women's education

## Unexpected Connections

- **Actuarial science** — life tables originated for life insurance pricing
- **Ecology** — population dynamics concepts (r/K selection, carrying capacity) parallel demographic ideas
- **Economics** — dependency ratios, labor force participation, dividend windows
- **Public health** — epidemiological transition, excess mortality, health equity
- **Urban planning** — population projections drive infrastructure and housing needs
- **Climate science** — population projections affect emissions scenarios
- **Genetics** — effective population size, founder effects, migration patterns
- **History** — demographic transitions explain historical events (baby boom, Black Death, colonial settlement patterns)
