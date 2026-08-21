# Representation Theory — Teaching Notes

## Approach

Representation theory at the intermediate level requires balancing abstraction with concrete examples. The key pedagogical move is to oscillate between **algebraic structure** (characters, modules, homomorphisms) and **computational practice** (character tables, matrix calculations, explicit constructions). Start every major concept with a concrete example (S₃, D₄, SU(2), sl(2)) before generalizing. Use the progression: finite groups → Lie groups → structure theory, allowing students to build intuition in simpler settings before tackling roots and weights. Emphasize the **geometric perspective** throughout — Lie groups as smooth manifolds, root systems as reflection groups, representations as bundles on flag varieties — to prevent the subject from feeling purely algebraic.

## Common Misconceptions

1. **"Characters are just traces"** — Students reduce characters to computational tools without understanding that they're class functions encoding the entire representation (for finite groups over ℂ). Correct by emphasizing: characters determine representations up to isomorphism; orthogonality relations provide a complete invariant. Show non-isomorphic representations with different characters.

2. **"Irreducible means simple/atomic"** — Students conflate irreducible (no invariant subspaces) with indecomposable (not a direct sum). Correct by showing: over ℂ, irreducible = indecomposable (Maschke), but over other fields or for infinite groups, indecomposable representations can be non-irreducible. Example: 2x2 upper triangular matrices over ℝ.

3. **"The Lie algebra determines the Lie group"** — Students think exp: 𝔤 → G is a bijection or that 𝔤 ≅ 𝔥 implies G ≅ H. Correct by examples: SU(2) and SO(3) both have Lie algebra 𝔰𝔬(3), but SO(3) ≅ SU(2)/{±I}. Exp is not surjective for all groups (e.g., GL(n,ℂ) has matrices not in any one-parameter subgroup).

4. **"Maschke's theorem works for all groups"** — Students overgeneralize complete reducibility. Correct by emphasizing: Maschke requires finite groups (or compact groups with Haar measure) and characteristic zero. Counterexample: representations of ℤ (free abelian group) need not decompose; modular representation theory (char p | |G|) is fundamentally different.

5. **"Highest weight is unique"** — Students think the highest weight is an absolute notion. Correct by clarifying: highest weight depends on choice of positive roots (Weyl chamber). Different choices of positive system give different "highest" weights, related by Weyl group action. The dominant highest weight is well-defined up to Weyl conjugacy.

6. **"Roots are just eigenvalues"** — Students miss that roots are weights of the *adjoint representation*, not arbitrary eigenvalues. Correct by emphasizing: roots detect the structure of the Lie algebra via [𝔥, 𝔤_α] = α(h)𝔤_α. Root systems encode the entire structure, not just eigenvalues of one matrix.

7. **"Character tables are unique"** — Students think there's one canonical character table. Correct by showing: the ordering of rows (conjugacy classes) and columns (irreps) is arbitrary; different conventions exist for labeling irreps; signs depend on conventions for symmetric group representations (Young tableaux vs. Specht modules).

8. **"Tensor product of irreps is irreducible"** — Students assume irreducibility is preserved under tensor product. Correct by examples: for SU(2), spin-1/2 ⊗ spin-1/2 = spin-0 ⊕ spin-1. Show Clebsch-Gordan decomposition. This is actually the *interesting* content — understanding how irreps combine.

9. **"Weight spaces are one-dimensional"** — Students overgeneralize from sl(2) where weight spaces are one-dimensional. Correct by: for higher-rank Lie algebras, weight multiplicities > 1 are common. Example: for 𝔰𝔩(3), some weights appear with multiplicity 2 or higher.

10. **"The Weyl character formula is too complicated to use"** — Students see the formula as purely theoretical. Correct by: show small examples (SU(2), SU(3)) where the formula is tractable. Use computational tools (SageMath, Atlas of Lie Groups) to build intuition. Emphasize the formula's beauty — it connects characters to root systems via a determinant/alternating sum.

## Level Adjustments

