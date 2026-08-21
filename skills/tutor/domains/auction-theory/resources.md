# Auction Theory and Mechanism Design — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Algorithmic Game Theory** (Nisan, Roughgarden, Tardos, Vazirani, 2007)
  - URL: https://www.cs.cmu.edu/~sandholm/cs15-892F13/algorithmic-game-theory.pdf
  - Chapter 9: Introduction to Mechanism Design (for Computer Scientists)
  - Coverage: DSIC, revelation principle, VCG, combinatorial auctions, sponsored search
  - Why it's good: Computer science perspective, algorithmic focus, accessible proofs, free PDF
  - Best for: Lessons 8-23 (mechanism design fundamentals through advanced mechanisms)

- **Twenty Lectures on Algorithmic Game Theory** (Tim Roughgarden, 2016)
  - Companion to CS364A course
  - Coverage: Mechanism design basics, Myerson's Lemma, revenue maximization, approximation
  - Why it's good: Lecture format, builds intuition before formalism, excellent exercises
  - Best for: Entire curriculum, especially lessons 8-19

### Course Materials

- **Stanford CS364A: Algorithmic Game Theory** (Tim Roughgarden, Fall 2013)
  - URL: https://timroughgarden.org/f13/f13.html
  - Lecture notes PDF: https://timroughgarden.org/f13/f13.pdf
  - Individual lecture PDFs available
  - Coverage: Complete course on mechanism design, auctions, sponsored search, VCG
  - Why it's good: Gold standard for intermediate learners, clear exposition, comprehensive
  - Best for: Entire curriculum

- **Stanford CS364B: Topics in Algorithmic Game Theory** (Tim Roughgarden, Fall 2005)
  - URL: https://timroughgarden.org/f05/f05.html
  - Coverage: Combinatorial auctions, optimal mechanism design
  - Why it's good: Advanced topics, guest lectures by experts
  - Best for: Lessons 20-21 (VCG and combinatorial auctions)

- **Mechanism Theory** (Matthew O. Jackson, Stanford)
  - URL: https://web.stanford.edu/~jacksonm/mechtheo.pdf
  - Coverage: Economic foundations, incentive compatibility, implementation theory
  - Why it's good: Rigorous economic perspective, complements algorithmic approach
  - Best for: Lessons 8-17 (mechanism design and revenue maximization)

- **MIT 14.147: Topics in Game Theory** (Fall 2009)
  - URL: https://ocw.mit.edu/courses/14-147-topics-in-game-theory-fall-2009/
  - Coverage: Mechanism design, matching markets, school choice
  - Why it's good: MIT OpenCourseWare quality, downloadable problem sets
  - Best for: Lessons 25 (matching markets)

## Supplementary (for engagement)

### Video Lectures

- **Coursera: Game Theory II - Advanced Applications** (Stanford, Shoham & Leyton-Brown)
  - URL: https://www.coursera.org/learn/game-theory-2
  - Coverage: Social choice, mechanism design, VCG, auctions
  - Why it's good: Structured video course, quizzes, accessible explanations
  - Best for: Lessons 1-10 (introduction through mechanism design basics)

- **MIT OCW: Economic Applications of Game Theory** (Fall 2025)
  - Video lectures: https://ocw.mit.edu/courses/14-12-economic-applications-of-game-theory-fall-2025/video_galleries/video-lectures/
  - Lecture 18 on auctions: https://ocw.mit.edu/courses/14-12-economic-applications-of-game-theory-fall-2025/resources/mit14_12f25_lec18_1080p_mp4/
  - Coverage: Auctions, bidding strategies, revenue equivalence
  - Why it's good: High-quality video production, complements reading
  - Best for: Lessons 1-6 (classical auctions)

- **Tim Roughgarden's YouTube Channel**
  - Search for CS364A lectures (if available)
  - Coverage: Varies by upload
  - Why it's good: Roughgarden is an exceptional expositor
  - Best for: Supplementing any lesson

### Interactive Tools

- **Limited availability for auction theory**
  - No major interactive simulators discovered during research
  - Consider building simple auction simulations in Python/JavaScript as exercises
  - GeoGebra might be useful for visualizing bid distributions and virtual valuations

### Code & Repositories

- **Mechanism design implementations**
  - Students should implement basic mechanisms (Vickrey, VCG) in their language of choice
  - GitHub search: "auction mechanism" or "VCG implementation" for examples
  - Consider using computational notebooks (Jupyter, Observable) for interactive exploration

- **Auction simulation platforms**
  - Students could simulate auctions with different bidder strategies
  - Useful for lessons on equilibrium behavior and empirical testing

## People to Follow

### Key Researchers

