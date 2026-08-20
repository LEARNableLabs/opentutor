# Concept Map: Origami Mathematics

**Topic:** Origami Mathematics
**Level:** Intermediate (STEM undergraduate / quantitatively literate professional / disciplined self-learner)
**Generated:** 2026-08-20

---

## 1. Core Concepts in Learning Order

| # | Concept | One-Line Description | Dependencies |
|---|---------|---------------------|--------------|
| 1 | **Crease Patterns as Planar Graphs** | A crease pattern is a planar graph embedded in a polygon: vertices are fold intersections, edges are crease lines, faces are paper regions, and each edge carries a mountain or valley label | External: graph theory, Euclidean geometry |
| 2 | **Matrix Representation of Folds** | Each fold along a crease line is a reflection in the plane, encoded as a 2x2 (or 3x3 homogeneous) matrix; composing folds is matrix multiplication | 1; External: linear algebra |
| 3 | **Single-Vertex Flat Folds** | The geometry of one interior vertex where multiple creases meet, analyzed for conditions under which the paper can fold flat without self-intersection | 1 |
| 4 | **Kawasaki's Theorem** | A single vertex folds flat if and only if the alternating sum of consecutive sector angles equals zero (equivalently, alternate angles sum to 180 degrees) | 3 |
| 5 | **Maekawa's Theorem** | At any flat-foldable vertex, M - V = +/-2, where M is the number of mountain folds and V the number of valley folds; a parity constraint that restricts valid crease assignments | 3 |
| 6 | **Two-Colorability of Crease Patterns** | Flat-foldable crease patterns induce a proper two-coloring of the face graph; a necessary structural condition derivable from Maekawa's constraint | 4, 5 |
| 7 | **Layer Ordering** | Assigning a stacking order (permutation) to faces of a folded model that is consistent with fold directions, face adjacency, and the non-crossing constraint (no face penetrates another) | 5, 6 |
| 8 | **Global Flat-Foldability** | The central synthesis: a crease pattern folds globally flat iff every vertex satisfies Kawasaki and Maekawa, every edge has a consistent mountain-valley assignment, and a valid global layer ordering exists | 4, 5, 6, 7 |
| 9 | **NP-Hardness of Flat-Foldability** | Bern and Hayes (1996) proved that deciding whether a crease pattern admits a mountain-valley assignment for global flat-foldability is NP-complete, via reduction from not-all-equal 3-SAT | 8 |
| 10 | **Huzita-Justin Axioms (O1-O7)** | Seven axioms defining all possible single-fold operations that align combinations of points and lines; the axiomatic foundation of origami as a construction system | 1 |
| 11 | **Compass-and-Straightedge vs. Origami Constructibility** | Classical Euclidean constructions solve linear and quadratic equations (degree-2 field extensions); origami axiom O6 (the Beloch fold) solves cubics (degree-3 extensions), strictly extending constructibility | 10; External: abstract algebra (field extensions) |
| 12 | **Angle Trisection by Folding** | Axiom O6 simultaneously aligns two points to two lines, encoding a cubic equation whose solution trisects an arbitrary angle -- resolving a 2,000-year-old impossibility for ruler and compass | 10, 11 |
| 13 | **Doubling the Cube by Folding** | Constructing cube-root-of-2 via fold alignments, achieving the second ancient Greek impossibility that is unreachable with compass and straightedge | 10, 11 |
| 14 | **Origami Number Fields** | Alperin's algebraic hierarchy: Pythagorean numbers (from O1-O4), Euclidean-constructible numbers (adding O5), and origami-constructible numbers (adding O6); each is a proper subfield of the next | 11, 12, 13; External: abstract algebra (Galois theory) |
| 15 | **Multi-Fold Axioms** | Alperin and Lang (2006) extended to two-fold operations: 17 two-fold alignments yield 489 distinct axiom operations, solving higher-degree polynomial equations and further expanding constructibility | 10, 14 |
| 16 | **Isometry Groups and Wallpaper Symmetry** | Crease patterns possess symmetries classified by point groups (single vertex) and wallpaper groups (periodic tessellations); fold operations are isometries that generate these groups | 2, 6; External: abstract algebra (group theory) |
| 17 | **Origami Tessellations** | Periodic crease patterns with translational symmetry: twist folds, pleats, and molecule tilings that tile the plane; governed by wallpaper-group constraints and local foldability conditions | 6, 8, 16 |
| 18 | **Rigid Origami Fundamentals** | Treating paper faces as rigid panels connected by hinges (crease lines); folding must preserve face planarity, imposing kinematic constraints absent in ordinary paper folding | 1, 2 |
| 19 | **Degree-4 Vertices and Rigid Foldability** | A degree-4 vertex admits continuous rigid folding iff the sector angles satisfy specific trigonometric constraints derived from Kawasaki's condition plus rigidity; generalized by Tachi (2009) | 4, 18 |
| 20 | **Miura-ori Pattern** | Koryo Miura's periodic degree-4 tessellation: one kinematic degree of freedom, flat-foldable, negative in-plane Poisson ratio, and deployable in a single motion; the archetypal rigid-origami pattern | 19 |
| 21 | **Rigid Origami Simulation** | Numerical methods for computing rigid folding motions: Tachi's constraint-based approach solves for fold angles satisfying rigidity at each vertex across the entire pattern | 18, 19, 20 |
| 22 | **Tree Method and Uniaxial Bases** | Lang's method: encode a desired origami base as a stick figure (tree graph), then compute a crease pattern via circle/river packing that folds into a uniaxial base with flaps of prescribed lengths | 8, 2; External: optimization |
| 23 | **Universal Molecules** | Convex polygon regions in a circle-packing layout that fill gaps between disks; each molecule admits a flat-foldable crease pattern, enabling the tree method to produce complete bases for arbitrary figures | 22 |
| 24 | **TreeMaker Algorithm** | Computational implementation of the tree method: a constrained optimization program that takes a tree graph as input and outputs a complete crease pattern for a square sheet | 22, 23 |
| 25 | **Fold-and-Cut Theorem** | Demaine, Demaine, and Lubiw (1999): any shape bounded by straight edges can be cut from a single straight cut after appropriate flat folding; a universality result for straight-cut origami | 8 |
| 26 | **Origamizer Algorithm** | Demaine and Tachi (2017): a constructive proof that any oriented polyhedral surface can be folded from a single sheet of paper, using a tuck-folding strategy to hide excess material | 8, 22, 24 |
| 27 | **Curved Crease Folding** | Folding along curved (non-straight) crease lines; the folded surface becomes a ruled surface, connecting origami to differential geometry of developable surfaces | 18, 2 |
| 28 | **Origami Metamaterials** | Engineering materials whose bulk mechanical properties (Poisson ratio, stiffness, bistability) derive from origami fold geometry rather than material composition; Miura-ori unit cells are mechanically bistable and reprogrammable | 20, 21 |
| 29 | **Deployable Structures** | Real-world systems that use origami kinematics: solar panel arrays (Miura-ori in space, 1995), medical stents, airbag packing, and reconfigurable architectural systems | 20, 21, 28 |
| 30 | **Parameterized Complexity of Folding** | Eppstein (2024): flat-folding is fixed-parameter tractable in ply and treewidth under the exponential time hypothesis, revealing that structured crease patterns escape worst-case NP-hardness | 9 |
| 31 | **Turing Completeness of Flat Origami** | Hull and Zakharevich (2023): flat origami mappings with layer ordering can simulate any Turing machine; paper folding is a computationally universal model of computation | 7, 8, 9, 30 |

