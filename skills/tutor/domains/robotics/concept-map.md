# Robotics — Kinematics and Motion Planning: Concept Map

## Core Concepts (in learning order)

1. **Rigid body transformations** — representing position and orientation in 3D space
2. **Rotation matrices** — encoding orientation changes between coordinate frames
3. **Homogeneous coordinates** — unified representation for rotation and translation. Depends on: Rotation matrices
4. **Forward kinematics** — computing end-effector pose from joint angles. Depends on: Rigid body transformations, Homogeneous coordinates
5. **Denavit-Hartenberg parameters** — standard convention for defining robot link frames. Depends on: Homogeneous coordinates
6. **Inverse kinematics** — computing joint angles from desired end-effector pose. Depends on: Forward kinematics
7. **Jacobian matrix** — relating joint velocities to end-effector velocities. Depends on: Forward kinematics
8. **Singularities** — configurations where the robot loses degrees of freedom. Depends on: Jacobian matrix
9. **Manipulability** — measure of how well a robot can move in all directions. Depends on: Jacobian matrix
10. **Configuration space** — abstract space where each point represents a complete robot configuration. Depends on: Inverse kinematics
11. **C-space obstacles** — mapping physical obstacles into configuration space. Depends on: Configuration space
12. **Collision detection** — checking if robot intersects obstacles. Depends on: Forward kinematics, C-space obstacles
13. **Potential field methods** — using artificial forces to guide motion. Depends on: Configuration space
14. **Roadmap methods** — graph-based representations of free space. Depends on: Configuration space, Collision detection
15. **Graph search** — finding paths through roadmaps using algorithms like A*. Depends on: Roadmap methods
16. **Sampling-based planning** — exploring space through random sampling. Depends on: Configuration space, Collision detection
17. **Rapidly-exploring random trees (RRT)** — tree-based exploration algorithm. Depends on: Sampling-based planning
18. **Probabilistic roadmaps (PRM)** — multi-query planning using random sampling. Depends on: Sampling-based planning, Graph search
19. **Asymptotic optimality** — guarantee that planner converges to optimal solution. Depends on: RRT, PRM
20. **RRT*** — optimal variant of RRT with rewiring. Depends on: RRT, Asymptotic optimality
21. **Informed sampling** — using heuristics to guide sampling. Depends on: RRT*
22. **Path smoothing** — post-processing to improve path quality. Depends on: Sampling-based planning
23. **Trajectory generation** — adding timing and velocity profiles to paths. Depends on: Path smoothing
24. **Trajectory optimization** — directly optimizing trajectories subject to constraints. Depends on: Configuration space
25. **Dynamic constraints** — respecting velocity, acceleration, and torque limits. Depends on: Jacobian matrix, Trajectory generation
26. **Trajectory tracking** — feedback control to follow planned trajectories. Depends on: Trajectory generation
27. **Reactive planning** — replanning in response to environment changes. Depends on: Sampling-based planning, Trajectory tracking

## Dependencies

- **Inverse kinematics requires forward kinematics** because we need to evaluate candidate solutions and verify correctness
- **Jacobian matrix requires forward kinematics** because it's derived by differentiating the forward kinematics equations
- **Singularities require Jacobian matrix** because they occur when the Jacobian loses rank
- **Configuration space requires inverse kinematics** because we need to map task-space goals to joint-space configurations
- **C-space obstacles require configuration space and forward kinematics** because we map physical obstacles by checking collision for sampled configurations
- **Sampling-based planning requires collision detection** because we must verify that sampled configurations and edges are collision-free
- **RRT* requires understanding of asymptotic optimality** because the rewiring step is what provides the optimality guarantee
- **Trajectory optimization requires configuration space** but can bypass explicit path planning by directly searching trajectory space
- **Trajectory tracking requires trajectory generation** because we need a reference trajectory to follow
- **Dynamic constraints require both Jacobian and trajectory generation** because we relate joint-space dynamics to task-space requirements

## Bottleneck Concepts

These concepts are prerequisites for many downstream topics. Extra time here pays off:

1. **Homogeneous transformations** — fundamental to all kinematics work
2. **Forward kinematics** — required for IK, Jacobians, collision checking, and visualization
3. **Configuration space** — central abstraction for all motion planning
4. **Collision detection** — required for all planning algorithms
5. **Jacobian matrix** — needed for velocity kinematics, singularity analysis, and dynamics

