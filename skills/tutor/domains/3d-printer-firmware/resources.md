# 3D Printer Firmware — Resources

## Primary Sources (for lesson content)

### Official Firmware Documentation

- **Marlin Firmware Documentation** — https://marlinfw.org/docs/
  - Comprehensive reference for the most popular firmware
  - Great for understanding motion control architecture, G-code reference, feature implementation
  - Well-suited for intermediate students who want to read authoritative sources

- **Klipper Documentation** — https://www.klipper3d.org/
  - Excellent technical depth on kinematics, resonance compensation, pressure advance
  - Python-based host code is more readable than Marlin's C++
  - Configuration reference is invaluable for understanding parameters

- **RepRapFirmware (RRF) Documentation** — https://docs.duet3d.com/
  - Advanced features, excellent G-code reference
  - Good for comparative study of different firmware architectures

### Source Code Repositories

- **Marlin Firmware (GitHub)** — https://github.com/MarlinFirmware/Marlin
  - See `Marlin/src/module/planner.cpp` for motion planning
  - See `Marlin/src/module/stepper.cpp` for interrupt-driven step generation
  - Well-commented code, good for learning by reading

- **Klipper (GitHub)** — https://github.com/Klipper3d/klipper
  - See `klippy/kinematics/` for different kinematic implementations
  - See `klippy/toolhead.py` for motion planning and lookahead
  - Python host code is very readable

### Foundational Theory

- **RepRap Wiki — Kinematics** — https://reprap.org/wiki/Kinematics
  - Historical reference with good geometric explanations
  - Covers Cartesian, CoreXY, Delta, SCARA, and more

- **RepRap Wiki — G-code** — https://reprap.org/wiki/G-code
  - Comprehensive G-code reference
  - Explains command syntax and common implementations

- **RepRap Wiki — Motion Control** — https://reprap.org/wiki/Motion_control
  - Foundational concepts for stepper control and motion planning
  - Somewhat dated but conceptually solid

## Supplementary (for engagement)

### Video Resources

- **Teaching Tech (YouTube)** — https://www.youtube.com/c/TeachingTech
  - Excellent firmware configuration tutorials
  - Practical calibration guides (acceleration tuning, input shaping)
  - "Teaching Tech 3D Printer Calibration" website: https://teachingtechyt.github.io/calibration.html

- **CNC Kitchen (YouTube)** — https://www.youtube.com/c/CNCKitchen
  - Motion system testing and benchmarking
  - Great visualizations of print quality issues related to motion control
  - Data-driven approach to tuning

- **Nero 3D (YouTube)** — https://www.youtube.com/c/Nero3D
  - Klipper setup and configuration deep-dives
  - Kinematics explanations with visual aids

### Interactive Tools & Simulators

- **CoreXY.com Theory Page** — https://corexy.com/theory.html
  - Interactive CoreXY kinematics visualization
  - Shows belt routing and motor coupling clearly

- **Delta Kinematics Calculator** — Various online calculators (search "delta kinematics calculator")
  - Instant feedback for forward/inverse kinematics calculations
  - Helps build intuition for delta geometry

- **Desmos Graphing Calculator** — https://www.desmos.com/calculator
  - Use for plotting acceleration profiles, S-curves, motion paths
  - Can visualize derivatives (position → velocity → acceleration → jerk)

- **GeoGebra** — https://www.geogebra.org/
  - Excellent for visualizing 2D/3D kinematics
  - Can build interactive models of delta arms, CoreXY systems

### Technical Articles & Deep-Dives

- **"Computing Junction Deviation for Marlin"** — http://blog.kyneticcnc.com/2018/10/computing-junction-deviation-for-marlin.html
  - Detailed explanation of junction deviation algorithm
  - Math walkthrough with diagrams

- **"Improving GRBL Cornering Algorithm"** — https://onehossshay.wordpress.com/2011/09/24/improving_grbl_cornering_algorithm/
  - Historical development of lookahead planning
  - Foundational for understanding modern firmware motion planning

- **Klipper Kinematics Documentation** — https://www.klipper3d.org/Kinematics.html
  - In-depth technical reference for all supported kinematic systems
  - Mathematical formulas and implementation notes

- **Klipper Resonance Compensation Guide** — https://www.klipper3d.org/Resonance_Compensation.html
  - Complete guide to input shaping
  - Includes measurement methodology and tuning process

### Code Examples & Implementations

- **Marlin Planner Module** — https://github.com/MarlinFirmware/Marlin/blob/2.1.x/Marlin/src/module/planner.cpp
  - Production-quality motion planner implementation
  - Handles lookahead, junction deviation, acceleration limiting

- **Klipper Kinematics Modules** — https://github.com/Klipper3d/klipper/tree/master/klippy/kinematics
  - Separate files for each kinematic system (cartesian.py, corexy.py, delta.py)
  - Clean Python implementations, easier to read than C++

