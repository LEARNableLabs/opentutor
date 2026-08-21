# Error-Correcting Codes — Resources

## Primary Sources (for lesson content)

### Textbooks

- **"Introduction to Coding Theory" by J.H. van Lint** (1999) — Accessible intermediate-level text with clear proofs and good exercises. Covers Hamming through BCH codes thoroughly. Great balance of theory and practice.

- **"Error Control Coding" by Shu Lin and Daniel J. Costello** (2004) — Comprehensive engineering-focused textbook. Strong on practical implementation details. Covers convolutional, turbo, and LDPC codes extensively.

- **"The Theory of Error-Correcting Codes" by F.J. MacWilliams and N.J.A. Sloane** (1977) — Encyclopedic reference, more advanced. Deep algebraic treatment. Consult for proofs and historical completeness.

- **"Modern Coding Theory" by Tom Richardson and Rüdiger Urbanke** (2008) — Focuses on LDPC codes, iterative decoding, and density evolution. Best resource for understanding near-capacity codes.

### Online Courses

- **MIT 6.02 Digital Communication Systems** (Fall 2012) — https://ocw.mit.edu/courses/6-02-introduction-to-eecs-ii-digital-communication-systems-fall-2012/ — Complete course with lectures, notes, and labs. Covers foundations through LDPC codes. Excellent Python implementations.

- **Stanford EE 387 Algebraic Coding Theory** — https://web.stanford.edu/class/ee387/ — Graduate-level course covering cyclic codes, BCH, Reed-Solomon in depth. Strong on finite field algebra.

- **NPTEL Coding Theory** (various Indian institutes) — https://nptel.ac.in/courses/117/106/117106137/ — Free video lectures covering foundations, linear codes, cyclic codes. Good supplementary resource.

## Supplementary (for engagement)

### Videos

- **3Blue1Brown: Hamming Codes** — https://www.3blue1brown.com/lessons/hamming-codes — Beautiful visual explanation of Hamming(7,4) using dimensional geometry. Essential viewing.

- **Ben Eater: Error detection** — https://www.youtube.com/watch?v=X8jsijhllIA — Hardware engineer explains parity and checksums with breadboard demonstrations. Great for visual learners.

- **Computerphile: Reed-Solomon Codes** — https://www.youtube.com/watch?v=fBRMaEAFLE0 — Practical explanation of how QR codes and CDs use RS codes. Accessible presentation.

- **Art of the Problem: Information Theory series** — https://www.youtube.com/watch?v=2s3aJfRr9gE — Context on Shannon's work and channel capacity. Good motivation before diving into coding.

### Interactive Tools

- **Sage Math Coding Theory Package** — https://doc.sagemath.org/html/en/reference/coding/index.html — Computational exploration of linear codes, cyclic codes, BCH, RS. Can construct and test codes interactively.

- **Hamming Code Visualizer** — https://www.cs.cmu.edu/~guyb/realworld/error_correction.html — Step through encoding and decoding Hamming(7,4). Flip bits and watch syndrome decoding recover them.

- **CRC Calculator** — https://crccalc.com/ — Online tool to compute CRC checksums with various polynomials. Experiment with different data and polynomials.

- **CommPy (Python)** — https://github.com/veeresht/CommPy — Communications toolkit implementing many codes: Hamming, cyclic, convolutional, turbo, LDPC. Good for hands-on learning.

### Code & Implementations

- **Reed-Solomon Python implementation** — https://github.com/tomerfiliba/reedsolomon — Pure Python RS encoder/decoder with detailed comments. Great for understanding the algorithm.

- **GNU Radio** — https://www.gnuradio.org/ — Software-defined radio framework with FEC blocks. Can build real communication systems with error correction.

- **IT++ (C++)** — http://itpp.sourceforge.net/ — Signal processing and communications library with extensive coding support.

