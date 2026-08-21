# Systems Biology and Biological Networks — Resources

## Primary Sources (for lesson content)

### Textbooks

- **Uri Alon, "An Introduction to Systems Biology: Design Principles of Biological Circuits" (2nd ed., 2019)**
  - Gold standard textbook. Clear, example-driven, focuses on design principles and motifs. Perfect for intermediate learners. Emphasizes intuition over heavy math.
  - Chapters 1-8 cover regulatory networks, motifs, and ODE modeling. Chapters 9-10 cover robustness and evolution.
  - Website: https://www.weizmann.ac.il/mcb/UriAlon/

- **Edda Klipp et al., "Systems Biology: A Textbook" (2nd ed., 2016)**
  - Comprehensive, more mathematical than Alon. Covers modeling (ODEs, stochastic, spatial), network types, and applications.
  - Good for students wanting deeper formalism. Chapters on metabolic networks and FBA are excellent.
  - Publisher: Wiley-VCH

- **Albert-László Barabási, "Network Science" (2016)**
  - Foundational text on network theory (not biology-specific). Chapters 1-5 cover topology, scale-free networks, motifs.
  - Freely available online: http://networksciencebook.com/
  - Use for graph theory foundations before applying to biology.

- **Bernhard Palsson, "Systems Biology: Properties of Reconstructed Networks" (2006)**
  - Deep treatment of metabolic networks and constraint-based modeling (FBA). Advanced but authoritative.
  - Best for students interested in metabolism or computational modeling.

### Online Courses

- **MIT 7.32 Systems Biology (MIT OpenCourseWare)**
  - Instructor: Jeff Gore. Covers network motifs, robustness, evolution of cooperation.
  - Video lectures, lecture notes, problem sets available free.
  - URL: https://ocw.mit.edu/courses/7-32-systems-biology-fall-2014/

- **MIT 7.91J Foundations of Computational and Systems Biology (edX)**
  - Broader than systems biology; includes genomics, proteomics, network analysis.
  - Good for computational techniques (alignment, assembly, network inference).
  - URL: https://www.edx.org/course/foundations-of-computational-and-systems-biology

- **Systems Biology: Cell-Cell Communication (Icahn School of Medicine at Mount Sinai, Coursera)**
  - Focuses on signaling networks and crosstalk. Good for lessons 10, 21.
  - URL: https://www.coursera.org/learn/systems-biology

- **Uri Alon's Systems Biology Course (YouTube)**
  - Playlist of lectures from the Weizmann Institute. Matches his textbook.
  - URL: https://www.youtube.com/playlist?list=PLtQIpL_Q5W0x1B0LM3UWWHkRAQUlsqYKn

### Key Review Papers

- **Barabási, A.-L. & Oltvai, Z. N. "Network biology: understanding the cell's functional organization." *Nature Reviews Genetics* 5, 101–113 (2004)**
  - Foundational review. Covers topology, hubs, modularity, motifs.
  - URL: https://www.nature.com/articles/nrg1272

- **Alon, U. "Network motifs: theory and experimental approaches." *Nature Reviews Genetics* 8, 450–461 (2007)**
  - Comprehensive treatment of motifs. Essential reading for lessons 4-5.
  - URL: https://www.nature.com/articles/nrg2102

- **Babu, M. M. et al. "Structure and evolution of transcriptional regulatory networks." *Current Opinion in Structural Biology* 14, 283–291 (2004)**
  - Gene regulatory network architecture and evolution.
  - URL: https://www.sciencedirect.com/science/article/pii/S0959440X04000661

- **Karlebach, G. & Shamir, R. "Modelling and analysis of gene regulatory networks." *Nature Reviews Molecular Cell Biology* 9, 770–780 (2008)**
  - Covers Boolean, ODE, and stochastic models of GRNs.
  - URL: https://www.nature.com/articles/nrm2503

