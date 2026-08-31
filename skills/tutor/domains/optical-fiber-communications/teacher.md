# Optical Fiber Communications — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 12 lessons (44%)
- **Socratic questions** — 4 lessons (15%)
- **real-world application challenges** — 4 lessons (15%)
- **review and consolidation sessions** — 4 lessons (15%)
- **curated resource exploration** — 2 lessons (7%)
- **teach-back exercises (student explains)** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 41% accessible (1-2), 33% standard (3), 26% challenging (4-5).

Difficulty peaks:
- Day 16: "How does QPSK let you pack more bits per symbol?" (difficulty 4)
- Day 17: "Design a WDM system for a cross-country fiber link" (difficulty 4)
- Day 21: "Where does noise come from, and how bad is it?" (difficulty 4)
- Day 22: "How do you predict how many bit errors you'll get?" (difficulty 4)
- Day 23: "Build a complete link budget for a real fiber deployment" (difficulty 4)

## Domain Hooks
- **Solitons in optical fibers** — Pulses that maintain their shape by balancing dispersion and nonlinearity. Show the Zabusky-Kruskal video or a simulation. Connect to KdV equation and integrable systems (for math-heavy students).

- **Fiber optics and music** — Dispersion is like different instruments in an orchestra playing the same note but arriving at different times. Use this analogy when introducing chromatic dispersion.

- **The telecom wavelength windows** — Why 1310 nm and 1550 nm? Historical accident based on silica fiber loss curve and availability of lasers. Show the loss spectrum and explain the O, E, S, C, L bands. Students love the "accidental" engineering story.

- **Submarine cables** — Modern internet infrastructure relies on fiber optic cables crossing oceans. Show a map (https://www.submarinecablemap.com) and discuss how EDFA spacing and repair logistics drive system design. Makes WDM and amplifiers tangible.

- **Photonic integrated circuits** — The future of opti

## Common Failure Modes
1. **"Light just bounces around like a mirror inside the fiber"** — This ray-optics picture is useful for intuition but breaks down quickly. Students need to understand that light actually propagates in discrete modes, which are solutions to Maxwell's equations. The transition from ray to wave theory is critical and often glossed over.

2. **"Single-mode fiber is simpler than multi-mode fiber"** — Counterintuitive! Single-mode fiber actually requires tighter tolerances and more sophisticated components, but it avoids modal dispersion. Students often think "one mode = easier" but the manufacturing and coupling challenges are greater.

3. **"Dispersion is just about different colors traveling at different speeds"** — Chromatic dispersion is one type, but modal dispersion (in multi-mode) and polarization mode dispersion (in single-mode) are distinct mechanisms. Students conflate these. Draw clear boundaries between the three types.

4. **"WDM is just like frequency division multiplexing i

## Vocabulary
Key terms for this domain: total internal reflection, refractive index, critical angle, ray optics, wave optics, modal theory, mode propagation, single-mode fiber, multi-mode fiber, V-parameter, cutoff wavelength, chromatic dispersion, modal dispersion, polarization mode dispersion, pulse broadening (and 87 more).