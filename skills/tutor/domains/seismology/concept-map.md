# Seismology — Concept Map

## Core Concepts (in learning order)

1. **Elastic waves** — energy propagation through deformable media; foundation for all seismic phenomena
2. **Seismic energy** — energy released by earthquakes, transmitted through Earth as waves
3. **P-waves (primary/compressional)** — fastest seismic waves, travel through solids and liquids. Depends on: elastic waves
4. **S-waves (secondary/shear)** — slower than P-waves, travel only through solids. Depends on: elastic waves
5. **Surface waves** — waves confined near Earth's surface (Love, Rayleigh); slower but often more destructive. Depends on: P-waves, S-waves
6. **Wave velocity** — speed of seismic waves, determined by elastic properties and density. Depends on: elastic waves
7. **Elastic moduli** — material properties (bulk modulus, shear modulus) controlling wave speeds. Depends on: wave velocity
8. **Seismogram** — recorded ground motion showing wave arrivals. Depends on: P-waves, S-waves, surface waves
9. **Reflection and refraction** — wave behavior at interfaces between layers. Depends on: wave velocity
10. **Travel times** — time for waves to travel from source to receiver. Depends on: wave velocity, ray paths
11. **Ray paths** — trajectories of seismic waves through Earth. Depends on: reflection, refraction
12. **Earth's layered structure** — crust, mantle, outer core, inner core revealed by seismic waves. Depends on: travel times, ray paths
13. **Seismic discontinuities** — sharp velocity changes at boundaries (Moho, core-mantle boundary). Depends on: Earth's layered structure
14. **Shadow zones** — regions where certain waves don't arrive due to Earth's structure. Depends on: S-waves, Earth's layered structure
15. **Velocity models** — mathematical descriptions of wave speeds vs depth (PREM, AK135). Depends on: travel times, Earth's layered structure
16. **Seismic tomography** — 3D imaging of Earth's interior using wave speed variations. Depends on: velocity models, travel times
17. **Elastic rebound theory** — explanation of earthquake generation through sudden stress release. Depends on: seismic energy
18. **Fault mechanics** — physics of fault motion and stress accumulation. Depends on: elastic rebound theory
19. **Magnitude** — quantitative measure of earthquake size (Richter, moment magnitude). Depends on: seismic energy
20. **Moment tensor** — mathematical description of earthquake source and fault orientation. Depends on: fault mechanics
21. **Focal mechanisms** — graphical representation of fault motion (beach balls). Depends on: moment tensor
22. **Gutenberg-Richter law** — statistical relationship between earthquake magnitude and frequency. Depends on: magnitude
23. **Seismometer** — instrument for detecting ground motion. Depends on: seismogram
24. **Seismic networks** — arrays of stations for detecting and locating earthquakes. Depends on: seismometer
25. **Epicenter location** — determining earthquake position using arrival time differences. Depends on: travel times, seismic networks
26. **Signal processing** — filtering and analyzing seismic data to extract information. Depends on: seismogram
27. **Seismic hazard** — probability of dangerous ground shaking in a region. Depends on: magnitude, Gutenberg-Richter law
28. **Site effects** — local amplification of shaking due to soil and geology. Depends on: wave propagation, reflection and refraction
29. **Earthquake early warning** — systems to detect earthquakes and warn before strong shaking arrives. Depends on: P-waves, seismic networks

## Dependencies

### Wave Fundamentals → Everything Else
- **All seismology depends on understanding elastic waves** — this is the foundation. P-waves, S-waves, and surface waves are specific manifestations of elastic wave propagation.
- **Wave velocity controls both Earth structure studies and hazard assessment** — faster travel times reveal structure; wave speeds determine how shaking propagates.

### Wave Types → Earth Structure
- **S-wave shadow zones reveal the liquid outer core** — because S-waves (shear waves) cannot propagate through liquids, the absence of S-waves at certain distances proves the outer core is liquid.
- **Travel-time curves map Earth's velocity structure** — by measuring when waves arrive at different distances, we can infer how velocity changes with depth.
- **Seismic tomography requires understanding ray paths and travel times** — we image Earth's interior by measuring how actual travel times deviate from predictions.

