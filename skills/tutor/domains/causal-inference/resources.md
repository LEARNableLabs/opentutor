# Causal Inference in Machine Learning — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Brady Neal: "Introduction to Causal Inference from a Machine Learning Perspective"** (2020)
  - https://www.bradyneal.com/causal-inference-course
  - Free online, modern ML focus, excellent for intermediate students
  - Covers graphical models, identification, and estimation with code
  - Best overall resource for this curriculum

- **Pearl, Glymour, Jewell: "Causal Inference in Statistics: A Primer"** (MIT Press, 2016)
  - https://mitpress.mit.edu/9780262037310/causal-inference-in-statistics/
  - Foundational graphical models approach, accessible introduction to Pearl's framework
  - Great for lessons 5-14 (graphical models and identification)

- **Hernán & Robins: "Causal Inference: What If"** (2020)
  - https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/
  - Free online, potential outcomes framework, epidemiology perspective
  - Excellent for lessons 2-4 (potential outcomes) and 15-19 (estimation)

- **Imbens & Rubin: "Causal Inference for Statistics, Social, and Biomedical Sciences"** (Cambridge, 2015)
  - Rigorous potential outcomes treatment, more advanced
  - Good reference for instructors or advanced students

### Courses & Lectures

- **Brady Neal's Video Lecture Series**
  - https://www.youtube.com/playlist?list=PLoazKTcS0Rzb6bb9L508cyJ1z-U9iWkA0
  - Full course videos aligned with his textbook
  - ~20 hours of content, excellent production quality
  - Use for lessons 1-26 as supplementary video

- **KDD 2021 Tutorial on Causal Inference and Machine Learning**
  - https://causalinference.gitlab.io/kdd-tutorial/
  - Practical tutorial with code examples
  - Good for lessons 13-24 (estimation and heterogeneity)

- **MIT OpenCourseWare: Econometrics and Causal Inference**
  - Various courses available at https://ocw.mit.edu
  - More econometrics-focused but valuable for methods

### Survey Papers

- **"A Survey on Causal Inference" (Yao et al., 2020)**
  - https://arxiv.org/abs/2002.02770
  - Comprehensive overview, good reference for context
  - Use for lessons 3, 9, and as general reference

- **"Causal Inference for Recommender Systems" (Sharma et al., 2021)**
  - Connects causal inference to a domain ML students know
  - Good for lesson 25 (applications)

## Software & Tools

### Python Libraries

- **DoWhy** (Microsoft/PyWhy Foundation)
  - https://github.com/py-why/dowhy
  - Unified framework with 4-step workflow (model, identify, estimate, refute)
  - Best tool for learning — scaffolds the full causal reasoning process
  - Use in lessons 7, 10, 14, 18, 20, 26

- **EconML** (Microsoft/PyWhy Foundation)
  - https://github.com/py-why/econml
  - https://www.microsoft.com/en-us/research/project/econml/
  - Heterogeneous treatment effect estimation, meta-learners, causal forests
  - Use in lessons 17, 21-24

- **CausalML** (Uber)
  - https://github.com/uber/causalml
  - Uplift modeling and meta-learners
  - Alternative to EconML, good for lessons 22, 24

- **CausalNex** (QuantumBlack/McKinsey)
  - https://github.com/quantumblacklabs/causalnex
  - Bayesian networks and structure learning
  - More advanced, optional supplement

- **causal-learn** (Carnegie Mellon)
  - https://github.com/py-why/causal-learn
  - Causal discovery algorithms
  - Advanced topic, not core to this curriculum

### Interactive Tools

- **DAGitty**
  - http://www.dagitty.net/
  - Web-based tool for drawing and analyzing causal DAGs
  - Use in lessons 5-14 for interactive DAG exploration

- **DoWhy Example Notebooks**
  - https://github.com/py-why/dowhy/tree/main/docs/source/example_notebooks
  - Jupyter notebooks with working examples
  - Use throughout for hands-on practice

## Supplementary Resources

### Videos & Talks

