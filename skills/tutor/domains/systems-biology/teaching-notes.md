# Systems Biology and Biological Networks — Teaching Notes

## Approach

Systems biology is fundamentally about **shifting perspective** — from studying individual components (genes, proteins) to understanding how they work together as integrated systems. At the intermediate level, balance three modes: (1) **visual/intuitive** (network diagrams, simulations), (2) **mathematical** (ODEs, graph metrics), and (3) **experimental** (how we actually measure these networks). Start every new concept with a concrete biological example before abstracting to general principles. Use interactive visualization tools early and often — students need to *see* networks to build intuition. The math should serve biological insight, not the other way around.

## Common Misconceptions

1. **"Networks are just pretty diagrams"** — Students initially treat networks as visualization tools, not analytical frameworks. Counter this by showing how topology metrics (degree, clustering) predict biological properties (essentiality, robustness) before they see the network picture.

2. **"Correlation means regulation"** — Gene expression data shows correlations, but students jump to causal regulatory links. Emphasize the difference between co-expression and regulation; stress that network inference requires perturbation experiments, not just observation.

3. **"More connections = more important"** — High-degree hubs aren't always essential. Teach the distinction between degree centrality (many connections) and betweenness centrality (bridges between modules). Show examples where low-degree bottlenecks are more critical.

4. **"Feedback always means negative feedback"** — In everyday language, "feedback" implies correction. In biology, positive feedback (amplification) is equally important. Explicitly contrast negative (homeostasis) vs. positive (bistability, decisions) feedback early.

5. **"Boolean networks are toy models"** — Students dismiss discrete models as oversimplified. Show that Boolean networks capture real regulatory logic (e.g., cell cycle, differentiation) and are easier to analyze than ODEs for large networks.

6. **"Systems biology = bioinformatics"** — Students conflate the two. Clarify: bioinformatics is about managing/analyzing biological data; systems biology is about understanding system-level principles. There's overlap, but the goals differ.

7. **"Models need exact parameters to be useful"** — Intimidated by unknown rate constants, students think modeling is impossible without perfect data. Teach parameter-free approaches (Boolean, FBA) and show how qualitative ODE analysis (nullclines, stability) works without exact numbers.

8. **"Robustness means redundancy"** — Students think robustness requires backup genes/pathways. Show other mechanisms: feedback control, network topology (distributed function), buffering. Redundancy is one strategy among many.

9. **"Feed-forward loops just speed things up"** — The coherent feed-forward loop does create fast response, but students miss the sign-sensitive delay and noise-filtering functions. Walk through the dynamics step-by-step for different input patterns.

10. **"You need a PhD in math to model biological systems"** — Intermediate students are often intimidated by the math. Build confidence by starting with simple linear ODEs (production + degradation), showing that calculus basics are sufficient for core insights.

## Level Adjustments

### For Intermediate Students (this curriculum)
- **Math depth**: Use ODEs for simple 1-2 gene circuits. Show nullclines and phase portraits, but avoid deep stability analysis (Jacobians, eigenvalues). Boolean models are fully accessible.
- **Formalism**: Introduce graph metrics (degree, clustering, betweenness) with definitions, but don't require rigorous proofs. Focus on interpretation and application.
- **Tools**: Hands-on with Cytoscape (visualization), COPASI or VCell (simulation), NetworkX or igraph (analysis). Provide starter code; students adapt it, not write from scratch.
- **Scope**: Cover one network type deeply (GRNs), others at survey level. Deep-dive into 2-3 motifs; mention others exist.
- **Biological detail**: Assume students know central dogma but not specific systems. Provide biological context (lac operon, circadian clock) as you introduce it.

### Compared to Beginner Level
- Beginners: avoid ODEs, use only qualitative dynamics (positive feedback → amplification). No graph theory formalism; just intuitive "hubs" and "clusters." Tools are demos, not hands-on.
- This level adds: quantitative metrics, simple ODEs, basic simulation, graph theory vocabulary.

### Compared to Advanced Level
- Advanced: Derive stability conditions, calculate eigenvalues, perform bifurcation analysis. Use stochastic models (Gillespie), spatial PDEs. Implement inference algorithms from scratch. Cover multi-scale modeling, evolutionary dynamics, control theory.
- This level skips: rigorous dynamical systems theory, advanced inference methods, stochastic/spatial extensions.

## Rabbit Holes

These are fascinating connections to drop in when a student shows curiosity or needs a stretch:

