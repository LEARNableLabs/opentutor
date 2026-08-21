# Special and General Relativity — Concept Map

## Core Concepts (in learning order)

1. **Galilean relativity** — physics looks the same in all inertial frames (classical version)
2. **Constancy of light speed** — light travels at c in all inertial frames, contradicting Galilean relativity
3. **Postulates of special relativity** — light speed constant + equivalence of inertial frames
4. **Spacetime events** — points in 4D spacetime characterized by (t, x, y, z)
5. **Worldlines** — paths through spacetime traced by objects or light
6. **Light cones** — regions of spacetime that can causally influence or be influenced by an event
7. **Time dilation** — moving clocks tick slower relative to stationary observers. Depends on: 2, 3, 4
8. **Length contraction** — moving objects appear contracted along direction of motion. Depends on: 2, 3, 7
9. **Relativity of simultaneity** — events simultaneous in one frame may not be in another. Depends on: 2, 3, 7
10. **Proper time** — time measured by a clock moving with an object (invariant). Depends on: 4, 7
11. **Lorentz transformations** — coordinate transformations between inertial frames. Depends on: 3, 7, 8, 9
12. **Spacetime diagrams** — visual representation of worldlines and reference frames. Depends on: 4, 5, 6, 11
13. **Minkowski metric** — geometric structure of flat spacetime (ημν). Depends on: 4, 10
14. **Spacetime interval** — invariant distance in spacetime. Depends on: 13
15. **4-vectors** — objects with timelike and spacelike components that transform via Lorentz. Depends on: 11, 13, 14
16. **4-velocity** — derivative of position 4-vector with respect to proper time. Depends on: 10, 15
17. **4-momentum** — energy-momentum packaged as a 4-vector (E/c, p). Depends on: 15, 16
18. **Mass-energy equivalence** — E = mc² emerges from 4-momentum invariance. Depends on: 17
19. **Equivalence principle** — freely falling frames are locally inertial; gravity and acceleration indistinguishable
20. **Gravitational redshift** — light gains/loses energy climbing out of/falling into gravitational wells. Depends on: 19
21. **Curved spacetime** — gravity is geometry; mass tells spacetime how to curve. Depends on: 19
22. **Geodesics** — paths of extremal proper time; freely falling objects follow geodesics. Depends on: 10, 21
23. **Parallel transport** — moving vectors along curves while keeping them "parallel". Depends on: 21, 22
24. **Riemann curvature tensor** — measures how much parallel transport depends on path (intrinsic curvature). Depends on: 21, 23
25. **Ricci tensor** — contraction of Riemann tensor; appears in Einstein equations. Depends on: 24
26. **Stress-energy tensor** — describes distribution of mass, energy, and momentum. Depends on: 17
27. **Einstein field equations** — Gμν = 8πTμν relates spacetime curvature to matter/energy. Depends on: 25, 26
28. **Schwarzschild solution** — spherically symmetric vacuum solution; describes non-rotating black holes. Depends on: 27
29. **Event horizon** — boundary of black hole region from which light cannot escape. Depends on: 28
30. **Gravitational waves** — ripples in spacetime curvature propagating at speed of light. Depends on: 21, 27
31. **FRW metric** — homogeneous, isotropic cosmological solution describing expanding universe. Depends on: 27

## Dependencies

### Special Relativity Foundation
- **Time dilation** requires accepting the constancy of light speed — the moving light clock thought experiment derives it directly from the postulates
- **Length contraction** and **time dilation** are two sides of the same coin — both arise from Lorentz transformations
- **Relativity of simultaneity** is the conceptual key — once you accept that simultaneity is frame-dependent, time dilation and length contraction follow
- **Lorentz transformations** unify all kinematic effects and replace Galilean transformations

### Spacetime Geometry (SR)
- **Spacetime interval** is the analog of Euclidean distance but with signature (-,+,+,+) or (+,-,-,-)
- **4-vectors** provide the mathematical framework for doing physics covariantly (same form in all frames)
- **4-momentum** encodes both energy and momentum; its invariant magnitude is rest mass
- **Mass-energy equivalence** emerges as a consequence of 4-momentum structure

