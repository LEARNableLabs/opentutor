# Robotics — Kinematics and Motion Planning: Teaching Notes

## Approach

This topic is best taught through a **build-test-visualize** cycle. At the intermediate level, students need both mathematical rigor and hands-on implementation. Every major concept should be accompanied by working code that students can run, modify, and visualize. The field is highly visual — always show animations of robot motion, configuration spaces, and planning algorithms in action. Balance formal derivations with geometric intuition, and connect abstract algorithms to real robotics applications (manipulation, autonomous driving, drones, space robots).

## Common Misconceptions

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
   - Reality: Closed kinematic chains, mobile robots, and systems with constraints have more complex C-spaces (quotient spaces, manifolds)
   - How to correct: Show a four-bar linkage where C-space is a torus, or a mobile robot where C-space is SE(2)

4. **"More DOF always means better"**
   - Why students think this: Seems like more joints = more flexibility
   - Reality: More DOF means higher-dimensional planning, slower algorithms, and harder control
   - How to correct: Compare planning time for 3-DOF vs. 7-DOF arms in same environment

5. **"RRT explores uniformly"**
   - Why students think this: "Random" suggests uniform sampling
   - Reality: RRT has a strong Voronoi bias — it grows toward large unexplored regions
   - How to correct: Animate RRT growth and visualize Voronoi regions, show how bias differs from uniform random walk

6. **"Collision checking is cheap"**
   - Why students think this: Seems like simple geometry
   - Reality: Often the computational bottleneck in motion planning
   - How to correct: Profile a planner and show that 90%+ of time is collision detection, discuss spatial data structures

7. **"Optimal planning always finds the shortest path"**
   - Why students think this: "Optimal" sounds like "shortest"
   - Reality: Optimality is with respect to a cost function — could be energy, time, smoothness, etc.
   - How to correct: Show different cost functions producing different "optimal" paths

8. **"Planned trajectories are always executable"**
   - Why students think this: If it's collision-free in C-space, it should work
   - Reality: Dynamic constraints (velocity, acceleration, jerk, torque limits) may be violated
   - How to correct: Generate a geometrically valid path that requires infinite acceleration, show robot failure

9. **"Motion planning is solved"**
   - Why students think this: Lots of algorithms, successful robotics demos
   - Reality: High-dimensional planning, dynamic environments, contact-rich manipulation remain challenging
   - How to correct: Show failure cases — narrow passages, kinodynamic constraints, manipulation planning

10. **"Sampling-based planners need uniform random sampling"**
    - Why students think this: Algorithms are often introduced with uniform sampling
    - Reality: Informed, heuristic-guided, or learned sampling distributions can dramatically improve performance
    - How to correct: Compare uniform vs. informed RRT*, show orders of magnitude speedup

## Level Adjustments

### For Intermediate Students (this curriculum)
- **Emphasis**: Both theory and implementation, balanced mathematical formalism with practical coding
- **Formalism**: Derive key equations (forward kinematics, Jacobian, RRT* rewiring cost), but skip measure-theoretic proofs
- **Implementation**: Expect students to write core algorithms (FK/IK solvers, RRT, A*) from scratch, not just use libraries
- **Depth**: Cover both classical and modern approaches, understand trade-offs, know when to use each method
- **Math prerequisites**: Comfortable with linear algebra, multivariable calculus, basic probability
- **Tools**: Python with NumPy, robotics simulation libraries (RTB-P, PyBullet, ROS basics)
- **Skip**: Lie groups, differential manifolds, optimal control theory (save for advanced)
- **Include**: Configuration space topology, probabilistic completeness, asymptotic optimality (intuitive level)

### Adjustments for Beginner Level
- More visual, less formal
- Focus on forward kinematics and simple planning (A*, potential fields)
- Skip: Jacobians, sampling-based optimal planning, trajectory optimization
- Use pre-built simulators and libraries rather than implementing from scratch
- Emphasize 2D examples before 3D
- Math prerequisites: basic linear algebra (vectors, matrices), trigonometry

### Adjustments for Advanced Level
- Rigorous proofs of probabilistic completeness and asymptotic optimality
- Lie theory for kinematics (SE(3), screw theory, product of exponentials)
- Optimal control (LQR, iLQG, DDP) for trajectory optimization
- Learning-based planning (neural motion planners, RL for manipulation)
- Real-time planning and control integration (MPC, whole-body control)
- Contact mechanics and hybrid dynamics
- Expect implementation in C++ for performance, ROS 2 for integration

## Rabbit Holes

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
   - Explains why RRT explores so efficiently

4. **Narrow Passage Problem and Measure-Theoretic Challenges** (Lesson 16)
   - Drop when discussing PRM limitations
   - Why probabilistic planners struggle with narrow passages: zero measure in configuration space
   - Connects to measure theory and topology
   - Motivates adaptive sampling strategies

5. **The Dubins Car and Kinodynamic Planning** (Lesson 23)
   - Drop when discussing dynamic constraints
   - Simplest kinodynamic system: car that can't move sideways
   - Optimal paths are arcs and straight lines (Dubins curves)
   - Beautiful example of how dynamics change the planning problem

6. **Differentiable Physics and Neural Motion Planning** (Lesson 26)
   - Drop during reactive planning discussion
   - Modern frontier: end-to-end learned planners using differentiable simulation
   - Connects to machine learning, automatic differentiation
   - Example: MIT's neural motion planner, MuJoCo's recent advances

7. **The Homology Class of Paths** (Lesson 10)
   - Drop when discussing roadmap methods
   - Not all paths are continuously deformable to each other (topological concept)
   - Matters for completeness: need paths in all homology classes
   - Connects to algebraic topology

