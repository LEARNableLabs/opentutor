# Water Treatment and Environmental Engineering — Concept Map

## Core Concepts (in learning order)

1. **Contaminant types** — Physical, chemical, and biological pollutants in water
2. **Water quality parameters** — Measurable indicators (turbidity, BOD, COD, pathogens, pH, etc.)
3. **Regulatory standards** — WHO, EPA, and other guidelines for safe water
4. **Treatment objectives** — Specific removal targets based on contaminant type and water use
5. **Mass balance** — Conservation of mass for reactor design and performance prediction. Depends on: contaminant types
6. **Reactor configurations** — Batch, CSTR, PFR, and their implications for treatment. Depends on: mass balance
7. **Retention time** — HRT (hydraulic) and SRT (solids) and their role in treatment efficiency. Depends on: reactor configurations
8. **Treatment train design** — Sequential unit operations from source to tap. Depends on: treatment objectives, mass balance
9. **Coagulation** — Destabilization of colloidal particles using chemical coagulants. Depends on: contaminant types
10. **Flocculation** — Aggregation of destabilized particles into settleable flocs. Depends on: coagulation
11. **Sedimentation** — Gravity settling of particles based on Stokes' law. Depends on: flocculation
12. **Settling velocity** — Rate at which particles settle, function of size and density. Depends on: sedimentation
13. **Overflow rate** — Design parameter for sedimentation tanks. Depends on: settling velocity
14. **Filtration mechanisms** — Straining, interception, diffusion, and sedimentation in filters. Depends on: sedimentation
15. **Deep bed filtration** — Granular media filters (sand, anthracite). Depends on: filtration mechanisms
16. **Membrane filtration** — Pressure-driven separation (MF, UF, NF, RO). Depends on: filtration mechanisms
17. **Disinfection kinetics** — CT (concentration × time) concept for pathogen inactivation. Depends on: treatment objectives
18. **Chlorine chemistry** — HOCl/OCl- speciation and disinfection effectiveness. Depends on: disinfection kinetics
19. **Disinfection byproducts** — THMs and HAAs formed during chlorination. Depends on: chlorine chemistry
20. **Alternative disinfection** — UV, ozone as alternatives to chlorine. Depends on: disinfection kinetics
21. **Microbial metabolism** — How microorganisms degrade organic matter aerobically/anaerobically. Depends on: contaminant types
22. **BOD and COD** — Measures of biodegradable and total organic content. Depends on: microbial metabolism, water quality parameters
23. **Growth kinetics** — Monod equation for microbial growth rate. Depends on: microbial metabolism
24. **Substrate utilization** — Rate of contaminant consumption by microorganisms. Depends on: growth kinetics
25. **Biomass yield** — Amount of biomass produced per unit substrate consumed. Depends on: substrate utilization
26. **Activated sludge process** — Aerated biological treatment with biomass recycle. Depends on: growth kinetics, SRT
27. **Mixed liquor** — Suspension of wastewater and active biomass. Depends on: activated sludge process
28. **Sludge recycle** — Return of settled biomass to maintain MLSS concentration. Depends on: activated sludge process
29. **Nitrification** — Biological oxidation of ammonia to nitrate. Depends on: microbial metabolism
30. **Denitrification** — Biological reduction of nitrate to nitrogen gas. Depends on: nitrification
31. **Biological phosphorus removal** — Enhanced biological phosphorus uptake. Depends on: microbial metabolism
32. **Nutrient cycling** — Nitrogen and phosphorus transformations in treatment. Depends on: nitrification, denitrification, biological phosphorus removal
33. **Membrane types** — Classification by pore size (MF, UF, NF, RO). Depends on: membrane filtration
34. **Adsorption** — Surface binding of dissolved contaminants to solid media. Depends on: contaminant types
35. **Activated carbon** — Highly porous adsorbent for organic contaminants. Depends on: adsorption
36. **Isotherm models** — Langmuir, Freundlich for adsorption equilibrium. Depends on: activated carbon
37. **Breakthrough curves** — Temporal profile of adsorber performance. Depends on: adsorption
38. **Emerging contaminants** — Pharmaceuticals, personal care products, microplastics. Depends on: water quality parameters
39. **Advanced oxidation processes** — Hydroxyl radical generation for contaminant destruction. Depends on: alternative disinfection, emerging contaminants
40. **Water reuse** — Treating wastewater for beneficial uses. Depends on: treatment train design
41. **Potable reuse** — Treating wastewater to drinking water standards. Depends on: water reuse, regulatory standards
42. **Multiple barrier approach** — Redundant treatment steps for safety. Depends on: potable reuse
43. **Energy consumption** — Energy required for pumping, aeration, treatment. Depends on: all treatment processes
44. **Energy recovery** — Biogas from anaerobic digestion, hydropower from flow. Depends on: energy consumption
45. **Sustainability metrics** — Life cycle assessment, carbon footprint. Depends on: energy consumption, energy recovery

## Dependencies

- **Treatment train design** requires understanding **mass balance**, **treatment objectives**, and **contaminant types** because different contaminants require different removal mechanisms in specific sequences.

- **Coagulation-flocculation-sedimentation** form a linked sequence: particles must be destabilized before they can aggregate, and aggregates must be large enough to settle effectively.

- **Disinfection kinetics** builds on **treatment objectives** because the required CT value depends on the target pathogen and desired log reduction.

- **Activated sludge process** depends critically on **growth kinetics** and **SRT** because maintaining the right biomass concentration requires balancing growth rate with sludge wasting rate.

- **Biological nutrient removal** builds on **microbial metabolism** because different bacterial guilds (nitrifiers, denitrifiers, PAOs) have distinct metabolic requirements and environmental preferences.

- **Advanced oxidation processes** build on both **alternative disinfection** (oxidant chemistry) and **emerging contaminants** (need for stronger oxidation) because conventional treatment doesn't destroy these compounds.

- **Potable reuse** requires the **multiple barrier approach** combining physical (membranes), chemical (advanced oxidation), and biological treatment because no single process can guarantee safety for all contaminants.

- **Sustainability assessment** integrates across **all treatment processes** because energy, chemical use, and residuals production must be evaluated holistically.

## Bottleneck Concepts

These concepts gate progress if not mastered:

1. **Mass balance** — fundamental to all design calculations; students struggling here cannot size reactors or predict performance
2. **Retention time (HRT and SRT)** — critical distinction that underlies both physical and biological treatment design
3. **Growth kinetics (Monod)** — gatekeeper for biological treatment; students who can't manipulate the Monod equation can't design activated sludge systems
4. **Disinfection kinetics (CT)** — essential for safe drinking water; misconceptions here have public health implications
5. **Nitrification-denitrification coupling** — key to nutrient removal; requires understanding different electron acceptors and redox conditions

## Common Misunderstandings

- **Coagulation ≠ flocculation** — students often conflate these distinct steps
- **BOD vs COD** — confusion about what each measures and when to use each
- **HRT vs SRT** — critical distinction for biological treatment design
- **Membrane pore size** — thinking all membranes work the same way regardless of pore size
- **Disinfection = sterilization** — disinfection achieves log reduction, not complete elimination

## Prerequisite Topics

- **General chemistry** — needed for: coagulation chemistry, disinfection chemistry, precipitation, redox reactions
- **Basic biology** — needed for: microbial metabolism, growth kinetics, ecological concepts
- **Fluid mechanics fundamentals** — needed for: reactor hydraulics, settling velocity, filtration flow, pumping
- **Mass and energy balances** — needed for: all reactor design, process integration, sustainability assessment
