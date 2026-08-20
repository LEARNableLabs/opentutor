# Category Theory -- Comprehensive Resource Guide (Intermediate Level)

> Compiled for an intermediate student who knows categories, functors, and natural transformations but aims to wield adjunctions, the Yoneda lemma, and monads with confidence. Curriculum spans 30 lessons across five modules. Resources are tagged by curriculum module and marked free/paid.

---

## 1. Primary Sources

### Textbooks

**Category Theory in Context** -- Emily Riehl
- URL: https://emilyriehl.github.io/files/context.pdf
- Availability: **Free** PDF from the author; also published by Dover (~$15 print)
- Level: Ideal intermediate text. Assumes basic algebra (groups, rings). Covers categories, functors, natural transformations, universal properties, limits/colimits, adjunctions, monads, Kan extensions
- Best for: Modules 1-5. The recommended primary text for the entire course. Riehl's exposition balances rigor with readability and uses examples from algebra, topology, and order theory throughout
- Chapter mapping: Ch 1 (days 1-12), Ch 2 (days 13-19 + Yoneda), Ch 3 (days 13-19 limits), Ch 4 (days 20-24 adjunctions), Ch 5 (days 27-28 monads), Ch 6 (Kan extensions)

**Basic Category Theory** -- Tom Leinster
- URL: https://arxiv.org/abs/1612.09375
- Availability: **Free** on arXiv (Creative Commons); also published by Cambridge University Press (~$35)
- Level: Accessible intermediate. Concise, example-driven, organized around universal properties
- Best for: Modules 1-4. Excellent as a parallel reading to Riehl. Leinster's treatment of representable functors and the Yoneda lemma (Ch 4) is among the clearest available
- Note: The consensus "best starting point" for math undergraduates across multiple recommendation lists

**Category Theory for Programmers** -- Bartosz Milewski
- URL (blog): https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/
- URL (compiled PDF): https://github.com/hmemcpy/milewski-ctfp-pdf
- Availability: **Free** blog series and PDF (CC-BY-SA-4.0)
- Level: Intermediate, assumes programming background (Haskell/C++)
- Best for: Modules 2-5. Connecting category theory to programming -- functors as type constructors, natural transformations as polymorphic functions, monads as computation patterns, Kan extensions. The programming perspective provides a second "concrete model" alongside mathematical examples

**An Invitation to Applied Category Theory: Seven Sketches in Compositionality** -- Brendan Fong and David Spivak
- URL: https://arxiv.org/abs/1803.05316
- Availability: **Free** on arXiv; also published by Cambridge University Press (~$40)
- Level: Intermediate, application-oriented. Covers categories via databases, circuits, signal flow graphs, collaborative design, monoidal categories, enriched categories, toposes
- Best for: Module 5 (day 29 applied CT), monoidal categories, enriched categories. Also valuable for seeing how categorical ideas model real engineering systems

**Categories for the Working Mathematician** -- Saunders Mac Lane
- Availability: **Paid** (~$55, Springer)
- Level: The canonical graduate reference. Dense but authoritative. 5,629 citations
- Best for: Deep dives into monoidal categories (Ch 7, 11), abelian categories, Kan extensions (Ch 10). Use as a secondary reference alongside Riehl, not as a primary text. Mac Lane's treatment of Kan extensions remains definitive

**Category Theory** -- Steve Awodey
- Availability: **Paid** (~$45, Oxford University Press)
- Level: Intermediate. Balances rigor with readability. Strong on categorical logic
- Best for: Modules 4-5. Excellent coverage of exponentials, subobject classifiers, and the introduction to topos theory (day 29). Good bridge to logic and type theory

**Notes on Category Theory** -- Paolo Perrone
- URL: https://arxiv.org/abs/1912.10642
- Availability: **Free** on arXiv
- Level: Beginner to intermediate, scientifically oriented
- Best for: Supplementary reading for modules 1-3. Perrone offers concrete examples from diverse mathematical areas and a gentler on-ramp to universal properties

**Introducing Category Theory** -- Peter Smith
- URL: https://logicmatters.net/categories/
- Availability: **Free** PDF (~510 pages)
- Level: Beginner to undergraduate
- Best for: Quick reference when a concept needs a slower, more discursive explanation than Riehl provides. Smith's notes have been extensively revised and expanded

### Online Courses

