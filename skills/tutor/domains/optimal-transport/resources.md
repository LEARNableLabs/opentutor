# Optimal Transport — Resources

## Primary Sources (for lesson content)

### Comprehensive Textbooks

- **Villani, "Optimal Transport: Old and New"** (2009)
  - The definitive 1000-page treatise. Free online: https://cedricvillani.org/
  - Covers everything from classical theory to modern applications
  - Best for: Reference, deep dives, historical context
  - Level: Advanced graduate, but intermediate students can extract nuggets

- **Santambrogio, "Optimal Transport for Applied Mathematicians"** (2015)
  - Free PDF widely available online
  - Application-focused, more accessible than Villani
  - Excellent for: Computational methods, connections to PDEs
  - Level: Graduate/advanced undergraduate

- **Ambrosio, Brué, Semola, "Lectures on Optimal Transport"** (Springer, 2021)
  - Modern graduate textbook from Scuola Normale Superiore
  - https://link.springer.com/book/10.1007/978-3-030-72162-6
  - Clean, well-organized, good for structured learning
  - Level: Graduate

- **Villani, "Topics in Optimal Transportation"** (2003)
  - Shorter, more focused than "Old and New"
  - Accessible introduction to the field
  - Level: Graduate

### Lecture Notes (Free, High-Quality)

- **Matthew Thorpe (Cambridge)**
  - https://www.damtp.cam.ac.uk/research/cia/files/teaching/Optimal_Transport_Notes.pdf
  - Clear introduction with exercises
  - Covers: Monge, Kantorovich, duality, Wasserstein, applications
  - Perfect for intermediate students

- **Riccardo Cristoferi (Radboud University)**
  - https://www.math.ru.nl/~cristoferi/pdf/LectureNotes/Cristoferi-Optimal%20Transport%20-%20Lecture%20Notes.pdf
  - Self-contained, designed for first exposure
  - Excellent pedagogical approach

- **Gabriel Peyré (CNRS)**
  - https://optimaltransport.github.io/slides-peyre/CourseOT.pdf
  - "Course notes on Computational Optimal Transport"
  - Best computational/algorithmic treatment
  - Covers Sinkhorn extensively

- **Luigi Ambrosio (Scuola Normale Superiore)**
  - https://cvgmt.sns.it/media/doc/paper/1008/trasporto.pdf
  - "Lecture Notes on Optimal Transport Problems"
  - Classic introduction to Monge-Kantorovich problem

- **Tomas Sjödin (Linköping University)**
  - https://courses.mai.liu.se/FU/MAI0140/opttrans.pdf
  - Another solid set of lecture notes

- **Larry Wasserman (CMU)**
  - https://www.stat.cmu.edu/~larry/=sml/Opt.pdf
  - "Optimal Transport and Wasserstein Distance"
  - Statistical perspective, good for data science applications

- **Stony Brook OMT Lectures**
  - https://www3.cs.stonybrook.edu/~gu/lectures/OMT/OMT.html
  - Covers dual formulation, Brenier, applications to deep learning
  - Updated constantly

### Course Syllabi & Materials

- **UCSB Math 260J** (Katy Craig)
  - https://web.math.ucsb.edu/~kcraig/math/260J_W22.html
  - Graduate course on optimal transport
  - Modern applications, well-organized

- **Georgia Tech AE 8803**
  - https://ae.gatech.edu/sites/default/files/file/2023/02/AE%208803_Optimal%20Transport%20Theory%20and%20Applications.pdf
  - Applications in aerospace engineering
  - Shows OT in engineering context

- **Oxford C4.9** (2023-24)
  - https://courses.maths.ox.ac.uk/course/view.php?id=5062
  - "Optimal Transport & Partial Differential Equations"
  - Connection to PDEs emphasized

- **PKU/BICMR Big Data Course**
  - http://faculty.bicmr.pku.edu.cn/~wenzw/bigdata/lect-ot.pdf
  - Computational and big data focus

## Supplementary Resources

### Interactive Visualizations

- **Optimal Transport Visualization (GitHub)**
  - https://mf02511.github.io/Optimal-Transport-Visualization/
  - Interactive simulations from basic to complex
  - Click to map points and see optimal transport
  - Excellent for building intuition

- **DataKnobs Interactive Guide**
  - https://www.dataknobs.com/blog/data-centric/what-is-optimal-transport.html
  - Animations of distribution matching via OT distance minimization
  - Great for visual learners

- **Alex Williams Blog Tutorial**
  - https://alexhwilliams.info/itsneuronalblog/2020/10/09/optimal-transport/
  - "A Short Introduction to Optimal Transport and Wasserstein Distance"
  - Intuition-first approach with excellent visualizations
  - Regularization strength heatmaps

### Videos & Lectures

- Search YouTube for:
  - "Optimal transport Villani" — Villani's public lectures
  - "Wasserstein GAN" — connection to machine learning
  - "Sinkhorn algorithm tutorial" — computational methods
  - University course recordings from Oxford, Cambridge, MIT

### Code & Implementation

- **Python Optimal Transport (POT)**
  - https://pythonot.github.io/
  - Comprehensive Python library
  - GPU support, modern algorithms
  - Examples and tutorials included

- **R transport package**
  - https://cran.r-project.org/web/packages/transport/transport.pdf
  - https://rdrr.io/cran/transport/man/transport_track.html
  - Discrete OT computation and visualization
  - Dynamic visualization of transport plans

