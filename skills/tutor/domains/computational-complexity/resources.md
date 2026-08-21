# Computational Complexity — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Sipser, "Introduction to the Theory of Computation" (3rd edition, 2012)** — The gold standard for intermediate students. Chapters 7-9 cover time complexity, P vs NP, and NP-completeness with exceptional clarity. Accessible proofs, excellent exercises. Perfect for this level.
  - Available: Most university libraries, Amazon, course reserves

- **Arora & Barak, "Computational Complexity: A Modern Approach" (2009)** — Comprehensive graduate-level text. Freely available online at https://theory.cs.princeton.edu/complexity/book.pdf. Use chapters 1-3 for core P/NP/NP-completeness, later chapters for PSPACE, randomization, and advanced topics. More detailed than Sipser but still readable.

- **Papadimitriou, "Computational Complexity" (1994)** — Classic reference. Covers the polynomial hierarchy, approximation, and randomization beautifully. Slightly dated but still authoritative.

- **Goldreich, "Computational Complexity: A Conceptual Perspective" (2008)** — Emphasizes conceptual understanding over technical details. Great for big-picture thinking.

### University Courses

- **MIT 18.404 (Automata, Computability, and Complexity)** — Michael Sipser's course. Full video lectures, notes, and problem sets at https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/. Covers automata through NP-completeness. Excellent for intermediate students.

- **Stanford CS254 (Computational Complexity)** — Graduate course covering P vs NP, randomization, interactive proofs, circuit complexity. Notes available on course websites (varies by year).

- **Princeton COS 487 (Theory of Computation)** — Sanjeev Arora's course. Sometimes uses the Arora-Barak textbook. Check for online materials.

- **UC Berkeley CS 172 (Computability and Complexity)** — Undergraduate complexity course. Lecture notes and problem sets often publicly available.

## Supplementary (for engagement)

### Videos

- **MIT OCW 18.404 lectures** — Full semester of Sipser teaching his own textbook. https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/video_galleries/video-lectures/

- **Easy Theory (YouTube channel)** — Animated explanations of complexity concepts. Excellent for visual learners. Search for "Easy Theory NP-completeness" or "Easy Theory P vs NP".

- **Numberphile P vs NP videos** — Accessible introductions for general audiences. Good for motivation. https://www.youtube.com/user/numberphile

- **Computerphile complexity videos** — Practical examples of complexity in computing. https://www.youtube.com/user/Computerphile

- **Scott Aaronson's talks** — Search YouTube for "Scott Aaronson P vs NP" or "Scott Aaronson quantum complexity". He's an exceptional communicator.

### Interactive Tools

- **Complexity Explorer (Santa Fe Institute)** — Online courses with interactive modules. https://www.complexityexplorer.org/

- **Turing machine simulators** — Web-based TM simulators for experimenting:
  - http://turingmachinesimulator.com/
  - https://morphett.info/turing/turing.html

- **SAT solver playgrounds** — Try solving SAT instances online:
  - MiniSat web interface
  - https://www.satisfiability.org/ (SAT competition tools)

- **Complexity Zoo** — Comprehensive reference for complexity classes. Interactive search. https://complexityzoo.net/Complexity_Zoo

- **Reduction visualizers** — Visual tools for seeing reduction constructions (search "NP-complete reduction visualizer")

### Code

- **SAT solvers** — Try implementing or using:
  - MiniSat (C++): http://minisat.se/
  - PySAT (Python): https://pysathq.github.io/
  - SAT4J (Java): http://www.sat4j.org/

- **Graph algorithm implementations** — For CLIQUE, Vertex Cover, etc.:
  - NetworkX (Python): https://networkx.org/
  - JGraphT (Java): https://jgrapht.org/

- **NP-complete problem libraries** — Practice reduction targets:
  - https://en.wikipedia.org/wiki/List_of_NP-complete_problems (comprehensive list)

- **Complexity theory repositories** — GitHub has many educational repos with implementations of reductions, complexity class simulations, etc.

### People (to follow)

- **Scott Aaronson** — MIT/UT Austin, quantum complexity, P vs NP, blog at https://scottaaronson.blog. Exceptional writer and teacher.

- **Luca Trevisan** — Bocconi University, complexity theory, "In Theory" blog (now archived) at https://lucatrevisan.github.io/. Deep insights on complexity.

- **Lance Fortnow** — Illinois Institute of Technology, computational complexity blog at https://blog.computationalcomplexity.org/. Regular updates on the field.

- **Dick Lipton and Ken Regan** — "Gödel's Lost Letter" blog at https://rjlipton.wpcomstaging.com/. Explores P vs NP and complexity frontiers.

- **Sanjeev Arora** — Princeton, co-author of Arora-Barak textbook. Work on approximation algorithms and machine learning theory.

