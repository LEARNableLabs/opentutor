# Category Theory — Teaching Notes

## Approach

Category theory at the intermediate level requires balancing high abstraction with concrete examples. The key pedagogical challenge is that category theory is about structure and relationships, not computations or explicit constructions — students must shift from "what things are" to "how they relate." Start every concept with familiar examples (Set, Grp, programming types) before moving to the abstract definition. Use commutative diagrams as the primary visual language, building fluency gradually. The subject is proof-heavy but not computation-heavy; emphasize diagram chasing and universal property arguments over calculation. Interleave pure examples (categories of mathematical structures) with applied ones (programming, databases, physics) to maintain engagement and show the power of abstraction.

## Common Misconceptions

1. **"Objects have properties we can inspect"** — In category theory, objects are opaque. Only morphisms and relationships matter. Students trained in set theory want to "look inside" objects; redirect them to study arrows instead. Counter with: "an object is determined entirely by maps into and out of it" (this foreshadows Yoneda).

2. **"Functors are just functions between categories"** — Functors must preserve structure: F(g ∘ f) = F(g) ∘ F(f) and F(id) = id. Students often forget to check these axioms. Emphasize that structure preservation is what makes category theory work.

3. **"Natural transformations are hard to visualize"** — Students get lost in the formalism. Draw pictures: a natural transformation is a "systematic way to convert one functor into another" with components at each object, and all naturality squares must commute. Programming analogy: polymorphic functions like `reverse : [a] → [a]` are natural transformations.

4. **"Universal properties are about existence"** — They're about uniqueness up to isomorphism. There might be many products, but they're all "the same" via unique isomorphism. Students confuse "unique" (there's only one) with "unique up to unique isomorphism" (there may be many, but they're canonically equivalent).

5. **"The Yoneda lemma is deep and complicated"** — The proof is a mechanical diagram chase. The depth is in what it means: objects are determined by their relationships. Students who focus on the proof mechanics miss the philosophy. Spend time on interpretation, not just verification.

6. **"Adjunctions are symmetric"** — If F ⊣ G, it does NOT mean G ⊣ F (though this can happen). Left adjoints and right adjoints have different properties (e.g., left adjoints preserve colimits, right adjoints preserve limits). Students confuse adjunctions with equivalences.

7. **"Duality is just a trick"** — Duality (reversing arrows) is a fundamental feature of category theory. Every theorem has a dual. Students sometimes treat it as a notational curiosity; emphasize that it's a deep structural principle.

8. **"Monads are just a programming thing"** — Monads originated in category theory as endofunctor compositions from adjunctions. The programming connection (Haskell, etc.) is an application, not the definition. Present the categorical origin first, then show the computational interpretation.

9. **"Commutative diagrams are just decoration"** — Diagrams are the primary reasoning tool. Students need to learn "diagram chasing": following arrows, composing paths, verifying commutativity. This is how you prove things in category theory.

10. **"You need to know all of mathematics to learn category theory"** — Category theory is abstract but doesn't require deep knowledge of every example category. Students can learn with just Set, Grp, and basic programming types. Deep examples from topology, algebraic geometry, etc., enrich understanding but aren't prerequisites.

## Level Adjustments

### For Intermediate Level (Target)
- Assume comfort with abstract algebra (groups, rings), proofs, and set theory
- Formalism is important: give precise definitions, state axioms, verify properties
- Balance examples from pure math (Set, Grp, Top) and applied domains (programming, databases)
- Cover core theory: categories through adjunctions, touch on monads
- Difficulty peaks: hom-functors (contravariance), Yoneda, adjunctions
- Skip: higher category theory, enriched categories, topos theory (save for advanced level)

### Adjustments from Basic Level
- **More**: Formal proofs, abstract examples, functors as primary objects, Yoneda lemma
- **Less**: Hand-holding with examples, explicit computations, avoiding duality
- At basic level, you'd spend more time on concrete categories and skip Yoneda entirely

### Adjustments from Advanced Level
- **Less**: Enriched categories, 2-categories, monoidal categories, topos theory, homotopy type theory
- **More**: Explicit examples, motivation for each concept, computational applications
- At advanced level, you'd assume Yoneda is "obvious" and move quickly to higher structures

## Rabbit Holes

- **The Yoneda perspective as philosophy** — "An object is determined by maps into it" connects to structuralism in philosophy of mathematics. Drop this when discussing Yoneda embedding (lesson 23).

- **Curry-Howard-Lambek correspondence** — Logic, computation, and categories are the same thing under different lenses. Propositions are types, proofs are programs, and both are morphisms in categories. Mention when connecting to programming (lessons 4, 8, 14, 29).

