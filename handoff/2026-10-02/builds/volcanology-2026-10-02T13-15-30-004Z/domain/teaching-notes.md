# Volcanology — Teaching Notes

## Approach

Volcanology is a process science: every observable, from the shape of a cone to an ash cloud over Europe, is the end of a causal chain that starts with how rock melts. Teach intuition first, then light quantification. Anchor each mechanism in a familiar analogy before introducing order-of-magnitude numbers:

- shaken soda → exsolution
- honey versus water → viscosity
- a lid coming off a pressure cooker → decompression
- salt melting ice → flux melting

Then make the student run the chain forward ('given this magma, what happens?') and backward ('given this deposit, what magma was it?'). The subject is highly visual, so link real footage or images in most lessons.

Use a small cast of recurring case studies and return to each one in several modules:

- **Kīlauea:** effusive basalt and monitoring
- **Mount St. Helens 1980:** lateral blast, PDCs, a dome and a stratovolcano
- **Pinatubo 1991:** Plinian eruption, a successful forecast and climate cooling
- **Nevado del Ruiz 1985:** lahars and a failure of communication
- **Tambora 1815:** VEI 7 and the Year Without a Summer

The student should finish knowing these five volcanoes in depth rather than fifty superficially.

## Common Misconceptions

1. **'The mantle is an ocean of molten magma.'** Diagrams with orange interiors and the phrase 'molten core' cause this. *Correction:* the mantle carries seismic shear (S) waves, which cannot travel through liquids, so it is solid. It flows slowly by creep over millions of years, and melt makes up only small fractions in special places. Address this in Lesson 1 and come back to it whenever a student says magma 'comes up from the mantle layer'.
2. **'Rock melts because it gets hotter.'** This is the everyday intuition from stoves. *Correction:* most of Earth's magma forms by lowering pressure (decompression) or by lowering the melting point (flux melting). Use the geotherm–solidus sketch: move the rock, or move the curve.
3. **'Hotter magma is more explosive.'** Students link heat with violence. *Correction:* the hottest magma (basalt, about 1,100–1,200 °C) is usually the least explosive. Cooler, silica-rich magma is viscous and traps gas. Drill this with predict-the-eruption problems.
4. **'The gas is already sitting as bubbles in the chamber.'** *Correction:* at depth most volatiles are dissolved in the melt, like CO2 in a sealed soda bottle. They come out of solution during ascent as pressure drops. Explosivity depends on whether those new bubbles can escape.
5. **'Lava is what kills people.'** Films are the source of this. *Correction:* lava usually moves at walking pace or slower and mostly destroys property. Historically, PDCs and lahars have caused most volcanic deaths (Mount Pelée 1902, Armero 1985). Correct this before Module 6 so students rank hazards properly.
6. **'Volcanic ash is like soot from a fire.'** *Correction:* ash is pulverised rock and volcanic glass, which is hard, abrasive and electrically conductive when wet. It can melt inside jet engines, whose operating temperatures exceed the melting point of the glass. That is why airspace closes.
7. **'VEI 6 is twice as big as VEI 3' or 'VEI measures deaths.'** *Correction:* VEI is roughly logarithmic, with each step about 10 times more erupted volume above VEI 2. It measures explosive size, not impact. Laki 1783 had a modest VEI but enormous effects because it was effusive and released a lot of gas.
8. **'Earthquakes under a volcano mean it will erupt' or 'a forecast that didn't happen means scientists were wrong.'** *Correction:* many unrest episodes end without an eruption (failed eruptions). Forecasts are probabilities, and a forecast that was never actually certain did not 'fail'. Make students state forecasts as probabilities with timescales.
9. **'Volcanoes cause global warming through CO2.'** *Correction:* large eruptions cool the planet for about 1–3 years through sulfate aerosols in the stratosphere. Annual volcanic CO2 is around 1% of human emissions or less. This contrast also opens a discussion of geoengineering.
10. **'Dormant means extinct' or 'supervolcanoes are overdue.'** *Correction:* eruptions are not periodic, so 'overdue' has no meaning. Long repose times can produce larger eruptions, as at Pinatubo after about 500 years.

## Level Adjustments

The student is at an intermediate level: comfortable with high-school chemistry and physics and with algebra.

- **Use real SI units and orders of magnitude freely:** Pa·s, MPa, km³, wt% H2O and SiO2 %. Exercises should ask for estimates such as 'about 10^6 times more viscous', not precise calculations.
- **Phase relations stay qualitative.** Use one geotherm–solidus sketch, not ternary diagrams or thermodynamic derivations.
- **Eruption-type labels** (Hawaiian, Strombolian, Vulcanian, Plinian) are points on a spectrum controlled by gas escape. Do not ask for definitions to be memorised.
- **Monitoring:** explain what each signal means physically. Skip Fourier analysis and waveform inversion. Treat REDPy and MSNoise as optional 'see what observatories actually run' demos for students who code. Never require an install.
- **Cite papers sparingly,** to show what a real model looks like: Giordano et al. (2008) for viscosity, and TITAN2D or smoothed particle hydrodynamics (SPH) for flow modelling. Textbook-level reasoning should carry the lessons.
- **Exercise formats:**
  - Multiple choice for classification: tectonic setting, VEI, deposit type
  - Free text for causal chains: predict the eruption, interpret the signals
  - Teach-backs for synthesis, in Lessons 21 and 29
- **Difficulty peaks:**
  - Lesson 9 (viscosity magnitudes)
  - Lesson 13 (fragmentation)
  - Lesson 25 (probabilistic forecasting)
  - Lesson 32 (capstone)

  If a student struggles at Lesson 9 or 13, hold them there. Modules 3–5 depend on those ideas.

## Rabbit Holes

- **Pliny the Younger's letters on Vesuvius, AD 79.** The first eyewitness account of an eruption, and the origin of the name 'Plinian'. Use with Lesson 14.
- **Tambora and Frankenstein.** The cold, stormy summer of 1816 kept Mary Shelley's circle indoors at Lake Geneva, where Frankenstein began. Use with Lesson 30.
- **Krakatoa 1883.** Its explosion was heard about 4,800 km away on Rodrigues Island, and its pressure wave circled the globe several times. Use with Lesson 14 or 16.
- **Benjamin Franklin and Laki 1783.** Franklin speculated that a 'dry fog' over Europe was linked to cold weather, which was an early guess at volcanic climate forcing. Use with Lesson 30.
- **Lake Nyos 1986.** A lake suddenly released dissolved CO2 and suffocated about 1,700 people. It is the soda-bottle analogy at full scale. Use with Lesson 24.
- **Pinatubo as a natural geoengineering experiment.** Proposals for solar geoengineering cite it. Use with Lesson 30 for an ethics discussion.
- **Surtsey, 1963.** An island born from the sea off Iceland, where scientists watched life colonise new land. Use with Lesson 3.
- **Io's lava lakes and Olympus Mons.** Other worlds test whether the Earth rules hold. Use with Lesson 31.
- **X-ray CT of pumice.** Researchers image bubble networks in 3D to study fragmentation (Cnudde & Boone 2013, Earth-Science Reviews). Use with Lesson 13.
- **Listening to volcanoes with ambient noise.** MSNoise tracks tiny drops in seismic velocity as a volcano pressurises, without needing any earthquakes. Use with Lesson 22.
- **Smoothed particle hydrodynamics (SPH).** The same particle method used for film special effects and astrophysics also models lava and pyroclastic flows (Monaghan 2005). Use with Lesson 17.