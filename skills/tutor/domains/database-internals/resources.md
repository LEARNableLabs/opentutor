# Database Internals — Resources

## Primary Sources (for lesson content)

### Textbooks
- **Database Internals** by Alex Petrov (O'Reilly, 2019) — Comprehensive coverage of storage engines (B-trees, LSM-trees) and distributed systems. Perfect for intermediate level, balances theory and implementation. Covers all major topics in this curriculum.
  - Publisher: https://www.oreilly.com/library/view/database-internals/9781492040347/
  
- **Database Management Systems** by Ramakrishnan & Gehrke (3rd ed.) — Classic textbook with excellent chapters on storage, indexing, and query optimization. More academic than Petrov but still accessible.
  - Used widely in university courses

- **Database Systems: The Complete Book** by Garcia-Molina, Ullman, Widom (2nd ed.) — Thorough treatment of query optimization and execution. Advanced but comprehensive.

- **Readings in Database Systems** (Red Book, 5th ed.) — Curated collection of seminal papers. Available free online at http://www.redbook.io/

### Academic Courses
- **CMU 15-445/645: Database Systems** (Andy Pavlo)
  - Course website: https://15445.courses.cs.cmu.edu/fall2023/
  - Video lectures: https://www.youtube.com/playlist?list=PLSE8ODhjZXjaKScG3l0nuOiDTTqpfnWFf
  - Excellent modern treatment with lecture notes, projects, and assignments. Best single resource for this curriculum.

- **MIT 6.830/6.814: Database Systems**
  - Course materials: http://db.csail.mit.edu/6.5830/
  - Includes SimpleDB project (teaching database implementation)

- **Stanford CS245: Principles of Data-Intensive Systems**
  - Covers modern tradeoffs and recent research

### Implementation Documentation
- **PostgreSQL Internals Documentation**
  - Overview: https://www.postgresql.org/docs/current/internals.html
  - B-tree implementation: https://www.postgresql.org/docs/current/btree-implementation.html
  - Planner/optimizer: https://www.postgresql.org/docs/current/planner-optimizer.html
  - EXPLAIN: https://www.postgresql.org/docs/current/using-explain.html
  - Statistics: https://www.postgresql.org/docs/current/planner-stats.html

- **SQLite Architecture**
  - Architecture overview: https://sqlite.org/arch.html
  - File format: https://sqlite.org/fileformat.html
  - B-tree implementation: https://sqlite.org/btree.html
  - Query planner: https://sqlite.org/queryplanner.html

- **RocksDB (LSM-tree implementation)**
  - Basics: https://github.com/facebook/rocksdb/wiki/RocksDB-Basics
  - Compaction: https://github.com/facebook/rocksdb/wiki/Compaction
  - Tuning guide: https://github.com/facebook/rocksdb/wiki/RocksDB-Tuning-Guide

## Supplementary Resources

### Video Content
- **Andy Pavlo's CMU Database lectures** (YouTube) — Excellent presentation, covers all major topics. Highly recommended for visual learners.
  - Channel: https://www.youtube.com/c/CMUDatabaseGroup

- **MIT OpenCourseWare 6.830** — Video lectures and materials
  - https://ocw.mit.edu/courses/6-830-database-systems-fall-2010/

- **Database Design Course** by Coursera/University of Michigan — Gentler intro if student needs more background

### Interactive Tools & Visualizations
- **B-tree Visualization** by David Galles (USF)
  - https://www.cs.usfca.edu/~galles/visualization/BTree.html
  - Interactive insertion/deletion, great for lessons 5-9

- **EXPLAIN Plan Visualizers**
  - Postgres Explain Visualizer (Depesz): https://explain.depesz.com/
  - PEV2 (Alex Tatiyants): https://tatiyants.com/pev/
  - pgMustard: https://www.pgmustard.com/
  - Use for lessons 20, 25

- **Latency Numbers Every Programmer Should Know**
  - Interactive version: https://colin-scott.github.io/personal_website/research/interactive_latency.html
  - Essential for lesson 2 (I/O costs)

- **Database Benchmark Tools**
  - https://www.databass.dev/ — Interactive database playground
  - Useful for experimenting with different engines

### Key Papers
- **"Access Path Selection in a Relational Database Management System"** — Selinger et al., 1979
  - System R optimizer paper, foundational for cost-based optimization
  - ACM: https://dl.acm.org/doi/10.1145/582.582444

- **"The Log-Structured Merge-Tree (LSM-tree)"** — O'Neil et al., 1996
  - Original LSM-tree paper
  - Acta Informatica: https://www.cs.umb.edu/~poneil/lsmtree.pdf

- **"The Five-Minute Rule"** — Gray & Graefe, various years
  - Economic analysis of caching decisions
  - Updated versions track hardware evolution

- **"The Case for Learned Index Structures"** — Kraska et al., 2018
  - ML replacing B-trees
  - arXiv: https://arxiv.org/abs/1712.01208

- **"An Empirical Evaluation of In-Memory Multi-Version Concurrency Control"** — Wu et al., 2017
  - VLDB paper on MVCC implementations
  - http://www.vldb.org/pvldb/vol10/p781-Wu.pdf

### Practical Guides
- **Use The Index, Luke!** — Markus Winand
  - https://use-the-index-luke.com/
  - Excellent practical guide to SQL indexing and performance
  - Less theoretical than Petrov, more practical than academic texts

- **PostgreSQL Performance Tuning** — Various wiki pages
  - Configuration: https://wiki.postgresql.org/wiki/Performance_Optimization
  - Monitoring: https://wiki.postgresql.org/wiki/Monitoring

### Code Repositories
- **SQLite Source Code**
  - https://github.com/sqlite/sqlite
  - Well-commented, relatively small codebase
  - Amalgamation build is easier to read than full source tree

- **PostgreSQL Source Code**
  - https://github.com/postgres/postgres
  - Optimizer code: src/backend/optimizer/
  - Large but well-organized

- **RocksDB**
  - https://github.com/facebook/rocksdb
  - Production LSM-tree implementation

- **SimpleDB** (MIT 6.830 teaching database)
  - http://db.csail.mit.edu/6.5830/
  - Simplified implementation for learning

## People to Follow

### Researchers & Practitioners
- **Andy Pavlo** (CMU) — Database systems, storage engines, benchmarking
  - Twitter: @andy_pavlo
  - Website: https://www.cs.cmu.edu/~pavlo/

- **Markus Winand** — SQL performance expert, author of "Use The Index, Luke"
  - https://winand.at/

- **Alex Petrov** — Author of "Database Internals"
  - Twitter: @ifesdjeen

- **Jens Axboe** — Linux I/O expert, created io_uring
  - Relevant for understanding storage performance

- **Peter Bailis** (Stanford/Sisu Data) — Database research, consistency models
  - http://www.bailis.org/

- **Joe Hellerstein** (UC Berkeley) — Database systems research
  - https://dsf.berkeley.edu/jmh/

### Database Blogs & Communities
- **Postgres Weekly** — Newsletter with curated content
  - https://postgresweekly.com/

- **CMU Database Group Blog**
  - https://db.cs.cmu.edu/

- **RocksDB Blog**
  - https://rocksdb.org/blog/

- **High Scalability** — Architecture case studies
  - http://highscalability.com/

## Unexpected Connections

### Cross-Discipline Links
- **Operating Systems** — Page replacement algorithms (LRU, clock) apply directly to buffer pool management. The "five-minute rule" mirrors OS caching decisions.

- **Compilers** — Query optimization uses similar techniques to compiler optimization: cost models, dynamic programming for ordering, algebraic rewriting.

- **Machine Learning** — Learned indexes, cardinality estimation with neural networks, adaptive query processing with reinforcement learning. Growing research area.

- **Economics** — The "five-minute rule" is fundamentally an economic analysis (cost of memory vs cost of I/O). Storage engine selection is a tradeoff analysis.

- **Information Theory** — Compression in column stores (dictionary encoding, run-length encoding) uses information theory principles.

- **Distributed Systems** — Many database internals (WAL, MVCC, consensus) appear in distributed systems. LSM-trees are popular for distributed databases (Cassandra, HBase).

### Wild Cards for Engagement
- **How Git uses LSM-tree concepts** — Git's packfiles and compaction resemble LSM-trees
- **How SSDs changed database design** — Write amplification became critical with SSDs (limited write cycles)
- **How Google Bigtable influenced LSM adoption** — Bigtable's success (2006) made LSM-trees mainstream
- **How databases optimize for modern CPU caches** — Cache-conscious data structures (ART trees, vectorized execution)
- **How blockchain databases work** — Merkle trees + append-only logs resemble database concepts
- **How search engines index** — Inverted indexes use similar techniques to database indexes

## Tools for Hands-On Exploration

- **pgAdmin / DBeaver** — GUI tools for exploring database internals, viewing EXPLAIN plans
- **pgBench** — PostgreSQL benchmarking tool
- **sysbench** — General database benchmark
- **pg_stat_statements** — PostgreSQL extension for query performance analysis
- **EXPLAIN ANALYZE** — Built into PostgreSQL/MySQL for plan analysis
