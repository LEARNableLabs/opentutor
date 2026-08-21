# Differential Geometry and General Relativity — Concept Map

## Core Concepts (in learning order)

1. **Manifolds** — smooth spaces that locally look like Euclidean space
2. **Charts and atlases** — coordinate systems covering a manifold. Depends on: manifolds
3. **Tangent spaces** — vector spaces of tangent vectors at each point. Depends on: manifolds, charts
4. **Vector fields** — smooth assignment of vectors to points. Depends on: tangent spaces
5. **Coordinate transformations** — changing between different chart descriptions. Depends on: charts, atlases
6. **Tensors** — multilinear maps on vector spaces, generalize vectors and covectors. Depends on: tangent spaces
7. **Differential forms** — antisymmetric tensors, alternative to index notation. Depends on: tensors
8. **Covariant derivative** — way to differentiate tensor fields on manifolds. Depends on: tensors, vector fields
9. **Connection** — rule for parallel transport of vectors. Depends on: covariant derivative
10. **Parallel transport** — moving vectors along curves while keeping them "parallel". Depends on: connection
11. **Metric tensor** — defines distances and angles on a manifold. Depends on: tensors
12. **Lorentzian signature** — metric with one timelike and three spacelike directions. Depends on: metric tensor
13. **Geodesics** — straightest possible paths, generalize straight lines. Depends on: metric tensor, connection
14. **Christoffel symbols** — connection coefficients in a coordinate basis. Depends on: metric tensor, connection
15. **Riemann curvature tensor** — measures failure of parallel transport around closed loops. Depends on: connection, parallel transport
16. **Geodesic deviation** — how nearby geodesics spread apart. Depends on: Riemann curvature tensor, geodesics
17. **Ricci tensor** — contraction of Riemann tensor, measures volume distortion. Depends on: Riemann curvature tensor
18. **Ricci scalar** — trace of Ricci tensor, single number measuring curvature. Depends on: Ricci tensor
19. **Stress-energy tensor** — describes matter and energy distribution. Depends on: tensors
20. **Einstein tensor** — combination of Ricci tensor and scalar appearing in field equations. Depends on: Ricci tensor, Ricci scalar
21. **Einstein field equations** — relate spacetime curvature to matter/energy. Depends on: Einstein tensor, stress-energy tensor
22. **Cosmological constant** — additional term in field equations, represents vacuum energy. Depends on: Einstein field equations
23. **Weak field limit** — approximation recovering Newtonian gravity. Depends on: Einstein field equations
24. **Schwarzschild solution** — spacetime geometry around spherical non-rotating mass. Depends on: Einstein field equations
25. **Event horizon** — boundary beyond which nothing can escape. Depends on: Schwarzschild solution
26. **Kerr solution** — spacetime around rotating mass. Depends on: Schwarzschild solution
27. **FRW cosmology** — expanding universe solutions. Depends on: Einstein field equations, metric tensor
28. **Gravitational waves** — ripples in spacetime curvature. Depends on: Einstein field equations, linearized gravity

## Dependencies

### Critical Path
The foundation builds in a strict sequence:
- **Manifolds → Tangent spaces → Tensors → Metric tensor** — can't skip any of these
- **Metric tensor → Connection → Curvature** — metric determines connection, connection determines curvature
- **Curvature → Einstein equations → Solutions** — must understand curvature before field equations

### Key Dependencies Explained
- **Geodesics** require both the metric tensor (to define "straight") and the connection (to compute the geodesic equation)
- **Riemann curvature** builds on parallel transport, which requires the connection, which comes from the metric
- **Einstein field equations** need both the Einstein tensor (purely geometric) and stress-energy tensor (matter content)
- **All exact solutions** (Schwarzschild, Kerr, FRW) require understanding the field equations and how to solve them

### Bottlenecks
1. **Tensors** — students often struggle with abstract multilinear algebra. This is the first major conceptual leap.
2. **Covariant derivative** — understanding why ordinary derivatives don't work on manifolds takes time
3. **Riemann curvature tensor** — incredibly abstract with many indices. This is the peak difficulty concept.
4. **Einstein field equations** — tying together all previous geometry with physical intuition about gravity

### Common Misconception Points
- **Manifolds vs. embeddings** — students think manifolds must live in higher-dimensional space
- **Covariant vs. contravariant** — confusion about upper vs. lower indices and what they mean
- **Curvature is intrinsic** — not about bending in external space, but about internal geometry
- **Metric determines everything** — once you have the metric, connection and curvature are derived, not independent
- **Coordinate independence** — physics doesn't depend on coordinates, but calculations often do

## Prerequisite Topics

- **Multivariable calculus** — needed for: manifolds, charts, differential forms, all derivative operations
- **Linear algebra** — needed for: tangent spaces, tensors, vector fields, metric tensor
- **Ordinary differential equations** — needed for: geodesic equations, parallel transport equations
- **Special relativity** — needed for: Lorentzian signature, Minkowski spacetime, causal structure, stress-energy tensor

## Learning Stages

### Stage 1: Differential Geometry (Lessons 1-10)
Build geometric toolkit independent of physics applications. Focus on abstract concepts and coordinate-free thinking.

### Stage 2: Riemannian Geometry (Lessons 11-19)
Add metric structure, connect to measurable quantities (distances, angles, curvature). Build geometric intuition.

### Stage 3: General Relativity Framework (Lessons 20-23)
Introduce Einstein's equations, connect geometry to physics, understand weak field limit.

### Stage 4: Applications (Lessons 24-28)
Study exact solutions and physical phenomena: black holes, cosmology, gravitational waves.

## Pedagogical Notes

- **Visual intuition first** — use 2D surfaces embedded in 3D before abstract manifolds
- **Concrete examples** — sphere, torus, hyperboloid before general Riemannian manifolds
- **Index notation gradually** — start with coordinate-free definitions, add indices only when computing
- **Computational tools** — use Python (OGRePy, EinsteinPy) or Mathematica for complex calculations
- **Physical motivation** — always tie back to why GR needs this machinery (equivalence principle, gravitational effects)
