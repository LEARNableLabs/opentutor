# Robotics — Kinematics and Motion Planning: Research Summary

## Major Subtopics

1. **Robot Kinematics**
   - Forward kinematics (DH parameters, transformations)
   - Inverse kinematics (analytical and numerical methods)
   - Jacobians and velocity kinematics
   - Singularities and manipulability

2. **Configuration Space**
   - C-space representation
   - Obstacles in configuration space
   - Free space vs. obstacle space
   - Dimension and complexity

3. **Classical Motion Planning**
   - Grid-based methods (A*, D*)
   - Potential field methods
   - Roadmap methods (visibility graphs, Voronoi diagrams)

4. **Sampling-Based Planning**
   - Rapidly-exploring Random Trees (RRT)
   - Probabilistic Roadmaps (PRM)
   - RRT* and optimal variants
   - Informed sampling strategies

5. **Trajectory Optimization**
   - Smoothness and continuity constraints
   - Dynamic constraints
   - Optimization-based planning (CHOMP, TrajOpt)

6. **Motion Control Integration**
   - Feedback control for trajectory tracking
   - Hybrid motion-force control
   - Reactive planning vs. deliberative planning

## Key Educational Resources Found

### University Courses
- **MIT OpenCourseWare**: "Introduction to Robotics" (2.12) with lecture notes on kinematics and dynamics
- **Stanford CS223A**: "Introduction to Robotics" covering kinematics, dynamics, control, motion planning, trajectory generation
- **CMU Robot Kinematics**: Focused course on kinematics, dynamics and programming of robotic mechanisms
- **Northwestern ME 449**: "Robotic Manipulation" with comprehensive modern robotics approach
- **MIT Underactuated Robotics**: Advanced treatment of motion planning for complex systems
- **Georgia Tech CS 8803RMP**: Dedicated Robot Motion Planning course

### Primary Textbooks
- **"Modern Robotics: Mechanics, Planning, and Control"** by Kevin M. Lynch and Frank C. Park (2017)
  - Comprehensive coverage from kinematics through motion planning
  - Free preprint available online
  - Accompanied by Coursera specialization with video lectures
- **"Introduction to Robotics: Mechanics and Control"** by John J. Craig
- **"Planning Algorithms"** by Steven LaValle (available free online)

### Video Lectures
- **Coursera Modern Robotics Specialization** (Northwestern University)
  - Course 1: Foundations of Robot Motion
  - Course 4: Robot Motion Planning and Control
  - Videos available on YouTube and at modernrobotics.northwestern.edu
- **Stanford CS223A** lecture videos (Stanford Engineering Everywhere)
- **MIT OCW** motion planning lectures (Underactuated Robotics, Cognitive Robotics)

### Interactive Tools & Simulators
- **Peter Corke's Robotics Toolbox for Python (RTB-P)**
  - Ships with 50+ robot models
  - Supports kinematics, dynamics, motion planning
  - DH notation, URDF import
  - URL: https://petercorke.github.io/robotics-toolbox-python/
  
- **PyBullet**
  - Lightweight Python physics engine
  - URDF support for robot models
  - Good for rapid prototyping

- **Webots**
  - Full-featured robot simulator
  - Python/C++/Java/ROS support
  - URL: https://cyberbotics.com/

- **CoppeliaSim**
  - Comprehensive simulation with FK/IK built-in
  - Python API support
  - URL: https://www.coppeliarobotics.com/

- **PyRoboSim**
  - Lightweight 2D mobile robot simulator
  - Native ROS 2 support
  - Built-in path planning (PRM, RRT, RRT*)

- **MuJoCo Playground**
  - Modern physics engine for robot learning
  - Zero-shot sim-to-real claims (RSS 2025 winner)

### Key Researchers & Practitioners
- Steven LaValle (University of Illinois) - sampling-based planning, RRT
- Jean-Claude Latombe (Stanford) - motion planning pioneer
- Kevin Lynch (Northwestern) - Modern Robotics textbook
- Russ Tedrake (MIT) - underactuated robotics, trajectory optimization
- Peter Corke (Queensland University of Technology) - Robotics Toolbox
- Lydia Kavraki (Rice) - PRM algorithm
- Sertac Karaman (MIT) - RRT* and optimal planning

## Available Educational Resources by Type

### Text Resources
- MIT OCW lecture notes and problem sets
- CMU course materials with PowerPoint slides
- Stanford course syllabi and reading lists
- Northwestern Modern Robotics wiki with comprehensive notes

### Video Content
- Full lecture series on Coursera (Modern Robotics)
- Stanford SEE lecture archive
- MIT OCW video lectures
- YouTube educational channels covering robot kinematics

### Hands-on Tools
- Python libraries (RTB-P, PyBullet, ikpy)
- ROS 2 tutorials and packages
- Web-based kinematics visualizers
- MATLAB Robotics Toolbox (original Peter Corke version)

### Cross-Disciplinary Connections
- Computational geometry (for collision detection)
- Optimal control theory (for trajectory optimization)
- Graph theory (for sampling-based planners)
- Differential geometry (for advanced kinematics)
- Reinforcement learning (for learned planners)

## Student Level: Intermediate

For intermediate students, the curriculum should:
- Assume solid understanding of linear algebra, calculus, and basic physics
- Cover both classical and modern approaches
- Balance theory with practical implementation
- Include hands-on coding exercises (Python preferred)
- Connect to real-world robotics applications
- Prepare for advanced topics (optimal control, learning-based planning)
