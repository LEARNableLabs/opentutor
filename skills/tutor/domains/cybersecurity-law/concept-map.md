# Cybersecurity Law and Policy — Concept Map

## Core Concepts (in learning order)

1. **Privacy as a fundamental right** — why data protection requires legal intervention beyond market forces
2. **Data subject rights** — GDPR framework turning individuals into rights-holders (access, erasure, portability)
3. **Lawful basis for processing** — legal grounds for collecting and using personal data
4. **Controller vs processor** — organizational roles and liability allocation in data handling
5. **Territorial scope** — how laws apply across borders (GDPR extraterritoriality)
6. **Regulatory enforcement mechanisms** — supervisory authorities, fines, and compliance monitoring
7. **State privacy fragmentation** — CCPA/CPRA and the patchwork of US state laws
8. **Opt-in vs opt-out consent** — fundamentally different approaches to user control
9. **Sectoral privacy laws** — HIPAA, COPPA, GLBA and sector-specific approaches
10. **Breach notification requirements** — when and how organizations must disclose incidents
11. **Article III standing** — constitutional barrier to breach litigation in US courts
12. **Duty of care in cybersecurity** — when negligence creates legal liability
13. **FTC Section 5 authority** — regulatory enforcement of "reasonable security"
14. **Computer Fraud and Abuse Act (CFAA)** — federal computer crime statute and its scope
15. **Unauthorized access vs exceeding authorization** — the line between lawful and criminal access
16. **Prosecutorial discretion in security research** — when vulnerability disclosure risks prosecution
17. **Stored Communications Act (SCA)** — statutory protection for stored electronic communications
18. **Third-party doctrine** — diminished Fourth Amendment protection for data shared with third parties
19. **Reasonable expectation of privacy** — constitutional test for digital searches
20. **Foreign Intelligence Surveillance Act (FISA)** — national security surveillance framework
21. **Section 702 surveillance** — warrantless collection with incidental domestic impact
22. **Encryption backdoors debate** — tension between security and law enforcement access
23. **DMCA anti-circumvention** — prohibition on bypassing technological protection measures
24. **Trade secret protection** — alternative to patent disclosure for security innovations
25. **Coordinated disclosure** — balancing vulnerability publication with vendor remediation
26. **Extraterritorial jurisdiction** — when one country's laws reach foreign actors
27. **International data transfers** — mechanisms for lawful cross-border data flows (SCCs, adequacy)
28. **Legal hold and privilege** — preserving evidence while protecting attorney-client communications
29. **Sector-specific compliance** — navigating overlapping regulatory frameworks
30. **Cyber insurance and risk transfer** — market-based allocation of breach costs

## Dependencies

### Foundation Layer (Lessons 1-6)
- **Data subject rights** require understanding **privacy as a right** because they operationalize the philosophical commitment
- **Regulatory enforcement** depends on **territorial scope** because enforcement follows jurisdictional reach
- **Opt-in vs opt-out** builds on **lawful basis** because consent is one processing ground among several

### Privacy Frameworks (Lessons 7-10)
- **State privacy fragmentation** depends on understanding **GDPR framework** because states often model GDPR
- **Sectoral laws** create context for **state fragmentation** by showing US preference for targeted regulation
- **Breach notification** requires **controller/processor distinction** because notification obligations differ by role

### Breach Litigation (Lessons 7-10)
- **Article III standing** is independent but shapes all US privacy litigation
- **Duty of care** builds on **FTC authority** and **breach notification** because compliance informs reasonableness
- **FTC Section 5** provides regulatory hook when statutory requirements are absent

### Computer Crime (Lessons 11-14)
- **Unauthorized access vs exceeding authorization** is core CFAA interpretation challenge
- **Security research fears** depend on understanding **CFAA scope** and **prosecutorial discretion**
- **Wire fraud/identity theft** expand on **CFAA** by adding complementary criminal statutes

### Surveillance (Lessons 15-17)
- **Stored Communications Act** is statutory overlay on **Fourth Amendment** protections
- **Third-party doctrine** limits **reasonable expectation of privacy** in digital age
- **FISA** and **Section 702** create exceptions to **Fourth Amendment** warrant requirements
- **Encryption backdoors** tension emerges from conflict between **security** and **FISA/surveillance** authorities

