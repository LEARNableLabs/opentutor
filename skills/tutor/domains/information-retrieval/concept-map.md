# Information Retrieval and Search Engines — Concept Map

## Core Concepts (in learning order)

1. **Information Need** — the gap between what a user knows and wants to know
2. **Query Formulation** — translating an information need into searchable terms
3. **Boolean Retrieval** — exact matching using AND, OR, NOT operators. Foundational model.
4. **Inverted Index** — data structure mapping terms to documents containing them. Core to all modern IR.
5. **Term-Document Matrix** — conceptual representation of which terms appear in which documents
6. **Tolerant Retrieval** — handling typos, variants, wildcards. Depends on: inverted index
7. **Edit Distance** — measure of similarity between strings. Enables: spelling correction
8. **Term Frequency (TF)** — how often a term appears in a document
9. **Document Frequency (DF)** — how many documents contain a term
10. **TF-IDF** — weighting scheme balancing term frequency and rarity. Depends on: TF, DF
11. **Tokenization** — splitting text into terms/tokens. Prerequisite for: all indexing
12. **Normalization** — converting terms to canonical form (case, accents, etc.)
13. **Stemming** — reducing words to root form (running → run). Depends on: tokenization
14. **Lemmatization** — reducing words to dictionary form using linguistics. More sophisticated than stemming.
15. **Index Construction** — algorithms for building inverted indexes at scale. Depends on: inverted index, tokenization
16. **Index Compression** — reducing storage requirements. Depends on: inverted index
17. **Dynamic Indexing** — updating indexes as new documents arrive. Depends on: index construction
18. **Vector Space Model** — representing documents and queries as vectors. Depends on: TF-IDF
19. **Cosine Similarity** — measuring similarity between document and query vectors. Depends on: vector space model
20. **Probabilistic Retrieval** — ranking by probability of relevance
21. **BM25** — state-of-the-art probabilistic ranking function. Depends on: TF-IDF, probabilistic retrieval
22. **Document Length Normalization** — adjusting scores for document length. Used in: BM25, vector space model
23. **Language Models for IR** — modeling documents as probability distributions over terms
24. **Smoothing** — handling zero probabilities in language models
25. **Neural IR** — using deep learning for retrieval and ranking
26. **Dense Retrieval** — representing documents and queries as learned embeddings. Depends on: neural IR
27. **Semantic Matching** — matching by meaning rather than exact terms. Enabled by: neural IR, dense retrieval
28. **Precision** — fraction of retrieved documents that are relevant
29. **Recall** — fraction of relevant documents that are retrieved
30. **F-Measure** — harmonic mean of precision and recall. Depends on: precision, recall
31. **Mean Average Precision (MAP)** — average precision across multiple queries. Depends on: precision
32. **NDCG** — normalized discounted cumulative gain, position-aware metric
33. **Relevance Feedback** — using user feedback to improve queries. Depends on: vector space model
34. **Query Expansion** — adding terms to query. Method: relevance feedback
35. **Rocchio Algorithm** — specific relevance feedback algorithm. Depends on: vector space model, query expansion
36. **Result Diversification** — ensuring variety in results
37. **Web Crawling** — discovering and fetching web pages
38. **Politeness** — respecting server load and robots.txt. Part of: web crawling
39. **Link Analysis** — using hyperlink structure for ranking
40. **PageRank** — link-based authority measure. Depends on: link analysis
41. **HITS** — hub and authority scores. Depends on: link analysis
42. **Web Spam** — manipulative techniques to boost rankings
43. **Spam Detection** — identifying and filtering spam. Counters: web spam
44. **Query Understanding** — interpreting user intent. Prerequisite for: effective retrieval
45. **Query Intent** — what the user actually wants (navigational, informational, transactional)
46. **Learning to Rank** — using machine learning to learn ranking functions. Depends on: ranking, evaluation metrics
47. **Cross-Lingual IR** — searching across languages. Depends on: retrieval models, translation/embeddings

## Dependencies

### Critical Paths

**Inverted Index → Vector Space Model → Neural IR**
- Inverted index is the foundation for all retrieval
- Vector space model extends Boolean to ranked retrieval
- Neural IR replaces hand-crafted features with learned representations

**TF-IDF → BM25 → Learning to Rank**
- TF-IDF introduces term weighting
- BM25 adds probabilistic justification and better normalization
- Learning to Rank optimizes directly for evaluation metrics

**Tokenization → Stemming → Index Construction**
- Text processing pipeline must happen before indexing
- Order matters: tokenize, normalize, then stem

### Bottleneck Concepts

**Inverted Index** — must understand this deeply before any retrieval model makes sense. Most students struggle with the data structure details.

**TF-IDF** — bridges Boolean and ranked retrieval. Students often memorize the formula without understanding why it works.

**Cosine Similarity** — requires comfort with vectors and linear algebra. Conceptual leap from "matching words" to "geometric similarity."

**Evaluation Metrics** — NDCG in particular is mathematically dense. Can't evaluate systems without understanding these.

**PageRank** — eigenvector computation and random walk intuition. Math-heavy but conceptually beautiful.

## Prerequisite Topics

- **Data Structures** — needed for inverted index, hash tables, priority queues (crawling frontier)
- **Probability and Statistics** — needed for probabilistic models, evaluation, language models
- **Linear Algebra** — needed for vector space model, cosine similarity, PageRank, neural IR
- **Basic NLP** — helpful for understanding tokenization, stemming, but can be learned together
- **Programming** — essential for implementing and experimenting with algorithms

## Common Dependency Mistakes

Students often try to:
- Jump to neural IR without understanding classical models (miss fundamental concepts)
- Study PageRank before understanding basic ranking (too advanced, misses motivation)
- Learn evaluation metrics without implementing a baseline system (too abstract)
- Build an index without understanding text processing (garbage in, garbage out)

## Conceptual Clusters

**Text Processing**: tokenization, normalization, stemming, lemmatization
**Indexing**: inverted index, compression, dynamic indexing, construction
**Ranking**: TF-IDF, BM25, language models, PageRank
**Evaluation**: precision, recall, MAP, NDCG
**Modern Extensions**: neural IR, dense retrieval, learning to rank
