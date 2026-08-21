# Teaching Notes — Evolutionary Biology and Phylogenetics

## Domain-Specific Pedagogy

### Dual Nature of This Domain

This subject uniquely combines:
1. **Conceptual evolutionary biology** — theory-driven, biological intuition
2. **Computational phylogenetics** — algorithm-driven, statistical reasoning

**Teaching implication:** Students need both modes. Don't just teach algorithms without biological context, and don't just teach theory without computational practice. Interleave them.

### Common Student Backgrounds at Intermediate Level

- **Biology majors:** Strong intuition for evolution, weaker on statistics and computation
- **Computational biology students:** Strong on algorithms, weaker on biological interpretation
- **Bioinformatics practitioners:** Often use phylogenetic tools as black boxes without understanding assumptions

**Adaptation strategy:** 
- For biology-heavy students: emphasize WHY methods work, connect algorithms to biological processes
- For computation-heavy students: emphasize INTERPRETATION, show how results inform biological questions
- Always bridge between "what does this method do" and "what does this result mean biologically"

## Key Pedagogical Challenges

### Challenge 1: Tree Thinking

**Problem:** Students confuse overall similarity with phylogenetic relatedness. They read trees like ladders (linear progression) rather than bushes (branching relationships).

**Solution:**
- Lesson 13: Start with visual tree interpretation before ANY construction
- Lesson 16: Explicitly address common misconceptions via teach-back
- Use rotating tree visualizations to show that branch order doesn't matter
- Practice: "Which organisms are more closely related: A and B, or B and C?" type questions

**Tool:** iTOL for showing the same tree in different layouts (rectangular, circular, radial)

### Challenge 2: Statistical Abstraction

**Problem:** Maximum likelihood and Bayesian inference are mathematically intensive. Students can run tools without understanding assumptions.

**Solution:**
- Lessons 22-24: Build up from substitution models → likelihood → Bayesian
- Use concrete analogies: "likelihood = how well this tree explains the data we see"
- Compare outputs from different models on same dataset to show model choice matters
- Emphasize: "What assumptions did this method make? When would they be violated?"

**Approach:** Show failure cases, not just successes. Example: use UPGMA on data with rate variation to show why it fails.

### Challenge 3: Bridging Theory and Software

**Problem:** Students learn evolutionary theory in one context, use phylogenetic software in another, and don't connect them.

**Solution:**
- Every computational lesson (18-20, 22-25, 26-28) includes BOTH conceptual understanding AND hands-on tool use
- Lesson 18: "What's the simplest evolutionary explanation?" = teach parsimony concept, THEN use MEGA to apply it
- Lesson 25: Viral tracking combines Bayesian inference + molecular clocks in realistic workflow

**Best tools for teaching:**
- **MEGA** — beginner-friendly, good for parsimony and distance methods (lessons 18-20)
- **IQ-TREE** — modern maximum likelihood, clear documentation (lesson 22)
- **BEAST/BEAUti** — Bayesian inference with good tutorial ecosystem (lessons 24-25, 26-28)
- **iTOL** — visualization and annotation (all tree-based lessons)

### Challenge 4: Neutral Theory Confusion

**Problem:** Students may think neutral evolution contradicts natural selection, or that "neutral" means "unimportant."

**Solution:**
- Lesson 10 explicitly frames neutral theory as complementary to selection, not contradictory
- Emphasize: Most molecular changes ARE neutral, but that doesn't diminish selection's importance for adaptation
- Show cases: synonymous mutations (neutral) vs nonsynonymous in functional domains (under selection)

## Difficulty Calibration

### Difficulty 1-2 (Foundation)
- Lessons 1, 3, 6, 7, 10, 11, 12, 13
- Concepts: natural selection, Hardy-Weinberg, speciation basics, tree reading
- Delivery: Clear explanations with visual aids, minimal math

### Difficulty 3 (Building Skills)
- Lessons 2, 4, 8, 9, 15, 17, 18, 19, 20, 26, 28, 29, 30
- Concepts: multiple mechanisms, quantitative genetics, parsimony, distance methods, molecular clocks
- Delivery: More quantitative reasoning, hands-on practice with tools, real datasets

### Difficulty 4 (Advanced Methods)
- Lessons 22, 23, 25, 27, 31
- Concepts: maximum likelihood, substitution models, rate variation, critical evaluation
- Delivery: Statistical reasoning, model comparison, interpreting complex outputs

### Difficulty 5 (Peak Complexity)
- Lesson 24
- Concepts: Bayesian inference, MCMC, posterior distributions
- Delivery: Most mathematically intensive, requires solid stats background

**Pacing note:** Lesson 24 (Bayesian) is the hardest single lesson. Ensure strong foundation from lessons 22-23 before attempting.

## Lesson Type Strategy

### Mini-lessons (1, 3, 11, 13, 17, 19, 22, 24)
Use for introducing new methods or frameworks. Keep focused and concrete.

### Questions (2, 5, 8, 10, 14, 15, 20, 23, 26, 27)
Use to challenge assumptions or explore nuances. Great for "can evolution work this way?" type inquiries.

### Teach-backs (4, 9, 16, 31)
Use when students need to consolidate and verbalize understanding. Excellent for catching misconceptions early.

### Real-world (18, 25, 28, 29, 30)
Use to show applications and motivate methods. Viral tracking (25, 30) is especially engaging for modern audiences.

### Reviews (6, 12, 21, 32)
Use every 5-7 lessons to consolidate. Review 12 is crucial before starting phylogenetic methods. Review 21 consolidates classical methods before statistical phylogenetics.

## Hands-On Exercises

### Computational Practice Sequence

