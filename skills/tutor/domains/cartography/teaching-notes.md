# Cartography — Teaching Notes

## Approach

Cartography sits at the intersection of mathematics, design, and critical thinking. At the intermediate level, move beyond "how to make a map" to "how maps work and what they do." The key pedagogical challenge is balancing three dimensions: *technical foundations* (projections, coordinate systems), *design craft* (visual hierarchy, color, typography), and *critical interpretation* (bias, power, persuasion).

Use a **show-then-analyze** approach: start with concrete examples of maps (good and bad), then unpack the principles behind them. For technical topics (projections), use interactive tools immediately—students need to *see* distortion to understand it. For design topics, use before/after comparisons and map critiques. For critical topics, use controversial or persuasive maps to surface assumptions.

At intermediate level, students should wrestle with trade-offs rather than seeking "correct answers." Every projection sacrifices something; every design choice emphasizes some information over other information. Comfort with ambiguity is the goal.

## Common Misconceptions

1. **"The Mercator projection is wrong"**
   - **Why students think this:** Popular science articles and social media posts frame Mercator as a villain
   - **Correction:** Mercator is *conformal* (preserves angles), which makes it perfect for navigation. It's not wrong, it's *misused* when people use it for area comparisons. Teach projection properties, not projection morality

2. **"Google Maps uses Mercator"**
   - **Why students think this:** It looks like Mercator
   - **Correction:** Google Maps uses *Web Mercator* (EPSG:3857), a modified version that treats Earth as a sphere instead of ellipsoid. Explain why: it makes tile math simpler for web rendering

3. **"Bigger/brighter/redder means more important"**
   - **Why students think this:** Perceptual intuition
   - **Correction:** Visual salience (what stands out) is separate from data magnitude. Color, size, and saturation can encode data *or* hierarchy—students must consciously choose which

4. **"You can just pick pretty colors"**
   - **Why students think this:** Design seems subjective
   - **Correction:** Color schemes must match data type (sequential for ordered data, diverging for data with a meaningful midpoint, qualitative for categories). Introduce ColorBrewer and the Brewer taxonomy

5. **"Choropleth maps show density"**
   - **Why students think this:** They see counts mapped to areas
   - **Correction:** Choropleth maps show *rates* (normalized data), not raw counts. Mapping population counts to area is misleading—large but empty areas dominate visually. Introduce the modifiable areal unit problem (MAUP)

6. **"GIS software will make good design choices for me"**
   - **Why students think this:** Default settings exist for a reason
   - **Correction:** Default color schemes are often inappropriate (rainbow scales, non-perceptual gradients). Classification schemes (equal interval, quantile, natural breaks) produce radically different maps from the same data. Automation serves speed, not quality

7. **"Maps are neutral/objective representations"**
   - **Why students think this:** Cultural conditioning; maps feel authoritative
   - **Correction:** Every map makes choices (what to include, what projection, what's centered, what's labeled). These choices reflect values. Use historical propaganda maps and modern examples (world maps centered on different countries)

8. **"Projection distortion is a technical problem to be solved"**
   - **Why students think this:** Technology should fix things
   - **Correction:** Distortion is *mathematical*—you cannot flatten a sphere without distortion. It's not a problem to solve but a trade-off to manage. Some distortion is always present

9. **"If you just zoom in enough, you can show everything"**
   - **Why students think this:** Digital maps can zoom infinitely
   - **Correction:** Generalization is always necessary. At large scales, showing every detail creates visual noise. Cartographers must select and simplify meaningfully

10. **"Small multiples are always better than multivariate maps"**
    - **Why students think this:** They've heard "don't overload the map"
    - **Correction:** Both approaches have trade-offs. Small multiples prevent comparison across variables in one location; multivariate maps risk overload. Choice depends on the question being asked

## Level Adjustments

### For Beginners
- Focus on map *use* before map *making*: reading projections, understanding scale, interpreting symbols
- Simplify projection theory: focus on cylindrical/conic/azimuthal families, skip the math
- Provide templates and worked examples for design
- Emphasize "rules" before "breaking rules"

### For Intermediate (This Level)
- Balance theory and practice: *why* projections distort, *how* to choose them
- Introduce systematic design thinking: Bertin's visual variables, hierarchical frameworks
- Add critical analysis: recognize bias, understand persuasive techniques
- Expect students to make and defend design choices, not just follow templates
- Use real-world examples with messy data and unclear "right answers"

