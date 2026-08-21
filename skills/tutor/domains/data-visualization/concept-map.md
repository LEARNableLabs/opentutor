# Information Design and Data Visualization — Concept Map

## Core Concepts (in learning order)

1. **Pre-attentive processing** — visual features your brain processes automatically (<200ms) without conscious effort
2. **Visual encoding channels** — ways to map data to visual properties (position, length, color, size, shape, angle)
3. **Marks and channels framework** — systematic approach to choosing visual representations (points, lines, areas)
4. **Cleveland-McGill hierarchy** — ranking of encoding effectiveness (position > length > angle > area > color)
5. **Gestalt principles** — how the brain groups visual elements (proximity, similarity, continuity, closure). Depends on: pre-attentive processing
6. **Cognitive load** — mental effort required to interpret a visualization. Depends on: encoding choices, Gestalt principles
7. **Data types** — quantitative, categorical, ordinal, temporal, spatial, network. Foundation for encoding decisions
8. **Comparison accuracy** — how precisely viewers can compare values. Depends on: Cleveland-McGill hierarchy, encoding choice
9. **Chart selection strategy** — matching data type and question to visualization form. Depends on: data types, encoding effectiveness
10. **Distribution visualization** — histograms, density plots, box plots for showing data spread. Depends on: data types, binning
11. **Hierarchical visualization** — treemaps, sunbursts for nested data. Depends on: data types, space-filling layouts
12. **Faceting and small multiples** — repeating chart structure across categories. Depends on: Gestalt principles, comparison accuracy
13. **Data-ink ratio** — proportion of ink devoted to data vs decoration (Tufte principle)
14. **Chartjunk** — unnecessary visual elements that distract from data. Depends on: data-ink ratio
15. **Lie factor** — degree of visual distortion relative to data distortion. Depends on: scaling, aspect ratio
16. **Visual manipulation** — techniques that mislead (truncated axes, aspect ratio games). Depends on: lie factor, perception
17. **Ethical visualization** — commitment to accuracy, transparency, accessibility. Depends on: lie factor, manipulation awareness
18. **Color theory for data** — sequential, diverging, categorical palettes. Depends on: data types, perception
19. **Perceptual uniformity** — color spaces where visual distance matches perceptual distance (Lab, HCL)
20. **Color accessibility** — designing for color vision deficiency. Depends on: color theory, redundant encoding
21. **WCAG standards** — Web Content Accessibility Guidelines for contrast, alt text, keyboard nav. Depends on: color accessibility
22. **Exploratory vs explanatory** — analysis vs communication modes. Determines visualization approach
23. **Narrative arc** — structure for guiding viewer through data story. Depends on: exploratory vs explanatory
24. **Visual hierarchy** — directing attention through size, position, color, contrast. Depends on: pre-attentive processing, Gestalt
25. **Annotation and highlighting** — adding context and guiding focus. Depends on: visual hierarchy, narrative arc
26. **Progressive disclosure** — revealing complexity gradually. Depends on: cognitive load, narrative arc
27. **Scrollytelling** — narrative technique using scroll-driven animations. Depends on: progressive disclosure, narrative arc
28. **Tool comparison** — understanding tradeoffs between libraries (D3 vs Tableau vs Python/R). Depends on: use case, interactivity needs
29. **Interaction patterns** — filter, zoom, brush, drill-down, tooltips. Depends on: cognitive load, exploratory vs explanatory
30. **Dashboard design** — multi-chart layouts for monitoring. Depends on: visual hierarchy, cognitive load, interaction patterns
31. **Data binding** — connecting data to visual elements programmatically. Technical foundation for D3/Observable
32. **State management** — handling user interactions and updates. Depends on: data binding, interaction patterns
33. **Uncertainty visualization** — representing confidence, error, probability. Depends on: data types, ethical visualization
34. **Network visualization** — node-link diagrams, adjacency matrices. Depends on: data types, layout algorithms

## Dependencies

### Perception forms the foundation
- **Pre-attentive processing** → Gestalt principles → visual hierarchy → annotation strategies
- **Cleveland-McGill hierarchy** → encoding choices → chart selection → all specific chart types
- Without understanding perception, design choices are arbitrary

### Data types drive encoding
- **Data types** (quantitative/categorical/temporal) determine which encodings are valid
- **Comparison accuracy** depends on both encoding type AND data type
- Can't choose charts without first understanding your data structure

