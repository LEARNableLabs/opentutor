# 3D Printer Firmware — Motion Planning and Kinematics — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 9 lessons (33%)
- **Socratic questions** — 5 lessons (19%)
- **real-world application challenges** — 5 lessons (19%)
- **review and consolidation sessions** — 4 lessons (15%)
- **teach-back exercises (student explains)** — 3 lessons (11%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 41% accessible (1-2), 33% standard (3), 26% challenging (4-5).

Difficulty peaks:
- Day 9: "Why do delta printers need inverse kinematics?" (difficulty 4)
- Day 14: "What's the difference between trapezoidal and S-curve acceleration?" (difficulty 4)
- Day 15: "How does lookahead prevent the printer from stopping at every corner?" (difficulty 4)
- Day 19: "How do we compute delta arm positions from XYZ coordinates?" (difficulty 4)
- Day 22: "How would you implement a simple kinematics solver?" (difficulty 4)

## Domain Hooks
This field covers 3d printer firmware — motion planning and kinematics, with applications across theory and practice.

## Common Failure Modes
1. **"Stepper motors provide position feedback"**
   - **Why students think this:** Stepper motors seem "smart" because they move precisely, and students confuse this with closed-loop control
   - **How to correct:** Emphasize that steppers are open-loop — firmware counts steps and assumes they executed. Demonstrate a missed step causing permanent position error that firmware can't detect without external sensors (endstops, encoders)

2. **"G-code commands execute immediately"**
   - **Why students think this:** The text-based interface makes it seem like a direct command interpreter
   - **How to correct:** Show the processing pipeline: parsing → planning → buffering → execution. Point out that `G1 X100` might sit in the lookahead buffer for 10+ moves before executing

3. **"Cartesian printers just send G-code coordinates directly to motors"**
   - **Why students think this:** The 1:1 mapping seems trivial
   - **How to correct:** Even simple Cartesian systems need coordinate transfor

## Vocabulary
Key terms for this domain: stepper motors, step/direction signals, microstepping, interrupt-driven control, real-time constraints, timer precision, G-code parsing, coordinate transformation, feed rate calculation, teaching synthesis, motor control recap, inertia, resonance, physical constraints, stepper recap (and 57 more).