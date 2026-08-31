# Category theory — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 14 lessons (41%)
- **Socratic questions** — 7 lessons (21%)
- **review and consolidation sessions** — 5 lessons (15%)
- **real-world application challenges** — 4 lessons (12%)
- **teach-back exercises (student explains)** — 3 lessons (9%)
- **curated resource exploration** — 1 lessons (3%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 35% accessible (1-2), 29% standard (3), 35% challenging (4-5).

Difficulty peaks:
- Day 10: "What makes the hom-functor special?" (difficulty 4)
- Day 15: "What does it mean for functors to form a category?" (difficulty 4)
- Day 17: "How do natural isomorphisms show equivalence?" (difficulty 4)
- Day 22: "Why are limits the ultimate generalization?" (difficulty 4)
- Day 23: "How do colimits build things from parts?" (difficulty 4)

## Domain Hooks
- **The Yoneda perspective as philosophy** — "An object is determined by maps into it" connects to structuralism in philosophy of mathematics. Drop this when discussing Yoneda embedding (lesson 23).

- **Curry-Howard-Lambek correspondence** — Logic, computation, and categories are the same thing under different lenses. Propositions are types, proofs are programs, and both are morphisms in categories. Mention when connecting to programming (lessons 4, 8, 14, 29).

- **Categorical foundations of mathematics** — Category theory as an alternative to set theory for foundations (ETCS, elementary theory of the category of sets). Introduce briefly in lesson 1, revisit if student shows interest.

- **Physics applications** — Topological quantum field theory, gauge theory, string theory all use category theory. Drop this in lesson 30 if student has physics background.

- **Categorical logic** — Topoi as categorical models of logic, internal languages of categories. Advanced topic but fascinating

## Common Failure Modes
1. **"Objects have properties we can inspect"** — In category theory, objects are opaque. Only morphisms and relationships matter. Students trained in set theory want to "look inside" objects; redirect them to study arrows instead. Counter with: "an object is determined entirely by maps into and out of it" (this foreshadows Yoneda).

2. **"Functors are just functions between categories"** — Functors must preserve structure: F(g ∘ f) = F(g) ∘ F(f) and F(id) = id. Students often forget to check these axioms. Emphasize that structure preservation is what makes category theory work.

3. **"Natural transformations are hard to visualize"** — Students get lost in the formalism. Draw pictures: a natural transformation is a "systematic way to convert one functor into another" with components at each object, and all naturality squares must commute. Programming analogy: polymorphic functions like `reverse : [a] → [a]` are natural transformations.

4. **"Universal properties are about existence"**

## Vocabulary
Key terms for this domain: categories, objects, morphisms, composition, identity morphisms, associativity, category axioms, concrete categories, Set, Grp, Top, types as objects, functions as morphisms, programming examples, opposite categories (and 92 more).