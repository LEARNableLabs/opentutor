# Robotics — Kinematics and Motion Planning — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 8 lessons (30%)
- **Socratic questions** — 7 lessons (26%)
- **real-world application challenges** — 6 lessons (22%)
- **teach-back exercises (student explains)** — 4 lessons (15%)
- **review and consolidation sessions** — 2 lessons (7%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 30% accessible (1-2), 41% standard (3), 30% challenging (4-5).

Difficulty peaks:
- Day 5: "Why can't my robot move in certain directions?" (difficulty 4)
- Day 11: "Why does the curse of dimensionality break grid-based planning?" (difficulty 4)
- Day 17: "Why are RRT paths so jagged and inefficient?" (difficulty 4)
- Day 18: "How can we guide sampling toward better solutions?" (difficulty 4)
- Day 22: "What if we plan directly in trajectory space?" (difficulty 5)

## Domain Hooks
Fascinating tangents to deploy strategically:

1. **The "Piano Mover's Problem"** (Lesson 7)
   - Drop when introducing C-space
   - Classic computational geometry problem: can we move a piano through a building?
   - Connects to C-space obstacles and path planning complexity
   - Fun historical context: proved PSPACE-hard in 1979

2. **The Jacobian's Geometric Interpretation via Lie Theory** (Lesson 5)
   - Drop when discussing velocity kinematics
   - Jacobian relates joint velocities (tangent space to configuration manifold) to end-effector twist (Lie algebra se(3))
   - Beautiful connection to differential geometry
   - Teaser for advanced study: screw theory and geometric mechanics

3. **RRT as a Monte Carlo Sampling of Voronoi Regions** (Lesson 15)
   - Drop when introducing RRT
   - RRT's bias explained: nearest-neighbor selects based on Voronoi regions, so larger regions are more likely sampled
   - Connects to computational geometry and probability theory
   - Explains why RRT

## Common Failure Modes
1. **"Inverse kinematics is just algebra"**
   - Why students think this: Forward kinematics uses clean matrix multiplications, so they expect IK to be similarly straightforward
   - Reality: IK involves solving nonlinear equations with multiple solutions, no solutions, and numerical challenges
   - How to correct: Show concrete examples where multiple arm configurations reach the same point, and cases where no solution exists (outside workspace)

2. **"The Jacobian is only about differentiation"**
   - Why students think this: It's introduced as the derivative of forward kinematics
   - Reality: The Jacobian has deep geometric meaning — it maps velocity, reveals singularities, and determines manipulability
   - How to correct: Visualize the Jacobian's null space at singularities and show manipulability ellipsoids

3. **"Configuration space is always R^n for n joints"**
   - Why students think this: True for simple manipulators without constraints
   - Reality: Closed kinematic chains,

## Vocabulary
Key terms for this domain: rigid body transformations, rotation matrices, homogeneous coordinates, forward kinematics, Denavit-Hartenberg parameters, product of exponentials, inverse kinematics, analytical solutions, geometric approaches, multiple solutions, numerical inverse kinematics, Jacobian pseudoinverse, iterative methods, Jacobian matrix, velocity kinematics (and 79 more).