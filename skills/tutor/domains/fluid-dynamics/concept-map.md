# Fluid Dynamics — Concept Map

## Core Concepts (in learning order)

1. **Continuum hypothesis** — treating discrete molecules as a continuous medium at macroscopic scales
2. **Lagrangian vs Eulerian descriptions** — following particles versus watching fixed points in space
3. **Streamlines, pathlines, streaklines** — different ways to visualize flow. Depends on: Eulerian/Lagrangian
4. **Material derivative** — tracking changes following fluid particles. Depends on: Lagrangian/Eulerian
5. **Conservation of mass (continuity equation)** — mass balance for fluid elements. Depends on: material derivative
6. **Stress tensor** — describing forces within fluids (pressure + viscous stress)
7. **Conservation of momentum (Navier-Stokes)** — Newton's second law for fluids. Depends on: continuity, stress tensor, material derivative
8. **Bernoulli's equation** — energy conservation for inviscid flow. Depends on: Navier-Stokes, conservation of energy
9. **Vorticity and circulation** — measuring rotation in flows. Depends on: velocity field, Eulerian description
10. **Euler equations** — inviscid limit of Navier-Stokes. Depends on: Navier-Stokes
11. **Irrotational flow** — flows with zero vorticity. Depends on: vorticity
12. **Velocity potential** — scalar function for irrotational flows. Depends on: irrotational flow
13. **Potential flow theory** — solving Laplace's equation for flows. Depends on: velocity potential, Euler equations
14. **Elementary flows** — building blocks (source, sink, vortex, doublet). Depends on: potential flow
15. **Superposition** — combining elementary flows to create complex flows. Depends on: elementary flows, linearity of Laplace
16. **d'Alembert's paradox** — zero drag prediction for inviscid flow. Depends on: potential flow, Euler equations
17. **Reynolds number** — ratio of inertial to viscous forces. Depends on: Navier-Stokes
18. **Laminar vs turbulent flow** — flow regime classification. Depends on: Reynolds number
19. **Boundary layer** — thin region near surfaces where viscosity dominates. Depends on: Reynolds number, no-slip condition
20. **No-slip condition** — fluid velocity equals surface velocity at boundaries
21. **Prandtl's boundary layer equations** — simplified Navier-Stokes for thin layers. Depends on: boundary layer, Navier-Stokes
22. **Flow separation** — boundary layer detachment from surface. Depends on: boundary layer, pressure gradient
23. **Skin friction drag** — tangential viscous forces. Depends on: boundary layer
24. **Pressure drag** — normal forces due to pressure distribution. Depends on: flow separation
25. **Dimensional analysis** — reducing problem complexity via dimensionless groups. Depends on: governing equations
26. **Buckingham Pi theorem** — systematic method for dimensional analysis. Depends on: dimensional analysis
27. **Dynamic similarity** — matching dimensionless parameters for scaling. Depends on: Buckingham Pi, Reynolds number
28. **Compressibility** — density changes in flow. Depends on: continuity, thermodynamics
29. **Mach number** — ratio of flow speed to sound speed. Depends on: compressibility
30. **Turbulence** — chaotic, multi-scale flow behavior. Depends on: Reynolds number, instability
31. **Reynolds decomposition** — separating mean and fluctuating components. Depends on: turbulence
32. **RANS equations** — time-averaged Navier-Stokes. Depends on: Reynolds decomposition

## Dependencies

### Foundational Chain
- **Material derivative** requires understanding both Lagrangian and Eulerian descriptions because it connects the two: following a particle (Lagrangian) while using field variables (Eulerian)
- **Continuity equation** builds on the material derivative because mass conservation must account for both local changes and convective transport
- **Navier-Stokes equations** require continuity (mass conservation couples with momentum) and the stress tensor to describe forces

### Inviscid Flow Branch
- **Euler equations** simplify Navier-Stokes by removing viscous stress, but still require understanding the full momentum equation
- **Potential flow** requires both Euler equations (inviscid assumption) and irrotational flow (zero vorticity)
- **Elementary flows** are special solutions to Laplace's equation (from potential flow theory)
- **d'Alembert's paradox** emerges from potential flow predictions, highlighting where inviscid theory fails

### Viscous Flow Branch
- **Reynolds number** emerges from non-dimensionalizing Navier-Stokes, showing the balance between inertia and viscosity
- **Boundary layer theory** exists because at high Reynolds number, viscous effects concentrate near walls (Prandtl's insight)
- **Flow separation** happens when adverse pressure gradients interact with boundary layers
- **Drag** has two components: skin friction (directly from viscosity in boundary layer) and pressure drag (from separation and wake)

### Advanced Topics
- **Dimensional analysis** builds on complete understanding of governing equations to identify relevant dimensionless groups
- **Dynamic similarity** requires matching all relevant dimensionless numbers (Reynolds, Mach, Froude, etc.) between model and prototype
- **Turbulence modeling** requires Reynolds decomposition, which creates closure problems in the RANS equations

## Prerequisite Topics

- **Multivariable calculus** — needed for: gradient, divergence, curl, partial derivatives (all field-based concepts)
- **Vector calculus** — needed for: material derivative, continuity, Navier-Stokes, vorticity
- **Ordinary differential equations** — needed for: pathline calculations, boundary layer solutions
- **Linear algebra** — needed for: stress tensor, coordinate transformations
- **Basic thermodynamics** — needed for: compressible flow, energy equation, equation of state
- **Physics (Newton's laws)** — needed for: momentum conservation, force balance

## Bottleneck Concepts

1. **Material derivative** — students who don't internalize this struggle with all conservation laws. It's the bridge between particle and field descriptions.

2. **Navier-Stokes equations** — the central equation. Understanding its terms (convection, pressure gradient, viscous diffusion) is essential for all subsequent topics.

3. **Reynolds number** — controls flow regime and dictates which terms in Navier-Stokes dominate. Misunderstanding it leads to wrong physical intuition about when viscosity matters.

4. **Boundary layer concept** — Prandtl's insight that viscosity matters most near walls revolutionized fluid dynamics. This unlocks understanding of drag, separation, and turbulence onset.

## Common Conceptual Barriers

1. **Eulerian vs Lagrangian confusion** — students mix up "change at a point" versus "change following a particle"
2. **Vorticity isn't velocity** — rotating flow doesn't mean high vorticity (solid body rotation has constant vorticity, irrotational vortex has zero except at center)
3. **d'Alembert's paradox** — potential flow predicts zero drag, but real flows have drag. Resolution requires understanding boundary layers.
4. **Reynolds number intuition** — small Re means viscous forces dominate (honey), large Re means inertial forces dominate (air around planes)
5. **Turbulence** — it's not just "random flow," it's deterministic chaos with structure across scales
