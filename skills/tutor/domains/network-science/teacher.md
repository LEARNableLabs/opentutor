# Network science — from epidemics to social media — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 13 lessons (46%)
- **Socratic questions** — 5 lessons (18%)
- **real-world application challenges** — 5 lessons (18%)
- **review and consolidation sessions** — 3 lessons (11%)
- **teach-back exercises (student explains)** — 1 lessons (4%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 32% accessible (1-2), 43% standard (3), 25% challenging (4-5).

Difficulty peaks:
- Day 14: "How did Watts and Strogatz explain the small-world property?" (difficulty 4)
- Day 15: "Why do most real networks have hubs and long tails?" (difficulty 4)
- Day 16: "How does preferential attachment create inequality?" (difficulty 4)
- Day 20: "What determines whether an epidemic takes off or dies out?" (difficulty 4)
- Day 21: "Why does network structure matter for epidemic control?" (difficulty 4)

## Domain Hooks
- **Eigenvector centrality and PageRank** — when discussing centrality around lesson 8, drop the connection to Google's algorithm. "Why does Google rank web pages by importance? Same math as finding important nodes in a network." Opens door to Markov chains and spectral methods if student is curious.

- **Percolation and forest fires** — when covering epidemic thresholds around lesson 20, mention that the same math (percolation theory) explains why forest fires spread, when materials conduct electricity, and how networks fragment. Beautiful unification across physics and network science.

- **Metcalfe's Law and network effects** — when discussing social networks around lesson 25-26, connect to economics: "Network value grows as n² (number of possible connections), not linearly. This is why social media platforms have winner-take-all dynamics." Ties network structure to business strategy.

- **Neural networks as literal networks** — around lesson 23 (community detection), mention that a

## Common Failure Modes
1. **"All networks are basically the same"** — Students often think networks are just "connected things" without appreciating how different structural properties (random, small-world, scale-free) fundamentally change dynamics. Correct this by having them generate and compare different network models, visually and quantitatively. Show how epidemic thresholds differ across network types.

2. **"Centrality = degree centrality"** — Many students think "important node = highly connected node" and ignore betweenness, closeness, and eigenvector centrality. Use concrete examples: a bridge node with low degree but high betweenness (connecting two communities), or a well-connected node in a peripheral cluster (high degree, low closeness). Ask: "Who would you remove to fragment this network?" to motivate betweenness.

3. **"Hubs are always bad for epidemic control"** — Students learn that scale-free networks have hubs and are vulnerable to targeted attacks, then over-generalize. Actually, targeti

## Vocabulary
Key terms for this domain: networks as models, nodes and edges, real-world examples, adjacency matrix, edge list, adjacency list, directed graphs, in-degree and out-degree, network types, data collection, network construction, basic visualization, degree distribution, hubs, histograms (and 67 more).