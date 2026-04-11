# Optimal Transport -- Comprehensive Resource Survey

> Compiled for curriculum development. Student profile: researcher with applied math background seeking full coverage of theory, computation, and ML applications.

---

## 1. University Course Syllabi

### 1.1 ICTS / TIFR -- MTH 310.5: Optimal Transport (Semester II, 2024-25)
- **URL**: https://home.icts.res.in/~athreya/Teaching/OT24/
- **Instructor**: Siva Athreya
- **Covers**: Monge-Kantorovich problem, existence of solutions, convex functions & Legendre transforms, Kantorovich duality, Brenier's theorem, cyclical monotonicity, 1-D transport, Knothe-Rosenblatt maps, stability theorems, regularity of OT, entropy & relative entropy, entropic regularization, metric derivatives, gradient flows in Wasserstein spaces
- **Difficulty**: Intermediate to advanced (graduate)
- **Why it's good**: Well-structured 12-week progression from foundations through modern computational methods. Excellent reference list that spans theory and computation.

### 1.2 University of Oxford -- C4.9: Optimal Transport & PDEs (2023-24)
- **URL**: https://courses.maths.ox.ac.uk/course/view.php?id=5062
- **Instructor**: Jose Carrillo De La Plata
- **Covers**: Monge-Kantorovich problem, transport distances, connections to PDEs and interacting particle systems
- **Difficulty**: Advanced (Masters level, 16 lectures)
- **Why it's good**: Strong PDE perspective. Prerequisites include integration, probability, and differential equations.

### 1.3 EPFL -- MATH-476: Optimal Transport
- **URL**: https://edu.epfl.ch/coursebook/en/optimal-transport-MATH-476
- **Covers**: Part 1: Monge and Kantorovich problems (existence, properties of optimal plan). Part 2: Wasserstein distance with applications to PDEs, functional/geometric inequalities, traffic models
- **Difficulty**: Advanced (graduate)
- **Why it's good**: Clean two-part structure separating foundations from applications.

### 1.4 Georgia Tech -- AE 8803: Optimal Transport Theory and Applications
- **URL**: https://ae.gatech.edu/sites/default/files/file/2023/02/AE%208803_Optimal%20Transport%20Theory%20and%20Applications.pdf
- **Covers**: OT theory and applications in engineering/applied math
- **Difficulty**: Advanced (graduate)
- **Why it's good**: Engineering-oriented perspective, bridges theory and applications.

### 1.5 Harvard -- COMPSCI 284.0 (Fall 2025)
- **URL**: https://beta.my.harvard.edu/course/COMPSCI2840/2025-Fall/001
- **Covers**: Monge and Kantorovich formulations, duality, entropy regularization, Gromov-Wasserstein distances, dynamic formulations, Benamou-Brenier theory
- **Difficulty**: Advanced (graduate)
- **Why it's good**: CS department perspective, likely to cover computational and ML applications heavily.

### 1.6 UCSB -- Math 260J: Optimal Transport
- **URL**: https://web.math.ucsb.edu/~kcraig/math/260J_W22.html
- **Instructor**: Katy Craig
- **Covers**: Full graduate course; linked to the Optimal Transport Wiki at https://otwiki.xyz
- **Difficulty**: Advanced (graduate)
- **Why it's good**: Comes with the OT Wiki -- an excellent community-maintained reference.

### 1.7 HSE University -- Optimal Transport and Its Applications
- **URL**: https://www.hse.ru/en/edu/courses/1048899090
- **Covers**: Fundamental concepts of OT theory, applications in economics, ML, image processing, statistics
- **Difficulty**: Graduate
- **Why it's good**: Broad applications coverage including economics.

---

## 2. Canonical Textbooks

### 2.1 Villani -- *Topics in Optimal Transportation* (2003)
- **Publisher**: AMS, Graduate Studies in Mathematics, Vol. 58
- **URL**: https://bookstore.ams.org/gsm-58
- **Pages**: ~370
- **Chapter structure**:
  1. Introduction
  2. The Kantorovich duality
  3. Geometry of optimal transportation
  4. Brenier's polar factorization theorem
  5. The Monge-Ampere equation
  6. Displacement interpolation and displacement convexity
  7. Geometric and Gaussian inequalities
  8. The metric side of optimal transportation
  9. A differential point of view on optimal transportation
  10. Entropy production and transportation inequalities
  11. Problems
- **Difficulty**: Advanced (graduate, pure math)
- **Why it's good**: The first comprehensive textbook on OT. Rigorous, complete proofs, excellent problem sets. The standard starting point for mathematicians.

