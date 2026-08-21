# Probability Theory and Stochastic Processes — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Brémaud, "Probability Theory and Stochastic Processes" (Springer, 2020)** — Comprehensive intermediate-level text with complete proofs and exercises. Organized in three parts: probability theory (Chapters 1-4), discrete-time stochastic processes (Chapters 5-8), and continuous-time stochastic processes and point processes. Suitable for students comfortable with real analysis. [Springer Link](https://link.springer.com/book/10.1007/978-3-030-40183-2)

- **Oliver Knill, "Probability Theory and Stochastic Processes with Applications"** — Harvard course text, available as a free PDF. Covers probability foundations through stochastic calculus. Accessible and well-organized. [Harvard PDF](https://people.math.harvard.edu/~knill/books/KnillProbability.pdf)

- **Olofsson, "Probability, Statistics, and Stochastic Processes"** — Free textbook from Trinity University. Clear exposition with computational emphasis. [Trinity PDF](http://ramanujan.math.trinity.edu/polofsson/teach/Book.pdf)

- **Papoulis & Pillai, "Probability, Random Variables and Stochastic Processes" (4th ed., 2002)** — Classic reference, widely used in engineering programs. Strong on applications and computations.

- **Miller & Childers, "Probability and Random Processes" (2nd ed., 2012)** — Accessible intermediate treatment with MATLAB examples.

- **Yates & Goodman, "Probability and Stochastic Processes"** — Upper-undergraduate/graduate level. Covers Poisson process, renewal processes, Markov chains, semi-Markov processes, martingales, and Brownian motion. [O'Reilly](https://www.oreilly.com/library/view/probability-and-stochastic/9781118593134/)

### Course Notes

- **MIT SC505 Stochastic Processes Class Notes** — Graduate-level notes covering measure-theoretic probability, martingales, Brownian motion, stochastic calculus. [MIT PDF](https://web.mit.edu/people/hmsallum/GradSchool/sc505notes.pdf)

- **Stanford 18.676 Stochastic Calculus Notes** (by Andrew Lin) — Excellent notes on Itô calculus, SDEs, and applications. [Stanford PDF](https://web.stanford.edu/~lindrew/18.676.pdf)

- **Stanford 18.677 Topics in Stochastic Processes Notes** (by Andrew Lin) — Advanced topics including Markov processes, coupling, mixing times. [Stanford PDF](https://web.stanford.edu/~lindrew/18.677.pdf)

## Video Lectures

### MIT OpenCourseWare

- **MIT 6.262 Discrete Stochastic Processes (Spring 2011)** — Professor Robert Gallager. Complete video lecture series on Markov chains, random walks, renewal processes, queueing. [OCW](https://ocw.mit.edu/courses/6-262-discrete-stochastic-processes-spring-2011/video_galleries/video-lectures/) | [YouTube Playlist](https://www.youtube.com/playlist?list=PLEEF5322B331C1B98)

- **MIT 18.445 Introduction to Stochastic Processes (Spring 2015)** — Markov chains, random walks, martingales, Galton-Watson trees. Includes lecture notes and problem sets. [OCW](https://ocw.mit.edu/courses/18-445-introduction-to-stochastic-processes-spring-2015/pages/lecture-notes/)

- **MIT 18.S096 Topics in Mathematics with Applications in Finance (Fall 2013)** — Lectures 5 and 17 cover stochastic processes, random walks, Markov chains, and Brownian motion. [Lecture 5](https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/resources/lecture-5-stochastic-processes-i/) | [Lecture 17](https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/resources/lecture-17-stochastic-processes-ii/)

- **MIT RES.6-012 Introduction to Probability (Spring 2018)** — Professors John Tsitsiklis and Patrick Jaillet. Includes a section on stochastic processes. [OCW](https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/resources/stochastic-processes/)

### Stanford Online

- **Stanford STATS217 Introduction to Stochastic Processes I** — Covers Markov chains, Poisson processes, birth-and-death processes. [Stanford Online](https://online.stanford.edu/courses/stats217-introduction-stochastic-processes-i) (Note: not always open for enrollment; check availability)

## Interactive Tools

- **Seeing Theory (Brown University)** — Award-winning interactive visualizations for probability and statistics (Webby Award 2018). Covers basic probability, compound probability, distributions, Bayesian inference, regression. Built with D3.js, fully interactive. **Highly recommended** for building intuition. [seeing-theory.brown.edu](https://seeing-theory.brown.edu/) | [GitHub](https://github.com/seeingtheory/Seeing-Theory)

- **Learn Math Class — Probability Tools** — Interactive probability function visualizers for 9 distributions, tree diagrams (law of total probability), Venn diagrams, variance calculators. Real-time parameter manipulation. [learnmathclass.com/probability](https://www.learnmathclass.com/probability)

- **Dependent Probability Visualization Tool (esheets.io)** — Interactive balls-in-box model for dependent/conditional probability. Excellent for teaching conditional probability before written calculations. [esheets.io/probability-visualisation-tool](https://www.esheets.io/probability-visualisation-tool/)

- **Interactive 2D/3D Probability Distributions** — Web calculator for bivariate and trivariate distributions. Useful for visualizing joint distributions and marginals. [PMC Article](https://pmc.ncbi.nlm.nih.gov/articles/PMC10361712/)

## Code and Simulations

- **Python libraries**: `numpy` (random number generation), `scipy.stats` (distributions), `matplotlib`/`seaborn` (plotting), `pandas` (data manipulation)

- **Stochastic process simulation**: `simpy` (discrete-event simulation, queueing), `pymc` (Bayesian inference and MCMC)

- **Markov chain tools**: `pykov` (discrete Markov chains), `networkx` (graph-based chain visualization)

- **Brownian motion / SDEs**: `sdeint` (SDE integration), `stochastic` (Brownian motion, Ornstein-Uhlenbeck), `quantlib` (finance applications)

- **Interactive notebooks**: Jupyter notebooks with `ipywidgets` for sliders/controls over parameters (arrival rates, drift/diffusion coefficients)

## People (researchers, educators, practitioners)

- **John Tsitsiklis** (MIT) — Probability, stochastic systems, optimization. Co-author of textbook "Introduction to Probability."

- **Robert Gallager** (MIT) — Information theory, stochastic processes, queueing. Known for clear teaching (6.262 lectures).

- **Rick Durrett** (Duke) — Probability theory, stochastic processes, applications to biology. Textbook "Probability: Theory and Examples."

- **Ioannis Karatzas & Steven Shreve** — Authors of "Brownian Motion and Stochastic Calculus," the standard reference for stochastic calculus in finance.

- **Pierre Brémaud** (EPFL/Inria) — Stochastic processes, point processes, information theory. Textbook author.

- **Sheldon Ross** — "Introduction to Probability Models" and "Stochastic Processes" — widely used undergraduate texts.

- **Daniel Kunin** (Stanford / Brown) — Creator of Seeing Theory; focuses on visual, interactive probability education.

## Applications by Field

### Finance
- Geometric Brownian motion for stock prices (Black-Scholes model)
- Interest rate models (Vasicek, Cox-Ingersoll-Ross)
- Credit risk (structural models with Brownian motion and jumps)
- Portfolio optimization under uncertainty

### Queueing Theory / Operations Research
- M/M/1, M/M/c queues (Poisson arrivals, exponential service)
- Birth-death processes for system load
- Renewal processes for maintenance scheduling
- Little's Law and steady-state analysis

### Biology / Ecology
- Population dynamics (Galton-Watson branching processes)
- Epidemics (SIS/SIR models with stochastic transitions)
- Gene frequency changes (Wright-Fisher diffusion)
- Neuron firing (Poisson point processes)

### Physics
- Diffusion (Brownian motion as physical process)
- Statistical mechanics (Markov chain Monte Carlo, Gibbs measures)
- Random walks in random media
- Percolation and phase transitions

### Computer Science / Networks
- PageRank (stationary distribution of web graph random walk)
- Randomized algorithms (Markov chain mixing times)
- Network traffic modeling (Poisson arrivals, self-similar processes)
- Reinforcement learning (Markov decision processes)

### Engineering
- Signal processing (Kalman filtering, hidden Markov models)
- Control theory (stochastic optimal control)
- Reliability engineering (renewal processes for failures)
- Communications (queues, arrivals, channel noise)

## Unexpected Connections (wild cards)

- **Music and randomness** — Algorithmic composition using Markov chains to model note transitions (e.g., analyzing Bach chorales, generating new music). [Example: Music21 Python library]

- **Sports analytics** — Modeling game outcomes, player performance variability, win probabilities with Markov chains and Bayesian updates.

- **Art and generative design** — Brownian motion for random walk art, Poisson processes for spatial point patterns in design.

- **Cryptography** — Randomness testing, pseudorandom number generators, random walks on graphs for cryptographic protocols.

- **Climate modeling** — Stochastic differential equations for temperature, precipitation; tipping points modeled as exit times from Brownian motion.

- **Game theory** — Repeated games with random matching, evolutionary game theory with stochastic dynamics.

- **Linguistics** — Language models as Markov chains (n-grams), hidden Markov models for part-of-speech tagging.

- **Search algorithms** — Simulated annealing (Markov chain with time-varying transition probabilities), Metropolis-Hastings (MCMC for sampling).

## Recommended Learning Sequence

1. **Start with interactive tools** — Use Seeing Theory to build intuition for distributions, conditional probability, limit theorems.
2. **Follow MIT 6.262 videos** — Watch alongside curriculum lessons on Markov chains and discrete-time processes.
3. **Read Knill's textbook** — Free, accessible, covers foundations through stochastic calculus.
4. **Simulate in Python** — Write code to simulate random walks, Poisson processes, Brownian motion. Visualization builds intuition.
5. **Deep dive into continuous-time** — Use Stanford stochastic calculus notes when reaching lessons 22-24.
6. **Apply to your field** — Choose one application area (finance, queueing, biology) and work through case studies.
