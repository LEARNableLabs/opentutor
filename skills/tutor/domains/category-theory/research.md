# Category Theory — Research Summary

## Major Subtopics

1. **Foundations** — Categories, objects, morphisms, composition, identity. Examples from mathematics (Set, Grp, Top) and programming (types as objects, functions as morphisms).

2. **Functors** — Structure-preserving maps between categories. Forgetful functors, free functors, hom functors. Functoriality as a design pattern in programming.

3. **Natural Transformations** — Morphisms between functors. Components, naturality squares, the "functors form a category" insight.

4. **Universal Constructions** — Products, coproducts, limits, colimits. Universal properties as optimization problems. Initial and terminal objects.

5. **Yoneda Lemma** — Embedding theorem, representable functors, the "object is determined by maps into it" philosophy. Deep abstraction but central to modern category theory.

6. **Adjunctions** — Free-forgetful adjunctions, galois connections, units and counits. "Adjunctions are everywhere" — most important concept after basic definitions.

7. **Monads** — Composition of adjunctions, Kleisli categories, monads in programming (Maybe, List, State). Strong connection to computational effects.

8. **Applications** — Functional programming (Haskell, Scala), database schema design, physics (topological quantum field theory), logic (categorical semantics).

## Key Sources

### Textbooks
- **Emily Riehl, Category Theory in Context** (Dover 2017) — Intermediate level, assumes mathematical maturity. Free PDF available.
- **Steve Awodey, Category Theory** (Oxford Logic Guides) — Standard intermediate text, balances abstraction with examples.
- **Saunders Mac Lane, Categories for the Working Mathematician** (Springer) — Classic reference, more advanced but authoritative.
- **Tom Leinster, Basic Category Theory** (Cambridge 2014) — Gentler introduction, good for building intuition.
- **Brendan Fong & David Spivak, Seven Sketches in Compositionality** (Cambridge 2019) — Applied focus, accessible examples from real-world systems.

### Courses
- **MIT OCW: Applied Category Theory** (18.S097) — Lecture videos, problem sets. Uses Fong & Spivak textbook.
- **Emily Riehl: Category Theory in Context** (JHU MATH 727) — Syllabus and notes available at https://math.jhu.edu/~eriehl/727/syllabus.pdf
- **Carnegie Mellon 80-413/713** — Computational focus, connects to type theory and programming.
- **Oxford C2.7 Category Theory** — Graduate-level course, extensive notes.

### Video Lectures
- **Bartosz Milewski's Category Theory for Programmers** — YouTube series, 20+ videos. Excellent for programmers, grounds abstract concepts in code.
- **MIT OCW Applied Category Theory videos** — Structured course with problem sets.
- **The Catsters** — Classic YouTube series, bite-sized conceptual explanations.

### Interactive Tools
- **Globular.science** — Visual proof assistant for higher category theory (Jamie Vicary).
- **Homotopy.io** — Interactive diagram builder for category theory proofs.
- **Computational Category Theory in Standard ML** — Hands-on REPL for exploring categorical concepts through code.

### Community Resources
- **nLab** (https://ncatlab.org/) — Comprehensive wiki, invaluable for definitions and deep dives.
- **GitHub: category-theory-resources** (prathyvsh) — Curated list of books, papers, videos, tools.
- **GitHub: awesome-category-theory** (madnight) — Another curated collection spanning all levels.

## Available Resources by Type

- **Textbooks with exercises**: Riehl (Context), Awodey, Leinster, Barr & Wells (solutions included)
- **Video courses**: MIT OCW, Bartosz Milewski, The Catsters, NYC Category Theory Seminar (80+ talks)
- **Interactive/computational**: Globular, Homotopy.io, Standard ML exercises
- **Applied perspectives**: Fong & Spivak (systems/databases), Milewski (programming), Spivak (data science)

## Notes for Intermediate Level

Students at this level typically have:
- **Prerequisites**: Solid background in abstract algebra (groups, rings), some topology, comfort with formal definitions and proofs
- **Goals**: Understand core abstractions (functors, natural transformations, Yoneda, adjunctions), apply to their field (math, CS, physics)
- **Challenges**: High abstraction, need concrete examples to ground intuition. Balance formalism with applications.

Best approach: Start with familiar categories (Set, Grp, programming examples), build to functors and natural transformations with plenty of examples, then tackle universal properties and adjunctions. Yoneda and monads are the peaks. End with applications to show payoff.