### Transition to General Relativity
- **Equivalence principle** is the conceptual bridge — it suggests gravity can be "transformed away" locally, implying geometric interpretation
- **Gravitational redshift** is the first GR prediction accessible from equivalence principle alone
- **Curved spacetime** replaces the "force" of gravity with geometric structure

### General Relativity Machinery
- **Geodesics** generalize straight lines to curved spacetime — they're the paths that extremize proper time
- **Riemann curvature tensor** is the only coordinate-independent measure of intrinsic curvature
- **Ricci tensor** and **Ricci scalar** are contractions that appear in Einstein's equations due to energy-momentum conservation
- **Einstein field equations** relate geometry (left side) to matter/energy (right side) — "matter tells spacetime how to curve; curved spacetime tells matter how to move"

### Applications
- **Schwarzschild solution** is the simplest nontrivial exact solution — spherical symmetry reduces the PDEs to ODEs
- **Event horizon** at r = 2GM/c² is a coordinate singularity (observers can pass through) vs. the singularity at r = 0
- **Gravitational waves** are weak-field perturbations of flat spacetime — linearized Einstein equations become wave equations
- **FRW metric** assumes cosmological principle (homogeneity + isotropy) — symmetries drastically simplify Einstein equations

## Prerequisite Topics

- **Multivariable calculus** — needed for: 4-vectors, metrics, tensor calculations, geodesic equations
- **Linear algebra** — needed for: Lorentz transformations, metric tensors, raising/lowering indices
- **Classical mechanics** — needed for: understanding inertial frames, momentum, energy, action principles
- **Electromagnetism basics** — needed for: motivation (Maxwell equations triggered crisis), stress-energy tensor

## Bottleneck Concepts

### Special Relativity
- **Relativity of simultaneity** — students often accept time dilation but struggle with simultaneity being frame-dependent. This is the conceptual linchpin; once grasped, the rest follows.
- **Proper time vs. coordinate time** — confusing which clock measures what is a common source of errors
- **4-vector notation** — transitioning from component-wise calculations to covariant tensor notation requires practice

### General Relativity
- **Curved spacetime vs. curved space** — students often visualize curved 2D surfaces embedded in 3D, but spacetime curvature is intrinsic
- **Geodesics as "straight" paths** — reconciling that curved paths are actually geodesics (locally straight) takes geometric intuition
- **Tensor index gymnastics** — keeping track of covariant/contravariant indices, raising/lowering with metric
- **Local vs. global properties** — equivalence principle is local; curvature is about what persists globally

## Common Misconceptions

1. **"Time dilation is caused by motion"** — actually caused by relative velocity between frames; there's no absolute "moving" observer
2. **"Mass increases with velocity"** — rest mass is invariant; relativistic mass is outdated terminology, use 4-momentum
3. **"Simultaneity is absolute"** — deeply ingrained from everyday experience, but fundamentally wrong
4. **"You can't go faster than light because mass becomes infinite"** — better explanation: 4-momentum structure forbids timelike objects reaching null trajectories
5. **"Gravity is a force in GR"** — gravity is curvature; only appears as a force in non-inertial coordinates
6. **"Spacetime curvature is just a mathematical trick"** — it's physical; tidal forces reveal curvature even in freely falling frames
7. **"Event horizon is a physical barrier"** — it's a coordinate singularity; free-falling observers pass through smoothly (but can never return)
8. **"Black holes suck everything in"** — only within event horizon; outside, orbital mechanics same as any mass

## Learning Checkpoints

Students should be able to:

- After Module 2: Draw spacetime diagrams, calculate time dilation and length contraction for simple scenarios
- After Module 3: Work with 4-vectors, compute invariant intervals, derive E=mc²
- After Module 4: Explain equivalence principle, understand geodesics conceptually, recognize curvature signature (tidal forces)
- After Module 5: Interpret Einstein equations (not necessarily solve), understand stress-energy sources
- After Module 6: Apply Schwarzschild metric to compute orbits, explain LIGO detection, connect to cosmology