### 2.2 Villani -- *Optimal Transport: Old and New* (2009)
- **Publisher**: Springer, Grundlehren der Mathematischen Wissenschaften, Vol. 338
- **URL**: https://link.springer.com/book/10.1007/978-3-540-71050-9
- **Free PDF**: https://people.math.ethz.ch/~afigalli/lecture-notes-pdf/Optimal-transport-Old-and-new.pdf
- **Pages**: ~973
- **Chapter structure** (28 chapters in 3 parts + 3 introductory chapters):
  - Ch 1-3: Couplings, coupling techniques, founding fathers
  - **Part I -- Qualitative description**: Ch 4-13 (basic properties, cyclical monotonicity, Kantorovich duality, Wasserstein distances, displacement interpolation, Monge-Mather shortening, Monge problem solutions, Jacobian equation, smoothness, regularity)
  - **Part II -- OT and Riemannian geometry**: Ch 14-25 (Ricci curvature, Otto calculus, displacement convexity, volume/density control, isoperimetric & concentration inequalities, gradient flows I-III)
  - **Part III -- Synthetic treatment of Ricci curvature**: Ch 26-28 (analytic/synthetic viewpoints, convergence, stability)
- **Difficulty**: Advanced to research-level
- **Why it's good**: The encyclopedic reference. Covers everything. Deep connections to geometry and PDEs. Essential for anyone doing serious OT research, though too large for a first pass.

### 2.3 Peyre & Cuturi -- *Computational Optimal Transport* (2019)
- **Publisher**: Foundations and Trends in Machine Learning, Vol. 11, No. 5-6, pp. 355-607
- **URL (free PDF)**: https://optimaltransport.github.io/pdf/ComputationalOT.pdf
- **Book website**: https://optimaltransport.github.io/book/
- **ArXiv**: https://arxiv.org/abs/1803.00567
- **Key sections**: OT formulation, entropic regularization & Sinkhorn, semidiscrete OT, Wasserstein distances & duality, statistical aspects, OT between Gaussians, Wasserstein barycenters, sliced Wasserstein, extensions (unbalanced, partial, Gromov-Wasserstein)
- **Difficulty**: Intermediate (accessible to ML researchers)
- **Why it's good**: THE computational reference. Free, beautifully written, with reproducible code for all figures. Bridges theory and algorithms. The ideal primary textbook for an applied math / ML audience.

### 2.4 Santambrogio -- *Optimal Transport for Applied Mathematicians* (2015)
- **Publisher**: Springer, Progress in Nonlinear Differential Equations, Vol. 87
- **URL (free PDF)**: https://math.univ-lyon1.fr/~santambrogio/OTAM-cvgmt.pdf
- **Chapter structure**:
  1. Primal and Dual Problems (Kantorovich/Monge, duality, c-concavity)
  2. One-Dimensional Issues (monotone transport, histogram equalization)
  3. L1 and L-infinity Theory
  4. Minimal Flows (traffic congestion, branched transport)
  5. Wasserstein Spaces
  6. Numerical Methods
  7. Functionals over Probabilities
  8. Gradient Flows
  9. Exercises
- **Difficulty**: Advanced (graduate, applied math / PDE focus)
- **Why it's good**: More applied than Villani, includes numerical methods and applications to economics, finance, image processing, fluid dynamics. Full proofs throughout. Covers topics not in other books (Knothe transport, Dacorogna-Moser flow, supremal cost).

### 2.5 Figalli & Glaudo -- *An Invitation to Optimal Transport, Wasserstein Distances, and Gradient Flows* (2nd ed., 2023)
- **Publisher**: EMS Textbooks in Mathematics
- **URL**: https://ems.press/books/etb/190
- **Pages**: ~146
- **Covers**: Kantorovich duality, existence/uniqueness of optimal maps, Wasserstein distances, JKO scheme, Otto calculus, Wasserstein gradient flows, selected applications
- **Difficulty**: Intermediate (advanced undergraduate / beginning graduate)
- **Why it's good**: Short, self-contained, incredibly clear. By a Fields Medalist. Includes exercises with solutions. Best entry point for someone who wants rigorous theory without 900+ pages.

### 2.6 Ambrosio, Gigli & Savare -- *Gradient Flows in Metric Spaces and in the Space of Probability Measures* (2nd ed., 2008)
- **Publisher**: Birkhauser, Lectures in Mathematics ETH Zurich
- **URL**: https://link.springer.com/book/10.1007/978-3-7643-8722-8
- **Pages**: ~334
- **Structure**: Part I (gradient flows in metric spaces), Part II (gradient flows in probability measure spaces -- Wasserstein distance, geodesics, continuity equation, convex functionals, metric slope, subdifferential calculus)
- **Difficulty**: Advanced to research-level
- **Why it's good**: The foundational reference for gradient flows in Wasserstein space. Essential for understanding the PDE connection (Fokker-Planck, porous medium equation as gradient flows).

