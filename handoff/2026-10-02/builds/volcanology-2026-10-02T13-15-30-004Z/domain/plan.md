# Volcanology — Curriculum Plan

## Scope
This is a process-based introduction to physical volcanology for an intermediate learner: someone with high-school chemistry and physics (density, pressure, phase changes), comfortable algebra, and optionally a little Python. It works through one causal chain: **why magma forms → how it behaves → how it erupts → what it builds and destroys → how we watch it → how societies live with it.**

**In scope:**
- Plate-tectonic settings of volcanism
- Melting mechanisms
- Magma composition, viscosity and volatiles
- Fragmentation and eruption styles, including the Volcanic Explosivity Index (VEI)
- Lava flows, tephra, pyroclastic density currents (PDCs) and lahars
- Volcano types and landforms
- Monitoring through seismicity, deformation and gas
- Forecasting, hazard and risk
- Climate effects
- A short look at volcanism on other planets

**Out of scope (or touched on only as rabbit holes):**
- Detailed igneous petrology and thermodynamics, including phase diagrams beyond a qualitative level
- Geochemical isotope systematics
- Regional tectonic histories (the South China granitoid literature in the research set is too specialised)
- Numerical methods such as smoothed particle hydrodynamics (SPH) and finite-volume flow solvers, mentioned only as 'how models work' context
- Formal seismology mathematics such as Fourier analysis and waveform inversion

**Prerequisites:**
- High-school chemistry (elements, oxides, gases dissolving under pressure)
- Basic physics (pressure, density, buoyancy)
- Algebra and reading graphs
- Optional: basic Python, for one hands-on monitoring lesson

**Exit criteria.** The student can:
1. Explain why volcanoes cluster at subduction zones, rifts and hotspots, and name the melting mechanism at each.
2. Predict an eruption's likely style from magma composition, temperature, crystal content and volatile content.
3. Explain viscosity's control on eruption style and roughly estimate relative viscosities.
4. Classify an eruption with VEI and tell its products apart: lava, tephra, PDCs, lahars.
5. Read a volcano's form and deposits to infer its eruptive history.
6. Interpret basic monitoring signals (earthquake swarms, inflation, SO2/CO2 changes) and explain why forecasting is probabilistic.
7. Read a hazard map and analyse a historical case study (Pinatubo 1991, Nevado del Ruiz 1985, Tambora 1815) for both its science and its human factors.
8. Explain how large eruptions affect climate.

## Module Structure
The seven modules follow the causal chain, so each one answers a question the previous one raises.

1. **Where and Why Volcanoes Form.** Tectonic settings and melting mechanisms. Without this, everything later is just a list of facts. It opens with the counterintuitive hook that the mantle is mostly solid, so volcanoes need special conditions to melt rock.
2. **Magma: The Engine.** Composition, viscosity and volatiles. This is the conceptual core and the main gate: almost every later prediction depends on 'silica + water + crystals → viscosity → explosivity'.
3. **Eruptions and Their Products.** Fragmentation, effusive versus explosive eruptions, VEI, lava flows, tephra and plumes, and PDCs. This is where the physics from Module 2 produces visible results.
4. **Reading Volcanoes: Landforms and Deposits.** Shields, stratovolcanoes, calderas, monogenetic fields, and how deposits record history. This module is short and consolidating. It applies Modules 2–3 in a new context, which counts as repetition with refinement.
5. **Monitoring and Forecasting.** Seismicity, ground deformation (GPS and InSAR), gas geochemistry and forecasting under uncertainty. It includes an optional hands-on look at real open-source monitoring tools.
6. **Hazards, Risk and Society.** Lahars, hazard maps, risk communication, case studies and climate effects. This module ties the science to human consequences.
7. **Synthesis.** Volcanism on other planets, then a capstone 'be the volcano observatory' scenario that uses every module.

Review lessons are built into modules (after lessons 6, 12, 18 and 25) rather than kept as separate modules. Module 7's capstone is the final cumulative review.

## Pedagogical Decisions
- **Intuition first, light quantification second.** Each mechanism is anchored in a familiar analogy before any numbers appear:
  - shaken soda bottle → volatile exsolution
  - honey versus water → viscosity
  - pressure cooker → decompression
  - wet clothes drying → flux melting lowering the melting point

  Then add order-of-magnitude numbers, for example viscosity of basalt at about 10^2 Pa·s versus rhyolite at about 10^8 Pa·s.
