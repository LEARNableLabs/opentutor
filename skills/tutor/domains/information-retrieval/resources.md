# Information Retrieval and Search Engines — Resources

## Primary Sources (for lesson content)

### Textbooks

- **"Introduction to Information Retrieval"** by Christopher D. Manning, Prabhakar Raghavan, and Hinrich Schütze (Cambridge University Press, 2008)
  - The foundational text for the field. Covers Boolean retrieval through web search.
  - **Freely available online**: https://nlp.stanford.edu/IR-book/
  - **Why it's perfect for intermediate**: Clear exposition, good balance of theory and practice, excellent exercises.
  - **Use for**: Lessons 1-22 (all classical IR topics)

- **"Search Engines: Information Retrieval in Practice"** by Bruce Croft, Donald Metzler, and Trevor Strohman (Pearson, 2015)
  - More recent, covers modern search engines and practical systems.
  - Strong on query understanding, learning to rank, and evaluation.
  - **Use for**: Lessons 16-26 (evaluation, web search, learning to rank)

- **"Information Retrieval: Implementing and Evaluating Search Engines"** by Stefan Büttcher, Charles L.A. Clarke, and Gordon V. Cormack (MIT Press, 2010)
  - Implementation-focused. Excellent for understanding compression, index construction, and efficiency.
  - **Use for**: Lessons 5-8 (indexing and compression)

### Online Courses

- **Stanford CS276: Information Retrieval and Web Search**
  - Taught by Chris Manning and Prabhakar Raghavan
  - Video lectures available on YouTube
  - Covers the Manning/Raghavan/Schütze textbook
  - **Link**: Search YouTube for "Stanford CS276" for lecture videos
  - **Use for**: Visual learners, alternative explanations

- **Coursera: Text Retrieval and Search Engines (UIUC)**
  - Taught by ChengXiang Zhai (University of Illinois)
  - Covers retrieval models, evaluation, feedback, and learning to rank
  - Strong on language models and probabilistic approaches
  - **Link**: https://www.coursera.org/learn/text-retrieval
  - **Use for**: Lessons 10-14, 26 (retrieval models, learning to rank)

### Key Papers

- **PageRank**: "The PageRank Citation Ranking: Bringing Order to the Web" by Lawrence Page, Sergey Brin, Rajeev Motwani, and Terry Winograd (1999)
  - Original PageRank paper from Google founders
  - **Link**: http://ilpubs.stanford.edu:8090/422/1/1999-66.pdf
  - **Use for**: Lesson 22

- **BM25**: "Some simple effective approximations to the 2-Poisson model for probabilistic weighted retrieval" by Stephen E. Robertson and Steve Walker (1994)
  - Original BM25 formulation
  - **Link**: https://dl.acm.org/doi/10.1145/188490.188561
  - **Use for**: Lesson 11

- **Language Models for IR**: "A language modeling approach to information retrieval" by Jay M. Ponte and W. Bruce Croft (1998)
  - Introduces language models for IR
  - **Link**: https://dl.acm.org/doi/10.1145/290941.291008
  - **Use for**: Lesson 12

- **Neural IR (BERT)**: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding" by Jacob Devlin et al. (2019)
  - Foundation for modern neural IR
  - **Link**: https://arxiv.org/abs/1810.04805
  - **Use for**: Lesson 13

- **Dense Retrieval**: "Dense Passage Retrieval for Open-Domain Question Answering" by Vladimir Karpukhin et al. (2020)
  - Key paper on dense retrieval with dual encoders
  - **Link**: https://arxiv.org/abs/2004.04906
  - **Use for**: Lesson 13

## Supplementary (for engagement)

### Videos

- **StatQuest (Josh Starmer)**: "TF-IDF Explained"
  - Simple, visual explanation of TF-IDF
  - **Link**: https://www.youtube.com/watch?v=hc3CrezcCSE
  - **Use for**: Lesson 4

- **Victor Lavrenko's IR Lectures**
  - YouTube series covering IR fundamentals
  - Short, focused videos (5-15 minutes each)
  - Covers Boolean retrieval, vector space model, probabilistic models
  - **Search**: "Victor Lavrenko information retrieval" on YouTube
  - **Use for**: Lessons 1-12 (supplementary explanations)

