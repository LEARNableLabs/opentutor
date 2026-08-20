# Research: category theory
Generated: 2026-08-20

## Overview

Category theory is a branch of mathematics that studies mathematical structures and the relationships between them at the highest level of abstraction. Introduced by Samuel Eilenberg and Saunders Mac Lane in their 1945 paper "General Theory of Natural Equivalences," category theory was originally developed to formalize recurring patterns in algebraic topology. A category consists of objects and morphisms (arrows between objects) equipped with associative composition and identity morphisms. The central concepts of the field -- functors (structure-preserving maps between categories), natural transformations (morphisms between functors), universal properties, limits and colimits, adjunctions, and monads -- provide a unified language for describing constructions that appear across disparate areas of mathematics.

Category theory matters because it reveals deep structural analogies between seemingly unrelated mathematical domains: algebra, topology, logic, geometry, and computer science all share categorical patterns that become visible only at this level of abstraction. Its major branches include topos theory (generalizing both set theory and geometry), higher category theory (extending the framework to handle morphisms between morphisms at all levels), homological algebra (studying algebraic invariants via derived functors), and categorical logic (the correspondence between categories and logical systems). In recent decades, applied category theory has emerged as an active frontier, bringing categorical methods to bear on databases, network theory, machine learning, quantum computing, and programming language design.

## Key Papers

Deduplicated across arxiv, Semantic Scholar, and OpenAlex. Citation counts reflect the highest verified count from any source (Semantic Scholar or OpenAlex API, retrieved 2026-08-20).

1. **General Theory of Natural Equivalences** (1945) -- Samuel Eilenberg, Saunders Mac Lane
   729 citations. The founding paper of category theory, introducing the definitions of category, functor, and natural transformation.
   https://www.semanticscholar.org/paper/fd5732c8d88bbe2d47b1cf92d428b25dbcb9c83a

2. **Sur quelques points d'algebre homologique, I** (1957) -- Alexander Grothendieck
   1,451 citations. The "Tohoku paper" that introduced abelian categories and developed homological algebra in an axiomatic categorical framework.
   https://www.semanticscholar.org/paper/b1bfdd7261077561d5844a4cd94228c597b818b7

3. **Functorial Semantics of Algebraic Theories** (1963) -- F. William Lawvere
   1,037 citations. Introduced Lawvere theories, recasting universal algebra in purely categorical terms by defining algebraic theories as categories with finite products.
   https://www.semanticscholar.org/paper/1679d8d7e7b0a403f1fa09bf574e0d9199fb069b

4. **Categories for the Working Mathematician** (1971) -- Saunders Mac Lane
   5,629 citations. The foundational graduate textbook that systematically develops categories, functors, natural transformations, limits, adjunctions, and monads, establishing the standard reference for the field.
   https://www.semanticscholar.org/paper/512d0c81d07f70a73b18db9eb1241fe9d46219f0

5. **Introduction to Higher Order Categorical Logic** (1986) -- Joachim Lambek, Philip J. Scott
   1,544 citations. Develops the correspondence between category theory and logic, showing how cartesian closed categories model typed lambda calculus and how toposes provide semantics for higher-order intuitionistic logic.
   https://www.semanticscholar.org/paper/bb33ff1b4175d437f6141abb1075f4c64d1bea6f

6. **Notions of Computation and Monads** (1991) -- Eugenio Moggi
   2,030 citations. Introduced monadic semantics for computation, providing a categorical foundation for reasoning about side effects in programming languages.
   https://www.semanticscholar.org/paper/7f2210ff39ef9669f2a84db611c80c4b28f9fffc

7. **Sheaves in Geometry and Logic** (1992) -- Saunders Mac Lane, Ieke Moerdijk
   1,124 citations. A comprehensive introduction to topos theory tracing how sheaves arose in geometry and in logic, culminating in the elementary axioms of Lawvere and Tierney.
   https://www.semanticscholar.org/paper/f4e07d61328c1f9ead6f33ca7fc4164ba90bd40c

8. **Locally Presentable and Accessible Categories** (1994) -- J. Adamek, J. Rosicky
   1,184 citations. Systematic treatment of locally presentable and accessible categories, foundational for modern categorical algebra and homotopy theory.
   DOI: 10.1017/cbo9780511600579

9. **Handbook of Categorical Algebra** (1994) -- Francis Borceux
   1,027 citations. Three-volume reference giving a detailed, self-contained account of category theory from basics through sheaf theory and topos theory.
   DOI: 10.1017/cbo9780511525858

10. **Category Theory for Computing Science** (1995) -- Michael Barr, Charles Wells
    1,165 citations. Systematic exposition of category theory for computer scientists, covering limits, adjoints, cartesian closed categories, toposes, and sketches with computing applications.
    https://www.semanticscholar.org/paper/1b60122c5963dfa9fab1d8166a0f723e8eaf7bab

