# Nuclear Physics and Nuclear Engineering — Resources

## Primary Sources (for lesson content)

### Textbooks

- **"Introduction to Nuclear Engineering" by Lamarsh & Baratta** (4th ed., 2017) — The standard undergraduate text. Covers reactor physics, fuel cycle, radiation detection, and shielding. Excellent problem sets. Best for intermediate students with calculus/physics background. ~900 pages, comprehensive.

- **"Nuclear Physics: Principles and Applications" by John Lilley** (2001) — Accessible treatment of nuclear structure, decay, reactions, and applications. Less mathematical than Krane, more conceptual. Good for building intuition before diving into reactor engineering. ~400 pages.

- **"Fundamentals of Nuclear Science and Engineering" by Shultis & Faw** (3rd ed., 2016) — Similar scope to Lamarsh but more modern examples (AP1000, fusion progress). Strong on Monte Carlo methods and computational tools. Includes MATLAB code examples.

- **"Nuclear Reactor Analysis" by Duderstadt & Hamilton** (1976) — Classic advanced text on reactor theory. Heavy on transport theory, group diffusion, perturbation theory. For students going deeper into neutronics. Graduate level but accessible to strong undergrads.

- **"Radiation Detection and Measurement" by Glenn Knoll** (4th ed., 2010) — The definitive reference on detector physics. Covers gas detectors, scintillators, semiconductors, and spectroscopy. Essential for experimental nuclear physics. ~850 pages, encyclopedic.

### Online Courses (Free)

- **MIT OpenCourseWare 22.01** — Introduction to Nuclear Engineering and Ionizing Radiation  
  https://ocw.mit.edu/courses/22-01-introduction-to-nuclear-engineering-and-ionizing-radiation-fall-2016/  
  Prof. Michael Short, fall 2016. Video lectures, lecture notes, problem sets, exams. Covers nuclear structure through reactor design. Excellent animations and demonstrations.

- **MIT OpenCourseWare 22.02** — Introduction to Applied Nuclear Physics  
  https://ocw.mit.edu/courses/22-02-introduction-to-applied-nuclear-physics-spring-2012/  
  Prof. Paola Cappellaro, spring 2012. Focus on nuclear reactions, cross-sections, and applications. More physics-heavy than 22.01.

- **NPTEL Nuclear Reactor Analysis** (India)  
  https://nptel.ac.in/courses/112106243  
  Prof. Anurag Gupta, IIT Kanpur. 40 video lectures on reactor physics, kinetics, and control. Complements MIT courses with different perspective.

### Open Educational Resources

- **HyperPhysics Nuclear Physics Section**  
  http://hyperphysics.phy-astr.gsu.edu/hbase/NucEne/nucene.html  
  Georgia State University. Concept maps, interactive diagrams, and quick explanations. Excellent for lookup and visual learning. Covers binding energy, decay, fission, fusion, reactors.

- **PhET Interactive Simulations — Nuclear Physics**  
  https://phet.colorado.edu/en/simulations/filter?subjects=physics&type=html  
  Alpha Decay: https://phet.colorado.edu/en/simulations/alpha-decay  
  Nuclear Fission: https://phet.colorado.edu/en/simulations/nuclear-fission  
  Interactive Java/HTML5 simulations from University of Colorado Boulder. Visualize decay statistics, chain reactions, criticality.

- **World Nuclear Association Information Library**  
  https://www.world-nuclear.org/information-library.aspx  
  Industry association but technically accurate. Covers reactor types, fuel cycle, waste management, economics, safety. Good for context and applications.

- **IAEA (International Atomic Energy Agency) Publications**  
  https://www.iaea.org/publications  
  Free technical reports, safety guides, and handbooks. Search for "TECDOC" series (technical documents) on specific topics. Authoritative international standards.

## Supplementary (for engagement)

### Video Lectures & Channels

- **MIT 22.01 Video Lectures** — Prof. Michael Short  
  https://ocw.mit.edu/courses/22-01-introduction-to-nuclear-engineering-and-ionizing-radiation-fall-2016/video_galleries/video-lectures/  
  30+ full lectures (~1 hour each). Watch at 1.5x speed. Short is engaging and uses lots of demos.

