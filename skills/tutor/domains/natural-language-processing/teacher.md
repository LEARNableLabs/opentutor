# Natural Language Processing — Domain Teaching Config

## Exercise Types
This domain uses a mix of delivery formats:
- **concept-focused mini-lessons** — 12 lessons (41%)
- **Socratic questions** — 6 lessons (21%)
- **review and consolidation sessions** — 4 lessons (14%)
- **real-world application challenges** — 3 lessons (10%)
- **teach-back exercises (student explains)** — 3 lessons (10%)
- **curated resource exploration** — 1 lessons (3%)

Primary format: concept-focused mini-lessons.

## Resource Types
This domain has strong coverage in: textbooks, video lectures, interactive tools, academic papers, code repositories, online courses. Prioritize these when recommending resources.

## Difficulty Curve
Balanced progression — steady difficulty increase with regular consolidation.

Distribution: 34% accessible (1-2), 38% standard (3), 28% challenging (4-5).

Difficulty peaks:
- Day 10: "Can we diagram sentences like in grade school, but automatically?" (difficulty 4)
- Day 14: "Why can't RNNs remember the beginning of a long sentence?" (difficulty 4)
- Day 15: "How does a translator know which foreign word to focus on?" (difficulty 4)
- Day 18: "Why did transformers replace RNNs as the dominant architecture?" (difficulty 4)
- Day 20: "How can BERT understand language without any labeled data?" (difficulty 4)

## Domain Hooks
- **Linguistic relativity (Sapir-Whorf hypothesis)** — does language shape thought? Connect to multilinguality in NLP. Drop in when discussing cross-lingual transfer (lesson 22-24)

- **Zipf's law** — word frequency follows power law (rank * frequency ≈ constant). Shows up in vocabulary design, subword tokenization. Drop in when discussing tokenization (lesson 1-2)

- **The Chinese Room argument** — Searle's thought experiment on whether language processing constitutes understanding. Drop in when discussing what models "learn" (lesson 21, 29)

- **Collosal Clean Crawled Corpus (C4) and training data archaeology** — where do pre-training datasets come from? What biases do they contain? Drop in when discussing pre-training (lesson 21) or bias (lesson 29)

- **The bitter lesson (Rich Sutton)** — general methods + compute beat hand-engineered features. Explains the shift from linguistic features to end-to-end learning. Drop in when comparing classical vs neural (lesson 13)

- **Attention v

## Common Failure Modes
1. **"Tokenization is trivial"**
   - **Why**: Students assume splitting on whitespace suffices
   - **Correction**: Show edge cases: contractions ("don't"), punctuation ("U.S.A."), compound words ("New York"), languages without spaces (Chinese). Demonstrate how BPE/WordPiece handle OOV words by breaking into subwords

2. **"Embeddings are just dimensionality reduction"**
   - **Why**: Students see embeddings as compression, missing the semantic structure
   - **Correction**: Show word2vec analogies (king - man + woman ≈ queen), visualize t-SNE projections where synonyms cluster, demonstrate cosine similarity for semantic search

3. **"RNNs can't handle long sequences at all"**
   - **Why**: Overreaction to vanishing gradient problem
   - **Correction**: LSTMs *do* help with medium-length dependencies (sentences, paragraphs). Show where they fail (multi-paragraph coreference) vs where they work (sentence-level tasks)

4. **"Attention means the model 'focuses' like humans do"**
   - **W

## Vocabulary
Key terms for this domain: text as data, tokenization, vocabulary, subword tokenization, BPE, WordPiece, TF-IDF, cosine similarity, bag of words, word embeddings, distributional semantics, word2vec, polysemy, context, word sense disambiguation (and 73 more).