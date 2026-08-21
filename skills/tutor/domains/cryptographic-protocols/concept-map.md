# Cryptographic Protocols — Concept Map

## Core Concepts (in learning order)

1. **Security goals** — confidentiality, authentication, integrity, non-repudiation
2. **Threat models** — what attacks a protocol must resist
3. **Protocol properties** — correctness, termination, fairness, robustness
4. **Key establishment** — how parties agree on shared secrets
5. **Key transport** — one party generates and sends key to another
6. **Diffie-Hellman** — key agreement using discrete logarithm problem. Depends on: key establishment
7. **Discrete logarithm** — computational hardness assumption for DH
8. **Ephemeral keys** — temporary keys for each session. Depends on: Diffie-Hellman
9. **Forward secrecy** — past sessions stay secure if long-term keys compromised. Depends on: ephemeral keys
10. **Man-in-the-middle attack** — attacker intercepts and relays messages. Depends on: Diffie-Hellman
11. **Authenticated key exchange** — key exchange with identity verification. Depends on: MITM attack
12. **ECDH** — elliptic curve Diffie-Hellman, smaller keys. Depends on: Diffie-Hellman
13. **Challenge-response** — prove knowledge without revealing secret. Depends on: authentication
14. **Replay attacks** — attacker reuses captured messages. Depends on: challenge-response
15. **Signature schemes** — unforgeable digital signatures. Depends on: public-key cryptography
16. **RSA signatures** — signatures using RSA. Depends on: signature schemes
17. **DSA/ECDSA** — discrete log-based signatures. Depends on: signature schemes, discrete logarithm
18. **Nonce reuse** — using same random value twice breaks security. Depends on: ECDSA
19. **PKI** — public key infrastructure for certificate management. Depends on: signature schemes
20. **Certificate authorities** — trusted entities issuing certificates. Depends on: PKI
21. **Chain of trust** — verification path from root to end entity. Depends on: certificate authorities
22. **Certificate revocation** — invalidating compromised certificates. Depends on: PKI
23. **PAKE** — password-authenticated key exchange. Depends on: key establishment, authentication
24. **TLS handshake** — establishing secure channel over insecure network. Depends on: key exchange, signatures, PKI
25. **Cipher suites** — negotiated crypto algorithms. Depends on: TLS handshake
26. **Session keys** — ephemeral keys for data encryption. Depends on: TLS handshake, ephemeral keys
27. **Double Ratchet** — Signal's forward secrecy mechanism. Depends on: forward secrecy, session keys
28. **Post-compromise security** — recovery after key compromise. Depends on: Double Ratchet
29. **OAuth 2.0** — delegated authorization framework. Depends on: authentication, tokens
30. **Bearer tokens** — tokens granting access without proof of possession. Depends on: OAuth 2.0
31. **IPsec** — IP layer security protocol. Depends on: key exchange, encryption
32. **Tunneling protocols** — encapsulation for privacy. Depends on: IPsec
33. **Zero-knowledge proofs** — prove statement without revealing why it's true. Depends on: interactive proofs
34. **Byzantine consensus** — agreement despite malicious participants. Depends on: distributed systems
35. **Proof-of-work** — computational puzzle for consensus. Depends on: Byzantine consensus
36. **Multi-party computation** — joint computation on private inputs. Depends on: secret sharing
37. **Secret sharing** — splitting secret among parties. Depends on: threshold cryptography
38. **Threshold cryptography** — cryptographic operations requiring k of n parties. Depends on: secret sharing
39. **Mixing networks** — relaying to hide sender-receiver relationship. Depends on: protocol composition
40. **Onion routing** — layered encryption for anonymity. Depends on: mixing networks

## Dependencies

### Foundation Chain
- **Diffie-Hellman** requires understanding **key establishment** because it's the fundamental problem DH solves
- **Forward secrecy** builds on **ephemeral keys** because you need temporary keys to prevent past session compromise
- **Authenticated key exchange** requires **MITM attack** knowledge because authentication prevents this exact attack

### Authentication Chain
- **Challenge-response** depends on **authentication goals** because it's a mechanism to prove identity
- **Signature schemes** enable **PKI** because certificates are signed claims
- **Chain of trust** builds on **certificate authorities** because CAs form the verification path
- **PAKE** combines **key establishment** and **authentication** because it does both with just a password

