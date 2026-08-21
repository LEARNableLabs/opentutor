# Nuclear Reactor Design — Concept Map

## Core Concepts (in learning order)

1. **Neutron multiplication** — the chain reaction: one fission produces neutrons that cause more fissions
2. **Criticality** — the balance point where each fission causes exactly one more fission (k-eff = 1)
3. **Neutron cross-sections** — the probability that a neutron will interact with a nucleus (measured in barns)
4. **Moderation** — slowing down fast neutrons to thermal energies where fission cross-sections are larger. Depends on: neutron cross-sections
5. **Neutron energy spectrum** — distribution of neutron energies (thermal vs fast). Depends on: moderation
6. **Diffusion theory** — simplified mathematical model of neutron transport through a medium. Depends on: neutron cross-sections
7. **Burnup** — consumption of fissile material and accumulation of fission products. Depends on: criticality, cross-sections
8. **Lattice design** — geometric arrangement of fuel, moderator, and coolant. Depends on: moderation, neutron spectrum
9. **Power distribution** — spatial variation in fission rate across the core. Depends on: diffusion theory, lattice design
10. **Peaking factors** — local-to-average power ratios (radial and axial). Depends on: power distribution
11. **Reactivity coefficients** — how reactivity changes with temperature, void, etc. Depends on: criticality, neutron spectrum
12. **Heat flux** — rate of heat transfer from fuel to coolant per unit area. Depends on: power distribution
13. **Two-phase flow** — simultaneous presence of liquid and vapor coolant. Depends on: heat flux
14. **Critical heat flux** — the heat flux at which boiling crisis occurs. Depends on: two-phase flow
15. **Natural circulation** — coolant flow driven by density differences, not pumps. Depends on: two-phase flow
16. **Decay heat** — heat from radioactive decay after reactor shutdown. Depends on: burnup
17. **Defense-in-depth** — multiple independent safety barriers and systems
18. **Loss-of-coolant accident (LOCA)** — break in primary cooling system. Depends on: decay heat, natural circulation
19. **Emergency core cooling systems (ECCS)** — backup cooling to prevent fuel damage. Depends on: LOCA
20. **Probabilistic risk assessment (PRA)** — quantitative safety analysis using fault trees. Depends on: defense-in-depth
21. **Containment** — final barrier to prevent radioactive release. Depends on: defense-in-depth
22. **Fuel types** — UO2, MOX, TRISO, metallic fuels and their properties
23. **Radiation damage** — displacement of atoms and material degradation. Depends on: neutron flux
24. **Accident-tolerant fuel** — materials that maintain integrity under severe conditions. Depends on: fuel types, radiation damage
25. **Control rods** — neutron absorbers for reactivity control. Depends on: criticality, cross-sections
26. **In-core instrumentation** — sensors to monitor flux, temperature, flow. Depends on: power distribution
27. **Generation IV reactors** — advanced designs with passive safety. Depends on: reactivity coefficients, natural circulation
28. **Small modular reactors (SMRs)** — factory-built compact designs. Depends on: all core design concepts

## Dependencies

### Foundational Dependencies

- **Diffusion theory** requires understanding **neutron cross-sections** because cross-sections determine how far neutrons travel between interactions
- **Moderation** requires understanding **neutron cross-sections** because the scattering cross-section determines how effectively neutrons slow down
- **Neutron spectrum** builds on **moderation** because the degree of moderation determines the energy distribution

### Design Dependencies

- **Lattice design** requires **moderation** and **neutron spectrum** because the geometry must optimize the neutron balance for the chosen spectrum
- **Power distribution** requires **diffusion theory** and **lattice design** because the flux shape depends on both the physics model and the geometry
- **Peaking factors** require **power distribution** because they quantify local variations in the power field
- **Reactivity coefficients** require **criticality** and **neutron spectrum** because feedback depends on how spectrum and multiplication change with conditions

### Thermal-Hydraulic Dependencies

- **Heat flux** requires **power distribution** because the heat generation rate follows the fission rate
- **Two-phase flow** requires **heat flux** because boiling occurs when heat flux exceeds the threshold for bubble formation
- **Critical heat flux** requires **two-phase flow** because DNB is a transition between flow regimes
- **Natural circulation** requires understanding **two-phase flow** because density differences drive the flow

### Safety Dependencies

- **LOCA** requires understanding **decay heat** and **natural circulation** because accident progression depends on residual heat and passive cooling
- **ECCS** requires understanding **LOCA** because the emergency systems are designed to mitigate specific accident scenarios
- **PRA** requires understanding all accident scenarios because it quantifies the probability and consequences of each
- **Containment** is the final barrier in **defense-in-depth** and must withstand the conditions from worst-case accidents

### Materials Dependencies

- **Radiation damage** requires understanding **neutron flux** because damage rate is proportional to fluence
- **Accident-tolerant fuel** builds on **fuel types** and **radiation damage** because new materials must perform better under both normal and accident conditions

### Advanced Concepts

- **Generation IV reactors** leverage **reactivity coefficients** and **natural circulation** to achieve passive safety
- **SMRs** integrate concepts from all modules into compact, factory-fabricated designs

## Prerequisite Topics

- **Undergraduate physics** — needed for nuclear reactions, energy conservation, radiation interactions
- **Thermodynamics** — needed for heat transfer, phase change, thermal efficiency
- **Fluid mechanics** — needed for coolant flow, pressure drop, two-phase flow
- **Differential equations** — needed for diffusion equation, kinetics equations, heat conduction
- **Basic nuclear physics** — needed for fission, neutron interactions, radioactive decay

## Bottleneck Concepts

These concepts are critical gates — students must master them before progressing:

1. **Criticality** — the central concept that all reactivity control builds on
2. **Diffusion theory** — the mathematical foundation for core analysis
3. **Two-phase flow** — essential for understanding thermal limits and safety
4. **Defense-in-depth** — the organizing principle for all safety analysis

## Common Misconceptions (by concept)

- **Criticality**: Students think critical means "about to explode" when it means "self-sustaining at constant power"
- **Moderation**: Students assume all reactors need moderators, missing fast reactor designs
- **Burnup**: Students think fuel is "used up" when most uranium is still present
- **Power distribution**: Students expect uniform power when actual distributions are highly non-uniform
- **Two-phase flow**: Students apply single-phase correlations in boiling regimes
- **LOCA**: Students think loss of coolant immediately means meltdown, missing the role of decay heat timescales
- **Control rods**: Students think rods produce power when they only absorb neutrons

## Conceptual Pathways

### Fast track for students with strong math/physics background
Focus on: diffusion theory → power distribution → reactivity coefficients → PRA

### Visual/intuitive track for experimentalists
Focus on: lattice design → heat flux → two-phase flow → natural circulation → Gen IV designs

### Safety-first track
Focus on: defense-in-depth → LOCA → ECCS → PRA → containment → accident-tolerant fuel