**MIT OCW 18.S097 -- Applied Category Theory (IAP 2019)**
- URL: https://ocw.mit.edu/courses/18-s097-applied-category-theory-january-iap-2019/
- Instructors: David Spivak, Brendan Fong
- Availability: **Free** (lecture videos, problem sets, readings)
- Best for: Module 5 (day 29). Companion to *Seven Sketches*. The applied perspective motivates abstract definitions with concrete modeling problems

**MIT OCW 18.S996 -- Category Theory for Scientists (Spring 2013)**
- URL: https://ocw.mit.edu/courses/18-s996-category-theory-for-scientists-spring-2013/
- Instructor: David Spivak
- Availability: **Free** (lecture notes, assignments)
- Best for: Alternative applied perspective; databases and ontologies via categories

**MIT OCW 18.726 -- Algebraic Geometry (Spring 2009), Category Theory Module**
- URL: https://ocw.mit.edu/courses/18-726-algebraic-geometry-spring-2009/resources/mit18_726s09_lec02_categories/
- Availability: **Free** (lecture notes)
- Best for: Days 7-11, 25-26. Concise treatment of categories, functors, Yoneda lemma, adjoint functors in a geometric context

---

## 2. Videos

### Full Lecture Series

**Bartosz Milewski -- Category Theory for Programmers**
- URL: https://www.youtube.com/playlist?list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_
- Format: ~70 videos across 3 seasons, 45-90 min each
- Availability: **Free**
- Best for: The complete intermediate journey. Season I covers categories through Yoneda (modules 1-3). Season II covers adjunctions, free/forgetful, monads, Kan extensions (modules 4-5). Season III covers F-algebras, lenses, and toposes
- Note: The most popular video introduction to category theory. Programming angle (Haskell/C++) makes abstract ideas concrete. Companion blog at https://bartoszmilewski.com/

**The Catsters (Eugenia Cheng, Simon Willerton)**
- URL: https://www.youtube.com/playlist?list=PLlGXNwjYhXYxKVa67r0pKuYufECy713bv
- Viewing guide: https://byorgey.wordpress.com/catsters-guide-2/
- Format: Short focused videos (5-15 min each) on individual topics
- Availability: **Free**
- Best for: Targeted review. Recommended episodes by module:
  - Module 2 (days 7-12): "Natural Transformations" series
  - Module 3 (days 13-19): "Limits" series, "Representable Functors"
  - Module 4 (days 20-24): "Adjunctions" series (particularly clear)
  - Module 5 (days 27-28): "Monads" series, "String Diagrams"
  - Monoidal categories: "Monoidal Categories" series (supplementary)

**MIT Applied Category Theory Lectures (Spivak, Fong)**
- URL: https://ocw.mit.edu/courses/18-s097-applied-category-theory-january-iap-2019/pages/lecture-videos-and-readings/
- Format: Full semester of recorded lectures
- Availability: **Free**
- Best for: Module 5 (day 29). Applied perspective on monoidal categories, enriched categories, toposes

### Standalone Introductions

**"A Sensible Introduction to Category Theory"**
- URL: https://www.youtube.com/watch?v=yAi3XWCBkDo
- Availability: **Free**
- Best for: Day 1 warm-up. Good for recalibrating intuitions before the intermediate course begins

**"A Crash Course in Category Theory" -- Bartosz Milewski**
- URL: https://www.youtube.com/watch?v=JH_Ou17_zyU
- Availability: **Free**
- Best for: Rapid review of foundations (days 1-6). Useful if the student wants a compact refresher before module 2

---

## 3. Interactive Tools

**quiver -- Commutative Diagram Editor**
- URL: https://q.uiver.app/
- Availability: **Free**, browser-based. Exports to LaTeX (tikz-cd)
- Best for: All modules. Drawing diagrams is essential for building intuition about morphisms, functors, natural transformations, and universal properties. Should be used from day 1 onward for every exercise that involves a commutative diagram or universal property argument

**homotopy.io -- Higher Category Theory Proof Assistant**
- URL: https://homotopy.io
- GitHub: https://github.com/homotopy-io
- Paper: https://arxiv.org/abs/2402.13179
- Availability: **Free**, browser-based (Rust/WebAssembly). Open source
- Best for: Module 5 and beyond. Point-and-click string diagram and surface diagram composition. Excellent for visualizing monoidal categories, natural transformations as 2-cells, and higher-categorical structures