11. **Sketches of an Elephant: A Topos Theory Compendium** (2002) -- Peter Johnstone
    901 citations. Encyclopedic treatment of topos theory from multiple perspectives: as categories of sheaves, as generalized universes of sets, and as frameworks for logic.
    DOI: 10.1093/oso/9780198515982.001.0001

12. **Higher Topos Theory** (2006/2009) -- Jacob Lurie
    2,332 citations. Develops higher category theory using quasicategories and applies it to construct higher versions of Grothendieck topoi, unifying homotopy theory and categorical algebra.
    https://www.semanticscholar.org/paper/4159748b80bfa1cbf1d9892d690d4cd1b825acd1

13. **Basic Category Theory** (2016) -- Tom Leinster
    The most recommended introductory textbook, built around the concept of universal properties. Freely available under Creative Commons.
    https://arxiv.org/abs/1612.09375

14. **Seven Sketches in Compositionality: An Invitation to Applied Category Theory** (2018) -- Brendan Fong, David I. Spivak
    Accessible introduction to applied category theory through real-world examples including databases, electrical circuits, and signal flow graphs. Companion to MIT 18.S097. Freely available.
    https://arxiv.org/abs/1803.05316

15. **Category-Theoretical and Topos-Theoretical Frameworks in Machine Learning: A Survey** (2024) -- Yiyang Jia, Guohong Peng, Zheng Yang, Tianhao Chen
    Recent survey covering category-theoretic approaches to gradient-based learning, probabilistic learning, invariance/equivalence-based learning, and topos-based learning.
    https://arxiv.org/abs/2408.14014

## Academic Landscape

### Related Fields and Subfields

Category theory sits at the intersection of algebra, topology, logic, and computer science. The OpenAlex concept taxonomy places it as a level-2 concept with 8,537 tagged works and 58,916 total citations, concentrated in three main topic clusters:

- **Homotopy and Cohomology in Algebraic Topology** (1,354 category-theory works): model categories, K-theory, operads, higher algebraic structures, and stacks
- **Logic, Programming, and Type Systems** (778 works): formal verification, type inference, programming language semantics, abstract interpretation
- **Algebraic Structures and Combinatorial Models** (355 works): cluster algebras, triangulated categories, derived categories, quiver representations, quantum groups

### Active Research Areas

