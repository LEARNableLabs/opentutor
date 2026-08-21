# MEMS and Microsystems — Concept Map

## Core Concepts (in learning order)

1. **Scaling laws** — how physical forces and properties change with size
2. **Surface-to-volume ratio** — why surface forces dominate at microscale
3. **Dimensional analysis** — systematic approach to understanding scaling behavior
4. **Stiffness scaling** — how mechanical spring constants change with size
5. **Reynolds number** — characterizing fluid flow regime (viscous vs inertial)
6. **Viscous damping** — dominant energy dissipation mechanism at microscale
7. **Thermal time constant** — how quickly microsystems heat and cool
8. **Photolithography** — pattern transfer using light and photoresist. Depends on: basic optics
9. **Isotropic vs anisotropic etching** — directional vs non-directional material removal
10. **Selectivity** — preferential etching of one material over another. Depends on: etching mechanisms
11. **Bulk micromachining** — sculpting 3D structures from substrate. Depends on: anisotropic etching
12. **Surface micromachining** — building structures layer-by-layer. Depends on: photolithography, etching
13. **Sacrificial layers** — temporary layers removed to create suspended structures. Depends on: selectivity
14. **Release etching** — final etch step to free suspended structures. Depends on: sacrificial layers
15. **Stiction** — unwanted adhesion of released structures. Depends on: surface forces, release etching
16. **Piezoresistivity** — resistance change due to mechanical stress. Depends on: stress-strain relationship
17. **Wheatstone bridge** — circuit for measuring small resistance changes. Depends on: piezoresistivity
18. **Capacitive sensing** — measuring displacement via capacitance change. Depends on: capacitor physics
19. **Gap-closing vs area-change** — two modes of capacitive sensing. Depends on: capacitive sensing
20. **Parasitic capacitance** — unwanted capacitance that reduces sensitivity. Depends on: capacitive sensing
21. **Proof mass** — movable mass in inertial sensor. Depends on: Newton's second law
22. **Spring-mass-damper** — fundamental model for MEMS dynamics. Depends on: proof mass, stiffness, damping
23. **Differential capacitance** — measuring opposite capacitance changes for noise rejection. Depends on: capacitive sensing
24. **Piezoelectricity** — direct conversion between mechanical and electrical energy. Depends on: materials science
25. **Charge generation** — creating electrical charge from strain. Depends on: piezoelectricity
26. **Resonant sensing** — detecting changes via resonant frequency shift. Depends on: spring-mass-damper
27. **Q factor** — quality factor measuring energy loss in resonator. Depends on: resonant sensing, damping
28. **Electrostatic actuation** — using electric field to create force. Depends on: capacitor physics, electrostatics
29. **Pull-in instability** — nonlinear collapse in parallel plate actuators. Depends on: electrostatic actuation
30. **Comb drive actuator** — linear electrostatic actuator. Depends on: electrostatic actuation, avoids pull-in
31. **Thermal expansion** — material elongation with temperature. Depends on: thermal physics
32. **Bimorph actuators** — bending from differential thermal expansion. Depends on: thermal expansion, two materials
33. **Torsional hinges** — rotational flexures for micromirrors. Depends on: mechanical design
34. **Bistability** — two stable positions in actuator. Depends on: nonlinear mechanics
35. **Coriolis effect** — apparent force in rotating reference frame. Depends on: rotational mechanics
36. **Vibratory gyroscope** — detecting rotation via Coriolis force. Depends on: Coriolis effect, resonance
37. **Drive and sense modes** — excitation and detection in gyroscope. Depends on: vibratory gyroscope
38. **Quadrature error** — spurious signal from mechanical coupling. Depends on: vibratory gyroscope
39. **Sensor fusion** — combining multiple sensors for better estimates. Depends on: multiple sensor types
40. **IMU integration** — 6-axis inertial measurement combining accelerometer and gyroscope. Depends on: sensor fusion
41. **Laminar flow** — smooth fluid flow at low Reynolds number. Depends on: Reynolds number
42. **Diffusion-based mixing** — molecular mixing in microfluidics. Depends on: laminar flow
43. **Lab-on-chip** — miniaturized chemical/biological analysis. Depends on: microfluidics
44. **Hermetic sealing** — airtight packaging for device protection. Depends on: packaging fundamentals
45. **Vacuum packaging** — maintaining low pressure for resonators. Depends on: hermetic sealing
46. **Fatigue** — failure from cyclic loading. Depends on: materials science
47. **Qualification testing** — standardized reliability testing. Depends on: failure mechanisms

## Dependencies

### Foundational Dependencies
- **Scaling laws** are the foundation for understanding why MEMS behave differently from macro devices
- **Surface-to-volume ratio** explains why scaling laws produce the specific behaviors observed (surface forces dominate)
- **Dimensional analysis** provides systematic tools for predicting scaling behavior across all physical domains

