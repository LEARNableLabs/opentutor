# Information Retrieval and Search Engines — Teaching Notes

## Approach

Information retrieval is a **build-to-understand** domain. The core concepts (inverted index, TF-IDF, ranking) seem simple in lecture but only click when students implement them. Start with hands-on: build a toy search engine on day one (even just Boolean search over 10 documents). This grounds all subsequent theory in something concrete they've touched.

Balance three modes: (1) **conceptual** (why does this work?), (2) **mathematical** (what's the formula?), and (3) **practical** (how do I code it?). Intermediate students can handle all three, but always lead with intuition before formalism.

The field has a beautiful arc from simple (Boolean search) to sophisticated (neural ranking), and every technique builds on the last. Respect this progression — don't skip to BERT embeddings before students understand why cosine similarity matters.

## Common Misconceptions

### 1. "Inverted Index is Just a Reverse Lookup Table"
**Why students think this**: The name suggests simple reversal.

**Reality**: An inverted index is a compressed, optimized data structure with positional information, skip pointers, and sophisticated merge algorithms. It's not just `{term: [doc1, doc2]}`.

**How to correct**: Have them implement one from scratch. They'll discover the complexity when handling updates, compression, and query processing.

### 2. "TF-IDF Measures Relevance"
**Why students think this**: It's used for ranking, so it must be relevance, right?

**Reality**: TF-IDF measures **term importance** based on frequency patterns. Relevance requires understanding user intent, which TF-IDF knows nothing about. A document full of the query term but off-topic will score high.

**How to correct**: Show adversarial examples (spam, keyword stuffing). Emphasize TF-IDF is a heuristic, not ground truth.

### 3. "Higher Precision is Always Better"
**Why students think this**: More relevant results = better system.

**Reality**: Precision/recall trade-off is fundamental. A system returning only 1 perfect result has 100% precision but terrible recall. Real systems must balance.

**How to correct**: Give them a concrete task ("find all papers on topic X for a literature review") where recall matters more. Then switch tasks ("find the one official documentation page") where precision dominates.

### 4. "PageRank is About Counting Links"
**Why students think this**: More links → higher rank seems intuitive.

**Reality**: PageRank is about **link quality** and the **random walk probability**. A single link from a high-authority page beats 100 links from spam sites.

**How to correct**: Work through the random walk interpretation. Have them compute PageRank by hand on a tiny graph (5 nodes) to see how authority propagates.

### 5. "BM25 is Better Than Vector Space Model"
**Why students think this**: BM25 is newer and has tunable parameters.

**Reality**: "Better" depends on task, data, and implementation. Vector space with good preprocessing can outperform BM25 on some corpora. No universal winner.

**How to correct**: Have them run experiments on multiple test collections. Show that model choice matters less than good preprocessing, relevance feedback, and query understanding.

### 6. "Neural IR Replaces Classical IR"
**Why students think this**: Deep learning hype + "old vs new" framing.

**Reality**: Production search systems use **hybrid approaches**. BM25 for first-stage retrieval (fast, interpretable), neural models for re-ranking (slow, accurate). You need both.

**How to correct**: Discuss latency and cost constraints. Show benchmarks where BERT re-ranking boosts BM25 baseline but can't replace it entirely.

### 7. "Stemming Improves Recall"
**Why students think this**: Conflating 'running' and 'run' finds more documents.

**Reality**: Aggressive stemming can **hurt precision** by conflating unrelated terms ('universal' → 'universe', 'policy' → 'police' in some stemmers). It's a precision/recall trade-off.

**How to correct**: Demonstrate over-stemming errors. Have them experiment with Porter vs. Krovetz vs. no stemming on a test collection.

### 8. "Evaluation Metrics Are Objective"
**Why students think this**: Numbers don't lie!

**Reality**: Metrics depend on **subjective relevance judgments**. What's relevant to one user may not be to another. TREC judgments are pooled and incomplete.

**How to correct**: Discuss inter-annotator agreement. Show cases where judges disagree. Emphasize evaluation is a proxy, not ground truth.

## Level Adjustments

### For Intermediate Learners (This Curriculum)

- **Assume**: Comfortable with programming, data structures (hash tables, arrays, heaps), basic probability (conditional probability, Bayes' rule), vector dot products.
- **Emphasize**: Implementation and experimentation. They should code inverted index, BM25, evaluation metrics from scratch before using libraries.
- **Depth**: Full mathematical derivations for key models (BM25, language models, PageRank). Skip proofs but show the formulas.
- **Formalism**: Use precise notation but explain it. Don't assume familiarity with probabilistic notation.
- **Tools**: Introduce Lucene/Elasticsearch/PyTerrier after building basics by hand. Tools make sense only after understanding what they automate.

### If Teaching Beginners

- Skip language models and neural IR entirely.
- More time on Boolean retrieval and basic ranked retrieval (TF-IDF).
- Less math, more analogies (TF-IDF as "rare words matter more").
- Pre-built tools (Elasticsearch) earlier to build motivation.

### If Teaching Advanced Learners

- Assume linear algebra fluency (eigenvalues, matrix factorization).
- Deep dive into neural IR: BERT, T5, dense retrieval, hard negatives, dual encoders.
- Learning to rank with gradient boosting and neural networks.
- Research papers, not just textbooks.
- Implement a state-of-the-art model, not just classics.

## Rabbit Holes (Fascinating Connections)

### 1. PageRank and Linear Algebra
**Connection**: PageRank is the eigenvector of the link matrix. Same math as Google's original algorithm, quantum mechanics (stationary states), and Markov chains.

**When to drop**: After lesson 22 (link analysis). If student has linear algebra background, show the eigenvalue formulation. Beautiful unification.

### 2. Information Retrieval and Quantum Mechanics
**Connection**: Vector space model uses Hilbert space formalism. Some researchers explored quantum IR using superposition and entanglement.

**When to drop**: Wild card after vector space model (lesson 10). Mostly a curiosity, but shows how mathematical abstractions travel.

### 3. Zipf's Law and Language Universals
**Connection**: Term frequency follows power law in all languages. Connects IR to linguistics, information theory, and complex systems.

**When to drop**: Lesson 4 (term weighting). Opens door to information theory (entropy, compression).

### 4. Search Engines and Recommender Systems
**Connection**: Both are ranking problems. Collaborative filtering = "query is user, documents are items." Same evaluation metrics.

**When to drop**: After lesson 17 (evaluation metrics). Show how IR techniques generalize.

### 5. Information Retrieval and Information Theory
**Connection**: Relevance models based on KL divergence, language models use entropy, compression is Shannon's legacy.

**When to drop**: Lesson 12 (language models). If student knows information theory, show the connections explicitly.

### 6. Web Spam and Adversarial Machine Learning
**Connection**: SEO spam is adversarial attack on ranking algorithms. Same game theory as adversarial examples in deep learning.

**When to drop**: Lesson 23 (spam). Connects to broader ML security themes.

## Difficulty Progression

### Foundations (Lessons 1-4): Difficulty 1-2
Build intuition with simple models (Boolean, TF-IDF). Hands-on and accessible.

### Text Processing and Indexing (Lessons 5-9): Difficulty 2-3
Introduce algorithmic complexity. Index construction requires thinking about scale and efficiency.

**Peak**: Lesson 7 (compression) is math-heavy (gap encoding, variable-length codes).

### Retrieval Models (Lessons 10-15): Difficulty 3-4
Steepest learning curve. Vector space model requires linear algebra. BM25 and language models have heavy formalism.

**Peaks**: Lesson 11 (BM25 derivation), Lesson 12 (language models and smoothing), Lesson 13 (neural IR).

**Review**: Lesson 15 consolidates three major models.

### Ranking and Evaluation (Lessons 16-20): Difficulty 2-4
Evaluation metrics (lessons 16-17) are accessible. Diversity and feedback (lessons 18-19) are more advanced.

**Peak**: Lesson 19 (diversity) requires optimization thinking (MMR is a greedy algorithm).

### Web Search (Lessons 21-25): Difficulty 3-4
PageRank (lesson 22) is the hardest lesson in the curriculum (eigenvectors, random walk, convergence). Everything else is manageable.

**Peak**: Lesson 22 (PageRank). Consider splitting into two lessons for beginners.

### Advanced Topics (Lessons 26-28): Difficulty 3-4
Learning to rank (lesson 26) assumes ML background but is conceptually clean. Cross-lingual IR (lesson 27) is easier, resource-focused.

**Final review**: Lesson 28 synthesizes everything.

## Pacing Notes

- **Slow down for**: Inverted index (lesson 2), TF-IDF (lesson 4), BM25 (lesson 11), PageRank (lesson 22). These are conceptual bottlenecks.
- **Speed up for**: Tokenization/stemming (lesson 5), review lessons (9, 15, 20, 28), resource drops (lesson 27).
- **Hands-on checkpoints**: Lessons 6 (build index), 14 (compare models), 25 (end-to-end system). These are teach-backs — expect students to struggle productively.

## Adaptation Strategies

- **If student breezes through Boolean/TF-IDF**: Skip ahead to probabilistic models (lesson 11) or add advanced indexing (distributed indexing, MapReduce).
- **If student struggles with BM25 math**: Focus on intuition (term saturation, document length normalization) and use it as a black box. Come back to derivation later if needed.
- **If student loves the web search module**: Add lessons on crawling politeness, distributed crawling, freshness, and vertical search.
- **If student wants more neural IR**: Expand lesson 13 into 3-4 lessons covering dense retrieval, cross-encoders, ColBERT, and hard negative mining.
