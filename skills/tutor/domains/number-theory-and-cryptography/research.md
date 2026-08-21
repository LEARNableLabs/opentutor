# Number Theory and Cryptography — Research Summary

## Major Subtopics

### Foundational Number Theory
- Divisibility theory, primes and their distribution
- Theory of congruences and modular arithmetic
- Euclidean algorithm and the extended Euclidean algorithm
- Euler's phi function (totient function)
- Fermat's Little Theorem and Euler's Theorem
- Primitive roots and discrete logarithms
- Quadratic reciprocity, Legendre and Jacobi symbols
- Chinese Remainder Theorem

### Cryptographic Applications
- Classical cryptography (substitution, transposition, Hill cipher)
- Public key cryptography fundamentals
- RSA cryptosystem (key generation, encryption/decryption, security)
- Primality testing (Fermat test, Miller-Rabin, AKS)
- Factorization algorithms (trial division, Pollard's rho, quadratic sieve)
- Discrete logarithm problem
- Diffie-Hellman key exchange
- ElGamal encryption
- Digital signatures (RSA signatures, DSA)
- Elliptic curve cryptography (basics)
- Hash functions and their role in cryptography
- Post-quantum cryptography considerations

## Key Sources

### Textbooks
- **"A Course in Number Theory and Cryptography" by Neal Koblitz** — Graduate-level standard, covers elementary number theory, finite fields, quadratic residues, public key systems, primality and factoring, elliptic curves
  - Available: http://almuhammadi.com/sultan/crypto_books/Koblitz.2ndEd.pdf

- **"An Introduction to Number Theory with Cryptography" by Kraft & Washington** — Undergraduate-friendly integration of cryptography with traditional number theory

- **"Lecture notes Number Theory and Cryptography" by Matt Kerr (Washington University)** — Comprehensive lecture notes
  - Available: https://www.math.wustl.edu/~matkerr/NTCbook.pdf

### Online Courses
- **Coursera: "Number Theory and Cryptography"** (UC San Diego) — Starts with basics, covers cryptographic protocols, teaches RSA encryption/decryption
  - URL: https://www.coursera.org/learn/number-theory-cryptography

- **Stanford Online: "Cryptography I"** — Inner workings of cryptographic systems with programming projects
  - URL: https://www.coursera.org/learn/crypto

- **YouTube: "Number Theory and Cryptography Complete Course"** — Discrete Mathematics for Computer Science
  - URL: https://www.youtube.com/watch?v=AbjhsGnKEtE

- **IIT Kharagpur: Prof. Debdeep Mukhopadhyay** — Introduction to Number Theory video lectures
  - URL: https://freevideolectures.com/course/3027/cryptography-and-network-security/3

### Interactive Resources
- **Number Theory: In Context and Interactive** (Karl-Dieter Crisman, Gordon College) — Free textbook with SageMath integration for visualization
  - URL: https://math.gordon.edu/ntic/

- **Number Theory: Visual Explorer** — Mobile app with 25+ interactive tools including full RSA simulation
  - URL: https://play.google.com/store/apps/details?id=com.vinodsigadana030.numbertheory

- **explained-from-first-principles.com/number-theory/** — Interactive visualizations of extended Euclidean algorithm, Miller-Rabin primality test, Tonelli-Shanks algorithm
  - URL: https://explained-from-first-principles.com/number-theory/

- **CrypTool** — Open-source cryptography education software with interactive modules for RSA, AES, DES

- **SageMath** — Python-based environment for number theory experiments, elliptic curve cryptography, modular arithmetic

### University Course Materials
- **University of Houston MATH 4383** — Number Theory and Cryptography syllabus
  - URL: https://www.uh.edu/nsm/math/undergraduate/courses/math4383/index.php

- **University of Florida MAT4930** — Number Theory and Mathematical Cryptography syllabus
  - URL: https://syllabus.math.ufl.edu/wp-content/uploads/sites/133/king-j-mat4930-spring-1-12-16-htm.pdf

- **University of Minnesota Math 5248** — Cryptology and Number Theory
  - URL: https://www-users.cse.umn.edu/~musiker/5248/Syllabus.pdf

- **Columbia University UN3020** — Number Theory and Cryptography
  - URL: https://daniele-math.github.io/Courses/NumberTheory-s2023/Syllabus.pdf

### Additional Resources
- **GeeksforGeeks: Number Theory Used in Cryptography** — Practical tutorials
  - URL: https://geeksforgeeks.org/number-theory-used-in-cryptography

- **GitHub: cryptography-resources** — Curated free online resources
  - URL: https://github.com/foolOnTheHill/cryptography-resources

- **numbertheory.org** — Links to online courses, videos, and lectures
  - URL: http://www.numbertheory.org/ntw/lecture_notes.html

- **Class Central** — 2200+ number theory courses aggregated
  - URL: https://www.classcentral.com/subject/number-theory

## Target Student Profile

**Level:** Intermediate
**Prerequisites:** Comfortable with proof-based mathematics, familiar with modular arithmetic basics, some programming experience helpful
**Goals:** Understand the mathematical foundations of modern cryptography, implement cryptographic algorithms, analyze security of cryptosystems

## Pedagogical Considerations

This topic bridges pure mathematics and applied computer science. The intermediate level demands:
- Rigorous proofs for theorems (not just recipes)
- Hands-on implementation (coding RSA, primality tests)
- Security analysis (attack scenarios, why certain parameters matter)
- Balance between theory (why RSA works) and practice (how to break weak RSA)

The material naturally divides into a "ladder" structure: each number-theoretic result builds toward a cryptographic application. Review lessons should include both proof reconstruction and code implementation challenges.