### For Advanced
- Dive into mathematical foundations: projection equations, geodesy, computational geometry
- Focus on novel visualization techniques: animated maps, 3D cartography, cartograms
- Study history and philosophy of cartography deeply
- Expect original research or creative projects pushing boundaries
- Emphasize map authorship and ethical responsibility

## Rabbit Holes

These are fascinating tangents to deploy when students are ready:

1. **Peters Projection Controversy (Lesson 9-10)** — The 1970s-80s debate about Eurocentric maps. Peters promoted his equal-area projection as "fairer" but got roasted by cartographers for bad design. Introduces politics of projection choice.

2. **The Mercator Origin Story (Lesson 6-7)** — Gerardus Mercator designed this in 1569 for *maritime navigation* (loxodromes/rhumb lines appear straight). It became a classroom standard by accident, not imperialism. Shows how contexts shift.

3. **The Dymaxion Map (Lesson 24)** — Buckminster Fuller's icosahedral projection with no "up." Unfolds into multiple configurations. Shows there's no natural orientation for Earth.

4. **ColorBrewer's Perceptual Science (Lesson 14-15)** — Cynthia Brewer's research on how humans perceive color gradients. Sequential schemes must be perceptually uniform (equal perceived steps). Connects cartography to vision science.

5. **How Gerrymandering Exploits the Modifiable Areal Unit Problem (Lesson 20)** — Political districts are arbitrary boundaries; redrawing them changes the data patterns you see. Cartography meets political manipulation.

6. **Mark Monmonier's "How to Lie with Maps" (Lesson 25)** — Classic book showing techniques for map propaganda. Not just malicious lies—well-intentioned maps can mislead through innocent choices.

7. **Authagraph Projection (Lesson 6)** — 2016 Good Design Award winner, rectangle that preserves area relationships better than most. Shows innovation is still happening.

8. **The "West Wing" Map Projection Scene (Lesson 24)** — TV show scene where Organization of Cartographers for Social Equality advocates for Gall-Peters over Mercator. Great discussion starter on map politics vs. design quality.

## Difficulty Progression Notes

### Early Lessons (1-5): Building Foundation
- Difficulty 1-2: accessible concepts, concrete examples
- Focus: observational skills, basic vocabulary
- Risk: students may find this too easy if they've used maps before
- Mitigation: use surprising examples (maps that look wrong but aren't, optical illusions in maps)

### Projection Arc (6-11): First Challenging Peak
- Difficulty 3-4: abstract mathematical concepts, spatial reasoning
- Focus: understanding *why* distortion happens, not just that it does
- Risk: this is where students often get lost—projections feel arbitrary
- Mitigation: use interactive tools heavily (Projection Playground, Tissot simulators). Make distortion *visible*

### Design Arc (12-18): Back to Concrete
- Difficulty 2-3: perceptual and aesthetic judgments
- Focus: systematic design thinking, not just taste
- Risk: students with design background may coast; students without may feel overwhelmed
- Mitigation: use clear frameworks (Bertin's variables, Gestalt principles) to scaffold decisions

### Thematic Mapping (19-23): Second Peak
- Difficulty 3-4: synthesizing projections + design + data
- Focus: making defendable choices under constraint
- Risk: many "right answers" can paralyze students
- Mitigation: emphasize *justification* over correctness. Use critique format

### Critical/Modern (24-27): Reflection and Synthesis
- Difficulty 2-3: lower technical demand, higher conceptual demand
- Focus: stepping back to see the big picture
- Risk: can feel mushy after concrete technical work
- Mitigation: use provocative examples (propaganda maps, colonial maps, corporate persuasion maps)

## Assessment Strategies

### Formative Assessment
- **Map critiques**: Give students a map and ask them to identify design strengths/weaknesses and potential biases
- **Projection selection exercises**: "You're mapping X for Y audience—which projection and why?"
- **Before/after redesigns**: Take a poorly designed map and improve it, explaining each change
- **Teach-back moments**: "Explain to someone who's never seen a map why Greenland looks huge"

### Summative Assessment
- **Portfolio of maps**: Create 3-5 maps using different techniques (choropleth, proportional symbol, etc.), with written defense of design choices
- **Critical analysis essay**: Analyze a real-world map (news map, propaganda map, advocacy map) for effectiveness, bias, and persuasive techniques
- **Projection recommendation memo**: Technical writing explaining which projection to use for a specific scenario
- **Multivariate thematic map project**: Design a map showing complex data, with full documentation of choices

### Self-Assessment Prompts
- "What surprised you most about projections?"
- "Find a map in the news and identify one misleading design choice"
- "What's one design principle you broke intentionally, and why?"
- "How has your view of maps changed since lesson 1?"
