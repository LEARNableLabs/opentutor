# Distributed Systems — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 15 lessons (44%)
- **real-world application challenges** — 6 lessons (18%)
- **review and consolidation sessions** — 6 lessons (18%)
- **Socratic questions** — 4 lessons (12%)
- **teach-back exercises (student explains)** — 2 lessons (6%)
- **curated resource exploration** — 1 lessons (3%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 35% accessible (1-2), 38% standard (3), 26% challenging (4-5).

Difficulty peaks:
- Day 4: "How do we order events when time is fuzzy?" (difficulty 4)
- Day 9: "How can reads and writes appear atomic across machines?" (difficulty 4)
- Day 10: "What's the difference between linearizability and serializability?" (difficulty 4)
- Day 15: "What happens when the leader dies?" (difficulty 4)
- Day 16: "Can multiple leaders accept writes without chaos?" (difficulty 4)

## Domain Hooks
- **Blockchain as distributed consensus** — Bitcoin/Ethereum use proof-of-work/stake for consensus in adversarial settings. Drop this when teaching Raft/Paxos to show how consensus generalizes beyond datacenters. Timing: Lesson 23.

- **CRDTs and collaborative editing** — Google Docs, Figma use CRDT-like techniques for real-time collaboration. Beautiful example of eventual consistency. Timing: Lesson 8.

- **Jepsen analyses** — Kyle Kingsbury's consistency testing of real databases (MongoDB, Elasticsearch, etc.). Shows that even production systems violate their claimed guarantees. Timing: Lesson 12 or 31.

- **Time in Google Spanner** — Spanner's TrueTime uses GPS and atomic clocks to bound clock uncertainty, enabling external consistency. Mind-bending example of using hardware to sidestep distributed systems problems. Timing: Lesson 3-4.

- **Microservices and distributed monoliths** — The shift from monoliths to microservices creates distributed systems problems (network calls instea

## Common Failure Modes
1. **"The network is reliable"** — Students often assume messages always arrive, in order, without delay. Counter this early with concrete examples of packet loss, reordering, and arbitrary delays. Make network unreliability visceral, not theoretical.

2. **"Clocks are synchronized"** — Many assume `time.now()` returns the same value on all machines. Show real examples of clock skew and NTP drift. Emphasize that physical time is fundamentally unreliable in distributed systems.

3. **"Strong consistency is always better"** — Students often think eventual consistency is just "worse" rather than a deliberate tradeoff for availability and performance. Use CAP theorem to frame this as an engineering choice, not a quality hierarchy.

4. **"Consensus is just voting"** — Consensus algorithms look like "majority vote" on the surface, but students miss the subtlety of handling failures, message delays, and split votes. Emphasize that the hard part is making progress despite arbitrary delays and 

## Vocabulary
Key terms for this domain: scalability, fault tolerance, geography, fallacies of distributed computing, network unreliability, latency, physical clocks, clock skew, NTP, logical clocks, Lamport timestamps, happens-before, CAP theorem, tradeoffs, partition tolerance (and 89 more).