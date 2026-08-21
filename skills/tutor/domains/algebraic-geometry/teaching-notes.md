# Algebraic Geometry — Teaching Notes

## Approach

Algebraic geometry bridges abstract algebra and geometric intuition, making it uniquely challenging to teach. For intermediate students, the key is **interleaving concrete examples (especially curves) with abstract theory (sheaves, schemes)**. Start classical (affine and projective varieties) to build geometric intuition, then dive deep into curves (the one-dimensional case students can visualize), and only then introduce the language of sheaves and schemes. The scheme-theoretic perspective should feel like a payoff — a unifying language that makes classical results clearer — not an arbitrary abstraction.

This curriculum follows the **curves-first, schemes-second** philosophy: students see rich geometric phenomena (genus, divisors, Riemann-Roch) before learning the abstract machinery. By the time they encounter Spec(R), they have enough geometric maturity to appreciate what schemes buy you.

Expect students to struggle with **non-intuitive topology** (Zariski), **points that aren't closed** (generic points in Spec), and **nilpotents** (which have no classical analogue). Use lots of examples: A^1, P^1, conics, cubics, Spec(Z), Spec(k[x]), Spec(k[x,y]/(xy)).

## Common Misconceptions

### 1. "The Zariski topology is like the Euclidean topology"
**Why students think this:** They learned topology via metric spaces and open balls.

**Why it's wrong:** Zariski topology is coarse — very few open sets. Non-empty open sets are dense. The space is almost never Hausdorff (except finite discrete sets). Intuitions about separation, convergence, and compactness fail.

**How to correct:** Emphasize that Zariski topology encodes *algebraic* information (vanishing sets), not *metric* information. Show explicit examples: in A^1, the only closed sets are finite sets and the whole space. Highlight that a single point can be dense.

### 2. "Varieties are just solution sets to polynomial equations"
**Why students think this:** The definition of affine varieties starts with vanishing sets.

**Why it's wrong:** Varieties carry *additional structure*: a coordinate ring, regular functions, morphisms. Two varieties can have the same underlying point set but different algebraic structure (e.g., different nilpotent structures in schemes).

**How to correct:** Stress that varieties are ringed spaces. The ring structure (coordinate ring or structure sheaf) is *part of the data*, not a derived property.

### 3. "Regular functions and rational functions are the same"
**Why students think this:** Both are defined using polynomials.

**Why it's wrong:** Regular functions are defined everywhere on a variety; rational functions have poles. The distinction is crucial for understanding morphisms and divisors.

**How to correct:** Use the example of P^1: every rational function has a pole somewhere, but no regular function does (except constants). For affine varieties, regular functions *are* polynomial, but for projective varieties, they must be constant.

### 4. "Projective space is just like affine space but bigger"
**Why students think this:** Projective space is introduced as affine space plus "points at infinity."

**Why it's wrong:** Projective space has fundamentally different global structure. It's compact (in Zariski topology), has no global regular functions except constants, and requires homogeneous coordinates.

**How to correct:** Emphasize the *quotient* construction: P^n = (A^(n+1) \ {0}) / ~. Points are *lines through the origin*, not points in A^n. Use the example: O_P^1(P^1) = k (only constant functions), while O_A^1(A^1) = k[x].

### 5. "Divisors are just subvarieties"
**Why students think this:** On curves, divisors are formal sums of points, which look like finite subsets.

**Why it's wrong:** Divisors carry *multiplicity* data. The divisor 2P is not the same as P, even though they have the same support. Divisors are elements of a free abelian group, not a power set.

**How to correct:** Use explicit examples: the divisor of x^2 on A^1 is 2·(0), not just {0}. Multiplicity encodes "order of vanishing," which is crucial for Riemann-Roch.

### 6. "Prime ideals correspond to closed points"
**Why students think this:** In classical algebraic geometry over algebraically closed fields, points correspond to maximal ideals, which are prime.

**Why it's wrong:** In Spec(R), *all* prime ideals are points, including non-maximal ones. Generic points (non-maximal primes) are dense in their closures.

**How to correct:** Use Spec(Z): (0) is the generic point (dense in Spec(Z)), while (p) for prime p are closed points. Or Spec(k[x]): (0) is generic, (x-a) are closed. This is the **key conceptual shift** from varieties to schemes.

### 7. "Schemes are just varieties with nilpotents added"
**Why students think this:** The first examples of non-reduced schemes (double points, fat points) are built from varieties by adding nilpotents.

**Why it's wrong:** Schemes unify *much more*: they allow working over non-algebraically closed fields, over Z (arithmetic geometry), and provide a functorial framework. Nilpotents are one feature, not the point.

**How to correct:** Show arithmetic examples: Spec(Z), Spec(Z[i]), Spec(F_p[x]). Emphasize that schemes let you "do geometry over any base," which is impossible with classical varieties.

