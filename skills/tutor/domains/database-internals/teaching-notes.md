# Database Internals — Teaching Notes

## Approach

This topic requires balancing concrete implementation details with conceptual understanding. At the intermediate level, students should build intuition through real-world tradeoffs rather than formal proofs. Use EXPLAIN plans from actual databases (PostgreSQL, SQLite) to make optimization tangible. Emphasize that every design decision is a tradeoff — there is no "best" storage engine or join algorithm, only best for a given workload. Visual intuition (B-tree animations, query plan visualizers) is critical for storage structures; quantitative analysis (cost models, cardinality estimation) is critical for optimization.

## Common Misconceptions

1. **"Indexes always make queries faster"** — Students miss that indexes have maintenance costs and can hurt performance on write-heavy workloads or when selectivity is poor. Correct by showing an index scan that's slower than a sequential scan, and discussing the break-even point.

2. **"B-trees are for reads, LSM-trees are for writes"** — Oversimplified. LSM-trees can have excellent read performance with bloom filters and caching. B-trees can be write-optimized with buffering techniques. Emphasize that it's about amplification tradeoffs, not binary choices.

3. **"The optimizer always picks the fastest plan"** — Students assume optimizers are omniscient. In reality, cardinality estimation errors, outdated statistics, and missing indexes cause suboptimal plans. Show examples where manual hints or index creation fix slow queries.

4. **"Hash joins are always faster than nested loop joins"** — True for large inputs, but nested loop joins can be optimal for small tables or when one side has high selectivity. The optimizer's cost model knows this; students often don't.

5. **"Databases cache pages in RAM, so disk speed doesn't matter"** — Misses cache misses, working sets larger than memory, and write-through requirements. Show the math: if 10% of queries miss the cache, disk latency dominates.

6. **"Query optimization is about syntax tricks"** — Students think rewriting SQL is optimization. Real optimization is about cardinality estimation, join ordering, and index selection — the optimizer does the rewriting.

7. **"Normalization is always good"** — Academically true for correctness, but performance often requires denormalization. At intermediate level, introduce materialized views and covering indexes as controlled denormalization.

8. **"Write-ahead logging is just for crash recovery"** — WAL also enables buffer management (dirty page eviction), replication, and point-in-time recovery. It's a foundational mechanism, not a single-purpose feature.

9. **"Compaction is just garbage collection"** — LSM compaction also controls read amplification by merging levels, maintains sort order for range scans, and enables compression. It's a continuous optimization process.

10. **"Cost-based optimization is better than rule-based"** — Usually true, but when statistics are stale or missing, rule-based heuristics can be more reliable. Show cases where ANALYZE fixes a bad plan.

## Level Adjustments

### At Intermediate Level (Current)
- **Depth**: Focus on core tradeoffs (B-tree vs LSM, join algorithm selection, predicate pushdown). Skip advanced topics like multi-version concurrency control details, distributed query optimization, or adaptive query processing.
- **Formalism**: Use Big-O notation and basic cost formulas, but don't derive formal proofs. Show that hash join is O(M+N) vs nested loop's O(M×N), but don't prove lower bounds.
- **Implementation**: Reference real databases (PostgreSQL, SQLite, RocksDB) and show real EXPLAIN plans, but don't require reading source code. Interactive visualizations are key.
- **Exercises**: Interpret EXPLAIN plans, design indexes for given queries, compare storage engine choices for workloads. No coding assignments or full implementations.

### At Beginner Level (Adjustments if needed)
- Skip LSM-trees entirely (focus on B-trees only)
- Simplify join algorithms to just nested loop and hash join
- Avoid cost models — use heuristics only ("indexes help for selective queries")
- More emphasis on SQL patterns, less on internals

### At Advanced Level (Extensions)
- Add MVCC implementation details (snapshot isolation, vacuum)
- Cover distributed query optimization (cost-based plan selection across nodes)
- Include adaptive query processing (runtime re-optimization)
- Analyze source code from SQLite or PostgreSQL
- Implement a simplified query optimizer or storage engine

## Rabbit Holes

- **"The Five-Minute Rule"** — Gray & Graefe's economic analysis of when to cache vs re-read from disk. Great for lesson 15-17 (buffer management). Shows how hardware evolution changes system design.

- **"System R optimizer"** — The 1979 Selinger et al. paper that invented cost-based optimization. Relevant for lessons 21-24. Modern optimizers still use this approach.

- **"Fractal trees"** — Write-optimized B-tree variant (used in TokuDB). Combines B-tree structure with LSM-style write buffering. Mention during lesson 13 when comparing storage engines.

- **"Learned indexes"** — ML models replacing B-trees (Kraska et al. 2018). Perfect for lesson 28. Shows how research is rethinking 50-year-old assumptions.

- **"The Log-Structured Merge-Tree paper"** — Original O'Neil et al. 1996 paper. Historical context for lessons 10-13. Written before SSD era but surprisingly prescient.

- **"Zone maps and small materialized aggregates"** — Column-store optimization techniques. Mention during lesson 4 (row vs column) or lesson 27 (materialized views).

- **"Adaptive radix trees"** — Cache-friendly alternative to B-trees for in-memory indexes. Mention during lesson 5-7 when discussing B-tree limitations.

- **"PostgreSQL's genetic query optimizer"** — For queries with many joins, Postgres switches from dynamic programming to genetic algorithms. Mention during lesson 24 when discussing join ordering explosion.

- **"RocksDB's universal vs leveled compaction"** — Two different compaction strategies with different tradeoffs. Mention during lesson 12 when discussing compaction.

- **"Compression in column stores"** — Run-length encoding, dictionary encoding, bit-packing. Mention during lesson 4 when discussing column-oriented storage.

## Difficulty Progression

The curriculum is structured in two waves, each building to a peak:

**Wave 1: Storage Engines (Lessons 1-14)**
- Lessons 1-4: Gentle intro to storage fundamentals (difficulty 2-3)
- Lessons 5-9: B-trees with a peak at lesson 8 (concurrency, difficulty 4)
- Lessons 10-13: LSM-trees with peaks at lessons 11-12 (read/write amplification, difficulty 4)
- Lesson 14: Review (difficulty 2)

**Wave 2: Query Processing & Optimization (Lessons 15-28)**
- Lessons 15-17: Buffer management with a peak at lesson 16 (dirty pages, difficulty 4)
- Lessons 18-20: Query execution basics (difficulty 2-3)
- Lessons 21-25: Optimization with peaks at lessons 22-24 (cardinality, join ordering, difficulty 4)
- Lesson 26: Review (difficulty 2)
- Lessons 27-28: Advanced topics (difficulty 3-4)

Review lessons (14, 26) drop difficulty to consolidate learning before the next wave. The final lessons (27-28) are conceptually advanced but presented as explorations rather than demanding mastery.

## Engagement Strategies

- **Use real databases**: Show actual EXPLAIN plans from PostgreSQL, SQLite's B-tree implementation, RocksDB's LSM behavior. Avoid toy examples.
- **Visualize structures**: B-tree animations (cs.usfca.edu), EXPLAIN visualizers (tatiyants.com/pev), latency charts (colin-scott.github.io).
- **Compare workloads**: For each data structure, show the workload it excels at and the workload it struggles with. Make tradeoffs explicit.
- **Teach-back moments**: Lessons 9, 20 ask students to trace execution paths. This reveals gaps in understanding.
- **Resource drops**: Lessons 25, 28 provide curated resources for hands-on exploration without requiring mastery.
- **Real-world connections**: Mention which databases use which storage engines (InnoDB = B-tree, Cassandra = LSM, Postgres = both via extensions).
