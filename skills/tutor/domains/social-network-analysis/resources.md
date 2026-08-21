# Social Network Analysis — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Network Science** by Albert-László Barabási (2016) — https://networksciencebook.com/
  - Free interactive online textbook with visualizations and exercises
  - Comprehensive coverage from foundations to advanced topics
  - Accessible at intermediate level, physics-inspired perspective
  - Excellent for degree distributions, scale-free networks, diffusion

- **Networks, Crowds, and Markets** by David Easley and Jon Kleinberg (2010) — https://www.cs.cornell.edu/home/kleinber/networks-book/
  - Cornell course textbook, free online
  - Economics and sociology perspective
  - Great for game-theoretic aspects, cascades, power laws
  - Intermediate math level, strong on intuition

- **Social and Economic Networks** by Matthew O. Jackson (2008) — https://web.stanford.edu/~jacksonm/books.html
  - Rigorous treatment with game theory and economics
  - Advanced mathematical level, but excellent reference
  - Strong on network formation, strategic behavior

- **Networks: An Introduction** by Mark Newman (2018) — https://global.oup.com/academic/product/networks-9780198805090
  - Comprehensive reference, physicist perspective
  - Good for statistical methods, random graphs, resilience
  - More technical than Barabási, excellent depth

### Online Courses

- **CS224W: Machine Learning with Graphs** (Stanford, Jure Leskovec) — http://web.stanford.edu/class/cs224w/
  - Lecture slides, videos, and assignments freely available
  - Modern perspective connecting network analysis to ML
  - Excellent for community detection, link prediction, graph neural networks

- **Network Science** (Northeastern, Albert-László Barabási) — https://www.barabasilab.com/course
  - Video lectures accompanying the textbook
  - Visual and intuitive presentations
  - Good for degree distributions, network models

- **Social Network Analysis** (University of Michigan) — https://www.coursera.org/learn/social-network-analysis
  - Coursera MOOC, audit for free
  - Strong on sociological applications
  - Good for centrality, communities, diffusion

## Supplementary (for engagement)

### Videos

- **CS224W Lecture Playlist** (Stanford) — https://www.youtube.com/playlist?list=PLoROMvodv4rPLKxIpqhjhPgdQy7imNkDn
  - Full course lectures by Jure Leskovec
  - Modern, ML-oriented perspective
  - Great for visual learners

- **Network Science Lectures** (Barabási) — https://www.youtube.com/user/BarabasiLab
  - Barabási's course videos
  - Excellent visualizations
  - Physics-informed approach

- **Complexity Explorer: Introduction to Complexity** (Santa Fe Institute) — https://www.complexityexplorer.org/courses
  - Free courses on complex systems, networks, dynamics
  - Accessible, tutorial-style
  - Good for big-picture thinking

### Interactive Tools

- **Gephi** — https://gephi.org/
  - Open-source network visualization platform
  - Interactive graph layouts, filtering, statistics
  - Essential for exploratory analysis
  - Tutorials: https://gephi.org/users/

- **NetworkX** (Python) — https://networkx.org/
  - Primary computational library for this curriculum
  - Comprehensive algorithms, well-documented
  - Gallery of examples: https://networkx.org/documentation/stable/auto_examples/index.html

- **igraph** (R/Python/C) — https://igraph.org/
  - High-performance alternative to NetworkX
  - Faster for large graphs
  - Good if students have R background

- **Cytoscape** — https://cytoscape.org/
  - Biological network visualization
  - Good for domain-specific examples (protein networks)

- **graph-tool** (Python) — https://graph-tool.skewed.de/
  - High-performance, statistical inference focus
  - Advanced Bayesian community detection
  - More complex setup, but powerful

- **Observable Network Visualizations** — https://observablehq.com/@d3/force-directed-graph
  - Interactive D3.js examples
  - Great for web-based demos
  - Students can fork and experiment

### Code and Notebooks

- **NetworkX Tutorial Notebooks** — https://github.com/networkx/notebooks
  - Jupyter notebooks with examples and exercises
  - Good for hands-on practice

- **Stanford SNAP Tutorials** — https://snap.stanford.edu/snappy/index.html
  - SNAP.py tutorials for large-scale networks
  - Python interface to SNAP C++ library

- **Graph Neural Network Tutorials** — https://pytorch-geometric.readthedocs.io/
  - PyTorch Geometric library
  - Bridge to modern ML on graphs (advanced)