**Category Theory Illustrated** -- Boris Marinov
- URL: https://abuseofnotation.github.io/category-theory-illustrated/
- Availability: **Free** online book (Creative Commons)
- Best for: Modules 1-3. Visually-driven exposition with extensive diagrams. Good supplement when the student needs spatial/visual reinforcement of a concept

**nLab**
- URL: https://ncatlab.org/nlab/show/category+theory
- Availability: **Free** wiki
- Best for: All modules as a reference. The most comprehensive online reference for category theory and higher category theory. Every concept has a page with precise definitions, examples, cross-links, and research-level context. Use for looking up definitions, exploring connections, and following threads into advanced territory

**Haskell Playground**
- URL: https://play.haskell.org/
- Availability: **Free**, browser-based
- Best for: Modules 2, 4, 5. Haskell's type system directly encodes categorical structure: types are objects, functions are morphisms, type constructors are functors, polymorphic functions are natural transformations, Monad is a monad. Write and test code to verify categorical intuitions
- Suggested exercises:
  - Day 7-8: Implement Functor instances, verify functor laws
  - Day 9-10: Explore polymorphic functions as natural transformations
  - Day 27-28: Build monadic pipelines (Maybe, List, IO), verify monad laws

**Lean 4 / Mathlib -- CategoryTheory**
- URL: https://github.com/leanprover-community/mathlib4/tree/master/Mathlib/CategoryTheory
- Availability: **Free**, open source
- Best for: Modules 3-5. Formalized definitions of categories, functors, natural transformations, limits, adjunctions, abelian categories, sheaves. Valuable for verifying proofs and understanding the precise logical structure of categorical constructions. Recommended for students interested in formalization

**CatViz -- Category Theory Visualization**
- URL: https://github.com/gmramella/CatViz
- Availability: **Free**, open source
- Best for: Modules 1-2. Visualization tool for basic category theory constructions

---

## 4. Code

**milewski-ctfp-pdf**
- URL: https://github.com/hmemcpy/milewski-ctfp-pdf
- Language: Haskell, Scala, OCaml
- Availability: **Free** (CC-BY-SA-4.0)
- Best for: All modules. Running category theory examples in your language of choice. Each chapter includes code that makes the categorical abstraction executable

**Mathlib4 CategoryTheory**
- URL: https://github.com/leanprover-community/mathlib4/tree/master/Mathlib/CategoryTheory
- Language: Lean 4
- Availability: **Free**, open source
- Best for: Modules 3-5. Formalized category theory: categories, functors, limits, adjunctions, abelian categories, sheaves. Seeing rigorous machine-checked definitions; understanding how categorical abstractions compose

**Catlab.jl**
- URL: https://github.com/AlgebraicJulia/Catlab.jl
- Language: Julia
- Availability: **Free**, open source
- Best for: Module 5 (applied CT), days 13-19 (limits/colimits). Applied category theory library with categories, functors, limits/colimits, operads, string diagrams, and functorial data migration. The best tool for computational category theory and visualizing string diagrams programmatically

**Haskell `base` library (Control.Category, Data.Functor, Control.Monad)**
- URL: https://hackage.haskell.org/package/base
- Language: Haskell
- Availability: **Free**
- Best for: Modules 2 and 5. Category, Functor, Applicative, Monad typeclasses are direct category theory. Hands-on monads, functors, natural transformations via programming

**cats (Scala)**
- URL: https://github.com/typelevel/cats
- Language: Scala
- Availability: **Free**, open source
- Best for: Programmers who prefer Scala. Good documentation connecting library design to category theory. Encodes Functor, Monad, Applicative, Arrow, Profunctor

**WildCats (Mathematica)**
- Platform: Wolfram Mathematica
- Availability: Requires Mathematica license (**Paid**)
- Best for: Modules 1-3. Mathematica package for manipulating objects, morphisms, commutative diagrams, functors, and natural transformations symbolically

---

## 5. People

### Educators and Textbook Authors

**Emily Riehl** (Johns Hopkins University)
- URL: https://math.jhu.edu/~eriehl/
- Area: Higher category theory, homotopy type theory
- Why follow: Author of *Category Theory in Context* (the recommended primary text) and *Categorical Homotopy Theory*. Her expository writing is exceptionally clear. Active in making category theory accessible to a broader audience

