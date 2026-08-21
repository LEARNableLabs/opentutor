# Robotics — Kinematics and Motion Planning: Resources

## Primary Sources (for lesson content)

### Textbooks

1. **"Modern Robotics: Mechanics, Planning, and Control"** by Kevin M. Lynch and Frank C. Park (Cambridge University Press, 2017)
   - **Coverage**: Complete treatment from kinematics through motion planning and control
   - **Why good for intermediate**: Balances theory with practical algorithms, uses geometric (product of exponentials) approach alongside DH parameters
   - **Availability**: Free preprint at http://hades.mech.northwestern.edu/index.php/Modern_Robotics
   - **Best for**: Lessons 1-5, 7, 10, 21-24
   
2. **"Planning Algorithms"** by Steven LaValle (Cambridge University Press, 2006)
   - **Coverage**: Comprehensive treatment of motion planning from classical to sampling-based methods
   - **Why good for intermediate**: Mathematically rigorous but accessible, excellent illustrations
   - **Availability**: Free online at http://lavalle.pl/planning/
   - **Best for**: Lessons 7-20 (all planning topics)

3. **"Introduction to Robotics: Mechanics and Control"** by John J. Craig (Pearson, 4th edition)
   - **Coverage**: Classic textbook on robot kinematics, dynamics, and control
   - **Why good for intermediate**: Industry-standard DH parameter approach, practical focus
   - **Best for**: Lessons 1-6, 21, 24

4. **"Robotics: Modelling, Planning and Control"** by Bruno Siciliano et al. (Springer, 2009)
   - **Coverage**: Comprehensive reference covering kinematics, dynamics, planning, control
   - **Why good for intermediate**: European perspective, strong on control theory integration
   - **Best for**: Lessons 21-27

### University Courses (with open materials)

1. **MIT 2.12: Introduction to Robotics**
   - **URL**: https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/pages/lecture-notes/
   - **Coverage**: Lecture notes on kinematics, dynamics, control
   - **Best for**: Lessons 1-6, 24

2. **Stanford CS223A: Introduction to Robotics**
   - **URL**: https://see.stanford.edu/Course/CS223A
   - **Coverage**: Kinematics, dynamics, control, motion planning, trajectory generation
   - **Includes**: Video lectures, lecture notes, problem sets
   - **Best for**: Lessons 1-6, 21-24

3. **CMU Robot Kinematics**
   - **URL**: https://sites.google.com/site/robotkinematicscmu/syllabus
   - **Coverage**: Focused course on kinematics and dynamics of robotic mechanisms
   - **Includes**: Lecture videos, PowerPoint slides
   - **Best for**: Lessons 1-6

4. **Northwestern ME 449: Robotic Manipulation**
   - **URL**: https://hades.mech.northwestern.edu/index.php/ME_449_Robotic_Manipulation_(Archive_Fall_2019)
   - **Coverage**: Full course following Modern Robotics textbook
   - **Includes**: Software for simulations, comprehensive notes
   - **Best for**: All lessons, especially 25 (contact planning)

5. **MIT 6.832: Underactuated Robotics**
   - **URL**: https://underactuated.csail.mit.edu/index.html
   - **Coverage**: Advanced robotics with focus on dynamics and optimal control
   - **Includes**: Full online textbook, lecture videos, Julia notebooks
   - **Best for**: Lessons 22-26 (trajectory optimization, advanced topics)

6. **Georgia Tech CS 8803RMP: Robot Motion Planning**
   - **URL**: https://faculty.cc.gatech.edu/~seth/Teaching/cs8803RMP/index-2019.php?u=resources
   - **Coverage**: Dedicated motion planning course
   - **Includes**: Reading list, resources
   - **Best for**: Lessons 7-20

7. **MIT 16.412J: Cognitive Robotics**
   - **URL**: https://ocw.mit.edu/courses/aeronautics-and-astronautics/16-412j-cognitive-robotics-spring-2016/videos-for-advanced-lectures/
   - **Coverage**: Advanced lectures on motion planning
   - **Best for**: Lessons 9, 26 (incremental planning, replanning)