### 1. **Evolution sculpts network topology**
*When to mention*: After covering scale-free networks (lesson 3).
*The idea*: Evolution favors scale-free topologies because they balance evolvability (mutations to peripheral nodes don't break the system) and robustness (hubs are protected). This is why biological networks differ from random graphs.
*Depth*: Show one figure from Barabási's work; don't derive the preferential attachment model.

### 2. **Biological clocks are everywhere, not just circadian**
*When to mention*: After oscillations (lesson 22).
*The idea*: Cell cycle, segmentation clock (somites in embryos), glycolytic oscillations, NF-κB pulses. Oscillations are a general design principle for timing and decision-making.
*Depth*: Mention 2-3 examples; link to videos of segmentation clock in zebrafish embryos (visually stunning).

### 3. **Synthetic biology as hypothesis testing**
*When to mention*: During synthetic biology (lesson 26).
*The idea*: Building a circuit from scratch tests whether we truly understand the design principles. If it doesn't work as predicted, we're missing something. Famous example: toggle switch (Gardner & Collins 2000) validated theory.
*Depth*: Discuss design-build-test cycle; show iGEM projects as inspiration.

### 4. **Network medicine is already in clinics**
*When to mention*: After network medicine (lesson 25).
*The idea*: Drug repurposing (find new uses for old drugs) uses network proximity of disease modules. Example: metformin (diabetes drug) → anti-aging effects predicted from network analysis.
*Depth*: One concrete example; link to Disease Connectome or similar resource.

### 5. **Criticality and power laws**
*When to mention*: If a student asks why scale-free networks are so common.
*The idea*: Systems poised at the edge of order and chaos (criticality) are maximally sensitive and adaptable. Scale-free networks emerge naturally in critical systems.
*Depth*: This is deep physics; just plant the seed and point to Per Bak's work on self-organized criticality.

### 6. **Single-cell RNA-seq is revealing network heterogeneity**
*When to mention*: In final lesson (28) or when discussing experimental techniques.
*The idea*: Bulk measurements average over millions of cells, hiding variability. Single-cell approaches show that gene regulatory networks differ cell-to-cell, changing how we think about network "state."
*Depth*: Show one UMAP plot; explain it's the frontier but methods are still developing.

### 7. **Control theory and the cell as a control system**
*When to mention*: After homeostasis (lesson 19) or negative feedback (lesson 15).
*The idea*: Engineering control theory (PID controllers, integral feedback) applies directly to biology. Cells are exquisite control systems.
*Depth*: Mention integral feedback in bacterial chemotaxis; show the parallel to engineered systems.

### 8. **Network modularity and the "bow-tie" architecture**
*When to mention*: After discussing metabolic networks (lesson 8).
*The idea*: Many biological networks have a bow-tie structure: many inputs → few core processes → many outputs. Metabolism funnels diverse nutrients into ~12 precursors, then builds thousands of biomolecules. This architecture balances efficiency and flexibility.
*Depth*: Draw the bow-tie schematic; mention it appears in immune system, metabolism, and signaling.

## Difficulty Progression

### Phase 1: Foundations (Lessons 1-6)
*Difficulty range*: 1-3, peak at 3 (motifs)
*Strategy*: Build from familiar (graphs, everyday networks) to biological specifics (motifs). Review at lesson 6 consolidates before diving into network types.

### Phase 2: Network Types (Lessons 7-13)
*Difficulty range*: 2-3, mostly 2
*Strategy*: Concrete examples of GRNs, metabolism, PPI, signaling. Hands-on with tools (Cytoscape, databases) keeps engagement high. Review at lesson 13 before math-heavy modeling section.

### Phase 3: Modeling (Lessons 14-18)
*Difficulty range*: 3-4, peak at 4 (FBA, simulation)
*Strategy*: This is the hardest section. ODEs require calculus; FBA is conceptually dense. Break it up with different modeling approaches (ODEs, Boolean, FBA) so students don't get stuck on one. Teach-back (lesson 18) ensures mastery before moving on.

### Phase 4: Dynamics and Applications (Lessons 19-28)
*Difficulty range*: 2-4, peak at 4 (inference, oscillations), then easing to 2-3 for applications
*Strategy*: Reviews at 20 and 27 bracket the hardest dynamics concepts (inference, oscillations). Applications (25-28) are motivating and slightly easier, ending on a high note.

### Difficulty Peaks and Valleys
- **Peak 1** (lesson 4-5): Network motifs — first abstract concept
- **Valley 1** (lesson 6): Review
- **Plateau** (lessons 7-12): Concrete network types, moderate difficulty
- **Valley 2** (lesson 13): Review before modeling
- **Peak 2** (lessons 17-18): FBA and simulation — math-heavy
- **Valley 3** (lesson 20): Review
- **Peak 3** (lessons 22-23): Oscillations and network inference — hardest concepts
- **Descent** (lessons 25-28): Applications, forward-looking, inspiring

## Pacing Notes

- **Lessons 1-5** can flow quickly if the student has seen graph theory before. If not, slow down at lesson 2-3 (topology metrics).
- **Lesson 10-11** (signaling + Cytoscape) might take 2 sessions if the student wants to deeply explore the tool. That's fine — hands-on time is valuable.
- **Lesson 14** (ODEs) is a gate. If the student struggles, add a mini-lesson on ODEs basics (not part of this curriculum; draw from calculus review). Don't proceed to lesson 15 until they're comfortable with dx/dt = production - degradation.
- **Lessons 17-18** (FBA + simulation) are dense. Consider splitting lesson 18 into two sessions: (a) understand bistability conceptually, (b) actually build and simulate the model.
- **Lesson 23** (network inference) is conceptually hard but less math-heavy than it seems. If the student is fatigued from lesson 22 (oscillations), take a break or insert a wildcard.

## Wild Cards and Engagement Boosters

If energy drops or a student wants a tangent:
- **Visualize their own data**: If they have gene expression or interaction data, load it into Cytoscape and explore together.
- **iGEM project safari**: Browse recent iGEM projects (synthetic biology competition) — fascinating circuits designed by undergrads.
- **"Systems biology in the wild"**: Find a recent paper applying network analysis to a disease or organism the student cares about. Skim it together.
- **Simulation playground**: Open COPASI or VCell and let them tweak parameters to see what breaks or creates new behaviors.
- **Network games**: Show them the "preferential attachment" network growth game (interactive demos exist online) to build intuition for scale-free networks.