- **Google: How Search Works**
  - Official Google video explaining their search pipeline
  - **Link**: https://www.youtube.com/watch?v=kNkbFfEGSFY
  - **Use for**: Lessons 1, 21, 24 (overview and motivation)

- **PageRank Explanation (Computerphile)**
  - Accessible explanation of PageRank algorithm
  - **Link**: https://www.youtube.com/watch?v=P8Kt6Abq_rM
  - **Use for**: Lesson 22

### Interactive Tools

- **Elasticsearch Playground**
  - Try Elasticsearch queries in browser
  - **Link**: https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html
  - **Use for**: Lessons 2, 25 (hands-on search)

- **Apache Solr Tutorial**
  - Interactive tutorial with sample data (tech products)
  - **Link**: https://solr.apache.org/guide/solr/latest/getting-started/tutorial-techproducts.html
  - **Use for**: Lesson 25 (build a search engine)

- **Desmos for Vector Space Model**
  - Visualize document and query vectors, cosine similarity
  - Create custom graphs at https://www.desmos.com/calculator
  - **Use for**: Lessons 10, 19 (geometric intuition)

- **PageRank Visualizer**
  - Interactive PageRank computation on small graphs
  - **Search**: "PageRank calculator" or "PageRank visualizer"
  - **Use for**: Lesson 22

### Code and Implementations

- **PyTerrier**: Python interface to Terrier IR platform
  - Easy experimentation with retrieval models (BM25, TF-IDF, etc.)
  - Built-in evaluation, datasets, and neural re-rankers
  - **Link**: https://github.com/terrier-org/pyterrier
  - **Docs**: https://pyterrier.readthedocs.io/
  - **Use for**: Lessons 14, 26 (compare models, learning to rank)

- **Anserini**: IR toolkit built on Lucene
  - Reproducible research with standard test collections
  - **Link**: https://github.com/castorini/anserini
  - **Use for**: Lessons 14, 16-17 (evaluation)

- **pytrec_eval**: Python interface to trec_eval (standard IR evaluation)
  - Compute MAP, NDCG, precision@k, etc.
  - **Link**: https://github.com/cvangysel/pytrec_eval
  - **Use for**: Lessons 16-17 (evaluation metrics)

- **Apache Lucene Core**
  - Industrial-strength IR library in Java
  - **Link**: https://lucene.apache.org/core/
  - **Docs**: https://lucene.apache.org/core/9_0_0/index.html
  - **Use for**: Lessons 2, 6, 7, 25 (indexing, search)

- **Elasticsearch**
  - Distributed search and analytics engine
  - **Link**: https://www.elastic.co/elasticsearch/
  - **Docs**: https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html
  - **Use for**: Lessons 8, 25 (dynamic indexing, production systems)

- **sentence-transformers (Hugging Face)**
  - Pre-trained models for semantic search and dense retrieval
  - **Link**: https://huggingface.co/sentence-transformers
  - **Docs**: https://www.sbert.net/
  - **Use for**: Lesson 13 (neural IR, dense retrieval)

- **NLTK (Natural Language Toolkit)**
  - Python library for text processing
  - Includes stemmers (Porter, Snowball), tokenizers
  - **Link**: https://www.nltk.org/
  - **Stemming guide**: https://www.nltk.org/howto/stem.html
  - **Use for**: Lesson 5 (tokenization, stemming)

- **Scrapy**: Python web crawling framework
  - Build crawlers with politeness, robots.txt handling
  - **Link**: https://scrapy.org/
  - **Use for**: Lesson 21 (web crawling)

### Code Examples

- **Build an Inverted Index (Python)**
  - Simple implementation from scratch
  - Example: https://github.com/topics/inverted-index (search for educational repos)
  - **Use for**: Lesson 2, 6

- **TF-IDF from Scratch**
  - Implement TF-IDF without libraries
  - Many tutorials available; use one that explains the math
  - **Use for**: Lesson 4

- **PageRank Implementation**
  - Iterative and matrix-based implementations
  - Example: Search GitHub for "PageRank Python implementation"
  - **Use for**: Lesson 22

## Tools and Platforms

### Search Engines for Practice

