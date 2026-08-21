# Privacy Law and Data Protection — Concept Map

## Core Concepts (in learning order)

1. **Privacy as a human right** — foundational philosophical and legal basis for privacy protections
2. **Fair Information Practice Principles (FIPPs)** — notice, choice, access, security, accountability
3. **Personal data** — information relating to identified or identifiable natural persons
4. **Identifiability** — what makes data "personal" vs anonymous
5. **Data controller vs processor** — roles and responsibilities in data processing. Depends on: Personal data
6. **Comprehensive vs sectoral regulation** — EU's GDPR vs US's patchwork approach
7. **GDPR territorial scope** — extraterritoriality and global reach. Depends on: Data controller
8. **Lawful bases for processing** — consent, contract, legitimate interests, legal obligation, vital interests, public task. Depends on: Personal data
9. **Valid consent** — freely given, specific, informed, unambiguous. Depends on: Lawful bases
10. **Data subject rights** — access, rectification, erasure, portability, restriction, objection. Depends on: Data controller, Lawful bases
11. **Data Protection Impact Assessment (DPIA)** — risk assessment for high-risk processing. Depends on: Data controller, Lawful bases
12. **Breach notification** — 72-hour rule and reporting obligations. Depends on: Data controller
13. **US sectoral laws** — HIPAA, FERPA, GLBA, COPPA for specific industries
14. **FTC Section 5 enforcement** — unfair and deceptive practices authority. Depends on: FIPPs
15. **CCPA/CPRA** — California's comprehensive consumer privacy law. Depends on: Data subject rights, US sectoral laws
16. **State privacy laws** — Virginia CDPA, Colorado CPA, etc. Depends on: CCPA/CPRA
17. **Children's privacy (COPPA)** — special protections for under-13 users. Depends on: Consent, US sectoral laws
18. **Data sovereignty** — restrictions on cross-border data flows
19. **Adequacy decisions** — EU Commission assessments of third-country protections. Depends on: GDPR, Data sovereignty
20. **Standard Contractual Clauses (SCCs)** — contractual safeguards for transfers. Depends on: Data sovereignty, GDPR
21. **Schrems cases** — CJEU decisions invalidating Safe Harbor and Privacy Shield. Depends on: Adequacy decisions, SCCs
22. **Privacy by design and default** — embedding privacy into systems from inception. Depends on: FIPPs, GDPR
23. **Anonymization vs pseudonymization** — techniques to reduce identifiability. Depends on: Personal data, Identifiability
24. **Privacy-enhancing technologies (PETs)** — encryption, differential privacy, homomorphic encryption. Depends on: Privacy by design, Anonymization
25. **Automated decision-making and profiling** — GDPR Article 22 protections. Depends on: Data subject rights, Lawful bases
26. **AI and privacy regulation** — emerging frameworks for algorithmic transparency. Depends on: Automated decision-making, PETs

## Dependencies

### Foundational dependencies
- **Personal data** is the cornerstone — without understanding what qualifies as personal data, you can't apply any privacy framework
- **Data controller vs processor** distinction flows from personal data and determines who has which obligations
- **Lawful bases for processing** require understanding personal data and controller/processor roles — you need to know what you're processing and in what capacity before determining legal justification

### Regulatory framework dependencies
- **GDPR territorial scope** builds on the controller/processor framework to determine when the regulation applies
- **Data subject rights** depend on understanding lawful bases — rights vary based on which legal basis is used
- **DPIA requirements** build on both lawful bases (to assess risk) and data subject rights (to evaluate impact)
- **Breach notification** assumes understanding of controller obligations and risk assessment principles

### US law dependencies
- **US sectoral laws** build on FIPPs but apply them domain-specifically
- **FTC Section 5** enforcement relies on FIPPs to define "unfair and deceptive"
- **CCPA/CPRA** borrows concepts from GDPR (data subject rights) but adapts them to US context
- **State privacy laws** build on CCPA's model with variations
- **COPPA** extends consent requirements with child-specific protections

### Cross-border transfer dependencies
- **Data sovereignty** challenges flow from different regulatory frameworks (GDPR, US laws, others)
- **Adequacy decisions** require understanding GDPR's standards and how other countries compare
- **SCCs** are a mechanism to bridge adequacy gaps, so they depend on understanding both
- **Schrems cases** disrupted adequacy decisions and changed how SCCs must be implemented

### Technical measure dependencies
- **Privacy by design** operationalizes FIPPs and GDPR principles in system architecture
- **Anonymization vs pseudonymization** requires deep understanding of "identifiability" from the personal data concept
- **PETs** implement privacy by design through specific technologies
- **Anonymization** techniques must be understood before evaluating their effectiveness

### Emerging issue dependencies
- **Automated decision-making** extends data subject rights to algorithmic contexts
- **AI regulation** builds on automated decision-making, PETs, and privacy by design to address new risks

## Bottleneck Concepts

These concepts unlock multiple downstream topics:

1. **Personal data** — absolutely foundational; without this, nothing else makes sense
2. **Lawful bases for processing** — gates understanding of compliance, rights, and enforcement
3. **Data controller vs processor** — determines who is responsible for what
4. **Consent** — appears in multiple contexts (GDPR lawful basis, US opt-in/opt-out, COPPA, cross-border transfers)
5. **Data subject rights** — core to both GDPR and CCPA, influence enforcement and compliance
6. **Privacy by design** — bridges legal requirements and technical implementation

## Common Learning Paths

### Path 1: GDPR-first (European focus)
Personal data → Controller/processor → GDPR scope → Lawful bases → Consent → Data subject rights → DPIA → Breach → Cross-border → Privacy by design → PETs → AI

### Path 2: US-first (American focus)
Privacy rights → FIPPs → Sectoral laws → FTC enforcement → CCPA → State laws → COPPA → then circle back to GDPR for comparison

### Path 3: Technical-first (privacy engineering)
Personal data → Identifiability → Anonymization/pseudonymization → Privacy by design → PETs → then layer in legal frameworks

**This curriculum uses a hybrid approach**: Start with universal foundations (privacy rights, FIPPs, personal data), dive deep into GDPR (lessons 7-13), pivot to US laws (14-19), then address cross-border and technical (20-26), finishing with emerging issues (27-28). This ensures both legal frameworks are covered thoroughly while building technical literacy.

## Key Misconceptions to Address

1. **Anonymization is permanent** — many students assume anonymized data can never be re-identified; modern techniques often make this false
2. **Consent solves everything** — students often think getting consent is sufficient for GDPR compliance; it's just one lawful basis and has strict requirements
3. **GDPR only applies to EU companies** — extraterritoriality is poorly understood; many think location of company determines applicability
4. **Pseudonymization = anonymization** — these are different techniques with different legal implications
5. **Privacy = security** — related but distinct; security is a means to privacy, not the same thing
6. **US has no privacy law** — sectoral approach is complex but substantial; FTC enforcement is powerful
7. **Data transfer = data localization** — restrictions on transfers don't always require data to stay in one country
8. **Right to be forgotten is absolute** — erasure has exceptions and limitations
