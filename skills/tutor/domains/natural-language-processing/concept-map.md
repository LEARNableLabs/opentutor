# Natural Language Processing — Concept Map

## Core Concepts (in learning order)

1. **Tokenization** — breaking text into units (words, subwords, characters)
2. **Vocabulary** — the set of all tokens the system can recognize
3. **Bag-of-words representation** — text as unordered token counts, ignoring structure
4. **TF-IDF weighting** — measuring term importance by frequency and rarity. Depends on: bag-of-words
5. **Distributional semantics** — "you shall know a word by the company it keeps"
6. **Word embeddings** — dense vector representations capturing semantic similarity. Depends on: distributional semantics
7. **Polysemy and context** — how word meaning varies by usage. Depends on: word embeddings
8. **Language models** — probability distributions over sequences of words
9. **N-grams** — fixed-window Markov models for language. Depends on: language models
10. **Smoothing** — handling unseen n-grams. Depends on: n-grams
11. **Part-of-speech tagging** — assigning grammatical categories to words
12. **Hidden Markov Models** — sequence labeling with latent states. Depends on: part-of-speech tagging
13. **Syntactic parsing** — discovering grammatical structure. Depends on: part-of-speech tagging
14. **Recurrent Neural Networks** — neural models for sequential data. Depends on: word embeddings
15. **Vanishing gradients** — why simple RNNs fail on long sequences. Depends on: RNNs
16. **LSTM/GRU** — gated RNN variants that maintain long-term memory. Depends on: vanishing gradients
17. **Attention mechanism** — dynamic focusing on relevant input parts. Depends on: LSTM/GRU
18. **Encoder-decoder architecture** — sequence-to-sequence models. Depends on: attention
19. **Self-attention** — attention where input attends to itself
20. **Transformers** — parallel architecture using only self-attention. Depends on: self-attention
21. **Pre-training** — learning from unlabeled data at scale
22. **Masked language modeling** — predicting hidden words from context. Depends on: pre-training, transformers
23. **Autoregressive language modeling** — predicting next word from prefix. Depends on: pre-training, transformers
24. **Fine-tuning** — adapting pre-trained models to specific tasks. Depends on: pre-training
25. **Named Entity Recognition** — identifying names, places, organizations. Depends on: sequence labeling
26. **Reading comprehension** — extracting answers from text given questions. Depends on: fine-tuning
27. **Evaluation metrics** — measuring system performance (accuracy, F1, BLEU, perplexity)
28. **Model bias** — systematic errors from training data. Depends on: evaluation metrics

## Dependencies

### Foundational Dependencies
- **Word embeddings require distributional semantics** because embeddings are learned by analyzing word co-occurrence patterns in large corpora
- **TF-IDF requires bag-of-words** because it builds on word frequency counting but adds inverse document frequency weighting
- **Context-dependent meaning requires embeddings** because we need base representations before we can condition them on context

### Classical NLP Dependencies
- **Smoothing requires n-grams** because smoothing addresses the zero-probability problem that arises when n-grams haven't been observed
- **HMMs require sequence structure** because the hidden states model the underlying grammar that generates observed word sequences
- **Parsing requires POS tagging** because syntactic structure builds on grammatical categories

### Neural NLP Dependencies
- **LSTMs require understanding vanishing gradients** because LSTMs were specifically designed to solve this problem
- **Attention requires encoder-decoder** because attention was introduced to improve seq2seq models
- **Transformers require self-attention** because transformers replace recurrence entirely with multi-head self-attention

### Pre-training Dependencies
- **Fine-tuning requires pre-training** because fine-tuning adapts a pre-trained model's general knowledge to specific tasks
- **BERT requires masked LM** because masked language modeling is BERT's pre-training objective
- **GPT requires autoregressive LM** because next-token prediction is GPT's pre-training objective

### Application Dependencies
- **NER requires sequence labeling** because it tags each token with an entity type or "not an entity"
- **Reading comprehension requires fine-tuning** because modern QA systems fine-tune pre-trained models on QA datasets
- **Evaluation requires task understanding** because different tasks need different metrics (F1 for classification, BLEU for generation, etc.)

## Prerequisite Topics

- **Python programming** — needed for all practical exercises
- **Linear algebra** — needed for embeddings, attention, transformers
- **Probability and statistics** — needed for language models, smoothing, evaluation
- **Basic machine learning** — needed for classification, neural networks, optimization
- **Neural networks basics** — needed for RNNs, transformers, fine-tuning

## Key Bottlenecks

### Conceptual Bottlenecks
1. **Understanding embeddings as semantic representations** — students struggle to see how vectors capture meaning until they experiment with similarity and analogy
2. **The shift from symbolic to distributed representations** — classical NLP uses discrete symbols, neural NLP uses continuous vectors
3. **Attention as soft lookup** — attention is hard to grasp until you see it as learned, differentiable dictionary access
4. **Pre-training as general-purpose learning** — understanding that unsupervised pre-training creates transferable knowledge

### Technical Bottlenecks
1. **Handling variable-length sequences** — padding, masking, batching
2. **The vocabulary/OOV tradeoff** — larger vocab = more coverage but sparser data
3. **Why transformers parallelize but RNNs don't** — sequential vs parallel computation
4. **How to choose metrics for evaluation** — task-specific appropriateness

## Common Misconceptions

1. **"Tokenization is just splitting on spaces"** — reality: subword tokenization, punctuation, contractions, morphology
2. **"Bigger embeddings are always better"** — reality: dimensionality vs data tradeoff, overfitting
3. **"Attention lets models see the whole input"** — reality: RNNs see whole input too, attention changes how it's weighted
4. **"Transformers replaced RNNs because they're better at language"** — reality: they parallelize training, making large-scale pre-training feasible
5. **"BERT and GPT are the same, just different sizes"** — reality: encoder vs decoder, bidirectional vs autoregressive, fundamentally different architectures
6. **"Fine-tuning requires a lot of labeled data"** — reality: pre-training enables few-shot and transfer learning
7. **"High accuracy means the model works well"** — reality: must check calibration, fairness, robustness, not just test set performance
8. **"Language models understand meaning"** — reality: they capture statistical patterns that correlate with meaning
