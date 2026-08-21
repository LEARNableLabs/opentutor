# Distributed Systems — Teaching Notes

## Approach

Distributed systems is fundamentally about **tradeoffs and reasoning under uncertainty**. At the intermediate level, teach by grounding every concept in concrete failure scenarios — "what breaks and why" — then show how real systems navigate the tradeoffs. Use the Socratic method heavily: students learn best by predicting what will go wrong, then seeing their intuition validated or corrected. Emphasize that there are no perfect solutions, only informed choices. Visual representations (timelines, state diagrams, network diagrams) are essential since distributed behavior is inherently concurrent and spatial.

Build intuition before formalism. Start with "why would we ever need this?" before diving into protocols. Use real-world systems (Dynamo, etcd, Kafka) as case studies rather than abstract examples. The goal is not to memorize algorithms but to develop a mental framework for reasoning about distributed problems.

## Common Misconceptions

1. **"The network is reliable"** — Students often assume messages always arrive, in order, without delay. Counter this early with concrete examples of packet loss, reordering, and arbitrary delays. Make network unreliability visceral, not theoretical.

2. **"Clocks are synchronized"** — Many assume `time.now()` returns the same value on all machines. Show real examples of clock skew and NTP drift. Emphasize that physical time is fundamentally unreliable in distributed systems.

3. **"Strong consistency is always better"** — Students often think eventual consistency is just "worse" rather than a deliberate tradeoff for availability and performance. Use CAP theorem to frame this as an engineering choice, not a quality hierarchy.

4. **"Consensus is just voting"** — Consensus algorithms look like "majority vote" on the surface, but students miss the subtlety of handling failures, message delays, and split votes. Emphasize that the hard part is making progress despite arbitrary delays and crashes.

5. **"Partitioning is the same as replication"** — Students conflate these orthogonal concepts. Clarify: partitioning splits data for scale (each partition holds different data), replication copies data for fault tolerance (each replica holds the same data). Real systems combine both.

6. **"Leader election is trivial"** — Students underestimate split-brain scenarios and think "just pick the leader with highest ID." Show how network partitions create multiple simultaneous leaders and why consensus is needed.

7. **"Byzantine faults are common in practice"** — Students either overestimate Byzantine fault likelihood (confusing it with crash faults) or think it's purely academic. Clarify: crash faults dominate in datacenters; Byzantine matters for public networks, blockchains, and adversarial environments.

8. **"Two-phase commit solves distributed transactions"** — Students see 2PC as "the solution" and don't grasp its blocking problem. Show a scenario where the coordinator crashes mid-protocol and participants are stuck waiting indefinitely.

9. **"Eventual consistency means 'eventually always consistent'"** — Students think eventual consistency provides absolute guarantees. Emphasize that without bounds, "eventual" can be indefinitely long, and systems can remain inconsistent under continuous writes.

10. **"Raft is 'better' than Paxos"** — Students oversimplify this comparison. Clarify: Raft is more understandable and has clearer leader-based semantics, but Paxos is more flexible for certain use cases (multi-Paxos, flexible quorums).

## Level Adjustments

### For Intermediate Level (this curriculum)