- **Apache Solr**
  - Enterprise search platform built on Lucene
  - **Link**: https://solr.apache.org/
  - **Use for**: Lesson 25 (full-stack search)

- **Elasticsearch**
  - Most popular search/analytics engine
  - **Link**: https://www.elastic.co/
  - **Use for**: Lessons 8, 25

- **Whoosh**
  - Pure Python search library (no Java dependencies)
  - Good for learning, not production scale
  - **Link**: https://whoosh.readthedocs.io/
  - **Use for**: Lessons 2, 6 (simple indexing experiments)

### Datasets and Benchmarks

- **TREC (Text Retrieval Conference)**
  - Standard test collections for IR evaluation
  - **Link**: https://trec.nist.gov/
  - **Use for**: Lessons 16-17 (evaluation)

- **MS MARCO (Microsoft Machine Reading Comprehension)**
  - Large-scale dataset for passage ranking and question answering
  - **Link**: https://microsoft.github.io/msmarco/
  - **Use for**: Lessons 13, 26 (neural IR, learning to rank)

- **BEIR Benchmark**
  - Heterogeneous IR benchmark across 18 datasets
  - **Link**: https://github.com/beir-cellar/beir
  - **Use for**: Lesson 14 (model comparison)

- **Wikipedia Dumps**
  - Real-world corpus for experiments
  - **Link**: https://dumps.wikimedia.org/
  - **Use for**: Lessons 6, 21, 25 (indexing, crawling)

## People to Follow

### Pioneers

- **Gerard Salton** (1927-1995): Father of modern IR, invented vector space model
- **Karen Spärck Jones** (1935-2007): Invented IDF (inverse document frequency)
- **Stephen Robertson**: BM25, probabilistic IR, Microsoft Research
- **W. Bruce Croft**: Language models for IR, University of Massachusetts Amherst

### Contemporary Researchers

- **Jimmy Lin**: University of Waterloo, neural IR, Anserini toolkit
  - Twitter: @lintool
- **Jamie Callan**: Carnegie Mellon, federated search, learning to rank
- **Maarten de Rijke**: University of Amsterdam, neural IR, conversational search
- **Nick Craswell**: Microsoft Research, learning to rank, web search
- **Hua Wu**: Baidu, neural search, Chinese IR
- **Thorsten Joachims**: Cornell, learning to rank, SVMrank

### Practitioners

- **Grant Ingersoll**: CTO at Lucidworks (Solr/Lucene), author
- **Doug Turnbull**: Relevance tuning expert, author of "Relevant Search"
- **Daniel Tunkelang**: Search quality consultant, former Google/LinkedIn

## Unexpected Connections (for wild cards)

### Information Retrieval and Music Recommendation
Cover song identification and music search use similar techniques (LSH, embeddings, similarity metrics). Shazam is an IR system for audio.

### IR and Genomics
BLAST (Basic Local Alignment Search Tool) for DNA sequences is essentially an IR system. Uses similar indexing and ranking ideas.

### Search Engines and Social Networks
Friend recommendation, feed ranking, and hashtag search all use IR techniques. PageRank inspired Twitter's WTF (Who To Follow).

### IR and Computer Vision
Image search (reverse image search, Pinterest Lens) uses dense retrieval with visual embeddings. Same dual-encoder architecture as text search.

### Legal Search and e-Discovery
Legal professionals use advanced IR for case law search and document review. High-stakes evaluation (missing a relevant case can lose the trial).

## Staying Current

### Conferences to Watch

- **SIGIR**: Annual conference, best papers define state of the art
  - **Link**: https://sigir.org/
- **WWW**: Web search and ranking
- **WSDM**: Web search and data mining
- **RecSys**: Recommender systems (overlaps with IR)

### Blogs and News

- **Elastic Blog**: Practical search engineering
  - **Link**: https://www.elastic.co/blog/
- **Lucene/Solr Blog**: Updates and deep dives
  - **Link**: https://solr.apache.org/news.html
- **Google Search Central Blog**: SEO and search updates
  - **Link**: https://developers.google.com/search/blog

### Online Communities

- **r/InformationRetrieval** (Reddit): Academic IR discussions
- **Lucene/Solr mailing lists**: Practical Q&A
- **Elasticsearch forums**: Troubleshooting and best practices
