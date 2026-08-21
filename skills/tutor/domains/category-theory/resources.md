# Category Theory — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Emily Riehl, _Category Theory in Context_** (Dover, 2017) — Ideal for intermediate level. Assumes mathematical maturity, balances abstraction with examples, covers functors through Kan extensions. Free PDF available at author's website. Excellent problem sets.

- **Steve Awodey, _Category Theory_** (Oxford Logic Guides, 2010) — Standard intermediate text. Clear exposition, good examples from logic and type theory. Covers categories through topoi. Well-suited for students with computer science background.

- **Tom Leinster, _Basic Category Theory_** (Cambridge, 2014) — Gentler than Riehl or Awodey but still rigorous. Good for building intuition. Covers categories through adjunctions. Free PDF: https://arxiv.org/pdf/1612.09375

- **Brendan Fong & David Spivak, _Seven Sketches in Compositionality: An Invitation to Applied Category Theory_** (Cambridge, 2019) — Applied focus, excellent for seeing category theory in action. Covers databases, signal flow graphs, and collaborative design. Free on arXiv. Great supplement for real-world lessons.

- **Saunders Mac Lane, _Categories for the Working Mathematician_** (Springer, 1971) — The classic reference. More advanced, dense, authoritative. Use for looking up precise definitions and deep results, not as primary learning text.

- **Michael Barr & Charles Wells, _Category Theory for Computing Science_** (3rd edition) — Computational perspective, good for programmers. Includes solutions to all exercises. Free PDF: https://www.math.mcgill.ca/triples/Barr-Wells-ctcs.pdf

### Courses

- **MIT OCW: Applied Category Theory** (18.S097, 2019) — Lecture videos, problem sets, based on Fong & Spivak textbook. Excellent resource for visual learners. URL: https://ocw.mit.edu/courses/18-s097-applied-category-theory-january-iap-2019/

- **Emily Riehl: Category Theory in Context** (JHU MATH 727) — Syllabus and detailed notes available. Follows Riehl's textbook. URL: https://math.jhu.edu/~eriehl/727/syllabus.pdf

- **MIT OCW: Category Theory for Scientists** (18.S996, 2013) — Earlier applied course by David Spivak. Different approach, worth comparing with 18.S097. URL: https://ocw.mit.edu/courses/18-s996-category-theory-for-scientists-spring-2013/

- **Carnegie Mellon 80-413/713** — Computational category theory, connects to type theory and programming languages. URL: https://www.andrew.cmu.edu/course/80-413-713/

- **Oxford C2.7 Category Theory** — Graduate-level course with extensive notes. Advanced but comprehensive. URL: https://courses.maths.ox.ac.uk/course/view.php?id=5580

## Supplementary (for engagement)

### Videos

- **Bartosz Milewski, _Category Theory for Programmers_** — YouTube series, 20+ videos. Best resource for programmers learning category theory. Grounds abstract concepts in Haskell code, covers categories through Kan extensions. Engaging presentation style. Start here: https://www.youtube.com/watch?v=JpdRchyVtvk

- **The Catsters** — Classic YouTube series by Eugenia Cheng and Simon Willerton. Bite-sized conceptual explanations (10-15 min each). Great for building intuition. Search "The Catsters" on YouTube.

- **MIT OCW Lecture Videos** — Full course lectures for Applied Category Theory (18.S097). Visual and example-rich. URL: https://ocw.mit.edu/courses/18-s097-applied-category-theory-january-iap-2019/pages/lecture-videos-and-readings/

- **NYC Category Theory Seminar** — Over 80 videos of talks at various levels. Not introductory, but good for seeing cutting-edge research and applications.

### Interactive Tools

- **Globular.science** — Visual proof assistant for higher category theory by Jamie Vicary. Build and verify commutative diagrams interactively. Excellent for understanding naturality and coherence. URL: http://globular.science

- **Homotopy.io** — Interactive diagram builder for category theory proofs. Drag-and-drop interface for constructing and verifying diagrams. URL: https://homotopy.io

- **Computational Category Theory in Standard ML** — Hands-on programming exercises to explore categorical concepts. REPL for interacting with category theory ideas through code.

- **Proof assistants** — Coq, Agda, and Lean have extensive category theory libraries. For advanced students interested in formalization.

### Articles and Blog Posts

- **Bartosz Milewski's blog** — Deep dives into category theory for programmers. Written versions of his video series plus additional topics. URL: https://bartoszmilewski.com/

- **Thomas Read, "Getting started with category theory"** — Accessible introduction with practical advice for learners. URL: https://blog.thjread.com/posts/2020-03-09-getting-started-category-theory.html

- **The n-Category Café** — Blog by John Baez, David Corfield, and others. Advanced discussions of category theory research. Good for seeing the frontier.

- **Tai-Danae Bradley, "What is Applied Category Theory?"** — Gentle introduction to applications in science and engineering. Accessible to broad audience.

### Code

- **Haskell** — Functional programming language with deep category theory foundations. Type classes for Functor, Monad, etc. Learn category theory through code.

- **Scala Cats** — Category theory library for Scala. Functors, monads, and other abstractions as programming tools. URL: https://typelevel.org/cats/

- **Category Theory in Coq** — Formalized category theory in the Coq proof assistant. For students interested in foundations and formal verification.

- **GitHub: category-theory-resources** — Curated list by prathyvsh with books, papers, videos, and software. Comprehensive resource directory. URL: https://github.com/prathyvsh/category-theory-resources

