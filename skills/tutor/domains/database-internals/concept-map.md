# Database Internals — Concept Map

## Core Concepts (in learning order)

1. **Storage abstraction** — Why databases use pages instead of raw files
2. **Pages and slotted pages** — Fixed-size blocks with variable-length records
3. **I/O costs** — Sequential vs random access, SSD vs HDD latencies
4. **Index structures** — Ways to map keys to disk locations
5. **Heap files** — Unordered collection of pages
6. **Clustered vs unclustered indexes** — Whether data is sorted by index key
7. **Row-oriented storage** — Storing entire rows together (OLTP)
8. **Column-oriented storage** — Storing columns together (OLAP)
9. **B-tree structure** — Balanced tree with high fanout
10. **Node fanout** — Number of children per internal node
11. **Tree height** — Logarithmic depth enables fast lookups
12. **Node splits** — Dividing full nodes during insertion
13. **Key redistribution** — Moving keys between siblings
14. **B+ tree structure** — Internal nodes for routing, leaves for data
15. **Leaf node linking** — Enables efficient range scans
16. **Tree locking** — Concurrency control for B-tree modifications
17. **Latch crabbing** — Lock coupling protocol for tree traversal
18. **Write amplification** — Writing more data than the logical change
19. **Memtable** — In-memory write buffer
20. **Write-ahead log (WAL)** — Durability guarantee for uncommitted writes
21. **SSTable levels** — Layered sorted string tables
22. **Bloom filters** — Probabilistic data structure to skip SSTables
23. **Read amplification** — Reading more data than needed
24. **Compaction strategies** — Merging and reorganizing SSTables
25. **Space amplification** — Storage overhead from multiple versions
26. **Workload characteristics** — Write-heavy vs read-heavy patterns
27. **Buffer pool** — Database-managed memory cache
28. **Pin/unpin protocol** — Reference counting for in-memory pages
29. **Page replacement** — Which page to evict from buffer pool
30. **Dirty pages** — Modified pages not yet written to disk
31. **Write-back policy** — When to flush dirty pages
32. **LRU and variants** — Least recently used eviction policies
33. **Query pipeline** — Parse → plan → execute
34. **Nested loop join** — Simple but potentially slow join algorithm
35. **Hash join** — Build hash table on one input, probe with other
36. **Sort-merge join** — Sort both inputs, merge in linear pass
37. **Logical optimization** — Algebraic query transformations
38. **Predicate pushdown** — Apply filters as early as possible
39. **Projection pruning** — Don't fetch unused columns
40. **Cardinality estimation** — Predicting result set sizes
41. **Histograms** — Statistical summaries of data distributions
42. **Cost model** — Estimating query plan execution cost
43. **Join ordering** — Deciding which tables to join first
44. **Left-deep vs bushy trees** — Plan space restrictions
45. **Materialized views** — Precomputed query results
46. **Learned indexes** — ML models replacing traditional indexes

## Dependencies

### Storage Engine Foundations
- **Pages** are the foundation for everything — B-trees, LSM-trees, and buffer pools all operate on pages
- **I/O costs** motivate both B-tree design (high fanout) and LSM-tree design (sequential writes)
- **Heap files and indexes** require understanding storage abstraction and pages

### B-Tree Dependencies
- **Node splits** depend on understanding B-tree structure and fanout
- **B+ trees** build on basic B-trees — same structure, different data placement
- **Range scans** leverage leaf node linking in B+ trees
- **Tree locking** requires understanding both B-tree structure and concurrent access patterns

### LSM-Tree Dependencies
- **Memtable and WAL** are prerequisites for understanding SSTable creation
- **Bloom filters** make sense only after understanding read amplification problems
- **Compaction** depends on understanding SSTable levels and space amplification
- **Storage engine selection** requires comparing B-tree vs LSM tradeoffs across all dimensions

### Buffer Management Dependencies
- **Buffer pool** builds on understanding page-based storage
- **Pin/unpin protocol** is required for understanding safe page replacement
- **Dirty pages and write-back** depend on understanding WAL protocol
- **Advanced eviction policies** (LRU-K, ARC) build on basic LRU understanding

### Query Optimization Dependencies
- **Join algorithms** depend on understanding I/O costs (why hash join beats nested loop)
- **Predicate pushdown** requires understanding query pipeline stages
- **Cardinality estimation** is a prerequisite for cost-based optimization
- **Join ordering** depends on both cardinality estimation and cost models
- **Plan interpretation** requires understanding all join algorithms and operator costs

### Critical Bottleneck Concepts
These concepts unlock large portions of the dependency graph:

1. **Pages** — unlocks all storage engines and buffer management
2. **I/O costs** — explains why every data structure is designed the way it is
3. **B-tree structure** — foundation for most production databases
4. **WAL** — critical for both crash recovery and buffer management
5. **Cardinality estimation** — enables all of cost-based optimization

## Prerequisite Topics (External)

- **Data structures** — needed for: B-trees, hash tables (hash join), heaps (heap files)
- **Basic SQL** — needed for: understanding query semantics, join types, indexes
- **Algorithm complexity** — needed for: analyzing join algorithms, understanding tree height, cost models
- **Operating systems** — needed for: file I/O, buffer management, page cache, latency sources

## Common Learning Bottlenecks

1. **I/O cost intuition** — Students often don't appreciate the magnitude of disk latency. Critical for understanding why data structures matter.
2. **Write amplification tradeoffs** — The three-way tradeoff between write amp, read amp, and space amp in LSM-trees is subtle.
3. **Cardinality estimation** — Students struggle with why it's hard and why errors compound across joins.
4. **Join ordering complexity** — The combinatorial explosion (5 tables = 12 bushy trees or 120 orderings) is counterintuitive.
5. **Buffer pool vs OS page cache** — Why databases don't trust the OS is non-obvious without understanding transaction semantics.