8. **MIT 6.4210: Robotic Manipulation**
   - **URL**: https://manipulation.csail.mit.edu/Fall2025/lec/fall25-lec9.pdf
   - **Coverage**: Motion planning lectures from Russ Tedrake's course
   - **Best for**: Lessons 22, 25

9. **Stanford Principles of Robot Autonomy I**
   - **URL**: https://stanfordasl.github.io//PoRA-I/aa174a_aut2324/
   - **Coverage**: Robot autonomy with motion planning
   - **Best for**: Lessons 7-20

## Supplementary Videos

### Video Lecture Series

1. **Coursera Modern Robotics Specialization** (Northwestern University)
   - **Course 1**: Foundations of Robot Motion — https://www.coursera.org/learn/modernrobotics-course1
   - **Course 4**: Robot Motion Planning and Control — https://www.coursera.org/learn/modernrobotics-course4
   - **Also available**: Direct links at http://modernrobotics.northwestern.edu (video browser) and YouTube
   - **Why excellent**: Follows the Lynch & Park textbook, high production quality, free to audit
   - **Best for**: All lessons, especially 1-5, 7, 10, 14-24

2. **Stanford Engineering Everywhere CS223A**
   - **URL**: https://see.stanford.edu/Course/CS223A/33
   - **Coverage**: Complete lecture series from Stanford's robotics course
   - **Best for**: Lessons 1-6, 21-24

3. **MIT OCW Underactuated Robotics Lecture 14**
   - **URL**: https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-832-underactuated-robotics-spring-2009/video-lectures/lecture-14-feasible-motion-planning/
   - **Coverage**: Feasible motion planning
   - **Best for**: Lesson 14-15 (introduction to sampling-based planning)

### YouTube Channels & Playlists

1. **Aaron Becker's YouTube** (University of Houston) — excellent animations of motion planning algorithms
2. **Steve Brunton's YouTube** — control theory and dynamics background
3. **Emo Todorov** (MuJoCo creator) — physics simulation and optimal control
4. **Ross Knepper** (Cornell) — motion planning talks and tutorials

## Interactive Tools & Simulators

### Python Libraries

1. **Peter Corke's Robotics Toolbox for Python (RTB-P)**
   - **URL**: https://petercorke.github.io/robotics-toolbox-python/intro.html
   - **Description**: Comprehensive library for kinematics, dynamics, motion planning
   - **Features**: 50+ robot models, DH and POE kinematics, URDF import, trajectory generation
   - **Installation**: `pip install roboticstoolbox-python`
   - **Best for**: All implementation lessons (6, 13, 20, 27)
   - **Documentation**: Excellent, includes tutorials and examples

2. **PyBullet**
   - **Description**: Lightweight Python interface to Bullet physics engine
   - **Features**: URDF support, forward/inverse dynamics, collision detection
   - **Installation**: `pip install pybullet`
   - **Best for**: Dynamic simulation (Lessons 22-27)
   - **Great for**: Rapid prototyping and RL research

3. **ikpy** (Python IK library)
   - **Description**: Simple IK solver for serial manipulators
   - **Installation**: `pip install ikpy`
   - **Best for**: Quick IK verification (Lessons 3-4)

4. **Python Motion Planning**
   - **Description**: Implementations of common motion planning algorithms
   - **Features**: Grid-based planners, sampling-based planners, visualizations
   - **Best for**: Understanding algorithm implementations (Lessons 10, 13-20)

### Full-Featured Simulators

1. **Webots**
   - **URL**: https://cyberbotics.com/
   - **Description**: Professional robot simulator with Python/C++/Java/ROS support
   - **Features**: Full physics, extensive robot library, scene editor
   - **License**: Open source (Apache 2.0)
   - **Best for**: Complete system integration (Lesson 27)

2. **CoppeliaSim (formerly V-REP)**
   - **URL**: https://www.coppeliarobotics.com/
   - **Description**: Comprehensive robot simulation with built-in FK/IK
   - **Features**: Python API, extensive component library, scene composition
   - **License**: Free educational version
   - **Best for**: Testing planning algorithms with real robot models (Lessons 20, 27)