- **Avi Wigderson** — Institute for Advanced Study, Turing Award winner, work on randomness, derandomization, and circuit complexity.

- **Russell Impagliazzo** — UC San Diego, creator of the "five worlds" framework for understanding P vs NP scenarios.

### Blogs and Online Writing

- **Scott Aaronson's blog** — https://scottaaronson.blog — Best complexity theory blog. Clear explanations, humor, and deep insights.

- **Computational Complexity blog** — https://blog.computationalcomplexity.org/ — Run by Lance Fortnow and Bill Gasarch. Regular posts on complexity news and open problems.

- **Gödel's Lost Letter** — https://rjlipton.wpcomstaging.com/ — Dick Lipton and Ken Regan discuss P vs NP, algorithms, and theoretical CS.

- **In Theory (archive)** — https://lucatrevisan.github.io/ — Luca Trevisan's blog (no longer active but rich archive).

- **Shtetl-Optimized** — https://scottaaronson.blog (Scott Aaronson's personal blog, overlaps with academic blog).

### Surveys and Expository Papers

- **Fortnow, "The Status of the P versus NP Problem"** (2009) — Accessible survey. Communications of the ACM.

- **Aaronson, "P =? NP"** (2016) — Philosophical and technical exploration. Available at https://www.scottaaronson.com/papers/pnp.pdf

- **Cook, "The P versus NP Problem"** (2000) — Clay Mathematics Institute official description. https://www.claymath.org/millennium-problems/p-vs-np-problem

- **Arora & Barak, "Complexity Theory: A Modern Approach" (draft chapters)** — Free online at https://theory.cs.princeton.edu/complexity/

- **Goldreich, "P, NP, and NP-Completeness: The Basics of Computational Complexity"** (2010) — Short book, conceptual focus.

## Unexpected Connections (wild cards)

- **Cryptography** — Modern encryption (RSA, Diffie-Hellman) relies on complexity assumptions. If P = NP, cryptography collapses. See "Foundations of Cryptography" by Goldreich.

- **Biology and protein folding** — Protein structure prediction is NP-hard (related to folding). AlphaFold's success uses heuristics, not solving NP-complete problems exactly.

- **Game theory** — Many games (Chess, Go) are PSPACE-complete or EXP-complete. See "Algorithmic Game Theory" by Nisan et al.

- **Machine learning** — Training neural networks involves NP-hard optimization (though solvable heuristically). Connections to learning theory (PAC learning, VC dimension).

- **Economics** — Mechanism design and auction theory involve computational complexity (incentive-compatible auctions can be computationally hard).

- **Quantum computing** — Shor's algorithm breaks factoring (threatens RSA), but BQP vs NP is open. See Nielsen & Chuang's "Quantum Computation and Quantum Information".

- **Philosophy** — P vs NP touches on what knowledge means. If P = NP, finding is equivalent to verifying — profound philosophical implications.

- **Artificial Intelligence** — Planning, scheduling, constraint satisfaction are often NP-hard. SAT solvers power automated reasoning tools.

## Key Online References

- **Complexity Zoo** — https://complexityzoo.net/Complexity_Zoo — The definitive reference for complexity classes. 500+ classes with definitions and relationships.

- **Wikipedia's List of NP-complete Problems** — https://en.wikipedia.org/wiki/List_of_NP-complete_problems — Comprehensive catalog.

- **Clay Mathematics Institute P vs NP page** — https://www.claymath.org/millennium-problems/p-vs-np-problem — Official problem statement and background.

- **Computational Complexity Foundation** — https://computationalcomplexity.org/ — Conference proceedings, surveys, and community resources.

- **SIGACT** (ACM Special Interest Group on Algorithms and Computation Theory) — https://sigact.org/ — Professional community and resources.

## Practice Problem Sets

- **MIT 18.404 problem sets** — Available on OCW. Excellent exercises on reductions and NP-completeness.

- **Stanford CS254 problem sets** — Available on course websites. Graduate-level but accessible.

- **Sipser textbook exercises** — End-of-chapter problems are well-designed and progressive.

- **Arora-Barak exercises** — More challenging, suitable for deeper exploration.

- **Online judges with NP-complete problems** — LeetCode, Codeforces, and HackerRank have problems that are NP-hard in theory but tractable in practice (small inputs, heuristics).

## Staying Current

- **Computational Complexity conference (CCC)** — Annual conference, proceedings available. https://computationalcomplexity.org/

- **STOC (Symposium on Theory of Computation)** — Top-tier theory conference. Proceedings available through ACM.

- **FOCS (Foundations of Computer Science)** — Another top-tier theory conference.

- **arXiv cs.CC (Computational Complexity)** — Preprints of latest research. https://arxiv.org/list/cs.CC/recent

- **Complexity theory blogs** (Aaronson, Fortnow, Lipton) — Regular updates on breakthroughs and conjectures.
