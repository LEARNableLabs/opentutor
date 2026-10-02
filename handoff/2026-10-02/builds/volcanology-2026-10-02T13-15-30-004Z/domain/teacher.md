# Volcanology — Domain Teaching Config

## Exercise Types
- **Predict-the-eruption:** give composition, temperature, water content and crystal content, and ask the student to predict viscosity, gas escape and eruption style. This is the central exercise of the course.
- **Cause-and-effect chains:** ask the student to trace a path such as subduction → water release → flux melting → silica-rich magma → explosive eruption.
- **Order-of-magnitude estimation:** compare viscosities (basalt around 10^2 Pa·s versus rhyolite around 10^8 Pa·s), and ask what a factor of a million changes.
- **Data interpretation:** read an earthquake swarm plot, a GPS or InSAR inflation curve or an SO2/CO2 time series, and say what it suggests and what it does not.
- **Map and deposit reading:** use hazard maps, photos of deposits and cross-sections to infer eruptive history.
- **Case-study debate:** argue a decision at Pinatubo 1991 or Nevado del Ruiz 1985 (evacuate or wait) under uncertainty.
- **Scenario capstone:** 'be the volcano observatory', combining monitoring data, hazards and communication.
- **Optional light coding:** one Python lesson that reads an open monitoring tool or plots a toy time series.

## Exercise Format Preference
Mixed. Use multiple choice for vocabulary, tectonic settings and classification (VEI, products). Use free-text reasoning for the causal chain, forecasting and case studies, where the quality of the reasoning matters more than the answer. The student model may override this for a struggling student.

## Resource Types
- Observatory pages and databases (USGS, Smithsonian GVP, INGV) for real, current data.
- Photos, maps, diagrams and eruption footage. Volcanology is a visual field.
- Short videos and animations for processes that are hard to picture (bubble growth, plume rise, pyroclastic flows).
- Reference text (Encyclopedia of Volcanoes) as the backing source, with only short excerpts for the student.
- Open-source code repositories, used sparingly and only for the optional hands-on lesson.
- Primary papers for rabbit holes only. Summarise them instead of assigning them.

## Difficulty Curve
- **Module 1 (tectonic settings and melting):** moderate. The counterintuitive idea is that the mantle is mostly solid, so melting needs a trigger: decompression, added water (flux) or added heat. Confusing these three mechanisms is the usual first stumble.
- **Module 2 (magma, viscosity, volatiles):** the hardest and most important gate. Do not advance until the student can reason from composition to viscosity to gas escape to style. Spend extra time here and revisit it often.
- **Module 3 (eruptions and products):** moderate to hard. It applies Module 2, so weakness shows up here. Pyroclastic density currents versus tephra fall is a common confusion.
- **Module 4 (landforms and deposits):** easier and consolidating. Use it to repeat Modules 2 and 3 in a new context.
- **Module 5 (monitoring and forecasting):** hard in a different way. The difficulty is probabilistic thinking, not new physics.
- **Module 6 (hazards, risk, society):** moderate. The challenge is combining science with human factors.
- **Module 7 (synthesis):** cumulative. The capstone should need every module.
- Place review lessons after lessons 6, 12, 18 and 25, and retest the viscosity chain in each of them.

## Domain Hooks
- The mantle is mostly solid, yet volcanoes exist. Why?
- A shaken soda bottle is a working model of an explosive eruption.
- Same planet, same rock, yet Kīlauea oozes and Pinatubo blows up the sky. The difference is a handful of variables.
- The 'year without a summer' (1816) after Tambora, and Pinatubo's measurable global cooling.
- Forecasts that worked (Pinatubo 1991) versus warnings that failed to reach people (Nevado del Ruiz 1985, about 23,000 deaths).
- Real, live data: students can look at today's Kīlauea or Etna reports.
- Volcanoes on other worlds, such as Io, the most volcanically active body in the solar system.

## Common Failure Modes
1. **Treating the Earth's interior as a pool of liquid magma.** Most of the mantle and crust is solid. Magma is rare and local. Correct this early and revisit it.
2. **Thinking hotter always means more explosive.** Explosivity depends mostly on viscosity and volatiles, and basalt is usually hotter than rhyolite. Use this as a deliberate counterexample.
3. **Confusing lava with tephra and pyroclastic flows.** Make students name the product and its transport mechanism.
4. **Equating a high VEI with a more dangerous volcano.** Lahars and small eruptions can kill more people than large ones, as at Nevado del Ruiz.
5. **Expecting forecasts to be yes or no.** Reinforce probability, false alarms and the cost of both errors.
6. **Memorising eruption-type names as a list.** Keep returning to the spectrum and the variables behind it.
7. **Thinking all volcanoes are cone-shaped mountains.** Calderas, fissures and monogenetic fields break this picture.
8. **Assuming more earthquakes always means an imminent eruption.** Signals are ambiguous, and some unrest ends without eruption.

## Vocabulary
- **Use freely:** magma, lava, eruption, vent, crater, ash, plate boundary, subduction, rift, hotspot, viscosity, gas, earthquake, caldera, lahar.
- **Define carefully when first used:** flux melting, decompression melting, exsolution, vesiculation, fragmentation, tephra, pyroclastic density current, VEI, effusive and explosive, silica content, felsic and mafic, inflation and deflation, InSAR, volcanic tremor, SO2 flux, hazard versus risk.
- **Use only for rabbit holes or avoid:** detailed phase diagrams, isotope systematics, the Navier-Stokes equations, Fourier analysis of seismic waveforms, and specialised petrology names beyond basalt, andesite, dacite and rhyolite.
- Keep 'hazard' (the threat) and 'risk' (the threat combined with exposure and vulnerability) strictly separate from the moment they are introduced.
- Say 'pyroclastic density current' on first use and link it to the more familiar 'pyroclastic flow'.
