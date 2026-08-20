# Category Theory -- Concept Map

**Level:** Intermediate (knows categories, functors, natural transformations; building toward adjunctions, Yoneda, monads)
**Prior topics:** Optimal Transport, Origami Mathematics
**Generated:** 2026-08-20

---

## Core Concepts in Learning Order

Concepts marked [R] are review/consolidation for this student. Concepts marked [N] are new target material.

| #  | Concept | Description | Depends on |
|----|---------|-------------|------------|
| 1  | [R] **Categories: objects, morphisms, composition** | A category C consists of a class of objects, a class of morphisms between them, an associative composition law, and identity morphisms; the axioms are associativity and unitality of composition | External: sets, functions, abstract algebra |
| 2  | [R] **Concrete categories and key examples** | Set, Grp, Ab, Ring, Top, Vect_k, Pos, Meas; recognizing categories hiding inside familiar mathematics (a monoid is a one-object category; a preorder is a category where hom-sets have at most one element) | 1 |
| 3  | [R] **Commutative diagrams and diagram chasing** | A diagram commutes when all directed paths with the same endpoints compose to the same morphism; the primary proof and communication tool of category theory | 1 |
| 4  | [R] **Isomorphisms, monomorphisms, and epimorphisms** | Iso = two-sided inverse (categorical "sameness"); mono = left-cancellable (generalized injection); epi = right-cancellable (generalized surjection); these need not coincide with set-theoretic notions in general categories | 1, 3 |
| 5  | [R] **The opposite category and duality** | C^op has the same objects as C but every morphism is reversed; any theorem in C yields a dual theorem in C^op for free; products dualize to coproducts, monos to epis, limits to colimits | 1 |
| 6  | [R] **Functors** | A functor F: C -> D assigns objects to objects and morphisms to morphisms, preserving composition and identities; covariant functors preserve arrow direction, contravariant reverse it (equivalently, functors from C^op) | 1, 2, 5 |
| 7  | [R] **Natural transformations** | A family of morphisms alpha_A: F(A) -> G(A) indexed by objects of C such that for every morphism f: A -> B, the naturality square commutes: G(f) . alpha_A = alpha_B . F(f); the right notion of "morphism between functors" | 3, 6 |
| 8  | [R] **Functor categories and natural isomorphisms** | The category [C, D] whose objects are functors C -> D and whose morphisms are natural transformations; a natural isomorphism is a natural transformation whose every component is an isomorphism; the original motivation for inventing category theory (Eilenberg-Mac Lane 1945) | 4, 7 |
| 9  | [N] **Equivalence of categories** | Functors F: C -> D and G: D -> C with natural isomorphisms GF ~= Id_C and FG ~= Id_D; strictly weaker than isomorphism of categories but the correct notion of "sameness" for categories; full, faithful, and essentially surjective characterization | 4, 6, 7 |
| 10 | [N] **Initial objects, terminal objects, and zero objects** | An initial object has exactly one morphism to every object; a terminal object has exactly one from every object; unique up to unique isomorphism; the first universal properties | 1, 4 |
| 11 | [N] **Products and coproducts** | A product A x B is equipped with projections and satisfies the universal property: any object mapping to both A and B factors uniquely through A x B; coproducts are dual (injections, cocones); generalize Cartesian products and disjoint unions | 5, 10 |
| 12 | [N] **Universal properties and universal morphisms** | An object defined by a universal property is characterized not by what it "is made of" but by what morphisms factor through it; the organizing principle of category theory; every limit, colimit, adjunction, and Kan extension is a universal property | 4, 10, 11 |
| 13 | [N] **Equalizers and coequalizers** | An equalizer of parallel morphisms f, g: A -> B is a morphism e: E -> A such that fe = ge, universal among all such; coequalizers are dual; generalize kernels and quotients | 4, 12 |
| 14 | [N] **Pullbacks and pushouts** | A pullback is the limit of a cospan A -> C <- B (generalized fiber product); a pushout is the colimit of a span A <- C -> B (generalized amalgamation); pullbacks compute pre-images, pushouts glue along shared boundaries | 11, 13 |
| 15 | [N] **Limits and colimits (general theory)** | A limit of a diagram D: J -> C is an object with a universal cone over D; a colimit is an object with a universal cocone; products, equalizers, pullbacks, terminal objects are all special cases; a category is complete if it has all small limits | 11, 12, 13, 14 |
| 16 | [N] **Hom-functors** | For a locally small category C, Hom(A, -): C -> Set is covariant and Hom(-, B): C^op -> Set is contravariant; these functors probe the internal structure of C by asking "what maps into/out of a given object?" | 5, 6 |
| 17 | [N] **Representable functors** | A functor F: C -> Set is representable if F ~= Hom(A, -) for some representing object A; representability means F's data is fully captured by morphisms out of a single object; many familiar constructions are representable (free groups, tensor products, function spaces) | 7, 16 |
| 18 | [N] **The Yoneda lemma** | Nat(Hom(A, -), F) ~= F(A) naturally in A; the set of natural transformations from a representable functor to any functor F is determined by a single element of F(A); the most important and most used lemma in category theory | 7, 16, 17 |
| 19 | [N] **The Yoneda embedding** | The functor y: C -> [C^op, Set] sending A to Hom(-, A) is full and faithful; every category embeds into a presheaf category; an object is completely determined by how other objects map into it; the categorical analog of Cayley's theorem for groups | 5, 8, 18 |
| 20 | [N] **Presheaves and the density theorem** | A presheaf on C is a functor C^op -> Set; every presheaf is canonically a colimit of representables (the density/co-Yoneda theorem); presheaf categories are the "free cocompletion" of C | 15, 19 |
| 21 | [N] **Adjunctions (hom-set definition)** | Functors F: C -> D and G: D -> C form an adjunction F -| G when Hom_D(FA, B) ~= Hom_C(A, GB) naturally in A and B; F is the left adjoint, G the right adjoint; the most important concept after categories themselves | 7, 15, 16 |
| 22 | [N] **Unit and counit of an adjunction** | Natural transformations eta: Id_C -> GF (unit) and epsilon: FG -> Id_D (counit) satisfying the triangle/zig-zag identities; they encode the adjunction without reference to hom-sets; equivalent formulation via universal arrows | 7, 21 |
| 23 | [N] **Free-forgetful adjunctions** | The free functor (e.g., free group on a set, free vector space, tensor algebra) is left adjoint to the forgetful functor; the universal property of "free" constructions is exactly an adjunction; the most important source of examples | 21 |
| 24 | [N] **Adjunctions from Galois connections and order theory** | A Galois connection between posets is an adjunction between poset-categories; existential/universal quantifiers are left/right adjoints to substitution; product-diagonal and exponential adjunctions; recognizing adjunctions in the wild | 21 |
| 25 | [N] **RAPL: Adjoints preserve limits** | Right adjoints preserve limits; left adjoints preserve colimits (RAPL/LAPC); a fundamental tool for computing limits in one category by passing to another; often used to prove a functor does NOT have an adjoint | 15, 21 |
| 26 | [N] **Monads from adjunctions** | Every adjunction F -| G induces a monad T = GF on C with unit eta: Id -> T and multiplication mu = G(epsilon)F: T^2 -> T satisfying associativity and unit laws; a monad is an endofunctor equipped with a "compatible algebra" structure | 7, 21, 22 |
| 27 | [N] **Monads as algebraic theories** | A monad T on Set captures an algebraic theory: T(X) is the set of "formal T-expressions" in variables from X; groups, rings, lattices, and other algebraic structures all arise as algebras over appropriate monads | 26 |
| 28 | [N] **Eilenberg-Moore algebras** | A T-algebra is an object A with a structure map alpha: TA -> A compatible with unit and multiplication; the Eilenberg-Moore category C^T has T-algebras as objects and T-algebra homomorphisms as morphisms; recovers the "structured objects" the monad describes | 26, 27 |
| 29 | [N] **The Kleisli category** | Objects are the same as C; a Kleisli morphism A -> B is a morphism A -> TB in C; composition uses the monad multiplication; the Kleisli category is the "free" resolution of the monad and models effectful computation in programming | 26 |
| 30 | [N] **Monadicity and Beck's theorem** | A functor U: D -> C is monadic when D is equivalent to the Eilenberg-Moore category of the monad induced by a left adjoint F -| U; Beck's monadicity theorem gives necessary and sufficient conditions (U reflects isomorphisms and D has coequalizers of U-split pairs) | 9, 13, 21, 28 |
| 31 | [N] **Exponential objects and cartesian closed categories** | An exponential B^A (internal hom) satisfies Hom(A x B, C) ~= Hom(A, C^B); a CCC has finite products and all exponentials; Set, Cat, and the category of small presheaves are CCCs; CCCs are the categorical semantics of simply typed lambda calculus | 11, 21 |
| 32 | [N] **Subobject classifiers and elementary toposes (preview)** | A subobject classifier Omega classifies monomorphisms via characteristic morphisms; an elementary topos is a CCC with finite limits and a subobject classifier; generalizes set theory (Set is a topos, presheaf categories are toposes, sheaf categories are toposes); gateway to categorical logic and geometry | 4, 15, 31 |
| 33 | [N] **Enriched categories (introduction)** | A category enriched over a monoidal category V replaces hom-sets with hom-objects in V; metric spaces are categories enriched over ([0,inf], >=, +) (Lawvere 1973); 2-categories are Cat-enriched; Ab-enriched categories underlie homological algebra | 1, 8, 26 |
| 34 | [N] **Kan extensions** | The left/right Kan extension of a functor K: C -> E along a functor F: C -> D is a functor D -> E satisfying a universal property; Mac Lane: "all concepts are Kan extensions"; limits, colimits, adjunctions, and ends are special cases | 8, 15, 21 |
| 35 | [N] **String diagrams and monoidal categories (preview)** | A monoidal category has a tensor product bifunctor and unit object satisfying coherence axioms; string diagrams are a graphical calculus for monoidal categories where morphisms are boxes and composition is spatial; fundamental for quantum computing, linguistics, and applied CT | 6, 7, 21 |