### 8. "Morphisms of schemes are just continuous maps"
**Why students think this:** In classical geometry and topology, morphisms are maps of points.

**Why it's wrong:** A morphism of schemes is a morphism of locally ringed spaces: a continuous map *plus* compatible sheaf homomorphisms. The sheaf data is essential.

**How to correct:** Show that different sheaf homomorphisms can give different morphisms even if the underlying point-map is the same. Also, explain that Spec is a *contravariant* functor: a ring homomorphism R → S induces Spec(S) → Spec(R) (opposite direction).

### 9. "Cohomology is always needed in algebraic geometry"
**Why students think this:** Advanced texts (Hartshorne) use sheaf cohomology heavily.

**Why it's wrong:** For curves, Riemann-Roch can be stated without cohomology. Cohomology is powerful but not foundational for understanding basic concepts.

**How to correct:** This curriculum *avoids* cohomology (except a brief mention in teaching notes). Emphasize that cohomology is a tool for higher-dimensional or more advanced work, but not required to understand varieties, curves, or basic scheme theory.

### 10. "Gluing is only about patching geometric pieces"
**Why students think this:** Gluing is introduced for projective varieties via affine patches.

**Why it's wrong:** Gluing is a *categorical* construction: fiber products, colimits, descent. The geometric picture is helpful but incomplete.

**How to correct:** Emphasize that gluing requires *transition functions* (or cocycle conditions for sheaves). In schemes, gluing is formalized via isomorphisms of open subschemes, which includes sheaf data, not just topological data.

## Level Adjustments

### For intermediate students (this curriculum)
- **Formalism:** Moderate. Define all concepts rigorously, but avoid excessive categorical language. Use functoriality of Spec, but don't require deep category theory.
- **Examples:** Heavy emphasis. Every concept should have 2-3 explicit examples (A^n, P^n, Spec(Z), Spec(k[x]), affine and projective curves).
- **Proofs:** Sketches and key ideas, not full details. Prove Nullstellensatz (at least state it carefully), sketch Riemann-Roch, give intuition for sheafification.
- **Prerequisites:** Assume solid commutative algebra (localization, Noetherian rings, prime/maximal ideals). Assume basic topology (compactness, connectedness). Fill gaps as needed.
- **Exercises:** Computational (verify properties of specific varieties/schemes) and conceptual (explain why a property holds/fails).

### For beginners (would need to simplify)
- **Formalism:** Minimal. Focus on affine and projective varieties only; skip schemes entirely or treat them as black-box language.
- **Examples:** Even heavier. Work through plane conics, cubics, twisted cubic in detail.
- **Proofs:** Mostly skip. State Nullstellensatz, accept Riemann-Roch on faith, focus on applications.
- **Prerequisites:** Include a commutative algebra primer (ideals, quotients, localization) and topology crash course.

### For advanced students (would extend)
- **Formalism:** Heavy. Full categorical perspective. Define schemes via locally ringed spaces and prove functoriality. Introduce fiber products, base change, flat/smooth/étale morphisms.
- **Cohomology:** Add Čech cohomology, sheaf cohomology, Serre duality, higher Riemann-Roch.
- **Applications:** Intersection theory, moduli spaces, introduction to stacks.
- **Proofs:** Full rigor. Prove Riemann-Roch (for curves), prove properties of morphisms (separated, proper, finite, etc.).

## Rabbit Holes (Fascinating Connections)

### 1. **Arithmetic geometry** — Spec(Z) as a "curve"
**What:** Number theorists treat Spec(Z) like a curve: primes (p) are "closed points," (0) is the "generic point," and many curve theorems have arithmetic analogues (e.g., unique factorization ↔ discrete valuation rings).

**When to drop:** Lesson 21 or 30, when introducing Spec. Blow students' minds by showing that primes in Z behave like points on a curve.

**Why it's cool:** Connects number theory and geometry. The "curve" Spec(Z) has genus 0 in some sense, and analogues of Riemann-Roch exist (class number formulas).

### 2. **Tropical geometry** — algebraic geometry over the "tropical semiring"
**What:** Replace the field k with the "tropical semiring" (R ∪ {∞}, min, +). Varieties become piecewise-linear objects (polyhedral complexes). Curves become metric graphs.

**When to drop:** Lesson 10 or 12, when discussing plane curves. Show a tropical conic or cubic.

**Why it's cool:** Degenerate limits of algebraic varieties have combinatorial shadows (tropical varieties). Used in mirror symmetry and enumerative geometry.

### 3. **Mirror symmetry** — geometric duality in string theory
**What:** Certain pairs of Calabi-Yau varieties have "mirror" relationships: complex geometry on one corresponds to symplectic geometry on the other. Enumerative invariants (counting curves) are mysteriously related.

**When to drop:** Lesson 15 (elliptic curves), since elliptic curves are the simplest Calabi-Yau manifolds (1-dimensional case).

