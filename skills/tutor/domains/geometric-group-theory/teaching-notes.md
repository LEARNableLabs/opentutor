# Geometric Group Theory — Teaching Notes

## Approach

Geometric group theory lives at the intersection of algebra, geometry, and topology, which makes it both rich and challenging. At the intermediate level, the key is to **build geometric intuition BEFORE formal definitions**. Use Cayley graphs as the central visual anchor — students should draw them, explore them computationally (Group Explorer, GAP), and develop a feel for "what does this group look like?" before proving theorems.

The field's central insight — that groups have a coarse geometry independent of generating set — is counterintuitive. Invest heavily in Lesson 7 (quasi-isometry). Once students internalize that "geometric properties are quasi-isometry invariants," the entire subject coheres. Without this, it feels like a grab-bag of unrelated techniques.

Balance concrete examples (free groups, surface groups, Baumslag-Solitar) with abstract theory (hyperbolicity, CAT(0)). Always return to: "What does this look like in the Cayley graph? How do we compute/verify this? Why does this property matter?" Make the computational tools (GAP, Group Explorer) part of exploration, not just illustration.

## Common Misconceptions

### 1. "Cayley graphs are unique for a group"
**Why students get this wrong:** First exposure to Cayley graphs usually shows one canonical example (e.g., Z² as integer lattice), creating the impression there's one "correct" graph per group.

**How to correct it:** Show Z with generators {1} vs {2,3}. The graphs look completely different! But they're quasi-isometric. Emphasize: "Cayley graph depends on choice, geometry doesn't."

### 2. "Quasi-isometry is just 'close enough' isometry"
**Why students get this wrong:** The name suggests a relaxation of isometry, like "almost isometric."

**How to correct it:** Quasi-isometry allows UNBOUNDED distortion, not just small errors. The integers Z and the real line R are quasi-isometric despite one being discrete! It's about large-scale structure, not approximation. Draw pictures showing how a sequence of points can be displaced arbitrarily far and still preserve coarse geometry.

### 3. "Hyperbolic groups act on hyperbolic space"
**Why students get this wrong:** The terminology suggests groups acting on spaces (like "linear groups" acting on vector spaces).

**How to correct it:** Hyperbolic groups ARE groups whose Cayley graph is a hyperbolic metric space. It's an intrinsic property. They don't need an external space to act on. (Though they DO act on their Cayley graph, and on the hyperbolic plane if they're surface groups, but that's not the definition.)

### 4. "Free groups are boring/trivial examples"
**Why students get this wrong:** "No relations" sounds like "no structure." Students think of free groups as the "zero object" or simplest case to ignore.

**How to correct it:** Free groups are FUNDAMENTAL, not trivial. They: (1) act freely on trees, (2) are hyperbolic with explicitly computable boundary, (3) have trivial word problem, (4) embed in every non-trivial group via quotients, (5) model pure algebraic freedom. They're the prototypical example for almost every concept in the subject.

### 5. "CAT(0) is a strengthening of hyperbolicity"
**Why students get this wrong:** Courses often present hyperbolicity first, then CAT(0), suggesting a progression from weaker to stronger.

**How to correct it:** These are INCOMPARABLE conditions! Hyperbolic = negative curvature (curvature < 0). CAT(0) = non-positive curvature (curvature ≤ 0). Euclidean space is CAT(0) but NOT hyperbolic. The hyperbolic plane is both. Draw a Venn diagram: hyperbolic groups ⊂ CAT(0) groups is FALSE.

### 6. "The word problem is just pattern matching"
**Why students get this wrong:** Early examples (free groups, free abelian groups) have obvious algorithms. Students think it's always about applying rewrite rules.

**How to correct it:** The word problem is undecidable for some finitely presented groups (Novikov-Boone). This isn't about "we haven't found the pattern yet" — there is NO algorithm that always works. Geometric properties (like hyperbolicity) are exactly what make the word problem tractable. This is deep.