---

## Dependency Graph

```
                     EXTERNAL PREREQUISITES
        [Set Theory]   [Abstract Algebra]   [Topology]   [Linear Algebra]
             |               |                  |              |
             v               v                  v              v
       (1) CATEGORIES: OBJECTS, MORPHISMS, COMPOSITION  [REVIEW]
            |         |         |            |
            v         v         v            v
     (2) Examples  (3) Commut.  (5) Opposite   (6) Functors [REVIEW]
      [REVIEW]      diagrams    category          |
                   [REVIEW]    [REVIEW]           |
            |         |         |    |            |
            v         v         v    |            v
       (4) Iso/Mono/Epi       |    |      (7) Natural transformations
           [REVIEW]            |    |           [REVIEW]
            |    |             |    |            |    |
            |    |             |    |            v    v
            |    |             |    +----> (8) Functor categories [REVIEW]
            |    |             |                 |
            |    |             v                 v
            |    |      (16) Hom-functors  (9) Equivalence of categories
            |    |             |                 |
            v    |             v                 |
      (10) Initial &    (17) Representable       |
       terminal objects   functors               |
            |                  |                  |
            v                  v                  |
      (11) Products &   (18) YONEDA LEMMA -------+
       coproducts              |                  |
            |                  v                  |
            v           (19) Yoneda embedding     |
      (12) Universal           |                  |
       properties              v                  |
            |           (20) Presheaves &         |
            v                density              |
      (13) Equalizers &        |                  |
       coequalizers            |                  |
            |                  |                  |
            v                  |                  |
      (14) Pullbacks &        |                  |
       pushouts                |                  |
            |                  |                  |
            v                  v                  v
      (15) LIMITS & COLIMITS (general theory) <---+
            |           |           |
            v           v           v
      (25) RAPL   (21) ADJUNCTIONS (hom-set definition)
                        |         |        |         |
                        v         v        v         v
                  (22) Unit &  (23) Free- (24) Galois   (35) String
                   counit       forgetful  connections   diagrams &
                        |                  & order thy   monoidal cats
                        v
                  (26) MONADS FROM ADJUNCTIONS
                   /        |          \
                  v         v           v
           (27) Monads   (29) Kleisli  (33) Enriched
            as algebraic   category     categories
            theories                    (intro)
                  |
                  v
           (28) Eilenberg-Moore algebras
                  |
                  v
           (30) Monadicity & Beck's theorem
                  |
                  v
           (31) Exponentials & CCCs
                  |
                  v
           (32) Subobject classifiers & toposes (preview)

           (34) KAN EXTENSIONS
            (depends on 8, 15, 21)
```