1. **Lessons 18-20:** MEGA for parsimony and distance methods
   - Download sample sequence alignment (e.g., primate cytochrome b)
   - Construct trees using parsimony, neighbor-joining, UPGMA
   - Compare results, interpret bootstrap values
   - Dataset: Small (~10-20 species), well-studied group

2. **Lesson 22:** IQ-TREE for maximum likelihood
   - Same dataset as MEGA exercises
   - Run with different substitution models
   - Compare AIC/BIC scores for model selection
   - Interpret likelihood values

3. **Lessons 24-25:** BEAST for Bayesian inference
   - Use BEAUti to design analysis
   - Run short MCMC chain
   - Visualize trace plots, check convergence
   - Dataset: Viral sequences with known sampling dates (e.g., influenza)

4. **Lessons 26-28:** BEAST with molecular clocks
   - Time-calibrated trees
   - Relaxed clock models
   - Fossil calibration (primate example)
   - Visualize dated trees in iTOL

### Recommended Datasets

- **Beginner:** Primate mitochondrial sequences (well-studied, clear relationships)
- **Intermediate:** Viral sequences with temporal data (influenza, HIV, SARS-CoV-2)
- **Advanced:** Student's own domain of interest (conservation, systematics, etc.)

## Spaced Repetition Strategy

Key concepts that need reinforcement across multiple lessons:

### Fitness & Selection
- Introduced: Lesson 1
- Quantified: Lesson 4
- Constrained: Lesson 5
- Molecular level: Lesson 10
- Reviewed: Lessons 6, 12

### Tree Reading
- Introduced: Lesson 13
- Applied: Lessons 14, 15, 16
- Used in construction: Lessons 17-20
- Advanced interpretation: Lessons 22-24
- Applied to real data: Lessons 25, 28, 29, 30

### Substitution Models
- Introduced: Lesson 23
- Applied in ML: Lesson 22
- Applied in Bayesian: Lessons 24, 25
- Applied in clocks: Lessons 26, 27, 28

## Potential Sticky Points

### Sticky Point 1: Why parsimony can be wrong
**When:** Lesson 18
**Issue:** Students think "simplest explanation" is always correct
**Solution:** Show long-branch attraction example. Emphasize parsimony is a heuristic, not truth.

### Sticky Point 2: What "bootstrap support" means
**When:** Lesson 20
**Issue:** Students treat bootstrap values as probability the clade is true
**Solution:** Clarify it's "how often this clade appears in resampled datasets," not Bayesian posterior probability

### Sticky Point 3: Prior selection in Bayesian inference
**When:** Lesson 24
**Issue:** Priors seem arbitrary or mysterious
**Solution:** Emphasize priors encode biological knowledge (e.g., realistic substitution rates). Show sensitivity analysis.

### Sticky Point 4: Molecular clock violations
**When:** Lesson 27
**Issue:** Students assume constant rates or don't understand relaxed clocks
**Solution:** Show real examples where strict clock fails (e.g., different rates in different lineages). Visualize rate variation.

## Assessment Criteria for Teach-Back Lessons

### Lesson 4: "How do we measure fitness?"
- Can student define fitness operationally?
- Can they calculate selection coefficient from example data?
- Do they understand fitness is context-dependent?

### Lesson 9: "Design speciation experiment"
- Does the design test reproductive isolation?
- Are controls appropriate?
- Does student recognize practical/ethical constraints?

### Lesson 16: "Common tree-reading mistakes"
- Can student identify: ladder thinking, distance = similarity, node order matters?
- Can they generate correct and incorrect interpretations of a tree?

### Lesson 31: "Evaluate published phylogenetic study"
- Does student check: method appropriateness, model justification, support values?
- Can they identify weaknesses or alternative interpretations?
- Do they connect phylogeny to biological conclusions?

## Integration with Broader Biology

Connect phylogenetics to other domains students may know:

- **Ecology:** Community phylogenetics, phylogenetic signal in traits
- **Medicine:** Viral evolution, antibiotic resistance, cancer evolution
- **Conservation:** Phylogenetic diversity, evolutionary significant units
- **Development:** Evo-devo, comparing developmental genes across species
- **Genomics:** Gene family evolution, horizontal gene transfer detection

**Teaching move:** Ask "How would you use phylogenetics in [student's field of interest]?" after lesson 29.

## Recommended Tone & Framing

- **Curiosity-driven:** Frame as detective work ("What story do these sequences tell?")
- **Method-critical:** Teach healthy skepticism ("When would this method fail?")
- **Application-forward:** Always connect to real biology, not just algorithms
- **Tool-agnostic:** Focus on understanding, not software-specific skills
- **Interdisciplinary:** Highlight connections between evolution, stats, computation, and biology

## Resources for Difficult Concepts

### For natural selection vs drift:
- Use coin flip simulations to show drift
- Compare large vs small population effects

### For tree thinking:
- Khan Academy interactive tree exercises
- "Understanding Evolution" website from Berkeley

### For likelihood:
- Use simple coin flip likelihood example before sequence evolution
- Visualize likelihood surfaces

### For Bayesian inference:
- Use medical testing example (Bayes theorem intuition) before phylogenetics
- Show MCMC as "exploring tree space"

### For molecular clocks:
- Use radioactive decay analogy
- Show real calibration examples (human-chimp split dated with fossils)

## Final Synthesis (Lesson 32)

The capstone lesson should connect:
1. Evolutionary mechanisms (how evolution works) 
2. Molecular evolution (how genomes change)
3. Phylogenetic methods (how we infer history)
4. Applications (how we use this knowledge)

**Synthesis question:** "Choose an evolutionary biology question you care about. How would you use phylogenetics to address it? What method would you use and why? What pitfalls would you watch for?"

This tests understanding across all modules and demonstrates mastery.
