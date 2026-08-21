# MEMS and Microsystems — Resources

## Primary Sources (for lesson content)

### Textbooks

- **"Microsystem Design" by Stephen D. Senturia** (Springer, 2001) — The MIT MEMS textbook. Comprehensive treatment of lumped modeling, energy methods, fabrication, and transduction. Excellent for intermediate to advanced students. Heavy on physics and first principles. Covers electrostatic actuation, damping, thermal effects in depth.

- **"Foundations of MEMS" by Chang Liu** (Pearson, 2nd edition 2011) — UIUC textbook. Clear explanations of fabrication processes and device physics. More accessible than Senturia, good balance of breadth and depth. Strong on process flows and material properties. Recommended for intermediate level.

- **"Fundamentals of Microfabrication and Nanotechnology" by Marc Madou** (CRC Press, 3rd edition 2011) — Encyclopedic coverage of fabrication. Goes deep into chemistry and process details. Use as reference for specific processes (wet etching, LIGA, electroplating). More process-focused than device-focused.

- **"MEMS and Microsystems: Design, Manufacture, and Nanoscale Engineering" by Tai-Ran Hsu** (Wiley, 3rd edition 2022) — Design-oriented with case studies. Good for seeing complete design workflows from specification to fabrication. Includes chapters on MEMS CAD tools.

### Online Courses

- **MIT OpenCourseWare: 6.777 Design and Fabrication of Microelectromechanical Devices** (Spring 2007)
  - https://ocw.mit.edu/courses/6-777j-design-and-fabrication-of-microelectromechanical-devices-spring-2007/
  - Taught by Martin Schmidt and Carol Livermore. Full lecture notes, assignments, exams, and video lectures. Covers scaling, fabrication, transduction, design examples. Excellent intermediate-level resource aligned with Senturia textbook.

- **MIT OpenCourseWare: 6.152J Micro/Nano Processing Technology** (Fall 2005)
  - https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/
  - Deep dive into fabrication: lithography, deposition, etching. More chemistry and process details than 6.777. Good supplement for fabrication-heavy lessons.

- **Stanford Online: Introduction to MEMS** (various platforms)
  - Often available on Stanford Online or EdX. Covers fundamentals, fabrication, and applications.

- **NPTEL (India): MEMS courses**
  - https://nptel.ac.in/courses/112/106/112106234/
  - Free video lectures from IITs. Good for alternative explanations and additional examples.

### Journal Articles and Reviews

- **"MEMS accelerometers and gyroscopes: a tutorial" by N. Yazdi, F. Ayazi, K. Najafi** (IEEE Sensors Journal, 1998)
  - Classic tutorial on inertial sensors. Good for lessons 12, 20.

- **"Mechanical resonators for sensing and signal processing" by A.N. Cleland** (Nature, 2013)
  - https://www.nature.com/articles/nnano.2016.193
  - Modern overview of resonant sensing from NEMS to MEMS.

- **"Microfluidics: fluid physics at the nanoliter scale" by T.M. Squires and S.R. Quake** (Reviews of Modern Physics, 2005)
  - https://www.nature.com/articles/nature05058
  - Comprehensive review of microfluidics physics. Good for lesson 23.

## Supplementary (for engagement)

### Video Lectures and Channels

- **MIT 6.777 Video Lectures** (MIT OpenCourseWare YouTube)
  - https://www.youtube.com/playlist?list=PLUl4u3cNGP62WVs3MMTe0eKlpdn7xH-Bk
  - Full lecture series from Martin Schmidt. Professional production, clear explanations.

- **Applied Science YouTube Channel** (Ben Krasnow)
  - https://www.youtube.com/user/bkraz333
  - DIY fabrication, electron microscopy, teardowns of MEMS devices. Engaging and accessible.

- **Breaking Taps** (YouTube)
  - https://www.youtube.com/c/BreakingTaps
  - Cleanroom processes, microfabrication tutorials, fab safety. Good for visualizing processes.

- **Texas Instruments DLP Technology**
  - https://www.youtube.com/watch?v=7V4IjHWHfNI
  - Official videos explaining DMD technology. Great for lesson 19.

- **How It's Made: MEMS** (YouTube, various)
  - Search "How It's Made MEMS" for manufacturing documentaries on accelerometers, gyroscopes, microphones.

### Interactive Tools and Simulators

- **COMSOL Multiphysics** (commercial, academic licenses available)
  - https://www.comsol.com/
  - Industry-standard multiphysics FEM. Excellent for electrostatic actuators, thermal analysis, microfluidics. Model library includes comb drives, cantilevers, etc.

- **CoventorWare** (commercial)
  - https://www.coventor.com/
  - MEMS-specific FEM and system-level simulation. Process-aware modeling.

- **SUGAR** (open-source)
  - http://www-bsac.eecs.berkeley.edu/cadtools/sugar/sugar/
  - Nodal simulation tool from UC Berkeley. MATLAB-based. Good for quick mechanical analysis of beams, plates, comb drives. Free but dated.

- **MEMSolver** (open-source Python)
  - Various GitHub repositories
  - Python tools for MEMS lumped modeling. Good for students to experiment with parameter sweeps.

- **Online Calculators**
  - Cantilever beam calculator: https://www.engineeringtoolbox.com/cantilever-beams-d_1848.html
  - Resonant frequency calculators on various engineering sites
  - Pull-in voltage calculators (search "parallel plate pull-in calculator")

### Manufacturer Resources

