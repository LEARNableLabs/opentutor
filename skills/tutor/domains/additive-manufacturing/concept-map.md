# Additive Manufacturing — Concept Map

## Core Concepts (in learning order)

1. **Layer-by-layer fabrication** — build parts by adding material in successive layers rather than removing it
2. **Additive vs subtractive manufacturing** — fundamental paradigm shift in design freedom and waste
3. **Process taxonomy** — seven AM process families (material extrusion, vat photopolymerization, powder bed fusion, binder jetting, material jetting, directed energy deposition, sheet lamination)
4. **Phase transitions in AM** — material transformations from feedstock to solid (melting, solidification, polymerization)
5. **Thermal cycles** — repeated heating and cooling during layer-by-layer build
6. **Heat transfer in AM** — conduction, convection, radiation dominate process physics
7. **Melt pool dynamics** — formation and solidification of molten material in laser/electron beam processes
8. **Material extrusion (FDM/FFF)** — thermoplastic filament heated and deposited through nozzle
9. **Extrusion parameters** — temperature, speed, layer height control bonding
10. **Interlayer bonding** — diffusion and entanglement at layer interfaces determines strength
11. **Vat photopolymerization (SLA/DLP)** — UV light cures liquid photopolymer resin layer by layer
12. **Photopolymerization kinetics** — light intensity and exposure time drive crosslinking
13. **Anisotropy in AM** — directional dependence of mechanical properties due to layer-by-layer build
14. **Powder bed fusion** — laser or electron beam selectively melts powder particles
15. **Laser-material interaction** — energy absorption, reflectivity, penetration depth
16. **Process parameters** — laser power, scan speed, hatch spacing, layer thickness
17. **Melt pool geometry** — shape and size determine fusion quality
18. **Rapid solidification** — fast cooling creates non-equilibrium microstructures
19. **Grain morphology** — columnar grains grow epitaxially along build direction
20. **Porosity in metal AM** — keyhole porosity, lack of fusion, gas entrapment
21. **Binder jetting** — liquid binder selectively deposited on powder, then sintered
22. **Design for additive manufacturing (DfAM)** — leveraging AM capabilities (complexity, customization, consolidation)
23. **Topology optimization** — algorithmic design to remove material where not needed for loads
24. **Lattice structures** — periodic cellular structures with high strength-to-weight ratio
25. **Unit cells** — repeating geometric elements in lattices
26. **Support structures** — sacrificial material to prevent collapse of overhangs
27. **Part orientation** — build angle affects surface finish, supports, anisotropy
28. **In-situ monitoring** — real-time sensing during build (thermal, acoustic, optical)
29. **Post-processing** — heat treatment, HIP, machining, finishing
30. **Part consolidation** — combining multiple components into single AM part
31. **Application-specific requirements** — aerospace (strength, weight), medical (biocompatibility, customization), tooling (thermal management)

## Dependencies

### Fundamental Physics
- **Thermal cycles** require understanding **heat transfer in AM** because each layer reheats previous layers
- **Melt pool dynamics** depend on **heat transfer in AM** and **laser-material interaction** because energy input drives melting
- **Rapid solidification** is caused by **thermal cycles** because extreme cooling rates occur when laser moves away
- **Grain morphology** results from **rapid solidification** because growth direction follows thermal gradient

### Process-Specific
- **Interlayer bonding** in FDM depends on **thermal cycles** because polymer chains must diffuse across interface
- **Anisotropy** emerges from **interlayer bonding** and **grain morphology** because properties differ along vs across layers
- **Porosity in metal AM** results from incorrect **process parameters** because insufficient energy causes lack of fusion, excessive energy causes keyholing
- **Melt pool geometry** is controlled by **process parameters** because power/speed ratio determines pool shape

### Design & Quality
- **Topology optimization** exploits **design for AM** because complexity is free in additive
- **Lattice structures** require **DfAM** knowledge because minimum feature size and orientation matter
- **Support structures** are needed based on **part orientation** because overhangs cannot print in air
- **Part consolidation** leverages **topology optimization** and **DfAM** because complex internal features become feasible
- **In-situ monitoring** detects **porosity** and fusion defects during build
- **Post-processing** addresses **anisotropy**, **porosity**, and residual stress from **thermal cycles**

## Prerequisite Topics

- **Materials science fundamentals** — needed for phase transitions, microstructure, mechanical properties
- **Thermodynamics** — needed for heat transfer, phase diagrams, solidification
- **Manufacturing processes** — context for additive vs subtractive paradigm

## Conceptual Bottlenecks

These concepts are critical inflection points where students often struggle:

1. **Thermal cycles creating anisotropy** — understanding that repeated heating isn't just inconvenient, it fundamentally changes material structure layer-by-layer
2. **Process parameter interdependence** — laser power, speed, hatch spacing aren't independent knobs; they create a coupled energy density that determines outcomes
3. **Design freedom vs design constraints** — AM removes some constraints (undercuts) but adds others (supports, minimum feature size, residual stress)
4. **Solidification microstructure** — connecting cooling rate to grain size/morphology to mechanical properties

## Common Misconceptions

- **"3D printing can make anything"** — ignoring material compatibility, size limits, residual stress, support requirements
- **"Higher laser power is always better"** — excessive energy causes keyholing, porosity, distortion
- **"AM parts are isotropic"** — layer-by-layer build creates inherent anisotropy
- **"No post-processing needed"** — most metal AM parts require heat treatment, support removal, finishing
- **"Topology optimization = organic shapes"** — it's about load-optimized material distribution, not aesthetics
