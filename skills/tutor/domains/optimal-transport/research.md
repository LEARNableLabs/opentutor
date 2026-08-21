# Optimal Transport — Research Summary

## Major Subtopics

### 1. Classical Optimal Transport
- **Monge Problem (1781)** — the original mass transportation problem
- **Kantorovich Relaxation (1940s)** — convex relaxation using couplings
- **Kantorovich Duality** — dual formulation and existence theorems
- **Brenier's Theorem** — characterization of optimal maps for quadratic cost

### 2. Wasserstein Distances
- **Metric properties** — W_p distances as metrics on probability spaces
- **Earth Mover's Distance** — computational interpretation
- **Geodesics in Wasserstein space** — displacement interpolation
- **Otto calculus** — Riemannian geometry of probability distributions

### 3. Computational Methods
- **Sinkhorn Algorithm** — entropic regularization for fast computation
- **Linear programming approaches** — discrete optimal transport
- **Semi-discrete transport** — continuous to discrete
- **Neural optimal transport** — using deep learning

### 4. Applications
- **Image processing** — color transfer, texture synthesis
- **Machine learning** — domain adaptation, generative models
- **PDEs** — gradient flows, Fokker-Planck equations
- **Economics** — matching markets, urban planning
- **Data science** — distribution comparison, barycenter computation

## Key Sources

### Foundational Textbooks
- **Villani, "Optimal Transport: Old and New"** (2009) — comprehensive 1000+ page treatise, freely available online
- **Villani, "Topics in Optimal Transportation"** (2003) — more accessible introduction
- **Santambrogio, "Optimal Transport for Applied Mathematicians"** (2015) — free online, application-focused
- **Ambrosio, Brué, Semola, "Lectures on Optimal Transport"** (2021) — modern graduate text

### Lecture Notes
- **Matthew Thorpe (Cambridge)** — clear introduction with exercises
- **Riccardo Cristoferi (Radboud)** — self-contained course notes
- **Gabriel Peyré (CNRS)** — computational optimal transport focus
- **Larry Wasserman (CMU)** — statistical perspective
- **Stony Brook OMT Lectures** — applications to deep learning and geometry

### Course Syllabi
- **UCSB Math 260J** (Katy Craig) — graduate course with modern applications
- **Georgia Tech AE 8803** — applications in aerospace engineering
- **Oxford C4.9** — connection to PDEs
- **PKU/BICMR** — computational and big data focus

### Interactive & Visual Resources
- **mf02511.github.io/Optimal-Transport-Visualization** — interactive simulations from basic to complex cases
- **dataknobs.com interactive guide** — animations of OT distance minimization
- **Alex Williams blog tutorial** — intuitive introduction with visualizations
- **R transport package** — computation and visualization tools

### Video Lectures
- Most universities maintain video archives for their OT courses
- Oxford, Cambridge, and French universities have strong OT video content

## Available Tools & Code
- **Python OT library** — comprehensive implementation of OT algorithms
- **R transport package** — discrete OT with visualization
- **POT (Python Optimal Transport)** — modern library with GPU support
- **Jupyter notebooks** — many tutorials available on GitHub

## Learning Path Notes

**For intermediate students**, the ideal sequence:
1. Start with discrete optimal transport (finite measures, linear programming)
2. Build intuition through Wasserstein distance examples
3. Introduce continuous formulation (Monge, Kantorovich)
4. Develop duality theory
5. Cover computational methods (especially Sinkhorn)
6. Explore applications in data science and machine learning
7. (Optional) Advanced topics: gradient flows, geometry

**Prerequisites**: multivariable calculus, linear algebra, measure theory basics (σ-algebras, Radon-Nikodym), probability theory, functional analysis basics

**Common student backgrounds**: mathematics grad students, machine learning researchers, computational scientists