### Intermediate Level (Current)
- **Prerequisites assumed**: solid linear algebra, group theory basics (conjugacy classes, normal subgroups, quotients), abstract algebra (rings, fields, modules), familiarity with inner products and eigenvalue problems.
- **Formalism level**: Define representations as homomorphisms G → GL(V); prove Maschke's theorem with averaging argument; state and prove orthogonality relations; classify irreps of small groups (S₃, S₄, D_n).
- **Lie theory depth**: Define Lie algebras via tangent spaces; use matrix Lie groups (avoid abstract manifolds); prove structure theory for sl(2) completely; state classification via Dynkin diagrams without full proofs.
- **Emphasis**: Computational facility with character tables, explicit matrix representations, use of software tools (SageMath, GAP). Applications to physics (angular momentum, particle physics) and combinatorics (Burnside's lemma, symmetric functions).
- **Skip**: Modular representation theory, infinite-dimensional representations, category-theoretic formulations, derived functors, cohomological methods.

### If Beginner Level
- Start with finite groups only; skip or defer Lie theory entirely
- Focus on permutation representations and geometric examples
- Character theory as computational tool, not abstract harmonic analysis
- More examples, fewer proofs (state Maschke without proof)
- Use GAP for all character table computations
- Applications: symmetry in art, chemistry (molecular symmetry)

### If Advanced Level
- Assume representation theory of finite groups is known
- Start with semisimple Lie algebras and root systems
- Include proofs of classification theorem, Weyl character formula
- Cover modular representation theory, Kazhdan-Lusztig theory
- Categorical perspective: Tannakian reconstruction, derived categories
- Advanced applications: Langlands program, geometric Langlands, quantum groups
- Infinite-dimensional representations: Verma modules, BGG resolution, Kac-Moody algebras

## Rabbit Holes

- **Representation theory and quantum mechanics** — Angular momentum, spin, Wigner-Eckart theorem, Clebsch-Gordan coefficients. Drop in Lesson 19 (physics applications) or when discussing SU(2)/SO(3).

- **Symmetric functions and Young tableaux** — Connection to generating functions, Schur polynomials, plethysm, Littlewood-Richardson rule. Natural extension of Lesson 10 (symmetric group) for combinatorially-inclined students.

- **Moonshine and sporadic groups** — Monstrous moonshine connects sporadic finite simple groups to modular forms and conformal field theory. Mention as wild frontier when discussing finite group representations.

- **Geometric representation theory** — Flag varieties, D-modules, perverse sheaves, Springer resolution, Kazhdan-Lusztig polynomials. For geometrically-minded students, introduce after Lesson 28.

- **Quiver representations** — Path algebras, Gabriel's theorem, Kac's theorem, cluster algebras. Alternative perspective on representation theory; good for students interested in combinatorial/categorical approaches.

- **McKay correspondence** — ADE classification appearing in geometry (du Val singularities), finite subgroups of SU(2), and Dynkin diagrams. Beautiful unifying example showing ADE everywhere.

- **Langlands program** — Representation theory of Galois groups, automorphic forms, L-functions, geometric Langlands. Mention in Lesson 29 (number theory applications) as the modern frontier.

- **Quantum groups** — Deformations of universal enveloping algebras, braiding, knot invariants, Jones polynomial. Natural next step after classical representation theory; mention in Lesson 30.

- **Kac-Moody algebras** — Infinite-dimensional generalizations, affine Lie algebras, affine Weyl groups, modular forms. For students ready to go beyond finite-dimensional theory.

- **Categorification** — Higher representation theory, 2-categories, decategorification (Grothendieck group construction), categorified quantum groups. For category theory enthusiasts.

## Difficulty Progression

### Arc 1: Foundations (Lessons 1-5)
Start gentle (difficulty 2) with concrete examples (S₃ permutation representation). Build to difficulty 3 with irreducibility and tensor products. Lesson 5 (characters) is critical bridge to next arc.

### Arc 2: Finite Groups (Lessons 6-12)
Peak difficulty at 4-5: Maschke's theorem (lesson 6, diff 4), orthogonality relations (lesson 7, diff 4), induced representations (lesson 9, diff 5 — most abstract concept in finite group theory). Symmetric group representations (lesson 10) slightly easier (diff 4) because they're more concrete/combinatorial. Review in lesson 12 drops to difficulty 2.

### Arc 3: Lie Groups and Algebras (Lessons 13-20)
Restart at difficulty 2 (new domain). Build gradually: exponential map and bracket (diff 3-4), sl(2) and SU(2) representations (diff 4) are local peaks. Physics applications (lesson 19) slightly easier (diff 3) as it's more applied. Review in lesson 20.

### Arc 4: Structure Theory (Lessons 21-27)
Hardest arc. Root systems (lesson 21, diff 5) is first major peak. Highest weight theory (lesson 24, diff 5) and Weyl character formula (lesson 25, diff 5) are the conceptual summit. Computational tools lesson (lesson 26, diff 3) provides relief before final review (lesson 27, diff 2).

### Arc 5: Applications (Lessons 28-30)
Difficulty 3-4, showing payoff. Geometric and number-theoretic applications (diff 4) are challenging but rewarding. Final lesson (lesson 30, diff 3) is a resource-drop pointing to future directions.

## Pacing Notes

- **Bottleneck alerts**: Lessons 5 (characters), 9 (induced reps), 15 (Lie bracket), 21 (root systems), 24 (highest weight) are natural slow points. Consider splitting these into two sessions if student struggles.
- **Acceleration opportunities**: If student has strong group theory background, lessons 1-4 can be condensed. If student knows differential geometry, lessons 13-14 can move faster.
- **Review effectiveness**: Reviews (lessons 12, 20, 27) should include computational practice, not just conceptual review. Assign character table computations, weight diagram drawings, root system classifications.
- **Computational tools**: Introduce GAP early (lesson 8 or 12) and SageMath for Lie theory (lesson 26). Use Atlas of Lie Groups throughout Arc 4 for interactive exploration.
