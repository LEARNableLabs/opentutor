# Power Systems — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Power System Analysis and Design** by Glover, Sarma, and Overbye — The industry standard textbook. Clear explanations, abundant examples, covers fundamentals through modern grid topics. Ideal for intermediate learners. Includes software (PowerWorld).
  - https://www.cengage.com/c/power-system-analysis-and-design-6e-glover

- **Power System Analysis** by Grainger and Stevenson — Classic reference, more rigorous mathematical treatment. Good for students wanting deeper theory.
  - https://www.mheducation.com/

- **Electric Energy Systems: Analysis and Operation** by Olle Elgerd — Excellent pedagogical approach, strong on physical intuition. Slightly dated (1982) but fundamentals remain relevant.

- **Power System Stability and Control** by Kundur — The definitive reference on stability. Advanced, but essential for lessons 22-25.
  - https://www.mheducation.com/

### University Courses (Open Access)

- **MIT 6.061: Introduction to Electric Power Systems** — Open CourseWare with lecture notes, problem sets, and exams. Covers fundamentals through stability.
  - https://ocw.mit.edu/courses/6-061-introduction-to-electric-power-systems-spring-2011/

- **NPTEL Power Systems** (IIT courses) — Free video lectures on power system analysis, protection, and control. Strong on problem-solving.
  - https://nptel.ac.in/courses/108105053

- **Stanford EE 292: Electric Power Systems** — Modern treatment with renewable integration. Not fully open, but syllabus and references are available.
  - https://explorecourses.stanford.edu/

- **Coursera: Sustainable Energy** (University of Washington) — Broader than power systems alone, but good context for energy transition.
  - https://www.coursera.org/specializations/sustainable-energy

## Supplementary (for engagement)

### Video Channels

- **The Engineering Mindset** — Exceptional animated explanations of transformers, generators, grid structure. Highly visual, perfect for building intuition.
  - https://www.youtube.com/c/TheEngineeringMindset

- **Practical Engineering** — Real-world infrastructure focus. Videos on transmission lines, substations, grid resilience.
  - https://www.youtube.com/c/PracticalEngineeringChannel

- **3Blue1Brown** — For phasor visualization, watch the Euler's formula and Fourier series videos. Not power systems specific, but essential math background.
  - https://www.3blue1brown.com/lessons/eulers-formula

- **Khan Academy: Electrical Engineering** — Review AC circuits, phasors, and complex numbers if needed.
  - https://www.khanacademy.org/science/electrical-engineering

### Interactive Tools and Software

- **PowerWorld Simulator** — Industry-standard power flow and stability simulator. Free educational version available. Start here.
  - https://www.powerworld.com/products/simulator/educational-resources

- **GridLAB-D** — Open-source distribution system simulator. Great for DER and microgrid modeling.
  - https://www.gridlabd.org/

- **pandapower** (Python) — Lightweight power flow library. Scriptable, integrates with NumPy/pandas. Good for automation.
  - https://www.pandapower.org/

- **OpenDSS** — EPRI's distribution system simulator. Widely used in industry for DER studies.
  - https://www.epri.com/pages/sa/opendss

- **MATPOWER** (MATLAB/Octave) — Research-grade power flow and optimal power flow solver.
  - https://matpower.org/

- **Desmos** — For interactive phasor and power triangle visualization.
  - https://www.desmos.com/

- **GeoGebra** — 3D visualization of three-phase systems, phasor rotation.
  - https://www.geogebra.org/

### Datasets and Real Grid Information

- **EIA (US Energy Information Administration)** — Generation mix, demand data, grid statistics.
  - https://www.eia.gov/

- **ERCOT (Electric Reliability Council of Texas)** — Real-time grid frequency, load, and generation data. Great for live examples.
  - https://www.ercot.com/

- **CAISO (California ISO)** — Market data, renewable integration statistics, duck curve data.
  - https://www.caiso.com/

- **PJM Interconnection** — Eastern US grid operator. Load forecasts, LMP data, system operations.
  - https://www.pjm.com/

- **NERC (North American Electric Reliability Corporation)** — Reliability standards, blackout reports, planning data.
  - https://www.nerc.com/