- **Illinois NPRE (Nuclear, Plasma, and Radiological Engineering)**  
  https://www.youtube.com/@NPREUIUC  
  Illinois Nuclear Engineering program YouTube channel. Seminars, student projects, and outreach videos. Good for seeing what nuclear engineers actually do.

- **Cody's Lab — Uranium Series**  
  https://www.youtube.com/@theCodyReeder  
  Amateur chemist/physicist extracts uranium from ore, demonstrates radioactivity, builds cloud chamber. Hands-on perspective. Educational but not academic.

- **Veritasium — "The Most Radioactive Places on Earth"**  
  https://www.youtube.com/watch?v=TRL7o2kPqw0  
  Popular science video visiting Chernobyl, Fukushima, and other contaminated sites. Good for context on radiation levels and cleanup.

- **Wendover Productions — "The Economics of Nuclear Energy"**  
  https://www.youtube.com/watch?v=UC_BCz0pzMw  
  Explains why nuclear is expensive (upfront capital, long timelines, regulation). Complements technical content with economic/policy reality.

### Interactive Tools & Databases

- **JANIS (Java-based Nuclear Data Information System)** — OECD/NEA  
  https://www.oecd-nea.org/jcms/pl_39910/janis  
  Visualize cross-sections vs. energy for any isotope. Essential for understanding resonances and energy-dependent reaction probabilities. Requires Java plugin or download.

- **IAEA Live Chart of Nuclides**  
  https://www-nds.iaea.org/relnsd/vcharthtml/VChartHTML.html  
  Interactive chart showing all known isotopes, decay modes, half-lives, and decay chains. Click any nuclide to see detailed properties. Regularly updated.

- **NNDC (National Nuclear Data Center) NuDat**  
  https://www.nndc.bnl.gov/nudat3/  
  Brookhaven National Lab's nuclear data portal. Similar to IAEA chart but with more detailed decay scheme diagrams and gamma spectroscopy data.

- **Nuclear Data Portal — IAEA**  
  https://nds.iaea.org/  
  Gateway to EXFOR (experimental cross-sections), ENDF (evaluated nuclear data), and other databases. For students doing computational projects.

- **Desmos Graphing Calculator — Decay Simulations**  
  https://www.desmos.com/calculator  
  Create custom decay chain simulations, plot activity vs. time, visualize half-life concepts. Free and browser-based.

### Code & Computational Tools

- **OpenMC** — Monte Carlo particle transport  
  https://docs.openmc.org/  
  Open-source neutron/photon transport code from MIT. Python API, modern architecture. Good for learning Monte Carlo methods without legacy MCNP Fortran.

- **PyNE (Python for Nuclear Engineering)**  
  https://pyne.io/  
  Python toolkit for nuclear data, material properties, mesh generation, and analysis. Integrates with OpenMC, MCNP, and SCALE.

- **SCALE Code System** — Oak Ridge National Lab  
  https://www.ornl.gov/scale  
  Industry-standard criticality safety and reactor physics suite. Free for U.S. academic institutions via RSICC (Radiation Safety Information Computational Center). Requires export control approval.

- **ENDF/B-VIII.0 Nuclear Data Library**  
  https://www.nndc.bnl.gov/endf/  
  Evaluated Nuclear Data Files — cross-sections, decay data, fission yields. Used by all transport codes. Browse online or download for simulations.

- **Jupyter Notebooks for Nuclear Engineering** — Various GitHub repos  
  Search "nuclear engineering jupyter" on GitHub. Examples:  
  - https://github.com/katyhuff/npre412 (UIUC reactor physics course)  
  - https://github.com/kbuff/2018-bae-412 (nuclear fuel cycle modeling)

### Real-World Context

- **World Nuclear Association — Reactor Database**  
  https://world-nuclear.org/information-library/facts-and-figures/reactor-database.aspx  
  Searchable database of all commercial reactors worldwide. Filter by type, country, status. See which designs are actually deployed.

