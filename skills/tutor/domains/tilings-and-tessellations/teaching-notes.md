# Tilings and Tessellations — Teaching Notes

## Approach

This topic is highly visual and benefits enormously from interactive exploration. At the intermediate level, balance concrete construction (building Penrose patches, experimenting with Wang tiles) with mathematical rigor (proving aperiodicity, understanding undecidability). The subject sits at a beautiful intersection of geometry, combinatorics, algebra, and computer science — lean into these connections. Encourage hands-on play: students should generate tilings, not just read about them.

Use the historical narrative as a through-line: the journey from "5-fold symmetry is impossible" (crystallographic restriction) to Penrose's discovery to Shechtman's Nobel-winning quasicrystals makes for compelling pedagogy.

## Common Misconceptions

1. **"Aperiodic just means it doesn't repeat"**
   - Why students get this wrong: The word sounds like "not periodic"
   - How to correct: Emphasize the difference between *a tiling* being non-periodic (one instance doesn't repeat) vs. *a tile set* being aperiodic (all valid tilings are forced to be non-periodic). Example: You can arrange Penrose tiles periodically if you ignore the matching rules, but the rules *force* aperiodicity.

2. **"The matching rules are arbitrary decorations"**
   - Why students get this wrong: They look like aesthetic choices
   - How to correct: Show what happens without matching rules—you get periodic tilings. The rules encode geometric constraints that force the hierarchical structure.

3. **"Wang tiles are about colors"**
   - Why students get this wrong: They're usually presented with colored edges
   - How to correct: Colors are just labels representing any matching constraint (shapes, symbols, numbers). The mathematics is about edge compatibility, not color per se.

4. **"You can always tell if a tile set will tile the plane by trying"**
   - Why students get this wrong: Seems like you could just experiment
   - How to correct: This is exactly what the domino problem says is undecidable. No algorithm can determine this for all Wang tile sets. Connect to halting problem if they know computability theory.

5. **"Penrose tilings have perfect 5-fold symmetry everywhere"**
   - Why students get this wrong: They see 5-fold symmetry in pictures
   - How to correct: The tiling has *local* patches with 5-fold symmetry, but the global structure is aperiodic and doesn't have a single center of 5-fold rotation for the whole plane.

6. **"Quasicrystals are 'almost' periodic"**
   - Why students get this wrong: The prefix "quasi" suggests approximation
   - How to correct: Quasicrystals are *not* periodic at all—they're genuinely aperiodic. "Quasi-periodic" means they have long-range order without periodicity, not "almost periodic."

7. **"All aperiodic tilings use substitution"**
   - Why students get this wrong: Penrose and most famous examples are substitution tilings
   - How to correct: Substitution is a *construction method*. Aperiodicity is a *property*. You can have aperiodic tilings that aren't substitution tilings (e.g., some cut-and-project tilings).

8. **"The golden ratio appears because Penrose liked it"**
   - Why students get this wrong: Seems like a design choice
   - How to correct: φ emerges naturally from the geometry and substitution rules. It's not imposed—it's a mathematical consequence of the inflation process and the tile angles.

## Level Adjustments

### For this intermediate level:
- **Include proofs** but keep them accessible (proof that kite-and-dart forces aperiodicity via deflation argument; proof sketch of undecidability)
- **Balance concrete and abstract** — always ground abstract concepts (finite local complexity, repetitivity) in concrete tilings they can visualize
- **Use linear algebra** for substitution matrices and eigenvalues, but don't require deep matrix theory
- **Touch on computability** for Wang tiles without requiring a full computability course
- **Emphasize connections** between topics rather than treating them in isolation

### If teaching beginners instead:
- Skip undecidability proofs; just state the result
- Focus more on construction and pattern recognition, less on formal properties
- Use more interactive tools, fewer formal definitions
- Skip substitution matrices entirely

### If teaching advanced students instead:
- Dive deeper into algebraic theory (tiling spaces, continuous hulls)
- Cover cut-and-project method for quasicrystals
- Explore spectral theory and diffraction
- Discuss cohomology of tiling spaces
- Cover recent results (hat monotile, spectre tile)

## Rabbit Holes

### When to introduce:

- **The hat and spectre monotiles (2023)** — drop this in lesson 7 when discussing aperiodic prototiles. This is brand new mathematics! Great for showing that the field is alive.

- **Islamic geometric art** — introduce around lesson 26 or as enrichment. The Darb-i Imam shrine in Isfahan (1453) has patterns eerily similar to Penrose tilings, 500 years earlier. Fascinating historical rabbit hole.

- **Cut-and-project method** — for advanced students who finish early. Aperiodic tilings as projections of periodic higher-dimensional lattices. Mind-bending geometry.

- **The Socolar-Taylor monotile** — lesson 7 context. Single tile that forces aperiodicity, but requires non-local matching rules (tiles must match across gaps). Philosophical: what counts as a valid tile?

- **Penrose's toilet paper patent** — fun historical aside (lesson 12). Penrose patented Penrose tilings for toilet paper decoration. Later sued Kimberly-Clark for unauthorized use. Shows IP issues in pure math!

- **Al-chemistry and forbidden fivefold symmetry** — medieval belief that 5-fold symmetry was supernatural/impossible. Broken by Penrose mathematically and Shechtman experimentally.

- **The Einstein problem** — "ein stein" = one stone in German. The search for a single aperiodic tile. Solved in 2023 after decades.

## Difficulty Progression

The curriculum follows this arc:

1. **Gentle start (lessons 1-5)** — periodic tilings are familiar; build confidence with regular polygons and wallpaper groups
2. **First conceptual jump (lessons 6-10)** — aperiodicity is counterintuitive; substitution rules require new thinking
3. **First review (lesson 11)** — consolidate before diving into Penrose
4. **Peak complexity (lessons 12-17)** — Penrose tilings require spatial reasoning, matching rule logic, and proof techniques all together
5. **Second review (lesson 18)** — pause before switching to Wang tiles
6. **Different complexity flavor (lessons 19-23)** — Wang tiles shift from geometric to computational/logical reasoning. Undecidability is conceptually hard but doesn't require new spatial skills.
7. **Integration and applications (lessons 24-26)** — tie everything together; easier because it's synthesis of learned material, not new concepts

Expect students to struggle most with:
- Lessons 10, 15-16 (abstract properties, proof that deflation forces aperiodicity)
- Lesson 20 (undecidability — requires different thinking mode)

These are marked difficulty 4 and deserve extra time and scaffolding.
