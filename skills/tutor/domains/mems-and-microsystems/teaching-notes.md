# MEMS and Microsystems — Teaching Notes

## Approach

MEMS is fundamentally about **scale-dependent physics** — the same equations apply at all sizes, but which terms dominate changes dramatically. Teaching should emphasize dimensional analysis and scaling laws from the start, then use real devices as case studies to show these principles in action. The field is highly interdisciplinary (mechanics, E&M, materials, fabrication, circuits), so expect to spend time reviewing fundamentals and making connections across domains. At the intermediate level, go beyond "what" to "why": why parallel plate actuators pull in, why silicon is etched anisotropically, why gyroscopes need quadrature suppression.

Use **visual aids heavily** — SEM images of real devices, process flow diagrams, FEM simulation results. MEMS structures are visually striking and help build intuition. Where possible, link to videos of cleanroom processes or devices in operation.

The intermediate student should come away able to **design simple MEMS devices** (pressure sensor, thermal actuator) using first principles and recognize the key tradeoffs (sensitivity vs bandwidth, force vs displacement, cost vs performance).

## Common Misconceptions

### 1. "Smaller structures are weaker"
**Why:** Macro intuition says a thin beam is flimsy. At microscale, stiffness per unit volume actually increases because surface-to-volume ratio increases.

**Correction:** Always work through dimensional analysis. For a cantilever beam, stiffness k ∝ wt³/L³. If you scale all dimensions by 1/1000, k scales by 1/1000, but mass scales by 1/10⁹. The stiffness-to-mass ratio k/m scales by 10⁶, which is why MEMS resonators have MHz frequencies. Students should see stiffness and mass aren't the full story — the *ratio* determines dynamics.

### 2. "Pull-in is a control problem that can be fixed with feedback"
**Why:** Students think if the actuator is pulling in too far, just reduce the voltage. They don't realize pull-in is a fundamental instability.

**Correction:** Show the energy landscape. The electrostatic energy scales as 1/gap while the spring energy scales as displacement². Beyond 1/3 gap, the electrostatic force gradient exceeds the spring stiffness gradient, creating runaway collapse. No amount of feedback can stabilize a system past this bifurcation point. This is why comb drives are preferred for large displacement.

### 3. "Capacitive sensing is just measuring capacitance"
**Why:** Students overlook that parasitic capacitance to substrate and wiring can be 10-100x larger than the signal capacitance.

**Correction:** Work through a real example: signal capacitance might be 100 fF with 1 fF change, but parasitic capacitance is 10 pF. Single-ended measurement would see 0.01% change buried in noise. Differential sensing cancels the common-mode parasitic and doubles the signal, making the problem tractable. This is why almost all MEMS accelerometers use differential capacitors.

### 4. "The Coriolis force rotates the gyroscope"
**Why:** The word "gyroscope" suggests spinning, and students confuse vibratory MEMS gyroscopes with classical spinning-wheel gyroscopes.

**Correction:** Emphasize that the device is not spinning; instead, a proof mass is vibrating in one direction (drive mode) and the external rotation causes a Coriolis force perpendicular to both the vibration and rotation axis. This force is sensed capacitively. Draw the force diagram carefully and relate to everyday experience (e.g., ball thrown on a merry-go-round).

### 5. "Stiction is just static friction"
**Why:** The word sounds like "static friction," and students apply macro friction models.

**Correction:** Stiction in MEMS is dominated by **surface forces** (capillary forces from water meniscus during drying, van der Waals forces, electrostatic charging), not friction. When a cantilever beam sticks to the substrate, the restoring force might be nanoNewtons while the capillary force is microNewtons — a factor of 1000 difference. Anti-stiction coatings (SAMs, vapor HF release) work by preventing liquid meniscus formation or passivating surfaces, not by reducing friction coefficient.

### 6. "Thermal actuators are slow because heat diffuses slowly"
**Why:** Macro experience with ovens and stovetops suggests thermal systems have large time constants.

**Correction:** Thermal time constant τ = (volume × heat capacity) / (thermal conductance). For microscale, volume scales as L³ while thermal conductance scales as L (assuming heat flow over distance L). Thus τ ∝ L². A 1 mm beam might have τ ~ 1 s, but a 1 μm beam has τ ~ 1 μs. Show calculations explicitly. Thermal actuation can be quite fast at microscale despite intuition.

### 7. "Anisotropic etching means vertical walls"
**Why:** Students confuse anisotropic (directionally dependent) with vertical.

**Correction:** KOH etching of silicon is highly anisotropic but produces 54.7° walls (the {111} plane angle). "Anisotropic" means different etch rates in different crystal directions. RIE (reactive ion etching) can be tuned for near-vertical walls but is a different mechanism (ion bombardment + chemical). Show cross-section SEM images to make this concrete.

