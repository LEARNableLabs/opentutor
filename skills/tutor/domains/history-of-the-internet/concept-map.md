# History and Theory of the Internet — Concept Map

## Core Concepts (in learning order)

1. **Mainframe computing** — isolated, batch-processing computers before networking
2. **Time-sharing systems** — multiple users sharing one computer, precursor to distributed computing
3. **Packet switching** — breaking data into packets vs dedicated circuit connections. Foundation of internet
4. **Distributed networks** — survivable network topology without central control
5. **ARPANET** — first operational packet-switched network (1969)
6. **Network protocols** — agreed-upon rules for communication between machines
7. **Internetworking** — connecting incompatible networks together
8. **TCP/IP** — universal protocol suite enabling the modern internet. Depends on: packet switching, protocol design
9. **Layered architecture** — separating network functions into independent layers (physical, network, transport, application)
10. **End-to-end principle** — intelligence at edges, simplicity in the core. Depends on: layered architecture
11. **Email protocols** — first killer app of ARPANET (SMTP, POP, IMAP). Depends on: network protocols
12. **Hypertext** — linked documents, precursor to the web
13. **World Wide Web (WWW)** — global hypertext system on top of internet. Depends on: TCP/IP, hypertext, HTTP
14. **HTTP/HTML/URL** — core web protocols and formats. Depends on: WWW concept, TCP/IP
15. **Web browsers** — user interface for the web. Depends on: HTTP, HTML
16. **Search algorithms** — organizing and ranking web content (PageRank). Depends on: web graph structure
17. **Domain Name System (DNS)** — human-readable names mapped to IP addresses. Depends on: IP addressing, hierarchical databases
18. **IP addressing** — unique identifiers for network devices (IPv4, IPv6). Depends on: TCP/IP
19. **Routing** — path selection for packets across networks. Depends on: IP addressing, network topology
20. **BGP (Border Gateway Protocol)** — how autonomous systems route between each other. Depends on: routing, autonomous systems
21. **Autonomous systems** — independently managed network regions. Depends on: internetworking concept
22. **UDP vs TCP** — reliable vs unreliable transport protocols. Depends on: transport layer concept
23. **Internet governance** — organizations managing standards and resources (IETF, ICANN, W3C). Depends on: understanding of internet scale
24. **Net neutrality** — policy debate on ISP traffic treatment. Depends on: routing, ISP role, common carrier concept
25. **Network effects** — value increases with number of users. Depends on: understanding of platforms and standards
26. **Mobile internet** — wireless broadband and always-on connectivity. Depends on: TCP/IP, cellular networks
27. **Protocol design** — creating new internet standards. Depends on: layered architecture, real-world constraints

## Dependencies

### Critical Path Dependencies

- **TCP/IP requires packet switching** because you need to understand how data is broken into discrete units before you can understand how those units are reliably delivered and routed
- **WWW requires TCP/IP** because the web is an application layer protocol running on top of the internet's transport infrastructure
- **HTTP requires TCP** because web requests need reliable, ordered delivery
- **DNS requires IP addressing** because domain name resolution maps names to IP addresses
- **Routing requires IP addressing** because routers make forwarding decisions based on destination IP addresses
- **BGP requires routing concepts** because it's a specific routing protocol operating at the inter-network level

### Conceptual Dependencies

- **End-to-end principle builds on layered architecture** because it's a design philosophy about where intelligence should live in the protocol stack
- **Search algorithms depend on web graph structure** because PageRank analyzes hyperlinks between pages
- **Net neutrality debates depend on understanding routing and ISP role** because the debate centers on how ISPs treat different traffic types
- **Network effects explain why standards matter** because incompatible networks have less value than unified ones
- **Internetworking solves the compatibility problem** that led to TCP/IP's design

### Historical Dependencies

- **ARPANET success enabled TCP/IP development** — early experience with packet switching proved the concept
- **Email's popularity drove ARPANET adoption** — killer app created demand for network access
- **WWW's openness enabled explosive growth** — patent-free web created network effects
- **Browser wars drove web standards** — commercial competition led to both innovation and fragmentation
- **IPv4 exhaustion drove IPv6 development** — technical debt from original design choices

## Prerequisite Topics

- **Basic computer literacy** — needed for understanding what networks connect
- **Client-server model** — needed for lessons 1, 12-16 (web architecture)
- **Basic networking concepts** — needed for lessons 17-21 (protocol deep dive)
- **Understanding of software vs hardware** — needed throughout for protocol abstraction

## Bottleneck Concepts

These are concepts that students must fully understand before proceeding, as many future concepts depend on them:

1. **Packet switching** (lesson 2-3) — entire internet architecture depends on this
2. **TCP/IP** (lesson 8) — all modern internet applications run on this
3. **Layered architecture** (lesson 8) — needed to understand protocol design
4. **DNS** (lesson 17) — bridges human-readable names and machine addressing

## Common Misconception Chains

- **"The internet is the web"** → blocks understanding of layered architecture and pre-web internet applications
- **"TCP/IP was designed from the start"** → misses the evolutionary, problem-driven nature of internet development
- **"Routers are smart"** → conflicts with end-to-end principle (intelligence at edges)
- **"IP addresses identify computers"** → they identify network interfaces, not machines (one machine can have many)
- **"The internet is free and uncontrolled"** → misses governance structures, ISP economics, and power dynamics

## Integration Points (Cross-Domain Connections)

- **Computer Science** — algorithm design (routing algorithms, search algorithms)
- **Electrical Engineering** — physical layer, signal transmission, fiber optics
- **Economics** — network effects, platform economics, ISP markets
- **Law & Policy** — net neutrality, internet governance, privacy
- **Sociology** — online communities, digital divide, information access
- **Cryptography** — HTTPS, encrypted communication, security protocols