### Detailed flow showing review vs. new material boundary

```
 REVIEW ZONE (Days 1-6)                NEW MATERIAL (Days 7-30)
 Student already has                   Target: build confident fluency
 working knowledge                     with these concepts
==================================    ====================================

 (1) Categories                        (9)  Equivalence of categories
  |                                     |
 (2) Examples --- (6) Functors         (10) Initial/terminal objects
  |                |                    |
 (3) Diagrams     (7) Nat. transf.    (11) Products/coproducts
  |                |                    |
 (4) Iso/mono/epi (8) Functor cats    (12) Universal properties
  |                                     |
 (5) Opposite cat                      (13) Equalizers/coequalizers
                                        |
                                       (14) Pullbacks/pushouts
                                        |
                        +-------> (15) LIMITS/COLIMITS <--------+
                        |               |                       |
                 (16) Hom-functors      |                       |
                        |               |                       |
                 (17) Representable     |                       |
                        |               |                       |
                 (18) YONEDA LEMMA      |                       |
                        |               |                       |
                 (19) Yoneda embed.     |                       |
                        |               |                       |
                 (20) Presheaves        |                       |
                                        v                       |
                                  (21) ADJUNCTIONS              |
                                   /    |    \                  |
                                  v     v     v                 |
                            (22) (23) (24)  (25) RAPL ----------+
                              Unit  Free  Galois
                                  |
                                  v
                            (26) MONADS
                             /    |    \
                            v     v     v
                          (27) (28) (29)
                          Alg  E-M  Kleisli
                                |
                                v
                          (30) Monadicity
                                |
                          (31) CCCs
                                |
                          (32) Toposes (preview)

                    (33) Enriched cats (from 1, 8, 26)
                    (34) Kan extensions (from 8, 15, 21)
                    (35) String diagrams (from 6, 7, 21)
```

