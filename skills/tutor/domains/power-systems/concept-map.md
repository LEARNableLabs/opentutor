# Power Systems — Concept Map

## Core Concepts (in learning order)

1. **Grid structure** — transmission, distribution, generation layers; voltage levels; synchronous interconnections
2. **Three-phase systems** — balanced loads, Y and delta connections, why three phases
3. **Single-line diagrams** — schematic representation of multi-phase systems
4. **Per-unit systems** — normalization for consistent multi-voltage analysis. Depends on: grid structure
5. **Complex power** — real power (P), reactive power (Q), apparent power (S), power triangle. Depends on: three-phase systems
6. **Power factor** — ratio of real to apparent power, leading/lagging. Depends on: complex power
7. **Phasor representation** — complex number representation of sinusoidal AC quantities. Depends on: complex power
8. **Power flow equations** — nodal power balance, bus types (slack, PV, PQ). Depends on: phasor representation, per-unit systems
9. **Transmission line models** — short, medium, long line models; ABCD parameters; distributed parameters. Depends on: phasor representation
10. **Voltage regulation** — maintaining voltage within limits; tap changers; compensation. Depends on: transmission line models, reactive power
11. **Transformers** — voltage transformation, impedance transformation, three-phase configurations. Depends on: per-unit systems
12. **Synchronous generators** — AC generation, field excitation, frequency tied to rotational speed. Depends on: three-phase systems
13. **Frequency control** — governor response, AGC, generation-load balance. Depends on: synchronous generators
14. **Economic dispatch** — optimal allocation of generation based on marginal cost. Depends on: generation capacity
15. **Fault analysis** — short circuits, symmetrical components, fault types (3-phase, line-to-ground, etc.). Depends on: power flow equations
16. **Circuit breakers and relays** — fault detection and interruption, protection zones. Depends on: fault analysis
17. **Transient stability** — swing equation, rotor angle dynamics, critical clearing time. Depends on: synchronous generators, fault analysis
18. **Renewable integration** — solar, wind, inverter-based resources, variability challenges. Depends on: frequency control, economic dispatch
19. **Energy storage** — batteries, pumped hydro, grid-scale applications. Depends on: renewable integration
20. **Smart grid** — AMI, SCADA, PMUs, demand response, distributed control. Depends on: grid structure
21. **Microgrids** — islanded operation, DER coordination, grid edge. Depends on: smart grid, renewable integration

## Dependencies

- **Complex power** requires understanding **three-phase systems** because power calculations differ between single-phase and three-phase
- **Per-unit systems** build on **grid structure** knowledge because normalization requires understanding voltage levels and base quantities
- **Power flow equations** require **phasor representation** and **per-unit systems** because nodal analysis uses complex impedances in normalized form
- **Voltage regulation** depends on **transmission line models** and **reactive power** because voltage drop is a function of line impedance and Q flow
- **Transformers** are analyzed using **per-unit systems** to handle multiple voltage levels consistently
- **Frequency control** depends on **synchronous generators** because grid frequency equals generator rotational speed (in p.u.)
- **Economic dispatch** builds on understanding generation types because marginal costs vary by technology (coal, gas, hydro, nuclear, renewables)
- **Fault analysis** requires **power flow equations** as the starting point for pre-fault conditions
- **Transient stability** combines **synchronous generators** and **fault analysis** because disturbances (faults) cause rotor angle swings
- **Renewable integration** requires **frequency control** and **economic dispatch** because variable generation affects both frequency regulation and dispatch optimization
- **Microgrids** synthesize **smart grid** and **renewable integration** concepts for localized, autonomous operation

## Bottlenecks

### Phasor and Complex Power
Students who struggle with complex numbers and phasor arithmetic will find the entire middle section (lessons 7-10) difficult. Review complex arithmetic and Euler's formula before proceeding.

### Per-Unit Systems
Initial confusion with per-unit normalization can slow progress. Once mastered, it simplifies multi-voltage analysis. Reinforce with multiple examples.

### Fault Analysis and Symmetrical Components
Symmetrical components (positive, negative, zero sequence) are abstract and non-intuitive. This is the steepest learning curve in the curriculum. Budget extra time for lesson 22.

## Prerequisite Topics

- **AC circuits** — needed for phasors, impedance, power calculations (lessons 1-10)
- **Complex numbers** — needed for phasor representation and complex power (lessons 7-10)
- **Basic calculus** — derivatives for transmission line models, optimization for economic dispatch (lessons 11, 19)
- **Linear algebra** — matrix methods for power flow (lesson 10) and fault analysis (lesson 22)

## Common Learning Paths

### Path 1: Fundamentals → Steady-State Analysis
Lessons 1-16 cover structure, power flow, and transmission. Good for students interested in grid planning and operations.

### Path 2: Fundamentals → Generation and Dispatch
Lessons 1-10, then 17-21. Focus on generation technologies and market operations. Skip detailed transmission analysis.

### Path 3: Full System
All 27 lessons in order. Recommended for students targeting power systems engineering roles or graduate study.

### Path 4: Modern Grid Focus
Lessons 1-6 (fundamentals), 17-18 (generation basics), 20, 26-27 (renewables and smart grid). For students interested in energy transition and grid modernization.

## Cross-Connections

- **Complex power and RF engineering** — S-parameters in RF are analogous to ABCD parameters
- **Control theory** — AGC and excitation systems are classic feedback control problems
- **Optimization** — economic dispatch, unit commitment, optimal power flow
- **Data science** — load forecasting, renewable prediction, grid monitoring with PMUs
- **Economics** — electricity markets, locational marginal pricing, capacity markets
- **Climate science** — grid decarbonization, electrification, resilience to extreme weather
