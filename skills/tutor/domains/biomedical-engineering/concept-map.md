# Biomedical Engineering — Prosthetics and Implants: Concept Map

## Core Concepts (in learning order)

1. **Biocompatibility** — the ability of a material to perform with an appropriate host response in a specific application
2. **Corrosion resistance** — material property preventing degradation in physiological environments
3. **Osseointegration** — direct structural and functional connection between living bone and implant surface
4. **Gait biomechanics** — analysis of forces, moments, and motion during human walking
5. **Ground reaction forces** — forces exerted by the ground on the body during locomotion. Depends on: gait biomechanics
6. **Joint moments** — rotational forces acting at anatomical joints during movement. Depends on: ground reaction forces, gait biomechanics
7. **Fatigue failure** — progressive structural damage under cyclic loading. Depends on: mechanical properties, stress analysis
8. **Stress shielding** — reduction in bone density due to altered load distribution around an implant. Depends on: osseointegration, mechanical properties
9. **ESAR feet** — Energy Storage And Return prosthetic feet using compliant materials. Depends on: gait biomechanics, material properties
10. **Carbon fiber mechanics** — mechanical behavior of composite materials used in prosthetics. Depends on: material science fundamentals
11. **Hydraulic damping** — controlled resistance to motion using fluid dynamics. Depends on: mechanical engineering principles
12. **Sensor fusion** — combining multiple sensor inputs for enhanced control. Depends on: signal processing, control theory
13. **Pressure distribution** — spatial variation of contact forces at the limb-socket interface. Depends on: soft tissue mechanics
14. **Soft tissue mechanics** — biomechanical behavior of skin, muscle, and fat under loading
15. **Percutaneous implants** — devices that penetrate the skin, creating a permanent opening. Depends on: osseointegration, infection control
16. **Electromyography (EMG)** — measurement of electrical signals from muscle activation
17. **Motor unit recruitment** — physiological process of activating muscle fibers. Depends on: neuromuscular physiology
18. **Surface EMG** — non-invasive measurement of muscle electrical activity from skin surface. Depends on: EMG principles
19. **Signal conditioning** — filtering and amplification of raw EMG signals. Depends on: surface EMG, electronics
20. **Degrees of freedom** — number of independent motions a prosthetic joint can perform
21. **Pattern recognition** — algorithmic classification of EMG signals to identify intended movements. Depends on: surface EMG, machine learning
22. **Targeted muscle reinnervation (TMR)** — surgical transfer of residual nerves to alternative muscle sites. Depends on: neural regeneration, EMG
23. **Brain-computer interfaces (BCI)** — direct communication between brain activity and external devices
24. **Cortical signals** — electrical activity from the cerebral cortex. Depends on: neurophysiology
25. **Spike sorting** — classification of individual neuron action potentials from multi-unit recordings. Depends on: cortical signals, signal processing
26. **Decoder algorithms** — computational methods translating neural activity into control commands. Depends on: spike sorting, machine learning
27. **Sensory feedback** — providing tactile or proprioceptive information back to the user
28. **Haptic actuators** — devices that create tactile sensations through vibration or force. Depends on: sensory feedback principles
29. **Peripheral nerve stimulation** — electrical activation of sensory nerves to restore feeling. Depends on: neurophysiology, sensory feedback
30. **Joint kinematics** — description of joint motion without considering forces
31. **Bearing surfaces** — contact interfaces in joint replacements that allow low-friction motion. Depends on: tribology, material science
32. **Hermetic sealing** — complete isolation of device internals from body fluids. Depends on: materials engineering
33. **Tonotopic mapping** — spatial organization of frequency sensitivity in the auditory system
34. **Electrode arrays** — multi-contact stimulation or recording devices. Depends on: neural interface design
35. **FDA classification** — risk-based regulatory categories for medical devices
36. **510(k) pathway** — regulatory route demonstrating substantial equivalence to existing devices. Depends on: FDA classification
37. **Patient-reported outcomes** — health status measures from the patient's perspective
38. **Functional assessments** — objective measurements of device performance in real-world tasks. Depends on: biomechanics, clinical methodology
39. **Neuroethics** — ethical considerations surrounding neuroscience and neurotechnology
40. **Soft robotics** — compliant, adaptable robotic systems inspired by biological organisms