---

## Bottleneck Concepts

These are the "gates" -- if the student does not solidify understanding here, everything downstream becomes unstable. The student's OT and origami backgrounds provide some helpful intuition for each gate, noted below.

| # | Concept | Why it is a bottleneck | Prior-topic bridge |
|---|---------|----------------------|--------------------|
| 12 | **Universal properties** | The entire second half of the course -- limits, adjunctions, representability, monads, Kan extensions -- rests on the idea that objects are characterized by universal mapping properties rather than internal construction. Students who cannot shift from "what is it made of?" to "what does it map to uniquely?" will hit a wall at every subsequent concept. This is the single hardest conceptual transition in the course. | The Kantorovich relaxation in OT is a universal property in disguise: the optimal transport plan is the "best" coupling, uniquely characterized by an optimization problem. Use this as a concrete anchor. |
| 18 | **The Yoneda lemma** | Conceptually the densest single result. It is the bridge between concrete computation (evaluating a functor at an object) and abstract structure (classifying all natural transformations out of a representable). Students who clear this gate gain a powerful new lens; those who do not will treat adjunctions and Kan extensions as opaque symbol-pushing. Understanding why Nat(Hom(A,-), F) ~= F(A) -- and what that means for mathematics -- requires integrating functors, natural transformations, hom-functors, and representability simultaneously. | Cayley's theorem for groups (every group embeds in a symmetric group) is the one-object-category special case. The student knows from origami that symmetry groups are single-object categories -- Yoneda generalizes this embedding to all categories. |
| 21 | **Adjunctions** | Adjunctions unify free constructions, limit preservation, monads, and Kan extensions. A student who understands the hom-set isomorphism Hom(FA, B) ~= Hom(A, GB) and can verify it in examples (free/forgetful, product/diagonal, quantifiers) can navigate the rest of the course. A student who does not will see monads as unmotivated definitions and Kan extensions as incomprehensible. | Kantorovich duality in OT is a concrete adjunction: the primal (transport plan) and dual (pricing) formulations mirror left and right adjoints. Galois connections between posets, which the student met in the origami number field hierarchy, are adjunctions between poset-categories. |
| 26 | **Monads from adjunctions** | Monads are the synthesis concept: they absorb adjunctions, encode algebraic theories, and connect to computation. A student who cannot see how composing GF from an adjunction F -| G produces a monad will not understand Eilenberg-Moore algebras, monadicity, or the Kleisli construction. | The Giry monad (probability measures as a monad on Meas) is exactly the categorical framework for the objects that optimal transport acts on. The student has worked with probability measures extensively in OT -- monads formalize the "wrap in a probability layer" operation. |
| 15 | **Limits and colimits (general theory)** | Products, equalizers, pullbacks, and terminal objects must unify into a single framework before the student can state what "right adjoints preserve limits" means. Without general limits, RAPL is a meaningless slogan and completeness is undefined. Many students can handle products and pullbacks individually but stumble when asked to recognize an arbitrary limit as a universal cone. | The student's experience with fixed-point and convergence arguments in OT (displacement interpolation, JKO gradient flows) provides intuition for limit-like constructions as "best approximations" that are universal among all compatible candidates. |