### Real-World Protocols Chain
- **TLS handshake** combines **key exchange**, **signatures**, and **PKI** because it uses all three for secure channel setup
- **Session keys** depend on **TLS handshake** and **ephemeral keys** because the handshake establishes ephemeral session keys
- **Double Ratchet** extends **forward secrecy** with continuous ratcheting for messaging
- **OAuth 2.0** builds on **authentication** but focuses on authorization, not identity

### Advanced Chain
- **Zero-knowledge proofs** extend **interactive proofs** to hide witnesses
- **Multi-party computation** requires **secret sharing** to distribute computation
- **Threshold cryptography** builds on **secret sharing** to distribute trust
- **Onion routing** uses **mixing networks** with layered encryption

## Bottleneck Concepts

These concepts unlock multiple downstream topics:

1. **Diffie-Hellman** — unlocks ephemeral keys, forward secrecy, ECDH, TLS, most modern protocols
2. **Signature schemes** — unlocks PKI, certificates, TLS, code signing, blockchain
3. **Authentication** — unlocks challenge-response, PAKE, OAuth, SSH, all identity protocols
4. **Forward secrecy** — unlocks TLS 1.3, Signal, modern messaging protocols
5. **Secret sharing** — unlocks MPC, threshold crypto, distributed systems

## Common Misconceptions

### Authentication vs. Confidentiality
**Misconception:** "If it's encrypted, it must be authenticated."
**Reality:** Encryption provides confidentiality, not authentication. You can have encrypted but unauthenticated channels (vulnerable to MITM).
**Fix:** Always explicitly verify authentication properties separate from confidentiality.

### Key Exchange vs. Key Transport
**Misconception:** "Key exchange and key transport are the same thing."
**Reality:** Key exchange (like DH) has both parties contribute to the key. Key transport has one party generate and send the key.
**Fix:** Understand that key exchange provides forward secrecy properties that key transport cannot.

### Forward Secrecy
**Misconception:** "Forward secrecy means the protocol is more secure."
**Reality:** Forward secrecy only protects *past* sessions if long-term keys are compromised. It doesn't prevent real-time attacks.
**Fix:** Clarify that forward secrecy is about limiting damage from future compromise.

### Signatures and Encryption
**Misconception:** "I can use the same key for signatures and encryption."
**Reality:** Key reuse across different primitives creates vulnerabilities.
**Fix:** Use separate keys for different purposes, even with the same algorithm.

### Certificate Revocation
**Misconception:** "Revoked certificates can't be used."
**Reality:** Revocation checking is often not enforced; clients may accept revoked certificates.
**Fix:** Understand practical limitations of CRL/OCSP and soft-fail behavior.

### Zero-Knowledge Proofs
**Misconception:** "Zero-knowledge means no information is revealed."
**Reality:** The *statement* is revealed, just not the *witness* (why it's true).
**Fix:** Clarify what ZK hides (witness) vs. what it reveals (statement truth).

### OAuth Authentication
**Misconception:** "OAuth is an authentication protocol."
**Reality:** OAuth 2.0 is an authorization framework, not an authentication protocol. Use OpenID Connect for authentication.
**Fix:** Distinguish authorization (what you can do) from authentication (who you are).

## Prerequisite Topics

### From Cryptography
- **Symmetric encryption** — needed for session encryption, authenticated encryption modes
- **Public-key cryptography** — needed for key exchange, signatures, PKI
- **Hash functions** — needed for signatures, HMACs, commitments
- **MACs** — needed for authenticated encryption, protocol integrity
- **Discrete logarithm problem** — needed for Diffie-Hellman, DSA, ECDSA
- **RSA problem** — needed for RSA signatures, key transport

### From Computer Science
- **Basic probability** — needed for security definitions, randomness requirements
- **Computational complexity** — needed for understanding security reductions
- **Network fundamentals** — needed for understanding protocol flows, TCP/IP
- **State machines** — needed for protocol design and analysis

### From Mathematics
- **Modular arithmetic** — needed for Diffie-Hellman, RSA
- **Group theory basics** — needed for elliptic curves, cyclic groups
- **Probability theory** — needed for security proofs, randomness analysis
