# Distributed Systems — Concept Map

## Core Concepts (in learning order)

1. **Scalability** — ability to handle growth by adding resources
2. **Fault tolerance** — system continues operating despite failures
3. **Network unreliability** — networks fail, messages get lost or delayed. Depends on: scalability
4. **Latency** — time delay in message transmission. Depends on: network unreliability
5. **Physical clocks** — real-time clocks on different machines drift apart. Depends on: network unreliability
6. **Logical clocks** — ordering events without synchronized time. Depends on: physical clocks
7. **Happens-before relation** — partial ordering of events in a distributed system. Depends on: logical clocks
8. **CAP theorem** — impossibility of simultaneous consistency, availability, and partition tolerance. Depends on: network unreliability, fault tolerance
9. **Consistency models** — guarantees about the order and visibility of operations. Depends on: CAP theorem
10. **Strong consistency** — all replicas see the same data at the same time. Depends on: consistency models
11. **Eventual consistency** — replicas converge to the same state eventually. Depends on: consistency models
12. **Linearizability** — operations appear atomic and in real-time order. Depends on: strong consistency
13. **Serializability** — transaction isolation level from databases. Depends on: strong consistency
14. **Causal consistency** — causally-related operations are seen in order. Depends on: happens-before relation, consistency models
15. **Vector clocks** — tracking causality across nodes. Depends on: logical clocks, causal consistency
16. **Replication** — copying data across multiple machines. Depends on: fault tolerance, scalability
17. **Leader-follower replication** — one leader handles writes, followers replicate. Depends on: replication
18. **Replication lag** — delay between leader write and follower update. Depends on: leader-follower replication
19. **Failover** — switching to backup when primary fails. Depends on: leader-follower replication, fault tolerance
20. **Split brain** — multiple nodes believe they are the leader. Depends on: failover
21. **Multi-leader replication** — multiple nodes accept writes. Depends on: replication
22. **Conflict resolution** — resolving concurrent conflicting writes. Depends on: multi-leader replication, eventual consistency
23. **Leaderless replication** — all replicas are equal (Dynamo-style). Depends on: replication
24. **Quorum** — number of nodes that must agree for an operation. Depends on: leaderless replication
25. **Consensus** — getting distributed nodes to agree on a value. Depends on: fault tolerance, consistency models
26. **FLP impossibility** — no deterministic consensus in asynchronous systems with failures. Depends on: consensus
27. **Two-phase commit (2PC)** — distributed transaction protocol. Depends on: consensus
28. **Paxos** — consensus algorithm with proposers, acceptors, learners. Depends on: consensus, FLP impossibility
29. **Raft** — understandable consensus with leader election and log replication. Depends on: consensus
30. **Partitioning (sharding)** — splitting data across multiple nodes. Depends on: scalability
31. **Hash partitioning** — distributing data by hash function. Depends on: partitioning
32. **Range partitioning** — distributing data by key ranges. Depends on: partitioning
33. **Consistent hashing** — minimizing data movement during rebalancing. Depends on: hash partitioning
34. **Hot spots** — uneven load distribution across partitions. Depends on: partitioning
35. **Rebalancing** — redistributing data when nodes join/leave. Depends on: partitioning, consistent hashing
36. **Failure modes** — types of failures (crash, Byzantine, network partition). Depends on: fault tolerance
37. **Failure detection** — identifying failed nodes. Depends on: failure modes, heartbeats
38. **Heartbeats** — periodic messages to detect liveness. Depends on: network unreliability
39. **Chaos engineering** — intentional failure injection to test resilience. Depends on: fault tolerance, failure modes
40. **Write-ahead log (WAL)** — durability and recovery mechanism. Depends on: fault tolerance

## Dependencies

### Time and Ordering
- **Logical clocks** require understanding **physical clocks** because we need to see why physical time is insufficient for ordering distributed events
- **Happens-before relation** builds on **logical clocks** (Lamport timestamps) to create a causal partial order
- **Vector clocks** extend **logical clocks** to detect concurrent events and track **causal consistency**

### Consistency Spectrum
- **CAP theorem** depends on understanding **network unreliability** and **fault tolerance** because partitions force tradeoffs
- **Linearizability** and **serializability** both build on **strong consistency** but apply to different contexts (single operations vs transactions)
- **Causal consistency** requires **happens-before relation** and **vector clocks** to track causality without full synchronization

### Replication Patterns
- **Leader-follower replication** is the foundation; **multi-leader** and **leaderless** are responses to its limitations
- **Failover** and **split brain** are operational concerns specific to **leader-based** systems
- **Conflict resolution** becomes critical in **multi-leader** and **leaderless** systems because they sacrifice strong consistency
- **Quorum** is the core mechanism for **leaderless replication** to provide tunable consistency

### Consensus
- **FLP impossibility** explains why **consensus** is fundamentally hard in asynchronous systems
- **Two-phase commit** is a simpler protocol but has blocking problems that **Paxos** and **Raft** solve
- **Raft** builds on lessons from **Paxos** with clearer semantics and better understandability

### Partitioning
- **Consistent hashing** is a refinement of **hash partitioning** that minimizes **rebalancing** cost
- **Hot spots** emerge from poor **partitioning** strategies and require careful key distribution
- **Rebalancing** requires coordination mechanisms often built on **consensus** algorithms

### Fault Tolerance
- **Failure detection** uses **heartbeats** which suffer from **network unreliability**
- **Chaos engineering** systematically explores **failure modes** to verify **fault tolerance**
- **Write-ahead log** provides recovery from crash failures

## Bottleneck Concepts

These concepts are foundational — students must understand them before progressing:

1. **Network unreliability** — everything else stems from accepting that networks fail
2. **Logical clocks / Happens-before** — essential for understanding ordering and causality
3. **CAP theorem** — frames all consistency tradeoffs
4. **Replication** — core pattern for both fault tolerance and scalability
5. **Consensus** — fundamental problem underlying coordination
6. **Partitioning** — required for horizontal scaling

## Prerequisite Topics

- **Basic networking** — needed for understanding message passing, latency, TCP/IP behavior
- **Operating systems** — needed for processes, threads, file systems, crash recovery
- **Concurrent programming** — needed for race conditions, locks, atomicity
- **Data structures** — needed for hash functions, trees (for partitioning schemes)
- **Algorithms** — needed for analyzing correctness and performance of consensus protocols