- **PyData Talks on Causal Inference**
  - Search YouTube for "PyData causal inference"
  - Practical talks on applying causal methods in industry
  - Good for motivation and real-world examples

- **Microsoft Research Seminars**
  - Various talks on EconML and causal ML applications
  - Available on Microsoft Research YouTube channel

- **Judea Pearl's Talks**
  - "The New Science of Cause and Effect" (2018)
  - Available on YouTube, great for conceptual understanding

### Code Examples & Tutorials

- **DoWhy Documentation and Tutorials**
  - https://py-why.github.io/dowhy/
  - Comprehensive guides and API documentation

- **EconML User Guide**
  - https://econml.azurewebsites.net/
  - Detailed examples of CATE estimation methods

- **Causal Inference for The Brave and True**
  - https://matheusfacure.github.io/python-causality-handbook/
  - Free online book with Python examples
  - Good supplement for hands-on learners

### Datasets

- **LaLonde Job Training Data**
  - Classic causal inference dataset
  - Available in R and Python packages
  - Use for lessons 16, 18

- **Twins Dataset**
  - Twin births with known counterfactuals
  - Good for teaching potential outcomes
  - Available in various repositories

- **UCI Causal Inference Datasets**
  - Several datasets designed for causal inference benchmarks
  - Available at https://archive.ics.uci.edu/

## People to Follow

### Researchers & Practitioners

- **Judea Pearl** — UCLA, inventor of graphical causal models, Turing Award winner
- **Donald Rubin** — Harvard, potential outcomes framework
- **Miguel Hernán** — Harvard, epidemiological perspective
- **Susan Athey** — Stanford, causal ML and economics
- **Guido Imbens** — Stanford, Nobel laureate in econometrics
- **Stefan Wager** — Stanford, causal forests
- **Victor Chernozhukov** — MIT, double/debiased ML
- **Elias Bareinboim** — Columbia, causal discovery and transportability

### Industry Groups

- **PyWhy Foundation** — maintains DoWhy, EconML, causal-learn
- **Microsoft Research** — major contributor to causal ML tools and methods
- **Uber Engineering** — developed CausalML for uplift modeling

## Unexpected Connections

### Cross-Disciplinary Links

- **Causal inference and fairness in ML** — algorithmic fairness often requires causal reasoning
  - Papers: "Counterfactual Fairness" (Kusner et al., 2017)
  - "Fairness and Machine Learning" book (Barocas, Hardt, Narayanan)

- **Causal inference in reinforcement learning** — offline RL = causal inference with sequential treatments
  - Papers: "Counterfactual Data-Fusion" (Bareinboim et al.)

- **Causal inference for NLP and LLMs** — causal effects of prompts, interventions in language models
  - Emerging research area, very active as of 2026

- **Causal inference in climate science** — attribution of extreme weather to climate change
  - Shows causality in high-stakes policy contexts

- **Causal inference in genomics** — Mendelian randomization uses genes as instruments
  - Connects to biostatistics and precision medicine

### Historical Context

- **Fisher vs Neyman-Pearson** — foundations of experimental design and hypothesis testing
- **Rubin vs Pearl debate** — potential outcomes vs graphical models (still ongoing!)
- **Simpson's paradox through history** — discovered and rediscovered in multiple fields

## Tools for Different Learning Styles

- **Visual learners** — DAGitty, hand-drawn DAGs, visualization of treatment effects
- **Hands-on learners** — DoWhy notebooks, EconML examples, build your own estimators
- **Theory-first learners** — Pearl's textbook, proofs in Hernán & Robins
- **Application-driven learners** — Industry case studies, A/B testing examples, policy evaluation

## Staying Current

- **arXiv sections** — stat.ME (methodology), cs.LG (machine learning), econ.EM (econometrics)
- **Conferences** — NeurIPS, ICML, UAI (causality workshops), KDD, AAAI
- **Workshops** — "Why?" workshop series at major ML conferences
- **Reading groups** — Many universities and companies run causal inference reading groups
