# Teaching Notes: Origami Mathematics (Intermediate Level)

---

## 1. Approach

### What makes this topic pedagogically unique

Origami mathematics is among the rare mathematical subjects where a student can physically construct the objects under study with nothing more than a sheet of paper. This creates a pedagogical feedback loop unavailable in most of pure mathematics: conjecture a theorem, fold paper to test it, then formalize the proof. The course should exploit this loop relentlessly.

**The teaching rhythm is: fold first, formalize second, compute third.**

At the intermediate level, the student has enough algebraic maturity to follow proofs but still benefits enormously from physical intuition. Every major theorem in flat-foldability (Kawasaki, Maekawa, layer ordering) should be discovered hands-on before being stated formally. The student should fold a single-vertex crease pattern, measure the alternating angles, notice the pattern, then see why it must be true. This is not a concession to informality -- it is how the original researchers (Hull, Kawasaki, Justin) developed the theory.

**Three pedagogical modes interleave throughout the course:**

1. **Experimental/physical.** Folding paper, measuring angles, counting creases, testing rigidity. Dominates the early modules (flat-foldability foundations, axiom discovery) and returns whenever a new geometric structure is introduced (tessellations, rigid origami, Miura-ori).

2. **Algebraic/proof-based.** Formalizing observations into theorems, working through proofs of Kawasaki-Justin, Maekawa, and the constructibility hierarchy. This is the core intellectual content and should not be softened, but proofs should always follow physical motivation.

3. **Computational/algorithmic.** Understanding the algorithms behind TreeMaker, Origamizer, and the NP-hardness results. At the intermediate level, this means understanding the problem formulations and key reductions, not implementing the algorithms from scratch.

