# Vintage synthesizer circuits — analog oscillators and filters — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 9 lessons (35%)
- **real-world application challenges** — 4 lessons (15%)
- **Socratic questions** — 4 lessons (15%)
- **review and consolidation sessions** — 4 lessons (15%)
- **teach-back exercises (student explains)** — 3 lessons (12%)
- **curated resource exploration** — 2 lessons (8%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 46% accessible (1-2), 38% standard (3), 15% challenging (4-5).

Difficulty peaks:
- Day 10: "Build a simple VCO on paper — can you identify all the stages?" (difficulty 4)
- Day 18: "How do state-variable filters give you multiple outputs simultaneously?" (difficulty 4)
- Day 20: "Design a simple voltage-controlled lowpass filter — what are the key stages?" (difficulty 4)
- Day 25: "How would you modify a classic VCO or VCF to improve performance?" (difficulty 4)

## Domain Hooks
- **Analog computing and synthesizers** — Drop this in during integrator circuits (lesson 9): integrators and summers are the foundation of analog computers. Synthesizers are essentially *musical* analog computers. Early Moog and Buchla drew on analog computer design.

- **Log-antilog amplifiers in audio processing** — When discussing exponential converters (lesson 2-3): the same log-antilog technique is used in dbx and Dolby noise reduction, compressors, and VCAs. It's a fundamental analog signal processing building block.

- **The physics of transistor temperature dependence** — During lesson 11 (temperature drift): the 2mV/°C VBE temperature coefficient comes from fundamental semiconductor physics (bandgap, thermal voltage kT/q). Can connect to solid-state physics if student is curious.

- **Why does the Moog filter "sound like a Moog"?** — Drop during lesson 14-16: the transistor ladder's soft clipping behavior (tanh nonlinearity), the interaction between resonance and input drive,

## Common Failure Modes
1. **"1V/octave is a linear control scheme"**
   - **Why it happens**: The name suggests linearity, and students conflate linear voltage input with linear frequency output
   - **How to correct**: Emphasize that musical pitch is inherently logarithmic (octaves = doubling). The 1V/octave standard provides a *linear voltage scale* that maps to a *logarithmic frequency scale*. Draw the V-to-f curve explicitly.

2. **"Temperature drift is just a calibration issue"**
   - **Why it happens**: Students think they can just "tune it" and it'll stay stable
   - **How to correct**: Show that VBE changes ~2mV/°C, which translates to significant frequency drift. Explain that compensation must be built into the circuit topology, not just adjusted at trim time.

3. **"All filters just remove frequencies"**
   - **Why it happens**: Early education focuses on ideal brick-wall frequency response
   - **How to correct**: Emphasize that vintage filters are *musical processors*: resonance creates emphasis 

## Vocabulary
Key terms for this domain: control voltage, modular synthesis, 1V/octave standard, exponential converter, V/octave, logarithmic frequency, temperature compensation, matched transistor pairs, trimming and calibration, differential pairs, current mirrors, component matching, CV review, exponential conversion, current source (and 72 more).