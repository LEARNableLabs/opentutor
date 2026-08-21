# Network Science — Resources

## Primary Sources (for lesson content)

- **Network Science** by Albert-László Barabási — comprehensive, visually rich, free online textbook at http://networksciencebook.com/. Covers all major topics from foundations to dynamics. Excellent for intermediate learners, balances intuition with mathematical rigor. Use chapters 1-5 (foundations, random networks, scale-free) and chapters 7, 9-10 (centrality, communities, epidemics).

- **Networks** by Mark Newman — more mathematically rigorous textbook. Good companion for students who want deeper formalism. Covers random graphs, small-world, epidemics, and community detection with mathematical detail. Use selectively when students ask "why" questions about mechanics.

- **Stanford CS224W: Machine Learning with Graphs** — http://web.stanford.edu/class/cs224w/. Excellent lecture slides and materials. Covers network structure, community detection, influence, and modern applications. Good for computational perspective and real-world datasets.

- **NetworkX Documentation** — https://networkx.org/documentation/stable/. Essential reference for Python implementation. Tutorials, examples, and API documentation for all major algorithms.

## Supplementary (for engagement)

### Videos

- **Stanford Online YouTube channel** — https://www.youtube.com/user/stanfordonline — search for CS224W lectures by Jure Leskovec. High-quality video lectures on network analysis and graph neural networks.

- **Complexity Explorer** — https://www.complexityexplorer.org/ — Santa Fe Institute's free online courses. "Introduction to Complexity" includes network science modules. Video lectures, simulations, and interactive exercises.

- **3Blue1Brown** — https://www.youtube.com/c/3blue1brown — excellent animated explanations of graph algorithms, PageRank, and mathematical concepts underlying network science.

- **Albert-László Barabási TED talk** — "The Real Achilles Heel of the Internet" — discusses network vulnerability and robustness. Great motivational resource for epidemic dynamics module.

### Interactive Tools

- **Gephi** — https://gephi.org/ — open-source network visualization and exploration platform. Desktop application for interactive graph exploration, layout algorithms, and statistical analysis. Essential for visualizing real datasets.

- **Network Science book interactive demos** — http://networksciencebook.com/ has embedded interactive visualizations for preferential attachment, random networks, and epidemic spreading. Use during lessons to show dynamics in real-time.

- **NetLogo Models Library** — https://ccl.northwestern.edu/netlogo/models/ — agent-based simulation platform with pre-built network models. "Virus on a Network", "Preferential Attachment", "Small Worlds" models great for experimentation.

- **NetworkX Jupyter notebooks** — students should create notebooks to explore concepts interactively. Combine visualization (matplotlib), computation (NetworkX), and annotation.

### Code and Datasets

- **Stanford Network Analysis Project (SNAP)** — https://snap.stanford.edu/ — massive collection of real-world network datasets (social networks, web graphs, collaboration networks, citation networks). SNAP Python library also available. Use ego-Facebook, ego-Twitter, and wiki-Vote for hands-on lessons.

- **Network Repository** — http://networkrepository.com/ — curated collection of hundreds of network datasets across domains. Searchable by type, size, properties.

- **NetworkX GitHub** — https://github.com/networkx/networkx — source code and examples. Students can read implementations of algorithms to understand mechanics.

- **EpiModel** — R package for epidemic modeling on networks. Good alternative for students more comfortable with R than Python.

### People and Research Groups

- **Albert-László Barabási** — Northeastern University. Pioneer of scale-free networks and preferential attachment. Follow his research group for latest work in network medicine, science of success.

- **Mark Newman** — University of Michigan. Major contributions to community detection, random graphs, epidemic modeling on networks.

- **Jure Leskovec** — Stanford University. CS224W instructor, SNAP lead. Focuses on large-scale social networks, information diffusion, graph neural networks.

- **Duncan Watts** — Microsoft Research. Co-discoverer of small-world networks (Watts-Strogatz model). Work bridges network science and social science.

- **Alessandro Vespignani** — Northeastern University. Leader in computational epidemiology, modeling COVID-19 spread using network and mobility data.

- **Jon Kleinberg** — Cornell University. Information networks, cascades, algorithmic game theory on networks.

### Unexpected Connections

- **Network medicine** — Barabási's work connecting disease networks to drug targets. "Diseases are network perturbations, drugs are network interventions." Ties biology to graph theory.

- **The friendship paradox in social media** — viral sociology paper explaining why your friends have more friends, get more likes, seem happier. Statistical bias from network sampling. Great for social network module.

- **Financial contagion and systemic risk** — 2008 financial crisis viewed through network lens. Banks as nodes, credit relationships as edges. Shows networks aren't just social — they're economic infrastructure.

- **Power grid blackouts as cascading failures** — 2003 Northeast blackout explained by network fragility. Connects epidemic models to infrastructure resilience.

- **Wikipedia link structure** — "Six degrees of Wikipedia" phenomenon. Any article is ~4-5 clicks from any other. Small-world property in knowledge networks.

- **Protein-protein interaction networks** — cellular function emerges from network topology. Hubs (highly connected proteins) are often essential genes — remove them and organism dies. Connects to epidemic vulnerability.

## Domain-Specific Tools

- **igraph** — https://igraph.org/ — R and Python library for network analysis. Alternative to NetworkX with different algorithmic strengths (especially for community detection).

- **graph-tool** — https://graph-tool.skewed.de/ — high-performance Python library using C++ backend. For students needing to analyze very large networks (millions of nodes).

- **Cytoscape** — https://cytoscape.org/ — biological network visualization platform. Useful if student extends to computational biology applications.

- **GEXF file format** — graph exchange XML format supported by Gephi and other tools. Good for sharing network data between platforms.

## Papers and Articles (Advanced Students)

- Watts & Strogatz (1998) "Collective dynamics of 'small-world' networks" — Nature. The original small-world paper.

- Barabási & Albert (1999) "Emergence of scaling in random networks" — Science. The original scale-free/preferential attachment paper.

- Newman (2006) "Modularity and community structure in networks" — PNAS. Foundational community detection paper.

- Pastor-Satorras & Vespignani (2001) "Epidemic spreading in scale-free networks" — Physical Review Letters. Epidemic threshold on heterogeneous networks.