- **Network Analysis in Python** (GitHub) — https://github.com/briatte/awesome-network-analysis
  - Curated list of network analysis resources
  - Libraries, datasets, tutorials

### Datasets

- **Stanford Network Analysis Project (SNAP)** — https://snap.stanford.edu/data/
  - Hundreds of real-world network datasets
  - Social networks, web graphs, citation networks, collaboration networks
  - Well-documented, easy to load with NetworkX

- **Network Repository** — https://networkrepository.com/
  - Thousands of diverse networks
  - Searchable by type, size, properties
  - Good for finding specialized examples

- **KONECT** (Koblenz Network Collection) — http://konect.cc/
  - Large collection with metadata
  - Good for comparative studies

- **UCI Network Data Repository** — https://networkdata.ics.uci.edu/
  - Curated networks for research
  - Includes temporal and dynamic networks

### People (Researchers and Practitioners)

- **Albert-László Barabási** — https://barabasi.com/
  - Scale-free networks, network medicine, science of science
  - Excellent science communicator
  - Books: *Linked*, *Network Science*

- **Jon Kleinberg** — http://www.cs.cornell.edu/home/kleinber/
  - Small-world networks, link analysis, information cascades
  - Turing Award winner (2021)
  - Co-author of *Networks, Crowds, and Markets*

- **Jure Leskovec** — https://cs.stanford.edu/people/jure/
  - Large-scale network analysis, graph neural networks
  - SNAP project lead, CS224W instructor
  - Pinterest, Snapchat research connections

- **Mark Newman** — http://www-personal.umich.edu/~mejn/
  - Community detection (Newman-Girvan algorithm), modularity
  - Statistical physics of networks
  - Author of *Networks: An Introduction*

- **Duncan Watts** — https://duncanjwatts.com/
  - Small-world networks (Watts-Strogatz model)
  - Computational social science
  - Books: *Six Degrees*, *Everything Is Obvious*

- **Matthew O. Jackson** — https://web.stanford.edu/~jacksonm/
  - Economic networks, network formation
  - Game theory on networks
  - Author of *Social and Economic Networks*, *The Human Network*

- **Santo Fortunato** — https://www.santofortunato.net/
  - Community detection, complex systems
  - Highly cited reviews on community detection methods

- **Aaron Clauset** — https://aaronclauset.github.io/
  - Power laws, network inference, computational social science
  - Important work on rigorous power-law testing
  - Paper: "Power-law distributions in empirical data" (must-read for Lesson 15)

### Unexpected Connections

- **The Strength of Weak Ties** (Mark Granovetter, 1973) — https://www.jstor.org/stable/2776392
  - Classic sociology paper: weak ties (acquaintances) matter more for job finding than strong ties (close friends)
  - Bridges betweenness centrality to social outcomes
  - Drop this during centrality lessons (8-11)

- **Six Degrees of Kevin Bacon** — https://oracleofbacon.org/
  - Fun application of shortest paths and small-world property
  - Use as icebreaker or real-world example (Lesson 13)

- **Network Medicine** (Barabási Lab) — https://www.barabasilab.com/research/network-medicine
  - Disease genes cluster in networks, network-based drug discovery
  - Shows how network thinking revolutionizes biology and medicine
  - Great for real-world lessons

- **The Friendship Paradox** (Scott Feld, 1991) — https://www.journals.uchicago.edu/doi/10.1086/229693
  - "Your friends have more friends than you do" (on average)
  - Mathematical consequence of degree distribution heterogeneity
  - Mind-bending example for Lesson 15

- **Network Effects in Technology** (W. Brian Arthur, Brian Arthur) — 
  - How network structure drives tech company valuations (Facebook, Airbnb)
  - Positive feedback, winner-take-all markets
  - Economics application for Lesson 6 or real-world examples

- **Brain Connectomics** (Human Connectome Project) — https://www.humanconnectome.org/
  - Mapping the brain as a network
  - Small-world structure, rich-club organization
  - Cross-disciplinary application (neuroscience + networks)

- **The Structure and Function of Complex Networks** (Mark Newman, 2003) — https://arxiv.org/abs/cond-mat/0303516
  - Classic review paper, highly cited
  - Comprehensive overview of network properties and models
  - Good reference for students who want deeper dives