### 7. "Growth rate is about how 'big' a group is"
**Why students get this wrong:** "Growth" suggests size or cardinality.

**How to correct it:** Growth is about geometry, not size. Infinite groups can have polynomial growth (like Z^n) or exponential growth (like free groups). It measures how fast the metric ball expands, which reflects geometry (e.g., dimension for nilpotent groups). Groups of the same cardinality (all countably infinite) can have completely different growth rates.

### 8. "Gromov boundary is the 'edge' of the Cayley graph"
**Why students get this wrong:** The word "boundary" suggests a topological boundary in the usual sense.

**How to correct it:** The Gromov boundary is a space of EQUIVALENCE CLASSES of geodesic rays that "stay close forever." It's a compactification at infinity, not a subset of the space. For the hyperbolic plane, it's the circle at infinity. For a tree, it's the set of ends. It's a topological gadget encoding asymptotic geometry.

### 9. "Bass-Serre theory is just about drawing graphs"
**Why students get this wrong:** Visual representations (graphs of groups with edge/vertex groups) look like graph theory diagrams.

**How to correct it:** Bass-Serre theory is a DECOMPOSITION theorem. It tells you how to build groups from simpler pieces via amalgamated products and HNN extensions, with trees as the organizing structure. It's the analog of prime factorization or Jordan-Hölder for group actions on trees. The graph is a tool, not the substance.

### 10. "Geometric group theory is just topology with group actions"
**Why students get this wrong:** Many examples (surface groups, 3-manifold groups) come from topology, and covering space theory looks similar.

**How to correct it:** Geometric group theory focuses on METRIC geometry (Cayley graphs, quasi-isometry, curvature), not just topological spaces. The fundamental group gives the connection to topology, but the geometric properties (growth, hyperbolicity, CAT(0)) are metric invariants. You can study geometric group theory with almost no topology beyond fundamental groups.

## Level Adjustments

### For Intermediate Level (this curriculum)
- **Prerequisites assumed:** comfortable with basic group theory (subgroups, quotients, homomorphisms), fundamental groups from topology, metric spaces, graph basics
- **Formalism:** Define terms carefully but prioritize examples over generality. Prove key theorems (Gromov hyperbolicity, quasi-isometry invariance) but skip ultra-technical results (e.g., detailed boundary topology)
- **Examples:** Focus on classical examples (free groups, Z^n, surface groups, Baumslag-Solitar, triangle groups). Mention exotic examples (Thompson groups, lamplighters) but don't dwell on technicalities
- **Computational tools:** Use Group Explorer and GAP extensively. Students should compute Cayley graphs, test hyperbolicity, verify quasi-isometry by hand for small examples
- **Connections:** Emphasize topology connections (fundamental groups, covering spaces) but don't require differential geometry or Riemannian geometry background

### Lower Level (beginner) would adjust:
- More time on group theory prerequisites (normal subgroups, quotients, presentations)
- Skip CAT(0) cube complexes, Gromov boundary, automatic groups
- Focus entirely on trees, free groups, and basic hyperbolic groups
- More computational examples, fewer proofs

### Higher Level (advanced) would adjust:
- Assume differential geometry and Riemannian geometry background
- Prove Gromov's theorem (polynomial growth ⇔ virtually nilpotent)
- Cover JSJ decomposition, geometric finiteness, rigidity theorems
- Introduce measured group theory, ergodic theory connections
- Study boundaries in detail (topology, dynamics, measure theory)

## Rabbit Holes (Fascinating Connections)

### 1. Mostow Rigidity (Lesson 28)
Drop this when discussing 3-manifolds: "In dimension ≥ 3, the geometry determines the topology. If two closed hyperbolic manifolds have isomorphic fundamental groups, they're isometric. This is WILD — algebra forces geometry." Contrast with dimension 2 (surfaces have moduli).

### 2. Growth Tightness (Lesson 8)
"Grigorchuk found groups with intermediate growth (between polynomial and exponential) in the 1980s, resolving Milnor's question. For decades we thought growth was a dichotomy!" Shows how geometric group theory solved long-standing problems.

