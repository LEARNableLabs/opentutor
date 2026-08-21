# Condensed Matter Physics — Concept Map

## Core Concepts (in learning order)

1. **Crystal lattices** — repeating arrangements of atoms in space; Bravais lattices classify all possible periodic structures
2. **Symmetry operations** — rotations, reflections, translations that leave a crystal unchanged. Depends on: lattices
3. **Reciprocal lattice** — Fourier dual of real-space lattice; natural space for waves and scattering. Depends on: lattices
4. **X-ray diffraction** — how scattered X-rays reveal crystal structure via Bragg's law. Depends on: reciprocal lattice
5. **Tensor properties** — how symmetry constrains physical properties like conductivity and piezoelectricity. Depends on: symmetry operations
6. **Harmonic approximation** — treating interatomic forces as springs; foundation for lattice dynamics. Depends on: crystal lattices
7. **Phonons** — quantized lattice vibrations; acoustic vs optical modes. Depends on: harmonic approximation, reciprocal lattice
8. **Debye model** — low-temperature limit for phonon density of states and heat capacity. Depends on: phonons
9. **Thermal conductivity** — how phonons carry heat and scatter via Umklapp processes. Depends on: phonons
10. **Drude model** — classical free electron theory of conductivity. Depends on: basic quantum mechanics
11. **Sommerfeld model** — quantum free electron gas; Fermi energy and Fermi surface. Depends on: Drude model
12. **Bloch theorem** — eigenstates in a periodic potential are plane waves times periodic functions. Depends on: quantum mechanics, reciprocal lattice
13. **Nearly free electrons** — perturbation theory for weak periodic potentials; explains band gaps. Depends on: Bloch theorem
14. **Tight-binding model** — bands formed from overlapping atomic orbitals. Depends on: Bloch theorem
15. **Band structure** — energy dispersion E(k); determines if a material is metal, insulator, or semiconductor. Depends on: nearly free electrons, tight-binding
16. **Fermi surface** — surface in k-space separating occupied from unoccupied states at T=0. Depends on: band structure
17. **Semiconductors** — materials with small band gaps; doping creates charge carriers. Depends on: band structure
18. **Diamagnetism** — orbital response to magnetic fields (Lenz's law); universal but weak. Depends on: quantum mechanics
19. **Paramagnetism** — spin alignment with external field; Curie law. Depends on: quantum mechanics, statistical mechanics
20. **Exchange interaction** — quantum mechanical origin of ferromagnetism via Pauli principle. Depends on: quantum mechanics
21. **Heisenberg model** — spin Hamiltonian for magnetic order. Depends on: exchange interaction
22. **Ferromagnetism** — spontaneous magnetization below Curie temperature. Depends on: exchange interaction, Heisenberg model
23. **Antiferromagnetism** — alternating spin alignment; Néel temperature. Depends on: exchange interaction, Heisenberg model
24. **Spin waves (magnons)** — quantized excitations of magnetic order. Depends on: ferromagnetism, antiferromagnetism
25. **Magnetic domains** — regions of uniform magnetization; minimize energy via domain walls. Depends on: ferromagnetism
26. **Meissner effect** — perfect diamagnetism; expulsion of magnetic fields from superconductors. Depends on: electromagnetism
27. **Cooper pairs** — bound electron pairs mediated by phonon exchange. Depends on: phonons, Fermi surface
28. **BCS theory** — microscopic theory of superconductivity; energy gap and critical temperature. Depends on: Cooper pairs
29. **Type I vs Type II superconductors** — response to magnetic fields; vortex states. Depends on: BCS theory, Meissner effect
30. **Unconventional superconductivity** — non-phonon pairing mechanisms (high-Tc cuprates). Depends on: BCS theory
31. **Berry phase** — geometric phase acquired by quantum states under adiabatic evolution. Depends on: quantum mechanics
32. **Topological invariants** — quantized quantities protected by symmetry; classify phases of matter. Depends on: Berry phase
33. **Quantum Hall effect** — quantized Hall conductance in 2D electron systems; Chern number. Depends on: topological invariants
34. **Topological insulators** — bulk insulators with protected metallic surface states. Depends on: topological invariants, band structure

## Dependencies

### Foundation Layer
- **Crystal lattices** are the foundation; everything builds on periodic structure
- **Symmetry operations** determine which physical properties can exist
- **Reciprocal lattice** is essential for understanding both phonons and electrons

### Lattice Dynamics Branch
- **Harmonic approximation** → **Phonons** → **Thermal properties**
- Phonons reappear in **Cooper pair formation** (electron-phonon coupling)

### Electronic Structure Branch
- **Drude/Sommerfeld models** → **Bloch theorem** → **Band theory**
- **Band structure** determines conductivity, magnetism, and topology
- **Fermi surface** is central to metals, superconductivity, and phase transitions

### Magnetism Branch
- **Exchange interaction** underlies all magnetic order
- **Heisenberg model** is the minimal model for ferromagnetism and antiferromagnetism
- Magnetic order can coexist with or compete against superconductivity

### Superconductivity Branch
- **Cooper pairs** require understanding both Fermi surfaces and phonons
- **BCS theory** explains conventional superconductors
- High-Tc superconductivity remains an open problem

### Topological Branch
- **Berry phase** is the geometric foundation
- **Topological invariants** classify phases that can't be distinguished by symmetry alone
- **Quantum Hall effect** and **topological insulators** are flagship examples

## Bottlenecks

Students commonly struggle at:

1. **Reciprocal lattice** — the conceptual shift to k-space is difficult without strong Fourier intuition
2. **Bloch theorem** — periodic boundary conditions and crystal momentum are subtle
3. **Band structure interpretation** — connecting E(k) diagrams to physical properties takes practice
4. **Exchange interaction** — quantum origin is non-intuitive; not just classical magnetic dipoles
5. **Cooper pairing** — why attractive interaction leads to bound states despite Fermi exclusion
6. **Topological invariants** — requires comfort with differential geometry and global properties

## Prerequisite Topics

- **Quantum mechanics** — needed for: Bloch theorem, band theory, spin, Cooper pairs, Berry phase
- **Statistical mechanics** — needed for: thermal properties, Fermi-Dirac distribution, phase transitions
- **Electromagnetism** — needed for: Meissner effect, magnetic properties, Hall effect
- **Linear algebra** — needed for: symmetry operations, tight-binding Hamiltonian, topological invariants
- **Multivariable calculus** — needed for: reciprocal space, Brillouin zones, Berry curvature

## Misconceptions to Address

1. **"Phonons are sound waves"** — they are quantized normal modes; sound is a classical limit
2. **"Bands are energy levels"** — they are dispersion relations E(k), not discrete levels
3. **"Insulators have no electrons"** — they have filled bands; the gap prevents conduction
4. **"Ferromagnetism requires external fields"** — spontaneous symmetry breaking below Tc
5. **"Superconductivity is just zero resistance"** — it's a quantum phase with Meissner effect
6. **"Topology is just geometry"** — topological invariants are discrete, robust to deformations
