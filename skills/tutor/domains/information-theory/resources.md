# Information Theory — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Elements of Information Theory (2nd Edition)** by Thomas M. Cover and Joy A. Thomas
  - The canonical reference for information theory
  - Rigorous, comprehensive, graduate-level treatment
  - Excellent for students who want mathematical depth
  - Covers: entropy, source coding, channel coding, rate-distortion, network information theory
  - Amazon: https://www.amazon.com/Elements-Information-Theory-Telecommunications-Processing/dp/0471241954
  - Best for: Proofs, complete coverage, reference material

- **Information Theory, Inference, and Learning Algorithms** by David J.C. MacKay
  - More accessible alternative to Cover & Thomas
  - Richly illustrated with over 400 exercises (many with solutions)
  - Strong connections to Bayesian inference, machine learning, and coding theory
  - Free PDF available from author's website
  - Amazon: https://www.amazon.com/Information-Theory-Inference-Learning-Algorithms/dp/0521642981
  - Best for: Self-study, visual learners, ML practitioners

### University Course Materials

- **MIT 6.441: Information Theory** (Spring 2016)
  - Taught by Yury Polyanskiy and Yihong Wu
  - Complete lecture notes, problem sets, and solutions via MIT OpenCourseWare
  - Covers both classical theory and modern topics (finite blocklength)
  - Graduate-level rigor
  - Course page: https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/
  - Lecture notes PDF: https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/resources/mit6_441s16_course_notes/
  - Syllabus: https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/syllabus/
  - Individual lecture notes: https://ocw.mit.edu/courses/6-441-information-theory-spring-2016/pages/lecture-notes/
  - Best for: Complete course materials, problem sets with solutions, rigorous treatment

- **Stanford EE 376A: Information Theory**
  - Taught by Tsachy Weissman
  - Lecture notes available as PDF
  - First 2/3 on core concepts, last 1/3 on applications to statistics
  - Course page: https://web.stanford.edu/class/ee376a/
  - Lecture notes PDF: https://web.stanford.edu/class/ee376a/files/scribes/lecture_notes.pdf
  - Related course: https://tselab.stanford.edu/mirror/ee376a_winter1617/
  - Best for: Clean lecture notes, statistics connections

- **Stanford EE 276: Information Theory**
  - Alternative Stanford course
  - Course page: https://web.stanford.edu/class/ee276/
  - Best for: Additional perspective on same material

- **UMass COMPSCI 650: Applied Information Theory**
  - Application-focused course
  - Practical examples and implementations
  - Course page: https://people.cs.umass.edu/~arya/courses/650/CS650-2016.html
  - Resource list: https://www.umsl.edu/~siegelj/information_theory/resources.html
  - Best for: Applied perspective, computational implementations

## Supplementary Resources (for engagement)

### Video Lectures

- **David MacKay's Information Theory Lectures** (University of Cambridge)
  - Engaging, intuitive presentations by a master teacher
  - Covers information theory, pattern recognition, and neural networks
  - Available on YouTube
  - Lecture 1: https://www.youtube.com/watch?v=BCiZc0n6COY
  - Best for: Building intuition, seeing concepts in action, humor and personality

### Interactive Tools & Visualizations

