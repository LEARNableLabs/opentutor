# Mechatronics — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 7 lessons (24%)
- **real-world application challenges** — 5 lessons (17%)
- **teach-back exercises (student explains)** — 5 lessons (17%)
- **Socratic questions** — 4 lessons (14%)
- **review and consolidation sessions** — 4 lessons (14%)
- **curated resource exploration** — 4 lessons (14%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 41% accessible (1-2), 38% standard (3), 21% challenging (4-5).

Difficulty peaks:
- Day 10: "How do you accelerate a stepper motor without losing steps?" (difficulty 4)
- Day 16: "How does each PID term fix a different problem?" (difficulty 4)
- Day 17: "How do you tune a PID controller that won't settle?" (difficulty 4)
- Day 18: "Why do some systems fight back when you try to control them?" (difficulty 4)
- Day 23: "What happens when your control loop takes too long to execute?" (difficulty 4)

## Domain Hooks
- **Kalman Filtering** — drop this in during lesson 4 (proximity sensors) or lesson 26 (IMU fusion). Show a noisy sensor trace, then a Kalman-filtered version. "This is what self-driving cars use to know where they are." Resources: [How a Kalman Filter Works](https://www.bzarg.com/p/how-a-kalman-filter-works-in-pictures/), [Extended Kalman Filter tutorial](https://www.youtube.com/watch?v=DE6Jn2cB4J4)

- **Compliant Control & Impedance Matching** — introduce during lesson 10 (power transmission) or lesson 25 (industrial automation). "How does a robot arm pick up an egg without crushing it? It doesn't just control position — it controls *force*." Resources: [Impedance Control Explained](https://www.youtube.com/watch?v=3FVbXs7jZPI)

- **Soft Robotics** — drop in lesson 27 (future of mechatronics). Show a video of a soft gripper or pneumatic actuator. "What if robots were made of rubber instead of metal?" Resources: [Soft Robotics Toolkit](https://softroboticstoolkit.com/), [Harvard soft g

## Common Failure Modes
1. **"I can learn mechatronics by mastering each domain separately"** — Many students come from single-discipline backgrounds (CS, ME, or EE) and try to sequester domains. Mechatronics is about *interfaces* and *integration*. A perfectly tuned PID controller fails if the sensor is noisy or the motor driver has deadband. Teach systems thinking from lesson 1.

2. **"Sensors output clean, accurate data"** — Real sensors are noisy, drift with temperature, have hysteresis, and occasionally glitch. Students who've only worked with simulated data are shocked when their encoder skips counts or their IMU drifts. Emphasize signal conditioning, filtering, and sanity checks early.

3. **"PID tuning is an exact science"** — Students expect a formula that yields optimal gains. In reality, tuning is empirical and domain-specific. Ziegler-Nichols is a starting point, not gospel. Teach students to *observe* system response (overshoot, settling time, steady-state error) and adjust methodically.

4. **"F

## Vocabulary
Key terms for this domain: system integration, interdisciplinary design, feedback loops, transducers, signal conditioning, analog-to-digital conversion, rotary encoders, quadrature encoding, resolution vs accuracy, proximity sensors, ultrasonic sensing, infrared sensing, capacitive sensing, pull-up resistors, debouncing (and 83 more).