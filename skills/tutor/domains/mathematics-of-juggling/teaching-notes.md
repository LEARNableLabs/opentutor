# Teaching Notes: Mathematics of Juggling

## 1. Approach

### What makes this topic unique pedagogically

The mathematics of juggling is rare among mathematical subjects: it has a **physical, visceral anchor** that makes abstraction feel earned rather than imposed. A student can literally pick up three balls and feel the combinatorics in their hands. This creates a pedagogical loop unavailable in most pure mathematics -- conjecture a pattern on paper, verify it with a simulator, then prove it formally.

At the intermediate level, the student already has the combinatorial and proof maturity to engage with the real mathematics (not just the notation). The pedagogical challenge shifts from "how do I make this accessible" to "how do I maintain rigor while preserving the playful, discovery-driven character that makes the subject compelling."

### Core pedagogical principles for this course

**Discovery before formalism.** For every major theorem (the average theorem, the (b+1)^p counting formula, the permutation test), let the student discover the pattern empirically first -- through computation, simulation, or enumeration of small cases -- before presenting the proof. The proofs in this subject are elegant and short enough that students can often reconstruct them once they believe the result.

**Simulation as laboratory.** Juggling Lab and SiteswapSim are not optional supplements; they are the student's laboratory bench. Every lesson should include at least one moment where the student types a siteswap into a simulator and observes. This grounds abstract sequences in physical intuition: "441 looks different from 531 even though both are 3-ball patterns" becomes visible immediately.

**Algebraic and combinatorial in equal measure.** The subject naturally splits into a combinatorial/enumerative track (counting sequences, state graphs, generating functions) and a structural/algebraic track (permutations, groups, braids, affine permutations). For the intermediate student with strong combinatorics, lean into the algebraic side slightly more -- it will stretch them -- while using combinatorial enumeration as the comfortable home base they return to.

**Proof-heavy but with short proofs.** Most key results in siteswap theory have proofs that fit in half a page. This is ideal for the intermediate level: the student should be writing proofs regularly, and the brevity means they can attempt full proofs rather than just sketch arguments. Assign "prove this yourself before reading the proof" frequently.

**Build toward paper-reading fluency.** The north-star goal is reading Buhler et al. (1994) and Warrington (2003). Structure lessons so that by the time the student encounters these papers, every piece of notation and every prerequisite concept has already been introduced in a friendlier context. The papers become a culminating reading exercise, not a wall.

### Delivery style

Use a mix of:
- **Computation exercises** (enumerate all valid 3-ball siteswaps of period 2; compute the state transition for 441)
- **Simulator experiments** ("Type these five siteswaps into Juggling Lab. What do you notice about how they look physically?")
- **Short proofs** (prove the average theorem; prove that the permutation test is necessary and sufficient)
- **Open-ended exploration** ("Find all ground-state patterns with at most 5 balls and period 3. What structure do you see?")
- **Paper reading** (guided reading of sections of Buhler et al. or Warrington, with specific questions)

Avoid long lectures. The subject rewards active engagement over passive exposition.

---

## 2. Common Misconceptions

### Misconception 1: "The siteswap number is the height of the throw"

**Why students get this wrong:** The physical intuition is overwhelming. A "5" throw goes higher than a "3" throw in a real cascade, so students assume the number encodes height. Many introductory videos reinforce this by saying things like "higher numbers mean higher throws."

**The truth:** The siteswap number is the number of beats until the ball is thrown again -- it is a *temporal* displacement, not a spatial one. A throw of 5 means "this ball lands 5 beats from now." Height is a physical consequence of timing (higher throws take longer), but the mathematics is purely about time slots and scheduling.

**How to correct it:** Have the student work through a timing diagram (ladder diagram) by hand. Ask: "If beat spacing changes (faster or slower juggling), does the siteswap change?" No -- because siteswap is about the combinatorial schedule, not physics. Then show two physically different patterns with the same siteswap (e.g., under-the-leg vs. normal throws that maintain the same timing). Emphasize: siteswap lives in discrete time; height lives in continuous physics.

### Misconception 2: "Any sequence of non-negative integers is a valid siteswap"

**Why students get this wrong:** The notation looks like you can just string numbers together. Early exposure to examples like 3, 441, 531, 97531 makes it seem like anything goes, especially since no algebraic constraint is immediately visible.

