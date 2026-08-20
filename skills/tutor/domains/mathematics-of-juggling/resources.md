# Mathematics of Juggling -- Comprehensive Resource Guide (Intermediate Level)

> Compiled for a mathematically fluent undergraduate or self-taught explorer with solid combinatorics and proof skills. The north star: finishing the course able to read Buhler et al. (1994) or Warrington (2003), and to look at any siteswap sequence and immediately see its combinatorial, algebraic, and probabilistic structure. Resources are tagged by curriculum module and marked free/paid.

---

## 1. Primary Sources

### Textbooks

**The Mathematics of Juggling** -- Burkard Polster (Springer, 2003)
- URL: https://link.springer.com/book/10.1007/b98883
- Free survey by the author: https://www.qedcat.com/articles/juggling_survey.pdf
- Availability: **Paid** (Springer, ~$55); free survey article covers core ideas
- Level: The only book-length treatment. Self-contained essays organized by topic: siteswap sequences, juggling matrices, Shannon's theorem, graph-theoretic state models, connections to knot theory, bell ringing, and robot juggling. Accessible at multiple mathematical levels
- Best for: All modules. The primary reference for the entire course. Polster covers every major branch of the field in a single volume. Start with the siteswap chapters (modules 1-2), use the graph theory and matrix chapters for module 3, the knot theory chapter for module 5, and the enumeration chapters for module 4
- Note: 44 citations. The definitive textbook in the field

**An Elementary Introduction to Juggling** -- John Eggers (UCSD)
- URL: https://mathweb.ucsd.edu/~jeggers/Resources/juggling.pdf
- Availability: **Free** PDF
- Level: Introductory to intermediate. Concise lecture notes with clear diagrams
- Best for: Module 1 (siteswap basics, average theorem, permutation test). Excellent for the first few days when building notation fluency. More visual and compact than Polster

**Juggling Mathematics and Magic** -- Ron Graham (UCSD)
- URL: https://mathweb.ucsd.edu/~ronspubs/13_05_juggling.pdf
- Availability: **Free** PDF
- Level: Intermediate survey by one of the field's founders
- Best for: Modules 1-3. Graham's survey connects siteswap enumeration, magic, and combinatorics in an accessible way. Good overview reading before diving into the primary papers. Covers primitive sequences, universal cycles, and connections to permutation theory

### Key Papers (ordered by curriculum relevance)

**Juggling Drops and Descents** -- Joe Buhler, David Eisenbud, Ron Graham, Colin Wright (1994)
- URL (Semantic Scholar): https://www.semanticscholar.org/paper/173f764ab3328fba3165e4e58ea967c5ea04f80d
- Availability: **Free** (various preprint sources)
- Level: Intermediate. The foundational combinatorial paper
- Best for: Modules 2-3. Proves the (b+1)^p counting theorem: the number of juggling sequences of period p with at most b balls is exactly (b+1)^p. Establishes the connection between siteswap sequences and descents in permutations. This paper is the culmination of module 3 and a key course milestone
- 79 citations. One of the two "north star" papers for the course

**Juggling Probabilities** -- Gregory S. Warrington (2003)
- URL: https://arxiv.org/abs/math/0302257
- Availability: **Free** on arXiv
- Level: Intermediate. Requires probability and Markov chain background
- Best for: Module 4 (probabilistic juggling). Models random juggling as a Markov process, computes steady-state probabilities in terms of Stirling numbers of the second kind. The second "north star" paper
- 18 citations

