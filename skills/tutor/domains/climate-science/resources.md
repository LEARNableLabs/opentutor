# Climate Science — Modeling and Feedbacks: Resources

## Primary Sources (for lesson content)

### Textbooks

- **Climate System Dynamics and Modelling** by Hugues Goosse (Cambridge University Press, 2015) — The best graduate/advanced undergraduate text covering all climate system components with emphasis on feedbacks and modeling. Comprehensive, mathematically rigorous but accessible. Perfect for intermediate students.
  - https://www.cambridge.org/highereducation/books/climate-system-dynamics-and-modelling/C8FC9D02159C8D9FD2146976AA8D28A6

- **Global Warming: Understanding the Forecast** by David Archer (Wiley, 2011) — More qualitative and accessible. Good for building intuition before diving into math. Used in many university courses.

- **Climate System Modeling** edited by K.E. Trenberth (Cambridge University Press, 2009) — Advanced but authoritative reference on model development.

### University Courses

- **MIT OCW 12.340: Global Warming Science** — Excellent intermediate-level course using hierarchy of models from toy models to 1D climate models. Includes problem sets and lecture notes.
  - https://ocw.mit.edu/courses/12-340-global-warming-science-spring-2012/

- **MIT Open Learning Library 12.340x** — Self-paced version with interactive components, includes module on GCMs.
  - https://openlearninglibrary.mit.edu/courses/course-v1:MITx+12.340x+1T2020/

- **University of Michigan CLIMATE 589: The Art of Climate Modeling** — Hands-on course using CESM and MPAS models. Syllabus provides great roadmap for model exploration.
  - https://clasp.engin.umich.edu/wp-content/uploads/sites/6/2024/02/CLIMATE589_WN24_syllabus.pdf

- **Andreas Schmittner's Climate Modeling Course Notes** — Concise, equation-heavy course notes from Oregon State. Great reference for model derivations.
  - https://andreasschmittner.github.io/Teaching/ATS421-521/2015/CourseNotes.pdf

## Supplementary Resources

### Video Lectures

- **MIT Introduction to Computational Thinking (Climate Modeling Module)** — Sessions 20-25 cover climate modeling with Julia notebooks. Video lectures + code + homework. Modern, computational approach.
  - https://climate.mit.edu/posts/climate-modeling-introduction-computational-thinking

- **Coursera: Global Warming I: The Science and Modeling of Climate Change** (University of Chicago) — Includes exercises for building simple analytical and numerical models. More accessible than MIT OCW.
  - https://www.coursera.org/learn/global-warming

- **Khan Academy: Climate Change** — Shorter, accessible videos on feedbacks (especially albedo feedback) and basic climate concepts. Good for visual learners or review.
  - https://www.khanacademy.org/science/ap-college-environmental-science/x0b0e430a38ebd23f:global-change/x0b0e430a38ebd23f:climate-change/v/climate-emergency-feedback-loops-albedo

### Interactive Tools

- **CLEAN Network: Climate Feedback Loops** — Educational resources with visualizations and interactive lessons on positive and negative feedback loops.
  - https://cleanet.org/resources/45132.html

- **Climate Change Academy: Understanding Climate Feedbacks** — Interactive educational site with clear explanations of how Earth's systems interact.
  - https://climatechange.academy/introduction-to-climate-change/understanding-climate-feedbacks-earth-systems/

- **MARGO framework** — Mentioned in MIT climate seminar; interactive tool for exploring emissions scenarios and climate impacts. (Search for "MARGO climate" for current version)

### Code & Repositories

- **Julia climate modeling notebooks** — Available through MIT Computational Thinking course. Modern language, good for scientific computing beginners.

- **Python climate data analysis tutorials** — Many available through Class Central aggregations (search "climate modeling Python"). Libraries: xarray for NetCDF/CMIP data, matplotlib/cartopy for visualization.

- **Climlab** (Python package) — Build simple climate models (EBMs, RCMs) without starting from scratch. Great for intermediate students.
  - https://climlab.readthedocs.io/

### Data Sources

- **CMIP (Coupled Model Intercomparison Project)** — Multi-model ensemble data used by IPCC. Available through ESGF nodes. Essential for lessons on model spread and uncertainty.
  - https://pcmdi.llnl.gov/CMIP6/

- **NOAA Climate.gov** — Observational data, explainers, and visualizations. Good for model validation exercises.
  - https://www.climate.gov/

## Key Papers & Reports (for context)

- **IPCC AR6 Working Group I: Physical Science Basis** — Comprehensive assessment of climate science. Chapter 7 covers feedbacks and climate sensitivity.
  - https://www.ipcc.ch/report/ar6/wg1/

- **IPCC TAR Chapter 7: Physical Climate Processes and Feedbacks** — Older but pedagogically clear treatment of feedback mechanisms.
  - https://www.ipcc.ch/site/assets/uploads/2018/03/TAR-07.pdf

## People to Follow

### Researchers & Educators

- **Gavin Schmidt** (NASA GISS) — Climate modeler, clear communicator, active on social media
- **Kate Marvel** (Columbia/NASA) — Cloud feedback expert, excellent writer
- **Kerry Emanuel** (MIT) — Atmospheric science, extreme weather and climate
- **Tapio Schneider** (Caltech) — Climate dynamics and machine learning for climate
- **Andrew Dessler** (Texas A&M) — Climate feedbacks, especially water vapor
- **Sarah Myhre** — Paleoclimate scientist, science communication

### Science Communicators

- **Climate scientist community on Mastodon/Twitter** — Real-time discussions of new papers, model releases
- **RealClimate blog** — Run by working climate scientists, rigorous but accessible
- **Carbon Brief** — Excellent journalism on climate science and policy

## Unexpected Cross-Discipline Connections

### Control Theory
Climate feedbacks are literally the language of control systems engineering. Gain, stability, negative feedback loops — same math, different application. Students with engineering backgrounds often have "aha!" moments when this connection clicks.

### Paleoclimatology
Ice cores, sediment records, and tree rings provide natural experiments. When discussing feedback strength, mention that glacial-interglacial cycles are a real-world test of climate sensitivity with known forcings and responses.

### Economics & Game Theory
Integrated Assessment Models (IAMs) couple climate models with economic models. Introduces optimal control, discounting, and strategic decision-making under uncertainty. Relevant for students interested in policy.

### Information Theory
Climate prediction is fundamentally about information: how much can we learn from imperfect models and incomplete data? Entropy, signal-to-noise, and Bayesian inference all apply. For math-heavy students.

### Complexity Science
Climate is a complex adaptive system with emergent behavior, tipping points, and self-organization. Connects to ecology, neuroscience, and economics. Great for students who like systems thinking.

### Machine Learning
Modern climate science increasingly uses ML for parameterization, emulation, and pattern detection. Climate data is a perfect testbed for scientific ML. Growing field, exciting for computationally-minded students.

## Additional Context

- **Historical Development**: The physics of the greenhouse effect was understood in the 1800s (Fourier, Tyndall, Arrhenius). GCMs emerged in the 1960s (Manabe, Smagorinsky). Understanding this history shows climate science isn't new or politically motivated — it's based on centuries of physics.

- **Open Science**: Much climate model code is open source (CESM, GFDL, MPI-ESM). Students can literally read and run the code used in IPCC reports. Emphasize this transparency.

- **Computational Scale**: State-of-the-art GCMs run on supercomputers for weeks to produce century-scale simulations. Appreciate this scale, but also emphasize that simple models on laptops capture essential dynamics.