### Secondary gates (important but less catastrophic if shaky)

| # | Concept | Risk if weak |
|---|---------|-------------|
| 7 | **Natural transformations** | Supposed to be review, but many intermediate students can state the definition without truly internalizing the naturality condition. If the naturality square is not second nature by the time Yoneda arrives, the student will not be able to follow the proof or its applications. Verify during review days. |
| 22 | **Unit and counit** | The triangle/zig-zag identities are the workhorse of adjunction proofs. Students who think of adjunctions only via the hom-set bijection cannot prove that a specific pair of functors is adjoint when hom-sets are hard to compute directly. |
| 28 | **Eilenberg-Moore algebras** | The gateway to monadicity. Students who treat T-algebras as abstract symbols miss the point: T-algebras are the "structured objects" the monad describes (e.g., T-algebras for the free group monad are exactly groups). Without concrete examples, Beck's theorem is unmotivated. |

---

## Mind-Blowing Concepts

These are the "aha!" moments that drive engagement and make the power of abstraction tangible. Lesson days refer to the curriculum schedule.

| # | Concept | The "aha!" moment | Suggested day | Cross-topic resonance |
|---|---------|-------------------|---------------|----------------------|
| 5 | **Duality / opposite category** | "Every theorem you prove gives you a second theorem for free. Products and coproducts, limits and colimits, monos and epis -- all mirrors of each other. One proof, two results." | Day 5 (review) | Kantorovich duality in OT is a concrete instance: primal and dual formulations are "opposite" perspectives on the same optimization. The student already thinks dually. |
| 12 | **Universal properties** | "A product is NOT defined by what it is (pairs of elements). It is defined by what it DOES (receives projections). The same definition works for sets, groups, topological spaces, types in a programming language, and objects you have never seen before. The definition does not care what is inside." | Day 13 | In OT, the Kantorovich formulation characterizes the optimal plan by a universal property: it is the coupling that minimizes cost among all couplings with the correct marginals. The student has been using universal properties without the name. |
| 18 | **The Yoneda lemma** | "An object is completely determined by how every other object maps into it. You are your relationships. This single lemma is the most-used result in all of category theory, and it says that knowing all morphisms is the same as knowing the object itself." | Day 25 | Lawvere's insight that a metric space is a category enriched over [0,inf] means that in OT, the Wasserstein distance Hom(X,Y) determines the structure of the space of measures. Yoneda says this is always true: hom-data is complete data. |
| 19 | **Yoneda embedding** | "Every category -- no matter how abstract -- lives faithfully inside a category of 'generalized sets' (presheaves). Just as Cayley's theorem says every group is a permutation group, Yoneda says every category is a category of set-valued functors." | Day 26 | From origami: symmetry groups of crease patterns are single-object categories, and Cayley's theorem embeds them in symmetric groups. Yoneda generalizes this to ALL categories. The student's origami intuition for "groups as categories" is exactly the 1-object special case. |
| 21 | **Adjunctions** | "Free groups, tensor products, Stone-Cech compactification, existential and universal quantifiers, Galois connections -- they are all the SAME structure. Once you see adjunctions, you see them everywhere, and you cannot unsee them." | Day 20 | Kantorovich duality (primal transport plan vs. dual pricing) is an adjunction between optimization categories. Galois connections in the origami number field hierarchy (Pythagorean < Euclidean < origami) are adjunctions between poset-categories. The student has met adjunctions twice before without recognizing them. |
| 25 | **RAPL (right adjoints preserve limits)** | "This single theorem explains dozens of seemingly unrelated facts: why forgetful functors preserve products, why inverse image preserves intersections, why limits commute with limits. One proof replaces an entire chapter of verifications." | Day 23 | In OT, the pushforward of measures is a left adjoint operation, and left adjoints preserve colimits. This is why pushforward distributes over "sums" (mixtures) of measures. |
| 26 | **Monads** | "A monad captures the essence of algebraic structure itself. Every variety of algebras (groups, rings, lattices, Boolean algebras) arises as algebras over a monad. And in Haskell, list comprehensions, exceptions, state, and I/O all follow the same pattern -- they are all monads." | Day 27 | The Giry monad formalizes probability measures as a monad on measurable spaces. The unit eta: X -> PX sends a point to its Dirac delta. The multiplication mu: PPX -> PX sends a measure on measures to its expected measure. The student's entire OT course operated on Giry-monad objects. |
| 33 | **Enriched categories** | "Lawvere proved that a metric space is just a category where the hom-sets are not sets but distances: Hom(x,y) = d(x,y), composition is the triangle inequality, and identity is d(x,x) = 0. The entire Wasserstein space you studied in OT is an enriched category." | Day 29 (preview) | This is the deepest connection to OT. The student spent weeks working inside Wasserstein space, which IS an enriched category over ([0,inf], +, 0). This reframes everything they learned about metric structure as category theory. |
| 34 | **Kan extensions** | "Limits, colimits, adjunctions, the Yoneda lemma -- they are ALL special cases of Kan extensions. Mac Lane said: 'The notion of Kan extension subsumes all the other fundamental concepts of category theory.' One concept to rule them all." | Day 29 (preview) | -- |