---

## 2. Dependency Graph

```
                      EXTERNAL PREREQUISITES
         [Euclidean    [Linear    [Graph     [Abstract   [Optimization/
          Geometry]    Algebra]    Theory]    Algebra]     Complexity]
              |           |          |           |            |
              +-----+-----+          |           |            |
                    |                |           |            |
                    v                v           |            |
           (1) CREASE PATTERNS AS PLANAR GRAPHS  |            |
            |        |         |          |      |            |
            |        v         |          |      |            |
            |   (2) Matrix     |          |      |            |
            |    Representation|          |      |            |
            |     |    |       |          |      |            |
            v     |    |       v          |      |            |
       (3) Single-|    |   (10) Huzita-  |      |            |
        Vertex    |    |    Justin Axioms |      |            |
        Flat Folds|    |       |          |      |            |
         /    \   |    |       v          v      |            |
        v      v  |    |  (11) Compass  --------->            |
     (4)      (5) |    |   vs. Origami                        |
   Kawasaki  Maekawa   |    /      \                          |
      |    \  /   |    |   v        v                         |
      |     vv    |    | (12)     (13)                        |
      |   (6) Two-|    | Angle    Doubling                    |
      |  Colorab. |    | Trisect  the Cube                    |
      |     |     |    |    \      /                           |
      |     v     |    |     v    v                            |
      |  (7) Layer|    |  (14) Origami                        |
      |   Ordering|    |   Number Fields                      |
      |     |     |    |       |                              |
      v     v     |    |       v                              |
   (8) GLOBAL     |    |  (15) Multi-Fold                     |
    FLAT-FOLD-    |    |   Axioms                              |
    ABILITY       |    |                                      |
    / | | \  \    |    |                                      |
   /  | |  \  \   |    |                                      |
  v   | |   v  \  |    v                                      |
(9)   | | (25)  \ | (16) Isometry                             |
NP-   | | Fold-  \|  Groups &                                 |
Hard  | | and-Cut \  Wallpaper                                 |
 |    | |         \     |                                     |
 |    | |          v    v                                     |
 |    | |     (17) Origami                                    |
 |    | |      Tessellations                                  |
 |    | |                                                     |
 |    | +----------+                                          |
 |    |            |                                          |
 |    v            v                                          v
 | (22) Tree   (18) RIGID ORIGAMI  <--------------------------+
 |  Method      FUNDAMENTALS                                  |
 |    |            |                                           |
 |    v            v                                           |
 | (23) Univ.  (19) Degree-4                                   |
 |  Molecules   Vertices & Rigid                               |
 |    |            |                                           |
 |    v            v                                           |
 | (24)        (20) MIURA-ORI                                  |
 | TreeMaker       |                                           |
 |    |            v                                           |
 |    |        (21) Rigid Origami                              |
 |    |         Simulation                                     |
 |    |            |          \                                |
 |    v            |           v                               |
 | (26) ORIGAMIZER |       (27) Curved Crease                 |
 |                 |         Folding                           |
 |                 |            |                              |
 |                 v            v                              |
 |             (28) Origami Metamaterials                      |
 |                     |                                      |
 |                     v                                      |
 |             (29) Deployable Structures                     |
 |                                                            |
 v                                                            |
(30) Parameterized                                            |
 Complexity                                                   |
 |                                                            |
 v                                                            |
(31) TURING COMPLETENESS                                      |
 OF FLAT ORIGAMI                                              |
```