3. **PyRoboSim**
   - **Description**: Lightweight 2D mobile robot simulator with ROS 2 support
   - **Features**: Built-in PRM, RRT, RRT* implementations
   - **Best for**: Quick 2D planning experiments (Lessons 13-20)

4. **MuJoCo**
   - **Description**: Modern physics engine for robot learning
   - **Features**: Fast, accurate contact dynamics, differentiable physics
   - **License**: Open source (Apache 2.0) as of 2021
   - **Best for**: Advanced trajectory optimization (Lesson 22-23)

### Web-Based Tools

1. **GeoGebra Robot Kinematics Applets**
   - **Description**: Interactive 2D forward/inverse kinematics visualizations
   - **Best for**: Building intuition (Lessons 1-4)

2. **ROS Development Studio (online ROS environment)**
   - **Description**: Run ROS in browser without local installation
   - **Best for**: Trying ROS-based planning (Lesson 27)

## Code Repositories & Examples

1. **Modern Robotics Code Library**
   - **URL**: https://github.com/NxRLab/ModernRobotics
   - **Description**: Official code library for Lynch & Park textbook
   - **Languages**: Python, MATLAB, Mathematica
   - **Best for**: Reference implementations of all kinematics algorithms

2. **Awesome Robotics Libraries**
   - **URL**: https://github.com/jslee02/awesome-robotics-libraries
   - **Alternative**: https://github.com/knmcguire/best-of-robot-simulators
   - **Description**: Curated lists of robotics software
   - **Best for**: Discovering tools for specific needs

3. **Awesome Robotics Libraries (comprehensive)**
   - **URL**: http://jeongseok.dev/awesome-robotics-libraries/
   - **Description**: Web-based curated list of robotics simulators and libraries
   - **Best for**: Tool selection and comparison

## People to Follow

### Pioneers & Researchers

1. **Steven LaValle** (University of Illinois)
   - **Contribution**: Invented RRT, wrote "Planning Algorithms" textbook
   - **Follow for**: Motion planning fundamentals, VR/robotics connections

2. **Jean-Claude Latombe** (Stanford, emeritus)
   - **Contribution**: Pioneer of robot motion planning
   - **Follow for**: Historical perspective, classical planning methods

3. **Lydia Kavraki** (Rice University)
   - **Contribution**: Invented PRM algorithm
   - **Follow for**: Sampling-based planning, computational biology connections

4. **Sertac Karaman** (MIT)
   - **Contribution**: Invented RRT*, optimal planning theory
   - **Follow for**: Optimal planning, autonomous vehicles

5. **Kevin Lynch** (Northwestern)
   - **Contribution**: Co-author of "Modern Robotics" textbook
   - **Follow for**: Modern geometric approach to kinematics, manipulation

6. **Russ Tedrake** (MIT)
   - **Contribution**: Underactuated robotics, trajectory optimization, Drake toolbox
   - **Follow for**: Optimal control, learning-based planning, contact-rich manipulation

7. **Peter Corke** (Queensland University of Technology)
   - **Contribution**: Created Robotics Toolbox (MATLAB and Python versions)
   - **Follow for**: Practical robotics education, visual servoing

8. **Kris Hauser** (University of Illinois)
   - **Contribution**: Motion planning, contact mechanics
   - **Follow for**: Real-world planning challenges, robotic manipulation

9. **Pieter Abbeel** (UC Berkeley)
   - **Contribution**: Learning-based robotics, imitation learning
   - **Follow for**: Future of motion planning (learned planners)

10. **Marc Toussaint** (TU Berlin)
    - **Contribution**: Motion planning, logic and geometry in robotics
    - **Follow for**: Task and motion planning (TAMP), optimization

### Educators & Communicators

1. **Angela Sodemann** (YouTube educator)
   - **Why follow**: Clear video explanations of kinematics and control

2. **Emo Todorov** (University of Washington, MuJoCo creator)
   - **Why follow**: Physics simulation, optimal control

3. **Steve Brunton** (University of Washington)
   - **Why follow**: Control theory, data-driven dynamics (not motion planning directly, but excellent foundation)