---

## Common Misconceptions

| Concept | Misconception | Reality |
|---------|--------------|---------|
| **Categories** (1) | "Objects are sets and morphisms are functions." | Objects and morphisms are abstract. A preorder is a category (at most one morphism between any two objects). A monoid is a one-object category. A group is a one-object groupoid. The student already knows this from origami: wallpaper groups are single-object categories with invertible morphisms. Morphisms need not be functions -- they are arrows satisfying the composition and identity axioms, nothing more. |
| **Functors** (6) | "A functor maps objects to objects -- the morphism part is a technicality." | The morphism mapping is the essential part. Two functors that agree on objects but differ on morphisms are different functors. In fact, a functor is more constrained by its action on morphisms (must preserve composition and identities) than by its action on objects. From OT: pushforward of measures is functorial precisely because it respects composition of measurable maps. |
| **Natural transformations** (7) | "Naturality is just 'the components commute with everything' -- a bureaucratic condition." | Naturality captures the deepest uniformity in mathematics. A transformation is natural when it is "defined without arbitrary choices." The determinant det: GL_n(k) -> k* is a natural transformation; a map that picks a specific eigenvector is not, because eigenvector choice depends on a basis (a non-canonical choice). Naturality separates structural from accidental. |
| **Isomorphism vs. equality** (4) | "Isomorphic objects are 'basically equal' -- we can always substitute one for the other." | Isomorphic objects are interchangeable only up to the chosen isomorphism, and the choice can matter. A finite-dimensional vector space V is isomorphic to its dual V*, but the isomorphism requires choosing a basis (not canonical). V is also isomorphic to its double dual V**, and THIS isomorphism is canonical (natural). The distinction between "isomorphic" and "naturally isomorphic" is one of the main points of the entire subject. |
| **Universal properties** (12) | "The universal property is just one way to define a construction; the 'real' definition is the explicit one (pairs, equivalence classes, etc.)." | The universal property IS the real definition. Explicit constructions are existence proofs -- they show a construction satisfying the universal property exists in a particular category. The universal property tells you what the construction does; the explicit construction tells you how to build one particular model of it. Different categories satisfy the same universal property with very different-looking objects. |
| **Limits** (15) | "A limit is a 'biggest' or 'smallest' object, like a supremum." | A limit is a universal cone -- the "most efficient" way to map into a diagram. It need not be bigger or smaller in any size sense. A terminal object (a limit of the empty diagram) is often a singleton, the smallest non-empty set. A product A x B (a limit) is typically "bigger" than A or B individually. Limits are not about size; they are about universal factorization. |
| **Yoneda lemma** (18) | "The Yoneda lemma is too abstract to be practically useful -- just a formal result." | It is arguably the most applied result in category theory. It proves objects are determined by their morphisms. It justifies the "generalized elements" technique (treating morphisms X -> A as "X-shaped elements of A"). It underpins representability arguments throughout algebra, geometry, and CS. If you have used Cayley's theorem, or the fact that a group is determined by its multiplication table, you have used a special case. |
| **Adjunctions** (21) | "An adjunction is basically a pair of inverse functors." | An adjunction is much weaker than an equivalence. The unit eta: Id -> GF and counit epsilon: FG -> Id are generally NOT isomorphisms. F and G can go between wildly different categories (e.g., the free group functor Set -> Grp and the forgetful functor Grp -> Set). An equivalence of categories is an adjunction where unit and counit happen to be natural isomorphisms -- a very special case. |
| **Adjunctions** (21) | "The hom-set bijection is the only way to think about adjunctions." | There are at least four equivalent formulations: (i) hom-set bijection, (ii) unit/counit with triangle identities, (iii) universal arrows, (iv) initial objects in comma categories. Each illuminates different aspects. Students who know only the hom-set version struggle when the other formulations appear in proofs. |
| **Monads** (26) | "Monads are a Haskell concept for handling side effects in functional programming." | Monads were introduced in category theory in the 1950s-60s by Godement, Huber, Eilenberg, Moore, Kleisli, and Beck -- decades before Haskell existed. In mathematics, monads capture algebraic theories (groups, rings, lattices are all monadic over Set). Moggi's 1991 paper applied this pre-existing categorical concept to programming language semantics. The Haskell Monad typeclass is one computational application of a far more general mathematical structure. |
| **Duality** (5) | "The opposite category is just a notational trick -- reversing arrows does not produce real mathematics." | Duality is one of the most powerful proof techniques in category theory. Every theorem about products immediately gives a theorem about coproducts. Every theorem about limits gives one about colimits. Monomorphisms dualize to epimorphisms, right adjoints to left adjoints, algebras to coalgebras. Proving one theorem and dualizing it is not a trick; it is the categorical version of getting two theorems for the price of one. |
| **Monads and OT** (cross-topic) | "The Giry monad is just a formalism -- it does not add anything to probability theory that measure theory does not already provide." | The Giry monad reveals that the operation "form the space of probability measures on X" is not just a construction but a monad with specific compositional structure: unit = Dirac delta, multiplication = expectation (averaging over measures-on-measures). This monad structure is what makes probability theory "algebraic" and is the categorical reason why Bayesian updating, conditioning, and disintegration have the structure they do. The student's OT work sits inside this monad. |

