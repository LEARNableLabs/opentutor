# Cryptographic Protocols — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Introduction to Modern Cryptography (3rd Edition)** by Jonathan Katz and Yehuda Lindell
  - Covers: Formal security definitions, provable security, comprehensive protocol coverage
  - Why good for intermediate: Rigorous but accessible, excellent protocol analysis, homework problems
  - URL: https://www.cs.umd.edu/~jkatz/imc.html

- **A Graduate Course in Applied Cryptography** by Dan Boneh and Victor Shoup
  - Covers: Modern protocols, authenticated encryption, TLS, advanced topics (MPC, threshold crypto)
  - Why good for intermediate: Free PDF available, up-to-date content, excellent explanations
  - URL: https://cryptobook.us/

- **Cryptography Engineering** by Niels Ferguson, Bruce Schneier, and Tadayoshi Kohno
  - Covers: Practical protocol implementation, real-world pitfalls, engineering tradeoffs
  - Why good for intermediate: Implementation-focused, security engineering mindset
  - URL: https://www.schneier.com/books/cryptography-engineering/

- **Network Security: Private Communication in a Public World** by Charlie Kaufman, Radia Perlman, and Mike Speciner
  - Covers: Protocol design patterns, PKI, Kerberos, IPsec, detailed protocol flows
  - Why good for intermediate: Protocol-first approach, clear explanations of complex systems
  - URL: https://www.pearson.com/en-us/subject-catalog/p/network-security-private-communication-in-a-public-world/P200000003483

### Online Courses

- **Stanford CS 255: Introduction to Cryptography** by Dan Boneh
  - Covers: Symmetric/asymmetric crypto, authenticated encryption, TLS, key exchange
  - Why good for intermediate: Excellent video lectures, focus on protocols, free access
  - URL: https://crypto.stanford.edu/~dabo/courses/OnlineCrypto/

- **Coursera Cryptography Specialization** by Dan Boneh and Victor Shoup
  - Covers: Comprehensive protocol coverage, homework assignments, quizzes
  - Why good for intermediate: Structured learning path, graded exercises
  - URL: https://www.coursera.org/learn/crypto

- **MIT 6.857: Network and Computer Security**
  - Covers: Protocol design, security analysis, practical cryptographic systems
  - Why good for intermediate: MIT-level rigor, real-world focus
  - URL: https://courses.csail.mit.edu/6.857/

- **Applied Cryptography (Udacity)** by University of Virginia
  - Covers: Hands-on protocol implementation, security engineering
  - Why good for intermediate: Practical coding exercises, real implementations
  - URL: https://www.udacity.com/course/applied-cryptography--cs387

## Supplementary (for engagement)

### Videos & Lectures

- **Computerphile Cryptography Playlist**
  - Engaging explanations of Diffie-Hellman, RSA, public-key crypto
  - URL: https://www.youtube.com/playlist?list=PLzH6n4zXuckpKAj1_88VS-8Z6yn9zX_P6

- **Khan Academy: Journey into Cryptography**
  - Accessible introduction to cryptographic concepts
  - URL: https://www.khanacademy.org/computing/computer-science/cryptography

- **DEF CON Crypto Village Talks**
  - Real-world protocol attacks, cutting-edge research, hacker perspective
  - URL: https://www.youtube.com/c/DEFCONConference/search?query=crypto

- **Real World Crypto Symposium**
  - Annual conference on practical cryptography, protocol deployment
  - URL: https://rwc.iacr.org/

### Interactive Tools & Simulators

- **CrypTool 2**
  - Protocol visualization, hands-on experimentation, algorithm animations
  - URL: https://www.cryptool.org/en/cryptool2

- **Cryptopals Crypto Challenges**
  - Hands-on protocol attacks, implement-and-break exercises
  - URL: https://cryptopals.com/

- **The Illustrated TLS 1.3 Connection**
  - Step-by-step TLS handshake breakdown with hex dumps
  - URL: https://tls13.xargs.org/

- **The Illustrated TLS 1.2 Connection**
  - Detailed TLS 1.2 handshake walkthrough
  - URL: https://tls12.xargs.org/

- **Signal Protocol Specifications**
  - Interactive documentation of Signal's Double Ratchet protocol
  - URL: https://signal.org/docs/

- **Wireshark Protocol Analyzer**
  - Capture and analyze real protocol traffic (TLS, SSH, IPsec)
  - URL: https://www.wireshark.org/

- **OpenSSL Command Line Tools**
  - Hands-on TLS testing, certificate generation, protocol debugging
  - URL: https://www.openssl.org/

### Code & Implementations

- **libsodium**
  - Modern, easy-to-use crypto library with safe protocol implementations
  - URL: https://libsodium.gitbook.io/doc/

- **Noise Protocol Framework**
  - Compositional protocol framework (used by WireGuard, WhatsApp)
  - URL: https://noiseprotocol.org/

- **TLS 1.3 in Rust (rustls)**
  - Modern, safe TLS implementation with excellent documentation
  - URL: https://github.com/rustls/rustls

- **BearSSL**
  - Minimalist TLS library, excellent for understanding protocol internals
  - URL: https://bearssl.org/

- **Double Ratchet Implementation (Python)**
  - Reference implementation of Signal's protocol
  - URL: https://github.com/tgalal/python-axolotl

### Specifications & Standards (RFCs)

- **TLS 1.3 (RFC 8446)**
  - Latest TLS specification, modern protocol design
  - URL: https://www.rfc-editor.org/rfc/rfc8446

- **TLS 1.2 (RFC 5246)**
  - Previous TLS version, still widely deployed
  - URL: https://www.rfc-editor.org/rfc/rfc5246

