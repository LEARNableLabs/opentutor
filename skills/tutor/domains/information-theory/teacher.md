# Information Theory — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 11 lessons (39%)
- **real-world application challenges** — 5 lessons (18%)
- **Socratic questions** — 4 lessons (14%)
- **review and consolidation sessions** — 4 lessons (14%)
- **teach-back exercises (student explains)** — 2 lessons (7%)
- **curated resource exploration** — 2 lessons (7%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 29% accessible (1-2), 43% standard (3), 29% challenging (4-5).

Difficulty peaks:
- Day 10: "Can we compress data down to its entropy?" (difficulty 4)
- Day 12: "Can we compress data we haven't seen yet?" (difficulty 4)
- Day 17: "Can we communicate reliably over any noisy channel below capacity?" (difficulty 5)
- Day 18: "Design an error-correcting code for space communication" (difficulty 4)
- Day 22: "What is the fundamental limit of lossy compression?" (difficulty 4)

## Domain Hooks
1. **Shannon's fire-control system** — Drop in lesson 1-2: Shannon worked on fire-control (anti-aircraft guns) before information theory. The targeting problem is about predicting aircraft position despite noise — a channel coding problem in disguise. "Information theory emerged from wartime engineering."

2. **Kolmogorov complexity connection** — Drop in lesson 10-12: Shannon entropy is average-case compression, Kolmogorov complexity is worst-case. "There's a whole parallel theory about compressing individual strings, not distributions."

3. **Maxwell's demon and Landauer's principle** — Drop in lesson 5-6: Thermodynamic entropy and Shannon entropy converge in physics of computation. "Erasing a bit generates at least kT ln(2) heat. Information is physical!"

4. **Black hole information paradox** — Drop in lesson 24-25: Hawking radiation and entropy of black holes. "The surface area of a black hole's event horizon is proportional to its entropy. Information theory intersects quantum gr

## Common Failure Modes
1. **"Entropy is disorder"** — Students bring physics intuition. Clarify: Shannon entropy measures uncertainty/information content, not thermodynamic disorder. They're connected but distinct. Use examples: a perfectly ordered sequence can have high Shannon entropy if it's unpredictable.

2. **"Higher entropy is better/worse"** — Students often moralize entropy. Clarify: high entropy means more uncertainty, which is "good" if you want security (cryptography) but "bad" if you want predictability. It's context-dependent.

3. **"Mutual information implies causation"** — The symmetry I(X;Y) = I(Y;X) proves this wrong, but students still slip into causal thinking. Emphasize: MI measures dependence, not direction.

4. **"You can compress below H(X) with a clever algorithm"** — Students often think there's a "better" compression scheme. Use counting argument: if you compress all sequences, some must expand. Entropy is provably unbeatable on average.

5. **"Channel capacity is a hard limit on t

## Vocabulary
Key terms for this domain: information content, surprise, uncertainty, Shannon entropy, binary entropy function, bits, joint entropy, conditional entropy, chain rule, mutual information, information gain, data processing inequality, KL divergence, relative entropy, Jensen-Shannon divergence (and 68 more).