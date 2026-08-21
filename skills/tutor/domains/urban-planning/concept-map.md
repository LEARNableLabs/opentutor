# Urban Planning and City Science — Concept Map

## Core Concepts (in learning order)

1. **Urban morphology** — the study of physical form and structure of cities, including street patterns and built fabric
2. **Street networks** — the connectivity and topology of streets as a foundational urban system. Depends on: urban morphology
3. **Human scale** — the relationship between built environment dimensions and human perception/experience. Depends on: urban morphology
4. **Density** — concentration of people, buildings, or activities in space; multiple measures and meanings. Depends on: urban morphology
5. **Public space design** — principles for creating successful gathering places and social infrastructure. Depends on: human scale, density
6. **Accessibility** — how easily people can reach destinations via transportation networks. Depends on: street networks
7. **Transit-oriented development (TOD)** — urban development pattern organized around transit stations. Depends on: accessibility, density
8. **Induced demand** — phenomenon where increasing road capacity leads to more traffic. Depends on: street networks, accessibility
9. **Modal hierarchy** — prioritization of different transportation modes (walking, cycling, transit, cars) in street design. Depends on: accessibility
10. **Transportation equity** — fair distribution of transportation benefits and burdens across populations. Depends on: accessibility, modal hierarchy
11. **Systems thinking** — understanding how urban components interact and influence each other. Depends on: all previous concepts (integrative)
12. **Euclidean zoning** — separation of land uses into distinct districts (residential, commercial, industrial). Foundation concept
13. **Exclusionary zoning** — regulations that restrict housing types, often creating segregation and affordability barriers. Depends on: Euclidean zoning
14. **Form-based codes** — regulations that control building form rather than use. Depends on: Euclidean zoning, urban morphology
15. **Regulatory impacts** — how land use rules shape the built environment and social outcomes. Depends on: exclusionary zoning, form-based codes
16. **Urban analytics** — computational methods for understanding cities through data. Foundation concept
17. **Spatial data** — georeferenced information about urban phenomena. Depends on: urban analytics
18. **Network topology** — mathematical structure of networks, applicable to streets, transit, utilities. Depends on: street networks, urban analytics
19. **Agent-based modeling** — simulation technique where individual agents interact to produce emergent patterns. Depends on: urban analytics, systems thinking
20. **Climate adaptation** — strategies for cities to prepare for and respond to climate change impacts. Foundation concept
21. **Resilience** — capacity of urban systems to absorb shocks and maintain function. Depends on: systems thinking, climate adaptation
22. **Green infrastructure** — natural systems integrated into urban fabric for ecosystem services. Depends on: climate adaptation, public space design
23. **Gentrification** — neighborhood change process involving rising property values and demographic shifts. Depends on: density, accessibility
24. **Displacement** — forced relocation of residents due to rising costs. Depends on: gentrification
25. **Participatory planning** — methods for involving communities in planning decisions. Foundation concept
26. **Power dynamics** — distribution of decision-making authority in planning processes. Depends on: participatory planning
27. **Equity frameworks** — analytical tools for evaluating fairness of planning outcomes. Depends on: transportation equity, displacement, participatory planning
28. **Trade-offs** — tensions between competing planning objectives (e.g., density vs. open space). Depends on: systems thinking, equity frameworks

## Dependencies and Learning Progression

### Foundation Layer (Lessons 1-5)
Start with **observable urban form** — what students can see and experience directly in cities. Build intuition about morphology, networks, scale, density, and public space before introducing analytical frameworks.

- **Urban morphology → Street networks** — can't analyze networks without understanding what we're looking at
- **Urban morphology → Human scale** — form creates the experience
- **Urban morphology + Street networks → Density** — physical structure enables different density patterns
- **Human scale + Density → Public space design** — successful spaces balance intimacy and activity

### Movement Systems Layer (Lessons 6-10)
Build from spatial structure to **how people move** through cities. Connect physical networks to accessibility, equity, and behavior.

- **Street networks → Accessibility** — networks structure access
- **Accessibility + Density → TOD** — transit works when development is concentrated at stations
- **Street networks + Accessibility → Induced demand** — network expansion paradoxes
- **Accessibility → Modal hierarchy** — different modes have different access characteristics
- **Accessibility + Modal hierarchy → Transportation equity** — fairness requires understanding who can access what via which modes

### Regulatory Layer (Lessons 12-15)
After understanding **what cities look like**, explore **why they look that way** — the regulatory frameworks that shape development.