### Branch Structure

The course divides into four major branches after the shared foundation (1-8):

```
     FOUNDATION (1-8)
     Crease patterns, Kawasaki, Maekawa, layer ordering, global flat-foldability
         |
    +----+----+------------+------------------+
    |         |            |                  |
    v         v            v                  v
 ALGEBRAIC  COMPUTATIONAL  RIGID/           TRANSFORMATION
 BRANCH     BRANCH         ENGINEERING      BRANCH
 (10-15)    (9, 22-26,     BRANCH           (2, 16)
             30-31)        (18-21, 27-29)
```

---

## 3. Bottleneck Concepts

These are the "gates" -- if the student does not solidly grasp them, entire downstream branches collapse.

| # | Concept | Why It Gates Everything | What It Blocks |
|---|---------|------------------------|----------------|
| 1 | **Crease Patterns as Planar Graphs** | Every theorem, algorithm, and application operates on crease patterns. A student who cannot fluently read, draw, and reason about crease patterns as combinatorial-geometric objects will be unable to state or apply any result in the course. | All 30 downstream concepts |
| 4 | **Kawasaki's Theorem** | The single most-used local condition in flat-foldability theory. Students who memorize "alternating angles sum to 180" without understanding why (the folded images of rays around the vertex must coincide) cannot extend the reasoning to multi-vertex patterns, rigid foldability, or tessellations. | 6, 7, 8, 9, 17, 19-31 |
| 8 | **Global Flat-Foldability** | The central object of study. It synthesizes three local conditions (Kawasaki, Maekawa, layer ordering) into a global consistency problem. Weak understanding here means the student cannot engage with complexity theory (9, 30, 31), design algorithms (22-26), or the fold-and-cut theorem (25). | 9, 22-26, 25, 30, 31 |
| 10 | **Huzita-Justin Axioms** | The algebraic backbone of the constructibility branch. Students who treat the seven axioms as a list to memorize, rather than as geometric operations that encode polynomial equations of specific degrees, will miss the entire power comparison with classical constructions. | 11-15 |
| 18 | **Rigid Origami Fundamentals** | Gateway to all engineering applications. The conceptual leap from "paper folds" (faces can bend) to "rigid folding" (faces are rigid panels, only hinges move) is what separates mathematical origami from origami engineering. Without it, metamaterials and deployable structures are inaccessible. | 19-21, 27-29 |
| 22 | **Tree Method and Uniaxial Bases** | The core of computational origami design. Understanding how a desired shape (stick figure) maps to a circle-packing problem on a flat sheet, and why this produces a valid crease pattern, is prerequisite for TreeMaker, universal molecules, and the Origamizer. | 23, 24, 26 |