**Scientific Aspects of Juggling** -- Claude E. Shannon (1993)
- URL (Semantic Scholar): https://www.semanticscholar.org/paper/4129d6b4388a82f9b566fb4d1b00ca5aa58f1ca1
- Availability: Accessible through academic libraries
- Level: Introductory to intermediate
- Best for: Module 1 (Shannon's juggling theorem). Presents the equation (F+D)H = (V+D)N relating flight time, dwell time, vacant time, number of balls, and number of hands. Also describes Shannon's juggling robot. Historical cornerstone

**Primitive Juggling Sequences** -- Fan Chung, Ron Graham (2008)
- URL: https://doi.org/10.1080/00029890.2008.11920516
- Availability: **Free** (American Mathematical Monthly, widely accessible)
- Level: Intermediate
- Best for: Module 3 (enumeration). Studies indecomposable juggling sequences -- patterns that cannot be broken into shorter valid subsequences. Essential for understanding the fine structure of siteswap spaces
- 25 citations

**Descent Polynomials for Permutations with Bounded Drop Size** -- Fan Chung, Anders Claesson, Mark Dukes, Ronald Graham (2010)
- URL: https://doi.org/10.1016/j.ejc.2010.01.011
- Availability: **Free** preprints available
- Level: Upper intermediate to advanced
- Best for: Module 3 (permutation connections). Deepens the relationship between bounded-drop permutations and juggling sequences through descent polynomials
- 23 citations

**Enumerating (Multiplex) Juggling Sequences** -- Steve Butler, Ron Graham (2008)
- URL: https://arxiv.org/abs/0801.2597
- Availability: **Free** on arXiv
- Level: Upper intermediate
- Best for: Module 5 (extensions). Solves the enumeration problem for multiplex patterns (multiple balls caught/thrown simultaneously) using matrix methods
- 21 citations

**Juggling and Applications to q-Analogues** -- Richard Ehrenborg, Margaret A. Readdy (1996)
- URL (Semantic Scholar): https://www.semanticscholar.org/paper/c595923b1d606982364f24060ca476e5d7936573
- Availability: Accessible through academic libraries
- Level: Advanced
- Best for: Module 5 (algebraic connections). Introduces juggling cards for q-enumeration formulas, computing the Poincare series of affine Weyl groups. Best saved for after the core curriculum; an enrichment resource for students who want the algebraic-combinatorial depth
- 85 citations

**Multivariate Juggling Probabilities** -- Arvind Ayyer, Jeremie Bouttier, Sylvie Corteel, Francois Nunzi (2014)
- URL (Semantic Scholar): https://www.semanticscholar.org/paper/de2a0349aae46997d9b191af4429cfa9031ab2f9
- Availability: Accessible through academic libraries
- Level: Advanced
- Best for: Module 4 extension. Generalizes Warrington's model to refined Markov chains with arbitrary throw heights and infinitely many balls, giving product formulas for stationary probabilities via integer partitions

**Universal Juggling Cycles** -- Fan Chung, Ron Graham (2007)
- URL (Semantic Scholar): https://www.semanticscholar.org/paper/44fc233f894e7fa649daa694f736aff7581bd3f1
- Availability: Accessible through academic libraries
- Level: Intermediate
- Best for: Module 3 enrichment. A single long cyclic sequence that encodes an entire class of siteswap sequences via a sliding window -- a de Bruijn sequence for juggling
- 8 citations

**Juggling Braids and Links** -- Satyan L. Devadoss, John Mugno (2006)
- URL (Semantic Scholar): https://www.semanticscholar.org/paper/2f090da906dbe4930141f6295be74337b041ccdf
- Availability: Accessible through academic libraries
- Level: Intermediate (topology background helpful but not required)
- Best for: Module 5 (topological connections). Constructs a map from periodic siteswaps to topological links via braids and proves every braid can be represented as a juggling pattern
- 7 citations

**Positroid Varieties: Juggling and Geometry** -- Allen Knutson, Thomas Lam, David E. Speyer (2013)
- URL: https://doi.org/10.1112/s0010437x13007240
- Availability: Accessible through academic libraries; arXiv preprint available
- Level: Advanced (algebraic geometry background required)
- Best for: Module 5 enrichment and the final "frontiers" lesson. Connects bounded affine permutations (a generalization of juggling patterns) to positroid varieties in the Grassmannian. The highest-impact paper in the field (170 citations). Included as a horizon paper rather than assigned reading -- the goal is for students to understand what this connection means, not to work through the proofs
- 170 citations

**Juggling Card Sequences** -- Steve Butler, Fan Chung, Jay Cummings, Ron Graham (2015)
- URL: https://arxiv.org/abs/1504.01426
- Availability: **Free** on arXiv
- Level: Intermediate
- Best for: Module 3 enrichment. Represents juggling patterns as card sequences tracking relative ball ordering; connects to Stirling numbers, Dyck paths, Narayana numbers, and boson normal ordering
- 8 citations

**Braids and Juggling Patterns** -- Matthew Macauley (senior thesis)
- URL: https://www.jonglage.net/theorie/notation/siteswap-avancee/refs/Matthew%20Macauley%20-%20Braids%20And%20Juggling%20Patterns%20(2003).pdf
- Availability: **Free** PDF
- Level: Intermediate. Written as an undergraduate thesis, so pitched at the right level
- Best for: Module 5 (topological connections). More detailed and pedagogical treatment of the siteswap-to-braid map than the Devadoss-Mugno paper

**Juggling Siteswap Theory** -- Eklavya Sharma (blog post)
- URL: https://sharmaeklavya2.github.io/blog/juggling-theory.html
- Availability: **Free**
- Level: Intermediate. Clear technical walkthrough with proofs
- Best for: Modules 1-2 supplement. A well-organized online reference covering the average theorem, the permutation test, and basic enumeration with full proofs. Good for students who want a self-paced text alternative

**Juggling and Card Shuffling Meet Mathematical Fonts** -- Erik Demaine, Martin Demaine
- URL: https://erikdemaine.org/papers/JuggleShuffle_Graham80/paper.pdf
- Availability: **Free** PDF
- Level: Intermediate
- Best for: Module 5 enrichment (wild card). Three-ball juggling patterns that trace out letters of the alphabet -- a charming blend of computational geometry and juggling art

### Online Course Modules

**MIT 6.042J / 6.1200J -- Mathematics for Computer Science**
- URL: https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/
- Availability: **Free** (MIT OpenCourseWare -- video lectures, problem sets, textbook)
- Level: Undergraduate
- Best for: Module 1 (siteswap as state machines, the average theorem). Siteswap notation appears as an application of discrete mathematics within a full course. Useful for students who want the siteswap module embedded in a broader mathematical context
- Note: No standalone MOOC exists for the mathematics of juggling. This MIT course provides the closest thing to a formal university-level treatment of siteswap within a structured curriculum

### Introductory Articles

**Oxford Mathematics Alphabet: J is for Juggling**
- URL: https://www.maths.ox.ac.uk/outreach/oxford-mathematics-alphabet/j-juggling
- Availability: **Free**
- Level: Introductory
- Best for: Day 1 warmup. An elegant one-page overview that motivates the entire field

**Quanta Magazine: The Mathematics of Juggling (2017)**
- URL: https://www.quantamagazine.org/the-mathematics-of-juggling-20170524/
- Availability: **Free**
- Level: Intermediate
- Best for: Module 1 assigned reading. The best long-form popular article on the subject. Covers the history of siteswap discovery, the key theorems, and active research directions with interviews of practitioners

---

## 2. Videos

### Lecture Series

**Colin Wright -- Mathematics Awareness Month Series (MAA, 2014)**
The most complete video introduction to mathematical juggling, by one of siteswap's co-inventors.
- Part 1: https://www.youtube.com/watch?v=hZMR2h93X0k
- Part 2: https://www.youtube.com/watch?v=DXKbeBd_k4U
- Part 3: https://www.youtube.com/watch?v=CVRolIVGJys
- Masterclass: https://www.youtube.com/watch?v=K3lhCqXMJq0
- Availability: **Free**
- Level: Intermediate. Wright covers notation, the average theorem, the permutation test, pattern discovery, and some enumeration
- Best for: Modules 1-2. Assign the four-part series across the first week. Wright's live demonstrations make the abstract notation concrete

**Colin Wright -- MoMath "Five Balls, Two Hands" (Math Encounters)**
- URL: https://www.youtube.com/watch?v=GNKFSpJIBO0
- Availability: **Free**
- Level: Intermediate public lecture
- Best for: Module 1 supplement. Covers siteswap notation, the average theorem, and pattern discovery with a live audience

**Greg Warrington -- MoMath "Catch!" (Math Encounters, 2023)**
- URL: https://www.youtube.com/watch?v=ZP_gY4Ih85U
- Availability: **Free**
- Level: Intermediate
- Best for: Module 4 (probabilistic juggling). Lecture by the algebraic combinatorialist who pioneered the Markov chain model. Directly complements the Warrington (2003) paper

**Colin Wright -- ETH Zurich Lecture**
- URL: https://math.ethz.ch/news-and-events/news/d-math-news/2014/09/5-balls-2-hands-patterns-of-juggling-colin-wright-explanes-the-mathematics-behind-juggling.html
- Availability: **Free**
- Level: Intermediate
- Best for: Modules 1-2 alternative. A university-level lecture covering the same material as the MAA series in a single session

**Royal Institution -- "The Unexpected Maths of Juggling"**
- URL: https://www.rigb.org/whats-on/unexpected-maths-juggling
- Availability: **Free** (RI website)
- Level: Intermediate
- Best for: Module 1 enrichment. The RI lecture format delivers mathematical ideas with high production quality and strong narrative

### Short Videos

**Numberphile -- "Juggling by Numbers" (Colin Wright, 2017)**
- URL: https://www.youtube.com/watch?v=7dwgusHjA0Y
- Availability: **Free**
- Level: Introductory to intermediate. ~12 minutes
- Best for: Day 1 warmup. The single best entry point -- compact, visual, with live demonstrations. Assign before any reading

**"The Hidden Math of Juggling: Siteswap Notation Explained"**
- URL: https://www.youtube.com/watch?v=LmfS3EttuQg
- Availability: **Free**
- Level: Introductory to intermediate
- Best for: Module 1 supplement. Another clear visual explanation of siteswap basics

**"Learn the Juggling Numbers! -- Siteswap Tutorial"**
- URL: https://www.youtube.com/watch?v=NsIlQDhMKro
- Availability: **Free**
- Level: Introductory (oriented toward practicing jugglers)
- Best for: Module 1 day 1-2. Practical tutorial for students who want to physically try the patterns they are studying mathematically

---

## 3. Interactive Tools

### Juggling Animators

**Juggling Lab**
- Web app: https://jugglinglab.org/
- GitHub: https://github.com/jkboyce/jugglinglab
- Availability: **Free** (GPL-2). Browser, desktop, and mobile
- Features: The most full-featured open-source juggling animator. Supports solo and passing siteswaps, synchronous and multiplexed patterns, bounced throws, and 3D visualization. Created by Jack Boyce (Caltech), who developed the juggling state model
- Best for: All modules. The indispensable companion tool for the entire course. Use it from day 1 to visualize every new pattern. In module 3 (state graphs), use its pattern generation features to explore the enumeration results computationally. In module 5 (multiplex/passing), use its extended notation support

**SiteswapSim**
- Web app: https://siteswapsim.com/
- GitHub: https://github.com/silso/siteswapsim
- Availability: **Free**
- Features: Clean browser-based visualizer for any siteswap including sync and multiplex notation. Simpler interface than Juggling Lab
- Best for: Modules 1-2. Good for quick visualization when you want to check a pattern without the full Juggling Lab interface. The clean UI makes it ideal for classroom demonstrations

**Iris Siteswap Juggling Animator**
- URL: https://iris.joshua-becker.com/lab/siteswap/
- Availability: **Free**
- Features: Browser-based animator with integrated theory explanations
- Best for: Module 1. The integrated theory explanations make it useful for self-study, especially for students working through siteswap notation for the first time

**World Juggling Federation Simulator**
- URL: https://www.thewjf.com/siteswap/
- Availability: **Free**
- Features: Browser-based siteswap animator
- Best for: Module 1. Quick and lightweight

**The Juggling Edge Siteswap Animator**
- URL: https://jugglingedge.com/help/siteswapanimator.php
- Availability: **Free**
- Features: Animator with documentation and notation guidance
- Best for: Module 1-2. Good documentation alongside the animator

**JoePass!**
- URL: https://www.passingdb.com/simulators.php?id=1
- Availability: **Free**
- Features: Passing-pattern animator with causal diagram editor for multi-person juggling mathematics
- Best for: Module 5 (multiplex and passing extensions). The only tool in this list that specifically handles multi-person passing patterns with full causal diagram support

### General Mathematical Tools

**MathPickle Siteswap Activities**
- URL: https://mathpickle.com/project/siteswap-juggling-number-patterns/
- Availability: **Free**
- Features: Classroom-ready interactive activities for siteswap patterns
- Best for: Module 1 warmup exercises. While designed for younger students, the interactive puzzle format is useful for building notation fluency at any level

---

## 4. Code

No dedicated research-grade code library exists for the mathematics of juggling. The following resources provide computational entry points.

**Juggling Lab Source Code (Java)**
- GitHub: https://github.com/jkboyce/jugglinglab
- Language: Java
- License: GPL-2
- Best for: Module 3 (state graphs, enumeration). The source code implements the juggling state machine, siteswap validation, and pattern generation algorithms. Reading the state-graph code provides a concrete computational model of the theory from Buhler et al. The pattern generator can be used to verify enumeration formulas computationally

**SiteswapSim Source Code (TypeScript/JavaScript)**
- GitHub: https://github.com/silso/siteswapsim
- Language: TypeScript
- Best for: Module 1-2. Simpler codebase than Juggling Lab. Good for students who want to understand how siteswap validation and animation work at the implementation level

**Custom Computation Projects**
The following are natural coding exercises that complement the curriculum. No existing repo covers all of them, but each is implementable in a few dozen lines of Python:

- *Siteswap validator* -- implement the permutation test (module 2). Given a sequence, verify it is a valid siteswap by checking that no two balls land at the same time
- *State graph builder* -- construct the juggling state transition graph for b balls and maximum throw height h (module 3). Enumerate all states, draw edges labeled by throw values, visualize with networkx or graphviz
- *Enumeration verifier* -- enumerate all valid siteswap sequences of period p with at most b balls and verify the (b+1)^p formula from Buhler et al. (module 3)
- *Markov chain simulator* -- implement Warrington's random juggling model (module 4). Simulate random throws, compute empirical steady-state distributions, compare with the theoretical Stirling number formulas
- *Siteswap-to-braid mapper* -- given a periodic siteswap, output the corresponding braid word (module 5). Visualize with a simple strand diagram

---

## 5. People

### Founders

| Name | Affiliation | Why to follow |
|---|---|---|
| **Claude Shannon** | MIT / Bell Labs | Published the first formal juggling theorem: (F+D)H = (V+D)N. Built the first juggling robot. His 1993 paper is the historical starting point |
| **Ron Graham** | UCSD / AT&T (d. 2020) | Co-authored the foundational combinatorial papers with Chung, Butler, and Buhler. Master juggler and mathematician (Erdos number 1). His survey papers remain the best intermediate-level overviews |
| **Colin Wright** | Solipsys Ltd / Cambridge PhD | Co-invented siteswap notation at Cambridge (1985). Co-authored the (b+1)^p counting theorem. The most prolific public communicator -- his MAA video series and Numberphile appearance are essential viewing. Active on social media; gives public lectures regularly |
| **Bruce "Boppo" Tiemann** | Caltech | Co-invented siteswap notation at Caltech (1985). Pattern 441 was discovered mathematically before any juggler performed it -- a foundational example of theory predicting practice |
| **Paul Klimek** | Santa Cruz | Independently invented siteswap notation in 1981 (earliest known). Coined "ground state" and "excited state" terminology used throughout the field |

### Active Researchers

| Name | Affiliation | Why to follow |
|---|---|---|
| **Allen Knutson** | Cornell | Connected siteswap to algebraic combinatorics and positroid varieties in algebraic geometry. Uses juggling to teach discrete math. His work represents the deepest algebraic connection in the field |
| **Burkard Polster** | Monash University | Authored the definitive textbook. Also runs the Mathologer YouTube channel covering recreational and deep mathematics |
| **Fan Chung** | UCSD | Co-authored papers on primitive juggling sequences, universal juggling cycles, descent polynomials, and juggling card sequences with Graham. A leading figure in combinatorics broadly |
| **Steve Butler** | Iowa State University | Extended juggling enumeration to multiplex patterns and juggling card sequences. Multiple papers with Graham. Active in combinatorics and discrete math |
| **Greg Warrington** | University of Vermont | Pioneered the probabilistic (Markov chain) model of random juggling. His 2023 MoMath lecture is the best video introduction to this branch |
| **Erik Demaine** | MIT | Co-created mathematical juggling fonts (three-ball patterns tracing alphabet letters). Connections to computational geometry and computational origami -- bridge to the origami-mathematics curriculum |
| **Jack Boyce** | Caltech | Developed the juggling state model and created Juggling Lab, the primary open-source simulator. His state-graph formalization is central to the computational side of the theory |
| **Richard Ehrenborg** | University of Kentucky | Connected juggling to q-analogues, q-Stirling numbers, and the Poincare series of affine Weyl groups. Represents the algebraic-combinatorial branch |

---

## 6. Unexpected Connections

### Category Theory (active curriculum topic)

Siteswap patterns form a monoid under concatenation, which is exactly a one-object category. The juggling state transition graph is a free category generated by a directed graph. Functors from this category to Set assign to each state its set of reachable patterns. The Yoneda lemma implies that a juggling state is completely determined by the set of all patterns reachable from it -- "you are your relationships" applied to juggling means a state is characterized by its outgoing siteswap sequences, not by its internal ball configuration.

- *When to use*: Module 3 (state graphs and transition matrices). After building the state graph, point out that it is literally a category, and the enumeration results are about counting morphisms
- *Cross-reference*: Category theory curriculum concepts 1-2 (composition, monoids), 6 (functors), 18 (Yoneda)

### Optimal Transport (active curriculum topic)

The Kantorovich LP formulation provides the framework for optimizing ball-redistribution schedules in juggling, where balls are "mass" and temporal displacement is "cost." Finding a minimum-cost assignment of throws to catches is a discrete transport problem. Wasserstein distances can define a metric on the space of juggling patterns viewed as empirical distributions over states.

- *When to use*: Module 4 (probabilistic juggling). When discussing steady-state distributions, note that comparing two juggling distributions is literally an optimal transport problem
- *Cross-reference*: Optimal transport curriculum days 1-3 (Monge, Kantorovich, duality)

### Origami Mathematics (active curriculum topic)

Both fields exhibit an identical local-versus-global structure: origami has Kawasaki's and Maekawa's theorems as local necessary conditions with NP-hard global flat-foldability, while juggling has the siteswap average theorem as a local necessary condition with computationally hard global pattern realization. Maekawa's theorem (mountain minus valley = plus or minus 2) is structurally analogous to the siteswap average theorem (average = number of balls) -- both are simple arithmetic constraints that filter out invalid configurations before expensive global checks.

- *When to use*: Module 2 (average theorem and validity tests). After proving the average theorem, draw the parallel to Maekawa's theorem
- *Cross-reference*: Origami mathematics curriculum concepts 3-4, 7-8

### Music and Bell Ringing

Change ringing -- the art of ringing permutations on a set of church bells -- is the oldest mathematical art closely related to juggling. Both are concerned with realizing permutation sequences under physical constraints (in bell ringing, only adjacent bells can swap; in juggling, throws must land at integer beat offsets). Polster's textbook has a chapter on this connection.

- *When to use*: Module 2 (permutations). After establishing the connection between siteswaps and permutations, introduce change ringing as a parallel art form with the same mathematical structure but different physical constraints
- *Resource*: Polster, *The Mathematics of Juggling*, chapter on bell ringing

### Braid Theory and Knot Theory

Every periodic juggling pattern traces out a braid in space-time, and Devadoss and Mugno proved that every braid (and therefore every knot and link) can be represented as a juggling pattern. This means juggling is, in a precise sense, topologically universal.

- *When to use*: Module 5 (topological connections). This is an entire lesson topic, but drop the headline result ("every knot is a juggling pattern") as a rabbit hole earlier, in module 2
- *Resource*: Devadoss and Mugno (2006); Macauley thesis

### Algebraic Geometry and the Grassmannian

Bounded affine permutations -- which are exactly juggling patterns with bounded throw heights -- parameterize positroid varieties in the Grassmannian. This connection, established by Knutson, Lam, and Speyer, is the highest-impact result in the field (170 citations). It means that questions about juggling patterns translate to questions about geometric objects in algebraic geometry, and vice versa.

- *When to use*: Module 5 (algebraic connections) and the final frontiers lesson. This is a horizon topic -- students should understand what the connection says and why it matters, even if the algebraic geometry is beyond the course's scope
- *Resource*: Knutson, Lam, Speyer (2013)

### Computer Science and Formal Languages

Siteswap sequences form a formal language. The set of valid siteswaps of a given period and ball count can be recognized by a finite automaton (the state graph is the automaton). This connects juggling directly to automata theory, regular languages, and the Chomsky hierarchy.

- *When to use*: Module 3 (state graphs). When building state transition diagrams, point out that the student has just constructed a finite automaton, and the valid siteswaps are its accepted strings
- *Resource*: MIT 6.042J siteswap module

### Shannon's Information Theory

Shannon's juggling theorem is by the same Claude Shannon who founded information theory. The structural parallel runs deep: information theory asks "how fast can you communicate reliably through a noisy channel?", while Shannon's juggling theorem asks "how many balls can you keep in the air given physical timing constraints?" Both reduce a physical question to an algebraic inequality.

- *When to use*: Module 1 (Shannon's theorem). After presenting the theorem, note that Shannon's juggling work was a late-career recreation by the founder of information theory, and that the theorem has the same flavor as his channel capacity theorem -- a conservation law constraining what is physically possible