- **IAEA PRIS (Power Reactor Information System)**  
  https://pris.iaea.org/PRIS/home.aspx  
  Real-time data on reactor operations, outages, and generation statistics. Track global nuclear power trends.

- **NRC ADAMS (Agencywide Documents Access and Management System)**  
  https://www.nrc.gov/reading-rm/adams.html  
  U.S. Nuclear Regulatory Commission's public document archive. Search licensing documents, safety evaluations, and inspection reports for operating reactors. Dense but authoritative.

- **TerraPower, NuScale, Oklo, X-energy** — Advanced Reactor Companies  
  - TerraPower: https://www.terrapower.com/ (traveling wave reactor, natrium)  
  - NuScale: https://www.nuscalepower.com/ (SMR, first certified in U.S.)  
  - Oklo: https://oklo.com/ (microreactor, fast spectrum)  
  - X-energy: https://x-energy.com/ (Xe-100 pebble bed)  
  See what Gen IV designs are moving from paper to reality.

- **ITER (International Thermonuclear Experimental Reactor)**  
  https://www.iter.org/  
  Fusion megaproject in France. Tokamak design aiming for Q>10 (10x energy out vs. in). Expected first plasma 2025. Track fusion progress.

### People to Know (Historical & Contemporary)

**Historical Figures**
- **Enrico Fermi** — First controlled chain reaction (Chicago Pile-1, 1942), reactor physics pioneer
- **Lise Meitner** — Co-discovered nuclear fission, explained binding energy mechanism
- **Hyman Rickover** — Father of nuclear Navy, drove development of PWR for submarines
- **Alvin Weinberg** — Invented pressurized water reactor, directed Oak Ridge, advocated thorium
- **Eugene Wigner** — Wigner effect (radiation damage), reactor design at Hanford

**Contemporary Leaders**
- **Kathryn Huff** — Assistant Secretary of Energy for Nuclear (DOE), academic (UIUC), open-source nuclear (PyNE)
- **Leslie Dewan** — Transatomic Power (defunct), MIT PhD, advanced reactor entrepreneur
- **Kirsty Gogan** — TerraPower, Energy for Humanity, nuclear policy advocate
- **Rauli Partanen** — Finnish nuclear advocate, author of "Climate Gamble"
- **Caroline Cochran** — Oklo co-founder, advanced microreactor design

**Researchers to Follow**
- **Michael Bluck** — Imperial College London, SMR design and safety
- **Jacopo Buongiorno** — MIT, nuclear thermal hydraulics, advanced reactor concepts
- **Stefano Buono** — Commonwealth Fusion Systems (CFS), tokamak magnets, fusion energy
- **Ahmed Abdulla** — UC San Diego, nuclear economics and policy

### Unexpected Connections (for wild cards)

- **Nuclear Archaeology** — Using isotope ratios (U-235/U-238, Pu isotopics) to determine reactor history and fuel enrichment. Applied to verifying North Korea/Iran programs, analyzing Chernobyl fuel, and studying ancient Oklo reactor.

- **Nuclear Medicine → Cancer Immunotherapy** — Radioimmunotherapy uses antibodies tagged with beta emitters (Y-90, I-131) to deliver radiation directly to cancer cells. Combines nuclear physics, immunology, and chemistry.

- **Supernovae Nucleosynthesis** — Elements heavier than iron are created in supernova explosions via r-process (rapid neutron capture). Recent neutron star mergers observed by LIGO confirmed this. Nuclear physics explains cosmic element abundance.

- **Nuclear Reactor on Mars** — NASA's Kilopower project (1-10 kW fission reactor) for Mars/Moon bases. Uses Stirling engine, enriched U-235, sodium heat pipes. Tested 2018. Shows nuclear as space power solution.

- **Geoarchaeology & Radiocarbon Dating** — C-14 dating uses beta decay (5730 yr half-life) to date organic materials. Nuclear weapons testing (1950s-60s) doubled atmospheric C-14, creating a "bomb pulse" used to date wines, forensics, and tree rings.

