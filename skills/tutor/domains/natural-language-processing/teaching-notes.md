# Natural Language Processing — Teaching Notes

## Approach

NLP at intermediate level requires balancing **conceptual intuition** with **practical implementation**. The field has undergone radical transformation (classical → neural → transformers), so students need historical context to understand why modern methods work and when classical approaches still matter. Teach through **hands-on experimentation** — let students break tokenizers, visualize embeddings, probe attention heads — rather than formula derivation. NLP is uniquely suited to exploratory learning because text is human-readable; unlike vision or speech, students can inspect inputs and outputs directly.

Emphasize the **abstraction layers**: tokens → vectors → sequences → representations. Help students see that most NLP architectures are answering the same question (how to represent meaning) with different tradeoffs (speed, context, data efficiency).

## Common Misconceptions

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
   - **Why**: The metaphor is seductive but misleading
   - **Correction**: Attention is learned weighted averaging over representations. It's differentiable, distributed, and continuous — unlike human selective attention. Show attention heatmaps and point out unintuitive patterns

5. **"Transformers are just better RNNs"**
   - **Why**: Students see transformers as incremental improvement
   - **Correction**: Transformers are architecturally different — they trade sequential inductive bias for parallelism and scale. Show that transformers can fail on tasks where position matters (e.g., length extrapolation) where RNNs might succeed

6. **"Pre-training is transfer learning from ImageNet"**
   - **Why**: Analogy to computer vision
   - **Correction**: NLP pre-training is self-supervised on massive unlabeled corpora, not supervised on a single dataset. The scale and objective differ fundamentally

7. **"BERT and GPT do the same thing"**
   - **Why**: Both are "transformers" and "pre-trained"
   - **Correction**: BERT is bidirectional encoder (good for understanding), GPT is autoregressive decoder (good for generation). Show how masking vs autoregression creates different capabilities

8. **"Higher BLEU score = better translation"**
   - **Why**: Over-reliance on single metric
   - **Correction**: Show examples where BLEU fails (paraphrases, fluency), discuss metric limitations, emphasize multi-faceted evaluation

9. **"Fine-tuning requires lots of labeled data"**
   - **Why**: Confusion with training from scratch
   - **Correction**: Pre-training enables few-shot learning. Show how 100s of examples can suffice for fine-tuning vs 10,000s for training from scratch

10. **"Language models understand language"**
    - **Why**: Models produce fluent, coherent text
    - **Correction**: They learn statistical patterns that correlate with understanding. Show failure modes (factual errors, reasoning gaps, consistency failures) to illustrate the difference between pattern matching and comprehension

11. **"Bigger models are always better"**
    - **Why**: Scaling laws show performance improvements with size
    - **Correction**: Discuss compute cost, latency, environmental impact, diminishing returns. Show when smaller, task-specific models outperform large general ones

## Level Adjustments

### Intermediate (current)
- **Assume**: Python fluency, basic ML (train/test split, overfitting, regularization), some neural network exposure (backprop, SGD)
- **Emphasize**: Hands-on implementation with modern libraries (Hugging Face, spaCy), understanding architectures through diagrams and visualization, building intuition before math
- **Skip**: Formal derivations (attention score formulas can be given, not derived), advanced topics (beam search details, advanced decoding strategies), linguistics deep-dives (X-bar theory, minimalist syntax)
- **Depth**: Implement from scratch for simple cases (n-gram LM, naive tokenizer), use libraries for complex cases (transformers)

### Beginner (comparison)
- Would start with pure applications (classify sentiment with a library), minimal architecture details
- More guided exercises, less theory
- Avoid mathematical notation entirely

### Advanced (comparison)
- Would include derivations (transformer attention score gradients)
- Dive into research papers (scaling laws, prompt engineering, RLHF)
- Implement transformers from scratch in raw PyTorch
- Cover linguistics theory more deeply (dependency grammar formalisms)

## Rabbit Holes