---

## Prerequisite Topics

### External prerequisites (mathematical background)

| External Topic | Level Needed | Which Concepts It Enables | Student Status |
|---------------|-------------|--------------------------|---------------|
| **Naive set theory** | Solid: sets, subsets, power sets, Cartesian products, functions, injections, surjections, bijections, equivalence relations, quotients | 1, 2, 4, 10, 11, 16, 19 | Assumed solid from OT and origami coursework |
| **Abstract algebra** | Intermediate: groups, homomorphisms, subgroups, normal subgroups, quotient groups, free groups; basic rings and modules | 2, 4, 6, 9, 23, 27, 28 | Partially covered via origami (wallpaper groups, field extensions, Galois theory); may need reinforcement on free algebraic constructions |
| **General topology** | Basic: topological spaces, continuous maps, open/closed sets, homeomorphisms, product and quotient topologies, compactness | 2, 11, 14, 15, 32 | Assumed from OT (weak convergence, Wasserstein topology) |
| **Linear algebra** | Intermediate: vector spaces, linear maps, dual spaces, tensor products, dimension | 2, 4, 16, 18, 31 | Assumed solid |
| **Order theory** | Basic: partial orders, meets, joins, lattices, Galois connections | 2, 10, 15, 21, 24 | Partially covered via origami (Alperin's constructibility hierarchy) |
| **Logic and proof technique** | Comfortable with: quantifiers, implication, proof by contradiction, universal and existential reasoning, commutative diagrams as proof obligations | 1, 3, 12, 18 | Assumed from mathematical maturity |

### Completed prerequisite topics (internal -- the student's prior coursework)

| Prior Topic | Shared Concepts that Give a Head Start | Key Bridge Moments |
|-------------|---------------------------------------|-------------------|
| **Optimal Transport** | Duality (Kantorovich), metric spaces (Wasserstein), functoriality (pushforward), linear programming, weak convergence, measure theory, couplings as spans | (21) Adjunctions: Kantorovich duality is an adjunction. (26) Monads: Giry monad formalizes probability measures. (33) Enriched categories: Wasserstein space is an enriched category. (18) Yoneda: hom-data (distances) determines metric structure. (25) RAPL: pushforward preserves colimits because it is a left adjoint. |
| **Origami Mathematics** | Group theory/symmetry, field extensions/Galois theory, graph theory, composition of transformations, computational universality, isomorphism, combinatorial structures | (1) Categories: wallpaper groups are one-object categories. (6) Functors: fold composition is functorial. (9) Equivalence: equivalent crease patterns under symmetry. (19) Yoneda embedding: Cayley's theorem (origami symmetry groups embed in permutation groups) is the 1-object case. (31) CCCs: Turing completeness of flat origami connects to cartesian closed categories via Curry-Howard-Lambek. |

### Optional but helpful background

| Topic | Why It Helps | Which Concepts It Enriches |
|-------|-------------|---------------------------|
| **Haskell or typed functional programming** | Types as objects, functions as morphisms, type constructors as functors, Functor/Monad typeclasses; gives executable intuition for abstract concepts | 6, 17, 26, 29, 31 |
| **Homological algebra** | Chain complexes, exact sequences, derived functors; provides rich examples of limits, adjunctions, and abelian categories | 13, 15, 21, 34 |
| **Algebraic geometry** | Schemes, sheaves, presheaves; provides motivation for presheaf categories, Grothendieck topologies, and topos theory | 19, 20, 32 |

---

## Study Path Summary

The course divides into five modules, with the review phase compressed for this intermediate student:

1. **The Language of Structure (concepts 1-5, days 1-6):** Rapid pass through categories, examples, diagrams, iso/mono/epi, and duality. The goal is not re-teaching but deepening: fill gaps, sharpen intuition, ensure diagram chasing is second nature. Surface connections to OT and origami throughout.

2. **Maps Between Worlds (concepts 6-9, days 7-12):** Functors (covariant and contravariant), natural transformations, functor categories, and equivalence of categories. This module bridges review and new material -- functors are review but must be deepened, and equivalence of categories is genuinely new. The naturality condition must become second nature before Yoneda arrives.

3. **The Art of Universal Construction (concepts 10-17, days 13-19):** Products, coproducts, equalizers, pullbacks, the general theory of limits and colimits, hom-functors, representable functors, and completeness. The universal property pattern becomes the main tool. This is the hardest conceptual transition: from "building things" to "characterizing things by what they do."

4. **The Deep Symmetry of Adjunctions (concepts 21-25, days 20-24):** Free-forgetful adjunctions, hom-set and unit-counit definitions, examples (Galois connections, Kantorovich duality), and RAPL. Adjunctions unify free constructions and limit preservation. Cross-references to OT peak here.

5. **Yoneda, Monads, and the Frontier (concepts 18-20, 26-29, 31-35, days 25-30):** The Yoneda lemma and embedding, monads from adjunctions, Kleisli and Eilenberg-Moore categories, and Moggi's computational monads. The final days survey monoidal categories, enriched categories, toposes, higher categories, Kan extensions, and applied CT -- enough to understand each direction and decide where to go next. Enriched categories are the deepest OT connection; string diagrams open the door to applied CT and quantum computing.
