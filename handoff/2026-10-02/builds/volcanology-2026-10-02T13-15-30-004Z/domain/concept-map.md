# Volcanology — Concept Map

## Core Concepts (in learning order)

1. **Solid mantle and the solidus**: the mantle is hot but almost entirely solid. Melting happens only where the temperature–depth curve (geotherm) crosses the melting curve (solidus).
2. **Plate-tectonic settings**: divergent boundaries, convergent (subduction) boundaries and intraplate hotspots. Depends on: 1
3. **Decompression melting**: rising mantle loses pressure faster than it loses heat and crosses the solidus. Depends on: 1, 2
4. **Flux melting**: water released from a subducting slab lowers the solidus of the mantle wedge. Depends on: 1, 2
5. **Hotspots and mantle plumes**: hot upwellings that melt by decompression and leave age-progressive island chains. Depends on: 2, 3
6. **Magma composition spectrum**: basalt, andesite, dacite and rhyolite, ordered by SiO2 content. Magma is melt plus crystals plus volatiles. Depends on: 3, 4
7. **Silicate polymerization and viscosity**: more silica means more linked SiO4 tetrahedra and a stiffer melt. Depends on: 6
8. **Viscosity controls**: temperature, dissolved water and crystal content. Basalt is roughly 10^1–10^3 Pa·s; rhyolite is roughly 10^8 Pa·s or more. Depends on: 7
9. **Volatile solubility and exsolution**: H2O and CO2 dissolve at high pressure and form bubbles as pressure drops. Depends on: 6
10. **Ascent, storage and differentiation**: buoyant rise, magma chambers and crystal mush, fractional crystallization and assimilation. Depends on: 6, 8, 9
11. **Fragmentation**: bubbly magma breaks into gas-driven fragments when bubbles cannot escape. Depends on: 8, 9
12. **Eruption style spectrum and VEI**: from Hawaiian to Plinian, with explosivity on a logarithmic size scale. Depends on: 11
13. **Lava flows**: pāhoehoe, ʻaʻā, block lava and lava tubes. Depends on: 8, 12
14. **Eruption columns and tephra**: jet, buoyant plume, umbrella cloud and fallout. Depends on: 11, 12
15. **Pyroclastic density currents (PDCs)**: column collapse, dome collapse and lateral blasts. Depends on: 14
16. **Volcano landforms**: shields, stratovolcanoes, cinder cones and domes. Depends on: 8, 12, 13
17. **Calderas**: collapse after a magma chamber empties rapidly, often with ignimbrites. Depends on: 10, 12, 15
18. **Deposits and stratigraphy**: telling fall, flow and lava deposits apart, and dating them with tephrochronology. Depends on: 13, 14, 15
19. **Volcano seismicity**: volcano-tectonic (VT) events, long-period (LP) events, tremor and swarms. Depends on: 10
20. **Ground deformation**: inflation and deflation measured by GPS, tilt and InSAR. Depends on: 10
21. **Gas geochemistry**: SO2 and CO2 fluxes, and the CO2/SO2 ratio. Depends on: 9, 10
22. **Probabilistic forecasting**: event trees, false alarms and failed eruptions. Depends on: 19, 20, 21
23. **Lahars**: volcanic mudflows triggered by eruptions, melting ice or rain. Depends on: 14, 16
24. **Hazard versus risk and hazard maps**: risk = hazard × exposure × vulnerability. Depends on: 13, 15, 23
25. **Risk communication**: alert levels, trust and evacuation decisions. Depends on: 22, 24
26. **Climate effects**: stratospheric sulfate aerosols cause short-term cooling. Depends on: 9, 14
27. **Planetary volcanism**: Io, Mars and cryovolcanism as tests of Earth-based rules. Depends on: 1–8

## The Master Chain

Most of the course hangs on one causal chain. The student should be able to recite it and apply it:

**setting → melting mechanism → composition (SiO2) → viscosity (plus temperature, water and crystals) → can gas escape? → fragmentation or not → eruption style and VEI → products (lava, tephra, PDC) → landform and deposits → hazards**

## Dependencies

- **Decompression and flux melting (3, 4) need the solidus (1).** Both mechanisms only make sense as ways of moving rock across a melting curve without adding heat.
- **Composition (6) depends on setting (2–5).** Ridges and hotspots mostly make basalt. Subduction zones make wetter, more evolved magmas, especially after differentiation (10).
- **Viscosity (7, 8) is the gatekeeper for everything in Module 3.** If a student cannot rank viscosities, fragmentation and eruption style become things to memorise rather than things to predict.
- **Fragmentation (11) needs both viscosity (8) and volatiles (9).** Gas supplies the driving force, and viscosity decides whether the gas escapes quietly or tears the magma apart.
- **PDCs (15) build on eruption columns (14).** The most important PDC mechanism is a column that becomes too dense to stay buoyant and collapses.
- **Landforms (16) and calderas (17) are eruption styles (12) added up over time.** A volcano's shape is the accumulated record of its typical behaviour.
- **All three monitoring methods (19–21) are ways of observing ascent and storage (10) indirectly.** Earthquakes show rock breaking and fluids moving, deformation shows volume change, and gas shows degassing depth.
- **Forecasting (22) needs all three monitoring methods,** because no single signal is diagnostic on its own.
- **Risk communication (25) combines forecasting uncertainty (22) with hazard geography (24).** The Pinatubo and Ruiz contrast depends on both.
- **Climate effects (26) depend on volatiles (9) and on eruption columns reaching the stratosphere (14).** Sulfur only has a lasting effect if it gets above the weather.

## Prerequisite Topics

- **Pressure, density and buoyancy**: needed for melting (3), magma ascent (10), eruption columns (14) and PDCs (15)
- **Gas solubility (high-school chemistry)**: needed for volatiles (9) and fragmentation (11)
- **Oxides and chemical formulas (SiO2, H2O, CO2, SO2)**: needed for composition (6) and gas geochemistry (21)
- **Powers of ten and log scales**: needed for viscosity (8), VEI (12) and forecasting probabilities (22)
- **Basic plate tectonics**: needed for settings (2); refreshed in Lesson 2
- **Optional Python**: needed only to explore the REDPy and MSNoise repositories in Lesson 22