- **Nuclear Batteries** — Radioisotope thermoelectric generators (RTGs) power Voyager probes, Mars rovers (Curiosity, Perseverance), and pacemakers. Use alpha decay heat from Pu-238. No moving parts, decades-long operation.

- **Muon Tomography** — Cosmic ray muons penetrate matter and scatter based on density. Used to image Fukushima reactor cores (too radioactive for access), scan cargo containers (smuggled nuclear material), and study pyramids (hidden chambers).

- **Nuclear Rocket Propulsion (NERVA)** — 1960s program to use nuclear reactor to heat hydrogen propellant. Specific impulse ~800s (2x chemical rockets). Tested successfully but cancelled. Recently revived for Mars missions (NASA 2027 target).

## Curated Learning Pathways

### Path 1: Physics-First (for students coming from physics background)
1. Read Lilley textbook (Chapters 1-8) — nuclear structure and reactions
2. Work through MIT 22.02 lectures — applied nuclear physics
3. Use JANIS to explore cross-sections hands-on
4. Read Lamarsh (Chapters 1-7) — reactor physics
5. Code a simple Monte Carlo simulation in Python/OpenMC

### Path 2: Engineering-First (for students interested in reactors)
1. Watch MIT 22.01 lectures (all 30+) — comprehensive intro
2. Read Lamarsh textbook in parallel with lectures
3. Use PhET simulations to visualize concepts
4. Explore World Nuclear Association for reactor types and context
5. Read NRC public documents on a specific reactor (e.g., AP1000)

### Path 3: Applications-First (for medical/industry focus)
1. Read Knoll (Chapters 1-8) — detector physics and measurement
2. Watch medical isotope production videos (World Nuclear Association)
3. Explore IAEA publications on industrial applications
4. Study PET physics and radiotherapy dose calculations
5. Learn about isotope supply chain (Mo-99/Tc-99m crisis)

### Path 4: Computational (for students wanting to simulate)
1. Install OpenMC and work through tutorials
2. Read Shultis & Faw (Chapters 9-11) — Monte Carlo methods
3. Download ENDF/B-VIII.0 and process cross-sections with PyNE
4. Reproduce a published reactor benchmark (OECD/NEA library)
5. Visualize results with ParaView or Matplotlib

## Recommended Sequence for This Curriculum

1. **Skim MIT 22.01 lecture notes** (reading list on OCW) — get overview before starting lessons
2. **Work through lessons 1-13** — use HyperPhysics and IAEA chart of nuclides for visual reinforcement
3. **After lesson 13**: watch MIT 22.01 lectures 14-20 on reactor physics to go deeper
4. **Work through lessons 14-19** — use PhET Nuclear Fission simulation to visualize criticality
5. **After lesson 19**: explore real reactor designs on World Nuclear Association, compare PWR vs. BWR
6. **Work through lessons 20-27** — read NRC fact sheets on TMI/Fukushima for accident context
7. **Final project**: pick one topic (fusion, SMRs, medical isotopes, fuel cycle) and write a 3-page technical brief using primary sources

## Where to Go Next

After completing this curriculum:

- **Reactor Design & Safety** → MIT 22.05 (Reactor Physics), 22.06 (Engineering of Nuclear Systems)
- **Radiation Detection** → Knoll textbook + lab course in gamma spectroscopy
- **Fusion Energy** → MIT 22.63 (Fusion Energy), ITER website, Commonwealth Fusion Systems updates
- **Nuclear Policy** → Kennedy School courses, IAEA safety standards, NRC regulatory framework
- **Advanced Reactors** → TerraPower, Oklo, X-energy white papers; Gen IV International Forum roadmaps
- **Medical Physics** → AAPM (American Association of Physicists in Medicine) resources, radiotherapy textbooks
- **Computational Methods** → OpenMC, SCALE, MCNP training; OECD/NEA benchmarks

This domain is vast—every lesson can expand into a semester course. Follow your curiosity.