### 2.7 Ambrosio, Brue & Semola -- *Lectures on Optimal Transport* (2nd ed., 2024)
- **Publisher**: Springer UNITEXT
- **URL**: https://link.springer.com/book/10.1007/978-3-031-76834-7
- **Structure** (19 lectures):
  1. Preliminary Notions and the Monge Problem
  2. The Kantorovich Problem
  3. Kantorovich-Rubinstein Duality
  4. Necessary and Sufficient Optimality Conditions
  5. Existence of Optimal Maps and Applications
  6. Isoperimetric Inequality and Stability
  7. Monge-Ampere Equation and OT on Riemannian Manifolds
  8. The Metric Side of OT
  9. Analysis on Metric Spaces and Dynamic Formulation
  10. Wasserstein Geodesics, Nonbranching and Curvature
  11-14. Gradient Flows (introduction, Brezis-Komura, PDE examples, EDE/EDI formulations)
  15. Semicontinuity and Convexity in Wasserstein Space
  16. Continuity Equation and Hopf-Lax Semigroup
  17. Benamou-Brenier Formula
  18. Otto's Calculus
  19. Heat Flow, OT and Ricci Curvature
- **Difficulty**: Advanced (graduate)
- **Why it's good**: Lecture-based format makes it very teachable. Comprehensive coverage from foundations through Ricci curvature. From the leading Italian school of OT.

---

## 3. Video Resources

### 3.1 Gabriel Peyre -- Optimal Transport for Machine Learning (Alan Turing Institute)
- **URL**: https://mathtube.org/lecture/video/optimal-transport-machine-learning-lecture-1
- **Duration**: ~42 min
- **Covers**: Kantorovich formulation, OT distances, entropic regularization, Sinkhorn divergences, sample complexity, density fitting, generative models, GANs
- **Difficulty**: Intermediate
- **Why it's good**: By the co-author of Computational OT. Concise, visually clear, bridges theory and ML applications in one talk.

### 3.2 Crash Course on Optimal Transport (Simons Institute)
- **URL**: Available on YouTube via Class Central: https://www.classcentral.com/course/youtube-crash-course-on-optimal-transport-134432
- **Instructor**: Mikaela Iacobelli (ETH Zurich)
- **Duration**: ~1 hour
- **Covers**: Cost formulation, key definitions, optimal coupling, moment conditions, optimal transport maps
- **Difficulty**: Intro to intermediate
- **Why it's good**: Rigorous but accessible one-hour overview. Good for getting the big picture before diving into textbooks.

### 3.3 Computational Optimal Transport (Simons Institute)
- **URL**: https://www.classcentral.com/course/youtube-computational-optimal-transport-180372
- **Covers**: OT theory intersecting ML, statistics, data analysis; computational techniques and efficient algorithms
- **Difficulty**: Intermediate
- **Why it's good**: Focus on algorithmic aspects.

### 3.4 Alessio Figalli -- Stability in Geometric & Functional Inequalities (IPAM)
- **URL**: Available on YouTube via Class Central
- **Covers**: Stability questions in geometric/functional inequalities via OT
- **Difficulty**: Advanced (research-level)
- **Why it's good**: By a Fields Medalist. Shows the power of OT as a proof technique in geometric analysis.

### 3.5 Katy Craig -- Math 260J: Optimal Transport (UCSB)
- **URL**: https://web.math.ucsb.edu/~kcraig/math/260J_W22.html
- **Covers**: Full graduate course with recorded lectures
- **Difficulty**: Advanced
- **Why it's good**: Complete semester-long course with all materials.

### 3.6 Gabriel Peyre -- Numerical Optimal Transport (Speaker Deck Slides)
- **URL**: https://speakerdeck.com/gpeyre/numerical-optimal-transport-1
- **Covers**: OT formulations, entropic regularization, Sinkhorn, barycenters, unbalanced OT, gradient flows, minimum Kantorovich estimators, Gromov-Wasserstein
- **Difficulty**: Intermediate to advanced
- **Why it's good**: Comprehensive slide deck covering numerical methods. Excellent visual explanations.

### 3.7 Gabriel Peyre -- Optimal Transport for Machine Learners (2025, arXiv Course Notes)
- **URL**: https://arxiv.org/html/2505.06589
- **Covers**: Monge/Kantorovich, Brenier's theorem, dual/dynamic formulations, Bures metric on Gaussians, gradient flows, numerical methods (LP, semi-discrete, entropic), ML applications (gradient flows for neural networks, token dynamics in transformers, GANs, diffusion models)
- **Difficulty**: Intermediate
- **Why it's good**: The most recent and up-to-date course notes from the field's leading computational expert. Directly connects OT to modern ML.

---

## 4. Key Papers That Shaped the Field

### Foundational Theory

