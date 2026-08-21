# Database Internals — Research Summary

## Major Subtopics

### Storage Engines
- **Storage formats**: row-oriented vs column-oriented, page layouts
- **B-tree variants**: B+-trees, copy-on-write B-trees, fractal trees
- **LSM-trees**: write-ahead logs, SSTables, compaction strategies
- **Buffer pool management**: replacement policies, dirty page handling
- **Crash recovery**: write-ahead logging, checkpointing

### Query Optimization
- **Query parsing and rewriting**: logical optimization, predicate pushdown
- **Cost-based optimization**: cost models, cardinality estimation, statistics
- **Join algorithms**: nested loop, hash join, sort-merge join
- **Index selection**: covering indexes, multi-column indexes, partial indexes
- **Execution strategies**: pipelining vs materialization, operator ordering

### Cross-cutting Concerns
- **Concurrency control**: MVCC, locking strategies
- **Transaction isolation**: serializable vs snapshot isolation
- **Physical design**: partitioning, data layout

## Key Sources

### Primary Textbooks
- **Database Internals** by Alex Petrov (O'Reilly, 2019) — comprehensive coverage of storage engines and distributed data systems
- **Database Systems: The Complete Book** by Garcia-Molina, Ullman, Widom — thorough treatment of query optimization
- **Transaction Processing** by Jim Gray and Andreas Reuter — classic reference on ACID properties and recovery

### Academic Courses
- **CMU 15-445/645: Database Systems** (Andy Pavlo) — excellent modern treatment with lecture videos, assignments, and projects
- **MIT 6.830/6.814: Database Systems** — theoretical foundations and implementation
- **Stanford CS245: Principles of Data-Intensive Systems** — recent advances and tradeoffs

### Implementation References
- **SQLite Architecture** (sqlite.org/arch.html) — clean, well-documented implementation
- **PostgreSQL Internals** documentation — production-grade query optimizer
- **RocksDB documentation** — LSM-tree implementation used in production

### Interactive Tools
- **B-tree Visualization** (cs.usfca.edu/~galles/visualization/BTree.html) — interactive B-tree operations
- **EXPLAIN Visualizers**: pg-plan-inspector, Postgres EXPLAIN Visualizer — query plan inspection

### Key Papers
- "The Five-Minute Rule" (Gray & Graefe) — buffer pool sizing and cache economics
- "Access Path Selection in a Relational Database Management System" (Selinger et al.) — foundational System R optimizer paper
- "The Log-Structured Merge-Tree (LSM-tree)" (O'Neil et al.) — original LSM-tree paper

## Available Resources

### Video Content
- CMU Database Group YouTube channel (Andy Pavlo's lectures)
- MIT OpenCourseWare 6.830 video lectures
- PostgreSQL Conference talks on query optimization

### Code Repositories
- SQLite source code (amalgamation build is readable)
- PostgreSQL optimizer code (src/backend/optimizer/)
- RocksDB (LSM implementation)
- SimpleDB (MIT 6.830 teaching database)

### Community Resources
- Use The Index, Luke (sql-performance-explained.com) — practical indexing guide
- PostgreSQL wiki: Explain plan interpretation
- Database internals reading groups and blogs