- **Bresenham Algorithm Examples** — https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
  - Classic algorithm adapted for stepper motor control
  - Wikipedia has pseudocode and visual examples

## People & Community

### Firmware Developers

- **Scott Lahteine** — Marlin lead developer
  - GitHub: https://github.com/thinkyhead
  - Deep knowledge of motion control implementations

- **Kevin O'Connor** — Klipper creator
  - GitHub: https://github.com/KevinOConnor
  - Pioneered split firmware architecture and input shaping for 3D printing

### Communities

- **Klipper Discourse** — https://klipper.discourse.group/
  - Active community for advanced firmware discussions
  - Great for troubleshooting and learning from others' experiments

- **Reddit r/VORONDesign** — https://www.reddit.com/r/VORONDesign/
  - Focus on CoreXY kinematics and high-performance printing
  - Advanced users share tuning techniques

- **Reddit r/klippers** — https://www.reddit.com/r/klippers/
  - Klipper-specific community
  - Configuration examples and problem-solving

- **RepRap Forums** — https://forums.reprap.org/
  - Historical hub for DIY 3D printing
  - Deep technical discussions, though less active than Discord/Reddit now

### Research & Advanced Topics

- **"Jerk-Limited Motion Control"** papers
  - Search Google Scholar for trajectory planning with jerk constraints
  - Foundational for understanding S-curve acceleration

- **"Delta Robot Kinematics"** papers
  - Academic literature on parallel robot control
  - More general than 3D printing but highly applicable

## Tools for Hands-On Learning

### Firmware Configuration & Tuning

- **Teaching Tech Calibration Site** — https://teachingtechyt.github.io/calibration.html
  - Step-by-step guides for calibrating motion parameters
  - Covers acceleration, jerk, input shaping, pressure advance

- **Klipper Configuration Reference** — https://www.klipper3d.org/Config_Reference.html
  - Complete parameter documentation
  - Essential for understanding what each setting does

### Visualization & Debugging

- **OctoPrint** — https://octoprint.org/
  - Web interface for printer control
  - Plugins available for motion visualization

- **Plotjuggler** — https://github.com/facontidavide/PlotJuggler
  - Time-series data visualization
  - Excellent for analyzing Klipper motion logs

- **G-code Viewers**
  - **NC Viewer** — https://ncviewer.com/
  - **gcode.ws** — https://gcode.ws/
  - Visualize G-code paths before printing

### Development & Experimentation

- **PlatformIO** — https://platformio.org/
  - Development environment for embedded firmware
  - Easiest way to compile and flash Marlin/RepRapFirmware

- **Marlin Configuration Tool** — https://marlinfw.org/tools/
  - Web-based configurator for Marlin
  - Helps generate configuration files

## Unexpected Connections (Cross-Domain Learning)

### Related Fields

- **CNC Machine Control**
  - Grbl firmware: https://github.com/grbl/grbl
  - LinuxCNC: https://linuxcnc.org/
  - Same motion control principles, different application

- **Robotic Arm Control**
  - ROS (Robot Operating System) MoveIt: https://moveit.ros.org/
  - Similar inverse kinematics problems
  - More sophisticated path planning

- **Drone Flight Controllers**
  - PID control, sensor fusion, real-time constraints
  - Betaflight, INAV, ArduPilot all deal with similar embedded control challenges

### Applied Mathematics

- **Control Theory**
  - PID control for temperature, future: MPC for motion
  - Transfer functions, stability analysis

- **Numerical Methods**
  - Finite difference methods for motion integration
  - Floating-point precision and stability

- **Computer Graphics**
  - Bresenham algorithm (line drawing)
  - Bezier curves and splines (potential future for smooth paths)

## Books (if student wants deeper study)

- **"Theory and Design of CNC Systems"** by Suk-Hwan Suh
  - Comprehensive coverage of motion control theory
  - More general than 3D printing but highly applicable

- **"Embedded Systems: Real-Time Operating Systems for ARM Cortex-M Microcontrollers"** by Jonathan Valvano
  - Deep dive into real-time embedded programming
  - Relevant for understanding firmware timing constraints

- **"Robot Modeling and Control"** by Mark Spong
  - Covers forward/inverse kinematics in depth
  - Academic but thorough treatment of concepts

- **"Modern Robotics: Mechanics, Planning, and Control"** by Kevin Lynch and Frank Park
  - Free online: http://hades.mech.northwestern.edu/index.php/Modern_Robotics
  - Excellent for understanding kinematics mathematically

## Live Data & Current Developments

- **Marlin GitHub Issues** — https://github.com/MarlinFirmware/Marlin/issues
  - See real-world problems and solutions
  - Follow development of new features

- **Klipper GitHub Discussions** — https://github.com/Klipper3d/klipper/discussions
  - Feature proposals and community feedback
  - Insight into firmware evolution

- **3D Printing Subreddits**
  - r/3Dprinting, r/ender3, r/prusa3d
  - Real users troubleshooting motion issues
  - Practical examples of firmware tuning