---

## 4. Mind-Blowing Concepts

These are the "aha!" moments that sustain motivation and reshape how the student thinks about mathematics.

| # | Concept | The "Aha!" Moment | Suggested Day |
|---|---------|-------------------|---------------|
| 4 | **Kawasaki's Theorem** | "Whether a vertex folds flat depends ONLY on the angles between creases, not on mountain-valley assignments, not on paper thickness, not on skill. And the test is just: do alternating angles sum to 180 degrees? I can verify it in five seconds with a protractor." | Day 8 |
| 11 | **Compass-and-Straightedge vs. Origami** | "Paper folding is strictly MORE powerful than compass and straightedge? The problems the Greeks spent 2,000 years proving impossible -- trisecting angles, doubling cubes -- are trivial with a sheet of paper? The 'limitation' was never geometry itself, but which operations you allow." | Day 3 |
| 12 | **Angle Trisection by Folding** | "I just trisected an arbitrary angle with two physical folds. Wantzel proved this impossible in 1837 -- but only with the wrong tools. The Beloch fold (axiom O6) encodes a cubic equation that compass-and-straightedge cannot reach. I can feel abstract algebra in my fingers." | Day 2 |
| 9 | **NP-Hardness of Flat-Foldability** | "A six-year-old can fold a paper crane in minutes, but deciding the optimal mountain-valley assignment for a crease pattern is as hard as any problem in computer science? The contrast between easy local conditions and hard global consistency is the same phenomenon that makes SAT hard." | Day 26 |
| 25 | **Fold-and-Cut Theorem** | "ANY shape made of straight edges -- any polygon, any collection of polygons, a fractal snowflake outline -- can be produced from a single straight cut after folding? And this is a theorem, not a trick? The universality is staggering." | Day 19 (activity in review) |
| 20 | **Miura-ori Pattern** | "One repeating degree-4 vertex pattern was deployed on a Japanese satellite in 1995, explains how leaves unfurl in nature, has a negative Poisson ratio that no conventional material possesses, and folds flat with a single degree of freedom. All from repeating one vertex." | Day 21 |
| 31 | **Turing Completeness of Flat Origami** | "Flat origami can simulate any computation a Turing machine can perform. Paper folding is not a corner of recreational mathematics -- it is a computationally universal model of computation, as powerful as any programming language." | Day 27 |

---

## 5. Common Misconceptions