- **Analog Devices MEMS Documentation**
  - https://www.analog.com/en/parametricsearch/11171
  - Application notes, tutorials, and datasheets for ADXL accelerometers, ADIS IMUs, ADXRS gyroscopes. Real performance specs and design examples.

- **Bosch Sensortec**
  - https://www.bosch-sensortec.com/
  - Datasheets for BMA accelerometers, BMG gyroscopes, BMI IMUs. Good for seeing state-of-the-art consumer MEMS specs.

- **InvenSense (TDK)**
  - https://invensense.tdk.com/
  - MPU-6050 and related IMU datasheets. Widely used in hobby projects (Arduino, drones).

- **STMicroelectronics MEMS**
  - https://www.st.com/en/mems-and-sensors.html
  - Extensive application notes on accelerometers, gyroscopes, magnetometers, pressure sensors. Good technical depth.

- **Knowles Acoustics**
  - https://www.knowles.com/
  - MEMS microphone datasheets and white papers. Good for capacitive sensing examples.

### Code and Repositories

- **MEMS Calculator (GitHub)**
  - Search GitHub for "MEMS calculator" to find Python/MATLAB tools for beam mechanics, electrostatic actuators, etc.

- **FreeCAD and OpenSCAD**
  - Can be used to visualize 3D MEMS structures. Not MEMS-specific but useful for geometry.

- **Jupyter Notebooks for MEMS**
  - Search for "MEMS Jupyter" on GitHub. Some educators have published interactive notebooks for scaling laws, actuator modeling, etc.

## People (Researchers and Practitioners to Follow)

### Pioneers and Luminaries

- **Kurt Petersen** — MEMS pioneer, founder of multiple MEMS companies. Classic 1982 paper "Silicon as a Mechanical Material" is foundational.

- **Richard Muller and Roger Howe** — UC Berkeley professors who trained generations of MEMS researchers. Howe's work on surface micromachining was groundbreaking.

- **Stephen Senturia** — MIT professor, author of "Microsystem Design." Key contributions to MEMS CAD and modeling.

- **Khalil Najafi** — University of Michigan, leader in MEMS sensing and packaging.

- **Kristofer Pister** — UC Berkeley, smart dust, wireless sensor networks, MEMS for IoT.

- **Michael Roukes** — Caltech, NEMS pioneer, quantum MEMS.

### Contemporary Leaders

- **Farrokh Ayazi** — Georgia Tech, MEMS resonators and timing references.

- **Carol Livermore** — MIT, mechanical MEMS, metrology.

- **Andrei Shkel** — UC Irvine, MEMS gyroscopes and inertial sensors.

- **Liwei Lin** — UC Berkeley, thermal MEMS, microfluidics, energy harvesting.

- **Gianluca Piazza** — CMU, piezoelectric MEMS, AlN resonators.

### Industry Leaders

- **Larry Hornbeck** — Inventor of TI's Digital Micromirror Device. Great story of perseverance from concept to billion-dollar product.

- **MEMS teams at Analog Devices, Bosch, STMicroelectronics** — pushing state-of-the-art in consumer and automotive MEMS.

## Unexpected Connections (for wild cards)

### Art and MEMS
- **Arthur Ganson** — kinetic sculptor who uses micromachining techniques to create intricate mechanical art. Shows aesthetic side of tiny mechanisms.
- **MEMS and optical art** — Micromirror arrays for laser light shows, holographic displays.

### MEMS in Nature
- **Insect mechanosensors** — Insect antennae and hairs are biological MEMS, detecting airflow, vibration, and sound. Some have sub-nanometer displacement sensitivity.
- **Butterfly wing photonics** — Nanostructured photonic crystals create structural color, similar to MEMS photonic devices.

### MEMS and Music
- **Micromachined acoustic instruments** — Researchers have built micro-xylophones and resonators that produce audible tones. Novelty but shows the playful side of the field.

### Medical Implants
- **Cochlear implants** — Use MEMS accelerometers for impact detection.
- **Pacemakers** — Increasingly using MEMS pressure sensors and accelerometers for adaptive pacing.
- **Drug delivery** — MEMS pumps and valves for controlled release implants.

### Energy Harvesting
- **Piezoelectric energy harvesters** — Scavenging energy from vibration, footsteps, blood flow.
- **Electrostatic harvesters** — Using variable capacitance to convert vibration to electricity.
- **Thermoelectric MEMS** — Converting body heat or waste heat to power for wearables.

## Conference Proceedings and Standards

- **IEEE MEMS Conference** — Annual conference, proceedings available via IEEE Xplore. See cutting-edge research.
- **Transducers Conference** — Biennial, broader scope (sensors and actuators). Good for seeing applications.
- **Hilton Head Workshop** — Solid-state sensors, actuators, and microsystems. Smaller, more focused than MEMS conference.
- **JMEMS (Journal of Microelectromechanical Systems)** — Premier journal in the field. IEEE Xplore.

## Standards and Test Methods

- **ASTM International** — Standards for MEMS materials testing, fatigue, residual stress measurement.
- **IEC 62047** — International standards for MEMS and microsystems.
- **Automotive MEMS standards** — AEC-Q100, ISO 26262 for automotive-grade MEMS.

## Where to Find More

- **MEMS Industry Group** — https://www.memsindustrygroup.org/ — Industry news, market reports, conferences.
- **MEMS Exchange** — https://www.mems-exchange.org/ — Community resource, introductory material.
- **Yole Développement** — Market research on MEMS industry trends and forecasts.
- **ResearchGate, arXiv, and Google Scholar** — For finding specific papers and preprints.
