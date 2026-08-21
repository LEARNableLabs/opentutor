# Optical Fiber Communications — Concept Map

## Core Concepts (in learning order)

1. **Total internal reflection** — light bounces inside the fiber by hitting the boundary at angles above critical angle
2. **Refractive index** — material property that determines how light bends when entering
3. **Ray optics vs. wave optics** — two ways to model light propagation; ray for intuition, wave for precision
4. **Modal theory** — light travels in discrete patterns (modes) determined by fiber geometry and wavelength
5. **Single-mode fiber** — fiber that supports only the fundamental mode, used for long-distance communications. Depends on: modal theory, V-parameter
6. **Multi-mode fiber** — fiber that supports many modes, used for short distances. Depends on: modal theory, V-parameter
7. **Chromatic dispersion** — different wavelengths travel at different speeds, causing pulse spreading. Depends on: modal theory
8. **Modal dispersion** — different modes travel at different speeds in multi-mode fiber. Depends on: multi-mode fiber, modal theory
9. **Attenuation** — signal loss due to absorption and scattering in the fiber. Depends on: material properties
10. **Laser diodes** — semiconductor light sources with narrow spectrum and high modulation bandwidth. Depends on: basic optics, semiconductors
11. **LEDs** — broader spectrum sources for short-distance links. Depends on: basic optics, semiconductors
12. **Photodetection** — converting photons to electrons using photodiodes. Depends on: semiconductor physics
13. **PIN photodiode** — basic photodetector structure. Depends on: photodetection
14. **Avalanche photodiode (APD)** — photodetector with internal gain. Depends on: PIN photodiode, photodetection
15. **Optical amplifiers** — devices that amplify light without electrical conversion. Depends on: laser physics
16. **EDFA** — erbium-doped fiber amplifier, most common type. Depends on: optical amplifiers
17. **Passive components** — couplers, splitters, filters, isolators. Depends on: basic optics
18. **Intensity modulation** — encoding data by varying light power. Depends on: laser diodes
19. **Direct modulation** — modulating the laser drive current. Depends on: intensity modulation, laser diodes
20. **External modulation** — using a Mach-Zehnder modulator. Depends on: intensity modulation, electro-optic effect
21. **Wavelength division multiplexing (WDM)** — sending multiple wavelengths on one fiber. Depends on: chromatic dispersion, filters
22. **DWDM** — dense WDM with closely spaced channels on ITU grid. Depends on: WDM
23. **Polarization division multiplexing** — using two orthogonal polarizations. Depends on: polarization, coherent detection
24. **Digital modulation formats** — QPSK, QAM for encoding multiple bits per symbol. Depends on: intensity modulation, phase modulation
25. **Link power budget** — accounting for all gains and losses from transmitter to receiver. Depends on: attenuation, component specs
26. **Receiver sensitivity** — minimum power needed for target BER. Depends on: photodetection, noise
27. **Rise time budget** — accounting for bandwidth limitations in system. Depends on: dispersion, component bandwidth
28. **Receiver noise** — shot noise, thermal noise limiting performance. Depends on: photodetection, statistics
29. **Bit error rate (BER)** — probability of bit errors, key performance metric. Depends on: receiver noise, signal power, modulation format
30. **Q-factor** — metric relating SNR to BER. Depends on: BER, signal-to-noise ratio
31. **Nonlinear effects** — self-phase modulation, four-wave mixing at high powers. Depends on: Kerr effect, high intensities
32. **Coherent detection** — detecting both amplitude and phase using local oscillator. Depends on: heterodyne detection, DSP
33. **Digital signal processing (DSP)** — compensating for impairments in digital domain. Depends on: coherent detection, signal processing
34. **Space-division multiplexing** — using multiple spatial channels (cores, modes). Depends on: modal theory, advanced fiber designs

## Dependencies

### Fundamental Layers
- **Total internal reflection and refractive index** are the foundation — everything depends on light staying in the fiber
- **Modal theory** builds on wave optics and is required to understand single-mode vs. multi-mode fibers
- **Dispersion** (chromatic and modal) requires understanding modes and how they propagate

### Component Layer
- **Light sources** (laser diodes, LEDs) depend on semiconductor physics and basic optics
- **Photodetectors** (PIN, APD) require understanding photodetection and semiconductor physics
- **Optical amplifiers** require understanding of laser physics and population inversion
- All components feed into the system design layer

### Modulation/Multiplexing Layer
- **Intensity modulation** requires understanding light sources (how to control them)
- **WDM/DWDM** requires understanding chromatic dispersion (why channels don't interfere) and filters (how to separate channels)
- **Advanced modulation** (QPSK, QAM) requires understanding coherent detection and phase control

### System Design Layer
- **Link power budget** requires knowing all component gains/losses and attenuation
- **Rise time budget** requires understanding dispersion and component bandwidths
- **BER analysis** requires understanding receiver noise, signal power, and modulation format
- All system design concepts build on the component layer

### Advanced Layer
- **Nonlinear effects** only matter at high powers in long systems; requires understanding Kerr effect
- **Coherent detection** requires understanding phase modulation and DSP
- **Space-division multiplexing** requires advanced modal theory and novel fiber designs

## Critical Path (Must-Learn Sequence)

1. Light confinement (total internal reflection, refractive index) → 2. Modal theory → 3. Single-mode vs. multi-mode → 4. Dispersion and attenuation → 5. Components (sources, detectors, amplifiers) → 6. Modulation → 7. Multiplexing → 8. System design (budgets, BER) → 9. Advanced topics

**Bottleneck concepts** (block progress if not understood):
- **Modal theory** — needed for everything about propagation
- **Chromatic dispersion** — limits system performance, required for WDM
- **Receiver sensitivity and noise** — required for any system design

## Prerequisite Topics

- **Electromagnetics fundamentals** — needed for understanding wave propagation, modes, polarization
- **Basic optics** — needed for refraction, reflection, interference
- **Digital communications basics** — needed for modulation formats, BER, SNR
- **Signal processing fundamentals** — needed for rise time budget, DSP, coherent detection
- **Semiconductor physics** (basic) — helpful for understanding sources and detectors, but can be learned alongside

## Common Student Paths

**Bottom-up learners**: Start with total internal reflection, build up modal theory mathematically, then apply to systems.

**Top-down learners**: Start with "what does a fiber link do?", work backwards to understand why each component is needed.

**Application-driven learners**: Jump to WDM/DWDM and system design, fill in gaps (dispersion, noise) as needed.

For intermediate students: Assume some background but verify modal theory and dispersion are solid before moving to system design.
