# Number theory and cryptography — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 9 lessons (33%)
- **Socratic questions** — 6 lessons (22%)
- **review and consolidation sessions** — 4 lessons (15%)
- **real-world application challenges** — 4 lessons (15%)
- **teach-back exercises (student explains)** — 3 lessons (11%)
- **curated resource exploration** — 1 lessons (4%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 41% accessible (1-2), 30% standard (3), 30% challenging (4-5).

Difficulty peaks:
- Day 9: "Why does a^(p-1) ≡ 1 (mod p) for any a?" (difficulty 4)
- Day 10: "How does Euler generalize Fermat's theorem to composite moduli?" (difficulty 4)
- Day 15: "Why does RSA key generation require choosing two primes?" (difficulty 4)
- Day 16: "Can you implement RSA encryption from scratch?" (difficulty 4)
- Day 20: "How can you efficiently test if a huge number is prime?" (difficulty 4)

## Domain Hooks
This field covers number theory and cryptography, with applications across theory and practice.

## Common Failure Modes
1. **"Modular arithmetic is just remainders"** — Students reduce it to a computational trick instead of recognizing it as a quotient ring. Show that Z/nZ is a full algebraic structure with its own arithmetic, not just "regular math with mod."

2. **"If a^(n-1) ≡ 1 (mod n), then n is prime"** — Fermat's test has false positives (Carmichael numbers). Students often assume the converse of Fermat's Little Theorem holds. Emphasize: Fermat test can prove compositeness, not primality.

3. **"RSA encryption means e is the 'encryption key'"** — Students conflate the exponent e with the entire public key. Clarify: the public key is the *pair* (n, e), and n is equally important.

4. **"Factoring is impossible"** — Students overestimate the hardness of factoring after seeing the hype. Clarify: factoring is *computationally hard for large n*, not mathematically impossible. Small numbers factor instantly.

5. **"The private key d is just the inverse of e"** — Students forget the modulus. Emphasize: 

## Vocabulary
Key terms for this domain: divisibility, division algorithm, greatest common divisor, Euclidean algorithm, extended Euclidean algorithm, Bezout's identity, prime numbers, fundamental theorem of arithmetic, prime factorization, Euclidean algorithm application, manual computation, congruences, modular arithmetic, residue classes, modular inverses (and 61 more).