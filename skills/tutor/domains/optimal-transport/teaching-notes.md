# Teaching Notes — Optimal Transport

## Student Profile

- **Name:** gcg
- **Background:** Researcher, applied math
- **Level:** Advanced
- **Intensity:** Deep (15+ min lessons)
- **Prerequisites:** Solid — measure theory, linear algebra, probability, optimization, Python

## Module-by-Module Pedagogy

### Module 1: Foundations (Days 1-6)

**Approach:** Start physical, get abstract. The dirt-pile metaphor carries the first 3 lessons.

- **Day 1:** Don't start with math. Start with Monge's actual problem — moving earth. Use the Williams blog post visuals. Only introduce the cost function after the intuition is clear.
- **Day 2:** The key insight is that Kantorovich's relaxation is NOT just a generalization — it's a fundamentally different object (plans vs maps). Use the "splitting dirt" analogy.
- **Day 3:** Duality is the first hard lesson. Since gcg has optimization background, connect to LP duality they already know. c-transforms are the new concept.
- **Day 4:** Relief day. 1-D OT is satisfying because it has a closed-form answer. Use POT to verify by hand.
- **Day 5:** Wasserstein vs KL is the comparison that sticks. Show KL divergence breaking on non-overlapping supports while Wasserstein handles it gracefully.
- **Day 6:** Hands-on review. First POT notebook. Build confidence before structural theory.

**Common struggle:** Duality (Day 3). Students often memorize the dual without understanding what it means. Spend extra time on the "price" interpretation.

### Module 2: Structure (Days 7-10)

**Approach:** This is the mathematical core. Given gcg's background, go for full proofs but emphasize geometric intuition.

- **Day 7:** Brenier's theorem — the payoff of duality. "Optimal maps are gradients of convex functions" is beautiful but needs unpacking. Use 2D examples.
- **Day 8:** Monge-Ampère is a PDE that most people have never seen. Connect to the Jacobian equation which is more familiar.
- **Day 9:** Displacement interpolation is visually stunning. Use animations/videos. This is a "mind-blowing" day.
- **Day 10:** Abstract but foundational. This sets up gradient flows. Don't rush.

**Common struggle:** Day 10 (metric space theory). Can feel dry. Motivate with "this is why we can do calculus on probability distributions."

### Module 3: Computation (Days 11-16)

**Approach:** Theory-to-code. Every algorithm should be implemented.

- **Day 12:** Sinkhorn is THE lesson. Cuturi's 2013 paper is readable — assign it in full. Implement Sinkhorn from scratch before using POT.
- **Day 13:** Debiasing is subtle. Use numerical examples showing the bias.
- **Day 16:** Full workshop day. Build something real.

**Suggested analogies:**
- Sinkhorn = "alternating row/column normalization until convergence" — start with this before the theory
- Sliced Wasserstein = "project to 1D, solve the easy problem, average over directions"

### Module 4: Dynamics (Days 17-20)

**Approach:** This is where OT gets deep. gcg's applied math background is an asset here.

- **Day 18:** Otto calculus — the "Wasserstein space is Riemannian" lesson. This is mind-blowing for anyone with differential geometry intuition.
- **Day 19:** JKO scheme is THE connection between OT and PDEs. "Heat equation = gradient flow of entropy" is the punchline of the module.

**Common struggle:** The formal/informal divide. Otto calculus is "formal" (not rigorous). Students with strong analysis backgrounds sometimes resist this. Acknowledge it, point to AGS for rigor.

### Module 5: Extensions (Days 21-23)

**Approach:** These are variations on the theme. Lighter intensity.

- **Day 21:** Unbalanced OT — very practical. "What if the masses don't match?" is a real data problem.
- **Day 22:** Gromov-Wasserstein — "comparing apples and oranges." Cross-domain is where this shines.

### Module 6: ML Applications (Days 24-28)

**Approach:** Paper-reading mode. Each lesson centers on a key paper.

- **Day 24:** WGANs — start with "why JS divergence is broken" then show how Wasserstein fixes it.
- **Day 26:** Flow matching — the most modern application. Connect to diffusion models.
- **Day 28:** Project day. Student picks an application and implements it.

### Module 7: Frontiers (Days 29-30)

**Approach:** Survey mode. Show the landscape, not the details.

## Exercise Design

- **Days 1-6:** Conceptual questions + simple computations by hand + first POT notebook
- **Days 7-10:** Proof exercises (sketch proofs, verify conditions)
- **Days 11-16:** Implementation exercises (code from scratch, then verify with library)
- **Days 17-20:** "Derive and interpret" exercises
- **Days 21-23:** "Compare and contrast" exercises
- **Days 24-28:** Paper reading + implementation exercises
- **Days 29-30:** Open-ended exploration

## Adaptation Triggers

- If gcg breezes through Module 1 → compress to 4 lessons, move duality earlier
- If gcg struggles with duality → add an extra day between Day 3 and 4
- If gcg is more interested in ML → front-load Module 6, interleave with computation
- If gcg wants more rigor → point to Villani (2009) chapters for each lesson
