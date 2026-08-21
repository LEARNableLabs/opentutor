# Cardiology — The Heart as an Engineering System
## Concept Map

## Core Concepts (in learning order)

1. **Cardiac anatomy** — Four chambers, valves, separation of pulmonary and systemic circuits
2. **Cardiac cycle** — Systole, diastole, valve timing, Wiggers diagram
3. **Cardiac output** — Stroke volume × heart rate, ejection fraction
4. **Frank-Starling mechanism** — Preload-dependent contractility, length-tension relationship
5. **Pressure-volume loops** — PV relationships, contractility, afterload, wall stress. Depends on: cardiac cycle, stroke volume
6. **Inotropic effects** — Contractility modulation, loop shifts. Depends on: PV loops
7. **Action potentials** — Membrane potential, ion channels, Nernst equation
8. **Pacemaker cells** — Automaticity, SA node, funny current. Depends on: action potentials
9. **Conduction pathway** — SA→AV→Bundle→Purkinje, gap junctions. Depends on: pacemaker cells
10. **ECG interpretation** — P-QRS-T waves, intervals, rate calculation. Depends on: conduction pathway
11. **Arrhythmias** — Reentry, heart block, fibrillation. Depends on: conduction pathway, ECG
12. **Pressure gradients** — Driving force for flow, Poiseuille's law
13. **Vascular resistance** — Series/parallel networks, total peripheral resistance. Depends on: pressure gradients
14. **Compliance** — Pressure-volume relationships in arteries, windkessel effect. Depends on: pressure gradients
15. **Laminar vs turbulent flow** — Reynolds number, stenosis, murmurs. Depends on: vascular resistance
16. **Blood flow measurement** — Doppler, Fick principle, indicator dilution
17. **Hemodynamic response to exercise** — Cardiac reserve, O2 delivery, A-V O2 difference. Depends on: cardiac output, vascular resistance
18. **Baroreceptor reflex** — Negative feedback, autonomic control. Depends on: pressure gradients
19. **Orthostatic hypotension** — Venous pooling, reflex compensation. Depends on: baroreceptor reflex
20. **RAAS system** — Long-term blood pressure control, volume regulation. Depends on: baroreceptor reflex
21. **Hypertension and heart failure** — Control system failure, compensation, decompensation. Depends on: RAAS, baroreceptor reflex, Frank-Starling
22. **Cardiovascular pharmacology** — Beta blockers, ACE inhibitors, diuretics. Depends on: RAAS, baroreceptor reflex
23. **Heart failure modes** — Systolic vs diastolic, failure analysis. Depends on: PV loops, Frank-Starling, control systems
24. **Cardiac devices** — Pacemakers, LVADs, device-heart interaction. Depends on: conduction pathway, PV loops
25. **Diagnostic reasoning** — Integrating physiology for clinical diagnosis. Depends on: all prior concepts

## Dependencies

