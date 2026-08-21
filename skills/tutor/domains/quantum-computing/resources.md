# Quantum Computing — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Nielsen & Chuang: "Quantum Computation and Quantum Information" (Cambridge University Press, 10th Anniversary Edition)**
  - URL: https://www.cambridge.org/highereducation/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE
  - The canonical quantum computing textbook, known as "Mike and Ike"
  - Comprehensive coverage from foundations (qubits, gates, measurement) through advanced topics (error correction, quantum Shannon theory)
  - Balances physics and CS perspectives perfectly for intermediate students
  - Exercises at the end of each chapter are excellent for practice

- **John Preskill: "Quantum Computation" Lecture Notes (Caltech)**
  - URL: http://theory.caltech.edu/~preskill/ph229/
  - Physics-focused approach with deep treatment of error correction and fault tolerance
  - Excellent for understanding decoherence, noise models, and stabilizer codes
  - More mathematical than Nielsen & Chuang, assumes physics background

- **Kitaev, Shen, Vyalyi: "Classical and Quantum Computation" (AMS)**
  - More mathematical and complexity-theory focused
  - Excellent treatment of quantum complexity classes (BQP, QMA)
  - Good for students with math/CS theory background

- **David Mermin: "Quantum Computer Science" (Cambridge)**
  - Elementary introduction with computer science focus
  - Accessible and less physics-heavy than Nielsen & Chuang
  - Good supplementary text if linear algebra is rusty

### University Course Materials

- **MIT 18.435J Quantum Computation (MIT OpenCourseWare)**
  - URL: https://ocw.mit.edu/courses/18-435j-quantum-computation-fall-2003/
  - Taught by Peter Shor (yes, *that* Shor)
  - Complete lecture notes, problem sets, and exams available
  - Covers algorithms, complexity theory, error correction
  - Intermediate to advanced level

- **Stanford CS269Q: Elements of Quantum Computer Programming**
  - URL: https://cs269q.stanford.edu/
  - Hands-on course with Python and Qiskit
  - Syllabus: https://cs269q.stanford.edu/syllabus.html
  - Emphasizes programming and running on real quantum hardware
  - Perfect for students who want to code immediately
  - Lecture slides and readings available online

- **MIT 6.845 Quantum Complexity Theory**
  - URL: https://ocw.mit.edu/courses/6-845-quantum-complexity-theory-fall-2010/
  - Advanced complexity theory perspective
  - Topics: BQP, quantum interactive proofs, QMA-completeness
  - For students interested in theoretical CS

## Videos & Video Lectures

### Full Courses

- **MIT 18.435J Quantum Computation Video Lectures** (OCW)
  - Peter Shor teaching the full course
  - Pairs perfectly with the lecture notes
  
- **Qiskit YouTube Channel**
  - URL: https://www.youtube.com/@qiskit
  - Tutorials on quantum algorithms, circuit design, and Qiskit programming
  - "Coding with Qiskit" series is excellent for hands-on learning
  - Regular updates on new features and quantum hardware

- **Michael Nielsen's Quantum Computing Series**
  - Short conceptual videos on core topics
  - Excellent visual explanations of superposition, entanglement, and algorithms

### Individual Topics

- **3Blue1Brown: "Quantum Computing" (planned series)**
  - Beautiful visual explanations when available
  - Focus on geometric intuition and linear algebra perspective

- **Quantum Country: "Quantum Computing for the Very Curious"**
  - URL: https://quantum.country/
  - Interactive essay with spaced repetition prompts
  - Covers basics through Grover's and Shor's algorithms
  - Excellent for building intuition

- **Scott Aaronson: "Quantum Computing Since Democritus" Lectures**
  - Entertaining and deep exploration of quantum complexity
  - Available as book and lecture videos
  - For students who love computational theory

## Interactive Tools & Simulators

### Programming Frameworks

- **Qiskit (IBM Quantum)**
  - URL: https://qiskit.org/
  - Python SDK for quantum computing
  - Free access to IBM's quantum hardware via IBM Quantum Experience
  - Extensive documentation and tutorials
  - Active community and regular updates
  - Best for: Students who want industry-standard tools

- **Cirq (Google Quantum AI)**
  - URL: https://quantumai.google/cirq
  - Google's quantum programming framework in Python
  - Integrates with Google's quantum processors
  - Focus on NISQ algorithms and error mitigation
  - Best for: Students interested in near-term quantum computing

- **Q# (Microsoft Quantum Development Kit)**
  - URL: https://azure.microsoft.com/en-us/products/quantum/
  - Quantum-specific programming language
  - Integrates with Visual Studio and Jupyter
  - Excellent type system for quantum programs
  - Best for: Students with software engineering background

### Web-Based Simulators

