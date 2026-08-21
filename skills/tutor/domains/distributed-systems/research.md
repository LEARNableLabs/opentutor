# Distributed Systems — Research Summary

## Major Subtopics

### 1. Fundamentals of Distribution
- Why distribution matters (scalability, fault tolerance, geography)
- The CAP theorem and its real-world implications
- Fallacies of distributed computing
- Time and ordering in distributed systems

### 2. Consistency and Consensus
- Consistency models (strong, eventual, causal)
- Consensus algorithms (Paxos, Raft, ZAB)
- Two-phase commit and distributed transactions
- Linearizability vs. serializability

### 3. Replication and Partitioning
- Replication strategies (leader-follower, multi-leader, leaderless)
- Partitioning schemes (range, hash, consistent hashing)
- Rebalancing and hot spots
- Combining replication and partitioning

### 4. Fault Tolerance
- Failure modes (crash, Byzantine, network partitions)
- Detecting failures (heartbeats, gossip protocols)
- Recovery strategies
- Chaos engineering and fault injection

### 5. Real-World Systems
- Case studies: Dynamo, BigTable, Spanner, Kafka
- Cloud primitives (S3, DynamoDB, etc.)
- Microservices patterns
- Observability and debugging distributed systems

## Key Sources

### Textbooks and Books
- **Designing Data-Intensive Applications** by Martin Kleppmann — industry-focused, intermediate level, excellent practical examples
- **Distributed Systems** by Maarten van Steen and Andrew Tanenbaum — comprehensive textbook, more academic
- **Database Internals** by Alex Petrov — deep dive into storage and replication

### Courses
- **MIT 6.824: Distributed Systems** — legendary course with labs building distributed systems (Raft, sharded KV store)
- **CMU 15-440: Distributed Systems** — solid systems engineering approach

### Papers (Foundational)
- Lamport's "Time, Clocks, and the Ordering of Events in a Distributed System" (1978)
- Amazon's Dynamo paper (2007)
- Google's BigTable (2006) and Spanner (2012) papers
- Raft consensus paper (2014) — more understandable than Paxos

### Interactive Resources
- **The Secret Lives of Data** (Raft visualization)
- **Jepsen** by Kyle Kingsbury (Aphyr) — real-world consistency analysis
- **Cassandra simulator**, **etcd playground**

### Video Resources
- Martin Kleppmann's talks and lectures
- Papers We Love talks on distributed systems classics
- StrangeLoop conference talks

## Available Tools and Platforms
- Docker/Kubernetes for experimenting with distributed deployments
- etcd, Consul, ZooKeeper for consensus
- Kafka, RabbitMQ, NATS for messaging
- FoundationDB, CockroachDB for distributed databases
- Chaos Mesh, Pumba for fault injection
