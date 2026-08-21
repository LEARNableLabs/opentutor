# Medical Imaging — Concept Map

## Core Concepts (in learning order)

1. **Electromagnetic radiation** — photons as wave-particle duality, frequency, wavelength, energy
2. **X-ray production** — Bremsstrahlung and characteristic radiation from electron-target interactions
3. **Tissue attenuation** — how different tissues absorb/scatter X-rays differently. Depends on: electromagnetic radiation
4. **Photoelectric effect** — complete photon absorption, dominant at low energies and high atomic number
5. **Compton scattering** — partial photon energy transfer, creates scatter radiation. Depends on: electromagnetic radiation
6. **Attenuation coefficients** — quantifying tissue-specific X-ray absorption. Depends on: photoelectric effect, Compton scattering
7. **Spatial resolution** — minimum distinguishable distance between two objects
8. **Radiation dose** — energy deposited per unit mass, biological effects
9. **ALARA principle** — As Low As Reasonably Achievable, dose optimization strategy
10. **Scatter radiation** — secondary radiation degrading image contrast. Depends on: Compton scattering
11. **Anti-scatter grids** — devices to reduce scatter reaching the detector. Depends on: scatter radiation
12. **Projection data** — 1D line integrals of attenuation through the body
13. **Tomography** — reconstruction of cross-sectional slices from multiple projections
14. **Filtered back-projection** — mathematical algorithm for CT reconstruction. Depends on: projection data, tomography
15. **Hounsfield scale** — CT numbers quantifying tissue density. Depends on: attenuation coefficients
16. **CT artifacts** — image distortions from physics limitations or reconstruction assumptions
17. **Helical CT** — continuous table motion during scanning for faster acquisition
18. **Acoustic waves** — mechanical pressure waves, frequency and wavelength in tissue
19. **Piezoelectric effect** — converting electrical to mechanical energy and vice versa for ultrasound transducers
20. **Pulse-echo imaging** — sending sound pulses and detecting reflections. Depends on: acoustic waves, piezoelectric effect
21. **Acoustic impedance** — tissue property determining reflection/transmission. Depends on: acoustic waves
22. **Doppler effect** — frequency shift from moving reflectors (blood cells)
23. **Nuclear magnetic resonance (NMR)** — alignment and precession of nuclear spins in magnetic field
24. **Larmor frequency** — resonance frequency for spin excitation. Depends on: NMR
25. **T1 relaxation** — recovery of longitudinal magnetization, tissue-dependent
26. **T2 relaxation** — decay of transverse magnetization, tissue-dependent
27. **Proton density** — concentration of mobile hydrogen nuclei
28. **Contrast weighting** — controlling image brightness by T1, T2, or proton density. Depends on: T1 relaxation, T2 relaxation, proton density
29. **K-space** — spatial frequency domain representation of MRI data
30. **Frequency encoding** — using gradient fields to encode spatial position. Depends on: Larmor frequency
31. **Phase encoding** — second spatial dimension encoding. Depends on: Larmor frequency
32. **Pulse sequences** — timed RF and gradient events to create contrast. Depends on: T1 relaxation, T2 relaxation
33. **Spin echo** — refocusing sequence to reduce T2* effects
34. **Gradient echo** — faster sequence without refocusing pulse
35. **Echo planar imaging (EPI)** — ultra-fast single-shot imaging technique. Depends on: k-space, frequency encoding
36. **Radiotracers** — radioactive molecules targeting specific biological processes
37. **PET (Positron Emission Tomography)** — detecting coincident gamma rays from positron annihilation
38. **SPECT** — single gamma photon detection with rotating cameras
39. **Deep learning in imaging** — convolutional neural networks for image analysis
40. **fMRI (functional MRI)** — detecting brain activity via blood oxygenation changes. Depends on: MRI fundamentals, T2*
41. **Modality selection** — choosing appropriate imaging based on clinical question, safety, cost

## Dependencies