- **Marbach, D. et al. "Wisdom of crowds for robust gene network inference." *Nature Methods* 9, 796–804 (2012)**
  - Network inference methods and benchmarks. For lesson 23.
  - URL: https://www.nature.com/articles/nmeth.2016

## Supplementary (for engagement)

### Videos and Lectures

- **iBiology Systems Biology Talks**
  - Short talks by leaders in the field (Uri Alon, Wendell Lim, Michael Elowitz). High-quality, 20-30 min each.
  - URL: https://www.ibiology.org/systems-biology/

- **Complexity Explorer (Santa Fe Institute)**
  - Free courses on complex systems, including network science and dynamical systems.
  - URL: https://www.complexityexplorer.org/

- **Osmosis: Systems Biology Playlist**
  - Short, accessible videos on signaling pathways, homeostasis, feedback.
  - URL: https://www.osmosis.org/

- **Cell Signaling Technology: Pathway Resources**
  - Video animations of signaling pathways (MAPK, PI3K/Akt, etc.). Beautiful visualizations.
  - URL: https://www.cellsignal.com/science-resources/pathway-resources

### Interactive Tools

- **Cytoscape**
  - Network visualization and analysis platform. Essential tool for lessons 10-11, 24.
  - Plugins: NetworkAnalyzer (topology metrics), clusterMaker (module detection), stringApp (import STRING data).
  - URL: https://cytoscape.org/
  - Tutorials: https://cytoscape.org/cytoscape-tutorials/

- **COPASI (COmplex PAthway SImulator)**
  - ODE simulation, parameter estimation, sensitivity analysis. For lessons 14-18.
  - URL: https://copasi.org/

- **Virtual Cell (VCell)**
  - Spatial and non-spatial simulation of biological systems. More complex than COPASI but powerful.
  - URL: https://vcell.org/

- **CellDesigner**
  - Draw and simulate biochemical networks. Integrates with SBML standards.
  - URL: http://www.celldesigner.org/

- **GINsim (Gene Interaction Network simulation)**
  - Boolean network modeling and analysis. For lesson 16.
  - URL: http://ginsim.org/

- **BioModels Database**
  - Curated repository of published mathematical models. Download and simulate.
  - URL: https://www.ebi.ac.uk/biomodels/

### Databases and Repositories

- **KEGG (Kyoto Encyclopedia of Genes and Genomes)**
  - Metabolic and signaling pathways, manually curated. For lessons 8, 12.
  - URL: https://www.genome.jp/kegg/

- **Reactome**
  - Pathway database with detailed reaction mechanisms. Excellent for signaling.
  - URL: https://reactome.org/

- **STRING (Search Tool for the Retrieval of Interacting Genes/Proteins)**
  - Protein-protein interaction database with confidence scores. For lessons 9, 12.
  - URL: https://string-db.org/

- **BioGRID**
  - Genetic and protein interactions, primarily from high-throughput screens.
  - URL: https://thebiogrid.org/

- **IntAct**
  - Molecular interaction database from EBI. Literature-curated PPIs.
  - URL: https://www.ebi.ac.uk/intact/

- **RegulonDB**
  - Gene regulatory network of *E. coli*. Gold standard for bacterial GRNs.
  - URL: http://regulondb.ccg.unam.mx/

- **Cell Collective**
  - Collaborative platform for building and simulating Boolean models of signaling/regulatory networks.
  - URL: https://cellcollective.org/

### Code and Computational Resources

#### Python
- **NetworkX** — network analysis and algorithms. Essential for lessons 2-5, 20, 24.
  - Docs: https://networkx.org/
  - Tutorial: https://networkx.org/documentation/stable/tutorial.html

- **igraph** — fast network analysis, better than NetworkX for large networks.
  - Docs: https://igraph.org/python/

- **COBRApy** — constraint-based modeling of metabolism (FBA). For lesson 17.
  - Docs: https://opencobra.github.io/cobrapy/
  - Tutorial: https://cobrapy.readthedocs.io/en/latest/getting_started.html