**Why it's cool:** Physics (string theory) predicted deep mathematical connections later proved by algebraic geometers. Motivates modern research.

### 4. **Motivic cohomology and the Weil conjectures**
**What:** Grothendieck developed scheme theory partly to prove the Weil conjectures (analogue of Riemann hypothesis for varieties over finite fields). This led to étale cohomology and motives.

**When to drop:** Lesson 30, when discussing schemes over different bases. Mention that schemes were invented for arithmetic applications, not just abstraction.

**Why it's cool:** One of the great success stories of 20th-century mathematics. Deligne's proof of the Weil conjectures used schemes in essential ways.

### 5. **Computational algebraic geometry** — Gröbner bases and computer algebra
**What:** Many problems in algebraic geometry (ideal membership, solving systems, computing intersections) can be solved algorithmically using Gröbner bases. Software: Macaulay2, Singular, SageMath.

**When to drop:** Lesson 2 (Nullstellensatz) or Lesson 5 (dimension), when students are computing with ideals.

**Why it's cool:** Makes abstract algebra concrete. Students can *compute* varieties, dimension, singularities. Great for coding-inclined students.

### 6. **Birational geometry and minimal models**
**What:** Two varieties are birational if they share the same function field. The minimal model program classifies varieties up to birational equivalence, leading to a "periodic table" of varieties.

**When to drop:** Lesson 8 (rational maps) or Lesson 11 (resolution of singularities).

**Why it's cool:** Modern research area (Mori, et al.). Connects to physics (F-theory, string compactifications).

### 7. **Moduli spaces** — spaces parameterizing geometric objects
**What:** Instead of studying one variety, study the *space of all varieties* of a given type (e.g., all elliptic curves, all genus g curves). These moduli spaces are themselves algebraic varieties (or stacks).

**When to drop:** Lesson 15 (elliptic curves), since the moduli space of elliptic curves is well-understood (j-invariant).

**Why it's cool:** Meta-level abstraction: doing geometry on the space of geometric objects. Leads to algebraic stacks, a major modern framework.

### 8. **Derived algebraic geometry** — schemes enriched with chain complexes
**What:** Replace rings with differential graded algebras or simplicial rings. Get "derived schemes" that remember higher homotopical information. Useful in intersection theory, deformation theory, and quantum field theory.

**When to drop:** Lesson 30, as a "where next" teaser.

**Why it's cool:** Cutting-edge research (Lurie, Toën, Vezzosi). Connects algebraic geometry to homotopy theory.

## Difficulty Progression

- **Lessons 1-5 (Affine varieties):** Difficulty 2-4. Start gentle, build to Nullstellensatz and dimension (hardest in this module).
- **Lessons 6-9 (Projective varieties):** Difficulty 2-3. Projective space is conceptually new but not technically hard. End with review.
- **Lessons 10-16 (Curves):** Difficulty 2-5. Plane curves are accessible (2-3), but genus and Riemann-Roch are peaks (4-5). Review at end.
- **Lessons 17-20 (Sheaves):** Difficulty 3-4. Sheaves are abstract; expect confusion. Ringed spaces and exact sequences are technical.
- **Lessons 21-26 (Schemes):** Difficulty 3-4. Spec is the key bottleneck (3-4). Nilpotents and non-reduced schemes are advanced (4).
- **Lessons 27-29 (Morphisms):** Difficulty 3-4. Properties of morphisms (separated, proper, finite) are technical.
- **Lessons 30-31 (Synthesis):** Difficulty 2-3. Bring it all together; final review.

## Pacing Notes

- **Modules 1-2 (Affine + Projective):** ~9 lessons, ~2 weeks. Build classical foundation quickly.
- **Module 3 (Curves):** ~7 lessons, ~1.5 weeks. The heart of the curriculum; go deep here.
- **Module 4 (Sheaves):** ~4 lessons, ~1 week. Dense abstract material; don't rush.
- **Module 5 (Schemes):** ~6 lessons, ~1.5 weeks. The conceptual climax; allow time for Spec to sink in.
- **Module 6-7 (Morphisms + Synthesis):** ~5 lessons, ~1 week. Wrap up and connect threads.

Total: ~31 lessons, ~7-8 weeks at one lesson per day.

## Red Flags (Signs Student Needs Help)

1. **Confusing ideals and varieties** — If student treats I(V(I)) = I for non-radical ideals, review Nullstellensatz.
2. **Not checking algebraic closure** — Many theorems fail over non-algebraically closed fields. Reinforce this assumption.
3. **Treating Spec(R) as a set of maximal ideals** — A sign they haven't internalized that prime ideals are points. Use Spec(Z) as corrective.
4. **Struggling with sheaf gluing** — If student can't explain the sheaf axiom, go back to presheaves and work through explicit examples (sheaf of continuous functions on R).
5. **Avoiding nilpotents** — If student only works with reduced schemes, they're missing a key feature. Assign exercises with fat points.
