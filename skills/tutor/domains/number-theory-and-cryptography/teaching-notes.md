# Number Theory and Cryptography — Teaching Notes

## Approach

This topic sits at the intersection of pure mathematics and practical computer science, requiring a **dual pedagogy**: rigorous proofs for the "why" and hands-on coding for the "how." At the intermediate level, students should prove Fermat's Little Theorem rigorously, then immediately implement RSA in code to see it work. The magic of this subject is that ancient number theory (Fermat, 1640) directly enables modern internet security (RSA, 1977). Teach the historical arc: each theorem was pure math until cryptographers weaponized it.

Emphasize **computational thinking** alongside theorem proving. When teaching Euler's Theorem, students should both prove it on paper and implement modular exponentiation in code. The difficulty curve peaks twice: first at Euler's Theorem (theoretical), then at RSA implementation (practical). Use interactive tools (SageMath, Number Theory Visual Explorer) to visualize modular arithmetic and primality testing.

## Common Misconceptions

1. **"Modular arithmetic is just remainders"** — Students reduce it to a computational trick instead of recognizing it as a quotient ring. Show that Z/nZ is a full algebraic structure with its own arithmetic, not just "regular math with mod."

2. **"If a^(n-1) ≡ 1 (mod n), then n is prime"** — Fermat's test has false positives (Carmichael numbers). Students often assume the converse of Fermat's Little Theorem holds. Emphasize: Fermat test can prove compositeness, not primality.

3. **"RSA encryption means e is the 'encryption key'"** — Students conflate the exponent e with the entire public key. Clarify: the public key is the *pair* (n, e), and n is equally important.

4. **"Factoring is impossible"** — Students overestimate the hardness of factoring after seeing the hype. Clarify: factoring is *computationally hard for large n*, not mathematically impossible. Small numbers factor instantly.

5. **"The private key d is just the inverse of e"** — Students forget the modulus. Emphasize: d is the inverse of e *modulo φ(n)*, not modulo n and not in the integers.

6. **"You can encrypt arbitrarily large messages with RSA"** — Students miss that m < n is required. Real-world RSA hybrid encryption uses RSA only for a symmetric key, not the entire message.

7. **"Discrete log is the inverse of modular exponentiation"** — Students think it's just algebra. Emphasize: discrete log is *computationally hard* to compute, even though it's mathematically well-defined.

8. **"φ(n) = n - 1 for all n"** — Only true for primes. Students over-generalize from Fermat's Little Theorem. Show counterexamples: φ(12) = 4 ≠ 11.

9. **"RSA security depends on keeping n secret"** — The modulus n is public. Security depends on the hardness of factoring n, not on hiding n.

10. **"All cryptography will break with quantum computers"** — Only *public key* systems based on factoring or discrete log are vulnerable to Shor's algorithm. Symmetric encryption (AES) is largely quantum-resistant (though key sizes may need to increase for Grover's algorithm).

## Level Adjustments

### Beginner Level (if adapted down)
- Skip proofs of Fermat's and Euler's Theorems; just state and apply them
- Focus on RSA implementation, not security analysis
- Use smaller numbers (2-digit primes) for hand computation
- Skip elliptic curves and post-quantum entirely

### Intermediate Level (current target)
- **Prove** Fermat's and Euler's Theorems (not just state)
- Implement RSA from scratch, including key generation
- Analyze security: why small primes fail, common modulus attack
- Survey elliptic curves and post-quantum (conceptual, not deep)
- Balance theory and implementation 50/50

### Advanced Level (if adapted up)
- Prove Chinese Remainder Theorem constructively
- Implement Miller-Rabin and Pollard's rho from scratch
- Deep dive into elliptic curve cryptography (point addition, curve equations)
- Study lattice-based post-quantum cryptography
- Analyze Shor's algorithm in detail
- Read primary sources (Diffie-Hellman 1976, RSA 1978 papers)

## Difficulty Progression

The curriculum has a **two-peak structure**:

### Peak 1: Euler's Theorem (lessons 9-10, difficulty 4)
This is the theoretical summit. Students must understand:
- Why Fermat's Little Theorem works (proof via counting)
- How Euler generalizes it (using φ(n))
- Why this enables RSA (the exponentiation cycle)

Scaffold with concrete examples before the proof. Use φ(15) = 8 and show that 2^8 ≡ 1 (mod 15) by direct computation, then reveal the pattern.

### Peak 2: RSA Implementation (lessons 15-16, difficulty 4)
This is the practical summit. Students must:
- Generate keys (choose p, q, compute n, φ(n), find e and d)
- Encrypt and decrypt messages
- Handle edge cases (m ≥ n, gcd(e, φ(n)) ≠ 1)

Provide starter code but require students to implement the core loop themselves. Common bug: using regular `**` instead of `pow(m, e, n)` for modular exponentiation.

### Review Days (lessons 7, 13, 19, 25)
Review lessons are **spaced repetition + integration**. Don't just recap — give synthesis problems:
- Lesson 7: Solve a system of linear congruences using extended Euclidean algorithm
- Lesson 13: Explain why Euler's Theorem implies RSA works (end-to-end story)
- Lesson 19: Debug broken RSA code (e.g., e and φ(n) not coprime)
- Lesson 25: Compare factoring vs discrete log hardness

## Rabbit Holes

### When to Go Deep
- **Carmichael numbers** (lesson 20) — Show 561 = 3 × 11 × 17 as a Fermat liar. Great for students who love anomalies.
- **Quadratic residues** (can insert after lesson 10) — If student asks "what are primitive roots?" go down this path. Leads to Legendre symbols, quadratic reciprocity.
- **Elliptic curve point addition** (lesson 26) — If student is curious, visualize the geometric group law. Use Desmos or SageMath.
- **Shor's algorithm** (lesson 27) — If student knows quantum computing, explain the period-finding subroutine. Otherwise, treat as a black box.

### When to Stay High-Level
- **Chinese Remainder Theorem proof** — State and apply in lesson 6, but don't prove constructively unless student asks. The constructive proof is beautiful but tangential.
- **AKS primality test** — Mention it exists (first polynomial-time deterministic test, 2002) but don't explain. Miller-Rabin is practical enough.
- **Pollard's p-1 and quadratic sieve** — Too algorithmic for intermediate level. Mention that better factoring methods exist, but Pollard's rho is sufficient for understanding.
- **Lattice-based cryptography** — Survey only in lesson 27. Full treatment requires advanced linear algebra.

### Unexpected Connections
- **Birthday paradox and Pollard's rho** — Collision detection in random walks. Great for students interested in probability.
- **Cryptography in blockchain** — RSA isn't used (ECDSA is standard), but discrete log problem is the same foundation. Mention Bitcoin if student is motivated by crypto(currency).
- **Zero-knowledge proofs** — Based on discrete log hardness. Preview of where the field is going.

## Engagement Hooks

- **Lesson 1**: Start with "Why does RSA secure your credit card?" Show the lock icon in a browser.
- **Lesson 9**: "Fermat discovered this in 1640. He had no idea it would enable internet shopping 350 years later."
- **Lesson 16**: "You're about to implement the same algorithm that protects trillions of dollars in online transactions."
- **Lesson 21**: "If you can factor this 300-digit number, you win $100,000 (RSA Factoring Challenge)."
- **Lesson 27**: "Google is already deploying post-quantum cryptography. You're learning math that will matter in 5 years."

## Assessment Checkpoints

- **After lesson 4**: Can student implement Euclidean algorithm without hints?
- **After lesson 10**: Can student prove Euler's Theorem, or at least explain the intuition?
- **After lesson 16**: Can student generate RSA keys and encrypt/decrypt a message from scratch?
- **After lesson 22**: Can student explain why factoring is the bottleneck for RSA security?
- **After lesson 27**: Can student compare RSA, Diffie-Hellman, and elliptic curves on security and efficiency?

If student breezes through lessons 1-10, accelerate: combine lessons or skip to RSA earlier. If student struggles with Euler's Theorem, insert an extra review day with worked examples before lesson 11.