- **PySB** — Python Systems Biology modeling framework (ODEs, stochastic).
  - Docs: http://pysb.org/

#### R
- **igraph (R version)** — network analysis.
  - Docs: https://igraph.org/r/

- **BioNet** — Bioconductor package for network analysis.
  - URL: https://bioconductor.org/packages/release/bioc/html/BioNet.html

- **minet** — mutual information network inference.
  - URL: https://bioconductor.org/packages/release/bioc/html/minet.html

- **RBGL (R Boost Graph Library)** — graph algorithms.
  - URL: https://bioconductor.org/packages/release/bioc/html/RBGL.html

#### MATLAB
- **SimBiology Toolbox** — ODE modeling and simulation.
  - URL: https://www.mathworks.com/products/simbiology.html

- **Bioinformatics Toolbox** — network analysis, pathway tools.
  - URL: https://www.mathworks.com/products/bioinfo.html

### Jupyter Notebooks and Tutorials

- **Systems Biology Course Notebooks (Jeff Gore lab)**
  - Python notebooks for motifs, robustness, evolution. Matches MIT 7.32.
  - Search: MIT Systems Biology Jupyter notebooks

- **Network Science Notebooks (Barabási)**
  - Companion notebooks to "Network Science" textbook.
  - URL: https://github.com/barabasi-lab

- **Computational Systems Biology Book Notebooks**
  - Various authors; search GitHub for "systems biology notebooks" or "network biology notebooks"

## People to Follow (Researchers, Educators, Practitioners)

### Pioneers and Thought Leaders

- **Uri Alon** (Weizmann Institute) — network motifs, design principles, creativity in science
  - Twitter: @UriAlon1; Website: https://www.weizmann.ac.il/mcb/UriAlon/

- **Albert-László Barabási** (Northeastern University) — network science, scale-free networks
  - Twitter: @barabasi; Website: https://barabasi.com/

- **Hiroaki Kitano** (RIKEN, Sony CSL) — systems biology founding figure, robustness theory
  - Website: http://www.kitano.bio/

- **Marc Kirschner** (Harvard Medical School) — cell systems, robustness, evolution
  - Lab: https://kirschner.med.harvard.edu/

- **Wendell Lim** (UCSF) — synthetic biology, cell signaling engineering
  - Twitter: @WendellLim; Lab: https://limlab.ucsf.edu/

### Network Medicine and Applications

- **Albert-László Barabási** (also above) — network medicine, disease modules
  - Book: "The Formula" — on success and network effects

- **Marc Vidal** (Harvard, Dana-Farber) — interactome mapping, network medicine
  - Lab: http://ccsb.dana-farber.org/

- **Roded Sharan** (Tel Aviv University) — network biology, comparative genomics
  - Website: http://www.cs.tau.ac.il/~roded/

### Synthetic Biology and Design

- **Michael Elowitz** (Caltech) — synthetic gene circuits, single-cell variability
  - Lab: http://www.elowitz.caltech.edu/

- **James Collins** (MIT) — synthetic biology, genetic circuits
  - Lab: https://www.collinslab.mit.edu/

- **Christopher Voigt** (MIT) — genetic circuit design, CRISPR applications
  - Twitter: @VoigtLab; Lab: http://voigtlab.mit.edu/

### Computational and Theoretical

- **Chris Wiggins** (Columbia) — network inference, machine learning in biology
  - Twitter: @chris_wiggins

- **Nir Friedman** (Hebrew University) — probabilistic models, network inference
  - Website: http://www.cs.huji.ac.il/~nir/

- **Eduardo Sontag** (Northeastern) — control theory in biology, feedback systems
  - Website: http://sontaglab.org/

### Educators and Science Communicators

- **Uri Alon** (also above) — YouTube lectures, creative approaches
- **Jeff Gore** (MIT) — clear teaching, evolution and ecology in systems
- **Rob Phillips** (Caltech) — physical biology, "back-of-the-envelope" reasoning
  - Website: http://rpgroup.caltech.edu/