### Intellectual Property (Lessons 19-21)
- **DMCA anti-circumvention** creates legal risk for **security research** alongside CFAA
- **Trade secrets** are alternative to **patents** when disclosure harms security
- **Coordinated disclosure** balances **DMCA** risk, **CFAA** risk, and vulnerability research

### International (Lessons 22-24)
- **Extraterritorial jurisdiction** builds on **territorial scope** from GDPR foundation
- **International data transfers** require understanding **GDPR** enforcement and **adequacy**
- **Schrems cases** exemplify tension between **surveillance law** (FISA) and **data transfers**

### Compliance & IR (Lessons 25-28)
- **Legal hold** requires understanding **privilege** and **evidence preservation**
- **Sector-specific compliance** builds on **sectoral privacy laws** from earlier module
- **Cyber insurance** emerges from **breach litigation** economics and **regulatory pressure**
- **IR planning** synthesizes **notification requirements**, **legal hold**, and **regulatory compliance**

## Bottlenecks

### Jurisdiction and Territoriality
Students struggle with how laws can reach beyond borders. **Territorial scope** (Lesson 2) introduces this, but it becomes critical for:
- GDPR enforcement against US companies (Lesson 22)
- International data transfers (Lesson 23)
- Multi-jurisdictional breach response (Lesson 28)

Mitigation: Use concrete examples of companies operating in multiple jurisdictions early.

### Constitutional vs Statutory Protection
US students often confuse Fourth Amendment protections with statutory SCA protections. This conflation blocks understanding of:
- Why third-party doctrine matters (Lesson 15)
- How FISA operates outside Fourth Amendment (Lesson 16)
- When encryption backdoors could be compelled (Lesson 17)

Mitigation: Explicitly map constitutional floor vs statutory overlay in Lesson 15.

### CFAA Scope Ambiguity
The "exceeding authorization" question (Lesson 11) is notoriously unclear and blocks understanding of:
- Security research risk (Lesson 13)
- Terms of service violations (throughout)
- Civil vs criminal CFAA claims

Mitigation: Use Van Buren case as anchor; return to it when CFAA comes up later.

### Standing in Data Breach Cases
Article III standing (Lesson 8) is procedurally complex and creates learned helplessness about privacy litigation. Without grasping it, students can't understand:
- Why class actions settle early (Lesson 10)
- Why regulatory enforcement dominates (Lesson 9)
- Why state laws add private rights of action (Lesson 4)

Mitigation: Use one clear case (TransUnion) as running example.

## Common Misconceptions

See teaching-notes.md for full list, but key concept-level misconceptions:

1. **"GDPR only applies in Europe"** — blocks understanding of extraterritorial reach
2. **"Encryption is either legal or illegal"** — misses nuanced backdoor debate
3. **"CFAA bans all unauthorized access"** — over-reads statute, misses Van Buren narrowing
4. **"Breach notification is a GDPR thing"** — misses that US states led on this
5. **"Fourth Amendment protects all digital data"** — misses third-party doctrine erosion

## Prerequisite Topics

- **Basic legal system knowledge** — needed for: case law vs statutes, jurisdiction, civil vs criminal
- **Fundamental cybersecurity concepts** — needed for: understanding what breaches are, encryption basics, access control
- **Privacy fundamentals** — needed for: PII/personal data, why privacy matters, basic regulatory awareness
- **Constitutional law basics (US)** — needed for: Fourth Amendment, Article III, separation of powers (especially Lessons 8, 15-17)
- **International relations concepts** — needed for: sovereignty, treaties, extraterritoriality (Lessons 22-24)

## Advanced Extensions (Rabbit Holes)

- **AI and algorithmic accountability** — GDPR Article 22, automated decision-making
- **Biometric privacy laws** — BIPA and the Illinois model
- **Content moderation and Section 230** — platform liability intersection
- **Cybercrime attribution** — technical and legal challenges
- **Supply chain security** — SolarWinds and cascading liability
- **Zero trust architecture** — legal implications of "never trust, always verify"