- **Urban morphology ↔ Euclidean zoning** — bidirectional: zoning creates form, but zoning categories reflect existing form
- **Euclidean zoning → Exclusionary zoning** — separation enables exclusion
- **Euclidean zoning + Urban morphology → Form-based codes** — alternative approach learning from morphological analysis
- **All zoning concepts → Regulatory impacts** — synthesis of how rules shape outcomes

### Computational Layer (Lessons 16-19)
With physical, social, and regulatory understanding, introduce **analytical tools** to measure and model cities.

- **Urban morphology + Spatial data → Urban analytics** — need something to analyze
- **Street networks + Urban analytics → Network topology** — apply graph theory to physical networks
- **Systems thinking + Urban analytics → Agent-based modeling** — computational simulation of complex interactions

### Synthesis Layer (Lessons 21-26)
Apply all previous learning to **contemporary challenges** requiring integrated solutions.

- **Systems thinking + Climate adaptation → Resilience** — resilience is systemic property
- **Climate adaptation + Public space design → Green infrastructure** — natural systems in urban contexts
- **Density + Accessibility → Gentrification** — improvement can create pressure
- **Gentrification → Displacement** — consequence and equity concern
- **Power dynamics → Participatory planning** — who decides matters
- **Transportation equity + Displacement + Participatory planning → Equity frameworks** — integrated approach to fairness
- **Systems thinking + Equity frameworks → Trade-offs** — recognize tensions, make informed choices

## Prerequisite Topics (from outside this curriculum)

- **Basic geography and maps** — needed for: spatial data, urban morphology
- **Social systems and policy** — needed for: zoning, participatory planning, equity frameworks
- **Graph concepts** — needed for: network topology (though can be taught concurrently)
- **Data literacy** — needed for: urban analytics, spatial data

## Key Conceptual Bottlenecks

### Systems Thinking (Lesson 11)
**Why it's a bottleneck:** Required to understand how transportation, land use, and social systems interact. Students who don't develop systems intuition will struggle with later synthesis lessons.

**Teaching approach:** Use concrete examples of feedback loops and cascading effects. Visual diagrams of causal relationships.

### Induced Demand (Lesson 7)
**Why it's a bottleneck:** Counter-intuitive network effect that challenges common assumptions. Understanding this shifts mental model from "capacity = solution" to "capacity shapes behavior."

**Teaching approach:** Use historical examples, visualizations of before/after traffic patterns, and analogies to other network systems.

### Regulatory Archaeology (Lesson 15)
**Why it's a bottleneck:** Requires looking at built environment and reverse-engineering the regulatory logic. Synthesizes morphology knowledge with policy understanding.

**Teaching approach:** Guided analysis with specific examples, then independent exploration.

### Gentrification and Displacement (Lessons 22)
**Why it's a bottleneck:** Politically charged and emotionally complex. Students may bring strong priors. Understanding requires integrating economic, spatial, and social dimensions.

**Teaching approach:** Lead with data and mechanisms before value judgments. Acknowledge complexity and multiple perspectives while maintaining analytical rigor.

## Common Misconceptions

1. **"Density always means tall buildings"** — Density can be achieved through many built forms; mid-rise with continuous frontage often denser than isolated towers. Addressed in: Lesson 3

2. **"More roads solve traffic"** — Induced demand and network effects mean capacity expansion often fails. Addressed in: Lesson 7

3. **"Zoning just organizes uses"** — Zoning has profound social and economic consequences beyond spatial organization. Addressed in: Lessons 12-13

4. **"Data-driven planning is objective"** — Data collection, analysis, and interpretation all involve choices that embed values. Addressed in: Lessons 16, 24

5. **"Gentrification is inevitable"** — While neighborhood change occurs, displacement is a policy choice mediated by regulations and interventions. Addressed in: Lesson 22

6. **"Participation means everyone agrees"** — Genuine participation surfaces conflicts and power dynamics; consensus is rare and not always the goal. Addressed in: Lesson 23

7. **"Sustainable = environmental"** — True sustainability requires integrating environmental, social, and economic dimensions. Addressed throughout: Lessons 21-24

## Unexpected Connections (for engagement)

- **Urban morphology ↔ Epidemiology** — network structure affects disease spread (especially relevant post-COVID)
- **Street networks ↔ Neuroscience** — wayfinding and cognitive maps
- **Zoning ↔ Genetics** — regulatory switches that turn possibilities on/off
- **Agent-based modeling ↔ Ecology** — emergent patterns in cities and ecosystems
- **Public space ↔ Democracy** — physical infrastructure of civic life
- **Density ↔ Information theory** — concentration of interactions and innovation
