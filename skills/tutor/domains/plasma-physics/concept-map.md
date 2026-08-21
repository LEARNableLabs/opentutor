# Plasma Physics — Concept Map

## Core Concepts (in learning order)

1. **Plasma definition** — ionized gas with collective electromagnetic behavior
2. **Quasi-neutrality** — charge balance on scales larger than Debye length
3. **Debye shielding** — collective screening of electric fields. Depends on: plasma definition
4. **Debye length** — characteristic screening distance. Depends on: Debye shielding
5. **Plasma frequency** — natural oscillation frequency of electrons. Depends on: collective behavior
6. **Collisionality** — ratio of collision to plasma timescales. Depends on: plasma frequency
7. **Lorentz force** — force on charged particle in E and B fields
8. **Cyclotron motion** — circular orbit in uniform B field. Depends on: Lorentz force
9. **Gyroradius** — radius of cyclotron orbit. Depends on: cyclotron motion
10. **Guiding center** — average position of gyrating particle. Depends on: cyclotron motion
11. **E×B drift** — perpendicular drift in crossed fields. Depends on: guiding center
12. **Gradient drift** — drift due to inhomogeneous B field. Depends on: guiding center
13. **Magnetic mirror** — particle reflection in converging field. Depends on: cyclotron motion
14. **Adiabatic invariants** — conserved quantities under slow field changes. Depends on: magnetic mirror
15. **Velocity distribution function** — statistical description of particle velocities
16. **Phase space** — 6D space of position and velocity. Depends on: distribution function
17. **Vlasov equation** — collisionless kinetic equation. Depends on: phase space
18. **Fokker-Planck equation** — kinetic equation with collisions. Depends on: Vlasov equation
19. **Landau damping** — collisionless wave damping via resonant particles. Depends on: Vlasov equation
20. **Velocity moments** — fluid quantities from distribution function. Depends on: distribution function
21. **Closure problem** — need for additional equation to close moment hierarchy. Depends on: velocity moments
22. **Fluid approximation** — continuum description valid when mean free path is small. Depends on: velocity moments
23. **MHD** — single-fluid magnetohydrodynamics. Depends on: fluid approximation
24. **Frozen-in flux** — magnetic field lines move with plasma in ideal MHD. Depends on: MHD
25. **Two-fluid model** — separate electron and ion fluids. Depends on: fluid approximation
26. **Dispersion relation** — relationship between wave frequency and wavenumber
27. **Plasma waves** — collective oscillations and waves. Depends on: dispersion relation
28. **Alfvén waves** — transverse MHD waves. Depends on: MHD, plasma waves
29. **Plasma instabilities** — exponentially growing perturbations. Depends on: plasma waves
30. **Magnetic confinement** — use of B fields to contain plasma. Depends on: single particle motion, MHD

## Dependencies

### Fundamental Parameters
- **Debye length** requires understanding of collective behavior because it emerges from the balance between thermal energy and electrostatic potential energy
- **Plasma frequency** builds on quasi-neutrality because it describes the restoration force when charge balance is perturbed
- **Collisionality** depends on both plasma frequency and mean free path to determine the relative importance of collisions

### Single Particle Motion
- **E×B drift** requires understanding of guiding center approximation because we separate fast gyromotion from slow drift
- **Gradient drift** builds on E×B drift and gyroradius concepts because inhomogeneous fields cause different forces on different parts of the orbit
- **Adiabatic invariants** require magnetic mirror concepts because conservation laws emerge when fields change slowly compared to gyroperiod

### Kinetic to Fluid Transition
- **Velocity moments** require distribution function because fluid quantities are averages over velocity space
- **Closure problem** emerges from velocity moments because each moment equation introduces higher-order moments
- **Fluid approximation** is valid when collisionality is high enough to maintain local equilibrium distributions

### Fluid Models
- **MHD** builds on fluid approximation and electromagnetism because it treats plasma as a conducting fluid
- **Frozen-in flux** follows from ideal MHD Ohm's law and Faraday's law
- **Two-fluid model** extends single-fluid MHD by separating electron and ion dynamics

### Wave Phenomena
- **Landau damping** requires kinetic theory because fluid models cannot capture resonant wave-particle interactions
- **Alfvén waves** emerge from MHD equations as transverse magnetic tension waves
- **Plasma instabilities** build on wave theory and require understanding of free energy sources (gradients, beams, currents)

### Confinement
- **Magnetic confinement** synthesizes single particle drifts, MHD equilibrium, and stability concepts

## Bottlenecks

### Critical Transitions
1. **Statistical to collective** — transitioning from individual particles to collective plasma behavior (lessons 1-3)
2. **Guiding center approximation** — separating fast gyromotion from slow drifts (lessons 6-8)
3. **Kinetic to fluid** — moving from distribution functions to moment equations (lessons 12-18)
4. **Ideal MHD assumptions** — understanding when frozen-in flux holds (lessons 19-20)

### Conceptually Difficult Ideas
- **Landau damping** — collisionless dissipation is counterintuitive (lesson 15)
- **Adiabatic invariants** — conservation in slowly varying fields requires careful analysis (lesson 10)
- **Closure problem** — infinite hierarchy of moments must be truncated (lessons 16-18)
- **Instability mechanisms** — identifying free energy sources and growth mechanisms (lesson 25)

## Common Misconceptions

1. **"Plasmas are just hot gases"** — misses the collective electromagnetic behavior
2. **"Debye shielding makes plasmas completely neutral"** — shielding is exponential, not perfect
3. **"Particles always follow magnetic field lines"** — ignores drifts perpendicular to B
4. **"Collisionless means no interactions"** — long-range electromagnetic forces still present
5. **"MHD is always valid"** — breaks down when kinetic effects matter (Landau damping, two-fluid effects)
6. **"Frozen-in flux means B is constant"** — field strength can change, topology is conserved

## Prerequisite Topics

- **Electromagnetism** — needed for Lorentz force, Maxwell's equations, electromagnetic waves
- **Thermodynamics & Statistical Mechanics** — needed for distribution functions, temperature, entropy
- **Ordinary Differential Equations** — needed for particle trajectories
- **Partial Differential Equations** — needed for Vlasov equation, fluid equations, wave equations
- **Vector Calculus** — needed for field gradients, divergences, curls throughout
