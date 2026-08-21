# Differential Geometry and General Relativity — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Liang & Zhou - Differential Geometry and General Relativity (2023)** — Graduate-level text published by Springer. First 5 chapters cover differential geometry foundations, last 4 chapters cover GR. Includes worked examples and exercises. Good for intermediate students willing to engage with formal mathematics.
  - https://link.springer.com/book/10.1007/978-981-99-0022-0

- **Dray - Differential Forms and the Geometry of General Relativity (2024)** — Accessible approach using differential forms instead of traditional tensor notation. Minimizes "index gymnastics." Requires only calculus and linear algebra. Excellent alternative for students who struggle with indices.
  - https://www.routledge.com/Differential-Forms-and-the-Geometry-of-General-Relativity/Dray/p/book/9781032922164

- **Carroll - Lecture Notes on General Relativity** — Comprehensive, widely-used notes covering differential geometry through cosmology. Clear notation, good physical intuition. Free online. The standard reference for many graduate courses.
  - https://preposterousuniverse.com/grnotes/

- **Misner, Thorne, Wheeler - Gravitation (1973)** — The "big black coffee table" book, 1279 pages. Encyclopedic treatment emphasizing geometric thinking. Advanced but invaluable reference. Written by three leaders who advanced GR and geometrical approaches.

### Course Lecture Notes

- **MIT OCW 8.962 General Relativity** — Complete graduate course materials including syllabus, lecture summaries, problem sets. Taught by Prof. McGreevy (Spring 2020). Covers Einstein's theory, differential geometry, experimental tests, black holes, cosmology.
  - Course page: https://ocw.mit.edu/courses/8-962-general-relativity-spring-2020/
  - Lecture summaries: https://ocw.mit.edu/courses/8-962-general-relativity-spring-2020/pages/lecture-summaries/

- **IAP Differential Geometry Notes** — Concise toolbox for Riemannian geometry concepts with interpretations and tips for applying abstract concepts to physics.
  - https://www.iap.fr/useriap/werth/PDF/Differential_Geometry_Notes.pdf

- **ArXiv GR Lecture Notes (gr-qc/9712019)** — Classic lecture notes on general relativity covering mathematical foundations through applications.
  - https://arxiv.org/pdf/gr-qc/9712019

- **University of Warwick PX436** — Lecture notes for General Relativity course by Gareth Alexander. Includes syllabus and problem sets.
  - https://warwick.ac.uk/fac/sci/physics/staff/academic/galexander/general_relativity_px436.pdf

## Supplementary (for engagement)

### Videos

- **MIT 8.962 Video Lectures (Spring 2020)** — 23 video lectures covering full graduate GR course. YouTube playlist available.
  - Video gallery: https://ocw.mit.edu/courses/8-962-general-relativity-spring-2020/video_galleries/video-lectures/
  - YouTube playlist: https://www.youtube.com/playlist?list=PLUl4u3cNGP629n_3fX7HmKKgin_rqGzbx

- **Stanford General Relativity Lectures** — 10 lectures (17 hours 31 minutes) from Stanford Continuing Studies. Explores Einstein's theory of gravity and geometry, including Riemannian/curved space and Minkowski spacetime.
  - YouTube playlist: https://www.youtube.com/playlist?list=PLpGHT1n4-mAvcXwzOIz3dHnGZaQP1LEib
  - Also available: https://www.youtube.com/playlist?list=PLXLSbKIMm0kh6XsMSCEMnM02kEoW_8x-f

- **RelativityDoctor Video Lectures** — Collection of video lectures on special relativity, electrodynamics, and general relativity.
  - https://relativitydoctor.com/video-lectures-on-special-relativity-electrodynamics-and-general-relativity/

### Interactive Tools

- **Visualizing General Relativity** — Web-based interactive geodesic raytracing tool. Explore how light travels in curved spacetime. Created by Michael Moroz with contributions from James Berrow.
  - https://michaelmoroz.github.io/TracingGeodesics/

- **GeodesicViewer** — Tool for exploring geodesics in various spacetimes. Students can change parameters and immediately see results. Designed for introductory GR courses with ego-centric visualization.
  - Paper: https://www.sciencedirect.com/science/article/abs/pii/S0010465509003233
  - ResearchGate: https://www.researchgate.net/publication/223602309_GeodesicViewer_-_A_tool_for_exploring_geodesics_in_the_theory_of_relativity