- **Tim Roughgarden** (Columbia University, formerly Stanford)
  - Expertise: Algorithmic game theory, mechanism design, complexity
  - Why: Most accessible expositor in the field, excellent course materials
  - Website: http://timroughgarden.org/

- **Noam Nisan** (Hebrew University of Jerusalem)
  - Expertise: Combinatorial auctions, computational mechanism design
  - Why: Pioneer in algorithmic mechanism design, co-editor of AGT textbook

- **Matthew Jackson** (Stanford)
  - Expertise: Economic mechanism theory, market design, networks
  - Why: Economic foundations, rigorous theory
  - Website: https://web.stanford.edu/~jacksonm/

- **Roger Myerson** (University of Chicago)
  - Expertise: Optimal auction design, mechanism theory
  - Why: Nobel laureate, foundational work on revenue maximization
  - Classic paper: "Optimal Auction Design" (1981)

- **Hal Varian** (Google Chief Economist, UC Berkeley)
  - Expertise: Ad auctions, mechanism design applications
  - Why: Bridge between theory and practice (Google ad auctions)

- **Jason Hartline** (Northwestern)
  - Expertise: Optimal mechanism design, approximation
  - Website: https://sites.northwestern.edu/hartline/

- **Éva Tardos** (Cornell)
  - Expertise: Algorithmic game theory, network games
  - Why: Co-editor of AGT textbook, excellent researcher

- **Vijay Vazirani** (UC Irvine)
  - Expertise: Algorithmic game theory, market equilibria
  - Why: Co-editor of AGT textbook

### Practitioners & Applied Work

- **Preston McAfee** (Google, Microsoft)
  - Expertise: Ad auction design, practical mechanism implementation
  - Why: Industry perspective on real-world auction design

- **Paul Milgrom** (Stanford)
  - Expertise: Spectrum auctions, practical auction design
  - Why: Nobel laureate, designed FCC spectrum auctions

## Unexpected Cross-Discipline Connections

### Computer Science

- **Approximation algorithms** — When exact optimization is intractable, design approximately optimal mechanisms
- **Online algorithms** — Dynamic auction settings where agents arrive over time
- **Complexity theory** — Understanding computational barriers to mechanism implementation
- **Cryptography** — Secure multi-party computation for implementing mechanisms without trusted auctioneers

### Economics

- **Contract theory** — Mechanism design with hidden information and actions
- **Industrial organization** — Strategic behavior in markets, antitrust implications
- **Public economics** — Optimal taxation as mechanism design

### Mathematics

- **Convex optimization** — Revenue maximization, optimal auction design
- **Probability theory** — Bayesian mechanism design, distributions over valuations
- **Discrete mathematics** — Combinatorial auctions, winner determination

### Operations Research

- **Resource allocation** — Mechanisms for allocating scarce resources
- **Scheduling** — Mechanisms for task assignment with strategic agents

### Public Policy

- **Spectrum allocation** — FCC auctions, market design for radio frequencies
- **School choice** — Matching students to schools without monetary transfers
- **Organ exchange** — Kidney exchange markets
- **Environmental policy** — Cap-and-trade, emissions auctions

### Biology & Social Systems

- **Evolution of cooperation** — Mechanisms in nature that align incentives
- **Voting theory** — Social choice mechanisms, impossibility results (Arrow, Gibbard-Satterthwaite)

### Philosophy

- **Justice and fairness** — Normative questions about mechanism design objectives
- **Social choice theory** — Aggregating preferences, collective decision-making

## Additional Resources

### Research Venues

- **ACM Conference on Economics and Computation (EC)** — Top venue for algorithmic mechanism design
- **Web and Internet Economics (WINE)** — Theory and applications
- **Management Science, Operations Research journals** — Applied mechanism design

### Online Communities

- **CS Theory Stack Exchange** — Q&A on mechanism design theory
- **Economics Stack Exchange** — Economic perspective on auctions and markets

### Tools for Exploration

- **Python libraries:** Consider `scipy.optimize` for auction optimization problems
- **R packages:** For statistical analysis of auction data
- **Jupyter notebooks:** Interactive exploration of mechanisms
- **Observable notebooks:** Web-based interactive visualizations

## Curated Reading Order

For self-study beyond the curriculum:

1. Start: Tim Roughgarden's CS364A lecture notes (lessons 1-4)
2. Supplement: Coursera Game Theory II videos for intuition
3. Deepen: AGT textbook Chapter 9 for rigor
4. Broaden: Matthew Jackson's mechanism theory notes for economic perspective
5. Explore: CS364B notes for advanced topics (combinatorial auctions)
6. Apply: Read case studies on spectrum auctions, ad auctions, matching markets
