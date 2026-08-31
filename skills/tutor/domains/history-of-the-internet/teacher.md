# History and Theory of the Internet — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 9 lessons (31%)
- **Socratic questions** — 7 lessons (24%)
- **real-world application challenges** — 5 lessons (17%)
- **review and consolidation sessions** — 4 lessons (14%)
- **teach-back exercises (student explains)** — 3 lessons (10%)
- **curated resource exploration** — 1 lessons (3%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 48% accessible (1-2), 34% standard (3), 17% challenging (4-5).

Difficulty peaks:
- Day 9: "How did Vint Cerf and Bob Kahn design a universal language for networks?" (difficulty 4)
- Day 20: "Why can't the internet run out of domain names but can run out of IP addresses?" (difficulty 4)
- Day 21: "How do routers decide where to send your packets?" (difficulty 4)
- Day 28: "What technical and social challenges face the future internet?" (difficulty 4)
- Day 29: "Design a protocol for a new internet service" (difficulty 5)

## Domain Hooks
- **The "Lo" message** — First ARPANET transmission crashed after two letters; beautiful accident showing debugging as essential to computing
- **RFC 2324 (Hyper Text Coffee Pot Control Protocol)** — April Fools RFC; shows IETF culture and humor
- **The Eternal September** — Usenet overwhelmed by AOL users; metaphor for internet scaling challenges
- **Submarine cables** — 99% of intercontinental traffic goes through physical undersea cables, not satellites; the internet has a geography
- **Tim Berners-Lee's decision not to patent the web** — Single choice that enabled the modern internet economy
- **The root DNS servers** — Only 13 logical root servers (anycast means hundreds physically); shows trust and infrastructure fragility
- **BGP hijacking** — Pakistan accidentally broke YouTube globally in 2008 by misconfiguring BGP; shows internet fragility
- **The Great Firewall of China** — Technical implementation of censorship via DNS filtering and IP blocking; internet as political artifa

## Common Failure Modes
1. **"The internet and the web are the same thing"** 
   - **Why students get this wrong**: They use browsers to access everything online; the web is their primary internet experience
   - **How to correct it**: Show pre-web internet applications (email, FTP, Telnet). Emphasize WWW as *one application layer protocol* running on top of internet infrastructure. Use analogy: internet is the road system, web is one type of vehicle

2. **"The internet was designed all at once as a grand plan"**
   - **Why students get this wrong**: Modern infrastructure feels coherent; hard to imagine it evolved messily
   - **How to correct it**: Emphasize ARPANET's modest goals (connect 4 computers), email's accidental invention, TCP/IP as a *retrofit* to solve incompatibility. Show how IPv4 address exhaustion is a "mistake" baked into early design

3. **"Packet switching is just 'chopping up data'"**
   - **Why students get this wrong**: Surface-level understanding of the mechanism, not the principles
  

## Vocabulary
Key terms for this domain: mainframe era, time-sharing, batch processing, packet switching, circuit switching, distributed networks, packet headers, routing, multiplexing, ARPA, command and control, survivability, IMP nodes, first transmission, network debugging (and 70 more).