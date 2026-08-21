# Natural Language Processing — Resources

## Primary Sources (for lesson content)

### Textbooks
- **Speech and Language Processing (3rd ed.)** by Dan Jurafsky and James H. Martin
  - https://web.stanford.edu/~jurafsky/slp3/
  - The definitive NLP textbook. Covers classical and modern approaches with mathematical rigor and linguistic depth. Free online.
  - **Best for**: conceptual foundations, linguistic background, comprehensive coverage
  - **Level**: intermediate to advanced, but chapters 2-10 are accessible

- **Natural Language Processing with Python** by Steven Bird, Ewan Klein, and Edward Loper
  - https://www.nltk.org/book/
  - Practical introduction using NLTK. Hands-on, code-first approach. Free online.
  - **Best for**: getting started with practical NLP, understanding classical techniques through code
  - **Level**: beginner to intermediate

### Courses
- **Stanford CS224N: Natural Language Processing with Deep Learning**
  - https://web.stanford.edu/class/cs224n/
  - https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ (video lectures)
  - Comprehensive graduate-level course covering neural NLP, transformers, pre-training
  - **Best for**: modern NLP, deep learning approaches, theoretical foundations
  - **Level**: intermediate to advanced

- **Hugging Face NLP Course**
  - https://huggingface.co/learn/nlp-course/chapter1/1
  - Hands-on course using transformers library. Very practical, industry-oriented
  - **Best for**: implementing modern NLP with pre-trained models, fine-tuning, deployment
  - **Level**: intermediate (assumes some ML background)

- **fast.ai: A Code-First Introduction to NLP**
  - https://www.fast.ai/
  - https://github.com/fastai/course-nlp
  - Practical, code-first approach. Less theory, more experimentation
  - **Best for**: rapid prototyping, transfer learning, practical intuition
  - **Level**: intermediate

## Supplementary (for engagement)

### Video Series
- **Stanford CS224N lectures** (Dan Jurafsky, Chris Manning)
  - https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ
  - Complete lecture series, well-paced, excellent visualizations

- **Neural Networks for NLP** (CMU, Graham Neubig)
  - https://www.youtube.com/playlist?list=PL8PYTP1V4I8AkaHEJ7lOOrlex-pcxS-XV
  - Advanced topics, research-oriented

- **The Illustrated Transformer** (Jay Alammar)
  - https://jalammar.github.io/illustrated-transformer/
  - Best visual explanation of transformer architecture
  - Also see: https://jalammar.github.io/illustrated-bert/ and https://jalammar.github.io/illustrated-gpt2/

- **Hugging Face YouTube Channel**
  - https://www.youtube.com/@HuggingFace
  - Tutorials, model releases, practical tips

### Interactive Tools & Demos
- **AllenNLP Demos**
  - https://demo.allennlp.org/
  - Live demos: sentiment analysis, NER, reading comprehension, dependency parsing, coreference resolution
  - **Best for**: seeing models in action, understanding task definitions

- **Hugging Face Model Hub**
  - https://huggingface.co/models
  - Thousands of pre-trained models, try them in-browser
  - **Best for**: experimenting with different models, comparing architectures

- **Hugging Face Spaces**
  - https://huggingface.co/spaces
  - Community-built demos and applications
  - **Best for**: exploring creative applications, understanding capabilities

- **Transformer Explainability Tool**
  - https://github.com/jessevig/bertviz
  - Visualize attention patterns in transformers
  - **Best for**: understanding what attention learns

- **Write With Transformer**
  - https://transformer.huggingface.co/
  - Interactive text generation with GPT-2
  - **Best for**: understanding autoregressive generation

- **Language Interpretability Tool (LIT)**
  - https://pair-code.github.io/lit/
  - Google's tool for probing and visualizing NLP models
  - **Best for**: model analysis, debugging, interpretability

### Code Repositories & Notebooks
- **Hugging Face Transformers Library**
  - https://github.com/huggingface/transformers
  - https://huggingface.co/docs/transformers/index
  - Industry-standard library for transformer models

- **spaCy**
  - https://spacy.io/
  - https://github.com/explosion/spaCy
  - Industrial-strength NLP: tokenization, POS, NER, parsing
  - **Best for**: production NLP pipelines

- **NLTK (Natural Language Toolkit)**
  - https://www.nltk.org/
  - https://github.com/nltk/nltk
  - Classical NLP algorithms and corpora
  - **Best for**: learning fundamentals, linguistic analysis

- **Stanford NLP (Stanza)**
  - https://stanfordnlp.github.io/stanza/
  - https://github.com/stanfordnlp/stanza
  - Neural NLP pipeline in 60+ languages

- **AllenNLP**
  - https://allennlp.org/
  - https://github.com/allenai/allennlp
  - Research library for NLP, modular and extensible

### Research Papers (foundational)
- **Attention Is All You Need** (Vaswani et al., 2017)
  - https://arxiv.org/abs/1706.03762
  - The transformer paper

- **BERT: Pre-training of Deep Bidirectional Transformers** (Devlin et al., 2018)
  - https://arxiv.org/abs/1810.04805
  - Bidirectional pre-training with masked LM