| Concept | Misconception | Reality |
|---------|--------------|---------|
| Kawasaki's Theorem (4) | "If the angles satisfy Kawasaki's condition, the vertex can definitely fold flat." | Kawasaki's theorem is necessary but not sufficient for flat-foldability. You also need a valid mountain-valley assignment satisfying Maekawa's theorem (M - V = +/-2) and a non-crossing layer ordering. Kawasaki constrains geometry; Maekawa and layer ordering constrain combinatorics. |
| Maekawa's Theorem (5) | "Mountain and valley folds are nearly equal in number at a vertex." | Maekawa says M - V = +/-2, not M approximately equal to V. At a degree-6 vertex, the split is 4M-2V or 2M-4V -- never 3-3. The imbalance is exactly 2, always. |
| Global Flat-Foldability (8) | "If every vertex individually satisfies Kawasaki and Maekawa, the whole pattern folds flat." | Local validity is necessary but not sufficient. Layer-ordering conflicts between faces sharing no vertex can prevent global folding even when every vertex is locally perfect. This gap is precisely what makes the problem NP-hard. |
| Huzita-Justin Axioms (10) | "There are six origami axioms (Huzita's six)." | There are seven. Jacques Justin enumerated all seven in 1986, predating Huzita's independent discovery of six in 1989. Koshiro Hatori rediscovered the seventh in 2001. The complete set is properly called the Huzita-Justin (or Huzita-Hatori) axioms. |
| Origami vs. Compass (11) | "Origami can construct any number." | Single-fold origami axioms construct exactly the numbers obtainable from nested square roots and cube roots (origami-constructible numbers). This strictly contains compass-and-straightedge numbers but does not contain all algebraic numbers. Regular 7-gon and 9-gon remain non-constructible by single folds. Multi-fold operations extend further but are still bounded. |
| Angle Trisection (12) | "Origami trisects angles because paper is more flexible than a ruler." | The power comes from axiom O6 (the Beloch fold), which simultaneously aligns two points to two lines. This alignment encodes a cubic equation. It is the algebraic degree of the operation (degree 3 vs. degree 2), not any physical property of paper, that enables trisection. |
| Rigid Origami (18) | "All origami models are rigid-foldable if you use stiff enough material." | Most crease patterns are NOT rigid-foldable. Rigid foldability imposes severe kinematic constraints (faces must remain planar, only hinges rotate). Many beautiful paper models rely on face bending, which rigid panels cannot do. The rigidity constraint eliminates most of the configuration space. |
| Miura-ori (20) | "The Miura fold was designed for space applications." | Koryo Miura studied it in the 1970s as a mathematical curiosity arising from shell buckling research. The space deployment application (Japanese Space Flyer Unit, 1995) came two decades later. The pattern's mathematical properties were studied before any engineering use. |
| NP-Hardness (9) | "NP-hard means impossible to solve." | NP-hard means no known polynomial-time algorithm exists, and none is expected unless P = NP. Small instances are solved routinely. Practical origami designs avoid worst cases. Eppstein (2024) showed the problem is fixed-parameter tractable in ply and treewidth -- structured instances are efficiently solvable. |
| Tree Method (22) | "The tree method can design any origami model." | The tree method designs uniaxial bases (all flaps emanate from a common plane). Many origami models require non-uniaxial bases, box-pleating, 22.5-degree systems, or other techniques entirely outside the tree method's scope. The Origamizer generalizes further but uses a different approach. |
| Crease Patterns (1) | "A crease pattern uniquely determines the folded model." | A single crease pattern can admit multiple distinct folded states (different mountain-valley assignments and layer orderings). The crease pattern constrains but does not determine the final form. This ambiguity is central to the NP-hardness result. |

---

## 6. Prerequisite Topics

| External Topic | Level Needed | Which Concepts It Enables | Notes for This Student |
|---------------|-------------|--------------------------|----------------------|
| **Euclidean Geometry** | Solid high school: angle measurement, triangle congruence, polygon properties, reflections, basic compass-and-straightedge constructions | 1, 3, 4, 5, 6, 10, 11, 12 | Must be comfortable reasoning about angles, perpendiculars, and reflections without coordinates. If the student can state the inscribed angle theorem and perform a compass bisection, they are ready. |
| **Linear Algebra** | First course: vectors, matrices, matrix multiplication, reflections as linear maps, eigenvalues, orthogonal matrices | 2, 16, 18, 19, 20, 21, 27 | Needed for matrix representations of folds, rigid origami kinematics, and the transformation-composition view of folding. Rotation and reflection matrices must be second nature. |
| **Graph Theory** | Introductory: planar graphs, vertices/edges/faces, Euler formula, graph coloring, dual graphs, trees | 1, 6, 7, 8, 9, 22 | Crease patterns are planar graphs. Two-colorability, tree structures for base design, and Euler's formula for face counting all require graph-theoretic fluency. The student's prior work in category theory (commutative diagrams) and juggling (state diagrams) provides useful graph intuition. |
| **Abstract Algebra** | Intermediate: groups, field extensions, minimal polynomials, degree of extensions over Q, basic Galois theory | 11, 12, 13, 14, 15, 16 | Understanding why origami surpasses compass-and-straightedge requires knowing that ruler-compass constructions yield degree-2 field extensions while the Beloch fold yields degree-3 extensions. The student's category theory background (monoids, groups, isomorphisms) provides the algebraic maturity needed. |
| **Combinatorics** | Counting arguments, parity reasoning, inclusion-exclusion, constraint satisfaction | 5, 6, 7, 8, 9, 30, 31 | Maekawa's theorem is a parity argument. Layer ordering is combinatorial constraint satisfaction. The student's prior work counting valid siteswap patterns in juggling mathematics provides directly transferable enumeration intuition. |
| **Computational Complexity** | P vs NP, NP-completeness, polynomial reductions, basic parameterized complexity | 9, 30, 31 | Needed to appreciate Bern-Hayes (NP-hardness) and Hull-Zakharevich (Turing completeness). Can be taught as a self-contained module if the student lacks CS background, since the reductions use origami-native constructions. |
| **Trigonometry** | Unit circle, sine/cosine, angle addition formulas, inverse trig functions | 4, 12, 19 | Kawasaki's theorem and angle trisection both require facility with angle arithmetic. Rigid foldability at degree-4 vertices involves trigonometric constraint equations. |
| **Basic Origami Practice** | Can fold standard models (crane, waterbomb base, simple tessellations); reads mountain/valley diagrams fluently | 1, 3, 5, 18, 20, 17 | Physical intuition is essential. Theorems about foldability land differently when the student can fold a counterexample. An intermediate student should already have this. |
| **Optimization** (helpful, not required) | Constrained optimization, linear/quadratic programming basics | 22, 24, 26 | TreeMaker formulates base design as a constrained optimization problem. The student's optimal transport background (Kantorovich LP, duality) provides excellent preparation for understanding the objective functions and constraints in origami design algorithms. |

