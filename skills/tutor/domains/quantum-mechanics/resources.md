# Quantum Mechanics — Resources

## Primary Sources (for lesson content)

### Textbooks

- **David J. Griffiths, "Introduction to Quantum Mechanics" (2nd ed., Pearson Prentice Hall, 2004)**
  - The gold standard for intermediate quantum mechanics; clear exposition, excellent problems, physical insight
  - Perfect for this curriculum level; balances formalism with intuition
  - Covers: formalism, 1D systems, 3D systems, angular momentum, spin, perturbation theory, scattering
  - Strong on worked examples and problem-solving technique
  
- **Ramamurti Shankar, "Principles of Quantum Mechanics" (2nd ed., Plenum Press, 1994)**
  - More mathematically rigorous; emphasizes linear algebra and Hilbert space structure
  - Excellent for students with strong math background who want deeper formalism
  - Companion video lectures available (Yale OpenCourses)
  
- **J.J. Sakurai & Jim Napolitano, "Modern Quantum Mechanics" (3rd ed., Cambridge University Press, 2020)**
  - Standard graduate text but accessible sections for advanced intermediate students
  - Strong on spin, angular momentum, and approximation methods
  - Use for: deeper dives into perturbation theory and fine structure

### University Course Materials

- **MIT OpenCourseWare 8.04 (Quantum Physics I)** — https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/
  - Complete course: lecture notes, problem sets, exams, solutions
  - Covers: wave mechanics, operators, 1D systems, harmonic oscillator, hydrogen atom
  - Excellent problem sets for practice; midterm and final exams for self-assessment
  
- **MIT OpenCourseWare 8.05 (Quantum Physics II)** — https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/
  - Advanced topics: perturbation theory, scattering, identical particles, relativistic QM
  - Use for: lessons 24-29 (approximation methods and applications)
  - Video lectures by Barton Zwiebach
  
- **MIT OpenCourseWare 8.06 (Quantum Physics III)** — https://ocw.mit.edu/courses/8-06-quantum-physics-iii-spring-2016/
  - Graduate-level but useful for fine structure and advanced applications
  - Use sparingly for: lesson 29 (fine structure) and rabbit holes
  
- **Stanford Physics 430 Lecture Notes (J. Greensite)** — https://stanford.edu/~oas/SI/QM/papers/QMGreensite.pdf
  - Comprehensive PDF notes; strong on mathematical foundations
  - Use for: alternative derivations, deeper explanations of formal structure
  - Good supplement when students want "why" behind the formalism

## Video Lectures (for engagement and alternative explanations)

- **MIT OCW 8.04 Video Lectures (Allan Adams)** — https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2013/video_galleries/lecture-videos/
  - Highly praised teaching style; intuitive explanations with rigor
  - Use for: lessons 1-18 (foundations through hydrogen atom)
  - ~1 hour per lecture; suggest short clips rather than full lectures for time efficiency
  
- **Introduction to Quantum Mechanics (Griffiths) YouTube Series** — https://www.youtube.com/playlist?list=PLKxxVVdhQNB6CRn3f12Ro64hOL5BQV39d
  - Systematic coverage following Griffiths textbook chapter-by-chapter
  - Use for: students who prefer video format; alternative explanations when stuck
  - ~30-45 min per video
  
- **MIT OCW 8.05 Video Lectures (Barton Zwiebach)** — https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/pages/readings/
  - Advanced topics with clear explanations
  - Use for: lessons 24-27 (perturbation theory), lesson 29 (fine structure)

## Interactive Tools & Simulators

### PhET Interactive Simulations (University of Colorado Boulder)

- **Quantum Measurement** — https://phet.colorado.edu/en/simulations/quantum-measurement
  - Explore 2-level quantum systems and measurement effects
  - Use for: lesson 3 (uncertainty), lesson 5 (measurement), lesson 19-20 (spin)
  - Students can see wave function collapse in real-time
  
- **Quantum Wave Interference** — https://phet.colorado.edu/en/simulations/quantum-wave-interference
  - Double-slit experiment with single particles; visualize interference
  - Use for: lesson 1 (wave-particle duality), lesson 2 (wave function)
  - Adjustable parameters: slit width, separation, particle type
  
- **Quantum Tunneling and Wave Packets** — https://phet.colorado.edu/en/simulations/quantum-tunneling
  - Watch wave packets tunnel through barriers; adjustable barrier height and width
  - Use for: lesson 10 (tunneling), lesson 12 (scattering)
  - Shows exponential decay of transmission with barrier width

### QuVis (Quantum Visualization Project)

- **QuVis Collection** — https://www.physport.org/methods/QuVis
  - Research-based simulations for learning quantum concepts
  - Topics: Schrödinger equation, wave packets, uncertainty, angular momentum, hydrogen atom
  - Use for: review lessons (11, 17, 22) to reinforce visualization
  - Free download with problem sets

## Code & Computational Tools

