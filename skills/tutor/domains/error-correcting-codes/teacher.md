# Error-Correcting Codes — from Hamming to LDPC — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 9 lessons (36%)
- **real-world application challenges** — 6 lessons (24%)
- **review and consolidation sessions** — 4 lessons (16%)
- **Socratic questions** — 3 lessons (12%)
- **teach-back exercises (student explains)** — 2 lessons (8%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 40% accessible (1-2), 32% standard (3), 28% challenging (4-5).

Difficulty peaks:
- Day 9: "What is syndrome decoding and why is it elegant?" (difficulty 4)
- Day 11: "What makes a code 'perfect' and why are they rare?" (difficulty 4)
- Day 15: "What are BCH codes and how do they generalize Hamming?" (difficulty 4)
- Day 16: "Why do CDs and QR codes use Reed-Solomon codes?" (difficulty 4)
- Day 20: "Why is the Viterbi algorithm a dynamic programming triumph?" (difficulty 4)

## Domain Hooks
- **Hamming's "unreasonable effectiveness" moment** — He invented Hamming codes while frustrated debugging a relay computer that crashed every weekend. Drop this during Lesson 7 to motivate the field's origin.

- **The Golay code and the Voyager spacecraft** — Golay(24,12) was used on Voyager alongside Reed-Solomon. It's one of only three nontrivial perfect binary codes. Mention during Lesson 11.

- **Shannon's wartime cryptography work** — His information theory emerged from classified WWII crypto work. The connection between coding theory and cryptography (dual goals: redundancy vs. randomness). Touch on during Lesson 2.

- **The turbo code "earthquake" in 1993** — When Berrou, Glavieux, and Thitimajshima presented turbo codes approaching Shannon capacity, it shocked the field. Some thought it violated information theory. Mention during Lesson 21.

- **Gallager's forgotten thesis** — LDPC codes sat dormant for 30 years because decoding was computationally prohibitive in the 1960s. Ma

## Common Failure Modes
1. **"More redundancy always means better error correction"** — Students think tripling every bit is optimal. Counter with rate-distance tradeoffs and Shannon's theorem showing there's a theoretical limit. Demonstrate that clever algebraic structure (Hamming codes) outperforms naive repetition.

2. **"Error detection and correction are the same thing"** — Confuse the capability to detect d errors with correcting d errors. Emphasize that detection needs minimum distance d+1, but correction needs 2d+1. Use geometric visualization: correction requires error sphere around each codeword to be disjoint.

3. **"The syndrome is the error pattern"** — Think syndrome directly shows which bits flipped. Clarify that syndrome identifies the coset (error class), which then maps to the most likely error pattern. It's an index, not the error itself.

4. **"All linear codes are cyclic"** — Assume linearity implies cyclic property. Show counterexamples: many linear codes are not cyclic. Cyclic is a stro

## Vocabulary
Key terms for this domain: redundancy, error models, binary symmetric channel, channel capacity, Shannon's theorem, noisy channel coding, Hamming distance, minimum distance, error detection vs correction, Hamming bound, Singleton bound, perfect codes, parity check, even/odd parity, single-bit error detection (and 58 more).