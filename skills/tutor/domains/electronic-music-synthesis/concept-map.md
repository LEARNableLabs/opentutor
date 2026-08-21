# Electronic Music Synthesis — Concept Map

## Core Concepts (in learning order)

1. **Signal flow** — understanding the path from oscillator to speaker
2. **Audio rate vs. control rate** — two different signal speeds in a synth
3. **CV/gate paradigm** — voltage control as the universal control mechanism. Depends on: signal flow
4. **Modulation routing** — connecting control sources to destinations. Depends on: CV/gate paradigm
5. **Resonance** — filter feedback creating emphasis and self-oscillation. Depends on: signal flow
6. **LFO routing** — slow modulation for movement. Depends on: modulation routing
7. **Detuning and beating** — phase interactions between oscillators. Depends on: signal flow
8. **Harmonic content** — the spectrum of a sound and its timbral character. Depends on: signal flow
9. **Additive synthesis** — building timbres from pure sine waves. Depends on: harmonic content
10. **Harmonic series** — the natural overtone structure. Depends on: harmonic content
11. **Spectral evolution** — how harmonics change over time. Depends on: additive synthesis, harmonic series
12. **FM synthesis** — using one oscillator to modulate another's frequency. Depends on: signal flow, modulation routing
13. **Sidebands** — the new frequencies created by FM. Depends on: FM synthesis, harmonic content
14. **Modulation index** — controlling FM intensity. Depends on: FM synthesis
15. **FM algorithms** — structured networks of operators. Depends on: FM synthesis, sidebands
16. **Wavetable synthesis** — morphing through stored waveforms. Depends on: signal flow
17. **Wavetable scanning** — moving through wavetable positions. Depends on: wavetable synthesis, modulation routing
18. **Waveshaping** — distorting waveforms with transfer functions. Depends on: signal flow, harmonic content
19. **FFT and spectral processing** — working in the frequency domain. Depends on: harmonic content
20. **Granular synthesis** — manipulating micro-segments of sound. Depends on: signal flow
21. **Grain parameters** — density, size, position, pitch of grains. Depends on: granular synthesis
22. **Stochastic processes** — randomization in synthesis. Depends on: modulation routing, granular synthesis
23. **Physical modeling** — simulating acoustic physics. Depends on: signal flow, harmonic content
24. **Karplus-Strong** — delay-line based string synthesis. Depends on: physical modeling
25. **Hybrid synthesis** — combining multiple synthesis methods. Depends on: all synthesis methods
26. **Sound analysis** — identifying synthesis techniques from listening. Depends on: all synthesis methods

## Dependencies

### Foundational Chain
- **Signal flow** is the absolute foundation — everything else builds on understanding how audio and control signals move through a system
- **Audio rate vs. control rate** requires signal flow because you need to understand the difference between signals that create sound vs. signals that control sound
- **CV/gate** requires signal flow to understand how voltages represent musical parameters

### Modulation Dependencies
- **Modulation routing** requires CV/gate because CV is the mechanism for routing
- **LFO routing** is just a specific case of modulation routing with slow-moving sources
- All advanced synthesis techniques (FM, wavetable scanning) depend on understanding modulation routing

### Harmonic Dependencies
- **Harmonic content** is independent but essential for understanding timbre
- **Additive synthesis** directly manipulates harmonic content by controlling individual partials
- **Spectral evolution** requires additive synthesis knowledge to understand how those partials change
- **Waveshaping** creates new harmonic content through nonlinear transfer functions
- **FFT/spectral processing** explicitly works with harmonic content in frequency domain

### Synthesis Method Chain
- **Subtractive** (review material) → **Additive** → **FM** → **Wavetable** → **Granular** → **Physical modeling** represents increasing conceptual complexity
- **FM synthesis** requires solid understanding of signal flow and modulation because it's modulation at audio rate
- **Sidebands** cannot be understood without FM synthesis basics
- **FM algorithms** require understanding both FM basics and sidebands to make sense of operator networks

### Integration Dependencies
- **Hybrid synthesis** requires understanding of all previous synthesis methods to combine them effectively
- **Sound analysis** requires exposure to all methods to recognize them aurally

## Bottleneck Concepts

These concepts are critical gates — students who don't grasp them will struggle with everything downstream:

1. **Signal flow** — without this, nothing makes sense. Must be solid before moving forward.
2. **Modulation routing** — this is where synthesis goes from static to dynamic. The leap from "modulation exists" to "I can route anything to anything" is crucial.
3. **Harmonic content** — understanding that timbre = spectrum is essential for all synthesis methods beyond basic subtractive.
4. **FM carrier/modulator relationship** — FM is conceptually harder than other methods. If this doesn't click, students get lost in sidebands.

## Mind-Blowing Moments

Points where students typically have "aha!" experiences:

1. **Resonance to self-oscillation** (Lesson 4) — realizing a filter can become an oscillator by turning up Q
2. **Detuning creates beating** (Lesson 6) — hearing how phase relationships create the "analog" sound
3. **FM creates inharmonic spectra** (Lesson 14) — understanding why FM sounds so different from filters
4. **Wavetable is just lookup** (Lesson 18) — realizing wavetables are surprisingly simple conceptually
5. **Granular can freeze time** (Lesson 24) — the moment when grain density and position make clicks become textures
6. **Physical modeling with delays** (Lesson 27) — understanding that a delay line can simulate a vibrating string

## Common Misconceptions

1. **"Filters remove frequencies"** — Filters attenuate, they don't completely remove. Resonance can actually boost.
2. **"More oscillators = better sound"** — Quality of modulation and filtering matters more than oscillator count
3. **"FM is just vibrato"** — FM at audio rate creates new harmonics; LFO vibrato just changes pitch
4. **"Wavetables are just samples"** — Wavetables are single-cycle waveforms, not recordings
5. **"Additive synthesis can make any sound"** — Theoretically true, but practically limited by the number of partials and envelopes you can control
6. **"Granular synthesis is just chopping samples"** — Granular is about overlapping micro-segments with windowing, not just cutting
7. **"Physical modeling sounds realistic"** — It can, but it's more about expressive control than photorealism
8. **"You need modular hardware to learn modular thinking"** — Software (VCV Rack, Pure Data) teaches the same concepts

## Prerequisite Topics

External knowledge needed before starting:

- **Basic audio concepts** — needed for signal flow, harmonic content
  - Frequency, amplitude, waveforms (sine, saw, square, triangle)
  - Timbre as spectral content
  - Envelopes (ADSR)
  
- **Simple subtractive synthesis** — needed for all synthesis methods
  - OSC → Filter → VCA signal chain
  - Filter types (LP, HP, BP, notch)
  - Basic envelope application
  
- **DAW or audio software familiarity** — needed for all lessons
  - Loading and playing virtual instruments
  - MIDI input and recording
  - Basic mixing (levels, panning)
  
- **Basic music theory** — needed for musical application
  - Notes, scales, intervals
  - Harmonic vs. inharmonic sounds
  - Musical terms (timbre, attack, sustain, etc.)

## Advanced Extensions

Where students might go after this curriculum:

- **Sound design for specific genres** — applying techniques to EDM, film scoring, ambient, etc.
- **Algorithmic composition** — using SuperCollider, Max/MSP, Pure Data for generative music
- **Custom DSP programming** — writing synthesis algorithms from scratch
- **Modular hardware** — transitioning to Eurorack or semi-modular systems
- **Spatial audio** — multichannel synthesis and ambisonics
- **Adaptive audio for games** — real-time synthesis in interactive contexts
- **Instrument design** — building playable instruments with unique synthesis methods
