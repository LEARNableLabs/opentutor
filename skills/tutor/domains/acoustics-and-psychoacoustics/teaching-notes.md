# Acoustics and Psychoacoustics — Teaching Notes

## Approach

This topic lives at the intersection of physics, biology, and perception — teach it as a bridge between objective measurements and subjective experiences. At intermediate level, emphasize **demonstrations over derivations**: students should *experience* psychoacoustic phenomena through audio examples before diving into mechanisms. Balance quantitative rigor (equations, graphs) with qualitative insight (why our perception differs from measurement). The topic is naturally interdisciplinary; leverage connections to music, audio engineering, speech, and neuroscience to maintain engagement.

## Common Misconceptions

1. **"Pitch and frequency are the same thing"** — Students conflate the physical stimulus (frequency) with the perceptual response (pitch). The missing fundamental illusion is the best corrective: hearing a pitch at 200 Hz when only 400, 600, 800 Hz are present proves pitch is a constructed perception, not a direct readout of frequency. Emphasize that frequency is measurable with a microphone; pitch is what the brain computes.

2. **"Doubling the intensity doubles the loudness"** — Linear intuitions about perception are pervasive. Demonstrate that a 10 dB increase (10× intensity) is perceived as roughly a doubling in loudness, not a 10× increase. Use the example of adding one more violin to a string section: you need to double the number of instruments (double the power) to get a 3 dB increase, which is barely noticeable.

3. **"The cochlea is a passive microphone"** — Students initially imagine the ear as a simple transducer. Correct this by emphasizing the cochlea's active amplification (outer hair cells), nonlinear compression, and its role as a mechanical spectrum analyzer. The basilar membrane is not a sensor; it's a frequency decomposer.

4. **"Sound localization works like vision (you just 'see' where it is)"** — Students underestimate the computational complexity. Humans solve an ill-posed inverse problem using multiple cues (ITD, ILD, HRTF) that each have ambiguities. The cone of confusion and front/back errors demonstrate this isn't trivial.

5. **"High frequencies are always louder than low frequencies at the same dB SPL"** — Equal-loudness contours show this is backward: we're *less* sensitive at very low and very high frequencies, most sensitive around 2-4 kHz. This is why bass instruments need more power to achieve the same perceived loudness.

6. **"Masking only affects sounds at the same frequency"** — Students initially think masking is narrow. Demonstrate upward spread of masking: a loud low-frequency tone masks higher frequencies much more than the reverse. This is why thunder masks birdsong but birdsong doesn't mask thunder.

7. **"The ear analyzes all frequencies equally well"** — Critical bandwidth is not constant in Hz; it's roughly constant in fractions of an octave (ERB scales). This means frequency resolution is better at low frequencies (in Hz terms) and coarser at high frequencies.

8. **"Temporal resolution and frequency resolution are independent"** — The uncertainty principle applies: better frequency resolution requires longer analysis windows, trading off temporal resolution. This is fundamental to auditory perception and to time-frequency analysis (spectrograms).

9. **"All sounds with the same harmonics sound the same"** — Spectral envelope (which harmonics are emphasized) determines timbre, not just which harmonics are present. A clarinet and oboe have different spectral envelopes, making them distinguishable even when playing the same fundamental.

10. **"MP3 compression just removes high frequencies"** — Perceptual coding is far more sophisticated: it exploits both simultaneous and temporal masking across all frequency bands. This is applied psychoacoustics, removing content that's present but inaudible.

## Level Adjustments

### At intermediate level:
- **Mathematical depth**: Use equations when they clarify (e.g., dB = 20 log₁₀(p/p₀)) but don't derive wave equations or differential equations for the basilar membrane. Fourier analysis is conceptual, not computational.
- **Anatomy vs. function**: Cover cochlear anatomy enough to understand function (basilar membrane, hair cells, tonotopic mapping) but skip histology and molecular-level transduction channels. Focus on what these structures *do* for perception.
- **Quantitative psychophysics**: Introduce key curves (equal-loudness, masking functions) but don't require memorizing threshold values. Emphasize shapes and trends over specific numbers.
- **Applications**: Lean into music production, audio engineering, and speech perception applications. Intermediate students often have hobbies or career interests here; use those connections.

### Comparison to other levels:
- **Beginner**: Would focus almost entirely on demonstrations and qualitative descriptions. Less anatomy, more "what does it sound like?"
- **Advanced**: Would include wave mechanics derivations, hair cell biophysics, computational models of pitch perception, detailed psychometric functions, and statistical analysis of psychophysical experiments. Would also cover pathology and clinical applications in depth.

## Rabbit Holes

- **Nonlinear dynamics in the cochlea** — The cochlea exhibits compression, distortion products, and even chaotic oscillations. Otoacoustic emissions are sounds *produced by the ear itself*. Drop this in when discussing active hearing mechanisms (lesson 8-9).

- **Virtual pitch and music theory** — The missing fundamental explains why bass-light laptop speakers can still convey bass notes (you hear the implied fundamental from harmonics). Connect to lesson 13-16 on pitch perception.

- **Cocktail party problem** — How do we separate one voice from many? This is unsolved in computational auditory scene analysis but connects to masking (lesson 19) and spatial hearing (lessons 21-23).

- **Auditory illusions** — Shepard tones (infinitely ascending pitch), tritone paradox, McGurk effect (vision influences auditory perception). These are engaging "party tricks" that reveal processing principles. Sprinkle throughout for engagement.

- **Binaural beats and auditory driving** — Presenting slightly different frequencies to each ear creates a perceived beat at the difference frequency, generated *in the brain*, not in the air. Connects to neural encoding (lesson 10) and binaural hearing (lesson 21).

- **Evolutionary aspects** — Why are we most sensitive at 2-4 kHz? This is the frequency range of infant cries and vocal formants. Why is ITD more reliable at low frequencies and ILD at high frequencies? Wavelength physics. Connects physics to biology to evolution.

- **Audio compression and streaming** — How does Spotify's Ogg Vorbis differ from Apple's AAC? Both use psychoacoustic models but with different tradeoffs. Great application for lesson 25.

## Difficulty Progression

**Phase 1 (Lessons 1-6)**: Foundation in physical acoustics. Start accessible (what is a sound wave?) and build to moderate difficulty (interference, spectrum analysis). Students with music or physics backgrounds will find this familiar; others need grounding here.

**Phase 2 (Lessons 7-11)**: Auditory anatomy and physiology. Difficulty ramps up with cochlear mechanics (lesson 9 is a peak). The teach-back (lesson 11) consolidates before moving to perception.

**Phase 3 (Lessons 13-19)**: Core psychoacoustics. This is conceptually challenging because it requires holding both physical and perceptual perspectives simultaneously. Masking (lesson 19) is a difficulty peak requiring integration of frequency selectivity, loudness, and critical bandwidth.

**Phase 4 (Lessons 21-23)**: Spatial hearing. Moderate difficulty; students find ITD/ILD intuitive but HRTF and cone of confusion require spatial reasoning.

**Phase 5 (Lessons 24-26)**: Advanced applications. Temporal masking and perceptual coding (lesson 25) is the hardest lesson, requiring integration of nearly everything prior. The final teach-back lets students apply what they've learned creatively.

**Review days (12, 20)** provide consolidation before complexity increases. Each follows ~5-7 lessons and sits at difficulty 1 to reset cognitive load.