- **Language Models are Few-Shot Learners** (Brown et al., 2020, GPT-3)
  - https://arxiv.org/abs/2005.14165
  - Scaling laws and in-context learning

- **Neural Machine Translation by Jointly Learning to Align and Translate** (Bahdanau et al., 2014)
  - https://arxiv.org/abs/1409.0473
  - The attention mechanism paper

- **Efficient Estimation of Word Representations** (Mikolov et al., 2013, word2vec)
  - https://arxiv.org/abs/1301.3781
  - Word embeddings via skip-gram and CBOW

- **Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings** (Bolukbasi et al., 2016)
  - https://arxiv.org/abs/1607.06520
  - Bias in word embeddings

### Datasets & Benchmarks
- **GLUE & SuperGLUE**
  - https://gluebenchmark.com/
  - https://super.gluebenchmark.com/
  - General language understanding benchmarks

- **SQuAD (Stanford Question Answering Dataset)**
  - https://rajpurkar.github.io/SQuAD-explorer/
  - Reading comprehension dataset

- **CoNLL Shared Tasks**
  - https://www.conll.org/
  - NER, parsing, coreference datasets

- **IMDb Movie Reviews**
  - https://ai.stanford.edu/~amaas/data/sentiment/
  - Binary sentiment classification

- **Papers with Code NLP Leaderboards**
  - https://paperswithcode.com/area/natural-language-processing
  - SOTA models and benchmarks across tasks

### People to Follow
- **Dan Jurafsky** — Stanford, textbook co-author, sociolinguistics + NLP
- **Chris Manning** — Stanford CS224N, dependency parsing, transformers
- **Yoav Goldberg** — Bar Ilan, neural NLP, primer author
- **Emily M. Bender** — UW, computational linguistics, ethics, #BenderRule
- **Sam Bowman** — NYU/Anthropic, NLU, evaluation
- **Yejin Choi** — UW/AI2, commonsense reasoning, creative generation
- **Sebastian Ruder** — research scientist, transfer learning, multilinguality
- **Jay Alammar** — visualizations (Illustrated Transformer, etc.)
- **Rachel Thomas** — fast.ai, practical NLP, ethics

### Communities & Forums
- **Hugging Face Forums**
  - https://discuss.huggingface.co/
  - Very active, helpful community

- **r/LanguageTechnology (Reddit)**
  - https://www.reddit.com/r/LanguageTechnology/
  - Academic and industry discussion

- **ACL (Association for Computational Linguistics)**
  - https://www.aclweb.org/
  - Premier NLP conference, anthology of papers

## Unexpected Connections (rabbit holes)

- **Linguistics** — Chomsky's universal grammar, dependency vs constituency, morphology
  - https://en.wikipedia.org/wiki/Universal_grammar
  - Shows up in: parsing (lesson 10), cross-lingual transfer (lesson 22)

- **Information theory** — Shannon's entropy, mutual information, compression
  - https://en.wikipedia.org/wiki/Entropy_(information_theory)
  - Shows up in: language modeling (lesson 7), evaluation (lesson 28)

- **Cognitive science** — how humans process language, garden path sentences, priming
  - https://en.wikipedia.org/wiki/Psycholinguistics
  - Shows up in: attention metaphors (lesson 15), model interpretability (lesson 29)

- **Semiotics** — signs, symbols, meaning-making beyond language
  - https://plato.stanford.edu/entries/semiotics/
  - Shows up in: multimodal learning, grounding

- **Philosophy of language** — Wittgenstein's language games, Searle's Chinese Room
  - https://plato.stanford.edu/entries/chinese-room/
  - Shows up in: what models "understand" (lesson 21, 29)

- **Compilers and formal languages** — parsing, context-free grammars, finite automata
  - https://en.wikipedia.org/wiki/Chomsky_hierarchy
  - Shows up in: syntactic parsing (lesson 10)

- **History of AI** — symbolic AI vs connectionism, AI winters, expert systems
  - Shows up in: classical vs neural debate (lesson 13)

- **Digital humanities** — corpus linguistics, stylometry, authorship attribution
  - Shows up in: text representation (lesson 3), n-grams (lesson 7)

## Tools for Experimentation

- **Jupyter Notebooks** — interactive coding environment
  - https://jupyter.org/

- **Google Colab** — free GPU notebooks
  - https://colab.research.google.com/

- **Kaggle Notebooks** — datasets + compute
  - https://www.kaggle.com/

- **Weights & Biases** — experiment tracking
  - https://wandb.ai/

- **TensorBoard** — visualization for PyTorch/TensorFlow
  - https://www.tensorflow.org/tensorboard

## Quick Reference Cheat Sheets

- **Hugging Face Transformers Cheat Sheet**
  - https://huggingface.co/docs/transformers/quicktour

- **spaCy Cheat Sheet**
  - https://spacy.io/usage/spacy-101

- **Stanford NLP Resources**
  - https://nlp.stanford.edu/software/

- **RegexOne (for text preprocessing)**
  - https://regexone.com/