- **IEEE Power & Energy Society** — Standards, conferences, educational webinars.
  - https://www.ieee-pes.org/

- **NREL (National Renewable Energy Laboratory)** — Renewable integration studies, grid modernization research.
  - https://www.nrel.gov/grid/

- **EPRI (Electric Power Research Institute)** — Industry research, whitepapers, software tools.
  - https://www.epri.com/

### Code and Simulation Examples

- **pandapower tutorials** — Jupyter notebooks with power flow, optimal power flow, and time-series examples.
  - https://github.com/e2nIEE/pandapower

- **PyPSA (Python for Power System Analysis)** — Open-source framework for modeling future energy systems (renewables, storage, sector coupling).
  - https://pypsa.org/

- **PowerModels.jl** (Julia) — Optimization-based power flow for research applications.
  - https://lanl-ansi.github.io/PowerModels.jl/

- **GridPath** — Open-source capacity expansion and production cost modeling.
  - https://www.gridpath.io/

## People (researchers, practitioners, educators)

- **Prabha Kundur** — Author of the stability bible. His work defines how we analyze transient stability.
- **Joe Chow** (Rensselaer) — Power system dynamics and control expert.
- **Duncan Callaway** (UC Berkeley) — Renewable integration, demand response, grid flexibility.
- **Gabriela Hug** (ETH Zurich) — Grid optimization, security, and resilience.
- **Jesse Jenkins** (Princeton) — Energy systems modeling, policy, and decarbonization pathways.
- **Jessika Trancik** (MIT) — Energy technology cost analysis, including grid and storage.
- **Marija Ilic** (MIT) — Dynamic modeling and control of complex power systems.

Follow these researchers on Twitter/X for cutting-edge discussions on grid modernization, stability, and renewable integration.

## Unexpected Connections (for wild cards and rabbit holes)

- **RF Engineering and ABCD Parameters** — S-parameters in RF transmission are mathematically analogous to ABCD parameters for transmission lines. Cross-pollinate with students from communications engineering.

- **Control Theory: Frequency as PID** — Automatic generation control (AGC) is a classic feedback control problem. If students know PID controllers, draw the parallel.

- **Economics: Electricity Markets** — Power systems aren't just engineering—they're economic systems. Locational marginal pricing (LMP) is optimization + game theory.

- **Climate Science: Grid Decarbonization** — Transitioning to 100% renewables requires rethinking dispatch, storage, and transmission. Grid engineering is climate engineering.

- **Data Science: Load Forecasting** — Machine learning for predicting demand and renewable generation. Time-series forecasting, neural networks, etc.

- **Urban Planning: Electrification** — EVs, heat pumps, and building electrification will double electricity demand in some areas. How does the grid adapt?

- **History: The War of Currents** — Edison (DC) vs. Tesla/Westinghouse (AC). AC won for transmission, but HVDC is making a comeback. Full circle.

- **Geopolitics: Energy Security** — Grid infrastructure as critical national infrastructure. Ukraine blackouts, cyberattacks on Colonial Pipeline, Texas freeze—all grid resilience stories.

- **Mathematics: Graph Theory** — Power grids are graphs (nodes = buses, edges = lines). Shortest path algorithms, network centrality, robustness metrics.

- **Physics: Maxwell's Equations** — At the deepest level, power flow is just Maxwell's equations applied to coupled RLC networks.

## Trade Journals and Industry News

- **IEEE Spectrum** — Accessible articles on grid tech, renewables, and energy policy.
  - https://spectrum.ieee.org/

- **Utility Dive** — Daily news on electric utilities, regulation, and clean energy.
  - https://www.utilitydive.com/

- **Greentech Media** (now Wood Mackenzie) — Renewable energy markets and grid innovation.
  - https://www.greentechmedia.com/

- **Electric Power Research Institute (EPRI) Journal** — Research updates and case studies.
  - https://www.epri.com/

## Conferences (for advanced students eyeing grad school or industry)

- **IEEE PES General Meeting** — Premier power systems conference. Latest research and industry trends.
- **CIGRE** — International Council on Large Electric Systems. European focus, high-quality technical papers.
- **INFORMS Energy Conference** — Optimization, operations research, and markets.