### Fabrication Chain
- **Photolithography** enables all patterned fabrication steps
- **Anisotropic etching** (especially KOH etching of silicon) depends on understanding crystal planes and selectivity
- **Surface micromachining** requires mastery of the lithography-deposition-etching cycle plus understanding of sacrificial layers
- **Stiction** only becomes relevant after learning release etching, because it's a failure mode during release

### Sensing Chain
- **Piezoresistive sensing** builds on stress-strain relationships and requires Wheatstone bridge circuits for readout
- **Capacitive sensing** depends on electrostatics fundamentals and splits into gap-closing (nonlinear, large signal) vs area-change (linear, smaller signal)
- **Differential capacitance** solves the parasitic capacitance problem by using matched pairs
- **Resonant sensing** requires understanding of spring-mass-damper dynamics and Q factor for performance prediction

### Actuation Chain
- **Electrostatic actuation** is the most common MEMS actuation mechanism but suffers from pull-in instability in parallel plate configuration
- **Comb drives** solve the pull-in problem by using lateral motion with linear force-displacement
- **Thermal actuation** offers high force but poor power efficiency; bimorphs provide amplified displacement

### Device Integration
- **MEMS accelerometers** integrate proof mass + springs + damping + capacitive sensing
- **MEMS gyroscopes** are more complex, requiring Coriolis effect + vibratory drive mode + sensing mode + quadrature suppression
- **IMUs** combine accelerometer and gyroscope data via sensor fusion algorithms

### Reliability and Packaging
- **Stiction** is the most common failure mode during fabrication
- **Hermetic packaging** is essential for moisture-sensitive devices and vacuum resonators
- **Fatigue** can occur in flexures and requires special attention for high-cycle devices

## Prerequisite Topics

- **Classical mechanics** — needed for understanding spring-mass-damper systems, resonance, Coriolis effect
- **Electromagnetism** — needed for capacitive sensing, electrostatic actuation, piezoresistivity
- **Circuits** — needed for Wheatstone bridges, readout electronics, signal conditioning
- **Materials science** — needed for understanding mechanical properties, thermal expansion, piezoelectricity
- **Fluid mechanics** — needed for Reynolds number, viscous damping, microfluidics
- **Thermodynamics** — needed for thermal actuation, heat transfer, thermal time constants
- **Calculus and differential equations** — needed for analyzing dynamics, transfer functions
- **Optics** (basic) — needed for understanding photolithography resolution limits

## Common Bottleneck Concepts

### Pull-in Instability
Students often struggle with the nonlinear nature of electrostatic actuation. The parallel plate actuator has stable equilibrium only up to 1/3 of the gap, then experiences runaway collapse. This is counterintuitive because it seems like you could just reduce the voltage, but the instability is fundamental to the energy landscape.

### Coriolis Effect
The Coriolis force is difficult to visualize because it only appears in a rotating reference frame. Students need to understand that a vibratory gyroscope is not itself rotating, but detecting external rotation by measuring the Coriolis force on a vibrating proof mass.

### Scaling Laws
Students often apply intuition from macroscale incorrectly. For example, they might think smaller springs are weaker, but per unit volume, they're actually stiffer. The key is always returning to dimensional analysis and surface-to-volume ratio.

### Stiction
The release etch seems like the final step, so students are surprised when structures stick to the substrate. Understanding that capillary forces during drying can be enormous (relative to restoring forces) requires thinking about surface tension at the microscale.

### Differential vs. Single-Ended Sensing
Students may not appreciate why differential sensing is worth the complexity. The key insight is that common-mode noise (from parasitic capacitance, temperature, supply voltage) cancels out, while the signal doubles.

## Concept Clusters for Review

### Cluster 1: Scaling and Physics
Lessons 1-4 cover why tiny things behave differently. Review should emphasize dimensional analysis as the unifying framework.

### Cluster 2: Fabrication Process Flow
Lessons 5-9 cover lithography → deposition → etching → release. Review should trace a complete process flow for a surface-micromachined accelerometer.

### Cluster 3: Sensing Mechanisms
Lessons 10-15 cover five transduction mechanisms. Review should compare sensitivity, linearity, power consumption, and application fit.

### Cluster 4: Actuation Mechanisms
Lessons 16-19 cover electrostatic, thermal, and piezoelectric actuation. Review should compare force, displacement, speed, and power.

### Cluster 5: Complete Devices
Lessons 20-23 integrate sensing/actuation into complete systems. Review should trace signal path from physical input to electrical output.

### Cluster 6: Practical Constraints
Lessons 24-25 cover packaging and reliability. Review should identify failure modes and mitigation strategies.