## Tools by Use Case

### For Visualization
- **Gephi** — best for interactive exploration, filtering, and producing publication figures
- **NetworkX + Matplotlib** — programmatic plotting, integrated with analysis code
- **Cytoscape** — domain-specific (biology, but customizable)
- **D3.js / Observable** — web-based, interactive, shareable

### For Analysis
- **NetworkX** — best for learning, prototyping, medium-scale (< 1M nodes)
- **igraph** — faster for large graphs, good R integration
- **graph-tool** — fastest, Bayesian inference methods, steep learning curve
- **SNAP** — massive graphs (billions of edges), C++ with Python interface

### For Diffusion/Dynamics
- **NetworkX** — basic diffusion, SI/SIR models
- **EoN (Epidemics on Networks)** — https://github.com/springer-math/Mathematics-of-Epidemics-on-Networks
- **NDlib** — https://ndlib.readthedocs.io/ — network diffusion library (Python)

### For Machine Learning on Graphs
- **PyTorch Geometric** — graph neural networks
- **DGL (Deep Graph Library)** — https://www.dgl.ai/
- **NetworkX** — feature engineering for traditional ML

## Recommended Learning Path Supplements

### Alongside Lessons 1-7 (Foundations):
- Read Barabási Chapter 1-2 (Introduction, Graph Theory)
- Complete NetworkX tutorial: https://networkx.org/documentation/stable/tutorial.html
- Load and visualize a SNAP dataset in Gephi

### Alongside Lessons 8-11 (Centrality):
- Read Easley & Kleinberg Chapters 3-4 (Strong and Weak Ties, Networks in Context)
- Watch CS224W Lecture 2-3 (Network Properties, Centrality)
- Granovetter's "Strength of Weak Ties" paper

### Alongside Lessons 12-18 (Structure):
- Read Barabási Chapters 3-4 (Random Networks, Scale-Free Property)
- Watts & Strogatz 1998 paper (small-world networks)
- Clauset et al. 2009 paper (power-law testing) — skim for intuition, not full rigor

### Alongside Lessons 19-23 (Communities):
- Read Newman 2004 paper (modularity and community detection)
- Watch CS224W Lecture on Community Detection
- Experiment with Louvain algorithm in NetworkX

### Alongside Lessons 24-28 (Models and Dynamics):
- Read Barabási Chapters 5-6 (Barabási-Albert Model, Evolving Networks)
- Read Easley & Kleinberg Chapters 19-21 (Cascading Behavior, Network Effects)
- Explore diffusion simulations with NDlib or EoN

## Assessment Resources

### Practice Datasets for Teach-Back Lessons
- **Lesson 5**: Student collaboration network (build from course enrollment data)
- **Lesson 11**: arXiv co-authorship network (SNAP: ca-GrQc)
- **Lesson 18**: Internet AS topology (SNAP: as-733)
- **Lesson 23**: Reddit hyperlink network (SNAP: soc-RedditHyperlinks)

### Coding Challenges
- **Rosalind Graphs** — https://rosalind.info/problems/topics/graphs/
  - Bioinformatics-flavored graph problems
  - Good for algorithmic practice

- **LeetCode Graph Problems** — https://leetcode.com/tag/graph/
  - Standard graph algorithms
  - Practice for interviews, algorithmic thinking

### Research Paper Collections
- **Network Science Review Papers**:
  - Newman (2003): The structure and function of complex networks
  - Fortunato (2010): Community detection in graphs
  - Barabási & Albert (1999): Emergence of scaling in random networks
  - Watts & Strogatz (1998): Collective dynamics of 'small-world' networks

## Additional Reading (For Curious Students)

- **Linked** by Albert-László Barabási (2002) — popular science book on network science
- **Six Degrees** by Duncan Watts (2003) — small-world networks and their implications
- **Bursts** by Albert-László Barabási (2010) — human dynamics and temporal networks
- **The Human Network** by Matthew O. Jackson (2019) — how social networks shape our lives
- **Connected** by Nicholas Christakis & James Fowler (2009) — social contagion and influence

## Journals and Conferences (For Advanced Students)

- **Journals**: *Network Science* (Cambridge), *Nature Physics* (networks section), *Physical Review E*, *PNAS*, *Science*
- **Conferences**: NetSci (International School and Conference on Network Science), KDD, WWW, ICWSM
