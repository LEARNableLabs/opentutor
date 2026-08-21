# Operations Research — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Introduction to Operations Research** (Hillier & Lieberman)
  - Comprehensive, applications-focused, excellent for intermediate students
  - Covers LP, IP, network flows, nonlinear programming, simulation
  - https://www.mheducation.com/highered/product/introduction-operations-research-hillier-lieberman/M9781259872990.html

- **Operations Research: Applications and Algorithms** (Wayne Winston)
  - Practical, code-oriented, many real-world examples
  - Strong on formulation patterns and Excel solver examples (can translate to Python/Julia)
  - https://www.cengage.com/c/operations-research-applications-and-algorithms-4e-winston/

- **Introduction to Linear Optimization** (Bertsimas & Tsitsiklis)
  - Rigorous but accessible, excellent on duality and geometry
  - MIT standard text, balances theory and practice
  - https://www.athenasc.com/linoptbook.html

- **Convex Optimization** (Boyd & Vandenberghe)
  - Gold standard for convex optimization, free PDF available
  - Required for lessons 21-23, excellent exercises
  - https://web.stanford.edu/~boyd/cvxbook/

### Online Courses & Video Lectures

- **MIT OCW 15.053: Optimization Methods in Management Science**
  - Full lecture videos, notes, and assignments
  - LP, IP, network flows, applications
  - https://ocw.mit.edu/courses/15-053-optimization-methods-in-management-science-spring-2013/

- **MIT OCW 15.093: Optimization Methods**
  - More advanced than 15.053, stronger on algorithms
  - https://ocw.mit.edu/courses/15-093-optimization-methods-fall-2009/

- **Stanford EE364A: Convex Optimization**
  - Video lectures by Stephen Boyd himself
  - Essential for nonlinear optimization (lessons 21-23)
  - https://web.stanford.edu/class/ee364a/

- **Coursera: Discrete Optimization** (University of Melbourne)
  - Excellent on IP, constraint programming, local search
  - Programming assignments in Python/Java
  - https://www.coursera.org/learn/discrete-optimization

- **Coursera: Linear and Integer Programming** (University of Colorado Boulder)
  - Practical focus, uses Excel and Python
  - https://www.coursera.org/specializations/optimization-methods-business-analytics

## Supplementary (for engagement)

### Videos & Channels

- **INFORMS Video Library**
  - OR in practice: case studies, industry applications, interviews
  - https://www.informs.org/Resource-Center/Video-Library

- **3Blue1Brown: Essence of Linear Algebra**
  - Beautiful visualizations of vector spaces, transformations, eigenvalues
  - Essential background for understanding LP geometry
  - https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab

- **MIT OpenCourseWare YouTube**
  - Search for "optimization" — multiple courses available
  - https://www.youtube.com/@mitocw

### Interactive Tools & Software

- **Google OR-Tools**
  - Production-grade, open-source optimization toolkit
  - LP, IP, CP, routing, scheduling — all in one library
  - Python/C++/Java/C# APIs
  - https://developers.google.com/optimization

- **JuMP (Julia for Mathematical Programming)**
  - Fast, expressive modeling language for Julia
  - Supports dozens of solvers, excellent documentation
  - https://jump.dev/JuMP.jl/stable/

- **CVXPY (Python convex optimization)**
  - Domain-specific language for convex optimization
  - Clean syntax, automatic DCP verification, many backends
  - https://www.cvxpy.org/

- **PuLP (Python linear programming)**
  - Simple, beginner-friendly LP/IP modeling in Python
  - Free solvers included (CBC, GLPK)
  - https://coin-or.github.io/pulp/

- **Pyomo (Python Optimization Modeling Objects)**
  - More advanced than PuLP, supports nonlinear and stochastic optimization
  - https://www.pyomo.org/

- **NEOS Server**
  - Free online optimization solver
  - Upload models in AMPL/GAMS/etc., get solutions via web interface
  - Great for trying commercial solvers (CPLEX, Gurobi) without licenses
  - https://neos-server.org/neos/