---

## 7. Cross-Topic Connections

The student has previously studied **Category Theory**, **Optimal Transport**, and **Mathematics of Juggling**. These connections should be activated at specific points in the course to deepen understanding and reinforce prior learning.

### From Category Theory

| CT Concept | Origami Connection | When to Activate |
|-----------|-------------------|-----------------|
| Monoids and groups (CT concept 2) | The dihedral groups governing single-vertex symmetry, and the 17 wallpaper groups classifying origami tessellation symmetry, are the same algebraic structures studied categorically. Modular origami units often possess the symmetry of a finite group acting on a polyhedron. | Concept 16 (Isometry Groups), Day 17 |
| Isomorphisms and equivalence (CT concept 6) | Two crease patterns that differ only by rigid motion of the plane are "the same" crease pattern. The categorical notion of isomorphism (structure-preserving invertible map) is exactly the right framework for classifying crease patterns up to geometric equivalence. | Concept 1 (Crease Patterns), Day 1 |
| Composition of transformations (CT concept 1) | Composing fold operations as geometric transformations mirrors function composition. The monoid of fold sequences (compose two fold sequences to get a third) is a concrete instance of the composition structure the student studied abstractly. | Concept 2 (Matrix Representation), Day 1 |
| Commutative diagrams (CT concept 5) | The dependency structure of crease-pattern validity (Kawasaki at each vertex, Maekawa at each vertex, layer ordering globally) can be visualized as a diagram that must "commute" -- all paths to validity must agree. | Concept 8 (Global Flat-Foldability), Day 11 |
| Functors as structure-preserving maps (CT concept 11) | The map from "crease pattern" to "folded geometric realization" is functorial: it must send composition of folding operations to composition of spatial embeddings. When the student encounters the Origamizer, they can view it as constructing an inverse to this functor. | Concept 26 (Origamizer), Day 18 |
| Duality / opposite categories (CT concept 13) | Mountain-valley duality in origami (swapping all M and V labels preserves flat-foldability) mirrors categorical duality, where every theorem has a free dual theorem. Maekawa's M - V = +2 dualizes to M - V = -2. | Concept 5 (Maekawa's Theorem), Day 9 |
| Groupoids (CT day 4) | The collection of fold-unfold sequences on a crease pattern forms a groupoid (each fold is invertible, but different base vertices give different morphism sets), not a group. This is a precise and satisfying instance of the groupoid concept. | Concept 18 (Rigid Origami Fundamentals), Day 20 |

### From Optimal Transport

| OT Concept | Origami Connection | When to Activate |
|-----------|-------------------|-----------------|
| Linear programming and Kantorovich duality (OT day 2) | TreeMaker formulates base design as a constrained optimization problem with inequality constraints on circle radii. The LP duality the student learned in OT carries over: dual variables in the origami LP correspond to "tension" in the crease pattern, analogous to dual potentials in transport. | Concept 24 (TreeMaker Algorithm), Day 15 |
| Convex geometry and Brenier's theorem (OT day 7) | The convex polygon decompositions central to universal molecules and the convex-hull computations in TreeMaker use the same geometric toolkit the student encountered in Brenier's theorem (gradients of convex functions). | Concept 23 (Universal Molecules), Day 14 |
| Tessellations and Voronoi/power diagrams (OT day 14) | Both origami tessellations and semidiscrete OT partition a planar region into cells governed by distance/angle constraints. Understanding Laguerre diagrams enriches intuition for how origami tessellation molecules tile the plane. | Concept 17 (Origami Tessellations), Day 17 |
| Isometric deformation and Wasserstein geodesics (OT day 9) | Paper is inextensible -- folding preserves intrinsic distances (an isometry constraint). This is a discrete analog of the geodesic problem in Wasserstein space: both study structure-preserving deformations of geometric objects. Rigid origami continuous folding is finding a geodesic in a constrained configuration space. | Concept 18 (Rigid Origami Fundamentals), Day 20 |

