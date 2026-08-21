# Game Design — Teaching Notes

## Approach

Game design is experiential and analytical — students learn best by analyzing games they've played and prototyping simple systems. At the intermediate level, shift from "what makes games fun" to "how do I systematically create specific experiences." The MDA framework provides a formal lens for this shift. Teaching should balance concrete examples (Tetris, chess, Dark Souls) with hands-on design exercises. This topic is visual and interactive — encourage sketching systems, mapping dynamics, and rapid paper prototyping.

## Common Misconceptions

1. **"Aesthetics means graphics and art style"**
   - Why students get this wrong: In common usage, "aesthetics" refers to visual beauty
   - How to correct: Use the original MDA paper's language — "aesthetics" = emotional responses. Show how ugly games (Dwarf Fortress) can have strong aesthetics (discovery, challenge) and beautiful games (Gone Home) might prioritize narrative over challenge. Emphasize the 8 types of fun taxonomy early.

2. **"Good mechanics automatically make a good game"**
   - Why students get this wrong: Mechanics are tangible and easy to discuss; dynamics and aesthetics are emergent and harder to pin down
   - How to correct: Show examples of mechanically interesting games that fail (too complex, no clear aesthetic goal). Compare Tic-Tac-Toe (solved, boring) to Chess (same mechanics family, endless depth). Emphasize that mechanics serve aesthetics.

3. **"More features = better game"**
   - Why students get this wrong: Students conflate scope with quality; commercial games have many features
   - How to correct: Use counter-examples like Flappy Bird, 2048, or Wordle — minimal mechanics, strong dynamics. Introduce the concept of "elegant design" and "design restraint." Show how adding mechanics can dilute focus.

4. **"Randomness ruins skill-based games"**
   - Why students get this wrong: They've experienced frustrating randomness (Mario Kart blue shells) and conflate all randomness as luck-based
   - How to correct: Distinguish input randomness (card draws before you decide) from output randomness (dice after you commit). Show how poker, XCOM, and Slay the Spire use randomness to create meaningful decisions. Explain variance vs expected value.

5. **"Balanced games are symmetrical"**
   - Why students get this wrong: Symmetry is the obvious path to balance (Chess, Go, sports)
   - How to correct: Show asymmetric balance in StarCraft (three distinct races), fighting games (unique characters), Dead by Daylight (1v4). Explain that balance means "no dominant strategy," not "identical options."

6. **"Difficulty and challenge are the same thing"**
   - Why students get this wrong: Both involve overcoming obstacles
   - How to correct: Distinguish arbitrary difficulty (cheap deaths, unfair mechanics) from the challenge aesthetic (meaningful obstacles, mastery curves). Use Dark Souls (fair, teaches mastery) vs. QWOP (frustrating, random) as contrasts.

7. **"Emergence just happens"**
   - Why students get this wrong: Famous emergent games (Minecraft, SimCity) make it look accidental
   - How to correct: Show how emergence is designed — Minecraft's crafting tree, Dwarf Fortress's simulation depth. Compare Conway's Game of Life (simple rules, engineered for emergence) to random cellular automata (no interesting patterns). Emergence requires intention.

8. **"Playtesting is for finding bugs"**
   - Why students get this wrong: They've only experienced QA-style testing
   - How to correct: Reframe playtesting as observing dynamics and aesthetics. Show examples of playtest feedback that revealed dynamic issues (dominant strategies, runaway loops, unclear goals). Teach "watch, don't explain."

9. **"The designer's intent is what matters"**
   - Why students get this wrong: They think of games like authored novels
   - How to correct: Show how players "complete" games through interpretation (speedruns, challenge runs, role-playing). Discuss player agency and co-creation. Reference the "death of the author" in game design — dynamics are what players experience, not what you intended.

10. **"Narrative and mechanics should be separate"**
    - Why students get this wrong: Many games have thin narratives pasted onto gameplay
    - How to correct: Introduce ludonarrative dissonance (Bioshock's "would you kindly," Uncharted's mass murder). Show positive examples where mechanics reinforce narrative (Papers Please, This War of Mine, Undertale). Mechanics can tell stories.

11. **"Copying mechanics is bad design"**
    - Why students get this wrong: Fear of plagiarism from writing classes
    - How to correct: Explain that game design is combinatorial — new games remix existing mechanics into new dynamics and aesthetics. Show how Slay the Spire combines deckbuilding (Dominion) + roguelike (Binding of Isaac). Originality comes from new combinations and aesthetic goals.