- **Visual Information Theory** by Christopher Olah (colah's blog)
  - Comprehensive visual guide with interactive diagrams
  - Covers entropy, cross-entropy, KL divergence with beautiful visualizations
  - Accessible to intermediate students
  - URL: https://colah.github.io/posts/2015-09-Visual-Information/
  - Best for: Visual intuition, interactive exploration, seeing concepts geometrically

- **A Visual Introduction to Information Theory**
  - Academic paper (arXiv) with visual, intuition-driven approach
  - Shows how entropy, mutual information, and channel capacity follow from probability
  - arXiv: https://arxiv.org/abs/2206.07867
  - HTML version: https://arxiv.org/html/2206.07867v3
  - Best for: Geometric intuition, visual proofs

- **Shannon Entropy Interactive Calculator** by TensorTonic
  - Interactive tool for learning entropy formula
  - Calculate bits, explore uniform distributions, understand maximum entropy
  - URL: https://www.tensortonic.com/ml-math/information-theory/shannon-entropy
  - Best for: Hands-on computation, exploring examples

- **AllTheSystems Entropy Visualizer**
  - Interactive simulator for randomness and cryptographic strength
  - Visualizes entropy in different contexts
  - URL: https://allthesystems.com/entropy-visualizer-simulator/
  - Best for: Cryptographic applications, randomness testing

- **Information Entropy Visualizer** by Constraint Theory
  - Signal vs. noise visualization
  - Uncertainty measurement tools
  - URL: https://constraint-theory.superinstance.ai/simulators/entropy
  - Best for: Signal processing perspective

- **Information Theory Fundamentals** by Nima Sarang
  - Blog post covering entropy, cross-entropy, KL divergence, Jensen-Shannon divergence
  - Mathematical foundations with practical examples
  - URL: https://nimasarang.com/blog/2024-08-24-information-theory/
  - Best for: Quick reference, ML perspective

### Online Collections

- **Online Lectures in Information Theory** (curated list)
  - Aggregates video lectures and courses from multiple sources
  - URL: https://boffosocko.com/2016/04/09/online-lectures-in-information-theory/
  - Best for: Finding additional video resources

## Code, Repos, and Implementations

- **Huffman Coding Implementations**
  - Available in most programming languages on GitHub
  - Search: "huffman coding [your language]"
  - Best for: Hands-on practice with source coding

- **Error-Correcting Code Libraries**
  - Python: `reedsolo` (Reed-Solomon), `pyldpc` (LDPC codes)
  - Best for: Channel coding experiments

- **Information Theory in Python**
  - `scipy.stats.entropy` for entropy calculations
  - `dit` library for discrete information theory
  - Best for: Computational experiments

## People to Follow

### Historical Figures
- **Claude Shannon** (1916-2001) — Founder of information theory, 1948 paper "A Mathematical Theory of Communication"
- **Thomas Cover** (1938-2012) — Co-author of canonical textbook, contributed to universal portfolios, hypothesis testing
- **David MacKay** (1967-2016) — Made information theory accessible, connected to ML and inference

### Contemporary Researchers
- **Yury Polyanskiy** (MIT) — Finite blocklength theory, modern information theory
- **Tsachy Weissman** (Stanford) — Information theory for statistics and ML
- **Christopher Olah** — Visual explanations for technical concepts (now at Anthropic)
- **Andrea Goldsmith** (Stanford/Princeton) — Wireless communications, information theory applications
- **Erdal Arıkan** (Bilkent University) — Invented polar codes (capacity-achieving codes)

## Unexpected Cross-Discipline Connections

### Physics
- **Thermodynamic entropy and information**: Landauer's principle (erasing information generates heat), Maxwell's demon
- **Black hole entropy**: Bekenstein-Hawking formula connects information to gravity
- **Quantum information theory**: Qubits, entanglement, quantum channels

### Biology
- **DNA as code**: Genetic code has error-correction properties
- **Neural coding**: How neurons encode information in spike trains
- **Molecular information theory**: Information flow in cells

### Finance
- **Portfolio theory**: Cover's universal portfolio uses information theory
- **Market efficiency**: Mutual information between asset returns
- **Risk measures**: Entropy as a measure of uncertainty in returns

### Machine Learning
- **Cross-entropy loss**: Training neural networks minimizes KL divergence
- **Variational autoencoders**: ELBO maximizes mutual information
- **Information bottleneck**: Tradeoff between compression and prediction
- **Minimum description length**: Model selection via compression

### Linguistics
- **Natural language statistics**: Zipf's law, entropy of English
- **Language models**: Perplexity as 2^entropy
- **Compression and language understanding**: Better compressors = better language models

### Neuroscience
- **Neural information processing**: Mutual information between stimulus and response
- **Efficient coding hypothesis**: Brains minimize redundancy, maximize information
- **Predictive coding**: Brain as Bayesian compressor

## Additional Reading

- **Shannon's original 1948 paper**: "A Mathematical Theory of Communication" — still readable and insightful
- **Scientific American article** by Shannon (1949) — Accessible introduction for general audience
- **The Information: A History, A Theory, A Flood** by James Gleick — Popular science book on information and Shannon's life

## Journal and Conference Resources

- **IEEE Transactions on Information Theory** — Premier journal in the field
- **ISIT (International Symposium on Information Theory)** — Annual conference
- **Entropy (MDPI journal)** — Open-access journal, see special issue on visualization: https://www.mdpi.com/journal/entropy/special_issues/Visualization