### Foundation → X-ray imaging
- **Tissue attenuation** requires understanding **electromagnetic radiation** because attenuation is wavelength and energy-dependent
- **Attenuation coefficients** build on **photoelectric effect** and **Compton scattering** because these are the two main interaction mechanisms
- **Scatter radiation** is a direct consequence of **Compton scattering**

### X-ray → CT
- **Filtered back-projection** requires **projection data** and the concept of **tomography** because CT reconstructs slices from many X-ray projections
- **Hounsfield scale** depends on **attenuation coefficients** because CT numbers quantify relative attenuation
- **CT artifacts** arise from violations of reconstruction assumptions (e.g., monochromatic X-rays, no motion)

### Ultrasound chain
- **Pulse-echo imaging** combines **acoustic waves** and **piezoelectric effect** because you need to generate and detect sound pulses
- **Acoustic impedance** determines **reflection/transmission** at tissue boundaries, critical for image formation
- **Doppler effect** requires understanding **acoustic waves** to appreciate frequency shifts

### NMR → MRI
- **Larmor frequency** is the resonance condition for **NMR**, setting the RF excitation frequency
- **Contrast weighting** manipulates **T1**, **T2**, and **proton density** to create tissue contrast
- **Frequency encoding** and **phase encoding** both exploit **Larmor frequency** dependence on magnetic field strength
- **Pulse sequences** are timed patterns of RF and gradients that control **T1** and **T2** weighting

### Advanced MRI
- **EPI** is built on **k-space** concepts and **frequency encoding**, filling k-space in a single shot
- **fMRI** uses **MRI fundamentals** with sensitivity to T2* (blood oxygenation level-dependent contrast)

### Nuclear medicine
- **PET** and **SPECT** both use **radiotracers** but differ in detection mechanism (coincidence vs single photon)
- Both provide **functional/molecular** information complementing **anatomical** imaging from CT/MRI

### Clinical integration
- **Modality selection** requires understanding strengths/limitations of all imaging types
- Must consider radiation dose (X-ray/CT/nuclear), contraindications (MRI with metal), and diagnostic value

## Prerequisite Topics (external)

- **Basic physics** (mechanics, waves, electromagnetism) — needed for radiation physics, acoustic waves, NMR
- **Basic chemistry** — needed for understanding tissue composition, contrast agents, radiotracers
- **Basic anatomy** — needed for interpreting images and understanding clinical applications
- **Linear algebra** (vectors, matrices) — helpful for understanding image reconstruction, though not strictly required at intermediate level
- **Fourier analysis** — helpful for k-space and image processing, though concepts can be taught intuitively

## Critical Bottleneck Concepts

These concepts are hardest to grasp and gate progression:

1. **Filtered back-projection** — most students struggle with the math and intuition behind tomographic reconstruction
2. **K-space** — abstract frequency-domain representation is counterintuitive for spatial thinkers
3. **T1 vs T2 relaxation** — distinguishing these two independent relaxation processes and their tissue dependence
4. **Phase encoding** — less intuitive than frequency encoding, requires careful conceptual building
5. **Contrast mechanisms across modalities** — understanding that each modality creates contrast differently (density vs acoustic impedance vs relaxation times)

## Learning Pathways

### Linear pathway (recommended for structured learners)
X-ray → CT → Ultrasound → MRI → Nuclear Medicine → Integration

Advantages: builds complexity gradually, each modality introduces new physics

### Comparative pathway (for experienced learners)
Introduce all modalities early, then deep-dive into physics of each

Advantages: helps with modality selection intuition early, shows complementary roles

### Problem-based pathway (for clinical learners)
Start with clinical cases, pull in physics as needed

Advantages: motivates the "why" behind each modality, more engaging for clinicians

## Common Student Confusions (cross-cutting)

- **Resolution vs contrast** — often conflated; resolution is spatial detail, contrast is tissue differentiation
- **Dose vs image quality** — false belief that higher dose always means better images (ignores noise, scatter, detector limits)
- **"No radiation" modalities** — MRI and ultrasound are often incorrectly assumed to be completely harmless (MRI has acoustic noise, heating, contraindications; ultrasound has thermal/mechanical bioeffects at high intensities)