| Paper | Year | Contribution | Difficulty |
|-------|------|-------------|------------|
| **Monge**, "Memoire sur la theorie des deblais et des remblais" | 1781 | Original formulation: move mass from one configuration to another at minimal cost | Historical |
| **Kantorovich**, "On the transfer of masses" | 1942 | Relaxed formulation via transport plans (couplings), duality theorem, founded linear programming | Advanced |
| **Brenier**, "Polar factorization and monotone rearrangement of vector-valued functions", *Comm. Pure Appl. Math.* 44:375-417 | 1991 | Optimal maps are gradients of convex functions (for quadratic cost). Cornerstone existence/uniqueness result. URL: https://onlinelibrary.wiley.com/doi/abs/10.1002/cpa.3160440402 | Advanced |
| **Benamou & Brenier**, "A computational fluid mechanics solution to the Monge-Kantorovich mass transfer problem" | 2000 | Dynamic (fluid mechanics) formulation of OT. Benamou-Brenier formula. | Advanced |
| **Jordan, Kinderlehrer & Otto (JKO)**, "The variational formulation of the Fokker-Planck equation" | 1998 | Wasserstein gradient flows. Fokker-Planck as gradient flow in W2. Founded the gradient flow approach to PDEs. | Advanced |
| **Otto**, "The geometry of dissipative evolution equations" | 2001 | Riemannian structure of Wasserstein space. Otto calculus. | Advanced |
| **Ambrosio, Gigli & Savare**, *Gradient Flows in Metric Spaces* | 2005/2008 | Comprehensive theory of gradient flows in metric spaces. Book-length treatment. | Research |

### Computational Breakthroughs

| Paper | Year | Contribution | Difficulty |
|-------|------|-------------|------------|
| **Cuturi**, "Sinkhorn Distances: Lightspeed Computation of Optimal Transport", *NeurIPS 2013*. URL: https://arxiv.org/abs/1306.0895 | 2013 | Entropic regularization + Sinkhorn algorithm. Reduced OT computation by orders of magnitude. ~4700 citations. The paper that unlocked OT for ML. | Intermediate |
| **Genevay, Peyre & Cuturi**, "Learning Generative Models with Sinkhorn Divergences", *AISTATS 2018*. URL: https://arxiv.org/abs/1706.00292 | 2018 | First tractable large-scale generative models using OT-based (Sinkhorn) loss. Interpolates between Wasserstein and MMD. | Intermediate |
| **Makkuva, Taghvaei, Oh & Lee**, "Optimal Transport Mapping via Input Convex Neural Networks", *ICML 2020*. URL: https://arxiv.org/abs/1908.10962 | 2020 | Learning OT maps with ICNNs. Minimax optimization for Kantorovich potentials. Robust to initialization. | Advanced |
| **Korotin et al.**, "Do Neural Optimal Transport Solvers Work? A Continuous Wasserstein-2 Benchmark", *NeurIPS 2021*. URL: https://arxiv.org/abs/2106.01954 | 2021 | Benchmark for evaluating neural OT solvers. Ground-truth OT maps for high-dimensional continuous measures. | Advanced |
| **Korotin, Selikhanovych & Burnaev**, "Neural Optimal Transport", *ICLR 2023 Spotlight*. URL: https://github.com/iamalexkorotin/NeuralOptimalTransport | 2023 | Novel algorithm for deterministic/stochastic OT plans with general cost functions. Applicable to unpaired domain translation. | Advanced |

### ML Applications

