# Acoustics and Psychoacoustics — Concept Map

## Core Concepts (in learning order)

1. **Sound waves** — longitudinal pressure waves in air; compression and rarefaction
2. **Harmonics and overtones** — multiple frequency components in musical sounds
3. **Decibels and sound pressure level** — logarithmic measurement of sound intensity
4. **Interference** — how waves combine constructively or destructively
5. **Reflection and reverberation** — sound bouncing in enclosed spaces
6. **Frequency analysis** — decomposing sounds into constituent frequencies (Fourier analysis)
7. **Ear anatomy** — outer, middle, and inner ear structures. Depends on: sound waves
8. **Hair cells and mechanotransduction** — conversion of mechanical motion to neural signals. Depends on: ear anatomy
9. **Basilar membrane and place coding** — frequency-to-place mapping in the cochlea. Depends on: ear anatomy, frequency analysis
10. **Tonotopic organization** — spatial arrangement of frequency sensitivity. Depends on: basilar membrane
11. **Neural encoding** — how auditory nerve represents sound information. Depends on: hair cells
12. **Pitch perception** — subjective experience of frequency. Depends on: neural encoding, frequency analysis
13. **Missing fundamental** — hearing a pitch that isn't physically present. Depends on: pitch perception, harmonics
14. **Frequency discrimination** — ability to distinguish close frequencies. Depends on: pitch perception, basilar membrane
15. **Critical bandwidth** — frequency resolution of the auditory system. Depends on: basilar membrane, frequency discrimination
16. **Octave equivalence** — perceptual similarity of tones separated by octaves. Depends on: pitch perception
17. **Loudness perception** — subjective intensity; non-linear relationship to physical intensity. Depends on: neural encoding, decibels
18. **Equal-loudness contours** — frequency-dependent loudness sensitivity. Depends on: loudness perception
19. **Masking** — one sound making another inaudible. Depends on: loudness perception, critical bandwidth
20. **Sound localization** — determining sound direction. Depends on: neural encoding, binaural hearing
21. **Interaural time difference (ITD)** — timing difference between ears for localization. Depends on: sound localization
22. **Interaural level difference (ILD)** — intensity difference between ears for localization. Depends on: sound localization
23. **Cone of confusion** — ambiguous locations with identical ITD/ILD. Depends on: ITD, ILD
24. **Head-related transfer function (HRTF)** — spectral cues from head/ear filtering. Depends on: sound localization, cone of confusion
25. **Timbre** — perceptual quality distinguishing sounds with same pitch/loudness. Depends on: spectral envelope, harmonics
26. **Temporal masking** — masking that extends forward/backward in time. Depends on: masking
27. **Perceptual audio coding** — compression using psychoacoustic principles. Depends on: masking, temporal masking

## Dependencies

### Physical Foundation → Perception
- **Pitch perception** requires understanding **frequency analysis** because pitch emerges from how the cochlea and brain interpret frequency content, not just the physical frequency itself
- **Loudness perception** requires understanding **decibels** because the logarithmic physical scale relates to (but differs from) the perceptual scale
- **Sound localization** requires understanding **interference** and **sound waves** because binaural cues depend on how sound waves interact with the head and ears

### Anatomy → Function
- **Neural encoding** builds on **hair cells** and **basilar membrane** because the mechanical-to-electrical transduction and frequency mapping determine what information reaches the brain
- **Tonotopic organization** builds on **basilar membrane** and **place coding** because the spatial frequency map is established by cochlear mechanics
- **Masking** requires understanding **critical bandwidth** because masking effectiveness depends on auditory filter bandwidth

### Simple → Complex Phenomena
- **Missing fundamental** builds on **pitch perception** and **harmonics** because it reveals how the brain extracts pitch from harmonic relationships
- **HRTF** builds on **sound localization**, **ITD**, **ILD**, and **cone of confusion** because it solves ambiguities that timing/level cues cannot resolve
- **Temporal masking** extends **masking** by adding time-domain effects, revealing temporal integration in the auditory system
- **Perceptual audio coding** builds on **masking** and **temporal masking** because compression exploits inaudibility of masked content

## Bottlenecks

**Basilar membrane mechanics** is the critical concept that connects physical acoustics to perception. Students must understand how this single structure performs both:
1. Mechanical frequency analysis (the traveling wave)
2. Spatial coding (place-to-frequency mapping)

Without this foundation, psychoacoustic phenomena appear disconnected from physics.

**Critical bandwidth** is the bottleneck for understanding masking, frequency discrimination, and ultimately perceptual audio coding. It represents the auditory system's frequency resolution limit.

## Common Misconceptions

**"Pitch is just frequency"** — Students often conflate the physical (frequency) with the perceptual (pitch). The missing fundamental demonstrates they're distinct.

**"Loudness doubles when intensity doubles"** — Linear thinking about perception; loudness follows a power law, not a linear relationship.

**"The cochlea is just a microphone"** — The cochlea is an active, nonlinear, frequency analyzer with mechanical gain and compression, not a passive transducer.

**"We localize sound with one ear"** — Binaural cues (ITD and ILD) are essential for horizontal localization; spectral cues (HRTF) are needed for elevation and front/back disambiguation.

**"Masking only happens when sounds occur simultaneously"** — Temporal masking extends ~200ms, demonstrating temporal integration in auditory processing.

## Prerequisite Topics

- **Waves and oscillations** — needed for sound waves, frequency, amplitude, interference
- **Trigonometry and sinusoids** — needed for understanding waveforms and Fourier analysis
- **Logarithms** — needed for decibels and psychophysical scales
- **Basic biology** — helpful for understanding sensory systems and neural signals
