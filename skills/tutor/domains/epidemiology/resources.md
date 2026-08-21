# Epidemiology — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Gordis Epidemiology** (Leon Gordis, updated by new authors) — The gold standard introductory textbook. Clear explanations, clinical examples, minimal math. Perfect for intermediate learners. Used in most MPH programs worldwide. Available as e-book through university libraries.

- **Modern Epidemiology** (Kenneth J. Rothman, Sander Greenland, Timothy L. Lash) — Comprehensive advanced reference. More technical and philosophical than Gordis. Excellent for deep dives into causal inference, bias analysis, and study design nuances. [Oxford University Press](https://global.oup.com/academic/product/epidemiology-9780197751541)

- **Epidemiology: An Introduction** (Kenneth J. Rothman, with Krista F. Huybrechts, Eleanor J. Murray) — Newer, more accessible than Modern Epidemiology. Good balance of conceptual clarity and rigor. [Oxford University Press](https://global.oup.com/academic/product/epidemiology-9780197751541)

- **Epidemiology Kept Simple** (B. Burt Gerstman) — True to its title. Great for students who find abstract concepts challenging. Uses public health examples throughout.

### University Courses & Syllabi

- **Johns Hopkins Bloomberg School of Public Health — PH.340 Principles of Epidemiology** — The canonical epidemiology course. Johns Hopkins is the #1 ranked school of public health. [Course catalog](https://e-catalogue.jhu.edu/course-descriptions/epidemiology/)

- **Harvard T.H. Chan School of Public Health — Introduction to Epidemiology and Biostatistics** — Includes hands-on R programming with NHANES data (National Health and Nutrition Examination Survey). Bridges epidemiology and data analysis. [Course browser](https://coursebrowser.dce.harvard.edu/course/introduction-to-epidemiology-and-biostatistics/)

- **Johns Hopkins Graduate Summer Institute** — Intensive multi-week courses on epidemiology and biostatistics. Syllabi often publicly available. Good for seeing how topics scaffold. [Program details](https://publichealth.jhu.edu/academics/graduate-summer-institute-of-epidemiology-and-biostatistics/courses)

### Online Courses

- **Coursera — Epidemiology: The Basic Science of Public Health** (University of North Carolina Chapel Hill) — Comprehensive online course with video lectures, quizzes, and real-world case studies. ~6 weeks. [Course link](https://www.coursera.org/learn/epidemiology)

- **Coursera — Epidemiology in Public Health Practice Specialization** (Johns Hopkins) — Multi-course series covering study design, outbreak investigation, and data analysis. More applied than academic. [Specialization](https://www.coursera.org/specializations/professional-epidemiology)

- **edX — Epidemiology Courses** — Multiple courses from universities worldwide. Browse by level. [Course catalog](https://www.edx.org/learn/epidemiology)

- **Biostatistics.ca — Epidemiology Fundamentals** — Canadian resource with modules on study design, measures, bias, confounding. Free online materials. [Link](https://www.biostatistics.ca/epidemiology-fundamentals/)

## Videos & Lectures

### YouTube Channels & Series

- **Johns Hopkins Bloomberg School of Public Health YouTube** — Lectures, seminars, and grand rounds from leading epidemiologists. Search for specific topics (e.g., "confounding," "case-control design").

- **CDC Training Videos** — Practical outbreak investigation and surveillance videos. Great for seeing how descriptive epidemiology is applied in the field.

- **Khan Academy Medicine — Healthcare and Medicine** — Some basic epidemiology videos (prevalence, incidence, screening). Entry-level but clear.

### Specific Lectures (search on YouTube or course platforms)

- **"Epidemiology: The Foundation of Public Health"** — Overview lectures from Coursera courses
- **"John Snow and the Broad Street Pump"** — Historical case study videos
- **"Understanding Confounding"** — Many universities post lectures on this tricky concept
- **"Outbreak Investigation 101"** — CDC and state health department training videos

## Interactive Tools & Simulators

### Outbreak Simulation

- **Operation Outbreak** [https://operationoutbreak.org/] — Mobile app-based outbreak simulator. Uses Bluetooth proximity to model pathogen spread through a real group (classroom, dorm). Customizable pathogen parameters (R0, incubation, symptoms). Visualizes contact networks and transmission chains. Developed by epidemiologists and educators. Best tool for making transmission dynamics tangible.

- **BioInteractive — Modeling Disease Spread** [https://www.biointeractive.org/classroom-resources/modeling-disease-spread] — Web-based SIR model simulators. "Outbreak Simulator" for small populations (watch each individual). "Epidemic Simulator" for large populations (see curves). Adjust transmission rate, recovery rate, initial conditions. Instantly see impact on epidemic curves. From Howard Hughes Medical Institute — high-quality educational resource.

- **CDC epiENGAGE Outbreak Simulator** (Meyers Lab, UT Austin) — Pandemic scenario simulator with real-time intervention testing. Pre-defined scenarios (influenza, novel coronavirus) or custom pathogens. Implement interventions (vaccination, social distancing, quarantine) and watch outcomes. Used in public health training. [CDC Learning Resources](https://www.cdc.gov/forecast-outbreak-analytics/learningresources/index.html)

### Training & Practice

- **Disease Detective Cards** — Free card game for learning outbreak investigation. Teaches case definition, epidemic curves, 2x2 tables, attack rates, stratification, confounding. Developed for CDC training. Can be played solo or in groups. [PMC Article describing it](https://pmc.ncbi.nlm.nih.gov/articles/PMC6924897/)

- **EpiSimS** (Los Alamos National Laboratory) — Agent-based model for simulating disease spread in realistic contact networks. More advanced, requires computational skills.

### Data Analysis Tools

- **R with `epitools` package** — Calculate epidemiologic measures (RR, OR, attributable risk) and confidence intervals. Many tutorials online.

- **OpenEpi** [www.openepi.com] — Web-based calculators for epidemiologic statistics. No software installation needed. Good for quick calculations and learning.

- **NHANES Data** (National Health and Nutrition Examination Survey) — Real US health survey data. Used in Harvard course for hands-on practice. Accessible via R or Python.

## Code & Repositories

### GitHub Repositories

- **Epirecipes** [github.com/epirecipes/epiRecipes] — Cookbook of epidemiological models in R. SIR, SEIR, stochastic models, spatial models. Worked examples with code.

- **epicontacts** [github.com/reconhub/epicontacts] — R package for visualizing and analyzing disease outbreak contact networks. Used in COVID-19 and Ebola outbreak investigations.

- **EpiModel** [github.com/EpiModel/EpiModel] — R package for mathematical modeling of infectious disease. Network-based, individual-based, and compartmental models.

### Jupyter Notebooks

- Search GitHub for "epidemiology jupyter notebook" — many instructors share teaching notebooks with worked examples in Python or R.

- **Outbreak Science** repositories — Computational epidemiology teaching materials, often in Jupyter format.

## People to Follow (Researchers & Practitioners)

### Foundational Figures (historical)

- **John Snow** (1813-1858) — Father of epidemiology (cholera and Broad Street pump)
- **Austin Bradford Hill** (1897-1991) — Developed Bradford Hill criteria for causation, pioneered RCTs
- **Leon Gordis** (1934-2015) — Author of Gordis Epidemiology, influential teacher

### Contemporary Leaders

- **Kenneth Rothman** — Editor of Modern Epidemiology, expert on causal inference and bias
- **Sander Greenland** — Biostatistician/epidemiologist, causal inference, Bayesian methods
- **Marc Lipsitch** — Harvard epidemiologist, infectious disease, pandemic preparedness
- **Michael Mina** — Epidemiologist/immunologist, rapid testing, COVID-19 response
- **Caitlin Rivers** — Johns Hopkins epidemiologist, outbreak response, biosecurity
- **Adam Kucharski** — London School of Hygiene & Tropical Medicine, infectious disease modeling, author of "The Rules of Contagion"
- **Lauren Ancel Meyers** — UT Austin, outbreak modeling, epiENGAGE simulator developer
- **Natalie Dean** — Biostatistician/epidemiologist, vaccine trials, outbreak response
- **Miguel Hernán** — Harvard, causal inference, DAGs, author of "Causal Inference" book

### Twitter/Social Media (for current discussions)

- Many of the above are active on Twitter (now X) discussing outbreaks, methods, and papers
- **#epitwitter** — Epidemiology community hashtag
- **@JHSPH_CHS**, **@HarvardChanSPH** — Institutional accounts sharing research and news

## Cross-Discipline Connections

### Unexpected Applications

1. **Network Science** — Contact networks in epidemiology use same mathematics as social networks (Facebook), infrastructure networks (power grids), and neural networks. Small-world and scale-free properties apply. Read Albert-László Barabási's "Linked."

2. **Historical Linguistics** — Spread of languages follows similar dynamics to disease spread. Cultural transmission models borrow from epidemiology. See "phylogenetic epidemiology" of languages.

3. **Computer Security** — Computer virus spread follows epidemiological models (SIR, SEIR). Cybersecurity researchers use R0, contact networks, and outbreak investigation methods.

4. **Marketing & Viral Content** — "Going viral" is literal. Information spread models adapt SIR frameworks. Malcolm Gladwell's "Tipping Point" popularized epidemiologic concepts in marketing.

5. **Ecology** — Disease ecology, population dynamics, predator-prey models (Lotka-Volterra) relate to epidemiological models. Zoonotic diseases (spillover from animals) connect ecology and epidemiology.

6. **Economics** — Financial contagion models (bank failures, market panics) use epidemic models. Behavioral economics studies how health behaviors spread through social networks.

7. **Physics** — Percolation theory (how liquids flow through porous materials) mathematically similar to epidemic spread through networks. Critical thresholds, phase transitions.

8. **Criminology** — Gang violence and crime spread modeled epidemiologically. "Cure Violence" program treats shootings as contagious and uses outbreak investigation methods.

9. **Addiction & Mental Health** — Opioid epidemic, suicide clusters treated as contagion phenomena. Social contagion of behaviors (smoking, obesity, happiness) studied epidemiologically. See Christakis & Fowler's "Connected."

10. **AI Safety & Misinformation** — Fake news spread modeled with SIR frameworks. Bots as "superspreaders." Fact-checking as "vaccination." Emerging field of "info-demiology."

### Books Bridging Epidemiology & Other Fields

- **"The Rules of Contagion"** (Adam Kucharski) — Connects disease outbreaks, financial crises, viral ideas, and fake news through contagion mathematics.

- **"Spillover"** (David Quammen) — Narrative of zoonotic diseases (Ebola, HIV, SARS, COVID-19). Connects ecology, evolution, and epidemiology.

- **"The Ghost Map"** (Steven Johnson) — Narrative of John Snow and 1854 cholera outbreak. History of cities, sanitation, and disease.

- **"Connected"** (Nicholas Christakis & James Fowler) — How social networks shape behavior, health, and happiness. Applies network epidemiology to obesity, smoking, emotions.

- **"Infections and Inequalities"** (Paul Farmer) — Social determinants of health, structural violence, and infectious disease. Critical epidemiology perspective.

- **"Mountains Beyond Mountains"** (Tracy Kidder) — Biography of Paul Farmer, connecting clinical medicine, epidemiology, and global health equity.

## Journals & Publications (for advanced students)

- **American Journal of Epidemiology** — Flagship journal of the field
- **Epidemiology** — Methods and applications
- **International Journal of Epidemiology** — Global perspective
- **The Lancet** and **New England Journal of Medicine** — Publish major epidemiologic studies
- **Morbidity and Mortality Weekly Report (MMWR)** — CDC's outbreak reports, fast and practical

## Datasets for Practice

- **NHANES** (National Health and Nutrition Examination Survey) — US cross-sectional health data
- **Framingham Heart Study** — Longitudinal cardiovascular data (restricted access)
- **CDC WONDER** — Mortality, natality, cancer incidence data
- **Global Health Data Exchange (GHDx)** — International health datasets
- **Our World in Data** — COVID-19 and other global health data visualizations

## Podcasts (for learning on the go)

- **"This Podcast Will Kill You"** — Two epidemiologists discuss infectious diseases, combining history, science, and humor
- **"Epidemic"** — Podcast series on past epidemics (smallpox, plague, polio)
- **Freakonomics Radio health episodes** — Some episodes apply economic thinking to epidemiology
- **STAT's "The Readout Loud"** — Biotech/health news with epidemiologic angles

## Final Note

Epidemiology is a living field — outbreaks happen constantly, methods evolve, and new applications emerge. Follow recent outbreaks (monkeypox, H5N1 avian flu, measles resurgence) to see epidemiologic principles in action. The best learning happens when you apply concepts to current events.
