# Crystallography — Concept Map

## Core Concepts (in learning order)

1. **Symmetry operations** — reflections, rotations, inversions that leave objects unchanged
2. **Periodicity** — repeating patterns in space; fundamental to crystal definition
3. **Crystallographic restriction** — only 2-, 3-, 4-, 6-fold rotations compatible with translational symmetry
4. **Point groups** — collections of symmetry operations around a fixed point (32 total)
5. **Lattice points** — infinite 3D array of points with identical environments. Depends on: periodicity
6. **Unit cell** — smallest repeating unit of a crystal structure. Depends on: lattice points
7. **Bravais lattices** — 14 distinct ways to arrange lattice points in 3D. Depends on: lattice points, symmetry operations
8. **Crystal systems** — 7 families classified by unit cell geometry. Depends on: unit cell, point groups
9. **Miller indices** — notation (hkl) for crystallographic planes. Depends on: unit cell, lattice points
10. **Glide planes** — reflection + translation symmetry element. Depends on: symmetry operations, periodicity
11. **Screw axes** — rotation + translation symmetry element. Depends on: symmetry operations, periodicity
12. **Space groups** — complete symmetry of periodic 3D structures (230 total). Depends on: point groups, Bravais lattices, glide planes, screw axes
13. **Hermann-Mauguin notation** — international notation for point and space groups. Depends on: space groups
14. **X-ray diffraction** — scattering of X-rays by periodic electron density. Depends on: periodicity
15. **Bragg's law** — condition for constructive interference (nλ = 2d sinθ). Depends on: X-ray diffraction
16. **Reciprocal lattice** — Fourier transform of real lattice; natural space for diffraction. Depends on: lattice points, X-ray diffraction
17. **Ewald sphere** — geometric construction for diffraction condition. Depends on: reciprocal lattice, Bragg's law
18. **Structure factor** — amplitude of diffracted wave from one unit cell. Depends on: unit cell, X-ray diffraction
19. **Atomic scattering factor** — X-ray scattering from a single atom. Depends on: X-ray diffraction
20. **Systematic absences** — missing reflections due to space group symmetry. Depends on: space groups, structure factor
21. **Phase problem** — intensities measured but phases lost in diffraction. Depends on: structure factor
22. **Patterson function** — autocorrelation of electron density; used for heavy atom location. Depends on: phase problem
23. **Direct methods** — statistical phase determination for small molecules. Depends on: phase problem
24. **Rietveld refinement** — whole-pattern fitting for powder diffraction. Depends on: powder diffraction
25. **Least squares refinement** — optimization of atomic positions and thermal parameters. Depends on: structure factor
26. **R-factor** — measure of agreement between observed and calculated data. Depends on: least squares refinement

## Dependencies

### Symmetry Foundation (Lessons 1-5)
- **Point groups** require understanding **symmetry operations** because point groups are mathematical groups formed by combining operations
- **Crystallographic restriction** limits which **symmetry operations** are compatible with **periodicity**
- Understanding why crystals must have certain symmetry types is foundational to all subsequent concepts

### Lattices & Crystal Systems (Lessons 6-11)
- **Bravais lattices** build on **lattice points** and **symmetry operations** — centering types arise from symmetry compatibility
- **Crystal systems** depend on **point groups** — each system has characteristic point group symmetries
- **Miller indices** require understanding **unit cell** geometry to describe planes and directions
- The 14 Bravais lattices → 7 crystal systems connection is a key conceptual bottleneck

### Space Groups (Lessons 12-16)
- **Space groups** combine **point groups** + **Bravais lattices** + **glide planes** + **screw axes**
- **Hermann-Mauguin notation** encodes the symmetry elements in a compact form
- This is often the hardest conceptual jump: moving from point symmetry to space symmetry
- International Tables for Crystallography is the key reference

### Diffraction & Reciprocal Space (Lessons 17-22)
- **Reciprocal lattice** is conceptually challenging — it's the Fourier transform of the real lattice
- **Bragg's law** provides a geometric interpretation of diffraction that's easier to visualize
- **Ewald sphere** construction unifies Bragg and Laue formulations
- **Structure factor** connects **space groups** to observed intensities via **systematic absences**
- This module requires strong 3D visualization skills

### Structure Determination (Lessons 23-26)
- **Phase problem** is the central challenge: we measure |F|² but need F (magnitude and phase)
- **Patterson function** uses only measured intensities to locate heavy atoms
- **Direct methods** use probabilistic relationships between structure factors
- **Refinement** iteratively improves the model to match observed data
- This module ties everything together into a practical workflow

## Prerequisite Topics

- **Linear algebra** — vectors, matrices, transformations (needed for: symmetry operations, reciprocal lattice, refinement)
- **Basic chemistry** — atomic structure, bonding, molecular geometry (needed for: understanding crystal structures, structure factor)
- **Wave physics** — interference, diffraction, Fourier transforms (needed for: X-ray diffraction, reciprocal space)
- **Basic materials science** — atomic packing, crystal defects (helpful for: motivation and applications)

## Key Bottlenecks

1. **Crystallographic restriction theorem** (Lesson 3) — why only certain rotation axes exist
2. **14 Bravais lattices derivation** (Lesson 8) — combining symmetry with centering
3. **Space group notation** (Lesson 14) — reading Hermann-Mauguin symbols
4. **Reciprocal space** (Lesson 19) — understanding what reciprocal lattice represents
5. **Phase problem** (Lesson 23) — why we can't directly invert diffraction data

## Common Misconceptions

See teaching-notes.md for detailed list. Key ones:
- Confusing point groups with space groups
- Thinking reciprocal space is just "inverse" of real space
- Assuming all 32 point groups × 14 Bravais lattices = 230 space groups (it's not that simple!)
- Believing Bragg's law fully explains diffraction (structure factor matters!)