### 8. "Higher Q factor is always better for resonators"
**Why:** Students see Q as a performance metric and assume maximizing it is optimal.

**Correction:** High Q gives sharp frequency response, which is great for filters and frequency references. But for sensors, very high Q means slow settling time (response time ~ Q/ω₀) and narrow bandwidth. In a gyroscope, you want moderate Q: high enough for good signal-to-noise, low enough for reasonable bandwidth. Discuss tradeoffs explicitly.

### 9. "Fabrication is just following a recipe"
**Why:** Process flows look like cooking recipes (step 1: deposit oxide, step 2: spin photoresist, etc.)

**Correction:** Every process step has tolerances, and they accumulate. A 10% overetch on the release step could destroy devices; a 5% linewidth variation changes actuator force by 10%. MEMS design requires co-designing structure and process, understanding failure modes, and building in robustness. Show examples of process variation effects.

### 10. "Simulation will tell me if the device works"
**Why:** FEM tools produce beautiful color plots and students trust them blindly.

**Correction:** Simulation is essential but only as good as the model. Material properties at microscale can differ from bulk (residual stress, surface roughness, grain structure). Boundary conditions are often uncertain (is the anchor perfectly rigid? what's the damping?). Simulation should guide intuition and check calculations, but first-order analytical models and prototype testing are essential. Show examples where simulation missed key effects.

## Level Adjustments

### At Beginner Level
- Focus on **qualitative understanding** of scaling and devices
- Fewer equations, more SEM images and videos
- Simple examples: cantilever, parallel plate capacitor, piezoresistor
- Skip: pull-in derivation, quadrature error, process integration details
- Goal: appreciation for why MEMS are different and where they're used

### At Intermediate Level (this curriculum)
- **Quantitative analysis** using dimensional analysis and first-principles models
- Derive key results: pull-in voltage, resonant frequency, piezoresistive sensitivity
- Understand process flows and fabrication constraints
- Compare transduction mechanisms with metrics (sensitivity, linearity, power)
- Real device case studies: accelerometer, gyroscope, DMD
- Goal: design simple MEMS devices and understand tradeoffs

### At Advanced Level
- **Deep dives** into advanced topics: squeeze-film damping, anisotropic materials, nonlinear dynamics
- FEM simulation and multiphysics coupling
- MEMS-CMOS co-design and readout circuit design
- Advanced packaging: TSVs, wafer-level packaging, VCSEL integration
- Reliability physics: time-dependent dielectric breakdown, creep, wear
- Research frontier: NEMS, quantum MEMS, energy harvesting
- Goal: research-level understanding and novel device development

## Rabbit Holes (Fascinating Connections)

### The Casimir Effect and Stiction
At gaps below ~10 nm, quantum vacuum fluctuations create an attractive force (Casimir effect). This is usually negligible compared to van der Waals forces, but for ultra-clean surfaces in vacuum, it can be measurable. Mention when discussing stiction to blow students' minds about quantum effects in everyday devices.

**When to drop:** Lesson 8 (surface micromachining and stiction)

### Scaling Laws in Biology
Insect flight, bacterial swimming, and cellular mechanics all follow the same scaling laws as MEMS. Insects operate at intermediate Reynolds numbers (10-100) where both inertial and viscous forces matter. Bacteria operate at Re ~ 10⁻⁴ where viscous forces dominate completely — swimming requires breaking time-reversal symmetry (scallop theorem). MEMS often operate in this regime too.

**When to drop:** Lesson 3 (Reynolds number and viscous damping)

### Buckyballs as MEMS
Carbon nanotubes and fullerenes can act as NEMS resonators with frequencies in GHz range. The stiffness comes from covalent bonds (strongest possible springs), and mass is just the carbon atoms. These push MEMS scaling laws to the ultimate limit. Some reach quantum ground state oscillations.

**When to drop:** Lesson 14 (resonant sensing)

### MEMS in Space
MEMS accelerometers flew on Gravity Probe B to measure frame dragging (general relativity). MEMS are also used in CubeSats for attitude control. The vacuum of space is great for high-Q resonators, but thermal cycling and radiation are challenges. Space MEMS need special packaging and materials.

**When to drop:** Lesson 12 (accelerometers) or Lesson 21 (IMUs)

### DLP Projectors and the History of MEMS
TI's Digital Micromirror Device was a killer app that justified billions in MEMS investment. Each chip has >2 million tiny mirrors that flip thousands of times per second. The mirrors are only 10 μm across and tilt ±12°. This is one of the most complex MEMS devices ever mass-produced. The story of its development (Larry Hornbeck at TI) is fascinating — it took decades to get from lab to product.

**When to drop:** Lesson 19 (DMD)

### DNA Sequencing and Microfluidics
Modern sequencing (Illumina, Oxford Nanopore) uses microfluidics to parallelize millions of reactions. Each droplet is a tiny reactor. This is biology meets MEMS. The lab-on-chip idea has revolutionized genomics, point-of-care diagnostics, and drug discovery.

**When to drop:** Lesson 23 (microfluidics)

### Residual Stress and Film Buckling
Deposited thin films almost always have residual stress (from lattice mismatch, thermal expansion mismatch, ion bombardment). Tensile stress makes structures pull tight; compressive stress makes them buckle. Engineered buckling can create 3D shapes from 2D fabrication. Some MEMS switches use snap-through buckling for actuation.

**When to drop:** Lesson 8 (surface micromachining) or Lesson 25 (reliability)

### Acoustic Metamaterials
Arrays of MEMS resonators can create acoustic metamaterials with negative effective density or bulk modulus, enabling sub-wavelength focusing and acoustic cloaking. This is a hot research area connecting MEMS, photonics, and metamaterials.

**When to drop:** Lesson 14 (resonant sensing) or as a wild card

### The RF MEMS Switch Hype and Disappointment
In the 2000s, RF MEMS switches were supposed to replace PIN diodes and FETs in cell phones. They had near-zero loss and high isolation. But reliability was terrible (stiction, dielectric charging, contact wear). After billions in investment, they mostly failed to penetrate the market. A cautionary tale about reliability challenges.

**When to drop:** Lesson 25 (reliability) as a case study

## Difficulty Progression Notes

### Early Lessons (1-4): Accessible Entry
Start with concrete questions ("Why do tiny things behave differently?") and build intuition through examples. Difficulty 2-3. The thermal time constant lesson (4) is easier than the Reynolds number lesson (3) because students have better intuition for heating/cooling.

### Fabrication Arc (5-9): Ramping Up
Photolithography is straightforward (difficulty 2), but anisotropic wet etching (lesson 7) and surface micromachining (lesson 8) are conceptually harder (difficulty 4) because they require 3D visualization and understanding selectivity. Lesson 9 is a review to consolidate.

### Sensing Arc (10-15): Sustained Challenge
Piezoresistive and capacitive sensing start at difficulty 3 (students have relevant background from circuits/E&M). Piezoelectric sensing is harder (difficulty 4) because the physical mechanism is less familiar. Resonant sensing is also difficulty 4 because it requires understanding Q factor and frequency domain behavior. Lesson 15 review brings it back to 1.

### Actuation Arc (16-19): Peak Difficulty
Pull-in instability (lesson 16) is the hardest concept in the curriculum (difficulty 4) — nonlinear dynamics, energy methods, bifurcation. Comb drives (17) and thermal actuation (18) are easier (difficulty 3) by comparison. DMD (19) is difficulty 3 — real device complexity.

### Devices Arc (20-23): Second Peak
Gyroscopes (lesson 20) are the single hardest topic (difficulty 5) because they combine Coriolis effect, vibratory dynamics, mode coupling, and subtle error sources. IMU integration (21) is much easier (difficulty 2) because it's about combining sensors. Review (22) consolidates. Microfluidics (23) is moderate (difficulty 3).

### Closing Arc (24-25): Practical Wrapup
Packaging and reliability are difficulty 2-3. Important but more descriptive than analytical. Ends on a practical note: "How do you actually build and deploy these devices?"

## Engagement Strategies

- **Use analogies**: Electrostatic actuation is like a tunable spring. Gyroscopes are like throwing a ball on a merry-go-round.
- **Show real data**: Actual SEM images, measured frequency responses, capacitance-vs-displacement curves.
- **Historical context**: How MEMS went from lab curiosity (1980s) to billion-unit industry (airbag accelerometers in 1990s, smartphone IMUs in 2000s).
- **Failure analysis**: What went wrong in RF MEMS switches? Why did early gyroscopes drift?
- **Hands-on possibilities**: If student has access to COMSOL or similar, run simple simulations (parallel plate actuator, comb drive). If not, use online calculators for cantilever beams, resonant frequency, etc.

## Assessment Ideas

- **Design challenge**: Design a piezoresistive pressure sensor for automotive tire pressure monitoring. Specify geometry, materials, sensitivity, range.
- **Troubleshooting**: A student releases a surface-micromachined cantilever and it sticks to the substrate. What are three possible causes and mitigation strategies?
- **Comparison**: Compare piezoresistive vs capacitive sensing for a 3-axis accelerometer. Which is better for low-g measurement? High-g shock? Low power?
- **Scaling exercise**: A macroscale diving board has natural frequency 2 Hz. If you scale it down 1000× in all dimensions, what's the new frequency? (Answer: 2 kHz, because ω ∝ √(k/m) and k/m ∝ 1/L²)
- **Process flow**: Design a simple surface micromachining process to create a cantilever beam with piezoresistor. List all deposition, lithography, and etch steps.