- **Linguistic relativity (Sapir-Whorf hypothesis)** — does language shape thought? Connect to multilinguality in NLP. Drop in when discussing cross-lingual transfer (lesson 22-24)

- **Zipf's law** — word frequency follows power law (rank * frequency ≈ constant). Shows up in vocabulary design, subword tokenization. Drop in when discussing tokenization (lesson 1-2)

- **The Chinese Room argument** — Searle's thought experiment on whether language processing constitutes understanding. Drop in when discussing what models "learn" (lesson 21, 29)

- **Collosal Clean Crawled Corpus (C4) and training data archaeology** — where do pre-training datasets come from? What biases do they contain? Drop in when discussing pre-training (lesson 21) or bias (lesson 29)

- **The bitter lesson (Rich Sutton)** — general methods + compute beat hand-engineered features. Explains the shift from linguistic features to end-to-end learning. Drop in when comparing classical vs neural (lesson 13)

- **Attention visualization as interpretability** — probing what models learn. Connect to BERTology, circuits in transformers. Drop in after attention (lesson 15, 19)

- **Code-switching and multilingual NLP** — how do bilinguals mix languages? How do models handle it? Drop in when discussing tokenization or multilinguality

- **The Winograd Schema Challenge** — testing commonsense reasoning ("The trophy doesn't fit in the suitcase because it's too big" — what is "it"?). Shows limits of statistical learning. Drop in when discussing model limitations (lesson 26, 29)

## Difficulty Progression

### Arc 1: Foundations (lessons 1-6)
- Start easy (2) with accessible concrete topics (tokenization, TF-IDF)
- Build to moderate (3) with embeddings and polysemy
- Review (1) to consolidate

### Arc 2: Classical (lessons 7-11)
- Maintain moderate difficulty (2-3) with familiar probability concepts
- Peak at parsing (4) — syntactic structure is abstract
- End with accessible teach-back (2)

### Arc 3: Neural (lessons 12-18)
- Start moderate (3) with RNNs
- Review (1) to bridge classical → neural
- Build to hard (4) with vanishing gradients and attention
- Stabilize (3) with seq2seq
- Lighten (2) with resource exploration
- Teach-back (3) for integration

### Arc 4: Transformers (lessons 19-24)
- Peak early (4) with transformer architecture
- Review (2) to consolidate
- Maintain challenge (3-4) with BERT vs GPT
- Stabilize (3) with fine-tuning
- Lighten (2) with hands-on exploration

### Arc 5: Applications (lessons 25-30)
- Maintain moderate (3-4) with real applications
- Review (1) before final push
- Peak at capstone project (5)
- Address ethics/bias (4) before finish

## Pacing Notes

- **Lessons 1-3**: Move quickly — these are warm-up concepts. Don't linger on TF-IDF math.
- **Lessons 4-5**: Slow down for embeddings — this is a paradigm shift from sparse to dense representations.
- **Lessons 7-11**: Classical NLP can feel dated; motivate with "what problems did this solve?" and "where is this still used?"
- **Lessons 12-18**: Neural NLP is dense; use visualizations heavily. Consider splitting lesson 14 (LSTMs) or 15 (attention) if student struggles.
- **Lessons 19-24**: Transformers are the heart of modern NLP. These deserve extra time. Encourage experimentation with Hugging Face.
- **Lessons 25-30**: Applications are where concepts crystallize. Push for projects that combine multiple concepts.

## Warning Signs

- **Student wants to skip classical NLP entirely** → Explain that transformers implicitly learn what classical methods did explicitly. Understanding n-grams helps debug tokenization; understanding parsing helps interpret attention patterns.
- **Student gets lost in implementation details** → Pull back to conceptual level. Draw diagrams. Run pre-built demos before coding.
- **Student memorizes architectures without intuition** → Ask "why" questions. "Why does attention help?" "Why bidirectional vs autoregressive?"
- **Student treats metrics as ground truth** → Show failure cases. Discuss evaluation thoughtfully, not mechanically.