- **One master variable.** Viscosity, driven by silica, temperature, water and crystals, is the main thread from Module 2 onwards. The student should be able to reason 'composition → viscosity → gas escape → style' without prompting. The Giordano et al. (2008) viscosity model is the authoritative reference behind this, and its published calculator can be used for exploration.
- **Case studies as running examples rather than add-ons.** Kīlauea (effusive basalt), Mount St. Helens 1980 (lateral blast and dome), Pinatubo 1991 (successful forecast and climate cooling), Nevado del Ruiz 1985 (lahar disaster and communication failure) and Tambora 1815 ('year without a summer') reappear across modules. The student builds layered knowledge of a few volcanoes instead of shallow knowledge of many.
- **Process over taxonomy.** Rock names and eruption-type labels (Hawaiian, Strombolian, Vulcanian, Plinian) are introduced as positions on a spectrum, not as lists to memorise.
- **Uncertainty is part of the content.** Forecasting lessons stress probability, false alarms and decision-making, because this is where students' intuitions are most wrong.

## Resource Strategy
- **Authoritative reference texts:**
  - *Encyclopedia of Volcanoes* (Sigurdsson et al., 2000/2015; highly cited in the research set), used chapter by chapter
  - Lockwood & Hazlett, *Volcanoes: Global Perspectives*, at the right level
  - Parfitt & Wilson, *Fundamentals of Physical Volcanology*, for students who want more quantitative depth
- **Primary data portals as interactive resources:**
  - Smithsonian Global Volcanism Program (eruption database, VEI, weekly reports)
  - USGS Volcano Hazards Program (observatory updates, hazard maps, Pinatubo and St. Helens retrospectives)
  - INGV for Etna and Stromboli
- **Classic papers, used sparingly:** Giordano et al. 2008 on magma viscosity, used to show what a real model looks like. Research-level items in the set (SPH methods, X-ray computed tomography (CT) review) are optional rabbit holes, not core reading.
- **Code and tools (optional, for students who code), from the research set:**
  - REDPy (repeating-earthquake detection) and MSNoise (seismic velocity changes from ambient noise) for the monitoring lesson. Use them as 'look at what observatories run' demos, not required installs.
  - TITAN2D as a conceptual example of mass-flow modelling for the PDC and lahar lessons.
- **Visual media:** USGS and observatory footage and time-lapses of lava flows, PDCs and lahars, plus InSAR interferogram images. Volcanology is strongly visual, so most lessons should link at least one image or video.
- **Gap:** the research set leans toward highly cited methods papers and contains few introductory sources. The builder should fill resources from USGS, Smithsonian and textbook chapters rather than from the papers it lists.

## Exercise Strategy
Use a mixed format: multiple choice for vocabulary and classification, free text for reasoning chains.
- **Predict-the-eruption:** given magma properties (SiO2 %, temperature, water content, crystal fraction), predict the style and explain why. This is the main skill drill and recurs through Modules 2–4.
- **Classification (MC):** tectonic setting from a map, VEI from a plume height and erupted volume, deposit type from a description or photo.
- **Order-of-magnitude estimation:** how much faster does basalt flow than rhyolite, how long would an ash column take to reach the stratosphere, how much SO2 cools the globe by about 0.5 °C?
- **Data interpretation:** read a seismicity timeline, a GPS uplift plot or an SO2 flux chart and say what is happening underground. Students who code can optionally inspect real data or REDPy output.
- **Decision scenarios:** 'You are the observatory chief. Here are the signals. Do you recommend evacuation?' This is open-ended and has no single right answer; it is graded on reasoning under uncertainty.
- **Teach-back:** explain to a friend why Hawaiian volcanoes rarely explode while Pinatubo did.
- **Case-study analysis:** what went right or wrong at Pinatubo versus Nevado del Ruiz, and why?

## Pacing
- **About 31 lessons**, each a 3–5 minute read, at roughly one per weekday, so about 6–7 weeks.
- **Difficulty curve:**
  - Starts at 2 (tectonic settings feel familiar).
  - Climbs to 3–4 in Module 2, where viscosity and volatiles are the hardest conceptual gate.
  - Peaks at 4 in Module 3 (fragmentation, PDC dynamics) and Module 5 (interpreting monitoring signals, forecasting under uncertainty).
  - Eases to 3 in Module 6 as application takes over.
  - Ends with a level-4 capstone.
- **Consolidation points:**
  - Review lessons at about 6, 12, 18 and 25.
  - Module 4 is itself a consolidation module, applying Module 2–3 ideas to landforms.
  - The capstone is the final cumulative review.
- **Mix of delivery types:** use every type across the curriculum, with no more than two of the same type in a row. Real-world lessons are most common in Modules 3 and 6, question and teach-back lessons in Module 2, and resource-drop lessons (data portals, monitoring tools) in Module 5.
- **Adaptation:** if the student struggles with the viscosity–explosivity link, split Module 2's viscosity lesson in two and add a predict-the-eruption drill before Module 3. If the student coasts, add optional depth from the Giordano model or Parfitt & Wilson calculations.