## Journals and Publications

### Specialized Journals
- **Molecular Systems Biology** — high-quality, open-access systems biology research
  - URL: https://www.embopress.org/journal/14609183

- **Cell Systems** — applications, methods, and theory
  - URL: https://www.cell.com/cell-systems/home

- **npj Systems Biology and Applications** — Nature partner journal, open-access
  - URL: https://www.nature.com/npjsba/

### Relevant Sections of Broader Journals
- **Nature Reviews Genetics / Molecular Cell Biology** — frequent systems biology reviews
- **PLOS Computational Biology** — computational methods, modeling
  - URL: https://journals.plos.org/ploscompbiol/

- **PLOS ONE / PLOS Biology** — open-access, broad systems biology articles

### Preprint Servers
- **bioRxiv** — biology preprints, search "systems biology" or "biological networks"
  - URL: https://www.biorxiv.org/

## Unexpected Connections (Wild Cards)

### Cross-Disciplinary Links

- **Ecology and food webs** — same network principles (scale-free, modularity) apply to ecosystems. Makes abstract concepts tangible.
  - Resource: "Complexity and the Economy of Nature" (Ulanowicz)

- **Social networks and information spread** — motifs in Twitter networks, influence propagation. Students connect abstract network theory to daily life.
  - Resource: Barabási's "Linked" book (popular science)

- **Economics and supply chain networks** — metabolic networks as supply chains. "Just-in-time" production vs. buffering.
  - Resource: "Network Science" book, Chapter 9 (Network Science in Economics)

- **Neuroscience and brain networks** — structural (connectome) and functional (activity correlations) networks. Same tools, different scale.
  - Resource: Olaf Sporns, "Networks of the Brain"

- **Internet and infrastructure** — router networks are scale-free like protein networks. Robustness to random failure but vulnerable to targeted attacks.
  - Resource: Barabási "Network Science," Chapters 8-9

### Philosophical and Meta Connections

- **Emergent properties** — how system-level behavior arises from component interactions. Philosophy of science angle.
  - Resource: Stuart Kauffman, "The Origins of Order"

- **Reductionism vs. holism** — systems biology as a response to reductionism. Historical and philosophical context.
  - Resource: Evelyn Fox Keller, "Making Sense of Life"

- **Complexity and simplicity** — simple rules (motifs, design principles) generate complex behavior. Beauty in parsimony.
  - Resource: Uri Alon's "How to Choose a Good Scientific Problem" (YouTube talk)

## Recommended Learning Path

For a student following this curriculum:

1. **Start with**: Barabási's "Network Science" (free online) Chapters 1-5 for graph theory foundations
2. **Core text**: Alon's "An Introduction to Systems Biology" — read alongside lessons 1-22
3. **Hands-on**: Install Cytoscape, work through tutorials by lesson 10
4. **Supplement**: MIT 7.32 video lectures (watch in parallel with curriculum)
5. **Code**: Start with NetworkX tutorial by lesson 5; add COBRApy by lesson 17
6. **Stretch**: Read key papers (Barabási & Oltvai 2004, Alon 2007) between modules
7. **Explore**: Browse BioModels, KEGG, STRING databases regularly to build familiarity

## Resource Quality Indicators

When evaluating additional resources:
- **Primary literature**: Look for papers in *Nature*, *Science*, *Cell*, *PNAS*, specialized journals above
- **Courses**: MIT OCW, Stanford, Coursera/edX from major universities
- **Tools**: Actively maintained (GitHub commits in last year), documented, cited in literature
- **Databases**: Curated (not just aggregated), regularly updated, cites sources
- **Videos**: From academic institutions (iBiology, MIT, Stanford) or recognized educators

Avoid:
- Overly simplified pop-sci without depth
- Outdated tools/databases (last update >3 years ago)
- Uncurated "mega-databases" with no quality control
- Videos/courses without clear learning objectives or credentials