**Tom Leinster** (University of Edinburgh)
- Area: Category theory, higher categories, magnitude
- Why follow: Author of *Basic Category Theory*, the consensus best introductory textbook. His writing is concise and driven by the philosophy that universal properties should be the organizing principle

**Bartosz Milewski**
- URL: https://bartoszmilewski.com/
- Area: Category theory for programmers, functional programming
- Why follow: Created the most popular programming-oriented introduction (blog, book, 70+ video lectures). Bridges abstract mathematics and software engineering. His Haskell examples make categorical abstractions tangible

**Eugenia Cheng** (School of the Art Institute of Chicago)
- Area: Higher category theory, n-categories
- Why follow: Co-creator of The Catsters video series. Author of *The Joy of Abstraction* (2023, Cambridge UP) for general audiences. Strong on monoidal categories and higher-dimensional structures

### Active Researchers

**Jacob Lurie** (IAS Princeton)
- Area: Higher category theory, infinity-topoi
- Why follow: Author of *Higher Topos Theory* (2,332 citations), which reshaped algebraic topology and algebraic geometry using quasicategories. His work defines much of the frontier the student will encounter in module 5

**David Spivak** (Topos Institute)
- URL: https://topos.institute/
- Area: Applied category theory, polynomial functors, databases, dynamical systems
- Why follow: Pioneer in applied category theory. His work on functorial databases and polynomial functors shows category theory solving real engineering problems. Co-author of *Seven Sketches* and MIT applied CT instructor

**John Baez** (UC Riverside)
- URL: https://math.ucr.edu/home/baez/
- Area: Applied category theory, network theory, mathematical physics
- Why follow: Prolific writer connecting category theory to physics, chemistry, epidemiology, and electrical circuits. His blog "Azimuth" and legendary "This Week's Finds in Mathematical Physics" series make deep mathematics accessible