- **GeoGebra**
  - Interactive geometry for visualizing 2D/3D feasible regions
  - https://www.geogebra.org/

- **Desmos**
  - Graph linear inequalities, visualize constraints
  - https://www.desmos.com/calculator

### Solver Documentation

- **Gurobi Optimizer**
  - Commercial solver (free academic license)
  - Industry-leading LP/IP/QP solver, excellent docs and examples
  - https://www.gurobi.com/documentation/

- **CPLEX**
  - IBM's commercial solver (free academic license)
  - https://www.ibm.com/products/ilog-cplex-optimization-studio

- **HiGHS**
  - Open-source LP/IP solver, competitive with commercial solvers
  - https://highs.dev/

- **SCIP**
  - Open-source framework for constraint integer programming
  - https://www.scipopt.org/

- **GLPK (GNU Linear Programming Kit)**
  - Classic open-source LP/IP solver
  - https://www.gnu.org/software/glpk/

### Code Repositories & Examples

- **OR-Tools Examples (GitHub)**
  - Hundreds of examples: routing, scheduling, assignment, packing
  - https://github.com/google/or-tools/tree/stable/examples

- **JuMP Tutorials**
  - Interactive notebooks for LP, IP, NLP, SDP
  - https://jump.dev/JuMP.jl/stable/tutorials/

- **CVXPY Examples**
  - Finance, ML, signal processing, control
  - https://www.cvxpy.org/examples/index.html

- **PuLP Case Studies**
  - Blending, scheduling, transportation problems
  - https://coin-or.github.io/pulp/CaseStudies/index.html

### Test Problem Libraries

- **MIPLIB (Mixed-Integer Programming Library)**
  - Standard benchmark instances for IP
  - https://miplib.zib.de/

- **Netlib LP**
  - Classic LP test problems
  - https://www.netlib.org/lp/

- **OR-Library**
  - Test problems for all OR problem types
  - http://people.brunel.ac.uk/~mastjjb/jeb/info.html

- **CUTEst (Constrained and Unconstrained Testing Environment)**
  - Nonlinear optimization test problems
  - https://www.cuter.rl.ac.uk/Problems/mastsif.shtml

## Organizations & Communities

- **INFORMS (Institute for Operations Research and the Management Sciences)**
  - Professional society, conferences, journals, career resources
  - https://www.informs.org/

- **Mathematical Optimization Society (MOS)**
  - Research-focused, sponsors major conferences (ISMP, ICCOPT)
  - https://www.mathopt.org/

- **COIN-OR (Computational Infrastructure for Operations Research)**
  - Open-source OR software foundation
  - https://www.coin-or.org/

### People to Follow

- **Stephen Boyd** (Stanford) — Convex optimization, control theory
  - https://web.stanford.edu/~boyd/

- **Dimitris Bertsimas** (MIT) — Robust optimization, analytics
  - https://www.mit.edu/~dbertsim/

- **Laurence Wolsey** (UC Louvain) — Integer programming, polyhedral theory
  - https://uclouvain.be/en/directories/laurence.wolsey

- **Michel Goemans** (MIT) — Combinatorial optimization, approximation algorithms
  - https://math.mit.edu/~goemans/

- **Jon Lee** (University of Michigan) — Integer programming, polyhedral combinatorics
  - https://lsa.umich.edu/math/people/faculty/jonxlee.html

## Cross-Disciplinary Connections

### Machine Learning
- Optimization is the engine of ML: gradient descent, stochastic optimization, convex relaxations
- **Resources**: Boyd's CVX book, CVXPY ML examples, "Optimization for Machine Learning" (Sra et al.)
- https://www.cvxpy.org/examples/machine_learning/index.html

### Economics & Game Theory
- OR and economics are deeply intertwined: equilibrium as optimization, mechanism design, auction theory
- **Resources**: "Convex Optimization & Economic Theory" (Borwein & Lewis)
- Duality theory connects LP to economic interpretation (shadow prices = marginal value)