### Mechanical System
- **Pressure-volume loops** require understanding the **cardiac cycle** (what happens when) and **stroke volume** (how much is pumped) because PV loops map pressure against volume throughout the cycle
- **Frank-Starling mechanism** builds on basic **cardiac anatomy** and **stroke volume** because it explains how preload affects output
- **Wall stress** (Laplace's law in PV loops) requires understanding **pressure gradients** because wall tension depends on transmural pressure

### Electrical System
- **Conduction pathway** requires understanding **pacemaker cells** because the SA node initiates the signal that propagates through the pathway
- **ECG interpretation** requires understanding **conduction pathway** because each wave (P, QRS, T) reflects depolarization/repolarization at specific anatomical sites
- **Arrhythmias** require understanding **normal conduction** because they represent breakdowns in normal electrical propagation

### Hemodynamic System
- **Vascular resistance** builds on **pressure gradients** and Poiseuille's law because resistance determines the relationship between pressure drop and flow
- **Compliance** requires understanding **pressure-volume relationships** because arterial compliance describes how much volume change occurs per unit pressure change
- **Turbulent flow** builds on understanding **laminar flow and resistance** because turbulence occurs when flow exceeds critical Reynolds numbers in narrowed vessels

### Control Systems
- **Baroreceptor reflex** requires understanding **pressure gradients** and **cardiac output** because the reflex modulates heart rate and contractility to maintain blood pressure
- **RAAS system** builds on **baroreceptor reflex** because it provides slower, volume-based regulation that complements the fast neural baroreceptor mechanism
- **Heart failure** requires understanding **Frank-Starling**, **PV loops**, and **control systems** because failure represents the exhaustion of compensatory mechanisms

### Integration
- **Hemodynamic response to exercise** integrates **cardiac output**, **vascular resistance**, and **autonomic control** because exercise requires coordinated changes in all three
- **Diagnostic reasoning** integrates all systems because clinical presentation reflects multisystem dysfunction
- **Cardiac devices** require understanding both **electrical** (pacemakers) and **mechanical** (LVADs) systems because devices must work with native physiology

## Critical Bottleneck Concepts

Students must master these before progressing:

1. **Pressure-volume loops** — Essential for understanding contractility, loading conditions, and heart failure. Most challenging mechanical concept.
2. **Conduction pathway** — Essential for ECG interpretation and arrhythmia diagnosis
3. **Vascular resistance networks** — Essential for hemodynamics and control system understanding
4. **Baroreceptor reflex** — Essential for understanding blood pressure regulation and pharmacology
5. **Integration of mechanical-electrical-hemodynamic** — Essential for clinical reasoning

## Common Misconceptions

### Bottleneck #1: PV Loops
**Misconception:** "The PV loop is just a graph of two variables"
**Reality:** The loop represents a complete cardiac cycle in phase space. Each point has temporal meaning, and the shape encodes contractility, preload, and afterload simultaneously.

### Bottleneck #2: Conduction Delays
**Misconception:** "The heart contracts all at once"
**Reality:** There's a ~120ms delay from SA firing to ventricular contraction, essential for filling. The AV node delay is a feature, not a bug.

### Bottleneck #3: Resistance Networks
**Misconception:** "Arterioles have the highest resistance, so they dominate total peripheral resistance"
**Reality:** While individual arterioles have high resistance, they're in parallel. Total capillary resistance can dominate depending on tissue perfusion state.

### Bottleneck #4: Compliance vs Resistance
**Misconception:** "Arteries are just pipes that carry blood"
**Reality:** Arterial compliance creates the windkessel effect, converting pulsatile flow into smoother tissue perfusion. Stiff arteries increase pulse pressure and cardiac workload.

### Bottleneck #5: Compensation vs Cure
**Misconception:** "If the body compensates for heart failure, the patient is fine"
**Reality:** Compensation (increased heart rate, RAAS activation, ventricular remodeling) eventually becomes pathological and accelerates failure.

## Prerequisite Topics

- **Multivariable calculus** — needed for partial derivatives in Poiseuille's law, gradients in pressure fields
- **Basic physics (fluids)** — needed for pressure, flow, resistance, Reynolds number, Poiseuille's law
- **Basic physics (electricity)** — needed for membrane potential, ion currents, Nernst equation
- **Cell biology** — needed for ion channels, gap junctions, cellular metabolism
- **Chemistry** — needed for pH, buffer systems, ion concentrations, O2/CO2 transport

## Learning Sequence Rationale

### Module 1: Mechanical First
Start with the **heart as a pump** because it's the most tangible engineering analogy. Students can visualize chambers, valves, and pressure. Build from anatomy → cycle → output → contractility → PV loops.

### Module 2: Electrical System
Introduce **electrical system** after mechanics because students need to understand *what* the heart does before *how* it's controlled. Action potentials build on physics/chemistry prerequisites.

### Module 3: Hemodynamics
**Hemodynamics** builds on mechanical understanding (cardiac output is the flow source) and introduces vascular networks as distributed resistance/compliance systems.

### Module 4: Control Systems
**Control systems** integrate mechanical, electrical, and hemodynamic knowledge. Baroreceptor reflex modulates all three. This module requires the most synthesis.

### Module 5: Clinical Integration
**Clinical engineering** applies failure analysis, device design, and diagnostic reasoning to synthesize all prior modules in realistic scenarios.

### Review Placement
- **Review 1 (Lesson 12):** After mechanical + electrical basics, before hemodynamics. Reinforces cardiac cycle and PV-ECG coupling.
- **Review 2 (Lesson 24):** After control systems, before clinical. Reinforces systems integration and homeostasis.
