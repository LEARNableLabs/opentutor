# Hydrology and Water Cycles — Concept Map

## Core Concepts (in learning order)

1. **Water reservoirs** — where water is stored on Earth (oceans, ice, groundwater, atmosphere)
2. **Global water budget** — quantifying storage and fluxes between reservoirs
3. **Closed system** — Earth's water is neither created nor destroyed, only cycled. Depends on: water reservoirs
4. **Water cycle fluxes** — rates of movement between reservoirs (precipitation, evaporation, runoff)
5. **Latent heat** — energy required for phase changes, drives atmospheric circulation. Depends on: water cycle fluxes
6. **Energy balance** — heat budget that powers the water cycle
7. **Residence time** — average time water spends in each reservoir. Depends on: water reservoirs, fluxes
8. **Humidity and saturation** — atmospheric water content and capacity
9. **Condensation and cloud formation** — phase change from vapor to liquid. Depends on: latent heat, humidity
10. **Precipitation types** — rain, snow, sleet, hail formation mechanisms. Depends on: condensation
11. **Evapotranspiration** — combined evaporation and plant transpiration. Depends on: energy balance, humidity
12. **Watershed** — topographically defined drainage area
13. **Infiltration** — water entering soil, controlled by soil properties and moisture
14. **Runoff generation** — mechanisms that produce surface flow. Depends on: precipitation, infiltration
15. **Hydrograph** — graph of streamflow vs time, shows watershed response. Depends on: runoff generation
16. **Unit hydrograph** — linear rainfall-runoff model. Depends on: hydrograph, watershed characteristics
17. **SCS curve number** — empirical runoff prediction method. Depends on: watershed, soil type, land use
18. **Flood frequency** — statistical analysis of extreme events. Depends on: hydrograph analysis
19. **Porosity** — fraction of rock/soil that is void space, controls storage
20. **Hydraulic conductivity** — rate water moves through porous media. Depends on: porosity, permeability
21. **Darcy's Law** — fundamental equation for groundwater flow. Depends on: hydraulic conductivity, hydraulic gradient
22. **Aquifer** — water-bearing geologic formation. Depends on: porosity, hydraulic conductivity
23. **Well hydraulics** — flow to pumping wells, drawdown. Depends on: Darcy's Law, aquifer properties
24. **Baseflow** — groundwater contribution to streams. Depends on: groundwater discharge, aquifer connection
25. **Groundwater-surface water interaction** — exchange between rivers and aquifers. Depends on: baseflow, hydraulic gradients
26. **Potentiometric surface** — imaginary surface representing hydraulic head in aquifer. Depends on: Darcy's Law
27. **Water balance** — accounting equation: inputs = outputs + change in storage. Depends on: all flux terms
28. **Conceptual hydrological models** — simplified representations of watershed processes. Depends on: water balance, runoff mechanisms
29. **Distributed vs lumped models** — spatial resolution approaches. Depends on: conceptual models
30. **Model calibration** — fitting model parameters to observations. Depends on: hydrological models, data
31. **Model uncertainty** — quantifying prediction errors. Depends on: calibration, data quality
32. **Climate change impacts** — altered precipitation, temperature, extremes. Depends on: water cycle, energy balance
33. **Urbanization effects** — increased imperviousness and runoff. Depends on: infiltration, runoff generation
34. **Water resources management** — balancing human and environmental needs. Depends on: all components
35. **Environmental flows** — maintaining ecosystem health. Depends on: baseflow, streamflow variability

## Dependencies

### Fundamental Dependencies
- **Energy balance** requires understanding **latent heat** and **phase changes** because water movement is fundamentally driven by solar energy input and energy transformations
- **Residence time** requires understanding **water reservoirs** and **fluxes** because it's calculated as storage divided by flux rate
- **Water cycle fluxes** depend on **closed system** concept because mass conservation constrains the global budget

### Atmospheric Process Dependencies
- **Cloud formation** requires understanding **humidity**, **saturation**, and **latent heat** because condensation only occurs when air is saturated and requires energy release
- **Precipitation types** depend on **condensation** and **temperature profiles** because the form of precipitation depends on atmospheric temperature structure
- **Evapotranspiration** requires **energy balance** and **humidity** because it's limited by available energy and atmospheric vapor pressure deficit