### Earth Structure → Source Studies
- **Accurate Earth models are needed to locate earthquakes** — we must correct for Earth's structure when triangulating epicenters.
- **Velocity models enable moment tensor inversion** — to determine focal mechanisms, we need to know how waves propagate through Earth.

### Source Physics → Hazard Assessment
- **Magnitude scales quantify seismic energy for hazard studies** — Gutenberg-Richter law uses magnitude statistics to predict future earthquake probabilities.
- **Focal mechanisms reveal active stress fields** — understanding which faults are active and how they move informs hazard maps.
- **Elastic rebound theory explains why earthquakes repeat** — stress accumulates over time, leading to periodic ruptures.

### Instrumentation → All Applications
- **Seismometers are the foundation of all observational seismology** — without instruments, we have no data.
- **Network geometry affects location accuracy** — epicenter location requires multiple stations with good azimuthal coverage.
- **Signal processing makes weak signals visible** — filtering removes noise and reveals subtle phases.

### Integration for Hazard
- **Site effects + magnitude + distance = ground motion prediction** — hazard assessment combines source strength, wave propagation, and local amplification.
- **Early warning requires fast detection + network coverage + velocity models** — we must detect P-waves quickly and predict when damaging S-waves and surface waves will arrive.

## Key Bottleneck Concepts

These concepts often slow down students; they require extra attention and multiple perspectives:

1. **Why S-waves can't travel through liquids** — students often memorize this but don't understand why shear stress can't exist in fluids. Need mechanical intuition, not just formula.

2. **Ray paths vs actual wave propagation** — ray theory is an approximation. Students confuse rays (perpendicular to wavefront) with actual particle motion.

3. **Focal mechanisms and moment tensors** — the beach ball diagrams are notoriously confusing. Requires understanding: 1) force couples, 2) radiation patterns, 3) first motion polarity, 4) projection onto sphere.

4. **Difference between magnitude scales** — Richter, body-wave magnitude, surface-wave magnitude, moment magnitude all measure different things. Students mix them up.

5. **Probabilistic seismic hazard** — the concept of "10% probability of exceedance in 50 years" is statistically subtle. Needs concrete examples.

## Common Misconceptions

1. **"Seismic waves are sound waves"** — They're related (both are elastic waves) but seismic waves span much lower frequencies and propagate through solid Earth, not air.

2. **"The Richter scale goes from 1 to 10"** — It's open-ended and logarithmic. Magnitude 5 is 10× larger amplitude than magnitude 4.

3. **"P-waves travel through liquids because they're compressional"** — Correct, but students often think this means S-waves are also compressional. S-waves are shear and require rigidity.

4. **"We can predict earthquakes"** — We can assess hazard probabilistically but cannot predict specific earthquakes (time, location, magnitude) with useful precision.

5. **"Earthquakes happen only at plate boundaries"** — Intraplate earthquakes (New Madrid, Charlevoix) occur in continental interiors.

6. **"Bigger earthquakes always cause more damage"** — Damage depends on magnitude AND distance, depth, site effects, building standards, population density.

7. **"Earthquake early warning predicts earthquakes before they happen"** — EEW detects earthquakes that have already started and warns before the strong shaking arrives.

## Prerequisite Topics

- **Calculus** — needed for understanding wave equations, derivatives (velocity, acceleration), integrals (energy)
- **Wave physics** — general wave concepts (wavelength, frequency, amplitude, phase) transfer directly
- **Linear algebra** — vectors for particle motion, matrices for moment tensors and transformations
- **Differential equations** — the wave equation is a PDE; not required to derive but helpful for intuition
- **Basic geology** — plate tectonics, rock types, Earth structure provide context
- **Fourier analysis** (optional) — for understanding spectral analysis and filtering in signal processing

## Prerequisites by Lesson Range

- **Lessons 1-6** (Wave fundamentals): calculus, basic physics (mechanics, waves)
- **Lessons 7-12** (Earth structure): wave fundamentals + geometry (ray paths, refraction)
- **Lessons 13-17** (Source physics): wave fundamentals + mechanics (stress, strain) + linear algebra (moment tensor)
- **Lessons 18-23** (Instrumentation): wave fundamentals + signal processing concepts (Fourier useful but not essential)
- **Lessons 24-27** (Hazards): integration of all previous + probability/statistics (hazard assessment)
