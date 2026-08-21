# Information Design and Data Visualization — Teaching Notes

## Approach

Data visualization sits at the intersection of perception, statistics, design, and communication. At the intermediate level, we move beyond "how to make a bar chart" to "why this encoding works better than that one" — teaching students to reason from principles rather than memorize templates. This topic is uniquely suited to **show, don't tell** pedagogy: use visual examples constantly, contrast good and bad designs, and have students critique real-world visualizations throughout. Balance theory (perception research, encoding effectiveness) with hands-on practice (build things, break things, redesign things). The goal is not to produce chart-makers but **visual thinkers** who can match form to function.

## Common Misconceptions

### 1. "Visualization is about making data pretty"
**Why students think this:** Popular infographics and data art emphasize aesthetics; design is visible while rigor is invisible.

**Why it's wrong:** Beauty without clarity is decoration. Effective visualization serves understanding first. Aesthetics matter, but only in service of communication.

**How to correct:** Start with Tufte's data-ink ratio (lesson 11) and contrast "pretty but confusing" with "plain but clear." Show examples where minimalism wins. Then introduce "clarity AND engagement" (lesson 12) to show beauty has a place, but purpose comes first.

### 2. "3D charts are more engaging and informative"
**Why students think this:** 3D looks sophisticated; PowerPoint and Excel offer 3D options prominently; mimicking infographics they've seen.

**Why it's wrong:** 3D introduces occlusion, perspective distortion, and angle perception issues. Comparison accuracy plummets.

**How to correct:** Show side-by-side comparison in lesson 2 (Cleveland-McGill): can you compare these 3D bars vs 2D bars? Time the task. The 2D version will be faster and more accurate. Revisit in lesson 13 (lie factor) with examples of how 3D exaggerates differences.

### 3. "Color makes charts better"
**Why students think this:** Color is eye-catching; fear of "boring" black-and-white charts.

**Why it's wrong:** Color should encode meaning (category, magnitude, divergence), not just decorate. Gratuitous color adds cognitive load and fails accessibility tests.

**How to correct:** Lessons 16-17 teach color WITH purpose: sequential for magnitude, diverging for deviation, categorical for groups. Show the same chart in grayscale: does it still work? If not, the color wasn't encoding anything meaningful. Reinforce with accessibility (lesson 17): 8% of men are colorblind.

### 4. "More data in one chart = more information"
**Why students think this:** Desire to be comprehensive; fear of oversimplifying; equating complexity with sophistication.

**Why it's wrong:** Cognitive load limits what viewers can process. Overloaded charts force people to work too hard; they give up or miss the signal.

**How to correct:** Introduce cognitive load in lesson 1, revisit constantly. Show a cluttered dashboard vs small multiples (lesson 9). Teach progressive disclosure (lesson 20) and dashboard design (lesson 26): you can show lots of data by breaking it into digestible chunks, not cramming everything into one view.

### 5. "Pie charts are always bad" (the overcorrection)
**Why students think this:** They read that data viz experts hate pie charts; want to follow "best practices."

**Why it's wrong:** Pie charts are suboptimal for precise comparison but okay for rough part-to-whole with 2-3 segments. Dogmatism misses nuance.

**How to correct:** Lesson 5 directly addresses this. Teach WHY pie charts struggle (angle/area perception) and WHEN alternatives are better (almost always), but also show acceptable use cases (simple proportions, high-level overview). Critical thinking over rules.

### 6. "If I make it interactive, people will explore and find insights"
**Why students think this:** Interactivity feels modern and empowering; they've seen impressive interactive pieces online.

**Why it's wrong:** Most viewers won't explore. Unnecessary interaction adds friction. Interactive works best when the question demands exploration OR when you're building for repeated use (dashboards).

**How to correct:** Lesson 19 distinguishes exploratory (for you, the analyst) from explanatory (for your audience). Lesson 25 teaches interaction patterns but emphasizes **purposeful interaction**: filter when data is too large to show at once, zoom when detail matters, etc. Not interactivity for its own sake.

### 7. "Statistical charts are objective; narrative is spin"
**Why students think this:** Charts feel scientific and neutral; storytelling feels like manipulation.

**Why it's wrong:** Every chart makes choices (what to show, what to omit, what to highlight). Narrative isn't spin — it's making your argument clear. The alternative to intentional narrative is unintentional confusion.