12. **"Players want what they say they want"**
    - Why students get this wrong: Surveys and forums are direct feedback
    - How to correct: Teach "revealed preferences" — watch what players do, not what they say. Show examples where player requests would ruin the game (making Dark Souls easier, removing random crits from TF2). Distinguish between frustration (problem) and challenge (goal).

## Level Adjustments

**Beginner level** would focus on identifying mechanics, dynamics, and aesthetics in existing games — descriptive analysis. Avoid deep systems thinking, prototyping, or design iteration.

**Intermediate level** (this curriculum) focuses on applying the MDA framework to analyze and critique games, then designing simple systems for specific aesthetic goals. Students should prototype, playtest, and iterate. Formalism is introduced (the original MDA paper) but application is prioritized over theory. Students learn to reverse-engineer design intent and identify coherence/dissonance.

**Advanced level** would add:
- Multi-layered systems (economies, progression, narrative integration)
- Production constraints (scoping, monetization, accessibility)
- Formal design methods (balancing spreadsheets, simulation testing)
- Player psychology and motivation theory (Bartle types, Self-Determination Theory)
- Genre-specific deep dives (4X strategy, fighting games, narrative games)
- Ethical considerations (addiction mechanics, dark patterns, representation)

At intermediate, keep examples concrete and grounded. Avoid overwrought theory or production details (budgets, pipelines, engines). Focus on the core loop: analyze → prototype → test → iterate.

## Rabbit Holes (When to Deploy)

1. **Flow Theory (Csikszentmihalyi)** — Drop in around Lesson 16 (Dark Souls difficulty) or Lesson 19 (Candy Crush submission). Connects difficulty curves to psychological research on optimal challenge.

2. **Bartle's Player Types** — Drop in around Lesson 18 (aesthetics introduction). Provides an orthogonal taxonomy: achievers seek challenge, explorers seek discovery, socializers seek fellowship, killers seek competition. Complements the 8 types of fun.

3. **Game Theory (Nash Equilibria)** — Drop in around Lesson 9 (randomness) or Lesson 15 (meaningful choices). Shows formal math behind competitive balance, but clarify that MDA is experiential, not mathematical.