### Computer Science
- Algorithms course overlap: greedy algorithms, dynamic programming, graph algorithms
- Complexity theory: NP-hardness, approximation algorithms, online algorithms
- **Resources**: "Approximation Algorithms" (Vazirani), "The Design of Approximation Algorithms" (Williamson & Shmoys)

### Engineering (Control, Signals, Circuits)
- Model predictive control (MPC) is real-time optimization
- Signal processing: sparse recovery as convex optimization (compressed sensing)
- Circuit design: optimal sizing, power minimization
- **Resources**: Boyd's CVX book, "Model Predictive Control" (Camacho & Bordons)

### Finance
- Portfolio optimization (Markowitz), risk management, derivative pricing
- **Resources**: "Optimization Methods in Finance" (Cornuejols & Tütüncü)
- https://web.stanford.edu/~boyd/papers/pdf/cvx_portfolio.pdf

### Logistics & Supply Chain
- Vehicle routing, warehouse location, inventory management, production planning
- **Resources**: OR-Tools routing examples, "Supply Chain Management" (Chopra & Meindl)
- https://developers.google.com/optimization/routing

## Tools Quick Reference

| Tool | Best For | Language | License | Solver Support |
|------|----------|----------|---------|----------------|
| **OR-Tools** | Routing, scheduling, CP | Python/C++/Java/C# | Apache 2.0 | Built-in (CP-SAT, Glop) + external |
| **JuMP** | General modeling, fast | Julia | MPL 2.0 | Dozens (Gurobi, CPLEX, HiGHS, Ipopt, ...) |
| **CVXPY** | Convex optimization | Python | Apache 2.0 | Many (Gurobi, MOSEK, SCS, ECOS, ...) |
| **PuLP** | Simple LP/IP | Python | BSD | CBC, GLPK, Gurobi, CPLEX |
| **Pyomo** | Advanced modeling, NLP | Python | BSD | Many (IPOPT, BARON, Gurobi, ...) |
| **Gurobi** | Commercial, fast LP/IP/QP | Python/C++/Java/R | Commercial (free academic) | Self |
| **CPLEX** | Commercial, IBM ecosystem | Python/C++/Java | Commercial (free academic) | Self |
| **HiGHS** | Open-source, fast | C++/Python | MIT | Self (LP/IP) |

## Getting Started Checklist

For a student beginning this curriculum:

1. **Install Python** (3.8+) or **Julia** (1.6+)
2. **Install one modeling tool**:
   - Beginner: `pip install pulp` (Python, easiest)
   - Intermediate: `pip install ortools` (Python, powerful)
   - Advanced: Install Julia + JuMP (fastest, most flexible)
3. **Install a free solver**:
   - PuLP includes CBC and GLPK automatically
   - OR-Tools includes Glop (LP), CP-SAT (CP/IP)
   - For Gurobi/CPLEX: get academic license (requires .edu email)
4. **Bookmark these docs**:
   - OR-Tools: https://developers.google.com/optimization
   - JuMP: https://jump.dev/JuMP.jl/stable/
   - CVXPY: https://www.cvxpy.org/
5. **Clone example repos** (optional but helpful):
   - `git clone https://github.com/google/or-tools.git`
   - Explore `or-tools/examples/python/` or `/julia/`

## Unexpected Connections (for wild cards)

- **Origami mathematics and LP**: Flat-foldability as a feasibility problem
- **Quantum computing and SDP**: Quantum state tomography, entanglement witnesses
- **Music and optimization**: Rhythmic pattern generation, automatic composition as constraint programming
- **Sports analytics**: Lineup optimization, draft strategy, playoff bracket predictions
- **Humanitarian logistics**: Disaster relief routing, refugee resettlement optimization
- **Climate policy**: Optimal carbon tax design, renewable energy capacity planning
- **Computational biology**: Protein folding, gene regulatory network inference
- **Urban planning**: Traffic light timing, public transit scheduling, facility location