### 3. Median Spaces and CAT(0) Cube Complexes (Lesson 20)
"Recent breakthroughs (Agol, Wise, Haglund-Paulin) used cube complexes to prove the Virtual Haken Conjecture. Cube complexes went from obscure to central in ~15 years." Modern geometric group theory in action.

### 4. Thompson's Group F Amenability (Lesson 25)
"No one knows if Thompson's group F is amenable. This is one of the big open problems connecting geometric group theory to functional analysis." Shows the field is alive with unsolved questions.

### 5. Hyperbolic 3-Manifolds and Number Theory (Lesson 28)
"Volumes of hyperbolic 3-manifolds are connected to L-functions and number theory (Bloch group, polylogarithms). Geometry and arithmetic mysteriously intertwine." Deep rabbit hole for interested students.

### 6. Random Groups (Lesson 16)
"Most groups (in the density model) are hyperbolic and have Property (T). 'Generic' groups have very rigid structure." Probabilistic methods in geometric group theory.

### 7. Subgroup Distortion (Lesson 7)
"A subgroup H can have much faster growth than G when measured in its own generators. The distortion function measures this gap. This is why quasi-isometry is subtle!" Introduce when discussing quasi-isometry.

### 8. Cannon Conjecture (Lesson 17)
"If a hyperbolic group has boundary homeomorphic to S², is it virtually a 3-manifold group? Still open! Connects geometry, topology, and group theory at the deepest level."

### 9. Dehn Functions and Filling (Lesson 3)
"How hard is it to fill a loop with a disk in the Cayley complex? The Dehn function measures this. It's a quasi-isometry invariant that generalizes the word problem." Advanced topic for curious students.

### 10. Zimmer's Conjecture (modern connection)
"Lattices in higher-rank Lie groups can't act on low-dimensional manifolds (recently proved by Brown-Fisher-Hurtado). Geometric group theory techniques applied to dynamical systems."

## Difficulty Progression

### Module 1: Foundations (Lessons 1-4)
**Difficulty:** 1-3 (gentle start)
- Lesson 1: Motivation (diff 1) — big picture, why geometry matters
- Lesson 2: Presentations (diff 2) — recall/extend from basic group theory
- Lesson 3: Word problem (diff 3) — first conceptual challenge
- Lesson 4: Free groups (diff 2) — concrete example, visual

### Module 2: Cayley Graphs and Geometry (Lessons 5-9)
**Difficulty:** 1-4 (build to first peak)
- Lesson 5: Cayley graphs (diff 2) — visual, hands-on
- Lesson 6: REVIEW (diff 1) — consolidate
- Lesson 7: Quasi-isometry (diff 3) — CRUCIAL concept, challenging
- Lesson 8: Growth (diff 3) — apply quasi-isometry
- Lesson 9: Ends (diff 4) — FIRST PEAK, topological sophistication

### Module 3: Groups Acting on Trees (Lessons 10-13)
**Difficulty:** 2-4 (maintain, then spike)
- Lesson 10: Tree actions (diff 2) — return to concrete after Lesson 9
- Lesson 11: Bass-Serre (diff 4) — SECOND PEAK, technically demanding
- Lesson 12: REVIEW (diff 2) — essential after Bass-Serre
- Lesson 13: Baumslag-Solitar (diff 3) — apply Bass-Serre to examples

### Module 4: Hyperbolic Groups (Lessons 14-18)
**Difficulty:** 2-4 (build to highest peak)
- Lesson 14: δ-hyperbolic (diff 3) — new geometric idea
- Lesson 15: Hyperbolic plane (diff 2) — model space, familiar from geometry
- Lesson 16: Hyperbolic groups (diff 4) — HIGHEST PEAK, synthesis
- Lesson 17: Boundary (diff 4) — sustained high difficulty
- Lesson 18: REVIEW (diff 2) — essential after two hard lessons