### Ethics builds on technical knowledge
- **Lie factor** and **visual manipulation** require understanding perception and encoding first
- **Accessibility** depends on color theory, redundant encoding, and technical standards
- Ethics isn't separate from technique — it emerges from deep understanding

### Storytelling synthesizes everything
- **Narrative arc** requires: chart selection, visual hierarchy, annotation, progressive disclosure
- **Scrollytelling** builds on: narrative + interaction + technical implementation
- You can't tell good stories without mastering the foundations first

### Tools enable implementation
- **Interaction patterns** require understanding both perception (what's natural) and technical capability
- **Dashboard design** synthesizes: layout, hierarchy, cognitive load, interaction
- **Data binding** and **state management** are technical prerequisites for custom interactive work

## Bottlenecks

### Chart selection is the first major bottleneck
- Lessons 6-10 require synthesizing: data types, encoding effectiveness, comparison accuracy
- Students often jump to familiar charts without analyzing the question
- Mastery signal: can articulate WHY a choice is better, not just WHAT to choose

### Color is deceptively complex
- Lessons 16-18 require understanding: perception, accessibility, data types, color spaces
- Common mistake: treating color as purely aesthetic
- Mastery signal: designs that work in grayscale AND color, with proper redundancy

### Storytelling requires synthesis
- Lessons 19-22 demand integration of all prior concepts
- Students who master technique but not communication struggle here
- Mastery signal: can critique narrative effectiveness, not just technical accuracy

### Interactive implementation has a steep curve
- Lessons 24-27 require new technical skills (coding, state management)
- Conceptual understanding doesn't automatically transfer to implementation
- Mastery signal: can debug interaction issues by reasoning about state

## Prerequisite Topics

### Essential prerequisites
- **Basic statistics** (mean, median, distribution, correlation) — needed for: data types, distribution viz, uncertainty
- **Spreadsheet or data manipulation** — needed for: data cleaning, aggregation, chart preparation
- **Basic charts exposure** — needed for: chart selection, critique, comparison

### Helpful but not required
- **Programming experience** (any language) — accelerates: tool adoption, D3/Observable, custom viz
- **Design fundamentals** — helps with: layout, hierarchy, typography, but we teach viz-specific design
- **HTML/CSS/JavaScript** — required only for web-based interactive tools (lessons 24-27)

## Common Misconceptions

### "More data = better visualization"
- Reality: cognitive load limits how much can be shown effectively
- Connected to: chartjunk, dashboard design, progressive disclosure
- Address in: lessons 11-14, 26

### "Color makes charts better"
- Reality: color should encode meaning, not just decorate
- Connected to: data-ink ratio, accessibility, perception
- Address in: lessons 16-17, with callbacks throughout

### "3D makes data more impressive"
- Reality: 3D usually reduces comparison accuracy (occlusion, perspective distortion)
- Connected to: Cleveland-McGill, lie factor, chartjunk
- Address in: lessons 2, 11, 13

### "Pie charts are always bad"
- Reality: part-to-whole with 2-3 segments can work; many alternatives are better for most uses
- Connected to: comparison accuracy, chart selection
- Address in: lessons 5, 9

### "Interactivity makes everything better"
- Reality: unnecessary interaction adds complexity; use when it genuinely aids exploration
- Connected to: cognitive load, exploratory vs explanatory
- Address in: lessons 19, 24-26

### "Beautiful = effective"
- Reality: aesthetics serve communication; engagement without clarity is decoration
- Connected to: Tufte principles, storytelling, audience needs
- Address in: lessons 11-12, 19-21

## Concept Clusters

### The Perception Cluster (lessons 1-5)
Pre-attentive processing → encoding channels → Gestalt → data types → comparison
Foundation for all other work

### The Selection Cluster (lessons 6-10)
Chart types, when to use what, matching questions to forms
First major synthesis point

### The Design Cluster (lessons 11-14)
Tufte principles, clarity vs engagement, manipulation, ethics
Critical analysis skills

### The Color Cluster (lessons 16-18)
Color theory → accessibility → WCAG
Technical depth on one encoding channel

### The Narrative Cluster (lessons 19-22)
Exploratory vs explanatory → hierarchy → annotation → synthesis
Communication over technique

### The Tool Cluster (lessons 24-27)
Library comparison → interaction patterns → dashboards → implementation
Technical implementation skills

### The Advanced Cluster (lessons 28-29)
Uncertainty, networks — specialized topics for depth