**Essential supplies:** The student needs paper (standard kami and also plain printer paper for crease-pattern experiments), a ruler, a protractor, and access to Origami Simulator (https://origamisimulator.org/). Every lesson that introduces a new theorem or structure should include a specific folding exercise. Do not treat folding as optional enrichment -- it is the primary mode of understanding.

**Pacing note:** Resist the temptation to race through theorems. The 1% rule applies strongly here. A student who deeply understands Kawasaki's theorem -- can state it, prove it, apply it to novel crease patterns, and explain why it is necessary but not sufficient -- has gained more than one who has superficially seen all of flat-foldability plus constructibility plus computational complexity. Depth over breadth, always.

---

## 2. Common Misconceptions

### Misconception 1: "Kawasaki's theorem is both necessary and sufficient for flat-foldability"

**Why students get this wrong:** Kawasaki's theorem (alternating angle sums equal 180 degrees at each vertex) is the first major result students encounter, and it is clean and satisfying. Students naturally assume it settles the question of when a crease pattern folds flat.

**The correction:** Kawasaki's theorem is necessary but not sufficient, even at a single vertex. It guarantees that the angles permit flat folding, but says nothing about whether a consistent mountain-valley assignment exists, and nothing about whether layers can be ordered without self-intersection. A crease pattern can satisfy Kawasaki at every vertex and still be impossible to fold flat due to global layer-ordering conflicts. This is precisely where the NP-hardness result of Bern and Hayes (1996) enters: determining whether a valid mountain-valley assignment with consistent layer ordering exists is computationally intractable.

**How to surface it:** After the student has internalized Kawasaki's theorem (around Day 8-9), present a crease pattern that satisfies Kawasaki at every vertex but cannot be folded flat. Have them try to fold it physically. The failure is the lesson.

### Misconception 2: "Mountain and valley folds are just labels -- you can swap them freely"

**Why students get this wrong:** On a single isolated crease, flipping mountain to valley (or vice versa) just means folding the other way. Students generalize this to entire crease patterns.

**The correction:** Maekawa's theorem constrains the relationship: at any interior vertex of a flat-foldable crease pattern, the number of mountain folds and valley folds must differ by exactly 2 (i.e., M - V = plus or minus 2). Swapping all mountain and valley assignments produces another valid assignment (this is the M-V duality), but swapping individual creases arbitrarily will violate Maekawa's constraint. Furthermore, even when Maekawa is satisfied locally, the layer ordering may be inconsistent globally. The mountain-valley assignment carries genuine geometric content.

**How to surface it:** Have the student fold a simple flat model (a waterbomb base works well), then try to refold it with one mountain-valley crease swapped. The paper will fight them.

### Misconception 3: "Origami constructions are more powerful than compass-and-straightedge because you have more freedom of movement"

**Why students get this wrong:** The intuitive explanation -- "you can do more with folding than with a compass" -- sounds like a vague claim about physical dexterity rather than a precise algebraic statement.

**The correction:** The power difference is algebraic, not physical. Compass-and-straightedge constructions can solve quadratic equations (and thus construct any number in the quadratic closure of the rationals). Single-fold origami axioms (the Huzita-Justin axioms, especially Axiom 6, the Beloch fold) can solve cubic equations. This means origami can construct cube roots, which allows angle trisection and cube doubling -- both impossible with compass and straightedge. The key object is the "origami number field," which strictly contains the field of Euclidean-constructible numbers.

**How to surface it:** Walk through the angle trisection construction explicitly. Have the student perform it on paper and verify with a protractor. Then explain why it works by connecting the fold to the solution of a specific cubic equation. The Mathigon interactive (https://mathigon.org/course/euclidean-geometry/origami) supports this well.

### Misconception 4: "Rigid origami means the paper itself is rigid"

**Why students get this wrong:** The phrase "rigid origami" sounds like it describes the material property of the sheet.

**The correction:** In rigid origami, the faces (the flat regions between creases) are modeled as rigid panels, while the creases function as hinges. The paper as a whole is flexible -- it folds -- but each individual face does not bend or stretch during folding. This is the kinematic model that matters for engineering applications: a solar panel array made of rigid panels connected by hinges is rigid origami, even though the overall structure changes shape. The mathematical question is: given a crease pattern, does a continuous rigid folding motion exist from the flat state to the target state?

**How to surface it:** Give the student a Miura-ori crease pattern printed on cardstock (which is approximately rigid). Have them fold it and observe that the entire structure deploys in one degree of freedom, with no face bending. Then try the same pattern on thin paper and note the face bending that occurs -- this is not rigid origami, even though it reaches the same final shape.

### Misconception 5: "Flat-foldability is a local property -- if every vertex folds flat, the whole thing folds flat"

**Why students get this wrong:** Both Kawasaki's and Maekawa's theorems are local (per-vertex) conditions. After learning these, students assume that checking every vertex suffices.

**The correction:** Flat-foldability has both local and global aspects. Local conditions (Kawasaki, Maekawa) are necessary but not sufficient. The global condition involves layer ordering: when multiple layers of paper stack on top of each other, no two layers may penetrate. Determining whether a globally consistent layer ordering exists is the NP-hard part (Bern and Hayes 1996). In practice, this means crease patterns can satisfy all local conditions at every vertex and still be impossible to fold flat because of non-local interactions between distant parts of the paper.

**How to surface it:** This is best demonstrated with a crease pattern that has three or more vertices. The student should verify Kawasaki and Maekawa at each vertex, then attempt to fold it and discover that the paper self-intersects no matter what they try. This typically arises around Day 10-11 when multi-vertex crease patterns are introduced.

### Misconception 6: "The Huzita-Justin axioms are analogous to Euclid's axioms -- they are the starting assumptions of origami geometry"

**Why students get this wrong:** The word "axiom" suggests foundational assumptions from which everything else is derived, as in Euclidean geometry.

**The correction:** The Huzita-Justin axioms are not foundational postulates but rather a classification of all possible single-fold operations. Each axiom describes a distinct geometric alignment achievable with one fold (e.g., Axiom 1: fold through two points; Axiom 6: fold a point onto a line while simultaneously folding another point onto another line). They are exhaustive -- no other single-fold alignment exists -- and they define the "constructibility power" of origami. The proof of completeness (Alperin and Lang, 2006) is a classification theorem, not an axiomatic foundation. The axioms are closer in spirit to the classification of wallpaper groups than to Euclid's postulates.

**How to surface it:** When introducing the axioms (around Day 2-3), frame them explicitly as "here are all the things you can do with one fold" and have the student attempt to find an eighth operation. The impossibility of finding one motivates the completeness proof.

### Misconception 7: "Computational origami is about writing computer programs to simulate folding"

**Why students get this wrong:** The word "computational" in everyday usage means "done by computers."

**The correction:** Computational origami is a branch of computational geometry that studies the algorithmic and complexity-theoretic properties of folding problems. The central questions are: Is this problem solvable by any algorithm? How fast? Is it NP-hard? The key results -- flat-foldability is NP-hard, flat origami is Turing complete, every polygon can be folded from a square -- are theorems about computation, not computer programs. Software tools like TreeMaker and Origamizer are applications of the theory, not the theory itself.

**How to surface it:** When transitioning to the computational module (around Day 26), explicitly distinguish between "using computers for origami" and "studying what is computable about origami." Bern and Hayes's NP-hardness proof is the anchor: it says something about the intrinsic difficulty of the problem, independent of any particular computer or algorithm.

---

## 3. Level Adjustments

### What intermediate means for this course

The target student has solid high-school geometry, comfort with algebraic manipulation, and at least introductory experience with mathematical proof (understands what constitutes a valid argument, has seen proofs by contradiction and induction, may not yet be fluent at constructing novel proofs). They are not a working mathematician or graduate student.

### Emphasis at intermediate (versus other levels)

| Dimension | Beginner | **Intermediate (this student)** | Advanced/Graduate |
|-----------|----------|-------------------------------|-------------------|
| **Entry point** | "Look what you can do with paper" (wonder-driven) | **"Here is why this works" (understanding-driven)** | "Here are the open problems" (research-driven) |
| **Proofs** | Omit; show results as facts | **Present key proofs in full; have student complete guided proof exercises** | Expect student to construct proofs independently; assign open-ended proof problems |
| **Algebra** | Avoid; use visual/numerical reasoning | **Use freely; derive origami number fields, solve cubics via folding** | Assume fluency; connect to Galois theory, algebraic geometry |
| **Computation** | Omit NP-hardness; show software demos | **Explain what NP-hardness means and why it matters; walk through the Bern-Hayes reduction at a conceptual level** | Full complexity-theoretic treatment; parameterized complexity results |
| **Physical folding** | Central and continuous | **Central but increasingly supplemented by diagrammatic and algebraic reasoning** | Optional; used to build intuition for specific constructions |
| **Applications** | "Origami is used in space!" (inspirational) | **"Here is how Miura-ori deploys in one DOF and why that matters for solar arrays" (mechanistic)** | "Here is the strain energy functional for rigid-foldable tubes" (analytical) |

### What to skip or defer at intermediate

- **Full Galois-theoretic treatment of origami number fields.** State the hierarchy (Pythagorean subset of Euclidean subset of origami-constructible numbers), explain what "solving a cubic" means algebraically, but do not develop the full field extension theory. Reference Alperin (1999) for the interested student.
- **Parameterized complexity results.** Mention Eppstein (2024) as frontier work, but do not present the fixed-parameter tractability proofs.
- **Differential geometry of curved creases.** Mention as an active research area, but the differential-geometric tools (curvature tensors, developable surfaces) exceed the prerequisites.
- **Full TreeMaker algorithm internals.** Explain the circle-packing formulation and the idea of a "tree" description of an origami base. Do not derive the optimization details.

### What to emphasize at intermediate

- **The three core theorems (Kawasaki, Maekawa, layer ordering) with full proofs.** These are accessible and elegant at this level. The student should be able to state, prove, and apply all three.
- **The Huzita-Justin axioms with explicit constructions.** The student should physically perform all seven axioms, understand which geometric alignments each achieves, and execute the angle trisection and cube doubling constructions.
- **The NP-hardness result as a conceptual landmark.** The student should understand what NP-hardness means (not just "it's hard") and why the layer-ordering problem is the source of intractability.
- **Rigid origami through the Miura-ori lens.** The Miura fold is physically accessible, mathematically rich (one-DOF mechanism, negative Poisson ratio), and connects to engineering applications.
- **Physical folding throughout.** Never let the course become purely symbolic. Every theorem should have a corresponding folding exercise.

---

## 4. Rabbit Holes

### Rabbit Hole 1: Origami and the Cubic Equation (Surface around Day 2-3)
**Timing:** After the student has worked through Axiom 6 (the Beloch fold) and performed the angle trisection construction.

**The hook:** "The reason origami can trisect an angle -- something that stumped mathematicians for 2,000 years -- is that a single fold can solve a cubic equation. Margherita Beloch figured this out in 1936, decades before anyone formalized origami axioms. She was working on a completely different problem (the Lill geometric method for solving polynomials) and realized that one fold could do what compass and straightedge could never do. The two ancient 'impossible' problems of Greek geometry -- trisecting an angle and doubling a cube -- fall immediately. Beloch's result was mostly forgotten until origami mathematicians rediscovered it in the 1990s."

**Why it works:** It connects origami to the history of mathematics, introduces a pioneering woman mathematician whose work was overlooked, and gives algebraic content to what might otherwise feel like a geometric trick.

### Rabbit Hole 2: Flat Origami is Turing Complete (Surface around Day 27)
**Timing:** After the student understands the NP-hardness of flat-foldability and has some comfort with computational complexity concepts.

**The hook:** "Hull and Zakharevich proved in 2023 that flat origami, with its layer ordering rules, is computationally universal -- meaning it can simulate any computation a Turing machine can perform. A sufficiently complex crease pattern, when you account for which layers go on top, is literally a computer. This puts origami in the same club as cellular automata, the Game of Life, and Wang tiles. The implication is philosophical as much as mathematical: the humble act of folding paper contains, in principle, all of computation."

**Why it works:** It elevates origami from a geometric curiosity to a fundamental computational object. Students who have studied computability will find this electrifying.

### Rabbit Hole 3: Origami in Space (Surface around Day 21-23)
**Timing:** When introducing rigid origami and deployable structures.

**The hook:** "In 1995, a solar panel array based on Koryo Miura's fold pattern was deployed on the Japanese Space Flyer Unit. The panel unfolded from a compact package into a large flat surface with a single pull -- one degree of freedom, no motors, no complex mechanisms. The same principle now drives the design of the James Webb-era sunshields, deployable antennas, and solar sails. Robert Lang, who left a career at NASA's Jet Propulsion Laboratory to do origami full-time, consulted on the design of a space telescope lens that folds down to fit inside a rocket fairing. The mathematics of rigid origami is not metaphorical engineering -- it is literal aerospace engineering."

**Why it works:** Concrete, high-stakes applications demonstrate that origami mathematics has real engineering consequences. The Lang career-change story adds a human element.

### Rabbit Hole 4: Medical Origami -- Stents and Surgical Tools (Surface around Day 23-24)
**Timing:** During the applications portion of the rigid origami module.

**The hook:** "Heart stents -- the tiny mesh tubes that hold open clogged arteries -- are origami. They must be compact enough to travel through a catheter, then expand to a precise diameter when deployed. The folding pattern determines both the collapsed and expanded geometry, and the transition between them must be smooth and controlled. Zhong You at Oxford has designed origami-based stents where the crease pattern directly controls the deployed diameter. Similarly, origami-inspired surgical tools can fold to pass through a small incision and then unfold into a functional instrument inside the body. The mathematical constraint is the same as for space structures: rigid foldability with controlled degrees of freedom."

**Why it works:** Medical applications are viscerally compelling. The student realizes that the theorems they proved about rigid origami have life-or-death applications.

### Rabbit Hole 5: Origami and Metamaterials -- Programmable Matter (Surface around Day 22)
**Timing:** When discussing Miura-ori tessellations and their mechanical properties.

**The hook:** "Silverberg, Hull, and collaborators showed in 2014 that each unit cell of a Miura-ori tessellation is mechanically bistable -- it can snap between two states. By selectively popping cells between states, you can program the bulk stiffness of the material. The same sheet of folded paper can be made rigid or compliant, just by flipping cells. This is a mechanical metamaterial: a material whose bulk properties come from its structure, not its chemistry. The current research frontier involves tessellations where every cell can be independently addressed, creating programmable matter that changes its mechanical response on demand."

**Why it works:** "Programmable matter" captures the imagination, and the mathematics (bistability, Poisson ratio, bulk mechanical response from local fold geometry) is directly connected to the flat-foldability theory the student has already learned.

### Rabbit Hole 6: Why Can't You Fold a Map? (Surface around Day 13 or during a review day)
**Timing:** After completing the flat-foldability module, as a tantalizing open problem.

**The hook:** "Here is a problem that sounds trivial and is unsolved: take a rectangular map with a grid of creases. In how many distinct ways can you fold it flat? For a 2-by-n strip, this is the sequence of 'stamp folding' numbers, and there is no known closed-form formula. For a general m-by-n map, no efficient algorithm is known -- the problem is believed to be hard, but even proving that is open. You just spent a week learning the theory of flat foldability, and this elementary-sounding question remains out of reach."

**Why it works:** Open problems accessible to state (if not to solve) at the intermediate level are rare. This one connects directly to the combinatorics the student just learned and demonstrates that origami mathematics is a living field.

---

## 5. Difficulty Progression

### Module-by-module difficulty map

```
Day  1-2   [=====-----]  Axioms and folds: Huzita-Justin discovery, angle trisection
Day  3-4   [========--]  Constructibility: origami numbers, doubling the cube (SPIKE 2)
Day  5     [======----]  Multi-fold axioms: extending the system
Day  6     [====------]  Review + consolidation
Day  7-9   [======----]  Flat-foldability: Kawasaki, Maekawa, single-vertex conditions
Day 10-11  [========--]  Multi-vertex foldability + layer ordering (SPIKE 1)
Day 12     [======----]  MV duality and crease pattern structure
Day 13     [====------]  Review + consolidation
Day 14-16  [=======---]  Algorithmic design: tree method, circle-packing, TreeMaker
Day 17-18  [=======---]  Tessellations and the Origamizer
Day 19     [====------]  Review + consolidation
Day 20-21  [======----]  Rigid origami: kinematics and Miura-ori
Day 22-24  [=======---]  Metamaterials, deployable tubes, thick panels
Day 25     [====------]  Review + consolidation
Day 26     [=========-]  NP-hardness of flat-foldability (SPIKE 3)
Day 27     [=========-]  Turing completeness of flat origami (SPIKE 4)
Day 28-29  [=======---]  Random origami, open problems, frontiers
Day 30     [======----]  Capstone: synthesis + independent exploration
```

### Spike 1: Multi-vertex flat-foldability and layer ordering (Days 10-11)

**Why it spikes:** The student has proved Kawasaki's and Maekawa's theorems for single vertices (Days 8-9) and begun counting valid assignments (Day 10). Days 10-11 bring the jump to multi-vertex patterns where global layer-ordering constraints cannot be deduced from local checks. Layer ordering is inherently combinatorial and requires tracking multiple constraints simultaneously. The concept of "self-intersection" in layered paper is not visually obvious from a crease pattern.

**How to manage it:**
- Start with the simplest multi-vertex example: two vertices connected by a single crease. Have the student physically fold it and track which layers end up where.
- Introduce a systematic notation for layer ordering before attempting proofs.
- Use Origami Simulator to visualize layer conflicts in crease patterns that satisfy Kawasaki-Maekawa but fail globally.
- Allow an extra day if the student struggles. This concept is load-bearing for everything that follows.

### Spike 2: Origami numbers and constructibility (Days 3-4)

**Why it spikes:** The student has just discovered the axioms and performed angle trisection (Day 2). Days 3-4 shift to the algebraic underpinnings: why does folding solve cubic equations? What numbers are origami-constructible? The connection between geometric folds and algebraic number fields requires the student to shift between geometric and algebraic reasoning. The idea that "a fold solves a cubic equation" is not intuitive without seeing the algebra.

**How to manage it:**
- Build the bridge slowly: start with the well-known compass-and-straightedge result (constructions solve quadratics), then show how Axiom 6 adds cubic-solving power.
- Work through one explicit cubic equation solved by a fold. The angle trisection of 60 degrees (which requires solving 4x^3 - 3x - 1/2 = 0) is a good concrete example.
- Do not attempt the full hierarchy of number fields (Pythagorean, Euclidean, origami). State it as a result and reference Alperin (1999) for the interested student.
- If the student has category theory background, the field extension hierarchy provides a natural connection point (see Cross-Topic Connections below).

### Spike 3: NP-hardness (Day 26)

**Why it spikes:** The student has encountered layer ordering and global consistency in the flat-foldability module (Days 10-11) and has used computational design tools (Days 14-19). Day 26 formalizes the complexity: the layer-ordering problem that felt hard is provably hard. Many intermediate students have not encountered formal computational complexity, and the concept of NP-hardness requires understanding polynomial-time reductions, the distinction between P and NP, and the specific reduction that Bern and Hayes used (from Not-All-Equal 3-SAT).

**How to manage it:**
- Begin Day 26 with a self-contained introduction to P, NP, and NP-hardness using familiar examples (Sudoku, graph coloring) before touching origami.
- Present the Bern-Hayes result as: "They showed that the layer-ordering problem for flat origami is at least as hard as problems we believe no fast algorithm can solve." Walk through the high-level structure of the reduction (crease patterns encode Boolean formulas) without the full technical details.
- The student should leave understanding: (a) what the result says, (b) why it matters (flat-foldability cannot be efficiently decided in general), and (c) what it does NOT say (individual instances can still be solved; practical origami design is not impossible).
- Pair with a hands-on exercise: give the student a crease pattern and have them find a valid mountain-valley assignment by trial and error, experiencing the combinatorial explosion firsthand.

### Spike 4: Turing completeness (Day 27)

**Why it spikes:** Coming immediately after the NP-hardness spike on Day 26, the Hull-Zakharevich (2023) result requires understanding what Turing completeness means and how a geometric folding system can simulate computation. This is conceptually demanding even for students comfortable with the earlier material.

**How to manage it:**
- If the student has not previously encountered Turing machines, provide a brief primer. If they have, connect directly to other Turing-complete systems they may know (cellular automata, the Game of Life).
- Present the result at a high level: layer-ordering rules in flat origami can encode logical gates, and composing gates along a crease pattern can simulate any computation.
- Do not attempt the full proof. The pedagogical goal is appreciation of the result's significance, not technical mastery.
- Frame it as a synthesis that connects the combinatorial (layer ordering), algebraic (constructibility), and computational (NP-hardness) threads of the course.

### General difficulty management

- **Review days (Days 6, 13, 19, and 25) are non-negotiable.** Spaced repetition of the core theorems prevents knowledge from decaying. Use these days for mixed exercises that require combining results from multiple modules.
- **Physical folding is the pressure valve.** When the algebra or complexity theory gets abstract, return to paper. Even a 5-minute folding exercise regrounds the student.
- **The "two struggles" rule applies.** If the student struggles with two consecutive exercises, drop back to a simpler example or a different angle on the same concept. Do not push forward into new material on a shaky foundation.

---

## 6. Assessment Strategies

### Module 1: The Power of a Single Fold (Days 1-6)

**Best exercise types:** Physical construction + axiom identification + algebraic derivation

- "Fold the following crease pattern and determine how many layers result at each region." (Physical folding + counting)
- "Given this crease pattern diagram, identify all mountain and valley creases. How many of each are there?" (Notation fluency)
- "Using Axiom 6, construct the cube root of 2 starting from a unit segment. Verify your construction by measurement." (Physical construction + verification)
- "Trisect a 60-degree angle using origami. Write out the sequence of folds you used, identifying which axiom each fold invokes." (Multi-step construction with axiom identification)
- "Why can't compass-and-straightedge construction trisect a 60-degree angle? Explain what algebraic capability origami adds." (Conceptual explanation requiring algebraic reasoning)
- "Given two points and two lines, find all possible Axiom 6 folds. How many solutions exist? Under what conditions does no solution exist?" (Geometric analysis)

**Avoid:** Rote memorization of the seven axioms. The student should know what each axiom does, not recite them. Assess by giving a construction goal and asking which axioms are needed.

### Module 2: When Can Paper Lie Flat? (Days 7-13)

**Best exercise types:** Computation + guided proof + physical verification

- "Given a single-vertex crease pattern with angles a1, a2, ..., a2n, verify Kawasaki's theorem. Then determine all valid mountain-valley assignments using Maekawa's theorem." (Computation)
- "Prove that any flat-foldable single vertex must have an even number of creases." (Guided proof -- provide the setup, ask the student to complete the argument)
- "Here is a crease pattern satisfying Kawasaki and Maekawa at every vertex. Try to fold it flat. If you cannot, explain where the layer-ordering conflict occurs." (Physical investigation + explanation)
- "How many valid mountain-valley assignments does a single vertex with 6 creases have, given that Kawasaki's condition holds?" (Combinatorial computation)

**Avoid:** Multiple choice. The flat-foldability theorems require working through specific examples, not selecting from options.

### Module 3: Designing Origami by Algorithm (Days 14-19)

**Best exercise types:** Problem modeling + construction + tool-assisted design

- "Draw the tree graph for a simple origami crane and identify which branches correspond to which features (head, tail, wings, body)." (Modeling exercise)
- "Given a tree graph with five leaves of specified edge lengths, sketch a circle-packing arrangement on a unit square. Do the circles fit without overlap?" (Constrained optimization by hand)
- "Use TreeMaker to generate a crease pattern for a four-legged animal base. Fold the resulting pattern and verify it produces the intended flaps." (Tool-assisted design + physical verification)
- "Load a crease pattern into Origami Simulator. Identify which faces experience strain during folding. What does this tell you about rigid vs. non-rigid foldability?" (Simulation analysis)
- "The fold-and-cut theorem says any straight-edged shape can be produced from a single cut after folding. Demonstrate this for a triangle and a five-pointed star." (Physical construction of a universality result)

**Avoid:** Asking the student to implement design algorithms from scratch. At the intermediate level, they should understand the formulations and use the tools, not write the code.

### Module 4: Rigid Folds and Real Materials (Days 20-25)

**Best exercise types:** Physical experiment + application analysis + comparative reasoning

- "Fold a Miura-ori tessellation (at least 4x4 cells). Measure the deployed and collapsed dimensions. Compute the Poisson ratio from your measurements. Is it positive or negative?" (Experiment + computation)
- "Why does the Miura-ori pattern deploy with a single degree of freedom? What would happen if you added one diagonal crease to one cell?" (Conceptual reasoning about rigidity and DOF)
- "Compare rigid origami to linkage mechanisms. What is the analog of a 'link'? Of a 'joint'? Of a 'degree of freedom'?" (Cross-domain conceptual mapping)
- "Choose one engineering application of origami (space structures, medical devices, metamaterials). Explain which mathematical properties of the fold pattern are essential for the application to work." (Open-ended application analysis)

**Avoid:** Pure numerical computation divorced from physical or geometric meaning. Rigid origami is best assessed through reasoning about mechanism, not through formula grinding.

### Module 5: Complexity, Computation, and Open Frontiers (Days 26-29)

**Best exercise types:** Problem modeling + conceptual explanation + open-ended exploration

- "Given this crease pattern, try to find a valid flat-folding (mountain-valley assignment + layer ordering) by systematic trial. How many possibilities did you need to check?" (Experiential exercise in combinatorial explosion)
- "Explain in your own words why flat-foldability is NP-hard. What is being reduced to what? What does this tell us about the difficulty of origami design in general?" (Conceptual explanation -- tests understanding, not recall)
- "Is the following statement true or false: 'Since flat-foldability is NP-hard, no origami model with more than 50 creases can be designed.' Explain your reasoning." (Common misunderstanding -- tests precision of understanding)
- "Hull and Zakharevich proved that flat origami is Turing complete. Explain what this means and why it is surprising, given that we just proved flat-foldability is NP-hard." (Synthesis of complexity and universality)

**Avoid:** Asking the student to perform computational complexity proofs. At the intermediate level, they should understand and explain the results, not reproduce the reductions.

### Capstone (Day 30)

**Best exercise types:** Synthesis + independent investigation

- "Design a crease pattern for an origami base with five flaps of specified lengths. Verify that your pattern satisfies Kawasaki's and Maekawa's theorems at every vertex. Fold it and check." (Full-cycle design exercise)
- "Choose one open problem mentioned in the course (map folding, curved-crease theory, modular origami classification). Write a one-page summary of what is known, what is unknown, and why the problem is hard." (Independent investigation -- tests ability to engage with primary literature)
- "Identify a connection between origami mathematics and another field you have studied. Explain the connection precisely, using the terminology of both fields." (Cross-disciplinary synthesis)

---

## 7. Cross-Topic Connections

This student has studied Category Theory, Optimal Transport, and Mathematics of Juggling. The following connections should be surfaced at specific points in the course.

### From Category Theory

**Connection 1: Groups and symmetry (CT concept 2) to origami symmetry groups**
**When to surface:** Day 17-18 (Tessellations: Miura-ori geometry)
**How to frame it:** "You studied monoids and groups as algebraic structures in your category theory course. The symmetries of an origami tessellation -- the Miura-ori, for example -- form a wallpaper group. There are exactly 17 wallpaper groups, and Chari and Macauley (2025) recently showed that origami constructions can produce all 17 when the angle set is restricted. The dihedral groups you encountered in category theory are the symmetry groups of individual origami modules in modular origami. When you classify tessellation symmetries, you are doing group theory on folded paper."

**Connection 2: Isomorphisms and equivalence (CT concept 6) to crease pattern classification**
**When to surface:** Day 12 (MV duality and isomorphism of folded states)
**How to frame it:** "In category theory, you learned that isomorphism is the right notion of 'sameness' -- two objects are the same if there is an invertible structure-preserving map between them. The same question arises in origami: when are two crease patterns 'the same'? Two crease patterns are combinatorially equivalent if they have the same face-edge-vertex structure, but geometrically equivalent only if there is an isometry mapping one to the other. And two flat-folded states might be considered equivalent if they have the same layer ordering, even if the crease geometries differ. The categorical perspective -- defining equivalence via morphisms rather than element-by-element comparison -- is precisely the right framework here."

**Connection 3: Mountain-valley duality and opposite categories (CT concept 13)**
**When to surface:** Day 9 (after proving Maekawa's theorem)
**How to frame it:** "Remember how every categorical theorem has a free dual theorem, obtained by reversing all the arrows? Origami has its own duality: given any valid mountain-valley assignment for a flat-foldable crease pattern, swapping every mountain to a valley and every valley to a mountain produces another valid assignment. This is the M-V duality, and it follows directly from Maekawa's theorem (if M - V = +2, then V - M = -2, which corresponds to flipping the paper over). The structural flavor is the same as categorical duality: a systematic swap that preserves validity."

**Connection 4: Groupoids (CT day 4) to fold-unfold sequences**
**When to surface:** Day 20 (Rigid origami fundamentals)
**How to frame it:** "In category theory, you encountered groupoids as categories where every morphism is invertible. Origami folds on a crease pattern form a groupoid rather than a group: each fold is reversible (you can unfold), but the collection of fold-unfold sequences depends on which vertex you start from. Different crease vertices serve as different 'base points,' and the fold sequences starting from different vertices compose differently. This is exactly the structure of a groupoid. The configuration space of a rigid origami mechanism -- all the possible folded states connected by continuous rigid motions -- has groupoid structure."

**Connection 5: Composition of transformations (CT concept 1) to fold sequences**
**When to surface:** Day 1-2 (Folds as reflections and crease patterns)
**How to frame it:** "Each Huzita-Justin axiom defines a fold operation, which is geometrically a reflection across the fold line. When you compose two folds, you compose two reflections, which gives a rotation (if the fold lines intersect) or a translation (if they are parallel). The axioms generate a family of isometries under composition. In category theory, you studied composition as the fundamental operation -- morphisms compose associatively with identities. The fold operations work the same way: associative composition, with the identity being 'do not fold.' The constructibility power of origami comes from which compositions are reachable."

### From Optimal Transport

**Connection 6: Optimization and linear programming (OT day 2) to origami design algorithms**
**When to surface:** Day 15-16 (Circle-packing and TreeMaker)
**How to frame it:** "You studied the Kantorovich relaxation in optimal transport, where a combinatorial matching problem becomes a linear program. TreeMaker does something analogous: the problem of designing an origami base is formulated as a constrained optimization. The 'tree' (stick figure) specifies the desired flap lengths, and the algorithm finds a circle-packing arrangement on the paper whose circles do not overlap and whose boundaries satisfy distance constraints. The LP duality structure you learned in optimal transport has echoes here -- the primal problem is packing circles on the square, and the dual involves distances in the tree graph."

**Connection 7: Tessellations and Voronoi/power diagrams (OT day 14) to origami tessellations**
**When to surface:** Day 17-18 (Tessellations: Miura-ori geometry)
**How to frame it:** "In semidiscrete optimal transport, you worked with Laguerre diagrams that partition a region into cells based on weighted distances. Origami tessellations partition the plane into faces based on angle and distance constraints at each vertex. The Miura-ori tessellation is a particularly elegant partition: every vertex has the same local geometry (four creases at specific angles), and the global tiling has translational symmetry. The geometric language is the same: both optimal transport partitions and origami tessellations are planar subdivisions governed by local metric constraints with global compatibility conditions."

**Connection 8: Isometric deformation (OT day 9) to the inextensibility constraint**
**When to surface:** Day 20 (Rigid origami fundamentals)
**How to frame it:** "The fundamental physical constraint of paper folding is that paper does not stretch. Mathematically, folding is an isometric deformation: distances measured along the surface are preserved. You encountered a similar idea in optimal transport when studying displacement interpolation and geodesics in Wasserstein space -- both involve understanding structure-preserving deformations. In rigid origami, the continuous folding motion from flat to folded state is a path through a configuration space, subject to the constraint that every face remains rigid (a local isometry condition). This is a discrete analog of finding geodesics in a constrained space, which is the same geometric flavor as Wasserstein geodesics."

### From Mathematics of Juggling

**Connection 9: Combinatorial enumeration under local constraints to flat-fold counting**
**When to surface:** Day 9-10 (Maekawa's theorem and counting MV assignments)
**How to frame it:** "In your juggling mathematics course, you counted valid siteswap patterns by enforcing local constraints (the average property, no two balls in the same hand at the same time). Counting valid flat-fold assignments is a strikingly similar problem: at each vertex, Kawasaki and Maekawa impose local constraints (alternating angle sums, mountain-valley parity), and you need to count the globally valid assignments. In both cases, the local constraints are easy to check, but the interaction between constraints at different sites is what creates combinatorial complexity. The enumeration techniques -- state diagrams, transfer matrices -- carry over."

**Connection 10: Graph-theoretic state diagrams to crease pattern dual graphs**
**When to surface:** Day 7 (introducing flat-foldability and crease-pattern graph analysis)
**How to frame it:** "You used state-transition diagrams to classify juggling patterns: each state represents a configuration of balls, and edges represent valid throws. Origami crease patterns are graphs too -- vertices where creases meet, edges along crease lines, and faces between creases. The dual graph (one node per face, edges between adjacent faces) is the structure that matters for layer ordering: you need to assign a layer number to each node of the dual graph such that no two adjacent faces violate the stacking rules. The graph-theoretic toolkit is the same in both domains."

**Connection 11: Finite group theory and symmetry classification**
**When to surface:** Day 17-18 (Tessellations: Miura-ori geometry)
**How to frame it:** "You applied cyclic and dihedral symmetries to classify periodic juggling patterns. The same groups classify origami tessellation symmetries. A Miura-ori tessellation has a specific wallpaper group symmetry, and modular origami units are classified by the dihedral symmetry of their assembled polyhedra. The algebraic toolkit -- identifying the symmetry group, classifying orbits, counting distinct patterns up to symmetry -- is identical. You already know how to do this from juggling; now apply it to folded paper."

---

## Summary of Cross-Topic Connection Timing

| Day(s) | Connection | Source Domain |
|--------|-----------|---------------|
| 1 | Fold composition vs. morphism composition | Category Theory |
| 7 | Crease patterns as graphs vs. juggling state diagrams | Juggling |
| 9 | M-V duality vs. opposite categories | Category Theory |
| 10 | Combinatorial enumeration under local constraints | Juggling |
| 11 | Layer ordering vs. discrete sequences with ordering constraints | Juggling |
| 11 | Global flat-foldability validity vs. commutative diagrams | Category Theory |
| 12 | Crease pattern equivalence via isomorphisms | Category Theory |
| 14 | Universal molecules vs. convex geometry | Optimal Transport |
| 15 | Circle-packing optimization vs. LP duality | Optimal Transport |
| 17 | Symmetry groups of tessellations | Category Theory + Juggling |
| 17 | Origami tessellations vs. Voronoi/power diagrams | Optimal Transport |
| 18 | Origamizer as functorial construction | Category Theory |
| 20 | Fold-unfold groupoids | Category Theory |
| 20 | Inextensibility as isometric deformation | Optimal Transport |