- **Computational OT Papers & Code**
  - Solomon et al., "Convolutional Wasserstein Distances"
  - https://people.csail.mit.edu/jsolomon/assets/convolutional_w2.compressed.pdf
  - Efficient OT computation methods

### Application Papers

- **Ocean Mover's Distance**
  - https://royalsocietypublishing.org/doi/10.1098/rspa.2021.0875
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC9215217/
  - Using OT for oceanographic data analysis
  - Shows real-world scientific application

- **Wasserstein GANs** (Arjovsky et al., 2017)
  - Search arXiv: "Wasserstein GAN"
  - Revolutionized GAN training using OT

## People to Follow

### Foundational Figures
- **Gaspard Monge** (1746-1818) — original problem formulation
- **Leonid Kantorovich** (1912-1986) — convex relaxation, Nobel Prize in Economics (1975)
- **Yann Brenier** — characterization theorem for optimal maps

### Modern Researchers
- **Cédric Villani** — Fields Medal 2010, "Optimal Transport: Old and New"
- **Alessio Figalli** — Fields Medal 2018, regularity theory for optimal maps
- **Filippo Santambrogio** — applied optimal transport
- **Gabriel Peyré** — computational optimal transport
- **Marco Cuturi** — Sinkhorn distances, computational methods
- **Justin Solomon** — computational optimal transport, computer graphics
- **Felix Otto** — gradient flows, Riemannian geometry interpretation
- **Katy Craig** — applied OT, teaching materials

### Active Research Groups
- École Normale Supérieure (Paris)
- Scuola Normale Superiore (Pisa)
- ETH Zürich
- MIT CSAIL (geometric data processing)
- ENS Lyon (computational OT)

## Unexpected Connections & Rabbit Holes

### Cross-Disciplinary Applications

- **Economics**: Hedonic pricing, matching markets (Galichon)
- **Biology**: Cell tracking, morphogenesis
- **Urban Planning**: Transportation networks, resource allocation
- **Meteorology**: Weather forecasting, cyclone tracking
- **Astrophysics**: Galaxy formation simulations
- **Image Processing**: Color transfer (Rabin & Peyré), texture synthesis
- **Natural Language Processing**: Word embeddings, document distances
- **Quantum Computing**: Quantum optimal transport
- **Fairness in ML**: Fair classification using Wasserstein

### Theoretical Extensions

- **Gromov-Wasserstein Distance**: OT between different metric spaces
- **Unbalanced OT**: Relaxing equal mass constraint
- **Multi-marginal OT**: More than two distributions
- **Martingale OT**: Constraints from finance
- **OT on Graphs**: Discrete structures
- **OT on Manifolds**: Riemannian geometry

### Historical Notes

- Monge's problem posed in 1781 for military engineering
- Kantorovich's work motivated by Soviet economics (1940s)
- Revival in 1990s through connections to PDEs (Brenier, Otto, Villani)
- Recent explosion due to machine learning applications (2010s-)

## Tools & Software

### Python Libraries
- **POT** (Python Optimal Transport) — most comprehensive
- **GeomLoss** — for PyTorch integration
- **OTT-JAX** — JAX implementation for GPU acceleration

### R Packages
- **transport** — discrete OT computation
- **Optimal Transport Tools** — various functions

### Julia
- **OptimalTransport.jl** — high-performance implementations

### Visualization Tools
- Matplotlib/Plotly for transport plans
- Interactive web demos (JavaScript/D3.js)
- R Shiny apps for OT exploration

## Learning Paths

### For Intermediate Students (This Curriculum)
1. Start with Thorpe or Cristoferi lecture notes
2. Use interactive visualizations early and often
3. Implement discrete OT and Sinkhorn from scratch
4. Read Santambrogio for applications
5. Explore POT library for real data experiments

### For Going Deeper
1. Work through Ambrosio et al. textbook
2. Read selected chapters of Villani "Old and New"
3. Study gradient flow theory (Ambrosio-Gigli-Savaré)
4. Explore regularity theory (Figalli's work)
5. Dive into computational papers (Peyré, Cuturi, Solomon)

### For Applications Focus
1. POT library documentation and examples
2. Gabriel Peyré's computational course
3. Machine learning papers using OT
4. Domain-specific applications in your field

## Recommended Reading Order

1. **First exposure**: Alex Williams blog OR Thorpe notes (first 20 pages)
2. **Build foundation**: Cristoferi notes OR Santambrogio Ch 1-3
3. **Deepen theory**: Ambrosio et al. OR Villani "Topics"
4. **Computational**: Peyré's course notes + POT tutorials
5. **Applications**: Domain-specific papers, Wasserstein GAN paper
6. **Advanced**: Villani "Old and New" (selected chapters), gradient flow theory

## Community Resources

- **Optimal Transport Discord/Slack** — Check if community channels exist
- **MathOverflow/StackExchange** — Active OT tags
- **Reddit r/math** — Occasional OT discussions
- **Twitter/X** — Follow researchers above for latest papers
- **arXiv** — Search "optimal transport" for latest preprints (math.OC, cs.LG categories)

## Practice Problems

- Thorpe's notes include exercises
- Ambrosio et al. has end-of-chapter problems
- Implement algorithms from scratch (best practice!)
- Apply to real datasets (UCI repository, Kaggle)
