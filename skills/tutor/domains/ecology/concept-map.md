# Ecology and Population Dynamics — Concept Map

## Core Concepts (in learning order)

1. **Population** — a group of individuals of the same species living in a defined area and time
2. **Demographic parameters** — birth rate, death rate, immigration, emigration that govern population change
3. **Age structure** — distribution of individuals across age classes, predicts future growth. Depends on: demographic parameters
4. **Survivorship curves** — probability of surviving to different ages (Type I, II, III). Depends on: age structure
5. **Life history strategies** — r-selected (many offspring, low investment) vs K-selected (few offspring, high investment). Depends on: survivorship curves, demographic parameters
6. **Exponential growth** — unlimited population increase when resources are abundant (dN/dt = rN). Depends on: demographic parameters
7. **Carrying capacity (K)** — maximum population size an environment can sustain. Depends on: resource availability
8. **Logistic growth** — population growth that slows as it approaches carrying capacity. Depends on: exponential growth, carrying capacity
9. **Density dependence** — factors whose effects intensify as population density increases. Depends on: carrying capacity, logistic growth
10. **Allee effects** — positive density dependence at low densities; populations can be too small to thrive. Depends on: density dependence
11. **Minimum viable population (MVP)** — smallest population that can persist long-term. Depends on: Allee effects, stochasticity
12. **Interspecific competition** — species competing for shared resources. Depends on: density dependence, resource partitioning
13. **Competitive exclusion** — complete competitors cannot coexist; one outcompetes the other. Depends on: interspecific competition
14. **Resource partitioning** — species reduce competition by using different resources or habitats. Depends on: interspecific competition, competitive exclusion
15. **Predator-prey dynamics** — coupled population cycles of consumers and consumed. Depends on: density dependence
16. **Lotka-Volterra models** — mathematical framework for predator-prey and competition. Depends on: predator-prey dynamics, interspecific competition
17. **Mutualism** — both species benefit from the interaction. Depends on: species interactions
18. **Symbiosis** — close, long-term interaction between species (parasitism, commensalism, mutualism). Depends on: mutualism, predation
19. **Coevolution** — reciprocal evolutionary change in interacting species. Depends on: symbiosis, predator-prey dynamics
20. **Community structure** — composition and organization of species in a community. Depends on: all interaction types
21. **Species diversity** — number of species (richness) and their relative abundances (evenness). Depends on: community structure
22. **Ecological succession** — directional change in community composition over time. Depends on: community structure, species interactions
23. **Pioneer species** — first colonizers in succession, tolerant of harsh conditions. Depends on: ecological succession
24. **Climax community** — stable endpoint of succession (though this is now debated). Depends on: ecological succession
25. **Keystone species** — species with disproportionate impact on community structure. Depends on: species diversity, community structure
26. **Trophic cascade** — indirect effects propagating up/down food web. Depends on: keystone species, predation
27. **Ecosystem engineers** — species that modify physical environment, creating habitat. Depends on: community structure
28. **Trophic levels** — feeding positions in a food chain (producers, primary consumers, etc.). Depends on: energy flow
29. **Energy pyramids** — representation of energy available at each trophic level. Depends on: trophic levels
30. **10% rule** — approximately 10% of energy transfers between trophic levels. Depends on: energy pyramids, trophic levels
31. **Food web** — network of feeding relationships in a community. Depends on: trophic levels, species interactions
32. **Web stability** — resilience of food webs to species loss or perturbation. Depends on: food web complexity, redundancy
33. **Biogeochemical cycles** — movement of nutrients through biotic and abiotic components. Depends on: ecosystem processes
34. **Carbon cycle** — movement of carbon through atmosphere, biosphere, hydrosphere, lithosphere. Depends on: biogeochemical cycles
35. **Nitrogen cycle** — nitrogen transformations and movement (fixation, nitrification, denitrification). Depends on: biogeochemical cycles
36. **Nutrient limitation** — growth constrained by scarcity of specific nutrients. Depends on: biogeochemical cycles
37. **Invasion ecology** — study of non-native species establishment and spread. Depends on: population growth, competition, community structure
38. **Island biogeography** — species richness determined by island size and isolation. Depends on: immigration, extinction, area
39. **Metapopulation** — network of connected local populations with extinction and recolonization. Depends on: population dynamics, spatial structure
40. **Population viability analysis (PVA)** — estimating extinction risk for conservation. Depends on: minimum viable population, stochasticity

## Dependencies

