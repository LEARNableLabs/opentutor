# Optics — Concept Map

## Core Concepts (in learning order)

1. **Electromagnetic waves** — light as oscillating electric and magnetic fields solving Maxwell's equations
2. **Superposition principle** — waves add linearly; phase determines constructive/destructive interference
3. **Polarization** — orientation of electric field oscillation; described by Jones vectors and Stokes parameters
4. **Thin film interference** — phase shifts from optical path differences in layered media. Depends on: 1, 2
5. **Double-slit interference** — spatial pattern from two coherent sources. Depends on: 2
6. **Interferometers** — devices that split and recombine light to measure phase differences. Depends on: 4, 5
7. **Huygens-Fresnel principle** — every point on a wavefront acts as a source of secondary wavelets. Depends on: 1
8. **Diffraction** — bending and spreading of waves through apertures or around obstacles. Depends on: 7
9. **Diffraction gratings** — periodic structures creating angle-dependent interference patterns. Depends on: 5, 8
10. **Coherence** — measure of phase correlation; temporal (spectral width) and spatial (source size) coherence. Depends on: 2
11. **Photons and quantization** — light energy comes in discrete packets; photoelectric effect as evidence. Depends on: 1
12. **Fock states** — quantum states with definite photon number; eigenstates of number operator. Depends on: 11
13. **Creation and annihilation operators** — ladder operators for quantum harmonic oscillator of light field. Depends on: 12
14. **Coherent states** — quantum states closest to classical light; eigenstates of annihilation operator. Depends on: 13
15. **Quadrature operators** — position-like and momentum-like observables for light field. Depends on: 14
16. **Shot noise** — quantum fluctuations in photon counting; fundamental limit on measurement. Depends on: 11, 12
17. **Two-level atom** — simplified model of atom with ground and excited states. Depends on: 11
18. **Dipole interaction** — coupling between light field and atomic dipole moment. Depends on: 17
19. **Rabi oscillations** — coherent population oscillations between atomic levels driven by light. Depends on: 18
20. **Jaynes-Cummings model** — quantum model of atom-cavity system; quantized light + two-level atom. Depends on: 14, 19
21. **Spontaneous emission** — atom in excited state decays via interaction with vacuum fluctuations. Depends on: 18
22. **Photon correlation function g^(2)** — measures photon bunching or antibunching. Depends on: 12, 14
23. **Bunching and antibunching** — classical light bunches; single photons antibunch. Depends on: 22
24. **No-cloning theorem** — quantum states cannot be copied; basis for quantum cryptography. Depends on: 11
25. **Quantum key distribution** — secure communication using quantum states of light. Depends on: 24
26. **Entanglement** — quantum correlations stronger than classical; Bell inequalities. Depends on: 11

## Dependencies

### Classical optics progression
- **Interference** requires understanding **superposition** because waves must add with phase coherence to create stable patterns
- **Interferometers** build on **thin film interference** and **double-slit** because they use the same principles with engineered geometries
- **Diffraction** builds on **Huygens-Fresnel principle** because wavefront propagation determines diffraction patterns
- **Coherence** builds on **superposition** because phase correlation determines interference visibility

### Classical to quantum bridge
- **Photons** emerge from failure of **electromagnetic waves** to explain photoelectric effect and blackbody radiation
- **Fock states** extend photon concept to quantum field theory using **creation/annihilation operators**
- **Coherent states** bridge classical and quantum because they minimize uncertainty and have classical-like properties

### Quantum optics progression
- **Coherent states** require **quadrature operators** to describe phase-space representation and uncertainty relations
- **Rabi oscillations** require **two-level atom** model and **dipole interaction** to describe time evolution
- **Jaynes-Cummings** requires **Rabi oscillations** + **coherent states** because it's the fully quantum version
- **Photon statistics** requires **Fock states** and **coherent states** to distinguish quantum from classical light

### Applications
- **Quantum cryptography** requires **no-cloning** and **photon quantization** for security guarantees
- **Entanglement** requires quantum superposition across multiple photons

## Bottlenecks

Students commonly get stuck at:

1. **Coherence** — abstract concept; requires understanding temporal vs spatial aspects
2. **Fock states vs coherent states** — counterintuitive that definite photon number ≠ classical light
3. **Jaynes-Cummings model** — combines multiple hard concepts (quantized field, Rabi dynamics, rotating wave approximation)
4. **Spontaneous emission** — vacuum fluctuations are non-intuitive; requires quantum field theory mindset

## Prerequisite Topics

- **Multivariable calculus** — needed for Maxwell equations, wave equation, Fourier analysis (lessons 1-12)
- **Linear algebra** — needed for Jones vectors, quantum states, operators (lessons 3, 15-26)
- **Basic electromagnetism** — needed for Maxwell equations, polarization (lessons 1-3)
- **Introductory quantum mechanics** — needed for quantization, operators, two-level systems (lessons 14-26)
- **Complex numbers** — needed for phase, wavefunctions, coherent states (all lessons)
- **Fourier analysis** — helpful for diffraction, coherence (lessons 9-12)

## Rabbit Holes and Extensions

- **Nonlinear optics** — second harmonic generation, parametric down-conversion (connects to lesson 25 on entanglement)
- **Quantum computing with photons** — linear optical quantum computing, boson sampling (extends lesson 25)
- **Cavity QED** — strong coupling regime, Purcell effect (extends lesson 21)
- **Squeezed states** — beating shot noise, gravitational wave detection (extends lessons 16-17)
- **Quantum metrology** — Heisenberg limit, NOON states (extends lesson 7)