**The truth:** A sequence is a valid siteswap if and only if no two balls land at the same time (the "no collision" condition). Equivalently, the landing times must form a permutation of the throw times. The sequence 21 is invalid because both throws land on beat 2.

**How to correct it:** Have the student test 10 sequences by hand using the landing-time method (for throw at beat i with value s_i, the ball lands at beat i + s_i; check all landing times are distinct modulo the period). Make them find and classify invalid sequences. Then introduce the permutation test: the sequence (s_0, s_1, ..., s_{p-1}) is valid iff the values (s_0 + 0, s_1 + 1, ..., s_{p-1} + p-1) are all distinct modulo p. This reframing as a permutation condition is the crucial shift.

### Misconception 3: "The average theorem is just a coincidence or heuristic"

**Why students get this wrong:** The average theorem (the average value of a valid siteswap equals the number of balls) is often stated without proof, especially in juggling communities. It feels like a useful rule of thumb rather than a hard theorem. Students may think there are exceptions or that it only works "most of the time."

**The truth:** The average theorem is an exact, provable result with no exceptions. For any valid periodic siteswap of period p with values (s_0, ..., s_{p-1}), the number of balls is exactly (s_0 + s_1 + ... + s_{p-1}) / p. The proof follows directly from the permutation characterization: the landing-time permutation has the same sum modulo p as the identity, so the sum of throw values equals the sum of indices plus a multiple of p.

**How to correct it:** Have the student prove it. This is an excellent early proof exercise. Guide them with: "What does the permutation test tell you about the sum of the landing times? Compare that to the sum of the throw times." Once they have the proof, it stops being a coincidence and becomes an inevitable consequence of the combinatorial structure.

### Misconception 4: "Excited states are just harder versions of ground-state patterns"

**Why students get this wrong:** The terminology ("excited" vs. "ground") suggests a difficulty hierarchy, and excited-state patterns are often physically harder to juggle. Students conflate physical difficulty with mathematical structure.

**The truth:** "Ground state" and "excited state" are structural properties of the juggling state in the state transition graph. The ground state for b balls is the state where balls occupy the earliest b time slots -- it is the *lowest energy* state, not the easiest pattern. An excited-state pattern cannot be entered directly from an empty-handed start; it requires a *transition sequence* to reach. The distinction is about graph reachability, not difficulty.

**How to correct it:** Draw the state graph for 3 balls with maximum throw 5. Label ground state and excited states. Show that some excited-state patterns (like the 3-ball pattern 504) are physically easy, while some ground-state patterns (like 744) are physically hard. The state graph makes the structural distinction visual and unambiguous. Ask: "What is the shortest sequence that transitions from the ground state to the state for pattern 504?"

### Misconception 5: "Multiplexing is just doing two siteswaps at once"

**Why students get this wrong:** Multiplex notation ([3,5]2 etc.) looks like two siteswaps interleaved, and students try to analyze it by decomposing into separate single-throw sequences.

**The truth:** A multiplex throw is a single beat where multiple balls are thrown simultaneously, each with its own throw value. The validity conditions change: you no longer need a permutation of beats but rather a more complex condition on multi-sets. The enumeration theory (Butler-Graham) requires different machinery -- transition matrices rather than simple permutation counting. Multiplex siteswaps cannot generally be decomposed into independent vanilla siteswaps.

**How to correct it:** Give a concrete multiplex pattern and ask the student to try decomposing it into two vanilla siteswaps. They will find it does not work (some beats have collisions in either component). Then introduce the multiplex validity condition and the Butler-Graham counting formula. Emphasize that multiplexing genuinely expands the mathematical structure, not just the notation.

### Misconception 6: "The (b+1)^p formula counts juggling patterns"

**Why students get this wrong:** Buhler et al. prove that there are exactly (b+1)^p juggling sequences of period p with at most b balls. Students often misread "sequences" as "patterns," conflating two distinct objects.

**The truth:** The formula counts *sequences*, including sequences that are cyclic rotations of each other (which represent the same physical pattern). It also counts sequences of all ball counts from 0 to b, not just exactly b balls. The number of distinct *patterns* requires dividing by equivalences (cyclic rotation, and possibly ball-relabeling), which involves Burnside's lemma or Mobius inversion and gives a more complex formula.