## Dependencies

### Foundation Layer (Lessons 1-4)
- **Biocompatibility** is the fundamental requirement for all implantable materials — without it, no device can safely remain in the body
- **Osseointegration** builds on biocompatibility and enables direct skeletal attachment, critical for both implants and advanced prosthetic interfaces
- **Gait biomechanics** provides the functional context for lower limb prosthetic design — you can't design a foot without understanding how humans walk
- **Fatigue failure** and **stress shielding** explain why devices fail long-term, essential for design optimization

### Prosthetic Mechanics (Lessons 5-9)
- **ESAR feet** apply gait biomechanics and material properties to create passive energy return
- **Microprocessor knees** integrate sensor fusion, hydraulic damping, and gait analysis for adaptive control
- **Socket design** requires understanding pressure distribution and soft tissue mechanics to prevent pain and injury
- **Osseointegrated prosthetics** eliminate socket issues but introduce infection risk management

### Neural Control (Lessons 10-18)
- **EMG fundamentals** (motor unit recruitment, surface EMG, signal conditioning) form the base for myoelectric control
- **Pattern recognition** algorithms build on clean EMG signals to enable multi-function prosthetic hands
- **TMR** amplifies the control signal quality, making pattern recognition more robust
- **BCIs** represent the most direct control pathway but require spike sorting and sophisticated decoder algorithms
- **Sensory feedback** (haptic, peripheral nerve stim) closes the control loop, essential for dexterous manipulation

### Clinical Translation (Lessons 19-24)
- **Joint replacements** demonstrate mature implant technology with well-understood failure modes
- **Cardiac devices** showcase ultra-reliable long-term implants with strict power constraints
- **Cochlear implants** illustrate successful neural interface translation from lab to widespread clinical use
- **Regulatory pathways** (FDA classification, 510(k), clinical trials) govern how all these technologies reach patients

### Ethics and Future (Lessons 25-26)
- **Neuroethics** addresses questions of autonomy, privacy, and equity raised by neural interfaces
- **Emerging technologies** (soft robotics, bioelectronics, tissue engineering) point toward next-generation solutions

## Prerequisite Topics

- **Human anatomy and physiology** — needed for understanding residual limb structure, joint function, muscle activation, nerve pathways
- **Materials science fundamentals** — needed for biocompatibility, mechanical properties, corrosion resistance, fatigue analysis
- **Basic circuit theory** — needed for EMG signal conditioning, impedance, filters, amplifiers
- **Mechanics and dynamics** — needed for gait analysis, joint moments, stress/strain analysis, energy return

## Critical Bottlenecks

These concepts are prerequisites for many downstream topics:

1. **Gait biomechanics** — gates access to all lower limb prosthetic design
2. **Surface EMG** — gates access to all myoelectric control topics
3. **Biocompatibility** — gates access to all implantable device topics
4. **FDA classification** — gates access to understanding how any device reaches clinical use

## Common Learning Jumps

Students often want to jump ahead to "cool" topics (brain-controlled arms, thought-reading implants) without building foundations. The dependencies show why this fails:

- You can't understand **BCI decoders** without first understanding **spike sorting**
- You can't design **microprocessor knees** without understanding **gait biomechanics**
- You can't evaluate **TMR outcomes** without understanding **EMG signal quality**
- You can't assess **clinical trial results** without understanding **functional assessment methods**

The curriculum enforces these dependencies while keeping motivation high through well-timed "wow factor" topics (lesson 9 on osseointegration, lesson 15 on BCIs, lesson 21 on cochlear implants).
