# Research Summary — 3D Printer Firmware: Motion Planning and Kinematics

## Major Subtopics

### 1. Motion Control Fundamentals
- Stepper motor physics and control signals (step/direction)
- Timing requirements and interrupt-driven control
- Microstepping and resolution
- Real-time constraints in embedded systems

### 2. Motion Planning Algorithms
- Linear interpolation between waypoints
- Arc (circular) interpolation for curves
- Acceleration profiles (trapezoidal, S-curve/jerk-limited)
- Lookahead buffers for continuous motion
- Junction deviation and cornering speed optimization

### 3. Kinematics Systems
- **Cartesian** (Prusa, Ender) — direct X/Y/Z mapping
- **CoreXY** — coupled motors, uncoupled movement
- **Delta** — parallel robot inverse kinematics
- **Polar/SCARA** — rotational coordinates
- Forward vs. inverse kinematics transformations

### 4. Firmware Architectures
- **Marlin** — monolithic, AVR/ARM, most popular
- **Klipper** — split architecture (MCU + host)
- **RepRapFirmware** — Duet boards, advanced features
- HAL (Hardware Abstraction Layer) design patterns

### 5. G-code Interpretation
- Parsing and buffering commands
- Modal states and coordinate systems
- Feed rate calculations and unit conversions
- Error handling and boundary checking

### 6. Advanced Topics
- Pressure advance / linear advance for extrusion
- Input shaping for resonance compensation
- Mesh bed leveling and auto-calibration
- Multi-axis coordination and synchronization

## Key Sources

### Official Documentation
- **Marlin Firmware Documentation** — comprehensive architecture docs, motion planning internals
- **Klipper Documentation** — kinematics implementations, config reference
- **RepRapWiki Motion Control** — foundational theory, historical context

### Academic & Technical Resources
- CNC motion control literature (applicable to 3D printing)
- Research on jerk-limited motion profiles
- Delta kinematics papers and calibration methods

### Video Learning
- Teaching Tech YouTube — firmware configuration deep-dives
- CNC Kitchen — motion tuning and benchmarking
- Nero 3D — Klipper setup and kinematics explanation

### Code Repositories
- Marlin, Klipper, RRF source code (GitHub)
- Motion planner implementations in various forks
- Kinematic solver examples

## Available Resources

### Interactive Tools
- Online delta kinematics calculators
- Motion profile visualizers
- G-code simulators and visualizers

### Community Resources
- RepRap forums — motion control discussions
- Klipper Discourse — advanced tuning threads
- Reddit r/VORONDesign — CoreXY kinematics focus

## Learning Path

For intermediate students (prerequisites: basic programming, basic physics/calculus):

1. **Start with simple Cartesian kinematics** — understand the 1:1 mapping
2. **Build up motion planning** — linear → acceleration → lookahead
3. **Explore advanced kinematics** — CoreXY, then Delta
4. **Study real firmware** — read Marlin motion planner code
5. **Implement concepts** — write simple motion simulator
6. **Advanced optimization** — jerk control, input shaping
