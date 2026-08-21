# Neon Sign Fabrication — Concept Map

## Core Concepts (in learning order)

1. **Glass composition** — borosilicate vs. lead glass chemistry and properties
2. **Thermal expansion** — coefficient of thermal expansion (CTE) and material compatibility
3. **Glass transition temperature** — solid-to-liquid continuum, viscosity, working range
4. **Thermal stress** — strain from uneven heating/cooling
5. **Annealing** — controlled cooling to relieve internal stress. Depends on: thermal stress
6. **Torch types** — crossfire vs. ribbon burners, flame chemistry, heat distribution
7. **Bend radius** — minimum curve radius based on tube diameter and wall thickness
8. **Tube collapse** — maintaining tube diameter during bending. Depends on: bend radius, heating technique
9. **Pattern making** — translating designs into bendable glass paths. Depends on: bend radius
10. **Tubulation** — creating electrode connections and gas fill ports
11. **Bombarder processing** — electrode activation and tube cleaning under vacuum. Depends on: tubulation
12. **Atomic emission spectra** — characteristic wavelengths from electron transitions
13. **Energy levels** — quantized electron states in atoms
14. **Ionization energy** — energy required to remove an electron from an atom
15. **Collision processes** — electron-atom interactions, mean free path, energy transfer
16. **Electron avalanche** — cascading ionization in electric field. Depends on: collision processes
17. **Breakdown voltage** — voltage required to initiate discharge. Depends on: ionization energy, tube geometry
18. **Glow discharge** — sustained plasma state in noble gas
19. **Cathode fall** — voltage drop and dark space near negative electrode. Depends on: glow discharge
20. **Positive column** — luminous plasma region. Depends on: glow discharge
21. **Current-voltage characteristics** — relationship between discharge current and sustaining voltage
22. **Spectral lines** — discrete wavelengths emitted by specific gases. Depends on: atomic emission spectra
23. **Phosphor coatings** — fluorescent materials converting UV to visible light
24. **Mercury vapor** — UV generation for phosphor excitation. Depends on: phosphor coatings
25. **Color mixing** — perceived color from spectral line combinations
26. **Transformer design** — high-voltage step-up with current limiting via leakage inductance
27. **Electrode placement** — electrical design affecting discharge uniformity
28. **Weatherproofing** — protection from moisture, thermal cycling, UV degradation

## Dependencies

- **Annealing** requires understanding **thermal stress** because stress relief is the goal of the annealing process
- **Tube collapse** builds on **bend radius** and **torch technique** because proper heating and geometry prevent collapse
- **Pattern making** requires **bend radius** knowledge because designs must respect physical bending constraints
- **Bombarder processing** depends on **tubulation** because electrodes must be sealed before processing
- **Electron avalanche** requires **collision processes** because cascading ionization results from repeated electron-atom collisions
- **Breakdown voltage** depends on **ionization energy** and tube geometry because voltage must overcome ionization threshold across the gap
- **Cathode fall** and **positive column** are spatial regions within **glow discharge** with distinct physics
- **Mercury vapor + phosphor coatings** work together because mercury generates UV that excites phosphors to emit visible light
- **Transformer design** must account for **current-voltage characteristics** of the discharge to prevent runaway current

## Bottlenecks

**Glow discharge physics** (lessons 10-13) is the conceptual peak — students must integrate atomic physics, electricity, and collision theory. This determines success with the rest of the curriculum.

**Thermal stress and annealing** (lesson 3) is critical for practical work — misunderstanding leads to broken tubes.

**Bend radius constraints** (lesson 6) gates design work — students who don't internalize geometric limits produce unbuildable patterns.

## Common Misconceptions

**"Glass melts at a specific temperature"** — Glass transitions gradually; there's no sharp melting point. Addressed in lesson 2.

**"Neon signs are filled with neon"** — Many use argon, mercury, or other gases. Color determines gas choice. Addressed in lessons 10, 15-16.

**"Higher voltage makes brighter light"** — Beyond breakdown, current (not voltage) controls brightness, and excessive current damages electrodes. Addressed in lessons 12, 19.

**"Phosphor coatings can create any color"** — They're excited by UV, requiring mercury vapor addition; they don't work with pure noble gas discharges. Addressed in lesson 15.

**"Tight bends are just a skill issue"** — Physics limits minimum bend radius based on tube diameter; no amount of skill can violate the geometry. Addressed in lesson 6.

## Prerequisite Topics

- **Basic chemistry** — needed for understanding gas properties, ionization, atomic structure (lessons 1, 10-13)
- **Electricity and circuits** — needed for understanding voltage, current, transformers, electrical discharge (lessons 12-13, 19-20)
- **Atomic structure** — needed for energy levels, electron transitions, emission spectra (lessons 10-13)
