# Measure Theory and Integration — Resources

## Primary Sources (for lesson content)

- **"Measure, Integration & Real Analysis" by Sheldon Axler (2020)** — Modern, open-access textbook with excellent exposition. Perfect for self-study at intermediate level. Covers sigma-algebras through Lp spaces. Highly recommended as primary text.
  - https://open.umn.edu/opentextbooks/textbooks/measure-integration-real-analysis
  - Chapters 1-5 for measure theory and Lebesgue integration; Chapters 6-10 for function spaces

- **"Measure and Integration" by Dietmar A. Salamon (2020)** — Concise, rigorous, graduate-level notes. Excellent for students who want minimal fluff and maximal precision. Covers construction of Lebesgue measure, integration, product measures, Lp spaces.
  - https://people.math.ethz.ch/~salamon/PREPRINTS/measure.pdf

- **"Real Analysis: Measure Theory, Integration, and Hilbert Spaces" by Stein and Shakarchi (2005)** — Volume III of Princeton Lectures in Analysis. Beautiful balance of rigor, intuition, and applications. Classic graduate textbook.
  - https://www.cmat.edu.uy/~mordecki/courses/medida2013/book.pdf

- **"Measure Theory" by Lance Miller (Rice University)** — Course notes with clear proofs and good organization. Useful as supplementary reference.
  - https://www.stat.rice.edu/~dobelman/courses/texts/qualify/Measure.Theory.Miller.pdf

## Course Materials (structured syllabi and problem sets)