- **GitHub: awesome-category-theory** — Another curated list by madnight. Includes tools, libraries, and tutorials across languages. URL: https://github.com/madnight/awesome-category-theory

## People (to look up)

### Historical Figures
- **Saunders Mac Lane** — Co-founder of category theory (with Samuel Eilenberg). _Categories for the Working Mathematician_ is the bible.
- **Samuel Eilenberg** — Co-founder, contributions to algebraic topology and homological algebra.
- **Alexander Grothendieck** — Revolutionized algebraic geometry using category theory. Invented topos theory.

### Contemporary Researchers & Educators
- **Emily Riehl** — Johns Hopkins professor, author of _Category Theory in Context_. Research in higher category theory, accessible writer.
- **Bartosz Milewski** — Programmer and educator, author of _Category Theory for Programmers_. Bridges math and CS beautifully.
- **David Spivak** — MIT researcher, author of _Seven Sketches_. Focus on applied category theory (databases, systems).
- **Eugenia Cheng** — Mathematician and popularizer, co-creator of The Catsters. Author of _The Art of Logic_ and other accessible books.
- **Steve Awodey** — Carnegie Mellon professor, author of standard textbook. Expertise in categorical logic and type theory.
- **Tom Leinster** — Edinburgh professor, author of _Basic Category Theory_. Clear expositor, active blogger.
- **John Baez** — UC Riverside professor, blogger at n-Category Café. Connections to physics and higher categories.
- **Brendan Fong** — Researcher in applied category theory. Co-author of _Seven Sketches_.

## Unexpected Connections

- **Topological Quantum Field Theory (TQFT)** — Uses category theory (monoidal categories, functors) to model quantum systems. Deep connection between geometry and algebra.

- **Database Schema Design** — Category theory (sketches, presheaves) provides a rigorous foundation for databases. See Spivak's work.

- **Type Theory and Programming Languages** — The Curry-Howard-Lambek correspondence: logic = computation = category theory. Propositions are types, proofs are programs.

- **Homotopy Type Theory (HoTT)** — Unifies category theory, topology, and logic. ∞-categories model "spaces up to homotopy." Cutting-edge foundations.

- **Gauge Theory in Physics** — Fiber bundles, connections, and gauge transformations are categorical constructs. Category theory as the language of modern physics.

- **Linguistics** — Pregroup grammars and categorical compositional distributional semantics use category theory for natural language processing.

- **Control Theory and Signal Processing** — Signal flow graphs, feedback loops, and controllers modeled categorically (see Fong & Spivak).

- **Music Theory** — Transformational music theory uses category theory to model chord progressions and musical structure. Guerino Mazzola's work.

## Reference Resources

- **nLab** — Comprehensive wiki for category theory, higher category theory, and related mathematics. Invaluable for definitions and deep dives but not a learning resource. URL: https://ncatlab.org/

- **MathOverflow and Math StackExchange** — Q&A sites with extensive category theory discussions. Search before asking; most questions already answered.

- **Category Theory Zulip** — Active chat community for category theory discussion. Friendly to learners and researchers. URL: https://categorytheory.zulipchat.com/

- **Logic Matters** — Peter Smith's curated list of category theory resources, including freely available lecture notes. URL: https://logicmatters.net/categories/

- **arXiv.org** — Preprint server with extensive category theory papers. Use for accessing textbooks (Leinster, Fong & Spivak) and research. Search "category theory" in math.CT.

## Recommended Learning Path

1. **Start with**: Leinster's _Basic Category Theory_ (chapters 1-4) or Bartosz Milewski's videos (first 10)
2. **Core text**: Riehl's _Category Theory in Context_ (read alongside lessons)
3. **Applied perspective**: Fong & Spivak's _Seven Sketches_ (for real-world lessons)
4. **Depth**: Awodey's _Category Theory_ or Mac Lane (after mastering basics)
5. **Programming connection**: Bartosz Milewski's _Category Theory for Programmers_ (book or video series)
6. **Interactive practice**: Globular.science or Homotopy.io for diagram chasing
7. **Community**: Join Category Theory Zulip for questions and discussion

## Tools for Different Learning Styles

- **Visual learners**: MIT OCW videos, The Catsters, Globular.science, commutative diagrams
- **Algebraic thinkers**: Riehl or Awodey textbooks, focus on proofs and universal properties
- **Programmers**: Bartosz Milewski's series, Haskell Cats library, computational category theory
- **Applied/pragmatic**: Fong & Spivak's _Seven Sketches_, database examples, physics applications
- **Formalists**: Coq or Agda libraries, proof assistant formalization, nLab definitions

## Notes on Resource Quality

- **Free PDFs**: Leinster, Fong & Spivak, Barr & Wells all available free. No paywall for quality category theory resources.
- **Video quality**: Bartosz Milewski > MIT OCW > The Catsters (in terms of production, but all excellent content)
- **Interactive tools**: Still experimental but improving. Globular and Homotopy.io are actively developed.
- **nLab warning**: Infinitely deep, can be overwhelming. Use for reference, not first learning.
- **Prerequisite check**: If student struggles with abstract algebra or proofs, recommend building that foundation first.

## Resource Maintenance

Resources current as of August 2026. Check for:
- New editions of textbooks (Riehl, Awodey updated periodically)
- Additional MIT OCW courses (they add new ones regularly)
- Emerging interactive tools (this is an active development area)
- New applied category theory papers (arXiv.org category math.CT)
