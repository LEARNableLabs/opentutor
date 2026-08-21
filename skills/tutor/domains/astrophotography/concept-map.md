# Astrophotography — Concept Map

## Core Concepts (in learning order)

1. **Celestial sphere** — the apparent dome of the night sky and how it rotates
2. **Earth's rotation** — why stars appear to move and trail in long exposures
3. **Light pollution** — artificial light that washes out faint celestial objects. Depends on: understanding of exposure and signal
4. **Bortle scale** — classification system for sky darkness
5. **Dark sky sites** — locations with minimal light pollution. Depends on: Bortle scale
6. **Planetarium software** — tools like Stellarium for simulating the night sky
7. **Moon phases** — lunar cycle and its impact on sky darkness. Depends on: celestial sphere
8. **Target visibility** — when and where celestial objects appear in the sky. Depends on: celestial sphere, moon phases
9. **Exposure triangle for astro** — balancing ISO, aperture, and shutter speed for night sky. Depends on: basic photography fundamentals
10. **Star trailing** — blur from Earth's rotation during long exposures. Depends on: Earth's rotation, exposure triangle
11. **500 rule / NPF rule** — formulas for maximum exposure time before star trailing. Depends on: star trailing
12. **Foreground interest** — compositional element grounding Milky Way shots
13. **Manual focus** — achieving sharp stars at night. Depends on: basic photography fundamentals
14. **Image stacking** — combining multiple exposures to improve signal-to-noise ratio. Depends on: exposure triangle
15. **Signal-to-noise ratio** — relationship between true signal and random noise. Depends on: image stacking
16. **Star tracking** — motorized mount that follows sidereal rate. Depends on: Earth's rotation, star trailing
17. **Sidereal rate** — rotation rate matching Earth's spin (one rotation per 23h 56m). Depends on: celestial sphere
18. **Polar alignment** — aligning mount's axis with celestial pole. Depends on: celestial sphere, star tracking
19. **Sub-exposure length** — individual frame duration in tracked imaging. Depends on: star tracking, exposure triangle
20. **ISO invariance** — camera characteristic where ISO can be applied in post. Depends on: exposure triangle
21. **Total integration time** — sum of all sub-exposures. Depends on: sub-exposure length, image stacking
22. **Dithering** — small random offsets between frames to suppress pattern noise. Depends on: image stacking
23. **Bahtinov mask** — diffraction tool for precise focusing. Depends on: manual focus
24. **Calibration frames** — dark, flat, and bias frames for removing artifacts. Depends on: image stacking
25. **Dark current** — thermal noise accumulating during exposure. Depends on: calibration frames
26. **Vignetting** — darkening at image corners. Depends on: calibration frames
27. **DeepSkyStacker / Siril** — software for stacking and calibration. Depends on: calibration frames, image stacking
28. **Histogram stretch** — non-linear transformation revealing faint details. Depends on: DeepSkyStacker workflow
29. **Linear data** — unstretched sensor data. Depends on: histogram stretch
30. **Gradient removal** — eliminating light pollution gradients. Depends on: histogram stretch
31. **Noise reduction** — reducing random noise while preserving detail. Depends on: signal-to-noise ratio, histogram stretch
32. **Narrowband imaging** — using filters to isolate specific emission lines. Depends on: total integration time, calibration frames
33. **Lucky imaging** — stacking best frames from high-frame-rate video. Depends on: image stacking
34. **Multi-session stacking** — combining data from multiple nights. Depends on: DeepSkyStacker workflow, registration

## Dependencies

### Foundation Layer
- **Celestial sphere** and **Earth's rotation** are the foundational concepts — everything in astrophotography flows from understanding how the sky moves.
- **Exposure triangle for astro** depends on general photography knowledge but adapts it for extreme low-light conditions.

### Wide-Field Layer
- **Star trailing** requires understanding both Earth's rotation and exposure duration.
- **500 rule** is a practical formula derived from star trailing physics.
- **Image stacking** is the key breakthrough that enables faint object detection by improving signal-to-noise ratio.

### Tracking Layer
- **Star tracking** solves the star trailing problem by mechanically compensating for Earth's rotation.
- **Polar alignment** is critical because any misalignment causes field rotation during long exposures.
- **Dithering** only makes sense after understanding how stacking suppresses noise.

### Processing Layer
- **Calibration frames** address systematic sensor errors — can't be understood without first knowing what you're trying to correct.
- **Histogram stretch** is the transformation that makes linear sensor data visually interpretable.
- **Gradient removal** depends on having stretched data where gradients are visible.
- **Noise reduction** must be done carefully after stretching to avoid destroying signal.

### Advanced Layer
- **Narrowband imaging** builds on tracked imaging and calibration frame mastery.
- **Multi-session stacking** requires understanding registration and normalization across different nights.

## Bottleneck Concepts

These concepts are gates that block progress if not mastered:

1. **Polar alignment** — without this, tracked imaging produces streaked stars no matter how good your other technique is
2. **Calibration frames** — skipping these means your stacked images retain thermal noise, vignetting, and dust shadows
3. **Histogram stretch** — linear data looks black to the human eye; this is the essential transformation
4. **Signal-to-noise ratio** — fundamental to understanding why we stack, what integration time means, and how noise reduction works

## Common Dependency Errors

Students often jump ahead before mastering prerequisites:

- Attempting **polar alignment** without understanding the **celestial sphere** leads to confusion about what "polar" means
- Trying **image stacking** without understanding **signal-to-noise ratio** makes it feel like magic rather than physics
- Applying **noise reduction** before **histogram stretch** destroys data in the linear domain
- Using **narrowband filters** without mastering **total integration time** leads to noisy, unusable data

## Prerequisite Topics

- **Exposure triangle** (aperture, shutter speed, ISO) — needed for: exposure triangle for astro, sub-exposure length
- **RAW format** — needed for: histogram stretch, linear data, calibration frames
- **Histogram reading** — needed for: histogram stretch, gradient removal, noise reduction
- **Layer masking** (Photoshop/GIMP) — needed for: selective noise reduction, advanced compositing
- **Basic trigonometry** — helpful for: 500 rule, NPF rule, field of view calculations
