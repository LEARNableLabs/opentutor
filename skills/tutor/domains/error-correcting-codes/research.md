# Error-Correcting Codes — Research Summary

## Major Subtopics

### 1. Foundations of Error Correction
- Binary symmetric channel, error models, Shannon's theorem
- Hamming distance, minimum distance, error detection vs. correction bounds
- Perfect codes, Singleton bound, Hamming bound, Gilbert-Varshamov bound

### 2. Linear Block Codes
- Generator and parity-check matrices
- Hamming codes (classical 7,4 and generalizations)
- Syndrome decoding
- Dual codes, weight enumerators

### 3. Cyclic Codes
- Polynomial representation, generator polynomials
- BCH codes (Bose-Chaudhuri-Hocquenghem)
- Reed-Solomon codes (widely used in practice)
- Fire codes

### 4. Convolutional Codes
- Shift-register encoders, trellis representation
- Viterbi decoding algorithm
- Turbo codes (iterative decoding)

### 5. Modern Codes
- LDPC codes (Low-Density Parity-Check)
- Sparse graph representation, belief propagation
- Performance near Shannon limit
- Irregular LDPC codes

### 6. Applications
- Storage systems (CDs, DVDs, SSDs)
- Communications (WiFi, 5G, satellite)
- QR codes and barcodes
- Deep space communications

## Key Sources

### Textbooks
- **"Error Correcting Codes" by W. Wesley Peterson and E.J. Weldon Jr.** — classic comprehensive reference
- **"The Theory of Error-Correcting Codes" by MacWilliams and Sloane** — encyclopedic treatment, algebraic focus
- **"Introduction to Coding Theory" by J.H. van Lint** — accessible intermediate text
- **"Modern Coding Theory" by Tom Richardson and Rüdiger Urbanke** — LDPC and iterative decoding focus

### Video Resources
- **MIT 6.02 Digital Communication Systems** — comprehensive lecture series covering error correction
- **Stanford EE387 course** — algebraic coding theory
- **Khan Academy circuits** — introductory parity and error detection

### Interactive Tools
- **Sage Math coding theory modules** — computational exploration
- **Online Hamming code visualizers** — encode/decode demonstrations
- **LDPC simulation tools** — belief propagation animations

### Research Papers (Historical)
- Shannon (1948) — "A Mathematical Theory of Communication"
- Hamming (1950) — "Error Detecting and Error Correcting Codes"
- Gallager (1962) — "Low-Density Parity-Check Codes" (LDPC origin)
- MacKay and Neal (1996) — LDPC rediscovery

## Available Resources

### Open Courseware
- MIT OCW 6.02 (Digital Communication Systems)
- Stanford EE387 (Algebraic Coding Theory)
- NPTEL courses on coding theory (Indian institutes)

### Software/Tools
- Sage Math (coding theory package)
- GNU Radio (software-defined radio with FEC modules)
- CommPy (Python communications toolkit)
- IT++ (C++ library for communications)

### Historical Context
Error-correcting codes emerged from Shannon's 1948 information theory work, which proved reliable communication was possible over noisy channels. Hamming developed the first practical codes in 1950 while at Bell Labs. The field matured through the 1960s-70s with algebraic codes (BCH, Reed-Solomon). LDPC codes, invented by Gallager in 1962, were forgotten until rediscovered in the 1990s and now dominate modern systems (WiFi, 5G, deep space).

## Learning Path Notes

For intermediate students:
- Assume comfort with linear algebra (vector spaces, matrices)
- Introduce finite field arithmetic gradually (start with binary, build to GF(q))
- Balance theory (bounds, proofs) with practice (encoding/decoding algorithms)
- Use real-world applications to motivate abstract concepts
- Computational tools help build intuition before diving into algebra