### From Mathematics of Juggling

| Juggling Concept | Origami Connection | When to Activate |
|-----------------|-------------------|-----------------|
| Combinatorial enumeration via local constraints (siteswap average theorem) | Counting valid flat-foldable crease assignments under Kawasaki-Maekawa constraints is structurally analogous to counting valid siteswap patterns: both require that local constraints at each "site" (vertex / beat) compose into globally valid configurations. | Concept 8 (Global Flat-Foldability), Day 11 |
| State-transition graphs | The dual graph of a crease pattern (faces as nodes, creases as edges) plays the same structural role as the juggling state graph: reachability and validity are analyzed across a discrete graph subject to local constraints. | Concept 1 (Crease Patterns), Day 1 |
| Finite group symmetry of periodic patterns | Cyclic and dihedral symmetries classifying periodic juggling patterns directly parallel the symmetry analysis of origami tessellations. Both domains classify repeating spatial/temporal structures using the same algebraic toolkit. | Concept 16 (Isometry Groups), Day 17 |
| Discrete sequences with ordering constraints | Siteswap sequences have the "no two balls land at the same time" constraint; origami layer orderings have the "no two faces occupy the same position" constraint. Both are permutation problems with geometric/physical admissibility conditions. | Concept 7 (Layer Ordering), Day 11 |

---

## 8. Learning Path Summary

The course follows five modules sequentially, each building on the previous, with review days providing consolidation and spaced repetition.

### Phase 1: The Power of a Single Fold (Days 1-6)
Concepts 10-15, 1, 2. Discover that origami axioms define a construction system strictly more powerful than compass and straightedge. Build from folds as reflections through the Huzita-Justin axioms to angle trisection, cube doubling, and the hierarchy of origami-constructible numbers. Multi-fold axioms complete the picture. This phase connects to the student's abstract algebra background through field extensions and Galois theory.

### Phase 2: When Can Paper Lie Flat? (Days 7-13)
Concepts 3-8. Build fluency with flat-foldability as the central problem of origami mathematics. Establish the three pillars: Kawasaki's theorem (angle geometry), Maekawa's theorem (mountain-valley parity), and layer ordering (global consistency). Progress from single-vertex conditions to multi-vertex flat foldability and the combinatorics of valid MV assignments.

### Phase 3: Designing Origami by Algorithm (Days 14-19)
Concepts 22-26, 16, 17. Learn how computational origami turns design problems into optimization problems (tree method, circle-river packing, TreeMaker) and proves universality results (Origamizer, fold-and-cut theorem). Study tessellations and wallpaper group symmetries.

### Phase 4: Rigid Folds and Real Materials (Days 20-25)
Concepts 18-21, 27-29. Shift from paper that bends to panels that hinge. Study rigid origami fundamentals, the Miura-ori pattern, mechanical metamaterials, coupled tubes, thick-panel origami, and deployable structures. This is where mathematics meets engineering.

### Phase 5: Complexity, Computation, and Open Frontiers (Days 26-30)
Concepts 9, 30, 31, plus open problems. NP-hardness of flat-foldability, parameterized complexity, and Turing completeness of flat origami. Random flat-foldable origami and connections to statistical mechanics. Open research questions (map folding, curved-crease differential geometry, modular origami combinatorics, higher-dimensional folding). Capstone synthesis connecting origami mathematics to the student's wider mathematical universe.

### Interleaving Strategy
The course follows the curriculum modules sequentially: axioms and constructibility (days 1-6), then flat-foldability (days 7-13), then algorithmic design (days 14-19), then rigid origami and engineering (days 20-25), then complexity and frontiers (days 26-30). Review days at 6, 13, 19, 25, and 30 provide spaced repetition and consolidation.