### Module 5: CAT(0) Spaces (Lessons 19-21)
**Difficulty:** 3-4 (parallel track, maintain high level)
- Lesson 19: CAT(0) (diff 3) — new curvature concept
- Lesson 20: Cube complexes (diff 4) — technically involved
- Lesson 21: Flat torus theorem (diff 4) — deep structural result

### Module 6: Examples and Applications (Lessons 22-28)
**Difficulty:** 1-4 (varied, wind down with spikes)
- Lesson 22: Surface groups (diff 3) — apply hyperbolic groups
- Lesson 23: Triangle groups (diff 3) — concrete examples
- Lesson 24: REVIEW (diff 1) — consolidate before final push
- Lesson 25: Thompson groups (diff 4) — exotic example, challenge
- Lesson 26: Lamplighter (diff 3) — wreath products
- Lesson 27: Automatic groups (diff 4) — algorithmic perspective
- Lesson 28: 3-manifolds (diff 3) — synthesis and connections

### Overall Arc
1. **Gentle start** (L1-4): Build foundations, recall group theory, introduce Cayley graphs
2. **First climb** (L5-9): Quasi-isometry is the first major conceptual hurdle, ends of groups is first peak
3. **Plateau and spike** (L10-13): Trees are more concrete, but Bass-Serre is technically hard
4. **Highest peaks** (L14-21): Hyperbolic groups and CAT(0) are the core advanced material, two consecutive peaks
5. **Examples and synthesis** (L22-28): Apply everything to classical examples, varied difficulty, end on connections to broader math

### Pacing Recommendations
- **Lessons 7, 11, 16, 17** are the hardest. Students may need 2 days or split lessons.
- **Review lessons (6, 12, 18, 24)** should include problem-solving, not just recap.
- **Lessons 22-28** can be reordered based on student interest (skip Thompson or lamplighter if time-constrained).
- Consider adding a **FINAL REVIEW** (Lesson 29) synthesizing quasi-isometry, hyperbolicity, CAT(0), and examples.

### Adaptive Teaching
- If student breezes through L1-6 → combine lessons or add challenge problems on quasi-isometry classes
- If student struggles with L7 (quasi-isometry) → add extra day with computational exercises, hands-on Cayley graph examples
- If student struggles with L11 (Bass-Serre) → split into two lessons: (a) tree actions and quotient graphs, (b) reconstruction and structure
- If student struggles with L14-17 (hyperbolicity) → slow down, add more examples (trees, hyperbolic plane), skip boundary
- If time is short → skip L20-21 (cube complexes, flat torus), L25 (Thompson), L27 (automatic groups)

## Teaching Tips

1. **Draw constantly.** Cayley graphs, trees, triangles in hyperbolic spaces. Geometric group theory is visual.

2. **Compute small examples.** Don't just describe — make students compute Cayley graphs for D₄, Z×Z, Z∗Z, BS(1,2), and verify properties by hand.

3. **Use Group Explorer and GAP early and often.** Let students experiment before proving.

4. **Connect to student background.** If they know topology: emphasize fundamental groups. If they know algorithms: emphasize word problem and automatic groups. If they know analysis: emphasize boundaries and dynamics.

5. **Return to the central question:** "What geometric properties are quasi-isometry invariants?" This is the organizing principle.

6. **Celebrate non-examples.** Show groups that are NOT hyperbolic (Z², solvable groups), spaces that are NOT CAT(0). Negative examples clarify boundaries.

7. **Make formalism serve intuition, not vice versa.** Define δ-hyperbolicity only after looking at thin triangles in trees and hyperbolic plane.

8. **Use analogies.** Quasi-isometry ≈ homeomorphism for coarse spaces. Hyperbolicity ≈ exponential expansion. CAT(0) ≈ "no positive curvature bumps."

9. **Acknowledge open problems.** Students should know this is an active field (Cannon conjecture, Thompson group amenability, etc.).

10. **End lessons with a question, not a summary.** "Now that we know hyperbolic groups solve the word problem efficiently, which groups are hyperbolic?" drives curiosity forward.
