# Knot Theory — Teaching Notes

## Approach

Knot theory is uniquely **visual and tactile** — exploit this. Start every lesson with a diagram or physical manipulation. At the intermediate level, balance concrete computation (polynomials, diagrams) with algebraic abstraction (groups, matrices). Move from combinatorial thinking (coloring, counting) to algebraic thinking (groups, polynomials) to topological thinking (complements, surfaces). The beauty of knot theory is that it connects all these modes — leverage crossover moments to deepen understanding.

Students at this level should **compute first, then prove**. Give them specific knots (trefoil, figure-eight, torus knots) to work with before general theory. Physical intuition comes from diagrams and software (KnotPlot), formal understanding from calculation.

## Common Misconceptions

1. **"A knot is a diagram"** — Students confuse the projection (diagram) with the object (embedded circle). Emphasize that one knot has infinitely many diagrams. Use Reidemeister moves to show different diagrams can represent the same knot.

2. **"If two knots have the same polynomial, they're the same knot"** — Most polynomial invariants are not complete. Show explicit examples of distinct knots with identical Jones or Alexander polynomials (mutant knots). Drive home: invariants can prove knots are *different*, but not always that they're the *same*.

3. **"The unknotting number is the minimum crossings in any diagram"** — Students confuse *crossing number* (minimum crossings in any diagram) with *unknotting number* (minimum crossing changes to unknot). Show that some diagrams of the unknot have many crossings.

4. **"Reidemeister moves preserve everything"** — They preserve the *knot* but not all *diagram properties* (like number of crossings). Students need to distinguish knot invariants from diagram properties.

5. **"You can always 'see' if two knots are the same"** — Knot equivalence is algorithmically undecidable in general. Even with Reidemeister moves, there's no bound on how many moves you need. This is why we need invariants.

6. **"The knot group determines everything"** — While the fundamental group of the complement is powerful (Gordon-Luecke: determines the knot up to mirroring), it's very hard to compute and compare. Polynomial invariants are weaker but practical.

7. **"Seifert surfaces are unique"** — Every knot has infinitely many Seifert surfaces. The genus (minimum genus among all Seifert surfaces) is the invariant, not any particular surface.

8. **"Surgery is like cutting the knot"** — Dehn surgery removes a *tubular neighborhood* of the knot, not the knot itself. Students visualize cutting the string rather than removing a solid torus.

9. **"All knots are hyperbolic"** — Only non-torus, non-satellite knots have hyperbolic complements. Torus knots and satellite knots are geometric exceptions.

10. **"Khovanov homology is just a fancy Jones polynomial"** — Categorification adds structure: Khovanov homology is a bigraded homology theory whose Euler characteristic is the Jones polynomial. It detects more (e.g., distinguishes some mutants).

## Level Adjustments

### For Intermediate (this level)
- **Assume:** group theory basics, point-set topology, linear algebra comfort
- **Emphasize:** computation and examples before abstraction. Work with small knot tables (trefoil, figure-eight, 5₁, 5₂). Calculate polynomials by hand for simple knots.
- **Depth:** Full proofs for foundational results (Reidemeister theorem, existence of Seifert surface). Sketches for harder results (Jones polynomial properties, hyperbolic geometry).
- **Skip:** Heavy homological algebra (Khovanov details), quantum group theory, TQFT formalism. Present these as "where this goes" but don't derive.

### Compared to Beginner
- Beginner: focus on visualization, knot tables, basic invariants (crossing number, tricolorability). Avoid heavy algebra.
- Intermediate: add polynomial invariants, algebraic topology, proof techniques. Expect facility with abstraction.

### Compared to Advanced
- Advanced: full homological machinery, quantum invariants from representation theory, TQFT construction, Floer homology. Intermediate students get the "what" and "how to compute"; advanced students get the "why it's constructed this way."

## Rabbit Holes (when to drop them in)

- **Lord Kelvin's vortex atoms** (Lesson 1) — historical motivation: 19th century physicists thought atoms were knotted vortices in the ether. Classification of knots = periodic table! Beautiful dead end that launched the field.

- **DNA topology** (Lesson 4, connected sum) — DNA knots and links appear in molecular biology. Topoisomerases unknot DNA. Real-world application students can visualize.

- **Jones polynomial from statistical mechanics** (Lesson 10) — Jones discovered his polynomial via von Neumann algebras, but it has equivalent formulation via Potts model partition function. Connects topology to physics.

- **Volume conjecture** (Lesson 22, hyperbolic geometry) — conjectures that certain limit of colored Jones polynomial gives hyperbolic volume. Deep connection between quantum and geometric invariants. Still open!

- **Knot Floer homology** (Lesson 23, after Khovanov) — another categorification, developed by Ozsváth-Szabó. Different flavor than Khovanov, connects to Heegaard Floer for 3-manifolds.

- **Computational complexity** (Lesson 24) — computing Jones polynomial is #P-hard. Computing if a knot is the unknot is in NP, but unknown if in P. Deep CS connections.

## Difficulty Progression

**Gentle start (Lessons 1-4):** Build intuition with diagrams, Reidemeister moves, operations. Visual and accessible. Difficulty 2-3.

**First climb (Lessons 5-9):** Combinatorial invariants require careful tracking but no heavy machinery. Braid theory (Lesson 8) is first difficulty 4 — algebraic structure of braids is subtle. Review at Lesson 9.

**Polynomial peak (Lessons 10-15):** Jones polynomial (Lesson 10) is conceptually hard — difficulty 4. Students need to internalize skein relations and Kauffman bracket. Lesson 13 (finding mutants) is difficulty 4 — requires deep understanding of invariant limitations. Review at Lesson 15.

**Algebraic climb (Lessons 16-20):** Shift to algebraic topology. Knot group (Lesson 16) and Seifert matrix (Lessons 17-18) are difficulty 4. Lesson 19 (connecting Seifert matrix to Alexander polynomial) is peak difficulty 5 — requires facility with both computational and algebraic thinking. Review at Lesson 20.

**Advanced topics (Lessons 21-25):** Surgery and hyperbolic geometry (21-22) are difficulty 4-5. Khovanov (Lesson 23) is difficulty 5 but treated as resource-drop — exposure, not mastery. Final lessons ease off to difficulty 3 (open problems survey) and 2 (final review).

## Pacing Notes

- **Week 1 (Lessons 1-5):** Foundations and first invariant. Build confidence with diagrams.
- **Week 2 (Lessons 6-10):** Combinatorial invariants → polynomial invariants. Jones polynomial is the capstone.
- **Week 3 (Lessons 11-15):** Polynomial computation practice. Review solidifies before shift to algebra.
- **Week 4 (Lessons 16-20):** Algebraic topology. Hardest material — expect slower pace. Review essential.
- **Week 5 (Lessons 21-25):** Advanced topics as survey. Less depth, more breadth. Final review ties it together.

25 lessons = 5 weeks at 5 lessons/week, but adjust based on student pace. Can condense advanced topics or expand polynomial section depending on interest.