- **Assume prerequisites**: basic networking (TCP/IP), OS concepts (processes, file systems), and concurrent programming (locks, race conditions)
- **Depth of formalism**: Show the core ideas behind algorithms (Paxos, Raft) but don't require proof-level understanding. Focus on "what problem does this solve and how" over "prove this property holds."
- **Hands-on expectation**: Students should be able to reason about a system design ("would this design maintain consistency under partition?") and read distributed systems papers, but not necessarily implement consensus from scratch
- **Real-world focus**: Heavy emphasis on production systems (AWS, Google Cloud, Kafka, etcd). Tie every concept back to how it appears in industry.
- **Skip**: Byzantine fault-tolerant consensus (mention but don't deep-dive), formal verification, advanced topics like CRDTs internals (cover conceptually)

### Adjustments from Beginner

If this were beginner-level, we'd spend more time on networking basics, concrete examples of how HTTP requests work, and less on consistency models. We'd skip FLP impossibility and Paxos entirely.

### Adjustments toward Advanced

For advanced students, add: formal proofs of consensus impossibility, CRDT implementation details, advanced consistency models (snapshot isolation, read-committed), distributed transactions (Spanner's TrueTime), stream processing semantics (exactly-once), and more on observability (distributed tracing).

## Rabbit Holes (Fascinating Connections)

- **Blockchain as distributed consensus** — Bitcoin/Ethereum use proof-of-work/stake for consensus in adversarial settings. Drop this when teaching Raft/Paxos to show how consensus generalizes beyond datacenters. Timing: Lesson 23.

- **CRDTs and collaborative editing** — Google Docs, Figma use CRDT-like techniques for real-time collaboration. Beautiful example of eventual consistency. Timing: Lesson 8.

- **Jepsen analyses** — Kyle Kingsbury's consistency testing of real databases (MongoDB, Elasticsearch, etc.). Shows that even production systems violate their claimed guarantees. Timing: Lesson 12 or 31.

- **Time in Google Spanner** — Spanner's TrueTime uses GPS and atomic clocks to bound clock uncertainty, enabling external consistency. Mind-bending example of using hardware to sidestep distributed systems problems. Timing: Lesson 3-4.

- **Microservices and distributed monoliths** — The shift from monoliths to microservices creates distributed systems problems (network calls instead of function calls). Cautionary tale about accidental complexity. Timing: Lesson 1.

- **The split-brain problem in real incidents** — GitHub's 2012 outage, AWS DynamoDB's 2015 incident. Real-world split-brain scenarios are terrifying and instructive. Timing: Lesson 15.

- **Kafka's log-centric architecture** — Reframing databases as derived views over an immutable log. Beautiful unification of messaging, storage, and stream processing. Timing: Lesson 32.

- **CALM theorem** — Consistency As Logical Monotonicity. If your computation is monotonic, you don't need coordination. Deep connection between logic and distributed systems. Timing: Advanced students only, after Lesson 8.

## Difficulty Progression

- **Lessons 1-6 (Foundations)**: Start gentle (difficulty 1-2) with motivating questions, build to logical clocks (difficulty 4), then review. This sets the stage.
- **Lessons 7-12 (Consistency)**: Steady climb from 2→4, with linearizability and serializability as peaks. Review brings it back down.
- **Lessons 13-18 (Replication)**: Similar pattern, with multi-leader and leaderless as complexity peaks (difficulty 4).
- **Lessons 19-24 (Consensus)**: This is the hardest module. Paxos is a difficulty 5 (intentionally resource-drop, not required mastery). Raft is 4. Review after.
- **Lessons 25-28 (Partitioning)**: Moderate difficulty (2-4), with consistent hashing as the peak.
- **Lessons 29-33 (Fault Tolerance)**: Practical module, difficulty 2-4, ending with a review.

Overall arc: gentle start, multiple peaks (one per module), regular reviews to consolidate, and ending on a practical note (fault tolerance) rather than the most abstract topic.

## Teaching Mode Recommendations

- **Mini-lessons**: Use for introducing new concepts (leader-follower, Raft, consistent hashing)
- **Questions**: Use to challenge assumptions (linearizability vs serializability, why consensus is hard)
- **Real-world**: Use for case studies and failure stories (MongoDB split-brain, Dynamo design)
- **Teach-back**: Use after difficult concepts (CAP theorem, chaos engineering) to force articulation
- **Resource-drop**: Use for extremely dense material (Paxos paper) where understanding comes from multiple exposures
- **Review**: Every 5-7 lessons, synthesis and consolidation

## Common Questions Students Ask

- "Why not just use a single database?" → Answer: Single point of failure, geographic latency, scale limits. But validate the question: sometimes you *should* use a single database if distribution isn't needed.
- "Can't we just use blockchain for everything?" → Answer: Blockchains are consensus for adversarial settings, massive overkill (and performance killer) for trusted environments.
- "How do I choose between consistency models?" → Answer: Start with your application invariants. What can break if you see stale data? What's the cost of unavailability? Work backward from there.
- "Is Raft production-ready?" → Answer: Yes, etcd, Consul, and CockroachDB use it in production. Show concrete examples.