8. **Chapman-Kolmogorov and Probabilistic Completeness** (Lesson 14)
   - Drop when introducing sampling-based planning
   - Formal proof that PRM is probabilistically complete uses Chapman-Kolmogorov equation
   - Connects to stochastic processes and measure theory
   - Shows the deep mathematics underlying practical algorithms

## Difficulty Progression Notes

The curriculum has three difficulty peaks:

**Peak 1: Singularities and Manipulability (Lesson 5, difficulty 4)**
- First conceptually challenging topic
- Requires understanding rank, null space, geometric interpretation
- Students must synthesize linear algebra with physical robot behavior
- Mitigation: Spend extra time on visualizations, use simple 2D examples first

**Peak 2: High-Dimensional Planning and Curse of Dimensionality (Lesson 11, difficulty 4)**
- Students confront exponential complexity
- May feel discouraged about grid-based methods they just learned
- Important pedagogical moment: motivates sampling-based planning
- Mitigation: Make it a "revelatory crisis" — immediately show that sampling-based methods sidestep this issue

**Peak 3: Trajectory Optimization (Lesson 22, difficulty 5)**
- Hardest topic in curriculum
- Requires understanding optimization theory, gradients in trajectory space, constraint handling
- Peak difficulty justified: this is cutting-edge research area
- Mitigation: Position as "advanced preview," okay to understand conceptually rather than master implementation

**Review Lessons (12, 19)**: Strategically placed after peaks to consolidate, difficulty 1 for breathing room

**Teach-Back Lessons (6, 13, 20, 27)**: Hands-on projects at difficulty 2-3, designed for synthesis and confidence building

## Assessment Strategies

### Formative Assessment (during lessons)

1. **Visualization checks**: "Sketch the robot in this configuration" or "Draw the C-space obstacles for this scenario"
2. **Predict-then-verify**: "Will this configuration be a singularity?" then compute Jacobian rank
3. **Debug challenges**: Provide buggy kinematics or planning code, ask student to find and fix errors
4. **Parameter sensitivity**: "What happens if we increase RRT step size?" — develops intuition
5. **Trade-off discussions**: "When would you use PRM vs. RRT?" — tests conceptual understanding

### Summative Assessment (end of module)

1. **Implement-from-scratch challenges** (Lessons 6, 13, 20, 27)
   - Forward kinematics for a 3-DOF arm
   - A* planner for a 2D mobile robot
   - RRT and RRT* for a 2D arm
   - Complete planning + control system for a task

2. **Analysis questions**
   - Prove a 2-DOF planar arm has a singularity when fully extended
   - Analyze time complexity of grid-based A* vs. RRT for n-dimensional C-space
   - Compare path quality of RRT, RRT*, and trajectory optimization

3. **Design tasks**
   - Design a robot arm that can reach all points in a hemispherical workspace
   - Choose a planning algorithm for a specific application and justify
   - Design a cost function for trajectory optimization that balances speed and smoothness

### Red Flags (student needs help)

- Can't visualize transformations or coordinate frames (Lessons 1-2)
- Struggles to implement forward kinematics (Lesson 2)
- Doesn't understand why IK has multiple solutions (Lesson 3)
- Can't explain difference between C-space and workspace (Lesson 7)
- Thinks RRT is optimal or uniform-random (Lessons 15, 17)
- Can't identify when to use different planning algorithms (after Lesson 20)

### Green Flags (student is thriving)

- Asks about extending DH parameters to closed chains
- Implements Jacobian damping for singularity avoidance without prompting
- Proposes hybrid planners (e.g., RRT-Connect)
- Connects trajectory optimization to optimal control theory
- Suggests learned heuristics for informed sampling
- Reads research papers on recent planning algorithms

## Delivery Variations by Lesson Type

- **Mini-lessons**: Standard tutorial format with worked examples
- **Questions**: Socratic method — ask, let them reason, guide to answer
- **Resource-drops**: Curated video or interactive tool, followed by reflection
- **Teach-backs**: Specify the task, provide starter code/setup, review their implementation
- **Real-world**: Start with application (drone navigation, manipulation task), work backward to theory
- **Reviews**: Spaced repetition of previous concepts, quiz format or synthesis problems

## Integration with Tools

Students should gain proficiency with:

1. **Peter Corke's Robotics Toolbox for Python** — gold standard for educational robotics
   - Use for: visualizing robot models, FK/IK verification, Jacobian computation
   - Introduce: Lesson 2 (forward kinematics)
   
2. **PyBullet** — lightweight physics simulation
   - Use for: dynamic simulation, testing trajectory tracking
   - Introduce: Lesson 22 (trajectory optimization and dynamics)

3. **NumPy + Matplotlib** — numerical computation and visualization
   - Use throughout: all lessons with implementation
   - Critical for: transformation matrices, plotting C-spaces, visualizing paths

4. **NetworkX** (optional) — graph library
   - Use for: implementing PRM, analyzing roadmaps
   - Introduce: Lesson 16 (PRM)

5. **ROS 2** (optional, for advanced students)
   - Use for: integrating planning with real or simulated robots
   - Introduce: Lesson 27 (final integration project)

## Connecting to Real-World Robotics

Make the connection to real systems explicit:

- **Industrial manipulation**: Lessons on IK, trajectory planning
- **Autonomous vehicles**: Lessons on motion planning, dynamic constraints
- **Drones**: Lessons on reactive planning, kinodynamic constraints
- **Humanoid robots**: Lessons on high-DOF systems, whole-body motion
- **Space robotics**: Lessons on planning in unusual kinematics (free-floating)
- **Surgical robots**: Lessons on precise trajectory tracking, constrained motion

Show videos of real robots, discuss why certain planning approaches are used in different domains.