- **Quantum Mechanics simulations in Python (GitHub)**
  - Search: "quantum mechanics python jupyter" for interactive notebooks
  - Useful for: students who want to plot wave functions, solve Schrödinger numerically
  - Libraries: NumPy (linear algebra), SciPy (differential equations), Matplotlib (visualization)
  
- **QuTiP (Quantum Toolbox in Python)** — http://qutip.org/
  - Open-source framework for quantum dynamics and quantum optics
  - Use for: advanced students who want to explore time evolution, density matrices
  - Overkill for most lessons but good for rabbit holes (quantum computing, open systems)

## People to Follow (for deeper context)

- **Allan Adams (MIT)** — Theoretical physicist known for exceptional teaching; 8.04 lectures are legendary
- **Barton Zwiebach (MIT)** — String theory, quantum mechanics; clear expositor of advanced topics
- **Leonard Susskind (Stanford)** — Theoretical Minimum series; accessible explanations for general audience
- **Sean Carroll (Caltech)** — Quantum mechanics, foundations, many-worlds interpretation; excellent blog and podcast
- **Sabine Hossenfelder** — Physicist and science communicator; critiques of quantum interpretations and foundations
- **Scott Aaronson (UT Austin)** — Quantum computing, complexity theory; blog "Shtetl-Optimized" for quantum info perspective

## Historical & Foundational Papers (for context)

- **Schrödinger (1926)**: "An Undulatory Theory of the Mechanics of Atoms and Molecules" — Original wave equation paper
- **Heisenberg (1927)**: "Über den anschaulichen Inhalt der quantentheoretischen Kinematik und Mechanik" — Uncertainty principle
- **Dirac (1958)**: "The Principles of Quantum Mechanics" — Classic text; bra-ket notation
- **Einstein, Podolsky, Rosen (1935)**: "Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?" — EPR paradox
- **Bell (1964)**: "On the Einstein Podolsky Rosen Paradox" — Bell's theorem and inequalities

## Unexpected Cross-Discipline Connections

### Quantum Chemistry
- **Molecular orbitals**: Linear combinations of atomic orbitals (LCAO) use same math as quantum mechanics superposition
- **Computational chemistry**: Hartree-Fock, DFT all solve many-electron Schrödinger equation
- **Why interesting**: Chemistry IS applied quantum mechanics; periodic table structure emerges from Pauli exclusion

### Quantum Computing
- **Qubit = spin-1/2 system**: |0⟩ and |1⟩ are spin states; quantum gates are unitary operators
- **Entanglement and quantum algorithms**: Shor's algorithm, Grover's search use superposition and entanglement
- **Why interesting**: Tech companies (Google, IBM, Microsoft) building quantum computers now; this is cutting-edge

### Condensed Matter Physics
- **Band structure**: Solids as infinite 3D wells; periodic potentials lead to bands
- **Superconductivity and superfluidity**: Macroscopic quantum phenomena; Cooper pairs, BCS theory
- **Why interesting**: Quantum effects at room temperature (graphene, topological insulators); Nobel 2016

### Quantum Biology
- **Photosynthesis**: Quantum coherence in light-harvesting complexes; energy transfer efficiency
- **Enzyme catalysis**: Tunneling in proton/electron transfer reactions
- **Why interesting**: Life may exploit quantum effects; controversial but active research area

### Quantum Information Theory
- **Entanglement entropy**: Quantifying quantum correlations; Schmidt decomposition
- **No-cloning theorem**: Can't copy arbitrary quantum states; fundamental limit
- **Quantum cryptography**: BB84 protocol uses quantum measurement to guarantee secure communication
- **Why interesting**: Information theory + quantum mechanics → new computational paradigms

### Mathematical Physics
- **Functional analysis**: Quantum mechanics motivated Hilbert space theory, spectral theorem
- **Group theory**: Symmetries (rotations, translations) → conservation laws (angular momentum, momentum)
- **Why interesting**: QM is the clearest example of physics driving mathematics development

## Websites & Communities

- **Physics Stack Exchange** — https://physics.stackexchange.com/
  - Q&A for quantum mechanics problems and conceptual questions
  - Tag search: [quantum-mechanics], [schroedinger-equation], [hilbert-space]
  
- **Quantum Computing Stack Exchange** — https://quantumcomputing.stackexchange.com/
  - For students interested in quantum information and computing rabbit holes
  
- **arXiv Quantum Physics** — https://arxiv.org/list/quant-ph/recent
  - Preprint server for latest research; advanced but shows where the field is going

## Supplementary Reading (for deeper dives)

- **Feynman Lectures on Physics, Vol. III** — Classic introduction; Feynman's unique perspective
- **Townsend, "A Modern Approach to Quantum Mechanics"** — Spin-first approach; alternative pedagogical ordering
- **Cohen-Tannoudji, Diu, Laloë, "Quantum Mechanics"** — Encyclopedic 2-volume set; reference for everything
- **Ballentine, "Quantum Mechanics: A Modern Development"** — Statistical interpretation; foundations and measurement theory
