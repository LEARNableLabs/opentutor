# Information Theory — Concept Map

## Core Concepts (in learning order)

1. **Information content** — The "surprise" or unexpectedness of an event; measured in bits
2. **Shannon entropy** — Average information content of a random variable; measures uncertainty. Depends on: information content
3. **Joint entropy** — Entropy of multiple random variables together. Depends on: Shannon entropy
4. **Conditional entropy** — Uncertainty remaining about one variable given another. Depends on: joint entropy
5. **Mutual information** — How much knowing one variable reduces uncertainty about another. Depends on: conditional entropy, joint entropy
6. **KL divergence** — Measure of distance between two probability distributions; relative entropy. Depends on: Shannon entropy
7. **Data processing inequality** — Information cannot be created by processing; only lost or preserved. Depends on: mutual information
8. **Lossless compression** — Encoding data without losing any information. Depends on: Shannon entropy
9. **Prefix-free codes** — Codes where no codeword is a prefix of another; enables unique decoding. Depends on: lossless compression
10. **Kraft inequality** — Constraint on codeword lengths for prefix-free codes. Depends on: prefix-free codes
11. **Huffman coding** — Optimal prefix-free code construction algorithm. Depends on: Kraft inequality, prefix-free codes
12. **Typical sequences** — Sequences with probability close to 2^(-nH); form the bulk of likely outcomes. Depends on: Shannon entropy
13. **Source coding theorem** — Expected code length ≥ entropy; achievable with block coding. Depends on: typical sequences, Huffman coding
14. **Universal coding** — Compression without knowing the source distribution. Depends on: source coding theorem
15. **Noisy channel** — Communication medium that introduces errors with some probability. Depends on: conditional probability
16. **Channel capacity** — Maximum mutual information achievable over a channel. Depends on: mutual information, noisy channel
17. **Binary symmetric channel** — Channel that flips each bit with probability p. Depends on: noisy channel, channel capacity
18. **Channel coding theorem** — Reliable communication possible below capacity, impossible above. Depends on: channel capacity, typical sequences
19. **Error-correcting codes** — Codes that add redundancy to detect and correct errors. Depends on: channel coding theorem
20. **Rate-distortion function** — Minimum rate needed to compress with given average distortion. Depends on: mutual information
21. **Quantization** — Mapping continuous or fine-grained values to discrete levels. Depends on: rate-distortion function
22. **Rate-distortion theorem** — Fundamental limit for lossy compression. Depends on: rate-distortion function
23. **Differential entropy** — Entropy analog for continuous random variables. Depends on: Shannon entropy
24. **Gaussian channel** — Channel with additive Gaussian noise; worst-case for additive noise. Depends on: differential entropy, channel capacity
25. **Multiple access channel** — Multiple senders, one receiver. Depends on: channel capacity
26. **Information theory in ML** — Cross-entropy loss, KL regularization, mutual information maximization. Depends on: KL divergence, conditional entropy

## Dependencies

### Foundational Chain
- **Conditional entropy** requires understanding **joint entropy** because it measures the difference between joint entropy and marginal entropy
- **Mutual information** builds on **conditional entropy** because I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)
- **Data processing inequality** follows from properties of **mutual information** because processing forms a Markov chain

### Source Coding Chain
- **Kraft inequality** constrains **prefix-free codes** because it characterizes when a set of code lengths can correspond to a valid prefix-free code
- **Huffman coding** uses the **Kraft inequality** to construct optimal codes by assigning shorter codewords to more probable symbols
- **Source coding theorem** relies on **typical sequences** because block coding focuses on encoding only the typical set
- **Universal coding** extends **source coding theorem** by adapting to unknown source statistics

### Channel Coding Chain
- **Channel capacity** maximizes **mutual information** over input distributions for a given channel
- **Channel coding theorem** uses **typical sequences** through joint typicality to prove achievability
- **Error-correcting codes** implement the **channel coding theorem** by spreading information across redundant symbols

### Rate-Distortion Chain
- **Rate-distortion function** minimizes **mutual information** subject to a distortion constraint
- **Quantization** is a practical implementation of concepts from **rate-distortion theory**
- **Rate-distortion theorem** is the lossy compression analog of the source coding theorem

### Advanced Extensions
- **Differential entropy** extends **Shannon entropy** to continuous variables but loses some properties (can be negative)
- **Gaussian channel** combines **differential entropy** and **channel capacity** for continuous alphabets
- **Multiple access channel** extends single-user **channel capacity** to multi-user scenarios

## Bottleneck Concepts

These concepts are critical waypoints — if a student doesn't solidify these, later material becomes very difficult:

1. **Shannon entropy** — Everything flows from understanding entropy as expected information
2. **Mutual information** — Central to both source coding and channel coding theorems
3. **Typical sequences** — The key insight that makes both coding theorems work
4. **Channel capacity** — The single most important number for any communication system
5. **Source coding theorem** — First major result showing entropy as a fundamental limit

## Mind-Blowing Moments

Points where students often experience "aha!" moments:

1. **Entropy as compression limit** — "So that's why you can't compress random data!"
2. **Channel coding theorem** — "Wait, we can communicate perfectly reliably over a noisy channel just by sending slower?"
3. **Typical set** — "Most of probability mass concentrates on a tiny fraction of possible sequences"
4. **Data processing inequality** — "You can't create information by clever processing — it's a one-way street"
5. **Mutual information symmetry** — "I(X;Y) = I(Y;X) means information is truly symmetric"
6. **Gaussian channel as worst-case** — "The smoothest noise is actually the hardest to deal with"

## Common Misconceptions

1. **"High entropy means high information"** — High entropy means high uncertainty; actual information gained depends on what you learn
2. **"You can always compress below entropy"** — No! Entropy is the fundamental limit for lossless compression
3. **"Huffman is always optimal"** — Only optimal for symbol-by-symbol coding; block codes can do better
4. **"Channel capacity is the maximum data rate"** — It's the maximum *reliable* rate; you can send faster but with errors
5. **"Differential entropy is just entropy for continuous variables"** — No! It can be negative and doesn't have the same properties
6. **"More redundancy always improves error correction"** — There's a tradeoff; too much redundancy wastes rate
7. **"Mutual information requires causation"** — No! I(X;Y) is symmetric and purely about correlation/dependence

## Prerequisite Topics

- **Probability theory** — needed for: all entropy measures, typical sequences, channel models
- **Discrete random variables** — needed for: entropy, mutual information, source coding
- **Expectation and variance** — needed for: entropy calculations, distortion measures
- **Logarithms (especially base 2)** — needed for: entropy formulas, bit calculations
- **Inequalities (Jensen's, Markov's)** — needed for: proving properties of entropy and mutual information
- **Basic optimization** — needed for: channel capacity (maximizing mutual information), rate-distortion function
- **Markov chains** — needed for: data processing inequality, channel models
- **Calculus** — needed for: differential entropy, Gaussian channels, optimization
- **Linear algebra** — needed for: vector quantization, multiple access channels, error-correcting codes

## Advanced Extensions

- **Network information theory** — Multi-hop, multi-user, interference channels
- **Finite blocklength theory** — Non-asymptotic analysis of coding
- **Polar codes** — Practical capacity-achieving codes
- **Information theory in statistics** — Hypothesis testing, parameter estimation
- **Quantum information theory** — Qubits, entanglement, quantum channels
- **Information theory in machine learning** — Variational autoencoders, information bottleneck, neural compression