- **SSH Protocol (RFC 4253)**
  - SSH transport layer protocol specification
  - URL: https://www.rfc-editor.org/rfc/rfc4253

- **OAuth 2.0 (RFC 6749)**
  - Authorization framework specification
  - URL: https://www.rfc-editor.org/rfc/rfc6749

- **OpenID Connect Core**
  - Authentication layer on top of OAuth 2.0
  - URL: https://openid.net/specs/openid-connect-core-1_0.html

- **IPsec (RFC 4301)**
  - Security architecture for IP layer
  - URL: https://www.rfc-editor.org/rfc/rfc4301

- **X.509 Certificates (RFC 5280)**
  - Public key infrastructure certificate format
  - URL: https://www.rfc-editor.org/rfc/rfc5280

- **Diffie-Hellman Key Exchange (RFC 2631)**
  - DH key agreement specification
  - URL: https://www.rfc-editor.org/rfc/rfc2631

- **Curve25519 and Curve448 (RFC 7748)**
  - Modern elliptic curve specifications
  - URL: https://www.rfc-editor.org/rfc/rfc7748

### Research & Papers

- **IACR ePrint Archive**
  - Latest cryptographic protocol research (pre-prints)
  - URL: https://eprint.iacr.org/

- **The Bitcoin Whitepaper** by Satoshi Nakamoto
  - Original blockchain consensus protocol
  - URL: https://bitcoin.org/bitcoin.pdf

- **The Tor Design Paper** by Roger Dingledine, Nick Mathewson, Paul Syverson
  - Onion routing protocol specification
  - URL: https://svn-archive.torproject.org/svn/projects/design-paper/tor-design.pdf

- **Signal Protocol Documentation**
  - X3DH (key agreement) and Double Ratchet specifications
  - URL: https://signal.org/docs/specifications/x3dh/
  - URL: https://signal.org/docs/specifications/doubleratchet/

- **Practical Cryptography for Developers** (free book)
  - Hands-on guide to using crypto correctly
  - URL: https://cryptobook.nakov.com/

## People to Follow

### Researchers & Practitioners

- **Dan Boneh** (Stanford) — protocol design, applied cryptography
  - Twitter: @danboneh
  - Website: https://crypto.stanford.edu/~dabo/

- **Matthew Green** (Johns Hopkins) — practical cryptography, protocol analysis
  - Blog: https://blog.cryptographyengineering.com/
  - Twitter: @matthew_d_green

- **Bruce Schneier** — security engineering, cryptography analysis
  - Blog: https://www.schneier.com/
  - Twitter: @schneierblog

- **Moxie Marlinspike** — Signal Protocol creator, secure messaging
  - Website: https://moxie.org/
  - Twitter: @moxie

- **Thomas Ptacek** — cryptographic engineering, protocol attacks
  - Twitter: @tqbf
  - Blog: https://sockpuppet.org/

- **Filippo Valsorda** — Go crypto, TLS, certificate transparency
  - Blog: https://filippo.io/
  - Twitter: @FiloSottile

- **Kenny Paterson** (ETH Zurich) — protocol analysis, TLS research
  - Website: https://paterson.tech/

- **Yehuda Lindell** — secure computation, protocol theory
  - Website: https://www.cs.biu.ac.il/~lindell/

### Organizations & Communities

- **International Association for Cryptologic Research (IACR)**
  - Conferences: Crypto, Eurocrypt, Asiacrypt
  - URL: https://www.iacr.org/

- **Real World Crypto**
  - Annual symposium on practical cryptography
  - URL: https://rwc.iacr.org/

- **Let's Encrypt**
  - Free certificate authority, excellent PKI learning resource
  - URL: https://letsencrypt.org/

- **Tor Project**
  - Privacy-preserving protocol research and deployment
  - URL: https://www.torproject.org/

- **Cloudflare Research**
  - Applied cryptography research blog
  - URL: https://blog.cloudflare.com/tag/cryptography/

## Unexpected Connections

### Cryptographic Protocols in Biology
- DNA cryptography and steganography research
- URL: https://www.nature.com/articles/nature07264

### Quantum Key Distribution
- Quantum cryptography protocols (BB84, E91)
- URL: https://www.idquantique.com/quantum-safe-security/overview/

### Cryptographic Voting Protocols
- End-to-end verifiable voting systems
- URL: https://voting.works/

### Blockchain Beyond Bitcoin
- Ethereum smart contracts, consensus mechanisms
- URL: https://ethereum.org/en/developers/docs/consensus-mechanisms/

### Music Copyright and Cryptographic Protocols
- Content fingerprinting and ownership protocols
- URL: https://mycelia.life/

### Privacy-Preserving Contact Tracing
- Apple/Google Exposure Notification protocol (COVID-19)
- URL: https://covid19.apple.com/contacttracing

## Learning Tools

### Cheat Sheets
- **TLS Cipher Suite Reference**
  - URL: https://ciphersuite.info/

- **Cryptographic Right Answers** (latacora)
  - What crypto to use in 2026
  - URL: https://latacora.micro.blog/2018/04/03/cryptographic-right-answers.html

### Vulnerability Databases
- **CVE Database** (Common Vulnerabilities and Exposures)
  - URL: https://cve.mitre.org/

- **SSL/TLS Vulnerabilities Timeline**
  - Heartbleed, POODLE, BEAST, etc.
  - URL: https://www.ssl.com/article/ssl-tls-vulnerabilities-timeline/

### Testing Tools
- **SSL Labs SSL Server Test**
  - Test TLS configuration of any website
  - URL: https://www.ssllabs.com/ssltest/

- **testssl.sh**
  - Command-line TLS scanner
  - URL: https://testssl.sh/

- **WireGuard Protocol**
  - Modern VPN protocol, excellent design study
  - URL: https://www.wireguard.com/