**How to correct it:** Have the student enumerate all siteswap sequences of period 2 with at most 2 balls. Verify the count matches (2+1)^2 = 9. Then ask: "Which of these represent the same physical pattern?" Group them by cyclic equivalence. The gap between 9 sequences and the smaller number of patterns makes the distinction concrete.

### Misconception 7: "Shannon's theorem and siteswap theory are the same subject"

**Why students get this wrong:** Both are called "mathematics of juggling" and both appear in introductory treatments. Students assume one implies or contains the other.

**The truth:** Shannon's juggling theorem, (F+D)H = (V+D)N, is a continuous-time, physics-adjacent result about the relationship between flight time, dwell time, vacant time, number of balls, and number of hands. Siteswap theory is a discrete-time, combinatorial framework about throw scheduling. They address different aspects of juggling and use completely different mathematical tools. Shannon's theorem says nothing about which sequences are valid; siteswap theory says nothing about physical timing.

**How to correct it:** Present both frameworks side by side and ask: "What question does each one answer?" Shannon answers "given these physical constraints, how many balls can I juggle?" Siteswap answers "given b balls and period p, how many throw schedules exist and which are valid?" They are complementary, not competing.

---

## 3. Level Adjustments

### Intermediate level (this course) -- what to emphasize

The intermediate student has solid combinatorics and proof skills. This means:

**Emphasize:**
- Full proofs of all core results (average theorem, permutation test, (b+1)^p counting formula). The student should prove most of these themselves before seeing the standard proof.
- The state-graph formulation. This is where the real combinatorial depth lives, and it requires comfort with directed graphs, adjacency matrices, and (for counting) eigenvalue methods.
- Generating functions and Stirling number connections (especially for Warrington's probabilistic model). The student's combinatorial background makes this accessible.
- Reading primary literature. By mid-course, assign sections of Buhler et al. (1994). By the probabilistic module, assign Warrington (2003). Guided reading with specific questions.
- Connections to permutation theory: descent statistics, bounded-drop permutations, Chung-Graham results.

**Include but at calibrated depth:**
- Shannon's theorem (present it, derive it, but do not dwell -- it is more physics than combinatorics).
- Braid-theoretic connections (introduce the map from siteswaps to braids; show that every braid arises from a juggling pattern; but do not require deep knot theory).
- Positroid varieties (mention the connection to algebraic geometry as a "deep end" teaser; do not attempt a full treatment unless the student has algebraic geometry background).
- Multiplex enumeration (cover the Butler-Graham framework but focus on the ideas, not every technical detail).

**Skip or defer:**
- q-analogue theory (Ehrenborg-Readdy). This requires comfort with q-series and affine Weyl groups that goes beyond "intermediate."
- Frieze patterns (Docampo-Muller). Too specialized without cluster algebra background.
- Full treatment of positroid cell decompositions.

### How this differs from other levels

**Versus beginner:** A beginner course spends 60% of its time on notation and basic examples, with proofs replaced by "trust me" moments. The intermediate course spends at most 10-15% on notation (the student picks it up fast) and pivots quickly to structure and proof. A beginner needs "what is siteswap?"; the intermediate student needs "why does siteswap work, and what does it connect to?"

**Versus advanced/graduate:** A graduate course would center on the algebraic geometry (positroid varieties, affine Grassmannians), use scheme-theoretic language, and treat the combinatorics as motivation for deeper algebraic structures. The intermediate course treats the combinatorics as the *subject*, with algebraic geometry as a tantalizing horizon. A graduate course assigns Knutson-Lam-Speyer; the intermediate course assigns Buhler et al.

**Versus professional/applied:** A professional would want "what can I compute with this?" The intermediate student wants "why is this true and what connects to what?" Maintain the pure-mathematical orientation while keeping the subject playful.

---

## 4. Rabbit Holes

### Rabbit Hole 1: "441 was discovered by math before any juggler performed it" (Lesson 2-3, during siteswap notation)

When introducing siteswap notation and the idea that sequences can be mathematically valid but physically unfamiliar, drop this: "When Tiemann and Magnusson developed siteswap at Caltech in 1985, their enumeration program output 441 as a valid 3-ball pattern. No juggler in the room had seen or performed it. They worked out the timing from the notation and then juggled it for the first time. This is one of the few cases in any field where a mathematical formalism predicted a genuinely new physical phenomenon that practitioners then went and verified with their bodies." This rabbit hole reinforces that siteswap is not just descriptive bookkeeping -- it is a genuinely predictive theory.

### Rabbit Hole 2: "Shannon built a juggling robot in his basement" (Lesson 4-5, during Shannon's theorem)

When covering Shannon's juggling theorem: "Claude Shannon -- yes, the father of information theory -- was also an avid juggler and unicyclist. He built a juggling machine in his basement workshop at MIT, a mechanical device that could sustain a 3-ball cascade using W-shaped troughs and a motor-driven mechanism. His 1993 paper proving (F+D)H = (V+D)N was one of the last things he published before Alzheimer's disease ended his career. The theorem is beautiful in its simplicity: it is a conservation law, like energy conservation in physics, but for temporal scheduling. Every hand must be either holding a ball, empty and waiting, or in the act of throwing -- and those intervals must balance." This humanizes the mathematics and connects to the student's likely familiarity with Shannon from information theory.

### Rabbit Hole 3: "Every knot is a juggling pattern" (Lesson 15-18, during state graphs or braids module)

When the student has absorbed state graphs and you are transitioning to topological connections: "Devadoss and Mugno proved in 2006 that the natural map from periodic siteswaps to braids is surjective -- every braid, and therefore every knot and link, can be realized as a juggling pattern. This means that if you hand a topologist any knot diagram, they can give you back a sequence of throws that, traced through space-time, produces that knot. The trefoil knot is a siteswap. The Borromean rings are a siteswap. Your shoelace knot is, in principle, a siteswap. The proof uses the fact that siteswap state graphs are rich enough to generate all permutations, and braid generators correspond to transpositions." This connects to topology without requiring the student to master braid theory formally.

### Rabbit Hole 4: "Juggling patterns and the Grassmannian" (Lesson 20-25, during advanced enumeration or permutations module)

When the student is comfortable with bounded affine permutations: "Here is something genuinely surprising. Knutson, Lam, and Speyer showed in 2013 that the combinatorics of bounded juggling patterns -- specifically, bounded affine permutations -- indexes the cells of a stratification of the totally nonnegative Grassmannian. The Grassmannian Gr(k,n) parametrizes k-dimensional subspaces of n-dimensional space, and its cell decomposition is controlled by exactly the same combinatorial objects as siteswap theory. This is not an analogy -- it is a theorem. The positroid cells are literally labeled by juggling patterns. This is one of the highest-citation results in the field (170 citations) and sits at the intersection of algebraic geometry, algebraic combinatorics, and total positivity. We will not go deep into this -- it requires algebraic geometry we have not set up -- but knowing it exists tells you that the combinatorics you are learning is load-bearing infrastructure for serious modern mathematics." This gives the student a sense of the subject's depth without requiring them to follow the proof.

### Rabbit Hole 5: "Erik Demaine's juggling alphabet" (Lesson 8-10, during pattern enumeration or as a creative break)

As a lighter moment: "Erik Demaine and Martin Demaine -- the father-son duo famous for computational origami -- designed a mathematical font where each letter of the alphabet is traced by the trajectories of three juggling balls. The letter A, for instance, is a specific siteswap pattern whose ball paths, when viewed from the front, trace the shape of an A. This means you can literally juggle a message. The paper appeared in a festschrift for Ron Graham and combines juggling mathematics with computational geometry. It is a beautiful example of mathematical art." This connects to the student's origami mathematics background and provides a creative, visual break.

### Rabbit Hole 6: "The universal juggling cycle" (Lesson 12-14, during advanced state graph exploration)

When discussing state graphs and traversal: "Fan Chung and Ron Graham proved that for any given ball count and period, there exists a single cyclic sequence -- a universal juggling cycle -- such that every valid siteswap of that type appears as a contiguous window within the cycle. Think of it as a de Bruijn sequence for juggling: one long pattern that contains all patterns as subsequences. If you could juggle this universal cycle, you would, in a single performance, execute every possible pattern. The existence proof uses Eulerian circuits in the state graph, connecting juggling to one of the oldest theorems in graph theory." This ties the state graph machinery to a concrete and memorable existence result.

---

## 5. Difficulty Progression

### Module-by-module difficulty map

**Module 1: The Language of Throws (Days 1-6)**
Difficulty: LOW to MODERATE. The notation is simple; the permutation test requires care but not deep theory. Risk: students find it too easy and become impatient.
*Management:* Move quickly. Spend at most 2 days on notation before pivoting to proof of the average theorem and permutation test. Use computational exercises (enumerate all valid siteswaps of given period and ball count) to build speed without boredom.

**Module 2: States, Graphs, and Counting (Days 7-12)**
Difficulty: MODERATE to HIGH. The state-graph representation requires thinking of patterns as paths in a graph, which is a genuine abstraction step. The module then pivots to the (b+1)^p counting formula, whose bijective proof uses a "staircase" construction that can feel unmotivated on first reading. The combination of state-graph machinery and enumerative results makes this the most content-dense module.
*Management:* Build the state graph for 2 balls by hand before moving to 3 balls. Use the simulator to verify transitions. Make the distinction between states and patterns viscerally clear with exercises like: "Given a state graph, find all ground-state patterns of period 3. Now find all patterns, including excited-state." For the counting theorem, have the student verify the formula for small cases (p=1, p=2) by exhaustive enumeration before showing the proof. Guide them toward the observation that the bijection with {0, 1, ..., b}^p should feel like an aha moment, not an imposed trick.

**Module 3: Permutations and Descents (Days 13-18)**
Difficulty: MODERATE to HIGH. The shift from counting sequences to understanding their permutation-theoretic structure requires the student to see siteswaps as algebraic objects, not just combinatorial ones. Drops, descents, Stirling number connections, and the monoid structure of concatenation all build on each other rapidly.
*Management:* Anchor every abstract concept in concrete computation. Have the student compute the descent set of specific juggling permutations, decompose siteswaps into primitive factors, and verify Stirling number identities for small cases before engaging with general proofs. The guided reading of Buhler et al. (Day 15) is a key milestone -- by this point the student should have enough background to follow the paper's core arguments. The review day (Day 18) should consolidate the connections between permutations, counting, and algebraic structure.

**DIFFICULTY SPIKE: The transition from Module 3 to Module 4 (Days 18-20)**
This is the hardest transition in the course. The student goes from deterministic combinatorics (counting, graph structure, permutation theory) to probabilistic reasoning (Markov chains, steady-state distributions, Stirling number identities). Even students with solid combinatorics may not have Markov chain intuition.
*Management:* Spend a full lesson reviewing Markov chains before introducing Warrington's model. Define: state space (juggling states), transition probabilities (throw distributions), stationary distribution. Use the state graph they already know as the Markov chain's underlying graph -- this is the bridge. Start with the simplest model (uniform random throws) before introducing more complex throw distributions. Assign Warrington (2003) only after the student has worked through the 2-ball case by hand.

**Module 4: Random Juggling (Days 19-24)**
Difficulty: HIGH. Warrington's paper connects siteswap Markov chains to Stirling numbers of the second kind, which requires either generating-function techniques or direct combinatorial arguments. The connection is beautiful but not obvious.
*Management:* Do not try to reproduce all of Warrington's proofs. Focus on: (1) setting up the Markov chain model, (2) computing the stationary distribution for 2 and 3 balls by hand, (3) recognizing the Stirling numbers when they appear, (4) understanding *why* Stirling numbers arise (the connection to set partitions and ball-to-slot assignments). Save the more technical aspects (q-analogues, infinite-ball limits from Ayyer et al.) for optional deep dives.

**Module 5: Braids, Geometry, and the Frontier (Days 25-30)**
Difficulty: MODERATE to HIGH, depending on sub-topic. Braid theory is accessible at the intuitive level but hard to formalize. Affine permutations require comfort with infinite periodic structures.
*Management:* This module should feel like a survey of vistas, not a forced march through proofs. For each sub-topic (braids, affine permutations, positroid connections), give the student enough to understand the *statement* of the main result and work through one or two examples, without requiring full mastery of the proof techniques. The goal is to equip them to read further on their own.

### General difficulty management principles

- After every difficulty spike, schedule a consolidation lesson: review, computational exercises, simulator play. Let the student catch their breath.
- If the student breezes through notation (Days 1-3), compress and skip ahead. Do not artificially slow down.
- If the student struggles with Markov chains (Days 19-20), add an extra review lesson on Markov chain basics using a non-juggling example before re-engaging with Warrington.
- The course should feel like a climb with rest stops, not a uniform incline.

---

## 6. Assessment Strategies

### Module 1: The Language of Throws

**Best formats:** Computation, short proof.
- "List all valid siteswap sequences of period 3 with exactly 3 balls. Verify each using the permutation test." (Computation -- builds fluency with the notation.)
- "Prove: the average value of a valid siteswap of period p equals the number of balls." (Short proof -- this should be assigned as a full write-up, not a fill-in-the-blanks exercise.)
- "Is the sequence 4413 valid? Justify without using a simulator." (Quick check -- tests whether the student has internalized the permutation test.)
- "Invent a valid 4-ball siteswap of period 5 that you have not seen before. Verify it, then check it in Juggling Lab." (Creative exercise -- reverses the usual direction.)

### Module 2: States, Graphs, and Counting

**Best formats:** Diagram construction, exploration, computation.
- "Draw the complete state graph for 3 balls with maximum throw height 4. Label all states and all edges." (Construction -- forces understanding of state representation and transitions.)
- "Starting from the ground state for 3 balls, find the shortest path to the state [1,0,1,0,1]. What is the transition sequence?" (Path-finding -- tests graph reasoning in the juggling context.)
- "How many cycles of length 4 exist in the 3-ball state graph with max throw 5? What siteswap patterns do they correspond to?" (Computation -- connects graph theory back to patterns.)
- "Is the multiplex sequence [3,1]2 valid? Verify using the multiplex collision condition." (Computation -- tests the extended validity conditions introduced on Day 11.)
- "How does the Butler-Graham counting formula for multiplex sequences reduce to the Buhler et al. formula when the multiplex capacity is 1? Show the reduction explicitly." (Comparison -- tests understanding of how the general theory specializes.)

### Module 3: Permutations and Descents

**Best formats:** Proof, computation, guided paper reading.
- "Verify the formula (b+1)^p for p=3, b=2 by exhaustive enumeration. List all 27 sequences." (Computation -- grounds the formula in concrete data.)
- "Prove that the number of valid siteswap sequences of period p with at most b balls is (b+1)^p." (Full proof -- the central result. The student should attempt this after seeing the bijection idea but before reading the full proof in Buhler et al.)
- "Read Section 3 of Buhler et al. (1994). In your own words, explain the 'staircase' construction and why it gives a bijection." (Guided reading -- builds paper-reading skill.)
- "How many distinct juggling *patterns* (up to cyclic rotation) exist with exactly 3 balls and period 4? Derive the count using Burnside's lemma." (Extension -- tests whether the student can apply standard tools to the juggling context.)

### Module 4: Random Juggling

**Best formats:** Computation, modeling, guided paper reading.
- "Set up the Markov chain for random juggling with 2 balls and maximum throw height 3, assuming uniform random throws. Compute the transition matrix and find the stationary distribution." (Computation -- the core skill for this module.)
- "Compute the probability that a random 2-ball juggler (uniform throws, max height 4) is in the ground state at steady state. Express your answer in terms of Stirling numbers." (Computation with connection -- tests both calculation and recognition of Stirling numbers.)
- "Read Sections 1-3 of Warrington (2003). What is the main theorem? State it precisely and explain why the Stirling number connection is surprising." (Guided reading -- the culminating paper-reading exercise for the probabilistic module.)
- "Under what throw distribution does the steady-state probability of the ground state become maximized? Minimized? Conjecture and then test computationally." (Open-ended exploration -- no single right answer, tests modeling intuition.)

### Module 5: Braids, Geometry, and the Frontier

**Best formats:** Example construction, short essay, exploration.
- "Construct the braid corresponding to the siteswap 441. Draw the braid diagram. What is the resulting link when you close the braid?" (Construction -- tests the siteswap-to-braid map concretely.)
- "Explain in 1-2 paragraphs why the map from periodic siteswaps to braids is surjective. You may use the result that siteswap state graphs generate all permutations." (Short essay -- tests conceptual understanding without requiring deep topological machinery.)
- "Write the bounded affine permutation corresponding to the siteswap 531. Verify that it satisfies the boundedness conditions." (Computation -- tests the translation between notations.)

### General assessment principles

- **Always include a simulator step.** After any proof or computation exercise, add: "Verify your answer using Juggling Lab." This builds the habit of checking formal results against physical intuition.
- **Assign paper-reading exercises starting from Module 3.** The student should be reading primary literature (with guidance) by mid-course.
- **Proof exercises should be full write-ups, not sketches.** The proofs are short enough that this is feasible and builds real proof-writing skill.
- **Include at least one open-ended exploration per module.** The subject rewards poking around; assessment should reflect this.

---

## 7. Cross-Topic Connections

The student has studied **Category Theory**, **Optimal Transport**, and **Origami Mathematics**. These create rich cross-topic connections that should be surfaced at specific moments in the course.

### From Category Theory

**Connection 1: Siteswap sequences form a monoid under concatenation**
*Surface at:* Lesson 2-3 (siteswap notation basics), and revisit at Lesson 6 (state graphs).
*How to frame:* "You studied monoids as one-object categories in your category theory course. Here is a natural example you have not seen before: the set of all valid siteswap sequences of a given ball count forms a monoid under concatenation. The identity element is the empty sequence (or the sequence consisting of a single throw equal to the ball count, depending on your convention). But notice something interesting -- concatenation of two valid sequences is not always valid (you can get landing collisions at the junction). So the set of valid sequences is *not* closed under naive concatenation. You need to restrict to sequences that start and end at the same state. This is exactly the morphism set Hom(s,s) in the *category* of juggling states -- which brings us to state graphs."

**Connection 2: The juggling state graph is a free category on a directed graph**
*Surface at:* Lesson 6-8 (state graphs and transitions).
*How to frame:* "Remember free categories generated by directed graphs from your category theory course? The juggling state graph *is* exactly this. Objects are juggling states (binary vectors indicating which future beats have balls scheduled to land). Morphisms are finite siteswap sequences that transition between states. Composition is concatenation. The free category on the state graph has as its morphisms all possible finite juggling sequences -- and the path-counting problem in the state graph is a morphism-counting problem in this category. The adjacency matrix of the state graph is the matrix of |Hom(s,t)| values for paths of length 1."

**Connection 3: The Yoneda perspective on juggling states**
*Surface at:* Lesson 9-10 (deeper state graph analysis), or as a rabbit hole.
*How to frame:* "The Yoneda lemma from your category theory course says that an object is completely determined by its relationships to all other objects -- 'you are your morphisms.' Applied to juggling: a juggling state is completely determined by the set of all siteswap sequences reachable from it. Two states are the same if and only if exactly the same patterns can be juggled starting from each. You do not need to look at the ball configuration directly -- the outgoing sequences tell you everything. This is Yoneda applied to the juggling state category. It also means the state graph has no 'redundant' states: distinct binary vectors always have distinct sets of reachable patterns."

**Connection 4: Enriched categories and distances between juggling states**
*Surface at:* Lesson 10-12 (state graph metrics), or during the transition to probabilistic models.
*How to frame:* "You studied Lawvere metric spaces -- categories enriched over ([0, infinity], +, 0) -- in your category theory course. The juggling state graph becomes a Lawvere metric space when you define the distance between states s and t as the length of the shortest siteswap sequence transitioning from s to t. This is a genuine (asymmetric) metric: d(s,t) can differ from d(t,s), and the triangle inequality d(s,u) <= d(s,t) + d(t,u) holds because you can concatenate transition sequences. The diameter of this metric space (the longest shortest-path between any two states) tells you the worst-case 'cost' of transitioning between any two patterns -- practically, how long a transition sequence you might need."

### From Optimal Transport

**Connection 5: Ball redistribution as a discrete transport problem**
*Surface at:* Lesson 6-8 (state transitions), and revisit at Lesson 17-18 (probabilistic models).
*How to frame:* "When you transition from one juggling state to another, you are redistributing balls across future time slots. This is a discrete transport problem: balls are 'mass' located at their current scheduled landing times, and you need to transport them to new landing times. Each throw reassigns one unit of mass, and the 'cost' is the throw value (temporal displacement). The Kantorovich LP formulation from your optimal transport course gives the framework: minimize total throw effort subject to the constraint that every ball gets caught and re-thrown. The optimal transition between two states is the minimum-cost matching between current landing times and target landing times."

**Connection 6: Wasserstein distance between juggling patterns**
*Surface at:* Lesson 10-12 (state graph metrics and pattern comparison).
*How to frame:* "Here is a way to define a distance between juggling patterns using optimal transport. View a periodic siteswap as an empirical distribution over throw values: the pattern 441 gives the distribution {4: 2/3, 1: 1/3}, while 531 gives {5: 1/3, 3: 1/3, 1: 1/3}. The 1-Wasserstein distance between these distributions measures how 'far apart' the patterns are in terms of throw-value distribution. Patterns with similar throw distributions (like 441 and 531, both 3-ball) will be close; patterns with very different distributions (like 3 and 900) will be far. This gives a metric on the space of patterns that captures a different notion of similarity than the state-graph metric -- it measures distributional similarity rather than transition cost."

**Connection 7: Sinkhorn and multi-person passing patterns**
*Surface at:* Lesson 31-35 (multiplex and passing patterns), if covered.
*How to frame:* "In multi-person passing patterns, each juggler must assign throws to other jugglers at each beat. This assignment problem -- who throws to whom, and with what throw value -- is a bipartite matching that can be modeled as a discrete transport plan. The Sinkhorn algorithm from your optimal transport course provides an efficient way to find approximately optimal passing schedules when the number of jugglers and balls is large. Entropic regularization smooths the combinatorial explosion, giving a practical tool for pattern design."

### From Origami Mathematics

**Connection 8: Local-vs-global consistency is the same structural phenomenon**
*Surface at:* Lesson 3-5 (the average theorem and permutation test), and revisit at Lesson 11-13 (enumeration).
*How to frame:* "You saw this exact phenomenon in origami: Kawasaki's theorem and Maekawa's theorem give local necessary conditions for flat-foldability (angles must sum correctly at each vertex; M-V count must differ by 2), but global flat-foldability is NP-hard. In juggling, the average theorem is the local necessary condition (throw values must average to the ball count), but checking that a sequence is globally valid -- that no two balls collide -- requires the permutation test, which checks a global condition. The structural parallel is precise: both fields have a cheap arithmetic filter (Maekawa / average theorem) that eliminates most invalid configurations, followed by an expensive global consistency check (flat-fold assignment / permutation test) that is needed for full validation. The reduction from constraint satisfaction that makes origami global flat-foldability NP-hard has a direct analogue in the complexity of certain juggling pattern-generation problems."

**Connection 9: Counting valid configurations under constraints**
*Surface at:* Lesson 11-14 (enumeration of siteswap sequences).
*How to frame:* "The enumeration problem for valid siteswaps -- how many valid sequences of period p with at most b balls? -- is structurally parallel to the enumeration problem for flat-foldable crease patterns under constraints. Both ask: given a discrete structure with local and global constraints, how many valid configurations exist? The answer in juggling is clean: (b+1)^p, via a bijection argument. The answer in origami is typically much harder (no clean closed form for general flat-fold counting). Comparing the two reveals why: juggling's constraint structure (a permutation condition) decomposes nicely, while origami's (layer ordering with non-crossing) does not. This is a case study in why some combinatorial problems have beautiful answers and others do not."

**Connection 10: Parameterized complexity and tractability via structural parameters**
*Surface at:* Lesson 14-16 (advanced enumeration), as a brief aside.
*How to frame:* "You studied fixed-parameter tractability by ply and treewidth in your origami course -- the idea that hard problems become tractable when a structural parameter is small. The same phenomenon appears in juggling. Enumerating all valid siteswaps is easy when the period p or ball count b is fixed (polynomial in the other parameter), but the full problem over all p and b grows exponentially. The number of balls plays the role that ply plays in origami: it bounds the 'thickness' of the combinatorial structure and makes otherwise hard questions computationally tractable."

### Connection surfacing strategy

Do not dump all connections at once. Surface each connection at the lesson where the juggling concept it connects to is being introduced, using the phrase pattern: "You already studied [X] in your [course name] course -- here it appears as [Y]." Keep the connection to 2-3 sentences unless the student engages and wants to explore further. If they do, follow the thread for up to 5 minutes before returning to the main lesson.

Prioritize connections by pedagogical value:
1. **Highest value** (surface these reliably): Connection 2 (free category / state graph), Connection 8 (local-vs-global), Connection 5 (transport / state transitions). These deepen understanding of the juggling material itself.
2. **Medium value** (surface if the moment is right): Connection 1 (monoid), Connection 6 (Wasserstein), Connection 9 (counting).
3. **Lower value** (use as optional rabbit holes): Connection 3 (Yoneda), Connection 4 (enriched category), Connection 7 (Sinkhorn), Connection 10 (parameterized complexity).
