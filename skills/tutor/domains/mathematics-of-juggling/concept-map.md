# Mathematics of Juggling -- Concept Map

**Level:** Intermediate (solid combinatorics and proof skills; building toward reading Buhler et al. 1994 and Warrington 2003)
**Prior topics:** Category Theory, Optimal Transport, Origami Mathematics
**Generated:** 2026-08-20

---

## Core Concepts in Learning Order

| #  | Concept | Description | Depends on |
|----|---------|-------------|------------|
| 1  | **Physical juggling model** | Beats (discrete time steps), throws, catches, hands, balls; dwell time (how long a ball stays in the hand), flight time (how long it is in the air), vacant time (how long a hand is empty); the abstraction that turns a physical activity into a discrete dynamical system | External: none beyond curiosity |
| 2  | **Shannon's juggling theorem** | The equation (F+D)H = (V+D)N relating flight time F, dwell time D, vacant time V, number of balls N, and number of hands H; the first formal mathematical result about juggling (Shannon, 1993); a conservation law constraining the physical parameters | 1 |
| 3  | **Siteswap notation** | Each throw is represented by a non-negative integer indicating how many beats until that ball is thrown again; 0 = empty hand (no throw), 1 = a quick hand-off, 2 = a hold, 3 = the standard cascade throw; a sequence like 531 means "throw to land in 5 beats, then 3, then 1, repeat"; the central encoding of the entire field | 1 |
| 4  | **Ladder diagrams** | Space-time visualization: two vertical columns (left and right hand), horizontal rows for beats, arcs connecting throw-beat to catch-beat; makes crossing patterns, collisions, and periodicity visible at a glance; the primary tool for building intuition about siteswap sequences | 3 |
| 5  | **The average theorem** | For any valid siteswap sequence, the average of the throw values equals the number of balls; a 3-ball pattern like 441 has average (4+4+1)/3 = 3; a necessary condition for validity that provides instant ball-count readability from notation alone | 3 |
| 6  | **Landing schedules** | For a throw of value s at beat i, the ball lands at beat i + s; computing the full landing schedule for a sequence reveals when each ball arrives; two balls landing at the same beat is a collision (physical impossibility), which is the key constraint siteswap must avoid | 3 |
| 7  | **The permutation test** | A period-p siteswap (s_0, s_1, ..., s_{p-1}) is valid iff the values {(s_i + i) mod p : i = 0, ..., p-1} are all distinct (i.e., form a permutation of {0, 1, ..., p-1}); equivalently, no two balls land at the same beat; the complete validity criterion for periodic siteswaps | 5, 6 |
| 8  | **Siteswap sequences as permutations** | A valid period-p siteswap defines a permutation sigma on Z/pZ via sigma(i) = (s_i + i) mod p; this maps the throw-beat to the landing-beat; the permutation encodes the entire temporal structure of the pattern; connects juggling to the rich theory of permutation combinatorics | 7 |
| 9  | **Local validity vs global realizability** | The average theorem is a necessary local check (analogous to Maekawa's theorem in origami); the permutation test is the complete validity criterion for finite-period patterns; for infinite or aperiodic sequences, global realizability requires that no beat ever has two balls scheduled to land, a condition that can be harder to verify; the local-vs-global gap is a recurring structural theme across combinatorial theories | 5, 7 |
| 10 | **Juggling states** | A binary string (or 0/1 vector) of length equal to the maximum throw height, where position j is 1 if a ball is scheduled to land j beats from now and 0 otherwise; the state encodes the juggler's "future obligations"; for b balls with maximum throw height h, the state is a binary string of length h with exactly b ones | 6, 7 |
| 11 | **State transition graphs** | A directed graph whose nodes are all possible juggling states (binary strings of a given length with a given number of ones) and whose edges are labeled by throw values; from state s, a throw of value t is possible iff the leftmost bit of s is 1 (a ball is arriving now) and position t is 0 (nothing is already scheduled to land there); a valid siteswap is a closed walk in this graph | 10 |
| 12 | **Ground state and excited state** | For b balls with max throw b, the ground state is 1^b 0^0 (= 111...1); it is the unique state reachable from any other state and from which any other reachable state can be reached; patterns starting and ending at the ground state (e.g., the cascade 333) can be entered freely; excited-state patterns (e.g., the siteswap 51) require specific "transition sequences" to enter and exit; coined by Paul Klimek (1981) | 10, 11 |
| 13 | **Reachability and orbit structure** | Which states can reach which other states via valid throw sequences; the ground-state component is strongly connected; excited-state components may have more complex structure; the state graph decomposes into connected components whose structure governs which patterns can be chained together; the directed graph is the transition system of a finite automaton | 11, 12 |
| 14 | **The (b+1)^p counting theorem** | The number of valid siteswap sequences of period p with at most b balls is exactly (b+1)^p; proved by Buhler, Eisenbud, Graham, and Wright (1994); an astonishingly clean closed-form count for what appears to be a complex combinatorial constraint problem; this is the central enumerative result of the field | 7, 10 |
| 15 | **Proof of the counting theorem** | The bijective proof constructs a map from all sequences over {0, 1, ..., b}^p (unconstrained) to valid siteswaps with at most b balls; the key insight is that the landing schedule of any sequence over {0,...,b}^p, when "squeezed" to remove collisions, produces a unique valid siteswap; the inverse map exists and is explicit; a model of elegant bijective combinatorics | 14 |
| 16 | **Drops and descents in juggling permutations** | A drop at position i occurs when the throw value s_i is less than the period p minus i (the ball "drops" to an earlier cyclic position); drops in juggling permutations correspond to descents in classical permutation theory; the number of drops governs the complexity of the pattern; connects juggling to Eulerian numbers and descent statistics (Buhler et al. 1994) | 8, 14 |
| 17 | **Primitive (indecomposable) juggling sequences** | A siteswap is primitive if it cannot be written as the concatenation of two shorter valid siteswaps; the atoms of siteswap algebra; every siteswap decomposes uniquely into a product of primitives; counting primitives requires Mobius inversion; studied by Chung and Graham (2008) | 14, 15 |
| 18 | **Stirling numbers in juggling** | The Stirling number of the second kind S(n,k) counts partitions of an n-set into k non-empty blocks; these numbers appear in juggling when counting sequences by the number of distinct throw values used, when computing landing schedule statistics, and most strikingly in the steady-state probabilities of random juggling (concept 29); the same constants that govern set partitions govern juggling | 14, 16 |
| 19 | **Juggling cards and card sequences** | A representation of juggling patterns as sequences of "cards" tracking the relative ordering of balls; each card encodes which ball is thrown next and where it goes; connected to Dyck paths, Narayana numbers, and boson normal ordering in quantum mechanics; provides a second combinatorial lens on siteswap distinct from the permutation view (Butler, Chung, Cummings, Graham 2015) | 10, 14 |
| 20 | **Descent polynomials for bounded-drop permutations** | The generating polynomial D_{n,b}(x) = sum_{sigma} x^{des(sigma)} over permutations of {1,...,n} with all drops bounded by b; these polynomials refine the (b+1)^n count by tracking descent count; real-rooted with log-concave coefficients; deepens the permutation-theoretic structure beneath juggling (Chung, Claesson, Dukes, Graham 2010) | 16, 17 |
| 21 | **Universal juggling cycles** | A single cyclic sequence of length (b+1)^p such that every valid siteswap of period p with at most b balls appears as a consecutive p-length window; the juggling analog of de Bruijn sequences; existence proved by Chung and Graham (2007) via Eulerian path arguments on an auxiliary graph; a compression of the entire siteswap space into one sequence | 11, 17 |
| 22 | **Monoid structure of siteswap concatenation** | The set of all valid siteswaps forms a monoid (associative binary operation with identity) under concatenation; the identity is the empty sequence; primitive sequences are the irreducible elements; this monoid is a one-object category; pattern composition, decomposition, and algebraic classification all follow from the monoid structure | 8, 17 |
| 23 | **Synchronous siteswap notation** | Notation for patterns where both hands throw simultaneously on the same beat; uses parenthesized pairs (a,b) where a is the left-hand throw and b the right; requires modified state vectors (one per hand) and adjusted validity rules; the synchronous 3-ball shower is (4x,2x); the "x" denotes crossing throws | 3, 10 |
| 24 | **Multiplex siteswap notation** | Notation for patterns where multiple balls are thrown from the same hand on the same beat; uses bracketed lists [ab] to indicate two balls thrown simultaneously with values a and b; extends the state model to allow multiple balls landing at the same beat; multiplex enumeration requires matrix methods (Butler, Graham 2008) | 3, 10, 14 |
| 25 | **Bounded affine permutations** | A bijection f: Z -> Z satisfying f(i+n) = f(i)+n (periodicity) and i <= f(i) <= i+n (boundedness); the natural generalization of period-n siteswaps from permutations of Z/nZ to permutations of all of Z; the combinatorial objects that index cells in the affine flag variety and positroid strata of the Grassmannian (Knutson, Lam, Speyer 2013) | 8, 16, 20 |
| 26 | **q-analogues of juggling enumeration** | Replacing ordinary counting with q-weighted enumeration via juggling cards; the q-Stirling numbers of the second kind S_q(n,k) arise naturally; when q -> 1, ordinary counts are recovered; q-Stirling numbers compute the Poincare series of the affine Weyl group of type A; connects juggling to the deep algebraic combinatorics of Coxeter groups (Ehrenborg, Readdy 1996) | 18, 19 |
| 27 | **Random juggling model** | Modeling a juggler who throws randomly at each beat: given the current state (which future beats have balls scheduled), the juggler selects a throw value according to some probability distribution over the set of valid throws from that state; the simplest model uses the uniform distribution (each valid throw equally likely); introduced by Warrington (2003) | 10, 11 |
| 28 | **Markov chain formulation** | The juggling state sequence under random throwing is a finite, discrete-time, homogeneous Markov chain on the state graph; the transition matrix is determined by the throw distribution; the chain is irreducible (from the ground-state component's strong connectivity) and aperiodic, so a unique stationary distribution exists | 13, 27 |
| 29 | **Steady-state distributions and Stirling numbers** | Under the uniform random throw model, the stationary probability of being in a state with b balls is proportional to S(h, h-b), where h is the maximum throw height and S is a Stirling number of the second kind; the same constants that count set partitions govern the long-run probability of juggling b balls; a deep and unexpected connection (Warrington 2003) | 18, 28 |
| 30 | **Multivariate juggling probabilities** | Extending Warrington's model to non-uniform throw distributions (where each throw height has its own probability parameter) and to unbounded numbers of balls; Ayyer, Bouttier, Corteel, and Nunzi (2014) derive explicit product formulas for stationary probabilities in terms of integer partitions; connects to combinatorics of partition identities and exactly solvable models | 29 |
| 31 | **Distances and metrics on juggling states** | Defining a metric on the set of juggling states via shortest-path distance in the state graph (minimum number of throws to transition between states); the state graph becomes a metric space; viewing this through the lens of enriched category theory (concept from Category Theory), the state graph is a category enriched over (N, +, 0) where the hom-value is the graph distance | 13 |
| 32 | **Juggling braids** | Each ball's trajectory through space-time traces a strand; the collection of strands forms a braid; crossings (one ball passing over or under another) correspond to throw-catch events; the natural map from periodic siteswaps to elements of the braid group B_n; braid composition corresponds to pattern concatenation | 4, 8 |
| 33 | **From siteswaps to links** | Closing a juggling braid (connecting the top ends to the bottom ends) produces a link (a collection of intertwined closed curves in 3-space); Devadoss and Mugno (2006) prove that every braid -- and therefore every knot and every link -- can be realized as a juggling pattern; juggling is topologically universal | 32 |
| 34 | **The Grassmannian Gr(k,n)** | The space of all k-dimensional linear subspaces of an n-dimensional vector space; a smooth projective algebraic variety; its cell decomposition by Schubert cells is indexed by certain permutations; bounded affine permutations from concept 25 generalize the indexing to the affine Grassmannian and to positroid stratifications | 25 |
| 35 | **Positroid varieties and juggling** | Positroid varieties are certain subvarieties of the Grassmannian defined as intersections of cyclically rotated Schubert varieties; they are indexed by bounded affine permutations, which are exactly the juggling patterns from concept 25; Knutson, Lam, and Speyer (2013) establish the geometry, proving that these varieties have remarkable properties (rational, normal, Cohen-Macaulay); the highest-cited paper in the field (170 citations) | 25, 34 |
| 36 | **Juggling automata and formal languages** | The set of valid siteswap sequences (with bounded throw height) forms a regular language: the state transition graph is the finite automaton, states are automaton states, throw values are input symbols; siteswap sequences of period exactly p correspond to cycles of length p in the automaton; enumeration via transfer matrices connects to automata-theoretic counting techniques | 11, 13 |
| 37 | **Multi-person passing patterns** | Extending siteswap to multiple jugglers passing objects between them; each throw is annotated with a destination juggler; generalized state models track ball schedules across all jugglers; causal diagrams show the cause-effect chain of passes; connections to network flow and multi-agent scheduling; formalization lags well behind juggling practice, with much notation still ad hoc | 11, 24 |
| 38 | **Open problems and research frontiers** | Spin juggling (Varpanen 2014) extends the state graph formalism to account for object orientation; quiver Grassmannians generalize the positroid connection to representation theory; juggler's friezes (Docampo, Muller 2022) parameterize SL(k)-friezes by juggling functions; computational complexity of optimal multiplex pattern generation; the gap between continuous dynamics (trajectory optimization, robotic juggling) and the discrete combinatorial theory | 17, 25, 30, 33, 35 |

---

## Dependency Graph

```
                    EXTERNAL PREREQUISITES
    [Combinatorics]   [Probability]   [Linear Algebra]   [Graph Theory]
          |                |                |                  |
          v                v                v                  v
    (1) PHYSICAL JUGGLING MODEL
         |           |           |
         v           |           |
    (2) Shannon's    |           |
     theorem         |           |
                     v           |
               (3) SITESWAP NOTATION
                /        |        \
               v         v         v
         (4) Ladder  (5) Average  (6) Landing
          diagrams    theorem      schedules
              |          |    \       |
              |          v     v      v
              |     (7) THE PERMUTATION TEST  <---- central validity gate
              |          |         |
              |          v         v
              |     (8) Siteswaps  (9) Local vs
              |      as permutations   global validity
              |          |    |
              |          |    +-----------------------------+
              |          v                                  |
              |    (10) JUGGLING STATES  <--------- second gate
              |          |         |         |
              |          v         |         |
              |    (11) STATE TRANSITION GRAPHS              |
              |       /     |     \       \                  |
              |      v      v      v       v                 |
              | (12) Ground/  (13) Reach-  (27) Random       |
              |  excited state  ability     juggling model   |
              |      |          |    |           |           |
              |      +-----+   |    |           v           |
              |            |   |    |     (28) MARKOV CHAIN  |
              |            v   v    |      FORMULATION       |
              |                |    |           |            |
              +--+             |    |           |            |
                 |             |    |           |            |
                 v             |    v           |            |
           (7) + (10) ------> |  (31) Metrics  |            |
                 |             |   on states    |            |
                 v             |                |            |
           (14) (b+1)^p       |                |            |
            COUNTING THEOREM  |  (36) Juggling |            |
              /    |    \     |   automata &   |            |
             v     v     v    |   formal langs |            |
        (15) Proof (16) Drops |                |            |
             |      & descents|                |            |
             |      |    |    |                |            |
             v      v    |    |                |            |
        (17) Primitive   |    |                |            |
         sequences       |    |                |            |
          /   |   \      |    |                |            |
         v    v    v     |    |                |            |
   (21) Univ (22) Monoid |    |                |            |
    cycles   structure   |    |                |            |
                         v    |                |            |
                   (18) STIRLING NUMBERS        |            |
                    in juggling                 |            |
                         |    |                 |            |
                         v    v                 v            |
                   (19) Juggling    (29) STEADY-STATE        |
                    cards            = STIRLING NUMBERS      |
                         |                 |                 |
                         v                 v                 |
                   (26) q-analogues  (30) Multivariate       |
                    & q-Stirling      probabilities          |
                                                             |
            +-----(16)-----+----(17)----+                    |
            |              |            |                    |
            v              v            v                    |
      (20) Descent   (25) BOUNDED AFFINE PERMUTATIONS       |
       polynomials        |              |                   |
                          v              v                   |
                    (34) The       (35) POSITROID            |
                     Grassmannian   VARIETIES                |
                                                             |
         (4)---+                                             |
               |                                             |
               v                                             |
         (32) JUGGLING BRAIDS <----- (8) ----+               |
               |                             |               |
               v                             |               |
         (33) Siteswaps to links             |               |
          (every braid is a                  |               |
           juggling pattern)                 |               |
                                             |               |
         (11)------+-----(24)                |               |
                   |       |                 |               |
                   v       v                 |               |
             (37) Multi-person               |               |
              passing patterns               |               |
                                             |               |
         +----(3)-----(10)----(14)----+      |               |
         |                            |      |               |
         v                            v      |               |
   (23) Synchronous            (24) Multiplex                |
    siteswap                    siteswap                     |
                                                             |
         (17)---(25)---(30)---(33)---(35)                    |
               \    |     |     |    /                       |
                v   v     v     v   v                        |
              (38) OPEN PROBLEMS &                           |
               RESEARCH FRONTIERS                           |
```

### Detailed flow by phase

```
 PHASE 1: THE LANGUAGE OF THROWS     PHASE 2: STATES, GRAPHS, AND COUNTING
 Module 1 (Days 1-6)                  Module 2 (Days 7-12)
================================    ================================

 (1) Physical model                  (10) JUGGLING STATES
  |                                   |          |
 (2) Shannon's theorem              (11) State   (12) Ground/
  |                                   transitions  excited
 (3) SITESWAP NOTATION               |          |
  |       |       |                  (13) Reachability
 (4)     (5)     (6)                  |
 Ladder  Average  Landing           (14) (b+1)^p COUNTING THEOREM
 diagrams theorem  schedules          |       |
  |       |                          (15) Proof
 (7) PERMUTATION TEST                 |
  |                                  (24) Multiplex notation
 (9) Local vs global validity             & enumeration
  |
 (23) Synchronous notation


 PHASE 3: PERMUTATIONS AND DESCENTS  PHASE 4: RANDOM JUGGLING
 Module 3 (Days 13-18)               Module 4 (Days 19-24)
================================    ================================

 (8) Siteswaps as permutations       (27) Random juggling model
  |                                   |
 (16) Drops & descents              (28) MARKOV CHAIN formulation
  |       |                           |
 (17) Primitive sequences           (29) STEADY-STATE = STIRLING
  |                                   |
 (18) Stirling numbers              (30) Multivariate probabilities
  |
 (20) Descent polynomials
  |
 (22) Monoid structure


 PHASE 5: BRAIDS, GEOMETRY, AND THE FRONTIER
 Module 5 (Days 25-30)
================================

 (25) BOUNDED AFFINE PERMUTATIONS
  |              |
 (32) Juggling  (34) The Grassmannian
  braids          |
  |              (35) POSITROID VARIETIES
 (33) Siteswaps
  to links
  |
 (38) Open problems & research frontiers


 CONCEPTS IN MAP BUT DEFERRED FROM CURRICULUM
================================

 (19) Juggling cards and card sequences
 (26) q-analogues of juggling enumeration
 (31) Distances and metrics on juggling states
 (36) Juggling automata and formal languages
 (37) Multi-person passing patterns
```

---

## Bottleneck Concepts

These are the gates -- if the student does not solidify understanding here, everything downstream becomes unstable. The student's prior coursework in category theory, optimal transport, and origami provides helpful bridges at each gate, noted below.

| # | Concept | Why it is a bottleneck | Prior-topic bridge |
|---|---------|----------------------|--------------------|
| 7 | **The permutation test** | The complete validity criterion. Every concept after this assumes the student can instantly check whether a sequence is a valid siteswap by computing (s_i + i) mod p and verifying distinctness. The counting theorem proof, the permutation interpretation, drops and descents, and the state model all require fluent application of this test. A student who has to re-derive it each time will drown in the enumeration phase. | From origami: Maekawa's theorem (M - V = +/-2) is an analogous local validity check that filters invalid crease patterns before expensive global analysis. The student already has the mental model of "fast necessary condition that catches most invalid configurations." The permutation test is the juggling analog, but here it is also sufficient for periodic patterns. |
| 10 | **Juggling states** | The state model is the foundation for the state transition graph (which enables enumeration, automata theory, and metric structure), the Markov chain model (the entire probabilistic branch), and ground/excited state classification. A student who cannot fluently translate between a siteswap sequence and its state trajectory will struggle with every subsequent concept. This is the representation that connects the notation to a dynamical system. | From category theory: the student has internalized the idea of objects-as-states and morphisms-as-transitions. The state transition graph is literally a free category on a directed graph (category theory concept 2). From optimal transport: the state vector is a discrete probability distribution over future landing beats, and transitions are transformations of this distribution. |
| 14 | **The (b+1)^p counting theorem** | The central result of the field. Its proof technique (bijection with unconstrained sequences) is reused and generalized throughout the enumeration and algebraic branches. Understanding why the count is so clean despite the permutation constraint requires mastering the bijection. Primitive sequences, descent polynomials, Stirling number connections, q-analogues, and multiplex enumeration all build on this theorem or its proof method. | From origami: the student has experience with combinatorial enumeration under geometric constraints (counting flat-foldable crease patterns). The surprise that constraints can lead to clean closed-form counts (not ugly inclusion-exclusion sums) is a pattern they have seen before. |
| 25 | **Bounded affine permutations** | The gateway to algebraic geometry. Without understanding how periodic siteswaps extend to bijections f: Z -> Z with f(i+n) = f(i)+n and i <= f(i) <= i+n, the student cannot see why juggling patterns index cells of the Grassmannian. This concept also links back to descent polynomials and forward to positroid varieties. It is the algebraic object that makes juggling speak the language of algebraic combinatorics. | From category theory: bounded affine permutations form a submonoid of the group of bijections Z -> Z, and the periodicity condition f(i+n) = f(i)+n makes them a "categorified" version of the finite permutations the student studied in concepts 8 and 16. The student's comfort with abstract algebraic structures makes this extension natural. |
| 28 | **Markov chain formulation** | The gateway to the entire probabilistic branch of the theory. Reading Warrington (2003) requires understanding how the state sequence becomes a Markov chain, what irreducibility and ergodicity mean in this context, and why a unique stationary distribution exists. Without this, the Stirling number connection in concept 29 is unmotivated. | From optimal transport: the student has worked extensively with probability measures, couplings, and convergence of discrete distributions. The Markov chain on juggling states is a concrete, finite-state instance of the measure-theoretic machinery they already command. The transition from "deterministic juggling" to "random juggling" mirrors the Monge-to-Kantorovich relaxation they studied in OT. |

### Secondary gates (important but less catastrophic if shaky)

| # | Concept | Risk if weak |
|---|---------|-------------|
| 8 | **Siteswap sequences as permutations** | The algebraic interpretation connects juggling to permutation statistics (descents, drops, inversions). If the student sees siteswaps only as sequences of numbers and not as permutations, the descent polynomial theory (concept 20) and bounded affine permutation extension (concept 25) will feel arbitrary rather than natural. |
| 16 | **Drops and descents** | The bridge between juggling-specific counting and classical permutation combinatorics. Weakness here breaks the path to descent polynomials, bounded-drop permutations, and the Chung-Claesson-Dukes-Graham results. |
| 17 | **Primitive sequences** | Needed for the monoid decomposition (concept 22), universal cycles (concept 21), and the Mobius inversion technique that counts them. If primitives feel opaque, the algebraic structure of siteswap space remains invisible. |

---

## Mind-Blowing Concepts

These are the moments that drive engagement and make the mathematical structure tangible. Lesson days are approximate.

| # | Concept | The "aha!" moment | Suggested day | Cross-topic resonance |
|---|---------|-------------------|---------------|----------------------|
| 2 | **Shannon's juggling theorem** | "One equation -- (F+D)H = (V+D)N -- governs every juggling pattern that has ever been or could ever be performed. Shannon, the father of information theory, also built the first juggling robot. The equation is a conservation law: it says the total time a ball spends in hands and air, summed over all balls, equals the total time hands spend holding and being empty, summed over all hands. It is both obvious in hindsight and powerful in application." | Day 2 | Conservation laws appear throughout OT (mass conservation in the continuity equation) and origami (Maekawa's parity constraint is a topological conservation law). Shannon's theorem is the juggling conservation law. |
| 5 | **The average theorem** | "Look at any siteswap -- say, 97531. The average is (9+7+5+3+1)/5 = 5. That means it is a 5-ball pattern. You did not simulate it, draw a diagram, or check validity. You just averaged. This works for EVERY valid siteswap, no exceptions. The number of balls is encoded in the notation as a simple arithmetic mean." | Day 4 | Analogous to reading the number of mountain folds from a Maekawa count in origami. Simple arithmetic extracts deep structural information. |
| -- | **Pattern 441** (arises from concept 7) | "In 1985, mathematicians at Caltech applied the permutation test and discovered that the sequence 4-4-1 is a valid 3-ball pattern. No juggler had ever performed it. They went to the juggling club and said: 'This should be possible.' Within minutes, someone was juggling it. Mathematics predicted a physical pattern that human creativity had missed. Siteswap has since generated hundreds of 'mathematically discovered' patterns now in every juggler's repertoire." | Day 8 | Recalls how origami axiom systems (Huzimi-Hatori) predicted constructible numbers that no folder had constructed. Mathematical formalization reveals possibilities that practice alone overlooks. |
| 14 | **The (b+1)^p counting theorem** | "How many valid 3-ball siteswap patterns of period 4 are there? You might expect a messy inclusion-exclusion answer. Instead: exactly (3+1)^4 = 256. For 5 balls, period 3: (5+1)^3 = 216. The formula is absurdly clean. The reason is a beautiful bijection: there is a one-to-one correspondence between ALL sequences of length p over the alphabet {0,1,...,b} and valid siteswaps with at most b balls. No constraints survive the bijection -- they are absorbed into the encoding." | Day 15 | The student has seen clean closed-form counts emerge from constrained combinatorial problems in origami (e.g., the number of valid mountain-valley assignments for certain crease patterns). The (b+1)^p theorem is the juggling instance of this phenomenon. |
| 21 | **Universal juggling cycles** | "Imagine a single, very long cyclic sequence of numbers. Slide a window of width p along it. Every valid p-periodic siteswap with at most b balls appears in some window position. ALL of them. One ring to rule them all. This is the juggling analog of a de Bruijn sequence, and Chung and Graham proved it exists by finding Eulerian circuits in an auxiliary graph." | Day 22 | De Bruijn sequences are a classical object in combinatorics. The student's category-theory background makes the Eulerian circuit argument natural: it is a morphism-exhaustion argument in the state-transition category. |
| 29 | **Steady-state = Stirling numbers** | "A random juggler throwing uniformly at each beat will, in the long run, spend time in each state proportional to a Stirling number of the second kind. The Stirling numbers -- which count ways to partition a set into non-empty blocks -- secretly govern the equilibrium of random juggling. Two completely different combinatorial worlds (set partitions and juggling patterns) share the same constants. Why? Because the landing schedule bijection in the counting theorem maps uniform random siteswaps to uniform random sequences, and partitioning a sequence into blocks of equal landing times is exactly a set partition." | Day 31 | The Giry monad from category theory formalizes probability measures; the Stirling numbers are the bridge constants. From OT: the stationary distribution is the fixed point of the transition operator, analogous to how the Wasserstein barycenter is the fixed point of the Frechet functional. |
| 33 | **Every link is a juggling pattern** | "Devadoss and Mugno proved that EVERY braid -- and therefore every knot and every link in 3-dimensional space -- can be realized as a juggling pattern. The trefoil knot? That is a juggling pattern. The Borromean rings? A juggling pattern. The topology of 3-space is encoded in the combinatorics of throwing and catching. Juggling is topologically universal." | Day 35 | The student has seen universality results before: Turing completeness of flat origami (Hull-Zakharevich) and computational universality in category theory. Juggling's topological universality is a third instance of a simple physical activity encoding all possible complexity. |
| 35 | **Positroid varieties** | "The Grassmannian -- the space of all k-dimensional subspaces of n-space -- is one of the central objects of algebraic geometry. Its beautiful cell decomposition into positroid strata is indexed by... bounded affine permutations. Which are... juggling patterns. The most abstract corner of algebraic geometry speaks the same combinatorial language as a street performer with three balls. Knutson, Lam, and Speyer's 2013 paper connecting these two worlds is the highest-cited paper in the mathematics of juggling (170 citations), and it lives in the heart of algebraic geometry, not combinatorics." | Day 37 | From category theory: the Grassmannian is a representable functor on the category of vector spaces (it represents the functor sending V to the set of k-dimensional subspaces). The positroid stratification is a decomposition of this functor into pieces indexed by juggling combinatorics. |

---

## Common Misconceptions

| Concept | Misconception | Reality |
|---------|--------------|---------|
| **Siteswap notation** (3) | "A higher siteswap number means a higher physical throw." | The number encodes temporal displacement (how many beats until the ball is thrown again), not spatial height. A throw of 7 in a fast-tempo pattern may be physically lower than a throw of 3 in a slow-tempo pattern. Siteswap abstracts away all spatial information -- height, trajectory, hand position -- and encodes only the timing structure. Two physically different-looking patterns can have the same siteswap. |
| **The average theorem** (5) | "The average theorem is sufficient to determine whether a sequence is a valid siteswap." | It is necessary but far from sufficient. The sequence 4-3-2 has average 3 (a 3-ball average), but it is invalid: throws at beats 0 and 2 both land at beat 4 (collision). The average theorem filters out sequences whose average is non-integer, but many integer-average sequences still fail the permutation test. The student should think of it as a fast pre-filter, not a validity check. This parallels Maekawa's theorem in origami: M-V = +/-2 is necessary for flat-foldability but does not guarantee it. |
| **Siteswap validity** (7) | "There are infinitely many valid 3-ball siteswap patterns of any given period." | By the (b+1)^p counting theorem, there are exactly (3+1)^p = 4^p valid siteswaps of period p with at most 3 balls. For period 3, that is 64 -- a finite, enumerable set. The siteswap space is discrete and bounded, not a continuum. |
| **Juggling states** (10) | "The state only tracks how many balls are in play." | The state tracks which specific future beats have balls scheduled to land -- a much finer distinction than just a ball count. Two states can have the same number of balls but completely different future obligations. For example, with max throw 4, the states 1100 and 1010 both have 2 balls, but they are different states with different sets of valid throws. The state is a schedule, not a census. |
| **Ground vs excited state** (12) | "Excited-state patterns are exotic or unimportant; most juggling uses ground-state patterns." | Many of the most beautiful and widely practiced patterns are excited-state. The siteswap 51 (a 3-ball pattern) is excited-state and is the foundation of many passing patterns. Excited states have richer mathematical structure: their reachability properties, the transition sequences required to enter and exit them, and their representation in the state graph all carry nontrivial combinatorial information. |
| **The counting theorem** (14) | "The counting theorem must use sophisticated techniques like generating functions or inclusion-exclusion." | The proof is elementary and bijective. It constructs an explicit one-to-one map between unrestricted sequences over {0,...,b}^p and valid siteswaps. The bijection is the landing schedule map, composed with a "collision-resolution" step. No generating functions, no complex analysis, no heavy machinery. The beauty is that a seemingly constrained set has a clean bijection with an unconstrained set. |
| **Primitive sequences** (17) | "Every siteswap can be decomposed into primitives in many different ways." | The decomposition is unique. A siteswap is a finite string over a structured alphabet, and the primitivity condition (no proper prefix is a valid siteswap) gives a unique factorization, analogous to unique prime factorization of integers. This uniqueness is what makes the monoid structure algebraically clean. |
| **Siteswap as permutation** (8) | "The permutation associated to a siteswap depends on which ball is which." | Siteswap permutations act on beats (time slots), not on balls. The permutation sigma(i) = (s_i + i) mod p maps each throw-beat to its landing-beat. The identity of individual balls is invisible to siteswap -- it tracks only temporal structure. This is why siteswap is a combinatorial, not a physical, object. |
| **Markov chain model** (28) | "The random juggling model assumes the juggler is bad at juggling." | The model is not about skill; it is about exploring the state space. A "random juggler" is a mathematical device for sampling siteswap sequences, analogous to a random walk exploring a graph. The stationary distribution tells us about the structure of the state graph (which states are combinatorially central), not about human performance. Warrington's result reveals that Stirling numbers govern the combinatorial centrality of juggling states. |
| **Juggling braids** (32) | "The braid associated to a siteswap is just a visualization aid, not a true mathematical object." | The map from siteswaps to braids is a well-defined homomorphism to the braid group. It respects composition: concatenating siteswaps corresponds to composing braids. The braid captures topological information (linking, knotting) that is invisible to the siteswap sequence alone. Two different siteswaps can produce the same braid, and this equivalence relation is mathematically meaningful. |
| **Positroid connection** (35) | "The connection between juggling and algebraic geometry is a cute analogy, not real mathematics." | It is a precise theorem, not an analogy. Bounded affine permutations (which ARE juggling patterns) are the combinatorial objects that INDEX the cells in the positroid decomposition of the Grassmannian. The connection is a bijection between a set of juggling patterns and a set of geometric cells. Properties of the juggling pattern (period, ball count, drops) translate to geometric properties of the variety (dimension, singularity type, cohomology class). This is hard mathematics published in Compositio Mathematica (2013). |

---

## Prerequisite Topics

### External prerequisites (mathematical background)

| External Topic | Level Needed | Which Concepts It Enables | Student Status |
|---------------|-------------|--------------------------|---------------|
| **Combinatorics (enumerative)** | Solid: permutations, binomial coefficients, generating functions, Stirling numbers, Mobius inversion, bijective proofs | 7, 8, 14-22, 26 (core of the course) | Assumed solid per student description ("solid combinatorics and proof skills") |
| **Probability theory** | Intermediate: discrete probability distributions, Markov chains, stationary distributions, ergodicity, mixing times | 27-30 (probabilistic branch) | Covered extensively in OT curriculum (discrete measures, convergence, Markov processes); should be strong |
| **Linear algebra** | Intermediate: vector spaces, subspaces, dimension, Grassmannians as a concept, basic matrix theory | 24 (transfer matrices for multiplex enumeration), 34-35 (Grassmannian, positroid varieties) | Assumed solid |
| **Abstract algebra (groups)** | Basic: permutation groups, group homomorphisms, the symmetric group S_n, the braid group B_n (can be introduced in-course) | 8, 16, 22, 25, 32-33 | Covered via origami (symmetry groups, wallpaper groups) and category theory (groups as one-object groupoids); solid |
| **Graph theory** | Basic: directed graphs, walks, paths, cycles, strongly connected components, Eulerian circuits | 11-13, 21, 36 (state graphs, universal cycles, automata) | Covered via origami (crease patterns as planar graphs) and category theory (free categories on graphs); should be adequate |
| **Topology (braids and knots)** | Introductory: the braid group, braid closure, links and knots as equivalence classes; can be introduced from scratch in-course | 32-33 (topological connections) | Not explicitly covered in prior coursework; will need in-course introduction at a level appropriate for the student's mathematical maturity |
| **Algebraic geometry** | Exposure: the idea of a variety, projective space, cell decompositions; deep understanding NOT required to appreciate the connection | 34-35 (Grassmannian, positroid varieties) | Not covered in prior coursework; these concepts will be presented at survey level with the combinatorial bridge (bounded affine permutations) doing the heavy lifting |

### Completed prerequisite topics (internal -- the student's prior coursework)

| Prior Topic | Shared Concepts that Give a Head Start | Key Bridge Moments |
|-------------|---------------------------------------|-------------------|
| **Category Theory** | Monoids as one-object categories, free categories on directed graphs, functors as structure-preserving maps, enriched categories (Lawvere metric spaces), the Yoneda lemma ("you are your relationships") | (11) State transition graphs: the state graph IS a free category on a directed graph; walks are morphisms composed via concatenation. (22) Monoid structure: siteswap concatenation makes the set of valid siteswaps a monoid, i.e., a one-object category; primitives are the indecomposable morphisms. (31) Metrics on states: the state graph viewed as a category enriched over (N, +, 0) gives a Lawvere-style metric space, connecting to CT concept 33. (19) Juggling cards: the card representation is a functor from the juggling state category to a combinatorial category of orderings. |
| **Optimal Transport** | Discrete probability distributions, Markov chains, Kantorovich LP and duality, Wasserstein distances, metric spaces, network flow | (27-30) Probabilistic branch: the random juggling model is a finite-state Markov chain, a concrete instance of the measure-theoretic objects the student mastered in OT; the stationary distribution is a discrete analog of the Wasserstein barycenter. (31) Metrics on states: shortest-path distance on the state graph is a discrete metric analogous to the Wasserstein metric. (37) Passing patterns: multi-juggler scheduling is a network flow problem, connecting to the LP formulations from OT. (9) Local vs global: the Monge-to-Kantorovich relaxation (deterministic to probabilistic) mirrors the passage from individual siteswap validity to the probabilistic ensemble view of random juggling. |
| **Origami Mathematics** | Combinatorial enumeration under constraints, local vs global validity (Kawasaki/Maekawa vs flat-foldability), graph theory, computational complexity, symmetry groups, Turing completeness as a universality result | (9) Local vs global: Maekawa's theorem (necessary, not sufficient for flat-foldability) is structurally identical to the average theorem (necessary, not sufficient for siteswap validity); the permutation test is the juggling analog of a full flat-foldability check. (14) Counting theorem: the experience of seeing clean closed-form counts emerge from constrained combinatorial problems prepares the student for the surprise of (b+1)^p. (33) Topological universality: the Devadoss-Mugno theorem (every link is a juggling pattern) echoes the Hull-Zakharevich theorem (flat origami is Turing complete); both say a simple physical activity encodes all possible complexity of a given type. (36) Automata: the state transition graph as a finite automaton connects to the computational complexity results from origami. |

### Concept-to-concept cross-reference with prior topics

These specific prior-topic concepts provide direct bridges:

| This course concept | Prior-topic concept | Bridge |
|---|---|---|
| (5) Average theorem | Origami: Maekawa's theorem (M-V = +/-2) | Both are simple arithmetic constraints that serve as fast filters for invalid configurations; both are necessary but not sufficient for global validity |
| (11) State transition graphs | Category Theory: free categories on directed graphs (CT-2) | The state graph generates a free category whose morphisms are all valid throw sequences; closed walks of length p are the siteswap sequences |
| (14) (b+1)^p counting | Origami: enumeration of valid M-V assignments | Both produce unexpectedly clean counts from constrained enumeration; the bijective proof technique generalizes |
| (22) Monoid structure | Category Theory: monoids as one-object categories (CT-2) | Siteswap concatenation is a monoid, hence a one-object category; primitives are the generating morphisms |
| (25) Bounded affine permutations | Category Theory: groups as one-object groupoids (CT-2) | Bounded affine permutations form a monoid (not a group -- not all are invertible); the student's experience distinguishing groups from monoids in CT applies |
| (28) Markov chain | Optimal Transport: discrete probability, convergence (OT days 1-4) | The juggling Markov chain is a finite-state instance of the probabilistic machinery from OT; stationary distributions are the fixed points of the transition operator |
| (29) Stirling numbers in steady state | Category Theory: Yoneda ("you are your relationships") (CT-18) | A juggling state is determined by the set of all patterns reachable from it (Yoneda); the Stirling numbers measure how "reachable" each state is under random throwing |
| (31) Metrics on states | Optimal Transport: Wasserstein distance (OT day 5); Category Theory: enriched categories (CT-33) | State-graph distance is a Lawvere metric (enriched category over (N,+,0)), the discrete analog of Wasserstein distance on the space of measures |
| (33) Every link is a juggling pattern | Origami: flat origami is Turing complete (Origami-30) | Both are universality theorems: a simple physical activity (juggling/folding) contains all complexity of a given mathematical type (topology/computation) |