- **OpenRelativity (MIT Game Lab)** — Toolset for creating educational demonstrations using games and interactive media. Helps visualize concepts that are hard to understand (time dilation, length contraction, relativistic effects).
  - http://gamelab.mit.edu/research/openrelativity/

### Code & Computational Tools

- **OGRePy** — Modern Python package for symbolic tensor calculations in general relativity. Uses SymPy and Jupyter notebooks. User-friendly for both research and teaching.
  - Paper: https://openresearchsoftware.metajnl.com/articles/10.5334/jors.558
  - Install: `pip install ogrepy`

- **SageManifolds** — Package for tensor and differential geometry calculations, part of SageMath. One of the best open-source tools for GR computations.
  - Paper on symbolic/numerical analysis: https://arxiv.org/pdf/1703.09738
  - Included in SageMath: https://www.sagemath.org/

- **gros (General Relativity Orbit Simulator)** — Python package to numerically calculate and simulate particle trajectories based on GR field equations. Users define metrics and initial conditions.
  - GitHub: https://github.com/bytebat/gros

- **EinsteinPy** — Python package for theoretical physicists with little programming background. Supports simulation of geodesics in various spacetime geometries (Schwarzschild, Kerr, Kerr-Newman).
  - Documentation and examples available

- **GitHub General Relativity Topic** — Collection of open-source projects, simulations, and educational tools related to general relativity.
  - https://github.com/topics/general-relativity

### Online Courses

- **Mathematics of General Relativity (Profound Physics)** — Complete online course covering the mathematical foundations needed for GR.
  - https://courses.profoundphysics.com/p/mathematics-of-general-relativity

## People (Researchers & Educators)

- **Sean Carroll** — Caltech theoretical physicist, excellent communicator. Author of widely-used GR lecture notes and popular science books. Twitter: @seanmcarroll
- **Kip Thorne** — Nobel laureate, co-author of MTW, expert on gravitational waves and black holes
- **Roger Penrose** — Nobel laureate for black hole theorems, inventor of Penrose diagrams
- **Abhay Ashtekar** — Expert on loop quantum gravity and mathematical GR
- **Clifford Will** — Expert on experimental tests of GR and alternative theories

## Unexpected Connections

### Machine Learning & Information Geometry
Riemannian geometry appears in machine learning through information geometry — putting metrics on probability distributions. Manifold learning algorithms (t-SNE, UMAP) use differential geometry ideas. Natural gradient descent uses the Fisher information metric.

### Gauge Theory & Particle Physics
The connection on a manifold (used to define covariant derivatives) is mathematically identical to gauge fields in Yang-Mills theory. General coordinate invariance in GR is analogous to gauge invariance in electromagnetism and the Standard Model.

### Wormholes & Time Travel
Einstein-Rosen bridges (wormholes) are solutions to Einstein's equations. Traversable wormholes require exotic matter with negative energy density. Connection to quantum field theory and Casimir effect.

### Holography & Black Hole Thermodynamics
Black holes have temperature (Hawking radiation) and entropy proportional to horizon area. The holographic principle suggests 3D gravity is equivalent to 2D quantum field theory (AdS/CFT). Active research area connecting GR to quantum mechanics.

### GPS & Everyday Technology
GPS satellites must account for both special relativistic (velocity-based) and general relativistic (gravitational) time dilation. Without GR corrections, GPS would accumulate ~10 km errors per day.

### Numerical Relativity & Supercomputing
Most Einstein equations have no analytical solutions. LIGO's gravitational wave detections rely on massive supercomputer simulations of black hole mergers. This is cutting-edge computational physics.

### Cosmology & Dark Energy
The cosmological constant, originally introduced then abandoned by Einstein, now dominates the universe's energy budget (~68%). Dark energy is the biggest mystery in modern cosmology.

### Differential Geometry in Biology
Cell membranes, protein folding, and DNA structure all involve differential geometry. The mathematics of surfaces and curvature appears throughout biophysics.

## Quick Reference Card

| Need | Resource |
|------|----------|
| **Clear definitions** | Carroll's notes |
| **Avoid indices** | Dray's book on differential forms |
| **Video explanation** | MIT OCW or Stanford lectures |
| **Compute tensors** | OGRePy or SageMath |
| **Visualize geodesics** | GeodesicViewer or Visualizing GR |
| **Physical intuition** | MTW (if you have time), OpenRelativity |
| **Worked problems** | Liang & Zhou, MIT OCW problem sets |
| **Latest research** | ArXiv gr-qc section |
