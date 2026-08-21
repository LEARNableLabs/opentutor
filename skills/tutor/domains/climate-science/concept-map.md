# Climate Science — Modeling and Feedbacks: Concept Map

## Core Concepts (in learning order)

1. **Planetary energy balance** — Earth's temperature results from balancing incoming solar radiation with outgoing thermal radiation
2. **Blackbody radiation** — All objects emit radiation proportional to T⁴ (Stefan-Boltzmann law)
3. **Greenhouse effect** — Certain atmospheric gases absorb infrared radiation, trapping heat
4. **Radiative forcing** — Change in energy flux at the tropopause due to perturbations (e.g., CO₂ increase)
5. **Climate sensitivity** — Temperature response to radiative forcing, amplified by feedbacks. Depends on: greenhouse effect, radiative forcing
6. **Ice-albedo feedback** — Melting ice reduces surface reflectivity, absorbing more solar energy. Depends on: planetary energy balance
7. **Water vapor feedback** — Warmer air holds more moisture; water vapor is a greenhouse gas. Depends on: greenhouse effect, Clausius-Clapeyron relation
8. **Cloud feedback** — Clouds both reflect sunlight and trap heat; net effect uncertain. Depends on: radiative forcing, water vapor
9. **Carbon cycle feedback** — Warming affects ocean/land CO₂ uptake, creating feedback loops. Depends on: greenhouse effect
10. **Feedback quantification** — Expressing feedback strength as gain factors and feedback parameters. Depends on: climate sensitivity, all feedback mechanisms
11. **Meridional heat transport** — Atmosphere and ocean move heat from equator to poles. Depends on: energy balance
12. **Atmospheric circulation cells** — Hadley, Ferrel, and Polar cells driven by differential heating. Depends on: meridional heat transport
13. **Rossby waves and jet streams** — Large-scale atmospheric waves that shape mid-latitude weather. Depends on: atmospheric circulation
14. **Thermohaline circulation** — Ocean conveyor belt driven by temperature and salinity gradients. Depends on: meridional heat transport
15. **Ocean-atmosphere coupling** — Interactions like ENSO that affect global climate. Depends on: atmospheric circulation, thermohaline circulation
16. **Tipping points** — Critical thresholds (e.g., AMOC collapse) where systems shift abruptly. Depends on: feedback mechanisms, circulation
17. **Discretization** — Converting continuous equations to finite grid for computers. Depends on: calculus, differential equations
18. **Energy balance models (1D)** — Simplest numerical climate models with vertical structure. Depends on: discretization, energy balance
19. **General Circulation Models (GCMs)** — 3D models solving fluid dynamics on global grid. Depends on: discretization, circulation concepts
20. **Parameterization** — Representing subgrid processes (clouds, convection) with simplified equations. Depends on: GCM structure
21. **Component coupling** — Linking atmosphere, ocean, land, ice models into unified system. Depends on: GCM architecture
22. **Model validation** — Testing model accuracy against observations and theory. Depends on: all modeling concepts
23. **Uncertainty quantification** — Understanding model spread and structural uncertainty. Depends on: model validation, feedback quantification
24. **Climate projections** — Using models to explore future scenarios under different forcings. Depends on: GCMs, uncertainty quantification

## Dependencies

- **Climate sensitivity** requires understanding both the **greenhouse effect** (the direct forcing) and **feedback mechanisms** (the amplification)
- **Water vapor feedback** builds on the **Clausius-Clapeyron relation** (from thermodynamics) and the **greenhouse effect**
- **Cloud feedback** is the most uncertain because it depends on **water vapor dynamics**, **convection** (a parameterized process), and **radiation** in complex ways
- **Feedback quantification** requires mathematical formalism but builds on intuition from all the individual feedback mechanisms
- **Atmospheric and ocean circulation** are parallel concepts that both serve meridional heat transport, but they couple in important ways (ENSO, monsoons)
- **Tipping points** emerge when **positive feedbacks** dominate over **negative feedbacks**, creating instability
- **Parameterization** is necessary because **GCMs** can't resolve cloud-scale processes, but this introduces uncertainty
- **Model validation** requires both understanding the **physics** (to check if models get the right answer for the right reasons) and **statistics** (to quantify agreement)
- **Climate projections** are only meaningful after establishing **model validation** and **uncertainty quantification**

## Bottleneck Concepts

These concepts are critical gateways — struggle here means downstream difficulty:

1. **Energy balance** — If students don't internalize that Earth's temperature is an equilibrium between in/out energy fluxes, everything else feels arbitrary
2. **Positive vs negative feedback** — Distinguishing amplifying from stabilizing effects is essential for understanding climate sensitivity
3. **Discretization** — Moving from continuous calculus to discrete grids is a cognitive leap needed for all numerical modeling
4. **Parameterization** — Understanding why we can't simulate everything from first principles is key to interpreting model limitations

## Mind-Blowing Moments

Points where deep understanding clicks or worldview shifts:

1. **Simple models capture the big picture** — A model you can solve on paper (0D energy balance) gets Earth's temperature roughly right
2. **Feedbacks can dominate forcing** — The direct effect of CO₂ doubling (~1°C) is small; feedbacks amplify it 3-5x
3. **We're in a metastable state** — Current climate is stable, but past climates show we can tip into very different regimes
4. **All models are wrong, some are useful** — No GCM perfectly represents reality, yet they reliably project warming
5. **The ocean is the memory** — Atmosphere responds fast; ocean takes centuries, creating commitment to future warming
6. **Clouds are both umbrella and blanket** — They cool by day (reflecting sunlight) and warm by night (trapping heat), making cloud feedback brutally hard

## Common Misconceptions

1. **"CO₂ is a small part of the atmosphere so it can't matter"** — Small concentration doesn't mean small effect; CO₂ absorbs in critical infrared bands
2. **"The greenhouse effect is like an actual greenhouse"** — Real greenhouses work by blocking convection, not radiation
3. **"Water vapor is the most important greenhouse gas, so CO₂ doesn't matter"** — Water vapor is a fast feedback, not a forcing; CO₂ drives the water vapor response
4. **"Models are just curve-fitting"** — GCMs solve physics equations; they're not statistical fits
5. **"If models disagree, they must all be wrong"** — Model spread quantifies uncertainty; agreement would be suspicious given structural differences
6. **"Negative feedback means cooling"** — Negative feedback means stabilizing (reducing sensitivity), not reversing temperature change
7. **"Climate sensitivity is directly measurable"** — We can't run controlled experiments on Earth; sensitivity is inferred from multiple lines of evidence
8. **"Tipping points are sudden jumps"** — Some transitions take decades or centuries; "tipping point" refers to when change becomes irreversible

## Prerequisite Topics

- **Calculus** — derivatives for rates of change (energy flux gradients), integrals for area/volume integration
- **Differential equations** — climate is modeled as systems of ODEs/PDEs
- **Thermodynamics** — first law (energy conservation), heat capacity, phase transitions, Clausius-Clapeyron
- **Fluid dynamics (basic)** — helpful but not required; can be learned in parallel
- **Programming** — Python or Julia for building simple models and analyzing output
- **Linear algebra** — matrix operations for discretized systems (less critical for this curriculum)
