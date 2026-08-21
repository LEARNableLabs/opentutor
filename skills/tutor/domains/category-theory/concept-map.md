# Category Theory — Concept Map

## Core Concepts (in learning order)

1. **Categories** — Collections of objects and morphisms with composition and identity
2. **Objects** — Abstract entities in a category (not defined by internal structure)
3. **Morphisms** — Arrows between objects; the structure that matters
4. **Composition** — How morphisms combine; must be associative
5. **Identity morphisms** — Every object has a do-nothing arrow to itself
6. **Category axioms** — Identity and associativity laws that define what makes a category
7. **Concrete categories** — Categories where objects are sets with structure (Set, Grp, Top). Depends on: categories, objects, morphisms
8. **Types as objects** — Programming interpretation where types are objects, functions are morphisms. Depends on: categories, morphisms
9. **Opposite categories** — Reversing all arrows gives you a new category. Depends on: categories, morphisms, composition
10. **Product categories** — Building categories from Cartesian products. Depends on: categories
11. **Slice categories** — Categories of objects "over" a fixed object. Depends on: categories, morphisms
12. **Functors** — Structure-preserving maps between categories. Depends on: categories, morphisms, composition
13. **Structure preservation** — Functors must preserve composition and identities. Depends on: functors, composition, identity
14. **Forgetful functors** — Maps that "forget" structure (group → set). Depends on: functors, concrete categories
15. **Free functors** — Build the "most general" structure (set → free group). Depends on: functors
16. **Free-forgetful pairs** — Fundamental adjunction pattern. Depends on: free functors, forgetful functors
17. **Hom-sets** — Collections of morphisms between two objects. Depends on: morphisms, Set
18. **Hom-functors** — Functors from morphisms to Set. Depends on: functors, hom-sets
19. **Covariance and contravariance** — How functors handle direction of arrows. Depends on: functors, opposite categories
20. **Natural transformations** — Morphisms between functors; "functorial maps". Depends on: functors
21. **Components** — A natural transformation assigns a morphism to each object. Depends on: natural transformations, morphisms
22. **Naturality squares** — Diagrams that must commute for naturality. Depends on: natural transformations, composition
23. **Commutative diagrams** — Visual proof that different paths compose to the same morphism. Depends on: composition
24. **Functor categories** — Categories where objects are functors, morphisms are natural transformations. Depends on: functors, natural transformations
25. **Vertical composition** — Composing natural transformations with the same domain/codomain. Depends on: natural transformations, composition
26. **Horizontal composition** — Composing natural transformations across functor composition. Depends on: natural transformations, functor composition
27. **Polymorphic functions** — Programming realization of natural transformations. Depends on: natural transformations, types as objects
28. **Universal properties** — Characterizing objects by their relationships, not internal structure. Depends on: morphisms, uniqueness
29. **Initial objects** — Objects with exactly one morphism to every other object. Depends on: universal properties
30. **Terminal objects** — Objects with exactly one morphism from every other object. Depends on: universal properties, duality
31. **Products** — Universal object for "simultaneous availability" with projections. Depends on: universal properties, diagrams
32. **Projections** — Morphisms from a product to its factors. Depends on: products
33. **Unique factorization** — Universal property ensures uniqueness up to isomorphism. Depends on: universal properties
34. **Coproducts** — Dual to products; universal object for "choice" with injections. Depends on: products, duality
35. **Duality** — Every concept has an "opposite" by reversing arrows. Depends on: opposite categories
36. **Injections** — Morphisms from factors into a coproduct. Depends on: coproducts
37. **Limits** — Universal cones over diagrams; generalize products, equalizers, pullbacks. Depends on: products, diagrams
38. **Cones** — Families of morphisms from an apex to all objects in a diagram. Depends on: diagrams, morphisms
39. **Limit diagrams** — Shapes we take limits over (discrete for products, parallel pairs for equalizers). Depends on: limits
40. **Colimits** — Dual to limits; universal cocones. Depends on: limits, duality
41. **Cocones** — Families of morphisms from all objects in a diagram to an apex. Depends on: cones, duality
42. **Representable functors** — Functors isomorphic to a hom-functor. Depends on: functors, hom-functors
43. **Representing objects** — Objects that represent a functor via hom. Depends on: representable functors
44. **Yoneda lemma** — Natural transformations from hom(A,-) to F correspond to elements of F(A). Depends on: natural transformations, hom-functors, representable functors
45. **Natural bijection** — The correspondence in Yoneda is natural in both variables. Depends on: Yoneda lemma, naturality
46. **Yoneda embedding** — Every object embeds into functor category via hom(-, A). Depends on: Yoneda lemma
47. **Full and faithful functors** — Functors that are bijective on hom-sets (faithful) or surjective (full). Depends on: functors, hom-sets
48. **Adjoint functors** — Pair of functors F ⊣ G with hom(F(A), B) ≅ hom(A, G(B)). Depends on: functors, hom-sets
49. **Unit** — Natural transformation id → GF in an adjunction. Depends on: adjoint functors, natural transformations
50. **Counit** — Natural transformation FG → id in an adjunction. Depends on: adjoint functors, natural transformations
51. **Triangle identities** — Axioms that unit and counit must satisfy. Depends on: unit, counit, composition
52. **Hom-set bijection** — Alternative definition of adjunction via natural isomorphism. Depends on: adjoint functors, natural transformations
53. **Tensor-hom adjunction** — Classic example: tensoring is left adjoint to hom. Depends on: adjoint functors
54. **Limits from adjoints** — Right adjoints preserve limits. Depends on: adjoint functors, limits
55. **Monads** — Endofunctors with unit and multiplication satisfying monad laws. Depends on: adjoint functors, composition
56. **Kleisli categories** — Categories built from monads for modeling computation. Depends on: monads
57. **Monad laws** — Associativity and identity for monadic multiplication. Depends on: monads, composition