| Paper | Year | Contribution | Difficulty |
|-------|------|-------------|------------|
| **Arjovsky, Chintala & Bottou**, "Wasserstein GAN", *ICML 2017*. URL: https://arxiv.org/abs/1701.07875 | 2017 | Use W1 distance as GAN objective. Improved stability, meaningful loss curves, reduced mode collapse. | Intermediate |
| **Gulrajani et al.**, "Improved Training of Wasserstein GANs" (WGAN-GP), *NeurIPS 2017*. URL: https://arxiv.org/abs/1704.00028 | 2017 | Gradient penalty replaces weight clipping for Lipschitz constraint. Stable training of 101-layer ResNets. | Intermediate |
| **Kusner, Sun, Kolkin & Weinberger**, "From Word Embeddings to Document Distances" (Word Mover's Distance), *ICML 2015*. URL: https://proceedings.mlr.press/v37/kusnerb15.html | 2015 | Earth mover's distance between word embedding distributions for document similarity. State-of-the-art k-NN classification. | Intro to intermediate |
| **Courty, Flamary, Tuia & Rakotomamonjy**, "Optimal Transport for Domain Adaptation", *IEEE TPAMI*. URL: https://arxiv.org/abs/1507.00504 | 2017 | OT-based domain adaptation matching source/target distributions. | Intermediate |
| **Courty et al.**, "Joint Distribution Optimal Transportation for Domain Adaptation". URL: https://arxiv.org/abs/1705.08848 | 2017 | Deep joint OT (DeepJDOT) for domain adaptation preserving label structure. | Intermediate |
| **Tong, Malkin, Bengio et al.**, "Improving and Generalizing Flow-Based Generative Models with Minibatch OT" (OT-CFM), *TMLR 2024*. URL: https://arxiv.org/abs/2302.00482 | 2024 | OT-conditioned flow matching for CNFs. Straighter flows, more stable training, faster inference. Applications to single-cell dynamics, image translation. | Advanced |
| **Lipman et al.**, "Flow Matching for Generative Modeling", *ICLR 2023* | 2023 | OT displacement interpolation to define probability paths for training CNFs. Foundation for flow matching methods. | Advanced |

---

## 5. Interactive Tools & Code Libraries

### 5.1 POT -- Python Optimal Transport
- **URL**: https://pythonot.github.io/
- **GitHub**: https://github.com/PythonOT/POT
- **PyPI**: `pip install POT` (import as `ot`)
- **JMLR paper**: https://www.jmlr.org/papers/volume22/20-451/20-451.pdf
- **Backends**: NumPy, PyTorch, JAX, TensorFlow, CuPy
- **Key features**: Exact OT (network simplex), Sinkhorn variants (stabilized, lazy GPU via GeomLoss, greedy, screening), Bregman projections for barycenters, Gromov-Wasserstein, unbalanced OT, sliced Wasserstein, domain adaptation tools
- **Scale**: Small to medium (O(n^2) memory, O(n^3 log n) time for exact solver)
- **Difficulty**: Intro to intermediate (excellent tutorials and examples)
- **Why it's good**: The most comprehensive OT library. Excellent documentation with worked examples. The standard tool for learning and prototyping OT computations. Quickstart guide at https://pythonot.github.io/quickstart.html

### 5.2 GeomLoss
- **URL**: Integrated into POT; also standalone PyTorch
- **Key features**: Memory-efficient Sinkhorn on GPU, LazyTensor for millions of samples, 10-100x speedup over naive implementations
- **Scale**: Large (millions of samples)
- **Difficulty**: Intermediate
- **Why it's good**: When you need to scale Sinkhorn to large datasets. Seamless GPU execution.

### 5.3 OTT-JAX -- Optimal Transport Tools
- **URL**: https://ott-jax.readthedocs.io/
- **Key features**: Wasserstein and Gromov-Wasserstein distances, Monge map estimation, barycenters, differentiable ranking/clustering. Takes advantage of JAX JIT compilation, VMAP, auto-differentiation, implicit differentiation.
- **Scale**: Large
- **Difficulty**: Intermediate to advanced
- **Why it's good**: Best choice for JAX users. Clean separation of geometry from solvers. Full differentiability. Recommended by the POT team for JAX workflows.

### 5.4 TorchCFM -- Conditional Flow Matching
- **URL**: https://github.com/atong01/conditional-flow-matching
- **Key features**: Implementations of flow matching variants including OT-CFM, exact OT couplings, various loss functions
- **Difficulty**: Advanced
- **Why it's good**: Reference implementation for OT-based flow matching generative models.

### 5.5 Neural OT (Korotin et al.)
- **URL**: https://github.com/iamalexkorotin/NeuralOptimalTransport
- **Key features**: PyTorch implementation of neural OT with general cost functions, W2 benchmark
- **Difficulty**: Advanced
- **Why it's good**: State-of-the-art neural OT solver with benchmarks. Good for understanding large-scale OT map estimation.

### 5.6 Numerical Tours (Peyre)
- **URL**: http://www.gpeyre.com/teaching/
- **Key features**: Repository of Matlab/Python explorations of mathematical data processing including OT
- **Difficulty**: Intro to intermediate
- **Why it's good**: Hands-on numerical experiments. Learn by coding.

---

## 6. Blog Posts & Tutorials

### 6.1 "A Short Introduction to Optimal Transport and Wasserstein Distance" -- Alex Williams
- **URL**: https://alexhwilliams.info/itsneuronalblog/2020/10/09/optimal-transport/
- **Covers**: Physical intuition (dirt-pile metaphor), OT vs KL divergence, entropy regularization, Wasserstein distance
- **Difficulty**: Intro
- **Why it's good**: Probably the best first read. Beautiful intuition, clear writing, good visuals. Grounded in physical analogies.

### 6.2 "Everyone Should Learn Optimal Transport" -- Mufan Li
- **URL**: https://mufan-li.github.io/OT1/
- **Covers**: Why OT is fundamental to probability theory. "OT gives us calculus on the space of probability distributions."
- **Difficulty**: Intermediate
- **Why it's good**: Opinionated and conceptual. Explains why OT matters beyond just being a metric. Good for building mathematical intuition.

### 6.3 "Notes on Optimal Transport" -- Michiel Stock
- **URL**: https://michielstock.github.io/posts/2017/2017-11-5-OptimalTransport/
- **Covers**: Dessert-sharing party analogy, Sinkhorn-Knopp algorithm, basic OT formulation
- **Difficulty**: Intro
- **Why it's good**: Fun, accessible, with code. Good for someone who wants to see Sinkhorn in action quickly.

### 6.4 "What is Optimal Transport?" -- The Kantorovich Initiative
- **URL**: https://kantorovich.org/post/ot_intro/
- **Covers**: General problem statement, dirt-pile metaphor, motivation
- **Difficulty**: Intro
- **Why it's good**: Clean, authoritative introduction from a research initiative dedicated to OT.

### 6.5 "Introduction to Optimal Transport" -- Liuba (Analytics Vidhya / Medium)
- **URL**: https://medium.com/analytics-vidhya/introduction-to-optimal-transport-fd1816d51086
- **Covers**: Monge problem, Kantorovich relaxation, Wasserstein distance, connections to neural networks
- **Difficulty**: Intro
- **Why it's good**: Quick and accessible. Good for ML practitioners encountering OT for the first time.

### 6.6 Broad Institute Primer on Optimal Transport
- **URL**: https://www.broadinstitute.org/talks/primer-tutorial-optimal-transport
- **Covers**: OT as comparing/interpolating distributions of mass, probability measures, histograms
- **Difficulty**: Intro to intermediate
- **Why it's good**: Biology-oriented perspective. Shows OT applications outside traditional math/CS.

### 6.7 Optimal Transport for Unsupervised Learning Tutorial
- **URL**: https://optimaltransporttutorial.github.io/
- **Covers**: Deep generative models, clustering, topic modelling via OT
- **Difficulty**: Intermediate
- **Why it's good**: Directly ML-focused. Covers computer vision, NLP, and data mining applications.

### 6.8 "Optimal Transport and Wasserstein Distance" -- Larry Wasserman (CMU)
- **URL**: https://www.stat.cmu.edu/~larry/=sml/Opt.pdf
- **Covers**: Statistical perspective on OT and Wasserstein distance
- **Difficulty**: Intermediate
- **Why it's good**: From a leading statistician. Clean, rigorous, statistics-oriented.

### 6.9 Matthew Thorpe -- "Introduction to Optimal Transport" (Cambridge)
- **URL**: https://www.damtp.cam.ac.uk/research/cia/files/teaching/Optimal_Transport_Notes.pdf
- **Covers**: Complete lecture notes covering OT foundations
- **Difficulty**: Intermediate to advanced
- **Why it's good**: Well-structured lecture notes from Cambridge. Good balance of rigor and readability.

### 6.10 "Optimal Transport Theory: The New Math for Deep Learning" -- Carlos Perez (Medium)
- **URL**: https://medium.com/intuitionmachine/optimal-transport-theory-the-new-math-for-deep-learning-2520395fc183
- **Covers**: High-level connections between OT and deep learning
- **Difficulty**: Intro
- **Why it's good**: Accessible overview for deep learning practitioners.

### 6.11 Awesome Optimal Transport in Deep Learning (GitHub)
- **URL**: https://github.com/changwxx/Awesome-Optimal-Transport-in-Deep-Learning
- **Covers**: Curated collection of papers on OT in deep learning, organized by topic
- **Difficulty**: All levels
- **Why it's good**: Comprehensive paper list. Good for systematic literature review.

---

## 7. Applications in ML

### 7.1 Generative Modeling

**Wasserstein GANs (WGAN / WGAN-GP)**
- Use W1 distance instead of JS divergence as the GAN training objective
- Benefits: more stable training, meaningful loss curves, reduced mode collapse
- Key papers: Arjovsky et al. 2017 (https://arxiv.org/abs/1701.07875), Gulrajani et al. 2017 (https://arxiv.org/abs/1704.00028)
- Sinkhorn-based: Genevay, Peyre & Cuturi 2018 (https://arxiv.org/abs/1706.00292)

**Flow Matching & Diffusion Models**
- OT-Conditional Flow Matching (OT-CFM): uses OT couplings to train straighter, more efficient flows
- Rectified Flows: OT principles for learning straight transport paths
- Connection: diffusion models can be viewed through the lens of dynamic OT
- Key papers: Lipman et al. ICLR 2023, Tong et al. TMLR 2024 (https://arxiv.org/abs/2302.00482)

**Neural Optimal Transport**
- Learn OT maps directly with neural networks (ICNNs)
- Applications: image generation, unpaired domain translation
- Key papers: Makkuva et al. ICML 2020, Korotin et al. ICLR 2023

### 7.2 Domain Adaptation & Transfer Learning

- OT provides a natural framework: transport source distribution to match target
- Preserves geometric structure of data
- Key methods: OT-DA (Courty et al.), DeepJDOT, WDGRL
- Key papers: Courty et al. TPAMI 2017 (https://arxiv.org/abs/1507.00504)

### 7.3 Natural Language Processing

**Word Mover's Distance (WMD)**
- Document similarity as Earth mover's distance between word embedding distributions
- Key paper: Kusner et al. ICML 2015 (https://proceedings.mlr.press/v37/kusnerb15.html)
- Scalability: tree-Wasserstein distance (TWD) for linear-time approximation

**Cross-lingual Alignment**
- Gromov-Wasserstein for aligning word embedding spaces across languages
- Exploits geometric similarity of embedding spaces

**Context Mover's Distance**
- Wasserstein distances and barycenters for building entity representations from context distributions

### 7.4 Fairness in ML

- Post-processing via Wasserstein barycenters: match output distributions across sensitive groups to a barycenter
- Wasserstein distance as fairness metric
- Key frameworks: EquiPy, WassFFed (federated learning fairness)

### 7.5 Computer Vision

- Image interpolation and morphing via displacement interpolation
- Color transfer and texture mixing via Wasserstein barycenters
- Histogram equalization
- Shape matching and registration

### 7.6 Biology & Single-Cell Genomics

- Trajectory inference for cell differentiation using OT
- Waddington-OT: reconstructing developmental trajectories
- OT-CFM applied to single-cell dynamics
- Applications at Broad Institute

### 7.7 Reinforcement Learning

- Wasserstein distance for distributional RL
- OT for reward shaping and curriculum learning

### 7.8 Key Survey Papers

- "Recent Advances in Optimal Transport for Machine Learning" (2023): https://arxiv.org/abs/2306.16156 -- Covers supervised, unsupervised, transfer, and reinforcement learning applications over 2012-2023.
- "A Survey on Optimal Transport for Machine Learning: Theory and Applications": https://ar5iv.labs.arxiv.org/html/2106.01963
- "Generative Adversarial Networks based on Optimal Transport: A Survey" (Springer 2022): https://link.springer.com/article/10.1007/s10462-022-10342-x

---

## 8. Suggested Lesson Sequencing (25-30 Lessons)

### Prerequisites
- Real analysis (measure theory basics: sigma-algebras, measurable functions, convergence theorems)
- Linear algebra (eigenvalues, positive definite matrices)
- Probability (distributions, expectations, convergence of random variables)
- Basic optimization (convex functions, duality in LP)
- Python programming (NumPy, basic PyTorch/JAX)

### Concept Dependency Graph

```
Linear Programming
    |
    v
Monge Problem --> Kantorovich Relaxation --> Kantorovich Duality
    |                    |                        |
    v                    v                        v
1-D OT (closed-form) --> Wasserstein Distances --> c-transforms
    |                         |                       |
    v                         v                       v
Brenier's Theorem      Wasserstein Space        Entropic Regularization
    |                    (metric structure)           |
    v                         |                       v
Monge-Ampere Equation         v                  Sinkhorn Algorithm
    |                  Displacement Interpolation      |
    v                         |                       v
Regularity Theory             v              Computational OT
    |                  Displacement Convexity   (barycenters, sliced W)
    v                         |                       |
Otto Calculus                 v                       v
    |                  Gradient Flows (JKO)    ML Applications
    v                         |              (WGANs, domain adaptation,
Functional Inequalities       v               flow matching, NLP)
                       PDE Connections
                    (Fokker-Planck, heat eq)
```

### Lesson Plan

**Module 1: Foundations (Lessons 1-5)**

| # | Title | Key concepts | Primary reading |
|---|-------|-------------|-----------------|
| 1 | The Transportation Problem | Monge's original problem, physical intuition (dirt piles), examples | Williams blog post; Peyre & Cuturi Ch 1 |
| 2 | Kantorovich Relaxation | Transport plans (couplings), linear programming formulation, existence of optimal plans | Peyre & Cuturi Ch 2; Figalli & Glaudo Ch 1 |
| 3 | Kantorovich Duality | Dual problem, c-transforms, strong duality | Villani (2003) Ch 2; Santambrogio Ch 1 |
| 4 | One-Dimensional OT | Closed-form solution via quantile functions, monotone rearrangement | Santambrogio Ch 2; POT 1-D examples |
| 5 | Wasserstein Distances | W_p metrics, properties (triangle inequality, completeness), comparison with KL/TV/MMD | Peyre & Cuturi Ch 5; Figalli & Glaudo |

**Module 2: Structural Theory (Lessons 6-10)**

| # | Title | Key concepts | Primary reading |
|---|-------|-------------|-----------------|
| 6 | Brenier's Theorem | Optimal maps as gradients of convex functions (quadratic cost), existence and uniqueness, cyclical monotonicity | Villani (2003) Ch 4; Brenier 1991 |
| 7 | The Monge-Ampere Equation | PDE characterization of optimal maps, regularity questions | Villani (2003) Ch 5; Ambrosio et al. Lecture 7 |
| 8 | Displacement Interpolation | McCann interpolation, geodesics in Wasserstein space | Villani (2003) Ch 6 |
| 9 | Displacement Convexity | Convexity along geodesics, functionals on probability measures | Villani (2009) Ch 16-17 |
| 10 | Wasserstein Space as a Metric Space | Completeness, geodesics, curvature, topology of W_p | Ambrosio et al. Lecture 8-10 |

**Module 3: Computational Methods (Lessons 11-16)**

| # | Title | Key concepts | Primary reading |
|---|-------|-------------|-----------------|
| 11 | Exact OT Algorithms | Network simplex, Hungarian algorithm, auction algorithm, complexity | Peyre & Cuturi (numerical methods section); POT library |
| 12 | Entropic Regularization & Sinkhorn | Entropy-regularized OT, Sinkhorn-Knopp algorithm, convergence, complexity O(n^2/epsilon^2) | Cuturi NeurIPS 2013; Peyre & Cuturi Ch 3 |
| 13 | Sinkhorn Divergences & Debiasing | Bias of entropic OT, Sinkhorn divergence, interpolation between Wasserstein and MMD | Genevay, Peyre & Cuturi 2018 |
| 14 | Semidiscrete and Continuous OT | Power diagrams, Laguerre tessellation, semidiscrete algorithms | Peyre & Cuturi Ch 4 |
| 15 | Sliced Wasserstein Distance | Radon transform, 1-D projections, generalized sliced Wasserstein | Kolouri et al. NeurIPS 2019 |
| 16 | Hands-on: POT & OTT-JAX Workshop | Implementing OT in code: exact, Sinkhorn, sliced, barycenters | POT quickstart; OTT-JAX docs |

**Module 4: Dynamic OT & Gradient Flows (Lessons 17-20)**

| # | Title | Key concepts | Primary reading |
|---|-------|-------------|-----------------|
| 17 | Benamou-Brenier Formula | Dynamic formulation, continuity equation, fluid mechanics interpretation | Ambrosio et al. Lecture 17 |
| 18 | Otto Calculus | Riemannian structure of Wasserstein space, tangent space, Riemannian gradient | Villani (2009) Ch 15; Ambrosio et al. Lecture 18 |
| 19 | Gradient Flows in Wasserstein Space | JKO scheme, minimizing movements, heat equation as gradient flow of entropy | AGS book Part II; Figalli & Glaudo |
| 20 | PDEs as Gradient Flows | Fokker-Planck, porous medium equation, aggregation equations | Ambrosio et al. Lectures 13-14 |

**Module 5: Extensions (Lessons 21-23)**

| # | Title | Key concepts | Primary reading |
|---|-------|-------------|-----------------|
| 21 | Unbalanced & Partial OT | Relaxed marginal constraints, KL penalty, handling outliers, robust OT | Peyre & Cuturi (extensions section) |
| 22 | Gromov-Wasserstein Distance | Comparing metric spaces, relational OT, shape matching | Peyre & Cuturi; OTT-JAX docs |
| 23 | Statistical OT | Sample complexity, curse of dimensionality, minimax rates, regularization as statistical smoothing | Peyre & Cuturi Ch 6 |

**Module 6: ML Applications (Lessons 24-28)**

| # | Title | Key concepts | Primary reading |
|---|-------|-------------|-----------------|
| 24 | Wasserstein GANs | WGAN objective, weight clipping, gradient penalty (WGAN-GP), training stability | Arjovsky et al. 2017; Gulrajani et al. 2017 |
| 25 | OT for Domain Adaptation | Distribution matching, OT-DA, DeepJDOT, robust OT for adaptation | Courty et al. 2017 |
| 26 | Flow Matching & Neural OT | OT-CFM, flow matching, neural OT maps via ICNNs, diffusion model connections | Tong et al. 2024; Makkuva et al. 2020 |
| 27 | OT in NLP & Computer Vision | Word Mover's Distance, cross-lingual alignment, color transfer, barycenters for imaging | Kusner et al. 2015 |
| 28 | OT for Fairness & Biology | Wasserstein barycenters for fair ML, single-cell trajectory inference, Waddington-OT | Survey papers |

**Module 7: Frontiers (Lessons 29-30)**

| # | Title | Key concepts | Primary reading |
|---|-------|-------------|-----------------|
| 29 | OT and Geometry | Ricci curvature bounds via OT, Lott-Sturm-Villani theory, synthetic curvature | Villani (2009) Part III |
| 30 | Open Problems & Current Research | Scalability, neural OT benchmarks, OT for RL, OT in transformers, inverse OT | Peyre 2025 course notes; Korotin et al. survey |

---

## 9. Recommended Reading Order for Self-Study

For a researcher with applied math background who wants the full picture:

### Phase 1: Orientation (1 week)
1. Read Alex Williams' blog post for intuition
2. Read Mufan Li's "Everyone Should Learn OT" for motivation
3. Skim Peyre & Cuturi introduction and Ch 1-2

### Phase 2: Core Theory (3-4 weeks)
1. Work through Figalli & Glaudo cover-to-cover (short, self-contained, exercises)
2. Supplement with Peyre & Cuturi for computational perspective
3. For deeper theory: Villani (2003) chapters 2-6

### Phase 3: Computation (2 weeks)
1. Peyre & Cuturi chapters on entropic regularization, Sinkhorn, sliced Wasserstein
2. POT library tutorials (hands-on)
3. Cuturi NeurIPS 2013 paper

### Phase 4: Dynamics & Gradient Flows (2-3 weeks)
1. Ambrosio, Brue & Semola Lectures 11-19
2. Or: AGS book Part II
3. Supplement with Villani (2009) chapters 14-15, 23-25

### Phase 5: ML Applications (2 weeks)
1. Survey: "Recent Advances in OT for ML" (2023)
2. Read the key application papers (WGAN, WMD, OT-DA, Flow Matching)
3. Implement examples with POT / TorchCFM

### Phase 6: Depth (ongoing)
- Villani (2009) for specific topics as needed
- Santambrogio for PDE/variational connections
- Current research papers
