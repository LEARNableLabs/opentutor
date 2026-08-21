# 3D Printer Firmware — Concept Map

## Core Concepts (in learning order)

1. **Stepper motors** — pulse-driven actuators that move in discrete steps
2. **Step/direction signals** — digital control interface for stepper drivers
3. **Microstepping** — subdividing full steps for smoother motion and higher resolution
4. **Interrupt-driven control** — real-time timer-based step generation
5. **Real-time constraints** — timing guarantees required for smooth motion
6. **G-code parsing** — converting text commands into motion parameters
7. **Coordinate transformation** — mapping desired position to machine coordinates
8. **Feed rate** — commanded speed of motion in mm/min or mm/s
9. **Cartesian kinematics** — direct 1:1 mapping of motors to axes
10. **Forward kinematics** — motor positions → toolhead position
11. **Inverse kinematics** — toolhead position → motor positions
12. **CoreXY kinematics** — coupled motor system for XY motion
13. **Delta kinematics** — parallel robot with inverse kinematic transformations
14. **Linear interpolation** — generating intermediate points along a line
15. **Bresenham algorithm** — efficient integer-based line drawing for stepper control
16. **Acceleration profile** — time-varying speed during motion
17. **Trapezoidal motion** — constant acceleration, cruise, constant deceleration
18. **Jerk** — rate of change of acceleration, causes mechanical stress if unbounded
19. **S-curve acceleration** — jerk-limited smooth acceleration profile
20. **Lookahead buffer** — queue of upcoming moves for planning optimization
21. **Junction deviation** — maximum allowed path deviation at corners for speed
22. **Continuous motion** — eliminating stops between moves via lookahead
23. **Delta calibration** — measuring and compensating geometric errors
24. **Input shaping** — signal processing to cancel mechanical resonances
25. **Pressure advance** — compensating for extruder pressure dynamics
26. **Firmware architecture** — monolithic vs split design patterns

## Dependencies

### Motion Control Fundamentals
- **Interrupt-driven control** requires understanding **stepper motors** and **step/direction signals** because the interrupt service routine generates step pulses at precise intervals
- **Real-time constraints** build on **interrupt-driven control** because missed deadlines cause motion artifacts
- **G-code parsing** feeds into **coordinate transformation** because raw commands must be converted to machine coordinates
- **Feed rate** depends on **coordinate transformation** because speed calculations require knowing the geometric path length

### Kinematics
- **Forward kinematics** is the foundation for **inverse kinematics** — understanding the mapping in both directions is essential
- **CoreXY kinematics** requires understanding **Cartesian kinematics** first because it's a coupled variation of the basic concept
- **Delta kinematics** is more complex than **CoreXY** because it requires solving trigonometric equations for each position
- **Inverse kinematics** is critical for **delta kinematics** because there's no direct motor-to-axis mapping

### Motion Planning
- **Linear interpolation** and **Bresenham algorithm** must come before **acceleration profiles** because you need a path before you can accelerate along it
- **Trapezoidal motion** is prerequisite for **S-curve acceleration** because S-curves are an enhancement that adds jerk limiting
- **Jerk** understanding enables **S-curve acceleration** design
- **Lookahead buffer** depends on understanding **acceleration profiles** because it optimizes speeds based on acceleration constraints
- **Junction deviation** works with **lookahead buffer** to determine maximum cornering speeds
- **Continuous motion** is the emergent result of effective **lookahead** and **junction deviation** algorithms

### Advanced Topics
- **Delta calibration** requires deep understanding of **delta kinematics** because you're measuring and correcting geometric parameters
- **Input shaping** builds on **acceleration profiles** because it modifies the commanded acceleration to cancel resonances
- **Pressure advance** depends on understanding **feed rate** and motion timing because it adjusts extrusion based on acceleration

## Prerequisite Topics

- **Basic programming (C/C++)** — needed for reading firmware source code, understanding interrupt handlers and real-time control loops
- **Basic physics (vectors, forces)** — needed for understanding inertia, jerk, mechanical constraints, and why acceleration must be limited
- **Basic calculus (derivatives)** — needed for velocity as derivative of position, acceleration as derivative of velocity, jerk as third derivative
- **3D coordinate systems** — needed for all kinematics transformations and coordinate frame conversions
- **Linear algebra** (helpful but not required) — useful for matrix-based kinematics transformations, especially for delta and CoreXY
- **Digital signal processing** (for advanced topics) — needed for input shaping and resonance compensation

## Bottlenecks

**Critical bottleneck: Inverse kinematics for delta printers**
- This is the hardest conceptual leap in the curriculum
- Requires trigonometry, geometric reasoning, and handling of multiple solutions
- Students often struggle with the abstraction of mapping 3D space to three arm lengths
- Recommended approach: visual simulation, incremental building from 2D to 3D case

**Secondary bottleneck: Lookahead and junction deviation**
- Algorithmically complex — requires thinking several moves ahead
- Tricky edge cases (buffer boundaries, incompatible moves)
- Abstract concept that's hard to visualize without animation
- Recommended approach: study existing implementations, trace through examples step-by-step

## Common Misconceptions

1. **"Stepper motors have built-in position feedback"** — No, they're open-loop. Firmware assumes steps are executed perfectly. This is why missed steps cause position errors that persist.

2. **"G-code directly tells motors what to do"** — No, there's heavy processing between G-code and motor control: parsing, kinematics, motion planning, acceleration limiting.

3. **"Cartesian and CoreXY are the same thing"** — No, CoreXY couples two motors for XY motion while Cartesian has independent motors. Forward kinematics differs significantly.

4. **"You can change speed instantly"** — No, physical inertia and mechanical limits require gradual acceleration. Instant velocity changes cause skipped steps and mechanical damage.

5. **"Jerk and acceleration are the same"** — No, jerk is the rate of change of acceleration (third derivative of position). Limiting jerk makes acceleration smoother.

6. **"Lookahead just makes the printer faster"** — Not exactly — it prevents slowdowns at corners by planning ahead, but still respects acceleration and jerk limits.

7. **"Delta printers are just three Cartesian axes"** — No, delta uses parallel robot kinematics with coupled motion. All three towers move for any XY position change.

8. **"Input shaping slows down prints"** — Not necessarily — it allows higher speeds by canceling resonances that would otherwise limit acceleration.

9. **"Firmware is just a G-code interpreter"** — No, firmware handles real-time motion control, safety limits, temperature regulation, and much more beyond G-code.

10. **"Klipper is always better than Marlin"** — Not universally — each has tradeoffs. Klipper offers more processing power and flexibility, but requires a host computer and more complex setup.

## Learning Sequence Rationale

The curriculum follows this progression:

1. **Foundations first** — stepper control and timing before kinematics
2. **Simple to complex kinematics** — Cartesian → CoreXY → Delta
3. **Motion planning after kinematics** — need to know where to move before planning how to move smoothly
4. **Advanced optimization last** — input shaping and pressure advance require understanding the full motion system
5. **Reviews strategically placed** — after kinematics basics (lesson 10), after motion planning (lesson 17), after advanced kinematics (lesson 22)

This order minimizes cognitive load by building each concept on previous ones.