## Dependencies

### Foundation Chain
**Categories → Objects/Morphisms → Composition → Functors → Natural Transformations**
This is the spine of category theory. You cannot understand functors without categories, or natural transformations without functors.

### Universal Properties Chain
**Morphisms → Universal Properties → Products/Coproducts → Limits/Colimits**
Universal properties abstract "best solutions" to optimization problems. Products are the first concrete example, limits are the ultimate generalization.

### Representability Chain
**Hom-functors → Representable Functors → Yoneda Lemma → Yoneda Embedding**
The Yoneda perspective says "an object is determined by maps into it." This is the most abstract part of the curriculum but unlocks deep insights.

### Adjunction Chain
**Functors → Natural Transformations → Adjoint Functors → Monads**
Adjunctions are "functors that are almost inverses." Free-forgetful pairs are the motivating example. Monads emerge as compositions of adjunctions.

### Critical Bottlenecks

1. **Functors** (lesson 6) — First major abstraction leap. Students must see categories as objects in their own right.
2. **Natural transformations** (lesson 11) — "Morphisms between functors" is mind-bending until it clicks.
3. **Universal properties** (lesson 15) — Shift from "what things are" to "how they relate" is conceptually challenging.
4. **Yoneda lemma** (lesson 22) — The peak difficulty. Proof is "trivial" but meaning is profound.
5. **Adjunctions** (lesson 24) — Most important concept after basic definitions, but requires comfort with all previous material.

## Prerequisite Topics

- **Abstract algebra** — Needed for: concrete categories (Grp, Ring), understanding structure preservation, recognizing algebraic patterns
- **Set theory** — Needed for: category Set, understanding hom-sets, defining functors formally
- **Mathematical proofs** — Needed for: verifying category axioms, proving universal properties, checking naturality conditions
- **Basic topology** (optional) — Helpful for: category Top, continuous functors, understanding limits geometrically
- **Programming experience** (optional) — Helpful for: types as objects, functors as type constructors, monads for effects

## Common Misconceptions

1. **Objects have no internal structure** — In category theory, only morphisms matter. What an object "is" is defined entirely by how it relates to other objects.

2. **Functors are not just functions** — Functors must preserve structure (composition and identity), not just map objects to objects.

3. **Naturality is not just component-wise definition** — A natural transformation is more than a family of morphisms; the naturality squares must commute.

4. **Universal properties characterize uniquely** — Up to unique isomorphism, not on the nose. There may be many products, but they're all "the same."

5. **Yoneda is "trivial"** — The proof is mechanical, but understanding what it means philosophically is deep.

6. **Adjunctions are not equivalences** — Adjoint functors are "almost inverses" but the compositions give you back something naturally isomorphic, not equal.

7. **All monads come from adjunctions** — Not constructively, though every monad can be factored through a Kleisli or Eilenberg-Moore adjunction.

## Concept Clusters (Dual Pairs)

Many concepts come in dual pairs (reverse all arrows):
- **Products ↔ Coproducts**
- **Limits ↔ Colimits**
- **Initial objects ↔ Terminal objects**
- **Monomorphisms ↔ Epimorphisms**
- **Projections ↔ Injections**

Understanding duality is key to mastering category theory — prove one, get the other for free.

## Where Concepts Peak in Difficulty

- Lessons 9, 18-19, 22, 27 are difficulty 4-5 (peaks)
- These introduce: hom-functors (contravariance), limits/colimits, Yoneda, and adjunctions-as-universal-properties
- Reviews (lessons 10, 20, 28) consolidate before the next climb
- Final lessons (29-30) on monads and applications are payoff — lower difficulty, high engagement
