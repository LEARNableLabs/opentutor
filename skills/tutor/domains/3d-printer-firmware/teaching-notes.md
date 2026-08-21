# 3D Printer Firmware — Teaching Notes

## Approach

This topic blends embedded systems programming, real-time control theory, and mechanical engineering. For intermediate students, emphasize **hands-on experimentation** with real firmware codebases (Marlin, Klipper) over abstract theory. The best learning happens when students can trace code execution, visualize motion profiles, and see the direct connection between parameters and printer behavior. Use motion simulators and visualization tools extensively — kinematics and acceleration curves are much clearer when animated. Encourage students to read production firmware code early and often, treating it as a worked example rather than a black box.

## Common Misconceptions

1. **"Stepper motors provide position feedback"**
   - **Why students think this:** Stepper motors seem "smart" because they move precisely, and students confuse this with closed-loop control
   - **How to correct:** Emphasize that steppers are open-loop — firmware counts steps and assumes they executed. Demonstrate a missed step causing permanent position error that firmware can't detect without external sensors (endstops, encoders)

2. **"G-code commands execute immediately"**
   - **Why students think this:** The text-based interface makes it seem like a direct command interpreter
   - **How to correct:** Show the processing pipeline: parsing → planning → buffering → execution. Point out that `G1 X100` might sit in the lookahead buffer for 10+ moves before executing

3. **"Cartesian printers just send G-code coordinates directly to motors"**
   - **Why students think this:** The 1:1 mapping seems trivial
   - **How to correct:** Even simple Cartesian systems need coordinate transformation (work vs machine coordinates), unit conversion (mm/s to steps/s), and multi-axis synchronization

4. **"CoreXY is just a faster Cartesian"**
   - **Why students think this:** It looks like a Cartesian printer, just with different belt routing
   - **How to correct:** Show the math: moving in X requires both motors; moving in Y requires both motors in opposite directions. The kinematics are fundamentally different despite visual similarity

5. **"You can set acceleration as high as you want if motors are powerful enough"**
   - **Why students think this:** They focus on motor torque and ignore other constraints
   - **How to correct:** Explain the full constraint chain: inertia, mechanical resonances, belt elasticity, coupling between axes, print quality degradation. Show real examples of ringing artifacts from too-high acceleration

6. **"Jerk is just another word for acceleration"**
   - **Why students think this:** The firmware parameter names (JERK vs ACCELERATION) make them seem parallel
   - **How to correct:** Graph the derivatives: position → velocity (first) → acceleration (second) → jerk (third). Show that high jerk means acceleration changes abruptly, causing mechanical stress even if peak acceleration is moderate

7. **"Lookahead just means processing G-code ahead of time"**
   - **Why students think this:** The name suggests "looking ahead" at buffered commands
   - **How to correct:** Explain the optimization aspect: lookahead calculates maximum safe speeds at junctions by analyzing the next N moves together. It's not just preprocessing — it's motion optimization

8. **"Delta printers have independent towers like Cartesian has independent axes"**
   - **Why students think this:** Visual similarity — three vertical towers suggest three independent axes
   - **How to correct:** Demonstrate coupled motion: moving in X requires all three towers to adjust. Show the inverse kinematics equations to make the coupling explicit

9. **"Input shaping is a firmware setting you just turn on"**
   - **Why students think this:** Modern firmware makes it seem like a checkbox feature
   - **How to correct:** Explain the underlying signal processing — you're convolving acceleration commands with a shaping function tuned to the printer's resonant frequency. It requires measurement (accelerometer data) and calibration

10. **"Pressure advance is just a constant offset to extrusion"**
    - **Why students think this:** The term "advance" suggests a simple time shift
    - **How to correct:** Show that it's proportional to acceleration — extruder speed must lead/lag toolhead speed during accel/decel to maintain constant pressure. Static offset wouldn't help with dynamic changes

11. **"Klipper is objectively better than Marlin"**
    - **Why students think this:** Klipper's marketing emphasizes performance advantages
    - **How to correct:** Present the tradeoffs: Klipper needs a host computer (more failure points), Marlin runs standalone. Klipper has more processing power for complex features, Marlin is simpler to debug. Neither is universally superior

## Level Adjustments

### For this intermediate level:
- **Include code reading** — students should be comfortable with C/C++ and can trace firmware execution
- **Use real URLs** — link directly to source code in Marlin/Klipper repos, not abstracted tutorials
- **Expect mathematical comfort** — derivatives, trigonometry, basic linear algebra are fair game
- **Focus on implementation** — not just "what is lookahead" but "how does Marlin implement it"
- **Encourage experimentation** — modify firmware parameters, recompile, observe results

### If teaching at beginner level instead:
- More visual explanations, less code
- Focus on conceptual understanding over implementation details
- Provide more scaffolding for math (e.g., "acceleration is how quickly speed changes")
- Use GUI tools (OctoPrint, Pronterface) more than command line
- Spend more time on Cartesian before introducing CoreXY/Delta