- **Categorical foundations of mathematics** — Category theory as an alternative to set theory for foundations (ETCS, elementary theory of the category of sets). Introduce briefly in lesson 1, revisit if student shows interest.

- **Physics applications** — Topological quantum field theory, gauge theory, string theory all use category theory. Drop this in lesson 30 if student has physics background.

- **Categorical logic** — Topoi as categorical models of logic, internal languages of categories. Advanced topic but fascinating. Mention if student is interested in logic.

- **Higher category theory** — 2-categories, n-categories, ∞-categories. The frontier of current research. Point to this in lesson 30 as "what comes next."

- **The nLab rabbit hole** — https://ncatlab.org/ is infinitely deep. Great reference but easy to get lost. Warn students: use it for definitions, not for first learning.

- **Bartosz Milewski's blog and videos** — Excellent for programmers. His "Category Theory for Programmers" series is a treasure. Reference throughout for students with coding background.

- **Diagram chasing as proof technique** — The "element-free" style of categorical proofs is elegant but unfamiliar. Students trained in set theory want to chase elements; teach them to chase arrows instead.

- **Free constructions everywhere** — Free groups, free monoids, free categories — "free" is a categorical concept (left adjoint to forgetful functor). Once you see it, you see it everywhere. Emphasize in lessons 7, 24, 25.

## Difficulty Progression

The curriculum is structured as a series of climbs and consolidations:

1. **Lessons 1-5** (Foundations): Gentle start, difficulty 2-3. Introduce categories through familiar examples.
2. **Lessons 6-10** (Functors): First climb to difficulty 3-4 (hom-functors), then review (lesson 10).
3. **Lessons 11-14** (Natural Transformations): Steady difficulty 3-4, introduces functor categories.
4. **Lessons 15-20** (Universal Constructions): Long climb through products, limits, colimits (difficulty 3-4 sustained), then review (lesson 20).
5. **Lessons 21-23** (Yoneda): The peak. Difficulty 4-5 at lesson 22 (Yoneda lemma itself).
6. **Lessons 24-28** (Adjunctions): Another peak (difficulty 4-5 at lesson 27), then review (lesson 28).
7. **Lessons 29-30** (Monads & Applications): Payoff. Lower difficulty 2-4, focus on applications and future directions.

Reviews are strategically placed every 5-7 lessons before difficulty spikes. Each review consolidates previous material and prepares for the next climb.

## Delivery Variations

- **Mini-lessons** (most common): Standard expository format. Define concept, give examples, prove a small result.
- **Questions**: Lead with a conceptual question, have student work through it, then reveal the answer and implications.
- **Real-world**: Connect abstract concept to concrete application (programming, physics, databases). Motivate through use cases.
- **Teach-back**: Have student explain a concept back to you in their own words. Checks understanding, reinforces learning.
- **Resource-drop**: Curate external resources (videos, articles, tools) and have student explore. Good for applications and optional enrichment.
- **Review**: Spaced repetition of previous material. Mix questions, examples, and synthesis across topics.

Vary delivery types to maintain engagement. Not everything should be a formal mini-lesson.

## Teaching Tone

Category theory can feel intimidating — combat this with approachable language, frequent examples, and acknowledgment of difficulty. When introducing Yoneda or adjunctions, say "this is hard, and that's okay." Celebrate small wins: understanding functors is a real achievement. Use humor and humility: "Category theory is abstract because it's designed to work everywhere, which means it looks like nothing in particular." Encourage questions. Expect students to need multiple passes at peak concepts (Yoneda, adjunctions). Review is not failure; it's how learning works.

## Time Estimates

At one lesson per session:
- Full curriculum: ~30 sessions (about 6 weeks at 5 lessons/week)
- Review days factor in spaced repetition
- Adjust pacing based on student: combine lessons if they're breezing through, split lessons if they're struggling
- Yoneda (lessons 21-23) may need extra time — consider spreading over 4-5 sessions
- Final lessons (29-30) are shorter, can be combined

## Assessment Strategies

- **Diagram chasing**: Can the student verify a naturality square? Prove a universal property?
- **Example construction**: Given a category, can they construct functors, products, limits?
- **Duality**: Can they state the dual of a theorem and explain why it's true?
- **Application**: Can they recognize categorical patterns in code, math, or other domains?
- **Explanation**: Can they explain Yoneda, adjunctions, or monads to someone else?

Category theory is about understanding structure, not memorizing facts. Test conceptual grasp, not rote knowledge.