## Mind-Blowing Moments

Points where student understanding typically makes a conceptual leap:

1. **C-space revelation** (Lesson 7) — realizing that the robot becomes a point and all complexity goes into the space representation
2. **Inverse kinematics non-uniqueness** (Lesson 3) — discovering that robots can reach the same point in multiple ways, and sometimes in no ways at all
3. **Curse of dimensionality** (Lesson 11) — seeing how grid-based methods explode exponentially with degrees of freedom
4. **Probabilistic completeness** (Lesson 14) — understanding that "probably finds a solution if one exists" can be mathematically rigorous
5. **RRT* rewiring** (Lesson 17) — watching the algorithm reorganize its tree to converge toward optimal paths
6. **Trajectory optimization vs. path planning** (Lesson 22) — recognizing these as fundamentally different problem formulations

## Common Misconceptions

1. **"Inverse kinematics always has a unique solution"** — students expect IK to work like FK, but multiple solutions and no-solution cases are common
2. **"The Jacobian is just a derivative"** — missing the geometric interpretation as a velocity mapping and singularity detector
3. **"Configuration space is just joint space"** — true for manipulators, but for mobile robots or systems with constraints, C-space can be more complex
4. **"Potential fields always work"** — local minima are a fundamental limitation, not an implementation bug
5. **"RRT finds optimal paths"** — basic RRT has no optimality guarantee; need RRT* or informed variants
6. **"Collision checking is cheap"** — in high dimensions or with complex geometries, this is often the bottleneck
7. **"A smooth path is always executable"** — may violate dynamic constraints (velocity, acceleration, torque limits)
8. **"Motion planning and control are separate problems"** — they must be integrated; planned trajectories must be trackable

## Prerequisite Topics

Students should be comfortable with:

- **Linear algebra** — matrix multiplication, determinants, eigenvalues, rank (needed for: all kinematics, Jacobians, singularities)
- **Multivariable calculus** — partial derivatives, chain rule, gradients (needed for: Jacobians, trajectory optimization)
- **Coordinate systems and transformations** — 2D and 3D rotations, translation (needed for: all kinematics)
- **Graph theory basics** — nodes, edges, graph search (needed for: roadmap methods, A*, PRM)
- **Basic physics** — kinematics vs. dynamics, forces, torques (needed for: trajectory optimization, control)
- **Python programming** — NumPy, visualization (needed for: all implementations)
- **Basic data structures** — trees, priority queues (needed for: RRT, A*)

## Conceptual Arcs

The curriculum follows three major conceptual arcs:

### Arc 1: Kinematics Foundation (Lessons 1-6)
**Transformation → Forward kinematics → Inverse kinematics → Jacobians**

Students build the mathematical machinery to describe and control robot motion. Culminates in understanding both the power and limitations of kinematic control.

### Arc 2: Path Planning (Lessons 7-20)
**C-space → Classical methods → Sampling-based methods → Optimal variants**

Students progress from complete but computationally expensive methods to probabilistic but scalable ones, then to variants that guarantee optimality. The arc reveals fundamental trade-offs: completeness vs. efficiency, optimality vs. speed.

### Arc 3: Trajectory and Integration (Lessons 21-27)
**Smoothing → Optimization → Dynamics → Control → Real-world systems**

Students connect geometric path planning to physical robot execution. The arc bridges the gap between "where to go" (planning) and "how to get there" (control), culminating in integrated systems.

## Cross-Module Dependencies

- Lessons 21-24 (trajectory module) require Jacobians from Lesson 5
- Lesson 22 (trajectory optimization) can be understood independently of sampling-based planning (Lessons 14-20)
- Lesson 25 (contact planning) requires both kinematics (Lessons 1-6) and planning (Lessons 14-20)
- Lesson 26 (reactive planning) synthesizes ideas from both sampling-based planning and control

## Advanced Topics (beyond this curriculum)

Students completing this curriculum will be prepared for:

- Optimal control theory (LQR, MPC, DDP)
- Learning-based motion planning (neural network planners, reinforcement learning)
- Multi-robot coordination and formation control
- Legged locomotion and contact-rich manipulation
- Task and motion planning (TAMP)
- Differentiable physics and simulation