### If teaching at advanced level instead:
- Dive into ISR (Interrupt Service Routine) implementation details
- Explore numerical stability and floating-point precision issues
- Cover advanced topics: non-Cartesian robots (SCARA, 5-axis), path smoothing algorithms, trajectory optimization
- Assign implementation projects: write a motion planner from scratch
- Discuss real-time operating systems and scheduling for multi-threaded firmware

## Rabbit Holes (Fascinating Tangents)

### When to deploy:

- **RepRap history and open-source hardware movement** — drop this in during lesson 1-3 when covering firmware basics. Explains why there are so many firmware forks and why documentation is community-driven

- **Grbl and CNC motion control** — mention during motion planning lessons (11-17). 3D printer firmware borrowed heavily from CNC; Grbl's junction deviation algorithm is the basis for modern lookahead

- **Sensorless homing using StallGuard** — bring up during stepper motor lessons (1-2) if students ask about endstops. Fascinating hack that detects stalls via back-EMF without physical switches

- **RTOS (Real-Time Operating Systems) vs bare-metal** — relevant during lesson 2 (timing/interrupts) if students wonder about multitasking in firmware. Most firmware is bare-metal; some use FreeRTOS

- **Physics of belt stretch and backlash** — mention during kinematics lessons (6-10) when discussing positioning accuracy. Connects mechanical design to firmware assumptions

- **Field-Oriented Control (FOC) for BLDC motors** — advanced tangent for lesson 1 if students ask about brushless motors. Most printers use steppers, but high-end systems use BLDC with closed-loop control

- **TCP (Tool Center Point) control for robotic arms** — relevant during advanced kinematics (18-21). Delta printers are parallel robots; industrial robots use similar math but with serial kinematics

- **Model Predictive Control (MPC) for heaters** — can mention during firmware architecture lessons (25-26). Klipper and RRF use MPC for temperature control; connects to motion control via control theory

- **G-code extensions and custom commands** — drop in during lesson 3 (G-code parsing). Different firmwares add their own commands (M851 for Z-offset, M900 for linear advance)

- **Historical transition from AVR to ARM processors** — relevant for lesson 25 (firmware comparison). Marlin started on 8-bit AVR; now runs on 32-bit ARM. Explains performance differences and feature availability

## Difficulty Progression

The curriculum follows a wave pattern for cognitive load:

- **Lessons 1-5** (difficulty 1-2): Gentle introduction, building confidence with motor control basics
- **Lessons 6-9** (difficulty 2-4): First major ramp — kinematics concepts get challenging, especially inverse kinematics for Delta
- **Lesson 10** (difficulty 1): Review to consolidate before motion planning
- **Lessons 11-14** (difficulty 2-4): Second ramp — motion planning algorithms are conceptually dense
- **Lessons 15-16** (difficulty 3): Practical application to reinforce learning
- **Lesson 17** (difficulty 2): Review to consolidate motion planning
- **Lessons 18-21** (difficulty 3-4): Peak difficulty — advanced kinematics and implementation
- **Lesson 22** (difficulty 2): Review before final module
- **Lessons 23-26** (difficulty 3-4): Integration and synthesis, but building on solid foundation

This structure provides breathing room (reviews) after each conceptual climb, preventing cognitive overload.

## Engagement Strategies

1. **Use visual motion simulators** — tools like `plotjuggler` for Klipper data, online kinematics calculators, GeoGebra for geometric visualizations
2. **Encourage firmware modification** — students learn best by changing parameters and observing results on real or simulated printers
3. **Leverage the open-source community** — point to GitHub issues, Klipper Discourse discussions, Reddit communities where these topics are actively debated
4. **Connect to print quality** — constantly relate firmware concepts to observable artifacts (ringing, layer shifts, blobs) to maintain relevance
5. **Comparative analysis** — frequently ask "how does Marlin solve this vs Klipper?" to deepen understanding through contrast
6. **Real-world constraints** — emphasize that firmware must run on resource-constrained microcontrollers, making algorithm efficiency critical

## Resources for Adaptive Teaching

If student struggles with:
- **Math/calculus** → use graphical tools (Desmos, GeoGebra) to visualize derivatives
- **Code reading** → start with Python (Klipper klippy) before C++ (Marlin), it's more readable
- **Abstraction** → use physical analogies (car acceleration, water pressure for extrusion dynamics)
- **Delta kinematics** → spend extra time with 2D examples before 3D, use online calculators for immediate feedback

If student excels:
- **Challenge with implementation projects** → "write a simple motion planner", "implement S-curve acceleration"
- **Explore research papers** → trajectory optimization, real-time path planning, optimal control
- **Cross-domain connections** → robotic arms, CNC machines, drones all use similar control theory
- **Contribute to open-source firmware** → guide them toward beginner-friendly issues in Marlin/Klipper repos