**Andre Joyal** (UQAM, Montreal)
- Area: Combinatorial species, quasi-categories, topos theory
- Why follow: Developed quasi-categories (Joyal's model for infinity-categories), combinatorial species (functors from finite sets and bijections -- connecting to the origami-mathematics combinatorics concepts the student already knows), and foundational contributions to topos theory

**Bob Coecke** (Quantinuum)
- Area: Categorical quantum mechanics, string diagrams
- Why follow: Pioneered diagrammatic approaches to quantum theory using monoidal categories. His ZX-calculus is a string-diagram calculus for quantum computation. Relevant for the student's module on monoidal categories (day 29)

### Bloggers and Communicators

**Tai-Danae Bradley** (SandboxAQ)
- URL: https://www.math3ma.com/
- Area: Applied category theory, quantum information, natural language processing
- Why follow: Her blog Math3ma offers some of the clearest intermediate expositions of categorical concepts. Posts on "What is a Functor?", "The Yoneda Lemma", and "What is Applied Category Theory?" are directly relevant to the curriculum
- Key posts for the course:
  - https://www.math3ma.com/blog/what-is-a-category (days 1-6)
  - https://www.math3ma.com/blog/what-is-a-functor (days 7-8)
  - https://www.math3ma.com/blog/what-is-a-natural-transformation (days 9-10)
  - https://www.math3ma.com/blog/the-yoneda-lemma (days 25-26)
  - https://www.math3ma.com/blog/limits-and-colimits-part-1 (days 13-18)

---

## 6. Unexpected Connections

### Category Theory and Optimal Transport
- Connection: The student already studied optimal transport. Lawvere's foundational 1973 insight showed that metric spaces are categories enriched over ([0,infinity], +, 0), directly reframing Wasserstein space as an enriched category. Kantorovich duality (primal transport plan vs. dual pricing) gives concrete, computational intuition for adjoint functors. Transport plans (couplings) are instances of spans in a category. The Giry monad formalizes probability measures as a monad on measurable spaces
- When to use: Day 20-24 (adjunctions: "Remember Kantorovich duality from OT? The primal and dual formulations are an adjunction"), day 27-28 (monads: "The Giry monad is the categorical foundation for the probability measures OT acts on"), day 29 (enriched categories: "Lawvere showed metric spaces ARE categories -- the Wasserstein space you already know is an enriched category")
- Resources: Lawvere, "Metric spaces, generalized logic, and closed categories" (1973); Riehl Ch 3 on enriched categories

### Category Theory and Origami Mathematics
- Connection: The student already studied origami mathematics. Wallpaper groups classifying origami tessellation symmetries are single-object categories with invertible morphisms (groupoids). The composition of folds as matrix products illustrates categorical composition. The Hull-Zakharevich proof that flat origami is Turing complete connects to cartesian closed categories via the Curry-Howard-Lambek correspondence. Crease patterns as planar graphs with mountain-valley assignments form a category where morphisms must respect fold structure -- a concrete example of structure-preserving maps
- When to use: Day 1-6 (categories: "The symmetry group of an origami tessellation is already a category -- a groupoid"), day 7-8 (functors: "The 'forgetful' map from a crease pattern to its underlying graph is a functor"), day 29 (CCC and Curry-Howard-Lambek: "Remember origami's Turing completeness? That's cartesian closed categories in disguise")

### Category Theory and Databases
- Connection: Functorial data migration -- a functor between database schemas induces a migration between database instances. Joins, queries, and schema evolution are categorical constructions. This is one of the most successful applications of category theory to engineering
- When to use: Days 7-8 (functors), days 13-18 (limits/colimits as joins and unions)
- Resources: Fong and Spivak, *Seven Sketches* (Ch 3); Spivak's MIT OCW course; Catlab.jl for implementation

### Category Theory and Quantum Computing
- Connection: Monoidal categories formalize quantum circuits: objects are qubit types, morphisms are quantum gates, tensor product is parallel composition, sequential composition is categorical composition. String diagrams provide a complete graphical calculus for quantum processes
- When to use: Day 29 (monoidal categories, applied CT)
- Resources: Bob Coecke and Aleks Kissinger, *Picturing Quantum Processes* (Cambridge UP, **paid**). Their ZX-calculus is a string diagram calculus for quantum computation

### Category Theory and Linguistics
- Connection: The DisCoCat (Distributional Compositional Categorical) model uses compact closed categories to combine distributional word meaning with grammatical structure. Pregroup grammars (Lambek) assign grammatical types that compose categorically. This connects algebra, category theory, and natural language processing
- When to use: Day 29 (applied CT, monoidal categories)
- Resources: Tai-Danae Bradley's thesis work; Coecke, Sadrzadeh, Clark, "Mathematical Foundations for a Compositional Distributional Model of Meaning" (2010)

### Category Theory and Type Theory (Curry-Howard-Lambek)
- Connection: The Curry-Howard-Lambek correspondence: propositions = types = objects; proofs = programs = morphisms; logical connectives = type constructors = categorical constructions (products, coproducts, exponentials). A cartesian closed category is precisely the categorical semantics of the simply typed lambda calculus. A topos extends this to higher-order logic
- When to use: Day 29 (CCC and toposes), days 27-28 (monads and computation)
- Resources: Awodey Ch 6-7; Lambek and Scott, *Introduction to Higher Order Categorical Logic* (1,544 citations); Riehl for the categorical side; any Haskell tutorial for the programming side

### Category Theory and Topology (via Toposes and Sheaves)
- Connection: A topos is a category that behaves like the category of sets but with a richer internal logic. Sheaf theory (from algebraic geometry) generalizes to Grothendieck toposes, connecting category theory to geometry and logic simultaneously. Sheaves over a topological space form a topos whose internal logic reflects the topology
- When to use: Day 29 (toposes preview)
- Resources: Mac Lane and Moerdijk, *Sheaves in Geometry and Logic* (Springer, **paid**, 1,124 citations); nLab topos articles

### Category Theory and Electrical Engineering
- Connection: Signal flow graphs are morphisms in a category; circuits compose categorically. Props (product and permutation categories) formalize circuit design. This gives a rigorous framework for modular circuit analysis
- When to use: Day 29 (applied CT, monoidal categories)
- Resources: Fong and Spivak, *Seven Sketches* (Ch 2); Baez's network theory series on the Azimuth blog

---

## 7. Supplementary References (Advanced Directions)

These resources extend beyond the 30-lesson curriculum. Include here for students who want to explore further from day 29's "frontiers" lesson.

### Higher Category Theory

**A Short Course on Infinity-Categories** -- Moritz Groth
- URL: https://arxiv.org/abs/1007.2925
- Availability: **Free** on arXiv
- Best for: First exposure to higher categories after completing the course

**Higher Topos Theory** -- Jacob Lurie
- URL: https://www.math.ias.edu/~lurie/papers/HTT.pdf
- Availability: **Free** PDF from the author (also published by Princeton UP)
- Best for: Research-level. The foundational reference for infinity-topoi and quasicategories

### Topos Theory

**Sheaves in Geometry and Logic** -- Saunders Mac Lane, Ieke Moerdijk
- Availability: **Paid** (~$70, Springer). 1,124 citations
- Best for: First systematic study of toposes after the day 29 introduction

**Sketches of an Elephant: A Topos Theory Compendium** -- Peter Johnstone
- Availability: **Paid** (Oxford UP). 901 citations
- Best for: Encyclopedic reference for serious topos theory

### Enriched Category Theory

**Basic Concepts of Enriched Category Theory** -- G.M. Kelly
- URL: http://www.tac.mta.ca/tac/reprints/articles/10/tr10abs.html
- Availability: **Free** (reprinted in Theory and Applications of Categories)
- Best for: Foundational treatment of enriched categories. Directly connects to Lawvere's characterization of metric spaces as enriched categories (relevant to the OT cross-connection)

### Homotopy Type Theory

**Homotopy Type Theory: Univalent Foundations of Mathematics**
- URL: https://homotopytype theory.org/book/
- Availability: **Free** (Creative Commons)
- Best for: The intersection of category theory, logic, and computer science via the Univalent Foundations program

### Categorical Algebra

**Locally Presentable and Accessible Categories** -- J. Adamek, J. Rosicky
- Availability: **Paid** (Cambridge UP). 1,184 citations
- Best for: Modern categorical algebra and connections to homotopy theory

**Handbook of Categorical Algebra** (3 volumes) -- Francis Borceux
- Availability: **Paid** (Cambridge UP). 1,027 citations
- Best for: Comprehensive reference covering basics through sheaf theory and topos theory

### Categorical Programming

**Category Theory for Programmers (formal treatment)** -- Ahrens and Wullaert
- URL: https://arxiv.org/abs/2209.01259
- Availability: **Free** on arXiv
- Best for: Connecting initial algebras, monads, and functional programming with formal precision

---

## 8. Community Resources

**nLab**
- URL: https://ncatlab.org/nlab/show/HomePage
- The definitive collaborative wiki for category theory and higher category theory. Use throughout the course for precise definitions, examples, and research-level context

**n-Category Cafe**
- URL: https://golem.ph.utexas.edu/category/
- Group blog by John Baez, Tom Leinster, David Corfield, and others. Research-level discussions made accessible. Good for following current developments and seeing how category theorists think

**MathOverflow -- category-theory tag**
- URL: https://mathoverflow.net/questions/tagged/category-theory
- Research-level Q&A. Useful when stuck on a specific proof or concept. Many answers by leading category theorists

**Math3ma Blog -- Category Theory Posts**
- URL: https://www.math3ma.com/categories/category-theory
- Tai-Danae Bradley's intermediate-level blog posts. Among the clearest expositions available for key concepts

**Logic Matters -- Category Theory Page**
- URL: https://logicmatters.net/categories/
- Peter Smith's curated guide to learning category theory, with reading recommendations organized by level

**Thomas Read -- Getting Started with Category Theory**
- URL: https://blog.thjread.com/posts/2020-03-09-getting-started-category-theory.html
- Well-organized guide to resources, sorted by background and goals

**GitHub Meta-List: Category Theory Resources**
- URL: https://github.com/prathyvsh/category-theory-resources
- Comprehensive curated list of books, courses, videos, and tools

---

## 9. Exercise and Problem Sources

**Riehl, *Category Theory in Context* -- End-of-chapter exercises**
- URL: https://emilyriehl.github.io/files/context.pdf
- The primary exercise source. Exercises range from routine verifications to challenging proofs. Solutions for selected exercises available online

**Leinster, *Basic Category Theory* -- Exercises**
- URL: https://arxiv.org/abs/1612.09375
- Complementary exercise set. Leinster's exercises tend to be more focused on universal-property arguments

**Aluffi, *Algebra: Chapter 0* -- Category-theoretic exercises**
- Availability: **Paid** (AMS)
- Algebra textbook that systematically uses category theory from the start. Excellent exercises that build categorical thinking within concrete algebraic settings (groups, rings, modules)

**Fong and Spivak, *Seven Sketches* -- Exercises**
- URL: https://arxiv.org/abs/1803.05316
- Applied exercises. Good for reinforcing categorical definitions through modeling problems

---

## 10. Module-to-Resource Mapping

| Module / Days | Primary Text | Video | Interactive Tool / Code | Blog / Supplement |
|---|---|---|---|---|
| **Module 1: The Language of Structure** (days 1-6) | Leinster Ch 1, Riehl Ch 1 | Milewski lectures 1-6 | quiver for diagrams; Category Theory Illustrated | Math3ma: "What is a Category?" |
| **Module 2: Maps Between Worlds** (days 7-12) | Riehl Ch 1, Milewski blog | Milewski lectures 7-10; Catsters "Natural Transformations" | Haskell Playground (Functor instances) | Math3ma: "What is a Functor?", "What is a Natural Transformation?" |
| **Module 3: The Art of Universal Construction** (days 13-19) | Riehl Ch 2-3, Leinster Ch 2-5 | Milewski lectures 11-15; Catsters "Limits" series | quiver for diagrams; Catlab.jl | Math3ma: "Limits and Colimits" |
| **Module 4: The Deep Symmetry of Adjunctions** (days 20-24) | Riehl Ch 4, Leinster Ch 6 | Milewski lectures 17-19; Catsters "Adjunctions" | nLab reference | OT connection: Kantorovich duality as adjunction |
| **Module 5: Yoneda, Monads, and the Frontier** (days 25-30) | Riehl Ch 2 (Yoneda), Ch 5 (Monads); Mac Lane Ch 10 (Kan ext.); Fong & Spivak (applied) | Milewski lectures 14-15 (Yoneda), 20-22 (Monads); Catsters "Monads" | Haskell Monad typeclass; Catlab.jl; homotopy.io | Math3ma: "The Yoneda Lemma"; Origami connection: CHL correspondence |

---

## 11. Foundational Papers

For the student who wants to read the primary literature alongside the textbooks.

| Paper | Year | Relevance | Access |
|---|---|---|---|
| Eilenberg & Mac Lane, "General Theory of Natural Equivalences" | 1945 | The founding paper. Introduces categories, functors, natural transformations. Read after day 10 for historical context | Semantic Scholar |
| Grothendieck, "Sur quelques points d'algebre homologique" (Tohoku paper) | 1957 | Introduced abelian categories. Background for understanding how category theory reshaped algebraic geometry | Semantic Scholar |
| Lawvere, "Functorial Semantics of Algebraic Theories" | 1963 | Lawvere theories: universal algebra in purely categorical terms. Read after day 24 (adjunctions) | Semantic Scholar |
| Moggi, "Notions of Computation and Monads" | 1991 | The paper that introduced monadic semantics for computation. Read after day 28 (monads) | Semantic Scholar |
| Lawvere, "Metric spaces, generalized logic, and closed categories" | 1973 | Metric spaces as enriched categories. Direct bridge to the student's optimal transport background | Reprints in TAC |

---

## 12. Reading Order Recommendation

### Phase 1: Review and Calibration (days 1-6)
- Skim Leinster Ch 1 and Riehl Ch 1 side by side
- Watch Milewski lectures 1-3 for the programming perspective
- Draw every diagram in quiver
- Read Math3ma "What is a Category?" for a third voice

### Phase 2: Functors and Naturality (days 7-12)
- Riehl Ch 1 (second half) as primary
- Milewski lectures 7-10 as video companion
- Haskell Playground: implement Functor instances, write polymorphic functions (natural transformations)
- Catsters "Natural Transformations" for targeted review

### Phase 3: Universal Constructions (days 13-19)
- Riehl Ch 2-3 as primary
- Leinster Ch 2-5 for the universal-property-first perspective
- Draw every limit and colimit diagram in quiver
- Catlab.jl: compute limits and colimits programmatically

### Phase 4: Adjunctions (days 20-24)
- Riehl Ch 4 as primary
- Leinster Ch 6 for a concise parallel treatment
- Milewski lectures 17-19 for free/forgetful examples
- Cross-reference: Kantorovich duality from OT as an adjunction

### Phase 5: Yoneda, Monads, Frontiers (days 25-30)
- Riehl Ch 2 (Yoneda section) and Ch 5 (Monads) as primary
- Milewski lectures 14-15 (Yoneda) and 20-22 (Monads)
- Haskell: build monadic pipelines, verify monad laws
- Day 29: Fong & Spivak selected chapters; homotopy.io for string diagrams
- Day 30: nLab exploration of advanced topics matching the student's interests