- **Higher category theory and infinity-categories:** Following Lurie's foundational work, the development of infinity-categorical methods continues to reshape algebraic topology and algebraic geometry. Groth's "A short course on infinity-categories" (2010, https://arxiv.org/abs/1007.2925) provides an accessible entry point.
- **Applied category theory (ACT):** The fastest-growing area, applying categorical methods to databases, network theory, dynamical systems, epidemiology, and natural language processing. The annual ACT conference and the Topos Institute are central hubs.
- **Categorical machine learning:** Two 2024 surveys (Jia et al. and Crescenzi, https://arxiv.org/abs/2410.05353) document growing efforts to build categorical foundations for deep learning, covering gradient-based learning, probabilistic models, and equivariant architectures.
- **Computational category theory:** Tools like Categorica (Gorard, 2024, https://arxiv.org/abs/2403.16269) and homotopy.io are making category theory computationally executable.
- **Category theory for programming:** Ahrens and Wullaert (2022, https://arxiv.org/abs/2209.01259) represent ongoing work connecting initial algebras, monads, and functional programming.
- **Categorical quantum mechanics:** Pioneered by Bob Coecke, this area uses monoidal categories and string diagrams to formalize quantum information theory.

## Educational Resources

### Courses

- **MIT 18.S097: Applied Category Theory (IAP 2019)** -- Undergraduate level. Instructors: David Spivak, Brendan Fong. Lecture videos, problem sets, based on *Seven Sketches*. https://ocw.mit.edu/courses/18-s097-applied-category-theory-january-iap-2019/
- **MIT 18.S996: Category Theory for Scientists (Spring 2013)** -- Graduate level. Instructor: David Spivak. Category theory as a modeling framework for science. https://ocw.mit.edu/courses/18-s996-category-theory-for-scientists-spring-2013/
- **MIT 18.726: Algebraic Geometry (Spring 2009) -- Category Theory Module** -- Graduate level. Lecture notes on categories, functors, Yoneda's lemma, adjoint functors. https://ocw.mit.edu/courses/18-726-algebraic-geometry-spring-2009/resources/mit18_726s09_lec02_categories/
- **Class Central aggregator** for additional category theory courses: https://www.classcentral.com/subject/category-theory

### Textbooks

#### Freely Available

| Title | Author(s) | Level | Access |
|-------|-----------|-------|--------|
| *Basic Category Theory* | Tom Leinster | Undergrad/Masters | [arXiv (CC)](https://arxiv.org/abs/1612.09375) |
| *Category Theory in Context* | Emily Riehl | Advanced undergrad/grad | [Author's site (PDF)](https://emilyriehl.github.io/files/context.pdf) |
| *Category Theory for Programmers* | Bartosz Milewski | Programmers, any level | [GitHub (CC-BY-SA-4.0)](https://github.com/hmemcpy/milewski-ctfp-pdf) |
| *Seven Sketches in Compositionality* | Brendan Fong, David Spivak | Undergrad/general | [arXiv](https://arxiv.org/abs/1803.05316) |
| *Introducing Category Theory* | Peter Smith | Beginner/undergrad | [Logic Matters (~510 pp)](https://logicmatters.net/categories/) |
| *Abstract and Concrete Categories: The Joy of Cats* | Adamek, Herrlich, Strecker | Grad | Free PDF from authors |
| *Category Theory for Computing Science* | Michael Barr, Charles Wells | CS-oriented grad | Free PDF from authors |
| *Notes on Category Theory* | Paolo Perrone | Beginner/scientific | [arXiv](https://arxiv.org/abs/1912.10642) |
| *Category Theory for Scientists (Old Version)* | David Spivak | Scientists | [arXiv](https://arxiv.org/abs/1302.6946) |

#### Not Free (Widely Recommended)

| Title | Author(s) | Level | Notes |
|-------|-----------|-------|-------|
| *Categories for the Working Mathematician* | Saunders Mac Lane | Grad (classic) | The foundational reference |
| *Category Theory* (Oxford Logic Guides) | Steve Awodey | Grad, CS/logic | Covers categorical logic |
| *The Joy of Abstraction* | Eugenia Cheng | Beginner, no math needed | Cambridge UP, 2023 |
| *Conceptual Mathematics* | F. W. Lawvere, Stephen Schanuel | Beginner | Uses sets and functions only |
| *Topoi* | Robert Goldblatt | Undergrad/grad | Dover reprint available |

### Videos

#### Full Lecture Series

- **Bartosz Milewski -- Category Theory for Programmers** (~70 videos, 3 seasons). Programming-oriented with Haskell/C++ examples. The most popular video introduction.
  - Playlist: https://www.youtube.com/playlist?list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_
  - Companion blog: https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/
- **The Catsters (Eugenia Cheng, Simon Willerton)** -- Short lectures on natural transformations, adjunctions, monads, limits/colimits.
  - Playlist: https://www.youtube.com/playlist?list=PLlGXNwjYhXYxKVa67r0pKuYufECy713bv
  - Viewing guide: https://byorgey.wordpress.com/catsters-guide-2/
- **MIT Applied Category Theory lectures** (Spivak, Fong) -- Accompanies MIT 18.S097.
  - https://ocw.mit.edu/courses/18-s097-applied-category-theory-january-iap-2019/pages/lecture-videos-and-readings/

#### Standalone Introductions

- "A Sensible Introduction to Category Theory": https://www.youtube.com/watch?v=yAi3XWCBkDo
- Bartosz Milewski, "A Crash Course in Category Theory": https://www.youtube.com/watch?v=JH_Ou17_zyU

### Interactive Tools

- **homotopy.io** -- Browser-based proof assistant for higher category theory with point-and-click string/surface diagram composition. Open source (Rust/WebAssembly). https://homotopy.io | [GitHub](https://github.com/homotopy-io) | [Paper](https://arxiv.org/abs/2402.13179)
- **Category Theory Illustrated** (Boris Marinov) -- Free, visually-driven online book with extensive diagrams. Creative Commons. https://abuseofnotation.github.io/category-theory-illustrated/
- **CatViz** -- Visualization tool for category theory constructions. https://github.com/gmramella/CatViz
- **nLab** -- Collaborative wiki for research-level category theory and homotopy theory. The most comprehensive online reference. https://ncatlab.org/nlab/show/category+theory
- **WildCats** -- Mathematica package for manipulating objects, morphisms, commutative diagrams, functors, and natural transformations.

## Key People

### Founders

| Name | Contribution |
|------|-------------|
| **Samuel Eilenberg** (1913--1998) | Co-invented category theory in 1945. Introduced categories, functors, and natural transformations. |
| **Saunders Mac Lane** (1909--2005) | Co-invented category theory. Authored *Categories for the Working Mathematician*. |
| **Alexander Grothendieck** (1928--2014) | Revolutionized algebraic geometry using categorical methods. Introduced schemes, topoi, and derived categories. |
| **F. William Lawvere** (1937--2023) | Pioneered categorical logic and topos theory. Introduced Lawvere theories and the categorical axiomatization of set theory. |

### Modern Researchers and Educators

| Name | Affiliation | Area |
|------|------------|------|
| **Jacob Lurie** | IAS Princeton | Higher category theory, infinity-topoi. Author of *Higher Topos Theory* and *Higher Algebra*. |
| **Emily Riehl** | Johns Hopkins | Higher category theory, homotopy type theory. Author of *Category Theory in Context* (free). |
| **Tom Leinster** | U. of Edinburgh | Author of *Basic Category Theory*, the most recommended introductory text. |
| **David Spivak** | Topos Institute | Applied category theory pioneer. Author of *Category Theory for the Sciences*. MIT instructor. |
| **John Baez** | UC Riverside | Applied category theory champion. Connected Feynman diagrams to monoidal categories. Prolific blogger (Azimuth). |
| **Eugenia Cheng** | School of the Art Inst. of Chicago | Public communicator. Author of *The Joy of Abstraction*. Co-creator of The Catsters. |
| **Bartosz Milewski** | Independent | Created the most popular programming-oriented introduction (blog, book, videos). |
| **Brendan Fong** | Topos Institute | Applied CT. Co-author of *Seven Sketches*. MIT applied CT co-instructor. |
| **Tai-Danae Bradley** | SandboxAQ | Math3ma blog. Bridges category theory and machine learning. Author of *What is Applied Category Theory?* |
| **Andre Joyal** | UQAM, Montreal | Combinatorial species, quasi-categories, topos theory. |
| **Bob Coecke** | Quantinuum | Pioneered diagrammatic/categorical approaches to quantum theory. |

## Resource Quality Notes

**Complete beginner (no math background):** Start with Eugenia Cheng's *The Joy of Abstraction* (2023) or the blog post by Vagrant Gautam (https://dippedrusk.com/posts/2022-08-08-category-theory/). Follow with *Category Theory Illustrated* online for visual reinforcement. Lawvere and Schanuel's *Conceptual Mathematics* is also suitable.

**Programmer:** Bartosz Milewski's video series and companion PDF are the gold standard entry point -- grounded in Haskell/C++ with gradual abstraction. Follow with Ahrens and Wullaert's lecture notes (https://arxiv.org/abs/2209.01259) for a more formal treatment, then Riehl's *Category Theory in Context*.

**Math undergraduate:** Tom Leinster's *Basic Category Theory* (free PDF) is the consensus best starting point, supplemented by The Catsters videos for specific topics. Perrone's *Notes on Category Theory* (free, arXiv) offers a parallel track with concrete examples from diverse mathematical areas.

**Scientist or engineer:** MIT OCW Applied Category Theory (18.S097) paired with Fong and Spivak's *Seven Sketches* (free) provides the most accessible applied path. Spivak's *Category Theory for Scientists* extends this.

**Graduate student in mathematics:** Emily Riehl's *Category Theory in Context* (free PDF) for a modern treatment, then Mac Lane's *Categories for the Working Mathematician* as the canonical reference. Borceux's three-volume *Handbook* for comprehensive coverage. For higher category theory, Groth's short course (https://arxiv.org/abs/1007.2925) before Lurie's *Higher Topos Theory*.

**Blogs and informal learning:** Math3ma (https://www.math3ma.com/categories/category-theory), Logic Matters category theory page (https://logicmatters.net/categories/), Thomas Read's getting-started guide (https://blog.thjread.com/posts/2020-03-09-getting-started-category-theory.html), and the GitHub meta-list (https://github.com/prathyvsh/category-theory-resources) are all high-quality curated starting points.

## Research Gaps

The following gaps were identified by the quality gate and remain unaddressed by the collected sources:

- **Homotopy Type Theory (HoTT):** A major modern intersection of category theory, logic, and computer science. The free HoTT book (https://homotopytype theory.org/book/) is highly influential but absent from all collected sources. HoTT reinterprets type theory through the lens of higher category theory and is central to the Univalent Foundations program.
- **Monoidal categories and string diagrams:** A core subtopic and major pedagogical tool for applied category theory, quantum computing, and linguistics. No dedicated resource was surfaced despite its foundational importance.
- **Categorical quantum mechanics:** Bob Coecke appears as a key person, but no papers, textbooks, or resources from this active research area (e.g., Coecke and Kissinger's *Picturing Quantum Processes*) were captured.
- **Enriched category theory:** Foundational for higher category theory and not covered as a subtopic. Kelly's *Basic Concepts of Enriched Category Theory* (freely available) is a standard reference.
- **Category theory in linguistics:** Pregroup grammars (Lambek) and distributional compositional semantics (DisCoCat) represent an active applied area with no mention in the collected sources.
- **Exercise collections and problem sets:** No standalone problem resources were identified for self-study, beyond those embedded in textbooks.
- **Community resources:** The n-Category Cafe blog, MathOverflow's category-theory tag, and the Kan Extension Seminar are important community hubs missing from the collected data.