## Unexpected Cross-Discipline Connections

1. **Computational Geometry**
   - **Connection**: C-space obstacles, Voronoi diagrams, visibility graphs
   - **Resource**: "Computational Geometry: Algorithms and Applications" by de Berg et al.
   - **Wild card**: Point location in geometric structures is exactly the nearest-neighbor problem in RRT

2. **Differential Geometry**
   - **Connection**: Configuration spaces are manifolds, Lie groups for transformations
   - **Resource**: "A Mathematical Introduction to Robotic Manipulation" by Murray, Li, Sastry
   - **Wild card**: Robot kinematics is secretly differential geometry on SE(3)

3. **Graph Theory & Network Science**
   - **Connection**: PRM is random geometric graph, roadmap completeness relates to graph connectivity
   - **Resource**: "Random Geometric Graphs" by Penrose
   - **Wild card**: Percolation theory predicts when PRM succeeds

4. **Measure Theory & Probability**
   - **Connection**: Probabilistic completeness proofs, narrow passage problem
   - **Resource**: "Probability and Measure" by Billingsley (advanced)
   - **Wild card**: Sampling-based planning failure modes are measure-theoretic

5. **Optimal Control Theory**
   - **Connection**: Trajectory optimization is optimal control, MPC for replanning
   - **Resource**: "Optimal Control" by Kirk
   - **Wild card**: HJB equation connects planning to dynamic programming

6. **Game Theory**
   - **Connection**: Multi-robot planning, adversarial environments
   - **Resource**: "Algorithmic Game Theory" by Nisan et al.
   - **Wild card**: Nash equilibria for multi-agent motion planning

7. **Topology**
   - **Connection**: Homology classes of paths, configuration space topology
   - **Resource**: "Topology for Computing" by Zomorodian
   - **Wild card**: Some planning problems require algebraic topology to solve correctly

8. **Machine Learning**
   - **Connection**: Learned heuristics for sampling, neural motion planners, RL for manipulation
   - **Resource**: Recent NeurIPS/ICRA/RSS papers on learning-based planning
   - **Wild card**: Motion planning as supervised learning (MPNet, neural RRT*)

9. **Formal Methods & Verification**
   - **Connection**: Proving safety of planned motions, temporal logic specifications
   - **Resource**: "Principles of Model Checking" by Baier and Katoen
   - **Wild card**: Linear temporal logic (LTL) for task specification

10. **Physics & Contact Mechanics**
    - **Connection**: Contact-rich manipulation, pushing, grasping
    - **Resource**: "Simulation and Synthesis of Human Motion" by Murray
    - **Wild card**: Coulomb friction makes contact planning non-convex and challenging

## Research Frontiers (for inspiration)

1. **Differentiable Physics** — end-to-end gradient-based planning through physics simulators
2. **Neural Motion Planning** — learned planners (MPNet, Visual Foresight)
3. **Task and Motion Planning (TAMP)** — combining symbolic AI with geometric planning
4. **Multi-Agent Planning** — coordinating many robots, game-theoretic approaches
5. **Learning from Demonstrations** — imitation learning for manipulation
6. **Sim-to-Real Transfer** — making simulated planning work on real robots
7. **Topology-Aware Planning** — planning over different homotopy classes
8. **Contact-Implicit Optimization** — trajectory optimization with contact dynamics
9. **Semantic Planning** — using high-level scene understanding to guide planning
10. **Quantum Motion Planning** — quantum algorithms for planning (speculative frontier)

## Datasets & Benchmarks

1. **MoveIt Motion Planning Benchmarks** — standard manipulation planning problems
2. **Open Motion Planning Library (OMPL) Benchmark Database** — compare planner performance
3. **YCB Object Set** — standardized objects for manipulation
4. **Robotic Grasping Datasets** — for manipulation planning research

## Community & Forums

1. **ROS Discourse** — active community for robotics software
2. **r/robotics** (Reddit) — practical discussions
3. **ICRA, IROS, RSS conferences** — top robotics research venues
4. **arXiv cs.RO** — preprints of robotics papers
5. **Robotics Stack Exchange** — Q&A for specific technical questions
