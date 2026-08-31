# Database internals — storage engines and query optimization — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 9 lessons (32%)
- **real-world application challenges** — 6 lessons (21%)
- **Socratic questions** — 5 lessons (18%)
- **review and consolidation sessions** — 4 lessons (14%)
- **teach-back exercises (student explains)** — 2 lessons (7%)
- **curated resource exploration** — 2 lessons (7%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 36% accessible (1-2), 36% standard (3), 29% challenging (4-5).

Difficulty peaks:
- Day 8: "What happens when two transactions modify the same B-tree node?" (difficulty 4)
- Day 11: "How do you read from a structure designed for writes?" (difficulty 4)
- Day 12: "What's the hidden cost of infinite append-only writes?" (difficulty 4)
- Day 16: "How do you evict pages without losing uncommitted data?" (difficulty 4)
- Day 22: "How does the optimizer guess how many rows you'll get?" (difficulty 4)

## Domain Hooks
- **"The Five-Minute Rule"** — Gray & Graefe's economic analysis of when to cache vs re-read from disk. Great for lesson 15-17 (buffer management). Shows how hardware evolution changes system design.

- **"System R optimizer"** — The 1979 Selinger et al. paper that invented cost-based optimization. Relevant for lessons 21-24. Modern optimizers still use this approach.

- **"Fractal trees"** — Write-optimized B-tree variant (used in TokuDB). Combines B-tree structure with LSM-style write buffering. Mention during lesson 13 when comparing storage engines.

- **"Learned indexes"** — ML models replacing B-trees (Kraska et al. 2018). Perfect for lesson 28. Shows how research is rethinking 50-year-old assumptions.

- **"The Log-Structured Merge-Tree paper"** — Original O'Neil et al. 1996 paper. Historical context for lessons 10-13. Written before SSD era but surprisingly prescient.

- **"Zone maps and small materialized aggregates"** — Column-store optimization techniques. Mention during les

## Common Failure Modes
1. **"Indexes always make queries faster"** — Students miss that indexes have maintenance costs and can hurt performance on write-heavy workloads or when selectivity is poor. Correct by showing an index scan that's slower than a sequential scan, and discussing the break-even point.

2. **"B-trees are for reads, LSM-trees are for writes"** — Oversimplified. LSM-trees can have excellent read performance with bloom filters and caching. B-trees can be write-optimized with buffering techniques. Emphasize that it's about amplification tradeoffs, not binary choices.

3. **"The optimizer always picks the fastest plan"** — Students assume optimizers are omniscient. In reality, cardinality estimation errors, outdated statistics, and missing indexes cause suboptimal plans. Show examples where manual hints or index creation fix slow queries.

4. **"Hash joins are always faster than nested loop joins"** — True for large inputs, but nested loop joins can be optimal for small tables or when one side 

## Vocabulary
Key terms for this domain: storage abstraction, pages, slotted pages, I/O costs, sequential vs random access, SSD vs HDD, index structures, heap files, clustered vs unclustered, row-oriented storage, column-oriented storage, OLTP vs OLAP, B-tree structure, node fanout, tree height (and 67 more).