- **Programming Quantum Computers (O'Reilly)**
  - URL: https://oreilly-qc.github.io/
  - Interactive circuit playground embedded in the browser
  - Accompanies the O'Reilly book
  - Visual circuit builder with live simulation
  - Best for: Quick experiments and visualization

- **Quantum Computing Playground (Google)**
  - Browser-based quantum simulator
  - Visual representation of state vectors
  - Educational focus with good UI
  - Best for: Beginners who want visual feedback

- **Quantum Circuit Simulator (Quantastica)**
  - URL: https://github.com/quantastica/quantum-circuit
  - JavaScript-based, runs in browser
  - Export to multiple formats (Qiskit, Cirq, Q#, OpenQASM)
  - Good for converting between quantum languages
  - Best for: Multi-platform experimentation

- **IBM Quantum Composer**
  - URL: https://quantum-computing.ibm.com/composer
  - Drag-and-drop circuit builder
  - Run on real IBM quantum hardware
  - Visualize state, probabilities, and Bloch sphere
  - Best for: Visual learners and hands-on exploration

### Lists & Aggregators

- **Top 63 Quantum Computer Simulators**
  - URL: https://thequantuminsider.com/2022/06/14/top-63-quantum-computer-simulators/
  - Comprehensive list of simulators across all languages
  - Includes specialized tools for specific applications

- **Awesome Quantum Software (GitHub)**
  - URL: https://github.com/qosf/awesome-quantum-software
  - Curated list of open-source quantum software
  - Frameworks, simulators, libraries, tutorials
  - Community-maintained and regularly updated

## Code & Repositories

### Example Implementations

- **Qiskit Textbook GitHub**
  - URL: https://github.com/Qiskit/textbook
  - Source code for the Qiskit textbook
  - Jupyter notebooks for all major algorithms
  - Grover, Shor, VQE, QAOA implementations

- **Cirq Examples**
  - URL: https://github.com/quantumlib/Cirq/tree/master/examples
  - Official examples for Cirq framework
  - Algorithm implementations and tutorials

- **Quantum Algorithm Zoo**
  - URL: https://quantumalgorithmzoo.org/
  - Comprehensive catalog of quantum algorithms
  - Includes complexity analysis and references
  - Best for: Understanding the landscape of quantum algorithms

### Research Code

- **Forest (Rigetti)**
  - URL: https://github.com/rigetti/pyquil
  - PyQuil: Python library for quantum programming
  - Access to Rigetti's quantum processors
  - Focus on hybrid quantum-classical algorithms

## People to Follow

### Pioneers & Leading Researchers

- **Peter Shor** (MIT) — Shor's algorithm, quantum error correction codes
  - Follow for: Foundational insights, error correction research

- **John Preskill** (Caltech) — Quantum information theory, coined "NISQ"
  - Twitter: @preskill
  - Blog: Quantum Frontiers (https://quantumfrontiers.com/)
  - Follow for: Big-picture thinking, quantum information theory

- **Scott Aaronson** (UT Austin) — Quantum complexity theory, quantum supremacy debates
  - Blog: Shtetl-Optimized (https://scottaaronson.blog/)
  - Follow for: Clarity on quantum limitations, complexity theory, entertaining writing

- **Michelle Simmons** (UNSW) — Silicon quantum computing, quantum hardware
  - Follow for: Physical implementation, quantum engineering

- **Umesh Vazirani** (UC Berkeley) — Quantum algorithms, quantum complexity
  - Follow for: Theoretical foundations, algorithm design

### Industry & Practitioners

- **Jay Gambetta** (IBM Quantum) — IBM's quantum computing efforts
  - Twitter: @jaygambetta
  - Follow for: NISQ algorithms, industry developments

- **Hartmut Neven** (Google Quantum AI) — Google's quantum hardware and algorithms
  - Follow for: Quantum supremacy/advantage claims, hardware progress

- **Craig Gidney** (Google Quantum AI) — Quantum algorithms and error correction
  - Blog: Algorithmic Assertions (https://algassert.com/)
  - Follow for: Clear explanations, circuit optimization, error correction

- **Krysta Svore** (Microsoft Quantum) — Quantum software and algorithms
  - Follow for: Q# language development, topological quantum computing

### Educators & Communicators

- **Michael Nielsen** — Co-author of Nielsen & Chuang
  - Focus on quantum computing and open science
  
- **Sabrina Gonzalez Pasterski** (Perimeter Institute) — Quantum information and gravity
  - Follow for: Cutting-edge research at physics-quantum intersection

- **Chris Ferrie** — Author of "Quantum Physics for Babies" and accessible quantum books
  - Follow for: Clear explanations and educational resources

## Unexpected Cross-Discipline Connections

### Quantum Chemistry & Materials Science

- **Variational Quantum Eigensolver (VQE)** — near-term algorithm for finding ground state energies of molecules
- **Quantum simulation** — simulating quantum systems (molecules, materials) is a natural fit for quantum computers
- Connection: Chemistry is quantum at its core; quantum computers can simulate molecular interactions exactly
- Resource: PennyLane library (https://pennylane.ai/) for quantum chemistry simulations

### Cryptography (both attacking and defending)

- **Shor's algorithm threatens RSA and elliptic curve cryptography** — most public-key crypto becomes insecure
- **Post-quantum cryptography** — designing classical algorithms resistant to quantum attacks (NIST standardization ongoing)
- **Quantum key distribution (BB84)** — provably secure key exchange using quantum mechanics
- Connection: Quantum computing forces a rethinking of all modern cryptography
- Resource: NIST Post-Quantum Cryptography Standardization (https://csrc.nist.gov/projects/post-quantum-cryptography)

### Optimization & Operations Research

- **QAOA (Quantum Approximate Optimization Algorithm)** — variational algorithm for combinatorial optimization
- **Quantum annealing** — D-Wave's approach to optimization using quantum tunneling
- Connection: Many real-world problems (scheduling, routing, resource allocation) are optimization problems
- Quantum computers may offer advantage for certain classes
- Resource: D-Wave's Leap quantum cloud service

### Machine Learning & AI

- **Quantum neural networks** — variational circuits as ML models
- **Quantum kernels** — quantum feature maps for classical ML algorithms
- **HHL algorithm** — quantum linear systems solver with exponential speedup (under specific conditions)
- Connection: ML is fundamentally linear algebra; quantum computers excel at certain linear algebra tasks
- Caveat: Most quantum ML claims are overhyped; practical advantage remains uncertain
- Resource: TensorFlow Quantum (https://www.tensorflow.org/quantum)

### Linear Algebra & Matrix Theory

- **Quantum computing IS applied linear algebra** — qubits are vectors, gates are unitary matrices, measurement is projection
- Every quantum operation can be understood as matrix multiplication
- Connection: Quantum computing gives new perspective on eigenvalue problems, singular value decomposition, and matrix functions
- Resource: Linear Algebra for Quantum Computation (embedded in Nielsen & Chuang)

### Information Theory

- **Quantum Shannon theory** — quantum channel capacity, quantum data compression, quantum source coding
- **Holevo bound** — limits on classical information in quantum states
- Connection: Classical information theory extends to quantum regime with new phenomena (superdense coding, quantum teleportation)
- Resource: Mark Wilde's "Quantum Information Theory" textbook

### Complexity Theory & Theory of Computation

- **BQP complexity class** — problems solvable efficiently by quantum computers
- **Relationship to P, NP, PSPACE** — BQP ⊆ PSPACE, but relationship to NP is unknown
- **Quantum interactive proofs, QMA, QCMA** — quantum extensions of classical complexity classes
- Connection: Quantum computing challenges Church-Turing thesis and redefines "efficiently computable"
- Resource: Quantum Complexity Theory lecture notes (MIT 6.845)

### Philosophy of Mind & Measurement Problem

- **Measurement problem in quantum mechanics** — what causes wave function collapse?
- **Many-worlds interpretation** — all measurement outcomes occur in parallel universes
- **Consciousness and measurement** — discredited but historically influential idea that consciousness causes collapse
- Connection: Quantum computing forces engagement with fundamental questions about observation and reality
- Resource: Scott Aaronson's "Quantum Computing and the Limits of the Efficiently Computable" (philosophical perspective)

### Topology & Knot Theory

- **Topological quantum computing** — uses anyons (exotic particles) with braiding operations
- **Fault tolerance from topology** — errors can't happen due to topological protection
- Connection: Microsoft's approach to quantum computing relies on topological phases of matter
- Resource: Kitaev's original papers on topological quantum computing

## Journals & Conferences

### Key Journals

- **Quantum** (open access) — broad quantum information research
- **Nature Physics**, **Physical Review Letters** — high-impact quantum computing results
- **npj Quantum Information** (Nature) — open access quantum computing journal

### Major Conferences

- **QIP (Quantum Information Processing)** — premier theoretical quantum computing conference
- **QTML (Quantum Techniques in Machine Learning)** — quantum ML intersection
- **IEEE Quantum Week** — broad industry and academic conference
- **APS March Meeting** — physics conference with quantum computing track

## Online Communities

- **Quantum Computing Stack Exchange** — Q&A for quantum computing questions
- **Qiskit Slack** — active community for Qiskit users
- **r/QuantumComputing** (Reddit) — discussions, news, and beginner questions
- **Quantum Open Source Foundation (QOSF)** — community for open-source quantum software

## Staying Current

- **Quantum Computing Report** (https://quantumcomputingreport.com/) — industry news and hardware updates
- **The Quantum Insider** (https://thequantuminsider.com/) — news, analysis, and market trends
- **arXiv quant-ph** (https://arxiv.org/list/quant-ph/recent) — preprints for cutting-edge research
- **Shtetl-Optimized** (Scott Aaronson's blog) — thoughtful commentary on quantum computing developments
- **Quantum Frontiers** (John Preskill's blog) — insights from Caltech quantum institute