**How to correct:** Lessons 19-22 frame storytelling as SERVICE to the reader, not manipulation. Show examples of clear narrative (Pudding, Storytelling with Data) where the argument is transparent. Contrast with misleading charts (lesson 13-14) where the manipulation is hidden. Honest narrative is ethical; hidden narrative is not.

### 8. "Tools don't matter; it's all about the design"
**Why students think this:** Want to stay tool-agnostic; fear of committing to one technology.

**Why it's wrong:** Tools shape what's possible. D3 gives full control but requires coding. Tableau is fast but limits customization. Tool choice IS a design decision.

**How to correct:** Lesson 24 explicitly compares tool tradeoffs. Teach students to match tool to task: quick exploratory → Tableau/Observable Plot; custom interactive → D3; publication-ready static → ggplot2/matplotlib. The best designers know multiple tools and pick the right one.

### 9. "I need to show all the data to be complete"
**Why students think this:** Fear of accusations of cherry-picking; academic training emphasizes completeness.

**Why it's wrong:** Aggregation and filtering are necessary to reveal patterns. Showing everything often hides everything.

**How to correct:** Lesson 4 (data types) and lesson 10 (messy datasets) teach aggregation as a tool for clarity. Show examples where summary statistics (mean, median) or filtering (top 10, outliers removed) make the signal visible. Transparency matters: document what you filtered and why.

### 10. "Good visualization is intuitive; if you need to explain it, you failed"
**Why students think this:** Minimalism dogma; fear that needing context = bad design.

**Why it's wrong:** Complex data often requires context. Annotation, titles, axis labels, and legends aren't failures — they're guidance.

**How to correct:** Lessons 20-22 emphasize annotation and context as part of narrative. Show examples from Pudding and Flowing Data where explanation enhances rather than apologizes. The goal is "as simple as possible, but no simpler."

## Level Adjustments

### For beginners (if adapting down)
- Skip: uncertainty visualization (28), advanced interaction patterns (25), network viz (29)
- Add: more Excel/Google Sheets examples, step-by-step tool tutorials
- Slow down: chart selection (lessons 6-10), color theory (16-17)
- Simplify: Tufte principles to "less is more"; no philosophy
- Focus: templates and recipes over principles

### For intermediate (current level)
- Balance: theory (perception, encoding) with practice (build things)
- Emphasis: **critical thinking** — can they explain WHY a choice works?
- Tools: expect coding comfort (Observable, Python, or R), but don't assume mastery
- Rigor: cite research (Cleveland-McGill, Cairo, Munzner) but keep it accessible
- Projects: real messy datasets, not toy examples

### For advanced (if adapting up)
- Add: research papers (Cleveland-McGill, Heer, Munzner), color space math (Lab, HCL), layout algorithms (force-directed, hierarchical edge bundling)
- Deepen: uncertainty (ensemble displays, hypothetical outcome plots), perception studies (crowdsourced evaluations)
- Expand: custom tool-building (contribute to D3, write Observable notebooks), high-dimensional data (UMAP, t-SNE), animation and temporal encoding
- Expect: students can critique visualization research papers, not just popular media

## Rabbit Holes (Fascinating Connections)

### Perception research meets magic tricks
- Drop in lesson 1 or 3: Magicians exploit pre-attentive processing to control attention. Change blindness, inattentional blindness — same mechanisms visualization designers use to guide focus.
- Example: https://www.youtube.com/watch?v=vJG698U2Mvo (The Monkey Business Illusion)

### Hans Rosling and the joy of data storytelling
- Drop in lesson 19-21: Rosling turned statistics into performance art. Watch his TED talks to see how narrative, animation, and enthusiasm transform dry data.
- Example: https://www.ted.com/talks/hans_rosling_the_best_stats_you_ve_ever_seen

### Florence Nightingale and the first data viz that saved lives
- Drop in lesson 13-14 or 19: Nightingale's Coxcomb diagram convinced the British government to improve sanitary conditions in military hospitals, reducing deaths. Visualization as activism.
- Example: https://www.historyofinformation.com/detail.php?id=3815