### Foundational Dependencies
- **Logistic growth** requires understanding **exponential growth** because it's a modification that adds a brake (carrying capacity) to unlimited growth
- **Density dependence** builds on **carrying capacity** because it explains the mechanism by which K is enforced
- **Allee effects** invert **density dependence** logic — instead of crowding being harmful, isolation becomes harmful

### Interaction Dependencies
- **Competitive exclusion** requires **interspecific competition** because it's the extreme outcome when niches overlap completely
- **Resource partitioning** emerges from **competitive exclusion** pressure as an evolutionary response
- **Lotka-Volterra models** mathematically formalize **predator-prey dynamics** and **competition**, showing how coupled populations change

### Community Dependencies
- **Species diversity** depends on all **interaction types** because competition, predation, and mutualism all influence which species coexist and at what abundances
- **Ecological succession** requires understanding **community structure** and **species interactions** because succession is driven by facilitation, tolerance, and inhibition among species
- **Keystone species** concept needs **species diversity** and **community structure** as context to understand disproportionate impact

### Ecosystem Dependencies
- **Food web** integrates **trophic levels** and **species interactions** into a network representation
- **Trophic cascade** depends on **keystone species** (often top predators) and **food web** structure to explain indirect effects
- **Biogeochemical cycles** require understanding **trophic levels** because producers, consumers, and decomposers play distinct roles in nutrient transformation

### Applied Dependencies
- **Island biogeography** builds on **immigration** (colonization rate) and **extinction** (influenced by population size, stochasticity) to predict equilibrium species richness
- **Metapopulation** theory extends single-population dynamics to spatially structured populations with local extinction and recolonization
- **Population viability analysis** synthesizes **minimum viable population**, **stochasticity**, **Allee effects**, and **habitat quality** to forecast persistence

## Critical Bottlenecks

### Mathematical Modeling
Many students struggle when ecology shifts from descriptive to quantitative:
- **Exponential vs logistic growth** — interpreting differential equations, reading phase diagrams
- **Lotka-Volterra models** — understanding coupled equations, parameter sensitivity, isoclines

**Teaching strategy**: Build intuition with simulations (NetLogo) before equations. Start with graphs, ask what changes, then introduce the math.

### Scale Transitions
Concepts at different scales aren't always intuitive:
- **Population → Community** — individual interactions scale to community patterns
- **Community → Ecosystem** — species composition affects energy/nutrient flows

**Teaching strategy**: Use case studies that explicitly bridge scales (e.g., wolf reintroduction affects elk population → vegetation → stream morphology).

### Temporal Dynamics
Distinguishing short-term vs long-term patterns:
- **Succession** looks like directional change but may be stochastic at fine scales
- **Population cycles** can be stable oscillations or chaotic depending on parameters

**Teaching strategy**: Emphasize timescales explicitly. What happens in 1 year vs 10 years vs 100 years?

## Prerequisite Topics

### From Biology
- **Evolution and natural selection** — needed for: life history strategies, coevolution, resource partitioning
- **Genetics** — needed for: minimum viable population (inbreeding depression), adaptation
- **Cell biology and metabolism** — needed for: energy pyramids (respiration costs), nutrient cycling

### From Mathematics
- **Exponential functions** — needed for: exponential growth, decay processes
- **Derivatives** — needed for: interpreting dN/dt, understanding instantaneous rates
- **Reading graphs** — needed for: phase diagrams, time series, survivorship curves

### From Chemistry (helpful but not essential)
- **Chemical reactions and stoichiometry** — helpful for: nitrogen cycle transformations, nutrient limitation
- **pH and equilibria** — helpful for: carbon cycle (ocean acidification), nutrient availability

## Common Conceptual Traps

### Teleology
Students often describe populations or ecosystems as "wanting" or "trying" to achieve something (e.g., "populations want to reach carrying capacity").

**Correction**: Emphasize mechanism — populations don't have goals; density-dependent factors mechanistically slow growth as K is approached.

### Static vs Dynamic Equilibrium
Many assume "equilibrium" means "unchanging" rather than "balanced change."

**Correction**: Show oscillating systems (predator-prey) that have a stable attractor but constant fluctuation.

### Confusing Energy and Nutrients
Energy flows through (lost as heat), nutrients cycle (recycled).

**Correction**: Explicit comparison — trace both through the same food web to show the contrast.

### Anthropomorphizing Interactions
Describing competition as "aggressive" or mutualism as "cooperative" imports human values.

**Correction**: Frame interactions by fitness consequences — does interaction increase or decrease reproductive success?