### Surface Water Dependencies
- **Runoff generation** depends on **precipitation**, **infiltration**, and **watershed characteristics** because surface flow only occurs when rainfall exceeds infiltration capacity or when soil is saturated
- **Hydrograph analysis** requires understanding **runoff generation** and **watershed** because the shape of a hydrograph reflects how a watershed transforms rainfall into streamflow
- **Unit hydrograph** builds on **hydrograph** and assumes **linearity** and **time invariance** because it's a linear systems approach to rainfall-runoff transformation
- **Flood frequency** requires extensive **hydrograph** data and **statistical analysis** because return periods are estimated from historical flow records

### Groundwater Dependencies
- **Darcy's Law** requires **hydraulic conductivity**, **porosity**, and **hydraulic gradient** because groundwater flow is proportional to conductivity and head gradient
- **Well hydraulics** builds on **Darcy's Law** and **radial flow geometry** because pumping creates radial flow patterns with specific solutions
- **Baseflow** depends on **groundwater discharge** and **aquifer-stream connection** because it represents the groundwater contribution to streamflow
- **Groundwater-surface water interaction** requires understanding both **surface hydrology** and **groundwater** because rivers and aquifers exchange water bidirectionally based on hydraulic gradients

### Modeling Dependencies
- **Water balance** integrates **all flux terms** (precipitation, ET, runoff, infiltration, storage change) because it's a conservation equation
- **Conceptual models** require understanding **water balance** and **dominant processes** because models simplify reality by representing key processes
- **Model calibration** depends on **observations** (hydrographs, water levels) and **parameter sensitivity** because we adjust parameters to match model output to data
- **Model uncertainty** builds on **calibration** and **data quality** because prediction errors arise from parameter, input, and structural uncertainty

### Application Dependencies
- **Climate change impacts** require understanding **energy balance**, **precipitation**, and **evapotranspiration** because climate affects all components of the water cycle
- **Urbanization effects** depend on **infiltration** and **runoff generation** because impervious surfaces reduce infiltration and increase runoff
- **Water resources management** requires integrating **all hydrological components** because management decisions affect surface water, groundwater, and water quality

## Critical Bottlenecks

### Conceptual Bottleneck: Systems Thinking
Students must develop **systems thinking** to understand how components interact. The water cycle isn't a linear sequence—it's a network of interconnected processes with feedbacks. Difficulty arises when students think of components in isolation.

### Mathematical Bottleneck: From Conceptual to Quantitative
The transition from **qualitative understanding** (e.g., "water flows downhill") to **quantitative analysis** (e.g., applying Darcy's Law) is challenging. Students need comfort with differential equations, units, and dimensional analysis.

### Spatial Bottleneck: 3D Thinking
Many students struggle with **spatial reasoning** required for watersheds (topographic control), groundwater flow (3D flow fields), and aquifer mapping. This is especially challenging for subsurface processes that can't be directly observed.

### Statistical Bottleneck: Probability and Uncertainty
**Flood frequency analysis** and **model uncertainty** require probabilistic thinking, which students often find counterintuitive (e.g., "100-year flood" can happen in consecutive years).

## Prerequisite Topics

- **Basic physics** — needed for energy balance, latent heat, forces (gravity), pressure
- **Algebra and basic calculus** — needed for Darcy's Law, water balance equations, derivatives (gradients)
- **Environmental science fundamentals** — needed for understanding Earth systems, biogeochemical cycles
- **Map reading and spatial thinking** — needed for watershed delineation, interpreting topographic maps, cross-sections
- **Basic statistics** — helpful for flood frequency, data analysis, uncertainty quantification

## Common Misconceptions

See teaching-notes.md for detailed discussion, but key misconceptions include:

1. **"Groundwater is an underground river"** — Actually flows slowly through pore spaces
2. **"The water cycle is a simple circle"** — Actually a complex network with multiple pathways and timescales
3. **"Rain that falls in a watershed all becomes streamflow"** — Much is lost to ET and infiltration
4. **"Impermeable means water can't pass through"** — Actually means very low (not zero) permeability
5. **"100-year flood happens every 100 years"** — It's a probability (1% annual chance), not a schedule
