# Natural Language Processing — Research Summary

## Major Subtopics

### Foundations
- Text preprocessing and normalization (tokenization, stemming, lemmatization)
- Word representations (one-hot, TF-IDF, word embeddings)
- Statistical language models (n-grams, smoothing)

### Classical NLP
- Part-of-speech tagging and morphological analysis
- Syntactic parsing (constituency, dependency)
- Semantic role labeling and information extraction

### Neural NLP
- Recurrent architectures (RNNs, LSTMs, GRUs)
- Attention mechanisms and transformers
- Pre-trained language models (BERT, GPT, T5)

### Applications
- Text classification and sentiment analysis
- Named entity recognition and relation extraction
- Question answering and information retrieval
- Text generation and summarization
- Machine translation

### Advanced Topics
- Multilingual and cross-lingual NLP
- Few-shot and zero-shot learning
- Evaluation metrics and benchmarks
- Bias and fairness in language models

## Key Sources

### Academic Courses
- **Stanford CS224N** (Dan Jurafsky, Chris Manning) — comprehensive graduate-level NLP course with focus on deep learning approaches
- **University syllabi** — MIT 6.864, Berkeley CS 288, CMU 11-711

### Textbooks
- **Speech and Language Processing** (Jurafsky & Martin, 3rd ed.) — the definitive NLP textbook, covers classical and modern approaches
- **Natural Language Processing with Python** (Bird, Klein, Loper) — practical introduction using NLTK

### Online Resources
- **Hugging Face NLP Course** — hands-on transformer-based NLP with modern tools
- **fast.ai NLP course** — practical deep learning for NLP
- **Stanford NLP Group** — research papers, tools, demos
- **Papers with Code NLP** — leaderboards and implementations

### Tools & Libraries
- **NLTK** — classical NLP toolkit (tokenization, tagging, parsing)
- **spaCy** — industrial-strength NLP library
- **Hugging Face Transformers** — pre-trained models and pipelines
- **AllenNLP** — research library with interactive demos

## Available Resources

### Interactive Tools
- AllenNLP demos (sentiment, NER, QA, coreference)
- Hugging Face model hub and inference API
- Language model playgrounds (GPT, BERT visualizations)

### Video Lectures
- Stanford CS224N video series
- Hugging Face course videos
- fast.ai NLP videos

### Datasets & Benchmarks
- GLUE, SuperGLUE (general language understanding)
- SQuAD (question answering)
- CoNLL (NER, parsing)
- IMDb, SST (sentiment)

## Research Notes

NLP at intermediate level assumes:
- Programming experience (Python)
- Basic ML/stats (probability, linear algebra)
- Some exposure to neural networks

The field has shifted dramatically toward transformer-based models (2017+), but understanding classical approaches (tokenization, n-grams, parsing) remains essential for:
1. Working with low-resource scenarios
2. Understanding what transformers learn implicitly
3. Debugging and error analysis
4. Knowing when simpler methods suffice

Curriculum should balance:
- Foundational concepts (applicable regardless of paradigm shift)
- Classical techniques (still used in production)
- Modern approaches (transformers, pre-training)
- Hands-on practice with real tools