- **MIT OpenCourseWare 18.125: Measure and Integration** — Graduate-level course with detailed lecture notes (prepared by Ethan Brown from Prof. Viaclovsky's handwritten notes). Includes problem sets.
  - https://ocw.mit.edu/courses/18-125-measure-and-integration-fall-2003/
  - Lecture notes: https://ocw.mit.edu/courses/18-125-measure-and-integration-fall-2003/pages/lecture-notes/

- **CMU Math 720: Measure Theory and Integration** — Typed notes by Gautam Iyer, very clean presentation. Good for students who want a different perspective on standard material.
  - https://www.math.cmu.edu/~gautam/sj/teaching/2020-21/720-measure/

- **Leeds MA40042: Measure Theory and Integration** — Course by Matthew Aldridge with online notes. Well-organized, accessible.
  - https://mpaldridge.github.io/teaching/ma40042/

- **UC Davis MAT 206: Measure Theory** — Graduate syllabus, useful for pacing and topic sequencing.
  - https://www.math.ucdavis.edu/courses/syllabus_detail?cm_id=124

- **McGill Measure Theory Course** — Recent notes by Asger Törnquist with ergodic theory connections.
  - https://www.math.mcgill.ca/atserunyan/Courses/2025_S.Yerevan.MeasureTheory/

- **Cornell Measure Theory** — Jim Belk's course notes, readable and example-rich.
  - https://e.math.cornell.edu/people/belk/measuretheory/

## Videos (for visual learners)

- **Open University/BBC: Lebesgue Integration** — 8 videos × 25 minutes, presented by Allan Solomon and Ian Dey. "Absolutely superb" according to recommendations. Excellent visual intuition for Lebesgue integration.
  - Compiled at: https://www.celsiuselements.com/math/measure-theory-video-lectures/

- **Magnus Carlsson (Lund University): Integration Theory** — Video lecture series supporting Lund's integration theory course. Comprehensive and well-paced.
  - Available via compilation: https://www.celsiuselements.com/math/measure-theory-video-lectures/

- **Emanuel Carneiro (ICTP): Real Analysis** — Taught at International Center for Theoretical Physics, Trieste. Advanced, rigorous treatment.
  - Available via compilation: https://www.celsiuselements.com/math/measure-theory-video-lectures/

- **Measure Theory Video Lecture Compilation** — Curated list of best free YouTube courses on measure theory and integration theory for advanced students.
  - https://www.celsiuselements.com/math/measure-theory-video-lectures/

## Online Courses (interactive and structured)

- **IMSC Measure Theory (SWAYAM)** — Free online course from Institute of Mathematical Sciences. Develops fundamental tools for integration and measuring objects.
  - https://www.classcentral.com/course/swayam-measure-theory-imsc-43635

- **Class Central: Measure Theory Courses** — Aggregator of 200+ measure theory online courses, lectures from leading mathematics institutes on YouTube and Swayam.
  - https://www.classcentral.com/subject/measure-theory

## Interactive Tools (limited availability for abstract topics)

- **Visualizing Riemann vs Lebesgue Integration** — Some GeoGebra applets exist for showing the difference in integration approaches. Search GeoGebra.org for "Lebesgue integration."

- **Measure Theory Simulations** — Limited interactive tools due to abstract nature of the subject. Most learning is via pencil-and-paper proofs.

## Code and Computational Tools

- **Python (SciPy/NumPy)** — For numerical integration and exploring measure-theoretic concepts computationally. SciPy's `integrate` module implements Lebesgue-inspired algorithms.

- **Mathematica/Wolfram Alpha** — Can compute Lebesgue integrals, manipulate measures, work with Lp norms.

- **Lean theorem prover** — Measure theory formalized in Lean's mathlib. For students interested in formalization and proof verification.
  - https://leanprover-community.github.io/mathlib_docs/measure_theory/

## People to Follow (researchers and educators)

- **Terence Tao** — UCLA mathematician, Fields Medalist. Excellent blog posts connecting measure theory to analysis, probability, and ergodic theory.
  - Blog: https://terrytao.wordpress.com/ (search "measure theory")

- **Tim Gowers** — Cambridge mathematician, Fields Medalist. Blog has accessible posts on analysis and measure theory.
  - Blog: https://gowers.wordpress.com/

- **Sheldon Axler** — Author of recommended primary text, known for clear mathematical exposition.

- **Elias Stein and Rami Shakarchi** — Authors of Princeton Lectures in Analysis series, gold standard for graduate analysis.

## Historical Context

- **Henri Lebesgue (1875-1941)** — Developed Lebesgue integration in his 1902 dissertation. Revolutionary approach to integration.

- **Georg Cantor (1845-1918)** — Set theory pioneer; sigma-algebras build on his work on infinite sets.

- **Constantin Carathéodory (1873-1950)** — Extension theorem named for him; foundational to constructing measures.

- **Johann Radon and Otton Nikodym** — Radon-Nikodym theorem (1930) connects absolute continuity to densities.

## Unexpected Connections (for rabbit holes and wild cards)

- **Measure Theory → Probability** — Probability spaces are measure spaces with total measure 1. Random variables are measurable functions. Expectation is integration. The entire edifice of modern probability is built on measure theory.

- **Measure Theory → Quantum Mechanics** — L2 space is the Hilbert space of quantum states. Radon-Nikodym derivative connects to density operators. Measurement corresponds to projection onto eigenspaces.

- **Measure Theory → Harmonic Analysis** — Fourier transform is an isometry on L2 (Plancherel theorem). Lp spaces are natural setting for Fourier series and transforms.

- **Measure Theory → Ergodic Theory** — Study of measure-preserving dynamical systems. Birkhoff ergodic theorem connects time averages to space averages. Deep applications to statistical mechanics.

- **Measure Theory → Geometric Measure Theory** — Hausdorff measures, rectifiability, currents. Extends Lebesgue measure to fractal sets and geometric objects.

- **Measure Theory → Stochastic Calculus** — Brownian motion, Itô integrals, martingales all require measure-theoretic foundations. Essential for mathematical finance.

- **Banach-Tarski Paradox** — Non-measurable sets lead to paradoxes (decompose a ball into finitely many pieces and reassemble into two balls of same size). Requires axiom of choice.

## Problem Sets and Exercises

- **MIT 18.125 Problem Sets** — Available on MIT OCW, with solutions for some.
  - https://ocw.mit.edu/courses/18-125-measure-and-integration-fall-2003/

- **Stein-Shakarchi exercises** — End-of-chapter problems in Princeton Lectures, graduated difficulty.

- **Axler exercises** — Integrated into the text, excellent for building intuition.

## Prerequisites Check

If any of these are shaky, review before starting:

- **Real analysis**: ε-δ definitions, supremum/infimum, sequences and series, continuity
- **Topology**: open/closed sets, metric spaces, compactness (basic)
- **Proof techniques**: induction, contradiction, contrapositive, direct proof
- **Undergraduate integration**: Riemann integral, fundamental theorem of calculus
- **Set theory**: unions, intersections, complements, De Morgan's laws, cardinality basics

**Review resources**:
- Tao's "Analysis I & II" for real analysis foundations
- Rudin's "Principles of Mathematical Analysis" for rigorous calculus review
- Abbott's "Understanding Analysis" for gentler introduction to real analysis
