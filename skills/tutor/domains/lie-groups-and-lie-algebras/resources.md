# Lie Groups and Lie Algebras — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Alexander Kirillov Jr., "Introduction to Lie Groups and Lie Algebras"** (free PDF: https://www.math.stonybrook.edu/~kirillov/mat552/liegroups.pdf)
  - Excellent for intermediate level, clear exposition, widely used in courses
  - Covers classical groups, exponential map, BCH formula, structure theory, classification
  - Includes exercises with solutions
  - **Primary recommendation for this curriculum**

- **Pavel Etingof, MIT Lecture Notes** (free PDF: https://ocw.mit.edu/courses/18-755-lie-groups-and-lie-algebras-ii-spring-2024/mit18_755_s24_lec_full.pdf)
  - Comprehensive, advanced treatment
  - Detailed classification, representation theory, Weyl character formula
  - Good for deeper dives on specific topics

- **Michael Taylor, "Lectures on Lie Groups"** (free PDF: https://mtaylor.web.unc.edu/wp-content/uploads/sites/16915/2018/04/m273.pdf)
  - Geometric perspective, emphasizes manifold structure
  - Good for students with differential geometry background
  - Clean treatment of exponential map and group structure

- **University of Toronto Lecture Notes** (free PDF: https://www.math.toronto.edu/mein/teaching/LectureNotes/lie.pdf)
  - Concise, well-organized
  - Good balance of theory and examples
  - Useful for quick reference

### University Courses

- **MIT OpenCourseWare 18.745: Lie Groups and Lie Algebras I** (https://ocw.mit.edu/courses/18-745-lie-groups-and-lie-algebras-i-fall-2020/)
  - Full course materials: syllabus, lecture notes, problem sets
  - Covers foundation through classification
  - Excellent problem sets for practice

- **MIT OpenCourseWare 18.755: Lie Groups and Lie Algebras II** (https://ocw.mit.edu/courses/18-755-lie-groups-and-lie-algebras-ii-spring-2024/)
  - Advanced representation theory
  - Weyl character formula, Peter-Weyl theorem
  - For students wanting to go deeper

- **Stony Brook MAT 552** (https://www.math.stonybrook.edu/~kirillov/mat552/)
  - Course page with schedule, topics, resources
  - Follows Kirillov textbook
  - Good syllabus for pacing reference

- **Stony Brook MAT 552 (Kamenova)** (https://www.math.stonybrook.edu/~kamenova/homepage_files/MAT552s15.html)
  - Alternative version with different emphasis
  - Good problem sets and examples

## Supplementary Resources (for engagement)

### Video Lectures

- **Lancaster University MATH426: Introduction to Lie Groups and Lie Algebras** (https://www.youtube.com/watch?v=kN-LZvrKJck)
  - Gentle introduction, good for visual learners
  - Covers basic definitions and motivations

- **Lie groups: Lie algebras** (https://www.youtube.com/watch?v=xVbfWunObYQ)
  - Graduate course lecture
  - Two definitions of Lie algebra of a Lie group
  - Good supplement to Lessons 6-7

### Interactive Tools

- **Lievis: Lie theory visualizations** (https://www.jgibson.id.au/lievis/)
  - Interactive visualization of Weyl groups, root systems
  - Shows data about group elements (length, reduced expressions)
  - **Essential for Lessons 18-23 on root systems and classification**

- **Algebras Don't Lie** (https://github.com/colton5007/AlgebrasDontLie)
  - Visualization of root systems and polytope representations
  - Built with Sage/SageCell, interactive plots
  - Good for exploring different Lie algebras

- **SimpLie** (https://github.com/teake/simplie)
  - Root system visualization via Coxeter projections and Hasse diagrams
  - Graphical interface, cross-platform (Java)
  - Good for comparing different root systems

- **Atlas of Lie Groups** (http://www.liegroups.org/)
  - Spherical Unitary Explorer for classical groups
  - Advanced tool for representation theory
  - Good for Lessons 24-25 on representations

### Code and Implementation

- **BYU MAGICC Lie Groups Repository** (https://github.com/byu-magicc/lie_groups)
  - Python implementation-focused introduction for roboticists
  - Jupyter notebooks with working code
  - **Perfect for Lesson 26 on robotics applications**

- **Geomstats (Python library)**
  - Differential geometry and Lie groups in Python
  - Practical implementations for ML/data science
  - Good for students who want to code along

- **Sophus (C++ library)**
  - C++ implementation of Lie group operations
  - Used in robotics and computer vision
  - Mention for students with C++ background

### Visual Explanations

- **Lie Theory: A Visual Introduction** (https://aalok.uk/projects/lietheory/)
  - Interactive visual introduction without heavy math
  - Focus on optimization on curved spaces
  - **Great motivational resource for Lessons 1-4**

- **Visualization of Lie Groups** (https://ajpancollantes.github.io/%E2%98%95REFLECTIONS/visualization%20of%20Lie%20groups.md.html)
  - Collection of visualizations and explanations
  - Good supplementary material for geometric intuition

## Books (for deeper study)

### Classic Texts

- **Humphreys, "Introduction to Lie Algebras and Representation Theory"**
  - Standard graduate text, comprehensive
  - Emphasizes algebraic approach
  - Excellent for structure theory and classification

- **Hall, "Lie Groups, Lie Algebras, and Representations"**
  - Modern approach, very readable
  - Good balance of groups and algebras
  - Strong on matrix groups

- **Fulton and Harris, "Representation Theory: A First Course"**
  - Broader coverage including finite groups
  - Excellent on representation theory
  - Very geometric approach

### Advanced Texts

- **Knapp, "Lie Groups Beyond an Introduction"**
  - Comprehensive, encyclopedic
  - Real forms, structure theory, representation theory
  - Reference for serious students

- **Carter, "Lie Algebras of Finite and Affine Type"**
  - Detailed treatment of classification
  - Root systems, Weyl groups, extended Dynkin diagrams
  - For students wanting to go deep on classification

### Applications-Oriented

- **Georgi, "Lie Algebras in Particle Physics"**
  - Physics perspective, minimal formalism
  - Focus on SU(2), SU(3), gauge theory
  - Great for physics-motivated students

- **Sattinger and Weaver, "Lie Groups and Algebras with Applications to Physics, Geometry, and Mechanics"**
  - Applications-first approach
  - Good for students wanting to see utility

## People to Follow

### Historical Figures
- **Sophus Lie** — invented the theory to solve differential equations
- **Wilhelm Killing** — classified simple Lie algebras
- **Élie Cartan** — developed modern structural theory
- **Hermann Weyl** — representation theory, character formula

### Modern Expositors
- **Alexander Kirillov Jr.** — excellent textbook author, clear expositor
- **Brian C. Hall** — modern textbook author, accessible writing
- **Roger Carter** — expert on classification and root systems

## Unexpected Connections

### Lie Theory and Music
The Tonnetz (musical network) can be modeled as a homogeneous space of a Lie group. Neo-Riemannian music theory uses group actions to analyze chord progressions.
- **Wild card for musically inclined students**

### Lie Groups and Machine Learning
Riemannian optimization on manifolds (including Lie groups) is used in deep learning for parameter optimization on constrained spaces.
- **Connection to modern ML/AI applications**
- Mention Geomstats library

### Lie Theory and Computer Vision
Camera rotations and rigid motions are elements of SO(3) and SE(3). SLAM (simultaneous localization and mapping) algorithms use Lie group structure for optimization.
- **Concrete engineering application**
- Connects to Lesson 26 on robotics

### Lie Algebras and Integrable Systems
The Toda lattice and KdV equation are integrable systems with Lie-algebraic structure. Each simple Lie algebra produces a different integrable system.
- **Beautiful mathematical physics connection**

### Lie Groups and Number Theory
Automorphic forms and the Langlands program connect Lie groups to number theory and algebraic geometry.
- **For mathematically ambitious students**
- Way beyond this curriculum but fascinating direction

### E8 and the Exceptional Algebras
The exceptional Lie algebras appear in:
- String theory (E8 × E8 heterotic string theory)
- Supergravity and M-theory (E7, E6)
- The Monster group (moonshine and E8 connection)
- **Ultimate "this is deeper than you think" moment**

## Cross-Discipline Links

### Physics
- **Quantum Mechanics**: SU(2) for spin, SO(3) for angular momentum
- **Particle Physics**: SU(3) for QCD, SU(2) × U(1) for electroweak theory
- **General Relativity**: SO(3,1) (Lorentz group) for spacetime symmetries
- **Gauge Theory**: Principal bundles with structure group a Lie group

### Robotics and Control
- **Rigid Body Dynamics**: SE(3) for position and orientation
- **Motion Planning**: optimization on SO(3) and SE(3)
- **SLAM**: Lie group structure for efficient estimation

### Differential Geometry
- **Symmetric Spaces**: G/K where G is a Lie group
- **Homogeneous Spaces**: Manifolds with transitive Lie group action
- **Vector Bundles**: Lie groups as structure groups

### Computer Science
- **Computer Graphics**: Rotations and transformations
- **Computer Vision**: 3D reconstruction, camera calibration
- **Geometric Deep Learning**: Graph neural networks on manifolds

## Research Directions (for curious students)

- **Infinite-dimensional Lie algebras** (Kac-Moody algebras, Virasoro algebra)
- **Quantum groups** (deformations of Lie algebras)
- **Lie superalgebras** (Z/2-graded Lie algebras)
- **Geometric representation theory** (D-modules, perverse sheaves)
- **Langlands program** (number theory meets representation theory)