- **AFF3CT (A Fast Forward Error Correction Toolbox)** — https://aff3ct.github.io/ — Modern C++ toolbox for simulating and benchmarking codes. Turbo, LDPC, polar codes.

### Papers (Historical Landmarks)

- **Shannon (1948): "A Mathematical Theory of Communication"** — https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf — The founding paper of information theory. Essential context.

- **Hamming (1950): "Error Detecting and Error Correcting Codes"** — https://ieeexplore.ieee.org/document/6772729 — The original Hamming code paper. Readable and historically fascinating.

- **Gallager (1962): "Low-Density Parity-Check Codes"** — https://web.stanford.edu/class/ee388/papers/ldpc.pdf — Gallager's MIT PhD thesis introducing LDPC codes, forgotten for 30 years.

- **Berrou, Glavieux, Thitimajshima (1993): "Near Shannon Limit Error-Correcting Coding: Turbo Codes"** — Turbo codes paper that shocked the field.

## People (to Follow)

- **Robert Gallager** — Invented LDPC codes, co-invented network protocols, MIT professor emeritus. His 1968 textbook "Information Theory and Reliable Communication" is a classic.

- **Claude Shannon** — Father of information theory. His 1948 paper established the field.

- **Richard Hamming** — Invented Hamming codes while at Bell Labs. His book "The Art of Doing Science and Engineering" is filled with insights.

- **Erdal Arıkan** — Invented polar codes (2008), which achieve Shannon capacity with explicit construction. Used in 5G.

- **Tom Richardson and Rüdiger Urbanke** — Modern LDPC code pioneers. Their textbook is the definitive reference.

- **David MacKay** — Rediscovered LDPC codes independently. His book "Information Theory, Inference, and Learning Algorithms" (free online) connects coding theory to machine learning.

## Unexpected Connections

- **Error correction ↔ Cryptography** — Codes add redundancy; ciphers remove it. McEliece cryptosystem uses Goppa codes (algebraic geometry codes). Post-quantum cryptography candidate.

- **Error correction ↔ Compressed sensing** — LDPC-like sparse structures appear in signal reconstruction. Expander graphs bridge both fields.

- **Error correction ↔ Distributed storage** — Erasure codes (Reed-Solomon variants) underpin RAID systems, Dropbox, Amazon S3. Fountain codes enable rateless transmission.

- **Error correction ↔ DNA storage** — Emerging DNA data storage uses RS codes to handle biochemical errors. Sequencing errors are burst-like, perfect for RS.

- **Error correction ↔ Quantum computing** — Quantum error correction uses stabilizer codes (generalization of classical linear codes). Surface codes are hot topic.

- **Golay codes ↔ Sporadic groups** — The binary Golay(24,12) code has automorphism group M24 (Mathieu group), a sporadic simple group. Deep connection to finite geometry.

## Domain-Specific Applications

### Storage Systems
- **CDs/DVDs**: Cross-interleaved Reed-Solomon codes (CIRC)
- **QR Codes**: Reed-Solomon with up to 30% error tolerance
- **Hard drives/SSDs**: BCH or LDPC codes in controller firmware
- **RAID**: Erasure codes (Reed-Solomon, fountain codes)

### Wireless Communications
- **WiFi (802.11)**: Convolutional codes (older), LDPC (802.11n/ac/ax)
- **5G NR**: LDPC for data channels, polar codes for control channels
- **Satellite**: Concatenated codes (RS outer, convolutional inner)
- **Bluetooth**: Shortened Hamming codes

### Deep Space
- **Voyager**: Concatenated Golay(24,12) and convolutional codes
- **Mars rovers**: Turbo codes, LDPC codes
- **JPL Deep Space Network**: https://descanso.jpl.nasa.gov/ — detailed reports on codes used for each mission

### Emerging
- **DNA storage**: Reed-Solomon and fountain codes
- **Optical communications**: LDPC codes
- **Quantum key distribution**: Cascade protocol for error reconciliation
