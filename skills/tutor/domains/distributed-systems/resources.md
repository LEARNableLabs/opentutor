# Distributed Systems — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Designing Data-Intensive Applications** by Martin Kleppmann (O'Reilly, 2017)
  - https://dataintensive.net/
  - The gold standard for intermediate-level distributed systems. Industry-focused, practical, excellent examples from real systems. Covers replication, partitioning, transactions, consistency models.
  - **Why it's perfect for intermediate**: Bridges theory and practice. Not proof-heavy, but rigorous about tradeoffs.

- **Distributed Systems** (4th edition) by Maarten van Steen and Andrew Tanenbaum
  - https://www.distributed-systems.net/
  - More academic, comprehensive textbook. Good for deeper theory.
  - Free PDF available on the website.

- **Database Internals** by Alex Petrov (O'Reilly, 2019)
  - https://www.databass.dev/
  - Deep dive into storage engines, B-trees, LSM-trees, replication, and distributed consensus. Complements Kleppmann.

### Courses

- **MIT 6.824: Distributed Systems** (Spring 2020 and later)
  - https://pdos.csail.mit.edu/6.824/
  - Legendary course taught by Robert Morris. Includes labs where you build MapReduce, Raft, sharded KV store.
  - Video lectures: https://www.youtube.com/playlist?list=PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB

- **CMU 15-440/640: Distributed Systems**
  - https://www.cs.cmu.edu/~dga/15-440/
  - Solid systems engineering approach. Good lecture notes.

- **University of Cambridge: Distributed Systems** (Martin Kleppmann)
  - https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/
  - Lecture notes and videos from Martin Kleppmann. Excellent quality.

## Papers (Foundational Classics)

### Must-Read

- **Time, Clocks, and the Ordering of Events in a Distributed System** — Leslie Lamport (1978)
  - https://lamport.azurewebsites.net/pubs/time-clocks.pdf
  - Introduces logical clocks and happens-before relation. Foundational.

- **The Byzantine Generals Problem** — Leslie Lamport et al. (1982)
  - https://lamport.azurewebsites.net/pubs/byz.pdf
  - Classic statement of Byzantine fault tolerance.

- **Paxos Made Simple** — Leslie Lamport (2001)
  - https://lamport.azurewebsites.net/pubs/paxos-simple.pdf
  - Lamport's attempt to make Paxos understandable. Still not simple, but canonical.

- **In Search of an Understandable Consensus Algorithm (Raft)** — Diego Ongaro and John Ousterhout (2014)
  - https://raft.github.io/raft.pdf
  - The Raft paper. Actually understandable consensus.

- **Dynamo: Amazon's Highly Available Key-value Store** — DeCandia et al. (2007)
  - https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf
  - Influential paper on leaderless replication, eventual consistency, and quorum systems.

- **Bigtable: A Distributed Storage System for Structured Data** — Google (2006)
  - https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf
  - Google's distributed table storage system.

- **Spanner: Google's Globally-Distributed Database** — Corbett et al. (2012)
  - https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf
  - External consistency using TrueTime. Mind-bending use of synchronized clocks.

### Paper Collections

- **The Morning Paper** by Adrian Colyer (archived)
  - https://blog.acolyer.org/
  - Daily paper summaries, many on distributed systems.

- **Papers We Love: Distributed Systems**
  - https://github.com/papers-we-love/papers-we-love/tree/master/distributed_systems
  - Curated collection of important papers.

## Supplementary Resources

### Interactive Visualizations

- **The Secret Lives of Data** — Raft visualization
  - https://thesecretlivesofdata.com/raft/
  - Beautiful interactive visualization of leader election and log replication in Raft.

- **Raft Consensus Simulator**
  - https://raft.github.io/
  - Interactive simulator for exploring Raft behavior.

- **Consistency Models** — Jepsen
  - https://jepsen.io/consistency
  - Interactive consistency model hierarchy with examples.

### Videos and Talks

- **Martin Kleppmann's talks**
  - "Designing Data-Intensive Applications" author talks: https://martin.kleppmann.com/talks.html
  - Highly recommended: "Transactions: myths, surprises and opportunities" and "CRDTs and the Quest for Distributed Consistency"

- **Papers We Love: Distributed Systems talks**
  - https://www.youtube.com/c/PapersWeLove
  - Technical deep-dives on classic papers.

- **StrangeLoop Conference**
  - https://www.youtube.com/c/StrangeLoopConf
  - Many excellent distributed systems talks.

- **Raft lecture by Diego Ongaro**
  - https://www.youtube.com/watch?v=YbZ3zDzDnrw
  - Raft author explaining the algorithm.

- **Leslie Lamport's lectures**
  - https://lamport.azurewebsites.net/
  - The GOAT of distributed systems.

### Blogs and Articles

- **All Things Distributed** by Werner Vogels (Amazon CTO)
  - https://www.allthingsdistributed.com/
  - Industry perspective on distributed systems design.

- **Aphyr (Kyle Kingsbury) — Jepsen analyses**
  - https://aphyr.com/tags/Jepsen
  - "Call Me Maybe" series: rigorous testing of distributed databases for consistency violations.
  - Essential reading for understanding how real systems fail.

- **High Scalability**
  - http://highscalability.com/
  - Case studies of how major systems scale (Twitter, Netflix, etc.).

- **The Paper Trail** by Henry Robinson
  - https://www.the-paper-trail.org/
  - Excellent explanations of distributed systems concepts and papers.

- **Distributed Systems Reading List** by Fermat
  - https://ferd.ca/a-distributed-systems-reading-list.html
  - Curated reading path through distributed systems.

- **Marc's Blog** by Marc Brooker (AWS)
  - https://brooker.co.za/blog/
  - Deep technical posts on distributed systems at AWS scale.

### Code and Tools

- **etcd** — Distributed key-value store using Raft
  - https://etcd.io/
  - Production-grade Raft implementation. Read the docs to see Raft in practice.

- **Consul** — Service mesh using Raft
  - https://www.consul.io/
  - HashiCorp's consensus-based service discovery.

- **Apache Kafka** — Distributed streaming platform
  - https://kafka.apache.org/
  - Log-centric architecture, great for learning replication and partitioning.

- **CockroachDB** — Distributed SQL database
  - https://github.com/cockroachdb/cockroach
  - Open-source distributed database using Raft. Excellent architecture docs.

- **FoundationDB** — Distributed database with simulation testing
  - https://www.foundationdb.org/
  - Interesting use of deterministic simulation for testing.

- **Jepsen** — Consistency testing framework
  - https://github.com/jepsen-io/jepsen
  - Kyle Kingsbury's tool for testing distributed systems. Learn by reading analyses.

- **Chaos Mesh** — Chaos engineering platform
  - https://chaos-mesh.org/
  - Kubernetes-native chaos engineering. Practice breaking things.

- **Maelstrom** — Workbench for learning distributed systems
  - https://github.com/jepsen-io/maelstrom
  - From Jepsen team. Build distributed systems and test them against correctness properties.

### Simulators and Playgrounds

- **Raft visualization**
  - https://raft.github.io/
  - Step through Raft protocol execution.

- **Cassandra simulator** (if available)
  - Explore Dynamo-style replication.

- **FaunaDB's consistency model explorer**
  - Interactive demos of consistency tradeoffs.

## People to Follow

### Researchers and Engineers

- **Leslie Lamport** — Turing Award winner, invented Paxos, logical clocks, LaTeX
  - https://lamport.azurewebsites.net/

- **Martin Kleppmann** — Author of "Designing Data-Intensive Applications"
  - https://martin.kleppmann.com/
  - Twitter: @martinkl

- **Kyle Kingsbury (Aphyr)** — Jepsen author, consistency testing
  - https://aphyr.com/
  - Twitter: @aphyr

- **Werner Vogels** — Amazon CTO, "All Things Distributed"
  - https://www.allthingsdistributed.com/
  - Twitter: @Werner

- **Peter Bailis** — Researcher on consistency, transactions, CALM theorem
  - http://www.bailis.org/
  - Twitter: @pbailis

- **Marc Brooker** — AWS engineer, great blog on distributed systems
  - https://brooker.co.za/blog/
  - Twitter: @MarcJBrooker

- **Heidi Howard** — Consensus algorithms researcher (Raft, Paxos variants)
  - https://hh360.user.srcf.net/

- **Adrian Colyer** — "The Morning Paper" author
  - https://blog.acolyer.org/
  - Twitter: @adriancolyer

- **Caitie McCaffrey** — Distributed systems engineer, great talks
  - Twitter: @caitie

## Unexpected Connections

### Cross-Disciplinary Links

- **Distributed systems ↔ Biology**: Leslie Lamport has noted similarities between Paxos and decision-making in ant colonies. Swarm intelligence uses consensus-like mechanisms.

- **Distributed systems ↔ Social science**: Byzantine Generals Problem models trust in adversarial environments — directly applicable to political science, game theory.

- **Distributed systems ↔ Physics**: Vector clocks and causality are related to special relativity's light cones. Events can only influence each other within the "causal cone."

- **Distributed systems ↔ Law**: Blockchain and consensus algorithms underpin cryptocurrency legal frameworks. Smart contracts are distributed computation with legal implications.

- **Distributed systems ↔ Music**: Distributed jam sessions over the internet face latency and consistency problems (can you play in sync?). Operational Transformation (Google Docs) is related to collaborative music composition.

### Media and Pop Culture

- **Science fiction**: "The Three-Body Problem" (Cixin Liu) features communication across light-years — extreme distributed systems with latency and unreliability.
- **Movies**: "Interstellar" (time dilation) relates to clock synchronization problems across relativistic speeds.