4. **Procedural Rhetoric (Ian Bogost)** — Drop in around Lesson 26 (ludonarrative dissonance). Games make arguments through their mechanics (McDonald's Videogame, Spent). Heavy topic but mind-expanding.

5. **The Skinner Box & Ethics** — Drop in around Lesson 19 (Candy Crush). Variable reward schedules create compulsion. Leads to discussion of ethical game design vs. exploitation (loot boxes, gacha games).

6. **Speedrunning as Emergent Play** — Drop in around Lesson 12 (player agency). Speedrunners find strategies designers never intended (sequence breaking, glitch exploitation). Shows limits of designer control.

7. **Economic Systems (EVE Online, WoW)** — Drop in around Lesson 8 (resource economies). Real-world economic principles (inflation, market manipulation) in virtual worlds. Some EVE players are professional economists.

8. **Metagame Evolution** — Drop in around Lesson 25 (MDA analysis). How competitive games evolve over time (Magic: The Gathering meta shifts, fighting game tier lists). Dynamics change as players master systems.

9. **Accessibility & Universal Design** — Drop in anywhere after Lesson 18 (aesthetics). How mechanics can include/exclude players (colorblind modes, difficulty options, input remapping). Challenges the "designer intent" mindset.

10. **Genre Conventions as Mechanics** — Drop in around Lesson 5 (action space). Why shooters use WASD+mouse, why RPGs have inventory screens. Conventions are mechanics players already know.

## Difficulty Progression Notes

**Early difficulty (Lessons 1-3)**: Start at 2/5 — accessible but not trivial. Students are reviewing games they've played through a new lens (MDA). No prototyping yet, just analysis.

**First peak (Lessons 6, 9)**: Hit 3-4/5 in Mechanics module. Concepts like dominant strategies and randomness types require systems thinking. This is where students transition from casual players to designers.

**Review valleys (Lessons 7, 14, 21, 28)**: Drop to 1-2/5. Reviews consolidate learning and give breathing room. Lesson 7 = mechanics review, Lesson 14 = dynamics review, Lesson 21 = aesthetics review, Lesson 28 = full MDA review.

**Second peak (Lessons 13, 16)**: Hit 4/5 in Dynamics module. Feedback loops and difficulty curves are abstract and counterintuitive. Students must think several moves ahead.

**Aesthetics plateau (Lessons 18-24)**: Hold steady at 2-3/5. Aesthetics are more intuitive than dynamics — students have felt these emotions. Focus on articulating and designing for them.

**Final peak (Lesson 26)**: Hit 5/5 with ludonarrative dissonance. This is the capstone concept requiring integration of all three layers plus critical thinking. Students must identify subtle contradictions between mechanics and aesthetics.

**Culmination (Lesson 27)**: Drop to 4/5 for playtesting exercise. High difficulty but hands-on, not abstract. Students apply everything they've learned.

## Assessment Strategies

1. **MDA Analysis Essays** — Students write 500-word analyses of existing games using MDA framework. Assess: Can they identify mechanics? Trace mechanics → dynamics? Connect dynamics → aesthetics? Grade on depth, not on whether they "got it right."

2. **Design Pitch** — Students propose a game concept starting with aesthetic goal and working backward to mechanics. Assess: Is the aesthetic clear? Do the mechanics plausibly produce the intended dynamics? Is it coherent?

3. **Mechanic Iteration Exercise** — Give students a simple broken mechanic. They playtest, identify problems, propose fixes, test again. Assess: Can they observe dynamics? Identify root causes? Propose targeted fixes?

4. **8 Types of Fun Mapping** — Students play a game and map it to the 8 types. Then propose mechanical changes to shift the aesthetic profile. Assess: Do they understand the taxonomy? Can they trace mechanics → aesthetics?

5. **Teach-Back Lessons** — Students explain a concept (Lessons 10, 17, 24) or demonstrate a prototype. Assess: Can they articulate their design intent? Did they achieve it? Can they accept critique?

6. **Real-World Analysis** — Students analyze why specific games work (Tetris, Dark Souls, Journey). Assess: Depth of analysis, use of MDA vocabulary, insight beyond obvious observations.

7. **Ludonarrative Critique** — Advanced assessment. Students identify and explain a case of ludonarrative dissonance in a game. Assess: Can they see contradictions between mechanics and narrative/aesthetics? Can they propose fixes?

Avoid: Trivia (who created MDA?), rote memorization (list the 8 types), subjective taste ("is this game good?"). Focus on application and analysis.

## Pacing Notes

- **Weeks 1-2 (Lessons 1-7)**: Foundations + Mechanics. Introduce MDA lens and dive into mechanical thinking. Students are still in "player mode" — be patient with the shift to "designer mode."

- **Weeks 3-4 (Lessons 8-14)**: Deep Mechanics + Dynamics. This is where it gets hard. Emergence and feedback loops are abstract. Use lots of examples. Encourage system mapping exercises.

- **Weeks 5-6 (Lessons 15-21)**: Finish Dynamics + Start Aesthetics. Aesthetics feel easier after dynamics — students relax. Use this momentum to introduce the 8 types and start design exercises.

- **Week 7 (Lessons 22-28)**: Deep Aesthetics + Integration. Final sprint. Ludonarrative dissonance is the capstone. Playtesting exercise brings everything together. End on a review to consolidate.

Total: ~7 weeks at 4 lessons/week, or ~4 weeks at 6-7 lessons/week. Adjust based on student pace.

## Special Considerations

- **Non-gamers**: If student has limited game experience, they may struggle with examples. Ask about their favorite games and use those as anchors. Board games, card games, and sports all work with MDA.

- **Programmer mindset**: Students with coding backgrounds may over-focus on mechanics (the code) and under-value aesthetics (the experience). Push them to articulate emotional goals first.

- **Artist mindset**: Students with art/design backgrounds may conflate visual aesthetics with MDA aesthetics. Clarify early and often.

- **Competitive gamers**: Students from esports/speedrunning may fixate on challenge and optimization. Broaden their aesthetic palette — show games that prioritize narrative, fellowship, or expression.

- **Paper prototyping resistance**: Some students want to jump to digital tools. Explain that paper is faster for iteration and focuses on systems, not implementation. Use examples of professional studios paper prototyping (Valve, Blizzard).