### The grammar of graphics (Leland Wilkinson)
- Drop in lesson 24 or during chart selection: Every chart is a composition of scales, geometries, and aesthetics. ggplot2 and Vega-Lite implement this systematically. It's like learning the periodic table instead of memorizing molecules.
- Example: https://link.springer.com/book/10.1007/0-387-28695-0

### Bret Victor's "explorable explanations"
- Drop in lesson 25-26: What if every argument came with interactive models? Victor's vision for the future of communication.
- Example: http://worrydream.com/ExplorableExplanations/

### The Pudding's design process
- Drop in lesson 21-22: Behind-the-scenes of how they build visual essays. From pitch to data to design to code.
- Example: https://pudding.cool/process/

### W.E.B. Du Bois's data portraits at the 1900 Paris Exposition
- Drop in lesson 11-12 or 19: Du Bois used hand-drawn visualizations to counter racist narratives about Black Americans. Beauty AND precision AND advocacy.
- Example: https://www.smithsonianmag.com/history/first-time-together-and-color-book-displays-web-du-bois-visionary-infographics-180970826/

### Animation as a seventh visual channel
- Drop in lesson 20-21 or 25: Motion can encode change over time... but it can also confuse. When does animation clarify vs. distract?
- Example: https://observablehq.com/@d3/timed-transitions

### The "Calling Bullshit" course
- Drop in lesson 13-14: University of Washington course on spotting misleading data. Entire lectures on bad visualizations.
- Example: https://www.callingbullshit.org/videos.html

### Nadieh Bremer and Shirley Wu's "Data Sketches"
- Drop in lesson 27 or 21: Two designers tackle the same dataset each month, document the entire process. Shows how design is iterative and personal.
- Example: http://www.datasketch.es/

## Difficulty Progression

### Arc 1: Foundations (lessons 1-5) — gentle entry
- Start at difficulty 2: accessible but not trivial
- Build mental models for perception and encoding
- Students should feel "aha!" not "huh?"

### Arc 2: Chart selection (lessons 6-10) — first peak
- Ramp to difficulty 3-4: synthesis required
- This is where students move from "what" to "why"
- Lesson 10 is the first real challenge: apply everything to a messy dataset

### Arc 3: Design principles (lessons 11-14) — critical thinking
- Mix of 2-4: theory (Tufte) is accessible, critique (misleading charts) requires judgment
- Goal: develop taste and critical eye

### Review 1 (lesson 15) — reset
- Difficulty 1: confidence boost, consolidation
- Check for gaps before moving to color and narrative

### Arc 4: Color and accessibility (lessons 16-18) — depth on one topic
- Difficulty 3-4: color theory is surprisingly complex
- Accessibility (lesson 18) is resource-intensive, not conceptually hard

### Arc 5: Storytelling (lessons 19-22) — second synthesis peak
- Start at 2, build to 4
- Lesson 21-22 are the hardest conceptual challenges: synthesis of technique + communication
- Teach-back in lesson 22 forces mastery

### Review 2 (lesson 23) — creative consolidation
- Difficulty 2: redesign exercise is easier than original synthesis
- Confidence builder before tools

### Arc 6: Tools and interactivity (lessons 24-27) — technical peak
- Difficulty 3-5: lesson 27 (build from scratch) is the hardest hands-on challenge
- This is where coding skills matter most
- Students who struggle here may need to revisit technical prerequisites

### Arc 7: Advanced topics (lessons 28-29) — optional depth
- Difficulty 4-5: specialized topics, not for everyone
- Okay to skip if student wants to focus on practice instead

### Final review (lesson 30) — synthesis project
- Difficulty 2: by this point, students have the tools; execution is easier than the first time
- Celebration of progress

## Pacing Notes

- **Expect struggle at lessons 10, 22, 27** — these are synthesis points. Students should slow down, iterate, even fail first attempts.
- **Lesson 15 and 23 are breathers** — don't rush them. Use review days to identify gaps and revisit shaky concepts.
- **Color (16-18) could expand** — some students will want to go deep on color science. Have resources ready for rabbit holes.
- **Tools (24-27) need hands-on time** — reading isn't enough. Students should type code, break things, debug. Budget extra time.
- **If student is breezing through** — add: research papers, build custom tools, enter Data Viz Society challenges, critique published work
- **If student is struggling** — reduce: fewer lessons per week, add more review days, split complex lessons (e.g., 10, 22, 27) into parts, focus on one tool instead of comparing multiple
